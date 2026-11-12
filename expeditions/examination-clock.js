// Gifford, level 1: The Examination Clock (EXPEDITIONS_BUILD_BRIEF.md §14,
// EXPEDITIONS_SPEC.md §18-19). First E4 proof map for the Gifford tier.
//
// Simplification note: the full brief imagines three stations processing four tasks in
// sequence, with idle time between them. This engine has no notion of a hex holding more
// than one object at a time, so a literal "three shared stations" model would need a
// process-then-clear mechanism that does not exist yet. This proof map instead gives each
// task its own station bay (four bays, not three), keeping the real mechanic intact — an
// "optimise" objective where the delivered tasks' summed duration must not exceed the
// deadline (§16 Efficiency) — without inventing hex multi-occupancy. A true shared-station
// model can follow once that mechanism exists.
//
// Mechanic rebuild (2026-09-21, alongside Cider Run/Hollow Bough — see cider-run.js's header
// for the full "Sam's playtest" context). The original four tasks summed to exactly 12, the
// deadline itself, and requiredCount also equalled 4 — every task was mandatory, so there was
// no decision at all: pick each one up, carry it to its own dedicated bay, done (confirmed by
// scripts/simulate_examination_clock.mjs's old trace: four heroes, four fixed lanes, no
// coordination needed). Now six tasks exist but requiredCount stays 4 — "any four, not all
// six" — and only some 4-of-6 combinations actually clear the deadline, so which four to
// commit to is a genuine choice, not a formality. The two new, more valuable tasks
// (task_e/task_f) sit off toward the Proctors' side of the board rather than in the safe
// column with the rest, so skipping them is a real, physically motivated decision (Reach and
// Threat working together), not just an arithmetic trap with no board-level reason behind it.
import { createExpeditionState, endPlayerPhase, evaluateObjective, hexDistance, interactObject, moveUnit, reachableHexes, resolveEnemyPhase } from "./expedition-engine.js";

function radiusBoard(radius) {
  const hexes = [];
  for (let q = -radius; q <= radius; q += 1) {
    const minR = Math.max(-radius, -q - radius);
    const maxR = Math.min(radius, -q + radius);
    for (let r = minR; r <= maxR; r += 1) hexes.push({ q, r, terrain: "clear" });
  }
  return hexes;
}

export const EXAMINATION_CLOCK_CONFIG = {
  id: "gf_examination_clock",
  moduleKey: "intermediate",
  title: "The Examination Clock",
  turnLimit: 5,
  board: radiusBoard(3),
  units: [],
  enemies: [
    { id: "proctor_a", name: "Proctor Weft", hp: 3, maxHp: 3, defence: 6, move: 1, range: 1, damage: 1, initiative: 6, pos: "3,-2", delay: 1, intent: "Advance on the nearest hero and block the station." },
    { id: "proctor_b", name: "Proctor Sill", hp: 3, maxHp: 3, defence: 6, move: 1, range: 1, damage: 1, initiative: 8, pos: "3,-3", delay: 1, intent: "Advance on the nearest hero and block the station." },
  ],
  objects: [
    { id: "task_a", kind: "task", value: 1, pos: "-1,0" },
    { id: "task_b", kind: "task", value: 2, pos: "-1,1" },
    { id: "task_c", kind: "task", value: 3, pos: "-1,2" },
    { id: "task_d", kind: "task", value: 4, pos: "-1,3" },
    // Two extra, more valuable tasks off toward the Proctors' side (2026-09-21 rebuild) —
    // tempting on paper, but only worth the detour if the arithmetic (and the risk) actually
    // works out. Neither is required; requiredCount is 4 of these 6, not all 6.
    { id: "task_e", kind: "task", value: 5, pos: "1,-2" },
    { id: "task_f", kind: "task", value: 6, pos: "2,-3" },
  ],
  objective: {
    family: "optimise",
    destinationHexes: ["2,0", "2,1", "1,2", "0,3"],
    requiredCount: 4,
    target: 12,
  },
  flags: {
    briefing: "Deliver any four of the six tasks to the station bays before the twelfth bell — the combined processing time of whichever four you choose must not pass 12.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Number (which 4-of-6
    // combination actually clears 12 — most don't) and Reach (the two priciest tasks sit off
    // toward the Proctors, a real detour, not just a bigger number) and Threat (the Proctors
    // deal real damage once their delay lapses — the default engine behaviour, no custom
    // scripting needed).
    pressureLanes: ["number", "reach", "threat"],
    heroChain: "The squad reads which four of the six tasks fit under the deadline before committing, Speed reaches the distant ones if they're worth it, Guard screens a carrier from the Proctors.",
    alternateChain: "Without pre-planning: deliver the four cheapest, closest tasks and leave the two distant ones alone entirely — always available, always safe, never the only option.",
  },
};

// Shared delivery simulator, same discipline as Cider Run's deliverCertifiedPair and Unequal
// Crossing's own greedy walker: a simple but real strategy (assigns each named task to one of
// the four carriers in order, walks/collects/drops using the real engine) plays out delivering
// exactly the given task ids to the four station bays — used to prove more than one 4-of-6
// combination genuinely wins, not just sums correctly on paper. Exported so tests and
// scripts/simulate_examination_clock.mjs share one implementation rather than each
// hand-transcribing hex sequences that would go stale the moment a task's position changed.
export function deliverTasks(state, taskIds, roundBudget) {
  const stations = state.objective.destinationHexes;
  const carriers = Object.values(state.units).filter((unit) => unit.side === "player").map((unit) => unit.id);
  function walkTo(targetHex, unitId) {
    for (let guard = 0; guard < 20; guard += 1) {
      if (state.units[unitId].ap <= 0 || state.status !== "playing") return false;
      if (hexDistance(state.units[unitId].pos, targetHex) <= 1) return true;
      const options = reachableHexes(state, unitId);
      if (!options.length) return false;
      let best = options[0];
      for (const opt of options) if (hexDistance(opt.key, targetHex) < hexDistance(best.key, targetHex)) best = opt;
      if (hexDistance(best.key, targetHex) >= hexDistance(state.units[unitId].pos, targetHex)) return false;
      state = moveUnit(state, unitId, best.key);
    }
    return hexDistance(state.units[unitId].pos, targetHex) <= 1;
  }
  function runCarrier(unitId, taskId, stationHex) {
    for (let guard = 0; guard < 20; guard += 1) {
      if (state.objects[taskId].pos === stationHex || state.units[unitId].ap <= 0 || state.status !== "playing") return;
      const unit = state.units[unitId];
      if (!unit.carrying) {
        const task = state.objects[taskId];
        if (hexDistance(unit.pos, task.pos) <= 1) { state = interactObject(state, unitId, taskId); continue; }
        if (!walkTo(task.pos, unitId)) return;
      } else {
        if (hexDistance(unit.pos, stationHex) <= 1) { state = interactObject(state, unitId, taskId, stationHex); return; }
        if (!walkTo(stationHex, unitId)) return;
      }
    }
  }
  for (let round = 1; round <= roundBudget && state.status === "playing"; round += 1) {
    taskIds.forEach((taskId, index) => runCarrier(carriers[index], taskId, stations[index]));
    if (evaluateObjective(state).complete) return { success: true, state };
    state = resolveEnemyPhase(endPlayerPhase(state));
  }
  return { success: evaluateObjective(state).complete, state };
}

export function createExaminationClock(squad) {
  if (!Array.isArray(squad) || squad.length !== 4) throw new Error("The Examination Clock requires exactly four heroes");
  const starts = ["-3,0", "-3,1", "-3,2", "-3,3"];
  return createExpeditionState({
    ...EXAMINATION_CLOCK_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
