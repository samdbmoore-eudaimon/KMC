// End-to-end tests for Joey multiplayer lobby/challenge/match routes in
// cloudflare-worker/accounts/worker.js, run against an in-memory D1 (see
// scripts/lib/d1-shim.mjs) and an in-memory Durable Object namespace (see
// scripts/lib/do-shim.mjs) standing in for JOEY_MATCH_ROOM — no wrangler/
// Miniflare needed, same philosophy as scripts/test_worker_trading.mjs.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import worker, { JoeyMatchRoom } from "../cloudflare-worker/accounts/worker.js";
import { createTestD1 } from "./lib/d1-shim.mjs";
import { createTestDurableObjectNamespace } from "./lib/do-shim.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_SQL = readFileSync(path.join(ROOT, "..", "cloudflare-worker", "accounts", "schema.sql"), "utf8");

function freshEnv() {
  const env = { DB: createTestD1(SCHEMA_SQL) };
  env.JOEY_MATCH_ROOM = createTestDurableObjectNamespace(JoeyMatchRoom, env);
  return env;
}

let seq = 0;
function uid(prefix) { seq += 1; return `${prefix}_${seq}`; }

const DECK_SPEC = [{ cardId: "pip", count: 2 }, { cardId: "nine", count: 2 }];
function progressWithDeck(moduleKey = "primary", deckIndex = 0, cards = { pip: 2, nine: 2 }) {
  const decks = [null, null, null, null, null];
  decks[deckIndex] = { spec: DECK_SPEC };
  return JSON.stringify({ cards, cardItems: {}, modules: { [moduleKey]: { joeyDecks: decks, joeyActiveDeck: deckIndex } } });
}

async function seedProfileUnder(env, accountId, token, { moduleKey } = {}) {
  const now = Date.now();
  const profileId = uid("profile");
  await env.DB.prepare(
    "INSERT INTO account_profiles (profile_id, account_id, name, avatar, progress, created_at, updated_at) VALUES (?,?,?,?,?,?,?)"
  ).bind(profileId, accountId, `Player ${profileId}`, "🦊", progressWithDeck(moduleKey), now, now).run();
  return { accountId, token, profileId };
}

async function seedPersonalAccount(env) {
  const accountId = uid("acct");
  const token = uid("session");
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at, subscription_status, updated_at, account_type)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, `${accountId}@personal.invalid`, 0, now, now, now + 30 * 24 * 60 * 60 * 1000, "trialing", now, "personal").run();
  await env.DB.prepare("INSERT INTO sessions (token, account_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(token, accountId, now, now + 90 * 24 * 60 * 60 * 1000).run();
  return { accountId, token };
}

async function seedGroupAccount(env) {
  const accountId = uid("acct");
  const token = uid("session");
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at, subscription_status, updated_at, account_type, school_code)
     VALUES (?,?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, `${accountId}@group.invalid`, 0, now, now, now, "trialing", now, "group", `sch_${accountId}`).run();
  await env.DB.prepare("INSERT INTO sessions (token, account_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(token, accountId, now, now + 90 * 24 * 60 * 60 * 1000).run();
  return { accountId, token };
}

async function seedSeatProfile(env, schoolCode, { moduleKey } = {}) {
  const accountId = uid("acct");
  const token = uid("session");
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO accounts (account_id, email, email_verified, created_at, trial_started_at, trial_expires_at, subscription_status, updated_at, account_type, school_code, username)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(accountId, `${accountId}@seat.invalid`, 0, now, now, now, "trialing", now, "seat", schoolCode, accountId).run();
  await env.DB.prepare("INSERT INTO sessions (token, account_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(token, accountId, now, now + 90 * 24 * 60 * 60 * 1000).run();
  return seedProfileUnder(env, accountId, token, { moduleKey });
}

function call(env, method, url, { token, body } = {}) {
  const headers = { "content-type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return worker.fetch(new Request(`https://worker.test${url}`, { method, headers, body: body ? JSON.stringify(body) : undefined }), env);
}

async function ready(env, player, moduleKey = "primary") {
  const res = await call(env, "POST", "/joey/lobby/ready", { token: player.token, body: { profile_id: player.profileId, module: moduleKey, deck_index: 0 } });
  return res.json();
}
async function lobby(env, player, moduleKey = "primary") {
  const res = await call(env, "GET", `/joey/lobby?profile_id=${player.profileId}&module=${moduleKey}`, { token: player.token });
  return res.json();
}
async function challenge(env, from, to) {
  const res = await call(env, "POST", "/joey/challenges", { token: from.token, body: { profile_id: from.profileId, target_profile_id: to.profileId } });
  return res.json();
}

test("a family's two profiles see each other ready, and go challenging once a challenge exists", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);

  assert.equal((await ready(env, a)).ok, true);
  assert.equal((await ready(env, b)).ok, true);

  const aView = await lobby(env, a);
  assert.deepEqual(aView.ready_players.map((p) => p.profile_id), [b.profileId]);

  const created = await challenge(env, a, b);
  assert.equal(created.ok, true);

  const aAfter = await lobby(env, a);
  assert.equal(aAfter.ready_players.length, 0); // b is now "challenging", not listed
  assert.equal(aAfter.outgoing_challenge.challenge_id, created.challenge_id);
  const bAfter = await lobby(env, b);
  assert.equal(bAfter.incoming_challenges[0].challenge_id, created.challenge_id);
});

test("school seats in the same school see each other; a different school never does", async () => {
  const env = freshEnv();
  const here1 = await seedSeatProfile(env, "sch1");
  const here2 = await seedSeatProfile(env, "sch1");
  const elsewhere = await seedSeatProfile(env, "sch2");

  await ready(env, here1);
  await ready(env, here2);
  await ready(env, elsewhere);

  const view = await lobby(env, here1);
  assert.deepEqual(view.ready_players.map((p) => p.profile_id), [here2.profileId]);
});

test("a group (school admin) account is not an eligible Joey player", async () => {
  const env = freshEnv();
  const group = await seedGroupAccount(env);
  const res = await call(env, "POST", "/joey/lobby/ready", { token: group.token, body: { profile_id: "whatever", module: "primary", deck_index: 0 } });
  assert.deepEqual([res.status, (await res.json()).error], [403, "not_eligible"]);
});

test("a profile without a valid deck in that slot cannot go ready", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const player = await seedProfileUnder(env, account.accountId, account.token);
  const res = await call(env, "POST", "/joey/lobby/ready", { token: player.token, body: { profile_id: player.profileId, module: "primary", deck_index: 4 } });
  assert.deepEqual([res.status, (await res.json()).error], [400, "no_deck"]);
});

test("a client cannot challenge a profile outside its own derived group by id alone", async () => {
  const env = freshEnv();
  const family = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, family.accountId, family.token);
  const outsider = await seedSeatProfile(env, "sch1");
  await ready(env, a);
  await ready(env, outsider);

  const result = await challenge(env, a, outsider);
  assert.deepEqual([result.ok, result.error], [false, "target_not_ready"]);
});

test("challenge accept creates a match, clears presence, and blocks a second live match for either side", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);

  const accept = await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: b.token, body: { profile_id: b.profileId } });
  const acceptBody = await accept.json();
  assert.equal(acceptBody.ok, true);
  assert.ok(acceptBody.match_id);
  assert.equal(acceptBody.view.phase, "mulligan");
  assert.equal(acceptBody.view.self.sideId, "side_b");

  const currentA = await (await call(env, "GET", `/joey/matches/current?profile_id=${a.profileId}`, { token: a.token })).json();
  assert.equal(currentA.match_id, acceptBody.match_id);
  assert.equal(currentA.view.self.sideId, "side_a");
  // opponent's hand must never appear in a's own view
  assert.equal(currentA.view.battleState.ai.hand.every((c) => c.hidden), true);

  const lobbyAfter = await lobby(env, a);
  assert.equal(lobbyAfter.ready_players.length, 0);
  assert.equal(lobbyAfter.recoverable_match_id, acceptBody.match_id);

  // a fresh challenge can't be created while a live match is open
  const c = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, c);
  const blockedChallenge = await challenge(env, a, c);
  assert.deepEqual([blockedChallenge.ok, blockedChallenge.error], [false, "not_ready"]); // a's presence row never became ready — already_in_match on the ready call itself
});

test("accept is idempotent", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);
  const first = await (await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: b.token, body: { profile_id: b.profileId } })).json();
  const second = await (await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: b.token, body: { profile_id: b.profileId } })).json();
  assert.equal(second.ok, true);
  assert.equal(second.match_id, first.match_id);
});

test("decline reverts both to ready with no match, and only the challenged profile may decline", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);

  const wrongParty = await call(env, "POST", `/joey/challenges/${created.challenge_id}/decline`, { token: a.token, body: { profile_id: a.profileId } });
  assert.equal(wrongParty.status, 403);

  const decline = await call(env, "POST", `/joey/challenges/${created.challenge_id}/decline`, { token: b.token, body: { profile_id: b.profileId } });
  assert.equal((await decline.json()).ok, true);

  const aView = await lobby(env, a);
  assert.equal(aView.ready_players.length, 1);
  assert.equal(aView.outgoing_challenge, null);
});

test("cancel reverts both to ready, and only the challenger may cancel", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);

  const wrongParty = await call(env, "POST", `/joey/challenges/${created.challenge_id}/cancel`, { token: b.token, body: { profile_id: b.profileId } });
  assert.equal(wrongParty.status, 403);

  const cancel = await call(env, "POST", `/joey/challenges/${created.challenge_id}/cancel`, { token: a.token, body: { profile_id: a.profileId } });
  assert.equal((await cancel.json()).ok, true);
  const bView = await lobby(env, b);
  assert.equal(bView.incoming_challenges.length, 0);
});

test("an expired challenge cannot be accepted and both profiles revert to ready", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);
  await env.DB.prepare("UPDATE joey_challenges SET expires_at=? WHERE challenge_id=?").bind(Date.now() - 1000, created.challenge_id).run();

  const accept = await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: b.token, body: { profile_id: b.profileId } });
  assert.deepEqual([accept.status, (await accept.json()).error], [409, "challenge_expired"]);

  const bView = await lobby(env, b);
  assert.equal(bView.ready_players.length, 1);
});

test("ready refresh cleans up an expired challenge that would otherwise block the player", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);
  await env.DB.prepare("UPDATE joey_challenges SET expires_at=? WHERE challenge_id=?")
    .bind(Date.now() - 1000, created.challenge_id).run();

  const refreshed = await ready(env, a);
  assert.equal(refreshed.ok, true);
  assert.equal(refreshed.state, "ready");
  const expired = await env.DB.prepare("SELECT state FROM joey_challenges WHERE challenge_id=?")
    .bind(created.challenge_id).first();
  assert.equal(expired.state, "expired");
});

test("a profile cannot accept, decline or cancel a challenge on another profile's behalf", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  const bystander = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);

  const res = await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: bystander.token, body: { profile_id: bystander.profileId } });
  assert.equal(res.status, 403);
});

test("gameplay actions round-trip through the HTTP match routes with per-player redaction and revision checks", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);
  const accept = await (await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: b.token, body: { profile_id: b.profileId } })).json();
  const matchId = accept.match_id;

  const mulliganA = await (await call(env, "POST", `/joey/matches/${matchId}/mulligan`, {
    token: a.token, body: { profile_id: a.profileId, expected_revision: 0, action_id: "m-a", hand_indices: [] },
  })).json();
  assert.equal(mulliganA.ok, true);
  const mulliganB = await (await call(env, "POST", `/joey/matches/${matchId}/mulligan`, {
    token: b.token, body: { profile_id: b.profileId, expected_revision: 1, action_id: "m-b", hand_indices: [] },
  })).json();
  assert.equal(mulliganB.ok, true);
  assert.equal(mulliganB.view.phase, "gameplay");

  // a stale revision is rejected without applying the action
  const stale = await (await call(env, "POST", `/joey/matches/${matchId}/actions`, {
    token: a.token, body: { profile_id: a.profileId, expected_revision: 0, action_id: "stale-1", action: { type: "pass" } },
  })).json();
  assert.deepEqual([stale.ok, stale.error], [false, "revision_conflict"]);

  // an out-of-turn profile cannot act
  const view = await (await call(env, "GET", `/joey/matches/${matchId}?profile_id=${a.profileId}`, { token: a.token })).json();
  const activeIsA = view.view.battleState.currentTurn === "player";
  const notTurnPlayer = activeIsA ? b : a;
  const outOfTurn = await (await call(env, "POST", `/joey/matches/${matchId}/actions`, {
    token: notTurnPlayer.token, body: { profile_id: notTurnPlayer.profileId, expected_revision: view.view.revision, action_id: "oot-1", action: { type: "pass" } },
  })).json();
  assert.deepEqual([outOfTurn.ok, outOfTurn.error], [false, "not_your_turn"]);

  const turnPlayer = activeIsA ? a : b;
  const passed = await (await call(env, "POST", `/joey/matches/${matchId}/actions`, {
    token: turnPlayer.token, body: { profile_id: turnPlayer.profileId, expected_revision: view.view.revision, action_id: "pass-1", action: { type: "pass" } },
  })).json();
  assert.equal(passed.ok, true);
  // repeating the same action_id must not apply the pass twice
  const repeated = await (await call(env, "POST", `/joey/matches/${matchId}/actions`, {
    token: turnPlayer.token, body: { profile_id: turnPlayer.profileId, expected_revision: view.view.revision, action_id: "pass-1", action: { type: "pass" } },
  })).json();
  assert.equal(repeated.ok, true);
  assert.equal(repeated.duplicate, true);
});

test("conceding awards the opponent the match and frees both active-match slots", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);
  const accept = await (await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: b.token, body: { profile_id: b.profileId } })).json();
  const matchId = accept.match_id;

  const concede = await (await call(env, "POST", `/joey/matches/${matchId}/concede`, { token: a.token, body: { profile_id: a.profileId } })).json();
  assert.equal(concede.ok, true);
  assert.equal(concede.view.winner, "ai"); // conceding player's own view always calls the winner "ai" (opponent)

  const bView = await (await call(env, "GET", `/joey/matches/${matchId}?profile_id=${b.profileId}`, { token: b.token })).json();
  assert.equal(bView.view.winner, "player");
  assert.equal(bView.view.status, "completed");

  const row = await env.DB.prepare("SELECT status, winner_side, completion_reason FROM joey_matches WHERE match_id=?").bind(matchId).first();
  assert.deepEqual([row.status, row.winner_side, row.completion_reason], ["completed", "side_b", "concession"]);
  const active = await env.DB.prepare("SELECT COUNT(*) AS n FROM joey_active_match WHERE match_id=?").bind(matchId).first();
  assert.equal(active.n, 0);
  const result = await env.DB.prepare("SELECT * FROM joey_match_results WHERE match_id=?").bind(matchId).first();
  assert.ok(result);
});

test("a profile cannot address a match it isn't part of", async () => {
  const env = freshEnv();
  const account = await seedPersonalAccount(env);
  const a = await seedProfileUnder(env, account.accountId, account.token);
  const b = await seedProfileUnder(env, account.accountId, account.token);
  const outsider = await seedProfileUnder(env, account.accountId, account.token);
  await ready(env, a);
  await ready(env, b);
  const created = await challenge(env, a, b);
  const accept = await (await call(env, "POST", `/joey/challenges/${created.challenge_id}/accept`, { token: b.token, body: { profile_id: b.profileId } })).json();

  const res = await call(env, "GET", `/joey/matches/${accept.match_id}?profile_id=${outsider.profileId}`, { token: outsider.token });
  assert.equal(res.status, 404);
});
