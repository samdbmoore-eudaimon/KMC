import { expeditionRoster } from "../expedition-roster.js";
import { HAND_CARDS, ROLE_CARD, ROLE_DISPLAY, STAT_KEYS, STRIKE_RANGE, MODULE_KEY } from "./constants.js";

// Printed `card.s` values only: no Adventure equipment, commander, trait or honed bonus (spec §1).
export function orchardV2Profile(base) {
  const stats = [...base.stats];
  const [, G, , S, V] = stats;
  const primary = Math.max(0, STAT_KEYS.indexOf(base.discipline));
  return {
    cardId: base.id,
    name: base.name,
    rarity: base.rarity,
    stats,
    discipline: base.discipline,
    primaryStat: primary,
    role: base.role,
    roleName: ROLE_DISPLAY[base.role],
    maxHealth: 10 + S,
    moveBudget: 4 + Math.floor(V / 3),
    armour: Math.floor(G / 4),
    initiative: 12 - V,
    strikeRange: STRIKE_RANGE[base.role],
    strikeStat: stats[primary],
    dashBudget: 4 + V,
    interceptBudget: V,
    hand: [
      { key: HAND_CARDS[base.discipline][0], kind: "discipline" },
      { key: HAND_CARDS[base.discipline][1], kind: "discipline" },
      { key: ROLE_CARD[base.role], kind: "role" },
      { key: "second-wind", kind: "second-wind" },
    ],
  };
}

let rosterCache = null;
export function orchardRosterProfiles() {
  if (!rosterCache) rosterCache = Object.fromEntries(expeditionRoster(MODULE_KEY).map((p) => [p.id, orchardV2Profile(p)]));
  return rosterCache;
}
export function getOrchardV2Profile(cardId) {
  const profile = orchardRosterProfiles()[cardId];
  if (!profile) throw new Error(`Unknown Orchard card: ${cardId}`);
  return profile;
}
