import { createClient } from 'npm:@supabase/supabase-js@2'

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'content-type, apikey, authorization',
  'Access-Control-Allow-Methods':'POST, OPTIONS'
}
function json(b:unknown,s=200){return new Response(JSON.stringify(b),{status:s,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})}
function adminKey(){const legacy=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';if(legacy)return legacy;try{const x=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');return x.default||''}catch(_){return ''}}
async function hex(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function idOk(s:string){return /^[0-9a-f-]{36}$/i.test(s)}
async function session(sb:any,token:string){if(!token)return null;const th=await hex(token);const r=await sb.from('zad_admin_sessions').select('admin_id').eq('token_hash',th).gt('expires_at',new Date().toISOString()).maybeSingle();if(r.error)throw r.error;if(r.data)await sb.from('zad_admin_sessions').update({last_used_at:new Date().toISOString()}).eq('token_hash',th);return r.data?{...r.data,token_hash:th}:null}
async function ensureProfile(sb:any,u:any){const q=await sb.from('profiles').select('id').eq('id',u.id).maybeSingle();if(q.error)throw q.error;if(!q.data){const display=String(u.user_metadata?.display_name||u.user_metadata?.username||u.email?.split('@')[0]||'مستخدم زاد الإسلام').slice(0,80);const i=await sb.from('profiles').insert({id:u.id,display_name:display,username:u.user_metadata?.username||null});if(i.error)throw i.error}}

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
  if(req.method!=='POST')return json({error:'method_not_allowed'},405)
  try{
    const body=await req.json().catch(()=>({}))
    const action=String(body?.action||'list')
    const token=String(body?.token||'')
    const url=Deno.env.get('SUPABASE_URL')||''
    const key=adminKey()
    if(!url||!key)return json({error:'server_config_error',message:'إعدادات الخادم غير مكتملة.'},500)

    const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
    const sess=await session(sb,token)
    if(!sess)return json({error:'unauthorized',message:'انتهت جلسة الإدارة. سجّل الدخول مرة أخرى.'},401)

    if(action==='list'){
      const q=String(body?.q||'').trim().toLowerCase()
      const au=await sb.auth.admin.listUsers({page:1,perPage:1000})
      if(au.error)throw au.error
      const authUsers=au.data?.users||[]
      const ids=authUsers.map((u:any)=>u.id)
      const profiles=ids.length?await sb.from('profiles').select('id,username,display_name,avatar_url,created_at,updated_at,account_status,ban_reason,banned_at,force_logout_at').in('id',ids):{data:[],error:null}
      if(profiles.error)throw profiles.error
      const pmap=new Map((profiles.data||[]).map((p:any)=>[p.id,p]))
      const counts=new Map<string,number>()
      const ipCounts=new Map<string,number>()
      const activeIpBans=new Set<string>()
      if(ids.length){
        const [v,links,bans]=await Promise.all([
          sb.from('zad_talk_submissions').select('submitter_user_id').in('submitter_user_id',ids),
          sb.from('zad_user_ip_links').select('user_id,ip_hash').in('user_id',ids),
          sb.from('zad_ip_bans').select('user_id').eq('is_active',true).in('user_id',ids)
        ])
        if(!v.error)for(const r of v.data||[])if(r.submitter_user_id)counts.set(r.submitter_user_id,(counts.get(r.submitter_user_id)||0)+1)
        if(!links.error)for(const r of links.data||[])if(r.user_id)ipCounts.set(r.user_id,(ipCounts.get(r.user_id)||0)+1)
        if(!bans.error)for(const r of bans.data||[])if(r.user_id)activeIpBans.add(r.user_id)
      }
      let users=authUsers.map((a:any)=>{
        const p:any=pmap.get(a.id)||{}
        const authBanned=!!(a.banned_until&&new Date(a.banned_until).getTime()>Date.now())
        return {id:a.id,email:a.email||null,username:p.username||a.user_metadata?.username||null,display_name:p.display_name||a.user_metadata?.display_name||a.user_metadata?.username||a.email?.split('@')[0]||'مستخدم زاد الإسلام',avatar_url:p.avatar_url||null,created_at:p.created_at||a.created_at,updated_at:p.updated_at||a.updated_at,account_status:(p.account_status==='banned'||authBanned)?'banned':'active',ban_reason:p.ban_reason||null,banned_at:p.banned_at||null,force_logout_at:p.force_logout_at||null,video_count:counts.get(a.id)||0,ip_count:ipCounts.get(a.id)||0,known_ip_count:ipCounts.get(a.id)||0,ip_banned:activeIpBans.has(a.id)}
      })
      if(q)users=users.filter((u:any)=>[u.username,u.display_name,u.email,u.id].some(v=>String(v||'').toLowerCase().includes(q)))
      users.sort((a:any,b:any)=>String(b.created_at||'').localeCompare(String(a.created_at||'')))
      return json({ok:true,users,total:au.data?.total||users.length})
    }

    const id=String(body?.user_id||'')
    if(!idOk(id))return json({error:'invalid_user',message:'معرّف الحساب غير صالح.'},400)
    const reason=String(body?.reason||'').trim().slice(0,500)||null

    const gu=await sb.auth.admin.getUserById(id)
    const authUser=gu.data?.user||null
    if((gu.error||!authUser)&&!['delete','delete_and_ban_ip'].includes(action))return json({error:'user_not_found',message:'الحساب غير موجود أو تم حذفه بالفعل.'},404)

    if(action==='kick'){
      await ensureProfile(sb,authUser)
      const r=await sb.from('profiles').update({force_logout_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',id)
      if(r.error)throw r.error
      return json({ok:true,action,id,message:'تم تسجيل خروج الحساب من واجهة زاد الإسلام.'})
    }

    if(action==='ban'||action==='ban_ip'){
      await ensureProfile(sb,authUser)
      const ipr=await sb.rpc('zad_set_user_ip_ban',{p_user_id:id,p_admin_id:sess.admin_id,p_reason:reason,p_active:true})
      if(ipr.error)throw new Error(`ip_ban_failed:${ipr.error.message}`)
      const now=new Date().toISOString()
      const r=await sb.from('profiles').update({account_status:'banned',ban_reason:reason,banned_at:now,force_logout_at:now,updated_at:now}).eq('id',id)
      if(r.error)throw r.error
      const a=await sb.auth.admin.updateUserById(id,{ban_duration:'876000h'} as any)
      if(a.error)throw a.error
      return json({ok:true,action:'ban_ip',id,ip_ban_count:Number(ipr.data||0),message:Number(ipr.data||0)>0?`تم حظر الحساب وحظر ${Number(ipr.data||0)} عنوان IP مرتبط به.`:'تم حظر الحساب. سيُحظر أي IP مرتبط به بمجرد تسجيله عبر فحص الوصول.'})
    }

    if(action==='unban'||action==='unban_ip'){
      await ensureProfile(sb,authUser)
      const ipr=await sb.rpc('zad_set_user_ip_ban',{p_user_id:id,p_admin_id:sess.admin_id,p_reason:null,p_active:false})
      if(ipr.error)throw new Error(`ip_unban_failed:${ipr.error.message}`)
      const r=await sb.from('profiles').update({account_status:'active',ban_reason:null,banned_at:null,updated_at:new Date().toISOString()}).eq('id',id)
      if(r.error)throw r.error
      const a=await sb.auth.admin.updateUserById(id,{ban_duration:'none'} as any)
      if(a.error)throw a.error
      return json({ok:true,action:'unban',id,message:'تم فك حظر الحساب وكل عناوين IP المرتبطة به.'})
    }

    if(action==='delete'||action==='delete_and_ban_ip'){
      const keepIpBan=action==='delete_and_ban_ip'

      if(keepIpBan){
        const ipr=await sb.rpc('zad_set_user_ip_ban',{p_user_id:id,p_admin_id:sess.admin_id,p_reason:reason,p_active:true})
        if(ipr.error)throw new Error(`ip_ban_failed:${ipr.error.message}`)
      }else{
        const ipr=await sb.rpc('zad_set_user_ip_ban',{p_user_id:id,p_admin_id:sess.admin_id,p_reason:null,p_active:false})
        if(ipr.error)console.warn('ip_unban_before_delete',ipr.error.message)
      }

      const subs=await sb.from('zad_talk_submissions').select('id,storage_path').eq('submitter_user_id',id)
      if(subs.error)throw subs.error
      const mediaPaths=(subs.data||[]).map((x:any)=>String(x.storage_path||'')).filter(Boolean)
      let avatarPaths:string[]=[]
      try{const ls=await sb.storage.from('zad-profile-avatars').list(id,{limit:1000});if(!ls.error&&ls.data?.length)avatarPaths=ls.data.map((x:any)=>`${id}/${x.name}`)}catch(_){}

      // Remove dependent public rows first so Auth hard-delete cannot be blocked by FKs.
      const cleanupOps=[
        sb.from('zad_talk_comments').delete().eq('user_id',id),
        sb.from('zad_talk_likes').delete().eq('actor_key',`u:${id}`),
        sb.from('zad_talk_share_events').delete().eq('user_id',id),
        sb.from('zad_talk_submissions').delete().eq('submitter_user_id',id)
      ]
      const cleanup=await Promise.all(cleanupOps)
      for(const x of cleanup)if(x.error)throw new Error(`cleanup_failed:${x.error.message}`)

      // For normal delete remove IP links; for delete+IP-ban preserve the ban rows but links can go.
      const linksDel=await sb.from('zad_user_ip_links').delete().eq('user_id',id)
      if(linksDel.error)throw linksDel.error

      const profileDel=await sb.from('profiles').delete().eq('id',id)
      if(profileDel.error)throw profileDel.error

      if(authUser){
        const a=await sb.auth.admin.deleteUser(id,false)
        if(a.error)throw new Error(`auth_delete_failed:${a.error.message}`)
      }

      if(mediaPaths.length){const rm=await sb.storage.from('zad-talk-media').remove(mediaPaths);if(rm.error)console.warn('media_cleanup',rm.error.message)}
      if(avatarPaths.length){const rm=await sb.storage.from('zad-profile-avatars').remove(avatarPaths);if(rm.error)console.warn('avatar_cleanup',rm.error.message)}

      return json({ok:true,action,id,deleted:true,message:keepIpBan?'تم حذف الحساب نهائيًا مع استمرار حظر عناوين IP المرتبطة به.':'تم حذف الحساب وبياناته نهائيًا.'})
    }

    return json({error:'invalid_action',message:'العملية المطلوبة غير معروفة.'},400)
  }catch(e:any){
    console.error('zad-admin-users',e)
    return json({error:'server_error',message:`تعذر تنفيذ إدارة الحساب الآن${e?.message?`: ${String(e.message).slice(0,180)}`:''}`},500)
  }
})
