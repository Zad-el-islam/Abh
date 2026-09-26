/* Release-only integrity validation. It never fetches, edits, or generates Quran text. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const EXPECTED_ROOT='5b58aa48fb07265a53cea6abd510d226345357dd556250e30f3ba87b8a076499';
const sha256=value=>crypto.createHash('sha256').update(value,'utf8').digest('hex');
const normalize=text=>text.replace(/^\uFEFF/,'').normalize('NFC');
function inspect(quran){
 const surahs=quran?.data?.surahs;
 assert(Array.isArray(surahs)&&surahs.length===114,'Expected 114 surahs');
 const hashes=[],keys=new Set();
 for(let si=0;si<surahs.length;si++){
  const surah=surahs[si];assert.equal(surah.number,si+1,'Surahs must be in canonical order');
  assert(Array.isArray(surah.ayahs)&&surah.ayahs.length>0,'Missing ayahs');
  for(let ai=0;ai<surah.ayahs.length;ai++){
   const ayah=surah.ayahs[ai];assert.equal(ayah.numberInSurah,ai+1,'Ayahs must be in canonical order');
   const key=`${surah.number}:${ayah.numberInSurah}`;
   assert(!keys.has(key),'Duplicate verse key');keys.add(key);
   assert.equal(typeof ayah.text,'string');assert(ayah.text.trim().length>0,'Empty ayah');
   hashes.push(sha256(normalize(ayah.text)));
  }
 }
 assert.equal(hashes.length,6236,'Expected 6236 ayahs');
 // Canonical root = SHA-256 of consecutive lowercase per-ayah hex hashes, no separator.
 return {surahs:surahs.length,ayahs:hashes.length,uniqueVerseKeys:keys.size,duplicates:0,missing:0,root:sha256(hashes.join(''))};
}
function verify(quran){const result=inspect(quran);assert.equal(result.root,EXPECTED_ROOT,'Canonical Quran integrity root changed');return result;}
function classify(original,reference){
 const a=normalize(original),b=normalize(reference);
 if(a===b)return 'EXACT_MATCH';
 if(a.replace(/\u0640/g,'')===b.replace(/\u0640/g,''))return 'PRESENTATION_ONLY_DIFFERENCE';
 return 'SUBSTANTIVE_DIFFERENCE';
}
// Optional cached bulk comparison. Never fetches or changes runtime data.
function compareProvider(quran,provider){
 verify(quran);
 const original=quran.data.surahs.flatMap(s=>s.ayahs.map(a=>({verse_key:`${s.number}:${a.numberInSurah}`,text:a.text})));
 assert(Array.isArray(provider.verses)&&provider.verses.length===6236,'Provider must contain 6236 verses');
 const keys=new Set(),report={compared:6236,EXACT_MATCH:0,PRESENTATION_ONLY_DIFFERENCE:0,SUBSTANTIVE_DIFFERENCE:0,exactUnicodeMatches:0,differences:[]};
 provider.verses.forEach((v,i)=>{
  assert.equal(v.verse_key,original[i].verse_key,'Provider canonical ordering/key mismatch');
  assert(!keys.has(v.verse_key),'Duplicate provider key');keys.add(v.verse_key);
  assert.equal(typeof v.text_uthmani,'string');assert(v.text_uthmani.trim(),'Empty provider verse');
  const type=classify(original[i].text,v.text_uthmani);report[type]++;
  if(original[i].text===v.text_uthmani)report.exactUnicodeMatches++;
  if(type!=='EXACT_MATCH')report.differences.push({verse_key:v.verse_key,type,original:original[i].text,reference:v.text_uthmani});
 });
 return report;
}
if(require.main===module){
 const quran=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/quran-source.json'),'utf8').replace(/^\uFEFF/,''));
 const results=[];let integrity;
 const check=(name,fn)=>{try{fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);}};
 check('Canonical Quran: 114 surahs, 6236 ayahs and pinned SHA-256 root',()=>{integrity=verify(quran);});
 check('Leading transport BOM and NFC normalization are deterministic',()=>{assert.equal(normalize('\uFEFF'+normalize(quran.data.surahs[0].ayahs[0].text)),normalize(quran.data.surahs[0].ayahs[0].text));assert.equal(normalize('e\u0301'),'é');});
 check('A changed ayah fails integrity without modifying the fixture',()=>{const copy=structuredClone(quran);copy.data.surahs[0].ayahs[0].text+=' ';assert.throws(()=>verify(copy),/root changed/);});
 check('Missing surah or ayah fails structural validation',()=>{const copy=structuredClone(quran);copy.data.surahs.pop();assert.throws(()=>verify(copy),/114 surahs/);const other=structuredClone(quran);other.data.surahs[113].ayahs.pop();assert.throws(()=>verify(other),/6236 ayahs/);});
 check('Reordered canonical ayahs fail validation',()=>{const copy=structuredClone(quran);copy.data.surahs[0].ayahs.reverse();assert.throws(()=>verify(copy),/canonical order/);});
 check('Comparison distinguishes presentation carriers without removing meaningful marks',()=>{assert.equal(classify('a','a'),'EXACT_MATCH');assert.equal(classify('a','a\u0640'),'PRESENTATION_ONLY_DIFFERENCE');assert.equal(classify('a','a\u064e'),'SUBSTANTIVE_DIFFERENCE');assert.equal(classify('\uFEFFe\u0301','é'),'EXACT_MATCH');});
 let comparison;
 const compareIndex=process.argv.indexOf('--compare');
 if(compareIndex>=0)check('Cached complete Quran.com verse-key comparison',()=>{
  assert(process.argv[compareIndex+1],'Supply a cached Quran.com bulk JSON file after --compare');
  comparison=compareProvider(quran,JSON.parse(fs.readFileSync(process.argv[compareIndex+1],'utf8').replace(/^\uFEFF/,'')));
  assert.equal(comparison.SUBSTANTIVE_DIFFERENCE,0,'Substantive differences require investigation; never auto-correct verses');
 });
 const report={generated:new Date().toISOString(),normalization:'Remove one leading U+FEFF per ayah; Unicode NFC; SHA-256 UTF-8 per ayah; SHA-256 of concatenated lowercase hex hashes in canonical order, no delimiter.',expectedRoot:EXPECTED_ROOT,integrity,comparison,results,passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length};
 fs.writeFileSync(path.join(__dirname,'quran-integrity-results.json'),JSON.stringify(report,null,2)+'\n');
 process.exitCode=report.failed?1:0;
}
module.exports={verify,inspect,classify,compareProvider,EXPECTED_ROOT};
