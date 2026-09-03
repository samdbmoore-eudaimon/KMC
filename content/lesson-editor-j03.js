import { applyEditorialRevisions, clear, simple, swc } from "./lesson-editor-runtime.js";

const revisions = {
  fractionUnusual: {
    intro: "Fractions describe equal parts of a whole. Their rules make sense when we keep asking what size the parts are and how many of those parts we have. This lesson secures the main fraction methods, extends them to negative values and division, then connects the same multiplicative thinking to ratios, reverse operations, calculation order and percentage change.",
    recap: [
      "Equivalent fractions name the same amount because numerator and denominator are scaled by the same factor.",
      "Add or subtract fractions only after making the parts the same size.",
      "To divide by a fraction, multiply by its reciprocal because the reciprocal makes the divisor equal to 1.",
      "Ratios preserve multiplication, not addition, and their order follows the labels in the question.",
      "Percentage multipliers include the original 100% as well as the change."
    ],
    mistakes: [
      "Adding denominators as though unlike-sized pieces could be combined directly.",
      "Cancelling across addition or subtraction instead of across multiplication.",
      "Reversing the first fraction rather than the divisor in a division.",
      "Changing both parts of a ratio by the same addition rather than the same multiplication.",
      "Assuming an increase followed by the same percentage decrease returns to the starting value."
    ],
    sections: [
      {
        h: "1. Fractions name equal-sized parts",
        body: [
          "In the fraction 3/4, the denominator 4 tells us that one whole has been divided into four equal parts. The numerator 3 tells us that we have three of those parts. Both numbers are needed because three quarters is a different amount from three fifths.",
          "Equivalent fractions use different names for the same amount. If every quarter is cut into two equal pieces, 3/4 becomes 6/8. We multiplied both numerator and denominator by 2, so the amount did not change.",
          "Simplifying reverses that process. In 18/24, both numbers are divisible by 6. Dividing both by 6 gives 3/4. We must divide the numerator and denominator by the same non-zero number, otherwise we change the fraction's value.",
          "Fractions can be added only when their parts are the same size. Thirds and quarters are different pieces, so 2/3 + 1/4 must first be renamed in twelfths. Twelfths work because 12 is a multiple of both 3 and 4.",
          "When multiplying fractions, we are taking a part of a part. Multiply numerators and denominators. Common factors may be divided out before multiplying because the whole calculation is one product. This shortcut is called cancelling, but it is really simplification, not numbers vanishing.",
          "Fractions, decimals and percentages can name the same point on a number line. Converting them to one form lets us compare like with like."
        ],
        note: "Change the name of a fraction without changing its value by scaling the numerator and denominator by the same factor.",
        examples: [
          simple({ q: "Simplify 18/24 fully.", state: "We need an equivalent fraction whose numerator and denominator have no common factor greater than 1.", steps: ["The greatest common factor of 18 and 24 is 6.", "Divide the numerator by 6: 18 ÷ 6 = 3.", "Divide the denominator by 6: 24 ÷ 6 = 4."], answer: "3/4", conclusion: "18/24 simplifies to 3/4", check: "Scale back by 6: 3 × 6 = 18 and 4 × 6 = 24. Also, 3 and 4 have no common factor greater than 1.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 1 }),
          swc({ q: "Work out 2/3 + 1/4.", state: "The parts are thirds and quarters, so we must rename both fractions using equal-sized parts before adding.", steps: ["The smallest common multiple of 3 and 4 is 12, so use twelfths.", "Multiply top and bottom of 2/3 by 4: 2/3 = 8/12.", "Multiply top and bottom of 1/4 by 3: 1/4 = 3/12.", "Add the counts of twelfths: 8/12 + 3/12 = 11/12."], answer: "11/12", conclusion: "2/3 + 1/4 = 11/12", check: "The answer is less than 1 because 2/3 is about 0.67 and 1/4 is 0.25. Also, 8 twelfths plus 3 twelfths is exactly 11 twelfths.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 2 }),
          swc({ q: "Work out 3/5 × 10/21 and simplify.", state: "This is one multiplication, so common factors may be removed from a numerator and a denominator before we multiply.", steps: ["The factor 3 appears in 3 and 21. Divide both by 3 to get 1 and 7.", "The factor 5 appears in 5 and 10. Divide both by 5 to get 1 and 2.", "The product is now (1 × 2)/(1 × 7) = 2/7."], answer: "2/7", conclusion: "3/5 × 10/21 = 2/7", check: "Multiply without cancelling: 3 × 10 over 5 × 21 gives 30/105. Dividing both by 15 gives 2/7.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 3 }),
          clear({ q: "Put 5/8, 0.61 and 63% in ascending order.", state: "Ascending order means smallest to largest. We need all three values in a common form before comparing them.", comprehend: "One value is a fraction, one a decimal and one a percentage. Decimals will make their place values easy to compare.", link: "Divide 5 by 8 to convert the fraction, and divide a percentage by 100 to convert it to a decimal.", explain: "Write each value to three decimal places, then compare tenths, hundredths and thousandths from left to right.", steps: ["Convert 5/8: 5 ÷ 8 = 0.625.", "Write 0.61 as 0.610 so all places line up.", "Convert 63%: 63 ÷ 100 = 0.630.", "Compare 0.610, 0.625 and 0.630: 0.610 < 0.625 < 0.630."], answer: "0.61, 5/8, 63%", conclusion: "In ascending order they are 0.61, 5/8 and 63%", check: "Convert all three to percentages: 61%, 62.5% and 63%. This confirms the same order.", review: "The values increase from 61% to 62.5% to 63%.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 4 })
        ]
      },
      {
        h: "2. Negative fractions lie below zero",
        body: [
          "A negative fraction is a fraction whose value is below zero. The expressions −3/4, (−3)/4 and 3/(−4) all mean negative three quarters. A single negative sign makes the whole value negative.",
          "If both numerator and denominator are negative, the quotient is positive. For example, (−5)/(−8) = 5/8. One way to see this is that 5/8 × 8 = 5, while (−5)/(−8) must be the positive number that satisfies the same size relationship.",
          "On a number line, numbers become greater as we move right. Therefore −2/3 is smaller than −3/5 because −2/3 is about −0.667 and lies farther left than −0.6. The fraction with the larger distance below zero is the smaller number.",
          "For addition and subtraction, first make the denominator common just as you would with positive fractions. Then combine the signed numerators. The denominator continues to describe the part size.",
          "For multiplication and division, decide the sign and the size separately. Matching signs give a positive result. Different signs give a negative result."
        ],
        note: "A number farther below zero is smaller, even when its unsigned fraction looks larger.",
        examples: [
          simple({ q: "Work out 7/9 + (−1/6) and simplify.", state: "Adding negative one sixth has the same effect as subtracting one sixth. We need equal-sized parts before combining the signed amounts.", steps: ["Use eighteenths: 7/9 = 14/18 and −1/6 = −3/18.", "Add the signed numerators: 14/18 + (−3/18) = 11/18.", "The numbers 11 and 18 have no common factor, so the result is fully simplified."], answer: "11/18", conclusion: "7/9 + (−1/6) = 11/18", check: "Adding 3/18 back to 11/18 gives 14/18, which is 7/9.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 1 }),
          simple({ q: "Write (−5)/(−8) as an equivalent positive fraction.", state: "The numerator and denominator have matching negative signs, so their quotient is positive.", steps: ["A negative divided by a negative is positive.", "Keep the sizes 5 and 8 and remove the two signs: 5/8."], answer: "5/8", conclusion: "(−5)/(−8) is equal to 5/8", check: "Both (−5) ÷ (−8) and 5 ÷ 8 equal 0.625.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 2 }),
          swc({ q: "Which is smaller: −2/3 or −3/5?", state: "Both numbers are negative. We will use fifteenths so their positions below zero can be compared exactly.", steps: ["Multiply top and bottom of −2/3 by 5: −2/3 = −10/15.", "Multiply top and bottom of −3/5 by 3: −3/5 = −9/15.", "On the number line, −10/15 lies one fifteenth farther left than −9/15.", "Therefore −2/3 is smaller."], answer: "−2/3", conclusion: "−2/3 is the smaller fraction", check: "As decimals, −2/3 is about −0.667 and −3/5 is −0.6. Since −0.667 < −0.6, the order agrees.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 3 }),
          clear({ q: "Work out −3/4 + 5/6 and simplify.", state: "The fractions have different signs and different denominators. We need common-sized parts, then we can find the difference between their signed counts.", comprehend: "Twelfths are the smallest parts that both quarters and sixths can be renamed as.", link: "Write −3/4 as −9/12 and 5/6 as 10/12. Adding a negative amount is the same as finding 10/12 − 9/12.", explain: "Convert each fraction without changing its value, then combine the signed numerators.", steps: ["Multiply top and bottom of −3/4 by 3: −3/4 = −9/12.", "Multiply top and bottom of 5/6 by 2: 5/6 = 10/12.", "Add: −9/12 + 10/12 = (−9 + 10)/12 = 1/12."], answer: "1/12", conclusion: "−3/4 + 5/6 = 1/12", check: "Since 5/6 is slightly larger than 3/4, a small positive answer is sensible. Also, 1/12 + 9/12 = 10/12.", review: "Equal-sized twelfths show that the positive part exceeds the negative part by one twelfth.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 4 })
        ]
      },
      {
        h: "3. Dividing by a fraction counts how many pieces fit",
        body: [
          "The calculation 3 ÷ 1/4 asks how many quarter-sized pieces fit into 3 wholes. Each whole contains 4 quarters, so 3 wholes contain 3 × 4 = 12 quarters. This is why division by a positive fraction smaller than 1 can make the result larger.",
          "The reciprocal of a non-zero fraction is the fraction made by swapping its numerator and denominator. The reciprocal of 2/5 is 5/2. Their product is 2/5 × 5/2 = 10/10 = 1.",
          "Suppose we want 6 ÷ 3/4. Multiplying both parts of this division by 4/3 does not change the quotient. The divisor becomes 3/4 × 4/3 = 1, while 6 becomes 6 × 4/3. Dividing by 1 changes nothing, so 6 ÷ 3/4 = 6 × 4/3.",
          "This explains the rule: keep the first number, change division to multiplication and use the reciprocal of the second number. The second number is the divisor, so it is the one being made into 1.",
          "The divisor cannot be zero because zero has no reciprocal and division by zero is undefined."
        ],
        note: "Take the reciprocal of the divisor, which is the second number, not the first fraction.",
        examples: [
          simple({ q: "Work out 2 ÷ 1/2.", state: "The question asks how many half-sized pieces fit into 2 wholes.", steps: ["Each whole contains 2 halves.", "Two wholes therefore contain 2 × 2 = 4 halves."], answer: "4", conclusion: "Four halves fit into 2", check: "Multiply the number of pieces by their size: 4 × 1/2 = 2.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 1 }),
          swc({ q: "Work out 3/4 ÷ 2.", state: "Sharing three quarters equally between 2 means taking one half of three quarters.", steps: ["Write 2 as 2/1, whose reciprocal is 1/2.", "Change the division to multiplication: 3/4 × 1/2.", "Multiply: (3 × 1)/(4 × 2) = 3/8."], answer: "3/8", conclusion: "3/4 ÷ 2 = 3/8", check: "Two groups of 3/8 total 6/8 = 3/4.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 2 }),
          swc({ q: "Work out 5/6 ÷ 2/3 and give the answer as a mixed number.", state: "The divisor is 2/3, so multiply 5/6 by its reciprocal 3/2.", steps: ["Rewrite: 5/6 × 3/2.", "Divide 3 and 6 by 3, leaving 1 and 2.", "Multiply: 5/(2 × 2) = 5/4.", "Convert 5/4 to the mixed number 1 1/4."], answer: "5/4, or 1 1/4", conclusion: "5/6 ÷ 2/3 = 1 1/4", check: "Multiply the quotient by the divisor: 5/4 × 2/3 = 10/12 = 5/6.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 3 }),
          clear({ q: "Work out 6 ÷ 3/4 and explain why the answer is greater than 6.", state: "We need the number of three-quarter pieces that fit into 6 wholes, and we must explain the size of the result.", comprehend: "A three-quarter piece is smaller than one whole, so more than six such pieces will fit into 6.", link: "Multiply by the reciprocal 4/3 because 3/4 × 4/3 = 1.", explain: "Rewrite 6 as 6/1, multiply and simplify before interpreting the quotient as a count of pieces.", steps: ["Write the division as multiplication by the reciprocal: 6/1 × 4/3.", "Divide 6 and 3 by 3, leaving 2 and 1.", "Multiply: 2 × 4 = 8.", "Therefore eight pieces of size 3/4 fit into 6."], answer: "8", conclusion: "6 ÷ 3/4 = 8, which is greater than 6 because each counted piece is smaller than one whole", check: "Eight three-quarter pieces have total size 8 × 3/4 = 24/4 = 6.", review: "The reverse multiplication returns to 6 and the answer's size matches the meaning of the division.", structureId: "fractionUnusual_route_1_fractionUnusual", difficulty: 4 })
        ]
      },
      {
        h: "4. A ratio records a multiplicative comparison",
        body: [
          "If a drink uses 2 cups of orange juice for every 3 cups of lemonade, the ratio of orange to lemonade is 2:3. The colon is read as 'to'. The ratio records how the two amounts compare, not the total amount in the jug.",
          "Order matters. Orange to lemonade is 2:3, but lemonade to orange is 3:2. Write labels above the two ratio numbers before calculating so that the order cannot silently reverse.",
          "Equivalent ratios are made by multiplying or dividing every part by the same positive factor. The ratio 2:3 can become 4:6 or 10:15. Adding the same number to both parts does not usually preserve the comparison.",
          "To share a total, add the ratio parts to find how many equal parts the whole contains. Divide the total by that number to find one part, then multiply by the number of parts belonging to the requested share.",
          "Always reconstruct the total at the end. The shares must add to the supplied amount and must still have the stated ratio."
        ],
        note: "Label the ratio, find total parts, find one part, then build each share.",
        examples: [
          simple({ q: "A garden has 3 rose bushes for every 7 tulip clumps. Write the ratio of tulips to roses.", state: "The question asks for tulips first and roses second.", steps: ["There are 7 tulip clumps for every 3 rose bushes.", "Write the values in the requested order: tulips : roses = 7:3."], answer: "7:3", conclusion: "The ratio of tulips to roses is 7:3", check: "Reading 7:3 aloud gives '7 tulip clumps for every 3 rose bushes', exactly matching the garden.", structureId: "fractionUnusual_route_2_ratioChain", difficulty: 1 }),
          swc({ q: "Tom and Jess share 36 stickers in the ratio 2:4. How many stickers does Tom receive?", state: "Tom owns 2 ratio parts and Jess owns 4, so the 36 stickers are divided into 6 equal parts.", steps: ["Total parts: 2 + 4 = 6.", "One part: 36 ÷ 6 = 6 stickers.", "Tom has 2 parts: 2 × 6 = 12 stickers."], answer: "12 stickers", conclusion: "Tom receives 12 stickers", check: "Jess receives 4 × 6 = 24 stickers. The total is 12 + 24 = 36 and 12:24 simplifies to 2:4.", structureId: "fractionUnusual_route_2_ratioChain", difficulty: 2 }),
          swc({ q: "Nia and Rowan share £56 in the ratio 4:3. How much does Rowan receive?", state: "Nia has 4 parts and Rowan has 3. We need the value of Rowan's 3 parts.", steps: ["Total parts: 4 + 3 = 7.", "One part: £56 ÷ 7 = £8.", "Rowan's share: 3 × £8 = £24."], answer: "£24", conclusion: "Rowan receives £24", check: "Nia receives 4 × £8 = £32. The shares total £56 and £32:£24 simplifies to 4:3.", structureId: "fractionUnusual_route_2_ratioChain", difficulty: 3 }),
          clear({ q: "Asha, Ben and Cora share 120 sweets in the ratio 1:3:6. How many sweets does each child receive?", state: "The three ratio numbers describe 10 equal parts of the same total. We need all three shares.", comprehend: "Asha has 1 part, Ben has 3 parts and Cora has 6 parts. Their shares must add to 120.", link: "Find one part by dividing 120 by 1 + 3 + 6, then multiply that unit value by each child's number of parts.", explain: "Keep the names attached to the ratio positions and check both the total and the simplified comparison.", steps: ["Total parts: 1 + 3 + 6 = 10.", "One part: 120 ÷ 10 = 12 sweets.", "Asha receives 1 × 12 = 12 sweets.", "Ben receives 3 × 12 = 36 sweets.", "Cora receives 6 × 12 = 72 sweets."], answer: "Asha 12, Ben 36 and Cora 72 sweets", conclusion: "The shares are 12, 36 and 72 sweets", check: "They total 12 + 36 + 72 = 120, and dividing all shares by 12 gives 1:3:6.", review: "Every child is matched to the correct ratio part and both checks succeed.", structureId: "fractionUnusual_route_2_ratioChain", difficulty: 4 })
        ]
      },
      {
        h: "5. Reverse a number machine in reverse order",
        body: [
          "A number machine begins with an input, performs operations in a fixed order and produces an output. If the input is hidden but the output is known, we can rebuild the input by undoing every operation.",
          "Addition and subtraction undo each other. Multiplication and division undo each other. These paired operations are called inverses because one reverses the effect of the other.",
          "The order must also reverse. If the forward machine adds 8 and then multiplies by 3, the backward machine divides by 3 first and subtracts 8 second. The last forward action is the first one we meet on the return journey.",
          "Write the forward chain before doing any arithmetic, then write the reverse chain beneath it. This prevents a correct inverse operation from being used at the wrong time.",
          "Check the recovered input by sending it through the original forward machine. The result must be the stated output."
        ],
        note: "Undo the last forward step first.",
        examples: [
          simple({ q: "What operation undoes 'subtract 9'? What operation undoes 'multiply by 7'?", state: "We need the inverse of each named operation.", steps: ["Adding 9 replaces the amount removed by subtracting 9.", "Dividing by 7 reverses making a number 7 times as large."], answer: "Add 9; divide by 7", conclusion: "Add 9 undoes subtract 9, and divide by 7 undoes multiply by 7", check: "For any test number, 12 − 9 + 9 = 12 and 12 × 7 ÷ 7 = 12.", structureId: "fractionUnusual_route_3_workBackwards", difficulty: 1 }),
          swc({ q: "A number is multiplied by 2 and the output is 14. Find the input.", state: "Multiplication by 2 is the only forward step, so divide the output by 2.", steps: ["Start from 14.", "Undo ×2 with ÷2: 14 ÷ 2 = 7."], answer: "7", conclusion: "The input was 7", check: "Run forwards: 7 × 2 = 14.", structureId: "fractionUnusual_route_3_workBackwards", difficulty: 2 }),
          swc({ q: "A number is increased by 8, then multiplied by 3. The output is 45. Find the input.", state: "The forward chain is +8, then ×3. The reverse chain is ÷3, then −8.", steps: ["Undo the multiplication: 45 ÷ 3 = 15.", "Undo the addition: 15 − 8 = 7."], answer: "7", conclusion: "The input was 7", check: "Run forwards: 7 + 8 = 15, then 15 × 3 = 45.", structureId: "fractionUnusual_route_3_workBackwards", difficulty: 3 }),
          clear({ q: "A number is reduced by 5, multiplied by 4 and then increased by 3. The output is 43. Find the input.", state: "Three operations were applied. We must undo +3, then ×4, then −5.", comprehend: "The forward chain is −5, ×4, +3. Reversing only the signs but not the order would not restore the input.", link: "The inverse chain is −3, ÷4, +5.", explain: "Start at the output, apply one inverse at a time and then use a forward check.", steps: ["Undo +3: 43 − 3 = 40.", "Undo ×4: 40 ÷ 4 = 10.", "Undo −5: 10 + 5 = 15."], answer: "15", conclusion: "The input was 15", check: "Run forwards: 15 − 5 = 10, 10 × 4 = 40 and 40 + 3 = 43.", review: "The reverse chain gives 15 and the forward machine returns exactly to 43.", structureId: "fractionUnusual_route_3_workBackwards", difficulty: 4 })
        ]
      },
      {
        h: "6. An agreed calculation order prevents ambiguity",
        body: [
          "The expression 2 + 3 × 4 could give 20 if we add first or 14 if we multiply first. A written expression needs one agreed meaning, so mathematicians use an order of operations.",
          "Brackets come first, then powers. Multiplication and division come next. Addition and subtraction come last. BIDMAS is a memory aid for this order.",
          "Multiplication and division have equal priority, so handle them from left to right. Addition and subtraction also share priority and are handled from left to right. The letters in BIDMAS do not mean division always beats multiplication.",
          "Work one stage at a time and rewrite the expression after each stage. Do not change a part that is waiting for a lower-priority operation.",
          "Brackets can deliberately change the meaning. Compare 2 + 3 × 4 = 14 with (2 + 3) × 4 = 20."
        ],
        note: "Equal-priority operations are completed from left to right.",
        examples: [
          simple({ q: "Work out 5 + 2 × 6.", state: "Multiplication has priority over addition.", steps: ["Calculate 2 × 6 = 12.", "Add 5: 5 + 12 = 17."], answer: "17", conclusion: "5 + 2 × 6 = 17", check: "The expression becomes 5 + 12, and that sum is 17.", structureId: "fractionUnusual_route_4_multiExpr", difficulty: 1 }),
          swc({ q: "Work out 30 ÷ 5 × 3.", state: "Division and multiplication have equal priority, so work from left to right.", steps: ["First calculate 30 ÷ 5 = 6.", "Then calculate 6 × 3 = 18."], answer: "18", conclusion: "30 ÷ 5 × 3 = 18", check: "The calculation asks for one fifth of 30, then three copies of that 6, giving 18.", structureId: "fractionUnusual_route_4_multiExpr", difficulty: 2 }),
          swc({ q: "Work out 48 ÷ 8 ÷ 2. Then explain why 12 is not correct.", state: "The two divisions share priority, so the left-hand division must be completed first.", steps: ["Calculate 48 ÷ 8 = 6.", "Continue left to right: 6 ÷ 2 = 3.", "The value 12 comes from 48 ÷ (8 ÷ 2), but those brackets are not present in the original expression."], answer: "3", conclusion: "48 ÷ 8 ÷ 2 = 3, not 12", check: "Reverse the two left-to-right divisions: 3 × 2 × 8 = 48.", structureId: "fractionUnusual_route_4_multiExpr", difficulty: 3 }),
          clear({ q: "Evaluate 36 ÷ 4 × 3 − 18 ÷ 6 × 2.", state: "Both sides of the subtraction contain equal-priority multiplication and division. Each chain must be completed from left to right before subtracting.", comprehend: "The expression has no brackets or powers. Multiplication and division are therefore the first stage, with subtraction waiting until both chains are complete.", link: "Treat 36 ÷ 4 × 3 and 18 ÷ 6 × 2 as two high-priority chains.", explain: "Rewrite the value of each chain, then perform the final subtraction.", steps: ["Left chain: 36 ÷ 4 = 9, then 9 × 3 = 27.", "Right chain: 18 ÷ 6 = 3, then 3 × 2 = 6.", "The expression is now 27 − 6.", "Calculate 27 − 6 = 21."], answer: "21", conclusion: "The expression has value 21", check: "Re-evaluating each chain independently gives 27 and 6, and their difference is 21.", review: "Every multiplication and division was completed left to right before the final subtraction.", structureId: "fractionUnusual_route_4_multiExpr", difficulty: 4 })
        ]
      },
      {
        h: "7. A percentage change can be written as one multiplier",
        body: [
          "An amount before any change is 100% of itself. Increasing it by 15% means keeping the original 100% and adding 15%, so the new amount is 115% of the original.",
          "A percentage becomes a decimal when divided by 100. Therefore 115% = 1.15, and a 15% increase can be found by multiplying by 1.15.",
          "For a decrease, subtract the percentage from 100%. A 20% decrease leaves 80%, and 80% = 0.80, so the multiplier is 0.8.",
          "Successive changes act on successive amounts. An 8% rise followed by a 5% fall uses 1.08 × 0.95. The fall is 5% of the new amount, not 5% of the starting amount.",
          "A multiplier above 1 increases an amount. A multiplier between 0 and 1 decreases it. This gives a quick check on the direction of the answer."
        ],
        note: "Increase multiplier = 1 + decimal change. Decrease multiplier = 1 − decimal change.",
        examples: [
          simple({ q: "Increase 80 by 15% using a multiplier.", state: "A 15% increase keeps 100% and adds 15%, so the multiplier is 115% = 1.15.", steps: ["Write the multiplier: 1 + 0.15 = 1.15.", "Calculate 80 × 1.15 = 92."], answer: "92", conclusion: "80 increased by 15% is 92", check: "15% of 80 is 12, and 80 + 12 = 92.", structureId: "fractionUnusual_route_5_moneyTrail", difficulty: 1 }),
          swc({ q: "A computer game costs £48 and is reduced by 25%. Find the sale price using a multiplier.", state: "A 25% reduction leaves 75% of the original price, so use multiplier 0.75.", steps: ["Convert the remaining percentage: 100% − 25% = 75% = 0.75.", "Calculate £48 × 0.75 = £36."], answer: "£36", conclusion: "The sale price is £36", check: "A quarter of £48 is £12. Subtracting £12 from £48 gives £36.", structureId: "fractionUnusual_route_5_moneyTrail", difficulty: 2 }),
          clear({ q: "A house is worth £250,000. Its value rises by 8%, then falls by 5% of its new value. Find its final value.", state: "The two changes act one after the other, so we must apply the 8% increase before the 5% decrease.", comprehend: "The multipliers are 1.08 and 0.95. Multiplying them gives the overall scale factor from the original value to the final value.", link: "Use £250,000 × 1.08 × 0.95, keeping the second percentage attached to the increased value.", explain: "Calculate each stage or combine the multipliers, then compare the result with the starting value.", steps: ["After the rise: £250,000 × 1.08 = £270,000.", "After the fall: £270,000 × 0.95 = £256,500.", "Equivalently, 1.08 × 0.95 = 1.026 and £250,000 × 1.026 = £256,500."], answer: "£256,500", conclusion: "The final value is £256,500", check: "Five per cent of £270,000 is £13,500, and £270,000 − £13,500 = £256,500.", review: "The final value is 102.6% of the original, so a small overall rise to £256,500 is sensible.", structureId: "fractionUnusual_route_5_moneyTrail", difficulty: 3 }),
          clear({ q: "After a 20% reduction, a jacket costs £120. What was its original price?", state: "The sale price is 80% of the original. We need to reverse multiplication by 0.8.", comprehend: "Reducing by 20% leaves 100% − 20% = 80%, so £120 represents 0.8 of the original price.", link: "If original × 0.8 = 120, divide 120 by 0.8 to recover the original.", explain: "Use the inverse of the percentage multiplier, then run the reduction forwards as a check.", steps: ["Write the relationship: original price × 0.8 = £120.", "Divide by 0.8: original price = £120 ÷ 0.8.", "Calculate 1200 ÷ 8 = 150, so the original price was £150."], answer: "£150", conclusion: "The jacket originally cost £150", check: "Twenty per cent of £150 is £30, and £150 − £30 = £120.", review: "Applying the stated reduction to £150 reproduces the sale price exactly.", structureId: "fractionUnusual_route_5_moneyTrail", difficulty: 4 })
        ]
      }
    ]
  },
  ratioChain: {
    intro: "Ratio and proportion describe quantities that scale together. The central question is not simply 'what operation should I use?' but 'what stays in the same comparison?' We will label ratios, find one-part values, connect ratios to fractions, use rates and distinguish direct from inverse proportion before applying these ideas to percentages and journeys.",
    recap: [
      "Ratio order follows the order of the named quantities.",
      "Equivalent ratios are made by multiplying or dividing every part by the same factor.",
      "When a total is shared, add the ratio parts, find one part and then build each share.",
      "A rate compares different units, such as kilometres per hour or pence per item.",
      "Direct proportion keeps a quotient constant, while inverse proportion keeps a product constant."
    ],
    mistakes: [
      "Reversing a ratio because the labels were not written down.",
      "Using one ratio part as the denominator of a whole-fraction instead of adding all parts.",
      "Comparing rates before converting them to matching units.",
      "Assuming that more of one quantity always means more of the other.",
      "Averaging two speeds without accounting for the time spent at each speed."
    ],
    sections: [
      {
        h: "1. A ratio remembers the comparison and the order",
        body: [
          "Suppose a fruit drink contains 2 cups of orange juice for every 3 cups of lemonade. We write orange : lemonade = 2:3 and read it as '2 to 3'. The two labels tell us what the numbers count.",
          "The order is part of the information. Lemonade : orange is 3:2, not 2:3. Write the labels in the order requested before copying any numbers into a ratio.",
          "The ratio does not tell us the exact amount of drink. It could describe 2 and 3 cups, 4 and 6 cups or 20 and 30 cups. All these pairs keep the same multiplicative comparison.",
          "Equivalent ratios are made by multiplying or dividing both parts by the same positive number. Multiplying 2:3 by 4 gives 8:12. Adding 4 to both parts gives 6:7, which is a different flavour because 6/7 is not equal to 2/3.",
          "When a total is shared, the ratio numbers count equal parts. Add them to find the number of parts in the whole, then find the value of one part."
        ],
        note: "Write labels first and scale every part by the same factor.",
        examples: [
          simple({ q: "A garden has 3 rose bushes for every 7 tulip clumps. Write the ratio of tulips to roses.", state: "The requested order is tulips first, roses second.", steps: ["Tulip clumps correspond to 7.", "Rose bushes correspond to 3.", "Write tulips : roses = 7:3."], answer: "7:3", conclusion: "The ratio of tulips to roses is 7:3", check: "Reading the answer aloud gives 7 tulip clumps for every 3 rose bushes.", structureId: "ratioChain_route_1_ratioChain", difficulty: 1 }),
          swc({ q: "Tom and Jess share 36 stickers in the ratio 2:4. How many stickers does Tom receive?", state: "Tom has 2 equal parts and Jess has 4, so the whole contains 6 parts.", steps: ["Total parts: 2 + 4 = 6.", "One part: 36 ÷ 6 = 6 stickers.", "Tom's 2 parts: 2 × 6 = 12 stickers."], answer: "12 stickers", conclusion: "Tom receives 12 stickers", check: "Jess receives 24 stickers. The shares total 36 and 12:24 simplifies to 2:4.", structureId: "ratioChain_route_1_ratioChain", difficulty: 2 }),
          swc({ q: "Sam and Priya share £56 in the ratio 4:3. How much does Priya receive?", state: "Priya is matched to the second ratio part, 3. The total contains 4 + 3 equal parts.", steps: ["Total parts: 4 + 3 = 7.", "One part: £56 ÷ 7 = £8.", "Priya's 3 parts: 3 × £8 = £24."], answer: "£24", conclusion: "Priya receives £24", check: "Sam receives £32. Their shares total £56 and £32:£24 simplifies to 4:3.", structureId: "ratioChain_route_1_ratioChain", difficulty: 3 }),
          clear({ q: "Three children share 120 sweets in the ratio 1:3:6. How many sweets does the child with the largest share receive, and how many more is that than the smallest share?", state: "The largest share is 6 parts and the smallest is 1 part. We need both shares and their difference.", comprehend: "The total contains 1 + 3 + 6 = 10 equal parts.", link: "Find one part from the total, build the two requested shares, then subtract.", explain: "Keep each ratio position attached to its size and verify all three possible shares against the total.", steps: ["One part is 120 ÷ 10 = 12 sweets.", "Largest share: 6 × 12 = 72 sweets.", "Smallest share: 1 × 12 = 12 sweets.", "Difference: 72 − 12 = 60 sweets."], answer: "72 sweets, which is 60 more than the smallest share", conclusion: "The largest share is 72 sweets and exceeds the smallest by 60", check: "The middle share is 3 × 12 = 36. The total 12 + 36 + 72 = 120 and the ratio is 1:3:6.", review: "The one-part value produces all three shares and the requested difference.", structureId: "ratioChain_route_1_ratioChain", difficulty: 4 })
        ]
      },
      {
        h: "2. Sharing a total begins with one part",
        body: [
          "If £40 is shared in the ratio 3:5, imagine 8 equal boxes because 3 + 5 = 8. The £40 fills all 8 boxes equally, so each box is worth £40 ÷ 8 = £5.",
          "The first share has 3 boxes, so it is 3 × £5 = £15. The second has 5 boxes, so it is 5 × £5 = £25. This is the unitary method: find the value of one unit, then scale to the amount needed.",
          "A ratio part is not automatically one object or one pound. It is an equal-sized share of the supplied total. Its value changes when the total changes.",
          "A ratio can also reveal a fraction of the whole. In 3:7 there are 10 parts altogether. The first quantity occupies 3/10 of the whole and the second occupies 7/10.",
          "Check a sharing answer in two ways: the shares must add to the original total and their ratio must simplify to the stated ratio."
        ],
        note: "Total parts, one part, required parts, then check the reconstructed whole.",
        examples: [
          simple({ q: "Two friends share 45 stickers in the ratio 2:7. How many stickers does the larger share contain?", state: "The larger share has 7 of the 9 total parts.", steps: ["Total parts: 2 + 7 = 9.", "One part: 45 ÷ 9 = 5 stickers.", "Seven parts: 7 × 5 = 35 stickers."], answer: "35 stickers", conclusion: "The larger share contains 35 stickers", check: "The other share is 2 × 5 = 10. The shares total 45 and 10:35 simplifies to 2:7.", structureId: "ratioChain_route_1_ratioChain", difficulty: 1 }),
          swc({ q: "Red and blue counters are in the ratio 3:7. What fraction of all the counters are red?", state: "Red occupies 3 parts out of the total number of ratio parts.", steps: ["Total parts: 3 + 7 = 10.", "Red parts: 3.", "Therefore the fraction that is red is 3/10."], answer: "3/10", conclusion: "Three tenths of the counters are red", check: "Blue occupies the remaining 7/10, and 3/10 + 7/10 = 1 whole.", structureId: "ratioChain_route_1_ratioChain", difficulty: 2 }),
          swc({ q: "A necklace has silver and gold beads in the ratio 5:3. There are 64 beads. How many are gold?", state: "Gold is 3 of the 8 total parts. We need the value of those 3 parts.", steps: ["Total parts: 5 + 3 = 8.", "One part: 64 ÷ 8 = 8 beads.", "Gold beads: 3 × 8 = 24."], answer: "24 gold beads", conclusion: "The necklace has 24 gold beads", check: "Silver beads number 5 × 8 = 40. Then 40 + 24 = 64 and 40:24 simplifies to 5:3.", structureId: "ratioChain_route_1_ratioChain", difficulty: 3 }),
          clear({ q: "Paint is mixed red:blue:white in the ratio 2:5:3. There are 18 litres more blue paint than red paint. Find the total amount of paint.", state: "Blue exceeds red by 5 − 2 = 3 ratio parts. Those 3 parts are worth 18 litres.", comprehend: "The difference between two labelled shares can reveal one part even when the total is not given.", link: "Find one part from the 3-part difference, then multiply by all 2 + 5 + 3 parts.", explain: "Use the difference to establish the scale of the ratio, then reconstruct every colour.", steps: ["Difference in parts: 5 − 2 = 3 parts.", "One part: 18 ÷ 3 = 6 litres.", "Total parts: 2 + 5 + 3 = 10.", "Total paint: 10 × 6 = 60 litres."], answer: "60 litres", conclusion: "There are 60 litres of paint altogether", check: "Red is 12 litres, blue is 30 litres and white is 18 litres. Blue exceeds red by 18 litres and the total is 60 litres.", review: "The reconstructed amounts have ratio 12:30:18 = 2:5:3 and satisfy the given difference.", structureId: "ratioChain_route_1_ratioChain", difficulty: 4 })
        ]
      },
      {
        h: "3. Each ratio part is a fraction of the whole",
        body: [
          "The ratio red:blue = 3:5 compares red directly with blue. It does not mean that red is 3/5 of the whole. The whole contains 3 + 5 = 8 parts, so red is 3/8 of all the counters and blue is 5/8.",
          "The denominator of a whole-fraction is the total number of ratio parts. The numerator is the number of parts belonging to the chosen quantity.",
          "Before simplifying a ratio, quantities must use the same unit. The comparison 500 ml : 2 litres mixes units. Converting 2 litres to 2,000 ml gives 500:2,000, which simplifies to 1:4.",
          "Equivalent ratios preserve division. In 5:3, the first amount is 5/3 of the second. Multiplying both by 3 gives 15:9, and 15/9 still simplifies to 5/3. Adding 3 gives 8:6, whose comparison is 4/3, so it is not equivalent.",
          "State which quantity your fraction describes. A bare answer such as 3/8 can be mathematically correct but unclear without its label."
        ],
        note: "For a fraction of the whole, add every ratio part to make the denominator.",
        examples: [
          simple({ q: "Red and green counters are in the ratio 4:1. What fraction of the counters are green?", state: "Green is 1 part out of 4 + 1 total parts.", steps: ["Total parts: 4 + 1 = 5.", "Green occupies 1 of those 5 parts."], answer: "1/5", conclusion: "One fifth of the counters are green", check: "Red occupies the remaining 4/5, and 4/5 + 1/5 = 1.", structureId: "ratioChain_route_1_ratioChain", difficulty: 1 }),
          swc({ q: "Scale the ratio 5:3 by a factor of 3. Explain why adding 3 to both parts would not work.", state: "An equivalent ratio requires the same multiplication for both parts.", steps: ["Multiply the first part: 5 × 3 = 15.", "Multiply the second part: 3 × 3 = 9.", "The scaled ratio is 15:9.", "Adding 3 gives 8:6, which simplifies to 4:3 rather than 5:3."], answer: "15:9", conclusion: "Scaling by 3 gives 15:9; adding 3 would change the ratio", check: "15 ÷ 9 simplifies to 5 ÷ 3, while 8 ÷ 6 simplifies to 4 ÷ 3.", structureId: "ratioChain_route_1_ratioChain", difficulty: 2 }),
          swc({ q: "Write 500 ml : 2 litres as a ratio in simplest form.", state: "The quantities need the same unit before their numbers can be compared.", steps: ["Convert 2 litres to millilitres: 2 litres = 2,000 ml.", "Write the ratio 500:2,000.", "Divide both parts by 500: 500 ÷ 500 = 1 and 2,000 ÷ 500 = 4."], answer: "1:4", conclusion: "The simplest ratio is 1:4", check: "Scaling 1:4 by 500 gives 500:2,000, which is 500 ml : 2 litres.", structureId: "ratioChain_route_1_ratioChain", difficulty: 3 }),
          clear({ q: "A bag of rice weighs 2 kg 400 g and a bag of lentils weighs 900 g. Write rice:lentils in simplest form and state the fraction of the combined weight that is rice.", state: "We need a same-unit ratio and then a fraction whose denominator is the total number of simplified parts.", comprehend: "The rice weight mixes kilograms and grams. Convert everything to grams before simplifying.", link: "After finding rice:lentils, add the ratio parts to obtain the whole-fraction denominator.", explain: "Convert, simplify with a common factor, then translate the labelled ratio into a fraction of the combined weight.", steps: ["Convert the rice: 2 kg 400 g = 2,400 g.", "Write the ratio 2,400:900.", "Divide both parts by 300: rice:lentils = 8:3.", "Total parts: 8 + 3 = 11.", "Rice occupies 8 of those 11 parts, so its fraction is 8/11."], answer: "Ratio 8:3; rice is 8/11 of the combined weight", conclusion: "Rice:lentils is 8:3 and rice forms 8/11 of the total weight", check: "The combined weight is 3,300 g, and 2,400/3,300 simplifies by 300 to 8/11.", review: "Both the ratio and whole-fraction come from the same converted weights.", structureId: "ratioChain_route_1_ratioChain", difficulty: 4 })
        ]
      },
      {
        h: "4. A rate compares quantities with different units",
        body: [
          "A ratio usually compares amounts of the same kind, such as red beads to blue beads. A rate compares different kinds of quantity, such as pages and minutes, pounds and kilograms or kilometres and hours.",
          "The word 'per' means 'for each'. A printer working at 12 pages per minute produces 12 pages for each minute. In 15 minutes it produces 15 groups of 12 pages.",
          "A unit rate tells us the amount for exactly one unit. If 3 pens cost £1.50, divide £1.50 by 3 to find £0.50 per pen. Once one pen is known, any number of identical pens can be priced.",
          "Units must be compatible. A quarter of an hour is 15 minutes, not 25 minutes. Convert the time before applying a pages-per-minute rate.",
          "A proportional rate remains constant. To check, divide cost by quantity or distance by time in both the original and scaled situations."
        ],
        note: "Convert units, find the amount for one unit, then scale to the requested number of units.",
        examples: [
          simple({ q: "A printer produces 12 pages per minute. How many pages does it produce in a quarter of an hour?", state: "The rate uses minutes, so first convert a quarter of an hour to minutes.", steps: ["One hour is 60 minutes, so a quarter is 60 ÷ 4 = 15 minutes.", "At 12 pages each minute, 15 minutes gives 12 × 15 = 180 pages."], answer: "180 pages", conclusion: "The printer produces 180 pages", check: "In 5 minutes it prints 60 pages, so three 5-minute blocks print 3 × 60 = 180 pages.", structureId: "ratioChain_route_2_multiRate", difficulty: 1 }),
          swc({ q: "Three identical pens cost £1.50. What do 7 pens cost?", state: "Find the cost of one pen, then scale that rate to 7 pens.", steps: ["Convert £1.50 to 150p.", "One pen costs 150p ÷ 3 = 50p.", "Seven pens cost 7 × 50p = 350p = £3.50."], answer: "£3.50", conclusion: "Seven pens cost £3.50", check: "£3.50 ÷ 7 = £0.50 per pen, matching the original £1.50 ÷ 3.", structureId: "ratioChain_route_2_multiRate", difficulty: 2 }),
          swc({ q: "Five identical notebooks cost £4. What do 8 notebooks cost?", state: "The number 8 is not a whole-number multiple of 5, so the unit rate is the clearest route.", steps: ["One notebook costs £4 ÷ 5 = £0.80.", "Eight notebooks cost 8 × £0.80 = £6.40."], answer: "£6.40", conclusion: "Eight notebooks cost £6.40", check: "£6.40 ÷ 8 = £0.80 per notebook, and 5 × £0.80 = £4.", structureId: "ratioChain_route_2_multiRate", difficulty: 3 }),
          clear({ q: "Twelve kilograms of gravel costs £9. A path needs 20 kg. Find the cost and explain a second route that confirms it.", state: "The price is proportional to mass. We need the cost for 20 kg and an independent scaling check.", comprehend: "A unit-rate route finds the price per kilogram. A scale-factor route notices that 20/12 simplifies to 5/3.", link: "Both mass and cost must be multiplied by the same factor.", explain: "Calculate with the unit rate, then reproduce the result by scaling £9 directly.", steps: ["Unit rate: £9 ÷ 12 = £0.75 per kg.", "Cost for 20 kg: 20 × £0.75 = £15.", "For the second route, 20/12 = 5/3, so the mass is multiplied by 5/3.", "Scale the price by the same factor: £9 × 5/3 = £3 × 5 = £15."], answer: "£15", conclusion: "Twenty kilograms of gravel costs £15", check: "The final unit rate is £15 ÷ 20 = £0.75 per kg, exactly the original rate.", review: "Two different proportional routes give the same £15 result.", structureId: "ratioChain_route_2_multiRate", difficulty: 4 })
        ]
      },
      {
        h: "5. Direct and inverse proportion move differently",
        body: [
          "If every orange has the same price, buying twice as many oranges costs twice as much. The quantities move together by the same scale factor. This is direct proportion.",
          "Now imagine a fixed job. If 4 equally fast workers take 6 hours, doubling the workers to 8 can halve the time to 3 hours. One quantity rises while the other falls. This is inverse proportion.",
          "In direct proportion, the amount per unit stays constant. Cost ÷ number of items might always equal 30p per item. In inverse proportion, the product stays constant. Workers × hours might always equal 24 worker-hours.",
          "The words 'more' and 'less' are not enough to choose a method. Ask what is being held fixed. More speed shortens the time only when the journey distance is fixed. More workers shorten a job only when the amount of work and worker speed are fixed.",
          "State the relationship before calculating. Then use either a unit rate for direct proportion or a constant product for inverse proportion."
        ],
        note: "Direct proportion keeps a quotient constant. Inverse proportion keeps a product constant.",
        examples: [
          simple({ q: "Classify each relationship, assuming all other conditions stay fixed: (a) hours worked and pay, (b) speed and time for a fixed journey, (c) items bought and total cost.", state: "We must decide whether each pair moves together or trades off.", steps: ["(a) More paid hours give more pay at a fixed hourly rate, so this is direct proportion.", "(b) Greater speed gives less time for the same distance, so this is inverse proportion.", "(c) More identical items give greater cost at a fixed price, so this is direct proportion."], answer: "(a) direct, (b) inverse, (c) direct", conclusion: "The relationships are direct, inverse and direct", check: "Doubling the first quantity would double the second in (a) and (c), but halve it in (b).", structureId: "ratioChain_route_3_inverseProp", difficulty: 1 }),
          swc({ q: "Three oranges cost 90p. What do 5 oranges cost?", state: "Cost is directly proportional to the number of identical oranges, so the price per orange stays constant.", steps: ["One orange costs 90p ÷ 3 = 30p.", "Five oranges cost 5 × 30p = 150p.", "Convert 150p to £1.50."], answer: "£1.50", conclusion: "Five oranges cost £1.50", check: "£1.50 ÷ 5 = 30p per orange, the same unit price as 90p ÷ 3.", structureId: "ratioChain_route_3_inverseProp", difficulty: 2 }),
          swc({ q: "Six workers can complete a fixed job in 10 hours. At the same working rate, how long would 15 workers take?", state: "More workers mean less time for the same job, so this is inverse proportion. Worker-hours stay constant.", steps: ["Total work: 6 workers × 10 hours = 60 worker-hours.", "Share 60 worker-hours among 15 workers: 60 ÷ 15 = 4 hours."], answer: "4 hours", conclusion: "Fifteen workers would take 4 hours", check: "The products agree: 6 × 10 = 60 and 15 × 4 = 60 worker-hours.", structureId: "ratioChain_route_3_inverseProp", difficulty: 3 }),
          clear({ q: "Eight taps fill identical tanks in 15 minutes. Three taps are unavailable. Assuming equal flow and no leaks, how long will the remaining taps take to fill one tank?", state: "Five taps remain. Fewer equal taps need more time for the same fixed amount of water, so this is inverse proportion.", comprehend: "Tap-minutes measure the fixed filling work. Eight taps working for 15 minutes provide 8 × 15 tap-minutes.", link: "Keep taps × time constant, then divide the fixed tap-minutes by the 5 available taps.", explain: "Calculate the work constant, solve the new time and check that the direction of change is sensible.", steps: ["Remaining taps: 8 − 3 = 5.", "Fixed work: 8 × 15 = 120 tap-minutes.", "New time: 120 ÷ 5 = 24 minutes."], answer: "24 minutes", conclusion: "The five taps take 24 minutes", check: "Five taps for 24 minutes provide 5 × 24 = 120 tap-minutes. The time is greater than 15 minutes because fewer taps are working.", review: "The constant product and direction check both support 24 minutes.", structureId: "ratioChain_route_3_inverseProp", difficulty: 4 })
        ]
      },
      {
        h: "6. Percentage changes use the part that remains",
        body: [
          "An unchanged amount is 100% of itself. An increase adds to that 100%, while a decrease removes from it. This makes a percentage multiplier a compact description of the whole new amount.",
          "For a 15% increase, the new amount is 115% = 1.15 of the original. For a 25% decrease, 75% remains, so the multiplier is 0.75.",
          "The multiplier includes the original amount. Multiplying by 0.25 after a 25% discount would find the discount itself, not the sale price.",
          "Successive changes multiply. A rise and an equal percentage fall do not cancel because the second percentage is taken from a different amount. For example, 100 × 1.10 × 0.90 = 99.",
          "Reverse percentages require division by the multiplier. If 80% of an original is 120, then the original is 120 ÷ 0.8."
        ],
        note: "Decide whether you need the changed part or the whole amount that remains.",
        examples: [
          simple({ q: "Increase 80 by 15% using a multiplier.", state: "The new amount is 115% of 80, so use multiplier 1.15.", steps: ["Write 115% as 1.15.", "Calculate 80 × 1.15 = 92."], answer: "92", conclusion: "The increased amount is 92", check: "The increase is 92 − 80 = 12, and 12 ÷ 80 = 0.15 = 15%.", structureId: "ratioChain_route_4_moneyTrail", difficulty: 1 }),
          swc({ q: "A computer game costs £48 and has a 25% discount. Find the sale price.", state: "A 25% discount leaves 75% of the price, so the sale-price multiplier is 0.75.", steps: ["Remaining percentage: 100% − 25% = 75%.", "Write 75% as 0.75.", "Calculate £48 × 0.75 = £36."], answer: "£36", conclusion: "The sale price is £36", check: "The discount is £48 − £36 = £12, and £12 is one quarter of £48.", structureId: "ratioChain_route_4_moneyTrail", difficulty: 2 }),
          clear({ q: "A house worth £250,000 rises by 8% in one year and then falls by 5% in the next. Find its final value.", state: "Apply the changes in order because the second percentage acts on the value after the first change.", comprehend: "The increase multiplier is 1.08 and the decrease multiplier is 0.95.", link: "The combined multiplier is 1.08 × 0.95 = 1.026.", explain: "Apply either the combined multiplier or calculate each year's value separately.", steps: ["After year 1: £250,000 × 1.08 = £270,000.", "After year 2: £270,000 × 0.95 = £256,500."], answer: "£256,500", conclusion: "The house is worth £256,500 after two years", check: "The overall multiplier is 1.026, and £250,000 × 1.026 = £256,500.", review: "The final value is 2.6% above the start, which agrees with the combined multiplier.", structureId: "ratioChain_route_4_moneyTrail", difficulty: 3 }),
          clear({ q: "A bicycle costs £418 after a 10% increase. Find its price before the increase.", state: "The final price is 110% of the original, so £418 equals original × 1.10.", comprehend: "This is a reverse percentage problem. Subtracting 10% of £418 would use the wrong base amount because the increase was based on the earlier price.", link: "Undo multiplication by 1.10 using division.", explain: "Divide the final price by its multiplier, then apply the increase forwards to verify the result.", steps: ["Write the relationship: original × 1.10 = £418.", "Original = £418 ÷ 1.10.", "Multiply both numbers by 10: 4,180 ÷ 11 = 380."], answer: "£380", conclusion: "The bicycle cost £380 before the increase", check: "Ten per cent of £380 is £38, and £380 + £38 = £418.", review: "Dividing by 1.10 gives £380 and the forward increase returns exactly to £418.", structureId: "ratioChain_route_4_moneyTrail", difficulty: 4 })
        ]
      },
      {
        h: "7. Distance, speed and time describe every journey leg",
        body: [
          "Speed tells us how much distance is covered in one unit of time. A speed of 45 km/h means 45 kilometres for every hour.",
          "The relationship is distance = speed × time, written D = S × T. If distance and speed are known, time = distance ÷ speed. If distance and time are known, speed = distance ÷ time.",
          "Units must agree. Thirty minutes is 0.5 hours, not 0.30 hours. A speed in kilometres per hour needs time in hours unless we first convert the speed.",
          "For a journey with several legs, calculate each leg's missing quantity separately. Total distance is the sum of the leg distances. Total time includes every period named by the question.",
          "Average speed is total distance divided by total time. It is not usually the simple mean of the listed speeds. Whether a stop is included depends on whether the question asks for the whole journey or moving portions only."
        ],
        note: "For average speed, add distances and add the relevant times before dividing.",
        examples: [
          simple({ q: "A train covers 180 km at 45 km/h. How long does the journey take?", state: "Time is distance divided by speed because we are counting how many 45 km hourly sections fit into 180 km.", steps: ["Use T = D ÷ S.", "Calculate 180 ÷ 45 = 4 hours."], answer: "4 hours", conclusion: "The journey takes 4 hours", check: "Distance = 45 km/h × 4 h = 180 km.", structureId: "ratioChain_route_5_epicJourney", difficulty: 1 }),
          swc({ q: "A cyclist rides 10 km at 5 km/h, then 6 km at 3 km/h. Find the total distance, total time and average speed.", state: "Find each leg's time first. The average then uses the combined distance and combined time.", steps: ["First leg time: 10 ÷ 5 = 2 hours.", "Second leg time: 6 ÷ 3 = 2 hours.", "Total distance: 10 + 6 = 16 km.", "Total time: 2 + 2 = 4 hours.", "Average speed: 16 ÷ 4 = 4 km/h."], answer: "16 km, 4 hours and 4 km/h", conclusion: "The cyclist travels 16 km in 4 hours at an average speed of 4 km/h", check: "Average speed 4 km/h for 4 hours accounts for 4 × 4 = 16 km.", structureId: "ratioChain_route_5_epicJourney", difficulty: 2 }),
          clear({ q: "A hiker walks 8 km at 4 km/h and then 9 km at 3 km/h. Find each leg time and the average speed for the whole walk.", state: "The different speeds last for different times, so calculate the two times before finding the overall average.", comprehend: "Average speed is total distance divided by total time, not (4 + 3) ÷ 2.", link: "Use time = distance ÷ speed on each leg, then add.", explain: "Keep the kilometres and hours labelled through the whole calculation.", steps: ["First leg time: 8 ÷ 4 = 2 hours.", "Second leg time: 9 ÷ 3 = 3 hours.", "Total distance: 8 + 9 = 17 km.", "Total time: 2 + 3 = 5 hours.", "Average speed: 17 ÷ 5 = 3.4 km/h."], answer: "Leg times 2 hours and 3 hours; average speed 3.4 km/h", conclusion: "The hiker's average speed is 3.4 km/h", check: "At 3.4 km/h for 5 hours, the represented distance is 3.4 × 5 = 17 km.", review: "The slower leg lasts longer, so 3.4 km/h being closer to 3 than 4 is sensible.", structureId: "ratioChain_route_5_epicJourney", difficulty: 3 }),
          clear({ q: "A bus travels 24 km at 12 km/h, stops for 30 minutes, then travels 36 km at 18 km/h. Find (a) its average speed while moving and (b) its average speed for the complete journey including the stop.", state: "The two averages use the same total distance but different total times. Part (a) excludes the stop and part (b) includes it.", comprehend: "Each moving leg takes distance ÷ speed. The stop lasts 30 minutes = 0.5 hours.", link: "Find the two moving times, then form one total without the stop and one with it.", explain: "Calculate both requested averages and label which time belongs to each.", steps: ["First moving time: 24 ÷ 12 = 2 hours.", "Second moving time: 36 ÷ 18 = 2 hours.", "Total distance: 24 + 36 = 60 km.", "Moving time: 2 + 2 = 4 hours, so moving average = 60 ÷ 4 = 15 km/h.", "Complete time: 4 + 0.5 = 4.5 hours, so complete-journey average = 60 ÷ 4.5 = 13 1/3 km/h."], answer: "(a) 15 km/h; (b) 13 1/3 km/h", conclusion: "The moving average is 15 km/h and the complete-journey average is 13 1/3 km/h", check: "15 × 4 = 60 and 13 1/3 × 4.5 = 60. Including a stop correctly makes the second average smaller.", review: "Both averages use all 60 km, with the half-hour stop included only in the second time total.", structureId: "ratioChain_route_5_epicJourney", difficulty: 4 })
        ]
      }
    ]
  }
};

export function applyJuniorEditorJ03(lessons) {
  applyEditorialRevisions(lessons, revisions);
  for (const [lessonKey, revision] of Object.entries(revisions)) {
    lessons[lessonKey].recap = revision.recap;
    lessons[lessonKey].mistakes = revision.mistakes;
  }
}
