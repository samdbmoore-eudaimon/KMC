import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createCiderRun, generateCiderRunLayout, REFERENCE_LAYOUT_SEED, deliverCertifiedPair, CIDER_RUN_CONFIG } from "../expeditions/cider-run.js";
import { evaluateObjective } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
// Loan squad is Bushel/Pip/Nine, not Pip/Bramble/Nine (2026-09-18: the default squad had no
// Arithmetic hero to use the map's own named alternate route — see expedition-catalogue.js).
const squad = ["bushel", "pip", "nine"].map((id) => roster.find((profile) => profile.id === id));
const state0 = createCiderRun(squad);

// Driven by deliverCertifiedPair (cider-run.js), the exact same greedy simulator the
// generator's own certifier uses to accept this layout in the first place, rather than a
// hand-transcribed hex sequence — 2026-09-21 rebuild: since generateCiderRunLayout now offers
// two certified pairs per layout (pairCount: 2, a genuine choice, not one findable answer), a
// hand-authored trace would silently go stale every time the generator's output changed. This
// demonstrates the layout's guaranteed-safe pair specifically (safePairIds) — the one that's
// certified to survive a flood tick, not just reach the gate in time.
const layout = generateCiderRunLayout(REFERENCE_LAYOUT_SEED);
const [firstId, secondId] = layout.safePairIds;
const { success, state } = deliverCertifiedPair(state0, firstId, secondId, CIDER_RUN_CONFIG.turnLimit);
if (!success) throw new Error("The sample pass did not fill the press gate");

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not fill the press gate");

function describe(entry) {
  if (entry.action === "move") return `${entry.unitId} moves ${entry.from} -> ${entry.to} (${entry.distance} hex${entry.distance === 1 ? "" : "es"})`;
  if (entry.action === "collect") return `${entry.unitId} collects ${entry.objectId}`;
  if (entry.action === "drop") return `${entry.unitId} places ${entry.objectId} at ${entry.to}`;
  if (entry.action === "end-phase") return null; // covered by the round-boundary lines below
  if (entry.phase === "enemy") return `Scruffcrow: ${entry.action}${entry.lane ? ` (lane ${entry.lane})` : ""}${entry.targetId ? ` -> ${entry.targetId}` : ""}`;
  return `${entry.unitId}: ${entry.action}`;
}

console.log(`The Cider Run sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Press gate filled: ${objective.progress} (the guaranteed-safe pair — layout also offers a second, faster-but-unproven pair: ${layout.fastPairIds.join(" + ")}).`);
console.log(`Guaranteed-safe pair: ${firstId} + ${secondId} = ${layout.target}.`);
let round = 1;
console.log(`-- Round ${round} --`);
for (const entry of state.history) {
  if (entry.turn > round) { round = entry.turn; console.log(`-- Round ${round} --`); }
  const line = describe(entry);
  if (line) console.log(`   ${line}`);
}
