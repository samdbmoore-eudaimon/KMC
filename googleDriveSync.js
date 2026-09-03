/* Cross-device progress sync via the player's own Google Drive — an alternative to the
   username+PIN sync in sync.js for anyone who'd rather their save live only in their own
   account than on any infrastructure this app operates. Uses the `drive.appdata` scope only:
   a hidden, per-app folder Google Drive provides exactly for this (app saves/config), invisible
   in the user's normal Drive UI. No `profile`/`email` scope is ever requested, so this app never
   learns the player's name, photo, or email — only an opaque, short-lived access token.
   Every function here is defensive, same contract as sync.js: a failure resolves to
   {ok:false, error}, never throws into the render path. */

const GOOGLE_CLIENT_ID = "325077206513-8ouriudnhghb7nunsncgtge23mjp78qj.apps.googleusercontent.com";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const DRIVE_FILENAME = "kangaroo-quest-save.json";
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function isGoogleConfigured() {
  return !GOOGLE_CLIENT_ID.includes("REPLACE-ME");
}

let gisScriptPromise = null;
function loadGoogleIdentityScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisScriptPromise) return gisScriptPromise;
  gisScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { gisScriptPromise = null; reject(new Error("gis_load_failed")); };
    document.head.appendChild(script);
  });
  return gisScriptPromise;
}

// Google's own "silent" token request (prompt: "") is NOT reliably silent in practice — in a
// browser with third-party storage restrictions (increasingly the default, and always true in
// Incognito/private windows) it falls back to showing the full account-chooser popup anyway,
// indistinguishable from an interactive request. Calling it from a background effect that fires
// on every debounced save would mean a login popup interrupting active gameplay every few
// seconds — exactly what this was designed to prevent. So background sync never calls Google at
// all: it only ever reuses a token already granted from an explicit, user-initiated sign-in,
// cached here in memory for its ~1hr lifetime (with a safety margin). Once that cache is empty
// (a fresh page load, or simply an hour of continuous play), background sync quietly stops until
// the next interactive sign-in — a real limitation of not running a backend to hold a refresh
// token, traded deliberately for "this app never stores anything server-side."
let cachedToken = null;
let cachedTokenExpiresAt = 0;
function cacheToken(accessToken, expiresInSeconds) {
  cachedToken = accessToken;
  cachedTokenExpiresAt = Date.now() + Math.max(0, (expiresInSeconds || 3600) - 120) * 1000;
}
function getCachedToken() {
  return cachedToken && Date.now() < cachedTokenExpiresAt ? cachedToken : null;
}

/* Requests a Drive-scoped access token. `interactive: true` is only for direct user actions
   (the "Sign in with Google" tile, "Connect/Reconnect Google Drive") — it may show Google's
   account chooser or consent screen, which is fine since the player just tapped something to
   get here. `interactive: false` is for background sync and NEVER talks to Google — it only
   returns an already-cached token, or {ok:false} if none is cached, so background sync can never
   surprise a player with a login popup mid-game (see the comment above). */
export async function requestGoogleToken({ interactive } = {}) {
  if (!isGoogleConfigured()) return { ok: false, error: "not_configured" };
  if (!interactive) {
    const cached = getCachedToken();
    return cached ? { ok: true, accessToken: cached } : { ok: false, error: "no_cached_token" };
  }
  try {
    await loadGoogleIdentityScript();
  } catch (e) {
    return { ok: false, error: "script_load_failed" };
  }
  return new Promise((resolve) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: DRIVE_SCOPE,
        prompt: "", // let Google decide — skips the consent screen when already granted, shows it when needed
        callback: (resp) => {
          if (!resp || resp.error) { resolve({ ok: false, error: (resp && resp.error) || "auth_failed" }); return; }
          cacheToken(resp.access_token, resp.expires_in);
          resolve({ ok: true, accessToken: resp.access_token });
        },
        error_callback: () => resolve({ ok: false, error: "auth_failed" }),
      });
      client.requestAccessToken();
    } catch (e) {
      resolve({ ok: false, error: "auth_failed" });
    }
  });
}

async function findAppDataFileId(token) {
  const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${encodeURIComponent(`name='${DRIVE_FILENAME}'`)}&fields=files(id)`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.files?.[0]?.id || null;
}

export async function pullFromDrive(token) {
  try {
    const fileId = await findAppDataFileId(token);
    if (!fileId) return { ok: false, error: "not_found" };
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    const stored = await res.json();
    return { ok: true, data: stored.data, updatedAt: stored.updatedAt };
  } catch (e) {
    return { ok: false, error: "network" };
  }
}

export async function pushToDrive(token, data) {
  try {
    const fileId = await findAppDataFileId(token);
    const body = JSON.stringify({ data, updatedAt: Date.now() });

    if (fileId) {
      // File already exists — just replace its content.
      const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) return { ok: false, error: `http_${res.status}` };
      return { ok: true };
    }

    // First push for this Google account — create the file in the hidden appDataFolder.
    const boundary = "kqsync" + Math.random().toString(36).slice(2);
    const metadata = JSON.stringify({ name: DRIVE_FILENAME, parents: ["appDataFolder"] });
    const multipartBody =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${body}\r\n` +
      `--${boundary}--`;
    const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}` },
      body: multipartBody,
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "network" };
  }
}
