/* Release scope: Daily Wird + Rouh player, their tests and generated deployment only. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),before=JSON.parse(fs.readFileSync(path.join(__dirname,'source-before.sha256.json')));
const allowed=new Set(['assets/js/quran-reader.js','assets/css/reader.css','assets/js/rouh.js','assets/css/rouh.css','source-pages/index.html','index.html','tests/wird-reader.cjs','tests/wird-reader-results.json','tests/rouh-gateway.cjs','tests/rouh-gateway-results.json','tests/quran-integrity-results.json','data/release-manifest.json']);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const changed=[],pdfs=[];
for(const [name,sha]of Object.entries(before)){
 const file=path.join(root,name);assert(fs.existsSync(file),'Removed file: '+name);
 const current=hash(fs.readFileSync(file));
 if(current!==sha){assert(allowed.has(name),'Unrelated modification: '+name);changed.push(name);}
 if(name.endsWith('.pdf')){assert.equal(current,sha,'Modified PDF '+name);pdfs.push({file:name,sha256:sha});}
}
const extra=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','__pycache__','.git'].includes(e.name)||e.isSymbolicLink())continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else{const n=path.relative(root,p).split(path.sep).join('/');if(!Object.hasOwn(before,n)){assert(n.startsWith('tests/two-fix/'),'Unrelated addition: '+n);extra.push(n);}}}}
walk(root);
// The only template change is the two narrowly scoped, official player script paths.
const html=fs.readFileSync(path.join(root,'source-pages/index.html'),'utf8').replace(" https://www.youtube.com/iframe_api https://www.youtube.com/s/player/",'');
assert.equal(hash(html),before['source-pages/index.html']);
for(const n of ['assets/js/seerah.js','source-pages/seerah.html','seerah.html','assets/js/rouh-data.js','assets/js/quran.js','tests/fixtures/quran-source.json','assets/css/design-system.css','assets/js/i18n-catalog.js'])assert.equal(hash(fs.readFileSync(path.join(root,n))),before[n]);
const out={status:'PASS',baselineFiles:Object.keys(before).length,changed,added:extra,unrelatedSourceFilesModified:0,allPdfsUnchanged:true,pdfs,seerahUnchanged:true,curatedVideosUnchanged:true};
fs.writeFileSync(path.join(__dirname,'scope-results.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));
