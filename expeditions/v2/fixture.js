// Runnable minimal engine fixture. It exists so the UI, generators and certification tooling can
// exercise the REAL reducer before the five production puzzles ship. It uses the production
// 92-hex footprint, the production tier-1 numbers and a deliberately trivial puzzle kind
// ('fixture-switches') that is registered through the same hook interface Codex implements.
import { offsetKey } from "./hex.js";
import { orchardMaxIntegrity, stationMaxIntegrity, CHARGE_CAPACITY } from "./constants.js";
import { registerPuzzleHooks } from "./puzzle-hooks.js";
import { createRun } from "./run.js";

export const FIXTURE_KIND = "fixture-switches";
export const FIXTURE_SQUAD = ["bushel", "furrow", "pip"];
const FIXTURE_SOLUTION = [1, 0, 1, 1];

const GROUP_OF = (i) => ["network", i < 2 ? "row-0" : "row-1"];

export const fixtureHooks = {
  hookInterfaceVersion: 1,
  createActive: (puzzle) => ({ switches: [...(puzzle.solutionParameters.start || [0, 0, 0, 0])] }),
  createDraft: (puzzle, active) => ({ switches: [...active.switches] }),
  applyEdit(puzzle, draft, edit) {
    if (edit.type === "select-outputs") return { ok: true, content: { switches: [...draft.switches] } };
    if (edit.type !== "set-cell") return { ok: false, reasonCode: "unsupported-edit" };
    if (edit.row !== 0 || !Number.isInteger(edit.col) || edit.col < 0 || edit.col > 3) return { ok: false, reasonCode: "out-of-bounds" };
    if (edit.value !== 0 && edit.value !== 1) return { ok: false, reasonCode: "out-of-domain" };
    const switches = [...draft.switches];
    switches[edit.col] = edit.value;
    return { ok: true, content: { switches } };
  },
  checkOutputSelection(puzzle, ids) {
    if (ids.length > 2) return { ok: false, reasonCode: "too-many-outputs", reasonParams: { max: 2 } };
    return { ok: true };
  },
  commit: (puzzle, draft) => ({ ok: true, content: { switches: [...draft.switches] } }),
  evaluate(puzzle, active) {
    const valid = active.switches.every((v, i) => v === FIXTURE_SOLUTION[i]);
    return { valid, outputTruth: { bridge: valid, shelter: valid } };
  },
  disruptionCandidates(puzzle, active) {
    return active.switches.map((v, i) => ({ v, i })).filter((x) => x.v === 1).map((x) => ({ memberId: `s${x.i}`, groupIds: GROUP_OF(x.i), hex: puzzle.controlHex }));
  },
  disrupt(puzzle, active, memberId) {
    const switches = [...active.switches];
    switches[Number(memberId.slice(1))] = 0;
    return { switches };
  },
  hint: (puzzle, draft, stage) => ({ text: stage === 3 ? "Worked solution loaded." : "Switches 1, 3 and 4 should be on." }),
  solutionDraft: () => ({ content: { switches: [...FIXTURE_SOLUTION] }, selectedOutputIds: ["bridge", "shelter"] }),
};

export function registerFixtureHooks() {
  registerPuzzleHooks(FIXTURE_KIND, fixtureHooks);
}

// River archetype on the production footprint, reference anchors, tier 1.
export function makeFixtureBlueprint({ enemyWake = 4, tier = 1, extraEnemies = [], waterBridgeRows = [2, 6] } = {}) {
  const tiles = [];
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 12; c += 1) {
      if ((c < 2 || c > 9) && (r < 2 || r > 6)) continue;
      const [q, rr] = offsetKey(c, r).split(",").map(Number);
      let terrain = "floor";
      const extra = {};
      if (c === 6) {
        if (waterBridgeRows.includes(r)) terrain = "bridge";
        else if (r === 4) { terrain = "bridge"; extra.passageOutputId = "bridge"; }
        else terrain = "water";
      }
      tiles.push({ q, r: rr, terrain, ...extra });
    }
  }
  const at = (c, r) => offsetKey(c, r);
  const control = at(4, 4);
  return {
    schemaVersion: 2, moduleKey: "primary", familyId: "four-locks", tier, seed: 1, generatorVersion: 1, rulesVersion: 2, attempt: 0,
    layoutId: "fixture-river", fixture: true, deadline: 5, certificateId: "fixture", structuralFingerprint: "fixture",
    tiles,
    stations: [
      { id: "control", hex: control, name: "Ledger control", maxIntegrity: stationMaxIntegrity(tier) },
      { id: "number", hex: at(8, 4), name: "Ledger bus", capacity: CHARGE_CAPACITY[tier - 1], maxIntegrity: stationMaxIntegrity(tier) },
      { id: "shape", hex: at(9, 1), name: "Bridge brace", capacity: CHARGE_CAPACITY[tier - 1], maxIntegrity: stationMaxIntegrity(tier) },
      { id: "sustain", hex: at(8, 7), name: "Tree maintenance", capacity: CHARGE_CAPACITY[tier - 1], maxIntegrity: stationMaxIntegrity(tier) },
      { id: "alcove", hex: at(10, 3), name: "Brace alcove" },
    ],
    orchard: { hex: at(10, 5), name: "Ninefold tree" },
    orchardMaxIntegrity: orchardMaxIntegrity(tier),
    puzzle: {
      id: "fixture", kind: FIXTURE_KIND, controlId: "control", controlHex: control, draftSchemaVersion: 1, networkGroupId: "network",
      lockGroups: [
        { id: "network", anchor: control, memberIds: ["s0", "s1", "s2", "s3"], effectKinds: ["jam", "environment"] },
        { id: "row-0", anchor: control, memberIds: ["s0", "s1"], effectKinds: ["jam", "environment"] },
        { id: "row-1", anchor: control, memberIds: ["s2", "s3"], effectKinds: ["jam", "environment"] },
      ],
      solutionParameters: { solution: FIXTURE_SOLUTION, start: [0, 0, 0, 0] },
      defaultOutputIds: ["bridge", "shelter"],
    },
    outputs: [
      { id: "bridge", label: "Bridge", trigger: "on-commit", effect: { kind: "passage" } },
      { id: "shelter", label: "Shelter", trigger: "phase-start", effect: { kind: "shelter", amount: 2, targetIds: ["number", "shape", "sustain"] } },
    ],
    enemies: [
      { id: "hookmole-1", ruleId: "jammer", artId: "hookmole", wakePhase: enemyWake, position: at(10, 2) },
      ...extraEnemies,
    ],
    hazards: [{ id: "root-drain", sites: [{ id: "sustain-site", targetId: "sustain" }], mutation: { kind: "none" } }],
    sites: [],
    deployment: [at(2, 3), at(2, 4), at(2, 5)],
    commission: { poweredCount: 2, selectableOutputIds: ["bridge", "shelter"] },
  };
}

export function createFixtureRun(options = {}) {
  registerFixtureHooks();
  const { cardIds = FIXTURE_SQUAD, runId = "fixture-run", ...bp } = options;
  return createRun({ blueprint: makeFixtureBlueprint(bp), cardIds, runId });
}
