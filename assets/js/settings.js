/* Settings and search use native dialogs; reading and account data keep their existing keys. */
window.ZadSettings = (() => {
  'use strict';
  const T = i => ZadI18n.t(["gateways.eeeabade98","quran-reader.bfcf483079","gateways.249b9bc3b4","gateways.9cfadeada3","gateways.fe99b36520","quran-reader.5fd9563e68","gateways.6520b21edd","settings.66dcee1f46","settings.41a3c0033a","settings.ba0ba5f087","settings.5bb00398b2","settings.b85dec8fda","settings.aabb4f12fa","settings.b95b2ced0e","settings.48eb16a307","settings.560ef2b686","settings.f3569af245","settings.fd52a3d1cd","settings.c530d24d73","settings.ca90c297b0","settings.94b1969e15","settings.f8d52dd9b0","gateways.f7c9bb7bc3","gateways.fdf8eba0a0","settings.b36e86980a","quran-reader.0cde29a629","quran-reader.ff27a05115","gateways.fb7e622386","settings.7a6988a2b7","settings.c85686ecb0","settings.41fa3f074a"][i]);
  const esc = Zad.escape;

  function translate() {
    const map = {
      brand: 0,
      home: 1,
      iman: 2,
      ilm: 3,
      media: 4,
      settings: 5,
      language: 6,
      account: 7,
      search: 8,
      about: 9,
      footerPrayer: 10,
      footer: 10
    };
    document.querySelectorAll('[data-icon]').forEach(el => {
      if (!el.firstElementChild) el.innerHTML = Zad.icon(el.dataset.icon);
    });
    document.querySelectorAll('[data-ui]').forEach(el => {
      if (map[el.dataset.ui] != null) el.textContent = T(map[el.dataset.ui]);
    });
    document.querySelectorAll('.header-actions [data-action]').forEach(el => {
      const index = map[el.dataset.action];
      if (index != null) {
        el.setAttribute('aria-label', T(index));
        el.title = T(index);
      }
    });
    document.querySelector('.skip-link').textContent = ZadI18n.t("settings.71b5f72781");
  }

  function dialog(id, title, body) {
    let d = document.getElementById(id);
    if (d) d.remove();
    d = document.createElement('dialog');
    d.id = id;
    d.setAttribute('aria-labelledby', id + 'Title');
    d.innerHTML = `<div class="dialog-head"><h2 id="${id}Title">${esc(title)}</h2><button type="button" class="icon-button" data-dialog-close aria-label="${esc(T(19))}">${Zad.icon('close')}</button></div><div class="dialog-body">${body}</div>`;
    document.body.append(d);
    const trigger = document.activeElement;
    d.addEventListener('click', e => {
      if (e.target === d || e.target.closest('[data-dialog-close]')) d.close();
    });
    d.addEventListener('close', () => trigger?.focus({
      preventScroll: true
    }), {
      once: true
    });
    d.showModal();
    return d;
  }

  function setTheme(theme) {
    const value = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = value;
    Zad.storage.setItem('zad_theme_v2', value);
    ['wird_theme_v1', 'zad_theme_v1', 'heart_theme_v1', 'hadith_theme_v1'].forEach(k => Zad.storage.setItem(k, value));
    document.querySelectorAll('[data-theme-option]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeOption === value)));
  }

  const accents=ZadAppearance.names;
  const setAccent=value=>ZadAppearance.set(value);
  function accentControls(){return '<div class="settings-group"><h3>'+ZadI18n.html('settings.accent')+'</h3><div class="accent-options">'+accents.map(v=>'<button type="button" data-accent-option="'+v+'" aria-pressed="'+((document.documentElement.dataset.accent||'emerald')===v)+'"><i class="accent-swatch" data-swatch="'+v+'" aria-hidden="true"></i><span>'+ZadI18n.html('settings.accent.'+v)+'</span></button>').join('')+'</div></div>';}
  function setSize(size) {
    const value = ['small', 'normal', 'large', 'xlarge'].includes(size) ? size : 'normal';
    document.documentElement.dataset.readerSize = value;
    Zad.storage.setItem('zadReaderSizeFinalV1', value);
    document.querySelectorAll('[data-size-option]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sizeOption === value)));
  }

  function open() {
    const d = dialog('settingsDialog', T(5), `<div class="settings-group"><h3>${T(11)}</h3><div class="segmented">${['light','dark'].map((v,i)=>`<button type="button" data-theme-option="${v}" aria-pressed="${document.documentElement.dataset.theme===v}">${Zad.icon(v==='dark'?'moon':'sun')}${T(12+i)}</button>`).join('')}</div></div>${accentControls()}<div class="settings-group"><h3>${T(14)}</h3><div class="segmented">${['small','normal','large','xlarge'].map((v,i)=>`<button type="button" data-size-option="${v}" aria-pressed="${(document.documentElement.dataset.readerSize||'normal')===v}">${T(15+i)}</button>`).join('')}</div></div><div class="settings-group"><button type="button" class="settings-link" data-settings-language>${T(6)}${Zad.icon('globe')}</button><button type="button" class="settings-link" data-settings-wird>${T(22)}${Zad.icon('book')}</button><button type="button" class="settings-link" data-settings-greeting>${T(29)}${Zad.icon('heart')}</button></div><p>${T(28)}</p>`);
    d.addEventListener('click', e => {
      const theme = e.target.closest('[data-theme-option]'),
        size = e.target.closest('[data-size-option]');
      const accent=e.target.closest('[data-accent-option]');
      if(accent)setAccent(accent.dataset.accentOption);
      if (theme) setTheme(theme.dataset.themeOption);
      if (size) setSize(size.dataset.sizeOption);
      if (e.target.closest('[data-settings-language]')) {
        d.close();
        v21OpenLanguage();
      }
      if (e.target.closest('[data-settings-wird]')) {
        d.close();
        ZadNavigate('wird-settings');
      }
      if (e.target.closest('[data-settings-greeting]')) {
        d.close();
        ZadGreeting.show(true);
      }
    });
  }

  function search() {
    const routes = [
      ['wird', 22, 'قرآن quran coran kuran'],
      ['library', 23, 'كتب books bibliothèque kitap'],
      ['hadith', 24, 'حديث سنة hadith hadis'],
      ['heart-azkar', 25, 'أذكار azkar dhikr zikir'],
      ['heart-tasbih', 26, 'مسبحة تسبيح tasbih'],
      ['seerah', 27, 'سيرة seerah sirah'],
      ['zad', null, 'زاد المحارب steadfastness رسائل'],
      ['media', 4, 'زاد توك video مقاطع'],
      ['aqidah', null, 'عقيدة creed aqidah']
    ];
    const d = dialog('searchDialog', T(20), `<label class="search-field">${Zad.icon('search')}<input id="globalSearchInput" type="search" placeholder="${esc(T(21))}" aria-label="${esc(T(8))}" autocomplete="off"></label><div class="global-results" id="globalSearchResults" aria-live="polite"></div>`);
    const list = d.querySelector('#globalSearchResults');

    function render() {
      const q = Zad.normalize(d.querySelector('input').value);
      const rows = routes.map(([route, i, terms]) => ({
        url: '#' + route,
        title: i != null ? T(i) : route === 'zad' ? (ZadI18n.t("gateways.017bfb0913")) : (ZadI18n.t("gateways.4c70ca74a0")),
        terms
      })).concat(ZadDocuments.map(b => ({
        url: 'reader.html?book=' + b.id,
        title: Zad.isArabic() ? b.title : b.englishTitle,
        terms: b.title + ' ' + b.englishTitle + ' ' + b.author
      }))).filter(r => !q || Zad.normalize(r.title + ' ' + r.terms).includes(q));
      list.innerHTML = rows.length ? rows.map(r => `<a href="${r.url}"><strong>${esc(r.title)}</strong></a>`).join('') : `<p class="search-no-results">${T(30)}</p>`;
    }
    d.querySelector('input').addEventListener('input', render);
    list.addEventListener('click', e => {
      if (e.target.closest('a')) d.close();
    });
    render();
    d.querySelector('input').focus();
  }

  function about() {
    dialog('aboutDialog', T(9), `<p>${ZadI18n.t("settings.eaf85ae743")}</p><p>${T(28)}</p><p>${ZadI18n.t("settings.36be01299d")}</p><p>${T(10)}</p>`);
  }
  window.globalCloseSettings = () => document.getElementById('settingsDialog')?.close();
  window.toggleTheme = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  translate();
  document.addEventListener('zad:language', () => {translate();const note=document.getElementById('greetingNote');if(note){note.querySelector('small').textContent=ZadI18n.t('settings.be657896f5');note.querySelector('button').setAttribute('aria-label',ZadI18n.t('settings.c7576888db'));}});
  return {
    open,
    search,
    about,
    translate,
    setTheme,
    setAccent,
    setSize,
    T
  };
})();
window.ZadGreeting = (() => {
  const key = 'zad_prophet_welcome_restored_v1';
  let timer;

  function show(force = false) {
    if (!force && Zad.session.getItem(key)) return;
    document.getElementById('greetingNote')?.remove();
    const note = document.createElement('aside');
    note.id = 'greetingNote';
    note.className = 'greeting-note';
    note.setAttribute('role', 'status');
    note.innerHTML = ("<button type=\"button\" aria-label=\"" + ZadI18n.html("settings.c7576888db") + "\">") + Zad.icon('close') + ("</button><small>" + ZadI18n.html("settings.be657896f5") + "</small><p lang=\"ar\" dir=\"rtl\">اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّد ﷺ</p>");
    document.body.append(note);
    Zad.session.setItem(key, '1');
    note.querySelector('button').onclick = () => note.remove();
    clearTimeout(timer);
    timer = setTimeout(() => note.remove(), 12000);
  }
  return {
    show
  };
})();
setTimeout(() => ZadGreeting.show(false), 1300);

