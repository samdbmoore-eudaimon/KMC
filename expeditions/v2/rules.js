import { ENEMY_RULES, MAX_ADJACENT_SUPPORT, SCOUT_MARK, STRIKE_WINDOW_ARMOUR, TERRAIN_COST } from "./constants.js";
import { hexDistance, hexKey, hexLine, neighbourKeys, parseHex, compareHex } from "./hex.js";
import { getPuzzleHooks } from "./puzzle-hooks.js";

const INDEX_CACHE = new WeakMap();

// Blueprints are immutable, so every derived lookup is built once and cached against the object.
export function getIndex(blueprint) {
  let index = INDEX_CACHE.get(blueprint);
  if (index) return index;
  const tiles = new Map();
  for (const tile of blueprint.tiles) tiles.set(hexKey(tile.q, tile.r), tile);
  const stations = new Map();
  for (const st of blueprint.stations) stations.set(st.id, st);
  const groups = new Map();
  for (const group of blueprint.puzzle.lockGroups || []) groups.set(group.id, group);
  const sites = new Map();
  for (const site of blueprint.sites || []) sites.set(site.id, site);
  const outputs = new Map();
  for (const output of blueprint.outputs || []) outputs.set(output.id, output);
  const enemies = new Map();
  for (const enemy of blueprint.enemies || []) enemies.set(enemy.id, enemy);
  index = { tiles, stations, groups, sites, outputs, enemies };
  INDEX_CACHE.set(blueprint, index);
  return index;
}

const SNAPSHOT_KEYS = ["round", "status", "lossReason", "heroes", "enemyStates", "stationStates", "orchardIntegrity", "puzzleActive", "puzzleDraft", "activeOutputs", "puzzleValid", "passages", "marks", "phaseEffects", "holds", "preparedAlcove"];

export function cloneState(s) {
  const { blueprint, profiles, initialRun, undo, events, log, ...rest } = s;
  const copy = JSON.parse(JSON.stringify(rest));
  copy.blueprint = blueprint;
  copy.profiles = profiles;
  copy.initialRun = initialRun;
  copy.undo = undo;
  copy.events = events.slice();
  copy.log = log.slice();
  return copy;
}

export function snapshotOf(s) {
  const out = {};
  for (const key of SNAPSHOT_KEYS) if (s[key] !== undefined) out[key] = JSON.parse(JSON.stringify(s[key]));
  return out;
}
export function restoreSnapshot(s, snap) {
  const copy = JSON.parse(JSON.stringify(snap));
  for (const key of SNAPSHOT_KEYS) {
    if (copy[key] !== undefined) s[key] = copy[key];
    else delete s[key];
  }
}

export function emit(s, type, data = {}) {
  s.eventSeq += 1;
  const event = { seq: s.eventSeq, type, round: s.round, ...data };
  s.events.push(event);
  return event;
}

export const getHero = (s, id) => s.heroes.find((h) => h.id === id) || null;
export const getEnemy = (s, id) => s.enemyStates.find((e) => e.id === id) || null;
export const profileOf = (s, hero) => s.profiles[hero.cardId];
export const aliveHeroes = (s) => s.heroes.filter((h) => !h.defeated);
export const aliveEnemies = (s) => s.enemyStates.filter((e) => !e.defeated);
export const enemyDef = (s, enemy) => getIndex(s.blueprint).enemies.get(enemy.id);
export const enemyRule = (s, enemy) => ENEMY_RULES[enemyDef(s, enemy).ruleId];

export function figureAt(s, key) {
  const hero = s.heroes.find((h) => !h.defeated && h.position === key);
  if (hero) return { kind: "hero", id: hero.id };
  const enemy = s.enemyStates.find((e) => !e.defeated && e.position === key);
  if (enemy) return { kind: "enemy", id: enemy.id };
  return null;
}

export function station(s, id) {
  return getIndex(s.blueprint).stations.get(id) || null;
}
// The alcove is a second place to hold the one Shape job: it shares the Shape store entirely.
export const canonicalStationId = (id) => (id === "alcove" ? "shape" : id);
export const stationState = (s, id) => s.stationStates[canonicalStationId(id)];
export function stationCapacity(s, id) {
  return station(s, canonicalStationId(id))?.capacity ?? 0;
}
export function stationMaxIntegrity(s, id) {
  return station(s, canonicalStationId(id))?.maxIntegrity ?? 0;
}

// Resolves any targetable ID to its kind and anchor hex.
export function resolveTarget(s, id) {
  const index = getIndex(s.blueprint);
  const hero = getHero(s, id);
  if (hero) return { kind: "hero", id, hex: hero.position, alive: !hero.defeated };
  const enemy = getEnemy(s, id);
  if (enemy) return { kind: "enemy", id, hex: enemy.position, alive: !enemy.defeated };
  if (id === "orchard") return { kind: "orchard", id, hex: s.blueprint.orchard.hex, alive: s.orchardIntegrity > 0 };
  const st = index.stations.get(id);
  if (st) return { kind: "station", id, store: canonicalStationId(id), hex: st.hex, alive: true };
  const group = index.groups.get(id);
  if (group) return { kind: "group", id, hex: group.anchor, alive: true, group };
  const site = index.sites.get(id);
  if (site) return { kind: "site", id, hex: site.anchor, alive: true, site };
  return null;
}

// ---------- terrain, passages and pathing ----------

export function passageIsOpen(s, tileKey) {
  const passage = s.passages[tileKey];
  return !!passage && passage.open && !passage.closingPending;
}

// Cost to enter a tile, or Infinity. `flies` is the Hunter rule: water/closed bridge/roots cost 1.
export function enterCost(s, key, flies = false) {
  const tile = getIndex(s.blueprint).tiles.get(key);
  if (!tile || tile.solid) return Infinity;
  switch (tile.terrain) {
    case "hedge": return Infinity;
    case "gate": return tile.passageOutputId && passageIsOpen(s, key) ? 1 : Infinity;
    case "bridge": return tile.passageOutputId ? (passageIsOpen(s, key) ? 1 : flies ? 1 : Infinity) : 1;
    case "water": return flies ? 1 : Infinity;
    case "roots": return flies ? 1 : TERRAIN_COST.roots;
    default: return TERRAIN_COST[tile.terrain] ?? Infinity;
  }
}

export function blocksSight(s, key) {
  const tile = getIndex(s.blueprint).tiles.get(key);
  if (!tile) return false;
  if (tile.solid) return true;
  if (tile.terrain === "hedge") return true;
  if (tile.terrain === "gate") return !(tile.passageOutputId && passageIsOpen(s, key));
  return false;
}

export function hasSight(s, fromKey, toKey) {
  const line = hexLine(fromKey, toKey);
  for (let i = 1; i < line.length - 1; i += 1) if (blocksSight(s, line[i])) return false;
  return true;
}

export function occupiedKeys(s, exceptId = null) {
  const out = new Set();
  for (const h of s.heroes) if (!h.defeated && h.id !== exceptId) out.add(h.position);
  for (const e of s.enemyStates) if (!e.defeated && e.id !== exceptId) out.add(e.position);
  return out;
}

// Deterministic Dijkstra: expansion order (cost, r, q); neighbours in direction order; a node's
// parent is its first strictly cheaper discovery.
export function shortestPaths(s, fromKey, { flies = false, moverId = null, maxCost = Infinity } = {}) {
  const blocked = occupiedKeys(s, moverId);
  const cost = new Map([[fromKey, 0]]);
  const parent = new Map();
  const done = new Set();
  const open = [fromKey];
  while (open.length) {
    let best = 0;
    for (let i = 1; i < open.length; i += 1) {
      const a = open[i], b = open[best];
      const d = cost.get(a) - cost.get(b);
      if (d < 0 || (d === 0 && compareHex(a, b) < 0)) best = i;
    }
    const current = open.splice(best, 1)[0];
    if (done.has(current)) continue;
    done.add(current);
    for (const next of neighbourKeys(current)) {
      if (done.has(next) || blocked.has(next)) continue;
      const step = enterCost(s, next, flies);
      if (step === Infinity) continue;
      const total = cost.get(current) + step;
      if (total > maxCost) continue;
      if (!cost.has(next) || total < cost.get(next)) {
        if (!cost.has(next)) open.push(next);
        cost.set(next, total);
        parent.set(next, current);
      }
    }
  }
  return { cost, parent };
}

export function pathTo(parent, fromKey, toKey) {
  const out = [];
  let at = toKey;
  while (at !== fromKey) {
    out.push(at);
    at = parent.get(at);
    if (at === undefined) return null;
  }
  return out.reverse();
}

// Validates a player-chosen path (keys after the start). Never substitutes another path; a
// null path means "use the canonical shortest path", which the caller sees in the result.
export function validatePath(s, hero, destination, path, budget, { allowStay = false } = {}) {
  const from = hero.position;
  if (destination === from) return allowStay ? { ok: true, cost: 0, path: [] } : { ok: false, reasonCode: "destination-is-current" };
  const blocked = occupiedKeys(s, hero.id);
  const reach = shortestPaths(s, from, { moverId: hero.id });
  let steps = path;
  if (steps == null) {
    if (!reach.cost.has(destination)) return { ok: false, reasonCode: "destination-unreachable" };
    steps = pathTo(reach.parent, from, destination);
  }
  if (!Array.isArray(steps) || steps.length === 0 || steps[steps.length - 1] !== destination) return { ok: false, reasonCode: "path-destination-mismatch" };
  let at = from, total = 0;
  for (const step of steps) {
    if (!neighbourKeys(at).includes(step)) return { ok: false, reasonCode: "path-not-contiguous", reasonParams: { step } };
    if (blocked.has(step)) return { ok: false, reasonCode: "path-blocked-by-figure", reasonParams: { step, by: figureAt(s, step) } };
    const c = enterCost(s, step);
    if (c === Infinity) return { ok: false, reasonCode: "path-impassable", reasonParams: { step } };
    total += c;
    at = step;
  }
  if (total > budget) return { ok: false, reasonCode: "path-too-costly", reasonParams: { cost: total, budget } };
  if (!reach.cost.has(destination) || reach.cost.get(destination) !== total) return { ok: false, reasonCode: "path-not-shortest", reasonParams: { cost: total, shortest: reach.cost.get(destination) ?? null } };
  return { ok: true, cost: total, path: steps };
}

export function reachableHexes(s, heroId, budget) {
  const hero = getHero(s, heroId);
  if (!hero || hero.defeated) return [];
  const reach = shortestPaths(s, hero.position, { moverId: hero.id, maxCost: budget });
  return [...reach.cost.entries()].filter(([key]) => key !== hero.position).map(([key, cost]) => ({ key, cost })).sort((a, b) => a.cost - b.cost || compareHex(a.key, b.key));
}

// ---------- protection grants ----------

export function addGrant(s, grant) {
  const entry = { id: `g${s.eventSeq}.${s.phaseEffects.grants.length}`, sourceHoldId: null, source: "cast", ...grant };
  s.phaseEffects.grants.push(entry);
  return entry;
}
export function removeGrantsWhere(s, predicate) {
  const removed = s.phaseEffects.grants.filter(predicate);
  s.phaseEffects.grants = s.phaseEffects.grants.filter((g) => !predicate(g));
  return removed;
}
export function grantStrength(s, kind, targetId) {
  let best = 0;
  for (const g of s.phaseEffects.grants) if (g.kind === kind && g.targetId === targetId && g.amount > best) best = g.amount;
  return best;
}
export function shieldOf(s, targetId) {
  return grantStrength(s, "shield", canonicalStationId(targetId));
}
// Protection of a puzzle member against an enemy/hazard change: lock or stabilise on any group
// containing it. `wide` additionally counts a Sustain Hold's whole-hazard stabilisation.
export function memberProtection(s, groupIds, { wide = false } = {}) {
  let best = 0;
  for (const g of s.phaseEffects.grants) {
    if ((g.kind === "lock" || g.kind === "stabilise") && groupIds.includes(g.targetId) && g.amount > best) best = g.amount;
    if (wide && g.kind === "stabilise" && g.targetId === "*hazard" && g.amount > best) best = g.amount;
  }
  return best;
}
export function siteProtection(s, targetId) {
  const id = canonicalStationId(targetId);
  let best = 0;
  for (const g of s.phaseEffects.grants) {
    if (g.kind === "stabilise" && (g.targetId === id || g.targetId === "*hazard") && g.amount > best) best = g.amount;
  }
  return best;
}

export function cancelHold(s, hero, cause) {
  if (!hero.holding) return null;
  const stationId = hero.holding;
  const hold = s.holds[stationId];
  const removed = hold ? removeGrantsWhere(s, (g) => g.sourceHoldId === hold.holdId) : [];
  delete s.holds[stationId];
  hero.holding = null;
  emit(s, "hold-cancelled", { heroId: hero.id, stationId, cause, lostProtection: removed.map((g) => ({ kind: g.kind, targetId: g.targetId, amount: g.amount })) });
  return { stationId, lostProtection: removed };
}

// ---------- damage ----------

// Shield grants never form a second pool: the effective shield is the maximum grant, and
// absorbed damage is subtracted from every grant on that target.
export function absorbShield(s, targetId, damage) {
  const id = canonicalStationId(targetId);
  const effective = grantStrength(s, "shield", id);
  const absorbed = Math.min(effective, damage);
  if (absorbed > 0) {
    for (const g of s.phaseEffects.grants) if (g.kind === "shield" && g.targetId === id) g.amount = Math.max(0, g.amount - absorbed);
  }
  return { absorbed, remaining: damage - absorbed, shieldBefore: effective };
}

export function setLoss(s, code, params = {}) {
  if (s.status !== "playing") return;
  s.status = "lost";
  s.lossReason = { code, params };
  emit(s, "run-lost", { code, params });
}

export function damageHero(s, hero, power, cause) {
  const profile = profileOf(s, hero);
  const afterArmour = Math.max(0, power - profile.armour);
  const { absorbed, remaining } = absorbShield(s, hero.id, afterArmour);
  const before = hero.hp;
  hero.hp = Math.max(0, hero.hp - remaining);
  emit(s, "hero-damaged", { heroId: hero.id, power, armour: profile.armour, shieldAbsorbed: absorbed, damage: remaining, hpBefore: before, hpAfter: hero.hp, cause });
  if (hero.hp <= 0 && !hero.defeated) {
    hero.defeated = true;
    if (hero.holding) cancelHold(s, hero, "defeated");
    emit(s, "hero-defeated", { heroId: hero.id });
    setLoss(s, "hero-defeated", { heroId: hero.id });
  }
  return { afterArmour, absorbed, damage: remaining };
}

export function damageStation(s, id, power, cause) {
  const key = canonicalStationId(id);
  const state = s.stationStates[key];
  const { absorbed, remaining } = absorbShield(s, key, power);
  const before = state.integrity;
  state.integrity = Math.max(0, state.integrity - remaining);
  emit(s, "station-damaged", { stationId: key, power, shieldAbsorbed: absorbed, damage: remaining, integrityBefore: before, integrityAfter: state.integrity, cause });
  if (state.integrity <= 0) setLoss(s, "station-destroyed", { stationId: key });
  return { absorbed, damage: remaining };
}

export function damageOrchard(s, amount, cause) {
  const before = s.orchardIntegrity;
  s.orchardIntegrity = Math.max(0, before - amount);
  emit(s, "orchard-damaged", { amount, integrityBefore: before, integrityAfter: s.orchardIntegrity, cause });
  if (s.orchardIntegrity <= 0) setLoss(s, "orchard-destroyed", {});
}

export function strikeWindowActive(s) {
  return (s.blueprint.outputs || []).some((o) => o.effect?.kind === "strike-window" && s.activeOutputs[o.id]);
}

export function effectiveEnemyArmour(s, enemy) {
  const base = enemyRule(s, enemy).armour(s.blueprint.tier);
  return strikeWindowActive(s) ? Math.max(0, base - STRIKE_WINDOW_ARMOUR) : base;
}

export function damageEnemy(s, enemy, amount, cause, extra = {}) {
  const before = enemy.hp;
  enemy.hp = Math.max(0, before - amount);
  emit(s, "enemy-damaged", { enemyId: enemy.id, damage: amount, hpBefore: before, hpAfter: enemy.hp, cause, ...extra });
  if (enemy.hp <= 0) {
    enemy.defeated = true;
    delete s.marks[enemy.id];
    s.phaseEffects.counters = s.phaseEffects.counters.filter((c) => c.enemyId !== enemy.id);
    emit(s, "enemy-defeated", { enemyId: enemy.id });
  }
}

export function adjacentSupport(s, hero) {
  const supporters = [];
  for (const other of s.heroes) {
    if (other.id === hero.id || other.defeated || other.holding) continue;
    if (hexDistance(other.position, hero.position) === 1) supporters.push(other.id);
  }
  return { value: Math.min(MAX_ADJACENT_SUPPORT, supporters.length), supporters };
}

export function strikeCalculation(s, hero, enemy, { bonusPower = 0, placeMark = false } = {}) {
  const profile = profileOf(s, hero);
  const support = adjacentSupport(s, hero);
  const existingMark = s.marks[enemy.id] || 0;
  const mark = placeMark ? Math.max(existingMark, SCOUT_MARK) : existingMark;
  const armour = effectiveEnemyArmour(s, enemy);
  const governing = profile.strikeStat;
  const raw = governing + support.value + mark + bonusPower;
  return { governing, governingStat: profile.primaryStat, support: support.value, supporters: support.supporters, mark, bonusPower, armour, raw, damage: Math.max(0, raw - armour) };
}

// ---------- puzzle outputs and passages ----------

// Pure: which outputs a candidate active puzzle would power. Preview and resolution share it.
export function computeOutputsFor(blueprint, active) {
  const puzzle = blueprint.puzzle;
  const evaluation = getPuzzleHooks(puzzle.kind).evaluate(puzzle, active.content);
  const selected = active.selectedOutputIds || [];
  const outputs = {};
  // The balance reserve benefit is derived from the allocation, never selected (generation spec section 6).
  for (const output of blueprint.outputs || []) {
    if (output.effect?.kind === "reserve-benefit") outputs[output.id] = !!evaluation.valid;
    else outputs[output.id] = !!(selected.includes(output.id) && evaluation.outputTruth?.[output.id]);
  }
  return { outputs, valid: !!evaluation.valid, evaluation };
}

export function recomputeOutputs(s) {
  const { outputs, valid, evaluation } = computeOutputsFor(s.blueprint, s.puzzleActive);
  s.activeOutputs = outputs;
  s.puzzleValid = valid;
  syncPassages(s);
  return evaluation;
}

// True when the saved draft differs from the committed puzzle (the End Round Save draft / Discard choice).
export function draftDiffersFromActive(s) {
  if (s.puzzleDraft.revision === s.puzzleDraft.committedRevision) return false;
  const hooks = getPuzzleHooks(s.blueprint.puzzle.kind);
  const baseline = hooks.createDraft(s.blueprint.puzzle, s.puzzleActive.content);
  return JSON.stringify(baseline) !== JSON.stringify(s.puzzleDraft.content) || JSON.stringify(s.puzzleActive.selectedOutputIds || []) !== JSON.stringify(s.puzzleDraft.selectedOutputIds || []);
}

export function passageTiles(blueprint) {
  return blueprint.tiles.filter((t) => t.passageOutputId);
}

export function syncPassages(s) {
  for (const tile of passageTiles(s.blueprint)) {
    const key = hexKey(tile.q, tile.r);
    const powered = !!s.activeOutputs[tile.passageOutputId];
    const state = s.passages[key] || { open: false, closingPending: false };
    const occupied = !!figureAt(s, key);
    if (powered) {
      state.open = true;
      state.closingPending = false;
    } else if (state.open) {
      if (occupied) {
        if (!state.closingPending) {
          state.closingPending = true;
          emit(s, "passage-closing-pending", { tile: key });
        }
      } else {
        state.open = false;
        state.closingPending = false;
      }
    }
    s.passages[key] = state;
  }
}

// Called after any movement so a pending interlock closes the moment its tile is empty.
export function settlePendingPassages(s) {
  for (const [key, state] of Object.entries(s.passages)) {
    if (state.closingPending && !figureAt(s, key)) {
      state.open = false;
      state.closingPending = false;
      emit(s, "passage-closed", { tile: key });
    }
  }
}

// Occupants that would make a player Commit unable to close an open controlled passage.
export function closureBlockers(s, nextActive) {
  const blockers = [];
  for (const tile of passageTiles(s.blueprint)) {
    const key = hexKey(tile.q, tile.r);
    const state = s.passages[key];
    if (!state?.open || state.closingPending) continue;
    if (nextActive[tile.passageOutputId]) continue;
    const who = figureAt(s, key);
    if (who) blockers.push({ tile: key, ...who });
  }
  return blockers;
}

export function poweredOutputs(s, kind = null) {
  return (s.blueprint.outputs || []).filter((o) => s.activeOutputs[o.id] && (!kind || o.effect?.kind === kind));
}

export { hexDistance, hexKey, parseHex, neighbourKeys, compareHex };
