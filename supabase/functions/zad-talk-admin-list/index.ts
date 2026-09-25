import {serve,admin,fail,checked,page} from '../_shared/runtime.ts';
serve(async(_req,sb,body)=>{
  await admin(sb,body.token);
  const status=body.status||'pending',offset=page(body.offset,0,100000),limit=Math.max(1,page(body.limit,100,100));
  if(!['all','uploading','pending','approved','rejected'].includes(status))fail(400,'invalid_status');
  let q=sb.from('zad_talk_submissions').select('id,title,description,submitter_name,submitter_user_id,media_kind,storage_path,original_file_name,mime_type,file_size,status,rejection_reason,created_at,reviewed_at,published_at,upload_verified_at').order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+limit-1);
  if(status!=='all')q=q.eq('status',status);
  const rows=checked(await q)||[],items=[];
  for(const row of rows){let media_url=null;if(row.storage_path){const s=await sb.storage.from('zad-talk-media').createSignedUrl(row.storage_path,1800);media_url=s.data?.signedUrl||null;}items.push({...row,media_url});}
  return {ok:true,items,next_offset:offset+rows.length,has_more:rows.length===limit};
});
