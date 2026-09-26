(function() {
  'use strict';
  // Reader-specific keys extend the existing catalog; no other page loads this module.
  Object.assign(window.ZadI18nCatalog, {
  "quran-reader.wird-silent": {
    "ar": "الحروف غير المنطوقة",
    "en": "Silent letters",
    "fr": "Lettres non prononcées",
    "id": "Huruf tidak dibaca",
    "tr": "Okunmayan harfler",
    "ur": "نہ پڑھے جانے والے حروف",
    "es": "Letras no pronunciadas"
  },
  "quran-reader.wird-normal-madd": {
    "ar": "المد الطبيعي (حركتان)",
    "en": "Normal madd (2)",
    "fr": "Madd naturel (2 temps)",
    "id": "Mad asli (2 harakat)",
    "tr": "Tabii med (2 hareke)",
    "ur": "مدِ طبیعی (۲ حرکات)",
    "es": "Madd natural (2 tiempos)"
  },
  "quran-reader.wird-separated-madd": {
    "ar": "المد الجائز (٢/٤/٦)",
    "en": "Permissible madd (2/4/6)",
    "fr": "Madd permis (2/4/6)",
    "id": "Mad jaiz (2/4/6)",
    "tr": "Caiz med (2/4/6)",
    "ur": "مدِ جائز (۲/۴/۶)",
    "es": "Madd permitido (2/4/6)"
  },
  "quran-reader.wird-connected-madd": {
    "ar": "المد المتصل (٤/٥)",
    "en": "Connected madd (4/5)",
    "fr": "Madd lié (4/5)",
    "id": "Mad muttasil (4/5)",
    "tr": "Muttasıl med (4/5)",
    "ur": "مدِ متصل (۴/۵)",
    "es": "Madd unido (4/5)"
  },
  "quran-reader.wird-necessary-madd": {
    "ar": "المد اللازم (٦)",
    "en": "Necessary madd (6)",
    "fr": "Madd nécessaire (6)",
    "id": "Mad lazim (6)",
    "tr": "Lazım med (6)",
    "ur": "مدِ لازم (۶)",
    "es": "Madd necesario (6)"
  },
  "quran-reader.wird-ghunnah-ikhfa": {
    "ar": "الغنة والإخفاء",
    "en": "Ghunnah / ikhfa’",
    "fr": "Ghunnah / ikhfa’",
    "id": "Gunnah / ikhfa",
    "tr": "Gunne / ihfa",
    "ur": "غنہ / اخفاء",
    "es": "Ghunnah / ikhfa"
  },
  "quran-reader.wird-qalqala": {
    "ar": "القلقلة",
    "en": "Qalqala (echo)",
    "fr": "Qalqala (écho)",
    "id": "Qalqalah",
    "tr": "Kalkale",
    "ur": "قلقلہ",
    "es": "Qalqala (eco)"
  },
  "quran-reader.wird-tafkhim": {
    "ar": "التفخيم",
    "en": "Tafkhim (heavy)",
    "fr": "Tafkhim (emphase)",
    "id": "Tafkhim (tebal)",
    "tr": "Tefhim (kalın okuma)",
    "ur": "تفخیم",
    "es": "Tafkhim (énfasis)"
  },
  "quran-reader.wird-fallback": {
    "ar": "تعذر تحميل ألوان التجويد كاملةً؛ تُعرض الآيات غير المتاحة بدون تلوين.",
    "en": "Some Tajweed colors could not be loaded. Unavailable verses remain in plain Uthmani text.",
    "fr": "Certaines couleurs de tajwid sont indisponibles. Les versets concernés restent en écriture uthmani sans couleurs.",
    "id": "Sebagian warna tajwid tidak dapat dimuat. Ayat terkait tetap ditampilkan dalam teks Usmani tanpa warna.",
    "tr": "Bazı tecvid renkleri yüklenemedi. İlgili ayetler renksiz Osmanî metinle gösteriliyor.",
    "ur": "تجوید کے بعض رنگ لوڈ نہیں ہو سکے۔ متعلقہ آیات بغیر رنگ کے رسمِ عثمانی میں دکھائی جا رہی ہیں۔",
    "es": "No se pudieron cargar algunos colores de tajwid. Los versículos afectados conservan el texto uthmani sin colores."
  },
  "quran-reader.wird-legend": {
    "ar": "ألوان التجويد",
    "en": "Tajweed colors",
    "fr": "Couleurs du tajwid",
    "id": "Warna tajwid",
    "tr": "Tecvid renkleri",
    "ur": "تجوید کے رنگ",
    "es": "Colores del tajwid"
  },
  "quran-reader.wird-choose-ayah": {
    "ar": "اختر رقم آية للاستماع إليها.",
    "en": "Select a verse number to listen.",
    "fr": "Sélectionnez le numéro d’un verset pour l’écouter.",
    "id": "Pilih nomor ayat untuk mendengarkan.",
    "tr": "Dinlemek için ayet numarasını seçin.",
    "ur": "سننے کے لیے آیت کا نمبر منتخب کریں۔",
    "es": "Selecciona el número de un versículo para escucharlo."
  }
});
  Object.assign(window.ZadI18nCatalog, {
  "quran-reader.wird-enabled": {
    "ar": "التجويد: مفعّل",
    "en": "Tajweed: on",
    "fr": "Tajwid : activé",
    "id": "Tajwid: aktif",
    "tr": "Tecvid: açık",
    "ur": "تجوید: فعال",
    "es": "Tajwid: activado"
  },
  "quran-reader.wird-disabled": {
    "ar": "التجويد: متوقف",
    "en": "Tajweed: off",
    "fr": "Tajwid : désactivé",
    "id": "Tajwid: nonaktif",
    "tr": "Tecvid: kapalı",
    "ur": "تجوید: غیر فعال",
    "es": "Tajwid: desactivado"
  }
});
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
  const verseNumberFormatter = new Intl.NumberFormat('ar-u-nu-arab', {useGrouping: false});

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
    ch = Number(ch);
    if (qCache.has(ch)) return qCache.get(ch);
    const pending = (async () => {
      const map = new Map(), rejected = new Set(), visitedPages = new Set();
      const chapter = quran.surahs.find(s => Number(s.number) === ch);
      if (!chapter) return map;
      let page = 1;
      try {
        while (page) {
          if (visitedPages.has(page) || visitedPages.size >= chapter.ayahs.length) break;
          visitedPages.add(page);
          const url = new URL('https://api.quran.com/api/v4/quran/verses/uthmani_tajweed');
          url.searchParams.set('chapter_number', String(ch));
          if (page > 1) url.searchParams.set('page', String(page));
          const response = await Zad.fetch(url.href, {cache: 'force-cache'});
          if (!response.ok) break;
          const json = await response.json();
          if (!Array.isArray(json.verses)) break;
          // Identity comes only from verse_key. A bad/missing record must not
          // discard unrelated verses or shift their annotations by array index.
          for (const verse of json.verses) {
            const k = verse?.verse_key;
            if (typeof k !== 'string') continue;
            const [surah, number] = k.split(':').map(Number);
            if (surah !== ch || !Number.isInteger(number) || number < 1 || number > chapter.ayahs.length || k !== `${ch}:${number}`) continue;
            if (map.has(k) || rejected.has(k)) { map.delete(k); rejected.add(k); continue; }
            if (typeof verse.text_uthmani_tajweed === 'string' && verse.text_uthmani_tajweed.trim()) map.set(k, verse.text_uthmani_tajweed);
          }
          const next = json.pagination?.next_page;
          page = Number.isInteger(next) && next > page && next <= chapter.ayahs.length ? next : 0;
        }
      } catch (_) { /* Keep any independently verified records already fetched. */ }
      return map;
    })();
    qCache.set(ch, pending);
    pending.then(map => {
      const count = quran.surahs.find(s => Number(s.number) === ch)?.ayahs.length;
      // A partial response is useful now but must not become a permanent failure cache.
      if (map.size !== count && qCache.get(ch) === pending) qCache.delete(ch);
    });
    return pending;
  }
  // Categories come from provider annotations, never from matching Quran letters.
  // API madda_permissible also covers permitted stopping lengths, not only separated madd.
  const TAJWEED_RULES = Object.freeze({
    ham_wasl: 'silent', slnt: 'silent', laam_shamsiyah: 'silent',
    idgh_w_ghn: 'silent', idgham_wo_ghunnah: 'silent', idgh_mus: 'silent',
    madda_normal: 'normal-madd', madda_permissible: 'separated-madd',
    madda_obligatory: 'connected-madd', madda_necessary: 'necessary-madd',
    ghn: 'ghunnah-ikhfa', ghunnah: 'ghunnah-ikhfa',
    ikhf: 'ghunnah-ikhfa', ikhfa: 'ghunnah-ikhfa', ikhf_shfw: 'ghunnah-ikhfa',
    idghm_shfw: 'ghunnah-ikhfa', idgh_ghn: 'ghunnah-ikhfa', idgham_ghunnah: 'ghunnah-ikhfa',
    iqlb: 'ghunnah-ikhfa', iqlab: 'ghunnah-ikhfa',
    qlq: 'qalqala', qalqalah: 'qalqala', tafkhim: 'tafkhim'
  });
  const ruleLabel = rule => ZadI18n.t('quran-reader.wird-' + rule);

  function annotatedOriginal(markup, ayah) {
    // Reuse the existing sanitizer, then accept text and known inline annotations only.
    const doc = new DOMParser().parseFromString(Zad.tajweedHTML(markup), 'text/html');
    const ends = [...doc.body.querySelectorAll('span.end')];
    if (ends.length > 1) return null;
    if (ends.length) {
      const end = ends[0];
      const n = [...end.textContent.trim()].map(c => '٠١٢٣٤٥٦٧٨٩'.includes(c) ? '٠١٢٣٤٥٦٧٨٩'.indexOf(c) : c).join('');
      if (n !== String(ayah.numberInSurah) || end.parentNode !== doc.body || end.nextSibling?.textContent.trim()) return null;
      // This separator belongs to the provider's ayah-number markup, not the verse.
      if (end.previousSibling?.nodeType === 3) end.previousSibling.textContent = end.previousSibling.textContent.replace(/\s+$/, '');
      end.remove();
    }
    const units = [];
    let valid = true;
    function walk(node, annotation = '') {
      if (node.nodeType === 3) {
        for (const char of node.textContent) units.push({char, annotation});
        return;
      }
      if (node.nodeType === 1 && node.tagName === 'TAJWEED') {
        const classes = [...node.classList];
        if (classes.length !== 1 || !Object.hasOwn(TAJWEED_RULES, classes[0])) { valid = false; return; }
        annotation = classes[0];
      }
      for (const child of node.childNodes) walk(child, annotation);
    }
    walk(doc.body);
    if (!valid) return null;
    const original = cleanArabic(ayah), parts = openingParts(ayah);
    const annotations = alignAnnotations(original, units);
    let bodyAnnotations = annotations;
    // Quran.com supplies ayah 1 without the unnumbered surah-opening basmalah.
    // Al Quran Cloud includes it in the same source record. Split only that exact,
    // verified prefix for presentation/alignment; keep every original character.
    if (!annotations && parts.opening) bodyAnnotations = alignAnnotations(parts.body, units);
    if (!bodyAnnotations) return null;
    const offset = annotations ? 0 : [...parts.opening].length;
    const colors = annotations || [...Array(offset).fill(''), ...bodyAnnotations];
    const fragment = document.createDocumentFragment();
    let run = null, previous = null;
    for (const [i, char] of [...original].entries()) {
      const annotation = colors[i] || '';
      if (annotation !== previous || !run) {
        if (annotation) {
          run = document.createElement('tajweed');
          run.className = annotation;
          run.dataset.tajweedRule = TAJWEED_RULES[annotation];
          run.title = ruleLabel(TAJWEED_RULES[annotation]);
        } else run = document.createTextNode('');
        fragment.append(run);
        previous = annotation;
      }
      if (run.nodeType === 3) run.data += char;
      else run.append(document.createTextNode(char));
    }
    return fragment.textContent === original ? fragment : null;
  }

  function canonicalUnits(units) {
    const kept = units.filter((u, i) => !(i === 0 && u.char === '\uFEFF') && u.char !== '\u0640');
    const segments = new Intl.Segmenter('ar', {granularity: 'grapheme'});
    const normalized = [];
    let at = 0;
    for (const {segment} of segments.segment(kept.map(u => u.char).join(''))) {
      const queues = new Map();
      for (const ignored of segment) {
        const unit = kept[at++];
        for (const char of unit.char.normalize('NFD')) {
          if (!queues.has(char)) queues.set(char, []);
          queues.get(char).push({...unit, char});
        }
      }
      // Canonical reordering for comparison only; displayed text is never normalized.
      for (const char of segment.normalize('NFD')) normalized.push(queues.get(char).shift());
    }
    return normalized;
  }

  function alignAnnotations(text, units) {
    const chars = [...text];
    const target = canonicalUnits(chars.map((char, index) => ({char, index})));
    const source = canonicalUnits(units);
    if (target.length !== source.length || target.some((u, i) => u.char !== source[i].char)) return null;
    const annotations = Array(chars.length).fill(''), assigned = new Set();
    for (let i = 0; i < target.length; i++) {
      const index = target[i].index, annotation = source[i].annotation;
      if (assigned.has(index) && annotations[index] !== annotation) return null;
      annotations[index] = annotation;
      assigned.add(index);
    }
    return annotations;
  }

  function openingParts(ayah) {
    const original = cleanArabic(ayah);
    if (Number(ayah.numberInSurah) !== 1 || [1, 9].includes(Number(ayah.surahNumber))) return {opening: '', body: original};
    const fatiha = String(quran.surahs.find(s => Number(s.number) === 1)?.ayahs[0]?.text || '').replace(/^\uFEFF/, '');
    if (!fatiha) return {opening: '', body: original};
    const words = fatiha.split(' ').length, bom = original.startsWith('\uFEFF') ? 1 : 0;
    // This pinned source has an opening shadda in 95:1 and 97:1. Their exact
    // source prefixes are recognized as layout boundaries, never corrected.
    const openings = [fatiha, ...[95, 97].map(number => String(quran.surahs.find(s => Number(s.number) === number)?.ayahs[0]?.text || '').replace(/^\uFEFF/, '').split(' ').slice(0, words).join(' '))];
    const opening = openings.find(text => text && original.slice(bom).startsWith(text + ' '));
    if (!opening) return {opening: '', body: original};
    const end = bom + opening.length + 1;
    return {opening: original.slice(0, end), body: original.slice(end)};
  }

  function arabicContent(ayah, fragment = null) {
    const full = document.createElement('span');
    if (fragment) full.append(fragment);
    else full.textContent = cleanArabic(ayah);
    const {opening, body} = openingParts(ayah);
    const result = document.createDocumentFragment();
    if (opening) {
      // Move the exact prefix, preserving existing annotation nodes and source bytes.
      const range = document.createRange();
      range.setStart(full, 0);
      const walker = document.createTreeWalker(full, NodeFilter.SHOW_TEXT);
      let left = opening.length, node;
      while ((node = walker.nextNode())) {
        if (left <= node.length) { range.setEnd(node, left); break; }
        left -= node.length;
      }
      const line = document.createElement('span');
      line.className = 'wird-basmala';
      line.append(range.extractContents());
      result.append(line);
    }
    const content = document.createElement('span');
    content.className = 'wird-verse-text';
    // Amiri's two U+0653 marks overlap for this verified opening. Use the already
    // bundled Noto Arabic for identical openings; no letter/mark/spacing changes.
    const baqarah = quran.surahs.find(s => Number(s.number) === 2)?.ayahs[0];
    if (baqarah && Number(ayah.numberInSurah) === 1 && body === openingParts({...baqarah, surahNumber: 2}).body) content.dataset.quranFont = 'opening';
    content.append(...full.childNodes);
    result.append(content);
    return result;
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
    token: 0,
    selectedKey: null,
    renderedKeys: '',
    legendOpen: false
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
    const rules = ['silent','normal-madd','separated-madd','connected-madd','necessary-madd','ghunnah-ikhfa','qalqala','tafkhim'];
    return `<div id="v22TajweedLegend" ${state.legendOpen ? '' : 'hidden'}><div class="v22LegendGrid">${rules.map(rule => `<div class="v22LegendItem"><i class="v22LegendDot" data-tajweed-rule="${rule}" aria-hidden="true"></i><span>${esc(ruleLabel(rule))}</span></div>`).join('')}</div></div>`;
  }

  function ensureReader() {
    let w = document.getElementById('v22ReaderWorkspace');
    if (w) return w;
    const home = document.getElementById('home');
    if (!home) return null;
    w = document.createElement('section');
    w.id = 'v22ReaderWorkspace';
    home.prepend(w);
    const legacy = document.getElementById('wirdContent');
    if (legacy) { legacy.replaceChildren(); legacy.hidden = true; legacy.setAttribute('aria-hidden', 'true'); legacy.inert = true; }
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
    return ("<div class=\"v22QTop\">\n   <div class=\"v22QMetaRow\">\n     <div class=\"zaQuranSurahTitle\"><small>" + ZadI18n.html("gateways.c15b3a94c1") + "</small><strong>" + (esc(surahTitle)) + "</strong></div>\n     <div class=\"v22QMeta\">\n       <span>" + (x(T.pageLabel)) + " " + (digits(m.page)) + "</span>\n       <span>" + (x(T.juzLabel)) + " " + (digits(m.juz)) + "</span>\n       <span>" + (x(T.hizbLabel)) + " " + (digits(m.hizb)) + "</span>\n     </div>\n   </div>\n   <div class=\"v22QModes zaStableQuranControls\">\n     <button type=\"button\" data-toggle=\"tajweed\" aria-pressed=\"" + state.tajweed + "\" class=\"" + (state.tajweed?'active':'') + "\">" + (ruleLabel(state.tajweed ? 'enabled' : 'disabled')) + "</button>\n     <button type=\"button\" class=\"v22Gold\" data-legend aria-controls=\"v22TajweedLegend\" aria-expanded=\"" + state.legendOpen + "\">" + (ruleLabel('legend')) + "</button>\n     <div class=\"zaReaderReciter\">\n       <label for=\"v22AyahReciter\">" + ZadI18n.html("quran-reader.19deea1081") + "</label>\n       <select id=\"v22AyahReciter\" aria-label=\"" + ZadI18n.html("quran-reader.30c636a4e4") + "\">" + (recOptions) + "</select>\n     </div>\n   </div>\n   " + (makeLegend()) + "\n   <div class=\"v22QProgress\">\n     <div class=\"v22QProgressText\">\n       <strong>" + (x(T.today)) + " — " + (x(T.portion)) + " " + (digits(cp)) + " " + (x(T.of)) + " " + (digits(total)) + "</strong>\n       <small>" + (esc(rangeMeta(currentPortionAyahs()))) + "</small>\n     </div>\n     <div class=\"v22QProgressActions\">\n       <select id=\"v22DailyAmount\" aria-label=\"" + ZadI18n.html("quran-reader.ea526c4555") + "\">\n         <option value=\"1\" " + (getDailyAmount()===1?'selected':'') + ">" + (x(T.oneHizb)) + "</option>\n         <option value=\"2\" " + (getDailyAmount()===2?'selected':'') + ">" + (x(T.twoHizb)) + "</option>\n       </select>\n       <button type=\"button\" data-portion=\"-1\">" + (x(T.previous)) + "</button>\n       <button type=\"button\" data-portion=\"1\">" + (x(T.next)) + "</button>\n     </div>\n     <p class=\"reading-progress-note\">" + (ZadI18n.t("quran-reader.aafcc5303b")) + ": " + (digits(completed)) + " / " + (digits(total)) + "</p><div class=\"v22QTrack\" role=\"progressbar\" aria-label=\"" + (ZadI18n.t("quran-reader.3061ffb341")) + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"" + (Math.round(pct)) + "\"><i style=\"width:" + (pct) + "%\"></i></div>\n   </div>\n </div>")
  }

  function getDailyAmount() {
    try {
      return Number(dailyHizb) === 2 ? 2 : 1
    } catch (e) {
      return 1
    }
  }

  function renderVerse(arr) {
    let html = '', surah = null;
    for (const a of arr) {
      if (Number(a.surahNumber) !== surah) {
        if (surah !== null) html += '</div></section>';
        surah = Number(a.surahNumber);
        html += `<section class="wird-surah" data-surah-number="${surah}" aria-labelledby="wird-surah-${surah}"><h2 class="wird-surah-heading" id="wird-surah-${surah}">${esc(displaySurahName(a))}</h2><div class="wird-mushaf-text" lang="ar" dir="rtl" data-source-content>`;
      }
      const k = key(a), content = document.createElement('span');
      content.append(arabicContent(a));
      html += `<span class="wird-ayah" data-verse-key="${k}" data-key="${k}"><span class="v22Arabic" data-ar>${content.innerHTML}</span> <button type="button" class="wird-ayah-marker" data-select-verse="${k}" aria-label="${esc(x(T.play) + ' · ' + displaySurahName(a) + ' ' + digits(a.numberInSurah))}" ${state.selectedKey === k ? 'aria-current="true"' : ''}>${verseNumberFormatter.format(a.numberInSurah)}</button></span> `;
    }
    if (surah !== null) html += '</div></section>';
    if (state.translation) html += `<div class="v22TranslationList">${arr.map(a => `<div class="v22TranslationLine" data-key="${key(a)}"><b>${esc(key(a))}</b><span data-tr dir="${L[state.translationLang]?.dir || 'ltr'}">…</span></div>`).join('')}</div>`;
    return html;
  }

  function audioControls(arr) {
    const a = arr.find(a => key(a) === state.selectedKey) || arr[0];
    state.selectedKey = key(a);
    return `<div class="wird-audio-controls"><span class="wird-audio-label">${esc(displaySurahName(a))} · ${digits(a.numberInSurah)}</span><button type="button" class="secondary ayahAudioBtn" id="audioBtn_${a.surahNumber}_${a.numberInSurah}" data-play="${key(a)}">${x(T.play)}</button><span class="ayahAudioStatus v22AudioState" id="audioStatus_${a.surahNumber}_${a.numberInSurah}" role="status"></span></div>`;
  }

  function selectAudio(k) {
    const a = readerAyahs().find(a => key(a) === k);
    if (!a) return;
    if (state.selectedKey !== k) {
      if (typeof stopAyahAudio === 'function') stopAyahAudio();
      state.selectedKey = k;
      document.querySelector('#v22ReaderWorkspace .wird-audio-controls').outerHTML = audioControls(readerAyahs());
    }
    document.querySelectorAll('#v22ReaderContent [data-select-verse]').forEach(el => {
      if (el.dataset.selectVerse === k) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
    const button = document.querySelector('#v22ReaderWorkspace [data-play]');
    button?.click();
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
    let unavailable = false;
    for (const a of arr) {
      const k = key(a),
        h = tajMaps.get(Number(a.surahNumber))?.get(k);
      if (state.tajweed) {
        const el = document.querySelector(`#v22ReaderContent [data-verse-key="${CSS.escape(k)}"] [data-ar]`);
        const annotated = h ? annotatedOriginal(h, a) : null;
        if (el && annotated) el.replaceChildren(arabicContent(a, annotated));
        else unavailable = true;
      }
      if (state.translation) document.querySelectorAll(`#v22ReaderContent [data-key="${CSS.escape(k)}"] [data-tr]`).forEach(el => {
        el.textContent = trMaps.get(Number(a.surahNumber))?.get(k) || (ZadI18n.t("quran-reader.0330ae042a"));
        el.dir = L[state.translationLang]?.dir || 'ltr';
      });
    }
    const warning = document.getElementById('wirdTajweedStatus');
    if (warning) {
      warning.hidden = !state.tajweed || !unavailable;
      warning.textContent = warning.hidden ? '' : ruleLabel('fallback');
    }
  }

  async function renderReader() {
    const w = ensureReader();
    if (!w) return;
    const arr = readerAyahs();
    if (!arr.length) return;
    const keys = arr.map(key).join(',');
    const keepAudio = state.renderedKeys === keys ? w.querySelector('.wird-audio-controls') : null;
    if (state.renderedKeys && state.renderedKeys !== keys && typeof stopAyahAudio === 'function') stopAyahAudio();
    state.renderedKeys = keys;
    const audio = audioControls(arr);
    w.innerHTML = readerControls(arr) + `<div class="reader-view-controls"><label>${x(T.translation)}<input type="checkbox" data-reader-translation ${state.translation?'checked':''}></label><select aria-label="${x(T.translation)}" data-reader-language>${Object.entries(L).filter(([c])=>c!=='ar').map(([c,p])=>`<option value="${c}" ${state.translationLang===c?'selected':''}>${p.name}</option>`).join('')}</select><button class="secondary" data-reader-complete>${ZadI18n.t("quran-reader.04f0c01fbc")}</button></div><p class="reading-progress-note" id="translationSource" role="status"></p><p class="reading-progress-note" id="wirdTajweedStatus" role="status" hidden></p>${audio}<p class="reading-progress-note wird-audio-hint">${esc(ruleLabel('choose-ayah'))}</p><div id="v22ReaderContent">${renderVerse(arr)}</div>`;
    if (keepAudio) w.querySelector('.wird-audio-controls').replaceWith(keepAudio);
    const token = ++state.token;
    enhance(arr, token).catch(() => {});
  }

  function refreshTajweed() {
    const arr = readerAyahs();
    document.querySelector('#v22ReaderWorkspace [data-toggle="tajweed"]')?.setAttribute('aria-pressed', String(state.tajweed));
    const toggle = document.querySelector('#v22ReaderWorkspace [data-toggle="tajweed"]');
    if (toggle) { toggle.classList.toggle('active', state.tajweed); toggle.textContent = ruleLabel(state.tajweed ? 'enabled' : 'disabled'); }
    for (const a of arr) {
      const el = document.querySelector(`#v22ReaderContent [data-verse-key="${CSS.escape(key(a))}"] [data-ar]`);
      if (el) el.replaceChildren(arabicContent(a));
    }
    const warning = document.getElementById('wirdTajweedStatus');
    if (warning) { warning.hidden = true; warning.textContent = ''; }
    enhance(arr, ++state.token).catch(() => {});
  }

  function readerClick(e) {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.toggle === 'tajweed') {
      state.tajweed = !state.tajweed;
      Zad.storage.setItem('zad_reader_tajweed_v1', String(state.tajweed));
      refreshTajweed();
      return
    }
    if (b.hasAttribute('data-legend')) {
      state.legendOpen = !state.legendOpen;
      document.getElementById('v22TajweedLegend').hidden = !state.legendOpen;
      b.setAttribute('aria-expanded', String(state.legendOpen));
      return
    }
    if (b.dataset.selectVerse) {
      selectAudio(b.dataset.selectVerse);
      return;
    }
    if (b.dataset.play) {
      const [surah, ayah] = b.dataset.play.split(':').map(Number);
      Promise.resolve(playAyahAudio(surah, ayah)).catch(() => {
        const status = document.getElementById(`audioStatus_${surah}_${ayah}`);
        if (status) status.textContent = ZadI18n.t("quran-reader.27aea4a582");
      });
      return;
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

