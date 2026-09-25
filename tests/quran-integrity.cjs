/* Release-only integrity validation. It never fetches, edits, or generates Quran text. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const EXPECTED_ROOT='5b58aa48fb07265a53cea6abd510d226345357dd556250e30f3ba87b8a076499';
const sha256=value=>crypto.createHash('sha256').update(value,'utf8').digest('hex');
const normalize=text=>text.replace(/^\uFEFF/,'').normalize('NFC');
function inspect(quran){
 const surahs=quran?.data?.surahs;
 assert(Array.isArray(surahs)&&surahs.length===114,'Expected 114 surahs');
 const hashes=[];
 for(let si=0;si<surahs.length;si++){
  const surah=surahs[si];assert.equal(surah.number,si+1,'Surahs must be in canonical order');
  assert(Array.isArray(surah.ayahs)&&surah.ayahs.length>0,'Missing ayahs');
  for(let ai=0;ai<surah.ayahs.length;ai++){
   const ayah=surah.ayahs[ai];assert.equal(ayah.numberInSurah,ai+1,'Ayahs must be in canonical order');
   assert.equal(typeof ayah.text,'string');assert(ayah.text.length>0,'Empty ayah');
   hashes.push(sha256(normalize(ayah.text)));
  }
 }
 assert.equal(hashes.length,6236,'Expected 6236 ayahs');
 // Canonical root = SHA-256 of consecutive lowercase per-ayah hex hashes, no separator.
 return {surahs:surahs.length,ayahs:hashes.length,root:sha256(hashes.join(''))};
}
function verify(quran){const result=inspect(quran);assert.equal(result.root,EXPECTED_ROOT,'Canonical Quran integrity root changed');return result;}
if(require.main===module){
 const quran=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/quran-source.json'),'utf8').replace(/^\uFEFF/,''));
 const results=[];let integrity;
 const check=(name,fn)=>{try{fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);}};
 check('Canonical Quran: 114 surahs, 6236 ayahs and pinned SHA-256 root',()=>{integrity=verify(quran);});
 check('Leading transport BOM and NFC normalization are deterministic',()=>{assert.equal(normalize('\uFEFF'+normalize(quran.data.surahs[0].ayahs[0].text)),normalize(quran.data.surahs[0].ayahs[0].text));assert.equal(normalize('e\u0301'),'é');});
 check('A changed ayah fails integrity without modifying the fixture',()=>{const copy=structuredClone(quran);copy.data.surahs[0].ayahs[0].text+=' ';assert.throws(()=>verify(copy),/root changed/);});
 check('Missing surah or ayah fails structural validation',()=>{const copy=structuredClone(quran);copy.data.surahs.pop();assert.throws(()=>verify(copy),/114 surahs/);const other=structuredClone(quran);other.data.surahs[113].ayahs.pop();assert.throws(()=>verify(other),/6236 ayahs/);});
 check('Reordered canonical ayahs fail validation',()=>{const copy=structuredClone(quran);copy.data.surahs[0].ayahs.reverse();assert.throws(()=>verify(copy),/canonical order/);});
 const report={generated:new Date().toISOString(),normalization:'Remove one leading U+FEFF per ayah; Unicode NFC; SHA-256 UTF-8 per ayah; SHA-256 of concatenated lowercase hex hashes in canonical order, no delimiter.',expectedRoot:EXPECTED_ROOT,integrity,results,passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length};
 fs.writeFileSync(path.join(__dirname,'quran-integrity-results.json'),JSON.stringify(report,null,2)+'\n');
 process.exitCode=report.failed?1:0;
}
module.exports={verify,inspect,EXPECTED_ROOT};
