import {serve,user,fail,checked,uuid,page} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
  await user(req,sb,false);
  const id=body.id||'',offset=page(body.offset,0,100000),limit=Math.max(1,page(body.limit,4,8));
  if(id&&!uuid(id))fail(400,'invalid_id');
  if(body.user_id&&!uuid(body.user_id))fail(400,'invalid_id');
  let publicProfile=null;
  if(body.user_id){publicProfile=checked(await sb.from('profiles').select('id,username,display_name,avatar_url').eq('id',body.user_id).eq('account_status','active').maybeSingle());if(!publicProfile)fail(404,'not_found');}
  let q=sb.from('zad_talk_submissions').select('id,title,description,submitter_name,submitter_user_id,storage_path,published_at').eq('status','approved').order('published_at',{ascending:false}).order('id',{ascending:false});
  if(body.user_id)q=q.eq('submitter_user_id',body.user_id);
  q=id?q.eq('id',id).limit(1):q.range(offset,offset+limit-1);
  const rows=checked(await q)||[];
  const ids=[...new Set(rows.map((r:any)=>r.submitter_user_id).filter(Boolean))];
  const profiles=ids.length?checked(await sb.from('profiles').select('id,username,display_name,avatar_url,account_status').in('id',ids)):[];
  const byId=new Map(profiles.map((p:any)=>[p.id,p]));const items=[];
  for(const row of rows){
    const p:any=byId.get(row.submitter_user_id);
    if(!row.storage_path||(row.submitter_user_id&&(!p||p.account_status!=='active')))continue;
    const signed=await sb.storage.from('zad-talk-media').createSignedUrl(row.storage_path,300);
    if(signed.error||!signed.data?.signedUrl)continue;
    items.push({...row,creator_user_id:row.submitter_user_id||null,creator_name:p?.display_name||p?.username||row.submitter_name||null,creator_username:p?.username||null,creator_avatar:p?.avatar_url||null,media_url:signed.data.signedUrl});
  }
  return {ok:true,profile:publicProfile,items,next_offset:id?offset:offset+rows.length,has_more:!id&&rows.length===limit};
});
