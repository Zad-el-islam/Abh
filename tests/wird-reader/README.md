# Daily Wird reader patch — 2026-09-26

Only two runtime source files change: `assets/js/quran-reader.js` and `assets/css/reader.css`.
The existing integrity test is extended; new evidence and focused reader tests are in this directory.
No backend, accounts, gateways, navigation, other module, shared theme, Quran fixture, or PDF was changed.
Thirteen reader-only translation entries extend the existing catalog from the reader module. Existing catalog entries and unrelated page bundles remain unchanged.

## Reading behavior

The Daily Wird body now uses one continuous inline Quran text flow per surah, with contextual headings and distinct verse-number buttons. Selecting a number uses the existing ayah audio engine through a separate control row. The engine and reciter configuration are unchanged.
Each verse has its canonical `data-verse-key`. All 6236 original texts were exercised across the 60 one-hizb portions without missing or duplicate verses. Existing basmalah content remains in its original position; no basmalah is synthesized. The old unused alternate Mushaf renderer (which included literal basmalah insertion) is removed from this module. The legacy Daily Wird container is empty, hidden and inert.

The original mobile line height was 2.2. The bundled Amiri font measured, at 48px, an ink envelope of 87px above and 46px below the baseline across 19,492 distinct source words. That 133px envelope exceeds the old 105.6px mobile line box. The scoped reading line height is now 2.9 (139.2px at 48px). Inline annotations inherit the same font metrics and never change geometry. This is measured font evidence, **not** a rendered-browser certification that overlap is zero.

## Text and Tajweed safety

The runtime still uses the original trusted Uthmani source. Tajweed still uses the existing Quran.com chapter endpoint. The existing sanitizer is reused. Chapter count/order/keys, end-marker numbers, supported classes, and the original text are checked before annotations are accepted. Unknown classes, failed requests and substantive differences leave the original plain text visible with a localized notice.

Only a leading transport BOM and U+0640 presentation carriers may be ignored during annotation alignment; the displayed original characters, including those characters, are preserved byte-for-byte. No letters, marks, whitespace or basmalah are generated. Canonically equivalent but differently ordered combining marks are conservatively left plain when exact character alignment is unavailable. The release comparison separately uses BOM removal and NFC as requested.

The colors and eight legend categories were inspected in the current public Quran.com UI and its official theme definitions. The screenshot's pink/orange/pink/red/green/cyan/blue families are preserved in both themes. Colors are derived by changing HSL lightness until they reach 4.5:1 against every existing reader surface; they are not guessed hex values. See `tajweed-colors.json`.

The current screenshot uses Quran.com's newer color-font legend. Its legacy HTML API taxonomy is not identical. In particular `madda_permissible` also includes permitted stopping lengths; the accurate label is “المد الجائز (٢/٤/٦)”, not exclusively “separated madd”. Tafkhim is colored only if explicitly annotated; no missing heavy-letter rule is inferred. `idgh_w_ghn` (without ghunnah) is gray, never green. See the class inventory, including which four classes were actually observed in the official documentation sample and which aliases were not verified against a live full corpus.

## Verification and limits

- Existing Quran root: `5b58aa48fb07265a53cea6abd510d226345357dd556250e30f3ba87b8a076499`.
- 114 surahs, 6236 ordered unique nonempty ayahs; no source edits.
- **Complete Quran.com comparison: NOT RUN.** The bulk endpoint returned HTTP 403. No retry, credential workaround or invented full-corpus result. Exact/presentation/substantive counts are unknown.
- The official documentation example (one verse) is cached verbatim and used as the real annotation fixture. Other transport/security fixtures are explicitly test doubles, not claimed Quran.com responses.
- **PDF verification: visual samples only.** Custom Type1C fonts have no reliable Unicode mapping. Fatiha, Ali Imran 102–107 (PDF page 57), and the Anfal/Tawbah boundary (PDF page 169) were visually inspected. No OCR was used. No complete text comparison or discrepancy resolution can be claimed.
- **Browser visual QA: NOT RUN.** The approved cloud browser rejected the local app with `net::ERR_BLOCKED_BY_CLIENT`. The 360/390/430/768/1440 light/dark checks are DOM/CSS contracts, not screenshots or actual viewport layout measurement. Font metrics and contrast calculations passed; actual overlap/clipping/horizontal overflow remain unverified in a browser.
- Audio regression uses the unchanged real audio code with test media. Actual remote audio playback was not tested.
- All five PDFs and every unrelated existing file are protected by the SHA-256 scope gate. The standalone PDF reader portable HTML was retained byte-identically after the normal build because it does not use the Daily Wird selectors.

## Focused commands

```sh
node tests/quran-integrity.cjs
node tests/wird-reader.cjs
node tests/wird-reader/scope-check.cjs
```

To audit a legitimately obtained complete cached Quran.com Uthmani bulk response:

```sh
node tests/quran-integrity.cjs --compare /path/to/qurancom-uthmani.json
```

This compares keys/order and classifies exact, presentation-only and substantive differences. Substantive differences fail that gate and must be investigated; it never auto-edits verses.

Normal build executed: `python3 scripts/build_portable.py`. No unrelated feature suites or live backend operations were rerun. Older full-site/backend result files in the complete package are historical and are not results of this reader patch.
