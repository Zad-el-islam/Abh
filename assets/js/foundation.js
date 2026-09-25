/* Shared primitives. Public publishable key only; authorization stays on the server. */
window.Zad = (() => {
  'use strict';
  const config = Object.freeze({
    url: 'https://bzrhrvgddtnhctcdlgmy.supabase.co',
    key: 'sb_publishable_HzCPiZYRuFb3hm_duGCHVA_J020y2YL'
  });

  function storage(kind) {
    const memory = new Map();
    return {
      getItem(key) {
        try {
          return window[kind].getItem(key) ?? memory.get(key) ?? null;
        } catch (_) {
          return memory.get(key) ?? null;
        }
      },
      setItem(key, value) {
        memory.set(key, String(value));
        try {
          window[kind].setItem(key, String(value));
        } catch (_) {}
      },
      removeItem(key) {
        memory.delete(key);
        try {
          window[kind].removeItem(key);
        } catch (_) {}
      }
    };
  }
  const local = storage('localStorage'),
    session = storage('sessionStorage');

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(local.getItem(key));
      if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback;
      if (fallback && typeof fallback === 'object') return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  } [ch]));
  const normalize = value => String(value ?? '').normalize('NFKC').replace(/[\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').toLocaleLowerCase().trim();

  function mediaURL(value) {
    try {
      const u = new URL(String(value));
      return u.protocol === 'https:' && u.origin === config.url && !u.username && !u.password ? u.href : '';
    } catch (_) {
      return '';
    }
  }

  function plainHTML(value) {
    const d = new DOMParser().parseFromString(String(value ?? ''), 'text/html');
    return d.body.textContent || '';
  }

  function tajweedHTML(value) {
    const doc = new DOMParser().parseFromString(String(value ?? ''), 'text/html');
    const allowed = new Set(['TAJWEED', 'SPAN']);

    function clean(node) {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) continue;
        if (child.nodeType !== 1) {
          child.remove();
          continue;
        }
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'SVG', 'MATH', 'IMG'].includes(child.tagName)) {
          child.remove();
          continue;
        }
        clean(child);
        if (!allowed.has(child.tagName)) {
          child.replaceWith(...child.childNodes);
          continue;
        }
        for (const a of [...child.attributes])
          if (a.name !== 'class') child.removeAttribute(a.name);
        const classes = [...child.classList].filter(c => /^[a-z_]+$/.test(c));
        child.className = classes.join(' ');
      }
    }
    clean(doc.body);
    return doc.body.innerHTML;
  }
  async function request(input, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), String(input?.url || input).includes('/storage/v1/') ? 180000 : 15000);
    const parent = options.signal;
    const abort = () => controller.abort();
    if (parent?.aborted) controller.abort();
    else parent?.addEventListener('abort', abort, {
      once: true
    });
    try {
      return await fetch(input, {
        ...options,
        signal: controller.signal
      });
    } finally {
      clearTimeout(timer);
      parent?.removeEventListener('abort', abort);
    }
  }

  function errorText(error, fallback = ZadI18n.t("foundation.a177139452")) {
    const m = String(error?.message || error || '');
    if (/unauthorized|not_authenticated|login_required|session.*expired/i.test(m)) return ZadI18n.t("foundation.ccbf61e766");
    if (/account_banned|ip_banned/i.test(m)) return ZadI18n.t("foundation.342bacf139");
    if (/rate_limit|too many/i.test(m)) return ZadI18n.t("foundation.d2369b99f4");
    return fallback;
  }
  const paths = {
    book: 'M4 5h6c2 0 2 2 2 2s0-2 2-2h6v14h-6c-2 0-2 2-2 2s0-2-2-2H4z M12 7v14',
    leaf: 'M20 4C7 2 2 10 7 16s15 1 13-12ZM6 20l10-11',
    heart: 'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-4 5 3 10 8 15 5-5 12-10 8-15Z',
    play: 'M9 7l8 5-8 5Z M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    search: 'M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm5 11 5 5',
    settings: 'M4 7h16M4 17h16 M8 4v6 M16 14v6',
    globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18 M12 3c-5 5-5 13 0 18 5-5 5-13 0-18',
    user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
    arrow: 'M19 12H5m6-6-6 6 6 6',
    moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
    close: 'm6 6 12 12M18 6 6 18',
    shield: 'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z M8 12l3 3 5-6',
    library: 'M4 4h4v16H4zM10 4h4v16h-4zM16 5l4-1 3 15-4 1z',
    message: 'M4 4h16v13H9l-5 4Z',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;
  const isArabic = () => document.documentElement.lang === 'ar';

  function toast(message) {
    const e = document.getElementById('siteToast');
    if (!e) return;
    e.textContent = message;
    e.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => e.classList.remove('show'), 4000);
  }
  async function fileSignature(file, kind) {
    const buffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file.slice(0, 32));
    });
    const b = new Uint8Array(buffer),
      ascii = (start, len) => String.fromCharCode(...b.slice(start, start + len));
    if (kind === 'image') return file.type === 'image/jpeg' ? b[0] === 255 && b[1] === 216 && b[2] === 255 : file.type === 'image/png' ? b[0] === 137 && ascii(1, 3) === 'PNG' && b[4] === 13 && b[5] === 10 && b[6] === 26 && b[7] === 10 : file.type === 'image/webp' ? ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP' : false;
    return file.type === 'video/webm' ? b[0] === 26 && b[1] === 69 && b[2] === 223 && b[3] === 163 : ['video/mp4', 'video/quicktime', 'video/x-m4v'].includes(file.type) && ['ftyp', 'moov', 'mdat', 'wide'].includes(ascii(4, 4));
  }
  function setRouteHash(route, replace = false) {
    const hash = '#' + String(route);
    if (location.hash === hash) return;
    try {
      history[replace ? 'replaceState' : 'pushState'](null, '', hash);
    } catch (_) {
      // Some file viewers reject History API URLs but allow navigation within the same file.
      if (replace) location.replace(hash);
      else location.hash = hash;
    }
  }
  return {
    config,
    setRouteHash,
    storage: local,
    session,
    readJSON,
    escape,
    normalize,
    mediaURL,
    plainHTML,
    tajweedHTML,
    fetch: request,
    errorText,
    icon,
    isArabic,
    toast,
    fileSignature,
    initialRoute: location.hash.slice(1)
  };
})();
(() => {
  const stored = Zad.storage.getItem('zad_theme_v2') || Zad.storage.getItem('wird_theme_v1');
  document.documentElement.dataset.theme = stored === 'dark' ? 'dark' : 'light';
  const oldSize = Zad.storage.getItem('zadReaderSizeFinalV1') || 'normal';
  document.documentElement.dataset.readerSize = oldSize === 'medium' ? 'large' : ['small', 'normal', 'large', 'xlarge'].includes(oldSize) ? oldSize : 'normal';
})();

