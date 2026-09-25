import { createClient } from 'npm:@supabase/supabase-js@2.110.8';

export class HttpError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}
export const fail = (status: number, code: string): never => { throw new HttpError(status, code); };
export const checked = (r: any) => { if (r.error) throw r.error; return r.data; };
export const uuid = (v: unknown) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export const hash = async (v: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)))).map(x=>x.toString(16).padStart(2,'0')).join('');
export const page = (v: unknown, fallback: number, max: number) => Number.isSafeInteger(v) && Number(v)>=0 ? Math.min(Number(v),max) : fallback;
export const MAX_VIDEO = 50*1024*1024;
export const VIDEO_TYPES: Record<string,string> = {'video/mp4':'mp4','video/webm':'webm','video/quicktime':'mov','video/x-m4v':'m4v'};

export function serviceClient() {
  const url=Deno.env.get('SUPABASE_URL');
  let key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!key) { try { key=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default; } catch { /* handled below */ } }
  if(!url||!key) fail(500,'server_config_error');
  return createClient(url!,key!,{auth:{persistSession:false,autoRefreshToken:false}});
}

function cors(req: Request): Record<string,string> {
  const origin=req.headers.get('origin');
  const allowed=new Set(['https://zad-el-islam.github.io','https://abuhurira-mz.github.io']);
  if(origin && !allowed.has(origin) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(origin)) fail(403,'origin_not_allowed');
  return {'Vary':'Origin',...(origin?{'Access-Control-Allow-Origin':origin}:{}),
    'Access-Control-Allow-Headers':'content-type, apikey, authorization, x-client-info',
    'Access-Control-Allow-Methods':'POST, OPTIONS'};
}

async function readBody(req: Request) {
  const reader=req.body?.getReader();
  if(!reader)return {};
  let text='',size=0;const decoder=new TextDecoder();
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;
    if(size>16384){await reader.cancel();fail(413,'request_too_large');}text+=decoder.decode(value,{stream:true});}
  try { const b=JSON.parse(text+decoder.decode()||'{}');if(!b||Array.isArray(b)||typeof b!=='object')fail(400,'invalid_request');return b; }
  catch { fail(400,'invalid_json'); }
}

export function serve(fn: (req: Request,sb: any,body: any)=>Promise<any>) {
  Deno.serve(async(req: Request)=>{
    let headers: Record<string,string>={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
    try {
      headers={...headers,...cors(req)};
      if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
      if(req.method!=='POST')fail(405,'method_not_allowed');
      const body=await readBody(req);
      const data=await fn(req,serviceClient(),body);
      return new Response(JSON.stringify(data),{status:200,headers});
    }catch(e){
      const known=e instanceof HttpError;
      if(!known)console.error('backend_request_failed',e instanceof Error?e.name:'database_or_storage_error');
      return new Response(JSON.stringify({ok:false,error:known?e.code:'server_error'}),{status:known?e.status:500,headers});
    }
  });
}

export async function checkIp(req: Request,sb: any) {
  const raw=(req.headers.get('x-forwarded-for')||req.headers.get('cf-connecting-ip')||'').split(',')[0].trim().replace(/^::ffff:/,'');
  if(!raw)return null;
  const ip=await hash(raw);
  if(checked(await sb.from('zad_ip_bans').select('ip_hash').eq('ip_hash',ip).eq('is_active',true).maybeSingle()))fail(403,'ip_banned');
  return ip;
}

export async function user(req: Request,sb: any,required=true) {
  const ip=await checkIp(req,sb);
  const header=req.headers.get('authorization')||'';
  if(!header){if(required)fail(401,'login_required');return {user:null,profile:null,ip};}
  const token=header.match(/^Bearer (\S+)$/i)?.[1];
  if(!token)fail(401,'unauthorized');
  const r=await sb.auth.getUser(token);
  if(r.error||!r.data?.user)fail(401,'unauthorized');
  let claims:any;
  try { claims=JSON.parse(atob(token!.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); } catch { fail(401,'unauthorized'); }
  if(!uuid(claims.session_id)||claims.sub!==r.data.user.id)fail(401,'unauthorized');
  const profile=checked(await sb.from('profiles').select('id,username,display_name,avatar_url,account_status,force_logout_at').eq('id',r.data.user.id).maybeSingle());
  if(!profile)fail(403,'profile_not_found');
  if(profile.account_status!=='active')fail(403,'account_banned');
  if(!checked(await sb.rpc('zad_validate_user_session',{p_user_id:r.data.user.id,p_session_id:claims.session_id})))fail(401,'session_expired');
  if(ip)checked(await sb.from('zad_user_ip_links').upsert({user_id:r.data.user.id,ip_hash:ip,last_seen_at:new Date().toISOString()},{onConflict:'user_id,ip_hash'}));
  return {user:r.data.user,profile,ip};
}

export async function admin(sb: any,token: unknown) {
  if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))fail(401,'unauthorized');
  const rows=checked(await sb.rpc('zad_admin_validate_session',{p_token:token}));
  const row=Array.isArray(rows)?rows[0]:rows;
  if(!row?.admin_id)fail(401,'unauthorized');
  return row;
}

export function validPath(row: any) {
  if(!uuid(row.id)||typeof row.storage_path!=='string')return false;
  const parts=row.storage_path.split('/');
  // Keep legacy paths readable; every newly issued upload uses owner/id/video.ext.
  const tail=parts.length===2&&parts[0]===row.id ? parts[1] : parts.length===3&&parts[0]===row.submitter_user_id&&parts[1]===row.id ? parts[2] : '';
  return /^video\.(mp4|webm|mov|m4v)$/.test(tail);
}

export function videoSignature(bytes: Uint8Array,mime: string) {
  const ascii=(a:number,b:number)=>new TextDecoder().decode(bytes.slice(a,b));
  if(mime==='video/webm')return bytes.length>=32&&bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3&&ascii(4,1024).includes('webm');
  if(bytes.length<32||ascii(4,8)!=='ftyp')return false;
  const size=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(0);
  if(size<16||size>bytes.length||size%4!==0)return false;
  const brands=[ascii(8,12)];for(let i=16;i<size;i+=4)brands.push(ascii(i,i+4));
  if(mime==='video/quicktime')return brands.includes('qt  ');
  return ['video/mp4','video/x-m4v'].includes(mime)&&brands.some(b=>/^(isom|iso[2-9]|mp4[12]|avc1|M4V |MSNV|dash)$/.test(b));
}

export async function verifyVideo(sb: any,row: any) {
  if(!validPath(row))fail(400,'invalid_storage_path');
  if(!VIDEO_TYPES[row.mime_type]||!Number.isSafeInteger(Number(row.file_size))||row.file_size<=0||row.file_size>MAX_VIDEO)fail(400,'invalid_file_metadata');
  const path=row.storage_path;const split=path.lastIndexOf('/');const folder=path.slice(0,split),file=path.slice(split+1);
  const list=checked(await sb.storage.from('zad-talk-media').list(folder,{search:file,limit:10}));
  const object=list?.find((x:any)=>x.name===file);
  if(!object)fail(400,'file_not_found');
  const meta=object.metadata||{};
  if(Number(meta.size)!==Number(row.file_size)||String(meta.mimetype||'').toLowerCase()!==row.mime_type)fail(400,'file_metadata_mismatch');
  const signed=checked(await sb.storage.from('zad-talk-media').createSignedUrl(path,60));
  const response=await fetch(signed.signedUrl,{headers:{Range:'bytes=0-65535'},signal:AbortSignal.timeout(15000)});
  if(!response.ok||!response.body)fail(400,'file_unreadable');
  const reader=response.body.getReader();const chunks:Uint8Array[]=[];let length=0;
  try { while(length<65536){const {done,value}=await reader.read();if(done)break;const part=value.slice(0,65536-length);chunks.push(part);length+=part.length;} }
  finally { await reader.cancel(); }
  const bytes=new Uint8Array(length);let pos=0;for(const c of chunks){bytes.set(c,pos);pos+=c.length;}
  if(!videoSignature(bytes,row.mime_type))fail(400,'invalid_video_content');
  return {size:Number(meta.size),mime:row.mime_type};
}

export async function deleteUser(sb: any,id: string) {
  const rows=checked(await sb.from('zad_talk_submissions').select('id,submitter_user_id,storage_path').eq('submitter_user_id',id).limit(1001));
  if(rows.length>1000)fail(409,'delete_requires_batch');
  const paths=rows.filter((r:any)=>r.storage_path).map((r:any)=>{if(!validPath(r))fail(409,'invalid_storage_path');return r.storage_path;});
  if(paths.length)checked(await sb.storage.from('zad-talk-media').remove(paths));
  const avatars=checked(await sb.storage.from('zad-profile-avatars').list(id,{limit:1000}));
  if(avatars?.length)checked(await sb.storage.from('zad-profile-avatars').remove(avatars.map((f:any)=>`${id}/${f.name}`)));
  checked(await sb.from('zad_talk_submissions').delete().eq('submitter_user_id',id));
  checked(await sb.from('zad_talk_likes').delete().eq('actor_key',`u:${id}`));
  checked(await sb.auth.admin.deleteUser(id,false));
}
