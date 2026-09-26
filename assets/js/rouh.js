/* Curated videos have local favorites; no player loads before an explicit click. */
(() => {
  'use strict';
  // Only player labels are added here; the shared catalog remains unchanged.
  const playerLabels = {
    'play-inside': ['▶ تشغيل داخل الموقع','▶ Play on this site','▶ Lire sur ce site','▶ Putar di situs ini','▶ Sitede oynat','▶ سائٹ پر چلائیں','▶ Reproducir aquí'],
    'choose-video': ['▶ اختر مقطعًا لبدء المشاهدة','▶ Select a video to start watching','▶ Choisissez une vidéo pour commencer','▶ Pilih video untuk mulai menonton','▶ İzlemek için bir video seçin','▶ دیکھنے کے لیے ویڈیو منتخب کریں','▶ Elige un vídeo para empezar'],
    'enlarge': ['تكبير المشغل','Enlarge player','Agrandir le lecteur','Perbesar pemutar','Oynatıcıyı büyüt','پلیئر بڑا کریں','Ampliar reproductor'],
    'reduce': ['تصغير المشغل','Reduce player','Réduire le lecteur','Perkecil pemutar','Oynatıcıyı küçült','پلیئر چھوٹا کریں','Reducir reproductor'],
    'youtube-original': ['فتح على YouTube','Open on YouTube','Ouvrir sur YouTube','Buka di YouTube','YouTube’da aç','YouTube پر کھولیں','Abrir en YouTube'],
    'embed-unavailable': ['يتعذر تشغيل هذا المقطع داخل الموقع.','This video cannot be played on this site.','Cette vidéo ne peut pas être lue sur ce site.','Video ini tidak dapat diputar di situs ini.','Bu video sitede oynatılamıyor.','یہ ویڈیو سائٹ پر نہیں چل سکتی۔','Este vídeo no se puede reproducir aquí.']
  };
  for (const [key, values] of Object.entries(playerLabels)) window.ZadI18nCatalog['rouh.' + key] = Object.fromEntries(['ar','en','fr','id','tr','ur','es'].map((lang, i) => [lang, values[i]]));
  const videos=window.ZadRouhVideos, categories=['heart','worship','prayer','quran','repentance','resolve','weak','short','certainty'];
  const key='zad_rouh_saved_v1', esc=Zad.escape, t=k=>ZadI18n.t('rouh.'+k);
  let filter='all';
  function saved(){try{const x=JSON.parse(Zad.storage.getItem(key)||'[]');return Array.isArray(x)?x.filter(id=>videos.some(v=>v.id===id)):[];}catch(_){return [];}}
  function daily(date=new Date()){const pool=videos.filter(v=>v.daily_eligible);return pool[Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000)%pool.length];}
  function duration(s){return [Math.floor(s/3600),Math.floor(s%3600/60),s%60].filter((n,i)=>i||n).map((n,i)=>i?String(n).padStart(2,'0'):String(n)).join(':');}
  function card(v,featured=false){const isSaved=saved().includes(v.id);return `<article class="rouhCard${featured?' rouhFeatured':''}" data-rouh-id="${v.id}"><button type="button" class="rouhThumb" data-rouh-play="${v.id}" aria-label="${esc(t('play-inside')+' — '+v.title)}"><img src="${v.thumbnail}" alt="" loading="lazy" width="480" height="270"><span class="rouhDuration" dir="ltr">${duration(v.duration_seconds)}</span></button><div class="rouhCopy">${featured?`<p class="eyebrow">${esc(t('daily'))}</p>`:''}<h3 dir="auto" data-source-content>${esc(v.title)}</h3><p class="meta" dir="auto" data-source-content>${esc(v.channel)}</p><p class="meta">${v.categories.map(c=>esc(t(c))).join(' · ')}${v.long_reference?' · '+esc(t('reference')):''}</p><div class="rouhActions"><button type="button" data-rouh-play="${v.id}">${esc(t('play-inside'))}</button><button type="button" class="secondary" data-rouh-save="${v.id}" aria-pressed="${isSaved}">${esc(t(isSaved?'unsave':'save'))}</button><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(t('youtube-original'))} ↗</a></div></div></article>`;}
  function render(){const list=videos.filter(v=>filter==='all'||(filter==='saved'?saved().includes(v.id):v.categories.includes(filter)));return `<section id="rouhView"><nav class="breadcrumb" aria-label="${esc(ZadI18n.t('document-reader.95e840d5b7'))}"><a href="#home">${esc(ZadI18n.t('quran-reader.bfcf483079'))}</a><span>/</span><span aria-current="page">${esc(ZadGatewayLabelSafe())}</span></nav><header class="page-heading"><div><h1>${esc(ZadGatewayLabelSafe())}</h1><p class="section-intro">${esc(t('description'))}</p></div><a class="text-link" href="#home">${esc(ZadI18n.t('gateways.731b070b34'))}</a></header><h2 class="rouhQuestion">${esc(t('question'))}</h2>${playerArea()}<nav class="rouhFilters" aria-label="${esc(t('question'))}">${['all',...categories,'saved'].map(c=>`<button type="button" data-rouh-filter="${c}" aria-pressed="${filter===c}">${esc(t(c))}</button>`).join('')}</nav>${filter==='all'?card(daily(),true):''}<div class="rouhGrid">${list.length?list.map(v=>card(v)).join(''):`<p class="empty-state">${esc(t('empty'))}</p>`}</div></section>`;}
  function ZadGatewayLabelSafe(){return window.ZadGatewayLabel?.('rouh')||'زاد الروح';}
  function playerArea() {
    return `<section id="rouhPlayer" class="rouhPlayer" aria-labelledby="rouhPlayerTitle"><div class="rouhPlayerHead"><strong id="rouhPlayerTitle" dir="auto" data-source-content>${esc(t('choose-video'))}</strong><div class="rouhPlayerButtons" hidden><button type="button" data-rouh-enlarge aria-pressed="false">${esc(t('enlarge'))}</button><button type="button" data-rouh-close aria-label="${esc(ZadI18n.t('settings.ca90c297b0'))}">×</button></div></div><div class="rouhPlayerScreen"><p class="rouhPlayerEmpty">${esc(t('choose-video'))}</p></div><div class="rouhPlayerFallback" hidden><p id="rouhPlayerNote" role="status">${esc(t('fallback'))}</p><a data-rouh-youtube target="_blank" rel="noopener noreferrer">${esc(t('youtube-original'))} ↗</a></div></section>`;
  }
  function refresh(focus) {
    const old = document.getElementById('rouhView');
    if (!old) return;
    // Replace only the video list. Moving a live iframe can reload its browsing
    // context, so keep the player and its ancestor in place while filtering/saving.
    const template = document.createElement('template');
    template.innerHTML = render();
    const next = template.content.querySelector('#rouhView');
    for (const selector of ['.rouhFilters', '.rouhGrid']) old.querySelector(selector)?.replaceWith(next.querySelector(selector));
    const featured = old.querySelector('.rouhFeatured'), newFeatured = next.querySelector('.rouhFeatured');
    if (featured && newFeatured) featured.replaceWith(newFeatured);
    else if (featured) featured.remove();
    else if (newFeatured) old.querySelector('.rouhGrid').before(newFeatured);
    if (focus) old.querySelector(focus)?.focus();
  }
  let activePlayer = null, apiPromise = null;
  function youtubeAPI() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(resolve => {
      let settled = false;
      const previous = window.onYouTubeIframeAPIReady;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve(window.YT?.Player ? window.YT : null);
      };
      window.onYouTubeIframeAPIReady = () => {
        try { if (typeof previous === 'function') previous(); } finally { finish(); }
      };
      const timeout = setTimeout(finish, 15000);
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.addEventListener('error', finish, {once:true});
      document.head.append(script);
    });
    return apiPromise;
  }
  function close(restoreFocus = true) {
    const player = activePlayer;
    if (!player) return;
    activePlayer = null;
    // Same lifecycle as Seerah: destroy the previous iframe browsing context.
    try { player.controller?.destroy(); } catch (_) { /* Always remove the context below. */ }
    player.iframe.remove();
    if (document.fullscreenElement === player.area) Promise.resolve(document.exitFullscreen?.()).catch(() => {});
    player.area.classList.remove('rouhPlayerExpanded');
    if (player.area.isConnected) {
      const template = document.createElement('template');
      template.innerHTML = playerArea();
      player.area.replaceWith(template.content);
    }
    if (restoreFocus && player.trigger?.isConnected) player.trigger.focus({preventScroll:true});
  }
  function play(id) {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    const trigger = document.activeElement;
    close(false);
    const area = document.getElementById('rouhPlayer');
    if (!area) return;
    window.stopAllQuranAudio?.();
    document.querySelectorAll('video').forEach(v => v.pause());
    const iframe = document.createElement('iframe');
    iframe.title = video.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
    iframe.setAttribute('allowfullscreen', '');
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    // Seerah's existing no-cookie origin is already permitted by the site's CSP.
    // Keep native YouTube controls, play inline on mobile, and load only on click.
    const url = new URL(`https://www.youtube-nocookie.com/embed/${video.id}`);
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('rel', '0');
    url.searchParams.set('controls', '1');
    url.searchParams.set('fs', '1');
    url.searchParams.set('enablejsapi', '1');
    if (/^https?:$/.test(location.protocol)) url.searchParams.set('origin', location.origin);
    iframe.src = url.href;
    area.querySelector('#rouhPlayerTitle').textContent = video.title;
    area.querySelector('[data-rouh-youtube]').href = video.url;
    area.querySelector('.rouhPlayerButtons').hidden = false;
    area.querySelector('.rouhPlayerFallback').hidden = false;
    iframe.addEventListener('error', () => {
      if (activePlayer?.iframe === iframe) area.querySelector('#rouhPlayerNote').textContent = t('embed-unavailable');
    });
    area.querySelector('.rouhPlayerScreen').replaceChildren(iframe);
    const player = {area, iframe, trigger, controller:null};
    activePlayer = player;
    // The native iframe starts independently. The official optional API reports
    // embedding restrictions; no private postMessage protocol or proxy is used.
    youtubeAPI().then(YT => {
      if (!YT || activePlayer !== player || !iframe.isConnected) return;
      try {
        player.controller = new YT.Player(iframe, {events:{
          onError: () => {
            if (activePlayer === player) area.querySelector('#rouhPlayerNote').textContent = t('embed-unavailable');
          }
        }});
      } catch (_) { /* Keep the native frame and original link if API setup fails. */ }
    });
    area.scrollIntoView({block:'start', behavior:'auto'});
    area.querySelector('[data-rouh-close]').focus({preventScroll:true});
  }
  async function enlarge() {
    const player = activePlayer;
    if (!player) return;
    const expanded = !player.area.classList.contains('rouhPlayerExpanded');
    player.area.classList.toggle('rouhPlayerExpanded', expanded);
    const button = player.area.querySelector('[data-rouh-enlarge]');
    button.setAttribute('aria-pressed', String(expanded));
    button.textContent = t(expanded ? 'reduce' : 'enlarge');
    try {
      if (expanded && player.area.requestFullscreen) await player.area.requestFullscreen();
      else if (!expanded && document.fullscreenElement === player.area) await document.exitFullscreen();
    } catch (_) { /* The enlarged in-page player remains available if fullscreen is denied. */ }
  }
  document.addEventListener('click', event => {
    if (event.target.closest('[data-rouh-close]')) close();
    else if (event.target.closest('[data-rouh-enlarge]')) enlarge();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && activePlayer) close(); });
  document.addEventListener('fullscreenchange', () => {
    if (!activePlayer || document.fullscreenElement === activePlayer.area) return;
    activePlayer.area.classList.remove('rouhPlayerExpanded');
    const button = activePlayer.area.querySelector('[data-rouh-enlarge]');
    button.setAttribute('aria-pressed', 'false');
    button.textContent = t('enlarge');
  });
  window.addEventListener('pagehide', () => close(false));
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
  document.addEventListener('zad:route',()=>close(false));document.addEventListener('zad:language',()=>{close(false);const view=document.getElementById('rouhView');if(view)view.outerHTML=render();});
  window.ZadRouh={render,daily,saved};
})();
