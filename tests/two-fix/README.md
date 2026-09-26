# Daily Wird + Rouh player patch — 26 September 2026

Only these five canonical files changed:

- `assets/js/quran-reader.js`
- `assets/css/reader.css`
- `assets/js/rouh.js`
- `assets/css/rouh.css`
- `source-pages/index.html`: two exact official YouTube player API script paths in CSP only.

The complete deployment is at the ZIP root. Upload its contents to GitHub Pages.
No account, backend, database, library, Seerah, video-data, Quran-source or PDF changes.

## Reader fixes

The opening basmalah is moved to a centered line using the exact prefix of the
existing source record. Fatiha keeps its numbered first verse. Tawbah has no
opening line. All 112 other opening lines are checked, including the original
opening-mark variants in source records 95:1 and 97:1. No marks are corrected.
Concatenating the reader's source spans reproduces every original verse exactly.

The bundled Amiri font places the two U+0653 marks on top of one another in the
opening shared by 2:1 and 3:1. Optional Amiri features did not resolve it. Identical
surah openings now use the already bundled Noto Arabic font. All other Quran text
keeps Amiri. The 12 raster samples show two separate madd components and sufficient
line height, without changing characters, adding spaces or moving letters.

Tajweed is indexed by canonical verse key, never response-array position. A missing
or malformed record no longer rejects the complete chapter. Duplicate identities
are quarantined. Partial responses do not become permanent failure caches. If a
provider supplies pagination metadata, it is followed with bounded chapter requests.
The source's unnumbered opening prefix is handled separately when it is absent from
the provider's ayah-1 text. Canonically equivalent Unicode is aligned for annotation
only; displayed source codepoints remain unchanged. Substantive differences and
unknown annotations still fall back to plain source text. Late responses cannot
replace another portion or re-enable a disabled Tajweed setting.

## Rouh player fixes

The existing `#rouh` route now has a single persistent in-page player area, following
Seerah's explicit-click / create-iframe / replace-previous-frame pattern. No separate
`rouh.html` or navigation redesign was needed. All ten original URLs and metadata
are unchanged. Saving or filtering leaves the active iframe connected.

Native controls, fullscreen, picture-in-picture permission, strict-origin referrer
policy, a translated enlarge action and original YouTube links are present. Closing,
ESC, changing video, leaving the route, changing language or pagehide removes the
iframe. The optional official YouTube IFrame API reports errors such as embedding
restrictions. Failure to load that API does not prevent the native iframe from loading.
CSP adds only `https://www.youtube.com/iframe_api` and
`https://www.youtube.com/s/player/`; no wildcard or third-party proxy was added.
The player preserves 16:9 as its preferred viewport ratio and a 200px minimum height
for YouTube's native controls. YouTube preserves the actual video's proportions.

## Checks actually run

- `python3 scripts/build_portable.py`: normal build, including six pinned integrity tests.
- `node tests/wird-reader.cjs`: 32 passing, 0 failing.
- `node tests/rouh-gateway.cjs`: 19 passing, 0 failing; all ten videos tested at 390/768/1440.
- JS syntax, CSS parsing and 40 local relative references: pass.
- All seven languages cover the directly added player/reader labels.
- Light/dark Tajweed contrast remains at least 4.5:1 on all existing reader surfaces.
- `node tests/two-fix/scope-check.cjs`: scope/PDF preservation gate.
- `python3 tests/two-fix/font-check.py`: Pillow/RAQM font samples; not browser screenshots.

The normal builder also embeds shared reader CSS into `reader.html`. That unrelated
PDF-reader output was retained byte-for-byte from the baseline; all new reader rules
are scoped to Daily Wird. `index.html` contains the rebuilt canonical changes.
Reports elsewhere in the package retain their original dates; they are historical
results and are not claims that unrelated suites were rerun for this patch.

## Limits — do not report these as live PASS

The Quran.com chapter request returned HTTP 403. It was not retried through proxies
or alternate credentials. The cached official documentation sample verifies real
Tajweed classes for 1:1. Other chapter payloads in transport tests deliberately contain
plain source text, not invented Tajweed rules. Live Tajweed across the Quran is unverified.

The available browser refused the local application with `net::ERR_BLOCKED_BY_CLIENT`.
Responsive tests therefore check DOM/CSS contracts, not actual browser geometry.
The font raster proof does not establish zero clipping throughout every browser page.

A direct top-level no-cookie YouTube embed reported “Video player configuration error”.
It lacks the normal hosted-page context and does not establish an owner embedding ban.
There are 10/10 passing DOM lifecycle tests and **0/10 verified live in-site playback
results**. Fullscreen/error-event tests use API doubles; audio uses test media.
No owner embedding block was positively established. Do not interpret “unverified”
as ten videos confirmed unplayable.
