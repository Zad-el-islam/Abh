# Zad Al-Rouh gateway patch — 2.2.1

This patch starts from the latest uploaded working 2.2.0 ZIP (SHA-256 `229efc98edb527c081aba46fab0274a840851dbe1c959f726e19147d81368329`). It changes only the fourth gateway, its navigation and player, their translations, and directly related QA/release files.

## Changes

- Home now presents Faith, Knowledge, Zad Talk and Zad Al-Rouh as four equal gateway cards, numbered 01–04. Rouh has its own moon icon, description, topic tags and explicit opening action.
- The gateway grid is two columns above 640px and one column on mobile. The main navigation contains Rouh and uses its own scrollable row on small screens, preserving readable labels and touch targets. Global search includes Rouh.
- The Islamic Library stays under Knowledge. Existing shortcuts do not create extra gateway cards.
- Rouh has a breadcrumb, heading, calm description, return action, and the requested Arabic question/categories/save labels with all seven supported translations. The curated data, video IDs, original titles/channels/URLs/durations, daily rotation and local saved-item key are unchanged.
- Primary Play is an in-site button. It creates a single `youtube-nocookie.com` iframe only after the click, with inline mobile playback and the appropriate referrer policy. The responsive 16:9 dialog includes the source title, close button and persistent secondary YouTube link.
- Close, ESC/native cancellation, replacing a video, navigating away and changing language remove the iframe context completely. Focus returns to the original button when appropriate. Image/request failures retain usable controls and a calm fallback.
- YouTube may show its own restrictions inside the cross-origin iframe. A translated fallback explanation and original YouTube link are always visible. The parent does not bypass those restrictions, load third-party scripts, or claim to infer provider errors it cannot inspect.
- CSP narrows the thumbnail allowance to `https://i.ytimg.com/vi/` and the frame allowances to the exact YouTube `/embed/` paths. The existing standard YouTube embed path is retained for Seerah. No broader wildcard or parent-side external script was added.

## Verification

`tests/rouh-gateway.cjs` provides 14 focused groups, including all ten video buttons at 390, 768 and 1440px settings (30 DOM lifecycle cases), one-frame replacement, close/ESC, focus restoration, fallback controls, route/back behavior, the four cards, library placement, seven languages, search, scoped colors, light/dark and CSP. Width checks inspect CSS breakpoint contracts and calculate the player box; they are not rendered-browser measurements. Thumbnail URL/loading attributes and simulated failure handling were tested, not successful remote image rendering.

The normal build and project test commands were run. Existing local-path, GitHub Pages subdirectory, source integrity, scoped color and localization checks remain in the package. Prior live backend reports are historical and were not rerun or represented as new Rouh tests.

### Explicit provider/browser limits

- Cloud Browser refused the local project URL with `net::ERR_BLOCKED_BY_CLIENT`. No rendered mobile/tablet/desktop browser check was completed and no alternative browser was used to bypass the block.
- All ten exact `youtube-nocookie.com/embed/<id>` endpoints returned HTTP 200 documents titled YouTube. Those responses did not expose a playback result and do **not** prove that a video played successfully in an iframe.
- The thumbnail host returned an HTML “Site Unavailable” response instead of image bytes. Further thumbnail downloads were not retried. Actual thumbnail rendering remains unverified.
- Successful automated in-site iframe lifecycle cases: **10/10 videos × 3 viewport settings**. Confirmed live playback: **0 verified**, not ten playback failures. Videos whose owners disallow embedding: **undetermined**; no unsupported claim of zero blocked videos is made.
- The secondary link remains usable when YouTube disallows embedding or a browser/network prevents playback. Local-file viewing cannot supply the same HTTP referrer as a deployed HTTPS site; GitHub Pages is the intended deployment target.

See `data/rouh-provider-qa.json`, `data/rouh-patch-qa.json` and `tests/rouh-gateway-results.json` for the exact scope.

## Preservation and package

All canonical Supabase migrations/functions, account/Admin/Talk source, Quran/Hadith/reading sources, curated Rouh data, PDF bytes and original book contents remain unchanged. No Supabase calls or account work were performed in this patch. Shared CSS/catalog updates appear in regenerated portable pages through the normal build; their other feature logic is unchanged.

The complete ZIP has `index.html` at the root and contains the full static deployment, original PDFs, editable canonical sources and test reports. No backend deployment is needed for this patch.
