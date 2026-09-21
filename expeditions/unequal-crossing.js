import { createExpeditionState, endPlayerPhase, evaluateObjective, hexDistance, interactObject, moveUnit, reachableHexes, resolveEnemyPhase, strikeEnemy } from "./expedition-engine.js";
import { createExpeditionRandom } from "./expedition-random.js";
import { generateEqualPartitionKernel } from "./expedition-kernels.js";
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

// Scale redesign (2026-09-16, EXPEDITIONS_CLAUDE_HANDOVER.md "Approved scale redesign: one
// impassable hex per scale"): each platform is now a single impassable hex holding a brass
// scale prop, not a pair of ordinary walkable cells. A hero places a load onto it from any of
// its six neighbours (interactObject's existing adjacent-drop rule already supports this — it
// never required standing on the destination) and never enters the hex itself, enforced by
// giving it `terrain: "blocked"` (the same movement-blocking terrain already used for the
// hedges elsewhere on this board). `stackLimit: 2` (expedition-engine.js's interactObject) lets
// both loads for a 2+5 or 3+4 pair sit on the one scale hex together — previously each platform
// needed two separate cells because a hex could only ever hold one object. The old second
// cells (`-2,2`/`2,0`) are no longer part of the objective, but stay ordinary passable ground;
// Bramble still starts on `-2,2`, right beside the west scale.
export const UNEQUAL_CROSSING_CONFIG = {
  id: "po_unequal_crossing",
  moduleKey: "primary",
  title: "The Unequal Crossing",
  turnLimit: 4,
  board: radiusBoard(3).map((hex) => {
    const key = `${hex.q},${hex.r}`;
    if (["-1,-2", "0,-3", "1,-3"].includes(key)) return { ...hex, terrain: "blocked" };
    if (["-1,2", "0,2"].includes(key)) return { ...hex, terrain: "difficult" };
    if (["-2,1", "2,-1"].includes(key)) return { ...hex, terrain: "blocked", stackLimit: 2 };
    return hex;
  }),
  units: [],
  enemies: [
    // Redesigned (2026-09-17, Sam's live playtest): a Hookmole now genuinely carries whatever
    // it steals and holds it until defeated — no more "walk to the burrow and pick it back
    // up" detour. delay tightened from 2 to 1 to match: the old delay meant a fast, competent
    // solve could finish before a Hookmole ever got a single turn, making the whole threat
    // invisible in practice, not just avoidable.
    { id: "hookmole_a", name: "Nib", hp: 2, maxHp: 2, defence: 4, move: 1, range: 1, damage: 1, initiative: 6, pos: "3,-3", behaviour: "steal-highest", delay: 1, intent: "Steal the heaviest unguarded load and hold it — defeat me to get it back." },
    { id: "hookmole_b", name: "Notch", hp: 2, maxHp: 2, defence: 4, move: 1, range: 1, damage: 1, initiative: 8, pos: "3,0", behaviour: "steal-highest", delay: 1, intent: "Steal the heaviest unguarded load and hold it — defeat me to get it back." },
  ],
  objects: [
    { id: "crate_2", name: "Two-crate", kind: "load", value: 2, pos: "-1,1" },
    { id: "crate_3", name: "Three-crate", kind: "load", value: 3, pos: "0,1" },
    { id: "crate_4", name: "Four-crate", kind: "load", value: 4, pos: "1,0" },
    { id: "crate_5", name: "Five-crate", kind: "load", value: 5, pos: "1,-1" },
  ],
  objective: {
    family: "balance",
    leftHexes: ["-2,1"],
    rightHexes: ["2,-1"],
    exitHex: "3,-1",
    target: 7,
  },
  flags: {
    briefing: "Place seven weight on each brass scale, then send one hero through the tally arch.",
    // §7's "definition of a completed scenario brief" (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md)
    // — light rework only, no mechanic changed. Pressure lanes: Number (the equal-split
    // partition itself) and Reach (Speed shortens the round trip to a distant scale). Threat
    // (the Hookmoles) is present but stays secondary, matching §5's own "supported strike is
    // optional" — an early map keeps to two named lanes, per §2.
    pressureLanes: ["number", "reach"],
    heroChain: "Speed relays a crate to its scale, Guard protects it from a Hookmole, the exact split balances both platforms.",
    alternateChain: "Without a fast carrier: any hero may still deliver on foot, and a struck load can be re-guarded next round instead of relayed — no single card identity is required.",
  },
};

// Crate starting hexes a generated layout may draw from: every one is a "clear" tile away
// from the two scales, the exit arch, the squad's own starts and the Hookmoles — swept from
// the board definition above by exclusion, not hand-picked, so this list can never silently
// drift out of sync with a future board edit.
const CRATE_HEX_POOL = UNEQUAL_CROSSING_CONFIG.board
  .map((hex) => `${hex.q},${hex.r}`)
  .filter((key) => {
    const [q, r] = key.split(",").map(Number);
    if (Math.abs(q) + Math.abs(r) + Math.abs(q + r) > 4) return false; // keep crates near the middle, not off at the board's edge
    const tile = UNEQUAL_CROSSING_CONFIG.board.find((hex) => `${hex.q},${hex.r}` === key);
    if (tile.terrain !== "clear") return false;
    return !["-3,1", "-2,2", "-2,0", "3,-3", "3,0", "3,-1"].includes(key);
  });

// Procedural generation (2026-09-17): every embark now derives a genuinely different, freshly
// verified-solvable set of four crate values and starting hexes from a seed, using the same
// generateEqualPartitionKernel already built for exactly this ("balance") family — it rejects
// any draw whose only equal split isn't unique, so the puzzle can never come out ambiguous or
// impossible. Constrained here to a 2-vs-2 split specifically (this map's two scales each
// hold exactly two loads); the kernel itself doesn't know or care about physical grouping
// size, so a thin retry loop on top asks for another draw from the same seeded stream until
// one lands 2-vs-2. `deriveExpeditionSeed`/attempt tracking (persisting which seed was played)
// is not wired up yet — that is the still-outstanding "seed/version storage" piece of the
// procedural-generation framework — so for now the catalogue simply seeds each embark from
// the current time (see expedition-catalogue.js); passing an explicit seed here always
// reproduces the same layout, which is what the locked reference trace below still relies on.
// Physical feasibility certifier: the equal-partition kernel only guarantees the *arithmetic*
// is fair (a unique split) — it knows nothing about hex distances, the turn limit, or the
// Hookmoles. A layout that is mathematically fine can still fail to fit turnLimit rounds once
// crates land far from both scales. Rather than trust the maths alone, every candidate layout
// is played out here by a simple but real greedy strategy (nearest free hero to each crate,
// load-balanced) using the actual loan squad and the actual engine — exactly the "no
// unannounced impossible state" guarantee every other scenario this session earned by
// simulation, not assumption. A layout that this greedy strategy cannot clear is rejected and
// a fresh one is drawn from the same seeded stream; a human player who plays better than this
// deliberately simple heuristic only has an easier time, never a harder one.
function isPhysicallyDeliverable(crates, target) {
  const roster = expeditionRoster("primary");
  const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
  const starts = ["-3,1", "-2,2", "-2,0"];
  let state = createExpeditionState({
    ...UNEQUAL_CROSSING_CONFIG,
    objects: crates,
    objective: { ...UNEQUAL_CROSSING_CONFIG.objective, target },
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });

  let westCrates = null;
  const crateList = Object.values(state.objects);
  for (let mask = 1; mask < 2 ** crateList.length - 1; mask += 1) {
    const chosen = crateList.filter((_, i) => mask & (1 << i));
    if (chosen.length === 2 && chosen.reduce((sum, c) => sum + c.value, 0) === target) { westCrates = chosen; break; }
  }
  if (!westCrates) return false;
  const eastCrates = crateList.filter((c) => !westCrates.includes(c));

  const west = "-2,1", east = "2,-1", exit = "3,-1";
  const delivered = new Set();
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
  function runCarrier(unitId, cargoId, scaleHex) {
    for (let guard = 0; guard < 15; guard += 1) {
      if (delivered.has(cargoId) || state.units[unitId].ap <= 0 || state.status !== "playing") return;
      const unit = state.units[unitId];
      if (!unit.carrying) {
        const cargo = state.objects[cargoId];
        // Stolen, not merely uncollected: a Hookmole is holding it (`pos: null`, same
        // convention a hero's own carrying uses). Recovering it now genuinely needs combat —
        // fight to the thief before resuming the delivery, exactly what a real player would
        // have to do, not a shortcut the certifier gets that play doesn't.
        if (!cargo.pos) {
          const thief = Object.values(state.units).find((u) => u.side === "enemy" && u.carrying === cargoId);
          if (!thief || thief.hp <= 0) return; // dropped already or no longer held — nothing to chase
          if (hexDistance(unit.pos, thief.pos) <= (unit.range || 1)) { state = strikeEnemy(state, unitId, thief.id); continue; }
          if (!walkTo(unitId, thief.pos)) return;
          continue;
        }
        if (hexDistance(unit.pos, cargo.pos) <= 1) { state = interactObject(state, unitId, cargoId); continue; }
        if (!walkTo(unitId, cargo.pos)) return;
      } else {
        if (hexDistance(unit.pos, scaleHex) <= 1) { state = interactObject(state, unitId, cargoId, scaleHex); delivered.add(cargoId); return; }
        if (!walkTo(unitId, scaleHex)) return;
      }
    }
  }

  const crateJobs = [...westCrates.map((c) => [c, west]), ...eastCrates.map((c) => [c, east])];
  const load = { pip: 0, bramble: 0, nine: 0 };
  const jobs = crateJobs.map(([crate, scaleHex]) => {
    const positions = { pip: state.units.pip.pos, bramble: state.units.bramble.pos, nine: state.units.nine.pos };
    const carrierId = Object.keys(positions).sort((a, b) => (hexDistance(positions[a], crate.pos) + load[a] * 3) - (hexDistance(positions[b], crate.pos) + load[b] * 3))[0];
    load[carrierId] += 1;
    return [crate.id, scaleHex, carrierId];
  });

  for (let round = 1; round <= UNEQUAL_CROSSING_CONFIG.turnLimit && state.status === "playing"; round += 1) {
    for (const [cargoId, scaleHex, carrierId] of jobs) {
      if (state.units[carrierId].carrying && state.units[carrierId].carrying !== cargoId) continue;
      runCarrier(carrierId, cargoId, scaleHex);
    }
    const objective = evaluateObjective(state);
    if (objective.sides.left.status === "balanced" && objective.sides.right.status === "balanced") {
      for (const id of ["pip", "bramble", "nine"]) {
        if (state.units[id].ap > 0) { walkTo(id, exit); if (hexDistance(state.units[id].pos, exit) === 0) break; }
      }
    }
    if (evaluateObjective(state).complete) return true;
    state = resolveEnemyPhase(endPlayerPhase(state));
  }
  return evaluateObjective(state).complete;
}

export function generateUnequalCrossingLayout(seed) {
  const rng = createExpeditionRandom(seed);
  for (let outer = 0; outer < 500; outer += 1) {
    const candidate = generateEqualPartitionKernel(rng, { count: 4, valueMin: 2, valueMax: 14, maxAttempts: 1 });
    if (!candidate || candidate.solution.left.length !== 2 || candidate.solution.right.length !== 2) continue;
    const hexes = rng.shuffle(CRATE_HEX_POOL).slice(0, candidate.values.length);
    const order = rng.shuffle(candidate.values);
    const crates = order.map((value, index) => ({ id: `crate_${value}`, name: `${value}-crate`, kind: "load", value, pos: hexes[index] }));
    if (isPhysicallyDeliverable(crates, candidate.target)) return { target: candidate.target, crates };
  }
  throw new Error(`Could not generate a physically solvable Unequal Crossing layout from seed ${seed}`);
}

// The fixed 2/3/4/5 crate layout is EXACTLY what generateUnequalCrossingLayout produces from
// this specific seed — verified directly in unequal-crossing.test.js — kept as a named
// constant only so the locked REF-0x trace reads clearly rather than as a bare string.
export const REFERENCE_LAYOUT_SEED = "po_unequal_crossing-ref-2026-09-16";

export function createUnequalCrossing(squad, seed = REFERENCE_LAYOUT_SEED) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Unequal Crossing requires exactly three heroes");
  const starts = ["-3,1", "-2,2", "-2,0"];
  const layout = generateUnequalCrossingLayout(seed);
  return createExpeditionState({
    ...UNEQUAL_CROSSING_CONFIG,
    objects: layout.crates,
    objective: { ...UNEQUAL_CROSSING_CONFIG.objective, target: layout.target },
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
