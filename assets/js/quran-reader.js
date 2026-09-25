(function() {
  'use strict';
  const LANG_KEY = 'zad_islam_language_v3';
  const L = {
    ar: {
      dir: 'rtl',
      name: 'العربية'
    },
    en: {
      dir: 'ltr',
      name: 'English'
    },
    fr: {
      dir: 'ltr',
      name: 'Français'
    },
    id: {
      dir: 'ltr',
      name: 'Bahasa Indonesia'
    },
    tr: {
      dir: 'ltr',
      name: 'Türkçe'
    },
    ur: {
      dir: 'rtl',
      name: 'اردو'
    },
    es: {
      dir: 'ltr',
      name: 'Español'
    }
  };

  function lang() {
    const c = document.documentElement.dataset.v21Lang || Zad.storage.getItem(LANG_KEY) || 'ar';
    return L[c] ? c : 'ar'
  }

  function x(pack) {
    const c = lang();
    return pack[c] || pack.en || pack.ar || ''
  }
  const T = {
    brand: ZadI18n.pack("gateways.eeeabade98"),
    gates: ZadI18n.pack("quran-reader.113ffcc460"),
    daily: ZadI18n.pack("gateways.f7c9bb7bc3"),
    dailySub: ZadI18n.pack("quran-reader.954e660826"),
    warrior: ZadI18n.pack("gateways.017bfb0913"),
    heart: ZadI18n.pack("gateways.1f3b868f29"),
    hadith: ZadI18n.pack("gateways.a8cb26a080"),
    verse: ZadI18n.pack("gateways.aa0820116b"),
    surah: ZadI18n.pack("quran-reader.65ae2b2caa"),
    page: ZadI18n.pack("quran-reader.2072502eee"),
    pageLabel: ZadI18n.pack("quran-reader.4f137908a1"),
    juzLabel: ZadI18n.pack("quran-reader.30b0b01513"),
    hizbLabel: ZadI18n.pack("quran-reader.5552407e45"),
    chooseSurah: ZadI18n.pack("gateways.c15b3a94c1"),
    translation: ZadI18n.pack("gateways.d88673aeea"),
    arabic: ZadI18n.pack("gateways.d274159863"),
    tajweed: ZadI18n.pack("gateways.95fe8d9773"),
    legend: ZadI18n.pack("quran-reader.4e32bc17d9"),
    today: ZadI18n.pack("quran-reader.68743a794b"),
    portion: ZadI18n.pack("quran-reader.6f379cbb1c"),
    of: ZadI18n.pack("quran-reader.4d7d679f7b"),
    oneHizb: ZadI18n.pack("quran-reader.654692b52e"),
    twoHizb: ZadI18n.pack("quran-reader.8a278a0047"),
    complete1: ZadI18n.pack("quran-reader.94033e08a4"),
    complete2: ZadI18n.pack("quran-reader.db583cdd3d"),
    previous: ZadI18n.pack("quran-reader.a9e9d06710"),
    next: ZadI18n.pack("quran-reader.5cf7af74fd"),
    play: ZadI18n.pack("quran-reader.74aaaefb4c"),
    loading: ZadI18n.pack("quran-reader.4350da4e67"),
    noData: ZadI18n.pack("quran-reader.dd5d605bfc"),
    mediaIntro: ZadI18n.pack("quran-reader.612c20b992"),
    watch: ZadI18n.pack("gateways.ec9b349b68"),
    how: ZadI18n.pack("gateways.2a6bd746b9"),
    approved: ZadI18n.pack("quran-reader.efa0d3f383"),
    approvedSub: ZadI18n.pack("quran-reader.527754f521"),
    title: ZadI18n.pack("quran-reader.05b630f570"),
    chooseFile: ZadI18n.pack("quran-reader.67d4210971"),
    submit: ZadI18n.pack("quran-reader.fab2b68a6c"),
    step1: ZadI18n.pack("quran-reader.88dcccd10a"),
    step2: ZadI18n.pack("quran-reader.67d4210971"),
    step3: ZadI18n.pack("quran-reader.42a2528f66"),
    step4: ZadI18n.pack("quran-reader.e7150a760e")
  };

  function crescent() {
    return Zad.icon('moon');
  }

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    } [c]))
  }

  function digits(n) { return ZadI18n.number(n); }

  function ensureChrome() {}

  function moduleKind() {
    if (!document.body.classList.contains('v21AppMode')) return null;
    for (const id of ['wirdModule', 'zadModule', 'heartModule', 'hadithModule']) {
      const el = document.getElementById(id);
      if (el && !el.classList.contains('hidden')) return id
    }
    return null
  }

  function ensureModuleHero() {
    const k = moduleKind();
    if (!k) return;
    const el = document.getElementById(k);
    let h = el.querySelector(':scope>.v22ModuleHero');
    if (!h) {
      h = document.createElement('header');
      h.className = 'v22ModuleHero module-heading';
      el.prepend(h);
    }
    const names = {
      wirdModule: 'daily',
      zadModule: 'warrior',
      heartModule: 'heart',
      hadithModule: 'hadith'
    };
    const html = '<p class="eyebrow">' + x(T.brand) + '</p><h1>' + x(T[names[k]]) + '</h1>';
    if (h.innerHTML !== html) h.innerHTML = html;
  }

  window.v22TranslateActive = function() {
    ensureChrome();
    ensureModuleHero();
    const k = moduleKind();
    if (k) ZadI18n.apply(document.getElementById(k));
    v22PatchStaticControls();

  };

  function v22PatchStaticControls() {
    const c = lang();
    const ids = {
      'tab-home': ZadI18n.pack("quran-reader.68743a794b"),
      'tab-quran': ZadI18n.pack("quran-reader.13a3eeca61"),
      'tab-quranAudio': ZadI18n.pack("quran-reader.8da6ada9e1"),
      'tab-search': ZadI18n.pack("quran-reader.d0f6edcf6d"),
      'tab-settings': ZadI18n.pack("quran-reader.77c1535a2f")
    };
    for (const [id, p] of Object.entries(ids)) {
      const e = document.getElementById(id);
      if (e) e.textContent = p[c] || p.en
    }
    const b = document.getElementById('tab-books');
    if (b) b.style.display = 'none';
  }

  /* ===== Quran API helpers ===== */
  const qCache = new Map();
  async function translations(ch, code) {
    return ZadQuranSources.translations(ch, code);
  }
  async function tajweed(ch) {
    if (qCache.has(ch)) return qCache.get(ch);
    const p = (async () => {
      try {
        const r = await Zad.fetch(`https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${ch}`, {
          cache: 'force-cache'
        });
        if (!r.ok) return new Map();
        const j = await r.json();
        const m = new Map();
        for (const v of j.verses || []) m.set(v.verse_key, v.text_uthmani_tajweed);
        return m
      } catch (e) {
        return new Map()
      }
    })();
    qCache.set(ch, p);
    return p
  }
  const state = {
    mode: 'verse',
    surah: 1,
    page: 1,
    translation: false,
    tajweed: Zad.storage.getItem('zad_reader_tajweed_v1') === 'true',
    arabic: true,
    translationLang: 'en',
    ready: false,
    token: 0
  };

  function preferredTranslation() {
    const c = lang();
    return ['en', 'fr', 'id', 'tr', 'ur', 'es'].includes(c) ? c : 'en'
  }

  function waitData() {
    return new Promise(resolve => {
      let n = 0;
      const f = () => {
        if (window.__zadQuranState === 'error') return resolve(false);
        try {
          if (typeof flatAyahs !== 'undefined' && flatAyahs?.length && typeof quran !== 'undefined' && quran?.surahs?.length) return resolve(true)
        } catch (e) {}
        if (++n > 120) return resolve(false);
        setTimeout(f, 80)
      };
      f()
    })
  }

  function currentPortionAyahs() {
    try {
      return (portions?.[Math.max(0, (currentPortion || 1) - 1)] || [])
    } catch (e) {
      return []
    }
  }

  function surahAyahs(no) {
    try {
      const s = quran.surahs.find(v => Number(v.number) === Number(no));
      return s ? s.ayahs.map(a => ({
        ...a,
        surahNumber: s.number,
        surahName: s.name,
        englishName: s.englishName
      })) : []
    } catch (e) {
      return []
    }
  }

  function pageAyahs(no) {
    try {
      return flatAyahs.filter(a => Number(a.page) === Number(no))
    } catch (e) {
      return []
    }
  }

  function key(a) {
    return `${a.surahNumber}:${a.numberInSurah}`
  }

  function cleanArabic(ayah) {
    return String(ayah.text ?? '');
  }

  function displaySurahName(a) {
    return lang() === 'ar' || lang() === 'ur' ? (a.surahName || surahName(a.surahNumber)) : (a.englishName || a.surahName || surahName(a.surahNumber))
  }

  function rangeMeta(arr) {
    if (!arr.length) return '';
    const a = arr[0],
      b = arr[arr.length - 1];
    return `${displaySurahName(a)} ${digits(a.numberInSurah)} — ${displaySurahName(b)} ${digits(b.numberInSurah)}`
  }

  function readerAyahs() {
    if (state.mode === 'surah') return surahAyahs(state.surah);
    if (state.mode === 'page') return pageAyahs(state.page);
    return currentPortionAyahs()
  }

  function qMeta(arr) {
    const a = arr[0] || {};
    const hizb = a.hizbQuarter ? Math.ceil(Number(a.hizbQuarter) / 4) : '—';
    return {
      page: a.page || '—',
      juz: a.juz || '—',
      hizb
    }
  }

  function surahName(no) {
    try {
      const s = quran.surahs.find(v => Number(v.number) === Number(no));
      return lang() === 'ar' ? (s?.name || '') : (s?.englishName || s?.name || '')
    } catch (e) {
      return ''
    }
  }

  function makeLegend() {
    const items = [
      ['#AAAAAA', ZadI18n.pack("quran-reader.2ca33f1dc0")],
      ['#537FFF', ZadI18n.pack("quran-reader.cd2a466d9c")],
      ['#4050FF', ZadI18n.pack("quran-reader.7363c52767")],
      ['#000EBC', ZadI18n.pack("quran-reader.75d24d0a1a")],
      ['#DD0008', ZadI18n.pack("quran-reader.3ddb39c6ab")],
      ['#FF7E1E', ZadI18n.pack("quran-reader.da422e904a")],
      ['#169200', ZadI18n.pack("quran-reader.b00bfbdce2")],
      ['#9400A8', ZadI18n.pack("quran-reader.80b44ac838")],
      ['#26BFFD', ZadI18n.pack("quran-reader.8c1569a0f4")]
    ];
    return `<div id="v22TajweedLegend"><div class="v22LegendTitle">${x(T.legend)}</div><div class="v22LegendGrid">${items.map(([c,p])=>`<div class="v22LegendItem"><i class="v22LegendDot" style="background:${c}"></i><span>${x(p)}</span></div>`).join('')}</div></div>`
  }

  function ensureReader() {
    let w = document.getElementById('v22ReaderWorkspace');
    if (w) return w;
    const home = document.getElementById('home');
    if (!home) return null;
    w = document.createElement('section');
    w.id = 'v22ReaderWorkspace';
    home.prepend(w);
    w.addEventListener('click', readerClick);
    w.addEventListener('change', readerChange);
    return w
  }

  function readerControls(arr) {
    const m = qMeta(arr);
    const total = (() => {
      try {
        return portions.length || 60
      } catch (e) {
        return 60
      }
    })();
    const cp = (() => {
      try {
        return currentPortion || 1
      } catch (e) {
        return 1
      }
    })();
    const prefix = (Zad.storage.getItem(START_KEY) || localTodayISO()) + '_hizb_' + dailyHizb + '_portion_';
    const completed = Object.entries(getDoneMap()).filter(([k, v]) => k.startsWith(prefix) && v === true).length;
    const pct = Math.max(0, Math.min(100, completed / Math.max(1, total) * 100));
    const first = arr[0] || {};
    const surahTitle = first.surahName || surahName(first.surahNumber) || ZadI18n.t("document-reader.355bd9c0e1");
    const rec = getSelectedAyahReciter();
    const recOptions = [
      ['husary_mujawwad', 'محمود خليل الحصري — مجوّد'],
      ['minshawi_mujawwad', 'محمد صديق المنشاوي — مجوّد'],
      ['muhammad_ayyoub_murattal', 'محمد أيوب — مرتل'],
      ['yasser_dossari_murattal', 'ياسر الدوسري — مرتل'],
      ['alafasy_murattal', 'مشاري راشد العفاسي — مرتل']
    ].map(([v, l]) => `<option value="${v}" ${v===rec?'selected':''}>${l}</option>`).join('');
    return ("<div class=\"v22QTop\">\n   <div class=\"v22QMetaRow\">\n     <div class=\"zaQuranSurahTitle\"><small>" + ZadI18n.html("gateways.c15b3a94c1") + "</small><strong>" + (esc(surahTitle)) + "</strong></div>\n     <div class=\"v22QMeta\">\n       <span>" + (x(T.pageLabel)) + " " + (digits(m.page)) + "</span>\n       <span>" + (x(T.juzLabel)) + " " + (digits(m.juz)) + "</span>\n       <span>" + (x(T.hizbLabel)) + " " + (digits(m.hizb)) + "</span>\n     </div>\n   </div>\n   <div class=\"v22QModes zaStableQuranControls\">\n     <button type=\"button\" data-toggle=\"tajweed\" class=\"" + (state.tajweed?'active':'') + "\">" + (x(T.tajweed)) + "</button>\n     <button type=\"button\" class=\"v22Gold\" data-legend>" + (x(T.legend)) + "</button>\n     <div class=\"zaReaderReciter\">\n       <label for=\"v22AyahReciter\">" + ZadI18n.html("quran-reader.19deea1081") + "</label>\n       <select id=\"v22AyahReciter\" aria-label=\"" + ZadI18n.html("quran-reader.30c636a4e4") + "\">" + (recOptions) + "</select>\n     </div>\n   </div>\n   " + (makeLegend()) + "\n   <div class=\"v22QProgress\">\n     <div class=\"v22QProgressText\">\n       <strong>" + (x(T.today)) + " — " + (x(T.portion)) + " " + (digits(cp)) + " " + (x(T.of)) + " " + (digits(total)) + "</strong>\n       <small>" + (esc(rangeMeta(currentPortionAyahs()))) + "</small>\n     </div>\n     <div class=\"v22QProgressActions\">\n       <select id=\"v22DailyAmount\" aria-label=\"" + ZadI18n.html("quran-reader.ea526c4555") + "\">\n         <option value=\"1\" " + (getDailyAmount()===1?'selected':'') + ">" + (x(T.oneHizb)) + "</option>\n         <option value=\"2\" " + (getDailyAmount()===2?'selected':'') + ">" + (x(T.twoHizb)) + "</option>\n       </select>\n       <button type=\"button\" data-portion=\"-1\">" + (x(T.previous)) + "</button>\n       <button type=\"button\" data-portion=\"1\">" + (x(T.next)) + "</button>\n     </div>\n     <p class=\"reading-progress-note\">" + (ZadI18n.t("quran-reader.aafcc5303b")) + ": " + (digits(completed)) + " / " + (digits(total)) + "</p><div class=\"v22QTrack\" role=\"progressbar\" aria-label=\"" + (ZadI18n.t("quran-reader.3061ffb341")) + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"" + (Math.round(pct)) + "\"><i style=\"width:" + (pct) + "%\"></i></div>\n   </div>\n </div>")
  }

  function getDailyAmount() {
    try {
      return Number(dailyHizb) === 2 ? 2 : 1
    } catch (e) {
      return 1
    }
  }

  function renderVerse(arr) {
    return arr.map(a => `<article class="v22Verse" data-key="${key(a)}"><div class="v22VerseHead"><span class="v22VerseKey">${esc((lang()==='ar'?a.surahName:(a.englishName||surahName(a.surahNumber))))} · ${digits(a.numberInSurah)}</span><span class="v22VerseTools"><button type="button" data-play="${a.surahNumber}:${a.numberInSurah}" title="${x(T.play)}" aria-label="${x(T.play)}">${Zad.icon('play')}</button></span></div><div class="v22Arabic" data-source-content lang="ar" dir="rtl" data-ar>${state.arabic?esc(cleanArabic(a)):''}</div>${state.translation?`<div class="v22Translation" data-tr dir="${L[state.translationLang]?.dir||'ltr'}">…</div>`:''}</article>`).join('')
  }

  function renderMushaf(arr) {
    if (!arr.length) return `<div class="v22QLoading">${x(T.noData)}</div>`;
    const title = state.mode === 'page' ? `${x(T.page)} ${digits(state.page)}` : surahName(state.surah);
    let lastSurah = null;
    let html = '';
    for (const a of arr) {
      if (state.mode === 'surah' && lastSurah === null && Number(a.surahNumber) !== 1 && Number(a.surahNumber) !== 9) html += ("<div class=\"v22Bismillah\">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>");
      if (state.mode === 'page' && lastSurah !== Number(a.surahNumber)) {
        if (lastSurah !== null) html += '<br>';
        html += `<span class="v22InlineSurahTitle">${esc(a.surahName||'')}</span> `;
        if (Number(a.numberInSurah) === 1 && Number(a.surahNumber) !== 1 && Number(a.surahNumber) !== 9) html += ("<span class=\"v22InlineBismillah\">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span> ");
        lastSurah = Number(a.surahNumber)
      }
      html += `<span class="v22InlineAyah" data-key="${key(a)}"><span data-ar>${state.arabic?esc(cleanArabic(a)):''}</span><span class="v22AyahNum">${digits(a.numberInSurah)}</span> </span>`;
      lastSurah = Number(a.surahNumber)
    }
    const trs = state.translation ? `<div class="v22TranslationList">${arr.map(a=>`<div class="v22TranslationLine" data-key="${key(a)}"><b>${digits(a.numberInSurah)}</b><span data-tr dir="${L[state.translationLang]?.dir||'ltr'}">…</span></div>`).join('')}</div>` : '';
    return `<div class="v22MushafWrap"><div class="v22MushafCard"><div class="v22MushafTitle">${esc(title)}</div><div class="v22MushafText">${html}</div>${trs}</div></div>`
  }

  function renderPager() {
    if (state.mode === 'verse') return '';
    const n = state.mode === 'page' ? state.page : state.surah;
    const max = state.mode === 'page' ? 604 : 114;
    return `<div class="v22Pager"><button data-nav="-1">${x(T.previous)}</button><span>${digits(n)} / ${digits(max)}</span><button data-nav="1">${x(T.next)}</button></div>`
  }
  async function enhance(arr, token) {
    const chapters = [...new Set(arr.map(a => Number(a.surahNumber)))],
      tajMaps = new Map(),
      trMaps = new Map();
    await Promise.all(chapters.flatMap(ch => [state.tajweed ? tajweed(ch).then(m => tajMaps.set(ch, m)).catch(() => {}) : Promise.resolve(), state.translation ? translations(ch, state.translationLang).then(m => trMaps.set(ch, m)).catch(() => {}) : Promise.resolve()]));
    if (token !== state.token) return;
    const note = document.getElementById('translationSource');
    if (note) {
      const sources = [...new Set([...trMaps.values()].map(m => m?.source).filter(Boolean))];
      note.textContent = sources.length ? (ZadI18n.t("quran-reader.ec5e92d77c")) + sources.join(' · ') : state.translation ? (ZadI18n.t("quran-reader.0330ae042a")) : '';
    }
    for (const a of arr) {
      const k = key(a),
        h = tajMaps.get(Number(a.surahNumber))?.get(k);
      if (h && state.tajweed) document.querySelectorAll(`#v22ReaderContent [data-key="${CSS.escape(k)}"] [data-ar]`).forEach(el => {
        el.innerHTML = Zad.tajweedHTML(h);
        addTajweedTitles(el);
      });
      if (state.translation) document.querySelectorAll(`#v22ReaderContent [data-key="${CSS.escape(k)}"] [data-tr]`).forEach(el => {
        el.textContent = trMaps.get(Number(a.surahNumber))?.get(k) || (ZadI18n.t("quran-reader.0330ae042a"));
        el.dir = L[state.translationLang]?.dir || 'ltr';
      });
    }
  }

  function addTajweedTitles(root) {
    const names = {
      ham_wasl: 'Hamzat Wasl',
      slnt: 'Silent',
      laam_shamsiyah: 'Lam Shamsiyyah',
      madda_normal: 'Normal Madd (2)',
      madda_permissible: 'Permissible Madd (2/4/6)',
      madda_necessary: 'Necessary Madd (6)',
      madda_obligatory: 'Obligatory Madd (4/5)',
      qalaqah: 'Qalqalah',
      qalqalah: 'Qalqalah',
      qlq: 'Qalqalah',
      ghunnah: 'Ghunnah',
      ghn: 'Ghunnah',
      idgham_ghunnah: 'Idgham with Ghunnah',
      idgh_ghn: 'Idgham with Ghunnah',
      idgham_wo_ghunnah: 'Idgham without Ghunnah',
      idgh_w_ghn: 'Idgham without Ghunnah',
      ikhafa: 'Ikhfa',
      ikhf: 'Ikhfa',
      ikhf_shfw: 'Ikhfa Shafawi',
      idghm_shfw: 'Idgham Shafawi',
      iqlab: 'Iqlab',
      iqlb: 'Iqlab',
      idgh_mus: 'Idgham'
    };
    root.querySelectorAll('tajweed').forEach(e => {
      for (const c of e.classList) {
        if (names[c]) {
          e.title = names[c];
          break
        }
      }
    })
  }
  async function renderReader() {
    const w = ensureReader();
    if (!w) return;
    const arr = readerAyahs();
    if (!arr.length) return;
    w.innerHTML = readerControls(arr) + `<div class="reader-view-controls"><label>${x(T.translation)}<input type="checkbox" data-reader-translation ${state.translation?'checked':''}></label><select aria-label="${x(T.translation)}" data-reader-language>${Object.entries(L).filter(([c])=>c!=='ar').map(([c,p])=>`<option value="${c}" ${state.translationLang===c?'selected':''}>${p.name}</option>`).join('')}</select><button class="secondary" data-reader-complete>${ZadI18n.t("quran-reader.04f0c01fbc")}</button></div><p class="reading-progress-note" id="translationSource" role="status"></p><div id="v22ReaderContent">${renderVerse(arr)}</div>`;
    const token = ++state.token;
    enhance(arr, token).catch(() => {});
  }

  function readerClick(e) {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.toggle === 'tajweed') {
      state.tajweed = !state.tajweed;
      Zad.storage.setItem('zad_reader_tajweed_v1', String(state.tajweed));
      renderReader();
      return
    }
    if (b.hasAttribute('data-legend')) {
      document.getElementById('v22TajweedLegend')?.classList.toggle('show');
      return
    }
    if (b.dataset.play) {
      const [s, a] = b.dataset.play.split(':').map(Number);
      const audioId = `${s}_${a}`;

      /* Reuse the existing, proven Quran audio player by giving the new v22
         button the legacy ID that playAyahAudio expects. */
      b.id = `audioBtn_${audioId}`;

      /* Visible feedback directly under the play control. */
      let status = b.closest('.v22Verse')?.querySelector('.v22AudioState');
      if (!status) {
        status = document.createElement('div');
        status.className = 'v22AudioState';
        status.id = `audioStatus_${audioId}`;
        status.setAttribute('aria-live', 'polite');
        b.closest('.v22VerseHead')?.insertAdjacentElement('afterend', status);
      } else {
        status.id = `audioStatus_${audioId}`;
      }

      try {
        playAyahAudio(s, a)
      } catch (err) {
        status.textContent = ZadI18n.t("quran-reader.27aea4a582");
        status.classList.add('bad');
      }
      return
    }
    if (b.dataset.portion) {
      try {
        changePortion(Number(b.dataset.portion));
        setTimeout(renderReader, 0)
      } catch (err) {}
      return
    }
    if (b.dataset.complete) {
      try {
        zadCompleteWirdForPoints(Number(b.dataset.complete));
        setTimeout(renderReader, 30)
      } catch (err) {}
      return
    }
  }

  function readerChange(e) {
    if (e.target.id === 'v22AyahReciter') {
      try {
        changeAyahReciter(e.target.value)
      } catch (err) {}
    } else if (e.target.id === 'v22DailyAmount') {
      try {
        changeDailyAmount(Number(e.target.value));
        setTimeout(renderReader, 0)
      } catch (err) {}
    }
  }
  window.v22InitQuranReader = async function() {
    ensureChrome();
    ensureModuleHero();
    const w = ensureReader();
    if (w && !w.children.length) w.innerHTML = `<div class="v22QLoading" role="status">${x(T.loading)}</div>`;
    const ok = await waitData();
    if (!ok) {
      if (w) w.innerHTML = `<div class="empty-state"><p>${x(T.noData)}</p><button type="button" data-quran-retry>${ZadI18n.t("quran-reader.14d5786f2e")}</button> <a class="text-link" href="reader.html?book=quran">${ZadI18n.t("quran-reader.7d6b596ceb")}</a></div>`;
      return
    }
    state.mode = 'verse';
    state.arabic = true;
    if (!state.ready) {
      const a = currentPortionAyahs()[0] || flatAyahs[0];
      if (a) {
        state.surah = Number(a.surahNumber || 1);
        state.page = Number(a.page || 1)
      }
      state.ready = true
    }
    await renderReader();
    v22PatchStaticControls()
  };
  window.v22OnLanguageChange = function() {
    state.translation = false;
    state.arabic = true;
    state.mode = 'verse';
    ensureChrome();
    ensureModuleHero();

    v22PatchStaticControls();
    if (moduleKind() === 'wirdModule') window.v22InitQuranReader();
    else window.v22TranslateActive()
  };

  /* Keep the lightweight chrome in sync with navigation without expensive subtree walking. */
  let scheduled = false;

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureChrome();
      ensureModuleHero();
  
      v22PatchStaticControls();
      if (moduleKind() === 'wirdModule' && !document.getElementById('v22ReaderWorkspace')) window.v22InitQuranReader()
    })
  }
  document.addEventListener('zad:route', schedule);
  document.addEventListener('zad:language', schedule);
  document.addEventListener('click', e => {
    if (e.target.closest('#zadWirdChoiceOne,#zadWirdChoiceTwo')) setTimeout(() => moduleKind() === 'wirdModule' && window.v22InitQuranReader(), 40)
  }, true);
  ensureChrome();

  schedule();
  document.addEventListener('change', e => {
    if (e.target.matches('[data-reader-translation]')) {
      state.translation = e.target.checked;
      renderReader();
    }
    if (e.target.matches('[data-reader-language]')) {
      state.translationLang = e.target.value;
      renderReader();
    }
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-reader-complete]')) {
      window.markDone();
      Zad.toast(ZadI18n.t("quran-reader.3d8addc327"));
    }
  });
  document.addEventListener('zad:quran-ready', () => window.v22InitQuranReader());
  document.addEventListener('zad:wird-updated', () => {
    if (typeof quran !== 'undefined' && quran) renderReader();
  });
})();

