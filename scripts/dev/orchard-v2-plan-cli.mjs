// Reference invocation of the tactical planner on Four Locks candidates (Claude C-08A).
// node scripts/dev/orchard-v2-plan-cli.mjs --tier 2 --cards cornix,kernel,beeswax --seeds 1-4 [--family direct-guard|alcove-intercept] [--layout river] [--max-states 40000] [--out file.json]
import fs from "node:fs";
import { registerOrchardPuzzleHooks } from "../../expeditions/v2/puzzles/index.js";
import { generateFourLocksCandidate } from "../../expeditions/v2/generation/four-locks.js";
import { planOrchardBlueprint } from "./orchard-v2-tactical-planner.mjs";

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, all) => (v.startsWith("--") ? [...acc, [v.slice(2), all[i + 1]]] : acc), []));
const tier = Number(args.tier || 1), cards = (args.cards || "bushel,furrow,pip").split(","), family = args.family || "direct-guard", layout = args.layout || "river";
const [from, to] = String(args.seeds || "1-1").split("-").map(Number);
registerOrchardPuzzleHooks();
const rows = [];
for (let seed = from; seed <= (to || from); seed += 1) {
  const candidate = generateFourLocksCandidate({ tier, seed, layoutId: layout });
  if (candidate.status !== "success") { rows.push({ seed, status: candidate.status, reasonCode: candidate.reasonCode }); continue; }
  const t0 = Date.now();
  const result = planOrchardBlueprint({ blueprint: candidate.blueprint, teamChoices: [{ cardIds: cards }], planFamily: family, maxStates: Number(args["max-states"] || 40000) });
  rows.push({ seed, layout, status: result.status, reasonCode: result.reasonCode, statesSpent: result.metrics.statesSpent, ms: Date.now() - t0, commands: result.traces[0]?.commandCount, rounds: result.traces[0]?.rounds, outputChoice: result.traces[0]?.outputChoice, trace: args.out ? result.traces[0] : undefined });
}
console.table(rows.map(({ trace, ...r }) => r));
if (args.out) fs.writeFileSync(args.out, JSON.stringify(rows, null, 1));
