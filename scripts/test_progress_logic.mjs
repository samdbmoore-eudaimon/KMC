// Unit tests for wm-progress.js: fresh-profile shape, the shared/per-module
// progress split, and every one-time migration a real save can go through on
// its way to the current schema. This is the layer most likely to silently
// corrupt or lose a player's save if it regresses, and previously had no
// tests at all — see CLAUDE.md "Build & test".
import assert from "node:assert/strict";
import test from "node:test";
import {
  freshNotepad, NOTEPAD_PAGES, SHARED_PROGRESS_KEYS, freshModuleProgress, freshProgress,
  migrateJoeyDecksToPerModule, migrateProgress, migrateJuniorCurriculumProgress,
  migrateBossCardIds, migrateChallengeTokens, flattenProgress, unflattenProgress,
  packWeights, todayStr, applyDailyStreak,
  EXPEDITION_PROGRESS_VERSION, freshExpeditionProgress, migrateExpeditionProgress,
  migrateAllExpeditionProgress, expeditionScenarioRecord, expeditionCompletedCount,
} from "../wm-progress.js";

test("freshNotepad has NOTEPAD_PAGES blank pages", () => {
  const nb = freshNotepad();
  assert.equal(nb.page, 0);
  assert.equal(nb.pages.length, NOTEPAD_PAGES);
  for (const page of nb.pages) assert.deepEqual(page, { text: "", strokes: [] });
});

test("freshProgress has no modules and only shared fields at the top level", () => {
  const p = freshProgress();
  assert.deepEqual(p.modules, {});
  for (const k of Object.keys(p)) if (k !== "modules") assert.ok(SHARED_PROGRESS_KEYS.includes(k), `${k} should be listed in SHARED_PROGRESS_KEYS`);
});

test("flattenProgress/unflattenProgress round-trip a shared field and a per-module field", () => {
  const stored = { ...freshProgress(), xp: 40, modules: { junior: { ...freshModuleProgress(), stars: 7 } } };
  const flat = flattenProgress(stored, "junior");
  assert.equal(flat.xp, 40); // shared field visible
  assert.equal(flat.stars, 7); // module field merged flat

  const { shared, moduleFields } = unflattenProgress({ ...flat, xp: 41, stars: 8 }, "junior");
  assert.equal(shared.xp, 41);
  assert.equal(moduleFields.stars, 8);
  assert.ok(!("modules" in moduleFields) && !("modules" in shared), "modules key itself should never round-trip into either half");
});

test("flattenProgress falls back to a fresh bucket for a module never played", () => {
  const stored = { ...freshProgress(), modules: {} };
  const flat = flattenProgress(stored, "primary");
  assert.equal(flat.unlockedLevel, 1);
  assert.equal(flat.stars, 0);
});

test("migrateProgress on a pre-Phase-0 flat save nests every non-shared field under modules.junior", () => {
  const legacy = { xp: 12, badges: ["a"], cards: { addy: 1 }, unlockedLevel: 3, stars: 5, bossesBeaten: 1 };
  const migrated = migrateProgress(legacy);
  assert.equal(migrated.xp, 12);
  assert.deepEqual(migrated.cards, { addy: 1 });
  assert.equal(migrated.modules.junior.unlockedLevel, 3);
  assert.equal(migrated.modules.junior.stars, 5);
  assert.equal(migrated.modules.junior.bossesBeaten, 1);
});

test("migrateProgress on an already-split save passes shared fields through untouched", () => {
  const already = { ...freshProgress(), xp: 99, modules: { primary: { ...freshModuleProgress(), stars: 3 } } };
  const migrated = migrateProgress(already, "primary");
  assert.equal(migrated.xp, 99);
  assert.equal(migrated.modules.primary.stars, 3);
  assert.ok(!migrated.modules.junior, "should not invent a junior bucket for a primary-only save");
});

test("migrateProgress with no saved progress at all returns freshProgress()", () => {
  assert.deepEqual(migrateProgress(null), freshProgress());
  assert.deepEqual(migrateProgress(undefined), freshProgress());
});

// A genuinely old on-disk module bucket predates joeyDecks existing at all — it's
// missing the key entirely, not merely holding a falsy value (freshModuleProgress()
// today already seeds a default joeyDecks array, so spreading THAT in as "existing
// data" would be an unrealistic fixture: it can't represent what an old save
// actually looked like on disk before this field existed).
const legacyModuleBucket = () => { const { joeyDecks, joeyActiveDeck, ...rest } = freshModuleProgress(); return rest; };

test("migrateJoeyDecksToPerModule re-homes top-level joeyDecks under the active module hint", () => {
  const stored = { modules: { junior: legacyModuleBucket() }, joeyDecks: ["deckA", null, null, null, null], joeyActiveDeck: 2 };
  const migrated = migrateJoeyDecksToPerModule(stored, "junior");
  assert.ok(!("joeyDecks" in migrated) && !("joeyActiveDeck" in migrated), "top-level fields should be removed");
  assert.deepEqual(migrated.modules.junior.joeyDecks, ["deckA", null, null, null, null]);
  assert.equal(migrated.modules.junior.joeyActiveDeck, 2);
});

test("migrateJoeyDecksToPerModule defaults to junior when there is no matching module hint", () => {
  const stored = { modules: {}, joeyDecks: ["deckA", null, null, null, null], joeyActiveDeck: 1 };
  const migrated = migrateJoeyDecksToPerModule(stored, "primary"); // hint given, but primary has never been played
  assert.equal(migrated.modules.junior.joeyActiveDeck, 1);
  assert.ok(!migrated.modules.primary, "should not invent a primary bucket just from the hint");
});

test("migrateJoeyDecksToPerModule never clobbers a module that already has its own decks", () => {
  const existing = { ...freshModuleProgress(), joeyDecks: ["keepMe", null, null, null, null], joeyActiveDeck: 3 };
  const stored = { modules: { junior: existing }, joeyDecks: ["shouldBeIgnored", null, null, null, null], joeyActiveDeck: 0 };
  const migrated = migrateJoeyDecksToPerModule(stored, "junior");
  assert.deepEqual(migrated.modules.junior.joeyDecks, ["keepMe", null, null, null, null]);
  assert.equal(migrated.modules.junior.joeyActiveDeck, 3);
});

test("migrateJoeyDecksToPerModule is a no-op when there's nothing to migrate", () => {
  const stored = { modules: { junior: freshModuleProgress() } };
  assert.deepEqual(migrateJoeyDecksToPerModule(stored, "junior"), stored);
});

test("migrateJuniorCurriculumProgress folds an old topic's stats into its renamed successor", () => {
  const stored = { modules: { junior: { ...freshModuleProgress(), topicStats: {
    multiExpr: { correct: 3, total: 5, tier: 2, sinceUp: 1 },
    expressionsEquations: { correct: 1, total: 2, tier: 1, sinceUp: 0 },
  } } } };
  const migrated = migrateJuniorCurriculumProgress(stored);
  assert.equal(migrated.modules.junior.juniorCurriculumV2, true);
  assert.deepEqual(migrated.modules.junior.topicStats.expressionsEquations, { correct: 4, total: 7, tier: 2, sinceUp: 1 });
  assert.ok(!("multiExpr" in migrated.modules.junior.topicStats), "the old key should be removed after folding");
});

test("migrateJuniorCurriculumProgress is idempotent once flagged", () => {
  const already = { modules: { junior: { ...freshModuleProgress(), juniorCurriculumV2: true, topicStats: { multiExpr: { correct: 1, total: 1 } } } } };
  const migrated = migrateJuniorCurriculumProgress(already);
  assert.equal(migrated, already, "should return the same object, not re-fold anything");
});

test("migrateJuniorCurriculumProgress is a no-op for a save with no junior module at all", () => {
  const stored = { modules: { primary: freshModuleProgress() } };
  assert.equal(migrateJuniorCurriculumProgress(stored), stored);
});

test("migrateBossCardIds renames the old module-agnostic boss key to the namespaced junior one", () => {
  const progress = { cards: { boss3: 1, addy: 2 } };
  const migrated = migrateBossCardIds(progress);
  assert.deepEqual(migrated.cards, { boss_junior_3: 1, addy: 2 });
});

test("migrateBossCardIds is a no-op once already namespaced", () => {
  const progress = { cards: { boss_junior_3: 1 } };
  assert.equal(migrateBossCardIds(progress), progress);
});

test("migrateChallengeTokens tops up a short balance but never reduces an existing one", () => {
  const stored = { modules: {
    junior: { bossesBeaten: 5, challengeUnlocked: { a: true }, challengeTokens: 0 }, // should top up to 5 - 1 = 4
    primary: { bossesBeaten: 2, challengeUnlocked: {}, challengeTokens: 10 }, // already ahead of formula — untouched
  } };
  const migrated = migrateChallengeTokens(stored);
  assert.equal(migrated.modules.junior.challengeTokens, 4);
  assert.equal(migrated.modules.primary.challengeTokens, 10);
});

test("migrateChallengeTokens caps earned tokens at 10 bosses' worth", () => {
  const stored = { modules: { junior: { bossesBeaten: 999, challengeUnlocked: {}, challengeTokens: 0 } } };
  assert.equal(migrateChallengeTokens(stored).modules.junior.challengeTokens, 10);
});

test("packWeights returns weights that sum to 100 at every level band, gated by minLevel elsewhere", () => {
  for (const lv of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20]) {
    const w = packWeights(lv);
    const total = Object.values(w).reduce((a, b) => a + b, 0);
    assert.equal(total, 100, `level ${lv} weights should sum to 100, got ${JSON.stringify(w)}`);
  }
});

test("packWeights only ever grows the number of live tiers as level rises", () => {
  const tierCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lv) => Object.keys(packWeights(lv)).length);
  for (let i = 1; i < tierCounts.length; i++) assert.ok(tierCounts[i] >= tierCounts[i - 1], "tier count should never shrink as level rises");
});

test("applyDailyStreak is a no-op if already recorded today", () => {
  const p = { lastDay: todayStr(), streakDay: 4, badges: [] };
  assert.equal(applyDailyStreak(p), p);
});

test("applyDailyStreak continues the streak from yesterday and awards weekStreak at day 3", () => {
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const p = { lastDay: yesterday.toISOString().slice(0, 10), streakDay: 2, badges: [] };
  const next = applyDailyStreak(p);
  assert.equal(next.streakDay, 3);
  assert.equal(next.lastDay, todayStr());
  assert.ok(next.badges.includes("weekStreak"));
});

test("applyDailyStreak resets to 1 after a missed day, and never awards weekStreak twice", () => {
  const longAgo = new Date(); longAgo.setDate(longAgo.getDate() - 5);
  const resetCase = applyDailyStreak({ lastDay: longAgo.toISOString().slice(0, 10), streakDay: 6, badges: ["weekStreak"] });
  assert.equal(resetCase.streakDay, 1);
  assert.deepEqual(resetCase.badges, ["weekStreak"]);

  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const alreadyHasBadge = applyDailyStreak({ lastDay: yesterday.toISOString().slice(0, 10), streakDay: 5, badges: ["weekStreak"] });
  assert.deepEqual(alreadyHasBadge.badges, ["weekStreak"], "should not duplicate the badge");
});

test("PRG-01: freshModuleProgress and freshExpeditionProgress start at version 2 with no scenarios", () => {
  const fresh = freshExpeditionProgress();
  assert.equal(fresh.version, EXPEDITION_PROGRESS_VERSION);
  assert.deepEqual(fresh.scenarios, {});
  assert.equal(fresh.moduleSetRewarded, false);
  assert.deepEqual(freshModuleProgress().expeditions, fresh);
});

test("PRG-02, PRG-12: migrateExpeditionProgress lifts the prototype shape to version 2, keeping best turns, and is idempotent", () => {
  const prototype = { completed: { po_unequal_crossing: true, po_counting_orchard: false }, bestTurns: { po_unequal_crossing: 4 } };
  const migrated = migrateExpeditionProgress(prototype);
  assert.equal(migrated.version, EXPEDITION_PROGRESS_VERSION);
  assert.deepEqual(migrated.scenarios, { po_unequal_crossing: { completed: true, bestTurns: 4, bestActions: null, marks: [], recentSeeds: [], lastBlueprintVersion: 1 } });
  assert.equal(migrated.moduleSetRewarded, false);
  const again = migrateExpeditionProgress(migrated);
  assert.deepEqual(again, migrated, "migrating an already-current bucket must be a no-op");
});

test("migrateExpeditionProgress handles a missing or empty bucket", () => {
  assert.deepEqual(migrateExpeditionProgress(null), freshExpeditionProgress());
  assert.deepEqual(migrateExpeditionProgress({}), freshExpeditionProgress());
});

test("migrateAllExpeditionProgress walks every module bucket and leaves other fields untouched", () => {
  const stored = { xp: 10, modules: { primary: { stars: 5, expeditions: { completed: { po_unequal_crossing: true }, bestTurns: { po_unequal_crossing: 4 } } }, junior: { stars: 2, expeditions: freshExpeditionProgress() } } };
  const migrated = migrateAllExpeditionProgress(stored);
  assert.equal(migrated.xp, 10);
  assert.equal(migrated.modules.primary.stars, 5);
  assert.equal(migrated.modules.primary.expeditions.version, EXPEDITION_PROGRESS_VERSION);
  assert.equal(migrated.modules.primary.expeditions.scenarios.po_unequal_crossing.bestTurns, 4);
  assert.deepEqual(migrated.modules.junior.expeditions, freshExpeditionProgress(), "an already-current bucket is left as-is");
  assert.deepEqual(migrateAllExpeditionProgress({ xp: 1 }), { xp: 1 }, "a save with no modules key at all is untouched");
});

test("expeditionScenarioRecord and expeditionCompletedCount read either shape safely", () => {
  const prototype = { completed: { a: true, b: true }, bestTurns: { a: 3, b: 5 } };
  assert.equal(expeditionCompletedCount(prototype), 2);
  assert.deepEqual(expeditionScenarioRecord(prototype, "a"), { completed: true, bestTurns: 3, bestActions: null, marks: [], recentSeeds: [], lastBlueprintVersion: 1 });
  assert.equal(expeditionScenarioRecord(prototype, "missing"), null);
  assert.equal(expeditionCompletedCount(freshExpeditionProgress()), 0);
});
