# wallaby-accounts

Deployed at `https://wallaby-accounts.samdbmoore.workers.dev`. Owns parent
accounts, subscriptions, licence batches, and — since the `account_profiles`
migration in `schema.sql` — account-scoped profile progress sync. `kq-sync`
(cloudflare-worker/sync-worker.js) is a separate, older Worker for a
device-paired username+PIN sync with no account behind it; it is still
deployed, but nothing in the current client (`WallabyMaths.jsx`) calls it any
more, so treat it as a decommission candidate rather than a second live sync
path.

## What's live right now

- D1 database `wallaby-accounts` (see `schema.sql`)
- Personal account sign-in: `POST /account/signup` (email+password),
  `POST /account/login`, or `POST /account/google-login` — normal sign-in
  is password- or Google-based, not a magic link
- Magic links now cover password set/reset only: `POST /account/forgot-password`
  sends one, `GET|POST /confirm` completes it — used after a personal/group
  account requests "forgot password", or after Sam creates a school's
  account from `/admin` (initial setup). There is no `/start` or `/status`
  poll any more; this is a recovery/setup side-path, never a login gate.
- Local PIN quick-gate for an already-logged-in device: `POST /account/set-pin`,
  `POST /account/reset-pin-with-password`
- School / group accounts: `POST /account/school-admin-signup` (self-service,
  sized to a small free trial batch) or created directly from `/admin`.
  Pupils log in password-free with `POST /account/school-login`
  (school_code + username + PIN — the pupil's only credential)
- School self-service seat dashboard: `GET /org` + `/org/*` — login, list/create/
  rename/reset-pin/free a seat, and request more seats once the trial batch
  is used up (`seat_requests`, resolved by Sam from `/admin`)
- Account-scoped profile sync: `GET/POST /account/profiles`,
  `GET|DELETE /account/profiles/:id`, `POST /account/profiles/:id/progress`
  — one `account_profiles` row per synced profile, merged client-side by
  `sync.js`'s `mergeProgress()`. This replaces the older per-device
  code+PIN sync and the earlier Google Drive sync design for any profile
  tagged to an account.
- Offline entitlement certificates: `GET /entitlement` (needs a session
  token), Ed25519-signed, valid 365 days, verified entirely client-side by
  `wm-entitlement.js` — no network call needed to keep playing
- Licence redemption: `POST /account/redeem` (gift codes / school batches)
- Erasure: `POST /account/delete`
- Admin panel: `GET /admin` (list/edit accounts, create licence batches,
  create group/school accounts, resolve seat requests, gift single accounts)
  — gated by the `X-Admin-Key` header / a key prompt on the page itself
- Paddle webhook skeleton: `POST /webhooks/paddle` — returns 501 until
  `PADDLE_WEBHOOK_SECRET` is set; **field names are my best guess at Paddle
  Billing's webhook shape and are unverified against a real Paddle account**

See `schema.sql`'s migration comments for the full history of how the
login/sync model got here — it has moved twice since this file was first
written.

## Content gating (done)

Wired into WallabyMaths.jsx as of 2026-09-06 — Junior/Intermediate are locked behind
entitlement (both on module switch and on app resume/profile-entry, so a lapsed
subscription can't leave a profile stuck in a module it no longer has access to), and
Primary has all six of the brief's freemium caps (Level 1 only, first 5 lessons, chapter 1,
first 2 adventures, 1 card pack, 1 Joey match), all keyed off one derived flag
(`primaryFreemiumCapped`). Full detail in project memory / CLAUDE.md's Backend section.

## School card trading (deployed 2026-09-12)

Migration 7 adds school-and-module-scoped trade listings and offers. Only authenticated
`seat` accounts can use these routes. A listed or offered card must be an ordinary,
non-upgraded duplicate, listings last seven days and each profile can hold three open
listings. Accepting an offer updates both profile progress blobs in one D1 batch and
increments their revisions so an older device save cannot silently restore a traded card.

- `GET /trades?profile_id=:id&module=:module`
- `POST /trades/listings`
- `DELETE /trades/listings/:id`
- `POST /trades/listings/:id/offers`
- `POST /trades/offers/:id/accept`
- `POST /trades/offers/:id/reject`
- `POST /trades/offers/:id/withdraw`

The client screen is available from the Card Lab only when the current entitlement has
`accountType === "seat"`. Migration 7 is applied to the live D1 database and the matching
Worker routes are deployed.

## Joey multiplayer (deployed 14 September 2026 — see JOEY_MULTIPLAYER_SPEC.md)

Stage 3 ("Cloudflare ownership") of the multiplayer spec: lobby presence, the challenge
lifecycle, and a live match room. Migration 8 in `schema.sql` adds `joey_presence`,
`joey_challenges`, `joey_matches` (a recoverable index, not authoritative state) and
`joey_active_match` (a real PK-based "one live match per profile" guarantee — both sides'
rows are inserted in the same D1 batch that creates the match). Group membership
(`family:{account_id}` / `school:{school_code}`) is always derived server-side from the
authenticated account — see `joey-group.js` — never trusted from a client.

Authoritative match state lives in a `JoeyMatchRoom` Durable Object (`joey-room.js`), one
per match, reachable only through this Worker's own `JOEY_MATCH_ROOM` binding — never a
public URL. It is a thin transport shell: all Joey battle rules and per-player redaction
come from the existing `joey-multiplayer.js` engine (nothing here reimplements them), and
all the room's own timing/persistence logic (turn/mulligan deadlines, the 10-minute
abandonment sweep) is `joey-room-core.js`, written as pure functions over a storage
duck-type so it's unit-testable with a plain in-memory fake — no wrangler/Miniflare
needed, same philosophy `scripts/lib/d1-shim.mjs` already established for D1
(`scripts/lib/do-shim.mjs` is the equivalent for the Durable Object).

- `GET  /joey/lobby`, `POST /joey/lobby/ready`, `POST /joey/lobby/not-ready`
- `POST /joey/challenges`, `POST /joey/challenges/:id/accept|decline|cancel`
- `GET  /joey/matches/current`, `GET /joey/matches/:id`
- `POST /joey/matches/:id/mulligan|actions|concede`
- `GET  /joey/matches/:id/events` — WebSocket upgrade; the session token travels as a
  `?token=` query param (browsers can't set an Authorization header on a WS handshake)

A deck spec is resolved server-side (`joey-deck.js`) with `buildPlayerDeck` from
`joey-battle.js` — the same function Card Lab Character Challenges use — against the full
three-module card + boss-card catalogue (cross-module "borrowed" cards are a real
deck-builder feature), then checked against the profile's actual owned-card counts. **Known gap:**
the cross-module borrow caps (`MAX_PER_OTHER_MODULE`/`MAX_OTHER_MODULES_TOTAL` in
`joey-deck.js`) are copied numbers from WallabyMaths.jsx's deck-builder UI, not a shared
constant — if that file's limits ever change, this file needs a matching edit.

Migration 8 was applied to the live `wallaby-accounts` D1 database from
`migrations/0008_joey_multiplayer.sql`. The Worker and `JoeyMatchRoom` Durable Object
were deployed together as Worker version `c7a72ebb-174d-4ca3-9f9b-9464f4dd5bc8`.

**Post-deployment validation still needed:**
- Backend tests (`scripts/test_joey_lobby.mjs`, `scripts/test_joey_room.mjs`,
  `scripts/test_joey_deck.mjs`) cover the D1/lobby/challenge/match-action flow and the
  room's timing logic end-to-end against in-memory D1/DO shims, but the real WebSocket
  upgrade handshake itself (`state.acceptWebSocket`/`WebSocketPair`) is a Workers-runtime
  API with no Node equivalent — it is exercised only indirectly (webSocketMessage/
  webSocketClose called directly against a fake socket). A Miniflare pass or a real
  two-browser test against a deployed preview Worker is still needed before release —
  see JOEY_MULTIPLAYER_SPEC.md §21.4/§22 Stage 4.
- Run the real two-device family and school-seat journeys described in
  `JOEY_MULTIPLAYER_SPEC.md` §21.4 and confirm the packaged Android WebSocket handshake.

## Not yet done

- Emails are not actually sent — no `RESEND_API_KEY` is set, so `/start`
  echoes the confirm link back in the API response (`debug_confirm_url`)
  instead. Get a Resend account + verified sending domain, then:
  `echo YOUR_KEY | npx wrangler secret put RESEND_API_KEY` (run from this
  directory). The debug echo disappears automatically once this is set.
- Paddle isn't connected. Once Sam has a Paddle account with products for
  annual_single / annual_family / lifetime, wire up
  `PADDLE_WEBHOOK_SECRET` and sanity-check `handlePaddleWebhook` in
  `worker.js` against real webhook payloads (Paddle's sandbox sends test
  events) — the price-id → plan mapping in `planFromPriceId` will need
  real price IDs substituted in.
- No cron/scheduled Worker for the trial-day-6 and 30-day-renewal reminder
  emails (brief §4.3, §7.1) — not worth building until email sending
  itself works.
- Android Google Play Billing — deliberately deferred, see project memory.

## Admin panel

Visit `/admin`, paste in the admin key when prompted (stored in that
browser's own localStorage after that, not asked again). The key itself is
a Worker secret (`ADMIN_KEY`) — Sam has the value; it is not written
anywhere in this repo. To rotate it: `npx wrangler secret put ADMIN_KEY`
from this directory.

## Regenerating the signing key (only if it's ever compromised)

```bash
node -e '
const crypto = require("crypto");
const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
const pkcs8 = privateKey.export({ type: "pkcs8", format: "der" });
const spki = publicKey.export({ type: "spki", format: "der" });
console.log("PRIVATE_PKCS8_B64=" + pkcs8.toString("base64"));
console.log("PUBLIC_RAW_B64=" + spki.subarray(spki.length - 32).toString("base64"));
'
```

Then: `echo PRIVATE_PKCS8_B64_VALUE | npx wrangler secret put ENTITLEMENT_PRIVATE_KEY`,
and update `PUBLIC_KEY_RAW_B64` in `wm-entitlement.js` to the new
`PUBLIC_RAW_B64` value, then rebuild the app. Every certificate issued
under the old key stops verifying the moment the new public key ships —
existing offline players fall back to freemium until they're next online
to fetch a new one, so don't rotate without a reason.
