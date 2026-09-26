import {serve,user,fail,checked,uuid,page} from '../_shared/runtime.ts';
const commentId=(v:unknown)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>0;
serve(async(req,sb,body)=>{
 const action=body.action||'stats',id=body.id;
 if(!uuid(id)||!['stats','like','share','comment','comments','comment_like','comment_delete'].includes(action))fail(400,'invalid_request');
 const who=await user(req,sb,!['stats','comments'].includes(action)),actor=who.user?`u:${who.user.id}`:null;
 const clip=checked(await sb.from('zad_talk_submissions').select('id,status,share_count,submitter_user_id').eq('id',id).maybeSingle());
 if(!clip||clip.status!=='approved')fail(404,'not_found');
 if(clip.submitter_user_id){const p=checked(await sb.from('profiles').select('account_status').eq('id',clip.submitter_user_id).maybeSingle());if(!p||p.account_status!=='active')fail(404,'not_found');}
 const comments=async(parent:number|null=null,offset=0)=>checked(await sb.rpc('zad_social_comment_page',{p_submission_id:id,p_actor_id:who.user?.id||null,p_parent_id:parent,p_offset:offset}));
 if(action==='like'){
  const exists=checked(await sb.from('zad_talk_likes').select('submission_id').eq('submission_id',id).eq('actor_key',actor).maybeSingle());
  const liked=typeof body.liked==='boolean'?body.liked:!exists;
  if(!liked)checked(await sb.from('zad_talk_likes').delete().eq('submission_id',id).eq('actor_key',actor));
  else checked(await sb.from('zad_talk_likes').upsert({submission_id:id,actor_key:actor},{onConflict:'submission_id,actor_key',ignoreDuplicates:true}));
  const count=await sb.from('zad_talk_likes').select('submission_id',{count:'exact',head:true}).eq('submission_id',id);checked(count);
  return {ok:true,liked,like_count:count.count||0};
 }
 if(action==='share'){
  const added=checked(await sb.from('zad_talk_share_events').upsert({submission_id:id,actor_key:actor,user_id:who.user.id},{onConflict:'submission_id,actor_key',ignoreDuplicates:true}).select('submission_id'));
  const count=added.length?checked(await sb.rpc('zad_talk_increment_share',{p_id:id})):clip.share_count;
  return {ok:true,share_count:Number(count||0)};
 }
 if(action==='comment'){
  const text=typeof body.comment==='string'?body.comment.trim().replace(/\s+/g,' '):'';
  if(!text||text.length>500)fail(400,'comment_required');
  const parent=body.parent_comment_id??null;
  if(parent!==null){
   if(!commentId(parent))fail(400,'invalid_reply_parent');
   const p=checked(await sb.rpc('zad_visible_talk_comments',{p_submission_id:id}).eq('id',parent).is('parent_comment_id',null).maybeSingle());
   if(!p)fail(400,'invalid_reply_parent');
  }
  const recent=await sb.from('zad_talk_comments').select('id',{count:'exact',head:true}).eq('user_id',who.user.id).gte('created_at',new Date(Date.now()-60000).toISOString());checked(recent);
  if((recent.count||0)>=10)fail(429,'rate_limited');
  const comment=checked(await sb.from('zad_talk_comments').insert({submission_id:id,user_id:who.user.id,username:who.profile.username||who.profile.display_name,body:text,parent_comment_id:parent}).select('id,user_id,username,body,created_at,parent_comment_id').single());
  return {ok:true,comment:{...comment,display_name:who.profile.display_name,avatar_url:who.profile.avatar_url||null,like_count:0,liked:false,reply_count:0,can_delete:true},comment_count:(await comments()).comment_count};
 }
 if(action==='comment_like'||action==='comment_delete'){
  if(!commentId(body.comment_id))fail(400,'invalid_comment');
  const row=checked(await sb.rpc('zad_visible_talk_comments',{p_submission_id:id}).eq('id',body.comment_id).maybeSingle());
  if(!row)fail(404,'comment_not_found');
  if(action==='comment_delete'){
   if(row.user_id!==who.user.id)fail(403,'not_comment_owner');
   checked(await sb.from('zad_talk_comments').update({status:'hidden',updated_at:new Date().toISOString()}).eq('id',row.id).eq('user_id',who.user.id));
   return {ok:true,deleted:true,comment_count:(await comments()).comment_count};
  }
  if(typeof body.liked!=='boolean')fail(400,'liked_required');
  if(body.liked)checked(await sb.from('zad_talk_comment_likes').upsert({comment_id:row.id,user_id:who.user.id},{onConflict:'comment_id,user_id',ignoreDuplicates:true}));
  else checked(await sb.from('zad_talk_comment_likes').delete().eq('comment_id',row.id).eq('user_id',who.user.id));
  const count=await sb.from('zad_talk_comment_likes').select('comment_id',{count:'exact',head:true}).eq('comment_id',row.id);checked(count);
  return {ok:true,liked:body.liked,like_count:count.count||0};
 }
 if(action==='comments'){
  const parent=body.parent_comment_id??null;if(parent!==null&&!commentId(parent))fail(400,'invalid_reply_parent');
  return {ok:true,...await comments(parent,page(body.offset,0,100000))};
 }
 const [likes,thread,liked]=await Promise.all([
  sb.from('zad_talk_likes').select('submission_id',{count:'exact',head:true}).eq('submission_id',id),comments(),
  actor?sb.from('zad_talk_likes').select('submission_id').eq('submission_id',id).eq('actor_key',actor).maybeSingle():Promise.resolve({data:null})]);
 checked(likes);checked(liked);
 return {ok:true,like_count:likes.count||0,comment_count:thread.comment_count,share_count:Number(clip.share_count||0),liked:!!liked.data,logged_in:!!who.user};
});
