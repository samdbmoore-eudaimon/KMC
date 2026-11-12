// Pure match-room state machine for the JoeyMatchRoom Durable Object —
// everything here is testable with a plain in-memory fake of the storage API
// (get/put/delete/setAlarm/deleteAlarm — exactly the methods a real
// DurableObjectStorage exposes), with no Durable Object runtime, WebSocket or
// D1 involved. All actual Joey rules and redaction come from
// joey-multiplayer.js; this file only owns *when* the room persists, wakes up
// and gives up on an abandoned match (spec §9, §11, §12) — it never touches
// battle rules itself.
import {
  createMultiplayerMatch,
  applyMultiplayerAction,
  advanceMultiplayerTimeouts,
  concedeMultiplayerMatch,
  getMultiplayerPlayerView,
} from "../../joey-multiplayer.js";

const KEY_MATCH = "match";
const KEY_ACTIVITY = "lastActivityAt";

// "the server may close a match as abandoned when it has received no player
// connection or action for 10 minutes" — JOEY_MULTIPLAYER_SPEC.md §12.
export const JOEY_ABANDON_MS = 10 * 60 * 1000;

export async function loadMatch(storage) {
  const match = await storage.get(KEY_MATCH);
  return match || null;
}

async function readActivity(storage, fallback) {
  const value = await storage.get(KEY_ACTIVITY);
  return Number.isFinite(value) ? value : fallback;
}

function nextRuleDeadline(match) {
  if (!match || match.status !== "active") return null;
  const deadlines = [];
  if (match.phase === "mulligan") {
    for (const sideId of ["side_a", "side_b"]) {
      const side = match.mulligan[sideId];
      if (!side.confirmed) deadlines.push(side.deadlineAt);
    }
  } else if (match.phase === "gameplay" && Number.isFinite(match.turnDeadlineAt)) {
    deadlines.push(match.turnDeadlineAt);
  }
  return deadlines.length ? Math.min(...deadlines) : null;
}

// The room always wakes for whichever comes first: the next rule-driven
// deadline (mulligan/turn timeout) or the abandonment cutoff, so a silent
// room still gets swept even once every in-battle timer has stopped mattering.
async function scheduleAlarm(storage, match, activityAt) {
  const candidates = [];
  const ruleDeadline = nextRuleDeadline(match);
  if (ruleDeadline !== null) candidates.push(ruleDeadline);
  if (match && match.status === "active" && Number.isFinite(activityAt)) candidates.push(activityAt + JOEY_ABANDON_MS);
  if (!candidates.length) { await storage.deleteAlarm(); return; }
  await storage.setAlarm(Math.min(...candidates));
}

// Idempotent: a retried /init (e.g. a challenge-accept retry) returns the
// already-created match rather than starting a second one.
export async function initMatch(storage, params, now) {
  const existing = await loadMatch(storage);
  if (existing) return { ok: true, match: existing, created: false };
  const match = createMultiplayerMatch({ ...params, now });
  await storage.put(KEY_MATCH, match);
  await storage.put(KEY_ACTIVITY, now);
  await scheduleAlarm(storage, match, now);
  return { ok: true, match, created: true };
}

// A submitted mulligan choice or gameplay action — both go through
// applyMultiplayerAction, which already dispatches on match.phase. Any
// contact from a profile that actually belongs to this match counts as
// activity for the abandonment clock (spec §12's "no player connection or
// action"), whether or not the action itself turned out to be legal — a
// rejected-but-received action still proves somebody is there.
export async function applyAction(storage, params, now) {
  const match = await loadMatch(storage);
  if (!match) return { ok: false, error: "match_not_found" };
  const result = applyMultiplayerAction(match, { ...params, now });
  await storage.put(KEY_MATCH, result.match);
  const activityAt = result.error === "forbidden" ? await readActivity(storage, now) : now;
  if (activityAt === now) await storage.put(KEY_ACTIVITY, now);
  await scheduleAlarm(storage, result.match, activityAt);
  return result;
}

export async function concedeMatch(storage, profileId, now) {
  const match = await loadMatch(storage);
  if (!match) return { ok: false, error: "match_not_found" };
  const result = concedeMultiplayerMatch(match, profileId, now);
  await storage.put(KEY_MATCH, result.match);
  const activityAt = result.error === "forbidden" ? await readActivity(storage, now) : now;
  if (activityAt === now) await storage.put(KEY_ACTIVITY, now);
  await scheduleAlarm(storage, result.match, activityAt);
  return result;
}

// Reconnect/poll path (spec §11): always advances any timeouts that are
// already due before handing back a view, so a client that reconnects after
// its deadline sees the server-applied timeout result immediately. A
// successful view for a real participant is itself "a player connection"
// (§12), so it resets the abandonment clock the same as a submitted action.
export async function getView(storage, profileId, now) {
  const match = await loadMatch(storage);
  if (!match) return { ok: false, error: "match_not_found" };
  const timed = advanceMultiplayerTimeouts(match, now);
  const view = getMultiplayerPlayerView(timed.match, profileId, now);
  if (!view) return { ok: false, error: "forbidden" };
  if (timed.changed) await storage.put(KEY_MATCH, timed.match);
  await storage.put(KEY_ACTIVITY, now);
  await scheduleAlarm(storage, timed.match, now);
  return { ok: true, match: timed.match, view };
}

// A live connection counts as activity even if the player takes no action
// this tick — otherwise a match both players are actively watching but
// neither has an immediate legal move in could still be swept as abandoned.
export async function markActivity(storage, now) {
  const match = await loadMatch(storage);
  if (!match) return;
  await storage.put(KEY_ACTIVITY, now);
  await scheduleAlarm(storage, match, now);
}

// The alarm handler: apply any due rule timeouts, then check abandonment.
// completionReason 'abandoned' is distinct from every normal/concession
// ending so the caller (joey-room.js) knows not to record a winner.
export async function runAlarm(storage, now) {
  const match = await loadMatch(storage);
  if (!match) return { match: null, changed: false, abandoned: false };
  const timed = advanceMultiplayerTimeouts(match, now);
  let result = timed.match;
  let abandoned = false;
  const activityAt = await readActivity(storage, now);
  if (result.status === "active" && now - activityAt >= JOEY_ABANDON_MS) {
    result = {
      ...result,
      status: "abandoned",
      phase: "completed",
      completedAt: now,
      updatedAt: now,
      revision: result.revision + 1,
      completionReason: "abandoned",
      winnerSide: null,
      turnStartedAt: null,
      turnDeadlineAt: null,
      battleState: { ...result.battleState, battleFinished: true },
    };
    abandoned = true;
  }
  await storage.put(KEY_MATCH, result);
  await scheduleAlarm(storage, result, activityAt);
  return { match: result, changed: timed.changed || abandoned, abandoned };
}
