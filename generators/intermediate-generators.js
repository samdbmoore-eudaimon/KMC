// generators/intermediate-generators.js — Intermediate module: INTERMEDIATE_G, bosses, cards, helpers.
import {
  T, rand, pick, shuffle, gcd, buildMC, buildMCStr, deg, svgBox, sup,
  SL, SC, SR, ST, simplifyFrac, gbp
} from './gen-shared.js';
import { JUNIOR_RARITY } from './junior-generators.js';

/* Tier tags (new field, Sam-approved 2026-07-31): "higher" = GCSE Higher-only content,
   flagged so grade 7-9-track kids can be steered to it specifically; omitted/"mixed" =
   appears across Foundation and Higher in some form. Topic list covers IMC/Intermediate
   Kangaroo/GCSE Foundation+Higher; Olympiad (Cayley/Hamilton/Maclaurin) is deliberately
   NOT in this generator system — it's free-response self-marked content in its own
   INTERMEDIATE_OLYMPIAD/ACADEMY area, unlocked at chapter 8, see below. */
export const INTERMEDIATE_TOPICS = [
  { key: "surdsAndIndices",           label: "Surds & Indices",       emoji: "√",  color: "#7c5cff", tier: "higher" },
  { key: "numberTheoryDivisibility",  label: "Number Theory",         emoji: "🔢", color: "#22c8b8" },
  { key: "surdicModularNumberTheory", label: "Modular Arithmetic",    emoji: "🔁", color: "#5b3df0", tier: "higher" },
  { key: "ratioProportionAlgebraic",  label: "Proportion as Algebra", emoji: "⚖️", color: "#ff6b4a", tier: "higher" },
  { key: "percentageAndCompoundGrowth", label: "Compound Growth",     emoji: "📈", color: "#2fc97a" },
  { key: "algebraicManipulation",     label: "Algebraic Manipulation",emoji: "🧮", color: "#ff5d8f" },
  { key: "simultaneousEquations",     label: "Simultaneous Equations",emoji: "🔗", color: "#ffc93c" },
  { key: "quadratics",                label: "Quadratics",           emoji: "📉", color: "#7c5cff", tier: "higher" },
  { key: "algebraicProof",            label: "Algebraic Proof",      emoji: "✍️", color: "#5b3df0", tier: "higher" },
  { key: "functionsAndIteration",     label: "Functions & Iteration",emoji: "🔄", color: "#22c8b8", tier: "higher" },
  { key: "sequencesAndSeries",        label: "Sequences",            emoji: "🔢", color: "#ff6b4a" },
  { key: "graphsAndRatesOfChange",    label: "Graphs & Rates",       emoji: "📊", color: "#2fc97a", tier: "higher" },
  { key: "circleTheoremsAndTangents", label: "Circle Theorems",      emoji: "⭕", color: "#ffc93c", tier: "higher", dia: true },
  { key: "trigonometryAdvanced",      label: "Trigonometry",         emoji: "📐", color: "#ff5d8f", tier: "higher", dia: true },
  { key: "similarShapesAndScaleFactors", label: "Similar Shapes",    emoji: "🔺", color: "#22c8b8", dia: true },
  { key: "multiStepGeometryProof",    label: "Geometry Chains",      emoji: "📐", color: "#7c5cff", dia: true },
  { key: "coordinateGeometry",        label: "Coordinate Geometry",  emoji: "📍", color: "#ff6b4a", dia: true },
  { key: "threeDGeometryAndNets",     label: "3D Shapes",            emoji: "🧊", color: "#5b3df0", dia: true },
  { key: "advancedProbability",       label: "Advanced Probability", emoji: "🎲", color: "#2fc97a" },
  { key: "statisticsAdvanced",        label: "Advanced Statistics",  emoji: "📊", color: "#ffc93c", tier: "higher", dia: true },
  { key: "combinatoricsAndCounting",  label: "Combinatorics",        emoji: "🧩", color: "#ff5d8f" },
  { key: "invariantsAndParity",       label: "Invariants & Parity",  emoji: "🔄", color: "#22c8b8" },
  { key: "logicAndDeduction",         label: "Logic & Deduction",    emoji: "🃏", color: "#5b3df0" },
  { key: "diophantineEquations",      label: "Diophantine Puzzles",  emoji: "🔐", color: "#ff6b4a" },
  { key: "optimisationAndExtremal",   label: "Optimisation",         emoji: "🎯", color: "#7c5cff" },
  { key: "proofTechniques",           label: "Proof Techniques",     emoji: "🧠", color: "#2fc97a" },
  { key: "speedAndRelativeMotion",    label: "Relative Motion",      emoji: "🚄", color: "#ffc93c" },
  { key: "estimationAndBounds",       label: "Bounds & Estimation",  emoji: "📏", color: "#ff5d8f" },
];
export const INTERMEDIATE_DEEP_TOPICS = [];
export const INTERMEDIATE_CONCEPTS = {};
export function simplifySurd(n) {
  let coeff = 1, rem = n;
  for (let f = Math.floor(Math.sqrt(n)); f >= 2; f--) {
    if (rem % (f * f) === 0) { coeff = f; rem = rem / (f * f); break; }
  }
  return [coeff, rem];
}
export function fmtSurd(coeff, rem) { return rem === 1 ? String(coeff) : coeff === 1 ? `√${rem}` : `${coeff}√${rem}`; }
export function primeFactorise(n) {
  const factors = []; let x = n, p = 2;
  while (p * p <= x) { if (x % p === 0) { let e = 0; while (x % p === 0) { x /= p; e++; } factors.push([p, e]); } p++; }
  if (x > 1) factors.push([x, 1]);
  return factors;
}
export function fmtFactorisation(factors) { return factors.map(([p, e]) => e === 1 ? `${p}` : `${p}${sup(e)}`).join(" × "); }
export function round1SF(n) { const d = Math.pow(10, Math.floor(Math.log10(n))); return Math.round(n / d) * d; }

/* Batch 1 of Intermediate generator content (2026-07-31): surdsAndIndices, numberTheoryDivisibility,
   algebraicManipulation, simultaneousEquations, quadratics, percentageAndCompoundGrowth — chosen as
   text-only (no dia:true) to prove the harness first, matching Primary's own Batch-1 approach.
   Verified via scripts/gen_sanity_test_intermediate.cjs. Remaining 22 topics (incl. all diagram
   topics) are later batches. */
export const INTERMEDIATE_G = {
  surdsAndIndices(d) {
    const tier1 = [
      () => {
        const q = pick([2, 3]); const m = pick([2, 3, 4, 5]); const b = Math.pow(m, q); const p = pick([1, 2]);
        const answer = Math.pow(m, p);
        const decoys = [Math.pow(b, p), b, Math.pow(m, p + 1), m * p].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Evaluate ${b}^(${p}/${q}).`, options, correctIndex,
          hint: `This is a fractional index question. An index (or power) written as a fraction means two things at once: the denominator tells you which root to take, and the numerator tells you which power to raise it to. So b^(p/q) means "take the q-th root of b, then raise to the power p." Work out the root first, then the power — that order is usually easier with whole-number results.`,
          solution: {
            idea: `A fractional index p/q means: first take the q-th root, then raise to the power p. In symbols, b^(p/q) = (b^(1/q))^p.`,
            steps: [
              `${b}^(1/${q}) means "the ${q === 2 ? "square" : "cube"} root of ${b}", which is ${m}.`,
              `${b}^(${p}/${q}) = ${m}^${p} = ${answer}.`
            ],
            check: `Check: ${m}^${q} = ${b}, so the root step is right.`
          }
        };
      },
      () => {
        const n = pick([2, 3, 4, 5]); const p = pick([1, 2, 3]); const val = Math.pow(n, p);
        const answer = `1/${val}`;
        const decoys = [`-1/${val}`, `${val}`, `-${val}`, `1/${val + 1}`, `-1/${val + 1}`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Evaluate ${n}^(-${p}).`, options, correctIndex,
          hint: `This is a negative index question. A negative index means "one over the positive version." So n^(−p) = 1/n^p. This never produces a negative answer — it just flips the expression into a fraction. Work out the positive power first, then write it under 1.`,
          solution: {
            idea: `A negative index flips the expression into a reciprocal: n^(−p) = 1 / n^p. Think of it as moving the base to the other side of the fraction bar.`,
            steps: [
              `A negative index means "1 over the positive power": ${n}^(-${p}) = 1/${n}^${p}.`,
              `${n}^${p} = ${val}, so the answer is 1/${val}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const c = pick([2, 3, 4]); const k = pick([2, 3, 5, 6, 7, 10]); const n = c * c * k;
        const answer = fmtSurd(c, k);
        const decoys = [fmtSurd(1, n), fmtSurd(c, c * k), fmtSurd(c * c, k), fmtSurd(c + 1, k)].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Simplify √${n}.`, options, correctIndex,
          hint: `This is a simplifying surds question. A surd is a square root that does not give a whole number. To simplify, find the largest perfect square that divides evenly into the number under the root. Then split the root using √(a×b) = √a × √b, and replace √(perfect square) with the whole number.`,
          solution: {
            idea: `√(a×b) = √a × √b. If one of those factors is a perfect square, its root is a whole number, leaving a simpler surd. Always use the LARGEST perfect square factor to simplify in one step.`,
            steps: [
              `Find the largest perfect square factor of ${n}: ${n} = ${c * c} × ${k}.`,
              `√${n} = √${c * c} × √${k} = ${c}√${k}.`
            ]
          }
        };
      },
      () => {
        const n = pick([2, 3, 5, 6, 7, 10]); const answer = `√${n}/${n}`;
        const decoys = [`${n}/√${n}`, `1/√${n}`, `√${n}`, `${n}`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Rationalise the denominator: 1/√${n}.`, options, correctIndex,
          hint: `Rationalising the denominator means rewriting a fraction so there is no surd (square root) on the bottom. To do this, multiply both the top and bottom by the same surd that is on the bottom. Multiplying a square root by itself always gives a whole number (√n × √n = n), which clears the denominator.`,
          solution: {
            idea: `To remove a surd from a denominator, multiply top and bottom by that surd. The denominator becomes √n × √n = n, a whole number, while the numerator gains the surd.`,
            steps: [
              `Multiply top and bottom by √${n}: (1×√${n})/(√${n}×√${n}) = √${n}/${n}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const a = pick([2, 3, 5, 6, 7]); const b = pick([2, 3, 5, 6, 7]);
        if (a === b) return null;
        const prod = a * b; const [coeff, rem] = simplifySurd(prod);
        const answer = fmtSurd(coeff, rem);
        const decoys = [fmtSurd(1, prod), fmtSurd(a, b), `√${a + b}`, `${a * b}`, fmtSurd(coeff + 1, rem)].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Simplify √${a} × √${b}.`, options, correctIndex,
          hint: `This combines two surd multiplication rules: √a × √b = √(ab), and then simplify the result by pulling out any perfect square factor. Multiply under the root first, then look for the largest square factor of the product.`,
          solution: {
            idea: `√a × √b = √(ab). Once you have the combined root, simplify by finding the largest perfect square that divides the number under the root.`,
            steps: [
              `√${a} × √${b} = √${prod}.`,
              coeff > 1 ? `${prod} = ${coeff * coeff} × ${rem}, so √${prod} = ${coeff}√${rem}.` : `${prod} has no square factor, so it's already fully simplified.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const q = pick([2, 3]); const m = pick([2, 3, 4]); const b = Math.pow(m, q); const p = pick([1, 2]);
        if (p === q) return null;
        const val = Math.pow(m, p); const answer = `1/${val}`;
        const decoys = [`${val}`, `-${val}`, `1/${b}`, `-1/${b}`, `-1/${val}`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Evaluate ${b}^(-${p}/${q}).`, options, correctIndex,
          hint: `This combines fractional and negative indices. Handle them in order: first use the fractional part (p/q) to find the root and power, then apply the negative sign by taking the reciprocal. The denominator of the fraction tells you the root, the numerator tells you the power, and the negative sign flips to "1 over."`,
          solution: {
            idea: `b^(−p/q) = 1 / b^(p/q). First compute the fractional index (root then power), then flip the result because of the negative sign.`,
            steps: [
              `${b}^(1/${q}) = ${m}, so ${b}^(${p}/${q}) = ${m}^${p} = ${val}.`,
              `The negative sign flips it: ${b}^(-${p}/${q}) = 1/${val}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  numberTheoryDivisibility(d) {
    const tier1 = [
      () => {
        const divisors = [3, 4, 6, 7, 8, 9, 11]; const k = pick(divisors);
        const correct = k * rand(10, 90);
        const decoys = new Set(); let guard = 0;
        while (decoys.size < 4 && guard < 200) {
          guard++; const cand = correct + rand(1, k - 1) * pick([1, -1]);
          if (cand > 0 && cand % k !== 0) decoys.add(cand);
        }
        const arr = shuffle([correct, ...decoys]); const correctIndex = arr.indexOf(correct);
        return { q: `Which of these numbers is divisible by ${k}?`, options: arr.map(String), correctIndex,
          hint: `This is a divisibility question. A number is divisible by k if dividing it by k leaves no remainder — in other words, k goes into it a whole number of times. You can test each option by dividing or by using known divisibility rules (for example, a number is divisible by 3 if its digit sum is divisible by 3).`,
          solution: {
            idea: `A number is divisible by k when the result of dividing is a whole number with no remainder. Divisibility rules offer shortcuts: digit-sum tests work for 3, 9; last-digit tests for 2, 4, 5, 8; alternating digit sum for 11.`,
            steps: [
              `${correct} ÷ ${k} = ${correct / k}, a whole number.`,
              `The others leave a remainder when divided by ${k}.`
            ]
          }
        };
      },
      () => {
        const m = pick([3, 4, 6, 7, 8, 9, 11, 12]); const N = rand(50, 500); const answer = N % m;
        const decoys = [Math.floor(N / m), (answer + 1) % m, m - answer > 0 ? m - answer : 1, (answer + m - 1) % m].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `What is ${N} mod ${m} (the remainder when ${N} is divided by ${m})?`, options, correctIndex,
          hint: `This is a modular arithmetic question. "mod m" (short for modulo m) means the remainder after dividing by m. Divide the number by m, ignore the whole-number part, and the remainder is your answer. Remainders always lie between 0 and m−1.`,
          solution: {
            idea: `N mod m is the remainder when N is divided by m. Write N = (quotient × m) + remainder, where 0 ≤ remainder < m.`,
            steps: [
              `${N} = ${Math.floor(N / m)} × ${m} + ${answer}.`,
              `So ${N} mod ${m} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const g = pick([2, 3, 4, 5, 6]); const a = g * pick([2, 3, 4, 5, 7]); const b = g * pick([2, 3, 5, 6, 7, 8]);
        if (a === b) return null;
        const answer = gcd(a, b);
        const decoys = [a, b, answer + 1, a * b / answer].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Find the highest common factor (HCF) of ${a} and ${b}.`, options, correctIndex,
          hint: `The HCF (highest common factor, also called GCD — greatest common divisor) of two numbers is the biggest number that divides evenly into both. One reliable method is to write out each number's prime factors and pick the ones they share. Multiply those shared prime factors together to get the HCF.`,
          solution: {
            idea: `The HCF is the largest number that is a factor of both. Find it by listing prime factors of each number and taking every factor that appears in both (using the lower of the two exponents when a prime appears more than once).`,
            steps: [
              `Write each number's prime factors and take the common ones.`,
              `HCF(${a}, ${b}) = ${answer}.`
            ]
          }
        };
      },
      () => {
        const g = pick([2, 3]); const a = g * pick([2, 3, 4]); const b = g * pick([3, 4, 5]);
        if (a === b) return null;
        const h = gcd(a, b); const answer = (a * b) / h;
        const decoys = [a * b, h, answer + g, answer - g > 0 ? answer - g : answer + 2 * g].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Find the lowest common multiple (LCM) of ${a} and ${b}.`, options, correctIndex,
          hint: `The LCM (lowest common multiple) of two numbers is the smallest number that is a multiple of both — the first number that both divide into exactly. A useful shortcut is: LCM × HCF = product of the two numbers. So if you know the HCF, divide the product of the two numbers by it.`,
          solution: {
            idea: `LCM(a, b) = (a × b) ÷ HCF(a, b). This works because the HCF accounts for the shared prime factors, and dividing removes the double-counting.`,
            steps: [
              `LCM × HCF = ${a} × ${b}. HCF(${a},${b}) = ${h}.`,
              `LCM = (${a} × ${b}) / ${h} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const primes = shuffle([2, 3, 5, 7]).slice(0, pick([2, 3])); const exps = primes.map(() => rand(1, 3));
        const N = primes.reduce((acc, p, i) => acc * Math.pow(p, exps[i]), 1);
        if (N > 5000 || N < 10) return null;
        const factors = primeFactorise(N);
        const answer = factors.reduce((acc, [, e]) => acc * (e + 1), 1);
        const decoys = [factors.reduce((acc, [, e]) => acc + (e + 1), 0), factors.reduce((acc, [, e]) => acc * e, 1), answer + 1, answer * 2].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `How many factors (divisors) does ${N} have, including 1 and ${N} itself?`, options, correctIndex,
          hint: `This uses the factor-count formula. Once you have a number's prime factorisation, you can count its factors without listing them all. For each prime factor raised to a power e, you can choose that prime to appear 0, 1, 2, ... or e times in a factor. Multiply together (e+1) for each prime to get the total number of factors.`,
          solution: {
            idea: `If N = p₁^e₁ × p₂^e₂ × …, the total number of factors is (e₁+1)(e₂+1)…. Each factor is formed by independently choosing how many times to include each prime.`,
            steps: [
              `${N} = ${fmtFactorisation(factors)}.`,
              `Number of factors = ${factors.map(([, e]) => `(${e}+1)`).join(" × ")} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const primes = shuffle([2, 3, 5, 7]).slice(0, pick([2, 3])); const exps = primes.map(() => rand(1, 3));
        const N = primes.reduce((acc, p, i) => acc * Math.pow(p, exps[i]), 1);
        if (N > 10000 || N < 10) return null;
        const factors = primeFactorise(N); const answer = fmtFactorisation(factors);
        const decoy1 = fmtFactorisation(factors.map(([p, e], i) => i === 0 ? [p, e + 1] : [p, e]));
        const decoy4 = fmtFactorisation(factors.map(([p, e], i) => i === factors.length - 1 ? [p, e + 2] : [p, e]));
        const decoy2 = factors.length > 1 ? fmtFactorisation(factors.slice(1)) : fmtFactorisation([[factors[0][0] === 2 ? 3 : 2, factors[0][1]]]);
        const primesInN = factors.map(([p]) => p);
        const extraPrime = !primesInN.includes(2) ? 2 : !primesInN.includes(3) ? 3 : 11;
        const decoy3 = fmtFactorisation([...factors, [extraPrime, 1]]);
        const decoy5 = fmtFactorisation(factors.map(([p, e]) => [p, e + 3]));
        const decoys = [decoy1, decoy2, decoy3, decoy4, decoy5].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Write ${N} as a product of prime factors.`, options, correctIndex,
          hint: `Prime factorisation means breaking a number down into a product of prime numbers (numbers divisible only by 1 and themselves). Divide repeatedly by the smallest prime that goes in, then the next smallest, and so on until you reach 1. Write the result using index notation (e.g. 2³ × 5).`,
          solution: {
            idea: `Every whole number greater than 1 has a unique prime factorisation (the Fundamental Theorem of Arithmetic). Divide by the smallest available prime at each step until only 1 remains.`,
            steps: [
              `Divide by the smallest prime repeatedly: ${N} = ${answer}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  surdicModularNumberTheory(d) {
    const tier1 = [
      () => {
        const good = pick([[1, 4], [3, 8], [7, 20], [1, 16], [9, 25], [1, 5]]);
        const bad = shuffle([[1, 3], [2, 7], [5, 6], [1, 9], [4, 11], [1, 12]]).slice(0, 4);
        const fracs = shuffle([good, ...bad]);
        const options = fracs.map(([n, dd]) => `${n}/${dd}`);
        const correctIndex = fracs.indexOf(good);
        return { q: `Which of these fractions is a terminating decimal (not a recurring one)?`, options, correctIndex,
          hint: `This is a spot the terminating decimal question. When you divide the top number of a fraction by the bottom number (called the denominator), the decimal you get either stops after finitely many digits, which is called terminating, or carries on forever repeating a pattern, which is called recurring. Which one happens depends only on the prime factors of the denominator once the fraction is in its simplest form (with nothing left to cancel): if those prime factors are only 2s and 5s, the decimal terminates, if any other prime factor is there too, it recurs forever. Check each denominator's prime factors rather than trying to picture the decimal in your head.`,
          solution: {
            scenario: `You have five fractions to check, including ${good[0]}/${good[1]}, and you need to find the one whose decimal terminates rather than recurring forever.`,
            idea: `A fraction terminates as a decimal only if, once it is fully simplified, its denominator has no prime factors other than 2 and 5. This is because our number system is built on powers of 10, and 10 = 2×5, so only denominators built entirely from 2s and 5s divide exactly into some power of 10. Any other prime factor in the denominator (like 3, 7 or 11) means the division never settles and the decimal repeats forever instead.`,
            method: [`Look at the denominator of each fraction.`, `Break each denominator into its prime factors.`, `A fraction terminates only if those factors are just 2s and/or 5s.`, `Pick the one fraction that fits.`],
            steps: [`The correct fraction's denominator is ${good[1]}.`, `Breaking ${good[1]} into its prime factors gives ${fmtFactorisation(primeFactorise(good[1]))}.`, `Those are only 2s and/or 5s, so ${good[0]}/${good[1]} terminates.`, `The other four denominators each include a prime factor other than 2 or 5 (such as 3, 7 or 11), so their decimals recur forever instead.`],
            check: `Since ${good[1]}'s only prime factors are 2s and/or 5s, some power of 10 is exactly divisible by it, which is exactly what makes a decimal terminate, so the answer fits.`,
          } };
      },
      () => {
        const m = pick([7, 12, 24, 60]); const a = rand(1, m * 2); const b = rand(1, m * 2);
        const answer = (a + b) % m;
        const decoys = [a + b, (answer + 1) % m, (answer + m - 1) % m, Math.abs(a - b) % m].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Working mod ${m}: what is (${a} + ${b}) mod ${m}?`, options, correctIndex,
          hint: `This is a modular arithmetic question. Working "mod m" means you only care about the remainder left over after dividing by m, not the full number itself, a bit like a clock face with m hours on it that wraps back round to 0 once you reach m. To work out (a+b) mod m, first add a and b normally, then find the remainder when that total is divided by m.`,
          solution: {
            scenario: `Add ${a} and ${b} together, then find the remainder when the total is divided by ${m}.`,
            idea: `Working "mod m" means measuring how far a number sits past the last exact multiple of m, like a clock that wraps around every m hours instead of counting on forever. To find X mod m, divide X by m and see what is left over, that leftover amount (always somewhere between 0 and m−1) is the answer, written "X mod m".`,
            method: [`Add the two numbers together as normal.`, `Divide that total by ${m} and find the remainder.`, `That remainder is the answer.`],
            steps: [`${a} + ${b} = ${a + b}.`, `Dividing ${a + b} by ${m} leaves a remainder of ${answer}, so ${a + b} mod ${m} = ${answer}.`],
            check: `The remainder ${answer} is less than ${m}, as it always must be, and adding ${m} on to it repeatedly would land back on numbers that also give ${answer} mod ${m}.`,
          } };
      },
    ];
    const tier2 = [
      () => {
        const a = pick([5, 6, 7, 8, 10, 11]); const b = pick([2, 3, 4]);
        if (a === b) return null;
        const answer = a - b;
        const decoys = [a + b, b - a, a * b, answer + 2].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Simplify (√${a}+√${b})(√${a}-√${b}).`, options, correctIndex,
          hint: `This is a surds difference of two squares question. A surd is just a square root that does not work out to a whole number, like √5. There is a pattern that whenever you multiply (something plus another thing) by (that same something minus that same other thing), the middle terms cancel out and you are left with the first thing squared minus the second thing squared, this is called the difference of two squares. Squaring a square root just gives back the original number, so this pattern makes the surds disappear completely.`,
          solution: {
            scenario: `Multiply out (√${a}+√${b}) by (√${a}-√${b}) and simplify.`,
            idea: `(X+Y)(X−Y) always equals X² − Y², because multiplying it out gives two middle terms, +XY and −XY, that cancel each other exactly. Here X is √${a} and Y is √${b}, and squaring a square root just gives back the number inside it, so (√${a})² = ${a} and (√${b})² = ${b}. This general rule is written a² − b² = (a−b)(a+b) in algebra, and it applies just as well when a and b are themselves square roots.`,
            method: [`Recognise the pattern (X+Y)(X−Y) = X² − Y².`, `Square each square root to remove it.`, `Subtract to get the final whole number.`],
            steps: [`(√${a}+√${b})(√${a}-√${b}) fits the pattern (X+Y)(X-Y) = X²-Y², with X=√${a} and Y=√${b}.`, `Squaring removes the roots: (√${a})² = ${a} and (√${b})² = ${b}.`, `${a} - ${b} = ${answer}.`],
            check: `The answer is a whole number with no surd left over, which makes sense since the whole point of this pattern is that the surds cancel out.`,
          } };
      },
      () => {
        const a = pick([3, 4, 5, 6]); const b = pick([4, 5, 6, 7, 8, 9]);
        if (a === b) return null;
        const l = (a * b) / gcd(a, b);
        const threshold = l * pick([2, 3]) + rand(1, l - 1);
        const N = Math.ceil((threshold + 1) / l) * l;
        const decoys = [N + l, N - l > 0 ? N - l : N + 2 * l, a * b, N + a].filter((x) => x !== N && x > 0);
        const { options, correctIndex } = buildMC(N, decoys);
        return { q: `What is the smallest number greater than ${threshold} that is divisible by both ${a} and ${b}?`, options, correctIndex,
          hint: `This is a smallest common multiple question. A multiple of a number is what you get by multiplying it by 1, 2, 3 and so on, and a number that is a multiple of BOTH of two given numbers at once is called a common multiple, the smallest positive one is called the lowest common multiple, or LCM. Every number divisible by both is just the LCM multiplied by a whole number, so work out the LCM first, then find the next multiple of it past the target number.`,
          solution: {
            scenario: `Find the smallest number bigger than ${threshold} that ${a} and ${b} both divide into exactly.`,
            idea: `The lowest common multiple (LCM) of two numbers is the smallest number that both of them divide into exactly. Any number divisible by both must actually be a multiple of the LCM, not just of one of the numbers on its own. So once you know the LCM, finding the smallest multiple of it bigger than a target is just a case of counting up in steps of the LCM until you pass the target.`,
            method: [`Work out the LCM of the two given numbers.`, `See how many whole multiples of the LCM fit under the target number.`, `Move up to the next whole multiple of the LCM.`],
            steps: [`LCM(${a}, ${b}) = ${l}.`, `${threshold} lies between two multiples of ${l}; the next multiple of ${l} above ${threshold} is ${N}.`],
            check: `${N} is divisible by both ${a} and ${b} since it is a multiple of their LCM ${l}, and it is the very next such multiple after ${threshold}, so it must be the smallest one that works.`,
          } };
      },
    ];
    const tier3 = [
      () => {
        const a = pick([2, 3, 4, 7]); const b = pick([2, 3, 4, 5]); const m = pick([5, 6, 7, 9, 10, 11]);
        const raw = Math.pow(a, b); const val = raw % m;
        const decoys = [raw, (val + 1) % m, (val + m - 1) % m, (val + 2) % m].filter((x) => x !== val);
        const { options, correctIndex } = buildMC(val, decoys);
        return { q: `What is ${a}^${b} mod ${m}?`, options, correctIndex,
          hint: `This is a modular exponentiation question, meaning working out a power and then finding its remainder when divided by another number. Work the power out fully first, then find the remainder after dividing by m the same way you would for any mod question.`,
          solution: {
            scenario: `Work out ${a}^${b}, then find its remainder when divided by ${m}.`,
            idea: `"a^b mod m" asks for the remainder left over when a raised to the power b is divided by m. With numbers this size, the direct way is simplest: work out the power in full, then divide by m and keep only the remainder.`,
            method: [`Work out a^b as an ordinary number.`, `Divide that by m.`, `The remainder is the answer.`],
            steps: [`${a}^${b} = ${raw}.`, `Dividing ${raw} by ${m} leaves a remainder of ${val}, so ${a}^${b} mod ${m} = ${val}.`],
            check: `${val} is less than ${m}, as any mod ${m} remainder must always be.`,
          } };
      },
    ];
    const tier4 = [
      () => {
        const a = pick([2, 3]); const b = pick([6, 7, 8]); const m = pick([5, 7, 9, 11]);
        const raw = Math.pow(a, b); const val = raw % m;
        const decoys = [(val + 1) % m, (val + m - 1) % m, (val + 2) % m, Math.pow(a, b - 1) % m].filter((x) => x !== val);
        const { options, correctIndex } = buildMC(val, decoys);
        return { q: `What is ${a}^${b} mod ${m}?`, options, correctIndex,
          hint: `This is a modular exponentiation question, meaning working out a power and then finding its remainder when divided by another number. Even though the power itself gets fairly large here, work it out fully first, then find the remainder after dividing by m the same way you would for any mod question.`,
          solution: {
            scenario: `Work out ${a}^${b}, then find its remainder when divided by ${m}.`,
            idea: `"a^b mod m" asks for the remainder left over when a raised to the power b is divided by m. With numbers this size, the direct way still works: work out the power in full, then divide by m and keep only the remainder.`,
            method: [`Work out a^b as an ordinary number.`, `Divide that by m.`, `The remainder is the answer.`],
            steps: [`${a}^${b} = ${raw}.`, `Dividing ${raw} by ${m} leaves a remainder of ${val}, so ${a}^${b} mod ${m} = ${val}.`],
            check: `${val} is less than ${m}, as any mod ${m} remainder must always be.`,
          } };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[1]();
  },
  ratioProportionAlgebraic(d) {
    const tier1 = [
      () => {
        const k = pick([2, 3, 4, 5, 6, 7]); const x1 = rand(2, 10); const y1 = k * x1; const x2 = rand(2, 10);
        if (x1 === x2) return null;
        const y2 = k * x2;
        const decoys = [y2 + k, y2 - k > 0 ? y2 - k : y2 + 2 * k, x2 * y1, y1 + x2].filter((v) => v !== y2 && v > 0);
        const { options, correctIndex } = buildMC(y2, decoys);
        return { q: `y is directly proportional to x. When x=${x1}, y=${y1}. Find y when x=${x2}.`, options, correctIndex,
          hint: `This is a direct proportion question. Two quantities are directly proportional when one is always a fixed number times the other, so if you double one, the other doubles too, if you triple one, the other triples too. That fixed number is called the constant of proportionality. Work it out first from the pair of values you are given, then use it to find the missing value.`,
          solution: {
            scenario: `y is directly proportional to x. You are told that x=${x1} goes with y=${y1}, and you need to find y when x=${x2}.`,
            idea: `When y is directly proportional to x, it means y = k × x for some fixed number k that never changes, called the constant of proportionality. You can find k using any matching pair of x and y values you are given, then use that same k to work out y for any other x. This relationship is written y ∝ x, where ∝ means "is proportional to", and as an equation it is y = kx.`,
            method: [`Use the given x and y to find k = y ÷ x.`, `Use that same k with the new x value.`, `Multiply to get the new y.`],
            steps: [`k = ${y1} ÷ ${x1} = ${k}.`, `When x = ${x2}, y = ${k} × ${x2} = ${y2}.`],
            check: `${y2} ÷ ${x2} also equals ${k}, the same constant as before, confirming the ratio between y and x has stayed fixed.`,
          } };
      },
      () => {
        const density = pick([2, 3, 5, 7, 8, 10]); const volume = rand(3, 12);
        const mass = density * volume;
        const decoys = [volume, density, mass + density, mass - density > 0 ? mass - density : mass + 2 * density].filter((v) => v !== mass);
        const { options, correctIndex } = buildMC(mass, decoys);
        return { q: `A material has density ${density} g/cm³. What is the mass of ${volume} cm³ of it (in grams)?`, options, correctIndex,
          hint: `This is a density, mass and volume question. Density tells you how much mass is packed into each unit of volume, so to find the total mass of an object you multiply its density by how much volume (space) it takes up.`,
          solution: {
            scenario: `The material has a density of ${density} grams per cm³, and you have ${volume} cm³ of it. Find the total mass.`,
            idea: `Density is a rate, it tells you the mass per unit of volume (here, grams per cubic centimetre). To get the total mass of an amount of material, multiply the density by the volume you have, this scales the "mass per cm³" rate up to however many cm³ you actually have.`,
            method: [`Multiply density by volume.`, `That gives the mass in grams.`],
            steps: [`Mass = density × volume = ${density} × ${volume} = ${mass} g.`],
            check: `${mass} grams for ${volume} cm³ means each cm³ weighs ${density} g, which matches the density given.`,
          } };
      },
    ];
    const tier2 = [
      () => {
        const k = pick([12, 24, 36, 48, 60]); const x1 = pick([2, 3, 4, 6]);
        if (k % x1 !== 0) return null;
        const y1 = k / x1; const candidates = [2, 3, 4, 6, 12].filter((x) => x !== x1 && k % x === 0);
        const x2 = pick(candidates);
        if (!x2) return null;
        const y2 = k / x2;
        const decoys = [y2 + 1, y2 - 1 > 0 ? y2 - 1 : y2 + 2, x2, Math.round(y1 * x2 / x1)].filter((v) => v !== y2 && v > 0 && Number.isFinite(v));
        const { options, correctIndex } = buildMC(y2, decoys);
        return { q: `y is inversely proportional to x. When x=${x1}, y=${y1}. Find y when x=${x2}.`, options, correctIndex,
          hint: `This is an inverse proportion question. Two quantities are inversely proportional when one goes down as the other goes up, in such a way that multiplying them together always gives the same fixed number. Work out that fixed number first from the pair you are given, then divide it by the new x to find the new y.`,
          solution: {
            scenario: `y is inversely proportional to x. You are told that x=${x1} goes with y=${y1}, and you need to find y when x=${x2}.`,
            idea: `When y is inversely proportional to x, it means x × y always equals the same fixed number k, so y = k ÷ x. As x gets bigger, y must get smaller to keep that product the same, and vice versa. This is written y ∝ 1/x, meaning y is proportional to 1 divided by x, with equation form y = k/x.`,
            method: [`Multiply the given x and y together to find k.`, `Divide k by the new x value.`, `That gives the new y.`],
            steps: [`k = ${x1} × ${y1} = ${k}.`, `When x = ${x2}, y = ${k} ÷ ${x2} = ${y2}.`],
            check: `${x2} × ${y2} also equals ${k}, confirming the product stayed fixed.`,
          } };
      },
      () => {
        const k = pick([1, 2, 3]); const x1 = rand(2, 6); const y1 = k * x1 * x1; const x2 = rand(2, 8);
        if (x1 === x2) return null;
        const y2 = k * x2 * x2;
        const decoys = [k * x2, y1 * x2 / x1, y2 + k, y2 - k > 0 ? y2 - k : y2 + 2 * k].filter((v) => v !== y2 && v > 0);
        const { options, correctIndex } = buildMC(y2, decoys);
        return { q: `y is proportional to x². When x=${x1}, y=${y1}. Find y when x=${x2}.`, options, correctIndex,
          hint: `This is a proportional to the square question. Here y does not scale directly with x, it scales with x multiplied by itself (x squared), so if x doubles, y actually quadruples (multiplies by four, since 2²=4), not just doubles. Work out the fixed constant using the square of the given x, then apply it to the square of the new x.`,
          solution: {
            scenario: `y is proportional to x². You are told that x=${x1} goes with y=${y1}, and you need to find y when x=${x2}.`,
            idea: `When y is proportional to x², it means y = k × x² for a fixed constant k. To find k, take the given y and divide by the given x squared, not just x on its own. Then to find a new y, multiply that same k by the new x squared. This is written y ∝ x², meaning y is proportional to x squared.`,
            method: [`Square the given x value.`, `Divide the given y by that square to find k.`, `Square the new x value.`, `Multiply by k to get the new y.`],
            steps: [`${x1}² = ${x1 * x1}.`, `k = ${y1} ÷ ${x1 * x1} = ${k}.`, `${x2}² = ${x2 * x2}.`, `y = ${k} × ${x2 * x2} = ${y2}.`],
            check: `The ratio y2:y1 matches (x2:x1)², confirming the square relationship holds.`,
          } };
      },
    ];
    const tier3 = [
      () => {
        const kmh = pick([18, 36, 54, 72, 90, 108]);
        const ms = kmh / 3.6;
        const decoys = [Math.round(kmh * 3.6), kmh / 3, Math.round(kmh / 60), ms + 5].filter((v) => v !== ms && Number.isFinite(v));
        const { options, correctIndex } = buildMC(ms, decoys);
        return { q: `Convert ${kmh} km/h to m/s.`, options, correctIndex,
          hint: `This is a units conversion question, converting a speed given in kilometres per hour into metres per second. There are 1000 metres in a kilometre and 3600 seconds in an hour, so converting a speed between these units means multiplying by 1000 and dividing by 3600, which simplifies to just dividing by 3.6.`,
          solution: {
            scenario: `Convert a speed of ${kmh} km/h into m/s.`,
            idea: `Changing a speed from km/h to m/s means changing both the distance unit (km to m) and the time unit (hours to seconds) at once. Since 1 km = 1000 m and 1 hour = 3600 seconds, multiplying by 1000 and dividing by 3600 does the conversion, and 1000/3600 simplifies to 1/3.6, so dividing by 3.6 is a shortcut for the whole thing.`,
            method: [`Take the speed in km/h.`, `Divide by 3.6 to convert to m/s.`],
            steps: [`${kmh} ÷ 3.6 = ${ms} m/s.`],
            check: `Multiplying ${ms} back by 3.6 returns ${kmh}, confirming the conversion.`,
          } };
      },
    ];
    const tier4 = [
      () => {
        const k = pick([16, 36, 64, 100]); const x1 = pick([2, 3, 4]);
        if (k % (x1 * x1) !== 0) return null;
        const y1 = k / (x1 * x1); const candidates = [2, 3, 4, 5].filter((x) => x !== x1 && k % (x * x) === 0);
        const x2 = pick(candidates);
        if (!x2) return null;
        const y2 = k / (x2 * x2);
        const decoys = [k / x2, y2 + 1, y2 - 1 > 0 ? y2 - 1 : y2 + 2, y1].filter((v) => v !== y2 && v > 0 && Number.isFinite(v));
        const { options, correctIndex } = buildMC(y2, decoys);
        return { q: `y is inversely proportional to x². When x=${x1}, y=${y1}. Find y when x=${x2}.`, options, correctIndex,
          hint: `This is an inversely proportional to the square question. Here y goes down as x² goes up, in such a way that y times x² always gives the same fixed number. If x doubles, y drops to a quarter (since 2²=4), not just a half. Work out the fixed constant using the given x squared, then use it with the new x squared.`,
          solution: {
            scenario: `y is inversely proportional to x². You are told that x=${x1} goes with y=${y1}, and you need to find y when x=${x2}.`,
            idea: `When y is inversely proportional to x², it means y × x² is always the same fixed number k, so y = k ÷ x². Find k using the given pair (multiply the given y by the given x squared), then divide that same k by the new x squared to get the new y. This is written y ∝ 1/x².`,
            method: [`Square the given x.`, `Multiply by the given y to find k.`, `Square the new x.`, `Divide k by that square to get the new y.`],
            steps: [`${x1}² = ${x1 * x1}.`, `k = ${x1 * x1} × ${y1} = ${k}.`, `${x2}² = ${x2 * x2}.`, `y = ${k} ÷ ${x2 * x2} = ${y2}.`],
            check: `${y2} × ${x2 * x2} also equals ${k}, confirming the product stayed fixed with the new values too.`,
          } };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  percentageAndCompoundGrowth(d) {
    const tier1 = [
      () => {
        const P = pick([100, 200, 400, 500, 800, 1000]); const r = pick([5, 10, 20, 25]); const n = pick([2, 3]);
        const A = Math.round(P * Math.pow(1 + r / 100, n));
        const decoys = [Math.round(P * (1 + r * n / 100)), P, A + P, Math.round(P * Math.pow(1 + r / 100, n + 1))].filter((v) => v !== A);
        const { options, correctIndex } = buildMC(A, decoys);
        return { q: `£${P} is invested at ${r}% compound interest per year. What is it worth after ${n} years (to the nearest pound)?`, options, correctIndex,
          hint: `Compound interest means the interest each year is calculated on the updated total, not just the original amount. The multiplier for one year is (1 + rate/100). Apply this multiplier repeatedly — once per year — by raising it to the power of the number of years.`,
          solution: {
            idea: `With compound interest, the amount after n years is P × (1 + r/100)^n. Each year's interest is added to the principal before the next year's interest is calculated, so the total grows faster than simple interest.`,
            steps: [
              `Multiplier = (1 + ${r}/100) = ${1 + r / 100} each year, applied ${n} times.`,
              `£${P} × ${1 + r / 100}^${n} ≈ £${A}.`
            ]
          }
        };
      },
      () => {
        const P = pick([1000, 2000, 4000, 5000, 8000, 10000]); const r = pick([10, 20, 25]); const n = pick([2, 3]);
        const A = Math.round(P * Math.pow(1 - r / 100, n));
        const decoys = [Math.round(P * (1 - r * n / 100)), P, A - 100, A + 100].filter((v) => v !== A && v > 0);
        const { options, correctIndex } = buildMC(A, decoys);
        return { q: `A car worth £${P} depreciates by ${r}% per year. What is it worth after ${n} years (to the nearest pound)?`, options, correctIndex,
          hint: `Depreciation works like compound interest in reverse: the value decreases by a percentage each year, applied to the current value (not the original). The multiplier for one year of depreciation at r% is (1 − r/100), and you apply it once per year for n years.`,
          solution: {
            idea: `Compound depreciation: A = P × (1 − r/100)^n. The value after each year is a fixed fraction of the previous year's value, so the losses get smaller in absolute terms as the value falls.`,
            steps: [
              `Multiplier = (1 - ${r}/100) = ${1 - r / 100} each year, applied ${n} times.`,
              `£${P} × ${1 - r / 100}^${n} ≈ £${A}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const orig = pick([40, 50, 60, 80, 100, 120, 150, 200]); const pct = pick([10, 20, 25, 15, 5]);
        if ((orig * pct) % 100 !== 0) return null;
        const increase = pick([true, false]);
        const finalVal = increase ? orig + (orig * pct / 100) : orig - (orig * pct / 100);
        const decoys = [Math.round(finalVal * (1 + pct / 100)), Math.round(finalVal * (1 - pct / 100)), finalVal, orig + pct].filter((v) => v !== orig && v > 0);
        const { options, correctIndex } = buildMC(orig, decoys);
        return { q: `After a ${pct}% ${increase ? "increase" : "decrease"}, a price is £${finalVal}. What was the original price?`, options, correctIndex,
          hint: `This is a reverse percentage problem. The final value is the original multiplied by the percentage multiplier. To reverse it, divide the final value by the same multiplier instead of multiplying. Avoid the common mistake of finding the percentage of the final value — you must divide by the multiplier.`,
          solution: {
            idea: `If original × multiplier = final, then original = final ÷ multiplier. The multiplier for a ${pct}% ${increase ? "increase" : "decrease"} is ${increase ? (1 + pct / 100) : (1 - pct / 100)}.`,
            steps: [
              `Final = original × ${increase ? (1 + pct / 100) : (1 - pct / 100)}.`,
              `Original = £${finalVal} ÷ ${increase ? (1 + pct / 100) : (1 - pct / 100)} = £${orig}.`
            ]
          }
        };
      },
      () => {
        const P = pick([100, 200, 400, 500]); const p1 = pick([10, 20, 25, -10, -20]); const p2 = pick([10, 20, -10, -25]);
        const overallMult = (1 + p1 / 100) * (1 + p2 / 100);
        const answer = Math.round((overallMult - 1) * 1000) / 10;
        const decoys = [p1 + p2, Math.round((answer + 5) * 10) / 10, Math.round((answer - 5) * 10) / 10, Math.round((p1 * p2 / 100) * 10) / 10].filter((v) => v !== answer && Number.isFinite(v));
        const { options, correctIndex } = buildMC(answer, decoys, (x) => `${x}%`);
        return { q: `A price increases by ${p1}% then changes by ${p2}%. What is the overall percentage change (to 1 d.p.)?`, options, correctIndex,
          hint: `Successive percentage changes cannot simply be added. Instead, convert each change to a multiplier (add/subtract from 1), multiply the multipliers together, and convert the combined multiplier back to a percentage change. Adding the percentages only works if the second change is applied to the original — here it is applied to the already-changed value.`,
          solution: {
            idea: `Each percentage change is a multiplier: a change of r% corresponds to multiplier (1 + r/100). Successive changes multiply their multipliers. The overall change is then (product − 1) × 100%.`,
            steps: [
              `Overall multiplier = ${(1 + p1 / 100).toFixed(2)} × ${(1 + p2 / 100).toFixed(2)} = ${overallMult.toFixed(4)}.`,
              `Overall change ≈ ${answer}%.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const P = pick([100, 200, 400, 500]); const r = pick([10, 20, 25, 50]); const n = pick([1, 2]);
        const A = Math.round(P * Math.pow(1 + r / 100, n));
        const decoys = [r + 5, r - 5 > 0 ? r - 5 : r + 10, Math.round((A - P) / P * 100), r * 2].filter((v) => v !== r && v > 0);
        const { options, correctIndex } = buildMC(r, decoys);
        return { q: `£${P} grows to £${A} after ${n} year${n > 1 ? "s" : ""} of compound growth. What is the annual growth rate (%)?`, options, correctIndex,
          hint: `To find the annual rate from an initial and final value, reverse the compound interest formula. Divide the final by the initial to get the combined multiplier, then (if n > 1) take the appropriate root to find the per-year multiplier, and finally convert back to a percentage.`,
          solution: {
            idea: `A = P × (1 + r/100)^n, so (1 + r/100)^n = A/P. If n=1, this gives the rate directly. If n>1, take the nth root of both sides to isolate the per-year multiplier.`,
            steps: [
              n === 1 ? `Rate = (${A}-${P})/${P} × 100 = ${r}%.` : `${P} × (1+r/100)^${n} = ${A}, solving gives r = ${r}%.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const P = pick([100, 200, 500]); const r = pick([10, 20, 25]); const mult = pick([2, 3]);
        let years = 0, val = P; const target = P * mult;
        while (val < target && years < 30) { val *= (1 + r / 100); years++; }
        const answer = years;
        const decoys = [years + 1, years - 1 > 0 ? years - 1 : years + 2, years + 2, Math.max(1, Math.round(years / 2))].filter((v) => v !== answer && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `£${P} grows at ${r}% compound interest per year. After how many whole years does it first exceed £${target}?`, options, correctIndex,
          hint: `This is a "when does it reach the target?" problem. Apply the multiplier year by year (multiply by (1 + r/100) each time) and count how many years it takes to first exceed the target. There is no shortcut formula for whole years — you track the running total step by step.`,
          solution: {
            idea: `Compound growth is exponential: each year multiplies the current amount by (1 + r/100). To find the first year the total exceeds a target, apply the multiplier repeatedly and count the steps.`,
            steps: [
              `Multiply by ${1 + r / 100} repeatedly until it passes £${target}: this first happens after ${years} year${years === 1 ? "" : "s"}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  algebraicManipulation(d) {
    const tier1 = [
      () => {
        const a1 = rand(1, 5), b1 = rand(-6, 6) || 1, a2 = rand(1, 5), b2 = rand(-6, 6) || 1;
        const coefX = a1 * b2 + a2 * b1; const coefX2 = a1 * a2;
        const decoys = [coefX2, b1 * b2, coefX + a1, coefX - a2].filter((x) => x !== coefX);
        const { options, correctIndex } = buildMC(coefX, decoys);
        const fmt = (a, b) => `(${a === 1 ? "" : a}x${b >= 0 ? "+" : ""}${b})`;
        return { q: `Expand ${fmt(a1, b1)}${fmt(a2, b2)} and give the coefficient of x.`, options, correctIndex,
          hint: `Expanding two brackets means multiplying every term in the first bracket by every term in the second. Use FOIL or the grid method: First, Outer, Inner, Last. The coefficient of x comes from adding the "outer" and "inner" products (the two terms that each have exactly one x).`,
          solution: {
            idea: `(ax+b)(cx+d) = acx² + (ad+bc)x + bd. The coefficient of x is ad+bc — the sum of the cross-products.`,
            steps: [
              `${fmt(a1, b1)}${fmt(a2, b2)} = ${a1 * a2}x² + (${a1}×${b2} + ${a2}×${b1})x + ${b1 * b2}.`,
              `Coefficient of x = ${coefX}.`
            ]
          }
        };
      },
      () => {
        const k = pick([2, 3, 4, 5, 6, 7, 8]); const N = k * k;
        const decoys = [N, k + 1, k - 1 > 0 ? k - 1 : k + 2, Math.floor(Math.sqrt(N)) + 1].filter((x) => x !== k);
        const { options, correctIndex } = buildMC(k, decoys);
        return { q: `x² - ${N} factorises as (x-k)(x+k). What is k?`, options, correctIndex,
          hint: `This is the difference of two squares identity: x² − N = (x−k)(x+k), where N = k². To find k, you just need the square root of N. This pattern appears whenever you see a perfect square subtracted from x².`,
          solution: {
            idea: `The difference of two squares: a² − b² = (a−b)(a+b). Here x² − N = (x−k)(x+k), so k² = N and k = √N.`,
            steps: [
              `${N} = ${k}², so k = ${k}.`,
              `x² − ${N} = (x−${k})(x+${k}).`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const a = pick([2, 3, 4, 5, 6]); const b = rand(-8, 8) || 1;
        const answer = `x${b >= 0 ? "+" : ""}${b}`;
        const decoys = [`${a}x${a * b >= 0 ? "+" : ""}${a * b}`, `x${a * b >= 0 ? "+" : ""}${a * b}`, `${a}x${b >= 0 ? "+" : ""}${b}`, `x${(-b) >= 0 ? "+" : ""}${-b}`, `x${(b + a) >= 0 ? "+" : ""}${b + a}`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Simplify (${a}x${a * b >= 0 ? "+" : ""}${a * b}) / ${a}.`, options, correctIndex,
          hint: `To simplify an algebraic fraction where every term in the numerator shares a common factor with the denominator, factorise the numerator first and then cancel. Here, every term in the numerator is divisible by ${a}, so factor it out and cancel.`,
          solution: {
            idea: `Factorising the numerator and cancelling common factors is the algebraic equivalent of simplifying a numeric fraction: (a×expression)/a = expression.`,
            steps: [
              `${a}x${a * b >= 0 ? "+" : ""}${a * b} = ${a}(x${b >= 0 ? "+" : ""}${b}).`,
              `Dividing by ${a} gives x${b >= 0 ? "+" : ""}${b}.`
            ]
          }
        };
      },
      () => {
        const a = pick([2, 3, 4, 5]); const b = pick([2, 3, 4, 5]);
        if (a === b) return null;
        const commonDenom = a * b; const combinedCoef = a + b;
        const decoys = [combinedCoef + 1, a * b, Math.abs(a - b), combinedCoef - 1 > 0 ? combinedCoef - 1 : combinedCoef + 2].filter((x) => x !== combinedCoef);
        const { options, correctIndex } = buildMC(combinedCoef, decoys);
        return { q: `Write x/${a} + x/${b} as a single fraction with denominator ${commonDenom}. What is the numerator's coefficient of x?`, options, correctIndex,
          hint: `Adding algebraic fractions works exactly like adding numeric fractions: find a common denominator and convert both fractions to use it, then add the numerators. The common denominator here is ${a}×${b} = ${commonDenom}.`,
          solution: {
            idea: `To add fractions with different denominators, convert each to an equivalent fraction with the common denominator, then add numerators. With variables, x/a + x/b = (bx + ax)/(ab) = (a+b)x/(ab).`,
            steps: [
              `x/${a} + x/${b} = (${b}x + ${a}x)/${commonDenom} = ${combinedCoef}x/${commonDenom}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const a = rand(1, 4), b = rand(-5, 5) || 1, c = rand(1, 4), d1 = rand(-5, 5) || 2;
        const answer = b * d1;
        const decoys = [a * c, a * d1 + b * c, answer + a, answer - c].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        const fmt = (p, q) => `(${p === 1 ? "" : p}x${q >= 0 ? "+" : ""}${q})`;
        return { q: `Expand ${fmt(a, b)}${fmt(c, d1)} and give the constant term.`, options, correctIndex,
          hint: `When expanding two brackets, the constant term (the part with no x) comes entirely from multiplying the two constant terms together. You do not need to expand everything — just multiply the numbers at the end of each bracket.`,
          solution: {
            idea: `In (ax+b)(cx+d), the constant term is b×d. Only the two constant parts interact to produce the term with no x.`,
            steps: [
              `The constant term comes from multiplying the two constants: ${b} × ${d1} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        let p = rand(-8, 8), q = rand(-8, 8);
        if (p === 0 || q === 0 || p === q) return null;
        const lo = Math.min(p, q), hi = Math.max(p, q); const b = p + q, c = p * q;
        const answer = `x = ${-lo} or x = ${-hi}`;
        const decoys = [`x = ${lo} or x = ${hi}`, `x = ${-lo} or x = ${hi}`, `x = ${-b} or x = ${c}`, `x = ${-hi} or x = ${lo}`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Solve x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0 by factorising.`, options, correctIndex,
          hint: `To solve a quadratic by factorising, find two numbers that multiply to the constant term and add to the coefficient of x. Write the quadratic as (x+p)(x+q) = 0. Then each bracket can equal zero separately, giving two solutions x = −p and x = −q.`,
          solution: {
            idea: `If (x+p)(x+q) = 0, then either x+p = 0 or x+q = 0, giving x = −p or x = −q. The key step is finding p and q such that p+q equals the x-coefficient and p×q equals the constant.`,
            steps: [
              `Find two numbers that multiply to ${c} and add to ${b}: ${p} and ${q}.`,
              `(x${p >= 0 ? "+" : ""}${p})(x${q >= 0 ? "+" : ""}${q}) = 0, so x = ${-p} or x = ${-q}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  simultaneousEquations(d) {
    const solveSystem = (wantX) => {
      const x0 = rand(-6, 10), y0 = rand(-6, 10);
      const a1 = rand(1, 5), b1 = rand(1, 5), a2 = rand(1, 5), b2 = rand(1, 5);
      if (a1 * b2 === a2 * b1) return null;
      const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
      const answer = wantX ? x0 : y0;
      const decoys = [wantX ? y0 : x0, answer + 1, answer - 1, answer * 2].filter((v) => v !== answer);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Solve: ${a1}x + ${b1}y = ${c1}, ${a2}x + ${b2}y = ${c2}. Find ${wantX ? "x" : "y"}.`, options, correctIndex,
        hint: `Simultaneous equations are two equations that must both be true at the same time. The elimination method involves multiplying one or both equations by suitable numbers so that the coefficient of one variable becomes the same in both, then subtracting (or adding) to remove that variable and solve for the other.`,
        solution: {
          idea: `Eliminate one variable by scaling the equations so its coefficient matches in both, then add or subtract. Once one variable is found, substitute back to find the other.`,
          steps: [
            `Eliminate one variable by combining the two equations.`,
            `x = ${x0}, y = ${y0}.`
          ]
        }
      };
    };
    const tier1 = [() => solveSystem(true), () => solveSystem(false)];
    const tier2 = [
      () => {
        const x0 = rand(2, 12), y0 = rand(1, 8); const A = x0 + 2 * y0, B = x0 - 2 * y0;
        const decoys = [y0, x0 + y0, x0 - 1, x0 + 2].filter((v) => v !== x0);
        const { options, correctIndex } = buildMC(x0, decoys);
        return { q: `x + 2y = ${A} and x - 2y = ${B}. Find x (add the two equations to eliminate y).`, options, correctIndex,
          hint: `When two equations have the same variable with opposite signs (here +2y and −2y), adding the equations makes that variable disappear instantly. The result is a single equation in one unknown, which you can solve directly.`,
          solution: {
            idea: `Adding equations works when a variable has equal and opposite coefficients in each — it cancels that variable. Here +2y and −2y sum to zero.`,
            steps: [
              `Adding the equations: 2x = ${A + B}, so x = ${x0}.`
            ]
          }
        };
      },
      () => {
        const child = rand(3, 8), adult = child + rand(2, 8); const na = rand(2, 5), nc = rand(2, 6);
        const total = na * adult + nc * child;
        const decoys = [child, adult + 1, adult - 1, total - child * nc].filter((v) => v !== adult && v > 0);
        const { options, correctIndex } = buildMC(adult, decoys);
        return { q: `${na} adult tickets and ${nc} child tickets cost £${total} in total. A child ticket costs £${child}. What does an adult ticket cost?`, options, correctIndex,
          hint: `This is a simultaneous equations problem dressed as a word problem. You have one equation (the total cost) and one unknown (the adult ticket price), because the child ticket price is given. Substitute the known value, then solve for the unknown.`,
          solution: {
            idea: `When one unknown is already given, substitute it into the equation to leave a single equation in one unknown. This is essentially solving a linear equation.`,
            steps: [
              `${na} × adult + ${nc} × ${child} = ${total}.`,
              `${na} × adult = ${total - nc * child}, so adult = £${adult}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const a0 = rand(2, 9), b0 = rand(2, 9), c0 = rand(2, 9);
        const P = a0 + b0, Q = b0 + c0, R = a0 + c0;
        const decoys = [b0, c0, a0 + 1, a0 - 1 > 0 ? a0 - 1 : a0 + 2].filter((v) => v !== a0);
        const { options, correctIndex } = buildMC(a0, decoys);
        return { q: `a + b = ${P}, b + c = ${Q}, a + c = ${R}. Find a.`, options, correctIndex,
          hint: `With three equations in three unknowns, a smart first step is to add all three equations together — this gives 2(a+b+c) and lets you find the total. Once you know a+b+c, subtract the equation that does not contain a to isolate a.`,
          solution: {
            idea: `Adding all three pairwise-sum equations gives 2(a+b+c) = sum of all three right-hand sides, so a+b+c = half that total. Then a = (a+b+c) − (b+c).`,
            steps: [
              `Add all three: 2(a+b+c) = ${P + Q + R}, so a+b+c = ${(P + Q + R) / 2}.`,
              `a = (a+b+c) - (b+c) = ${(P + Q + R) / 2} - ${Q} = ${a0}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const r1 = rand(-5, 5), r2 = rand(-5, 5);
        if (r1 === 0 || r2 === 0 || r1 === r2 || r1 === -r2) return null;
        const m = r1 + r2; const cVal = -(r1 * r2); const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
        const answer = `x = ${lo} or x = ${hi}`;
        const decoys = [`x = ${-lo} or x = ${-hi}`, `x = ${hi} or x = ${hi + 1}`, `x = ${lo - 1} or x = ${hi + 1}`, `x = ${m} or x = ${cVal}`, `x = ${lo + 1} or x = ${hi - 1}`].filter((v) => v !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        const negM = -m, negC = -cVal;
        return { q: `Solve simultaneously: y = x² and y = ${m}x ${cVal >= 0 ? "+" : ""}${cVal}.`, options, correctIndex,
          hint: `To solve a linear and a quadratic simultaneously, substitute the linear expression for y into the quadratic equation. This gives a quadratic in x alone, which you then solve by rearranging and factorising. Each x-value gives a corresponding y-value.`,
          solution: {
            idea: `Substituting y = mx+c into y = x² gives x² = mx+c, which rearranges to a standard quadratic. Solve by factorising or the quadratic formula.`,
            steps: [
              `Substitute: x² = ${m}x ${cVal >= 0 ? "+" : ""}${cVal}, so x² ${negM >= 0 ? "+" : ""}${negM}x ${negC >= 0 ? "+" : ""}${negC} = 0.`,
              `This factorises with roots x = ${lo} and x = ${hi}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || solveSystem(true);
  },
  quadratics(d) {
    const tier1 = [
      () => {
        const b = pick([2, 4, 6, 8, 10, -2, -4, -6]); const c = rand(-10, 10);
        const p = b / 2; const q = c - p * p;
        const decoys = [c, p, -q, q + p].filter((x) => x !== q && Number.isFinite(x));
        const { options, correctIndex } = buildMC(q, decoys);
        return { q: `Write x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} in the form (x+${p})² + q. What is q?`, options, correctIndex,
          hint: `Completing the square means rewriting a quadratic in the form (x+p)² + q. The value p is always half the coefficient of x. Expand (x+p)² to see what it equals, then compare with the original quadratic to find q — it is what you must add to make up the difference.`,
          solution: {
            idea: `x² + bx + c = (x + b/2)² − (b/2)² + c. The adjustment q = c − (b/2)² corrects for the extra term created when squaring the bracket.`,
            steps: [
              `(x+${p})² = x² + ${b}x + ${p * p}.`,
              `So q = ${c} - ${p * p} = ${q}.`
            ]
          }
        };
      },
      () => {
        const b = pick([2, 4, 6, 8, -2, -4, -6, -8]); const c = rand(-10, 10); const px = -b / 2;
        const decoys = [b / 2, px + 1, px - 1, -px].filter((x) => x !== px);
        const { options, correctIndex } = buildMC(px, decoys);
        return { q: `Find the x-coordinate of the turning point of y = x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}.`, options, correctIndex,
          hint: `The graph of y = x² + bx + c is a parabola. Its turning point (the vertex — the lowest point if the x² term is positive) occurs at x = −b/2. This comes directly from completing the square, or from the symmetry of the parabola.`,
          solution: {
            idea: `For y = x² + bx + c, the turning point is at x = −b/2. The parabola is symmetric about this value, so both roots (if they exist) are equidistant from it.`,
            steps: [
              `The turning point is at x = -b/2 = -(${b})/2 = ${px}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const r1 = rand(-8, 8), r2 = rand(-8, 8);
        if (r1 === r2) return null;
        const bcoef = -(r1 + r2), c = r1 * r2; const hi = Math.max(r1, r2);
        const decoys = [Math.min(r1, r2), hi + 1, hi - 1, -hi].filter((v) => v !== hi);
        const { options, correctIndex } = buildMC(hi, decoys);
        return { q: `Solve x² ${bcoef >= 0 ? "+" : ""}${bcoef}x ${c >= 0 ? "+" : ""}${c} = 0. What is the larger solution?`, options, correctIndex,
          hint: `To solve a quadratic, try to factorise it: find two numbers that multiply to the constant term and add to the x-coefficient. If the quadratic factors as (x−r₁)(x−r₂) = 0, the solutions are x = r₁ and x = r₂. Then pick the larger.`,
          solution: {
            idea: `A quadratic with roots r₁ and r₂ factorises as (x−r₁)(x−r₂) = 0. The coefficients of x and the constant term are −(r₁+r₂) and r₁r₂ respectively.`,
            steps: [
              `This factorises with roots x = ${r1} and x = ${r2}.`,
              `The larger solution is ${hi}.`
            ]
          }
        };
      },
      () => {
        const k = pick([3, 4, 5, 6, 7]); const N = k * k; const count = 2 * k - 1;
        const decoys = [2 * k, 2 * k + 1, k, count - 2].filter((v) => v !== count && v > 0);
        const { options, correctIndex } = buildMC(count, decoys);
        return { q: `How many integers x satisfy x² < ${N}?`, options, correctIndex,
          hint: `x² < N means the square of x must be less than N. Take the square root of both sides to find the range: −√N < x < √N. Then count the integers in that range — remember to include negatives, zero, and positives.`,
          solution: {
            idea: `x² < N is equivalent to −√N < x < √N (an open interval). Count the integers strictly inside this interval.`,
            steps: [
              `x² < ${N} means -${k} < x < ${k}.`,
              `Integers from ${-(k - 1)} to ${k - 1}: that's ${count} values.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const b = rand(-10, 10) || 2, c = rand(-15, 15); const disc = b * b - 4 * c;
        const answer = disc > 0 ? 2 : disc === 0 ? 1 : 0;
        const options = shuffle(["0", "1", "2", "3", "4"]); const correctIndex = options.indexOf(String(answer));
        return { q: `How many real solutions does x² + ${b}x + ${c} = 0 have?`, options, correctIndex,
          hint: `The discriminant (b² − 4ac, where a=1 here) tells you how many real solutions a quadratic has without solving it. If it is positive, there are two distinct real solutions. If it is zero, there is exactly one (a repeated root). If it is negative, there are no real solutions.`,
          solution: {
            idea: `The discriminant D = b² − 4ac determines the number of real roots: D > 0 gives two roots, D = 0 gives one repeated root, D < 0 gives none. It measures how far the parabola's vertex sits from the x-axis.`,
            steps: [
              `Discriminant = b² - 4c = ${b}² - 4×${c} = ${disc}.`,
              disc > 0 ? `Since the discriminant is positive, there are 2 real solutions.` : disc === 0 ? `Since the discriminant is 0, there is 1 repeated real solution.` : `Since the discriminant is negative, there are 0 real solutions.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const x0 = rand(3, 10), a = rand(1, 6); const A = x0 * (x0 + a);
        const decoys = [x0 + 1, x0 - 1 > 0 ? x0 - 1 : x0 + 2, a, Math.floor(Math.sqrt(A))].filter((v) => v !== x0 && v > 0);
        const { options, correctIndex } = buildMC(x0, decoys);
        return { q: `A rectangle has width x and length (x+${a}). Its area is ${A}. Find x.`, options, correctIndex,
          hint: `Setting up the area equation width × length = area gives a quadratic. Expand, rearrange to equal zero, then solve by factorising. Since x is a width, reject any negative solution.`,
          solution: {
            idea: `Translate the geometric condition into an algebraic equation, rearrange to standard form ax² + bx + c = 0, then solve by factorising and discard solutions that make no physical sense (negative lengths).`,
            steps: [
              `x(x+${a}) = ${A}, so x² + ${a}x - ${A} = 0.`,
              `This factorises to give x = ${x0} (rejecting the negative solution).`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  algebraicProof(d) {
    const tier1 = [
      () => {
        const a = rand(2, 9), b = rand(2, 9);
        const answer = 4 * a * b;
        const decoys = [2 * a * b, a * b, answer + a, answer - b].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Using the identity (a+b)² − (a−b)² = 4ab, find the value when a=${a} and b=${b}.`, options, correctIndex,
          hint: `This is an algebraic identity question. An identity is an equation that is true for absolutely every value you plug in, not just some, so instead of expanding out both brackets by hand every time, you can jump straight to the simplified right-hand side. Just substitute the given numbers into the simplified form and calculate.`,
          solution: {
            scenario: `Find the value of (a+b)² − (a−b)² when a=${a} and b=${b}, using the fact that it always simplifies to 4ab.`,
            idea: `(a+b)² − (a−b)² always simplifies to 4ab for any numbers a and b, this is a known algebraic identity, a statement that is always true, which can be proved by expanding both squares and seeing the other terms cancel. Because it is always true, you do not need to expand the brackets yourself, you can substitute the numbers straight into 4ab instead.`,
            method: [`Substitute the given a and b into 4ab.`, `Multiply the three numbers together.`],
            steps: [`4ab = 4 × ${a} × ${b}.`, `4 × ${a} × ${b} = ${answer}.`],
            check: `Expanding (a+b)² and (a−b)² directly for a=${a}, b=${b} and subtracting also gives ${answer}.`,
          } };
      },
      () => {
        const n = rand(3, 15);
        const val = n * n - n;
        const decoys = [n * n, n, val + 1, val - 1 > 0 ? val - 1 : val + 2].filter((x) => x !== val);
        const { options, correctIndex } = buildMC(val, decoys);
        return { q: `n² − n can be written as n(n−1), the product of two consecutive integers, which is always even. What is n² − n when n=${n}?`, options, correctIndex,
          hint: `This is an always-even proof question. n(n−1) means multiplying a whole number by the whole number just before it, and among any two numbers that sit next to each other like this, one is always even and one is always odd, so their product is always even (an even number times anything is even). Just work out the value with the given n and check it comes out even.`,
          solution: {
            scenario: `Work out n² − n when n=${n}, using the fact that it always equals n(n−1) and is always even.`,
            idea: `n and n−1 are consecutive whole numbers, meaning they sit right next to each other on the number line, and among any two consecutive whole numbers, exactly one of them is even. Multiplying anything by an even number always gives an even result, so n(n−1), which is the same thing as n² − n, is always even, whatever whole number n is.`,
            method: [`Work out n−1.`, `Multiply n by (n−1).`, `Check the result is even.`],
            steps: [`${n} − 1 = ${n - 1}.`, `${n} × ${n - 1} = ${val}.`],
            check: `${val} is even, which fits the rule since one of ${n} and ${n - 1} is always even.`,
          } };
      },
    ];
    const tier2 = [
      () => {
        const n = rand(5, 50);
        const sum = n + (n + 1) + (n + 2);
        const decoys = [3 * n, n * 3 + 2, sum + 1, sum - 3 > 0 ? sum - 3 : sum + 3].filter((x) => x !== sum);
        const { options, correctIndex } = buildMC(sum, decoys);
        return { q: `The sum of three consecutive integers starting at n can be written as 3(n+1), which shows it's always a multiple of 3. What is the sum when n=${n}?`, options, correctIndex,
          hint: `This is an always-a-multiple-of question. Three consecutive integers means three whole numbers in a row, like n, n+1 and n+2. Adding a run of consecutive numbers like this often simplifies neatly, here it always comes out as 3 times something, which is exactly what "a multiple of 3" means. Add the given numbers directly, or use the simplified 3(n+1) shortcut.`,
          solution: {
            scenario: `Find the sum of the three consecutive integers ${n}, ${n + 1} and ${n + 2}.`,
            idea: `Adding n, (n+1) and (n+2) together gives 3n+3, and factoring out the 3 gives 3(n+1). Because the answer is always 3 multiplied by a whole number, it must always be a multiple of 3, whatever whole number n is. Writing an expression in a factored form like 3(n+1) is useful because it proves a property, here being a multiple of 3, instantly, rather than needing to check each case by hand.`,
            method: [`Work out n+1.`, `Multiply by 3.`],
            steps: [`${n} + 1 = ${n + 1}.`, `3 × ${n + 1} = ${sum}.`],
            check: `${sum} ÷ 3 = ${n + 1} exactly, confirming it is a whole multiple of 3.`,
          } };
      },
      () => {
        const n = rand(2, 12);
        const val = (2 * n + 1) * (2 * n + 1);
        const decoys = [2 * n + 1, (2 * n) * (2 * n), val + 1, val - 1].filter((x) => x !== val);
        const { options, correctIndex } = buildMC(val, decoys);
        return { q: `(2n+1)² is always odd, since it expands to 4n²+4n+1. What is (2n+1)² when n=${n}?`, options, correctIndex,
          hint: `This is an always-odd proof question. 2n+1 is a way of writing "an odd number" in general, because 2n is always even (2 times anything) and adding 1 to an even number makes it odd. Squaring an odd number always gives another odd number. Work out 2n+1 with the given n first, then square that result.`,
          solution: {
            scenario: `Work out (2n+1)² when n=${n}, using the fact that this is always odd.`,
            idea: `2n is always even because it is 2 multiplied by a whole number, so 2n+1 is always odd, one more than an even number. Multiplying an odd number by itself always gives an odd answer, so (2n+1)² is always odd for any whole number n. Expanding the brackets gives 4n²+4n+1, another way to see the same thing, since 4n²+4n is always even (everything in it is a multiple of 2) and adding 1 makes the whole thing odd.`,
            method: [`Work out 2n+1 using the given n.`, `Square that number.`],
            steps: [`2 × ${n} + 1 = ${2 * n + 1}.`, `${2 * n + 1}² = ${val}.`],
            check: `${val} is odd, which fits since 2n+1 is always odd and an odd number squared stays odd.`,
          } };
      },
    ];
    const tier3 = [
      () => {
        const a = rand(6, 20), b = rand(1, 5);
        if (a === b) return null;
        const answer = a * a - b * b;
        const decoys = [(a - b) * (a - b), (a + b) * (a + b), a * a, answer + 2 * b].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Using a² − b² = (a−b)(a+b), find a² − b² when a=${a} and b=${b}.`, options, correctIndex,
          hint: `This is a difference of two squares question. Whenever you have one square number minus another (a² − b²), it always factorises neatly into (a−b) multiplied by (a+b), because the cross terms cancel when that bracket pair is multiplied out. This means you can work out a² − b² either by squaring and subtracting, or by using the factorised shortcut, both give the same answer.`,
          solution: {
            scenario: `Find a² − b² when a=${a} and b=${b}, using the fact that it factorises as (a−b)(a+b).`,
            idea: `a² − b² always equals (a−b)(a+b), this is called the difference of two squares. It works because multiplying out (a−b)(a+b) gives a² + ab − ab − b², and the two middle terms cancel, leaving a² − b². Using the factorised form (a−b)(a+b) is often a quicker way to calculate a² − b² than squaring both numbers separately.`,
            method: [`Work out a−b.`, `Work out a+b.`, `Multiply those two results together.`],
            steps: [`${a} − ${b} = ${a - b}.`, `${a} + ${b} = ${a + b}.`, `${a - b} × ${a + b} = ${answer}.`],
            check: `Working it out the direct way, ${a}² − ${b}² = ${a * a} − ${b * b} = ${answer} too, the same answer both ways.`,
          } };
      },
    ];
    const tier4 = [
      () => {
        const answer = `4n²`;
        const decoys = [`2n²`, `4n`, `(4n)²`, `n²+4`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Which expression represents "four times the square of a number n"?`, options, correctIndex,
          hint: `This is a translate words into algebra question. Break the phrase into its separate pieces: "the square of a number n" means n multiplied by itself, written n², and "four times" that means multiplying the whole thing by 4. Build the expression up piece by piece rather than guessing which option looks right.`,
          solution: {
            scenario: `Find the algebraic expression that means "four times the square of a number n".`,
            idea: `To turn a wordy description into algebra, deal with one instruction at a time, working from the inside out. "The square of a number n" is the number multiplied by itself, written n². "Four times" something means multiplying that whole thing by 4. Putting them together, "four times the square of n" becomes 4 × n², written 4n².`,
            method: [`Write "the square of n" as n².`, `Multiply that by 4.`],
            steps: [`"The square of n" is n².`, `"Four times" that gives 4 × n² = 4n².`],
            check: `Testing n=2: 4n² = 4×4 = 16, which matches "four times the square of 2" worked out directly (2 squared is 4, four times that is 16).`,
          } };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[1]();
  },
  functionsAndIteration(d) {
    const tier1 = [
      () => {
        const a = pick([2, 3]), b = rand(-5, 5), c = pick([2, 3]), dd = rand(-5, 5), x0 = rand(1, 6);
        const gx = c * x0 + dd; const answer = a * gx + b;
        const decoys = [c * x0 + dd, a * x0 + b, answer + a, answer - c].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `f(x) = ${a}x${b >= 0 ? "+" : ""}${b}, g(x) = ${c}x${dd >= 0 ? "+" : ""}${dd}. Find fg(${x0}) (apply g first, then f).`, options, correctIndex,
          hint: `This is a composite function question. fg(x) means apply g to x first, then take that result and apply f to it, working from the inside out, like unwrapping a parcel one layer at a time. Never apply f first here, the order the letters are written in (fg, not gf) tells you which function goes first.`,
          solution: {
            scenario: `f(x) = ${a}x${b >= 0 ? "+" : ""}${b} and g(x) = ${c}x${dd >= 0 ? "+" : ""}${dd}. Find fg(${x0}), meaning apply g to ${x0} first, then apply f to that result.`,
            idea: `fg(x) means "do g first, then do f to whatever g gives you". You work from the innermost function outward: first substitute x into g(x) to get a number, then substitute THAT number into f(x). This is different from gf(x), which would mean doing f first instead, so the order the letters are written in matters.`,
            method: [`Substitute the given x into g(x) first.`, `Take that result and substitute it into f(x).`],
            steps: [`g(${x0}) = ${c}×${x0}${dd >= 0 ? "+" : ""}${dd} = ${gx}.`, `f(${gx}) = ${a}×${gx}${b >= 0 ? "+" : ""}${b} = ${answer}.`],
            check: `This answer should not generally match gf(${x0}), applying f first and then g, since composite functions usually give different results depending on the order they are applied in.`,
          } };
      },
      () => {
        const x0 = rand(2, 10); const op1 = pick(["+3", "×2", "−4", "×3"]);
        function apply(op, x) { if (op === "+3") return x + 3; if (op === "×2") return x * 2; if (op === "−4") return x - 4; if (op === "×3") return x * 3; if (op === "+5") return x + 5; if (op === "−1") return x - 1; if (op === "+2") return x + 2; }
        const op2 = pick(["+5", "×2", "−1", "+2"]);
        const mid = apply(op1, x0); const answer = apply(op2, mid);
        const decoys = [mid, apply(op1, answer), answer + 1, answer - 1].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `A number machine takes x=${x0}, applies "${op1}" then "${op2}". What is the output?`, options, correctIndex,
          hint: `This is a number machine (function machine) question. A number machine takes a starting number and does one operation to it, then passes the result into the next operation, in the exact order given. Apply the first instruction to get a middle value, then apply the second instruction to that middle value, not back to the original starting number.`,
          solution: {
            scenario: `A number machine starts with x=${x0}, applies "${op1}", then applies "${op2}" to whatever that gives. Find the final output.`,
            idea: `A number machine applies its instructions one after another in order, each one working on the OUTPUT of the previous one, not on the original starting number again. So to find the final output, apply the first instruction to the starting number to get a middle result, then apply the second instruction to that middle result.`,
            method: [`Apply the first instruction to the starting number.`, `Apply the second instruction to that result.`],
            steps: [`${x0} ${op1} = ${mid}.`, `${mid} ${op2} = ${answer}.`],
            check: `The final answer ${answer} came from applying the second instruction to ${mid}, not back to the original ${x0}, which is the key thing to get right here.`,
          } };
      },
    ];
    const tier2 = [
      () => {
        const a = pick([2, 3, 4]), b = rand(-6, 6); const x0 = rand(-5, 10); const y0 = a * x0 + b;
        const decoys = [y0, x0 + a, x0 - a, x0 + 1].filter((v) => v !== x0);
        const { options, correctIndex } = buildMC(x0, decoys);
        return { q: `f(x) = ${a}x${b >= 0 ? "+" : ""}${b}. Find f⁻¹(${y0}).`, options, correctIndex,
          hint: `This is a finding the inverse function question. The inverse function undoes whatever the original function did, so to reverse f(x)=ax+b, which multiplies by a then adds b, you undo those steps in the opposite order: first undo the adding (by subtracting), then undo the multiplying (by dividing). Applying the inverse function to a y-value gets you back the original x-value that produced it.`,
          solution: {
            scenario: `f(x) = ${a}x${b >= 0 ? "+" : ""}${b}. Find f⁻¹(${y0}), the x-value that f would turn into ${y0}.`,
            idea: `f⁻¹, read "f inverse", means the function that reverses f exactly: if f turns x into y, then f⁻¹ turns that same y back into x. To build f⁻¹, undo f's steps in reverse order: since f(x)=ax+b first multiplies by a then adds b, to undo it you first subtract b, then divide by a.`,
            method: [`Subtract b from the given y-value.`, `Divide the result by a.`],
            steps: [`${y0} − (${b}) = ${y0 - b}.`, `${y0 - b} ÷ ${a} = ${x0}.`],
            check: `Putting ${x0} back into the original f(x)=${a}x${b >= 0 ? "+" : ""}${b} gives ${a}×${x0}${b >= 0 ? "+" : ""}${b} = ${y0} again, confirming the answer.`,
          } };
      },
      () => {
        const a = pick([2, 3, 4, 5]), b = rand(-8, 8); const x0 = rand(-5, 10); const target = a * x0 + b;
        const decoys = [target, x0 + 1, x0 - 1, x0 + a].filter((v) => v !== x0 && Number.isFinite(v));
        const { options, correctIndex } = buildMC(x0, decoys);
        return { q: `f(x) = ${a}x${b >= 0 ? "+" : ""}${b}. Solve f(x) = ${target}.`, options, correctIndex,
          hint: `This is a solve the equation question. f(x) = target means you are told the output and asked to find what input x produced it, so rewrite it as a normal equation (ax+b = target) and rearrange to get x on its own, undoing the multiply and the add just like reversing a number machine.`,
          solution: {
            scenario: `f(x) = ${a}x${b >= 0 ? "+" : ""}${b}. Find the value of x that makes f(x) = ${target}.`,
            idea: `Being asked to "solve f(x) = target" just means finding the x-value that makes the equation true. Write out f(x) in full using its formula, set it equal to the target number, then rearrange step by step, undoing addition first and then undoing multiplication, until x is alone on one side.`,
            method: [`Write the equation ax+b = target using the given numbers.`, `Subtract b from both sides.`, `Divide both sides by a.`],
            steps: [`${a}x${b >= 0 ? "+" : ""}${b} = ${target}.`, `${a}x = ${target} − (${b}) = ${target - b}.`, `x = ${target - b} ÷ ${a} = ${x0}.`],
            check: `Substituting x=${x0} back in gives ${a}×${x0}${b >= 0 ? "+" : ""}${b} = ${target}, which matches, confirming the solution.`,
          } };
      },
    ];
    const tier3 = [
      () => {
        const k = pick([2, 3, 5, 7, 10]); const x0 = pick([1, 2, 3]);
        const x1 = Math.round(((x0 + k / x0) / 2) * 100) / 100;
        const decoys = [x0, k, Math.round((x0 + k) / 2 * 100) / 100, x1 + 1].filter((v) => v !== x1);
        const { options, correctIndex } = buildMC(x1, decoys, (v) => v.toFixed(2));
        return { q: `Using the iteration x_(n+1) = (x_n + ${k}/x_n) / 2 with x_0 = ${x0}, find x_1 (to 2 d.p.).`, options, correctIndex,
          hint: `This is an iteration question. An iteration is a rule that takes your current value and uses it to generate the next one, here written x_(n+1) = (x_n + k/x_n) / 2, meaning "to get the next term, take the current term, add k divided by the current term, then halve the total". Substitute the starting value x_0 into the right-hand side of the rule once to get x_1.`,
          solution: {
            scenario: `Starting from x_0 = ${x0}, use the rule x_(n+1) = (x_n + ${k}/x_n) / 2 once to find x_1.`,
            idea: `The subscript notation x_0, x_1, x_2 just labels successive terms of a sequence: x_0 is the starting value, x_1 is the next one after applying the rule once, x_2 the one after that, and so on. The rule x_(n+1) = (x_n + k/x_n) / 2 tells you exactly how to get from any term to the next one: take that term, add k divided by it, then divide the total by 2. To find x_1, substitute x_0 into the right-hand side.`,
            method: [`Substitute x_0 into the rule in place of x_n.`, `Work out the sum inside the brackets.`, `Halve it to get x_1.`],
            steps: [`Substitute x_0 = ${x0} into the rule: x_1 = (${x0} + ${k}/${x0}) / 2.`, `Working that out gives x_1 = ${x1} (to 2 decimal places).`],
            check: `x_1 should sit somewhere between x_0 (${x0}) and k/x_0 (${(k / x0).toFixed(2)}), since it is their average, and ${x1} does sit between those two.`,
          } };
      },
    ];
    const tier4 = [
      () => {
        const k = pick([2, 3, 5, 6]); const x0 = pick([1, 2]);
        const x1 = Math.round(((x0 + k / x0) / 2) * 100) / 100;
        const x2 = Math.round(((x1 + k / x1) / 2) * 100) / 100;
        const decoys = [x1, k, Math.round((x1 + k) * 100) / 100, x2 + 0.1].filter((v) => v !== x2);
        const { options, correctIndex } = buildMC(x2, decoys, (v) => v.toFixed(2));
        return { q: `Using x_(n+1) = (x_n + ${k}/x_n) / 2 with x_0 = ${x0}, find x_2 (to 2 d.p.) — you'll need x_1 first.`, options, correctIndex,
          hint: `This is an iteration question, using the same rule twice in a row. An iteration is a rule that takes your current term and produces the next one, here written x_(n+1) = (x_n + k/x_n) / 2. You need to apply the rule twice: first use x_0 to find x_1, then use that x_1, not x_0 again, to find x_2, each answer feeding into the next round.`,
          solution: {
            scenario: `Starting from x_0 = ${x0}, use the rule x_(n+1) = (x_n + ${k}/x_n) / 2 twice in a row to find x_2.`,
            idea: `The rule x_(n+1) = (x_n + k/x_n) / 2 tells you how to get from any term to the next one. To reach x_2, you cannot jump straight from x_0, you must first work out x_1 by substituting x_0 into the rule, and then work out x_2 by substituting that new value x_1 into the same rule again.`,
            method: [`Substitute x_0 into the rule to get x_1.`, `Substitute that x_1 into the same rule to get x_2.`],
            steps: [`Substitute x_0 = ${x0} into the rule: x_1 = (${x0} + ${k}/${x0}) / 2 = ${x1} (to 2 decimal places).`, `Now substitute that x_1 = ${x1} into the same rule: x_2 = (${x1} + ${k}/${x1}) / 2 = ${x2} (to 2 decimal places).`],
            check: `x_2 (${x2}) and x_1 (${x1}) should be closer to each other than x_1 was to x_0 (${x0}), since this kind of iteration settles down towards a fixed value the more times you repeat it.`,
          } };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[1]();
  },
  sequencesAndSeries(d) {
    const tier1 = [
      () => {
        const a = pick([1, 2, 3]), b = rand(-4, 4), c = rand(-5, 5); const k = rand(5, 12);
        const answer = a * k * k + b * k + c;
        const decoys = [a * k + b + c, answer + a, answer - b, a * (k + 1) * (k + 1) + b * (k + 1) + c].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `A sequence has nth term ${a}n²${b >= 0 ? "+" : ""}${b}n${c >= 0 ? "+" : ""}${c}. Find the ${k}th term.`, options, correctIndex,
          hint: `This is a substitute into the nth term formula question. The nth term rule tells you how to build any term of the sequence directly from its position number, without listing out all the terms before it, so to find a particular term you just substitute its position number in for n and calculate.`,
          solution: {
            scenario: `A sequence has nth term ${a}n²${b >= 0 ? "+" : ""}${b}n${c >= 0 ? "+" : ""}${c}. Find the ${k}th term.`,
            idea: `A formula for the nth term lets you jump straight to any term of a sequence by putting its position number in place of n, rather than working out every term before it one by one. Here the rule has an n² part, an n part and a constant part, so substitute the given position number in for every n in the formula and work it out following the normal order of operations, powers first, then multiplication, then addition.`,
            method: [`Substitute the given position number for n.`, `Work out the n² term.`, `Work out the n term.`, `Add everything together with the constant.`],
            steps: [`${a} × ${k}² = ${a} × ${k * k} = ${a * k * k}.`, `${b} × ${k} = ${b * k}.`, `${a * k * k} ${b * k >= 0 ? "+" : ""}${b * k} ${c >= 0 ? "+" : ""}${c} = ${answer}.`],
            check: `Since the n² part grows fastest as position increases, the ${k}th term (${answer}) being much bigger than earlier terms would be, is consistent with a positive n² coefficient of ${a}.`,
          } };
      },
      () => {
        const n = rand(8, 30);
        const answer = n * (n + 1) / 2;
        const decoys = [n * n, n * (n - 1) / 2, answer + n, answer - n > 0 ? answer - n : answer + n].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Find the sum 1 + 2 + 3 + ... + ${n}.`, options, correctIndex,
          hint: `This is a sum of consecutive whole numbers question. Adding up every whole number from 1 to n has a shortcut formula, n(n+1)/2, which comes from pairing the first and last numbers, the second and second-last, and so on, each pair adding up to the same total. Using the formula is much faster than adding everything one by one.`,
          solution: {
            scenario: `Add up every whole number from 1 to ${n}.`,
            idea: `To add 1+2+3+...+n, pair up the first number with the last (1 and n), the second with the second-last (2 and n−1), and so on, each pair adds up to exactly n+1. There are about n/2 such pairs, so the total works out as n(n+1)/2. This is the standard formula for the sum of the first n whole numbers.`,
            method: [`Add 1 to n.`, `Multiply by n.`, `Divide by 2.`],
            steps: [`${n} + 1 = ${n + 1}.`, `${n} × ${n + 1} = ${n * (n + 1)}.`, `${n * (n + 1)} ÷ 2 = ${answer}.`],
            check: `The answer should be a bit more than half of n×n = ${n * n}, since n(n+1)/2 is close to n²/2 for larger n, and ${answer} fits that.`,
          } };
      },
    ];
    const tier2 = [
      () => {
        const a1 = rand(1, 6), a2 = rand(1, 8); const seq = [a1, a2];
        for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
        const k = pick([4, 5]);
        const answer = seq[k];
        const decoys = [seq[k - 1], seq[k + 1] || seq[k] + answer, answer + 1, answer - 1 > 0 ? answer - 1 : answer + 2].filter((v) => v !== answer && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        const stepsArr = [`The sequence starts ${a1}, ${a2}.`];
        for (let i = 2; i <= k; i++) stepsArr.push(`Term ${i + 1} = ${seq[i - 1]} + ${seq[i - 2]} = ${seq[i]}.`);
        return { q: `A sequence starts ${a1}, ${a2}, and each term after that is the sum of the two before it. What is the ${k + 1}th term?`, options, correctIndex,
          hint: `This is a term-to-term rule question, specifically a Fibonacci-style sequence. A term-to-term rule tells you how to get the next term using the ones before it, here each new term is the sum of the two terms right before it. Write the sequence out term by term, adding the previous two each time, until you reach the term you need.`,
          solution: {
            scenario: `A sequence starts ${a1}, ${a2}, and each term after that is the sum of the two terms before it. Find the ${k + 1}th term.`,
            idea: `In this kind of sequence, you cannot jump straight to a term using a formula, you have to build the sequence up one term at a time, since each new term depends on the two terms directly before it, add them together to get the next one. Keep going until you reach the position you were asked for.`,
            method: [`Start with the two given terms.`, `Add each pair of neighbouring terms to get the next one.`, `Repeat until you reach the required term.`],
            steps: stepsArr,
            check: `The ${k + 1}th term, ${answer}, equals the two terms directly before it added together: ${seq[k - 1]} + ${seq[k - 2]} = ${answer}.`,
          } };
      },
      () => {
        const a1 = rand(1, 10), diff = rand(2, 6); const n = rand(6, 15);
        const lastTerm = a1 + (n - 1) * diff;
        const sum = n * (a1 + lastTerm) / 2;
        const decoys = [n * a1, sum + diff, sum - diff, n * lastTerm].filter((v) => v !== sum);
        const { options, correctIndex } = buildMC(sum, decoys);
        return { q: `An arithmetic sequence starts at ${a1} and increases by ${diff} each term. Find the sum of the first ${n} terms.`, options, correctIndex,
          hint: `This is an arithmetic series question. An arithmetic sequence is one where you add the same fixed amount, called the common difference, each time to get the next term. To add up the first several terms of a sequence like this, there is a shortcut: find the last term you need, then use the fact that the sum equals the number of terms times the average of the first and last term.`,
          solution: {
            scenario: `An arithmetic sequence starts at ${a1} and increases by ${diff} each term. Find the sum of its first ${n} terms.`,
            idea: `In an arithmetic sequence, since each term increases by the same fixed amount, the terms are evenly spaced. This means the average of the first and last term you are adding equals the average of ALL the terms in between too, so the total sum is just (number of terms) × (average of first and last term). Written as a formula, sum = n(a+l)/2, where a is the first term, l is the last term and n is how many terms there are.`,
            method: [`Work out the last (nth) term using the first term and common difference.`, `Add the first and last term together.`, `Multiply by the number of terms.`, `Divide by 2.`],
            steps: [`The ${n}th term = ${a1} + (${n}−1)×${diff} = ${a1} + ${(n - 1) * diff} = ${lastTerm}.`, `${a1} + ${lastTerm} = ${a1 + lastTerm}.`, `${n} × ${a1 + lastTerm} = ${n * (a1 + lastTerm)}.`, `${n * (a1 + lastTerm)} ÷ 2 = ${sum}.`],
            check: `The average term size is (${a1}+${lastTerm})/2 = ${(a1 + lastTerm) / 2}, and multiplying that by ${n} terms gives ${sum} again.`,
          } };
      },
    ];
    const tier3 = [
      () => {
        const a1 = pick([1, 2, 3]), r = pick([2, 3]); const n = rand(4, 7);
        const answer = a1 * Math.pow(r, n - 1);
        const decoys = [a1 * r * n, answer * r, answer / r, answer + a1].filter((v) => v !== answer && Number.isFinite(v));
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `A geometric sequence starts at ${a1} with common ratio ${r}. Find the ${n}th term.`, options, correctIndex,
          hint: `This is a geometric sequence question. In a geometric sequence, instead of adding a fixed amount each time, you multiply by a fixed amount, called the common ratio, to get the next term. To jump straight to a particular term without listing them all, use the rule: nth term = first term × (common ratio) raised to the power of (position minus 1).`,
          solution: {
            scenario: `A geometric sequence starts at ${a1} with common ratio ${r}. Find its ${n}th term.`,
            idea: `A geometric sequence multiplies by the same common ratio r every time to get the next term, so the 1st term is a, the 2nd is a×r, the 3rd is a×r×r = a×r², and in general the nth term is a×r^(n−1), one fewer power of r than the term number, since the first term uses no multiplying at all. This formula lets you jump straight to any term.`,
            method: [`Work out how many times to multiply by r (that's n−1 times).`, `Raise r to that power.`, `Multiply by the first term a.`],
            steps: [`n−1 = ${n}−1 = ${n - 1}.`, `${r}^${n - 1} = ${Math.pow(r, n - 1)}.`, `${a1} × ${Math.pow(r, n - 1)} = ${answer}.`],
            check: `Listing the first few terms (${a1}, ${a1 * r}, ${a1 * r * r}, ...) and continuing the pattern of multiplying by ${r} each time reaches ${answer} by the ${n}th term.`,
          } };
      },
    ];
    const tier4 = [
      () => {
        const a1 = rand(2, 10), diff = rand(3, 8); const terms = [a1, a1 + diff, a1 + 2 * diff, a1 + 3 * diff];
        const nthCoef = diff; const nthConst = a1 - diff;
        const decoys = [a1, diff + 1, nthConst + 1, nthCoef + nthConst].filter((v) => v !== nthCoef);
        const { options, correctIndex } = buildMC(nthCoef, decoys);
        return { q: `A sequence begins ${terms.join(", ")}, ... Its nth term is (coefficient)n + (constant). What is the coefficient of n?`, options, correctIndex,
          hint: `This is a finding the nth term rule question. For an arithmetic sequence, one with a constant common difference between terms, the nth term always has the form (common difference)×n + (a constant adjustment), so the coefficient of n, the number multiplying n, in that rule is always just the common difference between consecutive terms.`,
          solution: {
            scenario: `A sequence begins ${terms.join(", ")}, and its nth term has the form (coefficient)n + (constant). Find the coefficient of n.`,
            idea: `For any arithmetic sequence, the nth term rule looks like dn + c, where d is the common difference, how much each term goes up by, and c is a constant that shifts it to match the actual first term. The coefficient of n, the number in front of n, is always exactly equal to the common difference, so you do not need to work out c at all to answer this, just find the gap between consecutive terms.`,
            method: [`Find the difference between consecutive terms.`, `That difference is the coefficient of n.`],
            steps: [`The gap between each term is ${terms[1]} − ${terms[0]} = ${diff}.`, `So the coefficient of n is ${diff}.`],
            check: `Checking another pair of consecutive terms gives the same gap, ${terms[2]} − ${terms[1]} = ${diff}, confirming it is constant as required for an arithmetic sequence.`,
          } };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[1]();
  },
  graphsAndRatesOfChange(d) {
    const tier1 = [
      () => {
        const m = pick([2, 3, -2, 4]); const c = rand(-8, 8);
        const decoys = [m, -c, c + m, c - 1].filter((v) => v !== c);
        const { options, correctIndex } = buildMC(c, decoys);
        return { q: `A line has equation y = ${m}x ${c >= 0 ? "+" : ""}${c}. What is its y-intercept?`, options, correctIndex,
          hint: `This is a reading off the y-intercept question. The y-intercept is the point where a line crosses the vertical y-axis, which always happens where x=0. When a line's equation is written as y = mx + c, the y-intercept is simply the constant number c on its own, no calculation needed, just read it straight off the equation.`,
          solution: {
            scenario: `A line has equation y = ${m}x ${c >= 0 ? "+" : ""}${c}. Find where it crosses the y-axis.`,
            idea: `Any straight line written in the form y = mx + c crosses the y-axis exactly where x = 0. Substituting x=0 into y = mx + c gives y = m×0 + c = c, so the y-intercept is always just the constant term c, you can read it directly from the equation without doing any working.`,
            method: [`Identify the constant term in the equation.`, `That number is the y-intercept.`],
            steps: [`Setting x=0 in y = ${m}x ${c >= 0 ? "+" : ""}${c} gives y = ${m}×0 ${c >= 0 ? "+" : ""}${c} = ${c}.`],
            check: `The y-intercept is just the constant on its own, with no x attached, which ${c} is.`,
          } };
      },
      () => {
        const m = pick([2, 3, -2, 5]); const c = rand(-5, 5); const x0 = rand(-5, 10);
        const y0 = m * x0 + c;
        const decoys = [x0, y0 + m, y0 - m, m * x0].filter((v) => v !== y0);
        const { options, correctIndex } = buildMC(y0, decoys);
        return { q: `On the line y = ${m}x ${c >= 0 ? "+" : ""}${c}, what is y when x=${x0}?`, options, correctIndex,
          hint: `This is a substitute into a linear equation question. To find the y-value at a particular point on a line, substitute the given x-value into the equation and work it out following the normal order of operations, multiply first, then add or subtract the constant.`,
          solution: {
            scenario: `On the line y = ${m}x ${c >= 0 ? "+" : ""}${c}, find y when x=${x0}.`,
            idea: `A straight line's equation y = mx + c tells you how to get y from any x-value: multiply x by the gradient m, then add the constant c. To find y at a specific x, substitute that x-value into the equation.`,
            method: [`Substitute the given x-value into the equation.`, `Multiply by the gradient.`, `Add the constant.`],
            steps: [`y = ${m} × ${x0} ${c >= 0 ? "+" : ""}${c}.`, `${m} × ${x0} = ${m * x0}.`, `${m * x0} ${c >= 0 ? "+" : ""}${c} = ${y0}.`],
            check: `${y0} sits exactly ${c} away from ${m}×${x0}=${m * x0}, in the direction the sign of c points, which matches.`,
          } };
      },
    ];
    const tier2 = [
      () => {
        const x1 = rand(-5, 5), y1 = rand(-5, 5); const x2 = rand(-5, 5);
        if (x1 === x2) return null;
        const m = pick([2, 3, -2, -3, 4]);
        const y2 = y1 + m * (x2 - x1);
        const decoys = [-m, m + 1, m - 1, m + 2].filter((v) => v !== m);
        const { options, correctIndex } = buildMC(m, decoys);
        return { q: `Find the gradient of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`, options, correctIndex,
          hint: `This is a finding the gradient between two points question. The gradient of a line measures how steep it is, worked out as how much y changes divided by how much x changes between any two points on the line. Take the two y-values, find their difference, then divide by the difference between the matching x-values, keeping a consistent order, second point minus first point on both top and bottom.`,
          solution: {
            scenario: `Find the gradient of the straight line that passes through (${x1}, ${y1}) and (${x2}, ${y2}).`,
            idea: `The gradient between two points measures "rise over run", how far up or down the line goes divided by how far along it goes. If the two points are (x1,y1) and (x2,y2), the gradient is (y2−y1) divided by (x2−x1). It is important to subtract in the same order on the top and bottom, always second point minus first point, or always first minus second, but not mixed, otherwise the sign comes out wrong.`,
            method: [`Subtract the y-coordinates (second minus first).`, `Subtract the x-coordinates (second minus first, in the same order).`, `Divide the two differences.`],
            steps: [`${y2} − ${y1} = ${y2 - y1}.`, `${x2} − ${x1} = ${x2 - x1}.`, `${y2 - y1} ÷ ${x2 - x1} = ${m}.`],
            check: `Moving from x=${x1} to x=${x2} is a change of ${x2 - x1}, and multiplying that by the gradient ${m} gives back the change in y, ${x2 - x1} × ${m} = ${(x2 - x1) * m}, which matches ${y2} − ${y1}.`,
          } };
      },
      () => {
        const a = pick([1, 2, -1]), b = rand(-6, 6), c = rand(-8, 8);
        const decoys = [b, -c, c + 1, a].filter((v) => v !== c);
        const { options, correctIndex } = buildMC(c, decoys);
        return { q: `The graph of y = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} crosses the y-axis at what value?`, options, correctIndex,
          hint: `This is a reading off the y-intercept of a curve question. Just like with straight lines, the y-intercept of any graph is where it crosses the y-axis, which happens at x=0. Substitute x=0 into the equation, every term with an x in it disappears, since anything times 0 is 0, leaving just the constant term.`,
          solution: {
            scenario: `Find where the curve y = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} crosses the y-axis.`,
            idea: `For any equation, substituting x=0 finds where the graph crosses the y-axis, because that is exactly what x=0 means on this axis. When x=0, every term containing x, like the x² term and the x term here, becomes 0, since multiplying by 0 always gives 0, leaving only the constant term as the answer.`,
            method: [`Substitute x=0 into the equation.`, `Every term containing x becomes 0.`, `The constant term left over is the y-intercept.`],
            steps: [`Setting x=0: y = ${a}×0² ${b >= 0 ? "+" : ""}${b}×0 ${c >= 0 ? "+" : ""}${c}.`, `Both x-terms become 0, leaving y = ${c}.`],
            check: `The y-intercept is just the constant term on its own, with no x attached, which ${c} is, exactly like with a straight line.`,
          } };
      },
    ];
    const tier3 = [
      () => {
        const v1 = pick([10, 20]), v2 = v1 + pick([10, 20]); const t1 = pick([2, 3, 4]);
        const dist = 0.5 * (v1 + v2) * t1;
        const decoys = [v2 * t1, v1 * t1, dist + t1, dist - t1 > 0 ? dist - t1 : dist + t1].filter((v) => v !== dist && Number.isFinite(v));
        const { options, correctIndex } = buildMC(dist, decoys);
        return { q: `A velocity-time graph shows speed increasing steadily from ${v1} m/s to ${v2} m/s over ${t1} seconds. What distance is travelled (the area under the graph)?`, options, correctIndex,
          hint: `This is an area under a velocity-time graph question. On a graph of speed against time, the distance travelled is given by the area of the shape under the line, not by reading a single value off the graph. When speed increases steadily from one value to another, the shape under the graph is a trapezium, a four-sided shape with two parallel sides, whose area is found by averaging the two speeds and multiplying by the time.`,
          solution: {
            scenario: `Speed increases steadily from ${v1} m/s to ${v2} m/s over ${t1} seconds. Find the distance travelled.`,
            idea: `On a velocity-time graph, speed plotted against time, the AREA underneath the line, not any single point on it, represents the total distance travelled. When the speed rises steadily in a straight line from one value to another, the region underneath forms a trapezium, a shape with two parallel sides of different lengths, here the two speeds, and a width equal to the time taken. The area of a trapezium is the average of the two parallel sides multiplied by the width between them, so here that is the average of the two speeds multiplied by the time.`,
            method: [`Add the starting and finishing speeds together.`, `Halve that to get the average speed.`, `Multiply by the time taken.`],
            steps: [`${v1} + ${v2} = ${v1 + v2}.`, `${v1 + v2} ÷ 2 = ${(v1 + v2) / 2}.`, `${(v1 + v2) / 2} × ${t1} = ${dist}.`],
            check: `The distance sits between what it would have been at a constant ${v1} m/s the whole time (${v1 * t1} m) and at a constant ${v2} m/s the whole time (${v2 * t1} m), which makes sense since the real speed was rising steadily between the two, and ${dist} does sit between those two bounds.`,
          } };
      },
    ];
    const tier4 = [
      () => {
        const a = pick([1, 2]), x1 = rand(1, 5); const x2 = x1 + rand(1, 4);
        const y1 = a * x1 * x1, y2 = a * x2 * x2;
        const rate = (y2 - y1) / (x2 - x1);
        const decoys = [a * (x1 + x2), y2 - y1, rate + 1, rate - 1].filter((v) => v !== rate && Number.isFinite(v));
        const { options, correctIndex } = buildMC(rate, decoys);
        return { q: `For y = ${a}x², find the average rate of change between x=${x1} and x=${x2}.`, options, correctIndex,
          hint: `This is an average rate of change question. The average rate of change between two points on a curve tells you, on average, how much y changes for each step of x, worked out the same way as a gradient: the change in y divided by the change in x between those two points. Because the graph is curved rather than a straight line, this average rate is only exact between those two specific points, not the whole curve.`,
          solution: {
            scenario: `For the curve y = ${a}x², find the average rate of change between x=${x1} and x=${x2}.`,
            idea: `For a curve, the rate of change is not constant everywhere, unlike a straight line, so the AVERAGE rate of change between two points measures the overall steepness over that stretch: work out y at each of the two x-values, find how much y changed, and divide by how much x changed, exactly like a gradient calculation but between two points on a curve instead of a straight line.`,
            method: [`Work out y at the first x-value.`, `Work out y at the second x-value.`, `Find the difference between the two y-values.`, `Divide by the difference between the two x-values.`],
            steps: [`y(${x1}) = ${a}×${x1}² = ${y1}.`, `y(${x2}) = ${a}×${x2}² = ${y2}.`, `${y2} − ${y1} = ${y2 - y1}.`, `${y2 - y1} ÷ (${x2}−${x1}) = ${rate}.`],
            check: `Since the curve gets steeper as x increases (it is ${a}x²), this average rate should sit somewhere between the actual steepness right at x=${x1} and the steeper value right at x=${x2}, which fits with the curve speeding up over that stretch.`,
          } };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  circleTheoremsAndTangents(d) {
    const cx = 140, cy = 110, R = 80;
    const ptOnCircle = (angDeg) => { const a = (angDeg * Math.PI) / 180; return [cx + R * Math.cos(a), cy - R * Math.sin(a)]; };
    const tier1 = [
      () => {
        const given = pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65]);
        const angleB = 90 - given;
        const [ax, ay] = ptOnCircle(180), [bx, by] = ptOnCircle(0), [cxp, cyp] = ptOnCircle(2 * given);
        const decoys = [given, 90 + given, 180 - given, angleB + 10].filter((v) => v !== angleB);
        const { options, correctIndex } = buildMC(angleB, decoys, deg);
        const svg = svgBox(
          SC(cx, cy, R, "#2a1a5e", 1.5) +
          SL(ax, ay, bx, by, "#7c5cff", 2) +
          SL(ax, ay, cxp, cyp, "#2a1a5e", 2) + SL(bx, by, cxp, cyp, "#2a1a5e", 2) +
          ST(ax - 14, ay + 4, "A", undefined, 12) + ST(bx + 14, by + 4, "B", undefined, 12) + ST(cxp, cyp - 12, "C", undefined, 12) +
          ST(ax + 34, ay - 6, `${given}°`, undefined, 12, "#ff5d8f", 700) +
          ST(cxp - 6, cyp + 22, "90°", undefined, 12, "#22c8b8", 700),
          280, 220
        );
        return {
          q: `AB is a diameter of the circle, and C is a point on the circle. Angle CAB = ${given}°. Find angle CBA.`,
          options, correctIndex, svg,
          hint: `This is a circle theorem question, specifically the angle in a semicircle rule. A diameter is a straight line through the centre of a circle, joining two points on opposite sides, it's the longest possible straight line you can draw inside a circle. Whenever a triangle is drawn using a diameter as one side, with its third corner anywhere else on the circle, the angle at that third corner is always exactly a right angle (90°). Once you know one angle in a triangle is 90°, use the fact that a triangle's three angles always add up to 180° to find the missing one.`,
          solution: {
            scenario: `AB is a diameter of a circle (a straight line through the centre joining two opposite points), and C is a point on the circle. Angle CAB = ${given}°. Find angle CBA.`,
            idea: `Whenever a triangle sits inside a circle with one side being a diameter, and its third point anywhere else on the circle, the angle at that third point is always a right angle, exactly 90°. This is called the angle in a semicircle rule, semicircle meaning half a circle, because the diameter cuts the circle exactly in half. This is written in maths shorthand as angle ACB = 90°, meaning the angle at corner C, between the lines CA and CB, is a right angle. Once one angle of the triangle is known to be 90°, the other two must add up to 180° − 90° = 90°, since every triangle's three angles always add up to 180°.`,
            method: [
              "Use the angle in a semicircle rule to find angle ACB.",
              "Use the fact that a triangle's angles sum to 180° to find angle CBA.",
            ],
            steps: [
              `Since AB is a diameter and C lies on the circle, angle ACB = 90° (the angle in a semicircle rule).`,
              `Add the two known angles of the triangle: 90° + ${given}° = ${90 + given}°.`,
              `Subtract this from 180°, since the three angles of a triangle always add up to 180°: 180° − ${90 + given}° = ${angleB}°.`,
            ],
            check: `Check: 90° + ${given}° + ${angleB}° = ${90 + given + angleB}°, confirming the three angles of the triangle add up correctly to 180°.`,
          },
        };
      },
      () => {
        const centreAngle = pick([40, 60, 70, 80, 90, 100, 110, 120, 130, 140]);
        const circAngle = centreAngle / 2;
        const askCentre = pick([true, false]);
        const answer = askCentre ? centreAngle : circAngle;
        const given = askCentre ? circAngle : centreAngle;
        const [px, py] = ptOnCircle(90 + centreAngle / 2), [qx, qy] = ptOnCircle(90 - centreAngle / 2), [rx, ry] = ptOnCircle(270);
        const decoys = [given, answer * 2, answer + 10, answer - 10 > 0 ? answer - 10 : answer + 20].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys, deg);
        const svg = svgBox(
          SC(cx, cy, R, "#2a1a5e", 1.5) +
          SL(cx, cy, px, py, "#7c5cff", 2) + SL(cx, cy, qx, qy, "#7c5cff", 2) +
          SL(rx, ry, px, py, "#2a1a5e", 2) + SL(rx, ry, qx, qy, "#2a1a5e", 2) +
          ST(cx - 14, cy + 4, "O", undefined, 12) + ST(px, py - 10, "P", undefined, 12) + ST(qx, qy - 10, "Q", undefined, 12) + ST(rx, ry + 16, "R", undefined, 12) +
          ST(cx, cy - 34, askCentre ? "?" : `${centreAngle}°`, undefined, 12, "#ff5d8f", 700) +
          ST(rx, ry - 16, askCentre ? `${circAngle}°` : "?", undefined, 12, "#22c8b8", 700),
          280, 220
        );
        return {
          q: `O is the centre of the circle. P, Q and R are points on the circle. ${askCentre ? `Angle PRQ = ${circAngle}°. Find angle POQ.` : `Angle POQ = ${centreAngle}°. Find angle PRQ.`}`,
          options, correctIndex, svg,
          hint: `This is a circle theorem question, specifically the angle at the centre rule. O is the centre of the circle. Whenever an angle at the centre and an angle at the edge (the circumference) of a circle are drawn using the same two other points on the circle, and both angles are on the same side of the line joining those two points, the angle at the centre is always exactly double the angle at the edge. So depending which one you're given, you either double it or halve it to find the other.`,
          solution: {
            scenario: askCentre
              ? `O is the centre of a circle, and P, Q, R are points on the circle. Angle PRQ (at the edge of the circle) = ${circAngle}°. Find angle POQ (at the centre).`
              : `O is the centre of a circle, and P, Q, R are points on the circle. Angle POQ (at the centre) = ${centreAngle}°. Find angle PRQ (at the edge of the circle).`,
            idea: `The angle made at the centre of a circle by two points P and Q is always exactly twice the angle made at the edge of the circle by the same two points, as long as both angles sit on the same side of the line PQ (this is described as both angles 'standing on the same arc'). This is written in maths as angle POQ = 2 × angle PRQ, meaning the centre angle is double the circumference angle, or rearranged, the circumference angle is half the centre angle.`,
            method: askCentre
              ? ["Take the angle at the circumference.", "Double it to get the angle at the centre."]
              : ["Take the angle at the centre.", "Halve it to get the angle at the circumference."],
            steps: askCentre
              ? [
                  `The angle at the circumference is angle PRQ = ${circAngle}°.`,
                  `Double it, since the angle at the centre is twice the angle at the circumference: 2 × ${circAngle}° = ${answer}°.`,
                ]
              : [
                  `The angle at the centre is angle POQ = ${centreAngle}°.`,
                  `Halve it, since the angle at the circumference is half the angle at the centre: ${centreAngle}° ÷ 2 = ${answer}°.`,
                ],
            check: askCentre
              ? `Check: half of ${answer}° is ${answer / 2}°, which matches the circumference angle of ${circAngle}° we started with.`
              : `Check: double ${answer}° is ${answer * 2}°, which matches the centre angle of ${centreAngle}° we started with.`,
          },
        };
      },
    ];
    const tier2 = [
      () => {
        const p = pick([65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115]);
        const r = 180 - p;
        const decoys = [p, r + 10, r - 10 > 0 ? r - 10 : r + 20, 360 - p - r].filter((v) => v !== r);
        const { options, correctIndex } = buildMC(r, decoys, deg);
        const [px, py] = ptOnCircle(150), [qx, qy] = ptOnCircle(70), [rx, ry] = ptOnCircle(-20), [sx, sy] = ptOnCircle(-100);
        const svg = svgBox(
          SC(cx, cy, R, "#2a1a5e", 1.5) +
          `<polygon points="${px},${py} ${qx},${qy} ${rx},${ry} ${sx},${sy}" fill="none" stroke="#7c5cff" stroke-width="2.5"/>` +
          ST(px - 12, py - 4, "P", undefined, 12) + ST(qx + 12, qy - 4, "Q", undefined, 12) + ST(rx + 12, ry + 12, "R", undefined, 12) + ST(sx - 12, sy + 12, "S", undefined, 12) +
          ST(px + 8, py + 18, `${p}°`, undefined, 12, "#ff5d8f", 700) +
          ST(rx - 20, ry - 6, "?", undefined, 13, "#22c8b8", 700),
          280, 220
        );
        return {
          q: `PQRS is a cyclic quadrilateral (all four vertices lie on the circle). Angle P = ${p}°. Find angle R.`,
          options, correctIndex, svg,
          hint: `This is a circle theorem question, specifically the cyclic quadrilateral rule. A cyclic quadrilateral is a four-sided shape whose four corners all touch the same circle ('cyclic' just means 'sitting on a circle'). For any cyclic quadrilateral, each pair of OPPOSITE angles (the two angles that don't share a side) always adds up to 180°. So once you know one angle, subtract it from 180° to find the one directly opposite it.`,
          solution: {
            scenario: `PQRS is a four-sided shape with all four corners on the same circle (a cyclic quadrilateral). Angle P = ${p}°. Find angle R, the angle opposite it.`,
            idea: `In any cyclic quadrilateral (a four-sided shape with every corner touching the same circle), each pair of opposite angles always adds up to 180°. Opposite angles are the two that don't share a side, in quadrilateral PQRS, angle P is opposite angle R, and angle Q is opposite angle S. This is written in maths as angle P + angle R = 180°, meaning if you know one you can always find the other by subtracting from 180°.`,
            method: [
              "Identify which angle is opposite the given one.",
              "Subtract the given angle from 180° to find it.",
            ],
            steps: [
              `Angle R is opposite angle P in the cyclic quadrilateral PQRS.`,
              `Subtract from 180°: 180° − ${p}° = ${r}°.`,
            ],
            check: `Check: ${p}° + ${r}° = ${p + r}°, confirming the opposite angles add up correctly to 180°.`,
          },
        };
      },
      () => {
        const angA = pick([20, 25, 30, 35, 40, 45, 50, 55]);
        const angO = 90 - angA;
        const [tx, ty] = ptOnCircle(0), [ax, ay] = [cx + R + 70, cy + 60];
        const decoys = [angA, 90 + angA, angO + 10, angO - 10 > 0 ? angO - 10 : angO + 20].filter((v) => v !== angO);
        const { options, correctIndex } = buildMC(angO, decoys, deg);
        const svg = svgBox(
          SC(cx, cy, R, "#2a1a5e", 1.5) +
          SL(cx, cy, tx, ty, "#7c5cff", 2) + SL(tx, ty, ax, ay, "#2a1a5e", 2) + SL(cx, cy, ax, ay, "#c9bff0", 1.5) +
          ST(cx - 14, cy + 4, "O", undefined, 12) + ST(tx + 4, ty - 12, "T", undefined, 12) + ST(ax + 10, ay + 4, "A", undefined, 12) +
          `<rect x="${tx - 14}" y="${ty - 14}" width="14" height="14" fill="none" stroke="#2a1a5e" stroke-width="1.5"/>` +
          ST(ax - 30, ay - 10, `${angA}°`, undefined, 12, "#ff5d8f", 700) +
          ST(cx + 30, cy + 30, "?", undefined, 13, "#22c8b8", 700),
          320, 240
        );
        return {
          q: `TA is a tangent to the circle at T, and O is the centre. Angle TAO = ${angA}°. Find angle TOA.`,
          options, correctIndex, svg,
          hint: `This is a circle theorem question, specifically the tangent rule. A tangent is a straight line that touches a circle at exactly one point without crossing into it, like a ruler balanced on the edge of a coin. Wherever a tangent touches a circle, it always meets the radius drawn to that point at a right angle (90°), a radius being a straight line from the centre of the circle out to a point on its edge. Once you know one angle in a triangle is 90°, use the fact that a triangle's angles sum to 180° to find the third.`,
          solution: {
            scenario: `TA is a tangent to a circle at point T (a line that just touches the circle at T without crossing it), and O is the centre. Angle TAO = ${angA}°. Find angle TOA.`,
            idea: `A tangent line always meets the radius drawn to the point of contact at a right angle, exactly 90°. Here OT is a radius (from the centre O to the point T where the tangent touches), so angle OTA = 90°. Once one angle of triangle OTA is known to be 90°, the other two angles must add up to 180° − 90° = 90°, since every triangle's angles sum to 180°.`,
            method: [
              "Use the tangent-radius rule to find angle OTA.",
              "Use the triangle angle sum to find angle TOA.",
            ],
            steps: [
              `Since TA is a tangent at T and OT is a radius, angle OTA = 90° (a tangent always meets its radius at a right angle).`,
              `Add the two known angles: 90° + ${angA}° = ${90 + angA}°.`,
              `Subtract from 180°: 180° − ${90 + angA}° = ${angO}°.`,
            ],
            check: `Check: 90° + ${angA}° + ${angO}° = ${90 + angA + angO}°, confirming the three angles of the triangle add up correctly to 180°.`,
          },
        };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  trigonometryAdvanced(d) {
    const rad = Math.PI / 180;
    const tier1 = [
      () => {
        const angle = pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]);
        const hyp = rand(8, 20);
        const wantOpp = pick([true, false]);
        const raw = wantOpp ? hyp * Math.sin(angle * rad) : hyp * Math.cos(angle * rad);
        const other = wantOpp ? hyp * Math.cos(angle * rad) : hyp * Math.sin(angle * rad);
        const answer = Math.round(raw * 10) / 10;
        const decoys = [Math.round(hyp * Math.tan(angle * rad) * 10) / 10, Math.round(other * 10) / 10, answer + 2, answer - 2 > 0 ? answer - 2 : answer + 3].filter((v) => v !== answer && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => x.toFixed(1));
        const targetHyp = 190;
        const adjPix = Math.cos(angle * rad) * targetHyp, oppPix = Math.sin(angle * rad) * targetHyp;
        const x0 = 30, y0 = oppPix + 44;
        const sq = 12;
        const svg = svgBox(
          SL(x0, y0, x0 + adjPix, y0, "#2a1a5e", 2.5) +
          SL(x0 + adjPix, y0, x0 + adjPix, y0 - oppPix, "#2a1a5e", 2.5) +
          SL(x0, y0, x0 + adjPix, y0 - oppPix, "#7c5cff", 3) +
          `<rect x="${x0 + adjPix - sq}" y="${y0 - sq}" width="${sq}" height="${sq}" fill="none" stroke="#2a1a5e" stroke-width="2"/>` +
          ST(x0 + adjPix / 2 - oppPix * 0.12, y0 - oppPix / 2 - 8, `${hyp} cm`, undefined, 14, "#7c5cff", 700) +
          (wantOpp
            ? ST(x0 + adjPix + 26, y0 - oppPix / 2, "? cm", undefined, 16, "#ff5d8f", 800)
            : ST(x0 + adjPix / 2, y0 + 22, "? cm", undefined, 16, "#ff5d8f", 800)) +
          ST(x0 + 28, y0 - 10, `${angle}°`, undefined, 14, "#22c8b8", 700),
          x0 + adjPix + 68, y0 + 28
        );
        return {
          q: `In a right-angled triangle, the hypotenuse is ${hyp} cm and one angle is ${angle}°. Find the side ${wantOpp ? "opposite" : "adjacent to"} that angle (marked "?").`,
          options, correctIndex, svg,
          hint: `This is a right-angled triangle trigonometry question. In a right-angled triangle, once you pick one of the two angles that isn't the right angle, the three sides get special names relative to it: the hypotenuse (the longest side, opposite the right angle), the opposite side (across from the angle you picked), and the adjacent side (next to the angle you picked, but not the hypotenuse). Trigonometry gives fixed ratios connecting these sides to the angle: sine (sin) links the opposite side and the hypotenuse, cosine (cos) links the adjacent side and the hypotenuse, and tangent (tan) links the opposite and adjacent sides. Work out which two sides you have and want, pick the matching ratio, then rearrange to find the missing side.`,
          solution: {
            scenario: `A right-angled triangle has hypotenuse ${hyp} cm and one angle of ${angle}°. Find the side ${wantOpp ? "opposite" : "adjacent to"} that angle.`,
            idea: `In a right-angled triangle, once an angle other than the right angle is chosen, its three sides have names: the hypotenuse (opposite the right angle, always the longest side), the opposite side (across from the chosen angle), and the adjacent side (next to the chosen angle). Three fixed ratios connect an angle to pairs of these sides: sine connects the opposite side and the hypotenuse, cosine connects the adjacent side and the hypotenuse, and tangent connects the opposite and adjacent sides. This is written in maths as sin(angle) = opposite ÷ hypotenuse and cos(angle) = adjacent ÷ hypotenuse, meaning you can rearrange either to find a missing side: ${wantOpp ? "opposite = hypotenuse × sin(angle)" : "adjacent = hypotenuse × cos(angle)"}.`,
            method: wantOpp
              ? ["Identify that the hypotenuse is known and the opposite side is wanted.", "Use opposite = hypotenuse × sin(angle).", "Round the answer to 1 decimal place."]
              : ["Identify that the hypotenuse is known and the adjacent side is wanted.", "Use adjacent = hypotenuse × cos(angle).", "Round the answer to 1 decimal place."],
            steps: wantOpp
              ? [
                  `Multiply the hypotenuse by sin(${angle}°): ${hyp} × sin(${angle}°).`,
                  `sin(${angle}°) ≈ ${Math.sin(angle * rad).toFixed(4)}, so ${hyp} × ${Math.sin(angle * rad).toFixed(4)} ≈ ${raw.toFixed(2)}.`,
                  `Rounded to 1 decimal place, the opposite side is ${answer} cm.`,
                ]
              : [
                  `Multiply the hypotenuse by cos(${angle}°): ${hyp} × cos(${angle}°).`,
                  `cos(${angle}°) ≈ ${Math.cos(angle * rad).toFixed(4)}, so ${hyp} × ${Math.cos(angle * rad).toFixed(4)} ≈ ${raw.toFixed(2)}.`,
                  `Rounded to 1 decimal place, the adjacent side is ${answer} cm.`,
                ],
            check: `Check: ${answer} cm should be shorter than the hypotenuse (${hyp} cm), since in a right-angled triangle the hypotenuse is always the longest side, and it is.`,
          },
        };
      },
    ];
    const tier2 = [
      () => {
        const angleA = pick([30, 35, 40, 45, 50, 55, 60, 65, 70]);
        const pool = [30, 35, 40, 45, 50, 55, 60, 65, 70].filter((a) => a !== angleA && a + angleA < 150);
        const angleB = pool.length ? pick(pool) : 40;
        const a = rand(6, 15);
        const bRaw = (a * Math.sin(angleB * rad)) / Math.sin(angleA * rad);
        const answer = Math.round(bRaw * 10) / 10;
        const decoys = [Math.round(((a * Math.sin(angleA * rad)) / Math.sin(angleB * rad)) * 10) / 10, answer + 2, answer - 2 > 0 ? answer - 2 : answer + 3, Math.round(((a * angleB) / angleA) * 10) / 10].filter((v) => v !== answer && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => x.toFixed(1));
        const svg = svgBox(
          `<polygon points="60,160 220,160 140,50" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          ST(60, 178, "A", undefined, 12) + ST(220, 178, "C", undefined, 12) + ST(140, 38, "B", undefined, 12) +
          ST(85, 150, `${angleA}°`, undefined, 11, "#22c8b8", 700) + ST(195, 150, `${angleB}°`, undefined, 11, "#ff5d8f", 700) +
          ST(140, 148, "? cm", undefined, 12, "#ff6b4a", 700) +
          ST(185, 100, `${a} cm`, undefined, 12, "#7c5cff", 700),
          280, 200
        );
        return {
          q: `In triangle ABC, side BC (opposite angle A) = ${a} cm, angle A = ${angleA}°, angle B = ${angleB}°. Find side AC (opposite angle B, marked "?").`,
          options, correctIndex, svg,
          hint: `This is a sine rule question, used for triangles that don't have a right angle. In any triangle, each side has a matching angle directly across from it, the angle it is "opposite". The sine rule says that for a given triangle, a side's length divided by the sine of its opposite angle always gives the same value, whichever matching side-angle pair you pick. So if you know one full pair, and the angle opposite the side you want, you can find that missing side.`,
          solution: {
            scenario: `In triangle ABC, side BC (the side opposite angle A) is ${a} cm, angle A = ${angleA}°, and angle B = ${angleB}°. Find side AC, the side opposite angle B.`,
            idea: `In any triangle, a side and the angle directly across from it form a matching pair. The sine rule says that for a given triangle, dividing a side's length by the sine of its opposite angle always gives the same result, whichever matching pair you pick. This is written in maths as a/sin(A) = b/sin(B), where side a is opposite angle A and side b is opposite angle B, meaning you can set the two fractions equal to each other and rearrange to find whichever piece is missing.`,
            method: [
              "Write the sine rule using the fully known matching pair, and the matching pair that includes the missing side.",
              "Rearrange to make the missing side the subject.",
              "Calculate and round to 1 decimal place.",
            ],
            steps: [
              `Set up the sine rule with the known pair (side ${a} cm opposite angle ${angleA}°) and the pair with the missing side b (opposite angle ${angleB}°): ${a}/sin(${angleA}°) = b/sin(${angleB}°).`,
              `Rearrange to make b the subject: b = ${a} × sin(${angleB}°) ÷ sin(${angleA}°).`,
              `sin(${angleB}°) ≈ ${Math.sin(angleB * rad).toFixed(4)} and sin(${angleA}°) ≈ ${Math.sin(angleA * rad).toFixed(4)}.`,
              `Calculate: ${a} × ${Math.sin(angleB * rad).toFixed(4)} ÷ ${Math.sin(angleA * rad).toFixed(4)} ≈ ${bRaw.toFixed(2)}.`,
              `Rounded to 1 decimal place, side AC ≈ ${answer} cm.`,
            ],
            check: angleB > angleA
              ? `Check: the larger the angle facing a side, the longer that side is. Angle B (${angleB}°) is bigger than angle A (${angleA}°), so side AC should come out longer than BC (${a} cm), and ${answer} cm is indeed bigger than ${a} cm.`
              : `Check: the larger the angle facing a side, the longer that side is. Angle A (${angleA}°) is bigger than angle B (${angleB}°), so side AC should come out shorter than BC (${a} cm), and ${answer} cm is indeed smaller than ${a} cm.`,
          },
        };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  similarShapesAndScaleFactors(d) {
    const tier1 = [
      () => {
        const w = rand(3, 6), h = rand(2, 5), k = pick([2, 3, 4]);
        const W = w * k, H = h * k, S = 7;
        const missingSide = pick(["W", "H"]);
        const answer = missingSide === "W" ? W : H;
        const decoys = [w * h, answer + k, answer - k > 0 ? answer - k : answer + 1, missingSide === "W" ? H : W, answer + 1].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        const y2 = 20 + h * S + 50;
        const svg = svgBox(
          SR(30, 20, w * S, h * S, "#22c8b8") + ST(30 + (w * S) / 2, 12, `${w} cm`, undefined, 11) + ST(20, 20 + (h * S) / 2 + 4, `${h} cm`, undefined, 11) +
          SR(30, y2, W * S, H * S, "#ff6b4a") +
          ST(30 + (W * S) / 2, y2 - 8, missingSide === "W" ? "? cm" : `${W} cm`, undefined, 12, missingSide === "W" ? "#ff5d8f" : "#2a1a5e", 700) +
          ST(18, y2 + (H * S) / 2 + 4, missingSide === "H" ? "?" : `${H} cm`, undefined, 12, missingSide === "H" ? "#ff5d8f" : "#2a1a5e", 700),
          30 + Math.max(w, W) * S + 40, y2 + H * S + 30
        );
        return { q: `The two rectangles are similar. Find the missing side length, marked "?".`, options, correctIndex, svg,
          hint: `Similar shapes are exactly the same shape but different sizes. All corresponding lengths are multiplied by the same scale factor. Find the scale factor by dividing a known side of the large shape by the corresponding side of the small shape, then multiply the other known small side by that scale factor.`,
          solution: {
            idea: `For similar shapes, the ratio of any pair of corresponding sides is the same scale factor k. Find k from the pair of known corresponding sides, then apply it to find the unknown.`,
            steps: [
              `Scale factor = ${missingSide === "W" ? H : W} / ${missingSide === "W" ? h : w} = ${k}.`,
              `Missing side = ${missingSide === "W" ? w : h} x ${k} = ${answer} cm.`,
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const k = pick([2, 3, 4, 5]);
        const smallArea = rand(3, 12);
        const bigArea = smallArea * k * k;
        const askBig = pick([true, false]);
        const answer = askBig ? bigArea : smallArea;
        const given = askBig ? smallArea : bigArea;
        const decoys = [given * k, Math.round(given / k), given * k * k * 2, answer + k].filter((v) => v !== answer && Number.isFinite(v) && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        const half = Math.max(1, Math.round((40 * k) / 2));
        const svg = svgBox(
          SR(30, 40, 40, 40, "#22c8b8") + ST(50, 100, `${askBig ? smallArea : "?"} cm2`, undefined, 12) +
          SR(110, 20, half, half, "#ff6b4a") + ST(110 + half / 2, 20 + half + 16, `${askBig ? "?" : bigArea} cm2`, undefined, 12) +
          ST(70, 15, `scale factor ${k}`, undefined, 11),
          110 + half + 30, 20 + half + 40
        );
        return { q: `Two similar shapes have a length scale factor of ${k}. The ${askBig ? "smaller" : "larger"} shape has area ${given}cm2. Find the area of the ${askBig ? "larger" : "smaller"} shape.`, options, correctIndex, svg,
          hint: `Areas scale by the SQUARE of the length scale factor. If lengths are multiplied by k, areas are multiplied by k squared. To go from large to small, divide by k squared instead.`,
          solution: {
            idea: `Area scale factor = (length scale factor)^2. This is because area involves two dimensions, both of which are scaled by k, giving k times k = k squared overall.`,
            steps: [
              `Area scales by the SQUARE of the length scale factor: ${k}^2 = ${k * k}.`,
              askBig ? `New area = ${given} x ${k * k} = ${answer}cm2.` : `New area = ${given} / ${k * k} = ${answer}cm2.`,
            ]
          }
        };
      },
      () => {
        const k = pick([2, 3, 4]);
        const smallVol = rand(2, 8);
        const bigVol = smallVol * k * k * k;
        const askBig = pick([true, false]);
        const answer = askBig ? bigVol : smallVol;
        const given = askBig ? smallVol : bigVol;
        const decoys = [given * k, given * k * k, Math.round(given / k), answer + k].filter((v) => v !== answer && Number.isFinite(v) && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        const s1 = 24, s2 = Math.min(90, Math.round(24 * k * 0.55));
        const svg = svgBox(
          SR(30, 60, s1, s1, "#22c8b8") + ST(30 + s1 / 2, 60 + s1 + 16, `${askBig ? smallVol : "?"} cm3`, undefined, 11) +
          SR(90, 30, s2, s2, "#ff6b4a") + ST(90 + s2 / 2, 30 + s2 + 16, `${askBig ? "?" : bigVol} cm3`, undefined, 11) +
          ST(65, 20, `scale factor ${k}`, undefined, 11),
          90 + s2 + 30, 30 + s2 + 40
        );
        return { q: `Two similar solids have a length scale factor of ${k}. The ${askBig ? "smaller" : "larger"} solid has volume ${given}cm3. Find the volume of the ${askBig ? "larger" : "smaller"} solid.`, options, correctIndex, svg,
          hint: `Volumes scale by the CUBE of the length scale factor. If lengths are multiplied by k, volumes are multiplied by k cubed (k times k times k). To go from large to small, divide by k cubed.`,
          solution: {
            idea: `Volume scale factor = (length scale factor)^3. Volume involves three dimensions, each scaled by k, giving k cubed overall.`,
            steps: [
              `Volume scales by the CUBE of the length scale factor: ${k}^3 = ${k * k * k}.`,
              askBig ? `New volume = ${given} x ${k * k * k} = ${answer}cm3.` : `New volume = ${given} / ${k * k * k} = ${answer}cm3.`,
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  multiStepGeometryProof(d) {
    const tier1 = [
      () => {
        const apex = pick([30, 32, 34, 36, 38, 40, 44, 46, 50, 54, 56, 60, 64, 66, 70]);
        const base = (180 - apex) / 2;
        const ext = 180 - base;
        const decoys = [base, apex, ext + 10, ext - 10 > 0 ? ext - 10 : ext + 20].filter((v) => v !== ext);
        const { options, correctIndex } = buildMC(ext, decoys, deg);
        const x0 = 70, y0 = 160, x1 = 220, apexX = 145, apexY = 50, Dx = x1 + 40;
        const svg = svgBox(
          `<polygon points="${x0},${y0} ${x1},${y0} ${apexX},${apexY}" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          SL(x0, y0, Dx, y0, "#c9bff0", 2) +
          ST(x0, y0 + 16, "B", undefined, 12) + ST(x1, y0 + 16, "C", undefined, 12) + ST(apexX, apexY - 8, "A", undefined, 12) + ST(Dx + 10, y0 + 4, "D", undefined, 12) +
          ST(apexX, apexY + 26, `${apex}°`, undefined, 12, "#ff5d8f", 700) +
          ST(x1 - 14, y0 - 14, "?", undefined, 13, "#22c8b8", 700),
          Dx + 30, y0 + 40
        );
        return {
          q: `Triangle ABC is isosceles with AB = AC and angle BAC = ${apex}°. BC is extended to a point D. Find the exterior angle ACD (marked "?").`,
          options, correctIndex, svg,
          hint: `This is a multi-step angle reasoning question, combining an isosceles triangle fact with an angles-on-a-line fact. An isosceles triangle has two equal sides, and the angles opposite those equal sides (called the base angles) are also equal to each other. When one side of a triangle is extended into a straight line past a corner, the new angle formed and the triangle's angle at that same corner sit on that straight line together, so they add up to 180°. You need both facts, one after the other, to get from the given angle to the one you want.`,
          solution: {
            scenario: `Triangle ABC is isosceles with AB = AC (two equal sides) and angle BAC = ${apex}°. Side BC is extended in a straight line past C to a point D. Find the exterior angle ACD.`,
            idea: `Two facts combine here. First, in an isosceles triangle (a triangle with two equal sides), the two angles opposite those equal sides, called the base angles, are equal to each other, and since all three angles of any triangle add up to 180°, the two base angles share whatever is left after the apex angle is taken away. Second, whenever a side of a triangle is extended into a straight line past a corner, the new 'exterior' angle formed and the triangle's interior angle at that same corner sit on a straight line together, so they add up to 180°, this is sometimes called 'angles on a straight line'.`,
            method: [
              "Find the base angles of the isosceles triangle using the triangle angle sum.",
              "Use the fact that angles on the straight line BD add up to 180° to find the exterior angle.",
            ],
            steps: [
              `AB = AC, so the base angles are equal: angle ABC = angle ACB.`,
              `The three angles of the triangle sum to 180°, so the two base angles together make 180° − ${apex}° = ${180 - apex}°.`,
              `Halve that to find one base angle: ${180 - apex}° ÷ 2 = ${base}°, so angle ACB = ${base}°.`,
              `Angle ACD and angle ACB sit on the straight line BD, so together they add up to 180°.`,
              `Subtract: 180° − ${base}° = ${ext}°, so angle ACD = ${ext}°.`,
            ],
            check: `Check: ${apex}° + ${base}° + ${base}° = ${apex + base + base}°, confirming the triangle's angles sum to 180°, and ${base}° + ${ext}° = ${base + ext}°, confirming angle ACB and angle ACD sit correctly on the straight line.`,
          },
        };
      },
      () => {
        const a = pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]);
        const apexAngle = 180 - 2 * a;
        const decoys = [a, 2 * a, apexAngle + 10, apexAngle - 10 > 0 ? apexAngle - 10 : apexAngle + 20].filter((v) => v !== apexAngle);
        const { options, correctIndex } = buildMC(apexAngle, decoys, deg);
        const P = { x: 40, y: 50 }, Q = { x: 240, y: 50 }, V = { x: 140, y: 50 }, Rp = { x: 80, y: 170 }, Sp = { x: 200, y: 170 };
        const svg = svgBox(
          SL(P.x, P.y, Q.x, Q.y, "#2a1a5e", 1.5) + SL(Rp.x - 20, Rp.y, Sp.x + 20, Sp.y, "#2a1a5e", 1.5) +
          SL(V.x, V.y, Rp.x, Rp.y, "#7c5cff", 2.5) + SL(V.x, V.y, Sp.x, Sp.y, "#7c5cff", 2.5) +
          ST(P.x, P.y - 10, "P", undefined, 12) + ST(Q.x, Q.y - 10, "Q", undefined, 12) + ST(V.x, V.y - 10, "V", undefined, 12) +
          ST(Rp.x - 14, Rp.y + 16, "R", undefined, 12) + ST(Sp.x + 14, Sp.y + 16, "S", undefined, 12) +
          ST(V.x - 38, V.y + 16, `${a}°`, undefined, 12, "#ff5d8f", 700) +
          ST(V.x, V.y + 26, "?", undefined, 13, "#22c8b8", 700) +
          ST((Rp.x + Sp.x) / 2, Rp.y - 14, "(VR = VS)", undefined, 11),
          280, 210
        );
        return {
          q: `PQ is parallel to RS. V is a point on PQ, and VR, VS are drawn to points R and S on the other line, with VR = VS. Angle PVR = ${a}°. Find angle RVS (marked "?").`,
          options, correctIndex, svg,
          hint: `This is a multi-step angle reasoning question, combining a parallel lines fact with an isosceles triangle fact. When two straight lines are parallel (always the same distance apart, never meeting, however far you extend them) and another line crosses both of them, certain pairs of angles are automatically equal. Alternate angles sit on opposite sides of the crossing line, in the gap between the two parallel lines, forming a 'Z' shape, and they are always equal to each other. Separately, an isosceles triangle (one with two equal sides) always has its two base angles, the ones opposite the equal sides, equal to each other too. Use the parallel lines fact to find one angle, then the isosceles fact to find another, before finishing with the triangle angle sum.`,
          solution: {
            scenario: `PQ is parallel to RS. V is a point on PQ, and VR and VS are drawn to points R and S on the other line, with VR = VS (two equal sides). Angle PVR = ${a}°. Find angle RVS.`,
            idea: `Two facts combine here. First, when a line crosses two parallel lines, alternate angles, the ones on opposite sides of the crossing line and between the two parallel lines, forming a 'Z' shape, are always equal. Second, in an isosceles triangle (here VRS, since VR = VS), the two base angles opposite the equal sides are equal to each other. Once both base angles of triangle VRS are known, the triangle angle sum gives the remaining angle.`,
            method: [
              "Use the parallel lines (alternate angles) fact to find angle VRS.",
              "Use the isosceles triangle fact to find angle VSR.",
              "Use the triangle angle sum to find angle RVS.",
            ],
            steps: [
              `Angle PVR and angle VRS are alternate angles between the parallel lines PQ and RS (they form a 'Z' shape), so they are equal: angle VRS = ${a}°.`,
              `VR = VS, so triangle VRS is isosceles, and its base angles are equal: angle VSR = angle VRS = ${a}°.`,
              `Add the two known angles of triangle VRS: ${a}° + ${a}° = ${2 * a}°.`,
              `Subtract from 180°, since the triangle's angles sum to 180°: 180° − ${2 * a}° = ${apexAngle}°, so angle RVS = ${apexAngle}°.`,
            ],
            check: `Check: ${a}° + ${a}° + ${apexAngle}° = ${a + a + apexAngle}°, confirming the three angles of triangle VRS add up correctly to 180°.`,
          },
        };
      },
    ];
    const tier2 = [
      () => {
        const ext = pick([100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160]);
        const base = 180 - ext;
        const apex = 180 - 2 * base;
        const decoys = [base, ext, apex + 10, apex - 10 > 0 ? apex - 10 : apex + 20].filter((v) => v !== apex);
        const { options, correctIndex } = buildMC(apex, decoys, deg);
        const x0 = 70, y0 = 160, x1 = 220, apexX = 145, apexY = 50, Dx = x1 + 40;
        const svg = svgBox(
          `<polygon points="${x0},${y0} ${x1},${y0} ${apexX},${apexY}" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          SL(x0, y0, Dx, y0, "#c9bff0", 2) +
          ST(x0, y0 + 16, "B", undefined, 12) + ST(x1, y0 + 16, "C", undefined, 12) + ST(apexX, apexY - 8, "A", undefined, 12) + ST(Dx + 10, y0 + 4, "D", undefined, 12) +
          ST(apexX, apexY + 26, "?", undefined, 13, "#22c8b8", 700) +
          ST(x1 + 2, y0 - 18, `${ext}°`, undefined, 12, "#ff5d8f", 700),
          Dx + 30, y0 + 40
        );
        return {
          q: `Triangle ABC is isosceles with AB = AC. BC is extended to D, and the exterior angle ACD = ${ext}°. Find the apex angle BAC (marked "?").`,
          options, correctIndex, svg,
          hint: `This is a multi-step angle reasoning question, working backwards from an exterior angle to find the apex of an isosceles triangle. An isosceles triangle has two equal sides, and the angles opposite those equal sides (the base angles) are equal to each other. When a side of a triangle is extended into a straight line past a corner, the new angle formed and the triangle's angle at that same corner sit on that straight line together, so they add up to 180°. You need the straight-line fact first, then the isosceles fact, then the triangle angle sum.`,
          solution: {
            scenario: `Triangle ABC is isosceles with AB = AC. Side BC is extended in a straight line past C to a point D, and the exterior angle ACD = ${ext}°. Find the apex angle BAC.`,
            idea: `Working backwards through the same two facts as before: angles on a straight line add up to 180°, and an isosceles triangle's base angles (the ones opposite the equal sides) are equal. Since angle ACD and angle ACB lie on the straight line BD, subtracting the exterior angle from 180° gives angle ACB. Since AB = AC, angle ABC equals angle ACB too. Then the triangle angle sum gives the missing apex angle.`,
            method: [
              "Use the straight line BD to find angle ACB from the exterior angle.",
              "Use the isosceles triangle fact to find angle ABC.",
              "Use the triangle angle sum to find angle BAC.",
            ],
            steps: [
              `Angle ACB and angle ACD sit on the straight line BD, so they add up to 180°: angle ACB = 180° − ${ext}° = ${base}°.`,
              `AB = AC, so the base angles are equal: angle ABC = angle ACB = ${base}°.`,
              `Add the two base angles: ${base}° + ${base}° = ${2 * base}°.`,
              `Subtract from 180°, since the triangle's angles sum to 180°: 180° − ${2 * base}° = ${apex}°, so angle BAC = ${apex}°.`,
            ],
            check: `Check: ${base}° + ${ext}° = ${base + ext}°, confirming angle ACB and the exterior angle sit correctly on the straight line, and ${base}° + ${base}° + ${apex}° = ${base + base + apex}°, confirming the triangle's angles sum to 180°.`,
          },
        };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  coordinateGeometry(d) {
    const S = 16, ox = 130, oy = 100, N = 6;
    const gridBg = () => {
      let g = "";
      for (let i = -N; i <= N; i++) {
        g += SL(ox + i * S, oy - N * S, ox + i * S, oy + N * S, "#ece7fb", 1);
        g += SL(ox - N * S, oy - i * S, ox + N * S, oy - i * S, "#ece7fb", 1);
      }
      g += SL(ox - N * S, oy, ox + N * S, oy, "#2a1a5e", 1.5);
      g += SL(ox, oy - N * S, ox, oy + N * S, "#2a1a5e", 1.5);
      return g;
    };
    const dot = (px, py, label, col = "#ff5d8f") =>
      SC(ox + px * S, oy - py * S, 3.5, col, 2, col) +
      ST(ox + px * S + (px >= 0 ? 9 : -9), oy - py * S - 7, label, px >= 0 ? "start" : "end", 12, "#2a1a5e", 700);
    const gridSvg = (inner) => svgBox(gridBg() + inner, ox + N * S + 40, oy + N * S + 20);
    const fmtLine = (m, c) => `y = ${m === 1 ? "" : m === -1 ? "-" : m}x${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`}`;

    const tier1 = [
      () => {
        let x1 = rand(-5, 4), y1 = rand(-4, 4), x2 = rand(-5, 5), y2 = rand(-4, 4), guard = 0;
        while ((x2 === x1 || y2 === y1) && guard < 40) { guard++; x2 = rand(-5, 5); y2 = rand(-4, 4); }
        if (x2 === x1) x2 = x1 + 1;
        if (y2 === y1) y2 = y1 + 1;
        const dx = x2 - x1, dy = y2 - y1;
        const g = gcd(dy, dx); let num = dy / g, den = dx / g;
        if (den < 0) { num = -num; den = -den; }
        const answer = den === 1 ? String(num) : `${num}/${den}`;
        const decoys = [
          den === 1 ? String(-num) : `${-num}/${den}`,
          `${den}/${num}`,
          den === 1 ? String(num + 1) : `${num + 1}/${den}`,
          den === 1 ? String(num - 1) : `${num - 1}/${den}`,
          den === 1 ? String(num + 2) : `${num}/${den + 1}`,
        ];
        const { options, correctIndex } = buildMCStr(answer, decoys);
        const svg = gridSvg(
          SL(ox + x1 * S, oy - y1 * S, ox + x2 * S, oy - y2 * S, "#7c5cff", 2.5) +
          dot(x1, y1, `A(${x1}, ${y1})`) + dot(x2, y2, `B(${x2}, ${y2})`, "#22c8b8")
        );
        return { q: `Find the gradient of the line through A and B.`, options, correctIndex, svg,
          hint: `The gradient (slope) of a line measures how steeply it rises or falls. It is calculated as the change in y divided by the change in x between any two points on the line. A positive gradient goes up left to right; a negative gradient goes down. Simplify the fraction if possible.`,
          solution: {
            idea: `Gradient = (change in y) / (change in x) = (y2 - y1) / (x2 - x1). This measures the rate of increase of y per unit increase in x. Simplify by dividing numerator and denominator by their HCF.`,
            steps: [
              `Gradient = (change in y) / (change in x) = (${y2} - ${y1}) / (${x2} - ${x1}) = ${dy}/${dx}.`,
              `Simplified: ${answer}.`,
            ]
          }
        };
      },
      () => {
        const mx = rand(-2, 2), my = rand(-2, 2);
        const hx = pick([1, 2, 3]) * pick([1, -1]);
        const hy = pick([1, 2]) * pick([1, -1]);
        const x1 = mx - hx, x2 = mx + hx, y1 = my - hy, y2 = my + hy;
        const answer = `(${mx}, ${my})`;
        const decoys = [`(${mx + 1}, ${my})`, `(${mx}, ${my + 1})`, `(${x1 + x2}, ${y1 + y2})`, `(${mx - 1}, ${my - 1})`, `(${mx + 1}, ${my + 1})`];
        const { options, correctIndex } = buildMCStr(answer, decoys);
        const svg = gridSvg(
          SL(ox + x1 * S, oy - y1 * S, ox + x2 * S, oy - y2 * S, "#c9bff0", 2) +
          dot(x1, y1, `A(${x1}, ${y1})`) + dot(x2, y2, `B(${x2}, ${y2})`, "#22c8b8") +
          dot(mx, my, "M", "#ff6b4a")
        );
        return { q: `Find the midpoint M of the line segment AB.`, options, correctIndex, svg,
          hint: `The midpoint of a line segment is the point exactly halfway along it. Find it by averaging the x-coordinates of the two endpoints and averaging the y-coordinates separately.`,
          solution: {
            idea: `Midpoint = ((x1 + x2)/2, (y1 + y2)/2). Averaging each coordinate independently gives the central point of the segment.`,
            steps: [
              `Midpoint x = (${x1} + ${x2}) / 2 = ${mx}.`,
              `Midpoint y = (${y1} + ${y2}) / 2 = ${my}.`,
              `M = (${mx}, ${my}).`,
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const m = pick([1, 2, -1, -2]);
        const x1 = rand(-3, 3), y1 = rand(-2, 2);
        const c = y1 - m * x1;
        const answer = fmtLine(m, c);
        const decoys = [fmtLine(-m, c), fmtLine(m, -c), fmtLine(m, c + 1), fmtLine(m, c - 1), fmtLine(m * 2, c)];
        const { options, correctIndex } = buildMCStr(answer, decoys);
        const x2 = x1 + (x1 <= 0 ? 2 : -2);
        const y2 = m * x2 + c;
        const svg = gridSvg(
          SL(ox + x1 * S, oy - y1 * S, ox + x2 * S, oy - y2 * S, "#7c5cff", 2.5) +
          dot(x1, y1, "P", "#ff6b4a")
        );
        return { q: `A line with gradient ${m} passes through point P(${x1}, ${y1}). Find the equation of the line.`, options, correctIndex, svg,
          hint: `The equation of a straight line is y = mx + c, where m is the gradient and c is the y-intercept. You know the gradient already. Substitute the known point (x, y) into the equation to find c, then write the full equation.`,
          solution: {
            idea: `Use y = mx + c. Substitute the known point and gradient to solve for c. The y-intercept c is where the line crosses the y-axis.`,
            steps: [
              `Substitute the gradient and point into y = mx + c: ${y1} = ${m}(${x1}) + c.`,
              `${y1} = ${m * x1} + c, so c = ${c}.`,
              `Equation: ${answer}.`,
            ]
          }
        };
      },
      () => {
        const den = pick([1, 2, 3, 4]), num = pick([1, 2, 3, 4, 5]), sign = pick([1, -1]);
        const g0 = gcd(sign * num, den); let rnum = (sign * num) / g0, rden = den / g0;
        if (rden < 0) { rnum = -rnum; rden = -rden; }
        const mLabel = rden === 1 ? String(rnum) : `${rnum}/${rden}`;
        let pnum = -rden, pden = rnum;
        if (pden < 0) { pnum = -pnum; pden = -pden; }
        const g1 = gcd(pnum, pden); pnum /= g1; pden /= g1;
        const answer = pden === 1 ? String(pnum) : `${pnum}/${pden}`;
        const decoys = [
          mLabel,
          rden === 1 ? String(-rnum) : `${-rnum}/${rden}`,
          `${rden}/${rnum}`,
          pden === 1 ? String(-pnum) : `${-pnum}/${pden}`,
          pden === 1 ? String(pnum + 1) : `${pnum + 1}/${pden}`,
          pden === 1 ? String(pnum - 1) : `${pnum - 1}/${pden}`,
        ];
        const { options, correctIndex } = buildMCStr(answer, decoys);
        const bx = 60, by = 120;
        const svg = svgBox(
          SL(bx, by, bx + rden * S, by, "#c9bff0", 2) +
          SL(bx + rden * S, by, bx + rden * S, by - rnum * S, "#c9bff0", 2) +
          SL(bx, by, bx + rden * S, by - rnum * S, "#7c5cff", 2.5) +
          ST(bx + (rden * S) / 2, by + 18, `run = ${rden}`, "middle", 12) +
          ST(bx + rden * S + 8, by - (rnum * S) / 2, `rise = ${rnum}`, "start", 12),
          260, 260
        );
        return { q: `A line has gradient ${mLabel} (shown as a rise/run triangle). Find the gradient of a line perpendicular to it.`, options, correctIndex, svg,
          hint: `Two lines are perpendicular when their gradients multiply to give -1. To find the perpendicular gradient from a given gradient m, take the negative reciprocal: flip the fraction (swap numerator and denominator) and change the sign.`,
          solution: {
            idea: `Perpendicular gradients satisfy m1 times m2 = -1. So m2 = -1/m1. In practice: flip the fraction and negate. If m = a/b, the perpendicular gradient is -b/a.`,
            steps: [
              `Perpendicular gradients multiply to give -1: flip the fraction and negate.`,
              `${mLabel} -> flip -> ${rden}/${rnum} -> negate -> ${answer}.`,
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  threeDGeometryAndNets(d) {
    const tier1 = [
      () => {
        const l = rand(3, 8), w = rand(2, 6), h = rand(2, 6), S = 9;
        const faceLW = l * w, faceLH = l * h, faceWH = w * h;
        const SA = 2 * (faceLW + faceLH + faceWH);
        const x0 = 70, y0 = 30 + w * S;
        const decoys = [faceLW + faceLH + faceWH, SA + 2, SA - 2, l * w * h].filter((v) => v !== SA);
        const { options, correctIndex } = buildMC(SA, decoys, (x) => x + " cm²");
        const svg = svgBox(
          SR(x0, y0 - w * S, l * S, w * S, "#22c8b8") + ST(x0 + (l * S) / 2, y0 - w * S - 8, `${l} cm`, undefined, 11) +
          SR(x0, y0, l * S, h * S, "#ff6b4a") + ST(x0 - 16, y0 + (h * S) / 2 + 4, `${h} cm`, undefined, 11) +
          SR(x0 + l * S, y0, w * S, h * S, "#7c5cff") + ST(x0 + l * S + (w * S) / 2, y0 - 8, `${w} cm`, undefined, 11),
          x0 + l * S + w * S + 40, y0 + h * S + 30
        );
        return {
          q: `The diagram shows part of the net of a cuboid (top face, front face, and right-side face). The cuboid measures ${l} cm × ${w} cm × ${h} cm. Find its total surface area.`,
          options, correctIndex, svg,
          hint: `This is a surface area question. A cuboid is a box shape with six flat rectangular faces, and the faces come in three matching pairs: top and bottom, front and back, and left side and right side. A net is what you would see if you unfolded the box completely flat, like unfolding a cereal box so every face lies open in front of you. To answer this, work out the area of each of the three DIFFERENT face shapes, double each one to account for its matching partner, then add everything together. Don't just multiply all three edge lengths together, that gives the volume (how much the box holds), not the surface area (how much card it would take to wrap it).`,
          solution: {
            scenario: `A cuboid measures ${l} cm by ${w} cm by ${h} cm. Three of its six faces are shown in the net (top, front, and right-side). Find the total surface area of all six faces.`,
            idea: `A cuboid has three pairs of identical rectangular faces: top and bottom, front and back, left side and right side. Each face's area is found by multiplying the two edge lengths that meet there. Work out the area of one face from each pair, add those three areas together, then double the total since every face shape appears twice. This is written in maths as SA = 2(lw + lh + wh), where l, w and h stand for the cuboid's three edge lengths, meaning: add up the three different face areas, then double the result.`,
            method: [
              "Multiply each pair of edge lengths that meet at a face, to find the area of each of the three different faces.",
              "Add the three face areas together.",
              "Double the total, since each face shape occurs twice on the cuboid.",
            ],
            steps: [
              `The top face measures ${l} cm by ${w} cm, so its area is ${l} × ${w} = ${faceLW} cm².`,
              `The front face measures ${l} cm by ${h} cm, so its area is ${l} × ${h} = ${faceLH} cm².`,
              `The right-side face measures ${w} cm by ${h} cm, so its area is ${w} × ${h} = ${faceWH} cm².`,
              `Add the three face areas together: ${faceLW} + ${faceLH} + ${faceWH} = ${faceLW + faceLH + faceWH}.`,
              `Double this, because each face shape appears twice on the cuboid: 2 × ${faceLW + faceLH + faceWH} = ${SA} cm².`,
            ],
            check: `${SA} cm² should be noticeably bigger than any single doubled face, for example 2 × ${faceLW} = ${2 * faceLW} cm² for just the top and bottom, and it is, since the total also includes the front, back, and both sides.`,
          },
        };
      },
      () => {
        const r = rand(2, 8), h = rand(3, 12), S = 8;
        const V = Math.round(Math.PI * r * r * h * 10) / 10;
        const decoys = [Math.round(2 * Math.PI * r * (r + h) * 10) / 10, Math.round(Math.PI * r * h * 10) / 10, V + 10, V - 10].filter((v) => v !== V && v > 0);
        const { options, correctIndex } = buildMC(V, decoys, (x) => x.toFixed(1) + " cm³");
        const svg = svgBox(
          `<ellipse cx="100" cy="40" rx="${r * S}" ry="${r * S * 0.35}" fill="#22c8b822" stroke="#22c8b8" stroke-width="2"/>` +
          SL(100 - r * S, 40, 100 - r * S, 40 + h * S, "#2a1a5e", 2) + SL(100 + r * S, 40, 100 + r * S, 40 + h * S, "#2a1a5e", 2) +
          `<ellipse cx="100" cy="${40 + h * S}" rx="${r * S}" ry="${r * S * 0.35}" fill="none" stroke="#2a1a5e" stroke-width="2"/>` +
          ST(100, 40 + h * S + 22, `height = ${h} cm`, undefined, 12) + ST(100, 30, `radius = ${r} cm`, undefined, 11),
          200 + r * S, 40 + h * S + 45
        );
        return {
          q: `Find the volume of a cylinder with radius ${r} cm and height ${h} cm. (Use π ≈ 3.14159, round to 1 d.p.)`,
          options, correctIndex, svg,
          hint: `This is a volume of a cylinder question. A cylinder is a 3D shape like a tin can, a circle at each end joined by a curved side. To find how much space it takes up (its volume), work out the area of the flat circular base first, then multiply by the height, as if you were stacking identical circular slices on top of each other up to that height. You will need π (said "pie"), a fixed number roughly equal to 3.14159 that connects a circle's radius to its area.`,
          solution: {
            scenario: `A cylinder has radius ${r} cm and height ${h} cm. Find its volume, correct to 1 decimal place.`,
            idea: `For any 3D shape that has the same cross-section all the way along it (a cylinder's cross-section is always the same circle), the volume is the area of that cross-section multiplied by the length. A circle's area is found by squaring the radius (multiplying it by itself) and multiplying by π. This is written in maths as A = πr², meaning: multiply π by the radius squared. So a cylinder's volume is written V = πr²h, meaning: work out the circular base's area, then multiply by the height.`,
            method: [
              "Square the radius.",
              "Multiply by π (≈3.14159) to get the area of the circular base.",
              "Multiply the base area by the height to get the volume.",
              "Round the final answer to 1 decimal place.",
            ],
            steps: [
              `Square the radius: ${r} × ${r} = ${r * r}.`,
              `Multiply by π: π × ${r * r} ≈ ${(Math.PI * r * r).toFixed(2)} cm², this is the area of the circular base.`,
              `Multiply the base area by the height: ${(Math.PI * r * r).toFixed(2)} × ${h} ≈ ${(Math.PI * r * r * h).toFixed(2)} cm³.`,
              `Rounded to 1 decimal place, the volume is ${V} cm³.`,
            ],
            check: `The answer should be roughly (radius²) × height × 3, since π is close to 3: ${r * r} × ${h} × 3 = ${r * r * h * 3}, which is in the same ballpark as ${V}, so the size of the answer looks right.`,
          },
        };
      },
    ];
    const tier2 = [
      () => {
        const [a, b, hyp] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]);
        const len = rand(4, 10), S = 7;
        const triArea = (a * b) / 2;
        const SA = 2 * triArea + (a + b + hyp) * len;
        const decoys = [a * b * len, SA + 2, SA - 2, triArea * len].filter((v) => v !== SA);
        const { options, correctIndex } = buildMC(SA, decoys, (x) => x + " cm²");
        const svg = svgBox(
          `<polygon points="60,140 ${60 + a * S},140 60,${140 - b * S}" fill="#22c8b822" stroke="#22c8b8" stroke-width="2"/>` +
          ST(60 + (a * S) / 2, 152, `${a} cm`, undefined, 11) + ST(40, 140 - (b * S) / 2, `${b} cm`, undefined, 11) +
          ST(60 + (a * S) / 4, 100, `length ${len} cm`, undefined, 11),
          60 + a * S + 90, 175
        );
        return {
          q: `A triangular prism has a right-angled triangular cross-section with legs ${a} cm and ${b} cm (hypotenuse ${hyp} cm), and length ${len} cm. Find its total surface area.`,
          options, correctIndex, svg,
          hint: `This is a surface area of a prism question. A prism is a 3D shape with the same flat shape (its cross-section) at both ends, joined by flat rectangular sides, like a chocolate bar with a triangular end. To find the total surface area, you need the area of the two matching end shapes (here, right-angled triangles) plus the area of every rectangular side that joins them, one rectangle per edge of the end shape. Add all of those areas together.`,
          solution: {
            scenario: `A triangular prism has a right-angled triangular end with legs ${a} cm and ${b} cm and hypotenuse ${hyp} cm, and the prism is ${len} cm long. Find its total surface area.`,
            idea: `A prism's total surface area is the area of its two end shapes, plus the area of the rectangles that connect them, one rectangle for each edge of the end shape. Here the ends are right-angled triangles, so the area of one triangle is half the base times the height, using the two legs that meet at the right angle. There are three connecting rectangles, one along each side of the triangle (the two legs and the hypotenuse), each with length equal to the prism's length.`,
            method: [
              "Work out the area of one triangular end (half the two legs multiplied together), then double it for both ends.",
              "Work out the area of each of the three rectangular side faces, one per edge of the triangle, by multiplying that edge's length by the prism's length.",
              "Add the two triangle areas and the three rectangle areas together.",
            ],
            steps: [
              `Area of one triangular end: half of ${a} × ${b} = ${triArea} cm².`,
              `Double it for both triangular ends: 2 × ${triArea} = ${2 * triArea} cm².`,
              `The three rectangular sides run along the triangle's three edges (${a} cm, ${b} cm, and ${hyp} cm), each ${len} cm long, so add the edges first: ${a} + ${b} + ${hyp} = ${a + b + hyp} cm.`,
              `Multiply that by the prism's length: ${a + b + hyp} × ${len} = ${(a + b + hyp) * len} cm².`,
              `Add the ends and the sides together: ${2 * triArea} + ${(a + b + hyp) * len} = ${SA} cm².`,
            ],
            check: `The three rectangular sides should contribute more than the two triangular ends here, since ${(a + b + hyp) * len} is bigger than ${2 * triArea}, which makes sense as the prism is reasonably long compared with the triangle.`,
          },
        };
      },
      () => {
        const r = rand(2, 7), h = rand(3, 10), S = 8;
        const SA = Math.round((2 * Math.PI * r * r + 2 * Math.PI * r * h) * 10) / 10;
        const decoys = [Math.round(Math.PI * r * r * h * 10) / 10, SA + 10, SA - 10, Math.round(2 * Math.PI * r * h * 10) / 10].filter((v) => v !== SA && v > 0);
        const { options, correctIndex } = buildMC(SA, decoys, (x) => x.toFixed(1) + " cm²");
        const svg = svgBox(
          `<ellipse cx="100" cy="40" rx="${r * S}" ry="${r * S * 0.35}" fill="#ff6b4a22" stroke="#ff6b4a" stroke-width="2"/>` +
          SL(100 - r * S, 40, 100 - r * S, 40 + h * S, "#2a1a5e", 2) + SL(100 + r * S, 40, 100 + r * S, 40 + h * S, "#2a1a5e", 2) +
          `<ellipse cx="100" cy="${40 + h * S}" rx="${r * S}" ry="${r * S * 0.35}" fill="#ff6b4a22" stroke="#ff6b4a" stroke-width="2"/>` +
          ST(100, 40 + h * S + 22, `height = ${h} cm`, undefined, 12) + ST(100, 30, `radius = ${r} cm`, undefined, 11),
          200 + r * S, 40 + h * S + 45
        );
        return {
          q: `Find the total surface area of a cylinder with radius ${r} cm and height ${h} cm. (Use π ≈ 3.14159, round to 1 d.p.)`,
          options, correctIndex, svg,
          hint: `This is a total surface area of a cylinder question. Imagine peeling a cylinder apart: you get two flat circles (the top and bottom) and one curved side that, if you snipped it and rolled it flat, would form a rectangle. The total surface area is the area of both circles plus the area of that unrolled rectangle. The rectangle's width is the cylinder's height, and its length is the distance all the way round the circle (the circumference).`,
          solution: {
            scenario: `A cylinder has radius ${r} cm and height ${h} cm. Find its total surface area, correct to 1 decimal place.`,
            idea: `A cylinder's surface is made of two flat circular ends plus one curved side. Each circle's area is π times the radius squared. The curved side, if unrolled flat, forms a rectangle whose length is the circle's circumference (the distance around it, 2π times the radius) and whose width is the cylinder's height. This is written in maths as SA = 2πr² + 2πrh, meaning: twice the circle's area, plus the unrolled curved side's area.`,
            method: [
              "Work out the area of one circular end, then double it for both ends.",
              "Work out the circumference of the circle, then multiply by the height to get the curved side's area.",
              "Add the two totals together.",
            ],
            steps: [
              `Area of one circular end: π × ${r}² ≈ ${(Math.PI * r * r).toFixed(2)} cm².`,
              `Double it for both ends: 2 × ${(Math.PI * r * r).toFixed(2)} ≈ ${(2 * Math.PI * r * r).toFixed(2)} cm².`,
              `The curved side unrolls into a rectangle of length 2π × ${r} (the circumference) and width ${h}: 2π × ${r} × ${h} ≈ ${(2 * Math.PI * r * h).toFixed(2)} cm².`,
              `Add the two ends and the curved side together: ${(2 * Math.PI * r * r).toFixed(2)} + ${(2 * Math.PI * r * h).toFixed(2)} ≈ ${SA} cm².`,
            ],
            check: `Both ends together and the curved side should add back up to the total, ${SA} cm², which they do.`,
          },
        };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  advancedProbability(d) {
    const tier1 = [
      () => {
        const pA = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75]); const pB = pick([0.2, 0.3, 0.4, 0.5]);
        const answer = Math.round(pA * pB * 100) / 100;
        const decoys = [Math.round((pA + pB) * 100) / 100, pA, pB, answer + 0.05].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys, (v) => v.toFixed(2));
        return { q: `Event A has probability ${pA} and independent event B has probability ${pB}. What is P(A and B)?`, options, correctIndex,
          hint: `When two events are independent — meaning one happening does not affect the chance of the other — the probability that both happen is found by multiplying their individual probabilities. This is the multiplication rule for independent events: P(A and B) = P(A) × P(B).`,
          solution: {
            idea: `For independent events, P(A and B) = P(A) × P(B). Independence means knowing A happened tells you nothing about whether B happens, so the probabilities simply multiply.`,
            steps: [
              `Independent events: P(A and B) = P(A) × P(B) = ${pA} × ${pB} = ${answer}.`
            ]
          }
        };
      },
      () => {
        const values = [1, 2, 3, 4, 5]; const probs = [0.1, 0.2, 0.3, 0.25, 0.15];
        const answer = Math.round(values.reduce((s, v, i) => s + v * probs[i], 0) * 100) / 100;
        const decoys = [3, answer + 0.5, answer - 0.5, values.reduce((s, v) => s + v, 0) / values.length].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys, (v) => v.toFixed(2));
        return { q: `A game gives scores 1,2,3,4,5 with probabilities 0.1, 0.2, 0.3, 0.25, 0.15. Find the expected score.`, options, correctIndex,
          hint: `The expected value (or expectation) of a random variable is its long-run average. Calculate it by multiplying each possible value by its probability and adding all those products up. It is a weighted average where the weights are probabilities.`,
          solution: {
            idea: `E(X) = sum of each outcome multiplied by its probability. This is not the most likely outcome — it is the average you would get if you repeated the experiment many times.`,
            steps: [
              `E(X) = 1(0.1)+2(0.2)+3(0.3)+4(0.25)+5(0.15) = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const p = pick([0.1, 0.2, 0.25, 0.3]); const n = rand(2, 4);
        const pNone = Math.round(Math.pow(1 - p, n) * 100) / 100;
        const answer = Math.round((1 - pNone) * 100) / 100;
        const decoys = [pNone, Math.round((p * n) * 100) / 100, Math.round((1 - p) * 100) / 100, answer - 0.1].filter((v) => v !== answer && Number.isFinite(v));
        const { options, correctIndex } = buildMC(answer, decoys, (v) => v.toFixed(2));
        return { q: `The probability of rain on any given day is ${p}. What is the probability of at least one rainy day in ${n} independent days (to 2 d.p.)?`, options, correctIndex,
          hint: `"At least one" problems are almost always easiest via the complement: P(at least one) = 1 minus P(none). Find the probability of no rainy days across all ${n} days (multiply the "no rain" probabilities together since days are independent), then subtract from 1.`,
          solution: {
            idea: `P(at least one) = 1 minus P(none in n trials). For independent trials, P(none) = (1 minus p)^n. The complement approach avoids summing many separate cases.`,
            steps: [
              `P(no rain any day) = (1-${p})^${n} = ${pNone}.`,
              `P(at least one rainy day) = 1 - ${pNone} = ${answer}.`
            ]
          }
        };
      },
      () => {
        const k = rand(2, 8); const p = pick([[1, 3], [1, 4], [1, 5], [2, 5], [1, 2]]);
        const total = k * p[1]; const part = k * p[0];
        const decoys = [total + p[1], total - p[1] > 0 ? total - p[1] : total + p[1], part, total + k].filter((v) => v !== total && v > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        return { q: `A bag has some counters. ${part} of them are red, and this is ${p[0]}/${p[1]} of the total. How many counters are there in total?`, options, correctIndex,
          hint: `If a fraction of the total equals a known amount, find one unit of the fraction first (divide the known amount by the numerator), then scale up to the full total by multiplying by the denominator.`,
          solution: {
            idea: `If (p/q) of the total = known amount, then 1 part = known / p, and the total = (known / p) times q.`,
            steps: [
              `${p[0]}/${p[1]} of the total = ${part}, so 1/${p[1]} of the total = ${part / p[0]}.`,
              `Total = ${part / p[0]} x ${p[1]} = ${total}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const aAndB = rand(3, 10), bOnly = rand(2, 8), aOnly = rand(2, 8), neither = rand(2, 8);
        const totalB = aAndB + bOnly;
        const answer = Math.round((aAndB / totalB) * 100) / 100;
        const decoys = [Math.round((aAndB / (aAndB + aOnly + bOnly + neither)) * 100) / 100, Math.round((bOnly / totalB) * 100) / 100, Math.round((aAndB / (aAndB + aOnly)) * 100) / 100, answer + 0.1].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys, (v) => v.toFixed(2));
        return { q: `In a survey, ${aAndB} people like both tea and coffee, ${bOnly} like only coffee (not tea). Given someone likes coffee, what is the probability they also like tea (to 2 d.p.)?`, options, correctIndex,
          hint: `This is a conditional probability question. "Given that someone likes coffee" means you restrict your view to only the coffee drinkers. P(tea given coffee) = (those who like both) divided by (all who like coffee at all).`,
          solution: {
            idea: `Conditional probability: P(A given B) = (number in both A and B) / (total in B). The condition filters the sample space.`,
            steps: [
              `Total who like coffee = ${aAndB} + ${bOnly} = ${totalB}.`,
              `P(tea | coffee) = ${aAndB}/${totalB} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const red = rand(3, 8), blue = rand(3, 8); const total = red + blue;
        const pBothRed = (red / total) * ((red - 1) / (total - 1));
        const answer = Math.round(pBothRed * 100) / 100;
        const decoys = [Math.round((red / total) * (red / total) * 100) / 100, Math.round((red / total) * 100) / 100, Math.round(((red + blue - 2) / total) * 100) / 100, answer + 0.05].filter((v) => v !== answer && Number.isFinite(v));
        const { options, correctIndex } = buildMC(answer, decoys, (v) => v.toFixed(2));
        return { q: `A bag has ${red} red and ${blue} blue counters. Two are drawn without replacement. What is the probability both are red (to 2 d.p.)?`, options, correctIndex,
          hint: `Without replacement means the second draw depends on the first: there is one fewer counter in the bag. Use the chain rule: P(both red) = P(1st red) times P(2nd red, given 1st was red). After the first red is removed, there are fewer reds and fewer counters total.`,
          solution: {
            idea: `For dependent events (without replacement), P(A and B) = P(A) times P(B given A). The second probability uses updated counts after the first draw.`,
            steps: [
              `P(1st red) = ${red}/${total}. P(2nd red | 1st red) = ${red - 1}/${total - 1}.`,
              `P(both red) = (${red}/${total}) x (${red - 1}/${total - 1}) = ${answer}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  statisticsAdvanced(d) {
    const tier1 = [
      () => {
        const min = rand(2, 10), q1 = min + rand(2, 8), median = q1 + rand(2, 8), q3 = median + rand(2, 8), max = q3 + rand(2, 10);
        const ask = pick(["iqr", "range", "median"]);
        const iqr = q3 - q1, range = max - min;
        const answer = ask === "iqr" ? iqr : ask === "range" ? range : median;
        const rawDecoys = ask === "iqr" ? [range, q3 - median, q1, iqr + 2] : ask === "range" ? [iqr, max, min, range + 2] : [q1, q3, (q1 + q3) / 2];
        const { options, correctIndex } = buildMC(answer, rawDecoys.filter((v) => v !== answer));
        const scaleMax = max + 5, S = 240 / scaleMax;
        const y = 100, xp = (v) => 30 + v * S;
        const svg = svgBox(
          SL(xp(min), y, xp(max), y, "#2a1a5e", 1.5) +
          SL(xp(min), y - 10, xp(min), y + 10, "#2a1a5e", 2) + SL(xp(max), y - 10, xp(max), y + 10, "#2a1a5e", 2) +
          SR(xp(q1), y - 20, xp(q3) - xp(q1), 40, "#7c5cff", 2) +
          SL(xp(median), y - 20, xp(median), y + 20, "#ff5d8f", 2.5) +
          ST(xp(min), y + 26, `${min}`, undefined, 11) + ST(xp(q1), y - 28, `${q1}`, undefined, 11) + ST(xp(median), y + 38, `${median}`, undefined, 11, "#ff5d8f", 700) + ST(xp(q3), y - 28, `${q3}`, undefined, 11) + ST(xp(max), y + 26, `${max}`, undefined, 11),
          280, 150
        );
        const askText = ask === "iqr" ? "the interquartile range (IQR)" : ask === "range" ? "the range" : "the median";
        return {
          q: `The box plot shows a dataset with minimum ${min}, lower quartile ${q1}, median ${median}, upper quartile ${q3}, and maximum ${max}. Find ${askText}.`,
          options, correctIndex, svg,
          hint: `This is a box plot question. A box plot is a diagram that summarises a set of data using five key numbers in order: the minimum (the smallest value), the lower quartile (the value a quarter of the way through the sorted data), the median (the middle value), the upper quartile (the value three quarters of the way through), and the maximum (the largest value). ${ask === "iqr" ? "The interquartile range (often shortened to IQR) measures how spread out the MIDDLE half of the data is, and is found by subtracting the lower quartile from the upper quartile." : ask === "range" ? "The range measures how spread out ALL of the data is, from smallest to largest, and is found by subtracting the minimum from the maximum." : "The median is just the middle value of the data once it's all sorted in order, and on a box plot it's shown directly as the line drawn inside the box, no calculation needed, just read it off."}`,
          solution: {
            scenario: `A box plot shows a dataset with minimum ${min}, lower quartile ${q1}, median ${median}, upper quartile ${q3}, and maximum ${max}. Find ${askText}.`,
            idea: ask === "iqr"
              ? `A box plot's 'box' stretches from the lower quartile to the upper quartile, so its width represents the spread of the middle half of the data. The interquartile range measures that width, and is found by subtracting the lower quartile from the upper quartile. This is written in maths as IQR = UQ − LQ, meaning subtract the lower quartile from the upper quartile.`
              : ask === "range"
              ? `The range measures the total spread of the data, from the very smallest value to the very largest. It is found by subtracting the minimum from the maximum. This is written in maths as range = max − min.`
              : `The median is the middle value of a dataset once it has been sorted into order, with exactly half the data below it and half above. On a box plot, it is marked as the line drawn inside the box, so it can simply be read straight off the diagram without any calculation.`,
            method: ask === "iqr"
              ? ["Read the lower quartile and upper quartile off the box plot.", "Subtract the lower quartile from the upper quartile."]
              : ask === "range"
              ? ["Read the minimum and maximum off the box plot.", "Subtract the minimum from the maximum."]
              : ["Find the line drawn inside the box.", "Read off its value."],
            steps: ask === "iqr"
              ? [`Read the lower quartile: ${q1}.`, `Read the upper quartile: ${q3}.`, `Subtract: ${q3} − ${q1} = ${iqr}.`]
              : ask === "range"
              ? [`Read the minimum: ${min}.`, `Read the maximum: ${max}.`, `Subtract: ${max} − ${min} = ${range}.`]
              : [`Find the line drawn inside the box, which marks the median.`, `Read off its value: ${median}.`],
            check: ask === "iqr"
              ? `Check: the IQR (${iqr}) should be smaller than the full range (${range}), since it only covers the middle half of the data, and it is.`
              : ask === "range"
              ? `Check: the range (${range}) should be bigger than the IQR (${iqr}), since it covers ALL the data rather than just the middle half, and it is.`
              : `Check: the median (${median}) should sit between the lower quartile (${q1}) and the upper quartile (${q3}), and it does.`,
          },
        };
      },
      () => {
        const width = pick([2, 4, 5, 6, 8, 10]);
        const freq = width * pick([2, 3, 4, 5, 6]);
        const density = freq / width;
        const askDensity = pick([true, false]);
        const answer = askDensity ? density : freq;
        const given = askDensity ? freq : density;
        const rawDecoys = askDensity ? [freq * width, density + 1, density - 1 > 0 ? density - 1 : density + 2, width] : [density * 2, answer + width, answer - width > 0 ? answer - width : answer + width * 2, density];
        const { options, correctIndex } = buildMC(answer, rawDecoys.filter((v) => v !== answer));
        const S = 14, barH = density * S;
        const svg = svgBox(
          SR(60, 140 - barH, width * S, barH, "#22c8b8") +
          ST(60 + (width * S) / 2, 155, `width = ${width}`, undefined, 11) +
          ST(60 + width * S + 16, 140 - barH / 2, askDensity ? "? high" : `${density} high`, undefined, 11, "#ff5d8f", 700),
          60 + width * S + 70, 170
        );
        return {
          q: askDensity
            ? `A histogram bar has frequency ${given} and class width ${width}. Find its frequency density (the bar's height).`
            : `A histogram bar has frequency density ${given} and class width ${width}. Find the frequency it represents.`,
          options, correctIndex, svg,
          hint: `This is a frequency density question, used with histograms (bar charts where it's the bar's AREA, not its height, that shows how many data values fall in that group). A histogram bar's width shows a class width (the size of the group of values that bar covers), and frequency density is the value used as the bar's HEIGHT, chosen specifically so that width times height gives the frequency (the count of data values). This means height (frequency density) is always frequency divided by class width, and rearranging that, frequency is always frequency density multiplied by class width.`,
          solution: {
            scenario: askDensity
              ? `A histogram bar has frequency ${given} and class width ${width}. Find its frequency density (its height on the chart).`
              : `A histogram bar has frequency density ${given} and class width ${width}. Find the frequency it represents.`,
            idea: `In a histogram, it's the AREA of each bar that represents the frequency (how many data values are in that group), not the height alone, this matters because groups can have different widths, so height alone would be misleading. The bar's height is called the frequency density, and it is defined so that width times height equals frequency. This is written in maths as frequency density = frequency ÷ class width, or rearranged, frequency = frequency density × class width.`,
            method: askDensity
              ? ["Divide the frequency by the class width."]
              : ["Multiply the frequency density by the class width."],
            steps: askDensity
              ? [`Divide: ${given} ÷ ${width} = ${answer}.`]
              : [`Multiply: ${given} × ${width} = ${answer}.`],
            check: askDensity
              ? `Check: multiplying back, ${answer} × ${width} = ${answer * width}, which matches the original frequency of ${given}.`
              : `Check: dividing back, ${answer} ÷ ${width} = ${answer / width}, which matches the original frequency density of ${given}.`,
          },
        };
      },
    ];
    const tier2 = [
      () => {
        const total = pick([40, 50, 60, 80, 100, 120, 160, 200]);
        const ask = pick(["median", "lq", "uq"]);
        const pos = ask === "median" ? total / 2 : ask === "lq" ? total / 4 : (3 * total) / 4;
        const decoys = [total, total / 2, total / 4, (3 * total) / 4].filter((v) => v !== pos);
        const { options, correctIndex } = buildMC(pos, decoys);
        const label = ask === "median" ? "median" : ask === "lq" ? "lower quartile" : "upper quartile";
        const frac = ask === "median" ? "½" : ask === "lq" ? "¼" : "¾";
        const fracVal = ask === "median" ? "1/2" : ask === "lq" ? "1/4" : "3/4";
        const svg = svgBox(
          SL(40, 150, 240, 150, "#2a1a5e", 1.5) + SL(40, 30, 40, 150, "#2a1a5e", 1.5) +
          `<path d="M40,150 Q100,140 140,90 T240,40" fill="none" stroke="#7c5cff" stroke-width="2.5"/>` +
          ST(140, 168, "value", undefined, 11) + ST(20, 90, "cumulative freq.", undefined, 10, "#2a1a5e", 600),
          280, 190
        );
        return {
          q: `A cumulative frequency graph has a total frequency of ${total}. At what cumulative frequency value do you read off the ${label} (the ${frac} point)?`,
          options, correctIndex, svg,
          hint: `This is a cumulative frequency question. A cumulative frequency graph is a running-total curve, at each point along the bottom (the data values), the height of the curve shows how many data values are AT OR BELOW that point so far. To find something like the median or a quartile, you don't need to know the actual data values yet, first work out what FRACTION of the total frequency you need, that fraction of the total is the height you'd look across from on the vertical axis to find the matching value on the horizontal axis.`,
          solution: {
            scenario: `A cumulative frequency graph has a total frequency of ${total}. Find the cumulative frequency value you would read across from to find the ${label}.`,
            idea: `On a cumulative frequency graph, the total frequency represents ALL of the data. The median sits halfway through the data, so you find its position by taking HALF the total frequency. Likewise the lower quartile sits a quarter of the way through the data, and the upper quartile sits three quarters of the way through. This is written in maths as median position = n/2, lower quartile position = n/4, and upper quartile position = 3n/4, where n stands for the total frequency.`,
            method: [
              `Identify what fraction of the total frequency the ${label} sits at (${frac}).`,
              `Multiply the total frequency by that fraction.`,
            ],
            steps: [
              `The ${label} sits at the ${frac} point of the data.`,
              `Multiply the total frequency by ${fracVal}: ${total} × ${fracVal} = ${pos}.`,
            ],
            check: `Check: ${pos} is less than the total frequency of ${total}, which makes sense since the ${label} is found using only ${frac} of the data, not all of it.`,
          },
        };
      },
      () => {
        const w1 = pick([2, 4, 6]), d1 = pick([3, 4, 5, 6]);
        const w2 = pick([3, 5, 7, 8]), d2 = pick([2, 3, 4, 5]);
        const f1 = w1 * d1, f2 = w2 * d2;
        const answer = Math.max(f1, f2);
        const decoys = [Math.min(f1, f2), f1 + f2, w1 * w2, d1 * d2].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        const S = 12;
        const svg = svgBox(
          SR(50, 140 - d1 * S * 2, w1 * S, d1 * S * 2, "#22c8b8") + ST(50 + (w1 * S) / 2, 158, "A", undefined, 12, "#2a1a5e", 700) +
          ST(50 + (w1 * S) / 2, 138 - d1 * S * 2, `w=${w1}, fd=${d1}`, undefined, 10) +
          SR(50 + w1 * S + 40, 140 - d2 * S * 2, w2 * S, d2 * S * 2, "#ff6b4a") + ST(50 + w1 * S + 40 + (w2 * S) / 2, 158, "B", undefined, 12, "#2a1a5e", 700) +
          ST(50 + w1 * S + 40 + (w2 * S) / 2, 138 - d2 * S * 2, `w=${w2}, fd=${d2}`, undefined, 10),
          50 + w1 * S + 40 + w2 * S + 40, 180
        );
        return {
          q: `Histogram bar A has width ${w1} and frequency density ${d1}. Bar B has width ${w2} and frequency density ${d2}. Find the LARGER of the two frequencies the bars represent.`,
          options, correctIndex, svg,
          hint: `This is a histogram comparison question. Remember that in a histogram, it's a bar's AREA, not its height, that shows its frequency (how many data values it represents), and a bar's area is its width multiplied by its height (its frequency density). To compare two bars' frequencies, work out each bar's area separately, then compare the two numbers, don't just compare the heights or the widths on their own.`,
          solution: {
            scenario: `Histogram bar A has width ${w1} and frequency density ${d1}. Bar B has width ${w2} and frequency density ${d2}. Find the larger of the two frequencies the bars represent.`,
            idea: `A histogram bar's frequency is represented by its AREA (width multiplied by height), not by its height alone, since bars can have different widths. This is written in maths as frequency = frequency density × width, meaning multiply a bar's height (its frequency density) by its width to get the number of data values it represents.`,
            method: [
              "Multiply bar A's width by its frequency density.",
              "Multiply bar B's width by its frequency density.",
              "Compare the two results and pick the larger.",
            ],
            steps: [
              `Bar A: ${d1} × ${w1} = ${f1}.`,
              `Bar B: ${d2} × ${w2} = ${f2}.`,
              `Compare: the larger of ${f1} and ${f2} is ${answer}.`,
            ],
            check: `Check: ${answer} is greater than or equal to both ${f1} and ${f2}, as a maximum should be.`,
          },
        };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  combinatoricsAndCounting(d) {
    function fact(x) { let f = 1; for (let i = 2; i <= x; i++) f *= i; return f; }
    const tier1 = [
      () => {
        const n = rand(6, 20);
        const answer = n * (n - 1) / 2;
        const decoys = [n * n, n * (n - 1), answer + n, answer - n > 0 ? answer - n : answer + n].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `At a party of ${n} people, everyone shakes hands with everyone else exactly once. How many handshakes take place?`, options, correctIndex,
          hint: `This is a combinations problem. Each handshake involves choosing 2 people from the group — order does not matter (A shaking B's hand is the same as B shaking A's). The number of ways to choose 2 from n is nC2, which equals n times (n minus 1) divided by 2.`,
          solution: {
            idea: `The number of ways to choose 2 items from n where order does not matter is nC2 = n(n-1)/2. Each pair corresponds to exactly one handshake.`,
            steps: [
              `Number of handshakes = ${n}C2 = ${n}x${n - 1}/2 = ${answer}.`
            ]
          }
        };
      },
      () => {
        const digits = pick([4, 5]); const base = pick([6, 8, 10]);
        const answer = Math.pow(base, digits);
        const decoys = [base * digits, Math.pow(base, digits - 1), answer / base, answer * base].filter((v) => v !== answer && Number.isFinite(v));
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `How many ${digits}-digit codes can be made if each digit is chosen from ${base} possible symbols, with repetition allowed?`, options, correctIndex,
          hint: `When each position can be filled independently from the same set of choices, the total number of sequences is (number of choices) raised to the power of (number of positions). Repetition allowed means the same symbol can appear in multiple slots.`,
          solution: {
            idea: `Multiplication principle: if each of n independent choices has k options, the total outcomes are k^n. Each digit slot is independent, so the count is (symbols)^(digits).`,
            steps: [
              `Each of the ${digits} positions has ${base} choices: ${base}^${digits} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const n = rand(5, 10), r = rand(2, 4);
        function perm(nn, rr) { let res = 1; for (let i = 0; i < rr; i++) res *= (nn - i); return res; }
        const answer = perm(n, r);
        const decoys = [perm(n, r - 1), perm(n - 1, r), answer * 2, Math.round(answer / n) || answer + n].filter((v) => v !== answer && Number.isFinite(v) && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `How many ways can ${r} items be chosen and arranged in order from ${n} distinct items? (i.e. ${n}P${r})`, options, correctIndex,
          hint: `A permutation counts ordered selections. The first slot has n choices, the second has n-1, the third n-2, and so on for r slots total. Multiply these counts together to get nPr.`,
          solution: {
            idea: `nPr = n times (n-1) times ... times (n-r+1). Order matters, so choosing A then B is different from choosing B then A.`,
            steps: [
              `${n}P${r} = ${n} x ${Array.from({ length: r - 1 }, (_, i) => n - 1 - i).join(" x ")} = ${answer}.`
            ]
          }
        };
      },
      () => {
        const n = rand(5, 10), r = rand(2, 4);
        const answer = fact(n) / (fact(r) * fact(n - r));
        const decoys = [fact(n) / fact(n - r), answer + n, answer - r > 0 ? answer - r : answer + r, answer * 2].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `How many ways can ${r} items be chosen from ${n} distinct items, where order doesn't matter? (i.e. ${n}C${r})`, options, correctIndex,
          hint: `A combination counts selections where order does not matter. Start with permutations (ordered selections), then divide by r factorial to remove all the duplicate orderings of the same r items.`,
          solution: {
            idea: `nCr = n! / (r! x (n-r)!). Dividing nPr by r! corrects for the over-counting of different orderings of the same selection.`,
            steps: [
              `${n}C${r} = ${n}!/(${r}!x${n - r}!) = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const n = rand(4, 7);
        const answer = fact(n - 1) * 2;
        const decoys = [fact(n), fact(n - 1), answer / 2, answer + fact(n - 1)].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `${n} people are seated in a row. In how many ways can they be arranged if two particular people must sit next to each other?`, options, correctIndex,
          hint: `When two people must be adjacent, treat them as a single block. Arrange the (n-1) blocks in a row: that is (n-1)! ways. Then multiply by 2 because the two people can switch positions within their block.`,
          solution: {
            idea: `Glue the constrained pair into one block, reducing the problem to (n-1) objects in a row. The pair can also swap internally, giving a factor of 2.`,
            steps: [
              `Treat the pair as one block: (${n}-1)! = ${fact(n - 1)} arrangements of the blocks.`,
              `The pair can swap internally in 2 ways: ${fact(n - 1)} x 2 = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const n = rand(4, 8);
        const answer = fact(n - 1);
        const decoys = [fact(n), fact(n - 1) * 2, fact(n - 2), answer + n].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `In how many distinct ways can ${n} people be seated around a circular table? (arrangements that are rotations of each other count as the same)`, options, correctIndex,
          hint: `In circular arrangements, rotating everyone one seat gives the same arrangement. Fix one person in a seat to remove the rotational redundancy, then arrange the remaining (n-1) people freely. This gives (n-1)! distinct seatings.`,
          solution: {
            idea: `Fixing one person's position eliminates rotation equivalences, leaving (n-1) people to arrange in (n-1)! ways.`,
            steps: [
              `Circular arrangements = (n-1)! = (${n}-1)! = ${answer}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  invariantsAndParity(d) {
    const tier1 = [
      () => {
        const n = rand(5, 20);
        const answer = n * n;
        const decoys = [n * (n + 1), 2 * n - 1, answer + n, answer - n].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `What is the sum of the first ${n} odd numbers (1+3+5+...+${2 * n - 1})?`, options, correctIndex,
          hint: `There is a beautiful shortcut here: the sum of the first n odd numbers is always exactly n squared. You do not need to add them all up — just square the count. This is a classic invariant result that holds for every positive integer n.`,
          solution: {
            idea: `The sum of the first n odd numbers equals n squared. Each odd number adds an L-shaped border to a growing square, so n odd numbers together form an n by n square.`,
            steps: [
              `The sum of the first n odd numbers is always n squared. Here n=${n}, so the sum = ${n}^2 = ${answer}.`
            ]
          }
        };
      },
      () => {
        const n = rand(5, 20);
        const answer = n * (n + 1);
        const decoys = [n * n, n * (n - 1), answer + 2, answer - 2].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `What is the sum of the first ${n} even numbers (2+4+6+...+${2 * n})?`, options, correctIndex,
          hint: `Factor out 2 from every term: 2+4+6+...+2n = 2(1+2+3+...+n). The sum 1+2+...+n is the triangular number n(n+1)/2. Multiplying by 2 gives n(n+1).`,
          solution: {
            idea: `The sum 2+4+...+2n = 2(1+2+...+n) = 2 times n(n+1)/2 = n(n+1). The triangular number formula is the key building block.`,
            steps: [
              `The sum of the first n even numbers is always n(n+1). Here n=${n}, so the sum = ${n}x${n + 1} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const o1 = pick([3, 5, 7, 9]); const o2 = pick([3, 5, 7, 9, 11].filter((x) => x !== o1));
        const seen = new Set([`${o1}x${o2}`]);
        const evenPairs = []; let guard = 0;
        while (evenPairs.length < 4 && guard < 200) { guard++; const a = rand(2, 11); const b = rand(2, 11); const key = `${a}x${b}`; if ((a % 2 === 0 || b % 2 === 0) && !seen.has(key)) { seen.add(key); evenPairs.push([a, b]); } }
        if (evenPairs.length < 4) return null;
        const oddPair = [o1, o2];
        const shuffledPairs = shuffle([oddPair, ...evenPairs]);
        const options = shuffledPairs.map(([a, b]) => `${a}x${b}`);
        const correctIndex = shuffledPairs.indexOf(oddPair);
        return { q: `Which of these products is odd?`, options, correctIndex,
          hint: `Parity means whether a number is odd or even. For products: a product is odd only when every factor is odd. If even one factor is even, the product must be even. Find the option where both numbers are odd.`,
          solution: {
            idea: `odd times odd = odd; even times anything = even. This is a fundamental parity rule.`,
            steps: [
              `A product is odd only if BOTH factors are odd.`,
              `${o1}x${o2} = ${o1 * o2}, odd.`
            ]
          }
        };
      },
      () => {
        const k = rand(2, 999); const val = 9 * k;
        function digitalRoot(n) { while (n >= 10) { n = String(n).split("").reduce((s, dd) => s + Number(dd), 0); } return n; }
        const answer = digitalRoot(val);
        const decoys = [answer + 1, answer - 1, answer - 2, answer - 3].filter((v) => v !== answer && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `What is the digital root (repeatedly sum the digits until one digit remains) of ${val} (which is 9 x ${k})?`, options, correctIndex,
          hint: `The digital root is the single digit you get by summing all digits repeatedly. There is a shortcut invariant: every multiple of 9 always has digital root 9. This follows from the fact that 10 is congruent to 1 modulo 9, so a number and its digit sum are equivalent modulo 9.`,
          solution: {
            idea: `Any multiple of 9 has a digit sum that is also a multiple of 9, which eventually reduces to 9. This is an invariant: no matter how big the multiple, the digital root is always 9.`,
            steps: [
              `Any multiple of 9 has digital root 9.`,
              `Digital root of ${val} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const n = rand(3, 8); const arr = Array.from({ length: 2 * n }, () => rand(1, 20));
        const answer = arr.reduce((s, v, i) => i % 2 === 0 ? s + v : s - v, 0);
        const decoys = [arr.reduce((s, v) => s + v, 0), -answer, answer + 2, answer - 2].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Find the alternating sum ${arr.map((v, i) => i === 0 ? v : (i % 2 === 0 ? "+" : "-") + v).join(" ")}.`, options, correctIndex,
          hint: `An alternating sum adds some terms and subtracts others in a regular pattern. Work through left to right, adding terms in positions 1, 3, 5 (odd positions, counting from 1) and subtracting terms in positions 2, 4, 6. Track the running total carefully.`,
          solution: {
            idea: `Apply signs from left to right: add even-indexed terms (0, 2, 4, ...) and subtract odd-indexed terms (1, 3, 5, ...). Careful sign tracking is the key skill.`,
            steps: [
              `Add the terms in odd positions and subtract the terms in even positions: the result is ${answer}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const n = rand(4, 15), m = rand(1, n - 1);
        if (n === m) return null;
        const diff = n * n - m * m;
        const answerLabel = diff % 2 === 0 ? "Even" : "Odd";
        const pool = ["Even", "Odd", "Always prime", "Always a multiple of 4", "Cannot be determined"];
        const options = shuffle(pool);
        const correctIndex = options.indexOf(answerLabel);
        return { q: `n=${n}, m=${m}. Is n^2 - m^2 even or odd?`, options, correctIndex,
          hint: `A number and its square share the same parity (odd squared is odd, even squared is even). The parity of a difference depends on whether the two numbers share parity: same parity gives an even difference, different parities give an odd difference.`,
          solution: {
            idea: `n squared has the same parity as n. So n^2 - m^2 is even when n and m have the same parity, odd when they differ.`,
            steps: [
              `n^2 - m^2 = ${n}^2 - ${m}^2 = ${diff}, which is ${answerLabel.toLowerCase()}.`,
              `(n^2 and m^2 have the same parity as n and m; their difference is even exactly when n and m share the same parity.)`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  logicAndDeduction(d) {
    const tier1 = [
      () => {
        const c = rand(5, 15); const d1 = rand(2, 8), d2 = rand(2, 8);
        const b = c + d1; const a = b + d2;
        const decoys = [b, c, a + d1, a - d2 > 0 ? a - d2 : a + d2].filter((v) => v !== a);
        const { options, correctIndex } = buildMC(a, decoys);
        return { q: `A is ${d2} years older than B. B is ${d1} years older than C. C is ${c} years old. How old is A?`, options, correctIndex,
          hint: `This is a chained deduction. Start with the known fact (C's age) and apply each relationship in turn to find the next unknown. Work from the known end toward the unknown, one step at a time.`,
          solution: {
            idea: `Chain deduction: start from the known value and apply each relationship in sequence. Each step converts one unknown into a known value.`,
            steps: [
              `B = ${c} + ${d1} = ${b}.`,
              `A = ${b} + ${d2} = ${a}.`
            ]
          }
        };
      },
      () => {
        const items = rand(3, 6); const boxes = rand(2, items - 1);
        const answer = Math.ceil(items / boxes);
        const decoys = [Math.floor(items / boxes), boxes, items, answer + 1].filter((v) => v !== answer && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `${items} socks are placed into ${boxes} drawers. What is the minimum number that must be guaranteed in the fullest drawer, no matter how they're arranged?`, options, correctIndex,
          hint: `This is the pigeonhole principle: if you distribute n items into k containers, at least one container must hold at least ceiling(n/k) items, regardless of how they are arranged. "Ceiling" means round up.`,
          solution: {
            idea: `Pigeonhole principle: n items into k containers guarantees at least one container has at least ceiling(n/k) items. No arrangement can avoid this.`,
            steps: [
              `By the pigeonhole principle, at least one drawer must contain at least ceiling(${items}/${boxes}) = ${answer} socks.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const names = shuffle(["Alex", "Sam", "Jo", "Kim"]).slice(0, 2);
        const [p1, p2] = names;
        const answer = p2;
        const options = shuffle(names.concat(["Both are liars", "Neither, both truthful", "Cannot be determined"]));
        const correctIndex = options.indexOf(answer);
        return { q: `${p1} says: "${p1} and ${p2} are both liars." Everyone here is either always a truth-teller or always a liar. Who is the truth-teller?`, options, correctIndex,
          hint: `In truth-teller/liar puzzles, start by testing whether the speaker could be a truth-teller. If ${p1} were truthful, calling themselves a liar would be a contradiction. So ${p1} must be lying, and you can work out what that implies about ${p2}.`,
          solution: {
            idea: `A truth-teller cannot truly call themselves a liar — that is always a contradiction. So any statement that implies this must come from a liar.`,
            steps: [
              `If ${p1} were telling the truth, ${p1} would be admitting to being a liar - a contradiction. So ${p1} is lying.`,
              `Since ${p1}'s statement ("both are liars") is false, it is NOT the case both are liars - so ${p2} must be the truth-teller.`
            ]
          }
        };
      },
      () => {
        const n = rand(20, 80);
        const clue1 = n % 2 === 0 ? "even" : "odd";
        const clue2 = `between ${Math.floor(n / 10) * 10} and ${Math.floor(n / 10) * 10 + 10}`;
        const digitSum = String(n).split("").reduce((s, dd) => s + Number(dd), 0);
        const decoys = [n + 1, n - 1, n + 10, n - 10].filter((v) => v !== n && v > 0);
        const { options, correctIndex } = buildMC(n, decoys);
        return { q: `I am thinking of a number. It is ${clue1}, it is ${clue2}, and its digits add up to ${digitSum}. What is the number?`, options, correctIndex,
          hint: `Use each clue to narrow the possibilities. Start with the range to identify candidates, apply the odd/even clue to halve them, then check the digit sum against each remaining candidate.`,
          solution: {
            idea: `Logical elimination: each clue rules out candidates. Apply the most restrictive clues first to minimise checking.`,
            steps: [
              `Checking the clues against ${n}: it is ${clue1}, lies ${clue2}, and its digit sum is ${digitSum}. ${n} fits all three.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const pool = ["No, we cannot conclude that (the ground could still be wet for another reason)", "Yes, the ground must be dry", "Yes, the ground must be wet", "The statement is a contradiction", "Not enough information about rain"];
        const answer = pool[0];
        const options = shuffle(pool);
        const correctIndex = options.indexOf(answer);
        return { q: `"If it rains, the ground gets wet." It is NOT raining today. Can we validly conclude the ground is dry?`, options, correctIndex,
          hint: `This tests the "denying the antecedent" fallacy. The rule "if P then Q" says nothing about what happens when P is false. Q might still hold for a different reason. Rain causes wet ground, but wet ground does not require rain.`,
          solution: {
            idea: `"If P then Q" does not imply "if not P then not Q." The inverse of a true statement is not necessarily true. Only the contrapositive ("if not Q then not P") is logically equivalent to the original.`,
            steps: [
              `"If it rains, ground wet" only tells us what happens WHEN it rains - it says nothing about when it does not rain.`,
              `Denying the antecedent (not raining) does not let you deny the consequent (wet ground). The ground might be wet from a sprinkler, so we cannot conclude it is dry.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const names = shuffle(["Alex", "Sam", "Jo", "Kim", "Robin"]).slice(0, 3);
        const [p1, p2, p3] = names;
        const answer = p2;
        const options = shuffle([p1, p2, p3, "All three are liars", "All three are truthful"]);
        const correctIndex = options.indexOf(answer);
        return { q: `${p1} says: "${p2} is a liar." ${p2} says: "${p3} is a liar." ${p3} says: "${p1} and ${p2} are both liars." Exactly one of them always tells the truth, and the other two always lie. Who tells the truth?`, options, correctIndex,
          hint: `With exactly one truth-teller, try each person as the candidate. If their statement is consistent with the others being liars and nothing contradicts the constraint of exactly one truth-teller, that person is the answer.`,
          solution: {
            idea: `Test each person as the truth-teller. The correct assignment produces no contradictions and is self-consistent with all three statements.`,
            steps: [
              `Try ${p1} as the truth-teller: then ${p2} is a liar, so ${p2}'s claim that ${p3} is a liar is false, making ${p3} truthful - but only one person can be truthful. Contradiction.`,
              `Try ${p2} as the truth-teller: ${p1} is a liar, so ${p1}'s claim that ${p2} is a liar is false - consistent. ${p2}'s claim that ${p3} is a liar must be true. ${p3}'s claim that both ${p1} and ${p2} are liars is false since ${p2} is truthful - consistent. ${p2} is the truth-teller.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  diophantineEquations(d) {
    const tier1 = [
      () => {
        const coins5 = rand(2, 10), coins10 = rand(2, 10); const total = coins5 * 5 + coins10 * 10;
        const decoys = [coins5 + coins10, total + 5, total - 5, coins5 * 10 + coins10 * 5].filter((v) => v !== total && v > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        return { q: `A piggy bank has ${coins5} 5p coins and ${coins10} 10p coins. What is the total value in pence?`, options, correctIndex,
          hint: `Multiply each coin count by its value and add the results. This is a straightforward evaluation of a linear expression in two variables — the simplest form of a Diophantine (integer-valued) equation.`,
          solution: {
            idea: `Total = 5 times (5p coins) + 10 times (10p coins). Each coefficient is a whole number, giving an integer result.`,
            steps: [
              `${coins5}x5 + ${coins10}x10 = ${coins5 * 5} + ${coins10 * 10} = ${total}p.`
            ]
          }
        };
      },
      () => {
        const tens = rand(1, 9), units = rand(0, 9); const num = tens * 10 + units;
        const sum = tens + units; const diff = tens - units;
        const decoys = [units * 10 + tens, num + 9, num - 9, tens * units].filter((v) => v !== num && v >= 0 && v <= 99);
        const { options, correctIndex } = buildMC(num, decoys);
        return { q: `A two-digit number has digit sum ${sum} and its tens digit minus its units digit equals ${diff}. What is the number?`, options, correctIndex,
          hint: `Let the tens digit be t and units digit be u. You have two equations: t + u = digit sum, and t - u = difference. Add them to find t (the addition eliminates u), then substitute back to find u. The number is 10t + u.`,
          solution: {
            idea: `Two equations in two unknowns (the digits). Adding eliminates one variable directly. This needs integer solutions between 0 and 9.`,
            steps: [
              `tens+units=${sum} and tens-units=${diff}. Adding: 2 x tens=${sum + diff}, so tens=${tens}.`,
              `units = ${sum}-${tens} = ${units}.`,
              `The number is ${num}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const a = pick([3, 4, 5]), b = pick([2, 3]);
        if (gcd(a, b) !== 1) return null;
        const x0 = rand(1, 6); const c = a * x0 + b * rand(1, 6);
        const rem = c - a * x0;
        if (rem < 0 || rem % b !== 0) return null;
        const y = rem / b;
        const decoys = [y + 1, y - 1 >= 0 ? y - 1 : y + 2, x0, c].filter((v) => v !== y && v >= 0);
        const { options, correctIndex } = buildMC(y, decoys);
        return { q: `${a}x + ${b}y = ${c}. If x = ${x0}, find y.`, options, correctIndex,
          hint: `Substitute the given x into the equation to get a simple equation in y alone. Solve as a normal linear equation. The result should be a whole number.`,
          solution: {
            idea: `Substituting a known integer for one variable reduces the Diophantine equation to a single linear equation in the other variable.`,
            steps: [
              `${a}x${x0} = ${a * x0}.`,
              `${b}y = ${c} - ${a * x0} = ${rem}, so y = ${y}.`
            ]
          }
        };
      },
      () => {
        const a = pick([4, 6, 8, 9, 10]); const b = pick([6, 8, 9, 10, 12].filter((x) => x !== a));
        const g = gcd(a, b);
        const cIsMultiple = pick([true, false]);
        const c = cIsMultiple ? g * rand(2, 10) : g * rand(2, 10) + 1;
        const hasSolution = c % g === 0;
        const answerLabel = hasSolution ? "Yes, solutions exist" : "No solutions exist";
        const pool = ["Yes, solutions exist", "No solutions exist", "Only x=0,y=0 works", "Infinitely many exist only if a=b", "Cannot be determined"];
        const options = shuffle(pool);
        const correctIndex = options.indexOf(answerLabel);
        return { q: `Does ${a}x + ${b}y = ${c} have a solution in integers (positive, negative or zero allowed)?`, options, correctIndex,
          hint: `The HCF (highest common factor, also known as GCD — greatest common divisor) of the coefficients determines whether integer solutions exist. If the HCF does not divide the right-hand side exactly, there are no integer solutions at all.`,
          solution: {
            idea: `By Bezout's theorem, ax + by = c has integer solutions exactly when HCF(a,b) divides c. The HCF is the smallest positive value achievable by ax + by over all integers x, y.`,
            steps: [
              `HCF(${a},${b}) = ${g}. Integer solutions exist only if ${g} divides ${c}.`,
              `${c} ${hasSolution ? "is" : "is not"} a multiple of ${g}, so: ${answerLabel}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const a = pick([2, 3]), b = pick([5, 7]);
        const x0 = rand(0, 4), y0 = rand(0, 4); const N = a * x0 + b * y0;
        let count = 0;
        for (let x = 0; x * a <= N; x++) { if ((N - a * x) % b === 0 && (N - a * x) >= 0) count++; }
        const decoys = [count + 1, count - 1 >= 0 ? count - 1 : count + 1, x0 + y0, Math.floor(N / (a + b))].filter((v) => v !== count && v >= 0);
        const { options, correctIndex } = buildMC(count, decoys);
        return { q: `How many pairs of non-negative integers (x,y) satisfy ${a}x + ${b}y = ${N}?`, options, correctIndex,
          hint: `Try each feasible value of x starting from 0. For each x, the remaining amount N minus ax must be non-negative and divisible by b to give a valid whole-number y. Count the values of x that work.`,
          solution: {
            idea: `Systematically enumerate x from 0 to floor(N/a). For each x, y = (N - ax)/b must be a non-negative integer. Count valid cases.`,
            steps: [
              `Check each value of x from 0 upward and see if (${N} - ${a}x) is a non-negative multiple of ${b}. There are ${count} valid pairs.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const N = rand(6, 15);
        let count = 0;
        for (let x = 0; x <= N; x++) for (let y = 0; y <= N - x; y++) count++;
        const decoys = [N, N * N, count + N, count - N > 0 ? count - N : count + N].filter((v) => v !== count && v > 0);
        const { options, correctIndex } = buildMC(count, decoys);
        return { q: `How many triples of non-negative integers (x,y,z) satisfy x + y + z = ${N}?`, options, correctIndex,
          hint: `For each value of x from 0 to N, the remaining amount N minus x must be split between y and z. The number of non-negative ways to split m between y and z is m+1 (y can be 0, 1, ..., m). Sum this over all valid x.`,
          solution: {
            idea: `Fix x, then count pairs (y,z) with y+z = N-x: there are N-x+1 such pairs. Summing over x from 0 to N gives the total count.`,
            steps: [
              `Each pair (x,y) with x+y at most ${N} gives exactly one z = ${N}-x-y. Counting all such pairs gives ${count} triples.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  optimisationAndExtremal(d) {
    const tier1 = [
      () => {
        const perim = pick([20, 24, 28, 32, 36, 40]); const half = perim / 2;
        const maxArea = Math.floor(half / 2) * Math.ceil(half / 2);
        const decoys = [half * half / 4, maxArea + half, maxArea - 2, half].filter((v) => v !== maxArea && Number.isFinite(v));
        const { options, correctIndex } = buildMC(maxArea, decoys);
        return { q: `A rectangle has perimeter ${perim}. What is the maximum possible integer-sided area?`, options, correctIndex,
          hint: `For a fixed perimeter, the rectangle with maximum area is the one closest to a square. The length plus width is fixed at half the perimeter, and the product of two numbers with a fixed sum is greatest when they are as equal as possible.`,
          solution: {
            idea: `For fixed sum s = length + width, the area (product) is maximised when length = width = s/2. This is the AM-GM inequality in action.`,
            steps: [
              `Length+width = ${half}. Area is maximised when the two sides are as close as possible: ${Math.floor(half / 2)} and ${Math.ceil(half / 2)}.`,
              `Max area = ${Math.floor(half / 2)} x ${Math.ceil(half / 2)} = ${maxArea}.`
            ]
          }
        };
      },
      () => {
        const sum = pick([10, 12, 14, 16, 18, 20]);
        const maxProduct = Math.floor(sum / 2) * Math.ceil(sum / 2);
        const decoys = [sum * sum / 4, maxProduct + sum, maxProduct - 4, sum].filter((v) => v !== maxProduct && Number.isFinite(v));
        const { options, correctIndex } = buildMC(maxProduct, decoys);
        return { q: `Two positive integers add up to ${sum}. What is the greatest possible value of their product?`, options, correctIndex,
          hint: `The product of two numbers with a fixed sum is greatest when the numbers are as close to equal as possible. Numbers that are far apart (one large, one small) waste product potential.`,
          solution: {
            idea: `For fixed sum s, the product xy with x+y = s is maximised at x = y = s/2. For integers, use the closest pair to equal.`,
            steps: [
              `The product is greatest when the two numbers are as close together as possible: ${Math.floor(sum / 2)} and ${Math.ceil(sum / 2)}.`,
              `Product = ${Math.floor(sum / 2)} x ${Math.ceil(sum / 2)} = ${maxProduct}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const total = rand(20, 60); const size = pick([3, 4, 5, 6]);
        const answer = Math.floor(total / size);
        const decoys = [Math.ceil(total / size), answer + 1, answer - 1 > 0 ? answer - 1 : answer + 2, total - size * answer].filter((v) => v !== answer && v >= 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `A ribbon is ${total} cm long. What is the maximum number of ${size} cm pieces that can be cut from it?`, options, correctIndex,
          hint: `Divide the total length by the piece length and round down (discard any remainder). A partial piece is too short to use, so rounding up would give more pieces than actually possible.`,
          solution: {
            idea: `Maximum whole pieces = floor(total / piece size). The remainder is wasted material that is too short for another complete piece.`,
            steps: [
              `${total} / ${size} = ${(total / size).toFixed(2)}, so at most ${answer} whole pieces can be cut.`
            ]
          }
        };
      },
      () => {
        const need = rand(15, 40); const packSize = pick([4, 6, 8]); const price = pick([2, 3, 4]);
        const packs = Math.ceil(need / packSize);
        const cost = packs * price;
        const decoys = [Math.floor(need / packSize) * price, cost + price, cost - price > 0 ? cost - price : cost + price, packs * price + 1].filter((v) => v !== cost && v > 0);
        const { options, correctIndex } = buildMC(cost, decoys);
        return { q: `Items come in packs of ${packSize} costing £${price} each. What is the minimum cost to buy at least ${need} items?`, options, correctIndex,
          hint: `Divide the required number by the pack size and round up to get the number of packs needed. You may end up with a few extra items, but you must buy whole packs. Then multiply by the pack price.`,
          solution: {
            idea: `Minimum packs = ceiling(need / pack size). Rounding up ensures you buy enough. Minimum cost = packs times price per pack.`,
            steps: [
              `${need} / ${packSize} = ${(need / packSize).toFixed(2)}, so you need ${packs} whole packs.`,
              `Cost = ${packs} x £${price} = £${cost}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
        const sortedDesc = [...digits].sort((a, b) => b - a);
        const answer = Number(sortedDesc.join(""));
        const wrong1 = Number([...digits].sort((a, b) => a - b).join(""));
        const decoys = [wrong1, answer - 1, answer + 1, Number(digits.join(""))].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Using the digits ${digits.join(", ")} exactly once each, what is the greatest possible 4-digit number you can form?`, options, correctIndex,
          hint: `To maximise a number, put the largest digit in the most significant position (leftmost), then the next largest, and so on. This greedy approach works because higher-place digits dominate the value.`,
          solution: {
            idea: `A greedy digit-by-digit strategy: place the largest available digit in the highest position at each step. The leading digit contributes most to the total value.`,
            steps: [
              `Arrange the digits from largest to smallest: ${sortedDesc.join("")}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const fence = pick([20, 24, 28, 32, 36, 40, 44]);
        const w = Math.round(fence / 4); const l = fence - 2 * w;
        const maxArea = w * l;
        const decoys = [w * w, (fence / 2) * (fence / 2) / 2, maxArea + w, maxArea - l].filter((v) => v !== maxArea && Number.isFinite(v) && v > 0);
        const { options, correctIndex } = buildMC(maxArea, decoys);
        return { q: `A farmer has ${fence}m of fencing to build a rectangular pen against a wall (so only 3 sides need fencing: two widths and one length). What integer width gives the maximum area, and what is that area?`, options, correctIndex,
          hint: `With the wall providing one length, only three sides need fencing: 2w + l = total fence. Express l as total minus 2w, then write area = w times l and maximise. For three-sided enclosures the optimal width is total fence divided by 4.`,
          solution: {
            idea: `Area = w(fence - 2w), a quadratic in w with maximum at w = fence/4. This differs from the four-sided case because the wall removes one length from the fencing requirement.`,
            steps: [
              `Area = w(${fence}-2w), maximised at w = ${fence}/4 = ${w}.`,
              `Length = ${fence}-2x${w} = ${l}. Max area = ${w}x${l} = ${maxArea}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  proofTechniques(d) {
    const FLAW_POOL = ["Uses one specific example instead of a general argument", "Asserts a fact without proving it", "Proves existence but not uniqueness", "Assumes the conclusion as part of the argument (circular)", "The proof is actually complete and correct"];
    const tier1 = [
      () => {
        const n = pick([3, 5, 7]);
        const options = shuffle(FLAW_POOL);
        const answer = "Uses one specific example instead of a general argument";
        const correctIndex = options.indexOf(answer);
        return { q: `A student claims "n squared + n is always even" and proves it by checking that when n=${n}, n squared+n = ${n * n + n}, which is even. What is wrong with this proof?`, options, correctIndex,
          hint: `A proof that something holds "for all" cases needs a general argument, not just a check of one case. Testing a specific value only shows the claim is true there — it tells you nothing about any other value of n. A genuine proof must work for every possible n simultaneously.`,
          solution: {
            idea: `Proof by example is not a valid proof of a universal statement. To prove "for all n," you need an argument that works for every n without specifying a particular value. Checking one (or even many) cases leaves infinitely many unchecked.`,
            steps: [
              `Checking one value of n shows the claim holds for that case, but a "for all n" claim needs a general argument (e.g. n squared+n = n(n+1), the product of two consecutive integers, one of which is always even).`,
              `${answer}.`
            ]
          }
        };
      },
      () => {
        const options = shuffle(FLAW_POOL);
        const answer = "Asserts a fact without proving it";
        const correctIndex = options.indexOf(answer);
        return { q: `In a geometry proof, a student writes "angle ABC = 40 degrees, so triangle ABC is isosceles" without giving any reason connecting the angle to the triangle's side lengths. What is wrong with this step?`, options, correctIndex,
          hint: `In a proof, every logical step must be justified with a stated reason — a theorem, a definition, or a property. Simply stating a conclusion without linking it to the given information is not a proof step; it is an assertion. The jump from "angle equals 40 degrees" to "the triangle is isosceles" needs an explicit geometric reason.`,
          solution: {
            idea: `Each step in a proof must follow from the previous by a stated rule or theorem. An unjustified assertion leaves the reader unable to verify the reasoning.`,
            steps: [
              `A conclusion about sides (isosceles) needs a stated reason (e.g. an angle rule showing two angles are equal, hence two sides are equal) - simply asserting it is not a proof.`,
              `${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const options = shuffle(FLAW_POOL);
        const answer = "Proves existence but not uniqueness";
        const correctIndex = options.indexOf(answer);
        return { q: `A student is asked to find the maximum value of a quantity. They find one arrangement giving a large value and conclude "this is the maximum" without checking whether any other arrangement could give a larger value. What is missing from this argument?`, options, correctIndex,
          hint: `Finding a good value shows a large value CAN be achieved (existence), but to claim it is the maximum you must also show that no other arrangement can beat it (uniqueness of the maximum). Without the second part, you have only shown a lower bound, not the maximum.`,
          solution: {
            idea: `Proving a maximum requires two parts: (1) show the claimed value is achievable, and (2) show no value can be larger. Omitting part 2 leaves the argument incomplete.`,
            steps: [
              `Finding a good value shows a large value CAN be achieved, but does not rule out something even larger - a true maximum proof must also show no arrangement beats it.`,
              `${answer}.`
            ]
          }
        };
      },
      () => {
        const options = shuffle(FLAW_POOL);
        const answer = "Assumes the conclusion as part of the argument (circular)";
        const correctIndex = options.indexOf(answer);
        return { q: `To prove "all multiples of 6 are even", a student writes "let n be a multiple of 6, so n is even; multiples of 6 are even because they're even." What is wrong with this?`, options, correctIndex,
          hint: `Circular reasoning uses the thing you are trying to prove as part of the argument. The conclusion appears inside the reasoning instead of following from independent premises. A valid proof of "P implies Q" must reach Q using only P and already-established facts, not Q itself.`,
          solution: {
            idea: `Circular reasoning: the argument assumes n is even, which is precisely what it is supposed to prove. A valid proof would instead use 6 = 2 times 3, so any multiple of 6 is 2 times (3 times k) = 2 times (integer), which is even.`,
            steps: [
              `The argument assumes n is even partway through, which is the very thing it is meant to be proving - this is circular reasoning, not a valid proof.`,
              `${answer}.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const options = shuffle(FLAW_POOL);
        const answer = "The proof is actually complete and correct";
        const correctIndex = options.indexOf(answer);
        return { q: `Proof: "Let n be any integer. Then n(n+1) is the product of two consecutive integers. One of any two consecutive integers must be even, so their product is even. Hence n(n+1) is always even, for every integer n." What is wrong with this proof?`, options, correctIndex,
          hint: `Before spotting a flaw, check whether the proof is actually valid. A valid proof is general (covers every n), gives a clear reason for each step, and reaches the correct conclusion. If all three hold, it may be that nothing is wrong.`,
          solution: {
            idea: `A proof that is general, well-reasoned, and correctly concludes has no flaw. Trick questions test whether you recognise a correct argument, not just incorrect ones.`,
            steps: [
              `Nothing is wrong. The argument is general (works for ANY n, not a specific case), gives a clear reason (one of two consecutive integers is always even), and reaches the full conclusion.`,
              `${answer}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        function isPrime(x) { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; }
        let counter = 1; while (isPrime(counter * counter + counter + 1)) counter++;
        const decoys = [counter + 1, counter - 1 > 0 ? counter - 1 : counter + 2, counter + 2, counter + 3].filter((v) => v !== counter && v > 0);
        const { options, correctIndex } = buildMC(counter, decoys);
        return { q: `A claim states "n squared + n + 1 is always prime for positive integers n." What is the SMALLEST value of n that disproves this claim (a counterexample)?`, options, correctIndex,
          hint: `To disprove a "for all n" claim, you only need one counterexample — a specific n where the statement is false. Test n = 1, 2, 3, ... in order and check each result for primality. The first n that fails is the smallest counterexample.`,
          solution: {
            idea: `A universal claim "P(n) for all n" is disproved by exhibiting one n where P(n) is false. Finding the smallest counterexample requires testing values in increasing order.`,
            steps: [
              `Testing n=1,2,3,...: n squared+n+1 gives 3, 7, 13, 21, ... checking each for primality.`,
              `n=${counter} gives ${counter * counter + counter + 1}, which is not prime - the first failure, so it is the smallest counterexample.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  speedAndRelativeMotion(d) {
    const tier1 = [
      () => {
        const time = pick([2, 3, 4, 5, 6]); const speed0 = rand(20, 90); const dist = speed0 * time;
        const decoys = [dist * time, time, speed0 + 5, speed0 - 5 > 0 ? speed0 - 5 : speed0 + 5].filter((v) => v !== speed0 && v > 0);
        const { options, correctIndex } = buildMC(speed0, decoys);
        return { q: `A car travels ${dist} km in ${time} hours. What is its average speed in km/h?`, options, correctIndex,
          hint: `The three quantities distance, speed, and time are linked by: distance = speed times time. Rearrange to find speed: speed = distance divided by time. Make sure the units are consistent (km and hours give km/h).`,
          solution: {
            idea: `Speed = distance divided by time. This is the definition of average speed: total distance covered divided by total time taken.`,
            steps: [
              `Speed = distance / time = ${dist} / ${time} = ${speed0} km/h.`
            ]
          }
        };
      },
      () => {
        const distApart = rand(10, 40) * 10; const speedA = pick([40, 50, 60, 70]); const speedB = pick([30, 40, 50]);
        const relSpeed = speedA + speedB;
        if (distApart % relSpeed !== 0) return null;
        const time = distApart / relSpeed;
        const decoys = [Math.round(distApart / speedA), Math.round(distApart / speedB), time + 1, time - 1 > 0 ? time - 1 : time + 1].filter((v) => v !== time && Number.isFinite(v) && v > 0);
        const { options, correctIndex } = buildMC(time, decoys);
        return { q: `Two trains start ${distApart} km apart and travel toward each other, one at ${speedA} km/h and the other at ${speedB} km/h. How many hours until they meet?`, options, correctIndex,
          hint: `When two objects move toward each other, their closing speed is the sum of their individual speeds. Divide the initial gap by this combined speed to find the time until they meet.`,
          solution: {
            idea: `Relative speed (moving toward each other) = sum of speeds. Time to meet = gap / relative speed. The gap closes at the combined rate.`,
            steps: [
              `Combined closing speed = ${speedA} + ${speedB} = ${relSpeed} km/h.`,
              `Time = ${distApart} / ${relSpeed} = ${time} hours.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const gap = rand(10, 60); const slowSpeed = pick([40, 50, 60]); const fastSpeed = slowSpeed + pick([10, 20, 30]);
        const relSpeed = fastSpeed - slowSpeed;
        if ((gap * 60) % relSpeed !== 0) return null;
        const answer = (gap * 60) / relSpeed;
        const decoys = [Math.round(gap / fastSpeed * 60), Math.round(gap / slowSpeed * 60), answer + 10, answer - 10 > 0 ? answer - 10 : answer + 10].filter((v) => v !== answer && v > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `A car travelling at ${fastSpeed} km/h chases another travelling at ${slowSpeed} km/h, starting ${gap} km behind. How many minutes until it catches up?`, options, correctIndex,
          hint: `When two objects travel in the same direction, the closing speed is the difference of their speeds. Divide the initial gap by this relative speed to find the time in hours, then convert to minutes by multiplying by 60.`,
          solution: {
            idea: `Relative speed (same direction) = faster speed minus slower speed. Time to close the gap = gap / relative speed. Convert hours to minutes by multiplying by 60.`,
            steps: [
              `Relative speed = ${fastSpeed} - ${slowSpeed} = ${relSpeed} km/h.`,
              `Time = ${gap}/${relSpeed} hours = ${answer} minutes.`
            ]
          }
        };
      },
      () => {
        const d1 = pick([60, 80, 100, 120]); const s1 = pick([20, 30, 40]); const d2 = pick([60, 80, 100, 120]); const s2 = pick([40, 50, 60]);
        if (d1 % s1 !== 0 || d2 % s2 !== 0) return null;
        const t1 = d1 / s1, t2 = d2 / s2; const totalD = d1 + d2, totalT = t1 + t2;
        const avgSpeed = Math.round((totalD / totalT) * 100) / 100;
        const decoys = [Math.round(((s1 + s2) / 2) * 100) / 100, s1, s2, avgSpeed + 5].filter((v) => v !== avgSpeed && Number.isFinite(v));
        const { options, correctIndex } = buildMC(avgSpeed, decoys, (v) => v.toFixed(2));
        return { q: `A journey covers ${d1} km at ${s1} km/h, then ${d2} km at ${s2} km/h. What is the average speed for the whole journey (to 2 d.p.)?`, options, correctIndex,
          hint: `Average speed for a whole journey is total distance divided by total time — not the simple average of the two speeds. Calculate the time for each leg separately, add the distances, add the times, then divide.`,
          solution: {
            idea: `Average speed = total distance / total time. The simple average of two speeds is only correct if equal time is spent at each speed, not equal distance.`,
            steps: [
              `Time for leg 1 = ${d1}/${s1} = ${t1}h. Time for leg 2 = ${d2}/${s2} = ${t2}h.`,
              `Average speed = total distance / total time = ${totalD}/${totalT} = ${avgSpeed} km/h.`
            ]
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const dist = rand(10, 40) * 10; const time = pick([2, 3, 4, 5]);
        if (dist % time !== 0) return null;
        const combinedSpeed = dist / time; const candidates = [20, 30, 40].filter((s) => s < combinedSpeed);
        const speedA = pick(candidates);
        if (!speedA) return null;
        const speedB = combinedSpeed - speedA;
        const decoys = [combinedSpeed, speedA, speedB + 5, speedB - 5 > 0 ? speedB - 5 : speedB + 5].filter((v) => v !== speedB && v > 0);
        const { options, correctIndex } = buildMC(speedB, decoys);
        return { q: `Two cyclists start ${dist} km apart and cycle toward each other, meeting after ${time} hours. One cycles at ${speedA} km/h. What is the other's speed?`, options, correctIndex,
          hint: `When two objects travel toward each other and meet after a known time, their combined speed is total distance divided by time. Subtract the known speed from the combined speed to find the unknown speed.`,
          solution: {
            idea: `Combined speed = total distance / time. Since they move toward each other, their speeds add. Subtract one to find the other.`,
            steps: [
              `Combined speed = ${dist}/${time} = ${combinedSpeed} km/h.`,
              `Other speed = ${combinedSpeed} - ${speedA} = ${speedB} km/h.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const dist = rand(80, 30) + 300; const speedA = pick([40, 50, 60]); const speedB = pick([30, 40, 50]); const headStart = pick([1, 2]);
        const distCoveredByA = speedA * headStart; const remaining = dist - distCoveredByA;
        if (remaining <= 0) return null;
        const relSpeed = speedA + speedB;
        if (remaining % relSpeed !== 0) return null;
        const timeAfterBStarts = remaining / relSpeed;
        const decoys = [timeAfterBStarts + headStart, Math.round(dist / relSpeed), timeAfterBStarts + 1, timeAfterBStarts - 1 > 0 ? timeAfterBStarts - 1 : timeAfterBStarts + 1].filter((v) => v !== timeAfterBStarts && Number.isFinite(v) && v > 0);
        const { options, correctIndex } = buildMC(timeAfterBStarts, decoys);
        return { q: `Two towns are ${dist} km apart. A cyclist leaves town A at ${speedA} km/h. ${headStart} hour${headStart > 1 ? "s" : ""} later, a second cyclist leaves town B at ${speedB} km/h heading toward the first. How many hours after the SECOND cyclist starts do they meet?`, options, correctIndex,
          hint: `First find how far the first cyclist has travelled by the time the second one sets off. Subtract this from the total distance to find the remaining gap when both are moving. Then divide this gap by their combined speed (they move toward each other).`,
          solution: {
            idea: `Reduce to a simpler problem: find the gap when both are simultaneously moving, then apply the closing-speed formula (gap / combined speed).`,
            steps: [
              `By the time B starts, A has already covered ${speedA}x${headStart} = ${distCoveredByA} km, leaving ${remaining} km between them.`,
              `Closing speed = ${speedA}+${speedB} = ${relSpeed} km/h.`,
              `Time = ${remaining}/${relSpeed} = ${timeAfterBStarts} hours.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
  estimationAndBounds(d) {
    const tier1 = [
      () => {
        const rounded = rand(20, 500);
        const lower = rounded - 0.5; const upper = rounded + 0.5;
        const wantUpper = pick([true, false]);
        const answer = wantUpper ? upper : lower;
        const decoys = [wantUpper ? lower : upper, rounded, answer + 1, answer - 1].filter((v) => v !== answer);
        const { options, correctIndex } = buildMC(answer, decoys, (v) => v.toFixed(1));
        return { q: `A length is measured as ${rounded} cm, rounded to the nearest whole number. What is the ${wantUpper ? "upper" : "lower"} bound of the actual length?`, options, correctIndex,
          hint: `When a measurement is rounded to the nearest whole number, the true value could be anywhere in a range of half a unit either side. The lower bound is 0.5 below the rounded value, and the upper bound is 0.5 above it. The upper bound uses a strict inequality (the true value is less than, not equal to, the upper bound).`,
          solution: {
            idea: `Rounding to the nearest whole number gives an error of at most 0.5. So the true value lies in [rounded - 0.5, rounded + 0.5). The bounds are exactly 0.5 from the rounded value.`,
            steps: [
              `Rounding to the nearest whole number means the true value is within 0.5 either side.`,
              `${wantUpper ? "Upper" : "Lower"} bound = ${rounded} ${wantUpper ? "+" : "-"} 0.5 = ${answer} cm.`
            ]
          }
        };
      },
      () => {
        const a = rand(150, 850), b = rand(15, 85);
        const estA = round1SF(a), estB = round1SF(b);
        const answer = estA * estB;
        const decoys = [a * b, answer + estA, answer - estB > 0 ? answer - estB : answer + estB, estA * b].filter((v) => v !== answer && Number.isFinite(v));
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Estimate ${a} x ${b} by rounding each number to 1 significant figure first.`, options, correctIndex,
          hint: `Rounding to 1 significant figure (1 s.f.) means keeping only the first non-zero digit and replacing the rest with zeros. For example, 347 rounds to 300 and 68 rounds to 70. Multiply the rounded values to get the estimate.`,
          solution: {
            idea: `1 significant figure means the leading (first non-zero) digit only, with subsequent digits replaced by zeros. This simplifies mental arithmetic at the cost of some precision.`,
            steps: [
              `${a} rounds to ${estA}, ${b} rounds to ${estB}.`,
              `Estimate = ${estA} x ${estB} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      () => {
        const a = rand(10, 50), b = rand(10, 50);
        const upperPerim = 2 * ((a + 0.5) + (b + 0.5));
        const normalPerim = 2 * (a + b);
        const decoys = [normalPerim, upperPerim + 1, upperPerim - 1, normalPerim + 1].filter((v) => v !== upperPerim);
        const { options, correctIndex } = buildMC(upperPerim, decoys, (v) => v.toFixed(1));
        return { q: `A rectangle's sides are measured as ${a} cm and ${b} cm, each rounded to the nearest whole number. What is the maximum possible perimeter?`, options, correctIndex,
          hint: `To find the maximum possible perimeter, use the upper bound of each measurement. Each side could be up to 0.5 cm more than its measured value, so the upper bounds are ${a + 0.5} and ${b + 0.5}. Calculate the perimeter using these upper bounds.`,
          solution: {
            idea: `The maximum perimeter uses the upper bounds of all four sides. Upper bound of each side = measured value + 0.5. Perimeter = 2(upper bound 1 + upper bound 2).`,
            steps: [
              `Each side's upper bound is 0.5 more: ${a + 0.5} cm and ${b + 0.5} cm.`,
              `Max perimeter = 2x(${a + 0.5}+${b + 0.5}) = ${upperPerim} cm.`
            ]
          }
        };
      },
      () => {
        const whole = rand(3, 50); const frac = pick([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const val = whole + frac / 10;
        const truncated = whole;
        const rounded = frac >= 5 ? whole + 1 : whole;
        const decoys = [rounded, whole + 1, whole - 1 > 0 ? whole - 1 : whole + 2, whole + 2].filter((v) => v !== truncated && Number.isFinite(v));
        const { options, correctIndex } = buildMC(truncated, decoys);
        return { q: `Truncate ${val} to a whole number (cut off the decimal part, don't round).`, options, correctIndex,
          hint: `Truncating means simply cutting off the decimal part — whatever it is — without rounding. The result is always the whole number part, which is always less than or equal to the original. This differs from rounding, which adjusts the last digit based on what follows.`,
          solution: {
            idea: `Truncation discards the fractional part unconditionally, always rounding toward zero. For positive numbers this is the same as floor (round down).`,
            steps: [
              `Truncating just removes everything after the decimal point: ${val} becomes ${truncated}.`,
              rounded !== truncated ? `(Note: rounding would instead give ${rounded}, since the decimal digit is ${frac} which is ${frac >= 5 ? "at least" : "less than"} 5.)` : `(Here truncating and rounding happen to agree.)`
            ].filter(Boolean)
          }
        };
      },
    ];
    const tier3 = [
      () => {
        const mantissa = pick([1.2, 2.5, 3.4, 4.8, 5.6, 7.1, 9.3]); const exp = rand(-4, 6);
        const val = Number((mantissa * Math.pow(10, exp)).toPrecision(10));
        const answer = `${mantissa} x 10^${exp}`;
        const decoys = [`${mantissa} x 10^${exp + 1}`, `${mantissa} x 10^${exp - 1}`, `${mantissa * 10} x 10^${exp - 1}`, `${mantissa} x 10^${exp + 2}`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Write ${val} in standard form.`, options, correctIndex,
          hint: `Standard form (also called scientific notation) writes a number as a decimal between 1 and 10 (the mantissa) multiplied by a power of 10. Identify the first significant digit, write the mantissa, then count how many places you moved the decimal point to determine the exponent (positive = moved left, negative = moved right).`,
          solution: {
            idea: `Standard form: A x 10^n where 1 at most A less than 10. To find n, count how many times you must multiply or divide by 10 to convert A back to the original number.`,
            steps: [
              `${val} = ${mantissa} x 10^${exp}.`
            ]
          }
        };
      },
    ];
    const tier4 = [
      () => {
        const m1 = pick([2, 3, 4]), e1 = rand(2, 5); const m2 = pick([2, 3]), e2 = rand(2, 5);
        const productMantissa = m1 * m2; const productExp = e1 + e2;
        let finalMantissa = productMantissa, finalExp = productExp;
        if (finalMantissa >= 10) { finalMantissa /= 10; finalExp += 1; }
        const answer = `${finalMantissa} x 10^${finalExp}`;
        const decoys = [`${productMantissa} x 10^${productExp}`, `${finalMantissa} x 10^${finalExp + 1}`, `${finalMantissa} x 10^${finalExp - 1}`, `${finalMantissa + 1} x 10^${finalExp}`, `${finalMantissa} x 10^${finalExp + 2}`].filter((x) => x !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Calculate (${m1} x 10^${e1}) x (${m2} x 10^${e2}), giving your answer in standard form.`, options, correctIndex,
          hint: `To multiply two numbers in standard form: multiply the mantissas together and add the exponents. If the result's mantissa is 10 or more, divide it by 10 and add 1 to the exponent to put it back into standard form.`,
          solution: {
            idea: `(A x 10^m) x (B x 10^n) = (A x B) x 10^(m+n). If A x B is 10 or more, rewrite as (A x B / 10) x 10^(m+n+1) to restore the standard form requirement that the mantissa lies in [1, 10).`,
            steps: [
              `Multiply the mantissas and add the exponents: ${m1}x${m2}=${productMantissa}, exponent ${e1}+${e2}=${productExp}.`,
              finalMantissa !== productMantissa ? `Since ${productMantissa} is at least 10, rewrite in proper standard form: ${finalMantissa} x 10^${finalExp}.` : `Already in standard form: ${answer}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },
};
export const INTERMEDIATE_OLYMPIAD_PLAYBOOK = { steps: [], tactics: [] };
export const INTERMEDIATE_OLYMPIAD = [];
export const INTERMEDIATE_RARITY = JUNIOR_RARITY;
// Only commons + uncommons get a class (class only matters for adventure party composition,
// which doesn't exist yet for Gifford) — same rule as JUNIOR_CARD_CLASS/PRIMARY_CARD_CLASS.
export const INTERMEDIATE_CARD_CLASS = {
  gf_higgins: "tank", gf_colworth: "tank",
  gf_nettle: "healer", gf_adavoss: "healer",
  gf_marta: "wizard", gf_jory: "wizard",
  gf_pip: "melee", gf_tambrindle: "melee",
  gf_ratchet: "ranged",
  gf_fenn: "tank", gf_delphine: "ranged", gf_growl: "melee", gf_pemberton: "wizard", gf_maude: "healer",
};
export const INTERMEDIATE_MAX_LEVEL = 10;
/* Boss names/lore reuse the antagonists already locked in GIFFORD_CARD_ART_FULL_RULESET.md
   (chapters 1-10) so the mock-exam ladder is tied to the story from day one. `need`
   thresholds are placeholder-but-reasonable escalating values, tunable once real card
   strength distributions exist (same status as Primary/Junior's own tuned-by-feel values). */
export const INTERMEDIATE_BOSSES = [
  { n: 1,  name: "Senior Examiner Vera Kross", emoji: "⏱️", need: 6,  lore: "She has just set a brass pocket watch down on the desk, face up, and taken her hand away." },
  { n: 2,  name: "Tracker Sergeant Davin Cross", emoji: "🌫️", need: 10, lore: "Not running. He is entirely unhurried, and that is the horror of him." },
  { n: 3,  name: "The Sealed Archive", emoji: "🔒", need: 14, lore: "A mystery built to look like genius and actually run by paperwork." },
  { n: 4,  name: "Lord Antony Vex", emoji: "✏️", need: 18, lore: "He is smiling while he works. He is enjoying the audience more than the problem." },
  { n: 5,  name: "Old Bramwell's Trial", emoji: "🔧", need: 22, lore: "A problem with no perfect solution, and a choice about which imperfection you can live with." },
  { n: 6,  name: "Senior Detective Marcus Vale", emoji: "🗄️", need: 26, lore: "He does not have to do the work himself." },
  { n: 7,  name: "Whistle's Price", emoji: "⚖️", need: 30, lore: "Three separate people being sold the same truth at three different prices." },
  { n: 8,  name: "Scarrow", emoji: "🥊", need: 34, lore: "A fight you cannot walk out of as the person who walked in." },
  { n: 9,  name: "The Chancellor's Ledger", emoji: "📗", need: 38, lore: "Being handed the proof and asked to prove you understand it." },
  { n: 10, name: "The Engine's Answer", emoji: "⚙️", need: 42, lore: "The thing at the heart of the city noticing you." },
];
export const INTERMEDIATE_EXAM_PASS_MARKS = { 1: 12, 2: 13, 3: 14, 4: 14, 5: 14, 6: 15, 7: 15, 8: 16, 9: 16, 10: 17 };
export const INTERMEDIATE_examKindFor = (lv) => lv <= 4 ? "imc" : lv <= 8 ? "kangaroo" : "gcseHigher";
export const INTERMEDIATE_EXAM_NAMES = { imc: "Intermediate Maths Challenge", kangaroo: "Intermediate Kangaroo", gcseHigher: "GCSE Higher Stretch" };
// No adventures exist yet for Gifford (same status as Primary at launch), so no upgrade
// bonus is achievable — base rarity strengths only: 9x1 + 5x2 + 5x4 + 6x8 + 5x16 = 167.
export const INTERMEDIATE_MAX_STRENGTH_TOTAL = 167;
// Stat order matches STAT_DEFS: [Arithmetic, Geometry, Logic, Science, Speed]. Tier stat-totals
// roughly track Primary's own bands (common ~10-13, uncommon ~15-18, rare ~20-24, epic ~28-32,
// legendary ~32-45), individually shaped to each character's established personality/role from
// GIFFORD_CARD_ART_FULL_RULESET.md and the Gifford_Story chapters.
export const INTERMEDIATE_CARDS = [
  // Legendaries (2)
  { id: "gf_aldous", name: "Aldous Wrought", emoji: "🖼️", r: "legendary", s: [9, 8, 9, 8, 8], flavor: "A hundred-year-old portrait, failing at the edges, painted by somebody who never met him." },
  { id: "gf_theengine", name: "The Differential Engine", emoji: "⚙️", r: "legendary", s: [9, 9, 9, 9, 9], flavor: "It asks the city one question every year. It has never once asked twice." },
  // Epic (6)
  { id: "gf_prewitt", name: "Chancellor Isolde Prewitt", emoji: "📗", r: "epic", s: [6, 4, 9, 5, 4], flavor: "Faintly amused, which is worse than anger." },
  { id: "gf_vane", name: "Silas Vane", emoji: "🥃", r: "epic", s: [6, 4, 7, 4, 7], flavor: "He is not looking at the viewer. He is reading, and the reading is the threat." },
  { id: "gf_ashcombe", name: "Captain Reeve Ashcombe", emoji: "🎖️", r: "epic", s: [6, 5, 6, 6, 5], flavor: "A face built for authority, and tired of exercising it." },
  { id: "gf_thorncastle", name: "Professor Linnea Thorncastle", emoji: "📐", r: "epic", s: [7, 6, 5, 8, 2], flavor: "Turning toward you as though interrupted, and not sorry about it." },
  { id: "gf_halloway", name: "Mother Halloway", emoji: "🍞", r: "epic", s: [6, 5, 6, 7, 4], flavor: "Has raised eleven children who were not hers, and buried some of them." },
  { id: "gf_kell", name: "Grandmaster Osric Kell", emoji: "📏", r: "epic", s: [8, 5, 9, 4, 2], flavor: "No notes on the lectern. Nothing at all." },
  // Rare (5)
  { id: "gf_tessa", name: "Tessa Brindle", emoji: "🪙", r: "rare", s: [4, 4, 4, 4, 5], flavor: "Holds the tin money box in both hands as though it might be hot." },
  { id: "gf_kade", name: "Inspector Yusuf Kade", emoji: "🗄️", r: "rare", s: [5, 4, 6, 4, 4], flavor: "Everything correct. Holding a file closed, offering it to nobody." },
  { id: "gf_bramwell", name: "Old Bramwell", emoji: "🔧", r: "rare", s: [4, 6, 4, 7, 2], flavor: "Half mad and wholly competent. Grinning at something offstage." },
  { id: "gf_adelina", name: "Lady Adelina Corvain", emoji: "🍷", r: "rare", s: [5, 4, 6, 4, 4], flavor: "Not looking at the viewer. Scanning a room, and the scanning is a professional activity." },
  { id: "gf_whistle", name: "Whistle", emoji: "🧾", r: "rare", s: [6, 3, 7, 4, 3], flavor: "A clerk in half-spectacles who happens to be seven feet tall." },
  // Uncommon (5)
  { id: "gf_fenn", name: "Fenn Okonkwo", emoji: "📋", r: "uncommon", s: [4, 3, 3, 3, 4], flavor: "Finding his own name in the middle of a list, and working out what the middle is worth." },
  { id: "gf_delphine", name: "Delphine Ashworth", emoji: "😏", r: "uncommon", s: [3, 3, 4, 2, 5], flavor: "Perfectly turned out, mid-anecdote, delighted with herself." },
  { id: "gf_growl", name: "Growl", emoji: "🐅", r: "uncommon", s: [3, 3, 2, 4, 5], flavor: "Not stupid. Not cruel for pleasure. Angry on somebody else's behalf." },
  { id: "gf_pemberton", name: "Clerk Pemberton", emoji: "📁", r: "uncommon", s: [5, 3, 4, 3, 2], flavor: "Holding a ledger against his chest like armour." },
  { id: "gf_maude", name: "Sister Maude", emoji: "🩺", r: "uncommon", s: [3, 3, 4, 5, 2], flavor: "Brisk, unsentimental, entirely unshockable." },
  // Common (12)
  { id: "gf_rooke", name: "Rooke", emoji: "🔢", r: "epic", s: [8, 5, 7, 5, 3], flavor: "Reads the last question first, then builds the lie backwards from a perfect answer." },
  { id: "gf_corvain", name: "Corvain", emoji: "⚖️", r: "epic", s: [5, 5, 8, 6, 4], flavor: "Watches the one thing instead of the hundred things. Ashcombe says it'll make her unpopular." },
  { id: "gf_marrow", name: "Marrow", emoji: "🐯", r: "epic", s: [7, 4, 5, 8, 4], flavor: "Counts every desk in the room. It's better than the other things he could be doing with the anger." },
  { id: "gf_tambrindle", name: "Tam Brindle", emoji: "🔪", r: "common", s: [2, 3, 2, 2, 4], flavor: "Caught in the act of doing something with a knife that a knife is not for." },
  { id: "gf_nettle", name: "Nettle", emoji: "🩹", r: "common", s: [2, 3, 2, 3, 1], flavor: "Meant to be in bed. Has drawn a picture in the fog on the window instead." },
  { id: "gf_higgins", name: "Corporal Higgins", emoji: "🧢", r: "common", s: [2, 2, 3, 2, 3], flavor: "Correct in every particular, and thinking about nothing." },
  { id: "gf_marta", name: "Marta the Grocer", emoji: "⚖️", r: "common", s: [4, 3, 2, 2, 1], flavor: "Weighing up a customer rather than the goods." },
  { id: "gf_jory", name: "Jory Fenwick", emoji: "📓", r: "common", s: [2, 2, 3, 2, 2], flavor: "Dismissive, and quietly beginning to be less so." },
  { id: "gf_ratchet", name: "Ratchet", emoji: "💰", r: "common", s: [2, 1, 2, 1, 4], flavor: "The friendly face of a bad organisation, and knows it." },
  { id: "gf_colworth", name: "Magistrate Colworth", emoji: "⚖️", r: "common", s: [3, 2, 4, 2, 1], flavor: "Neither cruel nor engaged. Processing." },
  { id: "gf_pip", name: "Pip", emoji: "👁️", r: "common", s: [2, 3, 2, 2, 3], flavor: "One of hundreds. Given a face on purpose." },
  { id: "gf_adavoss", name: "Second Examiner Ada Voss", emoji: "🕯️", r: "common", s: [4, 1, 3, 2, 1], flavor: "Her hands are not quite steady, and she has stopped writing." },
];
export const INTERMEDIATE_ACADEMY = [];
export const INTERMEDIATE_NAMES_COMMON = ["Tam Brindle", "Nettle", "Corporal Higgins", "Marta the Grocer", "Jory Fenwick", "Ratchet", "Magistrate Colworth", "Pip", "Ada Voss"];
export const INTERMEDIATE_NAMES_RARE = ["Tessa Brindle", "Inspector Kade", "Old Bramwell", "Lady Adelina Corvain", "Whistle"];
export const INTERMEDIATE_NAMES_EPIC = ["Rooke", "Corvain", "Marrow", "Chancellor Prewitt", "Silas Vane", "Captain Ashcombe", "Professor Thorncastle", "Mother Halloway", "Grandmaster Kell"];
export const INTERMEDIATE_NAMES_LEGENDARY = ["Aldous Wrought", "The Differential Engine"];
