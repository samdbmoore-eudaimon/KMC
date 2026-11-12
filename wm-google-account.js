/* Google Sign-In as a personal-ACCOUNT login method — a third way into an account
   alongside email+password (see AccountGate in WallabyMaths.jsx and handleGoogleLogin
   in the worker). Deliberately a SEPARATE module from googleDriveSync.js: that one
   exists specifically to never learn a player's email (drive.appdata scope only,
   used for progress backup); this one exists specifically to prove an email, since
   that's the whole point of an account login. Same public OAuth client_id, different
   scope, different purpose — never conflate the two. */

const GOOGLE_CLIENT_ID = "325077206513-8ouriudnhghb7nunsncgtge23mjp78qj.apps.googleusercontent.com";
const IDENTITY_SCOPE = "openid email";
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

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

// Always interactive (a direct "Sign in with Google" tap) — this is a sign-in
// action, never something to run silently in the background. The access token
// this returns is verified server-side (handleGoogleLogin calls Google's own
// userinfo endpoint with it) before the app ever trusts the email inside it.
export async function requestGoogleAccountToken() {
  try {
    await loadGoogleIdentityScript();
  } catch (e) {
    return { ok: false, error: "script_load_failed" };
  }
  return new Promise((resolve) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: IDENTITY_SCOPE,
        prompt: "",
        callback: (resp) => {
          if (!resp || resp.error) { resolve({ ok: false, error: (resp && resp.error) || "auth_failed" }); return; }
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
