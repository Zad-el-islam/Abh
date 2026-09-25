begin;
create or replace function public.zad_admin_users_page(p_query text default '',p_offset integer default 0,p_limit integer default 1000)
returns jsonb language sql stable security definer set search_path = '' as $$
 with matching as (
  select u.id,u.email,p.username,p.display_name,p.avatar_url,
   coalesce(p.created_at,u.created_at) as created_at,coalesce(p.updated_at,u.updated_at) as updated_at,
   case when p.account_status='banned' or u.banned_until>now() then 'banned' else 'active' end as account_status,
   p.ban_reason,p.banned_at,p.force_logout_at
  from auth.users u left join public.profiles p on p.id=u.id
  where coalesce(p_query,'')='' or strpos(lower(concat_ws(' ',p.username,p.display_name,u.email,u.id::text)),lower(left(p_query,100)))>0
 ), paged as (
  select m.*,
   (select count(*) from public.zad_talk_submissions s where s.submitter_user_id=m.id) as video_count,
   (select count(*) from public.zad_user_ip_links l where l.user_id=m.id) as ip_count,
   exists(select 1 from public.zad_ip_bans b where b.user_id=m.id and b.is_active=true) as ip_banned
  from matching m order by m.created_at desc,m.id desc
  offset greatest(0,least(coalesce(p_offset,0),1000000)) limit greatest(1,least(coalesce(p_limit,1000),1000))
 ) select jsonb_build_object('users',coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc,p.id desc) from paged p),'[]'::jsonb),
  'total',(select count(*) from matching),'next_offset',greatest(0,least(coalesce(p_offset,0),1000000))+(select count(*) from paged),
  'has_more',(select count(*) from matching)>greatest(0,least(coalesce(p_offset,0),1000000))+(select count(*) from paged));
$$;
revoke all on function public.zad_admin_users_page(text,integer,integer) from public,anon,authenticated;
grant execute on function public.zad_admin_users_page(text,integer,integer) to service_role;
create index if not exists zad_ip_bans_user_idx on public.zad_ip_bans(user_id) where user_id is not null;
notify pgrst,'reload schema';
commit;
