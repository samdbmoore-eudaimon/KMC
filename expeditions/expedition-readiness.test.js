import test from "node:test";
import assert from "node:assert/strict";
import { EXPEDITION_SCENARIOS } from "./expedition-data.js";
import { assessSquadReadiness, expeditionReadinessBandForRarity, meetsRarityFloor } from "./expedition-readiness.js";
import { validateAllExpeditionContent, validateExpeditionScenarioSet, validateScenarioBlueprint } from "./expedition-schema.js";

// Small deterministic fixture cards — readiness only ever reads r (rarity), bv (battle
// value) and s (stats), so real roster cards are not needed to exercise the rule.
function fixtureCard(id, rarity, bv, stats = [1, 1, 1, 1, 1]) {
  return { id, r: rarity, bv, s: stats };
}

function scenarioAtLevel(level) {
  const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.level === level);
  assert.ok(scenario, `expected a primary scenario at level ${level}`);
  return scenario;
}

// These tests cover the "RDY" readiness catalogue from EXPEDITIONS_CLAUDE_HANDOVER.md,
// updated per the user's 2026-09-14 correction: readiness is advisory only. A squad that
// falls short of the recommendation still gets a result back (meetsRecommendation: false
// plus shortfalls to show), never a thrown error or a "you may not enter" refusal — Embark
// is a UI concern outside this module's scope, and nothing here may ever be wired to block it.

test("RDY-01: missions 1 and 2 treat a legal early Uncommon-heavy squad as meeting the recommendation", () => {
  const squad = [fixtureCard("a", "uncommon", 13), fixtureCard("b", "common", 12), fixtureCard("c", "common", 12)];
  for (const level of [1, 2]) {
    const result = assessSquadReadiness(scenarioAtLevel(level), squad);
    assert.equal(result.meetsRecommendation, true, `level ${level}: ${JSON.stringify(result.shortfalls)}`);
  }
});

test("RDY-02: missions 3 and 4 recommend their Uncommon count without recommending Rare cards", () => {
  const readySquad = [fixtureCard("a", "uncommon", 20), fixtureCard("b", "uncommon", 20), fixtureCard("c", "common", 12)];
  const shortSquad = [fixtureCard("a", "uncommon", 20), fixtureCard("b", "common", 12), fixtureCard("c", "common", 12)];
  for (const level of [3, 4]) {
    const scenario = scenarioAtLevel(level);
    assert.equal(assessSquadReadiness(scenario, readySquad).meetsRecommendation, true, `level ${level} should meet the recommendation with two Uncommons`);
    const short = assessSquadReadiness(scenario, shortSquad);
    assert.equal(short.meetsRecommendation, false, `level ${level} should flag a shortfall with only one Uncommon`);
    assert.ok(short.shortfalls.some((r) => r.code === "minimum_rarity_count"));
    assert.ok(!short.shortfalls.some((r) => r.message.toLowerCase().includes("rare")), "must not recommend Rare cards at this band");
  }
});

test("RDY-03: missions 5 and 6 recommend at least two Rare-or-better cards", () => {
  const readySquad = [fixtureCard("a", "rare", 27), fixtureCard("b", "epic", 34), fixtureCard("c", "uncommon", 20)];
  const shortSquad = [fixtureCard("a", "rare", 27), fixtureCard("b", "uncommon", 21), fixtureCard("c", "uncommon", 20)];
  for (const level of [5, 6]) {
    const scenario = scenarioAtLevel(level);
    assert.equal(assessSquadReadiness(scenario, readySquad).meetsRecommendation, true, `level ${level} should meet the recommendation with two Rare-or-better cards`);
    assert.equal(assessSquadReadiness(scenario, shortSquad).meetsRecommendation, false, `level ${level} should flag a shortfall with only one Rare-or-better card`);
  }
});

test("RDY-04: missions 7 and 8 recommend at least one Epic and recommend against Common cards", () => {
  const readySquad = [fixtureCard("a", "epic", 34), fixtureCard("b", "rare", 28), fixtureCard("c", "rare", 28)];
  const noEpicSquad = [fixtureCard("a", "rare", 28), fixtureCard("b", "rare", 28), fixtureCard("c", "rare", 28)];
  const withCommonSquad = [fixtureCard("a", "epic", 34), fixtureCard("b", "epic", 34), fixtureCard("c", "common", 15)];
  for (const level of [7, 8]) {
    const scenario = scenarioAtLevel(level);
    assert.equal(assessSquadReadiness(scenario, readySquad).meetsRecommendation, true, `level ${level} should meet the recommendation with one Epic plus Rares`);
    const noEpic = assessSquadReadiness(scenario, noEpicSquad);
    assert.equal(noEpic.meetsRecommendation, false);
    assert.ok(noEpic.shortfalls.some((r) => r.code === "minimum_rarity_count"));
    const withCommon = assessSquadReadiness(scenario, withCommonSquad);
    assert.equal(withCommon.meetsRecommendation, false);
    assert.ok(withCommon.shortfalls.some((r) => r.code === "forbidden_rarity"));
  }
});

test("RDY-05: missions 9 and 10 flag a shortfall for a squad containing any Common, Uncommon or Rare card", () => {
  for (const level of [9, 10]) {
    const scenario = scenarioAtLevel(level);
    const allEpic = [fixtureCard("a", "epic", 35), fixtureCard("b", "epic", 35), fixtureCard("c", "legendary", 45)];
    assert.equal(assessSquadReadiness(scenario, allEpic).meetsRecommendation, true, `level ${level} should meet the recommendation with a full Epic-or-better squad`);
    for (const weak of ["common", "uncommon", "rare"]) {
      const squad = [fixtureCard("a", "epic", 35), fixtureCard("b", "epic", 35), fixtureCard("c", weak, 20)];
      const result = assessSquadReadiness(scenario, squad);
      assert.equal(result.meetsRecommendation, false, `level ${level} must flag a shortfall for a single ${weak} card`);
      assert.ok(result.shortfalls.some((r) => r.code === "all_cards_minimum_rarity"));
    }
  }
});

test("RDY-06: Legendary cards satisfy an Epic-or-better recommendation", () => {
  assert.equal(meetsRarityFloor("legendary", "epic"), true);
  const scenario = scenarioAtLevel(9);
  const squad = [fixtureCard("a", "legendary", 45), fixtureCard("b", "legendary", 45), fixtureCard("c", "legendary", 45)];
  assert.equal(assessSquadReadiness(scenario, squad).meetsRecommendation, true);
});

test("RDY-07: a Commander does not satisfy a field-card rarity recommendation", () => {
  const scenario = scenarioAtLevel(9);
  const shortSquad = [fixtureCard("a", "epic", 35), fixtureCard("b", "epic", 35), fixtureCard("c", "rare", 27)];
  const legendaryCommander = fixtureCard("commander", "legendary", 45);
  const withoutCommander = assessSquadReadiness(scenario, shortSquad, null);
  const withCommanderArgument = assessSquadReadiness(scenario, shortSquad, legendaryCommander);
  assert.deepEqual(withCommanderArgument, withoutCommander, "passing a Commander must never change the readiness result");
  assert.equal(withCommanderArgument.meetsRecommendation, false, "a strong Commander must not paper over a squad that is still short a field card");
});

test("RDY-08: average battle value is calculated across deployed field cards only", () => {
  const scenario = scenarioAtLevel(7); // recommends average battle value >= 28
  const weakSquad = [fixtureCard("a", "epic", 10), fixtureCard("b", "epic", 10), fixtureCard("c", "epic", 10)];
  const weakResult = assessSquadReadiness(scenario, weakSquad);
  assert.equal(weakResult.meetsRecommendation, false, "a low average must flag a shortfall even when the rarity floor is met");
  assert.ok(weakResult.shortfalls.some((r) => r.code === "average_battle_value"));
  const strongSquad = [fixtureCard("a", "epic", 34), fixtureCard("b", "epic", 34), fixtureCard("c", "epic", 34)];
  assert.equal(assessSquadReadiness(scenario, strongSquad).meetsRecommendation, true);
});

test("RDY-09: every readiness shortfall returns a specific child-readable reason", () => {
  const scenario = scenarioAtLevel(9);
  const squad = [fixtureCard("a", "common", 12), fixtureCard("b", "common", 12), fixtureCard("c", "common", 12)];
  const result = assessSquadReadiness(scenario, squad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.every((r) => typeof r.code === "string" && typeof r.message === "string" && r.message.length > 0));
  assert.ok(result.shortfalls.some((r) => r.message === "Recommended: all 3 field cards Epic or Legendary."));
});

test("readiness never blocks: a squad far below recommendation on every mission still gets a normal result back", () => {
  const veryWeakSquad = [fixtureCard("a", "common", 12), fixtureCard("b", "common", 12), fixtureCard("c", "common", 12)];
  for (const scenario of EXPEDITION_SCENARIOS.primary) {
    assert.doesNotThrow(() => assessSquadReadiness(scenario, veryWeakSquad), `${scenario.id} must never throw or refuse — Embark is a UI decision outside this module`);
  }
});

test("readiness supports named capability requirements such as Geometry 7+", () => {
  const scenario = { readiness: { minimumAverageBattleValue: 0, minimumRarityCounts: {}, allCardsMinimumRarity: null, forbiddenRarities: [], capabilityRequirements: [{ stat: "geometry", min: 7 }] } };
  const noGeometry = [fixtureCard("a", "epic", 34, [1, 6, 1, 1, 1]), fixtureCard("b", "epic", 34, [1, 5, 1, 1, 1])];
  const missing = assessSquadReadiness(scenario, noGeometry);
  assert.equal(missing.meetsRecommendation, false);
  assert.ok(missing.shortfalls.some((r) => r.code === "capability" && r.message === "Recommended: one Geometry score of 7+."));
  const withGeometry = [fixtureCard("a", "epic", 34, [1, 7, 1, 1, 1]), fixtureCard("b", "epic", 34, [1, 5, 1, 1, 1])];
  assert.equal(assessSquadReadiness(scenario, withGeometry).meetsRecommendation, true);
});

test("readiness band lookup matches the five-notch meter", () => {
  assert.equal(expeditionReadinessBandForRarity("common").key, "starter");
  assert.equal(expeditionReadinessBandForRarity("uncommon").key, "uncommon");
  assert.equal(expeditionReadinessBandForRarity("rare").key, "rare");
  assert.equal(expeditionReadinessBandForRarity("epic").key, "epic");
  assert.equal(expeditionReadinessBandForRarity("legendary").key, "masterwork");
});

test("schema validation reports precise scenario and field errors for broken content", () => {
  const broken = { schemaVersion: 1, id: "test_broken", level: 11, title: "", family: "not-a-family", turns: 99, rule: "", enemies: ["no_such_enemy"], readiness: { minimumAverageBattleValue: -1, minimumRarityCounts: { nonsense: 1 }, allCardsMinimumRarity: "mythic", forbiddenRarities: ["mythic"], capabilityRequirements: [{ stat: 5, min: "x" }] } };
  const errors = validateScenarioBlueprint("primary", broken);
  const fields = errors.map((e) => e.field);
  assert.ok(fields.includes("level"));
  assert.ok(fields.includes("title"));
  assert.ok(fields.includes("family"));
  assert.ok(fields.includes("turns"));
  assert.ok(fields.includes("rule"));
  assert.ok(fields.includes("enemies"));
  assert.ok(errors.every((e) => e.scenarioId === "test_broken" && e.moduleKey === "primary"));
});

test("all authored Expedition content validates cleanly", () => {
  const errors = validateAllExpeditionContent();
  assert.deepEqual(errors, []);
});

test("missions 9 and 10 are flagged if their all-cards-Epic guidance is ever weakened", () => {
  const tampered = EXPEDITION_SCENARIOS.primary.map((s) => (s.level === 9 ? { ...s, readiness: { ...s.readiness, allCardsMinimumRarity: null } } : s));
  const errors = validateExpeditionScenarioSet("primary", tampered);
  assert.ok(errors.some((e) => e.scenarioId === tampered.find((s) => s.level === 9).id && e.field === "readiness.allCardsMinimumRarity"));
});
