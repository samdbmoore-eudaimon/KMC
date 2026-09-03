import { simple, swc, clear, applyEditorialRevisions } from "./lesson-editor-runtime.js";

function section(original, teaching, states, checks, ids, formats = ["simple", "state-work-conclude", "state-work-conclude", "clear"]) {
  return {
    h: original.h,
    body: teaching,
    examples: original.examples.map((old, i) => {
      const config = {
        q: old.q,
        state: states[i],
        steps: old.steps.map(step => String(step).replace(/^\((.*)\)$/, "$1")),
        answer: old.answer,
        conclusion: old.answer,
        check: checks[i],
        structureId: ids[i],
        difficulty: i + 1,
      };
      if (formats[i] === "simple") return simple(config);
      if (formats[i] === "clear") return clear({
        ...config,
        comprehend: states[i],
        link: `The useful mathematical relationship is shown in the first worked step: ${config.steps[0]}`,
        explain: "Use that relationship in order, keeping the position or fraction value unchanged at each step.",
        review: checks[i],
      });
      return swc(config);
    }),
  };
}

export function applyPrimaryEditorP03(lessons) {
  const sequence = lessons.sequencePattern;
  const fractions = lessons.fractionEquivalence;
  const revisions = {
    sequencePattern: {
      intro: "A sequence is an ordered list. Some sequences repeat a fixed block, while others grow or shrink according to a rule. We will learn how to describe the rule, reach distant terms without writing every term and check that a proposed pattern really continues.",
      sections: [
        section(sequence.sections[0], [
          "A pattern repeats when the same shortest block returns in the same order. In red, blue, red, blue, the block red, blue repeats. We call one copy of that block a cycle.",
          "Do not decide after seeing only one possible repeat. Check that the block works all the way through the part of the pattern you can see. For red, blue, blue, red, blue, blue, the shortest cycle is red, blue, blue, not merely red, blue.",
          "Each place in the cycle has a fixed role. In a three-item cycle, positions 1, 4, 7 and 10 all match the first item because each is three places after the previous one.",
          "For a distant position, divide its number by the cycle length. The remainder tells us the position inside the cycle; a remainder of zero means the final position in the cycle."
        ], [
          "The colour block has three lights. We need the place inside that block which matches position 28.",
          "The block has four colours, and position 11 lies somewhere in its third copy.",
          "We need to use division to locate position 23 inside a four-colour cycle.",
          "We must identify the shortest block which, when repeated, produces the entire visible pattern."
        ], [
          "Write the first ten positions: positions 1, 4, 7 and 10 are green. Continuing by threes makes position 28 green.",
          "Two full blocks use 8 places; the next colours are yellow at 9, green at 10 and white at 11.",
          "Five full blocks use 20 places. Counting three more reaches the third colour, white.",
          "Repeat heart, star three times. It reproduces all six items with no missing or extra symbol."
        ], ["cycle_position_forward", "cycle_position_forward", "two_attribute_combo", "two_stage_sequence"]),
        section(sequence.sections[1], [
          "A cycle is one complete copy of a repeating block. Its cycle length is the number of items in that block.",
          "To find the shortest cycle, begin with the shortest possible block and test it. A block is valid only if repeating it recreates every shown item in order.",
          "In cat, cat, dog, cat, cat, dog, the block cat, cat, dog works and has length 3. A one-item or two-item block fails, so 3 is the shortest cycle length.",
          "Once the cycle length is known, the same division-and-remainder method can locate any distant term."
        ], [
          "We need the shortest group that repeats to make the whole animal pattern.",
          "We must find where the colour sequence restarts and count one complete block.",
          "There are two tasks: find the cycle length, then locate the 50th item in that cycle.",
          "We must test that red, blue, blue is both a working repeat and the shortest working repeat."
        ], [
          "Repeating cat, cat, dog three times gives all nine terms. Shorter blocks do not.",
          "The four-item block appears three times exactly, so its length is 4.",
          "Writing ten complete five-item cycles ends each cycle with 5, so term 50 is 5.",
          "Two copies of red, blue, blue give the six shown items, while blocks of length 1 or 2 fail."
        ], ["identify_rule_from_terms", "cycle_position_forward", "count_backward_from_end", "derive_nth_term_rule"]),
        section(sequence.sections[2], [
          "A term's position tells us where it stands: first, second, third and so on. Positions start at 1, not 0.",
          "For a nearby term, writing the pattern and numbering every item is a safe method. This also reveals which positions belong to each item in the cycle.",
          "In red, blue, green, red, blue, green, red, blue, green, the green terms occupy positions 3, 6 and 9. Their positions increase by the cycle length, 3.",
          "A reverse question gives an item and asks for its next position. Find that item's place inside one cycle, then add whole cycle lengths until the position is beyond the stated point."
        ], [
          "Red is first in each four-flag cycle. We need the first red position greater than 7.",
          "Green is third in each three-flag cycle. We need the next such position after 9.",
          "Purple is third in each three-flag cycle. We need the first matching position greater than 15.",
          "We will number each item up to position 9 and read the final term."
        ], [
          "Red positions are 1, 5, 9 and so on. Nine is the first one greater than 7.",
          "Green positions are 3, 6, 9, 12. The first after 9 is 12.",
          "Purple positions are 3, 6, 9, 12, 15, 18. The first after 15 is 18.",
          "Numbering the written list confirms that every third term is green and position 9 is green."
        ], ["cycle_position_forward", "reverse_position_lookup", "reverse_position_lookup", "term_membership_check"]),
        section(sequence.sections[3], [
          "Writing every term becomes slow when the requested position is large. Division lets us remove complete cycles at once.",
          "Suppose a cycle has length 5 and we need term 23. Since 23 = 4 × 5 + 3, four complete cycles use 20 places and three places remain. We land on the third item.",
          "The remainder is a position inside one cycle. Remainder 1 means the first item, remainder 2 the second and so on. Remainder 0 is the special case explained next: it means the last item.",
          "Always state the cycle before dividing. Using the wrong cycle length gives a neat calculation but the wrong pattern position."
        ], [
          "The cycle length is 5. We need the remainder when 23 is divided into groups of 5.",
          "The rainbow cycle has seven colours. Position 30 must be reduced to a position from 1 to 7.",
          "The letter cycle has eight positions, so divide 100 by 8 and interpret the remainder.",
          "Only the position within a six-place cycle is required, not the item itself."
        ], [
          "Four cycles use 20 terms and the next three are A, B, C, confirming C.",
          "Four cycles use 28 terms; positions 29 and 30 are red and orange.",
          "Twelve cycles use 96 terms; counting a, b, c, d reaches d at 100.",
          "Sixteen cycles use 96 places and four remain, so the fourth cycle position is correct."
        ], ["cycle_position_forward", "cycle_position_forward", "count_backward_from_end", "term_membership_check"]),
        section(sequence.sections[4], [
          "When division leaves remainder zero, the requested position completes a whole cycle exactly. It belongs to the last item of that cycle.",
          "For the cycle A, B, C, term 6 is C. Six divided by three is two remainder zero: two complete cycles have ended at their third item.",
          "Do not invent a ‘position zero’. Cycle positions are numbered from 1 to the cycle length. Zero remainder is simply our signal for the final position.",
          "A useful check is to examine the next term. After a zero-remainder term, the sequence returns to the first item of its cycle."
        ], [
          "Position 20 completes an exact number of four-item cycles.",
          "Position 30 completes an exact number of three-item cycles.",
          "We must locate two consecutive positions, one at the end of a cycle and one at the start of the next.",
          "Position 12 completes two six-item cycles, so it must be the final item."
        ], [
          "Five copies of 1, 2, 3, 4 end at position 20 with 4.",
          "Ten copies of X, Y, Z end at position 30 with Z.",
          "Term 99 ends the eleventh cycle at 9; term 100 begins the next cycle at 1.",
          "Write two cycles: A, B, C, D, E, F, A, B, C, D, E, F. The 12th item is F."
        ], ["cycle_position_forward", "count_backward_from_end", "count_backward_from_end", "term_membership_check"]),
        section(sequence.sections[5], [
          "Not every sequence repeats. An arithmetic sequence changes by the same amount at every step. Each number in a sequence is called a term.",
          "In 2, 5, 8, 11, the change is +3 each time. This steady change is called the common difference. Find it by subtracting one term from the term after it.",
          "Check at least two gaps. One matching gap may be a coincidence, but repeated equal gaps support the rule.",
          "Arithmetic sequences can decrease too. Then the common difference is negative: 20, 16, 12 has common difference −4."
        ], [
          "We need the constant jump in the sequence, then apply it once more after 30.",
          "Find the difference between consecutive terms and continue the same change.",
          "Check that the same increase occurs more than once before extending the sequence.",
          "The question asks for the common difference itself, not the next term."
        ], [
          "36 − 30 = 6, matching all earlier gaps of 6.",
          "46 − 38 = 8, and adding 8 to each earlier term produces the next shown term.",
          "43 − 34 = 9, the same as 16 − 7 and 25 − 16.",
          "Subtract consecutive terms: 11 − 7, 15 − 11 and 19 − 15 are all 4."
        ], ["arithmetic_next_term", "arithmetic_next_term", "derive_nth_term_rule", "compare_growth_two_sequences"]),
        section(sequence.sections[6], [
          "To reach a distant term in an arithmetic sequence, count the jumps rather than writing every term.",
          "The first term needs no jump. The second term is one jump away, the third is two jumps away and term n is n − 1 jumps away.",
          "If the first term is a and the common difference is d, term n is a + (n − 1) × d. The letters simply hold the places of numbers: start, number of jumps and jump size.",
          "To work backwards from a known value, subtract the first term and divide by the common difference. The result is the number of jumps, so add 1 to get the term number."
        ], [
          "The sequence starts at 6 and rises by 4. Term 20 is 19 jumps from the start.",
          "Term 15 is 14 equal jumps from the first term 3.",
          "We know the term value 100 and must work backwards to its position.",
          "The eighth term is seven jumps beyond the first term because the first term is already counted."
        ], [
          "The nearby fourth term is 6 + 3 × 4 = 18, matching the list; the same rule gives term 20 as 82.",
          "Check backwards: 59 − 3 = 56 and 56 ÷ 4 = 14 jumps, so 59 is term 15.",
          "Substitute n = 15: 2 + 14 × 7 = 100, so the recovered position works.",
          "Write eight terms: 3, 5, 7, 9, 11, 13, 15, 17."
        ], ["skip_count_nth_term_formula", "nth_term_formula_evaluation", "nth_term_formula_evaluation", "derive_nth_term_rule"]),
        section(sequence.sections[7], [
          "Begin every sequence problem by deciding what changes. Does a fixed block repeat, does a number change by a constant amount, or do two rules alternate?",
          "For a repeating cycle, use division and a remainder. For an arithmetic sequence, count equal jumps. More complicated questions may combine a position rule with a counting limit.",
          "Write down what each number means before calculating. A cycle length, a term position and a term value are different quantities even when they happen to use the same number.",
          "Finish by testing the answer in the original rule. A correct calculation must also fit the pattern and every condition in the question."
        ], sequence.sections[7].examples.map((e, i) => [
          "We must identify the first special position, the spacing between special beads and the final allowed position.",
          "This problem combines a repeating position rule with a second condition; both must be satisfied.",
          "We need to compare two sequence rules at the same term number.",
          "The sequence changes by alternating operations, so one repeated difference will not describe it."
        ][i]), sequence.sections[7].examples.map((e, i) => [
          "List the special positions produced by the rule and confirm the last does not exceed 56.",
          "Test the final result against both stated conditions, not only the repeating one.",
          "Substitute the chosen term number into both rules and compare the resulting values.",
          "Apply the discovered pair of operations again; it must generate the next terms in order."
        ][i]), ["arithmetic_next_term", "two_attribute_combo", "compare_growth_two_sequences", "alternating_operation_sequence"])
      ]
    },
    fractionEquivalence: {
      intro: "Equivalent fractions are different names for the same amount. We will build the idea with equal pieces, explain why scaling works, simplify fractions, compare them fairly and connect fractions with mixed numbers, decimals and percentages.",
      sections: fractions.sections.map((original, si) => {
        const teaching = [
          ["A fraction describes equal parts of one whole. The denominator tells how many equal parts make the whole; the numerator tells how many of those parts are selected.", "In 3/4, the whole is split into four equal pieces and three are selected. Equal size matters: three pieces of different sizes cannot all be called quarters.", "The fraction line also means division. Therefore 3/4 is the number found by 3 ÷ 4, and it marks one exact point on a number line.", "Always identify the whole. Three out of four apples and three out of four boxes are both 3/4, but the physical amounts may differ because the wholes differ."],
          ["Equivalent fractions have different numerators or denominators but represent the same amount. One half and two quarters cover the same part of an equal-sized whole.", "Imagine cutting each half into two equal pieces. The selected half becomes two selected quarters, while the amount shaded does not change: 1/2 = 2/4.", "Equivalent fractions land on the same point of a number line. The labels change because the size of the named pieces changes, not because the quantity moves.", "A picture, a scaling calculation or a cross-product check can all establish equivalence."],
          ["To make an equivalent fraction, multiply the numerator and denominator by the same whole number. This splits every old piece into the same number of smaller equal pieces.", "For 2/3 with denominator 12, the denominator is multiplied by 4. The two selected thirds also split into four pieces each, so the numerator becomes 2 × 4 = 8.", "The scale factor must be identical on top and bottom. Changing only one part changes the fraction's value.", "When one required number is given, find the scale factor first, then apply it to the other number."],
          ["Multiplying numerator and denominator by the same number is the same as multiplying the fraction by 1. For example, 2/2 equals one whole.", "Thus 2/5 × 2/2 = 4/10. The written parts are smaller and more numerous, but multiplying by 1 leaves the amount unchanged.", "A picture gives the same reason: each fifth is cut into two tenths, so two fifths become four tenths without adding any food or length.", "If the top and bottom use different scale factors, the multiplier is not equal to 1 and the value changes."],
          ["Simplifying reverses scaling. Divide numerator and denominator by the same common factor to write the same value with smaller numbers.", "A factor divides exactly with no remainder. In 12/18, 6 is a common factor because 12 ÷ 6 = 2 and 18 ÷ 6 = 3.", "A fraction is in simplest form when numerator and denominator share no factor greater than 1. Check again after each division so you do not stop too soon.", "Using the greatest common factor finishes in one step, but several correct smaller divisions reach the same simplest form."],
          ["Fractions can be compared fairly once they use equal-sized pieces. A common denominator rewrites both fractions using the same kind of part.", "For 2/3 and 3/5, fifteenths work because 15 is a multiple of both 3 and 5. The fractions become 10/15 and 9/15.", "With equal denominators, compare numerators: ten fifteenths is greater than nine fifteenths.", "The product of the denominators always works, although a smaller common multiple can make the arithmetic easier."],
          ["When denominators already match, the greater numerator gives the greater fraction. The pieces have equal size, so more pieces means more altogether.", "When numerators match, the smaller denominator gives the greater fraction. Dividing one whole into fewer equal parts makes each part larger.", "For example, 3/7 is greater than 3/10: both select three pieces, but sevenths are larger than tenths.", "These shortcuts need their stated matching part. If neither numerator nor denominator matches, rewrite the fractions with a common denominator."],
          ["Fractions can describe amounts greater than one. An improper fraction has a numerator at least as large as its denominator; the name does not mean it is wrong.", "Four quarters make one whole, so 5/4 is one whole and one quarter. A mixed number writes this as 1 1/4.", "To change an improper fraction to a mixed number, divide numerator by denominator. The quotient counts wholes and the remainder counts leftover parts.", "To reverse the process, multiply the whole number by the denominator, add the numerator and keep the denominator."],
          ["Fractions, decimals and percentages can name the same number. For example, 1/2 = 0.5 = 50%.", "The fraction line means division, so 3/4 becomes 3 ÷ 4 = 0.75. A percentage means parts per hundred, so 0.75 is 75 hundredths or 75%.", "A terminating decimal can become a fraction through place value. The decimal 0.375 is 375/1000, which simplifies to 3/8.", "To compare mixed forms, convert every value into one common form, then compare digits or equal-sized fraction parts."],
        ][si];
        const states = [
          ["The strip is one whole divided into six equal pieces, and exactly one piece is selected.", "All ten beads form the whole; the seven blue beads form the selected part.", "A denominator counts equal-sized parts, so we must explain why unequal pieces cannot share one fraction name.", "In 2/5, the lower number names the number of equal parts in the whole."],
          ["We will split each half into two equal smaller pieces without changing the shaded amount.", "The denominator grows from 3 to 6, so each old third is split into two sixths.", "We need to decide whether both numerator and denominator have been enlarged by the same factor.", "Four of eight equal slices are selected, so compare 4/8 with the halfway fraction 1/2."],
          ["The target denominator is 12. First find the factor that changes 3 into 12.", "The target denominator is five times 8, so the numerator must also be multiplied by five.", "The numerator changes from 7 to 35. Its scale factor must also be used on 12.", "The denominator changes from 5 to 20, and the numerator must follow the same scale."],
          ["The fraction is being multiplied by 2/2, so we must explain why that multiplier equals one.", "The denominator grows from 7 to 28 by a factor of four; the numerator must show the same factor.", "The proposed change uses different multipliers on the top and bottom, so it cannot preserve the value.", "We must compare changing both numbers with changing only the numerator."],
          ["Both 12 and 18 must be divided by a shared factor until no common factor greater than one remains.", "We need the simplest equivalent name for 18/24, not merely one smaller name.", "This fraction may need more than one division, so we will check the result after each step.", "We need a common factor of 10 and 15 and must confirm the final numerator and denominator are coprime."],
          ["The denominators 4 and 8 can both be expressed as eighths, giving equal-sized pieces.", "Thirds and fifths differ in size, so rewrite both fractions as fifteenths.", "All three denominators must be changed to one common multiple before their numerators can be ordered.", "The question supplies tenths as the common pieces, so convert both fractions to tenths."],
          ["Both fractions select three pieces. The denominator tells us whether those pieces are sevenths or smaller tenths.", "Both fractions select five pieces, so the fraction with the larger individual pieces will be greater.", "The classes have the same number of pizza-choosing pupils but different class sizes.", "Both numerators are 4; compare the sizes of fifths and ninths."],
          ["Four quarters make one whole, so separate one group of four from the five quarters.", "We must find how many full groups of three fit in eleven and how many thirds remain.", "Each whole contains five fifths. Convert two wholes before adding the extra three fifths.", "Convert the mixed number and the improper fraction into matching parts before comparing."],
          ["Use division to give 1/2 a decimal name, then express the same value out of 100.", "Changing fifths into hundredths makes both the decimal and percentage visible.", "The three decimal places in 0.375 mean 375 thousandths, which must then be simplified.", "Convert the fraction, percentage and decimal to decimals with two places before ordering them."],
        ][si];
        const checks = [
          ["One selected piece out of six equal pieces is exactly 1/6.", "Seven blue plus three non-blue beads account for all ten, confirming 7/10.", "If the pieces are unequal, choosing one large piece and one small piece would give different amounts although both were called one part; this contradiction shows why equality is required.", "A drawing split into five equal pieces with two shaded confirms that 5 describes the whole partition."],
          ["Two quarters can be joined into one of the two equal halves, so 1/2 and 2/4 cover the same area.", "Cross-products give 1 × 6 = 6 and 2 × 3 = 6.", "Cross-products give 3 × 8 = 24 and 6 × 4 = 24, confirming equality.", "Four selected slices and four unselected slices make two equal groups, so the amount is exactly half."],
          ["Reverse the scaling: 8 ÷ 4 = 2 and 12 ÷ 4 = 3.", "Divide 25/40 by 5/5 to return to 5/8.", "Divide 35 and 60 by 5 to return to 7 and 12.", "Divide 12/20 by 4/4 to return to 3/5."],
          ["Since 2/2 = 1, 2/5 × 1 must still equal 2/5.", "Cross-products give 3 × 28 = 84 and 12 × 7 = 84.", "For 2/3 and 4/5, the cross-products are 10 and 12, so they are not equal; 4/6 gives 12 and 12.", "One half is 0.5, while two halves are 1. Doubling only the numerator therefore changed the amount."],
          ["Multiply 2/3 by 6/6 to rebuild 12/18.", "Multiply 3/4 by 6/6 to rebuild 18/24.", "Multiply 5/7 by 12/12 to rebuild 60/84.", "Multiply 2/3 by 5/5 to rebuild 10/15."],
          ["3/4 = 6/8, and 6/8 is one eighth greater than 5/8.", "Cross-products also give 2 × 5 = 10 and 3 × 3 = 9, confirming 2/3 is greater.", "The converted numerators 30, 28 and 27 use the same denominator 36, so their order is unambiguous.", "Five tenths and six tenths differ by one tenth, confirming 3/5 is greater."],
          ["Three sevenths and three tenths use the same count, while each seventh is larger.", "A ninth is larger than a twelfth, so five ninths must exceed five twelfths.", "Seven pupils out of the smaller class form the larger share; cross-products 7 × 13 and 7 × 11 confirm it.", "Four fifths is close to one whole, while four ninths is below one half, confirming 4/5 is greater."],
          ["Convert 1 1/4 back: one whole is 4/4, and 4/4 + 1/4 = 5/4.", "Three wholes are 9/3; adding 2/3 returns to 11/3.", "Divide 13 by 5: the quotient is 2 and remainder 3, returning to 2 3/5.", "34/12 exceeds 33/12 by 1/12, so the stated comparison and difference are correct."],
          ["0.5 contains 50 hundredths, so it is 50%.", "0.6, 0.60 and 60/100 occupy the same point on the number line.", "3/8 = 0.375 because 3 ÷ 8 = 0.375.", "The decimals are 0.68, 0.70 and 0.72, which increase in the stated order."],
        ][si];
        const ids = [
          ["read_fraction_from_grid", "read_fraction_from_grid", "distance_from_whole_comparison", "equivalence_chain_three_steps"],
          ["scale_to_equivalent", "missing_term_in_chain", "cross_multiply_check_equivalence", "equivalence_chain_three_steps"],
          ["scale_to_equivalent", "scale_to_equivalent", "cross_multiply_check_equivalence", "equivalence_chain_three_steps"],
          ["scale_to_equivalent", "cross_multiply_check_equivalence", "cross_multiply_check_equivalence", "equivalence_chain_three_steps"],
          ["simplify_to_lowest_terms", "simplify_to_lowest_terms", "simplify_multistep", "simplify_multistep"],
          ["scale_to_equivalent", "missing_term_in_chain", "compare_via_common_denominator", "compare_via_common_denominator"],
          ["same_numerator_comparison", "same_numerator_comparison", "compare_via_common_denominator", "compare_via_common_denominator"],
          ["read_fraction_from_grid", "order_four_mixed_denominators", "missing_denominator_reverse", "order_four_mixed_denominators"],
          ["scale_to_equivalent", "scale_to_equivalent", "simplify_multistep", "order_four_mixed_denominators"],
        ][si];
        return section(original, teaching, states, checks, ids);
      })
    }
  };
  applyEditorialRevisions(lessons, revisions);
}
