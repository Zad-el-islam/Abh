const fs = require('node:fs'),
  path = require('node:path');
const {
  JSDOM,
  ResourceLoader,
  VirtualConsole
} = require('jsdom');
const root = path.resolve(__dirname, '..');
const quran = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/quran-source.json'), 'utf8'));
const tick = (ms = 40) => new Promise(resolve => setTimeout(resolve, ms));
async function boot({
  file = 'index.html',
  hash = '',
  fetcher = null,
  before = () => {},
  storage = {},
  documentURL = null,
  denyAssets = false
} = {}) {
  const errors = [],
    calls = [],
    resources = [],
    vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  vc.on('error', (...a) => errors.push(a.map(x => x?.message || String(x)).join(' ')));
  class Loader extends ResourceLoader {
    fetch(url) {
      if (denyAssets) {
        resources.push(url);
        errors.push('Unexpected separate asset: ' + url);
        return null;
      }
      const u = new URL(url);
      if (u.origin !== 'https://test.invalid') return null;
      const p = decodeURIComponent(u.pathname).replace(/^\/project\//, '');
      const full = path.join(root, p);
      resources.push(p);
      if (!fs.existsSync(full)) {
        errors.push('Missing: ' + p);
        return null;
      }
      return Promise.resolve(fs.readFileSync(full));
    }
  }
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'), {
    url: documentURL || 'https://test.invalid/project/' + file + hash,
    runScripts: 'dangerously',
    resources: new Loader(),
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      w.fetch = async (input, opts = {}) => {
        const url = String(input?.url || input);
        calls.push({
          url,
          opts
        });
        if (fetcher) {
          const result = await fetcher(url, opts, w);
          if (result) return result;
        }
        if (url.includes('api.alquran.cloud/v1/quran/')) return new Response(JSON.stringify(quran), {
          status: 200
        });
        if (url.includes('/rest/v1/rpc/zad_get_current_season')) return new Response(JSON.stringify([{
          season_number: 1,
          starts_on: '2026-09-20',
          ends_on: '2026-10-03'
        }]), {
          status: 200
        });
        return new Response(JSON.stringify({
          error: 'unavailable'
        }), {
          status: 503
        });
      };
      w.Request = Request;
      w.Response = Response;
      w.Headers = Headers;
      w.TextEncoder = TextEncoder;
      w.TextDecoder = TextDecoder;
      w.AbortController = AbortController;
      Object.defineProperty(w.crypto, 'subtle', {
        value: require('node:crypto').webcrypto.subtle
      });
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function() {};
      w.matchMedia = () => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {}
      });
      w.CSS = {
        escape: s => String(s).replace(/[^\w-]/g, c => '\\' + c)
      };
      w.HTMLMediaElement.prototype.play = async function() {
        this.dispatchEvent(new w.Event('play'));
      };
      w.HTMLMediaElement.prototype.pause = function() {
        this.dispatchEvent(new w.Event('pause'));
      };
      w.HTMLDialogElement.prototype.showModal = function() {
        this.setAttribute('open', '');
      };
      w.HTMLDialogElement.prototype.close = function() {
        this.removeAttribute('open');
        this.dispatchEvent(new w.Event('close'));
      };
      w.alert = () => {};
      w.confirm = () => false;
      w.prompt = () => null;
      w.open = (...args) => {
        w.opened = args;
        return {};
      };
      for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
      before(w);
    }
  });
  await new Promise(resolve => dom.window.addEventListener('load', () => setTimeout(resolve, 250), {
    once: true
  }));
  return {
    dom,
    w: dom.window,
    errors,
    calls,
    resources
  };
}
module.exports = {
  boot,
  tick,
  quran,
  root
};
