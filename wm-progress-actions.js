// Pure progress-update reducers for the two central progression events —
// answering a question and defeating a boss — split out of WallabyMaths.jsx
// (recordAnswer/beatBoss) so the XP/star/streak/badge/token maths can be unit
// tested directly (see scripts/test_progress_actions.mjs) rather than only
// ever exercised by playing through the UI. Each takes the flattened
// per-module progress view (see flattenProgress in wm-progress.js) plus the
// bits its caller would otherwise supply via closure (activeModule, the
// active module's MAX_LEVEL), and returns the next flattened progress —
// callers still own actually writing it back via setActiveProgress.
import { PACK_COST, streakStarGain, bossCardId, examPassMarkFor, SHINY_MOCK_MARK } from "./generators/junior-generators.js";
import { examKindFor } from "./generators/gen-shared.js";
import { migrateExpeditionProgress } from "./wm-progress.js";

// Orchard v2 (engineVersion 2) first-clear reducer. Implemented beside its save/resume code in
// expeditions/v2/persistence.js (replay-verified, idempotent, atomic); re-exported here so every progress
// reducer is reachable from this one module.
export { applyOrchardV2Result } from "./expeditions/v2/persistence.js";

// `topic` is per-module (topicStats), everything else here (xp/stars/packs/
// sessionStreak/badges) is shared across modules — see SHARED_PROGRESS_KEYS in
// wm-progress.js — but recordAnswer always updates both in one go, so this
// reducer (like the component code it was extracted from) works on the
// flattened view rather than caring about that split itself.
export function applyAnswer(p, { topic, correct, difficulty, starValue, creditEligible = true, activeModule, maxLevel }) {
  const ts = { ...(p.topicStats || {}) };
  const cur = ts[topic] || { correct: 0, total: 0, tier: 1, sinceUp: 0 };
  // "Most revealing wins": a correct answer only counts toward stars/streak/tier-up when
  // creditEligible (i.e. the player didn't peek at the full solution before answering).
  // topicStats.correct/total and XP still reflect true correctness either way — peeking
  // doesn't erase understanding, it just forfeits that question's star and tier progress.
  const creditOk = correct && creditEligible;
  let tier = cur.tier || 1, sinceUp = cur.sinceUp || 0;
  if (creditOk) { sinceUp += 1; if (sinceUp >= 10 && tier < maxLevel) { tier += 1; sinceUp = 0; } }
  ts[topic] = { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1, tier, sinceUp };
  const sessionStreak = creditOk ? p.sessionStreak + 1 : 0;
  const gain = correct ? 10 + Math.min(p.sessionStreak * 2, 20) + (difficulty >= 3 ? 5 : 0) : 2;
  const xp = p.xp + gain;
  // Stars earned per correct answer: 1 normally, 2 for a Year 9 (difficulty 4)
  // or full-test question, 3 for an Olympiad question. starValue overrides when given.
  const perCorrect = starValue != null ? starValue : (difficulty >= 4 ? 2 : 1);
  const starGain = creditOk ? streakStarGain(sessionStreak, perCorrect) : 0;
  let stars = (p.stars || 0) + starGain;
  let packs = p.packs || 0;
  if (stars >= PACK_COST) { packs += Math.floor(stars / PACK_COST); stars = stars % PACK_COST; }
  const earn = ["firstHop"];
  if (creditOk && sessionStreak >= 10) earn.push("tenStreak");
  if (creditOk && sessionStreak >= 20) earn.push("twentyStreak");
  if (xp >= 100) earn.push("century");
  if (xp >= 500) earn.push("fiveHundred");
  if (correct && difficulty === 4) earn.push("yearNine");
  if (tier === 5 && (cur.tier || 1) < 5) earn.push("tier5");
  if (activeModule === "intermediate" && Object.keys(p.topicStats || {}).length === 0) earn.push("giffEntry");
  const have = new Set(p.badges);
  const fresh = earn.filter((k) => !have.has(k));
  return { ...p, topicStats: ts, sessionStreak, xp, stars, packs, badges: [...p.badges, ...fresh] };
}

export function applyBossDefeat(p, n, { activeModule, maxLevel }) {
  if ((p.bossesBeaten || 0) >= n) return p; // already beaten — no re-granting a token/trophy/badge
  const badges = [...(p.badges || [])];
  if (n >= maxLevel && !badges.includes("muddleKing")) badges.push("muddleKing");
  if (n >= maxLevel && activeModule === "intermediate" && !badges.includes("giffComplete")) badges.push("giffComplete");
  // Each boss drops its trophy card on defeat (idempotent — set, not increment).
  const cards = { ...(p.cards || {}), [bossCardId(n)]: (p.cards?.[bossCardId(n)] || 0) || 1 };
  // Each boss defeat awards 1 Challenge Token (§31 JOEY_SPEC.md), capped at 10 per module.
  const challengeTokens = Math.min((p.challengeTokens || 0) + 1, 10);
  return { ...p, bossesBeaten: n, unlockedLevel: Math.min(Math.max(p.unlockedLevel || 1, n + 1), maxLevel), xp: p.xp + 50, badges, cards, challengeTokens };
}

// MockTest's finish() reducer: scores a completed paper and applies its rewards — a paper
// pass unlocks the boss gate (mocks[towerLevel]), a strong pass (SHINY_MOCK_MARK+) banks a
// shiny claim, stars use the same anti-guessing streak rule as ordinary Practice.
export function applyMockResult(p, { paper, answers, kind, towerLevel }) {
  let score = 0, correctCount = 0;
  // Every question is worth 1 mark flatly today (mirrors the original code's private,
  // always-1 `markFor(i)` helper) — kept as an explicit loop rather than paper.length so
  // a future per-question mark scheme only has to change this one line.
  paper.forEach((q, i) => { if (answers[i] === q.correctIndex) { score += 1; correctCount += 1; } });
  // The mock uses Practice's anti-guessing streak rule: a run only starts paying at
  // its second correct answer, which pays the pair, then every further correct answer
  // pays one star. A blank or wrong answer breaks the run.
  let starsEarned = 0, run = 0;
  paper.forEach((q, i) => {
    if (answers[i] === q.correctIndex) { run += 1; starsEarned += streakStarGain(run, 1); }
    else run = 0;
  });
  const earn = ["tester"]; if (score >= 20) earn.push("goldPaper");
  const have = new Set(p.badges); const fresh = earn.filter((e) => !have.has(e));
  let stars = (p.stars || 0) + starsEarned;
  let packs = p.packs || 0;
  if (stars >= PACK_COST) { packs += Math.floor(stars / PACK_COST); stars = stars % PACK_COST; }
  let mocks = p.mocks || {};
  if (kind === examKindFor(towerLevel) && correctCount >= examPassMarkFor(towerLevel) && !mocks[towerLevel]) mocks = { ...mocks, [towerLevel]: true };
  // A strong pass (21+) banks one shiny claim for that level's paper. The player then
  // returns to a beaten boss in the Card Lab to spend a claim and make it shiny.
  let shinyPasses = p.shinyPasses || {};
  if (correctCount >= SHINY_MOCK_MARK) shinyPasses = { ...shinyPasses, [kind]: (shinyPasses[kind] || 0) + 1 };
  // Every attempt is recorded (not just the best) so the grown-ups dashboard can show trend.
  const testHistory = [...(p.testHistory || []), { date: Date.now(), kind, score, correct: correctCount, towerLevel }];
  return { ...p, badges: [...p.badges, ...fresh], xp: p.xp + 40, stars, packs, mocks, shinyPasses, testHistory, bestTest: Math.max(p.bestTest || 0, score) };
}

// Expeditions first-clear and replay reducer (EXPEDITIONS_CLAUDE_HANDOVER.md E5, §8.6).
// `result.won` must be true — a failed or abandoned run has nothing to record (PRG-11; the
// caller simply never calls this for a loss). The caller is expected to call this exactly once
// per genuine win (ExpeditionBoard.jsx guards this with a ref so a re-render never double-fires
// it). The module-set Reveal token only ever grants once, the moment the final scenario
// transitions from not-completed to completed. The star award is deliberately not a one-off in
// that sense: every call that wins awards something, three stars on that scenario's first clear
// and one star on every clear after that.
//
// `totalScenarioCount`, if given, is the active module's total scenario count (from
// EXPEDITION_SCENARIOS[moduleKey].length) — deliberately supplied by the caller rather than
// imported here, matching applyBossDefeat's maxLevel parameter: this reducer stays pure
// content data, no coupling to the scenario catalogue.
export function applyExpeditionResult(p, { scenarioId, won, turnsUsed, actionsUsed, seed, blueprintVersion, marks = [] }, { totalScenarioCount } = {}) {
  if (!won) return p;
  const bucket = migrateExpeditionProgress(p.expeditions);
  const existing = bucket.scenarios[scenarioId];
  const firstClear = !existing?.completed;
  const recentSeeds = seed == null
    ? (existing?.recentSeeds || [])
    : [...(existing?.recentSeeds || []).filter((s) => String(s) !== String(seed)), seed].slice(-5);
  const scenario = {
    completed: true,
    bestTurns: turnsUsed == null ? (existing?.bestTurns ?? null) : Math.min(existing?.bestTurns ?? Infinity, turnsUsed),
    bestActions: actionsUsed == null ? (existing?.bestActions ?? null) : Math.min(existing?.bestActions ?? Infinity, actionsUsed),
    marks: [...new Set([...(existing?.marks || []), ...marks])],
    recentSeeds,
    lastBlueprintVersion: blueprintVersion ?? existing?.lastBlueprintVersion ?? 1,
  };
  const scenarios = { ...bucket.scenarios, [scenarioId]: scenario };
  const allCleared = totalScenarioCount != null && Object.values(scenarios).filter((s) => s.completed).length >= totalScenarioCount;
  const moduleSetRewarded = bucket.moduleSetRewarded || allCleared;
  const grantsModuleReveal = allCleared && !bucket.moduleSetRewarded;
  // First clear of an ordinary expedition: three stars (EXPEDITIONS_BUILD_BRIEF.md §16). A
  // replay of an already-cleared scenario now also earns one star, matching the ordinary
  // one-star-per-correct-answer rate (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §8.6) — this
  // supersedes the mode's original "replays earn nothing" rule; see PRG-04.
  let stars = p.stars || 0, packs = p.packs || 0;
  stars += firstClear ? 3 : 1;
  if (stars >= PACK_COST) { packs += Math.floor(stars / PACK_COST); stars %= PACK_COST; }
  // The module-set reward is one Reveal token — the same currency Card Lab's Reveal action
  // already spends (challengeTokens; see JOEY_SPEC.md and beatBoss's own +1 per boss above).
  const challengeTokens = grantsModuleReveal ? Math.min((p.challengeTokens || 0) + 1, 10) : (p.challengeTokens || 0);
  return { ...p, stars, packs, challengeTokens, expeditions: { ...bucket, scenarios, moduleSetRewarded } };
}

// Personal-best comparison (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §8.3), a small pure helper
// so a caller can say "New best: 3 rounds (was 4)" without recomputing the bestTurns/bestActions
// logic applyExpeditionResult already owns above. The caller reads a scenario's existing best
// (e.g. `progress.expeditions.scenarios[id].bestTurns`, before applying the new result), passes
// it here alongside the just-played run's value, and gets back what to say — the engine owns
// the comparison, the UI still owns the actual sentence, matching the split already used for the
// weigh-bridge status text (EXPEDITIONS_CLAUDE_HANDOVER.md). Generic over turns or actions, or
// any other "lower is better" personal-best value — pass whichever one is wanted; unrelated to
// applyExpeditionResult itself and does not change its return shape.
export function personalBestComparison(previousBest, candidate) {
  if (candidate == null) return { improved: false, matchedBest: false, previousBest: previousBest ?? null, newBest: previousBest ?? null };
  if (previousBest == null) return { improved: true, matchedBest: false, previousBest: null, newBest: candidate };
  if (candidate < previousBest) return { improved: true, matchedBest: false, previousBest, newBest: candidate };
  if (candidate === previousBest) return { improved: false, matchedBest: true, previousBest, newBest: previousBest };
  return { improved: false, matchedBest: false, previousBest, newBest: previousBest };
}
