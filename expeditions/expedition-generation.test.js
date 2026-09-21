// Stage G1 (seeded random) and G2/G4 (mathematical kernels + abstract solver) from
// EXPEDITIONS_CLAUDE_HANDOVER.md's procedural-generation plan.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createExpeditionRandom, deriveExpeditionSeed, pushRecentSeed, seedWasRecentlyPlayed } from "./expedition-random.js";
import { generateEqualPartitionKernel, generateOperatorRestorationKernel, generateSchedulingKernel } from "./expedition-kernels.js";

test("determinism: generation and the engine never call Math.random (GEN-01 depends on this holding)", () => {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  for (const file of ["expedition-kernels.js", "expedition-engine.js", "expedition-commander.js"]) {
    const source = fs.readFileSync(path.join(dir, file), "utf-8");
    assert.ok(!source.includes("Math.random"), `${file} must not call Math.random — use the seeded ExpeditionRandom instead`);
  }
});

test("createExpeditionRandom: the same seed always produces the same sequence (GEN-01)", () => {
  const a = createExpeditionRandom(12345);
  const b = createExpeditionRandom(12345);
  const sequenceA = Array.from({ length: 20 }, () => a.next());
  const sequenceB = Array.from({ length: 20 }, () => b.next());
  assert.deepEqual(sequenceA, sequenceB);
  assert.ok(sequenceA.every((value) => value >= 0 && value < 1));
});

test("createExpeditionRandom: different seeds vary the sequence (GEN-02), and a string seed is accepted", () => {
  const a = createExpeditionRandom(1);
  const b = createExpeditionRandom(2);
  const sequenceA = Array.from({ length: 10 }, () => a.next());
  const sequenceB = Array.from({ length: 10 }, () => b.next());
  assert.notDeepEqual(sequenceA, sequenceB);
  const c = createExpeditionRandom("po_unequal_crossing");
  assert.equal(typeof c.next(), "number");
});

test("createExpeditionRandom: int, pick and shuffle stay in bounds and preserve the set", () => {
  const rng = createExpeditionRandom(7);
  for (let i = 0; i < 50; i += 1) {
    const value = rng.int(3, 6);
    assert.ok(value >= 3 && value <= 6 && Number.isInteger(value));
  }
  const items = ["a", "b", "c", "d"];
  assert.ok(items.includes(rng.pick(items)));
  const shuffled = rng.shuffle(items);
  assert.deepEqual([...shuffled].sort(), [...items].sort());
});

test("deriveExpeditionSeed is deterministic and sensitive to every part except profile identity", () => {
  const base = { moduleKey: "primary", scenarioId: "po_unequal_crossing", variant: 0, attemptIndex: 0 };
  assert.equal(deriveExpeditionSeed(base), deriveExpeditionSeed({ ...base }));
  assert.notEqual(deriveExpeditionSeed(base), deriveExpeditionSeed({ ...base, variant: 1 }));
  assert.notEqual(deriveExpeditionSeed(base), deriveExpeditionSeed({ ...base, attemptIndex: 1 }));
  assert.notEqual(deriveExpeditionSeed(base), deriveExpeditionSeed({ ...base, scenarioId: "po_counting_orchard" }));
});

test("Equal partition kernel: accepted configs are unique, in bounds, and reproducible from seed (GEN-01, GEN-04, GEN-06)", () => {
  const rng = createExpeditionRandom(42);
  const result = generateEqualPartitionKernel(rng, { count: 4, valueMin: 1, valueMax: 9 });
  assert.ok(result);
  assert.equal(result.values.length, 4);
  assert.ok(result.values.every((value) => value >= 1 && value <= 9));
  assert.equal(result.solution.left.reduce((a, b) => a + b, 0), result.target);
  assert.equal(result.solution.right.reduce((a, b) => a + b, 0), result.target);
  const replay = generateEqualPartitionKernel(createExpeditionRandom(42), { count: 4, valueMin: 1, valueMax: 9 });
  assert.deepEqual(replay, result);
});

test("Equal partition kernel: different seeds vary the generated values (GEN-02)", () => {
  const results = [1, 2, 3, 4, 5].map((seed) => generateEqualPartitionKernel(createExpeditionRandom(seed)));
  assert.ok(results.every(Boolean));
  const distinctValueSets = new Set(results.map((r) => r.values.join(",")));
  assert.ok(distinctValueSets.size > 1, "at least some seeds should produce different value sets");
});

test("Equal partition kernel: impossible bounds are rejected immediately, not hung on (GEN-08, GEN-12)", () => {
  const rng = createExpeditionRandom(1);
  assert.equal(generateEqualPartitionKernel(rng, { count: 5, valueMin: 1, valueMax: 3 }), null);
});

test("Operator restoration kernel: accepted configs have exactly one restoration and are reproducible", () => {
  const rng = createExpeditionRandom(99);
  const result = generateOperatorRestorationKernel(rng, { chainLength: 3, valueMin: 1, valueMax: 9 });
  assert.ok(result);
  assert.equal(result.values.length, 4);
  assert.equal(result.solution.length, 3);
  let recomputed = result.values[0];
  const apply = { "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b };
  for (let i = 0; i < result.solution.length; i += 1) recomputed = apply[result.solution[i]](recomputed, result.values[i + 1]);
  assert.equal(recomputed, result.target);
  const replay = generateOperatorRestorationKernel(createExpeditionRandom(99), { chainLength: 3, valueMin: 1, valueMax: 9 });
  assert.deepEqual(replay, result);
});

test("Scheduling kernel: accepted configs fit the deadline and are reproducible", () => {
  const rng = createExpeditionRandom(5);
  const result = generateSchedulingKernel(rng, { taskCount: 4, stationCount: 3, deadline: 12 });
  assert.ok(result);
  assert.ok(result.makespan <= 12);
  assert.equal(result.assignment.length, 4);
  assert.ok(result.assignment.every((station) => station >= 0 && station < 3));
  const replay = generateSchedulingKernel(createExpeditionRandom(5), { taskCount: 4, stationCount: 3, deadline: 12 });
  assert.deepEqual(replay, result);
});

test("Scheduling kernel: a deadline no random draw can meet is rejected, not falsely accepted (GEN-08)", () => {
  const rng = createExpeditionRandom(3);
  assert.equal(generateSchedulingKernel(rng, { taskCount: 4, stationCount: 1, durationMin: 5, durationMax: 5, deadline: 1, maxAttempts: 20 }), null);
});

test("Recent-seed repetition control caps at five and treats a repeat as seen (GEN-11)", () => {
  let recent = [];
  for (const seed of [1, 2, 3, 4, 5, 6]) recent = pushRecentSeed(recent, seed);
  assert.equal(recent.length, 5);
  assert.deepEqual(recent, [2, 3, 4, 5, 6]);
  assert.equal(seedWasRecentlyPlayed(recent, 6), true);
  assert.equal(seedWasRecentlyPlayed(recent, 1), false);
});
