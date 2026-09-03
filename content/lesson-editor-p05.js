import { simple, swc, clear, applyEditorialRevisions } from "./lesson-editor-runtime.js";

function reviseSection(original, body, purpose, checkRule, ids, clearRoute, edits = {}) {
  return {
    h: original.h,
    body,
    examples: original.examples.map((source, i) => {
      const old = { ...source, ...(edits[i] || {}) };
      let steps = old.steps
        .map(step => String(step).replace(/^\((.*)\)$/, "$1").trim())
        .filter(step => !/^Write down the useful numbers and words/i.test(step));
      if (steps.length > 1) {
        const first = steps[0].replace(/[. ]+$/, "").toLowerCase();
        const answerStart = String(old.answer).split(/[.(]/)[0].trim().toLowerCase();
        if (first === answerStart) steps = steps.slice(1);
      }
      const state = purpose[i];
      const check = checkRule[i];
      const config = { q: old.q, state, steps, answer: old.answer, conclusion: old.answer, check, structureId: ids[i], difficulty: i + 1 };
      if (i === 0) return simple(config);
      if (i < 3) return swc(config);
      return clear({ ...config, comprehend: purpose[i], link: steps[0], explain: clearRoute, review: check });
    }),
  };
}

const decimalBodies = [
  ["Whole numbers count complete units. Decimals let us name values between whole numbers, such as half a litre or part of a metre.", "The decimal point separates whole-number places on its left from fractional places on its right. In 3.5, the 3 represents three wholes and the 5 represents five tenths.", "Five tenths is the same amount as one half because 5/10 simplifies to 1/2. A decimal does not merely mean ‘a number with a dot’: every digit still has a place and a value.", "Read the whole-number part normally, say ‘point’, then name the later digits or their places. Keep zeros because they may hold an empty place open."],
  ["A tenth is one of ten equal parts of a whole. If a one-metre strip is divided into ten equal pieces, each piece is 1/10 metre or 0.1 metre.", "The first place to the right of the decimal point is the tenths place. Thus 0.7 means seven tenths, or 7/10.", "A zero before the point tells us there are no complete wholes. A zero after the point may hold an empty place: 0.07 is seven hundredths, not seven tenths.", "Fractions and decimals can name the same amount. The denominator 10 connects directly to the tenths place."],
  ["A hundredth is one of one hundred equal parts of a whole. Ten hundredths make one tenth, and one hundred hundredths make one whole.", "The second place after the decimal point is the hundredths place. In 0.47, the 4 represents four tenths and the 7 represents seven hundredths.", "Money gives a useful model: £1 contains 100 pence, so 47p is £0.47. The 4 represents 40p and the 7 represents 7p.", "The pattern continues to thousandths in the third place after the point. A zero in tenths must remain visible when a later hundredths or thousandths digit is non-zero."],
  ["Place value changes by a factor of ten at every step. Moving left makes a digit ten times as valuable; moving right makes it one tenth as valuable.", "In 2.56, the place-value parts are 2 + 0.5 + 0.06. Five tenths and six hundredths combine to make fifty-six hundredths.", "The same pattern continues without a break across the decimal point: tens, ones, tenths, hundredths and thousandths.", "To build or split a decimal, name every place in order and include a zero wherever an empty place lies between non-zero digits."],
  ["Multiplying by 10 makes every digit ten times as valuable. Each digit therefore takes the place immediately to its left. Dividing by 10 reverses the change.", "People often say that the decimal point moves. It is more accurate to say that the digits change places while the point marks the fixed boundary between ones and tenths.", "Multiplying or dividing by 100 changes each digit by two places; 1,000 changes it by three. Add placeholder zeros when a place would otherwise be empty.", "Always check the direction by size. Multiplication by 10, 100 or 1,000 should increase a positive number; division should decrease it."],
  ["A longer decimal is not necessarily greater. Compare decimals by place value, beginning with the greatest place on the left.", "Write 0.5 as 0.50 when comparing it with 0.35. A final zero does not change the value, and now the tenths and hundredths line up clearly.", "Compare the whole parts first, then tenths, then hundredths and thousandths. The first place that differs decides the order.", "Money can check hundredths: 0.50 of a pound is 50p and 0.35 is 35p, so 0.50 is greater."],
  ["Ordering decimals means making several place-value comparisons. Line up the decimal points and add final zeros so each number shows the same places.", "For 0.6, 0.625, 0.06 and 0.062, write 0.600, 0.625, 0.060 and 0.062. Then compare one column at a time.", "Do not compare the strings as if they were whole numbers. Six hundred twenty-five thousandths is not less than sixty-two thousandths simply because 625 looks different from 62.", "After ordering, check each neighbouring pair. Every number must be no greater than the one that follows it."],
  ["Some fraction-decimal pairs occur so often that knowing them saves time: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/5 = 0.2 and 1/10 = 0.1.", "These facts can be proved, not merely memorised. One quarter is 25 hundredths because 1/4 = 25/100, so its decimal name is 0.25.", "When fractions and decimals appear together, convert them into one form before comparing. Decimal form is often convenient when the fractions have denominators 2, 4, 5, 10 or 100.", "Pad decimals with final zeros when useful. The values 0.7, 0.70 and 0.700 are equal because the added places contain zero."],
];

const ratioBodies = [
  ["A ratio compares amounts by saying how many of one kind there are for every amount of another kind. ‘Two red for every three blue’ gives the ratio 2:3.", "The order matters. Red to blue is 2:3, while blue to red is 3:2. Write labels above the numbers until the order is secure.", "A ratio describes matching groups, not a fixed total. One group has two red and three blue; four identical groups have eight red and twelve blue.", "The colon is read as ‘to’. It does not mean division in the way a fraction line does, although ratio and fractions are closely connected."],
  ["A part-to-part ratio compares two groups inside a whole. A part-to-whole ratio compares one group with the total of all groups.", "If there are 18 girls and 24 boys, the total is 42 pupils. Girls to boys is 18:24, but girls to the whole class is 18:42.", "State what each number represents before simplifying. A correct pair of numbers in the wrong order answers a different question.", "Simplifying a ratio divides every part by the same common factor, preserving the comparison."],
  ["A ratio gives a recipe rather than one fixed quantity. The ratio 1:4 may describe 1 ml to 4 ml, 5 ml to 20 ml or 100 ml to 400 ml.", "Equivalent ratios are made from identical groups. Multiplying every part by the same group count keeps the relationship unchanged.", "If there are three parts juice and two parts water in one batch, five batches contain 15 parts juice and 10 parts water.", "To find a fraction of the total from a ratio, add all ratio parts for the denominator and use the chosen part for the numerator."],
  ["Equivalent ratios express the same recipe at different sizes. For 2:3 and 6:9, both parts have been multiplied by 3.", "Check the same scale factor on every side. If 2 becomes 8 by multiplying by 4, then 3 must become 12 for the ratio to remain equivalent.", "Cross multiplication offers another check: a:b and c:d are equivalent when a × d = b × c.", "One matching side is not enough. Both sides must scale together."],
  ["Simplifying a ratio reveals its smallest whole-number group. Divide every part by a common factor.", "For 12:8, divide both parts by 4 to obtain 3:2. This means the original ratio contained four identical 3:2 groups.", "The simplest form has no common factor greater than 1. If both resulting numbers are still even, or share another factor, continue simplifying.", "Multiply the simplest form back by the same factor to check that it rebuilds the original ratio."],
  ["When one real amount is known, find the value of one ratio part first. Divide the known amount by its matching ratio number.", "In a 2:5 ratio, if two parts are worth £6, one part is £6 ÷ 2 = £3. Five parts are then 5 × £3 = £15.", "Keep units with the value of one part. The ratio numbers have no units; the real quantities may be grams, millilitres, pupils or pounds.", "Check by dividing both final quantities by their ratio numbers. Both divisions should give the same one-part value."],
  ["To share a total in a ratio, first add the ratio numbers to find the total number of equal parts.", "For 3:5, there are 3 + 5 = 8 parts. Sharing 40 items gives 40 ÷ 8 = 5 items per part.", "Multiply the one-part value by each ratio number: 3 × 5 = 15 and 5 × 5 = 25.", "The final shares must add to the original total and simplify back to the stated ratio."],
  ["Scaling a ratio means multiplying every part by the same factor. Adding the same number to each part usually changes the relationship.", "For 1:2, multiplying by 3 gives 3:6, which still has twice as much of the second quantity. Adding 2 gives 3:4, where the second quantity is no longer double.", "To scale a recipe from four people to ten, the scale factor is 10 ÷ 4 = 2.5. Multiply every ingredient by 2.5.", "Check that each new amount divided by its old amount gives the same scale factor."],
];

export function applyPrimaryEditorP05(lessons) {
  const decimal = lessons.decimalPlaceValue;
  const ratio = lessons.ratioBasics;
  const decimalIds = [
    ["compose_from_named_parts", "fraction_decimal_equivalence", "compare_mixed_length_decimals", "equivalent_decimal_representations"],
    ["fraction_decimal_equivalence", "fraction_decimal_equivalence", "missing_addend_to_target", "equivalent_decimal_representations"],
    ["compose_from_named_parts", "compose_from_named_parts", "missing_addend_to_target", "thousandths_fraction_decimal"],
    ["digit_value_from_place", "digit_value_from_place", "missing_addend_to_target", "equivalent_decimal_representations"],
    ["digit_value_from_place", "multiply_divide_power_of_ten", "multiply_divide_power_of_ten", "missing_value_reverse_operation"],
    ["digit_value_from_place", "compare_mixed_length_decimals", "compare_mixed_length_decimals", "equivalent_decimal_representations"],
    ["digit_value_from_place", "order_four_decimals", "order_four_decimals", "equivalent_decimal_representations"],
    ["fraction_decimal_equivalence", "fraction_decimal_equivalence", "compare_mixed_length_decimals", "thousandths_fraction_decimal"],
  ];
  const ratioIds = [
    ["scale_ratio_by_given_factor", "unitary_scale_match_one_quantity", "part_to_whole_ratio", "find_total_given_one_part"],
    ["part_to_whole_ratio", "part_to_whole_ratio", "part_to_whole_ratio", "difference_given_ratio"],
    ["scale_ratio_by_given_factor", "scale_ratio_by_given_factor", "unitary_scale_match_one_quantity", "find_total_given_one_part"],
    ["scale_ratio_by_given_factor", "check_ratio_equivalence", "check_ratio_equivalence", "check_ratio_equivalence"],
    ["simplify_ratio_lowest_terms", "simplify_ratio_lowest_terms", "check_ratio_equivalence", "check_ratio_equivalence"],
    ["scale_ratio_by_given_factor", "find_total_given_one_part", "find_total_given_one_part", "find_total_given_one_part"],
    ["scale_ratio_by_given_factor", "share_total_find_part", "three_way_ratio_share", "three_way_ratio_share"],
    ["scale_ratio_by_given_factor", "missing_term_proportion", "missing_term_proportion", "missing_term_proportion"],
  ];
  const decimalEdits = [
    { 3: { q: "A number has 6 wholes and 2 tenths. The digit 2 is moved from tenths to hundredths. What are the old and new numbers, and by how much does the value decrease?", steps: ["The old number is 6.2 because the 2 represents 0.2.", "After the move, the tenths place is empty and the 2 represents 0.02, so the new number is 6.02.", "Subtract: 6.20 − 6.02 = 0.18."], answer: "The number changes from 6.2 to 6.02, a decrease of 0.18." } },
    { 3: { q: "Compare 5.8, 5.08 and 5.808. Put them in order and explain the value of every digit 8.", steps: ["Pad the values: 5.800, 5.080 and 5.808.", "Their first differing fractional places give 5.080 < 5.800 < 5.808.", "The 8s represent eight tenths in 5.8, eight hundredths in 5.08, and eight tenths plus eight thousandths in 5.808."], answer: "5.08 < 5.8 < 5.808; the 8s represent 0.08, 0.8 and 0.808 respectively." } },
    { 3: { q: "In 8.039, how many times as valuable is the digit 3 as the digit 9?", steps: ["The 3 represents 0.03, or 30 thousandths.", "The 9 represents 0.009, or 9 thousandths.", "Divide the actual values: 0.03 ÷ 0.009 = 30 ÷ 9 = 10/3."], answer: "The 3 is 10/3 times as valuable as the 9, or 3⅓ times as valuable." } },
    { 3: { q: "In 8.19, the digits 1 and 9 swap places. What is the new number, and by how much does it change?", steps: ["The original number is 8.19.", "Swapping the tenths and hundredths digits gives 8.91.", "Subtract: 8.91 − 8.19 = 0.72."], answer: "The new number is 8.91, an increase of 0.72." } },
    { 3: { q: "A number divided by 100 is 4.5. What was the number?", steps: ["Division by 100 made the original number one hundred times smaller.", "Reverse the operation by multiplying: 4.5 × 100 = 450."], answer: "The original number was 450." } },
    { 3: { q: "Which is greater, 0.3 or 0.2999, and what is the exact difference?", steps: ["Write 0.3 as 0.3000.", "Compare from tenths: both have 3 tenths only after regrouping, but 0.2999 is one ten-thousandth below 0.3000.", "Subtract: 0.3000 − 0.2999 = 0.0001."], answer: "0.3 is greater by 0.0001." } },
    { 3: { q: "Order 0.909, 0.099, 0.9 and 0.999 from smallest to largest. Then find the gap between the greatest and least.", steps: ["Pad to thousandths: 0.909, 0.099, 0.900 and 0.999.", "Place-value comparison gives 0.099 < 0.900 < 0.909 < 0.999.", "Find the gap: 0.999 − 0.099 = 0.900."], answer: "0.099, 0.9, 0.909, 0.999; the gap is 0.9." } },
    { 3: { q: "Write 7/8 as a decimal, then compare it with 0.87 and 0.9.", steps: ["Make thousandths: 7/8 = 875/1000 = 0.875.", "Pad all values: 0.875, 0.870 and 0.900.", "Compare the thousandths: 0.870 < 0.875 < 0.900."], answer: "7/8 = 0.875, so 0.87 < 7/8 < 0.9." } },
  ];
  const ratioEdits = [
    { 3: { q: "Paint is mixed blue to yellow in the ratio 3:5. If 27 ml of blue is used, how much yellow is needed and how much paint is made altogether?", steps: ["Three blue parts are worth 27 ml, so one part is 27 ÷ 3 = 9 ml.", "Five yellow parts are 5 × 9 = 45 ml.", "Total paint is 27 + 45 = 72 ml."], answer: "45 ml of yellow paint and 72 ml altogether." } },
    { 1: { steps: ["Add the two counts to find the total: 15 + 18 = 33.", "Simplify 15:33 by dividing both parts by 3: 5:11."] },
      2: { steps: ["Add the two counts to find the total: 20 + 16 = 36.", "Simplify 20:36 by dividing both parts by 4: 5:9."] },
      3: { q: "Red and blue counters are in the ratio 3:5. There are 14 more blue counters than red counters. How many counters of each colour are there?", steps: ["The difference in the ratio is 5 − 3 = 2 parts.", "Two parts are worth 14, so one part is 14 ÷ 2 = 7.", "Red: 3 × 7 = 21. Blue: 5 × 7 = 35."], answer: "There are 21 red counters and 35 blue counters." } },
    { 3: { q: "Stars and moons are in the ratio 4:3. There are 36 stars. How many moons are there, what is the total, and what fraction are moons?", steps: ["Four parts are worth 36, so one part is 36 ÷ 4 = 9.", "Moons: 3 × 9 = 27.", "Total: 36 + 27 = 63.", "Moon fraction: 27/63 = 3/7."], answer: "There are 27 moons, 63 stickers altogether, and 3/7 are moons." } },
    { 3: { q: "Which of 14:21, 18:28 and 22:33 are equivalent to 2:3? Explain each decision.", steps: ["14:21 divides by 7 to give 2:3, so it is equivalent.", "For 18:28, the cross-products are 18 × 3 = 54 and 28 × 2 = 56, so it is not equivalent.", "22:33 divides by 11 to give 2:3, so it is equivalent."], answer: "14:21 and 22:33 are equivalent to 2:3; 18:28 is not." } },
    { 3: { q: "Simplify 126:198 completely and show why your answer cannot be simplified again.", steps: ["Both numbers are divisible by 18: 126 ÷ 18 = 7 and 198 ÷ 18 = 11.", "The ratio becomes 7:11.", "Seven and 11 are different prime numbers, so their only common factor is 1."], answer: "126:198 simplifies to 7:11." } },
    { 3: { q: "Blue and yellow paint are mixed in the ratio 3:4. There are 18.75 spoons of blue. How much yellow is needed?", steps: ["Three parts are worth 18.75, so one part is 18.75 ÷ 3 = 6.25 spoons.", "Yellow is four parts: 4 × 6.25 = 25 spoons."], answer: "25 spoons of yellow paint are needed." } },
    { 3: { q: "Share 132 marbles in the ratio 2:4:5.", steps: ["Total parts: 2 + 4 + 5 = 11.", "One part: 132 ÷ 11 = 12 marbles.", "The shares are 2 × 12 = 24, 4 × 12 = 48 and 5 × 12 = 60."], answer: "The shares are 24, 48 and 60 marbles." } },
    { 3: { q: "A recipe for 6 people uses 420 g flour, 180 ml milk and 2 eggs. Scale it for 15 people.", steps: ["Scale factor: 15 ÷ 6 = 2.5.", "Flour: 420 × 2.5 = 1,050 g.", "Milk: 180 × 2.5 = 450 ml.", "Eggs: 2 × 2.5 = 5."], answer: "Use 1,050 g flour, 450 ml milk and 5 eggs." } },
  ];
  const decimalStates = [
    ["Halfway means the same distance from 4 and 5. We need the number reached by adding half of their one-unit gap to 4.", "Seven tenths means seven parts when one whole is divided into ten equal parts. The tenths digit must therefore be 7.", "Both decimals have three wholes. The first fractional place that differs is the tenths place.", "We must name the value on each side of the point: complete ones on the left and tenths on the right."],
    ["There are no complete litres and there are three tenth-litre parts, so the decimal needs 0 in ones and 3 in tenths.", "Seven hundredths needs an empty tenths place between the decimal point and the 7.", "The length combines five tenths and eight hundredths, then asks for the same amount in a unit one hundred times smaller.", "The 8 stands one place to the right of the decimal point, so its place is tenths."],
    ["Four 10p coins make 40p and seven pennies make 7p. Together they form 47 hundredths of a pound.", "The pounds, tens of pence and single pence fit directly into ones, tenths and hundredths.", "The zero in tenths must remain visible because non-zero hundredths and thousandths follow it.", "We need the second digit after the point and its value as hundredths, a fraction and a decimal."],
    ["We must split 2.56 into ones, tenths and hundredths without treating 56 as a whole number.", "Every digit in 14.307 needs its own place-value part, including the zero hundredths placeholder.", "The named places determine the decimal, and the final 3 must also be expressed as thousandths.", "The digit 1 is immediately after the point, so it represents one tenth rather than one or one hundredth."],
    ["Multiplying by 100 makes every digit one hundred times as valuable, which is two place changes to the left.", "Multiplying by 1,000 changes each digit by three places and requires a final zero placeholder.", "The question asks for both opposite operations on 3.7, so each result must be kept separate and labelled.", "Dividing 45.0 by 10 makes every digit one tenth as valuable."],
    ["Write 0.6 as 0.60 so its tenths and hundredths align with 0.45.", "Write 0.4 as 0.40, then compare the tenths before considering hundredths.", "Write both values to thousandths: 0.089 and 0.100. The tenths place decides immediately.", "Write 0.3 as 0.30 so both values show tenths and hundredths."],
    ["All four numbers need two decimal places before their tenths and hundredths can be sorted reliably.", "Writing each number in hundredths makes the first different place visible for all five values.", "Use three decimal places because the list contains thousandths; tenths alone will leave two ties.", "The decimals look similar but represent nine tenths, nine hundredths and nineteen hundredths."],
    ["Convert one quarter to 0.25 so all three values can be placed in one decimal order.", "The known pairs 1/5 = 0.2 and 1/2 = 0.5 put every value in tenths.", "Convert both fractions, pad the decimals to hundredths and then compare in place-value order.", "One half is five tenths, so the comparison is between 0.5 and 0.4."],
  ];
  const decimalChecks = [
    ["4.5 − 4 = 0.5 and 5 − 4.5 = 0.5, so the distances match.", "0.7 = 7/10 because the 7 occupies the tenths place.", "3.2 − 3.02 = 0.18, a positive difference, so 3.2 is greater.", "Recombine the parts: 6 + 0.2 = 6.2."],
    ["0.3 × 10 = 3 tenths, returning to the stated amount.", "0.07 × 100 = 7 hundredths; writing 0.7 would instead mean 70 hundredths.", "0.58 × 100 = 58, so 0.58 m equals 58 cm.", "Eight tenths is 8/10 = 0.8, confirming all three names."],
    ["£0.47 × 100 = 47p, matching 40p + 7p.", "£3.52 is £3 + 50p + 2p.", "8 + 0 + 0.03 + 0.009 = 8.039.", "Three hundredths is 3 ÷ 100 = 0.03."],
    ["2 + 0.5 + 0.06 = 2.56.", "10 + 4 + 0.3 + 0.007 = 14.307; the empty hundredths add zero.", "40 + 7 + 0.05 + 0.003 = 47.053, and the last part is 3/1000.", "Ten tenths make one whole, so one tenth must be 0.1."],
    ["Use the inverse: 620 ÷ 100 = 6.2.", "Use the inverse: 450 ÷ 1,000 = 0.45.", "370 ÷ 100 = 3.7 and 0.037 × 100 = 3.7, so both results reverse correctly.", "Use the inverse: 4.5 × 10 = 45.0."],
    ["0.60 is 60 hundredths and 0.45 is 45 hundredths.", "0.40 − 0.35 = 0.05, so 0.4 is greater by five hundredths.", "0.100 − 0.089 = 0.011, so one tenth is greater by eleven thousandths.", "0.30 − 0.28 = 0.02."],
    ["The padded list is 0.25 < 0.36 < 0.40 < 0.70.", "Each neighbouring difference is positive: 0.11, 0.20, 0.12 and 0.40.", "The padded order 0.060 < 0.062 < 0.600 < 0.625 confirms every boundary.", "In hundredths, the values are 9, 19 and 90, which are increasing."],
    ["The decimal values are 0.15 < 0.25 < 0.30.", "The decimal values are 0.2 < 0.3 < 0.5.", "The converted order is 0.08 < 0.20 < 0.70 < 0.75.", "0.5 − 0.4 = 0.1, so one half is greater by one tenth."],
  ];
  const ratioStates = [
    ["The ratio gives two blue parts for every five yellow parts. Six millilitres of blue tells us the value of two parts.", "Five flour parts are worth 35 ml. Find one part before building the two sugar parts.", "Two squash parts are worth 10 ml. The same one-part value must be used for the five water parts.", "Each cup of rice brings a group of two cups of water, and there are three rice groups."],
    ["Girls are one part of a whole made from girls and boys, so first find 18 + 24.", "Comic books are compared with all books, not only with story books.", "The whole collection contains both football and cricket stickers.", "The words ‘black to white’ fix 5 as the first number and 4 as the second."],
    ["Four identical 2:1 groups keep red and gold beads paired in the same recipe.", "Each of five groups contains three blue and two white tiles.", "Six identical 4:3 packs must be counted, then the star share must be written over the total.", "Three identical 2:3 groups multiply both juice and water by the same factor."],
    ["We need one multiplier that changes 2:5 into 4:10 on both sides.", "The factor changing 3 into 9 must also change 4 into 12.", "Each candidate must be tested against both parts of 2:3.", "The proposed larger ratio should contain two identical 3:4 groups."],
    ["The simplest group hidden inside 10:15 is found by dividing both parts by their greatest common factor.", "Both 18 and 24 share a factor of 6, which may reduce the ratio in one step.", "The ratio may need more than one division before its parts share no factor.", "Both parts of 6:9 share a factor of 3."],
    ["Five flour parts are worth 250 g, so one part has a definite mass which also sizes the sugar parts.", "Three juice parts are worth 15 ml. The five water parts use the same one-part volume.", "Four boy parts are worth 20 pupils; after finding girls, we must also answer the total-size question.", "Three blue parts are worth 12 spoons, and the four yellow parts use the same spoon value."],
    ["The £35 total is divided into seven equal ratio parts because 2 + 5 = 7.", "Three people have 1 + 2 + 3 = 6 equal ratio parts altogether.", "The three shares contain 2 + 3 + 4 = 9 parts, and every marble must be allocated.", "The ratio 1:3 contains four equal parts, not three."],
    ["Multiplying both parts of 1:4 by 5 must preserve four times as much water as squash.", "Adding 3 produces 4:7, which must be tested against the original four-to-one relationship.", "Serving ten instead of four people requires a scale factor of 10 ÷ 4, applied to flour and eggs.", "Serving six instead of two people triples the recipe, so carrots must triple too."],
  ];
  const ratioChecks = [
    ["6 ÷ 2 = 3 ml per part and 15 ÷ 5 = 3 ml per part.", "35 ÷ 5 = 7 and 14 ÷ 2 = 7, so both sides use 7 ml per part.", "10 ÷ 2 = 5 and 25 ÷ 5 = 5, confirming one common part value.", "6 ÷ 3 = 2 cups of water for each cup of rice."],
    ["18 + 24 = 42 and 18:42 divides by 6 to give 3:7.", "15 + 18 = 33 and 15:33 divides by 3 to give 5:11.", "20 + 16 = 36 and 20:36 divides by 4 to give 5:9.", "Reversing the labels would give white to black as 4:5, confirming that 5:4 answers the requested order."],
    ["8 ÷ 2 = 4 groups and 4 ÷ 1 = 4 groups.", "15 ÷ 3 = 5 and 10 ÷ 2 = 5, so both colours use five groups.", "24 + 18 = 42, and 24/42 simplifies to 4/7.", "6 ÷ 2 = 3 and 9 ÷ 3 = 3, so both quantities were tripled."],
    ["Cross-products are 4 × 5 = 20 and 10 × 2 = 20.", "9 × 4 = 36 and 12 × 3 = 36.", "Only 8:12 gives equal cross-products: 8 × 3 = 12 × 2 = 24.", "6 ÷ 3 = 2 and 8 ÷ 4 = 2."],
    ["Multiply 2:3 by 5 to rebuild 10:15.", "Multiply 3:4 by 6 to rebuild 18:24.", "Multiply 5:7 by 12 to rebuild 60:84.", "Multiply 2:3 by 3 to rebuild 6:9."],
    ["250 ÷ 5 = 50 and 100 ÷ 2 = 50 g per part.", "15 ÷ 3 = 5 and 25 ÷ 5 = 5 ml per part.", "20:25 simplifies to 4:5, and 20 + 25 = 45.", "12 ÷ 3 = 4 and 16 ÷ 4 = 4 spoons per part."],
    ["£10 + £25 = £35 and 10:25 simplifies to 2:5.", "8 + 16 + 24 = 48 and 8:16:24 simplifies to 1:2:3.", "14 + 21 + 28 = 63 and dividing each by 7 gives 2:3:4.", "6 + 18 = 24 and 6:18 simplifies to 1:3."],
    ["5:20 simplifies by 5 to 1:4.", "The cross-products for 1:4 and 4:7 are 7 and 16, so the recipes are not equivalent.", "750 ÷ 300 = 2.5 and 5 ÷ 2 = 2.5.", "12 ÷ 4 = 3, matching the change from 2 people to 6."],
  ];
  const decimalHardStates = [
    "The 2 changes from two tenths to two hundredths. We need both complete numbers and the decrease between them.",
    "The three numbers use the digit 8 in different decimal places. We must order the numbers and name the actual value represented by each 8.",
    "A ‘how many times’ comparison requires the actual values 0.03 and 0.009, not merely the names hundredths and thousandths.",
    "Swapping the tenths and hundredths digits changes both place-value parts. We need the new decimal and its difference from the original.",
    "The final value is known after division by 100. We must reverse that operation to recover the starting value.",
    "The decimals differ only after several places, so they must be padded and subtracted exactly.",
    "Four close-looking decimals must be aligned to thousandths before ordering; the endpoint difference is a second task.",
    "We must convert 7/8 exactly, then compare its decimal with two nearby values."
  ];
  const decimalHardChecks = [
    "6.2 − 0.18 = 6.02, returning to the new value.",
    "The aligned forms 5.080 < 5.800 < 5.808 confirm the order and show 0.08 < 0.8 < 0.808.",
    "Multiply back: 0.009 × 10/3 = 0.03.",
    "8.19 + 0.72 = 8.91, confirming the increase.",
    "450 ÷ 100 = 4.5, exactly the given result.",
    "0.2999 + 0.0001 = 0.3000.",
    "The ordered padded forms are 0.099 < 0.900 < 0.909 < 0.999, and 0.099 + 0.900 = 0.999.",
    "0.875 × 8 = 7, confirming 7/8, and 0.870 < 0.875 < 0.900 confirms the order."
  ];
  const ratioHardStates = [
    "Three blue parts are worth 27 ml. We must find one part, use it for five yellow parts and then add both quantities.",
    "The excess of blue counters corresponds to the difference between five ratio parts and three ratio parts.",
    "Four star parts are worth 36. The same one-part value determines moons, the total and the moon fraction.",
    "Each candidate must independently simplify to 2:3 or pass an equal-cross-products test.",
    "We need the greatest common factor of 126 and 198, followed by proof that the result cannot shrink again.",
    "The known blue amount is decimal, but the one-part method is unchanged: divide by three, then multiply by four.",
    "The total 132 must be split across eleven equal parts because 2 + 4 + 5 = 11.",
    "The serving count changes from 6 to 15. One scale factor must be applied to all three ingredients."
  ];
  const ratioHardChecks = [
    "27 ÷ 3 = 9 and 45 ÷ 5 = 9 ml per part; 27 + 45 = 72.",
    "35 − 21 = 14 and 21:35 simplifies by 7 to 3:5.",
    "36:27 simplifies by 9 to 4:3, while 36 + 27 = 63 and 27/63 = 3/7.",
    "14:21 and 22:33 both simplify to 2:3. For 18:28, cross-products 54 and 56 are unequal.",
    "7 × 18 = 126 and 11 × 18 = 198; prime numbers 7 and 11 share no factor greater than 1.",
    "18.75 ÷ 3 = 6.25 and 25 ÷ 4 = 6.25 spoons per part.",
    "24 + 48 + 60 = 132 and 24:48:60 divides by 12 to give 2:4:5.",
    "1,050 ÷ 420 = 2.5, 450 ÷ 180 = 2.5 and 5 ÷ 2 = 2.5."
  ];
  decimalStates.forEach((row, i) => { row[3] = decimalHardStates[i]; decimalChecks[i][3] = decimalHardChecks[i]; });
  ratioStates.forEach((row, i) => { row[3] = ratioHardStates[i]; ratioChecks[i][3] = ratioHardChecks[i]; });
  const revisions = {
    decimalPlaceValue: {
      intro: "Decimals continue the place-value system to quantities smaller than one. This lesson builds tenths, hundredths and thousandths from equal parts, then uses those places to compose, scale, compare and order numbers.",
      sections: decimal.sections.map((s, si) => reviseSection(s, decimalBodies[si], decimalStates[si], decimalChecks[si], decimalIds[si], [
        "Write the old and new place-value amounts, then subtract them to measure the change.",
        "Align all three decimals, order them and connect each 8 to its exact place-value amount.",
        "Express both digit values in thousandths before dividing the larger by the smaller.",
        "Build the swapped decimal carefully and subtract the original value.",
        "Undo division by 100 with its inverse operation, multiplication by 100.",
        "Pad both decimals to four places, compare and subtract to find the exact gap.",
        "Align all four values to thousandths, order them and subtract the endpoints.",
        "Convert the fraction into thousandths, then compare three aligned decimal values.",
      ][si], decimalEdits[si])),
    },
    ratioBasics: {
      intro: "Ratio describes quantities that scale together. We will begin with the words ‘for every’, keep labels attached to each part, build equivalent groups, simplify recipes and use the value of one part to scale or share real amounts.",
      sections: ratio.sections.map((s, si) => reviseSection(s, ratioBodies[si], ratioStates[si], ratioChecks[si], ratioIds[si], [
        "Find the millilitres in one ratio part, build the yellow amount and add both colours.",
        "Use the difference between the ratio parts to find one part, then build both colour counts.",
        "Find one part from the star count, build moons and the total, then simplify the requested fraction.",
        "Simplify or cross-multiply every candidate separately before naming the equivalent ratios.",
        "Divide both quantities by their greatest common factor and prove the remaining parts are coprime.",
        "Find the decimal value of one part before multiplying by the yellow ratio number.",
        "Add all three parts, find one part and build each labelled share.",
        "Find one scale factor from the serving counts and apply it to every ingredient.",
      ][si], ratioEdits[si])),
    },
  };
  applyEditorialRevisions(lessons, revisions);
}
