// C-09: saves, resume, atomic first-clear rewards. Pure functions over the existing per-module
// progress object; every write goes through App's setProgress as an updater. Nothing here touches
// localStorage, the clock or Math.random.
import { PACK_COST } from "../../generators/junior-generators.js";
import { FAMILY_IDS, GENERATOR_VERSION, MODULE_KEY, RULES_VERSION, STARS_FIRST_CLEAR } from "./constants.js";
import { orchardRosterProfiles } from "./profile.js";
import { createRun, exportRunRecord, replayRun, blueprintHash, stateHash } from "./run.js";
import { validateBlueprint } from "./schema.js";
import { deriveExpeditionSeed } from "../expedition-random.js";
import { recoverLegacyBridgeRecord } from './save-recovery.js';

export const ORCHARD_V2_BUCKET_VERSION = 1;
export const RECENT_PARAMETER_SEEDS_CAP = 8;
const TIERS = [1, 2, 3, 4, 5];

export const freshOrchardV2Bucket = () => ({ version: ORCHARD_V2_BUCKET_VERSION, activeRun: null, familyTiers: {}, tierAwards: {}, tierBest: {}, recentSeeds: {}, attemptCounters: {}, lossCounts: {} });

// The v2 bucket lives inside the existing expedition bucket; legacy fields are never rewritten.
export function orchardV2Bucket(progress) {
  const stored = progress?.expeditions?.v2;
  if (!stored || stored.version !== ORCHARD_V2_BUCKET_VERSION) return freshOrchardV2Bucket();
  return { ...freshOrchardV2Bucket(), ...stored };
}

function withBucket(progress, v2) {
  const expeditions = progress.expeditions && typeof progress.expeditions === "object" ? progress.expeditions : { version: 2, scenarios: {}, moduleSetRewarded: false };
  return { ...progress, expeditions: { ...expeditions, v2 } };
}

export const awardKey = (familyId, tier) => `${MODULE_KEY}:${familyId}:${tier}`;
export const isOrchardFamily = (familyId) => FAMILY_IDS.includes(familyId);
const validTier = (tier) => Number.isInteger(tier) && tier >= 1 && tier <= 5;

// Tier 1 is always available; tier n+1 unlocks only on a real clear of tier n. Skipped tiers are never awarded.
export function tierUnlocked(progress, familyId, tier) {
  if (!isOrchardFamily(familyId) || !validTier(tier)) return false;
  if (tier === 1) return true;
  return !!orchardV2Bucket(progress).tierAwards[awardKey(familyId, tier - 1)];
}

export function familyStatus(progress, familyId) {
  const bucket = orchardV2Bucket(progress);
  return {
    familyId,
    tiers: TIERS.map((tier) => ({
      tier,
      unlocked: tierUnlocked(progress, familyId, tier),
      awarded: !!bucket.tierAwards[awardKey(familyId, tier)],
      best: bucket.tierBest[awardKey(familyId, tier)] || null,
      losses: bucket.lossCounts[awardKey(familyId, tier)] || 0,
    })),
    unlockedTier: Math.max(1, ...TIERS.filter((t) => tierUnlocked(progress, familyId, t))),
  };
}

export function totalStarsAvailable() {
  return FAMILY_IDS.length * TIERS.length * STARS_FIRST_CLEAR;
}

// ---------- save / resume ----------

// Every accepted command is saved: confirmed maths edits, hints and irreversible weighings must survive a
// close or reload without waiting for a later paid action.
export function shouldPersist() {
  return true;
}

export function saveActiveRun(progress, state) {
  const bucket = orchardV2Bucket(progress);
  const record = exportRunRecord(state);
  const bp = state.blueprint;
  const key = awardKey(bp.familyId, bp.tier);
  const activeRun = {
    saveVersion: ORCHARD_V2_BUCKET_VERSION,
    key,
    familyId: bp.familyId,
    tier: bp.tier,
    runId: state.runId,
    status: state.status,
    round: state.round,
    revision: state.revision,
    blueprintHash: blueprintHash(bp),
    rulesVersion: RULES_VERSION,
    record,
  };
  const recovery=bp.recovery,prior=bucket.activeRun;
  const archiveKey=recovery?`${state.runId}:${recovery.version}`:null;
  const archive=recovery&&prior&&blueprintHash(prior.record.initialRun.blueprint)===recovery.sourceBlueprintHash&&!bucket.runMigrations?.[archiveKey]?{[archiveKey]:{version:recovery.version,source:prior,repairedBlueprintHash:blueprintHash(bp),retainedCommands:prior.record.commands.length,retainedStateHash:prior.record.finalStateHash}}:null;
  return withBucket(progress, { ...bucket, ...(archive?{runMigrations:{...bucket.runMigrations,...archive}}:{}), activeRun });
}

export function clearActiveRun(progress) {
  const bucket = orchardV2Bucket(progress);
  if (!bucket.activeRun) return progress;
  return withBucket(progress, { ...bucket, activeRun: null });
}

// Rebuilds the exact state by deterministic replay. A mismatch is reported, never silently loaded.
export function loadActiveRun(progress) {
  const saved = orchardV2Bucket(progress).activeRun;
  if (!saved) return null;
  if (saved.saveVersion !== ORCHARD_V2_BUCKET_VERSION || saved.rulesVersion !== RULES_VERSION) return { ok: false, reason: "save-version", saved };
  const blueprint = saved.record?.initialRun?.blueprint;
  if (!blueprint || blueprintHash(blueprint) !== saved.blueprintHash) return { ok: false, reason: "blueprint-changed", saved };
  const check = validateBlueprint(blueprint);
  if (!check.ok) return { ok: false, reason: "blueprint-invalid", saved };
  let replay;
  try {
    replay = replayRun(saved.record);
  } catch (error) {
    return { ok: false, reason: "replay-error", message: String(error?.message || error), saved };
  }
  if (!replay.ok) return { ok: false, reason: replay.reason || "replay-failed", index: replay.index, saved };
  const recovery=recoverLegacyBridgeRecord(saved.record);
  if(recovery.needed){
    if(!recovery.ok)return {ok:false,reason:recovery.reason,index:recovery.index,saved};
    return {ok:true,state:recovery.state,saved,recovery:recovery.provenance};
  }
  return { ok: true, state: replay.state, saved };
}

// Production boundary: three distinct cards, each with a positive owned count. createRun itself stays
// permissive for certification tooling.
export function unownedSquad(progress, cardIds) {
  if (!Array.isArray(cardIds) || cardIds.length !== 3 || new Set(cardIds).size !== 3) return { reason: "invalid-squad", cardIds: cardIds || [] };
  const owned = progress?.cards || {};
  const missing = cardIds.filter((id) => !(Number.isInteger(owned[id]) && owned[id] > 0));
  return missing.length ? { reason: "unowned-card", cardIds: missing } : null;
}

// ---------- starting, retrying and new maps ----------

// New runs never reuse a date-based seed: the persisted attempt counter feeds the deterministic seed.
export function requestedSeedFor(progress, familyId, tier) {
  const attempt = orchardV2Bucket(progress).attemptCounters[awardKey(familyId, tier)] || 0;
  return { attempt, seed: deriveExpeditionSeed({ moduleKey: MODULE_KEY, scenarioId: awardKey(familyId, tier), variant: 2, attemptIndex: attempt }) };
}

export function recentParameterSeeds(progress, familyId, tier) {
  return orchardV2Bucket(progress).recentSeeds[awardKey(familyId, tier)] || [];
}

// `generateBlueprint` is Codex's generateOrchardBlueprint, injected so this module has no hard import of
// the generator. It receives {familyId,tier,seed,generatorVersion,recentParameterSeeds}.
export function beginOrchardRun(progress, { familyId, tier, cardIds, deploymentAssignment = null, mode = "new", generateBlueprint }) {
  if (!isOrchardFamily(familyId) || !validTier(tier)) return { ok: false, reason: "unknown-family-or-tier" };
  const squad = unownedSquad(progress, cardIds);
  if (squad) return { ok: false, reason: squad.reason, cardIds: squad.cardIds };
  if (!tierUnlocked(progress, familyId, tier)) return { ok: false, reason: "tier-locked" };
  const bucket = orchardV2Bucket(progress);
  const key = awardKey(familyId, tier);
  let blueprint;
  let attempt = bucket.attemptCounters[key] || 0;
  let runSuffix = 0;
  if (mode === "retry") {
    const prior = bucket.activeRun || bucket.lastCompletedRun;
    if (!prior || prior.key !== key) return { ok: false, reason: "nothing-to-retry" };
    blueprint = prior.record.initialRun.blueprint;
    runSuffix = (prior.record.initialRun.runId.split(".r")[1] ? Number(prior.record.initialRun.runId.split(".r")[1]) : 0) + 1;
    attempt = Math.max(0, attempt - 1);
  } else {
    if (mode === "new-map") attempt += 1;
    const { seed } = requestedSeedFor(withBucket(progress, { ...bucket, attemptCounters: { ...bucket.attemptCounters, [key]: attempt } }), familyId, tier);
    try {
      blueprint = generateBlueprint({ familyId, tier, seed, generatorVersion: GENERATOR_VERSION, recentParameterSeeds: recentParameterSeeds(progress, familyId, tier) });
    } catch (error) {
      return { ok: false, reason: "generator-unavailable", message: String(error?.message || error) };
    }
  }
  const runId = `${key}#a${attempt}${runSuffix ? `.r${runSuffix}` : ""}`;
  let state;
  try {
    state = createRun({ blueprint, cardIds, runId, deploymentAssignment });
  } catch (error) {
    return { ok: false, reason: "create-failed", message: String(error?.message || error) };
  }
  const update = (current) => {
    const b = orchardV2Bucket(current);
    const picked = blueprint.bankIndex ?? blueprint.parameterSeed ?? blueprint.seed;
    const recent = [...(b.recentSeeds[key] || []).filter((s) => String(s) !== String(picked)), picked].slice(-RECENT_PARAMETER_SEEDS_CAP);
    const next = withBucket(current, { ...b, attemptCounters: { ...b.attemptCounters, [key]: attempt }, recentSeeds: { ...b.recentSeeds, [key]: recent } });
    return saveActiveRun(next, state);
  };
  return { ok: true, state, update, key, attempt, runId };
}

export function recordOrchardLoss(progress, state) {
  if (state.status !== "lost") return progress;
  const saved = saveActiveRun(progress, state);
  const bucket = orchardV2Bucket(saved);
  if (bucket.lastLossRunId === state.runId) return saved;
  const key = awardKey(state.blueprint.familyId, state.blueprint.tier);
  return withBucket(saved, { ...bucket, lastLossRunId: state.runId, lossCounts: { ...bucket.lossCounts, [key]: (bucket.lossCounts[key] || 0) + 1 } });
}

// ---------- the reward ----------

function addStars(p, amount) {
  let stars = (p.stars || 0) + amount;
  let packs = p.packs || 0;
  if (stars >= PACK_COST) {
    packs += Math.floor(stars / PACK_COST);
    stars %= PACK_COST;
  }
  return { stars, packs };
}

export function verifyOrchardV2Win(record) {
  if (!record || record.schemaVersion !== 2 || !record.initialRun?.blueprint) return { ok: false, reason: "no-record" };
  const bp = record.initialRun.blueprint;
  if (bp.moduleKey !== MODULE_KEY || bp.rulesVersion !== RULES_VERSION || !isOrchardFamily(bp.familyId) || !validTier(bp.tier)) return { ok: false, reason: "wrong-ruleset" };
  if (record.status !== "won") return { ok: false, reason: "not-a-win" };
  let replay;
  try {
    replay = replayRun(record);
  } catch (error) {
    return { ok: false, reason: "unverifiable", message: String(error?.message || error) };
  }
  if (!replay.ok) return { ok: false, reason: replay.reason || "replay-failed", index: replay.index };
  if (replay.state.status !== "won") return { ok: false, reason: "replay-not-won" };
  return { ok: true, state: replay.state, finalStateHash: replay.finalHash };
}

// Production award boundary: the winner must be the current profile's own saved run, built from owned
// cards with the printed roster profiles, and must carry its final hash.
export function authorizeOrchardV2Record(progress, record) {
  if (typeof record?.finalStateHash !== "string" || !record.finalStateHash) return "missing-final-hash";
  const saved = orchardV2Bucket(progress).activeRun;
  const initial = record.initialRun;
  if (!saved || saved.runId !== initial.runId) return "no-saved-run";
  if (saved.blueprintHash !== blueprintHash(initial.blueprint)) return "foreign-blueprint";
  const savedInitial = saved.record?.initialRun;
  if (!savedInitial || savedInitial.initialStateHash !== initial.initialStateHash || JSON.stringify(savedInitial.cardIds) !== JSON.stringify(initial.cardIds) || JSON.stringify(savedInitial.deploymentAssignment) !== JSON.stringify(initial.deploymentAssignment)) return "foreign-origin";
  const savedLog = saved.record.commands || [];
  if (savedLog.length > record.commands.length || savedLog.some((c, i) => JSON.stringify(c) !== JSON.stringify(record.commands[i]))) return "log-not-an-extension";
  if (unownedSquad(progress, initial.cardIds)) return "unowned-card";
  const roster = orchardRosterProfiles();
  for (const id of initial.cardIds) if (JSON.stringify(initial.profiles?.[id]) !== JSON.stringify(roster[id])) return "altered-profile";
  return null;
}

// Atomic: either the whole award (stars, pack conversion, tier clear, unlock, best stats, active run cleared)
// lands in the one returned object, or the input is returned unchanged. A repeat of the same run, or any other
// win of an already awarded tier, adds no stars.
export function applyOrchardV2Result(progress, result) {
  const record = result?.record;
  const verified = verifyOrchardV2Win(record);
  if (!verified.ok) return progress;
  if (record.initialRun.runId !== orchardV2Bucket(progress).lastClaimedRunId && authorizeOrchardV2Record(progress, record)) return progress;
  const bp = record.initialRun.blueprint;
  const key = awardKey(bp.familyId, bp.tier);
  const bucket = orchardV2Bucket(progress);
  if (bucket.tierAwards[key]?.runId === record.initialRun.runId || bucket.lastClaimedRunId === record.initialRun.runId) return progress;
  if (!tierUnlocked(progress, bp.familyId, bp.tier)) return progress;
  const state = verified.state;
  const best = bucket.tierBest[key];
  const stats = { rounds: state.round, commands: state.actionCount };
  const nextBest = { rounds: Math.min(best?.rounds ?? Infinity, stats.rounds), commands: Math.min(best?.commands ?? Infinity, stats.commands) };
  const firstClear = !bucket.tierAwards[key];
  const base = { ...bucket, tierBest: { ...bucket.tierBest, [key]: nextBest }, lastClaimedRunId: record.initialRun.runId, lastCompletedRun:{key,record}, activeRun: bucket.activeRun?.runId === record.initialRun.runId ? null : bucket.activeRun };
  if (!firstClear) return withBucket(progress, base);
  const { stars, packs } = addStars(progress, STARS_FIRST_CLEAR);
  const award = { runId: record.initialRun.runId, seed: bp.seed, parameterSeed: bp.parameterSeed ?? bp.seed, rulesVersion: bp.rulesVersion, generatorVersion: bp.generatorVersion, blueprintHash: blueprintHash(bp), finalStateHash: verified.finalStateHash, rounds: stats.rounds, commands: stats.commands, stars: STARS_FIRST_CLEAR };
  const familyTiers = { ...bucket.familyTiers, [bp.familyId]: Math.max(bucket.familyTiers[bp.familyId] || 1, Math.min(5, bp.tier + 1)) };
  return withBucket({ ...progress, stars, packs }, { ...base, tierAwards: { ...bucket.tierAwards, [key]: award }, familyTiers });
}

// Describes what applyOrchardV2Result would grant, for the win report ("3 stars" or "Already awarded").
export function previewOrchardV2Award(progress, record) {
  const verified = verifyOrchardV2Win(record);
  if (!verified.ok) return { ok: false, reason: verified.reason };
  const denied = authorizeOrchardV2Record(progress, record);
  if (denied) return { ok: false, reason: denied };
  const bp = record.initialRun.blueprint;
  const key = awardKey(bp.familyId, bp.tier);
  const bucket = orchardV2Bucket(progress);
  const awarded = !!bucket.tierAwards[key];
  return { ok: true, key, stars: awarded ? 0 : STARS_FIRST_CLEAR, alreadyAwarded: awarded, unlocksTier: awarded ? null : bp.tier < 5 ? bp.tier + 1 : null, locked: !tierUnlocked(progress, bp.familyId, bp.tier) };
}

export { stateHash };
