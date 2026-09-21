// Delegated backlog item 2 (EXPEDITIONS_CLAUDE_HANDOVER.md, 2026-09-16): "capability audit of
// the real card collection... test the Ninefold Orchard route requirements against that real
// collection... flag any stated recommendation that no valid three-card Epic squad can meet,
// or that almost every Common squad already meets." These tests are the deterministic half of
// that audit; EXPEDITIONS_CARD_AUDIT.md is the readable report half, and both are derived from
// the same exhaustive check below, not hand-counted.
//
// Scope: the full 90-card audited table (profiles for all three modules) lives in the report;
// these tests exercise real assessSquadReadiness/EXPEDITION_SCENARIOS behaviour against the
// real Primary (Ninefold Orchard) collection specifically, since that is the only module the
// route doc under audit covers. Little Reckoning and Gifford get the equivalent readiness
// audit when their own route docs reach this stage (backlog items 9 and 10).
import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { assessSquadReadiness } from "./expedition-readiness.js";
import { EXPEDITION_SCENARIOS } from "./expedition-data.js";

const RARITY_BV = { common: 13, uncommon: 21, rare: 25, epic: 34, legendary: 45 };

function rarityCounts(roster) {
  const counts = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
  for (const card of roster) counts[card.rarity] += 1;
  return counts;
}

function combinations3(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i += 1)
    for (let j = i + 1; j < arr.length; j += 1)
      for (let k = j + 1; k < arr.length; k += 1)
        out.push([arr[i], arr[j], arr[k]]);
  return out;
}

function fieldCardsFor(moduleKey) {
  return expeditionRoster(moduleKey).map((profile) => ({ id: profile.id, r: profile.rarity, bv: RARITY_BV[profile.rarity], s: profile.stats }));
}

test("audit assumption: the real Primary (Ninefold Orchard) collection is 30 cards, 12/5/5/6/2 by rarity", () => {
  const counts = rarityCounts(expeditionRoster("primary"));
  assert.deepEqual(counts, { common: 12, uncommon: 5, rare: 5, epic: 6, legendary: 2 });
});

test("audit assumption: the real Junior (Little Reckoning) collection is 30 cards, 12/5/5/6/2 by rarity", () => {
  const counts = rarityCounts(expeditionRoster("junior"));
  assert.deepEqual(counts, { common: 12, uncommon: 5, rare: 5, epic: 6, legendary: 2 });
});

test("audit assumption: the real Intermediate (Gifford) collection is 30 cards, 9/5/5/9/2 by rarity — deliberately fewer commons and more epics than the other two modules", () => {
  const counts = rarityCounts(expeditionRoster("intermediate"));
  assert.deepEqual(counts, { common: 9, uncommon: 5, rare: 5, epic: 9, legendary: 2 });
});

test("§2 finding: every possible three-card Primary squad meets Level 1 and Level 2's readiness recommendation, including the weakest possible all-Common squad", () => {
  const fieldCards = fieldCardsFor("primary");
  const allSquads = combinations3(fieldCards);
  assert.equal(allSquads.length, 4060, "C(30,3)");
  for (const level of [1, 2]) {
    const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.level === level);
    const metCount = allSquads.filter((squad) => assessSquadReadiness(scenario, squad).meetsRecommendation).length;
    assert.equal(metCount, allSquads.length, `Level ${level}'s average-BV-12 recommendation should be met by literally every squad (the lowest card BV in the collection is 13), so the readiness meter can never show a shortfall here`);
  }
});

test("§2 finding: no all-Common Primary squad ever meets a Level 3+ recommendation (a real cliff at the rarity floor, not a gradual slope)", () => {
  const fieldCards = fieldCardsFor("primary");
  const commonSquads = combinations3(fieldCards.filter((card) => card.r === "common"));
  assert.equal(commonSquads.length, 220, "C(12,3)");
  for (let level = 3; level <= 10; level += 1) {
    const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.level === level);
    const metCount = commonSquads.filter((squad) => assessSquadReadiness(scenario, squad).meetsRecommendation).length;
    assert.equal(metCount, 0, `Level ${level} should be unreachable by an all-Common squad`);
  }
});

test("§2 finding: every Primary level from 3 to 10 is achievable by at least one real three-card squad — no stated recommendation is actually impossible", () => {
  const fieldCards = fieldCardsFor("primary");
  const allSquads = combinations3(fieldCards);
  for (let level = 3; level <= 10; level += 1) {
    const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.level === level);
    const metCount = allSquads.filter((squad) => assessSquadReadiness(scenario, squad).meetsRecommendation).length;
    assert.ok(metCount > 0, `Level ${level}'s recommendation should be met by at least one real squad`);
  }
});

test("§2 finding: Levels 9 and 10's all-Epic-or-Legendary recommendation is met by exactly the squads drawable from the collection's 8 Epic-or-better cards (6 Epic + 2 Legendary)", () => {
  const fieldCards = fieldCardsFor("primary");
  const allSquads = combinations3(fieldCards);
  const epicOrBetterCount = fieldCards.filter((card) => card.r === "epic" || card.r === "legendary").length;
  assert.equal(epicOrBetterCount, 8);
  const expected = (epicOrBetterCount * (epicOrBetterCount - 1) * (epicOrBetterCount - 2)) / 6; // C(8,3)
  for (const level of [9, 10]) {
    const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.level === level);
    const metCount = allSquads.filter((squad) => assessSquadReadiness(scenario, squad).meetsRecommendation).length;
    assert.equal(metCount, expected);
  }
});
