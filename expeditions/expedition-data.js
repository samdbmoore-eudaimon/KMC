export const EXPEDITION_STAT_NAMES = ["Arithmetic", "Geometry", "Logic", "Science", "Speed"];

export const EXPEDITION_TIERS = {
  primary: {
    key: "primary",
    name: "Ninefold Orchard",
    complexity: "guided",
    squadSize: 3,
    turnLimit: 4,
    boardHexes: [25, 39],
    objectiveLayers: 1,
    intentVisibility: "full",
    numberRange: [0, 20],
    targetMinutes: 4,
    hardLimitMinutes: 7,
  },
  junior: {
    key: "junior",
    name: "Little Reckoning",
    complexity: "tactical",
    squadSize: 3,
    turnLimit: 5,
    boardHexes: [31, 49],
    objectiveLayers: 2,
    intentVisibility: "full-after-first-action",
    numberRange: [-20, 100],
    targetMinutes: 5,
    hardLimitMinutes: 8,
  },
  intermediate: {
    key: "intermediate",
    name: "Gifford",
    complexity: "intricate",
    squadSize: 4,
    turnLimit: 5,
    boardHexes: [37, 61],
    objectiveLayers: 3,
    intentVisibility: "partial",
    numberRange: [-100, 1000],
    targetMinutes: 6,
    hardLimitMinutes: 9,
  },
};

export const EXPEDITION_ROLES = {
  tank: {
    name: "Guardian",
    basic: "guard",
    rule: "Protect an adjacent ally or object until this character next acts.",
  },
  healer: {
    name: "Mender",
    basic: "restore",
    rule: "Restore one heart or repair one damaged scenario object within two hexes.",
  },
  wizard: {
    name: "Reckoner",
    basic: "reframe",
    rule: "Change the operation or orientation of one adjacent puzzle tile.",
  },
  melee: {
    name: "Mover",
    basic: "shove",
    rule: "After a close action, push its target one open hex.",
  },
  ranged: {
    name: "Scout",
    basic: "mark",
    rule: "Mark a visible target so the next allied action against it gains one support.",
  },
};

export const EXPEDITION_DISCIPLINES = [
  {
    key: "arithmetic",
    stat: 0,
    name: "Arithmetic",
    actions: [
      { key: "combine", name: "Combine", cost: 1, rule: "Add the values of two adjacent movable objects." },
      { key: "split", name: "Split", cost: 1, rule: "Replace an even-valued object with two equal halves on adjacent open hexes." },
      { key: "exact", name: "Exact Count", cost: 1, rule: "Resolve an interaction with a bonus when its final value exactly matches its target." },
    ],
  },
  {
    key: "geometry",
    stat: 1,
    name: "Geometry",
    actions: [
      { key: "shift", name: "True Shift", cost: 1, rule: "Push or pull an object along a straight hex line." },
      { key: "shape", name: "Shape Field", cost: 1, rule: "Affect a line, triangle, ring or symmetric set of marked hexes." },
      { key: "measure", name: "Measure", cost: 1, rule: "Interact at an exact distance and ignore one intervening low obstacle." },
    ],
  },
  {
    key: "logic",
    stat: 2,
    name: "Logic",
    actions: [
      { key: "predict", name: "Predict", cost: 1, rule: "Reveal one hidden enemy intention or one concealed scenario constraint." },
      { key: "order", name: "Put in Order", cost: 1, rule: "Swap two initiative positions or two adjacent ordered tiles." },
      { key: "deduce", name: "Deduce", cost: 1, rule: "Rule out one false objective location or lock one correct puzzle value." },
    ],
  },
  {
    key: "science",
    stat: 3,
    name: "Science",
    actions: [
      { key: "transform", name: "Transform", cost: 1, rule: "Advance one adjacent object through its scenario state cycle." },
      { key: "stabilise", name: "Stabilise", cost: 1, rule: "Prevent one object, hex or value from changing during the next enemy phase." },
      { key: "chain", name: "Chain Reaction", cost: 1, rule: "Repeat a one-point effect through a connected group." },
    ],
  },
  {
    key: "speed",
    stat: 4,
    name: "Speed",
    actions: [
      { key: "dash", name: "Dash", cost: 1, rule: "Move again after completing an interaction." },
      { key: "relay", name: "Relay", cost: 1, rule: "Pass a carried object through a chain of adjacent allies." },
      { key: "interrupt", name: "Interrupt", cost: 1, rule: "Move one hex when a visible enemy begins its action." },
    ],
  },
];

export const EXPEDITION_TRAITS = [
  { key: "precise", name: "Precise", stat: 0, rule: "The first exact match each round gains one support." },
  { key: "surefooted", name: "Sure-footed", stat: 1, rule: "Ignore the first difficult hex entered each round." },
  { key: "foresight", name: "Foresight", stat: 2, rule: "Preview one additional consequence before confirming an action." },
  { key: "adaptable", name: "Adaptable", stat: 3, rule: "Once per expedition, use the second-highest statistic for an action." },
  { key: "quick", name: "Quick", stat: 4, rule: "Win tied initiative and gain one free opening step." },
];

export const EXPEDITION_OBJECTIVE_FAMILIES = {
  eliminate: { name: "Clear the board", evaluator: "eliminate" },
  capture: { name: "Capture and hold", evaluator: "capture" },
  exactSum: { name: "Exact total", evaluator: "exactSum" },
  balance: { name: "Balance", evaluator: "balance" },
  orderedRoute: { name: "Ordered route", evaluator: "orderedRoute" },
  delivery: { name: "Delivery", evaluator: "delivery" },
  containment: { name: "Containment", evaluator: "containment" },
  connect: { name: "Repair the network", evaluator: "connect" },
  rescue: { name: "Rescue and escape", evaluator: "rescue" },
  protect: { name: "Protect", evaluator: "protect" },
  optimise: { name: "Efficiency", evaluator: "optimise" },
  constraintGrid: { name: "Constraint grid", evaluator: "constraintGrid" },
};

// Schema version for every entry in EXPEDITION_SCENARIOS (see "ExpeditionScenarioBlueprint"
// in expedition-schema.js). Bump this, and migrate readers, whenever a blueprint field's
// stored meaning changes — never when only display wording changes.
export const EXPEDITION_SCENARIO_SCHEMA_VERSION = 1;

// The collection-power table from EXPEDITIONS_BUILD_BRIEF.md §3.1, keyed by mission level.
// Identical for every module — the brief's table does not vary these numbers by module.
// minimumRarityCounts keys are rarity floors: { epic: 1 } means "recommend at least one
// deployed field card at or above Epic". allCardsMinimumRarity is a recommendation for
// every deployed field card. Legendary always counts as Epic or better (see rarityRank in
// expedition-roster.js and meetsRarityFloor in expedition-readiness.js). None of this ever
// counts a Commander: readiness only ever reads deployed field cards.
//
// ADVISORY ONLY: per the user (2026-09-14), this never disables Embark. Any squad may
// attempt any mission; underpowered squads face the same fixed enemy numbers as anyone
// else and are expected to get overwhelmed on their own stats, not turned away at the
// door. See expedition-readiness.js's file header for the full rationale — that module,
// not the brief's original "Embark is disabled" wording, is the current source of truth
// for this rule's actual behaviour.
export const EXPEDITION_READINESS_BY_LEVEL = {
  1: { minimumAverageBattleValue: 12, minimumRarityCounts: {}, allCardsMinimumRarity: null, forbiddenRarities: [], capabilityRequirements: [] },
  2: { minimumAverageBattleValue: 12, minimumRarityCounts: {}, allCardsMinimumRarity: null, forbiddenRarities: [], capabilityRequirements: [] },
  3: { minimumAverageBattleValue: 16, minimumRarityCounts: { uncommon: 2 }, allCardsMinimumRarity: null, forbiddenRarities: [], capabilityRequirements: [] },
  4: { minimumAverageBattleValue: 16, minimumRarityCounts: { uncommon: 2 }, allCardsMinimumRarity: null, forbiddenRarities: [], capabilityRequirements: [] },
  5: { minimumAverageBattleValue: 22, minimumRarityCounts: { rare: 2 }, allCardsMinimumRarity: null, forbiddenRarities: [], capabilityRequirements: [] },
  6: { minimumAverageBattleValue: 22, minimumRarityCounts: { rare: 2 }, allCardsMinimumRarity: null, forbiddenRarities: [], capabilityRequirements: [] },
  7: { minimumAverageBattleValue: 28, minimumRarityCounts: { epic: 1 }, allCardsMinimumRarity: null, forbiddenRarities: ["common"], capabilityRequirements: [] },
  8: { minimumAverageBattleValue: 28, minimumRarityCounts: { epic: 1 }, allCardsMinimumRarity: null, forbiddenRarities: ["common"], capabilityRequirements: [] },
  9: { minimumAverageBattleValue: 32, minimumRarityCounts: {}, allCardsMinimumRarity: "epic", forbiddenRarities: [], capabilityRequirements: [] },
  10: { minimumAverageBattleValue: 34, minimumRarityCounts: {}, allCardsMinimumRarity: "epic", forbiddenRarities: [], capabilityRequirements: [] },
};

// Stamps every authored scenario with its schema version and the readiness band for its
// level, so the readiness rule lives once per level instead of being retyped thirty times.
function withScenarioContract(scenarios) {
  return scenarios.map((scenario) => ({
    schemaVersion: EXPEDITION_SCENARIO_SCHEMA_VERSION,
    ...scenario,
    readiness: EXPEDITION_READINESS_BY_LEVEL[scenario.level],
  }));
}

const RAW_EXPEDITION_SCENARIOS = {
  primary: [
    { id: "po_unequal_crossing", level: 1, title: "The Unequal Crossing", family: "balance", turns: 4, target: 7, objects: [2, 3, 4, 5], enemies: ["hookmole", "hookmole"], rule: "Balance both platforms, then place any hero on the exit arch." },
    { id: "po_cider_run", level: 2, title: "The Cider Run", family: "exactSum", turns: 4, target: 15, objects: [2, 3, 8, 9, 10, 12], enemies: ["scruffcrow"], rule: "Fill the press gate with two presses totalling the printed target, before the cider floods your plan." },
    { id: "po_nine_across", level: 3, title: "Nine Across the Turning Bridge", family: "delivery", turns: 4, objects: [2, 3, 4], enemies: ["crosswind"], rule: "Deliver all three loads. Crosswind can turn a wind vane and shut its whole bridge section." },
    { id: "po_hedgejaw_maze", level: 4, title: "The Hedgejaw Maze", family: "orderedRoute", turns: 5, sequence: [3, 5, 9], enemies: ["hedgejaw"], rule: "Visit the three stones in increasing order, before the Hedgejaw grows across your next approach." },
    { id: "po_maybe_roost", level: 5, title: "The Maybe-Flock Roost", family: "capture", turns: 4, target: 3, enemies: ["maybe_finch", "maybe_finch", "maybe_finch"], rule: "Hold all three whistle posts at the end of one round." },
    { id: "po_rootfire_relay", level: 6, title: "The Rootfire Relay", family: "constraintGrid", turns: 4, target: 10, objects: [1, 2, 1, 2, 2], enemies: ["strawling"], rule: "Relay the whole root chain to ten, with the trunk root even, before Strawling wilts it." },
    { id: "po_count_the_murder", level: 7, title: "Murder at Moonfall", family: "containment", turns: 4, enemies: ["crowbreaker"], rule: "Surround the Crowbreaker on all six sides — three are already hedge-walled." },
    { id: "po_hollow_bough", level: 8, title: "The Hollow Bough Awakens", family: "protect", turns: 4, enemies: ["overgrowth"], rule: "Keep the memorial standing until the fourth whistle — Overgrowth will come for whoever it can reach." },
    { id: "po_one_short", level: 9, title: "The Orchard Lockdown", family: "constraintGrid", turns: 4, enemies: ["nearly"], rule: "Open all three Hive Ledger gates at once, before Nearly corrupts one." },
    { id: "po_first_whistle", level: 10, title: "The First Whistle", family: "eliminate", turns: 5, enemies: ["first_root"], rule: "Turn both branches true to open the network, then defeat First Root — it cannot be struck until the network is live." },
  ],
  junior: [
    { id: "lr_smudged_stones", level: 1, title: "The Smudged Stones", family: "constraintGrid", turns: 2, target: 24, objects: [3, 5, 7, 9], enemies: ["smudge", "smudge"], rule: "Restore the missing operators so all paths evaluate to 24." },
    { id: "lr_rough_estimate", level: 2, title: "Roughly at the Market", family: "optimise", turns: 5, target: 50, enemies: ["mist_vendor", "mist_vendor"], rule: "Collect goods worth at least 50 while carrying no more than 20 weight." },
    { id: "lr_backwards_baron", level: 3, title: "The Backwards Courtyard", family: "orderedRoute", turns: 5, sequence: [21, 13, 8, 5, 3, 2, 1], enemies: ["reverse_knight"], rule: "Complete the reversed sequence while the Baron undoes the last unguarded step." },
    { id: "lr_fog_lanterns", level: 4, title: "Lanterns in the Forgetting Fog", family: "connect", turns: 1, target: 4, enemies: ["fogling", "fogling"], rule: "Connect four lanterns with the shortest unobstructed network." },
    { id: "lr_guesswork_lines", level: 5, title: "General Guesswork's Lines", family: "eliminate", turns: 5, enemies: ["guess_guard", "guess_archer", "guess_guard"], rule: "Clear the formation, but attacks only land when their estimated interval contains the true value." },
    { id: "lr_unshape", level: 6, title: "A Shape Coming Apart", family: "containment", turns: 5, target: 6, enemies: ["unshape"], rule: "Maintain equal perimeter on both sides while sealing six unstable edges." },
    { id: "lr_countless", level: 7, title: "The Countless Crossing", family: "optimise", turns: 5, enemies: ["countless_swarm"], rule: "Create a route that visits every required group exactly once." },
    { id: "lr_nought_house", level: 8, title: "Madam Nought's House", family: "rescue", turns: 5, target: 0, enemies: ["nought_shadow", "nought_shadow"], rule: "Reduce each locked expression to zero and rescue the courier." },
    { id: "lr_almost_mirror", level: 9, title: "The Almost Mirror", family: "constraintGrid", turns: 5, enemies: ["almost_echo", "almost_echo"], rule: "Make both halves congruent while each echo copies the previous move imperfectly." },
    { id: "lr_counted_in", level: 10, title: "Counted In", family: "capture", turns: 5, target: 5, enemies: ["muddle_fragment", "muddle_fragment", "muddle_fragment"], rule: "Give every fragment exactly one valid place in the five-region partition." },
  ],
  intermediate: [
    { id: "gf_examination_clock", level: 1, title: "The Examination Clock", family: "optimise", turns: 5, target: 12, enemies: ["proctor", "proctor"], rule: "Schedule four tasks through three stations before the twelfth bell." },
    { id: "gf_tracker_network", level: 2, title: "Cross's Pursuit Network", family: "orderedRoute", turns: 5, enemies: ["tracker", "tracker", "hound"], rule: "Choose a minimum-cost route while every used edge increases a neighbouring edge's cost." },
    { id: "gf_sealed_archive", level: 3, title: "The Sealed Archive", family: "constraintGrid", turns: 5, enemies: ["archive_warden", "cipher_moth"], rule: "Satisfy row, column and parity constraints to open three linked vaults." },
    { id: "gf_vex_demonstration", level: 4, title: "Vex's Demonstration", family: "exactSum", turns: 5, enemies: ["vex_assistant", "vex_assistant"], rule: "Construct two algebraically equivalent totals using disjoint tiles." },
    { id: "gf_bramwell_compromise", level: 5, title: "Bramwell's Compromise", family: "balance", turns: 5, enemies: ["pressure_valve", "pressure_valve"], rule: "Balance flow, pressure and cost; no arrangement can maximise all three." },
    { id: "gf_vale_files", level: 6, title: "Vale's Filing System", family: "connect", turns: 5, enemies: ["clerk_drone", "clerk_drone", "clerk_drone"], rule: "Build a spanning network satisfying degree limits while Vale closes one predicted edge." },
    { id: "gf_whistles_price", level: 7, title: "Whistle's Price", family: "optimise", turns: 5, enemies: ["broker", "collector"], rule: "Complete three trades satisfying simultaneous percentage, ratio and capacity constraints." },
    { id: "gf_scarrow_ring", level: 8, title: "Scarrow's Ring", family: "eliminate", turns: 5, enemies: ["scarrow", "second", "second"], rule: "Win the combat while controlling the median-valued hex at each round end." },
    { id: "gf_chancellor_ledger", level: 9, title: "The Chancellor's Ledger", family: "constraintGrid", turns: 6, enemies: ["ledger_guard", "ledger_guard"], rule: "Deduce six hidden entries from inequalities, totals and mutually exclusive statements." },
    { id: "gf_engines_answer", level: 10, title: "The Engine's Answer", family: "optimise", turns: 6, enemies: ["engine_process", "engine_process", "engine_process"], rule: "Route three signals through a changing weighted graph and minimise the maximum delay." },
  ],
};

export const EXPEDITION_SCENARIOS = {
  primary: withScenarioContract(RAW_EXPEDITION_SCENARIOS.primary),
  junior: withScenarioContract(RAW_EXPEDITION_SCENARIOS.junior),
  intermediate: withScenarioContract(RAW_EXPEDITION_SCENARIOS.intermediate),
};

export const EXPEDITION_ENEMIES = {
  hookmole: { name: "Hookmole", hp: 2, move: 2, defence: 4, intent: "Drag the nearest unattended crate one hex towards the burrow." },
  scruffcrow: { name: "Scruff Crow", hp: 1, move: 3, defence: 3, intent: "Move to the highest visible value and obscure it." },
  crosswind: { name: "Crosswind", hp: 3, move: 0, defence: 5, intent: "Push every unguarded load one hex east." },
  widdershins: { name: "Widdershins", hp: 2, move: 3, defence: 5, intent: "Reverse the last unguarded route marker." },
  hedgejaw: { name: "Hedgejaw", hp: 3, move: 0, defence: 5, intent: "Grow the hedge across the next required stone's only approach." },
  maybe_finch: { name: "Maybe Finch", hp: 1, move: 3, defence: 3, intent: "Contest the nearest unoccupied whistle post." },
  strawling: { name: "Strawling", hp: 2, move: 2, defence: 4, intent: "Split the largest unguarded bundle." },
  crow_swarm: { name: "Crow Swarm", hp: 5, move: 2, defence: 7, intent: "Flow towards the widest gap in the ring." },
  crowbreaker: { name: "Crowbreaker", hp: 5, move: 1, defence: 6, intent: "Close on the nearest hero and strike once in range." },
  overgrowth: { name: "Overgrowth", hp: 2, move: 1, defence: 4, intent: "Grow into the nearest empty memorial-adjacent hex." },
  nearly: { name: "The Nearly", hp: 3, move: 2, defence: 6, intent: "Reduce the largest exact basket by one." },
  forgetting_root: { name: "Forgetting Root", hp: 4, move: 0, defence: 7, intent: "Disconnect the least-supported branch." },
  first_root: { name: "First Root", hp: 6, move: 1, defence: 4, intent: "Rewire the network shut while it is closed; once it opens, close on the nearest hero and strike." },
  smudge: { name: "Walking Smudge", hp: 1, move: 2, defence: 4, intent: "Obscure the nearest visible operator." },
  mist_vendor: { name: "Mist Vendor", hp: 2, move: 2, defence: 5, intent: "Increase the lightest item's apparent value by ten." },
  reverse_knight: { name: "Reverse Knight", hp: 3, move: 2, defence: 6, intent: "Undo the last unguarded route marker." },
  fogling: { name: "Fogling", hp: 2, move: 2, defence: 5, intent: "Extinguish the least-connected lantern." },
  guess_guard: { name: "Guesswork Guard", hp: 3, move: 2, defence: 6, intent: "Advance and defend an estimated interval." },
  guess_archer: { name: "Guesswork Archer", hp: 2, move: 1, defence: 5, intent: "Mark the widest visible interval, then strike through it." },
  unshape: { name: "Unshape", hp: 5, move: 1, defence: 7, intent: "Remove one exposed boundary edge." },
  countless_swarm: { name: "Countless Swarm", hp: 6, move: 2, defence: 7, intent: "Divide into the largest unoccupied region." },
  nought_shadow: { name: "Nought Shadow", hp: 2, move: 2, defence: 6, intent: "Replace the nearest non-zero operation with subtraction." },
  almost_echo: { name: "Almost Echo", hp: 3, move: 2, defence: 7, intent: "Repeat the previous player transformation with one changed value." },
  muddle_fragment: { name: "Muddle Fragment", hp: 2, move: 3, defence: 6, intent: "Move into the region with the fewest valid placements." },
  proctor: { name: "Clockwork Proctor", hp: 3, move: 2, defence: 6, intent: "Block the station with the shortest remaining task." },
  tracker: { name: "Tracker", hp: 3, move: 3, defence: 7, intent: "Close the cheapest edge towards the nearest hero." },
  hound: { name: "Ledger Hound", hp: 2, move: 4, defence: 6, intent: "Pursue the hero with the lowest initiative." },
  archive_warden: { name: "Archive Warden", hp: 4, move: 1, defence: 8, intent: "Lock a row containing two known entries." },
  cipher_moth: { name: "Cipher Moth", hp: 2, move: 3, defence: 6, intent: "Conceal one revealed constraint." },
  vex_assistant: { name: "Vex's Assistant", hp: 3, move: 2, defence: 7, intent: "Move one term between the two expressions." },
  pressure_valve: { name: "Runaway Valve", hp: 3, move: 0, defence: 8, intent: "Increase the greatest pressure difference." },
  clerk_drone: { name: "Clerk Drone", hp: 2, move: 2, defence: 7, intent: "Close the active edge with greatest betweenness." },
  broker: { name: "Gifford Broker", hp: 4, move: 2, defence: 8, intent: "Change one visible exchange rate by five percent." },
  collector: { name: "Debt Collector", hp: 4, move: 3, defence: 8, intent: "Confiscate the highest-value unattended token." },
  scarrow: { name: "Scarrow", hp: 7, move: 3, defence: 9, intent: "Strike the median controller and occupy the central ring." },
  second: { name: "Second", hp: 3, move: 2, defence: 7, intent: "Support Scarrow or contest the median hex." },
  ledger_guard: { name: "Ledger Guard", hp: 4, move: 2, defence: 8, intent: "Make one currently true statement temporarily false." },
  engine_process: { name: "Engine Process", hp: 4, move: 2, defence: 9, intent: "Increase the weight of the busiest signal edge." },
};

export function expeditionScenario(moduleKey, scenarioId) {
  return (EXPEDITION_SCENARIOS[moduleKey] || []).find((scenario) => scenario.id === scenarioId) || null;
}

export function expeditionScenarioForLevel(moduleKey, level) {
  return (EXPEDITION_SCENARIOS[moduleKey] || []).find((scenario) => scenario.level === level) || null;
}
