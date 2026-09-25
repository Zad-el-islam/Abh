/* DOM/contract tests with explicit test doubles. These do not render a browser or access production. */
const assert = require('node:assert/strict');
const {
  boot,
  tick,
  quran
} = require('./dom-harness.cjs');
const results = [];
let failed = 0;
const test = async (name, fn) => {
  try {
    await fn();
    results.push({
      name,
      status: 'passed'
    });
    console.log('PASS', name);
  } catch (e) {
    failed++;
    results.push({
      name,
      status: 'failed',
      error: e.message
    });
    console.error('FAIL', name, e.stack);
  }
};
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json'
  }
});
const sourceURL = 'https://bzrhrvgddtnhctcdlgmy.supabase.co/storage/v1/object/sign/zad-talk-media/test.mp4?token=test';
(async () => {
  const app = await boot();
  const w = app.w,
    d = w.document;
  await test('Startup: bundled scripts/styles/fonts, header icons, one visible gateway', async () => {
    assert.deepEqual(app.errors, []);
    assert.equal(d.querySelectorAll('header.site-header').length, 1);
    assert.equal(d.querySelectorAll('.header-actions svg').length, 4);
    assert.equal(w.ZadCurrentRoute, 'home');
    assert(!app.calls.some(c => /\.pdf(?:$|\?)/.test(c.url)));
    assert(!app.calls.some(c => c.url.includes('youtube')));
  });
  await test('The downloaded HTML boots alone on file/HTTPS URLs with all separate assets unavailable', async () => {
    for (const documentURL of ['file:///isolated/index.html', 'https://test.invalid/isolated/index.html']) {
      const isolated = await boot({documentURL, denyAssets: true});
      const doc = isolated.w.document;
      assert.deepEqual(isolated.resources, []);
      assert.deepEqual(isolated.errors, []);
      assert.equal(isolated.w.ZadCurrentRoute, 'home');
      assert.equal(doc.querySelectorAll('.gateway-card').length, 3);
      assert.equal(doc.querySelectorAll('script[src],link[rel="stylesheet"]').length, 0);
      assert.equal(doc.styleSheets.length, 5);
      assert(doc.querySelector('.site-brand img').src.startsWith('data:image/svg+xml;base64,'));
      isolated.w.ZadNavigate('library');
      await tick();
      assert.equal(doc.querySelectorAll('.book-card').length, 4);
      assert(doc.querySelector('.book-cover img').src.startsWith('data:image/svg+xml;base64,'));
      isolated.w.location.hash = '#iman';
      await tick();
      assert.equal(isolated.w.ZadCurrentRoute, 'iman');
      assert.deepEqual(isolated.errors, []);
    }
  });
  await test('All gateways and legacy modules route without runtime errors', async () => {
    for (const route of ['iman', 'ilm', 'library', 'aqidah', 'seerah', 'tafsir', 'more', 'rouh', 'zad', 'heart', 'heart-tasbih', 'heart-azkar', 'hadith', 'wird']) {
      w.ZadNavigate(route);
      await tick();
      assert.equal(w.ZadCurrentRoute, route);
      assert.equal(w.location.hash, '#' + route);
    }
    assert.deepEqual(app.errors, []);
  });
  await test('Quran: 114 surahs, 6236 verses, exact source text, one reader', async () => {
    await tick(100);
    assert.equal(w.eval('flatAyahs.length'), 6236);
    assert.equal(w.eval('quran.surahs.length'), 114);
    assert.equal(d.querySelectorAll('#v22ReaderWorkspace').length, 1);
    assert.equal(d.querySelector('.v22Arabic').textContent, quran.data.surahs[0].ayahs[0].text);
    assert.equal(w.eval('cleanQuranDisplayText("أَ ۞ ۩")'), 'أَ ۞ ۩');
    assert.equal(d.querySelector('.v22QTrack').getAttribute('aria-valuenow'), '0');
  });
  await test('Daily amount, navigation and completion persistence use real portions', async () => {
    w.changeDailyAmount(2);
    await tick();
    assert.equal(w.eval('portions.length'), 30);
    w.changePortion(1);
    await tick();
    assert.equal(w.eval('currentPortion'), 2);
    w.markDone();
    await tick();
    assert.equal(Object.values(JSON.parse(w.localStorage.getItem('wird_done_map_v2'))).filter(Boolean).length, 1);
    assert.equal(d.querySelector('.v22QTrack').getAttribute('aria-valuenow'), '3');
  });
  await test('Quran search handles Arabic diacritics without changing display text', async () => {
    w.showPage('search');
    d.getElementById('searchInput').value = 'الرَّحْمَن';
    w.searchQuran();
    await tick();
    assert(d.querySelectorAll('#searchResults .ayahBlock').length > 0);
    const content = d.querySelector('#searchResults .ayahSourceText').textContent;
    assert(quran.data.surahs.some(s => s.ayahs.some(a => a.text === content)));
  });
  await test('Source-language matching prevents a French choice from selecting another language', async () => {
    const selected = w.ZadQuranSources.selectResource([{
      id: 2,
      language_name: 'albanian'
    }, {
      id: 31,
      language_name: 'french'
    }, {
      id: 131,
      language_name: 'english'
    }], 'fr');
    assert.equal(selected.id, 31);
    assert.equal(w.ZadQuranSources.selectResource([{
      id: 131,
      language_name: 'english'
    }], 'ur'), null);
  });
  await test('All six translation fallbacks keep the requested edition, verse keys and source attribution', async () => {
    const editions = {
      en: 'en.sahih',
      fr: 'fr.hamidullah',
      id: 'id.indonesian',
      tr: 'tr.diyanet',
      ur: 'ur.jalandhry',
      es: 'es.cortes'
    };
    const fixture = edition => require('./fixtures/translation-' + edition + '.json');
    const fallback = await boot({
      fetcher: url => url.includes('/resources/translations') ? json({}, 403) : url.includes('/surah/1/') ? json(fixture(url.split('/').at(-1))) : null
    });
    for (const [code, edition] of Object.entries(editions)) {
      const map = await fallback.w.ZadQuranSources.translations(1, code);
      assert.equal(map.size, 7);
      assert.equal(map.get('1:1'), fixture(edition).data.ayahs[0].text);
      assert(map.source.startsWith('Al Quran Cloud'));
      assert.equal(map.fallback, true);
    }
    fallback.w.ZadNavigate('wird');
    await tick();
    assert.equal(fallback.w.document.querySelector('.v22Arabic').textContent, quran.data.surahs[0].ayahs[0].text);
  });
  await test('Tajweed sanitizer allows only safe text and markup', async () => {
    const html = w.Zad.tajweedHTML('<tajweed class="ghn" onclick="alert(1)">ن</tajweed><img src=x onerror=alert(1)><script>alert(1)</script><svg onload=alert(1)></svg>');
    assert.equal(html, '<tajweed class="ghn">ن</tajweed>');
  });
  await test('Warrior: normalized search, favorites persist and unavailable files are not links', async () => {
    w.ZadNavigate('zad');
    const favorite = d.querySelector('#zadCards .zadFav');
    favorite.click();
    await tick();
    const ids = JSON.parse(w.localStorage.getItem('zad_favorites_integrated'));
    assert.equal(ids.length, 1);
    d.getElementById('zadSearchInput').value = 'لا تَقْنَط';
    d.getElementById('zadSearchInput').dispatchEvent(new w.Event('input'));
    assert(d.getElementById('zadCards').textContent.includes('لا تقنط'));
    assert(!d.querySelector('a[href="zad-quran.pdf"]'));
  });
  await test('Tasbih add and undo; dhikr counters survive section changes', async () => {
    w.ZadNavigate('heart-tasbih');
    const value = () => d.getElementById('heartCounterButton').textContent;
    const before = value();
    w.heartTasbihAdd();
    assert.notEqual(value(), before);
    w.heartTasbihUndo();
    assert.equal(value(), before);
    w.heartShowPage('azkar');
    const b = d.querySelector('.heartDhikrActions button');
    assert(b);
    b.click();
    const after = d.querySelector('.heartDhikrMeta').textContent;
    w.heartShowPage('home');
    w.heartShowPage('azkar');
    assert.equal(d.querySelector('.heartDhikrMeta').textContent, after);
  });
  await test('Hadith source text remains Arabic; official search is a working form', async () => {
    w.ZadNavigate('hadith');
    const text = d.querySelector('.hadithText').textContent;
    assert(text.length > 20);
    assert.equal(d.querySelector('.hadithSearchRow button').type, 'submit');
    d.getElementById('hadithSearchInput').value = 'النية';
    d.querySelector('.hadithSearchRow').dispatchEvent(new w.Event('submit', {
      bubbles: true,
      cancelable: true
    }));
    assert(w.opened[0].startsWith('https://dorar.net/'));
  });
  await test('Seven languages preserve direction, source text, route and Arabic restoration', async () => {
    w.ZadNavigate('hadith');
    const original = d.querySelector('.hadithText').textContent;
    for (const code of ['en', 'fr', 'id', 'tr', 'ur', 'es', 'ar']) {
      w.ZadSetLanguage(code);
      await tick(25);
      assert.equal(d.documentElement.lang, code);
      assert.equal(d.documentElement.dir, ['ar', 'ur'].includes(code) ? 'rtl' : 'ltr');
      assert.equal(w.ZadCurrentRoute, 'hadith');
      assert.equal(d.querySelector('.hadithText').textContent, original);
    }
    assert.equal(d.querySelector('.primary-nav a').textContent, 'الرئيسية');
  });
  await test('Unified settings, persisted theme/size, and global search', async () => {
    w.ZadSettings.open();
    d.querySelector('[data-theme-option=dark]').click();
    d.querySelector('[data-size-option=large]').click();
    assert.equal(w.localStorage.getItem('zad_theme_v2'), 'dark');
    assert.equal(d.documentElement.dataset.readerSize, 'large');
    d.getElementById('settingsDialog').close();
    w.ZadNavigate('home');
    assert.equal(d.documentElement.dataset.theme, 'dark');
    w.ZadSettings.search();
    const input = d.getElementById('globalSearchInput');
    input.value = 'أُصول';
    input.dispatchEvent(new w.Event('input'));
    assert(d.getElementById('globalSearchResults').textContent.includes('الأصول'));
    d.getElementById('searchDialog').close();
  });
  await test('Account dialog focus, Escape dismissal and focus restoration', async () => {
    const button = d.getElementById('zadMyPanelToggle');
    button.focus();
    button.click();
    await tick();
    const panel = d.getElementById('zadMyPanelOverlay');
    assert.equal(panel.getAttribute('role'), 'dialog');
    assert(panel.contains(d.activeElement));
    assert.equal(d.getElementById('mainContent').inert, true);
    d.dispatchEvent(new w.KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    }));
    await tick();
    assert(!panel.classList.contains('open'));
    assert.equal(d.activeElement, button);
  });
  await test('Greeting respects original session key and remains nonmodal', async () => {
    w.ZadGreeting.show(true);
    assert(d.getElementById('greetingNote'));
    assert.equal(w.sessionStorage.getItem('zad_prophet_welcome_restored_v1'), '1');
    d.querySelector('#greetingNote button').click();
    w.ZadGreeting.show(false);
    assert(!d.getElementById('greetingNote'));
  });
  await test('Auth validation and exact username/email contract with a test adapter', async () => {
    let captured = null;
    const sb = w.zadSupabase;
    const oldRpc = sb.rpc,
      oldSignIn = sb.auth.signInWithPassword;
    sb.rpc = async (name, args) => {
      assert.equal(name, 'zad_resolve_login_username');
      assert.equal(args.p_username, 'reader_one');
      return {
        data: 'test-reader@users.zad-alrouh.invalid',
        error: null
      };
    };
    sb.auth.signInWithPassword = async body => {
      captured = body;
      return {
        data: {
          user: {
            id: 'test-user'
          }
        },
        error: null
      };
    };
    d.getElementById('zadPanelLoginUsername').value = 'reader_one';
    d.getElementById('zadPanelLoginPassword').value = 'TestOnlyPass123!';
    await w.zadPanelSignIn();
    assert.equal(captured.email, 'test-reader@users.zad-alrouh.invalid');
    assert.equal(d.getElementById('zadPanelLoginPassword').value, '');
    assert(d.getElementById('zadPanelAuthMessage').textContent.includes('بنجاح'));
    sb.rpc = oldRpc;
    sb.auth.signInWithPassword = oldSignIn;
  });
  await test('Corrupt saved state and denied storage do not break startup', async () => {
    const corrupt = await boot({
      storage: {
        zad_favorites_integrated: '{}',
        zad_points_visit_days_v1: 'false',
        wird_done_map_v2: '{broken',
        zad_resume_warrior_page_v1: 'Infinity',
        heart_tasbih_totals_v1: '[]',
        quran_uthmani_cache_v2: '{"surahs":[]}'
      }
    });
    corrupt.w.ZadNavigate('zad');
    await tick();
    assert.deepEqual(corrupt.errors, []);
    assert(corrupt.w.document.querySelector('#zadCards .zadMessageCard'));
    const denied = await boot({
      before(w) {
        Object.defineProperty(w, 'localStorage', {
          get() {
            throw new w.DOMException('blocked', 'SecurityError');
          }
        });
        Object.defineProperty(w, 'sessionStorage', {
          get() {
            throw new w.DOMException('blocked', 'SecurityError');
          }
        });
      }
    });
    denied.w.ZadNavigate('heart-tasbih');
    denied.w.heartTasbihAdd();
    assert.deepEqual(denied.errors, []);
  });
  await test('Deep routes survive initial gateway boot', async () => {
    const deep = await boot({
      hash: '#library'
    });
    assert.equal(deep.w.ZadCurrentRoute, 'library');
    assert(deep.w.document.querySelectorAll('.book-card').length === 4);
  });
  await test('A saved French or Urdu language survives page reload and keeps the right direction', async () => {
    for (const code of ['fr', 'ur']) {
      const reload = await boot({
        storage: {
          zad_islam_language_v3: code
        }
      });
      assert.equal(reload.w.document.documentElement.lang, code);
      assert.equal(reload.w.document.documentElement.dir, code === 'ur' ? 'rtl' : 'ltr');
      assert.equal(reload.w.localStorage.getItem('zad_islam_language_v3'), code);
      assert.deepEqual(reload.errors, []);
    }
  });
  await test('Public videos: safe UGC, click-to-play, no loop, controls and no bulk preloads', async () => {
    const attack = '\"><img src=x onerror=alert(1)>';
    const feed = await boot({
      fetcher: (url, opts) => url.includes('zad-talk-feed') ? json({
        items: [{
          id: '00000000-0000-0000-0000-000000000001',
          title: attack,
          creator_name: attack,
          creator_avatar: 'javascript:alert(1)',
          media_url: sourceURL
        }],
        has_more: false,
        next_offset: 1
      }) : url.includes('zad-talk-social') ? json({
        like_count: 0,
        comment_count: 0,
        share_count: 0,
        comments: []
      }) : null
    });
    feed.w.ZadNavigate('media');
    await tick(80);
    const doc = feed.w.document,
      v = doc.querySelector('#zadTalkFeed video');
    assert(v);
    assert.equal(v.autoplay, false);
    assert.equal(v.loop, false);
    assert.equal(v.preload, 'none');
    assert(v.controls);
    assert.equal(doc.querySelector('.ztClipTitle').textContent, attack);
    assert(!doc.querySelector('[onerror]'));
    doc.querySelector('[data-v21-media-tab=publish]').click();
    await tick();
    doc.getElementById('v21VideoTitle').value = 'اختبار رفع';
    const file = new feed.w.File(['<svg>not a video</svg>'], 'attack.mp4', {
      type: 'video/mp4'
    });
    Object.defineProperty(doc.getElementById('v21VideoFile'), 'files', {
      value: [file],
      configurable: true
    });
    doc.querySelector('[data-v21-submit-video]').click();
    await tick(80);
    assert(doc.getElementById('v21SubmitStatus').textContent.includes('لا يطابق'));
    assert(!feed.calls.some(c => c.url.includes('zad-talk-create-upload')));
    assert.deepEqual(feed.errors, []);
  });
  await test('Quran failure offers a retry and original PDF; Talk failure offers retry', async () => {
    const offline = await boot({
      fetcher: url => url.includes('api.alquran.cloud') ? json({
        error: 'offline'
      }, 503) : null
    });
    offline.w.ZadNavigate('wird');
    await tick(80);
    assert(offline.w.document.querySelector('[data-quran-retry]'));
    offline.w.ZadNavigate('media');
    await tick(80);
    assert(!offline.w.document.getElementById('zadTalkMore').classList.contains('hidden'));
    assert.deepEqual(offline.errors, []);
  });
  await test('Video upload follows ticket, signed storage, receipt finalization and moderation contracts', async () => {
    const steps = [];
    const id = '00000000-0000-0000-0000-000000000003',
      receipt = 'test-receipt-which-is-only-used-in-fixtures';
    const upload = await boot({
      fetcher: (url, opts) => {
        if (url.includes('zad-talk-create-upload')) {
          steps.push('ticket');
          const body = JSON.parse(opts.body);
          assert.equal(body.title, 'مقطع للاختبار');
          assert.equal(body.mime_type, 'video/mp4');
          return json({
            id,
            path: 'test/video.mp4',
            token: 'test-storage-token',
            receipt
          });
        }
        if (url.includes('zad-talk-finalize-upload')) {
          steps.push('finalize');
          assert.deepEqual(JSON.parse(opts.body), {
            id,
            receipt
          });
          return json({
            ok: true,
            status: 'pending'
          });
        }
        return null;
      }
    });
    const u = upload.w,
      doc = u.document;
    u.zadSupabase.storage.from = bucket => ({
      uploadToSignedUrl: async (path, token, file, opts) => {
        steps.push('storage');
        assert.equal(bucket, 'zad-talk-media');
        assert.equal(path, 'test/video.mp4');
        assert.equal(token, 'test-storage-token');
        assert.equal(opts.upsert, false);
        assert.equal(file.type, 'video/mp4');
        return {
          error: null
        };
      }
    });
    u.ZadNavigate('media');
    await tick();
    doc.querySelector('[data-v21-media-tab=publish]').click();
    doc.getElementById('v21VideoTitle').value = 'مقطع للاختبار';
    const file = new u.File([new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112, 105, 115, 111, 109])], 'test.mp4', {
      type: 'video/mp4'
    });
    Object.defineProperty(doc.getElementById('v21VideoFile'), 'files', {
      value: [file],
      configurable: true
    });
    const button = doc.querySelector('[data-v21-submit-video]');
    button.click();
    button.click();
    await tick(100);
    assert.deepEqual(steps, ['ticket', 'storage', 'finalize']);
    assert(doc.getElementById('v21SubmitStatus').textContent.includes('لن يظهر للعامة إلا بعد موافقة الإدارة'));
    assert.equal(button.disabled, false);
    assert.equal(doc.getElementById('v21VideoTitle').value, '');
    assert.deepEqual(upload.errors, []);
  });
  await test('PDF detail page: lazy frame, metadata, bounded page bookmark and invalid ID', async () => {
    const reader = await boot({
      file: 'reader.html',
      hash: '?book=usul',
      fetcher: (url, opts) => opts.method === 'HEAD' ? new Response(null, {
        status: 200
      }) : null
    });
    const doc = reader.w.document;
    assert(!doc.querySelector('iframe'));
    assert(doc.querySelector('h1').textContent.includes('الأصول الثلاثة'));
    doc.getElementById('pdfPage').value = '4';
    doc.getElementById('openPage').click();
    await tick();
    assert(doc.querySelector('iframe').src.includes('/project/thalathat_al_usul.pdf#page=4'));
    assert.equal(reader.w.localStorage.getItem('zad_pdf_page_usul'), '4');
    assert(doc.querySelector('a[download]'));
    assert.deepEqual(reader.errors, []);
    const invalid = await boot({
      file: 'reader.html',
      hash: '?book=../admin'
    });
    assert(invalid.w.document.querySelector('h1').textContent.includes('غير موجود'));
  });
  await test('Seerah: no initial iframe; exact playlist, safe referrer and permanent fallback', async () => {
    const seerah = await boot({
        file: 'seerah.html'
      }),
      doc = seerah.w.document;
    assert(!doc.querySelector('iframe'));
    doc.querySelector('[data-playlist]').click();
    await tick();
    const frame = doc.querySelector('iframe');
    assert(frame.src.includes('PL6C03BCFE87398A78'));
    assert.equal(frame.referrerPolicy, 'strict-origin-when-cross-origin');
    assert.equal(doc.querySelectorAll('a[href^="https://youtube.com/playlist"]').length, 2);
    assert.deepEqual(seerah.errors, []);
  });
  await test('Admin: session storage only, escaped UGC, cancellation, accurate deletion warning and logout', async () => {
    const attack = '<img src=x onerror=alert(1)>',
      calls = [];
    const admin = await boot({
      file: 'admin.html',
      fetcher: (url, opts) => {
        const body = JSON.parse(opts.body || '{}');
        calls.push({
          url,
          body
        });
        if (url.includes('zad-admin-auth')) return json(body.action === 'login' ? {
          ok: true,
          session_token: 'test-only-session-token',
          admin_display_name: attack
        } : {
          ok: true
        });
        if (url.includes('zad-admin-users')) return json({
          ok: true,
          users: [{
            id: '00000000-0000-0000-0000-000000000001',
            username: attack,
            avatar_url: 'javascript:alert(1)',
            account_status: 'active',
            ban_reason: attack
          }]
        });
        if (url.includes('zad-talk-admin-list')) return json({
          ok: true,
          items: [{
            id: 'clip-test',
            title: attack,
            submitter_name: attack,
            status: 'pending',
            media_url: sourceURL
          }]
        });
        return json({
          ok: true
        });
      }
    });
    const doc = admin.w.document;
    doc.getElementById('adminUser').value = 'test-admin';
    doc.getElementById('adminPass').value = 'test-only-password';
    doc.getElementById('loginForm').dispatchEvent(new admin.w.Event('submit', {
      bubbles: true,
      cancelable: true
    }));
    await tick(100);
    assert(!doc.getElementById('appView').classList.contains('hidden'));
    assert.equal(admin.w.localStorage.getItem('zad_admin_token'), null);
    assert(admin.w.sessionStorage.getItem('zad_admin_session_v2'));
    assert(!doc.querySelector('[onerror]'));
    assert(doc.querySelector('.admin-card h3').textContent.includes(attack));
    doc.querySelector('[data-act=reject]').click();
    await tick();
    assert(!calls.some(c => c.url.includes('zad-talk-admin-review')));
    let warning = '';
    admin.w.prompt = t => {
      warning = t;
      return null;
    };
    doc.querySelector('#usersGrid [data-act=delete]').click();
    assert(warning.includes('مقاطعه'));
    doc.getElementById('logoutBtn').click();
    await tick();
    assert.equal(admin.w.sessionStorage.getItem('zad_admin_session_v2'), null);
    assert(doc.getElementById('appView').classList.contains('hidden'));
    assert.deepEqual(admin.errors, []);
  });
  await test('Admin: an expired or unauthorized session returns to login', async () => {
    const admin = await boot({
      file: 'admin.html',
      before(w) {
        w.sessionStorage.setItem('zad_admin_session_v2', JSON.stringify({
          token: 'test-session',
          name: 'Test',
          expires: Date.now() + 5000
        }));
      },
      fetcher: () => json({
        error: 'unauthorized'
      }, 401)
    });
    assert(admin.w.document.getElementById('appView').classList.contains('hidden'));
    assert.equal(admin.w.sessionStorage.getItem('zad_admin_session_v2'), null);
  });
  console.log(JSON.stringify({
    passed: results.length - failed,
    failed,
    scope: 'DOM and mocked contract tests; no rendered browser, audio playback or production mutation',
    results
  }, null, 2));
  require('node:fs').writeFileSync(require('node:path').join(__dirname, 'results.json'), JSON.stringify({
    passed: results.length - failed,
    failed,
    scope: 'DOM and mocked contracts; no browser rendering or production writes',
    results
  }, null, 2));
  process.exit(failed ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
