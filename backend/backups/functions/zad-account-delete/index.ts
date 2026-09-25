import { createClient } from 'npm:@supabase/supabase-js@2'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey, authorization','Access-Control-Allow-Methods':'POST, OPTIONS'}
function json(b:unknown,s=200){return new Response(JSON.stringify(b),{status:s,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})}
function adminKey(){const legacy=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';if(legacy)return legacy;try{const x=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');return x.default||''}catch(_){return ''}}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({error:'method_not_allowed'},405);
 try{
  const auth=req.headers.get('authorization')||'';const token=auth.toLowerCase().startsWith('bearer ')?auth.slice(7).trim():'';
  if(!token)return json({error:'unauthorized',message:'سجّل الدخول أولًا.'},401);
  const url=Deno.env.get('SUPABASE_URL')||'';const key=adminKey();if(!url||!key)return json({error:'server_config_error'},500);
  const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const u=await sb.auth.getUser(token);if(u.error||!u.data?.user)return json({error:'unauthorized',message:'انتهت الجلسة. سجّل الدخول مرة أخرى.'},401);
  const id=u.data.user.id;
  try{await sb.from('zad_talk_likes').delete().eq('actor_key',`u:${id}`)}catch(_){}
  try{const files=await sb.storage.from('zad-profile-avatars').list(id,{limit:100});if(!files.error&&files.data?.length)await sb.storage.from('zad-profile-avatars').remove(files.data.map((x:any)=>`${id}/${x.name}`))}catch(_){}
  const del=await sb.auth.admin.deleteUser(id);if(del.error)throw del.error;
  return json({ok:true,deleted:true});
 }catch(e){console.error('zad-account-delete',e);return json({error:'server_error',message:'تعذر حذف الحساب الآن. حاول مرة أخرى لاحقًا.'},500)}
})
