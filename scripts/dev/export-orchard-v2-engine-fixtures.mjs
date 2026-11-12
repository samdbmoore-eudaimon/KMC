// Regenerates docs/expeditions/v2/fixtures/*.json from the real Orchard v2 core engine.
// Claude-owned (C-01). Run: node scripts/dev/export-orchard-v2-engine-fixtures.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createFixtureRun, makeFixtureBlueprint, registerFixtureHooks } from "../../expeditions/v2/fixture.js";
import { Driver } from "../../expeditions/v2/test-helpers.js";
import { exportRunRecord, replayRun, stateHash } from "../../expeditions/v2/run.js";
import { forecastEnemyPhase } from "../../expeditions/v2/enemy.js";
import { listCommands } from "../../expeditions/v2/actions.js";
import { offsetKey, hexDistance } from "../../expeditions/v2/hex.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const out = path.join(root, "docs/expeditions/v2/fixtures");
fs.mkdirSync(out, { recursive: true });
registerFixtureHooks();
const write = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + "\n");
const key = offsetKey;
const strip = (state) => ({ ...state, blueprint: "(see blueprint.fixture.json)", initialRun: { ...state.initialRun, blueprint: "(see blueprint.fixture.json)" } });

const blueprint = makeFixtureBlueprint();
write("blueprint.fixture.json", blueprint);

const d = new Driver(createFixtureRun());
write("state.initial.json", strip(d.state));
write("list-commands.bushel.json", listCommands(d.state, "bushel").map((r) => ({ ...r, targets: r.targets.slice(0, 4) })));

// Example previews (what the UI shows before the player confirms).
const approach = d.preview("move", "bushel", { destination: key(2, 4), path: null });
write("preview-move.json", approach);
write("preview-hold-fail.json", d.preview("hold", "pip", { targetId: "number" }));
write("preview-stale.json", d.preview("wait", "bushel", {}) && { ...d.preview("wait", "bushel", {}), note: "revision matches" });
write("forecast.round1.json", forecastEnemyPhase(d.state));

// A complete legal winning run through the real reducer.
const stations = { bushel: "number", furrow: "shape", pip: "sustain" };
d.approach("bushel", key(4, 4), 1);
for (const col of [0, 2, 3]) d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col, value: 1 } });
d.cmd("operate", "bushel", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
for (let round = 1; round <= 5 && d.state.status === "playing"; round += 1) {
  for (const id of ["bushel", "furrow", "pip"]) {
    const st = d.state.blueprint.stations.find((s) => s.id === stations[id]);
    if (hexDistance(d.hero(id).position, st.hex) > 1) d.approach(id, st.hex, 1);
    while (d.hero(id).ap > 0 && hexDistance(d.hero(id).position, st.hex) <= 1 && d.state.stationStates[stations[id]].charge < st.capacity) d.cmd("calibrate", id, { targetId: stations[id] });
  }
  if (["number", "shape", "sustain"].every((n) => d.state.stationStates[n].charge >= 4)) for (const id of ["bushel", "furrow", "pip"]) if (d.hero(id).ap > 0) d.cmd("hold", id, { targetId: stations[id] });
  d.endRound();
}
if (d.state.status !== "won") throw new Error("fixture trace failed to win: " + JSON.stringify(d.state.lossReason));
const record = exportRunRecord(d.state);
const replay = replayRun(JSON.parse(JSON.stringify(record)), { recordHashes: true });
if (!replay.ok) throw new Error("fixture trace does not replay: " + replay.reason);
write("win-trace.record.json", { ...record, perCommandHashes: replay.hashes, note: "initialRun.blueprint is embedded so the record is self-contained" });
write("state.final.json", { ...strip(d.state), events: `${d.state.events.length} events (see win-trace replay)`, finalStateHash: stateHash(d.state) });
console.log(`fixtures written to ${path.relative(root, out)}: ${record.commands.length} commands, final hash ${record.finalStateHash}`);
