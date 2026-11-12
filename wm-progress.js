// Pure progress-shape logic: fresh-profile defaults, the shared/per-module
// split schema, and the one-time migrations that bring an older save up to
// the current shape. Split out of WallabyMaths.jsx so this layer — the part
// most likely to silently corrupt a real save if it regresses — can be unit
// tested directly (see scripts/test_progress_logic.mjs) without importing the
// whole React app.

export const NOTEPAD_PAGES = 5;
export const freshNotepad = () => ({ page: 0, pages: Array.from({ length: NOTEPAD_PAGES }, () => ({ text: "", strokes: [] })) });

// Phase 0 (see MODULE_EXPANSION_PLAN.md §2): progress now splits into fields shared across
// every module a profile plays (card ownership, currency, streaks — listed explicitly in
// SHARED_PROGRESS_KEYS) and fields describing progression through ONE module's own curriculum,
// which live under progress.modules[moduleKey]. Any field NOT listed in SHARED_PROGRESS_KEYS is
// treated as per-module by default (see unflattenProgress/migrateProgress below) — a deliberately
// conservative default, since a per-module field wrongly shared is far less likely than a truly
// shared field being missed off this list.
// stars/packs are deliberately NOT shared — each module earns and spends its own pack
// currency, so grinding Primary questions can't be cashed in on Junior's card pool.
export const SHARED_PROGRESS_KEYS = ["xp", "badges", "streakDay", "lastDay", "sessionStreak", "lessonsRead", "cards", "cardItems", "notepad"];

// tutorialSeen lives PER MODULE (not in SHARED_PROGRESS_KEYS) — a profile that's already
// toured Junior still gets the welcome tour the first time it tries Primary, since each
// module's tile layout is different enough to be worth walking through once.
// joeyDecks/joeyActiveDeck are ALSO per module (not shared) — a deck built while playing one
// module can't be borrowed to battle in another, safeguarding/schema note: see
// migrateJoeyDecksToPerModule for the one-time migration off the old shared shape.
export const freshModuleProgress = () => ({ stars: 0, packs: 0, bestTest: 0, topicStats: {}, academy: {}, olympiad: {}, unlockedLevel: 1, bossesBeaten: 0, mocks: {}, chaptersRead: [], lessonHistory: { read: [], lastRead: null }, testHistory: [], adventures: {}, shinyBosses: [], shinyPasses: {}, packsSinceEpic: 0, packsSinceLegendary: 0, tutorialSeen: false,
  // Joey battle fields (§54 JOEY_SPEC.md)
  challengeTokens: 0, challengeUnlocked: {}, joeyDecks: [null, null, null, null, null], joeyActiveDeck: 0,
  expeditions: freshExpeditionProgress() });

// Expeditions progress (EXPEDITIONS_CLAUDE_HANDOVER.md E5). Version 2 shape — see
// migrateExpeditionProgress below for the private-prototype (version-less) shape this
// replaces. Lives per module (inside freshModuleProgress, not SHARED_PROGRESS_KEYS)
// because a scenario id is only ever meaningful within the module that authored it, exactly
// like bossesBeaten or unlockedLevel — nothing here needs cross-module isolation logic
// beyond the split every other per-module field already gets for free.
export const EXPEDITION_PROGRESS_VERSION = 2;
export const freshExpeditionProgress = () => ({ version: EXPEDITION_PROGRESS_VERSION, scenarios: {}, moduleSetRewarded: false });

// Migrates the private prototype's Expedition shape ({ completed: {}, bestTurns: {} }, no
// version field) up to version 2. Idempotent: a bucket already at the current version, or
// with no recognisable prototype fields, passes straight through. Every scenario that was
// completed keeps its best-turns value exactly; nothing is invented for the fields the
// prototype never tracked (bestActions, marks, recentSeeds default to empty/null instead).
export function migrateExpeditionProgress(bucket) {
  if (!bucket) return freshExpeditionProgress();
  if (bucket.version === EXPEDITION_PROGRESS_VERSION) return bucket;
  const scenarios = {};
  for (const [id, completed] of Object.entries(bucket.completed || {})) {
    if (!completed) continue;
    scenarios[id] = {
      completed: true,
      bestTurns: bucket.bestTurns?.[id] ?? null,
      bestActions: null,
      marks: [],
      recentSeeds: [],
      lastBlueprintVersion: 1,
    };
  }
  return { version: EXPEDITION_PROGRESS_VERSION, scenarios, moduleSetRewarded: false };
}

// Bulk one-time fixup applied at profile load, alongside migrateChallengeTokens et al: walks
// every existing module bucket and migrates its expeditions field in place. Idempotent.
export function migrateAllExpeditionProgress(stored) {
  if (!stored.modules) return stored;
  const modules = { ...stored.modules };
  for (const key of Object.keys(modules)) {
    const mp = modules[key];
    const migrated = migrateExpeditionProgress(mp.expeditions);
    if (migrated !== mp.expeditions) modules[key] = { ...mp, expeditions: migrated };
  }
  return { ...stored, modules };
}

// Shape-agnostic reads for display code, so a bucket that hasn't been touched by
// applyExpeditionResult yet (still version-less) never needs its own special-case in the UI.
export function expeditionScenarioRecord(bucket, scenarioId) {
  return migrateExpeditionProgress(bucket).scenarios[scenarioId] || null;
}
export function expeditionCompletedCount(bucket) {
  return Object.values(migrateExpeditionProgress(bucket).scenarios).filter((s) => s.completed).length;
}

export const freshProgress = () => ({ xp: 0, badges: [], streakDay: 0, lastDay: null, sessionStreak: 0, lessonsRead: 0, cards: {}, cardItems: {}, notepad: freshNotepad(), modules: {} });

// One-time fixup for saves from before Joey decks moved from a single shared set of 5 slots
// to 5-per-module (safeguarding/deck-builder-lock change): an old save has joeyDecks/
// joeyActiveDeck sitting at the top level rather than nested in modules[key]. Re-homes them
// under whichever module is passed as `activeModuleHint` (the profile's last-played module —
// no card data is lost, just moved to live alongside the module it'll actually be usable in)
// and defaults to "junior" when no hint is available (matches migrateProgress's own default
// for pre-Phase-0 flat saves, which were always Junior-only anyway).
export function migrateJoeyDecksToPerModule(stored, activeModuleHint) {
  if (!("joeyDecks" in stored) && !("joeyActiveDeck" in stored)) return stored;
  const { joeyDecks, joeyActiveDeck, ...rest } = stored;
  const key = (rest.modules && rest.modules[activeModuleHint]) ? activeModuleHint : "junior";
  const existingBucket = rest.modules && rest.modules[key];
  // Checked on the REAL persisted bucket only, never on freshModuleProgress()'s own
  // fallback default below — that default already seeds a (placeholder, all-null)
  // joeyDecks array today, so treating it as "already has its own" would silently
  // drop the top-level data we're here to migrate, for any module bucket that
  // doesn't exist yet.
  if (existingBucket && existingBucket.joeyDecks) return rest; // already has real per-module decks — don't clobber
  const bucket = existingBucket || freshModuleProgress();
  return { ...rest, modules: { ...rest.modules, [key]: { ...bucket, joeyDecks: joeyDecks || [null, null, null, null, null], joeyActiveDeck: joeyActiveDeck || 0 } } };
}

// Migrates a pre-Phase-0 flat progress blob (every save that exists today — no `modules` key,
// every field at top level) into the split schema, nesting its per-module fields under
// modules.junior since every existing save IS Junior progress. Already-migrated progress
// (has a `modules` key) passes through untouched.
export function migrateProgress(raw, activeModuleHint) {
  if (!raw) return freshProgress();
  if (raw.modules) return migrateJoeyDecksToPerModule(migrateJuniorCurriculumProgress(raw), activeModuleHint);
  const shared = {}, juniorFields = {};
  for (const k of Object.keys(raw)) (SHARED_PROGRESS_KEYS.includes(k) ? shared : juniorFields)[k] = raw[k];
  return migrateJoeyDecksToPerModule(migrateJuniorCurriculumProgress({ ...freshProgress(), ...shared, modules: { junior: { ...freshModuleProgress(), ...juniorFields } } }), activeModuleHint);
}

export const JUNIOR_TOPIC_MIGRATION = {
  multiExpr: "expressionsEquations", countIntegers: "placeValue", modular: "numberProperties",
  cryptarith: "placeValue", meanPuzzle: "statisticsMeasures", systemWord: "linearEquations",
  workBackwards: "linearEquations", multiRate: "percentProportion", inverseProp: "percentProportion",
  sportScore: "linearEquations", clockArith: "integerDecimalArithmetic", calendar: "sequences",
  angleParallel: "polygons", angleIso: "polygons", angleRhombus: "polygons",
  trianglesInRect: "perimeterArea", midpointSquare: "perimeterArea", partitionRect: "perimeterArea",
  compoundPerimeter: "perimeterArea", poolPath: "perimeterArea", cubeProps: "areaVolume",
  productOpt: "nonLinearRelations", tiling: "transformations", repeatOp: "sequences",
  customCount: "sequences", agePuzzle: "linearEquations", bouncing: "nonLinearRelations",
  shapeFold: "transformations", spatialTransform: "transformations", epicJourney: "percentProportion",
  moneyTrail: "percentProportion", digitDetective: "numberProperties", numberMachine: "expressionsFormulae",
  pythagQuest: "similarityPythagoras"
};

export function migrateJuniorCurriculumProgress(stored) {
  const junior = stored.modules?.junior;
  if (!junior || junior.juniorCurriculumV2) return stored;
  const topicStats = { ...(junior.topicStats || {}) };
  for (const [oldKey, newKey] of Object.entries(JUNIOR_TOPIC_MIGRATION)) {
    const oldStat = topicStats[oldKey];
    if (!oldStat || oldKey === newKey) continue;
    const current = topicStats[newKey] || { correct: 0, total: 0, tier: 1, sinceUp: 0 };
    topicStats[newKey] = {
      correct: (current.correct || 0) + (oldStat.correct || 0),
      total: (current.total || 0) + (oldStat.total || 0),
      tier: Math.max(current.tier || 1, oldStat.tier || 1),
      sinceUp: Math.max(current.sinceUp || 0, oldStat.sinceUp || 0)
    };
    delete topicStats[oldKey];
  }
  return { ...stored, modules: { ...stored.modules, junior: { ...junior, topicStats, juniorCurriculumV2: true } } };
}

// One-time fixup for the bossCardId collision: it used to be module-agnostic ("boss"+n),
// so every module's Nth boss shared one key in the shared `cards` object — beating boss 3
// in Junior made Primary's (and Intermediate's) boss-3 trophy show as already owned too,
// with no fighting or strength required there. Every surviving old-style "bossN" key
// belongs to Junior (no other module could have granted one before this fix existed), so
// this renames them to the new "boss_junior_N" scheme. Idempotent — a no-op once run.
export function migrateBossCardIds(progress) {
  const OLD_KEY_RE = /^boss(\d+)$/;
  const cards = progress.cards || {};
  const oldKeys = Object.keys(cards).filter((k) => OLD_KEY_RE.test(k));
  if (!oldKeys.length) return progress;
  const newCards = { ...cards };
  for (const k of oldKeys) { const n = k.match(OLD_KEY_RE)[1]; newCards[`boss_junior_${n}`] = cards[k]; delete newCards[k]; }
  return { ...progress, cards: newCards };
}

// One-time fixup for boss defeats that predate the Joey reveal-token wiring (beatBoss only
// grants a token the moment a boss is FIRST defeated — see beatBoss's `if (bossesBeaten >= n)
// return p` guard, which never re-fires for a boss already beaten). Any save whose bosses were
// beaten before that wiring existed is stuck at 0 tokens for those defeats forever. Recomputes
// the correct balance from first principles — one token per boss beaten (capped at 10) minus
// one per card already revealed — and tops up only if the stored balance is short, so a
// player's current balance (topped up before, or spent down since) is never reduced.
// Idempotent — a no-op once a module's balance already matches.
export function migrateChallengeTokens(stored) {
  if (!stored.modules) return stored;
  const modules = { ...stored.modules };
  for (const key of Object.keys(modules)) {
    const mp = modules[key];
    const earned = Math.min(mp.bossesBeaten || 0, 10);
    const spent = Object.values(mp.challengeUnlocked || {}).filter(Boolean).length;
    const correctBalance = Math.max(0, earned - spent);
    if ((mp.challengeTokens || 0) < correctBalance) modules[key] = { ...mp, challengeTokens: correctBalance };
  }
  return { ...stored, modules };
}

// The object every screen component actually reads/writes as `progress` — the active module's
// bucket merged flat onto the shared fields, so none of the app's existing `progress.xxx`
// call sites (100+ of them) need to know the split schema exists.
export function flattenProgress(stored, moduleKey) {
  const bucket = (stored.modules && stored.modules[moduleKey]) || freshModuleProgress();
  return { ...stored, ...bucket };
}

// Un-flattens an update produced against the flattened view back into the split shape: shared
// keys go back to the top level, everything else lands in modules[moduleKey].
export function unflattenProgress(flat, moduleKey) {
  const shared = {}, moduleFields = {};
  for (const k of Object.keys(flat)) { if (k === "modules") continue; (SHARED_PROGRESS_KEYS.includes(k) ? shared : moduleFields)[k] = flat[k]; }
  return { shared, moduleFields };
}

/* Pack odds scale with quest level: when a tier's gate opens it becomes the
   MOST likely drop, so progress never stalls waiting on a 3% pull. */
export function packWeights(lv) {
  // Every tier is live from level 5 onward (post-chapter-4), so a lucky pull can surprise
  // a player early rather than epic/legendary being flatly impossible until level 7/9 — they
  // just start as a small chance and ramp up smoothly as level climbs. Common still dominates
  // the earliest levels so new/young players aren't overwhelmed by rare-looking cards immediately.
  if (lv <= 2) return { common: 100 };
  if (lv <= 4) return { common: 60, uncommon: 40 };
  if (lv <= 6) return { common: 40, uncommon: 28, rare: 20, epic: 8, legendary: 4 };
  if (lv <= 8) return { common: 26, uncommon: 24, rare: 24, epic: 18, legendary: 8 };
  return { common: 16, uncommon: 18, rare: 22, epic: 24, legendary: 20 };
}

export const todayStr = () => new Date().toISOString().slice(0, 10);
export function applyDailyStreak(p) {
  const today = todayStr();
  if (p.lastDay === today) return p;
  const y = new Date(); y.setDate(y.getDate() - 1); const yest = y.toISOString().slice(0, 10);
  const streakDay = p.lastDay === yest ? (p.streakDay || 0) + 1 : 1;
  const badges = [...(p.badges || [])];
  if (streakDay >= 3 && !badges.includes("weekStreak")) badges.push("weekStreak");
  return { ...p, streakDay, lastDay: today, badges };
}
