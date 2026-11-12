// C-08A (Claude): tactical planner for Orchard v2 certification. Development tooling, never a runtime dependency.
//
// planOrchardBlueprint({blueprint, teamChoices, planFamily, maxStates=250000, ...options})
//   -> {status:'success'|'unsatisfiable'|'unknown', traces, metrics, reasonCode?}
//
// Every state transition is the production reducer (`reduceCommand`); there is no approximate simulator.
// A trace is only returned after `replayRun` re-accepts every command, ends 'won' within the deadline, and its
// per-command hashes are recorded. Draft edits come from the real puzzle hooks (`request-hint` stage 3, the
// engine's replayable worked-solution edit) followed by `select-outputs` and a paid Operate.
//
// SEARCH. Round-synchronous best-first beam over macro states, deduplicated by the canonical `stateHash`.
// Each hero's round is a short script (commit puzzle, prepare alcove, approach station, calibrate, one
// optional spare action chosen from the legal protection/strike/charge-help set, then synchronous holds).
// Branching: committer hero, job assignment, deployment permutation, output choice, movement endpoint (best two),
// spare action (up to 4 per hero per round). Pruning: duplicate canonical states only. We deliberately do NOT
// apply HP dominance: the Hunter targets the lowest current HP, so a "better HP" state can change future
// targeting and is not safely comparable. The beam width cuts by a progress score, so a failed search is
// reported as 'unknown', never as proof of impossibility.
//
// 'unsatisfiable' is returned only for the exact static proof that no assignment of the three cards to the
// Number/Shape/Sustain jobs meets the printed commissioning profiles (direct, or alcove for 'alcove-intercept').
import { reduceCommand, listCommands } from "../../expeditions/v2/actions.js";
import { createRun, exportRunRecord, replayRun, stateHash } from "../../expeditions/v2/run.js";
import { orchardRosterProfiles } from "../../expeditions/v2/profile.js";
import { getPuzzleHooks } from "../../expeditions/v2/puzzle-hooks.js";
import { commissionProfile, JOBS } from "../../expeditions/v2/constants.js";
import { hexDistance } from "../../expeditions/v2/hex.js";
import { reachableHexes } from "../../expeditions/v2/rules.js";

export const PLAN_FAMILIES = ["direct-guard", "alcove-intercept"];

function permutations(items) {
  if (items.length <= 1) return [items];
  return items.flatMap((x, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [x, ...rest]));
}

// Exact: which cards can hold which job. Returns every feasible assignment {number,shape,sustain}.
export function feasibleJobAssignments(blueprint, cardIds, planFamily, profiles = orchardRosterProfiles()) {
  const viaAlcove = planFamily === "alcove-intercept";
  return permutations(cardIds).map(([a, b, c]) => ({ number: a, shape: b, sustain: c })).filter((assignment) => JOBS.every((job) => {
    const need = commissionProfile(blueprint.tier, job, job === "shape" && viaAlcove);
    return need.every((n, i) => (profiles[assignment[job]]?.stats[i] ?? -1) >= n);
  }));
}

function outputChoices(blueprint) {
  const hooks = getPuzzleHooks(blueprint.puzzle.kind);
  const ids = blueprint.commission.selectableOutputIds || blueprint.outputs.map((o) => o.id);
  const want = blueprint.commission.poweredCount ?? blueprint.commission.poweredIds?.length ?? 1;
  const required = blueprint.commission.poweredIds || [];
  const out = [];
  const pick = (start, chosen) => {
    if (chosen.length === want) {
      if (required.every((id) => chosen.includes(id)) && hooks.checkOutputSelection(blueprint.puzzle, chosen).ok) out.push([...chosen]);
      return;
    }
    for (let i = start; i < ids.length; i += 1) pick(i + 1, [...chosen, ids[i]]);
  };
  pick(0, []);
  if (!out.length && required.length) out.push(required);
  return out;
}

export const HARD_STATE_CAP = 250000;

// `used` counts admitted transitions only; a denied spend never increments it.
export class Budget {
  constructor(maxStates) {
    if (!Number.isInteger(maxStates) || maxStates < 0) throw new RangeError("maxStates must be a non-negative integer");
    this.max = Math.min(maxStates, HARD_STATE_CAP);
    this.used = 0;
    this.exhausted = false;
  }
  spend() {
    if (this.used >= this.max) { this.exhausted = true; return false; }
    this.used += 1;
    return true;
  }
}

const cmd = (state, type, heroId, payload = {}) => ({ type, heroId, expectedRevision: state.revision, payload });

function apply(budget, state, type, heroId, payload) {
  if (!budget.spend()) return null;
  const { state: next, result } = reduceCommand(state, cmd(state, type, heroId, payload));
  if (!result.legal) return null;
  next.undo = [];
  return next;
}

const heroOf = (state, id) => state.heroes.find((h) => h.id === id);
const storeFull = (state, job) => state.stationStates[job].charge >= state.blueprint.stations.find((s) => s.id === job).capacity;
const stationHex = (state, id) => state.blueprint.stations.find((s) => s.id === id).hex;

function ctxFor(state, plan) {
  const jobOf = Object.fromEntries(Object.entries(plan.assignment).map(([job, id]) => [id, job]));
  return { jobOf, viaAlcove: plan.planFamily === "alcove-intercept" };
}
const holdTarget = (job, ctx) => (job === "shape" && ctx.viaAlcove ? "alcove" : job);

function needsCommit(state, plan) {
  return !plan.outputs.every((id) => state.activeOutputs[id]);
}

// Moves toward `target` until within 1; returns up to two alternative endpoints.
function approach(budget, state, heroId, target, ctx, alternatives = 2, within = 1) {
  const hero = heroOf(state, heroId);
  if (hero.ap < 1 || hexDistance(hero.position, target) <= within) return [state];
  const profile = state.profiles[hero.cardId];
  const useDash = ctx.viaAlcove && hero.handReady.dash && hexDistance(hero.position, target) - within > profile.moveBudget;
  const type = useDash ? "dash" : "move";
  const reach = reachableHexes(state, heroId, useDash ? profile.dashBudget : profile.moveBudget)
    .map((r) => ({ ...r, d: hexDistance(r.key, target) }))
    .filter((r) => r.d < hexDistance(hero.position, target))
    .sort((a, b) => a.d - b.d || a.cost - b.cost)
    .slice(0, alternatives);
  const outs = reach.map((r) => apply(budget, state, type, heroId, { destination: r.key, path: null })).filter(Boolean);
  return outs.length ? outs : [state];
}

function commitSteps(budget, state, heroId, plan, ctx) {
  if (plan.committer !== heroId || !needsCommit(state, plan)) return [state];
  const hero = heroOf(state, heroId);
  const control = state.blueprint.puzzle.controlHex;
  if (hexDistance(hero.position, control) > 1) return approach(budget, state, heroId, control, ctx).flatMap((s) => (s === state ? [s] : commitSteps(budget, s, heroId, plan, ctx)));
  if (hero.ap < 1) return [state];
  const puzzleId = state.blueprint.puzzle.id ?? state.blueprint.puzzle.kind;
  let s = state;
  const solution = getPuzzleHooks(state.blueprint.puzzle.kind).solutionDraft?.(state.blueprint.puzzle);
  const target = solution && solution.content !== undefined ? solution.content : solution;
  const mirrors = (content) => JSON.stringify({ ...content, outputIds: undefined }) === JSON.stringify({ ...target, outputIds: undefined });
  if (!mirrors(s.puzzleDraft.content)) {
    s = apply(budget, s, "request-hint", null, { puzzleId, stage: 3 });
    if (!s) return [state];
  }
  if (JSON.stringify(s.puzzleDraft.selectedOutputIds) !== JSON.stringify(plan.outputs)) {
    s = apply(budget, s, "edit-draft", null, { puzzleId, edit: { type: "select-outputs", outputIds: plan.outputs } });
    if (!s) return [state];
  }
  const operated = apply(budget, s, "operate", heroId, { draftRevision: s.puzzleDraft.revision, outputIds: s.puzzleDraft.selectedOutputIds, lockGroupId: null });
  return [operated || s];
}

function stationSteps(budget, state, heroId, plan, ctx) {
  const job = ctx.jobOf[heroId];
  if (!job) return [state];
  const target = holdTarget(job, ctx);
  const hex = stationHex(state, target);
  let outs = [state];
  if (job === "shape" && ctx.viaAlcove && !state.preparedAlcove) {
    outs = outs.flatMap((s) => {
      const hero = heroOf(s, heroId);
      if (hexDistance(hero.position, hex) > 1) return approach(budget, s, heroId, hex, ctx);
      return [apply(budget, s, "prepare-alcove", heroId, {}) || s];
    });
  }
  outs = outs.flatMap((s) => {
    const hero = heroOf(s, heroId);
    return hexDistance(hero.position, hex) > 1 ? approach(budget, s, heroId, hex, ctx) : [s];
  });
  return outs.map((s) => {
    let cur = s;
    for (let guard = 0; guard < 12; guard += 1) {
      const hero = heroOf(cur, heroId);
      if (hero.ap < 1 || storeFull(cur, job) || hexDistance(hero.position, hex) > 1) break;
      const next = apply(budget, cur, "calibrate", heroId, { targetId: target });
      if (!next) break;
      cur = next;
    }
    return cur;
  });
}

const SPARE_ORDER = {
  "direct-guard": ["lock", "counterturn", "strike", "exact-blow", "stand-together", "guard", "stabilise", "calibrate", "repair"],
  "alcove-intercept": ["intercept", "marked-shot", "strike", "lock", "counterturn", "calibrate", "guard", "stabilise", "repair"],
};

// Walk toward the nearest living enemy and strike it with the remaining AP (the planner's way to remove a Jammer).
function engageSteps(budget, state, heroId, ctx) {
  const hero0 = heroOf(state, heroId);
  const enemy = state.enemyStates.filter((e) => !e.defeated).sort((a, b) => hexDistance(hero0.position, a.position) - hexDistance(hero0.position, b.position))[0];
  if (!enemy) return [];
  const range = state.profiles[hero0.cardId].strikeRange;
  return approach(budget, state, heroId, enemy.position, ctx, 1, range).map((s) => {
    let cur = s;
    for (let guard = 0; guard < 4; guard += 1) {
      const live = cur.enemyStates.find((e) => e.id === enemy.id);
      if (!live || live.defeated || heroOf(cur, heroId).ap < 1) break;
      const next = apply(budget, cur, "strike", heroId, { targetId: enemy.id });
      if (!next) break;
      cur = next;
    }
    return cur;
  }).filter((s) => s !== state);
}

// A hero whose own job is done lends its Arithmetic to an unfinished station: walk there, then calibrate.
function helpSteps(budget, state, heroId, job, ctx) {
  const hero0 = heroOf(state, heroId);
  const hex = stationHex(state, job === "shape" && ctx.viaAlcove ? "shape" : job);
  let outs = hexDistance(hero0.position, hex) > 1 ? approach(budget, state, heroId, hex, ctx, 1) : [state];
  return outs.map((s) => {
    let cur = s;
    for (let guard = 0; guard < 12; guard += 1) {
      const hero = heroOf(cur, heroId);
      if (hero.ap < 1 || storeFull(cur, job) || hexDistance(hero.position, hex) > 1) break;
      const next = apply(budget, cur, "calibrate", heroId, { targetId: job });
      if (!next) break;
      cur = next;
    }
    return cur;
  });
}

function spareBranches(budget, state, heroId, plan, ctx) {
  const hero = heroOf(state, heroId);
  if (hero.ap < 1) return [state];
  const job = ctx.jobOf[heroId];
  const holdReady = job && storeFull(state, job) && hexDistance(hero.position, stationHex(state, holdTarget(job, ctx))) <= 1;
  const spare = hero.ap - (holdReady ? 1 : 0);
  if (spare < 1) return [state];
  const helped = [];
  const own = ctx.jobOf[heroId];
  if (!own || storeFull(state, own)) {
    const missing = JOBS.filter((j) => j !== own && !storeFull(state, j)).sort((a, b) => (state.stationStates[a].charge / state.blueprint.stations.find((s) => s.id === a).capacity) - (state.stationStates[b].charge / state.blueprint.stations.find((s) => s.id === b).capacity));
    for (const job of missing.slice(0, 2)) helped.push(...helpSteps(budget, state, heroId, job, ctx).filter((s) => s !== state));
  }
  const rows = listCommands(state, heroId);
  const options = [];
  for (const type of SPARE_ORDER[plan.planFamily]) {
    const row = rows.find((r) => r.type === type);
    if (!row || !row.available) continue;
    if (type === "intercept") {
      const t = row.targets.find((x) => x.destination);
      const enemy = state.enemyStates.find((e) => !e.defeated);
      if (t && enemy) options.push({ type, payload: { destination: heroOf(state, heroId).position, path: null, markTargetId: enemy.id } });
      continue;
    }
    const legal = row.targets.filter((t) => t.legal);
    if (type === "calibrate") {
      const other = legal.find((t) => t.targetId && t.targetId !== holdTarget(job, ctx) && !storeFull(state, t.targetId === "alcove" ? "shape" : t.targetId));
      if (other) options.push({ type, payload: other.payload });
      continue;
    }
    if (legal[0]) options.push({ type, payload: legal[0].payload });
  }
  const engaged = engageSteps(budget, state, heroId, ctx);
  const outs = [state, ...helped, ...engaged];
  for (const o of options.slice(0, 4)) {
    const next = apply(budget, state, o.type, heroId, o.payload);
    if (next) outs.push(next);
  }
  return outs;
}

function holdPass(budget, state, plan, ctx) {
  if (!JOBS.every((job) => storeFull(state, job))) return state;
  let cur = state;
  for (const job of JOBS) {
    const heroId = plan.assignment[job];
    const hero = heroOf(cur, heroId);
    if (!hero || hero.defeated || hero.ap < 1) continue;
    const target = holdTarget(job, ctx);
    if (hexDistance(hero.position, stationHex(cur, target)) > 1) continue;
    cur = apply(budget, cur, "hold", heroId, { targetId: target }) || cur;
  }
  return cur;
}

function score(state, plan, ctx) {
  let s = 0;
  for (const job of JOBS) {
    const cap = state.blueprint.stations.find((x) => x.id === job).capacity;
    s += (state.stationStates[job].charge / cap) * 20;
    const hero = heroOf(state, plan.assignment[job]);
    s -= hexDistance(hero.position, stationHex(state, holdTarget(job, ctx))) * 1.5;
    if (hero.hp < state.profiles[hero.cardId].maxHealth) s -= 2;
  }
  s += plan.outputs.filter((id) => state.activeOutputs[id]).length * 25;
  s += state.orchardIntegrity / state.blueprint.orchardMaxIntegrity * 10;
  s += Object.keys(state.holds).length * 8;
  if (ctx.viaAlcove && state.preparedAlcove) s += 10;
  s -= state.enemyStates.filter((e) => !e.defeated).reduce((t, e) => t + e.hp, 0) * 0.4;
  return s;
}

function searchPlan(budget, initial, plan, beamWidth, onRound = null) {
  const ctx = ctxFor(initial, plan);
  let frontier = [initial];
  for (let round = 1; round <= initial.blueprint.deadline && frontier.length; round += 1) {
    const seen = new Map();
    for (const start of frontier) {
      if (budget.exhausted) break;
      let layer = [start];
      for (const heroId of plan.heroOrder) {
        layer = layer.flatMap((s) => (heroOf(s, heroId).defeated ? [s] : commitSteps(budget, s, heroId, plan, ctx)));
        layer = layer.flatMap((s) => stationSteps(budget, s, heroId, plan, ctx));
        layer = layer.flatMap((s) => spareBranches(budget, s, heroId, plan, ctx));
        const dedup = new Map(layer.map((s) => [stateHash(s), s]));
        layer = [...dedup.values()].sort((a, b) => score(b, plan, ctx) - score(a, plan, ctx)).slice(0, beamWidth);
        if (budget.exhausted) break;
      }
      for (const s of layer) {
        const held = holdPass(budget, s, plan, ctx);
        const ended = apply(budget, held, "end-round", null, { forecastRevision: held.revision });
        if (!ended) continue;
        if (ended.status === "won") return ended;
        if (ended.status === "playing") seen.set(stateHash(ended), ended);
      }
    }
    if (budget.exhausted) return null;
    onRound?.(round, [...seen.values()]);
    frontier = [...seen.values()].sort((a, b) => score(b, plan, ctx) - score(a, plan, ctx)).slice(0, beamWidth);
  }
  return null;
}

function nearestDeploymentAssignment(blueprint, assignment) {
  const used = new Set();
  const out = {};
  for (const job of JOBS) {
    const hex = blueprint.stations.find((s) => s.id === job).hex;
    const best = blueprint.deployment.filter((d) => !used.has(d)).sort((a, b) => hexDistance(a, hex) - hexDistance(b, hex))[0];
    used.add(best);
    out[assignment[job]] = best;
  }
  return out;
}

function verifyTrace(state, extra) {
  const record = exportRunRecord(state);
  const replay = replayRun(JSON.parse(JSON.stringify(record)), { recordHashes: true });
  if (!replay.ok || replay.state.status !== "won" || replay.state.round > state.blueprint.deadline) return null;
  return { ...extra, initialRun: record.initialRun, commands: record.commands, perCommandHashes: replay.hashes, finalStateHash: record.finalStateHash, rounds: replay.state.round, commandCount: record.commands.length };
}

export function planOrchardBlueprint({ blueprint, teamChoices, planFamily = "direct-guard", maxStates = 250000, beamWidth = 120, avoidOutputChoices = [], profiles = null, onRound = null }) {
  const metrics = { planner: "orchard-v2-tactical-planner/1", planFamily, statesSpent: 0, maxStates, perTeam: [], beamWidth };
  if (!PLAN_FAMILIES.includes(planFamily)) return { status: "unknown", traces: [], metrics, reasonCode: "unknown-plan-family" };
  let budget;
  try { budget = new Budget(maxStates); } catch { return { status: "unknown", traces: [], metrics, reasonCode: "invalid-budget" }; }
  const traces = [];
  let allStatic = teamChoices.length > 0;
  for (const [teamIndex, team] of teamChoices.entries()) {
    const info = { teamIndex, cardIds: team.cardIds, status: "unknown" };
    metrics.perTeam.push(info);
    const assignments = feasibleJobAssignments(blueprint, team.cardIds, planFamily, profiles || orchardRosterProfiles());
    if (!assignments.length) { info.status = "unsatisfiable"; info.reasonCode = "stat-infeasible"; continue; }
    allStatic = false;
    const choices = outputChoices(blueprint).filter((c) => !avoidOutputChoices.some((a) => JSON.stringify(a) === JSON.stringify(c)));
    let found = null;
    const widths = [3, 8, 24, beamWidth].filter((w, i, all) => w <= beamWidth && all.indexOf(w) === i);
    outer: for (const width of widths) {
      for (const assignment of assignments) {
        const deployments = team.deploymentAssignment ? [team.deploymentAssignment] : [nearestDeploymentAssignment(blueprint, assignment), null];
        for (const deploymentAssignment of deployments) {
          for (const outputs of choices) {
            for (const committer of [assignment.number, assignment.shape, assignment.sustain]) {
              if (budget.exhausted) break outer;
              let initial;
              try {
                initial = createRun({ blueprint, cardIds: team.cardIds, runId: `plan:${blueprint.familyId}:${blueprint.tier}:${blueprint.seed}:${teamIndex}:${planFamily}`, deploymentAssignment, profiles });
              } catch (error) { info.reasonCode = "create-failed"; info.message = String(error.message); break outer; }
              const plan = { assignment, outputs, committer, planFamily, heroOrder: [committer, ...team.cardIds.filter((id) => id !== committer)] };
              const won = searchPlan(budget, initial, plan, width, onRound);
              if (won) {
                const trace = verifyTrace(won, { teamIndex, cardIds: team.cardIds, planFamily, assignment, outputChoice: outputs, committer, beamWidth: width });
                if (trace) { found = trace; break outer; }
              }
            }
          }
        }
      }
    }
    if (found) { traces.push(found); info.status = "success"; info.commandCount = found.commandCount; info.rounds = found.rounds; }
    else info.reasonCode = budget.exhausted ? "budget-exhausted" : "no-plan-found";
  }
  metrics.statesSpent = budget.used;
  if (traces.length === teamChoices.length && traces.length) return { status: "success", traces, metrics };
  if (allStatic) return { status: "unsatisfiable", traces, metrics, reasonCode: "stat-infeasible" };
  return { status: "unknown", traces, metrics, reasonCode: budget.exhausted ? "budget-exhausted" : traces.length ? "partial" : "no-plan-found" };
}

export default planOrchardBlueprint;

export function planOrchardContinuation({state,planFamily='direct-guard',maxStates=12000,beamWidth=24}) {
  const budget=new Budget(maxStates),traces=[];
  for(const width of [3,8,beamWidth])for(const assignment of feasibleJobAssignments(state.blueprint,state.heroes.map(h=>h.id),planFamily,state.profiles))for(const outputs of outputChoices(state.blueprint))for(const committer of state.heroes.map(h=>h.id)){
    if(budget.exhausted)return {status:'unknown',traces,statesSpent:budget.used,reasonCode:'budget-exhausted'};
    const plan={assignment,outputs,committer,planFamily,heroOrder:[committer,...state.heroes.map(h=>h.id).filter(id=>id!==committer)]};
    const won=searchPlan(budget,state,plan,width);
    if(won){const trace=verifyTrace(won,{planFamily,assignment,outputChoice:outputs,committer,retainedCommands:state.log.length});if(trace)return {status:'success',traces:[trace],statesSpent:budget.used};}
  }
  return {status:'unknown',traces,statesSpent:budget.used,reasonCode:'no-plan-found'};
}
