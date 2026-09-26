/* Focused DOM/CSS contracts; live provider results and rendered-browser limits are separate. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),postcss=require('postcss');
const {boot,tick,root}=require('./dom-harness.cjs');
const results=[],videoMatrix=[];
async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL',name,e.stack);}}
const css=postcss.parse(['design-system.css','rouh.css'].map(f=>fs.readFileSync(path.join(root,'assets/css',f),'utf8')).join('\n'));
function applies(rule,width){for(let p=rule.parent;p;p=p.parent){if(p.type!=='atrule')continue;if(p.name!=='media')continue;if(/prefers-reduced-motion/.test(p.params))return false;for(const m of p.params.matchAll(/(min|max)-width:\s*(\d+)px/g)){if(m[1]==='min'&&width<+m[2]||m[1]==='max'&&width>+m[2])return false;}}return true;}
function declarations(selector,width){const d={};css.walkRules(rule=>{if(rule.selector.split(',').map(x=>x.trim()).includes(selector)&&applies(rule,width))rule.nodes.filter(n=>n.type==='decl').forEach(n=>d[n.prop]=n.value);});return d;}
(async()=>{
 const app=await boot(),w=app.w,d=w.document;
 await test('Homepage has four equal gateway cards, unique 01–04 icons/actions, Rouh in main navigation',()=>{
  const cards=[...d.querySelectorAll('.gateway-grid>.gateway-card')];assert.equal(cards.length,4);assert.deepEqual(cards.map(c=>c.querySelector('h2 a').hash),['#iman','#ilm','#media','#rouh']);assert.deepEqual(cards.map(c=>c.querySelector('.gateway-number').textContent),['01','02','03','04']);
  for(const c of cards){assert(c.querySelector('.gateway-card-top svg'));assert(c.querySelector('p').textContent.trim());assert(c.querySelectorAll('.gateway-topics span').length>=2);assert.equal(c.querySelector('.gateway-open').hash,c.querySelector('h2 a').hash);}
  assert.equal(d.querySelectorAll('.primary-nav a[data-route="rouh"]').length,1);assert.equal(d.querySelectorAll('.quiet-links a[href="#rouh"]').length,0);
 });
 await test('Library remains inside Ilm; Rouh header, route, return and browser back work',async()=>{
  w.ZadNavigate('ilm');assert(d.querySelector('.module-grid a[href="#library"]'));w.ZadNavigate('library');assert(d.querySelector('.breadcrumb a[href="#ilm"]'));w.ZadNavigate('home');assert(!d.querySelector('.gateway-card h2 a[href="#library"]'));d.querySelector('.gateway-card.rouh .gateway-open').click();assert.equal(w.ZadCurrentRoute,'rouh');assert.equal(w.location.hash,'#rouh');assert.equal(d.querySelector('#rouhView h1').textContent,'زاد الروح');assert.equal(d.querySelector('.rouhQuestion').textContent,'ماذا يحتاج قلبك الآن؟');assert.equal(d.querySelector('.primary-nav [aria-current="page"]').dataset.route,'rouh');d.querySelector('#rouhView .page-heading a[href="#home"]').click();assert.equal(w.ZadCurrentRoute,'home');w.history.back();await tick(90);assert.equal(w.ZadCurrentRoute,'rouh');
 });
 await test('All seven languages cover gateway/nav/search/landing labels without translating source metadata',async()=>{
  for(const lang of ['ar','en','fr','id','tr','ur','es']){w.ZadSetLanguage(lang);w.ZadNavigate('home');assert.equal(d.querySelector('.gateway-card.rouh h2').textContent,w.ZadI18n.t('gateways.ca3dff37d8'));assert.equal(d.querySelector('.primary-nav [data-route="rouh"]').textContent,w.ZadI18n.t('gateways.ca3dff37d8'));w.ZadNavigate('rouh');assert.equal(d.querySelector('.rouhQuestion').textContent,w.ZadI18n.t('rouh.question'));for(const v of w.ZadRouhVideos)assert.equal(d.querySelector(`[data-rouh-id="${v.id}"] h3`).textContent,v.title);assert.deepEqual([...w.ZadI18n.missing],[]);}
  w.ZadSettings.search();const input=d.getElementById('globalSearchInput');input.value='rouh';input.dispatchEvent(new w.Event('input')); // visible translated name is searched as well
  input.value='روح';input.dispatchEvent(new w.Event('input'));assert(d.querySelector('#globalSearchResults a[href="#rouh"]'));d.getElementById('searchDialog').close();w.ZadSetLanguage('ar');
 });
 for(const width of [390,768,1440]){
  await test(width+'px: CSS gateway/grid, navigation and 16:9 modal sizing contracts',()=>{
   const grid=declarations('.gateway-grid',width);assert.equal(grid['grid-template-columns'],width===390?'1fr':'repeat(2,minmax(0,1fr))');const modal=declarations('.rouhPlayer',width);assert.equal(modal['box-sizing'],'border-box');assert(modal['max-height'].includes('100dvh'));assert.equal(modal['overflow-y'],'auto');assert.equal(declarations('.rouhPlayerScreen',width)['aspect-ratio'],'16/9');
   const outer=width===390?width-16:Math.min(920,width-32),padding=width===390?8:20,inner=outer-padding*2-2;assert(outer<width);assert(inner>=200&&inner*9/16>=200);if(width===390){assert.equal(declarations('.primary-nav',width)['overflow-x'],'auto');assert.equal(declarations('.primary-nav a',width)['white-space'],'nowrap');}
  });
  await test(width+'px: all ten primary Play buttons create only one in-site frame; close/ESC stop its context',async()=>{
   Object.defineProperty(w,'innerWidth',{value:width,configurable:true});w.ZadNavigate('rouh');assert.equal(d.querySelectorAll('#rouhPlayer iframe').length,0);
   for(const [i,v] of w.ZadRouhVideos.entries()){
    const card=d.querySelector(`[data-rouh-id="${v.id}"]`),img=card.querySelector('.rouhThumb img'),button=card.querySelector('.rouhActions [data-rouh-play]');assert.equal(img.src,v.thumbnail);assert.equal(img.loading||img.getAttribute('loading'),'lazy');assert.equal(button.tagName,'BUTTON');assert(!button.hasAttribute('href'));button.focus();button.click();
    const dialog=d.querySelector('#rouhPlayer'),frame=dialog.querySelector('iframe'),u=new URL(frame.src);assert(dialog.open);assert.equal(u.origin,'https://www.youtube-nocookie.com');assert.equal(u.pathname,'/embed/'+v.id);assert.equal(u.searchParams.get('playsinline'),'1');assert.equal(u.searchParams.get('autoplay'),'1');assert.equal(d.querySelectorAll('#rouhPlayer iframe').length,1);assert.equal(frame.title,v.title);assert.equal(frame.referrerPolicy,'strict-origin-when-cross-origin');assert.equal(dialog.querySelector('a').href,v.url);assert.equal(d.activeElement,dialog.querySelector('[data-rouh-close]'));
    if(i%3===0)dialog.querySelector('[data-rouh-close]').click();else if(i%3===1)dialog.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));else dialog.dispatchEvent(new w.Event('cancel',{cancelable:true}));
    assert(!dialog.isConnected);assert(!frame.isConnected);assert.equal(d.querySelectorAll('#rouhPlayer iframe').length,0);assert(!d.documentElement.classList.contains('rouhPlayerOpen'));assert.equal(d.activeElement,button);videoMatrix.push({id:v.id,width,domEmbed:'passed',thumbnailUrl:'passed',close:'passed',livePlayback:'not_verified'});
   }
  });
 }
 await test('Opening another video removes the previous frame; old callbacks cannot close the current one',()=>{
  const buttons=d.querySelectorAll('.rouhGrid .rouhActions [data-rouh-play]');buttons[0].click();const old=d.getElementById('rouhPlayer'),frame=old.querySelector('iframe');buttons[1].click();const current=d.getElementById('rouhPlayer');assert.notEqual(current,old);assert(!frame.isConnected);assert.equal(d.querySelectorAll('#rouhPlayer iframe').length,1);old.dispatchEvent(new w.Event('close'));assert(current.isConnected);current.querySelector('[data-rouh-close]').click();
 });
 await test('Graceful thumbnail/frame failure retains primary Play and secondary original YouTube fallback',()=>{
  const card=d.querySelector('.rouhGrid .rouhCard'),img=card.querySelector('img');img.dispatchEvent(new w.Event('error'));assert(img.hidden);assert(card.querySelector('.rouhThumbnailFallback'));card.querySelector('.rouhActions [data-rouh-play]').click();const dialog=d.getElementById('rouhPlayer');dialog.querySelector('iframe').dispatchEvent(new w.Event('error'));assert.equal(dialog.querySelector('#rouhPlayerNote').textContent,w.ZadI18n.t('rouh.unavailable'));assert(dialog.querySelector('a').href.startsWith('https://youtu.be/'));dialog.querySelector('[data-rouh-close]').click();assert(!d.querySelector('[onerror]'));
 });
 await test('Route/language changes remove iframe/audio context and preserve saved videos',async()=>{
  const button=d.querySelector('.rouhGrid [data-rouh-save]');button.click();const before=w.localStorage.getItem('zad_rouh_saved_v1');d.querySelector('.rouhActions [data-rouh-play]').click();const frame=d.querySelector('#rouhPlayer iframe');w.ZadNavigate('home');assert(!frame.isConnected);w.ZadNavigate('rouh');d.querySelector('.rouhActions [data-rouh-play]').click();w.ZadSetLanguage('en');await tick();assert.equal(d.querySelectorAll('#rouhPlayer').length,0);assert.equal(w.localStorage.getItem('zad_rouh_saved_v1'),before);
 });
 await test('Rouh scoped palettes, light/dark and deep-link refresh preserve independent Home selection',async()=>{
  w.ZadNavigate('home');w.ZadSettings.setAccent('burgundy');w.ZadNavigate('rouh');w.ZadSettings.setAccent('navy');for(const theme of ['light','dark']){w.ZadSettings.setTheme(theme);assert.equal(d.documentElement.dataset.accent,'navy');assert.equal(d.documentElement.dataset.theme,theme);}w.ZadNavigate('home');assert.equal(d.documentElement.dataset.accent,'burgundy');const storage=Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>{const k=w.localStorage.key(i);return [k,w.localStorage.getItem(k)];}));const b=await boot({hash:'#rouh',storage});assert.equal(b.w.ZadCurrentRoute,'rouh');assert.equal(b.w.document.documentElement.dataset.accent,'navy');assert.equal(b.w.document.querySelector('.primary-nav [aria-current="page"]').dataset.route,'rouh');assert.deepEqual(b.errors,[]);
 });
 await test('CSP permits only exact thumbnail/embed paths and no new remote parent scripts',()=>{
  const csp=d.querySelector('meta[http-equiv="Content-Security-Policy"]').content,parts=Object.fromEntries(csp.split(';').filter(x=>x.trim()).map(x=>{const [k,...v]=x.trim().split(/\s+/);return[k,v];}));assert(parts['img-src'].includes('https://i.ytimg.com/vi/'));assert(parts['frame-src'].includes('https://www.youtube-nocookie.com/embed/'));assert(parts['frame-src'].includes('https://www.youtube.com/embed/'));assert(!parts['script-src'].some(x=>x.includes('youtube')));assert(!parts['frame-src'].some(x=>x.includes('*')));assert.equal(d.querySelectorAll('script[src]').length,0);assert.deepEqual(app.errors,[]);
 });
 const out={generated:new Date().toISOString(),scope:'Automated DOM and CSS breakpoint contracts; no rendered layout or YouTube playback claim',widths:[390,768,1440],passed:results.filter(x=>x.status==='passed').length,failed:results.filter(x=>x.status==='failed').length,results,videoMatrix};fs.writeFileSync(path.join(__dirname,'rouh-gateway-results.json'),JSON.stringify(out,null,2)+'\n');process.exit(out.failed?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
