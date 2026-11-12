// Resolves a profile's chosen Joey deck slot into the 15-card array the
// shared multiplayer engine (joey-multiplayer.js) needs, using the *same*
// deck-building function the solo game already uses — buildPlayerDeck from
// joey-battle.js — rather than re-deriving deck composition rules here. This
// file only adds the two things solo play didn't need: reading the deck spec
// back out of a stored profile's progress blob, and checking the profile
// still actually owns enough copies of every named card (an anti-cheat check
// the solo client never needed, since a tampered client there only cheats
// itself).
//
// A deck spec can legally name cards from any of the three modules (the solo
// deck builder lets a deck "borrow" cards from the other two — see
// WallabyMaths.jsx's crossModuleOver check), plus captured boss cards, so the
// full combined catalogue is built here the same way WallabyMaths.jsx builds
// ALL_JOEY_CARDS — bossCardId + normaliseJoeyCardStats are the shared,
// already-exported pieces; nothing about boss/card identity is reinvented.
import { buildPlayerDeck } from "../../joey-battle.js";
import { JUNIOR_CARDS, JUNIOR_BOSSES, bossCardId } from "../../generators/junior-generators.js";
import { PRIMARY_CARDS, PRIMARY_BOSSES } from "../../generators/primary-generators.js";
import { INTERMEDIATE_CARDS, INTERMEDIATE_BOSSES } from "../../generators/intermediate-generators.js";
import { applyAdventureItems } from "../../generators/gen-shared.js";
import { JUNIOR_ADVENTURES } from "../../content/junior-story.js";
import { PRIMARY_ADVENTURES } from "../../content/primary-story.js";
import { INTERMEDIATE_ADVENTURES } from "../../content/intermediate-story.js";
import { JOEY_MODULE_KEYS } from "./joey-group.js";

const MODULE_CARDS = { junior: JUNIOR_CARDS, primary: PRIMARY_CARDS, intermediate: INTERMEDIATE_CARDS };
const MODULE_BOSSES = { junior: JUNIOR_BOSSES, primary: PRIMARY_BOSSES, intermediate: INTERMEDIATE_BOSSES };
// Adventure items upgrade a card in Joey exactly as on the client (joeyCardView in
// WallabyMaths.jsx); ownership is read from the profile's own stored cardItems.
const ADVENTURE_ITEMS = new Map();
for (const adventures of [JUNIOR_ADVENTURES, PRIMARY_ADVENTURES, INTERMEDIATE_ADVENTURES]) {
  for (const [heroId, adventure] of Object.entries(adventures)) ADVENTURE_ITEMS.set(heroId, adventure.items);
}
function upgradedCards(progress) {
  const owned = progress?.cardItems || {};
  return ALL_CARDS.map(card => {
    const items = Array.isArray(owned[card.id]) ? owned[card.id] : [];
    return ADVENTURE_ITEMS.has(card.id) ? applyAdventureItems(card, items, ADVENTURE_ITEMS.get(card.id)) : card;
  });
}

// module key a given card id belongs to, across characters and boss trophies
// — mirrors ALL_JOEY_CARDS in WallabyMaths.jsx (character cards get
// `moduleSet` from their own array; a beaten boss becomes a card under
// bossCardId(b.n, moduleKey)).
const CARD_MODULE = new Map();
const ALL_CARDS = [];
for (const moduleKey of JOEY_MODULE_KEYS) {
  for (const card of MODULE_CARDS[moduleKey]) {
    CARD_MODULE.set(card.id, moduleKey);
    ALL_CARDS.push(card);
  }
  for (const boss of MODULE_BOSSES[moduleKey]) {
    const card = { id: bossCardId(boss.n, moduleKey), name: boss.name, r: "boss", s: boss.s || [5, 5, 5, 5, 5], bv: boss.bv || 20, primaryType: boss.primaryType || 0 };
    CARD_MODULE.set(card.id, moduleKey);
    ALL_CARDS.push(card);
  }
}

// Mirrors the deck builder's own cross-module borrow limits (WallabyMaths.jsx
// §"Cross-module deck limits" near the Joey deck screen) — duplicated
// constants, not a shared export, so keep these in sync if that file's
// JOEY_MAX_PER_OTHER_MODULE/JOEY_MAX_OTHER_MODULES_TOTAL ever change; see the
// delivery report for why this wasn't turned into a shared constant instead.
const MAX_PER_OTHER_MODULE = 5;
const MAX_OTHER_MODULES_TOTAL = 8;

function ownedCount(progress, cardId) {
  const count = Number(progress?.cards?.[cardId] || 0);
  return Number.isSafeInteger(count) && count > 0 ? count : 0;
}

// Returns { ok: true, deck } or { ok: false, error }. `deckIndex` is the slot
// (0-4) the profile declared ready with; the spec itself — which cards, how
// many of each — is re-read from the profile's own stored progress every
// time, never trusted from the lobby/challenge request.
export function resolveProfileDeck(moduleKey, progress, deckIndex) {
  if (!JOEY_MODULE_KEYS.includes(moduleKey)) return { ok: false, error: "bad_module" };
  const index = Number(deckIndex);
  if (!Number.isInteger(index) || index < 0 || index > 4) return { ok: false, error: "bad_deck_index" };
  const stored = progress?.modules?.[moduleKey]?.joeyDecks?.[index];
  const spec = Array.isArray(stored?.spec) ? stored.spec : null;
  if (!spec || spec.length === 0) return { ok: false, error: "no_deck" };

  const otherModuleCounts = new Map();
  for (const entry of spec) {
    const cardId = String(entry?.cardId || "");
    const count = Number(entry?.count);
    if (!Number.isInteger(count) || count < 1 || count > 2) return { ok: false, error: "bad_deck_spec" };
    const cardModule = CARD_MODULE.get(cardId);
    if (!cardModule) return { ok: false, error: "unknown_card" };
    if (ownedCount(progress, cardId) < count) return { ok: false, error: "card_not_owned" };
    if (cardModule !== moduleKey) otherModuleCounts.set(cardModule, (otherModuleCounts.get(cardModule) || 0) + count);
  }
  let otherTotal = 0;
  for (const count of otherModuleCounts.values()) {
    if (count > MAX_PER_OTHER_MODULE) return { ok: false, error: "cross_module_limit" };
    otherTotal += count;
  }
  if (otherTotal > MAX_OTHER_MODULES_TOTAL) return { ok: false, error: "cross_module_limit" };

  const deck = buildPlayerDeck(spec, upgradedCards(progress), moduleKey);
  if (!Array.isArray(deck) || deck.length !== 15) return { ok: false, error: "deck_build_failed" };
  return { ok: true, deck };
}
