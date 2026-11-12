import { COMMISSION_PROFILES, ENEMY_RULES, JOBS, REPAIR_STREAM_AMOUNT, RESERVE_BENEFIT_THRESHOLD, SHELTER_SHIELD, STORM_ENEMY_DAMAGE, STORM_ORCHARD_COST, STORM_RADIUS, STAT_NAMES, AP_PER_ROUND, commissionProfile, hazardOrchardDamage, hazardPower, nestDamage } from "./constants.js";
import { getPuzzleHooks } from "./puzzle-hooks.js";
import {
  addGrant, aliveEnemies, aliveHeroes, canonicalStationId, cloneState, compareHex, damageEnemy, damageHero, damageOrchard, damageStation, effectiveEnemyArmour,
  emit, enemyDef, enemyRule, enterCost, figureAt, getHero, getIndex, hasSight, hexDistance, memberProtection, occupiedKeys, pathTo, poweredOutputs,
  profileOf, recomputeOutputs, removeGrantsWhere, setLoss, settlePendingPassages, shortestPaths, siteProtection, station, stationCapacity, stationState,
} from "./rules.js";
import { rangeKeys } from "./hex.js";

const STATION_TIE_ORDER = ["shape", "sustain", "number"];

function enemyMoveBudget(s, enemy) {
  const rule = enemyRule(s, enemy);
  if (s.phaseEffects.rootsActive && enemyDef(s, enemy).ruleId === "breaker") return 0;
  return rule.move;
}

function firingHexes(s, enemy, targetHex, range, flies) {
  const blocked = occupiedKeys(s, enemy.id);
  const out = new Set();
  for (const key of rangeKeys(targetHex, range)) {
    if (key !== enemy.position && (blocked.has(key) || enterCost(s, key, flies) === Infinity)) continue;
    if (!hasSight(s, key, targetHex)) continue;
    out.add(key);
  }
  return out;
}

// Weighted cost, then hex distance to the target, then (r,q). If no goal is reachable this phase
// the enemy walks the prefix of the cheapest route that its budget affords.
function planMove(s, enemy, goals, targetHex, budget, flies) {
  if (goals.has(enemy.position) || goals.size === 0) return { path: [], reachable: goals.has(enemy.position), cost: 0 };
  const reach = shortestPaths(s, enemy.position, { flies, moverId: enemy.id });
  const reachableGoals = [...goals].filter((k) => reach.cost.has(k));
  if (!reachableGoals.length) return { path: [], reachable: false, cost: Infinity };
  const rank = (a, b) => reach.cost.get(a) - reach.cost.get(b) || hexDistance(a, targetHex) - hexDistance(b, targetHex) || compareHex(a, b);
  const within = reachableGoals.filter((k) => reach.cost.get(k) <= budget).sort(rank);
  const best = (within.length ? within : reachableGoals.sort(rank))[0];
  let path = pathTo(reach.parent, enemy.position, best) || [];
  if (!within.length) {
    const kept = [];
    let total = 0;
    for (const step of path) {
      total += enterCost(s, step, flies);
      if (total > budget) break;
      kept.push(step);
    }
    path = kept;
  }
  return { path, reachable: within.length > 0, cost: reach.cost.get(best) };
}

function bestGoalCost(s, enemy, targetHex, range, flies) {
  const goals = firingHexes(s, enemy, targetHex, range, flies);
  if (goals.has(enemy.position)) return 0;
  const reach = shortestPaths(s, enemy.position, { flies, moverId: enemy.id });
  let best = Infinity;
  for (const key of goals) if (reach.cost.has(key)) best = Math.min(best, reach.cost.get(key));
  return best;
}

function planIntent(s, enemy) {
  const def = enemyDef(s, enemy);
  const rule = ENEMY_RULES[def.ruleId];
  const tier = s.blueprint.tier;
  const hooks = getPuzzleHooks(s.blueprint.puzzle.kind);
  const base = { enemyId: enemy.id, ruleId: def.ruleId, artId: def.artId, from: enemy.position, path: [], targetId: null, verb: "idle", power: 0, puzzleChange: null, hpChange: null, blockedBy: null };
  if (s.round < def.wakePhase) return { ...base, verb: "dormant", wakePhase: def.wakePhase };
  if (def.sector && s.phaseEffects.suppressedSectors.includes(def.sector)) return { ...base, verb: "suppressed", sector: def.sector };
  const budget = enemyMoveBudget(s, enemy);
  const flies = !!rule.flies;
  const puzzle = s.blueprint.puzzle;

  if (def.ruleId === "jammer" || def.ruleId === "rewinder") {
    const kind = def.ruleId === "jammer" ? "jam" : "rewind";
    const power = rule.disruption(tier);
    const candidates = hooks.disruptionCandidates(puzzle, s.puzzleActive.content, kind) || [];
    const member = candidates.find((c) => memberProtection(s, c.groupIds || []) < power);
    if (def.ruleId === "jammer") {
      const control = station(s, "control");
      const goals = firingHexes(s, enemy, control.hex, rule.range, flies);
      const move = planMove(s, enemy, goals, control.hex, budget, flies);
      if (member) return { ...base, verb: "disrupt", targetId: "control", power, path: move.path, puzzleChange: { memberId: member.memberId, groupIds: member.groupIds || [], kind } };
      return { ...base, verb: "strike", targetId: "control", power: rule.strike(tier), path: move.path };
    }
    if (member) {
      const hex = member.hex;
      const goals = firingHexes(s, enemy, hex, rule.range, flies);
      const move = planMove(s, enemy, goals, hex, budget, flies);
      return { ...base, verb: "disrupt", targetId: member.memberId, power, path: move.path, puzzleChange: { memberId: member.memberId, groupIds: member.groupIds || [], kind, hex } };
    }
    const heroes = aliveHeroes(s).sort((a, b) => hexDistance(enemy.position, a.position) - hexDistance(enemy.position, b.position) || compareHex(a.position, b.position) || a.id.localeCompare(b.id));
    if (!heroes.length) return base;
    const target = heroes[0];
    const goals = firingHexes(s, enemy, target.position, rule.range, flies);
    return { ...base, verb: "strike", targetId: target.id, power: rule.strike(tier), path: planMove(s, enemy, goals, target.position, budget, flies).path };
  }

  if (def.ruleId === "hunter") {
    const heroes = aliveHeroes(s);
    if (!heroes.length) return base;
    const lowest = Math.min(...heroes.map((h) => h.hp));
    const tied = heroes.filter((h) => h.hp === lowest).map((h) => ({ hero: h, cost: bestGoalCost(s, enemy, h.position, rule.range, flies) }));
    tied.sort((a, b) => a.cost - b.cost || a.hero.id.localeCompare(b.hero.id));
    const target = tied[0].hero;
    const goals = firingHexes(s, enemy, target.position, rule.range, flies);
    return { ...base, verb: "strike", targetId: target.id, power: rule.strike(tier), path: planMove(s, enemy, goals, target.position, budget, flies).path };
  }

  if (def.ruleId === "breaker") {
    const candidates = STATION_TIE_ORDER.filter((id) => station(s, id)).map((id) => ({ id, charge: stationState(s, id).charge, capacity: stationCapacity(s, id) }));
    candidates.sort((a, b) => {
      const cross = b.charge * a.capacity - a.charge * b.capacity;
      return cross || STATION_TIE_ORDER.indexOf(a.id) - STATION_TIE_ORDER.indexOf(b.id);
    });
    const target = candidates[0];
    if (!target) return base;
    const hex = station(s, target.id).hex;
    const goals = firingHexes(s, enemy, hex, rule.range, flies);
    return { ...base, verb: "strike", targetId: target.id, power: rule.strike(tier), path: planMove(s, enemy, goals, hex, budget, flies).path };
  }
  return base;
}

export function planIntents(s) {
  const enemies = aliveEnemies(s).sort((a, b) => ENEMY_RULES[enemyDef(s, a).ruleId].initiative - ENEMY_RULES[enemyDef(s, b).ruleId].initiative || a.id.localeCompare(b.id));
  return enemies.map((enemy) => planIntent(s, enemy));
}

function walkPath(s, enemy, intent) {
  const rule = enemyRule(s, enemy);
  const flies = !!rule.flies;
  const from = enemy.position;
  const taken = [];
  for (const step of intent.path) {
    const blockedBy = figureAt(s, step);
    if (blockedBy && blockedBy.id !== enemy.id) { intent.blockedBy = { code: "path-blocked", by: blockedBy.id, at: step }; break; }
    if (enterCost(s, step, flies) === Infinity) { intent.blockedBy = { code: "path-closed", at: step }; break; }
    enemy.position = step;
    taken.push(step);
  }
  if (taken.length) {
    emit(s, "enemy-moved", { enemyId: enemy.id, from, to: enemy.position, path: taken });
    settlePendingPassages(s);
  }
  intent.actualPath = taken;
}

function executeIntent(s, intent) {
  const enemy = s.enemyStates.find((e) => e.id === intent.enemyId);
  if (!enemy || enemy.defeated) { intent.blockedBy = { code: "defeated" }; return; }
  if (intent.verb === "dormant" || intent.verb === "suppressed" || intent.verb === "idle") {
    emit(s, "enemy-idle", { enemyId: enemy.id, reason: intent.verb, wakePhase: intent.wakePhase ?? null, sector: intent.sector ?? null });
    return;
  }
  const rule = enemyRule(s, enemy);
  walkPath(s, enemy, intent);
  if (s.status !== "playing") return;

  if (intent.verb === "disrupt") {
    const counter = s.phaseEffects.counters.findIndex((c) => c.enemyId === enemy.id);
    if (counter >= 0) {
      const [spent] = s.phaseEffects.counters.splice(counter, 1);
      intent.blockedBy = { code: "counterturn", heroId: spent.heroId };
      emit(s, "disruption-cancelled", { enemyId: enemy.id, heroId: spent.heroId });
      return;
    }
    const change = intent.puzzleChange;
    const control = station(s, "control");
    const anchorHex = intent.ruleId === "jammer" ? control.hex : change.hex;
    const distance = hexDistance(enemy.position, anchorHex);
    if (distance > rule.range || (distance > 1 && !hasSight(s, enemy.position, anchorHex))) {
      intent.blockedBy = { code: "out-of-range", distance, range: rule.range };
      emit(s, "enemy-out-of-range", { enemyId: enemy.id, targetId: intent.targetId });
      return;
    }
    const protection = memberProtection(s, change.groupIds);
    if (protection >= intent.power) {
      intent.blockedBy = { code: "protected", strength: protection, power: intent.power, groupIds: change.groupIds };
      emit(s, "disruption-blocked", { enemyId: enemy.id, memberId: change.memberId, strength: protection, power: intent.power });
      return;
    }
    if (protection > 0) {
      const broken = removeGrantsWhere(s, (g) => (g.kind === "lock" || g.kind === "stabilise") && change.groupIds.includes(g.targetId));
      emit(s, "lock-broken", { enemyId: enemy.id, groupIds: change.groupIds, strength: protection, power: intent.power, removed: broken.length });
    }
    const hooks = getPuzzleHooks(s.blueprint.puzzle.kind);
    s.puzzleActive.content = hooks.disrupt(s.blueprint.puzzle, s.puzzleActive.content, change.memberId, change.kind);
    const before = { ...s.activeOutputs };
    recomputeOutputs(s);
    intent.puzzleChangeApplied = true;
    emit(s, "puzzle-disrupted", { enemyId: enemy.id, memberId: change.memberId, kind: change.kind, outputsBefore: before, outputsAfter: { ...s.activeOutputs } });
    return;
  }

  // strike
  const target = intent.targetId;
  const hero = getHero(s, target);
  if (hero) {
    if (hero.defeated) { intent.blockedBy = { code: "target-lost" }; emit(s, "enemy-fizzled", { enemyId: enemy.id, reason: "target-lost" }); return; }
    const distance = hexDistance(enemy.position, hero.position);
    if (distance > rule.range) { intent.blockedBy = { code: "out-of-range", distance, range: rule.range }; emit(s, "enemy-out-of-range", { enemyId: enemy.id, targetId: target }); return; }
    if (!hasSight(s, enemy.position, hero.position)) { intent.blockedBy = { code: "no-sight" }; emit(s, "enemy-no-sight", { enemyId: enemy.id, targetId: target }); return; }
    const hp = hero.hp;
    const result = damageHero(s, hero, intent.power, { enemyId: enemy.id, verb: "strike" });
    intent.hpChange = { targetId: target, before: hp, after: hero.hp, damage: result.damage, shieldAbsorbed: result.absorbed, armour: profileOf(s, hero).armour };
    return;
  }
  const stationTarget = station(s, target);
  if (stationTarget) {
    const distance = hexDistance(enemy.position, stationTarget.hex);
    if (distance > rule.range) { intent.blockedBy = { code: "out-of-range", distance, range: rule.range }; emit(s, "enemy-out-of-range", { enemyId: enemy.id, targetId: target }); return; }
    const before = stationState(s, target).integrity;
    const result = damageStation(s, target, intent.power, { enemyId: enemy.id, verb: "strike" });
    intent.hpChange = { targetId: target, before, after: stationState(s, target).integrity, damage: result.damage, shieldAbsorbed: result.absorbed };
  }
}

function applyPhaseStart(s, record) {
  const pe = s.phaseEffects;
  pe.rootsActive = false;
  pe.suppressedSectors = [];
  pe.pendingRestore = [];
  pe.nestSnapshot = null;
  const hooks = getPuzzleHooks(s.blueprint.puzzle.kind);
  const puzzle = s.blueprint.puzzle;
  for (const output of poweredOutputs(s)) {
    const effect = output.effect || {};
    switch (effect.kind) {
      case "storm": {
        damageOrchard(s, STORM_ORCHARD_COST, { outputId: output.id });
        if (s.status !== "playing") return;
        const centre = station(s, "number").hex;
        for (const enemy of aliveEnemies(s)) {
          if (hexDistance(enemy.position, centre) <= STORM_RADIUS) damageEnemy(s, enemy, STORM_ENEMY_DAMAGE, { outputId: output.id, verb: "storm" }, { flat: true });
        }
        break;
      }
      case "shelter": {
        const amount = effect.amount ?? SHELTER_SHIELD;
        const targets = new Set(effect.targetIds || []);
        if (effect.coverage === "puzzle" && hooks.coverage) {
          const cover = hooks.coverage(puzzle, s.puzzleActive.content);
          const suppressed = new Set(pe.suppressedShelterCells || []);
          const covered = new Set((cover.coveredCells || []).filter((k) => !suppressed.has(k)));
          for (const hero of aliveHeroes(s)) if (covered.has(hero.position)) targets.add(hero.id);
          for (const st of s.blueprint.stations) if (covered.has(st.hex)) targets.add(canonicalStationId(st.id));
        }
        for (const targetId of targets) addGrant(s, { kind: "shield", targetId: canonicalStationId(targetId), amount, source: "output", outputId: output.id });
        emit(s, "shelter-applied", { outputId: output.id, targetIds: [...targets], amount });
        break;
      }
      case "roots":
        pe.rootsActive = true;
        emit(s, "roots-active", { outputId: output.id });
        break;
      case "beam":
        pe.suppressedSectors.push(effect.sector);
        emit(s, "beam-active", { outputId: output.id, sector: effect.sector });
        break;
      case "reserve-benefit": {
        const reserve = hooks.reserveTotal ? hooks.reserveTotal(puzzle, s.puzzleActive.content) : 0;
        if (reserve >= RESERVE_BENEFIT_THRESHOLD) {
          for (const targetId of effect.targetIds || []) addGrant(s, { kind: "shield", targetId: canonicalStationId(targetId), amount: effect.amount ?? SHELTER_SHIELD, source: "output", outputId: output.id });
          emit(s, "reserve-shield", { outputId: output.id, reserve, targetIds: effect.targetIds || [] });
        } else {
          pe.pendingRestore.push({ outputId: output.id, amount: REPAIR_STREAM_AMOUNT, cause: "reserve-restoration", reserve });
        }
        break;
      }
      case "repair-stream":
        pe.pendingRestore.push({ outputId: output.id, amount: effect.amount ?? REPAIR_STREAM_AMOUNT, cause: "repair-stream" });
        break;
      default:
        break;
    }
    if (s.status !== "playing") return;
  }
  if (s.blueprint.nests?.length && hooks.sectorFill) pe.nestSnapshot = hooks.sectorFill(puzzle, s.puzzleActive.content);
}

function applyHazards(s, record) {
  const tier = s.blueprint.tier;
  const hooks = getPuzzleHooks(s.blueprint.puzzle.kind);
  const puzzle = s.blueprint.puzzle;
  for (const hazard of s.blueprint.hazards || []) {
    const power = hazard.power ?? hazardPower(tier);
    const mutation = hazard.mutation;
    const result = { hazardId: hazard.id, power, mutation: null, sites: [] };
    if (mutation?.kind === "puzzle") {
      const candidates = hooks.disruptionCandidates(puzzle, s.puzzleActive.content, "environment") || [];
      const member = candidates.find((c) => memberProtection(s, c.groupIds || [], { wide: true }) < power);
      if (member) {
        const protection = memberProtection(s, member.groupIds || [], { wide: true });
        if (protection > 0) removeGrantsWhere(s, (g) => (g.kind === "lock" || g.kind === "stabilise") && (member.groupIds || []).includes(g.targetId));
        s.puzzleActive.content = hooks.disrupt(puzzle, s.puzzleActive.content, member.memberId, "environment");
        recomputeOutputs(s);
        result.mutation = { memberId: member.memberId, applied: true };
        emit(s, "hazard-mutation", { hazardId: hazard.id, memberId: member.memberId });
      } else {
        result.mutation = { applied: false, blocked: candidates.length ? "protected" : "no-member" };
        emit(s, "hazard-mutation-blocked", { hazardId: hazard.id });
      }
    } else if (mutation?.kind === "suppress-shelter") {
      const protection = memberProtection(s, [mutation.groupId], { wide: true });
      if (protection >= power) {
        result.mutation = { applied: false, blocked: "protected" };
        emit(s, "hazard-mutation-blocked", { hazardId: hazard.id });
      } else {
        s.phaseEffects.suppressedShelterCells = [...(mutation.cells || [])];
        result.mutation = { applied: true, cells: [...(mutation.cells || [])] };
        emit(s, "shelter-suppressed", { hazardId: hazard.id, cells: mutation.cells || [] });
      }
    }
    for (const site of hazard.sites || []) {
      const protection = siteProtection(s, site.targetId);
      if (protection >= power) {
        result.sites.push({ siteId: site.id, blocked: true, strength: protection });
        emit(s, "hazard-blocked", { hazardId: hazard.id, siteId: site.id, strength: protection, power });
      } else {
        const amount = site.orchardDamage ?? hazardOrchardDamage(tier);
        result.sites.push({ siteId: site.id, blocked: false, damage: amount });
        damageOrchard(s, amount, { hazardId: hazard.id, siteId: site.id });
      }
      if (s.status !== "playing") { record.hazards.push(result); return; }
    }
    record.hazards.push(result);
  }
  if (s.blueprint.nests?.length && s.phaseEffects.nestSnapshot) {
    // Beams count as they stood at phase start (the same snapshot as the nest fill and the enemy suppression): an
    // environment mutation earlier in this phase must not uncover a sector the powered beam already covered.
    const beamSectors = new Set(s.phaseEffects.suppressedSectors);
    const power = hazardPower(tier);
    for (const nest of s.blueprint.nests) {
      if (!s.phaseEffects.nestSnapshot[nest.sectorId] || beamSectors.has(nest.sectorId)) continue;
      const protection = memberProtection(s, [nest.groupId], { wide: true });
      if (protection >= power) { emit(s, "nest-blocked", { sectorId: nest.sectorId, strength: protection }); continue; }
      damageOrchard(s, nestDamage(tier), { nestSector: nest.sectorId });
      record.hazards.push({ hazardId: `nest:${nest.sectorId}`, power, damage: nestDamage(tier) });
      if (s.status !== "playing") return;
    }
  }
}

export function evaluateVictory(state) {
  const s = state;
  const tier = s.blueprint.tier;
  const unmet = [];
  for (const job of JOBS) {
    const candidates = job === "shape" ? ["shape", "alcove"] : [job];
    const heldAt = candidates.find((id) => s.holds[id]);
    if (!heldAt) { unmet.push({ code: "job-not-held", params: { job } }); continue; }
    const hero = getHero(s, s.holds[heldAt].heroId);
    if (!hero || hero.defeated) { unmet.push({ code: "holder-lost", params: { job } }); continue; }
    const viaAlcove = heldAt === "alcove";
    if (viaAlcove && !s.preparedAlcove) unmet.push({ code: "alcove-unprepared", params: { job } });
    const need = commissionProfile(tier, job, viaAlcove);
    const short = need.map((n, i) => ({ stat: i, name: STAT_NAMES[i], need: n, have: profileOf(s, hero).stats[i] })).filter((x) => x.have < x.need);
    if (short.length) unmet.push({ code: "profile-short", params: { job, heroId: hero.id, shortfalls: short } });
    const state2 = stationState(s, job);
    if (state2.charge < stationCapacity(s, job)) unmet.push({ code: "not-charged", params: { job, charge: state2.charge, capacity: stationCapacity(s, job) } });
  }
  const commission = s.blueprint.commission || {};
  const powered = poweredOutputs(s).map((o) => o.id);
  if (commission.poweredIds) {
    for (const id of commission.poweredIds) if (!powered.includes(id)) unmet.push({ code: "output-unpowered", params: { outputId: id } });
  }
  if (commission.poweredCount != null) {
    const pool = commission.selectableOutputIds || (s.blueprint.outputs || []).map((o) => o.id);
    const count = powered.filter((id) => pool.includes(id)).length;
    if (count < commission.poweredCount) unmet.push({ code: "outputs-short", params: { have: count, need: commission.poweredCount } });
  }
  const hooks = getPuzzleHooks(s.blueprint.puzzle.kind);
  if (hooks.commissionCheck) {
    const check = hooks.commissionCheck(s.blueprint.puzzle, s.puzzleActive.content, {
      selectedOutputIds: s.puzzleActive.selectedOutputIds || [], poweredOutputIds: powered, suppressedShelterCells: s.phaseEffects.suppressedShelterCells || [], tier,
    });
    if (!check.ok) unmet.push({ code: check.reasonCode || "puzzle-condition", params: check.reasonParams || {} });
  }
  return { won: unmet.length === 0, unmet };
}

function cleanupPhase(s) {
  s.phaseEffects = { grants: [], counters: [], suppressedShelterCells: [], suppressedSectors: [], pendingRestore: [], rootsActive: false, nestSnapshot: null };
  s.holds = {};
  for (const hero of s.heroes) hero.holding = null;
  for (const id of Object.keys(s.marks)) {
    const enemy = s.enemyStates.find((e) => e.id === id);
    if (!enemy || enemy.defeated) delete s.marks[id];
  }
}

// One shared implementation for forecast (on a clone) and resolution (on the real next state).
export function runEnemyPhase(s) {
  const record = { round: s.round, phaseStart: [], intents: [], hazards: [], outcome: null };
  const mark = s.events.length;
  applyPhaseStart(s, record);
  record.phaseStartEvents = s.events.slice(mark);
  if (s.status === "playing") {
    record.intents = planIntents(s);
    for (const intent of record.intents) {
      executeIntent(s, intent);
      if (s.status !== "playing") break;
    }
  }
  if (s.status === "playing") applyHazards(s, record);
  if (s.status === "playing") {
    for (const pending of s.phaseEffects.pendingRestore) {
      if (s.orchardIntegrity <= 0) break;
      const max = s.blueprint.orchardMaxIntegrity;
      const before = s.orchardIntegrity;
      s.orchardIntegrity = Math.min(max, before + pending.amount);
      emit(s, "orchard-restored", { amount: s.orchardIntegrity - before, integrityBefore: before, integrityAfter: s.orchardIntegrity, cause: pending.cause, outputId: pending.outputId });
    }
  }
  if (s.status === "playing") {
    const verdict = evaluateVictory(s);
    record.verdict = verdict;
    if (verdict.won) {
      s.status = "won";
      emit(s, "run-won", { round: s.round });
    }
  }
  const finalRound = s.round;
  cleanupPhase(s);
  if (s.status === "playing") {
    if (finalRound >= s.blueprint.deadline) setLoss(s, "deadline", { unmet: record.verdict?.unmet || [] });
    else {
      s.round += 1;
      for (const hero of aliveHeroes(s)) hero.ap = AP_PER_ROUND;
      emit(s, "round-started", { round: s.round });
    }
  }
  record.outcome = { status: s.status, lossReason: s.lossReason || null, wouldWin: s.status === "won", unmet: record.verdict?.unmet || [] };
  record.events = s.events.slice(mark);
  return record;
}

export function forecastEnemyPhase(state) {
  const s = cloneState(state);
  const record = runEnemyPhase(s);
  return {
    revision: state.revision,
    round: state.round,
    intents: record.intents.map((i) => ({ enemyId: i.enemyId, ruleId: i.ruleId, artId: i.artId, verb: i.verb, targetId: i.targetId, power: i.power, from: i.from, path: i.path, actualPath: i.actualPath || [], puzzleChange: i.puzzleChange ? { ...i.puzzleChange, applied: !!i.puzzleChangeApplied } : null, hpChange: i.hpChange, blockedBy: i.blockedBy, wakePhase: i.wakePhase ?? null, sector: i.sector ?? null })),
    hazards: record.hazards,
    phaseStartEvents: record.phaseStartEvents,
    outcome: record.outcome,
    events: record.events,
  };
}

export function resolveEnemyPhase(state) {
  const s = cloneState(state);
  const record = runEnemyPhase(s);
  return { state: s, record };
}

export { COMMISSION_PROFILES, effectiveEnemyArmour };
