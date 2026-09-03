import { simple, swc, clear, applyEditorialRevisions } from "./lesson-editor-runtime.js";

function cleanBody(body) {
  return body.map(p => p
    .replace(/That is all long division is\./g, "This is a visible form of division called chunking; the compact written layout records the same grouping more briefly.")
    .replace(/times by 10 just puts a zero on the end/g, "multiplying a whole number by 10 moves every digit one place to a value ten times as large")
    .replace(/then add a zero/g, "then make the product ten times as large")
    .replace(/the point moves three places to the right/g, "every digit moves three place-value positions to the left")
  );
}

function section(original, intro, states, checks, ids, hard) {
  return {
    h: original.h,
    body: [intro, ...cleanBody(original.body)],
    examples: original.examples.map((source, i) => {
      const old = i === 3 ? { ...source, ...hard } : source;
      const steps = old.steps.map(x => String(x).replace(/^\((.*)\)$/, "$1").trim()).filter(x => !/^Write down the useful/i.test(x) && !/^✓$/.test(x));
      const config = { q: old.q, state: states[i], steps, answer: old.answer, conclusion: old.answer, check: checks[i], structureId: ids[i], difficulty: i + 1 };
      if (i === 0) return simple(config);
      if (i < 3) return swc(config);
      return clear({ ...config, comprehend: states[i], link: steps[0], explain: hard.route, review: checks[i] });
    }),
  };
}

export function applyPrimaryEditorP09(lessons) {
  const multiplication = lessons.formalMultiplication;
  const division = lessons.formalDivision;
  const multiplicationIds = [
    ["short_multiplication_1digit", "short_multiplication_1digit", "distributive_partition_2digit", "compound_area_multiplication"],
    ["short_multiplication_1digit", "short_multiplication_1digit", "estimate_product_before_calculating", "compare_two_products"],
    ["short_multiplication_1digit", "distributive_partition_2digit", "distributive_partition_2digit", "compound_area_multiplication"],
    ["short_multiplication_1digit", "spot_correct_partial_products", "distributive_partition_2digit", "compound_area_multiplication"],
    ["short_multiplication_1digit", "short_multiplication_1digit", "missing_digit_in_product", "spot_the_method_error"],
    ["short_multiplication_1digit", "distributive_partition_2digit", "long_multiplication_2digit_full", "long_multiplication_2digit_full"],
    ["identify_carried_digit", "spot_correct_partial_products", "spot_the_method_error", "spot_the_method_error"],
    ["short_multiplication_1digit", "estimate_product_before_calculating", "compare_two_products", "compare_two_products"],
    ["short_multiplication_1digit", "distributive_partition_2digit", "long_multiplication_2digit_full", "long_multiplication_2digit_full"],
  ];
  const divisionIds = [
    ["short_division_quotient", "short_division_quotient", "ratio_table_long_division", "long_division_2digit_divisor"],
    ["procedural_bring_down_digit", "procedural_bring_down_digit", "ratio_table_long_division", "long_division_2digit_divisor"],
    ["estimate_the_quotient", "estimate_the_quotient", "ratio_table_long_division", "long_division_2digit_divisor"],
    ["short_division_quotient", "ratio_table_long_division", "long_division_2digit_divisor", "long_division_2digit_divisor"],
    ["missing_dividend_or_divisor", "missing_dividend_or_divisor", "carried_remainder_value", "spot_the_long_division_error"],
    ["identify_remainder", "procedural_bring_down_digit", "long_division_2digit_divisor", "carried_remainder_value"],
    ["short_division_quotient", "remainder_as_fraction", "remainder_as_fraction", "remainder_as_fraction"],
    ["short_division_quotient", "two_step_division", "two_step_division", "two_step_division"],
  ];
  const multIntros = [
    "Multiplication counts equal groups. The calculation 4 × 3 can mean four groups of three, an array with four rows of three or four equal jumps of three.",
    "A remembered table fact is a starting block, not a separate trick. Larger products are built by combining small facts with place value.",
    "The distributive idea says every part of a number must be multiplied. Since 24 = 20 + 4, 24 × 3 = 20 × 3 + 4 × 3.",
    "An area model proves the split: partitioning one rectangle creates smaller rectangles whose areas exactly cover the original with no gap or overlap.",
    "Short multiplication compresses partial products. Any exchanged ten must be carried into the tens column because ten ones have been regrouped as one ten.",
    "With a two-digit multiplier, split it into its full place values. In 23, the 2 represents 20, so one partial product must be multiplied by 20.",
    "A zero in a tens partial product is a place-value placeholder. It records that multiplying by tens produces no ones contribution.",
    "An estimate predicts the scale of the answer. It cannot prove an exact product, but it exposes misplaced digits and missing place-value factors.",
    "A reliable complete solution estimates, forms every place-value partial product, adds them accurately and checks with a second arrangement or inverse division."
  ];
  const divIntros = [
    "Division can mean fair sharing or counting equal groups. Both interpretations connect to multiplication: if 5 × 6 = 30, then 30 ÷ 5 = 6.",
    "Equal jumps on a number line show how many divisor-sized groups fit. Any distance left after the final whole jump becomes a remainder.",
    "A multiple is a known number of equal groups. Friendly multiples such as ten groups let us remove large chunks without losing track of the group count.",
    "Chunking records two linked quantities: how many groups were used and how much of the dividend those groups consumed. Add group counts only after the matching amounts reach the dividend.",
    "Multiplication checks division. For an exact result, divisor × quotient = dividend. With a remainder, divisor × quotient + remainder = dividend.",
    "A remainder is what cannot form another complete divisor-sized group. It must be non-negative and smaller than the divisor.",
    "A remainder can be shared further. Remainder r after division by d represents the fraction r/d, which may then be written as a decimal.",
    "Multiplying dividend and divisor by the same non-zero factor preserves the quotient because both the amount and the group size scale together."
  ];
  const multHard = multiplication.sections.map((s, i) => ({
    q: ["An array has 18 rows of 24 dots. Split both dimensions into tens and ones and find the total.", "Without calculating exactly at first, decide which is greater: 39 × 21 or 40 × 20. Then prove it.", "Use an area split to calculate 67 × 14, showing all four place-value pieces.", "A 48 by 27 rectangle is split at 40 + 8 and 20 + 7. Find all four partial areas and the total.", "A pupil calculates 306 × 7 as 2,142 but writes the carried tens under the hundreds column. Explain the correct regrouping.", "Calculate 307 × 46 using full partial products and explain every placeholder zero.", "A pupil claims 68 × 32 = 68 × 3 + 68 × 2. Diagnose and correct the method.", "Estimate and calculate both 98 × 47 and 102 × 45. Which product is greater?", "Estimate and calculate 384 × 27, then verify the product by dividing it by 27."][i],
    steps: [
      ["18 × 24 = (10 + 8)(20 + 4).", "Partial products: 10 × 20 = 200, 10 × 4 = 40, 8 × 20 = 160 and 8 × 4 = 32.", "Add: 200 + 40 + 160 + 32 = 432."],
      ["39 × 21 = 39 × 20 + 39 = 780 + 39 = 819.", "40 × 20 = 800.", "Therefore 39 × 21 is greater by 19."],
      ["67 × 14 = (60 + 7)(10 + 4).", "Partial products are 600, 240, 70 and 28.", "Total: 600 + 240 + 70 + 28 = 938."],
      ["40 × 20 = 800, 40 × 7 = 280, 8 × 20 = 160 and 8 × 7 = 56.", "Add: 800 + 280 + 160 + 56 = 1,296."],
      ["Seven times six ones is 42 ones: write 2 ones and exchange 40 ones for 4 tens.", "Seven times zero tens plus the exchanged 4 tens is 4 tens.", "Seven times three hundreds is 21 hundreds, giving 2,142."],
      ["307 × 6 = 1,842.", "307 × 40 = 12,280; the ones placeholder is zero because this row counts groups of ten.", "Add: 1,842 + 12,280 = 14,122."],
      ["The 3 in 32 means 30, not 3.", "Correct partial products: 68 × 30 = 2,040 and 68 × 2 = 136.", "Total: 2,176."],
      ["98 × 47 = 98 × 40 + 98 × 7 = 3,920 + 686 = 4,606.", "102 × 45 = 102 × 40 + 102 × 5 = 4,080 + 510 = 4,590.", "The first product is greater by 16."],
      ["Estimate: 400 × 30 = 12,000.", "384 × 27 = 384 × 20 + 384 × 7 = 7,680 + 2,688 = 10,368.", "Verify: 10,368 ÷ 27 = 384."]
    ][i],
    answer: ["432 dots.", "39 × 21 is greater by 19.", "938.", "1,296.", "The correct product is 2,142; the exchanged 4 belongs in the tens column.", "14,122.", "The correct product is 2,176.", "98 × 47 is greater by 16.", "10,368."][i],
    comprehend: ["The array has two dimensions that must each be split into tens and ones before multiplying.", "Two nearby products must be compared without assuming the rounded version is exact.", "An area split needs four separate partial areas that together cover the whole rectangle.", "Two split dimensions create four partial rectangles whose areas must all be added.", "A carried exchange from the ones column must land in the correct place-value column.", "A two-digit multiplier needs a full ones row and a full tens row, each added correctly.", "The claimed method treats a tens digit as though it were a ones digit.", "Two rounded estimates must be checked against their exact products.", "An estimate, an exact calculation and an inverse division must all agree."][i],
    route: ["Split both factors into tens and ones, multiply every pair of parts and add the four partial products.", "Round both factors to estimate first, then calculate the exact product and compare the two results.", "Split both factors into their place-value parts, multiply every pair and add the four areas.", "Multiply every pair of split dimensions and add all four partial areas to find the total.", "Multiply by each place value in turn, track the carried exchange and place it in the correct column.", "Multiply by the ones, then by the tens using the placeholder zero, and add both rows.", "Identify what each digit of the multiplier represents, then recalculate both partial products correctly.", "Estimate both products first, then calculate them exactly and compare the two results.", "Estimate the product, calculate it exactly using partial products, then verify by dividing back."][i]
  }));
  const divHard = division.sections.map((s, i) => ({
    q: ["Divide 1,008 by 24 using helpful multiples and explain why no remainder remains.", "Show 1,155 ÷ 21 as large equal jumps.", "Estimate, then calculate 1,378 ÷ 26.", "Divide 2,184 by 28 using at least two friendly multiples.", "A pupil writes 437 ÷ 16 = 26 remainder 21. Explain the error and correct it.", "Divide 1,007 by 24, giving a quotient and valid remainder.", "Write 175 ÷ 8 as a decimal and verify it.", "Work out 7.56 ÷ 0.35 by scaling both numbers to remove decimals."][i],
    steps: [
      ["24 × 40 = 960, leaving 48.", "24 × 2 = 48, so 40 + 2 = 42 groups.", "Nothing remains."],
      ["21 × 50 = 1,050, leaving 105.", "21 × 5 = 105.", "Total jumps: 50 + 5 = 55."],
      ["26 × 50 = 1,300, so expect just over 50.", "1,378 − 1,300 = 78 and 26 × 3 = 78.", "Quotient 53."],
      ["28 × 70 = 1,960, leaving 224.", "28 × 8 = 224.", "Total groups: 70 + 8 = 78."],
      ["A remainder must be smaller than 16, but 21 is not.", "One more group gives quotient 27 and remainder 21 − 16 = 5.", "16 × 27 + 5 = 437."],
      ["24 × 40 = 960, leaving 47.", "One more group leaves 47 − 24 = 23.", "So the result is 41 remainder 23, and 23 < 24."],
      ["175 ÷ 8 = 21 remainder 7.", "The remainder represents 7/8 = 0.875.", "Total: 21.875; check 21.875 × 8 = 175."],
      ["Multiply both numbers by 100: 756 ÷ 35.", "35 × 21 = 735, leaving 21, and 21/35 = 0.6.", "Therefore the quotient is 21.6; check 0.35 × 21.6 = 7.56."]
    ][i],
    answer: ["42.", "55.", "53.", "78.", "27 remainder 5.", "41 remainder 23.", "21.875.", "21.6."][i],
    route: "Keep the group count matched to the amount removed, then verify with divisor × quotient plus any remainder."
  }));
  const multChecks = [
    "Reverse the grouping by dividing the total by the number of groups; it must return the group size.",
    "Use a neighbouring table fact or repeated addition to confirm the product.",
    "Add the place-value parts first, then verify the product with the unsplit number.",
    "The partial rectangles must cover the original dimensions exactly and their areas must add to the total.",
    "Recombine every hundreds, tens and ones partial product and compare with an estimate.",
    "Swap the factors and repeat the place-value split; multiplication should give the same product.",
    "Estimate the size and confirm every tens partial product is ten times its matching ones fact.",
    "The exact product must have the size predicted by the rounded factors.",
    "Divide the final product by one factor to recover the other factor."
  ];
  const divChecks = [
    "Multiply the quotient by the divisor to rebuild the dividend.",
    "Count the equal jumps again and add any uncovered distance as the remainder.",
    "Multiply each friendly group count by the divisor and confirm the amounts combine correctly.",
    "Add the group jumps and multiply by the divisor; the result must equal the starting amount.",
    "For a remainder result, check divisor × quotient + remainder = dividend and remainder < divisor.",
    "Check divisor × quotient + remainder = dividend, with the remainder smaller than the divisor.",
    "Multiply the decimal quotient by the divisor to recover the dividend exactly.",
    "Multiply the scaled quotient by the original divisor; it must reproduce the original dividend."
  ];
  const multHardChecks = ["432 ÷ 18 = 24, so the array dimensions rebuild correctly.", "819 − 800 = 19.", "938 ÷ 14 = 67.", "1,296 ÷ 27 = 48.", "2,142 ÷ 7 = 306, and the digit 4 represents four tens.", "14,122 ÷ 46 = 307.", "2,176 ÷ 32 = 68.", "4,606 − 4,590 = 16.", "10,368 ÷ 27 = 384, and 10,368 is near the estimate 12,000."];
  const divHardChecks = ["24 × 42 = 1,008.", "21 × 55 = 1,155.", "26 × 53 = 1,378.", "28 × 78 = 2,184.", "16 × 27 + 5 = 437 and 5 < 16.", "24 × 41 + 23 = 1,007 and 23 < 24.", "21.875 × 8 = 175.", "21.6 × 0.35 = 7.56."];
  const multStates = [
    ["We need the total in four equal groups with three items in each group.", "There are six equal bags and five apples in every bag; the unknown is the total number of apples.", "The repeated addition contains four equal addends of seven, so we must express its group count and group size as multiplication.", multHard[0].comprehend],
    ["This is the remembered table fact for eight groups of seven.", "The known fact uses four ones, while the required product uses four tens; the group count stays six.", "We need to identify the small ones calculation inside seven groups of 36.", multHard[1].comprehend],
    ["Twenty-four contains two tens and four ones, and both parts must be multiplied by three.", "Forty-seven contains forty and seven; six equal groups contain six copies of each part.", "Eighty-six must be partitioned into eighty and six before both parts are multiplied by seven.", multHard[2].comprehend],
    ["The 4 by 13 rectangle can be split into a 4 by 10 part and a 4 by 3 part.", "The 6 by 24 rectangle can be partitioned at twenty without changing its total area.", "We need two valid partitions of a rectangle measuring 8 by 35 and must show that both cover the same whole.", multHard[3].comprehend],
    ["Twenty-eight must be split into tens and ones, with five groups of each part.", "Five equal groups contain the sixty part and the four part of 64.", "The number 135 contains hundreds, tens and ones, and four copies of every part are required.", multHard[4].comprehend],
    ["The multiplier 24 represents twenty and four, so 36 must be multiplied by both full place values.", "The multiplier 13 represents ten and three; the two resulting products must be combined.", "The multiplier 28 contains twenty and eight, and the eight-part product itself needs careful regrouping.", multHard[5].comprehend],
    ["The digit 1 in the multiplier 14 represents one ten, so the second partial-product row records groups of ten.", "The claimed result treats the 2 in 20 as two ones; we must identify the missing place-value factor.", "Thirty means three tens, so the product must be ten times the related calculation with 3.", multHard[6].comprehend],
    ["We need a rounded prediction for 48 × 31 and an exact product to compare with it.", "Both factors should be rounded before the exact partial products for 73 × 42 are calculated.", "The rounded factors are both above the originals, so the estimate should be expected to exceed the exact product.", multHard[7].comprehend],
    ["Thirty-four has a tens part and a ones part; six groups of both parts give the complete product.", "The multiplier 14 contributes four ones groups and one tens group of 27.", "We need both a size estimate and the exact place-value products for 58 × 23.", multHard[8].comprehend]
  ];
  const divStates = [
    ["We need the number of complete groups of five contained in 30.", "Forty-two items are shared equally among seven people; the unknown is one person's share.", "We must explain the inverse relationship connecting one multiplication fact with two divisions.", divHard[0].route],
    ["The distance from 0 to 20 is covered in equal jumps of four; the unknown is the jump count.", "We need the number of complete six-unit jumps in 27 and the distance left uncovered.", "Large eight-unit jumps should reach 96 while keeping track of how many groups were used.", divHard[1].route],
    ["Any two correct products of seven below 50 satisfy the request.", "The two known batches contain ten groups and five groups of six; their group counts and amounts must be combined.", "A nearby multiple of eight should show whether 156 ÷ 8 is just below or above a familiar quotient.", divHard[2].route],
    ["The dividend 184 must be built from groups of eight, using a large known group count before the remainder is handled.", "We need the total number of five-sized groups in 195, not the total amount removed in each jump.", "The calculation asks how many seven-sized groups make 336, using friendly group counts.", divHard[3].route],
    ["The proposed quotient 12 and divisor 7 should multiply back to the original dividend 84.", "The quotient, divisor and remainder must rebuild 95, and the remainder must be smaller than six.", "The claim gives too few groups of eleven to make 143, so we must find the missing group.", divHard[4].route],
    ["We need the greatest whole number of six-sized groups in 97 and the amount left.", "The quotient must use as many complete groups of nine as possible without exceeding 145.", "We must decide whether 253 contains an exact number of eleven-sized groups or leaves a remainder.", divHard[5].route],
    ["After finding complete groups of four in 45, the leftover part must be shared as a fraction of four.", "The remainder after grouping 50 into eights must be converted into an exact decimal part.", "The leftover after complete groups of six must be expressed as a fraction of six and then a decimal.", divHard[6].route],
    ["Both dividend and decimal divisor must be scaled equally until the divisor becomes a friendly whole number.", "Dividing by one half asks how many half-sized groups fit inside 56.", "Both decimals can be multiplied by ten without changing the quotient, producing a whole-number division.", divHard[7].route]
  ];
  const multSpecificChecks = [
    ["12 ÷ 4 = 3, so the total contains four groups of three.", "30 ÷ 6 = 5 apples per bag.", "28 written as four equal addends is 7 + 7 + 7 + 7."],
    ["56 ÷ 8 = 7.", "240 ÷ 6 = 40, and it is ten times 24.", "The ones product 7 × 6 = 42 appears when 36 is split into 30 + 6."],
    ["72 ÷ 3 = 24.", "282 ÷ 6 = 47.", "602 ÷ 7 = 86."],
    ["52 ÷ 4 = 13.", "144 ÷ 6 = 24.", "Both 240 + 40 and 320 − 40 equal 280."],
    ["140 ÷ 5 = 28.", "320 ÷ 5 = 64.", "540 ÷ 4 = 135."],
    ["864 ÷ 24 = 36.", "585 ÷ 13 = 45.", "1,596 ÷ 28 = 57."],
    ["23 × 10 = 230, proving the row represents tens.", "620 ÷ 20 = 31.", "1,380 ÷ 30 = 46."],
    ["1,488 is 12 below the estimate 1,500.", "3,066 is reasonably near 2,800 and exceeds it because the exact factors are larger overall.", "4,872 is below 5,400, as expected after both factors were rounded upwards."],
    ["204 ÷ 6 = 34.", "378 ÷ 14 = 27.", "1,334 ÷ 23 = 58, and it is close to the estimate 1,200."]
  ];
  const divSpecificChecks = [
    ["5 × 6 = 30.", "7 × 6 = 42.", "For example, 6 × 7 = 42 gives 42 ÷ 6 = 7 and 42 ÷ 7 = 6."],
    ["4 × 5 = 20.", "6 × 4 + 3 = 27, with 3 < 6.", "8 × 12 = 96."],
    ["7 × 5 = 35 and 7 × 7 = 49; both are below 50.", "6 × 15 = 90.", "156 is four less than 160, so its quotient is just below 20."],
    ["8 × 23 = 184.", "5 × 39 = 195.", "7 × 48 = 336."],
    ["7 × 12 = 84.", "6 × 15 + 5 = 95 and 5 < 6.", "11 × 13 = 143."],
    ["6 × 16 + 1 = 97 and 1 < 6.", "9 × 16 + 1 = 145 and 1 < 9.", "11 × 23 = 253, so the remainder is zero."],
    ["11.25 × 4 = 45.", "6.25 × 8 = 50.", "12.5 × 6 = 75."],
    ["64 × 1.5 = 96.", "112 × 0.5 = 56.", "18 × 0.4 = 7.2."]
  ];
  const revisions = {
    formalMultiplication: {
      intro: "Written multiplication is place value made visible. We will begin with equal groups and arrays, split factors into hundreds, tens and ones, explain every regrouping and placeholder and finish by checking products against estimates and inverse division.",
      sections: multiplication.sections.map((s, i) => section(s, multIntros[i], multStates[i], [...multSpecificChecks[i], multHardChecks[i]], multiplicationIds[i], multHard[i]))
    },
    formalDivision: {
      intro: "Written division counts equal groups. We will use multiplication facts and friendly multiples to see how many groups fit, explain what remains, continue into fractions or decimals when appropriate and verify every answer by multiplying back.",
      sections: division.sections.map((s, i) => section(s, divIntros[i], divStates[i], [...divSpecificChecks[i], divHardChecks[i]], divisionIds[i], divHard[i]))
    }
  };
  applyEditorialRevisions(lessons, revisions);
}
