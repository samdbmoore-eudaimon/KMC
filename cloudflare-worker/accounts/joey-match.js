// Worker-side glue for the JoeyMatchRoom Durable Object (spec §15.3/§16):
// authenticates and authorises every request against D1 first, then forwards
// to the room addressed by matchId. The room itself trusts the profileId it
// is handed here completely — it is only ever reachable through this file
// (or joey-lobby.js's createMatchRoom helper for match creation), never
// directly from the internet, so this is the one place that must get
// authorisation right.
import { json, sessionAccount } from "./worker.js";

function roomStub(env, matchId) {
  const id = env.JOEY_MATCH_ROOM.idFromName(String(matchId));
  return env.JOEY_MATCH_ROOM.get(id);
}

// Used by joey-lobby.js at challenge-accept time — no HTTP request/session to
// check there (the caller already authenticated the accepting profile), so
// this is a thin direct wrapper around the room's internal routes.
export const createMatchRoom = {
  async init(env, params) {
    const stub = roomStub(env, params.matchId);
    const res = await stub.fetch(new Request(`https://joey-room.internal/init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }));
    return res.json();
  },
  async getExistingView(env, matchId, profileId) {
    const stub = roomStub(env, matchId);
    const res = await stub.fetch(new Request(`https://joey-room.internal/view?profileId=${encodeURIComponent(profileId)}`));
    const body = await res.json();
    return body.view || null;
  },
};

// Every profile that can legitimately address a match is either still in
// joey_active_match (a live match) or shows up in joey_matches (recoverable
// after completion, e.g. to see the final result once more). Checking both
// means a profile can never address a room it wasn't dealt into, even if it
// guesses another match's id.
async function requireMatchMembership(env, request, matchId, profileId) {
  const account = await sessionAccount(env, request);
  if (!account) return { response: json({ ok: false, error: "invalid_session" }, 401) };
  const profile = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?")
    .bind(String(profileId || ""), account.account_id).first();
  if (!profile) return { response: json({ ok: false, error: "profile_not_found" }, 404) };
  const row = await env.DB.prepare(
    "SELECT * FROM joey_matches WHERE match_id=? AND (side_a_profile_id=? OR side_b_profile_id=?)"
  ).bind(matchId, profile.profile_id, profile.profile_id).first();
  if (!row) return { response: json({ ok: false, error: "not_found" }, 404) };
  return { account, profile, row };
}

export async function handleJoeyCurrentMatch(request, env) {
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profile_id");
  const account = await sessionAccount(env, request);
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const profile = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?")
    .bind(String(profileId || ""), account.account_id).first();
  if (!profile) return json({ ok: false, error: "profile_not_found" }, 404);
  const active = await env.DB.prepare("SELECT match_id FROM joey_active_match WHERE profile_id=?").bind(profile.profile_id).first();
  if (!active) return json({ ok: true, match_id: null, view: null });
  const stub = roomStub(env, active.match_id);
  const res = await stub.fetch(new Request(`https://joey-room.internal/view?profileId=${encodeURIComponent(profile.profile_id)}`));
  const body = await res.json();
  return json({ ok: true, match_id: active.match_id, view: body.view || null });
}

export async function handleJoeyGetMatch(request, env, matchId) {
  const url = new URL(request.url);
  const ctx = await requireMatchMembership(env, request, matchId, url.searchParams.get("profile_id"));
  if (ctx.response) return ctx.response;
  const stub = roomStub(env, matchId);
  const res = await stub.fetch(new Request(`https://joey-room.internal/view?profileId=${encodeURIComponent(ctx.profile.profile_id)}`));
  const body = await res.json();
  return json(body, body.ok ? 200 : 409);
}

// Shared by /mulligan, /actions and /concede: verify membership against D1,
// then forward one JSON envelope to the room's matching internal route.
// `buildRoomBody` maps the wire contract's snake_case field names (spec
// §15.3: expected_revision, action_id) onto the engine's own camelCase
// parameter names (joey-multiplayer.js: expectedRevision, actionId).
async function forwardMatchAction(request, env, matchId, path, buildRoomBody) {
  const rawBody = await request.json().catch(() => null);
  const ctx = await requireMatchMembership(env, request, matchId, rawBody?.profile_id);
  if (ctx.response) return ctx.response;
  const stub = roomStub(env, matchId);
  const res = await stub.fetch(new Request(`https://joey-room.internal${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildRoomBody(rawBody, ctx.profile.profile_id)),
  }));
  const result = await res.json();
  return json(result, result.ok ? 200 : 409);
}

// Sugar over the same underlying /action route joey-room-core.js dispatches
// by match phase — a mulligan submission is just another action type
// (spec §7.1 vs §15.3 keep them as separate endpoints, the engine doesn't).
export async function handleJoeyMulligan(request, env, matchId) {
  return forwardMatchAction(request, env, matchId, "/action", (body, profileId) => ({
    profileId,
    expectedRevision: body.expected_revision,
    actionId: body.action_id,
    action: { type: "submit_mulligan", hand_indices: body.hand_indices },
  }));
}

export async function handleJoeyActions(request, env, matchId) {
  return forwardMatchAction(request, env, matchId, "/action", (body, profileId) => ({
    profileId,
    expectedRevision: body.expected_revision,
    actionId: body.action_id,
    action: body.action,
  }));
}

export async function handleJoeyConcede(request, env, matchId) {
  return forwardMatchAction(request, env, matchId, "/concede", (body, profileId) => ({ profileId }));
}

// WebSocket upgrade (spec §11). Browsers cannot set an Authorization header
// on the handshake, so the session token travels as a query param here only
// — verified exactly like the bearer header everywhere else, just read from
// a different place. Once verified, the upgrade request is re-issued to the
// room with a server-trusted profileId; the room never re-checks auth itself.
export async function handleJoeyMatchEvents(request, env, matchId) {
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profile_id");
  const token = url.searchParams.get("token");
  const account = token ? await sessionAccount(env, { headers: new Headers({ Authorization: `Bearer ${token}` }) }) : null;
  if (!account) return json({ ok: false, error: "invalid_session" }, 401);
  const profile = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?")
    .bind(String(profileId || ""), account.account_id).first();
  if (!profile) return json({ ok: false, error: "profile_not_found" }, 404);
  const membership = await env.DB.prepare(
    "SELECT 1 FROM joey_matches WHERE match_id=? AND (side_a_profile_id=? OR side_b_profile_id=?)"
  ).bind(matchId, profile.profile_id, profile.profile_id).first();
  if (!membership) return json({ ok: false, error: "not_found" }, 404);

  const stub = roomStub(env, matchId);
  return stub.fetch(new Request(`https://joey-room.internal/ws?profileId=${encodeURIComponent(profile.profile_id)}`, {
    headers: request.headers,
  }));
}
