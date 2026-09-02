const example = (q, steps, answer) => ({ q, steps, answer });

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
  sections: source.sections.map((oldSection, index) => ({
    ...oldSection,
    body: rewrites[index].body,
    tryit: rewrites[index].tryit,
    note: rewrites[index].note,
    ...(rewrites[index].visual ? { visual: rewrites[index].visual } : {})
  }))
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
          example("Is 7 a prime number?", ["List the positive factor pairs of 7.", "The only pair is 1 × 7.", "A prime number has exactly two positive factors: 1 and itself."], "Yes, 7 is prime."),
          example("Write 36 as a product of primes.", ["Divide by 2: 36 = 2 × 18.", "Divide 18 by 2: 18 = 2 × 9.", "Factorise 9 as 3 × 3.", "Collect the prime factors and use indices."], "36 = 2² × 3²."),
          example("Write 180 as a product of primes.", ["Divide by 2 twice: 180 = 2 × 2 × 45.", "Divide 45 by 3 twice: 45 = 3 × 3 × 5.", "The remaining 5 is prime.", "Multiply back to check: 4 × 9 × 5 = 180."], "180 = 2² × 3² × 5."),
          example("A student writes 420 = 2² × 3 × 5 and stops. Find and correct the error.", ["Multiply the stated factors: 2² × 3 × 5 = 60, so the product is too small.", "Continue factorising 420: 420 ÷ 4 = 105.", "Then 105 = 3 × 5 × 7.", "The missing prime factor is 7."], "420 = 2² × 3 × 5 × 7.")
        ],
        { q: "Write 756 as a product of primes and check your answer by multiplying back.", answer: "756 = 2² × 3³ × 7. Checking: 4 × 27 × 7 = 108 × 7 = 756." },
        { note: "A common mistake is to stop when the quotient is odd. Odd does not mean prime. If 2 no longer divides, continue with 3, then 5, then 7." }
      ),
      section(
        "2. Highest common factors and lowest common multiples",
        [
          "Suppose two ribbons are 24 cm and 36 cm long. We want to cut both into equal pieces with no ribbon left over, using the longest possible piece. The piece length must be a factor of both numbers. Because we want the greatest possible length, we need the highest common factor, usually shortened to HCF.",
          "Now imagine two lights that flash every 24 seconds and every 36 seconds. We want to know when they will next flash together. The waiting time must be a multiple of both 24 and 36. Because we want the first such time, we need the lowest common multiple, usually shortened to LCM.",
          "Prime factorisation makes both questions systematic. Write 24 = 2³ × 3 and 36 = 2² × 3². For the HCF, use only prime factors shared by both numbers and take the lower power of each. This gives 2² × 3 = 12.",
          "For the LCM, include every prime needed to build either number and take the higher power of each. This gives 2³ × 3² = 72. The higher powers ensure that both original numbers divide into the result exactly.",
          "Keep the meanings in view instead of memorising ‘lower’ and ‘higher’ without context. An HCF must fit inside both numbers, so it cannot demand more copies of a prime than either number contains. An LCM must contain both numbers, so it needs enough copies of every prime required by either one."
        ],
        [
          example("Find the HCF of 12 and 18 by listing factors.", ["Factors of 12 are 1, 2, 3, 4, 6 and 12.", "Factors of 18 are 1, 2, 3, 6, 9 and 18.", "The greatest number in both lists is 6."], "HCF = 6."),
          example("Find the HCF and LCM of 12 and 18 using prime factors.", ["Write 12 = 2² × 3 and 18 = 2 × 3².", "For the HCF, take 2¹ and 3¹: 2 × 3 = 6.", "For the LCM, take 2² and 3²: 4 × 9 = 36."], "HCF = 6 and LCM = 36."),
          example("Two bells ring every 45 seconds and every 60 seconds. If they ring together now, when will they next ring together?", ["The next shared time must be a common multiple, so find the LCM.", "Write 45 = 3² × 5 and 60 = 2² × 3 × 5.", "Take the higher power of every prime: 2² × 3² × 5.", "Calculate 4 × 9 × 5."], "They next ring together after 180 seconds, which is 3 minutes."),
          example("Find the greatest square tile that can cover a 252 cm by 198 cm rectangle without cutting any tiles. How many tiles are needed?", ["The tile side must divide both dimensions, so find HCF(252, 198).", "Prime factorise: 252 = 2² × 3² × 7 and 198 = 2 × 3² × 11.", "The shared lower powers give 2 × 3² = 18, so each tile is 18 cm by 18 cm.", "The rectangle holds 252 ÷ 18 = 14 tiles along one side and 198 ÷ 18 = 11 along the other.", "Multiply 14 × 11."], "The greatest tile is 18 cm square and 154 tiles are needed.")
        ],
        { q: "Find the HCF and LCM of 84 and 126 using prime factorisation.", answer: "84 = 2² × 3 × 7 and 126 = 2 × 3² × 7. HCF = 2 × 3 × 7 = 42. LCM = 2² × 3² × 7 = 252." },
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
          example("Find 38 mod 6.", ["Six groups of 6 make 36.", "Subtract 36 from 38.", "The remainder 2 is smaller than 6."], "38 mod 6 = 2."),
          example("Today is Tuesday. What day will it be in 45 days?", ["Weekdays repeat every 7 days, so work modulo 7.", "45 = 6 × 7 + 3, so move forward 3 days.", "Three days after Tuesday is Friday."], "Friday."),
          example("Find 2¹⁰ mod 5 using a cycle.", ["List the remainders: 2¹ ≡ 2, 2² ≡ 4, 2³ ≡ 3 and 2⁴ ≡ 1 modulo 5.", "The cycle length is 4.", "10 leaves remainder 2 when divided by 4, so use the second position in the cycle."], "2¹⁰ mod 5 = 4."),
          example("Find the final digit of 7²⁰²⁶.", ["The final digit is the remainder modulo 10.", "Powers of 7 cycle through final digits 7, 9, 3 and 1.", "The cycle length is 4 and 2026 = 506 × 4 + 2.", "Use the second digit in the cycle."], "The final digit is 9.")
        ],
        { q: "Find 3¹⁰⁰ mod 8.", answer: "3² = 9 ≡ 1 (mod 8). Therefore 3¹⁰⁰ = (3²)⁵⁰ ≡ 1⁵⁰ ≡ 1 (mod 8)." },
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
        "Imagine a rectangle whose side lengths are x + 3 and x + 5. Its area is (x + 3)(x + 5). We can find the same area by splitting the rectangle into four smaller regions: x², 5x, 3x and 15. Adding them gives x² + 8x + 15.",
        "This picture explains the rule for expanding two brackets. Every term in the first bracket must multiply every term in the second. There are four products because each bracket contains two terms.",
        "After writing all four products, collect like terms. Terms are like only when their variable parts match exactly. For example, 5x and 3x combine to make 8x, but x² and x do not combine.",
        "Negative signs belong to the terms that follow them. In (x - 4)(x + 2), the second term of the first bracket is -4. Treating it as a signed number prevents the common error of changing only some of the required signs.",
        "A useful check is to substitute a simple value, such as x = 1, into the original and expanded forms. Matching values do not prove an expansion, but a mismatch immediately reveals an error."
      ], [
        example("Expand (x + 2)(x + 3).", ["Multiply x by both terms in the second bracket: x² + 3x.", "Multiply 2 by both terms: 2x + 6.", "Collect 3x + 2x."], "x² + 5x + 6."),
        example("Expand (x - 4)(x + 2).", ["The four products are x², 2x, -4x and -8.", "Collect the x terms: 2x - 4x = -2x."], "x² - 2x - 8."),
        example("Expand (2x + 3)(x - 5).", ["Multiply 2x by x and -5 to get 2x² - 10x.", "Multiply 3 by x and -5 to get 3x - 15.", "Collect -10x + 3x."], "2x² - 7x - 15."),
        example("Expand and simplify (3x - 2)(2x + 5) - (x + 1)².", ["Expand the first product: 6x² + 15x - 4x - 10 = 6x² + 11x - 10.", "Expand (x + 1)² as x² + 2x + 1.", "Subtract the whole second expression, changing all its signs.", "Collect like terms."], "5x² + 9x - 11.")
      ], { q: "Expand and simplify (2x - 7)(3x + 4).", answer: "6x² - 13x - 28." }, { note: "Do not combine x² and x. The exponent is part of the variable term, so they represent different kinds of quantity." }),

      section("2. Factorising a quadratic", [
        "Factorising reverses expansion. When we factorise x² + 7x + 12, we are asking which two brackets could have produced it. The constant 12 came from multiplying the two constant terms. The coefficient 7 came from adding those same two numbers.",
        "For a monic quadratic x² + bx + c, look for two numbers whose product is c and whose sum is b. For x² + 7x + 12, the numbers are 3 and 4, so the factorisation is (x + 3)(x + 4).",
        "Signs provide useful clues. If c is positive, the two numbers have the same sign. The sign of b tells you whether both are positive or both are negative. If c is negative, one number is positive and one is negative.",
        "When the coefficient of x² is not 1, there are more possibilities. A reliable method is to split the middle term. For 2x² + 7x + 3, multiply 2 × 3 to get 6, then find two numbers with product 6 and sum 7. They are 6 and 1.",
        "Always expand the brackets to check. Factorisation is exact, so the check should reproduce every term of the original quadratic, including its signs."
      ], [
        example("Factorise x² + 5x + 6.", ["Find two numbers with product 6 and sum 5.", "The numbers are 2 and 3.", "Place them in brackets with x."], "(x + 2)(x + 3)."),
        example("Factorise x² - x - 12.", ["The product is -12, so the signs differ.", "The numbers 3 and -4 multiply to -12 and add to -1."], "(x + 3)(x - 4)."),
        example("Factorise 2x² + 7x + 3.", ["Multiply the first and last coefficients: 2 × 3 = 6.", "Split 7x into 6x + x.", "Group: 2x(x + 3) + 1(x + 3).", "Take out the shared bracket."], "(2x + 1)(x + 3)."),
        example("Factorise 6x² - 7x - 3.", ["Multiply 6 × -3 to get -18.", "Find numbers with product -18 and sum -7: -9 and 2.", "Split and group: 6x² - 9x + 2x - 3.", "Factor each pair: 3x(2x - 3) + 1(2x - 3)."], "(3x + 1)(2x - 3).")
      ], { q: "Factorise 3x² + 11x + 6.", answer: "(3x + 2)(x + 3)." }, { note: "Finding numbers with the correct product but the wrong sum is not enough. Both conditions must be satisfied." }),

      section("3. The difference of two squares", [
        "Expand (a + b)(a - b). The products are a², -ab, +ab and -b². The two middle terms cancel, leaving a² - b². This identity is called the difference of two squares.",
        "The pattern has two requirements. There must be a subtraction and both terms must be perfect squares. For example, x² - 25 works because 25 = 5². Therefore x² - 25 = (x + 5)(x - 5).",
        "A sum of squares does not use this real-number pattern. The expression x² + 25 cannot be factorised as (x + 5)(x - 5), because those brackets expand to x² - 25.",
        "Sometimes a common factor must be removed first. In 3x² - 75, factor out 3 to get 3(x² - 25), then apply the difference of two squares inside the bracket.",
        "The identity is also useful for mental calculation. A product such as 103 × 97 can be seen as (100 + 3)(100 - 3), so it equals 100² - 3²."
      ], [
        example("Factorise x² - 16.", ["Recognise 16 as 4².", "Use a² - b² = (a + b)(a - b)."], "(x + 4)(x - 4)."),
        example("Factorise 9x² - 25.", ["Recognise 9x² as (3x)² and 25 as 5².", "Use the sum and difference of the two square roots."], "(3x + 5)(3x - 5)."),
        example("Factorise 3x² - 75 fully.", ["Take out the common factor 3: 3(x² - 25).", "Inside the bracket, use x² - 5² = (x + 5)(x - 5)."], "3(x + 5)(x - 5)."),
        example("Calculate 103 × 97 without long multiplication.", ["Write the product as (100 + 3)(100 - 3).", "Use the difference of two squares: 100² - 3².", "Calculate 10,000 - 9."], "9,991.")
      ], { q: "Factorise 20x² - 45 fully.", answer: "5(4x² - 9) = 5(2x + 3)(2x - 3)." }, { note: "Do not use this identity for a sum of squares. The cancellation depends on one bracket containing +b and the other containing -b." })
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
        "A shop reduces a £50 coat by 20%. One method is to find 20% of £50 and subtract it. A faster method asks what percentage remains. If 20% is removed, 80% remains, so the new price is 80% of the original.",
        "A percentage can be written as a decimal by dividing by 100. Therefore 80% = 0.80, and the sale price is £50 × 0.80. The decimal 0.80 is called the multiplier because one multiplication produces the new amount.",
        "For an increase, add the percentage to 100%. A 12% increase leaves us with 112% of the original, so the multiplier is 1.12. For a 12% decrease, 88% remains and the multiplier is 0.88.",
        "Write the multiplier before using any numbers. This separates the meaning of the change from the arithmetic and makes it easier to spot whether the result should be larger or smaller than the starting amount.",
        "The multiplier represents the whole new amount, not merely the change. Multiplying by 0.15 finds 15% of an amount. Multiplying by 1.15 increases it by 15%."
      ], [
        example("Write the multiplier for a 7% increase.", ["Begin with 100% of the original.", "After the increase there is 107%.", "Divide by 100 to convert to a decimal."], "1.07."),
        example("Increase £240 by 15%.", ["A 15% increase uses multiplier 1.15.", "Calculate 240 × 1.15."], "£276."),
        example("Decrease 680 by 22%.", ["A 22% decrease leaves 78%.", "Use multiplier 0.78.", "Calculate 680 × 0.78."], "530.4."),
        example("A population of 48,000 rises by 6% and then falls by 6%. Find the final population.", ["Use multiplier 1.06 for the rise and 0.94 for the fall.", "Calculate 48,000 × 1.06 × 0.94.", "The multipliers do not cancel because 1.06 × 0.94 is less than 1."], "47,827.2, or about 47,827 people.")
      ], { q: "A laptop costing £850 is reduced by 18%. Find the sale price.", answer: "The multiplier is 0.82, so the price is £850 × 0.82 = £697." }, { note: "Do not use 0.18 as the multiplier for an 18% decrease. That finds the amount removed, not the amount remaining." }),

      section("2. Compound growth and decay", [
        "Suppose £1,000 earns 5% interest each year. After the first year it becomes £1,050. During the second year, the 5% is calculated from £1,050, not from the original £1,000. The change itself has begun to change.",
        "This repeated proportional change is called compound growth. Each year multiplies the current amount by 1.05. After three years, the calculation is 1,000 × 1.05 × 1.05 × 1.05, written more neatly as 1,000 × 1.05³.",
        "The general model is new amount = original amount × multiplier^number of periods. A period might be a year, month, day or any other repeated interval. The rate and number of periods must refer to the same unit of time.",
        "Compound decay works in the same way with a multiplier below 1. A machine losing 12% of its value each year retains 88%, so its value after n years is original value × 0.88^n.",
        "Round money only at the end unless the question says otherwise. Rounding after every period changes the amount used for the next calculation and can create a noticeable error."
      ], [
        example("£500 earns 4% interest for one year. Find its value.", ["The multiplier is 1.04.", "Calculate 500 × 1.04."], "£520."),
        example("£500 earns 4% compound interest for three years.", ["Use the same multiplier once per year.", "Calculate 500 × 1.04³."], "£562.43 to the nearest penny."),
        example("A car worth £24,000 loses 18% of its value each year. Find its value after four years.", ["The car retains 82%, so the multiplier is 0.82.", "Use four periods: 24,000 × 0.82⁴.", "Round the final result to the nearest pound."], "About £10,851."),
        example("A culture grows by 3% every hour. How long does it take 2,000 cells to exceed 2,500 cells?", ["Model the count after n hours as 2,000 × 1.03^n.", "Test nearby whole values of n or solve using logarithms.", "After 7 hours the count is about 2,460, still below 2,500.", "After 8 hours it is about 2,534."], "It first exceeds 2,500 after 8 hours.")
      ], { q: "A substance has mass 80 g and loses 7% each day. Find its mass after five days.", answer: "80 × 0.93⁵ ≈ 55.65 g." }, { note: "Simple change repeatedly uses the original amount. Compound change repeatedly uses the latest amount. Do not add the same percentage amount each period." , visual: "intermediate-compound-growth"}),

      section("3. Reverse percentages", [
        "A jacket costs £72 after a 20% reduction. The £72 is not 100% of the original price. It is the 80% that remains. To recover the original, we must undo multiplication by 0.80.",
        "Undoing multiplication means dividing by the same multiplier. Therefore the original jacket price is 72 ÷ 0.80 = 90. This is the central rule for reverse percentages.",
        "Do not simply add 20% of the final price. Twenty per cent of £72 is not the amount originally removed, because the original percentage was calculated from a different whole.",
        "Label the known amount with the percentage it represents. If a value after a 15% increase is known, that value represents 115%. If a value after a 15% decrease is known, it represents 85%.",
        "For several compound changes, divide by the complete product of the multipliers. Reversing one period at a time also works, provided each operation is undone in reverse order."
      ], [
        example("A price is £60 after a 25% reduction. Find the original price.", ["After the reduction, 75% remains.", "The multiplier was 0.75.", "Divide 60 by 0.75."], "£80."),
        example("A salary is £32,760 after a 5% rise. Find the previous salary.", ["The new salary represents 105%.", "Divide by multiplier 1.05."], "£31,200."),
        example("A population is 18,225 after growing by 8% in each of two years. Find the starting population.", ["The two-year multiplier is 1.08².", "Divide 18,225 by 1.08²."], "The starting population was 15,625."),
        example("After a 10% rise followed by a 20% fall, an investment is worth £7,040. Find its original value.", ["The combined multiplier is 1.10 × 0.80 = 0.88.", "The final value is 88% of the original.", "Divide 7,040 by 0.88."], "£8,000.")
      ], { q: "A bicycle costs £552 after a 20% increase. Find its original price.", answer: "£552 represents 120%, so divide by 1.20. The original price was £460." }, { note: "A reverse percentage question changes what counts as 100%. Adding or subtracting a percentage of the final amount uses the wrong whole." })
    ],
    ["A percentage multiplier represents the whole amount after a change.", "Compound change applies the multiplier to the latest amount in every period.", "Reverse percentages undo the original multiplier by division."],
    ["Using the percentage change as the multiplier instead of the percentage remaining.", "Treating compound change as repeated addition of a fixed amount.", "Rounding at every stage rather than at the end.", "Adding a percentage of the final value when trying to recover the original."]
  );

  lessons.simultaneousEquations = lesson(
    "Simultaneous Equations: finding values that satisfy two clues",
    5,
    ["algebraicManipulation", { module: "junior", key: "systemWord" }, { module: "primary", key: "twoUnknowns" }],
    "When two unknown quantities are linked by two independent clues, neither clue usually settles the answer alone. Simultaneous equations keep both clues active at the same time. We will learn two methods for removing one unknown, then check that the surviving pair satisfies both original equations.",
    [
      section("1. Elimination", [
        "Imagine buying identical notebooks and pens. One receipt says that 2 notebooks and 3 pens cost £13. Another says that 2 notebooks and 1 pen cost £9. The matching notebook cost appears in both clues, so subtracting the receipts removes it and exposes the cost of the pens.",
        "Elimination uses this same idea with algebra. Arrange both equations so matching variables sit in matching columns. If one variable has equal coefficients with the same sign, subtract the equations. If the signs are opposite, add them.",
        "The coefficients may not match at first. Multiply one or both complete equations until one pair does match. Multiplying an equation preserves its truth only when every term on both sides is multiplied.",
        "After one variable has been eliminated, solve the resulting one-variable equation. Substitute that value into either original equation to find the other unknown.",
        "Finish by checking both original equations. A pair that satisfies only one equation is not a simultaneous solution."
      ], [
        example("Solve x + y = 9 and x - y = 3.", ["Add the equations because +y and -y cancel.", "This gives 2x = 12, so x = 6.", "Substitute into x + y = 9 to get 6 + y = 9."], "x = 6 and y = 3."),
        example("Solve 2x + y = 11 and 2x - y = 5.", ["Add the equations to eliminate y.", "4x = 16, so x = 4.", "Substitute into 2x + y = 11: 8 + y = 11."], "x = 4 and y = 3."),
        example("Solve 3x + 2y = 16 and 5x + 2y = 24.", ["Subtract the first equation from the second to eliminate 2y.", "2x = 8, so x = 4.", "Substitute into 3x + 2y = 16: 12 + 2y = 16."], "x = 4 and y = 2."),
        example("Solve 2x + 3y = 17 and 5x - 2y = 4.", ["Multiply the first equation by 2: 4x + 6y = 34.", "Multiply the second by 3: 15x - 6y = 12.", "Add to eliminate y: 19x = 46, so x = 46/19.", "Substitute into either original equation to find y."], "x = 46/19 and y = 77/19.")
      ], { q: "Solve 4x + 3y = 18 and 2x - 3y = 0.", answer: "Add the equations: 6x = 18, so x = 3. Then 2(3) - 3y = 0 gives y = 2." }, { note: "Do not multiply only the variable term when matching coefficients. Multiply every term in the entire equation, including the number on the right." }),

      section("2. Substitution", [
        "Substitution is useful when one equation already tells us what one variable equals. If y = 2x + 1, then every occurrence of y represents the same quantity as 2x + 1.",
        "Replace that variable in the other equation with its equivalent expression. The second equation then contains only one unknown and can be solved normally.",
        "Brackets matter when the substituted expression is multiplied or subtracted. If an equation contains 3y and y = 2x - 4, write 3(2x - 4), not 3 × 2x - 4.",
        "When neither variable is isolated, rearrange the simpler equation first. Choose the variable with coefficient 1 or -1 when possible because it avoids fractions.",
        "Substitution and elimination are not rival rules. They are two ways to express the same logical act: use one clue inside the other until only one unknown remains."
      ], [
        example("Solve y = x + 2 and x + y = 8.", ["Replace y in the second equation with x + 2.", "x + (x + 2) = 8, so 2x = 6 and x = 3.", "Then y = 3 + 2."], "x = 3 and y = 5."),
        example("Solve y = 3x - 4 and 2x + y = 16.", ["Substitute 3x - 4 for y.", "2x + 3x - 4 = 16.", "Solve 5x = 20, then find y."], "x = 4 and y = 8."),
        example("Solve 2x + y = 7 and 3x - 2y = 0.", ["Rearrange the first equation: y = 7 - 2x.", "Substitute into the second: 3x - 2(7 - 2x) = 0.", "Expand and solve: 3x - 14 + 4x = 0, so 7x = 14."], "x = 2 and y = 3."),
        example("A cinema sells adult tickets for £a and student tickets for £s. Two adult and three student tickets cost £39, while an adult ticket costs £3 more than a student ticket. Find both prices.", ["Write 2a + 3s = 39 and a = s + 3.", "Substitute s + 3 for a: 2(s + 3) + 3s = 39.", "Solve 5s + 6 = 39, giving s = 33/5.", "Then a = s + 3."], "Student tickets cost £6.60 and adult tickets cost £9.60.")
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
        "The expression x² + 6x is nearly a perfect square. Since (x + 3)² expands to x² + 6x + 9, we can write x² + 6x as (x + 3)² - 9. We added 9 inside the square and subtracted it outside, so the value did not change.",
        "This process is called completing the square. For x² + bx, half the coefficient b and place that number inside the bracket. Then subtract its square to compensate.",
        "The form (x - h)² + k makes the graph visible. A square is smallest when it equals zero, so the turning point is (h, k). Notice the sign reversal: (x - 4)² has its minimum when x = 4.",
        "When the coefficient of x² is not 1, factor it from the x² and x terms first. Complete the square inside that factor, then distribute carefully if needed.",
        "Check by expanding the completed-square form. Every original coefficient and constant must return."
      ], [
        example("Write x² + 8x in completed-square form.", ["Half 8 to get 4.", "(x + 4)² gives x² + 8x + 16.", "Subtract the extra 16."], "(x + 4)² - 16."),
        example("Complete the square for x² - 10x + 7.", ["Half -10 to get -5.", "Write (x - 5)², which contributes +25.", "Adjust the constant: 7 - 25 = -18."], "(x - 5)² - 18."),
        example("Find the turning point of y = x² + 4x - 1.", ["Complete the square: x² + 4x - 1 = (x + 2)² - 5.", "The square is smallest when x + 2 = 0.", "Then x = -2 and y = -5."], "The turning point is (-2, -5)."),
        example("Complete the square for 2x² + 12x + 5.", ["Factor 2 from the first two terms: 2(x² + 6x) + 5.", "Complete the square inside: x² + 6x = (x + 3)² - 9.", "Substitute and simplify: 2[(x + 3)² - 9] + 5."], "2(x + 3)² - 13.")
      ], { q: "Write x² - 6x + 11 in completed-square form and state its turning point.", answer: "x² - 6x + 11 = (x - 3)² + 2, so the turning point is (3, 2)." }, { note: "The number inside the bracket has the opposite sign from the x-coordinate of the turning point." }),

      section("2. Solving quadratic equations", [
        "Solving a quadratic means finding the values of x that make the expression equal zero. On a graph, these are the x-coordinates where the parabola crosses or touches the x-axis. They are called roots.",
        "Factorising is usually the quickest method when the quadratic has convenient integer factors. If (x + 2)(x - 5) = 0, at least one bracket must be zero. This zero-product rule gives x = -2 or x = 5.",
        "Some quadratics do not factorise neatly. The quadratic formula solves ax² + bx + c = 0 for any suitable values of a, b and c: x = [-b ± √(b² - 4ac)]/(2a). Identify a, b and c with their signs before substituting.",
        "The ± symbol represents two calculations, one using addition and one using subtraction. Keep the entire numerator over 2a. Writing the fraction bar clearly prevents order-of-operations errors.",
        "Substitute each root into the original equation or use the sum and product of roots as a check. Rounded answers should be given only when the exact surd form is not requested."
      ], [
        example("Solve x² - 7x + 12 = 0.", ["Factorise: x² - 7x + 12 = (x - 3)(x - 4).", "Set each bracket equal to zero."], "x = 3 or x = 4."),
        example("Solve 2x² + x - 6 = 0.", ["Factorise as (2x - 3)(x + 2) = 0.", "Solve 2x - 3 = 0 and x + 2 = 0."], "x = 3/2 or x = -2."),
        example("Solve x² + 4x - 1 = 0 exactly.", ["Use a = 1, b = 4 and c = -1.", "Substitute into the formula: x = [-4 ± √(16 + 4)]/2.", "Simplify √20 to 2√5 and divide by 2."], "x = -2 ± √5."),
        example("The length of a rectangle is 3 cm greater than its width and its area is 40 cm². Find its dimensions.", ["Let the width be x, so the length is x + 3.", "Form x(x + 3) = 40, giving x² + 3x - 40 = 0.", "Factorise as (x + 8)(x - 5) = 0.", "Reject the negative length."], "The rectangle is 5 cm by 8 cm.")
      ], { q: "Solve 3x² - 5x - 2 = 0.", answer: "(3x + 1)(x - 2) = 0, so x = -1/3 or x = 2." }, { note: "A quadratic equation must be arranged equal to zero before the zero-product rule can be used." , visual: "intermediate-quadratic-roots"}),

      section("3. The discriminant", [
        "Inside the quadratic formula is the expression b² - 4ac. It is called the discriminant because it distinguishes between the possible kinds of root.",
        "If b² - 4ac is positive, its square root is non-zero and the ± calculation produces two different real roots. The graph crosses the x-axis twice.",
        "If the discriminant is zero, the square-root term disappears and both formula branches give the same root. The graph touches the x-axis once at its turning point.",
        "If the discriminant is negative, its square root is not a real number. The quadratic therefore has no real roots and its graph does not meet the x-axis.",
        "The discriminant answers a question about the number of roots without requiring us to calculate the roots themselves. Keep the sign of b inside b² and the signs of a and c inside 4ac."
      ], [
        example("How many real roots has x² - 5x + 6 = 0?", ["Here a = 1, b = -5 and c = 6.", "The discriminant is (-5)² - 4(1)(6) = 25 - 24 = 1.", "A positive discriminant gives two distinct real roots."], "Two real roots."),
        example("How many real roots has x² + 6x + 9 = 0?", ["The discriminant is 6² - 4(1)(9) = 36 - 36 = 0.", "A zero discriminant gives one repeated root."], "One repeated real root."),
        example("Find the values of k for which x² + 4x + k = 0 has two distinct real roots.", ["The discriminant is 4² - 4(1)(k) = 16 - 4k.", "Two distinct roots require 16 - 4k > 0.", "Solve the inequality."], "k < 4."),
        example("The line y = 2x + m is tangent to y = x². Find the possible values of m.", ["At intersections, x² = 2x + m, so x² - 2x - m = 0.", "Tangency means one repeated root, so the discriminant is zero.", "Using a = 1, b = -2 and c = -m gives 4 + 4m = 0."], "m = -1.")
      ], { q: "Find the range of p for which 2x² + px + 3 = 0 has no real roots.", answer: "No real roots require p² - 24 < 0, so -2√6 < p < 2√6." }, { note: "Do not say that a zero discriminant means no roots. It means the two formula answers have merged into one repeated real root." })
    ],
    ["Completing the square reveals the turning point.", "Quadratic roots are values that make the quadratic equal zero.", "Factorising and the quadratic formula are two routes to those roots.", "The discriminant tells us how many real roots exist."],
    ["Forgetting to set the equation equal to zero before factorising.", "Using the wrong sign for b in the quadratic formula.", "Dividing only the square-root term by 2a.", "Confusing a repeated root with no real root."]
  );

  lessons.ratioProportionAlgebraic = lesson(
    "Algebraic Proportion: relationships that scale",
    7,
    [{ module: "primary", key: "ratioBasics" }, "algebraicManipulation"],
    "Proportion describes how two quantities change together. Rather than memorising several disconnected formulas, we will begin by asking what stays constant. That constant creates the algebraic model and lets us predict new values with confidence.",
    [
      section("1. Direct proportion", [
        "Imagine buying apples at a fixed price per kilogram. Doubling the mass doubles the cost and tripling the mass triples it. The cost and mass grow by the same scale factor.",
        "This relationship is called direct proportion. If y is directly proportional to x, we write y ∝ x. The symbol means that y/x stays constant whenever x is not zero.",
        "Call the constant ratio k. Then y/x = k, which rearranges to y = kx. The number k is the constant of proportionality. In the apple example, it is the price for one kilogram.",
        "Use one known pair of values to find k, then use y = kx for any other pair. State what k means when the context gives it a unit.",
        "A graph of y against x is a straight line through the origin. A straight line with a non-zero intercept is linear, but it is not direct proportion because y is not zero when x is zero."
      ], [
        example("y is directly proportional to x and y = 15 when x = 3. Find k.", ["Use y = kx.", "Substitute 15 = 3k.", "Divide by 3."], "k = 5."),
        example("y ∝ x and y = 28 when x = 4. Find y when x = 11.", ["Find k = 28 ÷ 4 = 7.", "Use y = 7x.", "Substitute x = 11."], "y = 77."),
        example("The mass m of identical metal rods is directly proportional to their length L. A 1.8 m rod has mass 6.3 kg. Find the mass per metre and the mass of a 4.2 m rod.", ["Use m = kL.", "Find k = 6.3 ÷ 1.8 = 3.5 kg per metre.", "Calculate m = 3.5 × 4.2."], "The rate is 3.5 kg/m and the 4.2 m rod has mass 14.7 kg."),
        example("A quantity y is directly proportional to x². When x = 3, y = 45. Find x when y = 320 and x is positive.", ["The model is y = kx².", "Use 45 = 9k to find k = 5.", "Solve 320 = 5x², so x² = 64.", "Use the stated positive condition."], "x = 8.")
      ], { q: "P is directly proportional to t³. When t = 2, P = 40. Find P when t = 5.", answer: "P = kt³. From 40 = 8k, k = 5. Therefore P = 5 × 125 = 625." }, { note: "A straight-line relationship is directly proportional only if the line passes through the origin." }),

      section("2. Inverse proportion", [
        "Suppose a fixed journey is travelled at different speeds. A greater speed produces a shorter time. Doubling the speed halves the time, so the two quantities change in opposite directions.",
        "This is inverse proportion. If y is inversely proportional to x, the product xy stays constant. We write y ∝ 1/x and model the relationship as y = k/x.",
        "The constant k represents the fixed total being shared between the two quantities. For speed and time, k is the distance because speed × time = distance.",
        "Find k from one known pair by multiplying x and y. Then divide k by the new value of one quantity to find the other.",
        "Inverse proportion is not subtraction. The quantities need not have a fixed difference. The defining check is that multiplying corresponding values always gives the same constant."
      ], [
        example("y is inversely proportional to x and y = 6 when x = 4. Find k.", ["Use y = k/x, or equivalently k = xy.", "Multiply 4 × 6."], "k = 24."),
        example("y ∝ 1/x and y = 10 when x = 3. Find y when x = 12.", ["Find k = 3 × 10 = 30.", "Use y = 30/x.", "Substitute x = 12."], "y = 2.5."),
        example("Eight workers complete a fixed job in 15 days at the same rate. How long would 12 workers take?", ["Workers and days are inversely proportional, so workers × days is constant.", "Find k = 8 × 15 = 120 worker-days.", "Divide 120 by 12 workers."], "10 days."),
        example("y is inversely proportional to x². When x = 2, y = 18. Find the positive value of x when y = 8.", ["Use y = k/x².", "Find k = yx² = 18 × 4 = 72.", "Solve 8 = 72/x², giving x² = 9.", "Use the positive value requested."], "x = 3.")
      ], { q: "The pressure p of a fixed amount of gas is inversely proportional to its volume V. If p = 240 when V = 5, find p when V = 8.", answer: "k = pV = 1,200. Therefore p = 1,200 ÷ 8 = 150." }, { note: "When x doubles in inverse proportion, y halves. If both quantities increase together, the relationship is not inverse proportion." }),

      section("3. Choosing the correct proportional model", [
        "Real questions rarely announce the exact formula. Begin by describing the relationship in words. Does increasing one quantity increase the other by the same scale factor, or does it make the other smaller?",
        "Test simple scaling. If doubling x doubles y, direct proportion y = kx may fit. If doubling x halves y, inverse proportion y = k/x may fit. If doubling x multiplies y by four, the model may involve x².",
        "Units can reveal the constant. A fixed cost per item suggests direct proportion. A fixed distance equal to speed × time suggests inverse proportion between speed and time.",
        "Not every relationship is proportional. A taxi fare with a fixed booking fee has the form y = mx + c, where c is not zero. Its graph does not pass through the origin.",
        "After choosing a model, test it against every given pair. A model that fits only one pair has not been checked."
      ], [
        example("The cost of identical cinema tickets is compared with the number bought. Which model is appropriate?", ["With no fixed booking fee, twice as many tickets cost twice as much.", "The cost per ticket stays constant."], "Direct proportion: C = kn."),
        example("The time for a fixed journey is compared with constant speed. Which model is appropriate?", ["Doubling speed halves the travel time.", "The product speed × time is the fixed distance."], "Inverse proportion: t = k/v."),
        example("The area of a square is compared with its side length. Is the relationship direct proportion?", ["Area is s².", "Doubling s multiplies area by 4, not by 2.", "Therefore A/s is not constant."], "No. Area is directly proportional to s², so A = ks² with k = 1."),
        example("A delivery charge is £4 plus £1.50 per kilometre. Explain why cost is not directly proportional to distance and write a model.", ["At zero kilometres, the charge is still £4.", "A direct-proportion graph must pass through the origin.", "Add the fixed charge to the distance-dependent amount."], "C = 1.5d + 4, which is linear but not directly proportional.")
      ], { q: "A cube's volume V is compared with its edge length a. State the proportional relationship and explain what happens to V when a triples.", answer: "V ∝ a³. Tripling a multiplies V by 3³ = 27." }, { note: "Do not decide from the words ‘increases’ or ‘decreases’ alone. Test how the quantities scale and identify what remains constant." })
    ],
    ["Direct proportion keeps a ratio constant and has model y = kx.", "Inverse proportion keeps a product constant and has model y = k/x.", "Powers such as x² or x³ change the scaling pattern.", "A proportional model must fit every given value and, for direct proportion, pass through the origin."],
    ["Calling every straight-line relationship direct proportion.", "Using y = kx when doubling x halves y.", "Ignoring powers in relationships involving area or volume.", "Choosing a model from one data pair without checking the rest."]
  );

  lessons.sequencesAndSeries = rewriteExistingLesson(lessons.sequencesAndSeries,
    "A sequence is an ordered list generated by a rule. The visible terms are clues, not the rule itself. We will learn to recognise constant differences, changing differences and constant ratios, then express each pattern with a rule that can produce any term without listing all the earlier ones.",
    [{ module: "junior", key: "customCount" }, { module: "junior", key: "bouncing" }], [
      teaching([
        "Picture a staircase whose first step is 4 blocks high and whose height increases by 3 blocks each time. The heights are 4, 7, 10, 13 and so on. The repeated increase is the important structure.",
        "A sequence with a constant difference is called arithmetic. Here the common difference is 3. Moving from one term to the next adds 3, while moving backwards subtracts 3.",
        "To find the nth term, begin with the sequence 3n, whose terms are 3, 6, 9, 12. Each of these is 1 below the required sequence, so add 1. The rule is 3n + 1.",
        "The coefficient of n is always the common difference. The constant adjustment is found by comparing the generated first term with the actual first term.",
        "Check an nth-term rule with at least two positions. Substituting n = 1 checks the start, while another value checks that the sequence grows correctly."
      ], "Find the nth term of 11, 16, 21, 26, ... and use it to find term 40.", "The difference is 5, so begin with 5n. The first term of 5n is 5, which needs 6 added. The rule is 5n + 6 and term 40 is 206.", "Do not write n + 5 simply because the sequence adds 5. The term number itself also changes, so the repeated difference must multiply n."),
      teaching([
        "Consider 2, 7, 14, 23, 34. The first differences are 5, 7, 9, 11. They are not constant, so the sequence is not arithmetic.",
        "Now compare those first differences. Their differences are all 2. A constant second difference signals a quadratic sequence, whose rule contains an n² term.",
        "For a rule an² + bn + c, the constant second difference equals 2a. A second difference of 2 therefore gives a = 1, so begin by comparing the sequence with n².",
        "Subtract n² term by term. The remaining sequence is often arithmetic, so find its linear rule and add it back to n².",
        "Check the final rule against the first three terms. A formula matching only one or two terms may still be accidental."
      ], "Find the nth term of 3, 8, 15, 24, 35, ...", "The first differences are 5, 7, 9, 11, so the second difference is 2 and the n² coefficient is 1. Subtracting n² leaves 2, 4, 6, 8, 10, which is 2n. The rule is n² + 2n.", "Do not use the first difference as though it were constant. For a quadratic sequence, it is the second difference that stays fixed."),
      teaching([
        "A colony doubles in size during each time period. If it begins at 5, its sizes are 5, 10, 20, 40. The amount added changes, but the multiplication from one term to the next stays the same.",
        "A sequence formed by multiplying by a constant ratio is called geometric. In this example the common ratio is 2.",
        "If the first term is a and the common ratio is r, term n is ar^(n-1). The exponent is n - 1 because the first term has undergone no multiplication yet.",
        "A ratio between 0 and 1 creates decay. A negative ratio makes signs alternate. These patterns are still geometric because the same multiplication occurs each time.",
        "To check a geometric model, divide consecutive non-zero terms. Subtracting terms will not reveal the defining pattern."
      ], "A geometric sequence begins 162, 54, 18, ... Find its nth term and term 6.", "The common ratio is 1/3. The nth term is 162(1/3)^(n-1). Term 6 is 162(1/3)^5 = 2/3.", "Do not use ar^n for a sequence whose first term is a. That would multiply once too many and make term 1 equal ar.")
    ]);

  lessons.graphsAndRatesOfChange = rewriteExistingLesson(lessons.graphsAndRatesOfChange,
    "A graph shows how two quantities vary together. Its steepness records a rate of change, its intercepts record important boundary values and the area beneath some graphs accumulates a total. We will connect each calculation to what the axes mean.",
    [{ module: "junior", key: "coordGeom" }, "simultaneousEquations"], [
      teaching([
        "Imagine walking along a hill. Steepness compares how much height changes with how much horizontal distance is travelled. A graph uses the same comparison.",
        "The gradient between two points is change in y divided by change in x. Write this as (y₂ - y₁)/(x₂ - x₁). Using the same order in both differences keeps the sign correct.",
        "A positive gradient rises from left to right. A negative gradient falls. A zero gradient is horizontal and means y is not changing as x changes.",
        "Gradient has units. On a distance-time graph it may be kilometres per hour. On a cost graph it may be pounds per item.",
        "Choose two well-separated exact points when reading from a graph. A larger triangle reduces the effect of small reading errors."
      ], "Find the gradient through (-3, 7) and (5, -1).", "Change in y is -1 - 7 = -8. Change in x is 5 - (-3) = 8. The gradient is -8/8 = -1.", "Do not reverse only one subtraction. Swapping point order is safe only when both numerator and denominator are reversed."),
      teaching([
        "A straight-line equation y = mx + c separates two pieces of information. The coefficient m is the gradient, while c is the value of y when x = 0.",
        "The point where x = 0 lies on the y-axis, so c is called the y-intercept. It is a starting value, not part of the rate.",
        "When two points are known, find m first. Then substitute either point into y = mx + c to find c.",
        "Parallel lines have the same gradient because they rise at the same rate. Perpendicular non-vertical lines have gradients whose product is -1.",
        "Check an equation by substituting both known points. The equation must reproduce their y-values exactly."
      ], "Find the equation of the line through (2, 7) and (6, 19).", "The gradient is (19 - 7)/(6 - 2) = 3. Use 7 = 3(2) + c to get c = 1. The equation is y = 3x + 1.", "Do not read c as the x-intercept. It is the y-value when x is zero."),
      teaching([
        "A velocity-time graph shows velocity vertically and time horizontally. Over a short interval, distance equals velocity × time.",
        "On the graph, velocity × time is the area of a rectangle. This is why the area under a velocity-time graph represents displacement.",
        "When velocity changes steadily, the region may be a triangle or trapezium. Split a complicated region into familiar shapes and add their signed areas.",
        "Area below the time axis is negative because the velocity is negative. It subtracts from displacement, although it still contributes positively to total distance travelled.",
        "Keep the units visible: metres per second multiplied by seconds gives metres. This confirms that the area has the units of displacement."
      ], "A car accelerates uniformly from 4 m/s to 16 m/s over 6 seconds. Find its displacement.", "The region is a trapezium. Its area is 1/2 × (4 + 16) × 6 = 60, so the displacement is 60 m.", "Do not read the height of a velocity-time graph as distance. Height is velocity; distance or displacement comes from area.")
    ]);

  lessons.surdicModularNumberTheory = rewriteExistingLesson(lessons.surdicModularNumberTheory,
    "Some exact-number questions combine ideas that are usually taught separately. Prime factors decide whether a fraction terminates, conjugates remove awkward surd terms and remainder cycles tame enormous powers. In every case, structure replaces brute-force calculation.",
    ["surdsAndIndices", "numberTheoryDivisibility"], [
      teaching([
        "A fraction such as 3/8 has a terminating decimal, while 1/3 repeats forever. The difference lies in the denominator after the fraction has been simplified.",
        "Our decimal system is built from powers of 10, and 10 = 2 × 5. A fraction terminates exactly when its simplified denominator can be made into a power of 10.",
        "Therefore the denominator may contain only prime factors 2 and 5. A denominator containing 3, 7 or any other prime cannot divide a power of 10 exactly.",
        "Always simplify first. The fraction 3/6 has denominator 6, but it simplifies to 1/2 and therefore terminates.",
        "This test predicts termination without performing long division and also explains why the rule works."
      ], "Does 21/280 have a terminating decimal?", "Simplify 21/280 to 3/40. Since 40 = 2³ × 5 contains only 2s and 5s, the decimal terminates.", "Testing the unsimplified denominator can give the wrong conclusion. Cancel common factors before examining its primes."),
      teaching([
        "Conjugates are pairs such as 4 + √3 and 4 - √3. They contain the same terms but the sign between them is reversed.",
        "Multiplying conjugates uses the difference of two squares. The middle terms cancel, so (4 + √3)(4 - √3) = 16 - 3 = 13.",
        "This cancellation is especially useful for rationalising a two-term denominator. Multiply the numerator and denominator by the denominator's conjugate.",
        "The denominator becomes rational while the numerator is expanded normally. The fraction's value is unchanged because it was multiplied by a form of 1.",
        "Simplify after expanding. A common factor may appear only after the conjugate multiplication has been completed."
      ], "Rationalise 5/(2 + √3).", "Multiply by (2 - √3)/(2 - √3). The denominator becomes 4 - 3 = 1, so the result is 5(2 - √3) = 10 - 5√3.", "Do not change the sign of the whole denominator. The conjugate changes only the sign between its two terms."),
      teaching([
        "Calculating a huge power before finding its remainder wastes work. Remainders can be reduced after every multiplication without changing the final remainder.",
        "Begin by listing powers until a remainder repeats. The repeated state marks the start of a cycle.",
        "Use the cycle length to reduce the exponent. The exponent's remainder identifies the matching position in the cycle.",
        "Repeated squaring is another method. Square and reduce, then combine the powers needed to build the exponent in binary.",
        "A zero exponent remainder means the end of a complete cycle. It does not mean the first listed remainder unless the indexing has been defined that way."
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
        "Think of a function as a machine. An input enters, one fixed rule acts on it and an output leaves. The notation f(x) names the output produced from input x.",
        "A composite function connects two machines. In fg(x), the convention used here means f(g(x)): apply g first, then feed its output into f.",
        "Order matters. Doubling then adding 3 is not the same as adding 3 then doubling because the second process also doubles the added 3.",
        "To form an algebraic composite, replace every x in the outside function with the complete inside expression. Use brackets around that expression.",
        "Check the result with a simple numerical input by running it through both machines separately."
      ], "Let f(x) = 2x - 1 and g(x) = x² + 3. Find fg(x) and gf(x).", "fg(x) = f(g(x)) = 2(x² + 3) - 1 = 2x² + 5. gf(x) = g(f(x)) = (2x - 1)² + 3 = 4x² - 4x + 4.", "Do not read fg(x) as f(x) × g(x). It denotes composition, and the right-hand function acts first."),
      teaching([
        "An inverse function undoes a function. If f sends 4 to 11, then f⁻¹ sends 11 back to 4.",
        "To find an inverse algebraically, write y = f(x), swap x and y, then rearrange for y. Swapping reflects the reversal of input and output.",
        "A function has an inverse function only when each output comes from one input within the chosen domain. Otherwise the inverse would not know which value to return.",
        "The notation f⁻¹ does not mean 1/f. It names the reverse function.",
        "Check by composing the function with its inverse. Both f(f⁻¹(x)) and f⁻¹(f(x)) should simplify to x where defined."
      ], "Find the inverse of f(x) = (3x - 5)/2.", "Write y = (3x - 5)/2. Swap x and y: x = (3y - 5)/2. Rearrange to 2x + 5 = 3y, so f⁻¹(x) = (2x + 5)/3.", "Do not replace f⁻¹(x) with 1/f(x). Inverse notation describes undoing the rule, not taking a reciprocal."),
      teaching([
        "Iteration repeatedly uses the latest output as the next input. Starting with x₀, a rule generates x₁, then x₂ and so on.",
        "Some iterative rules move values closer to a fixed point. At a fixed point, applying the rule changes nothing, so x = g(x).",
        "Iteration can approximate a solution when direct algebra is awkward. Begin from the stated starting value and keep sufficient calculator precision at every step.",
        "Not every iteration converges. Values may move away, alternate or enter a cycle. A few stable decimal places provide evidence of convergence but should be interpreted with the question's required accuracy.",
        "Report the approximation only after consecutive iterates agree to more decimal places than the final answer requires."
      ], "Use x_(n+1) = √(10 - x_n), starting with x₀ = 3, to approximate the fixed point to three decimal places.", "The iterates are approximately 2.646, 2.712, 2.700, 2.702 and 2.702. They settle to 2.702 to three decimal places.", "Do not round each iterate to the final requested accuracy. Keep calculator precision until the sequence has settled.")
    ]);

  lessons.diophantineEquations = rewriteExistingLesson(lessons.diophantineEquations,
    "A Diophantine equation asks for integer solutions. Ordinary algebra may describe infinitely many real pairs, but the whole-number condition changes which answers are allowed. Divisibility, common factors and modular reasoning become part of solving the equation.",
    ["numberTheoryDivisibility", "simultaneousEquations"], [
      teaching([
        "Suppose £4 tickets and £6 tickets must total £25. An ordinary line equation can be written, but no collection of whole tickets can make an odd total from even prices.",
        "For ax + by = c to have integer solutions, the greatest common divisor of a and b must divide c. Every combination ax + by is a multiple of that gcd.",
        "This condition decides existence before we search. If it fails, no amount of trial will find an integer solution.",
        "When the condition succeeds, integer solutions exist, though extra restrictions such as positivity may still remove some of them.",
        "State the allowed domain clearly. Counts are often non-negative integers, while a pure number-theory question may allow negative integers too."
      ], "Does 12x + 18y = 25 have integer solutions?", "gcd(12,18) = 6, and 6 does not divide 25. Therefore there are no integer solutions.", "Do not begin random trial before checking the gcd condition. It can prove impossibility immediately."),
      teaching([
        "Once existence is known, isolate one variable: y = (c - ax)/b. The numerator must be divisible by b.",
        "Use modular arithmetic to find which values of x make that divisibility condition true.",
        "One solution leads to a whole family. For ax + by = c with gcd d, x changes by b/d while y changes by -a/d.",
        "Apply positivity or range conditions after finding the family. These conditions often leave only a short list.",
        "Substitute every proposed pair into the original equation. Integer-looking work can still contain an arithmetic slip."
      ], "Find all non-negative integer solutions of 4x + 7y = 39.", "Modulo 4, 7y ≡ 3y ≡ 39 ≡ 3, so y ≡ 1 (mod 4). Non-negative possibilities are y = 1 and 5. These give x = 8 and x = 1. The solutions are (8,1) and (1,5).", "Finding one integer pair does not prove it is the only one. Describe the solution family, then apply the bounds."),
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
        "Arranging three different books on a shelf produces different outcomes when the order changes. ABC and BAC are not the same shelf arrangement.",
        "For the first position there are 3 choices, then 2 choices remain, then 1. The multiplication principle gives 3 × 2 × 1 = 6.",
        "The product n × (n - 1) × ... × 1 is written n factorial, or n!. It counts arrangements of n distinct objects.",
        "If only r positions are filled from n objects, the count is n!/(n-r)!. The process stops after r choices.",
        "Restrictions are often easiest to handle by treating linked objects as a block or by counting all arrangements and subtracting forbidden ones."
      ], "How many arrangements of the letters in MATH have the two vowels together?", "Treat A and the single vowel? MATH has only A as a vowel, so the condition is automatic. All 4! = 24 arrangements qualify. This wording check is the point of the question.", "Do not apply a memorised block method before checking which objects actually satisfy the condition."),
      teaching([
        "Choosing three committee members is different from assigning president, secretary and treasurer. A committee has no internal order, so the same three people should be counted once.",
        "If we begin with ordered selections, each group of r people has been counted r! times, once for every internal order.",
        "Dividing by r! removes this overcounting. The result n!/[r!(n-r)!] is written n choose r.",
        "Combinations satisfy nCr = nC(n-r) because choosing who is included is equivalent to choosing who is left out.",
        "Decide whether roles, positions or sequence matter before choosing between permutations and combinations."
      ], "How many five-person teams can be chosen from 12 students if two particular students may not both be selected?", "There are 12C5 teams altogether. Teams containing both particular students require 3 more from the other 10, giving 10C3. The answer is 12C5 - 10C3 = 672.", "Do not use permutations for an unordered team. Rearranging the same members does not create a new team."),
      teaching([
        "If every person in a room shakes hands with every other person once, each handshake connects a pair of people.",
        "Choosing the two people gives nC2 handshakes. This automatically avoids counting A with B and B with A separately.",
        "The same model counts edges in a complete graph, matches in a round-robin tournament and line segments joining pairs of points.",
        "An alternative derivation adds (n - 1) + (n - 2) + ... + 1. This gives n(n - 1)/2, the same as nC2.",
        "When some pairs are forbidden or already connected, begin with all pairs and subtract the excluded ones."
      ], "A league has 18 teams and every pair plays twice, once at each home ground. How many matches are played?", "There are 18C2 = 153 unordered pairs of teams. Each pair plays twice, so there are 306 matches.", "The handshake formula counts each unordered pair once. Multiply only when the context creates several distinct events for each pair.")
    ]);

  lessons.advancedProbability = rewriteExistingLesson(lessons.advancedProbability,
    "Probability measures uncertainty on a scale from 0 to 1. Multi-stage problems become manageable when we separate routes, decide whether earlier events change later probabilities and recognise when a complementary event is easier to count.",
    ["combinatoricsAndCounting", { module: "primary", key: "fractionArithmetic" }], [
      teaching([
        "Two events are independent when knowing the result of one does not change the probability of the other. Tossing a coin and rolling a die are independent because the coin cannot affect the die.",
        "For independent events both to happen, multiply their probabilities. A probability tree shows this as multiplication along one complete route.",
        "The word ‘and’ usually signals an intersection, but multiplication is justified by the relationship between the events, not by the word alone.",
        "When several distinct routes lead to the required result, find each route probability and add them because any one of those routes may occur.",
        "Label every branch and ensure branches from the same point add to 1. This catches missing outcomes before calculation."
      ], "A fair coin is tossed and a fair six-sided die is rolled. Find the probability of a head and a multiple of 3.", "P(head) = 1/2 and P(multiple of 3) = 2/6 = 1/3. The events are independent, so multiply: 1/2 × 1/3 = 1/6.", "Do not add probabilities for events that must happen together along one route." , "intermediate-probability-tree"),
      teaching([
        "A bag contains counters that are drawn without replacement. After the first counter is removed, both the number of favourable counters and the total number remaining may change.",
        "This makes successive draws dependent. The second branch probabilities must be calculated from the new contents of the bag.",
        "Draw a separate second-stage branch from every first-stage outcome because each outcome leaves a different bag.",
        "Multiply along each route, then add routes when the required event can occur in more than one order.",
        "With replacement resets the bag and usually restores independence. Read that phrase before constructing the tree."
      ], "A bag has 5 red and 3 blue counters. Two are drawn without replacement. Find the probability of one of each colour.", "The routes are red then blue and blue then red. Their probabilities are 5/8 × 3/7 and 3/8 × 5/7. Adding gives 30/56 = 15/28.", "Do not keep the original denominator on the second draw. Only seven counters remain."),
      teaching([
        "The phrase ‘at least one’ includes one, two, three and every larger allowed count. Listing all successful cases can become lengthy.",
        "Its complement is ‘none’. Exactly one of an event and its complement must occur, so their probabilities add to 1.",
        "Therefore P(at least one) = 1 - P(none). For repeated independent trials, P(none) is often one short multiplication.",
        "Translate the wording carefully. The complement of ‘at least two’ is ‘fewer than two’, which includes zero and one.",
        "Use the complement only when it is simpler. The method is a choice based on structure, not a compulsory rule."
      ], "A biased coin has P(head) = 0.3. It is tossed four times. Find the probability of at least one head.", "The complement is no heads, meaning four tails. P(no heads) = 0.7⁴ = 0.2401. Therefore P(at least one head) = 1 - 0.2401 = 0.7599.", "Do not confuse ‘at least one’ with ‘exactly one’. The former includes every positive number of successes.")
    ]);

  lessons.invariantsAndParity = rewriteExistingLesson(lessons.invariantsAndParity,
    "Some puzzles look as though every move creates a new situation, yet one hidden property never changes. Such a property is an invariant. Parity, colouring and totals modulo a fixed number often reveal impossibility without examining every move.",
    ["numberTheoryDivisibility"], [
      teaching([
        "Parity records whether an integer is even or odd. An even number is 2n and an odd number is 2n + 1 for some integer n.",
        "These forms explain the arithmetic rules. Adding two odd numbers gives (2a + 1) + (2b + 1) = 2(a + b + 1), which is even.",
        "A product is odd only when every factor is odd. One even factor supplies a factor of 2 and makes the whole product even.",
        "Instead of memorising a table, ask whether a factor of 2 remains after the operation.",
        "Parity often gives a necessary condition, not a complete solution. Passing a parity test does not automatically prove that an arrangement exists."
      ], "Prove that the square of an odd integer is odd.", "Let the odd integer be 2n + 1. Its square is 4n² + 4n + 1 = 2(2n² + 2n) + 1. This is of the form 2k + 1, so it is odd.", "Do not justify a parity rule with examples alone. The algebraic forms show why it holds for every integer."),
      teaching([
        "An invariant is a feature that remains unchanged after every allowed move. A monovariant changes in only one direction, such as a total that strictly decreases.",
        "Colouring a chessboard creates useful invariants. A domino always covers one black and one white square, so any domino-tiled region must contain equal numbers of both colours.",
        "Totals modulo 2 or modulo another number can also remain fixed. Track how one move changes the total and reduce that change modulo the chosen number.",
        "A monovariant proves termination. If a non-negative integer decreases with every move, the process cannot continue forever.",
        "State the invariant, prove every legal move preserves it and compare the starting and target states. All three steps are needed."
      ], "Explain why a chessboard with two opposite corners removed cannot be tiled by dominoes.", "Opposite corners have the same colour. Removing them leaves 30 squares of one colour and 32 of the other. Every domino covers one of each, so equal colour counts would be required. Tiling is impossible.", "Do not rely on a picture that merely seems awkward. Count the invariant and show why each legal piece preserves it."),
      teaching([
        "To prove a target is impossible, look for a property that the target has but the starting position can never acquire.",
        "Parity is especially useful when each move changes a count by an even number. Its even-or-odd status then remains fixed.",
        "If each move flips parity, the number of moves matters. After an even number of moves the original parity returns; after an odd number it reverses.",
        "Modular classes provide more detail when parity is too weak. A change of 3 preserves a total modulo 3.",
        "An invariant can rule a state out, but it may not show how to reach every state that passes the test. Distinguish necessity from sufficiency."
      ], "A display begins at 0. Each move adds either 4 or subtracts 2. Can it ever show 15?", "Both allowed changes are even, so the displayed number remains even after every move. Since 15 is odd, it cannot be reached.", "Do not search through long move sequences when every move visibly preserves a simpler property.")
    ]);

  lessons.logicAndDeduction = rewriteExistingLesson(lessons.logicAndDeduction,
    "Deduction extracts consequences that must follow from the clues. We will use consistent truth behaviour and the pigeonhole principle, two methods that replace guessing with a short argument covering every possibility.",
    [{ module: "junior", key: "truthLiars" }, { module: "junior", key: "pigeonhole" }], [
      teaching([
        "In a truth-teller puzzle, each person follows a fixed rule: always truthful or always lying. A statement is therefore a constraint on both the speaker and the situation.",
        "Choose one uncertain person and suppose they tell the truth. Follow every consequence until the clues are satisfied or a contradiction appears.",
        "Then test the alternative. A contradiction eliminates an assumption because a valid solution cannot require a statement to be both true and false.",
        "Translate compound statements carefully. The negation of ‘A and B’ is ‘not A or not B’. A liar makes the whole statement false, not necessarily every word inside it false.",
        "After finding a consistent assignment, check every speaker. One unchecked statement can invalidate an otherwise plausible answer."
      ], "A says, ‘B is a liar.’ B says, ‘We are the same type.’ Determine their types.", "If A tells the truth, B is a liar. Then B's claim that they are the same type is false, which is consistent. If A lies, B is truthful, but B would then truthfully claim they are the same type, contradicting their different types. Therefore A is truthful and B is a liar.", "Do not assume that the person mentioned in a statement has the same truth value as the statement itself."),
      teaching([
        "If more objects are placed into fewer boxes, at least one box must receive more than one object. This unavoidable fact is the pigeonhole principle.",
        "In its basic form, n + 1 objects placed into n boxes force one box to contain at least two objects.",
        "The general form says that N objects placed into k boxes force some box to contain at least ceil(N/k) objects.",
        "The main skill is choosing the boxes. They might be months, remainders, colours or intervals rather than physical containers.",
        "The principle proves that a repetition exists. It does not usually identify which particular box contains it."
      ], "Show that among 13 people, at least two were born in the same month.", "The people are 13 objects and the 12 months are boxes. Since 13 > 12, at least one month contains birthdays of at least two people.", "Do not claim that exactly two share a month. The principle guarantees at least two, and there may be more.")
    ]);

  lessons.optimisationAndExtremal = rewriteExistingLesson(lessons.optimisationAndExtremal,
    "Optimisation asks for the greatest or least possible value while certain conditions remain fixed. We will begin with numerical patterns, explain why equality often creates an extremum and then turn practical restrictions into algebra before optimising.",
    ["algebraicManipulation", "quadratics", { module: "junior", key: "productOpt" }], [
      teaching([
        "Take two positive numbers with sum 20. The pairs 1 and 19, 2 and 18, 3 and 17 produce products 19, 36 and 51. The product grows as the numbers become closer.",
        "Write the numbers as 10 - d and 10 + d. Their product is 100 - d². Since d² is never negative, the largest product occurs when d = 0.",
        "Thus, for a fixed positive sum, the product is greatest when the numbers are equal. The result comes from the square term, not merely from a table of examples.",
        "If integers are required and the sum is odd, choose the two closest integers because exact equality is impossible.",
        "Check the domain. Allowing negative numbers or other constraints may change what values are permitted."
      ], "Two positive integers have sum 37. Find their greatest possible product.", "The closest integers are 18 and 19. Their product is 342, which is maximal.", "Do not force equal halves when the required values must be integers and the sum is odd."),
      teaching([
        "A rectangle with fixed perimeter has a fixed sum of length and width because 2L + 2W = P.",
        "Its area is the product LW. The fixed-sum product result therefore shows that area is greatest when L and W are equal.",
        "The optimal rectangle is a square. This conclusion follows before any dimensions are substituted.",
        "For a rectangle beside a wall or river, not every side may use fencing. Write the actual perimeter constraint from the diagram rather than applying the four-sided formula automatically.",
        "After finding a maximum, verify that the dimensions are positive and satisfy the original perimeter exactly."
      ], "A rectangle has perimeter 60 cm. Find the dimensions with maximum area.", "L + W = 30. Their product is greatest when L = W = 15. The maximum-area rectangle is 15 cm by 15 cm, with area 225 cm².", "Do not confuse fixed perimeter with fixed area. Optimisation depends on which quantity is constrained."),
      teaching([
        "A practical optimisation problem first needs a model. Name one variable and use the constraint to express every other dimension in terms of it.",
        "Write the quantity to maximise or minimise as a function of that single variable.",
        "For a quadratic, complete the square or use the turning point. For more advanced functions, differentiation may locate stationary points.",
        "The mathematical optimum may lie outside the practical domain. Lengths must be positive and a design may impose upper or lower limits.",
        "Interpret the result in context, including units and sensible rounding. A decimal number of complete objects may need a nearby integer comparison."
      ], "A farmer has 80 m of fencing for three sides of a rectangle beside a straight river. Find the dimensions that maximise area.", "Let the two equal widths be x, so the fenced length is 80 - 2x. Area A = x(80 - 2x) = -2(x - 20)² + 800. The maximum occurs at x = 20, giving length 40 m and area 800 m².", "Do not include the river side in the fencing equation. Model the physical constraint before optimising.")
    ]);

  lessons.proofTechniques = rewriteExistingLesson(lessons.proofTechniques,
    "Proof is disciplined explanation. This lesson focuses on the logic around a proof: why examples are limited, why a conclusion cannot be assumed inside its own argument, how existence differs from uniqueness and how a single counterexample defeats a universal claim.",
    ["algebraicProof"], [
      teaching(["Examples help us discover patterns and test conjectures.", "A finite collection cannot prove a statement about infinitely many cases.", "A proof must use an arbitrary object or a complete exhaustion of all possible cases.", "Numerical checking remains useful for detecting errors and finding counterexamples.", "State clearly whether work is evidence, disproof or proof."], "Why do ten correct examples not prove that n² + n + 41 is always prime?", "Ten inputs leave infinitely many untested. Indeed n = 41 gives 41², which is composite.", "Do not use words such as ‘clearly always’ to bridge the gap from examples to a universal conclusion."),
      teaching(["Circular reasoning assumes the result it is meant to establish.", "It may disguise the assumption by restating it in equivalent words.", "A valid proof begins from definitions, established results or stated premises.", "Check whether any line depends on the final conclusion already being true.", "Rearranging an equation is valid only when the starting equation is independently known."], "Explain the flaw in: ‘Opposite angles are equal because this shape is a parallelogram, and it is a parallelogram because its opposite angles are equal.’", "Each claim is being used to justify the other, so neither has independent support. One fact must be established from a separate definition or theorem.", "Do not mistake two equivalent statements for a proof from one to the other when neither has been established."),
      teaching(["An existence proof shows that at least one object with the required property exists.", "A uniqueness proof shows that no second distinct object can have the property.", "Finding one example proves existence but says nothing about uniqueness.", "To prove uniqueness, assume two solutions and show they must be equal, or solve all cases completely.", "Questions may require existence, uniqueness or both. Match the argument to the wording."], "Show that there exists a prime number between 10 and 15. Does this prove uniqueness?", "The number 11 is prime, so existence is proved. It does not prove uniqueness because 13 is another prime in the interval.", "Do not write ‘the solution’ after finding one candidate unless every other possibility has been excluded."),
      teaching(["A universal statement claims that every permitted object has a property.", "One valid exception is a counterexample and makes the entire universal statement false.", "The counterexample must satisfy the hypothesis but fail the conclusion.", "A failed example outside the stated domain proves nothing.", "After finding a counterexample, explain both why it belongs to the claimed family and why the conclusion fails."], "Disprove: ‘If ab is divisible by 6, then both a and b are divisible by 6.’", "Take a = 2 and b = 3. Their product 6 is divisible by 6, but neither 2 nor 3 is divisible by 6.", "Do not offer a number that fails the hypothesis. A counterexample must enter the claim before it can break the conclusion.")
    ]);

  lessons.speedAndRelativeMotion = rewriteExistingLesson(lessons.speedAndRelativeMotion,
    "Motion problems become simpler when each rate is tied to a clear reference frame. We will build from distance = speed × time, then combine speeds for approaching and chasing before dealing carefully with average speed.",
    [{ module: "junior", key: "multiRate" }, "algebraicManipulation"], [
      teaching(["Speed tells us how much distance is covered per unit time.", "The relationship is distance = speed × time.", "Rearranging gives speed = distance/time and time = distance/speed.", "Convert units before substituting so every quantity uses compatible measures.", "Estimate whether the answer should be larger or smaller when speed changes."], "A cyclist travels 42 km at 24 km/h. Find the time in hours and minutes.", "Time = 42/24 = 1.75 hours. The decimal 0.75 hour is 45 minutes, so the time is 1 hour 45 minutes.", "Do not read 1.75 hours as 1 hour 75 minutes. Convert the decimal part using 60 minutes per hour."),
      teaching(["When two travellers move towards each other, the gap closes from both ends.", "Their relative speed is the sum of their speeds.", "Time to meet equals initial separation divided by closing speed.", "If one starts later, calculate the changed separation at the moment both are moving.", "After finding the meeting time, use either traveller's distance as a check."], "Two trains 315 km apart travel towards each other at 70 km/h and 56 km/h. When do they meet?", "Their closing speed is 126 km/h. Time = 315/126 = 2.5 hours.", "Do not subtract speeds merely because the travellers face opposite directions. Both motions reduce the gap."),
      teaching(["In a chase, both travellers move in the same direction.", "The faster traveller closes only the difference between their speeds each hour.", "The initial lead is the distance that must be closed.", "If the lead is given as a time advantage, convert it into distance using the slower speed.", "Check that the catcher's speed is greater. Otherwise the gap cannot close."], "A runner at 12 km/h starts 30 minutes before a cyclist at 24 km/h. How long after the cyclist starts are they caught?", "The runner's lead is 12 × 0.5 = 6 km. The closing speed is 24 - 12 = 12 km/h. Time = 6/12 = 0.5 hour, so 30 minutes.", "Do not divide the lead by the faster speed. The slower traveller continues moving during the chase."),
      teaching(["Average speed is total distance divided by total time.", "It is not generally the arithmetic mean of the speeds because different stages may last for different times.", "Calculate each stage's distance and time, then add totals.", "For equal distances at two speeds, the slower stage lasts longer and has greater influence.", "Include stops in total time when the question describes overall journey speed."], "A car travels 60 km at 30 km/h and returns 60 km at 60 km/h. Find its average speed.", "The outward time is 2 hours and return time is 1 hour. Total distance is 120 km and total time is 3 hours. Average speed is 40 km/h.", "Do not average 30 and 60 to get 45. The car spends twice as long at the lower speed.")
    ]);

  lessons.estimationAndBounds = rewriteExistingLesson(lessons.estimationAndBounds,
    "Measurements and rounded values describe intervals, not exact points. Bounds keep calculations honest by carrying those possible intervals through a problem. Standard form then helps us estimate and compare quantities across very different scales.",
    [{ module: "primary", key: "roundingEstimate" }, { module: "junior", key: "estimation" }], [
      teaching(["A length recorded as 8.2 cm to the nearest 0.1 cm could have come from many exact lengths.", "The halfway points are 8.15 and 8.25.", "The lower bound is included because 8.15 rounds to 8.2, while the upper bound is excluded because 8.25 rounds to 8.3.", "Write the interval as 8.15 ≤ L < 8.25.", "The unit of rounding determines the half-step. Nearest 10 has a half-step of 5; nearest 0.01 has a half-step of 0.005."], "A mass is 3.47 kg correct to the nearest 0.01 kg. State its error interval.", "The half-step is 0.005 kg, so 3.465 ≤ m < 3.475.", "Do not include the upper bound for ordinary rounding intervals. That endpoint rounds to the next stated value."),
      teaching(["To bound a calculation, choose input bounds that push the final result in the required direction.", "For a sum of positive quantities, the lower bound uses both lower bounds and the upper uses both uppers.", "For a positive quotient A/B, the greatest result uses the greatest numerator and smallest denominator.", "For a difference A - B, the greatest result uses the greatest A and smallest B.", "Write the optimisation choice before calculating. Blindly pairing all upper bounds often fails."], "A distance is 120 m to the nearest metre and a time is 15 s to the nearest second. Find the upper bound for speed.", "Distance is below 120.5 m and time is at least 14.5 s. Maximum speed uses 120.5/14.5, which is approximately 8.31 m/s.", "For division, do not automatically use both upper bounds. A smaller positive denominator makes the quotient larger."),
      teaching(["Standard form writes a non-zero number as a × 10^n with 1 ≤ |a| < 10.", "The exponent records place-value scale, while a carries the significant digits.", "For estimation, round each coefficient to one significant figure and keep powers of ten exact.", "Combine powers using index laws before normalising the coefficient back into the permitted range.", "Use estimation to check calculator results. A power-of-ten error often signals a misplaced decimal or incorrect exponent law."], "Estimate (6.2 × 10^7)(3.8 × 10^-4)/(1.9 × 10²).", "Round to (6 × 10^7)(4 × 10^-4)/(2 × 10²). Coefficients give 12 and powers give 10^(7-4-2) = 10. The estimate is 12 × 10 = 120, or 1.2 × 10².", "Do not leave a standard-form coefficient outside the interval from 1 up to but not including 10.")
    ]);

  lessons.coordinateGeometry = rewriteExistingLesson(lessons.coordinateGeometry,
    "Coordinate geometry translates pictures into equations. Differences in coordinates describe movement, averages locate centres and gradients describe direction. Keeping the geometric meaning visible prevents the formulas from becoming disconnected rules.",
    [{ module: "junior", key: "coordGeom" }, "simultaneousEquations"], [
      teaching(["Moving from one point to another changes x horizontally and y vertically.", "Gradient compares vertical change with horizontal change: Δy/Δx.", "Use the same point order in both differences.", "A negative gradient means the line falls as x increases.", "Vertical lines have zero horizontal change, so their gradient is undefined."], "Find the gradient from A(-4, 7) to B(6, -3).", "Δy = -10 and Δx = 10, so the gradient is -1.", "Do not call the gradient of a vertical line zero. Division by zero is undefined."),
      teaching(["The midpoint lies halfway between two endpoints in both coordinate directions.", "Average the x-coordinates to find its horizontal position.", "Average the y-coordinates separately to find its vertical position.", "The formula is ((x₁+x₂)/2, (y₁+y₂)/2).", "Reverse problems use the fact that the midpoint coordinate is half the endpoint sum."], "A has coordinates (-3, 8) and midpoint M is (4, 1). Find B.", "For x, (-3 + x_B)/2 = 4, so x_B = 11. For y, (8 + y_B)/2 = 1, so y_B = -6. Thus B = (11, -6).", "Do not average an x-coordinate with a y-coordinate. Each direction is handled independently."),
      teaching(["The equation y = mx + c describes every point on a non-vertical straight line.", "The gradient m controls the line's direction and steepness.", "The intercept c is the y-value where x = 0.", "Given a point and gradient, substitute them to find c.", "A vertical line needs the different form x = constant."], "Find the equation of the line with gradient -2 through (3, 5).", "Use y = -2x + c. Substitute 5 = -6 + c, so c = 11. The equation is y = -2x + 11.", "Do not substitute a point and then leave x and y in the final equation. Their values are used only to determine the constant."),
      teaching(["Parallel lines point in the same direction and therefore have equal gradients.", "Perpendicular lines meet at 90°.", "For non-vertical perpendicular lines, the gradients are negative reciprocals and multiply to -1.", "Find the required gradient before using a known point to determine the equation.", "Horizontal and vertical lines are a special perpendicular pair."], "Find the line perpendicular to y = 3x - 4 that passes through (6, 1).", "The perpendicular gradient is -1/3. Use y = -x/3 + c and substitute (6,1): 1 = -2 + c, so c = 3. The line is y = -x/3 + 3.", "Do not merely change the sign of a gradient. Perpendicularity requires the reciprocal as well.")
    ]);

  lessons.similarShapesAndScaleFactors = rewriteExistingLesson(lessons.similarShapesAndScaleFactors,
    "Similar shapes have the same angles and the same proportions, though their sizes may differ. One length scale factor controls every corresponding length. Area and volume then respond with square and cube powers because they measure two and three dimensions.",
    [{ module: "primary", key: "ratioBasics" }, { module: "primary", key: "shapeProperties" }], [
      teaching(["A photograph enlarged without distortion keeps the same shape.", "Corresponding lengths all multiply by one constant scale factor.", "Scale factor equals new length divided by original corresponding length.", "Match corresponding sides using angles and positions, not simply their apparent orientation.", "Once the factor is known, multiply every original length by it."], "Two similar triangles have corresponding sides 8 cm and 14 cm. A second side of the smaller triangle is 12 cm. Find its match.", "The scale factor is 14/8 = 7/4. The matching side is 12 × 7/4 = 21 cm.", "Do not compare non-corresponding sides. The ratio is constant only for matched measurements."),
      teaching(["Area covers two dimensions.", "If every length multiplies by k, both a horizontal and vertical measurement multiply by k.", "The area therefore multiplies by k².", "An area scale factor is not the same as a length scale factor unless k is 0 or 1.", "Use square roots to recover a positive length scale factor from an area factor."], "Similar shapes have length scale factor 3/2. A smaller area is 40 cm². Find the larger area.", "The area scale factor is (3/2)² = 9/4. The larger area is 40 × 9/4 = 90 cm².", "Do not multiply area by the length factor only once. Area contains two scaled dimensions."),
      teaching(["Volume measures three-dimensional space.", "Scaling a solid multiplies length, width and height by k.", "The volume scale factor is therefore k³.", "Surface area still uses k² because each face is two-dimensional.", "Keep surface area and volume factors separate when both appear in one problem."], "Two similar solids have length scale factor 5/3. The smaller volume is 81 cm³. Find the larger volume.", "The volume factor is (5/3)³ = 125/27. The larger volume is 81 × 125/27 = 375 cm³.", "Do not use k³ for surface area. The power matches the dimension of the measurement."),
      teaching(["Sometimes area or volume information is given and a length is required.", "Undo a square by taking a square root and undo a cube by taking a cube root.", "Use the positive root for ordinary geometric lengths.", "After recovering the length factor, apply it to corresponding lengths in the requested direction.", "Check whether the given ratio is larger-to-smaller or smaller-to-larger before multiplying."], "Two similar solids have volumes in ratio 343:64. Find their length ratio and surface-area ratio.", "Cube root 343:64 to get length ratio 7:4. Square that length ratio to get surface-area ratio 49:16.", "Do not take a square root of a volume ratio. Volume uses three dimensions, so use a cube root.")
    ]);

  lessons.circleTheoremsAndTangents = rewriteExistingLesson(lessons.circleTheoremsAndTangents,
    "Circle theorems are relationships forced by points sharing one circle. Each theorem has a precise diagram condition. The safest method is to identify the chord, diameter, centre or tangent involved before using any angle rule.",
    [{ module: "junior", key: "angleParallel" }, { module: "junior", key: "angleIso" }], [
      teaching(["A diameter joins two points on a circle and passes through the centre.", "Join any third point on the circumference to the diameter's endpoints.", "The angle at that third point is always 90°.", "The theorem requires the line across the circle to be a diameter, not merely a chord.", "It also works in reverse: a right angle at the circumference subtends a diameter."], "AB is a diameter and C lies on the circle. If angle CAB is 34°, find angle CBA.", "Angle ACB is 90°. Triangle angles total 180°, so angle CBA = 180° - 90° - 34° = 56°.", "Do not place the 90° angle at the centre or at an endpoint of the diameter. It is at the circumference opposite the diameter."),
      teaching(["Choose a chord with endpoints A and B.", "The angle AOB at the centre and angle ACB at the circumference stand on the same chord AB.", "The angle at the centre is twice the angle at the circumference.", "Both angles must subtend the same arc for the relationship to apply.", "Mark the relevant endpoints before deciding which angle is double."], "An angle at the circumference standing on chord AB is 47°. Find the angle at the centre standing on the same chord.", "The central angle is twice 47°, so it is 94°.", "Do not double an angle merely because one vertex is at the centre. Confirm both angles use the same two chord endpoints."),
      teaching(["Two circumference points can look towards the same chord.", "If their vertices lie in the same segment, the angles formed by joining them to the chord endpoints are equal.", "The shared chord is the anchor for recognising the theorem.", "The theorem can transfer a known angle to a distant part of a diagram.", "Vertices on opposite sides of the chord require different reasoning and may form supplementary angles."], "Points C and D lie in the same segment of a circle, and both angles ACB and ADB stand on chord AB. If angle ACB = 63°, find angle ADB.", "Angles in the same segment standing on the same chord are equal, so angle ADB = 63°.", "Do not rely on the angles looking alike. Name the common chord and check the vertices lie in the same segment.", "intermediate-circle-theorem"),
      teaching(["A cyclic quadrilateral has all four vertices on one circle.", "Each pair of opposite angles stands on arcs that together make the full circle.", "Opposite angles therefore sum to 180°.", "This property also provides a reverse test: if opposite angles sum to 180°, the quadrilateral is cyclic.", "Identify opposite rather than adjacent angles before subtracting."], "A cyclic quadrilateral has angles 3x + 10° and 5x - 6° opposite each other. Find x.", "Opposite angles sum to 180°: 3x + 10 + 5x - 6 = 180. Thus 8x = 176 and x = 22.", "Do not set adjacent angles to total 180° unless another property, such as parallel lines, justifies it."),
      teaching(["A tangent touches a circle at exactly one point.", "The radius drawn to that point is perpendicular to the tangent.", "This creates a right angle that often unlocks a triangle calculation.", "Two tangents from the same external point have equal lengths.", "Name the point of contact so the correct radius and tangent are paired."], "From external point P, tangents PA and PB touch a circle at A and B. If PA = 3x + 2 and PB = 5x - 12, find x and the tangent length.", "Tangents from P are equal, so 3x + 2 = 5x - 12. Then 14 = 2x, x = 7 and each tangent is 23.", "Do not say every tangent has the same length. Equality applies to the two tangents drawn from one common external point.")
    ]);

  lessons.trigonometryAdvanced = rewriteExistingLesson(lessons.trigonometryAdvanced,
    "Trigonometry connects the angles and side lengths of triangles. The formulas are useful, but choosing the right formula matters more than memorising symbols. Begin by deciding whether the triangle is right-angled, label the known information and identify exactly what the question asks you to find.",
    [{ module: "junior", key: "pythagQuest" }, { module: "junior", key: "angleIso" }, "algebraicManipulation"], [
      teaching(["In a right-angled triangle, the hypotenuse is always the side opposite the right angle.", "The opposite side is across from the angle you are using, while the adjacent side touches that angle but is not the hypotenuse.", "SOHCAHTOA matches sine with opposite over hypotenuse, cosine with adjacent over hypotenuse and tangent with opposite over adjacent.", "Choose the ratio containing the side you know and the side you need.", "If the unknown is an angle, use the inverse trigonometric button on your calculator and give the requested degree of accuracy."], "A right-angled triangle has hypotenuse 13 cm and an angle of 38°. Find the side opposite the 38° angle.", "Use sine because opposite and hypotenuse are involved: sin 38° = x/13. Therefore x = 13 sin 38° ≈ 8.00 cm.", "Do not label sides from the triangle's appearance. Opposite and adjacent depend on the chosen angle.", "intermediate-trig-triangle"),
      teaching(["The sine rule works in any triangle when you know a side and its opposite angle as a complete pair.", "Write each side above the sine of the angle directly opposite it.", "Use two matching pairs only, leaving the required value as the unknown.", "Cross-multiply or rearrange carefully, then calculate.", "When finding an angle, remember that sine can produce an ambiguous second angle in some non-right-angled triangles, so check whether another solution fits the triangle."], "In triangle ABC, a = 9 cm, angle A = 42° and angle B = 71°. Find side b.", "Use b/sin 71° = 9/sin 42°. Thus b = 9 sin 71°/sin 42° ≈ 12.7 cm.", "Do not pair a side with an angle beside it. Each side must be matched with the angle directly opposite."),
      teaching(["The cosine rule links all three sides with one angle.", "Use it when three sides are known and an angle is required, or when two sides and their included angle are known and the third side is required.", "For side a opposite angle A, write a² = b² + c² - 2bc cos A.", "The minus sign is part of the rule and the angle must be between sides b and c.", "When finding an angle, rearrange for cos A first and then use inverse cosine."], "Two sides of a triangle are 8 cm and 11 cm, and the angle between them is 57°. Find the third side.", "Let the third side be a. Then a² = 8² + 11² - 2(8)(11)cos 57° ≈ 89.15. Therefore a ≈ √89.15 ≈ 9.44 cm.", "Do not use the sine rule when no complete opposite side-angle pair is known. The cosine rule is designed for this information."),
      teaching(["The area formula 1/2 ab sin C finds the area when two sides and their included angle are known.", "The letters a and b name the two side lengths, while C is the angle between those particular sides.", "The sine factor measures how much perpendicular height one side creates relative to the other.", "Check that the calculator is in degree mode before evaluating the sine.", "If the area and two sides are given, rearrange the formula to find the sine of the included angle, then consider whether one or two angles are possible."], "A triangular field has sides 18 m and 25 m with an included angle of 64°. Find its area.", "Area = 1/2 × 18 × 25 × sin 64° ≈ 202.2 m².", "Do not use an angle that is not between the two chosen sides. The formula requires the included angle.")
    ]);

  lessons.threeDGeometryAndNets = rewriteExistingLesson(lessons.threeDGeometryAndNets,
    "Three-dimensional geometry asks us to reason about objects that have length, width and height. A careful sketch or net turns a solid into familiar two-dimensional shapes. Before calculating, decide whether the question asks for covering on the outside, space inside or the way faces join together.",
    [{ module: "primary", key: "areaPerimeter" }, { module: "primary", key: "unitConversion" }, { module: "junior", key: "cubeProps" }], [
      teaching(["Surface area is the total area of every outside face of a solid.", "A net is useful because it lays those faces flat where they can be counted and measured.", "Name the shape of each face, calculate its area and include every matching copy.", "For a cuboid, opposite faces occur in equal pairs, giving 2lw + 2lh + 2wh.", "Keep square units because surface area is still an area, even though it belongs to a three-dimensional object."], "A cuboid measures 8 cm by 5 cm by 3 cm. Find its surface area.", "The three different face areas are 8×5 = 40, 8×3 = 24 and 5×3 = 15. Each occurs twice, so the total is 2(40 + 24 + 15) = 158 cm².", "Do not calculate the volume when the question asks how much material covers the outside."),
      teaching(["A prism has the same cross-section all the way along its length.", "Imagine slicing it perpendicular to its length: every slice has the same shape and area.", "Volume equals cross-sectional area multiplied by prism length.", "Find the complete cross-sectional area first, including any composite pieces or subtractions.", "The final unit is cubic because area units are multiplied by a length unit."], "A triangular prism has a triangular cross-section with base 7 cm and perpendicular height 4 cm. The prism is 12 cm long. Find its volume.", "The cross-sectional area is 1/2 × 7 × 4 = 14 cm². Multiply by the length: 14 × 12 = 168 cm³.", "Do not use the sloping side as the perpendicular height of a triangular cross-section unless it truly meets the base at 90°."),
      teaching(["A cylinder is a prism whose constant cross-section is a circle.", "The circular cross-sectional area is πr².", "Multiplying by the cylinder's perpendicular height gives V = πr²h.", "Use the radius, which is half the diameter, and square it before multiplying by height.", "Leave answers in terms of π when an exact value is requested, otherwise round only at the end."], "A cylinder has diameter 10 cm and height 14 cm. Find its exact volume and a decimal approximation.", "The radius is 5 cm. Volume = π × 5² × 14 = 350π cm³, which is approximately 1099.6 cm³.", "Do not substitute the diameter for r. Doing so makes the circular area four times too large."),
      teaching(["A net must contain exactly the faces of the solid and those faces must meet along suitable edges.", "Imagine choosing one face as a base and folding each neighbouring face upwards.", "Track which edges meet after folding and check that no faces overlap.", "For cubes, six squares are necessary but not every arrangement of six joined squares is a valid cube net.", "Marking opposite faces or tracing a corner can make a difficult folding question more concrete."], "A cube net has four squares in a row, with one square above the second and one below the second. Will it fold into a cube?", "Yes. The four squares form the side band, while the upper and lower squares close the two remaining faces without overlapping.", "Do not decide from the number of squares alone. Their arrangement determines whether the solid closes correctly.")
    ]);

  lessons.multiStepGeometryProof = rewriteExistingLesson(lessons.multiStepGeometryProof,
    "A long geometry problem is usually a chain of short familiar facts. The challenge is seeing which fact can be used first and recording enough reasons that another reader can follow the chain. Work from what the diagram definitely gives you, not from what you hope the final answer will be.",
    ["circleTheoremsAndTangents", "trigonometryAdvanced", "algebraicProof"], [
      teaching(["Begin by inventorying the diagram before calculating.", "Look for equal radii, parallel lines, right angles, tangents, diameters, cyclic quadrilaterals, isosceles triangles and similar shapes.", "Add only facts supported by labels or stated conditions.", "A hidden shape becomes useful when you can name both the shape and the property it provides.", "This first scan often reveals the opening step of the proof."], "A diagram contains a circle with centre O, tangent PT at T and chord AB parallel to PT. Name three useful facts before calculating any angle.", "OT is perpendicular to PT, angles can transfer between AB and PT because they are parallel, and triangles containing two radii may be isosceles.", "Do not assume a diagram is drawn accurately. A line that looks parallel or equal needs a mark or a statement."),
      teaching(["Write down the facts you know and ask what each one unlocks immediately.", "A proof moves forward from evidence: given fact, named rule, new conclusion.", "If a desired angle depends on another unknown angle, find the earlier angle first.", "Keep each deduction small enough to justify in one sentence.", "When stuck, work backwards privately to identify a helpful intermediate result, then prove that result forwards from the givens."], "AB is a diameter of a circle, C lies on the circle and angle BAC = 28°. Prove that angle BOC, at the centre, is 56°.", "Angle BAC and angle BOC stand on the same chord BC. The angle at the centre is twice the angle at the circumference, so angle BOC = 2 × 28° = 56°.", "Do not begin by writing the target result as though it were known. Every line must follow from an established fact."),
      teaching(["Label every angle you discover directly on a sketch or with a clear name.", "Give a reason beside each value, such as alternate angles, angles in a triangle or radii form an isosceles triangle.", "Consistent labels prevent two different angles from being treated as the same unknown.", "Algebra can then connect labelled angles through equations.", "A complete solution is not just a list of numbers: it is a trail of justified deductions."], "In isosceles triangle ABC, AB = AC. The exterior angle at C is 124°. Find angle A and justify each step.", "The interior angle C is 180° - 124° = 56° because angles on a straight line total 180°. Base angles B and C are equal, so B = 56°. Therefore A = 180° - 56° - 56° = 68°.", "Do not write 'obvious from the diagram'. State the angle rule or shape property that makes the step true."),
      teaching(["A sanity check tests whether the completed result is geometrically possible.", "Triangle angles must total 180°, angles around a point total 360° and lengths must be positive.", "An obtuse angle should look larger than 90°, though appearance alone is not proof.", "Substitute algebraic answers back into every angle expression and confirm all conditions.", "If the check fails, trace the chain backwards to the first unsupported or arithmetically incorrect step."], "A solution gives the angles of a triangle as x + 20°, 2x + 10° and 4x - 25°. Find x and check the result.", "Their sum is 180°: 7x + 5 = 180, so x = 25. The angles are 45°, 60° and 75°. They are positive and total 180°, so the result is consistent.", "Do not treat checking as optional decoration. It is how you catch a plausible-looking mistake before accepting it.")
    ]);

  lessons.statisticsAdvanced = rewriteExistingLesson(lessons.statisticsAdvanced,
    "Statistical diagrams compress a large set of data into a picture. To read them well, first ask what each axis, boundary and area represents. A graph is not merely a shape: every position has a precise meaning connected to frequency, spread or proportion.",
    [{ module: "primary", key: "ratioBasics" }, { module: "junior", key: "meanPuzzle" }, "ratioProportionAlgebraic"], [
      teaching(["A box plot displays the minimum, lower quartile, median, upper quartile and maximum.", "These five values split ordered data into four quarters.", "The box runs from the lower to upper quartile and its width is the interquartile range.", "The median line shows the central value, while the whiskers extend to the extremes.", "When comparing groups, discuss both a typical value such as the median and a measure of spread such as the interquartile range."], "A box plot has lower quartile 18, median 27 and upper quartile 39. Find the interquartile range and interpret it.", "IQR = 39 - 18 = 21. The middle half of the data spans 21 units.", "Do not use maximum minus minimum for the interquartile range. That calculation gives the full range."),
      teaching(["Cumulative frequency is a running total of how many observations are at or below a boundary.", "Each plotted point uses an upper class boundary and the cumulative total reached there.", "The curve can estimate the median at half the total frequency.", "Lower and upper quartiles are read at one quarter and three quarters of the total.", "Read horizontally from the required cumulative frequency to the curve, then vertically to the data axis."], "A cumulative frequency graph represents 80 values. At cumulative frequencies 20, 40 and 60, the graph gives values 14, 23 and 31. State Q1, the median, Q3 and the IQR.", "Q1 = 14, median = 23 and Q3 = 31. Therefore IQR = 31 - 14 = 17.", "Do not read quartiles at 25, 50 and 75 on the frequency axis unless the total frequency is 100."),
      teaching(["A histogram is used for grouped continuous data, especially when class widths differ.", "The horizontal axis shows class intervals and the vertical axis shows frequency density.", "Frequency density equals frequency divided by class width.", "This makes bar area, not bar height alone, represent frequency.", "Class boundaries must touch because continuous intervals leave no gaps."], "A class interval 10 < x ≤ 16 contains 27 values. Find its frequency density.", "The class width is 16 - 10 = 6. Frequency density = 27/6 = 4.5.", "Do not treat a histogram as an ordinary bar chart. Unequal class widths make height alone misleading."),
      teaching(["To recover frequency from a histogram, multiply frequency density by class width.", "Think of this as rectangle area: width × height.", "For a total across several classes, calculate each bar's area and then add.", "If the vertical scale is missing but one class frequency is known, use that class to establish the scale first.", "Keep exact values during the calculation so small rounding errors do not accumulate."], "A histogram class from 20 to 35 has frequency density 2.4. Another class from 35 to 45 has density 3.1. Find the combined frequency.", "The first frequency is 15 × 2.4 = 36. The second is 10 × 3.1 = 31. The combined frequency is 67.", "Do not add the bar heights to find a total frequency. Add their areas.", "intermediate-histogram-area")
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
