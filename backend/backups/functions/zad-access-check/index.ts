import { createClient } from 'npm:@supabase/supabase-js@2'

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'content-type, apikey, authorization',
  'Access-Control-Allow-Methods':'POST, OPTIONS'
}
function json(b:unknown,s=200){return new Response(JSON.stringify(b),{status:s,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})}
function adminKey(){const legacy=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';if(legacy)return legacy;try{const x=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');return x.default||''}catch(_){return ''}}
function clientIp(req:Request){let raw=(req.headers.get('x-forwarded-for')||req.headers.get('cf-connecting-ip')||'').split(',')[0].trim();if(raw.startsWith('::ffff:'))raw=raw.slice(7);return raw||'unknown'}
async function sha(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
  if(req.method!=='POST')return json({error:'method_not_allowed'},405)
  try{
    const url=Deno.env.get('SUPABASE_URL')||''
    const key=adminKey()
    if(!url||!key)return json({error:'server_config_error'},500)
    const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})

    const ip=clientIp(req)
    const ip_hash=ip==='unknown'?null:await sha(ip)

    // Block an already-banned IP before any site/account work.
    if(ip_hash){
      const b=await sb.from('zad_ip_bans').select('ip_hash,reason').eq('ip_hash',ip_hash).eq('is_active',true).maybeSingle()
      if(b.error)throw b.error
      if(b.data)return json({ok:false,blocked:true,scope:'ip',reason:b.data.reason||null,message:'تم حظر هذا الاتصال من زاد الإسلام.'},403)
    }

    const auth=req.headers.get('authorization')||''
    const token=auth.toLowerCase().startsWith('bearer ')?auth.slice(7).trim():''
    let user:any=null
    if(token){
      const u=await sb.auth.getUser(token)
      if(!u.error&&u.data?.user)user=u.data.user
    }

    if(user){
      const p=await sb.from('profiles').select('account_status,ban_reason').eq('id',user.id).maybeSingle()
      if(p.error)throw p.error

      if(p.data?.account_status==='banned'){
        // Critical: learn and immediately ban the current IP even when this is
        // the first time we have seen this banned account from that address.
        if(ip_hash){
          const now=new Date().toISOString()
          const link=await sb.from('zad_user_ip_links').upsert({user_id:user.id,ip_hash,last_seen_at:now},{onConflict:'user_id,ip_hash'})
          if(link.error)console.warn('ip_link_banned_user',link.error.message)
          const ban=await sb.from('zad_ip_bans').upsert({ip_hash,user_id:user.id,reason:p.data?.ban_reason||null,banned_at:now,banned_by:null,is_active:true},{onConflict:'ip_hash'})
          if(ban.error)throw ban.error
        }
        return json({ok:false,blocked:true,scope:'account_and_ip',reason:p.data?.ban_reason||null,message:'هذا الحساب وهذا الاتصال محظوران من زاد الإسلام.'},403)
      }

      if(ip_hash){
        const l=await sb.from('zad_user_ip_links').upsert({user_id:user.id,ip_hash,last_seen_at:new Date().toISOString()},{onConflict:'user_id,ip_hash'})
        if(l.error)console.warn('ip_link',l.error.message)
      }
    }

    return json({ok:true,blocked:false,logged_in:!!user})
  }catch(e){
    console.error('zad-access-check',e)
    return json({error:'server_error',message:'تعذر التحقق من الوصول الآن.'},500)
  }
})

