// Group membership for Joey multiplayer (JOEY_MULTIPLAYER_SPEC.md §3). The
// group key is always derived here, server-side, from the authenticated
// account row already loaded from D1 — a client never supplies a family id,
// school code or other group key directly, so tampering with a request body
// cannot change who a profile is allowed to play against.

export const JOEY_MODULE_KEYS = ["junior", "primary", "intermediate"];

// Only a personal account (family) or a pupil seat plays Joey multiplayer —
// a school's own group/admin account never appears in a Challenge Hall (§3.2).
export function isEligiblePlayerAccount(account) {
  if (!account) return false;
  if (account.account_type === "personal") return true;
  if (account.account_type === "seat") return !!String(account.school_code || "").trim();
  return false;
}

// family:{account_id} for a personal account (every profile on it shares one
// group — §3.1), school:{school_code} for a seat (§3.2). Returns null for any
// account type that isn't an eligible player (group/admin accounts, or a seat
// with no school_code somehow attached).
export function deriveGroupKey(account) {
  if (!isEligiblePlayerAccount(account)) return null;
  if (account.account_type === "personal") return `family:${account.account_id}`;
  return `school:${account.school_code}`;
}

// §3.3: an entitlement "sufficient to use Joey in the selected module" mirrors
// the same paid/freemium split already wired into content gating (see
// CLAUDE.md's Backend section and effectiveEntitlement in worker.js) — Junior
// and Intermediate need a live trial or subscription, Primary is available on
// freemium. This does not attempt to reproduce Primary's separate "1 Joey
// match" freemium cap from the brief, which is a client-tracked solo-battle
// counter unrelated to group/session eligibility; see the delivery report for
// why that's flagged rather than guessed at here.
export function hasModuleEntitlement(entitlementStatus, moduleKey) {
  if (moduleKey === "primary") return true;
  return entitlementStatus === "trialing" || entitlementStatus === "active";
}
