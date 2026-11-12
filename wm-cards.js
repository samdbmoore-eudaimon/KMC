// Pack-opening card RNG: which rarity tier a pack pulls from (packWeights, in
// wm-progress.js) and which specific card within that tier. Split out of
// WallabyMaths.jsx so this can be unit tested directly (see
// scripts/test_cards_logic.mjs) with a mocked RNG rather than only ever
// exercised probabilistically through the UI.
//
// RARITY/CARDS/MAX_LEVEL are live bindings from generators/gen-shared.js and
// generators/junior-generators.js, reassigned per active module by
// activateModule() in WallabyMaths.jsx (setModuleActiveVars/
// setBossesAndMaxLevel) — same pattern as collectionStrength/bossForLevel and
// the rest of the shared generator-support logic, so a caller must activate a
// module before these return that module's cards.
import { RARITY, CARDS } from "./generators/gen-shared.js";
import { MAX_LEVEL } from "./generators/junior-generators.js";
import { packWeights } from "./wm-progress.js";

export function rollCardOnce(lv) {
  const w = packWeights(lv);
  const tiers = Object.keys(w).filter((t) => (RARITY[t].minLevel || 1) <= lv && w[t] > 0);
  const total = tiers.reduce((a, t) => a + w[t], 0);
  let roll = Math.random() * total, chosen = tiers[0], acc = 0;
  for (const t of tiers) { acc += w[t]; if (roll < acc) { chosen = t; break; } }
  const pool = CARDS.filter((c) => c.r === chosen);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function rollCard(unlockedLevel, ownedCards, forceRarity) {
  const lv = Math.min(Math.max(unlockedLevel || MAX_LEVEL, 1), MAX_LEVEL); // no arg = full pool (back-compat)
  // Pity override: force the roll into a specific rarity's pool (used for the epic/legendary
  // pity counters in openPack), still preferring an unowned card within that tier.
  if (forceRarity) {
    const pool = CARDS.filter((c) => c.r === forceRarity);
    let card = pool[Math.floor(Math.random() * pool.length)];
    if (ownedCards) { for (let t = 0; t < 4 && ownedCards[card.id]; t++) card = pool[Math.floor(Math.random() * pool.length)]; }
    return card;
  }
  let card = rollCardOnce(lv);
  // Duplicates add no strength, so keep rerolling (up to a few times) to try to land
  // an unowned card. This stops a player who has collected a whole tier from seeing
  // pack after pack of the same dupes; they get fresh cards from the eligible pool.
  if (ownedCards) { for (let t = 0; t < 4 && ownedCards[card.id]; t++) card = rollCardOnce(lv); }
  return card;
}
