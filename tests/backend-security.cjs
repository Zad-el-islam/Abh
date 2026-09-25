/* Offline regressions against the actual deployed source, without network access. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {stripTypeScriptTypes}=require('node:module');
const root=path.join(__dirname,'..'),results=[];
const source=fs.readFileSync(path.join(root,'supabase/functions/_shared/runtime.ts'),'utf8').replace(/^import .*\n/,'').replace(/^export /gm,'');
let handler;
const runtime=vm.runInNewContext(stripTypeScriptTypes(source,{mode:'transform'})+';({serve,user,admin,validPath,videoSignature})',{
 createClient:()=>({}),Deno:{env:{get:n=>n==='SUPABASE_URL'?'https://test.invalid':'test-only'},serve:fn=>handler=fn},
 Request,Response,Headers,TextEncoder,TextDecoder,AbortSignal,crypto:crypto.webcrypto,atob,console,fetch:()=>{throw Error('Unexpected network');}
});
async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);}}
const request=(body,headers={})=>new Request('https://test.invalid',{method:'POST',headers,body});
(async()=>{
 await test('CORS validates the complete origin, including preflight',async()=>{
  runtime.serve(async()=>({ok:true}));
  for(const origin of ['null','http://localhost.evil.test','http://127.0.0.1.evil.test','https://zad-el-islam.github.io.evil.test']){
   const r=await handler(new Request('https://test.invalid',{method:'OPTIONS',headers:{Origin:origin}}));assert.equal(r.status,403);assert.equal(r.headers.get('access-control-allow-origin'),null);
  }
  assert.equal((await handler(new Request('https://test.invalid',{method:'OPTIONS',headers:{Origin:'https://zad-el-islam.github.io'}}))).status,204);
 });
 await test('Bounded JSON rejects malformed and oversized requests',async()=>{
  assert.equal((await handler(request('{'))).status,400);
  assert.equal((await handler(request(JSON.stringify({v:'x'.repeat(17000)})))).status,413);
 });
 await test('Invalid supplied JWT cannot silently become an anonymous user',async()=>{
  const sb={auth:{getUser:async()=>({error:{message:'invalid token'}})}};
  await assert.rejects(runtime.user(request('{}',{Authorization:'Bearer forged'}),sb,false),e=>e.status===401);
 });
 await test('Revoked sessions cannot pass Edge authentication',async()=>{
  const id='12345678-1234-1234-1234-123456789012';
  const token='unused.'+Buffer.from(JSON.stringify({sub:id,session_id:id})).toString('base64url')+'.unused';
  const chain={select(){return this},eq(){return this},maybeSingle:async()=>({data:{id,account_status:'active'}})};
  const sb={auth:{getUser:async()=>({data:{user:{id}},error:null})},from:()=>chain,rpc:async()=>({data:false,error:null})};
  await assert.rejects(runtime.user(request('{}',{Authorization:'Bearer '+token}),sb),e=>e.status===401&&e.code==='session_expired');
 });
 await test('Admin authority requires a validated active server session',async()=>{
  const sb={rpc:async()=>({data:[],error:null})};await assert.rejects(runtime.admin(sb,'a'.repeat(64)),e=>e.status===401);
 });
 await test('Object path cannot traverse or point at a different owner',async()=>{
  const id='12345678-1234-1234-1234-123456789012',owner='23456789-1234-1234-1234-123456789012';
  assert(runtime.validPath({id,submitter_user_id:owner,storage_path:owner+'/'+id+'/video.mp4'}));
  assert(runtime.validPath({id,storage_path:id+'/video.mp4'}));
  assert(!runtime.validPath({id,submitter_user_id:owner,storage_path:id+'/'+id+'/video.mp4'}));
  assert(!runtime.validPath({id,storage_path:id+'/../video.mp4'}));
 });
 await test('Stored content signature must agree with the allowed container type',async()=>{
  const mp4=fs.readFileSync(path.join(__dirname,'fixtures/qa-video.mp4'));
  assert(runtime.videoSignature(mp4,'video/mp4'));assert(!runtime.videoSignature(mp4,'video/quicktime'));
  assert(!runtime.videoSignature(Buffer.from('<html>not a video</html>'),'video/mp4'));
  assert(!runtime.videoSignature(mp4,'video/webm'));
 });
 const out={passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length,results};
 fs.writeFileSync(path.join(__dirname,'backend-security-results.json'),JSON.stringify(out,null,2)+'\n');process.exitCode=out.failed?1:0;
})();
