import {serve,admin,fail,checked,uuid,verifyVideo,validPath} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
  const who=await admin(sb,body.token,req);
  if(!uuid(body.id)||!['approve','reject','delete'].includes(body.action))fail(400,'invalid_request');
  const row=checked(await sb.from('zad_talk_submissions').select('*').eq('id',body.id).maybeSingle());
  if(!row)fail(404,'not_found');
  if(body.action==='delete'){
    if(row.storage_path){if(!validPath(row))fail(409,'invalid_storage_path');checked(await sb.storage.from('zad-talk-media').remove([row.storage_path]));}
    checked(await sb.from('zad_talk_submissions').delete().eq('id',row.id));
  }else{
    if(!['pending','approved','rejected'].includes(row.status))fail(409,'invalid_status');
    const now=new Date().toISOString();let patch:any;
    if(body.action==='approve'){
      if(row.submitter_user_id){const p=checked(await sb.from('profiles').select('account_status').eq('id',row.submitter_user_id).maybeSingle());if(!p||p.account_status!=='active')fail(403,'account_banned');}
      await verifyVideo(sb,row);
      patch={status:'approved',rejection_reason:null,published_at:row.published_at||now,upload_verified_at:now};
    }else patch={status:'rejected',rejection_reason:typeof body.reason==='string'?body.reason.trim().slice(0,500)||null:null,published_at:null};
    const changed=checked(await sb.from('zad_talk_submissions').update({...patch,reviewed_at:now,reviewed_by:who.admin_id}).eq('id',row.id).eq('status',row.status).select('id'));
    if(!changed.length)fail(409,'invalid_status');
  }
  return {ok:true,id:row.id,action:body.action};
});
