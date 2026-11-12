import assert from "node:assert/strict";
import test from "node:test";
import { INTERMEDIATE_CARDS } from "../generators/intermediate-generators.js";
import { JUNIOR_CARDS } from "../generators/junior-generators.js";
import { PRIMARY_CARDS } from "../generators/primary-generators.js";
import { mergeProgress } from "../sync.js";
import { TRADE_CARD_IDS, isTradeableDuplicate, tradeCardModule } from "../wm-trading.js";

const generatorCards = {
  junior: JUNIOR_CARDS,
  primary: PRIMARY_CARDS,
  intermediate: INTERMEDIATE_CARDS,
};

test("the trading registry matches every regular card set", () => {
  for (const [moduleKey, cards] of Object.entries(generatorCards)) {
    assert.deepEqual([...TRADE_CARD_IDS[moduleKey]].sort(), cards.map((card) => card.id).sort());
  }
});

test("card ids resolve to exactly one module", () => {
  const ids = Object.values(TRADE_CARD_IDS).flat();
  assert.equal(new Set(ids).size, ids.length);
  for (const [moduleKey, moduleIds] of Object.entries(TRADE_CARD_IDS)) {
    for (const cardId of moduleIds) assert.equal(tradeCardModule(cardId), moduleKey);
  }
});

test("only an unreserved, non-upgraded duplicate can be traded", () => {
  const progress = { cards: { addy: 2 }, cardItems: {} };
  assert.equal(isTradeableDuplicate(progress, "junior", "addy"), true);
  assert.equal(isTradeableDuplicate(progress, "junior", "addy", 1), false);
  assert.equal(isTradeableDuplicate({ cards: { addy: 1 } }, "junior", "addy"), false);
  assert.equal(isTradeableDuplicate({ cards: { addy: 2 }, cardItems: { addy: ["a", "b", "c"] } }, "junior", "addy"), false);
  assert.equal(isTradeableDuplicate(progress, "primary", "addy"), false);
  assert.equal(isTradeableDuplicate(progress, "junior", "boss_junior_1"), false);
});

test("a server trade and a separate local card gain merge without restoring the traded copy", () => {
  const baseline = { addy: 2 };
  const local = { cards: { addy: 2, countra: 1 }, modules: {} };
  const remote = { cards: { addy: 1, tritip: 1 }, modules: {} };
  const merged = mergeProgress(local, remote, true, { cards: baseline });
  assert.deepEqual(merged.cards, { addy: 1, countra: 1, tritip: 1 });
});
