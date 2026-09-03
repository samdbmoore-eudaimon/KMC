const ex = (q, steps, answer) => ({ q, steps, answer });

const section = (h, body, examples, tryit, note, visual) => ({
  h,
  body,
  examples,
  tryit,
  note,
  ...(visual ? { visual } : {})
});

export function applyPrimaryFractionMigration(lessons) {
  const quantity = lessons.fractionOfQuantity;
  quantity.intro = "A fraction can describe a piece of a shape, a point on a number line or part of a quantity. In this lesson we concentrate on quantities. We will begin with equal sharing, connect the fraction line to division and build a dependable divide-then-multiply method. We will also learn to work backwards when only a fractional part is known.";
  quantity.sections[0].body = [
    "Start with one complete chocolate bar. Before describing a fraction of it, decide what counts as the whole. Here, the whole is the complete bar, not one square and not a packet containing several bars.",
    "Divide the bar into equal squares. Equal matters because a fraction counts equal shares. If one square were twice as large as another, counting squares would not tell us fairly how much chocolate there was.",
    "If the bar has 8 equal squares and 5 are selected, the selected amount is 5/8. The denominator 8 names how many equal parts make the whole. The numerator 5 counts the parts selected.",
    "The same idea works with a group of objects. Three quarters of 20 counters means split all 20 counters into 4 equal groups, then take 3 of those groups.",
    "Whenever you see a fraction of an amount, ask: what is the whole amount, how many equal groups must it be divided into and how many groups are required?"
  ];
  quantity.sections[0].image = "fractions-chocolate-five-eighths";
  quantity.sections[0].note = "A collection can be divided into equal groups even when nothing is physically cut. Equal sharing is the important idea.";

  quantity.sections.splice(1, 0, section(
    "2. A fraction is also a division",
    [
      "The fraction line is another way to write division. The fraction 3/4 means 3 divided by 4, just as surely as 3 ÷ 4 does.",
      "Imagine sharing 3 identical pizzas equally among 4 people. Each pizza can be divided into quarters. There are 12 quarters altogether, so each person receives 3 quarters of a pizza, or 3/4.",
      "This explains why a fraction is a number, not merely a picture with shaded pieces. It has a position on the number line and can be used in calculations.",
      "If the numerator is smaller than the denominator, the result is between 0 and 1. If they are equal, the result is 1. If the numerator is larger, the result is greater than 1.",
      "Reading the fraction line as division will later help with decimal conversions, mixed numbers and sharing problems."
    ],
    [
      ex("What division does 3/5 represent?", ["Read the numerator first.", "The fraction line means divided by.", "Read the denominator second."], "3 ÷ 5."),
      ex("Five cakes are shared equally among 8 children. What fraction of a cake does each child receive?", ["The total amount, 5 cakes, is shared among 8 children.", "Write the sharing as 5 ÷ 8.", "Write that division as a fraction."], "Each child receives 5/8 of a cake."),
      ex("Is 9/7 less than, equal to or greater than 1?", ["One whole is 7/7.", "9/7 contains all 7 sevenths of a whole and 2 more sevenths."], "It is greater than 1."),
      ex("Place 7/3 between two neighbouring whole numbers.", ["Three thirds make one whole and six thirds make two wholes.", "7/3 is one third beyond 6/3."], "It lies between 2 and 3, at 2 and 1/3.")
    ],
    { q: "Four identical loaves are shared equally among 5 families. What fraction of a loaf does each family receive?", answer: "4/5 of a loaf, because 4 shared by 5 is 4/5." },
    "Do not reverse the division. The numerator is divided by the denominator, so 3/5 means 3 ÷ 5, not 5 ÷ 3."
  ));

  quantity.sections.forEach((s, i) => { s.h = s.h.replace(/^\d+\./, `${i + 1}.`); });

  const equivalence = lessons.fractionEquivalence;
  equivalence.intro = "Equivalent fractions are different names for the same number. We will see them in pictures and on a number line before using multiplication and division to create them. We will then connect fractions with mixed numbers, decimals and percentages so that the same value can be recognised in several forms.";
  equivalence.sections[0].body.push("A fraction is also a point on the number line. For example, 3/4 lies three equal quarter-steps from 0. Thinking of fractions as numbers helps us compare them and explains why equivalent fractions must land at exactly the same point.");
  equivalence.sections.push(section(
    "8. Improper fractions and mixed numbers name the same amount",
    [
      "Fractions do not stop at one whole. If quarters continue along a number line, 4/4 is 1, 5/4 is one whole and one quarter and 8/4 is 2.",
      "A fraction whose numerator is at least as large as its denominator is called an improper fraction. The name does not mean it is wrong. It simply means the number is at least one whole.",
      "A mixed number writes the same value using a whole number and a proper fraction. Thus 7/4 and 1 and 3/4 are two names for the same point.",
      "To change an improper fraction into a mixed number, divide the numerator by the denominator. The quotient gives the wholes and the remainder becomes the new numerator.",
      "To reverse the process, multiply the whole number by the denominator, add the numerator and place the result over the original denominator."
    ],
    [
      ex("Write 5/4 as a mixed number.", ["Four quarters make one whole.", "One quarter remains."], "1 and 1/4."),
      ex("Write 11/3 as a mixed number.", ["11 ÷ 3 is 3 remainder 2.", "Use 3 as the whole number and 2 as the numerator over 3."], "3 and 2/3."),
      ex("Write 2 and 3/5 as an improper fraction.", ["Two wholes contain 2 × 5 = 10 fifths.", "Add the extra 3 fifths."], "13/5."),
      ex("Which is greater, 17/6 or 2 and 3/4?", ["Convert 2 and 3/4 to 11/4.", "Use denominator 12: 17/6 = 34/12 and 11/4 = 33/12."], "17/6 is greater by 1/12.")
    ],
    { q: "Write 14/5 as a mixed number.", answer: "2 and 4/5, because 14 ÷ 5 is 2 remainder 4." },
    "Keep the denominator when converting. It tells you the size of the fractional pieces and does not disappear."
  ));
  equivalence.sections.push(section(
    "9. Fractions, decimals and percentages",
    [
      "A fraction, decimal and percentage can be three different names for one number. For example, 1/2, 0.5 and 50% all mark the same point on a number line.",
      "To turn a fraction into a decimal, use the fraction line as division. For 3/4, calculate 3 ÷ 4 to get 0.75.",
      "A percentage counts parts out of 100. Since 0.75 means 75 hundredths, it is 75%. If a fraction can easily be changed into hundredths, that gives another route.",
      "To turn a terminating decimal into a fraction, use place value. The decimal 0.35 means 35 hundredths, so it is 35/100, which simplifies to 7/20.",
      "When several forms appear in one comparison, convert them to a common form before deciding their order."
    ],
    [
      ex("Write 1/2 as a decimal and percentage.", ["Calculate 1 ÷ 2 = 0.5.", "Multiply by 100 to express the decimal as a percentage."], "0.5 and 50%."),
      ex("Write 3/5 as a decimal and percentage.", ["Make hundredths: 3/5 = 60/100.", "Sixty hundredths is 0.60 and 60%."], "0.6 and 60%."),
      ex("Write 0.375 as a fraction in simplest form.", ["0.375 means 375/1000.", "Divide numerator and denominator by 125."], "3/8."),
      ex("Order 7/10, 68% and 0.72 from smallest to largest.", ["Convert them to decimals: 0.70, 0.68 and 0.72.", "Compare the hundredths."], "68%, 7/10, 0.72.")
    ],
    { q: "Write 0.45 as a percentage and as a fraction in simplest form.", answer: "45% and 9/20. The fraction 45/100 simplifies by dividing by 5." },
    "Do not attach a percent sign to a decimal without converting it. The decimal 0.6 is 60%, not 0.6%."
  ));

  const arithmetic = lessons.fractionArithmetic;
  arithmetic.intro = "Fraction arithmetic begins with one question: what size are the pieces? Addition and subtraction require matching pieces, while multiplication finds a part of a part. Division by a whole number shares the fraction into smaller equal portions. We will explain why each method works before using it.";
  arithmetic.sections.push(section(
    "9. Multiplying fractions means finding a part of a part",
    [
      "The word ‘of’ usually tells us to multiply. One half of one third means 1/2 × 1/3.",
      "Picture a rectangle. Shade one third vertically, then take one half of that shaded strip horizontally. The overlap is 1 piece out of 6 equal pieces, so 1/2 × 1/3 = 1/6.",
      "The picture explains the rule: multiply the numerators to count the selected overlaps and multiply the denominators to count all equal overlaps.",
      "Unlike addition, multiplication does not require a common denominator. The two denominators describe two successive divisions of the whole.",
      "Simplify the result. You may also cancel common factors diagonally before multiplying, provided you divide one numerator and one denominator by the same factor."
    ],
    [
      ex("Work out 1/2 × 1/3.", ["Multiply the numerators: 1 × 1 = 1.", "Multiply the denominators: 2 × 3 = 6."], "1/6."),
      ex("Work out 2/3 × 4/5.", ["Multiply the numerators to get 8.", "Multiply the denominators to get 15.", "8 and 15 have no common factor."], "8/15."),
      ex("Work out 3/4 × 2/9.", ["Cancel the common factor 3 between 3 and 9, leaving 1 and 3.", "Cancel the common factor 2 between 2 and 4, leaving 1 and 2.", "Multiply what remains."], "1/6."),
      ex("A tank is 3/5 full. Two thirds of the water is used. What fraction of the whole tank is used?", ["Find 2/3 of 3/5 by multiplying.", "Cancel the common factor 3.", "Multiply what remains."], "2/5 of the whole tank.")
    ],
    { q: "Work out 5/6 × 3/10 and simplify.", answer: "1/4. Cancel 5 with 10 and 3 with 6, then multiply 1/2 × 1/2." },
    "Multiplication can make a number smaller. Taking a proper fraction of a positive amount gives only part of that amount."
  ));
  arithmetic.sections.push(section(
    "10. Dividing a fraction by a whole number",
    [
      "Dividing by a whole number means sharing equally. If 3/4 of a cake is shared between 2 people, each person receives half of 3/4.",
      "Half of 3/4 is 3/8, so 3/4 ÷ 2 = 3/8. Dividing by 2 has the same effect as multiplying by 1/2.",
      "For any positive whole number n, dividing by n is the same as multiplying by 1/n. This turns the calculation into fraction multiplication.",
      "Sometimes the numerator divides exactly by the whole number, as in 6/7 ÷ 3 = 2/7. Otherwise, multiply the denominator and simplify afterwards.",
      "Check the direction of the answer. Sharing a positive amount among more than one person must make each share smaller."
    ],
    [
      ex("Work out 1/3 ÷ 2.", ["Dividing by 2 means multiplying by 1/2.", "Calculate 1/3 × 1/2."], "1/6."),
      ex("Work out 3/4 ÷ 2.", ["Rewrite ÷ 2 as × 1/2.", "Multiply to get 3/8."], "3/8."),
      ex("Work out 6/7 ÷ 3.", ["Rewrite as 6/7 × 1/3.", "Cancel 6 and 3 to 2 and 1."], "2/7."),
      ex("Five sixths of a litre is poured equally into 4 cups. How much goes in each cup?", ["Calculate 5/6 ÷ 4.", "Rewrite as 5/6 × 1/4.", "Multiply."], "5/24 litre.")
    ],
    { q: "Work out 7/10 ÷ 5.", answer: "7/50, because 7/10 × 1/5 = 7/50." },
    "Do not divide both numerator and denominator by the whole number. That would leave the fraction's value unchanged rather than make it smaller."
  ));
}
