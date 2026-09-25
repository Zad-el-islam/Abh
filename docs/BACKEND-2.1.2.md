# Supabase repair — 2.1.2

## Diagnosis and preservation

On 25 September 2026 the original project `bzrhrvgddtnhctcdlgmy` was INACTIVE. Auth/REST returned 502/521 and the feed returned 500. Restoring that same project recovered its original schema, seven Auth users, three video records and five Storage objects; no database rebuild was necessary. Temporary empty results during startup were not treated as a missing schema. The project subsequently reported ACTIVE_HEALTHY and Auth settings/feed returned HTTP 200.

The original project URL and publishable key in `assets/js/foundation.js` remain unchanged. No service-role key is included in browser code. `backend/backups/` contains pre-change schema, grants, policies, function source, dependency maps and aggregate row fingerprints. These are schema/code snapshots, not a full physical database backup or a user-data export.

## Changes applied

| Area | Repair |
| --- | --- |
| Auth and profiles | Signup trigger validates normalized username/internal email contract; existing uniqueness enforces duplicates. Profile updates remain own-row and limited to display_name, avatar_url, updated_at. |
| Sessions and bans | Private helpers validate Auth session, account status, ban and force_logout_at. Kick revokes sessions and refresh tokens; stale JWTs fail guarded RPC, RLS and Edge checks. |
| RLS and grants | Narrow profile/statistics/points reads and avatar policies; remove unused anonymous/authenticated grants on 14 public tables. Service-only tables keep deny-client RLS. Internal trigger RPC execution revoked. |
| Uploads | Authenticated owner, server-generated path, bounded MIME/size, rate limit, no overwrite, receipt hash. Finalize verifies object existence, actual size, MIME and container bytes; records remain pending until admin review. |
| Moderation/feed | Active server-verified admin session required. Approval rechecks content/owner; only approved eligible content is returned. Pagination advances scanned rows; owner lookup uses IDs. |
| Admin | Existing credentials retained. Search/pagination uses typed SQL; ban/unban/kick/delete enforce server authorization. No client-controlled admin role. |
| Interactions/points | Server-derived identity, duplicate-share protection and existing point-event idempotency. No arbitrary client point writes. |
| Storage | Existing private zad-talk-media and public zad-profile-avatars retained with their size/MIME configuration. Avatar policies now require own path and an active session. No duplicate buckets. |

Changed schema includes the nullable `zad_talk_submissions.upload_verified_at` column, `zad_private` helper schema, session validation/revocation RPCs and `zad_admin_users_page`. Existing `zad_admin_validate_session`, `handle_new_zad_user`, `zad_change_username`, `zad_get_my_season_stats`, `zad_claim_event`, `zad_get_today_wird_choice` and leaderboard logic were hardened without changing their client contracts. Indexes support feed ordering, failed admin login lookup and existing comment/IP-ban foreign keys. Explicit SQL is authoritative for every grant, policy and function definition.

### Applied SQL migrations

- `20260925154442_repair_zad_backend_authorization.sql`
- `20260925155115_zad_admin_user_search_pagination.sql`
- `20260925160155_revoke_internal_trigger_rpc_access.sql`

No production tables were dropped or renamed, no Auth reset was performed, and original content objects were not deleted. An initial migration syntax failure rolled back transactionally; the corrected migration was then applied successfully.

### Deployed Edge Functions

Canonical source: `supabase/functions/`; shared SDK pinned to `@supabase/supabase-js@2.110.8`. Existing `verify_jwt=false` configuration is retained because public/custom-admin endpoints and user endpoints perform their appropriate authentication inside the functions. Invalid user JWTs never fall through to guest access.

| Function | Live version |
| --- | --- |
| `zad-talk-create-upload` | 8 |
| `zad-talk-finalize-upload` | 6 |
| `zad-talk-feed` | 9 |
| `zad-talk-admin-list` | 4 |
| `zad-talk-admin-review` | 4 |
| `zad-admin-auth` | 5 |
| `zad-admin-users` | 6 |
| `zad-talk-social` | 7 |
| `zad-talk-leaderboard` | 4 |
| `zad-account-delete` | 2 |
| `zad-access-check` | 4 |

CORS permits only the two existing GitHub Pages origins and exact local HTTP/HTTPS hosts; it rejects Origin:null and deceptive host suffixes. Native requests without Origin still require endpoint-specific authorization. Errors are structured and secrets are not returned.

Only necessary frontend compatibility changed: `assets/js/access.js` checks session validity before profile loading, `assets/js/admin.js` respects server session expiry and clarifies kick, and one upload instruction in the canonical i18n catalog now says sign-in is required in all seven languages. Portable HTML was regenerated. The approved design, religious sources and PDFs were not changed.

## Actual verification

31 live test groups passed, zero failed (`tests/backend-live-results.json`). Real temporary accounts and real Storage objects exercised signup, duplicate username, login/password change/logout/session restoration, profiles and points; upload authorization/actual upload/finalization; pending moderation/approve/reject/feed; admin listing/search/ban/unban/kick/delete; cross-user updates and Storage access; forged authorization, invalid media and size mismatch. Tests used the bundled browser SDK with live HTTP calls. They are not browser-rendering tests.

113 local groups passed, zero failed: regression 27, historical backend contracts 5, static 7, localization 31, media localization 7, palette/path checks 16, Quran integrity 5, scoped colors 8, new backend security 7. All 12 canonical TypeScript sources parsed successfully. Existing GitHub Pages subdirectory, JS syntax, zero-missing-key localization and immutable content checks passed.

Temporary accounts/admin, objects and their recorded auxiliary rows were cleaned up. Original Auth users remain seven; original Storage objects remain five. Aggregate fingerprints match for ten original data tables, including videos, interactions, points, statistics and Storage objects. During testing the original administrator independently logged in and banned an original user; those legitimate concurrent changes were preserved, not reverted. Therefore this report does not claim every database row stayed byte-identical.

All five PDFs match their original SHA-256 hashes. All 743 protected religious strings remain unchanged. Quran fixture: 114 surahs, 6236 ayat, root `5b58aa48fb07265a53cea6abd510d226345357dd556250e30f3ba87b8a076499`.

## Limits and remaining configuration

- Full local `deno check` could not complete because npm registry access was refused. Syntax parsing, deployment bundling and live execution succeeded; these do not substitute for a completed typecheck.
- Rendered mobile/desktop browser QA was not run because session browser policy denied local project access. DOM and path regression checks passed.
- Previously issued signed playback URLs remain usable until their 300-second expiry. Storage upload tickets retain their platform expiry (approximately two hours); finalization rechecks authentication, ownership and ban status. Kick cannot instantly revoke a previously issued signed URL.
- Auth leaked-password protection remains disabled in the existing project configuration; it was not changed through unavailable Auth-management controls. See https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
- Security advisors also list intended service-only tables without client policies and intended SECURITY DEFINER RPCs. Internal trigger execution was revoked. Performance advisors included optional unused/duplicate indexes and two foreign-key index suggestions; destructive index cleanup was outside this repair.

The ZIP is ready for GitHub Pages with index.html at its root. SQL and Edge changes documented here are already applied to the original live project; uploading the website does not deploy backend code. No test credentials or private QA state are included.
