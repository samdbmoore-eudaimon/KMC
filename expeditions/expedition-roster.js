import { JUNIOR_CARDS, JUNIOR_BOSSES, JUNIOR_CARD_CLASS } from "../generators/junior-generators.js";
import { PRIMARY_CARDS, PRIMARY_BOSSES, PRIMARY_CARD_CLASS } from "../generators/primary-generators.js";
import { INTERMEDIATE_CARDS, INTERMEDIATE_BOSSES, INTERMEDIATE_CARD_CLASS } from "../generators/intermediate-generators.js";
import { EXPEDITION_DISCIPLINES, EXPEDITION_ROLES, EXPEDITION_TRAITS } from "./expedition-data.js";

const MODULE_CARD_DATA = {
  primary: { cards: PRIMARY_CARDS, bosses: PRIMARY_BOSSES, classes: PRIMARY_CARD_CLASS },
  junior: { cards: JUNIOR_CARDS, bosses: JUNIOR_BOSSES, classes: JUNIOR_CARD_CLASS },
  intermediate: { cards: INTERMEDIATE_CARDS, bosses: INTERMEDIATE_BOSSES, classes: INTERMEDIATE_CARD_CLASS },
};

const ROLE_ORDER = ["tank", "healer", "wizard", "melee", "ranged"];

const SIGNATURES = {
  arithmetic: {
    tank: { name: "Measured Guard", rule: "Guard strength equals Arithmetic; excess guard may be transferred to an adjacent object." },
    healer: { name: "Fair Share", rule: "Divide a restoration total exactly between two adjacent allies." },
    wizard: { name: "Reckon Anew", rule: "Replace one visible value with the difference between it and Arithmetic." },
    melee: { name: "Counted Blow", rule: "Strike with Arithmetic and gain one impact when the final result is exact." },
    ranged: { name: "Numbered Shot", rule: "Strike at range equal to the number of distinct values between attacker and target." },
  },
  geometry: {
    tank: { name: "Living Wall", rule: "Create a straight guarded edge whose length is based on Geometry." },
    healer: { name: "Mending Circle", rule: "Restore every ally on a completed ring of adjacent hexes." },
    wizard: { name: "Fold the Field", rule: "Reflect one movable object across a marked line." },
    melee: { name: "True Angle", rule: "Move then strike along a different hex direction for bonus impact." },
    ranged: { name: "Sightline", rule: "Strike through a clear line and gain support for every exact interval crossed." },
  },
  logic: {
    tank: { name: "Necessary Defence", rule: "Guard the only hex that satisfies a visible enemy's targeting rule." },
    healer: { name: "Best Explanation", rule: "Remove one harmful condition after ruling out its false cause." },
    wizard: { name: "Counterexample", rule: "Cancel one enemy rule when a visible board state disproves it." },
    melee: { name: "Forced Conclusion", rule: "Move a target to the only legal adjacent hex, then strike." },
    ranged: { name: "Predicted Arc", rule: "Mark the destination of a revealed enemy and strike there after it moves." },
  },
  science: {
    tank: { name: "Stable State", rule: "Prevent all changes to one adjacent object and its hex until next round." },
    healer: { name: "Careful Remedy", rule: "Restore one heart and reverse the target's most recent state change." },
    wizard: { name: "Controlled Reaction", rule: "Advance two connected objects through opposite state changes." },
    melee: { name: "Kinetic Transfer", rule: "Strike and pass the remaining force into the next object in line." },
    ranged: { name: "Catalytic Mark", rule: "Mark an object so the next matching action repeats on an adjacent object." },
  },
  speed: {
    tank: { name: "Intercept", rule: "Move into an adjacent threatened hex and guard it before the enemy resolves." },
    healer: { name: "Swift Aid", rule: "Move to an ally and restore without ending movement." },
    wizard: { name: "Quick Revision", rule: "After a puzzle manipulation, undo and choose a different legal result." },
    melee: { name: "Passing Strike", rule: "Strike once while moving through a target-adjacent hex." },
    ranged: { name: "Relay Shot", rule: "Pass a mark through adjacent allies, then strike from the final ally's position." },
  },
};

function roleScore(stats, role) {
  const [arithmetic, geometry, logic, science, speed] = stats;
  if (role === "tank") return geometry * 1.1 + science * 0.8 + arithmetic * 0.25;
  if (role === "healer") return science * 1.15 + logic * 0.65 + speed * 0.2;
  if (role === "wizard") return logic + science * 0.85 + arithmetic * 0.3;
  if (role === "melee") return arithmetic * 0.9 + geometry * 0.7 + speed * 0.35;
  return speed * 0.85 + logic * 0.65 + geometry * 0.35;
}

function inferredRole(stats) {
  return ROLE_ORDER
    .map((role, index) => ({ role, index, score: roleScore(stats, role) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0].role;
}

function balancedRoleAssignments(cards, classMap) {
  const assignments = { ...classMap };
  const counts = Object.fromEntries(ROLE_ORDER.map((role) => [role, 0]));
  for (const role of Object.values(assignments)) if (counts[role] != null) counts[role] += 1;
  const unassigned = cards.filter((card) => !assignments[card.id]).sort((a, b) => b.bv - a.bv || a.id.localeCompare(b.id));
  for (const card of unassigned) {
    const available = ROLE_ORDER.filter((role) => counts[role] < cards.length / ROLE_ORDER.length);
    const role = (available.length ? available : ROLE_ORDER)
      .map((candidate, index) => ({ candidate, index, score: roleScore(card.s, candidate) - counts[candidate] * 0.35 }))
      .sort((a, b) => b.score - a.score || a.index - b.index)[0].candidate;
    assignments[card.id] = role;
    counts[role] += 1;
  }
  return assignments;
}

function rankedStats(stats) {
  return stats
    .map((value, stat) => ({ value, stat }))
    .sort((a, b) => b.value - a.value || a.stat - b.stat);
}

function rarityRank(rarity) {
  return ({ common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 })[rarity] || 0;
}

export function expeditionProfile(card, moduleKey, classMap = {}) {
  const stats = [...card.s];
  const ranked = rankedStats(stats);
  const discipline = EXPEDITION_DISCIPLINES[card.primaryType ?? ranked[0].stat];
  const roleKey = classMap[card.id] || inferredRole(stats);
  const role = EXPEDITION_ROLES[roleKey];
  const trait = EXPEDITION_TRAITS[ranked[1]?.stat ?? ranked[0].stat];
  const signature = SIGNATURES[discipline.key][roleKey];
  return {
    id: card.id,
    moduleKey,
    name: card.name,
    rarity: card.r,
    stats,
    discipline: discipline.key,
    disciplineName: discipline.name,
    role: roleKey,
    roleName: role.name,
    trait: trait.key,
    traitName: trait.name,
    traitRule: trait.rule,
    signature: `${discipline.key}-${roleKey}`,
    signatureName: signature.name,
    signatureRule: signature.rule,
    move: Math.min(4, 2 + Math.floor(stats[4] / 4)),
    range: roleKey === "ranged" ? 3 : roleKey === "wizard" ? 2 : 1,
    hearts: Math.min(5, 2 + Math.floor((stats[1] + stats[3]) / 7)),
    initiative: Math.max(1, 12 - stats[4]),
    power: Math.max(...stats),
    complexity: 1 + Math.min(2, Math.floor(rarityRank(card.r) / 2)),
  };
}

export function expeditionRoster(moduleKey) {
  const module = MODULE_CARD_DATA[moduleKey];
  if (!module) return [];
  const assignments = balancedRoleAssignments(module.cards, module.classes);
  return module.cards.map((card) => expeditionProfile(card, moduleKey, assignments));
}

export function expeditionCommanderRoster(moduleKey) {
  const module = MODULE_CARD_DATA[moduleKey];
  if (!module) return [];
  return module.bosses.map((boss) => ({
    id: `${moduleKey}_commander_${boss.n}`,
    moduleKey,
    level: boss.n,
    name: boss.name,
    rarity: boss.r,
    stats: [...boss.s],
    discipline: EXPEDITION_DISCIPLINES[boss.primaryType]?.key || "arithmetic",
    command: commanderRule(moduleKey, boss.n),
  }));
}

function commanderRule(moduleKey, level) {
  const primary = [
    "After deployment, move one hero one hex.",
    "Once, correct an objective value by one.",
    "Rotate one route marker before the first round.",
    "Stabilise one scenario object for the first enemy phase.",
    "Reveal every enemy's first intention.",
    "Place one temporary obstacle on an open hex.",
    "Count a connected swarm as one fewer for a single check.",
    "Reserve one hex that no figure may enter for a round.",
    "Turn one near miss into an exact result.",
    "Once, repeat a completed non-combat interaction.",
  ];
  const junior = [
    "Ignore the first obscured value.",
    "Round one estimate in the player's favour.",
    "Reverse one forced movement.",
    "Remember and restore one changed tile.",
    "Replace one random interval with its exact bounds.",
    "Repair one broken shape edge.",
    "Freeze one swarm group for a round.",
    "Treat one zero as a neutral operation.",
    "Correct one copied value by one.",
    "Assign one unplaced fragment to any legal region.",
  ];
  const intermediate = [
    "Delay one revealed intention by one initiative step.",
    "Reveal the cost of every edge leaving one node.",
    "Open one archive constraint before deployment.",
    "Substitute one equivalent expression.",
    "Lock one optimisation measure while changing another.",
    "Prevent one predicted edge closure.",
    "Hold one market rate constant for a round.",
    "Cancel one enemy reaction after it is revealed.",
    "Verify one ledger statement without spending an action.",
    "Re-run one signal from its previous node.",
  ];
  return ({ primary, junior, intermediate })[moduleKey][level - 1];
}

export function allExpeditionProfiles() {
  return Object.keys(MODULE_CARD_DATA).flatMap((moduleKey) => expeditionRoster(moduleKey));
}

export function allExpeditionCommanders() {
  return Object.keys(MODULE_CARD_DATA).flatMap((moduleKey) => expeditionCommanderRoster(moduleKey));
}
