/* Metadata is separate from the immutable PDF assets. Identified from their title pages. */
window.ZadDocuments = Object.freeze([{
  id: 'quran',
  title: 'القرآن الكريم',
  englishTitle: 'The Holy Quran',
  author: '',
  category: 'quran',
  file: 'quran.pdf',
  pages: 569,
  get description() { return ZadI18n.t("documents.b5b4dd5f08"); }
}, {
  id: 'tawhid',
  title: 'كتاب التوحيد',
  englishTitle: 'Kitab al-Tawhid',
  author: 'محمد بن عبد الوهاب',
  category: 'aqidah',
  file: 'kitab_al_tawhid.pdf',
  pages: 168,
  get description() { return ZadI18n.t("documents.02c273d4ba"); }
}, {
  id: 'wasitiyyah',
  title: 'العقيدة الواسطية',
  englishTitle: 'Al-Aqidah al-Wasitiyyah',
  author: 'أحمد بن عبد الحليم ابن تيمية',
  category: 'aqidah',
  file: 'al_aqidah_al_wasitiyyah.pdf',
  pages: 160,
  get description() { return ZadI18n.t("documents.0d973c5e29"); }
}, {
  id: 'usul',
  title: 'الأصول الثلاثة وأدلتها',
  englishTitle: 'The Three Fundamental Principles',
  author: 'محمد بن عبد الوهاب',
  category: 'aqidah',
  file: 'thalathat_al_usul.pdf',
  aliases: ['book.pdf'],
  pages: 34,
  get description() { return ZadI18n.t("documents.5252ba2a89"); }
}]);
window.ZadLibrary = (() => {
  const e = Zad.escape;

  function title(b) {
    return document.documentElement.lang === 'ar' || document.documentElement.lang === 'ur' ? b.title : b.englishTitle;
  }

  function card(b) {
    return `<article class="book-card zaLibraryBook" data-lib-cat="${b.category}" data-lib-search="${e(Zad.normalize(b.title+' '+b.englishTitle+' '+b.author))}"><div class="book-cover ${b.category}" aria-hidden="true"><img src="assets/icons/crescent.svg" alt="" width="26" height="26"><span lang="ar" dir="rtl">${e(b.title)}</span><small lang="ar" dir="rtl">${e(b.author)}</small></div><div class="book-copy"><span class="eyebrow">${b.category==='quran'?(ZadI18n.t("documents.78cbb551f8")):(ZadI18n.t("gateways.4c70ca74a0"))}</span><h3 dir="auto">${e(title(b))}</h3><p dir="rtl" lang="ar">${e(b.author)}</p><small>${b.pages.toLocaleString(document.documentElement.lang)} ${ZadI18n.t("document-reader.b7ef0df4eb")}</small><a class="text-link" href="reader.html?book=${b.id}">${ZadI18n.t("documents.57c5fd88ff")} ${Zad.icon('arrow')}</a></div></article>`;
  }

  function render() {
    const ar = Zad.isArabic();
    return `<div class="library-tools"><label class="search-field">${Zad.icon('search')}<input id="zaLibrarySearch" type="search" aria-label="${ZadI18n.t("documents.23f6d05c18")}" placeholder="${ZadI18n.t("documents.bc3b34e09d")}" oninput="zaFilterLibrary()"></label><label class="category-field"><span>${ZadI18n.t("documents.3a7c87ed01")}</span><select id="zaLibraryCategory" onchange="zaFilterLibrary()"><option value="all">${ZadI18n.t("documents.0cd28eaa03")}</option><option value="quran">${ZadI18n.t("documents.78cbb551f8")}</option><option value="aqidah">${ZadI18n.t("gateways.4c70ca74a0")}</option></select></label></div><div class="library-grid">${ZadDocuments.map(card).join('')}</div><p id="zaLibraryEmpty" class="empty-state hidden" role="status">${ZadI18n.t("documents.caace8cf39")}</p>`;
  }

  function filter() {
    const q = Zad.normalize(document.getElementById('zaLibrarySearch')?.value);
    const cat = document.getElementById('zaLibraryCategory')?.value || 'all';
    let n = 0;
    document.querySelectorAll('.zaLibraryBook').forEach(c => {
      const show = (!q || c.dataset.libSearch.includes(q)) && (cat === 'all' || c.dataset.libCat === cat);
      c.classList.toggle('hidden', !show);
      if (show) n++;
    });
    document.getElementById('zaLibraryEmpty')?.classList.toggle('hidden', n > 0);
  }
  return {
    render,
    card,
    filter
  };
})();

