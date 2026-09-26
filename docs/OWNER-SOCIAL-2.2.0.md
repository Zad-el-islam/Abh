# Zad El-Islam 2.2.0 — Owner, Talk and Rouh

## Status

The original Supabase project is `bzrhrvgddtnhctcdlgmy`. The initial outage was caused by its INACTIVE state, not a missing database. It was restored in place; the prior authorization/upload/session repairs are documented in `BACKEND-2.1.2.md`. This release extends that repaired backend after inspecting the live schema. No production database, Auth users or media objects were reset.

The OWNER account named **أبو هريرة**, handle **abu_huraira**, has **not** been created: its private email has not been supplied. No email was invented. The requested temporary password is not in this package. Live Owner tests used temporary QA accounts that have been removed. Provision the real account through trusted Supabase Auth admin tooling, using the provided private email, then bootstrap the single Owner membership through a trusted database operator. The owner must change the temporary password after first sign-in. Never put passwords in SQL, frontend configuration or a repository.

## Database changes already applied

`supabase/migrations/20260925193352_owner_roles_social_threads.sql` is the exact applied, additive migration. The preceding three repair migrations remain included. The existing `zad_admins` role system was extended; no duplicate profile role system was added.

- `zad_admins`: Auth user link, role constraint, unique membership, unique Owner. Missing active membership means USER. Existing legacy admin credentials are retained.
- Membership/profile triggers prevent Owner deletion, demotion, ban, reassignment or forced logout through product operations. OWNER creation is restricted to a trusted database operator. ADMIN cannot modify staff; MODERATOR cannot manage users.
- `zad_set_staff_role`: service-only, requires the verified Owner actor; permits USER/ADMIN/MODERATOR assignments only. Public signup metadata never grants a role.
- Existing `zad_talk_comments`: nullable parent and update timestamp, parent/identity trigger and paging indexes. Replies have one level and must belong to the same video.
- New `zad_talk_comment_likes`: composite primary key and foreign keys, RLS enabled, no anonymous/authenticated client grants. Access goes through authenticated Edge actions.
- Service-only `zad_visible_talk_comments` and `zad_social_comment_page`: hide moderated content, banned authors and replies to hidden parents; bounded pagination and counts.
- No new or renamed Storage buckets. Existing private video and avatar buckets/policies are retained from 2.1.2.

## Edge Functions already deployed

Canonical code is in `supabase/functions/`. Exact live version numbers are in `data/owner-function-versions.json`.

| Function | Version |
| --- | --- |
| zad-talk-create-upload | 9 |
| zad-talk-finalize-upload | 7 |
| zad-talk-feed | 10 |
| zad-talk-admin-list | 5 |
| zad-talk-admin-review | 5 |
| zad-admin-auth | 6 |
| zad-admin-users | 8 |
| zad-talk-social | 8 |
| zad-talk-leaderboard | 5 |
| zad-account-delete | 3 |
| zad-access-check | 5 |
| zad-admin-comments | 2 |

Shared runtime verifies Auth and current server membership on every privileged request. Demotion takes effect without waiting for JWT refresh. Owner privileges cannot be invalidated by a shared-IP ban on another user. Auth session validation still applies to Owner.

Auth-linked staff log in with Supabase Auth. A private-email username fallback resolves the email on the server; it never publishes the email in the username lookup. Legacy custom admin sessions remain supported. OWNER can disable/re-enable legacy administrators and revoke their custom sessions. CORS remains restricted to the existing two GitHub Pages origins and exact local HTTP hosts.

Video upload authorization, byte signature verification, pending moderation, signed playback, rate limits and server ownership checks are retained. The feed exposes only eligible approved clips with the real profile name, username and avatar. Public profile requests use the same feed and approved-content rules. Comments support idempotent likes, paginated replies, own deletion and staff hiding; client-supplied identity does not grant ownership. No client receives service-role credentials.

## Frontend changes

- Existing Talk feed now has native vertical snapping, one visible muted looping video, reduced-motion support, real publisher identity and a small public profile dialog. Native controls remain available.
- Comments preserve the existing sheet, search-safe text rendering and translations; add likes, replies, own deletion, pagination and cancellation.
- Existing admin layout adds comments and role labels. Role controls/legacy staff controls are Owner-only. Dangerous actions require confirmation; server authorization is authoritative.
- Normal account profile shows a subtle Owner badge and the staff link only from a verified server role. Admin Auth credentials are held in session storage, never persistent localStorage.
- Rouh uses one canonical list containing the ten supplied URLs, factual source titles/channels/durations, categories, local saved items and a deterministic daily choice. The long reference is excluded from the daily rotation. Only an explicit play click loads a single YouTube iframe; an original YouTube link is always available.
- Quran/Hadith/PDF content and unrelated modules are preserved.

## Tests and limits

`tests/owner-live-results.json` records 24 real live test groups executed on 25 September 2026. The report was reconstructed from completed session results after a workspace interruption; it is not a newly rerun suite. All groups passed after correcting the banned-token test to accept Auth's 401 as well as the Edge 403 rejection. The earlier backend release's separate 31 live groups are retained in `tests/backend-live-results.json`.

Live tests covered role spoofing/public signup, Owner login/site/admin access, assignment/removal and immediate demotion, Admin/Moderator Owner protection, direct role/RLS denial, real avatar/video upload and moderation, real profile/feed identity, video/comment likes, replies, comment ownership/deletion/moderation/pagination, ban/unban and shared-IP Owner protection, database Owner guards, and legacy-admin enable/disable/session invalidation.

QA accounts, videos, comments and Storage objects were cleaned up. Read-only cleanup verification on 26 September returned seven original Auth users, three videos, five Storage objects, zero QA profiles and zero Owners. Audit/rate-limit history may retain QA entries. No claim is made that every audit row is byte-identical.

Local reports cover actual generated portable HTML, the canonical function source, DOM/API adapters, seven-language completeness, palette contrast and scoped persistence, subdirectory paths, JavaScript/TypeScript syntax, PDF byte hashes and protected religious strings. `owner-social-ui.cjs` is explicitly a DOM test with API doubles, not a live test. Legacy review-only sources and private backup exports are excluded from the GitHub-ready ZIP; backend contracts now test the canonical deployed source.

Rendered 390px/1440px browser checks were not run because browser policy denied local project access. Full local Deno typechecking was blocked by npm registry access; syntax parsing, deployment bundling and actual live execution succeeded. YouTube playback remains dependent on provider embed availability; fallback links are supplied. Existing signed video links can remain usable for their five-minute lifetime after moderation changes.

Quran fixture remains 114 surahs / 6236 ayat, SHA-256 root:
`5b58aa48fb07265a53cea6abd510d226345357dd556250e30f3ba87b8a076499`.
All five PDF byte hashes and all 743 protected religious strings are unchanged.

## Build and package

Run `python3 scripts/build_portable.py`, `npm test`, `npm run check`, `npm run test:localization`, and `npm run test:deployment`, then `python3 scripts/package_release.py /path/Zad-El-Islam-FINAL.zip`.

The ZIP contains the complete deployment with `index.html` at its root, plus canonical frontend/backend sources, explicit SQL migrations and test reports. Uploading static files to GitHub Pages does not apply SQL or deploy Edge Functions; the backend changes above are already deployed to the original project. The only unfinished provisioning action is creation of the real Owner after receiving the private email.
