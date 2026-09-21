// Versioned data contracts for Expeditions (E1 — see EXPEDITIONS_CLAUDE_HANDOVER.md).
//
// This file has two jobs:
//   1. Document, as JSDoc typedefs, the shape of every contract named in the handover:
//      scenario blueprints, generated configurations, units, objects, mechanisms,
//      enemies, objectives, commands, events and reference traces.
//   2. Provide small, pure, build-time validators for the contracts that already have
//      real content (scenario blueprints, enemies, objective families). Contracts that
//      are specified but not yet implemented (generated configurations, mechanisms,
//      commands, events) are documented now so later stages freeze against a known
//      shape, but have no validator yet — there is nothing to validate until generation
//      (E3) and the command dispatcher (E2) exist.
//
// Nothing in this file imports React or touches storage. Bump the relevant
// *_SCHEMA_VERSION constant whenever a shape's stored MEANING changes; a display-only
// rename (title, rule text) never needs a version bump and must never change an id.
import { EXPEDITION_ENEMIES, EXPEDITION_OBJECTIVE_FAMILIES, EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { RARITY_ORDER } from "./expedition-readiness.js";

export const SCENARIO_BLUEPRINT_SCHEMA_VERSION = 1;
export const REFERENCE_TRACE_SCHEMA_VERSION = 1;
// Not yet produced by any code path — frozen here ahead of E3 so the generation stage
// has a fixed target shape to build against instead of inventing one mid-implementation.
export const GENERATED_CONFIG_SCHEMA_VERSION = 1;

/**
 * @typedef {"common"|"uncommon"|"rare"|"epic"|"legendary"} CardRarity
 *
 * @typedef {Object} ReadinessGuidance - Advisory only. Embark is never disabled by this
 *   data — see expedition-readiness.js's file header for why. It drives the pre-mission
 *   readiness meter and a "this looks tough" banner; the mission's own numbers (enemy
 *   defence, hearts, damage) are what actually make an underpowered squad struggle.
 * @property {number} minimumAverageBattleValue - Recommended average `card.bv` across
 *   deployed field cards only. A Commander is never included in this average.
 * @property {Object<string, number>} minimumRarityCounts - Rarity floor -> recommended
 *   minimum count of deployed field cards at or above that floor, e.g. `{ rare: 2 }`.
 * @property {CardRarity|null} allCardsMinimumRarity - When set, every deployed field card
 *   is recommended to be at or above this rarity. Legendary always counts as Epic or better.
 * @property {CardRarity[]} forbiddenRarities - Rarities the guidance recommends leaving
 *   out of the deployed field squad.
 * @property {{stat: string, min: number}[]} capabilityRequirements - Named capability
 *   floors, e.g. `{ stat: "geometry", min: 7 }` — recommends at least one deployed field
 *   card with that printed statistic at or above `min`.
 *
 * @typedef {Object} ExpeditionScenarioBlueprint
 * @property {number} schemaVersion - See SCENARIO_BLUEPRINT_SCHEMA_VERSION.
 * @property {string} id - Stable identifier. Never renamed; `title` may change freely.
 * @property {number} level - 1 to 10 within its module; a boss of the same level gates it.
 * @property {string} title - Display wording only. Never used as a key.
 * @property {string} family - A key into EXPEDITION_OBJECTIVE_FAMILIES.
 * @property {number} turns - Round limit. No standard scenario exceeds six.
 * @property {string} rule - One-sentence, child-readable win condition shown in briefing.
 * @property {string[]} enemies - Keys into EXPEDITION_ENEMIES.
 * @property {ReadinessGuidance} readiness - Advisory squad-readiness guidance for this
 *   mission (never a hard gate — see ReadinessGuidance).
 * @property {number} [target] - Optional numerical target (exact totals, capacities).
 * @property {number[]} [objects] - Optional starting object values.
 * @property {number[]} [sequence] - Optional required visiting order (ordered-route family).
 *
 * @typedef {Object} ExpeditionEnemyDefinition
 * @property {string} name
 * @property {number} hp
 * @property {number} move
 * @property {number} defence
 * @property {string} intent - Child-readable sentence describing what this enemy will do.
 *
 * @typedef {Object} ExpeditionUnit
 * @property {string} id - Stable per-instance id (a card id for a field unit).
 * @property {"player"|"enemy"} side
 * @property {number} ap - Action points remaining this round.
 * @property {number} maxAp
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} move
 * @property {number} range
 * @property {string} pos - A hex key, "q,r".
 * @property {boolean} guarded
 * @property {string|null} carrying - An object id, or null.
 * @property {boolean} [marked] - Scout's Mark: the next allied strike against this enemy
 *   gains one support, then the mark is consumed.
 * @property {boolean} preciseUsedThisRound - Precise trait bookkeeping; reset each round.
 * @property {boolean} preciseSupportBanked - Precise trait bookkeeping; reset each round.
 * @property {boolean} sureFootedUsedThisRound - Sure-footed trait bookkeeping; reset each round.
 * @property {boolean} freeStepAvailable - Quick trait bookkeeping; reset each round.
 * @property {boolean} adaptableUsedEver - Adaptable trait bookkeeping; once per expedition, never reset.
 * @property {boolean} justInteracted - Dash precondition; cleared by any other action.
 * @property {number} bonusMoveTokens - Dash's free-move credit; reset each round.
 * @property {boolean} interruptArmed - Speed's Interrupt; consumed during the enemy phase.
 * @property {string|null} lastCloseActionTargetId - Mover's Shove precondition.
 * @property {{activeNodes: string[], edges?: number[][], routeMarkerIds?: string[], start: string, end: string}} [networkGate] -
 *   Enemy-only (The First Whistle): while `graphConnected` (expedition-engine.js, the same
 *   function `"connect"` family objectives already call) reads false for this shape,
 *   `strikeEnemy` always resolves at 0 impact against this unit — "combat opens only after the
 *   network is live," a legal action with no effect, not a thrown error.
 *
 * @typedef {Object} ExpeditionObject - A movable scenario object (crate, lantern, token).
 * @property {string} id
 * @property {boolean} movable
 * @property {string|null} pos - A hex key, or null while carried.
 * @property {number} [value]
 * @property {boolean} guarded
 * @property {boolean} [removed]
 * @property {number} [stabilisedUntil] - A turn number; the object ignores changes until then.
 * @property {boolean} valueLocked - Logic's Deduce (value mode); blocks Combine/Split/Transform/Chain.
 * @property {boolean} [ledgerCell] - Marks a value-bearing object as a Hive Ledger cell
 *   (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.3), the only objects the `"corrupt-value"`
 *   enemy behaviour will ever target (expedition-engine.js's `resolveEnemy`) — an ordinary
 *   carried/placed value object (a crate, a load) is never at risk just for having a `value`.
 *   `guarded` or `valueLocked` (Deduce) both protect a cell from corruption, exactly as they
 *   already protect a Smudged-Stones operator from `"obscure-operator"`.
 * @property {boolean} damaged - Whether Mender's Restore may repair this object.
 * @property {string[]} [cycle] - Science's Transform: the object's state cycle, if it has one.
 * @property {number} [stateIndex] - Current index into `cycle`.
 * @property {string} [phase] - `cycle[stateIndex]`, kept in sync by Transform.
 * @property {string} [op] - Reckoner's Reframe target field (an operation label, e.g. "+").
 * @property {number} [orientation] - Reckoner's Reframe target field: 0-5, a rotation hex's
 *   or route marker's current sixth-turn position (expedition-engine.js's `rotationHexTracks`/
 *   `routeMarkerConnections`). A jammed tile (see `jammed` below) refuses Reframe entirely.
 * @property {(number[]|RotationHexTrack)[]} [tracks] - Up to three edge-to-edge tracks for a
 *   rotation hex (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.2), read by
 *   `rotationHexTracks`/`travelThroughRotationHex`. Each entry is either a plain `[a, b]` local
 *   hex-edge pair (identical meaning to a route marker's `paths` entry — pure connectivity, no
 *   transformation) or a `RotationHexTrack` descriptor for the operator-wheel/signal-prism/
 *   current-turner skins. An object with only `paths` and no `tracks` is exactly a route
 *   marker and behaves identically through either function.
 * @property {boolean} [jammed] - True for a "heavy" rotation hex that a Reckoner's Reframe
 *   cannot turn (reframeTarget throws). Rotating it instead requires the Geometry discipline's
 *   `forceRotate` action: a visible-check-shaped power total (Geometry + adjacent support)
 *   against `jamDifficulty`, spent as one action, succeeding or failing exactly like any other
 *   visible check (no free retries, no hidden modifier).
 * @property {number} [jamDifficulty] - The printed threshold `forceRotate` must meet.
 * @property {VisibleCheckDeclaration} [check] - Optional: a visible check a hero may
 *   attempt against this object (EXPEDITIONS_CARD_COMBAT_CONTRACT.md §4). Declarative only —
 *   attemptCheck (expedition-engine.js) reads statIndex/difficulty/bonus straight off the
 *   command payload, not off this field; this is the authoring-time shape scenario content
 *   should follow so a briefing/UI can read the same values before dispatch.
 *
 * @typedef {Object} VisibleCheckDeclaration - EXPEDITIONS_CARD_COMBAT_CONTRACT.md §4:
 *   `Check power = named statistic + shown support + shown terrain or object bonus`,
 *   success when the total meets `difficulty`. No randomness, no hidden modifier — every
 *   field here must be shown before confirmation, not just used internally.
 * @property {number} statIndex - 0-4, indexing the five printed statistics in stat order
 *   (Arithmetic, Geometry, Logic, Science, Speed).
 * @property {number} difficulty - The printed threshold the total must meet or exceed.
 * @property {number} [bonus] - A scenario-declared terrain or object bonus, shown in the
 *   preview alongside the statistic and support — never invented at resolution time.
 * @property {string} [bonusLabel] - Child-readable name for `bonus`, e.g. "Alcove footing".
 * @property {string} description - Child-readable statement of what passing this check does,
 *   e.g. "Shift the jammed bridge panel clear."
 *
 * @typedef {Object} RotationHexTrack - One of an ExpeditionObject's `tracks`
 *   (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.2), read by `rotationHexTracks`/
 *   `travelThroughRotationHex`/`tracksAligned` (expedition-engine.js).
 * @property {number[]} edges - `[a, b]`, two local hex-edge directions (0-5, matching
 *   `HEX_DIRECTIONS`' order) the track joins at orientation 0.
 * @property {{type: string, value: number}} [op] - The operator-wheel skin: transforms a
 *   travelling value. `type` is one of `"+"`, `"-"`, `"*"`, `"/"` (the same op-string
 *   vocabulary as Reckoner's Reframe and the "chain" constraint) or `"inverse"` (negation,
 *   which ignores `value`).
 * @property {string} [flow] - The current-turner skin: `"AB"` admits a value only entering
 *   from `edges[0]`'s side, `"BA"` only from `edges[1]`'s side, `"both"` (default) either way.
 * @property {string} [signature] - The signal-prism skin: an opaque label `tracksAligned`
 *   compares against a neighbouring tile's track. Unset on both sides always aligns.
 *
 * @typedef {Object} ConstraintGridConstraint - One rule in a `"constraintGrid"` objective's
 *   `constraints` list (expedition-engine.js's `constraintSatisfied`), checked against the
 *   live `value` of each object in `objectIds`.
 * @property {string} kind - `"sum"` (total equals `target`), `"allDifferent"` (no two equal —
 *   weaker than `useEachOnce` below), `"parity"` (every value matches `parity`), `"lessThan"`/
 *   `"greaterThan"` (compares `objectIds[0]` and `[1]`), `"chain"` (Reframe-set operators
 *   evaluated left to right against `target` — see `valueIds`/`operatorIds` below, the one
 *   kind that does not use `objectIds`), `"useEachOnce"` (the group's values are exactly the
 *   set `range[0]..range[1]`, once each — the Hive Ledger's "use 1-7 once"), `"parityCount"`
 *   (exactly `count` values match `parity` — "have one even value", distinct from `"parity"`
 *   which requires every cell to match), or `"primeCount"` (exactly `count` values are prime).
 * @property {string[]} [objectIds] - The group's cells, for every kind except `"chain"`.
 * @property {number} [target] - Required by `"sum"` and `"chain"`.
 * @property {string} [parity] - `"odd"` or `"even"`, required by `"parity"`/`"parityCount"`.
 * @property {number} [count] - Required by `"parityCount"`/`"primeCount"`.
 * @property {number[]} [range] - `[min, max]`, required by `"useEachOnce"`.
 * @property {string[]} [valueIds] - `"chain"` only: value-object ids, walked left to right.
 * @property {string[]} [operatorIds] - `"chain"` only: operator-object ids (their live `op`
 *   field) interleaved between `valueIds`, one fewer than `valueIds`.
 *
 * @typedef {Object} ExpeditionMechanism - PLANNED, not yet implemented beyond the rotation-hex
 *   primitive above (see EXPEDITIONS_BUILD_BRIEF.md §10.1 and §10.2). A scenario-owned
 *   interactive tile such as a constraint cell, scale or converter. Reserved shape:
 * @property {string} id
 * @property {string} kind - e.g. "operatorWheel", "constraintCell", "scale", "converter".
 * @property {string} pos - A hex key.
 * @property {Object} state - Mechanism-specific state (current operation, orientation, …).
 *
 * A board tile (`state.board[hex]`) is `{ q, r, terrain, blockedUntilTurn?, stackLimit? }`.
 * terrain is "clear" | "difficult" | "blocked". blockedUntilTurn is a generic,
 * already-implemented reservation (see expedition-commander.js's Hollow Bough) distinct from
 * ExpeditionMechanism above: it blocks entry only until a given turn, with no kind-specific
 * behaviour. stackLimit (default 1, checked by interactObject's drop) is how many objects may
 * share the hex at once — e.g. Unequal Crossing's redesigned scale hexes (terrain "blocked",
 * stackLimit 2) hold both of a side's loads together, placed from any of the hex's six
 * neighbours rather than by standing on it.
 *
 * @typedef {Object} ExpeditionObjective
 * @property {string} family - A key into EXPEDITION_OBJECTIVE_FAMILIES.
 * @property {*} [param] - Family-specific parameters (hexes, target, sequence, …).
 * @property {ConstraintGridConstraint[]} [constraints] - Only for `family: "constraintGrid"`
 *   (expedition-engine.js's `constraintSatisfied`): complete once every listed constraint is
 *   independently satisfied. A Hive Ledger group (§4.3) is exactly one of these, with its
 *   `objectIds` built from a hex-group helper (`flowerGroup`/`hexRay`/`hexRing`/`ringSector`/
 *   `ringOppositePairs`) rather than a new objective family of its own.
 * @property {string[]} [sumHexes] - Only for `family: "capture"`: an optional secondary
 *   AND-condition (The Rooststorm's directional-sum layer) — complete additionally requires
 *   the live value total of every object at these hexes to equal `sumTarget`. Undefined on an
 *   ordinary capture map (e.g. The Maybe-Flock Roost), which is unaffected.
 * @property {Array<{hexes: string[], max: number, label?: string, openWhenOrientation?: {objectId: string, orientations: number[]}}>} [capacityLimits] - A
 *   failure condition layered on top of any family (evaluateObjective checks it before the
 *   family dispatch): if any listed hex group's live object-value total ever exceeds `max`,
 *   the expedition fails immediately (`{complete: false, failed: true}`, which
 *   refreshExpeditionStatus treats as an instant loss). Used by Nine Across the Turning
 *   Bridge's two bridge sections. `openWhenOrientation` (added for that map's 2026-09-17
 *   rotation-hex rebuild) optionally gates `max` to `0` unless a named rotation hex's live
 *   `orientation` is one of the listed values — a closed wind vane shuts its section to any
 *   weight at all, fully visibly, rather than merely reducing the cap.
 * @property {string} [centreHex] - "orderedRoute" only (The Widdershins Path): once
 *   state.counters.routeProgress reaches sequence.length, completion also requires a living
 *   player standing on this hex. Optional — other orderedRoute maps that only care about the
 *   sequence itself are unaffected.
 *
 * An "orderedRoute" scenario's numbered stones are ordinary objects with `kind: "stone"`,
 * `value`, `requiredFrom` (a hex key: the unit must be standing there, not merely adjacent
 * from anywhere, to visit — see visitStone in expedition-engine.js), and `reversedFrom` (the
 * alternate entry hex once an enemy's "reverse-next" behaviour sets `reversed: true`).
 * Visiting is its own command (VISIT_STONE), not a side effect of movement: a stone blocks
 * its hex like any other object, so a hero approaches it and visits from beside it.
 *
 * @typedef {Object} ExpeditionCommand - Implemented in expedition-engine.js's
 *   applyExpeditionCommand (E2). The named functions (moveUnit, interactObject, …) remain
 *   the underlying implementation and every existing caller keeps using them directly;
 *   the dispatcher is the single entry point for callers that want structured events back.
 * @property {"MOVE"|"INTERACT"|"GUARD"|"STRIKE"|"USE_ACTION"|"ROLE_ACTION"|"VISIBLE_CHECK"|"VISIT_STONE"|"END_PLAYER_PHASE"|"RESOLVE_ENEMY_PHASE"} type
 * @property {string} [unitId]
 * @property {string} [destination]
 * @property {string} [targetId]
 * @property {string} [actionId] - A discipline action key (USE_ACTION) or role action key (ROLE_ACTION).
 * @property {Object} [parameters]
 *
 * @typedef {Object} ExpeditionEvent - Implemented (applyExpeditionCommand derives these
 *   from the resulting state's newly appended history entries, plus an OBJECTIVE_UPDATED
 *   event whenever the objective's completion or progress text actually changed).
 * @property {"UNIT_MOVED"|"OBJECT_PLACED"|"INTENT_RESOLVED"|"OBJECTIVE_UPDATED"|"ACTION_RESOLVED"} type
 * @property {string} [unitId]
 * @property {string} [objectId]
 * @property {string} [enemyId]
 * @property {string} [action] - Present on ACTION_RESOLVED and INTENT_RESOLVED: the raw action name.
 * @property {Object} [detail] - Present on ACTION_RESOLVED: the full history entry.
 * @property {*} [before]
 * @property {*} [after]
 *
 * @typedef {Object} ExpeditionReferenceTrace
 * @property {number} schemaVersion - See REFERENCE_TRACE_SCHEMA_VERSION.
 * @property {string} scenarioId
 * @property {string[]} squad - Field card ids used, in deployment order.
 * @property {{label: string}[]} steps - Ordered, human-readable action labels (see
 *   scripts/simulate_unequal_crossing.mjs for the pattern this documents).
 * @property {number} finalTurn
 * @property {number} actionCount
 *
 * @typedef {Object} GeneratedExpeditionConfiguration - PLANNED (E3) generation output.
 * @property {number} schemaVersion - See GENERATED_CONFIG_SCHEMA_VERSION.
 * @property {string} blueprintId
 * @property {number} blueprintVersion
 * @property {string} seed
 * @property {Object} config - A complete, playable scenario configuration (board, units,
 *   objects, objective) built from the blueprint plus the seed.
 * @property {ExpeditionReferenceTrace} referenceSolution
 */

function fail(errors, moduleKey, scenarioId, field, message) {
  errors.push({ moduleKey, scenarioId, field, message });
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Validate one scenario blueprint against ExpeditionScenarioBlueprint. Returns a list of
 * `{ moduleKey, scenarioId, field, message }` errors — empty when the blueprint is valid.
 * @param {string} moduleKey
 * @param {ExpeditionScenarioBlueprint} scenario
 */
export function validateScenarioBlueprint(moduleKey, scenario) {
  const errors = [];
  const scenarioId = scenario?.id ?? "(missing id)";
  const at = (field, message) => fail(errors, moduleKey, scenarioId, field, message);

  if (scenario?.schemaVersion !== SCENARIO_BLUEPRINT_SCHEMA_VERSION) {
    at("schemaVersion", `must equal ${SCENARIO_BLUEPRINT_SCHEMA_VERSION}, found ${JSON.stringify(scenario?.schemaVersion)}`);
  }
  if (typeof scenario?.id !== "string" || !scenario.id) at("id", "must be a non-empty string");
  if (!Number.isInteger(scenario?.level) || scenario.level < 1 || scenario.level > 10) at("level", "must be an integer from 1 to 10");
  if (typeof scenario?.title !== "string" || !scenario.title) at("title", "must be a non-empty string");
  if (!EXPEDITION_OBJECTIVE_FAMILIES[scenario?.family]) at("family", `unknown objective family ${JSON.stringify(scenario?.family)}`);
  if (!Number.isInteger(scenario?.turns) || scenario.turns < 1 || scenario.turns > 6) at("turns", "must be an integer from 1 to 6 (no standard scenario exceeds six rounds)");
  if (typeof scenario?.rule !== "string" || !scenario.rule) at("rule", "must be a non-empty child-readable sentence");
  for (const enemyKey of scenario?.enemies || []) {
    if (!EXPEDITION_ENEMIES[enemyKey]) at("enemies", `references unknown enemy ${JSON.stringify(enemyKey)}`);
  }

  const tier = EXPEDITION_TIERS[moduleKey];
  if (tier) {
    const inRange = (value) => value >= tier.numberRange[0] && value <= tier.numberRange[1];
    if (Number.isFinite(scenario?.target) && !inRange(scenario.target)) {
      at("target", `${scenario.target} is outside the ${moduleKey} numerical range [${tier.numberRange.join(", ")}]`);
    }
    for (const value of scenario?.objects || []) {
      if (!inRange(value)) at("objects", `${value} is outside the ${moduleKey} numerical range [${tier.numberRange.join(", ")}]`);
    }
    for (const value of scenario?.sequence || []) {
      if (!inRange(value)) at("sequence", `${value} is outside the ${moduleKey} numerical range [${tier.numberRange.join(", ")}]`);
    }
  }

  validateReadinessGuidance(scenario?.readiness, at);
  return errors;
}

function validateReadinessGuidance(readiness, at) {
  if (!isPlainObject(readiness)) {
    at("readiness", "every scenario must declare readiness guidance");
    return;
  }
  if (!Number.isFinite(readiness.minimumAverageBattleValue) || readiness.minimumAverageBattleValue < 0) {
    at("readiness.minimumAverageBattleValue", "must be a non-negative number");
  }
  if (!isPlainObject(readiness.minimumRarityCounts)) {
    at("readiness.minimumRarityCounts", "must be an object mapping rarity floors to counts");
  } else {
    for (const [floor, count] of Object.entries(readiness.minimumRarityCounts)) {
      if (!RARITY_ORDER.includes(floor)) at("readiness.minimumRarityCounts", `unknown rarity floor ${JSON.stringify(floor)}`);
      if (!Number.isInteger(count) || count < 1) at("readiness.minimumRarityCounts", `count for ${floor} must be a positive integer`);
    }
  }
  if (readiness.allCardsMinimumRarity != null && !RARITY_ORDER.includes(readiness.allCardsMinimumRarity)) {
    at("readiness.allCardsMinimumRarity", `unknown rarity ${JSON.stringify(readiness.allCardsMinimumRarity)}`);
  }
  if (!Array.isArray(readiness.forbiddenRarities) || readiness.forbiddenRarities.some((r) => !RARITY_ORDER.includes(r))) {
    at("readiness.forbiddenRarities", "must be an array of known rarities");
  }
  if (!Array.isArray(readiness.capabilityRequirements)) {
    at("readiness.capabilityRequirements", "must be an array");
  } else {
    for (const requirement of readiness.capabilityRequirements) {
      if (!requirement || typeof requirement.stat !== "string" || !Number.isFinite(requirement.min)) {
        at("readiness.capabilityRequirements", `each entry needs a string stat and a numeric min, got ${JSON.stringify(requirement)}`);
      }
    }
  }
}

/**
 * Validate a VisibleCheckDeclaration (EXPEDITIONS_CARD_COMBAT_CONTRACT.md §4). Pure and
 * standalone — not wired into validateScenarioBlueprint, since checks are declared on
 * concrete scenario objects (unequal-crossing.js-style config files), not on the abstract
 * thirty-brief catalogue in expedition-data.js that validateScenarioBlueprint checks.
 * @param {VisibleCheckDeclaration} check
 * @returns {string[]} human-readable errors; empty when the declaration is valid.
 */
export function validateVisibleCheckDeclaration(check) {
  const errors = [];
  if (!isPlainObject(check)) return ["a visible check declaration must be an object"];
  if (!Number.isInteger(check.statIndex) || check.statIndex < 0 || check.statIndex > 4) errors.push("statIndex must be an integer from 0 to 4");
  if (!Number.isFinite(check.difficulty)) errors.push("difficulty must be a number");
  if (check.bonus != null && !Number.isFinite(check.bonus)) errors.push("bonus, when given, must be a number");
  if (check.bonus != null && (typeof check.bonusLabel !== "string" || !check.bonusLabel)) errors.push("bonusLabel is required whenever bonus is set, so the bonus is never silent");
  if (typeof check.description !== "string" || !check.description) errors.push("description must be a non-empty, child-readable string");
  return errors;
}

/**
 * Validate one module's scenario list as a set: per-scenario field validation plus the
 * cross-scenario invariants (no duplicate ids, missions 9/10 recommend full Epic). Exported
 * separately from validateAllExpeditionContent so tests can check the invariant against a
 * deliberately tampered list without touching the real, shared EXPEDITION_SCENARIOS.
 * @param {string} moduleKey
 * @param {ExpeditionScenarioBlueprint[]} scenarios
 */
export function validateExpeditionScenarioSet(moduleKey, scenarios) {
  const errors = [];
  const seenIds = new Set();
  for (const scenario of scenarios) {
    for (const error of validateScenarioBlueprint(moduleKey, scenario)) errors.push(error);
    if (scenario?.id) {
      if (seenIds.has(scenario.id)) fail(errors, moduleKey, scenario.id, "id", "duplicate scenario id within this module");
      seenIds.add(scenario.id);
    }
  }
  // Missions 9 and 10 recommend every deployed card be Epic or better (EXPEDITIONS_BUILD_BRIEF.md
  // §3.1) — advisory, not a hard gate (see expedition-readiness.js's file header).
  for (const scenario of scenarios) {
    if (scenario.level >= 9 && scenario.readiness?.allCardsMinimumRarity !== "epic") {
      fail(errors, moduleKey, scenario.id, "readiness.allCardsMinimumRarity", "missions 9 and 10 must recommend every deployed card be Epic or Legendary");
    }
  }
  return errors;
}

/**
 * Validate every authored scenario across all three modules. Returns a flat list of
 * `{ moduleKey, scenarioId, field, message }` errors, empty when everything is valid.
 * This is the build-time check `scripts/validate_expeditions.mjs` runs on every `npm test`.
 */
export function validateAllExpeditionContent() {
  const errors = [];
  for (const [moduleKey, scenarios] of Object.entries(EXPEDITION_SCENARIOS)) {
    errors.push(...validateExpeditionScenarioSet(moduleKey, scenarios));
  }
  return errors;
}

function formatContentErrors(errors) {
  return errors.map((e) => `${e.moduleKey}/${e.scenarioId}: ${e.field} — ${e.message}`).join("\n");
}

/**
 * Throws with every precise scenario+field error listed, or does nothing when content is
 * valid. Intended for build scripts (`scripts/validate_expeditions.mjs`) that should fail
 * loudly and specifically rather than continuing on broken content.
 */
export function assertValidExpeditionContent() {
  const errors = validateAllExpeditionContent();
  if (errors.length) {
    throw new Error(`Invalid Expedition content (${errors.length} error${errors.length === 1 ? "" : "s"}):\n${formatContentErrors(errors)}`);
  }
}
