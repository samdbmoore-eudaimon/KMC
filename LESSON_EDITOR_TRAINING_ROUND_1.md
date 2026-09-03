# Lesson editor training: round 1

This document is a training artefact only. It does not alter the live lessons, generators or built game.

The three sections below were selected before the editorial review. For each one, the Before version records the lesson as it is currently presented after all content overlays and automatic editorial processing. The After version is a proposed replacement written for a bright ten-year-old meeting the idea for the first time.

## Sample 1

### Location and metadata

- Module: Primary
- Lesson: `formalDivision`, Long Division: building up to the answer, jump by jump
- Section: 4. Building up to divide a bigger number
- Existing example links: `ratio_table_long_division` D1, `ratio_table_long_division` D2, `long_division_2digit_divisor` D3, `ratio_table_long_division` D4
- Proposed example links: `short_division_quotient` D1, `ratio_table_long_division` D2, `long_division_2digit_divisor` D3, `long_division_2digit_divisor` D4

### Complete Before version

#### 4. Building up to divide a bigger number

🎯 By the end of this section, you should be able to explain the idea in “Building up to divide a bigger number” before you calculate.

Now we put it together. Let us divide 156 by 12. In plain words: how many 12s fit inside 156? We build up the answer with friendly jumps.

Start with a big jump. 12 × 10 = 120. That fits inside 156 with room to spare, so we take it. How much is left? 156 − 120 = 36.

Now a smaller jump to mop up the 36 that is left. 12 × 3 = 36 exactly. That uses up everything, so we can stop.

Finally, add up the jumps we made: 10 twelves and then 3 more twelves. That is 10 + 3 = 13 twelves altogether. So 156 ÷ 12 = 13.

Notice that we never guessed wildly. We just took the biggest tidy jump each time and kept track of what was left. That is all long division is.

##### Example 1

**Divide 184 by 8 by building up friendly jumps.**

**STATE:** The question gives us this information: “Divide 184 by 8 by building up friendly jumps.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. Big jump: 8 × 20 = 160.
2. Left over: 184 − 160 = 24.
3. Small jump: 8 × 3 = 24 exactly, so we can stop.
4. Add the jumps together: 20 + 3 = 23.

**CONCLUDE:** 23. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 2

**Divide 195 by 5 using friendly jumps.**

**STATE:** The question gives us this information: “Divide 195 by 5 using friendly jumps.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. Big jump: 5 × 30 = 150.
2. Left over: 195 − 150 = 45.
3. Small jump: 5 × 9 = 45 exactly.
4. Add the jumps: 30 + 9 = 39.

**CONCLUDE:** 39. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 3

**Divide 336 by 7 using friendly jumps.**

**STATE:** The question gives us this information: “Divide 336 by 7 using friendly jumps.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. Big jump: 7 × 40 = 280.
2. Left over: 336 − 280 = 56.
3. Small jump: 7 × 8 = 56 exactly.
4. Add the jumps: 40 + 8 = 48.

**CONCLUDE:** 48. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 4

**Divide 96 by 4 by building up jumps.**

**STATE:** The question gives us this information: “Divide 96 by 4 by building up jumps.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. 24.
2. (4 × 20 = 80, leaving 16; then 4 × 4 = 16; so 20 + 4 = 24.)

**CONCLUDE:** 24. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

**Before moving on:** bringing down a digit changes place value and must be explained.

### Diagnosis

The main explanation has a useful image, but it moves too quickly from one calculation to a rule. It does not explain that each jump records two connected facts: how many groups were taken and how much of the dividend those groups used. It also says this is “all long division is”, although the method shown is more accurately building up multiples or chunking. The State and checks are generic rather than mathematical. Example 4 is easier and less complete than the earlier examples, so the difficulty moves backwards. Example 3 carries a structure link for a two-digit divisor but asks the learner to divide by 7. The final misconception about bringing down a digit belongs to a different written method and is not taught in this section.

### Complete After proposal

#### 4. Building up to divide a bigger number

Suppose we want to work out 156 ÷ 12. This asks, “How many groups of 12 can be made from 156?” We could count in twelves one group at a time, but that would be slow. Instead, we can take several groups at once by using multiples of 12 that we already know.

Start with ten groups. Ten groups of 12 contain 120 altogether because 12 × 10 = 120. This gives us two pieces of information to record:

- we have counted 10 groups of 12;
- those groups have used 120 of the 156.

There are 156 − 120 = 36 still to divide. We now ask how many more groups of 12 fit into 36. Three groups fit exactly because 12 × 3 = 36.

We used 10 groups first and 3 groups afterwards. The total number of groups is therefore 10 + 3 = 13. This means 156 ÷ 12 = 13.

You can picture the same work in a small table:

| Number of groups | Amount in those groups |
|---:|---:|
| 10 | 120 |
| 3 | 36 |
| 13 | 156 |

The two columns must grow together. If we add 10 groups and 3 groups, we must also add the matching amounts, 120 and 36. This is why the method works: 120 + 36 = 156 and 10 + 3 = 13.

This method is often called **chunking** or **building up multiples**. It uses the same division idea as a formal written method, but it lets us see the size of every group before we compress the work into a shorter layout.

The jumps do not have to be the biggest possible jumps. They only need to be multiples that you know are correct. For example, another correct route is 120 + 24 + 12 = 156. The matching group counts are 10 + 2 + 1 = 13. Different correct jumps reach the same quotient because each amount remains matched to its number of groups.

A reliable method is:

1. Write a multiple of the divisor that is less than or equal to the amount you are dividing.
2. Subtract that multiple to find what is left.
3. Find another multiple that fits into the amount left.
4. Continue until nothing is left, or until the leftover is smaller than the divisor.
5. Add the numbers of groups, not the amounts, to get the quotient.

The word **quotient** means the answer to a division. Here, 13 is the quotient. To check an exact division, multiply the quotient by the divisor. If 13 really is the number of groups of 12, then 13 × 12 must rebuild 156. It does, so the answer is correct.

##### Example 1

**Divide 184 by 8 by building up friendly jumps.**

**STATE:** We need to find how many complete groups of 8 make 184. Each jump must show both the number of groups and the amount those groups use.

**WORK:**

1. Twenty groups of 8 make 160 because 8 × 20 = 160. This is a useful first jump because 160 is close to 184 without going past it.
2. Subtract the amount already used: 184 − 160 = 24. There are 24 still to divide.
3. Three groups of 8 make 24 because 8 × 3 = 24. This uses the whole remainder.
4. Add the numbers of groups: 20 + 3 = 23.

**CONCLUDE:** 184 ÷ 8 = 23. Check by multiplying back: 23 × 8 = 184, so 23 groups of 8 make the original amount exactly.

##### Example 2

**Divide 195 by 5 using friendly jumps.**

**STATE:** We need the number of groups of 5 in 195. The final answer will be the total of all the group jumps we use.

**WORK:**

1. Thirty groups of 5 make 150 because 5 × 30 = 150.
2. Subtract to find the amount left: 195 − 150 = 45.
3. Nine more groups of 5 make 45 because 5 × 9 = 45.
4. Add the group jumps: 30 + 9 = 39.

**CONCLUDE:** 195 ÷ 5 = 39. Check by multiplying 39 × 5. Since 40 × 5 = 200, one group of 5 fewer gives 200 − 5 = 195. The answer is correct.

##### Example 3

**Divide 336 by 14 using friendly jumps.**

**STATE:** The divisor is now a two-digit number. We need to build 336 from known multiples of 14, then add the matching numbers of groups.

**WORK:**

1. Ten groups of 14 make 140, so twenty groups make twice as much: 14 × 20 = 280.
2. Subtract this first amount: 336 − 280 = 56.
3. Four groups of 14 make 56 because 14 × 4 = 56.
4. Add the group counts: 20 + 4 = 24.

**CONCLUDE:** 336 ÷ 14 = 24. Check by rebuilding the dividend: 14 × 24 = 14 × 20 + 14 × 4 = 280 + 56 = 336.

##### Example 4

**Use helpful multiples of 24 to work out 1,008 ÷ 24. Explain how you know that your list of jumps is complete.**

**C · Comprehend:** We are looking for the number of groups of 24 in 1,008. A complete solution must reach 1,008 exactly and keep track of the number of groups used in every jump.

**L · Link the facts:** Multiplying by 10 is easy, so 24 × 10 = 240. This also tells us that 24 × 40 = 960 because forty groups are four lots of ten groups.

**E · Explain the route:** Start with 40 groups because 960 is close to 1,008. Find the amount left, turn that leftover into more groups of 24, then add the group counts.

**A · Apply it carefully:**

1. Forty groups of 24 make 960: 24 × 40 = 960.
2. The amount left is 1,008 − 960 = 48.
3. The leftover 48 is two more groups of 24 because 24 × 2 = 48.
4. The total number of groups is 40 + 2 = 42.

**R · Review and conclude:** 1,008 ÷ 24 = 42. Multiply back in the same chunks: 24 × 42 = 24 × 40 + 24 × 2 = 960 + 48 = 1,008. The multiplication returns to the exact starting number, so no amount is missing and no remainder is left.

### Editorial record

- Before word count: 528 words in the complete displayed section, including 165 words before Example 1
- After word count: 964 words in the complete proposal, including 427 words before Example 1
- Mathematical corrections: Example 1 now uses `short_division_quotient`, which supports D1, because `ratio_table_long_division` supports only D2 and D3. Example 3 now uses a two-digit divisor, so its `long_division_2digit_divisor` link is truthful. Example 4 has been replaced with a genuine higher-difficulty two-digit-divisor question and its previous invalid D4 `ratio_table_long_division` link has been changed to `long_division_2digit_divisor`. The unrelated warning about bringing down a digit has been removed from this section.

## Sample 2

### Location and metadata

- Module: Junior
- Lesson: `sequences`, Sequences and rules
- Section: 5. From a chain of steps to a formula
- Existing and proposed example links: `sequences_route_5_numberMachine` at D1, D2, D3 and D4

### Complete Before version

#### 5. From a chain of steps to a formula

🎯 By the end of this section, you should be able to explain the idea in “From a chain of steps to a formula” before you calculate.

A function machine is really just a set of instructions written as symbols instead of words: 'multiply by 3, then add 4' becomes the formula y = 3x + 4, where x is whatever goes in and y is whatever comes out.

Letters like x, y, a, b and t aren't mysterious, they're placeholders, exactly like the blank input on last quest's machine, except now the whole rule fits on one line and you can carry it around.

##### Example 1

**Find y when x = 3, using y = 4x + 1.**

**STATE:** The question gives us this information: “Find y when x = 3, using y = 4x + 1.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. Replace x with 3: y = 4 x 3 + 1.
2. 4 x 3 = 12.
3. 12 + 1 = 13.

**CONCLUDE:** 13. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 2

**Find t when a = 2 and b = 7, using t = ab + 2a.**

**STATE:** The question gives us this information: “Find t when a = 2 and b = 7, using t = ab + 2a.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. ab means a x b: 2 x 7 = 14.
2. 2a means 2 x a: 2 x 2 = 4.
3. Add them: t = 14 + 4 = 18.

**CONCLUDE:** 18. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 3

**Find p when m = 3 and n = 5, using p = m² + 2mn - n.**

**STATE:** The question gives us this information: “Find p when m = 3 and n = 5, using p = m² + 2mn - n.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. m² means m x m: 3 x 3 = 9.
2. 2mn means 2 x m x n: 2 x 3 x 5 = 30.
3. Subtract n: p = 9 + 30 - 5 = 34.

**CONCLUDE:** 34. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 4

**Using t = ab + 2a, find t when a = 4 and b = 3.**

**STATE:** The question gives us this information: “Using t = ab + 2a, find t when a = 4 and b = 3.” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. 20.
2. ab=4x3=12, 2a=8, t=12+8=20.

**CONCLUDE:** 20. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

**Before moving on:** a constant difference must be checked more than once.

### Diagnosis

The opening states the rule but gives the learner almost no time to see how words, a machine and a formula describe the same process. It assumes the learner already understands implied multiplication in `4x`, `ab` and `2mn`, substitution, squared notation and the order of operations. Example 4 is a compressed repeat of Example 2, so it does not become harder or prepare the learner for the linked generator, which can ask them to reverse a machine, discover its rule or apply it repeatedly. The generic State and check add no mathematical meaning. The final warning about constant differences belongs to an earlier kind of sequence and is not relevant to substituting into a formula.

### Complete After proposal

#### 5. From a chain of steps to a formula

Imagine a number machine with two instructions written on it:

1. multiply the number by 3;
2. add 4.

If we put 5 into the machine, the first instruction gives 5 × 3 = 15. The second instruction gives 15 + 4 = 19. We can write the whole journey as `5 → 15 → 19`.

A **formula** is a shorter way to write those same instructions. We can write this machine as `y = 3x + 4`.

The letter `x` stands for the number that goes into the machine. It is called the input. The letter `y` stands for the number that comes out. It is called the output. The formula says, “To find the output, multiply the input by 3, then add 4.”

In algebra, a number written beside a letter means multiplication. Therefore `3x` means `3 × x`. Mathematicians leave out the multiplication sign because formulae would become crowded if every multiplication sign were shown. The sign is hidden, but the multiplication is still there.

To use a formula, replace each letter with the number it represents. This is called **substitution**. For `y = 3x + 4` when `x = 5`, substitution gives `y = 3 × 5 + 4`. Multiplication is completed before addition, so `y = 15 + 4 = 19`. This is exactly the same journey as the two machine instructions.

A formula can contain more than one letter. In `t = ab + 2a`, the part `ab` means `a × b`, while `2a` means `2 × a`. If `a = 2` and `b = 7`, then the two parts are `2 × 7` and `2 × 2`. Keeping the parts on separate lines makes it much less likely that a value will be forgotten.

You may also see a small raised 2, as in `m²`. This is read as “m squared” and means `m × m`. It does not mean `m × 2`. For example, if `m = 3`, then `m² = 3² = 3 × 3 = 9`.

Use the usual order of operations after substituting:

1. work out powers such as `m²`;
2. complete multiplications such as `2mn`;
3. complete additions and subtractions from left to right.

Formulae also help us work backwards. If the machine `y = 3x + 4` produces 19, we can undo the steps in reverse order. The machine added 4 last, so subtract 4 first: `19 − 4 = 15`. It multiplied by 3 first, so divide by 3 next: `15 ÷ 3 = 5`. The input was 5. We can check by running 5 forwards through the original machine.

The important idea is not the choice of letters. A formula is a compact set of instructions. Read what each letter means, reveal any hidden multiplication, substitute carefully and follow the operations in the correct order.

##### Example 1

**Find y when x = 3, using y = 4x + 1.**

**STATE:** In the formula, `x` is the input and `y` is the output. We are told that the input is 3, so we must replace `x` with 3 and calculate the output.

**WORK:**

1. The term `4x` means `4 × x`.
2. Substitute `x = 3`: `y = 4 × 3 + 1`.
3. Multiply first: `4 × 3 = 12`.
4. Add 1: `y = 12 + 1 = 13`.

**CONCLUDE:** When x = 3, y = 13. Check by using the machine in words: multiply 3 by 4 to get 12, then add 1 to get 13.

##### Example 2

**Find t when a = 2 and b = 7, using t = ab + 2a.**

**STATE:** We know the values of both letters. We need to calculate the two parts, `ab` and `2a`, then add them to find `t`.

**WORK:**

1. Reveal the hidden multiplication: `ab` means `a × b`, while `2a` means `2 × a`.
2. Substitute `a = 2` and `b = 7`: `t = 2 × 7 + 2 × 2`.
3. Work out each multiplication: `2 × 7 = 14` and `2 × 2 = 4`.
4. Add the two parts: `t = 14 + 4 = 18`.

**CONCLUDE:** When a = 2 and b = 7, t = 18. Check by grouping equal twos: `ab` gives seven groups of 2 and `2a` gives two more groups of 2. That is nine groups of 2, and `9 × 2 = 18`.

##### Example 3

**Find p when m = 3 and n = 5, using p = m² + 2mn − n.**

**STATE:** The formula has a power, a multiplication with three factors and a final subtraction. We will substitute both values, then follow the order of operations.

**WORK:**

1. Substitute `m = 3` and `n = 5`: `p = 3² + 2 × 3 × 5 − 5`.
2. Work out the square: `3² = 3 × 3 = 9`.
3. Work out the other multiplication: `2 × 3 × 5 = 6 × 5 = 30`.
4. The formula is now `p = 9 + 30 − 5`.
5. Work from left to right: `9 + 30 = 39`, then `39 − 5 = 34`.

**CONCLUDE:** When m = 3 and n = 5, p = 34. Check the arithmetic by grouping it differently: `30 − 5 = 25`, then `9 + 25 = 34`. This reaches the same result.

##### Example 4

**A machine follows the formula y = 2x + 3. A number is put through the machine, then the output is put through the same machine again. The second output is 41. What was the starting number?**

**C · Comprehend:** The same two-step rule was used twice. We know the final output, 41, but not the first input. We need to undo both passes through the machine.

**L · Link the facts:** One pass multiplies by 2 and then adds 3. To reverse one pass, undo the last operation first: subtract 3, then divide by 2.

**E · Explain the route:** Work backwards from 41 one pass at a time. The first undo will reveal the output of the first pass. The second undo will reveal the original input.

**A · Apply it carefully:**

1. Undo the second pass: `41 − 3 = 38`, then `38 ÷ 2 = 19`. Therefore the first pass produced 19.
2. Undo the first pass: `19 − 3 = 16`, then `16 ÷ 2 = 8`. Therefore the starting input was 8.

**R · Review and conclude:** The starting number was 8. Run it forwards to check: `2 × 8 + 3 = 19`, then `2 × 19 + 3 = 41`. The two forward passes reach the stated final output, so 8 is correct.

### Editorial record

- Before word count: 493 words in the complete displayed section, including 111 words before Example 1
- After word count: 990 words in the complete proposal, including 440 words before Example 1
- Mathematical corrections: no existing arithmetic result was wrong. Example 4 has been replaced because it repeated Example 2 at a lower level of explanation despite being labelled D4. The replacement genuinely extends the same `numberMachine` structure by applying and reversing the formula twice. The unrelated warning about constant differences has been removed.

## Sample 3

### Location and metadata

- Module: Junior
- Lesson: `gridLogic`, Logic Grids
- Section: 2. Reading what a single line already rules out
- Existing example links: `gridLogic_logic_route_2` at D1, D2, D3 and D4
- Proposed example links: `gridLogic_logic_route_1` at D1, D2, D3 and D4

### Complete Before version

#### 2. Reading what a single line already rules out

🎯 By the end of this section, you should be able to explain the idea in “Reading what a single line already rules out” before you calculate.

If a row using the numbers 1, 2 and 3 already shows two of them, the third is completely forced: there is only one number left that has not appeared. No column information is even needed in that case.

Always start by listing the FULL set the puzzle is using (for example 1, 2, 3) and then crossing off whichever ones are already visible in the line you care about. Whatever is left uncrossed is your answer, when only one number remains.

##### Example 1

**A 3 by 3 grid uses 1, 2 and 3 in every row and column. A blank cell's row shows only 3 (leaving 1 or 2 as candidates). Its column shows only 1 (leaving 2 or 3 as candidates). What must the blank be?**

**STATE:** The question gives us this information: “A 3 by 3 grid uses 1, 2 and 3 in every row and column. A blank cell's row shows only 3 (leaving 1 or 2 as candidates). Its column shows only 1 (leaving 2 or 3 as candidates). What must the blank be?” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. Row candidates: {1, 2}.
2. Column candidates: {2, 3}.
3. Only 2 appears in both lists, so the blank must be 2.

**CONCLUDE:** 2. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 2

**A 4 by 4 grid uses 1, 2, 3 and 4 in every row and column. A blank cell's row shows only 1 (leaving 2, 3 and 4 as candidates). Its column shows only 4 (leaving 1, 2 and 3 as candidates). After combining row and column, two candidates still remain. The cell's 2 by 2 box already contains the number 3. Which single number must go in the blank?**

**STATE:** The question gives us this information: “A 4 by 4 grid uses 1, 2, 3 and 4 in every row and column. A blank cell's row shows only 1 (leaving 2, 3 and 4 as candidates). Its column shows only 4 (leaving 1, 2 and 3 as candidates). After combining row and column, two candidates still remain. The cell's 2 by 2 box already contains the number 3. Which single number must go in the blank?” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. Row candidates: {2, 3, 4}.
2. Column candidates: {1, 2, 3}.
3. Intersection: {2, 3}.
4. The box already contains 3, so 3 is ruled out from the intersection.
5. Only 2 survives all three checks.

**CONCLUDE:** 2. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 3

**A grid uses 1, 2, 3. The blank cell's column shows only 3 (so 1 or 2 could go there). Its row already has 2 and 3. Which must go in the blank?**

**STATE:** The question gives us this information: “A grid uses 1, 2, 3. The blank cell's column shows only 3 (so 1 or 2 could go there). Its row already has 2 and 3. Which must go in the blank?” Before calculating, say in your own words what a correct answer must tell us.

**WORK:**

1. Identify the information and the required result.
2. Apply the method developed in this section.
3. Check that the result satisfies the original conditions.

**CONCLUDE:** 1, since the row needs 1 (it already has 2 and 3), and 1 is also allowed by the column. Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.

##### Example 4

**A cell's box already contains 1, 2 and 4 (missing only one cell, out of 1-4). What must go in the missing cell of that box, regardless of its row or column?**

**C · Comprehend:** The question gives us this information: “A cell's box already contains 1, 2 and 4 (missing only one cell, out of 1-4). What must go in the missing cell of that box, regardless of its row or column?” Before calculating, say in your own words what a correct answer must tell us.

**L · Link the facts:** The first useful fact is this: The box needs all of 1, 2, 3, 4.

**E · Explain the route:** This tells us what to calculate or test first. After that, we can use each new result in the next step.

**A · Apply it carefully:**

1. It already has 1, 2 and 4.
2. Only 3 is missing.

**R · Review and conclude:** Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly. This confirms the result: 3.

**Before moving on:** a locally possible value may create a later contradiction.

### Diagnosis

The prose describes a useful, simple idea: finding the one value missing from a single row or column. The examples do not follow that teaching sequence. Examples 1 and 3 combine a row and a column, Example 2 combines a row, column and box and Example 4 introduces boxes before the later section that is meant to teach them. Example 3 contains placeholder working rather than a solution. Example 4 receives the heaviest CLEAR format even though it is the shortest direct recognition question. The linked generator route 2 is an enumeration and shortest-path route, while this section teaches elimination. The State, Explain and Review text are generic.

### Complete After proposal

#### 2. Finding the one value missing from a line

In this kind of logic grid, each row must contain the complete allowed set exactly once. A column follows the same rule. For example, a 3 by 3 grid uses the numbers 1, 2 and 3. Every row must contain one 1, one 2 and one 3. No number may be repeated in the same row.

Look at this unfinished row:

`1 | _ | 3`

The full set is `{1, 2, 3}`. The row already contains 1 and 3. Cross those numbers off the full set:

`{1, 2, 3} → cross off 1 → cross off 3 → {2}`

Only 2 remains, so the blank must be 2. We say that 2 is **forced** because no other number can obey the row rule.

A number that might fit is called a **candidate**. At the beginning, 1, 2 and 3 are all possible candidates for the blank. Once we notice that 1 and 3 are already used, they are no longer candidates. The shortlist has only one number left.

The same method works down a column. Suppose a 4 by 4 grid uses `{1, 2, 3, 4}` and a column reads:

`4`

`1`

`_`

`3`

The column already uses 4, 1 and 3. The only missing member of the full set is 2, so the blank must contain 2.

The order of the visible numbers does not matter. A row showing `6, 2, 5, _, 1, 3` still uses the set `{1, 2, 3, 4, 5, 6}`. Cross off the numbers you can see in any order. Only 4 remains.

Use this routine whenever one line is almost complete:

1. Write the full set of allowed numbers.
2. Look only at the row or column you are solving.
3. Cross off every number already visible in that line.
4. If one candidate remains, place it in the blank.
5. Read the completed line to check that every allowed number appears once and only once.

Do not combine the row with its crossing column until you need to. If one line already forces the answer, that line has given you a complete reason. Later sections will show what to do when a row leaves two candidates and a column is needed to decide between them.

##### Example 1

**A 3 by 3 grid uses 1, 2 and 3 exactly once in every row. One row is `1 | _ | 3`. What number must fill the blank?**

**Think:** The row needs the complete set `{1, 2, 3}`. We can find the missing number by comparing that set with the numbers already shown.

**Work it through:**

1. The row already contains 1 and 3.
2. Cross 1 and 3 off `{1, 2, 3}`.
3. The only number left is 2.

**Answer:** The blank must contain 2.

**Check:** The completed row is `1 | 2 | 3`. It contains each of 1, 2 and 3 exactly once.

##### Example 2

**A 4 by 4 grid uses 1, 2, 3 and 4 exactly once in every column. One column contains 4, 1, a blank and 3. What number must fill the blank?**

**STATE:** The column must contain the full set `{1, 2, 3, 4}`. It already has three of those numbers, so one value is forced.

**WORK:**

1. Begin with `{1, 2, 3, 4}`.
2. The column contains 4, so cross off 4.
3. It contains 1 and 3, so cross off 1 and 3 as well.
4. Only 2 remains.

**CONCLUDE:** The blank must contain 2. The completed column contains 1, 2, 3 and 4 once each, with no repeat.

##### Example 3

**A 6 by 6 grid uses the numbers 1 to 6 exactly once in every row. One row is `6 | 2 | 5 | _ | 1 | 3`. Find the missing number and explain why the order of the visible numbers does not affect your method.**

**STATE:** The full set is `{1, 2, 3, 4, 5, 6}`. We need the one member of that set that does not yet appear in the row.

**WORK:**

1. The visible numbers are 6, 2, 5, 1 and 3.
2. Cross each visible number off the full set. This removes 1, 2, 3, 5 and 6.
3. The only number not crossed off is 4.
4. The visible numbers could have appeared in any order. We are checking which values are present, not where they appear.

**CONCLUDE:** The blank must contain 4. The completed row contains every number from 1 to 6 once. No number is missing and none is repeated.

##### Example 4

**A row in a 6 by 6 grid uses each number from 1 to 6 exactly once. Four spaces are already filled: `1 | _ | 3 | 4 | _ | 6`. The two blanks are called A and B from left to right. The row rule leaves two candidates, and A is less than B. Find A and B.**

**C · Comprehend:** The row must contain `{1, 2, 3, 4, 5, 6}` exactly once. Two values are missing, so the row rule will first give us a pair of candidates rather than one forced answer. The extra fact `A < B` will tell us their order.

**L · Link the facts:** The row already contains 1, 3, 4 and 6. Crossing those off the full set leaves 2 and 5. Therefore A and B must be 2 and 5 in some order.

**E · Explain the route:** Use the row rule to find the two missing values first. Then use `A < B`, which means A is smaller than B, to decide which blank receives each value.

**A · Apply it carefully:**

1. Full set: `{1, 2, 3, 4, 5, 6}`.
2. Cross off the visible values 1, 3, 4 and 6.
3. The missing values are `{2, 5}`.
4. Since A is less than B and 2 < 5, A = 2 and B = 5.

**R · Review and conclude:** A = 2 and B = 5. The completed row is `1 | 2 | 3 | 4 | 5 | 6`, so every allowed number appears exactly once. The order also obeys the extra condition because 2 is less than 5.

### Editorial record

- Before word count: 847 words in the complete displayed section, including 117 words before Example 1
- After word count: 1,000 words in the complete proposal, including 375 words before Example 1
- Mathematical corrections: the proposed examples remain inside the single-line idea promised by the section. The structure links change from route 2 to `gridLogic_logic_route_1`, the generator's elimination route, because route 2 generates an unrelated shortest-path enumeration problem. Example 3 now contains real mathematical working. Example 4 is a genuine extension in which elimination produces two candidates and one extra condition fixes their order. The current route 1 generator varies the size of the allowed set but not the reasoning demand, so its D4 form should later be expanded to match this two-candidate decision rather than merely presenting a larger row.

## Round 1 patterns for human feedback

Across all three samples, the proposed editor follows these choices:

- remove generic learning goals when the prose itself makes the purpose clear;
- introduce a mathematical word only after a concrete example gives it meaning;
- keep State specific to the actual facts and required result;
- make every Check perform a real mathematical test;
- increase difficulty through a new decision or reasoning demand, not merely larger numbers;
- keep examples aligned with the section promise and the linked practice structure;
- reserve CLEAR for the example that genuinely needs a longer plan.

The main questions for the human editor are whether the pace is slow enough, whether any paragraph still assumes knowledge that has not been taught and whether the hardest example in each section feels like a natural next step rather than a jump.
