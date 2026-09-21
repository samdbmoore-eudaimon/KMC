import { EXPEDITION_OBJECTIVE_FAMILIES, EXPEDITION_TIERS } from "./expedition-data.js";

export const HEX_DIRECTIONS = [
  [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1],
];

export function hexKey(q, r) {
  return `${q},${r}`;
}

export function parseHex(key) {
  const [q, r] = key.split(",").map(Number);
  return { q, r };
}

export function hexDistance(a, b) {
  const ah = typeof a === "string" ? parseHex(a) : a;
  const bh = typeof b === "string" ? parseHex(b) : b;
  return (Math.abs(ah.q - bh.q) + Math.abs(ah.q + ah.r - bh.q - bh.r) + Math.abs(ah.r - bh.r)) / 2;
}

export function hexNeighbours(key) {
  const { q, r } = parseHex(key);
  return HEX_DIRECTIONS.map(([dq, dr]) => hexKey(q + dq, r + dr));
}

export function hexLine(a, b) {
  const start = typeof a === "string" ? parseHex(a) : a;
  const end = typeof b === "string" ? parseHex(b) : b;
  const distance = hexDistance(start, end);
  if (!distance) return [hexKey(start.q, start.r)];
  const cube = ({ q, r }) => ({ x: q, z: r, y: -q - r });
  const axial = ({ x, z }) => ({ q: x, r: z });
  const ac = cube(start);
  const bc = cube(end);
  const roundCube = ({ x, y, z }) => {
    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);
    const dx = Math.abs(rx - x);
    const dy = Math.abs(ry - y);
    const dz = Math.abs(rz - z);
    if (dx > dy && dx > dz) rx = -ry - rz;
    else if (dy > dz) ry = -rx - rz;
    else rz = -rx - ry;
    return { x: rx, y: ry, z: rz };
  };
  return Array.from({ length: distance + 1 }, (_, index) => {
    const t = index / distance;
    const point = roundCube({
      x: ac.x + (bc.x - ac.x) * t,
      y: ac.y + (bc.y - ac.y) * t,
      z: ac.z + (bc.z - ac.z) * t,
    });
    const result = axial(point);
    return hexKey(result.q, result.r);
  });
}

// Hive Ledger group shapes (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.3): pure hex-geometry
// helpers so a scenario author builds a constraint group's cell list from a centre hex instead
// of hand-enumerating coordinates (the same reasoning `hexNeighbours` already exists for one
// hex's immediate ring). A Hive Ledger group itself is just a "constraintGrid" family
// constraint (expedition-engine.js's `constraintSatisfied`) whose `objectIds` came from one of
// these; no new objective family is needed.

// A flower neighbourhood: a centre hex plus its six neighbours, seven cells.
export function flowerGroup(centreKey) {
  return [centreKey, ...hexNeighbours(centreKey)];
}

// A straight axial ray: `length` hexes extending outward from `originKey` in one of the six
// HEX_DIRECTIONS, not including `originKey` itself.
export function hexRay(originKey, direction, length) {
  const [dq, dr] = HEX_DIRECTIONS[((direction % 6) + 6) % 6];
  const { q, r } = parseHex(originKey);
  return Array.from({ length }, (_, step) => hexKey(q + dq * (step + 1), r + dr * (step + 1)));
}

// The complete ring of hexes at exactly `radius` steps from `centreKey`, walked in a fixed
// order (so index 0 and index size/2 are always opposite one another — see
// `ringOppositePairs`/`ringSector` below). `radius` 0 is just the centre; `radius` 1 is the
// same six hexes as `hexNeighbours`, in HEX_DIRECTIONS order starting from direction 4.
export function hexRing(centreKey, radius) {
  if (radius <= 0) return [centreKey];
  const { q: cq, r: cr } = parseHex(centreKey);
  let q = cq + HEX_DIRECTIONS[4][0] * radius;
  let r = cr + HEX_DIRECTIONS[4][1] * radius;
  const ring = [];
  for (let side = 0; side < 6; side += 1) {
    for (let step = 0; step < radius; step += 1) {
      ring.push(hexKey(q, r));
      [q, r] = [q + HEX_DIRECTIONS[side][0], r + HEX_DIRECTIONS[side][1]];
    }
  }
  return ring;
}

// A contiguous arc of `length` hexes from a ring (hexRing's output), starting at `startIndex`
// and wrapping — the "ring segment" group, and the 120-degree sector case when `length` is a
// sixth of the ring's size.
export function ringSector(ring, startIndex, length) {
  return Array.from({ length }, (_, step) => ring[(startIndex + step + ring.length) % ring.length]);
}

// Every direct opposite pair on an even-sized ring — `[ring[0], ring[size/2]]` and so on.
// Undefined (and refused) on an odd-sized ring, which has no exact opposite for any hex.
export function ringOppositePairs(ring) {
  if (ring.length % 2 !== 0) throw new Error("ringOppositePairs requires an even-sized ring");
  const half = ring.length / 2;
  return ring.slice(0, half).map((hex, index) => [hex, ring[index + half]]);
}

export function createHexBoard(hexes) {
  const board = {};
  for (const hex of hexes) {
    const key = typeof hex === "string" ? hex : hexKey(hex.q, hex.r);
    board[key] = typeof hex === "string" ? { q: parseHex(key).q, r: parseHex(key).r, terrain: "clear" } : { terrain: "clear", ...hex };
  }
  return board;
}

// A hex is unenterable if its terrain is blocked, or a Commander power (or future
// mechanism) has reserved it until some turn via `blockedUntilTurn` (see
// expedition-commander.js's reserveHexForRound).
function isHexEntryBlocked(state, tile) {
  return !tile || tile.terrain === "blocked" || (tile.blockedUntilTurn != null && tile.blockedUntilTurn > state.turn);
}

// Sure-footed ignores only the FIRST difficult hex a unit enters each round (see
// EXPEDITIONS_BUILD_BRIEF.md §9 and the HEX-06 test) — not every difficult hex. Reachable
// hexes are searched over (position, discount-already-spent) pairs so a path may choose
// whether to spend its one-per-round discount on a given difficult hex.
export function reachableHexes(state, unitId, movement = null) {
  const unit = state.units[unitId];
  if (!unit || unit.hp <= 0) return [];
  const limit = (movement ?? unit.move) + (unit.freeStepAvailable ? 1 : 0);
  const occupied = new Set(Object.values(state.units).filter((other) => other.hp > 0 && other.id !== unitId).map((other) => other.pos));
  const objectHexes = new Set(Object.values(state.objects).filter((object) => object.pos).map((object) => object.pos));
  const canDiscount = unit.trait === "surefooted" && !unit.sureFootedUsedThisRound;
  const nodeKey = (hex, used) => `${hex}|${used ? 1 : 0}`;
  const costs = new Map([[nodeKey(unit.pos, false), 0]]);
  const queue = [{ hex: unit.pos, used: false }];
  while (queue.length) {
    const { hex: current, used } = queue.shift();
    const spent = costs.get(nodeKey(current, used));
    for (const next of hexNeighbours(current)) {
      const tile = state.board[next];
      if (isHexEntryBlocked(state, tile) || occupied.has(next) || objectHexes.has(next)) continue;
      const isDifficult = tile.terrain === "difficult";
      const options = isDifficult && canDiscount && !used
        ? [{ cost: 1, nextUsed: true }, { cost: 2, nextUsed: used }]
        : [{ cost: isDifficult ? 2 : 1, nextUsed: used }];
      for (const { cost, nextUsed } of options) {
        const total = spent + cost;
        const key = nodeKey(next, nextUsed);
        if (total > limit || (costs.has(key) && costs.get(key) <= total)) continue;
        costs.set(key, total);
        queue.push({ hex: next, used: nextUsed });
      }
    }
  }
  const best = new Map();
  for (const [key, cost] of costs.entries()) {
    const separator = key.lastIndexOf("|");
    const hex = key.slice(0, separator);
    if (hex === unit.pos) continue;
    const usedDiscount = key.slice(separator + 1) === "1";
    if (!best.has(hex) || best.get(hex).cost > cost) best.set(hex, { cost, usedDiscount });
  }
  return [...best.entries()].map(([key, info]) => ({ key, cost: info.cost, usedDiscount: info.usedDiscount }));
}

export function shortestPath(state, from, to, options = {}) {
  const blocked = new Set(options.blocked || []);
  const queue = [from];
  const cameFrom = new Map([[from, null]]);
  while (queue.length) {
    const current = queue.shift();
    if (current === to) break;
    for (const next of hexNeighbours(current)) {
      const tile = state.board[next];
      if (isHexEntryBlocked(state, tile) || blocked.has(next) || cameFrom.has(next)) continue;
      cameFrom.set(next, current);
      queue.push(next);
    }
  }
  if (!cameFrom.has(to)) return null;
  const path = [];
  let cursor = to;
  while (cursor) {
    path.unshift(cursor);
    cursor = cameFrom.get(cursor);
  }
  return path;
}

export function createExpeditionState(config) {
  const tier = EXPEDITION_TIERS[config.moduleKey];
  if (!tier) throw new Error(`Unknown expedition module: ${config.moduleKey}`);
  const board = createHexBoard(config.board);
  const units = Object.fromEntries((config.units || []).map((unit) => [unit.id, {
    ap: 2,
    maxAp: 2,
    hp: unit.hearts || unit.hp || 2,
    maxHp: unit.hearts || unit.hp || 2,
    move: unit.move || 2,
    range: unit.range || 1,
    side: "player",
    guarded: false,
    carrying: null,
    // Trait bookkeeping (see EXPEDITIONS_BUILD_BRIEF.md §9). All reset per round in
    // resolveEnemyPhase except adaptableUsedEver, which is once per expedition.
    preciseUsedThisRound: false,
    preciseSupportBanked: false,
    sureFootedUsedThisRound: false,
    freeStepAvailable: unit.trait === "quick",
    adaptableUsedEver: false,
    justInteracted: false,
    bonusMoveTokens: 0,
    interruptArmed: false,
    lastCloseActionTargetId: null,
    ...unit,
  }]));
  for (const enemy of config.enemies || []) {
    units[enemy.id] = { ap: 0, maxAp: 0, side: "enemy", guarded: false, carrying: null, ...enemy };
  }
  const state = {
    id: config.id,
    moduleKey: config.moduleKey,
    tier,
    title: config.title,
    turn: 1,
    turnLimit: config.turnLimit || tier.turnLimit,
    phase: "player",
    board,
    units,
    objects: Object.fromEntries((config.objects || []).map((object) => [object.id, { movable: true, guarded: false, valueLocked: false, damaged: false, ...object }])),
    objective: structuredClone(config.objective),
    flags: structuredClone(config.flags || {}),
    counters: { actions: 0, damageTaken: 0, enemiesDefeated: 0, unitsExhausted: 0, ...(config.counters || {}) },
    history: [],
    status: "playing",
  };
  return refreshExpeditionStatus(state);
}

function cloneState(state) {
  return structuredClone(state);
}

function playerUnit(state, unitId) {
  const unit = state.units[unitId];
  if (!unit || unit.side !== "player" || unit.hp <= 0) throw new Error(`Unavailable player unit: ${unitId}`);
  return unit;
}

function spendAction(state, unit, action, detail = {}) {
  if (state.phase !== "player") throw new Error("Player actions are only available during the player phase");
  if (unit.ap < 1) throw new Error(`${unit.name || unit.id} has no action points left`);
  unit.ap -= 1;
  state.counters.actions += 1;
  state.history.push({ turn: state.turn, phase: state.phase, unitId: unit.id, action, ...detail });
}

export function moveUnit(state, unitId, destination) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  unit.justInteracted = false;
  unit.lastCloseActionTargetId = null;
  const reachable = reachableHexes(next, unitId).find((hex) => hex.key === destination);
  if (!reachable) throw new Error(`Hex ${destination} is not reachable by ${unitId}`);
  const from = unit.pos;
  // Dash (Speed) grants a bonus move token that pays for one Move without spending an
  // action point, once the unit has none left.
  if (unit.ap < 1 && unit.bonusMoveTokens > 0) {
    if (next.phase !== "player") throw new Error("Player actions are only available during the player phase");
    unit.bonusMoveTokens -= 1;
    next.counters.actions += 1;
    next.history.push({ turn: next.turn, phase: next.phase, unitId: unit.id, action: "move", from, to: destination, distance: reachable.cost, freeMove: true });
  } else {
    spendAction(next, unit, "move", { from, to: destination, distance: reachable.cost });
  }
  if (unit.freeStepAvailable) unit.freeStepAvailable = false;
  if (reachable.usedDiscount) unit.sureFootedUsedThisRound = true;
  unit.pos = destination;
  return refreshExpeditionStatus(next);
}

// The Widdershins Path: a numbered stone is a normal blocking object (like a vault or a
// scale elsewhere) — a hero never enters its hex, she visits it from beside it. Registers as
// a "visit" — advancing state.counters.routeProgress — only when the stone is currently the
// next required value in objective.sequence AND the hero is standing on the stone's currently
// active entry hex (requiredFrom normally, or reversedFrom once the Widdershins creature has
// reversed it). Any other attempt throws, same as interactObject's own adjacency checks.
export function visitStone(state, unitId, stoneId) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  const stone = next.objects[stoneId];
  if (!stone || stone.kind !== "stone" || stone.visited) throw new Error(`${stoneId} cannot be visited`);
  if (!stone.pos || hexDistance(unit.pos, stone.pos) > 1) throw new Error(`${unitId} is not adjacent to ${stoneId}`);
  const objective = next.objective;
  const nextValue = objective.sequence?.[next.counters.routeProgress || 0];
  if (stone.value !== nextValue) throw new Error(`${stoneId} is not the next required stone`);
  const requiredFrom = stone.reversed ? stone.reversedFrom : stone.requiredFrom;
  if (requiredFrom && unit.pos !== requiredFrom) throw new Error(`${unitId} must approach ${stoneId} from ${requiredFrom}`);
  spendAction(next, unit, "visit", { objectId: stoneId, value: stone.value });
  stone.visited = true;
  next.counters.routeProgress = (next.counters.routeProgress || 0) + 1;
  return refreshExpeditionStatus(next);
}

export function interactObject(state, unitId, objectId, destination = null) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  const object = next.objects[objectId];
  if (!object || object.removed) throw new Error(`Unavailable object: ${objectId}`);
  if (unit.carrying) {
    if (unit.carrying !== objectId) throw new Error(`${unitId} is already carrying another object`);
    const dropHex = destination || unit.pos;
    if (!next.board[dropHex] || hexDistance(unit.pos, dropHex) > 1) throw new Error(`${unitId} cannot place ${objectId} on ${dropHex} — it is not adjacent`);
    // A hex's stackLimit (default 1, the historic behaviour) is how many objects may share it
    // at once — Unequal Crossing's redesigned scale hexes (EXPEDITIONS_CLAUDE_HANDOVER.md
    // "Approved scale redesign") set stackLimit: 2 so two loads can sit on one impassable
    // scale together, placed from any of its six neighbours rather than by standing on it.
    const stackLimit = next.board[dropHex].stackLimit ?? 1;
    const alreadyThere = Object.values(next.objects).filter((other) => other.id !== objectId && other.pos === dropHex);
    if (alreadyThere.length >= stackLimit) throw new Error(`Cannot place ${objectId} on ${dropHex} — it already holds ${alreadyThere.length} of ${stackLimit}`);
    spendAction(next, unit, "drop", { objectId, to: dropHex });
    object.pos = dropHex;
    unit.carrying = null;
  } else {
    if (!object.movable || hexDistance(unit.pos, object.pos) > 1) throw new Error(`${objectId} cannot be collected by ${unitId}`);
    spendAction(next, unit, "collect", { objectId, from: object.pos });
    object.pos = null;
    unit.carrying = objectId;
    unit.lastCloseActionTargetId = objectId;
  }
  unit.justInteracted = true; // Dash (Speed) may move again immediately after this.
  return refreshExpeditionStatus(next);
}

export function guardTarget(state, unitId, targetId) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  unit.justInteracted = false;
  unit.lastCloseActionTargetId = null;
  const target = next.units[targetId] || next.objects[targetId];
  const targetPos = target?.pos || (target?.carrying ? unit.pos : null);
  if (!target || !targetPos || hexDistance(unit.pos, targetPos) > 1) throw new Error(`${targetId} is not adjacent to ${unitId}`);
  spendAction(next, unit, "guard", { targetId });
  target.guarded = true;
  return refreshExpeditionStatus(next);
}

// ---------------- Role actions (EXPEDITIONS_BUILD_BRIEF.md §8) ----------------
// guardTarget above is the Guardian's (tank) always-available action. The remaining four
// roles' basic actions follow the same shape: fetch the acting unit, validate adjacency
// and a role-appropriate target, spend one action point, apply one deterministic effect.

// Mender (healer): restore one heart, or repair one damaged scenario object, within two hexes.
export function restoreTarget(state, unitId, targetId) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  unit.justInteracted = false;
  const target = next.units[targetId] || next.objects[targetId];
  if (!target || !target.pos || hexDistance(unit.pos, target.pos) > 2) throw new Error(`${targetId} is not within Mender range of ${unitId}`);
  const isUnit = !!next.units[targetId];
  if (isUnit) {
    if (target.hp <= 0 || target.hp >= target.maxHp) throw new Error(`${targetId} cannot be restored`);
    spendAction(next, unit, "restore", { targetId, healed: 1 });
    target.hp = Math.min(target.maxHp, target.hp + 1);
  } else {
    if (!target.damaged) throw new Error(`${targetId} is not damaged`);
    spendAction(next, unit, "restore", { targetId, repaired: true });
    target.damaged = false;
  }
  return refreshExpeditionStatus(next);
}

// Reckoner (wizard): change the operation or orientation of one adjacent puzzle tile.
// Only meaningful on an object that declares an `op` or `orientation` field — most objects
// (plain loads) do not, and reframing one is an illegal-target error.
export function reframeTarget(state, unitId, objectId, change = {}) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  unit.justInteracted = false;
  const object = next.objects[objectId];
  if (!object || !object.pos || hexDistance(unit.pos, object.pos) > 1) throw new Error(`${objectId} is not adjacent to ${unitId}`);
  if (object.valueLocked) throw new Error(`${objectId} is locked and cannot be reframed`);
  if (object.jammed) throw new Error(`${objectId} is jammed and needs a Geometry check to rotate, not a Reframe`);
  if (!("op" in object) && !("orientation" in object)) throw new Error(`${objectId} has no operation or orientation to reframe`);
  spendAction(next, unit, "reframe", { objectId, op: change.op, orientation: change.orientation });
  if (change.op !== undefined) object.op = change.op;
  if (change.orientation !== undefined) object.orientation = change.orientation;
  return refreshExpeditionStatus(next);
}

// Mover (melee): after a close action (Strike or Interact) this unit just took, push its
// target one open hex in the given direction.
export function shoveTarget(state, unitId, targetId, direction) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  if (unit.lastCloseActionTargetId !== targetId) throw new Error(`Shove requires a close action against ${targetId} this turn`);
  const target = next.units[targetId] || next.objects[targetId];
  if (!target || !target.pos) throw new Error(`${targetId} cannot be shoved`);
  const [dq, dr] = HEX_DIRECTIONS[((direction % 6) + 6) % 6];
  const { q, r } = parseHex(target.pos);
  const destination = hexKey(q + dq, r + dr);
  const tile = next.board[destination];
  const occupiedByUnit = Object.values(next.units).some((other) => other.hp > 0 && other.pos === destination);
  const occupiedByObject = Object.values(next.objects).some((other) => other.pos === destination);
  if (isHexEntryBlocked(next, tile) || occupiedByUnit || occupiedByObject) throw new Error(`${destination} is not open for a shove`);
  spendAction(next, unit, "shove", { targetId, to: destination });
  target.pos = destination;
  unit.lastCloseActionTargetId = null;
  unit.justInteracted = false;
  return refreshExpeditionStatus(next);
}

// Scout (ranged): mark a visible target so the next allied action against it gains one
// support. Consumed automatically the next time strikeEnemy resolves against it.
export function markTarget(state, unitId, targetId) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  unit.justInteracted = false;
  const target = next.units[targetId];
  if (!target || target.side !== "enemy" || target.hp <= 0) throw new Error(`${targetId} cannot be marked`);
  if (hexDistance(unit.pos, target.pos) > (unit.range || 1)) throw new Error(`${targetId} is out of Scout range`);
  spendAction(next, unit, "mark", { targetId });
  target.marked = true;
  return refreshExpeditionStatus(next);
}

// Fourth argument accepts either a legacy raw statIndex (backward compatible) or an
// options object: { statIndex, useAdaptable } — useAdaptable spends the Adaptable trait's
// once-per-expedition swap to the unit's second-highest statistic (EXPEDITIONS_BUILD_BRIEF.md §9).
export function strikeEnemy(state, unitId, enemyId, statIndexOrOptions = null) {
  const options = statIndexOrOptions && typeof statIndexOrOptions === "object" ? statIndexOrOptions : { statIndex: statIndexOrOptions };
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  unit.justInteracted = false;
  const enemy = next.units[enemyId];
  if (!enemy || enemy.side !== "enemy" || enemy.hp <= 0) throw new Error(`Unavailable enemy: ${enemyId}`);
  if (hexDistance(unit.pos, enemy.pos) > unit.range) throw new Error(`${enemyId} is out of range`);
  const rankedStats = [...unit.stats.keys()].sort((a, b) => unit.stats[b] - unit.stats[a] || a - b);
  const useAdaptable = !!(options.useAdaptable && unit.trait === "adaptable" && !unit.adaptableUsedEver);
  const index = options.statIndex ?? (useAdaptable ? rankedStats[1] : (unit.primaryType ?? rankedStats[0]));
  let support = Object.values(next.units).filter((ally) => ally.side === "player" && ally.id !== unit.id && ally.hp > 0 && hexDistance(ally.pos, enemy.pos) === 1).length;
  if (unit.preciseSupportBanked) { support += 1; unit.preciseSupportBanked = false; }
  if (enemy.marked) { support += 1; enemy.marked = false; }
  const power = unit.stats[index] + support;
  // networkGate (The First Whistle's "combat opens only after the network is live"): an
  // optional shield, the same shape "connect" family's own activeNodes/edges/routeMarkerIds
  // already use, reusing graphConnected directly rather than duplicating its logic. While the
  // named network isn't yet connected, a strike still resolves as a legal action (support and
  // Precise still apply) but always lands at 0 impact — the same outcome a strike below
  // Defence already produces, not a new result shape or a thrown error.
  const networkLive = !enemy.networkGate || graphConnected(
    new Set(enemy.networkGate.activeNodes),
    [...(enemy.networkGate.edges || []), ...(enemy.networkGate.routeMarkerIds || []).flatMap((id) => routeMarkerConnections(next.objects[id]))],
    enemy.networkGate.start,
    enemy.networkGate.end,
  );
  const impact = !networkLive ? 0 : power >= enemy.defence + 4 ? 2 : power >= enemy.defence ? 1 : 0;
  // Precise: "the first exact match each round gains one support" — a strike whose power
  // lands exactly on the target's defence banks a support point for this unit's next strike.
  if (power === enemy.defence && unit.trait === "precise" && !unit.preciseUsedThisRound) {
    unit.preciseUsedThisRound = true;
    unit.preciseSupportBanked = true;
  }
  spendAction(next, unit, "strike", { enemyId, statIndex: index, power, support, defence: enemy.defence, impact, usedAdaptable: useAdaptable, networkLive });
  if (useAdaptable) unit.adaptableUsedEver = true;
  unit.lastCloseActionTargetId = enemyId;
  enemy.hp = Math.max(0, enemy.hp - impact);
  if (!enemy.hp) {
    next.counters.enemiesDefeated += 1;
    // A defeated enemy always drops whatever it was carrying (steal-highest's own hoard,
    // or any future carrying enemy) right where it fell — a generic hook here rather than
    // something special-cased per behaviour, so a stolen load is never lost, just delayed.
    if (enemy.carrying) {
      const dropped = next.objects[enemy.carrying];
      if (dropped) dropped.pos = enemy.pos;
      enemy.carrying = null;
    }
  }
  return refreshExpeditionStatus(next);
}

// Visible checks (EXPEDITIONS_CARD_COMBAT_CONTRACT.md §4): a generic, deterministic
// statistic-versus-difficulty test any scenario object can require, independent of combat.
// `Check power = named statistic + shown support + shown terrain or object bonus`, exactly
// mirroring strikeEnemy's power calculation so the two mental models stay consistent — the
// same "adjacent ally gives one support" rule applies here. There is no randomness and no
// hidden modifier: every component of the total is named in the history entry (and so in
// the ACTION_RESOLVED event it produces), for presentation to show in full before
// confirmation. A failed check is a valid, recorded outcome, not a thrown error — only an
// illegal attempt (bad target, missing difficulty, unknown statistic) throws.
export function attemptCheck(state, unitId, payload = {}) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  const { statIndex, targetId, difficulty, bonus, bonusLabel, consequence } = payload;
  if (!Number.isInteger(statIndex) || statIndex < 0 || statIndex > 4) throw new Error("A visible check requires a statistic index from 0 to 4");
  if (!Number.isFinite(difficulty)) throw new Error("A visible check requires a numerical difficulty");
  const target = next.objects[targetId] ?? next.units[targetId];
  const targetHex = next.board[targetId] ? targetId : target?.pos;
  if (!targetHex || !next.board[targetHex]) throw new Error(`${targetId} is not a valid check target`);
  if (hexDistance(unit.pos, targetHex) > 1) throw new Error(`${targetId} is not adjacent to ${unitId}`);
  unit.justInteracted = false;
  const support = Object.values(next.units).filter((ally) => ally.side === "player" && ally.id !== unit.id && ally.hp > 0 && hexDistance(ally.pos, targetHex) <= 1).length;
  const statValue = unit.stats[statIndex];
  const appliedBonus = Number(bonus) || 0;
  const total = statValue + support + appliedBonus;
  const success = total >= difficulty;
  spendAction(next, unit, "check", { targetId, statIndex, statValue, support, bonus: appliedBonus, bonusLabel: bonusLabel ?? null, total, difficulty, success, consequence: consequence ?? null });
  return refreshExpeditionStatus(next);
}

function bankPreciseSupport(unit) {
  if (unit.trait === "precise" && !unit.preciseUsedThisRound) {
    unit.preciseUsedThisRound = true;
    unit.preciseSupportBanked = true;
  }
}

export function useDisciplineAction(state, unitId, actionKey, payload = {}) {
  const next = cloneState(state);
  const unit = playerUnit(next, unitId);
  if (actionKey !== "dash") { unit.justInteracted = false; unit.lastCloseActionTargetId = null; }
  if (unit.discipline === "arithmetic" && actionKey === "combine") {
    const first = next.objects[payload.firstId];
    const second = next.objects[payload.secondId];
    if (!first?.movable || !second?.movable || !first.pos || !second.pos || hexDistance(first.pos, second.pos) > 1) throw new Error("Combine requires two adjacent movable objects");
    if (hexDistance(unit.pos, first.pos) > 1 && hexDistance(unit.pos, second.pos) > 1) throw new Error("Combine requires one adjacent source");
    if (first.valueLocked || second.valueLocked) throw new Error("Combine cannot use a locked object");
    spendAction(next, unit, "combine", { firstId: first.id, secondId: second.id, result: first.value + second.value });
    first.value += second.value;
    second.removed = true;
    second.pos = null;
  } else if (unit.discipline === "arithmetic" && actionKey === "split") {
    const object = next.objects[payload.objectId];
    if (!object?.movable || !object.pos || object.valueLocked) throw new Error("Split requires an unlocked movable object");
    if (hexDistance(unit.pos, object.pos) > 1) throw new Error("Split requires an adjacent object");
    if (!Number.isInteger(object.value) || object.value % 2 !== 0 || object.value < 2) throw new Error("Split requires an even-valued object");
    const { hexA, hexB, newObjectId } = payload;
    if (!newObjectId || next.objects[newObjectId]) throw new Error("Split requires a fresh id for the second half");
    const origin = object.pos;
    for (const hex of [hexA, hexB]) {
      if (!next.board[hex] || hexDistance(origin, hex) > 1) throw new Error(`${hex} is not an open hex adjacent to the split object`);
      if (Object.values(next.objects).some((other) => other.id !== object.id && other.pos === hex)) throw new Error(`${hex} is already occupied`);
    }
    if (hexA === hexB) throw new Error("Split needs two different destination hexes");
    const half = object.value / 2;
    spendAction(next, unit, "split", { objectId: object.id, newObjectId, half });
    object.value = half;
    object.pos = hexA;
    next.objects[newObjectId] = { id: newObjectId, movable: true, guarded: false, valueLocked: false, damaged: false, value: half, pos: hexB };
  } else if (unit.discipline === "arithmetic" && actionKey === "exact") {
    const object = next.objects[payload.objectId];
    if (!object?.pos || hexDistance(unit.pos, object.pos) > 1) throw new Error("Exact Count requires an adjacent object");
    const target = payload.target ?? next.objective?.target;
    if (!Number.isFinite(target)) throw new Error("Exact Count requires a numerical target");
    const matched = Number(object.value) === target;
    spendAction(next, unit, "exact", { objectId: object.id, target, matched });
    if (matched) bankPreciseSupport(unit);
  } else if (unit.discipline === "geometry" && actionKey === "shift") {
    const object = next.objects[payload.objectId];
    if (!object?.pos || hexDistance(unit.pos, object.pos) > 1 || !next.board[payload.to]) throw new Error("True Shift requires an adjacent object and a board destination");
    const line = hexLine(object.pos, payload.to);
    if (line.length - 1 > Math.max(1, Math.floor(unit.stats[1] / 3))) throw new Error("True Shift destination is too far away");
    if (line.some((key, index) => index > 0 && Object.values(next.objects).some((other) => other.id !== object.id && other.pos === key))) throw new Error("True Shift path is blocked");
    spendAction(next, unit, "shift", { objectId: object.id, from: object.pos, to: payload.to });
    object.pos = payload.to;
  } else if (unit.discipline === "geometry" && actionKey === "shape") {
    const hexes = payload.hexes || [];
    const span = Math.max(1, 1 + Math.floor(unit.stats[1] / 3));
    if (!hexes.length || hexes.length > span) throw new Error(`Shape Field affects at most ${span} hexes`);
    for (const hex of hexes) {
      if (!next.board[hex]) throw new Error(`${hex} is not on the board`);
      if (hexDistance(unit.pos, hex) > 2) throw new Error(`${hex} is too far from ${unitId} for Shape Field`);
    }
    spendAction(next, unit, "shape", { hexes });
    for (const object of Object.values(next.objects)) if (hexes.includes(object.pos)) object.guarded = true;
  } else if (unit.discipline === "geometry" && actionKey === "measure") {
    const object = next.objects[payload.objectId];
    if (!object?.pos) throw new Error("Measure requires a placed object");
    const line = hexLine(unit.pos, object.pos);
    if (line.length !== 3) throw new Error("Measure requires an object exactly two hexes away");
    const [, obstacleHex] = line;
    if (payload.ignoreHex !== obstacleHex) throw new Error(`Measure must name the intervening hex ${obstacleHex} to ignore it`);
    if (!object.movable) throw new Error("Measure requires a movable object");
    spendAction(next, unit, "measure", { objectId: object.id, ignoredHex: obstacleHex });
    object.pos = null;
    unit.carrying = object.id;
  } else if (unit.discipline === "geometry" && actionKey === "forceRotate") {
    // "Geometry checks can rotate a jammed heavy tile" (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md
    // §4.2) — a jammed rotation hex refuses Reckoner's ordinary Reframe (see reframeTarget
    // above) and needs this instead: the same power calculation as a visible check
    // (attemptCheck), specifically against Geometry (statIndex 1), spent as one action. A
    // failed check is a recorded, legal outcome, not a jam that is fixed by trying again for
    // free — only an illegal attempt throws.
    const object = next.objects[payload.objectId];
    if (!object?.pos || hexDistance(unit.pos, object.pos) > 1) throw new Error("Force Rotate requires an adjacent tile");
    if (!object.jammed) throw new Error(`${payload.objectId} is not jammed and can be reframed directly`);
    if (!Number.isFinite(object.jamDifficulty)) throw new Error(`${payload.objectId} has no jam difficulty to check against`);
    const support = Object.values(next.units).filter((ally) => ally.side === "player" && ally.id !== unit.id && ally.hp > 0 && hexDistance(ally.pos, object.pos) <= 1).length;
    const statValue = unit.stats[1];
    const total = statValue + support;
    const success = total >= object.jamDifficulty;
    spendAction(next, unit, "forceRotate", { objectId: object.id, statValue, support, total, difficulty: object.jamDifficulty, success, orientation: payload.orientation });
    if (success && payload.orientation !== undefined) object.orientation = payload.orientation;
  } else if (unit.discipline === "logic" && actionKey === "predict") {
    const enemy = next.units[payload.enemyId];
    if (!enemy || enemy.side !== "enemy") throw new Error("Predict requires an enemy");
    spendAction(next, unit, "predict", { enemyId: enemy.id });
    enemy.intentRevealed = true;
  } else if (unit.discipline === "logic" && actionKey === "order" && payload.objectId) {
    // Put in Order's third mode (The Widdershins Path): repair a reversed stone, resetting
    // its entry direction back to normal, rather than swapping two things.
    const object = next.objects[payload.objectId];
    if (!object?.pos || hexDistance(unit.pos, object.pos) > 1) throw new Error("Put in Order requires an adjacent object");
    if (!object.reversed) throw new Error("Put in Order requires a reversed object");
    spendAction(next, unit, "order", { objectId: payload.objectId, mode: "repair" });
    object.reversed = false;
  } else if (unit.discipline === "logic" && actionKey === "order") {
    const { aId, bId } = payload;
    const unitsInvolved = [next.units[aId], next.units[bId]];
    const objectsInvolved = [next.objects[aId], next.objects[bId]];
    if (unitsInvolved[0] && unitsInvolved[1]) {
      spendAction(next, unit, "order", { aId, bId, mode: "initiative" });
      const swap = unitsInvolved[0].initiative;
      unitsInvolved[0].initiative = unitsInvolved[1].initiative;
      unitsInvolved[1].initiative = swap;
    } else if (objectsInvolved[0] && objectsInvolved[1]) {
      if (!objectsInvolved[0].pos || !objectsInvolved[1].pos || hexDistance(objectsInvolved[0].pos, objectsInvolved[1].pos) > 1) throw new Error("Put in Order requires two adjacent ordered tiles");
      spendAction(next, unit, "order", { aId, bId, mode: "position" });
      const swap = objectsInvolved[0].pos;
      objectsInvolved[0].pos = objectsInvolved[1].pos;
      objectsInvolved[1].pos = swap;
    } else {
      throw new Error("Put in Order requires two units or two objects");
    }
  } else if (unit.discipline === "logic" && actionKey === "deduce") {
    if (payload.hex != null) {
      if (!next.board[payload.hex]) throw new Error(`${payload.hex} is not on the board`);
      spendAction(next, unit, "deduce", { hex: payload.hex, mode: "location" });
      next.flags.deducedFalseHexes = next.flags.deducedFalseHexes || [];
      if (!next.flags.deducedFalseHexes.includes(payload.hex)) next.flags.deducedFalseHexes.push(payload.hex);
    } else if (payload.objectId != null) {
      const object = next.objects[payload.objectId];
      if (!object?.pos || hexDistance(unit.pos, object.pos) > 1) throw new Error("Deduce requires an adjacent object to lock");
      spendAction(next, unit, "deduce", { objectId: object.id, mode: "value" });
      object.valueLocked = true;
    } else {
      throw new Error("Deduce requires a hex to rule out or an object to lock");
    }
  } else if (unit.discipline === "science" && actionKey === "stabilise") {
    const target = next.objects[payload.targetId] || next.units[payload.targetId];
    if (!target?.pos || hexDistance(unit.pos, target.pos) > 1) throw new Error("Stabilise requires an adjacent target");
    spendAction(next, unit, "stabilise", { targetId: payload.targetId });
    target.stabilisedUntil = next.turn + 1;
  } else if (unit.discipline === "science" && actionKey === "transform") {
    const object = next.objects[payload.objectId];
    if (!object?.pos || hexDistance(unit.pos, object.pos) > 1) throw new Error("Transform requires an adjacent object");
    if (!Array.isArray(object.cycle) || !object.cycle.length) throw new Error(`${object.id} has no state cycle to advance`);
    if (object.valueLocked) throw new Error(`${object.id} is locked and cannot be transformed`);
    if (object.stabilisedUntil && object.stabilisedUntil > next.turn) throw new Error(`${object.id} is stabilised against change`);
    const stateIndex = ((object.stateIndex ?? 0) + 1) % object.cycle.length;
    spendAction(next, unit, "transform", { objectId: object.id, phase: object.cycle[stateIndex] });
    object.stateIndex = stateIndex;
    object.phase = object.cycle[stateIndex];
  } else if (unit.discipline === "science" && actionKey === "chain") {
    const ids = payload.objectIds || [];
    const maxChain = Math.min(4, 1 + Math.floor(unit.stats[3] / 3));
    if (ids.length < 1 || ids.length > maxChain) throw new Error(`Chain Reaction affects one to ${maxChain} connected objects`);
    const chained = ids.map((id) => next.objects[id]);
    if (chained.some((object) => !object?.pos)) throw new Error("Chain Reaction requires placed objects");
    if (chained.some((object) => object.valueLocked)) throw new Error("Chain Reaction cannot use a locked object");
    if (hexDistance(unit.pos, chained[0].pos) > 1) throw new Error("Chain Reaction requires an adjacent first object");
    for (let i = 1; i < chained.length; i += 1) {
      if (hexDistance(chained[i - 1].pos, chained[i].pos) > 1) throw new Error("Chain Reaction objects must form a connected group");
    }
    spendAction(next, unit, "chain", { objectIds: ids });
    for (const object of chained) object.value = Number(object.value || 0) + 1;
  } else if (unit.discipline === "speed" && actionKey === "relay") {
    const object = next.objects[payload.objectId];
    const receiver = next.units[payload.receiverId];
    if (unit.carrying !== object?.id || receiver?.side !== "player" || hexDistance(unit.pos, receiver.pos) !== 1 || receiver.carrying) throw new Error("Relay requires adjacent free receiver");
    spendAction(next, unit, "relay", { objectId: object.id, receiverId: receiver.id });
    unit.carrying = null;
    receiver.carrying = object.id;
  } else if (unit.discipline === "speed" && actionKey === "dash") {
    if (!unit.justInteracted) throw new Error("Dash requires having just completed an Interact this turn");
    spendAction(next, unit, "dash", {});
    unit.bonusMoveTokens = (unit.bonusMoveTokens || 0) + 1;
    unit.justInteracted = false;
  } else if (unit.discipline === "speed" && actionKey === "interrupt") {
    spendAction(next, unit, "interrupt", {});
    unit.interruptArmed = true;
  } else {
    throw new Error(`${unit.discipline} cannot use ${actionKey}`);
  }
  return refreshExpeditionStatus(next);
}

export function endPlayerPhase(state) {
  const next = cloneState(state);
  if (next.phase !== "player") throw new Error("The player phase has already ended");
  next.phase = "enemy";
  next.history.push({ turn: next.turn, phase: "player", action: "end-phase" });
  return next;
}

export function resolveEnemyPhase(state) {
  const next = cloneState(state);
  if (next.phase !== "enemy") throw new Error("Enemy actions require the enemy phase");
  const enemies = Object.values(next.units).filter((unit) => unit.side === "enemy" && unit.hp > 0).sort((a, b) => (a.initiative || 9) - (b.initiative || 9) || a.id.localeCompare(b.id));
  for (const enemy of enemies) {
    resolveInterrupts(next, enemy);
    if (enemy.hp > 0) resolveEnemy(next, enemy);
  }
  next.history.push({ turn: next.turn, phase: "enemy", action: "end-phase" });
  next.turn += 1;
  next.phase = "player";
  for (const unit of Object.values(next.units)) {
    if (unit.side === "player" && unit.hp > 0) {
      unit.ap = unit.maxAp;
      // Per-round trait and action bookkeeping (see EXPEDITIONS_BUILD_BRIEF.md §9).
      // adaptableUsedEver is deliberately excluded: it is once per expedition, not per round.
      unit.preciseUsedThisRound = false;
      unit.preciseSupportBanked = false;
      unit.sureFootedUsedThisRound = false;
      unit.freeStepAvailable = unit.trait === "quick";
      unit.justInteracted = false;
      unit.lastCloseActionTargetId = null;
      unit.bonusMoveTokens = 0;
      unit.interruptArmed = false;
    }
    unit.guarded = false;
  }
  for (const object of Object.values(next.objects)) object.guarded = false;
  return refreshExpeditionStatus(next);
}

// Speed's Interrupt discipline action: an armed unit within an approaching enemy's threat
// range (its move plus its range) moves one open hex away — to whichever open neighbour is
// furthest from the enemy, ties broken by the lowest hex key for determinism — before that
// enemy's own action resolves. Deterministic and unconditional: this is a reaction, not a
// player choice made during the automated enemy phase.
function resolveInterrupts(state, enemy) {
  const threatRange = (enemy.move || 0) + (enemy.range || 1);
  const armed = Object.values(state.units)
    .filter((unit) => unit.side === "player" && unit.hp > 0 && unit.interruptArmed && hexDistance(unit.pos, enemy.pos) <= threatRange)
    .sort((a, b) => a.id.localeCompare(b.id));
  const unit = armed[0];
  if (!unit) return;
  unit.interruptArmed = false;
  const occupied = new Set(Object.values(state.units).filter((other) => other.hp > 0 && other.id !== unit.id).map((other) => other.pos));
  const objectHexes = new Set(Object.values(state.objects).filter((object) => object.pos).map((object) => object.pos));
  const options = hexNeighbours(unit.pos)
    .filter((hex) => state.board[hex] && state.board[hex].terrain !== "blocked" && !occupied.has(hex) && !objectHexes.has(hex))
    .sort((a, b) => hexDistance(b, enemy.pos) - hexDistance(a, enemy.pos) || a.localeCompare(b));
  if (!options.length) return;
  const destination = options[0];
  state.history.push({ turn: state.turn, phase: "enemy", unitId: unit.id, action: "interrupt", to: destination, enemyId: enemy.id });
  unit.pos = destination;
}

function resolveEnemy(state, enemy) {
  if (enemy.delay && state.turn <= enemy.delay) {
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "watch" });
    return;
  }
  if (enemy.behaviour === "steal-highest") {
    // Redesigned (2026-09-17, Sam's live playtest feedback on Unequal Crossing): stealing a
    // load used to teleport it to a fixed home hex — freely walkable back to, no different
    // from an ordinary detour, and easy to never even see happen if the map is solved before
    // a Hookmole's delay expires. It now genuinely carries the load (same `pos: null`
    // convention a hero's own carrying uses) and holds it until defeated — recovering a
    // stolen load now needs combat, not just a walk, and defeating any carrying enemy always
    // drops what it's carrying (see the `enemy.hp <= 0` branch in strikeEnemy below, a
    // one-line generic hook, not something special-cased to Hookmoles).
    if (enemy.carrying) {
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "hoard", objectId: enemy.carrying });
      return;
    }
    const targets = Object.values(state.objects).filter((object) => object.pos && !object.removed && !object.guarded && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
    targets.sort((a, b) => b.value - a.value || hexDistance(enemy.pos, a.pos) - hexDistance(enemy.pos, b.pos));
    const blocked = Object.values(state.units).filter((unit) => unit.hp > 0 && unit.id !== enemy.id).map((unit) => unit.pos);
    // Try targets in priority order rather than committing to the single highest-value one:
    // an unreachable higher-value crate used to make the Hookmole do nothing all round even
    // when a lower-value crate had a clear path (Sam's playtest: "they just stood there").
    for (const target of targets) {
      const path = shortestPath(state, enemy.pos, target.pos, { blocked });
      if (path?.length === 2) {
        target.pos = null;
        enemy.carrying = target.id;
        state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "steal", objectId: target.id });
        return;
      } else if (path?.length > 2) {
        enemy.pos = path[Math.min(enemy.move || 1, path.length - 2)];
        state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "move", to: enemy.pos });
        return;
      }
    }
    return;
  }
  if (enemy.behaviour === "obscure-operator") {
    // Walking Smudge (The Smudged Stones): obscure the nearest visible, unprotected
    // operator by resetting its op back to unset. Guard, Stabilise or Deduce's value-lock
    // (valueLocked) all protect an operator once the player has set it correctly.
    const targets = Object.values(state.objects).filter((object) => object.pos && object.op != null && !object.guarded && !object.valueLocked && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
    targets.sort((a, b) => hexDistance(enemy.pos, a.pos) - hexDistance(enemy.pos, b.pos));
    const target = targets[0];
    if (!target) return;
    if (hexDistance(enemy.pos, target.pos) <= 1) {
      target.op = null;
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "obscure", objectId: target.id });
      return;
    }
    const blocked = Object.values(state.units).filter((unit) => unit.hp > 0 && unit.id !== enemy.id).map((unit) => unit.pos);
    const path = shortestPath(state, enemy.pos, target.pos, { blocked });
    if (path?.length > 2) {
      // Stop one hex short of the target (an object's own hex), same convention as steal-highest.
      enemy.pos = path[Math.min(enemy.move || 1, path.length - 2)];
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "move", to: enemy.pos });
    }
    return;
  }
  if (enemy.behaviour === "corrupt-value") {
    // The Hive Ledger's "lock while corrupted" pattern (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md
    // §4.3): identical shape to obscure-operator above, generalised from an operator's `op` to
    // a ledger cell's `value`, and gated on the new `ledgerCell` flag so this never touches an
    // ordinary carried/placed value object (a crate, a load) that just happens to have a
    // `value` field. Deduce's value-lock (valueLocked) or Guard both protect a cell exactly as
    // they already protect an operator.
    const targets = Object.values(state.objects).filter((object) => object.pos && object.ledgerCell && object.value != null && !object.guarded && !object.valueLocked && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
    targets.sort((a, b) => hexDistance(enemy.pos, a.pos) - hexDistance(enemy.pos, b.pos));
    const target = targets[0];
    if (!target) return;
    if (hexDistance(enemy.pos, target.pos) <= 1) {
      target.value = null;
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "corrupt", objectId: target.id });
      return;
    }
    const blocked = Object.values(state.units).filter((unit) => unit.hp > 0 && unit.id !== enemy.id).map((unit) => unit.pos);
    const path = shortestPath(state, enemy.pos, target.pos, { blocked });
    if (path?.length > 2) {
      enemy.pos = path[Math.min(enemy.move || 1, path.length - 2)];
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "move", to: enemy.pos });
    }
    return;
  }
  if (enemy.behaviour === "peck-lane") {
    // Scruffcrow (The Counting Orchard): advance to the next lane in a fixed, repeating
    // sequence and peck that lane's highest unguarded basket, reducing its value by one.
    // Purely lane-based, not proximity-based, so the target is always fully predictable from
    // the visible lane order — no pathfinding, and it never attacks a hero directly. `pos` is
    // updated to the matching lane marker purely for display; nothing reads it back.
    const laneSequence = enemy.laneSequence || [1];
    const lane = laneSequence[(state.turn - 1) % laneSequence.length];
    if (enemy.laneMarkers?.[lane]) enemy.pos = enemy.laneMarkers[lane];
    const targets = Object.values(state.objects).filter((object) => object.pos && !object.removed && !object.guarded && object.lane === lane && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
    targets.sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
    const target = targets[0];
    if (!target) {
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "advance", lane });
      return;
    }
    target.value = Math.max(0, target.value - (enemy.peckAmount || 1));
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "peck", objectId: target.id, lane, newValue: target.value });
    return;
  }
  if (enemy.behaviour === "flood-lane") {
    // The Cider Run: Scruffcrow reused, not a new character — the exact same lane-based
    // targeting as peck-lane above, sign reversed. "Rolling apple presses flood the lanes with
    // changing values" (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5): each active round, the
    // highest unguarded, unlocked press in the current lane rises by one, never falls. Guard,
    // Stabilise and carrying (pos: null) all protect a press exactly as they already protect a
    // basket from peck-lane.
    const laneSequence = enemy.laneSequence || [1];
    const lane = laneSequence[(state.turn - 1) % laneSequence.length];
    if (enemy.laneMarkers?.[lane]) enemy.pos = enemy.laneMarkers[lane];
    const targets = Object.values(state.objects).filter((object) => object.pos && !object.removed && !object.guarded && object.lane === lane && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
    targets.sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
    const target = targets[0];
    if (!target) {
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "advance", lane });
      return;
    }
    target.value = target.value + (enemy.floodAmount || 1);
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "flood", objectId: target.id, lane, newValue: target.value });
    return;
  }
  if (enemy.behaviour === "grow-toward") {
    // The Hollow Bough Awakens: Overgrowth approaches a single named object
    // (`enemy.targetObjectId` — the memorial) and, once adjacent, damages it unless it is
    // guarded or already damaged. Modelled on obscure-operator/steal-highest's exact
    // adjacency-then-strike, stop-one-hex-short pathing, generalised to a `damaged` flag
    // instead of resetting a value, since a plain object has no hp of its own to reduce.
    const target = state.objects[enemy.targetObjectId];
    if (!target?.pos) { state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "watch" }); return; }
    if (hexDistance(enemy.pos, target.pos) <= 1) {
      if (target.guarded || target.damaged) {
        state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "blocked", objectId: target.id });
        return;
      }
      target.damaged = true;
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "strike", objectId: target.id });
      return;
    }
    const blocked = Object.values(state.units).filter((unit) => unit.hp > 0 && unit.id !== enemy.id).map((unit) => unit.pos);
    const path = shortestPath(state, enemy.pos, target.pos, { blocked });
    if (path?.length > 2) {
      enemy.pos = path[Math.min(enemy.move || 1, path.length - 2)];
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "move", to: enemy.pos });
    }
    return;
  }
  if (enemy.behaviour === "wilt-root") {
    // The Rootfire Relay: Strawling wilts the single highest-value unguarded root anywhere on
    // the board each active round — no lane partitioning needed, unlike peck-lane/flood-lane,
    // since this map's roots form one connected relay rather than separate lanes. Guard,
    // Stabilise and a root simply not being placed all protect it, same as every other
    // value-wilting/-raising enemy in this project.
    const targets = Object.values(state.objects).filter((object) => object.kind === "root" && object.pos && !object.guarded && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
    targets.sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
    const target = targets[0];
    if (!target) { state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "watch" }); return; }
    target.value = Math.max(0, target.value - 1);
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "wilt", objectId: target.id, newValue: target.value });
    return;
  }
  if (enemy.behaviour === "gust") {
    // Crosswind, rebuilt on the rotation-hex primitive (2026-09-17, Nine Across the Turning
    // Bridge — EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5 supersedes the original push-based
    // "sidewind" design entirely; that behaviour and its dedicated tests are removed, not left
    // as orphaned dead code, since nothing else in the project ever used it). Crosswind turns
    // one wind vane — a rotation-hex object named in `enemy.vaneIds` — one step away from
    // orientation 0 (the "open" reading `evaluateObjective`'s capacityLimits `
    // openWhenOrientation` checks for), closing whichever bridge section that vane gates.
    // `guarded` and `stabilisedUntil` (Science's Stabilise, "holds the wind vane") both
    // protect a vane exactly as they already protect every other rotatable object in this
    // project (an operator, a ledger cell). Deterministic and visible: always the nearest
    // still-open, unprotected vane, never a hidden choice.
    const vaneIds = enemy.vaneIds || [];
    const targets = vaneIds
      .map((id) => state.objects[id])
      .filter((vane) => vane?.pos && !vane.guarded && (!vane.stabilisedUntil || vane.stabilisedUntil <= state.turn) && ((vane.orientation || 0) % 6 + 6) % 6 === 0);
    targets.sort((a, b) => hexDistance(enemy.pos, a.pos) - hexDistance(enemy.pos, b.pos) || a.id.localeCompare(b.id));
    const target = targets[0];
    if (!target) {
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "gust" });
      return;
    }
    target.orientation = (((target.orientation || 0) % 6 + 6) % 6) + 1;
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "turn-vane", objectId: target.id, orientation: target.orientation });
    return;
  }
  if (enemy.behaviour === "walk-hedge") {
    // The Hedgejaw Maze: moves the one "hedge" blocking object (`enemy.hedgeId`, kind
    // "hedge", deliberately `movable: false` so ordinary carrying can never clear it) onto
    // whichever stone's requiredFrom gate the party needs next — closing that route until a
    // hero physically displaces it with Geometry's True Shift. Always the current target's own
    // gate, never a hidden or random choice, so it is fully predictable from the visible
    // sequence and progress alone (the same "Logic predicts" fairness every other enemy
    // targeting rule in this project already follows).
    const hedge = state.objects[enemy.hedgeId];
    if (!hedge) { state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "watch" }); return; }
    const sequence = state.objective.sequence || [];
    const nextValue = sequence[state.counters.routeProgress || 0];
    const targetStone = Object.values(state.objects).find((object) => object.kind === "stone" && object.value === nextValue && !object.visited);
    if (!targetStone?.requiredFrom || hedge.pos === targetStone.requiredFrom) {
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "watch" });
      return;
    }
    hedge.pos = targetStone.requiredFrom;
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "close", objectId: hedge.id, to: hedge.pos });
    return;
  }
  if (enemy.behaviour === "reverse-next") {
    // Widdershins (The Widdershins Path): reverse the next unvisited, unguarded stone in the
    // route sequence — the one the party actually needs next, always fully predictable from
    // the visible sequence and routeProgress. Never attacks a hero. Reversing an
    // already-reversed stone is a harmless no-op (state.turn's flag just stays true).
    const sequence = state.objective?.sequence || [];
    const nextValue = sequence[state.counters.routeProgress || 0];
    if (nextValue == null) {
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "still" });
      return;
    }
    const target = Object.values(state.objects).find((object) => object.kind === "stone" && object.value === nextValue && !object.visited && !object.guarded);
    if (!target) {
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "still" });
      return;
    }
    target.reversed = true;
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "reverse", objectId: target.id });
    return;
  }
  const players = Object.values(state.units).filter((unit) => unit.side === "player" && unit.hp > 0);
  players.sort((a, b) => hexDistance(enemy.pos, a.pos) - hexDistance(enemy.pos, b.pos) || a.initiative - b.initiative || a.id.localeCompare(b.id));
  const target = players[0];
  if (!target) return;
  if (hexDistance(enemy.pos, target.pos) <= (enemy.range || 1)) {
    if (target.guarded) {
      target.guarded = false;
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "blocked", targetId: target.id });
    } else {
      const exhausts = target.hp - (enemy.damage || 1) <= 0;
      target.hp = Math.max(0, target.hp - (enemy.damage || 1));
      if (exhausts) state.counters.unitsExhausted += 1;
      state.counters.damageTaken += enemy.damage || 1;
      state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "strike", targetId: target.id });
    }
    return;
  }
  const blocked = Object.values(state.units).filter((unit) => unit.hp > 0 && unit.id !== enemy.id).map((unit) => unit.pos);
  const adjacent = hexNeighbours(target.pos).filter((key) => state.board[key] && !blocked.includes(key));
  const routes = adjacent.map((key) => shortestPath(state, enemy.pos, key, { blocked })).filter(Boolean).sort((a, b) => a.length - b.length);
  if (routes[0]?.length > 1) {
    enemy.pos = routes[0][Math.min(enemy.move || 1, routes[0].length - 1)];
    state.history.push({ turn: state.turn, phase: "enemy", unitId: enemy.id, action: "move", to: enemy.pos });
  }
}

export function evaluateObjective(state) {
  const objective = state.objective || {};
  const family = EXPEDITION_OBJECTIVE_FAMILIES[objective.family]?.evaluator || objective.family;
  const livingEnemies = Object.values(state.units).filter((unit) => unit.side === "enemy" && unit.hp > 0);
  const livingPlayers = Object.values(state.units).filter((unit) => unit.side === "player" && unit.hp > 0);
  const objectAt = (hexes) => Object.values(state.objects).filter((object) => object.pos && hexes.includes(object.pos) && !object.removed);
  // A capacity limit is a failure condition layered on top of any family, not a family of its
  // own (The Nine Across the Bridge's two bridge sections, each with a live carried-weight
  // cap). Checked before the family dispatch so it can fail the expedition immediately,
  // independent of whatever the objective's own success condition is.
  if (objective.capacityLimits) {
    for (const limit of objective.capacityLimits) {
      // openWhenOrientation (Nine Across the Turning Bridge's rotating wind vanes): an
      // optional gate on a limit's own max, read off a rotation hex's live orientation
      // (expedition-engine.js's rotationHexTracks/reframeTarget already own that field) —
      // closed to zero, not merely reduced, so a misrotated vane is a fully visible, fully
      // deterministic "do not send a load here yet" rather than a softened trap. Undefined
      // leaves every existing capacityLimits scenario (Nine Across the Bridge's original
      // shipped version) completely unaffected.
      let max = limit.max;
      if (limit.openWhenOrientation) {
        const gate = state.objects[limit.openWhenOrientation.objectId];
        const orientation = ((gate?.orientation || 0) % 6 + 6) % 6;
        max = limit.openWhenOrientation.orientations.includes(orientation) ? limit.max : 0;
      }
      const total = objectAt(limit.hexes).reduce((sum, object) => sum + Number(object.value || 0), 0);
      if (total > max) return { complete: false, failed: true, progress: `${limit.label || "section"} overloaded: ${total}/${max}` };
    }
  }
  if (family === "eliminate") return { complete: livingEnemies.length === 0, progress: `${state.counters.enemiesDefeated} defeated` };
  if (family === "capture") {
    const occupied = objective.hexes.filter((hex) => livingPlayers.some((unit) => unit.pos === hex)).length;
    const required = objective.count || objective.hexes.length;
    const held = occupied >= required;
    // sumHexes/sumTarget (The Rooststorm's directional-sum layer): an optional secondary
    // AND-condition, the same pattern balance's exitHex and orderedRoute's centreHex already
    // establish — a scenario may add it without every existing capture map (Maybe-Flock Roost's
    // original three-post hold) needing any change, since both fields are undefined for them.
    if (!objective.sumHexes) return { complete: held, progress: `${occupied}/${required} held` };
    const sum = objectAt(objective.sumHexes).reduce((total, object) => total + Number(object.value || 0), 0);
    const summed = sum === objective.sumTarget;
    return { complete: held && summed, progress: `${occupied}/${required} held · ${sum}/${objective.sumTarget} directional sum` };
  }
  if (family === "exactSum") {
    const total = objectAt(objective.hexes).reduce((sum, object) => sum + Number(object.value || 0), 0);
    return { complete: total === objective.target, progress: `${total}/${objective.target}` };
  }
  if (family === "balance") {
    const left = objectAt(objective.leftHexes).reduce((sum, object) => sum + Number(object.value || 0), 0);
    const right = objectAt(objective.rightHexes).reduce((sum, object) => sum + Number(object.value || 0), 0);
    const exited = !objective.exitHex || livingPlayers.some((unit) => unit.pos === objective.exitHex);
    const target = objective.target;
    // Weigh-bridge state (EXPEDITIONS_CLAUDE_HANDOVER.md "UI reconciliation contract"): each
    // platform's target, currentTotal, difference and status are engine-owned so the
    // presentation layer never invents its own sum. A platform is only "balanced" at the
    // exact target, so two platforms that happen to hold equal but excess weight (possible
    // with a different crate set than Unequal Crossing's, whose four values can only ever
    // tie at 0 or at the target) are correctly reported as overloaded, not complete.
    const sideStatus = (total) => (total === target ? "balanced" : total > target ? "overloaded" : "underweight");
    const leftStatus = sideStatus(left);
    const rightStatus = sideStatus(right);
    const complete = leftStatus === "balanced" && rightStatus === "balanced" && exited;
    return {
      complete,
      progress: `${left} : ${right}${exited ? " · exit reached" : ""}`,
      values: { left, right, exited },
      sides: {
        left: { target, currentTotal: left, difference: left - target, status: leftStatus },
        right: { target, currentTotal: right, difference: right - target, status: rightStatus },
      },
    };
  }
  if (family === "orderedRoute") {
    const progress = state.counters.routeProgress || 0;
    const sequenceDone = progress >= objective.sequence.length;
    // centreHex (The Widdershins Path): an optional final step after the whole sequence is
    // visited — a living hero must also be standing on it. Optional so other orderedRoute
    // maps that only care about the sequence itself (e.g. Little Reckoning's Backwards
    // Courtyard) are unaffected.
    const centred = !objective.centreHex || livingPlayers.some((unit) => unit.pos === objective.centreHex);
    return { complete: sequenceDone && centred, progress: `${progress}/${objective.sequence.length}${objective.centreHex ? ` · ${centred ? "centre reached" : "centre open"}` : ""}` };
  }
  if (family === "delivery") {
    const delivered = objectAt(objective.destinationHexes);
    const total = delivered.reduce((sum, object) => sum + Number(object.value || 0), 0);
    return { complete: objective.target == null ? delivered.length >= objective.count : total === objective.target, progress: objective.target == null ? `${delivered.length}/${objective.count}` : `${total}/${objective.target}` };
  }
  if (family === "containment") {
    const target = state.units[objective.targetId];
    const neighbours = target ? hexNeighbours(target.pos) : [];
    const closed = neighbours.filter((hex) => livingPlayers.some((unit) => unit.pos === hex) || state.board[hex]?.terrain === "blocked").length;
    return { complete: closed >= (objective.requiredSides || 6), progress: `${closed}/${objective.requiredSides || 6} sides` };
  }
  if (family === "connect") {
    const active = new Set(objective.activeNodes || state.flags.activeNodes || []);
    // Route markers (a rotatable object with `orientation` and `paths`, see
    // routeMarkerConnections) contribute edges dynamically, alongside any fixed edges the
    // scenario also defines — a scenario may use either or both.
    const routeEdges = (objective.routeMarkerIds || []).flatMap((id) => routeMarkerConnections(state.objects[id]));
    const edges = [...(objective.edges || []), ...routeEdges];
    const connected = graphConnected(active, edges, objective.start, objective.end);
    return { complete: connected, progress: `${active.size} active nodes` };
  }
  if (family === "rescue") {
    const rescued = Boolean(state.flags[objective.rescueFlag || "rescued"]);
    const exited = livingPlayers.some((unit) => unit.pos === objective.exitHex);
    return { complete: rescued && exited, progress: `${rescued ? "rescued" : "not rescued"} · ${exited ? "exit reached" : "exit open"}` };
  }
  if (family === "protect") {
    const target = state.objects[objective.targetId] || state.units[objective.targetId];
    // A unit target's survival is its hp (unchanged). An object target has no hp at all — its
    // "damaged" flag (already the schema's own field for Mender's Restore to repair) is the
    // equivalent failure state, so a damaged memorial object correctly fails to complete
    // (The Hollow Bough Awakens) without weakening the original unit-based check at all: a
    // real unit target never sets `damaged`, so this added clause is always true for it.
    const survives = target && (target.hp == null || target.hp > 0) && !target.damaged;
    return { complete: state.turn > state.turnLimit && survives, progress: `${Math.min(state.turn, state.turnLimit)}/${state.turnLimit} rounds` };
  }
  if (family === "optimise") {
    // Two ways to feed this evaluator: a scenario-owned counter/flag pair (e.g. a route's
    // running total), or — when destinationHexes/requiredCount are set instead — deriving
    // both directly from delivered objects (e.g. The Examination Clock: value is the summed
    // duration of every task token processed at a station, complete once all required tasks
    // have been delivered).
    const usesDelivery = Array.isArray(objective.destinationHexes);
    const delivered = usesDelivery ? objectAt(objective.destinationHexes) : [];
    const value = usesDelivery
      ? delivered.reduce((sum, object) => sum + Number(object.value || 0), 0)
      : Number(state.counters[objective.counter] || 0);
    const completeFlag = usesDelivery
      ? delivered.length >= (objective.requiredCount || 0)
      : Boolean(state.flags[objective.completeFlag || "baseComplete"]);
    const within = objective.mode === "max" ? value >= objective.target : value <= objective.target;
    const processedNote = usesDelivery ? ` · ${delivered.length}/${objective.requiredCount} processed` : "";
    return { complete: completeFlag && within, progress: `${value} ${objective.mode === "max" ? "minimum" : "maximum"} ${objective.target}${processedNote}` };
  }
  if (family === "constraintGrid") {
    const satisfied = (objective.constraints || []).filter((constraint) => constraintSatisfied(state, constraint)).length;
    return { complete: satisfied === (objective.constraints || []).length, progress: `${satisfied}/${(objective.constraints || []).length} constraints` };
  }
  return { complete: false, progress: "Objective evaluator not configured" };
}

function graphConnected(active, edges, start, end) {
  if (!active.has(start) || !active.has(end)) return false;
  const queue = [start];
  const seen = new Set(queue);
  while (queue.length) {
    const current = queue.shift();
    if (current === end) return true;
    for (const [a, b] of edges) {
      const next = a === current ? b : b === current ? a : null;
      if (next && active.has(next) && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

// A route marker (EXPEDITIONS_SPEC.md's "route tile"): a board object with a fixed `pos`, a
// rotatable `orientation` (0-5) and `paths` — pairs of local hex-edge directions (matching
// HEX_DIRECTIONS' order) it connects when orientation is 0. Rotating it (see
// expedition-commander.js's primary_commander_3) changes which pair of its six neighbouring
// hexes it currently joins. Used by the "connect" family via `objective.routeMarkerIds`.
export function routeMarkerConnections(marker) {
  const neighbours = hexNeighbours(marker.pos);
  const orientation = ((marker.orientation || 0) % 6 + 6) % 6;
  return (marker.paths || []).map(([a, b]) => [neighbours[(a + orientation) % 6], neighbours[(b + orientation) % 6]]);
}

// A rotation hex (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.2): the same rotatable-tile
// primitive as a route marker, generalised to carry up to three richer "tracks" instead of
// plain connectivity, so the one mechanism covers all three approved skins — an operator
// wheel transforms a travelling value, a signal prism only "aligns" when two ports share a
// signature, and a current turner restricts which direction a value may enter. A track entry
// may be a plain `[a, b]` edge pair (identical to a route marker's `paths` entry, so an
// existing route marker is already a rotation hex with no tracks needing the extra fields) or
// a descriptor `{ edges: [a, b], op, flow, signature }`:
//   - `op` (optional): `{ type: "+"|"-"|"*"|"/"|"inverse", value }`, applied to a value passing
//     through by `applyTrackOperation` — the operator wheel skin. The four arithmetic types
//     reuse the exact op-string vocabulary `CHAIN_CONSTRAINT_OPERATORS` already established by
//     Reckoner's Reframe and the Smudged Stones "chain" constraint.
//   - `flow` (optional, default "both"): "AB" admits a value only entering from `edges[0]`'s
//     side, "BA" only from `edges[1]`'s side — the current turner skin (a river or conveyor
//     that only runs one way once rotated).
//   - `signature` (optional): an opaque label a scenario's own connectivity check can compare
//     with `tracksAligned` against whatever the neighbouring tile is wired to — the signal
//     prism skin. Two untagged tracks (`signature` unset on both) always align, matching a
//     plain route marker's unconditional connection.
function normaliseRotationTrack(entry) {
  return Array.isArray(entry)
    ? { edges: entry, op: null, flow: "both", signature: null }
    : { edges: entry.edges, op: entry.op ?? null, flow: entry.flow ?? "both", signature: entry.signature ?? null };
}

// Current hex pairs for every track on `tile` (tracks, or paths as a fallback so a plain route
// marker — no tracks field — still resolves through this function unchanged), at its present
// orientation.
export function rotationHexTracks(tile) {
  const neighbours = hexNeighbours(tile.pos);
  const orientation = ((tile.orientation || 0) % 6 + 6) % 6;
  return (tile.tracks || tile.paths || []).map((entry) => {
    const track = normaliseRotationTrack(entry);
    const [a, b] = track.edges;
    return { ...track, hexes: [neighbours[(a + orientation) % 6], neighbours[(b + orientation) % 6]] };
  });
}

// Applies one track's operator to a travelling value. `null`/missing `op` passes the value
// through unchanged (a plain connector track, or a signal prism whose job is alignment, not
// transformation).
export function applyTrackOperation(op, value) {
  if (!op) return value;
  if (op.type === "inverse") return -value;
  const fn = CHAIN_CONSTRAINT_OPERATORS[op.type];
  if (!fn) throw new Error(`Unknown rotation-hex track operation "${op.type}"`);
  if (op.type === "/" && !op.value) throw new Error("A rotation-hex track cannot divide by zero");
  return fn(value, op.value);
}

// Resolves what happens when a value arrives at `tile` from `fromHex`: finds the track whose
// current hex pair includes `fromHex`, honours its `flow` direction, and applies its operator.
// Returns `null` if no open track admits entry from that side — a misrotated or jammed tile
// genuinely blocks travel, which is the point of rotating it in the first place.
export function travelThroughRotationHex(tile, fromHex, value) {
  for (const track of rotationHexTracks(tile)) {
    const [hexA, hexB] = track.hexes;
    const enteringFromA = fromHex === hexA;
    const enteringFromB = fromHex === hexB;
    if (!enteringFromA && !enteringFromB) continue;
    if (track.flow === "AB" && enteringFromB) continue;
    if (track.flow === "BA" && enteringFromA) continue;
    return { toHex: enteringFromA ? hexB : hexA, value: applyTrackOperation(track.op, value), signature: track.signature };
  }
  return null;
}

// A signal prism's rule: two tracks "align" only when they share a declared signature, or
// neither declares one (an ungated connection, same as a plain route marker joining freely).
export function tracksAligned(trackA, trackB) {
  return (trackA?.signature ?? null) === (trackB?.signature ?? null);
}

// Weighted graph edges for the "connect" family: an edge is either a [a, b] pair (default
// weight 1) or a [a, b, weight] triple — graphConnected only ever reads the first two
// elements, so this is backward compatible with every existing edges list. Returns every
// edge touching one node with its cost, for a Commander power (or future UI) to reveal.
export function edgesFromNode(edges, nodeId) {
  return (edges || [])
    .filter(([a, b]) => a === nodeId || b === nodeId)
    .map(([a, b, weight]) => ({ to: a === nodeId ? b : a, weight: weight ?? 1 }));
}

// Terrain-history record (junior_commander_4, and the fix for placeObstacle's own "not yet
// actually temporary" limitation): placeObstacle records a tile's `previousTerrain` before
// changing it, so it can be reversed later. Only the terrain in place before the first
// recorded change is kept, so this always restores the tile's original state.
export function restoreTileTerrain(state, hex) {
  const next = cloneState(state);
  const tile = next.board[hex];
  if (!tile) throw new Error(`${hex} is not on the board`);
  if (tile.previousTerrain === undefined) throw new Error(`${hex} has no remembered terrain to restore`);
  tile.terrain = tile.previousTerrain;
  delete tile.previousTerrain;
  return next;
}

const CHAIN_CONSTRAINT_OPERATORS = { "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b, "/": (a, b) => a / b };

function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}

function constraintSatisfied(state, constraint) {
  if (constraint.kind === "chain") {
    // Logic's Reframe sets each operator-object's `op` field (see useDisciplineAction and
    // reframeTarget); this walks valueIds/operatorIds left to right — exactly the route a
    // number token would physically travel — and checks the result against the target. An
    // unset or unknown operator can never accidentally satisfy the chain.
    const values = constraint.valueIds.map((id) => Number(state.objects[id]?.value || 0));
    const operators = constraint.operatorIds.map((id) => state.objects[id]?.op);
    if (operators.some((op) => !CHAIN_CONSTRAINT_OPERATORS[op])) return false;
    let result = values[0];
    for (let i = 0; i < operators.length; i += 1) result = CHAIN_CONSTRAINT_OPERATORS[operators[i]](result, values[i + 1]);
    return result === constraint.target;
  }
  const values = constraint.objectIds.map((id) => Number(state.objects[id]?.value || 0));
  if (constraint.kind === "sum") return values.reduce((sum, value) => sum + value, 0) === constraint.target;
  if (constraint.kind === "allDifferent") return new Set(values).size === values.length;
  if (constraint.kind === "parity") return values.every((value) => Math.abs(value % 2) === (constraint.parity === "odd" ? 1 : 0));
  if (constraint.kind === "lessThan") return values[0] < values[1];
  if (constraint.kind === "greaterThan") return values[0] > values[1];
  // Hive Ledger group rules (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.3): "use 1-7 once" is
  // stricter than allDifferent above — it requires the exact value set, not merely distinct
  // values, so a group of 7 cells reading 1,1,2,3,4,5,6 (distinct-looking gaps) still fails.
  if (constraint.kind === "useEachOnce") {
    const [min, max] = constraint.range;
    if (values.length !== max - min + 1) return false;
    const wanted = new Set(Array.from({ length: max - min + 1 }, (_, index) => min + index));
    return values.every((value) => wanted.has(value)) && new Set(values).size === values.length;
  }
  // "have one even value" / "contain exactly two primes" both name an exact count within a
  // group, not "every cell" (parity above) — a distinct rule shape, not a stretch of it.
  if (constraint.kind === "parityCount") return values.filter((value) => Math.abs(value % 2) === (constraint.parity === "odd" ? 1 : 0)).length === constraint.count;
  if (constraint.kind === "primeCount") return values.filter(isPrime).length === constraint.count;
  return false;
}

export function refreshExpeditionStatus(state) {
  const result = evaluateObjective(state);
  state.objectiveState = result;
  const livingPlayers = Object.values(state.units).filter((unit) => unit.side === "player" && unit.hp > 0);
  if (result.complete) state.status = "won";
  else if (result.failed || !livingPlayers.length || state.turn > state.turnLimit) state.status = "lost";
  else state.status = "playing";
  return state;
}

export function solveBalancedPartition(values, target = null) {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total % 2 && target == null) return [];
  const goal = target ?? total / 2;
  const solutions = [];
  for (let mask = 1; mask < 2 ** values.length - 1; mask += 1) {
    const left = values.filter((_, index) => mask & (1 << index));
    const right = values.filter((_, index) => !(mask & (1 << index)));
    if (left.reduce((sum, value) => sum + value, 0) === goal && right.reduce((sum, value) => sum + value, 0) === goal) solutions.push({ left, right });
  }
  const unique = new Map();
  for (const solution of solutions) {
    const left = [...solution.left].sort((a, b) => a - b);
    const right = [...solution.right].sort((a, b) => a - b);
    const key = [left.join(","), right.join(",")].sort().join("|");
    if (!unique.has(key)) unique.set(key, { left, right });
  }
  return [...unique.values()];
}

// E4: "the game states what changed and why the objective failed" (EXPEDITIONS_BUILD_BRIEF.md
// §2). Works for any objective family, since evaluateObjective already produces a
// family-specific, child-readable `progress` string — this just explains WHY the run
// ended (or hasn't) on top of that, generically, for any scenario.
export function explainExpeditionOutcome(state) {
  const objective = evaluateObjective(state);
  if (state.status === "won") return { outcome: "won", reason: "objective_complete", message: `Objective complete: ${objective.progress}.` };
  if (state.status !== "lost") return { outcome: "playing", reason: null, message: objective.progress };
  const livingPlayers = Object.values(state.units).filter((unit) => unit.side === "player" && unit.hp > 0);
  if (!livingPlayers.length) {
    return { outcome: "lost", reason: "party_exhausted", message: `Every hero was exhausted before the objective was won. Last state: ${objective.progress}.` };
  }
  if (state.turn > state.turnLimit) {
    return { outcome: "lost", reason: "turn_limit", message: `Round ${state.turnLimit} ended before the objective was won. Last state: ${objective.progress}.` };
  }
  return { outcome: "lost", reason: "unknown", message: objective.progress };
}

// E4 timing metric: how this actual run compares to the pre-play estimate
// (estimateExpeditionMinutes), for balancing and for a post-run summary.
export function expeditionTimingReport(state) {
  return {
    roundsUsed: Math.min(state.turn, state.turnLimit),
    roundLimit: state.turnLimit,
    actionsUsed: state.counters.actions,
    estimatedMinutes: estimateExpeditionMinutes(state),
  };
}

// Performance marks (EXPEDITIONS_SPEC.md §23, EXPEDITIONS_CLAUDE_HANDOVER.md): decorative
// records shown after a win and stored in Expedition progress (wm-progress.js's per-scenario
// `marks` field) — they never gate lessons, cards, bosses, Adventures or other Expeditions.
// `par` is a scenario's reference-trace figures (EXPEDITION_CATALOGUE's `marksPar`), so a
// scenario with no par data simply offers no turn/movement mark rather than always awarding
// one. The spec's fifth category, "optional mathematical constraint", is scenario-specific
// and deliberately deferred — only the four generic marks below are computed here.
export const EXPEDITION_MARK_IDS = ["no_exhaustion", "no_enemies_defeated", "exact_turn_target", "minimum_movement"];

export function computeExpeditionMarks(state, par = {}) {
  if (state.status !== "won") return [];
  const marks = [];
  if (!state.counters.unitsExhausted) marks.push("no_exhaustion");
  if (!state.counters.enemiesDefeated) marks.push("no_enemies_defeated");
  const roundsUsed = Math.min(state.turn, state.turnLimit);
  if (par.turns != null && roundsUsed <= par.turns) marks.push("exact_turn_target");
  if (par.movement != null) {
    const movementUsed = state.history.filter((entry) => entry.action === "move").reduce((sum, entry) => sum + (entry.distance || 0), 0);
    if (movementUsed <= par.movement) marks.push("minimum_movement");
  }
  return marks;
}

// Result rank (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §8.2): three visible, deterministic
// tiers built only from the marks computeExpeditionMarks already returns for this run — no
// new hidden number and no die roll. "Achievable" is scenario-specific: the two generic marks
// above are always available, but exact_turn_target/minimum_movement only exist to earn at all
// when the scenario's own `par.turns`/`par.movement` is set (exactly computeExpeditionMarks's
// own condition for pushing them), so a scenario with no turn or movement par has a two-mark
// ceiling rather than an unreachable four-mark one. Takes the same `marks` array
// computeExpeditionMarks returns for one run, not a scenario's cumulative best-ever marks set
// (wm-progress.js's stored `marks` field) — those answer a different question (best marks ever
// vs this run's rank) and must not be conflated.
export function rankExpeditionMarks(marks, par = {}) {
  const achievable = 2 + (par.turns != null ? 1 : 0) + (par.movement != null ? 1 : 0);
  if (marks.length >= achievable) return "gold";
  if (marks.length * 2 >= achievable) return "silver";
  return "bronze";
}

export function estimateExpeditionMinutes(state, secondsPerDecision = 9, secondsPerEnemy = 2.5) {
  const players = Object.values(state.units).filter((unit) => unit.side === "player").length;
  const enemies = Object.values(state.units).filter((unit) => unit.side === "enemy").length;
  const playerDecisions = players * 2 * state.turnLimit;
  const enemyActions = enemies * state.turnLimit;
  return Math.round(((playerDecisions * secondsPerDecision) + (enemyActions * secondsPerEnemy) + 35) / 6) / 10;
}

// Quick: "win tied initiative" (EXPEDITIONS_BUILD_BRIEF.md §9). A small, general-purpose
// tie-break helper for anything that needs a strict ordering between two units — it does
// not alter the enemy AI's own tie-break rule (lowest player initiative), which is already
// specified separately in EXPEDITIONS_BUILD_BRIEF.md §14 and implemented in resolveEnemy.
export function initiativeWinner(a, b) {
  if (a.initiative !== b.initiative) return a.initiative < b.initiative ? a : b;
  if (a.trait === "quick" && b.trait !== "quick") return a;
  if (b.trait === "quick" && a.trait !== "quick") return b;
  return a.id.localeCompare(b.id) <= 0 ? a : b;
}

// Foresight: "preview one additional consequence before confirming an action" (§9). Runs
// the action on a clone (every action function already clones internally, so the state
// passed in is never mutated) and, for a foresight-trait unit, also simulates what the
// board would look like if the round ended right now — a second, deterministic layer of
// consequence a non-foresight unit does not get to see before committing.
export function previewCommandConsequences(state, unitId, actionFn, ...args) {
  const immediate = actionFn(state, ...args);
  const consequences = [{ label: "immediate", state: immediate }];
  const unit = state.units[unitId];
  if (unit?.trait === "foresight" && immediate.phase === "player") {
    try {
      consequences.push({ label: "if the round ended now", state: resolveEnemyPhase(endPlayerPhase(immediate)) });
    } catch {
      // Not every state can be safely fast-forwarded this way (e.g. the phase already
      // changed) — foresight then simply has nothing extra to show for this action.
    }
  }
  return consequences;
}

// Dispatches a role's single always-available action (EXPEDITIONS_BUILD_BRIEF.md §8) by
// its basic-action key from EXPEDITION_ROLES, rather than by role name, so a unit whose
// authored role differs from a scenario's expectation still fails with a clear error
// instead of silently doing the wrong thing.
export function useRoleAction(state, unitId, actionKey, payload = {}) {
  if (actionKey === "guard") return guardTarget(state, unitId, payload.targetId);
  if (actionKey === "restore") return restoreTarget(state, unitId, payload.targetId);
  if (actionKey === "reframe") return reframeTarget(state, unitId, payload.targetId, payload);
  if (actionKey === "shove") return shoveTarget(state, unitId, payload.targetId, payload.direction);
  if (actionKey === "mark") return markTarget(state, unitId, payload.targetId);
  throw new Error(`Unknown role action: ${actionKey}`);
}

function eventFromHistoryEntry(entry) {
  if (entry.action === "move") return { type: "UNIT_MOVED", unitId: entry.unitId, path: [entry.from, entry.to], cost: entry.distance };
  if (entry.action === "collect" || entry.action === "drop") return { type: "OBJECT_PLACED", objectId: entry.objectId, unitId: entry.unitId, pos: entry.to ?? null };
  if (entry.phase === "enemy") return { type: "INTENT_RESOLVED", enemyId: entry.unitId, action: entry.action, targetId: entry.targetId ?? entry.objectId ?? null };
  return { type: "ACTION_RESOLVED", unitId: entry.unitId, action: entry.action, detail: entry };
}

// The command dispatcher recommended in EXPEDITIONS_CLAUDE_HANDOVER.md's "Engine layer".
// It wraps the existing named functions (kept as the underlying implementation so every
// current caller — ExpeditionScreen.jsx, scripts/simulate_unequal_crossing.mjs, existing
// tests — keeps working unchanged) and converts each command's result into structured
// events, so presentation can animate without recomputing any rule itself.
export function applyExpeditionCommand(state, command) {
  const handlers = {
    MOVE: () => moveUnit(state, command.unitId, command.destination),
    INTERACT: () => interactObject(state, command.unitId, command.targetId, command.destination ?? null),
    GUARD: () => guardTarget(state, command.unitId, command.targetId),
    STRIKE: () => strikeEnemy(state, command.unitId, command.targetId, command.parameters ?? null),
    USE_ACTION: () => useDisciplineAction(state, command.unitId, command.actionId, command.parameters || {}),
    ROLE_ACTION: () => useRoleAction(state, command.unitId, command.actionId, command.parameters || {}),
    VISIBLE_CHECK: () => attemptCheck(state, command.unitId, command.parameters || {}),
    VISIT_STONE: () => visitStone(state, command.unitId, command.targetId),
    END_PLAYER_PHASE: () => endPlayerPhase(state),
    RESOLVE_ENEMY_PHASE: () => resolveEnemyPhase(state),
  };
  const handler = handlers[command.type];
  if (!handler) throw new Error(`Unknown expedition command type: ${command.type}`);
  const objectiveBefore = evaluateObjective(state);
  const next = handler();
  const events = next.history.slice(state.history.length).map(eventFromHistoryEntry);
  const objectiveAfter = evaluateObjective(next);
  if (objectiveBefore.complete !== objectiveAfter.complete || objectiveBefore.progress !== objectiveAfter.progress) {
    events.push({ type: "OBJECTIVE_UPDATED", before: objectiveBefore, after: objectiveAfter });
  }
  return { state: next, events };
}
