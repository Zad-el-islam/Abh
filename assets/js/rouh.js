/* Curated videos have local favorites; no player loads before an explicit click. */
(() => {
  'use strict';
  const videos=window.ZadRouhVideos, categories=['heart','worship','prayer','quran','repentance','resolve','weak','short','certainty'];
  const key='zad_rouh_saved_v1', esc=Zad.escape, t=k=>ZadI18n.t('rouh.'+k);
  let filter='all';
  function saved(){try{const x=JSON.parse(Zad.storage.getItem(key)||'[]');return Array.isArray(x)?x.filter(id=>videos.some(v=>v.id===id)):[];}catch(_){return [];}}
  function daily(date=new Date()){const pool=videos.filter(v=>v.daily_eligible);return pool[Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000)%pool.length];}
  function duration(s){return [Math.floor(s/3600),Math.floor(s%3600/60),s%60].filter((n,i)=>i||n).map((n,i)=>i?String(n).padStart(2,'0'):String(n)).join(':');}
  function card(v,featured=false){const isSaved=saved().includes(v.id);return `<article class="rouhCard${featured?' rouhFeatured':''}" data-rouh-id="${v.id}"><button type="button" class="rouhThumb" data-rouh-play="${v.id}" aria-label="${esc(t('play')+' — '+v.title)}"><img src="${v.thumbnail}" alt="" loading="lazy" width="480" height="270"><span class="rouhDuration" dir="ltr">${duration(v.duration_seconds)}</span></button><div class="rouhCopy">${featured?`<p class="eyebrow">${esc(t('daily'))}</p>`:''}<h3 dir="auto" data-source-content>${esc(v.title)}</h3><p class="meta" dir="auto" data-source-content>${esc(v.channel)}</p><p class="meta">${v.categories.map(c=>esc(t(c))).join(' · ')}${v.long_reference?' · '+esc(t('reference')):''}</p><div class="rouhActions"><button type="button" data-rouh-play="${v.id}">${esc(t('play'))}</button><button type="button" class="secondary" data-rouh-save="${v.id}" aria-pressed="${isSaved}">${esc(t(isSaved?'unsave':'save'))}</button><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(t('youtube'))} ↗</a></div></div></article>`;}
  function render(){const list=videos.filter(v=>filter==='all'||(filter==='saved'?saved().includes(v.id):v.categories.includes(filter)));return `<section id="rouhView"><nav class="breadcrumb" aria-label="${esc(ZadI18n.t('document-reader.95e840d5b7'))}"><a href="#home">${esc(ZadI18n.t('quran-reader.bfcf483079'))}</a><span>/</span><span aria-current="page">${esc(ZadGatewayLabelSafe())}</span></nav><header class="page-heading"><div><h1>${esc(ZadGatewayLabelSafe())}</h1><p class="section-intro">${esc(t('description'))}</p></div><a class="text-link" href="#home">${esc(ZadI18n.t('gateways.731b070b34'))}</a></header><h2 class="rouhQuestion">${esc(t('question'))}</h2><nav class="rouhFilters" aria-label="${esc(t('question'))}">${['all',...categories,'saved'].map(c=>`<button type="button" data-rouh-filter="${c}" aria-pressed="${filter===c}">${esc(t(c))}</button>`).join('')}</nav>${filter==='all'?card(daily(),true):''}<div class="rouhGrid">${list.length?list.map(v=>card(v)).join(''):`<p class="empty-state">${esc(t('empty'))}</p>`}</div></section>`;}
  function ZadGatewayLabelSafe(){return window.ZadGatewayLabel?.('rouh')||'زاد الروح';}
  function refresh(focus){const old=document.getElementById('rouhView');if(old){old.outerHTML=render();if(focus)document.querySelector(focus)?.focus();}}
  let activePlayer = null;
  function close(restoreFocus = true) {
    const player = activePlayer;
    if (!player) return;
    activePlayer = null;
    // Removing the browsing context stops its video/audio, including on route changes.
    player.iframe.remove();
    if (player.dialog.open) player.dialog.close();
    player.dialog.remove();
    document.documentElement.classList.remove('rouhPlayerOpen');
    if (restoreFocus && player.trigger?.isConnected) player.trigger.focus({preventScroll:true});
  }
  function play(id) {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    const trigger = document.activeElement;
    close(false);
    window.stopAllQuranAudio?.();
    document.querySelectorAll('video').forEach(v => v.pause());
    const dialog = document.createElement('dialog');
    dialog.id = 'rouhPlayer';
    dialog.className = 'rouhPlayer';
    dialog.setAttribute('aria-labelledby', 'rouhPlayerTitle');
    dialog.setAttribute('aria-describedby', 'rouhPlayerNote');
    dialog.innerHTML = `<div class="rouhPlayerHead"><strong id="rouhPlayerTitle" dir="auto" data-source-content>${esc(video.title)}</strong><button type="button" data-rouh-close autofocus aria-label="${esc(ZadI18n.t('settings.ca90c297b0'))}">×</button></div><div class="rouhPlayerScreen"></div><div class="rouhPlayerFallback"><p id="rouhPlayerNote">${esc(t('fallback'))}</p><a href="${esc(video.url)}" target="_blank" rel="noopener noreferrer">${esc(t('youtube'))} ↗</a></div>`;
    const iframe = document.createElement('iframe');
    iframe.title = video.title;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.setAttribute('allowfullscreen', '');
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    // Provider restrictions stay inside YouTube's own player. The fallback remains visible,
    // including when cross-origin errors cannot be inspected by the parent document.
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`;
    iframe.addEventListener('error', () => {
      if (activePlayer?.iframe === iframe) dialog.querySelector('#rouhPlayerNote').textContent = t('unavailable');
    });
    dialog.querySelector('.rouhPlayerScreen').append(iframe);
    document.body.append(dialog);
    activePlayer = {dialog, iframe, trigger};
    const closeThisPlayer = () => {if (activePlayer?.dialog === dialog) close();};
    dialog.querySelector('[data-rouh-close]').addEventListener('click', closeThisPlayer);
    dialog.addEventListener('cancel', event => {event.preventDefault();closeThisPlayer();});
    dialog.addEventListener('close', closeThisPlayer);
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {event.preventDefault();closeThisPlayer();}
    });
    dialog.addEventListener('click', event => {if (event.target === dialog) closeThisPlayer();});
    document.documentElement.classList.add('rouhPlayerOpen');
    dialog.showModal();
    dialog.querySelector('[data-rouh-close]').focus({preventScroll:true});
  }
  document.addEventListener('error', event => {
    const img = event.target;
    if (!img.matches?.('#rouhView .rouhThumb img')) return;
    const button = img.closest('.rouhThumb');
    img.hidden = true;
    button.classList.add('rouhThumbnailUnavailable');
    if (!button.querySelector('.rouhThumbnailFallback')) {
      const placeholder = document.createElement('span');
      placeholder.className = 'rouhThumbnailFallback';
      placeholder.setAttribute('aria-hidden','true');
      placeholder.innerHTML = Zad.icon('play');
      button.append(placeholder);
    }
  }, true);
  document.addEventListener('click',e=>{const b=e.target.closest('[data-rouh-filter],[data-rouh-save],[data-rouh-play]');if(!b)return;if(b.dataset.rouhFilter){filter=b.dataset.rouhFilter;refresh(`[data-rouh-filter="${filter}"]`);}else if(b.dataset.rouhSave){const id=b.dataset.rouhSave,ids=new Set(saved());ids.has(id)?ids.delete(id):ids.add(id);Zad.storage.setItem(key,JSON.stringify([...ids]));refresh(`[data-rouh-save="${id}"]`);}else play(b.dataset.rouhPlay);});
  document.addEventListener('zad:route',()=>close(false));document.addEventListener('zad:language',()=>{close(false);refresh();});
  window.ZadRouh={render,daily,saved};
})();
