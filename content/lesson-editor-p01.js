import { simple, swc, clear, applyEditorialRevisions } from "./lesson-editor-runtime.js";

const S = (q, state, steps, answer, check, structureId, difficulty, conclusion = answer) =>
  simple({ q, state, steps, answer, check, structureId, difficulty, conclusion });
const W = (q, state, steps, answer, check, structureId, difficulty, conclusion = answer) =>
  swc({ q, state, steps, answer, check, structureId, difficulty, conclusion });
const C = (q, comprehend, link, explain, steps, answer, review, structureId, difficulty) =>
  clear({ q, comprehend, link, explain, steps, answer, review, state: comprehend, check: review, conclusion: answer, structureId, difficulty });

function editedRoundingSection(original, body, notes, ids) {
  return {
    h: original.h,
    body,
    examples: original.examples.map((old, index) => {
      const note = notes[index];
      const q = note.q || old.q;
      const steps = note.steps || old.steps.map(step => String(step)
        .replace(/^\((.*)\)$/, "$1")
        .replace(/^([\d,.]+)\.$/, "The rounded value is $1."));
      const answer = note.answer || old.answer;
      const config = { q, state: note.state, steps, answer, conclusion: note.conclusion || answer, check: note.check, structureId: ids[index], difficulty: index + 1 };
      if (note.format === "simple") return simple(config);
      if (note.format === "clear") return clear({ ...config, comprehend: note.state, link: note.link, explain: note.explain, review: note.check });
      return swc(config);
    })
  };
}

export function applyPrimaryEditorP01(lessons) {
  const revisions = {
    placeValue: {
      intro: "Every written number is made from the ten digits 0 to 9. In this lesson, we will see why a digit's position changes its value, how zero holds a place open and how place value helps us build, split and compare numbers.",
      sections: [
        {
          h: "1. Digits and numbers",
          body: [
            "A digit is one written number symbol. There are ten digits: 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9. We reuse these ten symbols to write every whole number, however large it is.",
            "A number can contain one digit, such as 7, or several digits, such as 406. The number 406 has three digits: 4, 0 and 6. Zero counts as a digit even though it represents no hundreds or tens in this number.",
            "Commas help us read long numbers. In 24,063, the comma is not a digit. The digits are 2, 4, 0, 6 and 3, so this is a five-digit number.",
            "The order of the digits matters. Using 2, 5 and 8 once each, 852 is greater than 825 because the first different place is the tens place: five tens are worth more than two tens."
          ],
          examples: [
            S("How many digits are in 47?", "A digit is one written number symbol.", ["The symbols in 47 are 4 and 7.", "Count them once each: one, two."], "2 digits.", "Point to 4 and then 7. There are exactly two symbols.", "digit_from_place_name", 1),
            S("How many digits are in 4,062?", "Count the number symbols, including zero, but do not count the comma.", ["The number symbols are 4, 0, 6 and 2.", "There are four of them."], "4 digits.", "Cover the comma and read the symbols from left to right: 4, 0, 6, 2.", "digit_value_from_place", 2),
            W("Use the digits 2, 5 and 8 once each to make the greatest possible number.", "Each digit must be used once. The left-hand place has the greatest value, so the largest digit belongs there.", ["Put 8 in the hundreds place because 8 is the largest digit.", "Of the two digits left, put 5 in the tens place because 5 is greater than 2.", "Put 2 in the ones place. This makes 852."], "852.", "The digits 2, 5 and 8 each appear once. Any swap would move a smaller digit to a more valuable place, so the number would decrease.", "arrange_digits_extremum", 3),
            C("Mara says 3,030 has three digits because zero means nothing. Explain her mistake.", "We must decide whether each zero counts as a digit and explain why removing it changes the number.", "A digit is a written symbol. Zero is one of the ten digits, and it can hold a place open.", "Count every symbol first. Then compare the original number with the number left after the zeros are removed.", ["The symbols are 3, 0, 3 and 0, so 3,030 has four digits.", "The first zero shows that there are no hundreds. The last zero shows that there are no ones.", "Removing both zeros gives 33, not 3,030. The remaining 3s have moved into different places."], "Mara is mistaken: 3,030 has four digits, and both zeros are important placeholders.", "Read the values: 3,000 + 30 = 3,030. By contrast, 30 + 3 = 33, so removing the zeros changes the number.", "reconstruct_from_clues", 4)
          ]
        },
        {
          h: "2. A digit's place gives it a value",
          body: [
            "The digit tells us how many groups there are. Its place tells us the size of each group. In 5, the digit 5 means five ones. In 50, it means five tens, or 50. In 500, it means five hundreds, or 500.",
            "Starting at the right, the whole-number places are ones, tens, hundreds, thousands, ten-thousands and hundred-thousands. Each move one place to the left makes the group ten times as large.",
            "The digit itself is sometimes called its face value. The amount represented by the digit in its position is its place value. In 72,500, the face value of the first digit is 7, but its place value is 70,000 because it represents seven groups of ten thousand.",
            "When a question asks how many times as valuable one digit is, compare the actual values by division. Do not compare only the names of the places."
          ],
          examples: [
            S("In 3,000, what place is the 3 in, and what value does it represent?", "Name the places from the right until we reach the 3.", ["From the right, the zeros are in the ones, tens and hundreds places.", "The next place is the thousands place, where the 3 stands.", "Three groups of one thousand make 3,000."], "The 3 is in the thousands place and represents 3,000.", "Replace the 3 by its value: 3 × 1,000 = 3,000.", "place_name_from_digit", 1),
            W("In 72,500, what place is the 7 in, and what value does it represent?", "We need both the name of the 7's place and the amount it represents.", ["Count places from the right: ones, tens, hundreds, thousands, ten-thousands.", "The 7 is in the ten-thousands place.", "Seven groups of 10,000 make 7 × 10,000 = 70,000."], "The 7 is in the ten-thousands place and represents 70,000.", "Split the number: 72,500 = 70,000 + 2,000 + 500. The 70,000 part belongs to the 7.", "digit_value_from_place", 2),
            W("In 900,009, how many times as valuable is the left-hand 9 as the right-hand 9?", "The two digits look the same, but we must compare the actual amounts represented by their places.", ["The left-hand 9 is in the hundred-thousands place, so it represents 900,000.", "The right-hand 9 is in the ones place, so it represents 9.", "For a 'how many times' comparison, divide: 900,000 ÷ 9 = 100,000."], "The left-hand 9 is 100,000 times as valuable as the right-hand 9.", "Multiply the smaller value back: 9 × 100,000 = 900,000.", "unitizing", 3),
            W("In 304,718, the digits 4 and 7 swap places. By how much does the number change?", "We must compare the original number with the number formed by swapping the thousands and hundreds digits.", ["The original number is 304,718.", "After the swap, the number is 307,418.", "Subtract to compare: 307,418 − 304,718 = 2,700."], "The number increases by 2,700.", "The 4 gains 3,600 in value while the 7 loses 900; 3,600 − 900 = 2,700.", "swap_two_digits_change", 4)
          ]
        },
        {
          h: "3. The same digit can have different values",
          body: [
            "Watch what happens to the digit 7. In 7 it represents seven ones. In 70 it represents seven tens. In 700 it represents seven hundreds. The written digit has not changed, but the size of its groups has changed.",
            "This is why it helps to say the place and the value separately. In 5,052, the first 5 is in the thousands place and represents 5,000. The second 5 is in the tens place and represents 50.",
            "Moving one place left multiplies a digit's value by 10. Moving two places left multiplies it by 100 because 10 × 10 = 100. Moving right reverses this pattern and divides the value by 10 for each place.",
            "To avoid guessing, write the value before and after the move. Then divide the larger by the smaller if the question asks how many times the value changed."
          ],
          examples: [
            S("What is the value of the digit 6 in 64?", "The 6 is in the tens place.", ["One ten is worth 10.", "Six tens are 6 × 10 = 60."], "60.", "Split 64 into 60 + 4. The 60 belongs to the digit 6.", "digit_value_from_place", 1),
            S("What is the value of the digit 6 in 406?", "The 6 is at the right-hand end, in the ones place.", ["The ones place counts single units.", "Six ones are worth 6."], "6.", "Split 406 into 400 + 0 + 6.", "digit_value_from_place", 2),
            W("What is the value of each 5 in 5,052?", "There are two 5s, so we must give two values and match each value to the correct position.", ["The left-hand 5 is in the thousands place: 5 × 1,000 = 5,000.", "The other 5 is in the tens place: 5 × 10 = 50."], "The two 5s represent 5,000 and 50.", "Add the place-value parts: 5,000 + 50 + 2 = 5,052.", "swap_two_digits_change", 3),
            C("A digit 7 becomes one hundred times as valuable after it moves. How many places did it move, and in which direction?", "We know the multiplication factor, 100, and must connect it to repeated moves between places.", "Each move left multiplies a digit's value by 10; each move right divides it by 10.", "Write 100 as repeated factors of 10. The number of factors gives the number of moves, and an increase tells us the direction.", ["100 = 10 × 10, so the value was multiplied by 10 twice.", "Two multiplications by 10 mean two place moves.", "The value increased, so both moves were to the left."], "The digit moved two places to the left.", "For example, 7 becomes 70 after one move and 700 after two. Since 700 ÷ 7 = 100, the change is correct.", "digit_range_for_inequality", 4)
          ]
        },
        {
          h: "4. Each place is ten times the place to its right",
          body: [
            "Our number system is built in groups of ten. Ten ones can be exchanged for one ten. Ten tens can be exchanged for one hundred. Ten hundreds can be exchanged for one thousand.",
            "That exchange explains the place-value pattern. If a 6 moves from the ones place to the tens place, its value changes from 6 to 60. If it moves left again, its value changes from 60 to 600.",
            "Several moves can be counted one at a time, or joined together. Two moves left multiply by 10 × 10 = 100. Three moves left multiply by 10 × 10 × 10 = 1,000.",
            "Keep the digit and its value separate in your mind: the digit may remain 6 while its value changes from 6 to 60, 600 or 6,000."
          ],
          examples: [
            S("Show how the value of the digit 6 changes in 6, 60 and 600.", "The 6 moves one place left each time.", ["In 6, it represents 6 ones, so its value is 6.", "In 60, it represents 6 tens, so its value is 60.", "In 600, it represents 6 hundreds, so its value is 600."], "Its value changes from 6 to 60 to 600.", "60 ÷ 6 = 10 and 600 ÷ 60 = 10, so each move multiplies the value by 10.", "digit_value_from_place", 1),
            W("A 5 moves from the thousands place to the ten-thousands place. How does its value change?", "This is one place to the left, so we will compare the value before and after the move.", ["In the thousands place, the 5 represents 5 × 1,000 = 5,000.", "In the ten-thousands place, it represents 5 × 10,000 = 50,000.", "50,000 ÷ 5,000 = 10."], "Its value becomes ten times as large, changing from 5,000 to 50,000.", "Check in reverse: 50,000 ÷ 10 = 5,000.", "unitizing", 2),
            W("A digit 4 starts in the ones place. How many moves left make it worth 4,000, and what is it worth after five moves?", "We must track the value after each move and answer both parts.", ["Start at 4. After one move the value is 40; after two it is 400; after three it is 4,000.", "It takes three moves to reach 4,000.", "Continue the pattern: after four moves it is 40,000 and after five it is 400,000."], "It takes three moves to reach 4,000. After five moves, the digit is worth 400,000.", "Count five place changes from ones: tens, hundreds, thousands, ten-thousands, hundred-thousands. A 4 there represents 400,000.", "two_step_partition", 3),
            W("A 9 moves three places to the left. Its old value was 90. What is its new value?", "Each of the three left moves multiplies the current value by 10.", ["First move: 90 × 10 = 900.", "Second move: 900 × 10 = 9,000.", "Third move: 9,000 × 10 = 90,000."], "The new value is 90,000.", "Divide back three times: 90,000 ÷ 10 ÷ 10 ÷ 10 = 90.", "swap_two_digits_change", 4)
          ]
        },
        {
          h: "5. Building a number from place-value parts",
          body: [
            "A number can be split into the value of each digit. For example, 3,084 is 3,000 + 0 + 80 + 4. Writing a number as this addition is called expanded form.",
            "Expanded form makes every place visible. The zero tells us there are no hundreds, but its place still has to remain between the thousands and tens.",
            "We can reverse the process to build a number. Put 3 thousands, 0 hundreds, 8 tens and 4 ones into their columns. Reading the digits in order gives 3,084.",
            "When a place is not mentioned, check whether it lies between two places that are mentioned. If it does, write a zero there so the other digits do not slide into the wrong positions."
          ],
          examples: [
            W("A number has 2 ten-thousands, 5 thousands, 0 hundreds, 6 tens and 1 one. What is the number?", "We will turn every named part into a value, including the empty hundreds place.", ["The parts are 20,000, 5,000, 0, 60 and 1.", "Add the large parts: 20,000 + 5,000 = 25,000.", "Add the remaining parts: 25,000 + 60 + 1 = 25,061."], "The number is 25,061.", "Partition 25,061: it contains 2 ten-thousands, 5 thousands, 0 hundreds, 6 tens and 1 one.", "compose_from_named_parts", 1),
            W("Write the number made of 4 ten-thousands, 7 thousands, 0 hundreds, 0 tens and 9 ones.", "The two empty places must be shown with zeros.", ["Four ten-thousands are 40,000 and seven thousands are 7,000.", "There are no hundreds or tens, so write zeros in those columns.", "40,000 + 7,000 + 9 = 47,009."], "The number is 47,009.", "Read the digits by place: 4, 7, 0, 0, 9. They match every part in the question.", "compose_from_named_parts", 2),
            W("A number is 3 × 100,000 + 5 × 10,000 + 0 × 1,000 + 8 × 100 + 4 × 10 + 6. What is it?", "Each multiplication gives one place-value part. We must calculate and combine all six parts.", ["The parts are 300,000, 50,000, 0, 800, 40 and 6.", "300,000 + 50,000 = 350,000, then add 800 to get 350,800.", "Add 40 and 6: 350,800 + 40 + 6 = 350,846."], "The number is 350,846.", "Expand 350,846 again. It returns to 300,000 + 50,000 + 800 + 40 + 6.", "matching_expanded_form", 3),
            C("A five-digit number has 7 in the ten-thousands place, 3 in the hundreds place, 8 in the tens place and 2 in the ones place. Its digits total 20. What is the number?", "Four places are known, but the thousands digit is missing. The digit-total clue determines it.", "The known digits total 7 + 3 + 8 + 2 = 20.", "Subtract the known total from the required total, then place the missing digit in the thousands column.", ["The missing digit is 20 − 20 = 0.", "The place digits are 7, 0, 3, 8 and 2.", "They form 70,382."], "The number is 70,382.", "Its digit total is 7 + 0 + 3 + 8 + 2 = 20, and every stated place is correct.", "reconstruct_from_clues", 4)
          ]
        },
        {
          h: "6. Zero holds an empty place open",
          body: [
            "Zero can represent an amount of nothing, but that does not make it useless. Inside a number, zero can hold an empty place open. We call it a placeholder.",
            "In 5,007, the 5 represents thousands and the 7 represents ones. The two zeros say there are no hundreds and no tens. Without them, 57 would mean five tens and seven ones, which is a completely different number.",
            "Think of labelled seats. An empty seat remains in its numbered position; everyone else does not slide along. A zero works like that empty seat and keeps the surrounding digits in their correct columns.",
            "When building or reading a number, name every place from the first non-zero digit to the ones place. Put a zero in any empty place between them."
          ],
          examples: [
            W("A number has 5 thousands, 0 hundreds, 0 tens and 7 ones. What is it, and why do the zeros matter?", "The zeros must keep the hundreds and tens places open.", ["Write the place-value parts: 5,000 + 0 + 0 + 7.", "Join the place digits in order: 5, 0, 0, 7.", "This gives 5,007."], "The number is 5,007. The zeros keep the 5 in the thousands place and the 7 in the ones place.", "Removing the zeros gives 57. Since 57 is not 5,007, both placeholders are necessary.", "compose_from_named_parts", 1),
            W("A number has 3 ten-thousands, 0 thousands, 6 hundreds, 0 tens and 4 ones. What is it?", "We need to preserve both empty places while combining the non-zero parts.", ["The parts are 30,000 + 0 + 600 + 0 + 4.", "The place digits are 3, 0, 6, 0 and 4.", "30,000 + 600 + 4 = 30,604."], "The number is 30,604.", "Read it back by place: 3 ten-thousands, 0 thousands, 6 hundreds, 0 tens and 4 ones.", "missing_addend_partition", 2),
            W("Arrange 8, 5, 0, 4, 0 and 3 to make the greatest possible six-digit number.", "All six digits must be used. Larger non-zero digits should take the more valuable places, while zeros should be as far right as possible.", ["Order the non-zero digits from greatest to least: 8, 5, 4, 3.", "Place the two zeros after them because zeros in earlier places would push a positive digit to a less valuable place.", "The arrangement is 8, 5, 4, 3, 0, 0, giving 854,300."], "The greatest number is 854,300.", "Every digit is used once. Swapping either zero with a non-zero digit to its left would make the number smaller.", "arrange_digits_extremum", 3),
            W("Which digit makes 40,□08 equal to 40,000 + 600 + 8?", "The box is in the hundreds place, so it must show how many hundreds appear in the expanded form.", ["40,000 contributes a 4 in the ten-thousands place.", "The term 600 means six hundreds, so the boxed digit is 6.", "The final 8 is in the ones place; the thousands and tens places are held by zeros."], "The missing digit is 6, making 40,608.", "Expand 40,608: 40,000 + 600 + 8, exactly as required.", "reconstruct_from_clues", 4)
          ]
        },
        {
          h: "7. Counting whole groups of tens or hundreds",
          body: [
            "The value of one digit is not the same as the number of groups inside the whole number. In 4,700, the 7 represents 700, but the whole number contains 470 groups of ten.",
            "To find how many tens are in a number, divide the whole number by 10. Thus 4,700 ÷ 10 = 470. To find how many hundreds are in it, divide by 100: 4,700 ÷ 100 = 47.",
            "This is called unitising: choosing a group, such as ten or one hundred, and counting the total in those groups. Money gives a familiar example: 4,700 pence can be exchanged for 47 groups of 100 pence, so it is £47.",
            "For numbers ending in zeros, removing one final zero when dividing by 10 is a useful shortcut. The reason is not that zeros simply disappear: every digit's value has become one tenth as large."
          ],
          examples: [
            S("What is the value of the digit 5 in 850?", "The 5 is in the tens place.", ["Five groups of ten are 5 × 10 = 50."], "The digit 5 represents 50.", "Partition 850 as 800 + 50.", "digit_value_from_place", 1),
            W("How many hundreds are in 47,300?", "Each group contains 100, so divide the entire amount by 100.", ["47,300 ÷ 100 = 473.", "This means 473 groups, each containing 100."], "There are 473 hundreds in 47,300.", "473 × 100 = 47,300, so the groups rebuild the original number.", "unitizing", 2),
            W("A library has 3,650 books. Full shelves hold 100 books and full boxes hold 10. Fill shelves first. How many shelves and boxes are needed?", "Use as many groups of 100 as possible, then group the remaining books in tens.", ["3,650 contains 36 full hundreds because 36 × 100 = 3,600.", "The remainder is 3,650 − 3,600 = 50 books.", "50 ÷ 10 = 5, so the remainder fills 5 boxes."], "The librarian needs 36 full shelves and 5 full boxes.", "Check: 36 × 100 + 5 × 10 = 3,600 + 50 = 3,650.", "two_step_partition", 3),
            C("How does the value of the digit 7 change when 7,300 is divided by 100?", "We must follow the same digit through the division and compare its old and new values.", "Dividing a whole number by 100 makes every place value one hundred times smaller, which is two moves to the right.", "Find the original value, divide the number, find the new value, then compare them.", ["In 7,300, the 7 represents 7,000.", "7,300 ÷ 100 = 73.", "In 73, the 7 represents 70.", "7,000 ÷ 70 = 100."], "The 7's value changes from 7,000 to 70, so it becomes one hundred times smaller.", "Reverse the operation: 73 × 100 = 7,300, and 70 × 100 = 7,000.", "swap_two_digits_change", 4)
          ]
        },
        {
          h: "8. Comparing numbers from the greatest place",
          body: [
            "To compare whole numbers, begin at the greatest place on the left. A difference in a high-value place outweighs every possible difference in the places to its right.",
            "Compare 68,412 with 68,439. The ten-thousands, thousands and hundreds digits match. The first difference is in the tens place: one ten compared with three tens. Therefore 68,439 is greater.",
            "For several numbers, line up digits in place-value columns. Sort by the leftmost digit first. When digits match, move one place right until a difference appears.",
            "The symbols < and > point towards the smaller number and open towards the larger number. For example, 68,412 < 68,439."
          ],
          examples: [
            W("Which is greater: 50,284 or 50,192?", "Compare matching places from left to right until the first difference.", ["Both numbers have 5 ten-thousands and 0 thousands.", "In the hundreds place, 50,284 has 2 while 50,192 has 1.", "Two hundreds are greater than one hundred, so later digits cannot change the result."], "50,284 is greater.", "Their difference is 50,284 − 50,192 = 92, which is positive.", "compare_five_numbers", 1),
            W("Order 83,047, 83,407 and 83,470 from smallest to largest.", "The first two places match in all three numbers, so the hundreds and tens places will decide the order.", ["At the hundreds place, 83,047 has 0 while the other two have 4, so 83,047 is smallest.", "Compare 83,407 and 83,470. Their hundreds match, but the tens digits are 0 and 7.", "Therefore 83,407 comes before 83,470."], "83,047, 83,407, 83,470.", "Read the list from left to right: each number is larger than the one before it.", "order_numbers", 2),
            W("I am thinking of a five-digit number. It is between 62,000 and 63,000. Its hundreds digit is 7, its ones digit is 4 and its tens digit is one more than its ones digit. What is the number?", "Each clue fixes one or more places. We must combine all the clues without dropping any of them.", ["Being between 62,000 and 63,000 fixes the first two digits as 6 and 2.", "The hundreds digit is 7 and the ones digit is 4.", "The tens digit is one more than 4, so it is 5.", "The place digits are 6, 2, 7, 5, 4."], "The number is 62,754.", "It lies in the stated interval, its hundreds digit is 7, and its tens digit 5 is one more than its ones digit 4.", "reconstruct_from_clues", 3),
            C("Use 2, 4, 6, 8 and 0 once each to make the greatest number below 70,000.", "We need a five-digit number using every digit once. The upper limit controls the first digit; place value controls the remaining order.", "A number beginning with 8 would exceed 70,000. The greatest allowed first digit is therefore 6.", "After choosing the greatest legal first digit, maximise each remaining place from left to right.", ["Put 6 in the ten-thousands place.", "Arrange the unused digits 8, 4, 2 and 0 in descending order.", "This gives 68,420."], "The greatest possible number below 70,000 is 68,420.", "Every digit is used once and 68,420 is below 70,000. Any larger leading digit is forbidden, and any swap among the remaining digits makes a smaller number.", "arrange_digits_with_parity", 4)
          ]
        },
        {
          h: "9. Roman numerals: another way to write numbers",
          body: [
            "Roman numerals use letters as number symbols. The symbols needed here are I = 1, V = 5, X = 10, L = 50 and C = 100.",
            "When symbols run from greater to smaller, add them. LXII means 50 + 10 + 1 + 1 = 62. A smaller symbol immediately before a larger one forms a subtractive pair: IV means 5 − 1 = 4, IX means 10 − 1 = 9 and XL means 50 − 10 = 40.",
            "To write a number, split it into useful parts. For 74, write 70 as LXX and 4 as IV, then join them to make LXXIV.",
            "In a longer problem, translate the Roman numerals into ordinary numbers first. Then carry out the comparison or calculation, keeping the translation and arithmetic as separate steps."
          ],
          examples: [
            S("An old Ninefold dial is marked IX. What ordinary number does IX represent?", "I before X forms a subtractive pair.", ["I represents 1 and X represents 10.", "Subtract the smaller value from the larger: 10 − 1 = 9."], "IX represents 9.", "On a Roman-numeral clock, IX appears where 9 belongs.", "roman_clock_read", 1),
            W("Write 74 in Roman numerals.", "Split 74 into a tens part and a ones part, then translate each part.", ["74 = 70 + 4.", "Seventy is 50 + 10 + 10, written LXX.", "Four is one before five, written IV.", "Join the parts: LXX + IV gives LXXIV."], "74 is LXXIV.", "Translate back: LXXIV = 50 + 10 + 10 + (5 − 1) = 74.", "roman_numeral_construct", 2),
            W("Two orchard stones are marked CXL and CLX. Which has the greater value?", "Translate both inscriptions before comparing them.", ["CXL = 100 + (50 − 10) = 140.", "CLX = 100 + 50 + 10 = 160.", "Since 160 > 140, CLX is greater."], "CLX has the greater value.", "The difference is 160 − 140 = 20, so the comparison is strict.", "roman_numeral_compare", 3),
            C("A ledger records CCXLVIII baskets, then LXXVI more arrive. How many baskets are recorded now?", "Translate both Roman numerals, then add because more baskets arrive.", "CCXLVIII is 200 + 40 + 8. LXXVI is 50 + 20 + 6.", "Convert each amount before carrying out the addition, so the numeral rules and the arithmetic stay clear.", ["CCXLVIII = 248.", "LXXVI = 76.", "Add: 248 + 76 = 248 + 70 + 6 = 318 + 6 = 324."], "There are 324 baskets recorded.", "Subtract the delivery: 324 − 76 = 248, which returns to the starting amount CCXLVIII.", "roman_ledger_change", 4)
          ]
        }
      ]
    },
    roundingEstimate: {
      intro: "Rounding replaces an exact number with a nearby, easier number. We will use number lines to see why the rule works, round whole numbers and decimals, work backwards from rounded values and use estimates to judge whether calculations are sensible.",
      sections: [
        editedRoundingSection(lessons.roundingEstimate.sections[0], [
          "To round a number, we replace it with a nearby multiple of a chosen size. For example, rounding 62 to the nearest ten means choosing between the neighbouring tens 60 and 70.",
          "The exact number and the rounded number are not equal. The symbol ≈ means ‘is approximately equal to’, so we may write 62 ≈ 60. An approximation is a useful nearby value, not an exact one.",
          "Distance decides which choice is nearer. The number 62 is 2 away from 60 and 8 away from 70, so 60 is nearer.",
          "Always notice what the question asks you to round to. The nearest ten, nearest hundred and nearest thousand use different neighbouring multiples."
        ], [
          { format: "simple", state: "We are choosing between the two neighbouring multiples of 10 around 23.", check: "The distances are 23 − 20 = 3 and 30 − 23 = 7. Since 3 is smaller, 20 is nearer." },
          { state: "Rounding 67 to the nearest ten means choosing between 60 and 70.", check: "67 is 7 away from 60 but only 3 away from 70, so 70 is the closer ten." },
          { state: "‘About 300’ means the exact whole number lies in the range that rounds to 300 to the nearest hundred.", check: "327 is 27 away from 300 and 73 away from 400, so it rounds to 300." },
          { format: "clear", q: "Twenty-eight children need minibuses that each hold 10 children. How many minibuses must be booked?", state: "This is a practical whole-group question. Every child needs a seat, so an incomplete final group still needs its own minibus.", link: "Two minibuses hold only 20 children, while three hold 30.", explain: "Divide to find the number of groups, then round the number of groups upwards because part of a minibus cannot be booked.", steps: ["28 ÷ 10 = 2 remainder 8, so two buses are full and eight children remain.", "The remaining eight children need one more bus.", "2 + 1 = 3."], answer: "Three minibuses must be booked.", check: "Two buses provide 20 seats, which is not enough. Three provide 30 seats, enough for all 28 children with two spare seats." }
        ], ["closer_to_which_bound", "round_whole_number", "reverse_rounding_choose", "choose_rounding_direction_context"]),
        editedRoundingSection(lessons.roundingEstimate.sections[1], [
          "A number line puts numbers in order at equal distances, like marks on a ruler. It lets us see rounding as a choice between two neighbouring multiples.",
          "For 47 to the nearest ten, the neighbours are 40 and 50. The halfway point is 45. Numbers below 45 are nearer 40; numbers above 45 are nearer 50.",
          "The same picture works for hundreds and thousands. For 4,465 to the nearest hundred, place it between 4,400 and 4,500 and compare its distance from both ends.",
          "If a number is exactly halfway, distance alone cannot choose. The agreed whole-number convention is to round to the greater neighbouring multiple."
        ], [
          { format: "simple", state: "Place 62 between its neighbouring tens, 60 and 70.", check: "62 is 2 from 60 and 8 from 70, so it must be nearer 60." },
          { state: "The neighbouring tens around 187 are 180 and 190.", check: "187 − 180 = 7 and 190 − 187 = 3. The smaller distance leads to 190." },
          { state: "The neighbouring hundreds around 4,465 are 4,400 and 4,500.", check: "4,465 − 4,400 = 65, while 4,500 − 4,465 = 35. Therefore 4,500 is nearer." },
          { state: "We need the midpoint between 40 and 50, then the agreed answer for an exact halfway value.", check: "45 − 40 = 5 and 50 − 45 = 5, so 45 is exactly halfway. The convention sends it to 50." }
        ], ["nearest_multiple", "round_whole_number", "halfway_convention", "reverse_halfway_value"]),
        editedRoundingSection(lessons.roundingEstimate.sections[2], [
          "Once the number-line idea is secure, one digit can tell us which half of the interval contains the number. First identify the place you are rounding to. Then inspect the digit immediately to its right.",
          "If that deciding digit is 0, 1, 2, 3 or 4, keep the rounding digit unchanged. If it is 5, 6, 7, 8 or 9, increase the rounding digit by one. Replace every later digit with zero.",
          "This shortcut works because the deciding digit shows whether the number is below or at least halfway across the interval. The later digits cannot move a number back into the other half.",
          "An increase can cause a carry. For example, rounding 596,482 to the nearest ten-thousand increases the 9 ten-thousands to 10 ten-thousands, which carries into the next place and gives 600,000."
        ], [
          { state: "The required place is hundreds, so the tens digit will decide whether 3,847 rounds down or up.", check: "3,847 lies between 3,800 and 3,900. Its distances are 47 and 53, so 3,800 is nearer." },
          { state: "The required place is thousands, so inspect the hundreds digit in 76,320.", check: "76,320 is 320 above 76,000 and 680 below 77,000, confirming 76,000." },
          { state: "The deciding digit is 6, so the 9 in the ten-thousands place must increase and create a carry.", check: "596,482 is 3,518 from 600,000 but 6,482 from 590,000, so 600,000 is nearer." },
          { format: "clear", q: "Round 999,950 to the nearest hundred.", state: "We must round to a multiple of 100. The number is exactly between 999,900 and 1,000,000.", link: "The tens digit is 5, so the hundreds digit rounds up. Increasing a 9 causes a chain of carries.", explain: "Apply the rounding increase from the hundreds place and carry through every 9 before replacing later digits with zeros.", steps: ["The neighbouring hundreds are 999,900 and 1,000,000.", "999,950 is 50 from each, so the halfway rule chooses the greater hundred.", "Increasing the 9 hundreds carries through the thousands, ten-thousands and hundred-thousands places."], answer: "999,950 rounds to 1,000,000.", check: "Both distances are 50, and the agreed halfway rule selects 1,000,000." }
        ], ["round_whole_number", "round_whole_number", "halfway_convention", "reverse_rounding_bounds"]),
        editedRoundingSection(lessons.roundingEstimate.sections[3], [
          "The same number can have several correct rounded forms because the requested place controls the size of the interval.",
          "For 6,382, rounding to the nearest thousand compares 6,000 and 7,000, giving 6,000. To the nearest hundred it compares 6,300 and 6,400, giving 6,400. To the nearest ten it compares 6,380 and 6,390, giving 6,380.",
          "Rounding to a larger place gives a rougher answer. Rounding to a smaller place usually keeps more detail. Neither is automatically better: the useful choice depends on the question.",
          "Mark the requested place before looking right. This prevents the common mistake of using the right rule at the wrong place."
        ], [
          { state: "We are rounding 2,548 to thousands, so compare it with 2,000 and 3,000.", check: "2,548 is 452 from 3,000 and 548 from 2,000, so 3,000 is nearer." },
          { state: "The thousands digit in 38,714 is 8; the hundreds digit 7 decides the direction.", check: "38,714 is 286 from 39,000 but 714 from 38,000." },
          { state: "The 6 in the hundreds place makes 99,649 round up at the thousands place, with carrying through the 9s.", check: "The distances to 100,000 and 99,000 are 351 and 649, so 100,000 is nearer." },
          { format: "clear", q: "Round 6,382 to the nearest thousand, hundred and ten. Which rounded value is closest to the original?", state: "We need three rounded values and then must compare their errors, meaning their distances from 6,382.", link: "Each requested place has different neighbouring multiples.", explain: "Round independently at each place, then subtract each result from the original to compare distances.", steps: ["Nearest thousand: 6,382 rounds to 6,000; the error is 382.", "Nearest hundred: it rounds to 6,400; the error is 18.", "Nearest ten: it rounds to 6,380; the error is 2.", "The smallest error is 2."], answer: "The rounded values are 6,000, 6,400 and 6,380. The nearest-ten value, 6,380, is closest.", check: "The distances 382, 18 and 2 confirm that 6,380 is closest." }
        ], ["round_whole_number", "round_whole_number", "reverse_rounding_choose", "reverse_halfway_value"]),
        editedRoundingSection(lessons.roundingEstimate.sections[4], [
          "Digits after a decimal point represent parts smaller than one. The first place is tenths, the second is hundredths and the third is thousandths.",
          "The place-value pattern still changes by a factor of ten: ten hundredths make one tenth, and ten tenths make one whole.",
          "Rounding a decimal uses the same method as rounding a whole number. Mark the place to keep, inspect the next digit and then remove the later digits.",
          "Rounding in stages can change an answer twice. Unless a question asks for stages, always round the original value directly to the requested place."
        ], [
          { state: "One decimal place means keep the tenths digit in 12.65 and use the hundredths digit to decide.", check: "12.65 is exactly halfway between 12.6 and 12.7, so the convention chooses 12.7." },
          { state: "Keep the tenths digit 3 and inspect the hundredths digit 7.", check: "8.374 is 0.026 from 8.4 and 0.074 from 8.3, so 8.4 is nearer." },
          { format: "clear", state: "We must compare two routes: rounding in two stages and rounding the original directly.", link: "The first route changes 15.849 to 15.85 before the final decision; the direct route looks at the original hundredths digit.", explain: "Calculate both routes separately so that a rounded intermediate value is never mistaken for the original.", check: "15.849 is 0.049 from 15.8 and 0.051 from 15.9, so direct rounding correctly gives 15.8 even though staged rounding gives 15.9." },
          { q: "Round 99.95 to 1 decimal place.", state: "Keep the tenths digit 9 and inspect the hundredths digit 5. Rounding up will create a carry across the decimal point.", steps: ["The hundredths digit is 5, so increase the tenths digit.", "Nine tenths increased by one tenth make one whole.", "The carry changes 99 whole ones to 100, leaving 0 tenths."], answer: "99.95 rounds to 100.0 to 1 decimal place.", check: "99.95 is halfway between 99.9 and 100.0, so the convention chooses 100.0." }
        ], ["round_decimal", "round_decimal", "halfway_convention", "reverse_halfway_value"]),
        editedRoundingSection(lessons.roundingEstimate.sections[5], [
          "A halfway number is the same distance from the lower and upper choices. For 25 to the nearest ten, both distances are 5.",
          "To ensure everyone gets the same answer, we use a convention: an exact halfway value rounds to the greater neighbouring multiple. Thus 25 rounds to 30 and 350 rounds to 400.",
          "A convention is an agreed rule. Distance cannot decide a tie, so the convention completes the method.",
          "Check that the number really is halfway. Find both distances rather than assuming that every number containing a 5 is a halfway case."
        ], [
          { state: "The neighbouring hundreds are 300 and 400; we must compare both distances.", check: "350 − 300 = 50 and 400 − 350 = 50, so the halfway rule gives 400." },
          { state: "The neighbouring thousands are 6,000 and 7,000.", check: "6,500 is 500 from both neighbours, so it rounds to the greater one, 7,000." },
          { format: "clear", state: "The same original number must be rounded independently to two different place values.", link: "2,450 is halfway between hundreds but is not halfway between thousands.", explain: "Find fresh neighbours and distances for each requested place rather than rounding the first answer again.", check: "For hundreds the distances are 50 and 50; for thousands they are 450 and 550. These confirm 2,500 and 2,000." },
          { q: "A whole number is halfway between 2,300 and 2,400. What is it, and how does it round to the nearest hundred?", state: "Find half of the 100-wide gap, then apply the halfway convention.", steps: ["The gap is 2,400 − 2,300 = 100.", "Half of 100 is 50, so the halfway number is 2,300 + 50 = 2,350.", "An exact halfway value rounds to the greater hundred."], answer: "The number is 2,350, and it rounds to 2,400.", check: "2,350 is 50 from each neighbour, so it is exactly halfway." }
        ], ["round_whole_number", "halfway_convention", "halfway_convention", "reverse_halfway_value"]),
        editedRoundingSection(lessons.roundingEstimate.sections[6], [
          "Working backwards from a rounded value usually produces a range, not one exact number. Many nearby values can round to the same multiple.",
          "Whole numbers that round to 600 to the nearest hundred begin at 550. This lower boundary is included because 550 is halfway and rounds upwards to 600.",
          "The upper boundary is 650, but it is not included because 650 rounds upwards to 700. Therefore the greatest whole number in the range is 649.",
          "For a rounding unit of size 100, move half a unit, 50, in each direction. For a unit of 10, move 5. Test both boundary values to decide which endpoint is included."
        ], [
          { state: "The rounding unit is 100, so the lower boundary lies 50 below 3,000.", check: "2,950 rounds to 3,000, but the next smaller whole number, 2,949, rounds to 2,900." },
          { state: "The upper boundary is halfway from 4,000 to 4,100. That boundary rounds away, so the previous whole number is the largest possible value.", check: "4,049 rounds to 4,000, while 4,050 rounds to 4,100." },
          { state: "We need both included whole-number endpoints of the interval that rounds to 600 to the nearest ten.", check: "595 rounds up to 600 and 604 rounds down to 600. Just outside, 594 rounds to 590 and 605 rounds to 610." },
          { format: "clear", q: "How many whole numbers round to 80 to the nearest ten?", state: "We need the complete included range, then its number of whole-number members.", link: "The lower boundary 75 is included, while the upper halfway boundary 85 rounds to 90 and is excluded.", explain: "Find the smallest and largest included whole numbers, then count inclusively.", steps: ["The smallest value is 75.", "The largest value is 84.", "Count inclusively: 84 − 75 + 1 = 10."], answer: "Ten whole numbers round to 80: 75 through 84.", check: "The list 75, 76, 77, 78, 79, 80, 81, 82, 83, 84 contains ten values; 74 and 85 round elsewhere." }
        ], ["round_whole_number", "reverse_rounding_choose", "reverse_rounding_bounds", "reverse_rounding_bounds"]),
        editedRoundingSection(lessons.roundingEstimate.sections[7], [
          "An estimate is a quick approximate answer. We often make one by rounding the given numbers to friendly values and then calculating with those values.",
          "Estimation can answer a practical question quickly or check an exact calculation. For 612 + 289, rounding to hundreds gives 600 + 300 = 900, so an exact answer near 900 is believable.",
          "For multiplication, notice whether each factor rounded up or down. If both round up, the estimated product will usually be greater than the exact product.",
          "An estimate is not proof that an exact answer is correct, but it catches errors of size and place value. An answer of 90 or 90,000 would be unreasonable when the estimate is about 900."
        ], [
          { state: "Round both addends to the requested hundreds, then add the friendly values.", check: "The exact sum is 901, only 1 away from the estimate 900." },
          { state: "Round each addend independently to the nearest thousand before adding.", check: "The exact sum is 4,931, which is 69 away from 5,000 and has the expected size." },
          { state: "Round both factors to tens, multiply, then predict whether the estimate is high or low.", check: "The exact product is 47 × 38 = 1,786. Since both factors were rounded up, 2,000 is reasonably a little high." },
          { format: "clear", q: "Estimate 198 × 51 by rounding each factor to the nearest ten. Then use the estimate to judge whether an exact answer of 1,098 is sensible.", state: "We need an estimated product and must use its size to test a proposed exact answer.", link: "198 is near 200 and 51 is near 50, giving friendly factors.", explain: "Round, multiply the friendly numbers, then compare the number of thousands in the estimate and proposed result.", steps: ["198 rounds to 200 and 51 rounds to 50.", "200 × 50 = 10,000, so the exact product should be near ten thousand.", "The proposed answer 1,098 is near one thousand, about ten times too small."], answer: "The estimate is 10,000, so 1,098 is not sensible.", check: "The exact product is 198 × 51 = 198 × 50 + 198 = 9,900 + 198 = 10,098, which is close to 10,000." }
        ], ["closer_to_which_bound", "estimate_sum_by_rounding", "estimate_product_by_rounding", "estimate_product_by_rounding"])
      ]
    }
  };

  applyEditorialRevisions(lessons, revisions);
}
