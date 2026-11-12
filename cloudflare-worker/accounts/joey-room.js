// The authoritative live match room (JOEY_MULTIPLAYER_SPEC.md §16): one
// Cloudflare Durable Object per match, reachable only through this Worker's
// own JOEY_MATCH_ROOM binding — never a public URL — so every request
// arriving here has already been authenticated, checked for group membership
// and profile ownership by joey-match.js. This class is a thin transport
// shell: all match-rule/timing logic is joey-room-core.js (unit-testable
// without a Durable Object runtime) and all Joey battle rules and
// per-player redaction are joey-multiplayer.js. Nothing here invents a
// second rules engine.
import { getMultiplayerPlayerView } from "../../joey-multiplayer.js";
import { initMatch, applyAction, concedeMatch, getView, markActivity, runAlarm } from "./joey-room-core.js";

// D1 is only ever the recoverable index/summary — the room's own storage
// (JoeyMatchRoom's Durable Object storage) is the sole authority for live
// match state. Safe to call repeatedly: both writes are guarded so only the
// first transition out of 'active' actually changes anything.
async function finalizeMatchIfDone(env, match) {
  if (!match || match.status === "active") return;
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE joey_matches SET status=?, winner_side=?, completion_reason=?, updated_at=?, completed_at=? WHERE match_id=? AND status='active'"
    ).bind(match.status, match.winnerSide, match.completionReason, now, match.completedAt || now, match.matchId),
    env.DB.prepare("DELETE FROM joey_active_match WHERE match_id=?").bind(match.matchId),
    env.DB.prepare(
      `INSERT OR IGNORE INTO joey_match_results
        (match_id, module_key, side_a_profile_id, side_b_profile_id, winner_side, completion_reason, started_at, completed_at)
        VALUES (?,?,?,?,?,?,?,?)`
    ).bind(match.matchId, match.moduleKey, match.sideA.profileId, match.sideB.profileId, match.winnerSide, match.completionReason, match.createdAt, match.completedAt || now),
  ]);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function safeView(match, profileId, now) {
  if (!match) return null;
  return getMultiplayerPlayerView(match, profileId, now);
}

export class JoeyMatchRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const now = Date.now();

    if (url.pathname === "/ws") {
      if (request.headers.get("Upgrade") !== "websocket") return new Response("expected_websocket", { status: 400 });
      return this.acceptWebSocket(url, now);
    }

    try {
      if (url.pathname === "/init" && request.method === "POST") {
        const body = await request.json();
        const result = await initMatch(this.state.storage, body, now);
        return jsonResponse({ ok: true, matchId: result.match.matchId, created: result.created });
      }
      if (url.pathname === "/action" && request.method === "POST") {
        const body = await request.json();
        const result = await applyAction(this.state.storage, body, now);
        await finalizeMatchIfDone(this.env, result.match);
        this.broadcast(result.match, now);
        return jsonResponse({ ok: result.ok, error: result.error, duplicate: result.duplicate || false, view: safeView(result.match, body.profileId, now) });
      }
      if (url.pathname === "/concede" && request.method === "POST") {
        const body = await request.json();
        const result = await concedeMatch(this.state.storage, body.profileId, now);
        await finalizeMatchIfDone(this.env, result.match);
        this.broadcast(result.match, now);
        return jsonResponse({ ok: result.ok, error: result.error, view: safeView(result.match, body.profileId, now) });
      }
      if (url.pathname === "/view" && request.method === "GET") {
        const profileId = url.searchParams.get("profileId");
        const result = await getView(this.state.storage, profileId, now);
        return jsonResponse({ ok: result.ok, error: result.error, view: result.view || null });
      }
    } catch (err) {
      return jsonResponse({ ok: false, error: "room_error", detail: String(err && err.message || err) }, 500);
    }
    return jsonResponse({ ok: false, error: "not_found" }, 404);
  }

  async acceptWebSocket(url, now) {
    const profileId = url.searchParams.get("profileId");
    if (!profileId) return jsonResponse({ ok: false, error: "profile_id_required" }, 400);
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server, [profileId]);
    await markActivity(this.state.storage, now);
    const result = await getView(this.state.storage, profileId, now);
    if (!result.ok) {
      server.close(1008, result.error || "forbidden");
    } else {
      server.send(JSON.stringify({ ok: true, view: result.view }));
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  // Every WebSocket action rides the same joey-room-core pipeline as the
  // HTTP fallback (spec §11), so a client can freely mix transports without
  // any risk of two different validation paths disagreeing.
  async webSocketMessage(ws, message) {
    const now = Date.now();
    const tags = this.state.getTags(ws);
    const profileId = tags[0];
    let payload;
    try {
      payload = JSON.parse(typeof message === "string" ? message : new TextDecoder().decode(message));
    } catch {
      ws.send(JSON.stringify({ ok: false, error: "bad_message" }));
      return;
    }
    let result;
    if (payload.kind === "concede") {
      result = await concedeMatch(this.state.storage, profileId, now);
    } else if (payload.kind === "action") {
      result = await applyAction(this.state.storage, {
        profileId,
        expectedRevision: payload.expected_revision,
        actionId: payload.action_id,
        action: payload.action,
      }, now);
    } else {
      ws.send(JSON.stringify({ ok: false, error: "invalid_action" }));
      return;
    }
    await finalizeMatchIfDone(this.env, result.match);
    // broadcast() already reaches every socket for both sides, including the
    // sender's — a second explicit send here would just double it up.
    this.broadcast(result.match, now);
    if (!result.ok) ws.send(JSON.stringify({ ok: false, error: result.error }));
  }

  async webSocketClose(ws) {
    try { ws.close(); } catch { /* already closing */ }
  }

  async webSocketError(ws) {
    try { ws.close(); } catch { /* already closing */ }
  }

  // Pushes each side its own redacted view — never the shared authoritative
  // match object — to whichever of that side's sockets are currently open.
  broadcast(match, now) {
    if (!match) return;
    for (const [sideId, key] of [["side_a", "sideA"], ["side_b", "sideB"]]) {
      const profileId = match[key]?.profileId;
      if (!profileId) continue;
      const view = safeView(match, profileId, now);
      for (const ws of this.state.getWebSockets(profileId)) {
        try { ws.send(JSON.stringify({ ok: true, view })); } catch { /* socket already gone */ }
      }
    }
  }

  async alarm() {
    const now = Date.now();
    const { match } = await runAlarm(this.state.storage, now);
    if (!match) return;
    await finalizeMatchIfDone(this.env, match);
    this.broadcast(match, now);
  }
}
