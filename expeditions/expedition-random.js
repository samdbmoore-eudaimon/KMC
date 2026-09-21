// Stage G1 (EXPEDITIONS_CLAUDE_HANDOVER.md "Procedural-generation implementation plan"):
// a small deterministic PRNG local to Expeditions. Generation and enemy resolution must
// never call Math.random() — everything here is seeded and reproducible, so the same
// seed always produces the same sequence (GEN-01) and the same seed, blueprint version
// and squad always reconstruct the same board and enemy schedule.
//
// mulberry32: a small, fast, well-known 32-bit generator. Not cryptographic — it doesn't
// need to be, this is game content generation, not security.

/** @typedef {{ next(): number, int(min: number, max: number): number, pick(items: any[]): any, shuffle(items: any[]): any[] }} ExpeditionRandom */

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministically folds a string into an unsigned 32-bit integer (FNV-1a), so a seed can
// be derived from readable parts instead of the caller having to invent a raw number.
function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Derive a stable, unsigned 32-bit seed from module, scenario, variant and a profile-safe
 * local attempt index (EXPEDITIONS_BUILD_BRIEF.md §11.3) — never from profile identity, a
 * timestamp or anything else that would make the same nominal request non-reproducible.
 * @param {{moduleKey: string, scenarioId: string, variant?: number, attemptIndex?: number}} parts
 * @returns {number}
 */
export function deriveExpeditionSeed({ moduleKey, scenarioId, variant = 0, attemptIndex = 0 }) {
  return fnv1a(`${moduleKey}|${scenarioId}|${variant}|${attemptIndex}`);
}

/**
 * Create a deterministic random source. Accepts a raw 32-bit integer seed or any string
 * (hashed via deriveExpeditionSeed-style folding) for convenience in tests and tools.
 * @param {number|string} seed
 * @returns {ExpeditionRandom}
 */
export function createExpeditionRandom(seed) {
  const numericSeed = typeof seed === "number" ? seed >>> 0 : fnv1a(String(seed));
  const raw = mulberry32(numericSeed);
  const random = {
    next: () => raw(),
    int: (min, max) => min + Math.floor(random.next() * (max - min + 1)),
    pick: (items) => items[random.int(0, items.length - 1)],
    shuffle: (items) => {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = random.int(0, i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
  };
  return random;
}

// Stage G7 primitive (repetition control, EXPEDITIONS_BUILD_BRIEF.md §11.7): the last five
// played seeds for a scenario are stored locally; new generation should avoid repeating one
// of them. This is deliberately just set membership over a capped, caller-owned list — the
// caller (progress persistence, E5) owns trimming the list to five entries.
export function seedWasRecentlyPlayed(recentSeeds, candidateSeed) {
  return (recentSeeds || []).map(String).includes(String(candidateSeed));
}

export function pushRecentSeed(recentSeeds, seed, cap = 5) {
  const next = [...(recentSeeds || []).filter((existing) => String(existing) !== String(seed)), seed];
  return next.slice(-cap);
}
