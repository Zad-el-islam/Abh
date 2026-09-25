/* Targeted patch regression contracts. No rendered-browser or live-service claims. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {boot,tick,root}=require('./dom-harness.cjs');
const results=[];
async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);}}
const snapshot=w=>Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>{const key=w.localStorage.key(i);return[key,w.localStorage.getItem(key)];}));
(async()=>{
 const app=await boot(),w=app.w,d=w.document,key='zad_scoped_palettes_v1';
 await test('Heart and Wird colors remain independent across navigation',async()=>{
  w.ZadNavigate('heart');w.ZadSettings.open();d.querySelector('[data-accent-option="burgundy"]').click();d.querySelector('#settingsDialog').close();
  assert.equal(d.documentElement.dataset.accent,'burgundy');
  w.ZadNavigate('wird');await tick();assert.equal(d.documentElement.dataset.accent,'emerald');
  w.ZadSettings.open();d.querySelector('[data-accent-option="navy"]').click();d.querySelector('#settingsDialog').close();
  w.ZadNavigate('heart-azkar');assert.equal(d.documentElement.dataset.accent,'burgundy');assert.equal(d.documentElement.dataset.colorScope,'heart');
  w.ZadNavigate('wird-search');assert.equal(d.documentElement.dataset.accent,'navy');
  w.ZadNavigate('home');assert.equal(d.documentElement.dataset.accent,'emerald');
  assert.equal(w.localStorage.getItem('zad_accent_v1'),null);assert.deepEqual(JSON.parse(w.localStorage.getItem(key)),{heart:'burgundy',wird:'navy'});
  assert(!d.documentElement.hasAttribute('data-palette'));assert.deepEqual(app.errors,[]);
 });
 await test('Refresh/deep links restore both saved section colors',async()=>{
  for(const [route,color]of [['heart-tasbih','burgundy'],['wird-settings','navy']]){const b=await boot({hash:'#'+route,storage:snapshot(w)});assert.equal(b.w.document.documentElement.dataset.accent,color);assert.deepEqual(b.errors,[]);}
 });
 await test('Legacy preferences migrate once; scoped choices take precedence',async()=>{
  const b=await boot({storage:{wird_palette_v1:'blue',zad_palette_v1:'gold',heart_palette_v1:'red',hadith_palette_v1:'olive',zad_accent_v1:'teal'}});
  for(const [scope,color]of [['wird','navy'],['zad','sand'],['heart','burgundy'],['hadith','olive'],['home','teal']]){b.w.ZadNavigate(scope);assert.equal(b.w.document.documentElement.dataset.accent,color);}
  b.w.ZadNavigate('heart');b.w.ZadSettings.setAccent('terracotta');b.w.ZadNavigate('home');b.w.ZadNavigate('heart');assert.equal(b.w.document.documentElement.dataset.accent,'terracotta');assert.equal(b.w.localStorage.getItem('heart_palette_v1'),'red');assert.equal(b.w.localStorage.getItem('zad_accent_v1'),'teal');assert.deepEqual(b.errors,[]);
 });
 await test('Legacy selection callbacks delegate to the same scoped store',async()=>{
  for(const [scope,handler,color]of [['wird','choosePalette','olive'],['zad','chooseZadPalette','sand'],['heart','chooseHeartPalette','burgundy'],['hadith','chooseHadithPalette','navy']]){w.ZadNavigate(scope);w[handler](color);assert.equal(d.documentElement.dataset.accent,color);assert.equal(JSON.parse(w.localStorage.getItem(key))[scope],color);}
  w.ZadNavigate('home');assert.equal(d.documentElement.dataset.accent,'emerald');assert(!d.documentElement.hasAttribute('data-palette'));
 });
 await test('Reader and Seerah have separate stable scopes; Admin stays conservative',async()=>{
  const storage={zad_accent_v1:'sand',zad_theme_v2:'dark',[key]:JSON.stringify({home:'emerald',reader:'navy',seerah:'burgundy',heart:'olive'})};
  for(const [file,scope,color]of [['reader.html','reader','navy'],['seerah.html','seerah','burgundy'],['index.html','home','emerald'],['admin.html',null,null]]){const b=await boot({file,storage});const doc=b.w.document;assert.equal(doc.documentElement.dataset.theme,'dark');if(scope){assert.equal(doc.documentElement.dataset.colorScope,scope);assert.equal(doc.documentElement.dataset.accent,color);}else assert(!doc.documentElement.dataset.accent);assert.equal(b.w.localStorage.getItem(key),storage[key]);assert.deepEqual(b.errors,[]);}
 });
 await test('Language and global light/dark changes preserve section colors',async()=>{
  w.ZadNavigate('heart');for(const lang of ['ar','en','fr','id','tr','ur','es']){w.ZadSetLanguage(lang);for(const mode of ['light','dark']){w.ZadSettings.setTheme(mode);assert.equal(d.documentElement.dataset.accent,'burgundy');assert.equal(d.documentElement.dataset.theme,mode);}}
  w.ZadNavigate('wird');assert.equal(d.documentElement.dataset.accent,'olive');assert.equal(d.documentElement.dataset.theme,'dark');assert.deepEqual(app.errors,[]);
 });
 await test('Invalid stored palettes are ignored safely',async()=>{
  const b=await boot({hash:'#heart',storage:{[key]:'{broken',zad_accent_v1:'constructor',heart_palette_v1:'invalid'}});assert.equal(b.w.document.documentElement.dataset.accent,'emerald');assert.equal(b.w.ZadAppearance.set('__proto__'),false);b.w.ZadSettings.setAccent('navy');b.w.ZadNavigate('home');b.w.ZadNavigate('heart');assert.equal(b.w.document.documentElement.dataset.accent,'navy');assert.deepEqual(b.errors,[]);
 });
 await test('Neutral library title/notice in all seven languages; unavailable tiles removed and messages retained',async()=>{
  const unwanted=/أدهم|شرقاوي|ادہم|شرقاوی|Adham|Sharqawi/i;
  for(const lang of ['ar','en','fr','id','tr','ur','es']){w.ZadSetLanguage(lang);w.ZadNavigate('zad');await tick();const title=w.ZadI18n.t('steadfastness.4590203cda');const button=[...d.querySelectorAll('#zadTabs button')].find(b=>b.textContent===title);assert(button);button.click();await tick();assert(!unwanted.test(d.querySelector('#zadModule').textContent));assert.equal(d.querySelector('#zadBooksArea h2').textContent,title);assert.equal(d.querySelectorAll('.zadBookTile').length,0);assert(d.querySelectorAll('#zadCards .zadMessageCard').length>0);assert(d.querySelector('#zadSearchInput'));assert(d.querySelector('#zadCards .zadFav'));assert.deepEqual([...w.ZadI18n.missing],[]);}
  for(const file of ['source-pages/index.html','assets/js/i18n-catalog.js'])assert(!unwanted.test(fs.readFileSync(path.join(root,file),'utf8')),file);
  assert.deepEqual(app.errors,[]);
 });
 const report={generated:new Date().toISOString(),kind:'DOM patch contracts; no rendered browser',results,passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length};
 fs.writeFileSync(path.join(__dirname,'scoped-colors-results.json'),JSON.stringify(report,null,2)+'\n');process.exit(report.failed?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
