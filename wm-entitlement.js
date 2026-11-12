/* Wallaby Maths account/entitlement client. Talks to the wallaby-accounts
   Cloudflare Worker (cloudflare-worker/accounts/) and verifies the signed
   certificate it hands back ENTIRELY LOCALLY, offline, via Ed25519 — see the
   worker's own header comment for the full design rationale. Every function
   here is defensive in the same spirit as sync.js: a network failure must
   never throw into the render path, since this app is offline-first and a
   subscriber with no signal should keep playing on their last-known cert. */

const ACCOUNTS_API_BASE = "https://wallaby-accounts.samdbmoore.workers.dev";
const CERT_VALID_DAYS = 365;

// Developer/test unlock: no server account needed, no certificate to mint or expire —
// a profile named exactly this, with exactly this avatar, always resolves to full access
// everywhere entitlement is checked. Deliberately not documented in-app; the avatar (Rooke,
// an Epic-rarity Gifford character) doesn't normally appear in the avatar picker's
// common/uncommon list, so this can't be stumbled into by accident — see the one exemption
// carved out for it in CHARACTER_AVATARS (WallabyMaths.jsx).
export const DEV_UNLOCK_NAME = "eudaimon";
export const DEV_UNLOCK_AVATAR = "card:intermediate:gf_rooke";
export function isDevUnlockProfile(profile) {
  return !!profile && (profile.name || "").trim().toLowerCase() === DEV_UNLOCK_NAME && profile.avatar === DEV_UNLOCK_AVATAR;
}

// Public half of the Worker's signing key (see cloudflare-worker/accounts/KEYS.md).
// Safe to ship in the client — only the private half (a Worker secret) can mint a
// certificate; this can only ever verify one.
const PUBLIC_KEY_RAW_B64 = "kP+QLQaSOIwi8zB8VyhxtgrqBdI64QTGRUdgbIF1u9s=";

function withTimeout(ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(t) };
}
function b64urlToBytes(str) {
  const pad = str.length % 4 === 2 ? "==" : str.length % 4 === 3 ? "=" : "";
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function stdBase64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
let cachedPublicKey = null;
async function getPublicKey() {
  if (cachedPublicKey) return cachedPublicKey;
  cachedPublicKey = await crypto.subtle.importKey("raw", stdBase64ToBytes(PUBLIC_KEY_RAW_B64), { name: "Ed25519" }, false, ["verify"]);
  return cachedPublicKey;
}

// Verifies signature + expiry, entirely offline. Returns the parsed payload
// (account_id, status, plan, plan_expires_at, issued_at, valid_until) if the
// certificate is genuine and not past its 365-day validity window, else null.
export async function verifyCertificate(cert) {
  try {
    if (!cert || typeof cert !== "string" || !cert.includes(".")) return null;
    const [payloadB64, sigB64] = cert.split(".");
    const key = await getPublicKey();
    const ok = await crypto.subtle.verify(
      "Ed25519", key, b64urlToBytes(sigB64), new TextEncoder().encode(payloadB64)
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));
    if (typeof payload.valid_until !== "number" || Date.now() > payload.valid_until) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// The one function the rest of the app should call for "what can this player
// access right now". Reads whatever certificate is cached locally and verifies
// it — no network call, works with zero connectivity for up to CERT_VALID_DAYS
// after the last successful sign-in or refresh. No account yet (or the cached
// cert has lapsed) resolves to the same freemium floor a real freemium account
// would get, so there's no separate "logged out" gate to build.
export async function getCurrentEntitlement(loadJSON, activeProfile) {
  if (isDevUnlockProfile(activeProfile)) {
    return { status: "lifetime", plan: "lifetime", expiresAt: null, trialExpiresAt: null, accountId: "dev-unlock" };
  }
  const cert = await loadJSON("wm_account_cert");
  const payload = cert && await verifyCertificate(cert);
  if (!payload) return { status: "freemium", plan: null, expiresAt: null, trialExpiresAt: null, accountId: null, accountType: null, pinHash: null, pinSalt: null };
  return {
    status: payload.status, plan: payload.plan, expiresAt: payload.plan_expires_at,
    trialExpiresAt: payload.trial_expires_at, accountId: payload.account_id,
    // Carried through so wm-pin.js can verify a locally-typed PIN against this same
    // cached, signature-verified certificate with no network call (pinHash/pinSalt are
    // exactly what the worker computed at signup/set-pin time, see hashPin there).
    // Personal accounts only — a seat (pupil) has no local Account screen to gate at
    // all, so this is simply unused for accountType === "seat".
    accountType: payload.account_type || null, pinHash: payload.pin_hash || null,
    pinSalt: payload.pin_salt || null,
  };
}

async function apiPost(path, body) {
  const { signal, cancel } = withTimeout(8000);
  try {
    const res = await fetch(`${ACCOUNTS_API_BASE}${path}`, {
      method: "POST", signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: "network" };
  } finally { cancel(); }
}
async function apiGet(path, sessionToken) {
  const { signal, cancel } = withTimeout(8000);
  try {
    const headers = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
    const res = await fetch(`${ACCOUNTS_API_BASE}${path}`, { signal, headers });
    return await res.json();
  } catch (e) {
    return { ok: false, error: "network" };
  } finally { cancel(); }
}
async function apiPostAuth(path, body, sessionToken, allowKeepalive = false) {
  const { signal, cancel } = withTimeout(8000);
  try {
    const payload = JSON.stringify(body);
    const res = await fetch(`${ACCOUNTS_API_BASE}${path}`, {
      method: "POST", signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
      keepalive: allowKeepalive && new Blob([payload]).size <= 60 * 1024,
      body: payload,
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: "network" };
  } finally { cancel(); }
}
async function apiDeleteAuth(path, sessionToken) {
  const { signal, cancel } = withTimeout(8000);
  try {
    const res = await fetch(`${ACCOUNTS_API_BASE}${path}`, { method: "DELETE", signal, headers: { Authorization: `Bearer ${sessionToken}` } });
    return await res.json();
  } catch (e) {
    return { ok: false, error: "network" };
  } finally { cancel(); }
}
// Every account-profile-sync call needs the same bearer session; every caller
// already has access to loadJSON, so this is just the "read it and bail cleanly
// if there isn't one" step every one of those functions would otherwise repeat.
async function withSession(loadJSON, fn) {
  const sessionToken = await loadJSON("wm_account_session");
  if (!sessionToken) return { ok: false, error: "not_signed_in" };
  return fn(sessionToken);
}

// "Forgot your password" — sends a one-off email link that lets the account set a
// new password (see the worker's /confirm branch). Never gates ordinary signup/
// login at all (see login) — this is recovery only, for when even the password is
// forgotten. A merely-forgotten local PIN doesn't need this — see resetPinWithPassword.
export async function forgotPassword(email) {
  return apiPost("/account/forgot-password", { email });
}

// Call opportunistically whenever the device is online (e.g. alongside the
// existing progress sync) to extend the certificate's 365-day validity window
// before it lapses. A no-op from the player's point of view either way.
export async function refreshEntitlement(loadJSON, saveJSON) {
  const sessionToken = await loadJSON("wm_account_session");
  if (!sessionToken) return { ok: false, error: "not_signed_in" };
  const res = await apiGet("/entitlement", sessionToken);
  if (res.ok) await saveJSON("wm_account_cert", res.certificate);
  return res;
}

// A gift or school licence code redeems straight to an active subscription,
// no email verification round trip needed (the code itself is the proof).
export async function redeemLicenceCode(email, code, saveJSON) {
  const res = await apiPost("/account/redeem", { email, code });
  if (res.ok) {
    await saveJSON("wm_account_session", res.session_token);
    await saveJSON("wm_account_cert", res.certificate);
  }
  return res;
}

// Changes an ALREADY-LOGGED-IN account's local PIN (the "set a quick PIN" step
// right after first login/signup, or a deliberate change later from the Account
// screen) — not part of signup/login at all, see login for that. Personal accounts
// only; pupils have no Account screen to reach this from.
export async function setAccountPin(pin, loadJSON, saveJSON) {
  const sessionToken = await loadJSON("wm_account_session");
  if (!sessionToken) return { ok: false, error: "not_signed_in" };
  const res = await apiPostAuth("/account/set-pin", { pin }, sessionToken);
  if (res.ok) await saveJSON("wm_account_cert", res.certificate);
  return res;
}

// Changes an ALREADY-LOGGED-IN account's password (an Account-screen settings
// action). Personal accounts only.
export async function setAccountPassword(password, loadJSON) {
  const sessionToken = await loadJSON("wm_account_session");
  if (!sessionToken) return { ok: false, error: "not_signed_in" };
  return apiPostAuth("/account/set-password", { password }, sessionToken);
}

// "I forgot my local PIN, but I still know my password" — re-authenticates with
// the password (online, this once) and sets a new PIN directly, no email round
// trip needed. Used by the Account screen's PinGate as a recovery fallback.
export async function resetPinWithPassword(email, password, newPin, saveJSON) {
  const res = await apiPost("/account/reset-pin-with-password", { email, password, new_pin: newPin });
  if (res.ok) await saveJSON("wm_account_cert", res.certificate);
  return res;
}

// Creates a brand-new personal account (playable immediately, no email click
// required — the "forgot password" email only matters for later recovery, see
// forgotPassword). Fails with "email_in_use" if one already exists — see login for
// that case instead; the two are deliberately separate so the app can show clearly
// different buttons ("Create a new account" vs "I already have one" — see
// WallabyMaths.jsx AccountGate) rather than one ambiguous form. A local PIN isn't
// even collected at this step; the app prompts to set one (setAccountPin) right
// after this succeeds. The device walks away with a cached cert and never needs to
// be online again to keep verifying that PIN.
export async function signup(email, password, saveJSON) {
  const res = await apiPost("/account/signup", { email, password });
  if (res.ok) {
    await saveJSON("wm_account_session", res.session_token);
    await saveJSON("wm_account_cert", res.certificate);
  }
  return res;
}

// Logs an EXISTING personal account into a new device — the password is the real
// credential here. Fails with "account_not_found" if the email has no account at
// all (see signup for that case instead). Either way a successful call leaves the
// device with a cached cert and never needs to be online again to keep verifying
// the local PIN (see wm-pin.js).
export async function login(email, password, saveJSON) {
  const res = await apiPost("/account/login", { email, password });
  if (res.ok) {
    await saveJSON("wm_account_session", res.session_token);
    await saveJSON("wm_account_cert", res.certificate);
  }
  return res;
}

// The school-pupil front door: school name + username + 8-digit PIN, all issued by
// the school up front (see the org portal) — never creates anything, only logs a
// pupil in, from any device. No local re-gating happens after this (pupils have no
// Account screen at all) — it's purely how this device learns which pupil's
// entitlement/progress this is.
export async function schoolLogin(schoolCode, username, pin, saveJSON) {
  const res = await apiPost("/account/school-login", { school_code: schoolCode, username, pin });
  if (res.ok) {
    await saveJSON("wm_account_session", res.session_token);
    await saveJSON("wm_account_cert", res.certificate);
  }
  return res;
}

// A teacher setting up their own school, self-service, straight from this device —
// the app's own counterpart to Sam's /admin "Set up a school" panel. Creates the
// school's login and a small free-trial seat allowance server-side; deliberately
// never caches a session/cert here — a school admin doesn't play the app
// themselves, they manage pupil seats at the org portal this returns a link to.
export async function schoolAdminSignup(label, email, password, schoolCode) {
  return apiPost("/account/school-admin-signup", { label, email, password, school_code: schoolCode || undefined });
}

/* ---------------- group/school self-service admin (School admin, in-app) ----------------
   A group account never plays the app or caches an offline certificate — it's only ever
   used for the length of one admin visit, so unlike signup/login/schoolLogin above, none
   of these persist a session to storage; the caller (WallabyMaths.jsx's OrgAdmin) just
   holds the returned session_token in memory for as long as that screen is open. */

// Logs into an existing group/school account — email + real password, not a pupil PIN.
export async function orgLogin(email, password) {
  return apiPost("/org/login", { email, password });
}

// Every seat (pupil) across every batch this school owns, plus its batches (for "add a
// pupil") and school_code — see handleOrgSeats.
export async function orgSeats(sessionToken) {
  return apiGet("/org/seats", sessionToken);
}

// rename / reset-pin / free — the three destructive-ish per-seat actions, keyed by
// username (never a real name — see handleOrgSeatAction's privacy note).
export async function orgSeatAction(action, username, extra, sessionToken) {
  return apiPostAuth(`/org/seats/${action}`, { username, ...(extra || {}) }, sessionToken);
}

export async function orgSeatCreate(batchId, seatLabel, sessionToken) {
  return apiPostAuth("/org/seats/create", { batch_id: batchId, seat_label: seatLabel }, sessionToken);
}

export async function orgSeatRequestStatus(sessionToken) {
  return apiGet("/org/seats/request-status", sessionToken);
}

export async function orgSeatRequestMore(requestedSeats, message, sessionToken) {
  return apiPostAuth("/org/seats/request-more", { requested_seats: requestedSeats, message }, sessionToken);
}

// One pupil's full progress, for the in-app Report view — see the worker's
// GET /org/seats/report (bearer session, re-checks the seat belongs to this school).
export async function orgSeatReport(username, sessionToken) {
  return apiGet(`/org/seats/report?username=${encodeURIComponent(username)}`, sessionToken);
}

// A third way into a personal account (alongside signup/login above) — creates or
// logs into one via a Google-verified email (see wm-google-account.js for how the
// access token is obtained, and the worker's handleGoogleLogin for how it's
// verified). Same create-or-login ambiguity email+password can't safely have, but
// safe here since Google's own email verification is real proof of ownership.
export async function googleLogin(accessToken, saveJSON) {
  const res = await apiPost("/account/google-login", { access_token: accessToken });
  if (res.ok) {
    await saveJSON("wm_account_session", res.session_token);
    await saveJSON("wm_account_cert", res.certificate);
  }
  return res;
}

/* ---------------- account-scoped profile/progress sync ----------------
   Replaces the old username+PIN / Google-Drive per-profile sync for any profile
   tagged to an account: once logged in, every profile (and its progress) follows
   automatically to any other device logged into the same account — see the
   worker's account_profiles endpoints and WallabyMaths.jsx's profile-tagging. */

// The profile list only (name/avatar/active_module/updated_at) — cheap, used to
// populate the picker with profiles that exist on the account but not yet on
// this device. Full progress for any of them is fetched lazily, see
// getAccountProfile below, only once the player actually opens one.
export async function listAccountProfiles(loadJSON) {
  return withSession(loadJSON, (token) => apiGet("/account/profiles", token));
}

// The full progress blob for one profile — call when entering a profile whose
// body isn't already cached locally (a shell just pulled in via
// listAccountProfiles on a new device).
export async function getAccountProfile(profileId, loadJSON) {
  return withSession(loadJSON, (token) => apiGet(`/account/profiles/${encodeURIComponent(profileId)}`, token));
}

// Registers a brand-new profile shell against the current account — call right
// after creating one locally (createProfile), so it shows up in
// listAccountProfiles on any other device logged into this same account.
export async function createAccountProfile(profileId, name, avatar, activeModule, progress, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth("/account/profiles", { profile_id: profileId, name, avatar, active_module: activeModule, progress }, token, true));
}

// Pushes this profile's current progress (and cached name/avatar/module) up —
// call from the same debounced effect that already pushes to the old sync
// mechanisms, for any profile tagged to an account.
export async function pushAccountProfile(profileId, name, avatar, activeModule, progress, revision, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth(`/account/profiles/${encodeURIComponent(profileId)}/progress`, { name, avatar, active_module: activeModule, progress, revision }, token, true));
}

// Call when a profile tagged to an account is deleted locally, so it stops
// following the account to other devices too.
export async function deleteAccountProfile(profileId, loadJSON) {
  return withSession(loadJSON, (token) => apiDeleteAuth(`/account/profiles/${encodeURIComponent(profileId)}`, token));
}

export async function getTradeBoard(profileId, moduleKey, loadJSON) {
  const query = `profile_id=${encodeURIComponent(profileId)}&module=${encodeURIComponent(moduleKey)}`;
  return withSession(loadJSON, (token) => apiGet(`/trades?${query}`, token));
}

export async function createTradeListing(profileId, moduleKey, cardId, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth("/trades/listings", { profile_id: profileId, module: moduleKey, card_id: cardId }, token));
}

export async function cancelTradeListing(listingId, loadJSON) {
  return withSession(loadJSON, (token) => apiDeleteAuth(`/trades/listings/${encodeURIComponent(listingId)}`, token));
}

export async function createTradeOffer(listingId, profileId, cardId, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth(`/trades/listings/${encodeURIComponent(listingId)}/offers`, { profile_id: profileId, card_id: cardId }, token));
}

export async function resolveTradeOffer(offerId, action, profileId, loadJSON) {
  if (!["accept", "reject", "withdraw"].includes(action)) return { ok: false, error: "bad_action" };
  return withSession(loadJSON, (token) => apiPostAuth(`/trades/offers/${encodeURIComponent(offerId)}/${action}`, { profile_id: profileId }, token));
}

export async function getJoeyLobby(profileId, moduleKey, loadJSON) {
  const query = `profile_id=${encodeURIComponent(profileId)}&module=${encodeURIComponent(moduleKey)}`;
  return withSession(loadJSON, (token) => apiGet(`/joey/lobby?${query}`, token));
}

export async function setJoeyReady(profileId, moduleKey, deckIndex, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth('/joey/lobby/ready', {
    profile_id: profileId, module: moduleKey, deck_index: deckIndex,
  }, token));
}

export async function setJoeyNotReady(profileId, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth('/joey/lobby/not-ready', { profile_id: profileId }, token));
}

export async function createJoeyChallenge(profileId, targetProfileId, moduleKey, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth('/joey/challenges', {
    profile_id: profileId, target_profile_id: targetProfileId, module: moduleKey,
  }, token));
}

export async function resolveJoeyChallenge(challengeId, action, profileId, loadJSON) {
  if (!["accept", "decline", "cancel"].includes(action)) return { ok: false, error: "bad_action" };
  return withSession(loadJSON, (token) => apiPostAuth(`/joey/challenges/${encodeURIComponent(challengeId)}/${action}`, {
    profile_id: profileId,
  }, token));
}

export async function getCurrentJoeyMatch(profileId, loadJSON) {
  return withSession(loadJSON, (token) => apiGet(`/joey/matches/current?profile_id=${encodeURIComponent(profileId)}`, token));
}

export async function getJoeyMatch(matchId, profileId, loadJSON) {
  const query = `profile_id=${encodeURIComponent(profileId)}`;
  return withSession(loadJSON, (token) => apiGet(`/joey/matches/${encodeURIComponent(matchId)}?${query}`, token));
}

export async function openJoeyMatchEvents(matchId, profileId, loadJSON) {
  try {
    const sessionToken = await loadJSON("wm_account_session");
    if (!sessionToken) return { ok: false, error: "not_signed_in" };
    if (typeof WebSocket === "undefined") return { ok: false, error: "websocket_unavailable" };
    const socketBase = ACCOUNTS_API_BASE.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
    const query = `profile_id=${encodeURIComponent(profileId)}&token=${encodeURIComponent(sessionToken)}`;
    return { ok: true, socket: new WebSocket(`${socketBase}/joey/matches/${encodeURIComponent(matchId)}/events?${query}`) };
  } catch (_) {
    return { ok: false, error: "network" };
  }
}

export async function submitJoeyMulligan(matchId, profileId, expectedRevision, actionId, handIndices, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth(`/joey/matches/${encodeURIComponent(matchId)}/mulligan`, {
    profile_id: profileId, expected_revision: expectedRevision, action_id: actionId, hand_indices: handIndices,
  }, token));
}

export async function submitJoeyAction(matchId, profileId, expectedRevision, actionId, action, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth(`/joey/matches/${encodeURIComponent(matchId)}/actions`, {
    profile_id: profileId, expected_revision: expectedRevision, action_id: actionId, action,
  }, token));
}

export async function concedeJoeyMatch(matchId, profileId, loadJSON) {
  return withSession(loadJSON, (token) => apiPostAuth(`/joey/matches/${encodeURIComponent(matchId)}/concede`, {
    profile_id: profileId,
  }, token));
}

// Right to erasure (brief §9.2) — deletes the server-side account row entirely.
export async function deleteAccount(loadJSON, delKey) {
  const sessionToken = await loadJSON("wm_account_session");
  if (!sessionToken) return { ok: true };
  const { signal, cancel } = withTimeout(8000);
  try {
    await fetch(`${ACCOUNTS_API_BASE}/account/delete`, {
      method: "POST", signal, headers: { Authorization: `Bearer ${sessionToken}` },
    });
  } catch (e) { /* best-effort: still clear local state even if offline */ }
  finally { cancel(); }
  await delKey("wm_account_session");
  await delKey("wm_account_cert");
  return { ok: true };
}

// Signs this device out of whatever account is cached, WITHOUT touching the server or
// deleting anything — the opposite of signup/login/schoolLogin/googleLogin above.
// Deliberately just two local deletes: there's no server-side session to revoke (the
// bearer token simply stops being presented), and any profiles/progress already on this
// device are untouched, just hidden again (see WallabyMaths.jsx's myProfiles filter)
// until the same account signs back in. This is the manual "Log out" action, and also
// what the school-seat inactivity timer calls automatically after 10 idle minutes.
export async function logOut(delKey) {
  await delKey("wm_account_session");
  await delKey("wm_account_cert");
}
