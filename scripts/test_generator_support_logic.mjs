// Unit tests for the shared game-logic support functions in
// generators/junior-generators.js — collectionStrength, boss-gate lookups,
// exam pass marks, shiny claims, stars/streak maths, upgrade/class lookups.
// These aren't generator-*question* logic (already fuzzed by
// gen_sanity_test_*.cjs) — they're the rules that decide whether a boss gate
// opens, how many stars an answer is worth, and whether a card counts as
// upgraded, shared by all three modules via the same "live binding" functions
// (BOSSES/MAX_LEVEL/RARITY/CARD_CLASS/CARDS/ADVENTURES are swapped out per
// active module by setBossesAndMaxLevel/setModuleActiveVars/setContentModule —
// see activateModule in WallabyMaths.jsx, mirrored below by activate()).
import assert from "node:assert/strict";
import test from "node:test";
import { setContentModule, ADVENTURES } from "../wm-content.js";
import {
  setActiveModuleKey, setModuleActiveVars, setModuleSharedVars,
  JUNIOR_TOPICS, JUNIOR_DEEP_TOPICS,
} from "../generators/gen-shared.js";
import {
  JUNIOR_G, JUNIOR_BOSSES, JUNIOR_MAX_LEVEL, JUNIOR_CARDS,
  JUNIOR_RARITY, JUNIOR_CARD_CLASS, JUNIOR_EXAM_PASS_MARKS, JUNIOR_examKindFor,
  setBossesAndMaxLevel, bossForLevel, examPassMarkFor, examClearedFor, availableShinyClaims,
  collectionStrength, starsFor, streakStarGain, isUpgraded, cardClass, olympiadMarksTotal,
} from "../generators/junior-generators.js";
import {
  PRIMARY_TOPICS, PRIMARY_DEEP_TOPICS, PRIMARY_G, PRIMARY_BOSSES, PRIMARY_MAX_LEVEL,
  PRIMARY_CARDS, PRIMARY_RARITY, PRIMARY_CARD_CLASS, PRIMARY_EXAM_PASS_MARKS, PRIMARY_examKindFor,
} from "../generators/primary-generators.js";
import {
  INTERMEDIATE_TOPICS, INTERMEDIATE_DEEP_TOPICS, INTERMEDIATE_G, INTERMEDIATE_BOSSES, INTERMEDIATE_MAX_LEVEL,
  INTERMEDIATE_CARDS, INTERMEDIATE_RARITY, INTERMEDIATE_CARD_CLASS, INTERMEDIATE_EXAM_PASS_MARKS, INTERMEDIATE_examKindFor,
} from "../generators/intermediate-generators.js";

const MODULES = {
  junior: {
    TOPICS: JUNIOR_TOPICS, DEEP_TOPICS: JUNIOR_DEEP_TOPICS, G: JUNIOR_G, BOSSES: JUNIOR_BOSSES, MAX_LEVEL: JUNIOR_MAX_LEVEL,
    CARDS: JUNIOR_CARDS, RARITY: JUNIOR_RARITY, CARD_CLASS: JUNIOR_CARD_CLASS,
    EXAM_PASS_MARKS: JUNIOR_EXAM_PASS_MARKS, examKindFor: JUNIOR_examKindFor,
  },
  primary: {
    TOPICS: PRIMARY_TOPICS, DEEP_TOPICS: PRIMARY_DEEP_TOPICS, G: PRIMARY_G, BOSSES: PRIMARY_BOSSES, MAX_LEVEL: PRIMARY_MAX_LEVEL,
    CARDS: PRIMARY_CARDS, RARITY: PRIMARY_RARITY, CARD_CLASS: PRIMARY_CARD_CLASS,
    EXAM_PASS_MARKS: PRIMARY_EXAM_PASS_MARKS, examKindFor: PRIMARY_examKindFor,
  },
  intermediate: {
    TOPICS: INTERMEDIATE_TOPICS, DEEP_TOPICS: INTERMEDIATE_DEEP_TOPICS, G: INTERMEDIATE_G, BOSSES: INTERMEDIATE_BOSSES, MAX_LEVEL: INTERMEDIATE_MAX_LEVEL,
    CARDS: INTERMEDIATE_CARDS, RARITY: INTERMEDIATE_RARITY, CARD_CLASS: INTERMEDIATE_CARD_CLASS,
    EXAM_PASS_MARKS: INTERMEDIATE_EXAM_PASS_MARKS, examKindFor: INTERMEDIATE_examKindFor,
  },
};

function activate(key) {
  const m = MODULES[key];
  setActiveModuleKey(key);
  setModuleActiveVars(m.examKindFor, m.EXAM_PASS_MARKS, m.RARITY, m.CARD_CLASS, m.CARDS);
  setModuleSharedVars(m.TOPICS, m.DEEP_TOPICS, m.G);
  setBossesAndMaxLevel(m.BOSSES, m.MAX_LEVEL);
  setContentModule(key);
  return m;
}

for (const moduleKey of Object.keys(MODULES)) {
  test(`${moduleKey}: boss thresholds strictly increase and span every level`, () => {
    const m = activate(moduleKey);
    assert.equal(m.BOSSES.length, m.MAX_LEVEL);
    for (let i = 1; i < m.BOSSES.length; i++) assert.ok(m.BOSSES[i].need > m.BOSSES[i - 1].need, `boss ${i + 1}'s need (${m.BOSSES[i].need}) should exceed boss ${i}'s (${m.BOSSES[i - 1].need})`);
    for (let n = 1; n <= m.MAX_LEVEL; n++) assert.ok(m.EXAM_PASS_MARKS[n] >= 1 && m.EXAM_PASS_MARKS[n] <= 25, `level ${n} pass mark ${m.EXAM_PASS_MARKS[n]} should be a plausible mark out of 25`);
  });

  test(`${moduleKey}: bossForLevel clamps to [1, MAX_LEVEL]`, () => {
    const m = activate(moduleKey);
    assert.equal(bossForLevel(0).n, 1);
    assert.equal(bossForLevel(1).n, 1);
    assert.equal(bossForLevel(m.MAX_LEVEL).n, m.MAX_LEVEL);
    assert.equal(bossForLevel(m.MAX_LEVEL + 5).n, m.MAX_LEVEL);
  });

  test(`${moduleKey}: examPassMarkFor matches the level's own EXAM_PASS_MARKS entry`, () => {
    const m = activate(moduleKey);
    for (let lv = 1; lv <= m.MAX_LEVEL; lv++) assert.equal(examPassMarkFor(lv), m.EXAM_PASS_MARKS[lv]);
    assert.equal(examPassMarkFor(0), m.EXAM_PASS_MARKS[1]);
    assert.equal(examPassMarkFor(m.MAX_LEVEL + 5), m.EXAM_PASS_MARKS[m.MAX_LEVEL]);
  });

  test(`${moduleKey}: examClearedFor reads the best (not most recent) mock in history`, () => {
    const m = activate(moduleKey);
    const kind = m.examKindFor(1);
    const passMark = examPassMarkFor(1);
    const progress = { testHistory: [{ kind, correct: passMark - 1 }, { kind, correct: passMark }, { kind, correct: passMark - 3 }] };
    assert.equal(examClearedFor(progress, 1), true);
    assert.equal(examClearedFor({ testHistory: [{ kind, correct: passMark - 1 }] }, 1), false);
    assert.equal(examClearedFor({ testHistory: [] }, 1), false);
  });

  test(`${moduleKey}: availableShinyClaims is qualifying passes minus shiny trophies already claimed`, () => {
    const m = activate(moduleKey);
    const kind = m.examKindFor(2);
    assert.equal(availableShinyClaims({ shinyPasses: { [kind]: 2 }, shinyBosses: [] }, kind), 2);
    assert.equal(availableShinyClaims({ shinyPasses: { [kind]: 2 }, shinyBosses: [2] }, kind), 1);
    assert.equal(availableShinyClaims({ shinyPasses: { [kind]: 1 }, shinyBosses: [2, 2] }, kind), 0, "never goes negative");
    assert.equal(availableShinyClaims({}, kind), 0);
  });

  test(`${moduleKey}: starsFor scales in bands of 3 levels`, () => {
    activate(moduleKey);
    assert.deepEqual([1, 2, 3].map(starsFor), [1, 1, 1]);
    assert.deepEqual([4, 5, 6].map(starsFor), [2, 2, 2]);
    assert.deepEqual([7, 8, 9].map(starsFor), [3, 3, 3]);
    assert.equal(starsFor(10), 4);
  });

  test(`${moduleKey}: streakStarGain pays double on the 2nd of a streak, nothing for a lone correct`, () => {
    activate(moduleKey);
    assert.equal(streakStarGain(1, 5), 0);
    assert.equal(streakStarGain(2, 5), 10);
    assert.equal(streakStarGain(3, 5), 5);
    assert.equal(streakStarGain(9, 5), 5);
  });

  test(`${moduleKey}: cardClass looks up CLASSES via CARD_CLASS, null for an unknown id`, () => {
    const m = activate(moduleKey);
    const [knownId] = Object.keys(m.CARD_CLASS);
    assert.ok(cardClass(knownId), `expected a class for ${knownId}`);
    assert.equal(cardClass("not_a_real_card_id"), null);
  });

  test(`${moduleKey}: isUpgraded is true only once every adventure item is owned`, () => {
    const m = activate(moduleKey);
    const heroId = m.CARDS.find((c) => c.r === "common")?.id;
    assert.ok(heroId, "expected at least one common card with an adventure");
    assert.equal(isUpgraded({ cardItems: {} }, heroId), false);
    assert.equal(isUpgraded({ cardItems: { [heroId]: ["only_one_item"] } }, heroId), false);
  });

  test(`${moduleKey}: collectionStrength sums owned cards' rarity strength, upgraded cards count as their next tier`, () => {
    const m = activate(moduleKey);
    const common = m.CARDS.find((c) => c.r === "common" && ADVENTURES[c.id]);
    assert.ok(common, "expected at least one common card with a real adventure");
    assert.equal(collectionStrength({ cards: {} }), 0);
    assert.equal(collectionStrength({ cards: { [common.id]: 1 } }), m.RARITY.common.str);

    // A fake cardItems list shouldn't fool isUpgraded into over-counting strength.
    const fakeUpgrade = collectionStrength({ cards: { [common.id]: 1 }, cardItems: { [common.id]: ["fake1", "fake2", "fake3"] } });
    assert.equal(fakeUpgrade, m.RARITY.common.str);

    // Genuinely completing the adventure (owning every real item id) bumps it to uncommon's strength.
    const realItemIds = ADVENTURES[common.id].items.map((it) => it.id);
    const realUpgrade = collectionStrength({ cards: { [common.id]: 1 }, cardItems: { [common.id]: realItemIds } });
    assert.equal(realUpgrade, m.RARITY.uncommon.str);
  });
}

test("olympiadMarksTotal sums the mark scheme plus one", () => {
  assert.equal(olympiadMarksTotal({ markScheme: [{ pts: 2 }, { pts: 3 }] }), 6);
  assert.equal(olympiadMarksTotal({ markScheme: [] }), 1);
  assert.equal(olympiadMarksTotal({}), 1);
});

test("every adventure boosts its hero's primary stat, and full upgrades never overtake it", async () => {
  const { JUNIOR_ADVENTURES } = await import("../content/junior-story.js");
  const { PRIMARY_ADVENTURES } = await import("../content/primary-story.js");
  const { INTERMEDIATE_ADVENTURES } = await import("../content/intermediate-story.js");
  const { applyAdventureItems } = await import("../generators/gen-shared.js");
  for (const [cards, adventures] of [[JUNIOR_CARDS, JUNIOR_ADVENTURES], [PRIMARY_CARDS, PRIMARY_ADVENTURES], [INTERMEDIATE_CARDS, INTERMEDIATE_ADVENTURES]]) {
    for (const [heroId, adventure] of Object.entries(adventures)) {
      const card = cards.find((c) => c.id === heroId);
      assert.ok(card, `${heroId} has a card`);
      assert.ok(adventure.items.some((it) => it.stat === card.primaryType), `${heroId}: an item must boost its primary stat`);
      const full = applyAdventureItems(card, adventure.items.map((it) => it.id), adventure.items);
      assert.ok(full.s.every((v) => v <= full.s[card.primaryType]), `${heroId}: upgraded ${full.s} overtakes primary stat ${card.primaryType}`);
      assert.equal(full.primaryType, card.primaryType);
      assert.equal(full.bv, full.s.reduce((a, b) => a + b, 0));
    }
  }
});
