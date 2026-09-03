const example = (q, steps, answer, extra = {}) => ({ q, steps, answer, ...extra });

const lesson = (title, order, prereq, intro, sections, recap, mistakes) => ({
  title,
  order,
  prereq,
  intro,
  sections,
  recap,
  mistakes
});

const section = (h, body, examples, tryit, extra = {}) => ({
  h,
  body,
  examples,
  tryit,
  ...extra
});

const rewriteExistingLesson = (source, intro, prereq, rewrites) => ({
  ...source,
  prereq,
  intro,
  // A base lesson can gain a new section (appended directly in content/intermediate-lessons.js)
  // without a matching entry here yet — fall back to the section's own body/tryit/note rather
  // than throwing on `rewrites[index]` being undefined.
  sections: source.sections.map((oldSection, index) => {
    const r = rewrites[index];
    if (!r) return oldSection;
    return {
      ...oldSection,
      body: r.body,
      tryit: r.tryit,
      note: r.note,
      ...(r.visual ? { visual: r.visual } : {}),
    };
  })
});

const teaching = (body, q, answer, note, visual) => ({ body, tryit: { q, answer }, note, visual });

export function applyIntermediateLessonRewrites(lessons) {
  lessons.numberTheoryDivisibility = lesson(
    "Number Theory: factors, multiples and remainders",
    1,
    [{ module: "primary", key: "factorsMultiplesPrimes" }],
    "Number theory is the study of whole numbers and the patterns hidden inside them. We will begin with familiar multiplication facts, use them to uncover the prime building blocks of a number and then apply those blocks to common factors and common multiples. The final section introduces modular arithmetic, which is a precise way to describe remainders and repeating cycles.",
    [
      section(
        "1. Prime factorisation",
        [
          "Imagine that 60 identical counters must be arranged into equal rectangular rows. There are several possibilities: 6 rows of 10, 5 rows of 12 or 4 rows of 15. Each arrangement reveals a factor pair of 60. Factors tell us how a whole number can be built by multiplication.",
          "Some factors can be broken into smaller factors. For example, 60 = 6 × 10, but 6 = 2 × 3 and 10 = 2 × 5. This gives 60 = 2 × 2 × 3 × 5. The numbers 2, 3 and 5 cannot be broken into smaller positive whole-number factors, apart from using 1. They are prime numbers.",
          "Writing a number entirely as a product of primes is called prime factorisation. Every whole number greater than 1 has exactly one prime factorisation, apart from changing the order of the factors. This means that starting with a different factor pair will still lead to the same prime building blocks.",
          "A dependable method is to divide by the smallest prime that fits. Begin with 2, then try 3, 5, 7 and so on. After each successful division, apply the same test to the quotient. Stop only when the remaining quotient is prime.",
          "Repeated factors can be written with indices. The product 2 × 2 × 3 × 5 becomes 2² × 3 × 5. Always check a prime factorisation by multiplying its factors back together. This catches missing factors and incorrect indices."
        ],
        [
          example("Is 7 a prime number?", [
            "List every positive whole number that divides exactly into 7, by trying to pair it up: 1 × 7 = 7.",
            "Try any other whole number between 2 and 6 as a possible factor: none of them divides 7 exactly, so no other pair exists.",
            "So the only factor pair of 7 is 1 × 7.",
          ], "Yes, 7 is prime.", {
            understand: "A prime number is a whole number greater than 1 with exactly two positive factors: 1 and itself. To decide if 7 is prime, we need to check whether it has any factors other than those two.",
            check: "We tried every whole number from 2 up to 6 and none divided 7 exactly, so 1 and 7 really are the only two factors.",
          }),
          example("Write 36 as a product of primes.", [
            "Try the smallest prime, 2, on 36: does it divide exactly? 36 ÷ 2 = 18, so yes. This gives 36 = 2 × 18.",
            "18 is not prime, so keep going. Try 2 again on 18: 18 ÷ 2 = 9, so 18 = 2 × 9. This gives 36 = 2 × 2 × 9.",
            "9 is not prime, and 2 does not divide it exactly (9 ÷ 2 is not a whole number), so move to the next prime, 3: 9 ÷ 3 = 3, so 9 = 3 × 3. This gives 36 = 2 × 2 × 3 × 3.",
            "3 is prime, so we stop. We now have four prime factors altogether: 2, 2, 3 and 3.",
            "Write the repeated factors using indices: two 2s become 2², and two 3s become 3².",
          ], "36 = 2² × 3².", {
            understand: "We need to break 36 down completely into prime factors: factors that cannot themselves be split into smaller whole-number factors. The reliable method is to divide repeatedly by the smallest prime that fits, moving on to the next prime only when the current one stops working.",
            check: "Multiply the factors back together: 2² × 3² = 4 × 9 = 36. This matches the number we started with, so the factorisation is correct.",
          }),
          example("Write 180 as a product of primes.", [
            "Try 2 on 180: 180 ÷ 2 = 90, so 180 = 2 × 90.",
            "90 is not prime, so try 2 again: 90 ÷ 2 = 45, so 90 = 2 × 45. This gives 180 = 2 × 2 × 45.",
            "45 is not prime, and 2 does not divide it exactly, so move to the next prime, 3: 45 ÷ 3 = 15, so 45 = 3 × 15. This gives 180 = 2 × 2 × 3 × 15.",
            "15 is not prime, so try 3 again: 15 ÷ 3 = 5, so 15 = 3 × 5. This gives 180 = 2 × 2 × 3 × 3 × 5.",
            "5 is prime, so we stop. Write the repeated factors using indices: 2 × 2 = 2², and 3 × 3 = 3². The single 5 is left as it is.",
          ], "180 = 2² × 3² × 5.", {
            understand: "This is the same method as before, applied to a bigger number: keep dividing by the smallest prime that fits until every remaining factor is prime.",
            check: "Multiply the factors back together: 2² × 3² × 5 = 4 × 9 × 5 = 36 × 5 = 180. This matches the original number, so the factorisation is correct.",
          }),
          example("A student writes 420 = 2² × 3 × 5 and stops. Find and correct the error.", [
            "Check the student's answer by multiplying it back together, before trying to spot the mistake any other way: 2² × 3 × 5 = 4 × 3 × 5 = 12 × 5 = 60.",
            "The original number was 420, not 60, so the student's answer cannot be right; they must have stopped before the factorisation was complete.",
            "We know 2² × 3 × 5 = 60 is a genuine factor of 420 (it is just not all of it), so divide 420 by 60 to find what is missing: 420 ÷ 60 = 7.",
            "Check that 7 is prime: its only positive factors are 1 and 7, so yes.",
            "The complete prime factorisation includes this extra factor of 7 alongside the student's original 2² × 3 × 5.",
          ], "420 = 2² × 3 × 5 × 7.", {
            understand: "We are not asked to redo the whole factorisation from scratch; we are asked to find exactly where the student's working stopped short, and finish it correctly. The quickest way to spot a factorisation error is to multiply the given answer back together and compare it with the original number.",
            check: "Multiply the corrected factors back together: 4 × 3 × 5 × 7 = 12 × 5 × 7 = 60 × 7 = 420. This matches the original number, confirming the correction is right.",
          })
        ],
        { q: "Write 756 as a product of primes and check your answer by multiplying back.", answer: "756 ÷ 2 = 378, then 378 ÷ 2 = 189 (giving 2² so far). 189 is not even, so try 3: 189 ÷ 3 = 63, then 63 ÷ 3 = 21, then 21 ÷ 3 = 7 (giving 3³ so far). 7 is prime, so we stop. 756 = 2² × 3³ × 7. Checking: 4 × 27 × 7 = 108 × 7 = 756." },
        { note: "A common mistake is to stop when the quotient is odd. Odd does not mean prime. If 2 no longer divides, continue with 3, then 5, then 7." }
      ),
      section(
        "2. Highest common factors and lowest common multiples",
        [
          "Suppose two ribbons are 24 cm and 36 cm long. We want to cut both into equal pieces with no ribbon left over, using the longest possible piece. The piece length must be a factor of both numbers. Because we want the greatest possible length, we need the highest common factor, usually shortened to HCF.",
          "Now imagine two lights that flash every 24 seconds and every 36 seconds. We want to know when they will next flash together. The waiting time must be a multiple of both 24 and 36. Because we want the first such time, we need the lowest common multiple, usually shortened to LCM.",
          "Both questions can be answered by listing, but listing gets slow for bigger numbers, so it helps to see why prime factorisation gives a shortcut. Write 24 and 36 as products of primes: 24 = 2 × 2 × 2 × 3 = 2³ × 3, and 36 = 2 × 2 × 3 × 3 = 2² × 3².",
          "Think about what a common factor of 24 and 36 actually needs to contain. Since 24 only has three 2s to offer and 36 only has two, any number dividing BOTH of them exactly can use at most two 2s: taking three would ask 36 for a 2 it does not have. The same reasoning applies to the prime 3: 24 offers only one 3, so a common factor can use at most one 3. Taking the smaller, or lower, power of each shared prime therefore gives the largest number that still divides both exactly: HCF = 2² × 3¹ = 4 × 3 = 12.",
          "Now think about what a common MULTIPLE of 24 and 36 needs to contain, which is the opposite requirement. To be a multiple of 24, a number needs at least three 2s and at least one 3. To be a multiple of 36, it needs at least two 2s and at least two 3s. To satisfy both requirements at once, the number needs the larger, or higher, power of each prime that appears in either number: three 2s (to satisfy 24) and two 3s (to satisfy 36). This gives LCM = 2³ × 3² = 8 × 9 = 72.",
          "So the same two prime factorisations answer both questions, just by choosing the lower or the higher power of each prime. An HCF must fit inside both numbers, so it can never demand more copies of a prime than the number offering the fewest; an LCM must contain both numbers, so it needs enough copies of every prime to satisfy whichever number demands the most."
        ],
        [
          example("Find the HCF of 12 and 18 by listing factors.", ["Factors of 12 are 1, 2, 3, 4, 6 and 12.", "Factors of 18 are 1, 2, 3, 6, 9 and 18.", "The greatest number in both lists is 6."], "HCF = 6.", {
            understand: "For small numbers, the factors can simply be listed out and compared directly, without needing prime factorisation at all.",
            check: "6 divides both 12 (12 ÷ 6 = 2) and 18 (18 ÷ 6 = 3) exactly, and no larger number in both lists does.",
          }),
          example("Find the HCF and LCM of 12 and 18 using prime factors.", [
            "Write each number as a product of primes: 12 = 2² × 3, and 18 = 2 × 3².",
            "For the HCF, look at the prime 2: 12 has 2² (two 2s) but 18 has only 2¹ (one 2). Take the lower power, 2¹.",
            "Now look at the prime 3: 12 has only 3¹ but 18 has 3² (two 3s). Take the lower power, 3¹.",
            "Multiply the powers just chosen: HCF = 2¹ × 3¹ = 2 × 3 = 6.",
            "For the LCM, look at the prime 2 again: the higher power between 2² (from 12) and 2¹ (from 18) is 2².",
            "Look at the prime 3 again: the higher power between 3¹ (from 12) and 3² (from 18) is 3².",
            "Multiply the powers just chosen: LCM = 2² × 3² = 4 × 9 = 36.",
          ], "HCF = 6 and LCM = 36.", {
            understand: "This is the same numbers as the previous example, now solved with prime factorisation instead of listing, so the two answers can be compared directly.",
            check: "The HCF, 6, matches the answer found by listing in the previous example. Also check 6 divides both 12 and 18 exactly, and that 36 is a multiple of both 12 (36 ÷ 12 = 3) and 18 (36 ÷ 18 = 2).",
          }),
          example("Two bells ring every 45 seconds and every 60 seconds. If they ring together now, when will they next ring together?", [
            "Write each number as a product of primes: 45 = 3² × 5, and 60 = 2² × 3 × 5.",
            "For the LCM, take the higher power of each prime that appears in either number. For 2: it appears in 60 as 2², and not at all in 45, so take 2².",
            "For 3: 45 has 3² and 60 has only 3¹. Take the higher power, 3².",
            "For 5: both numbers have 5¹, so take 5¹.",
            "Multiply the chosen powers together: LCM = 2² × 3² × 5 = 4 × 9 × 5 = 36 × 5 = 180.",
          ], "They next ring together after 180 seconds, which is 3 minutes.", {
            understand: "The next time both bells ring together must be a time that is a multiple of 45 AND a multiple of 60, so this calls for the lowest common multiple.",
            check: "180 ÷ 45 = 4 exactly and 180 ÷ 60 = 3 exactly, confirming 180 is a genuine common multiple, and no smaller positive number satisfies both divisions exactly.",
          }),
          example("Find the greatest square tile that can cover a 252 cm by 198 cm rectangle without cutting any tiles. How many tiles are needed?", [
            "Write each number as a product of primes: 252 = 2² × 3² × 7, and 198 = 2 × 3² × 11.",
            "For the HCF, take the lower power of each prime shared by both numbers. For 2: 252 has 2² but 198 has only 2¹, so take 2¹. The prime 7 appears only in 252, and the prime 11 appears only in 198, so neither counts towards the HCF.",
            "For 3: both have 3², so take 3².",
            "Multiply the chosen powers: HCF = 2 × 3² = 2 × 9 = 18. So each square tile is 18 cm by 18 cm.",
            "Find how many tiles fit along the 252 cm side: 252 ÷ 18 = 14.",
            "Find how many tiles fit along the 198 cm side: 198 ÷ 18 = 11.",
            "Multiply the two counts to find the total number of tiles: 14 × 11 = 154.",
          ], "The greatest tile is 18 cm square, and 154 tiles are needed.", {
            understand: "The tile's side length must divide both 252 and 198 exactly, with no cutting, and we want the greatest such length, so this calls for HCF(252, 198).",
            check: "14 × 18 = 252 and 11 × 18 = 198, confirming the tiles fit exactly along both sides with none left over.",
          })
        ],
        { q: "Find the HCF and LCM of 84 and 126 using prime factorisation.", answer: "84 = 2² × 3 × 7 and 126 = 2 × 3² × 7. For the HCF, take the lower power of each shared prime: 2¹, 3¹ and 7¹, giving HCF = 2 × 3 × 7 = 42. For the LCM, take the higher power of each prime: 2², 3² and 7¹, giving LCM = 2² × 3² × 7 = 4 × 9 × 7 = 252." },
        { note: "Do not use the higher powers for the HCF. The result may then fail to divide one of the original numbers. Check an HCF by dividing both originals by it." }
      ),
      section(
        "3. Remainders and modular arithmetic",
        [
          "A clock does not display 15 o'clock. After the hand passes 12, it starts another cycle and points to 3. The clock has kept only the remainder after groups of 12 have been removed. Modular arithmetic gives us a compact language for this kind of repeating behaviour.",
          "The statement 15 mod 12 = 3 means that dividing 15 by 12 leaves remainder 3. More generally, a mod n is the remainder when a is divided by n. The remainder must be at least 0 and smaller than n.",
          "Numbers with the same remainder behave alike within that cycle. For example, 3, 15 and 27 all leave remainder 3 when divided by 12. We write 15 ≡ 3 (mod 12), read as ‘15 is congruent to 3 modulo 12’.",
          "Remainders can simplify large calculations. Instead of evaluating a huge power first, follow its remainder pattern. Powers of 2 modulo 5 have remainders 2, 4, 3, 1 and then repeat. Once the remainder returns to 1, multiplying by 2 begins the same cycle again.",
          "To use a cycle, identify its length and locate the exponent within it. If the exponent leaves remainder 0 when divided by the cycle length, use the final position in the cycle, not a position labelled zero."
        ],
        [
          example("Find 38 mod 6.", ["Six groups of 6 make 36, since 6 × 6 = 36. Seven groups would make 42, which is already more than 38, so six is as many as fit.", "Subtract: 38 − 36 = 2."], "38 mod 6 = 2.", {
            understand: "We want the remainder after removing as many complete groups of 6 as possible from 38.",
            check: "2 is smaller than 6, as a remainder must always be, so this is a valid remainder.",
          }),
          example("Today is Tuesday. What day will it be in 45 days?", [
            "Divide: 45 ÷ 7 = 6 remainder 3, since 6 × 7 = 42 and 45 − 42 = 3.",
            "So we only need to move forward 3 days from Tuesday, not 45.",
            "Count forward 3 days one at a time: 1 day after Tuesday is Wednesday, 2 days after is Thursday, 3 days after is Friday.",
          ], "Friday.", {
            understand: "The days of the week repeat every 7 days, so only the remainder of 45 ÷ 7 actually matters: whole weeks bring us back to the same day, and only the leftover days move us on.",
            check: "45 = 6 × 7 + 3, so 6 complete weeks and 3 extra days really do add up to 45 days in total.",
          }),
          example("Find 2¹⁰ mod 5 using a cycle.", [
            "2¹ = 2. Divided by 5, that is 0 remainder 2.",
            "2² = 4. Divided by 5, that is 0 remainder 4.",
            "2³ = 8. Divided by 5, that is 1 remainder 3 (since 5 × 1 = 5, and 8 − 5 = 3).",
            "2⁴ = 16. Divided by 5, that is 3 remainder 1 (since 5 × 3 = 15, and 16 − 15 = 1).",
            "The remainder has returned to 1, which is where the pattern for 2¹ would have started if we had begun one step earlier, so the remainders repeat from here. This means the cycle has length 4: position 1 gives remainder 2, position 2 gives remainder 4, position 3 gives remainder 3, position 4 gives remainder 1, then it repeats.",
            "To find 2¹⁰, find where position 10 falls in this cycle of length 4. Divide: 10 ÷ 4 = 2 remainder 2.",
            "A remainder of 2 means position 10 lines up with position 2 in the cycle, which gave remainder 4.",
          ], "2¹⁰ mod 5 = 4.", {
            understand: "Rather than calculating 2¹⁰ directly (which is 1024, a much bigger calculation), track only the remainder after each multiplication by 2, and look for the point where the remainders start repeating.",
            check: "2¹⁰ = 1024, and 1024 ÷ 5 = 204 remainder 4 (since 204 × 5 = 1020, and 1024 − 1020 = 4), matching the answer found using the cycle.",
          }),
          example("Find the final digit of 7²⁰²⁶.", [
            "7¹ = 7. Final digit 7.",
            "7² = 49. Final digit 9.",
            "7³ = 343. Final digit 3.",
            "7⁴ = 2401. Final digit 1.",
            "The final digit has returned to a fresh cycle start, so the pattern of final digits (7, 9, 3, 1) repeats with cycle length 4.",
            "To find the final digit of 7²⁰²⁶, find where position 2026 falls in this cycle of length 4. Divide: 2026 ÷ 4 = 506 remainder 2 (since 506 × 4 = 2024, and 2026 − 2024 = 2).",
            "A remainder of 2 means position 2026 lines up with position 2 in the cycle, which gave final digit 9.",
          ], "The final digit is 9.", {
            understand: "The final digit of any whole number is exactly its remainder when divided by 10, so this is asking for the remainder of 7²⁰²⁶ when divided by 10, and directly calculating a number with 2026 as a power is not realistic by hand.",
            check: "The cycle 7, 9, 3, 1 has been checked directly for the first four powers, and every fourth power afterwards must return to the same starting point, since multiplying by 7 four times in a row is the same repeated step each time.",
          })
        ],
        { q: "Find 3¹⁰⁰ mod 8.", answer: "List the remainders of powers of 3 when divided by 8: 3¹ = 3 (remainder 3), 3² = 9 (remainder 1, since 9 − 8 = 1), 3³ = 27 (remainder 3, since 27 − 24 = 3), 3⁴ = 81 (remainder 1, since 81 − 80 = 1). The remainders repeat with cycle length 2: position 1 gives remainder 3, position 2 gives remainder 1. Divide 100 by the cycle length: 100 ÷ 2 = 50 remainder 0. A remainder of 0 means position 100 lines up with the FINAL position in the cycle (position 2, not a 'position 0'), which gave remainder 1. So 3¹⁰⁰ mod 8 = 1." },
        { note: "A common mistake is to subtract the modulus only once. The remainder is what remains after removing as many complete groups as possible, and it must be smaller than the modulus." }
      )
    ],
    [
      "Prime factorisation expresses a whole number using prime building blocks.",
      "The HCF is the greatest number that divides all the given numbers exactly.",
      "The LCM is the smallest positive number divisible by all the given numbers.",
      "Modular arithmetic records remainders and makes repeating cycles manageable."
    ],
    [
      "Stopping a prime factorisation when the quotient is merely odd rather than prime.",
      "Using higher prime powers for an HCF or lower powers for an LCM without checking the meaning.",
      "Allowing a remainder to equal or exceed the divisor.",
      "Treating a zero remainder in an exponent cycle as though it meant the first position."
    ]
  );

  lessons.algebraicManipulation = lesson(
    "Algebraic Manipulation: seeing structure before calculating",
    2,
    [{ module: "junior", key: "multiExpr" }],
    "Algebra is a way of describing number patterns without choosing the numbers in advance. The symbols are not obstacles to remove. They let one argument work for every value at once. This lesson develops three closely connected skills: expanding brackets, reversing that process by factorising and recognising the special pattern called a difference of two squares.",
    [
      section("1. Expanding two brackets", [
        "Start with a rectangle whose sides are already known numbers, before any letters appear at all: 13 cm by 15 cm. One way to find its area is to multiply directly: 13 × 15 = 195 cm². But there is a second, slower way to find the exact same area, and it is worth doing once with plain numbers because it is exactly the method the rest of this section relies on.",
        "Split each side into two friendlier pieces: 13 = 10 + 3, and 15 = 10 + 5. Now the rectangle is really a big rectangle made of four smaller rectangles pushed together: one measuring 10 by 10, one measuring 10 by 5, one measuring 3 by 10, and one measuring 3 by 5. Each of those four smaller areas is easy to work out on its own: 10 × 10 = 100, 10 × 5 = 50, 3 × 10 = 30, and 3 × 5 = 15.",
        "Add the four small areas together: 100 + 50 + 30 + 15 = 195. That matches the direct multiplication, 13 × 15 = 195, exactly. Splitting a multiplication into four smaller, easier multiplications and then adding them back up did not change the answer: it just broke one hard step into four easy ones.",
        "Now replace the fixed number 13 with an unknown length, x + 3, and replace 15 with x + 5. The rectangle's sides are x + 3 and x + 5, and its area is (x + 3)(x + 5): this just means 'the two side lengths, multiplied together', exactly as 13 × 15 meant before. We can find this area the same slow way as before, splitting each side into its two pieces: x and 3 along one side, x and 5 along the other. That gives four smaller regions again: x × x, x × 5, 3 × x, and 3 × 5.",
        "Work out each of the four regions in turn, the same way as with the numbers. x × x is written x² (read 'x squared'), and means x multiplied by itself; it is not the same as 2 × x, which would mean 'two lots of x'. x × 5 is written 5x, meaning 5 lots of x. 3 × x is written 3x, meaning 3 lots of x. And 3 × 5 = 15, an ordinary number with no x in it at all.",
        "Add the four regions together, exactly as the four numeric areas were added before: x² + 5x + 3x + 15. Two of these four terms, 5x and 3x, are both 'a number of lots of x', so they can be combined into a single term the same way 2 apples and 3 apples combine into 5 apples: 5x + 3x = 8x. The other two terms, x² and 15, have nothing in common with each other or with the x terms, so they are left exactly as they are. This gives the fully expanded and simplified form: x² + 8x + 15.",
        "This whole process, splitting each bracket into its two terms, multiplying every term in the first bracket by every term in the second, and then combining any terms that match, is called expanding the brackets. There are always four products to start with whenever both brackets contain exactly two terms, because each of the first bracket's two terms must be multiplied by each of the second bracket's two terms: 2 × 2 = 4.",
        "Two terms are 'like terms', and can be combined into one, only when their letter parts match exactly, not just when they look similar. 5x and 3x are like terms because they are both 'a number of x's', so they combine into 8x. But x² and x are not like terms, even though they share the same letter: x² means x multiplied by itself, a completely different quantity from x on its own, in the same way that a square metre is a different kind of quantity from a metre. So x² and x can never be combined by adding or subtracting, no matter what their coefficients are.",
        "Now see what changes when one of the four terms inside a bracket is negative, using (x - 4)(x + 2) as a concrete case. It is tempting to read the first bracket as 'x, then subtract 4 at the end', but the minus sign is actually attached to the 4 itself: the first bracket's two terms are x and -4, a positive term and a negative term, just like before. Multiplying out gives four products again: x × x = x², x × 2 = 2x, -4 × x = -4x, and -4 × 2 = -8. Carrying the minus sign along with the 4 into every product it takes part in, rather than multiplying with 4 and fixing the sign afterwards, is what keeps this reliable. Adding the four products and combining the like terms, 2x and -4x, gives x² - 2x - 8.",
        "A wrong but common shortcut is to multiply the number parts as if they were both positive, and only remember the minus sign for the final product: this would wrongly turn -4 × 2 into +8 instead of -8, and would usually also lose the sign on the -4x term along the way. Carrying every sign through every single multiplication, one product at a time, is what avoids this.",
        "After expanding and collecting like terms, it is worth checking the result rather than trusting it blindly, and there is a quick way to do this that does not require redoing the whole expansion. Substitute a small number, such as x = 1, into both the original brackets and the expanded answer, and check the two calculations agree. For (x + 2)(x + 3) at x = 1: the brackets give (1 + 2)(1 + 3) = 3 × 4 = 12. The expanded form, x² + 5x + 6, gives 1² + 5(1) + 6 = 1 + 5 + 6 = 12. The two values match, which is good evidence the expansion is correct. If they had not matched, that would prove an error was made somewhere, though a match does not prove there is no error, since a mistake could coincidentally still give the right value at that one particular number.",
      ], [
        example("Expand (x + 2)(x + 3).", [
          "There are two terms in the first bracket (x and 2) and two terms in the second bracket (x and 3), so there will be 2 × 2 = 4 products in total, before any collecting.",
          "Multiply the first term of the first bracket, x, by the first term of the second bracket, x: x × x = x².",
          "Multiply x by the second term of the second bracket, 3: x × 3 = 3x.",
          "Multiply the second term of the first bracket, 2, by x: 2 × x = 2x.",
          "Multiply 2 by 3: 2 × 3 = 6.",
          "Write down all four products before combining anything: x² + 3x + 2x + 6.",
          "Collect the like terms (the two terms with a single x): 3x + 2x = 5x.",
        ], "x² + 5x + 6.", {
          understand: "There are two terms in each bracket, so multiplying them out will produce 2 × 2 = 4 separate products before anything is collected.",
          check: "Substitute x = 1 into both the original brackets and the answer: (1 + 2)(1 + 3) = 3 × 4 = 12, and 1² + 5(1) + 6 = 1 + 5 + 6 = 12, matching.",
        }),
        example("Expand (x - 4)(x + 2).", [
          "The first bracket's second term is -4, not 4; carry the minus sign with it into every product it takes part in.",
          "Multiply x by x: x × x = x².",
          "Multiply x by 2: x × 2 = 2x.",
          "Multiply -4 by x: -4 × x = -4x.",
          "Multiply -4 by 2: -4 × 2 = -8.",
          "Write down all four products: x² + 2x - 4x - 8.",
          "Collect the like terms: 2x - 4x = -2x.",
        ], "x² - 2x - 8.", {
          understand: "The first bracket's second term is -4, not 4, so the minus sign must be carried into every product it takes part in.",
          check: "Substitute x = 1: (1 - 4)(1 + 2) = (-3)(3) = -9, and 1² - 2(1) - 8 = 1 - 2 - 8 = -9, matching.",
        }),
        example("Expand (2x + 3)(x - 5).", [
          "Multiply the first term of the first bracket, 2x, by the first term of the second bracket, x: 2x × x = 2x².",
          "Multiply 2x by the second term of the second bracket, -5: 2x × (-5) = -10x.",
          "Multiply the second term of the first bracket, 3, by x: 3 × x = 3x.",
          "Multiply 3 by -5: 3 × (-5) = -15.",
          "Write down all four products: 2x² - 10x + 3x - 15.",
          "Collect the like terms: -10x + 3x = -7x.",
        ], "2x² - 7x - 15.", {
          understand: "Multiply every term in the first bracket by every term in the second, keeping track of the negative sign on the -5.",
          check: "Substitute x = 1: (2(1) + 3)(1 - 5) = (5)(-4) = -20, and 2(1)² - 7(1) - 15 = 2 - 7 - 15 = -20, matching.",
        }),
        example("Expand and simplify (3x - 2)(2x + 5) - (x + 1)².", [
          "This has two separate brackets to expand before any subtracting, so expand each one fully on its own first.",
          "Expand (3x - 2)(2x + 5): multiply 3x by 2x to get 6x², multiply 3x by 5 to get 15x, multiply -2 by 2x to get -4x, multiply -2 by 5 to get -10.",
          "Write these four products together: 6x² + 15x - 4x - 10, and collect the like terms: 15x - 4x = 11x. So (3x - 2)(2x + 5) = 6x² + 11x - 10.",
          "Now expand (x + 1)², which means (x + 1)(x + 1): multiply x by x to get x², multiply x by 1 to get x, multiply 1 by x to get x, multiply 1 by 1 to get 1.",
          "Write these four products together: x² + x + x + 1, and collect the like terms: x + x = 2x. So (x + 1)² = x² + 2x + 1.",
          "Now write the full subtraction using both expanded brackets, without simplifying yet: (6x² + 11x - 10) - (x² + 2x + 1).",
          "Subtracting a whole bracket means every term inside it changes sign. Remove the brackets carefully: 6x² + 11x - 10 - x² - 2x - 1.",
          "Collect the x² terms: 6x² - x² = 5x².",
          "Collect the x terms: 11x - 2x = 9x.",
          "Collect the number terms: -10 - 1 = -11.",
        ], "5x² + 9x - 11.", {
          understand: "This has two separate brackets to expand before any subtracting, so expand each one fully on its own first, then subtract the whole second result, changing every sign as it comes out of the brackets.",
          check: "Substitute x = 1: (3(1) - 2)(2(1) + 5) - (1 + 1)² = (1)(7) - (2)² = 7 - 4 = 3, and 5(1)² + 9(1) - 11 = 5 + 9 - 11 = 3, matching.",
        })
      ], { q: "Expand and simplify (2x - 7)(3x + 4).", answer: "Multiply 2x by 3x to get 6x², multiply 2x by 4 to get 8x, multiply -7 by 3x to get -21x, multiply -7 by 4 to get -28. Together: 6x² + 8x - 21x - 28. Collecting the x terms, 8x - 21x = -13x, giving 6x² - 13x - 28." }, { note: "Do not combine x² and x. The exponent is part of the variable term, so they represent different kinds of quantity.", visual: "intermediate-expand-brackets-area" }),

      section("2. Factorising a quadratic", [
        "Multiply out (x + 3)(x + 4) using the splitting method from the last section: the four products are x², 4x, 3x and 12, which combine to x² + 7x + 12. Factorising is exactly the reverse journey. Starting from x² + 7x + 12, without being told the brackets in advance, the job is to work backwards and discover that it came from (x + 3)(x + 4).",
        "Look closely at where the two numbers in that expansion actually came from, since this is the key to reversing the process. The constant term, 12, came from multiplying the two numbers inside the brackets: 3 × 4 = 12. The coefficient of x, 7, came from adding those same two numbers: 3 + 4 = 7. This is not a coincidence specific to this one example. Multiplying out (x + p)(x + q) always gives x² + (p + q)x + pq, whatever p and q are, because the splitting method always produces exactly those four products, and the two middle ones, px and qx, always combine into (p + q)x.",
        "So to factorise x² + bx + c, the job becomes: find two numbers whose product is c and whose sum is b. To factorise x² + 7x + 12, ask which two numbers multiply to give 12 and add to give 7. List every pair that multiplies to 12: 1 and 12 (sum 13), 2 and 6 (sum 8), 3 and 4 (sum 7). The last pair, 3 and 4, has sum 7, so those are the numbers, giving the factorisation (x + 3)(x + 4), exactly matching where this section started.",
        "The signs of b and c give useful clues about the signs of the two numbers, before any listing even begins. If c is positive, the two numbers must have the same sign as each other, since a positive times a positive is positive and so is a negative times a negative. The sign of b then decides which: both positive if b is also positive, both negative if b is negative. For example, x² - 7x + 12 needs two numbers with product 12 (positive) and sum -7 (negative), so both numbers must be negative: -3 and -4, giving (x - 3)(x - 4). If c is negative, on the other hand, the two numbers must have opposite signs, since only a positive times a negative gives a negative product.",
        "Everything so far has assumed the coefficient of x² is exactly 1. When it is not, as in 2x² + 7x + 3, the pattern above does not directly apply, because the constant term is no longer simply the product of the two bracket numbers. A reliable method for this harder case is to multiply the coefficient of x² by the constant term first: 2 × 3 = 6. Then find two numbers whose product is that 6 and whose sum is the coefficient of x, 7: those numbers are 6 and 1. Use them to split the middle term into two pieces, 7x = 6x + x, rewriting the expression as 2x² + 6x + x + 3. Group the four terms into two pairs, (2x² + 6x) and (x + 3), and factorise each pair separately: 2x² + 6x = 2x(x + 3), and x + 3 = 1(x + 3). Both pairs now share the same bracket, (x + 3), which can be taken out as a common factor: 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3).",
        "Factorising is exact, not approximate, so a completed factorisation can always be checked by expanding it back out using the four-products method from the last section, and comparing the result term by term with the original expression, including every sign."
      ], [
        example("Factorise x² + 5x + 6.", [
          "List the pairs of whole numbers that multiply to give 6: 1 and 6 (sum 7), 2 and 3 (sum 5).",
          "The pair 2 and 3 has product 6 and sum 5, exactly matching what we need.",
          "Place these two numbers into the brackets alongside x: (x + 2)(x + 3).",
        ], "(x + 2)(x + 3).", {
          understand: "We need two numbers whose product is the constant term, 6, and whose sum is the coefficient of x, 5.",
          check: "Expand back using the four-products method: x² + 3x + 2x + 6 = x² + 5x + 6, matching the original expression.",
        }),
        example("Factorise x² - x - 12.", [
          "Try pairs that multiply to -12: 3 and -4 (sum -1), or -3 and 4 (sum 1), or 2 and -6 (sum -4), or -2 and 6 (sum 4).",
          "The pair 3 and -4 has product 3 × (-4) = -12 and sum 3 + (-4) = -1, exactly matching what we need.",
          "Place these two numbers into the brackets: (x + 3)(x - 4).",
        ], "(x + 3)(x - 4).", {
          understand: "We need two numbers whose product is -12 and whose sum is -1 (the coefficient of x, remembering x on its own means 1x with coefficient -1). Since the product is negative, the two numbers must have opposite signs.",
          check: "Expand back: x² - 4x + 3x - 12 = x² - x - 12, matching the original expression.",
        }),
        example("Factorise 2x² + 7x + 3.", [
          "Find two numbers whose product is 6 and whose sum is 7: trying pairs of factors of 6, 1 and 6 have sum 7, so those are the numbers we need.",
          "Use those two numbers, 1 and 6, to split the middle term 7x into two parts: 7x = 6x + x. Rewrite the whole expression with the middle term split: 2x² + 6x + x + 3.",
          "Group the expression into two pairs of terms: (2x² + 6x) + (x + 3).",
          "Factorise the first pair, taking out the shared factor of 2x: 2x² + 6x = 2x(x + 3).",
          "Factorise the second pair, taking out a shared factor of 1: x + 3 = 1(x + 3).",
          "Both pairs now share the bracket (x + 3), so this common bracket can be taken out: 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3).",
        ], "(2x + 1)(x + 3).", {
          understand: "The coefficient of x² is 2, not 1, so the simple product-and-sum method from the last two examples does not directly apply. Instead, multiply the coefficient of x² by the constant term first: 2 × 3 = 6, then find two numbers with that product whose sum is the coefficient of x.",
          check: "Expand back: 2x × x = 2x², 2x × 3 = 6x, 1 × x = x, 1 × 3 = 3, giving 2x² + 6x + x + 3 = 2x² + 7x + 3, matching the original expression.",
        }),
        example("Factorise 6x² - 7x - 3.", [
          "Since the product, -18, is negative, the two numbers have opposite signs. Trying pairs: -9 and 2 give product -18 and sum -7, exactly matching what we need.",
          "Split the middle term -7x using these two numbers: -7x = -9x + 2x. Rewrite the expression: 6x² - 9x + 2x - 3.",
          "Group into two pairs: (6x² - 9x) + (2x - 3).",
          "Factorise the first pair, taking out the shared factor of 3x: 6x² - 9x = 3x(2x - 3).",
          "Factorise the second pair, taking out a shared factor of 1: 2x - 3 = 1(2x - 3).",
          "Both pairs now share the bracket (2x - 3), so take it out: 3x(2x - 3) + 1(2x - 3) = (3x + 1)(2x - 3).",
        ], "(3x + 1)(2x - 3).", {
          understand: "The coefficient of x² is 6, so again multiply it by the constant term first: 6 × (-3) = -18, then find two numbers with that product whose sum is the coefficient of x, -7.",
          check: "Expand back: 3x × 2x = 6x², 3x × (-3) = -9x, 1 × 2x = 2x, 1 × (-3) = -3, giving 6x² - 9x + 2x - 3 = 6x² - 7x - 3, matching the original expression.",
        })
      ], { q: "Factorise 3x² + 11x + 6.", answer: "Multiply the coefficient of x² by the constant term: 3 × 6 = 18. Find two numbers with product 18 and sum 11: those are 9 and 2. Split the middle term: 3x² + 9x + 2x + 6. Group and factorise each pair: 3x(x + 3) + 2(x + 3). Take out the shared bracket: (3x + 2)(x + 3). Check by expanding: 3x × x = 3x², 3x × 3 = 9x, 2 × x = 2x, 2 × 3 = 6, giving 3x² + 9x + 2x + 6 = 3x² + 11x + 6." }, { note: "Finding numbers with the correct product but the wrong sum is not enough. Both conditions must be satisfied." }),

      section("3. The difference of two squares", [
        "Multiply (10 + 3)(10 - 3) directly, term by term, before anything is simplified: 10 × 10 = 100, 10 × (-3) = -30, 3 × 10 = 30, and 3 × (-3) = -9. Adding the four products: 100 - 30 + 30 - 9. The middle two terms, -30 and +30, are exact opposites, so they cancel completely, leaving just 100 - 9 = 91.",
        "Check this against multiplying 13 × 7 directly, since (10 + 3) = 13 and (10 - 3) = 7: 13 × 7 = 91, matching exactly. This is not a coincidence. Whenever a bracket pair has the same two terms but opposite signs in the middle, like (a + b)(a - b), the two 'cross' products, +ab and -ab, are always exact opposites, so they always cancel, leaving only a² - b².",
        "Replacing 10 with the letter a and 3 with the letter b makes this general: (a + b)(a - b) = a² - ab + ab - b² = a² - b², since the two middle terms always cancel whatever a and b are. This shortcut is called the difference of two squares, and it lets you skip straight from (a + b)(a - b) to a² - b² without writing out all four products every time.",
        "Used in reverse, this shortcut factorises an expression that is already in the form (something)² - (something else)² straight into two brackets. Take x² - 25 as a concrete case. Check the two requirements first: there must be a subtraction (yes), and both terms must be perfect squares. x² is a perfect square because it is x multiplied by itself. 25 is a perfect square too, since 5 × 5 = 25, so 25 = 5². Matching this to a² - b² with a = x and b = 5, the identity gives (a + b)(a - b) = (x + 5)(x - 5).",
        "It is tempting to try the same trick on x² + 25, since it also has two square terms, but this pattern only ever works for a subtraction, never an addition. Expanding (x + 5)(x - 5) gives x² - 25, not x² + 25, so those brackets are simply the wrong factorisation for a sum of squares. In fact, x² + 25 cannot be factorised at all using real numbers.",
        "Sometimes an expression only reveals this pattern once a common factor has been removed first. In 3x² - 75, the two terms are not obviously two perfect squares as they stand, but they do share a common factor of 3. Taking that out first gives 3(x² - 25), and now the bracket, x² - 25, matches the pattern exactly, as shown above.",
        "The same shortcut works just as well backwards, turning a hard-looking multiplication into an easy subtraction. To calculate 103 × 97 without long multiplication, notice both numbers are exactly 3 away from 100, one above and one below: 103 × 97 = (100 + 3)(100 - 3) = 100² - 3² = 10,000 - 9 = 9,991."
      ], [
        example("Factorise x² - 16.", [
          "x² is a perfect square: it is x multiplied by itself.",
          "16 is a perfect square too: 4 × 4 = 16, so 16 = 4².",
          "Since x² - 16 matches the pattern a² - b² with a = x and b = 4, use the identity a² - b² = (a + b)(a - b).",
          "Substitute a = x and b = 4 into (a + b)(a - b): (x + 4)(x - 4).",
        ], "(x + 4)(x - 4).", {
          understand: "Check the two requirements for this pattern: there must be a subtraction (yes), and both terms must be perfect squares.",
          check: "Expand back: x × x = x², x × (-4) = -4x, 4 × x = 4x, 4 × (-4) = -16, giving x² - 4x + 4x - 16 = x² - 16, since the -4x and 4x cancel exactly, matching the original expression.",
        }),
        example("Factorise 9x² - 25.", [
          "9x² = (3x)², since 3x × 3x = 9x².",
          "25 = 5², since 5 × 5 = 25.",
          "This matches a² - b² with a = 3x and b = 5.",
          "Substitute into (a + b)(a - b): (3x + 5)(3x - 5).",
        ], "(3x + 5)(3x - 5).", {
          understand: "Check both terms are perfect squares before using the identity.",
          check: "Expand back: 3x × 3x = 9x², 3x × (-5) = -15x, 5 × 3x = 15x, 5 × (-5) = -25, giving 9x² - 15x + 15x - 25 = 9x² - 25, matching the original expression.",
        }),
        example("Factorise 3x² - 75 fully.", [
          "Take out the common factor of 3: 3x² - 75 = 3(x² - 25).",
          "Now look inside the bracket: x² - 25 has a subtraction, and both terms are perfect squares (x² = x², and 25 = 5²), so it matches a² - b² with a = x and b = 5.",
          "Substitute into (a + b)(a - b): x² - 25 = (x + 5)(x - 5).",
          "Bring back the factor of 3 that was taken out at the start: 3(x + 5)(x - 5).",
        ], "3(x + 5)(x - 5).", {
          understand: "Before looking for a difference of two squares, check whether the two terms share a common factor. Both 3x² and 75 are divisible by 3.",
          check: "Expand back: (x + 5)(x - 5) = x² - 25, and 3 × (x² - 25) = 3x² - 75, matching the original expression.",
        }),
        example("Calculate 103 × 97 without long multiplication.", [
          "Notice that 103 and 97 are both 3 away from 100: one is 3 more, the other is 3 less. Write the product using this: 103 × 97 = (100 + 3)(100 - 3).",
          "This matches the pattern (a + b)(a - b), which we know equals a² - b², with a = 100 and b = 3.",
          "Work out a²: 100² = 10,000.",
          "Work out b²: 3² = 9.",
          "Subtract: 10,000 - 9.",
        ], "9,991.", {
          understand: "Look for a way to write this product using the difference-of-two-squares pattern in reverse, rather than multiplying the two numbers directly.",
          check: "A quick estimate confirms this is sensible: 103 × 97 should be close to 100 × 100 = 10,000, and 9,991 is indeed very close.",
        })
      ], { q: "Factorise 20x² - 45 fully.", answer: "Both 20x² and 45 are divisible by 5, so take that out first: 20x² - 45 = 5(4x² - 9). Inside the bracket, 4x² = (2x)² and 9 = 3², so this matches a² - b² with a = 2x and b = 3: 4x² - 9 = (2x + 3)(2x - 3). Bringing back the 5: 5(2x + 3)(2x - 3)." }, { note: "Do not use this identity for a sum of squares. The cancellation depends on one bracket containing +b and the other containing -b." })
    ],
    ["Expanding multiplies every term in one bracket by every term in the other.", "Factorising reverses expansion and should always be checked by expanding.", "A difference of two squares has the form a² - b² and factorises as (a + b)(a - b)."],
    ["Losing the sign of a negative term during expansion.", "Combining terms whose variable parts do not match.", "Choosing factor pairs that have the correct product but the wrong sum.", "Using the difference-of-two-squares pattern when the terms are added."]
  );

  lessons.surdsAndIndices.sections[0].tryit = { q: "Simplify √108 fully.", answer: "√108 = √(36 × 3) = 6√3." };
  lessons.surdsAndIndices.sections[1].tryit = { q: "Rationalise 5/√10 and simplify.", answer: "5/√10 × √10/√10 = 5√10/10 = √10/2." };
  lessons.surdsAndIndices.sections[2].tryit = { q: "Evaluate 32^(-3/5).", answer: "The fifth root of 32 is 2. Cubing gives 8, then the negative index takes the reciprocal, so the answer is 1/8." };

  lessons.percentageAndCompoundGrowth = lesson(
    "Percentages and Compound Growth: changing by a proportion",
    4,
    [{ module: "primary", key: "decimalPlaceValue" }, { module: "primary", key: "fractionArithmetic" }, { module: "junior", key: "fractionUnusual" }],
    "A percentage compares an amount with 100. Percentage change is therefore multiplicative: the new amount is a particular fraction of the old one. We will turn that idea into a multiplier, apply it repeatedly for compound change and then reverse it when the final amount is known.",
    [
      section("1. Turning a percentage change into a multiplier", [
        "A shop reduces a £50 coat by 20%. One way to find the new price is to work out 20% of £50 first, then subtract it: 20% of £50 is £10, so the new price is £50 - £10 = £40. That method works, but it takes two separate steps every time, one to find the amount removed and one to subtract it.",
        "There is a faster way that reaches the same answer in a single multiplication, and it starts by asking a different question: instead of 'how much is removed', ask 'what percentage remains'. If 20% is removed from the whole 100%, then 100% - 20% = 80% remains, so the new price is simply 80% of the original £50.",
        "A percentage can be written as a decimal by dividing by 100, so 80% = 80 ÷ 100 = 0.80. This means the new price is £50 × 0.80 = £40, exactly matching the two-step answer above, but reached in one multiplication instead of two. The decimal 0.80 is called the multiplier, because multiplying the original amount by it produces the new amount directly.",
        "The same idea works for an increase, just adding to 100% instead of subtracting from it. A 12% increase leaves the original amount plus an extra 12%, so 100% + 12% = 112% of the original, giving multiplier 1.12. A 12% decrease, by contrast, leaves 100% - 12% = 88% of the original, giving multiplier 0.88. Notice the pattern: an increase always gives a multiplier bigger than 1, and a decrease always gives a multiplier smaller than 1.",
        "Writing down the multiplier before touching any of the actual numbers in the question is a habit worth building early. It separates the meaning of the change (is this an increase or a decrease, and by how much) from the arithmetic that follows, and it gives an easy way to sanity-check the final answer: an increase must always produce a result bigger than the amount started with, and a decrease must always produce something smaller.",
        "It is easy to confuse the multiplier with the amount of change itself, so it is worth stating the difference plainly. Multiplying an amount by 0.15 finds 15% of it, the change alone, not the new total. Multiplying by 1.15 finds the new total after a 15% increase. The two calculations look similar but answer completely different questions."
      ], [
        example("Write the multiplier for a 7% increase.", ["Begin with 100% of the original: that is the whole amount before anything changes.", "An increase adds to that whole, so after a 7% increase there is 100% + 7% = 107%.", "Convert 107% to a decimal by dividing by 100: 107 ÷ 100 = 1.07."], "1.07.", {
          understand: "An increase means the new amount is more than the whole original amount, so the percentage representing it must be more than 100%.",
          check: "A multiplier greater than 1 always corresponds to an increase, and 1.07 is indeed greater than 1, matching the fact that this is a 7% increase.",
        }),
        example("Increase £240 by 15%.", [
          "Write down the multiplication before calculating: £240 × 1.15.",
          "Work this out by splitting 1.15 into 1 + 0.15: 240 × 1 = 240, and 240 × 0.15 = 36.",
          "Add the two parts together: 240 + 36 = 276.",
        ], "£276.", {
          understand: "A 15% increase means the new amount is 100% + 15% = 115% of the original, so the multiplier is 1.15.",
          check: "The result, £276, is bigger than the original £240, as it should be for an increase; also, 36 (the extra 15%) is a reasonable amount for 15% of a value around 240.",
        }),
        example("Decrease 680 by 22%.", [
          "Write down the multiplication: 680 × 0.78.",
          "Work this out by splitting 0.78 into 0.8 - 0.02: 680 × 0.8 = 544, and 680 × 0.02 = 13.6.",
          "Subtract the second part from the first: 544 - 13.6 = 530.4.",
        ], "530.4.", {
          understand: "A 22% decrease leaves 100% - 22% = 78% remaining, so the multiplier is 0.78.",
          check: "The result, 530.4, is smaller than the original 680, as it should be for a decrease.",
        }),
        example("A population of 48,000 rises by 6% and then falls by 6%. Find the final population.", [
          "A 6% rise uses multiplier 1.06 (100% + 6%). Apply it first, to the original population: 48,000 × 1.06 = 50,880.",
          "A 6% fall uses multiplier 0.94 (100% - 6%). Apply it to the result of the rise, 50,880, not to the original 48,000: 50,880 × 0.94 = 47,827.2.",
        ], "47,827.2, or about 47,827 people.", {
          understand: "Two changes happen one after the other, so each multiplier must be applied to the result of the previous step, not both to the original 48,000.",
          check: "The two multipliers do not cancel out, even though 6% and 6% look like opposites: 1.06 × 0.94 = 0.9964, which is slightly less than 1, so the population correctly ends up slightly below where it started, not exactly back at 48,000.",
        })
      ], { q: "A laptop costing £850 is reduced by 18%. Find the sale price.", answer: "An 18% decrease leaves 100% - 18% = 82%, so the multiplier is 0.82. Calculate £850 × 0.82: splitting 0.82 into 0.8 + 0.02, 850 × 0.8 = 680 and 850 × 0.02 = 17, so 680 + 17 = 697. The sale price is £697." }, { note: "Do not use 0.18 as the multiplier for an 18% decrease. That finds the amount removed, not the amount remaining." }),

      section("2. Compound growth and decay", [
        "Suppose £1,000 earns 5% interest each year. After the first year, the multiplier method from the last section gives £1,000 × 1.05 = £1,050. Now think carefully about the second year: is the 5% calculated from the original £1,000 again, or from the new amount, £1,050? For compound interest, it is calculated from £1,050, the latest amount, not the original one. The change itself has begun to change: each year's 5% is bigger than the year before, since it is 5% of a growing amount.",
        "This repeated proportional change, where each period's change is based on the result of the previous period rather than the original amount, is called compound growth. Each year multiplies the current amount by 1.05 again. After two years: £1,000 × 1.05 × 1.05. After three years: £1,000 × 1.05 × 1.05 × 1.05, which is written more neatly using a power, 1,000 × 1.05³, since multiplying by the same number three times in a row is exactly what a cube (a power of 3) means.",
        "This gives a general model that works for any number of periods: new amount = original amount × multiplier raised to the power of the number of periods. A period might be a year, a month, a day or any other repeated interval, as long as the rate given and the number of periods being counted both refer to the same length of time.",
        "Compound decay works in exactly the same way, just with a multiplier below 1 instead of above it. A machine that loses 12% of its value every year retains 100% - 12% = 88% of its value each year, so its value after n years is the original value multiplied by 0.88 raised to the power n. The only real difference from compound growth is that the multiplier shrinks the amount each time, rather than growing it.",
        "Round money, or any other final answer, only at the very end of the calculation, unless a question specifically asks for the value after each period. Rounding after every single period changes the exact amount being carried forward into the next multiplication, and those small roundings can build up into a noticeably wrong final answer over several periods."
      ], [
        example("£500 earns 4% interest for one year. Find its value.", ["Calculate £500 × 1.04: splitting 1.04 into 1 + 0.04, 500 × 1 = 500 and 500 × 0.04 = 20, so 500 + 20 = 520."], "£520.", {
          understand: "A 4% increase uses multiplier 1.04, and with only one year involved, this is a single multiplication, not yet a compound calculation.",
          check: "The result, £520, is bigger than the original £500, as it should be for an increase.",
        }),
        example("£500 earns 4% compound interest for three years.", [
          "Write this as a repeated multiplication: £500 × 1.04 × 1.04 × 1.04, which is written more neatly as 500 × 1.04³.",
          "Work out 1.04³ first, one multiplication at a time: 1.04 × 1.04 = 1.0816.",
          "Multiply that result by 1.04 again: 1.0816 × 1.04 = 1.124864.",
          "Now multiply by the original £500: 500 × 1.124864 = 562.432.",
          "Round to the nearest penny, since this is an amount of money.",
        ], "£562.43 to the nearest penny.", {
          understand: "Because the interest compounds, the same multiplier, 1.04, is applied once for every year that passes: three times in total, not three separate additions of the same amount.",
          check: "Compare with simple (non-compounding) interest for a rough check: 4% of £500 is £20 a year, so three years of simple interest would give £560. The compound answer, £562.43, is a little more than that, which makes sense because compounding earns interest on interest as well.",
        }),
        example("A car worth £24,000 loses 18% of its value each year. Find its value after four years.", [
          "The loss compounds every year, so this multiplier is applied four times: 24,000 × 0.82⁴.",
          "Work out 0.82⁴ one multiplication at a time. First, 0.82 × 0.82 = 0.6724.",
          "Then square that result to get the power of 4: 0.6724 × 0.6724 = 0.45212176 (since 0.82⁴ = (0.82²)²).",
          "Multiply by the original value: 24,000 × 0.45212176 = 10,850.92224.",
          "Round to the nearest pound.",
        ], "About £10,851.", {
          understand: "An 18% decrease leaves 100% - 18% = 82%, so the multiplier is 0.82, applied once for every one of the four years.",
          check: "The result, about £10,851, is less than half the original £24,000, which is plausible after four years of losing nearly a fifth of the value each time.",
        }),
        example("A culture grows by 3% every hour. How long does it take 2,000 cells to exceed 2,500 cells?", [
          "Try n = 7: 1.03⁷ ≈ 1.2299, so the count is about 2,000 × 1.2299 ≈ 2,460, still below 2,500.",
          "Try n = 8: 1.03⁸ ≈ 1.2668, so the count is about 2,000 × 1.2668 ≈ 2,534, which is above 2,500.",
        ], "It first exceeds 2,500 after 8 hours.", {
          understand: "A 3% increase each hour uses multiplier 1.03, compounding every hour, so after n hours the count is 2,000 × 1.03ⁿ. This question asks for the smallest whole number of hours for which that count first exceeds 2,500, so test whole-number values of n in turn.",
          check: "Since 7 hours gives a count below 2,500 and 8 hours gives a count above 2,500, 8 is confirmed as the first whole hour where the count exceeds 2,500.",
        })
      ], { q: "A substance has mass 80 g and loses 7% each day. Find its mass after five days.", answer: "A 7% decrease leaves 93%, so the multiplier is 0.93, applied once per day for 5 days: 80 × 0.93⁵. Working out 0.93⁵ one step at a time: 0.93² = 0.8649, 0.93³ = 0.8649 × 0.93 = 0.804357, 0.93⁴ = 0.804357 × 0.93 ≈ 0.748052, 0.93⁵ = 0.748052 × 0.93 ≈ 0.695688. Multiplying by 80: 80 × 0.695688 ≈ 55.655, which rounds to 55.66 g." }, { note: "Simple change repeatedly uses the original amount. Compound change repeatedly uses the latest amount. Do not add the same percentage amount each period." , visual: "intermediate-compound-growth"}),

      section("3. Reverse percentages", [
        "A jacket costs £72 after a 20% reduction. It is tempting to find 20% of £72 and add it back on, guessing the original price was £72 + (20% of £72) = £72 + £14.40 = £86.40. This reasoning is wrong, and it is worth seeing exactly why before learning the correct method.",
        "The mistake lies in what the 20% is being taken of. The original 20% reduction was calculated from the original price, a number that is not yet known, not from the £72 that resulted afterwards. Taking 20% of £72 answers a different question entirely: it finds 20% of the reduced price, not 20% of the price that no longer exists.",
        "Instead, think about what £72 actually represents. A 20% reduction leaves 100% - 20% = 80% remaining, so £72 is not the whole original price (100%); it is only the 80% that is left after the reduction. In other words, the original price, multiplied by the multiplier 0.80, gives £72.",
        "To recover the original price from this, undo the multiplication by dividing by the same multiplier: original price = 72 ÷ 0.80 = 90. Check this makes sense by reversing the check: 90 × 0.80 = 72, confirming the original price really was £90, and that reducing £90 by 20% does indeed give back the £72 in the question.",
        "The same idea works for an increase, just with a different percentage represented. If a given value comes after a 15% increase, that value represents 100% + 15% = 115% of the original, not 100%. If it comes after a 15% decrease, it represents 100% - 15% = 85% of the original. Correctly identifying which percentage the known value represents is the single most important step; the division that follows is then straightforward.",
        "When more than one change has happened in sequence, such as two years of growth one after another, combine the individual multipliers into a single overall multiplier first, by multiplying them together, then divide the known final value by that one combined multiplier, exactly as before."
      ], [
        example("A price is £60 after a 25% reduction. Find the original price.", [
          "The multiplier that was applied to get from the original price to £60 was 0.75.",
          "To undo a multiplication, divide by the same number: original price = 60 ÷ 0.75.",
          "Work this out: 60 ÷ 0.75 = 80.",
        ], "£80.", {
          understand: "A 25% reduction leaves 100% - 25% = 75% remaining, so £60 represents 75% of the original price, not 100% of it.",
          check: "80 × 0.75 = 60, confirming that reducing the recovered original price by 25% really does give back the £60 in the question.",
        }),
        example("A salary is £32,760 after a 5% rise. Find the previous salary.", [
          "The multiplier applied was 1.05.",
          "Undo it by dividing: previous salary = 32,760 ÷ 1.05.",
          "Work this out: 32,760 ÷ 1.05 = 31,200.",
        ], "£31,200.", {
          understand: "A 5% rise means the new salary is 100% + 5% = 105% of the previous one, so £32,760 represents 105%, not 100%.",
          check: "31,200 × 1.05 = 32,760, confirming the recovered previous salary really does grow to the given amount after a 5% rise.",
        }),
        example("A population is 18,225 after growing by 8% in each of two years. Find the starting population.", [
          "Work out 1.08²: 1.08 × 1.08 = 1.1664.",
          "So 18,225 represents the starting population multiplied by 1.1664. Undo this by dividing: starting population = 18,225 ÷ 1.1664.",
          "Work this out: 18,225 ÷ 1.1664 = 15,625.",
        ], "The starting population was 15,625.", {
          understand: "An 8% rise each year uses multiplier 1.08, and this happens twice, once per year, so the combined multiplier applied to the starting population over both years is 1.08².",
          check: "15,625 × 1.1664 = 18,225, confirming the recovered starting population really does reach the given amount after two years of 8% growth.",
        }),
        example("After a 10% rise followed by a 20% fall, an investment is worth £7,040. Find its original value.", [
          "So £7,040 represents the original value multiplied by 0.88, which is 88% of the original.",
          "Undo this by dividing: original value = 7,040 ÷ 0.88.",
          "Work this out: 7,040 ÷ 0.88 = 8,000.",
        ], "£8,000.", {
          understand: "A 10% rise uses multiplier 1.10, and a 20% fall uses multiplier 0.80. Since both changes were applied one after the other, multiply the two multipliers together to find the single combined multiplier: 1.10 × 0.80 = 0.88.",
          check: "8,000 × 1.10 = 8,800, then 8,800 × 0.80 = 7,040, confirming the recovered original value really does reach £7,040 once both changes are applied in order.",
        })
      ], { q: "A bicycle costs £552 after a 20% increase. Find its original price.", answer: "A 20% increase means £552 represents 100% + 20% = 120% of the original price. The multiplier applied was 1.20, so undo it by dividing: 552 ÷ 1.20 = 460. The original price was £460." }, { note: "A reverse percentage question changes what counts as 100%. Adding or subtracting a percentage of the final amount uses the wrong whole." }),

      section("4. Growth, decay and half-life beyond money", [
        "Everything in section 2 (a fixed multiplier applied once per period, repeated) works exactly the same way whether the quantity growing or shrinking is money, a population, or the mass of a substance; only the units and the vocabulary change. Instead of 'interest' or 'depreciation', questions about populations, bacteria or chemicals usually say 'growth factor' (a multiplier bigger than 1) or 'decay factor' (a multiplier smaller than 1), but the underlying method, raise the factor to the power of the number of periods, then multiply, is identical.",
        "A half-life is a special, named case of decay: the length of time it takes for exactly half of whatever is currently present to disappear, giving a decay factor of exactly ½ every single half-life, regardless of how much is left when that half-life begins. Starting from 80g: after one half-life, 40g remains; after a second half-life, half of that 40g remains, 20g; after a third, 10g; after a fourth, 5g. Notice that it is always half of the CURRENT amount, not half of the original 80g each time, exactly the same 'use the latest amount, not the original' rule that makes ordinary compound growth and decay work.",
        "Because each half-life multiplies by ½, the general formula from section 2 still applies directly: remaining amount = original amount × (½) raised to the power of the number of half-lives. For 80g after 4 half-lives: 80 × (½)⁴ = 80 × 1/16 = 5g, matching the step-by-step halving above exactly.",
        "Working backwards, finding how many whole periods it takes for a growing or shrinking quantity to first cross a target value, uses the same trial method already met in section 2's bacteria-culture example: since there is no simple one-step way to solve for the exact period without more advanced methods, test whole-number periods one at a time, working out the amount at each one, until the target is first crossed. Always check the period immediately before the answer too, to confirm the target genuinely was not yet reached one step earlier."
      ], [
        example("A population of 500 bacteria grows by 8% every hour. What is the population after 3 hours?", [
          "Growth factor = 1 + 8/100 = 1.08.",
          "New population = 500 × 1.08³.",
          "1.08³ = 1.08 × 1.08 × 1.08 = 1.259712.",
          "500 × 1.259712 ≈ 629.86, so about 630 bacteria (rounding to a whole number of bacteria).",
        ], "About 630 bacteria.", {
          understand: "This is the same compound-multiplier method as section 2's money examples, just relabelled: 'growth factor' here means exactly the same thing as 'multiplier' did there.",
          check: "Check hour by hour: 500 → 540 (hour 1) → 583.2 (hour 2) → 629.86 (hour 3), matching the direct power calculation.",
          structureId: "s21_exponential_growth_population",
        }),
        example("A sample of 320g of a radioactive isotope has a fixed half-life. After 3 half-lives, how much of the original sample remains?", [
          "Each half-life halves whatever is currently present: 320 → 160 → 80 → 40.",
          "Using the formula directly: remaining = 320 × (½)³ = 320 × 1/8 = 40g.",
        ], "40g.", {
          understand: "A half-life always uses a decay factor of exactly ½, so the general compound-decay formula applies with that specific factor.",
          check: "Both methods, halving step by step and using the formula directly, agree on 40g.",
          structureId: "s23_half_life_remaining",
        }),
        example("A radioactive substance has a mass of 200g and decays by 25% every hour. What mass remains after 3 hours?", [
          "Decay factor = 1 - 25/100 = 0.75.",
          "Remaining mass = 200 × 0.75³.",
          "0.75³ = 0.75 × 0.75 × 0.75 = 0.421875.",
          "200 × 0.421875 = 84.375, so 84.375g (or 84.4g to 1 decimal place).",
        ], "84.375g.", {
          understand: "This decays by a fixed percentage rather than always exactly halving, so the decay factor here is 0.75, not the special ½ used for a half-life.",
          check: "Check hour by hour: 200 → 150 (hour 1) → 112.5 (hour 2) → 84.375 (hour 3), matching the direct power calculation.",
          structureId: "s22_exponential_decay_substance",
        }),
        example("A population of 1,000 decreases by 15% each year. After how many whole years does the population first fall below half its original size (below 500)?", [
          "Decay factor = 1 - 15/100 = 0.85.",
          "Try year 4: 1,000 × 0.85⁴ ≈ 522.0, still above 500.",
          "Try year 5: 1,000 × 0.85⁵ ≈ 443.7, now below 500.",
        ], "After 5 years.", {
          understand: "There is no simple one-step formula for the exact year, so test whole-number years one at a time until the population first drops below half its starting value.",
          check: "Year 4 (≈522.0) is still above the 500 target, while year 5 (≈443.7) is below it, confirming year 5 is genuinely the first year the population falls below half.",
          structureId: "s24_periods_to_threshold",
        })
      ], { q: "A sample of 96g of a substance has a fixed half-life. After 5 half-lives, how much remains?", answer: "Halving five times: 96 → 48 → 24 → 12 → 6 → 3. Using the formula: 96 × (½)⁵ = 96 × 1/32 = 3g." }, { note: "A half-life always uses decay factor ½ exactly. Do not confuse it with an ordinary percentage decay, where the decay factor depends on the given rate instead." })
    ],
    ["A percentage multiplier represents the whole amount after a change.", "Compound change applies the multiplier to the latest amount in every period.", "Reverse percentages undo the original multiplier by division.", "Growth/decay factor and half-life describe the same compound-multiplier idea outside a money context."],
    ["Using the percentage change as the multiplier instead of the percentage remaining.", "Treating compound change as repeated addition of a fixed amount.", "Rounding at every stage rather than at the end.", "Adding a percentage of the final value when trying to recover the original.", "Halving the original amount every time instead of halving whatever is currently left."]
  );

  lessons.simultaneousEquations = lesson(
    "Simultaneous Equations: finding values that satisfy two clues",
    5,
    ["algebraicManipulation", { module: "junior", key: "systemWord" }, { module: "primary", key: "twoUnknowns" }],
    "When two unknown quantities are linked by two independent clues, neither clue usually settles the answer alone. Simultaneous equations keep both clues active at the same time. We will learn two methods for removing one unknown, then check that the surviving pair satisfies both original equations.",
    [
      section("1. Elimination", [
        "Imagine buying identical notebooks and pens. One receipt says that 2 notebooks and 3 pens cost £13, so 2n + 3p = 13, using n for the price of one notebook and p for the price of one pen. Another receipt says that 2 notebooks and 1 pen cost £9, so 2n + p = 9. Neither receipt alone reveals the price of a notebook or a pen, since each has two unknowns tangled together, but the two receipts together give more information than either does alone.",
        "Since both receipts contain exactly '2 notebooks', subtracting one whole equation from the other removes the notebooks completely, because 2n - 2n = 0: (2n + 3p) - (2n + p) = 13 - 9, which simplifies to 2p = 4, so p = 2. A single pen costs £2. Substituting this back into either original equation recovers the notebook price: 2n + 3(2) = 13 gives 2n = 7, so n = 3.5.",
        "This method, called elimination, works whenever one variable has the same coefficient in both equations. If that matching coefficient has the same sign in both equations, as with the two 2n terms above, subtracting one equation from the other cancels it, since (same) - (same) = 0. If the matching coefficient has opposite signs instead, such as +y in one equation and -y in another, adding the two equations cancels it, since (+y) + (-y) = 0.",
        "Often the coefficients do not already match, and need to be made to match first by multiplying. Multiplying every term of an equation by the same number keeps the equation exactly as true as it was before, since doing the same thing to both sides of an equals sign preserves the equality, exactly the same idea used whenever any equation is rearranged. To eliminate y from 2x + 3y = 17 and 5x - 2y = 4, multiply the first equation by 2 (giving 4x + 6y = 34) and the second by 3 (giving 15x - 6y = 12), so that both now contain a matching 6y term, one positive and one negative, ready to cancel by adding.",
        "Once one variable has been eliminated, the equation that remains has only one unknown, and can be solved by ordinary rearranging. Substitute the found value into either of the two ORIGINAL equations, not the new combined one, to find the other unknown, since both original equations still describe the same two unknowns.",
        "Always finish by checking the found pair of values in both original equations, not only the one used to find the second unknown. A pair that satisfies just one of the two original equations is not a genuine simultaneous solution, since it does not actually satisfy both clues at once."
      ], [
        example("Solve x + y = 9 and x - y = 3.", ["Add the equations because +y and -y cancel.", "This gives 2x = 12, so x = 6.", "Substitute into x + y = 9 to get 6 + y = 9, so y = 3."], "x = 6 and y = 3.", {
          understand: "The y-terms have opposite signs in the two equations (+y and -y), so adding the equations will eliminate y.",
          check: "Check both original equations: 6 + 3 = 9, and 6 - 3 = 3, both correct.",
        }),
        example("Solve 2x + y = 11 and 2x - y = 5.", ["Add the equations to eliminate y.", "4x = 16, so x = 4.", "Substitute into 2x + y = 11: 8 + y = 11, so y = 3."], "x = 4 and y = 3.", {
          understand: "The y-terms again have opposite signs (+y and -y), so adding eliminates y, just as in the previous example.",
          check: "Check both original equations: 2(4) + 3 = 11, and 2(4) - 3 = 5, both correct.",
        }),
        example("Solve 3x + 2y = 16 and 5x + 2y = 24.", ["Subtract the first equation from the second to eliminate 2y.", "2x = 8, so x = 4.", "Substitute into 3x + 2y = 16: 12 + 2y = 16, so y = 2."], "x = 4 and y = 2.", {
          understand: "This time the y-terms have the same sign in both equations (+2y in both), so subtracting one equation from the other, rather than adding, is what eliminates y.",
          check: "Check both original equations: 3(4) + 2(2) = 16, and 5(4) + 2(2) = 24, both correct.",
        }),
        example("Solve 2x + 3y = 17 and 5x - 2y = 4.", ["Multiply the first equation by 2: 4x + 6y = 34.", "Multiply the second by 3: 15x - 6y = 12.", "Add to eliminate y: 19x = 46, so x = 46/19.", "Substitute into either original equation to find y: y = 77/19."], "x = 46/19 and y = 77/19.", {
          understand: "Neither variable already has matching coefficients in the two equations, so multiply each equation by a suitable number first, to create matching y-coefficients (6y and -6y) that will cancel.",
          check: "The values come out as fractions this time, a sign that this pair is not as neat as the earlier examples, but they can still be checked by substituting back into both original equations.",
        })
      ], { q: "Solve 4x + 3y = 18 and 2x - 3y = 0.", answer: "Add the equations: 6x = 18, so x = 3. Then 2(3) - 3y = 0 gives y = 2." }, { note: "Do not multiply only the variable term when matching coefficients. Multiply every term in the entire equation, including the number on the right." }),

      section("2. Substitution", [
        "Substitution suits a different kind of pair of clues: one where a clue already says what one variable equals, in terms of the other. If y = 2x + 1, this means the value called y is, always, exactly the same as the expression 2x + 1, whatever x turns out to be. This means y can be swapped for 2x + 1 wherever it appears, without changing the truth of anything.",
        "Take y = x + 2 alongside x + y = 8. Since y always equals x + 2, replace the y inside the second equation with that expression: x + (x + 2) = 8. This turns a two-unknown equation into a one-unknown equation, since every occurrence of y has been rewritten using x alone. Solving as normal: 2x + 2 = 8, so 2x = 6, giving x = 3. Substituting this value back into y = x + 2 gives y = 3 + 2 = 5.",
        "Brackets matter whenever the substituted expression is being multiplied or subtracted, not just added on its own. If an equation contains the term 3y, and y = 2x - 4, the whole expression 2x - 4 must be multiplied by 3 together, written 3(2x - 4), not 3 × 2x - 4 with only the first term multiplied. Dropping the brackets here would silently lose the multiplication by 3 on the -4, changing the equation's meaning.",
        "Sometimes neither equation starts with a variable already isolated on its own, so one equation must be rearranged first before substituting. When there is a choice, rearrange for whichever variable has a coefficient of 1 or -1, since dividing by 1 introduces no fractions, keeping the arithmetic simpler than rearranging for a variable with a bigger coefficient.",
        "Substitution and elimination are not two competing rules to choose between at random. They are two ways of expressing the same underlying idea: using one clue inside the other so that only one unknown remains to solve for. Which one is quicker depends on how the equations happen to be written, and with practice it becomes easy to spot which approach avoids the most extra work."
      ], [
        example("Solve y = x + 2 and x + y = 8.", ["Replace y in the second equation with x + 2: x + (x + 2) = 8.", "Simplify and solve: 2x + 2 = 8, so 2x = 6, giving x = 3.", "Substitute back into y = x + 2: y = 3 + 2 = 5."], "x = 3 and y = 5.", {
          understand: "The first equation already tells us what y equals, in terms of x, so substitute that expression directly into the second equation.",
          check: "Check both original equations: y = x + 2 gives 5 = 3 + 2, and x + y = 8 gives 3 + 5 = 8, both correct.",
        }),
        example("Solve y = 3x - 4 and 2x + y = 16.", ["Substitute 3x - 4 for y in the second equation: 2x + (3x - 4) = 16.", "Simplify and solve: 5x - 4 = 16, so 5x = 20, giving x = 4.", "Substitute back into y = 3x - 4: y = 3(4) - 4 = 8."], "x = 4 and y = 8.", {
          understand: "As before, the first equation already isolates y, so substitute it directly into the second equation.",
          check: "Check both original equations: y = 3x - 4 gives 8 = 3(4) - 4, and 2x + y = 16 gives 2(4) + 8 = 16, both correct.",
        }),
        example("Solve 2x + y = 7 and 3x - 2y = 0.", ["Rearrange the first equation to isolate y: y = 7 - 2x.", "Substitute into the second equation: 3x - 2(7 - 2x) = 0.", "Expand the bracket and solve: 3x - 14 + 4x = 0, so 7x = 14, giving x = 2.", "Substitute back into y = 7 - 2x: y = 7 - 2(2) = 3."], "x = 2 and y = 3.", {
          understand: "Neither equation already isolates a variable, so rearrange the simpler-looking equation first; y in the first equation has coefficient 1, making it the easiest to isolate.",
          check: "Check both original equations: 2(2) + 3 = 7, and 3(2) - 2(3) = 6 - 6 = 0, both correct.",
        }),
        example("A cinema sells adult tickets for £a and student tickets for £s. Two adult and three student tickets cost £39, while an adult ticket costs £3 more than a student ticket. Find both prices.", ["Write the two clues as equations: 2a + 3s = 39, and a = s + 3.", "Substitute s + 3 for a in the first equation: 2(s + 3) + 3s = 39.", "Expand the bracket and solve: 2s + 6 + 3s = 39, so 5s + 6 = 39, giving 5s = 33 and s = 6.6.", "Substitute back into a = s + 3: a = 6.6 + 3 = 9.6."], "Student tickets cost £6.60 and adult tickets cost £9.60.", {
          understand: "The second clue already isolates a in terms of s (an adult ticket costs £3 more than a student ticket), so substitute that directly into the first equation.",
          check: "Check both original clues: 2(9.6) + 3(6.6) = 19.2 + 19.8 = 39, and 9.6 = 6.6 + 3, both correct.",
        })
      ], { q: "Solve x = 2y - 1 and 3x + y = 18.", answer: "Substitute: 3(2y - 1) + y = 18, so 7y = 21 and y = 3. Then x = 5." }, { note: "Substitution replaces a variable with the whole equivalent expression. Use brackets so every sign and multiplier applies correctly." })
    ],
    ["Two equations provide two constraints on the same unknowns.", "Elimination adds or subtracts equations to remove one variable.", "Substitution replaces a variable with an equivalent expression.", "A simultaneous solution must satisfy both original equations."],
    ["Changing only part of an equation when multiplying it.", "Adding equations when equal coefficients have the same sign and therefore do not cancel.", "Substituting without brackets.", "Checking the answer in only one original equation."]
  );

  lessons.quadratics = lesson(
    "Quadratics: structure, roots and turning points",
    6,
    ["algebraicManipulation", "surdsAndIndices"],
    "A quadratic contains a squared variable as its highest power. Its graph is a parabola, and its algebra can describe where that curve crosses an axis, where it turns and whether real crossings exist at all. We will connect three forms of a quadratic rather than treating them as unrelated techniques.",
    [
      section("1. Completing the square", [
        "The expression x² + 6x is nearly a perfect square, missing only a constant to complete it. Expanding (x + 3)² using the four-products method gives x × x = x², x × 3 = 3x, 3 × x = 3x, and 3 × 3 = 9, combining to x² + 6x + 9. So x² + 6x and (x + 3)² differ by exactly 9, which means x² + 6x can be written as (x + 3)² - 9: adding 9 to complete the square, then immediately subtracting the same 9 outside, so the overall value never actually changes.",
        "This process, called completing the square, works the same way for any expression of the form x² + bx. Half the coefficient b, and place that half inside a bracket with x: (x + b/2)². Expanding this bracket always produces x² + bx + (b/2)², so a constant of (b/2)² has effectively been added that was not in the original expression, and must be subtracted straight back out to leave the value unchanged: x² + bx = (x + b/2)² - (b/2)².",
        "Writing an expression in the form (x - h)² + k reveals something a plain expanded quadratic hides: exactly where its graph turns. A squared quantity can never be negative, and is at its very smallest, zero, exactly when the bracket itself is zero, that is, when x = h. So the whole expression (x - h)² + k is at its smallest when x = h, and that smallest value is k, since the squared part contributes nothing at that point. This smallest point, (h, k), is the turning point of the graph. Watch the sign carefully: (x - 4)² has its minimum at x = 4, not x = -4, because the bracket must equal zero, and x - 4 = 0 gives x = 4.",
        "When the coefficient of x² is not 1, as in 2x² + 12x + 5, the first two terms need a common factor removed before completing the square inside. Factor 2 out of just the x² and x terms: 2(x² + 6x) + 5. Complete the square inside the bracket exactly as before: x² + 6x = (x + 3)² - 9. Substitute this back in: 2[(x + 3)² - 9] + 5, then multiply the 2 across both parts inside the square bracket and combine the constants: 2(x + 3)² - 18 + 5 = 2(x + 3)² - 13.",
        "Always check a completed-square form by expanding it back out and confirming every original coefficient and constant returns exactly, the same checking habit used after expanding brackets or factorising."
      ], [
        example("Write x² + 8x in completed-square form.", ["Half the coefficient of x, 8, to get 4.", "Write (x + 4)², which expands to x² + 8x + 16.", "Subtract the extra 16 that this bracket introduces, to keep the value unchanged."], "(x + 4)² - 16.", {
          understand: "For x² + bx, halving b gives the number to place inside the bracket.",
          check: "Expand back: (x + 4)² - 16 = x² + 8x + 16 - 16 = x² + 8x, matching the original expression.",
        }),
        example("Complete the square for x² - 10x + 7.", ["Half the coefficient of x, -10, to get -5.", "Write (x - 5)², which expands to x² - 10x + 25.", "Adjust the constant: the original had +7, but the bracket has introduced +25 instead, so subtract the difference: 7 - 25 = -18."], "(x - 5)² - 18.", {
          understand: "This time there is already a constant term, 7, in the original expression, so it must be combined with the constant the completed-square bracket introduces.",
          check: "Expand back: (x - 5)² - 18 = x² - 10x + 25 - 18 = x² - 10x + 7, matching the original expression.",
        }),
        example("Find the turning point of y = x² + 4x - 1.", ["Complete the square: half of 4 is 2, so write (x + 2)², which expands to x² + 4x + 4.", "Adjust the constant: the original had -1, so subtract the difference: -1 - 4 = -5, giving x² + 4x - 1 = (x + 2)² - 5.", "The square, (x + 2)², is smallest (zero) when x + 2 = 0, so x = -2.", "At that point, y = 0 - 5 = -5."], "The turning point is (-2, -5).", {
          understand: "Writing the quadratic in completed-square form directly reveals its turning point, without needing to plot the graph.",
          check: "Expand back to confirm: (x + 2)² - 5 = x² + 4x + 4 - 5 = x² + 4x - 1, matching the original expression.",
        }),
        example("Complete the square for 2x² + 12x + 5.", ["Factor 2 from the first two terms only: 2(x² + 6x) + 5.", "Complete the square inside the bracket: half of 6 is 3, so x² + 6x = (x + 3)² - 9.", "Substitute this back in: 2[(x + 3)² - 9] + 5.", "Multiply the 2 across both parts inside the square bracket: 2(x + 3)² - 18 + 5.", "Combine the constants: -18 + 5 = -13."], "2(x + 3)² - 13.", {
          understand: "The coefficient of x² is 2, not 1, so it must be factored out of the x² and x terms before completing the square inside.",
          check: "Expand back: 2(x + 3)² - 13 = 2(x² + 6x + 9) - 13 = 2x² + 12x + 18 - 13 = 2x² + 12x + 5, matching the original expression.",
        })
      ], { q: "Write x² - 6x + 11 in completed-square form and state its turning point.", answer: "x² - 6x + 11 = (x - 3)² + 2, so the turning point is (3, 2)." }, { note: "The number inside the bracket has the opposite sign from the x-coordinate of the turning point." }),

      section("2. Solving quadratic equations", [
        "Solving a quadratic means finding every value of x that makes the whole expression equal exactly zero. On a graph of the quadratic, these are precisely the x-coordinates where the curve crosses, or just touches, the x-axis, since the x-axis is where y = 0. These values are called the roots of the quadratic.",
        "Factorising, from an earlier lesson, is usually the fastest route when a quadratic factorises with convenient integers. Once written as two brackets multiplied together and set equal to zero, such as (x + 2)(x - 5) = 0, a key fact about multiplication applies: the only way two numbers can multiply to give zero is if at least one of them already is zero. So either x + 2 = 0, giving x = -2, or x - 5 = 0, giving x = 5. This is called the zero-product rule, and it only works when one whole side of the equation is exactly zero to start with.",
        "Not every quadratic factorises neatly with whole numbers. For these, the quadratic formula solves ax² + bx + c = 0 for any values of a, b and c, as long as a is not zero: x = [-b ± √(b² - 4ac)] / (2a). Before substituting, identify a, b and c directly from the equation, including their signs; a sign error at this stage carries through the entire calculation.",
        "The ± symbol inside the formula is shorthand for two separate calculations sharing the same working: one using + throughout, one using - throughout, giving the two roots at once. The entire numerator, -b ± √(b² - 4ac), must be divided by 2a as a whole, not just the square-root part; writing the fraction with a clear horizontal bar underneath the whole numerator helps avoid dividing only part of it by mistake.",
        "Once found, check roots by substituting them back into the original equation, not the completed-square or rearranged version used to solve it, confirming each one really does make the expression equal zero. Give an exact surd-form answer, rather than a rounded decimal, unless the question specifically asks for one."
      ], [
        example("Solve x² - 7x + 12 = 0.", ["Factorise: x² - 7x + 12 = (x - 3)(x - 4).", "Set the equation to (x - 3)(x - 4) = 0.", "Apply the zero-product rule: either x - 3 = 0 or x - 4 = 0."], "x = 3 or x = 4.", {
          understand: "This quadratic factorises with convenient integers (two numbers with product 12 and sum -7: -3 and -4), so factorising is the quickest route.",
          check: "Substitute both values back into the original equation: 3² - 7(3) + 12 = 9 - 21 + 12 = 0, and 4² - 7(4) + 12 = 16 - 28 + 12 = 0, both correct.",
        }),
        example("Solve 2x² + x - 6 = 0.", ["Factorise: 2x² + x - 6 = (2x - 3)(x + 2).", "Set the equation to (2x - 3)(x + 2) = 0.", "Apply the zero-product rule: either 2x - 3 = 0, giving x = 3/2, or x + 2 = 0, giving x = -2."], "x = 3/2 or x = -2.", {
          understand: "The coefficient of x² is not 1, so use the split-the-middle-term factorising method from an earlier lesson.",
          check: "Substitute both values back into the original equation: 2(3/2)² + 3/2 - 6 = 4.5 + 1.5 - 6 = 0, and 2(-2)² + (-2) - 6 = 8 - 2 - 6 = 0, both correct.",
        }),
        example("Solve x² + 4x - 1 = 0 exactly.", ["Identify a = 1, b = 4, c = -1.", "Substitute into the formula: x = [-4 ± √(4² - 4(1)(-1))] / (2(1)) = [-4 ± √(16 + 4)] / 2.", "Simplify under the root: √20 = √(4 × 5) = 2√5.", "Divide every term in the numerator by 2: x = -2 ± √5."], "x = -2 ± √5.", {
          understand: "This does not factorise with convenient integers, so use the quadratic formula, keeping the answer in exact surd form as requested.",
          check: "A decimal check confirms it is reasonable: -2 + √5 ≈ -2 + 2.236 ≈ 0.236, and substituting gives (0.236)² + 4(0.236) - 1 ≈ 0.056 + 0.944 - 1 ≈ 0, as expected.",
        }),
        example("The length of a rectangle is 3 cm greater than its width and its area is 40 cm². Find its dimensions.", ["Let the width be x, so the length is x + 3.", "Form the area equation: x(x + 3) = 40, which expands to x² + 3x = 40, or x² + 3x - 40 = 0.", "Factorise: x² + 3x - 40 = (x + 8)(x - 5).", "Apply the zero-product rule: x = -8 or x = 5.", "Reject x = -8, since a width cannot be negative."], "The rectangle is 5 cm by 8 cm.", {
          understand: "This is a real-world quadratic, where the solution must additionally make physical sense (a positive length), so both algebraic roots must be checked against that requirement.",
          check: "Width 5, length 5 + 3 = 8, area 5 × 8 = 40, matching the given area.",
        })
      ], { q: "Solve 3x² - 5x - 2 = 0.", answer: "(3x + 1)(x - 2) = 0, so x = -1/3 or x = 2." }, { note: "A quadratic equation must be arranged equal to zero before the zero-product rule can be used." , visual: "intermediate-quadratic-roots"}),

      section("3. The discriminant", [
        "Inside the quadratic formula sits the expression b² - 4ac, tucked under the square root. This part is given its own name, the discriminant, because its value alone decides, before any further calculation, how many real roots the whole quadratic actually has.",
        "If b² - 4ac works out positive, its square root is a genuine non-zero real number, so the ± in the formula produces two genuinely different values, one from adding the square root and one from subtracting it. This means the graph crosses the x-axis at two separate points.",
        "If b² - 4ac works out to exactly zero, the square root of zero is zero, so both the + and - branches of the formula collapse to the exact same value, -b/(2a), either way. There is only one root, sometimes called a repeated root, since it is the value both formula branches would have given separately had the discriminant not been zero. Graphically, the curve just touches the x-axis at a single point, its turning point, rather than crossing through it.",
        "If b² - 4ac works out negative, its square root is not a real number at all, since no real number squares to give a negative result, so the formula cannot produce any real value for x. The quadratic has no real roots, and its graph never meets the x-axis at all.",
        "The discriminant answers the 'how many roots' question without ever having to work out what the roots themselves are, which makes it especially useful for questions that only ask about the number of roots, or that ask which values of some unknown constant would give a particular number of roots. Keep every sign in view when substituting: the b² term always ends up positive regardless of the sign of b, since squaring removes it, but the 4ac term keeps whatever sign the product of a and c actually has."
      ], [
        example("How many real roots has x² - 5x + 6 = 0?", ["Identify a = 1, b = -5, c = 6.", "Calculate the discriminant: b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1."], "Two real roots.", {
          understand: "The number of real roots can be found from the discriminant alone, without solving the equation.",
          check: "A positive discriminant (1 is positive) always means two distinct real roots; factorising confirms it: x² - 5x + 6 = (x - 2)(x - 3), giving two different roots, x = 2 and x = 3.",
        }),
        example("How many real roots has x² + 6x + 9 = 0?", ["Identify a = 1, b = 6, c = 9.", "Calculate the discriminant: b² - 4ac = 6² - 4(1)(9) = 36 - 36 = 0."], "One repeated real root.", {
          understand: "The discriminant being exactly zero has a specific meaning: both formula branches collapse to the same value.",
          check: "A zero discriminant always means one repeated root; factorising confirms it: x² + 6x + 9 = (x + 3)², giving the repeated root x = -3.",
        }),
        example("Find the values of k for which x² + 4x + k = 0 has two distinct real roots.", ["Calculate the discriminant using a = 1, b = 4, c = k: b² - 4ac = 4² - 4(1)(k) = 16 - 4k.", "Two distinct real roots require a positive discriminant: 16 - 4k > 0.", "Solve the inequality: 16 > 4k, so k < 4."], "k < 4.", {
          understand: "Rather than solving for x, this question asks which values of an unknown constant, k, keep the discriminant positive.",
          check: "Test a value satisfying k < 4, such as k = 0: discriminant = 16 - 0 = 16, positive, confirming two real roots; test k = 4 itself: discriminant = 16 - 16 = 0, confirming k = 4 is the boundary, correctly excluded since the inequality is strict.",
        }),
        example("The line y = 2x + m is tangent to y = x². Find the possible values of m.", ["At any intersection point, both equations must give the same y, so x² = 2x + m, giving x² - 2x - m = 0.", "A tangent line touches the curve at exactly one point, meaning this equation must have exactly one repeated root, so its discriminant must be zero.", "Identify a = 1, b = -2, c = -m. Calculate the discriminant: (-2)² - 4(1)(-m) = 4 + 4m.", "Set the discriminant to zero: 4 + 4m = 0, so m = -1."], "m = -1.", {
          understand: "A tangent line meeting a curve at exactly one point translates directly into a discriminant condition: the intersection equation must have a repeated, zero-discriminant, root.",
          check: "Substitute m = -1 back: x² - 2x - (-1) = x² - 2x + 1 = (x - 1)², which does have exactly one repeated root, x = 1, confirming tangency.",
        })
      ], { q: "Find the range of p for which 2x² + px + 3 = 0 has no real roots.", answer: "No real roots require p² - 24 < 0, so -2√6 < p < 2√6." }, { note: "Do not say that a zero discriminant means no roots. It means the two formula answers have merged into one repeated real root." }),

      section("4. Quadratic inequalities and set notation", [
        "A quadratic equation asks exactly where a parabola crosses zero: a small number of isolated points. A quadratic inequality asks something different: for which whole stretches of x-values the parabola sits above zero, or below it. The answer is no longer one or two single numbers, but an entire region, or two separate regions, of the number line.",
        "The method starts exactly like solving the equation: find the roots first. Then use the shape of the graph to decide which side of those roots actually satisfies the inequality. For a parabola that opens upward (a positive), the curve dips below the x-axis only in the stretch between its two roots, and sits above the x-axis everywhere outside them. So x² - 2x - 15 < 0 factorises to (x-5)(x+3) < 0, with roots at x = 5 and x = -3; since the inequality wants the curve below zero, and that only happens between the roots, the answer is the single connected region -3 < x < 5.",
        "Set notation gives a precise, standard way to write down a region like this. {x : condition} means 'the set of every value of x for which the condition holds'; it is read as 'the set of x such that...'. Writing 'x ≥ -4' as a set becomes {x : x ≥ -4}: the same information, in the form GCSE Higher papers expect for this kind of answer.",
        "Some inequalities produce two separate regions rather than one connected stretch. Solving x² - 16 > 0 factorises to (x-4)(x+4) > 0, with roots at x = 4 and x = -4; since the inequality wants the curve above zero, and a positive-a parabola is above zero outside its roots, the answer is x < -4 or x > 4, two disconnected pieces of the number line. In set notation, two separate regions are written as two separate sets joined by the union symbol ∪ (meaning 'either of these sets'): {x : x < -4} ∪ {x : x > 4}. Writing 'x < -4 or x > 4' inside a single pair of braces looks similar, but ∪ between two genuinely separate sets is the notation this topic specifically tests.",
        "If the inequality isn't already arranged with zero on one side, rearrange it first, moving every term onto the same side as the x² term, exactly as when solving an equation. Always double-check the final region against a test value substituted into the ORIGINAL inequality, since it is easy to pick the wrong side of the roots by mistake."
      ], [
        example("Solve the inequality x² - 2x - 15 < 0.", ["Factorise: x² - 2x - 15 = (x - 5)(x + 3).", "Roots: x = 5 and x = -3.", "Since the parabola opens upward (a = 1 > 0), it is negative, below the x-axis, only between the roots."], "-3 < x < 5.", {
          understand: "Find the roots first, then use the fact that a positive-a parabola is below the x-axis only between its two roots.",
          check: "Test a value between the roots, x = 0: 0² - 2(0) - 15 = -15, which is indeed less than 0, confirming the region.",
          structureId: "quadratic_inequality",
        }),
        example("Write \"x is greater than or equal to -4\" using set notation.", ["The condition is x ≥ -4.", "In set notation: {x : x ≥ -4}."], "{x : x ≥ -4}.", {
          understand: "Set notation always follows the same pattern: curly brackets, the variable, a colon, then the condition it satisfies.",
          check: "Check the shape is right: curly brackets enclose the whole thing, the variable comes first, then a colon, then the condition, exactly as required.",
          structureId: "set_notation_translate",
        }),
        example("Solve the inequality x² - 16 > 0, giving your answer using set notation.", ["Factorise: x² - 16 = (x - 4)(x + 4).", "Roots: x = 4 and x = -4.", "Since the parabola opens upward, it is positive outside the roots: x < -4 or x > 4.", "In set notation, these are two separate regions joined by ∪: {x : x < -4} ∪ {x : x > 4}."], "{x : x < -4} ∪ {x : x > 4}.", {
          understand: "Since the solution has two separate regions rather than one connected stretch, write each as its own set and join them with ∪.",
          check: "Test a value in each region: x = 10 gives 100 - 16 = 84 > 0, and x = -10 gives 100 - 16 = 84 > 0, both confirming the outside regions; test x = 0 (between the roots): 0 - 16 = -16, which is not greater than 0, correctly excluded.",
          structureId: "quadratic_inequality_set_notation",
        }),
        example("Solve the inequality x² > 6x - 8, giving your answer using set notation.", ["Rearrange so one side is zero: x² > 6x - 8 becomes x² - 6x + 8 > 0.", "Factorise: x² - 6x + 8 = (x - 2)(x - 4).", "Roots: x = 2 and x = 4.", "Since the parabola opens upward, it is positive outside the roots: x < 2 or x > 4.", "In set notation: {x : x < 2} ∪ {x : x > 4}."], "{x : x < 2} ∪ {x : x > 4}.", {
          understand: "Before applying the roots-and-shape method, rearrange the inequality so that one side is exactly zero, moving every term onto the same side as x².",
          check: "Test x = 0 (should satisfy, since 0 < 2) in the original inequality: 0² > 6(0) - 8 becomes 0 > -8, true; test x = 3 (between the roots, should not satisfy): 3² > 6(3) - 8 becomes 9 > 10, false, correctly excluded.",
          structureId: "quadratic_inequality_set_notation",
        })
      ], { q: "Solve the inequality x² - 25 < 0, giving your answer using set notation.", answer: "Factorise: x² - 25 = (x-5)(x+5), with roots x = 5 and x = -5. Since the parabola is negative between its roots, the solution is {x : -5 < x < 5}." }, { note: "Do not write two separate sets joined by ∪ for a single connected region. The union symbol is only needed when the solution genuinely splits into two separate pieces." })
    ],
    ["Completing the square reveals the turning point.", "Quadratic roots are values that make the quadratic equal zero.", "Factorising and the quadratic formula are two routes to those roots.", "The discriminant tells us how many real roots exist.", "A quadratic inequality's solution is a region (or two), found from the roots and the parabola's shape."],
    ["Forgetting to set the equation equal to zero before factorising.", "Using the wrong sign for b in the quadratic formula.", "Dividing only the square-root term by 2a.", "Confusing a repeated root with no real root.", "Picking the wrong side of the roots when solving a quadratic inequality."]
  );

  lessons.ratioProportionAlgebraic = lesson(
    "Algebraic Proportion: relationships that scale",
    7,
    [{ module: "primary", key: "ratioBasics" }, "algebraicManipulation"],
    "Proportion describes how two quantities change together. Rather than memorising several disconnected formulas, we will begin by asking what stays constant. That constant creates the algebraic model and lets us predict new values with confidence.",
    [
      section("1. Direct proportion", [
        "Imagine buying apples at £2 per kilogram. 1 kg costs £2, 2 kg costs £4, and 3 kg costs £6. Doubling the mass, from 1 kg to 2 kg, doubles the cost, from £2 to £4; tripling the mass, from 1 kg to 3 kg, triples the cost, from £2 to £6. Notice that dividing the cost by the mass gives the same value every single time: 2 ÷ 1 = 2, 4 ÷ 2 = 2, 6 ÷ 3 = 2. The cost and mass grow together by the same fixed ratio, always 2 in this example.",
        "This kind of relationship, where two quantities always divide to give the same constant value, is called direct proportion. If y is directly proportional to x, this is written y ∝ x, and it means precisely that y/x stays the same fixed number whenever x is not zero, exactly as £2 per kilogram stayed fixed throughout the apple example.",
        "That fixed value is usually called k, the constant of proportionality. Since y/x = k for every pair of values, rearranging by multiplying both sides by x gives y = kx, a formula that predicts y for any value of x once k is known. In the apple example, k = 2, the price in pounds for one kilogram; k always carries a real meaning tied to the context it comes from.",
        "To use this in practice, find k from one known pair of values first, by rearranging y = kx into k = y/x, then use y = kx with that found k to answer any other part of the question. Stating what k actually means in context, together with its units, both makes the working easier to follow and helps catch mistakes, since an unreasonable value of k, such as a negative price, signals that something has gone wrong.",
        "On a graph, y = kx always produces a straight line passing through the point (0, 0), the origin, since substituting x = 0 gives y = 0 regardless of what k is. This is the key visual test for direct proportion: a straight line that does not pass through the origin, such as y = mx + c with c not zero, is still linear, but it is not direct proportion, since the ratio y/x is not the same constant along it."
      ], [
        example("y is directly proportional to x and y = 15 when x = 3. Find k.", ["Use y = kx.", "Substitute the known pair: 15 = 3k.", "Divide both sides by 3: k = 5."], "k = 5.", {
          understand: "Since y is directly proportional to x, the model y = kx applies, and one known pair of values is enough to find k.",
          check: "Substituting k = 5 and x = 3 back into y = kx: y = 5 × 3 = 15, matching the given value.",
        }),
        example("y ∝ x and y = 28 when x = 4. Find y when x = 11.", ["Find k using the known pair: k = 28 ÷ 4 = 7.", "Write the model with this k: y = 7x.", "Substitute x = 11: y = 7 × 11 = 77."], "y = 77.", {
          understand: "First find the constant k from the known pair, then use it to predict y for the new value of x.",
          check: "77 ÷ 11 = 7, matching the same k found from the original pair, confirming the ratio is consistent.",
        }),
        example("The mass m of identical metal rods is directly proportional to their length L. A 1.8 m rod has mass 6.3 kg. Find the mass per metre and the mass of a 4.2 m rod.", ["Use the model m = kL.", "Find k using the known pair: k = 6.3 ÷ 1.8 = 3.5 kg per metre.", "Use this k to find the mass of the 4.2 m rod: m = 3.5 × 4.2 = 14.7 kg."], "The rate is 3.5 kg/m and the 4.2 m rod has mass 14.7 kg.", {
          understand: "The constant of proportionality has a real-world meaning here, the mass per metre of the rod material, which is worth stating explicitly with its unit.",
          check: "14.7 ÷ 4.2 = 3.5, matching the rate found from the original rod, confirming consistency.",
        }),
        example("A quantity y is directly proportional to x². When x = 3, y = 45. Find x when y = 320 and x is positive.", ["The model is y = kx², since y is proportional to x² rather than x itself.", "Use the known pair to find k: 45 = k(3²) = 9k, so k = 5.", "Substitute y = 320 into the model: 320 = 5x², so x² = 64.", "Take the square root, using the stated condition that x is positive: x = 8."], "x = 8.", {
          understand: "This is proportional to x², not x directly, so the model is y = kx², and doubling x would multiply y by four, not by two.",
          check: "Substituting x = 8 back: y = 5 × 8² = 5 × 64 = 320, matching the given value.",
        })
      ], { q: "P is directly proportional to t³. When t = 2, P = 40. Find P when t = 5.", answer: "P = kt³. From 40 = 8k, k = 5. Therefore P = 5 × 125 = 625." }, { note: "A straight-line relationship is directly proportional only if the line passes through the origin." }),

      section("2. Inverse proportion", [
        "Suppose a fixed 120-mile journey is travelled at different speeds. At 60 mph, it takes 2 hours. At 40 mph, it takes 3 hours. At 30 mph, it takes 4 hours. A greater speed always produces a shorter time, and doubling the speed from 30 mph to 60 mph exactly halves the time, from 4 hours to 2 hours. The two quantities move in opposite directions, but in a very specific, predictable way.",
        "Multiply speed and time together for each pair: 60 × 2 = 120, 40 × 3 = 120, 30 × 4 = 120. The product of the two quantities stays exactly the same, even though neither quantity alone stays fixed. This is called inverse proportion. If y is inversely proportional to x, this is written y ∝ 1/x, and modelled as y = k/x, where k is the constant product xy.",
        "In the journey example, k is exactly the fixed distance, 120 miles, since speed × time = distance always, whatever the speed happens to be. Whenever two quantities are inversely proportional, k represents whatever fixed total is being shared out between them, though its exact meaning depends on the context.",
        "To use this, find k from one known pair of values by multiplying them together, k = xy, rearranged from y = k/x, then divide k by the new value of one quantity to find the corresponding value of the other.",
        "Inverse proportion is not the same as a fixed difference between the two quantities; they do not need to add or subtract to a constant total, only to multiply to one. The defining test is always the same: multiply corresponding values together, and check whether the product stays the same across every pair given."
      ], [
        example("y is inversely proportional to x and y = 6 when x = 4. Find k.", ["Use y = k/x, which rearranges to k = xy.", "Multiply the known pair: k = 4 × 6 = 24."], "k = 24.", {
          understand: "For inverse proportion, the product of x and y stays constant, so k can be found directly by multiplying the known pair.",
          check: "Substituting k = 24 and x = 4 back into y = k/x: y = 24 ÷ 4 = 6, matching the given value.",
        }),
        example("y ∝ 1/x and y = 10 when x = 3. Find y when x = 12.", ["Find k using the known pair: k = 3 × 10 = 30.", "Write the model with this k: y = 30/x.", "Substitute x = 12: y = 30 ÷ 12 = 2.5."], "y = 2.5.", {
          understand: "First find the constant product k from the known pair, then use it to predict y for the new value of x.",
          check: "12 × 2.5 = 30, matching the same k found from the original pair, confirming consistency.",
        }),
        example("Eight workers complete a fixed job in 15 days at the same rate. How long would 12 workers take?", ["Workers and days are inversely proportional here, since more workers finish the same job faster, so workers × days stays constant.", "Find the constant using the known pair: k = 8 × 15 = 120 worker-days.", "Divide this constant by the new number of workers: 120 ÷ 12 = 10 days."], "10 days.", {
          understand: "The total amount of work is fixed, so the product of workers and days, representing the total worker-days needed, stays the same regardless of how many workers are used.",
          check: "12 × 10 = 120, matching the worker-days constant found from the original 8 workers over 15 days.",
        }),
        example("y is inversely proportional to x². When x = 2, y = 18. Find the positive value of x when y = 8.", ["Use the model y = k/x².", "Find k using the known pair: k = yx² = 18 × 2² = 18 × 4 = 72.", "Substitute y = 8 into the model: 8 = 72/x², so x² = 72 ÷ 8 = 9.", "Take the square root, using the stated positive condition: x = 3."], "x = 3.", {
          understand: "This is inversely proportional to x², not x directly, so the model is y = k/x².",
          check: "Substituting x = 3 back: y = 72 ÷ 3² = 72 ÷ 9 = 8, matching the given value.",
        })
      ], { q: "The pressure p of a fixed amount of gas is inversely proportional to its volume V. If p = 240 when V = 5, find p when V = 8.", answer: "k = pV = 1,200. Therefore p = 1,200 ÷ 8 = 150." }, { note: "When x doubles in inverse proportion, y halves. If both quantities increase together, the relationship is not inverse proportion." }),

      section("3. Choosing the correct proportional model", [
        "Real exam and Olympiad questions rarely announce outright which formula applies, so the first step is always to describe the relationship between the two quantities in plain words, before reaching for any formula: does increasing one quantity increase the other by the same scale factor, does it make the other smaller, or does neither of those simple patterns seem to fit?",
        "A quick way to test which model fits is to imagine doubling one quantity, x, and ask what happens to y. If doubling x doubles y, direct proportion, y = kx, is worth trying. If doubling x halves y, inverse proportion, y = k/x, is worth trying. If doubling x makes y four times as big, that is a sign the relationship might involve x², since doubling x and then squaring it multiplies the square by 2² = 4, not by 2.",
        "The units and context of a question can also reveal which model fits, before any numbers are tested. A fixed cost per item, where every extra item adds the same amount to a bill, suggests direct proportion. A fixed total shared between two changing quantities, such as speed and time for a fixed distance, suggests inverse proportion.",
        "Not every relationship between two quantities is proportional at all. A taxi fare made up of a fixed booking fee plus a charge per mile has the form y = mx + c, where c, the booking fee, is not zero. This is a straight line, and it is linear, but it is not direct proportion, since its graph does not pass through the origin: even at zero miles travelled, the fare is not zero.",
        "Once a model has been chosen, test it against every pair of values given in the question, not just the first one. A model that only fits one data pair, by coincidence, has not actually been checked properly; real proportionality must hold for every pair given, not merely the pair used to find the constant."
      ], [
        example("The cost of identical cinema tickets is compared with the number bought. Which model is appropriate?", ["With no fixed booking fee, twice as many tickets cost exactly twice as much.", "The cost per ticket stays the same constant value regardless of how many are bought."], "Direct proportion: C = kn.", {
          understand: "Test what happens to the cost if the number of tickets doubles, to decide which model fits.",
          check: "Since cost divided by number of tickets stays constant, the price of one ticket, this matches the definition of direct proportion exactly.",
        }),
        example("The time for a fixed journey is compared with constant speed. Which model is appropriate?", ["Doubling the speed halves the travel time, since covering the same distance faster takes proportionally less time.", "The product speed × time always equals the fixed distance, so this product stays constant."], "Inverse proportion: t = k/v.", {
          understand: "Test what happens to the time if the speed doubles, to decide which model fits.",
          check: "Since speed multiplied by time gives the same constant, the fixed distance, every time, this matches the definition of inverse proportion exactly.",
        }),
        example("The area of a square is compared with its side length. Is the relationship direct proportion?", ["Area of a square is A = s², using the side length s.", "Doubling s multiplies the area by 2² = 4, not by 2, since both dimensions of the square double at once.", "Since A/s is not the same constant value as s changes, this is not direct proportion between A and s."], "No. Area is directly proportional to s², so A = ks² with k = 1.", {
          understand: "Check whether doubling the side length doubles the area, the defining test for direct proportion between A and s directly.",
          check: "A/s² does stay constant, it always equals 1 since A = s², confirming the true relationship is A directly proportional to s², not to s.",
        }),
        example("A delivery charge is £4 plus £1.50 per kilometre. Explain why cost is not directly proportional to distance and write a model.", ["At zero kilometres travelled, the charge is still £4, not £0.", "A genuine direct-proportion graph must pass through the origin, zero input giving zero output, so this relationship fails that test immediately.", "Write the model by adding the fixed charge to the distance-dependent amount: C = 1.5d + 4."], "C = 1.5d + 4, which is linear but not directly proportional.", {
          understand: "Check the zero-distance case first, since direct proportion always requires zero input to give zero output.",
          check: "At d = 0, the model gives C = 1.5(0) + 4 = 4, matching the fixed £4 charge, confirming the model fits the given information even though it is not direct proportion.",
        })
      ], { q: "A cube's volume V is compared with its edge length a. State the proportional relationship and explain what happens to V when a triples.", answer: "V ∝ a³. Tripling a multiplies V by 3³ = 27." }, { note: "Do not decide from the words ‘increases’ or ‘decreases’ alone. Test how the quantities scale and identify what remains constant." })
    ],
    ["Direct proportion keeps a ratio constant and has model y = kx.", "Inverse proportion keeps a product constant and has model y = k/x.", "Powers such as x² or x³ change the scaling pattern.", "A proportional model must fit every given value and, for direct proportion, pass through the origin."],
    ["Calling every straight-line relationship direct proportion.", "Using y = kx when doubling x halves y.", "Ignoring powers in relationships involving area or volume.", "Choosing a model from one data pair without checking the rest."]
  );

  lessons.sequencesAndSeries = rewriteExistingLesson(lessons.sequencesAndSeries,
    "A sequence is an ordered list generated by a rule. The visible terms are clues, not the rule itself. We will learn to recognise constant differences, changing differences and constant ratios, then express each pattern with a rule that can produce any term without listing all the earlier ones.",
    [{ module: "junior", key: "customCount" }, { module: "junior", key: "bouncing" }], [
      teaching([
        "Picture a staircase whose first step is 4 blocks high, and whose height increases by 3 blocks with every further step: 4, 7, 10, 13, and so on. Subtracting each height from the next confirms the increase is always exactly 3: 7 - 4 = 3, 10 - 7 = 3, 13 - 10 = 3. This repeated, constant increase is the key structure.",
        "A sequence with a constant difference between consecutive terms, like this one, is called arithmetic. Here the common difference is 3: moving forward from one term to the next always adds 3, and moving backwards always subtracts 3.",
        "To find a formula for the nth term, a single expression that produces any term directly without listing all the earlier ones, start by comparing the sequence with the simplest sequence that has the same common difference: the multiples of 3, namely 3n, whose terms are 3, 6, 9, 12 for n = 1, 2, 3, 4. Both sequences increase by exactly 3 each time. The two sequences must therefore differ only by a fixed amount at every position: comparing term by term, 4 - 3 = 1, 7 - 6 = 1, 10 - 9 = 1, 13 - 12 = 1, always 1. So the actual sequence is always exactly 1 more than 3n, giving the rule 3n + 1.",
        "This pattern always holds: the coefficient of n in an arithmetic sequence's nth-term rule is always the common difference itself, since that is exactly what makes the two sequences increase at the same rate. The constant adjustment needed afterwards is found by comparing the generated first term, from just coefficient × n, with the actual first term of the sequence, exactly as the +1 was found above.",
        "Always check a finished nth-term rule against at least two positions in the original sequence, not just one. Substituting n = 1 checks that the rule reproduces the correct starting term, while checking a second value confirms the sequence continues to grow at the correct rate, catching an error that a single check might miss."
      ], "Find the nth term of 11, 16, 21, 26, ... and use it to find term 40.", "The difference is 5, so begin with 5n. The first term of 5n is 5, which needs 6 added. The rule is 5n + 6 and term 40 is 206.", "Do not write n + 5 simply because the sequence adds 5. The term number itself also changes, so the repeated difference must multiply n."),
      teaching([
        "Consider 2, 7, 14, 23, 34. The first differences, each term minus the one before, are 7 - 2 = 5, 14 - 7 = 7, 23 - 14 = 9, 34 - 23 = 11. These are not constant, so the sequence is not arithmetic. But look at the differences of those differences: 7 - 5 = 2, 9 - 7 = 2, 11 - 9 = 2. These second differences are constant. Whenever that happens, the sequence is quadratic, meaning its nth-term rule contains an n² term.",
        "To see where the size of that n² term comes from, check the second differences of a few pure kn² sequences directly. For k = 1, n² gives 1, 4, 9, 16, 25; first differences 3, 5, 7, 9; second differences 2, 2, 2, always 2. For k = 2, 2n² gives 2, 8, 18, 32, 50; first differences 6, 10, 14, 18; second differences 4, 4, 4, always 4. For k = 3, 3n² gives 3, 12, 27, 48, 75; first differences 9, 15, 21, 27; second differences 6, 6, 6, always 6. The pattern is exact: a sequence with nth term kn² always has constant second difference 2k, twice the coefficient of n².",
        "Reversing this: if a sequence's constant second difference is known, the coefficient of n² is exactly that number halved. In the running example, the constant second difference was 2, so the n² coefficient is 2 ÷ 2 = 1, meaning the full nth-term rule starts with n² and then has something extra left over.",
        "To find that leftover, subtract n² from each term of the original sequence in turn: 2 - 1 = 1, 7 - 4 = 3, 14 - 9 = 5, 23 - 16 = 7, 34 - 25 = 9. This leftover sequence, 1, 3, 5, 7, 9, is itself a plain arithmetic sequence with common difference 2 and first term 1, so its own nth-term rule can be found using the method from the previous section: 2n - 1. Adding the n² part and this leftover part together gives the full nth-term rule: n² + 2n - 1.",
        "Always check the finished rule against several of the original terms, not just one or two: a formula matching only the first term or two could still be accidental. Checking n = 1: 1 + 2 - 1 = 2, correct. Checking n = 4: 16 + 8 - 1 = 23, correct."
      ], "Find the nth term of 3, 8, 15, 24, 35, ...", "The first differences are 5, 7, 9, 11, so the second difference is 2 and the n² coefficient is 1. Subtracting n² leaves 2, 4, 6, 8, 10, which is 2n. The rule is n² + 2n.", "Do not use the first difference as though it were constant. For a quadratic sequence, it is the second difference that stays fixed."),
      teaching([
        "A colony of bacteria doubles in size during each time period. If it begins at 5, its sizes over successive periods are 5, 10, 20, 40. Dividing each size by the one before it confirms the same multiplier every time: 10 ÷ 5 = 2, 20 ÷ 10 = 2, 40 ÷ 20 = 2. Unlike an arithmetic sequence, the amount added each time keeps changing (+5, then +10, then +20), but the multiplication from one term to the next stays exactly the same.",
        "A sequence formed by repeatedly multiplying by a constant ratio, like this one, is called geometric. Here the common ratio is 2.",
        "Think about building the sequence term by term, exactly as with arithmetic sequences. Term 2 is term 1 multiplied by r once. Term 3 is term 1 multiplied by r twice: once to reach term 2, and again to reach term 3. Term 4 is term 1 multiplied by r three times. By term n, the ratio r has been multiplied in exactly (n - 1) times, one fewer than the term number, since the very first term has not been multiplied by anything yet. This is exactly why the formula for term n is a × r^(n-1), and not a × r^n.",
        "The same formula covers cases that look quite different from simple doubling. A ratio between 0 and 1, such as 1/2, produces decay: each term is smaller than the one before, since multiplying by a fraction less than 1 shrinks a number. A negative ratio, such as -2, makes the signs of the terms alternate between positive and negative, since multiplying by a negative number flips the sign every single time. Both of these remain genuinely geometric sequences, since the same repeated multiplication is still happening at every step; only the size and sign of r has changed.",
        "To confirm a sequence really is geometric, divide consecutive terms rather than subtracting them: a constant ratio is the defining test, and subtracting terms would only reveal a constant difference, the arithmetic test, which is a completely different pattern."
      ], "A geometric sequence begins 162, 54, 18, ... Find its nth term and term 6.", "The common ratio is 1/3. The nth term is 162(1/3)^(n-1). Term 6 is 162(1/3)^5 = 2/3.", "Do not use ar^n for a sequence whose first term is a. That would multiply once too many and make term 1 equal ar.")
    ]);

  lessons.graphsAndRatesOfChange = rewriteExistingLesson(lessons.graphsAndRatesOfChange,
    "A graph shows how two quantities vary together. Its steepness records a rate of change, its intercepts record important boundary values and the area beneath some graphs accumulates a total. We will connect each calculation to what the axes mean.",
    [{ module: "junior", key: "coordGeom" }, "simultaneousEquations"], [
      teaching([
        "Check the formula against a line you already know: y = 2x passes through (1, 2) and (3, 6), since 2×1=2 and 2×3=6. Using the gradient formula on these two points:\n(6-2)/(3-1) =\n4/2 =\n2\n- exactly matching the 2 in y = 2x. The formula recovers the gradient you already knew was there.",
        "Here is why that always works, for any straight line, not just y = 2x. Every straight line's equation can be written in the general form y = mx + c, where m and c stand for two fixed numbers particular to that one line. Any two points on such a line can be written (x₁, mx₁+c) and (x₂, mx₂+c), where the small 1 and 2 just label 'point 1' and 'point 2', and each point's y-value comes from putting its own x-value into y=mx+c. Subtracting the y-values:\ny₂-y₁ =\n(mx₂+c)-(mx₁+c) =\nm(x₂-x₁)\n- the c's cancel completely. Dividing both sides by (x₂-x₁) gives (y₂-y₁)/(x₂-x₁) = m. So whichever two points are chosen on a straight line, this calculation always returns the same value m: the gradient is a genuine property of the whole line, not of the particular points chosen to find it.",
        "To use it: label one point (x₁,y₁) and the other (x₂,y₂), subtract the y-values, subtract the x-values in the same order, then divide the first result by the second.",
        "Gradient always carries units drawn from the two axes it compares. On a distance-time graph, measuring distance in kilometres and time in hours, the gradient is kilometres per hour. On a cost graph, comparing pounds against number of items, the gradient is pounds per item.",
        "The most common mistake is mixing up the order: subtracting y₂-y₁ on top but x₁-x₂ on the bottom. That flips the sign of the whole answer. Whichever point is called 'point 1', use it as the first term in both subtractions, never mixed."
      ], "Find the gradient through (-3, 7) and (5, -1).", "Change in y is -1 - 7 = -8. Change in x is 5 - (-3) = 8. The gradient is -8/8 = -1.", "Do not reverse only one subtraction. Swapping point order is safe only when both numerator and denominator are reversed."),
      teaching([
        "Take y = 2x + 1. Substitute x=0:\ny =\n2(0)+1 =\n1\n- matching the constant term, 1. Now substitute x=1:\ny =\n2(1)+1 =\n3.\nUsing the gradient formula between (0,1) and (1,3):\n(3-1)/(1-0) =\n2/1 =\n2\n- matching the coefficient of x, 2. Both numbers in the equation turn out to have a direct, checkable meaning.",
        "That is not a coincidence for this one example: it is true of every line written in the y = mx + c form. Setting x=0 makes the mx term vanish entirely, leaving y=c, so c is always the y-value where the line crosses the y-axis, the y-intercept. And the coefficient m is always the gradient of the line, however it was found. Once an equation is written in this form, m and c can simply be read straight off, without plotting anything or picking two points.",
        "If the equation is not already arranged as y = mx + c, for example if it is written as 2y = 4x + 6 or 3x + y = 5, rearrange it into that form first. Only once y is completely isolated on one side can the coefficient of x and the constant term be read off safely as m and c.",
        "In real contexts, m and c usually mean something concrete. m is the amount added for every extra unit of x, a rate such as pounds per mile or pence per minute, while c is whatever the quantity equals when x=0, often a fixed starting charge or fee that applies before any usage at all.",
        "Parallel lines have the same gradient, since they rise at the same rate and never meet, however far extended. Perpendicular non-vertical lines have gradients whose product is exactly -1: a gradient of 2 is perpendicular to a gradient of -1/2, since 2×(-1/2)=-1.",
        "Always check a found equation by substituting both original known points into it, not just the one used to find c. The equation must reproduce both given y-values exactly; a mismatch on the second point reveals an arithmetic slip even when the first point happened to check out."
      ], "Find the equation of the line through (2, 7) and (6, 19).", "The gradient is (19 - 7)/(6 - 2) = 3. Use 7 = 3(2) + c to get c = 1. The equation is y = 3x + 1.", "Do not read c as the x-intercept. It is the y-value when x is zero."),
      teaching([
        "Start with the simplest case: an object moving at a constant 10 m/s for 4 seconds. By the familiar formula:\ndistance =\nspeed × time =\n10×4 =\n40 metres.\nNow look at the graph of this journey: velocity is a flat horizontal line at height 10, from time 0 to time 4, a rectangle. Its area is:\nheight×width =\n10×4 =\n40.\nThe two calculations, done completely differently, give exactly the same number.",
        "That match is not a coincidence: it is built into the units. Area under this kind of graph is always height×width, and here height is measured in m/s while width is measured in s, so height×width is measured in (m/s)×s = m, metres, exactly the unit distance is measured in. Whatever shape the region under the graph happens to be, working out its area in the ordinary geometric sense produces a quantity in metres, which is distance travelled.",
        "This still works even when the velocity is changing, so the top edge of the region is sloped or curved rather than flat, because the graph can be thought of as made of enormously many very short, near-constant-velocity strips side by side. Each thin strip behaves like the flat case above, a very short constant speed for a very short time, and 'the area under the graph' is exactly the sum of all those strips added together, so it still equals total distance.",
        "In practice: identify what shape the region under the line makes, a rectangle for constant velocity, a triangle for velocity rising steadily from zero, a trapezium for velocity rising steadily from a non-zero starting value, or several of these joined together, then use the matching area formula.",
        "Two things to watch: this rule is specific to velocity-time graphs (area under a distance-time graph does not represent anything physical), and if part of the graph dips below the time-axis, meaning negative velocity, travel in the opposite direction, that area represents distance in the opposite direction. Read the question carefully to see whether it wants total distance or overall displacement."
      ], "A car accelerates uniformly from 4 m/s to 16 m/s over 6 seconds. Find its displacement.", "The region is a trapezium. Its area is 1/2 × (4 + 16) × 6 = 60, so the displacement is 60 m.", "Do not read the height of a velocity-time graph as distance. Height is velocity; distance or displacement comes from area.")
    ]);

  lessons.surdicModularNumberTheory = rewriteExistingLesson(lessons.surdicModularNumberTheory,
    "Some exact-number questions combine ideas that are usually taught separately. Prime factors decide whether a fraction terminates, conjugates remove awkward surd terms and remainder cycles tame enormous powers. In every case, structure replaces brute-force calculation.",
    ["surdsAndIndices", "numberTheoryDivisibility"], [
      teaching([
        "Divide 1 by 4 by hand: 1 ÷ 4 = 0.25 exactly, and the division stops. That is because 1/4 can be rewritten with a denominator of 100, a power of 10: 1/4 = 25/100, and any fraction over a power of 10 is just digits placed after the decimal point, so it terminates.",
        "Now divide 1 by 3: 1 ÷ 3 = 0.333... and it never stops, no matter how many more 3s are computed. The reason is that no whole number multiplied by 3 ever lands exactly on a power of 10 (10, 100, 1000, ...), so 1/3 can never be rewritten with a power-of-10 denominator the way 1/4 could.",
        "This next step leans on prime factorisation from an earlier lesson: breaking a number down into the prime numbers that multiply together to make it. Since 10 = 2 × 5, every power of 10 is built only from the prime factors 2 and 5. A fraction can be rewritten over a power of 10 exactly when its fully simplified denominator's only prime factors are 2 and/or 5 too. If the denominator contains any other prime factor, such as 3, 7 or 11, it can never be scaled up to match a power of 10, so the division carries on forever and the decimal recurs.",
        "That gives the working rule: a fraction terminates exactly when its fully simplified denominator has no prime factors other than 2 and 5. Any other prime factor in the denominator means the decimal recurs.",
        "The word 'simplified' matters. Check the denominator's prime factors only after cancelling anything the numerator and denominator share. For example, 3/6 looks like it has a 3 in the denominator's factorisation (6 = 2×3), but 3/6 simplifies to 1/2 first, and 1/2 terminates perfectly well, since the 3 cancelled away before it could cause trouble."
      ], "Does 21/280 have a terminating decimal?", "Simplify 21/280 to 3/40. Since 40 = 2³ × 5 contains only 2s and 5s, the decimal terminates.", "Testing the unsimplified denominator can give the wrong conclusion. Cancel common factors before examining its primes."),
      teaching([
        "Let x and y stand for any two numbers or algebraic terms, nothing here depends on them being surds yet. Expand (x+y)(x-y) fully using FOIL, keeping every term rather than jumping to the answer:\n(x+y)(x-y) =\nx×x + x×(-y) + y×x + y×(-y) =\nx² - xy + xy - y².",
        "Look at the middle two terms: -xy and +xy are exact opposites, so they cancel to zero, leaving x² - y². That is the whole difference-of-two-squares identity, and it comes from watching the middle terms destroy each other, not from a rule handed down with no explanation.",
        "The two expressions being multiplied, (x+y) and (x-y), contain exactly the same two terms but with the sign in the middle flipped. A pair like that is called a conjugate pair, and multiplying a conjugate pair together like this is exactly the trick this section is named after.",
        "Now bring surds into it. Let a and b be two numbers that are not negative, so that √a and √b are real numbers, and set x = √a, y = √b, a conjugate pair built from surds instead of plain letters. The same cancellation happens: (√a+√b)(√a-√b) = (√a)² - (√b)². Since squaring undoes a square root, (√a)² = a and (√b)² = b, and the whole expression collapses to a - b, with no surds left anywhere.",
        "Check it on numbers where both sides are easy to verify directly: let a=9, b=4.\n(√9+√4)(√9-√4) =\n(3+2)(3-2) =\n5×1 =\n5,\nand\na-b =\n9-4 =\n5.\nBoth routes agree.",
        "Once the (√a+√b)(√a-√b) shape is recognised, a conjugate pair of surds, skip the expansion and jump straight to a-b. The one condition to watch for: the same pair of terms must appear with opposite signs. (√a+√b)(√a+√b) is a completely different calculation, a square of a sum, not a difference of squares, so check the signs before applying the shortcut."
      ], "Rationalise 5/(2 + √3).", "Multiply by (2 - √3)/(2 - √3). The denominator becomes 4 - 3 = 1, so the result is 5(2 - √3) = 10 - 5√3.", "Do not change the sign of the whole denominator. The conjugate changes only the sign between its two terms."),
      teaching([
        "Let a and m be two whole numbers, with m greater than zero, called the modulus. 'a mod m' just means the remainder left when a is divided by m. Check:\n17 ÷ 5 =\n3 remainder 2, so\n17 mod 5 =\n2.\nAnother check:\n20 ÷ 5 =\n4 remainder 0, so\n20 mod 5 =\n0, since 5 divides 20 exactly.",
        "For small numbers, finding aᵇ mod m is direct: work out the power aᵇ first, then divide by m and read off the remainder. For example:\n3⁴ =\n81, and\n81 ÷ 7 =\n11 remainder 4\n(since 11×7 = 77 and 81-77 = 4), so\n3⁴ mod 7 =\n4.",
        "For a large exponent b, computing aᵇ directly becomes impossible; the number of digits explodes long before it could be divided by anything. Instead, track only the remainder after each multiplication, and watch for it starting to repeat. List the remainders of successive powers of 3 mod 7:\n3¹ mod 7 = 3,\n3² mod 7 =\n9 mod 7 =\n2,\n3³ mod 7 =\n27 mod 7 =\n6,\n3⁴ mod 7 =\n81 mod 7 =\n4\n(matching above),\n3⁵ mod 7 =\n(4×3) mod 7 =\n12 mod 7 =\n5,\n3⁶ mod 7 =\n(5×3) mod 7 =\n15 mod 7 =\n1.",
        "3⁶ mod 7 landing back on 1 is the signal to stop: multiplying by 3 again just restarts the same sequence, since\n3⁷ mod 7 =\n(1×3) mod 7 =\n3,\nidentical to 3¹ mod 7. So the remainders cycle forever in a block of length 6: 3, 2, 6, 4, 5, 1, then repeat.",
        "To find a huge power like 3²⁰ mod 7 without ever computing 3²⁰, work out where exponent 20 falls inside that length-6 cycle:\n20 ÷ 6 =\n3 remainder 2, so 3²⁰ sits in the same position as 3² in the list, giving\n3²⁰ mod 7 =\n2.\nThe cycle length is not always guessable in advance; it has to be found by generating remainders until one repeats a value seen before."
      ], "Find 3^100 mod 7.", "Powers of 3 modulo 7 cycle 3, 2, 6, 4, 5, 1 with length 6. Since 100 leaves remainder 4 when divided by 6, use position 4. The remainder is 4.", "Do not store enormous intermediate powers. Reduce modulo n after every multiplication or squaring.")
    ]);

  lessons.algebraicProof = rewriteExistingLesson(lessons.algebraicProof,
    "A proof explains why a statement must be true in every case covered by its claim. Examples can suggest a pattern and counterexamples can destroy a false claim, but a general algebraic argument is what closes every possible gap.",
    ["algebraicManipulation"], [
      teaching([
        "Words such as even, odd and consecutive describe whole families of numbers. Algebra lets us represent the entire family with one expression.",
        "Every even integer is 2n for some integer n. Every odd integer is 2n + 1. These forms encode the defining remainder after division by 2.",
        "Consecutive integers can be written n, n + 1, n + 2. Consecutive even integers are 2n, 2n + 2, 2n + 4.",
        "State that n is an integer. Without that condition, 2n need not represent an even integer.",
        "Choose a form that exposes the property you need to prove. A multiple of 5 is 5n and a number leaving remainder 3 on division by 5 is 5n + 3."
      ], "Represent three consecutive odd integers and find their sum in simplified form.", "Use 2n + 1, 2n + 3 and 2n + 5. Their sum is 6n + 9 = 3(2n + 3), so it is a multiple of 3.", "Do not write consecutive odd integers as n, n + 1, n + 2. Odd integers differ by 2."),
      teaching([
        "Checking a statement for several values is useful exploration. It can reveal a pattern, suggest an algebraic form or uncover a counterexample.",
        "However, a finite list cannot establish a claim about infinitely many integers. Untested values remain outside the argument.",
        "One counterexample is enough to disprove a universal claim because the word ‘every’ allows no exceptions.",
        "A successful proof begins with an arbitrary member of the stated family, not a favourite example. The conclusion must follow without choosing a special value.",
        "Computer testing and proof have different roles. Testing searches; proof explains why failure is impossible within the stated conditions."
      ], "Explain why checking n² + n for n = 1 to 1,000 does not prove it is always even, then state what a proof must do.", "The checks cover only 1,000 integers. A proof must write an arbitrary integer n and show algebraically that n² + n has a factor of 2.", "Do not call repeated evidence a proof. Ask whether the argument covers an arbitrary permitted value."),
      teaching([
        "A complete proof has a visible beginning, chain of reasoning and conclusion. Begin by defining an arbitrary integer in a form suited to the claim.",
        "Manipulate the expression using valid algebra. Each line should follow from the previous one, rather than jumping to the desired result.",
        "At the end, connect the algebraic form back to the mathematical definition. Reaching 2 times an integer proves evenness because that is what even means.",
        "When multiplying unknown integers, note that their product and sum are still integers. This justifies treating a complicated bracket as one integer.",
        "Finish with a sentence that matches the scope of the claim, such as ‘therefore the square of every odd integer is odd’."
      ], "Prove that the product of two consecutive integers is even.", "Let the integers be n and n + 1. Consecutive integers have opposite parity, so one is even. Equivalently, if n = 2k then n(n + 1) has factor 2, while if n = 2k + 1 then n + 1 = 2(k + 1). In both cases the product is twice an integer, so it is even.", "Do not end after obtaining an expression. Say explicitly why its form proves the required property.")
    ]);

  lessons.functionsAndIteration = rewriteExistingLesson(lessons.functionsAndIteration,
    "A function is a rule with named inputs and outputs. Functions can be joined, reversed and repeatedly fed back into themselves. Careful notation matters because changing the order of these operations usually changes the result.",
    ["algebraicManipulation", { module: "junior", key: "numberMachine" }], [
      teaching([
        "Try it out on numbers before worrying about notation. Let f(x) = 2x+1 and g(x) = x-3. Work out g(5) first:\ng(5) =\n5-3 =\n2.\nNow feed that answer into f:\nf(2) =\n2(2)+1 =\n5.\nSo doing g then f on the number 5 gives 5.",
        "Now do the two functions in the other order on the same starting number, to see whether order matters:\nf(5) =\n2(5)+1 =\n11.\nFeed that into g:\ng(11) =\n11-3 =\n8.\nDoing f then g on 5 gives 8, not 5. The two answers are different, so which function goes first genuinely changes the result, order matters.",
        "This is exactly what the notation fg(x) is built to tell you. Read it as a sentence: 'f of g of x'. The function written closest to x, here g, is the one that acts on x first; its output then becomes the input to the next function out, here f. So fg(x) means f(g(x)), and the calculation above (g first, giving 2, then f, giving 5) is precisely fg(5) = 5. The other order, f then g, is a completely different function called gf(x) = g(f(x)).",
        "The technique, then, is always to work from the inside out: whichever function is written nearest to x, do that one first, then apply the next function to whatever number comes out.",
        "The most common mistake is reading fg(x) left to right, like reading English, and doing f first. Always look at which letter is touching the bracket around x, that is the one that goes first."
      ], "Let f(x) = 2x - 1 and g(x) = x² + 3. Find fg(x) and gf(x).", "fg(x) = f(g(x)) = 2(x² + 3) - 1 = 2x² + 5. gf(x) = g(f(x)) = (2x - 1)² + 3 = 4x² - 4x + 4.", "Do not read fg(x) as f(x) × g(x). It denotes composition, and the right-hand function acts first."),
      teaching([
        "Take f(x) = 3x-4. Work out f(3):\nf(3) =\n3(3)-4 =\n5.\nAn inverse function's whole job is to undo this, to take the 5 back to the 3 it came from. Whatever process does that job is called f⁻¹, read as 'f inverse'. That little -1 is just a label meaning 'the inverse of f', it is not a power, and f⁻¹(x) does not mean 1/f(x), even though it is written similarly to power notation. Whatever process f⁻¹ turns out to be, it must satisfy f⁻¹(5) = 3.",
        "Here is the method for finding that process algebraically. Write the function as y = 3x-4, thinking of x as the input and y as the output. An inverse just swaps which one you know and which one you are solving for, so swap the letters: x = 3y-4. This new equation describes exactly the same input-output pairs, but now reversed: you are told the old output (renamed x) and asked to recover the old input (renamed y).",
        "Now rearrange this swapped equation to make y the subject again, using ordinary equation-solving steps. Add 4 to both sides:\nx+4 =\n3y.\nThen divide both sides by 3:\ny =\n(x+4)/3.\nThat gives f⁻¹(x) = (x+4)/3.",
        "Check it does what an inverse should:\nf⁻¹(5) =\n(5+4)/3 =\n9/3 =\n3\n- exactly the input that produced 5 in the first place. That check, feeding f's output back into f⁻¹ and getting the original input, is always worth doing once an inverse has been found.",
        "One thing to watch for: the swap-and-rearrange method needs the original equation to be fully isolated as y = ... before swapping, and you must finish by isolating y again afterwards, stopping halfway through the rearrangement is the most common way marks are lost."
      ], "Find the inverse of f(x) = (3x - 5)/2.", "Write y = (3x - 5)/2. Swap x and y: x = (3y - 5)/2. Rearrange to 2x + 5 = 3y, so f⁻¹(x) = (2x + 5)/3.", "Do not replace f⁻¹(x) with 1/f(x). Inverse notation describes undoing the rule, not taking a reciprocal."),
      teaching([
        "Some equations, like x² = 5, do not have a nice whole-number or fraction answer, the solution is an infinite, non-repeating decimal. Iteration is a way of getting as close as you like to that decimal, by repeating a simple calculation over and over, each time feeding the previous answer back in to generate a better one.",
        "To keep track of which attempt is which, every approximation gets a subscript number: x₀ is the very first guess, x₁ is the result after doing the calculation once, x₂ is the result after doing it twice, and so on. In general, xₙ means 'the approximation after n repeats', and xₙ₊₁ simply means 'the next one after that'. So a rule written as xₙ₊₁ = (something involving xₙ) is just an instruction: take whichever approximation you currently have, do the calculation, and the answer is the next one in the list.",
        "Rearranging x² = 5 gives x = 5/x, and averaging x with 5/x turns out, when applied repeatedly, to home in on the actual answer. Written with the subscript notation just introduced, that rule is:\nxₙ₊₁ =\n(xₙ + 5/xₙ)/2\n- meaning 'to get the next approximation, average the current one with 5 divided by the current one'.",
        "Check what happens if the exact answer, √5 ≈ 2.2361, is fed in itself:\n(2.2361 + 5/2.2361)/2 =\n(2.2361 + 2.2361)/2 =\n2.2361.\nNothing changes, the true solution is a 'fixed point' of this process, meaning the formula leaves it unchanged. Writing the rearranged equation as x = g(x), a fixed point is exactly a value of x for which x = g(x) is already true.",
        "Starting from a number that is not the exact answer, each application of the formula happens to move the result closer to that fixed point rather than further away, for this particular rearrangement. Start at x₀ = 2, a sensible guess, since 2²=4 and 3²=9, so √5 must lie between 2 and 3:\nx₁ =\n(2+5/2)/2 =\n2.25,\nalready much closer to the true value 2.2361 than the starting guess of 2 was.",
        "The technique in general: rearrange the original equation into the form x = g(x), pick a sensible starting value x₀, often given, or found by noticing which two whole numbers the answer must lie between, then repeatedly substitute each output back in as the next input, keeping full decimal accuracy throughout.",
        "Two pitfalls. First, not every rearrangement of the same equation converges, some send the values further and further away instead, so always check the first couple of iterations are actually getting closer together, not further apart. Second, rounding too early and carrying the rounded value forward compounds the error at every step, keep several extra decimal places during the working, and only round the final answer."
      ], "Use x_(n+1) = √(10 - x_n), starting with x₀ = 3, to approximate the fixed point to three decimal places.", "The iterates are approximately 2.646, 2.712, 2.700, 2.702 and 2.702. They settle to 2.702 to three decimal places.", "Do not round each iterate to the final requested accuracy. Keep calculator precision until the sequence has settled.")
    ]);

  lessons.diophantineEquations = rewriteExistingLesson(lessons.diophantineEquations,
    "A Diophantine equation asks for integer solutions. Ordinary algebra may describe infinitely many real pairs, but the whole-number condition changes which answers are allowed. Divisibility, common factors and modular reasoning become part of solving the equation.",
    ["numberTheoryDivisibility", "simultaneousEquations"], [
      teaching([
        "Start with something you can check by hand, before any letters get involved. Look at the equation 6x + 9y, where x and y can be any whole numbers, including negative ones and zero. Since 6 = 3×2, the first term is:\n6x =\n3×2×x =\n3×(2x),\nwhich is 3 times a whole number, whatever x is. Since 9 = 3×3, the second term is 9y = 3×(3y), also 3 times a whole number. Adding them:\n6x + 9y =\n3(2x) + 3(3y) =\n3(2x + 3y).\nThis is 3 times a whole number no matter which integers x and y are picked, it is forced to be a multiple of 3, always.",
        "That pattern generalises to any two numbers, not just 6 and 9. Let a and b be two whole numbers, and let h be their Highest Common Factor, HCF(a,b): the largest whole number that divides both a and b exactly. For example, HCF(12,18) = 6, because 6 divides both 12 and 18 exactly, and no bigger number manages that.",
        "Since h divides a exactly, a must be h multiplied by some other whole number, call that number p, so a = h×p. Since h divides b exactly, b must be h multiplied by some other whole number too, call that one q, so b = h×q. In the running example, a=12, b=18, h=6: 12 = 6×2 so p=2, and 18 = 6×3 so q=3.",
        "Now look at a×x + b×y, where x and y are any integers. Since a=h×p and b=h×q: a×x + b×y = (h×p)×x + (h×q)×y = h×p×x + h×q×y. Both terms contain a factor of h, so h can be pulled outside a bracket: h×(p×x + q×y). The part inside the brackets is a whole number, since p, q, x and y all are, so the entire expression is h times a whole number, exactly what it means for something to be a multiple of h.",
        "The consequence: if c is not a multiple of HCF(a,b), then a×x + b×y = c can never hold for any integers x and y, since the left side is forced to be a multiple of HCF(a,b), and the right side, c, is not. Remarkably, the reverse is also guaranteed to be true, a result called Bezout's identity: whenever HCF(a,b) does divide c, at least one integer solution definitely exists. So this single divisibility check is a complete yes/no test, not just a way to rule things out.",
        "In practice: find HCF(a,b) by listing factors, then check whether it divides c exactly. This test only tells you whether a solution exists, not what it actually is, finding the actual x and y values is the job of the next section."
      ], "Does 12x + 18y = 25 have integer solutions?", "HCF(12,18) = 6, and 6 does not divide 25. Therefore there are no integer solutions.", "Do not begin random trial before checking the HCF condition. It can prove impossibility immediately."),
      teaching([
        "Once you know a solution exists, isolate one variable, say x = (c − by)/a, and search for a value of y that makes the numerator divide exactly by a. The most direct way is to try y = 0, 1, 2, 3, ... in turn until one works, as in Examples 1-3 below.",
        "That trial method always gets there in the end, but every rejected guess still costs a full subtraction and division. There is a way to rule out most guesses in advance, using nothing more than remainders, what is left over after dividing, a term already familiar from KS3 division.",
        "Look again at Example 1's equation, 3x + 4y = 25, to see how. We need (25 − 4y) to divide exactly by 3, which means it must leave remainder 0 when divided by 3. Instead of doing the full calculation for every possible y, work out just the remainder left by (25 − 4y) when divided by 3, for y = 0, then y = 1, then y = 2:\ny = 0: 25 − 4(0) = 25. Dividing, 25 ÷ 3 = 8 remainder 1.\ny = 1: 25 − 4(1) = 21. Dividing, 21 ÷ 3 = 7 remainder 0. This is the remainder needed.\ny = 2: 25 − 4(2) = 17. Dividing, 17 ÷ 3 = 5 remainder 2.",
        "Now try the next value, y = 3, and compare its remainder with y = 0's: 25 − 4(3) = 13, and 13 ÷ 3 = 4 remainder 1, the same remainder as y = 0 gave. This is not a coincidence. Increasing y by 3 changes 4y by 4 × 3 = 12, and 12 divides exactly by 3 with nothing left over, so adding 12 can never change the remainder. This means the three remainders found above, for y = 0, 1 and 2, simply repeat forever.",
        "So checking only three values of y, 0, 1 and 2, reveals the complete pattern for every value of y there could ever be. Since y = 1 is the only one of those three that gives remainder 0, the only values of y that can ever produce a whole-number x are y = 1, 4, 7, 10, ... The first one on that list, y = 1, is exactly the solution Example 1 found by testing y = 0 and then y = 1, the remainder method reaches the same answer, but it tells you in advance which values are even worth testing.",
        "Once one solution (x₀, y₀) is known, it generates a whole family of further solutions. For ax + by = c with highest common factor d of a and b, every solution has the form x = x₀ + (b/d)t and y = y₀ − (a/d)t for any integer t, stepping x up and y down (or vice versa) always keeps ax + by equal to c, since the two changes exactly cancel in the equation.",
        "Apply any positivity or range condition only after you have the general family, and always finish by substituting the proposed pair back into the original equation, since integer-looking working can still hide an arithmetic slip."
      ], "Find all non-negative integer solutions of 4x + 7y = 39.", "Check the remainder of (39 − 7y) divided by 4 for y = 0, 1, 2, 3, the coefficient of x is 4, so the pattern must repeat every 4 values of y. y = 0 gives remainder 3, y = 1 gives remainder 0 (39 − 7 = 32, and 32 ÷ 4 = 8 remainder 0), y = 2 gives remainder 1, y = 3 gives remainder 2. So only y = 1, 5, 9, ... can work. y = 1 gives x = (39 − 7)/4 = 8. y = 5 gives x = (39 − 35)/4 = 1. y = 9 would need x = (39 − 63)/4, which is negative, so it is rejected. The solutions are (8, 1) and (1, 5).", "Finding one integer pair does not prove it is the only one. Describe the solution family, then apply the bounds."),
      teaching([
        "A two-digit number with tens digit a and units digit b is 10a + b. Reversing the digits gives 10b + a.",
        "Digit conditions convert a word puzzle into an integer equation with bounds 1 ≤ a ≤ 9 and 0 ≤ b ≤ 9.",
        "Statements about sums, differences or multiples provide additional equations or divisibility conditions.",
        "Use the digit bounds early. They turn an infinite integer family into a small finite set.",
        "Check that the final digits satisfy every verbal clue and that a leading digit is not zero."
      ], "A two-digit number is four times the sum of its digits. Its digits differ by 3. Find all possibilities.", "Let the number be 10a + b. Then 10a + b = 4(a + b), so 6a = 3b and b = 2a. With |a - b| = 3, we get a = 3 and b = 6. The number is 36.", "Do not represent a two-digit number as a + b. Place value makes it 10a + b.")
    ]);

  lessons.combinatoricsAndCounting = rewriteExistingLesson(lessons.combinatoricsAndCounting,
    "Combinatorics counts arrangements without relying on long lists. The central question is whether order creates a new outcome. Once that is settled, multiplication, factorials and combinations provide systematic methods that also show nothing has been missed.",
    [{ module: "primary", key: "combinatoricsCounting" }, { module: "junior", key: "seating" }], [
      teaching([
        "Start with something small enough to list by hand. How many ways can 3 people, A, B and C, stand in a queue? Write every arrangement out: ABC, ACB, BAC, BCA, CAB, CBA. That is 6 arrangements, and no others are possible: any attempt to write a 7th will just repeat one you already have.",
        "Notice how that count of 6 also falls out of a simple slot-filling argument: there are 3 choices for who stands first. Once that person is fixed, only 2 people are left for the second slot. Once that is fixed, only 1 person is left for the third slot. Multiplying the choices at each stage gives 3 × 2 × 1 = 6, exactly matching the list. This 'multiply the choices at each stage' idea is called the multiplication principle, and it is the engine behind every count in this lesson.",
        "Now generalise it. If you are arranging r items chosen from n distinct items into order, the first slot has n choices, the second has (n-1) choices since one item is used up, the third has (n-2), and so on, for r slots in total. This count is written nPr ('n permute r'): nPr = n × (n-1) × (n-2) × ... down to r terms.",
        "The one thing to watch is where the multiplication stops. It runs for exactly r terms, not all the way down to 1, unless r happens to equal n. If you are placing 3 out of 8 runners into 1st, 2nd and 3rd, you multiply 8 × 7 × 6, three terms, one per medal, and then stop: there is no reason to keep going down to 5, 4, 3, because only 3 positions exist.",
        "Some questions add a restriction, such as two particular items needing to sit next to each other. The usual method is to glue the linked items into a single block, arrange that block together with everything else, then multiply by the number of ways the items can sit inside the block. Example 4 below works through this in full."
      ], "In how many ways can the letters of the word FLUKE be arranged so that the two vowels, U and E, stand next to each other?", "Glue U and E into a single block. There are then 4 items to arrange: the block, F, L and K, giving 4! = 24 arrangements. Inside the block, U and E can sit in 2 orders, UE or EU, so multiply: 24 × 2 = 48 arrangements.", "Check first whether a condition is automatically satisfied before applying a memorised block method. If a word only has one vowel, being told the vowels are together restricts nothing at all."),
      teaching([
        "Compare two different questions about the same 3 people, A, B and C. Question 1: how many ordered pairs can you make, like picking a captain then a vice-captain? List them: AB, BA, AC, CA, BC, CB. That is 6, matching nPr with n=3, r=2 (3×2=6). Question 2: how many ways can you choose an unordered pair, like picking 2 people for a team where nobody has a special role? List them: AB, AC, BC. That is only 3, because AB and BA are now the same choice: the same two people.",
        "Look at the ratio between those two counts: 6 ÷ 3 = 2. That 2 is not a coincidence, and it is worth defining a new piece of notation to describe it properly. For a whole number n, write n! (read 'n factorial') to mean n multiplied by every smaller whole number down to 1: n! = n × (n-1) × (n-2) × ... × 2 × 1. So 2! = 2 × 1 = 2, and 3! = 3 × 2 × 1 = 6. The ratio just found, 2, is exactly 2!: it is the number of ways to reorder any 2 chosen items, since AB can only become BA, one swap, giving 2! = 2 orderings. Every unordered pair, like {A,B}, corresponds to exactly 2 of the ordered pairs, AB and BA, so the ordered count is always r! times bigger than the unordered count, for a selection of size r. That gives the rule: nCr = nPr ÷ r!.",
        "nPr can also be written using factorial notation instead of a running product, and it is worth checking the two forms really agree before using either. Take the running example again, n=3, r=2: n! = 3! = 3×2×1 = 6, and (n-r)! = (3-2)! = 1! = 1, since when the countdown reaches 1 there is nothing smaller left to multiply by. Dividing: n!/(n-r)! = 6/1 = 6, the same 6 as nPr = 3×2 computed directly above. This works in general, not just for these numbers: n! is the full product n×(n-1)×...×(n-r+1)×(n-r)×(n-r-1)×...×1, and dividing by (n-r)! cancels exactly that second half of the chain, the tail running from (n-r) down to 1, leaving only the first r factors, n×(n-1)×...×(n-r+1). So nPr = n!/(n-r)!, and dividing that by r! to remove the ordering, exactly as just shown, gives the full combination formula: nCr = n!/(r!×(n-r)!).",
        "In practice it is often quickest to compute nPr first as a short multiplication chain, then divide by r! at the end, cancelling where possible rather than working out huge factorials.",
        "The key question to ask before choosing which formula to use is: are the chosen items being given different roles, positions, medals, ordered slots, or are they just being grouped together as an unordered set, a team, a committee, a handful of toppings? Different roles mean permutations; an unordered group means combinations, and dividing out the r! is essential or the count overcounts."
      ], "How many four-person committees can be chosen from 10 people if two particular people, P and Q, may not both be on the committee?", "All committees: 10C4 = 210. Committees containing both P and Q take up 2 of the 4 places, so the other 2 come from the remaining 8 people: 8C2 = 28. Subtract: 210 - 28 = 182 committees.", "Do not use permutations for an unordered team. Rearranging the same members does not create a new team."),
      teaching([
        "Take a small group of 4 people, A, B, C and D, and have everyone shake hands with everyone else exactly once. List every handshake: AB, AC, AD, BC, BD, CD. That is 6 handshakes, and listing any more would just repeat a pair, since BA is the same handshake as AB.",
        "Look closely at what a handshake actually is: it is simply an unordered choice of 2 people out of the group. That means the number of handshakes in a group of n people is exactly nC2, the same quantity from section 2, just wearing a different costume.",
        "Since nCr = nPr ÷ r!, setting r = 2 gives nC2 = nP2 ÷ 2! = [n × (n-1)] ÷ 2. For the group of 4, that is (4 × 3) ÷ 2 = 12 ÷ 2 = 6, matching the list exactly.",
        "The division by 2 is doing real work here, not just decoration: without it you would be counting 'A shakes B's hand' and 'B shakes A's hand' as two separate events, when they are actually the same physical handshake. Dividing by 2! is exactly how section 2 taught you to remove that kind of double count.",
        "Some contexts create two distinct events per pair rather than one, such as a league where every pair of teams plays twice, once at each home ground. In that case, count the unordered pairings with nC2 first, then multiply by 2 to account for the two separate matches. Example 4 below works through this."
      ], "A regional cup has 14 teams, and each pair of teams plays twice, once at each ground. How many matches are played in total?", "Unique pairings: 14C2 = (14×13) ÷ 2 = 91. Each pairing plays twice, so multiply by 2: 91 × 2 = 182 matches.", "The handshake formula counts each unordered pair once. Multiply only when the context creates several distinct events for each pair.")
    ]);

  lessons.advancedProbability = rewriteExistingLesson(lessons.advancedProbability,
    "Probability measures uncertainty on a scale from 0 to 1. Multi-stage problems become manageable when we separate routes, decide whether earlier events change later probabilities and recognise when a complementary event is easier to count.",
    ["combinatoricsAndCounting", { module: "primary", key: "fractionArithmetic" }], [
      teaching([
        "List every equally likely outcome of flipping a coin and rolling a die together: 2 coin results × 6 die results = 12 equally likely pairs in total. Exactly one of those pairs is (heads, 6). Write P(event) as shorthand for 'the probability that event happens': a number between 0 (impossible) and 1 (certain), found here just by counting favourable outcomes divided by total equally likely outcomes. So P(heads AND a 6) = 1/12 by direct counting.",
        "Compare that to multiplying the two separate probabilities: P(heads) = 1/2, P(a 6) = 1/6, and 1/2 × 1/6 = 1/12, exactly matching the count. This isn't a coincidence: because the coin and die don't affect each other, every one of the coin's 2 outcomes can be paired with every one of the die's 6 outcomes, giving 2 × 6 = 12 equally likely combined outcomes in total, of which exactly 1 × 1 = 1 is the combination wanted. Dividing favourable by total, (1×1)/(2×6), is the same calculation as (1/2)×(1/6) rearranged; multiplying the separate probabilities together always gives the right answer, provided the events genuinely don't influence each other.",
        "This only works for independent events: ones where knowing the outcome of one tells you nothing about the other. To use the rule, confirm the events are independent, then simply multiply their individual probabilities.",
        "The danger is applying this same multiplying shortcut to events that DO affect each other, covered in the next section, where the probabilities themselves change once the first event has happened."
      ], "A fair coin is tossed and a fair six-sided die is rolled. Find the probability of a head and a multiple of 3.", "P(head) = 1/2 and P(multiple of 3) = 2/6 = 1/3. The events are independent, so multiply: 1/2 × 1/3 = 1/6.", "Do not add probabilities for events that must happen together along one route." , "intermediate-probability-tree"),
      teaching([
        "Take a tiny bag with 2 red counters (call them R1 and R2 to tell them apart) and 1 blue counter (B), and draw 2 counters out one after another without putting the first one back. Listing every equally likely ordered result: (R1,R2), (R1,B), (R2,R1), (R2,B), (B,R1), (B,R2): 6 outcomes altogether, 3 choices for the first draw, then 2 remaining choices for the second. Exactly 2 of these 6 outcomes are 'both red': (R1,R2) and (R2,R1). So P(both red) = 2/6 = 1/3, found by direct counting.",
        "Now compare that to working it out via probabilities: P(1st red) = 2/3, since 2 reds out of 3 counters. But for the second draw, one red counter and one counter overall have already gone, leaving only 2 counters, 1 of them red. This second probability needs a new piece of language: write P(B given A) to mean the probability that B happens, worked out using only the outcomes where A has already happened. It is called a conditional probability, and 'given' is the word that introduces the condition. Here, P(2nd red, given the first was red) means exactly 'assuming the first counter really was red, what fraction of what's left is red?', and that fraction is 1/2, since 1 red counter is left out of 2 counters left. Multiplying: 2/3 × 1/2 = 2/6 = 1/3, matching the count exactly.",
        "That match reveals what is different here from Section 1: once a counter is removed and not replaced, both the number left in total and the number left of the type just drawn are reduced by one for the next draw. The second probability genuinely depends on what happened first: the events are no longer independent, so the numbers used for the second draw must be adjusted before multiplying.",
        "In general: work out the first draw's probability as normal. For the second draw, reduce the total (the denominator) by 1, and reduce the count of whatever was actually drawn first (the relevant numerator) by 1 as well, before writing the second fraction. Then multiply, exactly as before.",
        "One more rule is worth naming here, since the examples below need it: when a result can happen via two or more different routes that can't both occur at once, like 'red-then-blue' OR 'blue-then-red', work out the probability of each route separately and then add the routes together. This addition is safe exactly because the routes are non-overlapping, since getting red-then-blue on a given pair of draws rules out getting blue-then-red on that same pair, so nothing is being double-counted. This is the OR rule, and it is the opposite move to the AND rule from Section 1, which multiplies rather than adds.",
        "The single most common mistake is forgetting to reduce the total on the second draw, using the original total instead of one fewer: always ask 'how many counters are left in the bag altogether now?' before writing the second fraction."
      ], "A bag has 6 yellow and 4 purple counters. Two are drawn without replacement. Find the probability of one of each colour.", "The routes are yellow-then-purple and purple-then-yellow. Their probabilities are 6/10 × 4/9 = 24/90 and 4/10 × 6/9 = 24/90. Adding gives 48/90 = 8/15.", "Do not keep the original denominator on the second draw. The total shrinks by 1 every time a counter is removed."),
      teaching([
        "Flip two fair coins and list all 4 equally likely outcomes: HH, HT, TH, TT. Count how many contain at least one head: HH, HT and TH all do, that's 3 out of 4, so P(at least one head) = 3/4 by direct counting.",
        "Now work it out a different way: P(no heads at all) means both flips are tails, which is just the single outcome TT, so P(no heads) = 1/4. Subtracting from 1: 1 − 1/4 = 3/4, exactly matching the count.",
        "That match is guaranteed, not lucky. 'At least one head' and 'no heads at all' are opposites: every possible outcome falls into exactly one of these two categories, with nothing left over and no overlap between them. Two categories that between them cover every possibility, with no overlap, must have probabilities that add up to exactly 1. Rearranging P(at least one) + P(none) = 1 gives P(at least one) = 1 − P(none).",
        "This is most useful when 'none happening' is much easier to calculate directly than 'at least one happening', which is almost always true once there are more than two events or trials, since 'at least one' would otherwise mean adding up lots of separate messy cases (exactly one, exactly two, exactly three...), whereas 'none' is just one multiplication.",
        "The pitfall to avoid: P(at least one) is NOT found by adding the individual probabilities of each trial together, since that method overcounts and can even produce an answer bigger than 1 once there are enough trials. Always go via the complement, P(none), instead."
      ], "A fair coin is flipped five times. Find the probability of at least one head.", "P(no heads at all) means five tails: (1/2)⁵ = 1/32. So P(at least one head) = 1 - 1/32 = 31/32.", "Do not confuse 'at least one' with 'exactly one'. The former includes every positive number of successes.")
    ]);

  lessons.invariantsAndParity = rewriteExistingLesson(lessons.invariantsAndParity,
    "Some puzzles look as though every move creates a new situation, yet one hidden property never changes. Such a property is an invariant. Parity, colouring and totals modulo a fixed number often reveal impossibility without examining every move.",
    ["numberTheoryDivisibility"], [
      teaching([
        "Parity, whether a number is odd or even, is really just divisibility by 2: the same idea covered in general in the divisibility prerequisite lesson, just specialised down to the only two possible remainders when dividing by 2, 0 (even) or 1 (odd).",
        "Check the basic rules on real numbers before trusting them. 4 + 6 = 10 (even + even = even). 3 + 5 = 8 (odd + odd = even). 3 + 4 = 7 (odd + even = odd). 3 × 4 = 12 (odd × even = even).",
        "These aren't accidents, and it's worth seeing exactly why, using letters to stand for 'any whole number, not a fixed one'. Any even number can be written as 2a for some whole number a, and any odd number as 2b+1 for some whole number b. Every letter used below, a, b, c, d and so on, works the same way: it just means 'some whole number', and a fresh letter is used whenever a fresh, possibly-different number is needed, since there's no reason to assume two different even numbers are secretly equal, for instance, so they get two different letters.",
        "Adding two evens, calling them 2a and 2c so they're allowed to be different numbers: 2a + 2c = 2(a+c), which is 2 × (a whole number, since a+c is a whole number whenever a and c both are), so it's even. Adding two odds, calling them 2b+1 and 2d+1:\n(2b+1) + (2d+1) =\n2(b+d) + 2 =\n2(b+d+1),\nagain even, since b+d+1 is a whole number. Adding an odd and an even: (2b+1) + 2a = 2(a+b) + 1, which is 2 × (a whole number) + 1, the exact definition of odd.",
        "The same approach handles multiplication. Odd × even: (2b+1) × 2a = 2 × [a(2b+1)], even, since there's a factor of 2 sitting outside. Odd × odd:\n(2b+1)(2d+1) =\n4bd + 2b + 2d + 1 =\n2(2bd+b+d) + 1,\nwhich is odd. Subtraction behaves exactly like addition for parity purposes too (odd − even = odd, odd − odd = even, and so on), since taking away a number has the same effect on parity as adding it back would.",
        "This lets you predict the parity of a long calculation without doing any of the actual arithmetic: just track odd/even through each operation in turn, applying multiplication before addition, exactly as the normal order of operations requires. The one real trap is doing the tracking in the wrong order, since otherwise you can easily flip the final result."
      ], "Prove that the square of an odd integer is odd.", "Let the odd integer be 2n + 1. Its square is (2n+1)² = 4n² + 4n + 1 = 2(2n² + 2n) + 1. This is of the form 2k + 1 for the whole number k = 2n² + 2n, so it is odd.", "Do not justify a parity rule with examples alone. The algebraic forms show why it holds for every integer."),
      teaching([
        "Build up the pattern for summing odd numbers rather than just being told it:\n1 = 1².\n1+3 =\n4 =\n2².\n1+3+5 =\n9 =\n3².\n1+3+5+7 =\n16 =\n4².\nEvery time, adding the next odd number lands exactly on the next perfect square.",
        "This pattern can be proved for any number of terms at all, not just the four checked above, using a letter to stand for 'which position in the list you've reached'. Let k stand for any whole number counting a position: k=1 means the 1st odd number, k=2 the 2nd, and so on. The odd numbers themselves follow a simple rule tied to their position: the 1st is 1 = 2(1)−1, the 2nd is 3 = 2(2)−1, the 3rd is 5 = 2(3)−1, doubling the position and subtracting 1 always gives that position's odd number. So in general, the kth odd number is (2k−1).",
        "Now suppose the sum of the first (k−1) odd numbers is already known to equal (k−1)², true for the small cases just checked, for instance with k−1=3: 1+3+5=9=3². The very next odd number in the list, the kth one, is (2k−1) as just shown. Adding it to that running total:\n(k−1)² + (2k−1) =\nk² − 2k + 1 + 2k − 1 =\nk².\nThe −2k and +2k cancel, and the +1 and −1 cancel, leaving exactly k². So no matter how far the list has already got, adding the next odd number always lands exactly on the next perfect square. Since this step works for every whole number k, repeating it from k=1 all the way up proves the sum of the first n odd numbers is always n², for any n.",
        "The even numbers have their own pattern, built the same way:\n2 =\n1×2.\n2+4 =\n6 =\n2×3.\n2+4+6 =\n12 =\n3×4.\nThe sum of the first n even numbers is always n(n+1). This also has a quick proof: the first n even numbers are just 2×1, 2×2, ..., 2×n, so their sum is 2×(1+2+...+n) = 2 × [n(n+1)/2] = n(n+1), using the standard result that 1+2+...+n = n(n+1)/2 (found by pairing the 1st term with the last, the 2nd with the second-last, and so on: every such pair adds up to n+1, and there are n/2 pairs).",
        "Both shortcuts turn a long addition into a single multiplication, which is exactly the point of spotting an invariant pattern: once you know the rule holds for every n, you never need to add term by term again.",
        "The easiest mistake to make is confusing n, how many terms you're adding, with the value of the LAST term. The nth odd number is (2n−1), not n itself: 'the first 10 odd numbers' means n=10, but the list actually runs up to 19 (= 2×10 − 1), not up to 10."
      ], "Find 1 + 3 + 5 + ... + 39 using the shortcut for odd numbers.", "The list runs up to the 20th odd number, since 2(20) − 1 = 39. Using the shortcut, sum of first n odd numbers = n²: 20² = 400.", "Do not confuse n, the number of terms being added, with the value of the last term. The nth odd number is (2n−1), not n itself."),
      teaching([
        "Try a concrete puzzle first. 5 coins all start heads-up. Each move flips exactly 2 coins of your choosing (heads become tails, tails become heads). Could all 5 coins ever end up tails-up? Look at what one move does to the total number of heads: flipping 2 heads turns them both to tails, so heads decreases by 2; flipping 2 tails turns them both to heads, so heads increases by 2; flipping 1 head and 1 tail swaps their roles, so heads stays the same. Every move changes the heads-count by −2, 0 or +2, always an even amount.",
        "That means the parity (odd or even) of the heads-count can never change, no matter how many moves are made or which coins are chosen. This kind of quantity, one whose parity survives every legal move unchanged, is called an invariant. It starts at 5, which is odd, so it stays odd forever. All-tails means 0 heads, which is even. Since odd can never become even by adding even amounts, this puzzle is impossible, and no amount of trying different move sequences will ever find a way, because the invariant rules it out completely.",
        "Not every useful quantity has to stay perfectly fixed to be useful. A monovariant is a quantity that changes in only one direction with every move, for example a total that strictly decreases each time. A monovariant cannot prove a target is unreachable the way an invariant does, but it does prove a process must eventually stop: if a non-negative whole number strictly decreases with every move, the process cannot continue forever, since it cannot go below 0.",
        "Invariants are not limited to parity. Colouring a chessboard black and white is a different flavour of the same idea: since a domino always covers one black square and one white square, the difference between the number of black and white squares left uncovered is itself an invariant under placing dominoes. More generally, a total taken modulo any fixed number, not just modulo 2, can stay fixed if every move changes it by a multiple of that number.",
        "This is the general technique: find some quantity that only ever changes by amounts that preserve a property, work out that property at the start, and compare it with what the target would require. If they don't match, no sequence of moves, however long, can bridge the gap. The reasoning is airtight because it doesn't depend on how many moves are made or in what order: each individual move preserves the property, so by repeating that fact move after move, the property at every future point is forced to match the property at the start.",
        "Matching parity is not the same as proving something possible. If the start and target properties agree, this particular invariant simply fails to rule the puzzle out; you would still need to actually find a working sequence of moves (or a different invariant) to be sure it can be done. Also double-check that every type of allowed move really does preserve the property being relied on, since missing one exceptional move can silently break the whole argument."
      ], "A display begins at 0. Each move adds either 4 or subtracts 2. Can it ever show 15?", "Both allowed changes are even, so the displayed number remains even after every move. Since 15 is odd, it cannot be reached.", "Do not search through long move sequences when every move visibly preserves a simpler property.")
    ]);

  lessons.logicAndDeduction = rewriteExistingLesson(lessons.logicAndDeduction,
    "Deduction extracts consequences that must follow from the clues. We will use consistent truth behaviour and the pigeonhole principle, two methods that replace guessing with a short argument covering every possibility.",
    [{ module: "junior", key: "truthLiars" }, { module: "junior", key: "pigeonhole" }], [
      teaching([
        "These puzzles build on the basic truth-teller-and-liar setup from the truth-tellers-and-liars prerequisite lesson (a truth-teller always says true things, a liar always says false things), extending it to several statements at once. They all rely on one core method: assumption-testing. Pick one of the possibilities the puzzle allows, say 'assume this person is a truth-teller', work out everything that possibility forces every statement to mean, and check whether those forced meanings clash with the possibility you started with. If they do clash, if the assumption ends up forcing something that contradicts itself, that's called a contradiction, and it proves that assumption cannot be the real situation. If nothing clashes, the assumption survives as a genuine possibility, at least until it's tested against any other statements in the puzzle.",
        "See the method in its purest form first. Suppose one person, Max, says: 'I am a liar.' Try assuming Max is a truth-teller: then his statement must be true, since truth-tellers only say true things, meaning Max is a liar, but that directly contradicts the assumption just made, that he's truthful. Now try the other possibility, that Max is a liar: then his statement must be false, since liars only say false things, meaning Max is not a liar, which contradicts the assumption that he's a liar. Both of the only two possibilities collapse into contradictions, which shows this particular statement could never actually be spoken by either a truth-teller or a liar: it's a paradox, not a puzzle with a real answer.",
        "In a solvable puzzle, unlike Max's paradox above, exactly one assumption about who is truthful will survive the check, and the other assumption will hit a genuine contradiction. The general procedure: assume one person is the truth-teller, work out what that forces every statement to mean, and see if everything stays consistent; then do exactly the same for the alternative assumption.",
        "For puzzles with several statements, work through the consequences of each assumption systematically, one statement at a time, rather than jumping to a conclusion. Write down what each person's statement would have to mean (true or false) under the assumption you're testing, then check that this matches what their type (truth-teller or liar) requires.",
        "The one habit to enforce every time: don't stop the moment one assumption looks consistent. Always finish checking the other assumption too, and confirm it genuinely leads to a contradiction, not just that it 'seems less likely'. A well-posed puzzle guarantees exactly one assumption survives; if you find that both seem to survive, that's a sign to re-read the statements rather than guess."
      ], "Dev says: 'Both of us are truth-tellers.' Exactly one of Dev and Ella always tells the truth. Who is the truth-teller?", "If Dev were the truth-teller, the statement 'both of us are truth-tellers' would have to be true, making Ella truthful too, but only one of them can be, a contradiction. So Dev lies, meaning 'both are truth-tellers' is genuinely false, which is consistent since Dev isn't truthful. Ella is the truth-teller.", "Do not assume that the person mentioned in a statement has the same truth value as the statement itself."),
      teaching([
        "Check a small case directly. Take 3 socks and only 2 colours available, say red and blue. Could all 3 socks have different colours from each other? There are only 2 colours to choose from, so with 3 socks, at least two of them are forced to share a colour: there simply aren't enough colours to go round without a repeat.",
        "Let N stand for the total number of items being placed, and k for the number of containers they're going into. That's the whole idea generalised: if N items are placed into k containers, and N is bigger than k, at least one container must hold more than one item. More precisely, at least one container is guaranteed to hold at least ⌈N/k⌉ items, where ⌈⌉ means 'round up to the next whole number'.",
        "To use it, imagine spreading the items as evenly as possible across the containers, since that's the best case for avoiding a big pile-up. If N doesn't divide evenly by k, the leftover items must go somewhere, forcing at least one container one item higher than the even split. Rounding N/k up to the next whole number captures exactly that forced leftover.",
        "The containers don't have to be physical objects like drawers or months. They can be more abstract categories such as the possible remainders when dividing by a fixed number, colours, or ranges of values, as long as every item genuinely falls into exactly one of them.",
        "Two things catch people out: rounding down instead of up (⌈4.1⌉ is 5, not 4), and forgetting that the principle only guarantees that some container is overloaded, not which one."
      ], "17 friends each bring one of 4 different snack types to a party. Show that at least 5 friends brought the same snack type.", "There are 4 snack types (boxes) and 17 friends (objects). N/k = 17/4 = 4.25, and rounding up gives ⌈17/4⌉ = 5, so at least one snack type must have been brought by at least 5 friends.", "Do not claim that exactly two share a category. The principle guarantees at least the rounded-up number, and there may be more.")
    ]);

  lessons.optimisationAndExtremal = rewriteExistingLesson(lessons.optimisationAndExtremal,
    "Optimisation asks for the greatest or least possible value while certain conditions remain fixed. We will begin with numerical patterns, explain why equality often creates an extremum and then turn practical restrictions into algebra before optimising.",
    ["algebraicManipulation", "quadratics", { module: "junior", key: "productOpt" }], [
      teaching([
        "Suppose two positive whole numbers must add up to 20. Try several different splits and compare their products side by side: 10+10=20, product 10×10=100. 9+11=20, product 9×11=99. 8+12=20, product 8×12=96. 5+15=20, product 5×15=75. 1+19=20, product 1×19=19. Every row adds to 20, but the products fall further and further away from 100 as the two numbers get further apart. The pattern is unmistakable: the closer together the two numbers are, the bigger the product.",
        "Here's why this always happens, using algebra instead of just a table of examples. Let d stand for 'how far each number has moved away from the equal split of 10': d=0 means both numbers are still exactly 10 and 10, d=1 means one number went up by 1 and the other down by 1 (giving 11 and 9), d=5 gives 15 and 5, and so on. Write the two numbers as 10+d and 10-d. Check first that this really does capture every split adding to 20, whatever d is chosen: (10+d) + (10-d) = 10 + d + 10 - d = 20, since the +d and -d cancel out completely, so this way of writing the two numbers is completely general, not a special case that happens to work.",
        "Now multiply the two numbers together, expanding the brackets term by term, the same bracket expansion covered in algebraic manipulation: (10+d)(10-d) = 10×10 - 10×d + d×10 - d×d = 100 - 10d + 10d - d² = 100 - d². The middle two terms, -10d and +10d, are opposites, so they cancel exactly, which is why only the two squared terms survive. Two matching brackets like this, with opposite signs, always collapse this way, leaving just a difference of two squares, the name for this exact pattern from the quadratics lesson.",
        "Since d² is zero when d=0 and gets bigger the further d moves from 0 in either direction (d² can never be negative, whether d itself is positive or negative), 100-d² is largest exactly when d=0, that is, when the two numbers are equal. This is the same shape of reasoning as in quadratics: subtracting a squared term that's always zero-or-positive can only ever shrink a number or leave it unchanged, never grow it, so the biggest possible result comes at the one point where that squared term is zero.",
        "So for a fixed sum, hunt for the split where the two numbers are equal, or as close to equal as the integers allow. Divide the total by 2: if that gives a whole number, that's your two equal parts. If it doesn't, round to the two whole numbers on either side of it. Watch out for two traps: the numbers must be positive (0 and 20 gives a product of 0, the worst possible split, even though it looks extreme), and if the question asks for integers, you cannot split an odd total into two equal integers, so you must use the two nearest whole numbers instead, for example 15 splits as 7 and 8, not 7.5 and 7.5."
      ], "Two positive integers add to 21. What's the greatest possible product?", "21÷2=10.5 isn't a whole number, so use the closest integers either side, 10 and 11: 10×11=110 (compare with 9×12=108, which is smaller, confirming 10 and 11 is best).", "Do not force equal halves when the required values must be integers and the sum is odd."),
      teaching([
        "A rectangle's perimeter is 2×(length+width). If the perimeter is fixed, then length+width is also fixed, since it's just half the perimeter, which means finding the maximum area is exactly the fixed-sum, maximise-the-product problem from Section 1, just with length and width playing the roles of the two numbers. Check this with a perimeter of 28, so length+width=14: 7+7=14, area 7×7=49. 6+8=14, area 6×8=48. 5+9=14, area 5×9=45. 3+11=14, area 3×11=33. 1+13=14, area 1×13=13. Exactly the same pattern as before: the closer the two sides are to equal, the bigger the area.",
        "This isn't a coincidence needing a separate proof, it's literally the same algebra as Section 1, with length+width (=14 here) playing the role of the fixed sum, and length and width playing the role of the two numbers. Using the same idea as Section 1's d, the distance each side has moved away from the equal split, now 7 either way, write length as 7+d and width as 7-d; these still add to 14 for any d, by the identical cancellation shown in Section 1. Expanding exactly as before: (7+d)(7-d) = 49 - 7d + 7d - d² = 49 - d². This is largest when d=0, that is, when length=width and the rectangle is a square, for the same reason as Section 1: d² can never be negative, so subtracting it can never increase the result.",
        "So for a fixed perimeter, halve it to get length+width, then split that as evenly as possible; a square, or the closest integer rectangle to a square, always wins.",
        "Don't halve the perimeter twice. The perimeter is 2(length+width), so length+width is half the perimeter, not a quarter. A common slip is dividing by 4, which would only be correct for finding a single side length of an actual square, not the length+width sum."
      ], "A rectangle has perimeter 46 cm. What integer side lengths give the maximum area?", "Half the perimeter is 46÷2=23, which is odd, so the closest integer split is 11 and 12 (11+12=23): 11×12=132, which beats 10×13=130.", "Do not confuse fixed perimeter with fixed area. Optimisation depends on which quantity is constrained."),
      teaching([
        "Every rule so far assumed all sides need building material, fencing, wall or perimeter. Real problems often break that assumption: for example, a rectangular pen built against an existing wall doesn't need fencing along the side that touches the wall. That changes the relationship between the fixed amount of material and the sides, so the make-it-a-square rule can no longer be assumed to still apply; it has to be checked from scratch.",
        "Label the side parallel to the wall (and opposite it) as the length, l, and the two sides running from the wall out to meet it as the width, w. Only 3 sides need fencing: two widths and one length, so the fencing formula is l+2w = (total fencing), not 2(l+w) = (total fencing) as it would be for a fully-fenced rectangle. Because w now appears twice in the formula but l only once, the equal-is-best rule from Sections 1 and 2, which relied on both sides mattering equally, no longer points to l=w.",
        "With one variable's formula changed, one safe approach is the table method used in Section 1: fix the total fencing, express l in terms of w, then compute the area for values of w close to a sensible middle guess and see which gives the biggest number. A second approach, shown in Example 4 below, treats the area as a quadratic function of one variable and finds its maximum directly from the turning point, exactly as in the quadratics prerequisite."
      ], "50m of fencing builds a rectangular pen against a wall (no fencing needed on the wall side). What width and length maximise the area?", "l+2w=50, so l=50-2w and area = (50-2w)w = 50w-2w². The peak of this quadratic is at w=12.5, which isn't a whole number, so test w=12 (area 26×12=312) and w=13 (area 24×13=312): both give the same maximum area of 312 m², since 12.5 is exactly halfway between them.", "Do not include the river side in the fencing equation. Model the physical constraint before optimising.")
    ]);

  lessons.proofTechniques = rewriteExistingLesson(lessons.proofTechniques,
    "Proof is disciplined explanation. This lesson focuses on the logic around a proof: why examples are limited, why a conclusion cannot be assumed inside its own argument, how existence differs from uniqueness and how a single counterexample defeats a universal claim.",
    ["algebraicProof"], [
      teaching([
        "Showing a claim works for n=5 proves nothing about n=6, or any other value.",
        "Here's how convincing, and wrong, a one-example proof can look. Suppose someone claims 'every prime number is odd', and checks it: 3 is odd and prime, 5 is odd and prime, 7 is odd and prime, three examples in a row, all fitting the pattern. It looks proven. But the claim is false, and the worked example below shows exactly where the one-example approach breaks down.",
        "A real proof needs an argument that covers every possible case at once, usually through algebra (see Algebraic Proof) or through a general logical argument that doesn't depend on which specific number you happen to have tried.",
        "The number of examples doesn't matter: checking 3, 30 or 300 cases and finding they all fit is still not a proof, since the very next untested case could be the exception. The only way to be sure is to argue about all cases in one go, or to test literally every case if there are only finitely many, and even then, you must genuinely check every single one, not just most of them."
      ], "A claim states 'every multiple of 6 is even', and someone 'proves' it by checking 6, 12, 18, 24, all even. Explain in one or two sentences why this checking process is not a valid general proof, even though the claim happens to be true.", "Checking four examples only tells you about those four multiples, not all infinitely many, even though this particular claim is true, checking specific cases can never rule out a future exception. A proper proof notes that any multiple of 6 can be written as 6k = 2×(3k), which is 2 times a whole number for every integer k, so it's even for every single case at once, not just the four tested.", "Do not use words such as 'clearly always' to bridge the gap from examples to a universal conclusion."),
      teaching([
        "A circular argument, the mistake this section is named after, secretly assumes the very thing it's trying to prove, somewhere in the middle of the proof.",
        "It always sounds plausible on a first read, which is exactly what makes it dangerous: the fault is usually hidden in the middle of a chain of steps that all sound reasonable on their own.",
        "To spot one, work through the argument step by step and ask, for every single step: does this step rely only on things already established (definitions, earlier proven facts, or the given information), or does it quietly lean on the very conclusion we're trying to reach? The moment a step needs the conclusion to already be true, the argument has gone circular.",
        "Circular arguments are especially easy to write by accident when a claim feels obviously true: it's tempting to use the claim itself as a stepping stone without noticing, because it doesn't feel like an assumption, it feels like common sense."
      ], "Spot the circular step: 'Every even number greater than 2 can be written as the sum of two primes, because every even number greater than 2 is a sum of two primes.'", "Circular: the second half of the sentence simply restates the claim itself as its own justification, rather than giving an independent reason. (This particular claim, Goldbach's Conjecture, is actually still unproven, which is exactly why no one is allowed to just assert it as a 'because'.)", "Do not mistake two equivalent statements for a proof from one to the other when neither has been established."),
      teaching([
        "Two different questions get mixed up more often than you'd think: 'does a solution exist?' (existence) and 'is this the only solution, or the best one?' (uniqueness). Existence asks whether at least one thing satisfying some condition can be found at all. Uniqueness asks whether there is exactly one such thing, or, when the condition is 'the biggest/best', whether exactly one arrangement reaches that top value, with nothing else tying or beating it.",
        "Finding one arrangement that gives a large value proves existence: it shows that value is achievable. It says nothing about uniqueness or maximality; whether that's the only good arrangement, or the best one, needs a separate, further argument.",
        "This is exactly the trap the optimisation examples avoided by checking neighbouring splits every time. Finding that one split of a fixed sum gives a big product only proves existence for that value; it says nothing about whether some other split does even better (or ties it), unless every other option has also been ruled out.",
        "So 'a solution exists' and 'this is the best, or the only, solution' are two separate claims, and both need proving separately. Existence needs just one example. Showing something is the maximum, or the unique best answer, needs either a check of every alternative, or a general argument (like the difference-of-squares argument in the optimisation lesson) that rules all of them out at once. Watch for the phrase 'I found a value that works, so it must be the best': finding a value only ever establishes existence."
      ], "A rectangle has perimeter 24. Someone says 'a 4 by 8 rectangle has area 32, so 32 must be the maximum area.' Is this reasoning valid? Find the actual maximum to check.", "No, checking one rectangle only shows 32 is achievable, not that it's the biggest. Half the perimeter is 24÷2=12, so the equal split 6 and 6 gives area 6×6=36, which beats 32. The maximum is 36, not 32.", "Do not write 'the solution' after finding one candidate unless every other possibility has been excluded."),
      teaching([
        "To disprove a claim that something is always true, you only need one counterexample: a single case where it fails.",
        "This is the mirror image of section 1's lesson: one example is never enough to prove a general claim, but one example is always enough to disprove one, because 'always true' is broken by even a single failure, however rare.",
        "This is much easier than proving something always holds, which needs a fully general argument covering every case; finding a counterexample only needs you to find one single failing case. The practical approach is to test small cases first, in order, since counterexamples to well-known nearly-true patterns often show up quickly, as the worked examples below demonstrate.",
        "A counterexample must satisfy every condition in the original claim. If the claim is about positive integers, your counterexample must be a positive integer too; finding a failure using a negative number or a fraction doesn't count."
      ], "Disprove the claim 'all odd numbers greater than 1 are prime' by finding the smallest counterexample.", "9. Check in order: 3 is prime, 5 is prime, 7 is prime, but 9 = 3×3, which is not prime since it has a factor other than 1 and itself. So 9 is the smallest counterexample.", "Do not offer a number that fails the hypothesis. A counterexample must enter the claim before it can break the conclusion.")
    ]);

  lessons.speedAndRelativeMotion = rewriteExistingLesson(lessons.speedAndRelativeMotion,
    "Motion problems become simpler when each rate is tied to a clear reference frame. We will build from distance = speed × time, then combine speeds for approaching and chasing before dealing carefully with average speed.",
    [{ module: "junior", key: "multiRate" }, "algebraicManipulation"], [
      teaching([
        "Speed = distance ÷ time. This one formula secretly contains three formulas, depending on which quantity is unknown, and confusing which rearrangement to use is one of the most common exam mistakes.",
        "Check this with real numbers first. A car travels 100 miles in 2 hours, so its speed is 100÷2=50mph. Now flip the question round: if you're told the car travels at 50mph for 2 hours, how far does it go? Common sense says distance = speed × time = 50×2 = 100 miles, which matches. And if you're told it travelled 100 miles at 50mph, how long did it take? Time = distance ÷ speed = 100÷50 = 2 hours, matches again. All three versions describe the exact same underlying relationship, just rearranged to solve for whichever quantity is missing.",
        "This works because speed×time=distance is just speed=distance÷time with both sides multiplied by time, the same kind of equation rearranging covered in algebraic manipulation: doing the same operation to both sides keeps the equation balanced, so rearranging like this never changes what it means, only which letter it's solved for.",
        "A quick way to keep all three straight: distance is always on its own (distance=speed×time, or speed=distance÷time, or time=distance÷speed); distance never gets divided by something else, it only gets divided into something else, or multiplied out. The most common slip is dividing the wrong way round, e.g. writing time=speed÷distance. If a rearrangement gives a 'time' that's smaller for a longer distance, or a 'speed' that increases as time increases, that's the signal something's flipped.",
        "One extra wrinkle appears whenever time comes out as a decimal number of hours, since the decimal part is not minutes directly: 0.75 hours is not '75 minutes' but 0.75 × 60 = 45 minutes, converted using the fact that there are 60 minutes in an hour."
      ], "A train travels at 80km/h for 3.5 hours. How far does it travel, and how long would it take to cover 200km at the same speed?", "Distance = speed × time = 80×3.5 = 280km. Time = distance ÷ speed = 200÷80 = 2.5 hours.", "Do not read 1.75 hours as 1 hour 75 minutes. Convert the decimal part using 60 minutes per hour."),
      teaching([
        "Picture two trains 300km apart, travelling toward each other, one at 60km/h and the other at 90km/h. In the first hour, the 60km/h train covers 60km toward the other, and the 90km/h train covers 90km toward the first. Together, the gap between them has shrunk by 60+90=150km in that one hour, even though neither train travelled 150km itself, because both trains' movement works to close the same gap.",
        "This works for any two speeds moving toward each other: in one hour, object A eats up a distance equal to A's speed worth of the gap, and object B eats up a distance equal to B's speed worth of the same gap, from the other end. Since both are shrinking the same single gap simultaneously, the total shrink per hour is simply their speeds added together; this combined value is called the closing speed.",
        "Once you have the closing speed, treat the whole problem as one object closing a single gap: time to meet = (starting distance) ÷ (sum of the two speeds). Don't average the two speeds; averaging would be the speed of a single object needing to cover the whole gap alone, not the combined rate at which two objects shrink the gap between them.",
        "One extra wrinkle: if one traveller starts later than the other, the gap has already shrunk (or not, since only one traveller is moving) during that head start. Work out the remaining gap at the moment the second traveller actually starts moving, then apply the ordinary closing-speed method to that reduced gap from that point onward."
      ], "Two cyclists start 120km apart and cycle toward each other. Cyclist A cycles at 20km/h and cyclist B at 30km/h, but cyclist B starts 1 hour after cyclist A. How long after cyclist A starts do they meet?", "In the first hour only A moves, covering 20km, reducing the gap to 120-20=100km by the time B starts. From then, closing speed = 20+30 = 50km/h, so the remaining gap closes in 100÷50 = 2 hours. Total time from A's start = 1 + 2 = 3 hours.", "Do not subtract speeds merely because the travellers face opposite directions. Both motions reduce the gap."),
      teaching([
        "Now picture a car at 70km/h chasing another car at 50km/h, both travelling the same direction, starting 40km apart. In one hour, the front car moves 50km further away along the road, and the chasing car moves 70km further along the same road. Since both distances are measured along the same direction, the gap between them shrinks by the difference: 70-50=20km in that hour, not by 70+50, since the front car is still moving away as it's being chased, so its own speed works against the chaser, not with it.",
        "This is the opposite situation to Section 2: there, both speeds worked together to shrink the gap, so they added. Here, one speed shrinks the gap (the chaser's) while the other speed tries to keep rebuilding it (the car in front pulling further away), so the net shrink per hour is the difference between the two speeds, called the relative speed.",
        "Time to catch up = (starting gap) ÷ (difference between the two speeds); always subtract the slower speed from the faster one, so the answer comes out positive. If the chasing object's speed isn't actually bigger than the one it's chasing, it will never catch up at all; always check that the chaser's speed exceeds the other's before doing the subtraction.",
        "One extra wrinkle: if the lead is given as a head start in TIME rather than distance (the chased object already moving for a while before the chase begins), convert that head start into a distance first, using the slower object's own speed, before applying the ordinary relative-speed method."
      ], "A runner at 12 km/h starts 30 minutes before a cyclist at 24 km/h. How long after the cyclist starts are they caught?", "The runner's head start: 12 km/h × 0.5 hours = 6km lead by the time the cyclist starts. From this point, relative speed = 24 - 12 = 12 km/h, so the 6km gap closes in 6 ÷ 12 = 0.5 hours, which is 30 minutes.", "Do not divide the lead by the faster speed. The slower traveller continues moving during the chase."),
      teaching([
        "Average speed is always total distance ÷ total time, never the average of the individual speeds, since more time is usually spent at the slower speed.",
        "Check this with real numbers. Suppose a journey is 120 miles total, split into two equal 60-mile halves: the first half driven at 30mph, the second at 60mph. Naive instinct says average the speeds: (30+60)÷2=45mph. But actually work out the time for each half: first half takes 60÷30 = 2 hours, second half takes 60÷60 = 1 hour, so the whole 120 miles takes 2+1 = 3 hours in total. True average speed = total distance÷total time = 120÷3 = 40mph, not 45mph.",
        "The naive average of the two speeds silently assumes equal time in each half, but here the equal-distance halves actually took different amounts of time (2 hours at the slow speed, only 1 hour at the fast speed); more of the total time was spent at the slower speed, which drags the true average down below the halfway point between 30 and 60.",
        "Whenever a journey is split into stages, work out the distance covered and time taken for each stage separately, add up both totals, then divide; never average the speeds directly unless you've separately confirmed equal time (not equal distance) was spent at each speed.",
        "One extra wrinkle: if the journey includes a stop, the time spent stopped still counts toward the total time even though no distance is covered during it, so it must be added into the total time before dividing."
      ], "A cyclist rides 40km at 20km/h, then a further 40km at 40km/h. Find her average speed for the whole 80km.", "Time for the first 40km = 40÷20 = 2 hours; time for the second 40km = 40÷40 = 1 hour; total time = 3 hours; average speed = 80÷3 ≈ 26.7km/h, closer to 20km/h since twice as long was spent at that slower speed.", "Do not average 30 and 60 to get 45. Work out the actual time spent at each speed first.")
    ]);

  lessons.estimationAndBounds = rewriteExistingLesson(lessons.estimationAndBounds,
    "Measurements and rounded values describe intervals, not exact points. Bounds keep calculations honest by carrying those possible intervals through a problem. Standard form then helps us estimate and compare quantities across very different scales.",
    [{ module: "primary", key: "roundingEstimate" }, { module: "junior", key: "estimation" }], [
      teaching([
        "A measurement rounded to the nearest whole number could really be anywhere within 0.5 either side. Rounded to the nearest 10, the true value is within 5 either side, and so on: half of whatever unit it was rounded to.",
        "Check why half a unit either side is exactly right, not just a rule of thumb. If a length rounds to 24cm to the nearest whole cm, then 24.4cm would also round to 24, since 24.4 is closer to 24 than to 25, but 24.6cm would round up to 25 instead. The rounding boundary sits exactly halfway between 24 and 25, at 24.5, so the largest value that still rounds down to 24 is anything up to (but not including) 24.5. The same logic going down means anything from 23.5 upward rounds to 24. That's why the true value can be anywhere from 23.5 up to just under 24.5: half a unit either side of the rounded value.",
        "The same idea applies to any rounding unit: rounding to the nearest 10 means the true value is within 5 either side (half of 10); rounding to the nearest 0.1 means within 0.05 either side (half of 0.1). Always take half of whatever unit the number was rounded to. Lower bound = rounded value minus half the unit. Upper bound = rounded value plus half the unit.",
        "The upper bound is technically not quite reachable, since 24.5cm would round up to 25, not down to 24, but at GCSE/JMC level it's standard to still write the upper bound as exactly 24.5, just be aware the true value is always strictly less than the upper bound, even though it can equal the lower bound. This can be written formally as an inequality, lower bound ≤ true value < upper bound, using ≤ at the reachable end and < at the unreachable end."
      ], "A journey distance is given as 60km, to the nearest 10km. Find the upper and lower bounds.", "Rounded to the nearest 10, half a unit = 5, so lower bound = 60-5 = 55, upper bound = 60+5 = 65.", "Do not include the upper bound for ordinary rounding intervals. That endpoint rounds to the next stated value."),
      teaching([
        "Let a and b stand for any two rounded measurements, each already given its own upper and lower bound the way section 1 describes. To find the maximum possible result of adding them, a+b, add their upper bounds. For the maximum of a subtraction, a−b, don't pair upper with upper; instead use the upper bound of a and the lower bound of b, since making b as small as possible makes the gap as large as possible.",
        "Check the addition rule with real numbers. Suppose a=24cm (bounds 23.5 to 24.5) and b=10cm to the nearest cm (bounds 9.5 to 10.5). The biggest possible value of a+b uses the biggest possible a and the biggest possible b at the same time: 24.5+10.5=35. Using anything smaller for either one can only make the total smaller, never bigger, so the true maximum of a+b is exactly (upper bound of a)+(upper bound of b).",
        "Subtraction behaves differently, because a bigger b makes a−b smaller, not bigger. To make a−b as large as possible, you want a as big as possible (upper bound of a) and b as small as possible (lower bound of b) at the same time: taking as much as possible while subtracting as little as possible gives the biggest possible gap. So maximum of (a−b) = (upper bound of a) − (lower bound of b). By the same logic, the smallest possible value of a−b uses the smallest possible a and the largest possible b.",
        "The same care is needed for multiplication and division. For a product of two positive quantities, the maximum uses the upper bound of both, exactly like addition, since making either one bigger makes the product bigger. For a quotient a÷b, though, the maximum uses the upper bound of a but the lower bound of b, exactly like subtraction, since making the denominator smaller makes the whole quotient bigger.",
        "It's tempting to always pair upper with upper, but that's only correct for addition and multiplication of positives. For subtraction and division, the maximum mixes the upper bound of one measurement with the lower bound of the other; work out which combination genuinely gives the biggest number before calculating, rather than pattern-matching."
      ], "x=80 (to the nearest 10) and y=12 (to the nearest 1). Find the minimum possible value of x−y.", "Minimum of x−y uses the smallest possible x (lower bound 75, since x is rounded to the nearest 10, half unit=5) and the largest possible y (upper bound 12.5, half unit=0.5): 75−12.5=62.5.", "For division, do not automatically use both upper bounds. A smaller positive denominator makes the quotient larger."),
      teaching([
        "Standard form writes any number as a × 10ⁿ, where a is a number with only one non-zero digit before the decimal point, so 1≤a<10 (call this the digit part), and n is a whole number, positive, negative, or zero, saying how many places the decimal point has shifted (call this the power part). Standard form makes very large or small numbers easy to estimate with: round each number to 1 significant figure first, then multiply the digit parts together and add the power parts together.",
        "Check why rounding each number separately before multiplying still gives a sensible estimate. 412×58 actually equals 23,896. Rounding each factor to 1 significant figure first, 412→400 and 58→60, then multiplying the digit parts, 400×60=24,000, is very close to the real answer, and vastly easier to calculate by hand or in your head.",
        "This works well with standard form because standard form splits a number into a digit part (between 1 and 10) and a power part (a power of 10), for example 400 = 4×10², 60=6×10¹. Multiplying two numbers in standard form means multiplying the digit parts together and adding the powers of ten: 4×6 = 24 (the digit parts), and 10²×10¹ = 10³ (the power parts), giving 24×10³ = 24,000, matching the estimate exactly.",
        "Rounding each number separately before multiplying is safe, but rounding the answer at the end to the same number of significant figures as the least-precise input is what makes the estimate meaningful; don't report an estimate to more significant figures than the original rounding actually supports. The same combining rule extends to a mix of multiplication and division in one expression: multiply or divide the digit parts in order, and add or subtract the powers of ten to match, then renormalise the final digit part back into the range 1 to 10 if it falls outside it."
      ], "Estimate 0.00089 × 5,200 by rounding to 1 significant figure first.", "Rounding: 0.00089→0.0009=9×10⁻⁴, 5200→5000=5×10³; multiply digit parts: 9×5 = 45, add powers: 10⁻⁴×10³ = 10⁻¹, giving 45×10⁻¹ = 4.5.", "Do not leave a standard-form coefficient outside the interval from 1 up to but not including 10.")
    ]);

  lessons.coordinateGeometry = rewriteExistingLesson(lessons.coordinateGeometry,
    "Coordinate geometry translates pictures into equations. Differences in coordinates describe movement, averages locate centres and gradients describe direction. Keeping the geometric meaning visible prevents the formulas from becoming disconnected rules.",
    [{ module: "junior", key: "coordGeom" }, "simultaneousEquations"], [
      teaching([
        "A point on a grid is written as a pair of coordinates (x, y): x tells you how far across from the origin, y tells you how far up. To talk about the gradient between two different points, it helps to give them labels so they don't get muddled up. Call the first point's coordinates x₁ and y₁ ('x-one' and 'y-one'), and the second point's coordinates x₂ and y₂ ('x-two' and 'y-two'). The little subscript numbers don't mean anything mathematically; they're just labels for 'first point' and 'second point', nothing more.",
        "The gradient measures steepness: how many units up (or down) the line goes for every unit you move across. It's found from 'change in y' divided by 'change in x'. The change in y is how far you moved vertically going from the first point to the second, which is y₂ − y₁. The change in x is how far you moved horizontally, x₂ − x₁. So gradient = (change in y) ÷ (change in x) = (y₂ − y₁) ÷ (x₂ − x₁).",
        "Try this on a concrete pair of points: (1, 2) and (4, 8). Label them so x₁=1, y₁=2, x₂=4, y₂=8. Change in y = y₂ − y₁ = 8 − 2 = 6. Change in x = x₂ − x₁ = 4 − 1 = 3. So the gradient = 6 ÷ 3 = 2: the line climbs 2 units up for every 1 unit across.",
        "It doesn't matter which point you call 'first' and which you call 'second', as long as you're consistent: swapping them flips the sign of both the change in y and the change in x, and those two minus signs cancel out, giving the exact same gradient either way."
      ], "Find the gradient through (0, 5) and (2, 1).", "−2, since change in y = 1 − 5 = −4, change in x = 2 − 0 = 2, and −4 ÷ 2 = −2.", "Do not call the gradient of a vertical line zero. Division by zero is undefined."),
      teaching([
        "The midpoint is the single point sitting exactly halfway between two other points, the same distance from each. You find it by averaging the two x-coordinates to get the midpoint's x, and separately averaging the two y-coordinates to get the midpoint's y: midpoint = ((x₁+x₂)/2, (y₁+y₂)/2).",
        "Check this makes sense on a simple case first: the midpoint of (2, 3) and (8, 7). Midpoint x = (2+8)/2 = 10/2 = 5. Midpoint y = (3+7)/2 = 10/2 = 5. So the midpoint is (5, 5): exactly halfway between x=2 and x=8, and exactly halfway between y=3 and y=7.",
        "Negative coordinates work exactly the same way; just be careful adding a negative number, since adding a negative is the same as subtracting."
      ], "Find the midpoint of (7, −2) and (−1, 10).", "(3, 4), since midpoint x = (7+(−1))/2 = 3 and midpoint y = (−2+10)/2 = 4.", "Do not average an x-coordinate with a y-coordinate. Each direction is handled independently."),
      teaching([
        "Every straight line (that isn't vertical) can be written in the form y = mx + c. Here m is the gradient, exactly the same idea as in section 1, how steep the line is, and c is the y-intercept: the y-value where the line crosses the vertical axis, which is the point where x=0.",
        "If you already know the gradient m and just one point (x, y) that lies on the line, you can find c: substitute the gradient and the point's coordinates into y = mx + c, and the only unknown left is c, so solve for it. For example, a line has gradient 3 and passes through (2, 11). Substitute m=3, x=2, y=11 into y = mx + c: 11 = 3×2 + c = 6 + c, so c = 11 − 6 = 5. The line's equation is y = 3x + 5.",
        "A vertical line is the one exception this form cannot describe. Every point on a vertical line shares the same x-coordinate, so its equation is simply x = (that fixed value), with no y or m involved at all; trying to compute its gradient would mean dividing by a change in x of zero, which is undefined."
      ], "A line has gradient 1/2 and passes through (4, 1). Find its equation.", "y = 0.5x − 1, since 1 = 0.5(4) + c gives 1 = 2 + c, so c = −1.", "Do not substitute a point and then leave x and y in the final equation. Their values are used only to determine the constant."),
      teaching([
        "Parallel lines point in exactly the same direction and never meet, however far they're extended. Since the gradient measures direction, two lines are parallel exactly when they have the same gradient.",
        "Perpendicular lines meet at a right angle (90°). Their gradients are always negative reciprocals of each other. A reciprocal means 'flip the fraction upside down' (the reciprocal of 2/3 is 3/2, and the reciprocal of a whole number n is 1/n, since n is really n/1). 'Negative reciprocal' means flip it and change its sign. The test that always works, and is worth using to check any pair of gradients directly: multiply the two gradients together, and if the lines are perpendicular, the answer is always exactly −1."
      ], "What gradient is perpendicular to a line with gradient −4?", "1/4, since −4 = −4/1, flipping gives −1/4, and negating that gives 1/4. Check: (−4) × (1/4) = −1.", "Do not merely change the sign of a gradient. Perpendicularity requires the reciprocal as well.")
    ]);

  lessons.similarShapesAndScaleFactors = rewriteExistingLesson(lessons.similarShapesAndScaleFactors,
    "Similar shapes have the same angles and the same proportions, though their sizes may differ. One length scale factor controls every corresponding length. Area and volume then respond with square and cube powers because they measure two and three dimensions.",
    [{ module: "primary", key: "ratioBasics" }, { module: "primary", key: "shapeProperties" }], [
      teaching([
        "When two shapes are similar, every side on one shape has a matching side on the other, in the same relative position going round the shape; these are called corresponding sides. The scale factor is the number you multiply every length on the original shape by, to get the matching length on the new shape. You find it by dividing a length on the new shape by the corresponding length on the original: scale factor = (new length) ÷ (matching original length).",
        "This uses ratio: comparing two quantities by dividing one by the other, the same idea used for comparing amounts in ratio basics; here the 'amounts' happen to be two lengths instead of two quantities of something.",
        "For example, if triangle A has a side of 4cm and the similar triangle B has the matching side at 10cm, the scale factor from A to B is 10 ÷ 4 = 2.5: every length on A gets multiplied by 2.5 to give the matching length on B. Going the other way, from B to A, would use the reciprocal instead (4 ÷ 10 = 0.4), since that direction shrinks rather than enlarges."
      ], "Shape A has a side of 6cm. The similar shape B has the matching side at 9cm. Find the scale factor from A to B.", "1.5, since 9 ÷ 6 = 1.5.", "Do not compare non-corresponding sides. The ratio is constant only for matched measurements."),
      teaching([
        "Area is always a length multiplied by a length (think of a rectangle: area = length × width). So if every length on a shape is multiplied by a scale factor k, the area gets multiplied by k twice over, once for each length involved, which means area scales by k².",
        "Check this on a simple square first. A square of side 2cm has area 2×2 = 4cm². Scale every length by k=3: the new side is 2×3 = 6cm, so the new area is 6×6 = 36cm². Compare the two areas: 36 ÷ 4 = 9, and 9 is exactly 3²: the area scale factor is the square of the length scale factor, exactly as claimed.",
        "So whenever a length scale factor k is given, the area scale factor is k², and you multiply the original area by k² to get the new area."
      ], "Two similar shapes have a length scale factor of 5. If the smaller has area 6cm², find the larger's area.", "150cm², since 5² = 25 and 6 × 25 = 150.", "Do not multiply area by the length factor only once. Area contains two scaled dimensions."),
      teaching([
        "Volume is a length multiplied by a length multiplied by a length (think of a box: volume = length × width × height). So scaling every length by k multiplies the volume by k three times over: volume scales by k³.",
        "Check this on a simple cube. A cube of side 1cm has volume 1×1×1 = 1cm³. Scale every length by k=2: the new side is 2cm, so the new volume is 2×2×2 = 8cm³. Compare: 8 ÷ 1 = 8, and 8 is exactly 2³: confirming volume scales by the cube of the length scale factor."
      ], "Two similar solids have a length scale factor of 4. The smaller has volume 2cm³. Find the larger's volume.", "128cm³, since 4³ = 64 and 2 × 64 = 128.", "Do not use k³ for surface area. The power matches the dimension of the measurement."),
      teaching([
        "Sometimes you're given an area ratio or a volume ratio and asked to find the length scale factor instead; this means undoing the squaring or cubing from the last two sections. The square root of a number is the value which, multiplied by itself, gives that number back (so undoing 'squared' means taking a square root). The cube root of a number is the value which, multiplied by itself three times, gives that number back (so undoing 'cubed' means taking a cube root).",
        "So: given an area ratio, take its square root to recover the length scale factor. Given a volume ratio, take its cube root. Once the length ratio has been recovered this way, it can be used just like any other length scale factor, including squaring it again to find a related area ratio, such as surface area, if that's what the question actually asks for."
      ], "Two similar shapes have areas 16cm² and 49cm². Find the scale factor of their lengths.", "7/4, since √(49/16) = 7/4 (7²=49, 4²=16).", "Do not take a square root of a volume ratio. Volume uses three dimensions, so use a cube root.")
    ]);

  lessons.circleTheoremsAndTangents = rewriteExistingLesson(lessons.circleTheoremsAndTangents,
    "Circle theorems are relationships forced by points sharing one circle. Each theorem has a precise diagram condition. The safest method is to identify the chord, diameter, centre or tangent involved before using any angle rule.",
    [{ module: "junior", key: "angleParallel" }, { module: "junior", key: "angleIso" }], [
      teaching([
        "A few words first, since they get used constantly in this lesson. The centre is the single point exactly in the middle of the circle. A radius is a straight line from the centre out to any point on the circle's edge; it's always the same length, wherever it's drawn. A diameter is a straight line that passes right through the centre, touching the circle on both sides; it's exactly twice the length of the radius. The circumference is the round boundary line of the circle itself; every point 'on the circle' means a point sitting on this boundary.",
        "Angles get named using three letters, like 'angle BAC'. The middle letter always names the corner (vertex) where the angle is actually measured, so 'angle BAC' means the angle sitting at corner A, opening out towards B on one side and C on the other.",
        "The theorem: take any triangle where one side is a diameter of the circle, and the third corner sits anywhere else on the circle's circumference. That triangle is always guaranteed to have a right angle (90°) exactly at that third corner, whichever point on the circle it happens to be."
      ], "AB is a diameter and C lies on the circle. If angle CAB is 34°, find angle CBA.", "Angle ACB is 90° (angle in a semicircle). Triangle angles total 180°, so angle CBA = 180° - 90° - 34° = 56°.", "Do not place the 90° angle at the centre or at an endpoint of the diameter. It is at the circumference opposite the diameter."),
      teaching([
        "An arc is just a section of the circle's circumference lying between two points on the circle. Suppose P and Q are two points on the circle, marking the ends of an arc. From a third point, you can draw lines to P and Q and measure the angle they make; this is called the angle 'standing on' (or subtended by) that arc. The third point could be the centre O, giving angle POQ, or it could be some other point R on the circumference, giving angle PRQ; both are standing on the same arc PQ, just measured from different places.",
        "The theorem: whenever a centre-angle and a circumference-angle are both standing on the same arc, the centre-angle is always exactly double the circumference-angle.",
        "One extra wrinkle: if the circumference point sits on the minor (shorter) arc rather than the major one, it actually looks across the major arc, so it pairs with the reflex angle at the centre (the one bigger than 180°) rather than the ordinary angle. Example 4 below works through this case."
      ], "The angle at the circumference of a circle standing on arc PQ is 47°. Find the angle at the centre standing on the same arc.", "The centre angle is always double the circumference angle: 2 × 47 = 94°.", "Do not double an angle merely because one vertex is at the centre. Confirm both angles use the same two chord endpoints."),
      teaching([
        "A chord is a straight line joining any two points on the circle; unlike a diameter, it doesn't have to pass through the centre. Drawing a chord splits the inside of the circle into two regions, and each region is called a segment (usually one bigger 'major' segment and one smaller 'minor' segment).",
        "'Angles in the same segment' means this: take a chord PQ, then pick two more points that both lie in the same one of the two segments, and from each of them draw lines to P and Q. The angle formed at each of those points is always equal to the angle formed at the other one; they don't need the centre at all, just both points sitting on the same side of the chord.",
        "This theorem often shows up alongside other angle facts in the same diagram, such as the isosceles triangle facts from the prerequisite lesson; the same-segment theorem only ever tells you about the angles it directly names, so any other angle in the diagram still needs its own separate reasoning. Example 4 below combines both."
      ], "PQ is a chord of a circle. R and S are two points in the same segment. Angle PRQ = 63°. Find angle PSQ.", "63°, since angles in the same segment are always equal.", "Do not rely on the angles looking alike. Name the common chord and check the vertices lie in the same segment.", "intermediate-circle-theorem"),
      teaching([
        "A quadrilateral is just a four-sided shape. It's called cyclic when all four of its corners lie exactly on a single circle. Labelling the corners P, Q, R, S in order round the shape, 'opposite angles' means pairs of corners that don't share a side: angle P is opposite angle R, and angle Q is opposite angle S.",
        "The theorem: in any cyclic quadrilateral, each pair of opposite angles always adds up to 180° (they're supplementary). This also works as a reverse test: if a quadrilateral's opposite angles genuinely do sum to 180° for both pairs, its four vertices could indeed all lie on one circle; if even one pair fails to sum to 180°, they cannot."
      ], "A cyclic quadrilateral has angles 3x + 10° and 5x - 6° opposite each other. Find x.", "Opposite angles sum to 180°: 3x + 10 + 5x - 6 = 180. Thus 8x = 176 and x = 22.", "Do not set adjacent angles to total 180° unless another property, such as parallel lines, justifies it."),
      teaching([
        "A tangent is a straight line that touches the circle at exactly one point, without crossing into its interior. The single point where it touches is called the point of contact.",
        "Fact 1: a tangent always meets the radius drawn to its point of contact at exactly 90°. Fact 2: if you pick a point outside the circle (an external point) and draw the two possible tangent lines from it to the circle, those two tangent lines are always exactly equal in length.",
        "Because fact 1 guarantees a right angle, any triangle built from a tangent, a radius, and the line joining the centre to an external point is right-angled, which means Pythagoras' theorem can be used directly to find a missing length in it. Fact 2 is also useful on its own, without any angle or Pythagoras calculation at all, whenever two tangent lengths are given as algebraic expressions that must be equal."
      ], "A circle has centre O and radius 3cm. From external point B, a tangent touches the circle at T, with BT = 4cm. Find OB.", "5cm, since angle OTB = 90° gives OB² = 3² + 4² = 9 + 16 = 25, so OB = √25 = 5.", "Do not say every tangent has the same length. Equality applies to the two tangents drawn from one common external point.")
    ]);

  lessons.trigonometryAdvanced = rewriteExistingLesson(lessons.trigonometryAdvanced,
    "Trigonometry connects the angles and side lengths of triangles. The formulas are useful, but choosing the right formula matters more than memorising symbols. Begin by deciding whether the triangle is right-angled, label the known information and identify exactly what the question asks you to find.",
    [{ module: "junior", key: "pythagQuest" }, { module: "junior", key: "angleIso" }, "algebraicManipulation"], [
      teaching([
        "In a right-angled triangle, once you pick one of the two non-right angles to focus on, the three sides get special names relative to that angle. The hypotenuse is the longest side, always the one opposite (directly across from) the right angle; it's easy to spot since it never touches the right angle. The opposite side is the side directly across from the angle you've chosen to focus on. The adjacent side is the side that touches your chosen angle but isn't the hypotenuse. (If you picked the other non-right angle instead, the opposite and adjacent sides would swap; which side is 'opposite' or 'adjacent' always depends on which angle you're using.)",
        "Sin, cos and tan are just names for three particular ratios (fractions) between these sides: sin(angle) = opposite ÷ hypotenuse, cos(angle) = adjacent ÷ hypotenuse, tan(angle) = opposite ÷ adjacent. SOHCAHTOA is simply a memory aid built from the first letters of those three lines (Sin-Opposite-Hypotenuse, Cos-Adjacent-Hypotenuse, Tan-Opposite-Adjacent); it isn't new maths, just a way to remember the three ratios above.",
        "Used forwards, if you know an angle and one side, rearrange the matching ratio to find another side. Used backwards, if you know two sides, you can find the angle: for instance if tan(angle) = 0.75, 'undo' the tan using the inverse tan function on a calculator, written tan⁻¹, so angle = tan⁻¹(0.75). The same idea works with sin⁻¹ and cos⁻¹."
      ], "A right-angled triangle has an adjacent side of 12cm and an angle of 25° next to it. Find the hypotenuse.", "≈13.2cm, since cos(25°) = adjacent ÷ hypotenuse, so hypotenuse = 12 ÷ cos(25°) = 12 ÷ 0.906 ≈ 13.2cm.", "Do not label sides from the triangle's appearance. Opposite and adjacent depend on the chosen angle.", "intermediate-trig-triangle"),
      teaching([
        "For any triangle (not just right-angled ones), label its three corners A, B and C. Then label each side with the lowercase version of the letter at the corner opposite it: side a is opposite angle A, side b is opposite angle B, and side c is opposite angle C. This labelling convention is what makes the sine rule readable; without it, 'a' and 'A' would look unrelated instead of being a matching pair.",
        "The sine rule says the ratio (side) ÷ sin(its opposite angle) comes out the same no matter which of the three pairs you pick, a strikingly similar idea to the constant scale factor between similar shapes covered earlier: there, one constant ratio linked every pair of matching lengths; here, one constant ratio links every side to the sine of its opposite angle, within a single triangle.",
        "Use the sine rule when you know a side and its opposite angle, plus one more side or angle to complete the picture."
      ], "In triangle ABC, angle A = 50°, a = 9cm, angle B = 70°. Find side b.", "≈11.0cm, since b = a × sin B ÷ sin A = 9 × sin(70°) ÷ sin(50°) ≈ 9 × 0.940 ÷ 0.766 ≈ 11.0cm.", "Do not pair a side with an angle beside it. Each side must be matched with the angle directly opposite."),
      teaching([
        "This uses the same side-labelling convention as the sine rule (side a opposite angle A, and so on). When two sides and the angle sandwiched between them are known, that middle angle is called the included angle; it's the angle you need for this formula.",
        "There's a link back to Pythagoras' theorem here: if angle A happens to be exactly 90°, then cos(90°) = 0, so the last term vanishes and the formula becomes a² = b² + c², exactly Pythagoras' theorem. The cosine rule is really Pythagoras' theorem extended to work for any angle, not just a right angle.",
        "Use the cosine rule to find a missing side when you know two sides and the included angle between them, as in the formula above. To find a missing angle instead, when all three sides are known, rearrange the formula to make cos A the subject: cos A = (b² + c² − a²) ÷ (2bc), then undo the cos with cos⁻¹."
      ], "Two sides of a triangle are 4cm and 5cm, with an included angle of 70°. Find the third side.", "≈5.2cm, since a² = 4² + 5² − 2(4)(5)cos(70°) = 16 + 25 − 40×0.342 ≈ 27.3, so a ≈ √27.3 ≈ 5.2cm.", "Do not use the sine rule when no complete opposite side-angle pair is known. The cosine rule is designed for this information."),
      teaching([
        "This formula finds a triangle's area directly from two sides and their included angle (the angle sandwiched between them, same meaning as in the cosine rule); no height measurement needed.",
        "One thing worth noticing: sin stays positive for every angle between 0° and 180°, including obtuse angles (bigger than 90°), so this formula keeps giving a sensible positive area even when the included angle is obtuse."
      ], "A triangle has two sides of 5cm and 6cm with an included angle of 60°. Find its area.", "≈13.0cm², since area = ½ × 5 × 6 × sin(60°) = 15 × 0.866 ≈ 13.0cm².", "Do not use an angle that is not between the two chosen sides. The formula requires the included angle.")
    ]);

  lessons.threeDGeometryAndNets = rewriteExistingLesson(lessons.threeDGeometryAndNets,
    "Three-dimensional geometry asks us to reason about objects that have length, width and height. A careful sketch or net turns a solid into familiar two-dimensional shapes. Before calculating, decide whether the question asks for covering on the outside, space inside or the way faces join together.",
    [{ module: "primary", key: "areaPerimeter" }, { module: "primary", key: "unitConversion" }, { module: "junior", key: "cubeProps" }], [
      teaching([
        "A solid's surface area is the total area of its outside surface, every face, added up. The net is exactly this surface unfolded flat, so surface area is simply the area of the whole net: add up the area of each flat face shown in it.",
        "Picture a cube's net: six identical squares arranged so that folding along their shared edges closes them up into a cube with no gaps and no overlaps (one common arrangement is a strip of four squares in a row, with one more square attached above one of them and one more below one of them; folding the strip round into a tube gives four side faces, and folding the extra two flat gives the top and the bottom).",
        "A cuboid has three edge lengths meeting at each corner, usually called its length (l), width (w) and height (h); which edge gets which name doesn't matter, as long as it's used consistently from here on. A cuboid's net is six rectangles, but they come in three matching pairs, because opposite faces of a cuboid are always identical rectangles: two faces measuring l×w, two measuring l×h, and two measuring w×h.",
        "Adding up all six faces: Surface area = 2×(l×w + l×h + w×h). The '2×' is there because each of the three different rectangle sizes appears exactly twice, once on each of two opposite faces.",
        "Check this on a cuboid measuring 4cm×3cm×2cm, so l=4, w=3, h=2: l×w = 4×3 = 12, l×h = 4×2 = 8, w×h = 3×2 = 6. Adding these three and doubling: Surface area = 2×(12+8+6) = 2×26 = 52cm²."
      ], "Find the surface area of a cube with side length 7cm (a cube is just a cuboid where l=w=h).", "294cm². A cube has 6 identical square faces, each 7×7=49cm², so surface area = 6×49 = 294cm² (the same formula as a cuboid, just with l=w=h=7, so all three pair-areas equal 49).", "Do not calculate the volume when the question asks how much material covers the outside."),
      teaching([
        "A prism is a 3D solid with the same flat shape, called its cross-section, repeated all the way through, like a stack of identical slices glued together. The cross-section is whatever shape you'd see if you sliced straight across the prism, perpendicular to its length.",
        "Volume of a prism = cross-sectional area × length, where 'length' means the distance the cross-section extends through the solid (sometimes called its depth, depending on which way it's sitting). This works because the prism is literally that cross-sectional area, stacked up 'length' times over, the same idea as stacking identical sheets of paper to build a block.",
        "A cube is a special case of a prism: its cross-section is a square, and its 'length' equals its side too, which is exactly why a cube's volume formula (side×side×side) is just this same prism rule in disguise."
      ], "A prism has a cross-sectional area of 20cm² and length 7cm. Find its volume.", "140cm³, since volume = cross-sectional area × length = 20 × 7 = 140cm³.", "Do not use the sloping side as the perpendicular height of a triangular cross-section unless it truly meets the base at 90°."),
      teaching([
        "A cylinder is a prism whose cross-section is a circle, so the same rule applies: Volume = cross-sectional area × length. For a cylinder the 'length' runs up its axis and is usually called its height, h, and the cross-section is a circle of radius r (the distance from the centre of the circle out to its edge).",
        "The area of a circle is π×r², where π (pronounced 'pi') is a fixed number, roughly 3.14159..., equal to a circle's circumference divided by its diameter; it turns up whenever a circle's measurements are involved. For estimating by hand, π ≈ 3.14 is close enough.",
        "Putting the circle's area into the prism rule: Volume = cross-sectional area × height = (π×r²) × h = πr²h.",
        "Two extra wrinkles are worth knowing. First, a question might give the diameter rather than the radius; always halve it before substituting, since using the diameter directly in place of r would make the area four times too large once squared. Second, an answer can be left as an exact multiple of π (such as 350π cm³) rather than rounded to a decimal, whenever the question asks for an exact value."
      ], "Find the volume of a cylinder with radius 4cm and height 9cm (use π ≈ 3.14).", "≈452cm³. Cross-sectional area = π×4² ≈ 3.14×16 = 50.24cm², so volume ≈ 50.24×9 = 452.16, rounding to 452cm³.", "Do not substitute the diameter for r. Doing so makes the circular area four times too large."),
      teaching([
        "Checking a net has two parts. First, count: does it have the right number of faces, of the right shapes, for the solid? A cube needs exactly 6 squares. A triangular prism needs 2 triangles (the two ends) plus 3 rectangles (the sides). A square-based pyramid needs 1 square plus 4 triangles.",
        "Second, fold it mentally (or on paper): the right number of the right shapes isn't enough on its own; they also have to fold up edge-to-edge with no gaps and no overlaps. Two different arrangements of the same six squares can give one net that folds perfectly into a cube and another that leaves two squares landing on top of each other.",
        "For example, a strip of 4 squares in a row, with 1 more square attached above any one of the 4 and another attached below any one of the 4, always folds into a valid cube: the strip of 4 wraps round into a tube (the four side faces), and the extra two fold flat to become the top and the bottom, wherever along the strip they were attached. This is exactly the kind of check practised with shape-folding earlier."
      ], "A net has 2 triangles and 3 rectangles, correctly shaped and sized to match. Which solid could this be the net of?", "A triangular prism: it needs exactly 2 triangular end faces plus 3 rectangular side faces, which matches this net's face count and shapes exactly.", "Do not decide from the number of squares alone. Their arrangement determines whether the solid closes correctly.")
    ]);

  lessons.multiStepGeometryProof = rewriteExistingLesson(lessons.multiStepGeometryProof,
    "A long geometry problem is usually a chain of short familiar facts. The challenge is seeing which fact can be used first and recording enough reasons that another reader can follow the chain. Work from what the diagram definitely gives you, not from what you hope the final answer will be.",
    ["circleTheoremsAndTangents", "trigonometryAdvanced", "algebraicProof"], [
      teaching([
        "Complex diagrams are almost always several simple shapes overlapping or sharing a side: a triangle sharing a side with a parallelogram, or an isosceles triangle formed by two radii of a circle. Before touching any angles, trace each individual shape's outline on its own.",
        "A reminder of what 'isosceles' means: a triangle with (at least) two sides the same length. Whenever two sides in a diagram are equal, very often because they're both radii of the same circle, since every radius of a circle is the same length, the triangle they form is isosceles, and its two base angles (the angles opposite the two equal sides) are automatically equal too.",
        "Naming the shapes you find matters, because each shape brings its own rule with it: a triangle brings 'angles sum to 180°', a parallelogram brings 'opposite angles are equal' and 'co-interior angles between the parallel sides sum to 180°', and a circle brings the circle theorems, such as the fact that a tangent is always perpendicular to the radius drawn to the point where it touches the circle."
      ], "A diagram shows kite ABCD with AB=AD and CB=CD, and diagonal AC drawn in. What shapes can you see, and what property does the diagonal give you?", "The diagonal AC splits the kite into two triangles, ABC and ADC. Since AB=AD and CB=CD with AC shared by both triangles, the two triangles are congruent (SSS), so angle BAC = angle DAC: the diagonal AC bisects angle A.", "Do not assume a diagram is drawn accurately. A line that looks parallel or equal needs a mark or a statement."),
      teaching([
        "Start at the angle or length you already know, and ask 'what does this fact force?', rather than staring at the target angle hoping for inspiration. Each individual step should be a single, simple rule: base angles of an isosceles triangle are equal, angles on a straight line sum to 180°, angles round a point sum to 360°, angles in a triangle sum to 180°, or a circle theorem.",
        "Two rules used repeatedly below: the isosceles triangle base angle theorem (the two angles opposite a triangle's two equal sides are equal), and angles on a straight line (angles on one side of a straight line, meeting at a single point, always add up to 180°). Not every question needs every rule in the chain; some, like example 4 below, reach the answer in a single step because the given angle already matches what's needed."
      ], "Triangle PQR is isosceles with PQ = PR and angle QPR = 50°. QR is extended to a point S. Find angle PRS.", "115°. Base angles: angle PQR = angle PRQ = (180−50)÷2 = 65°. Angle PRS and angle PRQ lie on the straight line QS, so angle PRS = 180 − 65 = 115°.", "Do not begin by writing the target result as though it were known. Every line must follow from an established fact."),
      teaching([
        "Write each newly-found angle directly onto (or next to) the diagram immediately, as soon as you find it. A chain of four or five steps is easy to lose track of otherwise, and a diagram with every known angle labelled lets you spot the next available step at a glance, rather than re-deriving something you already worked out.",
        "One more rule appears below: the angles inside any quadrilateral (a four-sided shape) always sum to 360°, the quadrilateral angle sum theorem. It follows from the triangle angle sum theorem, since any quadrilateral can be split into two triangles by one diagonal (exactly as in section 1's example), each contributing 180°. The labelling habit works just as well running backwards from a known exterior angle to an unknown interior one, as example 4 below shows."
      ], "Triangle DEF has angle D = 48° and angle E = 2 × angle D. Find angle F.", "36°. Angle E = 2×48 = 96°. The triangle's angles sum to 180°, so angle F = 180 − 48 − 96 = 36°.", "Do not write 'obvious from the diagram'. State the angle rule or shape property that makes the step true."),
      teaching([
        "Angles in a triangle should sum to 180°, angles on a straight line to 180°, and angles round a point to 360° (or a quadrilateral's angles to 360°, as in section 3). If a completed chain of reasoning leads to a total that breaks one of these known facts, a step was mis-applied somewhere along the chain, so go back and check each link.",
        "The same check works even when the angles themselves come from solving an algebraic equation rather than being given as plain numbers: substitute the solved value back into every expression, and confirm the resulting angles are all positive and genuinely sum to the correct total, exactly as with numeric angles."
      ], "Two angles on a straight line are calculated as 115° and 60°. Use the angle sum check to decide if this is possible.", "Not possible - 115 + 60 = 175°, not 180°, so the two angles are inconsistent with lying on a straight line; at least one needs to be re-checked.", "Do not treat checking as optional decoration. It is how you catch a plausible-looking mistake before accepting it.")
    ]);

  lessons.statisticsAdvanced = rewriteExistingLesson(lessons.statisticsAdvanced,
    "Statistical diagrams compress a large set of data into a picture. To read them well, first ask what each axis, boundary and area represents. A graph is not merely a shape: every position has a precise meaning connected to frequency, spread or proportion.",
    [{ module: "primary", key: "ratioBasics" }, { module: "junior", key: "meanPuzzle" }, "ratioProportionAlgebraic"], [
      teaching([
        "Suppose 11 students' test scores, already sorted from smallest to largest, are: 4, 7, 9, 12, 14, 15, 18, 20, 23, 25, 30. The median is the middle value once the data is sorted like this. With 11 values, the middle one sits at position (11+1)÷2 = 6, so counting in six places: the median is 15.",
        "The lower quartile (written Q1) is the median of just the lower half of the data, the values below the overall median. Here the lower half is 4, 7, 9, 12, 14 (5 values), whose middle value is 9. So Q1 = 9. The upper quartile (Q3) is the median of just the upper half, here 18, 20, 23, 25, 30 (5 values), whose middle value is 23. So Q3 = 23.",
        "(If a half itself contains an even number of values, its quartile is the mean of the two middle values of that half, the same rule used for finding the median of any even-sized list.)",
        "The interquartile range (IQR) is Q3 − Q1, the width of the middle 50% of the data: IQR = 23 − 9 = 14. A box plot draws a box from Q1 to Q3 (with a line inside it at the median), and then a thin line called a whisker stretching out from each end of the box to the minimum and the maximum. So for this dataset, the box runs from 9 to 23 with a line at 15, and whiskers reach out to the minimum (4) and maximum (30)."
      ], "9 sorted values are: 2, 5, 6, 9, 11, 13, 15, 18, 20. Find Q1, Q3 and the interquartile range.", "Q1 = 5.5, Q3 = 16.5, IQR = 11. The median (5th value) is 11. The lower half is 2, 5, 6, 9 (4 values, even), so Q1 is the mean of its two middle values: (5+6)÷2 = 5.5. The upper half is 13, 15, 18, 20, so Q3 = (15+18)÷2 = 16.5. IQR = 16.5 − 5.5 = 11.", "Do not use maximum minus minimum for the interquartile range. That calculation gives the full range."),
      teaching([
        "Cumulative frequency just means a running total: keep adding each new class's frequency onto the total of everything before it. For example, suppose 80 students' exam scores are grouped like this: 0-20: frequency 10, 20-40: frequency 20, 40-60: frequency 30, 60-80: frequency 15, 80-100: frequency 5. Running that total: after the first class, 10; after the second, 10 + 20 = 30; after the third, 30 + 30 = 60; after the fourth, 60 + 15 = 75; after the fifth, 75 + 5 = 80, which correctly reaches the full total of 80 students by the end, as it always must.",
        "A cumulative frequency graph plots these running totals against the upper boundary of each class, and is always increasing (or flat); it can never go down, since a running total never shrinks.",
        "Reading up from a chosen cumulative frequency value to the plotted curve, then across and down to the horizontal axis, gives the data value below which that many items lie. The median sits at half the total frequency; the lower quartile Q1 sits at a quarter (¼) of the total; the upper quartile Q3 sits at three-quarters (¾) of the total. With the 80-student example above, the median is read off at cumulative frequency 80 ÷ 2 = 40."
      ], "A cumulative frequency graph has a total frequency of 200. At what cumulative frequency values do you read off the median and Q3?", "Median at 200 ÷ 2 = 100; Q3 at 3 × 200 ÷ 4 = 150.", "Do not read quartiles at 25, 50 and 75 on the frequency axis unless the total frequency is 100."),
      teaching([
        "A histogram is a bar chart for grouped, continuous data. When every class has the same width, plotting frequency as the bar height works fine. But when class widths are unequal, plotting raw frequency as height is misleading; a wide class can pile up a big frequency just because it's wide, not because the data is densely packed there.",
        "The fix is to plot frequency density instead, defined as: frequency density = frequency ÷ class width. This keeps the bar's area (not its height) proportional to the number of data points, however wide or narrow the class is, since area = height × width = frequency density × class width = frequency, exactly recovering the count.",
        "For example, three classes with frequencies 20, 24 and 24 but widths 5, 10 and 6 respectively have frequency densities: 20 ÷ 5 = 4, 24 ÷ 10 = 2.4, 24 ÷ 6 = 4. Notice the first and third classes have the same frequency density (4) despite different frequencies (20 vs 24), that's because their widths differ too (5 vs 6), and density accounts for that."
      ], "A histogram bar has frequency density 5 over a class width of 8. Find the frequency it represents.", "40, since frequency = frequency density × class width = 5 × 8 = 40.", "Do not treat a histogram as an ordinary bar chart. Unequal class widths make height alone misleading."),
      teaching([
        "Rearranging the frequency density formula (frequency density = frequency ÷ class width) to make frequency the subject: frequency = frequency density × class width. This is exactly how you recover an actual count of data points from a histogram bar's height (its frequency density) and width (its class width), the reverse direction of section 3.",
        "When a question involves several bars at once, recover each bar's frequency separately first, then add or compare the recovered frequencies; never add or compare the frequency densities directly, since density alone doesn't account for how wide each class actually is."
      ], "A histogram bar has frequency density 2.5 and class width 20. Find the frequency it represents.", "50, since frequency = frequency density × class width = 2.5 × 20 = 50.", "Do not add the bar heights to find a total frequency. Add their areas.", "intermediate-histogram-area")
    ]);

  const attachStructureIds = (lessonKey, perSectionIds) => {
    const lessonDef = lessons[lessonKey];
    perSectionIds.forEach(([exampleIds, tryitId], si) => {
      const s = lessonDef.sections[si];
      s.examples.forEach((e, ei) => { e.structureId = exampleIds[ei]; });
      if (s.tryit) s.tryit.structureId = tryitId;
    });
  };

  attachStructureIds("numberTheoryDivisibility", [
    [["prime_or_composite", "full_prime_factorisation_index_notation", "full_prime_factorisation_index_notation", "full_prime_factorisation_index_notation"], "full_prime_factorisation_index_notation"],
    [["hcf_via_prime_factors", "hcf_via_prime_factors", "lcm_realworld", "hcf_realworld_share"], "lcm_via_hcf_formula"],
    [["mod_remainder", "mod_remainder", "last_digit_power_cycle", "last_digit_power_cycle"], "last_digit_power_cycle"],
  ]);

  attachStructureIds("algebraicManipulation", [
    [["expand_two_brackets_x_coeff", "expand_two_brackets_x_coeff", "expand_two_brackets_x_coeff", "expand_three_terms_simplify"], "expand_two_brackets_x_coeff"],
    [["factorise_simple_quadratic", "factorise_simple_quadratic", "factorise_quadratic_non_monic", "factorise_quadratic_non_monic"], "factorise_quadratic_non_monic"],
    [["diff_two_squares_factorise", "diff_two_squares_factorise", "diff_two_squares_factorise", "diff_two_squares_factorise"], "diff_two_squares_factorise"],
  ]);

  attachStructureIds("percentageAndCompoundGrowth", [
    [["s5_percent_decimal_fraction_conversion", "s2_percentage_change_multiplier", "s2_percentage_change_multiplier", "s7_successive_percentage_changes"], "s2_percentage_change_multiplier"],
    [["s2_percentage_change_multiplier", "s3_compound_interest_forward", "s4_compound_depreciation_forward", "s16_years_to_exceed_target"], "s4_compound_depreciation_forward"],
    [["s6_reverse_percentage_single", "s6_reverse_percentage_single", "s12_reverse_percentage_two_changes", "s12_reverse_percentage_two_changes"], "s6_reverse_percentage_single"],
  ]);

  attachStructureIds("simultaneousEquations", [
    [["add_directly", "sum_difference", "sum_difference", "multiply_both_eq"], "add_directly"],
    [["substitution_given", "substitution_given", "general_elim", "ticket_one_given"], "substitution_given"],
  ]);

  attachStructureIds("quadratics", [
    [["cts_find_q", "cts_full_vertex", "turning_point_x", "cts_full_vertex"], "cts_full_vertex"],
    [["factorise_both_roots", "factorise_both_roots", "quadratic_formula_surds", "area_word_problem"], "factorise_both_roots"],
    [["discriminant_num_solutions", "discriminant_num_solutions", "discriminant_range_k", "discriminant_range_k"], "discriminant_range_k"],
  ]);

  attachStructureIds("ratioProportionAlgebraic", [
    [["direct_proportion_find_y", "direct_proportion_find_y", "density_direct_proportion", "y_proportional_x_squared"], "y_proportional_x_cubed"],
    [["inverse_proportion_find_y", "inverse_proportion_find_y", "inverse_proportion_find_y", "y_inversely_proportional_x_squared"], "inverse_proportion_find_y"],
    [["identify_direct_proportion_table", "identify_inverse_proportion_table", "identify_proportion_type_table", "identify_proportion_type_table"], "y_proportional_x_cubed"],
  ]);

  const attachTryitIds = (lessonKey, tryitIds) => {
    const lessonDef = lessons[lessonKey];
    tryitIds.forEach((id, si) => {
      const s = lessonDef.sections[si];
      if (s.tryit) s.tryit.structureId = id;
    });
  };

  lessons.surdsAndIndices.sections[0].tryit.structureId = "simplify_surd";
  lessons.surdsAndIndices.sections[1].tryit.structureId = "rationalise_simple";
  lessons.surdsAndIndices.sections[2].tryit.structureId = "neg_frac_index_eval";

  attachTryitIds("sequencesAndSeries", ["linear_nth_substitute", "quadratic_second_difference", "geometric_nth_term"]);
  attachTryitIds("graphsAndRatesOfChange", ["gradient_two_points", "equation_from_gradient_point", "velocity_time_trapezium_area"]);
  attachTryitIds("surdicModularNumberTheory", ["terminating_decimal_identify", "rationalise_denominator_numeric", "modular_exponentiation_direct"]);
  attachTryitIds("algebraicProof", ["consecutive_odd_sum_mult4", "spot_the_error", "n_squared_minus_n_even"]);
  attachTryitIds("functionsAndIteration", ["composite_expression_quadratic", "inverse_linear", "fixed_point"]);
  attachTryitIds("diophantineEquations", ["d2_hcf_existence", "d3_count_nonneg_pairs", "d1_digit_puzzle"]);
  attachTryitIds("combinatoricsAndCounting", ["adjacent_pair_together", "combinations_must_include", "handshakes_nc2"]);
  attachTryitIds("advancedProbability", ["independent_and", "tree_multi_path_without_replacement", "at_least_one_non_identical"]);
  attachTryitIds("invariantsAndParity", ["invariant_preservation_multistep", "chessboard_tiling_parity", "parity_many_terms"]);
  attachTryitIds("logicAndDeduction", ["truth_teller_liar_2person", "pigeonhole_basic"]);
  attachTryitIds("optimisationAndExtremal", ["d1_max_product_fixed_sum", "d1_max_rect_area", "d4_max_area_pen_wall"]);
  attachTryitIds("proofTechniques", ["proof_by_example_flaw", "circular_reasoning_flaw", "existence_not_uniqueness_flaw", "smallest_counterexample_search"]);
  attachTryitIds("speedAndRelativeMotion", ["d1_time_from_ds", "d1_towards_meet_time", "d4_head_start", "d2_two_leg_avg_speed"]);
  attachTryitIds("estimationAndBounds", ["s19_error_interval_notation", "s18_max_speed_bounds_quotient", "s13_estimate_with_standard_form"]);
  attachTryitIds("coordinateGeometry", ["gradient_two_points", "midpoint_reverse", "equation_from_gradient_point", "perpendicular_gradient"]);
  attachTryitIds("similarShapesAndScaleFactors", ["length_scale_factor_find_side", "area_scale_factor", "volume_scale_factor", "find_length_scale_from_volume"]);
  attachTryitIds("circleTheoremsAndTangents", ["semicircle_rule", "centre_circumference_rule", "angles_same_segment", "cyclic_quadrilateral", "tangent_length_from_point"]);
  attachTryitIds("trigonometryAdvanced", ["sohcahtoa_find_side", "sine_rule_find_side", "cosine_rule_find_side", "area_half_ab_sinc"]);
  attachTryitIds("threeDGeometryAndNets", ["cuboid_surface_area", "prism_volume_cross_section", "cylinder_volume", "net_face_matching"]);
  attachTryitIds("multiStepGeometryProof", ["full_justified_chain", "three_step_angle_chase", "isosceles_exterior_forward", "angle_sum_sanity_check"]);
  attachTryitIds("statisticsAdvanced", ["boxplot_read_off", "cumulative_frequency_position", "frequency_density_basic", "histogram_missing_bar"]);
}
