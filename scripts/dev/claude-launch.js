// Claude's own dev shortcut into the running app — NOT part of the shipped bundle, not
// imported anywhere, not reachable by any real player. This file is a snippet to paste into
// the browser pane's javascript_tool (or any devtools console) against a page already
// serving WallabyMaths.html/www/index.html (e.g. the "kmq-static" preview), when Claude needs
// to visually verify a change without a human walking it through real account creation.
//
// What it does: writes a single local profile — name "eudaimon", avatar "card:intermediate:
// gf_rooke" — straight into the same localStorage-backed window.storage shim the app itself
// uses (see the inline shim near the top of WallabyMaths.html, and wm_profiles_v3/profKey in
// WallabyMaths.jsx). That exact name+avatar pair is `isDevUnlockProfile` (wm-entitlement.js) —
// the same dev/test unlock a real developer reaches by creating a profile through the normal
// avatar picker. This script only pre-fills the profile list with one profile that already has
// that name+avatar, which is local browser storage, not an account: no network call, no email,
// no real account created anywhere. Selecting the resulting profile in the UI is what actually
// grants maxed progress and bypasses the paywall (enterProfile in WallabyMaths.jsx), driven by
// the app's own existing dev-unlock logic, not anything this script fabricates.
//
// Usage: run this once (via javascript_tool) against the loaded app, then reload the page.
// The account/"Welcome to Wallaby Maths" screen is skipped (profiles.length > 0 already), and
// a single "eudaimon" profile card is waiting on the profile-picker screen — click it to enter
// with every module/card/adventure unlocked.
//
// Safe to re-run: it replaces the profile list with just this one dev profile rather than
// appending, so it never accumulates junk profiles across sessions.
(async function claudeDevLaunch() {
  if (!window.storage) { console.error("window.storage isn't set up yet — is the app's own bootstrap script loaded?"); return; }
  const id = "p_claudedev";
  const profile = {
    id,
    name: "eudaimon",
    avatar: "card:intermediate:gf_rooke",
    createdAt: Date.now(),
    activeModule: "primary",
    accountId: null, // dev-unlock is never tagged to a real account (see createProfile in WallabyMaths.jsx)
    accountRevision: 0,
  };
  await window.storage.set("wm_profiles_v3", JSON.stringify([profile]));
  // Deliberately not writing wm_current_v3 or a wm_prof3_<id> progress blob: the app always
  // lands on the profile-picker screen regardless (never auto-resumes), and enterProfile
  // itself fills in maxed progress the first time this profile is opened, from nothing.
  console.log("Seeded the eudaimon dev profile. Reload the page, then click its card on the profile-picker screen.");
})();
