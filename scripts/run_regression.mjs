// Single entry point for the regression suite (`npm test`): every generator,
// content, adventure, trading-logic, worker and full-bundle check the project
// has, run in one pass with one pass/fail summary at the end. Each step is a
// separate process so one crashing script can't take down the rest of the run.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const steps = [
  { name: "unit tests (node:test)", cmd: "node", args: ["--test", "joey-multiplayer.test.js", "expeditions/expedition-engine.test.js", "expeditions/expedition-readiness.test.js", "expeditions/expedition-actions.test.js", "expeditions/expedition-commander.test.js", "expeditions/expedition-generation.test.js", "expeditions/smudged-stones.test.js", "expeditions/examination-clock.test.js", "expeditions/sealed-archive.test.js", "expeditions/fog-lanterns.test.js", "expeditions/maybe-flock-roost.test.js", "expeditions/counting-orchard.test.js", "expeditions/cider-run.test.js", "expeditions/nine-across-bridge.test.js", "expeditions/widdershins-path.test.js", "expeditions/hedgejaw-maze.test.js", "expeditions/rootfire-relay.test.js", "expeditions/murder-at-moonfall.test.js", "expeditions/hollow-bough-awakens.test.js", "expeditions/orchard-lockdown.test.js", "expeditions/first-whistle.test.js", "expeditions/card-audit.test.js", "scripts/test_expedition_access.mjs", "scripts/test_trading.mjs", "scripts/test_worker_trading.mjs", "scripts/test_joey_room.mjs", "scripts/test_joey_lobby.mjs", "scripts/test_joey_deck.mjs", "scripts/test_progress_logic.mjs", "scripts/test_generator_support_logic.mjs", "scripts/test_cards_logic.mjs", "scripts/test_progress_actions.mjs"] },
  { name: "Orchard v2 engine, puzzles and persistence (node:test)", cmd: "node", args: ["--test", "expeditions/v2/**/*.test.js"] },
  { name: "junior generator sanity", cmd: "node", args: ["scripts/gen_sanity_test_junior.cjs"] },
  { name: "primary generator sanity", cmd: "node", args: ["scripts/gen_sanity_test_primary.cjs"] },
  { name: "intermediate generator sanity", cmd: "node", args: ["scripts/gen_sanity_test_intermediate.cjs"] },
  { name: "adventure scene-graph validation", cmd: "node", args: ["scripts/validate_all_adventures.mjs"] },
  { name: "expedition system validation", cmd: "node", args: ["scripts/validate_expeditions.mjs"] },
  { name: "Unequal Crossing reference playthrough", cmd: "node", args: ["scripts/simulate_unequal_crossing.mjs"] },
  { name: "The Cider Run reference playthrough", cmd: "node", args: ["scripts/simulate_cider_run.mjs"] },
  { name: "Nine Across the Bridge reference playthrough", cmd: "node", args: ["scripts/simulate_nine_across_bridge.mjs"] },
  { name: "The Hedgejaw Maze reference playthrough", cmd: "node", args: ["scripts/simulate_hedgejaw_maze.mjs"] },
  { name: "The Rootfire Relay reference playthrough", cmd: "node", args: ["scripts/simulate_rootfire_relay.mjs"] },
  { name: "Murder at Moonfall reference playthrough", cmd: "node", args: ["scripts/simulate_murder_at_moonfall.mjs"] },
  { name: "The Hollow Bough Awakens reference playthrough", cmd: "node", args: ["scripts/simulate_hollow_bough_awakens.mjs"] },
  { name: "The Orchard Lockdown reference playthrough", cmd: "node", args: ["scripts/simulate_orchard_lockdown.mjs"] },
  { name: "The First Whistle reference playthrough", cmd: "node", args: ["scripts/simulate_first_whistle.mjs"] },
  { name: "The Smudged Stones reference playthrough", cmd: "node", args: ["scripts/simulate_smudged_stones.mjs"] },
  { name: "The Examination Clock reference playthrough", cmd: "node", args: ["scripts/simulate_examination_clock.mjs"] },
  { name: "The Sealed Archive reference playthrough", cmd: "node", args: ["scripts/simulate_sealed_archive.mjs"] },
  { name: "Lanterns in the Forgetting Fog reference playthrough", cmd: "node", args: ["scripts/simulate_fog_lanterns.mjs"] },
  { name: "The Maybe-Flock Roost reference playthrough", cmd: "node", args: ["scripts/simulate_maybe_flock_roost.mjs"] },
  { name: "Expedition briefing render", cmd: "node", args: ["scripts/test_expedition_screen.cjs"] },
  { name: "rebuild WallabyMaths.html", cmd: "node", args: ["scripts/rebuild.cjs"] },
  { name: "bundle smoke test", cmd: "node", args: ["scripts/bundle_smoke.cjs"] },
  { name: "school and personal account save and restore", cmd: "node", args: ["scripts/test_account_progress.cjs"] },
  { name: "Joey Challenge Hall polling", cmd: "node", args: ["scripts/test_joey_hall.cjs"] },
];

const results = [];
for (const step of steps) {
  console.log(`\n\x1b[1m▶ ${step.name}\x1b[0m`);
  try {
    execFileSync(step.cmd, step.args, { cwd: ROOT, stdio: "inherit" });
    results.push({ ...step, ok: true });
  } catch {
    results.push({ ...step, ok: false });
  }
}

console.log("\n\x1b[1m=== Regression summary ===\x1b[0m");
for (const r of results) console.log(`${r.ok ? "✔" : "✘"} ${r.name}`);
const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.log(`\n${failed.length} of ${results.length} step(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} steps passed.`);
