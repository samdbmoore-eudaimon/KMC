const ex = (q, steps, answer) => ({ q, steps, answer });
const sec = (h, body, examples, tryit, note) => ({ h, body, examples, tryit, note });

export function applyJuniorFractionProgression(lessons) {
  lessons.fractionUnusual = {
    title: "Fraction Fluency: extending the Primary toolkit",
    order: lessons.fractionUnusual?.order,
    prereq: [
      { module: "primary", key: "fractionOfQuantity" },
      { module: "primary", key: "fractionEquivalence" },
      { module: "primary", key: "fractionArithmetic" }
    ],
    intro: "Fractions are taught throughout Primary school, so this lesson does not pretend they are new. We begin with a short check of the essential toolkit and provide links to the full Primary explanations. We then extend fractions into negative numbers, general division, order of operations, algebra and proportional reasoning. These are the ideas that make fractions important in secondary mathematics.",
    sections: [
      sec("1. Check the Primary fraction toolkit", [
        "Before extending an idea, make sure its foundations are secure. You should recognise equivalent fractions, simplify using common factors and change between improper fractions and mixed numbers.",
        "For addition and subtraction, the pieces must have a common size. This means finding a common denominator before combining the numerators.",
        "For multiplication, multiply numerators and denominators, cancelling common factors when useful. Dividing a fraction by a whole number is the same as multiplying by the reciprocal of that whole number.",
        "Fractions, decimals and percentages can name the same value. Converting them into a common form makes comparisons possible.",
        "If any of these ideas feels uncertain, use the Primary lesson buttons above. Returning to a foundation is a sensible mathematical choice, not a step backwards."
      ], [
        ex("Simplify 18/24.", ["The highest common factor of 18 and 24 is 6.", "Divide both numbers by 6."], "3/4."),
        ex("Work out 2/3 + 1/4.", ["Use denominator 12.", "2/3 = 8/12 and 1/4 = 3/12.", "Add the numerators."], "11/12."),
        ex("Work out 3/5 × 10/21.", ["Cancel 3 with 21 and 5 with 10.", "Multiply 1/1 × 2/7."], "2/7."),
        ex("Order 5/8, 0.61 and 63%.", ["Convert to decimals: 0.625, 0.61 and 0.63.", "Compare the thousandths."], "0.61, 5/8, 63%.")
      ], { q: "Work out 7/9 - 1/6 and simplify.", answer: "11/18. Use denominator 18: 14/18 - 3/18." }, "Do not rush into the new material if common denominators are still uncertain. Use the linked Primary lesson first."),

      sec("2. Positive and negative fractions", [
        "A negative fraction is an ordinary fraction located below zero on the number line. The negative sign can be written before the fraction, in the numerator or in the denominator: -3/4, (-3)/4 and 3/(-4) have the same value.",
        "Two negative signs cancel because dividing a negative number by another negative number gives a positive result. Thus (-3)/(-4) = 3/4.",
        "When ordering negative fractions, numbers farther left on the number line are smaller. This reverses an easy visual instinct: -3/4 is smaller than -1/2 because -0.75 lies left of -0.5.",
        "Addition and subtraction follow the same signed-number rules used with integers. A common denominator is still required.",
        "For multiplication and division, decide the sign separately from the size: matching signs give a positive answer and different signs give a negative answer."
      ], [
        ex("Write an equivalent positive form of (-5)/(-8).", ["A negative divided by a negative is positive.", "Remove both negative signs."], "5/8."),
        ex("Which is smaller, -2/3 or -3/5?", ["Use denominator 15: -2/3 = -10/15 and -3/5 = -9/15.", "-10/15 lies farther left."], "-2/3 is smaller."),
        ex("Work out -3/4 + 5/6.", ["Use denominator 12.", "-3/4 = -9/12 and 5/6 = 10/12.", "Add the signed numerators."], "1/12."),
        ex("Work out (-7/9) × (6/-35).", ["There are two negative signs, so the answer is positive.", "Cancel 7 with 35 and 6 with 9.", "Multiply 1/3 × 2/5."], "2/15.")
      ], { q: "Work out -5/6 - 1/4.", answer: "-13/12, or -1 and 1/12. Use denominator 12." }, "A larger negative magnitude means a smaller number. For example, -9 is smaller than -2."),

      sec("3. Dividing by a fraction and understanding the reciprocal", [
        "The calculation 3 ÷ 1/4 asks how many quarter-sized pieces fit into 3 wholes. There are 4 quarters in each whole, so 12 quarters fit altogether.",
        "This explains why dividing by a proper positive fraction makes the answer larger. The divisor is a small unit, so many copies of it fit into the starting amount.",
        "The reciprocal of a non-zero fraction swaps its numerator and denominator. The reciprocal of 2/5 is 5/2 because 2/5 × 5/2 = 1.",
        "Dividing by a number is equivalent to multiplying by the number that reverses it. Therefore dividing by 2/5 is the same as multiplying by 5/2.",
        "Use the repeatable method: keep the first fraction, replace division with multiplication, take the reciprocal of the second fraction, then simplify."
      ], [
        ex("Work out 2 ÷ 1/2.", ["Write 2 as 2/1.", "Multiply by the reciprocal 2/1.", "Calculate 4/1."], "4."),
        ex("Work out 6 ÷ 3/4.", ["Write 6 as 6/1.", "Multiply by 4/3.", "Cancel 6 with 3."], "8."),
        ex("Work out 2/3 ÷ 4/9.", ["Multiply 2/3 by 9/4.", "Cancel 9 with 3 and 2 with 4.", "Multiply what remains."], "3/2, or 1 and 1/2."),
        ex("How many pieces of ribbon, each 3/8 m long, can be cut from 4 and 1/2 m?", ["Convert 4 and 1/2 to 9/2.", "Calculate 9/2 ÷ 3/8 = 9/2 × 8/3.", "Cancel and multiply."], "12 pieces.")
      ], { q: "Work out -5/6 ÷ 10/3.", answer: "-1/4. Multiply -5/6 by 3/10 and simplify." }, "Never take the reciprocal of the first fraction. It is the divisor, the second number, whose reciprocal is used."),

      sec("4. Mixed numbers in all four operations", [
        "A mixed number is useful for describing an amount, but an improper fraction is usually easier to calculate with. Convert mixed numbers before multiplying or dividing.",
        "For addition and subtraction, you may convert everything to improper fractions or work with whole and fractional parts. Converting is often safer when subtraction requires regrouping.",
        "To convert 2 and 3/5, count the fifths: two wholes contain 10 fifths and another 3 gives 13/5.",
        "After calculating, simplify and convert an improper result back to a mixed number if that makes the answer easier to interpret.",
        "Estimate before calculating. For example, 2 and 1/2 × 1 and 3/4 should be a little less than 2.5 × 2 = 5."
      ], [
        ex("Work out 1 and 1/2 + 2 and 1/4.", ["Convert to 3/2 + 9/4.", "Use denominator 4: 6/4 + 9/4 = 15/4."], "3 and 3/4."),
        ex("Work out 3 and 1/5 - 1 and 3/4.", ["Convert to 16/5 - 7/4.", "Use denominator 20: 64/20 - 35/20 = 29/20."], "1 and 9/20."),
        ex("Work out 2 and 1/3 × 1 and 1/2.", ["Convert to 7/3 × 3/2.", "Cancel the factor 3.", "Multiply."], "7/2, or 3 and 1/2."),
        ex("Work out 4 and 1/5 ÷ 1 and 2/5.", ["Convert to 21/5 ÷ 7/5.", "Multiply 21/5 by 5/7.", "Cancel 5 and simplify 21/7."], "3.")
      ], { q: "Work out 2 and 3/4 × 1 and 1/3.", answer: "3 and 2/3. Convert to 11/4 × 4/3 = 11/3." }, "Do not multiply the whole parts and fractional parts separately. A mixed number represents one combined value."),

      sec("5. Fractions with brackets and powers", [
        "Fraction calculations obey the ordinary order of operations. Work inside brackets first, then deal with powers, followed by multiplication or division and finally addition or subtraction.",
        "A power applies to every factor inside its base. Therefore (2/3)² = 2²/3² = 4/9.",
        "Without brackets, -2² means the negative of 2², which is -4. In contrast, (-2)² is positive 4 because the negative number itself is squared.",
        "Keep exact fractions during a multi-step calculation. Changing to rounded decimals can lose information and make an exact answer impossible.",
        "Use one line for each stage so that signs, brackets and common denominators remain visible."
      ], [
        ex("Work out (1/2)².", ["Square the numerator and denominator.", "1²/2² = 1/4."], "1/4."),
        ex("Work out 1/2 + 3/4 × 2/3.", ["Multiply first: 3/4 × 2/3 = 1/2.", "Then add 1/2 + 1/2."], "1."),
        ex("Work out (2/3 - 1/4) ÷ 5/6.", ["Inside brackets, use denominator 12: 8/12 - 3/12 = 5/12.", "Divide by multiplying by 6/5.", "Cancel and simplify."], "1/2."),
        ex("Compare -3²/4 with (-3/2)².", ["-3²/4 means -(3²)/4 = -9/4.", "(-3/2)² = 9/4."], "The first is -9/4 and the second is 9/4.")
      ], { q: "Work out (3/5)² + 2/25.", answer: "11/25. The square is 9/25, then add 2/25." }, "Brackets decide whether a negative sign is included in a power. Read the written expression precisely."),

      sec("6. Fractions in algebra", [
        "In algebra, a fraction can be a coefficient, an operator or an entire expression. The term 3x/5 means three fifths of x.",
        "Substitution works exactly as it does with whole-number coefficients. Replace the letter with its value, keep the brackets and then calculate in the correct order.",
        "To solve an equation containing a numerical fraction, use inverse operations. Multiplying both sides by the denominator often clears the fraction.",
        "An algebraic fraction has an expression in its numerator, denominator or both. Its denominator can never equal zero because division by zero is undefined.",
        "Simplifying algebraic fractions relies on factors. You may cancel common factors, but not separate terms joined by addition."
      ], [
        ex("Find 3x/5 when x = 10.", ["Substitute 10 for x.", "Calculate 3 × 10 ÷ 5."], "6."),
        ex("Solve x/4 = 7.", ["Multiply both sides by 4.", "The division by 4 is undone."], "x = 28."),
        ex("Solve 3x/5 - 2 = 7.", ["Add 2 to both sides to get 3x/5 = 9.", "Multiply by 5 to get 3x = 45.", "Divide by 3."], "x = 15."),
        ex("Simplify 6x²/(9x), where x is not zero.", ["Factor the numerical parts and cancel 3.", "Cancel one factor x from x² and x."], "2x/3.")
      ], { q: "Solve 5x/6 = 20.", answer: "x = 24. Multiply by 6, then divide by 5." }, "You can cancel factors, not terms. In (x + 3)/x, the x in the denominator is not a factor of the entire numerator."),

      sec("7. Fractions as operators, ratios and proportions", [
        "A fraction acts as an operator when it transforms an input. Multiplying by 3/4 means divide by 4 and multiply by 3, or multiply by 3 and divide by 4.",
        "The same multiplicative relationship can often be written as a fraction or a ratio. If red and blue counters are in ratio 3:5, the number of red counters is 3/5 of the number of blue counters.",
        "Be careful to distinguish a part-to-part fraction from a part-to-whole fraction. In a 3:5 red-to-blue ratio, 3/5 compares red with blue, but red counters are 3/8 of the total.",
        "Direct proportion keeps a constant multiplier. If y is always 3/4 of x, then y = 3x/4 and y/x = 3/4 whenever x is non-zero.",
        "These links allow fraction reasoning to solve scale, recipe, rate and comparison problems."
      ], [
        ex("If y is 2/3 of x and x = 18, find y.", ["Use 2/3 as an operator on 18.", "18 ÷ 3 × 2 = 12."], "12."),
        ex("Red and blue counters are in ratio 3:5. What fraction of all the counters are red?", ["There are 3 + 5 = 8 equal ratio parts altogether.", "Red occupies 3 of those parts."], "3/8."),
        ex("A map scale is 1:25,000. Write the map length as a fraction of the real length.", ["One map unit represents 25,000 real units.", "The map-to-real multiplier is 1/25,000."], "1/25,000."),
        ex("A quantity y is 5/8 of x. If y = 35, find x.", ["Write 5x/8 = 35.", "Multiply by 8 and divide by 5."], "x = 56.")
      ], { q: "The ratio of cats to dogs is 4:7. What fraction of the animals are dogs?", answer: "7/11, because there are 11 ratio parts altogether." }, "Always identify what the denominator represents. A comparison with another part and a fraction of the whole are different quantities."),

      sec("8. Multi-step fraction reasoning", [
        "Challenge problems rarely announce the required fraction technique. Begin by identifying the whole and translating each sentence into a mathematical operation.",
        "When a fraction is taken from what remains, its whole has changed. If one quarter of a collection is removed, then one third of the remainder is removed, the second fraction applies to the remaining three quarters, not to the original whole.",
        "Choose a convenient representation. Fractions preserve exact values, ratios show relative parts and decimals can make comparisons quick.",
        "Work one change at a time and label intermediate values. This prevents a fraction from being applied to the wrong starting amount.",
        "Finish by checking bounds. A remaining fraction should lie between 0 and 1, while a count must fit the context and often needs to be a whole number."
      ], [
        ex("A bottle is 3/4 full. One third of its contents is poured out. What fraction of the bottle remains full?", ["One third is removed, so two thirds of the contents remain.", "Calculate 2/3 × 3/4.", "Cancel and simplify."], "1/2."),
        ex("Maya spends 2/5 of her money, then spends 1/4 of what remains. What fraction remains?", ["After the first purchase, 3/5 remains.", "After the second, 3/4 of that remainder remains.", "Calculate 3/4 × 3/5."], "9/20."),
        ex("A class has 3/5 as many laptops as pupils. One quarter of the laptops are being repaired. What fraction of the pupil count is represented by working laptops?", ["Three quarters of the laptops work.", "Find 3/4 of 3/5."], "9/20 of the pupil count."),
        ex("A tank is 2/3 full. After 18 litres are added, it is 5/6 full. Find the tank's capacity.", ["The increase is 5/6 - 2/3 = 1/6 of the tank.", "If 1/6 is 18 litres, multiply by 6."], "108 litres.")
      ], { q: "A book is read over two days. On day one, 2/7 is read. On day two, 3/5 of the remainder is read. What fraction is unread?", answer: "2/7. After day one, 5/7 remains. Day two leaves 2/5 of that, so 2/5 × 5/7 = 2/7." }, "The word ‘remaining’ changes the whole for the next fraction. Do not add fractions that refer to different starting amounts."),
    ],
    recap: [
      "Primary fraction methods remain the foundation, and the linked lessons are available whenever a refresher is needed.",
      "Negative fractions follow the same number-line and sign rules as negative integers.",
      "Dividing by a non-zero fraction means multiplying by its reciprocal because the reciprocal undoes multiplication by that fraction.",
      "Convert mixed numbers to improper fractions before multiplication and division.",
      "Brackets, powers and signs matter in fraction calculations.",
      "Fractions can be coefficients, operators and expressions in algebra.",
      "A ratio can describe part-to-part or part-to-whole relationships, so identify the comparison carefully.",
      "In multi-step problems, identify the whole again whenever the situation changes."
    ],
    mistakes: [
      "Treating a more negative fraction as though it were larger.",
      "Taking the reciprocal of the first fraction instead of the divisor.",
      "Calculating separately with the whole and fractional parts of a mixed number.",
      "Ignoring brackets when a negative fraction is raised to a power.",
      "Cancelling terms joined by addition instead of cancelling common factors.",
      "Confusing a part-to-part ratio with a fraction of the total.",
      "Applying every fraction in a multi-step problem to the original amount."
    ]
  };
}
