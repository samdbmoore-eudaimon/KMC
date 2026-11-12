/* Local PIN verification for the personal-account "grown-up gate" (see the Account
   screen in WallabyMaths.jsx and cloudflare-worker/accounts/worker.js). A password
   (see login in wm-entitlement.js) is the real credential — it creates the account
   and logs new devices in. The PIN is set once right after that succeeds (see
   AccountGate) purely as a local shortcut: the raw digits travel to the server once,
   over HTTPS, exactly like the password does (see setAccountPin); the server
   salts+hashes them and that salt+hash then ride inside the signed entitlement
   certificate (issueCertificateFor in worker.js), so this module can verify a typed
   PIN against it afterwards with no network call at all. Personal accounts only —
   a school pupil (account_type "seat") has no local Account screen to gate in the
   first place, so nothing here is used for them. */

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// A hash is only ever sha256Hex(salt + pin) — this is the one place that shape is
// defined; the worker computes it identically (see hashPin there).
export async function hashPin(pin, salt) {
  return sha256Hex(String(salt) + String(pin));
}

// Verifies a typed PIN against the account hash+salt embedded in the cached,
// signature-verified certificate (entitlement.pinHash/pinSalt).
export async function verifyPin(pin, { entitlement }) {
  if (!entitlement || !entitlement.pinHash || !entitlement.pinSalt) return false;
  const hash = await hashPin(pin, entitlement.pinSalt);
  return hash === entitlement.pinHash;
}
