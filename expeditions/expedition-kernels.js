// Stage G2 (mathematical kernels) and G4 (abstract solver / rejection) of the
// procedural-generation plan in EXPEDITIONS_CLAUDE_HANDOVER.md. Each kernel generates a
// candidate from the seeded random source, checks it against the family's own solvability
// rule, and rejects (tries again, up to maxAttempts) rather than ever returning an
// impossible or ambiguous puzzle. This begins with the three named kernels: equal
// partition, operator restoration and scheduling. The remaining kernels in the handover's
// list are not yet built — G3 (board grammars), G5 (action solver against real geometry)
// and G6 (adversarial enemy-schedule validation) need actual board content to build
// against, and only one board exists so far (The Unequal Crossing). Building those out
// belongs with the next hand-authored proof maps (E4), not invented ahead of them here.
import { solveBalancedPartition } from "./expedition-engine.js";

function distinctInts(rng, count, min, max) {
  const range = max - min + 1;
  if (count > range || count < 1) return null;
  const pool = Array.from({ length: range }, (_, index) => min + index);
  return rng.shuffle(pool).slice(0, count);
}

/**
 * Equal partition (Ninefold Orchard's balance family, e.g. The Unequal Crossing):
 * generate a set of distinct values whose only equal split is the one the solver finds.
 * @returns {{values: number[], target: number, solution: {left: number[], right: number[]}, attempts: number}|null}
 */
export function generateEqualPartitionKernel(rng, options = {}) {
  const { count = 4, valueMin = 1, valueMax = 9, maxAttempts = 500 } = options;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const values = distinctInts(rng, count, valueMin, valueMax);
    if (!values) return null; // the bounds themselves make this impossible — stop immediately
    const total = values.reduce((sum, value) => sum + value, 0);
    if (total % 2 !== 0) continue; // no equal split can exist — reject, try new values
    const solutions = solveBalancedPartition(values);
    if (solutions.length !== 1) continue; // impossible (0) or ambiguous (>1) — reject, try again
    return { values, target: total / 2, solution: solutions[0], attempts: attempt };
  }
  return null;
}

const CHAIN_OPERATORS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
};

function evaluateChain(values, ops) {
  let result = values[0];
  for (let i = 0; i < ops.length; i += 1) result = CHAIN_OPERATORS[ops[i]](result, values[i + 1]);
  return result;
}

function* operatorSequences(length, operators) {
  if (length === 0) { yield []; return; }
  for (const op of operators) for (const rest of operatorSequences(length - 1, operators)) yield [op, ...rest];
}

/**
 * Operator restoration (Little Reckoning's The Smudged Stones): a chain of numbers and a
 * target; the solution is which operator belongs at each gap. Evaluates strictly
 * left-to-right, matching a route walked tile by tile rather than algebraic precedence.
 * @returns {{values: number[], target: number, solution: string[], attempts: number}|null}
 */
export function generateOperatorRestorationKernel(rng, options = {}) {
  const { chainLength = 3, valueMin = 1, valueMax = 9, operators = ["+", "-", "*"], maxAttempts = 500 } = options;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const values = Array.from({ length: chainLength + 1 }, () => rng.int(valueMin, valueMax));
    const ops = Array.from({ length: chainLength }, () => rng.pick(operators));
    const target = evaluateChain(values, ops);
    if (!Number.isInteger(target)) continue;
    const matches = [...operatorSequences(chainLength, operators)].filter((seq) => evaluateChain(values, seq) === target);
    if (matches.length !== 1) continue; // more than one restoration reaches the target — ambiguous, reject
    return { values, target, solution: ops, attempts: attempt };
  }
  return null;
}

// List scheduling by longest-processing-time-first. This is a deliberately approximate
// feasibility check, not an exact multiprocessor-scheduling solver (which is NP-hard in
// general) — but the direction of the approximation is safe for content generation: LPT's
// makespan is never shorter than the true optimum, so "LPT fits the deadline" proves a real
// schedule exists. It may reject some instances that a smarter ordering could still solve;
// that only means occasionally trying again with new random durations, never accepting an
// instance that turns out to be impossible.
function scheduleTasks(durations, stationCount) {
  const finishTimes = Array(stationCount).fill(0);
  const assignment = new Array(durations.length);
  const order = durations.map((duration, index) => ({ duration, index })).sort((a, b) => b.duration - a.duration);
  for (const task of order) {
    let station = 0;
    for (let i = 1; i < finishTimes.length; i += 1) if (finishTimes[i] < finishTimes[station]) station = i;
    finishTimes[station] += task.duration;
    assignment[task.index] = station;
  }
  return { assignment, makespan: Math.max(...finishTimes) };
}

/**
 * Scheduling (Gifford's The Examination Clock): task durations across a fixed number of
 * stations, generated so at least one schedule meets the deadline.
 * @returns {{durations: number[], stationCount: number, deadline: number, makespan: number, assignment: number[], attempts: number}|null}
 */
export function generateSchedulingKernel(rng, options = {}) {
  const { taskCount = 4, stationCount = 3, durationMin = 1, durationMax = 5, deadline = 12, maxAttempts = 500 } = options;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const durations = Array.from({ length: taskCount }, () => rng.int(durationMin, durationMax));
    const { assignment, makespan } = scheduleTasks(durations, stationCount);
    if (makespan > deadline) continue; // this random draw cannot fit the deadline — reject, try again
    return { durations, stationCount, deadline, makespan, assignment, attempts: attempt };
  }
  return null;
}

/**
 * Exact pair (Ninefold Orchard's The Cider Run, exactSum family): a pool of distinct values
 * and a target such that exactly one pair among them sums to it — the same "unique intended
 * solution, proved by an exhaustive check rather than assumed" discipline as
 * generateEqualPartitionKernel, generalised from a 2-vs-2 partition of the whole pool to a
 * single pair drawn from it (the pool's other values are real distractors/near-misses, not
 * every value needing a partner).
 *
 * Also rejects any draw where a single value alone equals the target (2026-09-18: found while
 * verifying "both gate hexes are required" for Codex's Cider Run distinctness review — with
 * valueMax and targetMax overlapping, nothing stopped a lone value like 12 coincidentally
 * equalling a target of 12, which the engine's exactSum family (sums whatever sits on the
 * objective's hexes, regardless of count) would already accept from one press on one gate hex,
 * bypassing the two-press puzzle entirely. Confirmed live in ~30% of 500 sampled seeds before
 * this fix.
 * @returns {{values: number[], target: number, solution: [number, number], attempts: number}|null}
 */
// pairCount (default 1, Unequal-Crossing-style "exactly one right answer") lets a caller ask
// for more than one valid direct pair instead — The Cider Run's rebuild (2026-09-21) uses
// pairCount: 2 so a layout offers a genuine choice between two provably-safe pairs rather
// than a single certified route to execute, real decision-making instead of "find the one
// answer, then walk it." Since every value is distinct, two pairs that both sum to the
// target can never share a value (a+b=target and a+c=target forces b=c, impossible with
// distinct values) — so any pairCount>1 result is automatically a set of disjoint pairs,
// no separate check needed.
export function generateExactPairKernel(rng, options = {}) {
  const { count = 6, valueMin = 2, valueMax = 12, targetMin = 9, targetMax = 16, maxAttempts = 500, pairCount = 1 } = options;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const values = distinctInts(rng, count, valueMin, valueMax);
    if (!values) return null;
    const target = rng.int(targetMin, targetMax);
    if (values.includes(target)) continue; // a lone value could win the gate by itself — reject, try again
    const pairs = [];
    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        if (values[i] + values[j] === target) pairs.push([values[i], values[j]]);
      }
    }
    if (pairs.length !== pairCount) continue; // too few (ambiguity risk with 0) or too many (a further, uncertified pair) — reject, try again
    return { values, target, solution: pairs[0], solutions: pairs, attempts: attempt };
  }
  return null;
}
