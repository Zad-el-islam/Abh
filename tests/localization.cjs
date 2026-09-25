/* DOM and translation contracts only. No browser layout or live backend claims. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {boot,tick,root}=require('./dom-harness.cjs');
const languages=['ar','en','fr','id','tr','ur','es'];
const box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/i18n-catalog.js'),'utf8'),box);
const catalog=box.window.ZadI18nCatalog,results=[],coverage={},missing=[];
async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.message);}}
const routes=['home','iman','ilm','library','aqidah','seerah','tafsir','more','media','rouh','wird','wird-search','wird-settings','wird-quranAudio','zad','heart-home','heart-daily','heart-remedy','heart-azkar','heart-gharib','heart-tasbih','hadith'];
// Exclusions are source passages, proper source metadata, and language endonyms.
const excluded='script,style,noscript,[data-source-content],[lang="ar"],.hadithText,.hadithMeta,.heartSource,.heartDhikrText,.heartDhikrMeta>span:first-child,.heartWord,.heartCalmVerse,.zadText,.zadSource,.zadLesson,.zadMessageCard h3,#zadDailyText,.v22Arabic,.ayahText,.book-cover,.v21AqidahAdviceText,.v21AqidahSource,#heartCounterLabel,#heartTasbihSelector,.ayahMeta,.quranAudioSurahName,#v21LanguagePanel [data-v21-lang],#fullSurahReciterSelect,#v22AyahReciter,[data-reader-language] option,.zaQuranSurahTitle strong';
function visible(w,e){if(e.closest('.hidden,[hidden]'))return false;for(let p=e;p;p=p.parentElement)if(w.getComputedStyle(p).display==='none')return false;return true;}
function scan(w,locale,label,scope=w.document.body){
 const d=w.document,walker=d.createTreeWalker(scope,4);let n;const bad=[],visibility=new WeakMap();
 function shown(e){if(visibility.has(e))return visibility.get(e);const v=!e.matches(".hidden,[hidden],dialog:not([open]),.site-toast:not(.show),.heartToast:not(.show)")&&e.style.display!=="none"&&e.getAttribute("aria-hidden")!=="true"&&(!e.parentElement||shown(e.parentElement));visibility.set(e,v);return v;}
 while(n=walker.nextNode()){const e=n.parentElement,txt=n.nodeValue.trim();if(!txt||e.closest(excluded)||!shown(e))continue;
 if(/\[object Object\]|\bundefined\b|(?:heart-hadith|gateways|index|settings|heart-remedies)\.[a-z0-9]{10}/.test(txt))bad.push(txt);
 // Arabic source quotation inside an otherwise localized editorial instruction remains verbatim.
 const ui=txt.replace(/حسبنا الله ونعم الوكيل/g,'');
 if(!['ar','ur'].includes(locale)&&/[\u0621-\u064a]/.test(ui))bad.push(txt);
 }
 for(const e of scope.querySelectorAll('button[data-i18n]'))if(shown(e))assert(e.textContent.trim(),label+': empty translated button');
 assert.deepEqual(bad,[],label+': unexpected visible UI');
}
(async()=>{
 await test('Catalog: every key has all seven values and matching parameters',()=>{
  for(const lang of languages){const absent=[];for(const [key,row]of Object.entries(catalog))if(typeof row[lang]!=='string'||!row[lang].trim())absent.push(key);coverage[lang]={keys:Object.keys(catalog).length,missing:absent.length};missing.push(...absent.map(key=>({language:lang,key,namespace:key.split('.')[0]})));}
  assert.deepEqual(missing,[]);
  for(const [key,row]of Object.entries(catalog)){const params=s=>[...new Set(s.match(/\{\w+\}/g)||[])].sort();for(const lang of languages)assert.deepEqual(params(row[lang]),params(row.ar),key+': '+lang+' interpolation');}
 });
 await test('Every literal UI key in templates and render sites resolves',()=>{
  for(const dir of ['assets/js','source-pages'])for(const file of fs.readdirSync(path.join(root,dir))){
   if(!/\.(js|html)$/.test(file)||file.startsWith('supabase')||file==='i18n-catalog.js')continue;
   const source=fs.readFileSync(path.join(root,dir,file),'utf8');
   for(const match of source.matchAll(/ZadI18n\.(?:t|html|pack)\(["']([^"']+)["']\s*[,)]|data-i18n(?:-placeholder|-title|-aria-label|-alt)?=["']([^"']+)["']/g))assert(catalog[match[1]||match[2]],file+': '+(match[1]||match[2]));
  }
 });
 const app=await boot(),w=app.w,d=w.document;
 w.ZadNavigate('heart-daily');await tick();const sourceBefore=[...d.querySelectorAll('#heartPage-daily [data-source-content]')].map(e=>e.textContent);
 for(const lang of languages){
  await test(lang+': deep route UI, direction, attributes and source protection',async()=>{
   w.ZadSetLanguage(lang);await tick(90);
   assert.equal(d.documentElement.lang,lang);assert.equal(d.documentElement.dir,['ar','ur'].includes(lang)?'rtl':'ltr');assert.equal(w.localStorage.getItem('zad_islam_language_v3'),lang);
   assert.equal(d.querySelector('#v21FloatingLangCode').textContent,lang.toUpperCase());assert.equal(d.querySelector('#v21FloatingLanguage svg'),null);
   for(const route of routes){w.ZadNavigate(route);await tick(45);scan(w,lang,route);}
   w.ZadNavigate('heart-daily');await tick();assert.deepEqual([...d.querySelectorAll('#heartPage-daily [data-source-content]')].map(e=>e.textContent),sourceBefore);
   const field=d.querySelector('#heartGharibSearch');assert.equal(field.placeholder,w.ZadI18n.t(field.dataset.i18nPlaceholder));
   assert.deepEqual([...w.ZadI18n.missing],[]);
  });
  await test(lang+': every Heart remedy, Adhkar tab, completion, counter and empty state',async()=>{
   w.ZadNavigate('heart-remedy');await tick();const moods=[...d.querySelectorAll('#heartMoodGrid button')].map(e=>e.id.replace('heartMood-',''));assert(moods.length>=8);
   for(const mood of moods){w.heartChooseMood(mood);for(let i=0;i<12;i++){scan(w,lang,'remedy-'+mood,d.querySelector('#heartRemedyResult'));w.heartAnotherRemedy(mood);}}
   w.ZadNavigate('heart-azkar');await tick();const groups=[...d.querySelectorAll('#heartAzkarGroups button')].map(e=>e.getAttribute('onclick').match(/'([^']+)'/)[1]);assert.equal(groups.length,5);
   for(const group of groups){w.heartChooseAzkar(group);scan(w,lang,'azkar-'+group,d.querySelector('#heartPage-azkar'));const button=d.querySelector('.heartDhikrActions button');button.click();scan(w,lang,'azkar-count',d.querySelector('#heartPage-azkar'));}
   w.ZadNavigate('heart-tasbih');w.heartChooseTasbih('subhan');w.heartTasbihAdd();assert.equal(d.querySelector('#heartCounterButton').textContent,w.ZadI18n.number(1));w.heartTasbihUndo();assert.equal(d.querySelector('#heartCounterButton').textContent,w.ZadI18n.number(0));scan(w,lang,'tasbih',d.querySelector('#heartPage-tasbih'));
   w.ZadNavigate('heart-gharib');d.querySelector('#heartGharibSearch').value='__no_match__';w.heartRenderGharib();scan(w,lang,'empty',d.querySelector('#heartPage-gharib'));assert(d.querySelector('#heartWordGrid').textContent.trim());d.querySelector('#heartGharibSearch').value='';w.heartRenderGharib();
   w.ZadNavigate('heart-daily');w.heartCompleteDaily();scan(w,lang,'completed',d.querySelector('#heartPage-daily'));
  });
  await test(lang+': account, settings, selected language and accent persistence',async()=>{
   w.zadToggleMyPanel();for(const panel of ['home','auth','stats','leaderboard']){w.zadMyPanelShow(panel);await tick(50);scan(w,lang,'account-'+panel,d.querySelector('#zadMyPanelOverlay'));}w.zadCloseMyPanelPage();
   w.ZadSettings.open();scan(w,lang,'settings',d.querySelector('#settingsDialog'));for(const value of Object.keys(JSON.parse(fs.readFileSync(path.join(root,'data/accent-palettes.json'))))){d.querySelector('[data-accent-option="'+value+'"]').click();assert.equal(d.documentElement.dataset.accent,value);assert.equal(JSON.parse(w.localStorage.getItem(w.ZadAppearance.storageKey))[w.ZadAppearance.scope],value);assert.equal(d.querySelector('[data-accent-option="'+value+'"]').getAttribute('aria-pressed'),'true');}d.querySelector('#settingsDialog').close();
   w.v21OpenLanguage();await tick();assert.equal(d.querySelector('#v21LanguagePanel [aria-pressed="true"]').dataset.v21Lang,lang);assert.equal(d.activeElement.dataset.v21Lang,lang);d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await tick();assert.equal(d.querySelector('#v21LanguagePanel').getAttribute('aria-hidden'),'true');
  });
  await test(lang+': persisted language and accent in reload, PDF shell/error, and Seerah',async()=>{
   const storage={zad_islam_language_v3:lang,zad_accent_v1:'terracotta'};
   for(const file of ['index.html','reader.html','seerah.html']){const b=await boot({file,storage});const doc=b.w.document;assert.equal(doc.documentElement.lang,lang);assert.equal(doc.documentElement.dir,['ar','ur'].includes(lang)?'rtl':'ltr');assert.equal(doc.documentElement.dataset.accent,'terracotta');scan(b.w,lang,file);if(file==='reader.html'){doc.querySelector('#startReading').click();await tick(70);scan(b.w,lang,'PDF failure');assert.equal(doc.querySelector('#documentViewport h2').textContent,b.w.ZadI18n.t('document-reader.9fe0d0dc7d'));}assert.deepEqual([...b.w.ZadI18n.missing],[]);assert.deepEqual(b.errors,[]);}
  });
 }
 await test('UI interpolation escapes markup; source and UGC are not text-walked',()=>{
  const key=Object.keys(catalog).find(k=>catalog[k].en.includes('{v0}'));w.ZadSetLanguage('en');const payload='<img src=x onerror=alert(1)>';assert(!w.ZadI18n.html(key,{v0:payload}).includes('<img'));
  const host=d.createElement('div');host.innerHTML='<p data-source-content data-i18n="settings.accent">النص الديني الأصلي</p><p data-ugc>مرحبا من المستخدم</p>';d.body.append(host);w.ZadI18n.apply(host);assert.equal(host.children[0].textContent,'النص الديني الأصلي');assert.equal(host.children[1].textContent,'مرحبا من المستخدم');host.remove();
  assert.deepEqual(app.errors,[]);assert.deepEqual([...w.ZadI18n.missing],[]);
 });
 const report={generated:new Date().toISOString(),kind:'JSDOM/contracts; not rendered browser QA',catalogKeys:Object.keys(catalog).length,languages:coverage,missing,results,passed:results.filter(x=>x.status==='passed').length,failed:results.filter(x=>x.status==='failed').length};
 fs.writeFileSync(path.join(__dirname,'localization-results.json'),JSON.stringify(report,null,2)+'\n');process.exit(report.failed?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
