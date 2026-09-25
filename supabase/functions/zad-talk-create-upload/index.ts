import {serve,user,fail,checked,hash,MAX_VIDEO,VIDEO_TYPES} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
  const who=await user(req,sb);
  const title=typeof body.title==='string'?body.title.trim():'';
  const original=typeof body.file_name==='string'?body.file_name.trim():'';
  const mime=typeof body.mime_type==='string'?body.mime_type.toLowerCase():'';
  const size=body.file_size;
  if(title.length<2||title.length>140)fail(400,'title_required');
  if(!original||original.length>180)fail(400,'file_required');
  if(!VIDEO_TYPES[mime])fail(400,'unsupported_video_type');
  if(!Number.isSafeInteger(size)||size<=0||size>MAX_VIDEO)fail(400,'file_too_large');
  const since=new Date(Date.now()-3600000).toISOString();
  const rate=await sb.from('zad_talk_submissions').select('id',{count:'exact',head:true}).eq('submitter_user_id',who.user.id).gte('created_at',since);
  checked(rate);if((rate.count||0)>=8)fail(429,'rate_limited');
  if(who.ip){const r=await sb.from('zad_talk_upload_attempts').select('id',{count:'exact',head:true}).eq('ip_hash',who.ip).gte('created_at',since);checked(r);if((r.count||0)>=8)fail(429,'rate_limited');}
  const receipt=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');
  const id=crypto.randomUUID(),path=`${who.user.id}/${id}/video.${VIDEO_TYPES[mime]}`;
  const expires=new Date(Date.now()+2*3600000).toISOString();
  checked(await sb.from('zad_talk_submissions').insert({id,title,submitter_name:who.profile.username||who.profile.display_name,submitter_user_id:who.user.id,media_kind:'video',storage_path:path,original_file_name:original,mime_type:mime,file_size:size,status:'uploading',upload_receipt_hash:await hash(receipt),upload_expires_at:expires}));
  const signed=await sb.storage.from('zad-talk-media').createSignedUploadUrl(path,{upsert:false});
  if(signed.error){checked(await sb.from('zad_talk_submissions').delete().eq('id',id).eq('status','uploading'));throw signed.error;}
  if(who.ip)checked(await sb.from('zad_talk_upload_attempts').insert({ip_hash:who.ip,submission_id:id}));
  return {ok:true,id,path,token:signed.data.token,receipt,expires_at:expires};
});
