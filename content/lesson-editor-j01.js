import { applyEditorialRevisions, clear, simple, swc } from "./lesson-editor-runtime.js";

const revisions = {
  placeValue: {
    intro: "Place value is the system that gives each digit its value. A digit in the tens place is worth ten times as much as the same digit in the ones place. The pattern continues to the left through hundreds and thousands, and to the right through tenths, hundredths and thousandths. In this lesson we will use that pattern to read, compare and build numbers, then place negative numbers on the same number line and use place value to round accurately.",
    recap: [
      "A digit's face value is the symbol itself. Its place value is the amount it represents in that position.",
      "Moving one place left multiplies a digit's value by 10. Moving one place right divides its value by 10.",
      "Compare decimals from the greatest place. Extra zeroes at the far right do not change a decimal's value.",
      "Numbers become greater as you move right along a number line, including on the negative side of zero.",
      "To round, name the place being kept and inspect the digit immediately to its right."
    ],
    mistakes: [
      "Giving a digit's face value when the question asks for its actual place value.",
      "Comparing decimals by counting their digits instead of comparing matching places.",
      "Treating −8 as greater than −3 because the face value 8 is greater than 3.",
      "Looking at a digit several places to the right when only the next digit decides rounding.",
      "Including an upper rounding boundary even though that halfway value rounds to the next result."
    ],
    sections: [
      {
        h: "1. A digit has a face value and a place value",
        body: [
          "There are only ten digits: 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9. A digit is one written symbol. A number may contain several digits, and the position of each digit tells us how much it is worth.",
          "Look at the digit 6 in 6, 60 and 600. Its face value is still six each time because the symbol itself has not changed. Its place value has changed. In 6 it means six ones. In 60 it means six tens, which is 60. In 600 it means six hundreds, which is 600.",
          "Moving a digit one place to the left makes its value ten times as large. Moving it one place to the right makes its value one tenth as large. This happens because every place is built from ten copies of the place immediately to its right.",
          "Zero has an important job as a placeholder. In 4,072, the zero shows that there are no hundreds. Without it, 4,072 would become 472 and the 4 would no longer be in the thousands place. The zero adds no hundreds, but it keeps every other digit in the correct position.",
          "We can expose the value of every digit by writing a number in expanded form. For example, 4,072 = 4,000 + 70 + 2. We do not need to write a separate + 0 hundreds because adding zero changes nothing, although the zero must remain in the original numeral to hold the place.",
          "When a question compares the same digit in two places, compare the actual values, not merely the names of the places. In 7.372, the first 7 is worth 7 and the second 7 is worth 0.07. The calculation 7 ÷ 0.07 = 100 proves that the first 7 is 100 times as valuable.",
          "A place-value chart can help when a number is described in words. Write the column headings first, place each stated digit in its column and fill every empty place between used columns with zero. Put the decimal point between the ones and tenths columns."
        ],
        note: "Name the place, then state the digit's actual value. The digit 6 in the thousands place has value 6,000, not 6.",
        misconception: "A zero may contribute no amount while still doing the essential job of holding a place.",
        examples: [
          simple({
            q: "What is the value of the 6 in 46,218?",
            state: "We need the amount represented by the digit 6, so we must identify its place.",
            steps: [
              "Read the places from the right: ones, tens, hundreds, thousands, ten-thousands.",
              "The 6 is in the thousands place.",
              "Six thousands means 6 × 1,000 = 6,000."
            ],
            answer: "6,000",
            conclusion: "The value of the 6 is 6,000",
            check: "Expand the number: 46,218 = 40,000 + 6,000 + 200 + 10 + 8. The 6 contributes 6,000.",
            structureId: "placeValue_route_1_countIntegers",
            difficulty: 1
          }),
          swc({
            q: "Write 30,405 in expanded form.",
            state: "Expanded form must show the value contributed by each non-zero digit in 30,405.",
            steps: [
              "The 3 is in the ten-thousands place, so it contributes 3 × 10,000 = 30,000.",
              "The first zero shows there are no thousands.",
              "The 4 is in the hundreds place, so it contributes 4 × 100 = 400.",
              "The next zero shows there are no tens, and the 5 contributes 5 ones.",
              "Add the non-zero contributions: 30,000 + 400 + 5."
            ],
            answer: "30,000 + 400 + 5",
            conclusion: "30,405 = 30,000 + 400 + 5",
            check: "Add the parts back together: 30,000 + 400 + 5 = 30,405. Both zero placeholders return to the correct places.",
            structureId: "placeValue_route_1_countIntegers",
            difficulty: 2
          }),
          swc({
            q: "In 7.372, how many times as valuable is the 7 in the ones place as the 7 in the hundredths place?",
            state: "The two digits have the same face value, but they occupy different places. We must compare their actual values by division.",
            steps: [
              "The first 7 is in the ones place, so its value is 7.",
              "The second 7 is in the hundredths place, so its value is 7 hundredths = 0.07.",
              "To find how many times as large 7 is as 0.07, divide: 7 ÷ 0.07.",
              "Multiplying both numbers in the division by 100 gives 700 ÷ 7 = 100."
            ],
            answer: "100 times",
            conclusion: "The 7 in the ones place is 100 times as valuable as the 7 in the hundredths place",
            check: "Reverse the comparison by multiplying: 0.07 × 100 = 7. This returns exactly to the value of the first digit.",
            structureId: "placeValue_route_1_countIntegers",
            difficulty: 3
          }),
          clear({
            q: "A number has 5 ten-thousands, no thousands, 3 hundreds, no tens, no ones, 2 tenths and 9 hundredths. Write the number.",
            state: "We must place every stated digit in its named column and use zero wherever an empty place lies between used places.",
            comprehend: "The number stretches from ten-thousands to hundredths. The words give an amount for every place, including several places containing zero.",
            link: "A place-value chart in order is: ten-thousands, thousands, hundreds, tens, ones, decimal point, tenths, hundredths.",
            explain: "Fill the chart from left to right. The decimal point must stay between the ones and tenths places, and each empty whole-number place needs a zero placeholder.",
            steps: [
              "Put 5 in the ten-thousands place and 0 in the thousands place: 50,000 so far.",
              "Put 3 in the hundreds place, then 0 in both the tens and ones places: 50,300.",
              "Write the decimal point after the ones place.",
              "Put 2 in the tenths place and 9 in the hundredths place: .29.",
              "Join the whole-number and decimal parts to make 50,300.29."
            ],
            answer: "50,300.29",
            conclusion: "The number is 50,300.29",
            check: "Read it back by place: 5 ten-thousands, 0 thousands, 3 hundreds, 0 tens, 0 ones, 2 tenths and 9 hundredths. Every condition appears exactly once.",
            review: "The number is 50,300.29. Reading every column back gives exactly the amounts in the question, including the zero placeholders.",
            structureId: "placeValue_route_1_countIntegers",
            difficulty: 4
          })
        ]
      },
      {
        h: "2. Decimals continue the place-value pattern",
        body: [
          "The decimal point marks the boundary between whole ones and parts smaller than one. It does not start a new number system. The same ten-times pattern continues on both sides of it.",
          "The first place to the right of the decimal point is tenths. Ten tenths make one whole. The next place is hundredths because ten hundredths make one tenth and one hundred hundredths make one whole. The next place is thousandths.",
          "Think of one pound. One tenth of a pound is 10p, one hundredth is 1p and one thousandth would be one tenth of a penny. The pieces become ten times smaller each time we move one place to the right.",
          "When comparing decimals, line up the decimal points so that places of equal size sit underneath each other. You may add zeroes to the right-hand end without changing the value: 0.7 = 0.70 because seven tenths and seventy hundredths are the same amount.",
          "Compare from left to right, beginning with the largest place. The first place where the digits differ decides which number is greater. Do not count decimal digits and assume that the number with more digits is greater. For example, 0.65 has more written digits than 0.7, but 0.7 is greater.",
          "A number halfway between two decimals is the same distance from each endpoint. You can find it by calculating the gap, halving that gap and adding the half-gap to the smaller number. You can check by subtracting the midpoint from both endpoints."
        ],
        note: "Extra zeroes at the far right of a decimal do not change its value: 2.9 = 2.90 = 2.900.",
        misconception: "The length of a decimal does not decide its size. Compare matching places from left to right.",
        examples: [
          simple({
            q: "Which is greater: 0.7 or 0.65?",
            state: "We need to compare tenths with tenths before looking at any smaller place.",
            steps: [
              "Write 0.7 as 0.70 so the places line up.",
              "Compare the tenths digits: 0.70 has 7 tenths, while 0.65 has 6 tenths.",
              "Seven tenths is greater than six tenths, so there is no need to compare hundredths."
            ],
            answer: "0.7",
            conclusion: "0.7 is greater than 0.65",
            check: "Use hundredths: 0.70 is 70 hundredths and 0.65 is 65 hundredths. Since 70 > 65, the comparison is correct.",
            structureId: "placeValue_route_2_cryptarith",
            difficulty: 1
          }),
          swc({
            q: "Put 2.09, 2.9 and 2.19 in increasing order.",
            state: "Increasing order means smallest to greatest. All three numbers have 2 ones, so the decimal places will decide their order.",
            steps: [
              "Write each number to two decimal places: 2.09, 2.90 and 2.19.",
              "The ones digits all match, so compare tenths: 0 tenths, 9 tenths and 1 tenth.",
              "Zero tenths is smallest, then one tenth, then nine tenths.",
              "Match those tenths back to their numbers: 2.09, 2.19, 2.90."
            ],
            answer: "2.09, 2.19, 2.9",
            conclusion: "In increasing order the numbers are 2.09, 2.19 and 2.9",
            check: "The gaps are positive: 2.19 − 2.09 = 0.10 and 2.90 − 2.19 = 0.71. Each number is greater than the one before it.",
            structureId: "placeValue_route_2_cryptarith",
            difficulty: 2
          }),
          swc({
            q: "What number is halfway between 3.4 and 3.5?",
            state: "The halfway number must be equally far from 3.4 and 3.5.",
            steps: [
              "Write the endpoints as 3.40 and 3.50.",
              "Find the full gap: 3.50 − 3.40 = 0.10.",
              "Half of the gap is 0.10 ÷ 2 = 0.05.",
              "Add the half-gap to the lower endpoint: 3.40 + 0.05 = 3.45."
            ],
            answer: "3.45",
            conclusion: "The number halfway between 3.4 and 3.5 is 3.45",
            check: "3.45 − 3.40 = 0.05 and 3.50 − 3.45 = 0.05. The two distances match.",
            structureId: "placeValue_route_2_cryptarith",
            difficulty: 3
          }),
          clear({
            q: "A timer reads 12.305 seconds. What value does the digit 5 represent, and how many times as large is the value of the digit 3?",
            state: "We must find the actual values of two decimal digits, then divide the larger value by the smaller one.",
            comprehend: "In 12.305, the 3 and the 5 are on different sides of the zero in the decimal part. Their face values alone do not tell us their amounts.",
            link: "After the decimal point, the places are tenths, hundredths and thousandths. The 3 is in tenths and the 5 is in thousandths.",
            explain: "Write each digit's value as a decimal. Then use division to answer the phrase 'how many times as large'.",
            steps: [
              "The digit 5 is in the thousandths place, so it represents 5 thousandths = 0.005 seconds.",
              "The digit 3 is in the tenths place, so it represents 3 tenths = 0.3 seconds.",
              "Compare the values: 0.3 ÷ 0.005.",
              "Multiply both numbers by 1,000 to remove the decimals: 300 ÷ 5 = 60."
            ],
            answer: "The 5 represents 0.005 seconds, and the 3 has a value 60 times as large",
            conclusion: "The 5 represents 0.005 seconds and the value of the 3 is 60 times as large",
            check: "Multiply the smaller value by the factor: 0.005 × 60 = 0.300 = 0.3 seconds.",
            review: "The 5 represents 0.005 seconds. Since 0.005 × 60 = 0.3, the value of the 3 is 60 times as large.",
            structureId: "placeValue_route_2_cryptarith",
            difficulty: 4
          })
        ]
      },
      {
        h: "3. Negative numbers are positions below zero",
        body: [
          "A number line continues through zero. Positive numbers lie to the right of zero and negative numbers lie to the left. The minus sign in −4 tells us that the number is four units to the left of zero.",
          "Numbers become greater as we move right. This rule never changes. Therefore −3 is greater than −8 because −3 lies farther right, even though the digit 8 is larger than the digit 3.",
          "Temperature gives the idea a familiar meaning. A temperature of −6°C is six degrees below zero. If it rises to 3°C, it travels 6 degrees to reach zero and another 3 degrees to reach 3°C. The total rise is 9°C.",
          "When ordering several signed numbers, imagine or sketch their positions. Put the farthest-left value first for least-to-greatest order. Zero belongs between all negative numbers and all positive numbers.",
          "A change and a final position are different ideas. If a lift travels from floor 4 to floor −3, its final position is −3 but the distance travelled is 7 floors. Always read what the question asks before deciding whether the answer needs a sign.",
          "For a journey that crosses zero, split it into two parts. Find the distance from the starting point to zero, then the distance from zero to the ending point. Add the distances because both parts of the journey were travelled."
        ],
        note: "Farther right means greater. Closer to zero is greater only when both numbers are negative.",
        misconception: "The minus sign is part of the number. It does not mean that −8 is greater than −3 because 8 is greater than 3.",
        examples: [
          simple({
            q: "Which is greater: −3 or −8?",
            state: "We compare the positions of −3 and −8 on a number line.",
            steps: [
              "Both numbers lie to the left of zero.",
              "−3 is three units left of zero, while −8 is eight units left of zero.",
              "−3 lies farther right, so it is greater."
            ],
            answer: "−3",
            conclusion: "−3 is greater than −8",
            check: "Starting at −8, move 5 steps right to reach −3. Moving right increases a number, so −3 must be greater.",
            structureId: "placeValue_route_3_digitDetective",
            difficulty: 1
          }),
          swc({
            q: "Order −4, 2, −1 and 0 from least to greatest.",
            state: "Least to greatest means travelling from left to right along the number line.",
            steps: [
              "The farthest-left value is −4.",
              "Next comes −1 because it is still negative but is closer to zero.",
              "Zero comes after the negative numbers.",
              "The positive number 2 lies farthest right."
            ],
            answer: "−4, −1, 0, 2",
            conclusion: "The order is −4, −1, 0, 2",
            check: "Each step increases the value: −4 < −1 < 0 < 2.",
            structureId: "placeValue_route_3_digitDetective",
            difficulty: 2
          }),
          swc({
            q: "The temperature rises from −6°C to 3°C. By how many degrees does it rise?",
            state: "The question asks for the size of the rise, so the answer is a positive distance along the temperature scale.",
            steps: [
              "From −6°C to 0°C is a rise of 6°C.",
              "From 0°C to 3°C is a further rise of 3°C.",
              "Add the two parts: 6°C + 3°C = 9°C."
            ],
            answer: "9°C",
            conclusion: "The temperature rises by 9°C",
            check: "Add the rise to the starting temperature: −6°C + 9°C = 3°C, which matches the final temperature.",
            structureId: "placeValue_route_3_digitDetective",
            difficulty: 3
          }),
          clear({
            q: "A research submarine starts 18 metres below sea level. It rises 7 metres, then descends 12 metres. What is its final position, and how far below sea level is it?",
            state: "Below sea level is negative. We need both the signed final position and its positive distance below zero.",
            comprehend: "The submarine starts at −18 m. Rising moves right on a number line, while descending moves left.",
            link: "A rise of 7 adds 7 to the position. A descent of 12 subtracts 12 from the new position.",
            explain: "Follow the movements in order to find the signed position. Then describe the distance from sea level without a negative sign.",
            steps: [
              "Start at −18 m.",
              "Rise 7 m: −18 + 7 = −11 m.",
              "Descend 12 m: −11 − 12 = −23 m.",
              "The position −23 m means a distance of 23 m below sea level."
            ],
            answer: "−23 m, which is 23 m below sea level",
            conclusion: "The final position is −23 m and the submarine is 23 m below sea level",
            check: "Measure the net movement: rising 7 m and descending 12 m gives a net descent of 5 m. Five metres below −18 m is −23 m.",
            review: "The final position is −23 m. The net movement was 5 m downward, and −18 − 5 = −23. Its distance below sea level is 23 m.",
            structureId: "placeValue_route_3_digitDetective",
            difficulty: 4
          })
        ]
      },
      {
        h: "4. Rounding uses place value, not guesswork",
        body: [
          "Rounding replaces a number with a nearby multiple of a chosen place. Rounding 6,483 to the nearest hundred means choosing whether it is closer to 6,400 or 6,500.",
          "First find the place named in the question. This is the last place that will remain in the rounded answer. Then inspect the digit immediately to its right because that digit tells us which nearby multiple is closer.",
          "If the next digit is 0, 1, 2, 3 or 4, keep the rounding digit unchanged. If the next digit is 5, 6, 7, 8 or 9, increase the rounding digit by one. Replace later whole-number digits with zeroes, or remove later decimal digits.",
          "This rule comes from distance, not magic. A number ending halfway between two choices is sent to the higher choice. For example, 6,450 is halfway between 6,400 and 6,500, so it rounds to 6,500 to the nearest hundred.",
          "We can also reverse a rounding statement. If a whole-number crowd rounds to 52,000 to the nearest thousand, the possible values begin at 51,500 and stop just before 52,500. The lower halfway point is included because it rounds up to 52,000. The upper halfway point is excluded because it rounds up to 53,000.",
          "For decimal bounds, use half of the rounding unit. Rounding to the nearest tenth uses steps of 0.1, so half a step is 0.05. A value written as 3.2 to the nearest tenth therefore represents actual values from 3.15 up to, but not including, 3.25."
        ],
        note: "Name the rounding place first, then look exactly one place to its right.",
        misconception: "The boundary above a rounded value is excluded because the halfway value rounds to the next result.",
        examples: [
          simple({
            q: "Round 6,483 to the nearest hundred.",
            state: "The hundreds digit will remain. The tens digit decides whether that hundreds digit stays the same or increases.",
            steps: [
              "The hundreds digit is 4, representing 400.",
              "The next digit, in the tens place, is 8.",
              "Since 8 is at least 5, increase the hundreds digit from 4 to 5.",
              "Replace the tens and ones digits with zeroes."
            ],
            answer: "6,500",
            conclusion: "6,483 rounds to 6,500 to the nearest hundred",
            check: "6,483 is 17 away from 6,500 but 83 away from 6,400, so 6,500 is the nearer hundred.",
            structureId: "placeValue_route_5_estimation",
            difficulty: 1
          }),
          swc({
            q: "Round 18.746 to one decimal place.",
            state: "One decimal place means the tenths digit is the last digit we keep. The hundredths digit decides the rounding.",
            steps: [
              "The tenths digit is 7.",
              "The digit immediately to its right, in the hundredths place, is 4.",
              "Since 4 is below 5, keep the tenths digit as 7.",
              "Remove the hundredths and thousandths digits."
            ],
            answer: "18.7",
            conclusion: "18.746 rounds to 18.7 to one decimal place",
            check: "The midpoint between 18.7 and 18.8 is 18.75. Since 18.746 is below 18.75, it is closer to 18.7.",
            structureId: "placeValue_route_5_estimation",
            difficulty: 2
          }),
          swc({
            q: "A crowd is reported as 52,000 to the nearest thousand. What is the smallest possible whole-number crowd?",
            state: "We need the lower boundary of all whole numbers that round to 52,000 to the nearest thousand.",
            steps: [
              "The neighbouring thousands are 51,000 and 52,000.",
              "The halfway point between them is 51,500.",
              "Under the usual rounding rule, the halfway value rounds up to 52,000.",
              "Any smaller whole number is at most 51,499 and rounds to 51,000."
            ],
            answer: "51,500",
            conclusion: "The smallest possible crowd is 51,500 people",
            check: "51,500 rounds to 52,000, while the previous whole number, 51,499, rounds to 51,000. This proves the boundary is exact.",
            structureId: "placeValue_route_5_estimation",
            difficulty: 3
          }),
          clear({
            q: "A length is given as 3.2 m correct to the nearest tenth of a metre. State the interval of possible actual lengths.",
            state: "We need the lower and upper boundaries of all measurements that round to 3.2 m to the nearest 0.1 m.",
            comprehend: "The rounded unit is one tenth, or 0.1 m. Actual values may lie up to half of that step on either side of 3.2 m.",
            link: "Half of 0.1 m is 0.05 m. Subtracting and adding 0.05 gives the two halfway boundaries.",
            explain: "The lower boundary is included because 3.15 rounds up to 3.2. The upper boundary is excluded because 3.25 rounds up to 3.3.",
            steps: [
              "Lower boundary: 3.2 − 0.05 = 3.15 m.",
              "Upper boundary: 3.2 + 0.05 = 3.25 m.",
              "Write the included lower boundary with ≤ and the excluded upper boundary with <."
            ],
            answer: "3.15 m ≤ length < 3.25 m",
            conclusion: "The possible interval is 3.15 m ≤ length < 3.25 m",
            check: "A value just inside each end, such as 3.151 or 3.249, rounds to 3.2. The excluded value 3.25 rounds to 3.3.",
            review: "The interval is 3.15 m ≤ length < 3.25 m. Its width is 0.10 m, exactly one rounding step, and the upper halfway point is correctly excluded.",
            structureId: "placeValue_route_5_estimation",
            difficulty: 4
          })
        ]
      }
    ]
  },
  numberProperties: {
    intro: "Whole numbers have patterns hidden inside them. Factors tell us how a number can be built by multiplication. Multiples tell us what appears when we keep multiplying by the same number. Powers shorten repeated multiplication, while remainders reveal cycles that would otherwise take far too long to follow. We will build each idea from small examples before using it as a shortcut.",
    recap: [
      "Factors divide exactly and occur in multiplication pairs. A factor search can stop near the square root because later pairs repeat in reverse.",
      "A prime number has exactly two positive factors: 1 and itself. Prime factorisation breaks a number into prime building blocks.",
      "The greatest common factor uses the prime factors shared by both numbers. The lowest common multiple uses every prime factor needed by either number.",
      "A power records repeated multiplication. Index rules work by joining or cancelling factors with the same base.",
      "A remainder is smaller than the divisor. Remainders locate distant steps in repeating cycles."
    ],
    mistakes: [
      "Stopping a factor search without using factor pairs to show that the list is complete.",
      "Calling 1 prime even though it has only one positive factor.",
      "Confusing factors with multiples, or using the greatest common factor when a repeating-event question needs the lowest common multiple.",
      "Reading 5³ as 5 × 3 instead of 5 × 5 × 5.",
      "Treating a remainder of zero as position zero in a cycle instead of the final position of a complete cycle."
    ],
    sections: [
      {
        h: "1. Factors build a number exactly",
        body: [
          "The number 12 can be made by multiplying 3 by 4. Because 3 × 4 = 12, both 3 and 4 divide exactly into 12. This makes 3 and 4 factors of 12. They form a factor pair.",
          "The other factor pairs of 12 are 1 and 12, then 2 and 6. Reading both numbers from each pair gives every positive factor of 12: 1, 2, 3, 4, 6 and 12. A factor must divide exactly. For example, 5 is not a factor of 12 because 12 ÷ 5 leaves a remainder.",
          "Factor pairs give us a safe search method. Start with 1 and test whole numbers in order: does 2 divide exactly, does 3 divide exactly, does 4 divide exactly and so on? Whenever a number works, write it beside its paired factor.",
          "We do not need to test forever. For 12, the square of 3 is 9 and the square of 4 is 16, so the square root of 12 lies between 3 and 4. After testing 3, every larger factor has already appeared as the partner of a smaller factor. Testing 4 would only lead back to the pair 3 and 4 in reverse.",
          "The same idea works for 45. The square of 6 is 36 and the square of 7 is 49, so the square root of 45 lies between 6 and 7. We only need to test possible divisors up to 6. The factor pairs are 1 × 45, 3 × 15 and 5 × 9, giving factors 1, 3, 5, 9, 15 and 45.",
          "A prime number is a special whole number greater than 1 whose only positive factors are 1 and itself. The number 3 is prime because its only factor pair is 1 × 3. The number 12 is not prime because it has other factor pairs. The number 1 is not prime because it has only one positive factor, not two.",
          "Prime factorisation breaks a whole number into prime building blocks. For example, 12 = 2 × 6 = 2 × 2 × 3. Since 2 and 3 are prime, the prime factorisation is complete. We can write the repeated 2 more compactly as 2², so 12 = 2² × 3.",
          "Prime factors can also reveal the greatest common factor of two numbers. A common factor must be built only from prime factors present in both numbers. To make it as large as possible, use every shared prime as many times as both numbers allow."
        ],
        note: "Search for factor pairs from 1 upwards. Once the smaller number in a pair would pass the square root, the remaining pairs have already been found in reverse.",
        misconception: "One is not prime. A prime number needs exactly two positive factors: 1 and itself.",
        examples: [
          swc({
            q: "List every positive factor of 24.",
            state: "We need every whole number that divides 24 exactly. A complete list must include both numbers in each factor pair without repeating any number.",
            steps: [
              "Start with 1: 1 × 24 = 24, so 1 and 24 are factors.",
              "Test 2: 2 × 12 = 24, so 2 and 12 are factors.",
              "Test 3: 3 × 8 = 24, so 3 and 8 are factors.",
              "Test 4: 4 × 6 = 24, so 4 and 6 are factors.",
              "The square root of 24 lies between 4 and 5 because 4² = 16 and 5² = 25. We can stop after 4 because later pairs would repeat these in reverse.",
              "Write the factors in order: 1, 2, 3, 4, 6, 8, 12, 24."
            ],
            answer: "1, 2, 3, 4, 6, 8, 12 and 24",
            conclusion: "The positive factors of 24 are 1, 2, 3, 4, 6, 8, 12 and 24",
            check: "Multiply each pair: 1 × 24, 2 × 12, 3 × 8 and 4 × 6 all make 24. The next trial, 5, does not divide exactly and 6 has already appeared as a partner, so the list is complete.",
            structureId: "numberProperties_route_1_countIntegers",
            difficulty: 1
          }),
          swc({
            q: "Is 37 a prime number? Explain how you know that no factor has been missed.",
            state: "To prove that 37 is prime, we must show that no whole number other than 1 and 37 divides it exactly.",
            steps: [
              "The square of 6 is 36 and the square of 7 is 49, so the square root of 37 lies just above 6.",
              "Any factor pair for 37 would therefore have a smaller member no greater than 6.",
              "We only need to test the prime numbers up to 6. A non-prime trial such as 4 is unnecessary because any number divisible by 4 would already have been caught when we tested its smaller prime factor, 2.",
              "37 is not divisible by 2 because it is odd.",
              "Its digit sum is 3 + 7 = 10, so it is not divisible by 3.",
              "It does not end in 0 or 5, so it is not divisible by 5."
            ],
            answer: "Yes, 37 is prime",
            conclusion: "37 is prime because its only positive factors are 1 and 37",
            check: "The only prime divisors that could be the smaller member of a factor pair are 2, 3 and 5. None divides 37, so no other factor pair is possible.",
            structureId: "numberProperties_route_1_countIntegers",
            difficulty: 2
          }),
          swc({
            q: "Write 84 as a product of prime factors, using index notation where a factor repeats.",
            state: "We must split 84 until every factor is prime, then collect repeated prime factors.",
            steps: [
              "84 is even, so divide by 2: 84 = 2 × 42.",
              "42 is also even: 42 = 2 × 21. Therefore 84 = 2 × 2 × 21.",
              "Split 21 into 3 × 7. Both 3 and 7 are prime.",
              "The complete product is 2 × 2 × 3 × 7.",
              "Two factors of 2 can be written as 2², giving 2² × 3 × 7."
            ],
            answer: "2² × 3 × 7",
            conclusion: "The prime factorisation of 84 is 2² × 3 × 7",
            check: "Multiply the prime factors back: 2² × 3 × 7 = 4 × 3 × 7 = 12 × 7 = 84.",
            structureId: "numberProperties_route_1_countIntegers",
            difficulty: 3
          }),
          clear({
            q: "Find the greatest common factor of 72 and 90 using prime factorisation.",
            state: "We need the largest whole number that divides both 72 and 90 exactly.",
            comprehend: "A common factor can use only prime factors available in both numbers. The greatest common factor uses the full shared collection.",
            link: "Prime factorise both numbers, then compare how many copies of each prime appear in both lists.",
            explain: "For each shared prime, take the smaller power. A larger power would require a prime factor that one of the numbers does not contain.",
            steps: [
              "Prime factorise 72: 72 = 8 × 9 = 2³ × 3².",
              "Prime factorise 90: 90 = 9 × 10 = 2 × 3² × 5.",
              "Both numbers contain one factor of 2, so include 2¹.",
              "Both contain two factors of 3, so include 3².",
              "The factor 5 appears only in 90, so it cannot be part of a common factor.",
              "Multiply the shared factors: 2 × 3² = 2 × 9 = 18."
            ],
            answer: "18",
            conclusion: "The greatest common factor of 72 and 90 is 18",
            check: "72 ÷ 18 = 4 and 90 ÷ 18 = 5, so 18 divides both exactly. The remaining quotients 4 and 5 share no factor greater than 1, so the common factor cannot be enlarged.",
            review: "The greatest common factor is 18. It divides both numbers exactly, and the leftover quotients 4 and 5 share no factor greater than 1. This proves that no larger common factor was omitted.",
            structureId: "numberProperties_route_1_countIntegers",
            difficulty: 4
          })
        ]
      },
      {
        h: "2. Multiples, common multiples and divisibility",
        body: [
          "Multiples are the numbers made by multiplying a starting number by whole numbers. The positive multiples of 4 begin 4, 8, 12, 16 and 20 because they are 4 × 1, 4 × 2, 4 × 3, 4 × 4 and 4 × 5.",
          "A common multiple belongs to two multiplication sequences. The number 12 is a common multiple of 4 and 6 because 12 = 4 × 3 and 12 = 6 × 2. The lowest common multiple, often shortened to LCM, is the smallest positive number that appears in both sequences.",
          "Common multiples model repeating events. If one light flashes every 4 seconds and another every 6 seconds, they flash together after 12 seconds because 12 is the first positive time in both lists. They meet again at later common multiples such as 24 and 36 seconds.",
          "A divisibility test tells us whether a number divides exactly without completing the whole division. A number is divisible by 2 when its final digit is even. It is divisible by 5 when its final digit is 0 or 5. It is divisible by 10 when its final digit is 0.",
          "For 3 and 9, add the digits. The place-value reason is that 10, 100, 1,000 and every other power of ten leave remainder 1 when divided by 3 or 9. This means each digit contributes the same remainder as its face value. Therefore the original number and its digit sum have the same divisibility by 3 and by 9.",
          "For larger numbers, prime factorisation can find an LCM without writing a long list. Include every prime needed by either number, using the greatest power that appears. The result must contain enough prime factors for both original numbers to divide into it."
        ],
        note: "A factor divides into a number. A multiple is produced from a number. For 4 and 20, 4 is a factor of 20 and 20 is a multiple of 4.",
        misconception: "A common multiple must be divisible by every number being compared, not merely by one of them.",
        examples: [
          simple({
            q: "Find the first three positive common multiples of 4 and 6.",
            state: "We need the first three positive numbers that appear in both the multiples of 4 and the multiples of 6.",
            steps: [
              "List multiples of 4: 4, 8, 12, 16, 20, 24, 28, 32, 36.",
              "List multiples of 6: 6, 12, 18, 24, 30, 36.",
              "The first three shared values are 12, 24 and 36."
            ],
            answer: "12, 24 and 36",
            conclusion: "The first three positive common multiples are 12, 24 and 36",
            check: "Divide each by both numbers: 12 ÷ 4 = 3 and 12 ÷ 6 = 2; 24 ÷ 4 = 6 and 24 ÷ 6 = 4; 36 ÷ 4 = 9 and 36 ÷ 6 = 6.",
            structureId: "numberProperties_route_2_modular",
            difficulty: 1
          }),
          swc({
            q: "Is 7,452 divisible by 3 and by 9?",
            state: "The digit-sum test can decide divisibility by both 3 and 9.",
            steps: [
              "Add the digits: 7 + 4 + 5 + 2 = 18.",
              "18 ÷ 3 = 6, so 18 is divisible by 3.",
              "18 ÷ 9 = 2, so 18 is also divisible by 9.",
              "The original number therefore divides exactly by both 3 and 9."
            ],
            answer: "Yes, it is divisible by both 3 and 9",
            conclusion: "7,452 is divisible by both 3 and 9",
            check: "Complete the divisions: 7,452 ÷ 3 = 2,484 and 7,452 ÷ 9 = 828. Both quotients are whole numbers.",
            structureId: "numberProperties_route_2_modular",
            difficulty: 2
          }),
          swc({
            q: "Find the lowest common multiple of 18 and 24 using prime factorisation.",
            state: "The LCM must contain enough prime factors to be divisible by both 18 and 24, while remaining as small as possible.",
            steps: [
              "Prime factorise: 18 = 2 × 3² and 24 = 2³ × 3.",
              "The greatest power of 2 required is 2³, from 24.",
              "The greatest power of 3 required is 3², from 18.",
              "Combine them: LCM = 2³ × 3² = 8 × 9 = 72."
            ],
            answer: "72",
            conclusion: "The lowest common multiple of 18 and 24 is 72",
            check: "72 ÷ 18 = 4 and 72 ÷ 24 = 3, so 72 is common. Removing a factor of 2 gives 36, which is not divisible by 24, and removing a factor of 3 gives 24, which is not divisible by 18.",
            structureId: "numberProperties_route_2_modular",
            difficulty: 3
          }),
          clear({
            q: "Two warning lights flash together now. One flashes every 14 seconds and the other every 20 seconds. After how many seconds will they next flash together?",
            state: "We need the first positive time that is a whole number of both 14-second intervals and 20-second intervals.",
            comprehend: "Each light repeats on its own schedule. A meeting time must be a common multiple of 14 and 20, and 'next' means the lowest positive one.",
            link: "Prime factorisation shows which factors the meeting time must contain: 14 = 2 × 7 and 20 = 2² × 5.",
            explain: "Build the LCM using the greatest required power of every prime, then interpret that number as seconds after now.",
            steps: [
              "For the factor 2, use 2² because 20 needs two factors of 2.",
              "Include 5 because it is needed by 20.",
              "Include 7 because it is needed by 14.",
              "LCM = 2² × 5 × 7 = 4 × 35 = 140."
            ],
            answer: "140 seconds",
            conclusion: "The lights will next flash together after 140 seconds",
            check: "140 ÷ 14 = 10 flashes and 140 ÷ 20 = 7 flashes. Both are whole counts. The factor construction used no unnecessary prime, so this is the first positive meeting time.",
            review: "The next shared flash is after 140 seconds. At that time the first light has completed 10 intervals and the second has completed 7 intervals.",
            structureId: "numberProperties_route_2_modular",
            difficulty: 4
          })
        ]
      },
      {
        h: "3. Powers are repeated multiplication",
        body: [
          "Writing 5 × 5 × 5 × 5 takes space, so mathematicians shorten it to 5⁴. The large 5 is the base. It tells us which number is repeated. The small raised 4 is the exponent, also called the index. It tells us how many factors of 5 there are.",
          "The expression 5⁴ does not mean 5 × 4. It means 5 × 5 × 5 × 5. Work out powers by writing the repeated factors when you are unsure. For example, 3⁴ = 3 × 3 × 3 × 3 = 81.",
          "When powers with the same base are multiplied, their factors join into one longer string. For example, 2³ × 2⁵ contains three factors of 2 followed by five more factors of 2. There are eight factors altogether, so 2³ × 2⁵ = 2⁸.",
          "The bases must match before indices can be combined. The expression 2³ × 3⁵ cannot become 6⁸ because the repeated factors are different. Index rules describe what happens to repeated copies of the same base.",
          "Division cancels matching factors. In x⁹ ÷ x⁴, four factors of x in the denominator cancel with four of the nine factors in the numerator. Five factors remain, so x⁹ ÷ x⁴ = x⁵, provided x is not zero.",
          "A zero exponent may look surprising, but it follows from the same division pattern. Any non-zero number divided by itself equals 1. At the same time, a³ ÷ a³ = a³⁻³ = a⁰. Therefore a⁰ = 1 for any non-zero value of a."
        ],
        note: "The exponent counts factors. In 4³, the base 4 appears three times: 4 × 4 × 4.",
        misconception: "Index rules combine powers only when the base is the same.",
        examples: [
          simple({
            q: "Evaluate 3⁴.",
            state: "The exponent 4 tells us to multiply four factors of 3.",
            steps: [
              "Expand the power: 3⁴ = 3 × 3 × 3 × 3.",
              "Pair the factors: 3 × 3 = 9 and 3 × 3 = 9.",
              "Multiply the two results: 9 × 9 = 81."
            ],
            answer: "81",
            conclusion: "3⁴ = 81",
            check: "Calculate in a different grouping: 3 × 3 × 3 = 27, then 27 × 3 = 81.",
            structureId: "numberProperties_route_4_repeatOp",
            difficulty: 1
          }),
          swc({
            q: "Simplify 2³ × 2⁵ as a single power.",
            state: "Both powers have base 2, so their repeated factors can be joined.",
            steps: [
              "2³ contains three factors of 2: 2 × 2 × 2.",
              "2⁵ contains five factors of 2: 2 × 2 × 2 × 2 × 2.",
              "Together there are 3 + 5 = 8 factors of 2.",
              "Eight factors of 2 are written as 2⁸."
            ],
            answer: "2⁸",
            conclusion: "2³ × 2⁵ simplifies to 2⁸",
            check: "Evaluate both forms: 2³ × 2⁵ = 8 × 32 = 256, while 2⁸ = 256.",
            structureId: "numberProperties_route_4_repeatOp",
            difficulty: 2
          }),
          swc({
            q: "Simplify x⁹ ÷ x⁴ as a single power, assuming x is not zero.",
            state: "The numerator has nine factors of x and the denominator has four. Division cancels four matching pairs.",
            steps: [
              "Write x⁹ as nine factors of x and x⁴ as four factors of x.",
              "Cancel one denominator factor with one numerator factor four times.",
              "Nine factors minus four cancelled factors leaves five factors of x.",
              "Five factors of x are written as x⁵."
            ],
            answer: "x⁵",
            conclusion: "x⁹ ÷ x⁴ simplifies to x⁵",
            check: "Try x = 2: 2⁹ ÷ 2⁴ = 512 ÷ 16 = 32, and 2⁵ = 32.",
            structureId: "numberProperties_route_4_repeatOp",
            difficulty: 3
          }),
          clear({
            q: "Explain why 7⁰ = 1 without treating it as a rule to memorise.",
            state: "We need to connect the zero exponent to a calculation whose value we already know.",
            comprehend: "The expression 7⁰ has zero repeated factors, so its value is not obvious from expansion alone. Division of equal powers supplies the missing meaning.",
            link: "The calculation 7³ ÷ 7³ equals 1 because any non-zero number divided by itself is 1.",
            explain: "Use the division rule for equal bases on the same calculation. The exponents subtract, producing an exponent of zero.",
            steps: [
              "Start with 7³ ÷ 7³.",
              "As ordinary numbers, this is 343 ÷ 343 = 1.",
              "Using indices, 7³ ÷ 7³ = 7³⁻³ = 7⁰.",
              "The same calculation is both 1 and 7⁰, so 7⁰ = 1."
            ],
            answer: "7⁰ = 1 because 7³ ÷ 7³ is both 1 and 7³⁻³",
            conclusion: "7⁰ equals 1",
            check: "The argument uses 7 as a non-zero base, so the self-division 343 ÷ 343 is valid. Both ways of evaluating it give 1.",
            review: "Since 7³ ÷ 7³ = 1 and the index rule rewrites the same expression as 7⁰, it follows that 7⁰ = 1.",
            structureId: "numberProperties_route_4_repeatOp",
            difficulty: 4
          })
        ]
      },
      {
        h: "4. Remainders reveal cycles",
        body: [
          "When a division is not exact, the remainder is the amount left after making as many complete groups as possible. The number of complete groups is called the quotient. Dividing 53 by 7 gives quotient 7 because 7 × 7 = 49, with remainder 4. We can record this as 53 = 7 × 7 + 4.",
          "The remainder must be at least zero and smaller than the divisor. If a supposed remainder were 8 after division by 7, another complete group of 7 would still fit, so the division would not be finished.",
          "Remainders are useful whenever a pattern repeats after a fixed number of steps. A 12-hour clock repeats every 12 hours. Moving forward 50 hours has the same effect on the clock face as moving forward only the remainder when 50 is divided by 12.",
          "Since 50 = 12 × 4 + 2, four complete turns of the clock return to the starting hour and only 2 extra hours affect the final display. From 9 o'clock, two more hours gives 11 o'clock.",
          "Final digits of powers also repeat. The powers of 3 end in 3, 9, 7, 1 and then begin the same four-digit cycle again. We do not need to calculate a huge power such as 3²⁰. We need only decide where exponent 20 lands in a cycle of length 4.",
          "Always write one complete cycle and label its positions 1, 2, 3 and so on. Divide the distant step number by the cycle length. A remainder of 1 means use position 1. A remainder of 2 means position 2. A remainder of zero means the final position in the cycle, not a mysterious position zero."
        ],
        note: "A remainder of zero means an exact number of cycles, so use the last position in the cycle.",
        misconception: "A remainder is never equal to or greater than the divisor.",
        examples: [
          simple({
            q: "Write 53 in the form 7 × q + r, where r is the remainder.",
            state: "We need the number of complete groups of 7 and the amount left over.",
            steps: [
              "The greatest multiple of 7 not above 53 is 49 because 7 × 7 = 49.",
              "Subtract to find the leftover: 53 − 49 = 4.",
              "The quotient is 7 and the remainder is 4."
            ],
            answer: "53 = 7 × 7 + 4",
            conclusion: "53 = 7 × 7 + 4, so q = 7 and r = 4",
            check: "Rebuild 53: 7 × 7 + 4 = 49 + 4 = 53. The remainder 4 is smaller than the divisor 7.",
            structureId: "numberProperties_route_3_digitDetective",
            difficulty: 1
          }),
          swc({
            q: "What is the remainder when 148 is divided by 5?",
            state: "We need the amount left after removing the largest multiple of 5 that does not exceed 148.",
            steps: [
              "Numbers divisible by 5 end in 0 or 5.",
              "The nearest multiple of 5 below 148 is 145.",
              "Subtract: 148 − 145 = 3."
            ],
            answer: "3",
            conclusion: "The remainder when 148 is divided by 5 is 3",
            check: "148 = 5 × 29 + 3 because 5 × 29 = 145. The remainder 3 is smaller than 5.",
            structureId: "numberProperties_route_3_digitDetective",
            difficulty: 2
          }),
          swc({
            q: "What hour will it be 50 hours after 9 o'clock on a 12-hour clock?",
            state: "Whole groups of 12 hours return the clock to 9, so only the leftover hours affect the final display.",
            steps: [
              "Divide 50 by 12: 50 = 12 × 4 + 2.",
              "The four complete 12-hour cycles return to 9 o'clock.",
              "Move forward the remaining 2 hours: 9, 10, 11."
            ],
            answer: "11 o'clock",
            conclusion: "It will be 11 o'clock",
            check: "Four full turns use 48 hours. The remaining 2 hours move 9 o'clock to 11 o'clock, and 48 + 2 = 50.",
            structureId: "numberProperties_route_3_digitDetective",
            difficulty: 3
          }),
          clear({
            q: "Find the final digit of 3²⁰ without calculating the whole power.",
            state: "We need the position of exponent 20 in the repeating cycle of final digits of powers of 3.",
            comprehend: "Only the final digit matters. Multiplying by 3 repeatedly creates a short cycle, so calculating the enormous full number would be wasted work.",
            link: "The first four powers end in 3, 9, 7 and 1. Multiplying the final 1 by 3 returns to 3, so the cycle length is 4.",
            explain: "Divide the exponent by the cycle length. A zero remainder means exponent 20 lands at the fourth position of a complete cycle.",
            steps: [
              "3¹ ends in 3.",
              "3² ends in 9, 3³ ends in 7 and 3⁴ ends in 1.",
              "The pattern then repeats: 3, 9, 7, 1.",
              "20 ÷ 4 = 5 remainder 0, so 20 completes exactly five cycles.",
              "The fourth and final position in each cycle is 1."
            ],
            answer: "1",
            conclusion: "The final digit of 3²⁰ is 1",
            check: "The nearby exponent 3¹⁶ also ends a complete cycle at 1. Multiplying by 3 four more times produces final digits 3, 9, 7, 1, confirming the final digit at exponent 20.",
            review: "The cycle has length 4 and 20 is a multiple of 4, so 3²⁰ lands on the cycle's fourth final digit, 1.",
            structureId: "numberProperties_route_3_digitDetective",
            difficulty: 4
          })
        ]
      }
    ]
  },
  integerDecimalArithmetic: {
    intro: "Arithmetic is not a collection of unrelated tricks. Place value explains how whole numbers and decimals behave. Inverse operations let us undo a chain of steps. An agreed order makes a written expression unambiguous, while estimates tell us whether an exact answer is sensible. This lesson joins those ideas and shows when each one is useful.",
    recap: [
      "Use brackets and the agreed order of operations. Multiplication and division share a rank, as do addition and subtraction, so work left to right within each pair.",
      "To work backwards, use inverse operations in the reverse of the forward order, then check by running the original steps forwards.",
      "Clock time exchanges 60 minutes for 1 hour and 24 hours for 1 day. Crossing midnight may change the day.",
      "An estimate is a quick nearby answer that supports a decision or checks the scale of exact arithmetic.",
      "A formula is a compact set of instructions. Reveal hidden multiplication, substitute each value and follow the order of operations."
    ],
    mistakes: [
      "Completing every multiplication before every division instead of respecting left-to-right order for equal-rank operations.",
      "Undoing a number-machine chain in its forward order rather than reversing the order.",
      "Treating 100 minutes as an hour or forgetting the day change when a time passes midnight.",
      "Presenting a rounded estimate as though it were an exact answer.",
      "Reading 2a as 2 + a, or reading m² as m × 2."
    ],
    sections: [
      {
        h: "1. Why an agreed order of operations matters",
        body: [
          "Consider the expression 2 + 3 × 4. If one person adds first, they get 5 × 4 = 20. If another person multiplies first, they get 2 + 12 = 14. The symbols are identical, but the answers differ because the operations were completed in different orders.",
          "Mathematics avoids this confusion by using an agreed order of operations. In the UK it is often remembered as BIDMAS: Brackets, Indices, Division and Multiplication, Addition and Subtraction.",
          "Brackets come first because they deliberately group part of an expression. Indices, such as the 2 in 5², come next. Multiplication and division come after that. Addition and subtraction come last.",
          "There is an important detail hidden inside the initials. Division does not always come before multiplication. They have equal rank, so complete them from left to right. Addition and subtraction also have equal rank and are completed from left to right.",
          "For 30 ÷ 5 × 3, work from the left: 30 ÷ 5 = 6, then 6 × 3 = 18. Grouping 5 × 3 first would silently insert brackets that were not written and would change the question.",
          "A useful working habit is to rewrite the whole expression after each operation. Replace only the part you have calculated and keep every untouched number and symbol in its original order. This makes accidental regrouping much easier to spot.",
          "Before calculating, estimate the likely size and sign. An estimate does not replace BIDMAS, but it can reveal a slip. If every starting number is positive and the expression should be around 20, an answer of −200 deserves another look."
        ],
        note: "Multiplication and division share a rank. Addition and subtraction share a rank. Within either pair, work from left to right.",
        misconception: "BIDMAS does not mean all division before all multiplication.",
        examples: [
          simple({
            q: "Work out 5 + 2 × 6, showing which operation is completed first and why.",
            state: "The expression contains addition and multiplication. Multiplication has the higher rank, so it must be completed first.",
            steps: [
              "Calculate the multiplication: 2 × 6 = 12.",
              "Rewrite the expression as 5 + 12.",
              "Add: 5 + 12 = 17."
            ],
            answer: "17",
            conclusion: "5 + 2 × 6 = 17 because multiplication is completed before addition",
            check: "Estimate 2 × 6 as 12, then add 5. An answer a little above 12 is sensible, and substituting the calculated product gives 5 + 12 = 17.",
            structureId: "integerDecimalArithmetic_route_1_multiExpr",
            difficulty: 1
          }),
          swc({
            q: "Work out 30 ÷ 5 × 3. Explain why the multiplication is not completed first.",
            state: "Division and multiplication have equal rank, so we read these operations from left to right unless brackets say otherwise.",
            steps: [
              "The first operation from the left is 30 ÷ 5.",
              "Calculate it: 30 ÷ 5 = 6.",
              "The expression is now 6 × 3.",
              "Calculate: 6 × 3 = 18."
            ],
            answer: "18",
            conclusion: "30 ÷ 5 × 3 = 18",
            check: "The expression means (30 ÷ 5) × 3. Reversing the first division gives 6 × 5 = 30, then multiplying 6 by 3 gives 18. Calculating 5 × 3 first would change the expression to 30 ÷ (5 × 3), which has brackets not present in the question.",
            structureId: "integerDecimalArithmetic_route_1_multiExpr",
            difficulty: 2
          }),
          swc({
            q: "Work out 48 ÷ 8 ÷ 2 from left to right. Then find the different answer produced by grouping the last two numbers first.",
            state: "We must evaluate the written expression correctly, then show how added brackets would create a different question.",
            steps: [
              "Correct left-to-right order: 48 ÷ 8 = 6.",
              "Continue with the result: 6 ÷ 2 = 3.",
              "If the last two numbers were grouped, the expression would be 48 ÷ (8 ÷ 2).",
              "The bracketed calculation gives 8 ÷ 2 = 4, then 48 ÷ 4 = 12."
            ],
            answer: "The correct answer is 3; the incorrectly regrouped answer is 12",
            conclusion: "48 ÷ 8 ÷ 2 = 3, while 48 ÷ (8 ÷ 2) = 12",
            check: "The two expressions are different: (48 ÷ 8) ÷ 2 = 6 ÷ 2 = 3, but 48 ÷ (8 ÷ 2) = 48 ÷ 4 = 12. The written expression has no brackets, so left-to-right order selects 3.",
            structureId: "integerDecimalArithmetic_route_1_multiExpr",
            difficulty: 3
          }),
          clear({
            q: "Evaluate 36 ÷ 4 × 3 − 18 ÷ 6 × 2, applying every operation in the correct order.",
            state: "The expression has two multiplication-and-division chains followed by one subtraction. Each chain must be completed from left to right before subtracting.",
            comprehend: "There are no brackets or indices. Division and multiplication therefore come before the final subtraction, but they keep their left-to-right order within each chain.",
            link: "Treat 36 ÷ 4 × 3 as one chain and 18 ÷ 6 × 2 as the other. Their results will be subtracted.",
            explain: "Evaluate each equal-rank chain from left to right. Rewrite the expression with those two results, then complete the subtraction.",
            steps: [
              "First chain: 36 ÷ 4 = 9, then 9 × 3 = 27.",
              "Second chain: 18 ÷ 6 = 3, then 3 × 2 = 6.",
              "Replace both chains in the original expression: 27 − 6.",
              "Subtract: 27 − 6 = 21."
            ],
            answer: "21",
            conclusion: "36 ÷ 4 × 3 − 18 ÷ 6 × 2 = 21",
            check: "Write the implied grouping: ((36 ÷ 4) × 3) − ((18 ÷ 6) × 2) = (9 × 3) − (3 × 2) = 27 − 6 = 21.",
            review: "The answer is 21. Both division-and-multiplication chains were completed from left to right before the subtraction, so no unwritten brackets were introduced.",
            structureId: "integerDecimalArithmetic_route_1_multiExpr",
            difficulty: 4
          })
        ]
      },
      {
        h: "2. Work backwards by undoing each step",
        body: [
          "A number machine starts with a number, performs one or more operations and produces an output. If the starting number is hidden but the output is known, we can recover the start by undoing the operations.",
          "Addition and subtraction undo each other. If a machine adds 8, working backwards subtracts 8. Multiplication and division undo each other. If a machine multiplies by 3, working backwards divides by 3.",
          "The order must also be reversed. Suppose a machine adds 8 and then multiplies by 3. The multiplication happened last, so it must be undone first. Starting from the output, divide by 3 and then subtract 8.",
          "Think about putting on a sock and then a shoe. To return to a bare foot, you cannot remove the sock first because the shoe is in the way. You undo the last action first. A chain of calculations works in the same way.",
          "For example, a number is increased by 8, multiplied by 3 and becomes 45. Work backwards: 45 ÷ 3 = 15, then 15 − 8 = 7. The starting number was 7.",
          "A backwards solution should always be checked forwards. Put the proposed starting number through the original operations in their original order. If the final value matches exactly, every undo step was consistent.",
          "With fractions, percentages or repeated machines, the same principle holds. Name the last forward action, apply its inverse, then continue backwards one step at a time. Do not try to reverse the entire chain in your head."
        ],
        note: "Write the forward operations in order, then write their inverses in reverse order.",
        misconception: "Use the inverse operation and reverse the order. Doing only one of these is not enough.",
        examples: [
          simple({
            q: "What operation undoes 'subtract 9', and what operation undoes 'multiply by 7'?",
            state: "We need the inverse operation for each instruction.",
            steps: [
              "Adding 9 replaces the amount removed by subtracting 9.",
              "Dividing by 7 reverses making a number seven times as large."
            ],
            answer: "Add 9; divide by 7",
            conclusion: "Add 9 undoes subtract 9, and divide by 7 undoes multiply by 7",
            check: "Try a number: 12 − 9 = 3 and 3 + 9 = 12. Also, 12 × 7 = 84 and 84 ÷ 7 = 12.",
            structureId: "integerDecimalArithmetic_route_2_workBackwards",
            difficulty: 1
          }),
          swc({
            q: "A number is multiplied by 2 and the output is 14. What was the input?",
            state: "The only forward operation was multiply by 2, so we undo it by dividing the output by 2.",
            steps: [
              "Start with the known output, 14.",
              "Undo multiplication by 2: 14 ÷ 2 = 7."
            ],
            answer: "7",
            conclusion: "The input was 7",
            check: "Run 7 forwards through the original machine: 7 × 2 = 14, which matches the output.",
            structureId: "integerDecimalArithmetic_route_2_workBackwards",
            difficulty: 2
          }),
          swc({
            q: "A number is increased by 8, then multiplied by 3. The output is 45. What was the input?",
            state: "The forward chain is add 8, then multiply by 3. We must undo multiply by 3 first, then undo add 8.",
            steps: [
              "Start with the output, 45.",
              "Undo the last operation, ×3: 45 ÷ 3 = 15.",
              "Undo the first operation, +8: 15 − 8 = 7."
            ],
            answer: "7",
            conclusion: "The input was 7",
            check: "Run 7 forwards: 7 + 8 = 15, then 15 × 3 = 45. The result matches the stated output.",
            structureId: "integerDecimalArithmetic_route_2_workBackwards",
            difficulty: 3
          }),
          clear({
            q: "A number is decreased by 5, multiplied by 4 and then increased by 3. The final output is 43. Find the starting number.",
            state: "We know the final output and a three-step forward chain. We must undo the operations in reverse order.",
            comprehend: "The forward chain is subtract 5, multiply by 4, then add 3. The starting number is hidden.",
            link: "The inverse operations are add 5, divide by 4 and subtract 3, but their order must reverse the forward chain.",
            explain: "Begin at 43. Undo +3 first, undo ×4 second and undo −5 last. Keep every intermediate value visible.",
            steps: [
              "Undo the final +3: 43 − 3 = 40.",
              "Undo the multiplication by 4: 40 ÷ 4 = 10.",
              "Undo the initial subtraction of 5: 10 + 5 = 15."
            ],
            answer: "15",
            conclusion: "The starting number was 15",
            check: "Run 15 forwards: 15 − 5 = 10, 10 × 4 = 40 and 40 + 3 = 43.",
            review: "The starting number was 15. The forward check returns exactly to 43, so all three inverse steps were applied in the correct reverse order.",
            structureId: "integerDecimalArithmetic_route_2_workBackwards",
            difficulty: 4
          })
        ]
      },
      {
        h: "3. Time uses groups of 60, not groups of 100",
        body: [
          "Most of our number system is built in groups of ten, but clock time is different. Sixty minutes make one hour and 24 hours make one day. This means 3:70 is not a finished clock time. Seventy minutes is 1 hour 10 minutes, so 3:70 becomes 4:10.",
          "When adding a duration, keep hours and minutes separate. Add the minutes, exchange every group of 60 minutes for an hour, then add that carried hour to the hours column.",
          "For 25 minutes after 3:45, add the minutes: 45 + 25 = 70 minutes. Exchange 60 minutes for 1 hour, leaving 10 minutes. The carried hour changes 3 to 4, so the time is 4:10.",
          "Elapsed-time questions can be easier if you bridge through a friendly time. From 11:45 to 12:00 is 15 minutes. From 12:00 to 15:25 is 3 hours 25 minutes. Together the journey lasts 3 hours 40 minutes.",
          "The 24-hour clock removes the need for am and pm. Times from 13:00 onwards are after midday: 15:25 is 3:25 pm because 15 − 12 = 3. Midnight is 00:00 and midday is 12:00.",
          "If a calculation passes midnight, the date changes as well as the time. For example, 40 minutes after 23:35 is 00:15 on the next day. State the day when the question includes one.",
          "Time-zone questions compare clocks with a fixed offset. If City B is six hours ahead of City A, subtract six hours to convert a City B time to City A. Crossing before 00:00 moves to the previous day; crossing beyond 24:00 moves to the next day."
        ],
        note: "Exchange 60 minutes for 1 hour. Never treat 100 minutes as an hour.",
        misconception: "When a calculation crosses midnight, both the clock time and the day may change.",
        examples: [
          simple({
            q: "What time is 25 minutes after 3:45?",
            state: "We add 25 minutes to 45 minutes, then exchange any complete group of 60 minutes for an hour.",
            steps: [
              "Add the minutes: 45 + 25 = 70 minutes.",
              "Seventy minutes is 1 hour 10 minutes.",
              "Carry the hour: 3 o'clock becomes 4 o'clock, with 10 minutes remaining."
            ],
            answer: "4:10",
            conclusion: "The time is 4:10",
            check: "Count on in two parts: 15 minutes takes 3:45 to 4:00, and the remaining 10 minutes takes it to 4:10. The parts total 25 minutes.",
            structureId: "integerDecimalArithmetic_route_3_clockArith",
            difficulty: 1
          }),
          swc({
            q: "What time is 2 hours 50 minutes after 4:30?",
            state: "We need to add both a minute part and an hour part, exchanging 60 minutes for an hour where necessary.",
            steps: [
              "Add the 50 minutes first: 4:30 + 50 minutes = 5:20 because 30 + 50 = 80 minutes = 1 hour 20 minutes.",
              "Add the remaining 2 hours: 5:20 + 2 hours = 7:20."
            ],
            answer: "7:20",
            conclusion: "The time is 7:20",
            check: "Work backwards from 7:20: subtract 2 hours to get 5:20, then subtract 50 minutes to return to 4:30.",
            structureId: "integerDecimalArithmetic_route_3_clockArith",
            difficulty: 2
          }),
          swc({
            q: "A bus leaves at 11:45 and travels for 3 hours 40 minutes. At what time does it arrive in 24-hour time?",
            state: "We must add the full journey duration to 11:45 and give the result using the 24-hour clock.",
            steps: [
              "Add 40 minutes: 11:45 + 40 minutes = 12:25.",
              "Add 3 hours: 12:25 + 3 hours = 15:25.",
              "The time is already in 24-hour form."
            ],
            answer: "15:25",
            conclusion: "The bus arrives at 15:25",
            check: "Find the elapsed time: 11:45 to 12:00 is 15 minutes, 12:00 to 15:00 is 3 hours and 15:00 to 15:25 is 25 minutes. The minute parts total 40 minutes, giving 3 hours 40 minutes.",
            structureId: "integerDecimalArithmetic_route_3_clockArith",
            difficulty: 3
          }),
          clear({
            q: "City B is 6 hours ahead of City A. It is 02:15 on Tuesday in City B. What day and time is it in City A?",
            state: "We must convert from the ahead city back to the earlier city and notice whether subtracting six hours crosses midnight.",
            comprehend: "City B's clock is six hours later than City A's. Therefore a City B time converts to City A by subtracting six hours.",
            link: "The time 02:15 is less than six hours after midnight, so the subtraction will pass into the previous day.",
            explain: "Step back from 02:15 Tuesday to midnight, then use the remaining part of the six-hour difference on Monday.",
            steps: [
              "From 02:15 Tuesday back to 00:00 Tuesday is 2 hours 15 minutes.",
              "Of the 6-hour difference, 6 hours − 2 hours 15 minutes = 3 hours 45 minutes remain.",
              "Move 3 hours 45 minutes back from midnight. This reaches 20:15 on Monday."
            ],
            answer: "20:15 on Monday",
            conclusion: "It is 20:15 on Monday in City A",
            check: "Move forward six hours from City A: 20:15 Monday + 3 hours 45 minutes = 00:00 Tuesday, then +2 hours 15 minutes = 02:15 Tuesday in City B.",
            review: "City A is six hours behind, so the answer is 20:15 on Monday. Adding the six-hour offset returns to 02:15 on Tuesday.",
            structureId: "integerDecimalArithmetic_route_3_clockArith",
            difficulty: 4
          })
        ]
      },
      {
        h: "4. Estimation finds a useful nearby answer",
        body: [
          "An estimate is a nearby answer that is quick to calculate. It helps us make decisions and check exact arithmetic. If a shop total is roughly £16, a £10 note will not be enough. We do not need the exact number of pence to make that decision.",
          "A good estimate keeps the scale of the original numbers. We choose nearby values that are easy to calculate, such as £2.95 becoming about £3 and £6.99 becoming about £7. The result should be labelled as an estimate because it is not the exact total.",
          "Sometimes we round each number to a stated place. To round 283 to the nearest ten, compare the neighbouring tens 280 and 290. Since 283 is 3 away from 280 and 7 away from 290, it rounds to 280.",
          "Estimation is also a check on multiplication and division. For 398 × 51, use 400 × 50 = 20,000. An exact answer near 20,000 is believable. An answer near 2,000 or 200,000 probably contains a place-value error.",
          "Unit conversions may be part of an estimate. If one bag weighs 25 kg and there are 8 bags, the total is 200 kg. Since 1 kg = 1,000 g, this is 200,000 g. Keep the units attached to each line so the direction of conversion stays clear.",
          "Rounding can also describe a range of original values. A whole number that rounds to 7,400 to the nearest hundred must be at least 7,350 but less than 7,450. The largest whole number in that range is therefore 7,449.",
          "Use a specific check for the question. Compare an estimate with an exact total, convert back to the original unit or test the numbers immediately inside and outside a rounding boundary."
        ],
        note: "An estimate should be quick, sensible and clearly labelled. It is a tool for decisions and checks, not a careless exact answer.",
        misconception: "Rounding boundaries are halfway between neighbouring choices. The upper halfway point belongs to the next rounded value.",
        examples: [
          swc({
            q: "You have £5. Crisps cost 85p, a drink costs £1.20 and a sandwich costs £2.90. Estimate whether £5 is enough, then calculate the exact amount left.",
            state: "We need a quick estimate for the decision, followed by an exact total to find the money left.",
            steps: [
              "Estimate the prices as about £1, £1 and £3.",
              "The estimated total is £1 + £1 + £3 = £5, so the purchase will be very close to the budget.",
              "Calculate exactly: £0.85 + £1.20 = £2.05.",
              "Add the sandwich: £2.05 + £2.90 = £4.95.",
              "Find the change: £5.00 − £4.95 = £0.05."
            ],
            answer: "Yes; 5p remains",
            conclusion: "£5 is enough and 5p remains",
            check: "Add the exact total and change: £4.95 + £0.05 = £5.00. The exact total is also close to the £5 estimate.",
            structureId: "integerDecimalArithmetic_route_4_estimation",
            difficulty: 1
          }),
          simple({
            q: "Round 283 to the nearest ten.",
            state: "We must choose the nearer of the two neighbouring multiples of ten, 280 and 290.",
            steps: [
              "283 − 280 = 3, so 283 is 3 away from 280.",
              "290 − 283 = 7, so 283 is 7 away from 290.",
              "The smaller distance is 3, so 280 is nearer."
            ],
            answer: "280",
            conclusion: "283 rounds to 280 to the nearest ten",
            check: "The halfway point is 285. Since 283 is below 285, it lies on the 280 side of the boundary.",
            structureId: "integerDecimalArithmetic_route_4_estimation",
            difficulty: 2
          }),
          swc({
            q: "Estimate 398 × 51, then explain whether an exact answer of 20,298 is sensible.",
            state: "We need a quick nearby multiplication and then a comparison between that estimate and the proposed exact answer.",
            steps: [
              "Round 398 to 400 and 51 to 50.",
              "Estimate: 400 × 50 = 20,000.",
              "The proposed answer 20,298 differs from the estimate by only 298, which is small compared with 20,000.",
              "An exact product a little above 20,000 is expected because 398 is just below 400 while 51 is just above 50."
            ],
            answer: "About 20,000; yes, 20,298 is sensible",
            conclusion: "The estimate is 20,000 and the exact answer 20,298 is sensible",
            check: "Calculate by partitioning: 398 × 51 = 398 × 50 + 398 = 19,900 + 398 = 20,298.",
            structureId: "integerDecimalArithmetic_route_4_estimation",
            difficulty: 3
          }),
          clear({
            q: "What is the largest whole number that rounds to 7,400 when rounded to the nearest hundred?",
            state: "We need the greatest whole number below the upper boundary of the values that round to 7,400.",
            comprehend: "The neighbouring hundreds are 7,300, 7,400 and 7,500. The rounding boundaries lie halfway between them.",
            link: "The lower boundary is 7,350 and the upper boundary is 7,450. The upper boundary itself rounds to 7,500, so it is excluded.",
            explain: "Find the largest whole number strictly below 7,450, then confirm that it is closer to 7,400 than to 7,500.",
            steps: [
              "The values that round to 7,400 satisfy 7,350 ≤ value < 7,450.",
              "The largest whole number less than 7,450 is 7,449.",
              "Its distance from 7,400 is 49, while its distance from 7,500 is 51.",
              "The next whole number, 7,450, is exactly halfway and rounds up to 7,500."
            ],
            answer: "7,449",
            conclusion: "The largest whole number is 7,449",
            check: "7,449 rounds down to 7,400 because its tens digit is 4. Increasing it by one gives 7,450, whose tens digit is 5, so that number rounds to 7,500.",
            review: "The largest possible whole number is 7,449. It lies inside the interval for 7,400, while 7,450 lies on the excluded upper boundary.",
            structureId: "integerDecimalArithmetic_route_4_estimation",
            difficulty: 4
          })
        ]
      },
      {
        h: "5. From a chain of steps to a formula",
        body: [
          "Imagine a number machine with two instructions: multiply the number by 3, then add 4. If we put 5 into the machine, the first instruction gives 5 × 3 = 15. The second gives 15 + 4 = 19. We can write the whole journey as 5 → 15 → 19.",
          "A formula is a shorter way to write those instructions. The machine above becomes y = 3x + 4. The letter x stands for the number that goes in, called the input. The letter y stands for the number that comes out, called the output.",
          "A number written beside a letter means multiplication. Therefore 3x means 3 × x. The multiplication sign is hidden to keep formulae uncluttered, but the multiplication is still there.",
          "To use a formula, replace each letter with the number it represents. This is called substitution. For y = 3x + 4 when x = 5, substitution gives y = 3 × 5 + 4. Multiplication comes first, so y = 15 + 4 = 19.",
          "A formula can contain more than one letter. In t = ab + 2a, the part ab means a × b, while 2a means 2 × a. Calculate each part separately before joining them.",
          "A small raised 2 means squared. The expression m² means m × m, not m × 2. If m = 3, then m² = 3² = 3 × 3 = 9.",
          "After substituting, use the normal order of operations: powers first, then multiplication and finally addition or subtraction. Writing the substituted line before calculating helps make sure every letter has been replaced.",
          "A formula can also be reversed. If y = 3x + 4 gives y = 19, undo the added 4 first and the multiplication by 3 second: 19 − 4 = 15, then 15 ÷ 3 = 5. A forward check confirms the recovered input."
        ],
        note: "Substitute first, then calculate. Show hidden multiplication signs while you are learning the notation.",
        misconception: "A letter beside a number or another letter means multiplication: 2a = 2 × a and ab = a × b.",
        examples: [
          swc({
            q: "Find y when x = 3, using y = 4x + 1.",
            state: "The letter x is the input and y is the output. Replace x with 3, then calculate.",
            steps: [
              "Reveal the hidden multiplication: 4x means 4 × x.",
              "Substitute x = 3: y = 4 × 3 + 1.",
              "Multiply first: 4 × 3 = 12.",
              "Add 1: y = 12 + 1 = 13."
            ],
            answer: "13",
            conclusion: "When x = 3, y = 13",
            check: "Use the machine in words: multiply 3 by 4 to get 12, then add 1 to get 13.",
            structureId: "integerDecimalArithmetic_route_5_numberMachine",
            difficulty: 1
          }),
          swc({
            q: "Find t when a = 2 and b = 7, using t = ab + 2a.",
            state: "We know both letter values. Calculate ab and 2a separately, then add them.",
            steps: [
              "Reveal the multiplication: ab means a × b and 2a means 2 × a.",
              "Substitute a = 2 and b = 7: t = 2 × 7 + 2 × 2.",
              "Calculate the products: 2 × 7 = 14 and 2 × 2 = 4.",
              "Add: t = 14 + 4 = 18."
            ],
            answer: "18",
            conclusion: "When a = 2 and b = 7, t = 18",
            check: "Think in equal groups: seven groups of 2 plus two more groups of 2 make nine groups of 2, and 9 × 2 = 18.",
            structureId: "integerDecimalArithmetic_route_5_numberMachine",
            difficulty: 2
          }),
          swc({
            q: "Find p when m = 3 and n = 5, using p = m² + 2mn − n.",
            state: "The formula contains a square, a product with three factors and a subtraction. Substitute both values, then follow the order of operations.",
            steps: [
              "Substitute m = 3 and n = 5: p = 3² + 2 × 3 × 5 − 5.",
              "Work out the square: 3² = 3 × 3 = 9.",
              "Work out the other product: 2 × 3 × 5 = 30.",
              "The formula is now p = 9 + 30 − 5.",
              "Calculate from left to right: 9 + 30 = 39, then 39 − 5 = 34."
            ],
            answer: "34",
            conclusion: "When m = 3 and n = 5, p = 34",
            check: "Group the arithmetic differently: 30 − 5 = 25, then 9 + 25 = 34. This reaches the same result.",
            structureId: "integerDecimalArithmetic_route_5_numberMachine",
            difficulty: 3
          }),
          clear({
            q: "A machine follows y = 2x + 3. A number passes through the machine, then the first output passes through the same machine again. The second output is 41. What was the starting number?",
            state: "The same two-step rule was used twice. We know the final output and must undo both passes.",
            comprehend: "One pass multiplies the input by 2 and then adds 3. The output from the first pass becomes the input for the second pass.",
            link: "To reverse one pass of ×2 then +3, subtract 3 first and divide by 2 second.",
            explain: "Work backwards from 41 one complete pass at a time. The first undo reveals the middle value and the second reveals the original input.",
            steps: [
              "Undo the second pass: 41 − 3 = 38, then 38 ÷ 2 = 19.",
              "The first pass therefore produced 19.",
              "Undo the first pass: 19 − 3 = 16, then 16 ÷ 2 = 8."
            ],
            answer: "8",
            conclusion: "The starting number was 8",
            check: "Run 8 forwards twice: 2 × 8 + 3 = 19, then 2 × 19 + 3 = 41.",
            review: "The starting number was 8. Two forward passes produce 8 → 19 → 41, exactly matching the question.",
            structureId: "integerDecimalArithmetic_route_5_numberMachine",
            difficulty: 4
          })
        ]
      }
    ]
  }
};

export function applyJuniorEditorJ01(lessons) {
  applyEditorialRevisions(lessons, revisions);
  for (const [lessonKey, revision] of Object.entries(revisions)) {
    lessons[lessonKey].recap = revision.recap;
    lessons[lessonKey].mistakes = revision.mistakes;
  }
}
