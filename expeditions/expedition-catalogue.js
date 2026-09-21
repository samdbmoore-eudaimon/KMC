// E6 presentation integration: a small, pure registry of which scenarios are actually
// playable end-to-end (engine config + a loan squad the UI can offer before a profile owns
// the cards). Screen components read this instead of hard-coding one scenario per module —
// adding the next proof map is one entry here, not a rewrite of the screen.
import { createUnequalCrossing, UNEQUAL_CROSSING_CONFIG } from "./unequal-crossing.js";
import { createCiderRun, CIDER_RUN_CONFIG } from "./cider-run.js";
import { createNineAcrossBridge, NINE_ACROSS_BRIDGE_CONFIG } from "./nine-across-bridge.js";
import { createHedgejawMaze, HEDGEJAW_MAZE_CONFIG } from "./hedgejaw-maze.js";
import { createRootfireRelay, ROOTFIRE_RELAY_CONFIG } from "./rootfire-relay.js";
import { createMurderAtMoonfall, MURDER_AT_MOONFALL_CONFIG } from "./murder-at-moonfall.js";
import { createHollowBoughAwakens, HOLLOW_BOUGH_AWAKENS_CONFIG } from "./hollow-bough-awakens.js";
import { createOrchardLockdown, ORCHARD_LOCKDOWN_CONFIG } from "./orchard-lockdown.js";
import { createFirstWhistle, FIRST_WHISTLE_CONFIG } from "./first-whistle.js";
import { createSmudgedStones, SMUDGED_STONES_CONFIG } from "./smudged-stones.js";
import { createExaminationClock, EXAMINATION_CLOCK_CONFIG } from "./examination-clock.js";
import { createSealedArchive, SEALED_ARCHIVE_CONFIG } from "./sealed-archive.js";
import { createFogLanterns, FOG_LANTERNS_CONFIG } from "./fog-lanterns.js";
import { createMaybeFlockRoost, MAYBE_FLOCK_ROOST_CONFIG } from "./maybe-flock-roost.js";

export const EXPEDITION_CATALOGUE = {
  po_unequal_crossing: {
    moduleKey: "primary",
    squadSize: 3,
    // Procedural generation (2026-09-17): every real embark gets a freshly generated,
    // physically-verified-solvable layout — createUnequalCrossing(squad, seed) defaults to
    // the fixed REFERENCE_LAYOUT_SEED when no seed is given (what the locked reference trace
    // and every test below still assumes), but live play needs a different one each time.
    // Proper seed/attempt-index persistence (EXPEDITIONS_CLAUDE_HANDOVER.md's "seed/version
    // storage" piece of the procedural framework) isn't wired up yet, so this seeds from the
    // current time for now — good enough to make play genuinely different every attempt,
    // though not yet resumable/replayable from a saved seed.
    createState: (squad) => createUnequalCrossing(squad, Date.now()),
    config: UNEQUAL_CROSSING_CONFIG,
    loanSquad: ["pip", "bramble", "nine"],
    // Reference-trace figures from scripts/simulate_unequal_crossing.mjs, for the fixed
    // REFERENCE_LAYOUT_SEED layout (unequal-crossing.js) — updated 2026-09-17 for the move to
    // procedural generation. This scenario's turnLimit is 4 and the verified trace also
    // finishes in round 4, so exact_turn_target is met by any winning run of *this specific
    // seed* — a known property of this one layout, not a bug, and not necessarily true of a
    // freshly generated one (a harder-to-reach layout may need every round).
    marksPar: { turns: 4, movement: 17 }, // actions: 18, matching scripts/simulate_unequal_crossing.mjs
  },
  po_cider_run: {
    moduleKey: "primary",
    squadSize: 3,
    // Procedural generation (2026-09-17, replacing The Counting Orchard at level 2 per Sam's
    // instruction — counting-orchard.js/.test.js remain in the repo, real and tested, just no
    // longer catalogued): every real embark gets a freshly generated, physically-verified
    // layout, same "defaults to a fixed reference seed for tests, live play seeds from now"
    // shape as Unequal Crossing.
    createState: (squad) => createCiderRun(squad, Date.now()),
    config: CIDER_RUN_CONFIG,
    // Needs an Arithmetic hero (Combine, the map's own named alternate route — see
    // cider-run.js's heroChain/alternateChain), so the loan squad is Bushel/Pip/Nine, not the
    // default Pip/Bramble/Nine, matching The Orchard Lockdown's identical fix (2026-09-18,
    // Codex's review: the default squad could never actually use the route its own text names).
    loanSquad: ["bushel", "pip", "nine"],
    // Reference-trace figures from scripts/simulate_cider_run.mjs, for the fixed
    // REFERENCE_LAYOUT_SEED layout (cider-run.js). Updated 2026-09-18 for the board reshape
    // (three 120°-spaced spokes, a genuinely adjacent gate): this layout's certified pair is
    // two far presses on different spokes, a real cross-board trek, so par moved from 2/3 to
    // the reference trace's actual 3 rounds and 11 hexes of movement.
    marksPar: { turns: 3, movement: 11 },
  },
  po_nine_across: {
    moduleKey: "primary",
    squadSize: 3,
    createState: createNineAcrossBridge,
    config: NINE_ACROSS_BRIDGE_CONFIG,
    loanSquad: ["pip", "bramble", "nine"],
    // Reference-trace figures from scripts/simulate_nine_across_bridge.mjs — updated 2026-09-17
    // for the rebuild on the rotation-hex primitive (turns 2 -> 3: the new wind-vane hexes
    // shift the shortest path by one hex, so Pip's final drop now needs its own third round).
    marksPar: { turns: 3, movement: 12 },
  },
  po_hedgejaw_maze: {
    moduleKey: "primary",
    squadSize: 3,
    // Replaces The Widdershins Path at level 4 (2026-09-17, Sam's explicit "new build"
    // instruction — see hedgejaw-maze.js's header). widdershins-path.js/.test.js and
    // scripts/simulate_widdershins_path.mjs remain in the repo, real and tested, just no
    // longer catalogued. This map's Geometry-gated Shift means the loan squad swaps Bramble
    // for Russet (Geometry discipline) — Bramble's Reckoner role has no work to do here.
    createState: createHedgejawMaze,
    config: HEDGEJAW_MAZE_CONFIG,
    loanSquad: ["russet", "pip", "nine"],
    // Reference-trace figures from scripts/simulate_hedgejaw_maze.mjs.
    marksPar: { turns: 3, movement: 5 },
  },
  po_maybe_roost: {
    moduleKey: "primary",
    squadSize: 3,
    createState: createMaybeFlockRoost,
    config: MAYBE_FLOCK_ROOST_CONFIG,
    loanSquad: ["pip", "bramble", "nine"],
    // Reference-trace figures from scripts/simulate_maybe_flock_roost.mjs.
    marksPar: { turns: 2, movement: 12 },
  },
  po_count_the_murder: {
    moduleKey: "primary",
    squadSize: 3,
    // New build at level 7 (2026-09-17) — po_count_the_murder is the working title for
    // Murder at Moonfall (confirmed against EXPEDITIONS_NINEFOLD_ROUTE.md directly), never
    // previously engine-built.
    createState: createMurderAtMoonfall,
    config: MURDER_AT_MOONFALL_CONFIG,
    loanSquad: ["pip", "bramble", "nine"],
    // Reference-trace figures from scripts/simulate_murder_at_moonfall.mjs.
    marksPar: { turns: 1, movement: 4 },
  },
  po_hollow_bough: {
    moduleKey: "primary",
    squadSize: 3,
    // New build at level 8 (2026-09-17) — po_hollow_bough's old placeholder brief was never
    // engine-built, so this is fresh content with a title/rule update, not a replacement.
    createState: createHollowBoughAwakens,
    config: HOLLOW_BOUGH_AWAKENS_CONFIG,
    loanSquad: ["pip", "bramble", "nine"],
    // Reference-trace figures from scripts/simulate_hollow_bough_awakens.mjs.
    marksPar: { turns: 5, movement: 0 },
  },
  po_one_short: {
    moduleKey: "primary",
    squadSize: 3,
    // New build at level 9 (2026-09-17), using primitive B (the Hive Ledger). po_one_short's
    // old placeholder was never engine-built. Needs an Arithmetic hero (Combine), so the loan
    // squad is Bushel/Pip/Nine, not the default Pip/Bramble/Nine.
    createState: createOrchardLockdown,
    config: ORCHARD_LOCKDOWN_CONFIG,
    loanSquad: ["bushel", "pip", "nine"],
    // Reference-trace figures from scripts/simulate_orchard_lockdown.mjs.
    marksPar: { turns: 1, movement: 0 },
  },
  po_first_whistle: {
    moduleKey: "primary",
    squadSize: 3,
    // New build at level 10 (the module boss, 2026-09-17), using primitive A (rotation hex,
    // including the jammed/Force Rotate half no earlier map's loan squad could use). Needs a
    // Geometry hero, so the loan squad is Russet/Bramble/Nine, not the default.
    createState: createFirstWhistle,
    config: FIRST_WHISTLE_CONFIG,
    loanSquad: ["russet", "bramble", "nine"],
    // Reference-trace figures from scripts/simulate_first_whistle.mjs.
    marksPar: { turns: 2, movement: 6 },
  },
  po_rootfire_relay: {
    moduleKey: "primary",
    squadSize: 3,
    // New build at level 6 (2026-09-17) — the old "Ten Honest Bundles" placeholder brief was
    // never engine-built, so this is a fresh addition, not a replacement of tested work. Needs
    // a Geometry hero (True Shift) and a Science hero (Chain Reaction), so the loan squad is
    // Russet/Bramble/Nine, not the default Pip/Bramble/Nine.
    createState: createRootfireRelay,
    config: ROOTFIRE_RELAY_CONFIG,
    loanSquad: ["russet", "bramble", "nine"],
    // Reference-trace figures from scripts/simulate_rootfire_relay.mjs.
    marksPar: { turns: 1, movement: 0 },
  },
  lr_smudged_stones: {
    moduleKey: "junior",
    squadSize: 3,
    createState: createSmudgedStones,
    config: SMUDGED_STONES_CONFIG,
    loanSquad: ["addy", "zoomby", "hunchik"],
    marksPar: { turns: 2, movement: 6 },
  },
  lr_fog_lanterns: {
    moduleKey: "junior",
    squadSize: 3,
    createState: createFogLanterns,
    config: FOG_LANTERNS_CONFIG,
    loanSquad: ["addy", "zoomby", "hunchik"],
    // Reference-trace figures from scripts/simulate_fog_lanterns.mjs. turnLimit is 1, so
    // exact_turn_target is met by any win here — a known property of this map (each hero
    // starts already adjacent to her own marker), not a bug.
    marksPar: { turns: 1, movement: 0 },
  },
  gf_examination_clock: {
    moduleKey: "intermediate",
    squadSize: 4,
    createState: createExaminationClock,
    config: EXAMINATION_CLOCK_CONFIG,
    loanSquad: ["gf_tambrindle", "gf_ratchet", "gf_higgins", "gf_marta"],
    marksPar: { turns: 2, movement: 15 },
  },
  gf_sealed_archive: {
    moduleKey: "intermediate",
    squadSize: 4,
    createState: createSealedArchive,
    config: SEALED_ARCHIVE_CONFIG,
    loanSquad: ["gf_adavoss", "gf_higgins", "gf_marta", "gf_tambrindle"],
    // Reference-trace figures from scripts/simulate_sealed_archive.mjs, updated 2026-09-16
    // for the ferrying redesign (see sealed-archive.js's header comment): three heroes now
    // genuinely travel the board to deliver feeder stones, so both figures are higher than
    // the old single-specialist trace.
    marksPar: { turns: 5, movement: 28 },
  },
};

// Every module now has two playable scenarios (see EXPEDITIONS_CLAUDE_HANDOVER.md —
// twenty-four of the thirty authored briefs still have no engine config). Returns every
// playable id for a module, in catalogue order, so the briefing screen can let the player
// choose between them rather than assuming exactly one.
export function playableScenarioIdsForModule(moduleKey) {
  return Object.keys(EXPEDITION_CATALOGUE).filter((id) => EXPEDITION_CATALOGUE[id].moduleKey === moduleKey);
}

// Convenience for callers that only ever want "the" playable scenario for a module — the
// first entry in catalogue order. Returns null for a module with no playable entry at all,
// which the briefing screen uses to show its "not yet" panel.
export function playableScenarioIdForModule(moduleKey) {
  return playableScenarioIdsForModule(moduleKey)[0] || null;
}

export function catalogueEntry(scenarioId) {
  return EXPEDITION_CATALOGUE[scenarioId] || null;
}
