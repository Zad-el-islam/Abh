(() => {
  'use strict';
  document.title=ZadI18n.t('gateways.fb7e622386')+' | '+ZadI18n.t('gateways.eeeabade98');
  const lists = {
    get 'PL6C03BCFE87398A78'() { return ZadI18n.t("gateways.c9f231b6c1"); },
    get 'PLn_8pZxJyaFCBet-FaZSxIiUc36VLhmyB'() { return ZadI18n.t("gateways.420354237c"); }
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-playlist]');
    if (!b || !lists[b.dataset.playlist]) return;
    const frame = document.createElement('iframe');
    frame.className = 'v21PlayerFrame';
    frame.title = lists[b.dataset.playlist];
    frame.src = 'https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(b.dataset.playlist) + '&playsinline=1&rel=0';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    document.getElementById('player').replaceChildren(frame);
    document.querySelectorAll('[data-playlist]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    document.getElementById('player').scrollIntoView({
      block: 'start',
      behavior: 'auto'
    });
  });
})();

