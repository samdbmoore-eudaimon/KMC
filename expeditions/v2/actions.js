import {
  ALCOVE, AP_PER_ROUND, COMMAND_TYPES, HAND_COMMANDS, JOBS, SCOUT_MARK, STAT_NAMES, commissionProfile, STORM_ORCHARD_COST,
} from "./constants.js";
import { getPuzzleHooks } from "./puzzle-hooks.js";
import { forecastEnemyPhase, runEnemyPhase } from "./enemy.js";
import { rangeKeys } from "./hex.js";
import {
  addGrant, canonicalStationId, cancelHold, closureBlockers, cloneState, computeOutputsFor, damageEnemy, emit, enterCost, figureAt, getEnemy, getHero, getIndex,
  grantStrength, hasSight, hexDistance, neighbourKeys, profileOf, reachableHexes, recomputeOutputs, resolveTarget, restoreSnapshot, settlePendingPassages,
  snapshotOf, stationCapacity, stationMaxIntegrity, stationState, strikeCalculation, validatePath, enemyDef, enemyRule, occupiedKeys,
} from "./rules.js";

const ZERO_AP = new Set(["edit-draft", "compare-loads", "request-hint", "undo", "end-round"]);
const NO_UNDO_ENTRY = new Set(["undo", "end-round", "compare-loads"]);
const DRAFT_EDITS = ["set-cell", "rotate-wheel", "assign-load", "inferred-value", "place-piece", "remove-piece", "select-outputs", "reset-draft"];
const MOVE_COMMANDS = new Set(["move", "dash", "intercept"]);

const fail = (reasonCode, reasonParams = {}) => ({ ok: false, reasonCode, reasonParams });
const ok = (extra = {}) => ({ ok: true, factors: [], warnings: [], ...extra });
const asArray = (value) => (Array.isArray(value) ? value : null);
const distinctStrings = (list) => Array.isArray(list) && list.every((x) => typeof x === "string") && new Set(list).size === list.length;
const sameSet = (a, b) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

// ---------- shared target checks ----------

function inReach(s, hero, target, range, { sight = false } = {}) {
  const distance = hexDistance(hero.position, target.hex);
  if (distance > range) return fail("out-of-range", { targetId: target.id, distance, range });
  if (sight && distance > 1 && !hasSight(s, hero.position, target.hex)) return fail("no-line-of-sight", { targetId: target.id });
  return null;
}

function resolveAlly(s, id, { allowSelf = true, hero = null, stations = true, orchard = false, groups = false, sites = false, enemies = false } = {}) {
  const target = resolveTarget(s, id);
  if (!target || !target.alive) return null;
  if (target.kind === "hero") { if (!allowSelf && hero && target.id === hero.id) return null; return target; }
  if (target.kind === "station" && stations) return target;
  if (target.kind === "orchard" && orchard) return target;
  if (target.kind === "group" && groups) return target;
  if (target.kind === "site" && sites) return target;
  if (target.kind === "enemy" && enemies) return target;
  return null;
}

function emitHeroMoved(s, hero, from, path, cause) {
  emit(s, "hero-moved", { heroId: hero.id, from, to: hero.position, path, cause });
}

function relocateHero(s, hero, destination, path, cause) {
  const from = hero.position;
  hero.position = destination;
  emitHeroMoved(s, hero, from, path, cause);
  if (hero.holding) cancelHold(s, hero, "moved");
  settlePendingPassages(s);
}

function relocateEnemy(s, enemy, destination, cause) {
  const from = enemy.position;
  enemy.position = destination;
  emit(s, "enemy-moved", { enemyId: enemy.id, from, to: destination, path: [destination], cause });
  settlePendingPassages(s);
}

function legalStepFor(s, key, flies) {
  return enterCost(s, key, flies) !== Infinity && !figureAt(s, key);
}

function setMark(s, enemyId) {
  s.marks[enemyId] = Math.max(s.marks[enemyId] || 0, SCOUT_MARK);
}

// ---------- strike family ----------

function doStrike(s, cmd, hero, { bonusPower = 0, rangeBonus = 0, placeMark = false, push = false } = {}) {
  const payload = cmd.payload || {};
  const enemy = getEnemy(s, payload.targetId);
  if (!enemy || enemy.defeated) return fail("invalid-target", { targetId: payload.targetId });
  const profile = profileOf(s, hero);
  const range = profile.strikeRange + rangeBonus;
  const distance = hexDistance(hero.position, enemy.position);
  if (distance > range) return fail("out-of-range", { targetId: enemy.id, distance, range });
  if (distance > 1 && !hasSight(s, hero.position, enemy.position)) return fail("no-line-of-sight", { targetId: enemy.id });
  const calc = strikeCalculation(s, hero, enemy, { bonusPower, placeMark });
  const pushDestination = push ? payload.pushDestination ?? null : null;
  if (pushDestination) {
    if (calc.damage <= 0) return fail("push-needs-damage");
    if (enemy.hp - calc.damage <= 0) return fail("push-target-defeated");
    if (hexDistance(enemy.position, pushDestination) !== 1) return fail("push-not-adjacent", { destination: pushDestination });
    if (enterCost(s, pushDestination, false) === Infinity) return fail("push-blocked", { destination: pushDestination });
    if (figureAt(s, pushDestination)) return fail("push-blocked", { destination: pushDestination, by: figureAt(s, pushDestination) });
  }
  const warnings = calc.damage === 0 ? [{ code: "zero-damage", params: { armour: calc.armour, raw: calc.raw } }] : [];
  if (placeMark) setMark(s, enemy.id);
  const hpBefore = enemy.hp;
  emit(s, "strike", { heroId: hero.id, enemyId: enemy.id, ...calc });
  if (calc.damage > 0) {
    damageEnemy(s, enemy, calc.damage, { heroId: hero.id, verb: "strike" }, { factors: calc });
    delete s.marks[enemy.id];
  }
  if (pushDestination) relocateEnemy(s, enemy, pushDestination, "driving-blow");
  return ok({
    warnings,
    factors: [
      { key: "governing", label: STAT_NAMES[calc.governingStat], value: calc.governing },
      { key: "support", value: calc.support, from: calc.supporters },
      { key: "mark", value: calc.mark },
      { key: "bonus", value: calc.bonusPower },
      { key: "armour", value: -calc.armour },
      { key: "damage", value: calc.damage, targetHp: [hpBefore, enemy.hp] },
    ],
    survived: !enemy.defeated,
  });
}

// ---------- individual handlers: (s, cmd, hero) => ok()|fail() ----------

function movementHandler(budgetKey, { requireMark = false } = {}) {
  return (s, cmd, hero) => {
    const payload = cmd.payload || {};
    const profile = profileOf(s, hero);
    const budget = budgetKey === "move" ? profile.moveBudget : budgetKey === "dash" ? profile.dashBudget : profile.interceptBudget;
    const stay = cmd.type === "intercept" && (payload.destination == null || payload.destination === hero.position);
    let moved = { cost: 0, path: [] };
    if (!stay) {
      if (typeof payload.destination !== "string") return fail("missing-destination");
      const check = validatePath(s, hero, payload.destination, payload.path ?? null, budget);
      if (!check.ok) return fail(check.reasonCode, check.reasonParams);
      moved = check;
    } else if (budget <= 0 && !payload.markTargetId) return fail("nothing-to-do");
    let markTarget = null;
    if (requireMark || payload.markTargetId) {
      if (payload.markTargetId == null) markTarget = null;
      else {
        markTarget = getEnemy(s, payload.markTargetId);
        if (!markTarget || markTarget.defeated) return fail("invalid-target", { targetId: payload.markTargetId });
        const finalPos = stay ? hero.position : payload.destination;
        const range = profile.strikeRange;
        const distance = hexDistance(finalPos, markTarget.position);
        if (distance > range) return fail("out-of-range", { targetId: markTarget.id, distance, range });
        if (distance > 1 && !hasSight(s, finalPos, markTarget.position)) return fail("no-line-of-sight", { targetId: markTarget.id });
      }
    }
    if (!stay) relocateHero(s, hero, payload.destination, moved.path, cmd.type);
    if (markTarget) {
      setMark(s, markTarget.id);
      emit(s, "mark-placed", { heroId: hero.id, enemyId: markTarget.id, amount: SCOUT_MARK });
    }
    return ok({ factors: [{ key: "budget", value: budget }, { key: "cost", value: moved.cost }], path: moved.path });
  };
}

function shieldTargets(s, hero, ids, { range, withSight, max, self = true, allowEnemies = false }) {
  if (!distinctStrings(ids) || ids.length < 1 || ids.length > max) return fail("invalid-targets", { count: ids?.length ?? 0, max });
  const targets = [];
  for (const id of ids) {
    const t = resolveAlly(s, id, { hero, allowSelf: self });
    if (!t) return fail("invalid-target", { targetId: id });
    const bad = inReach(s, hero, t, range, { sight: withSight });
    if (bad) return bad;
    targets.push(t);
  }
  return { ok: true, targets };
}

function grantShield(s, target, amount, heroId, source = "cast") {
  addGrant(s, { kind: "shield", targetId: canonicalStationId(target.id), amount, source, heroId });
}

const HANDLERS = {
  move: movementHandler("move"),
  dash: movementHandler("dash"),
  intercept: movementHandler("intercept", { requireMark: true }),
  strike: (s, cmd, hero) => doStrike(s, cmd, hero),
  "exact-blow": (s, cmd, hero) => doStrike(s, cmd, hero, { bonusPower: 2 }),
  "marked-shot": (s, cmd, hero) => doStrike(s, cmd, hero, { rangeBonus: 1, placeMark: true }),
  "driving-blow": (s, cmd, hero) => doStrike(s, cmd, hero, { push: true }),

  guard: (s, cmd, hero) => {
    const t = resolveAlly(s, cmd.payload?.targetId, { hero });
    if (!t) return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, t, 1);
    if (bad) return bad;
    const G = profileOf(s, hero).stats[1];
    if (G <= 0) return fail("no-strength", { stat: "Geometry" });
    const before = grantStrength(s, "shield", canonicalStationId(t.id));
    grantShield(s, t, G, hero.id);
    return ok({ factors: [{ key: "shield", stat: "Geometry", value: G, effectiveBefore: before, effectiveAfter: Math.max(before, G) }] });
  },
  repair: (s, cmd, hero) => repairHandler(s, hero, cmd.payload?.targetId, 1, false),
  lock: (s, cmd, hero) => {
    const t = resolveTarget(s, cmd.payload?.targetId);
    if (!t || t.kind !== "group") return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, t, 1);
    if (bad) return bad;
    const L = profileOf(s, hero).stats[2];
    if (L <= 0) return fail("no-strength", { stat: "Logic" });
    addGrant(s, { kind: "lock", targetId: t.id, amount: L, heroId: hero.id });
    return ok({ factors: [{ key: "lock", stat: "Logic", value: L, groupId: t.id, members: t.group.memberIds || [] }] });
  },
  stabilise: (s, cmd, hero) => {
    const t = resolveTarget(s, cmd.payload?.targetId);
    if (!t || !["station", "group", "site"].includes(t.kind)) return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, t, 1);
    if (bad) return bad;
    const S = profileOf(s, hero).stats[3];
    if (S <= 0) return fail("no-strength", { stat: "Science" });
    addGrant(s, { kind: "stabilise", targetId: canonicalStationId(t.id), amount: S, heroId: hero.id });
    return ok({ factors: [{ key: "stabilise", stat: "Science", value: S, targetId: t.id }] });
  },
  calibrate: (s, cmd, hero) => {
    const t = resolveTarget(s, cmd.payload?.targetId);
    if (!t || t.kind !== "station" || !JOBS.includes(canonicalStationId(t.id))) return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, t, 1);
    if (bad) return bad;
    return chargeStation(s, canonicalStationId(t.id), profileOf(s, hero).stats[0], hero.id);
  },
  hold: (s, cmd, hero) => holdHandler(s, cmd, hero),
  "prepare-alcove": (s, cmd, hero) => {
    const alcove = getIndex(s.blueprint).stations.get("alcove");
    if (!alcove) return fail("no-alcove");
    if (s.preparedAlcove) return fail("alcove-already-prepared");
    const bad = inReach(s, hero, { id: "alcove", hex: alcove.hex }, 1);
    if (bad) return bad;
    s.preparedAlcove = true;
    emit(s, "alcove-prepared", { heroId: hero.id });
    return ok({ factors: [{ key: "alcove", geometryBonus: ALCOVE.geometryBonus, speedRequired: ALCOVE.speedRequired }] });
  },
  counterturn: (s, cmd, hero) => {
    const enemy = getEnemy(s, cmd.payload?.targetId);
    if (!enemy || enemy.defeated) return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, { id: enemy.id, hex: enemy.position }, 3, { sight: true });
    if (bad) return bad;
    const power = enemyRule(s, enemy).disruption(s.blueprint.tier);
    const L = profileOf(s, hero).stats[2];
    if (power <= 0) return fail("enemy-has-no-disruption", { enemyId: enemy.id });
    if (L < power) return fail("logic-too-low", { have: L, need: power });
    if (s.phaseEffects.counters.some((c) => c.enemyId === enemy.id)) return fail("already-countered", { enemyId: enemy.id });
    s.phaseEffects.counters.push({ enemyId: enemy.id, heroId: hero.id });
    emit(s, "counterturn-set", { heroId: hero.id, enemyId: enemy.id });
    return ok({ factors: [{ key: "counterturn", logic: L, disruptionPower: power }] });
  },
  "shared-charge": (s, cmd, hero) => {
    const allocations = asArray(cmd.payload?.allocations);
    if (!allocations) return fail("invalid-allocations");
    const A = profileOf(s, hero).stats[0];
    const seen = new Set();
    let total = 0;
    const plan = [];
    for (const a of allocations) {
      const t = resolveTarget(s, a?.targetId);
      if (!t || t.kind !== "station" || !JOBS.includes(canonicalStationId(t.id))) return fail("invalid-target", { targetId: a?.targetId });
      const store = canonicalStationId(t.id);
      if (seen.has(store)) return fail("duplicate-target", { targetId: a.targetId });
      seen.add(store);
      if (!Number.isInteger(a.amount) || a.amount < 0) return fail("invalid-amount", { targetId: a.targetId });
      const bad = inReach(s, hero, t, 2, { sight: true });
      if (bad) return bad;
      const missing = stationCapacity(s, store) - stationState(s, store).charge;
      if (a.amount > missing) return fail("exceeds-capacity", { targetId: a.targetId, missing });
      total += a.amount;
      plan.push({ store, amount: a.amount });
    }
    if (total > A) return fail("allocation-exceeds-stat", { total, limit: A, stat: "Arithmetic" });
    if (total <= 0) return fail("nothing-to-do");
    for (const p of plan) stationState(s, p.store).charge += p.amount;
    emit(s, "charge-shared", { heroId: hero.id, allocations: plan });
    return ok({ factors: [{ key: "charge", stat: "Arithmetic", limit: A, total }] });
  },
  "field-repair": (s, cmd, hero) => {
    const allocations = asArray(cmd.payload?.allocations);
    if (!allocations) return fail("invalid-allocations");
    const S = profileOf(s, hero).stats[3];
    const seen = new Set();
    let total = 0;
    const plan = [];
    for (const a of allocations) {
      const t = resolveAlly(s, a?.targetId, { hero, orchard: true });
      if (!t) return fail("invalid-target", { targetId: a?.targetId });
      const key = t.kind === "station" ? canonicalStationId(t.id) : t.id;
      if (seen.has(key)) return fail("duplicate-target", { targetId: a.targetId });
      seen.add(key);
      if (!Number.isInteger(a.amount) || a.amount < 0) return fail("invalid-amount", { targetId: a.targetId });
      const bad = inReach(s, hero, t, 2, { sight: true });
      if (bad) return bad;
      const missing = missingIntegrity(s, t);
      if (a.amount > missing) return fail("exceeds-missing", { targetId: a.targetId, missing });
      total += a.amount;
      plan.push({ target: t, amount: a.amount });
    }
    if (total > 2 * S) return fail("allocation-exceeds-stat", { total, limit: 2 * S, stat: "Science" });
    if (total <= 0) return fail("nothing-to-do");
    for (const p of plan) applyRestore(s, p.target, p.amount, hero.id);
    return ok({ factors: [{ key: "field-repair", stat: "Science", limit: 2 * S, total }] });
  },
  "true-shift": (s, cmd, hero) => {
    const t = resolveTarget(s, cmd.payload?.targetId);
    if (!t || !t.alive || (t.kind !== "hero" && t.kind !== "enemy") || t.id === hero.id) return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, t, 2, { sight: true });
    if (bad) return bad;
    const destination = cmd.payload?.destination;
    if (typeof destination !== "string" || hexDistance(t.hex, destination) !== 1) return fail("shift-not-adjacent", { destination });
    const flies = t.kind === "enemy" && !!enemyRule(s, getEnemy(s, t.id)).flies;
    if (!legalStepFor(s, destination, flies)) return fail("shift-blocked", { destination, by: figureAt(s, destination) });
    const G = profileOf(s, hero).stats[1];
    if (t.kind === "hero") {
      const moved = getHero(s, t.id);
      relocateHero(s, moved, destination, [destination], "true-shift");
      if (G > 0) grantShield(s, t, G, hero.id);
    } else relocateEnemy(s, getEnemy(s, t.id), destination, "true-shift");
    return ok({ factors: [{ key: "shift", from: t.hex, to: destination }, { key: "shield", stat: "Geometry", value: t.kind === "hero" ? G : 0 }] });
  },
  "wide-brace": (s, cmd, hero) => {
    const G = profileOf(s, hero).stats[1];
    const check = shieldTargets(s, hero, cmd.payload?.targetIds, { range: 2, withSight: true, max: 2 });
    if (!check.ok) return check;
    for (const t of check.targets) grantShield(s, t, G, hero.id);
    return ok({ factors: [{ key: "shield", stat: "Geometry", value: G, targetIds: check.targets.map((t) => t.id) }] });
  },
  "linked-lock": (s, cmd, hero) => {
    const ids = cmd.payload?.targetIds;
    if (!distinctStrings(ids) || ids.length < 1 || ids.length > 2) return fail("invalid-targets");
    const L = profileOf(s, hero).stats[2];
    const groups = [];
    for (const id of ids) {
      const t = resolveTarget(s, id);
      if (!t || t.kind !== "group") return fail("invalid-target", { targetId: id });
      const bad = inReach(s, hero, t, 2, { sight: true });
      if (bad) return bad;
      groups.push(t);
    }
    for (const g of groups) addGrant(s, { kind: "lock", targetId: g.id, amount: L, heroId: hero.id });
    return ok({ factors: [{ key: "lock", stat: "Logic", value: L, groupIds: ids }] });
  },
  "root-shelter": (s, cmd, hero) => {
    const ids = cmd.payload?.targetIds;
    if (!distinctStrings(ids) || ids.length < 1 || ids.length > 2) return fail("invalid-targets");
    const S = profileOf(s, hero).stats[3];
    const targets = [];
    for (const id of ids) {
      const t = resolveTarget(s, id);
      if (!t || !["station", "group", "site"].includes(t.kind)) return fail("invalid-target", { targetId: id });
      const bad = inReach(s, hero, t, 2, { sight: true });
      if (bad) return bad;
      targets.push(t);
    }
    for (const t of targets) addGrant(s, { kind: "stabilise", targetId: canonicalStationId(t.id), amount: S, heroId: hero.id });
    return ok({ factors: [{ key: "stabilise", stat: "Science", value: S, targetIds: ids }] });
  },
  "stand-together": (s, cmd, hero) => {
    const t = resolveAlly(s, cmd.payload?.targetId, { hero, allowSelf: false });
    if (!t) return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, t, 1);
    if (bad) return bad;
    const G = profileOf(s, hero).stats[1];
    grantShield(s, hero, G, hero.id);
    grantShield(s, t, G, hero.id);
    return ok({ factors: [{ key: "shield", stat: "Geometry", value: G, targetIds: [hero.id, t.id] }] });
  },
  "mend-and-mend-again": (s, cmd, hero) => {
    const t = resolveAlly(s, cmd.payload?.targetId, { hero, orchard: true });
    if (!t) return fail("invalid-target", { targetId: cmd.payload?.targetId });
    const bad = inReach(s, hero, t, 2, { sight: true });
    if (bad) return bad;
    const S = profileOf(s, hero).stats[3];
    const missing = missingIntegrity(s, t);
    const shield = Math.ceil(S / 2);
    if (missing <= 0 && (t.kind === "orchard" || shield <= 0)) return fail("nothing-to-repair", { targetId: t.id });
    const healed = missing > 0 ? applyRestore(s, t, Math.min(S, missing), hero.id) : 0;
    if (t.kind !== "orchard" && shield > 0) grantShield(s, t, shield, hero.id);
    return ok({ factors: [{ key: "restore", stat: "Science", value: healed }, { key: "shield", value: t.kind === "orchard" ? 0 : shield }] });
  },
  operate: (s, cmd, hero) => operateHandler(s, cmd, hero, false),
  crosswire: (s, cmd, hero) => operateHandler(s, cmd, hero, true),
  "second-wind": (s, cmd, hero) => {
    const key = cmd.payload?.readyCardId;
    if (!key || key === "second-wind" || !(key in hero.handReady) || hero.handReady[key]) return fail("card-not-exhausted", { cardId: key ?? null });
    const step = cmd.payload?.stepDestination ?? null;
    if (step) {
      if (hexDistance(hero.position, step) !== 1) return fail("step-not-adjacent", { destination: step });
      if (!legalStepFor(s, step, false)) return fail("step-blocked", { destination: step, by: figureAt(s, step) });
    }
    hero.handReady[key] = true;
    emit(s, "card-readied", { heroId: hero.id, cardId: key, by: "second-wind" });
    if (step) relocateHero(s, hero, step, [step], "second-wind");
    return ok({ factors: [{ key: "ready", cardId: key }] });
  },
  refocus: (s, cmd, hero) => {
    if (hero.refocusUsed) return fail("refocus-used");
    if (hero.ap < AP_PER_ROUND) return fail("refocus-needs-full-ap", { ap: hero.ap });
    const key = cmd.payload?.readyCardId;
    if (!key || key === "second-wind" || !(key in hero.handReady) || hero.handReady[key]) return fail("card-not-exhausted", { cardId: key ?? null });
    hero.handReady[key] = true;
    hero.refocusUsed = true;
    emit(s, "card-readied", { heroId: hero.id, cardId: key, by: "refocus" });
    return ok({ factors: [{ key: "ready", cardId: key }] });
  },
  wait: () => ok(),
};

function missingIntegrity(s, t) {
  if (t.kind === "hero") { const hero = getHero(s, t.id); return profileOf(s, hero).maxHealth - hero.hp; }
  if (t.kind === "orchard") return s.blueprint.orchardMaxIntegrity - s.orchardIntegrity;
  if (t.kind === "station") return stationMaxIntegrity(s, t.id) - stationState(s, t.id).integrity;
  return 0;
}

function applyRestore(s, t, amount, byId) {
  if (t.kind === "hero") {
    const hero = getHero(s, t.id);
    const before = hero.hp;
    hero.hp = Math.min(profileOf(s, hero).maxHealth, hero.hp + amount);
    emit(s, "hero-restored", { heroId: hero.id, by: byId, amount: hero.hp - before, hpBefore: before, hpAfter: hero.hp });
    return hero.hp - before;
  }
  if (t.kind === "orchard") {
    const before = s.orchardIntegrity;
    s.orchardIntegrity = Math.min(s.blueprint.orchardMaxIntegrity, before + amount);
    emit(s, "orchard-restored", { by: byId, amount: s.orchardIntegrity - before, integrityBefore: before, integrityAfter: s.orchardIntegrity, cause: "repair" });
    return s.orchardIntegrity - before;
  }
  const store = stationState(s, t.id);
  const before = store.integrity;
  store.integrity = Math.min(stationMaxIntegrity(s, t.id), before + amount);
  emit(s, "station-repaired", { stationId: canonicalStationId(t.id), by: byId, amount: store.integrity - before, integrityBefore: before, integrityAfter: store.integrity });
  return store.integrity - before;
}

function repairHandler(s, hero, targetId, range, withSight) {
  const t = resolveAlly(s, targetId, { hero, orchard: true });
  if (!t) return fail("invalid-target", { targetId });
  const bad = inReach(s, hero, t, range, { sight: withSight });
  if (bad) return bad;
  const S = profileOf(s, hero).stats[3];
  const missing = missingIntegrity(s, t);
  if (missing <= 0) return fail("nothing-to-repair", { targetId: t.id });
  const healed = applyRestore(s, t, Math.min(S, missing), hero.id);
  return ok({ factors: [{ key: "restore", stat: "Science", value: S, applied: healed, missing }] });
}

function chargeStation(s, store, amountStat, heroId) {
  const state = stationState(s, store);
  const capacity = stationCapacity(s, store);
  const missing = capacity - state.charge;
  if (missing <= 0) return fail("already-charged", { stationId: store });
  const moved = Math.min(amountStat, missing);
  if (moved <= 0) return fail("no-strength", { stat: "Arithmetic" });
  state.charge += moved;
  emit(s, "station-charged", { heroId, stationId: store, amount: moved, charge: state.charge, capacity });
  return ok({ factors: [{ key: "charge", stat: "Arithmetic", value: amountStat, applied: moved, charge: [state.charge - moved, state.charge], capacity }] });
}

function shortfalls(profile, need) {
  return need.map((n, i) => ({ stat: i, name: STAT_NAMES[i], need: n, have: profile.stats[i] })).filter((x) => x.have < x.need);
}

function holdHandler(s, cmd, hero) {
  const id = cmd.payload?.targetId;
  const st = getIndex(s.blueprint).stations.get(id);
  if (!st || !["number", "shape", "sustain", "alcove"].includes(st.id)) return fail("invalid-target", { targetId: id });
  const bad = inReach(s, hero, st, 1);
  if (bad) return bad;
  const viaAlcove = st.id === "alcove";
  if (viaAlcove && !s.preparedAlcove) return fail("alcove-unprepared");
  const job = viaAlcove ? "shape" : st.id;
  const profile = profileOf(s, hero);
  const need = commissionProfile(s.blueprint.tier, job, viaAlcove);
  const short = shortfalls(profile, need);
  if (short.length) return fail("hold-profile-short", { job, need, shortfalls: short });
  const existing = s.holds[st.id];
  if (existing) return fail(existing.heroId === hero.id ? "already-held" : "station-held", { stationId: st.id, holderId: existing.heroId });
  if (job === "shape") {
    const otherId = viaAlcove ? "shape" : "alcove";
    const other = s.holds[otherId];
    if (other && other.heroId !== hero.id) return fail("shape-endpoint-held", { stationId: otherId, holderId: other.heroId });
  }
  const cancelled = hero.holding ? cancelHold(s, hero, "switched") : null;
  const holdId = `${hero.id}@r${s.round}#${s.eventSeq + 1}`;
  s.holds[st.id] = { holdId, heroId: hero.id };
  hero.holding = st.id;
  const granted = [];
  const [A, G, L, S] = profile.stats;
  if (job === "number" && L > 0) granted.push({ kind: "lock", targetId: s.blueprint.puzzle.networkGroupId || "network", amount: L });
  if (job === "shape" && G > 0) granted.push({ kind: "shield", targetId: "shape", amount: G });
  if (job === "sustain" && S > 0) granted.push({ kind: "stabilise", targetId: "*hazard", amount: S });
  for (const g of granted) addGrant(s, { ...g, source: "hold", sourceHoldId: holdId, heroId: hero.id });
  emit(s, "hold-started", { heroId: hero.id, stationId: st.id, job, holdId, granted });
  return ok({ factors: [{ key: "hold", job, need, have: profile.stats }, ...granted.map((g) => ({ key: "hold-grant", ...g })) ], cancelledHold: cancelled?.stationId ?? null });
}

function operateHandler(s, cmd, hero, viaCard) {
  const payload = cmd.payload || {};
  const puzzle = s.blueprint.puzzle;
  const control = getIndex(s.blueprint).stations.get("control");
  const range = viaCard ? 2 : 1;
  const bad = inReach(s, hero, control, range, { sight: viaCard });
  if (bad) return bad;
  if (payload.draftRevision !== s.puzzleDraft.revision) return fail("stale-draft", { expected: payload.draftRevision ?? null, current: s.puzzleDraft.revision });
  const outputIds = asArray(payload.outputIds);
  if (!outputIds || !sameSet(outputIds, s.puzzleDraft.selectedOutputIds || [])) return fail("output-selection-mismatch", { draft: s.puzzleDraft.selectedOutputIds || [] });
  let lockGroup = null;
  if (viaCard) {
    lockGroup = getIndex(s.blueprint).groups.get(payload.lockGroupId);
    if (!lockGroup) return fail("lock-group-required", { lockGroupId: payload.lockGroupId ?? null });
  }
  const hooks = getPuzzleHooks(puzzle.kind);
  const committed = hooks.commit(puzzle, s.puzzleDraft.content, outputIds);
  if (!committed.ok) return fail(committed.reasonCode || "commit-rejected", committed.reasonParams || {});
  const next = { content: committed.content, selectedOutputIds: [...outputIds] };
  const after = computeOutputsFor(s.blueprint, next);
  const blockers = closureBlockers(s, after.outputs);
  if (blockers.length) return fail("bridge-occupied", { blockers });
  for (const output of s.blueprint.outputs || []) {
    if (output.effect?.kind === "storm" && after.outputs[output.id] && s.orchardIntegrity - STORM_ORCHARD_COST <= 0) return fail("storm-would-destroy-orchard", { orchardIntegrity: s.orchardIntegrity, cost: STORM_ORCHARD_COST });
  }
  const before = { ...s.activeOutputs };
  s.puzzleActive = next;
  s.puzzleDraft.committedRevision = s.puzzleDraft.revision;
  recomputeOutputs(s);
  emit(s, "puzzle-committed", { heroId: hero.id, outputIds, outputsBefore: before, outputsAfter: { ...s.activeOutputs }, valid: s.puzzleValid });
  const factors = [{ key: "commit", outputIds, valid: s.puzzleValid }];
  if (viaCard) {
    const L = profileOf(s, hero).stats[2];
    if (L > 0) addGrant(s, { kind: "lock", targetId: lockGroup.id, amount: L, heroId: hero.id });
    factors.push({ key: "lock", stat: "Logic", value: L, groupId: lockGroup.id });
  }
  return ok({ factors });
}

// ---------- zero-AP puzzle commands ----------

function editDraftHandler(s, cmd) {
  const payload = cmd.payload || {};
  const puzzle = s.blueprint.puzzle;
  if (payload.puzzleId !== (puzzle.id ?? puzzle.kind)) return fail("unknown-puzzle", { puzzleId: payload.puzzleId ?? null });
  const edit = payload.edit;
  if (!edit || !DRAFT_EDITS.includes(edit.type)) return fail("unknown-edit", { type: edit?.type ?? null });
  const hooks = getPuzzleHooks(puzzle.kind);
  if (edit.type === "reset-draft") {
    s.puzzleDraft.content = hooks.createDraft(puzzle, s.puzzleActive.content);
    s.puzzleDraft.selectedOutputIds = [...(s.puzzleActive.selectedOutputIds || [])];
  } else if (edit.type === "select-outputs") {
    const ids = asArray(edit.outputIds);
    const known = new Set((s.blueprint.outputs || []).map((o) => o.id));
    if (!distinctStrings(ids) || !ids.every((id) => known.has(id))) return fail("unknown-output");
    const check = hooks.checkOutputSelection(puzzle, ids);
    if (!check.ok) return fail(check.reasonCode || "selection-rejected", check.reasonParams || {});
    const ordered = (s.blueprint.outputs || []).map((o) => o.id).filter((id) => ids.includes(id));
    const mirrored = hooks.applyEdit(puzzle, s.puzzleDraft.content, { type: "select-outputs", outputIds: ordered }, { comparisonLog: s.comparisonLog });
    if (!mirrored.ok) return fail(mirrored.reasonCode || "selection-rejected", mirrored.reasonParams || {});
    s.puzzleDraft.content = mirrored.content;
    s.puzzleDraft.selectedOutputIds = ordered;
  } else {
    const result = hooks.applyEdit(puzzle, s.puzzleDraft.content, edit, { comparisonLog: s.comparisonLog });
    if (!result.ok) return fail(result.reasonCode || "edit-rejected", result.reasonParams || {});
    s.puzzleDraft.content = result.content;
  }
  s.puzzleDraft.revision += 1;
  if (edit.type === "reset-draft") s.puzzleDraft.committedRevision = s.puzzleDraft.revision;
  emit(s, "draft-edited", { editType: edit.type, draftRevision: s.puzzleDraft.revision });
  return ok({ factors: [{ key: "draft", revision: s.puzzleDraft.revision }] });
}

function compareLoadsHandler(s, cmd) {
  const payload = cmd.payload || {};
  const puzzle = s.blueprint.puzzle;
  const hooks = getPuzzleHooks(puzzle.kind);
  if (!hooks.compare) return fail("no-comparison");
  const left = asArray(payload.leftLoadIds), right = asArray(payload.rightLoadIds);
  if (!left || !right || !left.length || !right.length || !distinctStrings(left) || !distinctStrings(right)) return fail("invalid-comparison");
  if (left.some((id) => right.includes(id))) return fail("load-on-both-sides");
  if (Array.isArray(puzzle.loads)) {
    const known = new Set(puzzle.loads.map((l) => l.id));
    const unknown = [...left, ...right].filter((id) => !known.has(id));
    if (unknown.length) return fail("unknown-load", { loadIds: unknown });
  }
  const L = [...left].sort(), R = [...right].sort();
  const key = `${L.join("+")}|${R.join("+")}`;
  const inverse = `${R.join("+")}|${L.join("+")}`;
  const flip = { "left-lighter": "left-heavier", "left-heavier": "left-lighter", equal: "equal" };
  const known = s.comparisonLog.find((c) => c.key === key);
  if (known) return ok({ comparison: { result: known.result, free: true, key }, factors: [{ key: "comparison", result: known.result, free: true }] });
  const knownInverse = s.comparisonLog.find((c) => c.key === inverse);
  if (knownInverse) {
    const result = flip[knownInverse.result];
    return ok({ comparison: { result, free: true, key }, factors: [{ key: "comparison", result, free: true }] });
  }
  const allowance = puzzle.comparisonAllowance ?? 0;
  if (s.comparisonsUsed >= allowance) return fail("no-comparisons-left", { allowance });
  const raw = hooks.compare(puzzle, s.puzzleDraft.content, L, R);
  const result = typeof raw === "string" ? raw : raw.result;
  s.comparisonLog.push({ key, left: L, right: R, result });
  s.comparisonsUsed += 1;
  emit(s, "weighed", { left: L, right: R, result, used: s.comparisonsUsed, allowance });
  const warnings = raw && raw.uninformative ? [{ code: "uninformative-comparison" }] : [];
  return ok({ comparison: { result, free: false, key }, warnings, factors: [{ key: "comparison", result, used: s.comparisonsUsed, allowance }] });
}

function requestHintHandler(s, cmd) {
  const payload = cmd.payload || {};
  const puzzle = s.blueprint.puzzle;
  if (payload.puzzleId !== (puzzle.id ?? puzzle.kind)) return fail("unknown-puzzle");
  const stage = payload.stage;
  if (!Number.isInteger(stage) || stage < 1 || stage > 3) return fail("invalid-hint-stage", { stage: stage ?? null });
  const hooks = getPuzzleHooks(puzzle.kind);
  s.hintStage = Math.max(s.hintStage, stage);
  const hint = hooks.hint ? hooks.hint(puzzle, s.puzzleDraft.content, stage, { comparisonLog: s.comparisonLog, comparisonsUsed: s.comparisonsUsed }) : null;
  if (stage === 3 && hooks.solutionDraft) {
    const solved = hooks.solutionDraft(puzzle);
    const content = solved && solved.content !== undefined ? solved.content : solved;
    s.puzzleDraft.content = content;
    if (solved && solved.selectedOutputIds) s.puzzleDraft.selectedOutputIds = solved.selectedOutputIds;
    s.puzzleDraft.revision += 1;
  }
  emit(s, "hint-requested", { stage });
  return ok({ hint, factors: [{ key: "hint", stage }] });
}

function undoHandler(s) {
  if (!s.undo.length) return fail("nothing-to-undo");
  const snap = s.undo[s.undo.length - 1];
  restoreSnapshot(s, snap);
  s.undo = s.undo.slice(0, -1);
  emit(s, "undone", {});
  return ok();
}

function endRoundHandler(s, cmd, state) {
  if (cmd.payload?.forecastRevision !== state.revision) return fail("stale-forecast", { expected: cmd.payload?.forecastRevision ?? null, current: state.revision });
  const record = runEnemyPhase(s);
  s.undo = [];
  return ok({ phase: record });
}

// ---------- evaluation core ----------

function protectionSummary(s) {
  const out = { shield: {}, lock: {}, stabilise: {} };
  for (const g of s.phaseEffects.grants) out[g.kind][g.targetId] = Math.max(out[g.kind][g.targetId] || 0, g.amount);
  return out;
}

function diffEntities(a, b) {
  const changes = [];
  const push = (id, kind, field, before, after) => {
    if (JSON.stringify(before) !== JSON.stringify(after)) changes.push({ id, kind, field, before, after });
  };
  for (const h of b.heroes) {
    const o = a.heroes.find((x) => x.id === h.id);
    for (const field of ["hp", "position", "ap", "holding", "defeated"]) push(h.id, "hero", field, o[field], h[field]);
    for (const [card, ready] of Object.entries(h.handReady)) push(h.id, "hero", `hand.${card}`, o.handReady[card], ready);
  }
  for (const e of b.enemyStates) {
    const o = a.enemyStates.find((x) => x.id === e.id);
    for (const field of ["hp", "position", "defeated"]) push(e.id, "enemy", field, o[field], e[field]);
  }
  for (const id of Object.keys(b.stationStates)) for (const field of ["charge", "integrity"]) push(id, "station", field, a.stationStates[id][field], b.stationStates[id][field]);
  push("orchard", "orchard", "integrity", a.orchardIntegrity, b.orchardIntegrity);
  push("outputs", "outputs", "active", a.activeOutputs, b.activeOutputs);
  push("passages", "passages", "state", a.passages, b.passages);
  push("marks", "marks", "marks", a.marks, b.marks);
  push("holds", "holds", "holds", a.holds, b.holds);
  push("alcove", "alcove", "prepared", a.preparedAlcove, b.preparedAlcove);
  push("protection", "protection", "summary", protectionSummary(a), protectionSummary(b));
  push("puzzle-draft", "puzzle", "draftRevision", a.puzzleDraft.revision, b.puzzleDraft.revision);
  push("round", "round", "round", a.round, b.round);
  return changes;
}

function apCostOf(type) {
  if (ZERO_AP.has(type)) return 0;
  return type === "refocus" ? AP_PER_ROUND : 1;
}

function evaluateCommand(state, command, { forecast = false } = {}) {
  const base = { legal: false, reasonCode: null, reasonParams: null, type: command?.type ?? null, heroId: command?.heroId ?? null };
  const reject = (reasonCode, reasonParams = {}) => ({ ...base, reasonCode, reasonParams, cost: { ap: 0, card: null }, changedEntities: [], factors: [], warnings: [], outputsBefore: state.activeOutputs, outputsAfter: state.activeOutputs, forecastAfter: null, events: [] });
  if (!command || typeof command !== "object") return { result: reject("invalid-command"), next: null };
  if (state.status !== "playing") return { result: reject("run-over", { status: state.status }), next: null };
  if (command.expectedRevision !== undefined && command.expectedRevision !== state.revision) return { result: reject("stale-revision", { expected: command.expectedRevision, current: state.revision }), next: null };
  if (!COMMAND_TYPES.includes(command.type)) return { result: reject("unknown-command", { type: command.type }), next: null };
  const s = cloneState(state);
  const eventStart = s.events.length;
  const type = command.type;
  const zero = ZERO_AP.has(type);
  let hero = null;
  let cardKey = null;
  if (!zero) {
    hero = getHero(s, command.heroId);
    if (!hero) return { result: reject("unknown-hero", { heroId: command.heroId ?? null }), next: null };
    if (hero.defeated) return { result: reject("hero-defeated", { heroId: hero.id }), next: null };
    const apCost = apCostOf(type);
    if (hero.ap < apCost) return { result: reject("not-enough-ap", { ap: hero.ap, need: apCost }), next: null };
    if (HAND_COMMANDS.includes(type)) {
      cardKey = type;
      if (!(cardKey in hero.handReady)) return { result: reject("card-not-in-hand", { cardId: cardKey }), next: null };
      if (!hero.handReady[cardKey]) return { result: reject("card-exhausted", { cardId: cardKey }), next: null };
    }
  }
  let outcome;
  const handlerFor = {
    "edit-draft": editDraftHandler, "compare-loads": compareLoadsHandler, "request-hint": requestHintHandler, undo: undoHandler,
    "end-round": (st, c) => endRoundHandler(st, c, state),
  }[type];
  try {
    outcome = handlerFor ? handlerFor(s, command) : HANDLERS[type](s, command, hero);
  } catch (error) {
    return { result: reject("internal-error", { type, message: String(error?.message || error) }), next: null };
  }
  if (!outcome.ok) return { result: reject(outcome.reasonCode, outcome.reasonParams), next: null };
  if (hero && type !== "undo") {
    hero.ap -= apCostOf(type);
    if (cardKey) {
      hero.handReady[cardKey] = false;
      emit(s, "card-spent", { heroId: hero.id, cardId: cardKey });
    }
  }
  const result = {
    ...base,
    legal: true,
    cost: { ap: hero ? apCostOf(type) : 0, card: cardKey },
    changedEntities: diffEntities(state, s),
    factors: outcome.factors || [],
    warnings: outcome.warnings || [],
    outputsBefore: state.activeOutputs,
    outputsAfter: s.activeOutputs,
    forecastAfter: null,
    events: s.events.slice(eventStart),
    status: s.status,
    ...(outcome.comparison ? { comparison: outcome.comparison } : {}),
    ...(outcome.hint !== undefined ? { hint: outcome.hint } : {}),
    ...(outcome.path ? { path: outcome.path } : {}),
    ...(outcome.phase ? { phase: outcome.phase } : {}),
    ...(outcome.survived !== undefined ? { survived: outcome.survived } : {}),
  };
  if (forecast && s.status === "playing" && type !== "end-round") result.forecastAfter = forecastEnemyPhase(s);
  return { result, next: s };
}

export function previewCommand(state, command) {
  return evaluateCommand(state, command, { forecast: true }).result;
}

export function reduceCommand(state, command) {
  const { result, next } = evaluateCommand(state, command, { forecast: false });
  if (!result.legal) return { state, result };
  const type = command.type;
  next.revision = state.revision + 1;
  next.actionCount = state.actionCount + 1;
  next.log = [...state.log, { type, heroId: command.heroId ?? null, expectedRevision: state.revision, payload: command.payload ?? {} }];
  if (type === "undo") next.undo = state.undo.slice(0, -1);
  else if (type === "end-round") next.undo = [];
  else if (!NO_UNDO_ENTRY.has(type) && !(type === "request-hint" && command.payload?.stage !== 3)) next.undo = [...state.undo, snapshotOf(state)];
  else next.undo = state.undo;
  return { state: next, result };
}

// ---------- command listing for the UI ----------

function payloadsFor(s, hero, type) {
  const enemies = s.enemyStates.filter((e) => !e.defeated).map((e) => e.id);
  const friendly = [...s.heroes.filter((h) => !h.defeated).map((h) => h.id), "number", "shape", "sustain", "alcove", "control"];
  const groups = [...(getIndex(s.blueprint).groups.keys())];
  const sites = [...(getIndex(s.blueprint).sites.keys())];
  const jobStations = ["number", "shape", "sustain", "alcove"];
  const only = (ids, extra = {}) => ids.map((targetId) => ({ targetId, ...extra }));
  switch (type) {
    case "strike": case "exact-blow": case "marked-shot": return only(enemies);
    case "driving-blow": return only(enemies, { pushDestination: null });
    case "guard": return only([...friendly]);
    case "repair": return only([...friendly, "orchard"]);
    case "mend-and-mend-again": return only([...friendly, "orchard"]);
    case "stand-together": return only(friendly);
    case "lock": return only(groups);
    case "stabilise": return only([...jobStations, "control", ...groups, ...sites]);
    case "calibrate": case "hold": return only(jobStations);
    case "prepare-alcove": return [{ targetId: "alcove" }];
    case "counterturn": return only(enemies);
    case "wide-brace": return friendly.map((id) => ({ targetIds: [id] }));
    case "linked-lock": return groups.map((id) => ({ targetIds: [id] }));
    case "root-shelter": return [...jobStations, "control", ...groups, ...sites].map((id) => ({ targetIds: [id] }));
    case "shared-charge": return jobStations.map((id) => ({ allocations: [{ targetId: id, amount: Math.min(profileOf(s, hero).stats[0], Math.max(0, stationCapacity(s, id) - stationState(s, id).charge)) }] }));
    case "field-repair": return [...friendly, "orchard"].map((id) => { const t = resolveTarget(s, id); return { allocations: [{ targetId: id, amount: Math.min(2 * profileOf(s, hero).stats[3], t ? missingIntegrity(s, t) : 0) }] }; });
    case "operate": return [{ draftRevision: s.puzzleDraft.revision, outputIds: s.puzzleDraft.selectedOutputIds || [], lockGroupId: null }];
    case "crosswire": return groups.map((g) => ({ draftRevision: s.puzzleDraft.revision, outputIds: s.puzzleDraft.selectedOutputIds || [], lockGroupId: g }));
    case "second-wind": case "refocus": return Object.keys(hero.handReady).filter((k) => k !== "second-wind" && !hero.handReady[k]).map((k) => ({ readyCardId: k }));
    case "wait": return [{}];
    case "true-shift": {
      const out = [];
      for (const id of [...enemies, ...s.heroes.filter((h) => !h.defeated && h.id !== hero.id).map((h) => h.id)]) {
        const t = resolveTarget(s, id);
        for (const n of neighbourKeys(t.hex)) out.push({ targetId: id, destination: n });
      }
      return out;
    }
    default: return [];
  }
}

export function listCommands(state, heroId) {
  const hero = getHero(state, heroId);
  if (!hero) return [];
  const profile = profileOf(state, hero);
  const rows = [];
  const probe = (type, payload) => evaluateCommand(state, { type, heroId, expectedRevision: state.revision, payload }, { forecast: false }).result;
  const base = ["move", "strike", "guard", "repair", "lock", "stabilise", "calibrate", "hold", "prepare-alcove", "operate", "wait", "refocus"];
  const cards = profile.hand.map((c) => c.key);
  for (const type of [...base, ...cards]) {
    const isMove = MOVE_COMMANDS.has(type);
    const budget = type === "move" ? profile.moveBudget : type === "dash" ? profile.dashBudget : type === "intercept" ? profile.interceptBudget : 0;
    let targets = [];
    let available = false;
    let reasonCode = null, reasonParams = null;
    if (isMove) {
      const reach = reachableHexes(state, heroId, budget);
      available = reach.length > 0 && hero.ap >= 1 && (type === "move" || hero.handReady[type]);
      targets = reach.map((r) => ({ destination: r.key, cost: r.cost }));
      if (!available) reasonCode = hero.ap < 1 ? "not-enough-ap" : type !== "move" && !hero.handReady[type] ? "card-exhausted" : "nowhere-to-go";
    } else {
      const payloads = payloadsFor(state, hero, type);
      let firstFail = null;
      for (const payload of payloads) {
        const res = probe(type, payload);
        const target = payload.targetId ?? payload.targetIds?.join("+") ?? payload.allocations?.[0]?.targetId ?? payload.readyCardId ?? payload.lockGroupId ?? null;
        targets.push({ targetId: target, payload, legal: res.legal, reasonCode: res.reasonCode, reasonParams: res.reasonParams });
        if (res.legal) available = true;
        else firstFail = firstFail || res;
      }
      if (!available) {
        const res = payloads.length ? firstFail : probe(type, {});
        reasonCode = res?.reasonCode ?? "no-target";
        reasonParams = res?.reasonParams ?? null;
      }
    }
    rows.push({ type, label: type, cardKey: HAND_COMMANDS.includes(type) ? type : null, apCost: apCostOf(type), available, reasonCode, reasonParams, targets });
  }
  return rows;
}

export function commandReasonCodes() {
  return [
    "run-over", "stale-revision", "unknown-command", "unknown-hero", "hero-defeated", "not-enough-ap", "card-not-in-hand", "card-exhausted", "invalid-target", "out-of-range",
    "no-line-of-sight", "destination-is-current", "destination-unreachable", "path-destination-mismatch", "path-not-contiguous", "path-blocked-by-figure", "path-impassable",
    "path-too-costly", "path-not-shortest", "hold-profile-short", "station-held", "already-held", "shape-endpoint-held", "alcove-unprepared", "alcove-already-prepared",
    "stale-draft", "output-selection-mismatch", "bridge-occupied", "storm-would-destroy-orchard", "push-needs-damage", "push-blocked", "refocus-used", "refocus-needs-full-ap",
    "nothing-to-undo", "stale-forecast", "no-comparisons-left", "already-charged", "nothing-to-repair",
  ];
}

export { occupiedKeys, enemyDef };
