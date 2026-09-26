/* File, syntax, source-integrity and design-token checks; this does not render a browser. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const parser = require('@babel/parser');
const postcss = require('postcss');
const {
  JSDOM
} = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const results = [];

function check(name, fn) {
  try {
    fn();
    results.push({
      name,
      status: 'passed'
    });
    console.log('PASS', name);
  } catch (error) {
    results.push({
      name,
      status: 'failed',
      error: error.message
    });
    console.error('FAIL', name, error.message);
  }
}

function files(dir) {
  return fs.readdirSync(path.join(root, dir), {
    withFileTypes: true
  }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const scripts = files('assets/js').filter(f => f.endsWith('.js'));
check('All shipped JavaScript and canonical Edge TypeScript parse', () => {
  for (const file of scripts) parser.parse(read(file));
  for (const file of files('supabase/functions').filter(f => f.endsWith('.ts'))) parser.parse(read(file), {
    sourceType: 'module',
    plugins: ['typescript']
  });
});
check('Styles parse and every local font/image URL resolves', () => {
  for (const file of files('assets/css')) {
    postcss.parse(read(file), {
      from: file
    });
    for (const match of read(file).matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      if (/^(data:|https?:)/.test(match[1])) continue;
      assert(fs.existsSync(path.resolve(root, path.dirname(file), match[1])), `${file}: ${match[1]}`);
    }
  }
});
check('HTML IDs are unique, document language is Arabic, and local links/assets resolve', () => {
  for (const file of ['index.html', 'admin.html', 'reader.html', 'seerah.html']) {
    const dom = new JSDOM(read(file)),
      doc = dom.window.document;
    assert.equal(doc.documentElement.lang, 'ar');
    assert.equal(doc.documentElement.dir, 'rtl');
    const ids = [...doc.querySelectorAll('[id]')].map(e => e.id);
    assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
    assert(doc.querySelector('meta[http-equiv="Content-Security-Policy"]'));
    for (const el of doc.querySelectorAll('[src], [href]')) {
      const value = el.getAttribute('src') || el.getAttribute('href');
      if (!value || /^(#|[a-z]+:|\/\/)/i.test(value)) continue;
      const local = decodeURIComponent(value.split(/[?#]/)[0]);
      assert(fs.existsSync(path.join(root, local)), `${file}: missing ${local}`);
    }
    assert.equal(doc.documentElement.dataset.portableBuild, '1', `${file}: expected a portable build`);
    assert.equal(doc.querySelectorAll('script[src],link[rel="stylesheet"]').length, 0, `${file}: application assets must be embedded`);
    const sourceDoc = new JSDOM(read('source-pages/' + file));
    assert.equal(sourceDoc.window.document.querySelectorAll('script:not([src])').length, 0, `${file}: keep editable templates modular`);
    sourceDoc.window.close();
    dom.window.close();
  }
});
check('Portable pages embed valid CSS/JS/fonts/icons and strict-page CSP hashes match exactly', () => {
  for (const file of ['index.html', 'admin.html', 'reader.html', 'seerah.html']) {
    const dom = new JSDOM(read(file)), doc = dom.window.document;
    const policy = new Map(doc.querySelector('meta[http-equiv="Content-Security-Policy"]').content.split(';').map(v => v.trim().split(/\s+/)).map(([key, ...values]) => [key, values]));
    for (const [selector, directive] of [['script', 'script-src'], ['style', 'style-src']]) {
      const values = policy.get(directive) || [];
      for (const el of doc.querySelectorAll(selector)) {
        assert(el.dataset.source, `${file}: untracked ${selector} block`);
        if (selector === 'script') parser.parse(el.textContent);
        else postcss.parse(el.textContent);
        const hash = "'sha256-" + crypto.createHash('sha256').update(el.textContent).digest('base64') + "'";
        assert(values.includes("'unsafe-inline'") || values.includes(hash), `${file}: CSP would block ${el.dataset.source}`);
      }
      if (file !== 'index.html') assert(!values.includes("'unsafe-inline'"), `${file}: retain strict-page policy`);
    }
    assert(policy.get('font-src').includes('data:'));
    assert(doc.querySelector('style').textContent.includes('data:font/woff2;base64,'));
    for (const el of doc.querySelectorAll('img[src]')) assert(!el.getAttribute('src').startsWith('assets/'), `${file}: missing inline image`);
    dom.window.close();
  }
});
check('All five PDF files match their original byte hashes', () => {
  for (const entry of JSON.parse(read('data/pdf-integrity.json'))) {
    const data = fs.readFileSync(path.join(root, entry.file));
    assert.equal(data.byteLength, entry.bytes, entry.file);
    assert.equal(sha(data), entry.sha256, entry.file);
  }
});
check('743 protected religious text/reference strings match the original content', () => {
  let total = 0;
  for (const entry of JSON.parse(read('data/content-integrity.json'))) {
    const fields = new Set(entry.fields),
      values = [];

    function walk(node, fn = '') {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'FunctionDeclaration') fn = node.id?.name || '';
      if (node.type === 'ObjectProperty' && fields.has(node.key.name || node.key.value) && node.value.type === 'StringLiteral' && fn !== 'h') values.push((node.key.name || node.key.value) + ':' + node.value.value);
      for (const [key, value] of Object.entries(node)) {
        if (['loc', 'start', 'end'].includes(key)) continue;
        if (Array.isArray(value)) value.forEach(v => walk(v, fn));
        else if (value && typeof value === 'object') walk(value, fn);
      }
    }
    walk(parser.parse(read(entry.file)));
    values.sort();
    assert.equal(values.length, entry.protected_strings, entry.file);
    assert.equal(sha(JSON.stringify(values)), entry.sha256, entry.file);
    total += values.length;
  }
  assert.equal(total, 743);
});
check('Primary light/dark text and button token pairs have at least 4.5:1 contrast', () => {
  const css = postcss.parse(read('assets/css/design-system.css'));
  const schemes = {
    light: {},
    dark: {}
  };
  css.walkRules(rule => {
    const key = rule.selector === ':root' ? 'light' : rule.selector === ':root[data-theme=dark]' ? 'dark' : null;
    if (key) rule.walkDecls(d => {
      if (/^#[0-9a-f]{6}$/i.test(d.value)) schemes[key][d.prop] = d.value;
    });
  });
  const luminance = hex => {
    const c = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  for (const [name, partial] of Object.entries(schemes)) {
    const colors = {
      ...schemes.light,
      ...partial
    };
    for (const fg of ['text', 'muted', 'brand', 'accent', 'danger', 'success'])
      for (const bg of ['bg', 'surface', 'surface-alt']) {
        const a = luminance(colors['--color-' + fg]),
          b = luminance(colors['--color-' + bg]);
        const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
        assert(ratio >= 4.5, `${name} ${fg}/${bg}: ${ratio.toFixed(2)}`);
      }
  }
});
const failed = results.filter(r => r.status === 'failed').length;
fs.writeFileSync(path.join(__dirname, 'static-results.json'), JSON.stringify({
  passed: results.length - failed,
  failed,
  scope: 'Syntax, local references, byte/text integrity and color token arithmetic; no browser rendering',
  results
}, null, 2));
process.exitCode = failed ? 1 : 0;
