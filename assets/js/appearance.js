/* One owner for section colors. Legacy values are read once, never written again. */
window.ZadAppearance = (() => {
  'use strict';
  const names=Object.freeze(['emerald','olive','navy','burgundy','sand','teal','terracotta']);
  const storageKey='zad_scoped_palettes_v1';
  const scopes=new Set(['home','iman','ilm','library','aqidah','seerah','tafsir','more','media','rouh','wird','zad','heart','hadith','reader','admin']);
  const legacyKeys={wird:'wird_palette_v1',zad:'zad_palette_v1',heart:'heart_palette_v1',hadith:'hadith_palette_v1'};
  const legacyNames={mono:'sand',red:'burgundy',gold:'sand',purple:'burgundy',blue:'navy',rose:'burgundy',orange:'terracotta','grad-emerald-blue':'emerald','grad-purple-rose':'burgundy','grad-gold-orange':'sand','grad-blue-purple':'navy','grad-teal-blue':'teal','grad-red-purple':'burgundy','custom-gradient':'emerald'};
  const normalize=value=>names.includes(value)?value:(Object.hasOwn(legacyNames,value)?legacyNames[value]:null);
  function scopeFor(route){
    const file=location.pathname.split('/').pop().toLowerCase();
    if(file==='admin.html')return 'admin';
    if(file==='reader.html')return 'reader';
    if(file==='seerah.html')return 'seerah';
    const candidate=String(route??window.ZadCurrentRoute??Zad.initialRoute??'home').replace(/^#/,'').split('-')[0]||'home';
    return scopes.has(candidate)?candidate:'home';
  }
  let current=scopeFor();
  let saved=Zad.readJSON(storageKey,{});
  if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
  saved=Object.fromEntries(Object.entries(saved).filter(([scope,color])=>scopes.has(scope)&&scope!=='admin'&&names.includes(color)));
  function remember(scope,value){saved[scope]=value;Zad.storage.setItem(storageKey,JSON.stringify(saved));}
  function get(scope=current){
    if(scope==='admin')return 'emerald';
    if(saved[scope])return saved[scope];
    const migrated=legacyKeys[scope]&&normalize(Zad.storage.getItem(legacyKeys[scope]));
    if(migrated){remember(scope,migrated);return migrated;}
    return normalize(Zad.storage.getItem('zad_accent_v1'))||'emerald';
  }
  function activate(scope=scopeFor()){
    current=scopes.has(scope)?scope:'home';
    const value=get(current),root=document.documentElement;
    root.removeAttribute('data-palette');
    root.dataset.colorScope=current;
    root.dataset.accent=value;
    document.querySelectorAll('[data-accent-option]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.accentOption===value)));
    return value;
  }
  function set(value,scope=current){
    const color=normalize(value);
    if(!color||!scopes.has(scope)||scope==='admin')return false;
    remember(scope,color);
    if(scope===current)activate(scope);
    return true;
  }
  document.addEventListener('zad:route',event=>activate(scopeFor(event.detail?.view)));
  activate();
  return {names,storageKey,normalize,scopeFor,get,set,activate,get scope(){return current;}};
})();
