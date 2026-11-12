// Unit tests for resolveProfileDeck (cloudflare-worker/accounts/joey-deck.js)
// in isolation — no D1/Durable Object involved. Covers the two things that
// aren't exercised by the HTTP-level joey-lobby tests: cross-module card
// borrowing (a deck can legally include a few cards from another module —
// see WallabyMaths.jsx's crossModuleOver check) and captured boss cards.
import assert from "node:assert/strict";
import test from "node:test";
import { resolveProfileDeck } from "../cloudflare-worker/accounts/joey-deck.js";

function progressFor(moduleKey, spec, cards) {
  const decks = [null, null, null, null, null];
  decks[0] = { spec };
  return { cards, cardItems: {}, modules: { [moduleKey]: { joeyDecks: decks, joeyActiveDeck: 0 } } };
}

test("a deck can legally borrow a few cards from another module", () => {
  const spec = [{ cardId: "pip", count: 2 }, { cardId: "addy", count: 2 }]; // pip=primary, addy=junior
  const progress = progressFor("junior", spec, { pip: 2, addy: 2 });
  const result = resolveProfileDeck("junior", progress, 0);
  assert.equal(result.ok, true);
  assert.equal(result.deck.length, 15);
  assert.equal(result.deck.filter((c) => c.id === "pip").length, 2);
});

test("borrowing more than the per-other-module cap is refused", () => {
  const spec = [{ cardId: "pip", count: 2 }, { cardId: "nine", count: 2 }, { cardId: "bramble", count: 2 }]; // 6 primary cards into a junior deck
  const progress = progressFor("junior", spec, { pip: 2, nine: 2, bramble: 2 });
  const result = resolveProfileDeck("junior", progress, 0);
  assert.deepEqual([result.ok, result.error], [false, "cross_module_limit"]);
});

test("a captured boss card resolves the same way a character card does", () => {
  const spec = [{ cardId: "boss_junior_1", count: 1 }];
  const progress = progressFor("junior", spec, { boss_junior_1: 1 });
  const result = resolveProfileDeck("junior", progress, 0);
  assert.equal(result.ok, true);
  assert.equal(result.deck.some((c) => c.id === "boss_junior_1"), true);
});

test("a deck spec naming more copies than owned is refused", () => {
  const spec = [{ cardId: "addy", count: 2 }];
  const progress = progressFor("junior", spec, { addy: 1 });
  const result = resolveProfileDeck("junior", progress, 0);
  assert.deepEqual([result.ok, result.error], [false, "card_not_owned"]);
});

test("a genuinely unknown card id is refused", () => {
  const spec = [{ cardId: "not_a_real_card", count: 1 }];
  const progress = progressFor("junior", spec, { not_a_real_card: 1 });
  const result = resolveProfileDeck("junior", progress, 0);
  assert.deepEqual([result.ok, result.error], [false, "unknown_card"]);
});

test("owned adventure items upgrade a multiplayer deck card's stats and BV, keeping its type", () => {
  const spec = [{ cardId: "gf_pip", count: 1 }];
  const progress = progressFor("intermediate", spec, { gf_pip: 1 });
  const base = resolveProfileDeck("intermediate", progress, 0).deck.find((c) => c.id === "gf_pip");
  progress.cardItems = { gf_pip: ["gf_pip_item1", "gf_pip_item2", "gf_pip_item3"] };
  const upgraded = resolveProfileDeck("intermediate", progress, 0).deck.find((c) => c.id === "gf_pip");
  assert.equal(upgraded.bv, base.bv + 3);
  assert.equal(upgraded.s.reduce((a, b) => a + b, 0), upgraded.bv);
  assert.equal(upgraded.primaryType, base.primaryType);
});
