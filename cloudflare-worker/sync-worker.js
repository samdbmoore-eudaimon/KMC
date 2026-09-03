/* Kangaroo Maths Quest sync worker.
   Two routes, no auth beyond the username+PIN pair itself acting as a shared secret —
   this is a public key-value lookup, not a session/account system. */

const USERNAME_RE = /^[a-z0-9-]{3,20}$/;
// Exactly 6 digits, matching generateSyncCode's actual output (sync.js) — the old 4-8 range
// let a malicious client use a much weaker PIN than the app ever generates, shrinking the
// brute-forceable keyspace by 100x-10000x versus what a legitimate save actually uses.
const PIN_RE = /^[0-9]{6}$/;
const MAX_BODY_BYTES = 50 * 1024;

// Minimal per-IP rate limit: a free-tier-compatible KV counter, not a precise/atomic one (KV
// writes are eventually consistent, so concurrent requests can race past the limit slightly) —
// but it turns an unlimited brute-force script into one throttled to RATE_LIMIT_MAX requests
// per RATE_LIMIT_WINDOW_SECONDS per IP, which is what actually matters here.
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_SECONDS = 60;

async function checkRateLimit(env, ip) {
  const key = `ratelimit:${ip}`;
  const current = parseInt((await env.KQ_SYNC.get(key)) || "0", 10);
  if (current >= RATE_LIMIT_MAX) return false;
  await env.KQ_SYNC.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return true;
}

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

function json(body, status = 200) {
  return cors(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
}

function normalizeUsername(u) {
  return String(u || "").trim().toLowerCase();
}

function keyFor(username, pin) {
  return `save:${normalizeUsername(username)}:${pin}`;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    const url = new URL(request.url);

    if (url.pathname === "/save" || url.pathname === "/load") {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      if (!(await checkRateLimit(env, ip))) return json({ ok: false, error: "rate_limited" }, 429);
    }

    if (request.method === "POST" && url.pathname === "/save") {
      let body;
      try { body = await request.json(); } catch (e) { return json({ ok: false, error: "bad_json" }, 400); }
      const uname = normalizeUsername(body && body.username);
      const pin = String((body && body.pin) || "");
      if (!USERNAME_RE.test(uname)) return json({ ok: false, error: "bad_username" }, 400);
      if (!PIN_RE.test(pin)) return json({ ok: false, error: "bad_pin" }, 400);
      const payload = JSON.stringify({ data: body.data, updatedAt: Date.now() });
      if (payload.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);
      await env.KQ_SYNC.put(keyFor(uname, pin), payload);
      return json({ ok: true });
    }

    if (request.method === "GET" && url.pathname === "/load") {
      const uname = normalizeUsername(url.searchParams.get("username"));
      const pin = String(url.searchParams.get("pin") || "");
      if (!USERNAME_RE.test(uname) || !PIN_RE.test(pin)) return json({ ok: false, error: "bad_credentials" }, 400);
      const raw = await env.KQ_SYNC.get(keyFor(uname, pin));
      if (!raw) return json({ ok: false, error: "not_found" }, 404);
      const stored = JSON.parse(raw);
      return json({ ok: true, data: stored.data, updatedAt: stored.updatedAt });
    }

    return json({ ok: false, error: "not_found" }, 404);
  },
};
