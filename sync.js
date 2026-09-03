/* Cross-device progress sync via a generated username + PIN, backed by a tiny
   Cloudflare Worker (see cloudflare-worker/). No accounts, no email, no OAuth —
   the username+PIN pair is itself the shared secret that locates a save.
   Every function here is defensive: a sync failure must never throw into the
   render path or block gameplay, since the app is offline-first and this is
   the only network I/O it does at all. */

const SYNC_API_BASE = "https://kq-sync.samdbmoore.workers.dev";

function isSyncConfigured() {
  return !SYNC_API_BASE.includes("REPLACE-ME");
}

function withTimeout(ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(t) };
}

export function generateSyncCode(displayName) {
  const slug = (displayName || "player").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12) || "player";
  const suffix = Math.floor(10 + Math.random() * 90); // 2 digits, keeps clashing usernames astronomically unlikely
  const username = `${slug}${suffix}`;
  const pin = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  return { username, pin };
}

export async function pushProgress(username, pin, data) {
  if (!isSyncConfigured() || !username || !pin) return { ok: false, error: "not_configured" };
  const { signal, cancel } = withTimeout(5000);
  try {
    const res = await fetch(`${SYNC_API_BASE}/save`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin, data }),
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    return await res.json();
  } catch (e) {
    return { ok: false, error: "network" };
  } finally {
    cancel();
  }
}

export async function pullProgress(username, pin) {
  if (!isSyncConfigured() || !username || !pin) return { ok: false, error: "not_configured" };
  const { signal, cancel } = withTimeout(5000);
  try {
    const url = `${SYNC_API_BASE}/load?username=${encodeURIComponent(username)}&pin=${encodeURIComponent(pin)}`;
    const res = await fetch(url, { signal });
    if (res.status === 404) return { ok: false, error: "not_found" };
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    return await res.json();
  } catch (e) {
    return { ok: false, error: "network" };
  } finally {
    cancel();
  }
}

// Fields where two independent devices' values can't just be merged, because they represent
// currency that's earned AND spent together (stars convert into packs; packs convert into
// cards) — merging them field-by-field could let a device "double count" its own spend.
// These move as one atomic group from whichever side is newer, rather than max/union per field.
// streakDay/lastDay/sessionStreak are grouped in for the same reason: they're only meaningful
// together, as one day's streak state.
const COUPLED_FIELDS = ["stars", "packs", "packsSinceEpic", "packsSinceLegendary", "streakDay", "lastDay", "sessionStreak"];

// `cards` (per-id owned-copy counts) is earned independently on each device, same as the
// coupled fields above, but can't be taken wholesale from one side either — that would lose
// whichever side's independent NEW cards the other side has never seen. It also can't merge
// via plain per-key max: two devices that both earn additional copies of the same card since
// the last sync would have the smaller of their two independent gains silently discarded.
// (cardItems, by contrast, holds arrays of found-item ids — those are correctly handled by the
// generic array-union merge below, so only `cards` needs this separate treatment.)
const COUNTER_MAP_FIELDS = ["cards"];

// Reconciles a per-id counter map against a `baseline` snapshot (the map as of the last
// successful sync): each id's merged count is the remote's count plus whatever this device
// has gained locally beyond the baseline, so both sides' independent gains accumulate instead
// of competing. With no baseline (e.g. a brand new device with nothing yet), every id's local
// value has nothing to compare against and is treated as 0 gained, so the remote simply wins.
function mergeCounterMap(localMap, remoteMap, baselineMap) {
  const out = {};
  const ids = new Set([...Object.keys(localMap || {}), ...Object.keys(remoteMap || {}), ...Object.keys(baselineMap || {})]);
  for (const id of ids) {
    const remoteVal = (remoteMap || {})[id] || 0;
    const localVal = (localMap || {})[id] || 0;
    const baseVal = (baselineMap || {})[id] || 0;
    out[id] = remoteVal + Math.max(0, localVal - baseVal);
  }
  return out;
}

function mergeValue(a, b) {
  if (a == null) return b;
  if (b == null) return a;
  if (typeof a === "number" && typeof b === "number") return Math.max(a, b);
  if (typeof a === "boolean" || typeof b === "boolean") return !!a || !!b;
  if (Array.isArray(a) && Array.isArray(b)) {
    const seen = new Set();
    const out = [];
    for (const item of [...a, ...b]) {
      const key = item && typeof item === "object" ? JSON.stringify(item) : item;
      if (!seen.has(key)) { seen.add(key); out.push(item); }
    }
    return out;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const out = { ...a };
    for (const k of Object.keys(b)) out[k] = k in out ? mergeValue(out[k], b[k]) : b[k];
    return out;
  }
  return a; // equal, or not safely mergeable (e.g. two different strings) — keep the local value
}

function mergeBucket(local, remote) {
  const out = { ...(local || {}) };
  for (const k of Object.keys(remote || {})) {
    if (COUPLED_FIELDS.includes(k) || COUNTER_MAP_FIELDS.includes(k)) continue; // handled separately below
    out[k] = k in out ? mergeValue(out[k], remote[k]) : remote[k];
  }
  return out;
}

function applyCoupledFields(merged, newerSide) {
  for (const k of COUPLED_FIELDS) if (newerSide && k in newerSide) merged[k] = newerSide[k];
}

/* Merges the un-flattened stored progress shape ({...sharedFields, modules:{junior:{...},...}}).
   `remoteIsNewer` decides which side's currency-cluster fields win — pass true when the remote
   save's updatedAt is later than the last time THIS device pushed (i.e. some other device has
   synced more recently than we have), false otherwise (our own unsynced local play is freshest).
   `baseline` is this device's last-agreed-with-server snapshot of the counter-map fields (see
   COUNTER_MAP_FIELDS) — omit it only when there's genuinely no prior sync to compare against. */
export function mergeProgress(local, remote, remoteIsNewer, baseline) {
  if (!remote) return local;
  if (!local) return remote;

  const localShared = { ...local }; delete localShared.modules;
  const remoteShared = { ...remote }; delete remoteShared.modules;
  const merged = mergeBucket(localShared, remoteShared);
  applyCoupledFields(merged, remoteIsNewer ? remoteShared : localShared);
  for (const field of COUNTER_MAP_FIELDS) {
    merged[field] = mergeCounterMap(local[field], remote[field], baseline && baseline[field]);
  }

  const modules = {};
  const moduleKeys = new Set([...Object.keys(local.modules || {}), ...Object.keys(remote.modules || {})]);
  for (const key of moduleKeys) {
    const lm = (local.modules || {})[key];
    const rm = (remote.modules || {})[key];
    if (!lm) { modules[key] = rm; continue; }
    if (!rm) { modules[key] = lm; continue; }
    const mergedModule = mergeBucket(lm, rm);
    applyCoupledFields(mergedModule, remoteIsNewer ? rm : lm);
    modules[key] = mergedModule;
  }
  merged.modules = modules;
  return merged;
}
