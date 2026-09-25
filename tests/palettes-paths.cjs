/* Calculated token contrast and static HTTP deployment contracts, not a browser audit. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),http=require('node:http');
const root=path.resolve(__dirname,'..'),results=[],measurements=[];
async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);}}
const lum=hex=>{const c=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
(async()=>{
 const palettes=JSON.parse(fs.readFileSync(path.join(root,'data/accent-palettes.json')));
 for(const [name,values]of Object.entries(palettes))for(const [mode,tokens]of Object.entries(values))await test(name+'/'+mode+': text, links, active states, buttons, fields, focus, inactive labels',()=>{
  const m={surfaces:['bg','surface','surface-alt'].map(k=>tokens['--color-'+k]),text:tokens['--color-text'],muted:tokens['--color-muted'],focus:tokens['--color-accent']};
  const brand=tokens['--color-brand'],hover=tokens['--color-brand-hover'];
  const css=fs.readFileSync(path.join(root,'assets/css/design-system.css'),'utf8');
  const selector=mode==='light'?':root[data-accent="'+name+'"]':':root[data-theme="dark"][data-accent="'+name+'"]';
  const block=css.slice(css.indexOf(selector)).split('}')[0];
  for(const [token,value] of Object.entries(tokens))assert(block.includes(token+': '+value+';'),selector+' '+token);
  assert(m.surfaces.every(Boolean)&&tokens['--color-border']);
  for(const [kind,fg,min]of [['normal',m.text,4.5],['muted-small',m.muted,4.5],['link-active',brand,4.5],['hover-link',hover,4.5],['field-boundary',m.muted,3],['accent-small-text',m.focus,4.5],['focus',m.focus,3]])for(const bg of m.surfaces){const ratio=contrast(fg,bg);measurements.push({palette:name,mode,kind,foreground:fg,background:bg,ratio:Number(ratio.toFixed(2)),minimum:min});assert(ratio>=min,kind+': '+ratio);}
  for(const bg of [brand,hover]){const ratio=contrast(m.surfaces[1],bg);assert(ratio>=4.5);measurements.push({palette:name,mode,kind:'button',foreground:m.surfaces[1],background:bg,ratio:Number(ratio.toFixed(2)),minimum:4.5});}
  assert(contrast(m.muted,m.surfaces[2])>=4.5);
 });
 await test('Header geometry and responsive safeguards exist without changing card radii',()=>{
  const css=fs.readFileSync(path.join(root,'assets/css/design-system.css'),'utf8');
  const rule=css.match(/\.header-actions #v21FloatingLanguage\.icon-button\s*\{([^}]+)\}/)[1];for(const item of ['display:grid','place-items:center','inline-size:44px','block-size:44px','padding:0','margin:0','line-height:1'])assert(rule.includes(item),item);
  assert(css.includes('max-block-size:calc(100dvh - 32px)'));assert(css.includes('overflow-wrap:anywhere'));assert(css.includes('--radius-md: 12px'));
 });
 await test('GitHub Pages subdirectory: all local HTML/CSS/JS/font/image/PDF resources return intact over HTTP',async()=>{
  const server=http.createServer((req,res)=>{
   const parsed=new URL(req.url,'http://localhost');if(!parsed.pathname.startsWith('/zad-el-islam/')){res.writeHead(404).end();return;}
   const rel=decodeURIComponent(parsed.pathname.slice('/zad-el-islam/'.length))||'index.html';const file=path.resolve(root,rel);
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
   const data=fs.readFileSync(file);res.writeHead(200,{'Content-Length':data.length,'Content-Type':file.endsWith('.pdf')?'application/pdf':'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);
  });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{const base='http://127.0.0.1:'+server.address().port+'/zad-el-islam/';let count=0;
   for(const dir of ['', 'assets/css','assets/js','assets/fonts','assets/icons'])for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){if(!entry.isFile()||(!dir&&!/\.(html|pdf)$/.test(entry.name)))continue;const rel=dir?dir+'/'+entry.name:entry.name;const response=await fetch(new URL(rel,base));assert.equal(response.status,200,rel);const data=Buffer.from(await response.arrayBuffer());assert(data.equals(fs.readFileSync(path.join(root,rel))),rel);count++;}
   assert(count>=45);for(const book of ['quran','tawhid','usul','wasitiyyah'])assert.equal((await fetch(new URL('reader.html?book='+book,base))).status,200);
   assert.equal((await fetch(new URL('seerah.html#player',base))).status,200);
   assert.equal((await fetch(new URL('quran.pdf',base),{method:'HEAD'})).headers.get('content-type'),'application/pdf');
  }finally{await new Promise(resolve=>server.close(resolve));}
 });
 const report={generated:new Date().toISOString(),kind:'calculated colors and local HTTP contracts',passed:results.filter(x=>x.status==='passed').length,failed:results.filter(x=>x.status==='failed').length,results,measurements,limits:['Decorative card dividers are not interactive boundaries.','JSDOM and token calculations do not establish WCAG conformance or responsive rendering.','HTTP contract uses a local subdirectory, not a deployed GitHub account.']};fs.writeFileSync(path.join(__dirname,'palettes-paths-results.json'),JSON.stringify(report,null,2)+'\n');process.exitCode=report.failed?1:0;
})();
