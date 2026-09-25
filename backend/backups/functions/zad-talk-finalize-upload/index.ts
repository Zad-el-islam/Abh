import { createClient } from 'npm:@supabase/supabase-js@2'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey, authorization','Access-Control-Allow-Methods':'POST, OPTIONS'}
function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})}
function adminKey(){const legacy=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';if(legacy)return legacy;try{const x=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');return x.default||''}catch(_){return ''}}
function clientIp(req:Request){let raw=(req.headers.get('x-forwarded-for')||req.headers.get('cf-connecting-ip')||'').split(',')[0].trim();if(raw.startsWith('::ffff:'))raw=raw.slice(7);return raw||'unknown'}
async function sha256(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return json({error:'method_not_allowed'},405)
 const origin=req.headers.get('origin')||'';const allowedOrigins=new Set(['https://zad-el-islam.github.io','https://abuhurira-mz.github.io']);if(origin&&origin!=='null'&&!allowedOrigins.has(origin)&&!origin.startsWith('http://localhost')&&!origin.startsWith('http://127.0.0.1'))return json({error:'origin_not_allowed'},403)
 try{
  const body=await req.json();const id=String(body?.id||'');const receipt=String(body?.receipt||'');if(!/^[0-9a-f-]{36}$/i.test(id)||receipt.length<32)return json({error:'invalid_request'},400)
  const url=Deno.env.get('SUPABASE_URL')||'';const key=adminKey();if(!url||!key)return json({error:'server_config_error',message:'إعدادات خادم الرفع غير مكتملة.'},500);const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const ipRaw=clientIp(req);if(ipRaw!=='unknown'){const ipHash=await sha256(ipRaw);const b=await admin.from('zad_ip_bans').select('ip_hash').eq('ip_hash',ipHash).eq('is_active',true).maybeSingle();if(b.error)throw b.error;if(b.data)return json({error:'ip_banned',message:'تم حظر هذا الاتصال من زاد الإسلام.'},403)}
  const {data:row,error}=await admin.from('zad_talk_submissions').select('id,status,storage_path,upload_receipt_hash,upload_expires_at').eq('id',id).maybeSingle();if(error)throw new Error(`submission_lookup_failed:${error.message}`);if(!row)return json({error:'not_found'},404);if(row.status==='pending')return json({ok:true,status:'pending'});if(row.status!=='uploading')return json({error:'invalid_status'},409);if(!row.upload_expires_at||new Date(row.upload_expires_at).getTime()<Date.now())return json({error:'upload_expired'},410);if(await sha256(receipt)!==row.upload_receipt_hash)return json({error:'invalid_receipt'},403)
  const path=String(row.storage_path||'');const parts=path.split('/');const file=parts.pop()||'';const folder=parts.join('/');const {data:list,error:listErr}=await admin.storage.from('zad-talk-media').list(folder,{search:file,limit:10});if(listErr)throw new Error(`storage_check_failed:${listErr.message}`);if(!list?.some((x:any)=>x.name===file))return json({error:'file_not_found'},400)
  const {error:upErr}=await admin.from('zad_talk_submissions').update({status:'pending',upload_completed_at:new Date().toISOString()}).eq('id',id).eq('status','uploading');if(upErr)throw new Error(`submission_finalize_failed:${upErr.message}`)
  return json({ok:true,status:'pending',message:'تم إرسال الفيديو للمراجعة.'})
 }catch(e){console.error('zad-talk-finalize-upload',e);return json({error:'server_error',message:'تعذر إنهاء إرسال الفيديو للمراجعة.'},500)}
})
