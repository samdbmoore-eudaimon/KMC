// Lower-level tests for the JoeyMatchRoom Durable Object (cloudflare-worker/
// accounts/joey-room.js) and its pure core (joey-room-core.js): server-clock
// turn/mulligan timeouts via the alarm handler, the 10-minute abandonment
// sweep, and the WebSocket message path — all against the in-memory
// Durable Object/D1 shims (scripts/lib/do-shim.mjs, scripts/lib/d1-shim.mjs),
// no wrangler/Miniflare needed.
//
// NOT covered here: the real `/ws` upgrade handshake (`WebSocketPair` is a
// Workers-runtime global with no Node equivalent) — webSocketMessage/
// webSocketClose are exercised directly instead. See the delivery report for
// why a Miniflare or live two-browser pass is still needed before deploy.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JoeyMatchRoom } from "../cloudflare-worker/accounts/joey-room.js";
import { JOEY_ABANDON_MS } from "../cloudflare-worker/accounts/joey-room-core.js";
import { createTestD1 } from "./lib/d1-shim.mjs";
import { createTestDurableObjectNamespace, createTestSocket } from "./lib/do-shim.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_SQL = readFileSync(path.join(ROOT, "..", "cloudflare-worker", "accounts", "schema.sql"), "utf8");

function freshEnv() {
  return { DB: createTestD1(SCHEMA_SQL) };
}

async function withClock(ts, fn) {
  const real = Date.now;
  Date.now = () => ts;
  try { return await fn(); }
  finally { Date.now = real; }
}

function deck(prefix) {
  return Array.from({ length: 15 }, (_, index) => ({
    id: `${prefix}_${index}`, name: `${prefix} ${index}`, r: "common", bv: 10,
    s: [index % 4 + 1, 2, 3, 2, 1], primaryType: index % 5, set: null,
  }));
}

async function seedMatchIndex(env, matchId) {
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO joey_matches (match_id, group_key, module_key, side_a_account_id, side_a_profile_id, side_b_account_id, side_b_profile_id, status, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,'active',?,?)`
  ).bind(matchId, "family:acct-1", "primary", "acct-1", "profile-a", "acct-1", "profile-b", now, now).run();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO joey_active_match (profile_id, match_id, account_id, side, group_key, module_key, created_at) VALUES (?,?,?,?,?,?,?)")
      .bind("profile-a", matchId, "acct-1", "side_a", "family:acct-1", "primary", now),
    env.DB.prepare("INSERT INTO joey_active_match (profile_id, match_id, account_id, side, group_key, module_key, created_at) VALUES (?,?,?,?,?,?,?)")
      .bind("profile-b", matchId, "acct-1", "side_b", "family:acct-1", "primary", now),
  ]);
}

async function createRoom(env, matchId, now = 1_000) {
  const ns = createTestDurableObjectNamespace(JoeyMatchRoom, env);
  const stub = ns.get(matchId);
  await seedMatchIndex(env, matchId);
  await withClock(now, () => stub.fetch(new Request("https://joey-room.internal/init", {
    method: "POST",
    body: JSON.stringify({
      matchId, moduleKey: "primary", groupKey: "family:acct-1",
      sideA: { accountId: "acct-1", profileId: "profile-a", name: "Amber Wren" },
      sideB: { accountId: "acct-1", profileId: "profile-b", name: "Silver Fox" },
      sideADeck: deck("a"), sideBDeck: deck("b"),
    }),
  })));
  return stub;
}

async function act(stub, now, path, body) {
  return withClock(now, async () => {
    const res = await stub.fetch(new Request(`https://joey-room.internal${path}`, { method: "POST", body: JSON.stringify(body) }));
    return res.json();
  });
}
async function view(stub, now, profileId) {
  return withClock(now, async () => {
    const res = await stub.fetch(new Request(`https://joey-room.internal/view?profileId=${profileId}`));
    return res.json();
  });
}

// A per-player view orients battleState.currentTurn to "player" meaning the
// viewer's own side, "ai" meaning the opponent — never the raw side_a/side_b
// engine labels. Given the view returned to `viewerProfileId`, resolve which
// real profile is actually up.
function activeProfileFromView(playerView, viewerProfileId, otherProfileId) {
  return playerView.battleState.currentTurn === "player" ? viewerProfileId : otherProfileId;
}

test("a mulligan submitted just before its 30s deadline is accepted", async () => {
  const env = freshEnv();
  const stub = await createRoom(env, "match-1", 1_000);
  const result = await act(stub, 1_000 + 29_999, "/action", { profileId: "profile-a", expectedRevision: 0, actionId: "m1", action: { type: "submit_mulligan", hand_indices: [] } });
  assert.equal(result.ok, true);
});

test("the alarm auto-confirms an unconfirmed mulligan at its deadline and starts gameplay once both are settled", async () => {
  const env = freshEnv();
  const stub = await createRoom(env, "match-2", 1_000);
  await act(stub, 1_000, "/action", { profileId: "profile-a", expectedRevision: 0, actionId: "m1", action: { type: "submit_mulligan", hand_indices: [] } });
  await withClock(1_000 + 30_000, () => stub.alarm());
  const result = await view(stub, 1_000 + 30_000, "profile-a");
  assert.equal(result.view.phase, "gameplay");
});

test("an action at or after the turn deadline is rejected with deadline_expired, and reconnecting after it shows the timeout result", async () => {
  const env = freshEnv();
  const stub = await createRoom(env, "match-3", 1_000);
  await act(stub, 1_000, "/action", { profileId: "profile-a", expectedRevision: 0, actionId: "m1", action: { type: "submit_mulligan", hand_indices: [] } });
  const afterB = await act(stub, 1_000 + 1, "/action", { profileId: "profile-b", expectedRevision: 1, actionId: "m2", action: { type: "submit_mulligan", hand_indices: [] } });
  assert.equal(afterB.ok, true);
  const gameplayStart = 1_000 + 1;
  const turnPlayer = activeProfileFromView(afterB.view, "profile-b", "profile-a");

  const rejected = await act(stub, gameplayStart + 30_000, "/action", { profileId: turnPlayer, expectedRevision: afterB.view.revision, actionId: "late-1", action: { type: "pass" } });
  assert.deepEqual([rejected.ok, rejected.error], [false, "deadline_expired"]);

  const recovered = await view(stub, gameplayStart + 30_000, turnPlayer);
  assert.notEqual(recovered.view.revision, afterB.view.revision); // the timeout pass itself bumped the revision
});

test("client clock does not matter — an action carrying the current revision right up to the deadline still applies", async () => {
  const env = freshEnv();
  const stub = await createRoom(env, "match-4", 1_000);
  await act(stub, 1_000, "/action", { profileId: "profile-a", expectedRevision: 0, actionId: "m1", action: { type: "submit_mulligan", hand_indices: [] } });
  const afterB = await act(stub, 1_000 + 1, "/action", { profileId: "profile-b", expectedRevision: 1, actionId: "m2", action: { type: "submit_mulligan", hand_indices: [] } });
  const turnPlayer = activeProfileFromView(afterB.view, "profile-b", "profile-a");
  const deadline = afterB.view.turnDeadlineAt;

  const justInTime = await act(stub, deadline - 1, "/action", { profileId: turnPlayer, expectedRevision: afterB.view.revision, actionId: "ok-1", action: { type: "pass" } });
  assert.equal(justInTime.ok, true);
});

test("a match with no player activity for 10 minutes is closed as abandoned, with no winner, and D1 is updated", async () => {
  const env = freshEnv();
  const stub = await createRoom(env, "match-5", 1_000);
  await withClock(1_000 + JOEY_ABANDON_MS + 1, () => stub.alarm());

  const row = await env.DB.prepare("SELECT status, winner_side, completion_reason FROM joey_matches WHERE match_id=?").bind("match-5").first();
  assert.deepEqual([row.status, row.winner_side, row.completion_reason], ["abandoned", null, "abandoned"]);
  const active = await env.DB.prepare("SELECT COUNT(*) AS n FROM joey_active_match WHERE match_id=?").bind("match-5").first();
  assert.equal(active.n, 0);
});

test("a real action counts as activity and postpones abandonment", async () => {
  const env = freshEnv();
  const stub = await createRoom(env, "match-6", 1_000);
  await act(stub, 1_000 + 5 * 60_000, "/action", { profileId: "profile-a", expectedRevision: 0, actionId: "m1", action: { type: "submit_mulligan", hand_indices: [] } });
  // 10 minutes after creation, but under 10 minutes since the mulligan activity above
  await withClock(1_000 + JOEY_ABANDON_MS + 1, () => stub.alarm());
  const row = await env.DB.prepare("SELECT status FROM joey_matches WHERE match_id=?").bind("match-6").first();
  assert.equal(row.status, "active");
});

test("concede finalizes the match in D1 exactly once even if called again", async () => {
  const env = freshEnv();
  const stub = await createRoom(env, "match-7", 1_000);
  const first = await act(stub, 2_000, "/concede", { profileId: "profile-a" });
  assert.equal(first.ok, true);
  const second = await act(stub, 3_000, "/concede", { profileId: "profile-a" });
  assert.equal(second.ok, false); // match already finished
  const row = await env.DB.prepare("SELECT status, completed_at FROM joey_matches WHERE match_id=?").bind("match-7").first();
  assert.equal(row.status, "completed");
});

test("a WebSocket action message applies through the same pipeline and only reaches the sender's own socket", async () => {
  const env = freshEnv();
  const ns = createTestDurableObjectNamespace(JoeyMatchRoom, env);
  const stub = ns.get("match-8");
  await seedMatchIndex(env, "match-8");
  await withClock(1_000, () => stub.fetch(new Request("https://joey-room.internal/init", {
    method: "POST",
    body: JSON.stringify({
      matchId: "match-8", moduleKey: "primary", groupKey: "family:acct-1",
      sideA: { accountId: "acct-1", profileId: "profile-a", name: "Amber Wren" },
      sideB: { accountId: "acct-1", profileId: "profile-b", name: "Silver Fox" },
      sideADeck: deck("a"), sideBDeck: deck("b"),
    }),
  })));

  const socketA = createTestSocket("profile-a");
  const socketB = createTestSocket("profile-b");
  stub._room.sockets.set("profile-a", [socketA]);
  stub._room.sockets.set("profile-b", [socketB]);

  await withClock(1_000, () => stub._room.instance.webSocketMessage(socketA, JSON.stringify({
    kind: "action", expected_revision: 0, action_id: "ws-1", action: { type: "submit_mulligan", hand_indices: [] },
  })));

  assert.equal(socketA.messages.length, 1);
  assert.equal(socketA.messages[0].ok, true);
  assert.equal(socketA.messages[0].view.self.sideId, "side_a");
  // broadcast() only pushed profile-b's own socket, and only its own view
  assert.equal(socketB.messages.length, 1);
  assert.equal(socketB.messages[0].view.self.sideId, "side_b");
  assert.equal(socketB.messages[0].view.opponent.sideId, "side_a");
});
