// Public entry point for Orchard v2 core (Claude-owned). Codex imports from here only.
export * from "./constants.js";
export { hexKey, parseHex, hexDistance, hexLine, neighbourKeys, rangeKeys, offsetKey, offsetToAxial, compareHex, isHexKey } from "./hex.js";
export { orchardV2Profile, getOrchardV2Profile, orchardRosterProfiles } from "./profile.js";
export { registerPuzzleHooks, unregisterPuzzleHooks, getPuzzleHooks, hasPuzzleHooks, HOOK_INTERFACE_VERSION } from "./puzzle-hooks.js";
export { validateBlueprint } from "./schema.js";
export { createRun, exportRunRecord, replayRun, stateHash, blueprintHash, hashValue, canonicalJson } from "./run.js";
export { previewCommand, reduceCommand, listCommands } from "./actions.js";
export { forecastEnemyPhase, resolveEnemyPhase, evaluateVictory } from "./enemy.js";
export { draftDiffersFromActive, reachableHexes, hasSight, strikeCalculation, getHero, getEnemy, profileOf, resolveTarget, shortestPaths } from "./rules.js";
