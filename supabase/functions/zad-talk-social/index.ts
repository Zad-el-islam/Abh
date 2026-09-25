import {serve,user,fail,checked,uuid,page} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
  const action=body.action||'stats',id=body.id;
  if(!uuid(id)||!['stats','like','share','comment','comments'].includes(action))fail(400,'invalid_request');
  const who=await user(req,sb,['like','share','comment'].includes(action));
  const actor=who.user?`u:${who.user.id}`:null;
  const clip=checked(await sb.from('zad_talk_submissions').select('id,status,share_count,submitter_user_id').eq('id',id).maybeSingle());
  if(!clip||clip.status!=='approved')fail(404,'not_found');
  if(clip.submitter_user_id){const p=checked(await sb.from('profiles').select('account_status').eq('id',clip.submitter_user_id).maybeSingle());if(!p||p.account_status!=='active')fail(404,'not_found');}
  if(action==='like'){
    const exists=checked(await sb.from('zad_talk_likes').select('submission_id').eq('submission_id',id).eq('actor_key',actor).maybeSingle());
    if(exists)checked(await sb.from('zad_talk_likes').delete().eq('submission_id',id).eq('actor_key',actor));
    else checked(await sb.from('zad_talk_likes').upsert({submission_id:id,actor_key:actor},{onConflict:'submission_id,actor_key',ignoreDuplicates:true}));
    const count=await sb.from('zad_talk_likes').select('submission_id',{count:'exact',head:true}).eq('submission_id',id);checked(count);
    return {ok:true,liked:!exists,like_count:count.count||0};
  }
  if(action==='share'){
    const added=checked(await sb.from('zad_talk_share_events').upsert({submission_id:id,actor_key:actor,user_id:who.user.id},{onConflict:'submission_id,actor_key',ignoreDuplicates:true}).select('submission_id'));
    const count=added.length?checked(await sb.rpc('zad_talk_increment_share',{p_id:id})):clip.share_count;
    return {ok:true,share_count:Number(count||0)};
  }
  if(action==='comment'){
    const text=typeof body.comment==='string'?body.comment.trim().replace(/\s+/g,' '):'';
    if(!text||text.length>500)fail(400,'comment_required');
    const username=String(who.profile.username||who.profile.display_name).slice(0,50);
    const comment=checked(await sb.from('zad_talk_comments').insert({submission_id:id,user_id:who.user.id,username,body:text}).select('id,user_id,username,body,created_at').single());
    const count=await sb.from('zad_talk_comments').select('id',{count:'exact',head:true}).eq('submission_id',id).eq('status','visible');checked(count);
    return {ok:true,comment:{...comment,avatar_url:who.profile.avatar_url||null},comment_count:count.count||0};
  }
  if(action==='comments'){
    const offset=page(body.offset,0,100000);
    const rows=checked(await sb.from('zad_talk_comments').select('id,user_id,username,body,created_at').eq('submission_id',id).eq('status','visible').order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+49));
    const ids=[...new Set(rows.map((r:any)=>r.user_id))];
    const profiles=ids.length?checked(await sb.from('profiles').select('id,username,display_name,avatar_url,account_status').in('id',ids)):[];
    const map=new Map(profiles.map((p:any)=>[p.id,p]));
    const comments=rows.filter((r:any)=>(map.get(r.user_id) as any)?.account_status==='active').map((r:any)=>{const p:any=map.get(r.user_id);return {...r,username:p.username||p.display_name,avatar_url:p.avatar_url||null};});
    return {ok:true,comments,next_offset:offset+rows.length,has_more:rows.length===50};
  }
  const [likes,comments,liked]=await Promise.all([
    sb.from('zad_talk_likes').select('submission_id',{count:'exact',head:true}).eq('submission_id',id),
    sb.from('zad_talk_comments').select('id',{count:'exact',head:true}).eq('submission_id',id).eq('status','visible'),
    actor?sb.from('zad_talk_likes').select('submission_id').eq('submission_id',id).eq('actor_key',actor).maybeSingle():Promise.resolve({data:null})]);
  checked(likes);checked(comments);checked(liked);
  return {ok:true,like_count:likes.count||0,comment_count:comments.count||0,share_count:Number(clip.share_count||0),liked:!!liked.data,logged_in:!!who.user};
});
