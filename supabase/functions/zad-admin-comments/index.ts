import {serve,admin,fail,checked,page} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
 await admin(sb,body.token,req);
 if(body.action==='hide'||body.action==='delete'){
  if(!Number.isSafeInteger(body.comment_id)||body.comment_id<=0)fail(400,'invalid_comment');
  const rows=checked(await sb.from('zad_talk_comments').update({status:'hidden',updated_at:new Date().toISOString()}).eq('id',body.comment_id).select('id'));
  if(!rows.length)fail(404,'comment_not_found');return {ok:true,hidden:true};
 }
 if(body.action&&body.action!=='list')fail(400,'invalid_action');
 const offset=page(body.offset,0,100000);let q=sb.from('zad_talk_comments').select('id,submission_id,user_id,body,status,parent_comment_id,created_at,zad_talk_submissions(title)').order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+29);
 if(typeof body.q==='string'&&body.q.trim())q=q.ilike('body','%'+body.q.trim().slice(0,100).replace(/[\\%_]/g,'\\$&')+'%');
 const rows=checked(await q);const ids=[...new Set(rows.map((r:any)=>r.user_id))];
 const profiles=ids.length?checked(await sb.from('profiles').select('id,username,display_name,avatar_url').in('id',ids)):[];
 return {ok:true,comments:rows.map((r:any)=>({...r,profile:profiles.find((p:any)=>p.id===r.user_id)||null})),next_offset:offset+rows.length,has_more:rows.length===30};
});
