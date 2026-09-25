import {serve,user,fail,checked,hash,uuid,verifyVideo} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
  const who=await user(req,sb);
  if(!uuid(body.id)||typeof body.receipt!=='string'||!/^[a-f0-9]{64}$/.test(body.receipt))fail(400,'invalid_request');
  const row=checked(await sb.from('zad_talk_submissions').select('*').eq('id',body.id).maybeSingle());
  if(!row)fail(404,'not_found');
  if(row.submitter_user_id!==who.user.id||await hash(body.receipt)!==row.upload_receipt_hash)fail(403,'invalid_receipt');
  if(row.status==='pending'&&row.upload_verified_at)return {ok:true,status:'pending'};
  if(row.status!=='uploading')fail(409,'invalid_status');
  if(!row.upload_expires_at||Date.parse(row.upload_expires_at)<Date.now())fail(410,'upload_expired');
  await verifyVideo(sb,row);
  const now=new Date().toISOString();
  const changed=checked(await sb.from('zad_talk_submissions').update({status:'pending',upload_completed_at:now,upload_verified_at:now}).eq('id',row.id).eq('submitter_user_id',who.user.id).eq('status','uploading').select('id'));
  if(!changed.length)fail(409,'invalid_status');
  return {ok:true,status:'pending'};
});
