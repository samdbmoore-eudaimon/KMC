/* Wallaby Maths parent-account worker: magic-link auth, offline-verifiable
   entitlement certificates, licence-batch/gift redemption, and an internal
   admin page. Separate deployment from kq-sync (device progress sync) —
   this owns accounts/subscriptions, kq-sync keeps owning progress blobs.

   Credential model: a PASSWORD is the real, brute-force-resistant credential —
   it creates the account, logs a brand-new device/browser into an existing one,
   and is required to recover a forgotten PIN. A PIN is deliberately weaker but
   only ever usable on a device that's ALREADY authenticated by password — it
   gates the Account screen (personal) or the /org management page (group admin)
   locally, and can never by itself log a new device in. Pupils are the one
   exception: no password, just a school name + generated username + an 8-digit
   PIN, since there's no payment/account-page behind a seat to protect and it
   needs to be simple for a child to type — see handleSchoolLogin.

   Entitlement model: rather than the app checking in on every launch, we
   hand it a signed certificate (Ed25519) it can verify itself, completely
   offline, for up to 365 days. Whenever the device happens to be online —
   piggybacked on the existing progress sync — it can silently ask for a
   fresh one via /entitlement. Never syncing again after account creation
   still works for the full 365 days; only past that does it need to
   reconnect, and even then it falls back to freemium locally, never a hard
   lock. See wm-entitlement.js on the app side for the verifying half. */

// Same word lists/generator the app uses for a player's own random display name
// (see wm-names.js) — reused here for pupil usernames so "the 3-word method" is
// literally one implementation, not two lists to keep in sync.
import { randomDisplayName } from "../../wm-names.js";
import { TRADE_LIMITS, TRADE_MODULES, isTradeableDuplicate, ownedCardCount, tradeCardModule } from "../../wm-trading.js";
import {
  handleJoeyLobby, handleJoeyLobbyReady, handleJoeyLobbyNotReady,
  handleJoeyCreateChallenge, handleJoeyAcceptChallenge, handleJoeyDeclineChallenge, handleJoeyCancelChallenge,
} from "./joey-lobby.js";
import {
  handleJoeyCurrentMatch, handleJoeyGetMatch, handleJoeyMulligan, handleJoeyActions, handleJoeyConcede, handleJoeyMatchEvents,
} from "./joey-match.js";
// Re-exported so wrangler.toml's durable_objects binding (class_name =
// "JoeyMatchRoom") can find the class in this Worker's main script.
export { JoeyMatchRoom } from "./joey-room.js";

const TRIAL_DAYS = 7;
// A self-service school signup's starting capacity/plan — no payment exists yet
// (Paddle isn't wired up), so this is a genuine free trial, sized enough for a
// teacher to actually try it with a small class, not just kick the tyres. Growing
// past it is a request Sam approves from /admin (see seat_requests), not instant.
const SCHOOL_TRIAL_SEATS = 5;
const SCHOOL_TRIAL_DAYS = 30;
const CERT_VALID_DAYS = 365;
const SESSION_DAYS = 90;
const MAGIC_LINK_TTL_MINUTES = 15;
const RENEWAL_GRACE_DAYS = 7; // failed-payment grace period, brief §7.1
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_MS = 24 * 60 * 60 * 1000;

export function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Key");
  return res;
}
export function json(body, status = 200) {
  return cors(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
}
function html(body, status = 200) {
  return cors(new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8" } }));
}
export function uuid() { return crypto.randomUUID(); }
function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Buffer.from(arr).toString("hex");
}
// Human-typeable licence code, excludes visually-ambiguous characters (0/O, 1/I/L).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function randomLicenceCode() {
  const pick = () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  const group = () => Array.from({ length: 4 }, pick).join("");
  return `WM-${group()}-${group()}`;
}
function b64url(bytes) { return Buffer.from(bytes).toString("base64url"); }

// Personal/admin local PIN (Account screen / /org quick-gate) — 4-8 digits, never
// used to authenticate a brand-new device. Pupil PINs are fixed at 8 digits since
// that's the pupil's ONLY credential (no password) — see SEAT_PIN_RE.
const PIN_RE = /^[0-9]{4,8}$/;
const SEAT_PIN_RE = /^[0-9]{8}$/;
// Admin-chosen (or auto-generated) school identifier — lowercase letters/digits/
// hyphens, so "st-marys-primary" and "ST-MARYS-PRIMARY" are the same account.
const SCHOOL_CODE_RE = /^[a-z0-9-]{3,30}$/;
// The real credential (personal + group) needs to actually resist brute-forcing —
// 12+ chars with a mix of cases, digits and symbols. Checked wherever a password is
// actually SET (signup, change, email-link recovery) — never re-enforced
// retroactively just to verify an existing login, so nobody gets locked out of an
// account by a policy that didn't exist when they created it.
const PASSWORD_MIN_LENGTH = 12;
function isStrongPassword(password) {
  return password.length >= PASSWORD_MIN_LENGTH
    && /[a-z]/.test(password) && /[A-Z]/.test(password)
    && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}
const LOGIN_RATE_LIMIT = 10; // per email/username, per window — guards online credential guessing
const AUTH_ATTEMPT_WINDOW_MINUTES = 15;
// Provisioned school seats get an accounts row shaped exactly like a personal account
// (see getOrCreateAccount/issueCertificateFor) so the whole entitlement/cert pipeline
// works unchanged for them — this synthetic address is never emailed to.
const SEAT_EMAIL_DOMAIN = "seats.wallabymaths.internal";

/* ---------------- password hashing (personal & group accounts) ---------------- */
async function pbkdf2Bits(password, saltBytes) {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
  return new Uint8Array(bits);
}
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2Bits(password, salt);
  return { hash: Buffer.from(hash).toString("hex"), salt: Buffer.from(salt).toString("hex") };
}
async function verifyPassword(password, saltHex, hashHex) {
  if (!saltHex || !hashHex) return false;
  const hash = await pbkdf2Bits(password, Buffer.from(saltHex, "hex"));
  return Buffer.from(hash).toString("hex") === hashHex;
}

/* ---------------- PIN hashing (personal & seat accounts) ----------------
   Deliberately plain SHA-256(salt + pin), not PBKDF2 — a 4-8 digit PIN's entire
   keyspace is tiny either way, and this exact algorithm has to be reproduced
   client-side (wm-pin.js) for fully-offline verification against the cert, so it's
   kept as simple as possible to keep both implementations trivially identical. */
async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hashPin(pin) {
  const salt = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("hex");
  const hash = await sha256Hex(salt + pin);
  return { hash, salt };
}
async function verifyPin(pin, saltHex, hashHex) {
  if (!saltHex || !hashHex) return false;
  return (await sha256Hex(saltHex + pin)) === hashHex;
}

/* ---------------- recoverable seat PINs ----------------
   pin_hash/pin_salt above are one-way, by design, for the online school-pupil LOGIN
   check — but a school buys seats in bulk well before it knows which child gets which,
   so someone there needs to come back and hand out "username: X, PIN: Y" slips over the
   following days or weeks, not just once at the moment of creation. So a seat's PIN is
   ALSO kept recoverable, AES-256-GCM encrypted at rest under a Worker secret
   (SEAT_PIN_KEY, raw 32 random bytes, base64) rather than plaintext — protects it from a
   bare DB dump without needing the pupil to re-authenticate to see it again, the way a
   real password would. Set the secret once with:
     openssl rand -base64 32 | npx wrangler secret put SEAT_PIN_KEY */
async function getSeatPinKey(env) {
  const raw = Buffer.from(env.SEAT_PIN_KEY, "base64");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function encryptPin(env, pin) {
  const key = await getSeatPinKey(env);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(pin));
  return Buffer.from(iv).toString("base64") + ":" + Buffer.from(ciphertext).toString("base64");
}
async function decryptPin(env, encrypted) {
  if (!encrypted) return null;
  const [ivB64, ctB64] = encrypted.split(":");
  if (!ivB64 || !ctB64) return null;
  try {
    const key = await getSeatPinKey(env);
    const iv = Buffer.from(ivB64, "base64");
    const ciphertext = Buffer.from(ctB64, "base64");
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return new TextDecoder().decode(plain);
  } catch (e) {
    return null; // wrong/missing key, or corrupt data — never throw into a listing endpoint
  }
}

/* ---------------- rate limiting (D1-backed, see auth_attempts) ---------------- */
async function checkAndLogAuthAttempt(env, email, kind, max) {
  const since = Date.now() - AUTH_ATTEMPT_WINDOW_MINUTES * 60 * 1000;
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM auth_attempts WHERE email=? AND kind=? AND created_at > ?"
  ).bind(email, kind, since).first();
  if (recent.n >= max) return false;
  await env.DB.prepare("INSERT INTO auth_attempts (email, kind, created_at) VALUES (?,?,?)").bind(email, kind, Date.now()).run();
  return true;
}

/* ---------------- entitlement certificates ---------------- */
async function importPrivateKey(env) {
  const der = Buffer.from(env.ENTITLEMENT_PRIVATE_KEY, "base64");
  return crypto.subtle.importKey("pkcs8", der, { name: "Ed25519" }, false, ["sign"]);
}
async function signCertificate(env, payload) {
  const key = await importPrivateKey(env);
  const payloadB64 = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("Ed25519", key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${b64url(new Uint8Array(sig))}`;
}

// Lazily resolves what an account is *actually* entitled to right now — trial/
// subscription expiry is computed on read rather than needing a cron to flip
// statuses. Writes the transition back to D1 the first time it's observed so
// admin views stay accurate, but the return value is always authoritative.
export async function effectiveEntitlement(env, account) {
  const now = Date.now();
  let { subscription_status: status, subscription_plan: plan, subscription_expires_at: expiresAt } = account;

  if (status === "trialing" && account.trial_expires_at && now > account.trial_expires_at) {
    status = "freemium"; plan = null; expiresAt = null;
  } else if (status === "active" && expiresAt && now > expiresAt + RENEWAL_GRACE_DAYS * DAY_MS) {
    status = "freemium"; plan = null; expiresAt = null;
  } else if (status === "cancelled" && expiresAt && now > expiresAt) {
    status = "freemium"; plan = null; expiresAt = null;
  }

  if (status !== account.subscription_status) {
    await env.DB.prepare(
      "UPDATE accounts SET subscription_status=?, subscription_plan=?, subscription_expires_at=?, updated_at=? WHERE account_id=?"
    ).bind(status, plan, expiresAt, now, account.account_id).run();
  }
  return { status, plan, expiresAt, trialExpiresAt: account.trial_expires_at };
}

async function issueCertificateFor(env, account) {
  const { status, plan, expiresAt, trialExpiresAt } = await effectiveEntitlement(env, account);
  const now = Date.now();
  const payload = {
    account_id: account.account_id,
    status,
    plan,
    plan_expires_at: expiresAt,
    trial_expires_at: trialExpiresAt,
    issued_at: now,
    valid_until: now + CERT_VALID_DAYS * DAY_MS,
    // Carried so a personal account's device (already holding this cached,
    // signature-verified cert) can check a locally-typed PIN entirely offline
    // (hash it, compare to pin_hash here) when re-opening its Account screen — see
    // wm-pin.js. Pupils never use this for local gating at all (no Account screen —
    // see WallabyMaths.jsx); it's harmless to carry unconditionally regardless.
    account_type: account.account_type || "personal",
    pin_hash: account.pin_hash || null,
    pin_salt: account.pin_salt || null,
  };
  const certificate = await signCertificate(env, payload);
  return { certificate, status, plan, expires_at: expiresAt };
}

/* ---------------- email (Resend) ---------------- */
async function sendEmail(env, { to, subject, text }) {
  if (!env.RESEND_API_KEY) return { sent: false, reason: "no_resend_key" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.FROM_EMAIL || "hello@wallabymaths.app", to, subject, text }),
  });
  return { sent: res.ok, reason: res.ok ? null : `resend_http_${res.status}` };
}

/* ---------------- account helpers ---------------- */
async function getOrCreateAccount(env, email) {
  const existing = await env.DB.prepare("SELECT * FROM accounts WHERE email=?").bind(email).first();
  if (existing) return existing;
  const now = Date.now();
  const account = {
    account_id: uuid(), email, email_verified: 0, created_at: now,
    trial_started_at: null, trial_expires_at: null,
    subscription_status: "trialing", subscription_plan: null, subscription_expires_at: null,
    paddle_customer_id: null, marketing_consent: 0, updated_at: now,
  };
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
      subscription_status, subscription_plan, subscription_expires_at, paddle_customer_id, marketing_consent, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(account.account_id, account.email, 0, now, null, null, "trialing", null, null, null, 0, now).run();
  return account;
}

// Provisions one pupil seat directly (never "redeemed" — the school/admin creates it
// up front, see handleAdminGroupAccountCreate/handleOrgSeatCreate) — same row shape as
// a personal account (so the entitlement/cert pipeline needs no seat-specific
// branches) but with a synthetic, never-emailed address, account_type='seat', and the
// school_code+username pair a pupil actually logs in with (see handleSchoolLogin).
// Inherits the owning batch's plan/expiry immediately — a school's one purchase
// covers every seat, there's no per-pupil payment step.
async function createSeatAccount(env, batch, schoolCode, username, pin, seatLabel) {
  const now = Date.now();
  const accountId = uuid();
  const email = `seat-${accountId}@${SEAT_EMAIL_DOMAIN}`;
  const { hash, salt } = await hashPin(pin);
  const pinEnc = await encryptPin(env, pin);
  const isLifetime = batch.plan === "lifetime";
  const expiresAt = isLifetime ? null : batch.expiry_mode === "fixed_date"
    ? Date.parse(batch.expiry_value)
    : now + parseInt(batch.expiry_value, 10) * DAY_MS;
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
      subscription_status, subscription_plan, subscription_expires_at, paddle_customer_id, marketing_consent, updated_at,
      account_type, pin_hash, pin_salt, pin_enc, group_batch_id, school_code, username, seat_label)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, email, 1, now, null, null, isLifetime ? "lifetime" : "active", batch.plan, expiresAt, null, 0, now,
    "seat", hash, salt, pinEnc, batch.batch_id, schoolCode, username, seatLabel || null).run();
  return env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(accountId).first();
}

// A pupil username, generated the same way a player's own in-app display name is
// (three random words — see wm-names.js) rather than a sequential "school-001",
// lowercased+hyphenated for a login field. Only needs to be unique WITHIN this
// school (see idx_accounts_username_school), so a handful of retries on collision
// is enough even for a large school; the numbered fallback only matters in the
// astronomically unlikely case all retries collide.
async function randomSeatUsername(env, schoolCode) {
  const slugify = (s) => s.toLowerCase().replace(/\s+/g, "-");
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = slugify(randomDisplayName());
    const exists = await env.DB.prepare("SELECT 1 FROM accounts WHERE school_code=? AND username=?").bind(schoolCode, candidate).first();
    if (!exists) return candidate;
  }
  return `${slugify(randomDisplayName())}-${Math.floor(Math.random() * 1000)}`;
}
// The pupil's ONLY credential (no password) — 8 digits, so its keyspace stands in
// for what a password would otherwise provide.
function randomSeatPin() { return String(Math.floor(10000000 + Math.random() * 90000000)); }
// Admin-chosen (or, if omitted, auto-generated) school identifier — validated/
// normalized by validateOrGenerateSchoolCode below, not used directly.
function randomSchoolCode() {
  return Array.from({ length: 6 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join("").toLowerCase();
}
// Accepts an admin-chosen school identifier if given (validating format + that it's
// not already taken), else auto-generates and retries on the astronomically
// unlikely collision. Either way returns a normalized lowercase code.
async function validateOrGenerateSchoolCode(env, requested) {
  if (requested) {
    const normalized = requested.trim().toLowerCase();
    if (!SCHOOL_CODE_RE.test(normalized)) return { error: "bad_school_code" };
    const taken = await env.DB.prepare("SELECT 1 FROM accounts WHERE school_code=? AND account_type='group'").bind(normalized).first();
    if (taken) return { error: "school_code_in_use" };
    return { code: normalized };
  }
  let code;
  do { code = randomSchoolCode(); }
  while (await env.DB.prepare("SELECT 1 FROM accounts WHERE school_code=? AND account_type='group'").bind(code).first());
  return { code };
}

async function accountForSessionToken(env, token) {
  if (!token) return null;
  const session = await env.DB.prepare("SELECT * FROM sessions WHERE token=?").bind(token).first();
  if (!session || session.expires_at < Date.now()) return null;
  return env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(session.account_id).first();
}
export async function sessionAccount(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  return accountForSessionToken(env, token);
}

async function createSession(env, accountId) {
  const token = randomToken();
  const now = Date.now();
  await env.DB.prepare("INSERT INTO sessions (token, account_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(token, accountId, now, now + SESSION_DAYS * DAY_MS).run();
  return token;
}
// Recorded on every successful LOGIN (not signup — a brand-new account has
// obviously never been used yet) so a school's own /org dashboard, and Sam's
// /admin, can show whether a seat has actually been played on and when last —
// see handleOrgSeats/handleAdminSchoolSeats.
async function touchLastLogin(env, accountId) {
  await env.DB.prepare("UPDATE accounts SET last_login_at=? WHERE account_id=?").bind(Date.now(), accountId).run();
}

/* ---------------- routes ---------------- */
// "Forgot your password" recovery — works for personal accounts (forgot the real
// login credential) and group admins alike, since both now have a password. Not
// used for a merely-forgotten local PIN (see handleResetPinWithPassword for that —
// no email needed there, re-entering the password proves who you are directly).
// Deliberately returns the same {ok:true} whether or not an account exists for that
// email, so this can't be used to probe which emails have accounts — a link is only
// actually created/sent when one does.
async function handleForgotPassword(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "bad_email" }, 400);

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM magic_links WHERE email=? AND created_at > ?"
  ).bind(email, Date.now() - 15 * 60 * 1000).first();
  if (recent.n >= 5) return json({ ok: false, error: "rate_limited" }, 429);

  const account = await env.DB.prepare("SELECT * FROM accounts WHERE email=? AND account_type IN ('personal','group')").bind(email).first();
  if (account) {
    const token = randomToken();
    const now = Date.now();
    await env.DB.prepare(
      "INSERT INTO magic_links (token, poll_id, email, created_at, expires_at, used_at, session_token, purpose) VALUES (?,?,?,?,?,?,?,?)"
    ).bind(token, randomToken(16), email, now, now + MAGIC_LINK_TTL_MINUTES * 60 * 1000, null, null, "set_password").run();
    const confirmUrl = `${new URL(request.url).origin}/confirm?token=${token}`;
    const emailResult = await sendEmail(env, {
      to: email,
      subject: "Reset your Wallaby Maths password",
      text: `Tap this link to set a new password: ${confirmUrl}\n\nThis link works for ${MAGIC_LINK_TTL_MINUTES} minutes and can only be used once.`,
    });
    if (!emailResult.sent) return json({ ok: true, debug_confirm_url: confirmUrl }); // only ever present with no RESEND_API_KEY configured
  }
  return json({ ok: true });
}

// Set/reset a password via a one-off emailed link — the ONE flow shared by three
// moments: a group account's initial setup (minted by
// handleAdminGroupAccountCreate), a group admin's forgotten password, and a
// personal account's forgotten password (both via handleForgotPassword). All three
// are "prove you own this email, then set a password" — identical operation
// regardless of which of those brought you here, so one branch handles all of them.
async function handleConfirm(request, env) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const link = await env.DB.prepare("SELECT * FROM magic_links WHERE token=?").bind(token).first();
  const fail = (msg) => html(`<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;text-align:center;padding:60px 20px"><h2>${msg}</h2><p>Go back to the app and request a new link.</p></body>`, 400);
  if (!link) return fail("That link isn't valid.");
  if (link.used_at) return fail("That link has already been used.");
  if (link.expires_at < Date.now()) return fail("That link has expired.");

  if (request.method === "POST") {
    const body = await request.json().catch(() => null);
    const password = String(body?.password || "");
    if (!isStrongPassword(password)) return json({ ok: false, error: "weak_password" }, 400);
    const account = await env.DB.prepare("SELECT * FROM accounts WHERE email=?").bind(link.email).first();
    if (!account) return json({ ok: false, error: "account_not_found" }, 404);
    const { hash, salt } = await hashPassword(password);
    await env.DB.prepare("UPDATE accounts SET password_hash=?, password_salt=?, email_verified=1, updated_at=? WHERE account_id=?")
      .bind(hash, salt, Date.now(), account.account_id).run();
    await env.DB.prepare("UPDATE magic_links SET used_at=? WHERE token=?").bind(Date.now(), token).run();
    return json({ ok: true });
  }
  return html(`<!doctype html><meta charset="utf-8"><title>Set your Wallaby Maths password</title>
    <body style="font-family:sans-serif;max-width:420px;margin:60px auto;padding:0 20px">
    <h2>Set a password</h2>
    <p>Choose a password for <b>${link.email}</b>. Head back to the app (or
    <code>/org</code> if this is a school account) and sign in with it.</p>
    <p style="color:#555;font-size:13px">Needs to be at least ${PASSWORD_MIN_LENGTH} characters, with an
    uppercase letter, a lowercase letter, a number, and a symbol.</p>
    <input id="pw" type="password" autocomplete="new-password" placeholder="New password" style="width:100%;padding:10px;font-size:15px;margin-bottom:10px;box-sizing:border-box">
    <button onclick="submitPw()" style="padding:10px 16px;font-size:15px;cursor:pointer">Set password</button>
    <p id="msg"></p>
    <script>
      async function submitPw() {
        const password = document.getElementById('pw').value;
        const res = await fetch(window.location.href, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ password }) });
        const data = await res.json();
        document.getElementById('msg').textContent = data.ok ? 'Password set! Head back and sign in with it.' : (data.error === 'weak_password' ? 'That password doesn\\'t meet the requirements above.' : (data.error || 'Something went wrong.'));
      }
    </script></body>`);
}

async function handleEntitlement(request, env) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const cert = await issueCertificateFor(env, account);
  return json({ ok: true, ...cert });
}

async function handleRedeem(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const code = String(body?.code || "").trim().toUpperCase();
  if (!EMAIL_RE.test(email) || !code) return json({ ok: false, error: "bad_input" }, 400);

  const licence = await env.DB.prepare("SELECT * FROM licence_codes WHERE code=?").bind(code).first();
  if (!licence) return json({ ok: false, error: "code_not_found" }, 404);
  if (licence.redeemed_at) return json({ ok: false, error: "already_redeemed" }, 409);
  const batch = await env.DB.prepare("SELECT * FROM licence_batches WHERE batch_id=?").bind(licence.batch_id).first();
  if (!batch || batch.credits_used >= batch.total_credits) return json({ ok: false, error: "batch_exhausted" }, 409);

  const now = Date.now();
  // A lifetime plan never expires — full stop, regardless of whatever expiry_mode/value the
  // batch happens to carry (the admin UI shouldn't even ask for one, but this is the backstop).
  const isLifetime = batch.plan === "lifetime";
  const expiresAt = isLifetime ? null : batch.expiry_mode === "fixed_date"
    ? Date.parse(batch.expiry_value)
    : now + parseInt(batch.expiry_value, 10) * DAY_MS;

  const account = await getOrCreateAccount(env, email);
  await env.DB.prepare(
    "UPDATE accounts SET email_verified=1, subscription_status=?, subscription_plan=?, subscription_expires_at=?, updated_at=? WHERE account_id=?"
  ).bind(isLifetime ? "lifetime" : "active", batch.plan, expiresAt, now, account.account_id).run();
  await env.DB.prepare("UPDATE licence_codes SET redeemed_by_account_id=?, redeemed_at=? WHERE code=?")
    .bind(account.account_id, now, code).run();
  await env.DB.prepare("UPDATE licence_batches SET credits_used = credits_used + 1 WHERE batch_id=?").bind(batch.batch_id).run();

  const sessionToken = await createSession(env, account.account_id);
  const fresh = await env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(account.account_id).first();
  const cert = await issueCertificateFor(env, fresh);
  return json({ ok: true, session_token: sessionToken, account_id: account.account_id, ...cert });
}

async function handleDelete(request, env) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  await env.DB.batch([
    env.DB.prepare("UPDATE licence_codes SET redeemed_by_account_id=NULL WHERE redeemed_by_account_id=?").bind(account.account_id),
    env.DB.prepare("DELETE FROM sessions WHERE account_id=?").bind(account.account_id),
    env.DB.prepare("DELETE FROM magic_links WHERE email=?").bind(account.email),
    env.DB.prepare("DELETE FROM accounts WHERE account_id=?").bind(account.account_id),
  ]);
  return json({ ok: true });
}

/* ---------------- local PIN (Account screen / /org quick-gate) ---------------- */
// Changes an ALREADY-LOGGED-IN account's PIN — either the "set a quick PIN" step
// right after first password login/signup, or a deliberate change later from the
// Account screen / /org. Never part of signup or of logging a NEW device in — see
// handleLogin/handleOrgLogin for that, and handleResetPinWithPassword for "I forgot
// my PIN but still know my password."
async function handleSetPin(request, env) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const pin = String(body?.pin || "");
  if (!PIN_RE.test(pin)) return json({ ok: false, error: "bad_input" }, 400);
  const { hash, salt } = await hashPin(pin);
  await env.DB.prepare("UPDATE accounts SET pin_hash=?, pin_salt=?, updated_at=? WHERE account_id=?")
    .bind(hash, salt, Date.now(), account.account_id).run();
  const fresh = await env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(account.account_id).first();
  const cert = await issueCertificateFor(env, fresh);
  return json({ ok: true, ...cert });
}

// Changes an ALREADY-LOGGED-IN account's password (an Account-screen/`/org` settings
// action) — separate from handleConfirm's email-link version, which is for when you
// don't have a session to prove who you are.
async function handleSetPassword(request, env) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const password = String(body?.password || "");
  if (!isStrongPassword(password)) return json({ ok: false, error: "weak_password" }, 400);
  const { hash, salt } = await hashPassword(password);
  await env.DB.prepare("UPDATE accounts SET password_hash=?, password_salt=?, updated_at=? WHERE account_id=?")
    .bind(hash, salt, Date.now(), account.account_id).run();
  return json({ ok: true });
}

// "I forgot my local PIN, but I still know my password" — re-proves identity with
// the password (online, this once) and sets a new PIN directly, no email round trip
// needed. Works for personal accounts (returns a fresh cert so the app's cache picks
// up the new PIN immediately) and group admins (no cert concept — /org just asks
// them to re-enter the new PIN next time it shows the quick-gate).
async function handleResetPinWithPassword(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const newPin = String(body?.new_pin || "");
  if (!EMAIL_RE.test(email) || !password || !PIN_RE.test(newPin)) return json({ ok: false, error: "bad_input" }, 400);
  if (!(await checkAndLogAuthAttempt(env, email, "reset_pin_pw", LOGIN_RATE_LIMIT))) return json({ ok: false, error: "rate_limited" }, 429);

  const account = await env.DB.prepare("SELECT * FROM accounts WHERE email=?").bind(email).first();
  if (!account || !(await verifyPassword(password, account.password_salt, account.password_hash))) {
    return json({ ok: false, error: "invalid_credentials" }, 401);
  }
  const { hash, salt } = await hashPin(newPin);
  await env.DB.prepare("UPDATE accounts SET pin_hash=?, pin_salt=?, updated_at=? WHERE account_id=?").bind(hash, salt, Date.now(), account.account_id).run();
  if (account.account_type === "personal") {
    const fresh = await env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(account.account_id).first();
    const cert = await issueCertificateFor(env, fresh);
    return json({ ok: true, ...cert });
  }
  return json({ ok: true });
}

// THE personal-account signup front door — creates a brand-new account, trial
// starting immediately (no email click needed to play at all). Fails clearly if the
// email already has an account of any kind, rather than silently logging into it —
// that's handleLogin's job, matching the client's separate "Create a new account"
// vs "I already have one" buttons (see AccountGate), so a mistyped email while
// signing up can't end up shadowing or failing into somebody else's account. The
// welcome/verification email is sent best-effort in the background purely so
// "forgot my password" (handleForgotPassword) has somewhere to go later — it is
// never a gate in front of play.
async function handleSignup(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "bad_input" }, 400);
  if (!isStrongPassword(password)) return json({ ok: false, error: "weak_password" }, 400);
  if (!(await checkAndLogAuthAttempt(env, email, "signup", LOGIN_RATE_LIMIT))) return json({ ok: false, error: "rate_limited" }, 429);

  const existing = await env.DB.prepare("SELECT 1 FROM accounts WHERE email=?").bind(email).first();
  if (existing) return json({ ok: false, error: "email_in_use" }, 409);

  const now = Date.now();
  const { hash, salt } = await hashPassword(password);
  const accountId = uuid();
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
      subscription_status, subscription_plan, subscription_expires_at, paddle_customer_id, marketing_consent, updated_at,
      account_type, password_hash, password_salt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, email, 0, now, now, now + TRIAL_DAYS * DAY_MS, "trialing", null, null, null, 0, now, "personal", hash, salt).run();
  const account = await env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(accountId).first();
  sendEmail(env, {
    to: email,
    subject: "Welcome to Wallaby Maths",
    text: "Your account is ready — you're already playing! Keep this email so you can reset your password later if you ever forget it.",
  }).catch(() => {});

  const sessionToken = await createSession(env, accountId);
  const cert = await issueCertificateFor(env, account);
  return json({ ok: true, session_token: sessionToken, account_id: accountId, ...cert });
}

// THE personal-account login front door — logs an EXISTING account into a new
// device (the password is the real credential; a local PIN isn't even collected at
// this step — the app prompts to set one, via handleSetPin, only once this
// succeeds and none exists yet, see WallabyMaths.jsx AccountGate). Fails clearly if
// the email has no account at all, rather than silently creating one — that's
// handleSignup's job.
async function handleLogin(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (!EMAIL_RE.test(email) || !password) return json({ ok: false, error: "bad_input" }, 400);
  if (!(await checkAndLogAuthAttempt(env, email, "login", LOGIN_RATE_LIMIT))) return json({ ok: false, error: "rate_limited" }, 429);

  const account = await env.DB.prepare("SELECT * FROM accounts WHERE email=?").bind(email).first();
  if (!account || account.account_type !== "personal") {
    return json({ ok: false, error: account?.account_type === "group" ? "wrong_account_type" : "account_not_found" }, 404);
  }
  if (!(await verifyPassword(password, account.password_salt, account.password_hash))) {
    return json({ ok: false, error: "invalid_credentials" }, 401);
  }

  await touchLastLogin(env, account.account_id);
  const sessionToken = await createSession(env, account.account_id);
  const cert = await issueCertificateFor(env, account);
  return json({ ok: true, session_token: sessionToken, account_id: account.account_id, ...cert });
}

// A teacher setting up their own school — the self-service counterpart to Sam
// manually running handleAdminGroupAccountCreate from /admin. Creates the group
// account with its password set immediately (no magic-link round trip needed,
// unlike Sam's version, since the admin is typing their own password right here)
// plus one small free-trial batch (SCHOOL_TRIAL_SEATS/SCHOOL_TRIAL_DAYS) — pupil
// seats within it are only created on demand via /org's existing "Add a new
// pupil", not pre-generated, since there's no purchase yet saying how many are
// really needed. Deliberately returns no session/cert for the personal app side:
// a school admin doesn't play the app themselves, they manage seats at /org —
// see ORG_URL_HINT in the response for the app to link them straight there.
async function handleSchoolAdminSignup(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const label = String(body?.label || "").trim().slice(0, 120);
  if (!EMAIL_RE.test(email) || !label) return json({ ok: false, error: "bad_input" }, 400);
  if (!isStrongPassword(password)) return json({ ok: false, error: "weak_password" }, 400);
  if (!(await checkAndLogAuthAttempt(env, email, "school_admin_signup", LOGIN_RATE_LIMIT))) return json({ ok: false, error: "rate_limited" }, 429);

  const existing = await env.DB.prepare("SELECT 1 FROM accounts WHERE email=?").bind(email).first();
  if (existing) return json({ ok: false, error: "email_in_use" }, 409);

  const codeResult = await validateOrGenerateSchoolCode(env, body?.school_code ? String(body.school_code) : null);
  if (codeResult.error) return json({ ok: false, error: codeResult.error }, 400);
  const schoolCode = codeResult.code;

  const now = Date.now();
  const accountId = uuid();
  const { hash, salt } = await hashPassword(password);
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
      subscription_status, subscription_plan, subscription_expires_at, paddle_customer_id, marketing_consent, updated_at,
      account_type, password_hash, password_salt, school_code)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, email, 1, now, now, now + SCHOOL_TRIAL_DAYS * DAY_MS, "trialing", null, null, null, 0, now, "group", hash, salt, schoolCode).run();

  const batchId = uuid();
  await env.DB.prepare(
    "INSERT INTO licence_batches (batch_id, label, plan, total_credits, credits_used, expiry_mode, expiry_value, created_at, note, owner_account_id) VALUES (?,?,?,?,0,?,?,?,?,?)"
  ).bind(batchId, label, "trial", SCHOOL_TRIAL_SEATS, "days_from_redemption", String(SCHOOL_TRIAL_DAYS), now, "self-service trial", accountId).run();

  return json({ ok: true, school_code: schoolCode, trial_seats: SCHOOL_TRIAL_SEATS, trial_days: SCHOOL_TRIAL_DAYS });
}

// The school-pupil front door: school name + username + 8-digit PIN, all three
// issued by the school up front (see handleAdminGroupAccountCreate/
// handleOrgSeatCreate) — nothing is ever created here, only logged into, since a
// pupil never signs themselves up and has no password. Same certificate/offline
// model as personal accounts, so the same pupil can log in from a school machine
// today and a home machine tomorrow. Deliberately no local re-gating on this
// credential after login — pupils have no Account screen at all (see
// WallabyMaths.jsx); only the school's own admin login (handleOrgLogin) manages
// anything, from the separate /org portal.
async function handleSchoolLogin(request, env) {
  const body = await request.json().catch(() => null);
  const schoolCode = String(body?.school_code || "").trim().toLowerCase();
  const username = String(body?.username || "").trim().toLowerCase();
  const pin = String(body?.pin || "");
  if (!schoolCode || !username || !SEAT_PIN_RE.test(pin)) return json({ ok: false, error: "bad_input" }, 400);
  const rateKey = `${schoolCode}:${username}`;
  if (!(await checkAndLogAuthAttempt(env, rateKey, "school_login", LOGIN_RATE_LIMIT))) return json({ ok: false, error: "rate_limited" }, 429);

  const account = await env.DB.prepare(
    "SELECT * FROM accounts WHERE account_type='seat' AND school_code=? AND username=?"
  ).bind(schoolCode, username).first();
  if (!account || !(await verifyPin(pin, account.pin_salt, account.pin_hash))) return json({ ok: false, error: "invalid_credentials" }, 401);

  await touchLastLogin(env, account.account_id);
  const sessionToken = await createSession(env, account.account_id);
  const cert = await issueCertificateFor(env, account);
  return json({ ok: true, session_token: sessionToken, account_id: account.account_id, ...cert });
}

/* ---------------- Google sign-in (personal accounts) ----------------
   A THIRD way into a personal account, alongside email+password — not the same
   OAuth use as googleDriveSync.js on the app side (that one deliberately never
   requests email, since it's just an anonymous Drive-appdata file). This flow
   requests the `email` scope on purpose, because proving which email owns the
   Google account IS the point — same public client_id, different scope/purpose. */
const GOOGLE_CLIENT_ID = "325077206513-8ouriudnhghb7nunsncgtge23mjp78qj.apps.googleusercontent.com";

// Verifies the access token by asking Google itself who it belongs to — simpler
// and just as trustworthy as validating a JWT's signature locally, since a forged
// or expired token is simply rejected by Google's own endpoint (401/other error).
async function verifyGoogleAccessToken(accessToken) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const info = await res.json();
  if (!info.email || (info.email_verified !== true && info.email_verified !== "true")) return null;
  return { email: String(info.email).trim().toLowerCase(), sub: String(info.sub || "") };
}

// Creates or logs into a personal account via a Google-verified email — the
// create-or-login ambiguity that email+password can't safely have (see
// handleSignup/handleLogin) is fine here, because Google's own email_verified
// claim is real proof of ownership, equivalent to a clicked magic link.
async function handleGoogleLogin(request, env) {
  const body = await request.json().catch(() => null);
  const accessToken = String(body?.access_token || "");
  if (!accessToken) return json({ ok: false, error: "bad_input" }, 400);
  const info = await verifyGoogleAccessToken(accessToken);
  if (!info) return json({ ok: false, error: "invalid_token" }, 401);

  let account = await env.DB.prepare("SELECT * FROM accounts WHERE email=? OR google_sub=?").bind(info.email, info.sub).first();
  if (!account) {
    const now = Date.now();
    const accountId = uuid();
    await env.DB.prepare(
      `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
        subscription_status, subscription_plan, subscription_expires_at, paddle_customer_id, marketing_consent, updated_at,
        account_type, google_sub)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(accountId, info.email, 1, now, now, now + TRIAL_DAYS * DAY_MS, "trialing", null, null, null, 0, now, "personal", info.sub).run();
    account = await env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(accountId).first();
  } else if (account.account_type !== "personal") {
    return json({ ok: false, error: "wrong_account_type" }, 400);
  } else if (!account.google_sub) {
    // An existing password-based account signing in with Google for the first
    // time — link rather than reject, since Google's verification is trustworthy.
    await env.DB.prepare("UPDATE accounts SET google_sub=?, email_verified=1, updated_at=? WHERE account_id=?")
      .bind(info.sub, Date.now(), account.account_id).run();
    account = await env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(account.account_id).first();
  }

  await touchLastLogin(env, account.account_id);
  const sessionToken = await createSession(env, account.account_id);
  const cert = await issueCertificateFor(env, account);
  return json({ ok: true, session_token: sessionToken, account_id: account.account_id, ...cert });
}

/* ---------------- account-scoped profile/progress sync ----------------
   Replaces the old username+PIN / Google-Drive per-profile sync for any profile
   tagged to an account (see WallabyMaths.jsx): once a device is logged into an
   account, EVERY profile on it — and its progress — follows automatically to any
   other device logged into the same account, no separate code/Drive step needed.
   `name`/`avatar` are cached on account_profiles purely so the list endpoint is
   cheap; `progress` (the full blob) is fetched per-profile only when actually
   entering it, mirroring the same shell-vs-full-body split local storage already
   uses (profiles list vs profKey(id)). */
async function handleListAccountProfiles(request, env) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const rows = await env.DB.prepare(
    "SELECT profile_id, name, avatar, active_module, revision, updated_at FROM account_profiles WHERE account_id=? ORDER BY created_at"
  ).bind(account.account_id).all();
  return json({ ok: true, profiles: rows.results });
}

async function handleCreateAccountProfile(request, env) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const profileId = String(body?.profile_id || "").trim();
  const name = String(body?.name || "").slice(0, 60);
  const avatar = String(body?.avatar || "").slice(0, 120);
  const activeModule = String(body?.active_module || "");
  const progress = body?.progress;
  if (!profileId || !name || !progress || typeof progress !== "object") return json({ ok: false, error: "bad_input" }, 400);
  const now = Date.now();
  await env.DB.prepare(
    "INSERT OR IGNORE INTO account_profiles (profile_id, account_id, name, avatar, active_module, progress, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)"
  ).bind(profileId, account.account_id, name, avatar, activeModule, JSON.stringify(progress), now, now).run();
  const saved = await env.DB.prepare("SELECT revision, updated_at FROM account_profiles WHERE profile_id=? AND account_id=?").bind(profileId, account.account_id).first();
  return json({ ok: true, revision: saved?.revision || 0, updated_at: saved?.updated_at || now });
}

// Full progress blob for one profile — fetched lazily (only when actually
// entering that profile on a device that doesn't already have it locally).
async function handleGetAccountProfile(request, env, profileId) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const row = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?").bind(profileId, account.account_id).first();
  if (!row) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true, profile_id: row.profile_id, name: row.name, avatar: row.avatar, active_module: row.active_module, progress: JSON.parse(row.progress), revision: row.revision || 0, updated_at: row.updated_at });
}

// Upserts a profile's progress (and its cached name/avatar/active_module, which
// can drift — a renamed avatar, a switched module). No merge logic here, unlike
// the old code-based sync's mergeProgress — the client is expected to have
// already reconciled local-vs-remote (comparing `updated_at`) before pushing,
// same discipline sync.js's own push side already follows.
async function handlePushAccountProfile(request, env, profileId) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").slice(0, 60);
  const avatar = String(body?.avatar || "").slice(0, 120);
  const activeModule = String(body?.active_module || "");
  const progress = body?.progress;
  const baseRevision = Number(body?.revision);
  if (!name || !progress || typeof progress !== "object") return json({ ok: false, error: "bad_input" }, 400);
  const existing = await env.DB.prepare("SELECT progress, revision, updated_at FROM account_profiles WHERE profile_id=? AND account_id=?").bind(profileId, account.account_id).first();
  if (!existing) return json({ ok: false, error: "not_found" }, 404);
  const currentRevision = Number(existing.revision || 0);
  if (account.account_type === "seat" && (!Number.isSafeInteger(baseRevision) || baseRevision !== currentRevision)) {
    return json({ ok: false, error: "revision_conflict", progress: JSON.parse(existing.progress), revision: currentRevision, updated_at: existing.updated_at }, 409);
  }
  const now = Date.now();
  const updated = await env.DB.prepare("UPDATE account_profiles SET name=?, avatar=?, active_module=?, progress=?, revision=revision+1, updated_at=? WHERE profile_id=? AND account_id=? AND revision=?")
    .bind(name, avatar, activeModule, JSON.stringify(progress), now, profileId, account.account_id, currentRevision).run();
  if (!updated.meta?.changes) {
    const fresh = await env.DB.prepare("SELECT progress, revision, updated_at FROM account_profiles WHERE profile_id=? AND account_id=?").bind(profileId, account.account_id).first();
    return json({ ok: false, error: "revision_conflict", progress: JSON.parse(fresh.progress), revision: fresh.revision || 0, updated_at: fresh.updated_at }, 409);
  }
  return json({ ok: true, revision: currentRevision + 1, updated_at: now });
}

async function handleDeleteAccountProfile(request, env, profileId) {
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("UPDATE trade_offers SET status='rejected', resolved_at=? WHERE status='pending' AND listing_id IN (SELECT listing_id FROM trade_listings WHERE owner_profile_id=?)").bind(now, profileId),
    env.DB.prepare("UPDATE trade_listings SET status='cancelled', resolved_at=? WHERE owner_profile_id=? AND status='open'").bind(now, profileId),
    env.DB.prepare("UPDATE trade_offers SET status='withdrawn', resolved_at=? WHERE bidder_profile_id=? AND status='pending'").bind(now, profileId),
    env.DB.prepare("DELETE FROM account_profiles WHERE profile_id=? AND account_id=?").bind(profileId, account.account_id),
  ]);
  return json({ ok: true });
}

async function seatTradeContext(request, env, profileId) {
  const account = await sessionAccount(env, request);
  if (!account) return { response: json({ ok: false, error: "invalid_session" }, 401) };
  if (account.account_type !== "seat" || !account.school_code) return { response: json({ ok: false, error: "school_only" }, 403) };
  const profile = await env.DB.prepare(
    "SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?"
  ).bind(String(profileId || ""), account.account_id).first();
  if (!profile) return { response: json({ ok: false, error: "profile_not_found" }, 404) };
  let progress;
  try { progress = JSON.parse(profile.progress); }
  catch (e) { return { response: json({ ok: false, error: "bad_progress" }, 409) }; }
  return { account, profile, progress };
}

async function expireSchoolTrades(env, schoolCode) {
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("UPDATE trade_listings SET status='expired', resolved_at=? WHERE school_code=? AND status='open' AND expires_at<=?").bind(now, schoolCode, now),
    env.DB.prepare("UPDATE trade_offers SET status='expired', resolved_at=? WHERE status='pending' AND EXISTS (SELECT 1 FROM trade_listings l WHERE l.listing_id=trade_offers.listing_id AND l.school_code=? AND l.status<>'open')").bind(now, schoolCode),
  ]);
}

async function reservedTradeCopies(env, profileId, cardId) {
  const now = Date.now();
  const row = await env.DB.prepare(
    `SELECT
      (SELECT COUNT(*) FROM trade_listings WHERE owner_profile_id=? AND card_id=? AND status='open' AND expires_at>?) +
      (SELECT COUNT(*) FROM trade_offers o JOIN trade_listings l ON l.listing_id=o.listing_id
        WHERE o.bidder_profile_id=? AND o.card_id=? AND o.status='pending' AND l.status='open' AND l.expires_at>?) AS reserved`
  ).bind(profileId, cardId, now, profileId, cardId, now).first();
  return Number(row?.reserved || 0);
}

function tradeBoardModule(url) {
  const moduleKey = String(url.searchParams.get("module") || "");
  return TRADE_MODULES.includes(moduleKey) ? moduleKey : null;
}

async function handleTradeBoard(request, env) {
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profile_id");
  const moduleKey = tradeBoardModule(url);
  if (!moduleKey) return json({ ok: false, error: "bad_module" }, 400);
  const ctx = await seatTradeContext(request, env, profileId);
  if (ctx.response) return ctx.response;
  await expireSchoolTrades(env, ctx.account.school_code);

  const board = await env.DB.prepare(
    `SELECT l.listing_id, l.card_id, l.created_at, l.expires_at, p.name AS profile_name
     FROM trade_listings l JOIN account_profiles p ON p.profile_id=l.owner_profile_id
     WHERE l.school_code=? AND l.module_key=? AND l.status='open' AND l.owner_account_id<>?
     ORDER BY l.created_at DESC LIMIT 100`
  ).bind(ctx.account.school_code, moduleKey, ctx.account.account_id).all();
  const mine = await env.DB.prepare(
    `SELECT l.listing_id, l.card_id, l.created_at, l.expires_at,
       o.offer_id, o.card_id AS offered_card_id, o.created_at AS offer_created_at, p.name AS bidder_name
     FROM trade_listings l
     LEFT JOIN trade_offers o ON o.listing_id=l.listing_id AND o.status='pending'
     LEFT JOIN account_profiles p ON p.profile_id=o.bidder_profile_id
     WHERE l.owner_account_id=? AND l.owner_profile_id=? AND l.module_key=? AND l.status='open'
     ORDER BY l.created_at DESC, o.created_at ASC`
  ).bind(ctx.account.account_id, ctx.profile.profile_id, moduleKey).all();
  const myOffers = await env.DB.prepare(
    `SELECT o.offer_id, o.card_id AS offered_card_id, o.created_at, l.listing_id, l.card_id, l.expires_at, p.name AS profile_name
     FROM trade_offers o
     JOIN trade_listings l ON l.listing_id=o.listing_id
     JOIN account_profiles p ON p.profile_id=l.owner_profile_id
     WHERE o.bidder_account_id=? AND o.bidder_profile_id=? AND o.status='pending' AND l.module_key=? AND l.status='open'
     ORDER BY o.created_at DESC`
  ).bind(ctx.account.account_id, ctx.profile.profile_id, moduleKey).all();

  const listings = new Map();
  for (const row of mine.results || []) {
    if (!listings.has(row.listing_id)) listings.set(row.listing_id, {
      listing_id: row.listing_id, card_id: row.card_id, created_at: row.created_at, expires_at: row.expires_at, offers: [],
    });
    if (row.offer_id) listings.get(row.listing_id).offers.push({
      offer_id: row.offer_id, card_id: row.offered_card_id, profile_name: row.bidder_name, created_at: row.offer_created_at,
    });
  }
  return json({ ok: true, module: moduleKey, board: board.results || [], mine: [...listings.values()], my_offers: myOffers.results || [] });
}

async function handleCreateTradeListing(request, env) {
  const body = await request.json().catch(() => null);
  const profileId = String(body?.profile_id || "");
  const moduleKey = String(body?.module || "");
  const cardId = String(body?.card_id || "");
  if (!TRADE_MODULES.includes(moduleKey) || tradeCardModule(cardId) !== moduleKey) return json({ ok: false, error: "bad_card" }, 400);
  const ctx = await seatTradeContext(request, env, profileId);
  if (ctx.response) return ctx.response;
  await expireSchoolTrades(env, ctx.account.school_code);
  const open = await env.DB.prepare("SELECT COUNT(*) AS n FROM trade_listings WHERE owner_profile_id=? AND status='open'").bind(profileId).first();
  if (Number(open?.n || 0) >= TRADE_LIMITS.activeListings) return json({ ok: false, error: "listing_limit" }, 409);
  const reserved = await reservedTradeCopies(env, profileId, cardId);
  if (!isTradeableDuplicate(ctx.progress, moduleKey, cardId, reserved)) return json({ ok: false, error: "card_not_tradeable" }, 409);
  const now = Date.now();
  const listingId = uuid();
  try {
    await env.DB.prepare(
      "INSERT INTO trade_listings (listing_id, school_code, module_key, owner_account_id, owner_profile_id, card_id, status, created_at, expires_at) VALUES (?,?,?,?,?,?,'open',?,?)"
    ).bind(listingId, ctx.account.school_code, moduleKey, ctx.account.account_id, profileId, cardId, now, now + TRADE_LIMITS.listingDays * DAY_MS).run();
  } catch (e) {
    return json({ ok: false, error: "already_listed" }, 409);
  }
  return json({ ok: true, listing_id: listingId, expires_at: now + TRADE_LIMITS.listingDays * DAY_MS });
}

async function handleCancelTradeListing(request, env, listingId) {
  const owner = await env.DB.prepare("SELECT owner_profile_id FROM trade_listings WHERE listing_id=?").bind(listingId).first();
  const ctx = await seatTradeContext(request, env, owner?.owner_profile_id);
  if (ctx.response) return ctx.response;
  const listing = await env.DB.prepare("SELECT * FROM trade_listings WHERE listing_id=? AND owner_account_id=? AND owner_profile_id=?").bind(listingId, ctx.account.account_id, ctx.profile.profile_id).first();
  if (!listing || listing.status !== "open") return json({ ok: false, error: "listing_not_open" }, 404);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("UPDATE trade_listings SET status='cancelled', resolved_at=? WHERE listing_id=? AND status='open'").bind(now, listingId),
    env.DB.prepare("UPDATE trade_offers SET status='rejected', resolved_at=? WHERE listing_id=? AND status='pending'").bind(now, listingId),
  ]);
  return json({ ok: true });
}

async function handleCreateTradeOffer(request, env, listingId) {
  const body = await request.json().catch(() => null);
  const profileId = String(body?.profile_id || "");
  const cardId = String(body?.card_id || "");
  const ctx = await seatTradeContext(request, env, profileId);
  if (ctx.response) return ctx.response;
  await expireSchoolTrades(env, ctx.account.school_code);
  const listing = await env.DB.prepare("SELECT * FROM trade_listings WHERE listing_id=? AND school_code=? AND status='open' AND expires_at>?").bind(listingId, ctx.account.school_code, Date.now()).first();
  if (!listing) return json({ ok: false, error: "listing_not_open" }, 404);
  if (listing.owner_account_id === ctx.account.account_id || tradeCardModule(cardId) !== listing.module_key) return json({ ok: false, error: "bad_offer" }, 400);
  const reserved = await reservedTradeCopies(env, profileId, cardId);
  if (!isTradeableDuplicate(ctx.progress, listing.module_key, cardId, reserved)) return json({ ok: false, error: "card_not_tradeable" }, 409);
  const offerId = uuid();
  try {
    await env.DB.prepare(
      "INSERT INTO trade_offers (offer_id, listing_id, bidder_account_id, bidder_profile_id, card_id, status, created_at) VALUES (?,?,?,?,?,'pending',?)"
    ).bind(offerId, listingId, ctx.account.account_id, profileId, cardId, Date.now()).run();
  } catch (e) {
    return json({ ok: false, error: "offer_exists" }, 409);
  }
  return json({ ok: true, offer_id: offerId });
}

async function handleResolveTradeOffer(request, env, offerId, action) {
  const body = await request.json().catch(() => null);
  const ctx = await seatTradeContext(request, env, body?.profile_id);
  if (ctx.response) return ctx.response;
  const offer = await env.DB.prepare(
    `SELECT o.*, l.owner_account_id, l.owner_profile_id, l.card_id AS listed_card_id, l.module_key, l.school_code, l.status AS listing_status
     FROM trade_offers o JOIN trade_listings l ON l.listing_id=o.listing_id WHERE o.offer_id=?`
  ).bind(offerId).first();
  if (!offer || offer.status !== "pending" || offer.listing_status !== "open") return json({ ok: false, error: "offer_not_pending" }, 404);

  if (action === "withdraw") {
    if (offer.bidder_account_id !== ctx.account.account_id || offer.bidder_profile_id !== ctx.profile.profile_id) return json({ ok: false, error: "forbidden" }, 403);
    await env.DB.prepare("UPDATE trade_offers SET status='withdrawn', resolved_at=? WHERE offer_id=? AND status='pending'").bind(Date.now(), offerId).run();
    return json({ ok: true });
  }
  if (offer.owner_account_id !== ctx.account.account_id || offer.owner_profile_id !== ctx.profile.profile_id) return json({ ok: false, error: "forbidden" }, 403);
  if (action === "reject") {
    await env.DB.prepare("UPDATE trade_offers SET status='rejected', resolved_at=? WHERE offer_id=? AND status='pending'").bind(Date.now(), offerId).run();
    return json({ ok: true });
  }

  const claimed = await env.DB.prepare("UPDATE trade_listings SET status='processing' WHERE listing_id=? AND status='open'").bind(offer.listing_id).run();
  if (!claimed.meta?.changes) return json({ ok: false, error: "listing_not_open" }, 409);
  try {
    const ownerProfile = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?").bind(offer.owner_profile_id, offer.owner_account_id).first();
    const bidderProfile = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?").bind(offer.bidder_profile_id, offer.bidder_account_id).first();
    if (!ownerProfile || !bidderProfile || offer.school_code !== ctx.account.school_code) throw new Error("trade_profile_missing");
    const ownerProgress = JSON.parse(ownerProfile.progress);
    const bidderProgress = JSON.parse(bidderProfile.progress);
    if (!isTradeableDuplicate(ownerProgress, offer.module_key, offer.listed_card_id)) throw new Error("owner_card_missing");
    if (!isTradeableDuplicate(bidderProgress, offer.module_key, offer.card_id)) throw new Error("bidder_card_missing");
    ownerProgress.cards = { ...(ownerProgress.cards || {}), [offer.listed_card_id]: ownedCardCount(ownerProgress, offer.listed_card_id) - 1, [offer.card_id]: ownedCardCount(ownerProgress, offer.card_id) + 1 };
    bidderProgress.cards = { ...(bidderProgress.cards || {}), [offer.card_id]: ownedCardCount(bidderProgress, offer.card_id) - 1, [offer.listed_card_id]: ownedCardCount(bidderProgress, offer.listed_card_id) + 1 };
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare("UPDATE account_profiles SET progress=?, revision=revision+1, updated_at=? WHERE profile_id=? AND account_id=?").bind(JSON.stringify(ownerProgress), now, offer.owner_profile_id, offer.owner_account_id),
      env.DB.prepare("UPDATE account_profiles SET progress=?, revision=revision+1, updated_at=? WHERE profile_id=? AND account_id=?").bind(JSON.stringify(bidderProgress), now, offer.bidder_profile_id, offer.bidder_account_id),
      env.DB.prepare("UPDATE trade_listings SET status='completed', accepted_offer_id=?, resolved_at=? WHERE listing_id=? AND status='processing'").bind(offerId, now, offer.listing_id),
      env.DB.prepare("UPDATE trade_offers SET status='accepted', resolved_at=? WHERE offer_id=? AND status='pending'").bind(now, offerId),
      env.DB.prepare("UPDATE trade_offers SET status='rejected', resolved_at=? WHERE listing_id=? AND offer_id<>? AND status='pending'").bind(now, offer.listing_id, offerId),
    ]);
    const fresh = await env.DB.prepare("SELECT progress, revision, updated_at FROM account_profiles WHERE profile_id=?").bind(ctx.profile.profile_id).first();
    return json({ ok: true, progress: JSON.parse(fresh.progress), revision: fresh.revision, updated_at: fresh.updated_at });
  } catch (e) {
    const error = String(e?.message || e);
    const now = Date.now();
    if (error === "owner_card_missing") {
      await env.DB.batch([
        env.DB.prepare("UPDATE trade_listings SET status='cancelled', resolved_at=? WHERE listing_id=? AND status='processing'").bind(now, offer.listing_id),
        env.DB.prepare("UPDATE trade_offers SET status='rejected', resolved_at=? WHERE listing_id=? AND status='pending'").bind(now, offer.listing_id),
      ]);
      return json({ ok: false, error: "card_not_available" }, 409);
    }
    if (error === "bidder_card_missing") {
      await env.DB.batch([
        env.DB.prepare("UPDATE trade_listings SET status='open' WHERE listing_id=? AND status='processing'").bind(offer.listing_id),
        env.DB.prepare("UPDATE trade_offers SET status='rejected', resolved_at=? WHERE offer_id=? AND status='pending'").bind(now, offerId),
      ]);
      return json({ ok: false, error: "card_not_available" }, 409);
    }
    await env.DB.prepare("UPDATE trade_listings SET status='open' WHERE listing_id=? AND status='processing'").bind(offer.listing_id).run();
    return json({ ok: false, error: "trade_failed" }, 409);
  }
}

/* ---------------- group/school org portal ---------------- */
async function handleOrgLogin(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (!EMAIL_RE.test(email) || !password) return json({ ok: false, error: "bad_input" }, 400);
  if (!(await checkAndLogAuthAttempt(env, email, "org_login", LOGIN_RATE_LIMIT))) return json({ ok: false, error: "rate_limited" }, 429);

  const account = await env.DB.prepare("SELECT * FROM accounts WHERE email=? AND account_type='group'").bind(email).first();
  if (!account || !(await verifyPassword(password, account.password_salt, account.password_hash))) {
    return json({ ok: false, error: "invalid_credentials" }, 401);
  }
  await touchLastLogin(env, account.account_id);
  const sessionToken = await createSession(env, account.account_id);
  return json({ ok: true, session_token: sessionToken, account_id: account.account_id, has_pin: !!account.pin_hash });
}

// The /org page's own local quick-gate, parallel to the personal app's PinGate —
// checked online (this portal has no offline-cert model, it's a plain always-online
// page) rather than via the offline cert-embedding trick the app uses.
async function handleOrgVerifyPin(request, env) {
  const org = await orgSessionAccount(env, request);
  if (!org) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const pin = String(body?.pin || "");
  const ok = await verifyPin(pin, org.pin_salt, org.pin_hash);
  return json({ ok });
}

async function orgSessionAccount(env, request) {
  const account = await sessionAccount(env, request);
  return account && account.account_type === "group" ? account : null;
}

// Lists every seat (pupil) across every batch this org account owns. Deliberately
// never returns a child's own in-app name (which never reaches this server at all) —
// only their school-issued username, the org's own seat_label, entitlement state, and
// (decrypted from pin_enc — see encryptPin) the PIN itself, so the school can come back
// and hand out credentials over time rather than only at the moment of creation.
// Every level currently caps at 10 across all three modules (see CLAUDE.md's "10 levels
// per module") — used purely to phrase "mocks passed" as an out-of-N count for the report
// link/export, not to gate anything.
const REPORT_MAX_LEVEL = 10;
const REPORT_MODULE_LABEL = { primary: "Ninefold Orchard", junior: "Little Reckoning", intermediate: "Gifford" };

// Boils a profile's full progress JSON (same shape freshProgress()/pushAccountProfile
// stores client-side — {...shared, modules:{primary:{...},junior:{...},intermediate:{...}}})
// down to what a school admin actually wants for a pupil: how far into each module they've
// got, phrased as "mocks passed", since that's the concrete per-level milestone (see
// EXAM_PASS_MARKS/mocks in WallabyMaths.jsx) rather than XP or stars. Never touches or
// returns anything else in the blob (topic stats, card collection, adventure state, etc.).
// Deliberately stops at what's computable straight from the stored progress JSON alone —
// XP, streak, lessons read, and each module's level/bosses/mocks. The real in-app Report
// screen also breaks down badges and the creature collection by rarity, but that needs the
// game's own content tables (badge definitions, all ~90 card ids per module) which don't
// exist server-side and would mean keeping a second copy in sync here — not worth it for
// what a school needs (whether a pupil is progressing and passing assessments), so those
// sections are left out rather than faked with a rough guess.
function summarizeModuleProgress(progressJson) {
  let parsed;
  try { parsed = progressJson ? JSON.parse(progressJson) : null; } catch (e) { parsed = null; }
  const modules = parsed?.modules || {};
  const perModule = {};
  for (const key of Object.keys(REPORT_MODULE_LABEL)) {
    const m = modules[key];
    const mocksPassed = m ? Object.values(m.mocks || {}).filter(Boolean).length : 0;
    perModule[key] = { label: REPORT_MODULE_LABEL[key], unlockedLevel: m?.unlockedLevel || 1, bossesBeaten: m?.bossesBeaten || 0, mocksPassed, mocksOutOf: REPORT_MAX_LEVEL };
  }
  return { xp: parsed?.xp || 0, streakDay: parsed?.streakDay || 0, lessonsRead: parsed?.lessonsRead || 0, modules: perModule };
}

async function handleOrgSeats(request, env) {
  const org = await orgSessionAccount(env, request);
  if (!org) return json({ ok: false, error: "invalid_session" }, 401);
  const rows = await env.DB.prepare(
    `SELECT a.account_id, a.username, a.seat_label, a.subscription_status, a.group_batch_id, a.pin_enc, a.last_login_at,
            p.active_module, p.progress
     FROM accounts a JOIN licence_batches lb ON lb.batch_id = a.group_batch_id
     LEFT JOIN account_profiles p ON p.account_id = a.account_id
     WHERE a.account_type='seat' AND lb.owner_account_id = ?
     ORDER BY a.created_at`
  ).bind(org.account_id).all();
  const seats = await Promise.all(rows.results.map(async (s) => ({
    ...s, pin: await decryptPin(env, s.pin_enc), pin_enc: undefined,
    report: summarizeModuleProgress(s.progress), progress: undefined, // never ship the raw blob, just the summary
  })));
  // Listed independently of seats above (not derived from them) — a self-service
  // school's very first batch has zero seats in it yet, and the "Add a new pupil"
  // selector still needs somewhere to point.
  const batches = await env.DB.prepare(
    "SELECT batch_id, label, total_credits FROM licence_batches WHERE owner_account_id=? ORDER BY created_at"
  ).bind(org.account_id).all();
  return json({ ok: true, school_code: org.school_code, seats, batches: batches.results });
}

// Adds one more pupil to an existing batch, up to its purchased capacity — generates
// the username and PIN (the school hands these to the pupil however it likes) rather
// than letting a pupil pick their own, matching how the initial batch is provisioned.
// `seat_label` is optional and settable right here, so the admin can note who this
// went to (in THEIR own records, e.g. "Class 7B, Seat 14") at the exact moment they
// hand the credential out — see the privacy note on handleOrgSeats.
async function handleOrgSeatCreate(request, env) {
  const org = await orgSessionAccount(env, request);
  if (!org) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const batchId = String(body?.batch_id || "");
  const seatLabel = String(body?.seat_label || "").slice(0, 60) || null;
  const batch = await env.DB.prepare("SELECT * FROM licence_batches WHERE batch_id=? AND owner_account_id=?").bind(batchId, org.account_id).first();
  if (!batch) return json({ ok: false, error: "not_found" }, 404);
  const used = await env.DB.prepare("SELECT COUNT(*) AS n FROM accounts WHERE group_batch_id=?").bind(batchId).first();
  if (used.n >= batch.total_credits) return json({ ok: false, error: "batch_exhausted" }, 409);

  const username = await randomSeatUsername(env, org.school_code);
  const pin = randomSeatPin();
  await createSeatAccount(env, batch, org.school_code, username, pin, seatLabel);
  await env.DB.prepare("UPDATE licence_batches SET credits_used = credits_used + 1 WHERE batch_id=?").bind(batchId).run();
  return json({ ok: true, school_code: org.school_code, username, pin });
}

// Growing past the free-trial seat count is a request Sam approves from /admin
// (see handleAdminSeatRequestResolve), not instant self-service — no billing exists
// yet to gate it otherwise. One pending request per account at a time (a second
// request while one's still open just edits the first, rather than piling up
// duplicates the admin has to sort through).
async function handleOrgSeatRequestMore(request, env) {
  const org = await orgSessionAccount(env, request);
  if (!org) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const requestedSeats = parseInt(body?.requested_seats, 10);
  const message = String(body?.message || "").trim().slice(0, 500) || null;
  if (!requestedSeats || requestedSeats < 1 || requestedSeats > 2000) return json({ ok: false, error: "bad_input" }, 400);

  const batch = await env.DB.prepare("SELECT batch_id FROM licence_batches WHERE owner_account_id=? ORDER BY created_at LIMIT 1").bind(org.account_id).first();
  if (!batch) return json({ ok: false, error: "not_found" }, 404);

  const pending = await env.DB.prepare("SELECT request_id FROM seat_requests WHERE account_id=? AND status='pending'").bind(org.account_id).first();
  const now = Date.now();
  if (pending) {
    await env.DB.prepare("UPDATE seat_requests SET requested_seats=?, message=?, created_at=? WHERE request_id=?")
      .bind(requestedSeats, message, now, pending.request_id).run();
  } else {
    await env.DB.prepare("INSERT INTO seat_requests (request_id, account_id, batch_id, requested_seats, message, status, created_at) VALUES (?,?,?,?,?,?,?)")
      .bind(uuid(), org.account_id, batch.batch_id, requestedSeats, message, "pending", now).run();
  }
  return json({ ok: true });
}

// Surfaced on the org dashboard so a school can see their own request's state
// rather than wondering if it went anywhere.
async function handleOrgSeatRequestStatus(request, env) {
  const org = await orgSessionAccount(env, request);
  if (!org) return json({ ok: false, error: "invalid_session" }, 401);
  const row = await env.DB.prepare(
    "SELECT requested_seats, message, status, created_at, resolved_at FROM seat_requests WHERE account_id=? ORDER BY created_at DESC LIMIT 1"
  ).bind(org.account_id).first();
  return json({ ok: true, request: row || null });
}

// One handler for the remaining seat actions — each re-checks that the seat actually
// belongs to a batch this org account owns before touching anything.
async function handleOrgSeatAction(request, env, action) {
  const org = await orgSessionAccount(env, request);
  if (!org) return json({ ok: false, error: "invalid_session" }, 401);
  const body = await request.json().catch(() => null);
  const username = String(body?.username || "").trim().toLowerCase();
  if (!username) return json({ ok: false, error: "bad_input" }, 400);

  const row = await env.DB.prepare(
    `SELECT a.*, lb.owner_account_id FROM accounts a JOIN licence_batches lb ON lb.batch_id = a.group_batch_id
     WHERE a.account_type='seat' AND a.school_code=? AND a.username=?`
  ).bind(org.school_code, username).first();
  if (!row || row.owner_account_id !== org.account_id) return json({ ok: false, error: "not_found" }, 404);

  if (action === "rename") {
    const seatLabel = String(body?.seat_label || "").slice(0, 60);
    await env.DB.prepare("UPDATE accounts SET seat_label=?, updated_at=? WHERE account_id=?").bind(seatLabel, Date.now(), row.account_id).run();
    return json({ ok: true });
  }
  if (action === "reset-pin") {
    // Returned immediately, same as at seat creation, AND stored recoverably (pin_enc)
    // same as at creation too — so it doesn't have to be caught right now, see
    // handleOrgSeats/handleAdminSchoolSeats. Already-logged-in devices keep working on
    // their cached cert until it next refreshes; only a fresh login elsewhere needs the
    // new PIN.
    const pin = randomSeatPin();
    const { hash, salt } = await hashPin(pin);
    const pinEnc = await encryptPin(env, pin);
    await env.DB.prepare("UPDATE accounts SET pin_hash=?, pin_salt=?, pin_enc=?, updated_at=? WHERE account_id=?").bind(hash, salt, pinEnc, Date.now(), row.account_id).run();
    return json({ ok: true, pin });
  }
  if (action === "free") {
    // Deletes the pupil's account entirely and frees the capacity for a new one.
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare("UPDATE trade_offers SET status='rejected', resolved_at=? WHERE status='pending' AND listing_id IN (SELECT listing_id FROM trade_listings WHERE owner_account_id=?)").bind(now, row.account_id),
      env.DB.prepare("UPDATE trade_listings SET status='cancelled', resolved_at=? WHERE owner_account_id=? AND status='open'").bind(now, row.account_id),
      env.DB.prepare("UPDATE trade_offers SET status='withdrawn', resolved_at=? WHERE bidder_account_id=? AND status='pending'").bind(now, row.account_id),
      env.DB.prepare("DELETE FROM sessions WHERE account_id=?").bind(row.account_id),
      env.DB.prepare("DELETE FROM accounts WHERE account_id=?").bind(row.account_id),
      env.DB.prepare("UPDATE licence_batches SET credits_used = MAX(0, credits_used - 1) WHERE batch_id=?").bind(row.group_batch_id),
    ]);
    return json({ ok: true });
  }
  return json({ ok: false, error: "unknown_action" }, 400);
}

// One pupil's full progress, for the in-app Report view (see WallabyMaths.jsx's
// OrgAdmin/OrgSeatReport) — reuses the org's own bearer session rather than a separate
// report_token, since the admin is already inside the same running app that will render
// it, not opening a fresh tab with no other way to carry credentials.
async function handleOrgSeatReport(request, env) {
  const org = await orgSessionAccount(env, request);
  if (!org) return json({ ok: false, error: "invalid_session" }, 401);
  const username = new URL(request.url).searchParams.get("username") || "";
  const row = await env.DB.prepare(
    `SELECT p.name, p.avatar, p.active_module, p.progress, lb.owner_account_id
     FROM accounts a JOIN account_profiles p ON p.account_id = a.account_id
     JOIN licence_batches lb ON lb.batch_id = a.group_batch_id
     WHERE a.account_type='seat' AND a.username=? AND a.school_code=?`
  ).bind(username, org.school_code).first();
  if (!row || row.owner_account_id !== org.account_id) return json({ ok: false, error: "not_found" }, 404);
  let progress;
  try { progress = JSON.parse(row.progress); } catch (e) { return json({ ok: false, error: "corrupt_progress" }, 500); }
  return json({ ok: true, name: row.name, avatar: row.avatar, active_module: row.active_module, progress });
}

async function handlePaddleWebhook(request, env) {
  // Paddle Billing sends {event_type, data:{...}}. Signature verification and
  // exact field names need confirming against a real Paddle sandbox account
  // before going live — this is unexercised until PADDLE_WEBHOOK_SECRET exists.
  if (!env.PADDLE_WEBHOOK_SECRET) return json({ ok: false, error: "not_configured" }, 501);
  const body = await request.json().catch(() => null);
  if (!body?.event_type) return json({ ok: false, error: "bad_payload" }, 400);
  const now = Date.now();
  const customerId = body.data?.customer_id;
  const email = String(body.data?.customer?.email || "").trim().toLowerCase();
  if (!email && !customerId) return json({ ok: false, error: "no_identifier" }, 400);

  const account = email ? await getOrCreateAccount(env, email)
    : await env.DB.prepare("SELECT * FROM accounts WHERE paddle_customer_id=?").bind(customerId).first();
  if (!account) return json({ ok: false, error: "account_not_found" }, 404);

  const planFromPriceId = (priceId) => (String(priceId || "").includes("family") ? "annual_family"
    : String(priceId || "").includes("lifetime") ? "lifetime" : "annual_single");

  if (body.event_type === "subscription.activated" || body.event_type === "subscription.created" || body.event_type === "transaction.completed") {
    const plan = planFromPriceId(body.data?.items?.[0]?.price?.id);
    const expiresAt = plan === "lifetime" ? null : Date.parse(body.data?.next_billed_at || "") || now + 365 * DAY_MS;
    await env.DB.prepare(
      "UPDATE accounts SET subscription_status=?, subscription_plan=?, subscription_expires_at=?, paddle_customer_id=?, updated_at=? WHERE account_id=?"
    ).bind(plan === "lifetime" ? "lifetime" : "active", plan, expiresAt, customerId || account.paddle_customer_id, now, account.account_id).run();
  } else if (body.event_type === "subscription.canceled") {
    await env.DB.prepare("UPDATE accounts SET subscription_status='cancelled', updated_at=? WHERE account_id=?").bind(now, account.account_id).run();
  } else if (body.event_type === "subscription.payment_failed") {
    // Grace period is applied by effectiveEntitlement() reading subscription_expires_at + RENEWAL_GRACE_DAYS, no write needed here.
  }
  return json({ ok: true });
}

/* ---------------- admin ---------------- */
function requireAdmin(request, env) {
  return env.ADMIN_KEY && request.headers.get("X-Admin-Key") === env.ADMIN_KEY;
}

async function handleAdminAccounts(request, env) {
  const q = new URL(request.url).searchParams.get("q") || "";
  const rows = q
    ? await env.DB.prepare("SELECT * FROM accounts WHERE email LIKE ? ORDER BY created_at DESC LIMIT 200").bind(`%${q}%`).all()
    : await env.DB.prepare("SELECT * FROM accounts ORDER BY created_at DESC LIMIT 200").all();
  return json({ ok: true, accounts: rows.results });
}

async function handleAdminAccountUpdate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.account_id) return json({ ok: false, error: "bad_input" }, 400);
  const fields = ["subscription_status", "subscription_plan", "subscription_expires_at", "marketing_consent", "email_verified"];
  const sets = [], vals = [];
  for (const f of fields) if (f in body) { sets.push(`${f}=?`); vals.push(body[f]); }
  if (!sets.length) return json({ ok: false, error: "nothing_to_update" }, 400);
  sets.push("updated_at=?"); vals.push(Date.now());
  vals.push(body.account_id);
  await env.DB.prepare(`UPDATE accounts SET ${sets.join(", ")} WHERE account_id=?`).bind(...vals).run();
  return json({ ok: true });
}

// Creates a school's own org-portal login (account_type='group', a real password —
// see the set_password invite below) plus a batch of pre-provisioned pupil seats
// (school name + generated 3-word username + 8-digit PIN each) up front. Nothing is
// "redeemed" by a pupil later — the school hands out the credentials however it
// likes, and each pupil logs in directly with them (handleSchoolLogin) from any
// device. `school_code` is optional — a memorable name the school picks for itself
// (e.g. "st-marys-primary"); omit it to get an auto-generated one instead.
async function handleAdminGroupAccountCreate(request, env) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const { label, plan, total_credits, expiry_mode, expiry_value, note, school_code } = body || {};
  if (!EMAIL_RE.test(email) || !label || !plan || !total_credits || !expiry_mode || !expiry_value) return json({ ok: false, error: "bad_input" }, 400);
  if (total_credits > 2000) return json({ ok: false, error: "too_large" }, 400);

  const existing = await env.DB.prepare("SELECT * FROM accounts WHERE email=?").bind(email).first();
  if (existing) return json({ ok: false, error: "email_in_use" }, 409);

  const codeResult = await validateOrGenerateSchoolCode(env, school_code);
  if (codeResult.error) return json({ ok: false, error: codeResult.error }, 400);
  const schoolCode = codeResult.code;

  const now = Date.now();
  const accountId = uuid();
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at,
      subscription_status, subscription_plan, subscription_expires_at, paddle_customer_id, marketing_consent, updated_at, account_type, school_code)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, email, 0, now, null, null, "n/a", null, null, null, 0, now, "group", schoolCode).run();

  const batchId = uuid();
  await env.DB.prepare(
    "INSERT INTO licence_batches (batch_id, label, plan, total_credits, credits_used, expiry_mode, expiry_value, created_at, note, owner_account_id) VALUES (?,?,?,?,0,?,?,?,?,?)"
  ).bind(batchId, label, plan, total_credits, expiry_mode, String(expiry_value), now, note || null, accountId).run();

  const batch = await env.DB.prepare("SELECT * FROM licence_batches WHERE batch_id=?").bind(batchId).first();
  const seats = [];
  for (let i = 0; i < total_credits; i++) {
    const username = await randomSeatUsername(env, schoolCode);
    const pin = randomSeatPin();
    await createSeatAccount(env, batch, schoolCode, username, pin);
    seats.push({ username, pin });
  }
  await env.DB.prepare("UPDATE licence_batches SET credits_used=? WHERE batch_id=?").bind(total_credits, batchId).run();

  const token = randomToken();
  const SET_PASSWORD_TTL_MS = 60 * DAY_MS; // generous — this is a one-off B2B setup step, not a routine sign-in link
  await env.DB.prepare(
    "INSERT INTO magic_links (token, poll_id, email, created_at, expires_at, used_at, session_token, purpose) VALUES (?,?,?,?,?,?,?,?)"
  ).bind(token, randomToken(16), email, now, now + SET_PASSWORD_TTL_MS, null, null, "set_password").run();
  const setPasswordUrl = `${new URL(request.url).origin}/confirm?token=${token}`;

  return json({ ok: true, account_id: accountId, batch_id: batchId, school_code: schoolCode, seats, set_password_url: setPasswordUrl });
}

async function handleAdminBatchCreate(request, env) {
  const body = await request.json().catch(() => null);
  const { label, plan, total_credits, expiry_mode, expiry_value, note } = body || {};
  if (!label || !plan || !total_credits || !expiry_mode || !expiry_value) return json({ ok: false, error: "bad_input" }, 400);
  if (total_credits > 2000) return json({ ok: false, error: "too_large" }, 400);

  const batchId = uuid();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO licence_batches (batch_id, label, plan, total_credits, credits_used, expiry_mode, expiry_value, created_at, note) VALUES (?,?,?,?,0,?,?,?,?)"
  ).bind(batchId, label, plan, total_credits, expiry_mode, String(expiry_value), now, note || null).run();

  const codes = Array.from({ length: total_credits }, randomLicenceCode);
  const writes = codes.map((code) =>
    env.DB.prepare("INSERT INTO licence_codes (code, batch_id, created_at) VALUES (?,?,?)").bind(code, batchId, now)
  );
  for (let i = 0; i < writes.length; i += 50) await env.DB.batch(writes.slice(i, i + 50));

  return json({ ok: true, batch_id: batchId, codes });
}

async function handleAdminBatches(env) {
  const rows = await env.DB.prepare("SELECT * FROM licence_batches ORDER BY created_at DESC").all();
  return json({ ok: true, batches: rows.results });
}

// One row per school (group account), with seat stats rolled up from every batch it
// owns — "purchased" is capacity (sum of total_credits across its batches),
// "provisioned" is how many seats actually exist yet (a self-service school's cap can
// exceed what it's created so far), "active" is how many have ever actually been
// logged into (last_login_at IS NOT NULL) — the admin-page counterpart to /org's own
// seat table, for the "Personal accounts" / "School accounts" tabs.
async function handleAdminSchoolAccounts(env) {
  const rows = await env.DB.prepare(
    `SELECT a.account_id, a.email, a.subscription_status, a.subscription_plan, a.subscription_expires_at,
            a.trial_expires_at, a.created_at, a.school_code,
       COALESCE((SELECT SUM(total_credits) FROM licence_batches WHERE owner_account_id = a.account_id), 0) AS seats_purchased,
       (SELECT COUNT(*) FROM accounts s WHERE s.account_type='seat'
          AND s.group_batch_id IN (SELECT batch_id FROM licence_batches WHERE owner_account_id = a.account_id)) AS seats_provisioned,
       (SELECT COUNT(*) FROM accounts s WHERE s.account_type='seat' AND s.last_login_at IS NOT NULL
          AND s.group_batch_id IN (SELECT batch_id FROM licence_batches WHERE owner_account_id = a.account_id)) AS seats_active
     FROM accounts a WHERE a.account_type = 'group' ORDER BY a.created_at DESC`
  ).all();
  return json({ ok: true, schools: rows.results });
}

// All of one school's seats across every batch it owns (there's normally just one,
// but a seat-request approval grows the existing batch rather than making a new one,
// so this doesn't assume exactly one) — the admin-page counterpart to handleOrgSeats,
// reached from the School accounts table rather than a specific batch id.
async function handleAdminSchoolSeats(env, accountId) {
  const owner = await env.DB.prepare("SELECT email, school_code FROM accounts WHERE account_id=? AND account_type='group'").bind(accountId).first();
  if (!owner) return json({ ok: false, error: "not_found" }, 404);
  const rows = await env.DB.prepare(
    `SELECT a.username, a.seat_label, a.subscription_status, a.pin_enc, a.last_login_at
     FROM accounts a JOIN licence_batches lb ON lb.batch_id = a.group_batch_id
     WHERE a.account_type='seat' AND lb.owner_account_id = ?
     ORDER BY a.created_at`
  ).bind(accountId).all();
  const seats = await Promise.all(rows.results.map(async (s) => ({ ...s, pin: await decryptPin(env, s.pin_enc), pin_enc: undefined })));
  return json({ ok: true, seats, school_code: owner.school_code, org_email: owner.email });
}

async function handleAdminBatchCodes(env, batchId) {
  const rows = await env.DB.prepare("SELECT * FROM licence_codes WHERE batch_id=? ORDER BY created_at").bind(batchId).all();
  return json({ ok: true, codes: rows.results });
}

// Pending seat-growth requests from self-service schools (see
// handleOrgSeatRequestMore) — Sam approves or denies each one from /admin, since
// there's no billing yet to gate it automatically.
async function handleAdminSeatRequests(env) {
  const rows = await env.DB.prepare(
    `SELECT sr.request_id, sr.requested_seats, sr.message, sr.status, sr.created_at, sr.batch_id,
            a.email AS org_email, lb.label AS batch_label, lb.total_credits
     FROM seat_requests sr
     JOIN accounts a ON a.account_id = sr.account_id
     JOIN licence_batches lb ON lb.batch_id = sr.batch_id
     WHERE sr.status = 'pending'
     ORDER BY sr.created_at`
  ).all();
  return json({ ok: true, requests: rows.results });
}
async function handleAdminSeatRequestResolve(request, env, requestId) {
  const body = await request.json().catch(() => null);
  const approve = !!body?.approve;
  const row = await env.DB.prepare("SELECT * FROM seat_requests WHERE request_id=?").bind(requestId).first();
  if (!row || row.status !== "pending") return json({ ok: false, error: "not_found" }, 404);
  const now = Date.now();
  if (approve) {
    await env.DB.prepare("UPDATE licence_batches SET total_credits = total_credits + ? WHERE batch_id=?").bind(row.requested_seats, row.batch_id).run();
  }
  await env.DB.prepare("UPDATE seat_requests SET status=?, resolved_at=? WHERE request_id=?")
    .bind(approve ? "approved" : "denied", now, requestId).run();
  return json({ ok: true });
}

const FAVICON_DATA_URI = "data:image/png;base64,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";

const ADMIN_PAGE = `<!doctype html><meta charset="utf-8"><link rel="icon" href="${FAVICON_DATA_URI}"><title>Wallaby Maths — Admin</title>
<style>
body{font-family:system-ui,sans-serif;max-width:1100px;margin:30px auto;padding:0 16px;color:#222}
h1{font-size:20px} h2{font-size:16px;margin-top:36px}
table{border-collapse:collapse;width:100%;font-size:13px} td,th{border-bottom:1px solid #ddd;padding:6px 8px;text-align:left}
th[data-key]{cursor:pointer;user-select:none;white-space:nowrap}
input,select,button,textarea{font-size:13px;padding:5px 7px;margin:2px 0}
button{cursor:pointer} .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
textarea{width:100%;height:120px;font-family:monospace}
.pill{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}
.pill-trialing{background:#e0e7ff;color:#3730a3} .pill-active{background:#d1fae5;color:#065f46}
.pill-freemium{background:#fef3c7;color:#92400e} .pill-cancelled{background:#fee2e2;color:#991b1b}
.pill-lifetime{background:#ede9fe;color:#5b21b6}
.tabs{display:flex;gap:4px;border-bottom:2px solid #ddd;margin-top:16px}
.tab-btn{border:none;background:none;padding:8px 16px;font-size:14px;font-weight:600;color:#777;border-bottom:2px solid transparent;margin-bottom:-2px}
.tab-btn.active{color:#222;border-bottom-color:#3730a3}
.tab-panel{display:none} .tab-panel.active{display:block}
.table-toolbar{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px}
.table-wrap{max-height:520px;overflow:auto;border:1px solid #eee;border-radius:6px}
.table-wrap table{margin:0}
.table-wrap thead th{position:sticky;top:0;background:#fff;z-index:1}
.sort-arrow{color:#999;font-size:11px}
.pager{display:flex;gap:8px;align-items:center;margin-top:8px;font-size:13px;color:#555}
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);align-items:center;justify-content:center;z-index:100}
.modal-overlay.open{display:flex}
.modal-box{background:#fff;border-radius:8px;padding:20px;max-width:520px;width:90%;max-height:80vh;display:flex;flex-direction:column}
.modal-box h3{margin:0 0 4px;font-size:16px} .modal-box p{margin:0 0 10px;color:#555;font-size:13px}
.modal-box pre{flex:1;overflow:auto;background:#f6f6f6;border:1px solid #ddd;border-radius:6px;padding:10px;font-size:13px;margin:0 0 12px}
</style>
<h1>Wallaby Maths — Admin</h1>
<div class="row"><label>Admin key: <input id="key" type="password" style="width:280px"></label><button onclick="saveKey()">Save</button><span id="keyStatus"></span></div>

<div class="tabs">
  <button class="tab-btn active" id="tabBtn-personal" onclick="showTab('personal')">Personal accounts</button>
  <button class="tab-btn" id="tabBtn-school" onclick="showTab('school')">School accounts</button>
</div>

<div class="tab-panel active" id="tabPanel-personal">
  <h2>Personal accounts</h2>
  <div class="table-toolbar">
    <input id="personalFilter" placeholder="Filter by email, status, plan…" style="width:280px" oninput="personalTable.setFilter(this.value)">
    <span id="personalCount" style="color:#555;font-size:13px"></span>
  </div>
  <div class="table-wrap"><table id="personalTable"><thead></thead><tbody></tbody></table></div>
  <div class="pager" id="personalPager"></div>

  <h2>Gift a single account</h2>
  <div class="row">
    <input id="giftEmail" placeholder="parent@email.com" style="width:220px">
    <select id="giftPlan"><option value="annual_single">annual_single</option><option value="annual_family">annual_family</option><option value="lifetime">lifetime</option></select>
    <input id="giftDays" type="number" value="365" style="width:80px" title="days from now"> days
    <button onclick="giftAccount()">Create gift batch of 1 &amp; show code</button>
  </div>
  <pre id="giftResult"></pre>

  <h2>Bulk/gift licence batch</h2>
  <p style="max-width:640px;color:#555">For gifting or bulk-selling ordinary personal accounts, each redeemed by
  email + a one-off code typed into the app (the same flow "Gift a single account" above uses, just more than
  one at a time). Has nothing to do with school pupil seats — use the School accounts tab for that.</p>
  <div class="row">
    <input id="batchLabel" placeholder="e.g. Christmas gift codes 2026" style="width:260px">
    <select id="batchPlan"><option value="annual_single">annual_single</option><option value="annual_family">annual_family</option><option value="lifetime">lifetime</option></select>
    <input id="batchCredits" type="number" value="100" style="width:80px" title="number of codes">
    <select id="batchExpiryMode"><option value="days_from_redemption">days from redemption</option><option value="fixed_date">fixed date</option></select>
    <input id="batchExpiryValue" placeholder="365 or 2027-07-31" style="width:120px">
    <input id="batchNote" placeholder="note (optional)" style="width:160px">
    <button onclick="createBatch()">Create batch</button>
  </div>
  <textarea id="batchCodes" placeholder="Generated codes appear here, one per line"></textarea>

  <h2>Existing gift/bulk batches</h2>
  <table id="batchesTable"><thead><tr><th>Label</th><th>Plan</th><th>Used / Total</th><th>Expiry</th><th></th></tr></thead><tbody></tbody></table>
</div>

<div class="tab-panel" id="tabPanel-school">
  <h2>School accounts</h2>
  <div class="table-toolbar">
    <input id="schoolFilter" placeholder="Filter by email, school code, status…" style="width:280px" oninput="schoolTable.setFilter(this.value)">
    <span id="schoolCount" style="color:#555;font-size:13px"></span>
  </div>
  <div class="table-wrap"><table id="schoolTable"><thead></thead><tbody></tbody></table></div>
  <div class="pager" id="schoolPager"></div>

  <h2>Set up a school</h2>
  <p style="max-width:640px;color:#555">The one place to set up a school: creates the school's own login (a one-off
  link below to set a password, after which they manage everything themselves — renaming a seat, resetting a
  pupil's PIN, freeing up a seat — at <code>/org</code>, never needing you again) plus however many pupil seats
  they've bought, each a pre-generated username + PIN that logs straight in from any device, no email or
  self-registration involved.</p>
  <div class="row">
    <input id="groupEmail" placeholder="admin@school.org" style="width:220px">
    <input id="groupLabel" placeholder="e.g. St Mary's Primary" style="width:220px">
    <input id="groupSchoolCode" placeholder="school name/code (optional, e.g. st-marys) — auto if blank" style="width:280px">
    <select id="groupPlan"><option value="annual_single">annual_single</option><option value="annual_family">annual_family</option><option value="lifetime">lifetime</option></select>
    <input id="groupCredits" type="number" value="100" style="width:80px" title="number of seats/profiles bought"> seats/profiles bought
    <select id="groupExpiryMode"><option value="days_from_redemption">days from redemption</option><option value="fixed_date">fixed date</option></select>
    <input id="groupExpiryValue" placeholder="365 or 2027-07-31" style="width:120px">
    <button onclick="createGroupAccount()">Create school</button>
  </div>
  <pre id="groupResult"></pre>

  <h2>Seat requests (self-service schools asking for more)</h2>
  <table id="seatRequestsTable"><thead><tr><th>School</th><th>Batch</th><th>Requested</th><th>Note</th><th>Sent</th><th></th></tr></thead><tbody></tbody></table>
  <p id="seatRequestsEmpty" style="color:#555"></p>
</div>

<div class="modal-overlay" id="codesModal" onclick="if(event.target===this) closeCodesModal()">
  <div class="modal-box">
    <h3 id="codesModalTitle">Codes</h3>
    <p id="codesModalSub"></p>
    <pre id="codesModalBody"></pre>
    <div class="row" style="margin-bottom:0">
      <button onclick="copyCodesModal()">Copy all</button>
      <button onclick="downloadCodesModal()">Download .txt</button>
      <button onclick="closeCodesModal()">Close</button>
    </div>
  </div>
</div>

<script>
function key() { return localStorage.getItem('wm_admin_key') || ''; }
function saveKey() { localStorage.setItem('wm_admin_key', document.getElementById('key').value.trim()); document.getElementById('keyStatus').textContent = ' saved'; loadAll(); }
document.getElementById('key').value = key();
async function api(path, opts) {
  const res = await fetch(path, { ...opts, headers: { ...(opts && opts.headers), 'X-Admin-Key': key(), 'Content-Type': 'application/json' } });
  return res.json();
}
function fmtDate(ms) { return ms ? new Date(ms).toLocaleDateString() : '—'; }
// A lifetime plan never expires, full stop (see effectiveEntitlement — it's the one status
// never subject to a lapse check), so it must always read "Never" here regardless of
// whatever subscription_expires_at happens to hold. subscription_expires_at is genuinely
// null for a lifetime account normally, but trial_expires_at is a SEPARATE column that's
// set once at signup and never cleared — falling back to it unconditionally (the old bug
// here) meant any account that started as a trial and was later upgraded to lifetime kept
// showing its stale original trial date instead of "Never". Only a still-trialing account
// should ever show trial_expires_at.
function fmtExpiry(a) {
  if (a.subscription_plan === 'lifetime' || a.subscription_status === 'lifetime') return 'Never';
  if (a.subscription_status === 'trialing') return fmtDate(a.trial_expires_at) + ' (trial)';
  return fmtDate(a.subscription_expires_at);
}
function showTab(name) {
  ['personal','school'].forEach(t => {
    document.getElementById('tabBtn-' + t).classList.toggle('active', t === name);
    document.getElementById('tabPanel-' + t).classList.toggle('active', t === name);
  });
}

// A small, generic sortable/filterable/paginated table — used for both the Personal
// and School tabs rather than writing the sort/filter/page logic out twice. Filtering
// and sorting both run client-side over whatever setData() was last given: account
// counts here are in the dozens-to-low-hundreds, not a scale that needs a server-side
// query per keystroke.
function makeTable({ tableId, pagerId, countId, columns, pageSize = 20 }) {
  const table = document.getElementById(tableId);
  const pagerEl = document.getElementById(pagerId);
  const countEl = document.getElementById(countId);
  let allRows = [];
  let filterText = '';
  let sortKey = null, sortDir = 1, page = 1;

  function matches(row) {
    if (!filterText) return true;
    const f = filterText.toLowerCase();
    return columns.some(c => String((c.filterValue ? c.filterValue(row) : row[c.key]) ?? '').toLowerCase().includes(f));
  }
  function sortedFiltered() {
    let rows = allRows.filter(matches);
    if (sortKey) {
      const col = columns.find(c => c.key === sortKey);
      const val = col && col.sortValue ? col.sortValue : (r => r[sortKey]);
      rows = rows.slice().sort((a, b) => {
        const av = val(a), bv = val(b);
        if (av == null && bv == null) return 0;
        if (av == null) return 1; if (bv == null) return -1;
        if (av < bv) return -1 * sortDir; if (av > bv) return 1 * sortDir; return 0;
      });
    }
    return rows;
  }
  function renderHead() {
    const tr = document.createElement('tr');
    columns.forEach(c => {
      const th = document.createElement('th');
      if (c.sortable !== false) {
        th.dataset.key = c.key;
        th.onclick = () => { sortDir = (sortKey === c.key) ? -sortDir : 1; sortKey = c.key; page = 1; render(); };
        th.innerHTML = c.label + (sortKey === c.key ? \` <span class="sort-arrow">\${sortDir === 1 ? '▲' : '▼'}</span>\` : '');
      } else {
        th.textContent = c.label;
      }
      tr.appendChild(th);
    });
    table.querySelector('thead').innerHTML = '';
    table.querySelector('thead').appendChild(tr);
  }
  function render() {
    const rows = sortedFiltered();
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (page > totalPages) page = totalPages;
    const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
    renderHead();
    const tbody = table.querySelector('tbody'); tbody.innerHTML = '';
    pageRows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = columns.map(c => \`<td>\${c.render ? c.render(row) : (row[c.key] ?? '—')}</td>\`).join('');
      tbody.appendChild(tr);
    });
    countEl.textContent = rows.length + (rows.length === 1 ? ' row' : ' rows') + (allRows.length !== rows.length ? ' (of ' + allRows.length + ')' : '');
    pagerEl.innerHTML = '';
    if (totalPages > 1) {
      const prev = document.createElement('button'); prev.textContent = '← Prev'; prev.disabled = page <= 1; prev.onclick = () => { page--; render(); };
      const next = document.createElement('button'); next.textContent = 'Next →'; next.disabled = page >= totalPages; next.onclick = () => { page++; render(); };
      const label = document.createElement('span'); label.textContent = 'Page ' + page + ' of ' + totalPages;
      pagerEl.append(prev, label, next);
    }
  }
  return {
    setData(rows) { allRows = rows; page = 1; render(); },
    setFilter(text) { filterText = text; page = 1; render(); },
    refresh: render,
  };
}

const personalTable = makeTable({
  tableId: 'personalTable', pagerId: 'personalPager', countId: 'personalCount',
  columns: [
    { key: 'email', label: 'Email' },
    { key: 'subscription_status', label: 'Status', render: a => \`<span class="pill pill-\${a.subscription_status}">\${a.subscription_status}</span>\` },
    { key: 'subscription_plan', label: 'Plan', render: a => a.subscription_plan || '—' },
    { key: 'expires', label: 'Expires', sortValue: a => a.subscription_expires_at ?? a.trial_expires_at ?? Infinity, render: fmtExpiry },
    { key: 'created_at', label: 'Created', render: a => fmtDate(a.created_at) },
    { key: 'actions', label: '', sortable: false, render: a => \`<button onclick='editAccount(\${JSON.stringify(a)})'>Edit</button>\` },
  ],
});
const schoolTable = makeTable({
  tableId: 'schoolTable', pagerId: 'schoolPager', countId: 'schoolCount',
  columns: [
    { key: 'email', label: 'School email' },
    { key: 'school_code', label: 'School code', render: a => a.school_code || '—' },
    { key: 'subscription_status', label: 'Status', render: a => \`<span class="pill pill-\${a.subscription_status}">\${a.subscription_status}</span>\` },
    { key: 'seats_purchased', label: 'Purchased' },
    { key: 'seats_active', label: 'Active', render: a => a.seats_active + ' / ' + a.seats_provisioned + ' created' },
    { key: 'created_at', label: 'Created', render: a => fmtDate(a.created_at) },
    { key: 'actions', label: '', sortable: false, render: a => \`<button onclick='editAccount(\${JSON.stringify(a)})'>Edit</button> <button onclick='viewSchoolSeats(\${JSON.stringify(a.account_id)}, \${JSON.stringify(a.email)})'>View seats</button>\` },
  ],
});
async function loadAccounts() {
  const data = await api('/admin/accounts');
  personalTable.setData((data.accounts || []).filter(a => a.account_type === 'personal'));
}
async function loadSchoolAccounts() {
  const data = await api('/admin/school-accounts');
  schoolTable.setData(data.schools || []);
}
function loadAll() { loadAccounts(); loadBatches(); loadSeatRequests(); loadSchoolAccounts(); }
// Three plain prompts rather than a full inline form, matching the rest of this page's
// no-build-step style — but pre-filled with the account's CURRENT values (the old version
// left them blank, so leaving one untouched risked clearing it), and the expiry question is
// skipped entirely once lifetime is picked, rather than relying on a "type 0 for never"
// convention nobody could discover.
async function editAccount(a) {
  const status = prompt('subscription_status (trialing/freemium/active/cancelled/lifetime):', a.subscription_status || '');
  if (status === null) return;
  const plan = prompt('subscription_plan (annual_single/annual_family/lifetime/blank for none):', a.subscription_plan || '');
  if (plan === null) return;
  const body = { account_id: a.account_id, subscription_status: status, subscription_plan: plan || null };
  if (status === 'lifetime' || plan === 'lifetime') {
    body.subscription_expires_at = null; // lifetime never expires — nothing more to ask
  } else {
    const days = prompt('Expires in how many days from now? (blank = leave unchanged, 0 = clear it):', '');
    if (days !== null && days.trim() !== '') body.subscription_expires_at = days.trim() === '0' ? null : Date.now() + parseInt(days, 10) * 86400000;
  }
  await api('/admin/accounts/update', { method: 'POST', body: JSON.stringify(body) });
  // Shared by both tables' "Edit" button — cheap enough at this scale to just
  // refresh whichever one actually changed rather than threading through which
  // table a given row came from.
  loadAccounts();
  loadSchoolAccounts();
}
async function giftAccount() {
  const email = document.getElementById('giftEmail').value.trim();
  const plan = document.getElementById('giftPlan').value;
  const days = document.getElementById('giftDays').value;
  const data = await api('/admin/batches/create', { method: 'POST', body: JSON.stringify({ label: 'Gift: ' + email, plan, total_credits: 1, expiry_mode: 'days_from_redemption', expiry_value: days, note: 'single gift' }) });
  document.getElementById('giftResult').textContent = data.ok ? ('Code: ' + data.codes[0] + '\\nGive this to ' + email + ' to redeem in-app.') : JSON.stringify(data);
  loadBatches();
}
async function createBatch() {
  const body = {
    label: document.getElementById('batchLabel').value.trim(),
    plan: document.getElementById('batchPlan').value,
    total_credits: parseInt(document.getElementById('batchCredits').value, 10),
    expiry_mode: document.getElementById('batchExpiryMode').value,
    expiry_value: document.getElementById('batchExpiryValue').value.trim(),
    note: document.getElementById('batchNote').value.trim(),
  };
  const data = await api('/admin/batches/create', { method: 'POST', body: JSON.stringify(body) });
  document.getElementById('batchCodes').value = data.ok ? data.codes.join('\\n') : JSON.stringify(data);
  loadBatches();
}
// School batches (owner_account_id set) are excluded here — they never have any
// licence_codes rows at all (seats are their own accounts rows instead, see the
// School accounts tab's own "View seats"), so they'd only ever show an empty,
// confusing "View codes" here.
async function loadBatches() {
  const data = await api('/admin/batches');
  const tbody = document.querySelector('#batchesTable tbody'); tbody.innerHTML = '';
  (data.batches || []).filter(b => !b.owner_account_id).forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = \`<td>\${b.label}</td><td>\${b.plan}</td><td>\${b.credits_used} / \${b.total_credits}</td>
      <td>\${b.expiry_mode === 'fixed_date' ? b.expiry_value : b.expiry_value + ' days from redemption'}</td>
      <td><button onclick='viewCodes(\${JSON.stringify(b.batch_id)}, \${JSON.stringify(b.label)})'>View codes</button></td>\`;
    tbody.appendChild(tr);
  });
}
let codesModalLabel = '';
let codesModalLines = [];
async function viewCodes(batchId, label) {
  codesModalLabel = label || 'Codes';
  const data = await api('/admin/batches/' + batchId + '/codes');
  if (!data.ok) { alert('Could not load codes: ' + JSON.stringify(data)); return; }
  const codes = data.codes || [];
  codesModalLines = codes.map(c => c.code + (c.redeemed_at ? '  (redeemed)' : ''));
  const redeemed = codes.filter(c => c.redeemed_at).length;
  document.getElementById('codesModalTitle').textContent = codesModalLabel;
  document.getElementById('codesModalSub').textContent = codes.length + ' code' + (codes.length === 1 ? '' : 's') + ' — ' + redeemed + ' redeemed';
  document.getElementById('codesModalBody').textContent = codesModalLines.join('\\n') || '(no codes in this batch)';
  document.getElementById('codesModal').classList.add('open');
}
// Username, PIN and seat label are all recoverable here any time — a school buys seats
// well before it knows which child gets which, so these need to stay lookupable while
// they're handed out over following days/weeks, not just shown once at creation.
// Reached from the School accounts table's own "View seats" — spans every batch that
// school owns (there's normally just one; a seat request approval grows the existing
// one rather than making a new one).
async function viewSchoolSeats(accountId, label) {
  codesModalLabel = label || 'Seats';
  const data = await api('/admin/school-accounts/' + accountId + '/seats');
  if (!data.ok) { alert('Could not load seats: ' + JSON.stringify(data)); return; }
  const seats = data.seats || [];
  codesModalLines = seats.map(s => s.username + '  /  ' + (s.pin || '(reset needed)') + (s.seat_label ? '  (' + s.seat_label + ')' : '') + '  [' + s.subscription_status + ']' + '  last played: ' + (s.last_login_at ? new Date(s.last_login_at).toLocaleDateString() : 'never'));
  document.getElementById('codesModalTitle').textContent = codesModalLabel;
  document.getElementById('codesModalSub').textContent = seats.length + ' seat' + (seats.length === 1 ? '' : 's')
    + (data.school_code ? ' — school code "' + data.school_code + '"' : '');
  document.getElementById('codesModalBody').textContent = codesModalLines.join('\\n') || '(no seats in this batch)';
  document.getElementById('codesModal').classList.add('open');
}
function closeCodesModal() { document.getElementById('codesModal').classList.remove('open'); }
async function copyCodesModal() {
  try { await navigator.clipboard.writeText(codesModalLines.join('\\n')); alert('Copied ' + codesModalLines.length + ' codes to clipboard.'); }
  catch (e) { alert('Could not copy automatically — select the text above and copy manually.'); }
}
function downloadCodesModal() {
  const blob = new Blob([codesModalLines.join('\\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (codesModalLabel || 'codes').replace(/[^a-z0-9-_]+/gi, '_') + '.txt';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
async function createGroupAccount() {
  const body = {
    email: document.getElementById('groupEmail').value.trim(),
    label: document.getElementById('groupLabel').value.trim(),
    school_code: document.getElementById('groupSchoolCode').value.trim() || undefined,
    plan: document.getElementById('groupPlan').value,
    total_credits: parseInt(document.getElementById('groupCredits').value, 10),
    expiry_mode: document.getElementById('groupExpiryMode').value,
    expiry_value: document.getElementById('groupExpiryValue').value.trim(),
  };
  const data = await api('/admin/group-accounts/create', { method: 'POST', body: JSON.stringify(body) });
  document.getElementById('groupResult').textContent = data.ok
    ? ('School code: ' + data.school_code + '\\n\\nSet-password link (send to the school, for /org):\\n' + data.set_password_url +
       '\\n\\n' + data.seats.length + ' pupil logins (school code + username + PIN, each logs in from any device):\\n' +
       data.seats.map(s => s.username + '  /  ' + s.pin).join('\\n'))
    : JSON.stringify(data);
  loadBatches();
  loadSchoolAccounts();
}
async function loadSeatRequests() {
  const data = await api('/admin/seat-requests');
  const tbody = document.querySelector('#seatRequestsTable tbody'); tbody.innerHTML = '';
  const empty = document.getElementById('seatRequestsEmpty');
  const requests = data.requests || [];
  empty.textContent = requests.length ? '' : 'No pending requests.';
  requests.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = \`<td>\${r.org_email}</td><td>\${r.batch_label} (\${r.total_credits} seats now)</td><td>+\${r.requested_seats}</td><td>\${r.message || '—'}</td><td>\${new Date(r.created_at).toLocaleDateString()}</td>
      <td><button onclick='resolveSeatRequest(\${JSON.stringify(r.request_id)}, true)'>Approve</button>
        <button onclick='resolveSeatRequest(\${JSON.stringify(r.request_id)}, false)'>Deny</button></td>\`;
    tbody.appendChild(tr);
  });
}
async function resolveSeatRequest(requestId, approve) {
  await api('/admin/seat-requests/' + requestId + '/resolve', { method: 'POST', body: JSON.stringify({ approve }) });
  loadSeatRequests();
  loadBatches();
  loadSchoolAccounts();
}
if (key()) { loadAll(); }
</script>`;

/* ---------------- router ---------------- */
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    const url = new URL(request.url);
    const p = url.pathname;

    try {
      if (p === "/confirm" && (request.method === "GET" || request.method === "POST")) return await handleConfirm(request, env);
      if (p === "/entitlement" && request.method === "GET") return await handleEntitlement(request, env);
      if (p === "/account/redeem" && request.method === "POST") return await handleRedeem(request, env);
      if (p === "/account/delete" && request.method === "POST") return await handleDelete(request, env);
      if (p === "/account/set-pin" && request.method === "POST") return await handleSetPin(request, env);
      if (p === "/account/set-password" && request.method === "POST") return await handleSetPassword(request, env);
      if (p === "/account/reset-pin-with-password" && request.method === "POST") return await handleResetPinWithPassword(request, env);
      if (p === "/account/signup" && request.method === "POST") return await handleSignup(request, env);
      if (p === "/account/login" && request.method === "POST") return await handleLogin(request, env);
      if (p === "/account/forgot-password" && request.method === "POST") return await handleForgotPassword(request, env);
      if (p === "/account/school-login" && request.method === "POST") return await handleSchoolLogin(request, env);
      if (p === "/account/school-admin-signup" && request.method === "POST") return await handleSchoolAdminSignup(request, env);
      if (p === "/account/google-login" && request.method === "POST") return await handleGoogleLogin(request, env);
      if (p === "/account/profiles" && request.method === "GET") return await handleListAccountProfiles(request, env);
      if (p === "/account/profiles" && request.method === "POST") return await handleCreateAccountProfile(request, env);
      const profileMatch = p.match(/^\/account\/profiles\/([^/]+)$/);
      if (profileMatch && request.method === "GET") return await handleGetAccountProfile(request, env, profileMatch[1]);
      if (profileMatch && request.method === "DELETE") return await handleDeleteAccountProfile(request, env, profileMatch[1]);
      const profileProgressMatch = p.match(/^\/account\/profiles\/([^/]+)\/progress$/);
      if (profileProgressMatch && request.method === "POST") return await handlePushAccountProfile(request, env, profileProgressMatch[1]);
      if (p === "/trades" && request.method === "GET") return await handleTradeBoard(request, env);
      if (p === "/trades/listings" && request.method === "POST") return await handleCreateTradeListing(request, env);
      const tradeListingMatch = p.match(/^\/trades\/listings\/([^/]+)$/);
      if (tradeListingMatch && request.method === "DELETE") return await handleCancelTradeListing(request, env, tradeListingMatch[1]);
      const tradeOfferCreateMatch = p.match(/^\/trades\/listings\/([^/]+)\/offers$/);
      if (tradeOfferCreateMatch && request.method === "POST") return await handleCreateTradeOffer(request, env, tradeOfferCreateMatch[1]);
      const tradeOfferActionMatch = p.match(/^\/trades\/offers\/([^/]+)\/(accept|reject|withdraw)$/);
      if (tradeOfferActionMatch && request.method === "POST") return await handleResolveTradeOffer(request, env, tradeOfferActionMatch[1], tradeOfferActionMatch[2]);
      if (p === "/webhooks/paddle" && request.method === "POST") return await handlePaddleWebhook(request, env);

      if (p === "/joey/lobby" && request.method === "GET") return await handleJoeyLobby(request, env);
      if (p === "/joey/lobby/ready" && request.method === "POST") return await handleJoeyLobbyReady(request, env);
      if (p === "/joey/lobby/not-ready" && request.method === "POST") return await handleJoeyLobbyNotReady(request, env);
      if (p === "/joey/challenges" && request.method === "POST") return await handleJoeyCreateChallenge(request, env);
      const joeyChallengeActionMatch = p.match(/^\/joey\/challenges\/([^/]+)\/(accept|decline|cancel)$/);
      if (joeyChallengeActionMatch && request.method === "POST") {
        const [, challengeId, action] = joeyChallengeActionMatch;
        if (action === "accept") return await handleJoeyAcceptChallenge(request, env, challengeId);
        if (action === "decline") return await handleJoeyDeclineChallenge(request, env, challengeId);
        return await handleJoeyCancelChallenge(request, env, challengeId);
      }
      if (p === "/joey/matches/current" && request.method === "GET") return await handleJoeyCurrentMatch(request, env);
      const joeyMatchEventsMatch = p.match(/^\/joey\/matches\/([^/]+)\/events$/);
      if (joeyMatchEventsMatch) return await handleJoeyMatchEvents(request, env, joeyMatchEventsMatch[1]);
      const joeyMatchMulliganMatch = p.match(/^\/joey\/matches\/([^/]+)\/mulligan$/);
      if (joeyMatchMulliganMatch && request.method === "POST") return await handleJoeyMulligan(request, env, joeyMatchMulliganMatch[1]);
      const joeyMatchActionsMatch = p.match(/^\/joey\/matches\/([^/]+)\/actions$/);
      if (joeyMatchActionsMatch && request.method === "POST") return await handleJoeyActions(request, env, joeyMatchActionsMatch[1]);
      const joeyMatchConcedeMatch = p.match(/^\/joey\/matches\/([^/]+)\/concede$/);
      if (joeyMatchConcedeMatch && request.method === "POST") return await handleJoeyConcede(request, env, joeyMatchConcedeMatch[1]);
      const joeyMatchGetMatch = p.match(/^\/joey\/matches\/([^/]+)$/);
      if (joeyMatchGetMatch && request.method === "GET") return await handleJoeyGetMatch(request, env, joeyMatchGetMatch[1]);

      if (p === "/org/login" && request.method === "POST") return await handleOrgLogin(request, env);
      if (p === "/org/verify-pin" && request.method === "POST") return await handleOrgVerifyPin(request, env);
      if (p === "/org/seats" && request.method === "GET") return await handleOrgSeats(request, env);
      if (p === "/org/seats/report" && request.method === "GET") return await handleOrgSeatReport(request, env);
      if (p === "/org/seats/create" && request.method === "POST") return await handleOrgSeatCreate(request, env);
      if (p === "/org/seats/rename" && request.method === "POST") return await handleOrgSeatAction(request, env, "rename");
      if (p === "/org/seats/reset-pin" && request.method === "POST") return await handleOrgSeatAction(request, env, "reset-pin");
      if (p === "/org/seats/free" && request.method === "POST") return await handleOrgSeatAction(request, env, "free");
      if (p === "/org/seats/request-more" && request.method === "POST") return await handleOrgSeatRequestMore(request, env);
      if (p === "/org/seats/request-status" && request.method === "GET") return await handleOrgSeatRequestStatus(request, env);

      if (p.startsWith("/admin")) {
        if (p === "/admin" && request.method === "GET") return html(ADMIN_PAGE);
        if (!requireAdmin(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
        if (p === "/admin/accounts" && request.method === "GET") return await handleAdminAccounts(request, env);
        if (p === "/admin/accounts/update" && request.method === "POST") return await handleAdminAccountUpdate(request, env);
        if (p === "/admin/batches" && request.method === "GET") return await handleAdminBatches(env);
        if (p === "/admin/batches/create" && request.method === "POST") return await handleAdminBatchCreate(request, env);
        if (p === "/admin/group-accounts/create" && request.method === "POST") return await handleAdminGroupAccountCreate(request, env);
        const codesMatch = p.match(/^\/admin\/batches\/([^/]+)\/codes$/);
        if (codesMatch && request.method === "GET") return await handleAdminBatchCodes(env, codesMatch[1]);
        if (p === "/admin/seat-requests" && request.method === "GET") return await handleAdminSeatRequests(env);
        const seatReqMatch = p.match(/^\/admin\/seat-requests\/([^/]+)\/resolve$/);
        if (seatReqMatch && request.method === "POST") return await handleAdminSeatRequestResolve(request, env, seatReqMatch[1]);
        if (p === "/admin/school-accounts" && request.method === "GET") return await handleAdminSchoolAccounts(env);
        const schoolSeatsMatch = p.match(/^\/admin\/school-accounts\/([^/]+)\/seats$/);
        if (schoolSeatsMatch && request.method === "GET") return await handleAdminSchoolSeats(env, schoolSeatsMatch[1]);
      }

      return json({ ok: false, error: "not_found" }, 404);
    } catch (err) {
      console.error(err && err.stack || err);
      return json({ ok: false, error: "server_error", detail: String(err && err.message || err) }, 500);
    }
  },
};
