// Commander slot (EXPEDITIONS_BUILD_BRIEF.md §3, §16 and EXPEDITIONS_ROSTER.md). One owned
// boss card may occupy the Commander slot; its once-per-expedition power is a scenario
// modifier, never another figure on the board, and never satisfies a field-card rarity
// recommendation (expedition-readiness.js already guarantees that by construction — a
// Commander is simply never passed into the field-card list).
//
// Only a subset of the thirty authored powers reuse a mechanism this engine already
// implements (reposition, stabilise, reveal intent, adjust one value, extend an enemy's
// watch, delay initiative, reserve a hex, repeat an interaction free of its action-point
// cost, rotate a route marker, reveal a weighted edge, restore a changed tile). The rest
// name mechanisms EXPEDITIONS_BUILD_BRIEF.md itself defers to later stages — market rates,
// ledger statements, concealed estimates, partition regions, swarm counting, expression
// substitution, a chain-constraint override, reversible forced movement, an
// optimise-family lock and predicted edge closure — none of which exist yet. Rather than
// invent those mechanics now, every commander has a registry entry, but an unimplemented
// one is clearly marked as such and refuses to apply with a specific reason (ROS-09: "every
// Commander power references an implemented effect before becoming selectable").

import { edgesFromNode, hexDistance, restoreTileTerrain } from "./expedition-engine.js";

function cloneState(state) {
  return structuredClone(state);
}

function requireHex(state, hex) {
  if (!state.board[hex]) throw new Error(`${hex} is not on the board`);
  return state.board[hex];
}

function requireOpenHex(state, hex) {
  const tile = requireHex(state, hex);
  if (tile.terrain === "blocked") throw new Error(`${hex} is already blocked`);
  const occupied = Object.values(state.units).some((unit) => unit.hp > 0 && unit.pos === hex) || Object.values(state.objects).some((object) => object.pos === hex);
  if (occupied) throw new Error(`${hex} is not open`);
  return tile;
}

// First Crow (primary L1): "After deployment, move one hero one hex."
function repositionOneHex(state, payload) {
  const next = cloneState(state);
  const unit = next.units[payload.unitId];
  if (!unit || unit.side !== "player") throw new Error(`${payload.unitId} is not a field unit`);
  requireOpenHex(next, payload.destination);
  unit.pos = payload.destination;
  return next;
}

// Old Roughweather (primary L2) and The Almost (junior L9): "Correct an objective/copied
// value by one." Reused as one generic effect since both are the same one-point nudge.
function adjustValueByOne(state, payload) {
  const next = cloneState(state);
  const object = next.objects[payload.objectId];
  if (!object) throw new Error(`${payload.objectId} is not a known object`);
  const delta = payload.delta === -1 ? -1 : 1;
  object.value = Number(object.value || 0) + delta;
  return next;
}

// Scratch (primary L4) and Whistle's Price (intermediate L7): "Stabilise one scenario
// object [[for the first enemy phase] / [for a round]]." Reuses the existing Stabilise rule.
function stabiliseObject(state, payload) {
  const next = cloneState(state);
  const target = next.objects[payload.targetId] || next.units[payload.targetId];
  if (!target) throw new Error(`${payload.targetId} is not a known target`);
  target.stabilisedUntil = next.turn + 1;
  return next;
}

// The Maybe-Flock (primary L5): "Reveal every enemy's first intention."
function revealAllIntents(state) {
  const next = cloneState(state);
  for (const unit of Object.values(next.units)) if (unit.side === "enemy") unit.intentRevealed = true;
  return next;
}

// Strawless (primary L6): "Place one temporary obstacle on an open hex." Records the tile's
// previous terrain before blocking it, so restoreTileTerrain (junior_commander_4) can
// reverse it later — still not a scheduled, automatic removal, but no longer permanent
// either.
function placeObstacle(state, payload) {
  const next = cloneState(state);
  const tile = requireOpenHex(next, payload.hex);
  tile.previousTerrain = tile.terrain;
  tile.terrain = "blocked";
  return next;
}

// Old Roughweather's counterpart in Little Reckoning: "Remember and restore one changed
// tile." Reverses whatever placeObstacle (or any future terrain change) recorded.
function restoreChangedTile(state, payload) {
  return restoreTileTerrain(state, payload.hex);
}

// Route markers rotate in place: primary_commander_3, "Rotate one route marker before the
// first round." `steps` may be any integer; orientation always normalises to 0-5.
function rotateRouteMarker(state, payload) {
  const next = cloneState(state);
  const marker = next.objects[payload.markerId];
  if (!marker || !("orientation" in marker) || !("paths" in marker)) throw new Error(`${payload.markerId} is not a route marker`);
  const steps = payload.steps ?? 1;
  marker.orientation = ((marker.orientation + steps) % 6 + 6) % 6;
  return next;
}

// intermediate_commander_2: "Reveal the cost of every edge leaving one node." Marks the node
// as revealed in state.flags (the same "engine owns it, UI reads it" pattern revealAllIntents
// and the balance objective's weigh-bridge state already use) rather than returning the
// costs directly — a Commander power transforms state, it does not answer a query.
function revealEdgeCosts(state, payload) {
  const next = cloneState(state);
  const touching = edgesFromNode(next.objective?.edges, payload.nodeId);
  if (!touching.length) throw new Error(`${payload.nodeId} has no edges to reveal`);
  next.flags.revealedEdgeNodes = [...new Set([...(next.flags.revealedEdgeNodes || []), payload.nodeId])];
  return next;
}

// Hollow Bough (primary L8): "Reserve one hex that no figure may enter for a round."
function reserveHexForRound(state, payload) {
  const next = cloneState(state);
  const tile = requireOpenHex(next, payload.hex);
  tile.blockedUntilTurn = next.turn + 1;
  return next;
}

// The Countless (junior L7): "Freeze one swarm group for a round." Reuses the existing
// `delay` field enemies already use to sit out a round watching.
function extendEnemyWatch(state, payload) {
  const next = cloneState(state);
  const enemy = next.units[payload.enemyId];
  if (!enemy || enemy.side !== "enemy") throw new Error(`${payload.enemyId} is not an enemy`);
  enemy.delay = Math.max(enemy.delay || 0, next.turn);
  return next;
}

// Senior Examiner Vera Kross (intermediate L1): "Delay one revealed intention by one
// initiative step." Enemies within one round resolve in ascending initiative order, so
// raising this enemy's initiative pushes its action later in that ordering.
function delayEnemyInitiative(state, payload) {
  const next = cloneState(state);
  const enemy = next.units[payload.enemyId];
  if (!enemy || enemy.side !== "enemy") throw new Error(`${payload.enemyId} is not an enemy`);
  enemy.initiative = (enemy.initiative ?? 9) + 1;
  return next;
}

// The Tenth Scarecrow (primary L10): "Once, repeat a completed non-combat interaction."
// Follows exactly the same collect/drop rules as a normal Interact (expedition-engine.js's
// interactObject) but does not spend the unit's action point — the same "free action"
// precedent Dash's bonus move token already uses for Move, applied here to Interact.
function repeatInteraction(state, payload) {
  const next = cloneState(state);
  const unit = next.units[payload.unitId];
  if (!unit || unit.side !== "player") throw new Error(`${payload.unitId} is not a field unit`);
  const object = next.objects[payload.objectId];
  if (!object || object.removed) throw new Error(`Unavailable object: ${payload.objectId}`);
  if (unit.carrying) {
    if (unit.carrying !== payload.objectId) throw new Error(`${payload.unitId} is already carrying another object`);
    const dropHex = payload.destination || unit.pos;
    if (!next.board[dropHex] || hexDistance(unit.pos, dropHex) > 1) throw new Error(`${payload.unitId} cannot place ${payload.objectId} on ${dropHex} — it is not adjacent`);
    if (Object.values(next.objects).some((other) => other.id !== payload.objectId && other.pos === dropHex)) throw new Error(`Cannot place ${payload.objectId} on ${dropHex}`);
    next.history.push({ turn: next.turn, phase: next.phase, unitId: unit.id, action: "drop", objectId: payload.objectId, to: dropHex, commanderPower: true });
    object.pos = dropHex;
    unit.carrying = null;
  } else {
    if (!object.movable || hexDistance(unit.pos, object.pos) > 1) throw new Error(`${payload.objectId} cannot be collected by ${payload.unitId}`);
    next.history.push({ turn: next.turn, phase: next.phase, unitId: unit.id, action: "collect", objectId: payload.objectId, from: object.pos, commanderPower: true });
    object.pos = null;
    unit.carrying = payload.objectId;
  }
  return next;
}

const NOT_YET_IMPLEMENTED = "names a mechanism (market rates, ledger statements, concealed estimates, partition regions, swarm counting, expression substitution, predicted edge closure, …) that later content stages have not built yet";

export const COMMANDER_POWERS = {
  primary_commander_1: { description: "After deployment, move one hero one hex.", implemented: true, effect: repositionOneHex },
  primary_commander_2: { description: "Once, correct an objective value by one.", implemented: true, effect: adjustValueByOne },
  primary_commander_3: { description: "Rotate one route marker before the first round.", implemented: true, effect: rotateRouteMarker },
  primary_commander_4: { description: "Stabilise one scenario object for the first enemy phase.", implemented: true, effect: stabiliseObject },
  primary_commander_5: { description: "Reveal every enemy's first intention.", implemented: true, effect: revealAllIntents },
  primary_commander_6: { description: "Place one temporary obstacle on an open hex.", implemented: true, effect: placeObstacle },
  primary_commander_7: { description: "Count a connected swarm as one fewer for a single check.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  primary_commander_8: { description: "Reserve one hex that no figure may enter for a round.", implemented: true, effect: reserveHexForRound },
  // "Near miss" reuses the same one-point nudge as primary_commander_2 and
  // junior_commander_9: a value that missed its target by one, corrected.
  primary_commander_9: { description: "Turn one near miss into an exact result.", implemented: true, effect: adjustValueByOne },
  primary_commander_10: { description: "Once, repeat a completed non-combat interaction.", implemented: true, effect: repeatInteraction },

  // "Ignore the first obscured value" reuses stabiliseObject: the one existing mechanism
  // that already prevents Walking Smudge's obscure-operator behaviour from touching a
  // protected object (see the stabilisedUntil check in resolveEnemy).
  junior_commander_1: { description: "Ignore the first obscured value.", implemented: true, effect: stabiliseObject },
  junior_commander_2: { description: "Round one estimate in the player's favour.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  junior_commander_3: { description: "Reverse one forced movement.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  junior_commander_4: { description: "Remember and restore one changed tile.", implemented: true, effect: restoreChangedTile },
  junior_commander_5: { description: "Replace one random interval with its exact bounds.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  junior_commander_6: { description: "Repair one broken shape edge.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  junior_commander_7: { description: "Freeze one swarm group for a round.", implemented: true, effect: extendEnemyWatch },
  junior_commander_8: { description: "Treat one zero as a neutral operation.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  junior_commander_9: { description: "Correct one copied value by one.", implemented: true, effect: adjustValueByOne },
  junior_commander_10: { description: "Assign one unplaced fragment to any legal region.", implemented: false, reason: NOT_YET_IMPLEMENTED },

  intermediate_commander_1: { description: "Delay one revealed intention by one initiative step.", implemented: true, effect: delayEnemyInitiative },
  intermediate_commander_2: { description: "Reveal the cost of every edge leaving one node.", implemented: true, effect: revealEdgeCosts },
  intermediate_commander_3: { description: "Open one archive constraint before deployment.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  intermediate_commander_4: { description: "Substitute one equivalent expression.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  intermediate_commander_5: { description: "Lock one optimisation measure while changing another.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  intermediate_commander_6: { description: "Prevent one predicted edge closure.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  intermediate_commander_7: { description: "Hold one market rate constant for a round.", implemented: true, effect: stabiliseObject },
  // Enemies "publish a concise intent sentence" before resolution (EXPEDITIONS_SPEC.md
  // §15); cancelling that revealed action for the round reuses extendEnemyWatch exactly —
  // the enemy simply sits out this round's action.
  intermediate_commander_8: { description: "Cancel one enemy reaction after it is revealed.", implemented: true, effect: extendEnemyWatch },
  intermediate_commander_9: { description: "Verify one ledger statement without spending an action.", implemented: false, reason: NOT_YET_IMPLEMENTED },
  intermediate_commander_10: { description: "Re-run one signal from its previous node.", implemented: false, reason: NOT_YET_IMPLEMENTED },
};

export function isCommanderPowerSelectable(commanderId) {
  return !!COMMANDER_POWERS[commanderId]?.implemented;
}

/**
 * Apply a Commander's power. Throws a specific, non-silent error for an unknown id or one
 * that is not yet implemented — callers must use isCommanderPowerSelectable to keep an
 * unimplemented power out of the UI rather than let a player pick it and hit this error.
 */
export function applyCommanderPower(state, commanderId, payload = {}) {
  const power = COMMANDER_POWERS[commanderId];
  if (!power) throw new Error(`Unknown Commander power: ${commanderId}`);
  if (!power.implemented) throw new Error(`Commander power ${commanderId} (${power.description}) is not yet implemented: ${power.reason}`);
  return power.effect(state, payload);
}
