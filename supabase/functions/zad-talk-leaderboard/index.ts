import {serve,user,checked,page} from '../_shared/runtime.ts';
serve(async(req,sb,body)=>{
  await user(req,sb,false);
  const users=checked(await sb.rpc('zad_talk_engagement_leaderboard',{p_limit:Math.max(3,page(body.limit,10,20))}));
  return {ok:true,users:users||[],formula:'likes + 2×comments + 2×shares + 3×approved videos'};
});
