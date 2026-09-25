/* One route controller for gateway and preserved feature modules. */
(() => {
  'use strict';
  const originalSwitch = window.switchMainApp;
  const modules = {
    wird: 'wirdModule',
    zad: 'zadModule',
    heart: 'heartModule',
    hadith: 'hadithModule'
  };
  const views = ['home', 'iman', 'ilm', 'library', 'aqidah', 'seerah', 'tafsir', 'more', 'media', 'rouh'];
  const titles = {
    ar: {
      get home() { return ZadI18n.t("quran-reader.bfcf483079"); },
      get iman() { return ZadI18n.t("gateways.249b9bc3b4"); },
      get ilm() { return ZadI18n.t("gateways.9cfadeada3"); },
      get media() { return ZadI18n.t("gateways.fe99b36520"); },
      get wird() { return ZadI18n.t("gateways.f7c9bb7bc3"); },
      get zad() { return ZadI18n.t("gateways.017bfb0913"); },
      get heart() { return ZadI18n.t("gateways.1f3b868f29"); },
      get hadith() { return ZadI18n.t("gateways.a8cb26a080"); },
      get library() { return ZadI18n.t("gateways.fdf8eba0a0"); },
      get aqidah() { return ZadI18n.t("gateways.4c70ca74a0"); },
      get seerah() { return ZadI18n.t("gateways.fb7e622386"); },
      get tafsir() { return ZadI18n.t("gateways.47f4ac555b"); },
      get rouh() { return ZadI18n.t("gateways.ca3dff37d8"); },
      get more() { return ZadI18n.t("navigation.b8db5d33a6"); }
    }
  };
  const parent = route => route.startsWith('heart') || route.startsWith('wird') || route === 'zad' ? 'iman' : route === 'hadith' || ['library', 'aqidah', 'seerah', 'tafsir', 'more'].includes(route) ? 'ilm' : 'home';

  function context(route) {
    const key = route.split('-')[0],
      labelKey = ({
        wird: 'daily',
        zad: 'warrior',
        more: 'future'
      })[key] || key;
    const localized = window.ZadGatewayLabel?.(labelKey);
    const label = localized && localized !== labelKey ? localized : titles.ar[key];
    const nav = modules[key] ? parent(route) : ['library', 'aqidah', 'seerah', 'tafsir', 'more'].includes(key) ? 'ilm' : key;
    document.querySelectorAll('.primary-nav a').forEach(a => {
      if (a.dataset.route === nav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    const bar = document.getElementById('contextBar');
    bar.classList.toggle('hidden', !modules[key]);
    document.getElementById('currentSection').textContent = label || '';
    document.title = (key === 'home' ? '' : label + ' | ') + (ZadI18n.t("gateways.eeeabade98"));
    document.getElementById('zadPointsChip').innerHTML = Zad.icon('leaf') + '<span>' + (ZadI18n.t("navigation.6e985c934b")) + '</span>';
  }

  function navigate(route, options = {}) {
    route = String(route || 'home');
    const [key, sub] = route.split('-');
    if (!modules[key] && !views.includes(key)) route = 'home';
    if (route === 'home' && key !== 'home') return navigate('home', options);
    window.stopAllQuranAudio?.();
    document.querySelectorAll('video').forEach(v => v.pause());
    window.zadClosePointsPanel?.();
    window.ZadCurrentRoute = route;
    if (modules[key]) {
      document.getElementById('v21Gateway').style.display = 'none';
      document.body.classList.add('v21AppMode');
      document.body.dataset.v21Context = parent(route);
      originalSwitch(key, false);
      if (key === 'heart') window.heartShowPage(sub || 'home');
      if (key === 'wird') {
        window.showPage(['search', 'quranAudio', 'settings'].includes(sub) ? sub : 'home');
        window.v22InitQuranReader?.();
      }
      window.v22TranslateActive?.();
      Zad.setRouteHash(route, !!options.replace);
      document.dispatchEvent(new CustomEvent('zad:route', {
        detail: {
          view: route
        }
      }));
    } else {
      window.__v21Render(key, true);
    }
    context(route);
    window.ZadSettings?.translate();
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
    if (!options.initial) {
      const heading = document.querySelector(modules[key] ? '#' + modules[key] + ' h1' : '#v21GatewayShell h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({
          preventScroll: true
        });
      }
    }
  }
  window.ZadNavigate = navigate;
  window.switchMainApp = app => navigate(app);
  window.zadGoHome = e => {
    e?.preventDefault();
    navigate('home');
  };
  window.v21ShowGateway = () => navigate('home');
  window.showZadMainHub = () => navigate('home');
  window.enterZadSection = app => navigate(app);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (a && a.hash !== '#mainContent' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      navigate(a.hash.slice(1));
      return;
    }
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const action = b.dataset.action;
    if (action === 'back') navigate(parent(window.ZadCurrentRoute || 'home'));
    if (action === 'account') window.zadToggleMyPanel(e);
    if (action === 'language') window.v21OpenLanguage();
    if (action === 'settings') window.ZadSettings?.open();
    if (action === 'search') window.ZadSettings?.search();
    if (action === 'about') window.ZadSettings?.about();
  });
  addEventListener('hashchange', () => {
    const route = location.hash.slice(1) || 'home';
    if (route !== window.ZadCurrentRoute) navigate(route, {replace: true});
  });
  document.addEventListener('zad:route', e => {
    window.ZadCurrentRoute = e.detail.view;
    context(e.detail.view);
  });
  document.addEventListener('zad:language', () => context(window.ZadCurrentRoute || 'home'));
  // Deep links survive gateway initialization; shared videos use the dedicated query contract.
  navigate(new URLSearchParams(location.search).has('zad_talk') ? 'media' : Zad.initialRoute || 'home', {
    replace: true,
    initial: true
  });
})();

