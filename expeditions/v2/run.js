import { AP_PER_ROUND, ENEMY_RULES, JOBS, RULES_VERSION, SCHEMA_VERSION } from "./constants.js";
import { getPuzzleHooks } from "./puzzle-hooks.js";
import { orchardRosterProfiles } from "./profile.js";
import { getIndex, recomputeOutputs } from "./rules.js";
import { reduceCommand } from "./actions.js";
import { validateBlueprint } from "./schema.js";

function fnv1a(text, seed) {
  let hash = seed >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().filter((k) => value[k] !== undefined).map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(",")}}`;
  return JSON.stringify(value ?? null);
}

// Local consistency hash only (two FNV-1a passes), not tamper protection.
export function hashValue(value) {
  const text = canonicalJson(value);
  return fnv1a(text, 0x811c9dc5).toString(16).padStart(8, "0") + fnv1a(text, 0x9747b28c).toString(16).padStart(8, "0");
}

const HASH_EXCLUDED = new Set(["blueprint", "profiles", "initialRun", "undo", "events", "log"]);
// Canonical state hash: excludes camera/animation (never in state), the undo stack, event text and the command log.
export function stateHash(state) {
  const subset = {};
  for (const key of Object.keys(state)) if (!HASH_EXCLUDED.has(key)) subset[key] = state[key];
  return hashValue(subset);
}
export const blueprintHash = (blueprint) => hashValue(blueprint);

export function createRun({ blueprint, cardIds, runId, deploymentAssignment = null, profiles = null }) {
  const check = validateBlueprint(blueprint);
  if (!check.ok) throw new Error(`Invalid blueprint: ${check.errors.map((e) => e.code).join(", ")}`);
  if (!Array.isArray(cardIds) || cardIds.length !== 3 || new Set(cardIds).size !== 3) throw new Error("A squad is exactly three distinct cards");
  const roster = profiles || orchardRosterProfiles();
  const used = {};
  for (const id of cardIds) {
    if (!roster[id]) throw new Error(`Unknown Orchard card: ${id}`);
    used[id] = roster[id];
  }
  const assignment = {};
  if (deploymentAssignment) {
    const hexes = Object.values(deploymentAssignment);
    if (Object.keys(deploymentAssignment).length !== 3 || cardIds.some((id) => !(id in deploymentAssignment)) || new Set(hexes).size !== 3 || !hexes.every((h) => blueprint.deployment.includes(h))) throw new Error("Deployment must give each card one distinct blueprint deployment hex");
    Object.assign(assignment, deploymentAssignment);
  } else cardIds.forEach((id, i) => { assignment[id] = blueprint.deployment[i]; });

  const tier = blueprint.tier;
  const hooks = getPuzzleHooks(blueprint.puzzle.kind);
  const content = hooks.createActive(blueprint.puzzle);
  const heroes = cardIds.map((cardId) => {
    const profile = used[cardId];
    const handReady = {};
    for (const card of profile.hand) handReady[card.key] = true;
    return { id: cardId, cardId, position: assignment[cardId], hp: profile.maxHealth, ap: AP_PER_ROUND, handReady, refocusUsed: false, defeated: false, holding: null };
  });
  const enemyStates = blueprint.enemies.map((e) => ({ id: e.id, position: e.position, hp: ENEMY_RULES[e.ruleId].health(tier), defeated: false }));
  const stationStates = {};
  for (const st of blueprint.stations) if (st.id !== "alcove") stationStates[st.id] = { charge: 0, integrity: st.maxIntegrity };
  const state = {
    schemaVersion: SCHEMA_VERSION,
    rulesVersion: RULES_VERSION,
    runId,
    revision: 0,
    blueprint,
    profiles: used,
    round: 1,
    status: "playing",
    lossReason: null,
    heroes,
    enemyStates,
    stationStates,
    puzzleActive: { content, selectedOutputIds: [] },
    puzzleDraft: { content: hooks.createDraft(blueprint.puzzle, content), selectedOutputIds: [...(blueprint.puzzle.defaultOutputIds || [])], revision: 0, committedRevision: 0 },
    puzzleValid: false,
    activeOutputs: {},
    passages: {},
    orchardIntegrity: blueprint.orchardMaxIntegrity,
    marks: {},
    phaseEffects: { grants: [], counters: [], suppressedShelterCells: [], suppressedSectors: [], pendingRestore: [], rootsActive: false, nestSnapshot: null },
    holds: {},
    preparedAlcove: false,
    comparisonLog: [],
    comparisonsUsed: 0,
    eventSeq: 0,
    events: [],
    undo: [],
    hintStage: 0,
    actionCount: 0,
    log: [],
  };
  getIndex(blueprint);
  recomputeOutputs(state);
  state.events = [];
  state.eventSeq = 0;
  const initialRun = { runId, blueprint, cardIds: [...cardIds], deploymentAssignment: assignment, profiles: used, initialStateHash: null };
  state.initialRun = initialRun;
  initialRun.initialStateHash = stateHash(state);
  return state;
}

export function exportRunRecord(state) {
  return {
    schemaVersion: SCHEMA_VERSION,
    initialRun: state.initialRun,
    commands: state.log,
    finalStateHash: stateHash(state),
    status: state.status,
    round: state.round,
    actionCount: state.actionCount,
  };
}

// Deterministically replays every accepted command through the real reducer. A record only
// verifies if each command is accepted again and the final canonical hash matches.
export function replayRun(record, { recordHashes = false } = {}) {
  const { initialRun, commands } = record;
  let state = createRun({ blueprint: initialRun.blueprint, cardIds: initialRun.cardIds, runId: initialRun.runId, deploymentAssignment: initialRun.deploymentAssignment, profiles: initialRun.profiles });
  if (initialRun.initialStateHash && state.initialRun.initialStateHash !== initialRun.initialStateHash) return { ok: false, reason: "initial-hash-mismatch", index: -1 };
  const hashes = [];
  for (let i = 0; i < commands.length; i += 1) {
    const { state: next, result } = reduceCommand(state, commands[i]);
    if (!result.legal) return { ok: false, reason: result.reasonCode, reasonParams: result.reasonParams, index: i, state };
    state = next;
    if (recordHashes) hashes.push(stateHash(state));
  }
  const finalHash = stateHash(state);
  const matches = !record.finalStateHash || record.finalStateHash === finalHash;
  return { ok: matches, reason: matches ? null : "final-hash-mismatch", index: commands.length, state, finalHash, hashes };
}

export { JOBS };
