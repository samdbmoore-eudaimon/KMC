export const INTERMEDIATE_LESSONS = {};
INTERMEDIATE_LESSONS.surdsAndIndices = {
  title: "Surds & Indices: exact answers, no rounding",
  minutes: 18,
  order: 3,
  prereq: ["algebraicManipulation"],
  intro: "A surd is a square root (or other root) that doesn't simplify to a whole number — √2, √7, √50. Rather than rounding it to a decimal and losing accuracy, this lesson shows you how to simplify, combine and rationalise surds so the answer stays exact, plus the index laws that let you handle fractional and negative powers the same clean way. Go slowly through the 'why' sections — once you've SEEN why a rule is true, you stop needing to memorise it.",
  sections: [
    { h: "1. Simplifying a surd", body: [
      "Start with something you can check by hand. Is √4 × √9 the same as √(4×9)? Work out each side on its own.",
      "First deal with √4 × √9:\n√4 = 2 and √9 = 3, so\n√4 × √9 =\n2 × 3 =\n6.",
      "Then look at √(4×9):\n4×9 =\n36, so\n√(4×9) =\n√36 =\n6.",
      "Both sides give 6 — they match. That wasn't luck.",
      "The same thing is true for ANY two numbers under the roots, not just 4 and 9 — here's the proof. Let a and b stand for any two numbers that are zero or positive (square roots of negative numbers aren't needed at GCSE level).",
      "Squaring undoes a square root. Square the left side:\n(√a × √b)² =\n(√a)² × (√b)² =\na × b.",
      "Now square the right side:\n(√(a×b))² =\na × b (by definition of squaring a root).",
      "Both squarings give exactly a × b. Since a and b are positive, there's only one positive number that squares to give any particular result, so the two original (unsquared) quantities must have been equal all along. That's the whole proof of the rule √a × √b = √(a×b), and it's the entire engine behind everything in this section.",
      "Now use that rule backwards. Instead of starting with two roots and multiplying them, start with ONE ugly root and split the number underneath into two friendlier factors.",
      "√50 isn't a whole number, but:\n50 =\n25 × 2, so\n√50 =\n√(25×2) =\n√25 × √2\n(using the rule above).",
      "√25 IS a whole number (5), so it walks out from under the root sign, leaving 5√2.",
      "The whole skill is choosing the right split. Any factor pair of 50 lets you use the rule, but only a perfect-square factor (a number that is itself something squared: 4, 9, 16, 25, 36, 49...) lets a whole number actually escape.",
      "Split 50 as 10×5 instead:\n√50 =\n√(10×5) =\n√10 × √5\n— true, but useless, since neither 10 nor 5 is a perfect square, so nothing comes out from under either root.",
      "Always hunt for the LARGEST perfect square that divides the number, so the job is done in one go.",
    ], examples: [
      { q: "Simplify √72.", steps: [
        "List perfect squares to test against, largest first, so you only need to check a couple: 64, 49, 36, 25, 16, 9, 4.",
        "Does 64 divide 72 exactly? 72 ÷ 64 is not a whole number, so no.",
        "Does 36 divide 72 exactly? 72 ÷ 36 = 2 — yes. 36 is a perfect square (6×6=36), so this is the split to use.",
        "Rewrite the number under the root using that factor:\n72 =\n36 × 2, so\n√72 =\n√(36 × 2).",
        "Apply the splitting rule:\n√(36 × 2) =\n√36 × √2.",
        "√36 is a whole number (6), so it comes out from under the root:\n√72 =\n6√2.",
      ], answer: "6√2" },
      { q: "Simplify √180 (a bigger number, to check the method still works).", steps: [
        "Test the larger perfect squares first: is 180 divisible by 100? No. By 81? No (180 ÷ 81 isn't whole). By 36? 180 ÷ 36 = 5 — yes.",
        "So:\n180 =\n36 × 5, giving\n√180 =\n√(36 × 5) =\n√36 × √5\n(splitting rule again).",
        "√36 = 6, so √180 = 6√5.",
        "Final check: does 5 itself hide another perfect-square factor? No — 5 is prime, so it can't be split any further. 6√5 is fully simplified.",
      ], answer: "6√5" },
      { q: "Simplify √12 + √75 - √27.", steps: [
        "Simplify each surd separately by finding the largest perfect-square factor of the number underneath.",
        "√12: the largest perfect-square factor of 12 is 4 (since 12 = 4 × 3), so √12 = √(4 × 3) = √4 × √3 = 2√3.",
        "√75: the largest perfect-square factor of 75 is 25 (since 75 = 25 × 3), so √75 = √(25 × 3) = √25 × √3 = 5√3.",
        "√27: the largest perfect-square factor of 27 is 9 (since 27 = 9 × 3), so √27 = √(9 × 3) = √9 × √3 = 3√3.",
        "All three surds are now multiples of √3, so combine them like terms: 2√3 + 5√3 - 3√3 = (2 + 5 - 3)√3 = 4√3.",
      ], answer: "4√3" },
    ],
      tryit: { q: "Simplify √48.", answer: "4√3. The largest perfect-square factor of 48 is 16 (check: 48 ÷ 16 = 3), so √48 = √16 × √3 = 4√3. Since 3 is prime, it can't be split any further." } },
    { h: "2. Rationalising the denominator", body: [
      "Here's a pattern worth checking by hand first: what is √5 × √5? Using the splitting rule from Section 1 in reverse:\n√5 × √5 =\n√(5×5) =\n√25 =\n5\n— a whole number, no root left at all.",
      "Try it again with a different number to make sure it's not a one-off:\n√11 × √11 =\n√(11×11) =\n√121 =\n11.",
      "Multiplying any surd by an exact copy of itself always clears the root completely. Here's why, in general: let n stand for whatever number sits under the root (5, 11, or anything else). Multiplying √n by itself is really just computing √(n²), and squaring then square-rooting a positive number gets you straight back to that same number, n.",
      "That single fact is the whole secret of 'rationalising'. A fraction like 1/√5 isn't mathematically wrong, but a root sitting on the bottom of a fraction is awkward to compare, add, or estimate by eye, so it's treated as untidy.",
      "To clean it up, multiply the WHOLE fraction by √5/√5. Why is that allowed? Because √5/√5 is 'something divided by itself', which always equals exactly 1, and multiplying any number by 1 never changes its value, only how it's written.",
      "Once you multiply through:\n1/√5 =\n(1×√5) / (√5×√5) =\n(1×√5) / 5\n(since √5×√5 = 5, a whole number, as shown above) =\n√5/5\n— the exact same value as before, just rearranged so the root sits harmlessly on top.",
    ], examples: [
      { q: "Rationalise 1/√5.", steps: [
        "Multiply the fraction by √5/√5 — allowed because √5/√5 equals 1, so the value of the fraction doesn't change:\n(1/√5) × (√5/√5).",
        "Multiply the numerators:\n1 × √5 =\n√5.",
        "Multiply the denominators:\n√5 × √5 =\n5\n(a surd times an identical copy of itself always gives a whole number, as shown above).",
        "Write the new numerator over the new denominator:\n√5/5.",
      ], answer: "√5/5" },
      { q: "Rationalise 6/√8 (the denominator isn't in simplest form yet, so there's an extra step first).", steps: [
        "Simplify the surd on the bottom before doing anything else:\n√8 =\n√(4×2) =\n√4 × √2 =\n2√2\n(Section 1's method).",
        "Rewrite the fraction using that simplified root:\n6/√8 =\n6/(2√2).",
        "Simplify the whole-number part of the fraction first:\n6 ÷ 2 =\n3, leaving\n3/√2.",
        "Now rationalise as before, multiplying top and bottom by √2:\n(3×√2) / (√2×√2).",
        "The denominator becomes √2×√2 = 2. The numerator becomes 3√2.",
        "Final answer: 3√2/2.",
      ], answer: "3√2/2" },
      { q: "Rationalise the denominator of 3/(2 + √5), giving your answer in the form a + b√5 where a and b are integers.", steps: [
        "The conjugate of (2 + √5) is (2 - √5). Multiplying by (2 - √5)/(2 - √5) equals 1, so the fraction's value is unchanged.",
        "Multiply the numerators: 3 × (2 - √5) = 6 - 3√5.",
        "Multiply the denominators using the difference-of-two-squares identity: (2 + √5)(2 - √5) = 2² - (√5)² = 4 - 5 = -1.",
        "Write the resulting fraction: (6 - 3√5) / (-1).",
        "Dividing by -1 reverses every sign: (6 - 3√5) / (-1) = -6 + 3√5, which is written as 3√5 - 6.",
      ], answer: "3√5 - 6" },
    ],
      tryit: { q: "Rationalise 7/√7 and simplify fully.", answer: "√7. Multiplying top and bottom by √7 gives (7×√7)/7 = 7√7/7, and the 7s cancel exactly, leaving just √7." } },
    { h: "3. Fractional and negative indices", body: [
      "Let n stand for any positive number, the base of the power about to be examined. Where does n^(1/2) actually come from? It isn't a new rule to memorise, it falls straight out of the ordinary law for multiplying powers (add the indices when the base is the same):\nn^(1/2) × n^(1/2) =\nn^(1/2 + 1/2) =\nn^1 =\nn.",
      "So whatever number n^(1/2) actually is, squaring it gets you back to n. But 'the number that squares to give n' is exactly the definition of √n. So n^(1/2) simply means √n.",
      "The same logic stretches to any root:\nn^(1/3) × n^(1/3) × n^(1/3) =\nn^(1/3 + 1/3 + 1/3) =\nn^1 =\nn,",
      "so n^(1/3) is the number that CUBES to give n, the cube root. In general, letting q stand for any whole number, n^(1/q) means the qth root of n, because multiplying it by itself q times always lands back on n^1.",
      "What about a fraction like n^(p/q), with a numerator as well — here p just stands for another whole number, sitting on top of q? The denominator q says 'take this root'; the numerator p says 'then raise to this power', and the order doesn't actually matter, since:\n(n^(1/q))^p =\nn^(p/q) =\n(n^p)^(1/q)\n(indices multiply either way round).",
      "In practice, always take the root FIRST: it keeps the numbers small, and THEN raising that small result to a power is easy arithmetic instead of a huge one.",
      "Negative indices come from a different index law, but the same style of reasoning. Let k stand for any whole number, the power involved. Multiplying powers with a matching base adds the indices, so:\nn^k × n^(-k) =\nn^(k + (-k)) =\nn^0 =\n1\n(anything to the power 0 equals 1 — check it yourself: 5³×5⁻³ must equal 5⁰=1).",
      "If n^k multiplied by n^(-k) always gives exactly 1, then n^(-k) must be the reciprocal of n^k, i.e. n^(-k) = 1/n^k. The minus sign was never a mysterious symbol, it's simply 'take the reciprocal', and it drops straight out of the same index law used everywhere else.",
    ], examples: [
      { q: "Evaluate 27^(-2/3).", steps: [
        "Deal with the negative sign first, using n^(-k) = 1/n^k:\n27^(-2/3) =\n1 / (27^(2/3)).",
        "Now evaluate 27^(2/3) by taking the root first (the denominator, 3, means cube root):\n27^(1/3) = 3\n(since 3×3×3=27).",
        "Raise that result to the numerator's power:\n27^(2/3) =\n(27^(1/3))² =\n3² =\n9.",
        "Put this back under the reciprocal from step 1:\n27^(-2/3) =\n1/9.",
      ], answer: "1/9" },
      { q: "Evaluate (1/8)^(-2/3) (a fraction base, to check the rules combine correctly).", steps: [
        "Handle the negative index first — it flips the base upside down and removes the minus sign:\n(1/8)^(-2/3) =\n8^(2/3).",
        "Take the root first, using the denominator 3:\n8^(1/3) = 2\n(since 2×2×2=8).",
        "Raise that to the numerator's power:\n8^(2/3) =\n(8^(1/3))² =\n2² =\n4.",
      ], answer: "4" },
      { q: "Evaluate 4^(5/2) + 8^(-2/3), writing your answer as a single fraction.", steps: [
        "Evaluate 4^(5/2): the denominator 2 means square root, so 4^(1/2) = 2, then raise to the power 5: 2^5 = 32.",
        "Evaluate 8^(-2/3): the negative index means take the reciprocal first, giving 1 / (8^(2/3)).",
        "Evaluate 8^(2/3): the denominator 3 means cube root, so 8^(1/3) = 2 (since 2 × 2 × 2 = 8), then raise to the power 2: 2² = 4.",
        "Therefore 8^(-2/3) = 1/4.",
        "Add the two results: 32 + 1/4 = 128/4 + 1/4 = 129/4.",
      ], answer: "129/4" },
    ],
      tryit: { q: "Evaluate 16^(3/4).", answer: "8. Take the root first: 16^(1/4) = 2, since 2×2×2×2=16 (the fourth root). Then raise to the numerator's power: 2³ = 8." } },
  ],
};

INTERMEDIATE_LESSONS.numberTheoryDivisibility = {
  title: "Number Theory: factors, multiples and remainders",
  minutes: 13,
  order: 1,
  prereq: [{ module: "primary", key: "factorsMultiplesPrimes" }],
  intro: "Underneath a lot of Kangaroo and GCSE questions sits the same toolkit: breaking a number into its prime building blocks, finding what two numbers have in common (HCF), what they both divide into (LCM), and what's left over after division (modular arithmetic). This lesson builds all three from the same idea, prime factorisation. Go slowly through the worked checks in each section: once you've seen a rule fail when done wrong, you understand why the correct version works.",
  sections: [
    { h: "1. Prime factorisation", body: [
      "Try building 12 two different ways. Start with:\n12 = 2 × 6, then split\n6 = 2 × 3, giving\n12 = 2 × 2 × 3.",
      "Now start differently:\n12 = 3 × 4, then split\n4 = 2 × 2, giving\n12 = 3 × 2 × 2. Same three primes both times (2, 2 and 3), just multiplied in a different order.",
      "That's not a coincidence for 12, it's true for every whole number greater than 1: however you break it into factors, you always end up with exactly the same list of primes. This is called the fundamental theorem of arithmetic, and it's the reason 'the prime factorisation of a number' is a single, meaningful thing to ask for, not one of several possible answers.",
      "To find it in practice, divide by the smallest prime that fits, write down what's left, and repeat with the smallest prime that fits that new number. Keep going until the number left over is itself prime.",
      "The most common slip is stopping too early, for example giving up on 45 because 2 doesn't divide it, without trying the next prime up. If a prime doesn't divide exactly, move on to the next one (3, then 5, then 7...) rather than assuming the job is finished.",
    ], examples: [
      { q: "Write 60 as a product of primes.", steps: [
        "Start with the smallest prime, 2. Does 2 divide 60 exactly? 60 ÷ 2 = 30, yes.",
        "So 60 = 2 × 30. Now factorise 30 the same way: does 2 divide 30? 30 ÷ 2 = 15, yes.",
        "So 30 = 2 × 15. Does 2 divide 15? No, 15 is odd, so move up to the next prime, 3. 15 ÷ 3 = 5, yes.",
        "So 15 = 3 × 5, and 5 is itself prime, so the process stops here.",
        "Collect every prime used:\n60 =\n2 × 2 × 3 × 5 =\n2² × 3 × 5.",
      ], answer: "2² × 3 × 5" },
      { q: "Write 180 as a product of primes (a bigger number, to check the method still works).", steps: [
        "Start with the smallest prime, 2. 180 ÷ 2 = 90, yes, so 180 = 2 × 90.",
        "Divide 90 by 2 again: 90 ÷ 2 = 45, yes, so 90 = 2 × 45.",
        "Try 2 on 45: 45 is odd, so 2 doesn't divide it. Move up to the next prime, 3. 45 ÷ 3 = 15, yes.",
        "Divide 15 by 3 again: 15 ÷ 3 = 5, yes, and 5 is prime, so stop.",
        "Collect every prime used:\n180 =\n2 × 2 × 3 × 3 × 5 =\n2² × 3² × 5.",
      ], answer: "2² × 3² × 5" },
      { q: "Write 2520 as a product of primes.", steps: [
        "Divide repeatedly by 2 until it no longer goes exactly: 2520 ÷ 2 = 1260, 1260 ÷ 2 = 630, 630 ÷ 2 = 315. Three factors of 2, and 315 is odd so 2 is exhausted.",
        "Move to 3: 315 ÷ 3 = 105, and 105 ÷ 3 = 35. Two factors of 3, and 35 is not divisible by 3 (since 3 × 11 = 33 and 3 × 12 = 36).",
        "Move to 5: 35 ÷ 5 = 7. One factor of 5, and 7 is itself prime so stop.",
        "Collect all prime factors: 2520 = 2 × 2 × 2 × 3 × 3 × 5 × 7 = 2³ × 3² × 5 × 7.",
        "Check by multiplying back: 8 × 9 = 72, then 72 × 5 = 360, and 360 × 7 = 2520. ✓",
      ], answer: "2³ × 3² × 5 × 7" },
    ],
      tryit: { q: "Write 84 as a product of primes.", answer: "2² × 3 × 7. Dividing by 2 twice gives:\n84 =\n2 × 2 × 21 =\n4 × 21, and 21 = 3 × 7, neither of which can be split further since 3 and 7 are both prime." } },
    { h: "2. HCF and LCM from prime factors", body: [
      "Before going any further, pin down exactly what the two names mean, using letters so the definition covers any pair of numbers, not just the ones about to be used. Let a and b be two whole numbers. When we write HCF(a, b), we mean the Highest Common Factor of a and b: the largest whole number that divides both a and b exactly, with nothing left over. When we write LCM(a, b), we mean the Lowest Common Multiple of a and b: the smallest whole number that both a and b divide into exactly, with nothing left over either. Both are easiest to find by writing each number as a product of primes, using the method from Section 1.",
      "Take 24 = 2³ × 3 and 36 = 2² × 3². The HCF has to be a number that divides BOTH 24 and 36 exactly. Try taking the higher power of 2 instead of the lower one, just to see what goes wrong: 2³ × 3 = 24. Does 24 divide 36 exactly? 36 ÷ 24 = 1.5, not a whole number, so 24 fails as a common factor of 36. The problem is that 36 only contains 2² worth of 2s (that's 4), not 2³ (8), so anything using a full 2³ is asking 36 for more 2s than it actually has.",
      "That's why the HCF always takes the LOWER power of each shared prime: it can never demand more copies of a prime than the number with fewer copies of it can supply. Using the lower powers here, 2² × 3¹ = 12, and 12 does divide both 24 (24 ÷ 12 = 2) and 36 (36 ÷ 12 = 3) exactly.",
      "The LCM works the opposite way round: it has to be a multiple of BOTH 24 and 36 (both numbers divide into it exactly). Try using the lower power of 3 instead of the higher one, again to see the failure: 2³ × 3¹ = 24. Is 24 a multiple of 36? No, 24 is smaller than 36, so 36 can't possibly divide into it. Taking too low a power of a prime leaves the candidate too small to be a genuine multiple of the number that needed the higher power.",
      "That's why the LCM always takes the HIGHER power of every prime that appears in either number:\n2³ × 3² =\n8 × 9 =\n72.",
      "Check it divides evenly: 72 ÷ 24 = 3 and 72 ÷ 36 = 2, both whole numbers, so 72 really is a common multiple, and it's the smallest one, because using anything less than the higher power leaves at least one of the original numbers unable to divide in.",
      "A handy shortcut: HCF × LCM always equals the product of the two original numbers (here 12 × 72 = 864, and 24 × 36 = 864 too), which is a good way to check an answer, though not a substitute for working out the prime factors properly. One common pitfall: if a prime appears in only ONE of the two numbers, it still counts for the LCM (you need enough of it to be a genuine multiple) but contributes nothing to the HCF, since the two numbers don't share it.",
    ], examples: [
      { q: "Find the HCF and LCM of 12 and 18.", steps: [
        "Write both numbers as products of primes: 12 = 2² × 3, and 18 = 2 × 3².",
        "For the HCF, take the lower power of each prime that appears in both: the lower power of 2 is 2¹ (12 has 2² but 18 only has 2¹), and the lower power of 3 is 3¹ (18 has 3² but 12 only has 3¹).",
        "Multiply those lower powers together:\nHCF =\n2 × 3 =\n6.",
        "For the LCM, take the higher power of each prime that appears in either number: 2² (from 12) and 3² (from 18).",
        "Multiply those higher powers together:\nLCM =\n4 × 9 =\n36.",
        "Check:\nHCF × LCM =\n6 × 36 =\n216, and 12 × 18 = 216. They match.",
      ], answer: "HCF = 6, LCM = 36" },
      { q: "Find the HCF and LCM of 24 and 36.", steps: [
        "Write both numbers as products of primes: 24 = 2³ × 3, and 36 = 2² × 3².",
        "For the HCF, take the lower power of each shared prime: 2² (24 has 2³ but 36 only has 2²) and 3¹ (36 has 3² but 24 only has 3¹).",
        "Multiply those together:\nHCF =\n4 × 3 =\n12.",
        "For the LCM, take the higher power of each prime: 2³ (from 24) and 3² (from 36).",
        "Multiply those together:\nLCM =\n8 × 9 =\n72.",
        "Check:\nHCF × LCM =\n12 × 72 =\n864, and 24 × 36 = 864. They match.",
      ], answer: "HCF = 12, LCM = 72" },
      { q: "Find the HCF and LCM of 360 and 504.", steps: [
        "Write both as products of primes: for 360, divide by 2 three times to get 45 = 3² × 5, giving 360 = 2³ × 3² × 5. For 504, divide by 2 three times to get 63 = 3² × 7, giving 504 = 2³ × 3² × 7.",
        "Identify which primes appear in both: 2 and 3 appear in both (the prime 5 is in 360 only, and 7 is in 504 only).",
        "For the HCF, take the lower power of each shared prime: both numbers have exactly 2³ and 3², so HCF = 2³ × 3² = 8 × 9 = 72.",
        "For the LCM, take the higher power of every prime appearing in either number: 2³, 3², 5 and 7, so LCM = 2³ × 3² × 5 × 7 = 72 × 35 = 2520.",
        "Check: HCF × LCM = 72 × 2520 = 181440, and 360 × 504 = 181440. They match.",
      ], answer: "HCF = 72, LCM = 2520" },
    ],
      tryit: { q: "Find the HCF and LCM of 20 and 30.", answer: "HCF = 10, LCM = 60. Since 20 = 2² × 5 and 30 = 2 × 3 × 5, the HCF uses the lower powers of the shared primes (2¹ × 5¹ = 10), while the LCM uses the higher powers of every prime that appears in either number (2² × 3 × 5 = 60); the 3 only appears in 30, so it doesn't count for the HCF but does count for the LCM." } },
    { h: "3. Modular arithmetic (remainders)", body: [
      "'N mod m' means the remainder when N is divided by m. Here N and m are just two whole numbers: N is the number being divided, and m (called the modulus) is what it's divided by. Check this against a clock: it's 14:00, and the clock reads that as 2:00, not 14:00, because clocks reset every 12 hours.",
      "That's exactly 14 mod 12:\n14 =\n1 × 12 + 2, so\n14 mod 12 =\n2.",
      "A useful pattern is that remainders repeat in a cycle. Check the powers of 2 mod 5:\n2¹ mod 5 = 2\n2² mod 5 = 4\n2³ mod 5 = 8 mod 5 = 3\n2⁴ mod 5 = 16 mod 5 = 1.",
      "Try the next one:\n2⁵ mod 5 =\n32 mod 5 =\n2, the same remainder as 2¹. The cycle (2, 4, 3, 1) has just started repeating, with length 4.",
      "That cycle lets you jump straight to a huge power without working it out directly. To find 2 to some large power mod 5, divide the exponent by the cycle length (4) and use the remainder to find the matching spot in the cycle, since the pattern simply repeats from there.",
      "Be careful not to confuse 'N mod m' with just subtracting m once. If N is much bigger than m, you may need to subtract several multiples of m (or divide fully) before what's left is smaller than m and counts as the true remainder.",
    ], examples: [
      { q: "What is 100 mod 7?", steps: [
        "Divide 100 by 7 and find the whole number part: 100 ÷ 7 = 14.28..., so 14 whole times.",
        "Multiply back to see how much that accounts for: 14 × 7 = 98.",
        "Subtract to find what's left over: 100 − 98 = 2.",
        "So 100 mod 7 = 2 (this is a genuine remainder since 2 is smaller than 7).",
      ], answer: "2" },
      { q: "What is 2¹⁰ mod 5, using the cycle pattern from above (a case where working out the power directly would be tedious)?", steps: [
        "First find the cycle of remainders for powers of 2 mod 5:\n2¹ mod 5 = 2\n2² mod 5 = 4\n2³ mod 5 = 8 mod 5 = 3\n2⁴ mod 5 = 16 mod 5 = 1.",
        "Check the next one to confirm the cycle really repeats:\n2⁵ mod 5 =\n32 mod 5 =\n2, the same as 2¹ mod 5, so the cycle length is 4 (2, 4, 3, 1, then repeat).",
        "To find 2¹⁰ mod 5 without working out 2¹⁰ directly, divide the exponent 10 by the cycle length 4: 10 = 2 × 4 + 2, so the remainder of that division is 2.",
        "A remainder of 2 means 2¹⁰ lands on the same spot in the cycle as 2², which is 4.",
        "Check directly: 2¹⁰ = 1024, and 1024 ÷ 5 = 204 remainder 4 (204 × 5 = 1020, 1024 − 1020 = 4). It matches.",
      ], answer: "4" },
      { q: "Find 3¹⁰⁰ mod 8.", steps: [
        "Find the cycle of remainders for powers of 3 mod 8: 3¹ mod 8 = 3; 3² mod 8 = 9 mod 8 = 1; 3³ mod 8 = 3 × 1 = 3 (since 3² ≡ 1 brings the cycle back). The cycle (3, 1) has length 2.",
        "To find 3¹⁰⁰ mod 8, divide the exponent 100 by the cycle length 2: 100 = 50 × 2, remainder 0.",
        "A remainder of 0 means the exponent falls at the end of a complete cycle, which is the same position as exponent 2. So 3¹⁰⁰ mod 8 = 3² mod 8 = 1.",
        "Check: 3² = 9 ≡ 1 (mod 8), so 3¹⁰⁰ = (3²)⁵⁰ ≡ 1⁵⁰ = 1 (mod 8). ✓",
      ], answer: "1" },
    ],
      tryit: { q: "What is 50 mod 6?", answer: "2. Since 8 × 6 = 48 and 50 − 48 = 2, which is smaller than 6, so it's the genuine remainder." } },
  ],
};

INTERMEDIATE_LESSONS.algebraicManipulation = {
  title: "Algebraic Manipulation: expanding, factorising, simplifying",
  minutes: 15,
  order: 2,
  prereq: [{ module: "junior", key: "multiExpr" }],
  intro: "Almost every harder algebra question starts with tidying up an expression before you can actually solve anything. This lesson covers the three core moves, expanding brackets, factorising back the other way, and spotting the difference-of-two-squares pattern that shows up constantly. Each rule here is checked with real numbers first, so you can see exactly why it works rather than just accepting it.",
  sections: [
    { h: "1. Expanding double brackets", body: [
      "Start with something familiar: does 3 × (4+5) equal 3×4 + 3×5? Left side: 3 × 9 = 27. Right side: 12 + 15 = 27. They match, this is the distributive law, multiplying a number onto a bracket means multiplying it onto every term inside.",
      "Now check what happens with TWO brackets: does (2+3) × (4+5) equal 2×4 + 2×5 + 3×4 + 3×5? Left side: 5 × 9 = 45. Right side: 8 + 10 + 12 + 15 = 45. They match again, so with two brackets, every term in the first bracket has to multiply every term in the second, not just a matching pair.",
      "Expanding (ax+b)(cx+d) is exactly the same process, just with letters standing in for some of the numbers: x is the unknown, and a, b, c and d are just ordinary numbers, the coefficients and constants of each bracket (they could be positive, negative, or even fractions, the method doesn't change). FOIL (First, Outer, Inner, Last) is simply a memory aid for the order to do those four multiplications in, so none get missed.",
      "The most common mistake is a lost sign when a bracket contains a minus. Each sign travels together with the term it belongs to, so 3 × (x−4) means 3 × x and 3 × (−4), not 3 × x and 3 × 4.",
    ], examples: [
      { q: "Expand (x+2)(x+3).", steps: [
        "Multiply the First terms: x × x = x².",
        "Multiply the Outer terms: x × 3 = 3x.",
        "Multiply the Inner terms: 2 × x = 2x.",
        "Multiply the Last terms: 2 × 3 = 6.",
        "Add all four results together: x² + 3x + 2x + 6.",
        "Collect the like terms (3x and 2x are both 'x' terms): x² + 5x + 6.",
      ], answer: "x² + 5x + 6" },
      { q: "Expand (2x+3)(x-4) (this time one bracket has a minus in it).", steps: [
        "Multiply the First terms: 2x × x = 2x².",
        "Multiply the Outer terms: 2x × (−4) = −8x. The minus sign travels with the 4, since the term is really +(−4).",
        "Multiply the Inner terms: 3 × x = 3x.",
        "Multiply the Last terms: 3 × (−4) = −12.",
        "Add all four results together: 2x² − 8x + 3x − 12.",
        "Collect the like terms:\n−8x + 3x =\n−5x, giving\n2x² − 5x − 12.",
      ], answer: "2x² - 5x - 12" },
      { q: "Expand (3x - 2)², giving your answer in the form ax² + bx + c.", steps: [
        "Write the square as two separate brackets: (3x - 2)² = (3x - 2)(3x - 2).",
        "Multiply the First terms: 3x × 3x = 9x².",
        "Multiply the Outer terms: 3x × (-2) = -6x.",
        "Multiply the Inner terms: (-2) × 3x = -6x. (Both middle terms are -6x because squaring a bracket always produces two identical middle products.)",
        "Multiply the Last terms: (-2) × (-2) = 4. Add all four: 9x² - 6x - 6x + 4 = 9x² - 12x + 4.",
      ], answer: "9x² - 12x + 4" },
    ],
      tryit: { q: "Expand (3x-1)(x+5).", answer: "3x² + 14x - 5. First: 3x × x = 3x². Outer: 3x × 5 = 15x. Inner: −1 × x = −x. Last: −1 × 5 = −5. Adding: 3x² + 15x − x − 5 = 3x² + 14x − 5." } },
    { h: "2. Factorising a quadratic", body: [
      "Check what happens when you expand (x+3)(x+4) using the method from Section 1:\nFirst x², Outer 4x, Inner 3x, Last 12, giving\nx² + 7x + 12.",
      "Notice that the middle coefficient (7) is the SUM of 3 and 4, and the constant (12) is their PRODUCT.",
      "That pattern always holds, not just for 3 and 4. Let p and q stand for any two numbers, whatever numbers happen to end up going into the brackets. Expanding (x+p)(x+q) in general, by the same First-Outer-Inner-Last method as above, gives x² + (p+q)x + pq: the middle coefficient is always p+q, and the constant is always p×q. So whenever a quadratic is written as x²+bx+c, where b just stands for whatever number sits in front of x and c stands for the constant term on its own, you're really looking for exactly this pair in reverse: two numbers that multiply to give c and add to give b.",
      "In practice, list the factor pairs of c and check which pair adds to b, keeping an eye on signs: if c is positive and b is positive, both numbers are positive; if c is positive and b is negative, both are negative; if c is negative, the two numbers must have opposite signs (since a positive times a negative gives a negative product).",
      "A common slip is picking a factor pair that multiplies correctly but forgetting to check the sum, or the reverse. Always check BOTH conditions (the product and the sum) before writing down the brackets.",
    ], examples: [
      { q: "Factorise x² + 7x + 12.", steps: [
        "You need two numbers that multiply to give 12 (the constant term) and add to give 7 (the coefficient of x).",
        "List the factor pairs of 12: 1 and 12, 2 and 6, 3 and 4.",
        "Check which pair adds to 7: 1+12=13 (no), 2+6=8 (no), 3+4=7 (yes).",
        "So the two numbers are 3 and 4, and they slot straight into the brackets: (x+3)(x+4).",
        "Check by expanding back:\n(x+3)(x+4) =\nx²+4x+3x+12 =\nx²+7x+12. It matches.",
      ], answer: "(x+3)(x+4)" },
      { q: "Factorise x² - x - 20 (trickier, since the constant is negative).", steps: [
        "You need two numbers that multiply to give −20 and add to give −1 (the coefficient of x, since x²−x means the coefficient is −1).",
        "Since the product is negative, the two numbers must have opposite signs.",
        "List factor pairs of 20 to try with opposite signs: 1 and 20, 2 and 10, 4 and 5.",
        "Try 4 and 5 with opposite signs: −5 and 4 multiply to −20, and add to −1. That matches both targets.",
        "So the two numbers are −5 and 4, giving (x−5)(x+4).",
        "Check by expanding back:\n(x−5)(x+4) =\nx²+4x−5x−20 =\nx²−x−20. It matches.",
      ], answer: "(x-5)(x+4)" },
      { q: "Factorise 2x² + 7x + 3.", steps: [
        "Since the coefficient of x² is 2 (not 1), find two numbers that multiply to 2 × 3 = 6 and add to 7 (the coefficient of x).",
        "Test factor pairs of 6: 1 and 6 add to 7 (yes); 2 and 3 add to 5 (no). Use 1 and 6.",
        "Split the middle term using these two numbers: 2x² + 7x + 3 = 2x² + x + 6x + 3.",
        "Factorise each pair: x(2x + 1) + 3(2x + 1). The bracket (2x + 1) is common to both, so factor it out.",
        "Result: (2x + 1)(x + 3). Check by expanding: (2x+1)(x+3) = 2x²+6x+x+3 = 2x²+7x+3. ✓",
      ], answer: "(2x + 1)(x + 3)" },
    ],
      tryit: { q: "Factorise x² - 3x - 10.", answer: "(x-5)(x+2). You need two numbers multiplying to -10 and adding to -3: -5 and 2 work, since -5×2=-10 and -5+2=-3." } },
    { h: "3. Difference of two squares", body: [
      "Let a and b stand for any two numbers or expressions at all here, they could be plain numbers, a letter like x, or something like 3x, it won't change the pattern about to appear.",
      "Expand (a−b)(a+b) using the same method as Section 1:\nFirst a×a=a², Outer a×b=ab, Inner −b×a=−ab, Last −b×b=−b².",
      "Adding them:\na² + ab − ab − b², and\nthe ab and −ab are opposites, so they cancel exactly, leaving\na² − b². No middle term survives.",
      "Check it with actual numbers: let a=5, b=2.",
      "Left side:\n(5−2)(5+2) =\n3×7 =\n21.",
      "Right side:\na²−b² =\n25−4 =\n21.",
      "They match.",
      "Because (a−b)(a+b) always simplifies to a²−b², the process reverses cleanly too: whenever you SEE an expression of the form 'a perfect square minus a perfect square', you can write down the two brackets immediately, with no searching for numbers the way Section 2 required, since there's no middle term to match.",
      "To spot it, recognise perfect squares: numbers like 1, 4, 9, 16, 25, 36, 49..., and with algebra, terms like x² or (3x)²=9x². The one condition that matters is that it must be a DIFFERENCE (a minus sign) between the two squares, a SUM like x²+49 does not factorise this way at all.",
    ], examples: [
      { q: "Factorise x² - 49.", steps: [
        "Check whether both terms are perfect squares: x² is a perfect square (it's x×x), and 49 = 7×7, so 49 is a perfect square too.",
        "Since it's a DIFFERENCE of two squares (x² minus 49, not a sum), the a²−b² rule applies directly, with a=x and b=7.",
        "Write it straight into the two brackets: x² − 49 = (x−7)(x+7).",
        "Check by expanding back:\n(x−7)(x+7) =\nx²+7x−7x−49 =\nx²−49. The middle terms cancel exactly as shown above, and it matches.",
      ], answer: "(x-7)(x+7)" },
      { q: "Factorise 9x² - 25 (this time a number multiplies the x² term).", steps: [
        "Check whether both terms are perfect squares: 9x² = (3x)² (since 3x×3x=9x²), and 25 = 5×5, so both are perfect squares.",
        "This is a difference of two squares with a=3x and b=5.",
        "Write it into the brackets: 9x² − 25 = (3x−5)(3x+5).",
        "Check by expanding back:\n(3x−5)(3x+5) =\n9x²+15x−15x−25 =\n9x²−25. The middle terms cancel again, and it matches.",
      ], answer: "(3x-5)(3x+5)" },
      { q: "Factorise x⁴ - 16, applying the difference-of-two-squares rule twice.", steps: [
        "Recognise that x⁴ = (x²)² and 16 = 4², so x⁴ - 16 is a difference of two squares with a = x² and b = 4.",
        "Apply the rule: x⁴ - 16 = (x² - 4)(x² + 4).",
        "Check whether either factor can be factorised further: x² + 4 is a sum of two squares, not a difference, so it cannot be factorised over the real numbers.",
        "Apply the rule again to x² - 4, since 4 = 2²: x² - 4 = (x - 2)(x + 2).",
        "Write the fully factorised result: x⁴ - 16 = (x - 2)(x + 2)(x² + 4). Check: (x-2)(x+2) = x²-4, and (x²-4)(x²+4) = x⁴-16. ✓",
      ], answer: "(x - 2)(x + 2)(x² + 4)" },
    ],
      tryit: { q: "Factorise 4x² - 81.", answer: "(2x-9)(2x+9). Since 4x²=(2x)² and 81=9², this is a²-b² with a=2x and b=9." } },
  ],
};

INTERMEDIATE_LESSONS.simultaneousEquations = {
  title: "Simultaneous Equations: two unknowns, two clues",
  minutes: 14,
  order: 5,
  prereq: ["algebraicManipulation", { module: "junior", key: "systemWord" }, { module: "primary", key: "twoUnknowns" }],
  intro: "Whenever a problem gives you two separate facts about two unknown quantities, you need simultaneous equations, a pair of equations solved together, not one at a time. This lesson covers elimination (the fastest method for linear pairs) and substitution (essential once a quadratic gets involved). Both methods rely on a single idea worth checking carefully first: that you're always allowed to combine two true equations together.",
  sections: [
    { h: "1. Elimination", body: [
      "Suppose x+y=10 and x−y=4 are both true for the same x and y. Check with x=7, y=3: 7+3=10 and 7−3=4, both check out. Because the left side of each equation equals its own right side, adding the two left sides together must give exactly the same total as adding the two right sides together: (x+y)+(x−y) must equal 10+4. That's just 'equal amounts add to equal amounts', nothing extra is smuggled in.",
      "Working out the left side confirms it:\n(x+y)+(x−y) =\nx+y+x−y =\n2x, since the y and −y cancel.",
      "So:\n2x =\n14, giving\nx = 7, which matches the x we already knew. The method works especially well here because the y-coefficients are opposite (+1 and −1), so adding the equations removes y entirely, leaving one equation in one unknown. This whole technique is called elimination, because the step of adding (or subtracting) the two equations makes one of the letters disappear completely — it has been eliminated — leaving something simple enough to solve directly.",
      "Sometimes the letter you want to remove already has coefficients that are equal rather than opposite (like the 3x in both equations of the example below), in which case SUBTRACTING one whole equation from the other removes it instead. Other times a coefficient needs to be forced to match first, by multiplying one whole equation by a number, which is allowed for exactly the same reason: multiplying both sides of an equation by the same number keeps them equal.",
      "The easiest mistake is applying an operation to only PART of an equation, for example doubling the left side but forgetting the right. Always treat the whole equation, both sides together, as one package when adding, subtracting or scaling.",
    ], examples: [
      { q: "Solve x + y = 10 and x - y = 2.", steps: [
        "Both equations already have matching coefficients of x (just 'x' in each), so adding them will eliminate y, since +y and −y are opposites.",
        "Add the left sides together, and separately add the right sides together: (x+y)+(x−y) = 10+2.",
        "Simplify the left side:\nx+y+x−y =\n2x (the y and −y cancel), so\n2x = 12.",
        "Divide both sides by 2: x = 6.",
        "Substitute x=6 back into the first equation (that is, replace x with the value 6 wherever it appears):\n6+y = 10, so\ny = 4.",
        "Check in the second equation: 6−4=2. It matches, so the solution is correct.",
      ], answer: "x = 6, y = 4" },
      { q: "Solve 3x + 2y = 18 and 3x - y = 9.", steps: [
        "Both equations have exactly 3x, so subtracting one equation from the other will eliminate x entirely.",
        "Subtract the second equation from the first, doing it to both sides: (3x+2y) − (3x−y) = 18 − 9.",
        "Simplify the left side carefully, remembering to subtract the WHOLE second bracket:\n3x+2y−3x+y =\n3y, so\n3y = 9.",
        "Divide both sides by 3: y = 3.",
        "Substitute y=3 back into the second equation: 3x − 3 = 9.",
        "Add 3 to both sides then divide by 3:\n3x =\n12, so\nx = 4.",
        "Check in the first equation:\n3(4)+2(3) =\n12+6 =\n18. It matches.",
      ], answer: "x = 4, y = 3" },
      { q: "Solve 3x + 2y = 17 and 4x + 3y = 25 (the coefficients don't match immediately, so one equation must be scaled first).", steps: [
        "The y coefficients are 2 and 3, which don't match, so scale both equations: multiply the first by 3 and the second by 2 to make both y coefficients equal to 6.",
        "After scaling: 3(3x+2y) = 3×17 gives 9x+6y = 51, and 2(4x+3y) = 2×25 gives 8x+6y = 50.",
        "Subtract the second scaled equation from the first: (9x+6y)-(8x+6y) = 51-50. The y terms cancel, leaving x = 1.",
        "Substitute x = 1 into the first original equation: 3(1)+2y = 17, so 2y = 14 and y = 7.",
        "Check in the second equation: 4(1)+3(7) = 4+21 = 25. ✓",
      ], answer: "x = 1, y = 7" },
    ],
      tryit: { q: "Solve x + 2y = 12 and x - 2y = 4.", answer: "x = 8, y = 2. Adding the equations gives:\n2x =\n16, so\nx = 8, then substituting into x+2y=12 gives:\n2y =\n4, so\ny = 2." } },
    { h: "2. Substitution", body: [
      "Suppose y=x+2 is true. If x=1, then y=3. Check that 3 really is 'x+2' when x=1: 1+2=3, yes. So wherever y appears in another true statement about the same x and y, replacing it with 'x+2' cannot change whether that statement is true, you're not changing the VALUE, only how it's written down.",
      "That's the whole idea behind substitution: take the equation that already isolates one letter (like y=x+2), and replace that letter with its expression everywhere it appears in the OTHER equation. That turns two equations in two unknowns into a single equation in one unknown, which can then be solved as usual.",
      "This is also the ONLY method that works once one equation is a curve, such as y=x², rather than a straight line. Elimination relies on matching or scaling coefficients across two equations that behave the same way at every point; a curve's 'coefficient' of x isn't constant in that sense, so there's nothing consistent to add or subtract away.",
      "Once a quadratic is involved, there will usually be TWO solutions for x, since factorising a quadratic gives two brackets. This uses factorising, the same technique from Algebraic Manipulation: finding two numbers that multiply to give the constant term and add to give the coefficient of x, exactly as in the worked example below. A common pitfall is solving for x and stopping, forgetting to go back and find the matching y-value for EACH x, and forgetting to check both pairs in the original equations.",
    ], examples: [
      { q: "Solve y = 2x and 3x + y = 15.", steps: [
        "The first equation already gives y on its own, so substitute '2x' in place of y in the second equation: 3x + (2x) = 15.",
        "Simplify the left side:\n3x+2x =\n5x, so\n5x = 15.",
        "Divide both sides by 5: x = 3.",
        "Use y=2x to find y:\ny =\n2×3 =\n6.",
        "Check in the second equation:\n3(3)+6 =\n9+6 =\n15. It matches.",
      ], answer: "x = 3, y = 6" },
      { q: "Solve y = x + 2 and x² + y = 8 (a quadratic this time, so expect two solutions).", steps: [
        "The first equation gives y on its own, so substitute 'x+2' in place of y in the second equation: x² + (x+2) = 8.",
        "Rearrange so everything is on one side:\nx² + x + 2 − 8 =\n0, which simplifies to\nx² + x − 6 = 0.",
        "Factorise: find two numbers multiplying to −6 and adding to 1, those are 3 and −2, so (x+3)(x−2) = 0.",
        "This gives two possible values: x = −3 or x = 2, since a quadratic can have two solutions and both must be followed through.",
        "Find y for x=−3, using y=x+2:\ny =\n−3+2 =\n−1.",
        "Find y for x=2, using y=x+2:\ny =\n2+2 =\n4.",
        "Check both pairs in x²+y=8:\n(−3)²+(−1) =\n9−1 =\n8, and\n(2)²+4 =\n4+4 =\n8. Both work.",
      ], answer: "(x,y) = (-3,-1) or (2,4)" },
      { q: "Solve y = x + 1 and x² + y² = 25 (a line meeting a circle, so expect two intersection points).", steps: [
        "Substitute (x+1) in place of y in the second equation: x² + (x+1)² = 25.",
        "Expand (x+1)² and collect terms: x² + x² + 2x + 1 = 25, giving 2x² + 2x - 24 = 0. Divide by 2: x² + x - 12 = 0.",
        "Factorise: find two numbers multiplying to -12 and adding to 1, those are 4 and -3, so (x+4)(x-3) = 0, giving x = -4 or x = 3.",
        "Find the matching y for each x using y = x+1: x = 3 gives y = 4, and x = -4 gives y = -3.",
        "Check both pairs in x²+y²=25: 3²+4² = 9+16 = 25 ✓, and (-4)²+(-3)² = 16+9 = 25. ✓",
      ], answer: "(x,y) = (3,4) or (-4,-3)" },
    ],
      tryit: { q: "Solve y = 2x and y = x² - 3.", answer: "x=3,y=6 or x=-1,y=-2. Substituting gives:\nx²-2x-3 =\n0, which factorises to\n(x-3)(x+1) = 0, so x=3 or x=-1, and y=2x gives the matching y-values." } },
  ],
};

INTERMEDIATE_LESSONS.quadratics = {
  title: "Quadratics: solving, completing the square, and the graph",
  minutes: 16,
  order: 6,
  prereq: ["algebraicManipulation", "surdsAndIndices"],
  intro: "A quadratic is any expression that can be written as ax² + bx + c, where a, b and c stand for fixed numbers: a is the coefficient of x² (the number multiplying x², which can never be 0, or there'd be no x² term left and it wouldn't be a quadratic any more), b is the coefficient of x, and c is the constant term - the number left on its own with no x attached at all. This lesson covers completing the square (which reveals the graph's turning point and turns out to be the hidden engine behind the quadratic formula), solving by factorising or the formula, and reading off what the discriminant tells you about how many solutions exist, all without needing to memorise any of it as an unexplained fact.",
  sections: [
    { h: "1. Completing the square", body: [
      "This section works with the simplest case, where a=1 - just x²+bx+c, with no separate number multiplying x². The case where a is something other than 1 comes back in Section 2, when the quadratic formula is introduced.",
      "Expand (x+3)² using the method from the algebra lesson:\nFirst x², Outer 3x, Inner 3x, Last 9, giving\nx² + 6x + 9.",
      "Notice that the 9 is exactly (half of 6)², since half of 6 is 3 and 3²=9.",
      "That's the trick used in reverse to 'complete the square'. Given x²+6x+5, first build the bracket that matches the x²+6x part: (x+3)² = x²+6x+9.",
      "But the target only wants +5, not +9, so subtract the 9 that came along for free and add back the 5 that's actually wanted:\nx²+6x+5 =\n(x+3)² − 9 + 5 =\n(x+3)² − 4.",
      "Check by expanding:\n(x+3)²−4 =\nx²+6x+9−4 =\nx²+6x+5, which matches.",
      "In general, for x²+bx+c, halve b, square that half, and use it the same way: x²+bx+c = (x+b/2)² + (c − (b/2)²).",
      "This form reveals the graph's turning point directly. A squared term like (x+3)² can never be negative, its smallest possible value is 0, and that happens exactly when x=−3. So for y=(x+3)²−4, the minimum value of y is −4, at x=−3, giving the turning point (−3,−4).",
    ], examples: [
      { q: "Write x² + 6x + 5 in completed-square form.", steps: [
        "Take half of the coefficient of x: half of 6 is 3.",
        "Square that half: 3² = 9. This tells you (x+3)² expands to x²+6x+9 (First x², Outer 3x, Inner 3x, Last 9).",
        "Compare that to the expression actually wanted, x²+6x+5: same x²+6x part, but +5 instead of +9.",
        "Adjust for the difference: subtract the unwanted 9 and add the wanted 5: x²+6x+5 = (x+3)² − 9 + 5.",
        "Simplify the numbers:\n−9+5 =\n−4, giving\n(x+3)² − 4.",
        "Check by expanding back:\n(x+3)² − 4 =\nx²+6x+9−4 =\nx²+6x+5. It matches.",
      ], answer: "(x+3)² - 4" },
      { q: "Write x² - 8x + 10 in completed-square form, and use it to state the turning point of y = x² - 8x + 10.", steps: [
        "Take half of the coefficient of x: half of −8 is −4.",
        "Square that half: (−4)² = 16, so (x−4)² expands to x²−8x+16 (First x², Outer −4x, Inner −4x, Last 16).",
        "Compare to the target x²−8x+10: same x²−8x part, but +10 instead of +16, so subtract 16 and add 10: x²−8x+10 = (x−4)² − 16 + 10.",
        "Simplify:\n−16+10 =\n−6, giving\n(x−4)² − 6.",
        "Check by expanding:\n(x−4)² − 6 =\nx²−8x+16−6 =\nx²−8x+10. It matches.",
        "Read off the turning point: (x−4)² can never be negative, so its smallest value is 0, at x=4, where:\ny =\n0−6 =\n−6. The turning point is (4,−6).",
      ], answer: "(x-4)² - 6; turning point (4, -6)" },
      { q: "Write 2x² + 12x - 3 in the form a(x + p)² + q, and state the minimum value of y = 2x² + 12x - 3.", steps: [
        "Factor out the coefficient of x² from the x² and x terms: 2x² + 12x - 3 = 2(x² + 6x) - 3.",
        "Complete the square inside the bracket: half of 6 is 3, and 3² = 9, so x² + 6x = (x+3)² - 9.",
        "Substitute back: 2[(x+3)² - 9] - 3 = 2(x+3)² - 18 - 3.",
        "Simplify: 2(x+3)² - 21. Check by expanding: 2(x²+6x+9) - 21 = 2x²+12x+18-21 = 2x²+12x-3. ✓",
        "Read off the minimum: 2(x+3)² is always at least 0, so the smallest value of y is -21, reached when x = -3.",
      ], answer: "2(x+3)² - 21; minimum value -21" },
    ],
      tryit: { q: "Find the turning point of y = x² + 10x + 7.", answer: "(-5, -18). Completing the square: half of 10 is 5, squared is 25, so:\nx²+10x+7 =\n(x+5)² - 25 + 7 =\n(x+5)² - 18, giving a minimum at x=-5, y=-18." } },
    { h: "2. Solving by factorising and the formula", body: [
      "If x²+bx+c factorises neatly - using the numbers-that-multiply-and-add method from the algebra lesson to find a pair of numbers p and q with p×q=c and p+q=b, so x²+bx+c=(x+p)(x+q) - that's the fastest way to solve x²+bx+c=0. Once it's written as (x+p)(x+q)=0, at least one bracket must equal zero, because the only way two numbers can multiply together to give exactly 0 is if one of them already IS 0. So x+p=0 or x+q=0, giving x=−p or x=−q.",
      "But not every quadratic factorises into nice whole numbers, which is where completing the square (Section 1) earns its keep. Take x²+6x+5 again: Section 1 rewrote it as (x+3)²−4.",
      "Setting the whole thing to 0:\n(x+3)²−4 =\n0, so\n(x+3)² = 4.",
      "Square-rooting both sides gives x+3=±2 (both +2 and −2 square to give 4, so both count as valid square roots - that's where the ± comes from), so x=−1 or x=−5.",
      "The same completing-the-square idea works even when a isn't 1 - for the fully general quadratic ax²+bx+c=0. Divide every term by a first, so the x² term has coefficient 1 again, matching Section 1's method exactly:\nx² + (b/a)x + c/a = 0.",
      "Complete the square exactly as in Section 1: halve the coefficient of x, which is now b/a, giving b/(2a), then square that half, giving b²/(4a²):\nx² + (b/a)x + c/a =\n(x + b/(2a))² − b²/(4a²) + c/a.",
      "Set the whole thing to 0 and move the plain-number terms to the other side:\n(x + b/(2a))² =\nb²/(4a²) − c/a.",
      "Combine the two fractions on the right over the same denominator, 4a² (multiplying c/a's top and bottom by 4a so the denominators match):\nb²/(4a²) − c/a =\nb²/(4a²) − 4ac/(4a²) =\n(b² − 4ac)/(4a²).",
      "Square-root both sides, exactly as with (x+3)²=4 above - this again gives two possibilities, the ±, for the same reason (a positive and a negative square root both square back to the same value). The square root of 4a² is 2a, since 4a² is already a perfect square, being (2a)²:\nx + b/(2a) = ±√(b² − 4ac) / (2a).",
      "Subtract b/(2a) from both sides. The two fractions on the right already share the denominator 2a, so they combine directly:\nx =\n−b/(2a) ± √(b² − 4ac)/(2a) =\n(−b ± √(b² − 4ac)) / (2a).",
      "That's the quadratic formula, x=(−b±√(b²−4ac))/2a - and nothing about it was invented separately from Section 1. It's the exact same completing-the-square process, just carried out once symbolically on the letters a, b and c instead of being redone by hand for every new quadratic.",
      "Check it against x²+6x+5=0: matching ax²+bx+c against x²+6x+5 gives a=1 (there's no number written in front of x², which always means the coefficient is 1), b=6, c=5. The expression under the root works out as:\nb²−4ac =\n6²−4(1)(5) =\n36−20 =\n16, and √16=4, so\nx =\n(−6±4)/2, giving\nx=−1 or x=−5, exactly the same two answers found by squaring and rooting directly, above.",
      "This is also why the formula always works, even when factorising fails completely, for example when the solutions involve surds, since it's built from the same square-completing steps as Section 1.",
      "The most common formula slip is losing a negative sign when b is already negative. For x²−6x+5=0, b=−6, so −b becomes +6, not −6. Always substitute the whole value of b, sign included, before applying the extra minus sign in front of it.",
    ], examples: [
      { q: "Solve x² - 5x + 6 = 0.", steps: [
        "Look for two numbers that multiply to give 6 and add to give −5: −2 and −3 (since −2×−3=6 and −2+−3=−5).",
        "Write the factorised form: (x−2)(x−3) = 0.",
        "Since the two brackets multiply to give 0, at least one of them must itself be 0: either x−2=0 or x−3=0.",
        "Solve each: x−2=0 gives x=2; x−3=0 gives x=3.",
      ], answer: "x = 2 or x = 3" },
      { q: "Solve x² + 2x - 4 = 0 using the quadratic formula (this one doesn't factorise into whole numbers).", steps: [
        "Identify a, b and c by comparing to ax²+bx+c=0: a=1, b=2, c=−4.",
        "Work out the discriminant first, b²−4ac:\n2² − 4(1)(−4) =\n4 − (−16) =\n4+16 =\n20.",
        "Since the discriminant is positive, there are two real solutions (more on this in Section 3).",
        "Substitute into the formula x=(−b±√(b²−4ac))/2a: x = (−2 ± √20)/2.",
        "Simplify √20 by pulling out its largest perfect-square factor:\n√20 =\n√(4×5) =\n2√5, so\nx = (−2 ± 2√5)/2.",
        "Divide every term by the denominator, 2: x = −1 ± √5.",
      ], answer: "x = -1 + √5 or x = -1 - √5" },
      { q: "Solve 3x² - 5x - 2 = 0.", steps: [
        "Identify a=3, b=-5, c=-2 and work out the discriminant: b²-4ac = (-5)²-4(3)(-2) = 25+24 = 49.",
        "Since 49 = 7² is a perfect square, the formula gives exact rational answers: x = (5 ± √49) / (2×3) = (5 ± 7) / 6.",
        "Work out the two solutions: x = (5+7)/6 = 12/6 = 2, and x = (5-7)/6 = -2/6 = -1/3.",
        "Check x=2 in the original equation: 3(4)-5(2)-2 = 12-10-2 = 0. ✓",
        "Check x=-1/3: 3(1/9)-5(-1/3)-2 = 1/3+5/3-2 = 6/3-2 = 2-2 = 0. ✓",
      ], answer: "x = 2 or x = -1/3" },
    ],
      tryit: { q: "Solve x² - 2x - 5 = 0 using the formula (leave your answer in surd form).", answer: "x = 1 + √6 or x = 1 - √6. Discriminant =\n(-2)² - 4(1)(-5) =\n4+20 =\n24, so\nx =\n(2 ± √24)/2 =\n(2 ± 2√6)/2 =\n1 ± √6." } },
    { h: "3. The discriminant", body: [
      "The expression that appeared under the square root in Section 2's derivation, b²−4ac, has a name: the discriminant. Look back at Section 2's examples: x²+6x+5=0 had discriminant 16, a positive perfect square, giving two clean whole-number solutions. x²+2x−4=0 had discriminant 20, positive but not a perfect square, giving two surd solutions. Either way, a positive discriminant produced two real solutions.",
      "Now check the boundary case. x²−6x+9=0 factorises as:\n(x−3)(x−3) =\n(x−3)² =\n0, so the only solution is x=3, repeated.",
      "Its discriminant is:\nb²−4ac =\n(−6)²−4(1)(9) =\n36−36 =\n0.",
      "A discriminant of exactly 0 means the formula's ± adds or subtracts nothing, √0=0, so there's only ONE value of x rather than two, a repeated root.",
      "Now check what happens when the discriminant is negative, using x²+4x+7=0:\nb²−4ac =\n16−28 =\n−12.",
      "The formula would need √(−12), but no real number multiplied by itself gives a negative result, so there is no real value of x that solves the equation. The graph of y=x²+4x+7 never touches the x-axis at all.",
      "Knowing the discriminant's sign before solving anything is useful for checking work: a positive discriminant should produce two different answers, zero should produce one repeated answer, and negative should produce none at all, so an answer that doesn't match is a sign a mistake crept in somewhere.",
    ], examples: [
      { q: "How many real solutions does x² - 6x + 9 = 0 have?", steps: [
        "Identify a, b, c: a=1, b=−6, c=9.",
        "Work out the discriminant:\nb²−4ac =\n(−6)² − 4(1)(9) =\n36 − 36 =\n0.",
        "A discriminant of exactly 0 means the formula's ± adds or subtracts nothing, so there's only ONE value of x, not two.",
        "Check by factorising instead:\nx²−6x+9 =\n(x−3)(x−3) =\n(x−3)², so the only solution is x=3, repeated.",
      ], answer: "1 real solution (a repeated root, x = 3)" },
      { q: "How many real solutions does x² + 4x + 7 = 0 have?", steps: [
        "Identify a, b, c: a=1, b=4, c=7.",
        "Work out the discriminant:\nb²−4ac =\n4² − 4(1)(7) =\n16 − 28 =\n−12.",
        "The discriminant is negative, which would require √(−12), but no real number squares to give a negative result, so no real value of x exists.",
      ], answer: "0 real solutions" },
      { q: "Find the value of k for which kx² - 4x + 1 = 0 has exactly one real solution.", steps: [
        "For exactly one real solution, the discriminant must equal zero: b² - 4ac = 0.",
        "Match with the general form ax²+bx+c=0: a=k, b=-4, c=1. Substitute into the discriminant condition: (-4)²-4(k)(1) = 0.",
        "Simplify: 16-4k = 0, giving 4k = 16 and k = 4.",
        "Verify: when k=4 the equation is 4x²-4x+1=0, which factorises as (2x-1)²=0, confirming the single repeated root x=1/2. ✓",
      ], answer: "k = 4" },
    ],
      tryit: { q: "How many real solutions does x² + 3x - 2 = 0 have?", answer: "2 real solutions. The discriminant is:\n3² - 4(1)(-2) =\n9+8 =\n17, which is positive, so there are two distinct real solutions (though they won't be whole numbers, since 17 isn't a perfect square)." } },
  ],
};

INTERMEDIATE_LESSONS.percentageAndCompoundGrowth = {
  title: "Percentages & Compound Growth: multipliers, not just fractions",
  minutes: 16,
  order: 4,
  prereq: [],
  intro: "The single most useful percentage skill for GCSE and Kangaroo alike is thinking in MULTIPLIERS rather than 'find 10%, then add it on'. A 15% increase means multiply by 1.15. A 15% decrease means multiply by 0.85. This lesson doesn't just hand you that rule, it builds it from scratch so you can see why it works, then extends it to compound growth over several years and to working backwards from an after-value to a before-value.",
  sections: [
    { h: "1. The multiplier method", body: [
      "Increase £80 by 15% the way you probably learned first: find 15% of £80, then add it on. 10% of £80 = £8, and 5% of £80 = £4, so\n15% of £80 =\n£8 + £4 =\n£12.\nAdding that on: £80 + £12 = £92.",
      "Now look closely at what that calculation actually did. £80 + £12 is the same as £80 × 1 + £80 × 0.15 (since £12 is exactly 0.15 × £80). Factor out the £80:\n£80 × 1 + £80 × 0.15 =\n£80 × (1 + 0.15) =\n£80 × 1.15.\nThe two-step 'find it, then add it' process and the one-step 'multiply by 1.15' process give the exact same £92, because they are the exact same arithmetic, just written differently.",
      "That works for any starting amount and any percentage, not just 15% of £80. Let r stand for that percentage (just the plain number, like 15, not '15%'). Increasing by r% means:\nnew =\nold + (r/100) × old =\nold × (1 + r/100).\nThe number (1 + r/100) is called the multiplier, and it packages the whole 'find the percentage, then add' process into a single multiplication.",
      "Decreasing works the same way, with a subtraction instead of an addition. Decrease £80 by 15%: £80 - £12 = £68. Written as a multiplication, that's:\n£80 × 1 - £80 × 0.15 =\n£80 × (1 - 0.15) =\n£80 × 0.85,\nand £80 × 0.85 = £68 too. So decreasing by r% means multiplying by (1 - r/100).",
      "The common slip is mixing up which way the multiplier moves: an increase always gives a multiplier ABOVE 1, a decrease always gives one BELOW 1. If a calculation produces a multiplier like 0.85 for something that should be growing, that's a sign of a sign error, not a valid answer.",
    ], examples: [
      { q: "Increase £80 by 15%.", steps: [
        "Turn the percentage into a decimal:\n15% =\n15/100 =\n0.15.",
        "Since this is an increase, add 1 to get the multiplier: 1 + 0.15 = 1.15.",
        "Multiply the original amount by the multiplier: £80 × 1.15.",
        "£80 × 1.15 = £92.",
      ], answer: "£92" },
      { q: "Decrease £340 by 8% (bigger, messier numbers to check the method still works).", steps: [
        "Turn the percentage into a decimal:\n8% =\n8/100 =\n0.08.",
        "Since this is a decrease, subtract from 1 to get the multiplier: 1 - 0.08 = 0.92.",
        "Multiply the original amount by the multiplier: £340 × 0.92.",
        "£340 × 0.92 = £312.80.",
      ], answer: "£312.80" },
      { q: "A price increases by 25% and then the new price decreases by 20%. What is the overall percentage change?", steps: [
        "The multiplier for a 25% increase is 1 + 0.25 = 1.25.",
        "The multiplier for a 20% decrease is 1 - 0.20 = 0.80.",
        "Multiply the two multipliers to find the combined effect: 1.25 × 0.80 = 1.00.",
        "A combined multiplier of exactly 1.00 means the final price equals the original, so the overall percentage change is 0%.",
        "Note: this seems surprising, but the 20% decrease is applied to the already-increased price, so it removes more than 20% of the original, exactly cancelling the 25% gain.",
      ], answer: "0% overall change" },
    ],
      tryit: { q: "Decrease £120 by 30%.", answer: "£84, using the multiplier 1 - 0.30 = 0.70, since £120 × 0.70 = £84." } },
    { h: "2. Compound growth over several years", body: [
      "Suppose £500 sits in an account paying 4% interest a year. Simple interest would add the SAME flat amount every single year:\n4% of £500 =\n£20, so after 3 years you'd have\n£500 + £20 + £20 + £20 =\n£560.\nCompound interest is different: it pays 4% of the CURRENT balance each year, not the original £500, so the amount being added grows too.",
      "Working it out year by year with the multiplier from Section 1:\nafter year 1, £500 × 1.04 =\n£520.00.\nAfter year 2, that new balance grows again:\n£520.00 × 1.04 =\n£540.80.\nAfter year 3:\n£540.80 × 1.04 =\n£562.432, so £562.43 to the nearest penny.",
      "Multiplying by 1.04 three times in a row, one after another, is exactly the same as multiplying by 1.04³ in one go, since 1.04 × 1.04 × 1.04 = 1.04³.\nChecking:\n1.04³ =\n1.124864, and\n£500 × 1.124864 =\n£562.432,\nmatching the year-by-year answer exactly.",
      "That gives the general rule: letting n stand for however many years the growth continues, growing repeatedly by r% for n years means multiplying by (1 + r/100)ⁿ. Shrinking repeatedly (depreciation) works identically, using (1 - r/100)ⁿ instead.",
      "The classic mistake is confusing this with simple interest, i.e. multiplying the PERCENTAGE by the number of years (4% × 3 = 12%, then applying that once) instead of raising the MULTIPLIER to a power. Those give different answers (£560 vs £562.43 above) because they describe different situations, and only the power method matches genuine year-on-year compounding.",
    ], examples: [
      { q: "£500 is invested at 4% compound interest for 3 years. What is it worth?", steps: [
        "Find the multiplier for one year: 1 + 4/100 = 1.04.",
        "Growing for 3 years means applying that multiplier 3 times in a row, i.e. raising it to the power 3: 1.04³.",
        "Work out 1.04³: 1.04 × 1.04 × 1.04 = 1.124864.",
        "Multiply by the original amount: £500 × 1.124864 = £562.432.",
        "Round to the nearest penny: £562.43.",
      ], answer: "£562.43" },
      { q: "A machine worth £8,000 depreciates by 12% per year. What is it worth after 4 years?", steps: [
        "Find the multiplier for one year: since this is a decrease, 1 - 12/100 = 0.88.",
        "Depreciating for 4 years means applying that multiplier 4 times: 0.88⁴.",
        "Work out 0.88² first: 0.88 × 0.88 = 0.7744.",
        "Square that result to get 0.88⁴: 0.7744 × 0.7744 = 0.59969536.",
        "Multiply by the original value: £8,000 × 0.59969536 = £4,797.56 (to the nearest penny).",
      ], answer: "£4,797.56" },
      { q: "£2,000 is invested at 5% per year compound interest. After how many complete years does the investment first exceed £2,500?", steps: [
        "The multiplier for 5% compound interest is 1.05. After n years the investment is worth £2000 × 1.05^n.",
        "Calculate year by year: after year 1, £2000 × 1.05 = £2100. After year 2: £2100 × 1.05 = £2205.",
        "After year 3: £2205 × 1.05 = £2315.25. After year 4: £2315.25 × 1.05 = £2431.01 (to the nearest penny).",
        "After year 4 the total is still below £2500, so continue: after year 5, £2431.01 × 1.05 = £2552.56.",
        "£2552.56 exceeds £2500, so the investment first exceeds £2500 after 5 complete years.",
      ], answer: "5 years" },
    ],
      tryit: { q: "A car worth £12,000 depreciates by 20% per year. What is it worth after 2 years?", answer: "£7,680, using the multiplier 1 - 0.20 = 0.80 applied twice:\n£12,000 × 0.8² =\n£12,000 × 0.64 =\n£7,680." } },
    { h: "3. Reverse percentages", body: [
      "It's tempting to think that if a 20% increase gives £60, you can just take 20% off £60 to get back to the original price. Test that:\n20% of £60 =\n£12, so\n£60 - £12 =\n£48.\nBut check it the other way: does £50 increased by 20% actually give £60?\n20% of £50 =\n£10, and\n£50 + £10 =\n£60.\nYes it does, yet the 'take 20% off the after-value' method gave £48, not £50. The two directions are NOT simple opposites of each other.",
      "The reason is that '20% of £60' and '20% of £50' are 20% of two DIFFERENT numbers. In multiplier terms, increasing by 20% then decreasing by 20% means multiplying by 1.20 then by 0.80, and 1.20 × 0.80 = 0.96, not 1. So going up 20% and then down 20% leaves you 4% below where you started, not back at the start.",
      "The reliable method uses the multiplier the same way Sections 1 and 2 did: after = before × multiplier. If you know the AFTER value and the multiplier, undo the multiplication with a division: before = after ÷ multiplier.",
      "So for a 20% increase ending at £60: the multiplier is 1.20, and\nbefore =\n£60 ÷ 1.20 =\n£50,\nmatching the value confirmed above by forward-checking. The rule in general: never apply the percentage to the after-value; always divide the after-value by the multiplier.",
    ], examples: [
      { q: "After a 20% increase, a price is £60. What was the original price?", steps: [
        "Write the relationship using the multiplier: after = before × multiplier.",
        "Find the multiplier for a 20% increase: 1 + 0.20 = 1.20.",
        "Substitute the known after value: 60 = before × 1.20.",
        "Divide both sides by 1.20 to isolate before: before = 60 ÷ 1.20.",
        "60 ÷ 1.20 = 50.",
        "Check: £50 × 1.20 = £60. This matches the given after-value, confirming the answer.",
      ], answer: "£50" },
      { q: "After a 15% decrease, a laptop costs £221. What was the original price?", steps: [
        "Write the relationship using the multiplier: after = before × multiplier.",
        "Find the multiplier for a 15% decrease: 1 - 0.15 = 0.85.",
        "Substitute the known after value: 221 = before × 0.85.",
        "Divide both sides by 0.85 to isolate before: before = 221 ÷ 0.85.",
        "221 ÷ 0.85 = 260.",
        "Check: £260 × 0.85 = £221. This matches, confirming the answer.",
      ], answer: "£260" },
      { q: "A shop applies two successive discounts: first 30% off, then a further 20% off the reduced price. If the final price is £56, what was the original price?", steps: [
        "The multiplier for the first discount of 30% is 1 - 0.30 = 0.70.",
        "The multiplier for the second discount of 20% is 1 - 0.20 = 0.80.",
        "The combined multiplier for both discounts applied in sequence is 0.70 × 0.80 = 0.56.",
        "Using final = original × 0.56, divide both sides to find original: £56 ÷ 0.56 = £100.",
        "Check by applying both discounts forward: £100 × 0.70 = £70, then £70 × 0.80 = £56. ✓",
      ], answer: "£100" },
    ],
      tryit: { q: "After a 10% increase, a bag of sweets costs £4.40. What was the original price?", answer: "£4.00, since dividing £4.40 by the multiplier 1.10 gives:\nbefore =\n£4.40 ÷ 1.10 =\n£4.00." } },
  ],
};

INTERMEDIATE_LESSONS.surdicModularNumberTheory = {
  title: "Modular Arithmetic & Surd Identities",
  minutes: 17,
  order: 10,
  prereq: ["surdsAndIndices", "numberTheoryDivisibility"],
  intro: "This lesson goes a level deeper into two ideas from Number Theory and Surds & Indices: spotting which fractions terminate as decimals (and which recur forever), and using the (a+b)(a-b) surd-conjugate trick to clear roots entirely from an expression, before finishing with modular exponentiation, remainders of very large powers.",
  sections: [
    { h: "1. Which fractions terminate?", body: [
      "Divide 1 by 4 by hand: 1 ÷ 4 = 0.25 exactly, and the division stops. That's because 1/4 can be rewritten with a denominator of 100 (a power of 10): 1/4 = 25/100, and any fraction over a power of 10 is just digits placed after the decimal point, so it terminates.",
      "Now divide 1 by 3: 1 ÷ 3 = 0.333... and it never stops, no matter how many more 3s you compute. The reason is that no whole number multiplied by 3 ever lands exactly on a power of 10 (10, 100, 1000, ...), so 1/3 can never be rewritten with a power-of-10 denominator the way 1/4 could.",
      "This next step leans on prime factorisation from Number Theory & Divisibility: breaking a number down into the prime numbers that multiply together to make it (so 12 = 2×2×3, for example). Since 10 = 2 × 5, every power of 10 is built ONLY from the prime factors 2 and 5. A fraction can be rewritten over a power of 10 exactly when its (fully simplified) denominator's only prime factors are 2 and/or 5 too. If the denominator contains any other prime factor (3, 7, 11, ...), it can never be scaled up to match a power of 10, so the division carries on forever and the decimal recurs.",
      "That gives the working rule: a fraction terminates exactly when its fully simplified denominator has no prime factors other than 2 and 5. Any other prime factor in the denominator means the decimal recurs.",
      "The word 'simplified' matters. Check the denominator's prime factors only AFTER cancelling anything the numerator and denominator share. For example 3/6 looks like it has a 3 in the denominator's factorisation (6 = 2×3), but 3/6 simplifies to 1/2 first, and 1/2 terminates perfectly well, since the 3 cancelled away before it could cause trouble.",
    ], examples: [
      { q: "Does 7/16 terminate?", steps: [
        "Check whether 7/16 is already fully simplified: 7 is prime and does not divide into 16, so yes, it is already in simplest form.",
        "Find the prime factors of the denominator:\n16 =\n2×2×2×2 =\n2⁴.",
        "The only prime factor present is 2, which is allowed, so 7/16 terminates.",
        "Confirm by dividing: 7 ÷ 16 = 0.4375, which does stop.",
      ], answer: "Yes - 7/16 = 0.4375" },
      { q: "Does 21/56 terminate? (needs simplifying first)", steps: [
        "Check whether 21/56 is fully simplified: 21 = 3×7 and 56 = 8×7, so both share a factor of 7 - it is not yet simplified.",
        "Cancel the shared factor of 7: 21/56 = 3/8.",
        "Find the prime factors of the simplified denominator:\n8 =\n2×2×2 =\n2³.",
        "Only the prime factor 2 appears, so 3/8 (and therefore the original 21/56) terminates.",
        "Confirm by dividing: 3 ÷ 8 = 0.375.",
      ], answer: "Yes - 21/56 = 3/8 = 0.375" },
      { q: "Does 77/350 terminate? If so, write it as a terminating decimal.", steps: [
        "Check whether 77/350 is fully simplified: 77 = 7 × 11 and 350 = 2 × 5² × 7, so both share the factor 7.",
        "Cancel the common factor: 77/350 = 11/50.",
        "Find the prime factors of the simplified denominator: 50 = 2 × 5². The only prime factors are 2 and 5, so the decimal terminates.",
        "To convert: 50 × 2 = 100, so multiply numerator and denominator by 2: 11/50 = 22/100 = 0.22.",
        "Check: 0.22 × 350 = 77. ✓",
      ], answer: "Yes - 77/350 = 0.22" },
    ],
      tryit: { q: "Does 5/12 terminate?", answer: "No - 12 = 2² × 3, and the leftover 3 means it recurs (5/12 = 0.41666...)." } },
    { h: "2. The surd conjugate trick", body: [
      "Let x and y stand for any two numbers or algebraic terms - nothing here depends on them being surds yet. Expand (x+y)(x-y) fully using FOIL, keeping every term rather than jumping to the answer.\n(x+y)(x-y) =\nx×x + x×(-y) + y×x + y×(-y) =\nx² - xy + xy - y².",
      "Look at the middle two terms: -xy and +xy are exact opposites (multiplication doesn't care about the order you write x and y in), so they cancel to zero, leaving x² - y². That's the whole 'difference of two squares' identity, and it comes from watching the middle terms destroy each other, not from a rule handed down with no explanation.",
      "The two expressions being multiplied, (x+y) and (x-y), contain exactly the same two terms but with the sign in the middle flipped. A pair like that is called a conjugate pair, and multiplying a conjugate pair together like this is exactly the trick this section is named after.",
      "Now bring surds into it. Let a and b be two numbers that aren't negative, so that √a and √b are real numbers, and set x = √a, y = √b - a conjugate pair built from surds instead of plain letters. The same cancellation happens: (√a+√b)(√a-√b) = (√a)² - (√b)². From Surds & Indices, squaring undoes a square root, so (√a)² = a and (√b)² = b, and the whole expression collapses to a - b, with no surds left anywhere.",
      "Check it on numbers where both sides are easy to verify directly: let a=9, b=4.\n(√9+√4)(√9-√4) =\n(3+2)(3-2) =\n5×1 =\n5,\nand\na-b =\n9-4 =\n5.\nBoth routes agree.",
      "Once you recognise the (√a+√b)(√a-√b) shape - a conjugate pair of surds - skip the expansion and jump straight to a-b. The one condition to watch for: the SAME pair of terms must appear with opposite signs. (√a+√b)(√a+√b) is a completely different calculation (that's a square of a sum, not a difference of squares, and not a conjugate pair), so check the signs before applying the shortcut.",
    ], examples: [
      { q: "Simplify (√11+√3)(√11-√3).", steps: [
        "Recognise the pattern: this is (x+y)(x-y) with x=√11 and y=√3, which always equals x² - y².",
        "Work out x²: (√11)² = 11, since squaring undoes the root.",
        "Work out y²: (√3)² = 3.",
        "Subtract:\nx² - y² =\n11 - 3 =\n8.",
      ], answer: "8" },
      { q: "Simplify (5+√6)(5-√6) (a whole number paired with a surd).", steps: [
        "Recognise the pattern: this still matches (x+y)(x-y), with x=5 and y=√6 - x does not need to be a surd itself for the identity to apply.",
        "Work out x²: 5² = 25.",
        "Work out y²: (√6)² = 6.",
        "Subtract:\nx² - y² =\n25 - 6 =\n19.",
      ], answer: "19" },
      { q: "Rationalise the denominator of 4/(√7 - √3), writing your answer in simplified form.", steps: [
        "The conjugate of (√7 - √3) is (√7 + √3). Multiplying by (√7 + √3)/(√7 + √3) equals 1, so the fraction's value is unchanged.",
        "Multiply the numerators: 4 × (√7 + √3) = 4√7 + 4√3.",
        "Multiply the denominators using the conjugate rule: (√7 - √3)(√7 + √3) = (√7)² - (√3)² = 7 - 3 = 4.",
        "Write the fraction: (4√7 + 4√3) / 4.",
        "Simplify by dividing numerator and denominator by 4: (4√7 + 4√3) / 4 = √7 + √3.",
      ], answer: "√7 + √3" },
    ],
      tryit: { q: "Simplify (√15+√2)(√15-√2).", answer: "13, since this matches x² - y² with x=√15 and y=√2, giving 15 - 2 = 13." } },
    { h: "3. Modular exponentiation", body: [
      "Let a and m be two whole numbers, with m greater than zero (m is called the modulus). 'a mod m' just means the remainder left when a is divided by m. Check:\n17 ÷ 5 =\n3 remainder 2, so\n17 mod 5 =\n2.\nAnother check:\n20 ÷ 5 =\n4 remainder 0, so\n20 mod 5 =\n0, since 5 divides 20 exactly.",
      "For small numbers, finding aᵇ mod m is direct: work out the power aᵇ FIRST, then divide by m and read off the remainder (the power always happens before the mod). For example:\n3⁴ =\n81, and\n81 ÷ 7 =\n11 remainder 4\n(since 11×7 = 77 and 81-77 = 4), so\n3⁴ mod 7 =\n4.",
      "For a LARGE exponent b, computing aᵇ directly becomes impossible, the number of digits explodes long before you can divide it by anything. Instead, track only the remainder after each multiplication, and watch for it starting to repeat. List the remainders of successive powers of 3 mod 7:\n3¹ mod 7 = 3,\n3² mod 7 =\n9 mod 7 =\n2,\n3³ mod 7 =\n27 mod 7 =\n6,\n3⁴ mod 7 =\n81 mod 7 =\n4\n(matching above),\n3⁵ mod 7 =\n(4×3) mod 7 =\n12 mod 7 =\n5,\n3⁶ mod 7 =\n(5×3) mod 7 =\n15 mod 7 =\n1.",
      "3⁶ mod 7 landing back on 1 is the signal to stop: multiplying by 3 again just restarts the same sequence, since\n3⁷ mod 7 =\n(1×3) mod 7 =\n3,\nidentical to 3¹ mod 7. So the remainders cycle forever in a block of length 6: 3, 2, 6, 4, 5, 1, then repeat.",
      "To find a huge power like 3²⁰ mod 7 without ever computing 3²⁰, work out where exponent 20 falls inside that length-6 cycle:\n20 ÷ 6 =\n3 remainder 2, so 3²⁰ sits in the same position as 3² in the list, giving\n3²⁰ mod 7 =\n2.\nThe cycle length isn't always guessable in advance, it has to be found by generating remainders until one repeats a value seen before.",
    ], examples: [
      { q: "Find 3⁴ mod 7.", steps: [
        "Compute the actual power:\n3⁴ =\n3×3×3×3 =\n81.",
        "Divide by 7 and find the remainder: 81 ÷ 7 = 11 remainder 4, since 11×7 = 77 and 81-77 = 4.",
        "So 3⁴ mod 7 = 4.",
      ], answer: "4" },
      { q: "Find 3²⁰ mod 7 without computing 3²⁰ directly.", steps: [
        "List the remainders of successive powers of 3 mod 7 until they repeat: 3¹→3, 3²→2, 3³→6, 3⁴→4, 3⁵→5, 3⁶→1.",
        "3⁶ mod 7 = 1 signals the cycle restarting, since multiplying by 3 again reproduces 3¹'s remainder. So the cycle has length 6: 3, 2, 6, 4, 5, 1, repeating.",
        "Find where exponent 20 falls in a cycle of length 6: 20 ÷ 6 = 3 remainder 2, so exponent 20 matches the same position as exponent 2.",
        "Read off the remainder at position 2 from the list: 2.",
      ], answer: "2" },
      { q: "Find 7⁵⁰ mod 4.", steps: [
        "Reduce the base first: 7 ÷ 4 = 1 remainder 3, so 7 ≡ 3 (mod 4). Powers of 7 mod 4 behave exactly like powers of 3 mod 4.",
        "Find the cycle of remainders for powers of 3 mod 4: 3¹ mod 4 = 3; 3² mod 4 = 9 mod 4 = 1; 3³ mod 4 = 3×1 = 3. The cycle (3, 1) has length 2.",
        "Divide the exponent 50 by the cycle length 2: 50 = 25×2, remainder 0.",
        "A remainder of 0 places the exponent at the same position as exponent 2 (the last step in each cycle), so 7⁵⁰ mod 4 = 1.",
        "Check: 7 ≡ -1 (mod 4), so 7⁵⁰ ≡ (-1)⁵⁰ = 1 (mod 4). ✓",
      ], answer: "1" },
    ],
      tryit: { q: "Find 5¹⁰⁰ mod 3 by spotting a short cycle.", answer: "1. Since 5 mod 3 = 2, the remainders of powers of 2 mod 3 cycle as 2, 1, 2, 1, ... with cycle length 2. Because 100 is even, it matches the same position as exponent 2, which gives remainder 1." } },
  ],
};

INTERMEDIATE_LESSONS.ratioProportionAlgebraic = {
  title: "Proportion as Algebra: y=kx and y=k/x",
  minutes: 15,
  order: 7,
  prereq: [{ module: "primary", key: "ratioBasics" }, "algebraicManipulation"],
  intro: "'Directly proportional' and 'inversely proportional' are really just two equation shapes: y=kx (direct) and y=k/x (inverse). In both, k stands for a fixed number that doesn't change across matching pairs of x and y drawn from the SAME relationship - though a different problem will generally have a different value of k. Once you spot which shape a problem fits, working out what k actually equals for that problem unlocks the whole question.",
  sections: [
    { h: "1. Direct proportion: y = kx", body: [
      "Suppose y = 4x. Build a table and check the ratio y/x every time: x=1 gives y=4 (ratio 4/1=4), x=5 gives y=20 (ratio 20/5=4), x=10 gives y=40 (ratio 40/10=4). No matter which pair you pick, y/x always comes out as the same number, 4. That fixed ratio is what 'directly proportional' actually means.",
      "The 4 in y=4x is only fixed for THIS particular relationship - a different proportional relationship would have a different fixed number sitting in its place. Rather than write out a specific number every time, use the letter k to stand for 'whichever fixed number happens to apply here'. So the general shape of every direct proportion is y=kx, with k equal to 4 for the relationship above, but free to be a completely different number in a different problem.",
      "Where does the value of k actually come from, for a given problem? Start from y=kx and divide both sides by x (this is allowed as long as x isn't 0):\ny/x =\nkx/x =\nk.\nSo k is just y divided by x - work it out from any one matching pair of x and y, and it comes out the same from every other pair in that relationship. Checking this on the example above: for y=4x,\ny/x =\n4x/x =\n4,\nmatching the 4 already spotted in the table.",
      "That's exactly why the method works: since y=kx holds for EVERY matching pair of x and y in a relationship, and k stays fixed throughout, any single known pair can be used to find k by computing k=y/x as just derived - and once k is known, it applies to every other pair from that same relationship.",
      "It also explains the doubling behaviour: if x becomes 2x, then y becomes:\nk×(2x) =\n2×(kx) =\n2y.\nWhatever happens to x happens to y as well, doubling causes doubling, tripling causes tripling, because k stays fixed throughout.",
      "To use this on a problem: spot the language ('proportional to', 'varies directly as') or a graph that's a straight line through the origin, find k from one given pair using k=y/x, write the specific equation y=kx (or y=kx² etc, matching whatever power is stated), then substitute to answer the rest.",
      "Watch out for relationships that LOOK proportional but aren't: y=kx passes through the origin (x=0 gives y=0), but y=x+5 does not, so it is not truly proportional even though y still increases as x increases. A genuine proportion has no '+constant' added on.",
    ], examples: [
      { q: "y is proportional to x. When x=5, y=20. Find y when x=8.", steps: [
        "Since y is directly proportional to x, y = kx for some fixed constant k.",
        "Use the known pair to find k: k = y/x, so\n20/5 =\n4.",
        "Write the specific equation: y = 4x.",
        "Substitute x=8:\ny = 4×8 =\n32.",
      ], answer: "32" },
      { q: "y is proportional to x². When x=3, y=45. Find y when x=5.", steps: [
        "Since y is directly proportional to x², the equation is y = kx² (not y = kx - the power matters).",
        "Use the known pair to find k: k = y/x², so\n45/3² =\n45/9 =\n5.",
        "Write the specific equation: y = 5x².",
        "Substitute x=5:\ny = 5×5² =\n5×25 =\n125.",
      ], answer: "125" },
      { q: "y is proportional to √x. When x = 4, y = 10, find y when x = 25, and find x when y = 35.", steps: [
        "Since y is proportional to √x, write y = k√x for some fixed constant k.",
        "Use the known pair to find k: 10 = k × √4 = k × 2, so k = 5.",
        "Write the specific equation: y = 5√x.",
        "Substitute x = 25 to find y: y = 5 × √25 = 5 × 5 = 25.",
        "To find x when y = 35: 35 = 5√x, so √x = 7, giving x = 49.",
      ], answer: "y = 25 when x = 25; x = 49 when y = 35" },
    ],
      tryit: { q: "y is proportional to x. When x=7, y=21. Find y when x=12.", answer: "36, since k = y/x, so\n21/7 =\n3,\ngiving y = 3x, so\ny = 3×12 =\n36." } },
    { h: "2. Inverse proportion: y = k/x", body: [
      "Suppose xy = 60 always. Build a table: x=4 gives y=15 (product 60), x=6 gives y=10 (product 60), x=12 gives y=5 (product 60). The product xy stays fixed at 60 every time - that's what 'inversely proportional' means.",
      "This comes directly from the general shape y = k/x, where k again just stands for whichever fixed number applies to this particular relationship (exactly as in Section 1) - only this time it's the PRODUCT xy that stays fixed, not the ratio. Multiply both sides of y=k/x by x:\ny × x =\n(k/x) × x =\nk,\nso xy = k for any matching pair drawn from the same relationship. Checking against the example above, xy=60 throughout, so k=60 here.",
      "Check the halving behaviour with real numbers: x=4 gives y=15, and doubling x to 8 gives:\ny = 60/8 =\n7.5,\nexactly half of 15. Confirm the product still holds: 8×7.5 = 60. So doubling x halves y, the opposite behaviour to direct proportion.",
      "To use this on a problem: find k = xy from one known pair, write the specific equation y = k/x (or y = k/x² etc, matching the power stated), then substitute to answer the rest.",
      "The trap is applying direct-proportion thinking by mistake: in an inverse relationship, doubling x does NOT double y, it halves it. Always check which shape the problem actually describes before assuming either one.",
    ], examples: [
      { q: "y is inversely proportional to x. When x=4, y=15. Find y when x=6.", steps: [
        "Since y is inversely proportional to x, xy = k for some fixed constant k.",
        "Use the known pair to find k: k = xy, so\n4×15 =\n60.",
        "Write the specific equation: y = 60/x.",
        "Substitute x=6:\ny = 60/6 =\n10.",
      ], answer: "10" },
      { q: "y is inversely proportional to x³. When x=2, y=10. Find y when x=5.", steps: [
        "Since y is inversely proportional to x³, the equation is x³y = k (not xy = k - the power matters).",
        "Use the known pair to find k: k = x³×y, so\n2³×10 =\n8×10 =\n80.",
        "Write the specific equation: y = 80/x³.",
        "Substitute x=5:\ny = 80/5³ =\n80/125 =\n0.64.",
      ], answer: "0.64" },
      { q: "P is inversely proportional to √Q. When P = 6, Q = 4, find P when Q = 36, and find Q when P = 18.", steps: [
        "Since P is inversely proportional to √Q, write P = k/√Q, which means P√Q = k.",
        "Use the known pair to find k: k = P × √Q = 6 × √4 = 6 × 2 = 12.",
        "Write the specific equation: P = 12/√Q.",
        "Substitute Q = 36 to find P: P = 12/√36 = 12/6 = 2.",
        "To find Q when P = 18: 18 = 12/√Q, so √Q = 12/18 = 2/3, giving Q = (2/3)² = 4/9.",
      ], answer: "P = 2 when Q = 36; Q = 4/9 when P = 18" },
    ],
      tryit: { q: "y is inversely proportional to x². When x=2, y=9. Find y when x=3.", answer: "4, since k = x²y, so\n2²×9 =\n36,\nand\ny = 36/3² =\n36/9 =\n4." } },
    { h: "3. Spotting which shape a real-world problem fits", body: [
      "Test the speed and time relationship with actual numbers first. Driving a FIXED distance of 120 miles: at 60mph it takes 120/60 = 2 hours, but at 30mph (half the speed) it takes 120/30 = 4 hours (double the time). Speed halved, time doubled - that's the signature of inverse proportion, and it makes sense as:\nspeed × time =\ndistance =\n120,\na constant.",
      "Compare that with density. For a FIXED material, mass and volume are directly proportional: double the volume of the same substance and you get exactly double the mass, since mass = density × volume, and the density (the constant) doesn't change when you take more or less of the same stuff.",
      "Reading the real-world situation correctly matters more than the algebra itself. Ask: if one quantity doubles, does the other quantity also double (direct proportion) or does it halve (inverse proportion)? Getting that answer right tells you immediately whether to reach for y=kx or y=k/x.",
    ], examples: [
      { q: "A car travels a fixed distance of 180 miles. At 45mph the journey takes 4 hours. How long does it take at 60mph?", steps: [
        "Decide the shape: for a FIXED distance, speed and time are inversely proportional (a faster speed needs less time), so speed × time = k, a constant equal to the distance.",
        "Find k from the known pair:\nk = 45×4 =\n180\n(the fixed distance in miles).",
        "Write the specific equation: time = 180/speed.",
        "Substitute speed=60:\ntime = 180/60 =\n3 hours.",
      ], answer: "3 hours" },
      { q: "A pump empties a tank of fixed volume. At 150 litres per minute the job takes 60 minutes. How long would it take at 225 litres per minute?", steps: [
        "Decide the shape: for a fixed volume, flow rate and time are inversely proportional — a faster rate needs less time.",
        "Find the constant:\nk = 150 × 60 =\n9000\n(the fixed volume in litres).",
        "Write the equation: time = 9000 / rate.",
        "Substitute rate = 225:\ntime = 9000 / 225 =\n40 minutes.",
      ], answer: "40 minutes" },
      { q: "A driver covers a fixed route of 300 km at 120 km/h, taking 2.5 hours. A road closure forces a diversion that is 50% longer. What constant speed must the driver maintain to complete the longer route in the same time?", steps: [
        "Original route: 300 km in 2.5 h at 120 km/h — confirm: speed × time = 120 × 2.5 = 300 ✓",
        "The diverted route is 1.5 × 300 = 450 km.",
        "Same time of 2.5 hours must still be met: required speed = distance / time = 450 / 2.5 = 180 km/h.",
        "As a check on the shape: speed scales with distance for a fixed time, which is direct proportion (not inverse) — so the 50% longer route needs a 50% faster speed: 1.5 × 120 = 180 ✓",
      ], answer: "180 km/h (50% faster because the route is 50% longer and the time is fixed)" },
    ],
      tryit: { q: "A recipe uses a fixed ratio of butter to flour. 300g of flour needs 150g of butter. How much butter is needed for 500g of flour, using the same ratio?", answer: "250g. Butter is directly proportional to flour for a fixed recipe ratio:\nk = 150/300 =\n0.5, so\nbutter = 0.5×500 =\n250g." } },
  ],
};

INTERMEDIATE_LESSONS.algebraicProof = {
  title: "Algebraic Proof: showing it's ALWAYS true",
  minutes: 18,
  order: 11,
  prereq: ["algebraicManipulation"],
  intro: "A proof has to work for every possible number, not just the ones you happen to try. This lesson covers the standard building blocks, expressing 'any even number' as 2n, 'consecutive integers' as n, n+1, n+2, and shows exactly why testing a handful of examples can never be enough, before finishing with a full worked proof.",
  sections: [
    { h: "1. Representing number types algebraically", body: [
      "Try the claim 'the sum of two consecutive integers is always odd' on two actual numbers first. n=3: the integers are 3 and 4, sum = 7 (odd). n=100: the integers are 100 and 101, sum = 201 (odd). Both worked, but neither one, nor both together, proves it for every integer, there's no way to write down a general argument yet, only two checks.",
      "To argue about EVERY integer at once, algebra uses a single letter, say n, to stand for 'any integer whatsoever' - not one particular number, but a placeholder for every integer at once. Any even number can then be written 2n. That works because every even number is, by definition, exactly 2 times some whole number, so as n runs through every integer in turn (..., -1, 0, 1, 2, 3, ...), the expression 2n runs through every even number, and only even numbers: n=1 gives 2, n=2 gives 4, n=0 gives 0, n=-1 gives -2.",
      "Any odd number is 2n+1. Odd numbers sit exactly one more than an even number, so taking the same 2n and adding 1 shifts every even number up to the odd number right next to it: n=0 gives 1, n=1 gives 3, n=2 gives 5. Consecutive integers are written n, n+1, n+2, and consecutive EVEN numbers are 2n, 2n+2, 2n+4 (each one 2 more than the last).",
      "This is why algebra can prove something a handful of examples cannot: n is not one fixed number, it's a placeholder standing for ANY integer simultaneously. A calculation carried out using n (rather than a specific value) is therefore true for every integer at once, the moment the algebra is finished, the proof is finished too.",
      "One care point: n ranges over ALL integers, including zero and negative numbers, not just the positive counting numbers you'd list first. Check 2n+1 still behaves correctly at n=-1: 2×(-1)+1 = -1, which is indeed odd, so the representation holds even at the edge cases.",
    ], examples: [
      { q: "Prove that the sum of two consecutive integers is always odd.", steps: [
        "Represent the two consecutive integers algebraically: let them be n and n+1, where n stands for any integer.",
        "Add them: sum = n + (n+1).",
        "Simplify: n + (n+1) = 2n+1.",
        "2n+1 matches the general form for an odd number, 2 times something plus 1, so the sum is odd.",
        "Because n could have been any integer, this holds for every possible pair of consecutive integers, including the n=3 and n=100 cases checked above, and every other integer besides.",
      ], answer: "2n+1 is always odd, so the sum of two consecutive integers is always odd, true for every integer n." },
      { q: "Prove that the sum of three consecutive integers is always a multiple of 3.", steps: [
        "Represent three consecutive integers algebraically: n, n+1, n+2.",
        "Add them: sum = n + (n+1) + (n+2).",
        "Collect like terms: three n's give 3n, and 1+2 gives 3, so the sum is 3n+3.",
        "Factorise: 3n+3 = 3(n+1).",
        "3(n+1) is 3 times a whole number, so it is a multiple of 3 by definition, true for every integer n.",
      ], answer: "3(n+1), a multiple of 3 for every integer n." },
      { q: "Prove that the product of two consecutive even numbers is always divisible by 8.", steps: [
        "Represent two consecutive even numbers algebraically: let them be 2n and 2n + 2, where n is any integer.",
        "Write their product: 2n × (2n + 2). Factorise the second bracket: 2n + 2 = 2(n + 1), so the product becomes 2n × 2(n+1) = 4n(n+1).",
        "Notice that n and n+1 are consecutive integers, so exactly one of them is even, meaning n(n+1) is always even. Write n(n+1) = 2m for some integer m.",
        "Substitute: 4n(n+1) = 4 × 2m = 8m.",
        "8m is 8 times a whole number, so the product of two consecutive even numbers is always divisible by 8, for every integer n.",
      ], answer: "4n(n+1) = 8m, always divisible by 8." },
    ],
      tryit: { q: "Show that any even number added to any odd number gives an odd number.", answer: "Odd. Represent the even number as 2n and the odd number as 2m+1, using a DIFFERENT letter m since the two numbers need not be related. The sum is 2n+(2m+1) = 2(n+m)+1, which matches the form for an odd number, true for all integers n and m." } },
    { h: "2. Why one example is never a proof", body: [
      "The earlier claim, that the sum of two consecutive integers is always odd, was checked at n=3 (giving 7) and n=100 (giving 201), and both came out odd. But does that prove it for n=4, or n=57, or n=-12? Not yet, each new number would need its own fresh check, and since there are infinitely many integers, no finite list of checks could ever cover them all.",
      "Compare that with the algebraic version from Section 1. The single line 'n+(n+1) = 2n+1' already CONTAINS n=3 and n=100 as special cases: substitute n=3 and it reads 2(3)+1=7, substitute n=100 and it reads 2(100)+1=201. The same algebraic step produces both instantly, along with every other integer, because n was never pinned to a particular value while the working was carried out.",
      "That's the real difference between verifying and proving. Verifying checks specific cases and can only ever build confidence. Proving gives an argument that must hold before you even know which number someone is going to pick, that's the only way to cover an infinite set of cases with a finite amount of writing.",
      "Be careful the general argument really does cover every case honestly. n² is even for n=2 (4) and n=4 (16), but n² is NOT even for n=3 (9), so a pattern that looks solid on a couple of examples can still fail elsewhere. Algebra only protects you from this if the working is genuinely general, substituting a few sample values into your final algebraic form is a good habit for catching a proof that secretly only works part of the time.",
    ] },
    { h: "3. A full worked proof", body: [
      "Check a bracket expansion concretely before trusting it in a bigger proof.\nTake (n+1)² at n=2: directly,\n(2+1)² =\n3² =\n9.\nUsing the expansion n²+2n+1 at n=2: 4+4+1 = 9. Both routes agree, confirming the expansion is safe to use algebraically.",
      "(Steps (2) and (3) below lean directly on skills from Algebraic Manipulation - expanding brackets, collecting like terms, and factorising. That's the lesson to revisit first if any of those feel shaky.) The standard proof recipe has four steps: (1) represent the number type(s) involved algebraically, (2) expand any brackets, (3) simplify by collecting like terms and factorising where possible, (4) explicitly say WHY the final form proves the claim.",
      "Step (4) is the one people skip, and it's the step that actually finishes the proof. Reaching an expression like 8n+8 doesn't prove anything on its own until you point out that 8n+8 = 8(n+1), which is 8 times a whole number, and therefore a multiple of 8 by definition.",
      "Take particular care with signs when subtracting one whole expanded bracket from another, as in the worked example below. Expand each bracket completely and separately FIRST, then subtract term by term, rather than trying to subtract before expanding, that's where sign errors creep in.",
    ], examples: [
      { q: "Prove that the square of any odd number is odd.", steps: [
        "Represent any odd number algebraically: 2n+1.",
        "Square it: (2n+1)² = (2n+1)(2n+1).",
        "Expand using FOIL: 2n×2n + 2n×1 + 1×2n + 1×1 = 4n² + 2n + 2n + 1.",
        "Collect like terms: 4n² + 4n + 1.",
        "Factor 2 out of the terms that allow it: 4n² + 4n + 1 = 2(2n² + 2n) + 1.",
        "2(2n² + 2n) is 2 times a whole number, so the whole expression is 2×(something)+1, exactly the form for an odd number, true for every integer n.",
      ], answer: "2(2n²+2n)+1 is always odd, so the square of any odd number is odd." },
      { q: "Prove that the difference between the squares of two consecutive odd numbers is always a multiple of 8.", steps: [
        "Represent two consecutive odd numbers algebraically: 2n+1 and 2n+3 (each odd number is 2 more than the last).",
        "Write the difference of their squares: (2n+3)² - (2n+1)².",
        "Expand (2n+3)² using FOIL:\n(2n+3)(2n+3) =\n4n² + 6n + 6n + 9 =\n4n² + 12n + 9.",
        "Expand (2n+1)² using FOIL:\n(2n+1)(2n+1) =\n4n² + 2n + 2n + 1 =\n4n² + 4n + 1.",
        "Subtract the second expansion from the first, keeping the whole bracket together: (4n² + 12n + 9) - (4n² + 4n + 1).",
        "The 4n² terms cancel, leaving 12n + 9 - 4n - 1.",
        "Collect like terms: 8n + 8.",
        "Factorise: 8n + 8 = 8(n+1).",
        "8(n+1) is 8 times a whole number, so it is a multiple of 8 by definition, true for every integer n.",
      ], answer: "8(n+1) is always a multiple of 8, proving the claim for every pair of consecutive odd numbers." },
      { q: "Prove that n³ - n is always divisible by 6.", steps: [
        "Factorise: n³ - n = n(n² - 1) = n(n-1)(n+1), which can be rewritten as (n-1)n(n+1), the product of three consecutive integers.",
        "Divisibility by 2: if n is even, 2 divides n. If n is odd, both n-1 and n+1 are even, so 2 divides the product either way.",
        "Divisibility by 3: among any three consecutive integers, exactly one is a multiple of 3 (since remainders on division by 3 cycle through 0, 1, 2 and three consecutive integers cover all three).",
        "Since 2 and 3 both divide (n-1)n(n+1) and 2 and 3 are coprime, their product 6 also divides it.",
        "So n³ - n is always divisible by 6. Check: n=4 gives 64-4=60=6×10 ✓; n=-2 gives -8+2=-6=6×(-1). ✓",
      ], answer: "(n-1)n(n+1) is always divisible by 6." },
    ],
      tryit: { q: "Prove that the difference between the squares of two consecutive integers equals the sum of those two integers.", answer: "True for every integer n: with integers n and n+1,\n(n+1)² - n² =\n(n²+2n+1) - n² =\n2n+1,\nand n+(n+1) also equals 2n+1, so the two expressions are identical for every integer n." } },
  ],
};

INTERMEDIATE_LESSONS.functionsAndIteration = {
  title: "Functions & Iteration: machines that feed into themselves",
  minutes: 14,
  order: 12,
  prereq: ["algebraicManipulation", { module: "junior", key: "numberMachine" }],
  intro: "A function is a rule that takes an input and produces an output - the same 'number machine' idea from Junior (numbers go in, get processed by the rule, and come out changed), just written with algebraic notation instead of a picture of a machine. This lesson covers composite functions (chaining two functions together), inverse functions (undoing a function), and iteration (feeding a function's output back in as the next input, over and over) - used to home in on solutions that can't be found exactly.",
  sections: [
    { h: "1. Composite functions", body: [
      "Try it out on numbers before worrying about notation. Let f(x) = 2x+1 and g(x) = x-3. Work out g(5) first:\ng(5) =\n5-3 =\n2.\nNow feed that answer into f:\nf(2) =\n2(2)+1 =\n5.\nSo doing g then f on the number 5 gives 5.",
      "Now do the two functions in the OTHER order on the same starting number, to see whether order matters:\nf(5) =\n2(5)+1 =\n11.\nFeed that into g:\ng(11) =\n11-3 =\n8.\nDoing f then g on 5 gives 8, not 5. The two answers are different, so which function goes first genuinely changes the result - order matters.",
      "This is exactly what the notation fg(x) is built to tell you. Read it as a sentence: 'f of g of x'. The function written closest to x, here g, is the one that acts on x first; its output then becomes the input to the next function out, here f. So fg(x) means f(g(x)), and the calculation above (g first, giving 2, then f, giving 5) is precisely fg(5) = 5. The other order, f then g, is a completely different function called gf(x) = g(f(x)).",
      "The technique, then, is always to work from the inside out: whichever function is written nearest to x, do that one first, then apply the next function to whatever number comes out.",
      "The most common mistake is reading fg(x) left to right, like reading English, and doing f first. Always look at which letter is touching the bracket around x - that's the one that goes first.",
    ], examples: [
      { q: "f(x) = 2x+1, g(x) = x-3. Find fg(5).", steps: [
        "In fg(x), the function touching the bracket is g, so g acts on x first.",
        "Work out g(5):\ng(5) =\n5 - 3 =\n2.",
        "Feed that result into f:\nf(2) =\n2(2) + 1 =\n5.",
        "So fg(5) =\nf(g(5)) =\n5.",
      ], answer: "5" },
      { q: "Using the same f(x) = 2x+1 and g(x) = x-3, find gf(x) as a single expression in x, then check it against the gf(5) = 8 found earlier.", steps: [
        "In gf(x), the function touching the bracket is f, so f acts on x first.",
        "Write out f(x): f(x) = 2x + 1.",
        "Feed this whole expression into g in place of x: g(f(x)) = (2x+1) - 3.",
        "Simplify: 2x + 1 - 3 = 2x - 2. So gf(x) = 2x - 2.",
        "Check the formula against the number worked out earlier:\ngf(5) =\n2(5) - 2 =\n10 - 2 =\n8, matching the 8 found directly. The formula is confirmed correct.",
      ], answer: "gf(x) = 2x - 2" },
      { q: "f(x) = x² and g(x) = 2x + 1. Show that fg(x) ≠ gf(x) in general, and find all values of x for which fg(x) = gf(x).", steps: [
        "Find fg(x): g acts first, so fg(x) = f(g(x)) = f(2x+1) = (2x+1)² = 4x² + 4x + 1.",
        "Find gf(x): f acts first, so gf(x) = g(f(x)) = g(x²) = 2x² + 1.",
        "The expressions 4x²+4x+1 and 2x²+1 are different in general (since 4x² ≠ 2x² for most x), confirming fg(x) ≠ gf(x) in general.",
        "Set fg(x) = gf(x) and solve: 4x²+4x+1 = 2x²+1, which gives 2x²+4x = 0, then 2x(x+2) = 0, so x = 0 or x = -2.",
        "Check both values: fg(0) = 1 and gf(0) = 1 ✓; fg(-2) = (-3)² = 9 and gf(-2) = 2(4)+1 = 9. ✓",
      ], answer: "fg(x) = gf(x) when x = 0 or x = -2" },
    ],
      tryit: { q: "f(x) = x+4, g(x) = 3x. Find fg(2).", answer: "10. In fg(x), g acts first:\ng(2) =\n3(2) =\n6.\nThen f(6) =\n6+4 =\n10." } },
    { h: "2. Inverse functions", body: [
      "Take f(x) = 3x-4. Work out f(3):\nf(3) =\n3(3)-4 =\n5.\nAn inverse function's whole job is to undo this - to take the 5 back to the 3 it came from. Whatever process does that job is called f⁻¹, read as 'f inverse'. That little -1 is just a label meaning 'the inverse of f' - it is NOT a power, and f⁻¹(x) does NOT mean 1/f(x), even though it's written similarly to power notation. Whatever process f⁻¹ turns out to be, it must satisfy f⁻¹(5) = 3.",
      "Here's the method for finding that process algebraically. Write the function as y = 3x-4, thinking of x as the input and y as the output. An inverse just swaps which one you know and which one you're solving for - so swap the letters: x = 3y-4. This new equation describes exactly the same input-output pairs, but now reversed: you're told the old output (renamed x) and asked to recover the old input (renamed y).",
      "Now rearrange this swapped equation to make y the subject again, using ordinary equation-solving steps. Add 4 to both sides:\nx+4 =\n3y.\nThen divide both sides by 3:\ny =\n(x+4)/3.\nThat gives f⁻¹(x) = (x+4)/3.",
      "Check it does what an inverse should:\nf⁻¹(5) =\n(5+4)/3 =\n9/3 =\n3\n- exactly the input that produced 5 in the first place. That check (feeding f's output back into f⁻¹ and getting the original input) is always worth doing once you've found an inverse.",
      "One thing to watch for: the swap-and-rearrange method needs the original equation to be fully isolated as y = ... before you swap, and you must finish by isolating y again afterwards - stopping halfway through the rearrangement is the most common way marks are lost.",
    ], examples: [
      { q: "Find the inverse of f(x) = 3x - 4, then check it against f(3) = 5.", steps: [
        "Write the function as y = 3x - 4.",
        "Swap x and y: x = 3y - 4.",
        "Add 4 to both sides: x + 4 = 3y.",
        "Divide both sides by 3: y = (x+4)/3.",
        "So f⁻¹(x) = (x+4)/3.",
        "Check:\nf(3) =\n3(3)-4 =\n5,\nand f⁻¹(5) =\n(5+4)/3 =\n9/3 =\n3,\nrecovering the original input. Confirmed.",
      ], answer: "f⁻¹(x) = (x+4)/3" },
      { q: "Find the inverse of f(x) = (2x+5)/3, and check it against f(2).", steps: [
        "Write the function as y = (2x+5)/3.",
        "Swap x and y: x = (2y+5)/3.",
        "Multiply both sides by 3 to clear the fraction: 3x = 2y+5.",
        "Subtract 5 from both sides: 3x-5 = 2y.",
        "Divide both sides by 2: y = (3x-5)/2. So f⁻¹(x) = (3x-5)/2.",
        "Check:\nf(2) =\n(2(2)+5)/3 =\n9/3 =\n3,\nand f⁻¹(3) =\n(3(3)-5)/2 =\n4/2 =\n2,\nrecovering the original input 2. Confirmed.",
      ], answer: "f⁻¹(x) = (3x-5)/2" },
      { q: "Find the inverse of f(x) = (3x - 1)/(x + 2), stating any restriction on the domain of f⁻¹.", steps: [
        "Write the function as y = (3x-1)/(x+2), then swap x and y to set up the inverse: x = (3y-1)/(y+2).",
        "Multiply both sides by (y+2) to clear the fraction: x(y+2) = 3y-1. Expand: xy+2x = 3y-1.",
        "Collect all y terms on the left: xy-3y = -1-2x. Factorise: y(x-3) = -(1+2x).",
        "Divide by (x-3): y = -(1+2x)/(x-3), which is written as f⁻¹(x) = (2x+1)/(3-x). The restriction is x ≠ 3.",
        "Check with x=1: f(1) = (3-1)/(1+2) = 2/3, and f⁻¹(2/3) = (2(2/3)+1)/(3-2/3) = (7/3)/(7/3) = 1. ✓",
      ], answer: "f⁻¹(x) = (2x + 1)/(3 - x), x ≠ 3" },
    ],
      tryit: { q: "Find the inverse of f(x) = (x-2)/5.", answer: "f⁻¹(x) = 5x+2. Swap:\nx =\n(y-2)/5, multiply both sides by 5:\n5x =\ny-2, add 2:\ny =\n5x+2.\nCheck:\nf(7) =\n(7-2)/5 =\n1,\nand f⁻¹(1) =\n5(1)+2 =\n7,\nmatching." } },
    { h: "3. Iteration to approximate a solution", body: [
      "Some equations, like x² = 5, don't have a nice whole-number or fraction answer - the solution is an infinite, non-repeating decimal. Iteration is a way of getting as close as you like to that decimal, by repeating a simple calculation over and over, each time feeding the previous answer back in to generate a better one.",
      "To keep track of which attempt is which, every approximation gets a subscript number: x_0 is the very first guess, x_1 is the result after doing the calculation once, x_2 is the result after doing it twice, and so on. In general, x_n means 'the approximation after n repeats', and x_(n+1) simply means 'the next one after that'. So a rule written as x_(n+1) = (something involving x_n) is just an instruction: take whichever approximation you currently have, do the calculation, and the answer is the next one in the list.",
      "Rearranging x² = 5 gives x = 5/x, and averaging x with 5/x turns out, when applied repeatedly, to home in on the actual answer. Written with the subscript notation just introduced, that rule is:\nx_(n+1) =\n(x_n + 5/x_n)/2\n- meaning 'to get the next approximation, average the current one with 5 divided by the current one'.",
      "Check what happens if you could feed in the exact answer, √5 ≈ 2.2361, itself:\n(2.2361 + 5/2.2361)/2 =\n(2.2361 + 2.2361)/2 =\n2.2361.\nNothing changes - the true solution is a 'fixed point' of this process, meaning the formula leaves it unchanged. Writing the rearranged equation as x = g(x) (here g(x) = 5/x, g just being a name for whatever expression ends up on the right after rearranging), a fixed point is exactly a value of x for which x = g(x) is already true.",
      "Starting from a number that ISN'T the exact answer, each application of the formula happens to move the result closer to that fixed point rather than further away, for this particular rearrangement. Start at x_0 = 2 (a sensible guess, since 2²=4 and 3²=9, so √5 must lie between 2 and 3):\nx_1 =\n(2+5/2)/2 =\n2.25,\nalready much closer to the true value 2.2361 than the starting guess of 2 was.",
      "The technique in general: rearrange the original equation into the form x = g(x), pick a sensible starting value x_0 (often given, or found by noticing which two whole numbers the answer must lie between), then repeatedly substitute each output back in as the next input, keeping full decimal accuracy throughout.",
      "Two pitfalls. First, not every rearrangement of the same equation converges - some send the values further and further away instead, so always check your first couple of iterations are actually getting closer together, not further apart. Second, rounding too early and carrying the rounded value forward compounds the error at every step - keep several extra decimal places during the working, and only round the final answer.",
    ], examples: [
      { q: "Use x_(n+1) = (x_n + 5/x_n)/2 with x_0=2 to find x_1 and x_2 (this iteration converges toward √5).", steps: [
        "Substitute x_0 = 2 into the formula to find x_1: x_1 = (2 + 5/2)/2.",
        "Work out 5/2 = 2.5.",
        "Add: 2 + 2.5 = 4.5.",
        "Divide by 2: 4.5/2 = 2.25. So x_1 = 2.25.",
        "Substitute x_1 = 2.25 into the formula to find x_2: x_2 = (2.25 + 5/2.25)/2.",
        "Work out 5/2.25 = 2.2222 (to 4 dp).",
        "Add: 2.25 + 2.2222 = 4.4722.",
        "Divide by 2: 4.4722/2 = 2.2361 (to 4 dp). So x_2 = 2.2361.",
        "Compare to √5 = 2.2361 (to 4 dp) - already matching after just two steps.",
      ], answer: "x_1 = 2.25, x_2 ≈ 2.2361 (√5 to 4 dp)" },
      { q: "Use x_(n+1) = (x_n + 10/x_n)/2 with x_0=3 to find x_1, x_2 and x_3 (converging toward √10, a bigger and messier target).", steps: [
        "Substitute x_0 = 3 into the formula: x_1 = (3 + 10/3)/2.",
        "Work out 10/3 = 3.3333 (to 4 dp).",
        "Add: 3 + 3.3333 = 6.3333.",
        "Divide by 2: 6.3333/2 = 3.1667 (to 4 dp). So x_1 = 3.1667.",
        "Substitute x_1 = 3.1667 into the formula: x_2 = (3.1667 + 10/3.1667)/2.",
        "Work out 10/3.1667 = 3.1579 (to 4 dp).",
        "Add and halve:\n(3.1667 + 3.1579)/2 =\n6.3246/2 =\n3.1623 (to 4 dp). So x_2 = 3.1623.",
        "Substitute x_2 = 3.1623 into the formula:\nx_3 =\n(3.1623 + 10/3.1623)/2 =\n(3.1623 + 3.1623)/2 =\n3.1623 (to 4 dp).",
        "x_2 and x_3 agree to 4 decimal places, so the iteration has settled down: √10 = 3.1623 (to 4 dp).",
      ], answer: "x_1 = 3.1667, x_2 ≈ 3.1623, x_3 ≈ 3.1623 (√10 to 4 dp)" },
      { q: "Use x_(n+1) = (2x_n + 6/x_n²)/3 with x_0 = 2 to find x_1 and x_2 (this iteration converges toward ∛6).", steps: [
        "This formula is Newton's method for finding ∛6. The starting guess x_0 = 2 is sensible since 1³ = 1 < 6 < 8 = 2³.",
        "Substitute x_0 = 2 to find x_1: x_1 = (2(2) + 6/2²)/3 = (4 + 6/4)/3 = (4 + 1.5)/3 = 5.5/3 ≈ 1.8333 (to 4 dp).",
        "Substitute x_1 = 1.8333 to find x_2: compute 6/(1.8333)² = 6/3.3610 ≈ 1.7851 (to 4 dp).",
        "Then x_2 = (2(1.8333) + 1.7851)/3 = (3.6666 + 1.7851)/3 = 5.4517/3 ≈ 1.8172 (to 4 dp).",
        "Compare to ∛6 ≈ 1.8171 (to 4 dp): the iteration has already converged after just two steps.",
      ], answer: "x_1 ≈ 1.8333, x_2 ≈ 1.8172 (converging to ∛6 ≈ 1.8171)" },
    ],
      tryit: { q: "Use x_(n+1) = (x_n + 7/x_n)/2 with x_0=3 to find x_1 (this iteration converges toward √7).", answer: "x_1 = 2.6667.\nx_1 =\n(3 + 7/3)/2 =\n(3+2.3333)/2 =\n5.3333/2 =\n2.6667,\nalready fairly close to √7 ≈ 2.6458 after just one step." } },
  ],
};

INTERMEDIATE_LESSONS.sequencesAndSeries = {
  title: "Sequences: finding the rule and the nth term",
  minutes: 13,
  order: 8,
  prereq: [{ module: "junior", key: "customCount" }, { module: "junior", key: "bouncing" }],
  intro: "A sequence is a list of numbers following a rule. This lesson covers spotting arithmetic sequences (constant difference), geometric sequences (constant ratio), and quadratic sequences (where the SECOND difference is constant), plus how to write the nth term formula for each.",
  sections: [
    { h: "1. Arithmetic sequences", body: [
      "Look at 5, 8, 11, 14. Subtract each term from the next: 8-5=3, 11-8=3, 14-11=3. The difference is the same (3) every time - that constant gap is what makes this an arithmetic sequence.",
      "To describe this precisely, give three things names. Call the constant gap between consecutive terms d, for 'difference' (here d=3). Call the very first term of the sequence a (here a=5). And use n for the POSITION of a term in the list - n=1 for the first term, n=2 for the second, n=3 for the third, and so on - so 'the nth term' means 'whichever term sits in position n': one formula written in terms of n that produces every term at once, instead of listing them one by one.",
      "Think about what building the sequence term by term actually involves: term 2 is term 1 plus one lot of d; term 3 is term 1 plus two lots of d; term 4 is term 1 plus three lots of d. By the time you reach term n, you've added d exactly (n-1) times - one fewer than the term number, because the first term doesn't need any adding at all. That's the whole reason the formula for the nth term is a + (n-1)d and not a + nd.",
      "Check it on the example: a=5, d=3, so the formula gives:\nterm 1 = 5+(0)(3) = 5,\nterm 2 = 5+(1)(3) = 8,\nterm 3 = 5+(2)(3) = 11,\nterm 4 = 5+(3)(3) = 14\n- matching the original list exactly.",
      "To use it: find d by subtracting any term from the one after it, find a as the first term, then substitute both into a+(n-1)d and expand the brackets to tidy it into the form (something)n + (something).",
      "The most common slip is writing nd instead of (n-1)d - always double check by testing the formula against n=1, which must give back the first term a.",
    ], examples: [
      { q: "Find the nth term of 5, 8, 11, 14, ...", steps: [
        "Find the common difference by subtracting consecutive terms: 8-5=3, 11-8=3, 14-11=3. d=3.",
        "Identify the first term: a=5.",
        "Substitute into the formula:\nnth term =\na+(n-1)d =\n5+(n-1)(3).",
        "Expand the bracket: 5+3n-3.",
        "Simplify: 3n+2.",
        "Check against n=1: 3(1)+2=5, matching the first term. Confirmed.",
      ], answer: "3n + 2" },
      { q: "Find the nth term of 20, 15, 10, 5, ..., then use it to find the 15th term.", steps: [
        "Find the common difference: 15-20=-5, 10-15=-5, 5-10=-5. d=-5 (the sequence is decreasing).",
        "Identify the first term: a=20.",
        "Substitute into the formula: nth term = 20+(n-1)(-5).",
        "Expand the bracket: 20-5n+5.",
        "Simplify: 25-5n.",
        "Check against n=1: 25-5(1)=20, matching. Confirmed the formula.",
        "Find the 15th term by substituting n=15:\n25-5(15) =\n25-75 =\n-50.",
      ], answer: "nth term = 25-5n; 15th term = -50" },
      { q: "An arithmetic sequence has 3rd term 11 and 8th term 31. Find the nth term formula and the first term that exceeds 100.", steps: [
        "Find the common difference: d = (8th term − 3rd term) ÷ (8 − 3) = (31 − 11) ÷ 5 = 20 ÷ 5 = 4.",
        "Find the first term: a = 3rd term − 2d = 11 − 2(4) = 11 − 8 = 3.",
        "Write the nth term formula: a + (n−1)d = 3 + (n−1)(4) = 4n − 1.",
        "Set 4n − 1 > 100: rearrange to 4n > 101, giving n > 25.25. The first whole number is n = 26.",
        "26th term = 4(26) − 1 = 104 − 1 = 103.",
      ], answer: "nth term = 4n − 1; first term exceeding 100 is 103 (at n = 26)" },
    ],
      tryit: { q: "Find the nth term of 9, 13, 17, 21, ...", answer: "4n+5. Common difference d=4, first term a=9, so:\nnth term =\n9+(n-1)(4) =\n9+4n-4 =\n4n+5.\nCheck: n=1 gives 4+5=9, matching." } },
    { h: "2. Quadratic sequences", body: [
      "Look at 3, 8, 15, 24, 35. The first differences are 8-3=5, 15-8=7, 24-15=9, 35-24=11 - these aren't constant, so this isn't an arithmetic sequence. But look at the differences OF those differences: 7-5=2, 9-7=2, 11-9=2. These second differences ARE constant. Whenever that happens, the sequence is quadratic - its nth term includes an n² term.",
      "Where does the size of that n² term come from? Check the second differences of some pure (number)×n² sequences - call the number multiplying n² in each case k, so the three tried here are k=1, k=2 and k=3. n² itself (k=1) gives 1,4,9,16,25,...; first differences 3,5,7,9; second differences 2,2,2 - always 2. Now try 2n² (k=2): 2,8,18,32,50,...; first differences 6,10,14,18; second differences 4,4,4 - always 4. And 3n² (k=3): 3,12,27,48,75,...; first differences 9,15,21,27; second differences 6,6,6 - always 6. The pattern is exact: kn² always has constant second difference 2k. So if a sequence's constant second difference is known, the coefficient of n² is that number halved.",
      "Apply that here: the constant second difference was 2, so the n² coefficient is 2÷2=1, meaning the nth term starts with n² and then something extra (call it the 'leftover').",
      "To find the leftover, subtract n² from each term of the original sequence and see what's left: 3-1=2, 8-4=4, 15-9=6, 24-16=8. The leftover 2,4,6,8 is itself a plain arithmetic sequence (difference 2, first term 2), with nth term 2n by the method from Section 1. Add the n² part and the leftover part together to get the full nth term: n²+2n.",
      "Always finish by checking the formula against a couple of the original terms - here n=3 gives 9+6=15, matching. The main pitfall is subtracting n² itself when the coefficient isn't 1 - subtract the FULL term (coefficient × n²), not just n².",
    ], examples: [
      { q: "Find the nth term of 3, 8, 15, 24, 35, ...", steps: [
        "Find the first differences: 8-3=5, 15-8=7, 24-15=9, 35-24=11. So first differences are 5,7,9,11 - not constant, so this isn't arithmetic.",
        "Find the second differences: 7-5=2, 9-7=2, 11-9=2. These ARE constant, so the sequence is quadratic - the nth term will include an n² term.",
        "The coefficient of n² is always half the constant second difference: 2÷2 = 1. So the nth term has the form n² + (something linear).",
        "Subtract n² from each term to find the leftover:\nterm1: 3-1² = 3-1 = 2.\nterm2: 8-2² = 8-4 = 4.\nterm3: 15-3² = 15-9 = 6.\nterm4: 24-4² = 24-16 = 8.",
        "The leftover sequence 2,4,6,8 is arithmetic with common difference 2 and first term 2, so its nth term is 2n.",
        "Add the leftover back to the n² part: nth term = n² + 2n.",
        "Check against the original sequence: n=1: 1+2=3, correct. n=2: 4+4=8, correct. n=3: 9+6=15, correct. n=4: 16+8=24, correct.",
      ], answer: "n² + 2n" },
      { q: "Find the nth term of 5, 16, 33, 56, 85, ... (bigger numbers, and this time the n² coefficient isn't 1).", steps: [
        "Find the first differences: 16-5=11, 33-16=17, 56-33=23, 85-56=29 - not constant.",
        "Find the second differences: 17-11=6, 23-17=6, 29-23=6 - constant, so the sequence is quadratic.",
        "The coefficient of n² is half the constant second difference: 6÷2=3. So the nth term has the form 3n² + (something linear).",
        "Subtract 3n² (not just n²) from each term:\nterm1: 5-3(1²) = 5-3 = 2.\nterm2: 16-3(2²) = 16-12 = 4.\nterm3: 33-3(3²) = 33-27 = 6.\nterm4: 56-3(4²) = 56-48 = 8.",
        "The leftover 2,4,6,8 is arithmetic with common difference 2 and first term 2, so its nth term is 2n.",
        "Add the leftover to the 3n² part: nth term = 3n² + 2n.",
        "Check against the 5th term: n=5 gives:\n3(25)+2(5) =\n75+10 =\n85,\nmatching the original sequence. Confirmed.",
      ], answer: "3n² + 2n" },
      { q: "The nth term of a sequence is n² − 2n + 3. Find the first value of n for which the term exceeds 100.", steps: [
        "The formula is n² − 2n + 3. Try n = 10: 100 − 20 + 3 = 83, which does not exceed 100.",
        "Try n = 11: 121 − 22 + 3 = 102, which exceeds 100.",
        "Check n = 10 is genuinely the last miss: 83 ≤ 100 ✓. Check n = 11 works: 102 > 100 ✓.",
      ], answer: "n = 11; the 11th term is 102" },
    ],
      tryit: { q: "Find the nth term of 4, 10, 18, 28, 40, ...", answer: "n²+3n. First differences 6,8,10,12 aren't constant, but second differences are all 2, so the n² coefficient is 2÷2=1; subtracting n² from each term leaves 3,6,9,12, which is 3n, so nth term = n²+3n." } },
    { h: "3. Geometric sequences", body: [
      "Look at 3, 6, 12, 24. Divide each term by the one before it: 6/3=2, 12/6=2, 24/12=2. The ratio is the same (2) every time - that constant multiplier is what makes this a geometric sequence.",
      "As in Section 1, give the things involved names. Call this constant multiplier r, for 'ratio' (here r=2), and reuse a for the first term (here a=3) and n for the position of a term in the list, exactly as before.",
      "Think about building the sequence term by term: term 2 is term 1 multiplied by r once; term 3 is term 1 multiplied by r twice (once to get to term 2, again to get to term 3); term 4 is term 1 multiplied by r three times. By term n, r has been multiplied in exactly (n-1) times - one fewer than the term number, for the same reason as the arithmetic case. That's why the formula is a×r^(n-1).",
      "Check it:\na=3, r=2, so:\nterm1 = 3×2⁰ = 3×1 = 3,\nterm2 = 3×2¹ = 6,\nterm3 = 3×2² = 12,\nterm4 = 3×2³ = 24\n- matching the list.",
      "To use it: find r by dividing any term by the one before it, find a as the first term, then substitute into a×r^(n-1), being careful to write the power as (n-1) and not n.",
      "Watch the brackets carefully when r is negative or a fraction - r^(n-1) needs the whole ratio raised to that power, not just part of it, and an even power always turns a negative ratio positive.",
    ], examples: [
      { q: "Find the 6th term of the geometric sequence 3, 6, 12, 24, ...", steps: [
        "Find the ratio by dividing a term by the one before it: 6÷3=2, 12÷6=2 - confirming r=2.",
        "Identify the first term: a=3.",
        "Substitute into the formula for the 6th term:\nterm6 =\na×r^(6-1) =\n3×2⁵.",
        "Work out 2⁵ = 32.",
        "Multiply: 3×32=96.",
      ], answer: "96" },
      { q: "Find the 7th term of the geometric sequence 8, -4, 2, -1, ... (a negative, fractional ratio this time).", steps: [
        "Find the ratio: -4÷8=-1/2, 2÷(-4)=-1/2 - confirming r=-1/2.",
        "Identify the first term: a=8.",
        "Substitute into the formula for the 7th term:\nterm7 =\na×r^(7-1) =\n8×(-1/2)⁶.",
        "Work out (-1/2)⁶: an even power makes a negative number positive, so this equals (1/2)⁶ = 1/64.",
        "Multiply:\n8×(1/64) =\n8/64 =\n1/8.",
      ], answer: "1/8" },
      { q: "A geometric sequence has first term 3 and common ratio 2. Find the smallest value of n for which the nth term exceeds 1000.", steps: [
        "The nth term formula is a × r^(n−1) = 3 × 2^(n−1).",
        "Set 3 × 2^(n−1) > 1000: divide both sides by 3 to get 2^(n−1) > 333.33.",
        "Test powers of 2: 2^8 = 256 (not big enough); 2^9 = 512 > 333.33. So n − 1 = 9, giving n = 10.",
        "Check: 10th term = 3 × 2^9 = 3 × 512 = 1536 > 1000 ✓; 9th term = 3 × 2^8 = 3 × 256 = 768 ≤ 1000 ✓.",
      ], answer: "n = 10; the 10th term is 1536" },
    ],
      tryit: { q: "Find the 5th term of the geometric sequence 2, 6, 18, 54, ...", answer: "162. Ratio:\nr =\n6÷2 =\n3,\nfirst term a=2, so:\n5th term =\na×r⁴ =\n2×3⁴ =\n2×81 =\n162." } },
  ],
};

INTERMEDIATE_LESSONS.graphsAndRatesOfChange = {
  title: "Graphs & Rates of Change",
  minutes: 13,
  order: 9,
  prereq: [{ module: "junior", key: "coordGeom" }, "simultaneousEquations"],
  intro: "A graph's gradient tells you how fast one quantity changes compared to another - speed on a distance-time graph, acceleration on a velocity-time graph. This lesson covers finding gradients, reading key features off a graph, and using the area under a graph.",
  sections: [
    { h: "1. Gradient between two points", body: [
      "Check the formula against a line you already know: y=2x passes through (1,2) and (3,6) (since 2×1=2 and 2×3=6). Using the gradient formula on these two points:\n(6-2)/(3-1) =\n4/2 =\n2\n- exactly matching the 2 in y=2x. The formula recovers the gradient you already knew was there.",
      "Here's why that always works, for ANY straight line, not just y=2x. Every straight line's equation can be written in the general form y=mx+c, where m and c stand for two fixed numbers particular to that one line (for y=2x, matching against y=mx+c gives m=2 and c=0). Exactly what m and c represent geometrically is unpacked fully in Section 2 - for now, all that matters is that they're just two fixed numbers that don't change as x and y vary along the same line. Any two points on such a line can be written (x₁, mx₁+c) and (x₂, mx₂+c) - the small 1 and 2 just label 'point 1' and 'point 2', and each point's y-value comes from putting its own x-value into y=mx+c. Subtracting the y-values:\ny₂-y₁ =\n(mx₂+c)-(mx₁+c) =\nm(x₂-x₁)\n- the c's cancel completely. Dividing both sides by (x₂-x₁) gives (y₂-y₁)/(x₂-x₁) = m. So whichever two points you pick on a straight line, this calculation always returns the same value m - the gradient is a genuine property of the whole line, not of the particular points chosen.",
      "To use it: label one point (x₁,y₁) and the other (x₂,y₂), subtract the y's, subtract the x's in the SAME order, then divide.",
      "The most common mistake is mixing up the order - subtracting y₂-y₁ on top but x₁-x₂ on the bottom. That flips the sign of the answer. Whichever point you call 'point 1', use it as the first term in both subtractions.",
    ], examples: [
      { q: "Find the gradient of the line through (1,3) and (4,15).", steps: [
        "Label the points: (x₁,y₁)=(1,3), (x₂,y₂)=(4,15).",
        "Find the change in y: 15-3=12.",
        "Find the change in x, using the same order as the y-subtraction: 4-1=3.",
        "Divide:\ngradient =\n12/3 =\n4.",
      ], answer: "4" },
      { q: "Find the gradient of the line through (-2,7) and (4,-5).", steps: [
        "Label the points: (x₁,y₁)=(-2,7), (x₂,y₂)=(4,-5).",
        "Find the change in y: -5-7=-12.",
        "Find the change in x, same order:\n4-(-2) =\n4+2 =\n6.",
        "Divide:\ngradient =\n-12/6 =\n-2.",
      ], answer: "-2" },
      { q: "The line through (k, 3) and (2, k) has gradient 4. Find k.", steps: [
        "Apply the gradient formula: (k − 3) ÷ (2 − k) = 4.",
        "Multiply both sides by (2 − k): k − 3 = 4(2 − k) = 8 − 4k.",
        "Collect k terms on the left: k + 4k = 8 + 3, giving 5k = 11.",
        "Divide: k = 11/5.",
        "Check: gradient = (11/5 − 3) ÷ (2 − 11/5) = (−4/5) ÷ (−1/5) = 4. ✓",
      ], answer: "k = 11/5" },
    ],
      tryit: { q: "Find the gradient of the line through (2,-1) and (5,8).", answer: "3.\nChange in y =\n8-(-1) =\n9.\nChange in x (same order) =\n5-2 =\n3.\nGradient =\n9/3 =\n3." } },
    { h: "2. Reading a line's equation", body: [
      "Take y=2x+1. Substitute x=0:\ny =\n2(0)+1 =\n1\n- matching the constant term, 1. Now substitute x=1:\ny =\n2(1)+1 =\n3.\nUsing the gradient formula from Section 1 between (0,1) and (1,3):\n(3-1)/(1-0) =\n2/1 =\n2\n- matching the coefficient of x, 2. Both numbers in the equation turn out to have a direct, checkable meaning.",
      "That's not a coincidence for this example - it's true of every line written in the y=mx+c form introduced in Section 1. Setting x=0 makes the mx term vanish entirely, leaving y=c, so c is always the y-value where the line crosses the y-axis (the y-intercept). And from the proof in Section 1, the coefficient m is always the gradient of the line, however it was found. Once an equation is written in this form, m and c can simply be read straight off, without plotting anything or picking two points.",
      "To use this: if the equation isn't already arranged as y=mx+c (for example, it might be written as 2y=4x+6, or 3x+y=5), rearrange it into that form first. Only once y is completely isolated on one side can the coefficient of x and the constant term be read off safely as m and c.",
      "In real contexts, m and c usually mean something concrete. m is the amount added for every extra unit of x (a rate: pounds per mile, pence per minute...), while c is whatever the quantity equals when x=0 - often a fixed starting charge or fee that applies before any usage at all.",
    ], examples: [
      { q: "For the line y = 4x - 7, state the gradient and y-intercept, then check them.", steps: [
        "Compare y=4x-7 to the general form y=mx+c: m=4, c=-7.",
        "Check c by substituting x=0:\ny =\n4(0)-7 =\n-7,\nmatching c=-7 - this is where the line crosses the y-axis.",
        "Check m by finding a second point, substituting x=1:\ny =\n4(1)-7 =\n-3.",
        "Use the gradient formula between (0,-7) and (1,-3):\n(-3-(-7))/(1-0) =\n4/1 =\n4,\nmatching m=4. Confirmed.",
      ], answer: "gradient = 4, y-intercept = -7" },
      { q: "A taxi firm charges C = 2.50 + 1.20d, where C is the cost in pounds and d is the distance in miles. What do the numbers 2.50 and 1.20 represent, and what does a 6-mile journey cost?", steps: [
        "Compare C=2.50+1.20d to y=mx+c, with C playing the role of y and d playing the role of x: m=1.20, c=2.50.",
        "c is the value when d=0, i.e. before any distance is travelled - so £2.50 is a fixed charge just for getting in the taxi.",
        "m is the extra cost added for each additional mile - so £1.20 is added to the fare for every mile driven.",
        "Find the cost of a 6-mile journey by substituting d=6: C=2.50+1.20(6).",
        "Work out 1.20×6=7.20.",
        "Add:\nC =\n2.50+7.20 =\n9.70.",
      ], answer: "£2.50 is the fixed charge, £1.20 is the cost per mile; a 6-mile journey costs £9.70" },
      { q: "Rearrange 3x − 2y + 8 = 0 into y = mx + c form. State the gradient and y-intercept, then find where the line crosses the x-axis.", steps: [
        "Rearrange to isolate y: add 2y to both sides to get 2y = 3x + 8.",
        "Divide through by 2: y = (3/2)x + 4.",
        "Read off m = 3/2 (the gradient) and c = 4 (the y-intercept).",
        "For the x-axis crossing, set y = 0: 0 = (3/2)x + 4, giving (3/2)x = −4, so x = −8/3.",
        "Check: substitute x = −8/3 into the rearranged equation:\ny = (3/2)(−8/3) + 4 = −4 + 4 = 0. ✓",
      ], answer: "gradient = 3/2, y-intercept = 4, x-axis crossing at x = −8/3" },
    ],
      tryit: { q: "A phone plan costs C = 15 + 0.05t, where t is minutes used. What do 15 and 0.05 represent, and what is the cost for 200 minutes?", answer: "£15 is the fixed monthly charge (the cost when t=0), £0.05 is the cost per minute; for 200 minutes:\nC =\n15+0.05×200 =\n15+10 =\n£25." } },
    { h: "3. Area under a velocity-time graph", body: [
      "Start with the simplest case: an object moving at a constant 10 m/s for 4 seconds. By the familiar formula:\ndistance =\nspeed × time =\n10×4 =\n40 metres.\nNow look at the graph of this journey: velocity is a flat horizontal line at height 10, from time 0 to time 4 - a rectangle. Its area is:\nheight×width =\n10×4 =\n40.\nThe two calculations, done completely differently, give exactly the same number.",
      "That match isn't a coincidence - it's built into the units. Area under this kind of graph is always height×width, and here height is measured in m/s while width is measured in s, so height×width is measured in (m/s)×s = m - metres, exactly the unit distance is measured in. Whatever shape the region under the graph happens to be, working out its area in the ordinary geometric sense produces a quantity in metres, which is distance travelled.",
      "This still works even when the velocity is changing, so the top edge of the region is sloped or curved rather than flat, because the graph can be thought of as made of enormously many very short, near-constant-velocity strips side by side. Each thin strip behaves like the flat case above (a very short constant speed for a very short time), and 'the area under the graph' is exactly the sum of all those strips added together - so it still equals total distance.",
      "In practice: identify what shape the region under the line makes (rectangle for constant velocity, triangle for velocity rising steadily from zero, trapezium for velocity rising steadily from a non-zero starting value, or several of these joined together), then use the matching area formula.",
      "Two things to watch: this rule is specific to velocity-time graphs (area under a distance-time graph doesn't represent anything physical), and if part of the graph dips below the time-axis (negative velocity, meaning travel in the opposite direction), that area represents distance in the opposite direction - read the question carefully to see whether it wants total distance or overall displacement.",
    ], examples: [
      { q: "A velocity-time graph shows speed rising steadily from 0 to 20 m/s over 8 seconds. What distance was covered?", steps: [
        "The velocity rises steadily from 0 to 20 m/s over 8 seconds, so the region under the graph is a triangle with base 8 and height 20.",
        "Area of a triangle = ½×base×height.",
        "Substitute: ½×8×20.",
        "Work out 8×20=160, then half of that is 80.",
      ], answer: "80 metres" },
      { q: "A velocity-time graph shows speed rising steadily from 5 m/s to 15 m/s over 6 seconds. What distance was covered?", steps: [
        "The velocity doesn't start at 0, so the region under the graph is a trapezium: two parallel sides of length 5 and 15 (the starting and ending velocities), with width 6 (the time).",
        "Area of a trapezium = ½×(sum of parallel sides)×width.",
        "Sum of the parallel sides: 5+15=20.",
        "Substitute: ½×20×6.",
        "Work out 20×6=120, then half of that is 60.",
      ], answer: "60 metres" },
      { q: "A velocity-time graph shows a particle moving at 8 m/s for 3 seconds, then decelerating uniformly to rest over a further 5 seconds. Find the total distance covered.", steps: [
        "Split the journey into two phases.",
        "Phase 1 (constant speed): the region under the graph is a rectangle with height 8 m/s and width 3 s. Area = 8 × 3 = 24 m.",
        "Phase 2 (uniform deceleration to rest): the velocity falls from 8 m/s to 0 m/s over 5 s, so the region is a triangle with height 8 and base 5. Area = ½ × 8 × 5 = 20 m.",
        "Total distance = 24 + 20 = 44 m.",
      ], answer: "44 metres" },
    ],
      tryit: { q: "A cyclist travels at a constant 12 m/s for 10 seconds. Using the area under the velocity-time graph, find the distance travelled.", answer: "120 metres. Constant velocity makes a rectangle, so:\narea =\nheight×width =\n12×10 =\n120,\nmatching distance=speed×time." } },
  ],
};

INTERMEDIATE_LESSONS.advancedProbability = {
  title: "Advanced Probability: AND, OR, and without replacement",
  minutes: 14,
  order: 15,
  prereq: ["combinatoricsAndCounting", { module: "primary", key: "fractionArithmetic" }],
  intro: "Beyond a single spin or roll, most real probability questions combine several events. This lesson covers the AND rule (multiply for independent events), drawing without replacement (where probabilities change after each draw), and conditional probability (given some information is already known).",
  sections: [
    { h: "1. Independent events: the AND rule", body: [
      "List every equally likely outcome of flipping a coin and rolling a die together: 2 coin results × 6 die results = 12 equally likely pairs in total. Exactly one of those pairs is (heads, 6). Write P(event) as shorthand for 'the probability that event happens' - a number between 0 (impossible) and 1 (certain), found here just by counting: (favourable outcomes) ÷ (total equally likely outcomes). So P(heads AND a 6) = 1/12 by direct counting.",
      "Compare that to multiplying the two separate probabilities: P(heads)=1/2, P(a 6)=1/6, and 1/2×1/6=1/12 - exactly matching the count. This isn't a coincidence: because the coin and die don't affect each other, EVERY one of the coin's 2 outcomes can be paired with EVERY one of the die's 6 outcomes, giving 2×6=12 equally likely combined outcomes in total, of which exactly 1×1=1 is the combination wanted. Dividing favourable by total, (1×1)/(2×6), is the same calculation as (1/2)×(1/6) rearranged - multiplying the separate probabilities together always gives the right answer, provided the events genuinely don't influence each other.",
      "This only works for independent events - ones where knowing the outcome of one tells you nothing about the other. To use the rule: confirm the events are independent, then simply multiply their individual probabilities.",
      "The danger is applying this same multiplying shortcut to events that DO affect each other (see the next section), where the probabilities themselves change once the first event has happened.",
    ], examples: [
      { q: "A fair coin is flipped and a fair die is rolled. What is P(heads AND a 6)?", steps: [
        "Check the events are independent: the coin landing on heads has no effect on what the die shows, and vice versa.",
        "Find P(heads) = 1/2.",
        "Find P(a 6) = 1/6.",
        "Multiply: 1/2×1/6=1/12.",
      ], answer: "1/12" },
      { q: "Two fair dice are rolled and a fair coin is flipped. Find P(the two dice sum to 7 AND the coin shows heads).", steps: [
        "Check independence: the coin doesn't affect the dice, and the dice don't affect the coin.",
        "Find P(the two dice sum to 7): the pairs that work are (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) - 6 pairs out of 36 equally likely pairs total, so:\nP =\n6/36 =\n1/6.",
        "Find P(coin shows heads) = 1/2.",
        "Multiply: 1/6×1/2=1/12.",
      ], answer: "1/12" },
      { q: "Three fair dice are rolled. Find P(all three show the same number).", steps: [
        "The first die can show any of 6 values; its outcome does not restrict the others.",
        "For all three to match, the second die must equal the first: P = 1/6.",
        "The third die must also equal the first: P = 1/6.",
        "Since the three dice are independent, multiply:\n1/6 × 1/6 =\n1/36.",
        "Check by counting: there are 6 same-value outcomes (all 1s, all 2s, ..., all 6s) out of 6³ = 216 equally likely outcomes:\n6 ÷ 216 =\n1/36. ✓",
      ], answer: "1/36" },
    ],
      tryit: { q: "Two independent spinners are used: spinner A has 4 equal sections numbered 1-4, spinner B has 3 equal sections coloured red, blue, green. Find P(spinner A shows 3 AND spinner B shows green).", answer: "1/12. Independent events, so multiply the separate probabilities: P(3)=1/4, P(green)=1/3, giving 1/4×1/3=1/12." } },
    { h: "2. Without replacement", body: [
      "Take a tiny bag with 2 red counters (call them R1 and R2 to tell them apart) and 1 blue counter (B), and draw 2 counters out one after another without putting the first one back. Listing every equally likely ordered result: (R1,R2), (R1,B), (R2,R1), (R2,B), (B,R1), (B,R2) - 6 outcomes altogether (3 choices for the first draw, then 2 remaining choices for the second). Exactly 2 of these 6 outcomes are 'both red': (R1,R2) and (R2,R1). So:\nP(both red) =\n2/6 =\n1/3,\nfound by direct counting.",
      "Now compare that to working it out via probabilities: P(1st red) = 2/3 (2 reds out of 3 counters). But for the second draw, one red counter and one counter overall have already gone, leaving only 2 counters, 1 of them red. This second probability needs a new piece of language: write P(B given A) to mean the probability that B happens, worked out using only the outcomes where A has already happened - it's called a conditional probability, and 'given' is the word that introduces the condition. Here, P(2nd red, given the first was red) means exactly: 'assuming the first counter really was red, what fraction of what's left is red?' - and that fraction is 1/2 (1 red counter left, out of 2 counters left). Multiplying:\n2/3×1/2 =\n2/6 =\n1/3\n- matching the count exactly.",
      "That match reveals what's different here from Section 1: once a counter is removed and not replaced, both the number left in total AND the number left of the type just drawn are reduced by one for the next draw. The second probability genuinely depends on what happened first - the events are no longer independent - so the numbers used for the second draw must be adjusted before multiplying.",
      "In general: work out the first draw's probability as normal. For the second draw, reduce the total (the denominator) by 1, and reduce the count of whatever was actually drawn first (the relevant numerator) by 1 as well, before writing the second fraction. Then multiply, exactly as before.",
      "One more rule is worth naming here, since the second example below needs it: when a result can happen via two or more different routes that can't both occur at once - like 'red-then-blue' OR 'blue-then-red' - work out the probability of each route separately and then ADD the routes together. This addition is safe exactly because the routes are non-overlapping (getting red-then-blue on a given pair of draws rules out getting blue-then-red on that same pair), so nothing is being double-counted. This is the OR rule, and it's the opposite move to the AND rule from Section 1, which multiplies rather than adds.",
      "The single most common mistake is forgetting to reduce the total on the second draw (using the original total instead of one fewer) - always ask 'how many counters are left in the bag altogether now?' before writing the second fraction.",
    ], examples: [
      { q: "A bag has 5 red and 3 blue counters. Two are drawn without replacement. Find P(both red).", steps: [
        "Find P(1st red): 5 red out of 8 counters total, so P=5/8.",
        "One red counter and one counter overall are now gone, leaving 7 counters, 4 of them red.",
        "Find P(2nd red, given the 1st was red): 4/7.",
        "Multiply: 5/8×4/7=20/56.",
        "Simplify: 20/56=5/14 (dividing top and bottom by their highest common factor, 4 - the same simplifying technique as in fraction arithmetic).",
      ], answer: "5/14" },
      { q: "The same bag (5 red, 3 blue, 8 total) has 2 counters drawn without replacement. Find P(one red and one blue, in either order).", steps: [
        "'One red and one blue' can happen in two different orders: red-then-blue, or blue-then-red - these are separate, non-overlapping cases, so (by the OR rule above) work each out and add.",
        "Red then blue: P(1st red)=5/8. One counter is now gone (a red one), leaving 7 counters, still all 3 blues. P(2nd blue given 1st red)=3/7. Multiply: 5/8×3/7=15/56.",
        "Blue then red: P(1st blue)=3/8. One counter is now gone (a blue one), leaving 7 counters, still all 5 reds. P(2nd red given 1st blue)=5/7. Multiply: 3/8×5/7=15/56.",
        "Add the two cases together, since either order satisfies the question: 15/56+15/56=30/56.",
        "Simplify: 30/56=15/28.",
      ], answer: "15/28" },
      { q: "A bag contains 6 red and 4 blue balls. Three are drawn without replacement. Find P(all three are red).", steps: [
        "P(1st red): 6 reds out of 10 balls total, so P = 6/10 = 3/5.",
        "One red ball removed, leaving 9 balls of which 5 are red. P(2nd red, given 1st red) = 5/9.",
        "Another red removed, leaving 8 balls of which 4 are red. P(3rd red, given first two red) = 4/8 = 1/2.",
        "Multiply: 3/5 × 5/9 × 1/2 = 15/90 = 1/6.",
        "Check: (6 × 5 × 4) ÷ (10 × 9 × 8) = 120/720 = 1/6. ✓",
      ], answer: "1/6" },
    ],
      tryit: { q: "A bag has 4 green and 2 yellow counters. Two are drawn without replacement. Find P(both yellow).", answer: "1/15.\nP(1st yellow) =\n2/6 =\n1/3.\nOne yellow and one counter overall are now gone, leaving 5 counters with 1 yellow, so P(2nd yellow given 1st yellow)=1/5. Multiply: 1/3×1/5=1/15." } },
    { h: "3. At-least-one, via the complement", body: [
      "Flip two fair coins and list all 4 equally likely outcomes: HH, HT, TH, TT. Count how many contain at least one head: HH, HT and TH all do - that's 3 out of 4, so P(at least one head)=3/4 by direct counting.",
      "Now work it out a different way: P(no heads at all) means both flips are tails, which is just the single outcome TT, so P(no heads)=1/4. Subtracting from 1: 1-1/4=3/4 - exactly matching the count.",
      "That match is guaranteed, not lucky. 'At least one head' and 'no heads at all' are opposites: every possible outcome falls into exactly one of these two categories, with nothing left over and no overlap between them. Two categories that between them cover every possibility, with no overlap, must have probabilities that add up to exactly 1. Rearranging P(at least one)+P(none)=1 gives P(at least one)=1-P(none).",
      "This is most useful when 'none happening' is much easier to calculate directly than 'at least one happening' - which is almost always true once there are more than two events or trials, since 'at least one' would otherwise mean adding up lots of separate messy cases (exactly one, exactly two, exactly three...), whereas 'none' is just one multiplication.",
      "The pitfall to avoid: P(at least one) is NOT found by adding the individual probabilities of each trial together - that method overcounts (and can even produce an answer bigger than 1 once there are enough trials). Always go via the complement, P(none), instead.",
    ], examples: [
      { q: "Two fair coins are flipped. Find P(at least one head).", steps: [
        "'At least one head' is the opposite of 'no heads at all', i.e. both coins landing tails.",
        "Find P(a single coin shows tails) = 1/2.",
        "Since the coins are independent:\nP(both tails) =\n1/2×1/2 =\n1/4.",
        "P(at least one head) =\n1 - P(both tails) =\n1 - 1/4 =\n3/4.",
        "Check by listing: HH, HT, TH, TT - 3 of these 4 equally likely outcomes contain at least one head, giving 3/4. Matches.",
      ], answer: "3/4" },
      { q: "P(rain on a given day) = 0.3. Find P(at least one rainy day in 2 independent days).", steps: [
        "P(no rain on a single day) =\n1-0.3 =\n0.7.",
        "Since the two days are independent:\nP(no rain on either day) =\n0.7×0.7 =\n0.49.",
        "P(at least one rainy day) =\n1 - P(no rain at all) =\n1-0.49 =\n0.51.",
      ], answer: "0.51" },
      { q: "A fair die is rolled three times. Find P(at least one 6).", steps: [
        "Use the complement: P(at least one 6) = 1 − P(no 6 on any roll).",
        "P(not a 6 on one roll) = 5/6.",
        "Since the three rolls are independent:\nP(no 6 on all three rolls) =\n(5/6)³ =\n125/216.",
        "P(at least one 6) =\n1 − 125/216 =\n91/216.",
      ], answer: "91/216" },
    ],
      tryit: { q: "A biased coin has P(heads)=0.6, and is flipped twice (independent flips). Find P(at least one tail).", answer: "0.64. P(no tails at all) means both flips are heads: 0.6×0.6=0.36. So:\nP(at least one tail) =\n1-0.36 =\n0.64." } },
  ],
};

INTERMEDIATE_LESSONS.combinatoricsAndCounting = {
  title: "Combinatorics: counting without listing",
  minutes: 13,
  order: 14,
  prereq: [{ module: "primary", key: "combinatoricsCounting" }, { module: "junior", key: "seating" }],
  intro: "Combinatorics is about counting how many ways something can happen, without having to list every single possibility by hand. This lesson covers permutations (order matters), combinations (order doesn't matter), and the classic handshake-style counting problem. Go slowly through the 'why' paragraphs in each section - once you've seen why a counting rule works, you stop needing to memorise it.",
  sections: [
    { h: "1. Permutations: order matters", body: [
      "Start with something small enough to list by hand. How many ways can 3 people, A, B and C, stand in a queue? Write every arrangement out: ABC, ACB, BAC, BCA, CAB, CBA. That's 6 arrangements, and no others are possible - any attempt to write a 7th will just repeat one you already have.",
      "Notice how that count of 6 also falls out of a simple slot-filling argument: there are 3 choices for who stands first. Once that person is fixed, only 2 people are left for the second slot. Once that's fixed, only 1 person is left for the third slot. Multiplying the choices at each stage gives 3 × 2 × 1 = 6, exactly matching the list. This 'multiply the choices at each stage' idea is called the multiplication principle, and it's the engine behind every count in this lesson.",
      "Now generalise it. If you're arranging r items chosen from n distinct items INTO ORDER, the first slot has n choices, the second has (n-1) choices (one item is used up), the third has (n-2), and so on, for r slots in total. This count is written nPr (\"n permute r\"): nPr = n × (n-1) × (n-2) × ... down to r terms.",
      "The one thing to watch is where the multiplication stops. It runs for exactly r terms, not all the way down to 1, unless r happens to equal n. If you're placing 3 out of 8 runners into 1st, 2nd and 3rd, you multiply 8 × 7 × 6 (three terms, one per medal) and then STOP - there's no reason to keep going down to 5, 4, 3... because only 3 positions exist.",
    ], examples: [
      { q: "How many ways can 3 runners finish 1st, 2nd and 3rd out of 8 racers?", steps: [
        "This is an arrangement into order (1st, 2nd, 3rd are different positions), so it's a permutation problem.",
        "There are 3 positions to fill, so the multiplication chain will have exactly 3 terms, starting from 8.",
        "8 choices for who finishes 1st.",
        "Once 1st is decided, 7 racers remain, so 7 choices for 2nd.",
        "Once 1st and 2nd are decided, 6 racers remain, so 6 choices for 3rd.",
        "Multiply the three stage-counts together: 8 × 7 × 6 = 336.",
      ], answer: "336" },
      { q: "How many ways can 4 contestants out of 10 be awarded 1st, 2nd, 3rd and 4th place (a harder version with more positions)?", steps: [
        "There are 4 positions this time, so the chain needs exactly 4 terms, starting from 10.",
        "10 choices for 1st place.",
        "9 remaining choices for 2nd place.",
        "8 remaining choices for 3rd place.",
        "7 remaining choices for 4th place.",
        "Multiply all four stage-counts:\n10 × 9 = 90, then\n90 × 8 = 720, then\n720 × 7 = 5040.",
      ], answer: "5040" },
      { q: "How many different arrangements of the letters M, A, T, H, S are there? How many of these arrangements begin with M?", steps: [
        "Part 1 — all arrangements: there are 5 distinct letters, so the total number of arrangements is 5! = 5 × 4 × 3 × 2 × 1 = 120.",
        "Part 2 — starting with M: fix M in the first position. The remaining 4 letters (A, T, H, S) can be arranged freely in the other 4 positions.",
        "Number of arrangements of those 4 letters = 4! = 4 × 3 × 2 × 1 = 24.",
      ], answer: "120 arrangements in total; 24 begin with M" },
    ],
      tryit: { q: "5 sprinters race. In how many ways can gold, silver and bronze medals be awarded?", answer: "60. Three positions to fill from 5 sprinters: 5 × 4 × 3 = 60, stopping after three terms because there are only three medals." } },
    { h: "2. Combinations: order doesn't matter", body: [
      "Compare two different questions about the same 3 people, A, B and C. Question 1: how many ORDERED pairs can you make (like picking a captain then a vice-captain)? List them: AB, BA, AC, CA, BC, CB - that's 6, matching nPr with n=3, r=2 (3×2=6). Question 2: how many ways can you choose an UNORDERED pair (like picking 2 people for a team, where nobody has a special role)? List them: AB, AC, BC - that's only 3, because AB and BA are now the SAME choice (the same two people).",
      "Look at the ratio between those two counts: 6 ÷ 3 = 2. That 2 isn't a coincidence, and it's worth defining a new piece of notation to describe it properly. For a whole number n, write n! (read 'n factorial') to mean n multiplied by every smaller whole number down to 1: n! = n × (n-1) × (n-2) × ... × 2 × 1. So 2! = 2 × 1 = 2, and 3! = 3 × 2 × 1 = 6. The ratio just found, 2, is exactly 2!: it's the number of ways to reorder any 2 chosen items (AB can only become BA, one swap, so there are 2! = 2 orderings). Every unordered pair, like {A,B}, corresponds to exactly 2 of the ordered pairs (AB and BA), so the ordered count is always r! times bigger than the unordered count, for a selection of size r. That gives the rule: nCr = nPr ÷ r!.",
      "nPr can also be written using factorial notation instead of a running product, and it's worth checking the two forms really agree before using either. Take the running example again, n=3, r=2: n! = 3! = 3×2×1 = 6, and (n-r)! = (3-2)! = 1! = 1 (when the countdown reaches 1, there's nothing smaller left to multiply by, so 1! is just 1). Dividing:\nn!/(n-r)! =\n6/1 =\n6,\nthe same 6 as nPr = 3×2 computed directly above. This works in general, not just for these numbers: n! is the full product n×(n-1)×...×(n-r+1)×(n-r)×(n-r-1)×...×1, and dividing by (n-r)! cancels exactly that second half of the chain - the tail running from (n-r) down to 1 - leaving only the first r factors, n×(n-1)×...×(n-r+1). So nPr = n!/(n-r)!, and dividing that by r! (to remove the ordering, exactly as just shown) gives the full combination formula: nCr = n!/(r!×(n-r)!).",
      "In practice it's often quickest to compute nPr first as a short multiplication chain, then divide by r! at the end, cancelling where you can rather than working out huge factorials.",
      "The key question to ask before choosing which formula to use is: are the chosen items being given different roles (positions, medals, ordered slots) or are they just being grouped together as an unordered set (a team, a committee, a handful of toppings)? Different roles mean permutations; an unordered group means combinations, and you must remember to divide out the r! or you'll overcount.",
    ], examples: [
      { q: "How many ways can a pair of 2 representatives be chosen from a class of 5 (no distinct roles, just 2 people)?", steps: [
        "This is a combination, since the 2 chosen people aren't given different roles.",
        "First find the permutation count nPr with n=5, r=2: 5 × 4 = 20.",
        "The 2 chosen items can be reordered in 2! = 2 ways, and each of those 2 orderings was counted separately in the permutation count.",
        "Divide to remove the overcounting: 20 ÷ 2 = 10.",
      ], answer: "10" },
      { q: "How many ways can a team of 3 be chosen from 8 people (a harder version with a bigger group)?", steps: [
        "This is a combination: a 'team' has no internal order, so all 3 members play an equivalent role.",
        "First find nPr with n=8, r=3: 8 × 7 × 6 = 336.",
        "The 3 chosen items can be reordered in:\n3! =\n3 × 2 × 1 =\n6\nways, all counted as the same team inside the 336.",
        "Divide to remove the overcounting: 336 ÷ 6 = 56.",
      ], answer: "56" },
      { q: "A committee of 3 is to be chosen from 4 men and 5 women. In how many ways can this be done if the committee must contain at least one man?", steps: [
        "Count all ways to choose any 3 from all 9 people (no restriction): 9C3 = (9 × 8 × 7) ÷ (3 × 2 × 1) = 504 ÷ 6 = 84.",
        "Count the ways with no men at all (3 women chosen from 5): 5C3 = (5 × 4 × 3) ÷ (3 × 2 × 1) = 60 ÷ 6 = 10.",
        "Subtract: ways with at least one man = 84 − 10 = 74.",
      ], answer: "74" },
    ],
      tryit: { q: "How many ways can 3 pizza toppings be chosen from a menu of 6 toppings?", answer: "20. Permutation count 6 × 5 × 4 = 120, and 3! = 6 (since the 3 chosen toppings have no order), so:\n120 ÷ 6 =\n20." } },
    { h: "3. The handshake problem", body: [
      "Take a small group of 4 people, A, B, C and D, and have everyone shake hands with everyone else exactly once. List every handshake: AB, AC, AD, BC, BD, CD. That's 6 handshakes, and listing any more would just repeat a pair (BA is the same handshake as AB).",
      "Look closely at what a handshake actually is: it's simply an unordered choice of 2 people out of the group. That means the number of handshakes in a group of n people is exactly nC2 - the same quantity from section 2, just wearing a different costume.",
      "Since nCr = nPr ÷ r!, setting r = 2 gives:\nnC2 =\nnP2 ÷ 2! =\n[n × (n-1)] ÷ 2.\nFor the group of 4, that's:\n(4 × 3) ÷ 2 =\n12 ÷ 2 =\n6,\nmatching the list exactly.",
      "The division by 2 is doing real work here, not just decoration: without it you'd be counting 'A shakes B's hand' and 'B shakes A's hand' as two separate events, when they're actually the same physical handshake. Dividing by 2! is exactly how section 2 taught you to remove that kind of double-count.",
    ], examples: [
      { q: "At a small meeting of 6 people, everyone shakes hands with everyone else once. How many handshakes in total?", steps: [
        "A handshake is an unordered choice of 2 people, so this is nC2 with n=6.",
        "Ordered pair count: 6 × 5 = 30.",
        "Divide by 2! = 2 to remove the double-count (A-then-B and B-then-A are the same handshake):\n30 ÷ 2 =\n15.",
      ], answer: "15" },
      { q: "At a party of 12 people, everyone shakes hands with everyone else once (a harder version with a bigger group). How many handshakes?", steps: [
        "Again this is nC2, now with n=12.",
        "Ordered pair count: 12 × 11 = 132.",
        "Divide by 2! = 2:\n132 ÷ 2 =\n66.",
      ], answer: "66" },
      { q: "A complete graph has n vertices, with exactly one edge connecting every pair of vertices. If the graph has 45 edges in total, find n.", steps: [
        "Each edge is an unordered pair of vertices, so the number of edges = nC2 = n(n−1)/2.",
        "Set n(n−1)/2 = 45: multiply both sides by 2 to get n(n−1) = 90.",
        "Expand and rearrange: n² − n − 90 = 0.",
        "Factorise: (n − 10)(n + 9) = 0, giving n = 10 or n = −9.",
        "Since n must be a positive number of vertices, n = 10. Check: 10 × 9 ÷ 2 = 45. ✓",
      ], answer: "n = 10" },
    ],
      tryit: { q: "In a round-robin chess tournament with 9 players, every player plays every other player exactly once. How many games are played?", answer: "36. Each game is an unordered choice of 2 players out of 9:\n(9 × 8) ÷ 2 =\n72 ÷ 2 =\n36." } },
  ],
};

INTERMEDIATE_LESSONS.invariantsAndParity = {
  title: "Invariants & Parity: what never changes",
  minutes: 12,
  order: 16,
  prereq: ["numberTheoryDivisibility"],
  intro: "An invariant is something about a puzzle that stays fixed no matter what moves are made - often the parity (odd/evenness) of a total. Spotting the right invariant can solve a puzzle instantly, without checking every possible case. Go slowly through the demonstrations in each section - once you've seen a rule proved on real numbers, you won't need to just trust it.",
  sections: [
    { h: "1. Odd + odd, odd x even, and the rules of parity", body: [
      "Parity, whether a number is odd or even, is really just divisibility by 2 - the same idea covered in general in the divisibility prerequisite lesson, just specialised down to the only two possible remainders when dividing by 2: 0 (even, divides exactly with nothing left over) or 1 (odd, one left over).",
      "Check the basic rules on real numbers before trusting them. 4 + 6 = 10 (even + even = even). 3 + 5 = 8 (odd + odd = even). 3 + 4 = 7 (odd + even = odd). 3 × 4 = 12 (odd × even = even).",
      "These aren't accidents, and it's worth seeing exactly why, using letters to stand for 'any whole number, not a fixed one'. Any even number can be written as 2a for some whole number a, and any odd number as 2b+1 for some whole number b. Every letter used below - a, b, c, d, k and so on - works the same way: it just means 'some whole number', and a fresh letter is used whenever a fresh, possibly-different number is needed (there's no reason to assume two different even numbers are secretly equal, for instance, so they get two different letters).",
      "Adding two evens, calling them 2a and 2c so they're allowed to be different numbers: 2a + 2c = 2(a+c), which is 2 × (a whole number, since a+c is a whole number whenever a and c both are), so it's even. Adding two odds, calling them 2b+1 and 2d+1:\n(2b+1) + (2d+1) =\n2(b+d) + 2 =\n2(b+d+1),\nagain even, since b+d+1 is a whole number. Adding an odd and an even: (2b+1) + 2a = 2(a+b) + 1, which is 2 × (a whole number) + 1, the exact definition of odd.",
      "The same approach handles multiplication. Odd × even: (2b+1) × 2a = 2 × [a(2b+1)], even, since there's a factor of 2 sitting outside. Odd × odd:\n(2b+1)(2d+1) =\n4bd + 2b + 2d + 1 =\n2(2bd+b+d) + 1,\nwhich is odd. Subtraction behaves exactly like addition for parity purposes too (odd - even = odd, odd - odd = even, and so on), since taking away a number has the same effect on parity as adding it back would.",
      "This lets you predict the parity of a long calculation without doing any of the actual arithmetic - just track odd/even through each operation in turn, applying multiplication before addition, exactly as the normal order of operations requires.",
      "The one real trap is doing the tracking in the wrong order. Parity must be worked out in the same sequence you'd calculate the real answer (brackets and multiplication before addition and subtraction), otherwise you can easily flip the final result.",
    ], examples: [
      { q: "Is 15 + 22 odd or even?", steps: [
        "15 is odd, 22 is even.",
        "Odd + even = odd (from the rule above).",
      ], answer: "Odd" },
      { q: "Is 37 x 48 + 15 odd or even (a harder version mixing multiplication and addition)?", steps: [
        "Order of operations: the multiplication must be resolved first.",
        "37 is odd, 48 is even, so 37 × 48 is odd × even = even.",
        "Now add 15 (odd) to that even result: even + odd = odd.",
      ], answer: "Odd" },
      { q: "Show that 3n² + n is always even for any integer n, using a parity argument.", steps: [
        "Factorise: 3n² + n = n(3n + 1).",
        "Case 1 — n is even: the product n × (3n + 1) contains the even factor n, so the product is even.",
        "Case 2 — n is odd: 3n is odd × odd = odd, so 3n + 1 is odd + even = even. The product n × (3n + 1) is odd × even = even.",
        "In both cases the product is even, so 3n² + n is always even for every integer n.",
      ], answer: "Always even, since n(3n + 1) always contains an even factor" },
    ],
      tryit: { q: "Is 29 x 13 - 8 odd or even?", answer: "Odd. 29 and 13 are both odd, and odd × odd = odd, giving an odd result. Subtracting 8 (even) from an odd number keeps it odd, since odd - even = odd, the same rule as addition." } },
    { h: "2. Famous invariant results", body: [
      "Build up the pattern for summing odd numbers rather than just being told it:\n1 = 1².\n1+3 =\n4 =\n2².\n1+3+5 =\n9 =\n3².\n1+3+5+7 =\n16 =\n4².\nEvery time, adding the next odd number lands exactly on the next perfect square.",
      "This pattern can be proved for any number of terms at all, not just the four checked above, using a letter to stand for 'which position in the list you've reached'. Let k stand for any whole number counting a position: k=1 means the 1st odd number, k=2 the 2nd, k=3 the 3rd, and so on. The odd numbers themselves follow a simple rule tied to their position: the 1st is 1 = 2(1)-1, the 2nd is 3 = 2(2)-1, the 3rd is 5 = 2(3)-1, the 4th is 7 = 2(4)-1 - doubling the position and subtracting 1 always gives that position's odd number. So in general, the kth odd number is (2k-1).",
      "Now suppose the sum of the first (k-1) odd numbers is already known to equal (k-1)² - true for the small cases just checked, for instance with k-1=3: 1+3+5=9=3². The very next odd number in the list, the kth one, is (2k-1) as just shown. Adding it to that running total:\n(k-1)² + (2k-1) =\nk² - 2k + 1 + 2k - 1 =\nk².\nThe -2k and +2k cancel, and the +1 and -1 cancel, leaving exactly k². So no matter how far the list has already got, adding the next odd number always lands exactly on the next perfect square. Since this step works for every whole number k, repeating it from k=1 all the way up proves the sum of the first n odd numbers is always n², for any n.",
      "The even numbers have their own pattern, built the same way:\n2 =\n1×2.\n2+4 =\n6 =\n2×3.\n2+4+6 =\n12 =\n3×4.\nThe sum of the first n even numbers is always n(n+1).",
      "This also has a quick proof: the first n even numbers are just 2×1, 2×2, ..., 2×n, so their sum is:\n2×(1+2+...+n) =\n2 × [n(n+1)/2] =\nn(n+1),\nusing the standard result that 1+2+...+n = n(n+1)/2. That result itself comes from pairing terms from opposite ends of the list: pair 1 with n, 2 with (n-1), 3 with (n-2), and so on. Every such pair adds up to exactly n+1, and there are n/2 pairs in total, giving n/2 × (n+1) = n(n+1)/2 altogether.",
      "Both shortcuts turn a long addition into a single multiplication, which is exactly the point of spotting an invariant pattern - once you know the rule holds for every n, you never need to add term by term again.",
      "The easiest mistake to make is confusing n (how many terms you're adding - the same role k played above, just renamed for the general count) with the value of the LAST term. The nth odd number is (2n-1), not n itself - 'the first 10 odd numbers' means n=10, but the list actually runs up to 19 (= 2×10 - 1), not up to 10.",
    ], examples: [
      { q: "Find 1+3+5+7+9+11 (the first 6 odd numbers) using the shortcut.", steps: [
        "Count the terms: there are 6 of them, so n=6.",
        "Apply the rule: sum of first n odd numbers = n².",
        "6² = 36.",
        "Check by direct addition:\n1+3 = 4,\n+5 = 9,\n+7 = 16,\n+9 = 25,\n+11 = 36.\nMatches.",
      ], answer: "36" },
      { q: "What is 1+3+5+7+...+19 (the first 10 odd numbers, a harder version with more terms)?", steps: [
        "Confirm 19 really is the 10th odd number using the nth-term rule: 2×10 - 1 = 19. It matches, so n=10.",
        "Apply the rule: sum of first n odd numbers = n².",
        "10² = 100.",
        "This avoids adding all 10 numbers by hand.",
      ], answer: "100" },
      { q: "Find the sum 1 + 3 + 5 + ... + 99 using the shortcut for odd numbers.", steps: [
        "Identify n: the kth odd number is 2k − 1. Set 2k − 1 = 99 to find k: 2k = 100, so k = 50. The list contains 50 odd numbers.",
        "Apply the shortcut: sum of first n odd numbers = n².",
        "Sum = 50² = 2500.",
      ], answer: "2500" },
    ],
      tryit: { q: "What is 2+4+6+8+10+12+14 (the first 7 even numbers)?", answer: "56. Using the shortcut n(n+1) with n=7: 7×8 = 56. Check by direct addition: 2+4+6+8+10+12+14 = 56." } },
    { h: "3. Using parity to rule out impossible puzzles", body: [
      "Try a concrete puzzle first. 5 coins all start heads-up. Each move flips exactly 2 coins of your choosing (heads become tails, tails become heads). Could all 5 coins ever end up tails-up? Look at what one move does to the total number of heads: flipping 2 heads turns them both to tails, so heads decreases by 2; flipping 2 tails turns them both to heads, so heads increases by 2; flipping 1 head and 1 tail swaps their roles, so heads stays the same. Every move changes the heads-count by -2, 0 or +2 - always an even amount.",
      "That means the PARITY (odd or even) of the heads-count can never change, no matter how many moves are made or which coins are chosen. It starts at 5, which is odd, so it stays odd forever. All-tails means 0 heads, which is even. Since odd can never become even by adding even amounts, this puzzle is impossible - and no amount of trying different move sequences will ever find a way, because the invariant rules it out completely.",
      "This is the general technique: find some quantity that only ever changes by amounts that preserve a property (usually its parity), work out that property at the start, and compare it with what the target would require. If they don't match, no sequence of moves, however long, can bridge the gap.",
      "The reasoning is airtight because it doesn't depend on HOW MANY moves are made or in what order - each individual move preserves the parity, so by repeating that fact move after move, the parity at every future point is forced to match the parity at the start. It's a proof about ALL possible move sequences at once, not just the ones you happened to try.",
      "Matching parity is not the same as proving something possible. If the start and target parities agree, this particular invariant simply fails to rule the puzzle out - you'd still need to actually find a working sequence of moves (or a different invariant) to be sure it can be done. Also double-check that every type of allowed move really does preserve the property you're relying on; missing one exceptional move can silently break the whole argument.",
    ], examples: [
      { q: "A light switch starts OFF. Each flick toggles it (OFF becomes ON, ON becomes OFF). After 15 flicks, could the switch be ON?", steps: [
        "After 1 flick: ON. After 2 flicks: OFF. After 3 flicks: ON. The state alternates with every single flick.",
        "So after an ODD number of flicks the switch is ON, and after an EVEN number of flicks it is OFF - the state is entirely determined by the parity of the flick-count.",
        "15 is odd.",
        "So after 15 flicks the switch is ON.",
      ], answer: "Yes, ON. This is a case where the parities match up, so the target is genuinely reachable (unlike the examples that follow, where a mismatch rules the target out)." },
      { q: "A frog starts at 0 on a number line and jumps either +3 or +5 each time (its choice). After exactly 7 jumps, could it be at position 30 (a harder version using an impossibility argument)?", steps: [
        "Both jump sizes, 3 and 5, are odd numbers.",
        "The frog's total displacement after 7 jumps is the sum of 7 odd numbers.",
        "A sum of k odd numbers always has the same parity as k itself. This follows from the addition rules proved in Section 1: start from 0 (even, since an empty sum has nothing in it), then add the odd numbers on one at a time - each single addition of an odd number flips the running total's parity (even+odd=odd, or odd+odd=even, either way it flips). Flipping the parity k times in total lands back on even if k is even, and lands on odd if k is odd.",
        "Here k=7, which is odd, so the total displacement after 7 jumps must be odd, regardless of which mix of +3s and +5s was used.",
        "30 is even, but the displacement is forced to be odd - a mismatch.",
      ], answer: "No, impossible. No combination of 7 jumps of +3 or +5 can ever total an even number like 30." },
      { q: "A 4 × 4 grid is coloured like a chessboard (alternating black and white, 8 squares of each colour). Two diagonally opposite corner squares — both the same colour — are removed, leaving 14 squares. Can 7 dominoes, each covering exactly 2 adjacent squares, tile the 14 remaining squares? Use a parity argument.", steps: [
        "On a chequerboard, diagonally opposite corners of a 4 × 4 grid are always the same colour. Removing both leaves 6 of that colour and 8 of the other.",
        "Each domino covers exactly 2 adjacent squares. Adjacent squares on a chequerboard always differ in colour, so every domino covers exactly 1 black square and 1 white square.",
        "Seven dominoes would therefore cover exactly 7 black and 7 white squares.",
        "But the remaining board has 6 of one colour and 8 of the other — not 7 and 7. The colour counts cannot match no matter how the dominoes are placed, so tiling is impossible.",
      ], answer: "No — impossible. Removing two same-colour corners leaves 6 of one colour and 8 of the other, but 7 dominoes must cover 7 of each. The colour imbalance rules it out." },
    ],
      tryit: { q: "A counter starts at 0 and each move adds either 3 or 7 (both odd). After 4 moves, could it show 15?", answer: "No. The total after 4 moves is a sum of 4 odd numbers, and a sum of an even number of odd numbers is always even. 15 is odd, so it can never be reached after exactly 4 moves." } },
  ],
};

INTERMEDIATE_LESSONS.logicAndDeduction = {
  title: "Logic & Deduction: truth-tellers, liars and clues",
  minutes: 13,
  order: 17,
  prereq: [{ module: "junior", key: "truthLiars" }, { module: "junior", key: "pigeonhole" }],
  intro: "Logic puzzles give you a set of statements and ask what must be true. The key technique is testing an assumption (say, 'assume person A is telling the truth') and following the consequences through - if you hit a contradiction, that assumption was wrong. Go slowly through each assumption in turn; the whole method depends on checking BOTH branches properly, not stopping as soon as one seems to work.",
  sections: [
    { h: "1. Truth-tellers and liars", body: [
      "These puzzles build on the basic truth-teller-and-liar setup from the truth-tellers-and-liars prerequisite lesson (a truth-teller always says true things, a liar always says false things), extending it to several statements at once. They all rely on one core method: assumption-testing. Pick one of the possibilities the puzzle allows (say, 'assume this person is a truth-teller'), work out everything that possibility FORCES every statement to mean, and check whether those forced meanings clash with the possibility you started with. If they do clash - if the assumption ends up forcing something that contradicts itself - that's called a contradiction, and it proves that assumption cannot be the real situation. If nothing clashes, the assumption survives as a genuine possibility, at least until it's tested against any other statements in the puzzle.",
      "See the method in its purest form first. Suppose one person, Max, says: 'I am a liar.' Try assuming Max is a truth-teller: then his statement must be true (since truth-tellers only say true things), meaning Max IS a liar - but that directly contradicts the assumption just made, that he's truthful. Now try the other possibility, that Max is a liar: then his statement must be false (since liars only say false things), meaning Max is NOT a liar - which contradicts the assumption that he's a liar. Both of the only two possibilities collapse into contradictions, which shows this particular statement could never actually be spoken by either a truth-teller or a liar - it's a paradox, not a puzzle with a real answer.",
      "In a solvable puzzle (unlike Max's paradox above), exactly one assumption about who is truthful will survive the check, and the other assumption will hit a genuine contradiction. The general procedure: assume one person is the truth-teller, work out what that FORCES every statement to mean, and see if everything stays consistent; then do exactly the same for the alternative assumption.",
      "For puzzles with several statements, work through the consequences of each assumption systematically, one statement at a time, rather than jumping to a conclusion. Write down what each person's statement would have to mean (true or false) under the assumption you're testing, then check that this matches what their type (truth-teller or liar) requires.",
      "The one habit to enforce every time: don't stop the moment one assumption looks consistent. Always finish checking the OTHER assumption too, and confirm it genuinely leads to a contradiction (not just that it 'seems less likely'). A well-posed puzzle guarantees exactly one assumption survives; if you find that both seem to survive, that's a sign to re-read the statements rather than guess.",
    ], examples: [
      { q: "Two people, Tom and Wendy. Exactly one of them always tells the truth and the other always lies. Tom says: 'At least one of us is a liar.' Who is the truth-teller?", steps: [
        "Assume Tom is the truth-teller (so Wendy is the liar).",
        "Then Tom's statement must be true. Check it: is at least one of them a liar? Yes, Wendy is. So the statement is true - consistent, no contradiction.",
        "Now assume Wendy is the truth-teller (so Tom is the liar).",
        "Then Tom's statement must be false, since Tom lies. For 'at least one of us is a liar' to be false, NEITHER person can be a liar - but this branch assumes Tom IS a liar. That's a direct contradiction.",
        "Only the first assumption survives.",
      ], answer: "Tom is the truth-teller." },
      { q: "Two people, Priya and Raj. Exactly one always tells the truth. Priya says: 'Raj is a liar.' Raj says: 'Priya and I are both liars.' (A harder version with two statements.) Who is the truth-teller?", steps: [
        "Assume Priya is the truth-teller (so Raj is the liar).",
        "Priya's statement 'Raj is a liar' must then be true - and it is, by assumption. Consistent so far.",
        "Raj's statement must be false, since Raj lies. Check: is 'Priya and I are both liars' actually false? Priya is truthful (not a liar) in this branch, so 'both are liars' is indeed false. Consistent - no contradiction anywhere.",
        "Now assume Raj is the truth-teller (so Priya is the liar).",
        "Raj's statement 'Priya and I are both liars' must then be true - but that would mean Raj himself is a liar, directly contradicting the assumption that Raj is truthful.",
        "Only the first assumption survives.",
      ], answer: "Priya is the truth-teller." },
      { q: "Three people, Ali, Ben and Cara. Exactly one tells the truth and the other two always lie. Ali says: 'Ben is a liar.' Ben says: 'Cara is the truth-teller.' Cara says: 'I tell the truth.' Who is the truth-teller?", steps: [
        "Test Ali as truth-teller (Ben and Cara are liars): Ali's statement 'Ben is a liar' must be true — consistent, since Ben is a liar in this branch.",
        "Ben lies, so 'Cara is the truth-teller' must be false — Cara is NOT the truth-teller. Consistent with Ali being the truth-teller.",
        "Cara lies, so 'I tell the truth' must be false — Cara does not tell the truth. Consistent with Cara being a liar. No contradiction: the Ali branch survives.",
        "Test Ben as truth-teller: 'Cara is the truth-teller' must be true, meaning both Ben and Cara are truth-tellers — but there is exactly one. Contradiction.",
        "Test Cara as truth-teller: Ali lies, so 'Ben is a liar' is false — Ben is not a liar, meaning Ben is the truth-teller. But Cara is the truth-teller in this branch. Contradiction.",
        "Only the Ali branch survives.",
      ], answer: "Ali is the truth-teller." },
    ],
      tryit: { q: "Jo says: 'Jo and Kim are both liars.' Exactly one of them always tells the truth. Who is the truth-teller?", answer: "Kim. If Jo were truthful, Jo would be admitting to being a liar, a contradiction. So Jo lies, meaning the statement 'both are liars' is false, so Kim must be truthful." } },
    { h: "2. The pigeonhole principle", body: [
      "Check a small case directly. Take 3 socks and only 2 colours available (say red and blue). Could all 3 socks have different colours from each other? There are only 2 colours to choose from, so with 3 socks, at least two of them are forced to share a colour - there simply aren't enough colours to go round without a repeat.",
      "Let N stand for the total number of items being placed, and k for the number of containers they're going into. That's the whole idea generalised: if N items are placed into k containers, and N is bigger than k, at least one container must hold more than one item. More precisely, at least one container is guaranteed to hold at least ⌈N/k⌉ items, where ⌈⌉ means 'round up to the next whole number'.",
      "To use it, imagine spreading the items as EVENLY as possible across the containers - that's the best case for avoiding a big pile-up. If N doesn't divide evenly by k, the leftover items must go somewhere, forcing at least one container one item higher than the even split. Rounding N/k up to the next whole number captures exactly that forced leftover.",
      "Two things catch people out: rounding down instead of up (⌈4.1⌉ is 5, not 4), and forgetting that the principle only guarantees THAT some container is overloaded, not WHICH one.",
    ], examples: [
      { q: "In a room of 13 people, must at least 2 of them share a birth month (there are 12 months)?", steps: [
        "N = 13 people (items), k = 12 months (containers).",
        "Compute N/k:\n13/12 =\n1.0833...",
        "Round up: ⌈13/12⌉ = 2.",
      ], answer: "Yes - at least 2 people must share a birth month." },
      { q: "23 socks are placed into 5 drawers (a harder version with bigger numbers). What's the minimum guaranteed number in the fullest drawer?", steps: [
        "N = 23 socks, k = 5 drawers.",
        "Compute N/k:\n23/5 =\n4.6.",
        "Round up: ⌈23/5⌉ = 5.",
      ], answer: "5" },
      { q: "Show that among any 10 integers chosen from the set {1, 2, 3, ..., 17}, at least two of the chosen integers must sum to 18.", steps: [
        "Pair up the integers 1 to 17 into groups whose members sum to 18: {1,17}, {2,16}, {3,15}, {4,14}, {5,13}, {6,12}, {7,11}, {8,10}, and the singleton {9} (since 18 − 9 = 9, there is no distinct partner for 9).",
        "This gives 8 pairs and 1 singleton — 9 containers altogether, covering every integer from 1 to 17.",
        "We choose 10 integers from these 9 containers. Since 10 > 9, by the pigeonhole principle at least one container must contain 2 of the chosen integers.",
        "The singleton {9} can contribute at most 1 integer, so the container holding 2 chosen integers must be one of the 8 pairs. Those 2 integers sum to 18.",
      ], answer: "At least two of the 10 chosen integers must sum to 18." },
    ],
      tryit: { q: "37 pigeons roost in 6 pigeonholes. What is the minimum guaranteed number in the fullest hole?", answer: "7. 37/6 = 6.1666..., and rounding up gives ⌈37/6⌉ = 7 (since 6 holes with 6 pigeons each only accounts for 36, the 37th pigeon forces one hole up to 7)." } },
  ],
};

INTERMEDIATE_LESSONS.diophantineEquations = {
  title: "Diophantine Equations: integer-only solutions",
  minutes: 13,
  order: 13,
  prereq: ["numberTheoryDivisibility", "simultaneousEquations"],
  intro: "A Diophantine equation is one where only WHOLE NUMBER solutions count - no fractions or decimals allowed. This restriction, surprisingly, is what makes these puzzles solvable by careful reasoning even when there are two unknowns and only one equation. Go slowly through the 'why' paragraphs - the tests in this lesson only work because of exactly how whole numbers behave.",
  sections: [
    { h: "1. When does a solution exist at all?", body: [
      "Start with something you can check by hand, before any letters get involved. Look at the equation 6x + 9y, where x and y can be ANY whole numbers, including negative ones and zero. Since 6 = 3×2, the first term is:\n6x =\n3×2×x =\n3×(2x),\nwhich is 3 times a whole number, whatever x is (2x is a whole number because x is, and 2 is). Since 9 = 3×3, the second term is 9y = 3×(3y), also 3 times a whole number. Adding them:\n6x + 9y =\n3(2x) + 3(3y) =\n3(2x + 3y).\nThis is 3 times a whole number no matter which integers x and y are picked - it is FORCED to be a multiple of 3, always.",
      "That pattern generalises to any two numbers, not just 6 and 9, but it needs some notation defined carefully first, one piece at a time, before it can be written down.",
      "Let a and b be two whole numbers. When we write HCF(a, b) = h, we mean that h is the Highest Common Factor of a and b: the largest whole number that divides both a and b exactly, with nothing left over either time.",
      "For example, HCF(12, 18) = 6, because 6 divides both 12 and 18 exactly (12÷6=2 and 18÷6=3, both whole numbers), and no bigger number manages that (7 doesn't divide 12 at all, and nothing between 7 and 11 divides both).",
      "Since h divides a exactly, a must be h multiplied by some other whole number - call that number p. So:\na =\nh × p.\nSimilarly, since h divides b exactly, b must be h multiplied by some other whole number too - call that one q. So:\nb =\nh × q.",
      "The letters p and q are not special or mysterious. They are simply whatever is left over once a and b have each been divided by h:\np = a ÷ h,\nq = b ÷ h.",
      "Check this against the example above, where a=12, b=18 and h=6:\n12 = 6 × 2, so p = 2.\n18 = 6 × 3, so q = 3.\nThat's the whole of p and q - just the two answers you get from doing 12÷6 and 18÷6.",
      "Now look at the expression a×x + b×y, where x and y are allowed to be ANY integers - positive, negative, or zero, it doesn't matter which. Since a = h×p and b = h×q, replace a and b in that expression with those:\na×x + b×y =\n(h×p)×x + (h×q)×y =\nh×p×x + h×q×y.",
      "Both terms on the right contain a factor of h, so h can be pulled outside a bracket, exactly the way 3 was pulled out at the very start of this section:\nh×p×x + h×q×y =\nh×(p×x + q×y).",
      "The part sitting inside the brackets, p×x + q×y, has to be a whole number itself, because p, q, x and y are all whole numbers, and multiplying whole numbers together, or adding them, always gives another whole number - there's no way for a fraction to sneak in.",
      "So the entire expression a×x + b×y is equal to h multiplied by some whole number. That is exactly what it means for something to be 'a multiple of h'. And since h is HCF(a,b), this proves that a×x + b×y is ALWAYS a multiple of HCF(a,b), no matter which integers are chosen for x and y.",
      "Check this conclusion on the running example too, where a=12, b=18, h=6, p=2, q=3:\n12x + 18y =\n6×2×x + 6×3×y =\n6×(2x + 3y).\nThis is always 6 times a whole number, so 12x + 18y is always divisible by 6, whichever integers x and y turn out to be.",
      "The consequence: if c is not a multiple of HCF(a,b), then a×x + b×y = c can never hold for any integers x and y, because the left side is forced to be a multiple of HCF(a,b) by the argument just given, and the right side, c, isn't. Remarkably, the reverse is also guaranteed to be true (a result called Bezout's identity): whenever HCF(a,b) DOES divide c, at least one integer solution definitely exists. So this single divisibility check is a complete yes/no test, not just a way to rule things out.",
      "In practice: find HCF(a,b) (by listing factors, or using the Euclidean algorithm for bigger numbers), then check whether it divides c exactly.",
      "This test only tells you WHETHER a solution exists, not what it actually is - finding the actual x and y values is the job of section 2.",
    ], examples: [
      { q: "Does 6x + 9y = 20 have integer solutions?", steps: [
        "Find HCF(6,9): the common factors of 6 and 9 are 1 and 3, so HCF(6,9) = 3.",
        "Check whether 3 divides 20 exactly: 20 ÷ 3 = 6.666..., not a whole number.",
        "Since HCF(6,9) does not divide 20, no integer solution can exist.",
      ], answer: "No solution exists" },
      { q: "Does 4x + 6y = 10 have integer solutions (a case where the answer is yes)?", steps: [
        "Find HCF(4,6): the common factors of 4 and 6 are 1 and 2, so HCF(4,6) = 2.",
        "Check whether 2 divides 10 exactly: 10 ÷ 2 = 5, a whole number.",
        "Since HCF(4,6) divides 10, an integer solution must exist.",
        "Confirm with an actual pair: x=1, y=1 gives:\n4(1) + 6(1) =\n4 + 6 =\n10.\nIt works.",
      ], answer: "Yes - for example x=1, y=1" },
      { q: "Find all integer values of n for which 6n + 1 is divisible by 4.", steps: [
        "We need 6n + 1 ≡ 0 (mod 4), i.e. 6n ≡ −1 ≡ 3 (mod 4).",
        "Since 6 ≡ 2 (mod 4), this becomes 2n ≡ 3 (mod 4).",
        "The left side 2n is always even, but 3 is odd. An even number can never equal an odd number.",
        "There is no integer n satisfying the condition.",
      ], answer: "No integer n makes 6n + 1 divisible by 4" },
    ],
      tryit: { q: "Does 8x + 12y = 30 have integer solutions?", answer: "No. HCF(8,12) = 4, and 30 ÷ 4 = 7.5, not a whole number, so 4 does not divide 30 exactly - no integer solution can exist." } },
    { h: "2. Finding solutions by substitution", body: [
      "Once you know a solution exists, the most reliable method is systematic trial. For 3x + 4y = 25, isolate x: x = (25 - 4y)/3, and simply test small whole-number values of y, starting from 0, until the right-hand side comes out as a whole number. Try y=0:\nx =\n25/3 =\n8.33...,\nnot whole - reject it. Try y=1:\nx =\n(25-4)/3 =\n21/3 =\n7,\na whole number - success.",
      "In general, to solve ax + by = c, isolate one variable, x = (c - by)/a, and test y = 0, 1, 2, 3... in turn (increasing, or trying small values in both directions if negative numbers are allowed) until the numerator divides exactly by a.",
      "Once one solution is found, there's a neat trick for generating others: if (x, y) is a solution, then (x+b, y-a) is also a solution, since:\na(x+b) + b(y-a) =\nax + ab + by - ab =\nax + by,\ncompletely unchanged. This shows a single found solution is really just one member of an entire family.",
      "Always finish by substituting your (x, y) pair back into the ORIGINAL equation to confirm it really works, and search systematically (increasing y from 0) rather than guessing at random, so you don't miss the first valid pair or waste time re-testing values.",
    ], examples: [
      { q: "Find a positive integer solution to 3x + 4y = 25.", steps: [
        "Isolate x: x = (25 - 4y) / 3.",
        "Try y=0:\nx =\n25/3 =\n8.33...,\nnot a whole number - reject.",
        "Try y=1:\nx =\n(25-4)/3 =\n21/3 =\n7,\na whole number - success.",
        "Check:\n3(7) + 4(1) =\n21 + 4 =\n25.\nCorrect.",
      ], answer: "x=7, y=1" },
      { q: "Find a positive integer solution to 5x + 8y = 61 (a harder version needing more trials).", steps: [
        "Isolate x: x = (61 - 8y) / 5.",
        "Try y=1:\nx =\n(61-8)/5 =\n53/5 =\n10.6,\nnot a whole number - reject.",
        "Try y=2:\nx =\n(61-16)/5 =\n45/5 =\n9,\na whole number - success.",
        "Check:\n5(9) + 8(2) =\n45 + 16 =\n61.\nCorrect.",
      ], answer: "x=9, y=2" },
      { q: "Find all positive integer solutions to 3x + 5y = 40.", steps: [
        "Isolate x: x = (40 − 5y) / 3. Try y = 1: 35/3 — not a whole number. Try y = 2: 30/3 = 10. Solution (10, 2). Check: 3(10)+5(2) = 40. ✓",
        "Try y = 3: 25/3 (no). y = 4: 20/3 (no). y = 5: 15/3 = 5. Solution (5, 5). Check: 3(5)+5(5) = 40. ✓",
        "Try y = 6: 10/3 (no). y = 7: 5/3 (no). y = 8: 0/3 = 0 — x must be a positive integer, so x = 0 is rejected. y ≥ 9 forces x negative.",
        "No further positive solutions exist.",
      ], answer: "(x, y) = (10, 2) or (x, y) = (5, 5)" },
    ],
      tryit: { q: "Find a positive integer solution to 4x + 9y = 46.", answer: "x=7, y=2. Trying y=1 gives:\nx =\n(46-9)/4 =\n9.25\n(reject); trying y=2 gives:\nx =\n(46-18)/4 =\n7,\na whole number. Check:\n4(7)+9(2) =\n28+18 =\n46." } },
    { h: "3. Digit puzzles as Diophantine equations", body: [
      "Start with what a two-digit number actually means. The number 47 is really 10×4 + 7 - the tens digit contributes 10 times its face value, and the units digit contributes just its face value. Any two-digit number can be written as 10t + u, where t is the tens digit and u is the units digit.",
      "That means clues about 'digit sum' or 'digit difference' are really just clues about t and u, and turn straight into ordinary linear equations - exactly like any other pair of simultaneous equations, just with the extra restriction that t and u must be whole numbers from 0 to 9 (and t can't be 0, or it wouldn't be a two-digit number).",
      "Solve them exactly as you would any simultaneous equations: for instance, if you have both t+u and t-u, adding the two equations cancels u and leaves 2t, which can be divided down to find t directly, then u follows by substitution.",
      "Always check the final digits actually make sense (each between 0 and 9, with the tens digit not zero) - the algebra by itself doesn't know these are digits, only that they're numbers satisfying two equations, so a result outside 0-9 would mean no valid two-digit number fits the clues.",
    ], examples: [
      { q: "A two-digit number has digit sum 9 and its tens digit is 3 more than its units digit. Find it.", steps: [
        "Let the tens digit be t and the units digit be u. The number is 10t+u.",
        "Digit sum clue: t + u = 9.",
        "Digit difference clue: t - u = 3.",
        "Add the two equations to eliminate u: (t+u) + (t-u) = 9+3, giving:\n2t =\n12, so\nt =\n6.",
        "Substitute back:\n6 + u =\n9, so\nu =\n3.",
        "Both digits are valid (0-9, tens digit not 0), so the number is 63.",
      ], answer: "63" },
      { q: "A two-digit number has digit sum 14 and its tens digit is 4 more than its units digit (a harder version with bigger digits). Find it.", steps: [
        "Let the tens digit be t and the units digit be u.",
        "Digit sum clue: t + u = 14.",
        "Digit difference clue: t - u = 4.",
        "Add the two equations:\n2t =\n18, so\nt =\n9.",
        "Substitute back:\n9 + u =\n14, so\nu =\n5.",
        "Both digits are valid, so the number is 95.",
      ], answer: "95" },
      { q: "A two-digit number has the property that reversing its digits gives a number 27 more than the original. Its tens digit is one more than half its units digit. Find the number.", steps: [
        "Let the tens digit be t and the units digit be u. The number is 10t + u; reversed it is 10u + t.",
        "Reversing gives 27 more: (10u + t) − (10t + u) = 27, simplifying to 9u − 9t = 27, so u − t = 3.",
        "Tens digit is one more than half the units digit: t = u/2 + 1, so 2t = u + 2, giving u = 2t − 2.",
        "Substitute into u − t = 3: (2t − 2) − t = 3, giving t − 2 = 3, so t = 5 and u = 8.",
        "Both digits are valid (0–9, tens digit non-zero). The number is 58.",
        "Check: reversed number 85 = 58 + 27 ✓; tens digit 5 = 8/2 + 1 ✓.",
      ], answer: "58" },
    ],
      tryit: { q: "A two-digit number has digit sum 12 and its tens digit is 2 more than its units digit. Find it.", answer: "75. Adding t+u=12 and t-u=2 gives:\n2t =\n14, so\nt =\n7,\nthen u=5. Both digits are valid, giving the number 75." } },
  ],
};

INTERMEDIATE_LESSONS.optimisationAndExtremal = {
  title: "Optimisation: finding the best possible value",
  minutes: 16,
  order: 18,
  prereq: ["algebraicManipulation", "quadratics", { module: "junior", key: "productOpt" }],
  intro: "Optimisation asks 'what's the biggest (or smallest) this can possibly be?' The single most useful rule for a fixed perimeter or fixed sum: the extreme value happens when the parts are as EQUAL as possible. This lesson proves that rule with real numbers rather than just stating it, then shows what happens when a constraint changes the rules of the game.",
  sections: [
    { h: "1. Fixed sum, maximise the product", body: [
      "Suppose two positive whole numbers must add up to 20. Try several different splits and compare their products side by side: 10+10=20, product 10×10=100. 9+11=20, product 9×11=99. 8+12=20, product 8×12=96. 5+15=20, product 5×15=75. 1+19=20, product 1×19=19. Every row adds to 20, but the products fall further and further away from 100 as the two numbers get further apart. The pattern is unmistakable: the closer together the two numbers are, the bigger the product.",
      "Here's why this always happens, using algebra instead of just a table of examples. Let d stand for 'how far each number has moved away from the equal split of 10' - so d=0 means both numbers are still exactly 10 and 10, d=1 means one number went up by 1 and the other down by 1 (giving 11 and 9), d=5 gives 15 and 5, and so on. Write the two numbers as 10+d and 10-d. Check first that this really does capture every split adding to 20, whatever d is chosen:\n(10+d) + (10-d) =\n10 + d + 10 - d =\n20,\nsince the +d and -d cancel out completely - so this way of writing the two numbers is completely general, not a special case that happens to work.",
      "Now multiply the two numbers together, expanding the brackets term by term (the same bracket expansion covered in algebraicManipulation):\n(10+d)(10-d) =\n10×10 - 10×d + d×10 - d×d =\n100 - 10d + 10d - d² =\n100 - d².\nThe middle two terms, -10d and +10d, are opposites, so they cancel exactly - that's why only the two squared terms survive. Two matching brackets like this, with opposite signs, always collapse this way, leaving just a difference of two squares (also covered in quadratics) - that's the name for this exact pattern.",
      "Since d² is zero when d=0 and gets bigger the further d moves from 0 in either direction (d² can never be negative, whether d itself is positive or negative), 100-d² is largest exactly when d=0 - i.e. when the two numbers are equal. This is the same shape of reasoning as in quadratics: subtracting a squared term that's always zero-or-positive can only ever shrink a number or leave it unchanged, never grow it, so the biggest possible result comes at the one point where that squared term is zero. Moving away from equal in either direction can only subtract more, never less, since d² is never negative.",
      "So for a fixed sum, hunt for the split where the two numbers are equal (or as close to equal as the integers allow). Divide the total by 2: if that gives a whole number, that's your two equal parts. If it doesn't, round to the two whole numbers on either side of it.",
      "Watch out for two traps: the numbers must be positive (0 and 20 gives a product of 0, the worst possible split, even though it looks extreme), and if the question asks for integers, you cannot split an odd total into two equal integers, so you must use the two nearest whole numbers instead - e.g. 15 splits as 7 and 8, not 7.5 and 7.5.",
    ], examples: [
      { q: "Two positive integers add to 20. What's the greatest possible product?", steps: [
        "20 is even, so it splits into two equal whole numbers: 20÷2 = 10 and 10.",
        "By the equal-split rule just proved, this is the split that maximises the product.",
        "10 × 10 = 100.",
      ], answer: "100" },
      { q: "Two positive integers add to 15. What's the greatest possible product? (15 is odd, so it can't split into two equal integers - what's the best you can do?)", steps: [
        "15÷2 = 7.5, which isn't a whole number, so an exactly-equal split isn't possible with integers.",
        "The equal-split rule says the true maximum (allowing non-integers) would be at 7.5 and 7.5, so the best integer split is the pair closest to that: 7 and 8.",
        "Check both are positive integers adding to 15: 7+8=15. Correct total.",
        "7 × 8 = 56.",
        "Compare with the next-closest split to confirm: 6+9=15, 6×9=54, which is smaller than 56 - confirming 7 and 8 really is the best.",
      ], answer: "56" },
      { q: "Three positive integers sum to 30. What is the greatest possible product, and which combination of three integers achieves it?", steps: [
        "The equal-split rule says the product is maximised when the three numbers are as equal as possible.",
        "30 ÷ 3 = 10 exactly, so the equal split is 10, 10, 10.",
        "Product = 10 × 10 × 10 = 1000.",
        "Check against a slightly unequal split: 9 + 10 + 11 = 30, product = 9 × 10 × 11 = 990 < 1000. ✓",
      ], answer: "1000 (three equal parts of 10)" },
    ],
      tryit: { q: "Two positive integers add to 13. What's the greatest possible product?", answer: "42. 13÷2=6.5 isn't a whole number, so use the closest integers either side, 6 and 7: 6×7=42 (compare with 5×8=40, which is smaller, confirming 6 and 7 is best)." } },
    { h: "2. Fixed perimeter, maximise the area", body: [
      "A rectangle's perimeter is 2×(length+width). If the perimeter is fixed, then length+width is also fixed (it's just half the perimeter) - which means finding the maximum area is exactly the fixed-sum, maximise-the-product problem from Section 1, just with length and width playing the roles of the two numbers. Check this with a perimeter of 28, so length+width=14: 7+7=14, area 7×7=49. 6+8=14, area 6×8=48. 5+9=14, area 5×9=45. 3+11=14, area 3×11=33. 1+13=14, area 1×13=13. Exactly the same pattern as before: the closer the two sides are to equal, the bigger the area.",
      "This isn't a coincidence needing a separate proof - it's literally the same algebra as Section 1, with length+width (=14 here) playing the role of the fixed sum, and length and width playing the role of the two numbers. Using the same idea as Section 1's d - the distance each side has moved away from the equal split, now 7 either way - write length as 7+d and width as 7-d; these still add to 14 for any d, by the identical cancellation shown in Section 1. Expanding exactly as before:\n(7+d)(7-d) =\n49 - 7d + 7d - d² =\n49 - d².\nThis is largest when d=0, i.e. when length=width and the rectangle is a square - for the same reason as Section 1: d² can never be negative, so subtracting it can never increase the result.",
      "So for a fixed perimeter, halve it to get length+width, then split that as evenly as possible - a square (or the closest integer rectangle to a square) always wins.",
      "Don't halve the perimeter twice. The perimeter is 2(length+width), so length+width is HALF the perimeter, not a quarter. A common slip is dividing by 4, which would only be correct for finding a single side length of an actual square, not the length+width sum.",
    ], examples: [
      { q: "A rectangle has perimeter 28. What integer side lengths give maximum area?", steps: [
        "Halve the perimeter to get length+width: 28÷2=14.",
        "By the equal-split rule from Section 1, this sum is maximised as a product when split evenly: 14÷2=7 and 7.",
        "Area =\n7×7 =\n49.",
      ], answer: "49 (sides 7 and 7)" },
      { q: "A rectangle has perimeter 50. What integer side lengths give the maximum area, and what is it?", steps: [
        "Halve the perimeter: 50÷2=25.",
        "25 is odd, so it can't split into two equal integers - use the closest whole numbers either side: 12 and 13.",
        "Check they add to 25: 12+13=25. Correct.",
        "Area =\n12×13 =\n156.",
        "Confirm this beats the next-closest split: 11+14=25, so:\narea =\n11×14 =\n154, which is smaller - so 12 and 13 is best.",
      ], answer: "156 (sides 12 and 13)" },
      { q: "A farmer has 100m of fencing to enclose a rectangular field. What is the maximum possible area, and what dimensions achieve it?", steps: [
        "For a fully-fenced rectangle, halve the perimeter to find length+width: 100 ÷ 2 = 50.",
        "By the equal-split rule, the maximum area comes from splitting 50 as evenly as possible: 50 ÷ 2 = 25 and 25 (a square).",
        "Maximum area = 25 × 25 = 625 m².",
        "Check an unequal split: 20 + 30 = 50, area = 20 × 30 = 600 m² < 625 m². ✓",
      ], answer: "625 m² (a 25m × 25m square)" },
    ],
      tryit: { q: "A rectangle has perimeter 22. What integer side lengths give the maximum area?", answer: "30 (sides 5 and 6). Half the perimeter is 22÷2=11, which is odd, so the closest integer split is 5 and 6 (5+6=11): 5×6=30, which beats 4×7=28." } },
    { h: "3. Optimisation with a real-world constraint", body: [
      "Every rule so far assumed all sides need building material (fencing, wall, perimeter). Real problems often break that assumption - for example, a rectangular pen built against an existing wall doesn't need fencing along the side that touches the wall. That changes the relationship between the fixed amount of material and the sides, so the make-it-a-square rule can no longer be assumed to still apply - it has to be checked from scratch.",
      "Label the side parallel to the wall (and opposite it) as the length, l, and the two sides running from the wall out to meet it as the width, w. Only 3 sides need fencing: two widths and one length, so the fencing formula is l+2w = (total fencing), not 2(l+w) = (total fencing) as it would be for a fully-fenced rectangle. Because w now appears twice in the formula but l only once, the equal-is-best rule from Sections 1 and 2 - which relied on both sides mattering equally - no longer points to l=w.",
      "With one variable's formula changed, the safest approach at this level is the same table method used in Section 1: fix the total fencing, express l in terms of w, then compute the area for values of w close to a sensible middle guess and see which gives the biggest number.",
    ], examples: [
      { q: "40m of fencing is used to build a rectangular pen against an existing wall (the wall forms one side, so no fencing is needed there). What integer width and length maximise the area, and how does this compare with using the same 40m of fencing with no wall at all?", steps: [
        "No-wall case first, for comparison: all four sides need fencing, so:\nlength+width =\n40÷2 =\n20. By the equal-split rule the best is 10+10, giving area 10×10=100.",
        "Wall case: only 2 widths and 1 length need fencing, so:\nl + 2w =\n40, which rearranges to\nl =\n40 - 2w.",
        "Area =\nl × w =\n(40-2w) × w. Try w=10 (the value that worked before):\nl =\n40-20 =\n20,\narea =\n20×10 =\n200.",
        "Test whether moving away from w=10 does better or worse, as in Section 1's table: w=9 gives l=22, area=198. w=11 gives l=18, area=198. w=8 gives l=24, area=192. w=12 gives l=16, area=192.",
        "The areas rise to a peak at w=10 and fall away on both sides, so w=10, l=20 is the maximum - but notice l=20 is DOUBLE w=10, not equal to it, unlike the no-wall case.",
        "Compare the two results: with the wall, the maximum area is 200 m², exactly double the no-wall maximum of 100 m², using the identical 40m of fencing - because the wall provides one side for free, and the optimal shape shifts away from a square towards a rectangle twice as long as it is wide.",
      ], answer: "200 m² (width 10m, length 20m) - double the no-wall maximum of 100 m², with the optimal shape no longer a square because only 3 sides need fencing." },
      { q: "A gardener has 24m of fencing to build a rectangular enclosure against a wall. The wall provides one long side, so only the opposite long side and the two short sides need fencing. What dimensions maximise the area?", steps: [
        "Let the width (the side perpendicular to the wall) be w metres. Two widths and one length use all the fencing: l + 2w = 24, so l = 24 - 2w.",
        "Area A = l × w = (24 - 2w) × w = 24w - 2w².",
        "Test integer values of w: w=5 gives A=70; w=6 gives A=72; w=7 gives A=70.",
        "The area peaks at w=6, l=12. Note that l = 2w (twice the width), following the same wall-enclosure rule as the earlier example.",
      ], answer: "72 m² (width 6m, length 12m)" },
      { q: "A farmer has 120m of fencing to build a rectangular pen against a barn wall. He installs 2 internal fences parallel to the width, dividing the pen into 3 equal sections. The wall provides one long side. Express the area in terms of w (the width) and find the width that maximises the area.", steps: [
        "Fencing used: 1 long side (l) opposite the wall, 2 outer short sides (2w), and 2 internal dividers (2w) = l + 4w = 120, so l = 120 - 4w.",
        "Area A = l × w = (120 - 4w) × w = 120w - 4w².",
        "Test integer values near the peak: w=15 gives A = (120-60)×15 = 60×15 = 900; w=14 gives A = 64×14 = 896; w=16 gives A = 56×16 = 896.",
        "The area peaks at w=15, l=60. Internal dividers shift the optimal width down to l = 4w.",
      ], answer: "900 m² (width 15m, length 60m, with l = 4w because 4 widths of fencing are required)" },
    ],
      tryit: { q: "60m of fencing builds a rectangular pen against a wall (no fencing needed on the wall side). What width and length maximise the area?", answer: "450 m² (width 15m, length 30m - the length is double the width, following the same pattern as the worked example: l+2w=60, and testing values near w=15 confirms it's the peak: w=14 gives area 448, w=16 gives area 448, both less than 450)." } },
  ],
};

INTERMEDIATE_LESSONS.proofTechniques = {
  title: "Proof Techniques: what actually counts as proof",
  minutes: 15,
  order: 19,
  prereq: ["algebraicProof"],
  intro: "Not every argument that LOOKS convincing is actually a valid proof. This lesson covers the most common ways a proof attempt goes wrong - checking only one example, circular reasoning, and confusing 'a solution exists' with 'this is the only solution' - plus what a genuinely watertight proof looks like.",
  sections: [
    { h: "1. One example is never enough", body: [
      "Showing a claim works for n=5 proves nothing about n=6, or any other value.",
      "Here's how convincing - and wrong - a one-example proof can look. Suppose someone claims 'every prime number is odd', and checks it: 3 is odd and prime, 5 is odd and prime, 7 is odd and prime - three examples in a row, all fitting the pattern. It looks proven. But the claim is false, and the worked example below shows exactly where the one-example approach breaks down.",
      "A real proof needs an argument that covers every possible case at once - usually through algebra (see Algebraic Proof) or through a general logical argument that doesn't depend on which specific number you happen to have tried.",
      "The number of examples doesn't matter - checking 3, 30 or 300 cases and finding they all fit is still not a proof, since the very next untested case could be the exception. The only way to be sure is to argue about all cases in one go, or to test literally every case if there are only finitely many (and even then, you must genuinely check every single one, not just most of them).",
    ], examples: [
      { q: "Someone claims 'every prime number is odd' and checks n=3, 5, 7 to 'prove' it. Show this proof attempt is wrong.", steps: [
        "Check the claim against the examples given: 3 is prime and odd. 5 is prime and odd. 7 is prime and odd. All three fit, which is why the argument looks convincing.",
        "But three examples only cover three numbers, not all prime numbers - the claim 'every prime is odd' is about every single one of infinitely many primes, so the checked cases are a tiny fraction, and none of them can rule out an exception elsewhere.",
        "Test the smallest prime number of all, which the example happened to skip: 2.",
        "2 is prime (its only factors are 1 and 2), but 2 is even, not odd.",
        "So the claim is false, and the reason the proof missed it is precisely because it only ever checked a few chosen examples instead of arguing about every prime.",
      ], answer: "False - 2 is a prime number that is even, disproving the claim. The one-example check missed it because checking a few cases can never rule out an exception that wasn't tried." },
      { q: "A student claims the formula n² + n + 41 always produces a prime number, and checks it for n = 0, 1, 2, 3 and 4, getting 41, 43, 47, 53 and 61 - all prime. Is this sufficient proof? Find the smallest n for which the formula fails.", steps: [
        "The student has checked 5 values and found 5 primes, which looks impressive - but this still only covers 5 cases, not all infinitely many possible values of n.",
        "The reasoning 'I checked five cases and they all worked' is exactly the one-example fallacy scaled up: more examples still only prove those specific cases, never the general claim.",
        "To find a counterexample, try n = 40: 40² + 40 + 41 = 1600 + 40 + 41 = 1681. Is 1681 prime?",
        "Check: 41² = 1681. So 1681 = 41 × 41, which is not prime.",
        "The formula fails at n = 40, giving 1681 = 41², which has 41 as a factor.",
      ], answer: "No - checking 5 cases is not a proof. The formula fails at n = 40, giving 41² = 1681, which is not prime." },
      { q: "A student checks that 1 + 3 + 5 + ... + (2n − 1) = n² holds for n = 1, 2 and 3 (giving 1, 4 and 9 respectively), then concludes 'it must always be true because I verified three consecutive cases.' Explain the error and describe what a valid proof would require.", steps: [
        "The formula does hold for n = 1: the sum is just 1, and 1² = 1. For n = 2: 1 + 3 = 4 = 2². For n = 3: 1 + 3 + 5 = 9 = 3². All three cases are correct.",
        "However, verifying 3 specific cases only proves the formula is true for those 3 values of n - it says nothing about n = 4, 5, or any larger value.",
        "A valid proof must cover ALL positive integers n in a single argument, not just a sample. One valid approach is to use algebra: assume the formula holds for n = k and deduce it must then hold for n = k + 1 as well, which together with the base case n = 1 covers every n.",
        "The error is concluding 'always true' from 'sometimes true' - the number of cases checked is irrelevant; only an all-encompassing argument closes the gap.",
      ], answer: "The three-case check is not a proof - it only confirms the formula for three specific values. A valid proof requires an argument covering every n, such as induction or a general algebraic identity." },
    ],
      tryit: { q: "A claim states 'every multiple of 6 is even', and someone 'proves' it by checking 6, 12, 18, 24 - all even. Explain in one or two sentences why this checking process is not a valid general proof, even though the claim happens to be true.", answer: "Checking four examples only tells you about those four multiples, not all infinitely many - even though this particular claim is true, checking specific cases can never rule out a future exception. A proper proof notes that any multiple of 6 can be written as 6k = 2×(3k), which is 2 times a whole number for every integer k, so it's even for every single case at once, not just the four tested." } },
    { h: "2. Circular reasoning", body: [
      "A circular argument - the mistake this section is named after, 'circular reasoning' - secretly assumes the very thing it's trying to prove, somewhere in the middle of the proof.",
      "It always sounds plausible on a first read, which is exactly what makes it dangerous - the fault is usually hidden in the middle of a chain of steps that all sound reasonable on their own.",
      "To spot one, work through the argument step by step and ask, for every single step: does this step rely only on things already established (definitions, earlier proven facts, or the given information), or does it quietly lean on the very conclusion we're trying to reach? The moment a step needs the conclusion to already be true, the argument has gone circular.",
      "Circular arguments are especially easy to write by accident when a claim feels obviously true - it's tempting to use the claim itself as a stepping stone without noticing, because it doesn't feel like an assumption, it feels like common sense.",
    ], examples: [
      { q: "Spot the flaw in this argument: 'Prove that the angles of a triangle add up to 180°. We know a straight line is 180°. Since the three angles of a triangle can be rearranged to form a straight line, they must add up to 180°, because a triangle's angles always add up to 180°.'", steps: [
        "Read the argument looking for what it is trying to establish: that the three angles of a triangle sum to 180°.",
        "Now check the justification given for the key step (that the three angles can be rearranged to form a straight line): the argument justifies this by saying 'because a triangle's angles always add up to 180°'.",
        "That justification is exactly the statement the argument set out to prove in the first place - the conclusion has been used as its own reason.",
        "This is circular: strip out the phrase that sounds like a justification, and there is no actual reasoning left connecting 'rearranged into a straight line' to '180°' other than assuming the answer.",
        "A genuine proof of this fact instead uses parallel lines and alternate angles to show the rearrangement is forced by geometry, never assuming the 180° total along the way.",
      ], answer: "Circular - the argument justifies 'the angles form a straight line' by re-asserting 'a triangle's angles add up to 180°', which is the very thing being proved. A valid proof must reach 180° using facts established beforehand, such as angle facts on parallel lines, not the conclusion itself." },
      { q: "Spot the circular step in this argument: 'We want to prove that √2 is irrational. Suppose √2 = p/q in lowest terms. Then 2 = p²/q², so p² = 2q², meaning p² is even, so p is even. Write p = 2k, giving 4k² = 2q², so q² = 2k², meaning q is also even. But p and q were both even, so the fraction p/q was not in lowest terms after all, which is the contradiction we needed. So √2 is irrational.' Is this circular? If not, what technique is being used?", steps: [
        "Work through each step and check whether any step uses the conclusion (that √2 is irrational) as its own justification.",
        "Step 1 assumes the opposite of the conclusion: that √2 IS rational. Step 2 deduces algebraic consequences of that assumption. Step 3 finds a contradiction with a known fact (that p/q was in lowest terms). Step 4 concludes the original assumption must be false.",
        "No step relies on the conclusion 'irrational' to justify any other step - the contradiction comes from a separately established fact (the definition of lowest terms) not from the thing being proved.",
        "This argument is NOT circular. The technique is proof by contradiction: assume the opposite of the claim, derive a logical impossibility, and conclude the original claim must therefore be true.",
      ], answer: "Not circular. This is a valid proof by contradiction: the argument assumes √2 is rational and derives a contradiction, without using 'irrational' as a justification for any step." },
      { q: "Spot the circular step: 'We want to show that a² + b² = c² for all right-angled triangles. Since the triangle is right-angled, by the theorem governing right-angled triangles, a² + b² = c². Therefore the Pythagorean theorem is proved.'", steps: [
        "Identify what is being proved: that a² + b² = c² holds for right-angled triangles.",
        "Check the key justification: the argument uses 'the theorem governing right-angled triangles' as the reason for the key step.",
        "The theorem governing right-angled triangles IS the Pythagorean theorem - that a² + b² = c². The argument is using the Pythagorean theorem to prove the Pythagorean theorem.",
        "This is purely circular: the conclusion has been silently relabelled as 'the theorem governing right-angled triangles' and used as its own proof.",
        "A genuine proof of the Pythagorean theorem must build up from more basic geometric facts - area of squares, rearranging triangles, or similar - without invoking the result itself.",
      ], answer: "Circular - 'the theorem governing right-angled triangles' is just a disguised way of asserting a² + b² = c², which is what the argument was supposed to be proving in the first place." },
    ],
      tryit: { q: "Spot the circular step: 'Every even number greater than 2 can be written as the sum of two primes, because every even number greater than 2 is a sum of two primes.'", answer: "Circular - the second half of the sentence simply restates the claim itself as its own justification, rather than giving an independent reason. (This particular claim, Goldbach's Conjecture, is actually still unproven, which is exactly why no one is allowed to just assert it as a 'because'.)" } },
    { h: "3. Existence vs uniqueness", body: [
      "Two different questions get mixed up more often than you'd think: 'DOES a solution exist?' (existence) and 'Is this THE ONLY solution, or the best one?' (uniqueness). Existence asks whether at least one thing satisfying some condition can be found at all. Uniqueness asks whether there is exactly one such thing - or, when the condition is 'the biggest/best', whether exactly one arrangement reaches that top value, with nothing else tying or beating it.",
      "Finding ONE arrangement that gives a large value proves existence - it shows that value is achievable. It says nothing about uniqueness or maximality: whether that's the ONLY good arrangement, or the BEST one, needs a separate, further argument.",
      "This is exactly the trap the optimisation examples avoided by checking neighbouring splits every time. Finding that one split of a fixed sum gives a big product only proves existence for that value - it says nothing about whether some other split does even better (or ties it), unless every other option has also been ruled out.",
      "So 'a solution exists' and 'this is the best, or the only, solution' are two separate claims, and both need proving separately. Existence needs just one example. Showing something is the maximum - or the unique best answer - needs either a check of every alternative, or a general argument (like the difference-of-squares argument in the Optimisation lesson) that rules all of them out at once.",
      "Watch for the phrase 'I found a value that works, so it must be the best' - finding a value only ever establishes existence. It says nothing about uniqueness or optimality, and the gap between those claims is exactly where invalid proofs hide.",
    ], examples: [
      { q: "Someone claims: 'For two positive integers adding to 20, the greatest possible product is 96, because 8×12=96 is a large product and I can't think of a bigger split.' Show why this reasoning is flawed, without redoing the full proof.", steps: [
        "Identify the claim actually being made: not just that 96 is achievable (true - 8+12=20 and 8×12=96), but that 96 is the greatest possible product.",
        "'I can't think of a bigger one' is not a check of every other split - it's just a report of which splits were or weren't considered.",
        "Test a split the claim didn't consider: 10+10=20, and 10×10=100.",
        "100 is bigger than 96, so the claim that 96 is the maximum is false - only the weaker claim, that 96 is achievable, was actually true.",
      ], answer: "False - 10×10=100 beats 96, so 96 is only a possible product, not the maximum. Finding one large value never proves it's the biggest without checking that nothing else beats it." },
      { q: "A student finds that x = 3 satisfies x² + x − 12 = 0, and writes: 'I have found the solution, so x = 3.' Identify the error, and find all solutions.", steps: [
        "Finding one value of x that works proves EXISTENCE: there is at least one solution, and x = 3 is one of them.",
        "But the claim 'I have found THE solution' implies UNIQUENESS: that 3 is the only solution. Existence does not establish uniqueness.",
        "To find all solutions, factorise: x² + x − 12 = (x + 4)(x − 3) = 0.",
        "So x + 4 = 0 or x − 3 = 0, giving x = −4 or x = 3.",
        "There are two solutions, so the unique-solution claim is false. Existence was proved; uniqueness had to be checked separately.",
      ], answer: "Two solutions: x = 3 and x = −4. Finding x = 3 only proves existence; uniqueness requires checking (by factorising) that no other solution exists." },
      { q: "A student says: 'The rectangle with perimeter 40 and sides 7cm and 13cm has area 91cm². Therefore 91cm² is the maximum area achievable with a perimeter of 40.' Identify the error and find the true maximum area.", steps: [
        "Check the given rectangle: perimeter = 2(7 + 13) = 2 × 20 = 40cm. ✓ Area = 7 × 13 = 91cm².",
        "The student found one specific area (91cm²) and named it the maximum without comparing it to any other rectangle. This proves existence of 91cm², not optimality.",
        "Finding the true maximum: with perimeter 40, the half-perimeter is 20, so length + width = 20. The equal-split rule gives the maximum area when length = width = 10.",
        "Maximum area = 10 × 10 = 100cm², which exceeds 91cm².",
        "So 91cm² is an achievable area but not the maximum - only a separate argument (or exhaustive check) can establish optimality.",
      ], answer: "The true maximum area is 100cm² (a 10cm × 10cm square). The 91cm² rectangle shows that value is achievable (existence), but not that it is the best (optimality)." },
    ],
      tryit: { q: "A rectangle has perimeter 24. Someone says 'a 4 by 8 rectangle has area 32, so 32 must be the maximum area.' Is this reasoning valid? Find the actual maximum to check.", answer: "No - checking one rectangle only shows 32 is achievable, not that it's the biggest. Half the perimeter is 24÷2=12, so the equal split 6 and 6 gives area:\n6×6 =\n36,\nwhich beats 32. The maximum is 36, not 32." } },
    { h: "4. Counterexamples", body: [
      "To disprove a claim that something is ALWAYS true, you only need ONE counterexample - a single case where it fails.",
      "This is the mirror image of Section 1's lesson: one example is never enough to prove a general claim, but one example is always enough to disprove one, because 'always true' is broken by even a single failure, however rare.",
      "This is much easier than proving something always holds, which needs a fully general argument covering every case - finding a counterexample only needs you to find one single failing case.",
      "The practical approach is to test small cases first, in order, since counterexamples to well-known nearly-true patterns often show up quickly, as the worked example below demonstrates.",
      "A counterexample must satisfy every condition in the original claim. If the claim is about positive integers, your counterexample must be a positive integer too - finding a failure using a negative number or a fraction doesn't count.",
    ], examples: [
      { q: "Disprove the claim 'n² + n + 1 is always prime for positive integers n' by finding the smallest counterexample.", steps: [
        "n=1: 1+1+1=3, prime.",
        "n=2: 4+2+1=7, prime.",
        "n=3: 9+3+1=13, prime.",
        "n=4:\n16+4+1 =\n21 =\n3×7, NOT prime.",
      ], answer: "n=4 disproves the claim, since 21 is not prime." },
      { q: "Disprove the claim 'the sum of any two prime numbers is always even' by finding a counterexample.", steps: [
        "The claim is that p + q is always even whenever p and q are both prime.",
        "Test the smallest primes: 2 and 3 are both prime.",
        "2 + 3 = 5, which is odd, not even.",
        "This one pair of primes gives a sum that is not even, so the claim fails.",
        "The counterexample is p = 2, q = 3: both prime, sum = 5, which is odd.",
      ], answer: "2 + 3 = 5 is odd. Since 2 and 3 are both prime and their sum is not even, this disproves the claim." },
      { q: "Disprove 'n² − n + 11 is always prime for positive integers n' by finding the smallest counterexample.", steps: [
        "Test n = 1: 1 − 1 + 11 = 11. Prime.",
        "Test n = 2: 4 − 2 + 11 = 13. Prime.",
        "Test n = 3: 9 − 3 + 11 = 17. Prime.",
        "Notice the pattern: 11 itself appears as a factor when n = 11. Test n = 11: 121 − 11 + 11 = 121 = 11². Not prime (11² = 11 × 11).",
        "But is there an even smaller counterexample? Check n = 10: 100 − 10 + 11 = 101. Is 101 prime? Test divisors up to 10 (√101 < 11): 101 ÷ 2, 3, 5, 7 are all non-integer. So 101 is prime.",
        "Therefore n = 11 is the smallest counterexample.",
      ], answer: "n = 11: 121 − 11 + 11 = 121 = 11², which is not prime. This disproves the claim." },
    ],
      tryit: { q: "Disprove the claim 'all odd numbers greater than 1 are prime' by finding the smallest counterexample.", answer: "9. Check in order: 3 is prime, 5 is prime, 7 is prime, but 9 = 3×3, which is not prime since it has a factor other than 1 and itself. So 9 is the smallest counterexample." } },
  ],
};

INTERMEDIATE_LESSONS.speedAndRelativeMotion = {
  title: "Speed & Relative Motion",
  minutes: 17,
  order: 20,
  prereq: [{ module: "junior", key: "multiRate" }, "algebraicManipulation"],
  intro: "Speed = distance ÷ time is the foundation, but the harder questions involve TWO moving objects at once - chasing each other, or moving toward each other. The key idea both times is the same: combine the two objects' separate speeds into one single number describing how fast the gap between them is changing. That combined number gets two different names depending on the situation - the closing speed when the two objects move toward each other (Section 2), and the relative speed when one is chasing the other (Section 3). Both sections build up to those names from the concrete numbers first, so don't worry about memorising the terms yet.",
  sections: [
    { h: "1. The basic formula, rearranged three ways", body: [
      "Speed = distance ÷ time. This one formula secretly contains three formulas, depending on which quantity is unknown - and confusing which rearrangement to use is one of the most common exam mistakes.",
      "Check this with real numbers first. A car travels 100 miles in 2 hours, so its speed is 100÷2=50mph. Now flip the question round: if you're told the car travels at 50mph for 2 hours, how far does it go? Common sense says:\ndistance =\nspeed × time =\n50×2 =\n100 miles, which matches. And if you're told it travelled 100 miles at 50mph, how long did it take?\ntime =\ndistance ÷ speed =\n100÷50 =\n2 hours, matches again. All three versions describe the exact same underlying relationship, just rearranged to solve for whichever quantity is missing.",
      "This works because speed×time=distance is just speed=distance÷time with both sides multiplied by time - the same kind of equation rearranging covered in algebraicManipulation: doing the same operation to both sides keeps the equation balanced, so rearranging like this never changes what it means, only which letter it's solved for.",
      "A quick way to keep all three straight: distance is always on its own (distance=speed×time, or speed=distance÷time, or time=distance÷speed) - distance never gets divided BY something else, it only gets divided INTO something else, or multiplied out.",
      "The most common slip is dividing the wrong way round, e.g. writing time=speed÷distance. If a rearrangement gives a 'time' that's smaller for a longer distance, or a 'speed' that increases as time increases, that's the signal something's flipped.",
    ], examples: [
      { q: "A cyclist travels 45km in 3 hours at a constant speed. (a) Find the speed. (b) Using that speed, find how far she'd travel in 5 hours. (c) Using that speed, find how long it would take her to travel 60km.", steps: [
        "(a) Speed =\ndistance÷time =\n45÷3 =\n15km/h.",
        "(b) Distance =\nspeed×time =\n15×5 =\n75km.",
        "(c) Time =\ndistance÷speed =\n60÷15 =\n4 hours.",
        "Sanity check each answer against common sense: going for longer (5h vs 3h) at the same speed should cover more ground (75km > 45km) - correct. Covering a bit more distance (60km vs 45km) at the same speed should take a bit longer (4h > 3h) - correct.",
      ], answer: "(a) 15km/h (b) 75km (c) 4 hours" },
      { q: "A car's odometer reads 24,500km at 09:00 and 24,860km at 13:30. Find the car's average speed, and calculate how far it would travel in 6 hours at that speed.", steps: [
        "Time elapsed: 13:30 minus 09:00 = 4 hours 30 minutes = 4.5 hours.",
        "Distance covered: 24,860 − 24,500 = 360km.",
        "Average speed = distance ÷ time = 360 ÷ 4.5 = 80km/h.",
        "Distance in 6 hours = speed × time = 80 × 6 = 480km.",
      ], answer: "80km/h; it would travel 480km in 6 hours." },
      { q: "A hiker walks at 4km/h for t hours, then at 6km/h for a further t hours. The total distance covered is 30km. Find t and the total time taken.", steps: [
        "Distance in the first stage: 4 × t = 4t km.",
        "Distance in the second stage: 6 × t = 6t km.",
        "Total distance: 4t + 6t = 10t = 30, so t = 3 hours.",
        "Total time = t + t = 2t = 6 hours.",
        "Check: 4 × 3 + 6 × 3 = 12 + 18 = 30km. ✓",
      ], answer: "t = 3 hours; total time taken = 6 hours." },
    ],
      tryit: { q: "A train travels at 80km/h for 3.5 hours. How far does it travel, and how long would it take to cover 200km at the same speed?", answer: "280km, and 2.5 hours to cover 200km.\nDistance =\nspeed×time =\n80×3.5 =\n280;\ntime =\ndistance÷speed =\n200÷80 =\n2.5." } },
    { h: "2. Moving toward each other: add the speeds", body: [
      "Picture two trains 300km apart, travelling toward each other, one at 60km/h and the other at 90km/h. In the first hour, the 60km/h train covers 60km toward the other, and the 90km/h train covers 90km toward the first. Together, the gap between them has shrunk by 60+90=150km in that one hour - even though neither train travelled 150km itself, the distance between them dropped by that much, because both trains' movement works to close the same gap.",
      "This works for any two speeds moving toward each other: in one hour, object A eats up a distance equal to A's speed worth of the gap, and object B eats up a distance equal to B's speed worth of the same gap, from the other end. Since both are shrinking the same single gap simultaneously, the total shrink per hour is simply their speeds added together - this combined value is called the closing speed.",
      "Once you have the closing speed, treat the whole problem as one object closing a single gap: time to meet = (starting distance) ÷ (sum of the two speeds).",
      "Don't average the two speeds - averaging (75km/h here) would be the speed of a single object needing to cover the whole 300km alone, not the combined rate at which two objects shrink the gap between them. Averaging always under-counts here, since it ignores that both objects are moving at once.",
    ], examples: [
      { q: "Two trains, 300km apart, travel toward each other at 60km/h and 90km/h. How long until they meet?", steps: [
        "Combined closing speed =\n60+90 =\n150 km/h (the gap shrinks by 150km every hour, as shown above).",
        "Time =\ndistance ÷ closing speed =\n300 ÷ 150 =\n2 hours.",
      ], answer: "2 hours" },
      { q: "Two friends start 96km apart and walk toward each other, meeting after 2.4 hours. One walks at 15km/h. How fast does the other walk?", steps: [
        "Together, they must close the whole 96km gap in 2.4 hours, so:\ntheir combined closing speed =\n96÷2.4 =\n40km/h.",
        "The closing speed is the SUM of both walking speeds, so: 15 + (other speed) = 40.",
        "Other speed =\n40 - 15 =\n25km/h.",
        "Check: combined speed 15+25=40km/h, and 40×2.4=96km, matching the original gap - correct.",
      ], answer: "25km/h" },
      { q: "Two boats leave ports A and B simultaneously, sailing toward each other. Boat A travels at 15km/h and boat B at 10km/h. They meet after 2 hours. How wide is the lake, and how far from port A do they meet?", steps: [
        "Combined closing speed = 15 + 10 = 25km/h.",
        "Width of the lake = closing speed × time = 25 × 2 = 50km.",
        "Boat A's position at meeting: distance = speed × time = 15 × 2 = 30km from port A.",
        "Check: boat B travels 10 × 2 = 20km from port B, and 30 + 20 = 50km = width. ✓",
      ], answer: "The lake is 50km wide; they meet 30km from port A." },
    ],
      tryit: { q: "Two cyclists start 117km apart and cycle toward each other at 26km/h and 13km/h. How long until they meet?", answer: "3 hours.\nClosing speed =\n26+13 =\n39km/h,\ntime =\n117÷39 =\n3 hours." } },
    { h: "3. Chasing: subtract the speeds", body: [
      "Now picture a car at 70km/h chasing another car at 50km/h, both travelling the same direction, starting 40km apart. In one hour, the front car moves 50km further away along the road, and the chasing car moves 70km further along the same road. Since both distances are measured along the same direction, the gap between them shrinks by the difference: 70-50=20km in that hour, not by 70+50 - the front car is still moving away as it's being chased, so its own speed works against the chaser, not with it.",
      "This is the opposite situation to Section 2: there, both speeds worked together to shrink the gap, so they added. Here, one speed shrinks the gap (the chaser's) while the other speed tries to keep rebuilding it (the car in front pulling further away), so the net shrink per hour is the difference between the two speeds, called the relative speed.",
      "Time to catch up = (starting gap) ÷ (difference between the two speeds) - always subtract the slower speed from the faster one, so the answer comes out positive.",
      "If the chasing object's speed isn't actually bigger than the one it's chasing, it will never catch up at all - always check that the chaser's speed exceeds the other's before doing the subtraction, otherwise the gap grows forever instead of closing.",
    ], examples: [
      { q: "A car at 70km/h chases another at 50km/h, starting 40km behind. How long to catch up?", steps: [
        "Relative speed =\n70-50 =\n20 km/h (the gap shrinks by 20km every hour, as shown above).",
        "Time =\ngap ÷ relative speed =\n40 ÷ 20 =\n2 hours.",
      ], answer: "2 hours" },
      { q: "A cyclist 15km ahead is caught after 3 hours by a second cyclist riding at 22km/h. How fast was the first cyclist riding?", steps: [
        "The 15km gap is closed entirely in 3 hours, so:\nthe relative speed =\n15÷3 =\n5km/h.",
        "Relative speed is the DIFFERENCE between the two speeds: 22 - (first cyclist's speed) = 5.",
        "First cyclist's speed =\n22 - 5 =\n17km/h.",
        "Check: relative speed 22-17=5km/h, and 5×3=15km, matching the original gap - correct.",
      ], answer: "17km/h" },
      { q: "A rabbit runs at 12m/s. A dog starts chasing it from a position 30m behind, running at 17m/s. How long does it take the dog to catch the rabbit, and how far does the dog travel in that time?", steps: [
        "Check the chaser is faster: 17m/s > 12m/s. ✓ The gap will close.",
        "Relative speed = 17 − 12 = 5m/s (the gap closes by 5m every second).",
        "Time to catch up = gap ÷ relative speed = 30 ÷ 5 = 6 seconds.",
        "Distance the dog travels = dog's speed × time = 17 × 6 = 102m.",
        "Check: rabbit travels 12 × 6 = 72m; dog starts 30m behind and travels 102m, so dog ends up at 102 − 30 = 72m ahead of the start — same position as the rabbit. ✓",
      ], answer: "6 seconds; the dog travels 102m." },
    ],
      tryit: { q: "A cheetah runs at 100km/h chasing a gazelle running at 80km/h, starting 0.5km (500m) behind. How long until the cheetah catches up?", answer: "0.025 hours, which is 1.5 minutes (90 seconds).\nRelative speed =\n100-80 =\n20km/h;\ntime =\n0.5÷20 =\n0.025 hours =\n90 seconds." } },
    { h: "4. Average speed over a whole journey", body: [
      "Average speed is ALWAYS total distance ÷ total time - never the average of the individual speeds, since more time is spent at the slower speed.",
      "Check this with real numbers. Suppose a journey is 120 miles total, split into two equal 60-mile halves: the first half driven at 30mph, the second at 60mph. Naive instinct says average the speeds: (30+60)÷2=45mph. But actually work out the time for each half:\nfirst half takes 60÷30 =\n2 hours,\nsecond half takes 60÷60 =\n1 hour,\nso the whole 120 miles takes 2+1 =\n3 hours in total.\nTrue average speed =\ntotal distance÷total time =\n120÷3 =\n40mph, not 45mph.",
      "The naive average of the two speeds silently assumes equal time in each half, but here the equal-distance halves actually took different amounts of time (2 hours at the slow speed, only 1 hour at the fast speed) - more of the total time was spent at the slower speed, which drags the true average down below the halfway point between 30 and 60.",
      "Whenever a journey is split into stages, work out the distance covered and time taken for each stage separately, add up both totals, then divide - never average the speeds directly unless you've separately confirmed equal time (not equal distance) was spent at each speed.",
    ], examples: [
      { q: "A journey is 120 miles: the first 60 miles at 30mph, the second 60 miles at 60mph. Find the true average speed for the whole journey, and compare it with simply averaging 30 and 60.", steps: [
        "Naive average of the two speeds: (30+60)÷2 = 45mph.",
        "Time for the first half: 60÷30 = 2 hours.",
        "Time for the second half: 60÷60 = 1 hour.",
        "Total distance =\n60+60 =\n120 miles.\nTotal time =\n2+1 =\n3 hours.",
        "True average speed =\ntotal distance ÷ total time =\n120÷3 =\n40mph.",
        "40mph (true) is less than 45mph (naive average) - because twice as much time (2 hours vs 1 hour) was spent travelling at the slower 30mph, pulling the true average down toward 30 more than toward 60.",
      ], answer: "40mph (not 45mph) - more time was spent at the slower speed, so the true average sits closer to 30mph than a simple average of the two speeds would suggest." },
      { q: "A car drives from town A to town B at 40km/h and returns from B to A at 60km/h. Let the one-way distance be d km. Find the true average speed for the whole round trip, in terms of d, and verify that the answer does not depend on d.", steps: [
        "Total distance for the round trip = 2d km.",
        "Time for the outward journey: d ÷ 40 hours. Time for the return: d ÷ 60 hours.",
        "Total time = d/40 + d/60. Find a common denominator: d/40 + d/60 = 3d/120 + 2d/120 = 5d/120 = d/24.",
        "Average speed = total distance ÷ total time = 2d ÷ (d/24) = 2d × (24/d) = 48km/h.",
        "The d cancels completely, so the answer (48km/h) is the same for any distance d - only the two speeds matter, not how far apart A and B are.",
      ], answer: "48km/h (the same for any value of d, since d cancels; the harmonic mean of 40 and 60, not their arithmetic mean of 50)." },
      { q: "A cyclist completes a 3-stage race. Stage 1: 45km at 15km/h. Stage 2: 60km at 20km/h. Stage 3: 30km at 10km/h. Find the average speed for the whole race.", steps: [
        "Time for each stage: Stage 1 = 45 ÷ 15 = 3 hours. Stage 2 = 60 ÷ 20 = 3 hours. Stage 3 = 30 ÷ 10 = 3 hours.",
        "Total distance = 45 + 60 + 30 = 135km.",
        "Total time = 3 + 3 + 3 = 9 hours.",
        "Average speed = 135 ÷ 9 = 15km/h.",
        "Note: each stage takes equal time here (3 hours each), so the average speed equals the distance-weighted mean of the three speeds: (45×15 + 60×20 + 30×10) ÷ 135 = (675 + 1200 + 300) ÷ 135 = 2175 ÷ 135 = ... wait, let's just confirm: 135 ÷ 9 = 15. ✓",
      ], answer: "15km/h (total 135km in 9 hours)." },
    ],
      tryit: { q: "A cyclist rides 40km at 20km/h, then a further 40km at 40km/h. Find her average speed for the whole 80km.", answer: "80÷3 ≈ 26.7km/h (not 30km/h).\nTime for the first 40km =\n40÷20 =\n2 hours;\ntime for the second 40km =\n40÷40 =\n1 hour;\ntotal time = 3 hours;\naverage speed =\n80÷3 ≈\n26.7km/h - closer to 20km/h since twice as long was spent at that slower speed." } },
  ],
};

INTERMEDIATE_LESSONS.estimationAndBounds = {
  title: "Estimation & Bounds: how wrong could a rounded number be?",
  minutes: 15,
  order: 21,
  prereq: [{ module: "primary", key: "roundingEstimate" }, { module: "junior", key: "estimation" }],
  intro: "Every rounded measurement hides a small range of possible true values. This lesson covers finding upper and lower bounds, using them to bound a calculation, and the standard form / significant-figure skills used for quick estimation.",
  sections: [
    { h: "1. Upper and lower bounds", body: [
      "A measurement rounded to the nearest whole number could really be anywhere within 0.5 either side. Rounded to the nearest 10, the true value is within 5 either side, and so on - half of whatever unit it was rounded to.",
      "Check why half a unit either side is exactly right, not just a rule of thumb. If a length rounds to 24cm to the nearest whole cm, then 24.4cm would also round to 24 (since 24.4 is closer to 24 than to 25), but 24.6cm would round UP to 25 instead. The rounding boundary sits exactly halfway between 24 and 25, at 24.5 - so the largest value that still rounds down to 24 is anything up to (but not including) 24.5. The same logic going down means anything from 23.5 upward rounds to 24. That's why the true value can be anywhere from 23.5 up to just under 24.5: half a unit either side of the rounded value.",
      "The same idea applies to any rounding unit: rounding to the nearest 10 means the true value is within 5 either side (half of 10); rounding to the nearest 0.1 means within 0.05 either side (half of 0.1). Always take half of whatever unit the number was rounded to.",
      "Lower bound = rounded value minus half the unit. Upper bound = rounded value plus half the unit.",
      "The upper bound is technically not quite reachable (24.5cm would round UP to 25, not down to 24), but at GCSE/JMC level it's standard to still write the upper bound as exactly 24.5 - just be aware the true value is always strictly less than the upper bound, even though it can equal the lower bound.",
    ], examples: [
      { q: "A length is given as 24cm, to the nearest cm. Find the upper and lower bounds.", steps: [
        "The length was rounded to the nearest whole cm, so half a unit = 0.5cm either side.",
        "Lower bound =\n24 - 0.5 =\n23.5.",
        "Upper bound =\n24 + 0.5 =\n24.5.",
      ], answer: "23.5cm to 24.5cm" },
      { q: "A crowd size is reported as 3,400 people, to the nearest 100. Find the upper and lower bounds.", steps: [
        "The number was rounded to the nearest 100, so:\nhalf a unit here =\n100÷2 =\n50.",
        "Lower bound =\n3400 - 50 =\n3350.",
        "Upper bound =\n3400 + 50 =\n3450.",
        "Check the boundary logic: 3350 rounds up to 3400, while 3449 still rounds down to 3400, but 3450 would round up to 3500 - confirming the range 3350 to 3450.",
      ], answer: "3350 to 3450 people" },
      { q: "A speed is recorded as 72km/h, to the nearest whole km/h. A distance is recorded as 180km, to the nearest 10km. Find the upper and lower bounds of each measurement.", steps: [
        "Speed (rounded to the nearest 1km/h): half a unit = 0.5km/h. Lower bound = 72 − 0.5 = 71.5km/h. Upper bound = 72 + 0.5 = 72.5km/h.",
        "Distance (rounded to the nearest 10km): half a unit = 5km. Lower bound = 180 − 5 = 175km. Upper bound = 180 + 5 = 185km.",
        "Check the boundary logic for the speed: any speed from 71.5 up to (but not including) 72.5 rounds to 72. ✓",
      ], answer: "Speed: 71.5km/h to 72.5km/h. Distance: 175km to 185km." },
    ],
      tryit: { q: "A journey distance is given as 60km, to the nearest 10km. Find the upper and lower bounds.", answer: "55km to 65km. Rounded to the nearest 10, half a unit = 5, so:\nlower bound =\n60-5 =\n55,\nupper bound =\n60+5 =\n65." } },
    { h: "2. Bounding a calculation", body: [
      "Let a and b stand for any two rounded measurements, each already given its own upper and lower bound the way Section 1 describes. To find the maximum possible result of adding them, a+b, add their UPPER bounds. For the maximum of a subtraction, a−b, don't pair upper with upper - instead use the upper bound of a and the LOWER bound of b, since making b as small as possible makes the gap as large as possible.",
      "Check the addition rule with real numbers. Suppose a=24cm (bounds 23.5 to 24.5) and b=10cm to the nearest cm (bounds 9.5 to 10.5). The biggest possible value of a+b uses the biggest possible a AND the biggest possible b at the same time: 24.5+10.5=35. Using anything smaller for either one can only make the total smaller, never bigger - so the true maximum of a+b is exactly (upper bound of a)+(upper bound of b).",
      "Subtraction behaves differently, because a bigger b makes a-b SMALLER, not bigger. To make a-b as large as possible, you want a as big as possible (upper bound of a) AND b as small as possible (lower bound of b) at the same time - taking as much as possible while subtracting as little as possible gives the biggest possible gap. So maximum of (a-b) = (upper bound of a) - (lower bound of b).",
      "By the same logic, the SMALLEST possible value of a-b uses the smallest possible a and the largest possible b: minimum of (a-b) = (lower bound of a) - (upper bound of b).",
      "It's tempting to always pair upper with upper, but that's only correct for addition (and multiplication of positives). For subtraction (and division), the maximum mixes the upper bound of one measurement with the LOWER bound of the other - work out which combination genuinely gives the biggest number before calculating, rather than pattern-matching.",
    ], examples: [
      { q: "A plank has length a=150cm (to the nearest cm) and a piece of length b=35cm (to the nearest cm) is cut from it. Find the maximum possible length of the remaining plank, a−b.", steps: [
        "Find the bounds of a: rounded to the nearest cm, half a unit=0.5, so a is between 149.5 and 150.5.",
        "Find the bounds of b: likewise, b is between 34.5 and 35.5.",
        "To make a−b as large as possible, start with as much plank as possible (upper bound of a=150.5) and cut away as little as possible (lower bound of b=34.5) - any other combination either starts with less plank or cuts away more, both of which shrink the remainder.",
        "Maximum of a−b =\n150.5 − 34.5 =\n116.",
      ], answer: "116cm (using the upper bound of a, 150.5cm, minus the lower bound of b, 34.5cm)" },
      { q: "A rectangle has length a = 8.3m and width b = 4.7m, each measured to the nearest 0.1m. Find the maximum possible area of the rectangle.", steps: [
        "Bounds for a: half a unit = 0.05m. Lower bound = 8.25m. Upper bound = 8.35m.",
        "Bounds for b: half a unit = 0.05m. Lower bound = 4.65m. Upper bound = 4.75m.",
        "For a product a × b, the maximum is achieved using the upper bound of BOTH a and b (both being larger makes the product larger): 8.35 × 4.75.",
        "8.35 × 4.75: calculate as 8.35 × 4 + 8.35 × 0.75 = 33.4 + 6.2625 = 39.6625m².",
      ], answer: "Maximum area = 39.6625m² (using upper bounds 8.35m and 4.75m)." },
      { q: "A time t = 12s (to the nearest second) is used to calculate speed from distance d = 60m (to the nearest 5m), using speed = d ÷ t. Find the upper and lower bounds of the speed.", steps: [
        "Bounds for d (rounded to nearest 5m): half a unit = 2.5m. Lower bound = 57.5m. Upper bound = 62.5m.",
        "Bounds for t (rounded to nearest 1s): half a unit = 0.5s. Lower bound = 11.5s. Upper bound = 12.5s.",
        "Maximum speed = (upper bound of d) ÷ (lower bound of t) = 62.5 ÷ 11.5. Calculate: 62.5 ÷ 11.5 = 625 ÷ 115 = 125 ÷ 23 ≈ 5.43m/s.",
        "Minimum speed = (lower bound of d) ÷ (upper bound of t) = 57.5 ÷ 12.5 = 4.6m/s.",
        "Note: for d ÷ t, maximum speed uses the largest d and smallest t (a shorter time to cover more distance), while minimum speed uses the smallest d and largest t.",
      ], answer: "Maximum speed ≈ 5.43m/s (62.5 ÷ 11.5); minimum speed = 4.6m/s (57.5 ÷ 12.5)." },
    ],
      tryit: { q: "x=80 (to the nearest 10) and y=12 (to the nearest 1). Find the minimum possible value of x−y.", answer: "62.5. Minimum of x−y uses the smallest possible x (lower bound 75, since x is rounded to the nearest 10, half unit=5) and the largest possible y (upper bound 12.5, half unit=0.5): 75−12.5=62.5." } },
    { h: "3. Standard form and estimation", body: [
      "Standard form writes any number as a × 10ⁿ, where a is a number with only one non-zero digit before the decimal point, so 1≤a<10 (call this the digit part), and n is a whole number - positive, negative, or zero - saying how many places the decimal point has shifted (call this the power part). Standard form makes very large or small numbers easy to estimate with: round each number to 1 significant figure first, then multiply the digit parts together and add the power parts together.",
      "Check why rounding each number separately before multiplying still gives a sensible estimate. 412×58 actually equals 23,896. Rounding each factor to 1 significant figure first, 412→400 and 58→60, then multiplying the digit parts, 400×60=24,000, is very close to the real answer, and vastly easier to calculate by hand or in your head.",
      "This works well WITH standard form because standard form splits a number into a digit part (between 1 and 10) and a power part (a power of 10) - e.g. 400 = 4×10², 60=6×10¹. Multiplying two numbers in standard form means multiplying the digit parts together and adding the powers of ten:\n4×6 =\n24 (the digit parts), and\n10²×10¹ =\n10³ (the power parts), giving\n24×10³ =\n24,000, matching the estimate exactly.",
      "Rounding EACH number separately before multiplying is safe, but rounding the ANSWER at the end to the same number of significant figures as the least-precise input is what makes the estimate meaningful - don't report an estimate to more significant figures than the original rounding actually supports.",
    ], examples: [
      { q: "Estimate 412 × 58 by rounding to 1 significant figure first.", steps: [
        "412 rounds to 400 (1 significant figure). 58 rounds to 60 (1 significant figure).",
        "400 × 60 = 24,000.",
      ], answer: "≈ 24,000 (actual value is 23,896)" },
      { q: "Estimate 6,150,000 ÷ 305 by rounding to 1 significant figure and using standard form.", steps: [
        "Round each number to 1 significant figure: 6,150,000 → 6,000,000. 305 → 300.",
        "Write both in standard form: 6,000,000 = 6×10⁶. 300 = 3×10².",
        "Divide the simple digit parts: 6÷3=2. Subtract the powers of ten (since dividing subtracts indices): 10⁶÷10²=10⁴.",
        "Combine: 2×10⁴ = 20,000.",
      ], answer: "≈ 20,000 (actual value is about 20,164)" },
      { q: "Write 0.000047 and 8,300,000 in standard form. Then calculate their product, giving your answer in standard form.", steps: [
        "0.000047: the first significant digit (4) is 5 places after the decimal point. In standard form: 4.7 × 10⁻⁵.",
        "8,300,000: the first significant digit (8) is at the millions place. In standard form: 8.3 × 10⁶.",
        "Multiply the digit parts: 4.7 × 8.3 = 39.01.",
        "Multiply the power parts: 10⁻⁵ × 10⁶ = 10⁽⁻⁵⁺⁶⁾ = 10¹.",
        "Combine: 39.01 × 10¹ = 390.1. To express in standard form (one digit before the decimal): 3.901 × 10².",
      ], answer: "4.7 × 10⁻⁵ and 8.3 × 10⁶; product = 3.901 × 10² = 390.1." },
    ],
      tryit: { q: "Estimate 0.00089 × 5,200 by rounding to 1 significant figure first.", answer: "≈4.5 (actual value is about 4.628). Rounding: 0.00089→0.0009=9×10⁻⁴, 5200→5000=5×10³; multiply digit parts:\n9×5 =\n45, add powers:\n10⁻⁴×10³ =\n10⁻¹, giving\n45×10⁻¹ =\n4.5." } },
  ],
};

INTERMEDIATE_LESSONS.coordinateGeometry = {
  title: "Coordinate Geometry: lines on a grid",
  minutes: 14,
  order: 22,
  prereq: [{ module: "junior", key: "coordGeom" }, "simultaneousEquations"],
  intro: "Every straight line has a gradient (how steep it is) and an equation (y = mx + c) that describes every point on it. This lesson covers finding the gradient and midpoint between two points, writing a line's equation, and the special relationship between gradients of parallel and perpendicular lines.",
  sections: [
    { h: "1. Gradient between two points", body: [
      "A point on a grid is written as a pair of coordinates (x, y): x tells you how far across from the origin, y tells you how far up. To talk about the gradient between two DIFFERENT points, it helps to give them labels so they don't get muddled up. Call the first point's coordinates x₁ and y₁ (say 'x-one' and 'y-one'), and the second point's coordinates x₂ and y₂ ('x-two' and 'y-two'). The little subscript numbers don't mean anything mathematically - they're just labels for 'first point' and 'second point', nothing more.",
      "The gradient measures steepness: how many units up (or down) the line goes for every unit you move across. It's found from 'change in y' divided by 'change in x'. The change in y is how far you moved vertically going from the first point to the second, which is y₂ − y₁. The change in x is how far you moved horizontally, x₂ − x₁. So:\ngradient =\n(change in y) ÷ (change in x) =\n(y₂ − y₁) ÷ (x₂ − x₁).",
      "Try this on a concrete pair of points: (1, 2) and (4, 8). Label them so x₁=1, y₁=2, x₂=4, y₂=8. Change in y = y₂ − y₁ =\n8 − 2 =\n6. Change in x = x₂ − x₁ =\n4 − 1 =\n3. So the gradient =\n6 ÷ 3 =\n2 - the line climbs 2 units up for every 1 unit across.",
      "It doesn't matter which point you call 'first' and which you call 'second', as long as you're consistent - swapping them flips the sign of both the change in y and the change in x, and those two minus signs cancel out, giving the exact same gradient either way.",
    ], examples: [
      { q: "Find the gradient of the line through (1, 2) and (4, 8).", steps: [
        "Label the points: x₁=1, y₁=2, x₂=4, y₂=8.",
        "Change in y = y₂ − y₁ =\n8 − 2 =\n6.",
        "Change in x = x₂ − x₁ =\n4 − 1 =\n3.",
        "Gradient =\n6 ÷ 3 =\n2.",
      ], answer: "2" },
      { q: "Find the gradient of the line through (2, 3) and (5, −1) (a harder version with a negative, fractional result).", steps: [
        "Label the points: x₁=2, y₁=3, x₂=5, y₂=−1.",
        "Change in y = y₂ − y₁ =\n−1 − 3 =\n−4.",
        "Change in x = x₂ − x₁ =\n5 − 2 =\n3.",
        "Gradient =\n−4 ÷ 3 =\n−4/3.",
      ], answer: "−4/3" },
      { q: "Three points A(1, 2), B(3, 6) and C(7, k) are collinear (all lying on the same straight line). Find k.", steps: [
        "Find the gradient of AB first: gradient = (y₂ − y₁) ÷ (x₂ − x₁) = (6 − 2) ÷ (3 − 1) = 4 ÷ 2 = 2.",
        "Since A, B and C are collinear, the gradient of AC must also equal 2.",
        "Gradient of AC = (k − 2) ÷ (7 − 1) = (k − 2) ÷ 6 = 2.",
        "Solve for k: k − 2 = 12, so k = 14.",
        "Check by finding gradient AC directly: (14 − 2) ÷ (7 − 1) = 12 ÷ 6 = 2 = gradient of AB. ✓",
      ], answer: "k = 14" },
    ],
      tryit: { q: "Find the gradient through (0, 5) and (2, 1).", answer: "−2, since change in y = 1 − 5 = −4, change in x = 2 − 0 = 2, and −4 ÷ 2 = −2." } },
    { h: "2. Midpoint of two points", body: [
      "The midpoint is the single point sitting exactly halfway between two other points - the same distance from each. You find it by averaging the two x-coordinates to get the midpoint's x, and separately averaging the two y-coordinates to get the midpoint's y:\nmidpoint =\n((x₁+x₂)/2, (y₁+y₂)/2).",
      "Check this makes sense on a simple case first: the midpoint of (2, 3) and (8, 7). Midpoint x = (2+8)/2 =\n10/2 =\n5. Midpoint y = (3+7)/2 =\n10/2 =\n5. So the midpoint is (5, 5) - exactly halfway between x=2 and x=8, and exactly halfway between y=3 and y=7.",
      "Negative coordinates work exactly the same way - just be careful adding a negative number, since adding a negative is the same as subtracting.",
    ], examples: [
      { q: "Find the midpoint of (2, 3) and (8, 7).", steps: [
        "Midpoint x = (2+8)/2 =\n10/2 =\n5.",
        "Midpoint y = (3+7)/2 =\n10/2 =\n5.",
      ], answer: "(5, 5)" },
      { q: "Find the midpoint of (−3, 4) and (6, −9) (a harder version with negative coordinates).", steps: [
        "Midpoint x = (−3+6)/2 =\n3/2 =\n1.5.",
        "Midpoint y = (4+(−9))/2 =\n−5/2 =\n−2.5.",
      ], answer: "(1.5, −2.5)" },
      { q: "M is the midpoint of PQ. M has coordinates (4, −1) and P has coordinates (1, 5). Find the coordinates of Q.", steps: [
        "The midpoint formula gives M = ((x_P + x_Q)/2, (y_P + y_Q)/2).",
        "Using the x-coordinates: 4 = (1 + x_Q) / 2, so 1 + x_Q = 8, giving x_Q = 7.",
        "Using the y-coordinates: −1 = (5 + y_Q) / 2, so 5 + y_Q = −2, giving y_Q = −7.",
        "So Q = (7, −7). Check midpoint: x = (1+7)/2 = 4, y = (5+(−7))/2 = −1. ✓",
      ], answer: "Q = (7, −7)" },
    ],
      tryit: { q: "Find the midpoint of (7, −2) and (−1, 10).", answer: "(3, 4), since midpoint x = (7+(−1))/2 = 3 and midpoint y = (−2+10)/2 = 4." } },
    { h: "3. Equation of a line: y = mx + c", body: [
      "Every straight line (that isn't vertical) can be written in the form y = mx + c. Here m is the gradient (exactly the same idea as in section 1 - how steep the line is), and c is the y-intercept: the y-value where the line crosses the vertical axis, which is the point where x=0.",
      "If you already know the gradient m and just ONE point (x, y) that lies on the line, you can find c: substitute the gradient and the point's coordinates into y = mx + c, and the only unknown left is c, so solve for it.",
      "For example, a line has gradient 3 and passes through (2, 11). Substitute m=3, x=2, y=11 into y = mx + c:\n11 =\n3×2 + c =\n6 + c,\nso c = 11 − 6 =\n5. The line's equation is y = 3x + 5.",
    ], examples: [
      { q: "A line has gradient 3 and passes through (2, 11). Find its equation.", steps: [
        "Substitute into y = mx + c: 11 = 3(2) + c.",
        "11 =\n6 + c, so\nc =\n5.",
      ], answer: "y = 3x + 5" },
      { q: "A line has gradient −2 and passes through (−3, 7) (a harder version with negative numbers). Find its equation.", steps: [
        "Substitute into y = mx + c: 7 = −2(−3) + c.",
        "7 =\n6 + c, so\nc =\n1.",
      ], answer: "y = −2x + 1" },
      { q: "Find the equation of the straight line passing through the points (1, 5) and (3, 1).", steps: [
        "Find the gradient: m = (1 − 5) ÷ (3 − 1) = −4 ÷ 2 = −2.",
        "Substitute m = −2 and the point (1, 5) into y = mx + c: 5 = −2(1) + c.",
        "5 = −2 + c, so c = 7.",
        "Equation: y = −2x + 7. Check using (3, 1): y = −2(3) + 7 = −6 + 7 = 1. ✓",
      ], answer: "y = −2x + 7" },
    ],
      tryit: { q: "A line has gradient 1/2 and passes through (4, 1). Find its equation.", answer: "y = 0.5x − 1, since 1 = 0.5(4) + c gives 1 = 2 + c, so c = −1." } },
    { h: "4. Parallel and perpendicular lines", body: [
      "Parallel lines point in exactly the same direction and never meet, however far they're extended. Since the gradient measures direction, two lines are parallel exactly when they have the SAME gradient.",
      "Perpendicular lines meet at a right angle (90°). Their gradients are always negative reciprocals of each other. A reciprocal means 'flip the fraction upside down' (the reciprocal of 2/3 is 3/2, and the reciprocal of a whole number n is 1/n, since n is really n/1). 'Negative reciprocal' means flip it AND change its sign. The test that always works: multiply the two gradients together, and if the lines are perpendicular, the answer is always exactly −1.",
    ], examples: [
      { q: "Are the lines y = 2x + 5 and y = 2x − 3 parallel?", steps: [
        "Compare gradients: both lines have m = 2.",
        "Same gradient means same direction, so the lines are parallel (they never meet, since their different y-intercepts, 5 and −3, mean they're not the same line either).",
      ], answer: "Yes, they are parallel" },
      { q: "A line has gradient 2/3. What is the gradient of a line perpendicular to it? (a harder version, needing the flip-and-negate rule)", steps: [
        "Flip the fraction 2/3 upside down (find its reciprocal): 3/2.",
        "Negate it (change its sign) to get the negative reciprocal: −3/2.",
        "Check by multiplying the two gradients:\n(2/3) × (−3/2) =\n−1.\nCorrect.",
      ], answer: "−3/2" },
      { q: "A line is perpendicular to y = 3x − 5 and passes through (6, 2). Find its equation.", steps: [
        "The gradient of y = 3x − 5 is 3 (the coefficient of x).",
        "The perpendicular gradient is the negative reciprocal: flip 3/1 to get 1/3, then negate: gradient = −1/3.",
        "Check: 3 × (−1/3) = −1. ✓",
        "Substitute the gradient and point (6, 2) into y = mx + c: 2 = (−1/3)(6) + c = −2 + c, so c = 4.",
        "Equation: y = −x/3 + 4.",
      ], answer: "y = −x/3 + 4" },
    ],
      tryit: { q: "What gradient is perpendicular to a line with gradient −4?", answer: "1/4, since −4 = −4/1, flipping gives −1/4, and negating that gives 1/4. Check: (−4) × (1/4) = −1." } },
  ],
};

INTERMEDIATE_LESSONS.similarShapesAndScaleFactors = {
  title: "Similar Shapes: scaling lengths, areas and volumes",
  minutes: 12,
  order: 23,
  prereq: [{ module: "primary", key: "ratioBasics" }, { module: "primary", key: "shapeProperties" }],
  intro: "Two shapes are similar when one is an exact scaled-up (or down) copy of the other — same angles, same proportions, just a different size. The single most important idea in this lesson is that length, area and volume DON'T scale by the same amount when a shape is enlarged.",
  sections: [
    { h: "1. Scale factor for length", body: [
      "When two shapes are similar, every side on one shape has a matching side on the other, in the same relative position going round the shape - these are called corresponding sides. The scale factor is the number you multiply every length on the ORIGINAL shape by, to get the matching length on the NEW shape. You find it by dividing a length on the new shape by the corresponding length on the original:\nscale factor =\n(new length) ÷ (matching original length).",
      "This uses ratio: comparing two quantities by dividing one by the other, the same idea used for comparing amounts in ratio basics - here the 'amounts' happen to be two lengths instead of two quantities of something.",
      "For example, if triangle A has a side of 4cm and the similar triangle B has the matching side at 10cm, the scale factor from A to B is 10 ÷ 4 = 2.5 - every length on A gets multiplied by 2.5 to give the matching length on B. Going the other way, from B to A, would use the reciprocal instead (4 ÷ 10 = 0.4), since that direction shrinks rather than enlarges.",
    ], examples: [
      { q: "Triangle A has a side of 4cm. The similar triangle B has the matching side at 10cm. What is the scale factor from A to B?", steps: [
        "Scale factor = new length ÷ matching original length.",
        "Scale factor =\n10 ÷ 4 =\n2.5.",
      ], answer: "2.5" },
      { q: "Rectangle P has a side of 12cm. The similar rectangle Q has the matching side at 9cm (a harder version where the scale factor is a reduction). Find the scale factor from P to Q.", steps: [
        "Scale factor = matching length on Q ÷ corresponding length on P.",
        "Scale factor =\n9 ÷ 12 =\n0.75 (that is, 3/4).",
      ], answer: "0.75 (3/4)" },
      { q: "Two similar triangles have matching sides of 3cm and 4.5cm. Find the scale factor from the smaller to the larger, then find the length on the larger triangle that corresponds to a 4cm side on the smaller triangle.", steps: [
        "Scale factor k = (length on larger) ÷ (matching length on smaller) = 4.5 ÷ 3 = 1.5.",
        "Multiply the 4cm side on the smaller triangle by the scale factor: 4 × 1.5 = 6cm.",
        "Check: all other corresponding sides would also multiply by 1.5, keeping the shapes similar. ✓",
      ], answer: "Scale factor = 1.5; the corresponding side on the larger triangle is 6cm." },
    ],
      tryit: { q: "Shape A has a side of 6cm. The similar shape B has the matching side at 9cm. Find the scale factor from A to B.", answer: "1.5, since 9 ÷ 6 = 1.5." } },
    { h: "2. Area scales by the SQUARE of the scale factor", body: [
      "Area is always a length multiplied by a length (think of a rectangle: area = length × width). So if every length on a shape is multiplied by a scale factor k, the area gets multiplied by k TWICE over - once for each length involved - which means area scales by k².",
      "Check this on a simple square first. A square of side 2cm has area 2×2 = 4cm². Scale every length by k=3: the new side is 2×3 = 6cm, so the new area is 6×6 = 36cm². Compare the two areas: 36 ÷ 4 = 9, and 9 is exactly 3² - the area scale factor is the square of the length scale factor, exactly as claimed.",
      "So whenever a length scale factor k is given, the area scale factor is k², and you multiply the original area by k² to get the new area.",
    ], examples: [
      { q: "Two similar rectangles have a length scale factor of 3. The smaller rectangle has area 8cm². What is the area of the larger one?", steps: [
        "Area scale factor = k² =\n3² =\n9.",
        "New area = 8 × 9 =\n72cm².",
      ], answer: "72cm²" },
      { q: "Two similar shapes X and Y have a length scale factor from X to Y of 2/5 (a harder version where Y is smaller than X). Shape X has area 50cm². Find the area of Y.", steps: [
        "Area scale factor = k² =\n(2/5)² =\n4/25.",
        "New area = 50 × 4/25 =\n200/25 =\n8cm².",
      ], answer: "8cm²" },
      { q: "Two similar shapes have areas 48cm² and 75cm². Find the length scale factor from the smaller to the larger, and state the ratio of their perimeters.", steps: [
        "Area ratio = (larger area) ÷ (smaller area) = 75 ÷ 48 = 25/16.",
        "Length scale factor k = √(area ratio) = √(25/16) = 5/4 = 1.25.",
        "Perimeter (like any length) also scales by the same factor k = 5/4, so the perimeter ratio is 5:4.",
        "Check: if k = 5/4, area scale factor = k² = (5/4)² = 25/16. Area ratio = 25/16. ✓",
      ], answer: "Length scale factor = 5/4; perimeter ratio = 5:4." },
    ],
      tryit: { q: "Two similar shapes have a length scale factor of 5. If the smaller has area 6cm², find the larger's area.", answer: "150cm², since 5² = 25 and 6 × 25 = 150." } },
    { h: "3. Volume scales by the CUBE of the scale factor", body: [
      "Volume is a length multiplied by a length multiplied by a length (think of a box: volume = length × width × height). So scaling every length by k multiplies the volume by k three times over - volume scales by k³.",
      "Check this on a simple cube. A cube of side 1cm has volume 1×1×1 = 1cm³. Scale every length by k=2: the new side is 2cm, so the new volume is 2×2×2 = 8cm³. Compare: 8 ÷ 1 = 8, and 8 is exactly 2³ - confirming volume scales by the cube of the length scale factor.",
    ], examples: [
      { q: "Two similar solids have a length scale factor of 2. The smaller has volume 5cm³. Find the larger's volume.", steps: [
        "Volume scale factor = k³ =\n2³ =\n8.",
        "New volume = 5 × 8 =\n40cm³.",
      ], answer: "40cm³" },
      { q: "Two similar solids have a length scale factor of 3/2 (a harder version with a fractional scale factor). The smaller has volume 16cm³. Find the larger's volume.", steps: [
        "Volume scale factor = k³ =\n(3/2)³ =\n27/8.",
        "New volume = 16 × 27/8 =\n432/8 =\n54cm³.",
      ], answer: "54cm³" },
      { q: "Two similar cylinders have volumes 250cm³ and 2000cm³. Find the length scale factor from the smaller to the larger.", steps: [
        "Volume ratio = 2000 ÷ 250 = 8.",
        "Length scale factor k = ∛(volume ratio) = ∛8.",
        "Since 2³ = 8, the cube root of 8 is 2, so k = 2.",
        "Check: volume scale factor = k³ = 2³ = 8, matching the ratio 2000/250 = 8. ✓",
      ], answer: "Length scale factor = 2." },
    ],
      tryit: { q: "Two similar solids have a length scale factor of 4. The smaller has volume 2cm³. Find the larger's volume.", answer: "128cm³, since 4³ = 64 and 2 × 64 = 128." } },
    { h: "4. Working backwards from area or volume", body: [
      "Sometimes you're given an area ratio or a volume ratio and asked to find the length scale factor instead - this means undoing the squaring or cubing from the last two sections. The square root of a number is the value which, multiplied by itself, gives that number back (so undoing 'squared' means taking a square root). The cube root of a number is the value which, multiplied by itself three times, gives that number back (so undoing 'cubed' means taking a cube root).",
      "So: given an area ratio, take its square root to recover the length scale factor. Given a volume ratio, take its cube root.",
    ], examples: [
      { q: "Two similar shapes have areas 9cm² and 25cm². Find the scale factor of their lengths.", steps: [
        "Area ratio = 25/9.",
        "Length scale factor = √(25/9) =\n5/3.",
      ], answer: "5/3" },
      { q: "Two similar solids have volumes 8cm³ and 125cm³ (a harder version, working back from a volume ratio). Find the scale factor of their lengths.", steps: [
        "Volume ratio = 125/8.",
        "Length scale factor = ∛(125/8) =\n5/2 (since 5³=125 and 2³=8).",
      ], answer: "5/2" },
      { q: "Two similar cones have heights 6cm and 10cm. The larger cone has volume 750cm³. Find the volume of the smaller cone.", steps: [
        "Length scale factor from smaller to larger: k = 10 ÷ 6 = 5/3.",
        "Volume scale factor = k³ = (5/3)³ = 125/27.",
        "The larger volume is 125/27 times the smaller volume, so: 750 = (125/27) × V_small.",
        "Solve for V_small: V_small = 750 × (27/125) = 20250 ÷ 125 = 162cm³.",
        "Check: 162 × (125/27) = 162 × 125 ÷ 27 = 20250 ÷ 27 = 750cm³. ✓",
      ], answer: "162cm³" },
    ],
      tryit: { q: "Two similar shapes have areas 16cm² and 49cm². Find the scale factor of their lengths.", answer: "7/4, since √(49/16) = 7/4 (7²=49, 4²=16)." } },
  ],
};

INTERMEDIATE_LESSONS.circleTheoremsAndTangents = {
  title: "Circle Theorems: angle facts inside a circle",
  minutes: 15,
  order: 24,
  prereq: [{ module: "junior", key: "angleParallel" }, { module: "junior", key: "angleIso" }],
  intro: "Circles hide a handful of guaranteed angle facts, wherever the points happen to sit on the circumference. This lesson covers the angle in a semicircle, the angle at the centre versus the circumference, angles in the same segment, cyclic quadrilaterals, and tangent-radius facts.",
  sections: [
    { h: "1. Angle in a semicircle is 90°", body: [
      "A few words first, since they get used constantly in this lesson. The centre is the single point exactly in the middle of the circle. A radius is a straight line from the centre out to any point on the circle's edge - it's always the same length, wherever it's drawn. A diameter is a straight line that passes right through the centre, touching the circle on both sides - it's exactly twice the length of the radius. The circumference is the round boundary line of the circle itself - every point 'on the circle' means a point sitting on this boundary.",
      "Angles get named using three letters, like 'angle BAC'. The middle letter always names the corner (vertex) where the angle is actually measured - so 'angle BAC' means the angle sitting at corner A, opening out towards B on one side and C on the other.",
      "The theorem: take any triangle where one side is a diameter of the circle, and the third corner sits anywhere else on the circle's circumference. That triangle is always guaranteed to have a right angle (90°) exactly at that third corner - whichever point on the circle it happens to be.",
    ], examples: [
      { q: "AB is a diameter of a circle, and C is a point on the circle. Angle BAC = 35°. Find angle ACB and angle ABC.", steps: [
        "Angle ACB = 90° (angle in a semicircle, since AB is the diameter and C is the third corner).",
        "A triangle's angles always sum to 180°, so angle ABC =\n180 − 90 − 35 =\n55°.",
      ], answer: "ACB = 90°, ABC = 55°" },
      { q: "AB is a diameter of a circle, and C is a point on the circle. Angle ABC = 52° (a harder version with a different angle given). Find angle ACB and angle BAC.", steps: [
        "Angle ACB = 90° (angle in a semicircle).",
        "A triangle's angles sum to 180°, so angle BAC =\n180 − 90 − 52 =\n38°.",
      ], answer: "ACB = 90°, BAC = 38°" },
      { q: "AB is a diameter of a circle, and C is a point on the circle. AC = 6cm and BC = 8cm. Find the length of the diameter AB.", steps: [
        "Angle ACB = 90° (angle in a semicircle, since AB is the diameter).",
        "Triangle ACB is right-angled at C, so Pythagoras' theorem applies: AB² = AC² + BC².",
        "AB² = 6² + 8² = 36 + 64 = 100.",
        "AB = √100 = 10cm.",
      ], answer: "AB = 10cm." },
    ],
      tryit: { q: "AB is a diameter of a circle, and C is a point on the circle. Angle BAC = 61°. Find angle ABC.", answer: "29°, since angle ACB = 90° (semicircle), and 180 − 90 − 61 = 29." } },
    { h: "2. Angle at the centre is TWICE the angle at the circumference", body: [
      "An arc is just a section of the circle's circumference lying between two points on the circle. Suppose P and Q are two points on the circle, marking the ends of an arc. From a third point, you can draw lines to P and Q and measure the angle they make - this is called the angle 'standing on' (or subtended by) that arc. The third point could be the centre O, giving angle POQ, or it could be some other point R on the circumference, giving angle PRQ - both are standing on the same arc PQ, just measured from different places.",
      "The theorem: whenever a centre-angle and a circumference-angle are both standing on the SAME arc, the centre-angle is always exactly double the circumference-angle.",
    ], examples: [
      { q: "The angle at the centre of a circle standing on arc PQ is 100°. Find the angle at the circumference standing on the same arc.", steps: [
        "Centre angle = 2 × circumference angle.",
        "100 = 2 × circumference angle, so circumference angle =\n100 ÷ 2 =\n50°.",
      ], answer: "50°" },
      { q: "The angle at the circumference of a circle standing on arc PQ is 38° (a harder version, working the other way round). Find the angle at the centre standing on the same arc.", steps: [
        "Centre angle = 2 × circumference angle.",
        "Centre angle =\n2 × 38 =\n76°.",
      ], answer: "76°" },
      { q: "O is the centre of a circle. Points A, B and C lie on the circle, with C on the major arc AB. Angle AOB = (4x − 10)° and angle ACB = (x + 20)°. Find x and the size of angle AOB.", steps: [
        "The angle at the centre (AOB) is twice the angle at the circumference (ACB) standing on the same arc: 4x − 10 = 2(x + 20).",
        "Expand the right side: 4x − 10 = 2x + 40.",
        "Subtract 2x from both sides: 2x − 10 = 40, so 2x = 50, giving x = 25.",
        "Angle AOB = 4(25) − 10 = 100 − 10 = 90°.",
        "Check: angle ACB = 25 + 20 = 45° = 90 ÷ 2. ✓",
      ], answer: "x = 25; angle AOB = 90°." },
    ],
      tryit: { q: "The angle at the circumference of a circle standing on arc PQ is 47°. Find the angle at the centre standing on the same arc.", answer: "94°, since the centre angle is always double the circumference angle: 2 × 47 = 94." } },
    { h: "3. Angles in the same segment are equal", body: [
      "A chord is a straight line joining any two points on the circle - unlike a diameter, it doesn't have to pass through the centre. Drawing a chord splits the inside of the circle into two regions, and each region is called a segment (usually one bigger 'major' segment and one smaller 'minor' segment).",
      "'Angles in the same segment' means this: take a chord PQ, then pick two more points that both lie in the SAME one of the two segments, and from each of them draw lines to P and Q. The angle formed at each of those points is always equal to the angle formed at the other one - they don't need the centre at all, just both points sitting on the same side of the chord.",
    ], examples: [
      { q: "PQ is a chord of a circle. R and S are two points on the circle, both in the same segment (the same side of PQ). Angle PRQ = 40°. Find angle PSQ.", steps: [
        "Angles PRQ and PSQ both stand on chord PQ from within the same segment, so they must be equal.",
        "Angle PSQ = 40°.",
      ], answer: "40°" },
      { q: "PQ is a chord of a circle. R and S are two points in the same segment. Angle PRQ = (3x+10)° and angle PSQ = (x+50)° (a harder version using algebra). Find x and the size of the equal angles.", steps: [
        "Angles in the same segment are equal, so: 3x+10 = x+50.",
        "Subtract x from both sides and subtract 10 from both sides:\n3x+10 = x+50\n2x =\n40, so\nx =\n20.",
        "Substitute back to find the angle: 3(20)+10 =\n60+10 =\n70°. Check the other expression too: 20+50 =\n70°. Both match.",
      ], answer: "x = 20, angles = 70°" },
      { q: "PQ is a chord of a circle. R and S are in the same segment. Angle PRQ = (5y − 10)° and angle PSQ = (3y + 14)°. Find y and the size of each angle.", steps: [
        "Angles in the same segment are equal: 5y − 10 = 3y + 14.",
        "Subtract 3y from both sides: 2y − 10 = 14.",
        "Add 10 to both sides: 2y = 24, so y = 12.",
        "Angle PRQ = 5(12) − 10 = 60 − 10 = 50°.",
        "Check: angle PSQ = 3(12) + 14 = 36 + 14 = 50°. Both equal. ✓",
      ], answer: "y = 12; each angle is 50°." },
    ],
      tryit: { q: "PQ is a chord of a circle. R and S are two points in the same segment. Angle PRQ = 63°. Find angle PSQ.", answer: "63°, since angles in the same segment are always equal." } },
    { h: "4. Cyclic quadrilaterals: opposite angles sum to 180°", body: [
      "A quadrilateral is just a four-sided shape. It's called cyclic when all four of its corners lie exactly on a single circle. Labelling the corners P, Q, R, S in order round the shape, 'opposite angles' means pairs of corners that don't share a side - angle P is opposite angle R, and angle Q is opposite angle S.",
      "The theorem: in any cyclic quadrilateral, each pair of opposite angles always adds up to 180° (they're supplementary).",
    ], examples: [
      { q: "In cyclic quadrilateral PQRS, angle P = 85°. Find angle R.", steps: [
        "Opposite angles of a cyclic quadrilateral sum to 180°.",
        "Angle R =\n180 − 85 =\n95°.",
      ], answer: "95°" },
      { q: "In cyclic quadrilateral PQRS, angle Q = (2x+10)° and angle S = (3x−5)° (a harder version using algebra). Find x and both angles.", steps: [
        "Q and S are opposite angles, so they sum to 180°: (2x+10) + (3x−5) = 180.",
        "Simplify the left side:\n2x+10+3x−5 =\n5x+5,\nso 5x+5 = 180.",
        "Subtract 5 then divide by 5:\n5x =\n175, so\nx =\n35.",
        "Angle Q =\n2(35)+10 =\n80°. Angle S =\n3(35)−5 =\n100°. Check: 80+100 =\n180°.",
      ], answer: "x = 35, Q = 80°, S = 100°" },
      { q: "ABCD is a cyclic quadrilateral. Angle A = (2p)° and angle C = (p + 30)°. Find p, and state the sizes of angles A and C.", steps: [
        "Opposite angles of a cyclic quadrilateral sum to 180°: angle A + angle C = 180°.",
        "2p + (p + 30) = 180.",
        "3p + 30 = 180, so 3p = 150, giving p = 50.",
        "Angle A = 2(50) = 100°. Angle C = 50 + 30 = 80°.",
        "Check: 100 + 80 = 180. ✓",
      ], answer: "p = 50; angle A = 100°, angle C = 80°." },
    ],
      tryit: { q: "In cyclic quadrilateral PQRS, angle P = 112°. Find angle R.", answer: "68°, since 180 − 112 = 68." } },
    { h: "5. Tangent-radius: always perpendicular", body: [
      "A tangent is a straight line that touches the circle at exactly one point, without crossing into its interior. The single point where it touches is called the point of contact.",
      "Fact 1: a tangent always meets the radius drawn to its point of contact at exactly 90°.",
      "Fact 2: if you pick a point outside the circle (an external point) and draw the two possible tangent lines from it to the circle, those two tangent lines are always exactly equal in length.",
      "Because fact 1 guarantees a right angle, any triangle built from a tangent, a radius, and the line joining the centre to an external point is right-angled - which means Pythagoras' theorem (the one covered in the Pythagoras lesson) can be used directly to find a missing length in it.",
    ], examples: [
      { q: "A tangent touches a circle at point T. The radius OT is drawn, and a line from the external point A to T makes angle OTA. What is angle OTA?", steps: [
        "The tangent meets the radius at exactly 90° (fact 1).",
        "Angle OTA = 90°.",
      ], answer: "90°" },
      { q: "A circle has centre O and radius 5cm. From external point A, a tangent touches the circle at T, with AT = 12cm (a harder version combining both tangent facts with Pythagoras). Find the distance OA, and state the length of the other tangent from A, which touches the circle at S.", steps: [
        "Angle OTA = 90° (fact 1), so triangle OTA is right-angled at T, with OA as its hypotenuse.",
        "Apply Pythagoras' theorem:\nOA² =\nOT² + AT² =\n5² + 12² =\n25 + 144 =\n169.",
        "OA =\n√169 =\n13cm.",
        "By fact 2, the two tangents from the same external point A are equal in length, so AS = AT =\n12cm.",
      ], answer: "OA = 13cm, AS = 12cm" },
      { q: "From an external point P, two tangents PA and PB touch a circle with centre O. Angle APB = 40°. Find angle AOB.", steps: [
        "The tangent-radius theorem gives angle OAP = 90° (tangent PA is perpendicular to radius OA). Similarly angle OBP = 90°.",
        "In quadrilateral OAPB, all four interior angles sum to 360°.",
        "Angle AOB = 360 − angle OAP − angle OBP − angle APB = 360 − 90 − 90 − 40 = 140°.",
        "Note: this works because OAPB is a quadrilateral with two right angles at A and B, whose remaining angles (at O and P) must together make up the remaining 360 − 180 = 180°. Since angle P = 40°, angle O = 140°.",
      ], answer: "Angle AOB = 140°." },
    ],
      tryit: { q: "A circle has centre O and radius 3cm. From external point B, a tangent touches the circle at T, with BT = 4cm. Find OB.", answer: "5cm, since angle OTB = 90° gives OB² = 3² + 4² = 9 + 16 = 25, so OB = √25 = 5." } },
  ],
};

INTERMEDIATE_LESSONS.trigonometryAdvanced = {
  title: "Trigonometry: beyond right-angled triangles",
  minutes: 15,
  order: 25,
  prereq: [{ module: "junior", key: "pythagQuest" }, "similarShapesAndScaleFactors"],
  intro: "SOHCAHTOA solves right-angled triangles, but the sine rule, cosine rule and the ½ab sin C area formula extend that to ANY triangle — no right angle required. This lesson builds up from the basic ratios to all three.",
  sections: [
    { h: "1. SOHCAHTOA — right-angled triangles", body: [
      "In a right-angled triangle, once you pick one of the two non-right angles to focus on, the three sides get special names relative to that angle. The hypotenuse is the longest side, always the one opposite (directly across from) the right angle - it's easy to spot since it never touches the right angle. The opposite side is the side directly across from the angle you've chosen to focus on. The adjacent side is the side that touches your chosen angle but ISN'T the hypotenuse. (If you picked the OTHER non-right angle instead, the opposite and adjacent sides would swap - which side is 'opposite' or 'adjacent' always depends on which angle you're using.)",
      "Sin, cos and tan are just names for three particular ratios (fractions) between these sides: sin(angle) = opposite ÷ hypotenuse, cos(angle) = adjacent ÷ hypotenuse, tan(angle) = opposite ÷ adjacent. SOHCAHTOA is simply a memory aid built from the first letters of those three lines (Sin-Opposite-Hypotenuse, Cos-Adjacent-Hypotenuse, Tan-Opposite-Adjacent) - it isn't new maths, just a way to remember the three ratios above.",
      "Used forwards, if you know an angle and one side, rearrange the matching ratio to find another side. Used backwards, if you know two sides, you can find the angle: for instance if tan(angle) = 0.75, 'undo' the tan using the inverse tan function on a calculator, written tan⁻¹, so angle = tan⁻¹(0.75). The same idea works with sin⁻¹ and cos⁻¹.",
    ], examples: [
      { q: "A right-angled triangle has hypotenuse 10cm and one angle of 30°. Find the side opposite that angle.", steps: [
        "sin(angle) = opposite ÷ hypotenuse, so rearranged: opposite = hypotenuse × sin(angle).",
        "Opposite =\n10 × sin(30°) =\n10 × 0.5 =\n5cm.",
      ], answer: "5cm" },
      { q: "A right-angled triangle has an opposite side of 7cm and an adjacent side of 9cm (a harder version, finding the angle instead of a side). Find the angle between the hypotenuse and the adjacent side.", steps: [
        "tan(angle) = opposite ÷ adjacent, so:\ntan(angle) =\n7 ÷ 9 ≈\n0.778.",
        "Undo the tan using the inverse function on a calculator:\nangle =\ntan⁻¹(0.778) ≈\n37.9°.",
      ], answer: "≈37.9°" },
      { q: "A ladder of length 5m leans against a vertical wall. The foot of the ladder is 3m from the base of the wall. Find the angle the ladder makes with the ground.", steps: [
        "Label the sides relative to the angle at the ground (θ): the foot-to-wall distance (3m) is the adjacent side, and the ladder (5m) is the hypotenuse.",
        "Use cosine: cos(θ) = adjacent ÷ hypotenuse = 3 ÷ 5 = 0.6.",
        "Undo the cosine: θ = cos⁻¹(0.6) ≈ 53.1°.",
        "Check: the vertical height = √(5² − 3²) = √16 = 4m. Using sin(θ) = 4/5 = 0.8, so θ = sin⁻¹(0.8) ≈ 53.1°. ✓",
      ], answer: "≈53.1°." },
    ],
      tryit: { q: "A right-angled triangle has an adjacent side of 12cm and an angle of 25° next to it. Find the hypotenuse.", answer: "≈13.2cm, since cos(25°) = adjacent ÷ hypotenuse, so hypotenuse = 12 ÷ cos(25°) = 12 ÷ 0.906 ≈ 13.2cm." } },
    { h: "2. The sine rule: a/sin A = b/sin B = c/sin C", body: [
      "For any triangle (not just right-angled ones), label its three corners A, B and C. Then label each SIDE with the lowercase version of the letter at the corner OPPOSITE it: side a is opposite angle A, side b is opposite angle B, and side c is opposite angle C. This labelling convention is what makes the sine rule readable - without it, 'a' and 'A' would look unrelated instead of being a matching pair.",
      "The sine rule says the ratio (side) ÷ sin(its opposite angle) comes out the SAME no matter which of the three pairs you pick - a strikingly similar idea to the constant scale factor between similar shapes covered earlier: there, one constant ratio linked every pair of matching lengths; here, one constant ratio links every side to the sine of its opposite angle, within a single triangle.",
      "Use the sine rule when you know a side and its opposite angle, plus one more side or angle to complete the picture.",
    ], examples: [
      { q: "In triangle ABC, a = 8cm, angle A = 40°, angle B = 60°. Find side b.", steps: [
        "Use a/sin A = b/sin B:\n8/sin(40°) =\nb/sin(60°).",
        "Rearrange to make b the subject:\nb =\n8 × sin(60°) ÷ sin(40°) ≈\n8 × 0.866 ÷ 0.643 ≈\n10.8cm.",
      ], answer: "≈10.8cm" },
      { q: "In triangle ABC, a = 10cm, angle A = 35°, c = 14cm (a harder version, finding an angle rather than a side). Find angle C.", steps: [
        "Use a/sin A = c/sin C, rearranged to make sin C the subject:\nsin C =\nc × sin A ÷ a.",
        "Substitute the numbers:\nsin C =\n14 × sin(35°) ÷ 10 ≈\n14 × 0.574 ÷ 10 ≈\n0.803.",
        "Undo the sin using the inverse function:\nC =\nsin⁻¹(0.803) ≈\n53.4°.",
        "Quick sanity check: A + C ≈ 35 + 53.4 = 88.4°, comfortably under 180°, so this angle fits inside a real triangle.",
      ], answer: "≈53.4°" },
      { q: "In triangle PQR, angle P = 45°, angle Q = 75°, and side p (opposite angle P) = 10cm. Find side q.", steps: [
        "Find the third angle first: angle R = 180 − 45 − 75 = 60°.",
        "Apply the sine rule: p / sin P = q / sin Q.",
        "10 / sin(45°) = q / sin(75°).",
        "Rearrange: q = 10 × sin(75°) ÷ sin(45°) ≈ 10 × 0.9659 ÷ 0.7071 ≈ 13.66cm.",
        "So q ≈ 13.7cm (3 significant figures).",
      ], answer: "q ≈ 13.7cm." },
    ],
      tryit: { q: "In triangle ABC, angle A = 50°, a = 9cm, angle B = 70°. Find side b.", answer: "≈11.0cm, since b = a × sin B ÷ sin A = 9 × sin(70°) ÷ sin(50°) ≈ 9 × 0.940 ÷ 0.766 ≈ 11.0cm." } },
    { h: "3. The cosine rule: a² = b² + c² − 2bc cos A", body: [
      "This uses the same side-labelling convention as the sine rule (side a opposite angle A, and so on). When two sides and the angle SANDWICHED between them are known, that middle angle is called the included angle - it's the angle you need for this formula.",
      "There's a link back to Pythagoras' theorem here: if angle A happens to be exactly 90°, then cos(90°) = 0, so the last term vanishes and the formula becomes a² = b² + c² - exactly Pythagoras' theorem. The cosine rule is really Pythagoras' theorem extended to work for ANY angle, not just a right angle.",
      "Use the cosine rule to find a missing side when you know two sides and the included angle between them, as in the formula above. To find a missing ANGLE instead, when all three sides are known, rearrange the formula to make cos A the subject:\ncos A =\n(b² + c² − a²) ÷ (2bc),\nthen undo the cos with cos⁻¹.",
    ], examples: [
      { q: "Two sides of a triangle are 7cm and 9cm, with an included angle of 50°. Find the third side.", steps: [
        "Use a² = b² + c² − 2bc cos A with b=7, c=9, A=50°:\na² =\n7² + 9² − 2(7)(9)cos(50°) =\n49 + 81 − 126×0.643.",
        "Work out the last term:\n126 × 0.643 ≈\n81.0, so\na² ≈\n49 + 81 − 81.0 =\n49.0.",
        "a ≈\n√49.0 ≈\n7.0cm.",
      ], answer: "≈7.0cm" },
      { q: "A triangle has sides a=5cm, b=7cm, c=8cm (a harder version, finding an angle from three known sides). Find angle A.", steps: [
        "Use the rearranged cosine rule:\ncos A =\n(b² + c² − a²) ÷ (2bc) =\n(7² + 8² − 5²) ÷ (2×7×8).",
        "Work out the top and bottom separately:\ntop =\n49 + 64 − 25 =\n88.\nbottom =\n2×7×8 =\n112.",
        "cos A =\n88 ÷ 112 ≈\n0.786.",
        "Undo the cos using the inverse function:\nA =\ncos⁻¹(0.786) ≈\n38.2°.",
      ], answer: "≈38.2°" },
      { q: "A triangle has sides of 6cm, 8cm and 11cm. Find the size of the largest angle.", steps: [
        "The largest angle is opposite the longest side. Label a = 11, b = 6, c = 8 (so angle A is what we want).",
        "Use the rearranged cosine rule: cos A = (b² + c² − a²) ÷ (2bc) = (36 + 64 − 121) ÷ (2 × 6 × 8).",
        "Numerator: 36 + 64 − 121 = −21. Denominator: 96.",
        "cos A = −21 ÷ 96 ≈ −0.219.",
        "A = cos⁻¹(−0.219) ≈ 102.6°. The negative cosine confirms the angle is obtuse (greater than 90°), as expected for the longest side.",
      ], answer: "≈102.6°." },
    ],
      tryit: { q: "Two sides of a triangle are 4cm and 5cm, with an included angle of 70°. Find the third side.", answer: "≈5.2cm, since a² = 4² + 5² − 2(4)(5)cos(70°) = 16 + 25 − 40×0.342 ≈ 27.3, so a ≈ √27.3 ≈ 5.2cm." } },
    { h: "4. Area of any triangle: ½ab sin C", body: [
      "This formula finds a triangle's area directly from two sides and their included angle (the angle sandwiched between them, same meaning as in the cosine rule) - no height measurement needed.",
      "One thing worth noticing: sin stays positive for every angle between 0° and 180°, including obtuse angles (bigger than 90°), so this formula keeps giving a sensible positive area even when the included angle is obtuse.",
    ], examples: [
      { q: "A triangle has two sides of 6cm and 8cm with an included angle of 45°. Find its area.", steps: [
        "Area = ½ × 6 × 8 × sin(45°).",
        "Area =\n24 × 0.707 ≈\n17.0cm².",
      ], answer: "≈17.0cm²" },
      { q: "A triangle has two sides of 10cm and 13cm with an included angle of 110° (a harder version with an obtuse included angle). Find its area.", steps: [
        "Area = ½ × 10 × 13 × sin(110°).",
        "Area =\n65 × 0.940 ≈\n61.1cm².",
      ], answer: "≈61.1cm²" },
      { q: "A triangle has area 30cm² and two sides of length 10cm and 8cm. Find the included angle between those two sides.", steps: [
        "Area = ½ × a × b × sin C, so: 30 = ½ × 10 × 8 × sin C = 40 sin C.",
        "sin C = 30 ÷ 40 = 0.75.",
        "C = sin⁻¹(0.75) ≈ 48.6°.",
        "Note: sin is positive in both the first and second quadrant, so C could also be 180 − 48.6 = 131.4°. Both are valid angles for a triangle (since 131.4° leaves room for the other two angles to sum to under 48.6°), but in an exam context the acute solution is typically expected unless otherwise indicated.",
      ], answer: "≈48.6° (or 131.4° if an obtuse angle is allowed)." },
    ],
      tryit: { q: "A triangle has two sides of 5cm and 6cm with an included angle of 60°. Find its area.", answer: "≈13.0cm², since area = ½ × 5 × 6 × sin(60°) = 15 × 0.866 ≈ 13.0cm²." } },
  ],
};

INTERMEDIATE_LESSONS.threeDGeometryAndNets = {
  title: "3D Shapes: volume, surface area and nets",
  minutes: 13,
  order: 26,
  prereq: [{ module: "junior", key: "cubeProps" }, { module: "junior", key: "shapeFold" }],
  intro: "A net is a 2D shape that folds up into a 3D solid: every face of the solid is drawn out flat and joined along the edges where it folds. This builds directly on shape-folding (shapeFold) and cube facts (cubeProps) from earlier - if nets still feel unfamiliar, it's worth a quick look back at those first. This lesson covers surface area via nets, volume of prisms, volume of cylinders, and how to recognise which net folds into which solid.",
  sections: [
    { h: "1. Surface area = the total area of every face in the net", body: [
      "A solid's surface area is the total area of its outside surface - every face, added up. The net is exactly this surface unfolded flat, so surface area is simply the AREA OF THE WHOLE NET: add up the area of each flat face shown in it.",
      "Picture a cube's net: six identical squares arranged so that folding along their shared edges closes them up into a cube with no gaps and no overlaps (one common arrangement is a strip of four squares in a row, with one more square attached above one of them and one more below one of them - folding the strip round into a tube gives four side faces, and folding the extra two flat gives the top and the bottom).",
      "A cuboid has three edge lengths meeting at each corner, usually called its length (l), width (w) and height (h) - which edge gets which name doesn't matter, as long as it's used consistently from here on. A cuboid's net is six rectangles, but they come in three matching PAIRS, because opposite faces of a cuboid are always identical rectangles: two faces measuring l×w, two measuring l×h, and two measuring w×h.",
      "Adding up all six faces: Surface area = 2×(l×w + l×h + w×h). The '2×' is there because each of the three different rectangle sizes appears exactly twice - once on each of two opposite faces.",
      "Check this on a cuboid measuring 4cm×3cm×2cm, so l=4, w=3, h=2:\nl×w =\n4×3 =\n12,\nl×h =\n4×2 =\n8,\nw×h =\n3×2 =\n6.\nAdding these three and doubling:\nSurface area =\n2×(12+8+6) =\n2×26 =\n52cm².",
    ], examples: [
      { q: "Find the surface area of a cuboid measuring 4cm × 3cm × 2cm.", steps: [
        "Identify l=4, w=3, h=2 (any assignment of the labels works, as long as it's consistent).",
        "Find each pair's area:\nl×w = 4×3 = 12,\nl×h = 4×2 = 8,\nw×h = 3×2 = 6.",
        "Add the three and double, since each rectangle appears on two opposite faces:\nSurface area =\n2×(12+8+6) =\n2×26 =\n52cm².",
      ], answer: "52cm²" },
      { q: "Find the surface area of a cuboid measuring 6cm × 5cm × 3cm (bigger numbers, same method).", steps: [
        "Identify l=6, w=5, h=3.",
        "Find each pair's area:\nl×w = 6×5 = 30,\nl×h = 6×3 = 18,\nw×h = 5×3 = 15.",
        "Add the three and double:\nSurface area =\n2×(30+18+15) =\n2×63 =\n126cm².",
      ], answer: "126cm²" },
      { q: "A cube has surface area 150cm². Find its side length and its volume.", steps: [
        "A cube has 6 identical square faces, each with area s², so surface area = 6s².",
        "6s² = 150, so s² = 25.",
        "s = √25 = 5cm.",
        "Volume = s³ = 5³ = 125cm³.",
        "Check surface area: 6 × 5² = 6 × 25 = 150cm². ✓",
      ], answer: "Side length = 5cm; volume = 125cm³." },
    ],
      tryit: { q: "Find the surface area of a cube with side length 7cm (a cube is just a cuboid where l=w=h).", answer: "294cm². A cube has 6 identical square faces, each 7×7=49cm², so surface area = 6×49 = 294cm² (the same formula as a cuboid, just with l=w=h=7, so all three pair-areas equal 49)." } },
    { h: "2. Volume of a prism = cross-sectional area × length", body: [
      "A prism is a 3D solid with the same flat shape - called its cross-section - repeated all the way through, like a stack of identical slices glued together. The cross-section is whatever shape you'd see if you sliced straight across the prism, perpendicular to its length.",
      "Volume of a prism = cross-sectional area × length, where 'length' means the distance the cross-section extends through the solid (sometimes called its depth, depending on which way it's sitting). This works because the prism is literally that cross-sectional area, stacked up 'length' times over - the same idea as stacking identical sheets of paper to build a block.",
      "A cube is a special case of a prism: its cross-section is a square, and its 'length' equals its side too - which is exactly why a cube's volume formula (side×side×side, from cubeProps) is just this same prism rule in disguise.",
    ], examples: [
      { q: "A triangular prism has a cross-section of area 15cm² and length 10cm. Find its volume.", steps: [
        "Volume = cross-sectional area × length.",
        "Volume = 15 × 10 = 150cm³.",
      ], answer: "150cm³" },
      { q: "A prism's cross-section is a right-angled triangle with base 6cm and height 8cm, and the prism is 12cm long. Find its volume.", steps: [
        "First find the cross-sectional area. A triangle's area is half its base times its height:\nArea =\n½ × 6 × 8 =\n½ × 48 =\n24cm².",
        "Volume = cross-sectional area × length:\nVolume =\n24 × 12 =\n288cm³.",
      ], answer: "288cm³" },
      { q: "A trapezoidal prism has a cross-section that is a trapezium with parallel sides 5cm and 9cm and perpendicular height 4cm. The prism is 15cm long. Find its volume.", steps: [
        "Find the cross-sectional area. For a trapezium: area = ½ × (sum of parallel sides) × height = ½ × (5 + 9) × 4 = ½ × 14 × 4 = 28cm².",
        "Volume = cross-sectional area × length = 28 × 15 = 420cm³.",
      ], answer: "420cm³." },
    ],
      tryit: { q: "A prism has a cross-sectional area of 20cm² and length 7cm. Find its volume.", answer: "140cm³, since volume = cross-sectional area × length = 20 × 7 = 140cm³." } },
    { h: "3. Volume of a cylinder = πr²h", body: [
      "A cylinder is a prism whose cross-section is a circle, so the same rule applies: Volume = cross-sectional area × length. For a cylinder the 'length' runs up its axis and is usually called its height, h, and the cross-section is a circle of radius r (the distance from the centre of the circle out to its edge).",
      "The area of a circle is π×r², where π (pronounced 'pi') is a fixed number, roughly 3.14159..., equal to a circle's circumference divided by its diameter - it turns up whenever a circle's measurements are involved. For estimating by hand, π ≈ 3.14 is close enough.",
      "Putting the circle's area into the prism rule:\nVolume =\ncross-sectional area × height =\n(π×r²) × h =\nπr²h.",
    ], examples: [
      { q: "Find the volume of a cylinder with radius 3cm and height 10cm (use π ≈ 3.14).", steps: [
        "Cross-sectional area = π×r²:\nπ × 3² =\nπ × 9 ≈\n3.14 × 9 =\n28.26cm².",
        "Volume = cross-sectional area × height:\n28.26 × 10 =\n282.6,\nso volume ≈ 283cm³ (rounded).",
      ], answer: "≈283cm³" },
      { q: "Find the volume of a cylinder with radius 5cm and height 12cm (use π ≈ 3.14).", steps: [
        "Cross-sectional area = π×r²:\nπ × 5² =\nπ × 25 ≈\n3.14 × 25 =\n78.5cm².",
        "Volume = cross-sectional area × height:\n78.5 × 12 =\n942cm³.",
      ], answer: "942cm³" },
      { q: "A cylinder has radius 3cm and height 8cm. Describe the shapes in its net, give the dimensions of each, and find the total surface area (use π ≈ 3.14).", steps: [
        "The net of a cylinder consists of two circles (the two circular ends) and one rectangle (the curved surface, unrolled flat).",
        "Each circle has radius 3cm. Area of each circle = π × 3² ≈ 3.14 × 9 = 28.26cm². Two circles give 56.52cm².",
        "The rectangle has one side equal to the cylinder's height (8cm) and the other equal to the circumference of the circle: 2 × π × r = 2 × 3.14 × 3 = 18.84cm.",
        "Area of rectangle = 18.84 × 8 = 150.72cm².",
        "Total surface area = 56.52 + 150.72 ≈ 207.24cm², roughly 207cm².",
      ], answer: "2 circles (each radius 3cm) and a rectangle (18.84cm × 8cm); total surface area ≈ 207cm²." },
    ],
      tryit: { q: "Find the volume of a cylinder with radius 4cm and height 9cm (use π ≈ 3.14).", answer: "≈452cm³. Cross-sectional area = π×4² ≈ 3.14×16 = 50.24cm², so volume ≈ 50.24×9 = 452.16, rounding to 452cm³." } },
    { h: "4. Matching a net to its solid", body: [
      "Checking a net has two parts. First, count: does it have the right NUMBER of faces, of the right SHAPES, for the solid? A cube needs exactly 6 squares. A triangular prism needs 2 triangles (the two ends) plus 3 rectangles (the sides). A square-based pyramid needs 1 square plus 4 triangles.",
      "Second, fold it mentally (or on paper): the right number of the right shapes isn't enough on its own - they also have to fold up edge-to-edge with no gaps and no overlaps. Two different arrangements of the same six squares can give one net that folds perfectly into a cube and another that leaves two squares landing on top of each other.",
      "For example, a strip of 4 squares in a row, with 1 more square attached above any one of the 4 and another attached below any one of the 4, always folds into a valid cube: the strip of 4 wraps round into a tube (the four side faces), and the extra two fold flat to become the top and the bottom, wherever along the strip they were attached. This is exactly the kind of check practised with shapeFold earlier.",
    ], examples: [
      { q: "A square-based pyramid has 1 square base and 4 triangular side faces. How many faces, and of what shapes, should its net show?", steps: [
        "Count the faces on the solid itself: 1 square (the base) + 4 triangles (the sloping sides) = 5 faces in total.",
        "So the net must show exactly 1 square and exactly 4 triangles - any other combination of shapes or count is automatically wrong, even before folding it.",
      ], answer: "5 faces: 1 square + 4 triangles" },
      { q: "A net has six squares: a straight row of four squares, with a fifth square attached to the TOP edge of the leftmost square, and a sixth square also attached to the TOP edge of the rightmost square. Does this fold into a valid cube?", steps: [
        "Face count is right: 6 squares, matching a cube's 6 faces - so the count check alone doesn't rule it out.",
        "Fold the row of four into a tube: it forms the four side faces of the cube.",
        "Both extra squares are attached on the SAME side (top) of the strip. When folded up, both try to become the same face (the top) at once - they land on top of each other instead of one becoming the top and the other the bottom.",
        "Result: two faces overlap and the bottom face is left completely uncovered, so this net does NOT fold into a valid cube, even though the face count was correct.",
      ], answer: "No - both flaps fold onto the same face (the top), leaving the bottom uncovered, even though the face count (6 squares) looked right." },
      { q: "A cylinder has radius r and height h. Write a formula for its total surface area in terms of r and h, and use it to find the total surface area when r = 6cm and h = 10cm (use π ≈ 3.14). Also write down how many faces, and of what shapes, its net contains.", steps: [
        "The net contains 2 circular faces (each radius r) and 1 rectangular face (height h, width = circumference = 2πr).",
        "Total surface area = 2 × πr² (two circles) + 2πr × h (rectangle) = 2πr² + 2πrh = 2πr(r + h).",
        "Substitute r = 6, h = 10: surface area = 2 × 3.14 × 6 × (6 + 10) = 2 × 3.14 × 6 × 16.",
        "2 × 3.14 = 6.28; 6.28 × 6 = 37.68; 37.68 × 16 = 602.88cm².",
        "Net: 3 faces total — 2 circles of radius 6cm and 1 rectangle measuring (2 × 3.14 × 6) cm × 10cm = 37.68cm × 10cm.",
      ], answer: "Total surface area ≈ 603cm²; net has 3 faces: 2 circles (radius 6cm) and 1 rectangle (37.68cm × 10cm)." },
    ],
      tryit: { q: "A net has 2 triangles and 3 rectangles, correctly shaped and sized to match. Which solid could this be the net of?", answer: "A triangular prism - it needs exactly 2 triangular end faces plus 3 rectangular side faces, which matches this net's face count and shapes exactly." } },
  ],
};

INTERMEDIATE_LESSONS.multiStepGeometryProof = {
  title: "Geometry Chains: combining facts step by step",
  minutes: 14,
  order: 27,
  prereq: ["circleTheoremsAndTangents", "trigonometryAdvanced", "algebraicProof"],
  intro: "The hardest geometry questions don't use one rule - they chain two or three together, where the answer to one step becomes the input to the next. This lesson is about the STRATEGY of chaining, not a new rule of its own: spot every shape hiding in the diagram, extract one fact at a time using a rule you can name (from earlier lessons like circleTheoremsAndTangents, trigonometryAdvanced or algebraicProof, or from basic angle facts), and let each one unlock the next.",
  sections: [
    { h: "1. Find every shape hiding in the diagram", body: [
      "Complex diagrams are almost always several simple shapes overlapping or sharing a side - a triangle sharing a side with a parallelogram, or an isosceles triangle formed by two radii of a circle. Before touching any angles, trace each individual shape's outline on its own.",
      "A reminder of what 'isosceles' means: a triangle with (at least) two sides the same length. Whenever two sides in a diagram are equal - very often because they're both radii of the same circle, since every radius of a circle is the same length - the triangle they form is isosceles, and its two base angles (the angles opposite the two equal sides) are automatically equal too.",
      "Naming the shapes you find matters, because each shape brings its own rule with it: a triangle brings 'angles sum to 180°', a parallelogram brings 'opposite angles are equal' and 'co-interior angles between the parallel sides sum to 180°', and a circle brings the circle theorems (from circleTheoremsAndTangents) - such as the fact that a tangent is always perpendicular to the radius drawn to the point where it touches the circle.",
    ], examples: [
      { q: "A diagram shows quadrilateral ABCD with diagonal AC drawn in. What two shapes can you see once the diagonal is added, and what do they share?", steps: [
        "The diagonal AC splits the quadrilateral into two separate triangles: triangle ABC and triangle ACD.",
        "They share the side AC - so any angle or length worked out using AC in one triangle can be reused directly in the other.",
      ], answer: "Triangle ABC and triangle ACD, sharing the side AC." },
      { q: "A circle has centre O. A and B are points on the circumference, and a tangent to the circle touches it at A. What separate, nameable shapes and facts can you pick out of this diagram, involving O, A and B?", steps: [
        "OA and OB are both radii of the same circle, so OA = OB - this makes triangle OAB isosceles, with equal base angles at A and B.",
        "The tangent at A and the radius OA meet at a right angle - this is the tangent-radius theorem (from circleTheoremsAndTangents): a tangent is always perpendicular (90°) to the radius drawn to its point of contact.",
        "So this one diagram actually contains an isosceles triangle (OAB) PLUS a separate 90° fact (between the tangent and OA) - two independent tools, ready to be chained together if a question asks for an angle involving the tangent.",
      ], answer: "An isosceles triangle OAB (since OA = OB are radii) and a 90° angle between the tangent at A and the radius OA (the tangent-radius theorem)." },
      { q: "Triangle ABC is inscribed in a circle with centre O. OA, OB and OC are all radii. List all the distinct triangles you can identify in the diagram, and state the key property each type has.", steps: [
        "The main triangle is ABC itself: a general triangle whose angles sum to 180°.",
        "OA = OB (both radii), so triangle OAB is isosceles with equal base angles at A and B.",
        "OB = OC (both radii), so triangle OBC is isosceles with equal base angles at B and C.",
        "OA = OC (both radii), so triangle OAC is isosceles with equal base angles at A and C.",
        "That gives 4 distinct triangles in total: ABC plus three isosceles ones. Each isosceles sub-triangle shares a side with the outer triangle ABC, so angles found in one can be passed into adjacent triangles for further steps.",
      ], answer: "4 triangles: ABC (general, angle sum 180°) and OAB, OBC, OAC (each isosceles, since two sides are radii of equal length)." },
    ] },
    { h: "2. Work from what you're GIVEN, not toward what you WANT", body: [
      "Start at the angle or length you already know, and ask 'what does this fact force?' - rather than staring at the target angle hoping for inspiration. Each individual step should be a single, simple rule: base angles of an isosceles triangle are equal, angles on a straight line sum to 180°, angles round a point sum to 360°, angles in a triangle sum to 180°, or a circle theorem.",
      "Two rules used repeatedly below: the isosceles triangle base angle theorem (the two angles opposite a triangle's two equal sides are equal), and angles on a straight line (angles on one side of a straight line, meeting at a single point, always add up to 180°).",
    ], examples: [
      { q: "Triangle ABC is isosceles with AB = AC and angle BAC = 40°. BC is extended to a point D. Find angle ACD (the exterior angle at C).", steps: [
        "Base angles of the isosceles triangle are equal (the isosceles triangle base angle theorem), and the triangle's three angles sum to 180°:\nangle ABC = angle ACB =\n(180 − 40) ÷ 2 =\n140 ÷ 2 =\n70°.",
        "Angle ACD and angle ACB lie on the straight line BD, meeting at point C, so together they sum to 180° (angles on a straight line):\nangle ACD =\n180 − 70 =\n110°.",
      ], answer: "110°" },
      { q: "O is the centre of a circle, and A, B, C are points on the circumference with C on the major arc AB (the longer way round, not the short arc between A and B). OA and OB are radii, and angle AOB = 100°. Find (a) angle OAB and (b) angle ACB.", steps: [
        "OA and OB are both radii, so OA = OB - triangle OAB is isosceles, with equal base angles at A and B. Using the triangle's angle sum of 180°:\nangle OAB = angle OBA =\n(180 − 100) ÷ 2 =\n80 ÷ 2 =\n40°.",
        "That answers (a): angle OAB = 40°.",
        "For (b), use the angle at centre theorem (from circleTheoremsAndTangents): the angle at the centre is always twice the angle at the circumference, when both stand on the same arc AB. Here the centre angle AOB = 100°, so:\nangle ACB =\n100 ÷ 2 =\n50°.",
      ], answer: "(a) 40°  (b) 50°" },
      { q: "O is the centre of a circle. A and B are points on the circumference, and angle OAB = 25°. C is a point on the major arc AB. Find (a) angle AOB and (b) angle ACB.", steps: [
        "OA = OB (both radii), so triangle OAB is isosceles with equal base angles at A and B: angle OBA = angle OAB = 25°.",
        "The angles in triangle OAB sum to 180°: angle AOB = 180 − 25 − 25 = 130°. That answers (a).",
        "For (b): C is on the major arc AB, so angle ACB at the circumference and angle AOB at the centre both stand on the minor arc AB. The angle at the centre is twice the angle at the circumference.",
        "Angle ACB = angle AOB ÷ 2 = 130 ÷ 2 = 65°.",
      ], answer: "(a) angle AOB = 130°  (b) angle ACB = 65°." },
    ],
      tryit: { q: "Triangle PQR is isosceles with PQ = PR and angle QPR = 50°. QR is extended to a point S. Find angle PRS.", answer: "115°. Base angles: angle PQR = angle PRQ = (180−50)÷2 = 65°. Angle PRS and angle PRQ lie on the straight line QS, so angle PRS = 180 − 65 = 115°." } },
    { h: "3. Label every angle as you find it", body: [
      "Write each newly-found angle directly onto (or next to) the diagram immediately, as soon as you find it. A chain of four or five steps is easy to lose track of otherwise, and a diagram with every known angle labelled lets you spot the next available step at a glance, rather than re-deriving something you already worked out.",
      "One more rule appears below: the angles inside any quadrilateral (a four-sided shape) always sum to 360° - the quadrilateral angle sum theorem. It follows from the triangle angle sum theorem, since any quadrilateral can be split into two triangles by one diagonal (exactly as in section 1's example), each contributing 180°.",
    ], examples: [
      { q: "In triangle ABC, angle A = 55° and angle B = 65°. Find angle C, and label it before moving on to anything else.", steps: [
        "The three angles of a triangle sum to 180°:\nangle C =\n180 − 55 − 65 =\n60°.",
        "Label angle C = 60° on the diagram immediately - now every angle in this triangle is visible at a glance for the next step of any longer question.",
      ], answer: "60°" },
      { q: "Quadrilateral ABCD has angle A = 80°, angle B = 100°, angle C = x and angle D = 2x. Find x, then label angle C and angle D in turn.", steps: [
        "The angles of a quadrilateral sum to 360° (the quadrilateral angle sum theorem):\n80 + 100 + x + 2x =\n360.",
        "Simplify the left side:\n180 + 3x =\n360.",
        "Solve for x:\n3x =\n360 − 180 =\n180, so\nx =\n60.",
        "Label angle C = x = 60° on the diagram, then use it immediately to get angle D = 2x = 2×60 = 120°, and label that too.",
      ], answer: "x = 60°, so angle C = 60° and angle D = 120°." },
      { q: "In triangle ABC, AB = AC (isosceles) and angle BAC = 50°. D is a point on BC extended beyond C. Find angle ACD, labelling each angle as you find it.", steps: [
        "AB = AC means triangle ABC is isosceles with two equal sides meeting at A. The base angles (at B and C) are equal.",
        "Find the base angles: angle ABC = angle ACB = (180 − 50) ÷ 2 = 130 ÷ 2 = 65°. Label angle ACB = 65° on the diagram.",
        "D lies on the extension of BC beyond C, so angles ACD and ACB lie on the straight line BD, meeting at point C.",
        "Angles on a straight line sum to 180°: angle ACD = 180 − 65 = 115°. Label angle ACD = 115°.",
        "Note: angle ACD is an exterior angle of the triangle at C; exterior angles equal the sum of the two non-adjacent interior angles: 50 + 65 = 115°. ✓",
      ], answer: "angle ACD = 115°." },
    ],
      tryit: { q: "Triangle DEF has angle D = 48° and angle E = 2 × angle D. Find angle F.", answer: "36°. Angle E = 2×48 = 96°. The triangle's angles sum to 180°, so angle F = 180 − 48 − 96 = 36°." } },
    { h: "4. Sanity-check the final answer", body: [
      "Angles in a triangle should sum to 180°, angles on a straight line to 180°, and angles round a point to 360° (or a quadrilateral's angles to 360°, as in section 3). If a completed chain of reasoning leads to a total that breaks one of these known facts, a step was mis-applied somewhere along the chain - go back and check each link.",
    ], examples: [
      { q: "A student calculates the three angles of a triangle as 50°, 65° and 70°. Use the angle sum check to decide if this is possible.", steps: [
        "Add the three angles:\n50 + 65 + 70 =\n185°.",
        "A triangle's angles must sum to exactly 180°, not 185° - so at least one of these three angles must be wrong, and it's worth re-checking the working that produced them.",
      ], answer: "Not possible - the three angles add to 185°, not 180°, so a mistake was made somewhere." },
      { q: "Four angles meeting at a single point are calculated as 90°, 85°, 100° and 90°. Use the angle sum check, then suggest what a corrected second angle would need to be for everything else to stay the same.", steps: [
        "Add the four angles:\n90 + 85 + 100 + 90 =\n365°.",
        "Angles round a point must sum to exactly 360°, not 365° - so something is 5° too big somewhere.",
        "If only the second angle (85°) was mis-calculated, the corrected value would need to be:\n85 − 5 =\n80°,\nsince\n90 + 80 + 100 + 90 =\n360°, which checks out.",
      ], answer: "The original total (365°) is 5° too many; correcting the second angle to 80° gives a valid total of 360°." },
      { q: "A student works out the four interior angles of a cyclic quadrilateral as 80°, 95°, 105° and 80°. Apply two different checks to decide whether these values could all be correct.", steps: [
        "Check 1 — quadrilateral angle sum: any quadrilateral's interior angles sum to 360°. Add the four values: 80 + 95 + 105 + 80 = 360°. This check passes.",
        "Check 2 — cyclic quadrilateral opposite-angle property: opposite pairs must each sum to 180°. In order round the quadrilateral, pair the 1st and 3rd angles, and the 2nd and 4th angles.",
        "1st + 3rd = 80 + 105 = 185° ≠ 180°. This check fails immediately.",
        "Conclusion: the four angles are valid for a quadrilateral (angle sum check passes) but cannot belong to a CYCLIC quadrilateral (opposite-angle check fails).",
        "The working that produced 105° (or one of the 80° values) contains an error.",
      ], answer: "Not a valid cyclic quadrilateral — opposite angles 80° and 105° sum to 185° instead of 180°, even though the total of all four (360°) is correct for any quadrilateral." },
    ],
      tryit: { q: "Two angles on a straight line are calculated as 115° and 60°. Use the angle sum check to decide if this is possible.", answer: "Not possible - 115 + 60 = 175°, not 180°, so the two angles are inconsistent with lying on a straight line; at least one needs to be re-checked." } },
  ],
};

INTERMEDIATE_LESSONS.statisticsAdvanced = {
  title: "Advanced Statistics: box plots, cumulative frequency and histograms",
  minutes: 14,
  order: 28,
  prereq: [{ module: "junior", key: "meanPuzzle" }],
  intro: "Beyond mean, median and mode (mean was covered in meanPuzzle) - GCSE and Kangaroo questions test three specific diagrams for summarising a whole dataset at a glance: box plots (spread and quartiles), cumulative frequency graphs (running totals), and histograms (frequency density for unequal class widths). Each diagram comes with its own vocabulary, defined from scratch below with a small worked dataset threaded through each one.",
  sections: [
    { h: "1. Box plots: five key numbers", body: [
      "Suppose 11 students' test scores, already sorted from smallest to largest, are:\n4, 7, 9, 12, 14, 15, 18, 20, 23, 25, 30.\nThe MEDIAN is the middle value once the data is sorted like this. With 11 values, the middle one sits at position (11+1)÷2 = 6, so counting in six places: the median is 15.",
      "The LOWER QUARTILE (written Q1) is the median of just the lower half of the data - the values below the overall median. Here the lower half is 4, 7, 9, 12, 14 (5 values), whose middle value is 9. So Q1 = 9. The UPPER QUARTILE (Q3) is the median of just the upper half - here 18, 20, 23, 25, 30 (5 values), whose middle value is 23. So Q3 = 23.",
      "(If a half itself contains an even number of values, its quartile is the MEAN of the two middle values of that half - the same rule used for finding the median of any even-sized list.)",
      "The INTERQUARTILE RANGE (IQR) is Q3 − Q1 - the width of the middle 50% of the data:\nIQR =\n23 − 9 =\n14.\nA box plot draws a box from Q1 to Q3 (with a line inside it at the median), and then a thin line called a WHISKER stretching out from each end of the box to the minimum and the maximum. So for this dataset, the box runs from 9 to 23 with a line at 15, and whiskers reach out to the minimum (4) and maximum (30).",
    ], examples: [
      { q: "A box plot has minimum 5, lower quartile Q1 = 12, median 18, upper quartile Q3 = 25, maximum 40. Find the interquartile range.", steps: [
        "The interquartile range is the upper quartile minus the lower quartile:\nIQR =\nQ3 − Q1 =\n25 − 12 =\n13.",
      ], answer: "13" },
      { q: "Using the 11 sorted test scores 4, 7, 9, 12, 14, 15, 18, 20, 23, 25, 30, find the median, Q1, Q3 and the interquartile range.", steps: [
        "Median: the middle (6th) value out of 11 is 15.",
        "Lower half (the 5 values below the median): 4, 7, 9, 12, 14 - its middle value is Q1 = 9.",
        "Upper half (the 5 values above the median): 18, 20, 23, 25, 30 - its middle value is Q3 = 23.",
        "Interquartile range:\nIQR =\nQ3 − Q1 =\n23 − 9 =\n14.",
      ], answer: "Median = 15, Q1 = 9, Q3 = 23, IQR = 14" },
      { q: "12 data values in sorted order are: 3, 5, 7, 9, 11, 12, 14, 16, 19, 22, 24, 30. Find the median, Q1, Q3 and the interquartile range.", steps: [
        "With 12 values (an even count), the median is the mean of the 6th and 7th values: (12 + 14) ÷ 2 = 13.",
        "Lower half (the 6 values below the median): 3, 5, 7, 9, 11, 12. Q1 is the median of this half (6 values, even): Q1 = (7 + 9) ÷ 2 = 8.",
        "Upper half (the 6 values above the median): 14, 16, 19, 22, 24, 30. Q3 is the median of this half: Q3 = (19 + 22) ÷ 2 = 20.5.",
        "IQR = Q3 − Q1 = 20.5 − 8 = 12.5.",
      ], answer: "Median = 13, Q1 = 8, Q3 = 20.5, IQR = 12.5." },
    ],
      tryit: { q: "9 sorted values are: 2, 5, 6, 9, 11, 13, 15, 18, 20. Find Q1, Q3 and the interquartile range.", answer: "Q1 = 5.5, Q3 = 16.5, IQR = 11. The median (5th value) is 11. The lower half is 2, 5, 6, 9 (4 values, even), so Q1 is the mean of its two middle values: (5+6)÷2 = 5.5. The upper half is 13, 15, 18, 20, so Q3 = (15+18)÷2 = 16.5. IQR = 16.5 − 5.5 = 11." } },
    { h: "2. Cumulative frequency: running totals", body: [
      "CUMULATIVE FREQUENCY just means a RUNNING TOTAL: keep adding each new class's frequency onto the total of everything before it. For example, suppose 80 students' exam scores are grouped like this:\n0-20: frequency 10\n20-40: frequency 20\n40-60: frequency 30\n60-80: frequency 15\n80-100: frequency 5.\nRunning that total: after the first class, 10; after the second,\n10 + 20 =\n30; after the third,\n30 + 30 =\n60; after the fourth,\n60 + 15 =\n75; after the fifth,\n75 + 5 =\n80 - which correctly reaches the full total of 80 students by the end, as it always must.",
      "A cumulative frequency GRAPH plots these running totals against the upper boundary of each class, and is always increasing (or flat) - it can never go down, since a running total never shrinks.",
      "Reading UP from a chosen cumulative frequency value to the plotted curve, then ACROSS and DOWN to the horizontal axis, gives the data value below which that many items lie. The median sits at HALF the total frequency; the lower quartile Q1 sits at a QUARTER (¼) of the total; the upper quartile Q3 sits at THREE-QUARTERS (¾) of the total. With the 80-student example above, the median is read off at cumulative frequency\n80 ÷ 2 =\n40.",
    ], examples: [
      { q: "A cumulative frequency graph has a total frequency of 80. At what cumulative frequency value do you read off the median?", steps: [
        "The median sits at HALF the total frequency.",
        "80 ÷ 2 = 40.",
      ], answer: "40" },
      { q: "A cumulative frequency graph has a total frequency of 120. At what cumulative frequency values do you read off the lower quartile (Q1) and the upper quartile (Q3)?", steps: [
        "Q1 sits at a QUARTER of the total:\n120 ÷ 4 =\n30.",
        "Q3 sits at THREE-QUARTERS of the total:\n3 × 120 ÷ 4 =\n360 ÷ 4 =\n90.",
      ], answer: "Q1 at cumulative frequency 30, Q3 at cumulative frequency 90" },
      { q: "Students' marks are grouped as follows: 0-20: 8 students, 20-40: 15 students, 40-60: 22 students, 60-80: 12 students, 80-100: 3 students. Find the cumulative frequencies and at what cumulative frequency value would you read off the median on the graph?", steps: [
        "Total frequency = 8 + 15 + 22 + 12 + 3 = 60 students.",
        "Cumulative frequencies: after 0-20: 8; after 20-40: 8 + 15 = 23; after 40-60: 23 + 22 = 45; after 60-80: 45 + 12 = 57; after 80-100: 57 + 3 = 60.",
        "The last cumulative frequency reaches exactly 60 (the total), confirming the running totals are correct.",
        "The median is read off at half the total frequency: 60 ÷ 2 = 30. On the cumulative frequency graph, find cumulative frequency 30 on the vertical axis and read across to the curve, then down to the horizontal axis.",
      ], answer: "Cumulative frequencies: 8, 23, 45, 57, 60. Read the median at cumulative frequency 30." },
    ],
      tryit: { q: "A cumulative frequency graph has a total frequency of 200. At what cumulative frequency values do you read off the median and Q3?", answer: "Median at 200 ÷ 2 = 100; Q3 at 3 × 200 ÷ 4 = 150." } },
    { h: "3. Histograms: frequency density, not frequency", body: [
      "A histogram is a bar chart for grouped, continuous data. When every class has the SAME width, plotting frequency as the bar height works fine. But when class widths are UNEQUAL, plotting raw frequency as height is misleading - a wide class can pile up a big frequency just because it's wide, not because the data is densely packed there.",
      "The fix is to plot FREQUENCY DENSITY instead, defined as:\nfrequency density =\nfrequency ÷ class width.\nThis keeps the bar's AREA (not its height) proportional to the number of data points, however wide or narrow the class is - since area = height × width = frequency density × class width = frequency, exactly recovering the count.",
      "For example, three classes with frequencies 20, 24 and 24 but widths 5, 10 and 6 respectively have frequency densities:\n20 ÷ 5 =\n4,\n24 ÷ 10 =\n2.4,\n24 ÷ 6 =\n4.\nNotice the first and third classes have the same frequency density (4) despite different frequencies (20 vs 24) - that's because their widths differ too (5 vs 6), and density accounts for that.",
    ], examples: [
      { q: "A histogram class has frequency 24 and class width 6. Find its frequency density.", steps: [
        "Frequency density = frequency ÷ class width.",
        "24 ÷ 6 = 4.",
      ], answer: "4" },
      { q: "A histogram class has frequency 45 and class width 9. Find its frequency density.", steps: [
        "Frequency density = frequency ÷ class width.",
        "45 ÷ 9 = 5.",
      ], answer: "5" },
      { q: "A histogram has three bars: class 0-5 with frequency density 4, class 5-15 with frequency density 2.5, and class 15-23 with frequency density 3. Find the total frequency represented by all three bars.", steps: [
        "Frequency = frequency density × class width.",
        "Class 0-5: width = 5, frequency = 4 × 5 = 20.",
        "Class 5-15: width = 10, frequency = 2.5 × 10 = 25.",
        "Class 15-23: width = 8, frequency = 3 × 8 = 24.",
        "Total frequency = 20 + 25 + 24 = 69.",
      ], answer: "69." },
    ],
      tryit: { q: "A histogram bar has frequency density 5 over a class width of 8. Find the frequency it represents.", answer: "40, since frequency = frequency density × class width = 5 × 8 = 40." } },
    { h: "4. Reading frequency back out of a histogram bar", body: [
      "Rearranging the frequency density formula (frequency density = frequency ÷ class width) to make frequency the subject:\nfrequency =\nfrequency density × class width.\nThis is exactly how you recover an actual COUNT of data points from a histogram bar's height (its frequency density) and width (its class width) - the reverse direction of section 3.",
    ], examples: [
      { q: "A histogram bar has frequency density 4 and class width 5. Find the frequency it represents.", steps: [
        "Frequency = frequency density × class width.",
        "Frequency = 4 × 5 = 20.",
      ], answer: "20" },
      { q: "A histogram bar has frequency density 3.5 and class width 12. Find the frequency it represents.", steps: [
        "Frequency = frequency density × class width.",
        "Frequency = 3.5 × 12 = 42.",
      ], answer: "42" },
      { q: "A histogram has two adjacent bars. The first spans the class 20-35 and has frequency density 4.8. The second spans 35-50 and has frequency density 3.2. How many more data values fall in the first class than the second?", steps: [
        "Frequency = frequency density × class width.",
        "First class (20-35): width = 15, frequency = 4.8 × 15 = 72.",
        "Second class (35-50): width = 15, frequency = 3.2 × 15 = 48.",
        "Difference = 72 − 48 = 24.",
        "Even though the two classes have the same width here, the different frequency densities mean different frequencies; more generally, always recover frequency from density × width rather than reading the bar height directly as a count.",
      ], answer: "24 more data values fall in the first class (72 vs 48)." },
    ],
      tryit: { q: "A histogram bar has frequency density 2.5 and class width 20. Find the frequency it represents.", answer: "50, since frequency = frequency density × class width = 2.5 × 20 = 50." } },
  ],
};