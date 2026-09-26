-- Extend the existing staff table. Absence of an active membership means USER.
begin;
alter table public.zad_admins add column if not exists user_id uuid references auth.users(id) on delete restrict;
alter table public.zad_admins add column if not exists role text not null default 'admin' check(role in ('owner','admin','moderator'));
create unique index if not exists zad_admins_auth_user on public.zad_admins(user_id) where user_id is not null;
create unique index if not exists zad_one_owner on public.zad_admins(role) where role='owner';
do $$ begin if not exists(select 1 from pg_constraint where conrelid='public.zad_admins'::regclass and conname='zad_owner_requires_auth') then alter table public.zad_admins add constraint zad_owner_requires_auth check(role<>'owner' or (user_id is not null and is_active)); end if; end $$;

create or replace function zad_private.protect_owner_membership() returns trigger language plpgsql set search_path='' as $$
begin
 if current_user in ('postgres','supabase_admin') and current_setting('zad.owner_maintenance',true)='on' then
  if TG_OP='DELETE' then return old; else return new; end if;
 end if;
 if TG_OP='DELETE' then
  if old.role='owner' then raise exception 'owner_protected'; end if; return old;
 end if;
 if TG_OP='UPDATE' and old.role='owner' and (new.role<>old.role or new.user_id is distinct from old.user_id or not new.is_active or new.id<>old.id) then raise exception 'owner_protected'; end if;
 if new.role='owner' and (TG_OP='INSERT' or old.role<>'owner') and current_user not in ('postgres','supabase_admin') then raise exception 'owner_bootstrap_requires_database_operator'; end if;
 return new;
end $$;
drop trigger if exists zad_protect_owner on public.zad_admins;
create trigger zad_protect_owner before insert or update or delete on public.zad_admins for each row execute function zad_private.protect_owner_membership();

create or replace function zad_private.protect_owner_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if exists(select 1 from public.zad_admins where user_id=old.id and role='owner') then
  if TG_OP='DELETE' then raise exception 'owner_protected'; end if;
  if new.account_status<>'active' or new.force_logout_at is distinct from old.force_logout_at or new.id<>old.id then raise exception 'owner_protected'; end if;
 end if;
 if TG_OP='DELETE' then return old; else return new; end if;
end $$;
drop trigger if exists zad_protect_owner_profile on public.profiles;
create trigger zad_protect_owner_profile before update or delete on public.profiles for each row execute function zad_private.protect_owner_profile();

create or replace function public.zad_set_staff_role(p_actor_id uuid,p_user_id uuid,p_role text) returns text
language plpgsql security definer set search_path='' as $$
declare p public.profiles;
begin
 -- Edge verifies the caller's live Auth session; this RPC is service-only.
 perform 1 from public.zad_admins where user_id=p_actor_id and role='owner' and is_active for update;
 if not found then raise exception 'owner_required'; end if;
 if p_role not in ('user','moderator','admin') then raise exception 'invalid_role'; end if;
 if exists(select 1 from public.zad_admins where user_id=p_user_id and role='owner') then raise exception 'owner_protected'; end if;
 select * into p from public.profiles where id=p_user_id for update;
 if not found then raise exception 'user_not_found'; end if;
 if p_role='user' then
  delete from public.zad_admins where user_id=p_user_id;
 else
  insert into public.zad_admins(user_id,username,display_name,password_hash,role,is_active)
  values(p.id,'auth:'||p.id::text,p.display_name,extensions.crypt(extensions.gen_random_uuid()::text,extensions.gen_salt('bf')),p_role,true)
  on conflict(user_id) where user_id is not null do update set role=excluded.role,is_active=true,updated_at=now();
 end if;
 return p_role;
end $$;
revoke all on function public.zad_set_staff_role(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.zad_set_staff_role(uuid,uuid,text) to service_role;

-- Auth-linked staff use Supabase Auth; legacy administrators retain their existing login.
create or replace function public.zad_admin_verify(p_username text,p_password text)
returns table(admin_id uuid,username text,display_name text) language sql security definer set search_path='' as $$
 select a.id,a.username,a.display_name from public.zad_admins a
 where a.is_active and a.user_id is null and lower(a.username)=lower(trim(p_username))
 and a.password_hash=extensions.crypt(p_password,a.password_hash) limit 1;
$$;

-- Comments reuse the existing table; existing rows remain unchanged.
alter table public.zad_talk_comments add column if not exists parent_comment_id bigint references public.zad_talk_comments(id) on delete cascade;
alter table public.zad_talk_comments add column if not exists updated_at timestamptz;
create index if not exists zad_comments_thread_page on public.zad_talk_comments(submission_id,parent_comment_id,created_at desc,id desc) where status='visible';
create index if not exists zad_comments_parent on public.zad_talk_comments(parent_comment_id);
create table if not exists public.zad_talk_comment_likes (
 comment_id bigint not null references public.zad_talk_comments(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),primary key(comment_id,user_id)
);
create index if not exists zad_comment_likes_user on public.zad_talk_comment_likes(user_id);
alter table public.zad_talk_comment_likes enable row level security;
revoke all on public.zad_talk_comment_likes from public,anon,authenticated;
grant select,insert,delete on public.zad_talk_comment_likes to service_role;

create or replace function zad_private.check_comment_parent() returns trigger language plpgsql set search_path='' as $$
declare parent public.zad_talk_comments;
begin
 if TG_OP='UPDATE' and (new.submission_id<>old.submission_id or new.user_id<>old.user_id or new.parent_comment_id is distinct from old.parent_comment_id) then raise exception 'immutable_comment_owner'; end if;
 if new.parent_comment_id is not null then
  select * into parent from public.zad_talk_comments where id=new.parent_comment_id for share;
  if not found or parent.parent_comment_id is not null or parent.submission_id<>new.submission_id or parent.id=new.id then raise exception 'invalid_reply_parent'; end if;
  if TG_OP='INSERT' and parent.status<>'visible' then raise exception 'parent_hidden'; end if;
 end if;
 return new;
end $$;
drop trigger if exists zad_comment_parent_guard on public.zad_talk_comments;
create trigger zad_comment_parent_guard before insert or update on public.zad_talk_comments for each row execute function zad_private.check_comment_parent();

create or replace function public.zad_visible_talk_comments(p_submission_id uuid)
returns setof public.zad_talk_comments language sql stable set search_path='' as $$
 select c.* from public.zad_talk_comments c join public.profiles p on p.id=c.user_id
 join public.zad_talk_submissions s on s.id=c.submission_id
 left join public.profiles publisher on publisher.id=s.submitter_user_id
 left join public.zad_talk_comments parent on parent.id=c.parent_comment_id
 left join public.profiles pp on pp.id=parent.user_id
 where c.submission_id=p_submission_id and c.status='visible' and p.account_status='active'
 and s.status='approved' and (s.submitter_user_id is null or publisher.account_status='active')
 and (c.parent_comment_id is null or (parent.status='visible' and pp.account_status='active'));
$$;
create or replace function public.zad_social_comment_page(p_submission_id uuid,p_actor_id uuid default null,p_parent_id bigint default null,p_offset integer default 0)
returns jsonb language sql stable set search_path='' as $$
 with visible as (select * from public.zad_visible_talk_comments(p_submission_id)),
 paged as (select * from visible where parent_comment_id is not distinct from p_parent_id order by created_at desc,id desc offset greatest(0,least(p_offset,100000)) limit 30),
 enriched as (select c.*,p.username as current_username,p.display_name,p.avatar_url,
  (select count(*) from public.zad_talk_comment_likes l where l.comment_id=c.id) as like_count,
  exists(select 1 from public.zad_talk_comment_likes l where l.comment_id=c.id and l.user_id=p_actor_id) as liked,
  (select count(*) from visible v where v.parent_comment_id=c.id) as reply_count,
  c.user_id=p_actor_id as can_delete
  from paged c join public.profiles p on p.id=c.user_id)
 select jsonb_build_object('comments',coalesce((select jsonb_agg(to_jsonb(e)||jsonb_build_object('username',e.current_username) order by e.created_at desc,e.id desc) from enriched e),'[]'::jsonb),
 'comment_count',(select count(*) from visible),'next_offset',greatest(0,least(p_offset,100000))+(select count(*) from paged),
 'has_more',(select count(*) from visible where parent_comment_id is not distinct from p_parent_id)>greatest(0,least(p_offset,100000))+(select count(*) from paged));
$$;
revoke all on function public.zad_visible_talk_comments(uuid), public.zad_social_comment_page(uuid,uuid,bigint,integer) from public,anon,authenticated;
grant execute on function public.zad_visible_talk_comments(uuid),public.zad_social_comment_page(uuid,uuid,bigint,integer) to service_role;
revoke all on function zad_private.protect_owner_membership(),zad_private.protect_owner_profile(),zad_private.check_comment_parent() from public,anon,authenticated;
commit;
