(function() {
  'use strict';
  const root = document.getElementById('v21Gateway');
  const shell = document.getElementById('v21GatewayShell');
  if (!root || !shell) return;

  const LANG_KEY = 'zad_islam_language_v3';
  const LANGS = {
    ar: {
      name: 'العربية',
      dir: 'rtl',
      quran: 'ar'
    },
    en: {
      name: 'English',
      dir: 'ltr',
      quran: 'en'
    },
    fr: {
      name: 'Français',
      dir: 'ltr',
      quran: 'fr'
    },
    id: {
      name: 'Bahasa Indonesia',
      dir: 'ltr',
      quran: 'id'
    },
    tr: {
      name: 'Türkçe',
      dir: 'ltr',
      quran: 'tr'
    },
    ur: {
      name: 'اردو',
      dir: 'rtl',
      quran: 'ur'
    },
    es: {
      name: 'Español',
      dir: 'ltr',
      quran: 'es'
    }
  };
  const savedLanguage = Zad.storage.getItem(LANG_KEY);
  let lang = LANGS[savedLanguage] ? savedLanguage : 'ar';
  let currentView = 'home';
  const K = {
    brand: ZadI18n.pack("gateways.eeeabade98"),
    tagline: ZadI18n.pack("gateways.e2213f71e8"),
    basmala: ZadI18n.pack("gateways.189b463d3e"),
    choose: ZadI18n.pack("gateways.a4e4ccc0f0"),
    intro: ZadI18n.pack("gateways.c4e2f3b37f"),
    gateway: ZadI18n.pack("gateways.affee78400"),
    enter: ZadI18n.pack("gateways.2c860cedec"),
    back: ZadI18n.pack("gateways.731b070b34"),
    iman: ZadI18n.pack("gateways.249b9bc3b4"),
    ilm: ZadI18n.pack("gateways.9cfadeada3"),
    media: ZadI18n.pack("gateways.fe99b36520"),
    rouh: ZadI18n.pack("gateways.ca3dff37d8"),
    daily: ZadI18n.pack("gateways.f7c9bb7bc3"),
    warrior: ZadI18n.pack("gateways.017bfb0913"),
    heart: ZadI18n.pack("gateways.1f3b868f29"),
    hadith: ZadI18n.pack("gateways.a8cb26a080"),
    library: ZadI18n.pack("gateways.fdf8eba0a0"),
    aqidah: ZadI18n.pack("gateways.4c70ca74a0"),
    seerah: ZadI18n.pack("gateways.fb7e622386"),
    tafsir: ZadI18n.pack("gateways.47f4ac555b"),
    future: ZadI18n.pack("gateways.e4e88557d9"),
    watch: ZadI18n.pack("gateways.ec9b349b68"),
    publish: ZadI18n.pack("gateways.2a6bd746b9"),
    language: ZadI18n.pack("gateways.6520b21edd"),
    settingsLang: ZadI18n.pack("gateways.e31b73cf5d"),
    ready: ZadI18n.pack("gateways.ed8446a50d"),
    coming: ZadI18n.pack("gateways.ce2e71c3a1"),
    source: ZadI18n.pack("gateways.222f16153b")
  };

  function t(key) {
    const v = K[key];
    return v ? (v[lang] || v.en || v.ar) : key
  }

  function isRTL() {
    return LANGS[lang].dir === 'rtl'
  }

  function arrow() {
    return isRTL() ? '←' : '→'
  }

  function esc(x) {
    return String(x ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    } [c]))
  }

  function crescent() {
    return '<img src="assets/icons/crescent.svg" alt="" width="40" height="40">';
  }

  function top() {
    return '';
  }

  function gatewayCard(cls, icon, key, desc, tags, view) {
    const icons = {
      iman: 'leaf',
      ilm: 'library',
      media: 'play',
      rouh: 'moon'
    };
    return `<article class="gateway-card ${cls}"><div class="gateway-card-top">${Zad.icon(icons[cls])}<span class="gateway-number">${({iman:'01',ilm:'02',media:'03',rouh:'04'})[cls]}</span></div><h2><a href="#${view}">${t(key)}</a></h2><p>${desc[lang]||desc.en}</p><div class="gateway-topics">${tags.map(k=>`<span>${k.startsWith('rouh.')?ZadI18n.t(k):t(k)}</span>`).join('')}</div><a class="gateway-open" href="#${view}">${t('enter')} ${Zad.icon('arrow')}</a></article>`;
  }

  function home() {
    const d1 = ZadI18n.pack("gateways.51eb3a24d8");
    const d2 = ZadI18n.pack("gateways.d9f68f6e58");
    const d3 = ZadI18n.pack("gateways.cd4d0d768f");
    const d4 = ZadI18n.pack("rouh.description");
    const ar = lang === 'ar';
    return `<section class="home-intro"><div><p class="eyebrow">${ZadI18n.t("gateways.da407e4ddd")}</p><h1>${ZadI18n.t("gateways.04bd06faf5")}</h1><p>${ZadI18n.t("gateways.d752e0bb99")}</p></div><div class="intro-mark" aria-hidden="true">${Zad.icon('moon')}</div></section>
 <section class="daily-invitation"><div class="daily-icon">${Zad.icon('book')}</div><div><span class="eyebrow">${ZadI18n.t("gateways.5510206c61")}</span><h2>${ZadI18n.t("gateways.30b0a3390c")}</h2><p>${ZadI18n.t("gateways.1cf5ab53c1")}</p></div><a class="button" href="#wird">${ZadI18n.t("gateways.74c572e45c")} ${Zad.icon('arrow')}</a></section>
 <div class="section-label"><h2>${ZadI18n.t("gateways.cc21748c95")}</h2><span>${ZadI18n.t("gateways.1ef1f01c0b")}</span></div>
 <div class="gateway-grid">${gatewayCard('iman','leaf','iman',d1,['daily','warrior','heart'],'iman')}${gatewayCard('ilm','library','ilm',d2,['hadith','library','seerah'],'ilm')}${gatewayCard('media','play','media',d3,['watch','publish'],'media')}${gatewayCard('rouh','moon','rouh',d4,['rouh.heart','rouh.worship','rouh.resolve'],'rouh')}</div>
 <div class="quiet-links"><a href="#library">${Zad.icon('library')}${t('library')}</a><a href="#heart-tasbih">${Zad.icon('heart')}${ZadI18n.t("quran-reader.ff27a05115")}</a></div>`;
  }

  function header(no, key, icon) {
    const parent = ['library', 'aqidah', 'seerah', 'tafsir', 'more'].includes(key) ? 'ilm' : 'home';
    return `<nav class="breadcrumb" aria-label="${ZadI18n.t("document-reader.95e840d5b7")}"><a href="#home">${ZadI18n.t("quran-reader.bfcf483079")}</a>${parent==='ilm'?`<span>/</span><a href="#ilm">${t('ilm')}</a>`:''}<span>/</span><span aria-current="page">${t(key)}</span></nav><div class="page-heading"><h1>${t(key)}</h1><a class="text-link" href="#${parent}">${t('back')}</a></div>`;
  }

  function moduleCard(icon, title, desc, attrs = '') {
    const view = attrs.match(/data-v21-view="([^"]+)"/)?.[1],
      app = attrs.match(/data-v21-app="([^"]+)"/)?.[1];
    const route = view || app || 'home';
    return `<article class="module-card"><span class="module-icon">${Zad.icon(route==='media'||route==='seerah'?'play':route==='heart'?'heart':route==='zad'?'shield':'book')}</span><div><h3><a href="#${route}">${title}</a></h3><p>${desc}</p></div><a class="module-open" href="#${route}" aria-label="${esc(title)}">${Zad.icon('arrow')}</a></article>`;
  }

  function iman() {
    return `${header('1','iman','')}<p class="section-intro">${ZadI18n.t("gateways.ce2c630354")}</p><div class="module-grid">${moduleCard('',t('daily'),ZadI18n.t("gateways.10e8a74216"),'data-v21-app="wird"')}${moduleCard('',t('warrior'),ZadI18n.t("gateways.75dd1e8144"),'data-v21-app="zad"')}${moduleCard('',t('heart'),ZadI18n.t("gateways.de2cf7b81d"),'data-v21-app="heart"')}</div>`;
  }

  function ilm() {
    return `${header('','ilm','')}<p class="section-intro">${ZadI18n.t("gateways.a85877488a")}</p><div class="module-grid">${moduleCard('',t('hadith'),ZadI18n.t("gateways.a97250a750"),'data-v21-app="hadith"')}${moduleCard('',t('library'),ZadI18n.t("gateways.bfafdecace"),'data-v21-view="library"')}${moduleCard('',t('aqidah'),ZadI18n.t("gateways.521781d5f1"),'data-v21-view="aqidah"')}${moduleCard('',t('seerah'),ZadI18n.t("gateways.9e91de9bc3"),'data-v21-view="seerah"')}${moduleCard('',t('tafsir'),ZadI18n.t("gateways.ed65b3f68c"),'data-v21-view="tafsir"')}${moduleCard('',t('future'),ZadI18n.t("gateways.5a15992076"),'data-v21-view="more"')}</div><aside class="v21KnowledgeDisclaimer" role="note"><h3>${ZadI18n.t("gateways.4ccfe8b965")}</h3><p>${ZadI18n.t("gateways.ad2439f5e7")}</p></aside>`;
  }

  function library() {
    return `${header('','library','')}<p class="section-intro">${ZadI18n.t("gateways.e250de5d11")}</p>${ZadLibrary.render()}`;
  }
  window.zaFilterLibrary = ZadLibrary.filter;

  function aqidah() {
    const ar = lang === 'ar';
    return ("" + (header('2 / Creed','aqidah','☪️')) + "\n <div class=\"v21SectionIntro\">" + (ZadI18n.t("gateways.72300031dd")) + "</div>\n <div class=\"v21TopicGrid v21AqidahBooks\">\n   <article class=\"v21TopicCard v21AqidahBookCard\">\n     <div class=\"glyph\">☝️</div>\n     <h3>" + (ZadI18n.t("gateways.56ea67459d")) + "</h3>\n     <p>" + (ZadI18n.t("gateways.d528f49d2e")) + "</p>\n     <div class=\"v21AqidahBookActions\"><a class=\"v21AqidahPdfBtn\" href=\"reader.html?book=tawhid\" rel=\"noopener noreferrer\">" + (ZadI18n.t("gateways.3532fa93fb")) + "</a></div>\n   </article>\n   <article class=\"v21TopicCard v21AqidahBookCard\">\n     <div class=\"glyph\">📘</div>\n     <h3>" + (ZadI18n.t("gateways.535b860a94")) + "</h3>\n     <p>" + (ZadI18n.t("gateways.93d76c84a3")) + "</p>\n     <div class=\"v21AqidahBookActions\"><a class=\"v21AqidahPdfBtn\" href=\"reader.html?book=wasitiyyah\" rel=\"noopener noreferrer\">" + (ZadI18n.t("gateways.3532fa93fb")) + "</a></div>\n   </article>\n   <article class=\"v21TopicCard v21AqidahBookCard\">\n     <div class=\"glyph\">📗</div>\n     <h3>" + (ZadI18n.t("gateways.ab16e9ef1e")) + "</h3>\n     <p>" + (ZadI18n.t("gateways.d528f49d2e")) + "</p>\n     <div class=\"v21AqidahBookActions\"><a class=\"v21AqidahPdfBtn\" href=\"reader.html?book=usul\" rel=\"noopener noreferrer\">" + (ZadI18n.t("gateways.3532fa93fb")) + "</a></div>\n   </article>\n </div>\n <article class=\"v21AqidahAdvice\">\n   <div class=\"v21AqidahAdviceHead\"><h3>" + (ZadI18n.t("gateways.49d964d40f")) + "</h3></div>\n   <div class=\"v21AqidahAdviceText\" dir=\"rtl\" lang=\"ar\" data-no-ui-translate=\"true\">\n     <p>أهم كتب العقيدة وأعظمها وأنفعها القرآن العظيم؛ فهو أهم كتاب وأصدق كتاب وأعظم كتاب وأشرف كتاب، فعليك أن تعض عليه بالنواجذ وتكثر من تلاوته من أوله وآخره، فكله عقيدة وتوجيه إلى كل خير وتحذير من كل شر، فاقرأه بتدبر وعناية ورغبة في العلم واستقم على ما دل عليه قولا وعملا وعقيدة تجد فيه كل خير من أوله إلى آخره من الفاتحة إلى قُلْ أَعُوذُ بِرَبِّ النَّاسِ. تأمل ذلك الكتاب العظيم وأكثر من تلاوته وتدبر معانيه، ففيه بيان العقيدة التي رضيها الله لك ورضيها للمؤمنين.</p>\n     <p>ثم بعد ذلك عليك بكتب الحديث الشريف كالصحيحين وغيرهما، ثم كتب أهل العلم المعروفين بالعلم والفضل والعقيدة الصحيحة ككتب شيخ الإسلام ابن تيمية، ومنها [العقيدة الواسطية] و[التدمرية] و[الحموية] و[منهاج السنة] و[مجموع الفتاوى]، و[عقيدة ابن أبي زيد القيرواني] وشرح ابن أبي العز [للعقيدة الطحاوية] فهو شرح مفيد.</p>\n     <p>ومن ذلك كتب ابن القيم رحمه الله فهذه كتب طيبة ومفيدة، ومنها كتاب [فتح المجيد] للشيخ عبدالرحمن بن حسن، و[كتاب التوحيد] للشيخ الإمام محمد بن عبدالوهاب، و[كشف الشبهات]، و[ثلاثة الأصول] له أيضا، ومنها [الدرر السنية] المشتملة على فتاوى علماء نجد.</p>\n     <p>وأوصي طلبة العلم في ابتداء طلبهم أن يحفظوا كتاب الله أو ما تيسر منه، وأن يحفظوا [كتاب التوحيد]، و[كشف الشبهات]، و[ثلاثة الأصول] و[العقيدة الواسطية] فهي مختصرة في بيان التوحيد بأقسامه الثلاثة، والعقيدة السلفية، وهذه هي العقيدة التي دعا إليها الشيخ الإمام محمد بن عبدالوهاب رحمه الله وهي عقيدة السلف، وحقيقتها التمسك بالكتاب والسنة وما كان عليه سلف الأمة في العقيدة والأحكام حسبما دل عليه كتاب الله عز وجل وسنة رسوله محمد ﷺ وما درج عليه الصحابة وأتباعهم بإحسان، ويسميها بعض الناس العقيدة الوهابية ويحسب أنها عقيدة جديدة تخالف الكتاب والسنة، وليس الأمر كذلك وإنما هي العقيدة التي درج عليها سلف الأمة كما تقدم، ولكن الأعداء لقبوها بهذا اللقب تنفيرا منها ومن أهلها، وبعض الناس فعل ذلك جهلا وتقليدا لغيره.</p>\n     <p>فينبغي لطالب العلم ألا يغتر بذلك! وأن يعرف الحقيقة من كتبهم وما درجوا عليه لا من أقوال خصومهم ولا ممن يجهل عقيدتهم، نسأل الله للجميع الهداية والتوفيق.</p>\n   </div>\n   <div class=\"v21AqidahSource\">المصدر: مجموع فتاوى ومقالات الشيخ ابن باز (7/179) — <a href=\"https://binbaz.org.sa/fatwas/2025/%D8%A7%D9%87%D9%85-%D9%83%D8%AA%D8%A8-%D8%A7%D9%84%D8%B9%D9%82%D9%8A%D8%AF%D8%A9#footnote-1\" target=\"_blank\" rel=\"noopener noreferrer\">فتوى: أهم كتب العقيدة</a></div>\n </article>")
  }

  function seerah() {
    const ar = lang === 'ar';
    return `${header('2 / Seerah','seerah','🕋')}
 <div class="v21SectionIntro">${ZadI18n.t("gateways.4f48602b3f")}</div>
 <div class="v21SeerahSources">
   <article class="v21SeerahSourceCard">
     <div class="v21SeerahSourceIcon">🎙️</div>
     <div>
       <h3>${ZadI18n.t("gateways.c9f231b6c1")}</h3>
       <p>${ZadI18n.t("gateways.bc252d7a23")}</p>
       <div class="v21SeerahActions">
         <button type="button" data-seerah-playlist="PL6C03BCFE87398A78" data-seerah-title="${ZadI18n.t("gateways.c9f231b6c1")}">${ZadI18n.t("gateways.a0257180b9")}</button>
         <a href="https://youtube.com/playlist?list=PL6C03BCFE87398A78" target="_blank" rel="noopener noreferrer">${ZadI18n.t("gateways.4703a934ed")}</a>
       </div>
     </div>
   </article>
   <article class="v21SeerahSourceCard">
     <div class="v21SeerahSourceIcon">📚</div>
     <div>
       <h3>${ZadI18n.t("gateways.caf36c8088")}</h3>
       <p>${ZadI18n.t("gateways.faa5f32c2a")}</p>
       <div class="v21SeerahActions">
         <button type="button" data-seerah-playlist="PLn_8pZxJyaFCBet-FaZSxIiUc36VLhmyB" data-seerah-title="${ZadI18n.t("gateways.420354237c")}">${ZadI18n.t("gateways.a0257180b9")}</button>
         <a href="https://youtube.com/playlist?list=PLn_8pZxJyaFCBet-FaZSxIiUc36VLhmyB" target="_blank" rel="noopener noreferrer">${ZadI18n.t("gateways.4703a934ed")}</a>
       </div>
     </div>
   </article>
 </div>
 <div class="v21SeerahPlayer" id="v21SeerahPlayer">
   <div class="v21PlayerScreen">
     <div class="v21PlayerPlaceholder">▶<strong>${ZadI18n.t("gateways.25bcdd17b1")}</strong><small>${ZadI18n.t("gateways.87d3607292")}</small></div>
   </div>
 </div>`;
  }

  function tafsir() {
    const ar = lang === 'ar';
    return `${header('2 / Tafsir','tafsir','📖')}
 <div class="v21SectionIntro">${ZadI18n.t("gateways.5ad5f8154f")}</div>
 <div class="v21TopicGrid v21TafsirBooks">
   <article class="v21TopicCard v21TafsirBookCard">
     <div class="glyph">📙</div>
     <h3>${ZadI18n.t("gateways.3c3ac0d11f")}</h3>
     <p>${ZadI18n.t("gateways.c65adcc616")}</p>
     <span class="v21TafsirPdfBtn v21TafsirComingSoon" aria-disabled="true">${ZadI18n.t("gateways.ce2e71c3a1")}</span>
   </article>
   <article class="v21TopicCard v21TafsirBookCard">
     <div class="glyph">📕</div>
     <h3>${ZadI18n.t("gateways.47b4e963f6")}</h3>
     <p>${ZadI18n.t("gateways.e36909e78b")}</p>
     <span class="v21TafsirPdfBtn v21TafsirComingSoon" aria-disabled="true">${ZadI18n.t("gateways.ce2e71c3a1")}</span>
   </article>
 </div>`;
  }

  function more() {
    return `${header('','future','')}<div class="empty-state"><h2>${t('coming')}</h2><p>${ZadI18n.t("gateways.7149130b14")}</p><a class="button secondary" href="#library">${t('library')}</a></div>`;
  }

  function media() {
    const ar = lang === 'ar';
    return `${header('','media','')}<p class="section-intro">${ZadI18n.t("gateways.4e184d3ea7")}</p><div class="v21MediaTabs" role="tablist" aria-label="${t('media')}"><button type="button" class="active" data-v21-media-tab="watch" role="tab" aria-selected="true" aria-controls="talkWatch">${t('watch')}</button><button type="button" data-v21-media-tab="publish" role="tab" aria-selected="false" aria-controls="talkPublish">${t('publish')}</button></div><div id="talkWatch" data-v21-media-pane="watch" role="tabpanel"><div class="empty-state" role="status">${ZadI18n.t("gateways.95c22c9a49")}</div></div><div id="talkPublish" class="hidden" data-v21-media-pane="publish" role="tabpanel"><div class="v21SubmitCard"><h2>${t('publish')}</h2><p class="status">${ZadI18n.t("gateways.c08f99a524")}</p><label for="v21VideoTitle">${ZadI18n.t("quran-reader.05b630f570")}</label><input id="v21VideoTitle" maxlength="140" required placeholder="${ZadI18n.t("gateways.a6037b4542")}"><label for="v21VideoFile">${ZadI18n.t("gateways.d9fcada57a")}</label><input id="v21VideoFile" type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" required><button type="button" data-v21-submit-video>${ZadI18n.t("quran-reader.fab2b68a6c")}</button><div class="v21SubmitStatus" id="v21SubmitStatus" role="status" aria-live="polite"></div></div></div>`;
  }

  function rouh() {
    return window.ZadRouh.render();
  }
  const views = {
    home,
    iman,
    ilm,
    library,
    aqidah,
    seerah,
    tafsir,
    more,
    media,
    rouh
  };

  function render(view, instant = false) {
    currentView = views[view] ? view : 'home';
    window.stopAllQuranAudio?.();
    document.querySelectorAll('video').forEach(v => v.pause());
    document.body.classList.remove('v21AppMode');
    delete document.body.dataset.v21Context;
    root.style.display = 'block';
    document.querySelectorAll('#wirdModule,#zadModule,#heartModule,#hadithModule').forEach(e => e.classList.add('hidden'));
    document.querySelector('nav.tabs')?.classList.add('hidden');
    shell.innerHTML = views[currentView]();
    applyLanguage(false);
    Zad.setRouteHash(currentView);
    document.dispatchEvent(new CustomEvent('zad:route', {
      detail: {
        view: currentView
      }
    }));
    if (currentView === 'media') window.zadTalkRefresh?.();
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }
  window.__v21Render = render;

  function ensureLanguagePanel() {
    let p = document.getElementById('v21LanguagePanel');
    if (p) return p;
    p = document.createElement('section');
    p.id = 'v21LanguagePanel';
    p.setAttribute('aria-hidden', 'true');
    p.innerHTML = `<div class="v21LangCard"><div class="v21LangHead"><h2><span id="v21LangTitle"></span></h2><button type="button" data-lang-close aria-label="Close">×</button></div><div class="v21LangOptions">${Object.entries(LANGS).map(([c,x])=>`<button type="button" data-v21-lang="${c}">${x.name}</button>`).join('')}</div><div class="v21LangNote" id="v21LangNote"></div></div>`;
    document.body.appendChild(p);
    p.addEventListener('click', e => {
      if (e.target === p || e.target.closest('[data-lang-close]')) closeLanguage();
      const b = e.target.closest('[data-v21-lang]');
      if (b) setLanguage(b.dataset.v21Lang)
    });
    return p;
  }

  function openLanguage() {
    const p = ensureLanguagePanel();
    p.classList.add('show');
    p.setAttribute('aria-hidden', 'false');
    refreshLanguagePanel();
    requestAnimationFrame(()=>p.querySelector('[aria-pressed="true"]')?.focus());
  }

  function closeLanguage() {
    const p = document.getElementById('v21LanguagePanel');
    if (p) {
      p.classList.remove('show');
      p.setAttribute('aria-hidden', 'true')
    }
  }

  function refreshLanguagePanel() {
    const p = ensureLanguagePanel();
    p.querySelector('#v21LangTitle').textContent = t('language');
    p.querySelector('#v21LangNote').textContent = t('settingsLang');
    p.querySelectorAll('[data-v21-lang]').forEach(b => {const selected=b.dataset.v21Lang === lang;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));b.lang=b.dataset.v21Lang;b.dir=LANGS[b.dataset.v21Lang].dir;});
    p.querySelector('[data-lang-close]').setAttribute('aria-label', ZadI18n.t("settings.ca90c297b0"));
  }

  function setLanguage(code) {
    if (!LANGS[code]) return;
    const route = window.ZadCurrentRoute || currentView;
    // Keep the actual file input and in-flight upload nodes while rebuilding localized chrome.
    const publishOpen=route==='media' && !document.getElementById('talkPublish')?.classList.contains('hidden');
    const draftNodes=route==='media'?['#v21VideoTitle','#v21VideoFile','[data-v21-submit-video]','#v21SubmitStatus','#zadTalkUploadProgress'].map(selector=>({selector,node:document.querySelector(selector)})).filter(x=>x.node):[];
    const oldLocale=ZadI18n.locale;
    const statusNode=document.getElementById('v21SubmitStatus');
    const statusKey=statusNode?Object.keys(ZadI18nCatalog).find(k=>k.startsWith('talk.')&&ZadI18nCatalog[k][oldLocale]===statusNode.textContent):null;
    lang = code;
    Zad.storage.setItem(LANG_KEY, lang);
    applyLanguage(true);
    closeLanguage();
    if (window.ZadNavigate) window.ZadNavigate(route, {
      replace: true
    });
    else render(currentView, true);
    for(const {selector,node} of draftNodes){
      const next=document.querySelector(selector);
      if(next){
        if(node.tagName==='INPUT')node.placeholder=next.placeholder;
        if(node.tagName==='BUTTON')node.textContent=next.textContent;
        next.replaceWith(node);
      }else if(node.id==='zadTalkUploadProgress')document.getElementById('v21SubmitStatus')?.before(node);
    }
    if(statusKey&&statusNode)statusNode.textContent=ZadI18n.t(statusKey);
    if(publishOpen)document.querySelector('[data-v21-media-tab="publish"]')?.click();
    window.v22OnLanguageChange?.();
    document.dispatchEvent(new CustomEvent('zad:language'));
  }

  function applyLanguage(walk = true) {
    ZadI18n.setLocale(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGS[lang].dir;
    document.documentElement.dataset.v21Lang = lang;
    const code = document.getElementById('v21FloatingLangCode');
    if (code) code.textContent = lang.toUpperCase();
    const rb = document.querySelector('#v21ReturnButton span');
    if (rb) rb.textContent = ZadI18n.t("quran-reader.113ffcc460");
    const fl = document.getElementById('v21FloatingLanguage');
    if (fl) fl.setAttribute('aria-label', t('language'));
    if (walk) requestAnimationFrame(() => {
      const active = [...document.querySelectorAll('#wirdModule,#zadModule,#heartModule,#hadithModule')].find(el => !el.classList.contains('hidden'));
      if (active) ZadI18n.apply(active);
      window.v22TranslateActive?.()
    });
    refreshLanguagePanel();
  }
  window.ZadSetLanguage = setLanguage;
  window.ZadGatewayLabel = t;
  window.v21OpenLanguage = openLanguage;
  window.v21CloseLanguage = closeLanguage;

  function openExisting(app) {
    window.ZadNavigate?.(app);
  }
  window.v21ShowGateway = function() {
    document.body.classList.remove('v21AppMode');
    delete document.body.dataset.v21Context;
    root.style.display = 'block';
    try {
      document.querySelectorAll('#wirdModule,#zadModule,#heartModule,#hadithModule').forEach(x => x.classList.add('hidden'))
    } catch (e) {}
    render('home', true)
  };
  window.zadGoHome = function(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    window.v21ShowGateway()
  };

  shell.addEventListener('click', e => {
    const action = e.target.closest('[data-v21-action]');
    if (action) {
      if (action.dataset.v21Action === 'language') openLanguage();
      if (action.dataset.v21Action === 'palette') {
        const p = document.getElementById('zaGatewayPalette');
        if (p) p.classList.toggle('hidden');
      }
      return
    }
    const v = e.target.closest('[data-v21-view]');
    if (v) {
      render(v.dataset.v21View);
      return
    }
    const a = e.target.closest('[data-v21-app]');
    if (a) {
      openExisting(a.dataset.v21App);
      return
    }
    const tab = e.target.closest('[data-v21-media-tab]');
    if (tab) {
      const key = tab.dataset.v21MediaTab;
      shell.querySelectorAll('[data-v21-media-tab]').forEach(b => {
        b.classList.toggle('active', b === tab);
        b.setAttribute('aria-selected', String(b === tab));
      });
      document.querySelectorAll('video').forEach(v => v.pause());
      shell.querySelectorAll('[data-v21-media-pane]').forEach(p => p.classList.toggle('hidden', p.dataset.v21MediaPane !== key));
      return
    }

  });
  shell.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-v21-view]')) {
      e.preventDefault();
      render(e.target.dataset.v21View)
    }
  });

  // --- Quran reader inspired by the clean verse-by-verse workflow of Quran.com ---
  const QV = {
    arabic: true,
    translation: lang !== 'ar',
    tajweed: true,
    translationLang: lang === 'ar' ? 'en' : LANGS[lang].quran
  };
  const qvTajweedCache = new Map(),
    qvOriginalArabic = new WeakMap();

  function qvText(key) {
    const pack = {
      verseByVerse: ZadI18n.pack("gateways.aa0820116b"),
      arabic: ZadI18n.pack("gateways.d274159863"),
      translation: ZadI18n.pack("gateways.d88673aeea"),
      tajweed: ZadI18n.pack("gateways.95fe8d9773"),
      page: ZadI18n.pack("gateways.050b74cfd8"),
      juz: ZadI18n.pack("gateways.f74f9b04c7"),
      hizb: ZadI18n.pack("gateways.6a66dd52e0"),
      surah: ZadI18n.pack("gateways.c15b3a94c1"),
      loading: ZadI18n.pack("gateways.693423b7e5"),
      unavailable: ZadI18n.pack("gateways.90d22eb477")
    }
    return (pack[key] || {})[lang] || (pack[key] || {}).en || key
  }

  function qvApiLang() {
    const c = QV.translationLang;
    return ['en', 'fr', 'id', 'tr', 'ur', 'es'].includes(c) ? c : 'en'
  }

  function cleanHtmlText(html) {
    return Zad.plainHTML(html).replace(/\s+/g, ' ').trim();
  }
  async function qvTranslations(chapter, code) {
    return ZadQuranSources.translations(chapter, code);
  }
  async function qvTajweed(chapter) {
    try {
      const r = await Zad.fetch('https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=' + Number(chapter));
      if (!r.ok) return new Map();
      const j = await r.json();
      return new Map((j.verses || []).map(v => [v.verse_key, Zad.tajweedHTML(v.text_uthmani_tajweed)]));
    } catch (_) {
      return new Map();
    }
  }

  function qvKeyForBlock(block) {
    const x = block.querySelector('[id^="audioStatus_"]') || block.querySelector('[id^="tafsirBtn_"]');
    const m = x?.id.match(/_(\d+)_(\d+)$/);
    return m ? `${Number(m[1])}:${Number(m[2])}` : null
  }

  function qvMetaForKey(key) {
    try {
      const [s, a] = key.split(':').map(Number);
      return flatAyahs.find(x => x.surahNumber === s && x.numberInSurah === a) || null
    } catch (e) {
      return null
    }
  }

  function qvUpdateMeta() {
    const first = document.querySelector('#wirdContent .ayahBlock[data-qv-key],#searchResults .ayahBlock[data-qv-key]');
    const box = document.getElementById('qvReaderMeta');
    if (!first || !box) return;
    const meta = qvMetaForKey(first.dataset.qvKey);
    if (!meta) return;
    const h = meta.hizbQuarter ? Math.ceil(meta.hizbQuarter / 4) : '';
    box.textContent = `${qvText('page')} ${meta.page||'—'}   ${qvText('juz')} ${meta.juz||'—'}   ${qvText('hizb')} ${h||'—'}`
  }

  function qvFillSurahSelect() {
    const sel = document.getElementById('qvSurahSelect');
    if (!sel || typeof quran === 'undefined' || !quran?.surahs) return;
    const cur = sel.value;
    sel.innerHTML = quran.surahs.map(s => `<option value="${s.number}">${s.number}. ${lang==='ar'?esc(s.name):esc(s.englishName||s.name)}</option>`).join('');
    if (cur) sel.value = cur
  }

  function ensureReaderControls() {
    const content = document.getElementById('wirdContent');
    if (!content || document.getElementById('qvReaderBar')) return;
    const card = content.closest('.card');
    if (!card) return;
    const bar = document.createElement('div');
    bar.id = 'qvReaderBar';
    bar.className = 'qvReaderBar';
    bar.innerHTML = ("<div class=\"qvReaderTop\"><div class=\"qvSurah\"><label for=\"qvSurahSelect\">" + (qvText('surah')) + "</label><select id=\"qvSurahSelect\"></select></div><div id=\"qvReaderMeta\" class=\"qvReaderMeta\">—</div></div><div class=\"qvReaderModes\"><button type=\"button\" class=\"active\" disabled>▤ " + (qvText('verseByVerse')) + "</button><button type=\"button\" data-qv-toggle=\"arabic\">" + ZadI18n.html("gateways.19e14982ec",{v0:(qvText('arabic'))}) + "</button><button type=\"button\" data-qv-toggle=\"translation\">A " + (qvText('translation')) + "</button><button type=\"button\" data-qv-toggle=\"tajweed\">◉ " + (qvText('tajweed')) + "</button><select id=\"qvTranslationLang\" aria-label=\"" + (qvText('translation')) + "\">" + (['en','fr','id','tr','ur','es'].map(c=>`<option value="${c}">${LANGS[c].name}</option>`).join('')) + "</select></div><div class=\"qvSource\">" + (t('source')) + "</div>");
    card.insertBefore(bar, content);
    qvFillSurahSelect();
    document.getElementById('qvTranslationLang').value = QV.translationLang;
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-qv-toggle]');
      if (!b) return;
      const k = b.dataset.qvToggle;
      QV[k] = !QV[k];
      qvSyncButtons();
      qvEnhanceAll(true)
    });
    bar.querySelector('#qvTranslationLang').addEventListener('change', e => {
      QV.translationLang = e.target.value;
      QV.translation = true;
      qvSyncButtons();
      qvEnhanceAll(true)
    });
    bar.querySelector('#qvSurahSelect').addEventListener('change', e => {
      try {
        renderSurah(Number(e.target.value));
        setTimeout(() => qvEnhanceAll(true), 0)
      } catch (err) {
        console.warn(err)
      }
    });
    qvSyncButtons()
  }

  function qvSyncButtons() {
    document.querySelectorAll('[data-qv-toggle]').forEach(b => b.classList.toggle('active', !!QV[b.dataset.qvToggle]));
    const sel = document.getElementById('qvTranslationLang');
    if (sel) sel.classList.toggle('hidden', !QV.translation)
  }
  async function qvEnhanceBlock(block, force = false) {
    const key = qvKeyForBlock(block);
    if (!key) return;
    block.dataset.qvKey = key;
    block.classList.add('qvVerse');
    const [chapter] = key.split(':').map(Number);
    const ar = block.querySelector('.ayahText');
    if (ar) {
      ar.classList.add('qvArabic');
      if (!qvOriginalArabic.has(ar)) qvOriginalArabic.set(ar, ar.innerHTML);
      ar.style.display = QV.arabic ? '' : 'none'
    }
    block.querySelectorAll('[id^="tafsirBtn_"],.tafsirBox').forEach(x => x.remove());
    let tr = block.querySelector('.qvTranslation');
    if (!tr) {
      tr = document.createElement('div');
      tr.className = 'qvTranslation';
      tr.setAttribute('dir', LANGS[QV.translationLang]?.dir || 'ltr');
      ar?.insertAdjacentElement('afterend', tr)
    }
    tr.style.display = QV.translation ? '' : 'none';
    tr.dir = LANGS[QV.translationLang]?.dir || 'ltr';
    if (QV.translation) {
      tr.textContent = qvText('loading');
      try {
        const map = await qvTranslations(chapter, qvApiLang());
        tr.textContent = map.get(key) || qvText('unavailable')
      } catch (e) {
        tr.textContent = qvText('unavailable')
      }
    }
    if (ar) {
      if (QV.tajweed) {
        try {
          const map = await qvTajweed(chapter);
          const html = map.get(key);
          if (html) ar.innerHTML = html
        } catch (e) {
          ar.innerHTML = qvOriginalArabic.get(ar)
        }
      } else ar.innerHTML = qvOriginalArabic.get(ar)
    }
  }
  let qvToken = 0;
  async function qvEnhanceAll(force = false) {
    const blocks = [...document.querySelectorAll('#searchResults .ayahBlock')];
    const token = ++qvToken;
    for (const b of blocks) {
      if (token !== qvToken) return;
      await qvEnhanceBlock(b, force)
    }
    qvSyncButtons()
  }

  function initQuranReader() {
    document.querySelector('#wirdModule #books')?.remove();
    document.querySelector('#wirdModule #tab-books')?.remove();
    document.querySelectorAll('#wirdModule [id^="tafsirBtn_"],#wirdModule .tafsirBox').forEach(x => x.remove());

    /* The newer v22 Quran reader is now the only Daily-Wird reader.
       Keep the legacy node for old calculations, but never render/show/enhance it. */
    const oldBar = document.getElementById('qvReaderBar');
    if (oldBar) oldBar.remove();
    const c = document.getElementById('wirdContent');
    if (c) {
      c.hidden = true;
      c.setAttribute('aria-hidden', 'true');
      c.style.setProperty('display', 'none', 'important');
    }

    /* Search remains functional without starting the old Daily-Wird observer. */
    const sr = document.getElementById('searchResults');
    if (sr && !sr.dataset.qvObserved) {
      sr.dataset.qvObserved = '1';
      new MutationObserver(() => requestAnimationFrame(() => qvEnhanceAll())).observe(sr, {
        childList: true,
        subtree: false
      });
    }
  }

  function qvOnInterfaceLanguageChange() {
    QV.translationLang = lang === 'ar' ? 'en' : qvApiLangFromInterface();
    QV.translation = lang !== 'ar';
    setTimeout(() => {
      initQuranReader();
      qvEnhanceAll(true)
    }, 0)
  }

  function qvApiLangFromInterface() {
    return ['en', 'fr', 'id', 'tr', 'ur', 'es'].includes(lang) ? lang : 'en'
  }
  window.v21LoadSeerahVideo = function(url, title = '') {
    const p = document.getElementById('v21SeerahPlayer');
    if (!p) return;
    const yt = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/);
    if (yt) {
      p.innerHTML = `<iframe class="v21PlayerFrame" src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="${esc(title||ZadI18n.t('gateways.fb7e622386'))}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
    } else {
      p.innerHTML = `<video class="v21PlayerVideo" controls playsinline preload="metadata" src="${esc(Zad.mediaURL(url))}"></video>`
    }
  };
  window.v21LoadSeerahPlaylist = function(listId, title = '') {
    const p = document.getElementById('v21SeerahPlayer');
    if (!p || !/^[A-Za-z0-9_-]{10,}$/.test(String(listId))) return;

    /* Direct YouTube embed. This works when index.html is served by GitHub Pages
       because the page sends a real HTTPS Referer. No seerah-player.html needed. */
    const src = 'https://www.youtube.com/embed/videoseries' +
      '?list=' + encodeURIComponent(listId) +
      '&playsinline=1&rel=0&modestbranding=1';

    p.innerHTML = `<div class="v21InSitePlayerShell">
   <div class="v21InSitePlayerHead">
     <span class="v21InSiteLiveDot"></span>
     <strong>${esc(title||ZadI18n.t("gateways.fb7e622386"))}</strong>
     <a href="https://youtube.com/playlist?list=${encodeURIComponent(listId)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
   </div>
   <iframe class="v21PlayerFrame v21InSiteIframe"
     src="${src}"
     title="${esc(title||ZadI18n.t('gateways.fb7e622386'))}"
     loading="eager"
     referrerpolicy="strict-origin-when-cross-origin"
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
     allowfullscreen></iframe>
 </div>`;
    p.scrollIntoView({
      behavior: 'auto',
      block: 'start'
    });
  };
  document.addEventListener('click', function(e) {
    const b = e.target.closest('[data-seerah-playlist]');
    if (!b) return;
    e.preventDefault();
    window.v21LoadSeerahPlaylist?.(b.dataset.seerahPlaylist, b.dataset.seerahTitle || '');
  }, true);

  // Public UI never exposes moderation. A future admin console should be a separate protected route backed by server-side/RLS authorization.
  window.v21OpenAdminReview = undefined;

  // Settings language row.
  function addSettingsLanguage() {
    const list = document.querySelector('#globalSettingsPanel .globalSettingsList');
    if (!list || list.querySelector('.v21SettingsLanguageRow')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'globalSettingsRow v21SettingsLanguageRow';
    b.innerHTML = '<span class="settingsRowIcon">🌐</span><span class="settingsRowText"><b>' + t('language') + '</b><small>Arabic · English · Français · Indonesia · Türkçe · اردو · Español</small></span><span class="settingsChevron">←</span>';
    b.addEventListener('click', () => {
      window.globalCloseSettings?.();
      openLanguage()
    });
    list.insertBefore(b, list.firstElementChild)
  }

  applyLanguage(false);
  ensureLanguagePanel();
  addSettingsLanguage();
  render('home', true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => {
    addSettingsLanguage();
    applyLanguage(true)
  }, {
    once: true
  });
  else applyLanguage(true);
})();

