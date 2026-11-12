export const RULES_VERSION = 2;
export const SCHEMA_VERSION = 2;
export const GENERATOR_VERSION = 1;
export const ENGINE_VERSION = 2;
export const MODULE_KEY = "primary";

export const STAT_KEYS = ["arithmetic", "geometry", "logic", "science", "speed"];
export const STAT_NAMES = ["Arithmetic", "Geometry", "Logic", "Science", "Speed"];
export const STAT = { A: 0, G: 1, L: 2, S: 3, V: 4 };

export const FAMILY_IDS = ["four-locks", "turning-ravine", "unequal-crossing", "maybe-flock", "hollow-bough"];
export const PUZZLE_KINDS = { "four-locks": "sudoku4", "turning-ravine": "equation-wheels", "unequal-crossing": "balance", "maybe-flock": "nonogram5", "hollow-bough": "polyhex" };

export const DEADLINE_ROUNDS = 5;
export const AP_PER_ROUND = 2;
export const SQUAD_SIZE = 3;
export const STARS_FIRST_CLEAR = 3;

// E, NE, NW, W, SW, SE as axial [dq, dr].
export const DIRECTIONS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

export const TERRAIN_COST = { floor: 1, path: 1, bridge: 1, clearing: 1, roots: 2 };
export const SIGHT_BLOCKING_TERRAIN = ["hedge", "gate"];

export const CHARGE_CAPACITY = [4, 6, 7, 7, 8];

// Stat vector order A,G,L,S,V. Index 0 = tier 1.
export const COMMISSION_PROFILES = [
  { number: [4, 0, 2, 0, 0], shape: [0, 4, 0, 0, 2], sustain: [0, 0, 0, 5, 2] },
  { number: [6, 0, 5, 0, 0], shape: [0, 6, 0, 0, 2], sustain: [0, 0, 0, 6, 4] },
  { number: [7, 0, 7, 0, 0], shape: [0, 7, 0, 0, 4], sustain: [0, 0, 6, 6, 4] },
  { number: [7, 0, 7, 0, 0], shape: [0, 8, 0, 0, 4], sustain: [0, 0, 6, 7, 4] },
  { number: [8, 0, 8, 0, 0], shape: [0, 8, 0, 0, 7], sustain: [0, 0, 7, 8, 4] },
];
export const ALCOVE = { geometryBonus: 2, speedRequired: 6, prepareAP: 1 };

export const JOBS = ["number", "shape", "sustain"];

export function commissionProfile(tier, job, viaAlcove = false) {
  const base = COMMISSION_PROFILES[tier - 1][job];
  if (!viaAlcove) return [...base];
  const alt = [...base];
  alt[STAT.G] = Math.max(0, alt[STAT.G] - ALCOVE.geometryBonus);
  alt[STAT.V] = ALCOVE.speedRequired;
  return alt;
}

export const stationMaxIntegrity = (tier) => 10 + 2 * tier;
export const orchardMaxIntegrity = (tier) => 18 + 2 * tier;
export const hazardPower = (tier) => 3 + tier;
export const hazardOrchardDamage = (tier) => 2 + tier;
export const nestDamage = (tier) => 1 + tier;

export const ENEMY_RULES = {
  jammer: { artId: "hookmole", health: (t) => 8 + 2 * t, armour: (t) => 1 + Math.floor(t / 2), initiative: 5, move: 3, range: 1, disruption: (t) => 3 + t, strike: (t) => 3 + t },
  hunter: { artId: "scruffcrow", health: (t) => 5 + 2 * t, armour: () => 1, initiative: 3, move: 3, range: 3, disruption: () => 0, strike: (t) => 3 + t, flies: true },
  breaker: { artId: "strawling", health: (t) => 7 + 2 * t, armour: (t) => Math.floor(t / 2), initiative: 7, move: 2, range: 1, disruption: () => 0, strike: (t) => 4 + t },
  rewinder: { artId: "crosswind", health: (t) => 6 + 2 * t, armour: () => 1, initiative: 4, move: 2, range: 3, disruption: (t) => 3 + t, strike: (t) => 2 + t },
};

export const SCOUT_MARK = 2;
export const MAX_ADJACENT_SUPPORT = 2;
export const STORM_ORCHARD_COST = 2;
export const STORM_ENEMY_DAMAGE = 4;
export const STORM_RADIUS = 2;
export const REPAIR_STREAM_AMOUNT = 2;
export const STRIKE_WINDOW_ARMOUR = 2;
export const SHELTER_SHIELD = 2;
export const RESERVE_BENEFIT_THRESHOLD = 5;

export const HAND_CARDS = {
  arithmetic: ["exact-blow", "shared-charge"],
  geometry: ["true-shift", "wide-brace"],
  logic: ["counterturn", "linked-lock"],
  science: ["field-repair", "root-shelter"],
  speed: ["dash", "intercept"],
};
export const ROLE_CARD = { tank: "stand-together", healer: "mend-and-mend-again", wizard: "crosswire", melee: "driving-blow", ranged: "marked-shot" };
export const ROLE_DISPLAY = { tank: "Guardian", healer: "Mender", wizard: "Reckoner", melee: "Mover", ranged: "Scout" };
export const STRIKE_RANGE = { ranged: 3, wizard: 2, tank: 1, healer: 1, melee: 1 };

export const CARD_LABELS = {
  "exact-blow": "Exact Blow", "shared-charge": "Shared Charge", "true-shift": "True Shift", "wide-brace": "Wide Brace",
  counterturn: "Counterturn", "linked-lock": "Linked Lock", "field-repair": "Field Repair", "root-shelter": "Root Shelter",
  dash: "Dash", intercept: "Intercept", "stand-together": "Stand Together", "mend-and-mend-again": "Mend and Mend Again",
  crosswire: "Crosswire", "driving-blow": "Driving Blow", "marked-shot": "Marked Shot", "second-wind": "Second Wind",
};

export const COMMAND_TYPES = [
  "move", "dash", "strike", "exact-blow", "marked-shot", "driving-blow",
  "guard", "repair", "lock", "stabilise", "calibrate", "hold", "prepare-alcove", "counterturn",
  "shared-charge", "field-repair", "true-shift", "wide-brace", "linked-lock", "root-shelter",
  "stand-together", "mend-and-mend-again", "intercept", "operate", "crosswire", "second-wind",
  "refocus", "wait", "edit-draft", "compare-loads", "request-hint", "undo", "end-round",
];
export const HAND_COMMANDS = ["exact-blow", "shared-charge", "true-shift", "wide-brace", "counterturn", "linked-lock", "field-repair", "root-shelter", "dash", "intercept", "stand-together", "mend-and-mend-again", "crosswire", "driving-blow", "marked-shot", "second-wind"];
