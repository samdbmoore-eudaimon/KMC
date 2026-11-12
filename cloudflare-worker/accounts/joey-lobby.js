// Joey multiplayer lobby: presence (§5) and challenge lifecycle (§6) of
// JOEY_MULTIPLAYER_SPEC.md. D1-backed, same style as the existing trade
// board (see handleTradeBoard et al in worker.js) — short-lived rows,
// expired lazily on read rather than needing a cron. Match creation itself
// (accepting a challenge) hands off to joey-match.js's createMatchRoom,
// which owns talking to the JoeyMatchRoom Durable Object.
import { json, sessionAccount, effectiveEntitlement, uuid } from "./worker.js";
import { JOEY_MODULE_KEYS, deriveGroupKey, isEligiblePlayerAccount, hasModuleEntitlement } from "./joey-group.js";
import { resolveProfileDeck } from "./joey-deck.js";
import { createMatchRoom } from "./joey-match.js";

export const JOEY_PRESENCE_TTL_MS = 90_000; // spec §5.1 / §24
export const JOEY_CHALLENGE_TTL_MS = 60_000; // spec §6.1 / §24

async function requireLobbyContext(request, env, profileId) {
  const account = await sessionAccount(env, request);
  if (!account) return { response: json({ ok: false, error: "invalid_session" }, 401) };
  if (!isEligiblePlayerAccount(account)) return { response: json({ ok: false, error: "not_eligible" }, 403) };
  const profile = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?")
    .bind(String(profileId || ""), account.account_id).first();
  if (!profile) return { response: json({ ok: false, error: "profile_not_found" }, 404) };
  const groupKey = deriveGroupKey(account);
  if (!groupKey) return { response: json({ ok: false, error: "not_eligible" }, 403) };
  return { account, profile, groupKey };
}

// Reverts a challenge's two participants to 'ready' (if their presence row is
// still live) once the challenge ends without creating a match — spec §6.3.
async function revertPresenceToReady(env, profileIds, now) {
  if (!profileIds.length) return;
  const placeholders = profileIds.map(() => "?").join(",");
  await env.DB.prepare(`UPDATE joey_presence SET state='ready' WHERE profile_id IN (${placeholders}) AND expires_at>?`)
    .bind(...profileIds, now).run();
}

async function expireGroupState(env, groupKey, now) {
  await env.DB.prepare("DELETE FROM joey_presence WHERE group_key=? AND expires_at<=?").bind(groupKey, now).run();
  const stale = await env.DB.prepare(
    "SELECT challenge_id, challenger_profile_id, challenged_profile_id FROM joey_challenges WHERE group_key=? AND state='pending' AND expires_at<=?"
  ).bind(groupKey, now).all();
  for (const row of stale.results || []) {
    await env.DB.prepare("UPDATE joey_challenges SET state='expired', resolved_at=? WHERE challenge_id=? AND state='pending'")
      .bind(now, row.challenge_id).run();
    await revertPresenceToReady(env, [row.challenger_profile_id, row.challenged_profile_id], now);
  }
}

export async function handleJoeyLobby(request, env) {
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profile_id");
  const moduleKey = String(url.searchParams.get("module") || "");
  if (!JOEY_MODULE_KEYS.includes(moduleKey)) return json({ ok: false, error: "bad_module" }, 400);
  const ctx = await requireLobbyContext(request, env, profileId);
  if (ctx.response) return ctx.response;
  const now = Date.now();
  await expireGroupState(env, ctx.groupKey, now);

  const own = await env.DB.prepare("SELECT state, expires_at FROM joey_presence WHERE profile_id=?").bind(profileId).first();
  const ready = await env.DB.prepare(
    `SELECT p.profile_id, ap.name, ap.avatar FROM joey_presence p
     JOIN account_profiles ap ON ap.profile_id=p.profile_id
     WHERE p.group_key=? AND p.module_key=? AND p.state='ready' AND p.profile_id<>? AND p.expires_at>?
     ORDER BY p.refreshed_at DESC LIMIT 50`
  ).bind(ctx.groupKey, moduleKey, profileId, now).all();
  const incoming = await env.DB.prepare(
    `SELECT c.challenge_id, c.expires_at, c.challenger_profile_id AS profile_id, ap.name, ap.avatar FROM joey_challenges c
     JOIN account_profiles ap ON ap.profile_id=c.challenger_profile_id
     WHERE c.challenged_profile_id=? AND c.state='pending' AND c.expires_at>?`
  ).bind(profileId, now).all();
  const outgoing = await env.DB.prepare(
    `SELECT c.challenge_id, c.expires_at, c.challenged_profile_id AS profile_id, ap.name, ap.avatar FROM joey_challenges c
     JOIN account_profiles ap ON ap.profile_id=c.challenged_profile_id
     WHERE c.challenger_profile_id=? AND c.state='pending' AND c.expires_at>?`
  ).bind(profileId, now).first();
  const activeMatch = await env.DB.prepare("SELECT match_id FROM joey_active_match WHERE profile_id=?").bind(profileId).first();

  return json({
    ok: true,
    module: moduleKey,
    ready_state: own?.state || null,
    ready_expires_at: own?.expires_at || null,
    ready_players: (ready.results || []).map((r) => ({ profile_id: r.profile_id, name: r.name, avatar: r.avatar })),
    incoming_challenges: (incoming.results || []).map((r) => ({ challenge_id: r.challenge_id, expires_at: r.expires_at, profile_id: r.profile_id, name: r.name, avatar: r.avatar })),
    outgoing_challenge: outgoing ? { challenge_id: outgoing.challenge_id, expires_at: outgoing.expires_at, profile_id: outgoing.profile_id, name: outgoing.name, avatar: outgoing.avatar } : null,
    recoverable_match_id: activeMatch?.match_id || null,
    server_time: now,
  });
}

export async function handleJoeyLobbyReady(request, env) {
  const body = await request.json().catch(() => null);
  const ctx = await requireLobbyContext(request, env, body?.profile_id);
  if (ctx.response) return ctx.response;
  const moduleKey = String(body?.module || "");
  if (!JOEY_MODULE_KEYS.includes(moduleKey)) return json({ ok: false, error: "bad_module" }, 400);
  const now = Date.now();
  await expireGroupState(env, ctx.groupKey, now);
  const entitlement = await effectiveEntitlement(env, ctx.account);
  if (!hasModuleEntitlement(entitlement.status, moduleKey)) return json({ ok: false, error: "entitlement_required" }, 403);
  const deckIndex = Number.isInteger(body?.deck_index) ? body.deck_index : 0;
  let progress;
  try { progress = JSON.parse(ctx.profile.progress); } catch { return json({ ok: false, error: "bad_progress" }, 409); }
  const deckResult = resolveProfileDeck(moduleKey, progress, deckIndex);
  if (!deckResult.ok) return json({ ok: false, error: deckResult.error }, 400);
  const inMatch = await env.DB.prepare("SELECT 1 FROM joey_active_match WHERE profile_id=?").bind(ctx.profile.profile_id).first();
  if (inMatch) return json({ ok: false, error: "already_in_match" }, 409);

  const blocking = await env.DB.prepare(
    "SELECT 1 FROM joey_challenges WHERE state='pending' AND (challenger_profile_id=? OR challenged_profile_id=?)"
  ).bind(ctx.profile.profile_id, ctx.profile.profile_id).first();
  const expiresAt = now + JOEY_PRESENCE_TTL_MS;
  await env.DB.prepare(
    `INSERT INTO joey_presence (profile_id, account_id, group_key, module_key, deck_index, state, created_at, refreshed_at, expires_at)
     VALUES (?,?,?,?,?,?,?,?,?)
     ON CONFLICT(profile_id) DO UPDATE SET
       account_id=excluded.account_id, group_key=excluded.group_key, module_key=excluded.module_key,
       deck_index=excluded.deck_index, state=excluded.state, refreshed_at=excluded.refreshed_at, expires_at=excluded.expires_at`
  ).bind(ctx.profile.profile_id, ctx.account.account_id, ctx.groupKey, moduleKey, deckIndex, blocking ? "challenging" : "ready", now, now, expiresAt).run();
  return json({ ok: true, expires_at: expiresAt, state: blocking ? "challenging" : "ready" });
}

export async function handleJoeyLobbyNotReady(request, env) {
  const body = await request.json().catch(() => null);
  const ctx = await requireLobbyContext(request, env, body?.profile_id);
  if (ctx.response) return ctx.response;
  await env.DB.prepare("DELETE FROM joey_presence WHERE profile_id=?").bind(ctx.profile.profile_id).run();
  return json({ ok: true });
}

export async function handleJoeyCreateChallenge(request, env) {
  const body = await request.json().catch(() => null);
  const ctx = await requireLobbyContext(request, env, body?.profile_id);
  if (ctx.response) return ctx.response;
  const now = Date.now();
  await expireGroupState(env, ctx.groupKey, now);

  const challengerPresence = await env.DB.prepare("SELECT * FROM joey_presence WHERE profile_id=? AND state='ready' AND expires_at>?")
    .bind(ctx.profile.profile_id, now).first();
  if (!challengerPresence) return json({ ok: false, error: "not_ready" }, 409);

  const alreadyPending = await env.DB.prepare("SELECT 1 FROM joey_challenges WHERE state='pending' AND challenger_profile_id=?")
    .bind(ctx.profile.profile_id).first();
  if (alreadyPending) return json({ ok: false, error: "challenge_already_pending" }, 409);

  const targetProfileId = String(body?.target_profile_id || "");
  if (!targetProfileId || targetProfileId === ctx.profile.profile_id) return json({ ok: false, error: "bad_target" }, 400);
  const targetPresence = await env.DB.prepare(
    "SELECT * FROM joey_presence WHERE profile_id=? AND group_key=? AND module_key=? AND state='ready' AND expires_at>?"
  ).bind(targetProfileId, ctx.groupKey, challengerPresence.module_key, now).first();
  if (!targetPresence) return json({ ok: false, error: "target_not_ready" }, 404);

  const challengeId = uuid();
  const expiresAt = now + JOEY_CHALLENGE_TTL_MS;
  await env.DB.prepare(
    `INSERT INTO joey_challenges (challenge_id, group_key, module_key, challenger_account_id, challenger_profile_id,
       challenged_account_id, challenged_profile_id, state, created_at, expires_at)
     VALUES (?,?,?,?,?,?,?,'pending',?,?)`
  ).bind(challengeId, ctx.groupKey, challengerPresence.module_key, ctx.account.account_id, ctx.profile.profile_id,
    targetPresence.account_id, targetProfileId, now, expiresAt).run();
  await env.DB.prepare("UPDATE joey_presence SET state='challenging' WHERE profile_id IN (?,?)")
    .bind(ctx.profile.profile_id, targetProfileId).run();

  return json({ ok: true, challenge_id: challengeId, expires_at: expiresAt });
}

async function loadChallenge(env, challengeId) {
  return env.DB.prepare("SELECT * FROM joey_challenges WHERE challenge_id=?").bind(challengeId).first();
}

export async function handleJoeyDeclineChallenge(request, env, challengeId) {
  const body = await request.json().catch(() => null);
  const ctx = await requireLobbyContext(request, env, body?.profile_id);
  if (ctx.response) return ctx.response;
  const challenge = await loadChallenge(env, challengeId);
  if (!challenge) return json({ ok: false, error: "not_found" }, 404);
  if (challenge.challenged_profile_id !== ctx.profile.profile_id) return json({ ok: false, error: "forbidden" }, 403);
  const now = Date.now();
  if (challenge.state !== "pending" || challenge.expires_at <= now) {
    return json({ ok: false, error: challenge.expires_at <= now ? "challenge_expired" : `challenge_${challenge.state}` }, 409);
  }
  await env.DB.prepare("UPDATE joey_challenges SET state='declined', resolved_at=? WHERE challenge_id=? AND state='pending'")
    .bind(now, challengeId).run();
  await revertPresenceToReady(env, [challenge.challenger_profile_id, challenge.challenged_profile_id], now);
  return json({ ok: true });
}

export async function handleJoeyCancelChallenge(request, env, challengeId) {
  const body = await request.json().catch(() => null);
  const ctx = await requireLobbyContext(request, env, body?.profile_id);
  if (ctx.response) return ctx.response;
  const challenge = await loadChallenge(env, challengeId);
  if (!challenge) return json({ ok: false, error: "not_found" }, 404);
  if (challenge.challenger_profile_id !== ctx.profile.profile_id) return json({ ok: false, error: "forbidden" }, 403);
  const now = Date.now();
  if (challenge.state !== "pending" || challenge.expires_at <= now) {
    return json({ ok: false, error: challenge.expires_at <= now ? "challenge_expired" : `challenge_${challenge.state}` }, 409);
  }
  await env.DB.prepare("UPDATE joey_challenges SET state='cancelled', resolved_at=? WHERE challenge_id=? AND state='pending'")
    .bind(now, challengeId).run();
  await revertPresenceToReady(env, [challenge.challenger_profile_id, challenge.challenged_profile_id], now);
  return json({ ok: true });
}

export async function handleJoeyAcceptChallenge(request, env, challengeId) {
  const body = await request.json().catch(() => null);
  const ctx = await requireLobbyContext(request, env, body?.profile_id);
  if (ctx.response) return ctx.response;
  const challenge = await loadChallenge(env, challengeId);
  if (!challenge) return json({ ok: false, error: "not_found" }, 404);
  if (challenge.challenged_profile_id !== ctx.profile.profile_id) return json({ ok: false, error: "forbidden" }, 403);

  // Idempotent accept (spec §6.2): a repeat call for an already-created match
  // just hands back that match's view instead of erroring.
  if (challenge.state === "match_created" && challenge.match_id) {
    const view = await createMatchRoom.getExistingView(env, challenge.match_id, ctx.profile.profile_id);
    return json({ ok: true, match_id: challenge.match_id, view });
  }

  const now = Date.now();
  if (challenge.expires_at <= now && challenge.state === "pending") {
    await env.DB.prepare("UPDATE joey_challenges SET state='expired', resolved_at=? WHERE challenge_id=? AND state='pending'").bind(now, challengeId).run();
    await revertPresenceToReady(env, [challenge.challenger_profile_id, challenge.challenged_profile_id], now);
    return json({ ok: false, error: "challenge_expired" }, 409);
  }
  if (challenge.state !== "pending") return json({ ok: false, error: `challenge_${challenge.state}` }, 409);

  const challengerAccount = await env.DB.prepare("SELECT * FROM accounts WHERE account_id=?").bind(challenge.challenger_account_id).first();
  const challengerProfile = await env.DB.prepare("SELECT * FROM account_profiles WHERE profile_id=? AND account_id=?")
    .bind(challenge.challenger_profile_id, challenge.challenger_account_id).first();
  if (!challengerAccount || !challengerProfile) return json({ ok: false, error: "challenger_unavailable" }, 409);
  if (deriveGroupKey(challengerAccount) !== challenge.group_key || deriveGroupKey(ctx.account) !== challenge.group_key) {
    return json({ ok: false, error: "group_mismatch" }, 403);
  }

  const challengerPresence = await env.DB.prepare("SELECT * FROM joey_presence WHERE profile_id=?").bind(challenge.challenger_profile_id).first();
  const challengedPresence = await env.DB.prepare("SELECT * FROM joey_presence WHERE profile_id=?").bind(ctx.profile.profile_id).first();
  if (!challengerPresence || !challengedPresence) return json({ ok: false, error: "presence_lost" }, 409);

  // Re-check entitlement for both sides (spec §6.2 "rechecks eligibility") —
  // cheap and the challenge window is short, but a lapsed subscription mid-
  // flight must not slip a paid-only module's match through.
  const challengerEntitlement = await effectiveEntitlement(env, challengerAccount);
  if (!hasModuleEntitlement(challengerEntitlement.status, challenge.module_key)) return json({ ok: false, error: "challenger_entitlement_required" }, 403);
  const challengedEntitlement = await effectiveEntitlement(env, ctx.account);
  if (!hasModuleEntitlement(challengedEntitlement.status, challenge.module_key)) return json({ ok: false, error: "entitlement_required" }, 403);

  let challengerProgress, challengedProgress;
  try {
    challengerProgress = JSON.parse(challengerProfile.progress);
    challengedProgress = JSON.parse(ctx.profile.progress);
  } catch { return json({ ok: false, error: "bad_progress" }, 409); }
  const challengerDeck = resolveProfileDeck(challenge.module_key, challengerProgress, challengerPresence.deck_index);
  const challengedDeck = resolveProfileDeck(challenge.module_key, challengedProgress, challengedPresence.deck_index);
  if (!challengerDeck.ok) return json({ ok: false, error: `challenger_${challengerDeck.error}` }, 409);
  if (!challengedDeck.ok) return json({ ok: false, error: `challenged_${challengedDeck.error}` }, 409);

  const casResult = await env.DB.prepare("UPDATE joey_challenges SET state='accepted', resolved_at=? WHERE challenge_id=? AND state='pending'")
    .bind(now, challengeId).run();
  if (!casResult.meta?.changes) {
    const fresh = await loadChallenge(env, challengeId);
    return json({ ok: false, error: `challenge_${fresh.state}` }, 409);
  }

  const matchId = uuid();
  try {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO joey_active_match (profile_id, match_id, account_id, side, group_key, module_key, created_at) VALUES (?,?,?,?,?,?,?)")
        .bind(challenge.challenger_profile_id, matchId, challenge.challenger_account_id, "side_a", challenge.group_key, challenge.module_key, now),
      env.DB.prepare("INSERT INTO joey_active_match (profile_id, match_id, account_id, side, group_key, module_key, created_at) VALUES (?,?,?,?,?,?,?)")
        .bind(ctx.profile.profile_id, matchId, ctx.account.account_id, "side_b", challenge.group_key, challenge.module_key, now),
    ]);
  } catch {
    await env.DB.prepare("UPDATE joey_challenges SET state='superseded', resolved_at=? WHERE challenge_id=?").bind(now, challengeId).run();
    return json({ ok: false, error: "superseded" }, 409);
  }

  await createMatchRoom.init(env, {
    matchId,
    moduleKey: challenge.module_key,
    groupKey: challenge.group_key,
    sideA: { accountId: challengerAccount.account_id, profileId: challengerProfile.profile_id, name: challengerProfile.name, avatar: challengerProfile.avatar },
    sideB: { accountId: ctx.account.account_id, profileId: ctx.profile.profile_id, name: ctx.profile.name, avatar: ctx.profile.avatar },
    sideADeck: challengerDeck.deck,
    sideBDeck: challengedDeck.deck,
  });

  await env.DB.prepare(
    `INSERT INTO joey_matches (match_id, group_key, module_key, side_a_account_id, side_a_profile_id, side_b_account_id, side_b_profile_id, status, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,'active',?,?)`
  ).bind(matchId, challenge.group_key, challenge.module_key, challengerAccount.account_id, challengerProfile.profile_id, ctx.account.account_id, ctx.profile.profile_id, now, now).run();
  await env.DB.prepare("UPDATE joey_challenges SET state='match_created', resolved_at=?, match_id=? WHERE challenge_id=?").bind(now, matchId, challengeId).run();
  await env.DB.prepare("DELETE FROM joey_presence WHERE profile_id IN (?,?)").bind(challenge.challenger_profile_id, ctx.profile.profile_id).run();

  const view = await createMatchRoom.getExistingView(env, matchId, ctx.profile.profile_id);
  return json({ ok: true, match_id: matchId, view });
}
