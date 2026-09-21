// Collection-power readiness for Expeditions (EXPEDITIONS_BUILD_BRIEF.md §3.1, as
// corrected by the user on 2026-09-14 — see the note below). Pure, deterministic and
// independent of React, storage and the rest of the engine — it only ever looks at the
// cards handed to it. A Commander is never one of the deployed field cards, so passing
// one in has no effect on any rule below: readiness only ever reads the field squad.
//
// IMPORTANT — this is advisory, never a hard gate. Embark is always available, for any
// squad, on any mission. assessSquadReadiness never blocks anything; it only produces a
// recommendation banner and lights up the five-notch meter. The brief's original text
// ("Embark is disabled", "must reject") described a harder gate than the user actually
// wants: a squad below the recommended power should still be able to attempt — and,
// with luck or skilful play, clear — a mission. What genuinely stops an underpowered
// squad is the mission itself: enemy defence, hearts and damage are fixed regardless of
// who shows up, so a weak squad's strikes fail to generate impact and its heroes get
// overwhelmed on their own numbers, not from a pre-flight check. EXPEDITIONS_BUILD_BRIEF.md
// §3.1 and EXPEDITIONS_CLAUDE_HANDOVER.md's RDY test list still use the old "reject"
// wording pending a doc pass; this module is the current source of truth for the rule's
// actual behaviour.
import { EXPEDITION_STAT_NAMES } from "./expedition-data.js";

/** @typedef {"common"|"uncommon"|"rare"|"epic"|"legendary"} CardRarity */

export const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];

export function rarityRank(rarity) {
  const index = RARITY_ORDER.indexOf(rarity);
  return index < 0 ? 0 : index;
}

// Legendary always counts as Epic or better because it sits above Epic in RARITY_ORDER.
export function meetsRarityFloor(rarity, floor) {
  return rarityRank(rarity) >= rarityRank(floor);
}

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function rarityFloorPhrase(floor) {
  return floor === "epic" ? "Epic or Legendary" : `${capitalise(floor)} or better`;
}

// The five-notch readiness meter from the build brief: a display band for the overall
// rarity of a single card, used to light up the meter shown before squad selection. Purely
// informational — it never disables Embark.
export const EXPEDITION_READINESS_BANDS = [
  { key: "starter", name: "Starter", rarityFloor: "common" },
  { key: "uncommon", name: "Uncommon", rarityFloor: "uncommon" },
  { key: "rare", name: "Rare", rarityFloor: "rare" },
  { key: "epic", name: "Epic", rarityFloor: "epic" },
  { key: "masterwork", name: "Masterwork", rarityFloor: "legendary" },
];

export function expeditionReadinessBandForRarity(rarity) {
  for (let index = EXPEDITION_READINESS_BANDS.length - 1; index >= 0; index -= 1) {
    if (meetsRarityFloor(rarity, EXPEDITION_READINESS_BANDS[index].rarityFloor)) return EXPEDITION_READINESS_BANDS[index];
  }
  return EXPEDITION_READINESS_BANDS[0];
}

function averageBattleValue(cards) {
  if (!cards.length) return 0;
  return cards.reduce((sum, card) => sum + (card.bv || 0), 0) / cards.length;
}

/**
 * Assess one scenario's recommended power against a deployed field squad. This is
 * advisory only — the caller must never use `meetsRecommendation` to disable Embark.
 * Any squad may attempt any mission; this is for the pre-mission readiness meter and
 * banner ("this looks tough — carry on anyway?") only.
 *
 * @param {{readiness: import("./expedition-schema.js").ReadinessGuidance}} scenario
 * @param {Array<{id: string, r: CardRarity, bv: number, s: number[]}>} fieldCards - the
 *   deployed squad's raw card data (never a Commander).
 * @param {{id: string, r: CardRarity, bv: number, s: number[]}|null} [commanderCard] -
 *   accepted only to make the exclusion explicit and testable; contributes to nothing below.
 * @returns {{meetsRecommendation: boolean, shortfalls: Array<{code: string, message: string}>}}
 */
export function assessSquadReadiness(scenario, fieldCards, commanderCard = null) {
  void commanderCard; // never read: a Commander cannot satisfy a field-card recommendation.
  const readiness = scenario.readiness;
  const shortfalls = [];
  if (!readiness) {
    shortfalls.push({ code: "missing_readiness", message: "This expedition has no readiness guidance configured." });
    return { meetsRecommendation: false, shortfalls };
  }
  const count = fieldCards.length;
  const average = averageBattleValue(fieldCards);
  if (average < readiness.minimumAverageBattleValue) {
    shortfalls.push({
      code: "average_battle_value",
      message: `Recommended average battle value is ${readiness.minimumAverageBattleValue} or higher (this squad averages ${Math.round(average)}).`,
    });
  }
  for (const [floor, needed] of Object.entries(readiness.minimumRarityCounts || {})) {
    const have = fieldCards.filter((card) => meetsRarityFloor(card.r, floor)).length;
    if (have < needed) {
      shortfalls.push({
        code: "minimum_rarity_count",
        message: `Recommended: at least ${needed} field card${needed === 1 ? "" : "s"} ${rarityFloorPhrase(floor)} (this squad has ${have}).`,
      });
    }
  }
  if (readiness.allCardsMinimumRarity) {
    const allMeet = count > 0 && fieldCards.every((card) => meetsRarityFloor(card.r, readiness.allCardsMinimumRarity));
    if (!allMeet) {
      shortfalls.push({
        code: "all_cards_minimum_rarity",
        message: `Recommended: all ${count} field cards ${rarityFloorPhrase(readiness.allCardsMinimumRarity)}.`,
      });
    }
  }
  for (const forbidden of readiness.forbiddenRarities || []) {
    if (fieldCards.some((card) => card.r === forbidden)) {
      shortfalls.push({ code: "forbidden_rarity", message: `Recommended: leave ${capitalise(forbidden)} cards at home for this expedition.` });
    }
  }
  for (const requirement of readiness.capabilityRequirements || []) {
    const statIndex = EXPEDITION_STAT_NAMES.findIndex((name) => name.toLowerCase() === requirement.stat.toLowerCase());
    const satisfied = statIndex >= 0 && fieldCards.some((card) => (card.s?.[statIndex] ?? 0) >= requirement.min);
    if (!satisfied) {
      shortfalls.push({
        code: "capability",
        message: `Recommended: one ${capitalise(requirement.stat)} score of ${requirement.min}+.`,
      });
    }
  }
  return { meetsRecommendation: shortfalls.length === 0, shortfalls };
}
