/* SHA-256 scope gate: only Daily Wird runtime code, its QA, and release outputs may change. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const before=JSON.parse(fs.readFileSync(path.join(__dirname,'source-before.sha256.json'),'utf8'));
const allowed=new Set(['assets/js/quran-reader.js','assets/css/reader.css','tests/quran-integrity.cjs','tests/quran-integrity-results.json','index.html','data/release-manifest.json']);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const changed=[],pdfs=[];
for(const [name,value]of Object.entries(before)){
 const file=path.join(root,name);assert(fs.existsSync(file),'Existing file removed: '+name);
 if(hash(file)!==value){assert(allowed.has(name),'Unrelated file changed: '+name);changed.push(name);}
 if(name.endsWith('.pdf')){assert.equal(hash(file),value,'PDF modified: '+name);pdfs.push(name);}
}
const additional=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='node_modules'||entry.name==='__pycache__')continue;const p=path.join(dir,entry.name);if(entry.isSymbolicLink())continue;if(entry.isDirectory())walk(p);else {const rel=path.relative(root,p).split(path.sep).join('/');if(!Object.hasOwn(before,rel)){assert(rel.startsWith('tests/wird-reader/')||['tests/wird-reader.cjs','tests/wird-reader-results.json'].includes(rel),'Unrelated new file: '+rel);additional.push(rel);}}}}
walk(root);
// Existing non-reader CSS is retained exactly, including colors outside Daily Wird.
const css=fs.readFileSync(path.join(root,'assets/css/reader.css'),'utf8');
const originalCss=css.slice(0,css.indexOf('\n/* Daily Wird only.'));
assert.equal(crypto.createHash('sha256').update(originalCss).digest('hex'),before['assets/css/reader.css']);
const report={status:'PASS',existingFiles: Object.keys(before).length,existingFilesChanged:changed,additionalReaderQaFiles:additional,unrelatedSourceFilesModified:0,pdfsUnchanged:pdfs.length,pdfFiles:pdfs};
fs.writeFileSync(path.join(__dirname,'scope-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
