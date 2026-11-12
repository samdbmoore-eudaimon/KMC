// Unit tests for wm-progress-actions.js: applyAnswer (recordAnswer's reducer),
// applyBossDefeat (beatBoss's reducer), and applyMockResult (MockTest's
// finish() reducer) — the central progression events, extracted from
// WallabyMaths.jsx so their XP/star/streak/tier/badge/token/boss-gate maths
// can be exercised directly rather than only through the UI.
import assert from "node:assert/strict";
import test from "node:test";
import { applyAnswer, applyBossDefeat, applyMockResult, applyExpeditionResult, personalBestComparison } from "../wm-progress-actions.js";
import { freshProgress, flattenProgress, freshModuleProgress } from "../wm-progress.js";
import { setActiveModuleKey, setModuleActiveVars } from "../generators/gen-shared.js";
import {
  JUNIOR_CARDS, JUNIOR_RARITY, JUNIOR_CARD_CLASS, JUNIOR_EXAM_PASS_MARKS, JUNIOR_examKindFor,
  examPassMarkFor, streakStarGain,
} from "../generators/junior-generators.js";

// applyMockResult reads examKindFor/examPassMarkFor, which are live bindings set per active
// module (same pattern as scripts/test_generator_support_logic.mjs) — activate Junior once,
// since none of these tests need to switch modules mid-file.
setActiveModuleKey("junior");
setModuleActiveVars(JUNIOR_examKindFor, JUNIOR_EXAM_PASS_MARKS, JUNIOR_RARITY, JUNIOR_CARD_CLASS, JUNIOR_CARDS);

// applyAnswer/applyBossDefeat both operate on the FLATTENED view (shared fields —
// xp, badges, sessionStreak, cards — merged flat with one module's own bucket —
// stars, packs, topicStats, bossesBeaten, ... — see flattenProgress in
// wm-progress.js), exactly as setActiveProgress hands them in the real app.
const base = () => flattenProgress(freshProgress(), "junior");
const ctx = (extra = {}) => ({ activeModule: "junior", maxLevel: 10, ...extra });

test("a correct, credit-eligible answer awards XP, a topic-stat correct/total bump, and a star", () => {
  const p = { ...base(), xp: 0, stars: 0, sessionStreak: 0, topicStats: {} };
  const next = applyAnswer(p, { topic: "fractions", correct: true, difficulty: 1, ...ctx() });
  assert.equal(next.topicStats.fractions.correct, 1);
  assert.equal(next.topicStats.fractions.total, 1);
  assert.equal(next.sessionStreak, 1);
  assert.equal(next.xp, 10); // 10 base, no streak bonus yet, difficulty 1 has no +5
  assert.equal(next.stars, 0); // streakStarGain(1, ...) pays nothing for a lone correct
});

test("a wrong answer still records total but resets the streak and earns minimal XP, no stars", () => {
  const p = { ...base(), xp: 0, stars: 0, sessionStreak: 5, topicStats: { fractions: { correct: 3, total: 5, tier: 1, sinceUp: 3 } } };
  const next = applyAnswer(p, { topic: "fractions", correct: false, difficulty: 2, ...ctx() });
  assert.equal(next.topicStats.fractions.correct, 3);
  assert.equal(next.topicStats.fractions.total, 6);
  assert.equal(next.sessionStreak, 0);
  assert.equal(next.xp, 2);
});

test("peeking at the solution (creditEligible=false) still records correctness but forfeits streak/tier/stars", () => {
  const p = { ...base(), xp: 0, stars: 0, sessionStreak: 4, topicStats: { fractions: { correct: 2, total: 3, tier: 1, sinceUp: 9 } } };
  const next = applyAnswer(p, { topic: "fractions", correct: true, difficulty: 1, creditEligible: false, ...ctx() });
  assert.equal(next.topicStats.fractions.correct, 3, "correctness is still recorded honestly");
  assert.equal(next.topicStats.fractions.sinceUp, 9, "no tier progress for a peeked answer");
  assert.equal(next.sessionStreak, 0, "peeking breaks the streak just like a wrong answer");
  assert.equal(next.stars, 0);
});

test("a topic tiers up every 10 credit-eligible correct answers, capped at maxLevel", () => {
  let p = { ...base(), topicStats: { fractions: { correct: 0, total: 0, tier: 1, sinceUp: 9 } } };
  p = applyAnswer(p, { topic: "fractions", correct: true, difficulty: 1, ...ctx() });
  assert.equal(p.topicStats.fractions.tier, 2);
  assert.equal(p.topicStats.fractions.sinceUp, 0);

  const atCap = { ...base(), topicStats: { fractions: { correct: 0, total: 0, tier: 10, sinceUp: 9 } } };
  const next = applyAnswer(atCap, { topic: "fractions", correct: true, difficulty: 1, ...ctx({ maxLevel: 10 }) });
  assert.equal(next.topicStats.fractions.tier, 10, "should not tier past maxLevel");
});

test("session streak bonus XP grows with streak length and caps at +20, plus a difficulty-4 bonus", () => {
  const streak0 = applyAnswer({ ...base(), sessionStreak: 0 }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  const streak5 = applyAnswer({ ...base(), sessionStreak: 5 }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  const streak99 = applyAnswer({ ...base(), sessionStreak: 99 }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  assert.equal(streak0.xp - base().xp, 10);
  assert.equal(streak5.xp - base().xp, 10 + 10); // +2 per streak point, from sessionStreak=5
  assert.equal(streak99.xp - base().xp, 10 + 20); // capped at +20
  const hardQuestion = applyAnswer({ ...base(), sessionStreak: 0 }, { topic: "t", correct: true, difficulty: 3, ...ctx() });
  assert.equal(hardQuestion.xp - base().xp, 15); // +5 for difficulty >= 3
});

test("starValue overrides the default 1/2-star-per-difficulty rule (e.g. Olympiad questions worth 3)", () => {
  // 2nd of a streak pays double, so give it a real streak to see the override multiplied.
  const p = { ...base(), sessionStreak: 1, stars: 0 };
  const next = applyAnswer(p, { topic: "t", correct: true, difficulty: 1, starValue: 3, ...ctx() });
  assert.equal(next.stars, 6); // streakStarGain(2, 3) = 3*2
});

test("stars bank into a pack once they reach PACK_COST, carrying the remainder", () => {
  const p = { ...base(), stars: 19, sessionStreak: 1, packs: 0 }; // 2nd-of-streak with 1 star each -> +2
  const next = applyAnswer(p, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  assert.equal(next.packs, 1);
  assert.equal(next.stars, 1); // 19 + 2 = 21, 21 - 20(PACK_COST) = 1
});

test("badges: firstHop always, tenStreak/twentyStreak/century/fiveHundred/yearNine/tier5/giffEntry at their thresholds, never duplicated", () => {
  const tenStreak = applyAnswer({ ...base(), sessionStreak: 9 }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  assert.ok(tenStreak.badges.includes("firstHop"));
  assert.ok(tenStreak.badges.includes("tenStreak"));
  assert.ok(!tenStreak.badges.includes("twentyStreak"));

  const twentyStreak = applyAnswer({ ...base(), sessionStreak: 19 }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  assert.ok(twentyStreak.badges.includes("twentyStreak"));

  const century = applyAnswer({ ...base(), xp: 95 }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  assert.ok(century.badges.includes("century"));

  const yearNine = applyAnswer({ ...base() }, { topic: "t", correct: true, difficulty: 4, ...ctx() });
  assert.ok(yearNine.badges.includes("yearNine"));
  const yearNineWrong = applyAnswer({ ...base() }, { topic: "t", correct: false, difficulty: 4, ...ctx() });
  assert.ok(!yearNineWrong.badges.includes("yearNine"), "yearNine only for a CORRECT difficulty-4 answer");

  const tier5 = applyAnswer({ ...base(), topicStats: { t: { correct: 0, total: 0, tier: 4, sinceUp: 9 } } }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  assert.ok(tier5.badges.includes("tier5"));

  const giffEntry = applyAnswer({ ...base(), topicStats: {} }, { topic: "t", correct: true, difficulty: 1, ...ctx({ activeModule: "intermediate" }) });
  assert.ok(giffEntry.badges.includes("giffEntry"));
  const notGiffModule = applyAnswer({ ...base(), topicStats: {} }, { topic: "t", correct: true, difficulty: 1, ...ctx({ activeModule: "junior" }) });
  assert.ok(!notGiffModule.badges.includes("giffEntry"));

  const already = applyAnswer({ ...base(), badges: ["firstHop"], sessionStreak: 9 }, { topic: "t", correct: true, difficulty: 1, ...ctx() });
  assert.equal(already.badges.filter((b) => b === "firstHop").length, 1, "never duplicates an already-earned badge");
});

test("applyBossDefeat grants the trophy card, a challenge token, +50 xp, and unlocks the next level", () => {
  const p = { ...base(), bossesBeaten: 2, unlockedLevel: 3, xp: 0, cards: {}, challengeTokens: 0 };
  const next = applyBossDefeat(p, 3, ctx());
  assert.equal(next.bossesBeaten, 3);
  assert.equal(next.unlockedLevel, 4);
  assert.equal(next.xp, 50);
  assert.equal(next.cards.boss_junior_3, 1); // bossCardId namespaces the trophy by module, not a bare "boss_3"
  assert.equal(next.challengeTokens, 1);
});

test("applyBossDefeat is a no-op (idempotent) if that boss was already beaten — no re-granting a token", () => {
  const p = { ...base(), bossesBeaten: 5, unlockedLevel: 6, xp: 100, challengeTokens: 3 };
  const next = applyBossDefeat(p, 3, ctx()); // boss 3 already implied beaten (bossesBeaten=5 >= 3)
  assert.equal(next, p, "should return the exact same object, granting nothing twice");
});

test("applyBossDefeat caps unlockedLevel at maxLevel and awards muddleKing/giffComplete only for the final boss", () => {
  const junior = applyBossDefeat({ ...base(), bossesBeaten: 8, unlockedLevel: 9 }, 10, ctx({ maxLevel: 10 }));
  assert.equal(junior.unlockedLevel, 10, "never exceeds maxLevel even though n+1 would be 11");
  assert.ok(junior.badges.includes("muddleKing"));
  assert.ok(!junior.badges.includes("giffComplete"), "giffComplete is intermediate-only");

  const intermediate = applyBossDefeat({ ...base(), bossesBeaten: 8, unlockedLevel: 9 }, 10, ctx({ activeModule: "intermediate", maxLevel: 10 }));
  assert.ok(intermediate.badges.includes("muddleKing"));
  assert.ok(intermediate.badges.includes("giffComplete"));

  const notFinalBoss = applyBossDefeat({ ...base(), bossesBeaten: 5 }, 6, ctx({ maxLevel: 10 }));
  assert.ok(!notFinalBoss.badges.includes("muddleKing"));
});

test("applyBossDefeat caps challengeTokens at 10", () => {
  const p = { ...base(), bossesBeaten: 8, challengeTokens: 10 };
  const next = applyBossDefeat(p, 9, ctx());
  assert.equal(next.challengeTokens, 10);
});

test("applyBossDefeat never lowers unlockedLevel if it was already ahead of n+1", () => {
  const p = { ...base(), bossesBeaten: 0, unlockedLevel: 8 };
  const next = applyBossDefeat(p, 1, ctx());
  assert.equal(next.unlockedLevel, 8, "beating an old boss again for some other reason shouldn't roll back progress");
});

// applyMockResult (MockTest's finish() reducer) — scores a completed paper and applies its
// rewards: a paper pass unlocks the boss gate (mocks[towerLevel]), a strong pass banks a
// shiny claim, stars follow the same anti-guessing streak rule as ordinary Practice.
const towerLevel = 1;
const kind = JUNIOR_examKindFor(towerLevel);
const passMark = examPassMarkFor(towerLevel);
const paperOf = (n) => Array.from({ length: n }, () => ({ correctIndex: 0 }));
const answersAllCorrect = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 0]));
const answersFirstNCorrect = (total, correctN) => Object.fromEntries(Array.from({ length: total }, (_, i) => [i, i < correctN ? 0 : 1]));
const expectedStreakStars = (correctRunLength) => { let stars = 0, run = 0; for (let i = 0; i < correctRunLength; i++) { run += 1; stars += streakStarGain(run, 1); } return stars; };

test("applyMockResult scores the paper, banks streak-rule stars, and records a testHistory entry", () => {
  const total = 15, correctN = 10;
  const p = { ...base(), stars: 0, packs: 0, testHistory: [] };
  const next = applyMockResult(p, { paper: paperOf(total), answers: answersFirstNCorrect(total, correctN), kind, towerLevel });
  assert.equal(next.stars, expectedStreakStars(correctN));
  assert.equal(next.testHistory.length, 1);
  assert.equal(next.testHistory[0].correct, correctN);
  assert.equal(next.testHistory[0].score, correctN);
  assert.equal(next.testHistory[0].kind, kind);
  assert.equal(next.testHistory[0].towerLevel, towerLevel);
  assert.equal(next.bestTest, correctN);
});

test("applyMockResult below pass mark: no boss-gate unlock, no shiny claim", () => {
  const total = 25, correctN = passMark - 1;
  const p = { ...base(), mocks: {}, shinyPasses: {} };
  const next = applyMockResult(p, { paper: paperOf(total), answers: answersFirstNCorrect(total, correctN), kind, towerLevel });
  assert.equal(next.mocks[towerLevel], undefined);
  assert.deepEqual(next.shinyPasses, {});
});

test("applyMockResult at exactly the pass mark unlocks the boss gate (mocks[towerLevel])", () => {
  const total = 25;
  const p = { ...base(), mocks: {} };
  const next = applyMockResult(p, { paper: paperOf(total), answers: answersFirstNCorrect(total, passMark), kind, towerLevel });
  assert.equal(next.mocks[towerLevel], true);
});

test("applyMockResult never un-passes a boss gate once true, even on a weaker later attempt", () => {
  const total = 25;
  const p = { ...base(), mocks: { [towerLevel]: true } };
  const next = applyMockResult(p, { paper: paperOf(total), answers: answersFirstNCorrect(total, 0), kind, towerLevel });
  assert.equal(next.mocks[towerLevel], true);
});

test("applyMockResult at SHINY_MOCK_MARK (21) correct banks a shiny claim, one strong pass = one claim", () => {
  const total = 25;
  const p = { ...base(), shinyPasses: {} };
  const next = applyMockResult(p, { paper: paperOf(total), answers: answersAllCorrect(total), kind, towerLevel }); // all 25 correct
  assert.equal(next.shinyPasses[kind], 1);
  const twice = applyMockResult(next, { paper: paperOf(total), answers: answersAllCorrect(total), kind, towerLevel });
  assert.equal(twice.shinyPasses[kind], 2, "a second strong pass banks a second, separate claim");
});

test("applyMockResult badges: tester always, goldPaper only at score >= 20", () => {
  const weak = applyMockResult({ ...base() }, { paper: paperOf(10), answers: answersFirstNCorrect(10, 5), kind, towerLevel });
  assert.ok(weak.badges.includes("tester"));
  assert.ok(!weak.badges.includes("goldPaper"));

  const strong = applyMockResult({ ...base() }, { paper: paperOf(25), answers: answersFirstNCorrect(25, 20), kind, towerLevel });
  assert.ok(strong.badges.includes("goldPaper"));
});

test("applyMockResult always awards 40 xp for finishing a paper", () => {
  const p = { ...base(), xp: 10 };
  const next = applyMockResult(p, { paper: paperOf(5), answers: {}, kind, towerLevel });
  assert.equal(next.xp, 50);
});

// ---------------- applyExpeditionResult (E5) ----------------

test("PRG-03: a first clear grants three stars, once", () => {
  const p = { ...base(), stars: 0, packs: 0 };
  const first = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 4, actionsUsed: 19 });
  assert.equal(first.stars, 3);
  assert.equal(first.expeditions.scenarios.po_unequal_crossing.completed, true);
  const again = applyExpeditionResult(first, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 3, actionsUsed: 15 });
  assert.equal(again.stars, 4, "PRG-04: a replay (already completed) grants exactly one star, not a second first-clear award");
});

test("PRG-04: a replay of an already-completed scenario grants exactly one star", () => {
  const p = { ...base(), stars: 0, packs: 0, expeditions: { version: 2, scenarios: { po_unequal_crossing: { completed: true, bestTurns: 4, bestActions: 19, marks: [], recentSeeds: [], lastBlueprintVersion: 1 } }, moduleSetRewarded: false } };
  const next = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 2, actionsUsed: 10 });
  assert.equal(next.stars, 1);
  assert.equal(next.packs, 0);
  const again = applyExpeditionResult(next, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 2, actionsUsed: 10 });
  assert.equal(again.stars, 2, "each subsequent replay earns another star, not just the first one");
});

test("PRG-05: crossing the twenty-star boundary creates the correct pack remainder", () => {
  const p = { ...base(), stars: 19, packs: 0 };
  const next = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 4, actionsUsed: 19 });
  assert.equal(next.stars, 2);
  assert.equal(next.packs, 1);
});

test("PRG-05: a replay crossing the twenty-star boundary also creates the correct pack remainder", () => {
  const p = { ...base(), stars: 19, packs: 0, expeditions: { version: 2, scenarios: { po_unequal_crossing: { completed: true, bestTurns: 4, bestActions: 19, marks: [], recentSeeds: [], lastBlueprintVersion: 1 } }, moduleSetRewarded: false } };
  const next = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 4, actionsUsed: 19 });
  assert.equal(next.stars, 0);
  assert.equal(next.packs, 1);
});

test("PRG-06, PRG-07: best turns and best actions only ever improve", () => {
  let p = applyExpeditionResult({ ...base() }, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 4, actionsUsed: 19 });
  p = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 6, actionsUsed: 25 });
  assert.equal(p.expeditions.scenarios.po_unequal_crossing.bestTurns, 4, "a worse replay must not raise bestTurns");
  assert.equal(p.expeditions.scenarios.po_unequal_crossing.bestActions, 19);
  p = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 3, actionsUsed: 12 });
  assert.equal(p.expeditions.scenarios.po_unequal_crossing.bestTurns, 3);
  assert.equal(p.expeditions.scenarios.po_unequal_crossing.bestActions, 12);
});

test("personalBestComparison: a strictly better value improves, matching the same Math.min rule bestTurns/bestActions use", () => {
  assert.deepEqual(personalBestComparison(4, 3), { improved: true, matchedBest: false, previousBest: 4, newBest: 3 });
});

test("personalBestComparison: an equal value matches the best without claiming improvement", () => {
  assert.deepEqual(personalBestComparison(4, 4), { improved: false, matchedBest: true, previousBest: 4, newBest: 4 });
});

test("personalBestComparison: a worse value changes neither the best nor the improved/matched flags", () => {
  assert.deepEqual(personalBestComparison(4, 6), { improved: false, matchedBest: false, previousBest: 4, newBest: 4 });
});

test("personalBestComparison: no previous best (first time this metric is recorded) counts as an improvement", () => {
  assert.deepEqual(personalBestComparison(null, 5), { improved: true, matchedBest: false, previousBest: null, newBest: 5 });
});

test("personalBestComparison: no candidate value (turnsUsed/actionsUsed not supplied) is a no-op", () => {
  assert.deepEqual(personalBestComparison(4, null), { improved: false, matchedBest: false, previousBest: 4, newBest: 4 });
  assert.deepEqual(personalBestComparison(null, null), { improved: false, matchedBest: false, previousBest: null, newBest: null });
});

test("PRG-08: recent seeds cap at five and never duplicate", () => {
  let p = { ...base() };
  for (const seed of [1, 2, 3, 4, 5, 6]) p = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 4, actionsUsed: 19, seed });
  assert.deepEqual(p.expeditions.scenarios.po_unequal_crossing.recentSeeds, [2, 3, 4, 5, 6]);
});

test("PRG-09: the module-set Reveal token grants exactly once, when the final scenario first clears", () => {
  let p = { ...base(), challengeTokens: 0, expeditions: { version: 2, scenarios: Object.fromEntries(["a", "b"].map((id) => [id, { completed: true, bestTurns: 1, bestActions: 1, marks: [], recentSeeds: [], lastBlueprintVersion: 1 }])), moduleSetRewarded: false } };
  const cleared = applyExpeditionResult(p, { scenarioId: "c", won: true, turnsUsed: 2, actionsUsed: 5 }, { totalScenarioCount: 3 });
  assert.equal(cleared.expeditions.moduleSetRewarded, true);
  assert.equal(cleared.challengeTokens, 1);
  const replay = applyExpeditionResult(cleared, { scenarioId: "c", won: true, turnsUsed: 1, actionsUsed: 3 }, { totalScenarioCount: 3 });
  assert.equal(replay.challengeTokens, 1, "the module-set token must not grant a second time");
});

test("PRG-10: expedition progress is isolated per module by the normal shared/per-module split", () => {
  const primary = applyExpeditionResult(flattenProgress(freshProgress(), "primary"), { scenarioId: "po_unequal_crossing", won: true, turnsUsed: 4, actionsUsed: 19 });
  const junior = flattenProgress(freshProgress(), "junior");
  assert.equal(junior.stars, 0);
  assert.deepEqual(junior.expeditions, freshModuleProgress().expeditions);
  assert.equal(primary.stars, 3, "the primary-module result must not leak into a separately-flattened junior view");
});

test("PRG-11: a failed or abandoned run is a no-op", () => {
  const p = { ...base(), stars: 5 };
  const next = applyExpeditionResult(p, { scenarioId: "po_unequal_crossing", won: false, turnsUsed: 4, actionsUsed: 10 });
  assert.equal(next, p, "a loss must return the exact same progress object, not just an equivalent one");
});
