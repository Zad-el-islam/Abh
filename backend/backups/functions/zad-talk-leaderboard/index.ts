import { createClient } from 'npm:@supabase/supabase-js@2'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey, authorization','Access-Control-Allow-Methods':'POST, OPTIONS'}
function json(b:unknown,s=200){return new Response(JSON.stringify(b),{status:s,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})}
function adminKey(){const legacy=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';if(legacy)return legacy;try{const x=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');return x.default||''}catch(_){return ''}}
function clientIp(req:Request){let raw=(req.headers.get('x-forwarded-for')||req.headers.get('cf-connecting-ip')||'').split(',')[0].trim();if(raw.startsWith('::ffff:'))raw=raw.slice(7);return raw||'unknown'}
async function sha(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return json({error:'method_not_allowed'},405)
 try{
  const body=await req.json().catch(()=>({}));const limit=Math.min(20,Math.max(3,Number(body?.limit||10)||10));const url=Deno.env.get('SUPABASE_URL')||'';const key=adminKey();if(!url||!key)return json({error:'server_config_error'},500);const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const ipRaw=clientIp(req);if(ipRaw!=='unknown'){const ipHash=await sha(ipRaw);const b=await sb.from('zad_ip_bans').select('ip_hash').eq('ip_hash',ipHash).eq('is_active',true).maybeSingle();if(b.error)throw b.error;if(b.data)return json({error:'ip_banned',message:'تم حظر هذا الاتصال من زاد الإسلام.'},403)}
  const r=await sb.rpc('zad_talk_engagement_leaderboard',{p_limit:limit});if(r.error)throw r.error;return json({ok:true,users:r.data||[],formula:'likes + 2×comments + 2×shares + 3×approved videos'})
 }catch(e){console.error('zad-talk-leaderboard',e);return json({error:'server_error',message:'تعذر تحميل ترتيب زاد توك الآن.'},500)}
})
