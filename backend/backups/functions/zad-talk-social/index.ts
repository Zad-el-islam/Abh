import { createClient } from 'npm:@supabase/supabase-js@2'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey, authorization','Access-Control-Allow-Methods':'POST, OPTIONS'}
function json(b:unknown,s=200){return new Response(JSON.stringify(b),{status:s,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})}
function adminKey(){const legacy=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';if(legacy)return legacy;try{const x=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');return x.default||''}catch(_){return ''}}
function clientIp(req:Request){let raw=(req.headers.get('x-forwarded-for')||req.headers.get('cf-connecting-ip')||'').split(',')[0].trim();if(raw.startsWith('::ffff:'))raw=raw.slice(7);return raw||'unknown'}
async function sha(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function idOk(s:string){return /^[0-9a-f-]{36}$/i.test(s)}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return json({error:'method_not_allowed'},405)
 try{
  const body=await req.json().catch(()=>({}));const action=String(body?.action||'stats');const id=String(body?.id||'');if(!idOk(id))return json({error:'invalid_id'},400)
  const url=Deno.env.get('SUPABASE_URL')||'';const key=adminKey();if(!url||!key)return json({error:'server_config_error'},500);const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const ipRaw=clientIp(req);const ipHash=ipRaw==='unknown'?null:await sha(ipRaw)
  if(ipHash){const b=await sb.from('zad_ip_bans').select('ip_hash').eq('ip_hash',ipHash).eq('is_active',true).maybeSingle();if(b.error)throw b.error;if(b.data)return json({error:'ip_banned',message:'تم حظر هذا الاتصال من زاد الإسلام.'},403)}
  const authHeader=req.headers.get('authorization')||'';const token=authHeader.toLowerCase().startsWith('bearer ')?authHeader.slice(7).trim():'';let user:any=null;let profile:any=null
  if(token){try{const u=await sb.auth.getUser(token);if(!u.error){user=u.data?.user||null;if(user){const p=await sb.from('profiles').select('username,display_name,avatar_url,account_status').eq('id',user.id).maybeSingle();profile=p.data||null;if(profile?.account_status==='banned')return json({error:'account_banned',message:'هذا الحساب موقوف من إدارة الموقع.'},403);if(ipHash){const l=await sb.from('zad_user_ip_links').upsert({user_id:user.id,ip_hash:ipHash,last_seen_at:new Date().toISOString()},{onConflict:'user_id,ip_hash'});if(l.error)console.warn('ip_link',l.error.message)}}}}catch(_){}}
  const actor=user?.id?`u:${user.id}`:`i:${ipHash||await sha('unknown')}`
  const clip=await sb.from('zad_talk_submissions').select('id,status,share_count').eq('id',id).maybeSingle();if(clip.error||!clip.data||clip.data.status!=='approved')return json({error:'not_found'},404)
  if(action==='like'){
   const existing=await sb.from('zad_talk_likes').select('submission_id').eq('submission_id',id).eq('actor_key',actor).maybeSingle();if(existing.error)throw existing.error;let liked=false
   if(existing.data){const del=await sb.from('zad_talk_likes').delete().eq('submission_id',id).eq('actor_key',actor);if(del.error)throw del.error}else{const ins=await sb.from('zad_talk_likes').insert({submission_id:id,actor_key:actor});if(ins.error)throw ins.error;liked=true}
   const count=await sb.from('zad_talk_likes').select('*',{count:'exact',head:true}).eq('submission_id',id);if(count.error)throw count.error;return json({ok:true,liked,like_count:count.count||0})
  }
  if(action==='share'){
   const x=await sb.rpc('zad_talk_increment_share',{p_id:id});if(x.error)throw x.error;const ev=await sb.from('zad_talk_share_events').upsert({submission_id:id,actor_key:actor,user_id:user?.id||null},{onConflict:'submission_id,actor_key',ignoreDuplicates:true});if(ev.error)console.warn('share_event',ev.error.message);return json({ok:true,share_count:Number(x.data||0)})
  }
  if(action==='comment'){
   if(!user)return json({error:'login_required',message:'سجّل الدخول أولًا لإضافة تعليق.'},401);const text=String(body?.comment||'').trim().replace(/\s+/g,' ').slice(0,500);if(!text)return json({error:'comment_required',message:'اكتب التعليق أولًا.'},400)
   const username=String(profile?.username||profile?.display_name||user.user_metadata?.username||user.user_metadata?.display_name||'مستخدم زاد الإسلام').trim().slice(0,50)||'مستخدم زاد الإسلام';const ins=await sb.from('zad_talk_comments').insert({submission_id:id,user_id:user.id,username,body:text}).select('id,user_id,username,body,created_at').single();if(ins.error)throw ins.error
   const count=await sb.from('zad_talk_comments').select('*',{count:'exact',head:true}).eq('submission_id',id).eq('status','visible');if(count.error)throw count.error;return json({ok:true,comment:{...ins.data,avatar_url:profile?.avatar_url||null},comment_count:count.count||0})
  }
  if(action==='comments'){
   const q=await sb.from('zad_talk_comments').select('id,user_id,username,body,created_at').eq('submission_id',id).eq('status','visible').order('created_at',{ascending:false}).limit(50);if(q.error)throw q.error
   const ids=[...new Set((q.data||[]).map((x:any)=>x.user_id).filter(Boolean))];const pmap=new Map<string,any>();if(ids.length){const p=await sb.from('profiles').select('id,username,display_name,avatar_url,account_status').in('id',ids);if(!p.error)for(const x of p.data||[])pmap.set(x.id,x)}
   const comments=(q.data||[]).filter((x:any)=>pmap.get(x.user_id)?.account_status!=='banned').map((x:any)=>{const p=pmap.get(x.user_id);return {...x,username:p?.username||p?.display_name||x.username,avatar_url:p?.avatar_url||null}});return json({ok:true,comments})
  }
  const [likes,comments,likedRow]=await Promise.all([sb.from('zad_talk_likes').select('*',{count:'exact',head:true}).eq('submission_id',id),sb.from('zad_talk_comments').select('*',{count:'exact',head:true}).eq('submission_id',id).eq('status','visible'),sb.from('zad_talk_likes').select('submission_id').eq('submission_id',id).eq('actor_key',actor).maybeSingle()]);if(likes.error)throw likes.error;if(comments.error)throw comments.error;if(likedRow.error)throw likedRow.error
  return json({ok:true,like_count:likes.count||0,comment_count:comments.count||0,share_count:Number(clip.data.share_count||0),liked:!!likedRow.data,logged_in:!!user})
 }catch(e){console.error('zad-talk-social',e);return json({error:'server_error',message:'تعذر تنفيذ التفاعل الآن.'},500)}
})
