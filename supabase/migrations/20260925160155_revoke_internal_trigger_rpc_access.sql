begin;
-- Event triggers are internal and must not be exposed as callable client RPCs.
revoke all on function public.rls_auto_enable() from public,anon,authenticated;
notify pgrst,'reload schema';
commit;
