// Ninefold Orchard, level 2: The Cider Run (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5).
// Replaces The Counting Orchard at level 2 per the master brief's conflict rule and Sam's
// explicit "new build" instruction (2026-09-17) — a different mechanic (rising values, not a
// static basket set), not a reskin. counting-orchard.js/.test.js and
// scripts/simulate_counting_orchard.mjs are left in place, real and tested, just removed from
// the catalogue and from expedition-data.js's ten-level list; nothing here deletes that work.
//
// Same generic exactSum family as before — six presses on three lanes (two per lane), carry
// any two onto the press gate so their values total the printed target. What is genuinely new:
// the six values and the target are drawn fresh every embark (generateExactPairKernel,
// expedition-kernels.js) instead of Counting Orchard's one hand-authored set, and Scruffcrow —
// the exact same character, re-themed rather than replaced, so this needs no new art — now
// raises a lane's highest unguarded press by one each active round ("flood-lane",
// expedition-engine.js) instead of lowering it. Arithmetic's Combine/Split remain the
// "Arithmetic changes a press value" alternate route the brief names, unchanged from Counting
// Orchard's own use of them.
//
// Delay tightened from 2 to 1 (2026-09-18, Sam: Cider Run "reads like Counting Orchard with
// different props"): with a two-round delay, the flood's first action landed on round 3, but the
// certified reference solve — and any player who plays it just as efficiently — already finishes
// by round 2, so the mechanism this map is actually named for could never be seen or felt in
// normal play. With delay 1 the flood's first real action lands on round 2, the same round the
// fastest possible solve completes. isPhysicallyDeliverable below computes its safe window from
// where the solution pair actually sits, not the flat delay: a layout is only accepted if the
// fixed, unmodified solution pair reaches the gate before Scruffcrow's rotation would first
// threaten one of its two lanes.
//
// Board reshaped (2026-09-18, per the Claude/Codex handover exchange in
// EXPEDITIONS_CLAUDE_HANDOVER.md — "Sam, to both Claude and Codex" and Codex's reply): the old
// board was geometrically identical to Counting Orchard, three mirrored column-pairs equidistant
// from a shared gate — genuinely different mechanic, but a board that read the same. Now three
// spokes radiate from the gate at 120°, each with a near press and a far press at different
// travel distances (1/2, 2/3 and 3/4 hexes from the gate) — real, asymmetric "reach" tradeoffs
// Counting Orchard's symmetric layout never had. The gate itself is now two genuinely *adjacent*
// hexes (Codex's harvest-gate art is a symmetric two-hex-span asset; the old gate hexes were two
// apart with an empty hex between them, which the art was never actually built for). `flags.
// pathHexes` names every press hex as an explicit data field for the renderer's terrain dressing
// to consume, replacing ExpeditionBoard.jsx's old `q === -2/0/2` column inference (Codex: "the
// renderer should consume [data] fields rather than infer columns").
import { createExpeditionState, endPlayerPhase, evaluateObjective, hexDistance, interactObject, moveUnit, reachableHexes, resolveEnemyPhase } from "./expedition-engine.js";
import { createExpeditionRandom } from "./expedition-random.js";
import { generateExactPairKernel } from "./expedition-kernels.js";
import { expeditionRoster } from "./expedition-roster.js";

function radiusBoard(radius) {
  const hexes = [];
  for (let q = -radius; q <= radius; q += 1) {
    const minR = Math.max(-radius, -q - radius);
    const maxR = Math.min(radius, -q + radius);
    for (let r = minR; r <= maxR; r += 1) hexes.push({ q, r, terrain: "clear" });
  }
  return hexes;
}

// Six fixed press hexes, two per lane — a near and a far press on each of three 120°-spaced
// spokes radiating from the gate (see the header comment above), so each lane now has a real,
// distinct travel cost rather than Counting Orchard's mirrored, equidistant pairs. Only which
// value (and so which lane) each hex holds varies per seed, not the geometry itself.
const PRESS_HEXES = [
  { pos: "2,0", lane: 1 }, { pos: "3,0", lane: 1 },
  { pos: "0,-2", lane: 2 }, { pos: "0,-3", lane: 2 },
  { pos: "-2,2", lane: 3 }, { pos: "-3,3", lane: 3 },
];

// Squad start hexes: clustered near the gate hub, none on a gate or press hex, one shared
// constant so the certifier and the real createCiderRun can never silently drift apart.
const SQUAD_STARTS = ["0,0", "-1,0", "0,-1"];

export const CIDER_RUN_CONFIG = {
  id: "po_cider_run",
  moduleKey: "primary",
  title: "The Cider Run",
  turnLimit: 4,
  board: radiusBoard(3),
  units: [],
  enemies: [
    {
      id: "scruffcrow",
      name: "Scruffcrow",
      hp: 2,
      maxHp: 2,
      defence: 4,
      move: 1,
      range: 1,
      damage: 1,
      initiative: 6,
      pos: "3,-3",
      delay: 1,
      behaviour: "flood-lane",
      // [3, 1, 2], not [1, 2, 3]: the lane index is `(turn - 1) % length`, which keeps
      // advancing through the delayed turns even though Scruffcrow only watches during them
      // (peck-lane, Counting Orchard's identical mechanism, has the same property — it just
      // never mattered there since that map's delay was 0). With delay 1, the first turn
      // Scruffcrow actually acts is turn 2, index (2-1)%3 = 1 — rotated so that index lands on
      // lane 1 first, then lane 2, then lane 3, the intuitive reading order.
      laneSequence: [3, 1, 2],
      laneMarkers: { 1: "3,-3", 2: "3,-2", 3: "3,-1" },
      intent: "Advance to the next lane and let its highest unguarded press rise by one, flooded by the rolling cider.",
    },
  ],
  objects: [],
  objective: {
    family: "exactSum",
    hexes: ["1,-1", "1,0"], // genuinely adjacent (Codex's harvest-gate art is a two-hex-span asset)
    target: 12,
  },
  flags: {
    briefing: "Fill the press gate with two presses worth exactly the printed total, before the cider floods your plan.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Number (finding the
    // one exact pair, or making one with Combine), Change (the flood is one-directional and
    // permanent once it starts — nothing lowers a flooded press back down) and now Reach too
    // (each lane's near/far presses sit at genuinely different travel costs from the gate).
    pressureLanes: ["number", "change", "reach"],
    // Every press hex, for the renderer's terrain dressing (ExpeditionBoard.jsx's nfoTerrainArt)
    // to consume directly instead of inferring "path" tiles from hex-column arithmetic that
    // assumed the old, since-replaced layout.
    pathHexes: PRESS_HEXES.map((hex) => hex.pos),
    heroChain: "Arithmetic combines two near-miss presses into the exact pair the gate needs, Speed delivers it before Scruffcrow's one-round delay ends.",
    alternateChain: "Without a combiner: any two presses that already sum correctly can simply be carried and guarded until both are dropped, no exact identity required.",
  },
};

// Shared delivery simulator: a simple but real greedy strategy (nearest free hero to each
// press) plays out delivering exactly the two named presses to the two gate hexes, for up to
// `roundBudget` more rounds from whatever `state` it's handed — used by both
// isPhysicallyDeliverable (the fast, from-the-start case) and
// isRecoverableAfterOneFloodTick (the delayed, after-a-flood-tick case) below, so the two
// certifiers can never quietly drift out of sync on how a real party actually moves.
function deliverPair(state, firstId, secondId, roundBudget) {
  const gateHexes = CIDER_RUN_CONFIG.objective.hexes;
  function walkTo(unitId, targetHex) {
    for (let guard = 0; guard < 15; guard += 1) {
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
  // The gate is two separate, adjacent one-slot hexes — each solution press needs its own.
  function runCarrier(unitId, cargoId, gateHex) {
    for (let guard = 0; guard < 15; guard += 1) {
      if (state.objects[cargoId].pos === gateHex || state.units[unitId].ap <= 0 || state.status !== "playing") return;
      const unit = state.units[unitId];
      if (!unit.carrying) {
        const cargo = state.objects[cargoId];
        if (hexDistance(unit.pos, cargo.pos) <= 1) { state = interactObject(state, unitId, cargoId); continue; }
        if (!walkTo(unitId, cargo.pos)) return;
      } else {
        if (hexDistance(unit.pos, gateHex) <= 1) { state = interactObject(state, unitId, cargoId, gateHex); return; }
        if (!walkTo(unitId, gateHex)) return;
      }
    }
  }

  const positions = Object.fromEntries(Object.values(state.units).filter((unit) => unit.side === "player").map((unit) => [unit.id, unit.pos]));
  const carriers = [firstId, secondId].map((cargoId) => {
    const cargo = state.objects[cargoId];
    return Object.keys(positions).sort((a, b) => hexDistance(positions[a], cargo.pos) - hexDistance(positions[b], cargo.pos))[0];
  });
  for (let round = 1; round <= roundBudget && state.status === "playing"; round += 1) {
    runCarrier(carriers[0], firstId, gateHexes[0]);
    runCarrier(carriers[1], secondId, gateHexes[1]);
    if (evaluateObjective(state).complete) return true;
    state = resolveEnemyPhase(endPlayerPhase(state));
  }
  return evaluateObjective(state).complete;
}

function freshCiderRunState(presses, target) {
  const roster = expeditionRoster("primary");
  const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
  return createExpeditionState({
    ...CIDER_RUN_CONFIG,
    objects: presses,
    objective: { ...CIDER_RUN_CONFIG.objective, target },
    units: squad.map((profile, index) => ({ ...profile, pos: SQUAD_STARTS[index] })),
  });
}

// The round Scruffcrow's rotation would first reach `lane`, given the enemy's own delay and
// laneSequence — shared by the certifier below and by nothing else, so it can't drift from the
// actual engine behaviour it's predicting.
function firstFloodRound(enemy, lane) {
  let round = enemy.delay;
  while (enemy.laneSequence[round % enemy.laneSequence.length] !== lane) round += 1;
  return round + 1;
}

// Physical feasibility certifier (Unequal Crossing's isPhysicallyDeliverable, same discipline):
// the kernel's uniqueness guarantee is purely arithmetic — it knows nothing about hex
// distances or when Scruffcrow's flood actually threatens the solution pair's own lanes. This
// actually plays the solution pair out with the real loan squad and the real engine before
// accepting a layout.
//
// The safe window is no longer a flat `delay` — it's computed per layout, from the first round
// Scruffcrow's rotation reaches a lane either solution press sits on (that press could be
// touched from that round's enemy phase onward). A layout is only certified if the fixed,
// unmodified solution pair reaches the gate no later than that round's player phase. This is
// deliberately strict about the one pair the kernel guarantees is unique, matching Unequal
// Crossing's "no unannounced impossible state" discipline — a layout the naive certifier can't
// clear this fast is rejected and a fresh one drawn, so a human playing at the certifier's own
// pace never has the flood invalidate the printed target's only pairing out from under them.
function isPhysicallyDeliverable(presses, solutionIds, target) {
  const state = freshCiderRunState(presses, target);
  const [firstId, secondId] = solutionIds;
  const enemy = CIDER_RUN_CONFIG.enemies[0];
  const solutionLanes = [presses.find((p) => p.id === firstId).lane, presses.find((p) => p.id === secondId).lane];
  const safeRounds = Math.min(...solutionLanes.map((lane) => firstFloodRound(enemy, lane)));
  return deliverPair(state, firstId, secondId, safeRounds);
}

// A layout can be certified deliverable at speed (isPhysicallyDeliverable) and still leave a
// slower, normal-paced party with no way out at all — found 2026-09-18 while trying to prove
// Codex's "a normal player can recognise the threatened lane and recover" for a test: the
// original geometry-redesign reference layout had a solution press that was also its lane's
// highest unguarded value, so one un-recovered flood tick against it left no direct pair AND no
// single Combine that could still reach the target — a genuine "lost forever" dead run, the
// same failure shape Sam flagged for Unequal Crossing's Hookmoles, just arrived at by a
// different mechanic. This checks it structurally at generation time rather than trusting luck:
// for each solution press that is currently its own lane's highest-unguarded value (the one a
// flood would actually hit first, in the ordinary case where nobody has specifically
// rearranged that lane), simulate one flood tick against it, then require BOTH that a fresh
// direct pair exists among the resulting six values (arithmetic alone isn't enough — see
// below) AND that a real party can still physically deliver it inside the rounds Scruffcrow's
// flood left behind (deliverPair, the same simulator isPhysicallyDeliverable uses). A press on
// the lane Scruffcrow's rotation visits last is rejected immediately: by the time it floods
// there are zero rounds left at all, so no amount of physical feasibility could ever save it.
// A Combine-based recovery is deliberately not credited here even when arithmetically possible
// — proving it needs an Arithmetic hero specifically positioned and free that round, which this
// generation-time certifier doesn't model, so crediting it would risk certifying a layout whose
// only real escape needs a squad choice or a lucky position the game never guarantees.
function isRecoverableAfterOneFloodTick(presses, solutionIds, target) {
  const highestOnLane = {};
  for (const press of presses) {
    const current = highestOnLane[press.lane];
    if (!current || press.value > current.value) highestOnLane[press.lane] = press;
  }
  const enemy = CIDER_RUN_CONFIG.enemies[0];
  const vulnerable = solutionIds.filter((id) => highestOnLane[presses.find((p) => p.id === id).lane].id === id);
  for (const victimId of vulnerable) {
    const floodRound = firstFloodRound(enemy, presses.find((p) => p.id === victimId).lane);
    const recoveryWindow = CIDER_RUN_CONFIG.turnLimit - floodRound;
    if (recoveryWindow < 1) return false; // the last-visited lane: no rounds left once it floods

    const values = Object.fromEntries(presses.map((p) => [p.id, p.value]));
    values[victimId] += 1;
    const ids = Object.keys(values);
    let freshPair = null;
    for (let i = 0; i < ids.length && !freshPair; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        if (values[ids[i]] + values[ids[j]] === target) { freshPair = [ids[i], ids[j]]; break; }
      }
    }
    if (!freshPair) return false;

    // Simulate the realistic worst case this check is guarding against: the party does nothing
    // productive anywhere on the board while waiting for the flood tick to land (idling is the
    // only way to guarantee the victim press is still unguarded when it needs to flood), then
    // must deliver the fresh pair from a standing start in whatever rounds remain.
    let state = freshCiderRunState(presses, target);
    for (let round = 1; round <= floodRound && state.status === "playing"; round += 1) state = resolveEnemyPhase(endPlayerPhase(state));
    if (state.objects[victimId].value !== values[victimId]) return false; // sanity: the predicted press didn't actually flood as expected
    if (!deliverPair(state, freshPair[0], freshPair[1], recoveryWindow)) return false;
  }
  return true;
}

export function generateCiderRunLayout(seed) {
  const rng = createExpeditionRandom(seed);
  for (let outer = 0; outer < 500; outer += 1) {
    const candidate = generateExactPairKernel(rng, { count: 6, valueMin: 2, valueMax: 12, targetMin: 9, targetMax: 16, maxAttempts: 1 });
    if (!candidate) continue;
    const order = rng.shuffle(candidate.values);
    const presses = order.map((value, index) => ({ id: `press_${value}`, kind: "press", value, pos: PRESS_HEXES[index].pos, lane: PRESS_HEXES[index].lane }));
    const solutionIds = candidate.solution.map((value) => `press_${value}`);
    if (!isPhysicallyDeliverable(presses, solutionIds, candidate.target)) continue;
    if (!isRecoverableAfterOneFloodTick(presses, solutionIds, candidate.target)) continue;
    return { target: candidate.target, presses };
  }
  throw new Error(`Could not generate a physically solvable Cider Run layout from seed ${seed}`);
}

export const REFERENCE_LAYOUT_SEED = "po_cider_run-ref-2026-09-17";

export function createCiderRun(squad, seed = REFERENCE_LAYOUT_SEED) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Cider Run requires exactly three heroes");
  const layout = generateCiderRunLayout(seed);
  return createExpeditionState({
    ...CIDER_RUN_CONFIG,
    objects: layout.presses,
    objective: { ...CIDER_RUN_CONFIG.objective, target: layout.target },
    units: squad.map((profile, index) => ({ ...profile, pos: SQUAD_STARTS[index] })),
  });
}
