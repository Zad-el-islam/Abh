import {serve,admin,fail,checked,uuid,deleteUser} from '../_shared/runtime.ts';
serve(async(_req,sb,body)=>{
  const who=await admin(sb,body.token);
  const action=body.action||'list';
  if(action==='list'){
    const q=typeof body.q==='string'?body.q.trim().toLowerCase().slice(0,100):'';
    const users=checked(await sb.rpc('zad_admin_users_page',{p_query:q,p_offset:Number.isSafeInteger(body.offset)?Math.max(0,body.offset):0,p_limit:Number.isSafeInteger(body.limit)?Math.max(1,Math.min(1000,body.limit)):1000}));
    return {ok:true,...users};
  }
  if(!['kick','ban','ban_ip','unban','unban_ip','delete','delete_and_ban_ip'].includes(action)||!uuid(body.user_id))fail(400,'invalid_request');
  const id=body.user_id,reason=typeof body.reason==='string'?body.reason.trim().slice(0,500)||null:null;
  const target=await sb.auth.admin.getUserById(id);
  if(target.error||!target.data?.user)fail(404,'user_not_found');
  if(action==='delete'||action==='delete_and_ban_ip'){
    checked(await sb.rpc('zad_set_user_ip_ban',{p_user_id:id,p_admin_id:who.admin_id,p_reason:reason,p_active:action==='delete_and_ban_ip'}));
    await deleteUser(sb,id);
    return {ok:true,action,id,deleted:true};
  }
  const now=new Date().toISOString();
  if(action==='kick'){
    checked(await sb.from('profiles').update({force_logout_at:now,updated_at:now}).eq('id',id));
    checked(await sb.rpc('zad_revoke_user_sessions',{p_user_id:id}));
    return {ok:true,action,id};
  }
  const banned=action==='ban'||action==='ban_ip';
  const count=checked(await sb.rpc('zad_set_user_ip_ban',{p_user_id:id,p_admin_id:who.admin_id,p_reason:reason,p_active:banned}));
  checked(await sb.auth.admin.updateUserById(id,{ban_duration:banned?'876000h':'none'}));
  checked(await sb.from('profiles').update(banned?{account_status:'banned',ban_reason:reason,banned_at:now,force_logout_at:now,updated_at:now}:{account_status:'active',ban_reason:null,banned_at:null,updated_at:now}).eq('id',id));
  if(banned)checked(await sb.rpc('zad_revoke_user_sessions',{p_user_id:id}));
  return {ok:true,action:banned?'ban_ip':'unban',id,ip_ban_count:Number(count||0)};
});
