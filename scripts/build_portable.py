#!/usr/bin/env python3
"""Build directly openable pages from readable source modules, using the standard library.

The source templates are in source-pages/. Assets stay editable in assets/.
Only application resources are embedded; PDFs and remote services keep their paths.
"""
from __future__ import annotations

import base64
import hashlib
import html
from html.parser import HTMLParser
import mimetypes
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('index.html', 'admin.html', 'reader.html', 'seerah.html')


def data_url(path: Path) -> str:
    path = path.resolve()
    if not path.is_relative_to(ROOT):
        raise ValueError(f'Asset outside project: {path}')
    mime = 'font/woff2' if path.suffix == '.woff2' else mimetypes.guess_type(path.name)[0]
    if not mime:
        raise ValueError(f'Unknown asset type: {path.name}')
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')


def inline_css(source: str) -> str:
    path = ROOT / source
    css = path.read_text(encoding='utf-8')

    def resource(match: re.Match) -> str:
        url = match.group(2)
        if re.match(r'^(?:[a-z]+:|//|#)', url, re.I):
            return match.group(0)
        return 'url("' + data_url(path.parent / url) + '")'

    css = re.sub(r'url\(\s*([\'"]?)([^)\'"\s]+)\1\s*\)', resource, css)
    if re.search(r'</style', css, re.I):
        raise ValueError('Unexpected closing style tag in source')
    return css


def inline_js(source: str) -> str:
    text = (ROOT / source).read_text(encoding='utf-8')
    # Dynamic book cards also use this icon; embedding only static <img> tags is insufficient.
    text = text.replace('assets/icons/crescent.svg', data_url(ROOT / 'assets/icons/crescent.svg'))
    return re.sub(r'</script', lambda m: '<\\/' + m.group(0)[2:], text, flags=re.I)


def fingerprint(text: str) -> str:
    return "'sha256-" + base64.b64encode(hashlib.sha256(text.encode('utf-8')).digest()).decode('ascii') + "'"


class PortablePage(HTMLParser):
    def __init__(self, source: str):
        super().__init__(convert_charrefs=False)
        self.output: list[str] = []
        self.styles: list[str] = []
        self.scripts: list[tuple[str, str]] = []
        self.in_external_script = False
        self.csp = ''
        self.feed(source)
        self.close()

    def tag(self, name, attrs, self_closed=False):
        attrs = list(attrs)
        values = dict(attrs)
        if name == 'html':
            attrs.append(('data-portable-build', '1'))
        if name == 'meta' and values.get('http-equiv', '').lower() == 'content-security-policy':
            self.csp = values.get('content', '')
            self.output.append('<!-- PORTABLE_CSP -->')
            return
        if name == 'link' and values.get('rel') == 'stylesheet':
            source = values['href']
            css = inline_css(source)
            self.styles.append(css)
            self.output.append(f'<style data-source="{html.escape(source, quote=True)}">{css}</style>')
            return
        if name == 'script' and values.get('src'):
            if re.match(r'^[a-z]+:', values['src'], re.I):
                raise ValueError('Remote scripts must be reviewed separately')
            self.scripts.append((values['src'], inline_js(values['src'])))
            self.in_external_script = True
            return
        for i, (key, value) in enumerate(attrs):
            if key in ('src', 'href') and value and value.startswith('assets/icons/'):
                attrs[i] = (key, data_url(ROOT / value))
        rendered = ''.join(' ' + key + ('' if value is None else '="' + html.escape(value, quote=True) + '"') for key, value in attrs)
        self.output.append('<' + name + rendered + ('/>' if self_closed else '>'))

    def handle_starttag(self, name, attrs):
        self.tag(name, attrs)

    def handle_startendtag(self, name, attrs):
        self.tag(name, attrs, True)

    def handle_endtag(self, name):
        if name == 'script' and self.in_external_script:
            self.in_external_script = False
            return
        if name == 'body':
            # Inline scripts do not honor defer. Run them after markup in the original dependency order.
            for source, script in self.scripts:
                self.output.append(f'\n<script data-source="{html.escape(source, quote=True)}">{script}</script>\n')
        self.output.append('</' + name + '>')

    def handle_data(self, data):
        if not self.in_external_script:
            self.output.append(data)

    def handle_entityref(self, name):
        if not self.in_external_script:
            self.output.append('&' + name + ';')

    def handle_charref(self, name):
        if not self.in_external_script:
            self.output.append('&#' + name + ';')

    def handle_decl(self, value):
        self.output.append('<!' + value + '>')

    def handle_comment(self, value):
        if not self.in_external_script:
            self.output.append('<!--' + value + '-->')

    def render(self):
        if not self.csp:
            raise ValueError('Missing source CSP')
        directives = {}
        for entry in self.csp.split(';'):
            parts = entry.split()
            if parts:
                directives[parts[0]] = parts[1:]
        for name, texts in [('script-src', [s for _, s in self.scripts]), ('style-src', self.styles)]:
            policy = directives.setdefault(name, ["'self'"])
            # Preserve the homepage's legacy event-handler policy. Strict pages use exact hashes.
            if "'unsafe-inline'" not in policy:
                policy.extend(fingerprint(text) for text in texts)
        font_policy = directives.setdefault('font-src', ["'self'"])
        if 'data:' not in font_policy:
            font_policy.append('data:')
        policy = '; '.join(name + (' ' + ' '.join(values) if values else '') for name, values in directives.items())
        meta = '<meta http-equiv="Content-Security-Policy" content="' + html.escape(policy, quote=True) + '">'
        document = ''.join(self.output).replace('<!-- PORTABLE_CSP -->', meta)
        return document


if __name__ == '__main__':
    subprocess.run(['node', str(ROOT / 'tests/quran-integrity.cjs')], cwd=ROOT, check=True)
    for name in PAGES:
        page = PortablePage((ROOT / 'source-pages' / name).read_text(encoding='utf-8'))
        output = ROOT / name
        output.write_text(page.render(), encoding='utf-8')
        print(f'{name}: {len(page.styles)} styles, {len(page.scripts)} scripts, {output.stat().st_size:,} bytes')
