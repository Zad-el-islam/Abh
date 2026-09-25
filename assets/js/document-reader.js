/* Native PDF viewing is opt-in; original/open/download links remain usable on every device. */
(() => {
  'use strict';
  const id = new URLSearchParams(location.search).get('book') || 'quran';
  const book = ZadDocuments.find(b => b.id === id),
    host = document.getElementById('documentContent'),
    e = Zad.escape;
  const lang = Zad.storage.getItem('zad_islam_language_v3') || 'ar',
    ar = lang === 'ar';
  document.documentElement.lang = ['ar', 'en', 'fr', 'id', 'tr', 'ur', 'es'].includes(lang) ? lang : 'ar';
  document.documentElement.dir = ['ar', 'ur'].includes(lang) ? 'rtl' : 'ltr';
  if (!book) {
    document.title=ZadI18n.t("document-reader.0746b42655")+" | "+ZadI18n.t("gateways.eeeabade98");
    host.innerHTML = `<div class="empty-state"><h1>${ZadI18n.t("document-reader.0746b42655")}</h1><p>${ZadI18n.t("document-reader.b995f89e77")}</p><a class="button" href="index.html#library">${ZadI18n.t("document-reader.931ad23062")}</a></div>`;
    return;
  }
  const title = ar || lang === 'ur' ? book.title : book.englishTitle;
  document.title = title + ' | ' + ZadI18n.t("gateways.eeeabade98");
  const key = 'zad_pdf_page_' + book.id;
  const savedPage = Number(Zad.storage.getItem(key)) || 1;
  const page = Number.isFinite(savedPage) ? Math.max(1, Math.min(book.pages, savedPage)) : 1;
  Zad.storage.setItem('zad_last_book_v1', book.id);
  host.innerHTML = `<nav class="breadcrumb" aria-label="${ZadI18n.t("document-reader.95e840d5b7")}"><a href="index.html#home">${ZadI18n.t("quran-reader.bfcf483079")}</a><span>/</span><a href="index.html#library">${ZadI18n.t("document-reader.9ff4670ff4")}</a><span>/</span><span aria-current="page">${e(title)}</span></nav><section class="document-details"><div class="book-cover ${book.category}" aria-hidden="true"><img src="assets/icons/crescent.svg" alt="" width="32" height="32"><span lang="ar" dir="rtl">${e(book.title)}</span><small lang="ar" dir="rtl">${e(book.author)}</small></div><div><span class="eyebrow">${book.category==='quran'?ZadI18n.t("document-reader.355bd9c0e1"):ZadI18n.t("gateways.4c70ca74a0")}</span><h1 dir="auto">${e(title)}</h1>${book.author?`<p lang="ar" dir="rtl">${e(book.author)}</p>`:''}<div class="document-meta"><span>PDF</span><span>${book.pages.toLocaleString(lang)} ${ZadI18n.t("document-reader.b7ef0df4eb")}</span></div><div class="document-actions"><button type="button" id="startReading">${Zad.icon('book')}${ZadI18n.t("document-reader.10e70830b7")}</button><a class="button secondary" href="${book.file}" target="_blank" rel="noopener noreferrer">${ZadI18n.t("document-reader.c6f1cd6f2b")}</a><a class="text-link" href="${book.file}" download>${Zad.icon('download')}${ZadI18n.t("document-reader.69357e138d")}</a></div></div></section><section class="document-reader" id="documentReader"><div class="document-toolbar"><h2>${ZadI18n.t("document-reader.ace946e49f")}</h2><div class="row"><label for="pdfPage">${ZadI18n.t("document-reader.6b08e93ffb")}</label><input id="pdfPage" type="number" min="1" max="${book.pages}" value="${page}" aria-describedby="readingProgressNote"><button type="button" id="openPage" class="secondary">${ZadI18n.t("document-reader.2afbcf7a78")}</button><button type="button" id="fullScreen" class="secondary">${ZadI18n.t("document-reader.8feab114ea")}</button></div></div><div id="documentViewport" class="document-viewport"><div class="document-placeholder">${Zad.icon('book')}<p>${ZadI18n.t("document-reader.f1e61a56a9")}</p><small>${ZadI18n.t("document-reader.f11f913ce4")}</small></div></div><p class="document-fallback" id="pdfStatus" role="status">${ZadI18n.t("document-reader.8de5747465")} <a href="${book.file}" target="_blank" rel="noopener noreferrer">${ZadI18n.t("document-reader.c6f1cd6f2b")}</a></p></section><p class="reading-progress-note" id="readingProgressNote">${ZadI18n.t("document-reader.f57b06f556")}</p>`;
  const field = document.getElementById('pdfPage'),
    viewport = document.getElementById('documentViewport'),
    status = document.getElementById('pdfStatus');
  let loading = false;
  async function open() {
    if (loading) return;
    const value = Math.round(Number(field.value));
    if (!Number.isFinite(value) || value < 1 || value > book.pages) {
      field.setCustomValidity(ZadI18n.t("document-reader.dca67f553b"));
      field.reportValidity();
      return;
    }
    field.setCustomValidity('');
    loading = true;
    document.getElementById('startReading').disabled = true;
    try {
      if (location.protocol !== 'file:') {
        const response = await Zad.fetch(book.file, {
          method: 'HEAD'
        });
        if (!response.ok) throw new Error('missing_pdf');
      }
      const frame = document.createElement('iframe');
      frame.title = title;
      frame.src = book.file + '#page=' + value + '&view=FitH';
      frame.referrerPolicy = 'same-origin';
      viewport.replaceChildren(frame);
      Zad.storage.setItem(key, String(value));
      viewport.scrollIntoView({
        block: 'start',
        behavior: 'auto'
      });
      frame.addEventListener('error', () => {
        status.firstChild.textContent = ZadI18n.t("document-reader.ddaa751f9e");
      });
    } catch (_) {
      viewport.innerHTML = `<div class="document-placeholder"><h2>${ZadI18n.t("document-reader.9fe0d0dc7d")}</h2><p>${ZadI18n.t("document-reader.4e4f179f3c")}</p></div>`;
    } finally {
      loading = false;
      document.getElementById('startReading').disabled = false;
    }
  }
  document.getElementById('startReading').addEventListener('click', open);
  document.getElementById('openPage').addEventListener('click', open);
  field.addEventListener('input', () => field.setCustomValidity(''));
  const full = document.getElementById('fullScreen'),
    reader = document.getElementById('documentReader');
  if (!reader.requestFullscreen) full.hidden = true;
  full.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await reader.requestFullscreen();
    } catch (_) {
      Zad.toast(ZadI18n.t("document-reader.d3ace77d97"));
    }
  });
  document.addEventListener('fullscreenchange', () => {
    full.textContent = document.fullscreenElement ? ZadI18n.t("document-reader.88bf2fd997") : ZadI18n.t("document-reader.8feab114ea");
  });
})();

