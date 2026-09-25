/* Optional legacy PDFs were not supplied. Their original content/favorites remain available. */
(() => {
  const unavailable = () => Zad.toast(ZadI18n.t("reading-links.81caf8d5e6"));
  window.openZadBook = unavailable;
  window.openZadBookExternal = unavailable;
  window.saveZadBook = unavailable;
  window.closeZadBook = () => {
    document.getElementById('zadBookViewer')?.removeAttribute('src');
    document.getElementById('zadBookViewerCard')?.classList.add('hidden');
  };
})();

