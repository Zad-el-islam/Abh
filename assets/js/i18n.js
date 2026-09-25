/* One locale, one catalog. UI is translated at its render site. Source and user text are never walked. */
window.ZadI18n = (() => {
  'use strict';
  const languages = Object.freeze({ar:{name:'العربية',dir:'rtl'},en:{name:'English',dir:'ltr'},fr:{name:'Français',dir:'ltr'},id:{name:'Bahasa Indonesia',dir:'ltr'},tr:{name:'Türkçe',dir:'ltr'},ur:{name:'اردو',dir:'rtl'},es:{name:'Español',dir:'ltr'}});
  const storageKey='zad_islam_language_v3';
  const fixedLocale=document.documentElement.dataset.interfaceLanguage;
  let locale=fixedLocale||Zad.storage.getItem(storageKey)||'ar';
  const applied=new WeakMap();
  const referenceKeys=new Map(Object.entries(ZadI18nCatalog).map(([k,v])=>[v.ar,k]));
  if(!languages[locale]) locale='ar';
  const missing=new Set();
  function t(key,params={}) {
    const row=ZadI18nCatalog[key];
    if(!row?.[locale]) missing.add(locale+':'+key);
    const value=row?.[locale]||row?.ar||'';
    return value.replace(/\{(\w+)\}/g,(whole,name)=>Object.hasOwn(params,name)?String(params[name]??''):whole);
  }
  function html(key,params={}) {return Zad.escape(t(key,params));}
  function source(value){return '<span data-source-content lang="ar" dir="rtl">'+Zad.escape(value)+'</span>';}
  function pack(key){return ZadI18nCatalog[key]||{};}
  function ui(key){return Object.hasOwn(ZadI18nCatalog,key)?t(key):referenceKeys.has(key)?t(referenceKeys.get(key)):String(key??'');}
  function apply(scope=document){
    for(const el of scope.querySelectorAll("[data-i18n-number]"))el.textContent=(el.dataset.numberPrefix||"")+number(el.dataset.i18nNumber);
    const els=[...(scope.matches?.('[data-i18n]')?[scope]:[]),...scope.querySelectorAll('[data-i18n],[data-i18n-placeholder],[data-i18n-title],[data-i18n-aria-label],[data-i18n-alt]')];
    for(const el of els){
      if(el.closest('[data-source-content]'))continue;
      if(el.dataset.i18n){const last=applied.get(el);if(last===undefined||el.textContent===last||el.textContent.replace(/\p{Extended_Pictographic}\uFE0F?|\uFE0F/gu,'').trim()===last.replace(/\p{Extended_Pictographic}\uFE0F?|\uFE0F/gu,'').trim()){el.textContent=t(el.dataset.i18n);applied.set(el,el.textContent);}}
      for(const attr of ['placeholder','title','aria-label','alt']){const key=el.getAttribute('data-i18n-'+attr);if(key)el.setAttribute(attr,t(key));}
    }
  }
  function setLocale(code){
    if(!languages[code])return false;
    locale=fixedLocale||code;if(!fixedLocale)Zad.storage.setItem(storageKey,code);
    document.documentElement.lang=locale;document.documentElement.dir=languages[locale].dir;
    document.documentElement.dataset.v21Lang=code;
    apply();return true;
  }
  const number=value=>new Intl.NumberFormat(locale,{maximumFractionDigits:2,useGrouping:false}).format(Number(value)||0);
  setLocale(locale);
  document.addEventListener('DOMContentLoaded',()=>apply());
  document.addEventListener('zad:language',()=>{apply();document.querySelectorAll('.site-toast,.heartToast').forEach(el=>el.classList.remove('show'));});
  return {t,html,pack,ui,source,apply,setLocale,number,languages,missing,storageKey,get locale(){return locale;}};
})();
