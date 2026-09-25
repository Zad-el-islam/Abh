const fs=require('node:fs'),assert=require('node:assert/strict');const {boot,tick}=require('./dom-harness.cjs');
const results=[];async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);}}
(async()=>{
 const ugc='تعليق المستخدم <img src=x onerror=alert(1)>',id='00000000-0000-0000-0000-000000000001';
 const json=x=>new Response(JSON.stringify(x),{status:200,headers:{'content-type':'application/json'}});
 const app=await boot({fetcher:url=>url.includes('zad-talk-feed')?json({items:[{id,title:ugc,creator_name:ugc,media_url:'https://bzrhrvgddtnhctcdlgmy.supabase.co/storage/v1/object/sign/zad-talk-media/test.mp4?token=test'}],has_more:false,next_offset:1}):url.includes('zad-talk-social')?json({comments:[{username:ugc,body:ugc,created_at:'2026-09-20T12:00:00Z'}],like_count:1,comment_count:1,share_count:0}):url.includes('zad-talk-leaderboard')?json({users:[{username:ugc,like_count:12,comment_count:3,share_count:2,video_count:1,score:20}]}):null});
 const w=app.w,d=w.document;w.ZadNavigate('media');await tick(100);
 d.querySelector('[data-zt-comment]').click();await tick(80);d.querySelector('button[data-zt-comments-close]').click();d.querySelector('#ztLeaderboardBtn').click();await tick(80);d.querySelector('button[data-zt-rank-close]').click();
 d.querySelector('[data-v21-media-tab="publish"]').click();await tick();const title=d.querySelector('#v21VideoTitle'),file=d.querySelector('#v21VideoFile');title.value=ugc;const selected=new w.File(['test'],'selected.mp4',{type:'video/mp4'});Object.defineProperty(file,'files',{value:[selected],configurable:true});
 for(const lang of ['ar','en','fr','id','tr','ur','es'])await test(lang+': switching keeps upload draft/file and localizes retained comments/ranking chrome',async()=>{
  w.ZadSetLanguage(lang);await tick(100);assert.equal(d.querySelector('#v21VideoTitle'),title);assert.equal(title.value,ugc);assert.equal(d.querySelector('#v21VideoFile'),file);assert.equal(file.files[0],selected);assert(!d.querySelector('#talkPublish').classList.contains('hidden'));
  assert.equal(d.querySelector('.ztCommentsHead strong').textContent,w.ZadI18n.t('talk.5f285a4c6a'));assert.equal(d.querySelector('#ztCommentSend').textContent,w.ZadI18n.t('talk.8b1e3b105d'));assert.equal(d.querySelector('#ztCommentInput').placeholder,w.ZadI18n.t('talk.029d5fc7bd'));
  assert.equal(d.querySelector('.ztCommentBody p').textContent,ugc);assert.equal(d.querySelector('.ztRankCopy strong').textContent,'@'+ugc);assert(!d.querySelector('[onerror]'));assert.equal(d.querySelector('.ztRankScore small').textContent,w.ZadI18n.t('talk.69ff4ac820'));assert.equal(d.querySelector('.ztRankNo').textContent,w.ZadI18n.number(1));assert.equal(d.querySelector('#ztLeaderboardRefresh').textContent,w.ZadI18n.t('talk.654b0d1dbe'));
  assert.deepEqual(app.errors,[]);assert.deepEqual([...w.ZadI18n.missing],[]);
 });
 fs.writeFileSync(__dirname+'/media-localization-results.json',JSON.stringify({generated:new Date().toISOString(),kind:'DOM with test doubles, not live services',results,passed:results.filter(x=>x.status==='passed').length,failed:results.filter(x=>x.status==='failed').length},null,2)+'\n');process.exit(results.some(x=>x.status==='failed')?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
