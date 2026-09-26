import {serve,fail,checked,hash,admin,user,serviceClient} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
  if(body.action==='me'){const who=await admin(sb,body.token,req);return {ok:true,...who};}
  if(body.action==='logout'){
    if(typeof body.token!=='string'||!/^[a-f0-9]{64}$/.test(body.token))fail(400,'invalid_request');
    checked(await sb.from('zad_admin_sessions').delete().eq('token_hash',await hash(body.token)));
    return {ok:true};
  }
  if(!['login','account_login'].includes(body.action))fail(400,'invalid_action');
  const username=typeof body.username==='string'?body.username.trim():'';
  const password=typeof body.password==='string'?body.password:'';
  if(!username||username.length>80||!password||password.length>256)fail(400,'invalid_request');
  const ip=await hash((req.headers.get('x-forwarded-for')||req.headers.get('cf-connecting-ip')||'unknown').split(',')[0].trim());
  const since=new Date(Date.now()-15*60000).toISOString();
  const [byIp,byName]=await Promise.all([
    sb.from('zad_admin_login_attempts').select('id',{count:'exact',head:true}).eq('success',false).gte('created_at',since).eq('ip',ip),
    sb.from('zad_admin_login_attempts').select('id',{count:'exact',head:true}).eq('success',false).gte('created_at',since).ilike('username',username.replace(/[\\%_]/g,'\\$&'))]);
  checked(byIp);checked(byName);if(Math.max(byIp.count||0,byName.count||0)>=8)fail(429,'rate_limited');
  const result=body.action==='account_login'?null:checked(await sb.rpc('zad_admin_verify',{p_username:username,p_password:password}));
  const row=Array.isArray(result)?result[0]:result;
  if(!row?.admin_id){
    // Resolve private emails only on the server; never add them to the public username lookup.
    const profile=checked(await sb.from('profiles').select('id').ilike('username',username.replace(/[\\%_]/g,'\\$&')).maybeSingle());
    const found=profile?await sb.auth.admin.getUserById(profile.id):null;
    const email=found?.data?.user?.email;
    const signed=email?await serviceClient().auth.signInWithPassword({email,password}):null;
    const session=signed?.data?.session;
    checked(await sb.from('zad_admin_login_attempts').insert({ip,username,success:!!session}));
    if(!session)fail(401,'invalid_credentials');
    const headers=new Headers(req.headers);headers.set('Authorization','Bearer '+session.access_token);
    const who=await user(new Request(req.url,{headers}),sb);
    if(body.action==='login'&&who.role==='user')fail(403,'staff_required');
    return {ok:true,auth_session:session,role:who.role,admin_display_name:who.profile.display_name};
  }
  checked(await sb.from('zad_admin_login_attempts').insert({ip,username,success:true}));
  const token=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');
  const expires=new Date(Date.now()+12*3600000).toISOString();
  checked(await sb.from('zad_admin_sessions').insert({token_hash:await hash(token),admin_id:row.admin_id,expires_at:expires}));
  return {ok:true,role:'admin',session_token:token,admin_display_name:row.display_name||row.username,expires_at:expires};
});
