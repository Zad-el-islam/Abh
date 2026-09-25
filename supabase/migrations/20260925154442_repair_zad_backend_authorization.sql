-- Additive repair against the inspected production schema. No production rows are rewritten.
begin;
create schema if not exists zad_private;
revoke all on schema zad_private from public, anon;
grant usage on schema zad_private to authenticated, service_role;

create or replace function zad_private.session_allowed(p_user uuid, p_session text)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (
  select 1 from auth.sessions s
  join auth.users u on u.id=s.user_id
  join public.profiles p on p.id=s.user_id
  where s.user_id=p_user and s.id::text=p_session
    and p.account_status='active'
    and (u.banned_until is null or u.banned_until <= now())
    and (s.not_after is null or s.not_after > now())
    and (p.force_logout_at is null or s.created_at > p.force_logout_at)
 );
$$;
revoke all on function zad_private.session_allowed(uuid,text) from public,anon,authenticated;

create or replace function zad_private.current_session_allowed()
returns boolean language sql stable security definer set search_path = '' as $$
 select zad_private.session_allowed((select auth.uid()), (select auth.jwt()->>'session_id'));
$$;
revoke all on function zad_private.current_session_allowed() from public,anon;
grant execute on function zad_private.current_session_allowed() to authenticated;

-- Edge Functions must validate the Auth token with getUser BEFORE passing its claims here.
create or replace function public.zad_validate_user_session(p_user_id uuid,p_session_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
 select zad_private.session_allowed(p_user_id,p_session_id::text);
$$;
revoke all on function public.zad_validate_user_session(uuid,uuid) from public,anon,authenticated;
grant execute on function public.zad_validate_user_session(uuid,uuid) to service_role;

create or replace function public.zad_revoke_user_sessions(p_user_id uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
 delete from auth.sessions where user_id=p_user_id;
 get diagnostics n = row_count;
 return n;
end;
$$;
revoke all on function public.zad_revoke_user_sessions(uuid) from public,anon,authenticated;
grant execute on function public.zad_revoke_user_sessions(uuid) to service_role;

-- RLS does not protect TRUNCATE. Remove unnecessary default grants, retaining exact client grants.
revoke all on public.profiles, public.user_stats, public.point_events,
 public.username_login_map,public.zad_admins,public.zad_admin_sessions,
 public.zad_admin_login_attempts,public.zad_talk_upload_attempts,
 public.zad_talk_submissions,public.zad_talk_comments,public.zad_talk_likes,
 public.zad_talk_share_events,public.zad_user_ip_links,public.zad_ip_bans from anon,authenticated;
revoke update (display_name,avatar_url,updated_at) on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (display_name,avatar_url,updated_at) on public.profiles to authenticated;
alter policy "قراءة الملفات للمسجلين" on public.profiles
 using (id=(select auth.uid()) and (select zad_private.current_session_allowed()));
alter policy "تعديل المستخدم لملفه" on public.profiles
 using (id=(select auth.uid()) and (select zad_private.current_session_allowed()))
 with check (id=(select auth.uid()) and (select zad_private.current_session_allowed()));
alter policy "قراءة الإحصائيات للمسجلين" on public.user_stats
 using (user_id=(select auth.uid()) and (select zad_private.current_session_allowed()));
alter policy "قراءة المستخدم لسجل نقاطه" on public.point_events
 using (user_id=(select auth.uid()) and (select zad_private.current_session_allowed()));

alter policy zad_avatar_select_own on storage.objects using (
 bucket_id='zad-profile-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
 and (select zad_private.current_session_allowed()));
alter policy zad_avatar_insert_own on storage.objects with check (
 bucket_id='zad-profile-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
 and (select zad_private.current_session_allowed()));
alter policy zad_avatar_update_own on storage.objects using (
 bucket_id='zad-profile-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
 and (select zad_private.current_session_allowed())) with check (
 bucket_id='zad-profile-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
 and (select zad_private.current_session_allowed()));
alter policy zad_avatar_delete_own on storage.objects using (
 bucket_id='zad-profile-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
 and (select zad_private.current_session_allowed()));

alter table public.zad_talk_submissions add column if not exists upload_verified_at timestamptz;
create index if not exists zad_talk_approved_feed_idx on public.zad_talk_submissions (published_at desc,id desc) where status='approved';
create index if not exists zad_admin_failed_name_idx on public.zad_admin_login_attempts (lower(username),created_at desc) where success=false;
create index if not exists zad_talk_comments_user_id_idx on public.zad_talk_comments(user_id);

-- Disabled administrators cannot retain authority through an unexpired session.
create or replace function public.zad_admin_validate_session(p_token text)
returns table(admin_id uuid,username text,display_name text,expires_at timestamptz)
language sql security definer set search_path = '' as $$
 update public.zad_admin_sessions s set last_used_at=now()
 from public.zad_admins a
 where s.admin_id=a.id and a.is_active=true
   and s.token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex')
   and s.expires_at>now()
 returning s.admin_id,a.username,a.display_name,s.expires_at;
$$;
revoke all on function public.zad_admin_validate_session(text) from public,anon,authenticated;
grant execute on function public.zad_admin_validate_session(text) to service_role;

CREATE OR REPLACE FUNCTION public.zad_change_username(p_new_username text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
declare
  v_user_id uuid;
  v_username text;
begin
  v_user_id := auth.uid();
  v_username := trim(coalesce(p_new_username, ''));

  if v_user_id is null or not zad_private.current_session_allowed() then
    raise exception 'not_authenticated';
  end if;

  if char_length(v_username) < 3
     or char_length(v_username) > 24
     or v_username !~ '^[[:alnum:]_-]+$' then
    raise exception 'invalid_username';
  end if;

  if not exists (
    select 1
    from public.username_login_map m
    where m.user_id = v_user_id
  ) then
    raise exception 'username_account_required';
  end if;

  update public.profiles
  set username = v_username,
      display_name = v_username,
      updated_at = now()
  where id = v_user_id;

  if not found then
    raise exception 'profile_not_found';
  end if;

  return v_username;

exception
  when unique_violation then
    raise exception 'username_taken'
      using errcode = '23505';
end;
$function$;

CREATE OR REPLACE FUNCTION public.zad_get_my_season_stats()
 RETURNS TABLE(total_points integer, level integer, current_streak integer, lifetime_points integer, best_streak integer, season_activity integer, season_number integer, season_starts_on date, season_ends_on date)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or not zad_private.current_session_allowed() then
    raise exception 'not_authenticated';
  end if;

  perform public.zad_rollover_user(v_user_id);

  return query
  select
    us.total_points,
    us.level,
    us.current_streak,
    us.lifetime_points,
    us.best_streak,
    us.season_activity,
    us.season_number,
    cs.starts_on,
    cs.ends_on
  from public.user_stats us
  cross join public.zad_get_current_season() cs
  where us.user_id = v_user_id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.zad_claim_event(p_event_type text)
 RETURNS TABLE(total_points integer, level integer, current_streak integer, lifetime_points integer, best_streak integer, season_activity integer, season_number integer, season_starts_on date, season_ends_on date)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_today date := (timezone('Africa/Cairo', now()))::date;
  v_request text := trim(coalesce(p_event_type, ''));
  v_target_hizbs integer := 0;
  v_wird_points integer := 0;
  v_season integer;
  v_inserted integer := 0;
  v_season_streak integer := 0;
  v_lifetime_streak integer := 0;
begin
  if v_user_id is null or not zad_private.current_session_allowed() then
    raise exception 'not_authenticated';
  end if;

  v_target_hizbs := case v_request
    when 'daily_wird_1' then 1
    when 'daily_wird_2' then 2
    when 'daily_wird' then 1
    when 'wird_complete' then 1
    else 0
  end;

  v_wird_points := case
    when v_target_hizbs = 2 then 20
    when v_target_hizbs = 1 then 10
    else 0
  end;

  if v_target_hizbs = 0
     and v_request not in (
       'daily_zad',
       'daily_azkar_morning',
       'daily_azkar_evening'
     ) then
    raise exception 'invalid_event_type';
  end if;

  select s.season_number
  into v_season
  from public.zad_get_current_season() s;

  perform public.zad_rollover_user(v_user_id);

  -- اختيار ورد واحد فقط يوميًا: حزب أو حزبان.
  if v_target_hizbs > 0 then
    insert into public.point_events (
      user_id,
      event_type,
      points,
      event_date,
      season_number
    )
    select
      v_user_id,
      'daily_wird_choice',
      v_wird_points,
      v_today,
      v_season
    where not exists (
      select 1
      from public.point_events pe
      where pe.user_id = v_user_id
        and pe.event_date = v_today
        and pe.event_type in (
          'daily_wird_choice',
          'daily_wird_hizb_1',
          'daily_wird_hizb_2',
          'daily_wird'
        )
    )
    on conflict (user_id, event_type, event_date) do nothing;

    get diagnostics v_inserted = row_count;

    if v_inserted > 0 then
      perform public.zad_add_season_points(
        v_user_id,
        v_wird_points,
        1
      );
    end if;
  end if;

  -- زاد اليوم: 10 نقاط يوميًا.
  if v_request = 'daily_zad' then
    insert into public.point_events (
      user_id,
      event_type,
      points,
      event_date,
      season_number
    )
    values (
      v_user_id,
      'daily_zad',
      10,
      v_today,
      v_season
    )
    on conflict (user_id, event_type, event_date) do nothing;

    get diagnostics v_inserted = row_count;

    if v_inserted > 0 then
      perform public.zad_add_season_points(v_user_id, 10, 1);
    end if;
  end if;

  -- أذكار الصباح: 10 نقاط يوميًا.
  if v_request = 'daily_azkar_morning' then
    insert into public.point_events (
      user_id,
      event_type,
      points,
      event_date,
      season_number
    )
    values (
      v_user_id,
      'daily_azkar_morning',
      10,
      v_today,
      v_season
    )
    on conflict (user_id, event_type, event_date) do nothing;

    get diagnostics v_inserted = row_count;

    if v_inserted > 0 then
      perform public.zad_add_season_points(v_user_id, 10, 1);
    end if;
  end if;

  -- أذكار المساء: 10 نقاط يوميًا.
  if v_request = 'daily_azkar_evening' then
    insert into public.point_events (
      user_id,
      event_type,
      points,
      event_date,
      season_number
    )
    values (
      v_user_id,
      'daily_azkar_evening',
      10,
      v_today,
      v_season
    )
    on conflict (user_id, event_type, event_date) do nothing;

    get diagnostics v_inserted = row_count;

    if v_inserted > 0 then
      perform public.zad_add_season_points(v_user_id, 10, 1);
    end if;
  end if;

  -- مكافأة الورد مع زاد اليوم: 10 نقاط إضافية.
  if exists (
       select 1
       from public.point_events pe
       where pe.user_id = v_user_id
         and pe.event_date = v_today
         and pe.event_type in (
           'daily_wird_choice',
           'daily_wird_hizb_1',
           'daily_wird'
         )
     )
     and exists (
       select 1
       from public.point_events pe
       where pe.user_id = v_user_id
         and pe.event_date = v_today
         and pe.event_type = 'daily_zad'
     ) then

    insert into public.point_events (
      user_id,
      event_type,
      points,
      event_date,
      season_number
    )
    values (
      v_user_id,
      'daily_combo_wird_zad',
      10,
      v_today,
      v_season
    )
    on conflict (user_id, event_type, event_date) do nothing;

    get diagnostics v_inserted = row_count;

    if v_inserted > 0 then
      perform public.zad_add_season_points(v_user_id, 10, 0);
    end if;
  end if;

  -- مكافأة إتمام كل مهام اليوم: 20 نقطة إضافية.
  if exists (
       select 1
       from public.point_events pe
       where pe.user_id = v_user_id
         and pe.event_date = v_today
         and pe.event_type in (
           'daily_wird_choice',
           'daily_wird_hizb_1',
           'daily_wird'
         )
     )
     and exists (
       select 1
       from public.point_events pe
       where pe.user_id = v_user_id
         and pe.event_date = v_today
         and pe.event_type = 'daily_zad'
     )
     and exists (
       select 1
       from public.point_events pe
       where pe.user_id = v_user_id
         and pe.event_date = v_today
         and pe.event_type = 'daily_azkar_morning'
     )
     and exists (
       select 1
       from public.point_events pe
       where pe.user_id = v_user_id
         and pe.event_date = v_today
         and pe.event_type = 'daily_azkar_evening'
     ) then

    insert into public.point_events (
      user_id,
      event_type,
      points,
      event_date,
      season_number
    )
    values (
      v_user_id,
      'daily_all_tasks_bonus',
      20,
      v_today,
      v_season
    )
    on conflict (user_id, event_type, event_date) do nothing;

    get diagnostics v_inserted = row_count;

    if v_inserted > 0 then
      perform public.zad_add_season_points(v_user_id, 20, 0);
    end if;
  end if;

  -- تحديث الاستمرارية مع تحديد اسم الجدول لمنع خطأ best_streak.
  if v_target_hizbs > 0 then
    v_season_streak :=
      public.zad_calculate_season_streak(v_user_id, v_season);

    v_lifetime_streak :=
      public.zad_calculate_lifetime_streak(v_user_id);

    update public.user_stats as us
    set current_streak = v_season_streak,
        best_streak = greatest(
          us.best_streak,
          v_lifetime_streak
        ),
        updated_at = now()
    where us.user_id = v_user_id;
  end if;

  return query
  select
    us.total_points,
    us.level,
    us.current_streak,
    us.lifetime_points,
    us.best_streak,
    us.season_activity,
    us.season_number,
    cs.starts_on,
    cs.ends_on
  from public.user_stats as us
  cross join public.zad_get_current_season() as cs
  where us.user_id = v_user_id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.zad_get_today_wird_choice()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
  select case
    when not zad_private.current_session_allowed() then 0

    when exists (
      select 1
      from public.point_events pe
      where pe.user_id = auth.uid()
        and pe.event_date =
          (timezone('Africa/Cairo', now()))::date
        and pe.event_type = 'daily_wird_choice'
        and pe.points >= 20
    ) then 2

    when exists (
      select 1
      from public.point_events pe
      where pe.user_id = auth.uid()
        and pe.event_date =
          (timezone('Africa/Cairo', now()))::date
        and pe.event_type = 'daily_wird_choice'
    ) then 1

    when exists (
      select 1
      from public.point_events pe
      where pe.user_id = auth.uid()
        and pe.event_date =
          (timezone('Africa/Cairo', now()))::date
        and pe.event_type = 'daily_wird_hizb_2'
    ) then 2

    when exists (
      select 1
      from public.point_events pe
      where pe.user_id = auth.uid()
        and pe.event_date =
          (timezone('Africa/Cairo', now()))::date
        and pe.event_type in (
          'daily_wird_hizb_1',
          'daily_wird'
        )
    ) then 1

    else 0
  end;
$function$;

CREATE OR REPLACE FUNCTION public.zad_get_leaderboard(p_limit integer DEFAULT 100)
 RETURNS TABLE(display_name text, total_points integer, level integer, current_streak integer, season_activity integer, lifetime_points integer, season_number integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_limit integer;
  v_season integer;
begin
  v_limit := greatest(
    1,
    least(coalesce(p_limit, 100), 100)
  );

  select s.season_number
  into v_season
  from public.zad_get_current_season() s;

  return query
  select
    coalesce(
      nullif(trim(p.username), ''),
      nullif(trim(p.display_name), ''),
      'مستخدم زاد الروح'
    ),
    us.total_points,
    us.level,
    us.current_streak,
    us.season_activity,
    us.lifetime_points,
    us.season_number
  from public.user_stats us
  join public.profiles p
    on p.id = us.user_id
  where us.season_number = v_season and p.account_status='active'
  order by
    us.total_points desc,
    us.current_streak desc,
    us.season_activity desc,
    p.created_at asc
  limit v_limit;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_zad_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
declare
  v_username text;
begin
  v_username :=
    nullif(normalize(trim(new.raw_user_meta_data ->> 'username'), NFKC), '');

  if v_username is not null and (char_length(v_username) not between 3 and 24 or v_username !~ '^[[:alnum:]_-]+$') then
    raise exception 'invalid_username';
  end if;
  if new.email like 'u_%@users.zad-alrouh.invalid' and (v_username is null or new.email <> 'u_' || encode(extensions.digest('zad-alrouh:v1:' || lower(v_username),'sha256'),'hex') || '@users.zad-alrouh.invalid') then
    raise exception 'invalid_username_identifier';
  end if;

  insert into public.profiles (
    id,
    username,
    display_name
  )
  values (
    new.id,
    v_username,
    coalesce(
      nullif(
        trim(new.raw_user_meta_data ->> 'display_name'),
        ''
      ),
      v_username,
      'مستخدم زاد الروح'
    )
  )
  on conflict (id) do update
  set username = coalesce(
        excluded.username,
        public.profiles.username
      ),
      display_name = excluded.display_name,
      updated_at = now();

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  if v_username is not null
     and new.email like 'u_%@users.zad-alrouh.invalid' then

    insert into public.username_login_map (
      user_id,
      username_key,
      login_identifier
    )
    values (
      new.id,
      lower(v_username),
      new.email
    )
    on conflict (user_id) do update
    set username_key = excluded.username_key,
        login_identifier = excluded.login_identifier,
        updated_at = now();
  end if;

  return new;
end;
$function$;

revoke all on function public.handle_new_zad_user(), public.zad_sync_username_map() from public,anon,authenticated;
notify pgrst,'reload schema';
commit;
