// Unit tests for wm-cards.js: which rarity tier a pack pulls from at a given
// level, and the duplicate-avoidance reroll that keeps packs useful once a
// tier is mostly collected. Math.random is mocked to a fixed sequence so the
// reroll logic is exercised deterministically rather than only statistically.
//
// Note: freshModuleProgress() (wm-progress.js) carries packsSinceEpic/
// packsSinceLegendary fields, and rollCard accepts a forceRarity override
// whose own comment says it's "used for the epic/legendary pity counters in
// openPack" — but nothing in WallabyMaths.jsx ever reads those two fields or
// calls rollCard with forceRarity. There is no actual pity system wired up
// despite the progress shape and the comment implying one; this file only
// tests what rollCard/rollCardOnce actually do today, not a pity guarantee
// that doesn't exist in the code.
import assert from "node:assert/strict";
import test from "node:test";
import { setActiveModuleKey, setModuleActiveVars, setModuleSharedVars } from "../generators/gen-shared.js";
import {
  JUNIOR_G, JUNIOR_BOSSES, JUNIOR_MAX_LEVEL, JUNIOR_CARDS, JUNIOR_RARITY, JUNIOR_CARD_CLASS,
  JUNIOR_EXAM_PASS_MARKS, JUNIOR_examKindFor, setBossesAndMaxLevel,
} from "../generators/junior-generators.js";
import { JUNIOR_TOPICS, JUNIOR_DEEP_TOPICS } from "../generators/gen-shared.js";
import { rollCardOnce, rollCard } from "../wm-cards.js";

function activateJunior() {
  setActiveModuleKey("junior");
  setModuleActiveVars(JUNIOR_examKindFor, JUNIOR_EXAM_PASS_MARKS, JUNIOR_RARITY, JUNIOR_CARD_CLASS, JUNIOR_CARDS);
  setModuleSharedVars(JUNIOR_TOPICS, JUNIOR_DEEP_TOPICS, JUNIOR_G);
  setBossesAndMaxLevel(JUNIOR_BOSSES, JUNIOR_MAX_LEVEL);
}

function withMockRandom(sequence, fn) {
  const real = Math.random;
  let i = 0;
  Math.random = () => { const v = sequence[Math.min(i, sequence.length - 1)]; i++; return v; };
  try { return fn(); } finally { Math.random = real; }
}

test("rollCardOnce never returns a tier below its own minLevel at a low level", () => {
  activateJunior();
  // At level 1 only common is eligible (packWeights(1) = {common: 100}) regardless of
  // what Math.random returns, since packWeights itself gates the tiers on offer.
  for (const roll of [0, 0.5, 0.999]) {
    const card = withMockRandom([roll, 0], () => rollCardOnce(1));
    assert.equal(card.r, "common");
  }
});

test("rollCardOnce's tier choice tracks the roll against packWeights' cumulative bands", () => {
  activateJunior();
  // packWeights(6) = { common: 40, uncommon: 28, rare: 20, epic: 8, legendary: 4 } (total 100).
  // A roll just under the common/uncommon boundary (0.40) should land in common; just over
  // it (0.41) should land in uncommon — pins down the < vs <= boundary behaviour exactly.
  const justUnder = withMockRandom([0.399, 0], () => rollCardOnce(6));
  const justOver = withMockRandom([0.401, 0], () => rollCardOnce(6));
  assert.equal(justUnder.r, "common");
  assert.equal(justOver.r, "uncommon");
});

test("rollCard rerolls up to 4 times to avoid a duplicate, and stops once it finds a fresh card", () => {
  activateJunior();
  const commons = JUNIOR_CARDS.filter((c) => c.r === "common");
  assert.ok(commons.length >= 2, "need at least two commons for this test to mean anything");
  const owned = { [commons[0].id]: 1 };
  // Force every tier roll to land in common (roll=0 -> first tier), and make the FIRST two
  // card-index picks resolve to the owned duplicate, the third to a fresh common.
  const dupIndex = commons.indexOf(commons[0]) / commons.length;
  const freshIndex = (commons.indexOf(commons[1])) / commons.length;
  const card = withMockRandom([0, dupIndex, 0, dupIndex, 0, freshIndex], () => rollCard(1, owned));
  assert.equal(card.id, commons[1].id);
});

test("rollCard gives up after 4 rerolls and can still return an owned duplicate if every candidate is owned", () => {
  activateJunior();
  const commons = JUNIOR_CARDS.filter((c) => c.r === "common");
  const owned = Object.fromEntries(commons.map((c) => [c.id, 1])); // every common already owned
  const idx = 0 / commons.length;
  // Tier roll always common (0), card index always the same owned card — the reroll loop
  // should still terminate (at most 4 extra attempts) rather than looping forever.
  const card = withMockRandom(Array(12).fill(0).map((_, i) => (i % 2 === 0 ? 0 : idx)), () => rollCard(1, owned));
  assert.equal(card.id, commons[0].id);
});

test("rollCard's forceRarity ignores level gating and always returns a card from that exact tier", () => {
  activateJunior();
  const card = withMockRandom([0.9, 0], () => rollCard(1, {}, "legendary"));
  assert.equal(card.r, "legendary");
});

test("rollCard's forceRarity also rerolls away from an owned duplicate", () => {
  activateJunior();
  const legendaries = JUNIOR_CARDS.filter((c) => c.r === "legendary");
  assert.ok(legendaries.length >= 2, "need at least two legendaries for this test to mean anything");
  const owned = { [legendaries[0].id]: 1 };
  const dupIndex = 0 / legendaries.length;
  const freshIndex = 1 / legendaries.length;
  const card = withMockRandom([dupIndex, freshIndex], () => rollCard(1, owned, "legendary"));
  assert.equal(card.id, legendaries[1].id);
});

test("rollCard clamps an out-of-range level before delegating to rollCardOnce", () => {
  activateJunior();
  const highLevel = withMockRandom([0.9, 0], () => rollCard(999, null));
  const clampedToMax = withMockRandom([0.9, 0], () => rollCard(JUNIOR_MAX_LEVEL, null));
  assert.equal(highLevel.r, clampedToMax.r);
});
