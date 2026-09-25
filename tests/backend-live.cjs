/* Explicit opt-in live QA. Supply a private, external QA credential file and an MP4 fixture.
   The QA administrator must be provisioned server-side; this script never grants itself a role. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),privatePath=path.resolve(process.argv[3]||'missing-private-file');
if(privatePath.startsWith(root+path.sep))throw Error('QA credentials must be outside the deployment directory');
const phase=process.argv[2],state=JSON.parse(fs.readFileSync(privatePath,'utf8'));
const reportPath=path.join(__dirname,'backend-live-results.json');
let results=fs.existsSync(reportPath)?JSON.parse(fs.readFileSync(reportPath)).results:[];
const save=()=>fs.writeFileSync(privatePath,JSON.stringify(state,null,2),{mode:0o600});
const sdk=vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/supabase-2.110.8.js'),'utf8')+';supabase;', {fetch,Request,Response,Headers,URL,URLSearchParams,AbortController,TextEncoder,TextDecoder,setTimeout,clearTimeout,setInterval,clearInterval,console,crypto:crypto.webcrypto,Buffer,process,WebSocket,Blob,FormData,atob,btoa});
const base='https://bzrhrvgddtnhctcdlgmy.supabase.co',key='sb_publishable_HzCPiZYRuFb3hm_duGCHVA_J020y2YL';
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const client=(storage=store())=>sdk.createClient(base,key,{auth:{storage,persistSession:true,autoRefreshToken:false,detectSessionInUrl:false}});
const identifier=u=>'u_'+crypto.createHash('sha256').update('zad-alrouh:v1:'+u.normalize('NFKC').toLowerCase()).digest('hex')+'@users.zad-alrouh.invalid';
const ok=r=>{assert.equal(r.error,null,r.error?.message);return r.data;};
async function test(name,fn){try{await fn();results=results.filter(x=>x.name!==name);results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results=results.filter(x=>x.name!==name);results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);throw e;}finally{fs.writeFileSync(reportPath,JSON.stringify({project:'bzrhrvgddtnhctcdlgmy',tested_at:new Date().toISOString(),real_backend:true,passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length,results},null,2)+'\n');save();}}
async function edge(name,body={},token='',extra={}){const r=await fetch(base+'/functions/v1/'+name,{method:'POST',headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...extra},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)});const data=await r.json();return {status:r.status,data,headers:r.headers};}
const success=r=>{assert.equal(r.status,200,r.data?.error);assert.equal(r.data.ok,true);return r.data;};
async function login(label){const c=client();const u=state.users[label];const session=ok(await c.auth.signInWithPassword({email:u.email,password:u.password})).session;assert(session);u.token=session.access_token;u.refresh=session.refresh_token;save();return c;}
async function adminLogin(){const r=success(await edge('zad-admin-auth',{action:'login',username:state.admin_username,password:state.admin_password}));assert.match(r.session_token,/^[a-f0-9]{64}$/);state.admin_token=r.session_token;save();return r;}
const adm=(name,body)=>edge(name,{...body,token:state.admin_token});
async function main(){
 if(phase==='auth'){
  await test('Public feed responds on restored live project',async()=>{success(await edge('zad-talk-feed',{limit:1}));});
  await test('Narrow CORS accepts approved origin and rejects deceptive localhost origin',async()=>{
   const good=await edge('zad-talk-feed',{limit:1},'',{Origin:'https://zad-el-islam.github.io'});success(good);assert.equal(good.headers.get('access-control-allow-origin'),'https://zad-el-islam.github.io');
   const bad=await edge('zad-talk-feed',{},'',{Origin:'http://localhost.evil.invalid'});assert.equal(bad.status,403);assert.equal(bad.headers.get('access-control-allow-origin'),null);
  });
  await test('Anonymous upload authorization is rejected',async()=>{assert.equal((await edge('zad-talk-create-upload',{})).status,401);});
  state.users=state.users||{};const clients={};
  for(const label of ['a','b'])await test('Real signup and automatic profile creation '+label,async()=>{
   const username=state.prefix+'_'+label,c=client();
   assert(!state.users[label],'Use fresh fixture names for a new signup test');
   const data=ok(await c.auth.signUp({email:identifier(username),password:state.password,options:{data:{username,display_name:username}}}));
   assert(data.session&&data.user);state.users[label]={id:data.user.id,username,email:data.user.email,password:state.password,token:data.session.access_token,refresh:data.session.refresh_token};save();clients[label]=c;
   const rows=ok(await c.from('profiles').select('id,username'));assert.equal(rows.length,1);assert.equal(rows[0].id,data.user.id);assert.equal(rows[0].username,username);
  });
  const a=clients.a,b=clients.b;
  await test('Duplicate username and invalid password are rejected by live backend',async()=>{
   assert.equal(ok(await a.rpc('zad_username_available',{p_username:state.users.a.username})),false);
   const duplicate=await client().auth.signUp({email:state.users.a.email,password:state.password,options:{data:{username:state.users.a.username}}});assert(duplicate.error);
   assert((await client().auth.signInWithPassword({email:state.users.a.email,password:'incorrect-password'})).error);
   assert((await a.rpc('zad_change_username',{p_new_username:state.users.b.username})).error);
  });
  await test('Session restoration with the actual bundled SDK',async()=>{
   const storage=store(),first=client(storage);ok(await first.auth.setSession({access_token:state.users.a.token,refresh_token:state.users.a.refresh}));
   const restored=client(storage);assert.equal(ok(await restored.auth.getSession()).session.user.id,state.users.a.id);assert.equal(ok(await restored.auth.getUser()).user.id,state.users.a.id);
   assert.equal(ok(await restored.from('profiles').select('id')).length,1);
  });
  await test('Cross-user profile update and account-status escalation are denied',async()=>{
   const changed=ok(await a.from('profiles').update({display_name:'tampered'}).eq('id',state.users.b.id).select('id'));assert.equal(changed.length,0);
   assert.equal(ok(await b.from('profiles').select('display_name').single()).display_name,state.users.b.username);
   assert((await a.from('profiles').update({account_status:'banned'}).eq('id',state.users.a.id)).error);
  });
  await test('Direct stats, moderation, admin tables and privileged RPC writes are denied',async()=>{
   assert((await a.from('user_stats').update({total_points:999999}).eq('user_id',state.users.b.id)).error);
   for(const table of ['zad_admins','zad_admin_sessions','zad_talk_submissions','username_login_map'])assert((await a.from(table).select('*').limit(1)).error);
   assert((await a.rpc('zad_revoke_user_sessions',{p_user_id:state.users.b.id})).error);
   assert((await a.rpc('zad_admin_users_page',{})).error);
  });
  await test('Server points claims are bounded, idempotent and do not allow arbitrary events',async()=>{
   const first=ok(await a.rpc('zad_claim_event',{p_event_type:'daily_wird_1'}));
   const again=ok(await a.rpc('zad_claim_event',{p_event_type:'daily_wird_1'}));assert.deepEqual(again,first);
   ok(await a.rpc('zad_claim_event',{p_event_type:'daily_wird_2'}));assert.equal(ok(await a.rpc('zad_get_today_wird_choice')),1);
   assert((await a.rpc('zad_claim_event',{p_event_type:'server_bonus'})).error);
  });
  await test('Avatar upload works only in the authenticated owner folder',async()=>{
   const png=new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhB0AAAAASUVORK5CYII=','base64')],{type:'image/png'});
   ok(await a.storage.from('zad-profile-avatars').upload(state.users.a.id+'/avatar',png,{contentType:'image/png',upsert:true}));
   assert((await b.storage.from('zad-profile-avatars').upload(state.users.a.id+'/avatar',png,{contentType:'image/png',upsert:true})).error);
   const url=a.storage.from('zad-profile-avatars').getPublicUrl(state.users.a.id+'/avatar').data.publicUrl;const r=await fetch(url);assert.equal(r.status,200);await r.body.cancel();
  });
  await test('Admin login and server-side user search and pagination',async()=>{
   assert.equal((await edge('zad-admin-auth',{action:'login',username:state.admin_username,password:'wrong'})).status,401);await adminLogin();
   const all=success(await adm('zad-admin-users',{action:'list',q:state.prefix}));assert.equal(all.total,2);
   const first=success(await adm('zad-admin-users',{action:'list',q:state.prefix,limit:1}));const next=success(await adm('zad-admin-users',{action:'list',q:state.prefix,limit:1,offset:first.next_offset}));assert(first.has_more);assert.notEqual(first.users[0].id,next.users[0].id);
   assert.equal(success(await adm('zad-admin-users',{action:'list',q:'%_"),account_status.eq.active'})).users.length,0);
  });
  await test('Ordinary user metadata cannot grant admin authority',async()=>{
   ok(await a.auth.updateUser({data:{role:'admin',is_admin:true}}));
   assert.equal((await edge('zad-admin-users',{action:'list',token:state.users.a.token},state.users.a.token)).status,401);
  });
 }
 if(phase==='video'){
  const a=await login('a'),b=await login('b');await adminLogin();const bytes=fs.readFileSync(process.argv[4]);const file=new Blob([bytes],{type:'video/mp4'});
  const request={title:'Temporary release QA video',file_name:'qa.mp4',mime_type:'video/mp4',file_size:bytes.length};
  await test('Invalid MIME and oversized upload requests are rejected',async()=>{
   assert.equal((await edge('zad-talk-create-upload',{...request,mime_type:'text/html'},state.users.a.token)).status,400);
   assert.equal((await edge('zad-talk-create-upload',{...request,file_size:52428801},state.users.a.token)).status,400);
  });
  let ticket;
  await test('Authenticated upload authorization binds owner, path and receipt',async()=>{
   ticket=success(await edge('zad-talk-create-upload',request,state.users.a.token));state.tickets=[...(state.tickets||[]),ticket];save();assert(ticket.path.startsWith(state.users.a.id+'/'+ticket.id+'/'));
   assert.equal((await edge('zad-talk-finalize-upload',{id:ticket.id,receipt:ticket.receipt},state.users.a.token)).data.error,'file_not_found');
   assert.equal((await edge('zad-talk-finalize-upload',{id:ticket.id,receipt:ticket.receipt},state.users.b.token)).status,403);
  });
  await test('Real signed Storage upload works and cannot overwrite another object',async()=>{
   ok(await a.storage.from('zad-talk-media').uploadToSignedUrl(ticket.path,ticket.token,file,{contentType:'video/mp4',upsert:false}));
   assert((await b.storage.from('zad-talk-media').upload(ticket.path,file,{contentType:'video/mp4',upsert:true})).error);
   assert((await a.storage.from('zad-talk-media').uploadToSignedUrl(ticket.path,ticket.token,file,{contentType:'video/mp4',upsert:true})).error);
   const anonymous=client();const ls=await anonymous.storage.from('zad-talk-media').list(state.users.a.id);assert(ls.error||ls.data.length===0);
   assert((await anonymous.storage.from('zad-talk-media').download(ticket.path)).error);
  });
  await test('Finalization verifies stored file and enters pending moderation',async()=>{
   const done=success(await edge('zad-talk-finalize-upload',{id:ticket.id,receipt:ticket.receipt},state.users.a.token));assert.equal(done.status,'pending');
   success(await edge('zad-talk-finalize-upload',{id:ticket.id,receipt:ticket.receipt},state.users.a.token));
   assert.equal((await edge('zad-talk-finalize-upload',{id:ticket.id,receipt:'0'.repeat(64)},state.users.a.token)).status,403);
   assert.equal(success(await edge('zad-talk-feed',{id:ticket.id})).items.length,0);
   const pending=success(await adm('zad-talk-admin-list',{status:'pending'}));assert(pending.items.some(x=>x.id===ticket.id&&x.upload_verified_at));
  });
  await test('Owner cannot self-approve a pending video',async()=>{
   assert.equal((await edge('zad-talk-admin-review',{id:ticket.id,action:'approve',token:state.users.a.token},state.users.a.token)).status,401);
   assert((await a.from('zad_talk_submissions').update({status:'approved'}).eq('id',ticket.id)).error);
  });
  await test('Admin approval makes only approved video publicly readable',async()=>{
   success(await adm('zad-talk-admin-review',{id:ticket.id,action:'approve'}));
   const feed=success(await edge('zad-talk-feed',{id:ticket.id}));assert.equal(feed.items.length,1);assert.equal(feed.items[0].creator_user_id,state.users.a.id);
   const response=await fetch(feed.items[0].media_url,{headers:{Range:'bytes=0-31'}});assert([200,206].includes(response.status));await response.body.cancel();
  });
  await test('Likes, comments and shares use authenticated identity and deduplicate shares',async()=>{
   assert.equal((await edge('zad-talk-social',{id:ticket.id,action:'like'})).status,401);
   assert.equal(success(await edge('zad-talk-social',{id:ticket.id,action:'like',actor_key:'u:'+state.users.a.id},state.users.b.token)).liked,true);
   const comment=success(await edge('zad-talk-social',{id:ticket.id,action:'comment',comment:'Temporary QA comment',user_id:state.users.a.id,username:'forged'},state.users.b.token));assert.equal(comment.comment.user_id,state.users.b.id);assert.equal(comment.comment.username,state.users.b.username);
   const one=success(await edge('zad-talk-social',{id:ticket.id,action:'share'},state.users.b.token));const two=success(await edge('zad-talk-social',{id:ticket.id,action:'share'},state.users.b.token));assert.equal(one.share_count,two.share_count);
   success(await edge('zad-talk-social',{id:ticket.id,action:'comments'}));success(await edge('zad-talk-leaderboard',{}));
  });
  await test('Admin rejection removes the video from public feed and interactions',async()=>{
   success(await adm('zad-talk-admin-review',{id:ticket.id,action:'reject',reason:'Temporary QA rejection'}));assert.equal(success(await edge('zad-talk-feed',{id:ticket.id})).items.length,0);
   assert.equal((await edge('zad-talk-social',{id:ticket.id,action:'comment',comment:'blocked'},state.users.b.token)).status,404);
  });
  await test('Server rejects forged MP4 content and mismatched actual size',async()=>{
   for(const fake of [true,false]){
    const payload=fake?Buffer.from('<html>This is not a video. It only claims to be video/mp4.</html>'):bytes;
    const t=success(await edge('zad-talk-create-upload',{...request,file_size:payload.length+(fake?0:1)},state.users.a.token));state.tickets.push(t);save();
    ok(await a.storage.from('zad-talk-media').uploadToSignedUrl(t.path,t.token,new Blob([payload],{type:'video/mp4'}),{contentType:'video/mp4',upsert:false}));
    const result=await edge('zad-talk-finalize-upload',{id:t.id,receipt:t.receipt},state.users.a.token);assert.equal(result.status,400);assert.equal(result.data.error,fake?'invalid_video_content':'file_metadata_mismatch');
    assert.equal((await adm('zad-talk-admin-review',{id:t.id,action:'approve'})).status,409);
   }
  });
 }
 if(phase==='sessions'){
  let a=await login('a'),b=await login('b');await adminLogin();
  await test('Kick invalidates old JWT authorization and refresh tokens server-side',async()=>{
   const oldToken=state.users.b.token,oldRefresh=state.users.b.refresh;
   success(await adm('zad-admin-users',{action:'kick',user_id:state.users.b.id}));
   assert.equal((await edge('zad-access-check',{},oldToken)).status,401);
   assert((await b.rpc('zad_claim_event',{p_event_type:'daily_zad'})).error);
   assert((await client().auth.refreshSession({refresh_token:oldRefresh})).error);
   b=await login('b');success(await edge('zad-access-check',{},state.users.b.token));
  });
  await test('Ban and unban enforce Auth, RLS and Edge authorization',async()=>{
   const old=state.users.a.token;
   try{
    success(await adm('zad-admin-users',{action:'ban',user_id:state.users.a.id,reason:'Temporary QA ban'}));
    assert((await client().auth.signInWithPassword({email:state.users.a.email,password:state.users.a.password})).error);
    assert([401,403].includes((await edge('zad-talk-create-upload',{},old)).status));
    assert((await a.rpc('zad_claim_event',{p_event_type:'daily_zad'})).error);
    assert.equal(ok(await a.from('profiles').select('id')).length,0);
   }finally{success(await adm('zad-admin-users',{action:'unban',user_id:state.users.a.id}));}
   a=await login('a');success(await edge('zad-access-check',{},state.users.a.token));
  });
  await test('Username change preserves login mapping and blocks duplicates',async()=>{
   const username=state.users.a.username+'_new';assert.equal(ok(await a.rpc('zad_change_username',{p_new_username:username})),username);
   state.users.a.username=username;ok(await a.auth.updateUser({data:{username,display_name:username}}));save();
   assert.equal(ok(await client().rpc('zad_resolve_login_username',{p_username:username})),state.users.a.email);
   assert((await b.rpc('zad_change_username',{p_new_username:username})).error);
  });
  await test('Password update and server-side weak-password rejection',async()=>{
   assert((await a.auth.updateUser({password:'1'})).error);
   const old=state.users.a.password,password=old+'Updated8';ok(await a.auth.updateUser({password}));state.users.a.password=password;save();
   assert((await client().auth.signInWithPassword({email:state.users.a.email,password:old})).error);a=await login('a');
  });
  await test('Logout invalidates live protected operations and session restoration',async()=>{
   const old=state.users.b.token;ok(await b.auth.signOut({scope:'local'}));assert.equal(ok(await b.auth.getSession()).session,null);
   assert.equal((await edge('zad-access-check',{},old)).status,401);
  });
  await test('Admin logout invalidates the server session',async()=>{
   success(await adm('zad-admin-auth',{action:'logout'}));assert.equal((await adm('zad-admin-users',{action:'list'})).status,401);
  });
 }
 if(phase==='disabled')await test('Disabled administrator cannot reuse an unexpired session',async()=>{assert.equal((await adm('zad-admin-users',{action:'list'})).status,401);});
 if(phase==='cleanup'){
  await adminLogin();
  await test('Admin video deletion removes only the temporary clip and object',async()=>{
   const t=state.tickets[0];success(await adm('zad-talk-admin-review',{id:t.id,action:'delete'}));assert(!success(await adm('zad-talk-admin-list',{status:'all'})).items.some(x=>x.id===t.id));
  });
  await test('Self-delete removes the temporary user and its storage objects',async()=>{
   await login('a');success(await edge('zad-account-delete',{},state.users.a.token));state.users.a.deleted=true;save();
   assert((await client().auth.signInWithPassword({email:state.users.a.email,password:state.users.a.password})).error);
  });
  await test('Admin deletion removes the other temporary user',async()=>{
   success(await adm('zad-admin-users',{action:'delete',user_id:state.users.b.id}));state.users.b.deleted=true;save();assert.equal(success(await adm('zad-admin-users',{action:'list',q:state.prefix})).total,0);
   success(await adm('zad-admin-auth',{action:'logout'}));
  });
 }
}
main().then(()=>process.exit(0)).catch(()=>process.exit(1));
