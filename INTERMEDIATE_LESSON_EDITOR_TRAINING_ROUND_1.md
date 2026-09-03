# Intermediate lesson editor training: round 1

This document is a training artefact only. It does not alter the live lessons, generators or built game. It applies `LESSON_EDITOR_AGENT_KS4.md` (the KS4/Intermediate adaptation of the existing Primary/Junior editor standard) to three sections chosen by an unweighted random draw from all 92 sections across the 28 Intermediate lessons.

For each sample, the Before version is the text exactly as it renders live today — merging the base lesson definition in `content/intermediate-lessons.js` with any `rewriteExistingLesson` overlay in `content/intermediate-lessons-rewrite.js`, and including the mechanical tryit-promotion step where it applies. The After version is a proposed replacement written for a GCSE Higher-tier / UKMT Intermediate Challenge student meeting the idea for the first time.

## Sample 1

### Location and metadata

- Module: Intermediate
- Lesson: `algebraicProof`, Algebraic Proof: showing it's ALWAYS true
- Section: 1. Representing number types algebraically
- Mechanism: base file supplies heading and examples 1-3; `rewriteExistingLesson` overlay supplies body, note, and the tryit that sits alongside the promoted 4th example
- Existing example links: `parity_check_linear` (D1), `three_consecutive_sum` (D2), `consecutive_even_sum` (D2), `parity_check_linear` (D1, promoted from the base file's original tryit)
- Proposed example links: `parity_check_linear` (D1), `three_consecutive_sum` (D2), `parity_check_linear` (D1, reordered), `consecutive_even_sum` (D2, reordered to the capstone position)
- Standing note on all three samples: every generator in this module is multiple-choice, so a written "prove that..." example can only ever link to the *closest same-topic* MCQ structure, not a literal proof-marking one. `parity_check_linear` tests recognising that 2n + 3 is odd for a specific numeric n; it is the nearest available structure to a symbolic parity proof, not an exact task-type match. This is a structural ceiling of the app, not an error to keep hunting for a "true" fix.

### Complete Before version

#### 1. Representing number types algebraically

Words such as even, odd and consecutive describe whole families of numbers. Algebra lets us represent the entire family with one expression.

Every even integer is 2n for some integer n. Every odd integer is 2n + 1. These forms encode the defining remainder after division by 2.

Consecutive integers can be written n, n + 1, n + 2. Consecutive even integers are 2n, 2n + 2, 2n + 4.

State that n is an integer. Without that condition, 2n need not represent an even integer.

Choose a form that exposes the property you need to prove. A multiple of 5 is 5n and a number leaving remainder 3 on division by 5 is 5n + 3.

##### Example 1

**Prove that the sum of two consecutive integers is always odd.**

**WORK:**

1. Represent the two consecutive integers algebraically: let them be n and n+1, where n stands for any integer.
2. Add them: sum = n + (n+1).
3. Simplify: n + (n+1) = 2n+1.
4. 2n+1 matches the general form for an odd number, 2 times something plus 1, so the sum is odd.
5. Because n could have been any integer, this holds for every possible pair of consecutive integers, including the n=3 and n=100 cases checked above, and every other integer besides.

**Answer:** 2n+1 is always odd, so the sum of two consecutive integers is always odd, true for every integer n.

##### Example 2

**Prove that the sum of three consecutive integers is always a multiple of 3.**

**WORK:**

1. Represent three consecutive integers algebraically: n, n+1, n+2.
2. Add them: sum = n + (n+1) + (n+2).
3. Collect like terms: three n's give 3n, and 1+2 gives 3, so the sum is 3n+3.
4. Factorise: 3n+3 = 3(n+1).
5. 3(n+1) is 3 times a whole number, so it is a multiple of 3 by definition, true for every integer n.

**Answer:** 3(n+1), a multiple of 3 for every integer n.

##### Example 3

**Prove that the product of two consecutive even numbers is always divisible by 8.**

**WORK:**

1. Represent two consecutive even numbers algebraically: let them be 2n and 2n + 2, where n is any integer.
2. Write their product: 2n × (2n + 2). Factorise the second bracket: 2n + 2 = 2(n + 1), so the product becomes 2n × 2(n+1) = 4n(n+1).
3. Notice that n and n+1 are consecutive integers, so exactly one of them is even, meaning n(n+1) is always even. Write n(n+1) = 2m for some integer m.
4. Substitute: 4n(n+1) = 4 × 2m = 8m.
5. 8m is 8 times a whole number, so the product of two consecutive even numbers is always divisible by 8, for every integer n.

**Answer:** 4n(n+1) = 8m, always divisible by 8.

##### Example 4

**Show that any even number added to any odd number gives an odd number.**

**WORK:**

1. Odd.
2. Represent the even number as 2n and the odd number as 2m+1, using a DIFFERENT letter m since the two numbers need not be related.
3. The sum is 2n+(2m+1) = 2(n+m)+1, which matches the form for an odd number, true for all integers n and m.

**Answer:** Odd. Represent the even number as 2n and the odd number as 2m+1, using a DIFFERENT letter m since the two numbers need not be related. The sum is 2n+(2m+1) = 2(n+m)+1, which matches the form for an odd number, true for all integers n and m.

**Try it:** Represent three consecutive odd integers and find their sum in simplified form. *(Answer: Use 2n + 1, 2n + 3 and 2n + 5. Their sum is 6n + 9 = 3(2n + 3), so it is a multiple of 3.)*

**Before moving on:** Do not write consecutive odd integers as n, n + 1, n + 2. Odd integers differ by 2.

### Diagnosis

The body jumps straight from "words such as even, odd and consecutive describe whole families" to the compressed rule "every even integer is 2n" with no concrete numeric case in between — exactly the jump the editorial standard forbids. (The base lesson file, now dead beneath the overlay, actually opened with a much better concrete check: verifying the "sum of two consecutive integers is odd" claim at n=3 and n=100 before introducing algebra at all. The rewrite made the prose more compressed, not less.) The body also silently drops a genuinely useful line the dead version had: that n ranges over *all* integers, including zero and negatives, not just the counting numbers a student would list first.

Example 4 is the mechanically-promoted former tryit, and its first line of working is literally "Odd." — the finished answer, stated before a single step of reasoning. This is the systemic promotion-artifact bug documented in the KS4 standard (the promotion script splits the tryit's `answer` string into "steps" by sentence, and this answer happened to open with a one-word verdict). The Answer field then repeats the entire explanation a second time. Structurally, Example 4 also introduces a genuinely new and useful idea — using a second, independent letter m for an unrelated unknown — but it is parked last as an afterthought, sitting behind Example 3, which is honestly the hardest of the four (it needs an embedded sub-proof that n(n+1) is always even). The four examples therefore do not escalate in reasoning demand; they go easy → medium → hardest → easy again.

### Complete After proposal

#### 1. Representing number types algebraically

Try the claim "the sum of two consecutive integers is always odd" on two actual numbers. Take n = 3: the integers are 3 and 4, and 3 + 4 = 7, which is odd. Take n = 100: the integers are 100 and 101, and 100 + 101 = 201, which is also odd. Both cases work — but neither one, nor both together, proves the claim for *every* integer. There is no way yet to write down an argument that covers every case at once, only two separate checks.

To argue about every integer simultaneously, algebra uses a single letter — say n — to stand for *any* integer at once, not one particular value. Any even number can then be written 2n. That works because every even number is, by definition, exactly 2 times some whole number: as n runs through every integer in turn (..., -1, 0, 1, 2, 3, ...), the expression 2n runs through every even number, and only even numbers.

Any odd number is 2n + 1. Odd numbers sit exactly one more than an even number, so taking the same 2n and adding 1 shifts every even number up to the odd number next to it: n = 0 gives 1, n = 1 gives 3, n = 2 gives 5.

This is why algebra can prove something a handful of examples cannot: n is not one fixed number, it is a placeholder standing for every integer at once. A calculation carried out using n, rather than a specific value, is true for every integer the moment the algebra is finished — the proof is finished too. Substituting n = 3 into 2n + 1 gives 7; substituting n = 100 gives 201. The single algebraic line already contains both checks from above, and every other integer besides.

Consecutive integers are written n, n + 1, n + 2. Consecutive even integers are 2n, 2n + 2, 2n + 4 (each one 2 more than the last).

One care point: n ranges over *all* integers, including zero and negative numbers, not just the positive counting numbers you would list first. Check that 2n + 1 still behaves correctly at n = -1: 2×(-1) + 1 = -1, which is indeed odd, so the representation holds even at the edge cases.

When a proof involves *two* numbers that do not have to be related to each other — for instance, "any even number" and "any odd number", which could be any even number and any odd number at all, not a matched pair — represent them with two *different* letters, such as n and m. Using the same letter twice would silently force the two numbers to be tied together, which the claim never actually requires.

A representation should expose the exact property you need to prove. A multiple of 5 is 5n; a number leaving remainder 3 on division by 5 is 5n + 3.

##### Example 1

**Prove that the sum of two consecutive integers is always odd.**

**State:** We must show that n + (n + 1) always simplifies to the general form for an odd number, 2 × (something) + 1, whatever integer n is.

**Work:**

1. Represent the two consecutive integers algebraically: n and n + 1, where n stands for any integer.
2. Add them, without simplifying yet: n + (n + 1).
3. The brackets are not doing anything here, since we are only adding, so we can remove them: n + n + 1.
4. Collect the two n terms together: n + n = 2n. So the sum becomes 2n + 1.
5. 2n + 1 matches the pattern 2 × (something) + 1 — the general form for an odd number.

**Conclude:** The sum is always odd, for every integer n.

**Check:** Substitute n = 5: the integers are 5 and 6, summing to 11. The formula gives 2(5) + 1 = 11. They agree, and 11 is odd.

##### Example 2

**Prove that the sum of three consecutive integers is always a multiple of 3.**

**State:** We must show n + (n + 1) + (n + 2) always simplifies to 3 × (something), whatever integer n is.

**Work:**

1. Represent three consecutive integers algebraically: n, n + 1, n + 2.
2. Add them, without simplifying yet: n + (n + 1) + (n + 2).
3. Remove the brackets, since we are only adding: n + n + 1 + n + 2.
4. Collect the three n terms together: n + n + n = 3n.
5. Collect the two number terms together: 1 + 2 = 3.
6. So the sum is 3n + 3.
7. Factorise, by taking out the common factor of 3 from both terms: 3n + 3 = 3(n + 1).

**Conclude:** 3(n + 1) is 3 times a whole number, so the sum is a multiple of 3 for every integer n.

**Check:** Substitute n = 7: the integers are 7, 8, 9, summing to 24 = 3 × 8. The formula gives 3(7 + 1) = 3 × 8 = 24. They agree.

##### Example 3

**Show that any even number added to any odd number gives an odd number.**

**State:** The even number and the odd number do not have to be related to each other — one could be 8 and the other 1,001, with nothing connecting them — so they need two *different* letters, not the same letter twice. We must show their sum always matches the general form for an odd number, 2 × (something) + 1.

**Work:**

1. Represent the even number as 2n, where n stands for any integer.
2. Represent the odd number as 2m + 1. We use the *different* letter m, not n again, because this odd number does not have to be related to the even number we just wrote down.
3. Write down their sum exactly as it stands, without simplifying yet: 2n + (2m + 1).
4. The brackets around (2m + 1) are not doing any work here (we are only adding, not subtracting), so we can drop them: 2n + 2m + 1.
5. Both 2n and 2m share a common factor of 2, so group them together: (2n + 2m) + 1.
6. Factorise the grouped part: 2n + 2m = 2(n + m).
7. So the whole sum becomes 2(n + m) + 1.

**Conclude:** n + m is a whole number whenever n and m are both whole numbers (adding two whole numbers always gives another whole number), so 2(n + m) is 2 times a whole number, and 2(n + m) + 1 matches the form 2 × (something) + 1 — the general form for an odd number. This holds for every integer n and every integer m, so any even number plus any odd number is always odd.

**Check:** Take n = 4 (so the even number is 2n = 8) and m = 10 (so the odd number is 2m + 1 = 21): 8 + 21 = 29, which is odd. The formula gives 2(4 + 10) + 1 = 2(14) + 1 = 29. The two routes agree — and notice n and m did not need to be equal, or even close, which is exactly why they needed different letters.

##### Example 4

**Prove that the product of two consecutive even numbers is always divisible by 8.**

**Comprehend:** We must show that 2n × (2n + 2) always simplifies to 8 × (something), whatever integer n is. Along the way we will need one extra fact: that n(n + 1), the product of two consecutive integers, is always even. We prove that small fact first, then use it.

**Link the facts:** Among any two consecutive integers, such as n and n + 1, one of them must be even and the other must be odd — two consecutive whole numbers can never both be even, or both be odd. So the product n(n + 1) always contains at least one even factor. A product with at least one even factor is always even, because that even factor already supplies a 2 that divides the whole product exactly.

**Explain the route:** We will factorise 2n + 2 to pull one factor of 2 out of it, which leaves 4n(n + 1) after multiplying the two 2s together. Then we use the fact just established — that n(n + 1) is even — to pull one more factor of 2 out of *that*, giving 2 × 2 × 2 = 8 altogether.

**Apply it carefully:**

1. Represent the two consecutive even numbers as 2n and 2n + 2, where n is any integer.
2. Look at the second number, 2n + 2. Both terms share a factor of 2, so factorise it: 2n + 2 = 2(n + 1).
3. Write the product of the two even numbers, using this factorised form for the second one: 2n × 2(n + 1).
4. Multiply the two number parts (the 2 from the first term and the 2 we just factored out of the second) together first: 2 × 2 = 4.
5. So the product becomes 4 × n × (n + 1), which we write as 4n(n + 1).
6. We showed above that n(n + 1) is always even. Being even means it can be written as 2 times some whole number — call that whole number k. So n(n + 1) = 2k.
7. Substitute 2k in place of n(n + 1) inside our expression: 4n(n + 1) becomes 4 × (2k).
8. Multiply the number parts: 4 × 2 = 8. So 4 × (2k) = 8k.

**Review and conclude:** We have shown 2n × (2n + 2) = 8k, where k is a whole number. 8k is 8 times a whole number, which is exactly what it means for something to be divisible by 8. Since n could have been any integer, this holds for every pair of consecutive even numbers.

**Check:** Take n = 5, so the two consecutive even numbers are 2n = 10 and 2n + 2 = 12. Multiplying directly: 10 × 12 = 120. Now check against our working: n(n + 1) = 5 × 6 = 30, so k = 15 (since n(n+1) = 2k means 30 = 2k, so k = 15). Our formula says the product should be 8k = 8 × 15 = 120. The direct multiplication and the formula agree, and 120 ÷ 8 = 15 exactly, confirming the product really is divisible by 8.

**Try it:** Represent three consecutive odd integers and find their sum in simplified form. *(Answer: Use 2n + 1, 2n + 3 and 2n + 5. Their sum is 6n + 9 = 3(2n + 3), so it is a multiple of 3.)*

**Before moving on:** Do not write consecutive odd integers as n, n + 1, n + 2 — that spacing is for consecutive *integers*. Odd integers (and even integers) are 2 apart, not 1.

### Editorial record

- **Revised after human feedback.** The first draft's Example 4 compressed several algebraic moves onto single "Apply it carefully" lines (e.g. factorising and multiplying in one step, then substituting and multiplying again in one step) — too concise for a reader meeting this proof technique for the first time. Examples 3 and 4 have been rewritten so every line performs exactly one operation, with substitutions written out explicitly before they are simplified; Examples 1 and 2 have had the same treatment applied to their bracket-removal and term-collection steps, for consistency.
- Before word count: 657 words (including all four examples and the Try it), 128 words before Example 1
- After word count (revised): 1,866 words, 503 words before Example 1
- Mathematical corrections: none of the underlying mathematics was wrong. The fix is entirely structural: Example 4 (the "even + odd" proof) has been rewritten as a clean State → Work → Conclude example with no leaked answer, and moved to Example 3, where its genuinely new idea (two independent letters) sits between the two single-letter proofs and the hardest example. The former Example 3 (product of consecutive evens, divisible by 8) is now the Example 4 capstone, upgraded to the CLEAR format since it needs an embedded sub-proof (n(n+1) is always even) before the main argument can proceed. The body now opens with the concrete n = 3 / n = 100 check that the dead base-file version had and the live overlay had dropped, and reinstates the "n ranges over all integers, including negatives" caution.
- structureId note: kept `parity_check_linear` on both Example 1 and the reordered Example 3, and `three_consecutive_sum` / `consecutive_even_sum` on Examples 2 and 4 — no reassignment, since these remain the closest same-topic MCQ structures available. This is flagged, not silently accepted: a lesson that only ever links proof-writing examples to numeric-spot-check MCQ generators cannot claim the generator "tests the same skill" in the strong sense: it tests recognising the same underlying parity fact, not constructing the proof.

## Sample 2

### Location and metadata

- Module: Intermediate
- Lesson: `statisticsAdvanced`, Statistics: reading, comparing and justifying from a diagram
- Section: 4. Reading frequency back out of a histogram bar
- Mechanism: base file supplies heading and examples 1-3; `rewriteExistingLesson` overlay supplies body, note and visual; the 4th example is mechanically promoted from the base file's original tryit, and the overlay then supplies a fresh tryit alongside it
- Existing example links: `frequency_density_basic` (D1) × 2, `histogram_compare_frequencies` (D2/D3), `frequency_density_basic` (D1, promoted); tryit linked to `histogram_missing_bar` (D3/D4)
- Proposed example links: `frequency_density_basic` (D1) × 2, `histogram_compare_frequencies` (D2/D3), `histogram_missing_bar` (D3/D4, new Example 4); tryit re-linked to `histogram_missing_bar` (D3/D4) with matching content

### Complete Before version

#### 4. Reading frequency back out of a histogram bar

To recover frequency from a histogram, multiply frequency density by class width.

Think of this as rectangle area: width × height.

For a total across several classes, calculate each bar's area and then add.

If the vertical scale is missing but one class frequency is known, use that class to establish the scale first.

Keep exact values during the calculation so small rounding errors do not accumulate.

##### Example 1

**A histogram bar has frequency density 4 and class width 5. Find the frequency it represents.**

**WORK:**

1. Frequency = frequency density × class width.
2. Frequency = 4 × 5 = 20.

**Answer:** 20

##### Example 2

**A histogram bar has frequency density 3.5 and class width 12. Find the frequency it represents.**

**WORK:**

1. Frequency = frequency density × class width.
2. Frequency = 3.5 × 12 = 42.

**Answer:** 42

##### Example 3

**A histogram has two adjacent bars. The first spans the class 20-35 and has frequency density 4.8. The second spans 35-50 and has frequency density 3.2. How many more data values fall in the first class than the second?**

**WORK:**

1. Frequency = frequency density × class width.
2. First class (20-35): width = 15, frequency = 4.8 × 15 = 72.
3. Second class (35-50): width = 15, frequency = 3.2 × 15 = 48.
4. Difference = 72 − 48 = 24.
5. Even though the two classes have the same width here, the different frequency densities mean different frequencies; more generally, always recover frequency from density × width rather than reading the bar height directly as a count.

**Answer:** 24 more data values fall in the first class (72 vs 48).

##### Example 4

**A histogram bar has frequency density 2.5 and class width 20. Find the frequency it represents.**

**WORK:**

1. 50, since frequency = frequency density × class width = 2.5 × 20 = 50.

**Answer:** 50, since frequency = frequency density × class width = 2.5 × 20 = 50.

**Try it:** A histogram class from 20 to 35 has frequency density 2.4. Another class from 35 to 45 has density 3.1. Find the combined frequency. *(Answer: The first frequency is 15 × 2.4 = 36. The second is 10 × 3.1 = 31. The combined frequency is 67.)*

**Before moving on:** Do not add the bar heights to find a total frequency. Add their areas.

### Diagnosis

The five body lines are all true but never connect back to *why* width × height recovers frequency — "think of this as rectangle area" is asserted, not shown, even though the area idea is the entire justification for the rule and was presumably built up properly in this lesson's earlier sections on frequency density. The fourth body line promises a specific, harder skill — recovering a *missing* frequency density when only the total across several bars is known — but none of the four examples exercises it. The tryit's `structureId`, `histogram_missing_bar`, genuinely tests exactly that skill in the generator (given two known bars and a total, find the missing bar's density by subtracting known frequencies from the total, then dividing by the missing width) — but the tryit's own written question and answer do not: it simply sums two already-known densities' frequencies, which is just Example 3's skill again. The structureId is attached to text that does not exercise it.

Example 4 has the same promotion-artifact bug as Sample 1: its one and only line of working is "50, since frequency = frequency density × class width = 2.5 × 20 = 50" — the answer, stated as the first and only step, with no separation between reasoning and result. Because it also repeats Example 1's exact task (single bar, known density and width, find frequency) with no new idea, it is both broken and pedagogically redundant.

### Complete After proposal

#### 4. Reading frequency back out of a histogram bar

An earlier section established that frequency density = frequency ÷ class width, and that a bar's *area* — not its height — represents frequency. Rearranging that relationship the other way round gives frequency = frequency density × class width. This is genuinely just "area = width × height" applied to the rectangle each bar draws: the class width is the rectangle's width, the frequency density is its height, and the frequency is the area enclosed.

Take a bar with class width 5 and frequency density 4. Multiplying, 5 × 4 = 20, so the bar represents 20 data values — the same calculation as finding the area of a 5-by-4 rectangle, just relabelled.

When a histogram has several bars and you need a combined total, find each bar's frequency separately (width × density for that bar), then add the frequencies. Do not add the densities themselves; two bars with different widths can have very different frequencies even from similar-looking densities.

Sometimes the *density* of one bar is the value you are missing, rather than the frequency. If you know the total frequency across every bar, and you know the width and density of every bar except one, you can still find that missing bar's density: work out the known bars' frequencies, subtract their total from the grand total to leave the missing bar's frequency, then divide that by the missing bar's own width to recover its density. This runs the width × density = frequency relationship in reverse.

**Warning:** do not add bar *heights* (densities) to find a combined frequency, and do not divide the *grand total* by the missing width when recovering a missing density — only the missing bar's own share of the total, found by subtraction, should be divided by its width.

##### Example 1

**A histogram bar has frequency density 4 and class width 5. Find the frequency it represents.**

**State:** Frequency is the *area* of the bar: frequency density (height) × class width (width).

**Work:**

1. Frequency = frequency density × class width.
2. Frequency = 4 × 5 = 20.

**Conclude:** The bar represents 20 data values.

**Check:** 20 ÷ 5 = 4, the frequency density we started with — dividing back undoes the multiplication.

##### Example 2

**A histogram bar has frequency density 3.5 and class width 12. Find the frequency it represents.**

**State:** As before, frequency = frequency density × class width, now with a decimal density.

**Work:**

1. Frequency = frequency density × class width.
2. Frequency = 3.5 × 12 = 42.

**Conclude:** The bar represents 42 data values.

**Check:** 42 ÷ 12 = 3.5, matching the original density.

##### Example 3

**A histogram has two adjacent bars. The first spans the class 20-35 and has frequency density 4.8. The second spans 35-50 and has frequency density 3.2. How many more data values fall in the first class than the second?**

**State:** We need each bar's *frequency*, not its density, before we can compare or subtract — the densities alone do not tell us how many data values are in each class.

**Work:**

1. First class (20-35): width = 15, frequency = 4.8 × 15 = 72.
2. Second class (35-50): width = 15, frequency = 3.2 × 15 = 48.
3. Difference: 72 − 48 = 24.

**Conclude:** 24 more data values fall in the first class than the second.

**Check:** The two classes happen to share the same width (15) here, so the ratio of their frequencies, 72 : 48, must match the ratio of their densities, 4.8 : 3.2 — both simplify to 3 : 2. Had the widths differed, this shortcut would not apply, and the full width × density calculation would be essential.

##### Example 4

**A histogram has three bars. The first has width 4 and frequency density 5. The second has width 5 and frequency density 6. The third has width 5. The total frequency across all three bars is 100. Find the frequency density of the third bar.**

**Comprehend:** We know two complete bars and the grand total, but not the third bar's density. We must work backwards: find the third bar's *frequency* first, then convert that into a density.

**Link the facts:** The three bars' frequencies must add up to the grand total, 100. If we can find the first two bars' frequencies, subtracting their sum from 100 leaves the third bar's frequency.

**Explain the route:** Compute each known bar's frequency (width × density), subtract their total from 100, then divide the remainder by the third bar's own width (5) to recover its density.

**Apply it carefully:**

1. First bar's frequency: 4 × 5 = 20.
2. Second bar's frequency: 5 × 6 = 30.
3. Known frequencies total: 20 + 30 = 50.
4. Third bar's frequency: 100 − 50 = 50.
5. Third bar's density: 50 ÷ 5 = 10.

**Review and conclude:** The third bar has frequency density 10.

**Check:** Add all three frequencies: 20 + 30 + 50 = 100, matching the given grand total exactly.

**Try it:** A histogram has three bars. The first has width 3 and frequency density 4. The second has width 4 and frequency density 5. The third has width 6. The total frequency across all three bars is 80. Find the frequency density of the third bar. *(Answer: First frequency 3 × 4 = 12, second frequency 4 × 5 = 20, known total 32, third bar's frequency 80 − 32 = 48, third bar's density 48 ÷ 6 = 8.)*

**Before moving on:** Do not add the bar heights (densities) to find a total frequency — add their areas (frequencies). And when a density is missing, subtract frequencies to find the missing bar's own frequency before dividing by its width; do not divide the grand total by the missing width.

### Editorial record

- Before word count: 412 words (including all four examples and the Try it), 81 words before Example 1
- After word count: 984 words, 309 words before Example 1
- Mathematical corrections: none of the arithmetic was wrong, but the tryit's content did not match its own `histogram_missing_bar` structureId (it exercised the "sum two known bars" skill from Example 3, not the "recover a missing bar's density from a grand total" skill the structure actually generates). Fixed by rewriting Example 4 to be a fully worked model of the missing-bar skill (previously undemonstrated anywhere in the section despite being promised in the body) and writing a fresh, unguided tryit of the same type with different numbers, both verified against the actual `histogram_missing_bar` generator logic in `generators/intermediate-generators.js:19874`.
- structureId note: Example 4 now correctly carries `histogram_missing_bar`; the previous (broken, redundant) Example 4 content has been discarded rather than repaired, since it duplicated Example 1's task exactly.

## Sample 3

### Location and metadata

- Module: Intermediate
- Lesson: `diophantineEquations`, Diophantine Equations: integer-only solutions
- Section: 2. Finding solutions by substitution
- Mechanism: base file supplies heading and examples 1-3; `rewriteExistingLesson` overlay supplies body and note; the 4th example is mechanically promoted from the base file's original tryit, and the overlay then supplies a fresh tryit alongside it
- Existing example links: `d2_substitute_solve_for_y` (D2) × 2, `d2_counting_positive_solutions_easy` (D2), `d2_substitute_solve_for_y` (D2, promoted); tryit linked to `d3_count_nonneg_pairs` (D3)
- Proposed example links: `d2_substitute_solve_for_y` (D2) × 2, `d2_counting_positive_solutions_easy` (D2), `d2_substitute_solve_for_y` (D2, same task solved by the method the body promises); tryit unchanged

### Complete Before version

#### 2. Finding solutions by substitution

Once existence is known, isolate one variable: y = (c - ax)/b. The numerator must be divisible by b.

Use modular arithmetic to find which values of x make that divisibility condition true.

One solution leads to a whole family. For ax + by = c with gcd d, x changes by b/d while y changes by -a/d.

Apply positivity or range conditions after finding the family. These conditions often leave only a short list.

Substitute every proposed pair into the original equation. Integer-looking work can still contain an arithmetic slip.

##### Example 1

**Find a positive integer solution to 3x + 4y = 25.**

**WORK:**

1. Isolate x: x = (25 - 4y) / 3.
2. Try y=0: x = 25/3 = 8.33..., not a whole number - reject.
3. Try y=1: x = (25-4)/3 = 21/3 = 7, a whole number - success.
4. Check: 3(7) + 4(1) = 21 + 4 = 25. Correct.

**Answer:** x=7, y=1

##### Example 2

**Find a positive integer solution to 5x + 8y = 61 (a harder version needing more trials).**

**WORK:**

1. Isolate x: x = (61 - 8y) / 5.
2. Try y=1: x = (61-8)/5 = 53/5 = 10.6, not a whole number - reject.
3. Try y=2: x = (61-16)/5 = 45/5 = 9, a whole number - success.
4. Check: 5(9) + 8(2) = 45 + 16 = 61. Correct.

**Answer:** x=9, y=2

##### Example 3

**Find all positive integer solutions to 3x + 5y = 40.**

**WORK:**

1. Isolate x: x = (40 − 5y) / 3. Try y = 1: 35/3 — not a whole number. Try y = 2: 30/3 = 10. Solution (10, 2). Check: 3(10)+5(2) = 40. ✓
2. Try y = 3: 25/3 (no). y = 4: 20/3 (no). y = 5: 15/3 = 5. Solution (5, 5). Check: 3(5)+5(5) = 40. ✓
3. Try y = 6: 10/3 (no). y = 7: 5/3 (no). y = 8: 0/3 = 0 — x must be a positive integer, so x = 0 is rejected. y ≥ 9 forces x negative.
4. No further positive solutions exist.

**Answer:** (x, y) = (10, 2) or (x, y) = (5, 5)

##### Example 4

**Find a positive integer solution to 4x + 9y = 46.**

**WORK:**

1. x=7, y=2.
2. Trying y=1 gives: x = (46-9)/4 = 9.25 (reject); trying y=2 gives: x = (46-18)/4 = 7, a whole number.
3. Check: 4(7)+9(2) = 28+18 = 46.

**Answer:** x=7, y=2. Trying y=1 gives: x = (46-9)/4 = 9.25 (reject); trying y=2 gives: x = (46-18)/4 = 7, a whole number. Check: 4(7)+9(2) = 28+18 = 46.

**Try it:** Find all non-negative integer solutions of 4x + 7y = 39. *(Answer: Modulo 4, 7y ≡ 3y ≡ 39 ≡ 3, so y ≡ 1 (mod 4). Non-negative possibilities are y = 1 and 5. These give x = 8 and x = 1. The solutions are (8,1) and (1,5).)*

**Before moving on:** Finding one integer pair does not prove it is the only one. Describe the solution family, then apply the bounds.

### Diagnosis

The body's second line — "use modular arithmetic to find which values of x make that divisibility condition true" — promises a genuinely more efficient method than trial and error. Not one of the four worked examples uses it: all four search y = 0, 1, 2, 3, ... one at a time by direct substitution. The only place modular arithmetic appears anywhere in this section is the tryit, which is unguided independent practice — meaning a student meets the promised technique for the first time with no worked model to learn it from, then is immediately asked to apply it alone. That is backwards. (The technique is demonstrated elsewhere, in this lesson's Section 1, but a promise made in Section 2's own body should be kept inside Section 2.)

Example 4 has the same promotion-artifact bug as the other two samples: "x=7, y=2." opens the working as its first line, before any reasoning is shown, and the Answer field then repeats the full explanation a second time. Beyond the mechanical bug, Example 4 is also a straight repeat of Example 1 and 2's method (blind trial from y = 0) with no new idea — exactly the point where the section should instead demonstrate the smarter, promised method.

### Complete After proposal

#### 2. Finding solutions by substitution

Once you know a solution exists, isolate one variable — say x = (c − by)/a — and search for a value of y that makes the numerator divide exactly by a. The most direct way is to try y = 0, 1, 2, 3, ... in turn until one works, as in Examples 1-3 below.

That trial method always gets there in the end, but every rejected guess still costs a full subtraction and division. There is a way to rule out most guesses in advance, using nothing more than **remainders** — what is left over after dividing, a term you already know from KS3 division.

Look again at Example 1's equation, 3x + 4y = 25, to see how. We need (25 − 4y) to divide exactly by 3, which means it must leave remainder 0 when divided by 3. Instead of doing the full calculation for every possible y, work out just the remainder left by (25 − 4y) when divided by 3, for y = 0, then y = 1, then y = 2:

- y = 0: 25 − 4(0) = 25. Dividing, 25 ÷ 3 = 8 remainder 1.
- y = 1: 25 − 4(1) = 21. Dividing, 21 ÷ 3 = 7 remainder 0. This is the remainder we need.
- y = 2: 25 − 4(2) = 17. Dividing, 17 ÷ 3 = 5 remainder 2.

Now try the next value, y = 3, and compare its remainder with y = 0's: 25 − 4(3) = 13, and 13 ÷ 3 = 4 remainder 1 — the same remainder as y = 0 gave. This is not a coincidence. Increasing y by 3 changes 4y by 4 × 3 = 12, and 12 divides exactly by 3 with nothing left over, so adding 12 can never change the remainder. This means the three remainders found above, for y = 0, 1 and 2, simply repeat forever: y = 3 repeats y = 0's remainder, y = 4 will repeat y = 1's remainder (0 again), y = 5 will repeat y = 2's remainder, and so on without ever changing pattern.

So checking only three values of y — 0, 1 and 2 — reveals the complete pattern for every value of y there could ever be. Since y = 1 is the only one of those three that gives remainder 0, the only values of y that can *ever* produce a whole-number x are y = 1, 4, 7, 10, ... (every value exactly 1 more than a multiple of 3). Every other value of y, however large, is ruled out without any further checking. The first one on that list, y = 1, is exactly the solution Example 1 found by testing y = 0 and then y = 1 — the remainder method reaches the same answer, but it tells you in advance which values are even worth testing, instead of testing every single one in order.

Once one solution (x₀, y₀) is known, it generates a whole family of further solutions. For ax + by = c with highest common factor d of a and b, every solution has the form x = x₀ + (b/d)t and y = y₀ − (a/d)t for any integer t — stepping x up by b/d and y down by a/d (or vice versa) always keeps ax + by equal to c, since the two changes exactly cancel in the equation.

Apply any positivity or range condition (such as "x and y must both be positive") only after you have the general family. These conditions usually cut an infinite family down to a short, checkable list.

Always finish by substituting your proposed pair back into the *original* equation. Integer-looking working can still hide an arithmetic slip.

##### Example 1

**Find a positive integer solution to 3x + 4y = 25.**

**State:** We need (25 − 4y) to divide exactly by 3 for some non-negative y, then recover x from it.

**Work:**

1. Isolate x: x = (25 − 4y)/3.
2. Try y = 0: x = 25/3 = 8.33..., not a whole number — reject.
3. Try y = 1: x = (25 − 4)/3 = 21/3 = 7, a whole number — success.

**Conclude:** x = 7, y = 1 is a positive integer solution.

**Check:** 3(7) + 4(1) = 21 + 4 = 25. Correct.

##### Example 2

**Find a positive integer solution to 5x + 8y = 61.**

**State:** Bigger coefficients mean the trial search may need more attempts before a whole-number x appears.

**Work:**

1. Isolate x: x = (61 − 8y)/5.
2. Try y = 1: x = (61 − 8)/5 = 53/5 = 10.6, not a whole number — reject.
3. Try y = 2: x = (61 − 16)/5 = 45/5 = 9, a whole number — success.

**Conclude:** x = 9, y = 2 is a positive integer solution.

**Check:** 5(9) + 8(2) = 45 + 16 = 61. Correct.

##### Example 3

**Find all positive integer solutions to 3x + 5y = 40.**

**State:** This asks for *every* positive integer pair, not just one — so the trial search must continue past the first success until it is certain no further positive solution exists.

**Work:**

1. Try y = 1: x = 35/3, not whole. Try y = 2: x = 30/3 = 10. Solution (10, 2). Check: 3(10) + 5(2) = 40. ✓
2. Try y = 3: x = 25/3, not whole. Try y = 4: x = 20/3, not whole. Try y = 5: x = 15/3 = 5. Solution (5, 5). Check: 3(5) + 5(5) = 40. ✓
3. Try y = 6: x = 10/3, not whole. Try y = 7: x = 5/3, not whole. Try y = 8: x = 0/3 = 0 — rejected, since x must be positive.
4. For y ≥ 9, 5y > 40, forcing x negative, so no further positive solutions can exist.

**Conclude:** The complete list of positive integer solutions is (x, y) = (10, 2) and (x, y) = (5, 5).

**Check:** Both pairs satisfy 3x + 5y = 40, and the search covered every y from 0 up to the point where x would turn negative, so no solution was skipped.

##### Example 4

**Find a positive integer solution to 6x + 11y = 82, using the remainder method from the introduction above rather than trial from y = 0.**

**Comprehend:** Blind trial from y = 0 would work eventually, but the coefficients here are bigger, so it could take several rejected guesses. Instead, we will find the remainder pattern first, exactly as we did for 3x + 4y = 25, and use it to jump straight to a value of y that works.

**Link the facts:** x = (82 − 11y)/6 is a whole number exactly when (82 − 11y) leaves remainder 0 when divided by 6. Because the coefficient of x is 6, increasing y by 6 changes 11y by 11 × 6 = 66, which divides exactly by 6 — so, exactly as before, the remainder pattern must repeat every 6 values of y. This means checking y = 0, 1, 2, 3, 4 and 5 will show us the complete pattern.

**Explain the route:** Work out the remainder of (82 − 11y) divided by 6, one value of y at a time, starting from y = 0, and stop as soon as a remainder of 0 appears.

**Apply it carefully:**

1. y = 0: 82 − 11(0) = 82. Dividing, 82 ÷ 6 = 13 remainder 4.
2. y = 1: 82 − 11(1) = 71. Dividing, 71 ÷ 6 = 11 remainder 5.
3. y = 2: 82 − 11(2) = 60. Dividing, 60 ÷ 6 = 10 remainder 0. This is the remainder we need, so we can stop here.
4. Since y = 2 gives remainder 0, x = (82 − 11×2)/6 is a whole number. Work it out: 82 − 11×2 = 82 − 22 = 60.
5. Divide: x = 60/6 = 10.

**Review and conclude:** x = 10, y = 2 is a positive integer solution. Because we checked the remainders in order starting from y = 0, we know this is the *smallest* value of y that works — we did not skip over a smaller solution, and we did not need to guess y = 3, 4 or 5 once y = 2 succeeded.

**Check:** 6(10) + 11(2) = 60 + 22 = 82. Correct.

**Try it:** Find all non-negative integer solutions of 4x + 7y = 39. *(Answer: check the remainder of (39 − 7y) divided by 4 for y = 0, 1, 2, 3 — the coefficient of x is 4, so the pattern must repeat every 4 values of y. y = 0 gives remainder 3, y = 1 gives remainder 0 (39 − 7 = 32, and 32 ÷ 4 = 8 remainder 0), y = 2 gives remainder 1, y = 3 gives remainder 2. So only y = 1, 5, 9, ... can work. y = 1 gives x = (39 − 7)/4 = 8. y = 5 gives x = (39 − 35)/4 = 1. y = 9 would need x = (39 − 63)/4, which is negative, so it is rejected. The solutions are (8, 1) and (1, 5).)*

**Before moving on:** Finding one integer pair does not prove it is the only one — describe the solution family (or, for a "find all" question, search systematically to a clear stopping point) before claiming completeness.

### Editorial record

- **Revised after human feedback.** The first draft of this sample introduced formal congruence notation (≡, "mod n" as an operator, manipulating negative congruences such as "5 ≡ −1 (mod 6)") compressed into a few dense lines, on the reasoning that the pre-existing tryit already used that notation. The human editor could not follow it despite a maths degree and A-level maths, and correctly identified the underlying problem: this reader is meeting the *idea* of predicting a value from its remainder for the first time, and introducing new symbolic notation in the same breath as using it skips exactly the step that would make it learnable. The revision below removes ≡ and "mod" as an operator entirely and teaches the same idea — checking a short, provably-repeating cycle of remainders instead of testing every value of y — using only "remainder" and ordinary division, a KS3-familiar term. The technique is demonstrated fully in the body (reusing Example 1's own equation, so the student can compare the remainder method against the trial method on a case whose answer they already trust) before Example 4 applies it independently, and the tryit's answer has been rewritten in the same plain style for consistency, without changing its question or its final answer.
- Before word count: 528 words (including all four examples and the Try it), 101 words before Example 1
- After word count (revised): 1,618 words, 645 words before Example 1 — longer than the first draft, because showing a remainder table concretely for every value of y takes more words than compressing the same idea into congruence algebra. This is the intended trade: more words, but every line is followable without new notation.
- Mathematical corrections: none of the arithmetic was wrong in either draft. The remainder-table working for 6x + 11y = 82 is independently re-verified here: y = 0 gives remainder 4, y = 1 gives remainder 5, y = 2 gives remainder 0 (82 − 22 = 60, 60 ÷ 6 = 10 exactly), so x = 10, y = 2, and 6(10) + 11(2) = 82. ✓ The tryit's rewritten answer for 4x + 7y = 39 is re-verified the same way: y = 0 remainder 3, y = 1 remainder 0 (39 − 7 = 32, 32 ÷ 4 = 8), giving the same two solutions, (8, 1) and (1, 5), as the original.
- structureId note: Example 4 keeps `d2_substitute_solve_for_y`, since the task itself (find one positive integer solution) is identical to Examples 1-2 — only the *method* shown has changed, matching the KS4 standard's guidance to record a same-task/different-method choice rather than invent a new structureId where none fits better.

## Round 1 patterns for human feedback

Across all three samples, the proposed editor follows these choices:

- reconnect a stated rule to the worked derivation that justifies it, rather than asserting the rule cold;
- fix the systemic tryit-promotion bug (the promoted Example 4's first "step" was the finished answer in all three samples) by rewriting that example as a genuine State → Work → Conclude or CLEAR example;
- deliver on every promise the body makes — a promised technique (modular arithmetic) or a promised structureId's actual skill (missing-bar recovery) must appear in a worked example, not only in an unguided tryit;
- reorder or replace examples so the hardest one demands a genuinely new reasoning step, not just bigger numbers or a repeat of an earlier task;
- add a specific, checkable verification line to every example, not a generic "check the working";
- keep an existing structureId where the underlying skill matches, and say plainly where the link is only the closest available MCQ analogue to a written proof, rather than pretending a perfect match exists.

The main questions for the human editor: is the modular-arithmetic mini-derivation in Sample 3's body pitched at the right level for GCSE Higher / UKMT Intermediate (versus being pushed to a later, more advanced lesson), is the CLEAR format the right call for Sample 1's and Sample 2's Example 4, and — since the promotion-artifact bug appears to affect every lesson built on the 3-examples-plus-tryit pattern, not just these three sections — should that be fixed once at the source (the promotion script in `content/intermediate-lessons.js`) ahead of, or instead of, editing each lesson by hand?
