-- Wallaby Maths parent-account system. Deliberately minimal per GDPR data
-- minimisation: an account is just an email address plus the operational
-- fields needed to know what it's entitled to and when to email it. All
-- child data (display name, age band, progress) lives on-device only and
-- never reaches this database — see CLAUDE.md "Progress / storage".

CREATE TABLE IF NOT EXISTS accounts (
  account_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  trial_started_at INTEGER,
  trial_expires_at INTEGER,
  -- No CHECK constraint on purpose: the brief (kmq-monetisation-build-brief.md §10)
  -- wants room for a future 'school_licence' status without a schema migration.
  subscription_status TEXT NOT NULL DEFAULT 'trialing',
  subscription_plan TEXT,
  subscription_expires_at INTEGER,
  paddle_customer_id TEXT,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

-- Magic-link login. `token` is the secret in the emailed URL and is never
-- sent to the app. `poll_id` is a separate id the app polls with, so it can
-- learn "am I verified yet?" without ever holding the value that verifies it.
-- `session_token` is filled in once /confirm succeeds, for /status to hand back.
CREATE TABLE IF NOT EXISTS magic_links (
  token TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  session_token TEXT
);

-- Long-lived session tokens (90 days), used only to silently refresh the
-- offline entitlement certificate when the device happens to be online.
-- Not needed for offline play itself — see the certificate model below.
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- A block of pre-paid credits (a gift, or a school's bulk purchase). Redeeming
-- one of its codes upgrades an account to `plan` and decrements credits_used.
CREATE TABLE IF NOT EXISTS licence_batches (
  batch_id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  plan TEXT NOT NULL,
  total_credits INTEGER NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 0,
  expiry_mode TEXT NOT NULL, -- 'days_from_redemption' | 'fixed_date'
  expiry_value TEXT NOT NULL, -- integer days, or an ISO date string
  created_at INTEGER NOT NULL,
  note TEXT
);

-- One row per seat in a batch. A one-off gift is just a batch of size 1.
CREATE TABLE IF NOT EXISTS licence_codes (
  code TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  redeemed_by_account_id TEXT,
  redeemed_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_licence_codes_batch ON licence_codes(batch_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
CREATE INDEX IF NOT EXISTS idx_sessions_account ON sessions(account_id);

-- ---------------------------------------------------------------------------
-- Migration: mandatory account (email+PIN, or school code+username+PIN) —
-- see WallabyMaths.jsx's account-gate flow and cloudflare-worker/accounts/README.md.
-- Additive only — run once against the already-deployed DB with:
--   npx wrangler d1 execute wallaby-accounts --remote --file=./migrations/0001_accounts.sql
-- (copy just the ALTER/CREATE statements below into that file; CREATE TABLE
-- IF NOT EXISTS above is left untouched so re-applying this whole schema.sql
-- against a fresh DB still works — a fresh DB should instead have these
-- columns folded into the CREATE TABLE statements above before first deploy).
-- Nothing here has been run against the real deployed DB yet (this whole
-- feature is pre-launch), so this migration is written clean rather than as a
-- patch-on-a-patch.
--
-- account_type: 'personal' (a family, keyed by email) | 'group' (a school's own
-- org-portal login, keyed by email+password) | 'seat' (one pupil, keyed by
-- school_code+username+PIN — provisioned directly by the school/admin, not
-- redeemed from a code, so the same pupil can log in from the school's own
-- machines and from home). A seat is otherwise shaped exactly like a personal
-- account (see getOrCreateAccount/issueCertificateFor) — it still needs SOME
-- value in the NOT NULL UNIQUE `email` column, filled with a synthetic,
-- never-emailed address purely to satisfy that constraint; login never reads it.
ALTER TABLE accounts ADD COLUMN account_type TEXT NOT NULL DEFAULT 'personal';

-- Personal & seat local credential. For personal/group accounts this is a LOCAL
-- quick-gate only (Account screen / /org page) on a device already authenticated
-- by password — it can never log a brand-new device in by itself. For a seat
-- (pupil) it's the pupil's ONLY credential (no password), so it's fixed at 8
-- digits instead of 4-8 — see SEAT_PIN_RE in worker.js. Verified like a password:
-- the raw digits travel to the server over HTTPS at set/login time, the server
-- salts+hashes it (SHA-256(pin_salt + pin)) and stores both. pin_salt then also
-- rides inside the signed entitlement certificate so a personal account's device
-- can verify a locally-typed PIN itself afterwards with no network call — see
-- issueCertificateFor and wm-pin.js. (/org has no offline-cert model — its own
-- quick-gate checks the PIN online instead, see handleOrgVerifyPin.)
ALTER TABLE accounts ADD COLUMN pin_hash TEXT;
ALTER TABLE accounts ADD COLUMN pin_salt TEXT;

-- Personal & group accounts — the REAL credential (PBKDF2). Creates the account,
-- logs a brand-new device/browser into an existing one, and is required to
-- recover a forgotten PIN (see handleLogin/handleOrgLogin/
-- handleResetPinWithPassword). Seats have no password at all — see pin_hash above.
ALTER TABLE accounts ADD COLUMN password_hash TEXT;
ALTER TABLE accounts ADD COLUMN password_salt TEXT;

-- Seat accounts only — the pupil's own school-issued username, and the school's
-- own code (denormalized from the owning group account, so a login lookup is a
-- single-table query: WHERE account_type='seat' AND school_code=? AND username=?).
-- Group accounts also carry school_code (their own identifier, used by pupils
-- logging in — distinct from the group's own email+password org-portal login).
ALTER TABLE accounts ADD COLUMN username TEXT;
ALTER TABLE accounts ADD COLUMN school_code TEXT;
-- Seat accounts only — which batch (and therefore which group/school account)
-- this pupil belongs to.
ALTER TABLE accounts ADD COLUMN group_batch_id TEXT;
-- Seat accounts only — an org-assigned label ("Room 4, Chromebook 12"), never
-- the child's own in-app display name.
ALTER TABLE accounts ADD COLUMN seat_label TEXT;

-- Links a batch to the group account that manages it from the org portal —
-- now purely a capacity/billing ledger for seats (total_credits = seats
-- purchased, credits_used = seats currently provisioned; no per-seat
-- licence_codes rows any more, seats are accounts rows from the start).
-- NULL for today's personal gift/redemption batches, which still use
-- licence_codes exactly as before.
ALTER TABLE licence_batches ADD COLUMN owner_account_id TEXT;

-- Every magic link is a "set/reset your password" invite ('set_password' — the
-- schema default and, in practice, the only value in use): sent after Sam creates
-- a school's account from /admin (initial setup), or after either a personal or
-- group account requests "forgot password" (see handleForgotPassword). Always a
-- recovery/setup side-path, never a gate in front of ordinary play — see
-- handleLogin/handleSchoolLogin for the instant, password-free-for-pupils path,
-- and handleResetPinWithPassword for "I forgot my local PIN but not my password."
ALTER TABLE magic_links ADD COLUMN purpose TEXT NOT NULL DEFAULT 'set_password';

CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_username_school ON accounts(school_code, username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_school_code ON accounts(school_code) WHERE account_type = 'group';
CREATE INDEX IF NOT EXISTS idx_licence_batches_owner ON licence_batches(owner_account_id);
CREATE INDEX IF NOT EXISTS idx_accounts_group_batch ON accounts(group_batch_id);

-- Minimal rate-limit log for the online-guessable credential checks (personal
-- login, school pupil login, org login, password-based PIN reset) — same "count
-- recent rows" approach handleStart already used for magic links, generic enough
-- to cover every kind here rather than a bespoke counter each. `email` holds
-- whatever the rate-limit key is for that kind (a real email, or
-- "schoolcode:username" for school logins).
CREATE TABLE IF NOT EXISTS auth_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  kind TEXT NOT NULL, -- 'login' | 'school_login' | 'org_login' | 'reset_pin_pw'
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_lookup ON auth_attempts(email, kind, created_at);

-- ---------------------------------------------------------------------------
-- Migration 2: Google sign-in as an account login method, and real
-- account-scoped profile/progress sync (replacing "log in with a code" /
-- Google Drive per-profile sync for any profile tagged to an account — see
-- WallabyMaths.jsx). The migration above this point has already been applied
-- to the deployed DB (2026-09-08), so this is additive on top of it, not a
-- rewrite — run once with:
--   npx wrangler d1 execute wallaby-accounts --remote --file=./schema.sql
-- (CREATE TABLE/INDEX IF NOT EXISTS and ALTER TABLE ADD COLUMN are both
-- no-ops/safe on a DB that already has everything above this point).

-- Google's stable per-account subject id (the `sub` claim) — set the first time
-- an email signs in via Google (handleGoogleLogin), whether that creates a new
-- account or links onto an existing password-based one (Google's own email
-- verification is real proof of ownership, same trust level a clicked magic
-- link gives). NULL for accounts that have only ever used a password.
ALTER TABLE accounts ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_google_sub ON accounts(google_sub) WHERE google_sub IS NOT NULL;

-- One row per player profile, scoped to the account that owns it — this is what
-- makes a profile "a subset of the account" for real, rather than just something
-- sitting in a device's local storage that happens to be visible regardless of
-- who's logged in. `progress` is the same JSON shape the device already keeps
-- locally (see freshProgress() in WallabyMaths.jsx); `updated_at` drives the same
-- kind of newer-wins/merge logic sync.js already uses for the older per-code sync.
-- `name`/`avatar` are duplicated out of `progress` purely so the picker can list
-- profiles (GET /account/profiles) without pulling every full progress blob —
-- `name` is always the random three-word generated one (see wm-names.js), never
-- anything a child typed themselves, so this table holds no more child PII than
-- the rest of this schema already avoids.
CREATE TABLE IF NOT EXISTS account_profiles (
  profile_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  active_module TEXT,
  progress TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_account_profiles_account ON account_profiles(account_id);

-- ---------------------------------------------------------------------------
-- Migration 3: recoverable seat PINs. pin_hash/pin_salt (migration 1) are
-- one-way, fine for the login check but not for the real workflow — a school buys
-- seats well before it knows which child gets which, so someone needs to come back
-- and hand out "username: X, PIN: Y" slips over the following days or weeks, not
-- just once at the moment of creation. pin_enc holds the PIN AES-256-GCM encrypted
-- under the SEAT_PIN_KEY Worker secret (see encryptPin/decryptPin in worker.js) —
-- recoverable by the school's own /org dashboard and by Sam's /admin, but not a bare
-- plaintext column. Personal/group accounts have no pin_enc — only seats do.
ALTER TABLE accounts ADD COLUMN pin_enc TEXT;

-- ---------------------------------------------------------------------------
-- Migration 4: self-service school signup (handleSchoolAdminSignup — a teacher can
-- now create their own school account from the app's front door, no email to Sam
-- needed) plus the two things that come with letting schools manage themselves:
-- knowing when a seat was last actually used, and a lightweight approval flow for
-- growing past the free-trial seat count until real billing exists.

-- Set on every successful login (personal, school pupil, org) — lets a school's own
-- /org dashboard (and Sam's /admin) show "has this seat ever been used, and when
-- last" rather than just whether it was ever created.
ALTER TABLE accounts ADD COLUMN last_login_at INTEGER;

-- A self-service school signup's own first batch, sized to a small free trial
-- (SCHOOL_TRIAL_SEATS/SCHOOL_TRIAL_DAYS in worker.js) rather than however many
-- seats Sam's own /admin panel provisions up front — pupil seats within it are
-- still only created on demand via /org's existing "Add a new pupil", not
-- pre-generated, since there's no purchase telling us how many are really needed.
-- Growing past that free cap is a request Sam approves (see below), not instant
-- self-service, until Paddle billing replaces this.
CREATE TABLE IF NOT EXISTS seat_requests (
  request_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,      -- the requesting group account
  batch_id TEXT NOT NULL,        -- which batch to grow if approved
  requested_seats INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'denied'
  created_at INTEGER NOT NULL,
  resolved_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_seat_requests_account ON seat_requests(account_id);
CREATE INDEX IF NOT EXISTS idx_seat_requests_status ON seat_requests(status);

-- Migration 5 (superseded by migration 6 below): per-pupil report links via a
-- standalone token. Replaced once the school-admin dashboard itself moved in-app —
-- see migration 6.

-- Migration 6: retires migration 5's report_token. Once school-admin management
-- (formerly the separately-hosted /org page) became part of the same running app
-- the pupil plays in (WallabyMaths.jsx's OrgAdmin), there was no more "fresh tab
-- with no other way to carry credentials" problem for a report link to solve —
-- GET /org/seats/report just reuses the admin's ordinary bearer session instead,
-- same as every other /org/seats/* action.
DROP INDEX IF EXISTS idx_accounts_report_token;
ALTER TABLE accounts DROP COLUMN report_token;

-- Migration 7: school-only card trading. Open listings and pending offers reserve
-- one duplicate card each; completed swaps are applied to both profile progress
-- blobs together by the accounts Worker.
ALTER TABLE account_profiles ADD COLUMN revision INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS trade_listings (
  listing_id TEXT PRIMARY KEY,
  school_code TEXT NOT NULL,
  module_key TEXT NOT NULL,
  owner_account_id TEXT NOT NULL,
  owner_profile_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  accepted_offer_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  resolved_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trade_listings_board ON trade_listings(school_code, module_key, status, created_at);
CREATE INDEX IF NOT EXISTS idx_trade_listings_owner ON trade_listings(owner_account_id, status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_listings_one_card ON trade_listings(owner_profile_id, card_id) WHERE status = 'open';

CREATE TABLE IF NOT EXISTS trade_offers (
  offer_id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  bidder_account_id TEXT NOT NULL,
  bidder_profile_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  resolved_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trade_offers_listing ON trade_offers(listing_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_trade_offers_bidder ON trade_offers(bidder_account_id, status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_offers_one_per_listing ON trade_offers(listing_id, bidder_profile_id) WHERE status = 'pending';

-- ---------------------------------------------------------------------------
-- Migration 8: Joey multiplayer (JOEY_MULTIPLAYER_SPEC.md) — lobby presence,
-- challenges, and a D1 index over the authoritative match state, which itself
-- lives in a JoeyMatchRoom Durable Object (see cloudflare-worker/accounts/
-- joey-room.js), never in these tables. group_key is always server-derived
-- (family:{account_id} for a personal account, school:{school_code} for a
-- seat) and never trusted from a client — see joey-group.js.

-- One row per profile currently declaring itself ready (or mid-challenge) in
-- the Challenge Hall. Deliberately short-lived: expires_at is renewed by the
-- client every ~30s while the Hall is open, and the row is deleted outright
-- the moment readiness ends for any reason (see spec §5.1). deck_index is the
-- profile's chosen Joey deck slot at the moment of going ready; the deck
-- itself is re-resolved (and re-validated) from account_profiles.progress
-- fresh at challenge-accept time, never trusted from this row.
CREATE TABLE IF NOT EXISTS joey_presence (
  profile_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  deck_index INTEGER NOT NULL DEFAULT 0,
  state TEXT NOT NULL DEFAULT 'ready', -- 'ready' | 'challenging'
  created_at INTEGER NOT NULL,
  refreshed_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_joey_presence_lobby ON joey_presence(group_key, module_key, state, expires_at);

-- Challenge lifecycle per spec §6. One blocking challenge per profile is
-- enforced in application logic (joey-lobby.js), not a DB constraint, since
-- "blocking" depends on state, not just existence.
CREATE TABLE IF NOT EXISTS joey_challenges (
  challenge_id TEXT PRIMARY KEY,
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  challenger_account_id TEXT NOT NULL,
  challenger_profile_id TEXT NOT NULL,
  challenged_account_id TEXT NOT NULL,
  challenged_profile_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'pending', -- pending|accepted|declined|cancelled|expired|superseded|match_created
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  resolved_at INTEGER,
  match_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_joey_challenges_challenger ON joey_challenges(challenger_profile_id, state);
CREATE INDEX IF NOT EXISTS idx_joey_challenges_challenged ON joey_challenges(challenged_profile_id, state);

-- Recoverable index over live/completed matches. authoritative_state never
-- lives here — this is purely so `/joey/matches/current` can find which
-- Durable Object to ask without scanning every room, and so a finished
-- match's headline result can be queried after the room itself is torn down.
CREATE TABLE IF NOT EXISTS joey_matches (
  match_id TEXT PRIMARY KEY,
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  side_a_account_id TEXT NOT NULL,
  side_a_profile_id TEXT NOT NULL,
  side_b_account_id TEXT NOT NULL,
  side_b_profile_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active|completed|abandoned
  winner_side TEXT,
  completion_reason TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_joey_matches_group ON joey_matches(group_key, status);

-- Enforces "at most one live match per profile" (spec §17) as a real PK
-- constraint rather than an application-level race: both sides' rows are
-- inserted in the same D1 batch that creates the match, so a profile already
-- holding a row makes the whole batch fail and the accept is refused. Removed
-- for both profiles the moment the match ends (completed or abandoned).
CREATE TABLE IF NOT EXISTS joey_active_match (
  profile_id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  side TEXT NOT NULL, -- 'side_a' | 'side_b'
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_joey_active_match_match ON joey_active_match(match_id);

-- Optional post-match summary (spec §18) — never the full battle state, no
-- hidden hand/Reserve Deck history, just enough for future stats/achievements.
CREATE TABLE IF NOT EXISTS joey_match_results (
  match_id TEXT PRIMARY KEY,
  module_key TEXT NOT NULL,
  side_a_profile_id TEXT NOT NULL,
  side_b_profile_id TEXT NOT NULL,
  winner_side TEXT,
  completion_reason TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER NOT NULL
);
