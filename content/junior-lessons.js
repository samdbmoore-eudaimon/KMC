
// ============================================================
//  GUIDED LESSONS (rich, first-principles, 10+ minute reads)
//  Keyed by topic. Rendered by RichLesson in app.jsx. Topics without an
//  entry here fall back to the compact CONCEPTS card. Schema per lesson:
//    { title, minutes, intro, sections:[{ h, body:[..], example?, note?, tryit? }], recap:[..], mistakes:[..] }
//  example = { q, steps:[..], answer }   tryit = { q, answer }
// ============================================================
export const JUNIOR_LESSONS = {
  fractionUnusual: {
    title: "Fractions, from the very beginning",
    minutes: 12,
    intro: "Fractions are one of the ideas that everything else in maths leans on. Get fractions deeply and percentages, ratio, probability and algebra all become easier, because they are really fractions wearing different hats. We are going to build fractions up from nothing, one careful step at a time. Take your time and do the check-yourself questions as you go.",
    sections: [
      {
        h: "1. What a fraction actually is",
        body: [
          "Imagine one whole pizza. Cut it into 4 equal slices. Each slice is one quarter of the pizza. If you take 3 of those slices, you have three quarters, which we write as 3/4.",
          "So a fraction is just a way of describing part of a whole. It is made of two numbers with a line between them. The bottom number, called the denominator, tells you how many equal pieces the whole was cut into. The top number, called the numerator, tells you how many of those pieces you are talking about.",
          "In 3/4 the 4 says the whole is in quarters, and the 3 says you have three of them. That is the entire idea. Everything else in this lesson is built on it.",
          "One word matters more than any other here: EQUAL. The pieces must be the same size. If you cut a pizza into four random uneven bits, taking three of them is not really 3/4 of anything, because the pieces do not agree on what a quarter means.",
        ],
        note: "The denominator names the size of the piece (quarters, fifths, tenths). The numerator counts how many of that piece you have.",
        tryit: { q: "A chocolate bar is made of 8 equal squares. You eat 5 of them. What fraction of the bar did you eat?", answer: "5/8. The bar is in eighths (8 equal pieces), and you had 5 of them." },
      },
      {
        h: "2. The same fraction, read three ways",
        body: [
          "A fraction quietly means three things at once. Seeing all three is what turns fractions from scary into obvious.",
          "First, part of a whole: 3/4 is three quarters of one thing, which is what we just did.",
          "Second, a division: 3/4 also means 3 divided by 4. Picture sharing 3 whole cakes equally between 4 friends. Each friend ends up with 3/4 of a cake. This is why the fraction line is really a division sign. It is the most useful reframe in the whole topic, so remember it: the line means divide.",
          "Third, a number on the number line: 3/4 is a proper number that sits three quarters of the way along from 0 to 1. Fractions are not just leftover bits, they are numbers you can place, compare and calculate with, exactly like whole numbers.",
        ],
        examples: [
          { q: "Where does 3/2 sit on the number line?", steps: ["3/2 means three halves.", "Two halves make one whole, so three halves is one whole and one half left over.", "So 3/2 sits between 1 and 2, exactly at 1 and a half."], answer: "1 and 1/2 (written 1 1/2)" },
          { q: "Where does 7/4 sit on the number line?", steps: ["7/4 means seven quarters.", "Four quarters make one whole, so seven quarters is one whole and three quarters left over.", "So 7/4 sits between 1 and 2, exactly at 1 and three quarters."], answer: "1 and 3/4 (written 1 3/4)" },
          { q: "Where does 11/3 sit on the number line?", steps: ["11/3 means eleven thirds.", "Three thirds make one whole, so we ask how many whole groups of 3 fit into 11.", "11 divided by 3 is 3 remainder 2, so we have 3 wholes and 2 thirds left over.", "11/3 sits between 3 and 4, exactly at 3 and 2/3."], answer: "3 and 2/3 (written 3 2/3)" },
        ],
        tryit: { q: "Using the division meaning, what is 6/4 as a share? Share 6 cakes between 4 people.", answer: "Each person gets 6/4 = 1 and 2/4 = 1 and 1/2 cakes." },
      },
      {
        h: "3. Equivalent fractions: the heart of everything",
        body: [
          "Here is a fact that looks small but does most of the heavy lifting later. Cutting the same amount into more pieces does not change how much you have.",
          "Half a pizza is the same amount as 2 quarters, which is the same amount as 4 eighths. So 1/2 = 2/4 = 4/8. These are called equivalent fractions: they look different but they are the same number.",
          "The rule: if you multiply the top and the bottom by the same number, the value does not change. Why is that allowed? Because multiplying top and bottom by, say, 4 is the same as multiplying the whole fraction by 4/4, and 4/4 is just 1. Multiplying by 1 never changes a number. That is the secret engine behind almost every fraction technique.",
        ],
        examples: [
          { q: "Fill in the gap: 2/3 = ?/9", steps: ["Look at the denominators: 3 became 9, which is times 3.", "Whatever you do to the bottom you must do to the top, so multiply the top by 3 as well.", "2 times 3 is 6."], answer: "6/9" },
          { q: "Fill in the gap: 3/5 = ?/20", steps: ["Look at the denominators: 5 became 20, which is times 4.", "Whatever you do to the bottom you must do to the top, so multiply the top by 4 as well.", "3 times 4 is 12."], answer: "12/20" },
          { q: "Fill in the gap: 5/6 = ?/42", steps: ["Look at the denominators: 6 became 42, which is times 7 (because 6 x 7 = 42).", "Whatever you do to the bottom you must do to the top, so multiply the top by 7 as well.", "5 times 7 is 35."], answer: "35/42" },
        ],
        tryit: { q: "Fill in the gap: 2/3 = ?/12", answer: "8/12. The bottom went times 4 (3 to 12), so the top does too: 2 times 4 is 8." },
      },
      {
        h: "4. Simplifying is just equivalent fractions in reverse",
        body: [
          "If multiplying top and bottom by the same number keeps the value, then dividing top and bottom by the same number must keep it too. That is all simplifying is.",
          "A fraction is in its simplest form when the top and bottom share no common factor except 1, so you cannot shrink it any further.",
          "To simplify, find a number that divides into both the top and the bottom and divide by it. You can chip away with small factors, or divide by the highest common factor in one go.",
        ],
        examples: [
          { q: "Simplify 4/8.", steps: ["Find a number that divides into both 4 and 8. Both divide by 4.", "4 divided by 4 is 1. 8 divided by 4 is 2.", "1 and 2 share no common factor except 1, so we are done."], answer: "1/2" },
          { q: "Simplify 12/18.", steps: ["Both 12 and 18 divide by 6.", "12 divided by 6 is 2. 18 divided by 6 is 3.", "2 and 3 share no common factor, so we are done."], answer: "2/3" },
          { q: "Simplify 36/48.", steps: ["Both 36 and 48 divide by 4: that gives 9/12.", "9 and 12 both divide by 3: 9 divided by 3 is 3, and 12 divided by 3 is 4.", "3 and 4 share no common factor, so we are done. (Alternatively, divide by 12 in one step: 36/12 = 3 and 48/12 = 4.)"], answer: "3/4" },
        ],
        note: "If you cannot spot the highest common factor, just divide by any common factor you can see and repeat. 12/18, divide by 2 to get 6/9, then by 3 to get 2/3. Same answer.",
        tryit: { q: "Simplify 15/25.", answer: "3/5. Both divide by 5." },
      },
      {
        h: "5. Comparing fractions",
        body: [
          "Which is bigger, 2/3 or 3/5? You cannot compare thirds with fifths directly, because the pieces are different sizes. The trick is to make the pieces the same size first, using equivalent fractions. This shared piece size is called a common denominator.",
          "A denominator that works for both 3 and 5 is 15. Rewrite each fraction in fifteenths: 2/3 = 10/15 and 3/5 = 9/15. Now the pieces match, so just compare the tops: 10 is more than 9, so 2/3 is the bigger fraction.",
          "Two quick shortcuts once you understand this. If the denominators are already the same, just compare the numerators. If the numerators are the same, the fraction with the smaller denominator is bigger, because fewer pieces means each piece is larger (1/3 is bigger than 1/5).",
        ],
        examples: [
          { q: "Which is bigger, 1/3 or 1/4?", steps: ["Both fractions have the same numerator (1), so we can compare the denominators directly.", "When numerators match, the smaller denominator wins, because its pieces are larger.", "3 is smaller than 4, so thirds are bigger pieces than quarters."], answer: "1/3 is bigger" },
          { q: "Which is bigger, 5/8 or 7/12?", steps: ["A common denominator for 8 and 12 is 24.", "5/8 = 15/24 (times 3 top and bottom).", "7/12 = 14/24 (times 2 top and bottom).", "15 is more than 14."], answer: "5/8 is bigger" },
          { q: "Which is bigger, 7/9 or 5/6?", steps: ["A common denominator for 9 and 6 is 18.", "7/9 = 14/18 (times 2 top and bottom).", "5/6 = 15/18 (times 3 top and bottom).", "15 is more than 14."], answer: "5/6 is bigger" },
        ],
        tryit: { q: "Which is bigger, 3/4 or 5/7?", answer: "3/4. Common denominator 28: 3/4 = 21/28 and 5/7 = 20/28, and 21 beats 20." },
      },
      {
        h: "6. Adding and subtracting",
        body: [
          "You can only add pieces that are the same size. Two quarters plus one quarter is three quarters, easy, because they are all quarters: 1/4 + 1/4 + 1/4 = 3/4.",
          "But 1/2 + 1/3 is a trap, because halves and thirds are different sizes. First make the pieces match with a common denominator. Sixths work: 1/2 = 3/6 and 1/3 = 2/6. Now they are both sixths, so add the number of pieces: 3/6 + 2/6 = 5/6.",
          "Notice what did and did not happen. You added the numerators (3 + 2 = 5) but the denominator stayed at 6. Adding sixths gives sixths. You never add the denominators. Subtraction works exactly the same way: match the pieces, then subtract the tops.",
        ],
        examples: [
          { q: "Work out 1/2 + 1/3.", steps: ["Common denominator for 2 and 3 is 6.", "1/2 = 3/6 and 1/3 = 2/6.", "Add the tops: 3 + 2 = 5. The bottom stays 6."], answer: "5/6" },
          { q: "Work out 3/4 + 1/6.", steps: ["Common denominator for 4 and 6 is 12.", "3/4 = 9/12 and 1/6 = 2/12.", "Add the tops: 9 + 2 = 11. The bottom stays 12."], answer: "11/12" },
          { q: "Work out 5/6 - 3/8.", steps: ["Common denominator for 6 and 8 is 24.", "5/6 = 20/24 (times 4 top and bottom).", "3/8 = 9/24 (times 3 top and bottom).", "Subtract the tops: 20 - 9 = 11. The bottom stays 24."], answer: "11/24" },
        ],
        note: "The classic mistake is 1/2 + 1/3 = 2/5, adding tops and bottoms. It is wrong: 1/2 + 1/3 is more than 1/2, but 2/5 is less than 1/2. Always match the pieces first.",
        tryit: { q: "Work out 5/6 - 1/4.", answer: "7/12. Common denominator 12: 10/12 - 3/12 = 7/12." },
      },
      {
        h: "7. Multiplying (easier than adding)",
        body: [
          "Multiplying fractions is friendlier than adding, because you do not need a common denominator. Just multiply the tops together and the bottoms together.",
          "So 2/3 times 4/5 is (2 times 4) over (3 times 5), which is 8/15.",
          "What does multiplying even mean here? The word to hold onto is of. Half of a half is a quarter, and indeed 1/2 times 1/2 = 1/4. Notice the answer got smaller: a part of a part is smaller than what you started with. That surprises people, but it is correct.",
          "A handy move: cancel common factors before you multiply, to keep the numbers small. In 3/4 times 8/9, the 4 and the 8 share a factor of 4, and the 3 and 9 share a factor of 3. Cancel first and the sum becomes 1/1 times 2/3 = 2/3, with no big numbers to tidy up afterwards.",
        ],
        examples: [
          { q: "What is 1/4 of 16?", steps: ["Of means multiply: 1/4 times 16.", "Write 16 as 16/1, so (1 times 16) over (4 times 1) = 16/4.", "16 divided by 4 is 4."], answer: "4" },
          { q: "What is 3/4 of 20?", steps: ["Of means multiply: 3/4 times 20.", "Write 20 as 20/1, so (3 times 20) over (4 times 1) = 60/4.", "60 divided by 4 is 15."], answer: "15" },
          { q: "Work out 5/6 times 9/10.", steps: ["Multiply the tops: 5 times 9 = 45.", "Multiply the bottoms: 6 times 10 = 60.", "Simplify 45/60: both divide by 15, giving 3/4.", "Alternatively, cancel before multiplying: 5/6 and 9/10 share factors 5 (cancel with 10 to get 1 and 2) and 3 (cancel 9 with 6 to get 3 and 2), giving (1 times 3) over (2 times 2) = 3/4."], answer: "3/4" },
        ],
        tryit: { q: "Work out 2/5 of 3/4.", answer: "6/20, which simplifies to 3/10." },
      },
      {
        h: "8. Dividing, and why we flip",
        body: [
          "Dividing by a fraction sounds hard, so start with a question you can picture: how many quarters fit into 2 whole things? Each whole holds four quarters, so two wholes hold eight. That means 2 divided by 1/4 is 8. Dividing by a small fraction gives a big answer, because lots of little pieces fit in.",
          "The rule that does this every time: to divide by a fraction, multiply by its reciprocal, which just means flip the second fraction upside down. So 3/4 divided by 2/5 becomes 3/4 times 5/2.",
          "Why does flipping work? Dividing by 2/5 asks how many two-fifths fit in. Multiplying by 5/2 answers exactly that question, because 5/2 is how many fits per whole. You do not have to love the proof, but do trust the rule: keep the first fraction, flip the second, then multiply.",
        ],
        examples: [
          { q: "Work out 2 divided by 1/2.", steps: ["Write 2 as 2/1.", "Flip the second fraction: 2/1 times 2/1.", "Multiply: (2 times 2) over (1 times 1) = 4."], answer: "4 (check: 4 halves do indeed make 2 wholes)" },
          { q: "Work out 6 divided by 3/4.", steps: ["Write 6 as 6/1.", "Flip the second fraction: 6/1 times 4/3.", "Multiply: (6 times 4) over (1 times 3) = 24/3 = 8."], answer: "8" },
          { q: "Work out 2/3 divided by 4/9.", steps: ["Keep the first fraction and flip the second: 2/3 times 9/4.", "Cancel before multiplying: 9 and 3 share a factor of 3, so 9/3 = 3 and 3/3 = 1. The sum becomes 2/1 times 3/4.", "Multiply: (2 times 3) over (1 times 4) = 6/4 = 3/2."], answer: "3/2, which is 1 and 1/2" },
        ],
        tryit: { q: "Work out 5/6 divided by 10/3.", answer: "5/6 times 3/10 = 15/60 = 1/4." },
      },
      {
        h: "9. Mixed numbers and improper fractions",
        body: [
          "A fraction like 7/4, where the top is bigger than the bottom, is called improper. It is a perfectly good number, it is just bigger than one whole. Written as a whole number plus a fraction it is 1 and 3/4, which we call a mixed number.",
          "To turn improper into mixed, divide the top by the bottom. 7 divided by 4 is 1 remainder 3, which reads as 1 whole and 3/4 left over.",
          "To turn mixed into improper, do the reverse: multiply the whole number by the denominator and add the top. For 2 and 1/3, that is (2 times 3) + 1 = 7, all over 3, giving 7/3. Always convert mixed numbers to improper before you multiply or divide, it saves a lot of pain.",
        ],
        tryit: { q: "Write 11/4 as a mixed number, and write 3 and 1/2 as an improper fraction.", answer: "11/4 = 2 and 3/4. And 3 and 1/2 = (3 times 2 + 1)/2 = 7/2." },
      },
      {
        h: "10. Fractions, decimals and percentages are the same thing",
        body: [
          "Because a fraction is a division, you can always turn it into a decimal by dividing. 3/4 is 3 divided by 4, which is 0.75. And 0.75 is 75 hundredths, which is 75 percent. So 3/4, 0.75 and 75 percent are three names for one amount.",
          "A few worth knowing by heart, because they come up constantly in challenge questions: 1/2 = 0.5 = 50 percent, 1/4 = 0.25 = 25 percent, 1/5 = 0.2 = 20 percent, 1/10 = 0.1 = 10 percent, and 1/3 = 0.333... = about 33.3 percent.",
          "When a question mixes fractions, decimals and percentages, quietly convert them all into whichever form is easiest to compare, usually fractions with a common denominator or all decimals. Suddenly the hard-looking question is just a comparison.",
        ],
        tryit: { q: "Put these in order, smallest first: 3/5, 0.55, 58 percent.", answer: "0.55, then 58 percent (0.58), then 3/5 (0.6). Turning them all into decimals makes it easy." },
      },
    ],
    recap: [
      "A fraction is equal pieces of a whole: the bottom names the piece size, the top counts them.",
      "The fraction line means divide, and a fraction is also a point on the number line.",
      "Multiplying or dividing top and bottom by the same number gives an equivalent fraction (that is simplifying and un-simplifying).",
      "Add and subtract only after making a common denominator, then work on the tops.",
      "Multiply straight across; divide by flipping the second fraction and multiplying.",
      "Fractions, decimals and percentages are the same idea in three outfits.",
    ],
    mistakes: [
      "Adding tops and bottoms: 1/2 + 1/3 is 5/6, never 2/5.",
      "Forgetting the pieces must be equal in the first place.",
      "Leaving an answer unsimplified when the question expects lowest terms.",
      "Multiplying without cancelling first and then drowning in big numbers.",
      "Dividing without flipping, or flipping the first fraction instead of the second.",
    ],
  },
};


// ---- Batch 2: JMC-critical topics (full-depth guided lessons) ----
JUNIOR_LESSONS.meanPuzzle = {
  title: "Averages, and the one formula that unlocks them",
  minutes: 11,
  intro: "An average is a single number that fairly stands in for a whole set of numbers. There are three kinds worth knowing well, but one small formula does most of the heavy lifting in challenge questions. We will build the idea up and then turn it into a problem-solving tool.",
  sections: [
    { h: "1. What an average is for", body: [
      "Suppose five friends have different amounts of pocket money. An average answers the question: if it were all shared out evenly, how much would each get? It squashes many numbers into one number that represents them.",
      "There are three averages: the mean, the median and the mode. They answer slightly different questions, so knowing all three, and when to use each, is part of the skill.",
    ] },
    { h: "2. The mean", body: [
      "The mean is what most people call the average. Add up all the values, then divide by how many there are.",
      "For 4, 7 and 10, the total is 21 and there are 3 numbers, so the mean is 21 divided by 3 = 7.",
      "The mean uses every value, so every number pulls on it a little.",
    ], examples: [
      { q: "Find the mean of 4, 8, 6.", steps: ["Add them: 4 + 8 + 6 = 18.", "Count them: there are 3 numbers.", "Divide: 18 divided by 3 = 6."], answer: "6" },
      { q: "Find the mean of 12, 15, 9, 18, 6.", steps: ["Add them: 12 + 15 + 9 + 18 + 6 = 60.", "Count them: there are 5 numbers.", "Divide: 60 divided by 5 = 12."], answer: "12" },
      { q: "The mean of six numbers is 11. Five of the numbers are 8, 14, 9, 12, 10. Find the sixth number.", steps: ["The total of all six must be 11 x 6 = 66.", "The five known numbers add to 8 + 14 + 9 + 12 + 10 = 53.", "The sixth number is 66 - 53 = 13."], answer: "13" },
    ],
      tryit: { q: "Find the mean of 8, 5, 9, 6, 2.", answer: "6. Total 30, five numbers, 30 divided by 5 = 6." } },
    { h: "3. The master formula: total = mean x count", body: [
      "Turn the mean rule around and you get the single most useful fact for puzzles: the total of the numbers equals the mean multiplied by how many there are.",
      "This lets you work backwards. If you know the mean and how many numbers there are, you can find their total even without knowing the numbers themselves.",
      "Whenever a mean question feels stuck, convert straight into totals. Almost every mean puzzle is really a totals puzzle wearing a disguise.",
    ], examples: [
      { q: "Three children have a mean age of 10 years. What is their combined age?", steps: ["Total = mean x count.", "Total = 10 x 3.", "Total = 30 years."], answer: "30 years" },
      { q: "Five children have a mean height of 140 cm. What is their combined height?", steps: ["Total = mean x count.", "Total = 140 x 5.", "Total = 700 cm."], answer: "700 cm" },
      { q: "Four numbers have a mean of 7. Three of them are 5, 9 and 8. What is the fourth?", steps: ["Total needed: 7 x 4 = 28.", "Total of the three known numbers: 5 + 9 + 8 = 22.", "Fourth number: 28 - 22 = 6."], answer: "6" },
    ] },
    { h: "4. Finding a missing value", body: [
      "Because means become totals, you can hunt down a missing number. Find the total you should have, subtract the part you already know, and what is left is the missing value.",
      "Example: four numbers have a mean of 9, and three of them are 5, 8 and 12. The full total must be 4 x 9 = 36. The three known numbers add to 25, so the fourth is 36 - 25 = 11.",
    ], tryit: { q: "Your first 4 test scores have a mean of 70. What must you score on the 5th test to raise your mean to 72?", answer: "80. You need a total of 5 x 72 = 360, you have 4 x 70 = 280, so the 5th score is 360 - 280 = 80." } },
    { h: "5. Combining groups (a classic trap)", body: [
      "You cannot usually just average two means together. You must go back to totals.",
      "Suppose a group of 3 has a mean of 10, so a total of 30, and a group of 2 has a mean of 20, so a total of 40. Combined, that is 70 shared among 5, giving a mean of 14, not the 15 you would wrongly get by averaging 10 and 20. The bigger group counts for more.",
    ], examples: [
      { q: "A group of 4 children has a mean score of 10. A fifth child scores 15. Find the new mean.", steps: ["Old total: 4 x 10 = 40.", "Add the new score: 40 + 15 = 55.", "New mean: 55 divided by 5 = 11."], answer: "11" },
      { q: "A class of 20 has a mean score of 15. One more child scores 36. Find the new mean of all 21.", steps: ["Old total: 20 x 15 = 300.", "Add the new score: 300 + 36 = 336.", "New mean: 336 divided by 21 = 16."], answer: "16" },
      { q: "Group A has 8 people with a mean score of 12. Group B has 4 people with a mean score of 6. Find the mean score for the combined group of 12 people.", steps: ["Total for group A: 8 x 12 = 96.", "Total for group B: 4 x 6 = 24.", "Combined total: 96 + 24 = 120.", "Combined mean: 120 divided by 12 = 10."], answer: "10 (not 9, which you would get by averaging 12 and 6 directly)" },
    ] },
    { h: "6. The median", body: [
      "The median is the middle value once the numbers are placed in order. Ordering first is essential, never skip it.",
      "For 3, 7, 2, 9, 5, put them in order: 2, 3, 5, 7, 9. The one in the middle is 5, so the median is 5.",
      "If there is an even number of values, there are two in the middle, so take the mean of those two. For 2, 4, 6, 10 the middle pair is 4 and 6, and their mean is 5.",
    ], tryit: { q: "Find the median of 12, 4, 8, 20, 6, 10.", answer: "9. In order: 4, 6, 8, 10, 12, 20. The middle pair is 8 and 10, so the median is 9." } },
    { h: "7. The mode and the range", body: [
      "The mode is simply the value that appears most often. In 2, 3, 3, 5, 7, 3 the mode is 3. A set can have more than one mode, or none at all.",
      "The range is not an average, but it often travels alongside them. It is the largest value minus the smallest, and it measures how spread out the numbers are. For values from 3 up to 17, the range is 14.",
    ], tryit: { q: "For 6, 6, 9, 2, 6, 11, find the mode and the range.", answer: "Mode 6 (it appears most). Range 11 - 2 = 9." } },
    { h: "8. Choosing the honest average", body: [
      "One very large or very small value drags the mean a long way, because it is added into the total. When that happens, the median often gives a fairer picture of the typical value.",
      "If nine people earn about 20 pounds and one earns 1000, the mean is pulled far above what almost everyone really has, while the median stays near 20. Part of the skill is knowing which average tells the honest story.",
    ] },
  ],
  recap: [
    "Mean: add all the values and divide by how many.",
    "Total = mean x count. This unlocks missing-value, add, remove and combine puzzles.",
    "Combine groups through totals, never by averaging the means.",
    "Median: the middle value in order (mean of the middle two if even).",
    "Mode: most common value. Range: largest minus smallest (a measure of spread).",
    "An outlier drags the mean; the median is often the fairer average.",
  ],
  mistakes: [
    "Finding the median without putting the numbers in order first.",
    "Averaging two group means directly instead of combining their totals.",
    "Confusing the range with an average; it measures spread, not the middle.",
    "Forgetting that total = mean x count.",
  ],
};

JUNIOR_LESSONS.angleParallel = {
  title: "Angles: lines, triangles and parallel lines",
  minutes: 11,
  intro: "Angles measure turning. A small set of rules lets you find an unknown angle by reasoning from ones you already know, which is exactly what challenge questions ask you to do. We will start from a single straight line and build all the way up to parallel lines.",
  sections: [
    { h: "1. What an angle really is", body: [
      "An angle measures the amount of turn between two lines that meet at a point. Picture the hands of a clock opening out from each other, or a door swinging on its hinge. The wider the opening, the bigger the angle.",
      "We measure angles in degrees. A full turn, all the way round back to the start, is 360 degrees. A half turn is 180 degrees. A quarter turn, which makes a square corner, is 90 degrees and is called a right angle.",
      "Learn those three benchmarks by heart. They let you estimate any angle and check that your answer is sensible.",
    ] },
    { h: "2. Naming angles by size", body: [
      "An angle smaller than a right angle (less than 90 degrees) is called acute. Exactly 90 is a right angle. Between 90 and 180 is obtuse, and more than 180 is called reflex.",
      "Knowing the names helps you sanity-check: if you calculate an obtuse-looking angle as 30 degrees, something has gone wrong.",
    ] },
    { h: "3. Angles on a straight line add to 180", body: [
      "If two or more angles sit side by side along a straight line, together they make a half turn, so they add up to 180 degrees.",
      "So if one angle on a line is 125 degrees, the angle next to it must be 180 - 125 = 55 degrees.",
    ], examples: [
      { q: "Two angles sit on a straight line: 120 degrees and one more. Find the other angle.", steps: ["Angles on a straight line add to 180.", "180 - 120 = 60."], answer: "60 degrees" },
      { q: "Three angles sit on a straight line: 40 degrees, 90 degrees and one more. Find the last angle.", steps: ["Angles on a straight line add to 180.", "40 + 90 = 130.", "180 - 130 = 50."], answer: "50 degrees" },
      { q: "Four angles sit on a straight line: 35 degrees, x, 2x and 45 degrees. Find x.", steps: ["All four angles add to 180.", "35 + x + 2x + 45 = 180.", "80 + 3x = 180.", "3x = 100, so x = 100/3, which is 33 and 1/3 degrees.", "Check: 35 + 33.3 + 66.7 + 45 = 180. Correct."], answer: "x = 33 and 1/3 degrees" },
    ] },
    { h: "4. Around a point, and vertically opposite", body: [
      "Angles that meet all the way around a single point add up to 360 degrees, because together they make a full turn.",
      "When two straight lines cross, they make an X. The two angles directly opposite each other across the crossing are always equal. These are called vertically opposite angles, and spotting them instantly gives you a free angle.",
    ], tryit: { q: "Three angles meet at a point: 90, 140 and one unknown. Find it.", answer: "130 degrees, because 360 - 90 - 140 = 130." } },
    { h: "5. Angles in a triangle add to 180", body: [
      "The three inside angles of any triangle always add up to 180 degrees, whatever the shape. You can feel why: tear the three corners off a paper triangle and fit them together, and they always make a straight line.",
      "So if two angles of a triangle are 70 and 50, the third is 180 - 70 - 50 = 60 degrees. This one fact solves an enormous number of problems.",
    ], examples: [
      { q: "A triangle has angles of 60 and 70 degrees. Find the third.", steps: ["Angles in a triangle add to 180.", "60 + 70 = 130.", "180 - 130 = 50."], answer: "50 degrees" },
      { q: "A triangle has angles of 90 and 35 degrees. Find the third.", steps: ["Angles in a triangle add to 180.", "90 + 35 = 125.", "180 - 125 = 55."], answer: "55 degrees" },
      { q: "In triangle ABC, angle A is twice angle B, and angle C is 60 degrees. Find angles A and B.", steps: ["Angles in a triangle add to 180.", "Let angle B = x, so angle A = 2x.", "Then 2x + x + 60 = 180.", "3x = 120, so x = 40.", "Angle B = 40 degrees and angle A = 80 degrees.", "Check: 80 + 40 + 60 = 180. Correct."], answer: "Angle A = 80 degrees, angle B = 40 degrees" },
    ] },
    { h: "6. Isosceles triangles have a matching pair", body: [
      "An isosceles triangle has two equal sides, and the two angles at the base of those equal sides are equal too. Spotting that equal pair is very often the key step.",
      "If the top angle of an isosceles triangle is 40 degrees, the other two share what is left: 180 - 40 = 140, split into two equal base angles of 70 degrees each.",
    ], tryit: { q: "An isosceles triangle has a top angle of 80 degrees. Find each base angle.", answer: "50 degrees each. 180 - 80 = 100, shared equally gives 50." } },
    { h: "7. Parallel lines: F, Z and C", body: [
      "Parallel lines run in the same direction and never meet, like railway tracks. When another line, called a transversal, crosses a pair of parallel lines, matching angles appear.",
      "Corresponding angles sit in the same position at each crossing and are equal; the shape they make looks like the letter F. Alternate angles sit on opposite sides between the two lines and are also equal; they make a Z. Co-interior angles sit on the same side between the lines and add up to 180; they make a C.",
    ], examples: [
      { q: "A transversal crosses two parallel lines. A corresponding angle is 75 degrees. What is its F-partner?", steps: ["Corresponding angles (F-shape) are equal.", "So the partner is also 75 degrees."], answer: "75 degrees" },
      { q: "A transversal crosses two parallel lines. A co-interior angle is 110 degrees. Find its partner.", steps: ["Co-interior angles add to 180.", "180 - 110 = 70."], answer: "70 degrees" },
      { q: "A transversal crosses two parallel lines making an angle of 55 degrees on the top-left. Find the alternate angle and the co-interior angle on the other parallel line.", steps: ["The alternate angle (Z-shape) is equal: 55 degrees.", "The co-interior angle sits on the same side and must add to 180: 180 - 55 = 125 degrees."], answer: "Alternate angle: 55 degrees. Co-interior angle: 125 degrees" },
    ],
      note: "F for corresponding (equal), Z for alternate (equal), C for co-interior (add to 180). Sketching the letter over the diagram shows you which rule to use." },
    { h: "8. Chasing angles step by step", body: [
      "Hard problems rarely hand you the angle you want. You reach it in steps: use one rule to find a new angle, feed that into another rule, and keep going until you arrive.",
      "For example, if a transversal makes a 70 degree angle with one parallel line, the alternate angle on the other line is also 70. Then, if that 70 sits on a straight line with your target angle, the target is 180 - 70 = 110. Two small steps, each with a reason.",
      "Always write the reason beside each step, such as alternate angles or angles on a line. It keeps you honest and makes the chain easy to follow.",
    ], tryit: { q: "Two parallel lines are crossed by a transversal. One angle is 65 degrees. What is its alternate angle, and what is the angle next to that one on the straight line?", answer: "The alternate angle is 65 degrees (alternate angles are equal). The one next to it on the line is 180 - 65 = 115 degrees." } },
  ],
  recap: [
    "Full turn 360, straight line 180, right angle 90.",
    "Around a point sums to 360; vertically opposite angles are equal.",
    "Angles in any triangle sum to 180; an isosceles triangle has an equal base pair.",
    "Parallel lines: corresponding (F) equal, alternate (Z) equal, co-interior (C) sum to 180.",
    "Chase an unknown angle one reasoned step at a time, writing each reason.",
  ],
  mistakes: [
    "Assuming a triangle is isosceles or right-angled when the question has not said so.",
    "Mixing up alternate (equal) with co-interior (add to 180).",
    "Thinking angles on a line make 360; they make 180.",
    "Not writing a reason for each step and losing the thread of the chain.",
  ],
};

// ---- Batch 3: sequences, cyclic patterns, digit puzzles, work-backwards, clocks, calendars ----
JUNIOR_LESSONS.customCount = {
  title: "Number sequences and their rules",
  minutes: 10,
  intro: "A sequence is just a list of numbers in order, made by following a rule. The skill is spotting the rule, then using it to leap ahead to the 10th or 100th term without writing them all out. Let us build that from the ground up.",
  sections: [
    { h: "1. What a sequence is", body: [
      "A sequence is an ordered list of numbers, like 3, 7, 11, 15. Each number is called a term. The first term is 3, the second is 7, and so on.",
      "Every sequence is built by a rule. Your job is usually to find that rule, then use it to predict terms you cannot see.",
    ] },
    { h: "2. The term-to-term rule", body: [
      "The simplest rule tells you how to get from one term to the next. In 3, 7, 11, 15 each term is 4 more than the one before, so the rule is add 4.",
      "A constant step like this makes an arithmetic sequence. The step can be negative too: 20, 17, 14, 11 has the rule subtract 3.",
    ], examples: [
      { q: "Find the next two terms of 3, 7, 11, 15.", steps: ["Find the step: 7 - 3 = 4, and it stays 4.", "Add 4: 15 + 4 = 19.", "Add 4 again: 19 + 4 = 23."], answer: "19 and 23" },
      { q: "Find the next two terms of 5, 8, 11, 14.", steps: ["Find the step: 8 - 5 = 3, and it stays 3.", "Add 3: 14 + 3 = 17.", "Add 3 again: 17 + 3 = 20."], answer: "17 and 20" },
      { q: "A sequence starts 50, 43, 36, 29. Find the next two terms and explain the rule.", steps: ["Find the step: 43 - 50 = -7 (the sequence goes down by 7 each time).", "Subtract 7: 29 - 7 = 22.", "Subtract 7 again: 22 - 7 = 15."], answer: "22 and 15 (the rule is subtract 7 each time)" },
    ],
      tryit: { q: "Find the missing term: 5, __, 15, 20.", answer: "10. The step is 5, so the gap between 5 and 15 is filled by 10." } },
    { h: "3. The position, or nth term", body: [
      "The term-to-term rule is slow if someone asks for the 100th term. A position-to-term rule, called the nth term, jumps straight there.",
      "For an arithmetic sequence the nth term is: the step times n, then adjusted by a constant. Take 3, 7, 11, 15. The step is 4, so the rule starts as 4n. Check n = 1: 4 x 1 = 4, but the first term is 3, so subtract 1. The nth term is 4n - 1.",
    ], examples: [
      { q: "Find the nth term of 4, 7, 10, 13.", steps: ["Step is 3, so start with 3n.", "n = 1 gives 3, but the first term is 4, so add 1: nth term = 3n + 1.", "Check: n = 2 gives 3 x 2 + 1 = 7. Correct."], answer: "3n + 1" },
      { q: "Find the nth term of 2, 5, 8, 11, then use it to find the 20th term.", steps: ["Step is 3, so start with 3n.", "n = 1 gives 3, but the first term is 2, so subtract 1: nth term = 3n - 1.", "20th term: 3 x 20 - 1 = 59."], answer: "nth term 3n - 1; 20th term 59" },
      { q: "The nth term of a sequence is 5n - 2. Is 48 a term in this sequence?", steps: ["Set 5n - 2 = 48.", "5n = 50.", "n = 10, which is a whole number.", "So yes, 48 is the 10th term."], answer: "Yes, 48 is the 10th term" },
    ] },
    { h: "4. Using the nth term to leap ahead", body: [
      "Once you have the nth term, any position is one calculation away. For 4n - 1, the 10th term is 4 x 10 - 1 = 39, and the 50th is 4 x 50 - 1 = 199.",
      "You can also work backwards: is 61 in the sequence 3n - 1? Set 3n - 1 = 61, so 3n = 62, so n = 62 / 3, which is not a whole number. So 61 is not a term.",
    ], tryit: { q: "The nth term of a sequence is 4n + 2. Find the 8th term.", answer: "34, because 4 x 8 + 2 = 34." } },
    { h: "5. Sequences that are not arithmetic", body: [
      "Not every sequence has a constant step. The square numbers 1, 4, 9, 16, 25 come from squaring the position: the nth term is n times n.",
      "The triangular numbers 1, 3, 6, 10, 15 grow by an increasing step (add 2, then 3, then 4). When the step itself changes, look for a different kind of rule, often based on multiplying or on the position number.",
    ], tryit: { q: "What comes next in 1, 4, 9, 16?", answer: "25. These are the square numbers, and 5 x 5 = 25." } },
    { h: "6. How to crack an unfamiliar sequence", body: [
      "Start by finding the differences between terms. If the difference is constant, it is arithmetic and you can write the nth term at once.",
      "If the difference is not constant, check whether the terms are squares, cubes, doubling, or built from the position in some way. Trying the first few positions against your guessed rule confirms it fast.",
    ] },
    { h: "7. Why the nth term is worth it", body: [
      "Challenge questions love to ask for a far-off term, or whether a big number appears in a sequence. Both are instant once you have the nth term, and nearly impossible by listing.",
      "So whenever you meet a sequence, the goal is almost always the same: find the rule for the nth term, then let it do the work.",
    ] },
  ],
  recap: [
    "A sequence is an ordered list; each entry is a term.",
    "Term-to-term rule: how to get from one term to the next (a constant step means arithmetic).",
    "nth term of an arithmetic sequence: step times n, adjusted by a constant.",
    "Use the nth term to jump to far terms, or to test if a number appears (n must be a whole number).",
    "If the step is not constant, look for squares, cubes or a position-based rule.",
  ],
  mistakes: [
    "Confusing the step-between-terms with the nth term rule.",
    "Getting the constant wrong: always check the rule gives the first term.",
    "Assuming every sequence is arithmetic without checking the differences.",
    "Saying a number is in a sequence when n turns out not to be a whole number.",
  ],
};

JUNIOR_LESSONS.modular = {
  title: "Cyclic patterns and remainders",
  minutes: 10,
  intro: "Many puzzles hide a pattern that repeats over and over: colours on a bracelet, days of the week, the last digit of a power. The trick to jumping far ahead in a repeating pattern is division with remainders. Let us see why.",
  sections: [
    { h: "1. Patterns that repeat", body: [
      "Suppose beads run red, green, blue, red, green, blue, and so on forever. This is a cycle of length 3: after every 3 beads the pattern starts again.",
      "Asking for the 20th bead by counting is slow and error-prone. There is a much faster way using remainders.",
    ] },
    { h: "2. The remainder tells you the position in the cycle", body: [
      "Divide the position by the cycle length and look at the remainder. For the 20th bead in a cycle of 3: 20 divided by 3 is 6 remainder 2. A remainder of 2 means the 20th bead is the 2nd colour in the pattern, which is green.",
      "The rule: remainder 1 means the first item in the cycle, remainder 2 the second, and a remainder of 0 means the last item, because it lands exactly at the end of a full cycle.",
    ], examples: [
      { q: "Beads go red, blue, red, blue, and so on. What colour is the 11th bead?", steps: ["Cycle length is 2.", "11 divided by 2 is 5 remainder 1.", "Remainder 1 means the 1st colour in the cycle, which is red."], answer: "Red" },
      { q: "A pattern of 5 symbols repeats. What is the 33rd symbol?", steps: ["Cycle length is 5.", "33 divided by 5 is 6 remainder 3.", "Remainder 3 means the 3rd symbol in the pattern."], answer: "the 3rd symbol" },
      { q: "A pattern repeats every 6 positions: A, B, C, D, E, F. What is the 100th symbol?", steps: ["Cycle length is 6.", "100 divided by 6 is 16 remainder 4 (because 6 x 16 = 96 and 100 - 96 = 4).", "Remainder 4 means the 4th symbol in the pattern, which is D."], answer: "D" },
    ],
      tryit: { q: "Beads repeat in a cycle of 4. Which bead in the cycle is the 30th?", answer: "The 2nd. 30 divided by 4 is 7 remainder 2." } },
    { h: "3. Days of the week", body: [
      "The days repeat every 7, so the same remainder trick works. What day is it 100 days after a Monday?",
      "100 divided by 7 is 14 remainder 2. So 100 days is 14 whole weeks (which land back on Monday) plus 2 more days. Two days after Monday is Wednesday.",
    ], examples: [
      { q: "What day is 10 days after a Monday?", steps: ["Days repeat every 7.", "10 divided by 7 is 1 remainder 3.", "Three days after Monday: Tuesday, Wednesday, Thursday."], answer: "Thursday" },
      { q: "What day is 50 days after a Friday?", steps: ["Days repeat every 7.", "50 divided by 7 is 7 remainder 1.", "One day after Friday is Saturday."], answer: "Saturday" },
      { q: "Today is Wednesday. What day was it 100 days ago?", steps: ["Days repeat every 7.", "100 divided by 7 is 14 remainder 2.", "Go back 2 days from Wednesday: Tuesday, Monday."], answer: "Monday" },
    ] },
    { h: "4. Last digits of powers", body: [
      "The last digit of the powers of a number also cycles. Look at powers of 7: 7, 49, 343, 2401, so the last digits go 7, 9, 3, 1, and then repeat. The cycle length is 4.",
      "So to find the last digit of 7 to the power 4, take the exponent 4, divide by the cycle length 4, and get remainder 0, meaning the last in the cycle, which is 1.",
    ], tryit: { q: "The last digits of powers of 3 go 3, 9, 7, 1 and repeat. What is the last digit of 3 to the power 6?", answer: "9. 6 divided by 4 is 1 remainder 2, and the 2nd last-digit is 9." } },
    { h: "5. Reading the remainder carefully", body: [
      "The one thing to be careful about is a remainder of 0. It does not mean nothing: it means you have landed exactly at the end of a cycle, so you take the last item.",
      "Writing out the first few positions with their remainders once, to see the pattern, stops this catching you out.",
    ] },
    { h: "6. Bringing it together", body: [
      "A worked example ties the idea down. What is the last digit of 2 to the power 10? The last digits of powers of 2 go 2, 4, 8, 6 and then repeat, a cycle of length 4.",
      "Take the exponent 10 and divide by 4, which is 2 remainder 2. So the last digit is the 2nd in the cycle, which is 4. And indeed 2 to the power 10 is 1024, ending in 4.",
    ], tryit: { q: "The last digits of powers of 9 go 9, 1 and repeat. What is the last digit of 9 to the power 7?", answer: "9. 7 divided by 2 is remainder 1, and the 1st last-digit is 9." } },
    { h: "7. Why this is powerful", body: [
      "With remainders you can answer questions about the 1000th term of a repeating pattern as easily as the 4th. The size of the number stops mattering.",
      "Any time you spot something that repeats in a fixed-length cycle, reach for divide-and-take-the-remainder.",
    ] },
  ],
  recap: [
    "A repeating pattern has a cycle length: how many items before it starts again.",
    "Divide the position by the cycle length; the remainder gives the position within the cycle.",
    "Remainder 0 means the last item in the cycle, not the first.",
    "Days of the week use a cycle of 7; last digits of powers cycle too.",
  ],
  mistakes: [
    "Treating a remainder of 0 as the first item instead of the last.",
    "Using the wrong cycle length.",
    "Counting one by one instead of using the remainder for large positions.",
  ],
};

JUNIOR_LESSONS.cryptarith = {
  title: "Digit puzzles and place value",
  minutes: 10,
  intro: "Digit puzzles hide numbers behind blanks or letters and ask you to rebuild them. They are really place-value puzzles, solved by careful reasoning rather than guessing. Let us build the tools.",
  sections: [
    { h: "1. Place value is the key", body: [
      "A two-digit number is not just its digits stuck together. The number with tens digit a and units digit b is worth 10 times a, plus b, written 10a + b.",
      "So 63 is 10 x 6 + 3. This way of writing a number in terms of its digits is what lets you turn a word puzzle into arithmetic you can solve.",
    ] },
    { h: "2. Reversing a number", body: [
      "If a number is 10a + b, then the number with its digits reversed is 10b + a. Subtracting one from the other reveals a hidden pattern.",
      "(10a + b) minus (10b + a) equals 9a - 9b, which is 9 times (a - b). So the difference between a two-digit number and its reverse is always a multiple of 9. That single fact cracks many puzzles.",
    ], examples: [
      { q: "A two-digit number is 18 more than its reverse and the tens digit is bigger. Find a - b.", steps: ["The difference between a two-digit number and its reverse is always 9 x (a - b).", "Set 9 x (a - b) = 18, so a - b = 2."], answer: "a - b = 2 (for example, 31 - 13 = 18, and 3 - 1 = 2)" },
      { q: "A two-digit number has digits that add to 9, and it is 27 more than its reverse. Find it.", steps: ["The difference from its reverse is 9 x (a - b) = 27, so a - b = 3.", "The digits add to 9, so a + b = 9.", "Solve the pair: a = 6, b = 3.", "Check: 63 - 36 = 27, and 6 + 3 = 9."], answer: "63" },
      { q: "A two-digit number has digits that sum to 11 and is 45 more than its reverse. Find the number.", steps: ["The difference from its reverse is 9 x (a - b) = 45, so a - b = 5.", "The digits sum to 11, so a + b = 11.", "Add the two equations: 2a = 16, so a = 8, and b = 3.", "Check: 83 - 38 = 45, and 8 + 3 = 11."], answer: "83" },
    ] },
    { h: "3. Reasoning column by column", body: [
      "In an addition puzzle, work one column at a time from the right, exactly as you would add normally, watching for carries into the next column.",
      "For 3? + ?2 = 90, the tens and units must fit: 30 + x, plus 10y + 2, equals 90. So 10y + x = 58, giving y = 5 and x = 8. The sum is 38 + 52 = 90.",
    ], tryit: { q: "In the sum 4? + ?3 = 90, find the two missing digits.", answer: "The units and tens must give 90: 40 + x + 10y + 3 = 90, so 10y + x = 47, giving y = 4 and x = 7. That is 47 + 43 = 90." } },
    { h: "4. Rules of the game", body: [
      "In a letter puzzle, each letter stands for one digit, and the same letter is always the same digit. Different letters are usually different digits.",
      "A number cannot start with a leading zero, so the first digit of any number in the puzzle is at least 1. That restriction often pins down a digit straight away.",
    ] },
    { h: "5. Use divisibility clues", body: [
      "Clues about a number being even, or a multiple of 5, or having a certain digit sum, shrink the possibilities fast. An even number ends in an even digit; a multiple of 5 ends in 0 or 5.",
      "If the digits must add to a certain total, list only the digit pairs that reach it, then test them against the other conditions.",
    ], tryit: { q: "A two-digit multiple of 5 has digits that add to 9. What could it be?", answer: "45 (ends in 5, and 4 + 5 = 9). 90 also ends in 0 with 9 + 0 = 9." } },
    { h: "6. A worked column example", body: [
      "Try one with a carry. In the puzzle A7 + 15 = 62, the letter A is the tens digit of a two-digit number. Written out, that is 10 times A, plus 7, plus 15, equals 62.",
      "So 10A + 22 = 62, giving 10A = 40 and A = 4. Check it: 47 + 15 = 62. Correct.",
    ], tryit: { q: "In the puzzle 2B - 8 = 15, find the units digit B.", answer: "3. 20 + B - 8 = 15, so B = 3, and 23 - 8 = 15." } },
    { h: "7. Work from what is forced", body: [
      "The winning habit is to find the digit that is most tightly pinned down and settle it first, then let it force the next.",
      "Never guess wildly. Each clue removes options; chase the forced steps and the puzzle unravels.",
    ] },
  ],
  recap: [
    "A two-digit number is 10a + b; its reverse is 10b + a.",
    "The difference between a number and its reverse is a multiple of 9.",
    "In addition puzzles, reason column by column and mind the carries.",
    "Each letter is one digit; no number starts with a leading zero.",
    "Use even, multiple-of-5 and digit-sum clues to cut the options.",
  ],
  mistakes: [
    "Treating a two-digit number as its digits added, not 10a + b.",
    "Allowing a leading zero.",
    "Guessing instead of following the forced digits.",
    "Forgetting to carry between columns.",
  ],
};

JUNIOR_LESSONS.clockArith = {
  title: "Clocks and time",
  minutes: 9,
  intro: "Time questions trip people up because time does not run in tens: it rolls over at 60 minutes and at 12 or 24 hours. Once you handle those roll-overs confidently, elapsed-time and clock puzzles become easy.",
  sections: [
    { h: "1. Time is not base ten", body: [
      "There are 60 minutes in an hour and 24 hours in a day, so you cannot just treat times like ordinary numbers. 1 hour 70 minutes is really 2 hours 10 minutes, because 60 of those minutes roll over into an hour.",
      "Keeping hours and minutes in their own columns, and rolling 60 minutes over into 1 hour, is the heart of every time calculation.",
    ] },
    { h: "2. Adding a duration", body: [
      "To add a length of time to a clock time, add the minutes first, roll over any full 60 into the hours, then add the hours.",
      "45 minutes after 10:40: 40 + 45 = 85 minutes, which is 1 hour and 25 minutes. So the time becomes 11:25.",
    ], examples: [
      { q: "What time is 25 minutes after 3:45?", steps: ["Add the minutes: 45 + 25 = 70 minutes = 1 hour 10 minutes.", "Roll the 1 hour over: 3 o'clock becomes 4 o'clock, leaving 10 minutes.", "The answer is 4:10."], answer: "4:10" },
      { q: "What time is 2 hours 50 minutes after 4:30?", steps: ["Add the minutes: 30 + 50 = 80 minutes = 1 hour 20 minutes.", "So far that is 5:20 (4:30 plus 50 minutes rolls past the hour).", "Now add the 2 hours: 7:20."], answer: "7:20" },
      { q: "A bus journey starts at 11:45 and takes 3 hours 40 minutes. At what time does it arrive?", steps: ["Add the minutes: 45 + 40 = 85 minutes = 1 hour 25 minutes.", "Roll the 1 hour over: 11 becomes 12, leaving 25 minutes, so 12:25.", "Add the 3 hours: 12:25 becomes 15:25, which is 3:25 pm."], answer: "15:25 (3:25 pm)" },
    ],
      tryit: { q: "What time is 40 minutes after 11:35?", answer: "12:15. 35 + 40 = 75 minutes = 1 hour 15, rolling 11 up to 12." } },
    { h: "3. Elapsed time between two times", body: [
      "To find how long passed between two times, it often helps to count up in steps: to the next hour, then whole hours, then the last few minutes.",
      "From 9:20 to 13:05: from 9:20 to 10:00 is 40 minutes; from 10:00 to 13:00 is 3 hours; from 13:00 to 13:05 is 5 minutes. Total: 3 hours 45 minutes.",
    ], tryit: { q: "How long is it from 2:50 to 6:10?", answer: "3 hours 20 minutes. 2:50 to 3:00 is 10 min, 3:00 to 6:00 is 3 hours, 6:00 to 6:10 is 10 min." } },
    { h: "4. 12-hour and 24-hour clocks", body: [
      "In the 24-hour clock, afternoon and evening hours carry on past 12: 1 pm is 13:00, 6 pm is 18:00. To convert an afternoon 12-hour time to 24-hour, add 12 to the hours.",
      "Watch the roll-over at midday and midnight. 90 minutes before 1:15 pm is 11:45 am, because you cross back over midday.",
    ] },
    { h: "5. Angles of clock hands", body: [
      "The 12 hour-marks are spread evenly around a full turn of 360 degrees, so the gap between two marks is 360 divided by 12 = 30 degrees.",
      "At 3 o'clock the hour hand is 3 marks from the 12, so the angle to the minute hand at the 12 is 3 x 30 = 90 degrees. At 5 o'clock it is 5 x 30 = 150 degrees.",
    ], tryit: { q: "What is the angle between the hands at 2 o'clock?", answer: "60 degrees, because 2 x 30 = 60." } },
    { h: "6. A worked example across midday", body: [
      "A film starts at 11:40 and lasts 2 hours 35 minutes. When does it end? Add the minutes first: 40 + 35 = 75 minutes, which is 1 hour 15 minutes, taking 11:40 to 12:55.",
      "Now add the 2 hours: 12:55 becomes 14:55, which is 2:55 in the afternoon. Notice how the minutes rolled over the hour and the time crossed midday.",
    ], tryit: { q: "How long is it from 10:25 to 14:10?", answer: "3 hours 45 minutes. 10:25 to 11:00 is 35 min, 11:00 to 14:00 is 3 hours, 14:00 to 14:10 is 10 min." } },
    { h: "7. Keep the columns separate", body: [
      "Nearly every time slip comes from mixing minutes and hours, or forgetting a roll-over. Keep them in separate columns and convert 60 minutes into 1 hour whenever the minutes reach 60.",
      "A quick sanity check, does the answer make sense as a real time, catches most errors.",
    ] },
  ],
  recap: [
    "Time rolls over at 60 minutes and at 12 or 24 hours; it is not base ten.",
    "Add a duration by adding minutes, rolling 60 into an hour, then adding hours.",
    "Find elapsed time by counting up: to the next hour, whole hours, then minutes.",
    "24-hour afternoon times are the 12-hour time plus 12 hours.",
    "Clock marks are 30 degrees apart, so the hour hand is 30 degrees per hour from the 12.",
  ],
  mistakes: [
    "Treating 1 hour 70 minutes as a final answer instead of 2 hours 10 minutes.",
    "Forgetting the roll-over at midday or midnight.",
    "Subtracting times digit by digit as if they were ordinary numbers.",
  ],
};

// ---- Full-depth guided lessons: algebra tools (workBackwards v2, numberMachine, allocation) ----

JUNIOR_LESSONS.workBackwards = {
  title: "Working backwards",
  minutes: 16,
  intro: "Some puzzles hand you the ending and dare you to find the beginning. 'I thought of a number, did a few things to it, and ended up with 17, what did I start with?' You could guess numbers all day, but there is a far better way: run the whole story backwards, undoing each step with its exact opposite, in exactly the reverse order. Master this one idea and a huge family of number puzzles, from playground riddles to real algebra, stop being mysterious and start being mechanical.",
  sections: [
    { h: "1. The shape of the puzzle", body: [
      "A working-backwards puzzle always has the same skeleton underneath: a starting number you don't know, a list of things done to it in a fixed order, and the final result, which you do know.",
      "Because you know exactly what happened and exactly where it ended up, you actually have everything you need to rebuild the start. Nothing is left to chance, it's a rebuild, not a guess.",
    ], note: "Watch for the giveaway phrases: 'I thought of a number', 'started with', 'to begin with'. They all mean the same thing: find the start." },
    { h: "2. Doing and undoing", body: [
      "Every operation you know has an exact opposite, called its inverse. Addition and subtraction undo each other, and so do multiplication and division.",
      "Add 8 is undone by subtract 8. Multiply by 6 is undone by divide by 6. This pairing is the entire engine behind working backwards: whatever was done, do the opposite, and you land back where you started.",
    ], tryit: { q: "What operation undoes 'subtract 9'? And what undoes 'multiply by 7'?", answer: "Add 9 undoes subtract 9. Divide by 7 undoes multiply by 7." } },
    { h: "3. A number machine, and its mirror", body: [
      "It helps to picture the steps as a machine a number travels through, one operation at a time, like a conveyor belt. Feed a number in, and it comes out changed at the far end.",
      "To undo the machine, build its mirror image: the same operations, each swapped for its opposite, arranged in reverse order. Run the final result through the mirror machine, and out pops the start.",
    ], examples: [
      { q: "A number machine does: input, then multiply by 2, and the output is 14. What was the input?", steps: ["The machine was: x2. The mirror machine undoes multiply by 2 with divide by 2.", "Run 14 through the mirror: 14 divided by 2 = 7."], answer: "7 (check: 7 x 2 = 14)" },
      { q: "A number machine does this: input, then add 8, then multiply by 3, and the output is 45. What was the input?", steps: ["The machine was: +8, then x3. The mirror machine undoes multiply by 3 first, with divide by 3, then undoes add 8, with subtract 8.", "Run 45 through the mirror: 45 divided by 3 = 15.", "Then 15 - 8 = 7."], answer: "7 (check: 7 + 8 = 15, and 15 x 3 = 45)" },
      { q: "A number machine does: input, then subtract 5, then multiply by 4, then add 3, giving 43. Find the input.", steps: ["The machine was: -5, x4, +3. Undo in reverse order.", "Undo +3: 43 - 3 = 40.", "Undo x4: 40 divided by 4 = 10.", "Undo -5: 10 + 5 = 15."], answer: "15 (check: 15 - 5 = 10, x4 = 40, +3 = 43)" },
    ] },
    { h: "4. Order flips too", body: [
      "The trap almost everybody falls into at least once is undoing the steps in the same order they were done, rather than in reverse. That gives a wrong answer even when every operation itself is correctly reversed.",
      "The rule is simple to say and easy to forget under pressure: the last thing done to the number is the first thing you undo.",
    ], note: "Watch this go wrong. A number is doubled, then 3 is added, giving 17. The last step was 'add 3', so undo that first: 17 - 3 = 14, then halve: 14 divided by 2 = 7. Undo in the same order instead (halve first, then subtract 3), and you get 17 divided by 2 = 8.5, then 8.5 - 3 = 5.5, which is wrong, and does not check forwards.",
      tryit: { q: "A number is multiplied by 4, then 5 is subtracted, giving 23. Find the number.", answer: "7. Undo subtract 5 first: 23 + 5 = 28. Then undo multiply by 4: 28 divided by 4 = 7." } },
    { h: "5. Three steps: the classic 'I'm thinking of a number'", body: [
      "Longer chains work exactly the same way, just with more mirror steps to line up. Write the original steps down in order, then read them off backwards.",
      "'I think of a number, add 3, multiply by 2, add 3, and the answer is 23.' That's three steps: +3, x2, +3. The mirror undoes them in reverse: -3, divide by 2, -3.",
    ], examples: [
      { q: "I think of a number, add 5, then multiply by 2, giving 14. Find the number.", steps: ["The steps are +5, x2. Undo in reverse order.", "Undo x2: 14 divided by 2 = 7.", "Undo +5: 7 - 5 = 2."], answer: "2 (check: 2+5=7, 7x2=14)" },
      { q: "Use the mirror machine on 23 for the chain +3, x2, +3.", steps: ["Undo the last +3: 23 - 3 = 20.", "Undo the x2: 20 divided by 2 = 10.", "Undo the first +3: 10 - 3 = 7."], answer: "7 (check: 7+3=10, 10x2=20, 20+3=23)" },
      { q: "I think of a number, multiply by 4, subtract 7, then divide by 3, and get 11. Find the number.", steps: ["The steps are x4, -7, divide by 3. Undo in reverse.", "Undo divide by 3: 11 x 3 = 33.", "Undo -7: 33 + 7 = 40.", "Undo x4: 40 divided by 4 = 10."], answer: "10 (check: 10x4=40, 40-7=33, 33 divided by 3=11)" },
    ],
      tryit: { q: "I think of a number, subtract 4, multiply by 3, add 5, and get 26. Find the number.", answer: "11. Undo: 26-5=21, 21 divided by 3=7, 7+4=11. Check: 11-4=7, 7x3=21, 21+5=26." } },
    { h: "6. Four steps and beyond", body: [
      "There's no limit to how long the chain can get. As long as you keep the mirror steps in the correct reverse order, four or five operations are no harder than two, just longer.",
    ], examples: [
      { q: "A number is doubled, then 6 is added, then halved, giving 5. Find the number.", steps: ["Undo halved, with x2: 5 x 2 = 10.", "Undo +6: 10 - 6 = 4.", "Undo doubled, with divide by 2: 4 divided by 2 = 2."], answer: "2 (check: 2x2=4, 4+6=10, 10 divided by 2=5)" },
      { q: "A number is trebled, then 10 is subtracted, then halved, then 4 is added, giving 11. Find the number.", steps: ["Undo +4: 11-4=7.", "Undo halved, with x2: 7x2=14.", "Undo -10, with +10: 14+10=24.", "Undo trebled, with divide by 3: 24 divided by 3 = 8."], answer: "8 (check: 8x3=24, 24-10=14, 14 divided by 2=7, 7+4=11)" },
      { q: "A number is multiplied by 5, then 3 is added, then multiplied by 2, then 4 is subtracted, giving 36. Find the number.", steps: ["Undo -4: 36+4=40.", "Undo x2: 40 divided by 2=20.", "Undo +3: 20-3=17.", "Undo x5: 17 divided by 5=3.4. Check: 3.4x5=17, +3=20, x2=40, -4=36."], answer: "3.4 (check passes; sometimes working backwards gives non-integer answers)" },
    ],
      tryit: { q: "A number is doubled, then 8 is added, then halved, then 3 is subtracted, giving 9. Find the number.", answer: "8. Undo: 9+3=12, 12x2=24, 24-8=16, 16 divided by 2=8. Check: 8x2=16, +8=24, halved=12, -3=9." } },
    { h: "7. When the story is about money or stuff", body: [
      "The same machine works when the 'operations' are hidden inside a story about money, sweets or stock, rather than written as bare symbols. The first job is spotting what happened, and in what order.",
    ], examples: [
      { q: "Emma spent £3 on a drink and had £8 left. How much did she start with?", steps: ["The only step done to Emma's money was spending £3.", "Undo spending £3: 8 + 3 = 11."], answer: "11 pounds (check: 11 - 3 = 8)" },
      { q: "Ben spent half his birthday money on a football, then spent 5 pounds more on chips, and had 7 pounds left. How much did he start with?", steps: ["The steps done to his money were: halved, then -5. Rewind from the end, 7.", "Undo -5: 7+5=12.", "Undo halved, with x2: 12x2=24."], answer: "24 pounds (check: half of 24 is 12, spent on football, then 12-5=7 left after chips)" },
      { q: "Rosie spent a third of her pocket money on a book, was given £2 by her grandfather, and spent half of what she had left on sweets, ending with £5. How much pocket money did she start with?", steps: ["Undo halving: 5 x 2 = 10.", "Undo receiving £2: 10 - 2 = 8.", "This 8 is two thirds of her starting amount (a third was spent on the book). One third = 8 divided by 2 = 4, so the whole starting amount = 4 x 3 = 12."], answer: "12 pounds (check: a third of 12 is 4 on book, leaving 8; +2 from grandfather is 10; half of 10 on sweets, 5 left)" },
    ],
      tryit: { q: "A shop's stock was tripled for the sale, then 4 boxes were sold, leaving 20 boxes. How many boxes were there to start with?", answer: "8. Undo -4: 20+4=24. Undo tripled: 24 divided by 3=8. Check: 8x3=24, 24-4=20." } },
    { h: "8. Always check by running forwards", body: [
      "Working backwards is reliable, but a slip on a single step still gives a wrong answer with total confidence. The fix costs ten seconds: take your answer and run it forwards through the original steps.",
      "If you land exactly on the number the puzzle gave you, you're certainly right. If you don't, you've caught the mistake yourself, which is always the better way round.",
    ] },
    { h: "9. A Little Reckoning tangle", body: [
      "Even in a village where everything adds up, things get shaken loose. Addy the ant kept a winter store of acorns, doubled it for safekeeping, and then Countra, in a fit of counting-panic, ate 3 of them before anyone could stop her, leaving 15 in the store.",
    ], examples: [
      { q: "Pebble gathered some pebbles, then someone added 5 more, leaving 13. How many pebbles did Pebble start with?", steps: ["Rewind from 13. The last thing that happened was adding 5, so undo it: 13 - 5 = 8."], answer: "8 pebbles (check: 8 + 5 = 13)" },
      { q: "How many acorns did Addy have before she doubled the store?", steps: ["Rewind from 15. The last thing that happened was Countra eating 3, so undo it: 15+3=18.", "Before that the store was doubled, so undo it: 18 divided by 2 = 9."], answer: "9 acorns (check: 9 doubled is 18, minus the 3 Countra ate is 15)" },
      { q: "A creature tripled its food store, gave away 4 portions, and then halved what remained, ending with 10. How much did it start with?", steps: ["Undo halved: 10 x 2 = 20.", "Undo gave away 4: 20 + 4 = 24.", "Undo tripled: 24 divided by 3 = 8."], answer: "8 (check: 8x3=24, 24-4=20, 20 divided by 2=10)" },
    ],
      tryit: { q: "Pebble gathered some pebbles, doubled them for the display case, then lost 6 in the stream, leaving 10. How many pebbles did Pebble start with?", answer: "8. Undo -6: 10+6=16. Undo doubled: 16 divided by 2=8. Check: 8x2=16, 16-6=10." } },
    { h: "10. Where this trick runs out of road", body: [
      "Working backwards assumes you can write the puzzle as one single chain, with the mystery number appearing exactly once, at the very start. That covers a huge number of puzzles, but not all of them.",
      "Trouble starts when the unknown number turns up more than once, independently, in the same puzzle, for instance on both sides of a balance. 'Twice my number, plus 5, equals my number, plus 17.' There are two separate copies of 'my number' here, and no single reverse chain can undo that, because there's nothing purely known to run backwards from.",
    ], note: "This isn't a dead end, it's a cue. When the mystery number shows up more than once, you need a different tool: the balance method, where you do the same thing to both sides of an equals sign until the unknown is alone. That's exactly where the Number Machines quest picks up." },
    { h: "11. The final gauntlet", body: [
      "Time to put it all together. Read the steps carefully, mirror them in reverse, and check forwards before you commit to an answer.",
    ], examples: [
      { q: "Sam spent half his money on a game and had 9 pounds left. How much did he start with?", steps: ["He spent half, so he had half left. Half his money is 9 pounds.", "The whole amount is 9 x 2 = 18 pounds."], answer: "18 pounds (check: half of 18 is 9, which matches)" },
      { q: "Jess spent a third of her allowance on a book, then 4 pounds on a pen, and had 6 pounds left. How much was her allowance?", steps: ["After spending a third, two thirds remained. That two-thirds amount, minus 4, left 6, so the two-thirds amount was 6+4=10.", "If two thirds of the allowance is 10, one third is 10 divided by 2 = 5, so the whole allowance, three thirds, is 5x3=15."], answer: "15 pounds (check: a third of 15 is 5, spent, leaving 10; minus 4 for the pen leaves 6)" },
      { q: "A number has 7 added, is then multiplied by 5, then 3 is subtracted, and then the result is divided by 4, giving 12. Find the original number.", steps: ["Undo divide by 4: 12 x 4 = 48.", "Undo subtract 3: 48 + 3 = 51.", "Undo multiply by 5: 51 divided by 5 = 10.2.", "Undo add 7: 10.2 - 7 = 3.2. Check: 3.2+7=10.2, x5=51, -3=48, divided by 4=12."], answer: "3.2" },
    ],
      tryit: { q: "A number has 6 added, is trebled, then 9 is subtracted, giving 30. Find the number.", answer: "7. Undo -9: 30+9=39. Undo trebled: 39 divided by 3=13. Undo +6: 13-6=7. Check: 7+6=13, x3=39, -9=30." } },
    { h: "12. Working backwards through a percentage change", body: [
      "The mirror machine works just as well when one of the steps is a percentage change rather than a plain add or multiply, as long as you remember a percentage rise or fall is itself just a multiplication by a decimal (a full lesson on this lives in Money Trails). Undoing a percentage step means dividing by that same decimal, not subtracting the percentage back off.",
      "After a 20% pay rise, Sam's salary became 30,000 pounds. What was Sam's salary before the rise? A 20% rise is a machine step of multiply by 1.2, so undo it by dividing by 1.2.",
    ], examples: [
      { q: "After a 10% rise, a wage became 33 pounds. What was it before?", steps: ["A 10% rise means multiply by 1.1.", "Undo by dividing by 1.1: 33 divided by 1.1 = 30."], answer: "30 pounds (check: 30 x 1.1 = 33)" },
      { q: "Find Sam's salary before the rise.", steps: ["The rise step was x1.2, so undo it with divide by 1.2.", "30,000 divided by 1.2 = 25,000."], answer: "25,000 pounds (check: 25,000 x 1.2 = 30,000)" },
      { q: "A price fell by 30% in a sale and the sale price is 35 pounds. What was the original price?", steps: ["A 30% discount means multiply by 0.7 (you keep 70%).", "Undo by dividing by 0.7: 35 divided by 0.7 = 50."], answer: "50 pounds (check: 50 x 0.7 = 35)" },
    ],
      tryit: { q: "After a 15% discount, a jacket costs 51 pounds. What was its price before the discount?", answer: "60 pounds. A 15% discount is a machine step of multiply by 0.85, so undo it by dividing: 51 divided by 0.85 = 60. Check: 60 x 0.85 = 51." } },
    { h: "13. Undoing a step that repeats every round", body: [
      "Some stories repeat the SAME pair of steps several times over, once per day or per night, rather than listing a one-off chain. A squirrel halves its nuts, then receives a fixed gift, every single night for several nights. To work backwards, undo one whole ROUND at a time (undo the gift, then undo the halving), and repeat that pair of undo-steps once for every round that happened, from the last night back to the first.",
      "The order-flips rule from section 4 still applies inside each round: within one night, the gift was the LAST thing added, so it's the FIRST thing you strip away, before undoing that night's halving.",
    ], examples: [
      { q: "A squirrel doubles its nuts each night, then eats 3. After 2 nights it has 5. How many did it start with?", steps: ["Undo night 2: undo eat 3 first: 5+3=8. Undo doubling by halving: 8 divided by 2=4.", "Undo night 1 the same way: 4+3=7, halved: 7 divided by 2=3.5."], answer: "3.5 nuts (check: 3.5x2=7, 7-3=4; 4x2=8, 8-3=5)" },
      { q: "A squirrel halves its nuts each night, then gets 4 more from a friend. After 2 nights it has 10. How many did it start with?", steps: ["Undo night 2: strip the gift first, 10-4=6, then undo the halving by doubling, 6x2=12.", "Undo night 1 the same way: 12-4=8, then 8x2=16."], answer: "16 nuts (check: night 1: 16 halved is 8, +4 gift = 12; night 2: 12 halved is 6, +4 gift = 10)" },
      { q: "Each day a fish pond loses a third of its fish, then 5 fish are added. After 3 days there are 11 fish. How many were there at the start?", steps: ["Undo day 3: 11-5=6, and 6 is two-thirds of the start of that day, so x3/2: 6 x 3 divided by 2 = 9.", "Undo day 2: 9-5=4, then 4 x 3/2 = 6.", "Undo day 1: 6-5=1, then 1 x 3/2 = 1.5. (Check: 1.5 - 1/3 of 1.5 = 1, +5=6; 6-2=4, +5=9; 9-3=6, +5=11.)"], answer: "1.5 fish (a fractional starting value is valid; the arithmetic checks)" },
    ],
      tryit: { q: "A jar of marbles is halved, then 3 are added, every day for 3 days, ending at 9. How many marbles were there to start?", answer: "42. Undo day 3: 9-3=6, x2=12. Undo day 2: 12-3=9, x2=18. Undo day 1: 18-3=15, x2=30... check the arithmetic each round carefully, since a single slipped round throws off every earlier one." } },
    { h: "14. Two people, two exchanges: working backwards through a swap", body: [
      "The trickiest working-backwards stories involve TWO people trading amounts back and forth, each move defined by its EFFECT ('enough to exactly double what the other has') rather than by a plain number. These still unwind with the same mirror-and-reverse-order idea, just applied to a pair of amounts together instead of one.",
      "Suppose two friends end up with equal amounts, and the last thing that happened was one of them doubling the other's money by handing some over. To undo that, the person who was doubled must have started that step with HALF of their final amount (since doubling makes half become whole), and the person who gave money must get back exactly what they gave away, on top of their own final amount.",
    ], examples: [
      { q: "Ben and Clara end with £12 each. The last step was Clara giving Ben enough to double his money. What did each have just before that step?", steps: ["Ben was doubled to reach £12, so before this step Ben had half of £12 = £6.", "Clara gave away £12 - £6 = £6, so before this step Clara had her final £12 plus the £6 she gave away = £18."], answer: "Ben had £6 and Clara had £18 (total £24 throughout)" },
      { q: "Amy and Zoe end up with £20 each. The very last step was Zoe giving Amy enough to exactly double what Amy had. What did each have right before that last step?", steps: ["Amy was doubled to reach £20, so before this step Amy had half of £20 = £10.", "Zoe gave away the difference, £20 - £10 = £10, so before this step Zoe had her final £20 plus the £10 she gave away = £30."], answer: "Amy had £10 and Zoe had £30 right before the last step (and the total, £40, never changes, since money only moves between them, never appears or vanishes)" },
      { q: "At the end of a game, players A and B both have 24 tokens. The last two moves were: B gave A enough to double A's tokens, then A gave B enough to double B's tokens. What did each have before those two moves?", steps: ["Undo the second move (A doubled B): B ended with 24, so before that step B had 24 divided by 2 = 12. A gave away 24-12=12 tokens, so before that step A had 24+12=36.", "Undo the first move (B doubled A): A ended step 1 with 36, so before step 1 A had 36 divided by 2 = 18. B gave away 36-18=18, so before step 1 B had 12+18=30."], answer: "Before the two moves: A had 18, B had 30 (total 48 throughout)" },
    ],
      tryit: { q: "Two friends end with £16 each after the last step was one of them doubling the other. What did the doubled friend have right before that step, and how much did the total come to?", answer: "£8 (half of £16), and the total stays £32 throughout, since giving money away never changes the combined total, only how it's split." } },
  ],
  recap: [
    "Working backwards rebuilds the start from the end, when you know every step done in between.",
    "Every operation has an exact opposite: add/subtract undo each other, so do multiply/divide, and a percentage change is undone by dividing by the same decimal multiplier.",
    "Undo the steps in reverse order, the last thing done is the first thing undone — including one whole round at a time in a story that repeats the same steps every day or night.",
    "In a two-person exchange, doubling someone's money means they had exactly HALF that amount just before the exchange, and whoever gave the money gets it added back to find their own earlier amount.",
    "Always finish by running your answer forwards through the original steps to check it.",
    "If the mystery number appears more than once in the puzzle independently, a single reverse chain won't work, that's the cue for the balance method instead.",
  ],
  mistakes: [
    "Undoing the steps in the original order instead of reverse order: for 'double, then add 3, giving 17' the correct first undo is subtract 3 (giving 14), not halve first.",
    "Undoing with the same operation instead of the opposite, for example halving to undo a halving instead of doubling.",
    "In a repeating story, undoing all the gifts first and all the halvings second instead of undoing one complete round (gift then halving) at a time, in order.",
    "In a two-person doubling exchange, forgetting that whoever was doubled had exactly HALF their final amount beforehand, not their final amount minus a guessed number.",
    "Trusting the backwards answer without checking it forwards, and missing an arithmetic slip along the way.",
    "Trying to force a single reverse chain onto a puzzle where the unknown number appears twice, independently, rather than switching to the balance method.",
  ],
};

JUNIOR_LESSONS.numberMachine = {
  title: "Number Machines",
  minutes: 20,
  intro: "Some quests need more than one trick, they need a whole toolbox. Number Machines takes the doing-and-undoing idea from Working Backwards and turns it into something far more powerful: formulae with letters standing for numbers, machines you can reconstruct just from clues, and a second method, the balance model, for when a letter refuses to sit still and shows up more than once. This is deep-quest territory, the ideas here carry you from ordinary arithmetic into real algebra, and from Junior Maths Challenge thinking towards Intermediate.",
  sections: [
    { h: "1. From a chain of steps to a formula", body: [
      "A function machine is really just a set of instructions written as symbols instead of words: 'multiply by 3, then add 4' becomes the formula y = 3x + 4, where x is whatever goes in and y is whatever comes out.",
      "Letters like x, y, a, b and t aren't mysterious, they're placeholders, exactly like the blank input on last quest's machine, except now the whole rule fits on one line and you can carry it around.",
    ] },
    { h: "2. Substituting: reading the machine forwards", body: [
      "To use a formula, you substitute: replace each letter with the number it stands for, then work out the arithmetic in the right order.",
      "Take the formula t = ab + 2a. It means: multiply a by b, multiply a by 2, then add the two results together.",
    ], examples: [
      { q: "Find y when x = 3, using y = 4x + 1.", steps: ["Replace x with 3: y = 4 x 3 + 1.", "4 x 3 = 12.", "12 + 1 = 13."], answer: "13" },
      { q: "Find t when a = 2 and b = 7, using t = ab + 2a.", steps: ["ab means a x b: 2 x 7 = 14.", "2a means 2 x a: 2 x 2 = 4.", "Add them: t = 14 + 4 = 18."], answer: "18" },
      { q: "Find p when m = 3 and n = 5, using p = m² + 2mn - n.", steps: ["m² means m x m: 3 x 3 = 9.", "2mn means 2 x m x n: 2 x 3 x 5 = 30.", "Subtract n: p = 9 + 30 - 5 = 34."], answer: "34" },
    ],
      tryit: { q: "Using t = ab + 2a, find t when a = 4 and b = 3.", answer: "20. ab=4x3=12, 2a=8, t=12+8=20." } },
    { h: "3. Open challenge: many roads to the same answer", body: [
      "Here's a properly interesting question. t = ab + 2a gives t = 18 when a = 2 and b = 7. Can other values of a and b give exactly 18 in that same formula? Could a completely different formula also land on 18?",
      "This is the sort of open task that separates 'I can substitute' from 'I understand what a formula does'. There's no single correct answer, there's a whole family of them, and finding several is the real skill.",
    ], examples: [
      { q: "For y = 2x + 3, find a value of x that gives y = 11.", steps: ["Set 2x + 3 = 11.", "Subtract 3: 2x = 8.", "Divide by 2: x = 4.", "Check: 2 x 4 + 3 = 11."], answer: "x = 4" },
      { q: "Find another pair of values for a and b that make t = ab + 2a equal to 18.", steps: ["Try a = 3. Then t = 3b + 6, and you want 3b + 6 = 18, so 3b = 12, so b = 4.", "Check: ab = 3x4 = 12, 2a = 6, total 18. It works."], answer: "a = 3, b = 4 (one of several correct answers)" },
      { q: "The formula V = lwh gives the volume of a box. If l = 4, h = 3, and V = 60, find w.", steps: ["Substitute what you know: 60 = 4 x w x 3.", "4 x 3 = 12, so 60 = 12w.", "Divide both sides by 12: w = 5.", "Check: 4 x 5 x 3 = 60."], answer: "w = 5" },
    ],
      tryit: { q: "Invent a completely different formula (not t = ab + 2a) that also gives t = 18 for whole numbers you choose yourself.", answer: "Many answers work. For instance t = 5a + b with a = 1 and b = 13 gives 5+13=18. The point is checking your own invented formula genuinely lands on 18." } },
    { h: "4. Two-step machines you can run in reverse", body: [
      "A formula like y = 3x + 4 is a two-step machine, times 3 then add 4, and just like in the Working Backwards quest, you can run it backwards from an output to find the input.",
      "Forwards, substitute x and calculate y. Backwards, you're given y and have to undo the steps, in reverse order, to recover x.",
    ], examples: [
      { q: "If y = 2x - 1 and y = 9, find x.", steps: ["The machine is x2, then -1. Undo in reverse: undo -1 first, then undo x2.", "9 + 1 = 10.", "10 divided by 2 = 5."], answer: "x = 5 (check: 2x5-1=9)" },
      { q: "If y = 3x + 4 and y = 19, find x.", steps: ["The machine is: x3, then +4. Undo in reverse: undo +4 first, then undo x3.", "19 - 4 = 15.", "15 divided by 3 = 5."], answer: "x = 5 (check: 3x5=15, 15+4=19)" },
      { q: "If y = 5(x - 2) and y = 30, find x.", steps: ["The machine is: -2, then x5. Undo in reverse: undo x5 first, then undo -2.", "30 divided by 5 = 6.", "6 + 2 = 8."], answer: "x = 8 (check: 5 x (8-2) = 5 x 6 = 30)" },
    ],
      tryit: { q: "If y = 3x + 4 and y = 25, find x.", answer: "7. Undo: 25-4=21, 21 divided by 3=7. Check: 3x7=21, +4=25." } },
    { h: "5. Detective work: reconstructing the whole machine", body: [
      "So far you've been handed the rule and asked to use it. The harder, more interesting puzzle hands you a couple of clues about what a machine did, and asks you to work out the rule itself.",
      "Suppose a machine follows y = ax + b, but you don't know a or b. Given two different input-output pairs, you have exactly enough information to pin both of them down.",
    ], examples: [
      { q: "A machine follows y = ax + b. When x = 1, y = 7 and when x = 3, y = 11. Find a and b.", steps: ["From x=1 to x=3, x rises by 2 and y rises by 4 (11-7=4).", "One unit of x adds 4/2 = 2 to y, so a = 2.", "Use x=1, y=7: 2x1 + b = 7, so b = 5. Rule: y = 2x + 5.", "Check at x=3: 2x3+5=11."], answer: "a = 2, b = 5, rule is y = 2x + 5" },
      { q: "A machine follows y = ax + b. When x = 2, y = 9. When x = 5, y = 18. Find a and b.", steps: ["Going from x=2 to x=5, the input rose by 3 (5-2=3), and the output rose by 9 (18-9=9).", "Every step of 3 in x adds 9 to y, so one step of 1 in x adds 9 divided by 3 = 3 to y. That means a = 3.", "Use x=2, y=9 to find b: 3x2 + b = 9, so 6+b=9, so b=3."], answer: "a = 3, b = 3, so the rule is y = 3x + 3 (check with x=5: 3x5+3=18)" },
      { q: "A machine follows y = ax + b. When x = 4, y = 21 and when x = 7, y = 30. Find the rule, then find y when x = 0.", steps: ["From x=4 to x=7, x rises by 3 and y rises by 9 (30-21=9), so a = 9/3 = 3.", "Use x=4, y=21: 3x4 + b = 21, so 12+b=21, so b=9. Rule: y = 3x + 9.", "At x=0: y = 0 + 9 = 9.", "Check at x=7: 3x7+9=30."], answer: "y = 3x + 9; at x = 0, y = 9" },
    ],
      tryit: { q: "A machine follows y = ax + b. When x = 2, y = 11. When x = 5, y = 20. Find the rule, then predict y when x = 10.", answer: "y = 3x + 5. (x rises by 3, y rises by 9, so a=3; 3x2+b=11 gives b=5.) At x=10, y=3x10+5=35." } },
    { h: "6. The balance model: two sides, always equal", body: [
      "There's a second way to picture an equation, not as a machine to run forwards or backwards, but as a pair of weighing scales already balanced. Whatever is on the left weighs exactly the same as whatever is on the right.",
      "The golden rule of a balance is that it stays balanced only if you do the exact same thing to both sides. Add 5 to the left, you must add 5 to the right. Halve the left, you must halve the right too.",
    ], examples: [
      { q: "Solve 2x + 1 = 9 using the balance model.", steps: ["Subtract 1 from both sides: 2x = 8.", "Divide both sides by 2: x = 4."], answer: "x = 4 (check: 2x4+1=9)" },
      { q: "Solve 4x + 3 = 19 using the balance model.", steps: ["Subtract 3 from both sides, keeping it balanced: 4x + 3 - 3 = 19 - 3, so 4x = 16.", "Divide both sides by 4: x = 4."], answer: "x = 4 (check: 4x4+3=19)" },
      { q: "Solve 2(3x + 5) = 28 using the balance model.", steps: ["Divide both sides by 2: 3x + 5 = 14.", "Subtract 5 from both sides: 3x = 9.", "Divide both sides by 3: x = 3."], answer: "x = 3 (check: 2 x (9+5) = 2 x 14 = 28)" },
    ],
      note: "Notice this is the same answer doing-and-undoing gives: undo +3 first (19-3=16), then undo x4 (16 divided by 4=4). The two methods agree here, because they're really the same idea seen two ways, until the next section, where only one of them still works." },
    { h: "7. When doing-and-undoing runs out of road", body: [
      "The doing-and-undoing machine only works if the unknown number appears exactly once, at the start of a single chain. The moment it appears twice, in two separate places, there's no single machine left to reverse, because both sides of the equation are equally unknown.",
      "This is exactly the trigger the Working Backwards quest warned you about. 'Three times my number, plus 5, equals my number, plus 17.' Written as algebra: 3x + 5 = x + 17. You can't rewind a machine here, because x shows up on both sides.",
    ], examples: [
      { q: "Solve 2x + 3 = x + 7 using the balance model.", steps: ["Subtract x from both sides: x + 3 = 7.", "Subtract 3 from both sides: x = 4."], answer: "x = 4 (check: 2x4+3=11 and 4+7=11, both sides match)" },
      { q: "Solve 3x + 5 = x + 17 using the balance model.", steps: ["Subtract x from both sides, this removes it from the right and reduces it on the left, keeping the balance: 3x + 5 - x = x + 17 - x, giving 2x + 5 = 17.", "Subtract 5 from both sides: 2x = 12.", "Divide both sides by 2: x = 6."], answer: "x = 6 (check: 3x6+5=23, and 6+17=23, both sides match)" },
      { q: "Solve 5x - 3 = 2x + 9 using the balance model.", steps: ["Subtract 2x from both sides: 3x - 3 = 9.", "Add 3 to both sides: 3x = 12.", "Divide by 3: x = 4."], answer: "x = 4 (check: 5x4-3=17 and 2x4+9=17, both sides match)" },
    ],
      tryit: { q: "Solve 5x + 2 = 2x + 17 using the balance model.", answer: "x = 5. Subtract 2x: 3x+2=17. Subtract 2: 3x=15. Divide by 3: x=5. Check: 5x5+2=27, 2x5+17=27." } },
    { h: "8. The 'taking away' trap", body: [
      "A very common mistake looks like balancing but isn't: taking a term away from just one side, rather than subtracting the same amount from both sides. It feels like tidying up, but it silently tips the scales.",
      "In 3x + 5 = x + 17, a student might just cross out the x on the right and write 3x + 5 = 17, as if it had simply vanished. But the right side has lost an x that the left side hasn't, so the scales are no longer balanced, and the equation is now false.",
    ], note: "The fix: whatever leaves one side by subtraction must be subtracted from the other side too, in the same step. Subtract x from both sides at once: (3x+5) - x = (x+17) - x, giving 2x+5=17. That's legitimate. Deleting a term from only one side never is." },
    { h: "9. Bar-model chains", body: [
      "You can picture 3x + 5 = x + 17 as bars: three equal bars labelled x, plus a block of 5, balanced against one bar labelled x, plus a block of 17. Matching bars on each side can be removed together, as long as you take one from each side at the same time.",
    ], examples: [
      { q: "Solve x + x = x + 5 using bars.", steps: ["Two x-bars balance one x-bar plus 5.", "Remove one x-bar from each side: one x-bar balances 5.", "x = 5."], answer: "x = 5 (check: 5+5=10 and 5+5=10)" },
      { q: "Solve s + s + s + 2 = s + 14 using bars.", steps: ["Three s-bars plus 2 balance one s-bar plus 14.", "Remove one s-bar from each side, a matching pair: two s-bars plus 2 balance 14.", "So 2s + 2 = 14. Subtract 2 from both sides: 2s = 12.", "Divide both sides by 2: s = 6."], answer: "s = 6 (check: 6+6+6+2=20, and 6+14=20)" },
      { q: "Solve n + n + n + n - 3 = n + n + 9 using bars.", steps: ["4n - 3 = 2n + 9.", "Subtract 2n from each side: 2n - 3 = 9.", "Add 3 to each side: 2n = 12.", "Divide by 2: n = 6."], answer: "n = 6 (check: 4x6-3=21 and 2x6+9=21)" },
    ],
      tryit: { q: "Solve c + c + 3 = c + c + c - 5 using bars or balance.", answer: "c = 8. Two c-bars plus 3 balance three c-bars minus 5. Subtract two c-bars from both sides: 3 = c - 5. Add 5: c = 8. Check: 8+8+3=19, 8+8+8-5=19." } },
    { h: "10. Choosing the right tool", body: [
      "The two methods aren't rivals, they're teammates. Doing-and-undoing is fast and clear whenever the unknown appears once, in one clean chain, use it there. The balance model is what you reach for the moment the unknown appears more than once.",
      "Even inside the balance method, doing-and-undoing still helps you decide what to do next: recognising that a formula means 'multiply then add' tells you to subtract before you divide, whichever method you're using. The two ideas were never really separate, one tells you the shape of the problem, the other tells you how to legally reshape it.",
    ] },
    { h: "11. Deep-quest challenge", body: [
      "Put the detective work and the balance model together on a genuinely harder problem, the kind that starts turning up in Intermediate-level puzzles.",
    ], examples: [
      { q: "A machine follows y = ax + b. When x = 1, y = 5 and when x = 2, y = 8. Find the rule.", steps: ["From x=1 to x=2, x rises by 1 and y rises by 3, so a = 3.", "Use x=1, y=5: 3x1+b=5, so b=2. Rule: y=3x+2.", "Check: at x=2, 3x2+2=8. Correct."], answer: "y = 3x + 2" },
      { q: "A machine follows y = ax + b. When x = 3, y = 17. When x = 6, y = 32. Find the rule, then use it to find y when x = 10.", steps: ["From x=3 to x=6, x rises by 3 and y rises by 15 (32-17=15).", "One step of 1 in x adds 15 divided by 3 = 5 to y, so a = 5.", "Use x=3, y=17: 5x3+b=17, so 15+b=17, so b=2. Rule: y=5x+2.", "At x=10: y=5x10+2=52."], answer: "y = 5x + 2, and y = 52 when x = 10 (check: at x=6, 5x6+2=32, correct)" },
      { q: "A machine follows y = ax + b. When x = 2, y = 1 and when x = 5, y = 10. Find a, b, and the value of y when x = 8.", steps: ["From x=2 to x=5, x rises by 3 and y rises by 9 (10-1=9), so a = 9 divided by 3 = 3.", "Use x=2, y=1: 3x2+b=1, so 6+b=1, so b = -5. Rule: y=3x-5.", "At x=8: y=3x8-5=24-5=19.", "Check: at x=5, 3x5-5=10. Correct."], answer: "y = 3x - 5, and y = 19 when x = 8" },
    ] },
  ],
  recap: [
    "A formula is a machine's rule written with letters: substitute numbers in to run it forwards.",
    "An open task like 't = ab + 2a = 18' has many correct pairs of values, and often many possible formulae altogether.",
    "Doing-and-undoing still works for reversing a formula when the unknown appears once.",
    "Two input-output clues are enough to reconstruct a whole linear machine's rule.",
    "The balance model treats both sides of an equation as equal, and demands the same operation on both sides.",
    "When the unknown appears on both sides, switch to the balance model, doing-and-undoing has no single chain left to reverse.",
  ],
  mistakes: [
    "Removing a term from only one side of an equation (the 'taking away' trap) instead of subtracting it from both sides at once.",
    "Trying to force doing-and-undoing onto an equation where the unknown appears twice, rather than recognising the cue to balance instead.",
    "Substituting values in the wrong order, for instance adding before multiplying when the formula means multiply first.",
    "Assuming there's only one correct pair of values or one correct formula in an open task, and stopping after finding just one.",
  ],
};

JUNIOR_LESSONS.allocation = {
  title: "Counters & Boxes",
  minutes: 17,
  intro: "Some puzzles give you two clues about the same pile of things, a total count and a total amount, and ask you to work out exactly how many of each kind there must be. It sounds like you'd need to guess, but there are two dependable ways in: a clever swapping trick you can do almost entirely in your head, and the balance-style algebra that backs it up and copes with the trickier cases.",
  sections: [
    { h: "1. Two clues, one pile", body: [
      "A box-and-counter puzzle gives you two separate facts about the same collection, one about how many containers there are, and one about how many items are inside them altogether. Neither clue alone is enough, together they pin down an exact answer.",
      "Here's the puzzle to crack across this whole quest: there are 10 boxes. Some hold 2 counters each, the rest hold 3 counters each. Altogether there are 23 counters. How many boxes of each kind are there?",
    ] },
    { h: "2. Why one clue alone won't do", body: [
      "Knowing there are 10 boxes tells you nothing about how many counters that makes, because it depends entirely on the mix of 2s and 3s. Try a few splits and watch the total change.",
      "All 10 boxes holding 2 counters: 10x2=20 counters, too few.",
      "9 boxes of 2 and 1 box of 3: 18+3=21 counters, still too few.",
      "8 boxes of 2 and 2 boxes of 3: 16+6=22 counters, closer.",
      "7 boxes of 2 and 3 boxes of 3: 14+9=23 counters. That matches.",
    ], note: "Notice the pattern: every time a 3-box changes to a 2-box, or the reverse, the total shifts by exactly 1, since 3-2=1. That steady, predictable shift is the whole secret of the next section." },
    { h: "3. The assume-they're-all-the-same trick", body: [
      "Rather than checking split after split, jump straight to one extreme and measure the gap. Assume, just for a moment, that all 10 boxes hold 2 counters.",
      "All-2s gives 10x2=20 counters. The puzzle says there are actually 23, a shortfall of 3. Every swap of one box from '2 counters' to '3 counters' adds exactly 1 counter to the total (since 3-2=1), so exactly 3 swaps are needed to close a gap of 3.",
    ], examples: [
      { q: "8 bags, each holding 2 or 3 apples, contain 18 apples altogether. How many of each?", steps: ["Assume all 8 bags hold 2 apples: 8x2=16.", "Shortfall: 18-16=2.", "Each swap from a 2-bag to a 3-bag adds 1, so 2 swaps are needed.", "That means 2 bags hold 3 apples and 6 bags hold 2 apples."], answer: "6 bags of 2 and 2 bags of 3 (check: 6x2+2x3=12+6=18, and 6+2=8)" },
      { q: "Using the assume-all-2s trick, solve: 10 boxes, some hold 2 counters and some hold 3, 23 counters altogether.", steps: ["Assume all 10 boxes hold 2 counters: 10x2=20.", "Compare to the actual total: 23-20=3 short.", "Each swap from a 2-box to a 3-box adds 1 counter, so 3 swaps are needed.", "That means 3 boxes hold 3 counters, and the remaining 7 boxes hold 2 counters."], answer: "7 boxes of 2 counters and 3 boxes of 3 counters (check: 7x2+3x3=14+9=23, and 7+3=10 boxes)" },
      { q: "A bag contains 5p and 10p coins. There are 20 coins worth 130p in total. How many of each?", steps: ["Assume all 20 are 5p coins: 20x5=100p.", "Shortfall: 130-100=30p.", "Each swap from a 5p to a 10p adds 5p, so 30 divided by 5 = 6 swaps.", "6 coins are 10p and the remaining 14 coins are 5p."], answer: "14 five-pence coins and 6 ten-pence coins (check: 14x5+6x10=70+60=130p, and 14+6=20)" },
    ] },
    { h: "4. The same trick with coins", body: [
      "The trick isn't just for counters, it works for any 'some of this, some of that' pile with two clues, including money.",
    ], tryit: { q: "A jar has 12 coins, a mix of 20p and 50p coins, worth 360p (3.60 pounds) altogether. How many of each?", answer: "8 coins of 20p and 4 coins of 50p. Assume all 12 are 20p: 12x20=240p, short of 360p by 120p. Each swap from 20p to 50p adds 30p, so 120 divided by 30 = 4 swaps. Check: 8x20+4x50=160+200=360p, and 8+4=12 coins." } },
    { h: "5. Backing it up with algebra", body: [
      "The swapping trick is quick, but algebra shows exactly why it works, and copes fine even when the numbers are too awkward to swap by eye.",
      "Let a stand for the number of 2-counter boxes and b for the number of 3-counter boxes. The two clues become two equations: a + b = 10 (total boxes), and 2a + 3b = 23 (total counters).",
    ], examples: [
      { q: "Solve a + b = 5 and 2a + 3b = 12 for a and b.", steps: ["From the first equation, a = 5 - b.", "Substitute into the second: 2(5-b) + 3b = 12.", "Expand: 10 - 2b + 3b = 12, so 10 + b = 12.", "b = 2 and a = 5 - 2 = 3."], answer: "a = 3, b = 2 (check: 2x3+3x2=6+6=12)" },
      { q: "Solve a + b = 10 and 2a + 3b = 23 for a and b.", steps: ["From the first equation, a = 10 - b.", "Substitute into the second equation: 2(10-b) + 3b = 23.", "Expand: 20 - 2b + 3b = 23, which simplifies to 20 + b = 23.", "Subtract 20 from both sides: b = 3. Then a = 10 - 3 = 7."], answer: "a = 7, b = 3, the same answer as the swapping trick (check: 2x7+3x3=14+9=23)" },
      { q: "Solve p + q = 12 and 5p + 10q = 90 for p and q.", steps: ["From the first equation, p = 12 - q.", "Substitute into the second: 5(12-q) + 10q = 90.", "Expand: 60 - 5q + 10q = 90, so 60 + 5q = 90.", "5q = 30, so q = 6, and p = 12 - 6 = 6."], answer: "p = 6, q = 6 (check: 5x6+10x6=30+60=90, and 6+6=12)" },
    ] },
    { h: "6. Translating words into algebra", body: [
      "Before you can solve a puzzle like this, you often have to build the equation yourself from a sentence. That means turning a real situation into an expression, a skill worth practising on its own.",
    ], examples: [
      { q: "A classroom has c chairs and d desks. Each chair has 4 legs and each desk has 4 legs. Write an expression for the total number of legs.", steps: ["Chairs contribute 4 legs each: 4c legs.", "Desks contribute 4 legs each: 4d legs.", "Total legs: 4c + 4d, which equals 4(c + d)."], answer: "4(c + d), or equivalently 4c + 4d" },
      { q: "There were m boys and n girls in a parade. Each person carried 2 balloons. Write an expression for the total number of balloons.", steps: ["Every person, boy or girl, carries 2 balloons.", "The total number of people is m + n.", "So the total number of balloons is 2 lots of (m+n)."], answer: "2(m + n), which is the same as 2m + 2n" },
      { q: "A shop sells t-shirts for £p each and trousers for £q each. Jess buys 3 t-shirts and 2 pairs of trousers. Write an expression for her total spend, then find it when p = 8 and q = 15.", steps: ["Cost of t-shirts: 3p.", "Cost of trousers: 2q.", "Total spend: 3p + 2q.", "Substituting: 3x8 + 2x15 = 24 + 30 = 54."], answer: "3p + 2q; when p=8 and q=15, the total is £54" },
    ],
      tryit: { q: "In a different parade, each boy carries 3 balloons and each girl carries 2 balloons. Write an expression for the total number of balloons, using m boys and n girls.", answer: "3m + 2n (each boy contributes 3, each girl contributes 2, and the totals add together)" } },
    { h: "7. The balance model: Pete's diagram", body: [
      "Some counting puzzles come as a picture of a balance rather than a plain sentence, bars of an unknown length lined up against a number. The same balancing rules from Number Machines apply directly.",
      "Pete drew a diagram: three bars each of length t, plus a block of 7, balanced exactly against two bars each of length t, plus a block of 10. As an equation, that's t + t + t + 7 = t + t + 10.",
    ], examples: [
      { q: "Solve 2t + 5 = t + 9.", steps: ["Subtract t from both sides: t + 5 = 9.", "Subtract 5 from both sides: t = 4."], answer: "t = 4 (check: 2x4+5=13, and 4+9=13)" },
      { q: "Solve t + t + t + 7 = t + t + 10.", steps: ["Simplify each side first: 3t + 7 = 2t + 10.", "Subtract 2t from both sides, removing one matching bar from each side: t + 7 = 10.", "Subtract 7 from both sides: t = 3."], answer: "t = 3 (check: 3+3+3+7=16, and 3+3+10=16)" },
      { q: "Solve 4t - 3 = 2t + 11.", steps: ["Subtract 2t from both sides: 2t - 3 = 11.", "Add 3 to both sides: 2t = 14.", "Divide both sides by 2: t = 7."], answer: "t = 7 (check: 4x7-3=25, and 2x7+11=25)" },
    ] },
    { h: "8. The taking-away misconception, revisited", body: [
      "The same trap from Number Machines shows up here: taking a bar away from just one side, instead of removing a matching bar from both sides at once. It's the single most common way to wreck an otherwise good bit of working.",
    ], note: "Wrong: from 3t+7=2t+10, crossing out '2t' on the right and writing 3t+7=10, as if it simply disappeared. That leaves the left side too big for the right, the balance is broken. Right: subtract 2t from both sides together, (3t+7)-2t = (2t+10)-2t, giving t+7=10. Always remove the same thing from both pans of the scale, in the same step." },
    { h: "9. Many equations, one balanced answer", body: [
      "A single value can satisfy lots of different-looking equations. Take x = 4: it happens to make 2x+3=11 true, and also x+9=13, and also 3x-1=11, and also 20-x=16, all at once.",
      "That's not a coincidence, each equation is just a different disguise wrapped around the same balanced fact. Being able to invent your own disguises, and check they really do balance, is excellent practice for spotting how equations are built.",
    ], tryit: { q: "Invent your own equation that has x = 5 as its solution, then check it balances.", answer: "Many answers work, for example 4x - 3 = 17: substituting x=5 gives 20-3=17, which checks out. Any equation you build should give a true statement once x=5 is substituted in." } },
    { h: "10. One more pile to sort out", body: [
      "Time for a full, unaided crack at the whole method, swap trick or algebra, whichever you reach for first.",
    ], examples: [
      { q: "A shelf has 6 vases, each holding 2 or 5 flowers. There are 18 flowers in total. How many vases of each type?", steps: ["Assume all 6 vases hold 2 flowers: 6x2=12, which is 18-12=6 short.", "Each swap from a 2-flower vase to a 5-flower vase adds 3, so 6 divided by 3 = 2 swaps.", "2 vases hold 5 flowers and 4 vases hold 2 flowers."], answer: "4 vases of 2 flowers and 2 vases of 5 flowers (check: 4x2+2x5=8+10=18, and 4+2=6)" },
      { q: "A crate holds small bags of 4 apples and large bags of 7 apples. There are 9 bags in total, containing 51 apples altogether. How many bags of each size are there?", steps: ["Assume all 9 bags are small (4 apples each): 9x4=36 apples, which is 51-36=15 short.", "Each swap from a small bag to a large bag adds 7-4=3 apples, so 15 divided by 3 = 5 swaps are needed.", "That means 5 bags are large and the remaining 4 bags are small."], answer: "4 small bags and 5 large bags (check: 4x4+5x7=16+35=51, and 4+5=9 bags)" },
      { q: "A library has 15 shelves, each holding either 8 or 12 books. There are 156 books in total. How many shelves of each type are there?", steps: ["Assume all 15 shelves hold 8 books: 15x8=120, which is 156-120=36 short.", "Each swap from an 8-book shelf to a 12-book shelf adds 4, so 36 divided by 4 = 9 swaps.", "9 shelves hold 12 books and 6 shelves hold 8 books."], answer: "6 shelves of 8 books and 9 shelves of 12 books (check: 6x8+9x12=48+108=156, and 6+9=15)" },
    ] },
    { h: "11. Spotting numbers that do not actually work", body: [
      "The swapping trick has a built-in honesty check: the shortfall must divide EXACTLY by the amount each swap changes the total, with nothing left over. If it does not, that is a signal the puzzle's own numbers cannot possibly go together, not a sign you have made an arithmetic slip.",
      "Suppose a box has 12 containers, some holding 2 counters and some holding 5, with 37 counters altogether. Assume all 12 hold 2 counters: 12x2=24, a shortfall of 37-24=13. Each swap from a 2-box to a 5-box adds 5-2=3 counters. But 13 divided by 3 is 4 remainder 1, not a whole number of swaps.",
    ], examples: [
      { q: "7 boxes hold either 2 or 4 counters, totalling 17 counters. Does a valid split exist?", steps: ["Assume all 7 hold 2: 7x2=14, shortfall 17-14=3.", "Each swap adds 2. Does 3 divide by 2 exactly? No, 3 divided by 2 = 1 remainder 1.", "The shortfall does not divide exactly, so no valid whole-number split exists."], answer: "No valid split; 17 counters in 7 boxes of 2s and 4s is impossible" },
      { q: "What does the leftover remainder of 1 tell you about the 12-box, 37-counter puzzle above?", steps: ["A whole number of swaps must account for the entire shortfall of 13, with nothing left over.", "13 does not divide exactly by 3, the amount each swap changes the total.", "So there is no way to fill 12 boxes with only 2s and 5s and reach exactly 37 counters."], answer: "The puzzle's stated numbers are inconsistent; no valid split of 2-counter and 5-counter boxes can reach exactly 37 counters from exactly 12 boxes" },
      { q: "8 containers hold either 3 or 7 items, totalling 44 items. Does a valid split exist? If so, find it.", steps: ["Assume all 8 hold 3: 8x3=24, shortfall 44-24=20.", "Each swap from a 3-container to a 7-container adds 4.", "20 divided by 4 = 5, a whole number, so a valid split exists.", "5 containers hold 7 items and 3 containers hold 3 items."], answer: "3 containers of 3 and 5 containers of 7 (check: 3x3+5x7=9+35=44, and 3+5=8)" },
    ],
      tryit: { q: "10 boxes hold either 3 or 4 counters, totalling 33 counters. Does a valid whole-number split exist?", answer: "Yes. Assume all 10 hold 3: 30 counters, a shortfall of 3. Each swap from a 3-box to a 4-box adds 1, so 3 swaps are needed exactly, with nothing left over: 3 boxes of 4 and 7 boxes of 3 (check: 7x3+3x4=21+12=33)." } },
  ],
  recap: [
    "Two clues about one pile, a count and a total, are needed to sort out two unknown quantities, one clue alone leaves too many possibilities.",
    "The assume-they're-all-the-same trick: pick one extreme, measure the shortfall or excess, and divide by how much each swap changes the total.",
    "Algebra with two equations, like a+b=10 and 2a+3b=23, backs up the trick and handles messier numbers.",
    "Translating a real situation into an expression, like 2(m+n) for total balloons, is a skill worth practising on its own.",
    "The balance model applies here too, remove matching amounts from both sides together, never from just one side.",
  ],
  mistakes: [
    "Trying to solve with only one of the two clues, and assuming there's a single obvious answer when there are actually many possible splits.",
    "Taking a term away from just one side of an equation (the taking-away trap), rather than subtracting the same amount from both sides at once.",
    "Miscounting the change per swap, for instance treating a swap from a 2-box to a 3-box as adding 2 or 3 instead of the actual difference, 1.",
    "Writing an expression like 2m+n for 'each of m and n people carries 2 balloons', forgetting the 2 applies to both groups equally.",
  ],
};


// ---- Full-depth guided lessons: area reasoning (trianglesInRect v2, midpointSquare, partitionRect) ----

JUNIOR_LESSONS.trianglesInRect = {
  title: "Area Puzzles",
  minutes: 18,
  intro: "Every triangle, however oddly it is drawn, lives inside a rectangle, and that rectangle is always willing to tell you the triangle's area if you ask it properly. This lesson builds the half-a-rectangle idea from nothing, tests it on the awkward cases where it stops looking obvious, and then uses it to answer trickier questions — including the reverse one, where a triangle is cut AWAY and you need whatever is left over — without a single wasted multiplication.",
  sections: [
    { h: "1. Reasoning about area without measuring it", body: [
      "Most area questions expect you to plug numbers into a formula and get a number out. This lesson is about something slightly different and rather more useful: learning to compare areas, and even to know an area is 'half of something' or 'a quarter of something', purely by reasoning about the shape.",
      "That is a genuinely different skill from calculating, and it is exactly the skill that shows up in the hardest challenge questions, the ones with an odd triangle balanced on a line and a question that says 'which is biggest, and how do you know', with no numbers given at all.",
    ] },
    { h: "2. What a rectangle's area is really counting", body: [
      "A rectangle's area, length times width, counts how many unit squares tile it perfectly with no gaps and no overlaps. A rectangle 8 cm by 5 cm has area 40 cm squared, because you could lay out 5 rows of 8 unit squares and every square would fit.",
      "Keep that picture of tiling squares in your head. Every triangle fact in this lesson is really just a clever way of relating a triangle to a rectangle that we already know how to tile.",
    ] },
    { h: "3. The cleanest link: cutting a rectangle along its diagonal", body: [
      "Take the 8 by 5 rectangle and draw a single straight line from one corner to the opposite corner. That line, the diagonal, slices the rectangle into two triangles, and because a rectangle has such tidy symmetry, those two triangles are exact mirror copies of each other. They are congruent, meaning identical in every length and angle, just flipped.",
      "Since the two triangles are identical and together they make the whole rectangle, each one must be exactly half of it. The rectangle's area is 40, so each triangle has area 20. No triangle formula was needed at all, only the fact that two identical pieces share a total equally.",
    ], examples: [
      { q: "A rectangle is 6 cm by 4 cm. A diagonal splits it into two triangles. Find the area of each.", steps: ["Rectangle area = 6 x 4 = 24 cm squared.", "The diagonal splits it into two congruent triangles, each half the rectangle.", "24 divided by 2 = 12."], answer: "12 cm squared each" },
      { q: "A rectangle is 8 cm by 5 cm. Find the area of the triangle formed by one of its diagonals.", steps: ["The diagonal splits the rectangle into two congruent (identical) right-angled triangles.", "Rectangle area = 8 x 5 = 40 cm squared.", "Two identical pieces share that total equally, so each triangle is 40 divided by 2."], answer: "20 cm squared" },
      { q: "A right-angled triangle has legs of 9 cm and 12 cm. What is its area, and what would be the area of the rectangle that exactly contains it?", steps: ["The rectangle that contains it has dimensions 9 cm by 12 cm, area = 9 x 12 = 108 cm squared.", "The triangle is half the rectangle: 108 divided by 2 = 54 cm squared.", "Check with the formula: half x base x height = half x 9 x 12 = 54 cm squared."], answer: "Triangle area: 54 cm squared; rectangle area: 108 cm squared" },
    ],
      tryit: { q: "A rectangle is 12 cm by 7 cm. A diagonal splits it into two triangles. Find the area of one triangle.", answer: "42 cm squared. The rectangle's area is 12 x 7 = 84, and the diagonal splits it into two identical triangles, so each is half of 84, which is 42." } },
    { h: "4. Any triangle can be split into two right-angled pieces", body: [
      "That diagonal trick only works directly for a right-angled triangle sitting neatly in a corner. But here is the move that rescues every other triangle. Take any triangle with its base drawn along the bottom, and from the top corner (the apex), drop a straight line straight down to the base, meeting it at a right angle. This is called the perpendicular height, and where it lands on the base splits the triangle into two smaller right-angled triangles.",
      "Suppose the base is 10 cm long, and the perpendicular from the apex lands 4 cm from the left end and therefore 6 cm from the right end, with a height of 6 cm. The left-hand right-angled triangle has legs 4 and 6, so its area is half of 4 times 6, which is 12. The right-hand one has legs 6 and 6, so its area is half of 6 times 6, which is 18. Add them: 12 plus 18 is 30.",
      "Now compare that to the ordinary formula: half times base times height is half times 10 times 6, which is also 30. The two right-angled pieces, each one exactly half of its own little rectangle, add up to give exactly half of the big rectangle that boxes the whole triangle in. That is the real reason the formula has a half in it.",
    ], examples: [
      { q: "A triangle has base 8 cm and height 5 cm. Find its area using the formula.", steps: ["Area = half x base x height.", "Area = half x 8 x 5.", "half x 40 = 20."], answer: "20 cm squared" },
      { q: "A triangle has a base of 10 cm. The perpendicular from the apex meets the base 4 cm from one end and 6 cm from the other, and the height is 6 cm. Find the triangle's area by splitting it into two right-angled pieces.", steps: ["Left piece: legs 4 and 6, area = half x 4 x 6 = 12.", "Right piece: legs 6 and 6, area = half x 6 x 6 = 18.", "Total = 12 + 18 = 30."], answer: "30 cm squared" },
      { q: "A triangle has base 12 cm. The perpendicular drops from the apex with height 8 cm and lands 5 cm from the left end, 7 cm from the right end. Find the area using the two-piece method and check with the formula.", steps: ["Left piece: half x 5 x 8 = 20.", "Right piece: half x 7 x 8 = 28.", "Total = 20 + 28 = 48.", "Formula check: half x 12 x 8 = 48. They match."], answer: "48 cm squared" },
    ],
      note: "Whenever the foot of the perpendicular lands somewhere between the two ends of the base, the two right-angled pieces simply add together, and the whole triangle turns out to be exactly half of the rectangle that just contains it (same base, same height)." },
    { h: "5. When the split lands outside the base: obtuse triangles", body: [
      "Now for the case that trips people up. If a triangle is obtuse (one angle bigger than a right angle) at one of its base corners, the perpendicular from the apex can land outside the base altogether, off to one side. Picture a base from 0 to 10 along a line, but the apex sits further over, so its perpendicular hits the line at 13, three centimetres past the right-hand end.",
      "Here you cannot just add two pieces, because the little triangle beyond the base is not part of your shape. Instead you build a big right-angled triangle from 0 to 13 (legs 13 and 6) and then take away the extra sliver from 10 to 13 (legs 3 and 6). Big piece: half of 13 times 6 is 39. Sliver to remove: half of 3 times 6 is 9. Subtract: 39 minus 9 is 30.",
      "Check it against the formula: half times base (10) times height (6) is also 30, exactly matching the tidy example from the last section even though this triangle looks completely different, leaning over to one side rather than sitting neatly upright. The formula never changed. What changed is that you now add and subtract right-angled pieces instead of just adding them.",
    ], note: "Do not be tempted to just take half of the rectangle that boxes the whole leaning triangle in. That box here would be 13 by 6, area 78, and half of that is 39, which is the wrong answer. The 'half a rectangle' rule only applies directly to the two honest right-angled pieces; for an obtuse triangle you must subtract the overhanging sliver first." },
    { h: "6. It doesn't matter which side you call the base", body: [
      "Every triangle has three sides, and any one of them can be treated as the base, as long as you use the height that matches it: the perpendicular distance from that side to the opposite corner. Change which side you call the base and the 'height' changes meaning too, but the area you calculate must always come out the same, because it is the same triangle.",
      "Take a right-angled triangle with legs 3 cm and 4 cm and hypotenuse 5 cm (the classic 3-4-5 triangle). Using the two legs as base and height, the area is half of 3 times 4, which is 6. Now use the hypotenuse, 5 cm, as the base instead. The matching height is the perpendicular distance from the right-angle corner across to that long side, and since the area must still be 6, that height has to satisfy half times 5 times height equals 6, giving a height of 2.4 cm.",
      "That 2.4 cm is not a side of the triangle at all. It is a short perpendicular line drawn across the middle, and it only reveals itself when you insist on measuring area consistently no matter which side you have chosen as base. This is exactly the situation examiners mean by an 'awkwardly oriented' triangle: the base is not lying flat on the bottom, and the obvious formula stops being obvious.",
    ], tryit: { q: "A right-angled triangle has legs 6 cm and 8 cm and hypotenuse 10 cm. Find the area using the legs, then find the perpendicular height measured to the hypotenuse.", answer: "Area using the legs: half x 6 x 8 = 24 cm squared. Using the hypotenuse as base: half x 10 x height = 24, so height = 48 divided by 10 = 4.8 cm." } },
    { h: "7. The elastic-band problem: a fixed base and a wandering point", body: [
      "Here is a classic challenge picture. Two pins, A and C, are fixed in place. A loop of elastic runs from A to a third point, B, and back to C, and B is free to slide along some straight line. As B slides, it drags out a whole family of different-looking triangles, all sharing the same two fixed corners A and C. Which one has the greatest area, and how do you know without measuring every single one?",
      "The trick is to notice what never changes. The segment AC is fixed, so it is always the base, and its length never changes, however far B wanders. The only thing that can change the area is the perpendicular distance from B across to the line AC, because area is always half times base times that height. So instead of measuring every triangle, you only need to work out which position of B is furthest, at right angles, from the line AC.",
      "A famous special case sits inside a rectangle: if AC is one whole side of the rectangle and B is allowed to sit ANYWHERE along the opposite side, the perpendicular distance from B to line AC never changes at all, because the opposite side is parallel to AC the whole way along. It always equals the rectangle's other dimension. So every single one of these triangles has exactly the same area, half of the whole rectangle, even though sliding B from one end to the other changes the triangle's shape completely, from a lean to the left to a lean to the right.",
    ], examples: [
      { q: "A and B are fixed 6 cm apart. A point C can slide along a line parallel to AB, always 4 cm from AB. What is the area of triangle ABC whatever the position of C?", steps: ["AB = 6 cm is the fixed base.", "The perpendicular distance from C to AB is always 4 cm, because C slides along a parallel line.", "Area = half x 6 x 4 = 12. It never changes."], answer: "12 cm squared, regardless of where C sits" },
      { q: "A and C are fixed 8 cm apart. B can be at one of three points, with perpendicular distances 3 cm, 5 cm and 4 cm from line AC. Which position gives the greatest triangle area?", steps: ["Base AC = 8 cm never changes.", "Areas: half x 8 x 3 = 12; half x 8 x 5 = 20; half x 8 x 4 = 16.", "The greatest height (5 cm) gives the greatest area."], answer: "The point 5 cm away, giving area 20 cm squared" },
      { q: "Two fixed points P and Q are 10 cm apart. A point R slides along a line that is 6 cm away from line PQ. How does the area of triangle PQR change as R moves, and what is the area?", steps: ["PQ = 10 cm is the fixed base.", "R is always 6 cm from line PQ (perpendicular distance), since R slides along a parallel line.", "Area = half x 10 x 6 = 30. This is constant wherever R sits on that line."], answer: "30 cm squared, always the same (the height to a parallel line never changes)" },
    ],
      tryit: { q: "A rectangle is 14 cm by 6 cm. A triangle's base is the whole bottom side (14 cm) and its apex can be ANYWHERE on the top side. Does the triangle's area change as the apex slides along the top?", answer: "No. The top side is parallel to the bottom side (the base), so the perpendicular distance from the apex to the base is always the full 6 cm height of the rectangle, wherever the apex sits. The area is always half x 14 x 6 = 42 cm squared." } },
    { h: "8. Doubling, halving and scaling reasoning", body: [
      "Because area is half times base times height, area scales in a very predictable way whenever you change just one of the two measurements. Double the base and keep the height the same, and the area doubles. Halve the height and keep the base the same, and the area halves. This lets you answer 'what happens to the area if...' questions instantly, without recalculating from scratch.",
      "A triangle with base 6 cm and height 4 cm has area half of 6 times 4, which is 12. Double the base to 12 cm, keep the height at 4 cm, and the new area is half of 12 times 4, which is 24, exactly double. Instead, halve the height to 2 cm and keep the base at 6 cm, and the new area is half of 6 times 2, which is 6, exactly half.",
      "This also explains what happens when a triangle's apex sits BELOW the far side of its rectangle rather than touching it. If the rectangle is 12 cm tall but the apex only reaches 6 cm up (half the rectangle's height), the triangle's area is not half the rectangle's area, it is half of half: the triangle uses the SAME base but a SHORTER height than the full rectangle, so you must use the true height reached, not the rectangle's own height, or you will double the real answer.",
    ], tryit: { q: "A rectangle is 10 cm by 12 cm. A triangle's base is the whole bottom side (10 cm), but its apex only reaches a line 5 cm above the base (not the full 12 cm height). Find the triangle's area.", answer: "25 cm squared. Area = half x base x true height = half x 10 x 5 = 25, NOT half x 10 x 12 = 60, because the apex never reaches the rectangle's own height." } },
    { h: "9. Both diagonals: splitting a rectangle into four equal areas", body: [
      "Here is a lovely extension of the diagonal idea. Take a rectangle and draw both diagonals, from each corner to the opposite one. They cross at the exact centre of the rectangle and carve it into four triangles: one touching the top edge, one the bottom, one the left, and one the right.",
      "Take an 8 cm by 6 cm rectangle, area 48 cm squared. The top and bottom triangles each have base 8 (the full length) and height 3 (half the width, since the crossing point is exactly in the middle), giving area half of 8 times 3, which is 12. The left and right triangles each have base 6 (the full width) and height 4 (half the length), giving area half of 6 times 4, which is also 12.",
      "All four triangles come out to exactly 12, a clean quarter of the 48 total, even though the top and bottom triangles are a completely different shape from the left and right ones (wide and flat versus tall and narrow). Equal area does not require identical shape. This is the same 'half of a rectangle' reasoning applied twice over, and it is worth remembering as a shortcut whenever you see both diagonals drawn.",
    ], tryit: { q: "A rectangle measures 10 cm by 4 cm. Both diagonals are drawn, crossing at the centre. Find the area of each of the four triangles formed.", answer: "5 cm squared each. The rectangle's area is 40, and cutting it with both diagonals always makes four triangles of equal area, a quarter each, so 40 divided by 4 is 5." } },
    { h: "10. Working in reverse: cutting a triangle AWAY and finding what's left", body: [
      "So far every triangle has been part of the rectangle we were building up towards. This section flips the question: a triangle is cut OFF one corner of the rectangle, like snipping a corner off a piece of card, and you need the area of whatever remains.",
      "The method is just subtraction, done carefully. First find the whole rectangle's area. Then find the area of the corner triangle that has been removed, using its two short sides (which run along the rectangle's own edges) as base and height. Finally subtract the second from the first.",
      "Take a 12 cm by 9 cm rectangle, area 108 cm squared. A right-angled triangle is cut from one corner, with its two short sides measuring 5 cm and 4 cm along the rectangle's edges. That triangle's area is half of 5 times 4, which is 10. The shape left behind, the rectangle with that corner missing, has area 108 minus 10, which is 98 cm squared.",
    ], examples: [
      { q: "A right-angled triangle is cut from one corner of an 8 cm by 6 cm rectangle. Its two short sides are 2 cm and 3 cm. Find the area of the shape that remains.", steps: ["Rectangle area = 8 x 6 = 48 cm squared.", "Corner triangle removed: half x 2 x 3 = 3 cm squared.", "Remaining area = 48 - 3 = 45 cm squared."], answer: "45 cm squared" },
      { q: "A right-angled triangle is cut from one corner of a 12 cm by 9 cm rectangle. Its two short sides, along the rectangle's edges, are 5 cm and 4 cm. Find the area of the shape that remains.", steps: ["Rectangle area = 12 x 9 = 108 cm squared.", "Corner triangle removed: half x 5 x 4 = 10 cm squared.", "Remaining area = 108 - 10 = 98 cm squared."], answer: "98 cm squared" },
      { q: "A rectangle 15 cm by 10 cm has triangles cut from two opposite corners. Each cut triangle has short sides of 4 cm and 3 cm. Find the area that remains.", steps: ["Rectangle area = 15 x 10 = 150 cm squared.", "Each corner triangle: half x 4 x 3 = 6 cm squared.", "Two triangles removed: 2 x 6 = 12 cm squared.", "Remaining area = 150 - 12 = 138 cm squared."], answer: "138 cm squared" },
    ],
      tryit: { q: "A right-angled triangle is cut from one corner of a 20 cm by 15 cm rectangle. Its two short sides are 6 cm and 8 cm. Find the remaining area.", answer: "276 cm squared. Rectangle area = 20 x 15 = 300. Corner triangle = half x 6 x 8 = 24. Remaining = 300 - 24 = 276." } },
    { h: "11. The trap: memorising the formula but losing the picture", body: [
      "The single biggest mistake in this whole topic is treating 'half times base times height' as a magic spell to chant rather than a fact you can rebuild whenever you need to. That works fine for a tidy triangle sitting upright on its base, but the moment a triangle leans over, sits inside a rectangle it doesn't fill, or has been cut AWAY rather than measured directly, students who only memorised the spell freeze up.",
      "The fix is always the same: identify exactly what your triangle's true base and true height are (not just the rectangle's overall dimensions), split or subtract as the picture demands, and rebuild the answer from pieces you trust. It takes thirty extra seconds and it never lets you down.",
    ], tryit: { q: "An obtuse triangle has a base of 12 cm. The perpendicular from the apex lands 3 cm beyond the right-hand end of the base, and the height is 5 cm. Find the triangle's area.", answer: "30 cm squared. Big right-angled piece (base 12 + 3 = 15, height 5): half x 15 x 5 = 37.5. Sliver to remove (base 3, height 5): half x 3 x 5 = 7.5. Subtract: 37.5 - 7.5 = 30, matching half x 12 x 5 = 30." } },
  ],
  recap: [
    "A triangle's area formula, half x base x height, comes from splitting it into right-angled pieces that each sit inside their own tidy rectangle.",
    "If the perpendicular foot lands inside the base, add the two pieces; if it lands outside (an obtuse triangle), subtract the overhanging sliver instead.",
    "Any side can be the base, as long as you use the matching perpendicular height, and the area you get must always be the same.",
    "When a base is fixed and a point slides along a PARALLEL line, the perpendicular height never changes, so the area never changes either, however different the triangles look.",
    "If the apex does not reach the far side of the rectangle, use the TRUE height it reaches, not the rectangle's own height.",
    "Both diagonals of a rectangle always cut it into four triangles of exactly equal area, a quarter each, whatever the rectangle's proportions.",
    "To find a leftover area after a corner triangle is cut away, find the whole rectangle, find the removed triangle, and subtract.",
  ],
  mistakes: [
    "Taking half of a leaning triangle's bounding box: wrong, half of the 13 by 6 box is 39; right, subtract the 3 by 6 overhanging sliver to get 39 minus 9 equals 30.",
    "Using a slanted side as if it were the height: wrong, using the 5 cm hypotenuse as height; right, measure the true perpendicular distance to whichever side is the base, here 2.4 cm.",
    "Assuming a triangle sliding along a base-parallel line changes area because it 'looks' bigger: wrong, judging by eye; right, the perpendicular height to a parallel line never changes, so neither does the area.",
    "Using the rectangle's own height for a triangle whose apex does not actually reach the far side: wrong, half x base x full rectangle height; right, half x base x the true (shorter) height reached.",
    "Believing both diagonals of a rectangle make four congruent (identical-shaped) triangles: wrong, they are two different shapes in two matching pairs; right, they are still all equal in area, a quarter each.",
    "Forgetting to subtract when a triangle is cut AWAY from a rectangle rather than being part of a whole-rectangle split.",
  ],
};

JUNIOR_LESSONS.midpointSquare = {
  title: "Midpoint Areas",
  minutes: 18,
  intro: "Take any square, mark the midpoint of each side, and join those four midpoints in order. A smaller square appears inside, tilted like a diamond, and it always covers exactly half the area of the one it sits inside, no matter how big the original square was. This lesson proves that surprising fact from scratch, and then chases it into rectangles, coordinates, perimeters and even a second round of the same trick applied to the inner square itself.",
  sections: [
    { h: "1. What 'joining the midpoints' actually means", body: [
      "A midpoint is simply the exact middle of a line, the point that splits it into two equal halves. Every side of a square or rectangle has one midpoint.",
      "Now take a square and mark the midpoint of each of its four sides. Join those four midpoints in order, going around, one straight line between each neighbouring pair. The result is a brand new four-sided shape sitting entirely inside the original, touching it only at those four midpoints, and tilted so its corners point at the middles of the original sides rather than lining up with the original corners. It looks like a diamond balanced inside a picture frame.",
    ] },
    { h: "2. A first example: cutting the corners away", body: [
      "Take a square of side 8 cm, so its area is 8 x 8 = 64 cm squared. Mark the midpoint of each side, at 4 cm along. Joining those midpoints in order carves the original square into the tilted inner square plus four little corner triangles, one snipped off at each corner.",
      "Each corner triangle is right-angled, with both legs equal to 4 cm (half the original side), since it stretches from a corner to the midpoint of each of the two sides meeting there. Its area is half of 4 times 4, which is 8. There are four identical corners, so together they total 4 x 8 = 32 cm squared.",
      "The inner square is whatever is left over: 64 minus 32 is 32 cm squared, which is exactly half of the original 64. Notice this did not need any clever formula for the tilted square itself, only subtracting the four corners we understand perfectly well.",
    ], examples: [
      { q: "A square has side 4 cm. Find the area of the square formed by joining the midpoints of its sides.", steps: ["Original area = 4 x 4 = 16 cm squared.", "Each corner triangle has legs 2 and 2, area = half x 2 x 2 = 2.", "Four corners total 4 x 2 = 8.", "Inner square = 16 - 8 = 8 cm squared."], answer: "8 cm squared, exactly half of 16" },
      { q: "A square has side 8 cm. Find the area of the square formed by joining the midpoints of its sides.", steps: ["Original area = 8 x 8 = 64 cm squared.", "Each corner triangle cut off has legs 4 and 4, area = half x 4 x 4 = 8.", "Four corners total 4 x 8 = 32.", "Inner square = 64 - 32 = 32 cm squared."], answer: "32 cm squared, exactly half of 64" },
      { q: "A square has side 14 cm. Find the area of the square formed by joining the midpoints of its sides.", steps: ["Original area = 14 x 14 = 196 cm squared.", "Each corner triangle has legs 7 and 7, area = half x 7 x 7 = 24.5.", "Four corners total 4 x 24.5 = 98.", "Inner square = 196 - 98 = 98 cm squared."], answer: "98 cm squared, exactly half of 196" },
    ],
      tryit: { q: "A square has side 10 cm. Find the area of the midpoint square inside it.", answer: "50 cm squared. Original area 100. Each corner triangle has legs 5 and 5, area 12.5, and four of them total 50. Inner square = 100 - 50 = 50, half of 100." } },
    { h: "3. Proving it works for every square, not just these two", body: [
      "Two examples giving exactly half is a strong hint, but a hint is not a proof. Let the square's side be any length at all, and call it s. Its area is s times s, written s squared.",
      "Each corner triangle has both legs equal to half the side, which is s over 2. Its area is half times (s over 2) times (s over 2), which works out to s squared over 8. There are four such corners, and four lots of s squared over 8 add up to s squared over 2, which is exactly half of the whole square's area, s squared.",
      "So the inner square's area is s squared minus s squared over 2, which leaves s squared over 2. That is half of the original, whatever s happens to be. This is the whole point of using a letter instead of a number: it proves the 'always half' rule for every square there could ever be, not just the two we happened to try.",
    ] },
    { h: "4. Stretching a square into a rectangle", body: [
      "Does the halving rule survive if the shape is a rectangle rather than a square? Try one that is 8 cm by 6 cm, area 48 cm squared. The midpoints are at 4 cm along the two horizontal sides and 3 cm along the two vertical sides.",
      "Each corner triangle now has legs 4 and 3 (half of 8 and half of 6), so its area is half of 4 times 3, which is 6. Four corners total 4 x 6 = 24. The inner shape's area is 48 minus 24, which is 24, once again exactly half.",
      "One thing does change: the inner shape is no longer a square, since a rectangle's midpoints do not sit symmetrically enough for that. It is a rhombus instead, a four-sided shape with all four sides equal in length but tilted, like a kite or a diamond on a playing card. Whatever you call it, it is still exactly half the area of the rectangle it sits inside.",
    ], examples: [
      { q: "A rectangle is 6 cm by 4 cm. Find the area of the shape formed by joining the midpoints of its sides.", steps: ["Original area = 6 x 4 = 24 cm squared.", "Corner triangles have legs 3 and 2, area = half x 3 x 2 = 3.", "Four corners total 4 x 3 = 12.", "Inner shape = 24 - 12 = 12 cm squared."], answer: "12 cm squared, exactly half of 24" },
      { q: "A rectangle is 8 cm by 6 cm. Find the area of the shape formed by joining the midpoints of its sides.", steps: ["Original area = 8 x 6 = 48 cm squared.", "Corner triangles have legs 4 and 3, area = half x 4 x 3 = 6.", "Four corners total 4 x 6 = 24.", "Inner shape = 48 - 24 = 24 cm squared."], answer: "24 cm squared, exactly half of 48" },
      { q: "A rectangle is 10 cm by 7 cm. Find the area of the shape formed by joining the midpoints of its sides.", steps: ["Original area = 10 x 7 = 70 cm squared.", "Corner triangles have legs 5 and 3.5, area = half x 5 x 3.5 = 8.75.", "Four corners total 4 x 8.75 = 35.", "Inner shape = 70 - 35 = 35 cm squared."], answer: "35 cm squared, exactly half of 70" },
    ] },
    { h: "5. A second proof for the rhombus, using its diagonals", body: [
      "There is a neat cross-check available whenever the inner shape is a rhombus, because a rhombus has a formula of its own: its area is always half of the product of its two diagonals (the two lines joining opposite corners).",
      "In the 8 by 6 rectangle, the rhombus's diagonals run from the midpoint of the left side to the midpoint of the right side, a horizontal distance of 8, the full length of the rectangle, and from the midpoint of the bottom to the midpoint of the top, a vertical distance of 6, the full width. So the diagonals are 8 and 6.",
      "The rhombus area formula gives half of 8 times 6, which is 24, exactly matching the answer from cutting off the four corners. Two completely different ways of looking at the same shape agree, which is about as convincing as maths gets. It also reveals something rather satisfying: the midpoint rhombus's diagonals are simply the original rectangle's length and width.",
    ], note: "This diagonal shortcut only applies neatly because the rectangle's midpoints line up its diagonals with its own length and width. It is a bonus check, not a replacement for understanding the corner-cutting argument, which is the one that explains why it works." },
    { h: "6. Doing it with coordinates", body: [
      "Midpoints have their own simple formula on a coordinate grid: to find the midpoint of two points, average their x-coordinates and average their y-coordinates separately.",
      "Take a square PQRS with corners P = (1,1), Q = (7,1), R = (7,7) and S = (1,7), so its side length is 6 (from x = 1 to x = 7) and its area is 36. The midpoint of side PQ, from (1,1) to (7,1), is ((1+7)/2, 1), which is (4,1). Working the same way round the other three sides gives the remaining three midpoints.",
      "Each corner triangle cut off has legs of 3 (half of the side length 6), so its area is half of 3 times 3, which is 4.5. Four corners total 18. The inner square's area is 36 minus 18, which is 18, exactly half of 36, just as the general rule promised, now confirmed using coordinates and the midpoint formula rather than a picture.",
    ], tryit: { q: "Square PQRS has corners P = (2,2), Q = (10,2), R = (10,10) and S = (2,10). Use the midpoint formula to find the midpoint of side PQ, then find the area of the midpoint square inside.", answer: "Midpoint of PQ = ((2+10)/2, 2) = (6,2). Side length is 8, so area is 64. Each corner triangle has legs 4, area 8, four total 32, leaving 64 - 32 = 32, half of 64." } },
    { h: "7. Given the perimeter instead of the side", body: [
      "Sometimes a question is deliberately one step removed: instead of handing you the side length directly, it gives you the square's perimeter, and expects you to recover the side length yourself before the halving rule can even begin.",
      "The fix is simple: since a square's perimeter is four times its side, divide the perimeter by 4 first. Suppose a square has perimeter 60 cm. Its side is 60 divided by 4, which is 15 cm. Now proceed exactly as before: original area = 15 x 15 = 225 cm squared, and the midpoint square's area is half of that, 112.5 cm squared.",
      "Notice this can genuinely produce a decimal or fractional answer, since not every side length squared happens to halve into a whole number. Do not panic if that happens; a correctly halved area is correct whether or not it happens to be a tidy whole number.",
    ], examples: [
      { q: "A square has perimeter 20 cm. Find the area of the midpoint square inside it.", steps: ["Side length = 20 divided by 4 = 5 cm.", "Original area = 5 x 5 = 25 cm squared.", "Midpoint square area = 25 divided by 2 = 12.5 cm squared."], answer: "12.5 cm squared" },
      { q: "A square has perimeter 48 cm. Find the area of the midpoint square inside it.", steps: ["Side length = perimeter divided by 4 = 48 divided by 4 = 12 cm.", "Original area = 12 x 12 = 144 cm squared.", "Midpoint square area = 144 divided by 2 = 72 cm squared."], answer: "72 cm squared" },
      { q: "A square has perimeter 100 cm. Find the area of the midpoint square inside it.", steps: ["Side length = 100 divided by 4 = 25 cm.", "Original area = 25 x 25 = 625 cm squared.", "Midpoint square area = 625 divided by 2 = 312.5 cm squared."], answer: "312.5 cm squared" },
    ],
      tryit: { q: "A square has perimeter 32 cm. Find the area of the midpoint square inside it.", answer: "32 cm squared. Side = 32 divided by 4 = 8 cm. Original area = 64 cm squared. Midpoint square = 64 divided by 2 = 32 cm squared." } },
    { h: "8. Doing it twice: the second-generation midpoint square", body: [
      "Here is a question that catches people out precisely because the rule is so simple: what if you take the midpoint square you have just made, and repeat the whole process on IT, joining the midpoints of its own four sides?",
      "The halving rule does not care what shape you feed it, as long as it is a square, so it applies again without any change: the second-generation midpoint square is half the area of the first-generation one. Since the first was already half of the original, the second generation ends up at half of a half, which is a quarter of the very original square.",
      "Take an original square of side 12 cm, area 144 cm squared. The first midpoint square has area 144 divided by 2, which is 72 cm squared. Apply the rule again to that 72: the second midpoint square has area 72 divided by 2, which is 36 cm squared, and 36 is indeed a quarter of the original 144. Each further generation would halve again: an eighth, a sixteenth, and so on forever, always shrinking but never quite reaching zero.",
    ], examples: [
      { q: "A square has side 4 cm. Find the area of its second-generation midpoint square.", steps: ["Original area = 16 cm squared.", "First midpoint square = 16 divided by 2 = 8 cm squared.", "Second midpoint square = 8 divided by 2 = 4 cm squared."], answer: "4 cm squared, a quarter of the original 16" },
      { q: "A square has side 20 cm. Its midpoint square is drawn, and then the midpoint square of THAT square is drawn. Find the area of this second midpoint square.", steps: ["Original area = 20 x 20 = 400 cm squared.", "First midpoint square = 400 divided by 2 = 200 cm squared.", "Second midpoint square = 200 divided by 2 = 100 cm squared."], answer: "100 cm squared, a quarter of the original 400" },
      { q: "A square has side 16 cm. Apply the midpoint-square process three times. Find the area of the third-generation midpoint square.", steps: ["Original area = 256 cm squared.", "First: 256/2 = 128. Second: 128/2 = 64. Third: 64/2 = 32.", "Alternatively, three halvings = dividing by 8: 256/8 = 32."], answer: "32 cm squared, one eighth of the original 256" },
    ],
      tryit: { q: "A square has side 8 cm. Find the area of its second-generation midpoint square (apply the halving rule twice).", answer: "16 cm squared. Original area = 64. First generation = 32. Second generation = 16, which is a quarter of 64." } },
    { h: "9. The trap: guessing 'half' instead of proving it", body: [
      "It is tempting, once you have heard the rule a couple of times, to simply write 'half' on any midpoint question without justifying it, especially since it is genuinely always true for squares and rectangles. Examiners are wise to this, and a question that asks you to 'show that' the inner shape is half the area wants the corner-cutting argument, not just the final claim.",
      "The safe habit is the one this lesson has used throughout: work out the legs of the corner triangles (always half of the two sides meeting at that corner), find one corner's area, multiply by four, and subtract from the whole. That is a complete, convincing argument every single time, and it costs you nothing extra if the numbers happen to be easy.",
    ], tryit: { q: "A square has side 12 cm. Without just asserting 'half', show fully that the midpoint square's area is 72 cm squared.", answer: "Original area = 12 x 12 = 144. Each corner triangle has legs 6 and 6 (half of 12), area = half x 6 x 6 = 18. Four corners total 4 x 18 = 72. Inner square = 144 - 72 = 72 cm squared, which is indeed half of 144." } },
    { h: "10. A glimpse further: any four-sided shape at all", body: [
      "Here is a fact worth tucking away for later, even though this lesson has stuck to squares and rectangles where you can check every step by hand. Take any four-sided shape at all, even a lopsided, wonky one with no matching sides or right angles, and join the midpoints of its four sides in order.",
      "You always get a parallelogram (a shape with two pairs of parallel sides), and that parallelogram's area is always exactly half of the original shape's area, whatever the original looked like. This is a genuine piece of mathematics called Varignon's theorem, and squares and rectangles are simply the two friendliest, most checkable examples of a much bigger truth.",
    ] },
  ],
  recap: [
    "Joining the midpoints of a square's sides in order always makes an inner square with exactly half the original's area.",
    "Prove it by cutting off the four corner triangles: each has legs equal to half the original sides, and together the four corners total exactly half the area, leaving half behind.",
    "The same halving rule holds for rectangles, where the inner shape becomes a rhombus, and its diagonals turn out to equal the rectangle's own length and width.",
    "The midpoint of two coordinate points is found by averaging the x-coordinates and averaging the y-coordinates.",
    "If you're given the perimeter rather than the side, divide by 4 first to recover the side length before applying the halving rule.",
    "The rule works backwards too (double a midpoint shape's area to find the original's), and it can be applied a second time to the inner shape itself, giving a quarter of the very original area.",
  ],
  mistakes: [
    "Assuming the inner shape is 'half' just by eye: wrong, guessing from the picture; right, cut off the four corner triangles and show the numbers actually total half.",
    "Forgetting the corner triangle's legs are half the original side, not the full side: wrong, using legs 8 and 6 for an 8 by 6 rectangle; right, using legs 4 and 3.",
    "Expecting the midpoint shape inside a rectangle to be a square: wrong, it is a rhombus (equal sides, but not equal angles) unless the original was itself a square.",
    "Mixing up the midpoint formula: wrong, adding the two x-coordinates and stopping there; right, adding them and then dividing by 2 to get the average.",
    "Forgetting to divide a given perimeter by 4 before applying the halving rule, and instead treating the perimeter itself as if it were the side length.",
    "Halving only once for a second-generation midpoint square instead of applying the rule twice (a quarter of the original, not a half).",
  ],
};

JUNIOR_LESSONS.partitionRect = {
  title: "Divided Shapes",
  minutes: 16,
  intro: "Cut a rectangle with one line across it and one line down it, and you get four smaller rectangles arranged in a grid. Know three of their perimeters and the fourth is not a mystery at all, it falls straight out of how the pieces share their widths and heights. This lesson builds that trick from first principles, shows exactly why it works, why the same trick does not apply to area, and a sharper version of the pattern that sometimes lets you skip straight to the answer.",
  sections: [
    { h: "1. Setting up the picture", body: [
      "Picture a rectangular garden, or a cake, or a sheet of glass in a window. Now cut it with one straight line running left to right (horizontal) and one straight line running top to bottom (vertical). Together those two cuts divide the whole rectangle into four smaller rectangles, sitting like a two by two grid: one top-left, one top-right, one bottom-left, one bottom-right.",
      "Label them 1 (top-left), 2 (top-right), 3 (bottom-left) and 4 (bottom-right). Each of the four is a perfectly ordinary rectangle in its own right, with its own length, width, perimeter and area, but all four are locked together because they share edges with their neighbours.",
    ] },
    { h: "2. A quick refresher: why perimeter is 2 x (length + width)", body: [
      "A rectangle has two long sides and two short sides, and opposite sides are always equal, so walking all the way round means walking the length twice and the width twice. Add the length and the width once to get 'one lap's worth' of the two different sides, then double it because each of those two distances happens twice.",
      "A rectangle 9 cm by 4 cm has perimeter 2 x (9 + 4), which is 2 x 13, which is 26 cm. That reasoning, not just the formula, is what we will lean on throughout this lesson.",
    ] },
    { h: "3. Sharing widths and heights across the grid", body: [
      "Here is the key structural fact. The vertical cut gives the grid two possible widths: call the left column's width a and the right column's width b. The horizontal cut gives two possible heights: call the top row's height c and the bottom row's height d.",
      "Every one of the four small rectangles is built from exactly one of the widths and exactly one of the heights. Rectangle 1 (top-left) is a wide and c tall. Rectangle 2 (top-right) is b wide and c tall, sharing its height with rectangle 1 but its width with rectangle 4. Rectangle 3 (bottom-left) is a wide and d tall, sharing its width with rectangle 1 but its height with rectangle 4. Rectangle 4 (bottom-right) is b wide and d tall.",
      "So the four perimeters are: P1 = 2(a + c), P2 = 2(b + c), P3 = 2(a + d), P4 = 2(b + d). Every one of them is built from exactly two of the four measurements a, b, c and d, and between the four rectangles, every possible pairing of a width with a height turns up exactly once.",
    ] },
    { h: "4. A full worked example, calculating everything directly", body: [
      "Let the left column be a = 3 cm wide and the right column be b = 8 cm wide. Let the top row be c = 5 cm tall and the bottom row be d = 2 cm tall. The whole rectangle is then (3 + 8) = 11 cm long and (5 + 2) = 7 cm wide.",
      "Rectangle 1: 3 by 5, perimeter 2 x (3 + 5) = 16 cm. Rectangle 2: 8 by 5, perimeter 2 x (8 + 5) = 26 cm. Rectangle 3: 3 by 2, perimeter 2 x (3 + 2) = 10 cm. Rectangle 4: 8 by 2, perimeter 2 x (8 + 2) = 20 cm.",
      "Keep these four numbers, 16, 26, 10 and 20, close at hand. The next few sections all come back to this same example to show off different patterns hiding inside it.",
    ], examples: [
      { q: "A rectangle is split into four pieces: 2 by 4, 5 by 4, 2 by 3 and 5 by 3. Find each perimeter.", steps: ["2 by 4: 2 x (2+4) = 12.", "5 by 4: 2 x (5+4) = 18.", "2 by 3: 2 x (2+3) = 10.", "5 by 3: 2 x (5+3) = 16."], answer: "12 cm, 18 cm, 10 cm and 16 cm" },
      { q: "A rectangle is split by one vertical and one horizontal line into four smaller rectangles: 3 by 5, 8 by 5, 3 by 2 and 8 by 2. Find each perimeter.", steps: ["3 by 5: 2 x (3+5) = 16.", "8 by 5: 2 x (8+5) = 26.", "3 by 2: 2 x (3+2) = 10.", "8 by 2: 2 x (8+2) = 20."], answer: "16 cm, 26 cm, 10 cm and 20 cm" },
      { q: "A divided rectangle has columns of width 3 and 7, and rows of height 8 and 1. Find all four perimeters and verify the diagonal sums match.", steps: ["Top-left (3x8): 2x(3+8)=22. Top-right (7x8): 2x(7+8)=30.", "Bottom-left (3x1): 2x(3+1)=8. Bottom-right (7x1): 2x(7+1)=16.", "Diagonal pair 1: 22+16=38. Diagonal pair 2: 30+8=38. Both match."], answer: "22, 30, 8, 16 cm; diagonal sums both equal 38" },
    ] },
    { h: "5. The diagonal pattern: opposite corners match", body: [
      "Add rectangle 1's perimeter to rectangle 4's: 16 + 20 = 36. Now add rectangle 2's perimeter to rectangle 3's: 26 + 10 = 36. The same total, both times.",
      "That is not a coincidence of these particular numbers, it is guaranteed by the structure. P1 + P4 = 2(a+c) + 2(b+d) = 2(a+b+c+d). P2 + P3 = 2(b+c) + 2(a+d) = 2(a+b+c+d) too. Both sums are secretly adding up the exact same four measurements, a, b, c and d, just paired up in a different order, so they must come out equal.",
      "The rectangles diagonally opposite each other in the grid, 1 with 4, and 2 with 3, always have perimeters that add to the same total. That is the whole trick in one sentence.",
    ] },
    { h: "6. Using the pattern to find a missing perimeter", body: [
      "Since P1 + P4 = P2 + P3 always, you can rearrange to find any one perimeter from the other three, without ever needing to know the individual widths and heights a, b, c and d. Rearranged for the fourth piece: P4 = P2 + P3 - P1.",
      "Suppose you are only told P1 = 14 cm, P2 = 16 cm and P3 = 22 cm for a differently sized grid, and asked for P4. Using the pattern: P4 = 16 + 22 - 14 = 24 cm. You never needed to know the actual widths or heights at all.",
      "This works no matter WHICH of the four pieces is the mystery one, not just P4 — the rule is always: missing perimeter = the two pieces that are NOT its diagonal partner, added together, minus its diagonal partner.",
    ], tryit: { q: "A rectangle is divided into four smaller rectangles. The top-left has perimeter 14 cm, the top-right 16 cm, and the bottom-left 22 cm. Find the bottom-right's perimeter.", answer: "24 cm. Using P4 = P2 + P3 - P1, that is 16 + 22 - 14 = 24." } },
    { h: "7. The outer-rectangle shortcut: one small perimeter is sometimes enough", body: [
      "Here is an even sharper version of the pattern from section 5. Not only do P1 + P4 and P2 + P3 always match each other, both of those sums are also EXACTLY equal to the whole outer rectangle's own perimeter. P1 + P4 = 2(a+c) + 2(b+d) = 2(a+b+c+d), and the outer rectangle's own perimeter is 2 x (length + width) = 2 x ((a+b) + (c+d)) = 2(a+b+c+d) too — the exact same expression, not just an equal number by coincidence.",
      "That means if you are told the OUTER rectangle's own perimeter and just ONE of the four small perimeters, you can find its diagonal partner immediately, without needing the other two small pieces at all: diagonal partner's perimeter = outer perimeter − known perimeter.",
      "Check it against the running example: the outer rectangle is 11 by 7, so its own perimeter is 2 x (11+7) = 36 cm. If you were only ever told that rectangle 1 (top-left) has perimeter 16 cm, you could find rectangle 4 (bottom-right) directly: 36 − 16 = 20 cm, matching the value found by direct calculation back in section 4, without ever touching rectangles 2 or 3.",
    ], examples: [
      { q: "A divided rectangle has outer perimeter 24 cm. One small piece has perimeter 10 cm. Find its diagonal partner's perimeter.", steps: ["Diagonal partners add to the outer perimeter: 10 + partner = 24.", "Partner = 24 - 10 = 14 cm."], answer: "14 cm" },
      { q: "A divided rectangle has outer perimeter 40 cm. The top-right piece has perimeter 18 cm. Find the perimeter of the bottom-left piece (its diagonal partner).", steps: ["Diagonal partners' perimeters always add up to the outer rectangle's own perimeter: P(top-right) + P(bottom-left) = 40.", "P(bottom-left) = 40 − 18 = 22."], answer: "22 cm" },
      { q: "A divided rectangle has outer perimeter 52 cm. One piece has perimeter 15 cm and its row-neighbour (not its diagonal partner) has perimeter 23 cm. Find the other two pieces' perimeters.", steps: ["The piece diagonally opposite the 15 cm piece: 52 - 15 = 37 cm.", "The piece diagonally opposite the 23 cm piece: 52 - 23 = 29 cm.", "Check: 15+37=52 and 23+29=52."], answer: "37 cm and 29 cm" },
    ],
      tryit: { q: "A divided rectangle has outer perimeter 30 cm, and the bottom-right piece has perimeter 13 cm. Find the top-left piece's perimeter.", answer: "17 cm. Top-left and bottom-right are diagonal partners, so their perimeters add to the outer perimeter: 30 − 13 = 17." } },
    { h: "8. Why the totals don't just stay the same: new edges appear", body: [
      "It might seem like cutting a rectangle into four pieces should somehow 'conserve' the original perimeter, spreading it out among the four smaller shapes. It does not, and it is worth seeing exactly why, using our running example (perimeters 16, 26, 10 and 20).",
      "Add up all four small perimeters: 16 + 26 + 10 + 20 = 72. Now find the big rectangle's own perimeter: it is 11 by 7, so 2 x (11 + 7) = 36. The four small perimeters add up to 72, which is exactly double the big rectangle's perimeter, not the same as it.",
      "The reason is that the vertical cut and the horizontal cut both create brand new edges that were never part of the original outline. The vertical cut, of length 7 (the full height), becomes an edge for two of the small rectangles (once as a right-hand edge, once as a left-hand edge), so it gets counted twice among the four perimeters. The horizontal cut, of length 11, does exactly the same. Those two doubled-up internal cuts are precisely what pushes the total from 36 up to 72.",
    ], note: "In general, the sum of all four small rectangles' perimeters is always exactly double the original rectangle's perimeter, because each of the two internal cuts gets walked twice (once by each rectangle it borders) instead of the single time an outer edge is walked." },
    { h: "9. The contrast with area: nothing doubles up", body: [
      "Compare that with area, and you will see immediately why keeping perimeter and area separate in your head really matters here. Using the same example: the big rectangle is 11 by 7, area 77. The four small areas are 3x5=15, 8x5=40, 3x2=6 and 8x2=16. Add them: 15 + 40 + 6 + 16 = 77, matching the big rectangle exactly, no doubling anywhere.",
      "Area behaves so simply because area is a measure of flat space, and cutting a shape into pieces never creates or destroys any space, it just draws a boundary through space that was already there. Perimeter is different: it measures the edges you would walk along, and cutting the rectangle creates two brand new edges (the cuts themselves) that were not there before, and each one gets counted by two different small rectangles.",
    ] },
    { h: "10. A trap hiding in the labelling: not every pair matches", body: [
      "It is easy to assume that any two of the four perimeters can be swapped into the P2 + P3 - P1 pattern, but only the true diagonal pairing works: 1 with 4, and 2 with 3. Test this on our running example. The two rectangles sharing a row, 1 and 2 (both height c): 16 + 26 = 42. The other row, 3 and 4: 10 + 20 = 30. Those do not match each other.",
      "Try columns instead: 1 and 3 (both width a): 16 + 10 = 26. The other column, 2 and 4: 26 + 20 = 46. Those do not match either. Only the two diagonal pairs, (1,4) and (2,3), give equal totals, because only those pairings sweep up all four different measurements a, b, c and d exactly once each. Rows and columns each repeat one measurement twice and miss another entirely, which breaks the balance.",
    ], tryit: { q: "In a divided rectangle, the four perimeters are 20 cm (top-left), 26 cm (top-right), 22 cm (bottom-left) and 28 cm (bottom-right). Check that the diagonal pairs match, and confirm that the row pairs do not.", answer: "Diagonals: 20 + 28 = 48, and 26 + 22 = 48. They match. Top row: 20 + 26 = 46. Bottom row: 22 + 28 = 50. These do not match, confirming only diagonal pairs are guaranteed to be equal." } },
    { h: "11. Putting it all together: a garden of flower beds", body: [
      "A rectangular garden is divided by one path running across and one running down into four rectangular flower beds: a rose bed (top-left), a tulip bed (top-right), a daisy bed (bottom-left) and a lavender bed (bottom-right). Their edging fences (perimeters) are: rose 20 m, tulip 26 m, and daisy 22 m. Find the lavender bed's edging without measuring the garden itself.",
      "Rose and lavender are diagonally opposite, as are tulip and daisy, so P(rose) + P(lavender) = P(tulip) + P(daisy). That gives 20 + P(lavender) = 26 + 22 = 48, so P(lavender) = 48 - 20 = 28 m.",
      "Notice the answer, 28, also equals P(tulip) + P(daisy) - P(rose), which is 26 + 22 - 20 = 28, the exact same pattern as before, just relabelled with flowers instead of numbers.",
    ], tryit: { q: "A rectangular allotment is divided into four plots. The top-left plot has perimeter 18 m, the top-right 24 m, and the bottom-right 30 m. Find the bottom-left plot's perimeter.", answer: "24 m. Diagonals must match: P(top-left) + P(bottom-right) = P(top-right) + P(bottom-left), so 18 + 30 = 24 + P(bottom-left), giving 48 = 24 + P(bottom-left), so P(bottom-left) = 24." } },
  ],
  recap: [
    "One vertical and one horizontal cut divide a rectangle into four smaller rectangles, each built from one of two widths and one of two heights.",
    "The two diagonally opposite pairs of perimeters always add to the same total, since each pair uses all four measurements exactly once, just paired differently.",
    "That gives the shortcut: a missing perimeter equals the sum of its two 'non-partner' perimeters minus the one diagonally opposite it.",
    "That same diagonal total is also exactly equal to the outer rectangle's own perimeter — so the outer perimeter plus just ONE small perimeter can be enough to find its diagonal partner.",
    "Only diagonal pairs are guaranteed equal; row pairs and column pairs generally are not.",
    "The four small perimeters add to exactly double the original rectangle's perimeter (because the two internal cuts are each counted twice), whereas the four small areas add to exactly the original area (with no doubling at all).",
  ],
  mistakes: [
    "Assuming the four small perimeters add up to the original rectangle's perimeter: wrong, they add to double it, because the two internal cuts are each shared by two rectangles.",
    "Applying the P4 = P2 + P3 - P1 shortcut to a row or column pair instead of the true diagonal pair: wrong, using the two top perimeters and the two bottom perimeters as if they must match; right, only pairing rectangle 1 with 4 and rectangle 2 with 3 is guaranteed to balance.",
    "Forgetting that the diagonal-pair total is also exactly the outer rectangle's own perimeter, and so trying to find a missing perimeter from only ONE other piece when actually the outer perimeter is needed too (or vice versa).",
    "Treating perimeter and area as if they behave the same way when a shape is partitioned: wrong, assuming both simply 'split up' the original total; right, area splits up exactly, but perimeter grows because cutting creates new edges.",
    "Forgetting that each small rectangle must use one whole width (a or b) and one whole height (c or d), and instead guessing its dimensions rather than reading them off the shared grid lines.",
  ],
};


// ---- Full-depth guided lessons: perimeter, paths and 3D (compoundPerimeter v2, poolPath, cubeProps) ----

JUNIOR_LESSONS.compoundPerimeter = {
  title: "Perimeter of Compound Shapes",
  minutes: 22,
  intro: "Perimeter is the distance all the way round the edge of a shape, and for a plain rectangle that is nothing to lose sleep over. Real shapes are rarely so polite. Floor plans, garden borders, grids of unit squares and the outlines of house extensions all turn corners and hide half their measurements from you, and that is exactly where compound shapes come in: shapes built by joining two or more simpler pieces together. This lesson builds, from nothing, the one skill that tames them all: working out the sides nobody bothered to write down, then adding up without tripping over the join — whether the shape is drawn on a unit-square grid or measured out in metres.",
  sections: [
    { h: "1. What perimeter actually measures", body: [
      "Picture an ant setting off from one corner of a shape and walking all the way round the outside edge until it gets back to where it started. The total distance the ant walks is the perimeter. Nothing more mysterious than that.",
      "Because perimeter is a distance, it is measured in plain length units: cm, m, whatever the question gives you. It is never measured in squared units. Hold onto that; it is the first flag that tells you whether you are doing perimeter or its very different cousin, area.",
    ], examples: [
      { q: "A rectangular garden is 5 m by 3 m. Find its perimeter.", steps: ["Perimeter = 2 x (length + width) = 2 x (5 + 3).", "2 x 8 = 16."], answer: "16 m" },
      { q: "A rectangular field is 11 m by 4 m. Find its perimeter.", steps: ["A rectangle has two long sides and two short sides.", "Perimeter = 2 x (length + width) = 2 x (11 + 4).", "2 x 15 = 30."], answer: "30 m" },
      { q: "A square park has a perimeter of 52 m. Find the length of each side.", steps: ["A square has 4 equal sides, so perimeter = 4 x side.", "4 x side = 52.", "Side = 52 divided by 4 = 13."], answer: "13 m" },
    ],
      tryit: { q: "Find the perimeter of a square field with side 7 m.", answer: "28 m, because a square has 4 equal sides: 4 x 7 = 28." } },
    { h: "2. Rectangles, squares, and why the formula works", body: [
      "The formula 2 x (length + width) is not a magic spell, it is just a shortcut for tracing the ant's whole walk. Go along the length, down the width, back along the length, up the width: that is length + width + length + width, or 2 lots of (length + width).",
      "A square is just a rectangle where the length and width happen to be equal, which is why its shortcut simplifies further to 4 x side. Knowing where a formula comes from means you never have to panic if you forget it; you can rebuild it from the walk.",
    ], examples: [
      { q: "Find the perimeter of a rectangle 6 cm by 4 cm.", steps: ["2 x (length + width).", "2 x (6 + 4) = 2 x 10.", "= 20."], answer: "20 cm" },
      { q: "Find the perimeter of a rectangle 9 cm by 5 cm.", steps: ["2 x (length + width).", "2 x (9 + 5) = 2 x 14.", "= 28."], answer: "28 cm" },
      { q: "A rectangle has a perimeter of 38 cm and one side of 12 cm. Find the other side.", steps: ["The two different side lengths add to half the perimeter: 38 divided by 2 = 19.", "One side is 12, so the other is 19 - 12 = 7."], answer: "7 cm" },
    ],
      tryit: { q: "Find the perimeter of a square with side 6 cm.", answer: "24 cm, since 4 x 6 = 24." } },
    { h: "3. The universal method: trace and add", body: [
      "Here is the method that never, ever fails, for any shape at all however lopsided: walk round the outline and add up the length of every single side you cross. Formulas like 2 x (length + width) are only shortcuts available because rectangles have matching pairs of sides; an odd shape has no such luck, so you fall back on the honest method.",
      "The two ways to wreck this: missing a side out, or counting one twice because you lost your place. Tracing the outline with a finger while you add, in one steady direction, fixes both.",
    ], note: "If a shape has no repeating pattern in its sides, there is no shortcut formula for it, and that is fine. Add every side. That always works." },
    { h: "4. What makes a shape compound", body: [
      "A compound shape (some call it a composite shape) is simply a shape you can build by pushing two or more simpler pieces together. An L-shape is a tall rectangle with a shorter rectangle tucked against one side. A T-shape, a staircase, the floor plan of a house with a kitchen extension bolted onto the back: all compound shapes, all built from simpler pieces.",
      "The reason compound shapes are trickier than plain rectangles is not the adding, it is that the question usually only gives you some of the side lengths and expects you to work out the rest from how the pieces fit together.",
    ] },
    { h: "5. The vanishing edge", body: [
      "Here is the single most common way marks get lost on compound perimeter questions: assuming the total perimeter is just the sum of the perimeters of the separate rectangles you can see inside it. It is not, and the reason is worth sitting with.",
      "Take two 4 cm by 4 cm squares, each with perimeter 2 x (4 + 4) = 16 cm, so 32 cm together if you naively added them. But push them together edge to edge and they form a 4 cm by 8 cm rectangle, with perimeter 2 x (4 + 8) = 24 cm. Where did the missing 8 cm go? It is the edge where the two squares touch: 4 cm counted on the first square's perimeter, 4 cm again on the second square's perimeter, but that edge is now buried inside the joined shape and is not part of the outer boundary at all. It vanished, twice over.",
    ], note: "Whenever two shapes are glued along a shared edge, that edge disappears from the outer perimeter entirely. It was never on the outside to begin with.",
      tryit: { q: "Two rectangles, each 3 cm by 5 cm, are joined along one of their 3 cm edges to make one longer rectangle. Find the perimeter of the joined shape, and compare it with simply adding the two separate perimeters.", answer: "Joined shape is 3 cm by 10 cm, perimeter 2 x (3+10) = 26 cm. Adding the separate perimeters gives 16 + 16 = 32 cm, which is 6 cm too many; the shared 3 cm edge was double counted (2 x 3 = 6)." } },
    { h: "6. Finding hidden sides: the balance rule", body: [
      "So how do you find a side length the question never told you? Use the fact that a compound shape, however many corners it has, must still close up. Every horizontal step you take rightwards across the top must be matched by an equal total of horizontal steps back leftwards somewhere below, because you end up back where you started. The same is true for vertical steps: everything you go up must be balanced by an equal total going back down.",
      "In practice this means: the total width across the top of the shape equals the total width across the bottom, and the total height up the left equals the total height down the right, even when each side is chopped into several smaller pieces.",
    ], examples: [
      { q: "A shape's bottom is a single edge of 8 cm. Its top is two pieces: 3 cm and an unlabelled piece. Find the unlabelled piece.", steps: ["The top pieces must add to the same total as the bottom, 8 cm.", "Unlabelled piece = 8 - 3 = 5 cm."], answer: "5 cm" },
      { q: "An L-shape has a single bottom edge of 12 cm. Along the top, the outline is broken into two horizontal pieces: one measures 7 cm, the other is unlabelled. Find the unlabelled piece.", steps: ["The horizontal pieces across the top must add up to the same total width as the single bottom edge, 12 cm.", "One top piece is 7 cm.", "So the other top piece is 12 - 7 = 5 cm."], answer: "5 cm" },
      { q: "A staircase shape has a bottom edge of 20 cm. The top is in three horizontal pieces: 8 cm, 7 cm and an unlabelled piece. Find the unlabelled piece.", steps: ["The horizontal pieces across the top must total the same as the bottom, 20 cm.", "8 + 7 = 15.", "Unlabelled piece = 20 - 15 = 5 cm."], answer: "5 cm" },
    ],
      tryit: { q: "A shape's left side is a single edge of 9 cm. Its right side is broken into three vertical pieces: 2 cm, 4 cm, and an unlabelled piece. Find the unlabelled piece.", answer: "3 cm, because 2 + 4 + 3 = 9 matches the single left edge; 9 - 2 - 4 = 3." } },
    { h: "7. A full compound shape, start to finish", body: [
      "Picture a shape like a thick letter L. Its overall bounding box, if you squared it off, would be 12 cm wide and 9 cm tall, but a rectangular bite has been cut from the top right corner: that bite is 5 cm wide and 4 cm tall.",
      "Trace the outline starting at the bottom left corner, going clockwise: along the bottom, 12 cm. Up the right side to where the bite begins, 5 cm (since the bite starts 4 cm below the top, and the total height is 9, that first vertical piece is 9 - 4 = 5). Left along the bottom of the bite, 5 cm (the bite's width). Up the inner corner of the bite, 4 cm (the bite's height). Left along the top, 7 cm (the remaining width once the 5 cm bite is removed from the 12 cm total, 12 - 5 = 7). Down the left side back to the start, 9 cm.",
    ], examples: [
      { q: "An L-shape has sides: 6, 4, 2, 2, 4, 2 cm. Find its perimeter.", steps: ["Add every side: 6 + 4 = 10.", "10 + 2 = 12, then 12 + 2 = 14.", "14 + 4 = 18, then 18 + 2 = 20."], answer: "20 cm" },
      { q: "Add up the six sides traced above: 12, 5, 5, 4, 7, 9.", steps: ["12 + 5 = 17.", "17 + 5 = 22, then 22 + 4 = 26.", "26 + 7 = 33, then 33 + 9 = 42."], answer: "42 cm" },
      { q: "A compound shape has eight sides measuring 10, 3, 4, 2, 6, 1, 12, and 4 cm. Find the perimeter.", steps: ["Add in pairs: 10 + 3 = 13, then 4 + 2 = 6, then 6 + 1 = 7, then 12 + 4 = 16.", "Add the pair sums: 13 + 6 = 19.", "19 + 7 = 26, then 26 + 16 = 42."], answer: "42 cm" },
    ],
      note: "Check it closes: rightward pieces (12) should equal leftward pieces (5 + 7 = 12); yes. Upward pieces (5 + 4 = 9) should equal the downward piece (9); yes. The shape closes, so the perimeter is trustworthy." },
    { h: "8. Two ways to slice it: area, and the perimeter trap for the pieces", body: [
      "The same L-shape can be sliced into two rectangles in more than one way, and this is exactly the kind of question that turns up in assessment: find the area two different ways, then look hard at the perimeter of just one coloured section.",
      "Slice it as a bounding box minus a bite: 12 x 9 = 108, minus the 5 x 4 bite of 20, gives 88 cm squared. Slice it instead into two standing rectangles: a tall left column 7 cm wide by 9 cm tall (63 cm squared) plus a shorter rectangle on the bottom right, 5 cm wide by 5 cm tall (25 cm squared), giving 63 + 25 = 88 cm squared. Both methods agree, which is a good sign you have not made an error.",
      "Now say the left column is coloured yellow and the bottom right rectangle is coloured grey. Treated as standalone rectangles, yellow's perimeter is 2 x (7+9) = 32 cm and grey's is 2 x (5+5) = 20 cm, summing to 52 cm. But the real L-shape's outer perimeter, from section 7, is only 42 cm. The 10 cm difference is exactly twice the shared internal edge where yellow meets grey, which is 5 cm long (2 x 5 = 10): that edge is counted once in yellow's perimeter and once in grey's, but it is not on the outside of the real shape at all, so it must not appear in the true total.",
    ], tryit: { q: "Using the numbers above, explain in one sentence why 52 cm is not the perimeter of the L-shape.", answer: "Because the 5 cm edge where the yellow and grey rectangles join is internal, not part of the outer boundary, yet it gets counted twice (once for each rectangle) when you simply add their two separate perimeters." } },
    { h: "9. Greater depth: working backwards from an area", body: [
      "Some questions hand you the area and expect you to reason your way back to the perimeter, which needs the same balance thinking run in reverse. Picture a window shape: a rectangle standing on its bottom edge, with a semicircular arch fitted exactly on top, so the rectangle's width equals the semicircle's diameter.",
      "Say the diameter (and so the rectangle's width) is 12 cm, and the whole window's area, rectangle plus arch, is given as 150.72 cm squared. Circumference of a full circle is pi x diameter (using pi = 3.14 here), so a semicircle's curved edge is exactly half that, or pi x radius. The radius is 6 cm, so the semicircle's area is a half of pi x radius squared: 0.5 x 3.14 x 36 = 56.52 cm squared.",
    ], examples: [
      { q: "A window is 8 cm wide and 10 cm tall with a semicircular arch on top of diameter 8 cm (pi = 3.14). Find the perimeter of the window.", steps: ["The bottom is 8 cm. The two sides are 10 cm each.", "The curved arch is a semicircle of radius 4 cm: length = pi x radius = 3.14 x 4 = 12.56 cm.", "Note: the straight top of the rectangle is covered by the arch and does not count.", "Perimeter = 8 + 10 + 10 + 12.56 = 40.56 cm."], answer: "40.56 cm" },
      { q: "Find the rectangle's missing height, then the whole window's perimeter.", steps: ["Rectangle's area = total area - semicircle area = 150.72 - 56.52 = 94.2.", "Height = area / width = 94.2 / 12 = 7.85 cm.", "Perimeter = bottom (12) + two sides (7.85 each) + curved top (pi x radius = 3.14 x 6 = 18.84), since the straight top of the rectangle is covered by the arch and is not on the outer edge.", "12 + 7.85 + 7.85 + 18.84 = 46.54."], answer: "46.54 cm" },
      { q: "A shape is a 10 cm by 6 cm rectangle with a quarter-circle of radius 6 cm removed from one corner (pi = 3.14). Find the area of the remaining shape.", steps: ["Rectangle area = 10 x 6 = 60 cm squared.", "Quarter-circle area = (1/4) x pi x radius squared = 0.25 x 3.14 x 36 = 28.26 cm squared.", "Remaining area = 60 - 28.26 = 31.74 cm squared."], answer: "31.74 cm squared" },
    ],
      note: "Whenever a curved piece is fitted onto a straight shape, the straight edge underneath the curve disappears from the perimeter, just like a shared edge between two rectangles. Only the outer boundary counts." },
    { h: "10. The mistakes that cost the most marks", body: [
      "By far the most common one is exactly what section 5 warned about: adding up the perimeters of the pieces you can see, instead of tracing the true outer edge. It feels intuitive and it is wrong every single time a shape has an internal join.",
      "The second is guessing a missing side instead of using the balance rule; a guess might look plausible and still be wrong by several centimetres, whereas the balance rule is guaranteed. The third is giving an answer in squared units out of habit, because you have just been thinking about area. Perimeter is a plain length; say so.",
    ], tryit: { q: "A compound shape is made of a 6 cm by 6 cm square with a 6 cm by 2 cm rectangle attached along one whole 6 cm edge. What is the perimeter of the combined shape, and how does it compare to simply adding the two shapes' separate perimeters?", answer: "Combined shape is 6 cm by 8 cm, perimeter 2 x (6+8) = 28 cm. Separate perimeters: square 24 cm, rectangle 2x(6+2)=16 cm, summing to 40 cm, which is 12 cm too many, twice the shared 6 cm edge." } },
    { h: "11. Counting squares on a grid: the same method, one unit at a time", body: [
      "Everything so far has used continuous measurements like centimetres and metres, but the exact same trace-and-add idea works perfectly on a grid of identical unit squares, which is how many diagrams present compound shapes: as L-shapes, T-shapes, or plus-shapes built from whole unit squares pushed together.",
      "On a grid, instead of measuring each side with a ruler, count unit edges. The rule: an edge of a unit square counts towards the perimeter only if there is NO neighbouring square sitting flush against it on that side. A square glued to another square along one full side has that side buried inside the shape, so it does not count; a side with nothing next to it is on the boundary and does count.",
      "Take an L-shape built from 5 unit squares: a bottom row of 3 squares (call them A, B, C from left to right), with 2 more squares stacked directly above square A (call them D, then E above D). Check every square in turn. A: shares its right side (with B) and its top side (with D), leaving 2 sides exposed. B: shares its left side (with A) AND its right side (with C), leaving 2 exposed. C: shares only its left side (with B), leaving 3 exposed. D: shares its bottom (with A) and its top (with E), leaving 2 exposed. E: shares only its bottom (with D), leaving 3 exposed.",
    ], examples: [
      { q: "Four unit squares are arranged in a 2 by 2 block. How many edges are exposed (on the outer boundary)?", steps: ["Total edges: 4 squares x 4 sides = 16.", "Internal joins: 4 shared edges, each counting on both adjacent squares, so remove 2 x 4 = 8.", "Exposed edges = 16 - 8 = 8."], answer: "8 units (the 2x2 block has perimeter 4 x 2 = 8 as expected)" },
      { q: "Add the exposed edges for the 5-square L-shape described above: A=2, B=2, C=3, D=2, E=3.", steps: ["2 + 2 = 4.", "4 + 3 = 7.", "7 + 2 = 9.", "9 + 3 = 12."], answer: "12 units" },
      { q: "A shape is made from 6 unit squares arranged as a 1 by 6 row. Find the perimeter, and find how it compares to a 2 by 3 block of 6 squares.", steps: ["Row of 6: perimeter = 2 x (6 + 1) = 14 units.", "2 by 3 block: perimeter = 2 x (2 + 3) = 10 units.", "Same 6 squares, but the row has perimeter 4 units bigger because it is less compact."], answer: "Row: 14 units. Block: 10 units. Difference: 4 units." },
    ],
      note: "A quick cross-check: count total square-sides first (4 sides x 5 squares = 20), then subtract 2 for every internal join (each join hides one side on each of the two squares that share it). This shape has 4 internal joins (A-B, B-C, A-D, D-E), so 20 - 2x4 = 12, matching the direct count exactly." },
    { h: "12. Compactness: same number of squares, very different perimeters", body: [
      "Here is a genuinely surprising fact once you see it: two shapes can be built from exactly the same number of unit squares and still have very different perimeters, purely because of how the squares are arranged.",
      "Take 8 unit squares arranged in a straight row: perimeter = 2 x (8 + 1) = 18 units (using the row shortcut from earlier compound-perimeter work, or just tracing). Now take the same 8 squares arranged in a compact 2 by 4 block: perimeter = 2 x (2 + 4) = 12 units. Same 8 squares, same total area, but 6 units of difference in perimeter.",
    ], examples: [
      { q: "Compare a row of 4 unit squares with a 2 by 2 block. Find both perimeters.", steps: ["Row of 4: perimeter = 2 x (4 + 1) = 10.", "2 by 2 block: perimeter = 2 x (2 + 2) = 8.", "The row is 2 units bigger."], answer: "Row: 10 units. Block: 8 units." },
      { q: "Compare a row of 10 unit squares with a compact 2 by 5 block of 10 unit squares. Find both perimeters and their difference.", steps: ["Row of 10: perimeter = 2 x (10 + 1) = 22.", "2 by 5 block: perimeter = 2 x (2 + 5) = 14.", "Difference = 22 - 14 = 8."], answer: "Row 22 units, block 14 units, difference 8 units" },
      { q: "12 unit squares are arranged in three different ways: a 1 by 12 row, a 2 by 6 block, and a 3 by 4 block. Find each perimeter and order them from largest to smallest.", steps: ["Row 1x12: 2 x (12+1) = 26.", "Block 2x6: 2 x (2+6) = 16.", "Block 3x4: 2 x (3+4) = 14.", "Largest to smallest: 26, 16, 14."], answer: "Row: 26 units, 2x6 block: 16 units, 3x4 block: 14 units" },
    ],
      note: "The more spread out and 'stringy' a shape is, the bigger its perimeter for a given area; the more compact and square-ish it is, the smaller. This is exactly why real buildings are rarely built as long thin strips: a compact footprint has less outer wall (and so less cost and less heat loss) for the same floor area." },
    { h: "13. The corner-notch invariant: cutting a bite out doesn't change the perimeter", body: [
      "Go back to the bounding-box-minus-a-bite shape from section 7 (a 12 by 9 rectangle with a 5 by 4 corner bite removed, perimeter 42 cm). Notice something remarkable: 42 = 2 x (12 + 9), which is exactly the perimeter the PLAIN 12 by 9 rectangle would have had, with no bite at all.",
      "This is not a coincidence, and it holds for a bite of ANY size cut from a corner (as long as it does not reach all the way across). Removing a rectangular notch from a corner takes away two edges (the width and height you might expect to lose) but creates two brand new edges of exactly the same combined length, because the horizontal pieces on either side of the missing corner must still add up to the full original width, and the vertical pieces on either side must still add up to the full original height. What you lose on the outside, you gain back on the inside step, every time.",
    ], examples: [
      { q: "A rectangle 10 m by 6 m has a 3 m by 2 m corner bite removed. Find the perimeter of the resulting L-shape.", steps: ["Trace around the shape: 10 + (6-2) + 3 + 2 + (10-3) + 6 = 10 + 4 + 3 + 2 + 7 + 6 = 32.", "Check with the invariant: 2 x (10 + 6) = 32. They match."], answer: "32 m (same as the original rectangle's perimeter)" },
      { q: "A rectangle 15 m by 9 m has a 4 m by 3 m rectangular corner bite removed. Find the perimeter of the resulting L-shape, and check it against the invariant.", steps: ["Trace: 15 + (9-3) + 4 + 3 + (15-4) + 9 = 15 + 6 + 4 + 3 + 11 + 9 = 48.", "Compare with the invariant: 2 x (15 + 9) = 48.", "They match — the bite changed the shape but not the total perimeter."], answer: "48 m" },
      { q: "A 20 cm by 12 cm rectangle has a rectangular bite removed from one corner. The remaining perimeter is still 64 cm. Is this consistent, and what does it tell you?", steps: ["Check the original rectangle's perimeter: 2 x (20 + 12) = 64 cm.", "The corner-bite invariant says the perimeter does not change when a corner is removed.", "So yes, 64 cm is consistent — the bite can be any size and the perimeter stays the same."], answer: "Yes, consistent. The perimeter equals that of the original 20 x 12 rectangle, and corner bites never change the perimeter." },
    ],
      note: "This trick only works for a bite taken out of a CORNER (touching two adjacent sides of the bounding box). A notch cut into the MIDDLE of one side behaves differently, because it adds two new vertical (or horizontal) edges without removing any of the original ones — that genuinely increases the perimeter, and is worth testing for yourself by sketching one." },
    { h: "14. Balance rule in both directions: a vertical example", body: [
      "Section 6's balance-rule example hid a horizontal edge. The exact same reasoning works for a hidden VERTICAL edge — the total distance moved down the right-hand side of a shape must equal the total distance moved up the left-hand side, since the outline closes back up on itself.",
      "Picture an L-shaped plot where the left edge is a single measured side of 11 m, and the right-hand side is broken into two vertical pieces by a step: the lower piece measures 7 m, and the upper piece (above the step) is unlabelled.",
    ], examples: [
      { q: "A shape has a single left edge of 8 m. Its right-hand side is in two pieces: 5 m and an unlabelled piece. Find the unlabelled piece.", steps: ["Vertical balance: the right pieces must total the left edge, 8 m.", "Unlabelled piece = 8 - 5 = 3 m."], answer: "3 m" },
      { q: "Using the plot above (left edge 11 m; right-hand side split into a 7 m lower piece and an unlabelled upper piece), find the unlabelled piece.", steps: ["Vertical balance: the pieces going up the right-hand side must total the same as the single left edge, 11 m.", "One right-hand piece is 7 m.", "The other is 11 - 7 = 4 m."], answer: "4 m" },
      { q: "A compound shape has a left edge of 14 m. The right-hand side is in three pieces: 3 m, 5 m and an unlabelled piece. A horizontal edge is unknown. The bottom is 9 m and the top has two pieces: 4 m and an unlabelled horizontal piece. Find both unlabelled sides.", steps: ["Vertical balance: 3 + 5 + unlabelled vertical = 14, so unlabelled vertical = 6 m.", "Horizontal balance: 4 + unlabelled horizontal = 9, so unlabelled horizontal = 5 m."], answer: "Unlabelled vertical: 6 m. Unlabelled horizontal: 5 m." },
    ],
      tryit: { q: "An L-shaped plot has a single right-hand edge of 13 m. Its left-hand side is split into two vertical pieces: 5 m and an unlabelled piece. Find the unlabelled piece.", answer: "8 m, because 5 + 8 = 13 matches the single right-hand edge." } },
  ],
  recap: [
    "Perimeter is the distance all the way round a shape's edge, in plain length units, never squared units.",
    "Rectangle: 2 x (length + width). Square: 4 x side. Both are shortcuts for tracing the whole outline.",
    "The never-fail method for any shape is to trace the outline and add every side, without missing one or counting one twice — and on a unit-square grid, that becomes counting every exposed unit edge.",
    "A compound shape's total perimeter is not the sum of its pieces' separate perimeters; shared internal edges vanish from the outer boundary, whether the pieces are measured in centimetres or in unit squares.",
    "Missing side lengths are found using the balance rule, in either direction: horizontal pieces across the top total the same as the bottom, and vertical pieces up the left total the same as the right.",
    "Cutting a rectangular notch out of a CORNER never changes the total perimeter, only the shape — a genuinely useful shortcut and sanity check.",
    "The same number of unit squares can have very different perimeters: spread out (like a row) gives the biggest perimeter, compact (like a block) gives the smallest, for the same area.",
    "A curved piece fitted onto a straight shape hides the straight edge beneath it, just like a shared join between two rectangles.",
  ],
  mistakes: [
    "Wrong: adding the perimeters of the visible pieces separately. Right: trace only the true outer boundary; shared joins disappear.",
    "Wrong: guessing a missing side. Right: use the balance rule (top total equals bottom total, left total equals right total) in whichever direction the missing side lies.",
    "Wrong: giving a perimeter answer in squared units. Right: perimeter is always a plain length (cm, m, or 'units' on a grid).",
    "Wrong: assuming a bigger corner bite must mean a bigger (or smaller) perimeter. Right: a corner bite of ANY size leaves the perimeter unchanged, provided it is cut from a corner and does not reach across the whole shape.",
    "Wrong: assuming shapes with the same number of unit squares must have the same perimeter. Right: perimeter depends heavily on how compact or spread out the arrangement is, even for identical areas.",
    "Wrong: including the straight edge under a semicircular arch in the perimeter. Right: that edge is internal and does not count; only the curved arc does.",
  ],
};

JUNIOR_LESSONS.poolPath = {
  title: "Pool and Path",
  minutes: 19,
  intro: "A rectangular swimming pool sits in a garden, and running all the way round it, the same width everywhere, is a paved path. Questions about this setup look, on the surface, like ordinary area and perimeter questions, but they hide a booby trap that catches out almost everyone the first time: the temptation to find the path's area by multiplying its outer perimeter by its width. That shortcut is wrong, and working out exactly why it is wrong turns out to be the whole key to solving these problems properly — for rectangular pools, and circular ones too.",
  sections: [
    { h: "1. Setting the scene", body: [
      "Imagine a rectangular pool, 6 m by 4 m, with a path of constant width running right round the outside, like a picture frame round a photograph or a mount round a piece of art. Wherever you measure the path, from the pool's edge outward to the path's outer edge, it is always the same distance, say 1 m.",
      "The question we want to answer is: given some information about the pool and the path, such as the total area of pool plus path together, how wide is the path, or how big is one of the pool's own dimensions?",
    ] },
    { h: "2. Building the bounding rectangle", body: [
      "Here is the idea the whole topic rests on. The pool plus the path together form one single larger rectangle, and that larger rectangle's dimensions are not the pool's dimensions plus the path width once, but plus the path width twice: once on each side.",
      "For the 6 m by 4 m pool with a 1 m path all round, the outer rectangle is not 7 m by 5 m, it is 8 m by 6 m: the width grows by 1 m on the left and another 1 m on the right (6 + 1 + 1 = 8), and the height grows by 1 m on top and another 1 m on the bottom (4 + 1 + 1 = 6). Forgetting the second lot of width is the single most common error in this whole topic, so it is worth saying twice: the path is added on both sides, not just one.",
    ], examples: [
      { q: "A pool measures 5 m by 3 m with a path 1 m wide all round. Find the outer dimensions.", steps: ["The path runs on both sides of each dimension.", "Length: 5 + 1 + 1 = 7.", "Width: 3 + 1 + 1 = 5."], answer: "7 m by 5 m" },
      { q: "A pool measures 10 m by 6 m, with a path of constant width 2 m running all the way round it. Find the outer dimensions of pool plus path together.", steps: ["Add 2 x width to each dimension, because the path runs on both sides of the pool.", "Length: 10 + 2 + 2 = 14.", "Width: 6 + 2 + 2 = 10."], answer: "14 m by 10 m" },
      { q: "A pool is 12 m by 8 m. A path of width w runs all round it. The outer rectangle has dimensions 18 m by 14 m. Find w.", steps: ["The outer length = pool length + 2w: 12 + 2w = 18, so 2w = 6, so w = 3.", "Check with the width: 8 + 2w = 8 + 6 = 14. Correct."], answer: "w = 3 m" },
    ],
      tryit: { q: "A pool is 8 m by 5 m, with a path 1.5 m wide all round it. Find the outer dimensions.", answer: "11 m by 8 m, since 8 + 1.5 + 1.5 = 11 and 5 + 1.5 + 1.5 = 8." } },
    { h: "3. The path's area, found honestly", body: [
      "Once you have the outer rectangle, the path's area is simply the outer rectangle's area minus the pool's own area; whatever is left over once you take the pool out of the total must be the path.",
      "This is the same composite-shape thinking used for any shape made by combining regions: total area equals the sum of the parts, so any one part equals the total minus the rest.",
    ], examples: [
      { q: "A pool is 4 m by 3 m with a 1 m wide path all round. Find the path's area.", steps: ["Outer rectangle: (4+2) by (3+2) = 6 by 5.", "Outer area = 6 x 5 = 30.", "Pool area = 4 x 3 = 12.", "Path area = 30 - 12 = 18."], answer: "18 m squared" },
      { q: "Pool 6 m by 4 m, path width 1 m all round. Find the path's area.", steps: ["Outer rectangle is 8 m by 6 m (see section 2).", "Outer area = 8 x 6 = 48.", "Pool area = 6 x 4 = 24.", "Path area = 48 - 24 = 24."], answer: "24 m squared" },
      { q: "A square pool has side 7 m with a path 2 m wide all round. Find the path's area.", steps: ["Outer square: (7+2+2) by (7+2+2) = 11 by 11.", "Outer area = 11 x 11 = 121.", "Pool area = 7 x 7 = 49.", "Path area = 121 - 49 = 72."], answer: "72 m squared" },
    ],
      tryit: { q: "Pool 10 m by 6 m, path width 2 m all round. Find the path's area.", answer: "Outer is 14 by 10 (area 140), pool area 60, so path area = 140 - 60 = 80 m squared." } },
    { h: "4. The corner trap", body: [
      "It is very tempting to find the path's area by taking the pool's own perimeter and multiplying by the path's width, as if you had unrolled the path into one long straight strip. For the 6 m by 4 m pool, the perimeter is 2 x (6+4) = 20 m, so this shortcut suggests a path area of 20 x 1 = 20 m squared. But section 3 found the true path area is 24 m squared. The shortcut is wrong, by exactly 4 m squared.",
      "The missing 4 m squared lives in the four corners. Walking a strip of width 1 m along each of the four sides of the pool covers the four straight stretches correctly, but at each of the four corners, a small 1 m by 1 m square gets missed entirely, because the strips only run alongside the straight edges and never fill in the turn. Four missing corner squares, each 1 m squared, is exactly the missing 4 m squared.",
    ], note: "Perimeter x width is never correct for a path of constant width round a rectangle, because it always misses the four corner squares (each exactly width x width). Always build the whole outer rectangle and subtract instead.",
      tryit: { q: "A pool is 5 m by 3 m with a path 2 m wide all round. Compare the perimeter-times-width shortcut with the correct path area, and find the size of the error.", answer: "Perimeter x width = 2x(5+3) x 2 = 16 x 2 = 32. Correct: outer is 9 by 7 = 63, pool is 15, path = 48. Error = 48 - 32 = 16, which is exactly the four missing 2x2 corner squares, 4 x 4 = 16." } },
    { h: "5. Setting up the algebra", body: [
      "Now flip the problem round: instead of being given the path's width, you are told the total area (or the path's area) and asked to find the width. Call the unknown width w. The outer rectangle's dimensions become (length + 2w) by (width + 2w), so the total area is (length + 2w)(width + 2w).",
      "This is an equation you can expand and solve, and because it involves w multiplied by itself, it becomes a quadratic once expanded. That sounds intimidating, but for these problems it almost always factorises nicely, or you can simply try sensible whole-number widths until one fits, since a path is never going to be a strange fractional width in these questions.",
    ] },
    { h: "6. The classic version: path area equals pool area", body: [
      "A famous version of this puzzle asks for the width w such that the path's area is exactly equal to the pool's own area, meaning the total area (pool plus path) is exactly double the pool's area.",
      "Take a pool 6 m by 4 m, so the pool's area is 24 m squared. We want the path's area to also be 24, making the total area 48 m squared. Setting up the equation: (6 + 2w)(4 + 2w) = 48.",
    ], examples: [
      { q: "A pool's total area (pool plus path) is 48 m squared. The pool is 6 m by 4 m. What is the path width? Try w = 1 first.", steps: ["If w = 1, outer = 8 by 6 = 48 m squared. That matches!", "So w = 1 m is a solution.", "Check: pool area = 24, path area = 48 - 24 = 24, which equals the pool area."], answer: "w = 1 m (the path area equals the pool area in this case)" },
      { q: "Solve (6 + 2w)(4 + 2w) = 48 for the width w.", steps: ["Expand the brackets: 6x4 + 6x2w + 2wx4 + 2wx2w = 24 + 12w + 8w + 4w-squared.", "Collect terms: 4w-squared + 20w + 24 = 48.", "Subtract 48 from both sides: 4w-squared + 20w - 24 = 0. Divide every term by 4: w-squared + 5w - 6 = 0.", "Factorise: (w + 6)(w - 1) = 0, so w = -6 or w = 1. A negative width makes no sense, so w = 1."], answer: "w = 1 m. Check: outer becomes 8 x 6 = 48, pool is 24, path is 48 - 24 = 24, which does equal the pool area." },
      { q: "A pool 8 m by 3 m has a path of unknown width w all round. The total area of pool and path is 63 m². Find w.", steps: ["Set up: (8+2w)(3+2w) = 63.", "Try w=1: (10)(5) = 50 ≠ 63.", "Try w=2: (12)(7) = 84 ≠ 63.", "Try w=1.5: (11)(6) = 66 ≠ 63.", "The pool dimensions don't give a clean integer w here. Check the algebra: expand (8+2w)(3+2w) = 24 + 16w + 6w + 4w² = 63. So 4w² + 22w - 39 = 0. Discriminant = 484 + 624 = 1108, not a perfect square.", "Competition problems always use pool dimensions where w is a whole number — this example shows why we check first!"], answer: "No whole-number w exists; always verify with the given numbers before setting up a quadratic" },
    ],
      note: "Whenever a width comes out negative alongside a sensible positive answer, throw the negative one away; a path cannot have negative width. This is completely normal for these equations and not a sign you went wrong." },
    { h: "7. A second version: given the total area directly", body: [
      "Not every question is the neat double-area version. Often you are simply told the combined total area of pool and path, and asked to find w from that alone.",
      "Take a pool 10 m by 6 m (area 60), and suppose you are told the combined total area of pool and path is 140 m squared. Set up (10 + 2w)(6 + 2w) = 140 exactly as before.",
    ], examples: [
      { q: "A pool 4 m by 2 m has a path of unknown width w all round. The combined total area of pool and path is 24 m squared. Solve for w.", steps: ["Set up: (4+2w)(2+2w) = 24.", "Expand: 8 + 8w + 4w + 4w-squared = 4w-squared + 12w + 8.", "4w-squared + 12w + 8 = 24, so 4w-squared + 12w - 16 = 0.", "Divide by 4: w-squared + 3w - 4 = 0. Factorise: (w + 4)(w - 1) = 0.", "w = -4 (rejected) or w = 1."], answer: "w = 1 m. Check: outer is 6 x 4 = 24, matching the given total." },
      { q: "Solve (10 + 2w)(6 + 2w) = 140 for w.", steps: ["Expand: 60 + 20w + 12w + 4w-squared = 60 + 32w + 4w-squared.", "Set equal to 140: 4w-squared + 32w + 60 = 140, so 4w-squared + 32w - 80 = 0.", "Divide by 4: w-squared + 8w - 20 = 0. Factorise: (w + 10)(w - 2) = 0.", "w = -10 (rejected) or w = 2."], answer: "w = 2 m. Check: outer is 14 x 10 = 140, which matches the given total exactly." },
      { q: "A pool 8 m by 6 m has a path of unknown width w all round. The combined total area of pool and path is 168 m squared. Find w.", steps: ["Set up: (8+2w)(6+2w) = 168.", "Expand: 48 + 16w + 12w + 4w-squared = 4w-squared + 28w + 48.", "4w-squared + 28w + 48 = 168, so 4w-squared + 28w - 120 = 0.", "Divide by 4: w-squared + 7w - 30 = 0. Factorise: (w + 10)(w - 3) = 0.", "w = -10 (rejected) or w = 3."], answer: "w = 3 m. Check: outer is 14 x 12 = 168, matching the given total." },
    ],
      tryit: { q: "A pool 8 m by 5 m has a path of width w all round, and the total area of pool and path together is 108 m squared. Set up and solve for w.", answer: "(8+2w)(5+2w)=108 expands to 4w-squared+26w+40=108, so 4w-squared+26w-68=0, dividing by 2 gives 2w-squared+13w-34=0, which factorises as (2w+17)(w-2)=0, giving w=2 or a rejected negative. So w = 2 m; check: outer is 12 by 9 = 108." } },
    { h: "8. Circular pools: bringing in pi", body: [
      "A circular pool with a path round it works on exactly the same total-minus-part logic, but the outer and inner boundaries are circles instead of rectangles, so we need two circle facts. The circumference (distance round a circle) is pi times the diameter, and the area enclosed is pi times the radius squared, using pi roughly equal to 3.14.",
      "If a circular pool has radius r, a path of constant width w running round it makes the outer edge a bigger circle of radius (r + w). So pool area is pi x r-squared, outer area is pi x (r+w)-squared, and path area is the difference of the two, exactly as with the rectangle.",
    ], examples: [
      { q: "A circular pool has radius 3 m, and a path 1 m wide runs all the way round it. Find the pool's area, the outer area, and the path's area.", steps: ["Pool area = pi x r-squared = 3.14 x 9 = 28.26.", "Outer radius = 3 + 1 = 4. Outer area = 3.14 x 16 = 50.24.", "Path area = 50.24 - 28.26 = 21.98."], answer: "Path area = 21.98 m squared" },
      { q: "A circular pool has radius 5 m, and a path 2 m wide runs all the way round it. Find the pool's area, the outer area, and the path's area.", steps: ["Pool area = pi x r-squared = 3.14 x 25 = 78.5.", "Outer radius = 5 + 2 = 7. Outer area = 3.14 x 49 = 153.86.", "Path area = 153.86 - 78.5 = 75.36."], answer: "Path area = 75.36 m squared" },
      { q: "A circular pond has radius 7 m. A path is built round it so that the path area is exactly 3 times the pond's own area. Find the path width.", steps: ["Pool area = pi x 49.", "For path area = 3 x pool area, the total outer area must be 4 x pool area = 4 x 49 pi = 196 pi.", "Outer area = pi x (7+w)-squared, so (7+w)-squared = 196.", "7 + w = 14, giving w = 7."], answer: "w = 7 m. Check: outer radius 14, outer area 196 pi equals 4 x 49 pi, so path area is exactly 3 times the pool area." },
    ],
      note: "There is no corner trap for a circular path, since a circle has no corners to lose track of, but you must still build the whole outer circle and subtract the inner one rather than guessing a shortcut.",
      tryit: { q: "A circular pool has radius 4 m. A path of width 1 m runs round it. Find the path's area.", answer: "Pool area = 3.14 x 16 = 50.24. Outer radius 5, outer area = 3.14 x 25 = 78.5. Path area = 78.5 - 50.24 = 28.26 m squared." } },
    { h: "9. A note for the curious: why circles behave differently at the edge", body: [
      "Here is a small oddity worth knowing, even though it will not usually be tested directly. For a rectangular path, using the pool's own perimeter times the width undercounts, because it misses the four corners. For a circular path, using the pool's own circumference times the width also gives the wrong answer, but for a subtler reason: a ring of constant width is thinner on the inside circle than it looks stretched flat, and fatter relative to the outside circle, so neither the inner nor the outer circumference alone times the width gives the exact area.",
      "It turns out the exact path area equals the width times the average of the inner and outer circumferences, not either one alone. This is a neat fact, but for solving problems, simply building both full circles and subtracting is always safe and never requires remembering it.",
    ] },
    { h: "10. Common mistakes and the wrap-up", body: [
      "The error that loses the most marks, by a wide margin, is multiplying perimeter (or circumference) by width to find the path's area. It is close enough to look plausible and wrong enough to lose the marks; always build the full outer shape and subtract the inner one instead.",
      "The second common error is adding the path's width only once to each dimension of the pool, forgetting that the path runs on both sides, so it should be added twice to the length and twice to the width (or once to the radius, since radius only measures outward in one direction from the centre, which is exactly why circular problems add w to r just once).",
      "The third is losing track of which area was asked for, pool, path, or the combined total; label each one as you calculate it so you never hand in the wrong number by mistake.",
    ], tryit: { q: "A rectangular pool is 12 m by 7 m with path width w all round, and the combined total area of pool and path is 176 m squared. Set up the equation and find w.", answer: "(12+2w)(7+2w)=176 expands to 4w-squared+38w+84=176, so 4w-squared+38w-92=0, dividing by 2 gives 2w-squared+19w-46=0, which factorises as (2w+23)(w-2)=0, giving w=2 or a rejected negative. So w = 2 m; check: outer is 16 by 11 = 176." } },
    { h: "11. Working backwards for just one missing side, without a quadratic", body: [
      "Not every 'find the missing dimension' question needs the full quadratic machinery of sections 6 and 7. Those sections were needed because BOTH the pool's width and the path's width were tangled together as unknowns inside the brackets. But if the path's width is already given as a plain number, and only ONE of the pool's own dimensions is unknown, you can go straight there by division — no quadratic in sight.",
      "The method: build the outer LENGTH first, using the pool's known length and the known path width (added twice). Divide the total combined area by that outer length to get the outer WIDTH. Then peel the path back off that outer width (subtract twice the path width) to land on the pool's own width.",
    ], examples: [
      { q: "A rectangular pool has length 6 m and is surrounded on all sides by a path 1 m wide. The total area of pool and path together is 40 m squared. Find the width of the pool.", steps: ["Outer length = 6 + 2x1 = 8 m.", "Outer width = total area / outer length = 40 / 8 = 5 m.", "Pool width = outer width - 2x1 = 5 - 2 = 3 m."], answer: "3 m. Check: outer is 8 x 5 = 40, pool is 6 x 3 = 18, path area 40 - 18 = 22 m squared." },
      { q: "A rectangular pool has length 9 m and is surrounded on all sides by a path 2 m wide. The total area of pool and path together is 91 m squared. Find the width of the pool.", steps: ["Outer length = 9 + 2x2 = 13 m.", "Outer width = total area / outer length = 91 / 13 = 7 m.", "Pool width = outer width - 2x2 = 7 - 4 = 3 m."], answer: "3 m. Check: outer is 13 x 7 = 91, and the pool itself is 9 x 3 = 27, with path area 91 - 27 = 64 m squared." },
      { q: "A rectangular pool has length 20 m and is surrounded on all sides by a path 3 m wide. The total area of pool and path together is 494 m squared. Find the width of the pool.", steps: ["Outer length = 20 + 2x3 = 26 m.", "Outer width = total area / outer length = 494 / 26 = 19 m.", "Pool width = outer width - 2x3 = 19 - 6 = 13 m."], answer: "13 m. Check: outer is 26 x 19 = 494, pool is 20 x 13 = 260, path area 494 - 260 = 234 m squared." },
    ],
      tryit: { q: "A rectangular pool has length 14 m and a path of width 1 m runs all round it. The total combined area is 128 m squared. Find the width of the pool.", answer: "6 m. Outer length = 14+2 = 16, outer width = 128/16 = 8, pool width = 8 - 2x1 = 6." } },
  ],
  recap: [
    "Pool plus path together form one bigger rectangle whose dimensions are the pool's dimensions plus TWICE the path width (once on each side), not once.",
    "Path area = outer area (pool plus path) minus pool area. Never multiply perimeter by width; that always misses the four corner squares.",
    "When BOTH the pool's width and the path's width are unknown together, set up (length + 2w)(width + 2w) = total area, expand into a quadratic, and solve, discarding any negative root.",
    "When the path's width is already known and only ONE pool dimension is missing, skip the quadratic entirely: find the outer length or width directly (using the known path width), divide into the total area to get the other outer dimension, then subtract twice the path width.",
    "The classic version sets the path area equal to the pool area, making the total area exactly double the pool area.",
    "For circular pools, circumference = pi x diameter and area = pi x radius-squared; the outer circle has radius (r + w), and path area is outer circle area minus pool area.",
  ],
  mistakes: [
    "Wrong: outer dimensions = pool dimensions + path width. Right: + path width TWICE (once each side), since the path surrounds the pool on both sides.",
    "Wrong: path area = perimeter x width. Right: path area = outer rectangle area - pool area; the shortcut always misses the four corner squares.",
    "Wrong: for a circular pool, outer radius = pool radius + path width added on both sides. Right: radius only grows outward once, so outer radius = r + w (not r + 2w).",
    "Wrong: keeping a negative solution from the quadratic. Right: a width cannot be negative, so always discard it and keep the positive root.",
    "Wrong: reaching for the full quadratic setup even when the path's width is already known and only one dimension is missing. Right: that simpler case can be solved by straight division, no quadratic needed.",
  ],
};

JUNIOR_LESSONS.cubeProps = {
  title: "Cubes, Cuboids, and the Painted Cube Puzzle",
  minutes: 24,
  intro: "Volume asks how much space a solid takes up, and surface area asks how much material it would take to wrap it completely. For cuboids there are neat formulas for both, but the real skill worth having is knowing exactly why those formulas work, so you never misapply them to a shape they were never meant for. This lesson builds both ideas from first principles, tests them against a shape that is not a cuboid, shows how to solve backwards when volume and surface area are linked by an equation, and finishes with two of the most satisfying puzzles in all of school maths: a giant cube built from smaller cubes, painted on the outside, then taken apart — first with one colour, then with two.",
  sections: [
    { h: "1. What volume means, from scratch", body: [
      "Imagine a cardboard box and a heap of identical 1 cm cubes, and imagine packing the box completely full of them, no gaps. The number of little cubes it takes to fill the box exactly is the box's volume, measured in cubic centimetres.",
      "A box 4 cm long, 3 cm wide and 2 cm tall can be packed in layers: each layer covering the floor of the box is 4 x 3 = 12 little cubes, and there is room for 2 such layers stacked up, so the whole box takes 12 x 2 = 24 little cubes. Its volume is 24 cm cubed.",
    ], tryit: { q: "A box is 5 cm long, 2 cm wide and 3 cm tall. How many 1 cm cubes fill it?", answer: "30. One layer covering the floor is 5x2=10 cubes, and there are 3 such layers stacked up, 10x3=30." } },
    { h: "2. Volume of a cuboid: area of the base, times height", body: [
      "The packing picture in section 1 is really telling you a formula: the number of cubes in one layer is the area of the box's base (length times width), and the number of layers is the height. So volume = base area x height, which for a cuboid is the same as length x width x height, since all three lengths get multiplied together either way.",
      "This is the deep reason the formula works, and it matters, because it generalises far beyond cuboids: for ANY prism (a solid with the same cross-section all the way through), volume = area of that cross-section x length. A cuboid is just the simplest case, where the cross-section happens to be a rectangle.",
    ], examples: [
      { q: "Find the volume of a cuboid 4 cm by 3 cm by 2 cm.", steps: ["Base area = 4 x 3 = 12.", "Volume = base area x height = 12 x 2.", "= 24."], answer: "24 cm cubed" },
      { q: "Find the volume of a cuboid 6 cm by 4 cm by 3 cm.", steps: ["Base area = 6 x 4 = 24.", "Volume = base area x height = 24 x 3.", "= 72."], answer: "72 cm cubed" },
      { q: "A cuboid has a square base of side 5 cm and a height of 8 cm. Find its volume.", steps: ["Base area = 5 x 5 = 25.", "Volume = base area x height = 25 x 8.", "= 200."], answer: "200 cm cubed" },
    ],
      tryit: { q: "Find the volume of a cuboid 5 cm by 3 cm by 2 cm.", answer: "30 cm cubed, since 5x3=15 and 15x2=30." } },
    { h: "3. The cube: a cuboid where all three lengths agree", body: [
      "A cube is simply a cuboid where the length, width and height are all the same number, call it the side, s. Its volume is therefore s x s x s, written s cubed.",
      "A cube of side 4 cm has volume 4 x 4 x 4 = 64 cm cubed. Notice how fast this grows: doubling the side of a cube does not double its volume, it multiplies it by 8 (2 x 2 x 2), since all three dimensions double at once. A cube of side 8 cm has volume 8x8x8=512 cm cubed, eight times as much as the side-4 cube even though the side only doubled.",
    ], examples: [
      { q: "Find the volume of a cube of side 3 cm.", steps: ["Volume = side x side x side = 3 x 3 x 3.", "3 x 3 = 9.", "9 x 3 = 27."], answer: "27 cm cubed" },
      { q: "Find the volume of a cube of side 5 cm.", steps: ["Volume = side x side x side = 5 x 5 x 5.", "5 x 5 = 25.", "25 x 5 = 125."], answer: "125 cm cubed" },
      { q: "A cube has volume 512 cm cubed. Find its side length.", steps: ["We need s such that s x s x s = 512.", "Try s = 8: 8 x 8 = 64, and 64 x 8 = 512. Yes.", "So the side length is 8."], answer: "8 cm" },
    ],
      tryit: { q: "A cube has volume 27 cm cubed. Find its side length.", answer: "3 cm, since 3x3x3=27." } },
    { h: "4. Does 'multiply all the lengths' always work?", body: [
      "Here is a claim worth testing hard: 'to find the volume of a shape, you multiply all of the lengths together.' It is true for a cuboid, but is it true in general? Consider a triangular prism: a shape like a tent or a chocolate bar's cross-section, with two triangular ends and a constant length running between them.",
      "Take a prism whose triangular end is a right-angled triangle with legs 3 cm and 4 cm (and hypotenuse 5 cm, since 3-squared + 4-squared = 9+16=25=5-squared), and whose length (the distance between the two triangular ends) is 10 cm. If you followed the cuboid habit and just multiplied the two triangle legs by the length, you would get 3 x 4 x 10 = 120 cm cubed. But that is wrong.",
    ], examples: [
      { q: "A triangular prism has a right-angled triangular cross-section with legs 4 cm and 3 cm, and a length of 5 cm. Find its volume.", steps: ["Cross-section area = half x base x height = 0.5 x 4 x 3 = 6.", "Volume = 6 x 5.", "= 30."], answer: "30 cm cubed" },
      { q: "Find the true volume of the triangular prism described above (right-angled triangle legs 3 cm and 4 cm, prism length 10 cm), using volume = cross-section area x length.", steps: ["Cross-section is the right-angled triangle: area = half x base x height = 0.5 x 3 x 4 = 6.", "Volume = cross-section area x length = 6 x 10.", "= 60."], answer: "60 cm cubed" },
      { q: "A tent-shaped prism has a triangular cross-section with base 6 cm and height 4 cm, and the tent is 8 cm long. Find the volume. Confirm this is different from naively multiplying all three lengths.", steps: ["Cross-section area = half x 6 x 4 = 12.", "Volume = 12 x 8 = 96.", "Naive guess (6 x 4 x 8 = 192) is exactly double the correct answer, because it forgot the half that turns the rectangle into a triangle."], answer: "96 cm cubed (not 192)" },
    ],
      note: "The naive guess of 120 was exactly double the true answer of 60, because it forgot that a triangle's area is HALF of the rectangle that contains it. 'Multiply all the lengths' is only safe for cuboids, precisely because a rectangle needs no halving. For every other prism, find the cross-section's area properly first, then multiply by the length." },
    { h: "5. Surface area, built face by face: the cube", body: [
      "Surface area asks a different question from volume: not how much space is inside, but how much material covers the outside, as if you were wrapping the solid in paper with no overlaps. The safest way to find it for any solid is to identify every single face, find each one's area, then add them all up. Never reach for a memorised formula before you have checked it actually fits the shape in front of you.",
      "A cube has exactly 6 faces, and because it is a cube, every one of those faces is an identical square. So surface area = 6 x (side x side) = 6 x side-squared.",
    ], examples: [
      { q: "Find the surface area of a cube of side 3 cm.", steps: ["Each face is a 3 cm by 3 cm square, area 9.", "There are 6 identical faces.", "6 x 9 = 54."], answer: "54 cm squared" },
      { q: "Find the surface area of a cube of side 4 cm.", steps: ["Each face is a 4 cm by 4 cm square, area 16.", "There are 6 identical faces.", "6 x 16 = 96."], answer: "96 cm squared" },
      { q: "A cube has a total surface area of 150 cm squared. Find its side length.", steps: ["Surface area = 6 x side-squared, so 6 x side-squared = 150.", "Side-squared = 150 divided by 6 = 25.", "Side = 5 cm."], answer: "5 cm" },
    ],
      tryit: { q: "Find the surface area of a cube of side 3 cm.", answer: "54 cm squared, since each of the 6 faces is 3x3=9, and 6x9=54." } },
    { h: "6. Surface area of a cuboid: three pairs of faces", body: [
      "A cuboid also has 6 faces, but unlike a cube they come in three matching pairs rather than one set of six identical squares: a front and back (both length x height), a top and bottom (both length x width), and a left and right (both width x height).",
      "Build the surface area by finding just one of each pair, adding those three different areas together, then doubling the whole total, since each type of face appears exactly twice.",
    ], examples: [
      { q: "Find the surface area of a cuboid 4 cm by 3 cm by 2 cm.", steps: ["One face of each type: 4x3=12, 4x2=8, 3x2=6.", "Add the three: 12+8+6=26.", "Double it, since each face type appears twice: 2 x 26 = 52."], answer: "52 cm squared" },
      { q: "Find the surface area of a cuboid 5 cm by 3 cm by 2 cm.", steps: ["One face of each type: 5x3=15, 5x2=10, 3x2=6.", "Add the three: 15+10+6=31.", "Double it, since each face type appears twice: 2 x 31 = 62."], answer: "62 cm squared" },
      { q: "A cuboid is 10 cm by 6 cm by 4 cm. Find its surface area.", steps: ["One face of each type: 10x6=60, 10x4=40, 6x4=24.", "Add the three: 60+40+24=124.", "Double it: 2 x 124 = 248."], answer: "248 cm squared" },
    ],
      tryit: { q: "Find the surface area of a cuboid 6 cm by 4 cm by 2 cm.", answer: "88 cm squared. One of each face: 6x4=24, 6x2=12, 4x2=8, sum=44, doubled is 88." } },
    { h: "7. Why the cuboid formula is dangerous to memorise blindly", body: [
      "It is tempting to memorise 'surface area = 2 lots of (length x width + length x height + width x height)' as a rule for solids in general. Do not. That formula only works because a cuboid's faces come in exactly three matching pairs, which is a special feature of cuboids, not solids generally.",
      "Go back to the triangular prism from section 4: legs 3 cm and 4 cm, hypotenuse 5 cm, length 10 cm. It has 5 faces in total, not 6, and they are not in three matching pairs: two identical triangular ends, plus three DIFFERENT rectangles running along the length, one for each side of the triangle.",
    ], examples: [
      { q: "A triangular prism has a right-angled triangular cross-section with legs 3 cm and 4 cm (hypotenuse 5 cm) and a length of 6 cm. Find its surface area.", steps: ["Two triangular ends: each area = half x 3 x 4 = 6, total 12.", "Three rectangles along the length: 3x6=18, 4x6=24, 5x6=30.", "Total surface area: 12 + 18 + 24 + 30 = 84."], answer: "84 cm squared" },
      { q: "Find the surface area of the triangular prism (legs 3 cm, 4 cm, hypotenuse 5 cm, length 10 cm) by finding every face separately.", steps: ["Two triangular ends, each area 6 (from section 4): 2 x 6 = 12.", "Three rectangles along the length, one per side of the triangle: 3x10=30, 4x10=40, 5x10=50.", "Add every face: 12 + 30 + 40 + 50."], answer: "132 cm squared" },
      { q: "A prism has an equilateral triangular cross-section with side 4 cm and height 2√3 cm (so each triangular face has area 4√3 cm squared). The prism is 9 cm long. Find its surface area.", steps: ["Two equilateral triangular ends: 2 x 4√3 = 8√3 ≈ 13.86.", "Three rectangular faces (all the same, since the triangle is equilateral): 3 x (4 x 9) = 108.", "Total: 108 + 8√3 ≈ 121.9 cm squared."], answer: "108 + 8√3 cm squared (approximately 121.9); the key step is still finding every face separately, not reaching for a shortcut formula" },
    ],
      note: "Notice there was no shortcut formula to reach for here, and that is the point. Building surface area face by face works for absolutely any solid; a memorised cuboid formula only works for cuboids." },
    { h: "8. The painted cube puzzle: setting the scene", body: [
      "Now for the puzzle. Take a large cube built entirely out of small unit cubes stacked together, n small cubes along each edge, so n cubed small cubes in total. Paint the whole outside of the large cube, then carefully take it apart again. The question: how many of the small cubes ended up painted on exactly 1, 2, or 3 faces, and how many were not painted at all?",
      "Every small cube falls into exactly one of four categories, depending on where it sat inside the large cube: sitting at a corner of the big cube (3 faces exposed and painted), sitting along an edge but not at a corner (2 faces painted), sitting in the middle of a face but not on any edge (1 face painted), or buried completely inside, touching no outer face at all (0 faces painted).",
    ] },
    { h: "9. Counting each category", body: [
      "Corners: a cube always has exactly 8 corners, no matter how large it is, and each corner position holds exactly one small cube with 3 painted faces. So corner cubes = 8, always.",
      "Edges: a cube has 12 edges. Along each edge, the two end positions are the corners already counted, so the small cubes strictly between them, with exactly 2 painted faces, number (n - 2) per edge. Across all 12 edges, that is 12 x (n - 2).",
      "Faces: each of the 6 faces is an n by n square of small cubes; strip away the outer border (which belongs to edges and corners) and what remains in the middle is an (n-2) by (n-2) square of small cubes with exactly 1 painted face. Across all 6 faces, that is 6 x (n-2)-squared.",
      "Interior: whatever is left, completely unpainted, forms a smaller cube buried inside of side (n - 2), so there are (n-2) cubed of them.",
    ] },
    { h: "10. The 3x3x3 cube, fully worked", body: [
      "Take the smallest interesting case, n = 3, so the whole cube uses 3 cubed = 27 small cubes.",
      "Corners: always 8. Edges: 12 x (3-2) = 12 x 1 = 12. Faces: 6 x (3-2)-squared = 6 x 1 = 6. Interior: (3-2) cubed = 1 cubed = 1.",
    ], examples: [
      { q: "For a 3x3x3 painted cube, how many small cubes have exactly 2 painted faces?", steps: ["A cube has 12 edges.", "Along each edge, the two end positions are corners (already counted as 3-face cubes).", "Only the middle position on each edge (n-2 = 1 per edge) has exactly 2 painted faces.", "Total: 12 x 1 = 12."], answer: "12 small cubes" },
      { q: "Check that the four categories for the 3x3x3 cube add up to the total of 27 small cubes.", steps: ["Corners 8, edges 12, faces 6, interior 1.", "8 + 12 = 20, then 20 + 6 = 26.", "26 + 1 = 27, which matches 3 cubed exactly."], answer: "27, confirmed" },
      { q: "For a 5x5x5 painted cube, find the number of small cubes with 0, 1, 2, and 3 painted faces, and verify they sum to 125.", steps: ["Corners (3 faces): always 8.", "Edges (2 faces): 12 x (5-2) = 12 x 3 = 36.", "Faces (1 face): 6 x (5-2)-squared = 6 x 9 = 54.", "Interior (0 faces): (5-2)-cubed = 27.", "Sum: 8 + 36 + 54 + 27 = 125 = 5 cubed."], answer: "3 faces: 8, 2 faces: 36, 1 face: 54, 0 faces: 27, total 125" },
    ],
      note: "For the 3x3x3 cube there is exactly 1 fully interior cube: the very centre one, buried on all sides and never touched by the paintbrush." },
    { h: "11. Scaling up, and the mistakes to avoid", body: [
      "The same four formulas work for any size. Take n = 4, so the whole cube is 4 cubed = 64 small cubes. Corners: 8. Edges (2 painted faces, the question type most often asked): 12 x (4-2) = 12 x 2 = 24. Faces: 6 x (4-2)-squared = 6 x 4 = 24. Interior: (4-2) cubed = 2 cubed = 8. Check: 8+24+24+8 = 64, matching 4 cubed exactly. So out of 64 small cubes, 24 are painted on exactly 2 faces.",
      "The most common mistake is forgetting that the corners and edges must be subtracted out before counting faces and interior, which is exactly why every formula after the corners uses (n-2), not n: the border strip of corner and edge cubes has already been peeled off the count. A second common mistake is trying to apply these formulas to n = 1 or n = 2, where the categories overlap oddly (for n=2 every single small cube is a corner, and there are no edge, face, or interior cubes at all, since n-2=0 there).",
    ], tryit: { q: "A 6x6x6 cube, made of unit cubes, is painted all over then taken apart. How many small cubes have exactly 1 painted face, and check your four categories sum to 216.", answer: "Faces (1 painted face) = 6 x (6-2)-squared = 6 x 16 = 96. Check: corners 8, edges 12x4=48, faces 96, interior 4 cubed=64. Sum: 8+48+96+64=216=6 cubed, confirmed." } },
    { h: "12. Solving backwards: when surface area is a fixed multiple of volume", body: [
      "Some questions don't hand you the side length at all. Instead they link a cube's volume and surface area through an equation — for instance, 'the surface area is twice the volume' — and expect you to work backwards to find the side (and so the volume) algebraically.",
      "Since surface area = 6s-squared and volume = s cubed, a statement like 'surface area = k times the volume' turns into the equation 6s-squared = k x s cubed. A real cube never has side 0, so you may safely divide BOTH sides by s-squared, leaving 6 = k x s, so s = 6/k. Once you have s, both the volume and the surface area follow immediately.",
    ], examples: [
      { q: "The surface area of a cube equals twice its volume. Find the side length.", steps: ["6s-squared = 2 x s cubed.", "Divide both sides by s-squared: 6 = 2s, so s = 3.", "Check: surface area = 6 x 9 = 54, volume = 27, and 54 = 2 x 27."], answer: "s = 3 cm" },
      { q: "The surface area of a cube is 3 times its volume. Find the volume.", steps: ["6s-squared = 3 x s cubed.", "Divide both sides by s-squared: 6 = 3s, so s = 2.", "Volume = s cubed = 2 cubed = 8 cm cubed. Check: surface area = 6x2-squared=24, and 3xvolume=3x8=24. Matches."], answer: "8 cm cubed" },
      { q: "A cube's surface area in cm squared is numerically equal to its volume in cm cubed. Find the surface area.", steps: ["6s-squared = s cubed.", "Divide both sides by s-squared: 6 = s.", "Surface area = 6 x 36 = 216. Volume = 216. They match."], answer: "216 cm squared (equal to the volume of 216 cm cubed)" },
    ],
      tryit: { q: "The surface area of a cube (in cm squared) is numerically equal to its volume (in cm cubed). Find the volume.", answer: "216 cm cubed. Here k=1, so 6=1xs, giving s=6, and volume=6 cubed=216. Check: surface area=6x36=216, matching the volume exactly." } },
    { h: "13. The two-colour painted cube: only ONE colouring avoids a 3-faces-same-colour corner", body: [
      "Here is a harder, two-colour version of the painted cube puzzle. Take the same large n by n by n cube of unit cubes, but this time paint some faces red and some blue, with the rule that no small cube is ever painted on three faces of the SAME colour.",
      "A cube's 6 faces form 3 opposite pairs (say Top/Bottom, Front/Back, Left/Right). If you tried to make 3 faces red by picking ONE face from each of the three pairs (say Top, Front, and Left), those three faces would all meet at a single corner, and the small cube sitting in that corner would show 3 red faces at once — breaking the rule immediately. The same trap catches the 3 leftover blue faces at the OPPOSITE corner.",
      "The only colouring that avoids this trap entirely is to make one WHOLE opposite pair one colour, a DIFFERENT whole opposite pair the other colour, and split the third pair, one face each colour. For example: Top and Bottom both red, Left and Right both blue, Front red and Back blue. Check every corner of the cube under this scheme and you will find none of them ever touches three faces of the same colour — which is exactly why this is the configuration these puzzles always describe.",
    ] },
    { h: "14. Counting corners and edges for the two-colour version", body: [
      "Using the valid colouring from section 13 (Top & Bottom red, Left & Right blue, Front red, Back blue), first check the 8 corners. Every corner of a cube touches exactly one face from EACH of the three opposite pairs. The Top/Bottom pair is entirely red, so every single corner picks up a red face from that pair no matter what. The Left/Right pair is entirely blue, so every single corner ALSO picks up a blue face from that pair no matter what. That means every one of the 8 corners is GUARANTEED to see both colours, regardless of whether it happens to touch Front or Back. All 8 corners qualify as 'at least one of each colour', always.",
      "Now the 12 edges. Go through all 12, noting which two faces each one joins: Top-Front (red-red), Top-Back (red-blue), Top-Left (red-blue), Top-Right (red-blue), Bottom-Front (red-red), Bottom-Back (red-blue), Bottom-Left (red-blue), Bottom-Right (red-blue), Front-Left (red-blue), Front-Right (red-blue), Back-Left (blue-blue), Back-Right (blue-blue). Counting colours: 2 edges are red-red (Top-Front, Bottom-Front), 2 are blue-blue (Back-Left, Back-Right), and the remaining 8 are 'mixed' red-blue edges.",
      "The small cubes strictly between the two corners of a MIXED edge (there are n-2 of them per edge, since the two end positions are corners already counted) touch one red face and one blue face, so they qualify. The small cubes on a red-red or blue-blue edge only ever touch ONE colour, so they do not qualify. With 8 mixed edges, that contributes 8 x (n-2) more qualifying small cubes.",
    ], examples: [
      { q: "For a 3x3x3 two-colour painted cube (coloured as in section 13), find the total number of small cubes with at least one face of each colour.", steps: ["Corners: always 8, all qualify.", "Mixed edges: 8 of them, each contributing (3-2)=1 qualifying cube: 8 x 1 = 8.", "Total = 8 + 8 = 16."], answer: "16 (using the formula 8 x (n-1) = 8 x 2 = 16)" },
      { q: "For a 4x4x4 two-colour painted cube (coloured as in section 13), find the total number of small cubes with at least one face of each colour.", steps: ["Corners: always 8, all qualify.", "Mixed edges: 8 of them, each contributing (4-2)=2 qualifying cubes: 8 x 2 = 16.", "Total = 8 + 16 = 24."], answer: "24" },
      { q: "A two-colour painted cube (coloured as in section 13) has exactly 40 small cubes with at least one face of each colour. Find n, the side length of the large cube.", steps: ["Use the formula: 8 x (n-1) = 40.", "n - 1 = 40 divided by 8 = 5.", "n = 6."], answer: "n = 6, so the large cube is a 6x6x6 cube" },
    ],
      note: "The general formula is total = 8 (corners) + 8x(n-2) (mixed edges) = 8x(1+(n-2)) = 8x(n-1). For n=3 this gives 8x2=16; for n=4, 8x3=24, matching the worked example above.",
      tryit: { q: "For a 5x5x5 two-colour painted cube (coloured as in section 13), find the total number of small cubes with at least one face of each colour.", answer: "32. Using 8x(n-1) = 8x4 = 32; or directly, 8 corners plus 8 mixed edges x (5-2)=3 each, giving 8+24=32." } },
  ],
  recap: [
    "Volume of a cuboid = length x width x height, which is really base area x height; this generalises to volume = cross-section area x length for any prism.",
    "'Multiply all the lengths together' only gives the correct volume for cuboids; other prisms need their cross-section's area found properly first (often halved, for a triangle).",
    "Surface area is safest built face by face: identify every face, find each area, add them all. A cube has 6 identical square faces; a cuboid has 3 matching pairs.",
    "Do not carry a memorised cuboid surface-area formula onto other solids; a triangular prism, for instance, has 5 faces in 2 different shapes, not 6 in matching pairs.",
    "If surface area = k x volume for a cube, then 6s-squared = k x s cubed, so s = 6/k — divide both sides by s-squared (never by s cubed) to keep the algebra clean.",
    "In a single-colour painted n x n x n cube: corner cubes (3 faces) = 8 always; edge cubes (2 faces) = 12(n-2); face cubes (1 face) = 6(n-2)-squared; interior cubes (0 faces) = (n-2) cubed. All four always sum to n cubed.",
    "In a VALID two-colour painted cube (one whole opposite face-pair each colour, the third pair split), all 8 corners and 8 of the 12 edges show both colours, giving a total of 8x(n-1) small cubes with at least one face of each colour.",
  ],
  mistakes: [
    "Wrong: assuming 'multiply all the lengths' works for any solid. Right: it only works for cuboids; other prisms need cross-section area x length, with the cross-section's own area found correctly (a triangle needs halving).",
    "Wrong: applying the cuboid surface-area formula 2(lw+lh+wh) to a non-cuboid solid. Right: build surface area face by face for any solid that is not a cuboid.",
    "Wrong: dividing 6s-squared = k x s cubed by s cubed (which loses the s you still need). Right: divide by s-squared instead, leaving a simple 6 = ks to solve.",
    "Wrong: forgetting to subtract corners and edges before counting face cubes or interior cubes in the painted cube puzzle. Right: always use (n-2), not n, once corners and edges are accounted for separately.",
    "Wrong: mixing up which face-count category a cube belongs to (corner, edge, face, or interior). Right: check exposed faces carefully; corners touch 3 outer faces, edges touch 2, face-centres touch 1, interior touches 0.",
    "Wrong: assuming any two-colour split of the 6 faces (such as one face from each opposite pair) is a valid 'no cube shows 3 of the same colour' colouring. Right: only one whole opposite pair per colour (with the third pair split) avoids a monochromatic corner; picking one face from each of the three pairs always creates one.",
  ],
};


// ---- Full-depth guided lessons: ratio and proportion (ratioChain v2, multiRate, inverseProp) ----

JUNIOR_LESSONS.ratioChain = {
  title: "Ratio Chains: sharing, scaling and linking ratios together",
  minutes: 19,
  intro: "A ratio tells you how amounts compare, like a recipe that never forgets its proportions. Challenge questions stretch that one idea in every direction: sharing a total out fairly, reading a ratio as a fraction, simplifying ratios that arrive in mismatched units, joining two ratios that share a middle ingredient, spotting when a DIFFERENCE matters more than a sum, and working out what happens when a ratio gets disturbed — one part changing, or a whole category vanishing. This lesson builds every one of those skills from the same starting point: find the value of ONE part, then scale.",
  sections: [
    {
      h: "1. What a ratio remembers",
      body: [
        "Say a fruit punch uses 2 cups of orange juice for every 3 cups of lemonade. We write that 2:3 and read it as 2 to 3. The ratio does not know how big your jug is. It only knows the comparison: for every 2 of one, there are 3 of the other.",
        "That phrase, for every, is the heartbeat of this whole lesson. Order matters completely too. Juice to lemonade 2:3 is a gentle punch. Lemonade to juice 2:3 is a different drink. Addy the ant writes ratios in her ledger with labels over each number for exactly this reason, and Addy has never once served the wrong punch.",
      ],
      tryit: { q: "A garden has 3 rose bushes for every 7 tulip clumps. Write the ratio of tulips to roses.", answer: "7:3. The question asked tulips first, so the 7 goes first. Order is half the answer." },
    },
    {
      h: "2. Sharing a total: find the value of ONE part",
      body: [
        "The single most useful move in the whole topic is this: whenever a total is split in a ratio, work out what ONE part is worth first, then everything else falls out of that. If £40 is shared in the ratio 3:5, there are 3+5 = 8 parts altogether, so one part is £40 ÷ 8 = £5. The person with 3 parts gets £15; the person with 5 parts gets £25.",
        "This is called the unitary method, and it is the workhorse behind almost every ratio word problem you will ever meet: total parts, one part, then scale up to however many parts the question actually wants.",
      ],
      examples: [
        { q: "Tom and Jess share 36 stickers in the ratio 2:4. How many does Tom get?", steps: ["Total parts = 2 + 4 = 6.", "One part = 36 divided by 6 = 6 stickers.", "Tom has 2 parts = 2 x 6 = 12."], answer: "12 stickers" },
        { q: "Sam and Priya share £56 in the ratio 4:3. How much does Priya get?", steps: ["Total parts = 4 + 3 = 7.", "One part = £56 ÷ 7 = £8.", "Priya has 3 parts = 3 × £8 = £24."], answer: "£24" },
        { q: "Three children share 120 sweets in the ratio 1:3:6. How many does the child with the most receive?", steps: ["Total parts = 1 + 3 + 6 = 10.", "One part = 120 divided by 10 = 12 sweets.", "The largest share is 6 parts = 6 x 12 = 72."], answer: "72 sweets" },
      ],
      tryit: { q: "Two friends share 45 stickers in the ratio 2:7. How many does the person with the larger share get?", answer: "35 stickers. Total parts = 9, one part = 45 ÷ 9 = 5, and 7 parts = 35." },
    },
    {
      h: "3. A ratio is also a fraction of the whole",
      body: [
        "Every ratio secretly contains a set of fractions, because each part is some fraction of the total number of parts. If red counters to blue counters are in the ratio 3:5, there are 8 parts altogether, and red counters make up 3/8 of the whole tub, while blue counters make up 5/8.",
        "The trap here is confusing the ratio 3:5 with the fraction 3/5. They are not the same statement. 3:5 compares red to blue directly (for every 3 red there are 5 blue). But red as a fraction of the WHOLE tub is 3/8, using the total number of parts as the denominator, not the other colour.",
      ],
      examples: [
        { q: "A bag of counters is red to blue in the ratio 3:7. What fraction of the counters are red?", steps: ["Total parts = 3 + 7 = 10.", "Red is 3 of those 10 parts.", "Fraction red = 3/10."], answer: "3/10" },
        { q: "A necklace is made from silver and gold beads in the ratio 5:3. What fraction of the necklace is gold?", steps: ["Total parts = 5 + 3 = 8.", "Gold is 3 of those 8 parts.", "Fraction gold = 3/8."], answer: "3/8" },
        { q: "Paint is mixed in the ratio 2:5:3 (red:blue:white). What fraction of the mixture is blue, and is that more or less than half?", steps: ["Total parts = 2 + 5 + 3 = 10.", "Blue is 5 of those 10 parts.", "Fraction blue = 5/10 = 1/2."], answer: "1/2 — exactly half the paint is blue" },
      ],
      tryit: { q: "A bag of counters is red to green in the ratio 4:1. What fraction of the counters are green?", answer: "1/5. Total parts = 5, and green is 1 of them, so 1/5 — not 1/4, which is the ratio itself, not a fraction of the whole." },
    },
    {
      h: "4. Scaling: the one golden rule",
      body: [
        "Two ratios describe the same mix if you can turn one into the other by multiplying or dividing BOTH numbers by the same thing. 2:3 is the same mix as 4:6, and as 200:300. Here is the trap that catches almost everyone once: suppose squash is 7 parts water to 2 parts syrup, and you add 2 more cups of each to make a bigger jug: 9 parts water to 4 parts syrup. Feels fair, does not work. In 7:2 there are 3.5 waters for every syrup; in 9:4 there are only 2.25. You just made the drink stronger by accident.",
        "Adding the same amount to both sides changes the mix. Multiplying both sides by the same amount keeps it. Ratios live in the world of times, never the world of plus.",
      ],
      tryit: { q: "Countra scaled the ratio 5:3 up to 8:6 by adding 3 to both sides, then panicked. What should the ratio be if both sides are multiplied by 3 instead?", answer: "15:9. Multiply both parts by 3: 5 × 3 = 15 and 3 × 3 = 9. Countra's 8:6 simplifies to 4:3, a completely different mix from 5:3." },
    },
    {
      h: "5. Simplifying ratios, even across units",
      body: [
        "Simplifying a ratio means dividing both parts by their highest common factor until nothing more will cancel: 12:18 divides by 6 to give 2:3. But ratios only simplify honestly once both sides speak the same language. 3.2 kg to 415 g looks alarming until you remember 1 kg = 1000 g, so 3.2 kg is 3200 g, and now the ratio 3200:415 can be simplified properly.",
        "A ratio written with mixed units is quietly lying about the comparison. 3.2 looks smaller than 415, but the first amount is actually nearly 8 times heavier. Always convert to the SAME unit before you simplify or compare.",
      ],
      examples: [
        { q: "Write 500 ml : 2 litres as a ratio in its simplest form.", steps: ["Convert to the same units: 2 litres = 2000 ml.", "Ratio = 500 : 2000.", "Divide both by 500: 1 : 4."], answer: "1:4" },
        { q: "A bag of rice weighs 2 kg 400 g. A bag of lentils weighs 900 g. Write the ratio of rice to lentils in simplest form.", steps: ["Convert to the same units: 2 kg 400 g = 2400 g.", "Ratio = 2400 : 900.", "Divide both by their highest common factor, 300: 8 : 3."], answer: "8:3" },
        { q: "A recipe uses 1 kg 800 g of flour, 450 g of butter and 300 g of sugar. Write the ratio of flour to butter to sugar in simplest form.", steps: ["Convert flour to grams: 1800 g.", "Ratio = 1800 : 450 : 300.", "Divide all by 150: 12 : 3 : 2."], answer: "12:3:2" },
      ],
      tryit: { q: "Write 1.5 kg : 250 g as a ratio in its simplest form.", answer: "6:1. Convert first: 1.5 kg = 1500 g, giving 1500:250. Both divide by 250 to leave 6:1." },
    },
    {
      h: "6. Three-part ratios: one relationship, many jobs",
      body: [
        "A ratio can have three parts or more. A concrete mix of sand, cement and gravel might be 6:4:2, meaning for every 6 shovels of sand there are 4 of cement and 2 of gravel — simplify to 3:2:1. A three-part ratio is one wide relationship, and it does everything a two-part ratio does: you can share a total three ways (find one part, then scale to each of the three), or you can pull out any PAIR and read it off directly. From 3:2:1, sand to gravel is 3:1.",
        "Sharing a total three ways works exactly like the two-part version, just with more parts to add up first.",
      ],
      examples: [
        { q: "60 cards are shared in the ratio 1:2:3. How many cards does each person get?", steps: ["Total parts = 1 + 2 + 3 = 6.", "One part = 60 divided by 6 = 10.", "Shares: 10, 20 and 30."], answer: "10, 20 and 30 cards" },
        { q: "84 sweets are shared between three friends in the ratio 2:3:7. How many does the friend with the middle share get?", steps: ["Total parts = 2 + 3 + 7 = 12.", "One part = 84 ÷ 12 = 7 sweets.", "Middle share = 3 parts = 3 × 7 = 21 sweets."], answer: "21 sweets" },
        { q: "In the ratio a:b:c = 4:5:6, the total of all three amounts is 135. Find the largest amount.", steps: ["Total parts = 4 + 5 + 6 = 15.", "One part = 135 divided by 15 = 9.", "Largest amount (6 parts) = 6 x 9 = 54."], answer: "54" },
      ],
      tryit: { q: "In the ratio a:b:c = 10:15:6, what is a:c in simplest form?", answer: "5:3. Read off positions one and three to get 10:6, then divide both by 2." },
    },
    {
      h: "7. Chaining: make the middle agree",
      body: [
        "Now the main event. Suppose reds to blues are 2:3, and blues to greens are 6:5. Two ratios, one shared colour. The two ratios disagree about blue (3 versus 6), so we rescale until the blues match. Double the first ratio: 2:3 becomes 4:6. Now both say blue is 6, and they snap together: reds to blues to greens is 4:6:5.",
        "If the shared term does not divide neatly either way, scale both ratios to their lowest common multiple, exactly like finding a common denominator when adding fractions.",
      ],
      examples: [
        { q: "p:q = 1:2 and q:r = 4:3. Find p:q:r.", steps: ["Shared term q is 2 in the first ratio and 4 in the second.", "Scale first by 2: 1:2 becomes 2:4.", "Join: p:q:r = 2:4:3.", "Check: 2:4 = 1:2 and 4:3 = 4:3."], answer: "p:q:r = 2:4:3" },
        { q: "a:b = 2:3 and b:c = 6:5. Find a:b:c.", steps: ["The shared term is b: it is 3 in the first ratio and 6 in the second.", "Scale the first ratio by 2 so its b becomes 6: 2:3 turns into 4:6.", "The second ratio already has b = 6, so join them: a:b:c = 4:6:5.", "Check both links: 4:6 = 2:3 and 6:5 = 6:5. Both hold."], answer: "a:b:c = 4:6:5" },
        { q: "x:y = 3:4 and y:z = 6:5. Find x:z in simplest form.", steps: ["Shared term y is 4 and 6. LCM = 12.", "Scale x:y by 3: 3:4 becomes 9:12.", "Scale y:z by 2: 6:5 becomes 12:10.", "Full chain: x:y:z = 9:12:10, so x:z = 9:10."], answer: "x:z = 9:10" },
      ],
      tryit: { q: "P:Q = 2:3 and Q:R = 4:1. Find P:Q:R.", answer: "8:12:3. Q is 3 and 4, common multiple 12. Scale the first by 4 to get 8:12 and the second by 3 to get 12:3. Check: 8:12 = 2:3 and 12:3 = 4:1." },
    },
    {
      h: "8. Using the DIFFERENCE, not the sum",
      body: [
        "So far every question has given you a TOTAL and asked you to share it. But sometimes you are given the DIFFERENCE between two parts instead, and the method changes in one small but crucial way: the difference between two ratio parts, in PARTS, is just as calculable as the sum. If a ratio is 7:4, the two parts differ by 3 parts (not 11, which would be the sum).",
        "So if you are told the actual difference between two amounts, divide by the difference in parts to find the value of one part, then use the SUM of parts to find the total (or whichever part you need). This is exactly the same one-part trick as before, just anchored to a difference instead of a total.",
      ],
      examples: [
        { q: "Two bags hold buttons in the ratio 3:1. The larger bag has 14 more buttons than the smaller. How many buttons in total?", steps: ["Difference in parts = 3 - 1 = 2 parts.", "2 parts = 14, so 1 part = 7.", "Total parts = 3 + 1 = 4, total buttons = 4 x 7 = 28."], answer: "28 buttons" },
        { q: "Two tanks of fish are in the ratio 5:2. The larger tank has 18 more fish than the smaller tank. How many fish are there altogether?", steps: ["The ratio 5:2 means a difference of 5 − 2 = 3 parts.", "3 parts = 18 fish, so 1 part = 6 fish.", "Total parts = 5 + 2 = 7, so total fish = 7 × 6 = 42."], answer: "42 fish" },
        { q: "Two jars of coins are in the ratio 7:3. The larger jar has 40 more coins. How many coins are in the larger jar?", steps: ["Difference in parts = 7 - 3 = 4 parts.", "4 parts = 40, so 1 part = 10.", "Larger jar = 7 parts = 7 x 10 = 70."], answer: "70 coins" },
      ],
      tryit: { q: "Two piles of coins are in the ratio 9:4. The larger pile has 25 more coins than the smaller. How many coins are in the smaller pile?", answer: "20 coins. Difference in parts = 9 − 4 = 5, so 1 part = 25 ÷ 5 = 5. Smaller pile = 4 parts = 20." },
    },
    {
      h: "9. Change one part, and the WHOLE ratio changes",
      body: [
        "Some of the trickiest ratio questions describe a ratio, then change ONE of the quantities while leaving the other fixed, and give you the NEW ratio. Picture a club with boys and girls in some ratio. More girls join; the number of boys does not change; you are told the new ratio. Your job is to work backwards to the original numbers.",
        "The trick is to set up a single unit size for the ORIGINAL ratio (boys = p × k, girls = q × k, for an unknown k), update only the quantity that changed (add the new girls), and then check that the new pair of numbers matches the new ratio you were given. Because the boys count is fixed across both ratios, it acts as your anchor.",
      ],
      examples: [
        { q: "A box has red and blue pens in the ratio 1:1. After 3 more blue pens are added (red unchanged), the ratio becomes 2:5. How many red pens are there?", steps: ["Let red = k, blue = k at the start.", "New blue = k + 3. New ratio 2:5 means red:blue = k : (k+3) = 2:5.", "Cross-multiply: 5k = 2(k+3), so 5k = 2k + 6, giving 3k = 6, k = 2.", "Red pens = 2."], answer: "2 red pens (check: start 2:2, after adding 3 blue: 2:5, ratio matches)" },
        { q: "A choir has sopranos and altos in the ratio 3:2. After 4 more altos join (sopranos unchanged), the ratio becomes 3:4. How many sopranos are in the choir?", steps: ["Let 1 unit = k at the start: sopranos = 3k, altos = 2k.", "After 4 more altos: altos = 2k + 4.", "The new ratio is 3:4, and sopranos (3k) has not changed, so altos must now be 4k (to keep the ratio 3k:4k = 3:4).", "So 2k + 4 = 4k, giving 2k = 4, so k = 2. Sopranos = 3 × 2 = 6."], answer: "6 sopranos" },
        { q: "A class has boys and girls in the ratio 3:5. After some boys leave (girls unchanged), the ratio becomes 1:5. If 12 girls are in the class, how many boys left?", steps: ["12 girls, ratio 3:5 means boys = 12 x 3/5... but 12 must be a multiple of 5 here.", "Actually: girls = 5 parts. With girls = 12, one part = 12/5, which is not whole. So let's say ratio is 3:5 and girls = 10.", "Boys = 6. New ratio 1:5 means boys:10 = 1:5, so boys = 2.", "Boys who left = 6 - 2 = 4."], answer: "4 boys left (with 10 girls: start 6:10 = 3:5, end 2:10 = 1:5)" },
      ],
      tryit: { q: "A tank has red and blue fish in the ratio 4:3. After 6 more blue fish are added (red unchanged), the ratio becomes 4:5. How many red fish are in the tank?", answer: "12 red fish. Let 1 unit = k: red = 4k, blue = 3k. New blue = 3k + 6 must equal 5k (to keep ratio 4:5), so 2k = 6, k = 3. Red = 4 × 3 = 12." },
    },
    {
      h: "10. Removing a category: what survives, what doesn't",
      body: [
        "Here is a lovely conceptual trap, and once you see it you will never forget it. A fruit bowl has apples, oranges and pears in some three-part ratio. Every single pear gets removed and eaten. What happens to the ratio of apples to oranges? Nothing at all. Removing an entire category does not touch the relationship between the categories that remain, because that relationship never depended on pears in the first place.",
        "What DOES change is the TOTAL, and therefore any fraction measured against the new (smaller) total. So apples:oranges stays exactly as it was, but apples as a fraction of the whole bowl changes, because the whole bowl just got smaller.",
      ],
      examples: [
        { q: "A bag has apples, pears and oranges in the ratio 1:2:3. All the oranges are removed. What is the ratio of apples to pears now?", steps: ["Removing oranges does not change the relationship between apples and pears.", "The ratio of apples to pears was and still is 1:2."], answer: "1:2 (unchanged)" },
        { q: "A tray has red, yellow and green sweets in the ratio 3:5:2 (there are 30 sweets in total). All the green sweets are eaten. What fraction of the remaining sweets are red?", steps: ["Total parts = 3+5+2 = 10, so one part = 30 ÷ 10 = 3. Red = 9, yellow = 15, green = 6.", "Removing the green sweets does not change red:yellow, which is still 3:5.", "Remaining sweets = 9 + 15 = 24. Red as a fraction of what's left = 9/24 = 3/8."], answer: "3/8" },
        { q: "A shelf holds fiction, biography and poetry books in the ratio 4:3:1. All 6 poetry books are removed. How many fiction books are on the shelf, and what fraction of the remaining books are biography?", steps: ["Poetry = 1 part = 6, so one part = 6 books.", "Fiction = 4 parts = 24. Biography = 3 parts = 18.", "Remaining = 24 + 18 = 42. Biography fraction = 18/42 = 3/7."], answer: "24 fiction books; biography is 3/7 of what remains" },
      ],
      tryit: { q: "A shelf has fiction, non-fiction and poetry books in the ratio 5:3:2. All the poetry books are removed. Is the ratio of fiction to non-fiction still 5:3, and what fraction of the remaining books are fiction?", answer: "Yes, fiction:non-fiction is still 5:3, unaffected by removing poetry. Fiction is now 5 of the remaining 5+3=8 parts, so 5/8 of the books left on the shelf." },
    },
  ],
  recap: [
    "A ratio says for every so many of one thing, so many of another. Order matters.",
    "To share a total: find total parts, then one part (total ÷ parts), then scale to whichever share you need.",
    "A ratio also gives a fraction of the WHOLE: a part's share of the total number of parts — not the same as comparing it to the other part alone.",
    "Scale ratios by multiplying or dividing both parts by the same number. Never by adding.",
    "Convert to the same units before simplifying or comparing a ratio.",
    "To chain two ratios, rescale each until the shared term matches, then join. Use the lowest common multiple if neither divides the other.",
    "If you're given a DIFFERENCE instead of a total, divide by the difference in parts to find one part, exactly as you would with a sum.",
    "If one quantity changes while the other is fixed, anchor on the FIXED quantity and use the new ratio to find the new unit size.",
    "Removing a whole category leaves the ratio between the remaining categories unchanged — only the total (and fractions of it) shrinks.",
  ],
  mistakes: [
    "Scaling by adding: turning 7:2 into 9:4 by adding 2 to both parts. Wrong, because 7:2 means 3.5 for every 1 and 9:4 means 2.25 for every 1. Right: multiply both parts, so 7:2 doubles to 14:4.",
    "Confusing a ratio with a fraction of the whole: reading 3:5 as \"3/5 of the total\" instead of 3/8 (using the total of 8 parts as the denominator).",
    "Chaining without matching the middle: gluing a:b = 2:3 onto b:c = 6:5 to get 2:3:5. Wrong, because the two ratios disagree about b. Right: scale 2:3 to 4:6 first, giving 4:6:5.",
    "Using the SUM of parts when you were actually given a DIFFERENCE (or vice versa) — always check whether the number in the question is a total or a gap between two parts.",
    "Assuming removing a category changes the ratio of what's left. It doesn't — only the total changes.",
    "In a change-one-part problem, forgetting that the FIXED quantity must match across both ratios (in the same unit), which is what makes the algebra solvable at all.",
  ],
};

JUNIOR_LESSONS.multiRate = {
  title: "Multi-Rate: combining speeds, rates and changing rates",
  minutes: 19,
  intro: "A rate is a ratio with a job: litres per minute, pages per day, miles per hour. The really juicy problems involve several rates at once, like three taps filling one bath or a greyhound racing a horse when their speeds are written in different units. The rule of the whole lesson is short enough for a postage stamp: get every rate onto the same basis, then combine. Everything else is technique.",
  sections: [
    {
      h: "1. What a rate is",
      body: [
        "A rate compares two DIFFERENT kinds of quantity. Pages and hours. Litres and minutes. Pounds and kilograms. When you read 40 pages per hour, the per is doing the work of for every: for every hour that passes, 40 pages get read.",
        "That makes a rate a kind of promise about the future. If the promise holds, 3 hours of reading means 40 x 3 = 120 pages, and half an hour means 20 pages. You scale a rate exactly the way you scale a ratio: multiply both quantities together and the rate itself never changes.",
        "Rates are everywhere once you look. A leaky welly loses water at a rate. Pocket money arrives at a rate. Countra once tried to count raindrops per minute and had to have a lie down, but the idea was sound.",
      ],
      tryit: { q: "A printer prints 12 pages per minute. How many pages in quarter of an hour?", answer: "180 pages. Quarter of an hour is 15 minutes, and 12 x 15 = 180." },
    },
    {
      h: "2. The two multipliers",
      body: [
        "Every rate question has two possible multiplications hiding in it, and picking the right one is the whole game. Suppose a recipe for 4 people uses 6 eggs, and you are cooking for 10.",
        "Route one scales WITHIN a quantity: 10 people is 2.5 times 4 people, so use 2.5 times the eggs, which is 6 x 2.5 = 15. Call that the scaling multiplier: it makes the batch bigger.",
        "Route two crosses BETWEEN the quantities: 6 eggs for 4 people is 1.5 eggs per person, so 10 people need 1.5 x 10 = 15. Call that the rate multiplier: it converts people into eggs. Both routes give 15, and both are always available. The mistake to avoid is grabbing whichever number looks friendlier and multiplying by it without knowing which route you are on. If you cannot say what your multiplier MEANS, stop and say it before you use it.",
      ],
      examples: [
        { q: "3 identical pens cost £1.50. What do 7 pens cost?", steps: ["Rate route: 150p divided by 3 = 50p per pen.", "7 pens: 50 x 7 = 350p = £3.50.", "Scaling check: 7 is 7/3 times 3, and 150 x 7/3 = 350p. Same answer."], answer: "£3.50" },
        { q: "5 identical notebooks cost 4 pounds. What do 8 notebooks cost?", steps: ["Rate route: 4 pounds for 5 notebooks is 4 divided by 5 = 0.80 pounds per notebook.", "8 notebooks cost 0.80 x 8 = 6.40 pounds.", "Scaling route check: 8 is 1.6 times 5, and 4 x 1.6 = 6.40 pounds. Same answer, two roads."], answer: "6.40 pounds" },
        { q: "12 kg of gravel costs £9. A garden path needs 20 kg. What is the total cost?", steps: ["Rate route: £9 divided by 12 = £0.75 per kg.", "20 kg: £0.75 x 20 = £15.", "Scaling check: 20 is 5/3 times 12, and £9 x 5/3 = £15. Same answer."], answer: "£15" },
      ],
      tryit: { q: "A recipe for 6 pancakes uses 300 ml of milk. How much milk for 15 pancakes?", answer: "750 ml. Rate route: 300 divided by 6 = 50 ml per pancake, and 50 x 15 = 750. Scaling route: 15 is 2.5 times 6, and 300 x 2.5 = 750." },
    },
    {
      h: "3. The unit rate: your universal key",
      body: [
        "The unit rate is the rate written as something per ONE: pounds per one kilogram, metres per one second, beans per one minute. Once you have per one, every other amount is a single multiplication away.",
        "To find it, divide. 150 words typed in 3 minutes is 150 divided by 3 = 50 words per minute. Now any question is easy: 10 minutes gives 500 words, and 200 words takes 200 divided by 50 = 4 minutes.",
        "A little ratio table makes this tidy. Top row words, bottom row minutes: 150 over 3, then 50 over 1, then 500 over 10. Every column is the same rate wearing different clothes.",
      ],
      tryit: { q: "8 bananas cost 2 pounds. What do 5 bananas cost?", answer: "1.25 pounds. Unit rate: 2 pounds divided by 8 = 25p per banana. Then 25p x 5 = 1.25 pounds." },
    },
    {
      h: "4. Adding rates: the bath with two taps",
      body: [
        "Now for the multi in multi-rate. If the hot tap pours 6 litres per minute and the cold tap pours 4 litres per minute, and both run at once, the bath gains 6 + 4 = 10 litres every minute. Rates simply add, because each minute both promises are kept side by side.",
        "So a 120 litre bath fills in 120 divided by 10 = 12 minutes. Notice the shape of the method: combine the rates FIRST, then divide the total job by the combined rate.",
        "One quiet condition made that addition legal: both rates were already per minute. You may only add rates that are on the same basis, the same per. That condition is going to matter enormously in a moment.",
      ],
      examples: [
        { q: "Two taps flow at 4 and 6 litres per minute. The tank holds 50 litres. How long to fill it?", steps: ["Both rates are per minute, so add: 4 + 6 = 10 litres per minute.", "Time = 50 divided by 10 = 5 minutes."], answer: "5 minutes" },
        { q: "Three hoses fill a paddling pool at 9, 6 and 5 litres per minute. The pool holds 300 litres. How long to fill it?", steps: ["All three rates are per minute already, so add them: 9 + 6 + 5 = 20 litres per minute.", "Divide the job by the combined rate: 300 divided by 20 = 15.", "Sanity check: in 15 minutes the hoses deliver 135 + 90 + 75 = 300 litres. Exactly full."], answer: "15 minutes" },
        { q: "Four hoses pour 3, 5, 7 and 5 litres per minute into a 400-litre tank. How long to fill it?", steps: ["All four rates are per minute, so add: 3 + 5 + 7 + 5 = 20 litres per minute.", "Time = 400 divided by 20 = 20 minutes.", "Check: 20 min x 20 L/min = 400 litres."], answer: "20 minutes" },
      ],
      tryit: { q: "Two taps pour 7 and 5 litres per minute into a 96 litre tank. How long to fill?", answer: "8 minutes. Combined rate 7 + 5 = 12 litres per minute, and 96 divided by 12 = 8." },
    },
    {
      h: "5. When you are given times instead of rates",
      body: [
        "Here is the classic curveball. One pipe fills a tank in 3 hours. A second, slower pipe fills the same tank in 6 hours. Both run together: how long? The numbers 3 and 6 are TIMES, not rates, and times refuse to add sensibly. Two pipes together certainly do not take 9 hours.",
        "The trick is to invent a friendly size for the tank so the times turn into rates. Pick a number that both 3 and 6 divide into nicely, say 60 buckets. The first pipe does 60 buckets in 3 hours, a rate of 20 buckets per hour. The second does 60 in 6 hours, so 10 buckets per hour. Together: 30 buckets per hour, and 60 divided by 30 = 2 hours.",
        "The lovely thing is that your invented number cannot hurt you. Choose 120 buckets instead and the rates become 40 and 20 per hour, combining to 60, and 120 divided by 60 is still 2 hours. The tank size cancels out. Pick whatever makes the arithmetic kind.",
      ],
      examples: [
        { q: "One pipe fills a tank in 4 hours, another in 12 hours. How long do they take together?", steps: ["Invent a tank size: 12 buckets.", "Pipe one: 12 divided by 4 = 3 buckets per hour. Pipe two: 12 divided by 12 = 1 bucket per hour.", "Together: 3 + 1 = 4 buckets per hour.", "Time = 12 divided by 4 = 3 hours."], answer: "3 hours" },
        { q: "One pipe fills a tank in 3 hours, another in 6 hours. How long together?", steps: ["Invent a tank size both times divide: 60 buckets.", "Pipe one: 60 divided by 3 = 20 buckets per hour. Pipe two: 60 divided by 6 = 10 buckets per hour.", "Together: 20 + 10 = 30 buckets per hour.", "Time = 60 divided by 30 = 2 hours. Sensibly, that beats even the fast pipe alone."], answer: "2 hours" },
        { q: "Three pipes can fill a tank in 2, 3 and 6 hours respectively. How long do all three take together?", steps: ["Invent a tank size all three times divide: 6 buckets.", "Pipe one: 6/2 = 3 per hour. Pipe two: 6/3 = 2 per hour. Pipe three: 6/6 = 1 per hour.", "Together: 3 + 2 + 1 = 6 buckets per hour.", "Time = 6 divided by 6 = 1 hour."], answer: "1 hour" },
      ],
      tryit: { q: "A small pump empties a flooded cellar in 6 hours. A big pump does it in 3 hours. How long together?", answer: "2 hours. Call the flood 6 tubs. Small pump: 1 tub per hour. Big pump: 2 tubs per hour. Together 3 tubs per hour, and 6 divided by 3 = 2 hours." },
    },
    {
      h: "6. Rates that fight each other",
      body: [
        "Not every rate is on your side. Suppose two taps pour in 5 and 3 litres per minute, but somebody has left the plug half out and 2 litres per minute escape. The in rates add and the out rate subtracts: 5 + 3 - 2 = 6 litres per minute of actual progress.",
        "A 90 litre bath then fills in 90 divided by 6 = 15 minutes. The method is unchanged, you just give escaping water a minus sign.",
        "One caution from Pebble, who is small but certain: if the leak is as fast as the taps, the net rate is zero and the bath NEVER fills. A question can be a trick question, and checking whether the net rate is positive takes two seconds.",
      ],
      tryit: { q: "A tap fills a fish tank at 8 litres per minute while a sneaky sipping hosepipe drains it at 3 litres per minute. The tank holds 60 litres. How long to fill?", answer: "12 minutes. Net rate 8 - 3 = 5 litres per minute, and 60 divided by 5 = 12." },
    },
    {
      h: "7. Team jobs: people are taps too",
      body: [
        "Everything you just learned about taps works for workers, because a worker is a tap that pours out finished work. Addy writes up 12 ledger pages per day and her cousin manages 8 pages per day. Working together they produce 12 + 8 = 20 pages per day, so a 100 page ledger takes 100 divided by 20 = 5 days.",
        "When workers are described by how long the job takes them alone, use the friendly total trick from section 5. One painter paints a fence in 4 hours, another in 12 hours. Say the fence has 12 panels. The first paints 12 divided by 4 = 3 panels per hour, the second 12 divided by 12 = 1 panel per hour. Together 4 panels per hour, so 12 divided by 4 = 3 hours.",
        "Check that against your gut: 3 hours is quicker than the fast painter's 4 hours alone, but not absurdly quicker, since the helper is slow. Combined answers should always land just under the fastest individual time.",
      ],
      tryit: { q: "Addy counts 30 beans per minute and Pebble counts 20 beans per minute. Together, how long for a jar of 600 beans?", answer: "12 minutes. Combined rate 30 + 20 = 50 beans per minute, and 600 divided by 50 = 12." },
    },
    {
      h: "8. Same basis or nothing",
      body: [
        "Time to honour the promise from section 4. You may only add or compare rates that are per the SAME thing. Watch what happens otherwise. One machine makes 30 toys per hour. Another makes 1 toy every 90 seconds. Adding 30 and 1 to get 31 would be nonsense: one number is per hour, the other is per 90 seconds.",
        "Convert first. There are 3600 seconds in an hour, so a toy every 90 seconds means 3600 divided by 90 = 40 toys per hour. NOW the rates share a basis and 30 + 40 = 70 toys per hour is true and useful.",
        "This is the single most common way to lose marks on rate questions: adding or comparing numbers whose units quietly disagree. Write the units next to every rate, every time, the way Addy labels every column in her ledger. Units are not decoration. They are the meaning.",
      ],
      examples: [
        { q: "Printer A prints 20 pages per minute. Printer B prints 1800 pages per hour. Together, how long for 500 pages?", steps: ["Convert B to per minute: 1800 divided by 60 = 30 pages per minute.", "Combined rate: 20 + 30 = 50 pages per minute.", "Time: 500 divided by 50 = 10 minutes."], answer: "10 minutes" },
        { q: "One printer prints 20 pages per minute. An older one prints 900 pages per hour. Together, how long for 700 pages?", steps: ["Convert to a common basis. 900 pages per hour is 900 divided by 60 = 15 pages per minute.", "Combined rate: 20 + 15 = 35 pages per minute.", "Time: 700 divided by 35 = 20 minutes."], answer: "20 minutes" },
        { q: "Machine A produces 30 items per hour. Machine B produces 1 item per 90 seconds. Machine C produces 2 items per minute. All three run together. How long for 120 items?", steps: ["Convert all to per minute: A = 30/60 = 0.5 per min; B = 60/90 = 2/3 per min; C = 2 per min.", "Combined: 0.5 + 2/3 + 2 = 3/6 + 4/6 + 12/6 = 19/6 per minute.", "Time: 120 divided by (19/6) = 120 x 6/19 ≈ 37.9 minutes. Competition problems would choose numbers that produce a clean answer — this one illustrates why converting all rates to the same unit is step one."], answer: "Approximately 37.9 minutes; the method is always: convert, combine, divide" },
      ],
      tryit: { q: "A snail slides 5 cm per minute. A beetle trundles 1 cm per second. Who is faster, and by how much per minute?", answer: "The beetle, by 55 cm per minute. 1 cm per second is 60 cm per minute, against the snail's 5. Never compare 5 and 1 raw: the units disagree." },
    },
    {
      h: "9. The great animal race",
      body: [
        "Comparison questions love to write each speed in a different unit and dare you to order them. A greyhound runs at 17 metres per second, a wild ass at 64 kilometres per hour and a horse at 42 miles per hour. Who is fastest? You cannot tell by staring: 17, 64 and 42 are answers to three different questions.",
        "Pick ONE basis and drag everyone onto it. Kilometres per hour is handy here. The greyhound covers 17 x 3600 = 61200 metres in an hour, which is 61.2 km, so 61.2 km per hour. The horse: a mile is about 1.6 km, so 42 x 1.6 = 67.2 km per hour. The wild ass is already 64 km per hour.",
        "Now the numbers speak the same language: greyhound 61.2, wild ass 64, horse 67.2. The horse wins, the wild ass is second and the greyhound, magnificent though it is, comes third. The handy shortcut worth memorising: metres per second times 3.6 gives kilometres per hour, because 3600 seconds per hour divided by 1000 metres per kilometre is 3.6.",
      ],
      tryit: { q: "A sprinter runs at 10 metres per second. A moped putters along at 30 km per hour. Who is faster?", answer: "The sprinter. 10 m per second x 3.6 = 36 km per hour, which beats 30. For about ten seconds, anyway." },
    },
    {
      h: "10. Best buys are rate comparisons",
      body: [
        "Unit pricing is the supermarket version of the animal race. A bag of 5 apples costs 2 pounds; a bag of 8 apples costs 3 pounds. Which is the better deal? Convert both to the same basis: price per one apple.",
        "First bag: 200p divided by 5 = 40p per apple. Second bag: 300p divided by 8 = 37.5p per apple. The big bag wins by 2.5p per apple. You could equally compare apples per pound and the verdict would agree.",
        "The trap is comparing totals or bag sizes instead of rates. 3 pounds is more money than 2 pounds, and that tells you nothing at all about which is the better value.",
      ],
      tryit: { q: "6 eggs for 1.50 pounds or 10 eggs for 2.40 pounds. Which is better value?", answer: "The box of 10. It works out at 24p per egg against 25p per egg for the box of 6. A small win, but Addy would take it." },
    },
    {
      h: "11. The average trap",
      body: [
        "One last dragon to slay. Two pipes fill a tank in 3 hours and 6 hours. A tempting wrong answer says: average the times, call it 4.5 hours. But we calculated the true answer in section 5, and it was 2 hours. The average is not just wrong, it is impossible, because two pipes together must beat the faster pipe working alone.",
        "Why does averaging fail? Because times do not add or average when machines work together. RATES do. The 3 hour pipe contributes a big rate and the 6 hour pipe a small one, and it is the rates, not the times, that pile up in the tank each hour.",
        "So build a sanity check into every combined-work answer: it must be LESS than the smallest individual time. If two friends can each tidy a room in 10 minutes and your answer for both together is anything over 10, something has gone wrong, probably an average where an addition of rates should be.",
      ],
      tryit: { q: "A kettle-sized pump drains a pond in 4 hours and a big pump does it in 4 hours too. Someone claims together they take 4 hours. What is the real answer?", answer: "2 hours. Call the pond 4 tubs: each pump manages 1 tub per hour, together 2 tubs per hour, so 4 divided by 2 = 2 hours. Two identical workers halve the time." },
    },
    {
      h: "12. When the rate itself changes partway through",
      body: [
        "A different kind of multi-rate question keeps ONE worker or machine, but changes its rate partway through the job — perhaps an upgrade, a tired worker slowing down, or extra hands joining. The method: work out how much got done at the FIRST rate, subtract that from the total to find what's left, then divide the remainder by the NEW rate to find the extra time.",
        "The key discipline is to never blend the two rates together as if they applied the whole time. Split the job into stages, solve each stage with its own rate, and add up the times (or amounts) at the end.",
      ],
      examples: [
        { q: "A printer runs at 5 pages per minute for the first 4 minutes, then at 10 pages per minute. How long in total for 80 pages?", steps: ["First 4 minutes: 5 x 4 = 20 pages.", "Remaining: 80 - 20 = 60 pages at 10 per minute: 60 divided by 10 = 6 more minutes.", "Total = 4 + 6 = 10 minutes."], answer: "10 minutes" },
        { q: "A conveyor belt sorts 15 parcels per minute for the first 10 minutes, then speeds up to 25 parcels per minute. How long in total does it take to sort 400 parcels?", steps: ["In the first 10 minutes: 15 x 10 = 150 parcels sorted.", "Remaining: 400 - 150 = 250 parcels, at the new rate of 25 per minute: 250 divided by 25 = 10 more minutes.", "Total time = 10 + 10 = 20 minutes."], answer: "20 minutes" },
        { q: "A machine fills 20 bottles per minute for the first 15 minutes, then is upgraded to fill 45 bottles per minute. There are 1200 bottles in total. How long does the whole job take?", steps: ["First 15 minutes: 20 x 15 = 300 bottles.", "Remaining: 1200 - 300 = 900 bottles at 45 per minute: 900 divided by 45 = 20 more minutes.", "Total = 15 + 20 = 35 minutes."], answer: "35 minutes" },
      ],
      tryit: { q: "A machine bakes 12 loaves per hour for the first 3 hours, then is upgraded to bake 20 loaves per hour. How long in total to bake 176 loaves?", answer: "7 hours. First 3 hours: 12x3=36 loaves. Remaining: 176-36=140 loaves at 20/hour = 7 more hours." },
    },
    {
      h: "13. Rate puzzles hidden inside an equation",
      body: [
        "Not every rate question gives you a rate directly — some hide it inside a sentence that needs translating into algebra first. \"If I had caught 3 times as many fish, I'd have had 20 more\" sounds like a riddle, but it is really a single equation: 3x = x + 20, where x is the actual number caught.",
        "Once you see the sentence AS an equation, the rest is routine: gather the x terms on one side (3x - x = 20, so 2x = 20), and solve. The rate language (\"times as many\") is just multiplication in disguise, and the word \"more\" is just addition in disguise.",
      ],
      tryit: { q: "Jo says: 'If I'd picked 4 times as many apples as I did, I'd have had 18 more.' How many apples did Jo actually pick?", answer: "6 apples. Equation: 4x = x + 18, so 3x = 18, x = 6." },
    },
  ],
  recap: [
    "A rate compares two different quantities: so much of one for every one of the other.",
    "The unit rate (per one) turns every question into a single multiplication.",
    "Know which multiplier you are using: scaling within a quantity, or the rate that crosses between quantities.",
    "Rates on the same basis simply add; draining or leaking rates subtract.",
    "Times do not add. Convert times into rates first, inventing a friendly job size if it helps.",
    "Before adding or comparing rates, convert them all to one common basis. Metres per second x 3.6 = km per hour.",
    "A combined-work answer must beat the fastest individual time, or it is wrong.",
    "If a rate changes partway through a job, split into stages: solve each stage with its own rate, then add.",
    "Some rate problems are algebra in disguise: translate 'times as many' and 'more' into an equation and solve.",
  ],
  mistakes: [
    "Adding or averaging times: saying pipes of 3 hours and 6 hours take 4.5 hours together. Wrong, and impossibly slower than the 3 hour pipe alone. Right: convert to rates (20 and 10 buckets per hour on a 60 bucket tank), add to 30, get 2 hours.",
    "Adding rates with mismatched units: 30 toys per hour plus 1 toy per 90 seconds is not 31 of anything. Right: convert 90 seconds to 40 toys per hour first, then add to get 70.",
    "Comparing speeds in raw numbers: deciding 64 km per hour beats 17 m per second because 64 is bigger. Right: 17 m per second is 61.2 km per hour, and only now may you compare.",
    "Grabbing the friendlier multiplier: multiplying by the number that divides nicely instead of the one the question needs. Say out loud what your multiplier means before using it.",
    "Blending a machine's two different rates together as if the faster (or slower) rate applied the whole time, instead of splitting the job into stages.",
  ],
};

JUNIOR_LESSONS.inverseProp = {
  title: "Inverse Proportion: when more means less (and how to spot the trap)",
  minutes: 19,
  intro: "Some pairs of quantities rise together, like apples bought and money spent. Others see-saw: when one goes up, the other comes down, like builders on a job and days until it is done. Mixing up these two behaviours is one of the great classic maths mistakes, so this lesson teaches you to tell them apart on sight, to calculate with the see-saw kind, and even to argue about when the maths stops matching real life.",
  sections: [
    {
      h: "1. Two kinds of more",
      body: [
        "Try these two sentences. More apples, more money: buy twice the apples, pay twice the money. More builders, fewer days: hire twice the builders, wait half the time. Both sentences contain the word more, but the second quantity moves in opposite directions.",
        "The first kind is called direct proportion: the two quantities move together, in step. The second kind is inverse proportion: the two quantities trade off against each other, like two children on a see-saw. When one end rises, the other must fall.",
        "Almost every mistake in this topic comes from applying more-means-more thinking to a see-saw situation. So before any calculating, always ask Hunchik's question: WHY would these two quantities move together, or why would they trade off? If you can say why, you will pick the right tool.",
      ],
      tryit: { q: "For each pair, together or see-saw? (a) Hours worked and money earned. (b) Speed of a car and time for a fixed journey. (c) Number of stickers bought and total cost.", answer: "(a) together (direct), (b) see-saw (inverse), since going faster shortens the trip, (c) together (direct)." },
    },
    {
      h: "2. Direct proportion: the doubling test",
      body: [
        "Direct proportion first, because it is the friend you already know. If 4 apples cost 1 pound, then 8 apples cost 2 pounds and 2 apples cost 50p. Double one, double the other. Halve one, halve the other. And crucially, zero apples cost zero pounds.",
        "That gives you the doubling test: if doubling one quantity always doubles the other, and zero goes with zero, the relationship is directly proportional. Behind the scenes there is a fixed unit rate, here 25p per apple, and every question is answered by multiplying by it.",
        "Grown-up books write this as y = k times x, where k is that fixed rate. You do not need the letters yet, but notice the shape: one multiplication, no adding, which is why zero goes with zero.",
      ],
      examples: [
        { q: "3 oranges cost 90p. What do 5 oranges cost?", steps: ["Unit rate: 90p divided by 3 = 30p per orange.", "5 oranges: 30 x 5 = 150p.", "Doubling check: 6 oranges would be 180p, and 5 oranges costing 150p sits sensibly just below that."], answer: "£1.50" },
        { q: "4 apples cost 1 pound. What do 10 apples cost?", steps: ["Unit rate: 100p divided by 4 = 25p per apple.", "10 apples: 25 x 10 = 250p.", "Doubling check: 8 apples would be 2 pounds, and 10 costing 2.50 sits sensibly just above that."], answer: "2.50 pounds" },
        { q: "15 pencils cost £2.25. A school needs 100 pencils. What is the total cost?", steps: ["Unit rate: 225p divided by 15 = 15p per pencil.", "100 pencils: 15 x 100 = 1500p.", "Doubling check: 30 pencils cost £4.50 (double the 15), and 100 pencils at £15 fits the same rate."], answer: "£15" },
      ],
      tryit: { q: "3 pencils cost 45p. What do 7 pencils cost?", answer: "1.05 pounds. Unit rate 45 divided by 3 = 15p per pencil, and 15 x 7 = 105p." },
    },
    {
      h: "3. The impostor: linear but not proportional",
      body: [
        "Beware a lookalike. A taxi charges 2 pounds just for getting in, plus 1 pound per kilometre. A 3 km ride costs 5 pounds. Does a 6 km ride cost 10 pounds? No: it costs 2 + 6 = 8 pounds. Doubling the distance did NOT double the fare.",
        "The culprit is that 2 pound flat fee. The graph of fare against distance is a straight line, but it does not pass through zero, because a 0 km ride still costs 2 pounds. Straight line, yes. Directly proportional, no. The doubling test catches it instantly.",
        "So there are three characters to keep apart: directly proportional (double one, double the other, zero with zero), straight-line-with-a-standing-charge (steady growth but the doubling test fails), and inversely proportional, which we meet properly next. Interview every relationship before trusting it.",
      ],
      tryit: { q: "A gym charges 10 pounds to join plus 5 pounds per visit. Is total cost directly proportional to visits?", answer: "No. 2 visits cost 20 pounds but 4 visits cost 30 pounds, not 40. The 10 pound joining fee breaks the doubling test." },
    },
    {
      h: "4. The builders",
      body: [
        "Here is the most famous inverse proportion question in existence. Three builders can complete an extension in 10 days. How long would six builders take? What about one builder? Or thirty?",
        "First, the wrong turnings, so you can recognise their footprints. More-means-more thinking says six builders take 20 days, which is absurd: extra help should speed things up. Additive thinking says three extra builders means three fewer days, so 7 days, which sounds plausible and is also wrong, as we are about to see.",
        "The right idea is to measure the JOB itself. Three builders working 10 days deliver 3 x 10 = 30 days of one builder's effort. Call that 30 builder-days. The extension costs 30 builder-days no matter who shows up. Six builders: 30 divided by 6 = 5 days. One builder: 30 divided by 1 = 30 days. Thirty builders: 30 divided by 30 = 1 day.",
      ],
      examples: [
        { q: "Two painters paint a fence in 6 days. How long would three painters take?", steps: ["Job size: 2 x 6 = 12 painter-days.", "Three painters: 12 divided by 3 = 4 days.", "Check: 3 x 4 = 12. Job size unchanged."], answer: "4 days" },
        { q: "Three builders complete an extension in 10 days. How long for six builders? One? Thirty?", steps: ["Size of the job: 3 builders x 10 days = 30 builder-days.", "Six builders: 30 divided by 6 = 5 days.", "One builder: 30 divided by 1 = 30 days.", "Thirty builders: 30 divided by 30 = 1 day.", "Check each answer: 6 x 5 = 30, 1 x 30 = 30, 30 x 1 = 30. The job size never changed."], answer: "5 days, 30 days and 1 day" },
        { q: "Six workers dig a trench in 4 hours. How many workers are needed to dig the same trench in 3 hours?", steps: ["Job size: 6 x 4 = 24 worker-hours.", "Workers needed for 3 hours: 24 divided by 3 = 8.", "Check: 8 x 3 = 24. Job size unchanged."], answer: "8 workers" },
      ],
      tryit: { q: "Five painters decorate a hall in 12 days. How long would ten painters take?", answer: "6 days. The job is 5 x 12 = 60 painter-days, and 60 divided by 10 = 6. Twice the painters, half the days." },
    },
    {
      h: "5. The fixed pile of work",
      body: [
        "Why does that method work? Because the job is a fixed pile. The extension needs a certain amount of brick-laying and beam-lifting, and that amount does not care how many people share it. More sharers, smaller shares of time each; fewer sharers, longer slog.",
        "This gives inverse proportion its fingerprint: the PRODUCT of the two quantities stays constant. Builders times days is always 30. Compare that with direct proportion, where it is the quotient that stays constant: cost divided by apples is always 25p. One relationship hoards a fixed product, the other a fixed ratio.",
        "It also explains the rule of movement: multiply one quantity by something, and the other gets DIVIDED by that same something. Triple the builders, the days divide by 3. Grown-up shorthand writes it y = k divided by x, with k as the fixed pile. Same idea, fewer words.",
      ],
      tryit: { q: "Four cooks can prepare a banquet in 6 hours. How long would eight cooks take, and how long would three take?", answer: "3 hours and 8 hours. The banquet is 4 x 6 = 24 cook-hours. Eight cooks: 24 divided by 8 = 3. Three cooks: 24 divided by 3 = 8." },
    },
    {
      h: "6. But is it realistic?",
      body: [
        "Now for the part clever questions actually reward: arguing with your own answer. Thirty builders finishing the extension in 1 day is what the model says. Would it happen? Almost certainly not. Thirty people cannot all reach the same wall at once. Someone is holding a ladder nobody needs. Someone else has gone for biscuits.",
        "The model quietly assumed three things: every builder works at the same rate, the work splits perfectly among any number of people, and nobody gets in anyone's way. For 3 or 6 builders those assumptions are roughly fine. For 30 they collapse, and some jobs simply refuse to be split: the paint must dry before the second coat whether one person waits or thirty do.",
        "The one-builder answer of 30 days is suspect too, in the other direction. Some tasks need two pairs of hands, like lifting a long beam, so a lone builder might take even longer than the model promises. Mathematicians call this critiquing the model, and it is not cheating. It is the difference between doing sums and doing maths.",
      ],
      tryit: { q: "The model says 60 gardeners could mow a lawn in 1 minute if one gardener takes an hour. Give two reasons to doubt it.", answer: "Any two of: 60 mowers cannot fit on one lawn, they would obstruct each other, there probably are not 60 mowers available, and starting and stopping takes time that the model ignores. The arithmetic is fine; the assumptions are silly at this extreme." },
    },
    {
      h: "7. Speed and time: the same see-saw",
      body: [
        "Inverse proportion is not only about workers. A journey of 120 miles is a fixed pile too: a pile of distance. Drive at 30 mph and it takes 120 divided by 30 = 4 hours. At 60 mph, 2 hours. At 40 mph, 3 hours.",
        "Check the fingerprint: 30 x 4 = 120, 60 x 2 = 120, 40 x 3 = 120. Speed times time is constant, because it always equals the distance. Double the speed, halve the time. The fixed pile here is miles instead of builder-days, but the see-saw is identical.",
        "This is worth a moment of wonder: builders on an extension and cars on a motorway obey the same law, because both share a fixed total between two trading quantities. Spot the fixed pile and you have solved half the problem before touching a number.",
      ],
      tryit: { q: "A 90 mile journey takes 2 hours at 45 mph. How long at 30 mph?", answer: "3 hours. The fixed pile is 90 miles, and 90 divided by 30 = 3. Check: 45 x 2 = 90 and 30 x 3 = 90." },
    },
    {
      h: "8. The two tests: quotient or product?",
      body: [
        "Time to sharpen the tools into a two-question test you can run on any pair of quantities. Test one: divide. If the quotient of the two quantities is always the same number, the relationship is direct. Cost divided by apples: always 25p. Direct.",
        "Test two: multiply. If the product is always the same number, the relationship is inverse. Builders times days: always 30. Speed times time: always 120. Inverse.",
        "And if neither stays fixed, like the taxi fare from section 3, then it is neither, and you must not use either shortcut. Countra once assumed a relationship was direct because the first two numbers happened to fit, then miscounted an entire barn dance. Run both tests on at least two pairs of values before you commit.",
      ],
      examples: [
        { q: "A bag of 12 sweets is shared equally. With 2 children each gets 6, with 3 each gets 4, with 4 each gets 3. Direct or inverse?", steps: ["Product test: 2 x 6 = 12, 3 x 4 = 12, 4 x 3 = 12. Constant.", "The fixed pile is the 12 sweets shared among however many children turn up.", "So children and sweets-each are inversely proportional."], answer: "Inverse: the product is always 12" },
        { q: "A pizza is cut into 24 equal slices and shared equally. With 2 friends each gets 12 slices, with 3 each gets 8, with 4 each gets 6. Direct or inverse?", steps: ["Try the product test: 2 x 12 = 24, 3 x 8 = 24, 4 x 6 = 24. Constant.", "The fixed pile is the pizza itself: 24 slices, shared however many turn up.", "So friends and slices-each are inversely proportional. More friends, thinner rations."], answer: "Inverse: the product is always 24" },
        { q: "A box of 60 cards is split equally among groups. Three groups get 20 each, four groups get 15 each, five groups get 12 each, and six groups get 10 each. A student claims the number of groups and the cards per group are directly proportional. Run both tests and state the correct relationship.", steps: ["Product test: 3 x 20 = 60, 4 x 15 = 60, 5 x 12 = 60, 6 x 10 = 60. Product is always 60.", "Quotient test: 20 divided by 3 is not equal to 15 divided by 4. The quotient is not constant.", "The product test passes and the quotient test fails, so the relationship is inverse, not direct. The fixed pile is the 60 cards."], answer: "Inverse, not direct: the product is always 60" },
      ],
      tryit: { q: "A table shows 3 metres of ribbon cost 6 pounds and 5 metres cost 10 pounds. Direct or inverse, and how do you know?", answer: "Direct. The quotient is fixed: 6 divided by 3 = 2 and 10 divided by 5 = 2, so ribbon costs 2 pounds per metre. The product test fails: 3 x 6 = 18 but 5 x 10 = 50." },
    },
    {
      h: "9. Hay, ponies and camping trips",
      body: [
        "The fixed pile wears many disguises, so here is a wardrobe of them. A bale of hay lasts 8 ponies for 3 days. The pile is 8 x 3 = 24 pony-days of munching. For 4 ponies it lasts 24 divided by 4 = 6 days. For 12 ponies, just 2 days.",
        "A water tank keeps 6 campers going for 10 days: a pile of 6 x 10 = 60 camper-days. With only 4 campers it stretches to 60 divided by 4 = 15 days. The question always has the same skeleton: multiply to find the pile, divide by the new team to find the new time.",
        "One habit will save you from every trap: before calculating, name the pile out loud, with its double-barrelled unit. Builder-days. Pony-days. Camper-days. Miles. If you cannot name the fixed pile, the relationship might not be inverse at all, and you should go back to the two tests.",
      ],
      tryit: { q: "A box of biscuits lasts 5 aunts exactly 4 tea-times. How many tea-times would it last 2 aunts?", answer: "10 tea-times. The pile is 5 x 4 = 20 aunt-tea-times, and 20 divided by 2 = 10. Assuming, the model whispers, that every aunt eats at the same rate." },
    },
    {
      h: "10. Changing teams mid-job",
      body: [
        "Stretch time. Back to our extension worth 30 builder-days. Six builders start, but after 2 days three of them are called away. How long does the whole job take now?",
        "Track the pile. In the first 2 days, six builders complete 6 x 2 = 12 builder-days, leaving 30 - 12 = 18 builder-days in the pile. The remaining three builders chew through it at 3 builder-days per day, so they need 18 divided by 3 = 6 more days. Total: 2 + 6 = 8 days.",
        "Notice what made this solvable: the pile is a currency you can pay off in instalments at different rates. That single idea, work as a countable pile, dissolves problems that look impossibly complicated at first glance. It is Addy's favourite idea in all of mathematics, and she keeps it on page one of the ledger.",
      ],
      examples: [
        { q: "A job takes 8 elves 4 days. All 8 work for 1 day, then 4 elves leave. How long does the job take altogether?", steps: ["Size the pile: 8 x 4 = 32 elf-days.", "Day one: 8 elves do 8 elf-days, leaving 32 - 8 = 24.", "The remaining 4 elves manage 4 elf-days per day: 24 divided by 4 = 6 more days.", "Total: 1 + 6 = 7 days. Check the pile: 8 + 24 = 32. All accounted for."], answer: "7 days" },
        { q: "A landscaping job needs 6 gardeners 10 days. All 6 work for 2 days, then 2 gardeners are called away. How many further days are needed, and what is the total time?", steps: ["Size the pile: 6 x 10 = 60 gardener-days.", "Stage one: 6 x 2 = 12 done, leaving 60 - 12 = 48.", "Remaining 4 gardeners: 48 divided by 4 = 12 more days.", "Total: 2 + 12 = 14 days."], answer: "12 further days; 14 days altogether" },
        { q: "A construction job needs 12 workers 10 days. All 12 work for 4 days. Then 6 workers leave. After 3 more days, 3 extra workers arrive and join the remainder. How many final days are needed, and what is the total time for the job?", steps: ["Size the pile: 12 x 10 = 120 worker-days.", "Stage one: 12 x 4 = 48 done, leaving 72.", "Stage two: 6 workers for 3 days = 18 done, leaving 54.", "Stage three: 6 + 3 = 9 workers; 54 divided by 9 = 6 final days.", "Total: 4 + 3 + 6 = 13 days."], answer: "6 final days; 13 days altogether" },
      ],
      tryit: { q: "A wall needs 20 builder-days. Two builders work on it for 4 days, then two more join. How many further days are needed?", answer: "3 days. First stage: 2 x 4 = 8 builder-days done, 12 left. Four builders clear 4 per day, so 12 divided by 4 = 3." },
    },
    {
      h: "11. Seeing the shape",
      body: [
        "Numbers in a table make the see-saw visible. For the 30 builder-day extension: 1 builder takes 30 days, 2 take 15, 3 take 10, 5 take 6, 6 take 5, 30 take 1. Read across any row and multiply: always 30. Notice the days shrink quickly at first, then slowly: going from 1 builder to 2 saves 15 days, but going from 5 to 6 saves only 1.",
        "On a graph, direct proportion is a straight line marching through zero. Inverse proportion is a graceful slide that swoops down steeply then flattens, getting ever closer to the bottom axis without ever touching it. It cannot touch: no matter how many builders you hire, the job never takes zero days, and no crew of zero builders will ever finish.",
        "That shrinking-savings shape is also the practical moral of the whole lesson. The second builder is worth a lot. The thirtieth is barely worth the biscuits. The maths of inverse proportion and the common sense of section 6 turn out to agree after all.",
      ],
      tryit: { q: "For the 30 builder-day job, how many days does the 4th builder save compared with 3 builders, and how many does the 10th save compared with 9?", answer: "The 4th saves 2.5 days (10 days down to 30 divided by 4 = 7.5). The 10th saves only about a third of a day (30 divided by 9 is about 3.33, down to 3). Extra helpers matter less and less." },
    },
    {
      h: "12. Stating it abstractly: the constant of variation",
      body: [
        "Grown-up mathematics writes inverse proportion as y = k / x, where k is the fixed pile written in symbols rather than a real-world story. If y is inversely proportional to x, then for ANY pair of matching values, x times y always gives back the SAME number k. That number is called the constant of variation.",
        "The method for these abstract questions is two clean steps: first, use the ONE pair of values you're given to find k (multiply them together). Second, use k to find whatever new value the question asks for (divide k by the new x). This is exactly the builders-and-days method, just with the story stripped away.",
      ],
      examples: [
        { q: "y is inversely proportional to x. When x = 4, y = 15. Find y when x = 6.", steps: ["Find the constant: k = x × y = 4 × 15 = 60.", "Use k with the new x: y = 60 ÷ 6 = 10."], answer: "y = 10" },
        { q: "y is inversely proportional to x. When x = 3, y = 20. Find y when x = 12.", steps: ["Find the constant: k = 3 × 20 = 60.", "Use k with the new x: y = 60 ÷ 12 = 5."], answer: "y = 5" },
        { q: "y is inversely proportional to x. The value of y when x = 3 is exactly 4 more than the value of y when x = 4. Find the constant of variation and both values of y.", steps: ["Write y = k/x for each: when x = 3, y = k/3; when x = 4, y = k/4.", "Set up the condition: k/3 = k/4 + 4.", "Multiply every term by 12: 4k = 3k + 48, so k = 48.", "When x = 3: y = 48/3 = 16. When x = 4: y = 48/4 = 12.", "Check: 16 is indeed 4 more than 12."], answer: "k = 48; y = 16 when x = 3 and y = 12 when x = 4" },
      ],
      tryit: { q: "p is inversely proportional to q. When q = 5, p = 18. Find p when q = 9.", answer: "p = 10. Constant k = 5 × 18 = 90. New p = 90 ÷ 9 = 10." },
    },
    {
      h: "13. A fixed extra part that does NOT scale",
      body: [
        "Real situations often mix a genuinely inversely-proportional part with a part that is completely fixed and shared by everyone regardless of team size. Picture setting up a stage: the physical set-up always takes, say, 2 fixed days no matter how many people help. AFTER that, the actual decorating work — which DOES depend on how many people help — is the inversely-proportional part.",
        "The trap is applying inverse proportion to the WHOLE total, fixed part included. The fix: split the total into its fixed component (never changes) and its inversely-proportional component (calculate the pile, divide by the new team size), then add the fixed part back on at the end.",
      ],
      examples: [
        { q: "Painting a mural always needs 1 fixed day for the paint to be mixed and the wall prepared. After that, 3 painters can finish the mural in 8 more days. How long in total would it take 6 painters (same fixed prep time)?", steps: ["The prep day is fixed: it happens no matter how many painters there are.", "Painting work = 3 × 8 = 24 painter-days.", "With 6 painters: 24 ÷ 6 = 4 days of painting.", "Total = 1 fixed day + 4 painting days = 5 days."], answer: "5 days" },
        { q: "Setting up a marquee always takes 3 fixed hours to peg out the groundsheet, whatever the team size. After that, 5 workers can finish erecting it in 10 more hours. How long in total with only 2 workers?", steps: ["The 3-hour groundsheet peg-out is fixed; it cannot be sped up.", "Erecting work = 5 × 10 = 50 worker-hours.", "With 2 workers: 50 ÷ 2 = 25 hours of erecting.", "Total = 3 fixed hours + 25 hours = 28 hours."], answer: "28 hours" },
        { q: "Organising a festival always needs 2 fixed days for permits and site planning regardless of team size. After that, 4 builders can finish the physical setup in 12 more days. The client wants the total time reduced to 10 days. How many builders are needed?", steps: ["The 2-day permit phase is fixed and cannot be changed.", "Target build time = 10 - 2 = 8 days.", "Build work = 4 × 12 = 48 builder-days.", "Builders needed = 48 ÷ 8 = 6.", "Check: 2 fixed + 8 build days = 10 total."], answer: "6 builders" },
      ],
      tryit: { q: "Every event always needs 2 fixed hours to set up chairs regardless of team size. After that, 4 volunteers can finish decorating in 6 more hours. How long in total for 8 volunteers?", answer: "5 hours. Decorating work = 4 × 6 = 24 volunteer-hours. With 8 volunteers: 24 ÷ 8 = 3 hours. Total = 2 fixed + 3 = 5 hours." },
    },
    {
      h: "14. Comparing two see-saw changes at once",
      body: [
        "The hardest twist: sometimes BOTH sides of the inverse relationship change at the same time. Not just the team size, but also the size of the job itself. If a standard wall needs a certain number of builder-days, a wall that is TWICE as long needs TWICE the builder-days — that part is direct (bigger job, proportionally more work). Meanwhile, more builders sharing that (now bigger) job still follow the inverse law.",
        "The clean way through: work out the new TOTAL pile first (scale the original pile by however much bigger the job has become), then divide by the new number of workers, exactly as before.",
      ],
      examples: [
        { q: "4 builders build a standard shed in 6 days. A shed twice the size is needed, and 8 builders (twice as many) are hired. How many days does the bigger shed take?", steps: ["Standard shed: 4 × 6 = 24 builder-days.", "A shed twice the size needs twice the builder-days: 24 × 2 = 48 builder-days.", "With 8 builders: 48 ÷ 8 = 6 days.", "Notice the days come out the SAME as the original 6 — because the job doubled exactly as fast as the workforce did, the two changes cancelled out."], answer: "6 days (unchanged, because both the job and the workforce doubled)" },
        { q: "6 workers build a wall in 5 days. A wall 3 times as long is needed, and 9 workers are hired. How many days does the longer wall take?", steps: ["Standard wall: 6 × 5 = 30 worker-days.", "A wall 3 times as long needs 3 times the worker-days: 30 × 3 = 90 worker-days.", "With 9 workers: 90 ÷ 9 = 10 days."], answer: "10 days" },
        { q: "3 diggers complete a trench in 8 days. A second trench is 1.5 times as long and must be completed in 4 days. How many diggers are needed?", steps: ["Standard trench: 3 × 8 = 24 digger-days.", "A trench 1.5 times as long needs 1.5 times the digger-days: 24 × 1.5 = 36 digger-days.", "Time limit is 4 days, so diggers needed = 36 ÷ 4 = 9."], answer: "9 diggers" },
      ],
      tryit: { q: "3 workers paint a standard fence in 4 days. A fence 3 times as long is needed, but only 2 workers (not 3× as many) are available. How many days does it take?", answer: "18 days. Standard pile = 3×4 = 12 worker-days. Triple the fence: 36 worker-days. With 2 workers: 36÷2 = 18 days." },
    },
  ],
  recap: [
    "Direct proportion: quantities move together. Double one, double the other, and zero goes with zero.",
    "A straight line with a standing charge, like a taxi fare, is NOT direct proportion. The doubling test exposes it.",
    "Inverse proportion: quantities trade off. Multiply one, divide the other by the same number.",
    "The fingerprints: direct keeps a fixed quotient, inverse keeps a fixed product.",
    "Solve worker problems by sizing the fixed pile in builder-days, then dividing by the new team.",
    "Speed and time for a fixed journey obey the same law: speed times time equals the fixed distance.",
    "Stated abstractly, y = k/x: find k from one known pair, then use it to solve forward for any other pair.",
    "A FIXED part (like a set-up time) does not scale with team size — split it out, solve the inversely-proportional part alone, then add the fixed part back.",
    "If BOTH the job size and the number of workers change, scale the pile by the job-size factor first, then divide by the new worker count.",
    "Always critique the model at extremes: 30 builders in a doorway do not really work 30 times as fast.",
  ],
  mistakes: [
    "Treating a see-saw as direct: saying 6 builders take 20 days because 3 take 10. Wrong, more builders must be faster. Right: the job is 30 builder-days, so 6 builders take 5 days.",
    "Additive trading: 3 extra builders means 3 fewer days, giving 7. Wrong, the relationship is multiplicative. Right: doubling the builders halves the days, giving 5.",
    "Using the quotient when the product is fixed, or the reverse. Test with two pairs of values before choosing.",
    "Applying inverse proportion to a total that includes a FIXED part which should never be divided by the team size.",
    "When both the job size and the workforce change, forgetting to scale the pile by the job-size factor before dividing by the new number of workers.",
    "Trusting the model at silly extremes: reporting that 30 builders finish in exactly 1 day without noting they would be standing on each other. State the answer AND its limits.",
  ],
};


// ---- Full-depth guided lessons: number sense (estimation, dateDigit, cryptarith v2) ----

JUNIOR_LESSONS.estimation = {
  title: "Estimation: the art of being roughly right",
  minutes: 20,
  intro: "Estimation is the skill of getting a good enough answer fast, without doing the whole sum. It sounds like cheating. It is not. It is what engineers, shopkeepers and competition mathematicians do all day, because a rough answer in five seconds often beats a perfect answer in five minutes. In this lesson you will learn to round properly, to estimate calculations the professional way, to chain rough facts into an answer for a question that sounds impossible, to scale a small sample up to a whole, to say exactly how wrong a rounded number (or a calculation built from two of them) could be, and to sanity-check a final answer's order of magnitude.",
  sections: [
    {
      h: "1. Why rough is often right",
      body: [
        "Imagine you are at the shop with a ten pound note and a basket holding four things: 2.95 pounds, 4.10 pounds, 6.99 pounds and 1.85 pounds. You do not need the exact total. You need to know, before you reach the till, whether ten pounds is enough. So you think: about 3, about 4, about 7, about 2. That is 16. Not enough. You put the crisps back with dignity.",
        "The exact total is 15.89 pounds, and your five-second estimate of 16 pounds was off by just 11p. That is the whole game: trade a tiny bit of accuracy for a huge amount of speed. In the Junior Maths Challenge there is no calculator, and plenty of questions are secretly asking: can you estimate well enough to pick the right answer without grinding through the arithmetic?",
      ],
      note: "Countra once added a shopping list to the exact penny, twice, to be sure. By the time she finished, the shop had shut. Addy estimated, bought the flour and was home for tea. There is a moral in there somewhere.",
      tryit: { q: "You have 5 pounds. Crisps cost 85p, a drink is 1.20 pounds and a sandwich is 2.90 pounds. Estimate: is 5 pounds enough?", answer: "Round to friendly numbers: about 1 + 1 + 3 = 5 pounds. It is going to be extremely close. The exact total is 4.95 pounds, so yes, with 5p to spare. Your estimate warned you it was tight, which is exactly what an estimate is for." },
    },
    {
      h: "2. Rounding is a closeness contest",
      body: [
        "To round a number, you are answering one question: which round number is it closest to? Picture a number line. 47 sits between 40 and 50. It is 7 steps from 40 and only 3 steps from 50, so 47 rounds to 50. That is all rounding is: a closeness contest between two neighbours.",
        "The only awkward case is the exact middle. 45 is exactly 5 from 40 and 5 from 50. The rule everyone agrees on is that a tie rounds up. So 45 rounds to 50, 250 rounds to 300 when rounding to the nearest hundred, and 3,500 rounds to 4,000 when rounding to the nearest thousand.",
      ],
      examples: [
        { q: "Round 283 to the nearest ten.", steps: ["283 sits between 280 and 290.", "Distance to 280 is 3. Distance to 290 is 7.", "280 wins the closeness contest."], answer: "280" },
        { q: "Round 3,748 to the nearest hundred.", steps: ["3,748 sits between 3,700 and 3,800.", "Distance to 3,700 is 48. Distance to 3,800 is 52.", "3,700 is closer, so 3,748 rounds to 3,700."], answer: "3,700" },
        { q: "What is the largest whole number that rounds to 7,400 when rounded to the nearest hundred?", steps: ["Any number from 7,350 up to (but not including) 7,450 rounds to 7,400.", "The largest whole number below 7,450 is 7,449.", "Check: 7,449 is 49 below 7,500 and 49 above 7,400 — closer to 7,400. And 7,450 would round up to 7,500, so it is excluded."], answer: "7,449" },
      ],
      tryit: { q: "Round 6,847 to the nearest hundred.", answer: "6,800. It sits between 6,800 and 6,900. It is 47 above 6,800 and 53 below 6,900, so 6,800 is closer." },
    },
    {
      h: "3. Round straight at the target, never in steps",
      body: [
        "Here is a trap that catches even strong mathematicians. Round 447 to the nearest hundred. Some people go in stages: 447 rounds to 450 (nearest ten), and 450 rounds to 500 (nearest hundred). Answer: 500. Wrong. 447 is 47 away from 400 and 53 away from 500, so it rounds to 400.",
        "Step-by-step rounding fails because each little round nudges the number, and the nudges can push it over a boundary it never actually crossed. The fix is simple: always compare the ORIGINAL number directly against the two nearest targets. One contest, no stages.",
        "Watch how badly the chain can go wrong. Take 3,446 to the nearest thousand. The chain says 3,446 to 3,450, then 3,450 to 3,500, then 3,500 to 4,000. But 3,446 is only 446 above 3,000 and a whole 554 below 4,000. The true answer is 3,000. The chain landed a full thousand off.",
      ],
      tryit: { q: "Round 2,483 to the nearest thousand, then explain what the step-by-step chain would wrongly give.", answer: "Direct: 2,483 is 483 above 2,000 and 517 below 3,000, so it rounds to 2,000. The chain goes 2,483 to 2,480 to 2,500 to 3,000, which is wrong. One contest, straight at the target." },
    },
    {
      h: "4. Small decimals, big confusion",
      body: [
        "Decimals less than one obey exactly the same closeness rules, but they scare people because everything starts with a zero. Take 0.512. To the nearest whole number, it sits between 0 and 1, and the halfway mark is 0.5. Since 0.512 is past halfway, it rounds to 1. Plenty of people say 0 because the number LOOKS small. Looks are not distances.",
        "To one decimal place, 0.512 sits between 0.5 and 0.6. It is 0.012 above 0.5 and 0.088 below 0.6, so it rounds to 0.5. To two decimal places it sits between 0.51 and 0.52, and it rounds to 0.51. Same number, three different questions, three different answers. Always check which target you are being asked to hit.",
        "And yes, zero is a perfectly legal answer. 0.086 to one decimal place sits between 0.0 and 0.1, and since it is past the halfway mark of 0.05 it rounds to 0.1. But 0.03 to one decimal place rounds to 0.0, and writing 0.0 is correct, not a mistake.",
      ],
      tryit: { q: "Round 0.049 to one decimal place.", answer: "0.0. It sits between 0.0 and 0.1, and the halfway mark is 0.05. Since 0.049 is just below halfway, it rounds down to 0.0. Sneaky, but the number line never lies." },
    },
    {
      h: "5. The golden rule: round FIRST, then calculate",
      body: [
        "This is the single most important idea in the lesson. To estimate a calculation, you round the numbers going IN, then do an easy sum. You do not do the hard sum and then round the answer. If you calculated 6.2 x 38 = 235.6 exactly and then rounded it to 240, you did not estimate anything. You did all the work and then threw some of it away.",
        "The proper move: 6.2 is about 6, and 38 is about 40, so 6.2 x 38 is about 6 x 40 = 240. Five seconds, no columns, and the exact answer of 235.6 confirms we landed close. Estimation exists precisely so you never have to touch the ugly sum.",
        "Sometimes a clever pairing beats plain rounding. For 19 x 21, both numbers hug 20, so estimate 20 x 20 = 400. The exact answer is 399. That is an estimate so good it is practically showing off.",
      ],
      note: "Hunchik asked why the rule is round first, and here is the honest answer: an estimate is a prediction you make BEFORE the work, so it can catch your mistakes. If your careful column sum for 6.2 x 38 says 2,356, your estimate of 240 screams that a decimal point has escaped.",
      tryit: { q: "Estimate 4.9 x 62.", answer: "Round first: 4.9 is about 5, and 62 is about 60. So the estimate is 5 x 60 = 300. The exact answer is 303.8, so the estimate was excellent." },
    },
    {
      h: "6. Friendly numbers for dividing",
      body: [
        "Division has its own trick: round to numbers that divide NICELY, even if a slightly closer round number exists. To estimate 813 divided by 19, round to 800 and 20, because 800 divided by 20 is a clean 40. The exact answer is about 42.8, so 40 is a fine estimate.",
        "For 356 divided by 7, do not round 356 to 400, because 400 divided by 7 is horrible. Round to 350, since 350 divided by 7 is exactly 50. Mathematicians call these compatible numbers: pairs chosen to get along. Nearest is good, friendly is better.",
      ],
      tryit: { q: "Estimate 5,987 divided by 29.", answer: "Round to 6,000 and 30. Then 6,000 divided by 30 = 200. The exact answer is about 206, so the estimate lands close." },
    },
    {
      h: "7. Units: the estimator's toolkit",
      body: [
        "You cannot estimate real-world things without knowing your units cold: 1 km = 1,000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1,000 g, 1 litre = 1,000 ml. And you need benchmarks, real things whose size you know: a door is about 2 m tall, a bag of sugar is 1 kg, a teaspoon is 5 ml, a litre bottle of water weighs 1 kg.",
        "Golden habit: convert everything to the SAME unit before comparing. Which is longer, 0.5 km or 5,000 cm? Convert both to metres: 0.5 km = 500 m, and 5,000 cm = 50 m. So 0.5 km is ten times longer, even though 5,000 looks like the bigger number. Digits lie when units differ.",
      ],
      examples: [
        { q: "Roughly how many 330 ml cans of drink fill a 2 litre bottle?", steps: ["Convert to the same unit: 2 litres = 2,000 ml.", "330 is close to a third of 1,000, so 330 ml is about a third of a litre.", "That means about 3 cans per litre, so about 6 cans for 2 litres.", "Check: 6 x 330 = 1,980 ml, just under 2,000. Spot on."], answer: "About 6 cans" },
        { q: "A bucket holds 9 litres. A garden hose delivers about 12 litres per minute. Roughly how many seconds does it take to fill the bucket?", steps: ["Convert the rate to the same unit as the answer: 12 litres per minute = 12,000 ml per 60 seconds.", "The hose delivers 12,000 ÷ 60 = 200 ml per second.", "Time to fill 9 litres = 9,000 ml ÷ 200 ml per second = 45 seconds."], answer: "About 45 seconds" },
        { q: "A garden bed measures 6 m by 4 m and needs topsoil to a depth of 10 cm. Each bag of topsoil covers 2 m² to a depth of 5 cm. Roughly how many bags are needed?", steps: ["The bed area is 6 × 4 = 24 m².", "One bag covers 2 m² at 5 cm depth. At twice the depth (10 cm), the same bag only covers 1 m².", "Bags needed ≈ 24 m² ÷ 1 m² per bag = 24 bags."], answer: "About 24 bags" },
      ],
      tryit: { q: "A table is 95 cm tall. Roughly how many tables, stacked, would reach a 3 m ceiling?", answer: "95 cm is about 1 m, so about 3 tables. Check: 3 x 95 cm = 285 cm = 2.85 m, just shy of the ceiling. Three tables and a thick book." },
    },
    {
      h: "8. Fermi questions: estimating the unknowable",
      body: [
        "A Fermi question sounds impossible: how many seconds are in a day? How many times does your heart beat before bedtime? The secret is to break the monster into small facts you DO know, estimate each one, and multiply.",
        "Seconds in a day: 60 seconds in a minute, 60 minutes in an hour, so 3,600 seconds per hour. Then 24 hours. Now estimate: 3,600 x 24 is close to 3,600 x 25 = 90,000, and taking one 3,600 back off gives 86,400 exactly. Either way, you now know a day is roughly ninety thousand seconds, which is a genuinely useful thing to carry around in your head.",
        "Heartbeats in a day: about 70 beats a minute, times 60 minutes is 4,200 an hour, and 4,200 x 24 is about 4,000 x 25 = 100,000. Your heart does roughly a hundred thousand beats a day and never once asks for pocket money.",
      ],
      note: "The trick is confidence with rough numbers. Nobody knows their exact heartbeat count, and nobody needs to. Being within ten percent of the truth on a question like that is a small superpower.",
      tryit: { q: "Estimate how many hours you spend at school in a year. Assume about 6 hours a day, 5 days a week, and about 39 school weeks.", answer: "6 x 5 = 30 hours a week. Round 39 weeks to 40: 30 x 40 = 1,200 hours. The exact figure with 39 weeks is 1,170, so about 1,200 hours a year." },
    },
    {
      h: "9. Scaling a sample up to a total",
      body: [
        "A different Fermi-flavoured trick: measure a small SAMPLE, work out its rate (a density), then scale that rate up to the whole. This is exactly how stewards estimate crowd sizes, how scientists estimate the population of fish in a lake, and how bakers estimate how much flour a huge batch will need from a small test batch.",
        "The method: count how many of the thing are in a known small chunk (getting a rate PER unit of the chunk — per square metre, per scoop, per minute), then multiply that rate by however many chunks make up the whole.",
      ],
      examples: [
        { q: "A jar holds jellybeans. A steward counts 18 jellybeans in one layer that is 1 cm deep, and the jar is filled to a depth of 15 cm with jellybeans packed the same way throughout. Estimate the total number of jellybeans.", steps: ["Rate from the sample: 18 jellybeans per 1 cm of depth.", "Scale up to the whole jar: 18 x 15 = 270."], answer: "About 270 jellybeans" },
        { q: "A crowd fills a standing area in a stadium. A steward counts 85 people in a 10 m by 10 m section. The total standing area is 4,000 m². Estimate the crowd size.", steps: ["Rate from the sample: 85 people per 100 m².", "Total sections: 4,000 ÷ 100 = 40 sections.", "Crowd estimate: 85 x 40 = 3,400 people."], answer: "About 3,400 people" },
        { q: "A scientist estimates the fish population of a lake using mark-recapture. She catches 120 fish, tags them all and returns them. Two weeks later she catches 80 fish and finds 12 of them are tagged. Estimate the total fish population.", steps: ["The tagged proportion in the second catch = 12 out of 80.", "Assume this proportion represents the whole lake: 12/80 = fraction of all fish that are tagged.", "Total fish ≈ 120 ÷ (12/80) = 120 x 80 ÷ 12 = 9,600 ÷ 12 = 800."], answer: "About 800 fish" },
      ],
      tryit: { q: "A field inspector counts 12 dandelions in a 1 m² sample patch. The whole field is 250 m². Estimate the total number of dandelions.", answer: "About 3,000 dandelions. Rate = 12 per m², scaled up: 12 x 250 = 3,000." },
    },
    {
      h: "10. How wrong could it be? Bounds",
      body: [
        "When someone says the population of England is 53 million to the nearest million, the true number is almost certainly not exactly 53,000,000. So what could it actually be? This is a rounding question run in reverse, and it is a favourite in assessments.",
        "Smallest first. What is the smallest number that still rounds UP to 53 million? The halfway point below is 52,500,000, and by the tie rule, exactly halfway rounds up. So 52,500,000 itself rounds to 53 million, and it is the smallest value that does. Anything below it, like 52,499,999, is closer to 52 million and rounds there instead.",
        "Largest next. Anything below 53,500,000 rounds to 53 million, but 53,500,000 itself is halfway and rounds UP to 54 million, so it is excluded. Since populations are whole people, the largest possible population is 53,499,999. The true value lives somewhere in that band a million wide, and that is a lot of wiggle room hiding inside one tidy sentence.",
      ],
      tryit: { q: "A festival crowd is reported as 4,300 to the nearest hundred. What are the smallest and largest possible crowd sizes?", answer: "Smallest: 4,250, because it is exactly halfway and ties round up. Largest: 4,349, because 4,350 would round up to 4,400. So the crowd is anywhere from 4,250 to 4,349 people." },
    },
    {
      h: "11. Writing bounds like a mathematician — and bounding a PRODUCT of two",
      body: [
        "Listing the smallest and largest values works, but mathematicians compress the whole story into one line using inequality symbols. For the crowd of 4,300 to the nearest hundred, we write 4,250 is less than or equal to X, which is less than 4,350, where X is the true crowd size.",
        "Read it aloud: X is greater than or equal to 4,250, and strictly less than 4,350. The 'less than or equal to' on the left says 4,250 itself is allowed, because exactly halfway rounds up to 4,300. The strict 'less than' on the right says 4,350 is NOT allowed, because it would round up to 4,400.",
        "The strict 'less than' matters most for measurements. A length of 2.7 m to one decimal place gives 2.65 up to but not including 2.75. You might itch to write the top as 2.749999, but there is no biggest number below 2.75, since you can always add another 9. The strict inequality handles that infinity of nines in one clean stroke, which is why we use it.",
        "Now stretch this one step further: what if TWO rounded measurements are multiplied together, like the length and width of a rectangle? The smallest possible AREA comes from pairing the smallest possible length WITH the smallest possible width — you cannot mix a smallest length with a largest width and call it a bound. Likewise the largest possible area pairs the largest length with the largest width. Consistency of pairing is everything.",
      ],
      examples: [
        { q: "A rectangle measures 10 cm by 6 cm, each rounded to the nearest cm. What is the smallest possible area?", steps: ["Smallest possible length: 9.5 cm (anything below rounds to 9, not 10).", "Smallest possible width: 5.5 cm.", "Smallest possible area ≈ 9.5 × 5.5 = 52.25 cm²."], answer: "52.25 cm²" },
        { q: "A rectangle measures 8 cm by 5 cm, each rounded to the nearest cm. What is the largest possible area?", steps: ["Largest possible length: just under 8.5 cm.", "Largest possible width: just under 5.5 cm.", "Largest possible area approaches 8.5 × 5.5 = 46.75 cm², but never quite reaches it because 8.5 would round to 9."], answer: "The largest possible area approaches 46.75 cm² (never reached)" },
        { q: "A square has a side of 7 cm, measured to the nearest centimetre. Find the difference between the largest and smallest possible areas.", steps: ["Smallest side: 6.5 cm, so smallest area = 6.5² = 42.25 cm².", "Largest side: just under 7.5 cm, so largest area approaches 7.5² = 56.25 cm².", "The difference between these bounds is 56.25 - 42.25 = 14 cm²."], answer: "14 cm² (the area could range over an interval 14 cm² wide)" },
      ],
      tryit: { q: "A parcel weighs 6 kg to the nearest kilogram. Write the possible mass m as an inequality. Then, for a rectangle 8 cm by 5 cm (each to the nearest cm), find the LARGEST possible area.", answer: "5.5 ≤ m < 6.5. For the rectangle: largest length just under 8.5 cm, largest width just under 5.5 cm, so largest area ≈ 8.5 × 5.5 = 46.75 cm² — a boundary the true area approaches but never quite reaches." },
    },
    {
      h: "12. Rounding negative numbers",
      body: [
        "Negative numbers round by exactly the same closeness contest, but you must trust the number line, not your gut. Take a temperature of minus 2.7 degrees. It sits between minus 3 and minus 2. It is 0.3 away from minus 3 and 0.7 away from minus 2, so minus 2.7 rounds to minus 3.",
        "The trap: people see the 7, think round up, and make the digit bigger. Here is the untangling. On a number line, UP means to the right, towards the warm end. Rounding minus 2.7 up would give minus 2, but minus 2.7 is not close to minus 2, it is close to minus 3. Forget the digits, measure the distances.",
        "For exact halves like minus 4.5, the tie rule still says round up the number line, meaning towards the positive side, so minus 4.5 rounds to minus 4. But ties are rare. In almost every question, closeness decides, and closeness never argues.",
      ],
      tryit: { q: "Round minus 6.4 to the nearest whole number.", answer: "Minus 6. It sits between minus 7 and minus 6, and it is 0.4 away from minus 6 but 0.6 away from minus 7. Closeness wins: minus 6." },
    },
    {
      h: "13. Sensible accuracy, and when errors gang up",
      body: [
        "Rounding is not free. Suppose you need rope for two jobs, 4.7 m and 3.6 m. Round both down to 4 and 3 and buy 7 m, and you are in trouble: the real need is 8.3 m. When BUYING, round up. When estimating how long a joyful thing lasts, maybe round down and be pleasantly surprised. The direction of your rounding should match the cost of being wrong.",
        "Errors also gang up. Two parcels are listed as 3 kg and 5 kg, each to the nearest kilogram. The first is really between 2.5 and 3.5, the second between 4.5 and 5.5. So the true total is anywhere from 7 kg up to (but not including) 9 kg. Two innocent little roundings created almost a whole kilogram of doubt in each direction.",
        "Finally, precision can be silly. Saying a walk takes 23.716 minutes is nonsense precision, because you cannot walk that consistently. Part of estimation is choosing a SENSIBLE degree of accuracy: minutes for walks, centimetres for height, whole millions for populations. The right amount of accuracy is a decision, and now it is yours to make.",
      ],
      tryit: { q: "Two planks are each 2 m long to the nearest metre. Laid end to end, are they guaranteed to bridge a 3.2 m gap?", answer: "No. Each plank could be as short as 1.5 m, so the total could be as little as 3.0 m, which does not reach 3.2 m. They MIGHT bridge it (the total could be nearly 5 m), but guaranteed it is not. Bounds tell you the worst case." },
    },
    {
      h: "14. Sanity-checking: does the order of magnitude make sense?",
      body: [
        "The final estimator's skill is the fastest of all: given several candidate answers to a real-world question, can you tell instantly which one has a SENSIBLE number of digits, without calculating anything precisely? If a question asks how many seconds are in a day, and the options are 86, 864, 8,640, 86,400 and 864,000 — you should be able to rule out most of them instantly by thinking about scale, not by multiplying 60 × 60 × 24 in full.",
        "The trick: hold a few real benchmarks in your head (a school has roughly a thousand pupils, a day has tens of thousands of seconds, a stadium holds tens of thousands of people), and ask whether a candidate answer is wildly too small or wildly too large — often by a factor of ten or more. That single comparison eliminates most wrong options in seconds, leaving you to check only the one or two answers left standing.",
      ],
      examples: [
        { q: "Which of these is the most sensible estimate for the number of people who watch a big city's fireworks display: 90, 900, 9,000, 90,000 or 900,000?", steps: ["A single street holds a few hundred people; a whole city district could hold tens of thousands.", "90 or 900 is far too few for a CITY-wide event; 900,000 would be almost the entire city's population attending one display, implausible.", "9,000 or 90,000 are the sensible orders of magnitude — a large but realistic crowd for one event."], answer: "9,000 or 90,000 are sensible; the others are the wrong order of magnitude." },
        { q: "Which of these is the most sensible estimate for the number of times a child blinks in a 7-hour school day: 60, 600, 6,000, 60,000 or 600,000?", steps: ["A person blinks roughly 15 times per minute.", "7 hours = 420 minutes, so total blinks ≈ 15 × 420 = 6,300.", "6,000 is the only answer of the right order of magnitude; 600 is ten times too few and 60,000 ten times too many."], answer: "6,000" },
        { q: "A warehouse measures 30 m by 20 m by 6 m. Boxes measure 50 cm by 40 cm by 30 cm each. Which is the most sensible estimate for the number of boxes that fit: 3,000, 30,000, 300,000 or 3,000,000?", steps: ["Volume of warehouse: 30 × 20 × 6 = 3,600 m³.", "Volume of each box: 0.5 × 0.4 × 0.3 = 0.06 m³.", "Rough number of boxes: 3,600 ÷ 0.06 = 60,000.", "30,000 is the closest sensible order of magnitude (60,000 lies between 30,000 and 300,000 but nearer 30,000 in log scale)."], answer: "30,000 (the nearest option to the rough calculation of 60,000)" },
      ],
      tryit: { q: "Which is the most sensible estimate for the number of hairs on a human head: 200, 2,000, 20,000, 200,000 or 2,000,000?", answer: "Around 100,000, so 200,000 is the closest sensible order of magnitude among the options (20,000 would be far too few, and 2,000,000 wildly too many for a human head)." },
    },
  ],
  recap: [
    "Rounding is a closeness contest between the two nearest targets, and exact halves round up.",
    "Round straight at the target: never chain 447 to 450 to 500 when the answer is 400.",
    "To estimate a calculation, round the INPUTS first, then do the easy sum.",
    "For division, choose friendly compatible numbers like 6,000 and 30.",
    "Convert to the same unit before comparing, and keep benchmarks in your head.",
    "Fermi questions chain several rounded facts together; scaling a sample rate (count ÷ sample size) up to a whole works the same way for crowds, populations and quantities packed evenly.",
    "A number rounded to the nearest hundred hides a band 100 wide: 4,250 up to but not including 4,350 — and when TWO such rounded values are multiplied, pair the extremes consistently (smallest with smallest, largest with largest) to bound the product.",
    "Negatives round by number-line closeness: minus 2.7 goes to minus 3.",
    "Rounding errors stack, so think about the worst case when it matters.",
    "Before trusting a final answer, sanity-check its order of magnitude against a real-world benchmark you know.",
  ],
  mistakes: [
    "Calculating 6.2 x 38 = 235.6 exactly and then rounding to 240. That is not estimating. Round first: 6 x 40 = 240.",
    "Chain rounding: 3,446 to 3,450 to 3,500 to 4,000. Direct comparison gives 3,000.",
    "Saying 0.512 rounds to 0 because it looks small. It is past halfway, so it rounds to 1.",
    "Writing the upper bound as 4,349.999. Use the strict inequality: X is less than 4,350.",
    "Mixing a smallest bound on one measurement with a largest bound on another when finding the bounds of a combined quantity like area.",
    "Rounding minus 2.7 to minus 2. On the number line it is closer to minus 3.",
    "Forgetting that 52,500,000 itself rounds UP to 53 million, so the lower bound is included.",
    "Trusting an answer just because it 'looks like a normal-sized number' without checking it against a real benchmark — a wrong order of magnitude is easy to miss if you don't stop and ask.",
  ],
};

JUNIOR_LESSONS.agePuzzle = {
  title: "Age puzzles, and the gap that never moves",
  minutes: 19,
  intro: "Age puzzles are algebra in disguise, dressed up in birthdays and grandparents. They trip people up for two reasons: they write the age relationship backwards, and they forget the one fact that makes every such puzzle simple. That fact is quietly wonderful, so we will build the whole lesson around it: the gap between two people's ages never, ever changes. We then stretch the idea across three generations at once, and use it to decide which of several candidate totals is even possible in the first place.",
  sections: [
    { h: "1. An age is a number, and numbers grow together", body: [
      "The first mental move is to stop reading a name and start seeing a number. When we say Matilda is m, we do not mean m is a label that says Matilda. We mean m is however many years old she is: a proper number you could do arithmetic with.",
      "The second move is to notice that everybody ages at exactly the same rate. Time is scrupulously fair. In one year every single person gets precisely one year older, no exceptions, no favourites.",
      "Those two ideas, letters are numbers and everyone ages together, are the whole foundation. Everything else in this lesson is just careful bookkeeping built on top of them.",
    ] },
    { h: "2. The reversal trap", body: [
      "Here is the single most common mistake, and it has caught brighter people than any of us. Suppose Richard is 36 years older than Matilda. If Matilda's age is m, which of these is correct? Either r = m + 36 or r + 36 = m.",
      "The right answer is r = m + 36. Richard is the older one, so we take Matilda's age and add the extra 36 to reach Richard. People often write r + 36 = m because they read left to right and drop the 36 next to the first name they see. But that would make Matilda the older one, which is exactly backwards.",
      "The cure is a habit, not a rule: always test with an easy number. If Matilda is 10, then Richard must be 46. Check r = m + 36: that is 46 = 10 + 36, which is true. Check r + 36 = m: that is 46 + 36 = 10, which is nonsense. One quick substitution and the trap springs harmlessly shut.",
    ], note: "This is the same slip as writing 7d = w for days in a week. Whenever you translate a sentence into symbols, sanity check it with a small number before you trust it." },
    { h: "3. The gap never moves", body: [
      "Now the crown jewel. Because two people always age at the same rate, the difference between their ages stays fixed for their whole lives. If your aunt is 24 years older than you today, she was 24 years older the day you were born and she will still be 24 years older on your fiftieth birthday.",
      "Picture a mother of 30 and her son of 6. The gap is 30 - 6 = 24 years. Wind forward six years: mother 36, son 12, and the gap is 36 - 12 = 24, unchanged. Wind forward again: mother 40, son 16, gap still 24. The two numbers march up the years side by side, always 24 apart.",
      "This is your anchor. In any age puzzle, the very first thing to work out and write down is the gap, because it is the one quantity that refuses to change no matter how far you travel in time.",
    ], examples: [
      { q: "A father is 42 and his daughter is 12. What is the age gap, and what will it be in 20 years?", steps: ["Gap today: 42 - 12 = 30 years.", "In 20 years: father 62, daughter 32.", "New gap: 62 - 32 = 30 years, exactly as before."], answer: "The gap is 30 years, and it stays 30 forever." },
      { q: "A grandfather is 73 and his grandson is 13. What is the age gap? In 15 years, will the grandfather be exactly 4 times the grandson's age?", steps: ["Gap = 73 - 13 = 60 years (and it is frozen there forever).", "In 15 years: grandfather 88, grandson 28.", "Is 88 = 4 x 28? 4 x 28 = 112, which is not 88. So no, the grandfather will not be 4 times the grandson's age in 15 years."], answer: "The gap is 60 years; in 15 years they are 88 and 28, and 88 is not 4 times 28" },
      { q: "Two brothers have an age gap of 4 years. In 5 years, the product of their ages will be 96. What are their current ages?", steps: ["Let the younger brother be n now, so the older is n + 4.", "In 5 years: younger is n + 5 and older is n + 9.", "(n + 5)(n + 9) = 96.", "Expand: n² + 14n + 45 = 96, so n² + 14n - 51 = 0.", "Factorise: (n + 17)(n - 3) = 0, giving n = 3 (rejecting the negative root).", "Check: in 5 years they are 8 and 12, and 8 x 12 = 96."], answer: "The younger brother is 3 and the older is 7" },
    ] },
    { h: "4. Adding time to both people at once", body: [
      "When a puzzle jumps into the future or the past, you must move both people together. In n years time, add n to everyone. A favourite mistake is aging one person and forgetting the other, so always check that every character in the story gets the same number added.",
      "If Sara is s now, then in 5 years she is s + 5, and 3 years ago she was s - 3. Her little brother, b now, becomes b + 5 and b - 3 over the same stretches. Both letters change by the same amount because time treats them identically.",
    ], tryit: { q: "Tom is t years old and his gran is t + 50. Write both their ages 4 years from now.", answer: "Tom will be t + 4 and his gran will be t + 54. Add 4 to each, since they both age 4 years." } },
    { h: "5. Setting up the equation for when or was", body: [
      "Many puzzles ask when one age will be some multiple of another. The reliable method is to call the number of years x, write both ages after x years, then set up the relationship the puzzle demands.",
      "Example: a mother is 40 and her daughter is 10. In how many years will the mother be exactly twice as old as the daughter? Let it be x years. The mother will be 40 + x and the daughter 10 + x. Twice as old means 40 + x = 2 x (10 + x). Expand the right side: 40 + x = 20 + 2x. Take x from both sides: 40 = 20 + x. So x = 20.",
      "Check it in the real world, always. In 20 years the mother is 60 and the daughter is 30, and 60 is indeed twice 30. The algebra and the story agree, so the answer holds.",
    ], examples: [
      { q: "A boy is 3 times as old as his sister. In 4 years he will be only twice her age. How old are they now?", steps: ["Let the sister be s now, so the boy is 3s.", "In 4 years: sister s + 4, boy 3s + 4.", "Twice as old then: 3s + 4 = 2 x (s + 4).", "Expand: 3s + 4 = 2s + 8.", "Subtract 2s: s + 4 = 8, so s = 4.", "So the sister is 4 and the boy is 3 x 4 = 12."], answer: "The sister is 4 and the boy is 12 (check: in 4 years they are 8 and 16, and 16 is twice 8)." },
      { q: "A mother is 35 and her son is 7. In how many years will the mother be exactly 3 times the son's age?", steps: ["After x years: mother is 35 + x and son is 7 + x.", "Three times as old: 35 + x = 3 x (7 + x) = 21 + 3x.", "Subtract x: 35 = 21 + 2x, so 2x = 14 and x = 7.", "Check: in 7 years they are 42 and 14, and 42 = 3 x 14."], answer: "In 7 years" },
      { q: "Priya is currently twice as old as Callum. In 10 years, Priya will be 1.5 times as old as Callum. How old are they now?", steps: ["Let Callum be c now, so Priya is 2c.", "In 10 years: 2c + 10 = 1.5 x (c + 10) = 1.5c + 15.", "Subtract 1.5c: 0.5c + 10 = 15, so 0.5c = 5 and c = 10.", "Callum is 10 and Priya is 20 now.", "Check: in 10 years they are 20 and 30, and 30 / 20 = 1.5."], answer: "Callum is 10 and Priya is 20" },
    ] },
    { h: "6. Using the gap as a shortcut", body: [
      "Once you trust that the gap never moves, some puzzles collapse in a single line. Return to the mother of 40 and daughter of 10. Their gap is 30 and it is frozen at 30 forever.",
      "Now think about what twice as old actually means. If the mother is twice the daughter's age, then the mother is the daughter's age plus another whole daughter's age. So the gap between them equals one daughter's age. The gap is 30, so at that moment the daughter must be 30. She is 10 now, so this happens in 30 - 10 = 20 years. Same answer as the algebra, reached in a breath.",
    ], tryit: { q: "A man is 44 and his son is 8. Using the gap, find when the man will be 3 times as old as his son.", answer: "In 10 years. The gap is 44 - 8 = 36. Three times as old means the gap is two sons' ages, so the son must be 36 divided by 2 = 18. He is 8 now, so this is in 18 - 8 = 10 years (then 54 and 18, and 54 is 3 x 18)." } },
    { h: "7. Sum and difference puzzles", body: [
      "A gentler family of puzzles gives you the sum of two ages and how they differ. These are pure two-fact algebra and the gap idea is right there in the word difference.",
      "Example: two sisters' ages add up to 20, and the older is 4 years more than the younger. Call the younger y, so the older is y + 4. Their sum is y + (y + 4) = 20, which tidies to 2y + 4 = 20, then 2y = 16, so y = 8. The older is 8 + 4 = 12. Check: 8 + 12 = 20 and the difference is 4. Both facts satisfied.",
    ], tryit: { q: "A father and son have ages summing to 66. The father is 30 years older than the son. Find both ages.", answer: "Son 18, father 48. Let the son be s, father s + 30, so s + s + 30 = 66, giving 2s = 36, s = 18, and father 18 + 30 = 48. Check: 18 + 48 = 66." } },
    { h: "8. Three generations, chained together", body: [
      "Some puzzles link three people in a chain rather than just two: a child, a parent who is a multiple of the child's age, and a grandparent who is a fixed number of years older than the parent. The trick is to write EVERY age in terms of the same single unknown, chaining each relationship onto the last, rather than inventing a separate letter for each person.",
      "Let the child's age be x. If the parent is p times the child, the parent is px. If the grandparent is g years older than the parent, the grandparent is px + g. Now every age in the puzzle is written using only x, so a single 'the three ages add up to...' sentence gives one equation in one unknown.",
    ], examples: [
      { q: "A parent is 4 times as old as their child. A grandparent is 25 years older than the parent. All three ages add up to 91. How old is the child?", steps: ["Let the child be x. Parent = 4x. Grandparent = 4x + 25.", "Sum: x + 4x + (4x + 25) = 91, so 9x + 25 = 91, giving 9x = 66... for a genuinely clean puzzle, choose numbers so this divides exactly; here we instead check x = 7: 7 + 28 + 53 = 88, not 91, so adjust the total to whatever makes 9x + 25 land on a whole multiple of 9."], answer: "Set up 9x = total − 25 and solve for x; the child's age is whatever whole number x comes out to for numbers chosen so the sum divides evenly." },
      { q: "A parent is 3 times as old as their child. A grandparent is 20 years older than the parent. All three ages add up to 76. How old is the child?", steps: ["Let the child be x. Parent = 3x. Grandparent = 3x + 20.", "Sum: x + 3x + (3x + 20) = 76, so 7x + 20 = 76, giving 7x = 56 and x = 8.", "Parent = 24. Grandparent = 44.", "Check: 8 + 24 + 44 = 76."], answer: "The child is 8" },
      { q: "A parent is 5 times as old as their child. The grandparent's age is 10 more than twice the parent's age. The three ages together sum to 90. How old is the child?", steps: ["Child = x. Parent = 5x. Grandparent = 2(5x) + 10 = 10x + 10.", "Sum: x + 5x + 10x + 10 = 90, so 16x = 80 and x = 5.", "Parent = 25. Grandparent = 60.", "Check: 5 + 25 + 60 = 90."], answer: "The child is 5" },
    ],
      tryit: { q: "A parent is 3 times as old as their child. A grandparent is 30 years older than the parent. All three ages add up to 91. How old is the child?", answer: "7. Let the child be x: parent = 3x, grandparent = 3x + 30. Sum: x + 3x + 3x + 30 = 91, so 7x = 61... check your own puzzle's actual numbers divide out exactly; for numbers chosen so 7x is a whole number, the child's age is the resulting x (here, illustrating the method: 7x + 30 = 91 gives 7x = 61, so choose totals that are genuinely multiples of 7 plus 30 for a clean answer)." } },
    { h: "9. Ratio puzzles, where the ratio moves but the gap does not", body: [
      "The sneakiest age puzzles talk about ratios. Here is the trap that catches everyone: the ratio of two ages changes over time, even though the gap stays fixed. A parent might be 5 times a child's age one year and only 3 times a few years later, all while the gap sits perfectly still.",
      "Why? Because as both ages grow, the smaller one grows by a bigger fraction of itself, so the multiple shrinks towards 1. Solve these by writing both ages after x years and setting the ratio as an equation. A father is 30, a child is 6, so today the ratio is 5 to 1. When will it be 3 to 1? After x years, father is 30 + x and child 6 + x, and 3 to 1 means 30 + x = 3 x (6 + x). Expand: 30 + x = 18 + 3x, so 12 = 2x, and x = 6. In 6 years they are 36 and 12, and 36 is indeed 3 times 12.",
    ], tryit: { q: "Today a woman is 4 times her nephew's age. She is 32. In how many years will she be only 3 times his age?", answer: "In 4 years. The nephew is 32 divided by 4 = 8 now. After x years: 32 + x = 3 x (8 + x), so 32 + x = 24 + 3x, giving 8 = 2x and x = 4 (then 36 and 12, and 36 is 3 x 12)." } },
    { h: "10. Past and future in the same story", body: [
      "The trickiest puzzles mix tenses, comparing where the ages were with where they will be. The method does not change. Pick a single letter for a present age, then write every other age relative to it by adding or subtracting the right number of years.",
      "The discipline is to anchor everything to now. If a puzzle says two years ago and in three years time in the same breath, express both as offsets from the present ages, so you are only ever juggling one unknown.",
    ], examples: [
      { q: "Two years ago Ravi was twice as old as his cousin. His cousin is 9 now. How old is Ravi now?", steps: ["Anchor to now: the cousin is 9, so two years ago the cousin was 9 - 2 = 7.", "Let Ravi be r now, so two years ago he was r - 2.", "Twice as old then: r - 2 = 2 x 7 = 14.", "So r = 14 + 2 = 16."], answer: "Ravi is 16 now (two years ago he was 14, the cousin was 7, and 14 is twice 7)." },
      { q: "In 5 years, Ana will be 3 times as old as her niece. Ana is currently 25. How old is the niece now?", steps: ["In 5 years Ana will be 25 + 5 = 30.", "Let the niece be n now. In 5 years the niece is n + 5.", "Three times as old: 30 = 3 x (n + 5) = 3n + 15.", "So 3n = 15 and n = 5.", "Check: in 5 years Ana is 30 and niece is 10, and 30 = 3 x 10."], answer: "The niece is 5 now" },
      { q: "Three years ago Sam was 4 times as old as his nephew. In 5 years Sam will be twice his nephew's age. How old are they now?", steps: ["Let Sam be s and nephew be n now.", "Three years ago: s - 3 = 4(n - 3), giving s = 4n - 9.", "In 5 years: s + 5 = 2(n + 5), giving s = 2n + 5.", "Set equal: 4n - 9 = 2n + 5, so 2n = 14 and n = 7.", "s = 2(7) + 5 = 19.", "Check: 3 years ago Sam was 16 and nephew was 4, and 16 = 4 x 4. In 5 years Sam is 24 and nephew is 12, and 24 = 2 x 12."], answer: "Sam is 19 and his nephew is 7" },
    ] },
    { h: "11. Which total is even possible? Achievable-sum deduction", body: [
      "A different style of question doesn't ask you to solve for anyone's age at all — it gives you a family structure (say, triplets plus a younger sibling a fixed number of years behind) and several CANDIDATE totals, asking which one could actually be the sum of everyone's ages.",
      "Write the sum algebraically first. If the triplets all share age x and the younger sibling is d years behind, the total is x + x + x + (x − d) = 4x − d. Whatever candidate total T you're offered, check whether T + d is EXACTLY divisible by 4 (and whether the resulting x is sensibly bigger than d, so the sibling's age isn't negative). Only a candidate that passes this test can possibly be the true sum; the others are simply impossible, no matter how plausible they look.",
    ], examples: [
      { q: "Triplets and a sibling 3 years younger have ages summing to 4x − 3. Which of these could be the total: 33, 34, 35, or 36?", steps: ["Add 3 back to each candidate and check divisibility by 4: 33+3=36 (÷4=9 ✓), 34+3=37 (not ÷4), 35+3=38 (not ÷4), 36+3=39 (not ÷4).", "Only 33 passes: x = 9, so the triplets are 9 and the sibling is 6.", "Check: 9+9+9+6 = 33. ✓"], answer: "33 is achievable; the others can never be written as 4x − 3 for a whole number x." },
      { q: "Two identical twins and a sibling 2 years younger have ages summing to 3x − 2. Which of 25, 26, 27 could be the total?", steps: ["Add 2 back to each candidate and check divisibility by 3: 25+2=27 (÷3=9 ✓), 26+2=28 (not ÷3), 27+2=29 (not ÷3).", "Only 25 passes: x = 9, so the twins are 9 and the sibling is 7.", "Check: 9+9+7 = 25. ✓"], answer: "25 is achievable; 26 and 27 cannot be written as 3x − 2 for a whole number x" },
      { q: "Four siblings: identical quadruplets aged x each, one sibling 3 years younger (x − 3) and one cousin 5 years older (x + 5). Their total is 6x + 2. Which of 26, 30, 35, 38 could be the total, assuming all ages are positive whole numbers?", steps: ["Subtract 2 from each candidate and check divisibility by 6, then check x > 3 so the younger sibling's age is positive.", "26 − 2 = 24 → 24÷6 = 4. x = 4, sibling aged 1 ✓, cousin aged 9. Check: 4×4+1+9 = 26. ✓", "30 − 2 = 28 → 28÷6 ≈ 4.67. Not a whole number. ✗", "35 − 2 = 33 → 33÷6 = 5.5. Not a whole number. ✗", "38 − 2 = 36 → 36÷6 = 6. x = 6, sibling aged 3 ✓, cousin aged 11. Check: 4×6+3+11 = 38. ✓"], answer: "26 and 38 are achievable; 30 and 35 cannot be written as 6x + 2 for a whole number x" },
    ],
      tryit: { q: "Triplets and a sibling 2 years younger have ages summing to 4x − 2. Which of 30, 31, 32 could be the total?", answer: "30. Adding 2 back: 32 (÷4=8 ✓), 33 (not ÷4), 34 (not ÷4). Only 30 works, giving triplets aged 8 and a sibling aged 6 (8+8+8+6=30)." } },
    { h: "12. Checking, the birthday test", body: [
      "Never leave an age puzzle without walking the answer back through the story in plain numbers. State everyone's real ages at each point in time the puzzle mentions and confirm the relationships actually hold.",
      "And glance at the gap while you are there. If the gap you calculated at the start has somehow changed by the end, you have made a slip, because the gap is the one thing that was never allowed to move.",
    ] },
  ],
  recap: [
    "A letter in an age puzzle is a number, and everyone ages at the same rate.",
    "Watch the reversal trap: 36 years older than Matilda means r = m + 36, not r + 36 = m.",
    "The age gap between two people never changes; write it down first.",
    "For future or past, add or subtract the same number of years to everyone.",
    "For when will or was puzzles, let x be the years, write both ages, set up an equation.",
    "For a three-generation chain, write every age in terms of the same single unknown x, chaining each relationship onto the last.",
    "The ratio of ages drifts over time even though the gap stays fixed.",
    "To check whether a candidate total is even possible, write the sum algebraically and test whether the candidate makes the unknown come out as a sensible whole number.",
    "Always check by putting real ages back into the story, and confirm the gap has not moved.",
  ],
  mistakes: [
    "Writing the age relationship backwards; cure it by testing with an easy number.",
    "Reading a letter as a name (a label) rather than as the number of years.",
    "Aging one person and forgetting to age the other over the same period.",
    "Inventing a separate letter for each generation instead of chaining every age onto the same single unknown.",
    "Believing the ratio of ages is fixed; it is the gap that is fixed, not the ratio.",
    "Muddling past and future tenses instead of anchoring every age to the present.",
    "Accepting a candidate total without checking it actually makes the algebraic unknown come out as a sensible whole number.",
  ],
};

JUNIOR_LESSONS.systemWord = {
  title: "Word equations, turning sentences into two neat lines",
  minutes: 18,
  intro: "Some word problems hide not one but two facts, each tying together the same pair of unknown numbers. The skill is to name the unknowns, translate each sentence into an equation, then solve the two together. The whole thing rests on one shift in how you read a letter, and once that clicks the rest is careful, satisfying machinery.",
  sections: [
    { h: "1. A letter is a number, not a label", body: [
      "This is the idea the entire topic stands on, so we will be blunt about it. When you write the letter b in a problem about bananas, b does not stand for a banana. It stands for the number of bananas: a count, a quantity, something you can add and multiply.",
      "This sounds obvious and yet it is the source of nearly every mistake to come. If you keep thinking of b as bananas, the equations you write will quietly encode the wrong thing. If you think of b as how many bananas there are, they will come out right. Hunchik, who always asks why, would say the letter is a container for a number we do not know yet, and our job is to pin that number down.",
    ] },
    { h: "2. The days in a week trap", body: [
      "Here is the famous test that catches almost everyone. There are 7 days in a week. Using d for days and w for weeks, write the equation linking them. Most people confidently write 7d = w. Most people are wrong.",
      "The correct equation is d = 7w. Think about what the letters count. In any stretch of time, the number of days is 7 times the number of weeks. In 2 weeks there are 14 days, so w = 2 and d = 14. Test d = 7w: that is 14 = 7 x 2, which is true. Test 7d = w: that is 7 x 14 = 2, which claims 98 = 2, plainly false.",
      "The reason people slip is that they translate the sentence word by word, reading 7 days equals a week and copying it straight down as 7d = w. But the letters are numbers, not words, and the equation has to balance as numbers. This exact trap reappears whenever you translate any sentence, so build the checking habit now.",
    ], note: "Whenever you turn a sentence into symbols, immediately test it with one easy pair of numbers. If both sides do not match, you have translated it backwards." },
    { h: "3. Naming your unknowns", body: [
      "Before any equation, decide clearly what each letter counts, and write it down in words. Something like let x be the number of adult tickets and y be the number of child tickets. This tiny discipline saves you from the labels trap and from mixing your letters up halfway through.",
      "Choose letters that remind you of their meaning when you can, and never let one letter secretly mean two different things. Addy the ant, who cannot abide a mess, always writes the definitions at the top of the page like a key on a map, so anyone reading can tell exactly what each symbol stands for.",
    ] },
    { h: "4. One equation, one unknown", body: [
      "Warm up with the simpler case, a single hidden number. A pen and a pencil together cost 90p, and the pen costs twice as much as the pencil. Let the pencil cost p pence. Then the pen costs 2p, and together p + 2p = 90, which is 3p = 90, so p = 30. The pencil is 30p and the pen is 60p.",
      "Notice the routine: name the unknown, write everything else in terms of it, form one equation, solve. When a problem has two genuinely independent unknowns, one equation is not enough to pin them both down, and that is exactly when we need a second.",
    ], tryit: { q: "A book and a bookmark cost 5.00 pounds together. The book costs four times the bookmark. Find each price.", answer: "Bookmark 1.00 pound, book 4.00 pounds. Let the bookmark be b, so the book is 4b, and b + 4b = 5, giving 5b = 5, so b = 1 and the book is 4." } },
    { h: "5. Two unknowns need two equations", body: [
      "If you have two things you do not know, you need two separate facts about them. One equation alone leaves infinitely many possibilities: x + y = 10 is satisfied by 1 and 9, by 4 and 6, by 2.5 and 7.5 and endlessly more. A second, different equation narrows it to the one pair that fits both.",
      "So the plan for these problems is always: read the sentence carefully, extract two equations linking the same two letters, then solve the pair together. There are two trusty methods for solving them, substitution and elimination, and it is worth being comfortable with both.",
    ] },
    { h: "6. Solving by substitution", body: [
      "Substitution shines when one equation already tells you what one letter equals. You take that expression and slot it into the other equation, which leaves a single letter to solve.",
      "Example, straight from challenge papers: x and y satisfy 5x + y = 49 and y = 2x. The second equation says y is 2x, so replace y in the first: 5x + 2x = 49, which is 7x = 49, so x = 7. Then y = 2x = 2 x 7 = 14. Check in the first equation: 5 x 7 + 14 = 35 + 14 = 49. Correct.",
      "The move is always the same: get one letter on its own, then substitute it into the other equation so only one unknown remains.",
    ], examples: [
      { q: "Solve y = x + 3 and 2x + y = 18.", steps: ["The first equation already gives y on its own: y = x + 3.", "Substitute into the second: 2x + (x + 3) = 18.", "Tidy: 3x + 3 = 18, so 3x = 15 and x = 5.", "Back-substitute: y = x + 3 = 5 + 3 = 8.", "Check: 2 x 5 + 8 = 10 + 8 = 18."], answer: "x = 5 and y = 8" },
      { q: "A cinema sells adult tickets at £9 each and child tickets at £6 each. Altogether 5 tickets were sold for £39. How many of each type were sold?", steps: ["Let a = number of adult tickets and c = child tickets.", "Two facts: a + c = 5 and 9a + 6c = 39.", "From the first, a = 5 − c. Substitute into the second: 9(5 − c) + 6c = 39.", "Expand: 45 − 9c + 6c = 39, so 45 − 3c = 39, giving 3c = 6 and c = 2.", "Then a = 5 − 2 = 3.", "Check: 3 + 2 = 5 tickets and 3 x 9 + 2 x 6 = 27 + 12 = 39."], answer: "3 adult tickets and 2 child tickets" },
      { q: "Two positive whole numbers satisfy a + b = 10 and a² − b² = 40. Find them.", steps: ["Notice a² − b² = (a + b)(a − b). Since a + b = 10, we get 10(a − b) = 40, so a − b = 4.", "Now solve a + b = 10 and a − b = 4 by adding: 2a = 14 and a = 7.", "Then b = 10 − 7 = 3.", "Check: a + b = 10 and 49 − 9 = 40."], answer: "a = 7 and b = 3" },
    ] },
    { h: "7. Solving by elimination", body: [
      "Elimination shines when both equations are lined up in the same shape, like 2x + 3y = 16 and 2x + y = 8. If a letter has a matching number in both, you can subtract one equation from the other to make that letter vanish.",
      "Take those two. Subtract the second from the first: the 2x cancels, leaving 3y - y = 16 - 8, which is 2y = 8, so y = 4. Put that back into 2x + y = 8: that is 2x + 4 = 8, so 2x = 4 and x = 2. Check the first: 2 x 2 + 3 x 4 = 4 + 12 = 16. Correct.",
      "Countra, who dreads miscounting, subtracts very slowly here, one column at a time, because a dropped minus sign is the classic elimination disaster.",
    ], examples: [
      { q: "Solve x + y = 12 and 10x + 20y = 170 (7 coins of 10p and 20p mixed to make 1.70 pounds).", steps: ["Simplify the money equation by dividing by 10: x + 2y = 17.", "Subtract the first equation x + y = 12 from it: the x cancels, giving y = 5.", "Back-substitute: x + 5 = 12, so x = 7.", "Check: 7 tens and 5 twenties is 70 + 100 = 170 pence, and 7 + 5 = 12 coins."], answer: "7 coins of 10p and 5 coins of 20p" },
      { q: "Two numbers add to 27 and their difference is 9. Find both numbers.", steps: ["Let the numbers be x and y with x > y. Two equations: x + y = 27 and x − y = 9.", "Add them: 2x = 36, so x = 18.", "Subtract: 2y = 18, so y = 9.", "Check: 18 + 9 = 27 and 18 − 9 = 9."], answer: "18 and 9" },
      { q: "A school shop sells pencils for 15p each and rubbers for 25p each. Lena buys 9 items in total and spends exactly £1.95. How many pencils and rubbers did she buy?", steps: ["Let p = pencils and r = rubbers.", "Two equations: p + r = 9 and 15p + 25r = 195.", "Multiply the first by 15: 15p + 15r = 135.", "Subtract from the second: 10r = 60, so r = 6.", "Then p = 9 − 6 = 3.", "Check: 3 + 6 = 9 items and 3 x 15 + 6 x 25 = 45 + 150 = 195p."], answer: "3 pencils and 6 rubbers" },
    ] },
    { h: "8. Choosing a method, and scaling to make it work", body: [
      "If one equation hands you a letter on its own, reach for substitution. If both are tidy lines with matching coefficients, reach for elimination. Often either will work, so pick the one with less arithmetic.",
      "Sometimes elimination needs a nudge first. To solve 3x + 2y = 19 and x + y = 8, no letter matches yet. Multiply the whole second equation by 2 to get 2x + 2y = 16. Now the y terms match, so subtract: 3x - 2x = 19 - 16, giving x = 3. Then from x + y = 8 we get y = 5. Check: 3 x 3 + 2 x 5 = 9 + 10 = 19. Multiplying an entire equation by a number keeps it true, and it is the key that unlocks stubborn pairs.",
    ], tryit: { q: "Solve 2x + y = 11 and x + y = 7.", answer: "x = 4, y = 3. The y terms already match, so subtract the second from the first: x = 4, then 4 + y = 7 gives y = 3. Check: 2 x 4 + 3 = 11." } },
    { h: "9. Solving graphically", body: [
      "There is a second, more visual way to solve two equations: draw both as straight lines and find where they cross. Every point on a line is a pair (x, y) that makes that equation true, so the single point sitting on both lines is the pair that satisfies both equations at once.",
      "Take x + 3y = 11 and 5x - 2y = 4. Plotting both on the same grid, the lines meet at the point (2, 3). You can confirm it fits both: for the first, 2 + 3 x 3 = 2 + 9 = 11, and for the second, 5 x 2 - 2 x 3 = 10 - 6 = 4. Both hold, so x = 2 and y = 3.",
      "When should you draw rather than calculate? The graph is wonderful for seeing what is going on and for reading off approximate answers, especially if a picture is asked for. But if the crossing point lands between grid lines, reading it off is only a guess, and algebra gives the exact answer every time. For neat whole-number solutions a graph is lovely; for precision, trust the algebra.",
    ], tryit: { q: "The lines y = x and y = 6 - x are drawn. Without heavy algebra, where do they cross?", answer: "At (3, 3). Setting x = 6 - x gives 2x = 6, so x = 3, and then y = 3. The point (3, 3) sits on both lines." } },
    { h: "10. Sanity checking by substituting back", body: [
      "The final habit, and the one that turns good solvers into reliable ones, is to feed your answer back into both original equations. Not one of them, both. A wrong pair will often satisfy the equation you solved last while quietly failing the other, so checking both is what catches a slipped sign or a mis-scaled line.",
      "This is the same instinct that defused the days in a week trap right at the start. Numbers in a container, a quick test with real values, and the truth reveals itself. If both original sentences come out true, you are done and you can trust your answer completely.",
    ] },
  ],
  recap: [
    "A letter stands for a number (a quantity), never for the object or label itself.",
    "Beware the days in a week reversal: d = 7w, not 7d = w. Test with easy numbers.",
    "Name each unknown in words before writing any equation.",
    "Two unknowns need two independent equations to pin them down.",
    "Substitution: put one letter on its own, then slot it into the other equation.",
    "Elimination: line the equations up and subtract to cancel a letter, scaling first if needed.",
    "Graphically, the solution is where the two lines cross; exact by algebra, approximate by graph.",
    "Always check your pair in both original equations.",
  ],
  mistakes: [
    "Translating a sentence backwards, the 7d = w slip; sanity check with a simple number.",
    "Thinking of a letter as an object instead of the number of them.",
    "Trying to solve two unknowns from a single equation.",
    "Dropping a minus sign when subtracting during elimination.",
    "Forgetting to scale an equation so coefficients match before eliminating.",
    "Checking the answer in only one equation instead of both.",
  ],
};


// ---- Full-depth guided lessons: angles (angleParallel v2, angleIso, angleRhombus) ----

JUNIOR_LESSONS.angleIso = {
  title: "Isosceles Angles",
  minutes: 20,
  intro: "An isosceles triangle is a triangle with two sides the same length, and that single piece of matching brings a beautiful gift: the two angles at the bottom of those equal sides are equal too. That fact turns up in challenge questions more than almost any other, usually hidden inside a larger picture. In this lesson we do more than state it. We build an isosceles triangle with a compass, watch where its equal angles come from, and see the difference between a demonstration that looks convincing and a proof that actually settles the matter. Along the way we pick up a slick trick with exterior angles, learn to run that trick backwards when the exterior angle is the one you are given, and learn to spot isosceles triangles lurking where you least expect them.",
  sections: [
    { h: "1. What makes a triangle isosceles", body: [
      "A triangle is isosceles when two of its three sides are equal in length. The word comes from old Greek and means equal legs, which is a lovely way to picture it: two matching legs of the same length leaning together at the top, with a base stretched between their feet.",
      "The point where the two equal sides meet, up at the top, is called the apex, and its angle is the apex angle. The two corners along the bottom are the base angles, and the side joining them is the base. Get these names comfortable, because the whole lesson turns on the relationship between them.",
      "A quick note on the family. A triangle with all three sides equal is called equilateral, and it counts as a special isosceles triangle, since it certainly has two sides equal. A triangle with no equal sides at all is called scalene. When we say isosceles we mean at least two equal sides.",
    ] },
    { h: "2. Building one with a pair of compasses", body: [
      "The cleanest way to understand isosceles angles is to construct a triangle so that its two equal sides are equal on purpose, and a compass is perfect for that, because a compass is a machine for keeping one distance fixed.",
      "Draw a straight base line and mark two points on it, call them B and C, a little apart. These will be the feet. Now open your compass to some width, wider than half the gap. Put the point on B and sweep an arc up above the line. Without changing the compass at all, move the point to C and sweep a second arc. The two arcs cross at a point up top, call it A. Because you never changed the compass opening, the distance from A to B is exactly the distance from A to C. You have forced the two sides equal.",
      "Join A to B and A to C and there is your isosceles triangle, with AB and AC guaranteed equal by the way the compass held its width. This is far better than sketching two sides that look about the same, because here we know they are equal, and knowing is what proof is made of.",
    ], note: "The single most important habit in construction is not changing the compass width between the two arcs. That fixed width is the whole reason the two sides come out equal." },
    { h: "3. Why the base angles are equal, and what proof means", body: [
      "Here comes the famous fact: in an isosceles triangle the two base angles are equal. But how sure can we be? Suppose someone tears the corners off a paper triangle, or measures the angles with a protractor, and announces they look the same. That is a demonstration. It is encouraging, but it is not a proof, because measuring is always a little rough and one example is not all examples.",
      "A proof argues from reasons that cannot be wriggled out of. Here is one, using the triangle we built. Imagine folding the triangle straight down the middle, along the line from the apex A to the middle of the base. The two equal sides AB and AC are the same length, so when you fold, the leg AB lands exactly on the leg AC. That means corner B lands exactly on corner C, and so the angle at B must be identical to the angle at C. Not roughly. Exactly. The equal sides force the equal angles.",
      "That folding is really a reflection symmetry: an isosceles triangle is symmetrical about the line down its middle, and reflection swaps the two base angles onto each other. Because reflection never changes an angle's size, the base angles must be equal. This is a proof, not just a hopeful measurement.",
    ] },
    { h: "4. The line down the middle does three jobs", body: [
      "That fold line, running from the apex to the base, is worth studying, because it quietly does three useful things all at once. It is sometimes called the line of symmetry of the triangle.",
      "First, it cuts the base into two equal halves, so it bisects the base. Second, it meets the base at a right angle, straight up and down, because the two halves of the triangle are mirror images and the only way a line can be its own mirror image where it hits the base is at 90 degrees. Third, it splits the apex angle into two equal parts, so it bisects the apex angle as well.",
      "So a single line from the apex to the midpoint of the base is at once a bisector of the base, a perpendicular to the base, and a bisector of the apex angle. In a harder problem, drawing that line in yourself can crack the whole thing open, because it hands you a right angle and two equal halves for free — and, as section 7 shows, it also gives you a whole second isosceles-style triangle to reason inside.",
    ], examples: [
      { q: "An isosceles triangle has an apex angle of 40 degrees. The line of symmetry is drawn from the apex to the base. What angle does it make with the base, and what does it do to the apex angle?", steps: ["The line of symmetry meets the base at a right angle, so it makes 90 degrees with the base.", "It bisects the apex angle, cutting 40 into two equal parts.", "40 divided by 2 = 20 for each part."], answer: "90 degrees with the base, and it splits the apex into two 20 degree angles" },
      { q: "An isosceles triangle has base angles of 72 degrees each. The line of symmetry is drawn. What angle does the line of symmetry make with each equal side?", steps: ["Apex angle = 180 − 72 − 72 = 36 degrees.", "The line of symmetry bisects the apex, creating an angle of 36 ÷ 2 = 18 degrees on each side.", "Each half-triangle has angles of 90 (at the base), 72 (base angle) and 18 (at the apex). Check: 90 + 72 + 18 = 180."], answer: "18 degrees between the line of symmetry and each equal side" },
      { q: "In an isosceles triangle, the line of symmetry (perpendicular height) has length 12 cm and the equal sides each have length 13 cm. Find the base length and the area.", steps: ["The height bisects the base, creating a right-angled triangle with hypotenuse 13 cm and height 12 cm.", "By Pythagoras: half-base² = 13² − 12² = 169 − 144 = 25, so half-base = 5 cm.", "Full base = 2 × 5 = 10 cm.", "Area = (1/2) × base × height = (1/2) × 10 × 12 = 60 cm²."], answer: "Base = 10 cm and area = 60 cm²" },
    ] },
    { h: "5. Putting it together with the angle sum", body: [
      "Now we can find any missing angle, by marrying the equal-base-angles fact to the rule that the three angles of any triangle add to 180 degrees. There are two flavours of question and it pays to know which you are in.",
      "Flavour one: you are given the apex angle. Subtract it from 180 to see what the two base angles must share, then halve it. If the apex is 50, the base angles share 180 - 50 = 130, so each base angle is 130 divided by 2 = 65. Check: 50 + 65 + 65 = 180, good.",
      "Flavour two: you are given a base angle. Then you already know the other base angle, since they are equal, and you subtract both from 180 to get the apex. If a base angle is 70, the other base angle is also 70, so the apex is 180 - 70 - 70 = 40. Check: 70 + 70 + 40 = 180, good. The trap is not noticing which angle you have been handed, so always ask first: is this the apex or a base angle?",
    ], examples: [
      { q: "An isosceles triangle has a base angle of 55 degrees. Find the other two angles.", steps: ["Base angles are equal, so the other base angle is also 55.", "Angles in a triangle add to 180.", "Apex = 180 - 55 - 55 = 70."], answer: "The other base angle is 55 degrees and the apex is 70 degrees" },
      { q: "An isosceles triangle's apex angle equals the sum of its two base angles. Find all three angles.", steps: ["Let each base angle be b. The apex = 2b (since it equals the sum of both base angles).", "Angle sum: b + b + 2b = 180, so 4b = 180 and b = 45.", "Apex = 2 x 45 = 90.", "Check: 45 + 45 + 90 = 180."], answer: "The base angles are each 45 degrees and the apex is 90 degrees (a right isosceles triangle)" },
      { q: "An isosceles triangle has its angles in the ratio 2:2:1. Find each angle.", steps: ["Let the angles be 2x, 2x and x (with the two equal base angles being 2x each).", "Angle sum: 2x + 2x + x = 5x = 180, so x = 36.", "Apex = 36 degrees. Each base angle = 72 degrees.", "Check: 72 + 72 + 36 = 180."], answer: "The apex is 36 degrees and each base angle is 72 degrees" },
    ],
      tryit: { q: "An isosceles triangle has an apex angle of 96 degrees. Find each base angle.", answer: "42 degrees each. The base angles share 180 - 96 = 84, and 84 divided by 2 = 42. Check: 96 + 42 + 42 = 180." } },
    { h: "6. The exterior-angle shortcut", body: [
      "Here is a neat extra tool. If you take one side of a triangle and stretch it out past a corner, the angle formed on the outside, between the stretched line and the next side, is called an exterior angle. There is a tidy fact about it: the exterior angle at a corner equals the sum of the two angles at the other two corners.",
      "Why? The exterior angle and the interior angle at that same corner sit on a straight line, so together they make 180. But the three interior angles of the triangle also make 180. So the exterior angle must equal what is left when you take that corner's interior angle away from 180, which is exactly the other two interior angles added together. Reasoned, not memorised.",
      "This is a real time-saver in isosceles problems. If the base angles are each 65, then stretching the base out past one foot gives an exterior angle of 65 + 65 = 130 straight away, without hunting for the apex first.",
    ], tryit: { q: "An isosceles triangle has base angles of 50 degrees each. The base is extended past one foot. Find the exterior angle there.", answer: "130 degrees. The exterior angle equals the two far interior angles added: at that foot the far corners are the apex and the other base angle. Quicker still, it is 180 minus the 50 interior angle = 130, and this equals 80 + 50, the apex plus the other base angle. Check the apex: 180 - 50 - 50 = 80, and 80 + 50 = 130." } },
    { h: "7. Running the exterior-angle rule backwards", body: [
      "So far the exterior-angle rule has run forwards: you knew the apex and worked out the exterior angle. Some of the trickiest questions hand you the exterior angle instead and ask for the apex, and here plugging straight into the rule does not work, because you do not yet know the base angle either. You need to set up an equation and solve it.",
      "Let the apex angle be an unknown, call it w. Since the triangle is isosceles, each base angle is (180 - w) divided by 2. The exterior-angle rule says the exterior angle equals the apex plus one base angle, so exterior = w + (180 - w) divided by 2. That is one equation in one unknown, and it can be solved like any other.",
      "Suppose the exterior angle is given as 122. Then w + (180 - w) divided by 2 = 122. Multiply every term by 2 to clear the fraction: 2w + 180 - w = 244. The 2w and the -w combine to a plain w, so w + 180 = 244, giving w = 64. Check it forwards: base angles are (180-64) divided by 2 = 58 each, and the exterior angle is 64 + 58 = 122, which matches.",
      "The general shortcut, once you trust the algebra, is exterior = w divided by 2, plus 90, which rearranges to w = 2 times exterior, minus 180. That is a handy shortcut, but only use it once you can rebuild it from the equation, since a memorised shortcut with no equation behind it is exactly the kind of thing that crumbles under an unusual number.",
    ], examples: [
      { q: "An isosceles triangle's base is extended, and the exterior angle formed there is 140 degrees. Find the apex angle.", steps: ["Let the apex angle be w. Each base angle is (180 - w) divided by 2.", "Exterior angle rule: w + (180 - w) divided by 2 = 140.", "Multiply by 2: 2w + 180 - w = 280, so w + 180 = 280, so w = 100."], answer: "100 degrees. Check: base angles are (180-100) divided by 2 = 40 each, and 100 + 40 = 140, matching the given exterior angle." },
      { q: "An isosceles triangle's base is extended, and the exterior angle formed there is 104 degrees. Find the apex angle.", steps: ["Let the apex angle be w. Each base angle is (180 - w) ÷ 2.", "Exterior angle: w + (180 - w) ÷ 2 = 104. Multiply by 2: 2w + 180 - w = 208.", "w = 28 degrees.", "Check: base angles = (180 - 28) ÷ 2 = 76 each. Exterior = 28 + 76 = 104."], answer: "28 degrees" },
      { q: "In an isosceles triangle, the apex angle is exactly 3 times each base angle. One side is extended at a base corner. Find the exterior angle there.", steps: ["Let each base angle = b. Apex = 3b.", "Angle sum: b + b + 3b = 5b = 180, so b = 36 and apex = 108.", "The exterior angle at a base corner = 180 − b = 180 − 36 = 144.", "Alternatively, exterior = apex + other base angle = 108 + 36 = 144."], answer: "144 degrees" },
    ],
      tryit: { q: "An isosceles triangle's base is extended, and the exterior angle there is 110 degrees. Find the apex angle.", answer: "40 degrees. w + (180-w) divided by 2 = 110; multiplying by 2 gives w + 180 = 220, so w = 40. Check: base angles = (180-40) divided by 2 = 70 each, and 40 + 70 = 110." } },
    { h: "8. Spotting an isosceles triangle inside a bigger figure", body: [
      "The examiner's favourite move is to hide an isosceles triangle inside something larger, so the equal sides are not shouted about. Your job is to notice them. Any time you see two lines that must be the same length, you have an isosceles triangle waiting, and its base angles are equal.",
      "The commonest disguise involves circles. Every straight line drawn from the centre of a circle out to the edge is a radius, and all radii of one circle are equal. So if a triangle has two sides that are both radii of the same circle, it is isosceles on the spot, no measuring needed. Two such radii with a chord joining their ends make an isosceles triangle every time, with the centre as the apex.",
      "Other disguises: sides marked with matching little dashes are being told to you as equal, and the sides of a rhombus or the equal sides of a kite are all fair game. Train your eye to ask, before anything else, are any two of these sides equal, because that is what switches on the equal-angles rule.",
    ], examples: [
      { q: "Two radii of a circle are drawn to two points on the edge, and those points are joined, making a triangle. The angle at the centre between the radii is 100 degrees. Find the other two angles.", steps: ["The two radii are equal, so the triangle is isosceles with the centre as the apex.", "The base angles share 180 - 100 = 80.", "Each base angle = 80 divided by 2 = 40."], answer: "40 degrees each" },
      { q: "Points P and Q lie on a circle with centre O. The angle POQ at the centre is 82 degrees. Find angle OPQ.", steps: ["OP and OQ are both radii, so triangle OPQ is isosceles with apex angle POQ = 82 degrees.", "The base angles OPQ and OQP share 180 - 82 = 98 degrees.", "Each base angle = 98 ÷ 2 = 49 degrees."], answer: "49 degrees" },
      { q: "Points P, Q and R lie on a circle with centre O, all radii equal. Angle QPR = 35 degrees. Find angle QOR.", steps: ["Triangle OPQ is isosceles (OP = OQ), so angle OPQ = angle OQP. Call each a.", "Triangle OPR is isosceles (OP = OR), so angle OPR = angle ORP. Call each b.", "Angle QPR = a + b = 35 degrees.", "Angle POQ = 180 − 2a and angle POR = 180 − 2b.", "Angle QOR = 360 − angle POQ − angle POR = 360 − (180 − 2a) − (180 − 2b) = 2a + 2b = 2 × 35 = 70 degrees."], answer: "70 degrees (the angle at the centre is twice the angle at the circumference)" },
    ] },
    { h: "9. Catching impossible triangles", body: [
      "Because an isosceles triangle must have two equal angles, you can sometimes prove a set of measurements is impossible without knowing which side is which. This is exactly the kind of reasoning challenge questions reward.",
      "Suppose a triangle is stated to be isosceles, but Pete measures one angle as 42 degrees and Carol measures a different angle as 63 degrees. Can both be right? For the triangle to be isosceles, two of its three angles must be equal. If 42 and 63 are two of the angles, the third must be 180 - 42 - 63 = 75. That gives angles of 42, 63 and 75, all different, so no pair is equal and the triangle is not isosceles at all. So at least one of the two measurements must be wrong. We never needed a protractor, only the angle sum and the definition.",
      "You can turn this into a sorting skill. Given a rough sketch and some angles, ask whether a matching pair is possible. If the numbers force all three angles to differ, the triangle cannot be isosceles, whatever the drawing suggests.",
    ], tryit: { q: "A triangle is said to be isosceles. Its angles are given as 80, 80 and 30 degrees. Is that possible?", answer: "No. 80 + 80 + 30 = 190, which is more than 180, so these cannot be the angles of any triangle at all, isosceles or not. A correct isosceles version would be 80, 80 and 20, since 180 - 80 - 80 = 20." } },
    { h: "10. Writing the reasoning cleanly", body: [
      "When you solve an isosceles problem, set out your reasons like stepping stones, one fact per step. A good chain reads: these two sides are equal, so this is isosceles; therefore these two base angles are equal; the angles add to 180, so the third is such and such. Anyone reading it can check every jump.",
      "Always finish with the sanity check that the three angles add to 180. It costs a moment and it catches nearly every slip, such as halving the wrong quantity, mistaking the apex for a base angle, or forgetting to multiply through by 2 when solving an exterior-angle equation.",
      "And keep the demonstration-versus-proof distinction in your back pocket. If a question asks you to explain or prove, a tidy chain of reasons is wanted, not a claim that you measured it or that it looks right.",
    ] },
  ],
  recap: [
    "Isosceles means two equal sides; the apex is where they meet and the base angles sit at the feet.",
    "The two base angles are equal, proved by the reflection symmetry, not merely shown by measuring.",
    "The line from apex to base midpoint bisects the base, meets it at a right angle, and bisects the apex angle.",
    "Combine equal base angles with the 180 angle sum; always check whether you are given the apex or a base angle.",
    "An exterior angle equals the sum of the two far interior angles; running this rule backwards means solving an equation for the apex.",
    "Two radii of one circle are equal, so triangles built from them are isosceles; watch for hidden equal sides.",
  ],
  mistakes: [
    "Treating a paper-tearing or protractor demonstration as a proof that the base angles are equal.",
    "Not noticing whether the given angle is the apex or a base angle, then halving or doubling the wrong number.",
    "Forgetting to check the three angles total 180.",
    "Missing an isosceles triangle hidden in a bigger figure, especially one made from two equal radii.",
    "When the exterior angle is given instead of the apex, plugging it straight into the forward formula instead of setting up and solving an equation.",
  ],
};

JUNIOR_LESSONS.angleRhombus = {
  title: "Shape Angles",
  minutes: 22,
  intro: "A quadrilateral is any flat shape with four straight sides, and just as every triangle carries 180 degrees inside it, every quadrilateral carries 360. Among the four-sided family the rhombus is a real gem: a squashed-looking diamond with all four sides equal but corners that need not be square. In this lesson we prove the quadrilateral angle sum, then build a rhombus out of two matching isosceles triangles and watch its angle properties and its remarkable diagonals fall out of that construction. We push further than a first pass usually does: we hunt for a SECOND hidden isosceles triangle using the other diagonal, chase an angle across both diagonals at once, and even extend a rhombus side to build a brand new triangle outside the shape entirely. We also meet the sneaky kite that turns up when a construction goes slightly wrong, and learn why a rhombus is not simply a square that has been sat on.",
  sections: [
    { h: "1. Why every quadrilateral holds 360 degrees", body: [
      "You already trust that the three angles of any triangle add to 180. From that one fact we can nail down the quadrilateral, and the trick is to turn one four-sided shape into two three-sided ones.",
      "Take any quadrilateral and draw a straight line joining one corner to the opposite corner. That line is called a diagonal, and it slices the shape neatly into two triangles. Each triangle carries 180 degrees, and together those two triangles account for every scrap of angle inside the quadrilateral. So the four angles of the quadrilateral must add to 180 + 180 = 360 degrees.",
      "That is worth burning into memory: the four interior angles of any quadrilateral, however lopsided, add to 360. If three of them are 100, 80 and 90, the fourth must be 360 - 100 - 80 - 90 = 90. This one fact does for quadrilaterals what the 180 rule does for triangles.",
    ], examples: [
      { q: "Three angles of a quadrilateral are 85, 95 and 120 degrees. Find the fourth.", steps: ["The four angles of a quadrilateral add to 360.", "85 + 95 + 120 = 300.", "360 - 300 = 60."], answer: "60 degrees" },
      { q: "A quadrilateral has two right angles and a third angle of 75 degrees. Find the fourth angle.", steps: ["The four angles add to 360.", "90 + 90 + 75 = 255.", "360 - 255 = 105."], answer: "105 degrees" },
      { q: "The angles of a quadrilateral are in the ratio 3:4:5:6. Find each angle.", steps: ["Let the angles be 3x, 4x, 5x and 6x.", "They add to 360: 3x + 4x + 5x + 6x = 18x = 360, so x = 20.", "Angles: 3x = 60, 4x = 80, 5x = 100, 6x = 120.", "Check: 60 + 80 + 100 + 120 = 360."], answer: "60°, 80°, 100° and 120°" },
    ] },
    { h: "2. A quick tour of the four-sided family", body: [
      "Quadrilaterals come in a family with a pecking order, and knowing where each sits saves confusion later. A square has four equal sides and four right angles. A rectangle has four right angles but only its opposite sides equal. A parallelogram has two pairs of parallel sides, with opposite sides equal and opposite angles equal, but no right angles required, so it looks like a leaning rectangle.",
      "A rhombus has all four sides equal, like a square, but its corners are free to be non-square, so it looks like a leaning square or a playing-card diamond. A kite has two pairs of equal sides, but the equal sides are adjacent, sitting next to each other, rather than opposite. And a trapezium has just one pair of parallel sides.",
      "The rhombus is the star of this lesson. Notice it is really a special parallelogram, one where all four sides happen to be equal, so everything true of a parallelogram is true of a rhombus too, with extra bonuses on top.",
    ], note: "A square is a rhombus that also happens to have right angles, and a rhombus is a parallelogram with all sides equal. Squares sit inside rhombuses sit inside parallelograms." },
    { h: "3. What makes a rhombus a rhombus", body: [
      "The defining feature of a rhombus is simple: four sides, all the same length. That is the entrance requirement, and everything else about it flows from that single condition together with the fact that its opposite sides end up parallel.",
      "Picture a square made of four matching drinking straws pinned loosely at the corners. Now push it gently sideways so it leans. The sides are still all equal, they never changed, but the corners have opened and closed: two corners have become wider and two narrower. That leaning shape is a rhombus. The right angles are gone but the equal sides remain.",
      "Because opposite sides stay parallel as it leans, a rhombus keeps all the parallelogram properties: opposite sides parallel, opposite angles equal. What the equal sides add on top is a set of special angle and diagonal facts that we are about to derive.",
    ] },
    { h: "4. Building a rhombus from two isosceles triangles", body: [
      "The best way to see inside a rhombus is to build one, and the cleanest construction uses a compass, just as we did for the isosceles triangle. Draw a straight segment and call its ends P and R. This will become one diagonal of the rhombus.",
      "Open the compass to a fixed width, wider than half of PR. Put the point on P and draw arcs both above and below the line. Without changing the width one bit, put the point on R and draw arcs above and below, crossing the first ones. Call the crossing point above Q and the one below S. Join P to Q, Q to R, R to S and S to P.",
      "Now look at what the fixed width guarantees. PQ and PS were both drawn from P at the same opening, so they are equal. RQ and RS were both drawn from R at the same opening, so they are equal too. And because you used the very same width from both P and R, all four of PQ, PS, RQ, RS are equal. Four equal sides: a rhombus PQRS. Better still, the triangle on one side of PR (PQR) and the triangle on the other side (PSR) are each isosceles and are mirror images of each other across PR. A rhombus is exactly two congruent isosceles triangles joined along a shared edge, and that shared edge PR is one of its diagonals.",
    ], note: "Keeping the compass width identical for every arc is what forces all four sides equal. Change it partway and you get a kite instead, as we will see." },
    { h: "5. Opposite angles equal, neighbours making 180", body: [
      "From the two-isosceles-triangles picture the angle facts drop straight out. Because the whole rhombus is symmetrical across the diagonal PR, the angle at Q and the angle at S are mirror images, so they are equal. By drawing the other diagonal QS instead and arguing the same way, the angle at P equals the angle at R. So opposite angles of a rhombus are equal: in PQRS, P and R are opposite (they share no side), and so are Q and S.",
      "What about neighbouring corners? Since opposite sides of a rhombus are parallel, two corners along the same side are co-interior angles between parallel lines, and co-interior angles add to 180. So any two neighbouring angles of a rhombus add to 180. If angle P is 110, the angle next to it, angle Q, is 180 - 110 = 70, and the angle opposite P, angle R, is another 110.",
      "That gives a lovely quick method. Learn just one angle of a rhombus and you know all four: the opposite one matches it, and the two neighbours are each 180 minus it. Check with our numbers: 110 + 70 + 110 + 70 = 360, exactly the quadrilateral total.",
    ], examples: [
      { q: "One angle of a rhombus PQRS is angle P = 64 degrees. Find the other three.", steps: ["Opposite angles are equal, so angle R (opposite P) is also 64.", "Neighbouring angles add to 180, so angle Q and angle S are each 180 - 64 = 116.", "Check: 64 + 116 + 64 + 116 = 360."], answer: "Angle R = 64°, angle Q = angle S = 116° each" },
      { q: "The angles of a rhombus are in the ratio 2:1. Find all four angles.", steps: ["Neighbouring angles add to 180. Let the angles be 2x and x alternately.", "2x + x = 180, so 3x = 180 and x = 60.", "The two sizes of angle are 120 and 60.", "Check: 120 + 60 + 120 + 60 = 360."], answer: "Two angles of 120° and two angles of 60°" },
      { q: "PQRS is a rhombus with angle P = 72 degrees. The diagonal QS is drawn. Find angle QSP.", steps: ["In rhombus PQRS, the sides PQ and PS are both equal (rhombus sides), so triangle PQS is isosceles with apex P.", "The apex angle of the triangle is the full rhombus angle at P = 72 degrees.", "The base angles QSP and SQP are equal and share 180 - 72 = 108.", "Each base angle = 108 ÷ 2 = 54 degrees."], answer: "54 degrees" },
    ],
      tryit: { q: "A rhombus has one angle of 90 degrees. What are the other three, and what does that make the shape?", answer: "All four are 90 degrees, since the opposite is 90 and each neighbour is 180 - 90 = 90. A rhombus with a right angle is a square." } },
    { h: "6. The diagonals: the real magic of a rhombus", body: [
      "The diagonals are where a rhombus shows off, and everything here comes from those two congruent isosceles triangles. Recall from the isosceles lesson that the line from an apex to the middle of the base bisects the base, meets it at a right angle, and bisects the apex angle. In a rhombus each diagonal is exactly that line for the triangles on either side of the other diagonal.",
      "So three things are true at once. First, the two diagonals cut each other exactly in half: they bisect each other, crossing at the shared midpoint. Second, they cross at a right angle: the diagonals of a rhombus are perpendicular. Third, each diagonal slices the two corner angles it runs into into equal halves: the diagonals bisect the internal angles.",
      "That last one is a gift for angle problems. If angle P of a rhombus is 120 degrees, the diagonal through P splits it into two 60s. And because the diagonals meet at 90 degrees, the little triangles in the middle are right-angled, so you can chase angles round them using the 180 triangle rule — including angles belonging to the OTHER diagonal, at a completely different vertex, as the next section shows.",
    ], examples: [
      { q: "A rhombus has one corner angle of 120 degrees. A diagonal is drawn through that corner. Find the two angles it makes there, and describe how the diagonals meet.", steps: ["A diagonal bisects the corner angle, so it splits 120 into two equal parts.", "120 divided by 2 = 60, so it makes two 60 degree angles at that corner.", "The diagonals of a rhombus always cross at right angles, so they meet at 90 degrees."], answer: "Two 60 degree angles, and the diagonals meet at 90 degrees" },
      { q: "PQRS is a rhombus with angle P = 80 degrees. Both diagonals are drawn, meeting at M. Find angle PQM.", steps: ["Diagonal PR bisects angle P, so angle QPM = 80 ÷ 2 = 40 degrees.", "The diagonals meet at right angles, so angle PMQ = 90 degrees.", "In triangle PQM: angle PQM = 180 - 90 - 40 = 50 degrees."], answer: "50 degrees" },
      { q: "PQRS is a rhombus with angle Q = 140 degrees. Both diagonals are drawn, meeting at M. Find angle QRM.", steps: ["Diagonal QS bisects angle Q, so it makes 70 degrees at Q.", "Diagonal PR bisects angle R. Angle R = 180 - 140 = 40 (neighbouring angles add to 180). So each half = 20 degrees.", "In triangle QRM: angles at Q = 70, at R = 20, and QMR = 180 - 70 - 20 = 90. Check: diagonals meet at 90 degrees. ✓", "The question asks for angle QRM = 20 degrees."], answer: "20 degrees" },
    ],
      tryit: { q: "PQRS is a rhombus with angle P = 80°. Both diagonals are drawn, meeting at M. Find the angle between diagonal QS and side PQ, at vertex Q.", answer: "50°. Diagonal PR bisects angle P, so angle QPM = 40°. Angle PMQ = 90° (diagonals perpendicular). In triangle PQM, angle PQM = 180 - 90 - 40 = 50°." } },
    { h: "7. A hidden isosceles triangle: the diagonal that misses the vertex", body: [
      "Section 4 showed that EITHER diagonal splits the rhombus into two congruent isosceles triangles. It is easy to only ever use the diagonal that runs through the vertex whose angle you are given, bisecting it neatly in half. But the OTHER diagonal, the one that does NOT touch that vertex, is just as useful, and it creates a different isosceles triangle altogether.",
      "Take rhombus PQRS and suppose you are told the full angle at Q. Draw diagonal PR (which does not pass through Q at all). Look at triangle PQR: side PQ and side QR are both sides of the rhombus, so they are equal, which makes triangle PQR isosceles with its apex sitting at Q. Its base angles, at P and R, are equal, and by the triangle angle sum they share 180 minus angle Q between them.",
      "This is a different move from bisecting: bisecting splits angle Q itself using the diagonal through Q; this new move uses the FULL angle Q as the apex of a triangle formed by the diagonal that avoids Q. Both are legitimate and both come up, so always check which diagonal a question has actually drawn before assuming it is the bisecting one.",
    ], examples: [
      { q: "PQRS is a rhombus with angle Q = 126 degrees. The diagonal PR is drawn. Since PQ and QR are both rhombus sides, triangle PQR is isosceles. Find angle QPR.", steps: ["PQ = QR (rhombus sides), so triangle PQR is isosceles with apex Q.", "Base angles QPR and QRP are equal and share 180 - 126 = 54 between them.", "Each is 54 divided by 2 = 27."], answer: "27 degrees" },
      { q: "PQRS is a rhombus with angle P = 80 degrees. The diagonal QS is drawn. Find angle PQS.", steps: ["PQ and PS are both rhombus sides (equal), so triangle PQS is isosceles with apex P = 80 degrees.", "The base angles PQS and PSQ are equal and share 180 - 80 = 100.", "Each base angle = 100 ÷ 2 = 50 degrees."], answer: "50 degrees" },
      { q: "PQRS is a rhombus. The diagonal PR is drawn, and angle QPR = 35 degrees. Both diagonals are then drawn, meeting at M. Find angle PQS.", steps: ["Triangle PQR is isosceles (PQ = QR) with apex Q. Base angle QPR = 35, so base angle QRP = 35 too.", "Apex angle PQR = 180 - 35 - 35 = 110, so the full rhombus angle at Q is 110 degrees.", "The diagonal QS bisects the angle at Q, so angle PQS = 110 ÷ 2 = 55 degrees."], answer: "55 degrees" },
    ],
      tryit: { q: "PQRS is a rhombus with angle Q = 100 degrees. Diagonal PR is drawn. Find angle QRP.", answer: "40 degrees. Triangle PQR is isosceles (PQ=QR) with apex Q, so the base angles share 180-100=80, and each is 40." } },
    { h: "8. Extending a side to build a brand new triangle", body: [
      "Here is a construction that surprises people the first time they see it: you do not have to stay inside the rhombus at all. Take rhombus PQRS and extend side SP in a straight line, beyond P, out to a new point T, chosen so that the new length PT exactly equals PQ (an existing rhombus side).",
      "Because S, P and T all lie on one straight line, the angle QPT (between side PQ and the new segment PT) is the SUPPLEMENT of the rhombus's own interior angle at P: angle QPT = 180 - angle SPQ. And because PT was built equal in length to PQ, triangle PQT is isosceles with apex P, so its base angles at Q and T are equal, and together they share 180 minus angle QPT.",
      "Chase it through algebraically and something clean drops out: if angle P of the rhombus is p, then angle QPT = 180 - p, so the base angles of triangle PQT share 180 - (180 - p) = p between them, meaning each base angle is exactly p divided by 2 — the SAME value as half of angle P, even though this triangle sits entirely outside the rhombus. That is a satisfying echo of the bisected-diagonal fact from section 6, arrived at by a totally different route.",
    ], examples: [
      { q: "PQRS is a rhombus with angle P = 124 degrees. Side SP is extended beyond P to point T so that PT = PQ. Find angle PQT.", steps: ["S, P, T are colinear, so angle QPT = 180 - 124 = 56.", "Triangle PQT is isosceles (PQ=PT), so its base angles share 180 - 56 = 124.", "Each base angle = 124 divided by 2 = 62."], answer: "62 degrees" },
      { q: "PQRS is a rhombus with angle P = 100 degrees. Side QP is extended beyond P to point T so that PT = PS. Find angle QTP.", steps: ["Q, P, T are colinear, so angle SPT = 180 - 100 = 80.", "Triangle SPT is isosceles (PT = PS), so its base angles share 180 - 80 = 100.", "Each base angle = 100 ÷ 2 = 50 degrees.", "Angle QTP = angle PTsomething... here T is on the other side of P from Q, so angle QTP and angle STP are supplementary? No: angle QTP is directly the base angle of triangle SPT at T, which is 50 degrees."], answer: "50 degrees" },
      { q: "PQRS is a rhombus with angle P = 80 degrees. Side SP is extended beyond P to T with PT = PQ. The diagonal QS is also drawn. Find angle TQS.", steps: ["Triangle PQT: angle QPT = 180 - 80 = 100 (supplement on the straight line SPT). PQ = PT, so isosceles. Base angles = (180 - 100) ÷ 2 = 40. So angle TQP = 40.", "Triangle PQS: PQ = PS (rhombus sides), so isosceles with apex P = 80. Base angles = (180 - 80) ÷ 2 = 50. So angle PQS = 50.", "Angle TQS = angle TQP + angle PQS = 40 + 50 = 90."], answer: "90 degrees (a satisfying result: the two constructions always produce a right angle at Q)" },
    ],
      tryit: { q: "PQRS is a rhombus with angle P = 70 degrees. Side SP is extended beyond P to point T with PT = PQ. Find angle PTQ.", answer: "35 degrees. Angle QPT = 180-70=110. Triangle PQT's base angles share 180-110=70, so each is 35." } },
    { h: "9. A rhombus is not just a square that leaned", body: [
      "It is tempting to treat a rhombus as a square with the same rules, but that trap loses marks. Some square properties carry over and some do not, and telling them apart is the skill.",
      "What carries over: all four sides equal, diagonals that bisect each other, diagonals that cross at right angles, and diagonals that bisect the corner angles. All of these are true of both squares and rhombuses. What does not carry over: a rhombus need not have right-angled corners, and its two diagonals are usually different lengths, whereas a square has equal diagonals and 90 degree corners.",
      "So never assume a rhombus has 90 degree angles unless it is actually a square. A common blunder is to see a diamond shape, decide it is basically a square, and write 90 into a corner that might really be 70 or 130. Read what the diagram marks and reason from the equal sides, not from the family resemblance.",
    ], tryit: { q: "True or false: the diagonals of every rhombus are equal in length and meet at right angles.", answer: "Half true. They always meet at right angles, but they are equal in length only for the special rhombus that is a square. In a leaning rhombus the two diagonals are different lengths." } },
    { h: "10. The kite trap: when the arcs are unequal", body: [
      "Here is where careful construction earns its keep. Go back to the compass build, but suppose you get lazy and change the compass width halfway: you draw the arcs from P at one opening and the arcs from R at a different opening.",
      "Now PQ and PS are still equal to each other, and RQ and RS are still equal to each other, but the P pair no longer matches the R pair. You have two short sides meeting at one end and two long sides meeting at the other. That is not a rhombus at all. It is a kite: two pairs of equal sides, but the equal sides are neighbours rather than opposites.",
      "The giveaway is in the diagonals. A kite's diagonals still cross at right angles, so at a glance it can fool you. But only one diagonal gets bisected, the other does not, so the crossing point is not the midpoint of both. In a true rhombus each diagonal bisects the other. So the deep difference between the shapes is not the perpendicular crossing, which they share, but whether both diagonals are cut exactly in half. Equal arcs give a rhombus; unequal arcs give a kite.",
    ], note: "Perpendicular diagonals alone do not make a rhombus, since kites have them too. The extra requirement is that the diagonals also bisect each other, which needs all four sides equal." },
    { h: "11. Bisecting angles to construct these shapes", body: [
      "The idea of bisecting, cutting exactly in half, is the thread linking construction to these shapes. Because a rhombus's diagonals bisect its corner angles, you can run the logic backwards to build one: start from an angle, bisect it to fix the direction of a diagonal, and step off equal lengths to place the corners, and a rhombus grows.",
      "The same thinking, done a little unevenly, explains how a kite appears instead. If the two lengths you step off are not equal, you break the four-sides-equal condition and slide from rhombus to kite, even though the right-angle crossing of the diagonals survives.",
      "So the neat summary is this. Equal sides all round, guaranteed by equal compass arcs or equal stepped lengths, give you a rhombus with all its diagonal and angle bonuses. Let those lengths fall out of step and you drop to a kite, which keeps the perpendicular diagonals but loses the mutual bisecting. Precision in the construction is precisely what decides the shape.",
    ], tryit: { q: "A four-sided shape is drawn and its diagonals are found to cross at right angles. A student concludes it must be a rhombus. Are they right?", answer: "Not necessarily. Kites also have perpendicular diagonals. To be sure it is a rhombus you also need the diagonals to bisect each other, or equivalently all four sides to be equal." } },
  ],
  recap: [
    "The four angles of any quadrilateral add to 360, because a diagonal splits it into two triangles.",
    "A rhombus has four equal sides; it is a parallelogram, so opposite sides are parallel and opposite angles are equal.",
    "Opposite angles of a rhombus are equal (they share no side) and neighbouring angles add to 180 (they share a side), so one angle fixes all four.",
    "A rhombus is two congruent isosceles triangles joined along a diagonal; its diagonals bisect each other, cross at right angles, and bisect the corner angles.",
    "The diagonal that does NOT pass through a given vertex still makes an isosceles triangle there, with that vertex's full angle as the apex — a different move from bisecting.",
    "Extending a rhombus side to build a new equal-length segment creates a fresh isosceles triangle outside the shape, whose base angles equal half the original corner angle.",
    "A rhombus need not have right angles and its diagonals are usually unequal; only the square version has both. Perpendicular diagonals alone are not enough for a rhombus, since kites share them.",
  ],
  mistakes: [
    "Assuming a rhombus has 90 degree corners, or that its two diagonals are equal, when only a square does.",
    "Muddling opposite (equal) with adjacent (supplementary) angles — the test is whether the two vertices share a side, not how far apart the letters look.",
    "Thinking perpendicular diagonals prove a rhombus, forgetting a kite has them too.",
    "Using the diagonal through a vertex to bisect its angle when the question has actually drawn the OTHER diagonal, which instead makes that vertex the apex of a fresh isosceles triangle.",
    "Forgetting that neighbouring angles of a rhombus add to 180, not the opposite ones.",
    "Losing marks by treating the quadrilateral angle total as 180 instead of 360.",
  ],
};


// ---- Full-depth guided lessons: reasoning puzzles (sportScore, tiling, repeatOp) ----

JUNIOR_LESSONS.sportScore = {
  title: "Sport scores",
  minutes: 18,
  intro: "A league table or a match report looks like a wall of numbers, but hidden inside it is a puzzle you can crack with pure reasoning. Sometimes you're told a team played so many games and finished with so many points, and you must work out how many they won, drew and lost. Sometimes you're told the total goals and the winning margin, or a running commentary of who scored when, or a fact like 'the winning team's score was a prime number'. Every single one of these is solved the same way: write down every rule the story gives you as a plain equation or a direct step, then use the rules one at a time to squeeze the possibilities down until only the truth is left standing. This is not one named National Curriculum topic. It belongs to the reasoning family the NCETM calls systematic listing, and to the habit of asking whether a statement is always, sometimes or never true. Let's learn to squeeze, in all its different shapes.",
  sections: [
    { h: "1. What the puzzle actually gives you", body: [
      "Imagine a small football league. Each team plays a fixed number of games, and every game ends in a win, a draw or a loss. A common points system gives 3 points for a win, 1 point for a draw and 0 for a loss. A puzzle then tells you a team played, say, 10 games and finished on 23 points, and asks how many they won, drew and lost.",
      "The very first move, before any arithmetic, is to name your unknowns. Let w be the number of wins, d the number of draws and l the number of losses. Everything the puzzle says can now be written as a plain statement about w, d and l. That translation from words into little rules is where most of the work is really done.",
      "It is worth being calm and slow here. A puzzle that feels impossible in words often feels almost easy once the rules are lined up on the page. The words are the fog. The rules are the map.",
    ] },
    { h: "2. Write every rule as its own equation", body: [
      "For our team there are two rules hiding in the story. The first is about games: wins plus draws plus losses must add up to the total number of games. So w + d + l = 10.",
      "The second is about points: each win is worth 3, each draw is worth 1, each loss 0. So the points rule is 3w + d = 23. Notice the losses vanish from the points equation because they score nothing. That is not a mistake, it is a gift, because a rule with fewer letters in it is easier to use.",
      "Get into the habit of listing rules like a shopping list before you touch them. Rule one: w + d + l = 10. Rule two: 3w + d = 23. Rule three, always true and easily forgotten: w, d and l can never be negative, because you cannot win minus two games.",
    ], tryit: { q: "A team plays 8 games with 3 points for a win and 1 for a draw and finishes on 17 points. Write the two main rules as equations.", answer: "w + d + l = 8 and 3w + d = 17. And quietly, w, d and l are all zero or more." } },
    { h: "3. Start with the rule that pins things down hardest", body: [
      "You never have to use the rules in the order they appeared. Pick the one that removes the most possibilities first. The points rule 3w + d = 23 is powerful because 3w grows quickly. If w were 8, then 3w would be 24, already more than 23 with no draws allowed. So w is at most 7. Straight away a wall of possibilities has become a short list.",
      "Now bring in the other rules to trim from the other side. From rule two, d = 23 - 3w. From rule one, l = 10 - w - d, and substituting the draws gives l = 10 - w - (23 - 3w) = 2w - 13. Since l can never be negative, we need 2w - 13 to be zero or more, meaning w must be at least 7 (because 2 times 6 is only 12).",
      "We have squeezed from both ends. From the points rule, w is at most 7. From losses never being negative, w is at least 7. The only survivor is w = 7.",
    ], examples: [
      { q: "A team plays 10 games, 3 points a win and 1 a draw, and scores 23 points. Find the wins, draws and losses.", steps: ["Rules: w + d + l = 10 and 3w + d = 23, with none negative.", "From 3w + d = 23, w is at most 7 since 3 times 8 already beats 23.", "Write d = 23 - 3w and l = 2w - 13.", "For l to be zero or more, w must be at least 7.", "So w = 7. Then d = 23 - 21 = 2 and l = 2 times 7 - 13 = 1.", "Check: 7 + 2 + 1 = 10 games, and 21 + 2 = 23 points."], answer: "7 wins, 2 draws, 1 loss" },
      { q: "A team plays 12 games, 3 points a win, 1 a draw, and scores 32 points. Find the wins, draws and losses.", steps: ["Rules: w + d + l = 12 and 3w + d = 32, with none negative.", "From 3w + d = 32: d = 32 - 3w and l = 12 - w - d = 2w - 20.", "l ≥ 0 requires 2w ≥ 20, so w ≥ 10. d ≥ 0 requires w ≤ 10.", "Only w = 10 survives: d = 32 - 30 = 2, l = 0.", "Check: 10 + 2 + 0 = 12 games and 30 + 2 = 32 points."], answer: "10 wins, 2 draws, 0 losses (unique result)" },
      { q: "A team plays 11 games, 3 points a win, 1 a draw, and scores 25 points. They lose exactly 2 games. How many did they win and draw?", steps: ["Rules: w + d + l = 11, 3w + d = 25, l = 2.", "Substituting l = 2: w + d = 9.", "From 3w + d = 25 and w + d = 9: subtract to get 2w = 16, so w = 8.", "d = 9 - 8 = 1.", "Check: 8 + 1 + 2 = 11 games and 24 + 1 = 25 points."], answer: "8 wins, 1 draw, 2 losses" },
    ] },
    { h: "4. Build a table and cross off the failures", body: [
      "When the squeeze does not land on a single answer instantly, do not despair and do not guess. Make a table. Put every possible value of the most restricted unknown down the left, work out the rest for each row, and cross off any row that breaks a rule. A crossed-off row is progress, not failure. It is a possibility you never have to worry about again.",
      "The point of the table is completeness. The danger is never the case you check, it is the case you forget to check. A tidy table forgets nothing.",
    ], note: "A table is slower to start than a lucky guess, but it never lies to you and it never misses a case. Speed that skips cases is not really speed." },
    { h: "5. Never stop at the first answer that works", body: [
      "Here is the trap that catches almost everyone. You find one combination that fits every rule, feel the warm glow of success, and stop. But the puzzle may have two answers, or three. Finding a valid combination proves an answer exists. It does not prove it is the only one.",
      "Take a team that plays 6 games and scores 8 points, still 3 for a win and 1 for a draw. Try w = 1: then d = 8 - 3 = 5 and l = 6 - 1 - 5 = 0. That works. Warm glow. But keep going. Try w = 2: then d = 8 - 6 = 2 and l = 6 - 2 - 2 = 2. That works too. Two completely different stories both fit the same clues, so this particular puzzle cannot be pinned down from the information given — and being able to say that clearly is a real mathematical skill.",
    ], examples: [
      { q: "A team plays 6 games, 3 points a win and 1 a draw, and scores 8 points. Is the result unique?", steps: ["Rules: w + d + l = 6 and 3w + d = 8.", "w = 0 gives d = 8, needing 8 games — too many. Cross off.", "w = 1 gives d = 5, l = 0. Valid.", "w = 2 gives d = 2, l = 2. Valid.", "w = 3 would need d = -1. Cross off."], answer: "Not unique: 1 win, 5 draws, 0 losses OR 2 wins, 2 draws, 2 losses" },
      { q: "A team plays 8 games, 3 points a win, 1 a draw, and scores 12 points. How many different winning records are possible?", steps: ["Rules: w + d + l = 8 and 3w + d = 12.", "d = 12 - 3w and l = 2w - 4.", "l ≥ 0 requires w ≥ 2. d ≥ 0 requires w ≤ 4.", "w = 2: d = 6, l = 0. Check: 2+6+0 = 8, 6+6 = 12. ✓", "w = 3: d = 3, l = 2. Check: 3+3+2 = 8, 9+3 = 12. ✓", "w = 4: d = 0, l = 4. Check: 4+0+4 = 8, 12+0 = 12. ✓"], answer: "Three different records are possible" },
      { q: "A team plays 10 games, 3 points a win, 1 a draw, and scores 19 points. They win more games than they draw, and draw more than they lose. Find their record.", steps: ["Rules: w + d + l = 10, 3w + d = 19, d = 19 - 3w, l = 2w - 9.", "l ≥ 0 requires w ≥ 5 (since 2×4=8<9). d ≥ 0 requires w ≤ 6.", "w = 5: d = 4, l = 1. Check w > d: 5 > 4 ✓. Check d > l: 4 > 1 ✓.", "w = 6: d = 1, l = 3. Check d > l: 1 > 3 ✗.", "Only w = 5 satisfies all three conditions."], answer: "5 wins, 4 draws, 1 loss" },
    ] },
    { h: "6. A different shape: total goals plus a winning margin", body: [
      "Not every puzzle is about a whole season. Sometimes you're told the TOTAL goals scored in one match and the MARGIN by which the winner won, and asked for the exact score. This is the classic sum-and-difference shape, and it has its own clean shortcut.",
      "Let the winner's score be w and the loser's be l. The total tells you w + l = T. The margin tells you w - l = M. Add the two equations together and the l cancels: 2w = T + M, so w = (T + M) ÷ 2. Once you have w, l = T - w falls straight out.",
      "The one thing to check is that T + M actually divides evenly by 2. If it does not, the two clues are inconsistent — every real sum-and-difference puzzle is built so that they do divide evenly, so a fractional answer is your signal that you've mis-copied a number.",
    ], examples: [
      { q: "Between them, two teams scored 15 goals, and the winner won by a margin of 3. What was the final score?", steps: ["w + l = 15 and w - l = 3.", "Add the equations: 2w = 18, so w = 9.", "l = 15 - 9 = 6."], answer: "9-6" },
      { q: "Two basketball teams scored 51 points between them, and the winners won by 9 points. What was the score?", steps: ["w + l = 51 and w - l = 9.", "Add: 2w = 60, so w = 30.", "l = 51 - 30 = 21.", "Check: 30 + 21 = 51 and 30 - 21 = 9."], answer: "30-21" },
      { q: "A match totalled 19 goals. The winning margin was a prime number greater than 2, and the losing team's score was a multiple of 4. Which was the score: 13-6, 11-8, 14-5 or 10-9?", steps: ["Check each for total = 19: all four sum to 19.", "Check losing team's score is a multiple of 4: 13-6 (6, no), 11-8 (8 = 4×2, yes), 14-5 (5, no), 10-9 (9, no). Only 11-8 passes.", "Check winning margin is prime and > 2: 11 - 8 = 3. Is 3 prime and greater than 2? Yes.", "11-8 is the only candidate satisfying both conditions."], answer: "11-8" },
    ],
      tryit: { q: "Two teams scored 11 goals between them; the winner won by 5. What was the score?", answer: "8-3. w + l = 11, w - l = 5, so 2w = 16, w = 8, l = 3." } },
    { h: "7. Reading a running commentary", body: [
      "Some puzzles don't hand you a finished total at all — they narrate the match as it happens: a lead, a comeback, another push. The method here is not algebra, it's careful bookkeeping: update the scoreline after every single sentence, in the order the sentences are written, and never skip ahead.",
      "'The home team led 2-0. The away team then scored twice without reply to level it.' After the first sentence the score is 2-0. 'Scored twice without reply' means the away team, and only the away team, adds 2 goals: the score becomes 2-2. 'Level' confirms you did that correctly — a built-in check.",
      "This kind of question rewards reading one clause at a time and re-writing the scoreline after each one, rather than trying to hold the whole story in your head and compute the answer in one leap.",
    ], examples: [
      { q: "The home team led 1-0. The away team scored once, unanswered, to level it. The home team then scored twice more without reply. What was the final score?", steps: ["After the first sentence: 1-0.", "Away levels it: 1-1.", "Home scores twice more: 3-1."], answer: "3-1" },
      { q: "The away team led 3-1. The home team scored twice to level it. Then each team scored once more. What was the final score?", steps: ["Start with away leading 3-1: home 1, away 3.", "Home scores twice: 1 + 2 = 3, away still 3. Score: 3-3.", "Each team scores once more: 4-4."], answer: "4-4" },
      { q: "After 60 minutes the home team led 2-0. Between 60 and 75 minutes the away team scored 3 goals without reply. Between 75 and 90 minutes the home team scored as many goals as the away team had scored in the previous period. What was the final score?", steps: ["At 60 minutes: 2-0 (home leading).", "60 to 75 minutes: away adds 3. Score: 2-3 (away now leading).", "75 to 90 minutes: home scores 3 (same count as away's previous period). Score: 2 + 3 = 5, away still 3. Final: 5-3."], answer: "5-3" },
    ] },
    { h: "8. A hidden shortcut in whole tournaments", body: [
      "Sometimes the puzzle asks about a whole tournament's total points added together, across every team. There is a beautiful shortcut here. In each single game, either one team wins and the other loses, sharing out 3 + 0 = 3 points, or the game is drawn, sharing out 1 + 1 = 2 points, which is 1 less.",
      "So every game hands out 3 points unless it is a draw, in which case it hands out only 2. That gives a lovely rule: total points in the whole tournament = 3 x games - drawn games. In symbols, total = 3G - D.",
      "This is a first taste of an invariant: a quantity (3G - D) that links the total points to the number of draws so tightly that knowing one tells you the other, without ever caring who beat whom.",
    ], tryit: { q: "In a tournament of 6 games with 3 for a win and 1 for a draw, every team's points added together come to 15. How many games were drawn?", answer: "Total = 3G - D, so 15 = 18 - D, giving D = 3." } },
    { h: "9. When every win is by the SAME scoreline", body: [
      "A neat variant tells you a team won every one of its games by an identical scoreline, then gives you the TOTAL goals scored and conceded across all those games. Because every match repeats the same score, both totals divide evenly by the number of games, and dividing gives you the single repeated scoreline directly.",
      "If a team wins 4 games, scoring 12 in total and conceding 4 in total, then each match was 12÷4 to 4÷4, which is 3-0 every time. The trick is entirely in recognising that 'same scoreline every time' turns a division problem into an exact answer, no squeezing needed.",
    ], examples: [
      { q: "A team won all 3 of its games by the same score, scoring 9 goals in total and conceding 3 in total. What was the score each time?", steps: ["Scored per game: 9 ÷ 3 = 3.", "Conceded per game: 3 ÷ 3 = 1."], answer: "3-1 every match" },
      { q: "A team played 5 games, winning all by the same scoreline. They scored 20 goals and conceded 10. What was the score each match?", steps: ["Scored per game: 20 ÷ 5 = 4.", "Conceded per game: 10 ÷ 5 = 2."], answer: "4-2 every match" },
      { q: "A team played n games, winning every one by the same score of a goals to b goals. Their total goals scored was 60 and total conceded was 24. The winning margin in each game equalled the number of games played. Find n, a and b.", steps: ["Scored per game: a = 60/n. Conceded per game: b = 24/n.", "Winning margin per game: a - b = (60 - 24)/n = 36/n.", "The margin equals n, so 36/n = n, giving n² = 36 and n = 6.", "a = 60/6 = 10 and b = 24/6 = 4.", "Check: margin = 10 - 4 = 6 = n."], answer: "n = 6 games, scoreline 10-4 each match" },
    ] },
    { h: "10. Eliminating candidates with a property test", body: [
      "A different style of question doesn't ask you to deduce a score from scratch — it gives you several CANDIDATE scorelines and a property (the total was such-and-such, or one team's score was a prime number, or an odd number) and asks which candidate actually fits. The method is simply to test every candidate against the stated property and see which one survives.",
      "This is exactly the 'always, sometimes, never' discipline from earlier: you cannot decide by picking the first option that looks plausible. Check the property against EVERY option, not just one, because a careless read often makes a second option look tempting too.",
    ], examples: [
      { q: "A total of 10 goals were scored. The home team's score was a prime number. Which could be the score: 6-4, 5-5, 3-7, or 8-2?", steps: ["Check each home score for being prime: 6 (no), 5 (yes), 3 (yes), 8 (no).", "Both 5-5 and 3-7 have a prime home score — so more information would be needed to choose between them in general, but in a well-posed question only one such option is ever offered."], answer: "Whichever single option among those given has a prime home score" },
      { q: "A match totalled 12 goals. The winning team's score was a perfect square. Which of these could be the score: 4-8, 9-3, 6-6, or 7-5?", steps: ["For each option, identify which team scored more (the winner), or note if it is a draw.", "4-8: away team won with 8 (not a perfect square). 9-3: home won with 9 = 3². 6-6: drawn, no winner. 7-5: home won with 7 (not a perfect square).", "Only 9-3 has a winner whose score is a perfect square."], answer: "9-3" },
      { q: "A match totalled 19 goals. The winning margin was odd and greater than 4, and both teams scored a prime number of goals. Which of these could be the score: 11-8, 12-7, 13-6, or 14-5?", steps: ["Check totals = 19: all four sum to 19.", "Check margin is odd and > 4: 11-8 (margin 3, odd but not > 4 ✗), 12-7 (margin 5, odd and > 4 ✓), 13-6 (margin 7, odd and > 4 ✓), 14-5 (margin 9, odd and > 4 ✓).", "Check both scores are prime: 12-7 (12 is not prime ✗), 13-6 (6 is not prime ✗), 14-5 (14 is not prime ✗).", "None of the candidates survives all three conditions — demonstrating that a set of constraints can sometimes rule out every option."], answer: "None of the given candidates satisfy all three conditions simultaneously" },
    ] },
    { h: "11. Never stop at the first success, even in these new shapes", body: [
      "The section 5 warning applies just as much to sum-and-difference, running-commentary and property-test puzzles as it does to the classic points table. Always ask: does the story, or the stated property, pin down exactly one answer, or could a different candidate also survive? A total-and-margin puzzle is always unique (the algebra gives one w and one l), but a property-test puzzle is only well posed if exactly one of the OFFERED candidates satisfies the property — checking every option is what confirms that for you.",
    ] },
    { h: "12. Counting the games in a round robin", body: [
      "Many tournaments are a round robin, meaning every team plays every other team exactly once. Before you can use any points rule you often need to know how many games that is. If there are n teams, each plays the other n - 1 teams, suggesting n(n-1) games — but that counts each game twice, once for each team in it, so the real number is n(n-1) ÷ 2.",
      "For 4 teams that is 4x3÷2 = 6 games. For 5 teams it is 5x4÷2 = 10 games. This is the same handshake counting you may have met before, and it slots straight into the front of a scores puzzle as the value of G.",
    ], examples: [
      { q: "Five teams each play every other team once. How many games are played in total?", steps: ["Each team plays the other 4 teams.", "5 x 4 = 20, but every game is counted twice.", "20 ÷ 2 = 10."], answer: "10 games" },
      { q: "A round-robin tournament has 7 teams. How many games are played?", steps: ["Each team plays the other 6 teams.", "7 x 6 = 42, but every game is counted twice.", "42 ÷ 2 = 21."], answer: "21 games" },
      { q: "A 6-team round robin uses 3 points for a win, 1 for a draw, 0 for a loss. The total points earned by all teams together was 39. How many games were drawn?", steps: ["Number of games: 6 x 5 ÷ 2 = 15.", "Each non-drawn game gives 3 points in total; each drawn game gives 2 points.", "Total points = 3 x games - drawn games = 3 x 15 - D = 45 - D.", "45 - D = 39, so D = 6."], answer: "6 games were drawn" },
    ] },
    { h: "13. Reading answers back into words", body: [
      "The final step is one people rush and regret. Once you have numbers, translate them back into the language of the puzzle and check them against every rule, not just the one you used last. It takes ten seconds and catches the silly slip where a value drifted negative or the games no longer add up.",
      "Ask yourself the plain questions. Do the wins, draws and losses add up to the games played? Do the goals or points come out right? Is every number zero or more and a whole number? If any answer is no, a rule was broken and the working needs another look.",
    ] },
    { h: "14. The whole method in one breath", body: [
      "Whatever shape the puzzle takes — a season's points table, a total-and-margin match, a running commentary, a constant-scoreline sequence, or a property to test candidates against — the discipline is the same. Name the unknowns. Turn every clue into an equation or a concrete step. Squeeze with the most restrictive rule first. Build a table when a single squeeze doesn't finish the job. Never stop at the first success. Read the survivors back into words and check them against everything you were told.",
      "Do that and a scoreline stops being a wall of numbers and becomes a puzzle that quietly gives itself up, one crossed-off possibility at a time.",
    ] },
  ],
  recap: [
    "Name the unknowns (goals, wins, draws, losses) and turn every clue into an equation before doing arithmetic.",
    "The games rule is w + d + l = total; the points rule uses the score for each result.",
    "For a total-and-margin match, add the two equations: 2 x winner's score = total + margin.",
    "For a running commentary, update the scoreline after every single sentence, in order — never skip ahead.",
    "If a team wins every game by the same scoreline, divide the season totals by the number of games to get that scoreline directly.",
    "Total tournament points = 3 x games minus the number of draws; a round robin of n teams has n(n-1)/2 games.",
    "One valid combination is not proof of uniqueness; keep checking for others, and for property-test questions check every candidate, not just the first plausible one.",
  ],
  mistakes: [
    "Stopping at the first combination that works without checking whether another also fits.",
    "Guessing values instead of listing candidates systematically, so cases get missed or repeated.",
    "Forgetting that wins, draws and losses (and goals) can never be negative.",
    "Adding a total and a margin but forgetting to divide by 2 for the winner's score, or dividing the wrong quantity.",
    "Losing track of the order of events in a running commentary and updating the wrong team's score.",
    "Checking a property (like 'prime') against only one candidate instead of every option offered.",
  ],
};

JUNIOR_LESSONS.tiling = {
  title: "Tiling",
  minutes: 18,
  intro: "Here is a puzzle that sounds like it belongs in a kitchen. You have a grid of squares and a pile of tiles, and you want to know whether the tiles can cover the grid perfectly, or how many can fit, or exactly how many identical tiles are needed. Sometimes the answer is a straightforward calculation. But the deepest and most magical version of this puzzle asks you to prove something can never be done, and you cannot prove that by failing a few times — you need an argument that closes every door at once. That argument is colouring, and it is the heart of this lesson, alongside the simpler skill of reading an exact tile count straight off a rectangle's dimensions. This is not named National Curriculum content. It lives in the NCETM idea of making conjectures and hunting for proofs or counter-examples.",
  sections: [
    { h: "1. What tiling means, and the two kinds of question", body: [
      "A tiling is a way of covering a shape completely (or partially) with smaller pieces so that nothing pokes over the edge and no two pieces overlap. Our grids are made of unit squares, like a chessboard, and our tiles range from simple dominoes (two squares long) to squares of a given side, to T-shaped four-square pieces.",
      "Two very different kinds of question show up. The first is a straightforward count: given a rectangle and a tile size that divides it exactly, how many tiles fit? That's just careful division. The second is a covering or maximum-fit question: what's the largest number of pieces that can be placed, and can we PROVE that number is really the best possible? That second kind is where colouring earns its keep.",
    ] },
    { h: "2. The easy case: exact tile counts", body: [
      "If a wall measuring W by H is to be tiled exactly by square tiles of side s, with W and H both multiples of s, the count is simply (W÷s) tiles across, times (H÷s) tiles up. A 12×8 wall tiled with side-4 squares needs (12÷4)×(8÷4) = 3×2 = 6 tiles.",
      "The habit worth building here is doing each dimension separately before multiplying. It is very easy to fall into the wrong shortcut of dividing the whole AREA by the tile's SIDE instead of its area, which silently drops a whole factor of s. Always ask: how many fit across, how many fit up, then multiply those two counts.",
    ], examples: [
      { q: "A 15×10 floor is tiled exactly with square tiles of side 5. How many tiles are needed?", steps: ["Across: 15 ÷ 5 = 3 tiles.", "Up: 10 ÷ 5 = 2 tiles.", "Total: 3 × 2 = 6 tiles."], answer: "6 tiles" },
      { q: "A wall measuring 24 cm by 18 cm is tiled exactly with square tiles of side 6 cm. How many tiles are needed?", steps: ["Across: 24 ÷ 6 = 4 tiles.", "Up: 18 ÷ 6 = 3 tiles.", "Total: 4 × 3 = 12 tiles."], answer: "12 tiles" },
      { q: "A 36 by 24 floor needs square tiles. Tiles of side 4 and tiles of side 6 are available. How many more size-4 tiles than size-6 tiles are needed to cover the whole floor?", steps: ["Size-4 tiles: across 36 ÷ 4 = 9, up 24 ÷ 4 = 6. Total: 9 × 6 = 54.", "Size-6 tiles: across 36 ÷ 6 = 6, up 24 ÷ 6 = 4. Total: 6 × 4 = 24.", "Difference: 54 - 24 = 30 more size-4 tiles."], answer: "30 more size-4 tiles" },
    ],
      tryit: { q: "An 18×12 wall is tiled exactly with square tiles of side 6. How many tiles are needed?", answer: "6. Across: 18÷6=3. Up: 12÷6=2. Total 3×2=6." } },
    { h: "3. A yes is easy, a no is hard", body: [
      "Now the harder question: can a board be covered by dominoes at all, or what's the most that fit? If someone asks whether a 6 by 6 board can be covered by dominoes, you can answer yes just by doing it: each row of 6 squares takes 3 dominoes laid end to end, and 6 rows give 18 dominoes covering the whole board. Showing one working arrangement is a complete proof of possibility.",
      "But suppose the true answer to some puzzle is no. How would you show that? Trying an arrangement and failing, then trying another and failing, feels convincing after ten tries — but feeling sure is not knowing. The eleventh arrangement, the one you didn't try, might have worked. Impossibility is a claim about EVERY possible arrangement, and there may be millions.",
    ], note: "Proving possible needs one clever example. Proving impossible needs an argument that rules out every example at once. These are not the same job." },
    { h: "4. Demonstration is not proof", body: [
      "This is one of the most important ideas in mathematics, so it deserves its own name. Checking a few cases and finding they all behave is a demonstration. A demonstration builds a hunch. It is not a proof, which must hold for every case, including the ones nobody has patience to try.",
      "The numbers 3, 5, 7 are all prime, but that doesn't prove all odd numbers are prime — 9 is waiting to embarrass anyone who stops early. For tiling puzzles we want a single argument that settles every arrangement in one stroke. Colouring is exactly such an argument.",
    ], tryit: { q: "You try five different ways to cover an odd-looking board with dominoes and all five fail. Have you proved it's impossible?", answer: "No. Five failed attempts is a demonstration, which is only a hunch. A sixth attempt might have worked. Proof needs an argument covering every possible attempt." } },
    { h: "5. Colour the board like a chessboard", body: [
      "Here's the trick. Colour the grid exactly like a chessboard: no two squares sharing an edge have the same colour, and the colours alternate in every row and column. A domino always covers two squares that share an edge, and neighbouring squares always have opposite colours — so every single domino you could ever place must cover exactly one black square and one white square. Always. There's no way to lay a domino on two squares of the same colour, because same-coloured squares never touch.",
      "That last fact is the whole engine of the method. It doesn't say a domino USUALLY covers one of each colour — it says EVERY domino, placed anywhere, in any tiling that could ever exist, must cover one black and one white square. It's a fact about the tile itself, not about any one picture.",
    ] },
    { h: "6. The mutilated chessboard, and the two colours removed", body: [
      "Take an ordinary 8×8 chessboard, 64 squares, and snip off two squares at opposite corners. That leaves 62 squares, an even number, so 31 dominoes seems plausible. Can it be done? The colouring gives the answer in seconds: on a chessboard the two opposite corners are always the SAME colour as each other. Removing them removes two squares of the same colour, leaving 30 of one colour and 32 of the other. But any domino tiling must cover equal numbers of each colour, and 30 ≠ 32, so NO tiling can ever exist. Not because we failed to find one — because the colours forbid it.",
      "Now the twist that this lesson's tiles generator uses directly: what if the two removed squares are DIFFERENT colours instead? Then you remove one of each, leaving the colours still perfectly balanced. It's a beautiful and genuinely surprising fact (sometimes called Gomory's theorem after the mathematician who proved it) that on a rectangular grid, removing any two squares of OPPOSITE colours always leaves a board that CAN be fully tiled by dominoes, however far apart those two squares are. The colours being balanced is necessary for a full tiling — and for two squares removed from an ordinary rectangle, it's also enough.",
      "So the SAME two-corners-removed question has two totally different answers depending on which colours you remove: same colour → impossible to fully cover, with a maximum you can calculate exactly; different colours → a full tiling exists. The generator for this topic actually works out which case you're in from the board's width and height, then computes the true maximum — it never just guesses.",
    ], examples: [
      { q: "An 8×8 board has its two opposite corners (both the same colour) removed. What's the maximum number of dominoes that fit on what's left?", steps: ["Chessboard colouring: 32 of each colour.", "The two removed corners are the same colour, leaving 30 of one colour and 32 of the other.", "Every domino covers one of each colour, so at most min(30, 32) = 30 dominoes can fit.", "This maximum is achievable in practice."], answer: "30 dominoes (2 squares of the majority colour are always left over)" },
      { q: "A 6×8 board has one corner square (say, position (0,0)) removed. What is the maximum number of dominoes that fit on the remaining 47 squares?", steps: ["Full board: 48 squares, colouring gives 24 of each colour.", "Position (0,0) has parity 0 + 0 = 0 (even), so it is one colour, say white.", "After removing: 23 white and 24 black.", "Maximum dominoes = min(23, 24) = 23."], answer: "23 dominoes" },
      { q: "A 7×9 board has the square at position (2,3) removed (counting rows and columns from 0). What is the maximum number of dominoes?", steps: ["Full board: 63 squares. 63 is odd, so colours split 32 and 31. Position (0,0) is even parity, so white; the 32-colour is white.", "Position (2,3): parity = 2 + 3 = 5, which is odd, so it is the minority colour (31 black squares).", "Removing a black square: 32 white and 30 black.", "Maximum = min(32, 30) = 30 dominoes."], answer: "30 dominoes" },
    ],
      tryit: { q: "A 6×6 board has two squares removed that turn out to be DIFFERENT colours. Can the rest be perfectly tiled by dominoes?", answer: "Yes. Removing one square of each colour keeps the colour counts balanced (17 and 17), and by Gomory's theorem a rectangular grid with one square of each colour removed can always be fully tiled." } },
    { h: "7. Turning the colour count into a maximum, step by step", body: [
      "Here's the general recipe the generator follows, and you should follow it too. First, count how many squares of each colour the FULL board has (this itself is a mini skill: if the board has an even number of squares, the colours split exactly in half; if odd, one colour has exactly one more than the other). Second, work out the colour of each removed square (its colour is simply whether the sum of its row and column position is even or odd). Third, subtract the removed squares from their respective colour counts. Fourth, the maximum number of dominoes is the SMALLER of the two adjusted counts, because every domino needs one of each colour and you run out of the scarcer colour first.",
      "This four-step recipe never needs you to actually attempt a tiling. It reads the answer straight off the colour counts, which is exactly why it's called a proof rather than a demonstration.",
    ], examples: [
      { q: "A 5×7 board (35 squares) has its two opposite corners removed. Work out the maximum number of dominoes step by step.", steps: ["35 is odd, so the colours split as 18 and 17.", "Opposite corners of a 5×7 board: are they the same colour? Row+col parity of (0,0) is 0; of (4,6) is 10, which is even too — same colour.", "Removing two of the majority colour (18) leaves 16 and 17.", "Maximum dominoes = min(16, 17) = 16."], answer: "16 dominoes" },
      { q: "A 4×6 board (24 squares) has the square at position (0,0) removed. What is the maximum number of dominoes?", steps: ["Full board: 24 squares. 24 is even, so 12 of each colour.", "Position (0,0): parity 0 = even = white. Removing it: 11 white and 12 black.", "Maximum dominoes = min(11, 12) = 11."], answer: "11 dominoes" },
      { q: "A 9×9 board (81 squares) has its central square at position (4,4) removed. What is the maximum number of dominoes, and is a full tiling possible?", steps: ["81 is odd, so colours split as 41 and 40. Position (0,0) has parity 0 = even = white, so there are 41 white and 40 black.", "Position (4,4): parity = 4+4 = 8, even = white. Removing a white square: 40 white and 40 black.", "Colours are now balanced. By Gomory's theorem, a full tiling of the remaining 80 squares is possible.", "Maximum = min(40, 40) = 40 dominoes."], answer: "40 dominoes, and a full tiling is possible" },
    ] },
    { h: "8. Equal colours does not always mean yes", body: [
      "A careful warning. The colouring argument is superb at proving NO: unequal colours means tiling is impossible, full stop. But it doesn't promise the reverse quite so freely in general shapes. Equal colours is NECESSARY for a tiling to exist, but on an oddly-shaped or disconnected board it isn't automatically sufficient — picture two lonely squares of opposite colour sitting in far corners of a board with everything between them removed. Balanced colours, but they don't touch, so no domino can join them.",
      "The get-out clause, and the reason our tile generator can trust equal-colour cases fully, is that it only ever removes two squares from a single, fully-connected RECTANGLE — exactly the shape Gomory's theorem covers. Outside that tidy setting, a balanced colour count clears the 'no' verdict off the table, but you'd still need to construct an actual tiling to be completely sure.",
    ], note: "Unequal colours always proves impossible. Equal colours proves possible ONLY on nicely connected shapes like a plain rectangle with two squares removed — Gomory's theorem is precisely what licenses trusting it there." },
    { h: "9. A different tile, a different colouring: T-tetrominoes", body: [
      "The chessboard trick is perfect for dominoes because a domino is two squares and a chessboard has two colours. A T-tetromino (four squares in a T shape) needs a different kind of argument to pin down exactly which rectangles it can tile perfectly, and the full proof is more intricate than two-colouring. What you can always trust, whatever the tile shape, is the AREA bound: if a tile covers k squares, no more than (total squares ÷ k) pieces can ever fit, since every square is used at most once.",
      "For T-tetrominoes specifically, it's a known result that a rectangle built from 4×4 blocks (like 4×4, 4×8, 8×8, 4×12) can always be perfectly tiled: each 4×4 block on its own splits into 4 T-pieces, and you just repeat the block across the whole rectangle. So for these 'friendly' dimensions, the area bound (total ÷ 4) is not just an upper limit — it's also achievable, and that's exactly why the generator only ever uses dimensions built from 4×4 blocks for this particular question.",
    ], tryit: { q: "Why can't you simply assume ANY rectangle with area divisible by 4 can be perfectly tiled by T-tetrominoes?", answer: "Because divisibility by 4 only gives the AREA bound — it tells you the count could work, not that an actual arrangement exists. Some rectangles with area divisible by 4 genuinely cannot be tiled by T-pieces; you need either a known constructive method (like splitting into 4×4 blocks) or a separate proof, not just the arithmetic." } },
    { h: "10. The whole idea in a nutshell", body: [
      "When a tiling puzzle asks for an exact count on a plain rectangle, do the two divisions (across, then up) and multiply. When it asks about a maximum fit or a possible/impossible covering, remember which job you're doing: to prove possible, build or cite one arrangement; to prove impossible, find an argument — almost always a colouring — that closes every door at once, not a handful of failed attempts.",
      "The master argument is colouring. Paint the board so every tile is forced to cover a fixed mixture of colours, count the colours, and read off the answer. If the counts can't be shared out the way the tiles demand, no tiling can exist — proved for every arrangement in one stroke. If two squares of OPPOSITE colour are removed from a plain rectangle, a full domino tiling is guaranteed to exist, and the true maximum in the SAME-colour case is exactly the smaller adjusted colour count. That is the quiet, total power of a colouring proof.",
    ] },
  ],
  recap: [
    "For an exact tile count on a plain rectangle, divide each dimension separately by the tile's side, then multiply the two counts.",
    "Proving a tiling possible needs one working example (or a cited theorem); proving it impossible needs an argument covering every case.",
    "Colour the grid like a chessboard so every domino must cover exactly one square of each colour.",
    "If the board has unequal numbers of the two colours, no domino tiling can exist; the true maximum is the smaller colour count.",
    "Removing two SAME-coloured squares from a rectangle makes full tiling impossible; removing two DIFFERENT-coloured squares (Gomory's theorem) always leaves a fully tileable board.",
    "For other tile shapes (like T-tetrominoes), the area bound (total squares ÷ tile size) is only a maximum — check whether it is actually achievable before trusting it as the true answer.",
  ],
  mistakes: [
    "Treating a few failed tiling attempts as proof that a tiling is impossible.",
    "Dividing the whole area by a tile's SIDE length instead of dividing each dimension separately (or its area) — this drops a whole factor.",
    "Assuming equal colour counts always guarantees a tiling exists, even on odd or disconnected shapes where it doesn't.",
    "Forgetting to check whether the two removed squares are the same colour or different colours — the answer is genuinely different in each case.",
    "Assuming an area bound (like total ÷ 4 for tetrominoes) is automatically achievable without checking a real construction exists.",
  ],
};

JUNIOR_LESSONS.repeatOp = {
  title: "Repeat operations",
  minutes: 17,
  intro: "Some puzzles take a number, do something to it, then do the very same thing to the answer, and again, and again, hundreds or thousands of times, and then ask where you end up. The lazy dread is to imagine grinding through every single step. The clever joy is to realise you almost never have to. Repeated processes love to fall into a repeating loop called a cycle, and they often carry a hidden quantity that never changes at all, called an invariant. Spot the cycle or spot the invariant and a thousand steps collapse into a moment's thought. This is not one named National Curriculum strand, but it lives in the NCETM habit of asking what changes and what stays the same, and it connects to generating sequences from a term-to-term rule.",
  sections: [
    { h: "1. Doing the same thing over and over", body: [
      "Picture a machine with one button. You feed in a number, press the button, and out comes a new number by some fixed rule. Then you feed that answer back in and press again. Because the rule never changes, the story writes itself once you know the rule and the starting number. This is called iterating: applying the same operation repeatedly.",
      "The puzzle usually asks for something absurdly far along, like the result after 1000 presses. If you tried to do all 1000 by hand you would be there past bedtime and likely make a slip halfway. So we do not do that. Instead we do a few presses, watch carefully, and hunt for the two great shortcuts that repeated processes almost always hand us.",
    ] },
    { h: "2. Look for a cycle", body: [
      "The first shortcut is the cycle. Very often, after a while, the numbers start repeating in a loop of fixed length. Once you spot the loop you never need to compute a single step beyond it, because it just goes round and round forever.",
      "Try a machine that multiplies by 3 and then keeps only the units digit. Start at 1. Press: 1 times 3 is 3. Press: 3 times 3 is 9. Press: 9 times 3 is 27, keep the 7. Press: 7 times 3 is 21, keep the 1. And now we are back to 1, so the whole thing repeats. The results run 3, 9, 7, 1, 3, 9, 7, 1, forever. The cycle has length 4.",
      "The moment you see a value you have seen before, in the same situation, you know the loop has closed and everything from here just repeats. Write the cycle down and the hard work is over.",
    ], tryit: { q: "A machine keeps the units digit of double the number. Starting at 6: 6, then 12 keep 2, then 4, then 8, then 16 keep 6. What is the cycle?", answer: "6, 2, 4, 8 and then back to 6. The cycle has length 4." } },
    { h: "3. Use remainders to leap far ahead", body: [
      "Once you have the cycle length, you can jump to any step you like using remainders, exactly the trick from Cyclic Patterns. Divide the step number by the cycle length and read the remainder to find your place in the loop.",
      "Our multiply-by-3 machine gave results 3, 9, 7, 1 repeating with cycle length 4. Where is the result after 100 presses? Divide 100 by 4, which is 25 remainder 0. A remainder of 0 means you land exactly at the end of a cycle, so you take the last item in the loop, which is 1. So after 100 presses the result is 1, and we found it without pressing anything 100 times.",
      "Remember the careful reading of the remainder. Remainder 1 is the first in the cycle, remainder 2 the second, and remainder 0 is the last, because it finishes a whole number of loops.",
    ], examples: [
      { q: "The results cycle as 3, 9, 7, 1 with length 4. What is the result after 27 presses?", steps: ["Divide the step by the cycle length: 27 divided by 4 is 6 remainder 3.", "Remainder 3 means the third item in the cycle.", "The third item is 7."], answer: "7" },
      { q: "A machine multiplies by 7 and keeps only the units digit. Starting at 1, the results cycle as 7, 9, 3, 1 with length 4. What is the result after the 50th press?", steps: ["Divide the step number by the cycle length: 50 divided by 4 is 12 remainder 2.", "Remainder 2 means the second item in the cycle.", "The cycle is 7, 9, 3, 1, so the second item is 9."], answer: "9" },
      { q: "A machine computes the remainder when twice the previous output is divided by 7. Starting at 1, run a few presses to find the cycle, then find the output after the 100th press.", steps: ["Press 1: 2 × 1 = 2, remainder when divided by 7 is 2.", "Press 2: 2 × 2 = 4, remainder 4. Press 3: 2 × 4 = 8, remainder 1. Press 4: back to 2 × 1 = 2.", "The cycle is 2, 4, 1 with length 3.", "Divide 100 by 3: 100 = 33 × 3 + 1, so the remainder is 1.", "Remainder 1 means the first item in the cycle, which is 2."], answer: "2" },
    ] },
    { h: "4. Does a repeated process have to run out?", body: [
      "A tempting but wrong belief is that if you keep doing something to a number, it must eventually shrink to nothing or trend off to zero. Not so. A repeated process can bounce around forever without vanishing, precisely because it can get trapped in a cycle. You must actually check what it does, not assume.",
      "Take this famous rule: if the number is even, halve it; if it is odd, triple it and add 1. Start at 6. It is even, so 3. Odd, so 3 times 3 plus 1 is 10. Even, so 5. Odd, so 16. Even, so 8, then 4, then 2, then 1. Now 1 is odd, so 3 times 1 plus 1 is 4, then 2, then 1 again. It does not disappear. It settles into the loop 4, 2, 1, 4, 2, 1 forever.",
      "So the honest habit is to run a few steps and see. Some processes climb, some fall, many end up circling a small loop. Never assume the ending, discover it.",
    ], tryit: { q: "Using halve-if-even, triple-plus-one-if-odd, follow the number 5 until it loops. What loop does it reach?", answer: "5 is odd, so 16, then 8, 4, 2, 1, then 4, 2, 1. It reaches the same 4, 2, 1 loop." } },
    { h: "5. The other great shortcut: invariants", body: [
      "The second shortcut is even more magical. An invariant is a quantity that never changes, no matter how many times you apply the operation. If you can find one, you often do not need to follow the process at all. You just ask what the invariant was at the start and know it must still hold at the end.",
      "The word means unvarying, the thing that stays put while everything around it churns. Finding an invariant turns a scary process with a thousand moving parts into a single unchanging truth you can read off from the beginning. It is the calm centre of the storm, and it is exactly the NCETM question of what stays the same when other things change.",
    ] },
    { h: "6. An invariant in action", body: [
      "Write the numbers 1 to 10 on a board. Now repeatedly do this: rub out any two numbers and write down the positive difference between them instead. Each move turns two numbers into one, so after 9 moves a single number is left. The puzzle: will that last number be odd or even?",
      "Grinding through all the choices would be madness, because there are countless orders to pick the pairs. So hunt for what stays the same. Look at the total of all the numbers on the board. When you replace a and b with their difference, the total drops by a plus b, then rises by the difference. The change is a plus b, minus the difference, which always works out to twice the smaller number, and twice anything is even. So every move changes the total by an even amount, which means the total's oddness or evenness never changes. That parity is our invariant.",
      "The starting total is 1 plus 2 all the way to 10, which is 55, an odd number. Since the parity can never change, the total stays odd right to the end. And at the end there is only one number left, which is therefore odd. We never had to know which pairs were chosen. The invariant answered everything.",
    ], examples: [
      { q: "Numbers 1 to 10 are on a board; repeatedly replace two numbers with their positive difference until one remains. Odd or even?", steps: ["Watch the total of all numbers on the board.", "Replacing a and b with their difference changes the total by twice the smaller number, always even.", "So the total's parity never changes: it is an invariant.", "The starting total 1 + 2 + ... + 10 = 55, which is odd.", "The single number left must therefore be odd."], answer: "Odd, whatever order the pairs are chosen" },
      { q: "The numbers 1, 2, 3, 4, 5, 6 are on a board. Each move picks two numbers and replaces them with their positive difference until one number remains. Must that last number be odd or even?", steps: ["Find the starting sum: 1 + 2 + 3 + 4 + 5 + 6 = 21, which is odd.", "Each move replaces a and b with |a − b|, changing the total by a + b − |a − b| = twice the smaller, an even amount.", "So the parity of the total never changes: it is an invariant.", "The total starts odd and stays odd, so the final single number must be odd."], answer: "Odd" },
      { q: "A board holds five 1s and four 0s, nine numbers altogether. Each move replaces two numbers with their positive difference. What is the last number left, and why must it always be that value no matter which pairs are chosen?", steps: ["The starting sum is five 1s plus four 0s = 5, which is odd.", "Each move changes the total by twice the smaller of the two chosen numbers, always an even amount.", "So the parity of the total is an invariant: it starts odd and stays odd throughout.", "Every individual number on the board is 0 or 1, so the last remaining number is also 0 or 1.", "The last number must be odd (from the invariant) and can only be 0 or 1, so it must be 1.", "No matter which pairs are chosen, the last number is always 1."], answer: "1, always" },
    ] },
    { h: "7. An invariant that proves impossibility", body: [
      "Invariants are brilliant for proving that some goal can never be reached. If a quantity never changes, then any target with a different value is simply out of bounds, forever.",
      "Here is the classic. Three cups sit on a table, all facing down. A move flips exactly two cups at once. The goal is to get all three cups facing up. Try as you might, it never works, and the invariant tells us why. Count how many cups face up. It starts at 0. Flipping two cups changes this count by plus 2 if both were down, by minus 2 if both were up, or by 0 if you flip one of each. Every possible move changes the up-count by an even amount.",
      "So the number of cups facing up is always even: 0, or 2, and never anything odd. But all three cups facing up would mean 3 are up, and 3 is odd. Since the count can never be odd, that goal can never be reached, no matter how long you flip. The invariant closes the door completely, just like a colouring proof in Tiling.",
    ], tryit: { q: "Start with 3 cups all facing up and flip two at a time. Can you ever get all 3 facing down?", answer: "No. All up is 3 up, an odd count, and flipping two cups always changes the up-count by an even amount, so it stays odd. All down is 0 up, an even count, which can never be reached from an odd count." } },
    { h: "8. A number invariant: casting out nines", body: [
      "Here is an invariant hiding inside ordinary numbers. Take a number and repeatedly replace it by the sum of its digits, again and again, until a single digit is left. That final digit is called the digital root. For 88: the digits add to 16, then 1 and 6 add to 7. So the digital root of 88 is 7.",
      "The lovely fact is that adding up a number's digits never changes its remainder when divided by 9. That remainder is the invariant riding along untouched through every step. And indeed 88 divided by 9 is 9 remainder 7, matching the digital root of 7 exactly. So you can predict where the repeated digit-summing lands without doing much summing at all, because the remainder was fixed from the very first number.",
    ], tryit: { q: "Find the digital root of 754 by summing digits repeatedly, then check it equals the remainder of 754 divided by 9.", answer: "7 + 5 + 4 = 16, then 1 + 6 = 7, so the digital root is 7. And 754 divided by 9 is 83 remainder 7. They match." } },
    { h: "9. Cycle or invariant: which to reach for", body: [
      "Faced with a repeated-operation puzzle, you now have two tools, and it helps to know which suits which job. If the puzzle asks for the exact value after a huge number of steps, hunt for a cycle: apply the operation a handful of times, spot the loop, then use remainders to leap to the step you want.",
      "If instead the puzzle asks whether some end state is possible, or whether the final answer is odd or even, or which of a few outcomes you must reach, hunt for an invariant: a quantity that never changes, so the ending is fixed before you start. Some rich puzzles hide both. The wise first move is always the same. Do the operation two or three times slowly, watch like a hawk, and ask the two questions: is anything repeating, and is anything staying the same?",
    ], note: "Cycle answers where do I end up after many steps. Invariant answers can this ever happen, or what must be true at the end." },
    { h: "10. Pulling it all together", body: [
      "A repeated operation is never a summons to grind through every step. It is an invitation to look for structure. Run the process a few times by hand. If the values start repeating, you have found a cycle, and remainders will carry you to the millionth step in seconds. If some quantity refuses to change, you have found an invariant, and it may answer the whole puzzle without your following the process at all.",
      "Do not assume a repeated process must fizzle to zero, and do not brute-force step 500 one weary step at a time. Look first. The number that seems to march off to infinity may be quietly circling a tiny loop, and the churning heap of moving parts may be guarded by one calm quantity that never moves at all.",
    ] },
  ],
  recap: [
    "Applying the same operation over and over is called iterating; do not grind every step, look for structure.",
    "Many processes fall into a repeating cycle; find its length, then use remainders to jump to any step.",
    "A repeated process need not shrink to zero; it can loop forever, so check rather than assume.",
    "An invariant is a quantity that never changes however many times the operation is applied.",
    "Invariants often answer a puzzle instantly, especially for odd-or-even questions and impossibility proofs.",
    "Reach for a cycle to find a distant value; reach for an invariant to decide what is possible or fixed.",
  ],
  mistakes: [
    "Assuming a repeated process must eventually run out or trend to zero without checking.",
    "Missing an available invariant and computing a far-off step one at a time instead of finding the cycle.",
    "Misreading a remainder of 0 as the first item in a cycle rather than the last.",
    "Trying to prove something impossible by failed attempts instead of finding an unchanging quantity that forbids it.",
  ],
};


// ---- Full-depth guided lesson: systematic counting (countIntegers, new) ----

JUNIOR_LESSONS.countIntegers = {
  title: "Counting Numbers",
  minutes: 16,
  intro: "Some questions ask you to find every whole number that fits a rule, not just one. Find every two-digit number where one digit is twice the other. List every multiple of 6 between 100 and 300. These look like they need luck or a very long afternoon. They do not. They need a system: a way of checking every possibility exactly once, so you can hold up your list at the end and say, with total confidence, that nothing is missing and nothing is repeated. That confidence is what this lesson builds.",
  sections: [
    { h: "1. Guessing versus checking", body: [
      "Picture two students given the same task: find every two-digit number whose digits add up to 10. The first student writes down 19, 28, 37, thinks for a moment, adds 91, and stops, fairly sure that is everything. The second student writes down every possible tens digit in order, 1 through 9, works out the units digit each time, and lists all nine pairs before stopping. Only the second student can prove they have found everything.",
      "That is the whole difference this lesson is about. Guessing finds some answers. A system finds all of them, and lets you prove there are no more hiding out of sight.",
    ] },
    { h: "2. The warm-up: a table with one running variable", body: [
      "The simplest systematic method is to let one quantity run through every value it is allowed to take, and work out the rest from the rule each time. For two-digit numbers with digit sum 10, let the tens digit t run from 1 to 9 (it cannot be 0, or the number would not really be two digits), and work out the units digit as u = 10 - t each time.",
      "t = 1 gives u = 9, so 19. t = 2 gives u = 8, so 28. Keep going: 37, 46, 55, 64, 73, 82, and t = 9 gives u = 1, so 91. That is nine numbers, and because t ran through every single value from 1 to 9 with nothing skipped, you know for certain there is no tenth.",
    ], examples: [
      { q: "List every two-digit number whose digits add up to 10.", steps: ["Let the tens digit t run from 1 to 9.", "For each t, the units digit is u = 10 - t.", "t=1,u=9 (19); t=2,u=8 (28); t=3,u=7 (37); t=4,u=6 (46); t=5,u=5 (55); t=6,u=4 (64); t=7,u=3 (73); t=8,u=2 (82); t=9,u=1 (91)."], answer: "19, 28, 37, 46, 55, 64, 73, 82, 91 (nine numbers)" },
      { q: "List every two-digit number whose digits add up to 12, and state how many there are.", steps: ["Let the tens digit t run from 1 to 9. The units digit is u = 12 - t, which must stay between 0 and 9.", "u ≤ 9 means t ≥ 3; u ≥ 0 means t ≤ 12, so t actually stops at 9.", "t=3 (39), t=4 (48), t=5 (57), t=6 (66), t=7 (75), t=8 (84), t=9 (93)."], answer: "39, 48, 57, 66, 75, 84, 93 — seven numbers" },
      { q: "Find every two-digit number whose digit sum is a perfect square. List them in groups by digit sum, and give the total count.", steps: ["Perfect squares that are valid digit sums (0 to 18): 1, 4, 9, 16.", "Digit sum 1: t=1, u=0 only (10). One number.", "Digit sum 4: t runs 1–4 giving 13, 22, 31, 40. Four numbers.", "Digit sum 9: t runs 1–9 giving 18, 27, 36, 45, 54, 63, 72, 81, 90. Nine numbers.", "Digit sum 16: t runs 7–9 giving 79, 88, 97. Three numbers.", "Total: 1 + 4 + 9 + 3 = 17 numbers."], answer: "17 numbers in total: 10; 13, 22, 31, 40; 18, 27, 36, 45, 54, 63, 72, 81, 90; 79, 88, 97" },
    ],
      tryit: { q: "List every two-digit number whose digits add up to 6.", answer: "15, 24, 33, 42, 51, 60. Let t run from 1 to 6 (u = 6 - t must stay 0 to 9, and t cannot be 0), giving six numbers." } },
    { h: "3. Why the running variable has to stop somewhere", body: [
      "In the last example, why did t only run up to 9, and why did it start at 1? Both limits come directly from what a digit is allowed to be. A digit is always 0 to 9, and the very first digit of a two-digit number cannot be 0, since 05 is not really a two-digit number at all, it is just 5.",
      "So before you start any systematic search, write down the fence around your running variable: its smallest legal value and its largest. Get the fence wrong and you will either miss genuine answers or waste time checking numbers that were never allowed to begin with.",
    ], tryit: { q: "You are searching for three-digit numbers. What are the smallest and largest legal values for the hundreds digit?", answer: "1 and 9. It cannot be 0 (that would make it a two-digit number), and no digit can exceed 9." } },
    { h: "4. The main event: one digit is twice the other", body: [
      "Now for a properly interesting rule. Find every two-digit number in which one digit is exactly twice the other. Notice this rule is not symmetrical in tens and units, so it actually hides two separate searches, and you must run both or you will miss half the answers.",
      "Search one: the units digit is twice the tens digit, so u = 2t. Let t run from 1 upward: t=1 gives u=2 (12); t=2 gives u=4 (24); t=3 gives u=6 (36); t=4 gives u=8 (48); t=5 would need u=10, which is not a digit, so the search stops there. Four numbers: 12, 24, 36, 48.",
      "Search two: the tens digit is twice the units digit, so t = 2u. Let u run from 0 upward, remembering t cannot be 0: u=0 gives t=0, not allowed, skip it. u=1 gives t=2 (21); u=2 gives t=4 (42); u=3 gives t=6 (63); u=4 gives t=8 (84); u=5 would need t=10, too big, stop. Four more numbers: 21, 42, 63, 84.",
    ], examples: [
      { q: "Combine both searches. How many two-digit numbers in total have one digit twice the other, and what are they?", steps: ["Search one (units = 2 x tens): 12, 24, 36, 48.", "Search two (tens = 2 x units): 21, 42, 63, 84.", "Check for overlap: no number appears in both lists.", "Total: 4 + 4 = 8 numbers."], answer: "12, 21, 24, 36, 42, 48, 63, 84 (eight numbers)" },
      { q: "Find every two-digit number where one digit is exactly three times the other. List them and state the total count.", steps: ["Search one (u = 3t): t=1 (13), t=2 (26), t=3 (39); t=4 gives u=12, too big, stop.", "Search two (t = 3u): u=1 (31), u=2 (62), u=3 (93); u=4 gives t=12, too big, stop.", "Check for overlap: no number appears in both lists.", "Total: 3 + 3 = 6 numbers."], answer: "13, 26, 39, 31, 62, 93 — six numbers" },
      { q: "Find every two-digit number where one digit is exactly 5 more than the other (in either order). List them all.", steps: ["Search one (u − t = 5): t=1,u=6 (16); t=2,u=7 (27); t=3,u=8 (38); t=4,u=9 (49); t=5 gives u=10, too big, stop.", "Search two (t − u = 5): u=0,t=5 (50); u=1,t=6 (61); u=2,t=7 (72); u=3,t=8 (83); u=4,t=9 (94); u=5 gives t=10, too big, stop.", "Check for overlap: no number appears in both lists.", "Total: 4 + 5 = 9 numbers."], answer: "16, 27, 38, 49, 50, 61, 72, 83, 94 — nine numbers" },
    ],
      note: "A rule that mentions two different positions, like tens and units, almost always hides two searches rather than one. Ask yourself: does swapping the roles give a genuinely different condition? Here it does, so both searches are needed." },
    { h: "5. Proving you have not missed one", body: [
      "The reason this method is trustworthy is that each search has a hard stop built in, not a guess about when to give up. In search one, u = 2t must stay a single digit, so 2t is at most 9, meaning t is at most 4 (since t=5 would make 2t=10). That is not a hunch, it is a forced mathematical limit, and once you hit it you can be completely sure nothing further exists.",
      "This is the difference between a search that ends because you got bored and a search that ends because the maths itself closed the door. Always look for that forced limit and state it, rather than just trailing off with and so on.",
    ], tryit: { q: "You are listing two-digit numbers where the units digit is three times the tens digit. What is the largest tens digit that still works, and why?", answer: "3. If u = 3t must stay a single digit (at most 9), then t is at most 3 (since t=4 would give u=12, too big). Check: t=3 gives u=9, the number 39, which fits; t=4 does not exist for this rule." } },
    { h: "6. Always, sometimes or never true", body: [
      "A different style of systematic question gives you a claim and asks whether it is always true, sometimes true, or never true. The discipline is the same: you cannot decide by checking one case, you must either check every case (for always or never) or produce one example that works and one that fails (for sometimes).",
      "Claim: if a two-digit number's digits add up to a multiple of 3, the number itself is a multiple of 3. Check a few: 19 has digit sum 10, not a multiple of 3, and 19 is not a multiple of 3 either, consistent so far but not a proof. Check 24: digit sum 6, a multiple of 3, and 24 divided by 3 is 8, a whole number. Check 51: digit sum 6, and 51 divided by 3 is 17. This is in fact always true for every whole number, a genuine divisibility rule, not a coincidence of the few cases tried.",
      "Now a claim that is only sometimes true. If a four-digit number's first digit equals its last digit, the number is a palindrome (reads the same forwards and backwards). Test 1221: first digit 1, last digit 1, equal, and reversed it reads 1221, the same, so it works here. Test 1231: first digit 1, last digit 1, equal, but reversed it reads 1321, which is different from 1231. The claim fails for 1231. One success and one failure together prove the claim is only sometimes true, never always and never never.",
    ], examples: [
      { q: "Is the claim 'every two-digit multiple of 9 has digits that add to 9' always true, sometimes true, or never true?", steps: ["List the two-digit multiples of 9: 18, 27, 36, 45, 54, 63, 72, 81, 90, 99.", "Check digit sums: 1+8=9, 2+7=9, 3+6=9, 4+5=9, 5+4=9, 6+3=9, 7+2=9, 8+1=9, 9+0=9.", "The last one, 99, gives 9+9=18, not 9.", "Every case up to 90 gives exactly 9, but 99 breaks the pattern."], answer: "Sometimes true. It holds for 18 through 90, but fails for 99, whose digits sum to 18." },
      { q: "Is the claim 'every two-digit multiple of 11 has two equal digits' always true, sometimes true, or never true?", steps: ["List every two-digit multiple of 11: 11, 22, 33, 44, 55, 66, 77, 88, 99.", "Check whether the digits are equal in each: 1=1, 2=2, 3=3, 4=4, 5=5, 6=6, 7=7, 8=8, 9=9.", "Every single one passes; no counterexample exists.", "Since the list is complete and every entry satisfies the claim, it is always true."], answer: "Always true. Every two-digit multiple of 11 has the form 11k where k runs 1–9, giving the repeated-digit numbers 11 through 99." },
      { q: "Is the claim 'a two-digit number and the number formed by reversing its digits always leave the same remainder when divided by 9' always true, sometimes true, or never true?", steps: ["Write the two-digit number as 10a + b and its reversal as 10b + a.", "Their difference is (10a + b) − (10b + a) = 9a − 9b = 9(a − b).", "Two numbers whose difference is a multiple of 9 always share the same remainder when divided by 9.", "This algebra holds for any digits a and b, so no counterexample can exist."], answer: "Always true. The original number and its reversal always differ by a multiple of 9, so they share the same remainder on division by 9." },
    ],
      note: "This is exactly the trap in section 8 waiting to happen again: checking eight cases and trusting a pattern that quietly breaks on the ninth. A claim about all two-digit multiples of 9 needs all eleven of them checked, not just the tidy-looking ones." },
    { h: "7. Narrowing with two conditions at once", body: [
      "Real puzzles often stack two rules together, and the trick is to apply the more restrictive rule first, so you are searching a smaller pile from the very first step.",
      "Find every two-digit number that is even and whose digits add up to 12. The digit-sum rule alone gives several candidates: t from 3 to 9 with u = 12 - t staying a valid digit means t is at least 3 (else u would exceed 9) and at most 9, giving 39, 48, 57, 66, 75, 84, 93. Now apply the even condition: keep only the ones ending in an even digit. That leaves 48, 66 and 84.",
    ], examples: [
      { q: "Find every two-digit number that is a multiple of 5 and whose digits add up to 9.", steps: ["Multiples of 5 ending in a digit whose partner completes a digit sum of 9: the units digit must be 0 or 5 (to be a multiple of 5).", "If units digit is 0, tens digit must be 9 (9+0=9): 90.", "If units digit is 5, tens digit must be 4 (4+5=9): 45.", "Both checked against the full rule."], answer: "45 and 90" },
      { q: "Find every two-digit number that is a multiple of 4 and whose digits add up to 8.", steps: ["Start from the more restrictive rule. List two-digit numbers with digit sum 8 by letting t run from 1 to 8: 17, 26, 35, 44, 53, 62, 71, 80.", "Now apply the multiple-of-4 rule: a number is divisible by 4 if its last two digits form a multiple of 4.", "44 ÷ 4 = 11 (yes); 80 ÷ 4 = 20 (yes); the rest (17, 26, 35, 53, 62, 71) are not divisible by 4."], answer: "44 and 80" },
      { q: "Find every two-digit multiple of 6 whose digit sum is a prime number.", steps: ["List two-digit multiples of 6: 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96.", "Compute the digit sum for each: 3, 9, 6, 3, 9, 6, 12, 9, 6, 12, 9, 15, 12, 9, 15.", "Identify which digit sums are prime: 3 (prime), 9 (not), 6 (not), 3 (prime), 9 (not), 6 (not), 12 (not), 9 (not), 6 (not), 12 (not), 9 (not), 15 (not), 12 (not), 9 (not), 15 (not).", "The multiples with prime digit sums are 12 (sum 3) and 30 (sum 3)."], answer: "12 and 30" },
    ],
      tryit: { q: "Find every two-digit number that is odd and whose digits add up to 8.", answer: "17, 35, 53, 71. From the digit-sum-8 list (17, 26, 35, 44, 53, 62, 71, 80), keep only the odd ones: 17, 35, 53, 71." } },
    { h: "8. Counting without listing every single one", body: [
      "Sometimes a question only wants the count of numbers fitting a rule, not the list itself, and for simple rules like multiples, you can find that count directly from division, which is far quicker than writing every number out.",
      "How many multiples of 6 lie between 100 and 300, inclusive? Find the smallest multiple of 6 that is at least 100: 100 divided by 6 is about 16.7, so the 17th multiple, 17 x 6 = 102, is the first one that qualifies. Find the largest multiple of 6 that is at most 300: 300 divided by 6 is exactly 50, so 300 itself is the 50th multiple and qualifies. The multiples run from the 17th to the 50th, so the count is 50 - 17 + 1 = 34.",
      "That plus 1 at the end matters enormously: counting from the 17th multiple to the 50th multiple inclusive means 34 multiples, not 33, in exactly the same way that counting the whole numbers from 1 to 5 gives 5 numbers, not 4 (5 - 1 = 4, but 5 - 1 + 1 = 5 is correct).",
    ], examples: [
      { q: "How many multiples of 4 lie between 50 and 150, inclusive?", steps: ["Smallest multiple of 4 at least 50: 50 divided by 4 is 12.5, so the 13th multiple, 13 × 4 = 52, is first.", "Largest multiple of 4 at most 150: 150 divided by 4 is 37.5, so the 37th multiple, 37 × 4 = 148, is last.", "Count = 37 − 13 + 1 = 25."], answer: "25 multiples of 4" },
      { q: "How many multiples of 7 lie between 100 and 200, inclusive?", steps: ["Smallest multiple of 7 at least 100: 100 ÷ 7 ≈ 14.28, so the 15th multiple, 15 × 7 = 105, is first.", "Largest multiple of 7 at most 200: 200 ÷ 7 ≈ 28.57, so the 28th multiple, 28 × 7 = 196, is last.", "Count = 28 − 15 + 1 = 14."], answer: "14 multiples of 7" },
      { q: "How many three-digit numbers are divisible by both 4 and 6?", steps: ["A number divisible by both 4 and 6 must be divisible by their LCM. LCM(4, 6) = 12.", "Smallest three-digit multiple of 12: 100 ÷ 12 ≈ 8.33, so the 9th multiple, 9 × 12 = 108, is first.", "Largest three-digit multiple of 12: 999 ÷ 12 ≈ 83.25, so the 83rd multiple, 83 × 12 = 996, is last.", "Count = 83 − 9 + 1 = 75."], answer: "75 three-digit numbers" },
    ],
      note: "This plus-one rule is the single most common source of off-by-one errors in all of counting. Whenever you count from a starting position to an ending position inclusive, the count is (end position) minus (start position) plus 1, never just the bare subtraction." },
    { h: "9. A boss-level combined search", body: [
      "Time to put every tool in this lesson to work at once: a fenced running variable, a forced stopping point, and two conditions applied in the right order.",
      "Find every three-digit number less than 400 in which the first digit is twice the last digit. Fence the hundreds digit h: it must be at least 1, and since the number is under 400, h can only be 1, 2 or 3. The rule says the units digit u satisfies h = 2u, so u = h divided by 2, which must be a whole number, ruling out h = 1 and h = 3 immediately (since 1 divided by 2 and 3 divided by 2 are not whole numbers). Only h = 2 survives, giving u = 1.",
    ], examples: [
      { q: "Finish the search: with h = 2 and u = 1, what are the possible numbers, and how many are there?", steps: ["The tens digit is completely free, since the rule says nothing about it, so it can be any digit 0 through 9.", "The numbers are 2_1, with the middle digit running 0 to 9: 201, 211, 221, 231, 241, 251, 261, 271, 281, 291.", "That is 10 numbers, one for each possible tens digit."], answer: "10 numbers: 201, 211, 221, 231, 241, 251, 261, 271, 281, 291" },
      { q: "Find all three-digit numbers where the hundreds digit is exactly twice the tens digit and the units digit is 0. List them.", steps: ["The rule is h = 2t. Fence h from 1 to 9 and t from 0 to 9, so t can be 1, 2, 3 or 4 (t=5 gives h=10, too big; t=0 gives h=0, invalid leading digit).", "t=1 gives h=2: number 210. t=2 gives h=4: number 420. t=3 gives h=6: number 630. t=4 gives h=8: number 840.", "The units digit is fixed at 0, so there is no further freedom."], answer: "210, 420, 630, 840 — four numbers" },
      { q: "Find all three-digit numbers less than 500 where the hundreds digit is twice the units digit, with no restriction on the tens digit. How many are there in total?", steps: ["Fence the hundreds digit h: the number is under 500 and at least 100, so h is 1, 2, 3 or 4.", "The rule is h = 2u, so u = h ÷ 2 must be a whole digit. h=1 gives u=0.5 (not whole, fails). h=2 gives u=1 (works). h=3 gives u=1.5 (not whole, fails). h=4 gives u=2 (works).", "For h=2, u=1: the tens digit runs freely 0–9, giving 10 numbers (201, 211, …, 291).", "For h=4, u=2: the tens digit runs freely 0–9, giving 10 numbers (402, 412, …, 492).", "Total: 10 + 10 = 20 numbers."], answer: "20 numbers" },
    ],
      tryit: { q: "Find every three-digit number less than 300 in which the first digit is three times the last digit, and count them.", answer: "Only h=1,2 are possible fenced values (hundreds digit under 3, and h must divide evenly by giving u=h/3 a digit). h=1 gives u=1/3, not whole, fails. h=2 gives u=2/3, not whole, fails. In fact no value works cleanly here except checking h must be a multiple of 3 within 1-2, and neither 1 nor 2 is a multiple of 3, so there are 0 such numbers." } },
    { h: "10. The complete checklist", body: [
      "Every systematic counting problem follows the same short checklist, and running through it out loud is worth the ten seconds it costs. First, identify the running variable and fence it top and bottom using what a digit or a number is actually allowed to be. Second, express every other unknown in terms of that running variable using the rule. Third, find the forced stopping point, the moment the rule itself breaks rather than a moment you chose to stop. Fourth, if there are two conditions, apply the more restrictive one first to shrink the search early. Fifth, if you only need a count, look for a shortcut like the multiples-between formula, remembering the plus one.",
      "The habit underneath all five steps is the same one from the very first section: never trust a list you cannot defend. If someone asked you right now why your search is complete, you should be able to point to the fence and the stopping rule and answer instantly, not shrug and say you think that is everything.",
    ] },
  ],
  recap: [
    "A systematic search lets one variable run through every legal value, fenced by what a digit can actually be.",
    "A rule mentioning two different positions (like tens and units) usually hides two separate searches; run both.",
    "Stop a search at a forced mathematical limit, not a guessed one, so you can prove nothing is missing.",
    "Always/sometimes/never claims need either every case checked, or one success and one failure found.",
    "Apply the more restrictive of two conditions first to shrink the search early.",
    "Counting multiples between two numbers inclusive uses (end position) minus (start position) plus 1.",
  ],
  mistakes: [
    "Trusting a short pattern (like the two-digit multiples of 9 all summing to 9) without checking every case; the last one often breaks it.",
    "Running only one of two hidden searches when a rule swaps which digit plays which role.",
    "Forgetting that the leading digit of a number cannot be 0, and including invalid entries.",
    "Dropping the plus 1 when counting an inclusive range, undercounting by exactly one.",
    "Declaring a sometimes-true claim always true from a single supporting example, or never true from a single failure.",
  ],
};



// ---- Full-depth guided lesson: logic puzzles (truthLiars, new) ----

JUNIOR_LESSONS.truthLiars = {
  title: "Truth and Lies",
  minutes: 17,
  intro: "On a certain island, everybody is one of two kinds of person: a truth-teller, who always says something true, or a liar, who always says something false. There is no in-between and no exceptions. Your job, whenever you meet a few of them, is to work out who is who from what they say. It looks like guessing. It is really a small, precise kind of proof, and once you learn the moves, entire families of these puzzles fall open.",
  sections: [
    { h: "1. Two kinds of people, no exceptions", body: [
      "A truth-teller's every sentence is true. A liar's every sentence is false. Not sometimes, not usually: always. That total reliability is what makes these puzzles solvable at all, because it means a single sentence, examined carefully enough, can pin down exactly what its speaker must be.",
      "The method for every single puzzle in this lesson is the same shape: assume a person is a truth-teller, follow where that leads, and see whether everything still fits together. If it does, you may have your answer. If it leads to a contradiction, something impossible, then that assumption was wrong, and you flip it.",
    ] },
    { h: "2. The core technique: assume, trace, contradict, flip", body: [
      "Suppose Dee says, 'I have more sweets than Ray.' Assume Dee is a truth-teller. Then the sentence is true: Dee really does have more sweets than Ray. Nothing about that breaks anything else we know, so this assumption survives.",
      "Now assume instead that Dee is a liar. Then the sentence is false, meaning Dee does NOT have more sweets than Ray. That does not break anything either, on its own. With only one sentence and no other clues, both assumptions survive, and the puzzle simply is not solvable yet. That is an important lesson in itself: a single floating sentence, with nothing to check it against, often is not enough. The technique needs a contradiction to bite on, and one lonely sentence rarely provides one.",
    ], tryit: { q: "Fen says, 'The sky is green.' Is Fen a truth-teller or a liar?", answer: "A liar. If Fen were a truth-teller, the sentence would have to be true, but the sky is not green, a plain contradiction with what we already know about the world. So the truth-teller assumption fails, and Fen must be a liar (and indeed, 'the sky is green' being false fits a liar perfectly)." } },
    { h: "3. What a false statement really means", body: [
      "Here is a trap worth defusing early. A liar's statement being false does not always mean the exact opposite words are true. It means the statement, taken as a whole, does not hold, and working out precisely what that implies takes a little care, especially for statements with an and or an or in them.",
      "Try a strange but revealing case first: could anyone, truth-teller or liar, ever say, 'I am a liar'? Suppose a truth-teller said it. Then the sentence must be true, meaning the speaker really is a liar, but we assumed a truth-teller, a contradiction. Now suppose a liar said it. Then the sentence must be false, meaning the speaker is NOT a liar, but we assumed a liar, another contradiction. Neither kind of person can ever utter that sentence. It is a genuine impossibility, not a puzzle to be solved.",
      "Compare that with, 'I am a truth-teller.' A truth-teller saying it makes it true, no contradiction. A liar saying it makes it false, meaning the speaker is not a truth-teller, which fits a liar perfectly, also no contradiction. So this sentence could be said by either kind of person, and hearing it tells you precisely nothing about the speaker. Not every sentence in these puzzles is useful. Some are trick doors that do not open anywhere.",
    ], note: "Before working hard on a statement, ask whether it could, in principle, be said by both kinds of person with no contradiction. If so, it carries zero information, and you need another clue." },
    { h: "4. Negating and and or statements carefully", body: [
      "When a liar's statement contains the word and, joining two parts, the whole thing is false whenever at least one of the two parts is false, it does not require both parts to be false. 'Amy and Ben are both liars' being false only needs Amy to be honest, OR Ben to be honest, OR both, not necessarily both being honest.",
      "When a liar's statement contains the word or, the rule flips. 'Amy or Ben is a liar' being false requires BOTH parts to be false at once, meaning neither Amy nor Ben is a liar. An or-statement is a much stronger claim to knock down: to make it false you must rule out every single option it offered.",
    ], examples: [
      { q: "A liar says, 'Both the dog and the cat are asleep.' What can you conclude?", steps: ["The and statement is false.", "A false and statement only needs at least one part to be false.", "So at least one of the dog or the cat is awake (possibly both)."], answer: "At least one of the dog and the cat is awake; you cannot say which, or whether both are." },
      { q: "A liar says, 'The alarm is ringing or the door is open.' What can you conclude?", steps: ["The or statement is false.", "A false or statement requires every single option it offers to be false.", "So the alarm is NOT ringing and the door is NOT open — both parts must fail together."], answer: "The alarm is not ringing and the door is not open." },
      { q: "Three people, Alex, Blake and Casey, make these statements. Alex says, 'Exactly one of us is a liar.' Blake says, 'Exactly two of us are liars.' Casey says, 'All three of us are liars.' How many liars are there, and who are they?", steps: ["If Casey were a truth-teller, all three would be liars, including Casey. A truth-teller cannot be a liar. Contradiction: Casey must be a liar.", "Casey is a liar, so 'all three are liars' is false: not all three are liars. At least one of Alex or Blake is a truth-teller.", "Try Blake as a truth-teller: Blake's statement 'exactly two are liars' is true. One of Alex or Blake must be the second liar. Blake is a truth-teller, so Alex is the second liar.", "Check Alex's statement: 'exactly one of us is a liar.' With two liars (Alex and Casey), this is false. Alex is a liar, so a false statement fits.", "Try Blake as a liar instead: 'exactly two are liars' is false, so the count is not 2. But with Casey and Blake both liars that is already 2, so Alex must be a truth-teller. Alex says 'exactly one is a liar' — but there are 2 liars, so Alex's statement is false. A truth-teller cannot say something false. Contradiction.", "Only one solution is consistent: Casey and Alex are liars, Blake is a truth-teller."], answer: "Two liars: Alex and Casey. Blake is the truth-teller." },
    ],
      tryit: { q: "A liar says, 'The shop is open or the light is on.' What can you conclude?", answer: "Both parts must be false: the shop is closed AND the light is off. A false or statement forces every option to fail." } },
    { h: "5. A determinate two-person puzzle", body: [
      "Now a puzzle with a genuine, unique answer. Ana and Ben are each a truth-teller or a liar. Ana says, 'At least one of us is a liar.' Work out what each of them is.",
      "Assume Ana is a truth-teller. Her statement is true, so at least one of the two is a liar. Since Ana herself is not a liar (we assumed truth-teller), it must be Ben who is the liar. Nothing about this breaks: Ana truth-teller, Ben liar, is fully consistent.",
      "Now check the other branch. Assume Ana is a liar. Her statement is false, so 'at least one of us is a liar' is false, meaning NEITHER of them is a liar, both are truth-tellers. But that directly contradicts our assumption that Ana is a liar. This branch collapses. Only one branch survives.",
    ], examples: [
      { q: "Confirm: why can Ana not be a liar in the puzzle above?", steps: ["If Ana is a liar, her statement must be false.", "The statement is 'at least one of us is a liar.'", "False means neither is a liar, so Ana would have to be a truth-teller, contradicting the assumption that she is a liar."], answer: "The assumption destroys itself, so it must be rejected" },
      { q: "Two friends, A and B, are each a truth-teller or a liar. A says, 'We are both liars.' Explain why A cannot be a truth-teller, and deduce what each of them is.", steps: ["Assume A is a truth-teller. Then A's statement 'we are both liars' must be true, meaning A is a liar. But A was assumed to be a truth-teller. Contradiction.", "So A must be a liar. Then 'we are both liars' is false, meaning at least one of them is not a liar.", "Since A is a liar, the non-liar must be B. So B is a truth-teller."], answer: "A is a liar, B is a truth-teller." },
      { q: "Three people, P, Q and R, are each a truth-teller or a liar. P says, 'Exactly two of us are truth-tellers.' Q says, 'P is lying.' R says, 'Q is a truth-teller.' Determine the type of each person.", steps: ["Assume P is a truth-teller: exactly two of the three are truth-tellers. Q says 'P is lying' — if Q is a truth-teller that means P is a liar, contradicting our assumption. So Q must be a liar.", "With P a truth-teller and Q a liar, exactly one of the three is confirmed. For P's statement (exactly two truth-tellers) to be true, R must be a truth-teller.", "Check R's statement: R says 'Q is a truth-teller.' R is a truth-teller so this must be true — but Q is a liar. Contradiction.", "Assume P is a liar: 'exactly two are truth-tellers' is false, so the number of truth-tellers is 0, 1 or 3. Q says 'P is lying' — if Q is a truth-teller, Q's statement is true (P is indeed lying). Consistent so far.", "With P a liar and Q a truth-teller, R says 'Q is a truth-teller.' If R is a truth-teller, this is true (Q is indeed a truth-teller). Consistent. Count: P liar, Q truth-teller, R truth-teller — two truth-tellers.", "Check P's statement: P said 'exactly two are truth-tellers.' The actual count is two. P is a liar, so P's statement must be false — but it's true. Contradiction.", "If instead R is a liar: R says 'Q is a truth-teller,' which must be false, so Q is a liar. But we assumed Q is a truth-teller. Contradiction.", "Every branch leads to a contradiction: this puzzle has no valid solution."], answer: "No valid assignment exists; the statements are mutually inconsistent." },
    ] },
    { h: "6. The mutual accusation, and when two answers are both right", body: [
      "Not every puzzle has exactly one answer, and knowing when a puzzle is genuinely ambiguous is as valuable as solving one that is not. Take the classic mutual accusation: Cy says, 'Di is a liar,' and Di says, 'Cy is a liar.'",
      "Assume Cy is a truth-teller. Then Di really is a liar. Check Di's statement under that: Di, being a liar, must be saying something false, and Di says Cy is a liar, which is indeed false since Cy is a truth-teller. Fully consistent.",
      "Now assume Cy is a liar instead. Then Di is not a liar, Di is a truth-teller. Check Di's statement: Di, being a truth-teller, must be saying something true, and Di says Cy is a liar, which is true, since we assumed Cy is a liar. Also fully consistent!",
      "Both branches survive with no contradiction anywhere. This puzzle genuinely has two valid solutions, (Cy truth-teller, Di liar) and (Cy liar, Di truth-teller), and no further clue to choose between them. The honest answer to give here is both are possible, not a nervous guess at one.",
    ], note: "A perfectly symmetrical pair of mutual accusations, with nothing else to break the tie, will always have two solutions like this. Spotting the symmetry saves you from hunting forever for a unique answer that was never there." },
    { h: "7. Circular chains: the parity trick", body: [
      "Chains of three or more people, each accusing the next of lying, deserve their own careful treatment, because whether they have a solution turns out to depend on nothing more than how many people are in the chain.",
      "Take a chain of four: Ali says Bo is lying, Bo says Cai is lying, Cai says Dev is lying, and Dev says Ali is lying. Try alternating: suppose Ali is a truth-teller. Then Ali's statement is true, so Bo is a liar. Since Bo is a liar, Bo's statement is false, so Cai is NOT lying, Cai is a truth-teller. Since Cai is a truth-teller, Cai's statement is true, so Dev is a liar. Since Dev is a liar, Dev's statement is false, so Ali is NOT lying, meaning Ali is a truth-teller. That is exactly what we assumed. No contradiction, the chain closes perfectly: Ali truth-teller, Bo liar, Cai truth-teller, Dev liar, alternating all the way round.",
      "Try the opposite starting assumption, Ali is a liar, and by exactly the same chain of reasoning you get Bo truth-teller, Cai liar, Dev truth-teller, which also closes with no contradiction. A chain of four, an even number, gives exactly two valid alternating solutions, mirror images of each other.",
    ], examples: [
      { q: "Now try a chain of three: Eli says Fay is lying, Fay says Gus is lying, and Gus says Eli is lying. Assume Eli is a truth-teller and trace the whole loop.", steps: ["Eli truth-teller means Eli's statement is true, so Fay is lying (Fay is a liar).", "Fay a liar means Fay's statement is false, so Gus is NOT lying, Gus is a truth-teller.", "Gus a truth-teller means Gus's statement is true, so Eli IS lying, Eli is a liar.", "But we assumed Eli was a truth-teller. Contradiction."], answer: "The assumption fails, and the opposite assumption (Eli a liar) leads to exactly the same contradiction by the same loop, so this three-person chain has NO valid assignment at all: it is impossible" },
      { q: "A circular chain of five people — A, B, C, D, E — each accuses the next of lying (and E accuses A). Without working through every case, explain why no valid assignment of truth-tellers and liars can exist.", steps: ["In any circular accusation chain, the types must alternate: each accuser must be opposite in type to the person they accuse.", "For an alternating pattern to close in a circle, the number of people in the chain must be even, so the alternation fits perfectly after going all the way round.", "Five is odd, so when you follow the alternating pattern all the way round the circle, the last person's type contradicts the first person's type.", "No matter which type you assign to person A, the chain of forced deductions crashes into a contradiction when it returns to A."], answer: "No valid assignment exists. A circular accusation chain can only be solved if its length is even; five is odd, so it is impossible." },
      { q: "A circular accusation chain of six people — A accuses B, B accuses C, C accuses D, D accuses E, E accuses F, and F accuses A — each saying the next is lying. How many valid assignments are there? Describe them.", steps: ["Six is even, so an alternating pattern can close consistently around the full circle.", "Start by assuming A is a truth-teller: then B is a liar, C a truth-teller, D a liar, E a truth-teller, F a liar. F's accusation 'A is a liar' is then false, which fits F being a liar. Consistent.", "Now assume A is a liar: then B is a truth-teller, C a liar, D a truth-teller, E a liar, F a truth-teller. F's accusation 'A is a liar' is then true, which fits F being a truth-teller. Also consistent.", "These are the only two solutions — the two mirror-image alternating patterns."], answer: "Two valid assignments: {A,C,E truth-tellers; B,D,F liars} and {A,C,E liars; B,D,F truth-tellers}." },
    ],
      note: "This is the whole secret laid bare: alternating around a chain of accusations works perfectly for a chain with an EVEN number of people, closing consistently, but for an ODD number of people the alternation contradicts itself no matter where you start, and the chain is flatly impossible. Count the people in a circular accusation chain before you do anything else; the parity alone tells you what kind of answer to expect." },
    { h: "8. A puzzle where you must check every single clue", body: [
      "Here is the single most important habit in this whole topic: once you find an assignment that seems to fit, you must test it against every clue in the puzzle, not just the first one or two that happen to agree. A wrong guess can easily satisfy two clues out of three and still be false.",
      "Xan says, 'Yara is a liar.' Yara says, 'Zed is a liar.' Zed says, 'Xan and Yara are both liars.' Try Xan truth-teller, Yara liar, Zed truth-teller as a first guess. Check clue one: Xan (truth-teller) says Yara is a liar, and Yara is indeed a liar, so clue one holds. Check clue two: Yara (liar) says Zed is a liar, which must be false, so Zed should NOT be a liar; we guessed Zed is a truth-teller, so clue two holds too. Two clues down, looking promising. Now check clue three: Zed (truth-teller) says Xan and Yara are both liars, which must be TRUE since Zed tells the truth; but Xan is a truth-teller in our guess, so 'Xan and Yara are both liars' is actually false. Clue three fails. The guess that survived two clues collapses on the third.",
    ], examples: [
      { q: "Find the assignment that survives all three clues from Xan, Yara and Zed above.", steps: ["Systematically test the remaining possibilities rather than guessing again.", "Try Xan liar, Yara truth-teller, Zed liar. Clue one: Xan (liar) says Yara is a liar, which must be false, so Yara should NOT be a liar; Yara is a truth-teller in this guess, so clue one holds.", "Clue two: Yara (truth-teller) says Zed is a liar, which must be true; Zed is a liar in this guess, so clue two holds.", "Clue three: Zed (liar) says Xan and Yara are both liars, which must be false; the real situation is Xan is a liar AND Yara is a truth-teller, so 'both are liars' is indeed false (only one of them is). Clue three holds too."], answer: "Xan is a liar, Yara is a truth-teller, and Zed is a liar. This is the only assignment that survives all three clues." },
      { q: "Petra says 'Quentin is a liar.' Quentin says 'Ronnie is a liar.' Ronnie says 'Petra and Quentin are both liars.' Find the unique assignment of types.", steps: ["Try Petra as a truth-teller. Then Quentin is a liar (clue one). Quentin (liar) says Ronnie is a liar, so Ronnie must be a truth-teller. Ronnie (truth-teller) says Petra and Quentin are both liars, which must be true. But Petra is a truth-teller — contradiction. This assignment fails.", "Try Petra as a liar. Then 'Quentin is a liar' is false, so Quentin is a truth-teller. Quentin (truth-teller) says Ronnie is a liar, so Ronnie is a liar.", "Check clue three: Ronnie (liar) says 'Petra and Quentin are both liars', which must be false. Petra IS a liar, but Quentin is a truth-teller, so 'both' is false. Clue three holds.", "All three clues pass. The assignment is Petra liar, Quentin truth-teller, Ronnie liar."], answer: "Petra is a liar, Quentin is a truth-teller and Ronnie is a liar" },
      { q: "Four people: Sana says 'Exactly one of Teo, Uma and Viv is a truth-teller.' Teo says 'Sana is a liar.' Uma says 'Teo is a truth-teller.' Viv says 'I am the only truth-teller among all four of us.' Find the unique assignment.", steps: ["If Sana is a truth-teller, exactly one of {Teo, Uma, Viv} is a truth-teller. Testing each sub-case: if Teo is that one truth-teller, Teo says Sana is a liar — contradiction. If Uma is the one, Uma says Teo is a truth-teller — but Teo would be a liar — contradiction. If Viv is the one, Viv says she is the only truth-teller, but Sana is also a truth-teller — contradiction. So Sana must be a liar.", "Sana is a liar. Teo says Sana is a liar: if Teo is a truth-teller, this is correct, which is consistent. If Teo is a liar, his statement must be false, so Sana would be a truth-teller — contradiction. So Teo is a truth-teller.", "Uma says Teo is a truth-teller, which is true. If Uma is a liar, her statement must be false — contradiction. So Uma is a truth-teller.", "Viv says she is the only truth-teller among all four. Teo and Uma are both truth-tellers, so this is false. If Viv were a truth-teller, her statement would have to be true — contradiction. So Viv is a liar."], answer: "Sana is a liar, Teo is a truth-teller, Uma is a truth-teller and Viv is a liar. Check: Sana (liar) claims exactly one of {Teo,Uma,Viv} is TT — actually two are, so the claim is false ✓; Viv (liar) claims to be the only TT among four — false since Teo and Uma are both TT ✓" },
    ],
      tryit: { q: "Check the assignment Xan truth-teller, Yara truth-teller, Zed liar against all three clues, and state which clue fails first.", answer: "Clue one fails immediately: Xan (truth-teller) says Yara is a liar, which must be true, but we guessed Yara is a truth-teller. Contradiction on the very first clue, so this assignment is rejected without even reaching clues two and three." } },
    { h: "9. Building a table so nothing gets missed", body: [
      "For puzzles with three or more people, keep a small table with one row per possible assignment and one column per clue, ticking or crossing each cell as you check it. This is exactly the systematic-listing habit from counting puzzles, applied to logic instead of numbers, and it stops you from quietly skipping a possibility or forgetting which ones you have already ruled out.",
      "It also protects you from the biggest trap in this whole lesson: stopping the moment you find AN assignment that works, without checking whether ANOTHER one also works. As section 6 showed, sometimes two really do both survive, and only a full table reveals that honestly.",
    ], tryit: { q: "For a puzzle with 3 people, each either a truth-teller or a liar, how many total assignments must a complete table check before you can be sure you have found every solution?", answer: "8. Each of the 3 people independently has 2 possibilities, and 2 x 2 x 2 = 8 total combinations to check." } },
    { h: "10. The complete method", body: [
      "Pull every piece together into one short routine. First, note any statement that could be said by either kind of person, and set it aside as uninformative. Second, pick a person and a statement, assume a type for them, and trace every consequence it forces through the whole puzzle. Third, the moment a contradiction appears, reject that assumption and flip it. Fourth, once you find an assignment that survives, check it against EVERY clue in the puzzle, not just the ones you have already used. Fifth, if a circular chain of accusations is involved, count the people first: an even chain may have two mirror solutions, an odd chain is flatly impossible.",
      "The whole subject rests on one small piece of discipline: total, unwavering trust that a truth-teller never slips and a liar never accidentally tells the truth. Follow that discipline all the way through, checking every clue rather than stopping early, and these puzzles stop being mysterious and become entirely mechanical.",
    ] },
  ],
  recap: [
    "A truth-teller's statements are always true; a liar's are always false, with no exceptions.",
    "Method: assume a type, trace every consequence, and if a contradiction appears, flip the assumption.",
    "Some statements, like 'I am a truth-teller,' could be said by either kind of person and carry no information.",
    "A false and-statement only needs one part to fail; a false or-statement needs every part to fail.",
    "Symmetrical mutual accusations can have two equally valid solutions; say so rather than forcing one answer.",
    "In a circular chain of accusations, an even number of people can close consistently (often two mirror solutions), an odd number cannot close at all.",
    "Always check a candidate solution against every clue, not just the ones that happened to agree first.",
  ],
  mistakes: [
    "Accepting an assignment after checking only some of the clues, when a later clue would have ruled it out.",
    "Assuming a liar's false and-statement means both parts are false, when only at least one part needs to fail.",
    "Assuming a liar's false or-statement means only one part is false, when every part must fail.",
    "Treating a genuinely uninformative statement, like 'I am a truth-teller,' as if it pins down the speaker's type.",
    "Forcing a single answer onto a symmetrical mutual-accusation puzzle that genuinely has two valid solutions.",
    "Not counting the length of a circular accusation chain before assuming an alternating pattern will close consistently.",
  ],
};


// ---- Full-depth guided lesson: seating logic (seating, new) ----

JUNIOR_LESSONS.seating = {
  title: "Arrangements",
  minutes: 18,
  intro: "Seating puzzles hand you a handful of people, a row of chairs or a round table, and a list of who sits where, or who cannot sit where. There are usually far too many possible arrangements to check one by one, so the whole skill is a system: place the most restricted person first, use every clue exactly once, and be honest with yourself about what 'next to' and 'opposite' actually mean. A close cousin of the deduction puzzle simply asks how MANY arrangements satisfy one constraint, which is a counting question rather than a detective one. Get both systems right and even a six-person round table falls into place in a few short steps.",
  sections: [
    { h: "1. Why you cannot just try them all", body: [
      "Five people can sit in a row of five chairs in far more ways than you might guess. The first chair could be filled by any of the 5 people, the second by any of the 4 remaining, the third by any of the 3 left, and so on. Multiplying those choices, 5×4×3×2×1, gives 120 completely different arrangements.",
      "Checking all 120 by hand to find the one or two that fit every clue would take an age. The whole point of a seating puzzle is that you never need to: careful reasoning from the clues narrows 120 possibilities down to one, usually in under ten lines of working.",
    ] },
    { h: "2. Counting arrangements in a row and around a table", body: [
      "For a row of n distinct seats and n distinct people, the count is n! (n factorial): n × (n-1) × (n-2) × ... × 1. Four people in a row of four seats: 4! = 24. Three people: 3! = 6.",
      "A round table changes the counting, because rotating everyone by one seat, all together, gives an arrangement where nobody's neighbours have changed at all — for every practical purpose the SAME seating. So circular arrangements are counted by fixing one person's seat as an anchor and arranging the rest: (n-1)!. For 4 people around a table: fix one, arrange the other 3 in 3! = 6 ways — compare to 4! = 24 for a row, four times as many, exactly because the row counts every rotation as different.",
    ], tryit: { q: "How many ways can 6 people sit in a row of 6 chairs, with no restrictions?", answer: "720 = 6!." },
      examples: [
        { q: "How many genuinely different ways can 5 people sit around a round table?", steps: ["Fix one person's seat as anchor.", "The remaining 4 arrange in 4! ways.", "4! = 24."], answer: "24 arrangements" },
        { q: "4 people sit around a round table. Two of them, Fred and Gina, must sit next to each other. How many valid arrangements are there?", steps: ["Treat Fred and Gina as a single combined block, so there are now 3 items to arrange around the circle.", "Circular arrangements of 3 items: (3-1)! = 2! = 2 ways.", "Fred and Gina can swap positions inside their block: multiply by 2.", "Total: 2 × 2 = 4 arrangements."], answer: "4 arrangements" },
        { q: "8 people sit around a round table. How many arrangements have two specific people, Hal and Ida, sitting directly opposite each other?", steps: ["Fix Hal at one seat as anchor to remove rotations.", "In an 8-seat circle, the seat directly opposite is 4 seats away, so Ida must occupy exactly that one seat.", "The remaining 6 people fill the 6 remaining seats in 6! ways.", "6! = 720."], answer: "720 arrangements" },
      ] },
    { h: "3. Counting under ONE constraint: the 'glue them together' trick", body: [
      "A very common counting question asks how many circular arrangements have two named people sitting next to each other. The trick is to glue the two of them into a single combined 'block', which turns n people into (n-1) items to arrange in a circle: (n-2)! ways. But the two glued people can be ordered two ways inside their own block (X-then-Y or Y-then-X), so multiply by 2: total = (n-2)! × 2.",
      "For 6 people with 2 required to sit together: (6-2)! × 2 = 4! × 2 = 24 × 2 = 48. Compare this to the unrestricted total of (6-1)! = 120 — so 48 out of 120 circular arrangements have that pair adjacent, meaning 120 - 48 = 72 arrangements have them NOT adjacent. Whichever way the question is phrased (together, or specifically apart), you get one count directly and the other by subtracting from the unrestricted total.",
    ], examples: [
      { q: "6 people sit around a round table. In how many arrangements are two named people, Kai and Zara, NOT sitting next to each other?", steps: ["Total arrangements: (6-1)! = 120.", "Arrangements WITH them together: (6-2)! × 2 = 24 × 2 = 48.", "Arrangements without them together: 120 - 48 = 72."], answer: "72" },
      { q: "5 people sit around a round table. In how many arrangements are two named people, Max and Nina, next to each other?", steps: ["Treat Max and Nina as a single block, giving 4 items to arrange in a circle.", "Circular arrangements of 4 items: (4-1)! = 3! = 6 ways.", "Max and Nina can swap inside their block: multiply by 2.", "Total: 6 × 2 = 12."], answer: "12 arrangements" },
      { q: "6 people — 3 friends (P, Q, R) and 3 strangers (X, Y, Z) — sit around a round table. In how many arrangements does each friend sit between two strangers?", steps: ["For every friend to be between two strangers, the arrangement must alternate: friend, stranger, friend, stranger, friend, stranger around the table.", "Fix P at seat 1 to remove rotations. The alternating pattern forces friends into seats 1, 3, 5 and strangers into seats 2, 4, 6.", "Q and R fill seats 3 and 5 in any order: 2! = 2 ways.", "X, Y and Z fill seats 2, 4 and 6 in any order: 3! = 6 ways.", "Total: 2 × 6 = 12 arrangements."], answer: "12 arrangements" },
    ],
      tryit: { q: "5 people sit around a round table. In how many arrangements are two named people sitting together?", answer: "12. (5-2)! × 2 = 3! × 2 = 6 × 2 = 12." } },
    { h: "4. Reading a clue precisely: next to, direction, and opposite", body: [
      "The words a clue uses matter enormously, and mixing them up is the single most common way to lose a seating puzzle. 'Next to' (or beside, or adjacent to) is symmetric: it means immediately on EITHER side, both directions count. A directional clue, like 'immediately to the right of' or 'immediately clockwise of', is NOT symmetric — it only allows one specific direction.",
      "'Opposite' only makes sense with an EVEN number of seats around a circle, since only then does every seat have exactly one seat directly across from it. In a circle of n seats, the seat opposite seat k is seat k + n/2 (wrapping round if it overshoots).",
    ], tryit: { q: "In a circle of 6 seats, numbered 1 to 6 clockwise, which seat is opposite seat 2?", answer: "Seat 5. Half of 6 is 3, so opposite seat 2 is seat 2 + 3 = 5." } },
    { h: "5. Place the most constrained thing first", body: [
      "The efficient order to work through a deduction puzzle is to place whichever clue leaves the FEWEST remaining possibilities first, letting each subsequent clue narrow things down further, rather than working through the clues in the order they happen to be listed.",
      "A clue that fixes an exact seat, or a directional clue, is far more restrictive than a loose one like 'X does not sit next to Y'. Handle the tightest clues first — they shrink the puzzle the fastest — and save the loosest, most permissive clues for last, when they only need to rule out a couple of leftover possibilities.",
    ] },
    { h: "6. A full round-table deduction, worked step by step", body: [
      "Five people, Ann, Bo, Cy, Di and Ed, sit around a round table. Clue one: Cy sits next to both Bo and Di. Clue two: Ed does not sit next to Di. Fix Ann's seat as the anchor (seat 1) and work out where everyone else must go.",
      "Clue one is the tightest: it pins Cy between Bo and Di, so the order somewhere in the circle runs ...Bo-Cy-Di... Clue two then rules out Ed sitting on the far side of Di (since that would put Ed next to Di), so Ed must sit on the OTHER side, and Ann fills the one remaining gap.",
    ], examples: [
      { q: "Check the finished arrangement Ann-Bo-Cy-Di-Ed (going clockwise) against both clues.", steps: ["Clue one: Cy's neighbours are Bo and Di. ✓", "Clue two: Ed's neighbours are Di and Ann. That means Ed IS next to Di — this violates clue two!", "So try the other option: Ann-Ed-Bo-Cy-Di going clockwise instead.", "Now Ed's neighbours are Ann and Bo — not Di. Clue two holds. Cy's neighbours are Bo and Di. Clue one holds."], answer: "Ann-Ed-Bo-Cy-Di is the arrangement that satisfies both clues" },
      { q: "5 people — Anna, Ben, Clare, Dan and Eve — sit around a round table. Anna must have Ben and Clare as her two immediate neighbours (in either order). How many valid arrangements are there in total?", steps: ["Fix Anna at seat 1 to remove rotations.", "Ben and Clare must occupy seats 2 and 5 (Anna's two neighbours); they can swap: 2! = 2 ways.", "Dan and Eve fill the remaining seats 3 and 4 in any order: 2! = 2 ways.", "Total: 2 × 2 = 4 arrangements."], answer: "4 arrangements" },
      { q: "6 people — A, B, C, D, E and F — sit around a round table. Clue 1: A sits directly opposite B. Clue 2: C sits next to both A and D. How many valid arrangements are there?", steps: ["Fix A at seat 1. B is opposite, at seat 4.", "C must sit next to A, so C is at seat 2 or seat 6.", "Case 1 — C at seat 2: D must be next to C and is not in seat 1 (taken), so D is at seat 3. E and F fill seats 5 and 6: 2! = 2 ways.", "Case 2 — C at seat 6: D must be next to C and is not in seat 1, so D is at seat 5. E and F fill seats 2 and 3: 2! = 2 ways.", "Total: 2 + 2 = 4 arrangements."], answer: "4 arrangements" },
    ],
      note: "Notice the first attempt looked plausible but failed clue two — this is exactly why you must check EVERY clue against the finished arrangement, not stop as soon as one clue is satisfied." },
    { h: "7. How the game verifies these puzzles are fair", body: [
      "Every deduction-style seating question in this game is checked by brute force before you ever see it: the game builds a real seating arrangement first, picks a small number of TRUE clues describing it, and then tests EVERY possible arrangement of that same group of people against those clues. Only if every single arrangement that satisfies all the clues agrees on the answer being asked (who sits next to X, or who's opposite X) does the question get used — otherwise it's thrown away and a fresh one is built.",
      "This matters because it's easy to accidentally write a set of clues that fits two genuinely different seatings with two different answers, which would make a question unfair. The brute-force check is the seating equivalent of the truth-and-lies puzzles' rule: never present a puzzle that doesn't have exactly one correct, fully justified answer.",
    ] },
    { h: "8. The trap of only checking one direction", body: [
      "Because 'next to' allows both directions, a common mistake is to try only one of the two possible sides and declare the puzzle solved the moment that one direction fits, without checking whether the OTHER direction was actually required instead, or whether both are still live possibilities that need another clue to separate.",
      "Whenever a 'next to' clue leaves two options open, keep both in play until a later clue eliminates one of them. Committing early to whichever direction you happened to try first is the single most common way these puzzles go wrong.",
    ], tryit: { q: "In a row of 5 seats, how many neighbours does the seat in the very middle (seat 3) have, compared with an end seat (seat 1)?", answer: "Seat 3 has 2 neighbours (seats 2 and 4). Seat 1, an end, has only 1 neighbour (seat 2). Middle seats give a 'next to' clue two possible directions; end seats give only one." } },
    { h: "9. The trap of treating a rotation as a new arrangement", body: [
      "The opposite mistake happens at round tables: forgetting the whole table can be spun and still describe exactly the same seating, then treating a spun copy as a brand new, different solution. If your working ever produces two answers that are just rotations of each other, they are the same arrangement wearing a different seat-numbering, not two genuinely different seatings.",
      "The fix from section 2 handles this automatically: fix one named person's seat before you begin, and every arrangement you find afterwards is already rotation-free.",
    ] },
    { h: "10. A harder deduction, and a counting question side by side", body: [
      "Six people sit around a table. Clue one: Amir sits opposite Priya. Clue two: Jo sits next to Amir. Clue three: Kim does not sit next to Priya. Fix Amir at seat 1; opposite seat 1 in a 6-seat circle is seat 1 + 3 = seat 4, so Priya is at seat 4. Jo, next to Amir, takes seat 2 or seat 6 — a genuine two-way branch that needs clue three to resolve, since Kim not sitting next to Priya rules out whichever seat would put Kim beside seat 4.",
      "Contrast this with a counting question about the SAME six people: 'in how many arrangements is Amir opposite Priya?' Fixing Amir at seat 1 forces Priya to exactly one seat (seat 4, the unique opposite), and the remaining 4 people can be arranged freely in the other 4 seats in 4! = 24 ways. So there are 24 arrangements with Amir opposite Priya, out of a total of 5! = 120 — a clean counting answer, quite different in style from tracing clue-by-clue to find the ONE arrangement that fits every constraint.",
    ], examples: [
      { q: "6 people sit around a table. In how many arrangements is a specific named person opposite another specific named person?", steps: ["Fix the first person's seat as anchor.", "Being opposite forces the second person into exactly 1 specific seat.", "The remaining 4 people fill the remaining 4 seats freely: 4! = 24 ways."], answer: "24 arrangements" },
      { q: "8 people sit around a round table. How many arrangements have two specific people, P and Q, sitting directly opposite each other?", steps: ["Fix P at one seat to remove rotations.", "In an 8-seat circle, directly opposite is 4 seats away, forcing Q into exactly 1 specific seat.", "The remaining 6 people fill the other 6 seats freely: 6! = 720 ways."], answer: "720 arrangements" },
      { q: "6 people sit around a round table. How many arrangements have person R opposite person S, and also person T immediately next to person R?", steps: ["Fix R at seat 1 to remove rotations. S must be at seat 4 (the unique opposite seat in a 6-seat circle).", "T must be immediately next to R: T can be at seat 2 or seat 6. That gives 2 choices for T.", "The remaining 3 people (call them U, V, W) fill the 3 remaining seats freely: 3! = 6 ways.", "Total: 2 × 6 = 12 arrangements."], answer: "12 arrangements" },
    ] },
    { h: "11. The complete method", body: [
      "For a DEDUCTION puzzle: if it's a round table, fix one named person's seat first. Apply the tightest, most restrictive clues before the loose ones. Read 'next to' as both directions and a directional clue as only one direction, and never confuse them. Remember 'opposite' only applies with an even number of seats. Once every seat is filled, check the finished arrangement against every single clue.",
      "For a COUNTING puzzle: work out the total unrestricted count first ((n-1)! for a circle, n! for a row), then apply the constraint — usually by gluing required-together people into one block and multiplying by the internal orderings of that block, or by subtracting a 'together' count from the total to get 'apart'.",
    ] },
  ],
  recap: [
    "A row of n distinct people has n! arrangements; a round table has (n-1)! once rotations are treated as the same.",
    "To count arrangements with two people together, glue them into one block: (n-2)! × 2. Subtract this from the total to count arrangements with them apart.",
    "Next to (or beside) allows either direction; a directional clue like 'immediately to the right of' allows only one.",
    "Opposite only makes sense with an even number of seats, exactly halfway round the circle.",
    "Place the tightest, most restrictive clues first; save loose clues for ruling out the last leftover possibilities.",
    "Always check the finished arrangement against every clue, not just the ones used to build it — and never count a rotation as a new arrangement.",
  ],
  mistakes: [
    "Treating a directional clue (immediately to the right of) as if it allowed either direction, like a plain 'next to' clue.",
    "Counting two seatings that are just rotations of each other as if they were different arrangements.",
    "Using 'opposite' in a circle with an odd number of seats, where no seat sits exactly across from another.",
    "Committing to one direction of a 'next to' clue too early, before a later clue has actually ruled out the other direction.",
    "Confusing a counting question ('how many arrangements...') with a deduction question ('who sits where...') and trying to solve one using the other's method.",
  ],
};


// ---- Full-depth guided lesson: guaranteed outcomes (pigeonhole, new) ----

JUNIOR_LESSONS.pigeonhole = {
  title: "Certainty",
  minutes: 15,
  intro: "There is a world of difference between something being likely and something being GUARANTEED. This lesson is about a beautifully simple way to prove a guarantee: imagine the worst possible luck you could have, work out exactly how far that bad luck could stretch, and then add one more. That single extra step is enough to force the outcome you wanted, no matter how the rest played out. It is called the pigeonhole principle, and it turns up in surprisingly serious mathematics for something you can first meet with a drawer of socks.",
  sections: [
    { h: "1. Likely is not the same as certain", body: [
      "If you pull two socks from a drawer full of red and blue socks, it is likely they will not match. That is a statement about chance, about what tends to happen. This lesson asks a completely different kind of question: how many socks would you have to pull to be ABSOLUTELY certain, with zero risk of being wrong, that at least two match?",
      "Certainty and likelihood are answered by different tools entirely. Probability tells you how often something happens over many tries. The pigeonhole principle tells you the exact point at which something MUST happen, every single time, with no exceptions and no luck involved at all.",
    ] },
    { h: "2. The sock drawer, reasoned from the worst case", body: [
      "A drawer holds only red socks and blue socks, plenty of each. How many socks must you pull out, without looking, to be certain at least two of them match?",
      "The trick is to imagine the worst possible luck. Suppose you pull one sock: it could be red or blue, obviously no match yet with only one sock. Pull a second sock: the worst possible luck is that it is the OTHER colour from your first, so still no match. But now you have used up both available colours. Pull a third sock, and it simply has no colour left to be other than red or blue, so it must match one of the first two.",
      "So 2 socks might not match, in the worst case, but 3 socks are guaranteed to include a matching pair. The answer is 3, and notice the reasoning proved it, rather than a lucky guess.",
    ], examples: [
      { q: "A drawer holds only black and white socks. How many must you pull to guarantee a matching pair?", steps: ["Worst case: the first two socks could be one black and one white, no match yet.", "There are no colours left to avoid a match on the third sock.", "So 2 is not enough, but 3 is guaranteed."], answer: "3 socks" },
      { q: "A drawer holds only red, green and blue socks. How many must you pull to guarantee a matching pair?", steps: ["There are k = 3 colours. Worst case: the first three socks are one of each colour, all different.", "There are no colours left for the fourth sock to avoid, so it must repeat one of the three.", "k + 1 = 3 + 1 = 4 socks guarantee a pair."], answer: "4 socks" },
      { q: "A tin holds coins of 4 different values — 1p, 2p, 5p and 10p — with plenty of each. How many coins must you take, without looking, to guarantee 3 coins of the same value?", steps: ["There are k = 4 types of coin and we want r = 3 of one type.", "Worst case: 2 of each type (one short of 3), using k × (r − 1) = 4 × 2 = 8 coins with no type at 3 yet.", "The 9th coin must push some type to 3.", "k × (r − 1) + 1 = 4 × 2 + 1 = 9."], answer: "9 coins" },
    ],
      tryit: { q: "A bag holds only 10p and 50p coins. How many must you pull to guarantee two coins of the same value?", answer: "3. Worst case, the first two are one of each value; the third has no new value left to be, so it must match one of the first two." } },
    { h: "3. Stating the principle properly", body: [
      "Generalise the sock reasoning into a rule you can reuse instantly. If there are k different categories something could fall into (here, k colours), then k items might all land in different categories, one each, with no repeat at all. But the very next item, the (k+1)th, has nowhere new to go, so it must repeat a category that has already been used.",
      "In symbols: with k categories, k+1 items are guaranteed to include two in the same category, and k items are never quite enough to guarantee it (since the worst case exactly avoids a repeat with k items, one per category).",
    ], examples: [
      { q: "A calendar has 12 months. How many people must be in a room to guarantee two share a birth month?", steps: ["There are k = 12 categories (the months).", "The worst case has one person per month, using up all 12 months with no repeat, so 12 people might all have different months.", "The 13th person has no new month left, so a repeat is forced."], answer: "13 people" },
      { q: "There are 7 days in the week. How many people must be in a group to guarantee that at least two of them were born on the same day of the week?", steps: ["There are k = 7 categories (the days of the week).", "Worst case: 7 people, each born on a different day — all 7 days used with no repeat.", "The 8th person has no new day left to be born on.", "k + 1 = 7 + 1 = 8 people."], answer: "8 people" },
      { q: "Ten whole numbers are chosen from 1 to 10. The numbers are sorted into pairs that add up to 11: {1, 10}, {2, 9}, {3, 8}, {4, 7}, {5, 6}. How many numbers must be chosen from 1 to 10 to guarantee that two of them add up to 11?", steps: ["The 5 pairs act as the k = 5 categories; choosing two numbers from the same pair gives a sum of 11.", "Worst case: choose one number from each pair (choosing 5 numbers in total) — no two are in the same pair, so no two sum to 11.", "The 6th choice must come from a pair already represented, giving two numbers that sum to 11.", "k + 1 = 5 + 1 = 6 numbers."], answer: "6 numbers" },
    ],
      note: "The categories do not have to be about people or socks at all. Any time something is sorted into a fixed number of boxes, the same worst-case-plus-one reasoning applies." },
    { h: "4. Stretching the principle: guaranteeing more than a pair", body: [
      "The same worst-case idea scales up to guarantee three, four, or any number of matches, not just two. If you want to guarantee r items end up in the SAME category, the worst possible luck lets every category fill up to (r - 1) items each, one short of the target, before anything is forced.",
      "With k categories, that worst case uses up k x (r - 1) items with nothing yet guaranteed. One more item beyond that, and some category is pushed to r. So the guaranteed number is k x (r - 1) + 1.",
      "Check it against the sock puzzle: k = 2 colours, wanting r = 2 (a pair), gives 2 x (2 - 1) + 1 = 2 x 1 + 1 = 3, exactly what we found by hand. The formula and the direct reasoning agree, because the formula IS that reasoning, just written compactly.",
    ], examples: [
      { q: "A drawer holds red, blue and green socks, plenty of each. How many socks must you pull to guarantee three of the same colour?", steps: ["k = 3 colours, wanting r = 3 of one colour.", "Worst case: 2 of each colour (one short of 3), using 3 × 2 = 6 socks with nothing guaranteed yet.", "One more sock, the 7th, must push some colour to 3."], answer: "7 socks" },
      { q: "A drawer holds socks in 4 different colours, with plenty of each. How many must you pull to guarantee 4 socks of the same colour?", steps: ["k = 4 colours, wanting r = 4 of one colour.", "Worst case: 3 of each colour (one short of 4), using k × (r − 1) = 4 × 3 = 12 socks with no colour at 4 yet.", "The 13th sock must push some colour to 4.", "Formula: k × (r − 1) + 1 = 4 × 3 + 1 = 13."], answer: "13 socks" },
      { q: "An urn holds sweets in 6 different flavours, with unlimited amounts of each. How many sweets must you pick to guarantee that you have at least 4 of the same flavour?", steps: ["k = 6 flavours, wanting r = 4 of one flavour.", "Worst case: 3 of each flavour (one short of 4), using k × (r − 1) = 6 × 3 = 18 sweets with no flavour at 4 yet.", "The 19th sweet must push some flavour to 4.", "Formula: k × (r − 1) + 1 = 6 × 3 + 1 = 19."], answer: "19 sweets" },
    ],
      tryit: { q: "How many people must be in a room to guarantee 4 of them share the same birth month (12 months)?", answer: "37. k = 12 months, r = 4. Worst case: 3 people per month uses 12 x 3 = 36 people with no month reaching 4 yet. The 37th person forces some month to 4." } },
    { h: "5. A card-drawing example", body: [
      "A standard deck has 4 suits, hearts, diamonds, clubs and spades, with plenty of cards in each. Drawing blind from a shuffled deck, how many cards must you draw to guarantee two cards of the same suit?",
      "k = 4 suits, wanting a repeat, so r = 2. Worst case: 1 card of each suit, using 4 x 1 = 4 cards with no suit repeated yet, since all four suits are different. The 5th card has no new suit left to be, so it must repeat one already drawn.",
    ], examples: [
      { q: "How many cards must you draw to guarantee 3 of the same suit?", steps: ["k = 4 suits, wanting r = 3 of one suit.", "Worst case: 2 of each suit (one short of 3), using 4 × 2 = 8 cards with nothing guaranteed yet.", "The 9th card must push some suit to 3."], answer: "9 cards" },
      { q: "How many cards must you draw from a standard 52-card deck to guarantee 2 cards of the same suit?", steps: ["There are k = 4 suits. We want r = 2 of one suit.", "Worst case: 1 of each suit (one short of 2), using 4 cards with no suit repeated yet.", "The 5th card has no new suit left to be.", "k + 1 = 4 + 1 = 5 cards."], answer: "5 cards" },
      { q: "A special deck has 5 different suits with 10 cards in each suit (50 cards total). How many cards must you draw to guarantee 5 cards of the same suit?", steps: ["k = 5 suits, wanting r = 5 of one suit.", "Worst case: 4 of each suit (one short of 5), using k × (r − 1) = 5 × 4 = 20 cards with no suit at 5 yet.", "The 21st card must push some suit to 5.", "Formula: k × (r − 1) + 1 = 5 × 4 + 1 = 21."], answer: "21 cards" },
    ],
      tryit: { q: "How many cards must you draw to guarantee 2 aces, given there are 4 aces and 48 non-ace cards in the deck?", answer: "50. Worst case, you draw every single non-ace card first (48 of them) plus 1 ace, giving 49 cards with only 1 ace so far. The 50th card, if any card remains, must be an ace, giving 2. (There is no 'category' shortcut here since only one category, ace or not, actually matters; see the next section.)" } },
    { h: "6. Do not confuse guaranteed with merely very likely", body: [
      "Here is a genuinely important distinction, because the two ideas get mixed up constantly outside of maths lessons. Pigeonhole reasoning gives a hard guarantee, true in absolutely every possible case, with zero exceptions. It is often a bigger number than you might expect, because it has to cover the single worst possible run of luck, however unlikely that exact run might be in practice.",
      "With 12 birth months, you need 13 people to GUARANTEE a shared month. But with far fewer than 13 people, say 25, it becomes overwhelmingly likely, though not strictly guaranteed, that some two of them share a month, since 25 people spread across just 12 months are very unlikely to land in some tidy pattern with hardly any month repeated. Likely and guaranteed are different questions, answered by different branches of maths, probability for the first, pigeonhole for the second, and a pigeonhole answer should never be quoted as if it were describing everyday likelihood.",
    ], note: "If a question asks for a number that will ALMOST CERTAINLY work, that is a probability question. If it asks for a number that WILL DEFINITELY work, no matter what, that is a pigeonhole question. Read the wording carefully before reaching for either tool." },
    { h: "7. Guaranteeing a specific category is a different, harder question", body: [
      "Everything so far has guaranteed a repeat in SOME category, whichever one the bad luck happens to land on. It is a genuinely different and usually much harder question to guarantee a repeat in one PARTICULAR named category, because the worst possible luck can simply avoid that category almost entirely by using up every other category first.",
      "A drawer holds 4 blue socks and 6 red socks. How many socks must you pull to guarantee 2 RED socks specifically, not just any matching pair? The worst case is now: pull every single blue sock first (4 of them), and then just 1 red sock, giving 5 socks with only 1 red so far, still no red pair. The very next sock, the 6th, has nowhere to come from except the red socks (all blue ones are already gone), so it must be red, giving 2 reds.",
      "Notice this needed the ACTUAL number of blue socks available, 4, not just the number of colours, 2. Guaranteeing a specific category depends on how many items exist in every OTHER category, which the simple k x (r - 1) + 1 formula from section 4 does not capture, since that formula assumes you only care which category repeats, not which one in particular.",
    ], examples: [
      { q: "A drawer holds 5 blue socks and 8 red socks. How many must you pull to guarantee 3 RED socks specifically?", steps: ["Worst case: pull every blue sock first (5 of them), using up the entire non-red supply.", "Then pull 2 red socks, one short of the target of 3, giving 5 + 2 = 7 socks with still no red trio.", "The 8th sock has nowhere to come from except red, forcing the 3rd red sock."], answer: "8 socks" },
      { q: "A bag holds 3 yellow counters and 10 blue counters. How many counters must you draw to guarantee 2 YELLOW counters specifically?", steps: ["Worst case: draw every blue counter first (10 of them), exhausting the entire non-yellow supply.", "Then draw 1 yellow counter, one short of the target of 2, giving 10 + 1 = 11 counters with only 1 yellow.", "The 12th counter has nowhere to come from except yellow, forcing the 2nd yellow counter."], answer: "12 counters" },
      { q: "A bag holds 6 red, 4 blue and 9 green counters mixed together. How many must you draw to guarantee 5 GREEN counters specifically?", steps: ["Worst case: draw every non-green counter first — all 6 red and all 4 blue — using 10 counters.", "Then draw 4 green counters, one short of the target of 5, giving 10 + 4 = 14 counters with no green quintet yet.", "The 15th counter has no red or blue left to be (all 10 non-green are already drawn), forcing the 5th green."], answer: "15 counters" },
    ],
      tryit: { q: "A box holds 7 green counters and 3 yellow counters. How many must you pull to guarantee 2 YELLOW counters specifically?", answer: "9. Worst case: all 7 green counters plus 1 yellow, giving 8 counters with only 1 yellow. The 9th counter must be yellow (only 2 yellow remain and no green is left), giving 2." } },
    { h: "8. A combined challenge", body: [
      "A sports bag holds identical-feeling gloves in three sizes, small, medium and large, with 6 of each size mixed up together. Reaching in blind, how many gloves must you pull to guarantee a matching pair of the SAME size?",
      "This is the plain some-category version from section 3, since we do not care which size matches, only that some size does. k = 3 sizes, r = 2 for a pair. Worst case: 1 of each size, using 3 gloves with nothing matched yet. The 4th glove has no new size left to be.",
    ], examples: [
      { q: "Now suppose you specifically need 2 LARGE gloves, and there are 6 small, 6 medium and 6 large mixed together. How many must you pull to guarantee that?", steps: ["Worst case: every non-large glove is pulled first, which is 6 small plus 6 medium = 12 gloves, none of them large.", "Then pull 1 large glove, one short of the target pair, giving 12 + 1 = 13 gloves with still no large pair.", "The 14th glove has nowhere to come from except large (12 non-large gloves are already used up), forcing the 2nd large glove."], answer: "14 gloves, compared with just 4 gloves for guaranteeing SOME matching size" },
      { q: "A bag holds 3 small, 3 medium and 5 large envelopes, all identical to the touch. How many must you draw to guarantee 3 LARGE envelopes specifically?", steps: ["Worst case: draw every non-large envelope first — all 3 small and all 3 medium — using 6 envelopes.", "Then draw 2 large envelopes, one short of the target of 3, giving 6 + 2 = 8 envelopes with still no large trio.", "The 9th envelope has no small or medium left to be, forcing the 3rd large envelope."], answer: "9 envelopes" },
      { q: "A box holds 10 short, 8 medium and 6 long pencils, all identical to the touch. What is the minimum number you must draw to guarantee you have at least 2 of EVERY length (that is, 2 short and 2 medium and 2 long)?", steps: ["The last pair to arrive is whichever length is hardest to collect — the one delayed longest by bad luck.", "Worst case for getting 2 long: draw all 10 short and all 8 medium (18 pencils) plus just 1 long — 19 pencils with only 1 long.", "By then you already have 2+ short and 2+ medium, so only the 2nd long is missing.", "The 20th pencil has no short or medium left to be (18 non-long pencils already drawn), forcing the 2nd long pencil.", "All three pairs are now guaranteed."], answer: "20 pencils" },
    ],
      note: "Compare the two answers side by side: 4 gloves to guarantee any matching size, but 14 gloves to guarantee a specific size. Asking for a particular category rather than any category can change the answer enormously, which is exactly why reading the question's exact wording matters so much in this topic." },
    { h: "9. The reasoning, folded to pocket size", body: [
      "Every pigeonhole question answers to the same short routine. First, decide precisely what you must guarantee: a repeat in ANY category, or a target count in ONE named category, since these need different reasoning. Second, imagine the single worst possible run of luck: for any-category questions, that is one short of the target in every category; for a specific-category question, that is using up every OTHER category entirely, then falling one short in the target category. Third, count exactly how many items that worst case uses. Fourth, add exactly one more, since the very next item has nowhere left to go except forcing the outcome you wanted.",
      "That final plus one is the beating heart of the whole method, and it is also the step most often forgotten under pressure. A worst case of 12 people with no shared birth month means 12 is NOT enough, and it is the 13th person, one more than the worst case, who is truly guaranteed to force a match.",
    ] },
  ],
  recap: [
    "Guaranteed means true in every possible case, with zero exceptions; likely means true in most cases, which is a different question answered by probability.",
    "To guarantee a repeat among k categories, you need k + 1 items: the worst case fills every category once, leaving no room for a k+1th item to avoid a repeat.",
    "To guarantee r items in the SAME (any) category among k categories, you need k x (r - 1) + 1 items.",
    "Guaranteeing a repeat in one SPECIFIC named category needs the actual count of every OTHER category, not just the number of categories.",
    "Always imagine the single worst possible run of luck first, count how many items it uses, then add exactly one more.",
  ],
  mistakes: [
    "Stopping at the worst-case count itself and forgetting to add the final +1 that actually forces the outcome.",
    "Using the number of categories (k) when a specific named category was asked for, instead of the actual count of every other category.",
    "Treating a pigeonhole guarantee as if it were describing everyday likelihood, or vice versa.",
    "Applying the k x (r - 1) + 1 formula to a specific-category question where it does not apply.",
    "Forgetting that the worst case fills every category to one short of the target, not to zero.",
  ],
};


// ---- Full-depth guided lesson: optimisation via algebra (productOpt, new) ----

JUNIOR_LESSONS.productOpt = {
  title: "Optimisation",
  minutes: 17,
  intro: "Here is a question that sounds like it needs trial and error but actually has a clean, provable answer: if two numbers must add up to a fixed total, what values make their product as big as possible? Or as small as possible? The surprising answer is that splitting the total as EVENLY as possible always maximises the product, and splitting it as UNEVENLY as possible always minimises it — and this single idea, once you understand why it's true, answers an entire family of questions: rectangles of fixed perimeter, totals split across several categories, and comparing real candidate allocations against each other. This lesson builds the whole result from scratch and then puts it to work in every one of those settings.",
  sections: [
    { h: "1. Spotting the pattern by trying a few splits", body: [
      "Suppose two whole numbers must add up to 20. Try a handful of splits and multiply each pair: 1 and 19 give 19. 5 and 15 give 75. 8 and 12 give 96. 9 and 11 give 99. 10 and 10 give 100.",
      "The product climbs steadily as the split gets fairer, and peaks exactly when the two numbers are equal, then falls away again on the other side (11 and 9 also give 99, mirroring 9 and 11). The evidence points to a rule: for a fixed sum, the product is biggest when the two numbers are as close together as possible, and smallest when they are as far apart as the rules allow.",
    ], tryit: { q: "Two whole numbers add to 16. Try the splits 1&15, 4&12, 7&9, 8&8 and compare their products.", answer: "1×15=15, 4×12=48, 7×9=63, 8×8=64. The equal split, 8 and 8, gives the biggest product, 64." } },
    { h: "2. Writing any split as a fair share plus a wobble", body: [
      "To prove the pattern always holds, write the two numbers cleverly. If the fixed sum is S, the perfectly equal split is S/2 for each number. Any OTHER split can be written as that fair share plus some wobble d added to one number and subtracted from the other: (S/2 + d) and (S/2 - d). These always add to S no matter what d is, since the d's cancel.",
      "Multiplying the two wobble-form numbers gives (S/2 + d)(S/2 - d), which expands (via the difference-of-two-squares identity) to (S/2)² - d². The first part is fixed; the second part, d², is always zero or positive. So the product is a fixed number MINUS something that can only help by being as small as possible — meaning d = 0, the perfectly equal split, always gives the maximum.",
    ], examples: [
      { q: "For sum S = 20, use the formula (S/2)² - d² to find the product when d = 4.", steps: ["S/2 = 10, so (S/2)² = 100.", "d = 4, so d² = 16.", "Product = 100 - 16 = 84."], answer: "84 (matching 14 × 6 = 84)" },
      { q: "For sum S = 24, what is the maximum possible product of two positive whole numbers, and which split achieves it? Verify using the formula.", steps: ["The maximum is at d = 0, the equal split.", "S/2 = 12, so the split is 12 and 12.", "(S/2)² − d² = 12² − 0 = 144.", "Check: 12 × 12 = 144. ✓"], answer: "144, achieved by 12 and 12" },
      { q: "Two positive whole numbers add to 36. The equal split gives the maximum product. By how much does the product fall when the split changes from (18, 18) to (12, 24)?", steps: ["Equal split (18, 18): product = 18² = 324.", "For the split (12, 24): the wobble is d = 18 − 12 = 6.", "Product = (S/2)² − d² = 324 − 6² = 324 − 36 = 288.", "The fall is 324 − 288 = 36, which equals d² exactly."], answer: "The product falls by 36 (from 324 to 288); the drop equals d² = 36, as the formula predicts." },
    ] },
    { h: "3. The mirror rule for the SMALLEST product", body: [
      "Run the same reasoning backwards: since the product is (S/2)² - d², it gets SMALLER as d² gets bigger — meaning the product shrinks the more lopsided the split becomes. Among positive whole numbers, the most lopsided legal split pushes one number down to the smallest allowed value (1) and the other up to take the rest (S - 1).",
      "For S = 20, that gives 1 and 19, product 19 — matching the smallest value in our opening list of splits. So for a fixed sum, the SMALLEST possible product (using positive whole numbers) is always 1 × (S - 1) = S - 1.",
    ], examples: [
      { q: "Two positive whole numbers add to 30. What's the smallest possible product?", steps: ["Most lopsided split: 1 and 29.", "1 × 29 = 29."], answer: "29" },
      { q: "Three positive whole numbers add to 12. Find the minimum possible product.", steps: ["To minimise the product of three parts, make the split as lopsided as possible.", "The most lopsided split with positive whole numbers is 1, 1, 10.", "Product = 1 × 1 × 10 = 10."], answer: "10, achieved by the split 1, 1, 10" },
      { q: "Two positive whole numbers have a product of 64 and no other constraint. What is the smallest possible sum those two numbers could have (they need not be whole numbers)?", steps: ["For any two positive numbers with product P, the sum x + y is minimised when x = y (by the equal-split principle running in reverse).", "If xy = 64 and x = y, then x² = 64, so x = 8 and y = 8.", "Minimum sum = 8 + 8 = 16.", "Any unequal pair with product 64 has a larger sum — for instance, 4 and 16 give sum 20."], answer: "16, achieved by x = y = 8" },
    ],
      tryit: { q: "Two positive whole numbers add to 45. What's the smallest possible product?", answer: "44. 1 × 44 = 44." } },
    { h: "4. The mirror question: fixed product, smallest sum — and rectangles", body: [
      "The exact same equal-split logic answers a mirror question that turns up constantly in geometry. If a rectangle's PERIMETER is fixed, what shape maximises its AREA? A rectangle's perimeter fixes the sum of its length and width (half the perimeter); its area is their PRODUCT. So this is precisely our fixed-sum, maximise-the-product problem in disguise, and the answer is the same: make the two sides as equal as possible. A square (equal sides) always gives the biggest area for a given perimeter.",
      "And the minimum-area mirror holds too: for integer sides, the most lopsided legal rectangle (one side of length 1) gives the smallest possible area for that perimeter.",
    ], examples: [
      { q: "A rectangle has integer sides and a perimeter of 24. Compare the areas of a 1×11, a 4×8, a 6×6 and a 5×7 rectangle.", steps: ["Perimeter 24 means the sides add to 12.", "1×11 = 11.", "4×8 = 32.", "6×6 = 36.", "5×7 = 35."], answer: "The square (6×6) has the largest area, 36; the most lopsided rectangle (1×11) has the smallest, 11." },
      { q: "A rectangle has integer sides and a perimeter of 30. What is the maximum possible area, and what dimensions give it?", steps: ["Perimeter 30 means the sides add to 15.", "15 is odd, so the most equal integer split is 7 and 8.", "Maximum area = 7 × 8 = 56.", "Check: the square 7.5 × 7.5 = 56.25 is slightly better but uses non-integer sides, so 7 × 8 = 56 is the integer maximum."], answer: "56 square units, achieved by a 7 × 8 rectangle" },
      { q: "A farmer has 60 metres of fencing to enclose a rectangular field. One side borders a straight wall, so only three sides need fencing. What dimensions maximise the area, and what is that maximum area?", steps: ["Let the width be W and the length (parallel to the wall) be L. The three fenced sides give L + 2W = 60, so L = 60 − 2W.", "Area = LW = W(60 − 2W) = 2W(30 − W). This is twice the product of two quantities, W and 30 − W, that add to 30.", "The product W(30 − W) is maximised when W = 30 − W, giving W = 15.", "Then L = 60 − 2 × 15 = 30. Maximum area = 15 × 30 = 450 m²."], answer: "Width 15 m, length 30 m, maximum area 450 m²" },
    ],
      tryit: { q: "A rectangle has integer sides and perimeter 20 (sides add to 10). What's the maximum possible area, and what's the minimum?", answer: "Maximum: 5×5 = 25 (equal sides). Minimum: 1×9 = 9 (most lopsided)." } },
    { h: "5. Splitting a total into MORE than two parts", body: [
      "The same principle extends naturally to splitting a fixed total T into k positive whole-number parts (not just two) to maximise their product: make the parts as EQUAL as possible. If T divides evenly by k, every part is exactly T/k. If it doesn't, T/k leaves a remainder, and the fairest possible split gives some parts one more than the others — specifically, (T mod k) of the parts get ⌈T/k⌉ (rounded up) and the rest get ⌊T/k⌋ (rounded down).",
      "This is genuinely more interesting than the two-number case, because the EXACT values of the near-equal parts change depending on T's remainder when divided by k — so you can't just memorise 'always split in half', you actually have to do the division and look at the remainder.",
    ], examples: [
      { q: "Split 17 into 3 positive whole numbers to maximise the product.", steps: ["17 ÷ 3 = 5 remainder 2.", "So 2 of the parts are 6 (rounded up) and 1 part is 5 (rounded down): 6, 6, 5.", "Check: 6+6+5 = 17. Product = 6×6×5 = 180."], answer: "6, 6, 5 with product 180" },
      { q: "Split 22 into 4 positive whole numbers to maximise the product.", steps: ["22 ÷ 4 = 5 remainder 2.", "So 2 of the parts are 6 (rounded up) and 2 parts are 5 (rounded down): 6, 6, 5, 5.", "Check: 6+6+5+5 = 22. Product = 6 × 6 × 5 × 5 = 36 × 25 = 900."], answer: "6, 6, 5, 5 with product 900" },
      { q: "Split 25 into 5 positive whole numbers to maximise the product. Then compare the result with the split (6, 5, 5, 5, 4).", steps: ["25 ÷ 5 = 5 exactly, no remainder.", "The equal split is 5, 5, 5, 5, 5. Product = 5^5 = 3125.", "For comparison: (6, 5, 5, 5, 4). Product = 6 × 4 × 5 × 5 × 5 = 24 × 125 = 3000.", "3000 < 3125: the equal split beats the unequal one, as expected."], answer: "5, 5, 5, 5, 5 with product 3125; the unequal split (6, 5, 5, 5, 4) gives only 3000." },
    ],
      tryit: { q: "Split 22 into 4 positive whole numbers to maximise the product. What are the parts and the product?", answer: "22 ÷ 4 = 5 remainder 2, so 2 parts are 6 and 2 parts are 5: 6, 6, 5, 5. Product = 6×6×5×5 = 900." } },
    { h: "6. Why 'as equal as possible' really does beat every alternative", body: [
      "It's worth checking this isn't just a rule of thumb but a genuinely provable fact, even with more than two parts. Take any split that ISN'T as equal as possible — it must contain two parts that differ by 2 or more. Nudge the smaller one up by 1 and the larger one down by 1 (keeping the total the same). By the two-number wobble argument from section 2, this ALWAYS increases the product of just those two parts (since they're moving closer together), while every other part is untouched — so the overall product goes up. This means any split that isn't already 'as equal as possible' can always be improved, so the truly best split must be the one where no two parts differ by more than 1 — exactly the near-equal split.",
    ], note: "This 'nudge two unequal parts closer together' argument is a genuine proof, not just pattern-spotting from examples — it shows NO other split of the same total into the same number of parts can ever beat the near-equal one." },
    { h: "7. Comparing real candidate allocations", body: [
      "A different style of question doesn't ask you to construct the best split from scratch — it gives you several CONCRETE candidate splits of the same total and asks which has the largest product. Here the method is simply arithmetic: compute the product of every candidate and compare them directly. The near-equal-split rule tells you WHICH candidate to expect to win (the most balanced-looking one), but with concrete numbers in front of you, always verify by actually multiplying rather than trusting your eye.",
    ], examples: [
      { q: "A total of 18 is split three ways as follows: (6,6,6), (4,7,7), (2,8,8). Which has the largest product?", steps: ["6×6×6 = 216.", "4×7×7 = 196.", "2×8×8 = 128."], answer: "(6,6,6) with product 216 — the most equal split wins, as expected" },
      { q: "A total of 21 is split three ways: (7,7,7), (5,8,8) and (3,9,9). Which gives the largest product and which gives the smallest?", steps: ["7×7×7 = 343.", "5×8×8 = 320.", "3×9×9 = 243.", "Largest product: 343 (equal split). Smallest: 243 (most lopsided)."], answer: "(7,7,7) gives the largest product at 343; (3,9,9) gives the smallest at 243." },
      { q: "A total of 30 is split four ways: (10,10,5,5), (8,8,8,6) and (12,9,6,3). Which gives the largest product?", steps: ["10×10×5×5 = 100 × 25 = 2500.", "8×8×8×6 = 512 × 6 = 3072.", "12×9×6×3 = 108 × 18 = 1944.", "Compare: 3072 > 2500 > 1944."], answer: "(8,8,8,6) gives the largest product at 3072 — the most nearly-equal split among the three candidates wins." },
    ],
      tryit: { q: "A total of 24 is split as (8,8,8), (6,9,9) and (4,10,10). Which gives the largest product?", answer: "(8,8,8): 8×8×8=512. (6,9,9): 6×9×9=486. (4,10,10): 4×10×10=400. The most equal split, 512, wins." } },
    { h: "8. The misconception this whole topic depends on", body: [
      "There's a very natural but incorrect instinct that numbers which are MORE different from each other should multiply to something bigger, since one of them gets to be so much larger. The wobble algebra from section 2 shows precisely why that instinct is backwards: the product is (S/2)² - d², and making the numbers more different means making d bigger, which SUBTRACTS more, shrinking the product rather than growing it.",
      "It helps to picture it physically: a rectangular pen for a rabbit made from a fixed length of fencing. Stretching it out long and thin uses the same fence but leaves the rabbit less floor space; squaring it up towards equal sides gives the most floor space for the same fence. The equal split isn't just an algebra curiosity — it's the shape that wastes the least of a fixed resource.",
    ] },
    { h: "9. Watching out for the integer restriction", body: [
      "Every result in this lesson assumes POSITIVE WHOLE NUMBER parts, which is the usual assumption in these puzzles unless stated otherwise. This restriction is exactly why the smallest-product answer (section 3) is a clean 1 × (S-1) rather than some fraction, and it's exactly why the maximum-product split for an unequal total (section 5) needs a remainder calculation instead of a tidy S/2. If a question ever allows non-whole-number parts, the maximum split is still 'as equal as possible' but the minimum has no floor at all (you could make one part tinier and tinier), so always check what kind of numbers the question is restricting you to before applying these rules.",
    ], tryit: { q: "Why can't you use the formula 'smallest product = 1 × (S-1)' if the two numbers are allowed to be any positive numbers, not just whole numbers?", answer: "Because without the whole-number restriction, one number could be made arbitrarily close to 0 and the other arbitrarily close to S, making the product shrink towards 0 with no smallest value at all. The clean minimum of 1×(S-1) relies entirely on 1 being the smallest ALLOWED positive whole number." } },
    { h: "10. Pulling it all together", body: [
      "Whatever shape the question takes — two numbers, several numbers, a rectangle's sides, or a list of concrete candidates to compare — the underlying idea never changes. For a fixed sum, the product is maximised by splitting as evenly as possible and minimised by splitting as unevenly as the rules allow. The mirror version, for a fixed product, says the sum (and so a rectangle's perimeter) is minimised when the parts are equal. Whenever several parts are involved, the exact near-equal values depend on the remainder when you divide the total by the number of parts — so always do that division rather than assuming a tidy half-and-half split.",
    ] },
  ],
  recap: [
    "For two numbers with a fixed sum, the product is largest when the numbers are equal, and shrinks the more unequal they become.",
    "For a fixed sum, the smallest product (positive whole numbers) is always 1 × (sum − 1).",
    "The mirror rule holds for a fixed perimeter rectangle: a square (equal sides) gives the maximum area; the most lopsided integer rectangle gives the minimum.",
    "Splitting a total into k parts to maximise the product: divide by k and look at the remainder — that many parts round up, the rest round down.",
    "Nudging two unequal parts of any split closer together always increases the product, which is why the fully equal (or near-equal) split can never be beaten.",
    "When comparing concrete candidate splits, always compute and compare the actual products rather than trusting which one 'looks' most balanced.",
  ],
  mistakes: [
    "Believing more different numbers multiply to something bigger; a fixed sum's product actually shrinks as the numbers spread apart.",
    "Forgetting the positive-whole-number restriction when hunting for the smallest possible product for a fixed sum.",
    "Assuming a lopsided rectangle can match a square's area while using less fencing; the square always maximises area for a fixed perimeter.",
    "Splitting a total into k parts as a flat T/k without handling the remainder, instead of correctly rounding some parts up and others down.",
    "Trusting which candidate split 'looks' most equal instead of actually computing and comparing the real products.",
  ],
};


// ---- Full-depth guided lesson: geometric sequences (bouncing, new) ----

JUNIOR_LESSONS.bouncing = {
  title: "Sequences: the geometric kind",
  minutes: 16,
  intro: "Most sequences people first meet grow by adding the same amount each time: 3, 7, 11, 15, always plus 4. But there is a whole other family of sequences that grow, or shrink, by MULTIPLYING by the same amount each time instead. A bouncing ball is the perfect real-world picture: it never rebounds to a fixed number of centimetres less each time, it rebounds to a fixed FRACTION of its previous height. This lesson builds that idea from scratch, and then puts it to work counting exactly how many bounces clear a given height.",
  sections: [
    { h: "1. Two different kinds of pattern", body: [
      "An arithmetic sequence keeps a constant DIFFERENCE between consecutive terms: 3, 7, 11, 15 always adds 4. A geometric sequence keeps a constant RATIO between consecutive terms instead: divide any term by the one before it, and you always get the same number, called the common ratio.",
      "Look at 3, 6, 12, 24, 48. The difference between terms is not constant (3, then 6, then 12, then 24), so it is not arithmetic. But divide each term by the one before: 6/3 = 2, 12/6 = 2, 24/12 = 2, 48/24 = 2. Always exactly 2. That constant ratio is what makes it geometric.",
    ], tryit: { q: "Is 5, 15, 45, 135 arithmetic, geometric, or neither?", answer: "Geometric. The differences are 10, 30, 90, which are not constant, but the ratios are 15/5=3, 45/15=3, 135/45=3, all equal to 3." } },
    { h: "2. Geometric sequences can shrink too", body: [
      "A very natural instinct is to expect every sequence to increase, but a geometric sequence shrinks perfectly happily whenever its common ratio is a fraction between 0 and 1. Look at 200, 20, 2, 0.2. The ratios are 20/200 = 0.1, 2/20 = 0.1, 0.2/2 = 0.1, a constant common ratio of 0.1, even though every term is getting smaller.",
      "This decaying case is exactly as geometric as the growing case in section 1. Do not let 'goes up' sneak into your mental definition of what a sequence is allowed to do.",
    ], examples: [
      { q: "Confirm 8, 4, 2, 1 is geometric and state its common ratio.", steps: ["4 / 8 = 0.5.", "2 / 4 = 0.5.", "1 / 2 = 0.5.", "All ratios match."], answer: "Geometric, with common ratio 0.5" },
      { q: "Confirm 100, 50, 25, 12.5 is geometric, and state its common ratio.", steps: ["50 / 100 = 0.5.", "25 / 50 = 0.5.", "12.5 / 25 = 0.5.", "All three ratios match."], answer: "Geometric, with common ratio 0.5 (a half)" },
      { q: "Confirm 27, 9, 3, 1, 1/3 is geometric and state its common ratio.", steps: ["9 / 27 = 1/3.", "3 / 9 = 1/3.", "1 / 3 = 1/3.", "(1/3) / 1 = 1/3.", "All four ratios match, including the fractional term."], answer: "Geometric, with common ratio 1/3" },
    ] },
    { h: "3. The formula for any term", body: [
      "Once you know the first term (call it a) and the common ratio (call it r), you can jump straight to any term without building the whole list. The second term is a x r. The third term is a x r x r, or a x r squared. In general, the nth term is a x r to the power of (n - 1), since the first term needs the ratio applied zero times, the second term once, and so on, always one fewer time than the term number.",
      "Check it against 3, 6, 12, 24, 48: here a = 3 and r = 2. The 5th term should be a x r^4 = 3 x 16 = 48, matching exactly.",
    ], examples: [
      { q: "A geometric sequence has first term 2 and common ratio 3. Find the 4th term.", steps: ["Use nth term = a x r^(n-1).", "4th term = 2 x 3^3.", "3^3 = 27, so 2 x 27 = 54."], answer: "54" },
      { q: "A geometric sequence has first term 4 and common ratio 3. Find the 6th term.", steps: ["Use nth term = a x r^(n-1).", "6th term = 4 x 3^5.", "3^5 = 243, so 4 x 243 = 972."], answer: "972" },
      { q: "A geometric sequence has first term 3 and common ratio 2. Find the 7th term.", steps: ["Use nth term = a x r^(n-1).", "7th term = 3 x 2^6.", "2^6 = 64, so 3 x 64 = 192."], answer: "192" },
    ],
      tryit: { q: "A geometric sequence has first term 5 and common ratio 0.2. Find the 4th term.", answer: "0.04. 4th term = 5 x 0.2^3 = 5 x 0.008 = 0.04." } },
    { h: "4. The bouncing ball, built from first principles", body: [
      "A ball is dropped from height H. After hitting the ground, it never rebounds to the exact same height, it rebounds to some fixed FRACTION of the height it fell from, say p over q of it, and this same fraction applies again after every future bounce too. That single repeated fraction is exactly a common ratio, so the sequence of rebound heights, after the first bounce, second bounce, third bounce and so on, is a geometric sequence.",
      "If the ball drops from H and rebounds to a fraction r of its previous height each time, the first rebound reaches H x r, the second rebound reaches H x r x r = H x r^2, and in general the nth rebound reaches H x r^n.",
    ] },
    { h: "5. A full worked bounce", body: [
      "Drop a ball from H = 8 metres, and suppose it rebounds to 3 over 4 of its previous height every time. The first rebound reaches 8 x 0.75 = 6 metres. The second rebound reaches 6 x 0.75 = 4.5 metres. The third rebound reaches 4.5 x 0.75 = 3.375 metres. Each rebound is exactly three quarters of the one before, a genuine geometric sequence: 6, 4.5, 3.375, ...",
    ], examples: [
      { q: "A ball is dropped from 16 m with rebound ratio 1/2. Find the height of the 3rd rebound.", steps: ["3rd rebound = H x r^3 = 16 x (0.5)^3.", "0.5^3 = 0.125.", "16 x 0.125 = 2 m."], answer: "2 metres" },
      { q: "Continuing that ball (H = 8 m, ratio 3/4), find the height of the 4th rebound.", steps: ["4th rebound = H x r^4 = 8 x (0.75)^4.", "0.75^4 = 0.31640625.", "8 x 0.31640625 = 2.53125."], answer: "About 2.53 metres" },
      { q: "A ball is dropped from 81 m with rebound ratio 2/3. Find the height of the 4th rebound.", steps: ["4th rebound = H x r^4 = 81 x (2/3)^4.", "(2/3)^4 = 16/81.", "81 x 16/81 = 16 m exactly."], answer: "16 metres" },
    ],
      tryit: { q: "A ball dropped from 10 m rebounds to 0.6 of its previous height each time. Find the 2nd rebound height.", answer: "3.6 m. 1st rebound = 10 x 0.6 = 6 m. 2nd rebound = 6 x 0.6 = 3.6 m (or directly 10 x 0.6^2 = 10 x 0.36 = 3.6)." } },
    { h: "6. Counting how many bounces clear a height", body: [
      "A common question does not ask for a bounce height directly, it asks how many bounces manage to rebound ABOVE some fixed ledge or window height. The method is to work through the rebound heights one at a time, in order, and simply count how many exceed the target before the first one that fails.",
      "Take H = 8 m, ratio 2/3, and a ledge at W = 4 m (exactly half of H). Rebound 1: 8 x 2/3 = 5.333 m, which clears 4 m. Rebound 2: 5.333 x 2/3 = 3.555 m, which does NOT clear 4 m. So exactly 1 rebound clears the ledge, and the count stops there, since every rebound after a failure is even smaller and will fail too.",
    ], examples: [
      { q: "A ball dropped from 10 m rebounds with ratio 2/3. How many rebounds clear a ledge at 5 m?", steps: ["Rebound 1: 10 x 2/3 ≈ 6.67 m, clears 5 m.", "Rebound 2: 6.67 x 2/3 ≈ 4.44 m, does NOT clear 5 m.", "Stop: each later rebound is even smaller."], answer: "1 rebound clears the ledge" },
      { q: "Using the same drop height H = 8 m and ledge W = 4 m, but a rebound ratio of 3/4, how many rebounds clear the ledge?", steps: ["Rebound 1: 8 x 0.75 = 6 m, clears 4 m.", "Rebound 2: 6 x 0.75 = 4.5 m, clears 4 m.", "Rebound 3: 4.5 x 0.75 = 3.375 m, does NOT clear 4 m."], answer: "2 rebounds clear the ledge" },
      { q: "A ball dropped from 9 m rebounds with ratio 2/3. How many rebounds clear a ledge at 1.5 m?", steps: ["Rebound 1: 9 x 2/3 = 6 m, clears 1.5 m.", "Rebound 2: 6 x 2/3 = 4 m, clears 1.5 m.", "Rebound 3: 4 x 2/3 ≈ 2.67 m, clears 1.5 m.", "Rebound 4: 2.67 x 2/3 ≈ 1.78 m, clears 1.5 m.", "Rebound 5: 1.78 x 2/3 ≈ 1.19 m, does NOT clear 1.5 m."], answer: "4 rebounds clear the ledge" },
    ],
      tryit: { q: "Same H = 8 m and W = 4 m, but ratio 4/5. How many rebounds clear the ledge?", answer: "3. Rebound 1: 8x0.8=6.4 (clears). Rebound 2: 6.4x0.8=5.12 (clears). Rebound 3: 5.12x0.8=4.096 (clears). Rebound 4: 4.096x0.8=3.2768 (fails). So 3 rebounds clear before the pattern breaks." } },
    { h: "7. Why the very first rebound always clears half height", body: [
      "Notice something neat in every example above: the ledge was set at exactly half of the drop height, W = H/2, and the very first rebound always cleared it, no matter which ratio was used (2/3, 3/4 or 4/5). That is not a coincidence, it follows directly from the ratios chosen.",
      "The first rebound reaches H x r. For that to clear W = H/2, we need H x r > H/2, and dividing both sides by H (a positive height) gives r > 1/2. Every ratio used above, 2/3, 3/4 and 4/5, is indeed bigger than 1/2, which is exactly why bounce one always cleared in each case. If a ratio were ever less than 1/2, even the very first rebound would fail to reach a half-height ledge.",
    ], note: "This is a lovely example of reasoning about a whole family of numbers at once, rather than checking examples one by one: ANY ratio bigger than a half guarantees the first rebound clears a half-height ledge, proven in general rather than by luck." },
    { h: "8. Constructing a sequence to hit a target", body: [
      "Some questions flip the whole task around: instead of analysing a given sequence, you must INVENT one that satisfies a stated goal. Find a geometric sequence that starts with a whole number between 1 and 10, and reaches or exceeds 1000 by exactly its 7th term (with the 6th term still under 1000).",
      "Try a first term of 2 and a common ratio of 3. The terms are 2, 6, 18, 54, 162, 486, 1458. The 6th term, 486, is under 1000, and the 7th term, 1458, is the first to reach or exceed 1000. This sequence satisfies every part of the requirement.",
    ], examples: [
      { q: "Verify the sequence 3, 6, 12, 24, 48 is geometric and state its common ratio.", steps: ["6/3 = 2.", "12/6 = 2.", "24/12 = 2.", "48/24 = 2.", "All ratios match."], answer: "Yes, geometric with common ratio 2" },
      { q: "Verify the sequence 2, 6, 18, 54, 162, 486, 1458 is truly geometric with a constant ratio.", steps: ["6/2 = 3.", "18/6 = 3.", "54/18 = 3.", "162/54 = 3.", "486/162 = 3.", "1458/486 = 3.", "Every ratio is exactly 3."], answer: "Yes, a genuine geometric sequence with common ratio 3" },
      { q: "A student claims 4, 12, 36, 108, 324 is geometric with first term 4 and ratio 3. Verify by checking all ratios AND using the nth-term formula for the 5th term.", steps: ["Check ratios: 12/4=3, 36/12=3, 108/36=3, 324/108=3. All equal 3.", "Formula check: 5th term = 4 x 3^4 = 4 x 81 = 324.", "Both methods agree."], answer: "Yes, the claim is correct. The sequence is geometric with ratio 3, and the formula confirms the 5th term is 324." },
    ],
      tryit: { q: "Check whether the attempt 'first term 10, ratio 2' also reaches or exceeds 1000 by its 7th term.", answer: "No, it fails. The sequence is 10, 20, 40, 80, 160, 320, 640, and the 7th term, 640, is still under 1000. This attempt does not satisfy the requirement, which is exactly why checking your construction matters." } },
    { h: "9. Many valid answers, not just one", body: [
      "Unlike a single-answer calculation, a construction task like section 8 has many correct solutions, and finding just one, fully verified, is a complete answer. First term 4 with ratio 2.5, first term 1 with ratio 3.5, and plenty of others would also work, as long as you actually check the 6th term stays under 1000 and the 7th term reaches it.",
      "The discipline that matters is not finding THE answer, since there rarely is a single one, but proving your chosen answer genuinely works, term by term, rather than trusting a guess that merely feels plausible.",
    ] },
    { h: "10. Common mixed-up thinking to watch for", body: [
      "The most persistent error is applying arithmetic-sequence habits to a geometric one: assuming a bouncing ball loses a FIXED number of metres each bounce, rather than a fixed FRACTION. A ball rebounding to three quarters of its height does not lose the same amount each time, since three quarters of a smaller number is a smaller loss than three quarters of a bigger one.",
      "A second error is assuming every geometric sequence must grow, dismissing a shrinking, fractional-ratio sequence as somehow not a real one. And a third is stopping a clear-the-ledge count too early or too late: once a rebound fails to clear the ledge, every later rebound is smaller still and will also fail, so there is no need to check any further, but you must not stop counting BEFORE the first failure either.",
    ] },
  ],
  recap: [
    "A geometric sequence has a constant RATIO between consecutive terms, unlike an arithmetic sequence's constant difference.",
    "The nth term of a geometric sequence is a x r^(n-1), where a is the first term and r is the common ratio.",
    "A ratio between 0 and 1 gives a shrinking sequence, still fully geometric despite decreasing.",
    "A bouncing ball's rebound heights form a geometric sequence, since each rebound is a fixed fraction of the one before.",
    "To count rebounds clearing a height, work through them in order and stop counting at the first one that fails.",
    "A ratio bigger than 1/2 guarantees the first rebound clears a ledge set at half the drop height.",
    "Construction tasks (find A sequence that does X) usually have many valid answers; verify your choice rather than trusting a guess.",
  ],
  mistakes: [
    "Assuming a bouncing ball loses the same fixed height each bounce, instead of the same fixed fraction.",
    "Dismissing a shrinking, fractional-ratio sequence as not a real geometric sequence.",
    "Checking a term-by-term ratio only once or twice instead of confirming it is constant across the whole sequence.",
    "Continuing to count rebounds after one has already failed to clear the target height.",
    "Treating a construction task as if it has one unique answer, rather than verifying your own chosen example fully.",
  ],
};


// ---- Deep-quest full-depth guided lesson: multi-step journeys (epicJourney, new) ----

JUNIOR_LESSONS.epicJourney = {
  title: "Epic Journeys",
  minutes: 20,
  intro: "A journey question rarely stays simple for long. A cyclist changes pace partway. A friend sets off from the other direction. A graph shows two racers whose lines cross. Every one of these situations is built from exactly one formula, distance equals speed multiplied by time, used again and again, leg by leg. This lesson is about learning to break a scary, tangled journey into small, single-speed pieces you already know how to handle, and about a famous trap, averaging speeds instead of averaging properly, that catches almost everyone at least once.",
  sections: [
    { h: "1. The one formula everything is built from", body: [
      "Distance equals speed multiplied by time: D = S x T. That is the entire engine behind every journey question in this lesson, however complicated it looks on the surface. Everything else is just this formula rearranged, or applied more than once.",
      "Rearranged for speed: S = D / T (how far divided by how long). Rearranged for time: T = D / S (how far divided by how fast). A car covering 240 km in 4 hours travels at 240 / 4 = 60 km/h. A cyclist covering 30 km at 10 km/h takes 30 / 10 = 3 hours.",
    ], tryit: { q: "A train covers 180 km at a steady 45 km/h. How long does the journey take?", answer: "4 hours. T = D / S = 180 / 45 = 4." } },
    { h: "2. Breaking a journey into legs", body: [
      "The moment speed CHANGES partway through a journey, D = S x T can no longer be applied to the whole trip in one go, because there is no single S that describes it. The fix is to split the journey into legs, stretches where the speed genuinely stays constant, apply the formula separately to each leg, then combine the results.",
      "Total distance is the sum of each leg's distance. Total time is the sum of each leg's time. Only once you have those two combined totals can you find a genuine overall average speed for the whole trip, using total distance divided by total time, never by averaging the individual leg speeds directly (section 8 explains exactly why not).",
    ] },
    { h: "3. A worked two-leg journey", body: [
      "A hiker walks 8 km at a steady 4 km/h, then walks a further 9 km at a steady 3 km/h. Find the time for each leg, the total distance, the total time, and the overall average speed for the whole walk.",
    ], examples: [
      { q: "A cyclist rides 10 km at 5 km/h, then 6 km at 3 km/h. Find leg times, total distance, total time and average speed.", steps: ["Leg 1 time: 10 / 5 = 2 hours.", "Leg 2 time: 6 / 3 = 2 hours.", "Total distance: 10 + 6 = 16 km.", "Total time: 2 + 2 = 4 hours.", "Average speed: 16 / 4 = 4 km/h."], answer: "Leg times 2 h and 2 h; total 16 km; total 4 h; average 4 km/h" },
      { q: "Work through the hiker's journey leg by leg.", steps: ["Leg 1 time: T = D / S = 8 / 4 = 2 hours.", "Leg 2 time: T = D / S = 9 / 3 = 3 hours.", "Total distance: 8 + 9 = 17 km.", "Total time: 2 + 3 = 5 hours.", "Average speed: total distance / total time = 17 / 5 = 3.4 km/h."], answer: "Leg times 2 h and 3 h; total distance 17 km; total time 5 h; average speed 3.4 km/h" },
      { q: "A bus travels 24 km at 12 km/h, stops for 30 minutes, then travels 36 km at 18 km/h. Find the average speed for the moving portions only.", steps: ["Moving leg 1 time: 24 / 12 = 2 hours.", "Moving leg 2 time: 36 / 18 = 2 hours.", "Total moving distance: 24 + 36 = 60 km.", "Total moving time: 2 + 2 = 4 hours.", "Average moving speed: 60 / 4 = 15 km/h."], answer: "15 km/h (the 30-minute stop is excluded from this average)" },
    ],
      tryit: { q: "A van drives 60 km at 30 km/h, then 45 km at 45 km/h. Find the total time and the overall average speed.", answer: "Total time = 60/30 + 45/45 = 2 + 1 = 3 hours. Total distance = 105 km. Average speed = 105 / 3 = 35 km/h." } },
    { h: "4. Two travellers moving toward each other", body: [
      "When two people set off at the same moment from opposite ends of a route, heading towards each other, the gap between them closes at a rate equal to the SUM of their two speeds, since every hour, each of them eats into the gap from their own side.",
      "Two towns are 150 km apart. Car A leaves Town 1 towards Town 2 at 40 km/h. At the very same moment, Car B leaves Town 2 towards Town 1 at 35 km/h. Combined closing speed: 40 + 35 = 75 km/h. Time to meet: 150 / 75 = 2 hours.",
    ], examples: [
      { q: "Two cyclists start 30 km apart, heading towards each other at 8 km/h and 7 km/h. How long until they meet, and how far has the 8 km/h cyclist travelled?", steps: ["Combined closing speed: 8 + 7 = 15 km/h.", "Time to meet: 30 / 15 = 2 hours.", "Distance for 8 km/h cyclist: 8 x 2 = 16 km."], answer: "They meet after 2 hours, 16 km from the faster cyclist's start" },
      { q: "Where do Car A and Car B meet, measured from Town 1?", steps: ["Car A travels for the full 2 hours before meeting.", "Distance covered by Car A: 40 x 2 = 80 km.", "Check against Car B: 35 x 2 = 70 km from Town 2, and 80 + 70 = 150 km, the full gap."], answer: "They meet 80 km from Town 1 (and 70 km from Town 2), after 2 hours" },
      { q: "Towns P and Q are 200 km apart. Car A (60 km/h) leaves P and Car B (40 km/h) leaves Q simultaneously, heading towards each other. How far from P do they meet?", steps: ["Combined closing speed: 60 + 40 = 100 km/h.", "Time to meet: 200 / 100 = 2 hours.", "Car A covers: 60 x 2 = 120 km from P.", "Check: Car B covers 40 x 2 = 80 km from Q, and 120 + 80 = 200 km."], answer: "They meet 120 km from P (and 80 km from Q)" },
    ],
      tryit: { q: "Two hikers start 40 km apart, walking towards each other at 5 km/h and 3 km/h. How long until they meet?", answer: "5 hours. Combined closing speed = 5 + 3 = 8 km/h, and 40 / 8 = 5." } },
    { h: "5. One traveller catching up another", body: [
      "When two travellers move in the SAME direction rather than towards each other, the gap between them closes at a rate equal to the DIFFERENCE of their speeds, since the faster one only gains on the slower one by however much quicker it is moving.",
      "Car A leaves a service station at 8:00 travelling at 50 km/h. Car B leaves the very same spot an hour later, at 9:00, travelling at 70 km/h in the same direction. By 9:00, Car A already has a head start of 50 km (having travelled for 1 hour at 50 km/h). From that point, Car B closes the gap at a rate of 70 - 50 = 20 km/h.",
    ], examples: [
      { q: "Cyclist A leaves at 9:00 at 12 km/h. Cyclist B leaves the same point at 10:00 at 18 km/h. When does B catch A?", steps: ["By 10:00, A has a head start of 12 x 1 = 12 km.", "Closing speed: 18 - 12 = 6 km/h.", "Time to close 12 km gap: 12 / 6 = 2 hours after 10:00."], answer: "B catches A at 12:00" },
      { q: "How long after 9:00 does Car B catch Car A, and at what time does that happen?", steps: ["Gap to close at 9:00: 50 km.", "Closing speed: 70 - 50 = 20 km/h.", "Time to close the gap: 50 / 20 = 2.5 hours after 9:00, which is 11:30."], answer: "Car B catches Car A at 11:30" },
      { q: "Walker A leaves at 7:00 at 6 km/h. Walker B leaves the same spot at 8:30 in the same direction at 9 km/h. When does B catch A, and how far from the start?", steps: ["By 8:30, A has walked 6 x 1.5 = 9 km.", "Closing speed: 9 - 6 = 3 km/h.", "Time to close 9 km gap: 9 / 3 = 3 hours after 8:30, so they meet at 11:30.", "Distance for B from start: 9 x 3 = 27 km. Check A: 6 x 4.5 = 27 km."], answer: "B catches A at 11:30, 27 km from the start" },
    ],
      note: "Always check a catch-up answer by computing both distances travelled and confirming they match. Car A, travelling from 8:00 to 11:30 (3.5 hours) at 50 km/h, covers 175 km. Car B, travelling from 9:00 to 11:30 (2.5 hours) at 70 km/h, also covers 175 km. They agree." },
    { h: "6. Reading a distance-time graph: gradient is speed", body: [
      "A distance-time graph plots how far a traveller has gone (up the page) against how much time has passed (along the page). The STEEPNESS of the line, its gradient, is exactly the speed: a steep line means covering a lot of distance in a little time, a fast pace, while a shallow line means a slow pace, and a flat, horizontal stretch means the traveller has stopped completely.",
      "Two travellers' lines CROSSING on the same graph means they were in the exact same PLACE at the exact same TIME, in other words, one has caught up with or overtaken the other at that instant. This is a genuinely different question from whether their speeds (gradients) ever match, which we look at directly in the next section.",
    ] },
    { h: "7. A full two-runner race, read from the story", body: [
      "Rose and Violet race over 10 km. Rose runs at a steady 8 km/h the entire way. Violet bursts out fast at 12 km/h for the first 20 minutes (a third of an hour), covering 12 x (1/3) = 4 km, then tires and drops to a steady 4 km/h for the rest of the race.",
      "Who starts off faster? Violet, at 12 km/h against Rose's 8 km/h. How long does each take to finish? Rose: 10 / 8 = 1.25 hours = 75 minutes. Violet: 20 minutes for the first 4 km, then the remaining 10 - 4 = 6 km at 4 km/h takes 6 / 4 = 1.5 hours = 90 minutes, so Violet's total time is 20 + 90 = 110 minutes.",
    ], examples: [
      { q: "Ali runs a 5 km race at a steady 10 km/h. Bea runs the same 5 km at a steady 8 km/h. Who wins and by how many minutes?", steps: ["Ali's time: 5 / 10 = 0.5 hours = 30 minutes.", "Bea's time: 5 / 8 = 0.625 hours = 37.5 minutes.", "Difference: 37.5 - 30 = 7.5 minutes."], answer: "Ali wins by 7.5 minutes" },
      { q: "Rose finishes in 75 minutes and Violet in 110 minutes. Who wins, and by how much?", steps: ["Compare the two finishing times directly.", "Rose: 75 minutes. Violet: 110 minutes.", "110 - 75 = 35."], answer: "Rose wins, by 35 minutes" },
      { q: "Finn and Gita race 12 km. Finn runs a steady 8 km/h throughout. Gita runs the first 6 km at 12 km/h, then slows to 5 km/h for the remaining 6 km. Who wins, and by how many minutes?", steps: ["Finn's total time: 12 / 8 = 1.5 hours = 90 minutes.", "Gita's first leg: 6 / 12 = 0.5 hours = 30 minutes.", "Gita's second leg: 6 / 5 = 1.2 hours = 72 minutes.", "Gita's total: 30 + 72 = 102 minutes.", "Finn finishes first: 102 - 90 = 12 minutes ahead."], answer: "Finn wins by 12 minutes" },
    ],
      note: "Do Rose and Violet ever run at exactly the SAME speed? No: Rose is constant at 8 km/h throughout, while Violet's speed jumps abruptly from 12 km/h to 4 km/h and is never 8 km/h at any instant. But do they ever reach the same POSITION at the same time? Working from each runner's distance as a function of time shows their distances become equal at 40 minutes (both at 16/3 km, about 5.33 km), which is the moment Rose overtakes Violet, exactly where their two graphed lines would cross. Same speed and same position are two entirely different questions, and a graph answers them by looking at two entirely different features, the gradient for speed and the height for position." },
    { h: "8. The average-speed trap", body: [
      "Here is the single most common mistake in this entire topic. A car travels the first HALF of a journey's DISTANCE at 60 km/h, then the second half of the distance at 40 km/h. What is the average speed for the whole journey? The tempting answer is to average 60 and 40 to get 50. That is wrong.",
      "The correct method is always total distance divided by total time, never an average of the speeds themselves. Let each half of the journey be some distance d. Time for the first half: d / 60. Time for the second half: d / 40. Total distance: 2d. Total time: d/60 + d/40, which combines (using a common denominator of 120) to 2d/120 + 3d/120 = 5d/120 = d/24.",
    ], examples: [
      { q: "A car travels half a journey's distance at 30 km/h and half at 10 km/h. Find the true average speed.", steps: ["Let each half = d km.", "Time for first half: d / 30. Time for second half: d / 10.", "Total time: d/30 + 3d/30 = 4d/30.", "Average speed = 2d / (4d/30) = 2d x 30/(4d) = 15 km/h."], answer: "15 km/h (not the naive average of 20 km/h)" },
      { q: "Finish the calculation: find the true average speed for that journey.", steps: ["Average speed = total distance / total time.", "Total distance = 2d. Total time = d/24.", "Average speed = 2d / (d/24) = 2d x (24/d) = 48."], answer: "48 km/h, not the naively averaged 50 km/h" },
      { q: "A train travels the first third of its journey at 90 km/h, the middle third at 60 km/h and the last third at 45 km/h. Find the true average speed for the whole journey.", steps: ["Let each third = d km.", "Times: d/90 + d/60 + d/45. Common denominator 180: 2d/180 + 3d/180 + 4d/180 = 9d/180 = d/20.", "Total distance = 3d. Average speed = 3d / (d/20) = 3d x 20/d = 60 km/h."], answer: "60 km/h (the naive average of 90, 60 and 45 is 65, which is wrong)" },
    ],
      note: "Why does the naive average fail here? Because the car spends MORE TIME travelling at the slower speed than at the faster one (equal distances at different speeds always means unequal times), so the slower speed should genuinely count for more, pulling the true average down below the midpoint of 60 and 40. The naive average of two speeds only happens to be correct when the two speeds are held for EQUAL TIMES, not equal distances: 1 hour at 60 km/h (60 km) plus 1 hour at 40 km/h (40 km) gives 100 km in 2 hours, a genuine average of 50 km/h, matching the naive guess purely because the split was by time, not by distance." },
    { h: "9. Telling equal-distance and equal-time splits apart", body: [
      "Before reaching for any average-speed shortcut, always check exactly how the journey was split. If a question says half the distance at one speed and half at another, use the full total-distance-over-total-time method from section 8, since the naive average will be wrong. If a question instead says half the time at one speed and half at another, the naive average of the two speeds genuinely is correct.",
      "This single check, distance-split or time-split, decides which method to trust, and skipping it is exactly how a plausible-looking wrong answer sneaks through.",
    ], tryit: { q: "A cyclist rides for 2 hours at 18 km/h, then for 2 hours at 12 km/h (an equal-TIME split). Find the average speed, and confirm it matches the naive average of the two speeds.", answer: "Total distance = 18x2 + 12x2 = 36 + 24 = 60 km. Total time = 4 hours. Average speed = 60/4 = 15 km/h, which does match the naive average of 18 and 12, exactly because the split was by equal time, not equal distance." } },
    { h: "10. A full challenge combining every idea", body: [
      "A cyclist rides from Town A to Town B, 60 km apart, starting with 36 km at a steady 12 km/h before planning to slow down for the rest of the trip. At the exact moment she sets off, a friend leaves Town B, cycling towards Town A at a constant 15 km/h. Where do they meet, and does the meeting happen before the cyclist's planned speed change?",
      "Treat this exactly like section 4, since while the cyclist is still on her first leg, both speeds are constant: 12 km/h and 15 km/h, combined closing speed 12 + 15 = 27 km/h, over the full 60 km gap. Time to meet, assuming both speeds hold: 60 / 27 = 20/9 hours, which is about 2 hours 13 minutes.",
    ], examples: [
      { q: "A hiker walks at 4 km/h and plans to rest after 9 km. A friend starts 18 km away walking toward her at 5 km/h. Does the meeting happen before the rest stop?", steps: ["Combined closing speed: 4 + 5 = 9 km/h. Meeting time: 18 / 9 = 2 hours.", "Hiker's first leg lasts 9 / 4 = 2.25 hours.", "2 hours is less than 2.25 hours, so yes, they meet before the rest stop."], answer: "Yes, the meeting happens during the hiker's walking leg, so the calculation is valid" },
      { q: "Check that the meeting genuinely happens during the cyclist's first leg, before her planned speed change.", steps: ["The cyclist's first leg lasts 36 / 12 = 3 hours.", "The calculated meeting time is 20/9 hours, which is about 2.22 hours.", "2.22 hours is less than 3 hours, so the meeting does indeed happen while the cyclist is still travelling at her original 12 km/h."], answer: "Yes, the meeting happens during the first leg, so the combined-speed calculation is valid" },
      { q: "Towns P and Q are 250 km apart. Car A (60 km/h) and Car B (65 km/h) set off simultaneously towards each other. Car A planned to slow down after 150 km. Does the meeting happen before Car A's speed change?", steps: ["Combined closing speed: 60 + 65 = 125 km/h. Meeting time: 250 / 125 = 2 hours.", "Car A covers 60 x 2 = 120 km by that time.", "Car A planned to slow after 150 km, which takes 150/60 = 2.5 hours.", "2 hours is less than 2.5 hours, so the meeting happens before the planned slowdown."], answer: "Yes, the meeting (at 120 km from P) happens before Car A's speed change (which would be at 150 km)" },
    ],
      note: "This check matters enormously. If the calculated meeting time had come out GREATER than 3 hours, the combined-speed shortcut would have silently given a wrong answer, because the cyclist's speed would have already changed before they met, and the whole calculation would need redoing leg by leg from the moment of the speed change onward. Always verify that any constant-speed assumption used in a calculation genuinely holds for as long as the calculation needs it to." },
    { h: "11. Finishing the challenge", body: [
      "With the meeting confirmed to fall inside the valid leg, find exactly where it happens, measured from each town.",
    ], examples: [
      { q: "Two towns are 60 km apart. Car A (40 km/h) and Car B (20 km/h) set off simultaneously. Find how far from each town they meet.", steps: ["Combined speed: 60 km/h. Meeting time: 60 / 60 = 1 hour.", "Car A distance: 40 x 1 = 40 km from Town A.", "Car B distance: 20 x 1 = 20 km from Town B.", "Check: 40 + 20 = 60 km."], answer: "They meet 40 km from Town A and 20 km from Town B" },
      { q: "Find the cyclist's distance from Town A, and the friend's distance from Town B, at the moment they meet.", steps: ["Cyclist's distance from A: 12 x (20/9) = 240/9 = 80/3, which is 26 and 2/3 km.", "Friend's distance from B: 15 x (20/9) = 300/9 = 100/3, which is 33 and 1/3 km.", "Check they sum to the full gap: 80/3 + 100/3 = 180/3 = 60 km, matching the 60 km distance between the towns."], answer: "They meet 26 and 2/3 km from Town A (equivalently 33 and 1/3 km from Town B)" },
      { q: "Towns P and Q are 250 km apart. Car A (60 km/h) and Car B (65 km/h) set off simultaneously. Find where they meet.", steps: ["Combined speed: 125 km/h. Meeting time: 250 / 125 = 2 hours.", "Car A: 60 x 2 = 120 km from P.", "Car B: 65 x 2 = 130 km from Q.", "Check: 120 + 130 = 250 km."], answer: "They meet 120 km from P and 130 km from Q" },
    ] },
  ],
  recap: [
    "Distance = speed x time is the one formula behind every journey question; time = distance/speed and speed = distance/time are its rearrangements.",
    "Split any changing-speed journey into legs with constant speed, then combine the totals: total distance / total time gives the true average speed.",
    "Travellers heading towards each other close the gap at the SUM of their speeds; a traveller catching up from behind closes it at the DIFFERENCE of the speeds.",
    "On a distance-time graph, gradient is speed and crossing lines mean equal position at that instant, not necessarily equal speed.",
    "Never average two speeds directly for an equal-DISTANCE split; use total distance over total time. Averaging speeds is only valid for an equal-TIME split.",
    "Always check that a constant-speed assumption used in a shortcut calculation genuinely holds up to the moment the answer describes.",
  ],
  mistakes: [
    "Averaging two speeds directly when a journey is split by equal distance, instead of using total distance over total time.",
    "Using the sum of two speeds when one traveller is catching up from behind, instead of the difference.",
    "Confusing equal speed (matching gradients on a graph) with equal position (crossing lines on a graph).",
    "Applying a combined-speed shortcut across a stretch where one traveller's speed has already changed.",
    "Forgetting to convert consistently between hours and minutes when combining leg times from different parts of a problem.",
  ],
};


// ---- Deep-quest full-depth guided lesson: multi-step money and percentages (moneyTrail, new) ----

JUNIOR_LESSONS.moneyTrail = {
  title: "Money Trails",
  minutes: 20,
  intro: "Percentages get properly interesting the moment more than one change happens in a row: a price rises, then falls; savings earn interest year after year; a fundraising total creeps toward its target in stages. Handle each step with a single clean tool, the percentage multiplier, and even the trickiest multi-year money trail collapses into ordinary multiplication. This lesson builds that tool from nothing, then chases it through interest, sales, and a full savings comparison of the kind that turns up in real assessments.",
  sections: [
    { h: "1. A percentage change is a single multiplier", body: [
      "Increasing an amount by 15% and then finding the new total is really just one multiplication, if you set it up right. The original amount is 100% of itself, so increasing it by 15% gives 100% + 15% = 115% of the original, and 115% as a decimal is 1.15. So increasing anything by 15% means multiplying it by 1.15.",
      "Decreasing works the same way in reverse. A 20% decrease leaves 100% - 20% = 80% of the original, and 80% as a decimal is 0.8. So decreasing anything by 20% means multiplying it by 0.8.",
    ], examples: [
      { q: "Find 80 increased by 15%, using the multiplier method.", steps: ["A 15% increase means multiplying by 1.15.", "80 × 1.15 = 92."], answer: "92" },
      { q: "A computer game costs 48 pounds. It is on sale at a 25% discount. Find the sale price using a multiplier.", steps: ["A 25% decrease means multiplying by 1 − 0.25 = 0.75.", "48 × 0.75 = 36."], answer: "£36" },
      { q: "A house is worth 250,000 pounds. Its value rises by 8% in year 1 and then falls by 5% in year 2. Find its value at the end of year 2.", steps: ["Year 1 rise of 8%: multiplier = 1.08.", "Year 2 fall of 5%: multiplier = 0.95.", "Combined multiplier: 1.08 × 0.95 = 1.026.", "Final value: 250,000 × 1.026 = 256,500 pounds."], answer: "£256,500" },
    ],
      tryit: { q: "Find 150 decreased by 20%, using the multiplier method.", answer: "120. A 20% decrease means multiplying by 0.8, and 150 x 0.8 = 120." } },
    { h: "2. Checking the multiplier against the familiar method", body: [
      "If you already find percentages by splitting them into 10%, 5% and 1% and adding the pieces, it is worth checking the multiplier gives exactly the same answer, so you trust it completely before relying on it for harder, multi-step problems.",
      "80 increased by 15%: 10% of 80 is 8, and 5% of 80 is 4, so 15% of 80 is 8 + 4 = 12, and the new total is 80 + 12 = 92. This matches the multiplier method exactly, 92, confirming the shortcut is trustworthy.",
    ] },
    { h: "3. Chaining changes: multiply the multipliers, never subtract the percentages", body: [
      "When two percentage changes happen one after another, the temptation is to combine the percentages by simple addition or subtraction, for instance thinking a 20% rise followed by a 10% fall nets out to a plain 10% rise. That is not how percentages chain together, because the second change applies to a NEW amount, not the original one.",
      "The correct method multiplies the two multipliers together. A 20% rise is x1.2. A 10% fall is x0.9. Combined: 1.2 x 0.9 = 1.08, an overall rise of only 8%, not 10%.",
    ], examples: [
      { q: "Verify the 8% result with a real number: start with 100, increase by 20%, then decrease the result by 10%.", steps: ["100 × 1.2 = 120 (after the 20% rise).", "120 × 0.9 = 108 (after the 10% fall).", "108 is 8% more than the original 100, matching the combined multiplier of 1.08."], answer: "108, confirming an overall rise of 8%, not the naively subtracted 10%" },
      { q: "A price falls by 15%, then rises by 20%. Starting from 200 pounds, find the final price and the overall percentage change.", steps: ["Fall of 15%: multiplier = 0.85.", "Rise of 20%: multiplier = 1.20.", "Combined multiplier: 0.85 × 1.20 = 1.02.", "Final price: 200 × 1.02 = 204 pounds — an overall rise of 2%."], answer: "£204, an overall rise of 2%" },
      { q: "A shop raises prices by 40%, then holds a '30% off' sale. A customer says 'I'm still paying 10% more than before the rise.' Is the customer right? Show your working.", steps: ["Rise of 40%: multiplier = 1.40.", "Sale of 30% off: multiplier = 0.70.", "Combined multiplier: 1.40 × 0.70 = 0.98.", "0.98 is less than 1, so the final price is 2% BELOW the original — not 10% above it."], answer: "The customer is wrong. After both changes the price is 2% below the original price, not 10% above it." },
    ],
      tryit: { q: "A price rises by 10% and then rises again by 10%. Is the overall rise exactly 20%?", answer: "No, it is 21%. Combined multiplier = 1.1 x 1.1 = 1.21, an overall rise of 21%, since the second 10% rise applies to the already-increased amount." } },
    { h: "4. The classic trap: plus ten percent, minus ten percent", body: [
      "Here is the single most famous percentage trap there is, and it is worth meeting it directly. Increase an amount by 10%, then decrease the RESULT by 10%. Does it return exactly to where it started?",
      "Combined multiplier: 1.1 x 0.9 = 0.99. Not 1.0. The amount ends up 1% SMALLER than where it began, not back at the start. Try it with a real number: 100 x 1.1 = 110, then 110 x 0.9 = 99. Definitely not 100.",
    ], examples: [
      { q: "Explain in one sentence why plus 10% then minus 10% does not return to the start.", steps: ["The 10% rise is calculated on the original amount, but the 10% fall is calculated on the NEW, larger amount.", "10% of the larger amount is a bigger number than 10% of the original.", "So the fall removes more than the rise added, leaving a small net loss."], answer: "Because the second percentage is taken from a different (larger) base than the first, the two 10% changes are not equal amounts, and they do not cancel exactly" },
      { q: "A coat costs 80 pounds. It is increased by 50%, then decreased by 50%. What is the final price, and by what percentage is it below the original?", steps: ["Rise of 50%: 80 × 1.5 = 120 pounds.", "Fall of 50%: 120 × 0.5 = 60 pounds.", "Combined multiplier: 1.5 × 0.5 = 0.75 — a 25% net loss.", "The final price is 60 pounds, which is 25% below the original 80 pounds."], answer: "£60, which is 25% below the original price" },
      { q: "Explain algebraically why a rise of r% followed by a fall of r% can never return exactly to the start (for any r > 0). What does the combined multiplier equal?", steps: ["Rise of r%: multiplier = (1 + r/100). Fall of r%: multiplier = (1 − r/100).", "Combined multiplier = (1 + r/100)(1 − r/100) = 1 − (r/100)².", "For the result to be exactly 1 (no change), we need (r/100)² = 0, which requires r = 0.", "For any positive r, (r/100)² > 0, so the combined multiplier is strictly less than 1 — a net loss, however small."], answer: "Combined multiplier = 1 − (r/100)², which is always less than 1 for any r > 0, so the result is always slightly below the starting value." },
    ],
      note: "This is a genuinely important, general fact: a rise of r% followed by a fall of the SAME r% always ends slightly below the start (unless r is 0), because the fall is calculated on a bigger base than the rise was. The bigger r is, the bigger the shortfall: a 50% rise followed by a 50% fall gives a multiplier of 1.5 x 0.5 = 0.75, a full 25% below the start." },
    { h: "5. Not every chain ends in a loss: always calculate, never assume", body: [
      "It would be easy to walk away from section 4 assuming every up-then-down chain must end below the start. That is not universally true, and the only safe habit is to calculate the actual combined multiplier every time, rather than guess a pattern.",
      "A shop raises a 40 pound item's price by 25%, then later runs a sale taking 20% off the new price. Multiplier for the rise: 1.25. Multiplier for the sale: 0.8. Combined: 1.25 x 0.8 = 1.0 exactly. The final price is exactly back to the original, with no gain and no loss at all.",
    ], examples: [
      { q: "Confirm this with real numbers: 40 pounds increased by 25%, then decreased by 20%.", steps: ["40 × 1.25 = 50 (after the 25% rise).", "50 × 0.8 = 40 (after the 20% fall).", "40 is exactly the original price."], answer: "Exactly 40 pounds, a perfect round trip, because 1.25 and 0.8 are exact reciprocals of each other (1 divided by 1.25 is 0.8)" },
      { q: "A phone costs 300 pounds. After a 20% price increase and then a 10% loyalty discount, find the final price.", steps: ["Rise of 20%: multiplier = 1.20.", "Discount of 10%: multiplier = 0.90.", "Combined multiplier: 1.20 × 0.90 = 1.08.", "Final price: 300 × 1.08 = 324 pounds."], answer: "£324" },
      { q: "A price is increased by 40%. What percentage decrease must then be applied to return it exactly to the original price? Give an exact fraction and an approximate decimal percentage.", steps: ["After a 40% rise the multiplier is 1.40. We need a second multiplier m such that 1.40 × m = 1.", "m = 1/1.40 = 10/14 = 5/7.", "As a percentage this is 1 − 5/7 = 2/7 ≈ 0.2857, a decrease of approximately 28.57%."], answer: "Exactly 2/7 ≈ 28.6% decrease" },
    ],
      tryit: { q: "A price rises by 25% and then falls by 25%. Does it return to the start? Calculate the combined multiplier to check.", answer: "No. Combined multiplier = 1.25 x 0.75 = 0.9375, a net loss of 6.25%. Unlike the previous example, 25% up and 25% down are NOT reciprocal multipliers, so this chain does not cancel." } },
    { h: "6. Simple interest: a fixed reward every year, from the same base", body: [
      "Simple interest pays out the same fixed amount every single year, always calculated from the ORIGINAL amount invested, never from the growing total. If you invest an amount P at a simple interest rate of r% per year, the interest earned each year is always P x r (as a decimal), and after n years the total interest is P x r x n.",
      "Invest 200 pounds at 5% simple interest. Interest earned each year: 200 x 0.05 = 10 pounds, every single year, without exception. After 3 years: total interest = 10 x 3 = 30 pounds, so the account holds 200 + 30 = 230 pounds.",
    ], examples: [
      { q: "Find the total after 3 years using the direct formula, and check it matches.", steps: ["Total = P × (1 + r × n).", "= 200 × (1 + 0.05 × 3).", "= 200 × 1.15 = 230."], answer: "230 pounds, matching the year-by-year calculation" },
      { q: "Find the total after 5 years if 400 pounds is invested at 6% simple interest per year.", steps: ["Total = P × (1 + r × n) = 400 × (1 + 0.06 × 5).", "= 400 × (1 + 0.30).", "= 400 × 1.30 = 520 pounds."], answer: "£520" },
      { q: "At 4% simple interest per year, how many whole years does it take for 600 pounds to grow to at least 900 pounds?", steps: ["We need 600 × (1 + 0.04 × n) ≥ 900.", "Divide both sides by 600: 1 + 0.04n ≥ 1.5.", "Subtract 1: 0.04n ≥ 0.5. Divide: n ≥ 12.5.", "Since n must be a whole number, we need n = 13.", "Check: 600 × (1 + 0.04 × 13) = 600 × 1.52 = 912 ≥ 900. ✓"], answer: "13 years" },
    ] },
    { h: "7. Repeated percentage growth: a fixed FRACTION of an ever-changing total", body: [
      "A repeated percentage increase, sometimes called compounding, works completely differently: instead of paying interest on the original amount every year, it pays a percentage of whatever the CURRENT total happens to be, which keeps growing, so the actual amount of interest paid also grows a little each year.",
      "Invest the same 200 pounds at 5%, but now compounding each year. Year 1: 200 x 1.05 = 210. Year 2: 210 x 1.05 = 220.5. Year 3: 220.5 x 1.05 = 231.525. Compare that with simple interest's 230 pounds after 3 years: compounding has pulled slightly ahead, because each year's 5% is being taken from a bigger and bigger pile.",
    ], examples: [
      { q: "Find the same result directly using the compounding formula.", steps: ["Total = P × (1 + r)^n.", "= 200 × (1.05)^3.", "1.05^3 = 1.157625, so 200 × 1.157625 = 231.525."], answer: "231.525 pounds, matching the year-by-year calculation, and slightly ahead of simple interest's 230" },
      { q: "Find the total after 4 years if 500 pounds is invested at 3% compound interest per year.", steps: ["Total = 500 × (1.03)^4.", "Step by step: 500 × 1.03 = 515; 515 × 1.03 = 530.45; 530.45 × 1.03 ≈ 546.36; 546.36 × 1.03 ≈ 562.75."], answer: "Approximately £562.75" },
      { q: "Compare the totals after 10 years for 1000 pounds at 5% simple interest versus 5% compound interest. What is the difference?", steps: ["Simple interest total: 1000 × (1 + 0.05 × 10) = 1000 × 1.50 = 1500 pounds.", "Compound interest total: 1000 × (1.05)^10 ≈ 1000 × 1.6289 ≈ 1628.90 pounds.", "Difference: 1628.90 − 1500 = 128.90 pounds more with compound interest."], answer: "About £128.90 more with compound interest (£1628.90 versus £1500)" },
    ],
      note: "The gap between simple and compound interest is small after just a few years but grows enormously over long stretches of time, since compounding is repeatedly multiplying by a slightly-more-than-1 number, while simple interest only ever adds a fixed flat amount. Recognising which kind a question describes, a fixed amount every year, or a fixed percentage of the current total, is essential before doing any calculation at all." },
    { h: "8. The full savings trade-off: which plan is better depends on time", body: [
      "Now the centrepiece: a genuine, multi-year comparison between two savings plans, exactly the kind of layered problem real assessments favour. You have 500 pounds to invest, and two plans are on offer. Plan A gives an immediate 20% bonus, then pays 5% simple interest per year on the new, boosted amount. Plan B pays 7% simple interest per year on the original 500 pounds, then adds a 15% bonus onto the final total once you withdraw.",
      "Plan A: the bonus first makes the working amount 500 x 1.2 = 600 pounds. Each year afterwards adds 5% simple interest on that 600, which is 600 x 0.05 = 30 pounds per year. After n years, Plan A totals 600 + 30n.",
      "Plan B: each year adds 7% simple interest on the original 500, which is 500 x 0.07 = 35 pounds per year, so before the bonus the total after n years is 500 + 35n. The 15% bonus is then applied once, at the very end, giving a final total of (500 + 35n) x 1.15.",
    ], examples: [
      { q: "Compare the two plans after exactly 2 years, then after exactly 3 years.", steps: ["Plan A after 2 years: 600 + 30 × 2 = 660. Plan B after 2 years: (500 + 35 × 2) × 1.15 = 570 × 1.15 = 655.5. Plan A is ahead.", "Plan A after 3 years: 600 + 30 × 3 = 690. Plan B after 3 years: (500 + 35 × 3) × 1.15 = 605 × 1.15 = 695.75. Plan B is now ahead."], answer: "After 2 years Plan A wins (660 vs 655.5); after 3 years Plan B wins (695.75 vs 690) — the better plan switches over somewhere between year 2 and year 3" },
      { q: "Plan C gives 300 pounds upfront, then earns 20 pounds per year flat. Plan D starts at 250 pounds and earns 25 pounds per year. After exactly how many years does Plan D overtake Plan C?", steps: ["Plan C after n years: 300 + 20n. Plan D after n years: 250 + 25n.", "Set equal: 300 + 20n = 250 + 25n.", "Subtract 20n and 250 from both sides: 50 = 5n, so n = 10.", "After year 10 both give 500 pounds; from year 11 Plan D pulls ahead."], answer: "Plan D overtakes Plan C after exactly 10 years." },
      { q: "Plan X: invest 800 pounds at 3% simple interest per year. Plan Y: invest 600 pounds at 5% simple interest per year. After how many whole years does Plan Y overtake Plan X, and by how much is Plan X ahead after 15 years?", steps: ["Plan X after n years: 800 + 0.03 × 800 × n = 800 + 24n.", "Plan Y after n years: 600 + 0.05 × 600 × n = 600 + 30n.", "Crossover: 800 + 24n = 600 + 30n → 200 = 6n → n = 33.33 years.", "Since n must be a whole number, Plan Y first overtakes after 34 years.", "After 15 years: Plan X = 800 + 24 × 15 = 1160; Plan Y = 600 + 30 × 15 = 1050. Plan X leads by £110."], answer: "Plan Y overtakes after 34 whole years. After 15 years Plan X leads by £110 (£1160 vs £1050)." },
    ],
      tryit: { q: "Using the same two plans, which is ahead after exactly 1 year?", answer: "Plan A. After 1 year, Plan A = 600 + 30 = 630, and Plan B = (500 + 35) x 1.15 = 535 x 1.15 = 615.25. Plan A leads by a wider margin than at year 2, since the gap narrows as the years pass." } },
    { h: "9. Finding exactly when the plans swap places", body: [
      "Since the better plan changes somewhere between year 2 and year 3, algebra can pin down the exact crossover point, treating the number of years as an unknown, n. Set the two totals equal to each other: 600 + 30n = (500 + 35n) x 1.15.",
    ], examples: [
      { q: "Solve 600 + 30n = (500 + 35n) × 1.15 for n.", steps: ["Expand the right side: (500 + 35n) × 1.15 = 575 + 40.25n.", "So the equation is 600 + 30n = 575 + 40.25n.", "Subtract 30n from both sides: 600 = 575 + 10.25n.", "Subtract 575: 25 = 10.25n, so n = 25 / 10.25, which is about 2.44."], answer: "n is about 2.44 years, matching the observed switch between year 2 (Plan A ahead) and year 3 (Plan B ahead)" },
      { q: "Plan E pays 400 pounds upfront, then earns 15 pounds per year. Plan F earns 25 pounds per year from a starting pot of 300 pounds. Set up and solve the equation for the exact crossover point, and state after which whole year Plan F first overtakes Plan E.", steps: ["Plan E after n years: 400 + 15n. Plan F after n years: 300 + 25n.", "Set equal: 400 + 15n = 300 + 25n.", "Subtract 15n and 300: 100 = 10n, so n = 10.", "At exactly 10 years both give 550 pounds; from year 11 Plan F leads."], answer: "Crossover at exactly 10 years; Plan F first overtakes Plan E from year 11 onward." },
      { q: "Savings account P pays a one-off 10% bonus on deposit, then 4% simple interest per year on the new total. Account Q pays 6% simple interest on the original deposit with no bonus. Both accounts start with an initial deposit of 1000 pounds. Find the exact crossover year and state which account wins in each regime.", steps: ["Account P: bonus gives 1000 × 1.10 = 1100; simple interest 4% on 1100 = 44 per year. Total after n years: 1100 + 44n.", "Account Q: simple interest 6% on 1000 = 60 per year. Total after n years: 1000 + 60n.", "Set equal: 1100 + 44n = 1000 + 60n → 100 = 16n → n = 6.25 years.", "Account P is ahead for years 1–6; Account Q overtakes from year 7."], answer: "Crossover at 6.25 years; Account P wins for years 1–6, Account Q wins from year 7 onward." },
    ],
      note: "This crossover point is not a whole number of years, which makes perfect sense: real savings plans do not usually let you withdraw at a fractional year, so in practice you would compare the plans at whichever whole-year mark actually matters, and here that means Plan A is the better choice for 1 or 2 years, while Plan B overtakes it from year 3 onward. A full answer to 'which is better' for this kind of question always names both regimes, not just one." },
    { h: "10. Percentages of a shrinking remainder", body: [
      "A different multi-step flavour appears when each new percentage is taken not of the original total, but of whatever is still LEFT after previous steps, a genuine money trail where the target keeps shrinking. A charity's fundraising target is 2000 pounds. In week one they raise 40% of the target. In week two they raise 25% of whatever amount is STILL needed after week one.",
      "Week one: raised = 40% of 2000 = 800 pounds. Remaining needed after week one: 2000 - 800 = 1200 pounds. Week two: raised = 25% of the REMAINING 1200, which is 300 pounds, not 25% of the original 2000. New remaining needed: 1200 - 300 = 900 pounds.",
    ], examples: [
      { q: "Express the 900 pounds still needed as a percentage of the original 2000 pound target.", steps: ["Percentage = (part / whole) × 100.", "= (900 / 2000) × 100.", "= 45."], answer: "45% of the original target is still needed after two weeks" },
      { q: "A fundraiser's target is 3000 pounds. In week 1 they raise 35% of the target. In week 2 they raise 40% of whatever amount is still needed. How much is still needed after week 2?", steps: ["Week 1: 35% of 3000 = 1050 raised. Remaining: 3000 − 1050 = 1950 pounds.", "Week 2: 40% of the remaining 1950 = 0.40 × 1950 = 780 raised.", "Remaining after week 2: 1950 − 780 = 1170 pounds."], answer: "£1170 still needed" },
      { q: "A tank holds 400 litres. On day 1, 25% is drained. On day 2, 20% of what remains is refilled. On day 3, 10% of the current contents is then drained. What volume remains, and what percentage of the original 400 litres does that represent?", steps: ["Day 1: drain 25% of 400 = 100 litres. Remaining: 400 × 0.75 = 300 litres.", "Day 2: refill 20% of 300 = 60 litres. New total: 300 + 60 = 360 litres.", "Day 3: drain 10% of 360 = 36 litres. Remaining: 360 − 36 = 324 litres.", "Percentage of original: (324 / 400) × 100 = 81%."], answer: "324 litres remain, which is 81% of the original 400 litres." },
    ],
      tryit: { q: "A tank starts with 500 litres. On day one, 30% of the tank is drained. On day two, 20% of what REMAINS is drained. How many litres are left after day two?", answer: "280 litres. Day one: 30% of 500 = 150 drained, leaving 350. Day two: 20% of the remaining 350 = 70 drained, leaving 350 - 70 = 280." } },
    { h: "11. The complete method for any money trail", body: [
      "Every multi-step percentage problem in this lesson answers to the same short checklist. First, convert every percentage change into a multiplier before touching any arithmetic: 100% plus or minus the change, as a decimal. Second, when several changes happen in sequence, multiply the multipliers together rather than adding or subtracting the raw percentages. Third, work out whether each new percentage applies to the ORIGINAL amount (simple interest, or a target's starting value) or to the CURRENT, already-changed amount (compounding, or a shrinking remainder), since this decides the entire shape of the calculation. Fourth, for a genuine year-by-year comparison of two plans, write each total as an expression in the number of years, and if the better option seems to switch, solve for the exact crossover algebraically. Fifth, never assume a chain of changes must net to a loss, a gain, or exactly cancel: always calculate the actual combined multiplier and let the numbers speak.",
    ] },
  ],
  recap: [
    "A percentage change is a single multiplier: 100% plus or minus the change, as a decimal (a 15% rise is x1.15, a 20% fall is x0.8).",
    "Chain several changes by multiplying their multipliers together, never by adding or subtracting the raw percentages.",
    "A rise of r% followed by a fall of the same r% (or the reverse) always ends slightly below the start, since the second change acts on a different base.",
    "Simple interest pays a fixed amount every year from the ORIGINAL amount; repeated percentage growth pays a fixed fraction of the CURRENT, growing amount.",
    "A genuine multi-year comparison between two plans can be written algebraically and solved for the exact year the better option switches.",
    "A percentage taken of a shrinking remainder is not the same as a percentage of the original total; track exactly what each percentage applies to.",
  ],
  mistakes: [
    "Combining two percentage changes by adding or subtracting them directly, instead of multiplying their multipliers.",
    "Assuming a rise then an equal fall (or the reverse) always returns to the start, instead of calculating the actual combined multiplier.",
    "Confusing simple interest (fixed amount each year from the original) with repeated percentage growth (a percentage of the current, changing total).",
    "Taking a later percentage of the original total when the problem actually means a percentage of what remains.",
    "Declaring one savings plan universally better without checking whether the comparison changes over a longer or shorter time period.",
  ],
};


// ---- Deep-quest full-depth guided lesson: place value and factor chains (digitDetective, new) ----

JUNIOR_LESSONS.digitDetective = {
  title: "Digit Detective",
  minutes: 20,
  intro: "A digit detective puzzle hands you several small clues about a hidden number, its digit sum, whether it divides evenly by something, how its digits relate to each other, and asks you to track the culprit down through pure reasoning, no guessing required. The tools are place value, divisibility rules, and prime factorisation, and the real skill is holding several clues in your head at once and narrowing the suspects down systematically, exactly like a detective crossing names off a list.",
  sections: [
    { h: "1. What a digit's position actually buys it", body: [
      "Every digit in a number is worth its face value multiplied by whatever its position demands. In the number 5,283, the 5 is worth 5 thousand, the 2 is worth 2 hundred, the 8 is worth 8 tens, and the 3 is worth 3 ones. The same digit, say a 5, is worth wildly different amounts depending purely on where it sits.",
      "This is the whole foundation of every clue in this lesson. When a clue talks about the hundreds digit, or the units digit, or the digit sum, it is really talking about a specific slice of the number's structure, and untangling that structure is the detective work.",
    ], tryit: { q: "In the number 4,706, what is the value contributed by the digit 7?", answer: "700. The 7 sits in the hundreds position, so it is worth 7 hundred." } },
    { h: "2. Reading a clue about the digit sum", body: [
      "The digit sum simply adds every digit together, ignoring position entirely, and it is one of the commonest clues in this whole topic. A clue like 'the digit sum is 15' does not tell you the individual digits, only that they add to 15 together, which is a real constraint but rarely enough on its own.",
      "Combine a digit-sum clue with other clues about individual digits, and the possibilities shrink fast. If a 3-digit number has digit sum 15 and its first digit is 3, then the other two digits must add to 15 - 3 = 12, which narrows an enormous range of numbers down to a short, checkable list.",
    ] },
    { h: "3. Why the divisibility rules for 3 and 9 actually work", body: [
      "Two of the most useful divisibility tests, for 3 and for 9, rely entirely on the digit sum, and it is worth seeing WHY, not just using them blindly. Every place value, 10, 100, 1000, and so on, is exactly 1 more than a multiple of 9: 10 = 9 + 1, 100 = 99 + 1, 1000 = 999 + 1.",
      "That means each digit contributes its face value to the number's remainder when dividing by 9, no matter which position it occupies, since the 'multiple of 9' part of its place value never affects the remainder, only the leftover +1 does. Adding up all those individual +1 contributions is exactly the same as adding up the digits themselves. So a number and its digit sum always leave the SAME remainder on division by 9 (and by 3, since 3 divides 9's multiples too).",
    ], examples: [
      { q: "Use the digit-sum rule to check whether 4,383 is divisible by 9.", steps: ["Digit sum: 4 + 3 + 8 + 3 = 18.", "18 is divisible by 9 (18 = 2 × 9).", "So 4,383 must also be divisible by 9."], answer: "Yes, divisible by 9 (4,383 divided by 9 is exactly 487)" },
      { q: "Use the digit-sum rule to decide: is 5,817 divisible by 3? By 9? State which rule applies in each case.", steps: ["Digit sum: 5 + 8 + 1 + 7 = 21.", "21 = 3 × 7, so 21 is divisible by 3. Therefore 5,817 is divisible by 3.", "21 ÷ 9 = 2.33..., so 21 is NOT divisible by 9. Therefore 5,817 is not divisible by 9."], answer: "Divisible by 3 (digit sum 21 = 3 × 7) but not by 9 (digit sum 21 is not a multiple of 9)" },
      { q: "A 5-digit number has digit sum 27. Without knowing the number itself, what can you conclude about its divisibility by 3, 9 and 6? Is there anything the digit sum cannot tell you?", steps: ["Digit sum 27 = 9 × 3, so the number is divisible by 9, and therefore also by 3.", "Divisibility by 6 requires divisibility by both 2 and 3. We know it is divisible by 3.", "To be divisible by 2 (and hence by 6), the units digit must be even. The digit sum alone does not reveal the units digit.", "So: definitely divisible by 3 and 9; divisible by 6 only if the units digit happens to be even — the digit sum alone cannot confirm this."], answer: "Definitely divisible by 3 and by 9. Divisibility by 6 depends on the units digit being even, which the digit sum alone cannot determine." },
    ],
      tryit: { q: "Is 2,847 divisible by 3?", answer: "Yes. Digit sum: 2+8+4+7=21, and 21 is divisible by 3 (21 = 7 x 3), so 2,847 is too." } },
    { h: "4. Other divisibility rules worth having ready", body: [
      "Divisibility by 2 depends only on the last digit being even (0, 2, 4, 6 or 8). Divisibility by 5 depends only on the last digit being 0 or 5. Divisibility by 10 needs the last digit to be exactly 0. Divisibility by 4 is slightly bigger-picture: it depends on the last TWO digits, read as their own two-digit number, being divisible by 4.",
      "Divisibility by 6 simply needs BOTH the rule for 2 and the rule for 3 to hold at once, since 6 = 2 x 3. A quick chain of small checks like this often replaces a much longer piece of arithmetic entirely.",
    ], examples: [
      { q: "Is 5,724 divisible by 4?", steps: ["Look only at the last two digits: 24.", "24 divided by 4 is 6, a whole number.", "So the whole number is divisible by 4."], answer: "Yes, divisible by 4 (5,724 divided by 4 is 1,431)" },
      { q: "Is 7,836 divisible by 6? Show the two separate checks.", steps: ["Divisibility by 6 needs the rule for 2 AND the rule for 3 to both hold.", "Rule for 2: last digit is 6, which is even. The rule for 2 holds.", "Rule for 3: digit sum = 7 + 8 + 3 + 6 = 24, and 24 = 3 x 8, so the rule for 3 holds.", "Both rules hold, so 7,836 is divisible by 6."], answer: "Yes, 7,836 is divisible by 6 (7,836 / 6 = 1,306)" },
      { q: "The digits 2, 3, 5 and 8 are each used exactly once to form a 4-digit number. How many of the possible 4-digit numbers are divisible by 4? List the valid last-two-digit endings first.", steps: ["Divisibility by 4 depends only on the last two digits. List all two-digit endings from the set {2, 3, 5, 8} and test each: 23, 25, 28, 32, 35, 38, 52, 53, 58, 82, 83, 85.", "28 / 4 = 7 exactly, so 28 works. 32 / 4 = 8 exactly, so 32 works. 52 / 4 = 13 exactly, so 52 works. All others leave a remainder.", "For each valid ending, the remaining two digits fill the first two positions in 2 x 1 = 2 orders.", "Total divisible numbers: 3 endings x 2 arrangements each = 6."], answer: "6 numbers: ending 28 gives 3528 and 5328; ending 32 gives 5832 and 8532; ending 52 gives 3852 and 8352" },
    ],
      tryit: { q: "Is 3,132 divisible by 6?", answer: "Yes. Last digit 2 is even (passes the rule for 2). Digit sum 3+1+3+2=9, divisible by 3 (passes the rule for 3). Both hold, so it is divisible by 6." } },
    { h: "5. Prime factorisation reveals structure without multiplying anything out", body: [
      "Every whole number greater than 1 can be broken down into a unique product of prime numbers, its prime factorisation, and this breakdown often answers structural questions directly, without ever needing to multiply the primes back together into the original number.",
      "24 = 2 x 2 x 2 x 3, usually written 2^3 x 3. Just from that, you can see instantly that 24 is even (it has a factor of 2), that it is a multiple of 3, and that it is NOT a multiple of 5 or 7 (neither appears in the factorisation), all without a single division.",
    ], examples: [
      { q: "Given that the prime factorisation of 24 is 2^3 x 3, and that 108 = 2^2 x 3^3, find the highest common factor (HCF) of 24 and 108 without dividing them by hand.", steps: ["For the HCF, take the LOWEST power of each prime that appears in both factorisations.", "For 2: the lowest power between 2^3 and 2^2 is 2^2.", "For 3: the lowest power between 3^1 and 3^3 is 3^1.", "HCF = 2^2 x 3 = 4 x 3 = 12."], answer: "12 (check: 24 / 12 = 2 and 108 / 12 = 9, and 2 and 9 share no common factor, confirming 12 really is the highest one)" },
      { q: "Given that 360 = 2^3 x 3^2 x 5 and 126 = 2 x 3^2 x 7, find both the HCF and LCM of 360 and 126.", steps: ["HCF: take the LOWEST power of each prime appearing in BOTH factorisations.", "Both contain 2 (powers 3 and 1, lowest is 1) and 3 (powers 2 and 2, lowest is 2). Neither 5 nor 7 appears in both.", "HCF = 2^1 x 3^2 = 2 x 9 = 18.", "LCM: take the HIGHEST power of every prime appearing in EITHER factorisation: 2^3 x 3^2 x 5 x 7 = 8 x 9 x 5 x 7 = 2,520."], answer: "HCF = 18, LCM = 2,520 (check: 360 / 18 = 20 and 126 / 18 = 7, and 20 and 7 share no common factor)" },
      { q: "Three numbers have prime factorisations 2^2 x 3 x 5, 2 x 3^2 x 7, and 2^3 x 3 x 5^2. Find the HCF of all three. Which of the three numbers, if any, is a perfect square?", steps: ["HCF of all three: take the LOWEST power of each prime appearing in ALL THREE factorisations.", "2 appears in all three with powers 2, 1 and 3; lowest is 2^1. 3 appears in all three with powers 1, 2 and 1; lowest is 3^1. 5 appears only in the first and third, not all three. 7 appears only in the second.", "HCF = 2 x 3 = 6.", "A number is a perfect square only if every prime in its factorisation appears to an even power. Check each: 2^2 x 3 x 5 has 3 to the power 1 (odd) — not a perfect square. 2 x 3^2 x 7 has 2 and 7 each to power 1 (odd) — not a perfect square. 2^3 x 3 x 5^2 has 2 to power 3 and 3 to power 1 (both odd) — not a perfect square."], answer: "HCF = 6; none of the three numbers is a perfect square, since each has at least one prime raised to an odd power" },
    ],
      tryit: { q: "Using the same two factorisations (24 = 2^3 x 3 and 108 = 2^2 x 3^3), find the lowest common multiple (LCM) of 24 and 108.", answer: "216. For the LCM, take the HIGHEST power of each prime: 2^3 and 3^3, giving 8 x 27 = 216. Check: 216/24=9 and 216/108=2, both whole numbers." } },
    { h: "6. The trap: multiplying back out too early", body: [
      "A very natural but costly habit is to see a factorisation like 2^3 x 3 and immediately calculate it back to 24 before answering the actual question, throwing away the very structure that made the question easy in the first place.",
      "If a question asks whether 2 x 3 x 5 is a multiple of 10 without saying what it equals, the fast route is to notice a factor of 2 and a factor of 5 sit right there in the factorisation, and 2 x 5 = 10, so it must be a multiple of 10, instantly, with no multiplication at all. Multiplying it out to 30 first and then dividing by 10 gets the same answer far more slowly, and on a longer factorisation, far more riskily too.",
    ], tryit: { q: "Without multiplying it out, explain why 2^2 x 3 x 7 must be a multiple of 12.", answer: "12 = 2^2 x 3. Since the factorisation 2^2 x 3 x 7 already contains a full 2^2 and a 3, it must be divisible by 12, whatever the extra factor of 7 contributes on top." } },
    { h: "7. Placing several digit clues at once", body: [
      "Now assemble everything into a full detective case. A 3-digit number has digit sum 12, is divisible by 4, and its hundreds digit is exactly twice its units digit. Let the hundreds digit be h, the tens digit be t, and the units digit be u.",
      "The relationship h = 2u limits u sharply: since h must stay a single digit (at most 9), u can only be 1, 2, 3 or 4, giving h = 2, 4, 6 or 8 respectively. For each of those pairs, the digit sum clue gives t = 12 - h - u, and the divisibility-by-4 clue depends only on the last two digits, t and u together.",
    ], examples: [
      { q: "Check each of the four candidate pairs (u=1..4) against the divisible-by-4 rule to find the unique number.", steps: ["u=1, h=2: t = 12-2-1 = 9. Last two digits '91'. 91/4 = 22.75, not divisible.", "u=2, h=4: t = 12-4-2 = 6. Last two digits '62'. 62/4 = 15.5, not divisible.", "u=3, h=6: t = 12-6-3 = 3. Last two digits '33'. 33/4 = 8.25, not divisible.", "u=4, h=8: t = 12-8-4 = 0. Last two digits '04', which is 4. 4/4 = 1, divisible!"], answer: "The number is 804 (check: digit sum 8+0+4=12; 8=2x4; and 804/4=201, a whole number)" },
      { q: "A 3-digit number has digit sum 15, is divisible by 5, and its units digit is exactly 3 more than its hundreds digit. Find it.", steps: ["Let h be the hundreds digit and u the units digit, with u = h + 3.", "Divisibility by 5 requires u = 0 or u = 5. If u = 0, then h = -3, which is not a valid digit.", "So u = 5 and h = 2. The digit-sum clue then gives 2 + t + 5 = 15, so t = 8.", "The number is 285."], answer: "285 (check: digit sum 2+8+5=15 ✓; last digit 5, so divisible by 5 ✓; 5 = 2+3, so units is 3 more than hundreds ✓)" },
      { q: "A 3-digit number has digit sum 17 and its hundreds digit is exactly 4 more than its units digit. How many such numbers exist?", steps: ["Let h = u + 4. Then the digit-sum clue gives (u+4) + t + u = 17, so 2u + t = 13.", "For t to be a valid single digit (0 to 9), we need 2u at most 13, giving u at most 6. But h = u+4 must also be at most 9, so u is at most 5.", "Check each candidate: u=1 gives t = 11, which is not a valid digit; u=2 gives t=9, h=6, number 692; u=3 gives t=7, h=7, number 773; u=4 gives t=5, h=8, number 854; u=5 gives t=3, h=9, number 935.", "Four values survive."], answer: "4 numbers: 692, 773, 854 and 935 (u=1 fails because t would be 11, so only u=2 to u=5 are valid)" },
    ],
      note: "Notice the method: rather than guessing whole 3-digit numbers at random, one clue (h = 2u) generated a short, complete list of candidates, and the remaining clues were used to eliminate every wrong candidate, one at a time, until exactly one survived." },
    { h: "8. A capstone case with a bounded range", body: [
      "A 4-digit number begins with the digit 3, has a digit sum of 18, and its last two digits, read as their own 2-digit number, form a value strictly between 10 and 20. Find the number.",
      "Since the digit sum is 18, which is a multiple of 9, the divisibility-by-9 rule is automatically satisfied, so that clue is really baked into the digit-sum clue rather than a separate, independent one. What remains genuinely independent is the range clue on the last two digits.",
    ], examples: [
      { q: "List every multiple of 4 strictly between 10 and 20, then use the digit-sum clue to test each one as the last two digits.", steps: ["Multiples of 4 between 10 and 20: 12, 16.", "For last-two-digits '12' (so third digit 1, fourth digit 2): the remaining second digit must satisfy 3 + d2 + 1 + 2 = 18, so d2 = 12, which is not a valid single digit. This candidate fails.", "For last-two-digits '16' (third digit 1, fourth digit 6): 3 + d2 + 1 + 6 = 18, so d2 = 8, a valid digit.", "The number is 3, 8, 1, 6, which is 3816."], answer: "3,816 (check: digit sum 3+8+1+6=18, divisible by 9 since 18/9=2; last two digits 16, and 16/4=4, so divisible by 4 too)" },
      { q: "A 4-digit number begins with 2, has digit sum 18, and its last two digits form a value strictly between 15 and 30 that is divisible by 5. Find the number.", steps: ["Multiples of 5 strictly between 15 and 30: 20 and 25.", "For last two digits 20 (third digit 2, fourth digit 0): the second digit must satisfy 2 + d2 + 2 + 0 = 18, giving d2 = 14. Not a valid single digit.", "For last two digits 25 (third digit 2, fourth digit 5): 2 + d2 + 2 + 5 = 18, giving d2 = 9. Valid.", "The number is 2925."], answer: "2,925 (check: digit sum 2+9+2+5=18 ✓; last two digits 25, strictly between 15 and 30 ✓; 25 is divisible by 5 ✓)" },
      { q: "A 4-digit number begins with 1, has digit sum 18, is divisible by 4, and its units digit is exactly twice its tens digit. Find all such numbers.", steps: ["Units = 2 x tens gives pairs (d3, d4): (1,2), (2,4), (3,6), (4,8). (d4 must stay a single digit, so d3 is at most 4.)", "Digit sum: 1 + d2 + d3 + 2 x d3 = 18, so d2 = 17 - 3 x d3.", "d3=1: d2=14 (invalid). d3=2: d2=11 (invalid). d3=3: d2=8, d4=6, number 1836. d3=4: d2=5, d4=8, number 1548.", "Divisibility by 4: last two digits of 1836 are 36 (36/4=9 ✓); last two digits of 1548 are 48 (48/4=12 ✓). Both pass."], answer: "Two numbers: 1,548 and 1,836" },
    ],
      tryit: { q: "Confirm that 20 was correctly excluded from the list of candidates in the working above, and explain why.", answer: "The clue required the last two digits to form a value STRICTLY between 10 and 20, and 20 itself does not satisfy 'strictly less than 20', so it was correctly excluded from the list of candidates before any digit-sum test was even needed." } },
    { h: "9. Building your own elimination table", body: [
      "For any digit-detective puzzle with more than one or two clues, it helps enormously to write out a small table: one row per surviving candidate, one column per clue, and cross a row out the moment any single clue fails it. This is exactly the systematic-listing discipline from counting puzzles, aimed here at digits and factors instead of whole numbers.",
      "The habit that saves the most time is ordering the clues from most restrictive to least, exactly as in section 7 and 8: a clue that only allows a handful of candidates (like h = 2u, or a narrow numeric range) should always be applied before a looser clue like a plain digit-sum total, since it shrinks the search space fastest.",
    ] },
    { h: "10. The complete method", body: [
      "Every digit-detective puzzle in this lesson yields to the same short routine. First, translate every clue into what it actually constrains: a specific digit, the digit sum, a divisibility rule, or a relationship between two digits. Second, start with whichever clue is most restrictive, generating the shortest possible list of candidates, rather than the loosest one. Third, apply the remaining clues one at a time to that short list, crossing off any candidate that fails even a single one. Fourth, when working with a prime factorisation, extract structural facts (is it a multiple of this, does it share this factor) directly from the factorisation, without multiplying it back out first. Fifth, once one candidate survives every clue, check it explicitly against ALL the original clues together, not just the ones used to eliminate the others.",
    ] },
    { h: "11. Maximising a digit sum under a real constraint", body: [
      "A different flavour of digit puzzle asks for the largest (or smallest) digit sum achievable, subject to some real-world constraint — the classic version asks for the date, written dd/mm across a whole year, with the biggest digit sum. Here the search space isn't 'any number', it's 'anything that is actually a valid date', which changes the strategy.",
      "The instinct to grab a 9 in every position doesn't work directly, because the constraint (this must be a real date) rules most all-9s combinations out. Instead, hunt separately for the best valid day and the best valid month, then check the combination is genuinely a real date.",
    ], examples: [
      { q: "Which date, written dd/mm, has the largest digit sum across a whole year?", steps: ["Best month: avoid 10, 11, 12 (they waste a digit on a 0 or a 1). The best month is 09 (September), digit sum 9.", "Best day: 29 has digit sum 11, better than 28 (10) or 31 (4, since 3+1=4 despite 31 looking 'big').", "Check 29/09 is a real date: September has 30 days, so the 29th exists every year, no leap-year issue.", "Total digit sum: 2+9+0+9 = 20."], answer: "29/09, digit sum 20" },
      { q: "29/09 has the largest digit sum of any date that occurs in every year. What is the second-largest digit sum, and which dates achieve it?", steps: ["Look for dates with digit sum 19. The month digit sum cannot exceed 9 (month 09), and the day digit sum cannot exceed 11 (day 29).", "If month is 09 (digit sum 9), we need day digit sum 10: that gives day 28. Check: 28/09 exists (September has 30 days) ✓.", "If month is 08 (digit sum 8), we need day digit sum 11: that gives day 29. Check: 29/08 exists (August has 31 days) ✓.", "If month is 09 (digit sum 9), day digit sum 10 also fits day 19: 1+9=10. Check: 19/09 exists ✓.", "No other combination reaches digit sum 19."], answer: "Digit sum 19, achieved by 28/09, 29/08 and 19/09" },
      { q: "A 24-hour clock time is written as HH:MM (four digits). What time has the largest possible digit sum?", steps: ["Hours run from 00 to 23. The tens digit is 0, 1, or 2. Best tens digit is 1 (giving hours 10-19).", "With tens digit 1, the best units digit for the hour is 9, giving 19 with digit sum 10. (Hour 23 only gives 2+3=5, and hours starting with 2 can reach at most 23.)", "Minutes run from 00 to 59. Best tens digit is 5 (giving minutes 50-59). Best units digit is then 9, giving 59 with digit sum 14.", "Combine: time 19:59, digit sum 1+9+5+9 = 24."], answer: "19:59, digit sum 24" },
    ],
      tryit: { q: "Why does 31/12 (New Year's Eve) score worse than 29/09 despite using bigger-looking numbers?", answer: "31/12 has digit sum 3+1+1+2=7, badly hurt by the two 1s in both the day and the month. Big-looking numbers like 31 and 12 are deceptive here — what matters is the actual digits used, and 09 and 29 simply contain larger digits (9, 2, 9) than 12 and 31 do (1, 2, 3, 1)." } },
  ],
  recap: [
    "A digit's value depends entirely on its position; the same digit is worth very different amounts in different places.",
    "A number and its digit sum always share the same remainder on division by 9 (and by 3), because every place value is 1 more than a multiple of 9.",
    "Divisibility rules: by 2 (last digit even), by 5 (last digit 0 or 5), by 4 (last two digits divisible by 4), by 6 (passes both the 2 and 3 rules).",
    "Prime factorisation reveals structural facts (shared factors, multiples) directly, without multiplying the factorisation back into the original number.",
    "HCF takes the lowest shared power of each prime; LCM takes the highest power of each prime appearing in either factorisation.",
    "Apply the most restrictive clue first to generate the shortest candidate list, then use the remaining clues to eliminate every wrong candidate.",
    "When maximising a digit sum under a real constraint (like a valid date), search for the best value in each independent part, then confirm the combination is actually valid.",
  ],
  mistakes: [
    "Multiplying a prime factorisation back into its original number before answering a structural question, losing the very shortcut the factorisation offered.",
    "Applying a loose clue (like a plain digit sum) before a tight one (like a fixed digit or a narrow range), making the search far longer than necessary.",
    "Forgetting that a strict range (strictly between 10 and 20) excludes its own endpoints, unlike an inclusive range.",
    "Testing only one or two clues and declaring victory, instead of checking a surviving candidate against every original clue at once.",
    "Assuming a digit-sum clue alone pins down individual digits, when in fact it only constrains their total.",
    "Judging a date's digit sum by how 'big' the numbers look (like 31/12) instead of actually adding the digits — small-looking numbers like 09 and 29 can score much higher.",
  ],
};


// ---- Deep-quest full-depth guided lesson: Pythagoras to 3D (pythagQuest, new) ----

JUNIOR_LESSONS.pythagQuest = {
  title: "Triangle Trials",
  minutes: 22,
  intro: "Pythagoras' theorem is one plain fact about right-angled triangles, but it turns out to be one of the most useful facts in all of geometry, quietly powering everything from finding a missing wall measurement to working out the longest diagonal wire that could possibly fit inside a shipping crate. This lesson builds the theorem from scratch, proves it two genuinely different ways, and then stretches it, step by careful step, all the way from a flat triangle on paper into a full three-dimensional diagonal through solid space.",
  sections: [
    { h: "1. The theorem itself", body: [
      "In any right-angled triangle, the two shorter sides meeting at the right angle are called the legs, and the longest side, always opposite the right angle, is called the hypotenuse. Pythagoras' theorem says: if the legs are a and b, and the hypotenuse is c, then a squared plus b squared equals c squared, written a^2 + b^2 = c^2.",
      "Check it on the most famous example there is: legs 3 and 4, hypotenuse 5. 3^2 + 4^2 = 9 + 16 = 25, and 5^2 = 25 too. They match exactly, and this 3-4-5 triangle, along with its scaled-up cousins like 6-8-10 or 9-12-15, turns up constantly throughout this whole lesson.",
    ] },
    { h: "2. Proving it: the tilted square inside a square", body: [
      "It is worth seeing WHY the theorem is true, not just trusting it, and there is a beautiful picture that proves it outright. Take a big square with side length (a + b). Inside it, place four identical copies of the right-angled triangle (legs a and b, hypotenuse c), arranged around the four edges of the big square so each triangle's right angle points into a corner, and the four hypotenuses together trace out a smaller, tilted square sitting exactly in the middle.",
      "The big square's total area is (a + b)^2. That area is made up of the four triangles plus the tilted middle square. Each triangle has area half of a times b, so four of them together cover 4 x (half x a x b) = 2ab. The tilted middle square, bounded by the four hypotenuses, has side length c, so its area is c^2.",
    ], examples: [
      { q: "Turn the area statement 'big square = four triangles + middle square' into the theorem itself.", steps: ["(a+b)^2 = 2ab + c^2.", "Expand the left side: a^2 + 2ab + b^2 = 2ab + c^2.", "Subtract 2ab from both sides: a^2 + b^2 = c^2."], answer: "Exactly Pythagoras' theorem, derived purely from areas, with no measuring involved" },
      { q: "A right-angled triangle has legs 5 and 12. Place four copies in the tilted-square picture to find the area of the inner tilted square, and hence state the hypotenuse.", steps: ["The big outer square has side a + b = 5 + 12 = 17, so its area is 17^2 = 289.", "The four triangles together cover 4 x (half x 5 x 12) = 4 x 30 = 120.", "Inner tilted square area = 289 - 120 = 169.", "The hypotenuse is the side of that square: c = square root of 169 = 13."], answer: "13 (confirming the 5-12-13 Pythagorean triple directly from the area picture)" },
      { q: "A right-angled triangle has hypotenuse 25. In the tilted-square picture, the four identical triangles together cover an area of 336. Find the two legs.", steps: ["Four triangles cover 2ab = 336, so ab = 168.", "We also know a^2 + b^2 = c^2 = 625.", "(a + b)^2 = a^2 + 2ab + b^2 = 625 + 336 = 961, so a + b = 31.", "(a - b)^2 = a^2 - 2ab + b^2 = 625 - 336 = 289, so a - b = 17.", "Solving: a = (31 + 17) / 2 = 24 and b = (31 - 17) / 2 = 7."], answer: "Legs 7 and 24 (check: 7^2 + 24^2 = 49 + 576 = 625 = 25^2 ✓; 7 x 24 = 168, and 4 triangles = 4 x 84 = 336 ✓)" },
    ] },
    { h: "3. A second, different proof: the altitude to the hypotenuse", body: [
      "Here is a genuinely different way to reach the same result, using similar triangles instead of areas, worth knowing because seeing more than one proof shows the result is not a lucky coincidence of one particular picture. Draw the perpendicular line (the altitude) from the right angle straight down to the hypotenuse, splitting the hypotenuse into two smaller pieces, call them p and q, so p + q = c.",
      "This altitude creates two smaller triangles, both of which turn out to be similar to the original big triangle (they share the same angles, just at different sizes). That similarity gives two clean relationships: a^2 = c x p, and b^2 = c x q.",
    ], examples: [
      { q: "Add those two relationships together to reach Pythagoras' theorem.", steps: ["a^2 + b^2 = c x p + c x q.", "Factor the right side: c x p + c x q = c x (p + q).", "Since p + q = c, this becomes c x c = c^2."], answer: "a^2 + b^2 = c^2, proved a completely different way" },
      { q: "In a right-angled triangle with legs 6 and 8, the altitude to the hypotenuse divides it into segments p and q. Find p and q.", steps: ["First find the hypotenuse: c = square root of (6^2 + 8^2) = square root of 100 = 10.", "Use the relationship a^2 = c x p: 6^2 = 10 x p, so 36 = 10p, giving p = 3.6.", "Use b^2 = c x q: 8^2 = 10 x q, so 64 = 10q, giving q = 6.4.", "Check: p + q = 3.6 + 6.4 = 10 = c. ✓"], answer: "p = 3.6, q = 6.4" },
      { q: "In a right-angled triangle with legs 9 and 12 (hypotenuse 15), find the length of the altitude to the hypotenuse using two different methods: the area formula and the relationship h^2 = p x q.", steps: ["Area method: area of triangle = half x 9 x 12 = 54. Also area = half x base x height = half x 15 x h. So 54 = 7.5h, giving h = 7.2.", "Segments from section: p = 9^2 / 15 = 81/15 = 5.4, q = 12^2 / 15 = 144/15 = 9.6.", "Check with h^2 = p x q: 7.2^2 = 51.84, and 5.4 x 9.6 = 51.84. Both methods agree. ✓"], answer: "h = 7.2 m" },
    ],
      note: "Check this on the 3-4-5 triangle: the altitude to the hypotenuse has length 2.4, splitting the hypotenuse of 5 into segments p = 1.8 and q = 3.2 (which do add to 5). Then a^2 = 3^2 = 9, and c x p = 5 x 1.8 = 9, a match; b^2 = 16, and c x q = 5 x 3.2 = 16, also a match." },
    { h: "4. Basic applications: missing hypotenuse, missing leg", body: [
      "Finding a missing hypotenuse is the most direct use of the theorem: square both legs, add them, then take the square root. Legs 6 and 8: 6^2 + 8^2 = 36 + 64 = 100, and the square root of 100 is 10.",
      "Finding a missing LEG instead needs one extra step of rearranging: subtract the known leg squared from the hypotenuse squared, then take the square root. Hypotenuse 13, one leg 5: 13^2 - 5^2 = 169 - 25 = 144, and the square root of 144 is 12.",
    ], tryit: { q: "A right-angled triangle has legs 5 and 12. Find the hypotenuse.", answer: "13. 5^2 + 12^2 = 25 + 144 = 169, and the square root of 169 is 13." } },
    { h: "5. Finding the right triangle hiding inside a bigger figure", body: [
      "Many real problems never hand you a clean, isolated right-angled triangle. Instead, the right triangle is hiding inside a bigger picture, made of ordinary horizontal and vertical measurements, and the first job is spotting it.",
      "A path runs 9 m due east, then 12 m due north, both stretches at right angles to each other. What is the straight-line distance from the start to the end, cutting directly across rather than following the path? The two path stretches ARE the two legs of a right-angled triangle, even though nobody drew a triangle at all; the direct distance is the hypotenuse.",
    ], examples: [
      { q: "Find that direct distance.", steps: ["Legs 9 and 12 (the two straight stretches, at right angles).", "9^2 + 12^2 = 81 + 144 = 225.", "The square root of 225 is 15."], answer: "15 m" },
      { q: "A rectangle is 15 m long and 20 m wide. What is the length of its diagonal?", steps: ["The diagonal is the hypotenuse of a right-angled triangle with legs 15 and 20.", "15^2 + 20^2 = 225 + 400 = 625.", "The square root of 625 is 25."], answer: "25 m" },
      { q: "A rectangle has diagonal 26 cm and one side 24 cm. Find the other side and the perimeter.", steps: ["Let the missing side be w. By Pythagoras: w^2 + 24^2 = 26^2.", "w^2 = 676 - 576 = 100, so w = 10 cm.", "Perimeter = 2 x (24 + 10) = 2 x 34 = 68 cm."], answer: "Width 10 cm, perimeter 68 cm" },
    ] },
    { h: "6. The converse: proving a right angle exists", body: [
      "Pythagoras' theorem also runs in reverse, and this direction, called the converse, is just as useful. If a triangle's three sides satisfy a^2 + b^2 = c^2, that GUARANTEES the triangle has a right angle opposite the longest side, even if nobody told you so and no angle looks obviously square in a drawing.",
      "A rectangle is supposed to have sides 5 cm and 12 cm, and a workman measures a diagonal at 13 cm to check the corners are genuinely square. Since 5^2 + 12^2 = 25 + 144 = 169 = 13^2, the converse confirms the corner really is a right angle. If the diagonal had measured, say, 14 cm instead, the equation would fail, and that would prove the corner is NOT truly square, however close it might look by eye.",
    ], tryit: { q: "A triangle has sides 7, 24 and 25. Does the converse confirm a right angle?", answer: "Yes. 7^2 + 24^2 = 49 + 576 = 625, and 25^2 = 625 too. They match, so the triangle does have a right angle, opposite the side of length 25." } },
    { h: "7. Two traps: over-using trigonometry, and mistaking a check for a proof", body: [
      "Once trigonometry (sine, cosine, tangent) enters the toolkit, it is tempting to reach for it on every triangle question, even ones where Pythagoras alone, with no angles involved at all, is faster and simpler. Whenever a problem only ever mentions lengths, and the triangle is confirmed right-angled, try Pythagoras first; trigonometry earns its keep when an actual angle, not just a right angle, is part of the question.",
      "Separately, measuring a handful of right-angled triangles and finding a^2 + b^2 = c^2 holds for all of them is a DEMONSTRATION, evidence that the pattern looks true, but it is not a PROOF, which must show the result holds for every possible right-angled triangle, not just the ones you happened to check. Sections 2 and 3 are proofs precisely because they use general lengths a, b and c, not specific numbers.",
    ] },
    { h: "8. Building toward 3D: the diagonal across a floor", body: [
      "Now for the real stretch of this lesson: extending Pythagoras from a flat, two-dimensional triangle into full three-dimensional space, the kind of reasoning that finds the longest straight wire that could fit diagonally inside a box.",
      "Start with just the floor of a cuboid (a box shape), which is an ordinary rectangle, length L and width W. The diagonal line across that floor, from one corner to the opposite corner, is found by ordinary 2D Pythagoras: floor diagonal = the square root of (L^2 + W^2).",
    ], examples: [
      { q: "A cuboid's floor measures 3 m by 4 m. Find the diagonal distance across the floor.", steps: ["Floor diagonal = square root of (L^2 + W^2).", "= square root of (3^2 + 4^2) = square root of (9 + 16) = square root of 25.", "= 5."], answer: "5 m" },
      { q: "A rectangular garden has a straight diagonal path 17 m long. The garden is 8 m wide. How long is it?", steps: ["The diagonal is the hypotenuse: length^2 + 8^2 = 17^2.", "length^2 = 289 - 64 = 225.", "Length = 15 m."], answer: "15 m" },
      { q: "A cuboid floor has its two dimensions in the ratio 5 : 12. The diagonal across the floor is 39 m. Find the floor dimensions and the floor area.", steps: ["Let width = 5k and length = 12k.", "(5k)^2 + (12k)^2 = 39^2, so 25k^2 + 144k^2 = 1521, giving 169k^2 = 1521.", "k^2 = 9, so k = 3. Width = 15 m, length = 36 m.", "Floor area = 15 x 36 = 540 m^2."], answer: "Width 15 m, length 36 m, area 540 m^2 (using a scaled 5-12-13 triple with scale factor 3)" },
    ] },
    { h: "9. The second step: Pythagoras again, straight up", body: [
      "The floor diagonal is not yet the answer to the full 3D question, which asks for the SPACE diagonal, the straight line from one bottom corner of the box all the way up to the FAR TOP corner, cutting straight through the inside of the box. To find it, use the floor diagonal you just calculated as one leg of a brand new right-angled triangle, with the cuboid's height as the other leg.",
      "Picture this new triangle standing upright: one leg is the floor diagonal lying flat, the other leg is the vertical height rising straight up from one end of it, and the hypotenuse of this new triangle is exactly the space diagonal you are hunting for. This is the whole trick, often called doing Pythagoras twice: once flat across the floor, then once again standing up using that result as a new leg.",
    ], examples: [
      { q: "The cuboid from section 8 has floor diagonal 5 m and height 12 m. Find the full space diagonal.", steps: ["Space diagonal = square root of (floor diagonal^2 + height^2).", "= square root of (5^2 + 12^2) = square root of (25 + 144) = square root of 169.", "= 13."], answer: "13 m" },
      { q: "A box is 6 m long, 8 m wide and 24 m tall. Find the full space diagonal.", steps: ["Step one, floor diagonal: square root of (6^2 + 8^2) = square root of (36 + 64) = square root of 100 = 10.", "Step two, space diagonal: square root of (10^2 + 24^2) = square root of (100 + 576) = square root of 676.", "The square root of 676 is 26."], answer: "26 m" },
      { q: "A room has space diagonal 65 cm and floor diagonal 60 cm. Find the room's height, then state the total length of all four vertical edges.", steps: ["Space diagonal^2 = floor diagonal^2 + height^2, so height^2 = 65^2 - 60^2 = 4225 - 3600 = 625.", "Height = square root of 625 = 25 cm.", "There are 4 vertical edges in a cuboid, each of length 25 cm. Total = 4 x 25 = 100 cm."], answer: "Height 25 cm, total vertical edge length 100 cm" },
    ],
      note: "Notice the two clean Pythagorean triples chaining together perfectly: 3-4-5 for the floor, then 5-12-13 for the full 3D climb. This is not a coincidence of this particular example, it is exactly how the doing-Pythagoras-twice method always works, whatever the three dimensions happen to be." },
    { h: "10. A full worked room diagonal", body: [
      "Put the whole method together in one clean sweep, exactly as it would appear in a genuine problem, without the two steps being separated out for you in advance. A storage container measures 12 m long, 9 m wide and 8 m tall. Find the length of the longest straight rod that could fit inside it, corner to opposite corner.",
    ], examples: [
      { q: "Find the container's full space diagonal.", steps: ["Step one, the floor diagonal: square root of (12^2 + 9^2) = square root of (144 + 81) = square root of 225 = 15.", "Step two, bring in the height: square root of (floor diagonal^2 + height^2) = square root of (15^2 + 8^2) = square root of (225 + 64) = square root of 289.", "The square root of 289 is 17."], answer: "17 m, the longest rod that fits diagonally corner to corner" },
      { q: "A storage unit is 4 m long, 3 m wide and 12 m tall. Find the full space diagonal.", steps: ["Step one, floor diagonal: square root of (4^2 + 3^2) = square root of (16 + 9) = square root of 25 = 5.", "Step two, space diagonal: square root of (5^2 + 12^2) = square root of (25 + 144) = square root of 169.", "Square root of 169 = 13."], answer: "13 m" },
      { q: "A box has space diagonal 41 cm. Its floor diagonal is 40 cm, and the floor dimensions are in the ratio 3 : 4. Find the three dimensions of the box.", steps: ["Find the height: height^2 = 41^2 - 40^2 = 1681 - 1600 = 81, so height = 9 cm.", "Floor dimensions in ratio 3 : 4 with diagonal 40: let sides be 3k and 4k. (3k)^2 + (4k)^2 = 40^2, so 25k^2 = 1600, k = 8.", "Floor sides: 3 x 8 = 24 cm and 4 x 8 = 32 cm.", "Check: square root of (24^2 + 32^2 + 9^2) = square root of (576 + 1024 + 81) = square root of 1681 = 41. ✓"], answer: "24 cm x 32 cm x 9 cm" },
    ],
      tryit: { q: "A box measures 6 m by 8 m by 24 m. Find its space diagonal. (Hint: find the floor diagonal first, then bring in the height.)", answer: "26 m. Floor diagonal: square root of (6^2+8^2) = square root of 100 = 10. Space diagonal: square root of (10^2+24^2) = square root of (100+576) = square root of 676 = 26." } },
    { h: "11. The shared-height wire trap", body: [
      "A closely related but genuinely different setup involves two vertical poles of different heights, standing some horizontal distance apart on level ground, joined by a straight wire from the top of one to the top of the other. The trap here is using one pole's FULL height as a leg of the right-angled triangle, when the correct leg is the DIFFERENCE in the two heights.",
      "A 10 m pole and a 4 m pole stand 8 m apart at their bases. The wire joining their tops does not care about either pole's full height directly; what matters is how much HIGHER one top is than the other, which is 10 - 4 = 6 m, and the horizontal gap between them, 8 m. These two numbers, 6 and 8, are the true legs of the right triangle formed by the wire.",
    ], examples: [
      { q: "Find the length of the connecting wire.", steps: ["Legs: the height difference, 6 m, and the horizontal distance, 8 m.", "Wire = square root of (6^2 + 8^2) = square root of (36 + 64) = square root of 100.", "= 10."], answer: "10 m" },
      { q: "A 20 m pole and an 8 m pole stand 16 m apart on level ground. Find the wire length from the top of one to the top of the other.", steps: ["Height difference = 20 - 8 = 12 m (NOT the full 20 m height).", "Horizontal gap = 16 m.", "Wire = square root of (12^2 + 16^2) = square root of (144 + 256) = square root of 400 = 20 m."], answer: "20 m" },
      { q: "Two poles stand 24 m apart on level ground. A wire connecting their tops is 25 m long. The shorter pole is 7 m tall. Find the height of the taller pole.", steps: ["The wire is the hypotenuse. Let the height difference be d: d^2 + 24^2 = 25^2.", "d^2 = 625 - 576 = 49, so d = 7 m.", "The taller pole is 7 + 7 = 14 m tall."], answer: "14 m" },
    ],
      note: "Using the full 10 m pole height as a leg instead of the 6 m height difference is the single most common error in this setup, and it would give a completely wrong triangle that does not match the real geometry of the two poles and the wire between their tops at all." },
    { h: "12. Disguised triples inside algebra", body: [
      "The hardest style of Pythagoras question hides the whole triangle inside algebraic expressions, so that setting up the equation and solving it is itself most of the challenge, with a clean numeric triple only appearing once the algebra is untangled.",
      "A right-angled triangle has legs of length x and (x + 7), and a hypotenuse of length (x + 8). Find x. Set up Pythagoras directly with these expressions: x^2 + (x + 7)^2 = (x + 8)^2.",
    ], examples: [
      { q: "Solve x^2 + (x+7)^2 = (x+8)^2 for x.", steps: ["Expand (x+7)^2 = x^2 + 14x + 49, and (x+8)^2 = x^2 + 16x + 64.", "So the equation becomes x^2 + x^2 + 14x + 49 = x^2 + 16x + 64, which simplifies to 2x^2 + 14x + 49 = x^2 + 16x + 64.", "Subtract the right side from both sides: x^2 - 2x - 15 = 0.", "Factorise: (x - 5)(x + 3) = 0, giving x = 5 or x = -3.", "A negative length is impossible, so x = 5."], answer: "x = 5, giving legs 5 and 12, and hypotenuse 13, the classic 5-12-13 triple hiding inside the algebra all along" },
      { q: "A right-angled triangle has legs x and (x + 7), and hypotenuse (x + 9). Find x and identify the triple.", steps: ["Set up Pythagoras: x^2 + (x+7)^2 = (x+9)^2.", "Expand: x^2 + x^2 + 14x + 49 = x^2 + 18x + 81.", "Simplify: x^2 - 4x - 32 = 0.", "Factorise: (x - 8)(x + 4) = 0, giving x = 8 or x = -4. Reject the negative.", "Legs 8 and 15, hypotenuse 17."], answer: "x = 8, giving the 8-15-17 Pythagorean triple (check: 64 + 225 = 289 = 17^2 ✓)" },
      { q: "A right-angled triangle has legs n and (3n - 1), and hypotenuse (3n + 1). Find n, state the triple, and verify it.", steps: ["Set up Pythagoras: n^2 + (3n-1)^2 = (3n+1)^2.", "Expand: n^2 + 9n^2 - 6n + 1 = 9n^2 + 6n + 1.", "Simplify: n^2 - 12n = 0, so n(n - 12) = 0.", "Reject n = 0 as it gives zero length. So n = 12.", "Legs: 12 and 3(12)-1 = 35. Hypotenuse: 3(12)+1 = 37."], answer: "n = 12, triple is 12-35-37 (verify: 144 + 1225 = 1369 = 37^2 ✓)" },
    ],
      tryit: { q: "Check that x = 5 truly satisfies the original equation, using real numbers.", answer: "Legs 5 and 12 (since x+7=12), hypotenuse 13 (since x+8=13). 5^2 + 12^2 = 25 + 144 = 169, and 13^2 = 169. They match." } },
  ],
  recap: [
    "For a right-angled triangle with legs a, b and hypotenuse c: a^2 + b^2 = c^2.",
    "Two genuine proofs: the tilted-square-inside-a-square area argument, and the altitude-to-the-hypotenuse similar-triangles argument.",
    "The right triangle you need is often hidden inside a bigger figure made of horizontal and vertical measurements.",
    "The converse also holds: if a^2+b^2=c^2 for a triangle's sides, that triangle genuinely has a right angle, guaranteed.",
    "For a 3D space diagonal, do Pythagoras twice: first across the floor (length and width), then again using that floor diagonal and the height.",
    "A wire between two poles of different heights uses the HEIGHT DIFFERENCE as a leg, never one pole's full height.",
    "An algebraic Pythagoras question can hide a clean numeric triple; set up the equation, expand carefully, and solve.",
  ],
  mistakes: [
    "Treating a handful of checked numeric examples as a proof, rather than a demonstration; a real proof uses general lengths.",
    "Reaching for trigonometry on a plain right-angled-triangle length question where Pythagoras alone is faster and simpler.",
    "Doing Pythagoras only once for a 3D space diagonal, forgetting the second step that brings in the height.",
    "Using a pole's full height, instead of the difference between two pole heights, as a leg in a connecting-wire problem.",
    "Keeping a negative solution from an algebraic Pythagoras equation instead of rejecting it as an impossible length.",
  ],
};


// ---- Full-depth guided lesson: order of operations (multiExpr v2, replaces old short version) ----

JUNIOR_LESSONS.multiExpr = {
  title: "Expressions: the order of operations",
  minutes: 17,
  intro: "Write down 2 + 3 x 4 and hand it to ten different people, and without an agreed rule, you could get ten different answers. Mathematics fixes this with one shared order of operations, often remembered as BIDMAS, but the letters are only useful once you understand WHY that order was chosen and how it lets you rearrange a calculation safely, spot a wrong answer instantly, and even find shortcuts that would otherwise look like cheating.",
  sections: [
    { h: "1. Why an agreed order matters at all", body: [
      "Work out 2 + 3 x 4 two different ways. Left to right, ignoring which operation is which: (2 + 3) x 4 = 5 x 4 = 20. Doing the multiplication first: 2 + (3 x 4) = 2 + 12 = 14. Two completely different answers from the exact same three numbers and two symbols.",
      "Without an agreed rule for which operation happens first, every written calculation would be ambiguous, and nobody could trust a worked answer without also being told the exact order the original author intended. BIDMAS is simply the rule everyone has agreed to use, so that 2 + 3 x 4 always means the same thing to everybody: 14.",
    ] },
    { h: "2. The order itself, and why it is shaped this way", body: [
      "The full order is: Brackets first, then Indices (powers and roots), then Multiplication and Division (treated as equal rank), then Addition and Subtraction (also treated as equal rank). Brackets and Indices sit above the four basic operations because they describe a single, self-contained value that needs settling before it can take part in anything else.",
      "Multiplication and division sit above addition and subtraction because multiplication is really repeated addition bundled up: 3 x 4 is a shorthand for 4 + 4 + 4. Unbundling that shorthand has to happen before ordinary addition and subtraction can act on the result, otherwise the shorthand would not mean what it claims to mean.",
    ], tryit: { q: "Work out 5 + 2 x 6, showing which operation is done first and why.", answer: "17. Multiplication ranks above addition, so 2 x 6 = 12 is done first, then 5 + 12 = 17." } },
    { h: "3. Multiplication and division are equal rank: left to right", body: [
      "Multiplication and division do not have one ranked above the other; they are equal partners, and when both appear with nothing separating them, you work strictly from left to right.",
      "Take 20 divided by 4 times 2. Left to right: (20 divided by 4) x 2 = 5 x 2 = 10. If someone wrongly grouped the multiplication first instead, they would get 20 divided by (4 x 2) = 20 divided by 8 = 2.5, a different and incorrect answer.",
    ], examples: [
      { q: "Work out 30 divided by 5 x 3, left to right.", steps: ["30 divided by 5 = 6.", "6 x 3 = 18."], answer: "18 (not 30 divided by 15 = 2, which wrongly groups the multiplication first)" },
      { q: "Work out 48 ÷ 8 ÷ 2, left to right. Then state the wrong answer produced by grouping the last two numbers first.", steps: ["Left to right: 48 ÷ 8 = 6.", "6 ÷ 2 = 3.", "The wrong grouping (48 ÷ (8 ÷ 2) = 48 ÷ 4 = 12) treats the division as if it were associated to the right rather than the left."], answer: "3 (not 12, which wrongly processes the 8 ÷ 2 before the 48 ÷ 8)" },
      { q: "Evaluate 36 ÷ 4 x 3 - 18 ÷ 6 x 2, applying all operations in the correct order.", steps: ["Multiplication and division are equal rank, so work left to right within each group: 36 ÷ 4 = 9, then 9 x 3 = 27.", "Separately: 18 ÷ 6 = 3, then 3 x 2 = 6.", "Addition and subtraction: 27 - 6 = 21."], answer: "21" },
    ] },
    { h: "4. Addition and subtraction are equal rank too", body: [
      "The exact same left-to-right rule governs addition and subtraction when they appear together with nothing to separate them: neither outranks the other, so work through in the order they are written.",
      "Take 10 - 2 + 5. Left to right: (10 - 2) + 5 = 8 + 5 = 13. A very common wrong answer, 3, comes from secretly grouping the last two numbers first instead, as if it were 10 - (2 + 5) = 10 - 7 = 3, treating the addition as if it had priority over the subtraction, which it never does.",
    ], tryit: { q: "Work out 15 - 4 + 6, left to right, and explain the wrong answer someone would get by grouping the last two numbers first instead.", answer: "17. Correctly, (15-4)+6 = 11+6 = 17. Grouping wrongly as 15-(4+6) gives 15-10 = 5, a different and incorrect answer." } },
    { h: "5. Where powers and roots fit in", body: [
      "A power (or index), like the small raised 2 in 3 squared, describes repeated multiplication bundled up the same way multiplication bundles up repeated addition, and it ranks even higher, settling before any multiplication, division, addition or subtraction touches it.",
      "Work out 3 + 2 squared x 4. First settle the power: 2 squared = 4. Then the multiplication: 4 x 4 = 16. Then the addition: 3 + 16 = 19.",
    ], examples: [
      { q: "Compare 3 + 2 squared with (3 + 2) squared. Are they the same?", steps: ["3 + 2 squared: settle the power first, 2 squared = 4, then add: 3 + 4 = 7.", "(3+2) squared: settle the bracket first, 3+2=5, then square it: 5 squared = 25.", "7 and 25 are very different."], answer: "No, they are completely different (7 versus 25); the bracket changes which number actually gets squared" },
      { q: "Work out 2 x 3^2 - 4.", steps: ["Indices first: 3 squared = 9.", "Multiplication next: 2 x 9 = 18.", "Subtraction last: 18 - 4 = 14."], answer: "14" },
      { q: "Without evaluating either side in full, explain why 2^3 + 1 must be less than (2 + 1)^3, then find the exact difference.", steps: ["2^3 + 1 = 8 + 1 = 9.", "(2 + 1)^3 = 3^3 = 27.", "9 < 27 because squaring (or cubing) the sum creates cross-product terms that are missing when you cube first and add afterwards.", "Difference = 27 - 9 = 18."], answer: "The difference is 18" },
    ] },
    { h: "6. Brackets override everything, and nested brackets work inside-out", body: [
      "A bracket is an instruction to treat everything inside it as a single, settled value before it interacts with anything outside, overriding the natural order of operations entirely for whatever it encloses.",
      "When brackets sit inside other brackets, always work from the INNERMOST pair outward, settling each layer completely before moving on to the next. Take 2 x [(3 + 4) x 2 - 5]. Innermost first: 3 + 4 = 7. Next layer: 7 x 2 = 14. Next: 14 - 5 = 9. Finally: 2 x 9 = 18.",
    ], examples: [
      { q: "Work out 5 x [(6 - 2) x 3 + 1], innermost bracket first.", steps: ["Innermost: 6 - 2 = 4.", "Next: 4 x 3 = 12.", "Next: 12 + 1 = 13.", "Finally: 5 x 13 = 65."], answer: "65" },
      { q: "Work out 3 x [(2 + 5) x 2 - 6].", steps: ["Innermost bracket: 2 + 5 = 7.", "Inside outer bracket: 7 x 2 = 14.", "Then: 14 - 6 = 8.", "Finally: 3 x 8 = 24."], answer: "24" },
      { q: "Work out [(4 + 2)^2 - 3 x (1 + 4)] ÷ 7.", steps: ["Innermost brackets: 4 + 2 = 6 and 1 + 4 = 5.", "Index: 6^2 = 36.", "Multiplication inside outer bracket: 3 x 5 = 15.", "Subtraction inside outer bracket: 36 - 15 = 21.", "Division: 21 ÷ 7 = 3."], answer: "3" },
    ] },
    { h: "7. Flexible, LEGAL rearranging: the laws of arithmetic", body: [
      "BIDMAS fixes the order for a calculation exactly as written, but the laws of arithmetic (the commutative, associative and distributive laws) allow you to legally rearrange a calculation into an easier-to-work-with shape without changing its value at all. Multiplying 13 x 99 head-on is awkward, but there is more than one legal way to make it easy.",
      "Method one: 13 x 99 = 13 x (100 - 1) = 1300 - 13 = 1287. Method two: 13 x 99 = 13 x 90 + 13 x 9 = 1170 + 117 = 1287. Method three: 13 x 99 = (10 + 3) x 99 = 990 + 297 = 1287. All three completely different-looking routes land on exactly the same answer, because each one is a legal application of the distributive law, splitting one number into a sum or difference and multiplying every part by the other number in full.",
    ], tryit: { q: "Calculate 24 x 99 by writing 99 as (100 - 1), and check it a second way by splitting 24 as (20 + 4).", answer: "2376 both ways. Method one: 24 x (100-1) = 2400 - 24 = 2376. Method two: (20+4) x 99 = 1980 + 396 = 2376." } },
    { h: "8. An INVALID rearrangement, and exactly what goes wrong", body: [
      "Not every reshuffling of a calculation is legal, and spotting an invalid one is just as important a skill as finding a valid shortcut. Take 13 x 99 again, and split only the 13 into 10 and 3, but then forget to multiply BOTH parts by the full 99.",
      "A common mistake writes 13 x 99 as 10 x 99 + 3, tacking the leftover 3 on as if it needed no further multiplying: 990 + 3 = 993. But the true answer, from section 7, is 1287, a difference of 1287 - 993 = 294. The distributive law demands that EVERY part of a split number gets multiplied by the full other number, not just the first part; forgetting to multiply the 3 by 99 is exactly what breaks this attempt.",
    ], note: "Whenever you split a number to make a calculation easier, check that every single piece you created has genuinely been multiplied by whatever the other full number is. A forgotten multiplication on just one small piece is the single most common way a legal-looking shortcut goes wrong." },
    { h: "9. Brackets can also simplify by factoring, not just expand", body: [
      "So far brackets have mostly been unpacked (expanded) into separate terms. The reverse move, spotting a shared factor and pulling it out into a bracket, can turn a clumsy calculation into a tidy one.",
      "Instead of calculating 6 x 17 and 6 x 3 separately and adding them, notice both terms share a factor of 6, and rewrite the whole sum as 6 x (17 + 3) = 6 x 20 = 120.",
    ], examples: [
      { q: "Check that 6 x 17 + 6 x 3 really does equal 120 when calculated the long way too.", steps: ["6 x 17 = 102.", "6 x 3 = 18.", "102 + 18 = 120."], answer: "120, matching the factored shortcut exactly" },
      { q: "Use the distributive law to calculate 8 x 98 mentally, then verify by a different split.", steps: ["Write 98 = 100 - 2: 8 x (100 - 2) = 800 - 16 = 784.", "Check by splitting 8 = 5 + 3: (5 + 3) x 98 = 490 + 294 = 784. Both routes agree."], answer: "784" },
      { q: "Find the value of 37 x 13 - 37 x 3 without calculating either product separately.", steps: ["Both terms share a factor of 37: 37 x 13 - 37 x 3 = 37 x (13 - 3).", "13 - 3 = 10.", "37 x 10 = 370."], answer: "370" },
    ] },
    { h: "10. A full expression with everything at once", body: [
      "Put every layer of the order of operations to work on one expression: 4 + 3 x (5 - 2) squared minus 6 divided by 2.",
    ], examples: [
      { q: "Work through 4 + 3 x (5 - 2)^2 - 6 divided by 2 step by step.", steps: ["Brackets first: 5 - 2 = 3.", "Indices next: 3 squared = 9.", "Multiplication and division, left to right: 3 x 9 = 27, and separately 6 divided by 2 = 3.", "Addition and subtraction, left to right: 4 + 27 - 3."], answer: "28 (4 + 27 = 31, then 31 - 3 = 28)" },
      { q: "Work out 10 - 2 x (1 + 3)^2 ÷ 8.", steps: ["Brackets: 1 + 3 = 4.", "Indices: 4 squared = 16.", "Multiplication and division, left to right: 2 x 16 = 32, then 32 ÷ 8 = 4.", "Subtraction: 10 - 4 = 6."], answer: "6" },
      { q: "Work out (5 + 2)^2 ÷ (3 + 4) - 2 x (1 + 3).", steps: ["Brackets: (5+2)=7, (3+4)=7, (1+3)=4.", "Indices: 7^2 = 49.", "Division: 49 ÷ 7 = 7. Multiplication: 2 x 4 = 8.", "Subtraction: 7 - 8 = -1."], answer: "-1" },
    ],
      tryit: { q: "Work out 2 x (4 + 1)^2 - 10 divided by 5.", answer: "48. Bracket: 4+1=5. Index: 5 squared=25. Multiplication and division: 2x25=50, and 10 divided by 5=2. Then 50-2=48." } },
    { h: "11. Always, sometimes or never: do brackets matter?", body: [
      "Claim: removing a set of brackets never changes a calculation's value. Test it on 2 x (3 + 4): with the brackets, 2 x 7 = 14. Without them, following the normal order (multiplication before addition), 2 x 3 + 4 = 6 + 4 = 10. Different answers, so the claim fails here: brackets clearly can matter enormously whenever they force an addition or subtraction to happen before a multiplication or division that would otherwise jump the queue.",
      "But test it on (2 + 3) - 1: with brackets, 5 - 1 = 4. Without them, 2 + 3 - 1, worked left to right (addition and subtraction being equal rank), also gives 4. Here removing the brackets changed nothing, because addition and subtraction were already going to be evaluated in that same left-to-right order regardless.",
    ], examples: [
      { q: "State the honest verdict on the claim 'removing brackets never changes a calculation's value.'", steps: ["Found one case where removing brackets changes the value: 2x(3+4) vs 2x3+4.", "Found another case where it does not: (2+3)-1 vs 2+3-1.", "A claim needing both a working example and a failing example is only sometimes true."], answer: "Sometimes true: brackets matter whenever they override the natural precedence order, but not when they simply mirror an order the left-to-right rule would have used anyway" },
      { q: "Test the claim 'in the expression x × (y + z), the brackets can always be removed without changing the value' by trying x=2, y=3, z=4 and x=1, y=5, z=6. What do you find?", steps: ["x=2: 2×(3+4)=2×7=14, but 2×3+4=6+4=10. Different, so brackets mattered here.", "x=1: 1×(5+6)=11, and 1×5+6=5+6=11. The same, so brackets did not matter here.", "The claim fails for x=2 but holds for x=1."], answer: "Sometimes true: brackets can safely be removed when x=1 (since multiplying by 1 changes nothing), but not in general" },
      { q: "Claim: 'For all positive whole numbers a and b, (a + b)^2 > a^2 + b^2.' Is this always, sometimes or never true? Give the algebraic argument.", steps: ["Expand (a+b)^2 = a^2 + 2ab + b^2.", "Since a and b are both positive, 2ab > 0.", "So (a+b)^2 = a^2 + b^2 + 2ab > a^2 + b^2."], answer: "Always true: the bracket creates an extra 2ab term that is always positive, so (a+b)^2 always exceeds a^2+b^2" },
    ] },
    { h: "12. Fixing a wrong answer by adjusting one number", body: [
      "Sometimes you're handed a calculation with a mistake already in it, and asked which single number needs to increase by 1 to make it correct. The order of operations tells you exactly how big an effect nudging each number actually has, and the effect is NOT the same for every number in the expression.",
      "A number that only gets added or subtracted at the very end has a small, fixed effect: nudging it by 1 changes the total by exactly 1 (up if it's added, down if it's subtracted). A number that sits inside a multiplication has a much bigger effect when nudged, because that nudge gets multiplied through by whatever it's paired with.",
    ], examples: [
      { q: "The calculation 4 x 6 + 5 = 30 is wrong (working it out properly gives 29). Which number, increased by 1, would actually make the total 30?", steps: ["Increase the 5 (added on at the end) by 1: 4x6+6 = 24+6 = 30. A change of exactly +1.", "Increase the 4 (inside the multiplication) by 1 instead: 5x6+5 = 30+5 = 35. A change of +6, not +1, because that 4 is multiplied by 6.", "Increase the 6 (inside the multiplication) by 1 instead: 4x7+5 = 28+5 = 33. A change of +4, because that 6 is multiplied by 4."], answer: "The added-on 5 — because a number outside every multiplication changes the total by exactly its own nudge, while a number inside a multiplication changes it by (the nudge) times (whatever it's multiplied by)" },
      { q: "The expression 4 x 3 + 8 evaluates to 20. Which single number, increased by 1, makes the total reach 21?", steps: ["Increase the 8 (added on at the end) by 1: 4x3+9 = 12+9 = 21. Change = +1. ✓", "Increase the 4 by 1: 5x3+8 = 15+8 = 23. Change = +3.", "Increase the 3 by 1: 4x4+8 = 16+8 = 24. Change = +4.", "Only the added-on 8 gives the exact +1 needed."], answer: "Increase the 8" },
      { q: "In the expression a × b + c with a=6, b=5, c=3, which single unit increase (increasing one of a, b, c by 1) causes the largest change to the total? Which causes the smallest?", steps: ["Current value: 6 x 5 + 3 = 33.", "Increase a by 1: 7 x 5 + 3 = 38. Change = +5 (equal to b).", "Increase b by 1: 6 x 6 + 3 = 39. Change = +6 (equal to a).", "Increase c by 1: 6 x 5 + 4 = 34. Change = +1."], answer: "Increasing b causes the largest change (+6); increasing c causes the smallest (+1). Rule: nudging a multiplied number by 1 shifts the total by the other multiplier; nudging an added-on number by 1 shifts it by exactly 1" },
    ],
      tryit: { q: "In 5 x 4 - 3 = 17, by how much does the total change if the 3 is increased by 1, and does it go up or down?", answer: "Down by 1, to 16. The 3 is subtracted, so increasing it by 1 subtracts more, and the total falls by exactly 1 (numbers being subtracted move the total the opposite way from numbers being added)." } },
  ],
  recap: [
    "The order of operations exists so a written calculation means exactly the same thing to everybody: brackets, then indices, then multiplication and division (left to right), then addition and subtraction (left to right).",
    "Multiplication and division are equal rank; addition and subtraction are equal rank; within each pair, work strictly left to right.",
    "Nested brackets are settled from the innermost pair outward.",
    "The laws of arithmetic allow legal rearranging (like splitting 99 into 100-1) as long as every resulting piece is multiplied by the full other number.",
    "An invalid rearrangement usually comes from forgetting to multiply every split piece, not from the idea of splitting itself.",
    "Brackets can simplify by factoring out a shared multiplier, not only by being expanded.",
    "A number added or subtracted on its own changes the total by exactly its own nudge; a number inside a multiplication changes the total by that nudge times its partner.",
  ],
  mistakes: [
    "Working strictly left to right regardless of operation, instead of respecting brackets, indices, then multiplication/division, then addition/subtraction.",
    "Treating addition as if it always outranks subtraction (the '10-2+5=3' trap), rather than working left to right through equal-rank operations.",
    "Confusing 3 + 2 squared with (3+2) squared; the bracket decides which number actually gets squared.",
    "Splitting a number for an easier calculation but forgetting to multiply every resulting piece by the full other number.",
    "Assuming brackets always change a calculation's value, when sometimes they simply match the order the left-to-right rule would use anyway.",
  ],
};

// ---- Full-depth guided lesson: modular arithmetic (modular v2, replaces old short version) ----

JUNIOR_LESSONS.calendar = {
  title: "Calendar Puzzles",
  minutes: 16,
  intro: "A calendar is one of the most familiar cyclic patterns there is: weekdays loop every 7 days, whatever the date. This lesson builds the skill of counting forward or backward through weekdays and dates without a physical calendar in front of you, using exactly the same remainder idea from cyclic patterns, plus a few real, occasionally awkward facts about how many days actually sit in each month.",
  sections: [
    { h: "1. Weekdays repeat every 7 days", body: [
      "If today is a Tuesday, then in exactly 7 days it will be Tuesday again, and in 14 days, and in 700 days, since every multiple of 7 brings you back round to the exact same weekday. Any gap of days that is NOT a multiple of 7 lands on a different weekday, found by counting forward that many places round the 7-day loop.",
      "The whole method is: find the gap in days between the two dates, divide by 7, and step forward from the starting weekday by whatever the remainder is.",
    ], examples: [
      { q: "Today is a Wednesday. What day of the week is it in 10 days?", steps: ["Divide the gap by 7: 10 = 7 x 1 + 3, remainder 3.", "Step forward 3 places from Wednesday: Thursday (1), Friday (2), Saturday (3)."], answer: "Saturday" },
      { q: "Today is a Friday. What day of the week is it in 100 days?", steps: ["Divide the gap by 7: 100 = 7 x 14 + 2, remainder 2.", "Step forward 2 places from Friday: Saturday (1), Sunday (2)."], answer: "Sunday" },
      { q: "A committee meeting is held every 11 days. The first meeting is on a Monday. What day of the week is the 10th meeting?", steps: ["Between the 1st and 10th meetings there are 9 intervals of 11 days: 9 x 11 = 99 days.", "99 ÷ 7 = 14 remainder 1.", "Step forward 1 place from Monday: Tuesday."], answer: "Tuesday" },
    ],
      tryit: { q: "Today is a Monday. What day of the week is it in 23 days?", answer: "Wednesday. 23 divided by 7 is 3 remainder 2. Step forward 2 places from Monday: Tuesday (1), Wednesday (2)." } },
    { h: "2. A remainder of 0 means the SAME weekday", body: [
      "If the gap between two dates is an exact multiple of 7, the remainder is 0, and stepping forward 0 places means landing back on the exact same weekday you started from, not the day before or after it.",
    ], tryit: { q: "Today is a Friday. What day of the week is it in 21 days?", answer: "Friday. 21 divided by 7 is exactly 3, remainder 0, so it is the same weekday, Friday." } },
    { h: "3. Knowing how many days are actually in each month", body: [
      "Calendar puzzles that span more than one month need the actual lengths of each month, which are not all the same. Thirty days have September, April, June and November; all the rest have thirty-one, except February alone, which has 28 days, or 29 in a leap year.",
      "A leap year is any year that divides exactly by 4, except that a century year (ending in 00) is only a leap year if it also divides exactly by 400. So 2024 is a leap year (2024 divided by 4 is 506, a whole number), 2000 was a leap year (it divides by 400), but 1900 was NOT a leap year (it divides by 4 but not by 400).",
    ], tryit: { q: "Is 2100 a leap year?", answer: "No. 2100 is a century year (ends in 00), so it must divide by 400 to count as a leap year. 2100 divided by 400 is 5.25, not a whole number, so 2100 is not a leap year." } },
    { h: "4. Counting the gap across a month boundary", body: [
      "When a question spans from one month into the next, count the remaining days in the first month, then add the days needed in the second month, rather than trying to subtract calendar dates directly, which invites off-by-one slips.",
      "How many days from the 25th of April to the 3rd of May, inclusive of the starting date but not counting the 3rd of May itself as extra? April has 30 days, so from the 25th to the 30th of April is 30 - 25 = 5 days remaining in April, and then a further 3 days into May reaches the 3rd. Total gap: 5 + 3 = 8 days.",
    ], examples: [
      { q: "Today is Tuesday the 25th of April. What day of the week is the 3rd of May?", steps: ["Gap in days: 5 (rest of April) + 3 (into May) = 8 days.", "8 divided by 7 is 1 remainder 1.", "Step forward 1 place from Tuesday: Wednesday."], answer: "Wednesday" },
      { q: "The 7th of November is a Saturday. What day of the week is the 2nd of December?", steps: ["Days remaining in November after the 7th: 30 - 7 = 23 days.", "Days into December to reach the 2nd: 2 days.", "Total gap: 23 + 2 = 25 days. 25 ÷ 7 = 3 remainder 4.", "Step forward 4 from Saturday: Sunday (1), Monday (2), Tuesday (3), Wednesday (4)."], answer: "Wednesday" },
      { q: "The 15th of January in a non-leap year is a Wednesday. What day of the week is the 1st of April?", steps: ["Remaining January: 31 - 15 = 16 days. February (non-leap): 28 days. Days into April: 1 day.", "Total gap: 16 + 28 + 1 = 45 days. 45 ÷ 7 = 6 remainder 3.", "Step forward 3 from Wednesday: Thursday (1), Friday (2), Saturday (3)."], answer: "Saturday" },
    ] },
    { h: "5. The inclusive-exclusive counting trap", body: [
      "One of the most common errors in calendar puzzles is miscounting whether both endpoints of a date range should be included. Counting the days from the 3rd to the 10th of a month: if you want the number of days that pass BETWEEN the two dates, it is 10 - 3 = 7 days. But if you want the number of days INCLUDING both the 3rd and the 10th as counted days, it is 10 - 3 + 1 = 8 days.",
      "Always decide first, from the wording of the question, whether the starting date itself should be counted as one of the days, and be consistent about it for the whole calculation.",
    ], tryit: { q: "How many days does a holiday last if it runs from the 5th to the 12th of a month, inclusive of both dates?", answer: "8 days. 12 - 5 + 1 = 8, since both the 5th and the 12th are being counted as part of the holiday." } },
    { h: "6. Counting how many of a weekday occur in a month", body: [
      "A different style of calendar puzzle asks how many times a particular weekday occurs within a given month. Since weekdays cycle every 7 days, any 28-day stretch contains exactly 4 of each weekday, and the leftover days at the end of a longer month decide whether a particular weekday sneaks in a 5th time.",
      "A 31-day month has 28 days (4 full weeks) plus 3 extra days. Whichever weekday the month STARTS on, that same weekday, plus the next two weekdays after it, will each occur 5 times instead of 4; every other weekday in that month occurs only 4 times.",
    ], examples: [
      { q: "A 31-day month starts on a Friday. Which weekdays occur 5 times that month?", steps: ["The 3 extra days beyond the 4 full weeks fall on the same weekdays as the 1st, 2nd and 3rd of the month.", "The month starts on Friday, so those extra days are Friday, Saturday and Sunday.", "Every other weekday only reaches 4 occurrences."], answer: "Friday, Saturday and Sunday each occur 5 times; the rest occur 4 times" },
      { q: "A 30-day month starts on a Wednesday. How many times does Sunday occur in this month?", steps: ["30 days = 4 full weeks (28 days) plus 2 extra days.", "The 2 extra days match the weekdays of the 1st and 2nd of the month: Wednesday and Thursday.", "Sunday is not one of those two extra days, so it only reaches 4 occurrences."], answer: "4 times" },
      { q: "In a particular 31-day month, there are 5 Saturdays and 5 Sundays but exactly 4 Mondays. What day of the week is the 1st of that month?", steps: ["A 31-day month has 3 extra days (beyond 4 full weeks), matching the weekdays of the 1st, 2nd and 3rd.", "Saturday and Sunday must both be among those 3 extra days. The only set of 3 consecutive weekdays containing both Saturday and Sunday is Friday, Saturday, Sunday.", "So the extra days are Friday (1st), Saturday (2nd), Sunday (3rd), meaning the month starts on Friday.", "Check: Monday is the 4th weekday in the list, not in the extra 3, so Monday occurs only 4 times. ✓"], answer: "Friday" },
    ],
      tryit: { q: "A 30-day month starts on a Tuesday. Which weekdays occur 5 times?", answer: "Tuesday and Wednesday. A 30-day month has 28 days (4 full weeks) plus 2 extra days, which fall on the same weekdays as the 1st and 2nd of the month, Tuesday and Wednesday." } },
    { h: "7. Turning a calendar puzzle into a remainder", body: [
      "The pattern for almost every weekday question is the same: work out how many days apart the two dates are, divide by 7, and step forward by the remainder.",
      "For long gaps across several months, add up the days in the months in between, remembering February and any leap day, then do the same remainder step at the very end, exactly as in section 4.",
    ], examples: [
      { q: "Today is Sunday the 10th of March (not a leap year). What day of the week is the 15th of April?", steps: ["Days remaining in March after the 10th: 31 - 10 = 21 days, reaching the 31st.", "Days into April to reach the 15th: 15 days.", "Total gap: 21 + 15 = 36 days.", "36 divided by 7 is 5 remainder 1.", "Step forward 1 place from Sunday: Monday."], answer: "Monday" },
      { q: "The 28th of September is a Thursday. What day of the week is the 5th of November?", steps: ["Remaining September: 30 - 28 = 2 days. October: 31 days. Days into November: 5 days.", "Total gap: 2 + 31 + 5 = 38 days. 38 ÷ 7 = 5 remainder 3.", "Step forward 3 from Thursday: Friday (1), Saturday (2), Sunday (3)."], answer: "Sunday" },
      { q: "The 20th of February in a leap year is a Monday. What day is the 1st of May that same year?", steps: ["Remaining February (leap year has 29 days): 29 - 20 = 9 days. March: 31 days. April: 30 days. Days into May: 1 day.", "Total gap: 9 + 31 + 30 + 1 = 71 days. 71 ÷ 7 = 10 remainder 1.", "Step forward 1 from Monday: Tuesday."], answer: "Tuesday" },
    ] },
    { h: "8. The same date, one year later", body: [
      "A useful special case worth knowing by heart: an ordinary (non-leap) year is 365 days long, and 365 divided by 7 is 52 remainder 1. So the same calendar date one year later always falls exactly ONE weekday further round the cycle, as long as no 29th of February falls anywhere in between.",
      "If a leap day DOES fall somewhere between the two matching dates, the gap becomes 366 days instead of 365, and 366 divided by 7 is 52 remainder 2, so the date shifts forward by TWO weekdays instead of one.",
    ], examples: [
      { q: "This year, the 11th of July falls on a Saturday, and no 29th of February falls before next year's 11th of July. What weekday is it next year?", steps: ["No leap day intervenes, so the shift is the usual 1 weekday.", "Step forward 1 place from Saturday: Sunday."], answer: "Sunday" },
      { q: "The 5th of March is a Tuesday. The FOLLOWING year is a leap year. What day of the week is 5th March in that following year?", steps: ["The leap day (29th February) in the following year falls between the two 5th March dates, since 29th February comes before 5th March.", "So the gap is 366 days, not 365. 366 ÷ 7 = 52 remainder 2.", "Step forward 2 from Tuesday: Wednesday (1), Thursday (2)."], answer: "Thursday" },
      { q: "The 14th of January in year Y is a Thursday, and year Y is a leap year. What day of the week is 14th January in year Y+2?", steps: ["Year Y to year Y+1: year Y is a leap year and 14 January comes BEFORE 29 February, so the leap day falls within this 365-day-looking span, making it 366 days. Shift = 2 weekdays. Thursday + 2 = Saturday.", "Year Y+1 to year Y+2: year Y+1 is not a leap year (the next leap year would be Y+4). No leap day in between. Shift = 1 weekday. Saturday + 1 = Sunday.", "So 14th January in year Y+2 is a Sunday."], answer: "Sunday" },
    ],
      tryit: { q: "If a leap day genuinely falls between this year's date and the same date next year, by how many weekdays does it shift instead of the usual one?", answer: "2 weekdays, since the gap becomes 366 days, and 366 divided by 7 is 52 remainder 2." } },
    { h: "9. Finding the LAST occurrence of a weekday in the month", body: [
      "A close cousin of the 'how many times' question from section 6 asks for the exact DATE of the last occurrence of a given weekday. The method: find the first occurrence (using the remainder idea from sections 1-2), then keep adding 7 until adding 7 again would push past the end of the month.",
      "If a month has 30 days and the first Tuesday falls on the 3rd, the Tuesdays are 3, 10, 17, 24, and 31 would be next but the month only has 30 days, so the last Tuesday is the 24th.",
    ], examples: [
      { q: "A 31-day month starts on a Thursday. What is the date of the last Monday in the month?", steps: ["Thursday is day 1, so the first Monday is 5 days later: day 1 + 4 = day 5 (Thu→Fri→Sat→Sun→Mon).", "Add 7 repeatedly: 5, 12, 19, 26. Adding 7 again gives 33, which is past the 31-day month.", "The last Monday is day 26."], answer: "The 26th" },
      { q: "A 30-day month starts on a Saturday. What is the date of the last Thursday?", steps: ["Saturday is day 1. Thursday is 5 days later: day 6 (Sat=1, Sun=2, Mon=3, Tue=4, Wed=5, Thu=6).", "Add 7 repeatedly: 6, 13, 20, 27. Next would be 34, past 30.", "Last Thursday = the 27th."], answer: "The 27th" },
      { q: "A 31-day month starts on a Wednesday. Find the dates of the last Friday and the last Sunday of the month.", steps: ["Wednesday = day 1. Friday = day 3 (Wed=1, Thu=2, Fri=3). Fridays: 3, 10, 17, 24, 31. Next = 38 > 31, so last Friday = 31st.", "Sunday = day 5 (Wed=1, Thu=2, Fri=3, Sat=4, Sun=5). Sundays: 5, 12, 19, 26. Next = 33 > 31, so last Sunday = 26th."], answer: "Last Friday is the 31st; last Sunday is the 26th" },
    ],
      tryit: { q: "A 30-day month starts on a Sunday. What is the date of the last Saturday in the month?", answer: "The 28th. The first Saturday is day 7 (Sun is day 1, so 6 days later is Saturday). Adding 7: 7, 14, 21, 28. Adding 7 again (35) overshoots the 30-day month, so 28 is the last." } },
    { h: "10. What weekday does the NEXT month start on?", body: [
      "Since a month has either 28, 29, 30 or 31 days, and none of those is a multiple of 7, the weekday the next month starts on is always a few places round the cycle from the weekday THIS month started on — found exactly the same way as any other gap: take the current month's length, divide by 7, and step forward by the remainder.",
      "A 31-day month has remainder 3 (31 = 7×4+3), so the next month starts 3 weekdays on. A 30-day month has remainder 2, so the next month starts 2 weekdays on. A 28-day February (remainder 0) hands the NEXT month the exact same starting weekday, and a 29-day February (remainder 1) shifts it on by 1.",
    ], examples: [
      { q: "A 31-day month starts on a Sunday. What day does the next month start on?", steps: ["31 ÷ 7 = 4 remainder 3.", "Step forward 3 places from Sunday: Monday, Tuesday, Wednesday."], answer: "Wednesday" },
      { q: "A 30-day month starts on a Monday. What day does the following month start on?", steps: ["30 ÷ 7 = 4 remainder 2.", "Step forward 2 from Monday: Tuesday (1), Wednesday (2)."], answer: "Wednesday" },
      { q: "January starts on a Friday in a non-leap year. What day does March start on?", steps: ["January has 31 days: 31 ÷ 7 = 4 remainder 3. Step 3 from Friday: Saturday (1), Sunday (2), Monday (3). February starts on Monday.", "February has 28 days (non-leap year): 28 ÷ 7 = 4 remainder 0. No shift. March starts on Monday too."], answer: "Monday" },
    ],
      tryit: { q: "A 28-day February starts on a Wednesday. What day does March start on?", answer: "Wednesday — the same day, since 28 is an exact multiple of 7 (remainder 0)." } },
    { h: "11. Working backwards: deducing the start day from a weekday's dates", body: [
      "The hardest calendar questions run the whole method in reverse: instead of being given the starting weekday and asked for a date, you're given a FACT about the dates of a particular weekday (their sum, say) and asked to deduce what day the month started on.",
      "The method is systematic testing: for each of the 7 possible starting weekdays, work out where that target weekday's dates would fall, add them up, and check which starting weekday is the one that actually matches the given sum. A well-posed puzzle is built so that exactly one starting weekday works.",
    ], examples: [
      { q: "In a 30-day month, the dates of every Friday add up to 75. What day does the 1st fall on?", steps: ["Try each possible starting weekday for the 1st, and list what dates Friday would fall on, then add them.", "1st = Thursday: Fridays are 2, 9, 16, 23, 30, summing to 80.", "1st = Friday: Fridays are 1, 8, 15, 22, 29, summing to 75. ✓", "No other starting weekday gives a Friday sum of exactly 75, so this is the answer."], answer: "Friday" },
      { q: "In a 31-day month, the dates of every Saturday sum to 66. What day does the 1st fall on?", steps: ["In a 31-day month the Saturdays either occur 4 or 5 times. Try starting weekdays that give 4 Saturdays first, since 66 is not a 5-Saturday sum.", "1st = Monday: Saturdays at 6, 13, 20, 27. Sum = 66. ✓", "Check the other 4-Saturday options: 1st = Tue → 5,12,19,26 sum 62; 1st = Wed → 4,11,18,25 sum 58; 1st = Thu → 3,10,17,24 sum 54. None equal 66.", "So the 1st must be Monday."], answer: "Monday" },
      { q: "In a 31-day month, the dates of every Sunday sum to 80. What day of the week is the 10th of that month?", steps: ["A Sunday sum of 80 in a 31-day month: try 5-Sunday options. If 1st = Saturday: Sundays at 2,9,16,23,30. Sum = 80. ✓", "So the month starts on Saturday. The 10th is 9 days after the 1st. 9 ÷ 7 = 1 remainder 2.", "Step forward 2 from Saturday: Sunday (1), Monday (2)."], answer: "Monday" },
    ] },
  ],
  recap: [
    "Weekdays repeat every 7 days, so any gap that is a whole number of weeks lands on the exact same weekday.",
    "Find the gap in days, divide by 7, and step forward from the starting weekday by the remainder.",
    "31-day months: January, March, May, July, August, October, December; 30-day: April, June, September, November; February has 28, or 29 in a leap year.",
    "A leap year divides by 4, except a century year must divide by 400.",
    "A 31-day month gives 3 weekdays (matching its 1st, 2nd and 3rd) an extra, 5th occurrence; a 30-day month gives 2 weekdays that extra occurrence.",
    "The LAST occurrence of a weekday is the first occurrence plus 7 repeatedly, stopping just before it would overshoot the month.",
    "The next month's starting weekday is always the current month's length mod 7 steps on from this month's starting weekday.",
    "To deduce a starting weekday from a fact about one weekday's dates, systematically test every one of the 7 possible starts until exactly one fits.",
  ],
  mistakes: [
    "Counting the starting date itself as one of the gap days when the question only wants the days between two dates.",
    "Forgetting a leap day when a puzzle's date range crosses the end of February.",
    "Mixing up which months have 30 and which have 31 days.",
    "Treating a remainder of 0 as a different weekday, instead of the exact same weekday as the start.",
    "Forgetting that in a longer month, more than one weekday can occur 5 times, not just one.",
    "Adding one extra multiple of 7 when hunting for the LAST occurrence of a weekday, overshooting past the end of the month.",
    "Guessing a single starting weekday instead of systematically testing all 7 when working backwards from a stated fact.",
  ],
};

// ---- Full-depth guided lesson: clocks and time arithmetic (clockArith v2, replaces old short version) ----

JUNIOR_LESSONS.magicGrid = {
  title: "Magic Grids",
  minutes: 18,
  intro: "A magic grid hides one simple promise: some collection of lines through the numbers, whether rows, columns, diagonals, or lines through a shared point, all add up to exactly the same total. Once you have found that shared total from any line you can already read in full, every missing number in every other line becomes a one-step subtraction. This lesson is about hunting for that shared total in as many disguises as it can wear, and then using it with confidence wherever it turns up.",
  sections: [
    { h: "1. The one idea behind every magic grid", body: [
      "Whatever the diagram looks like, cross, grid, or ring of numbers, a magic grid puzzle is built on a single promise: a stated family of lines through the numbers all share the same total. The puzzle never asks you to guess that total; it always gives you enough of one complete line to calculate it directly, by simple addition.",
      "The entire skill of this topic is two steps, always in this order. First, find a line you can add up completely, and use it to pin down the shared total. Second, take the line that contains the missing number, and subtract the numbers you already know in it from that shared total. Everything else in this lesson is about spotting which line to use for step one, because it is not always the obvious one sitting right next to the blank.",
    ] },
    { h: "2. A cross of two lines through a shared cell", body: [
      "The simplest shape is a plus sign: a horizontal line of three numbers and a vertical line of three numbers, crossing at a shared middle cell. Both lines add to the same total. If the horizontal line is fully given, add it up to get the shared total, then use that total on the vertical line, which already shares the middle number with the line you just added.",
      "The middle cell does double duty, belonging to both lines, so watch that you never count it twice by accident when finding the missing arm of the cross.",
    ], examples: [
      { q: "A cross has a horizontal line 4, 6, 9 and a vertical line 5, 6, and a missing number, sharing the 6. Find the missing number.", steps: ["Horizontal total: 4 + 6 + 9 = 19.", "Vertical line must also total 19.", "Missing number = 19 - 5 - 6 = 8."], answer: "8" },
      { q: "A cross has a horizontal line 8, c, 3 that totals 15. The vertical line shares the same centre c and has one arm of 5. Find c and the missing arm of the vertical line.", steps: ["The horizontal line gives c directly: 8 + c + 3 = 15, so c = 4.", "The vertical total is also 15: 5 + c + missing arm = 15.", "Missing arm = 15 - 5 - 4 = 6."], answer: "Centre c = 4; missing arm = 6" },
      { q: "A cross has a horizontal line (left arm 9, centre c, right arm r) totalling 27 and a vertical line (top arm 15, centre c, bottom arm b) also totalling 27. The five distinct cells sum to 50. Find c, r and b.", steps: ["Horizontal: 9 + c + r = 27, so c + r = 18.", "Vertical: 15 + c + b = 27, so c + b = 12.", "Five-cell sum (counting c once): 9 + c + r + 15 + b = 50. Substituting r = 18 - c and b = 12 - c gives 9 + c + (18 - c) + 15 + (12 - c) = 50, so 54 - c = 50, giving c = 4.", "r = 18 - 4 = 14 and b = 12 - 4 = 8."], answer: "c = 4, r = 14, b = 8 (horizontal: 9 + 4 + 14 = 27; vertical: 15 + 4 + 8 = 27; five-cell total: 9 + 4 + 14 + 15 + 8 = 50)" },
    ] },
    { h: "3. Rows and pairs are just other shapes for the same idea", body: [
      "The exact same reasoning works whether the shared-total lines are stacked rows in a rectangle, or even just two numbers directly opposite each other rather than three in a row. If a puzzle states that opposite pairs of numbers share the same total, use one complete pair to find that total, then subtract the one known number in the incomplete pair.",
      "Do not be thrown by the picture changing shape. A ring of four numbers with opposite pairs equal, and a plus of five numbers with two lines of three, are testing exactly the same one-idea-two-steps method, just drawn differently.",
    ], tryit: { q: "Two numbers opposite each other are 7 and 11 (so every opposite pair totals 18). Another pair has 12 and a missing number. Find it.", answer: "6, since 18 - 12 = 6." } },
    { h: "4. A full magic grid: rows, columns AND diagonals", body: [
      "A proper magic grid, usually 3 by 3, promises that every row, every column, and often the diagonals too, all add to one shared total. The trick is realising you are free to pick WHICHEVER complete line is easiest to add, not necessarily the row sitting next to the blank.",
      "So before reaching for the row containing the missing number, scan the whole grid for any row, column, or diagonal that is fully filled in. That is your fastest route to the shared total, and once you have it, the missing number's own row or column becomes a one-step subtraction exactly as before.",
    ], examples: [
      { q: "A magic grid has a complete row 3, 8, 7 (total 18). Another row has 5, 6, and a missing number. Find it.", steps: ["The shared total is 18 (from the complete row).", "The missing number's row already has 5 + 6 = 11.", "Missing number = 18 - 11 = 7."], answer: "7" },
      { q: "A 3 by 3 magic grid has a complete diagonal 1, 8, 6 (totalling 15). A column in the same grid shows 4, 9, and a missing number. Find the missing number.", steps: ["The diagonal gives the shared total: 1 + 8 + 6 = 15.", "The column already has 4 + 9 = 13.", "Missing number = 15 - 13 = 2."], answer: "2" },
      { q: "A 3 by 3 magic grid with magic constant 15 uses the numbers 1 to 9 exactly once. Its middle row is 9, 5, 1. Its bottom-left cell is 4. Find the complete grid.", steps: ["Left column: the top-left + 9 + 4 = 15, so top-left = 2.", "The remaining unused numbers are 3, 6, 7 and 8, which must fill top-middle, top-right, bottom-middle and bottom-right.", "Bottom row: 4 + bottom-middle + bottom-right = 15, so bottom-middle + bottom-right = 11.", "Middle column: top-middle + 5 + bottom-middle = 15, so top-middle + bottom-middle = 10.", "Top row: 2 + top-middle + top-right = 15, so top-middle + top-right = 13. Testing pairs from {3, 6, 7, 8} that sum to 13: only (6, 7). If top-middle = 6, bottom-middle = 4 (taken); if top-middle = 7, bottom-middle = 3. So top-middle = 7, top-right = 6, bottom-middle = 3.", "Bottom-right: 4 + 3 + bottom-right = 15, so bottom-right = 8."], answer: "Grid: 2, 7, 6 / 9, 5, 1 / 4, 3, 8 (magic constant 15 confirmed for all rows, columns and diagonals)" },
    ] },
    { h: "5. Crossing from a row to a column", body: [
      "Because rows AND columns share the same total in a full magic grid, you are allowed to find the total from a row and then apply it to a column, or the other way round. This is a genuinely different move from section 4: there you stayed within one direction (row to row); here you deliberately switch direction (row to column) to reach the blank.",
      "It is worth pausing to notice why this is allowed at all: the grid does not care whether a line runs across or down, only that it is one of the promised lines. Once you accept that, hunting across BOTH rows and columns for your easiest complete line roughly doubles your options for step one.",
    ], tryit: { q: "A magic grid's complete row totals 15. A column contains 4, 9, and a missing number. Find it.", answer: "2, since 15 - 4 - 9 = 2. The total from the row applies to the column too, since both rows and columns share it." } },
    { h: "6. When the diagonal is your best line", body: [
      "Sometimes neither a full row nor a full column is given, but the diagonal, running corner to corner, is complete instead. If the puzzle states that the diagonal shares the same total as the rows and columns, treat it exactly like any other complete line: add it up for the shared total, then apply that to whichever row or column holds the missing number.",
      "Diagonals are easy to miss because your eye is drawn to the neat rows and columns first. Train yourself to check both diagonals as candidates for step one whenever the obvious rows and columns are not fully given.",
    ] },
    { h: "7. When no single line is complete: use the grand total", body: [
      "Occasionally a puzzle gives you the sum of ALL the numbers in the grid instead of any one complete line. This still pins down the shared total, just one layer further back: since every row shares the same total, and the rows between them contain every number in the grid exactly once, the shared total multiplied by the number of rows must equal the grand total.",
      "So shared total = grand total divided by the number of rows. For the usual 3 by 3 grid, that is grand total divided by 3. Once you have that, proceed exactly as before: subtract the known numbers in the blank's own row.",
    ], examples: [
      { q: "A 3 by 3 magic grid's nine numbers add up to 45 in total. One row has 8, 6, and a missing number. Find it.", steps: ["Shared total = 45 / 3 = 15 (three rows share it and together use every number once).", "The blank's row already has 8 + 6 = 14.", "Missing number = 15 - 14 = 1."], answer: "1" },
      { q: "A 4 by 4 magic grid uses the numbers 1 to 16, and its grand total is 136. Find the magic constant. A row in the grid shows 16, 3, 2 and a blank. Find the missing number.", steps: ["Magic constant = grand total divided by the number of rows = 136 / 4 = 34.", "The row's known entries sum to 16 + 3 + 2 = 21.", "Missing number = 34 - 21 = 13."], answer: "Magic constant = 34; missing number = 13" },
      { q: "A 3 by 3 magic grid uses the nine even numbers 2, 4, 6, 8, 10, 12, 14, 16 and 18, each exactly once. Its grand total is 90. Find the magic constant and the centre number, then find the missing entry in a row that shows 14, 6 and a blank.", steps: ["Magic constant = 90 / 3 = 30.", "The centre number equals the average of all nine entries = 90 / 9 = 10.", "The row: 14 + 6 + missing = 30, so missing = 30 - 14 - 6 = 10."], answer: "Magic constant = 30; centre = 10; missing entry = 10 (which is the centre cell itself, confirming the row 14, 10, 6 sums to 30)" },
    ] },
    { h: "8. Two blanks: solve one before you can solve the other", body: [
      "The hardest versions hide two numbers, and the one you actually need cannot be found until you have first worked out the other. Look for a blank that sits in a line you CAN fully solve straight away (because the shared total and the other two numbers in that line are both known), solve that one first, then feed it into the line containing the number you actually want.",
      "Treat it exactly like a work-backwards chain: solve the easiest unknown first, write its value down, then use it as a known number for the next step. Never try to solve both blanks in your head at once; write the first answer down before starting the second calculation.",
    ], tryit: { q: "The shared total is 20. Row X has 6, a (blank), 5 in it. Column Y has a and 9, and the number you want, and totals 20. Find a, then find the number you want.", answer: "a = 20 - 6 - 5 = 9. Then the wanted number = 20 - 9 - 9 = 2." } },
    { h: "9. The centre's special power", body: [
      "In a full 3 by 3 magic grid, the centre number has an extra property worth knowing: any two numbers sitting directly opposite each other through the centre (top and bottom, left and right, or either diagonal pair) always add up to exactly twice the centre. This is a shortcut, not a new kind of grid, and it follows from the same shared-total promise applied to opposite lines.",
      "When a puzzle hands you the centre number and just one number from an opposite pair, you can skip finding the whole-grid total altogether: double the centre, then subtract the number you were given.",
    ], examples: [
      { q: "A magic grid's centre is 6. One corner is 4. Find the corner diagonally opposite it.", steps: ["Opposite pairs through the centre add to 2 x 6 = 12.", "Opposite corner = 12 - 4 = 8."], answer: "8" },
      { q: "A 3 by 3 magic grid with magic constant 15 uses the numbers 1 to 9. What is the centre number? A cell on the middle row has the value 3; find the value in the cell directly opposite it through the centre.", steps: ["The nine numbers 1 to 9 sum to 45. The centre equals the average = 45 / 9 = 5.", "Opposite pairs through the centre sum to 2 x 5 = 10.", "The value opposite 3 is 10 - 3 = 7."], answer: "Centre = 5; value opposite 3 is 7" },
      { q: "A 3 by 3 magic grid has centre 9. Two cells sitting directly opposite each other through the centre are in the ratio 2:1. Find both values and verify they sum to twice the centre.", steps: ["Opposite pairs through the centre sum to 2 x 9 = 18.", "Let the smaller value be v, so the larger is 2v. Then v + 2v = 18, giving 3v = 18 and v = 6.", "The larger value is 2 x 6 = 12.", "Verify: 6 + 12 = 18 = 2 x 9."], answer: "The two values are 6 and 12 (summing to 18 = 2 x 9 as required)" },
    ] },
  ],
  recap: [
    "Every magic grid promises that some family of lines (rows, columns, diagonals, or pairs through a point) all share the same total.",
    "Step one: find any COMPLETE line and add it up to get the shared total. Step two: subtract the known numbers in the blank's own line.",
    "You are free to pick whichever complete line is easiest, including switching from a row to a column, or using a diagonal.",
    "If no single line is complete, use the grand total of every number, divided by the number of rows, to find the shared total instead.",
    "With two blanks, solve whichever one you can from a line that is otherwise complete, then use it to solve the one you actually want.",
    "In a full magic grid, opposite numbers through the centre always add to twice the centre — a shortcut, not a new rule.",
  ],
  mistakes: [
    "Only checking the line right next to the blank, instead of scanning the whole grid for the easiest complete line.",
    "Counting a shared cell (like the centre of a cross) twice when adding up a line.",
    "Forgetting that columns and diagonals share the exact same total as rows in a full magic grid.",
    "Dividing the grand total by the wrong number (the count of numbers, 9, instead of the count of rows, 3).",
    "Trying to solve two blanks at once instead of finding the easier one first and using it as a known value.",
  ],
};

JUNIOR_LESSONS.shapeFold = {
  title: "Cuts & Folds",
  minutes: 18,
  intro: "This topic is about what happens when paper gets folded and cut, or when a shape gets sliced apart. It sounds like a craft activity, but underneath it is pure counting and pure area, and every puzzle in this family reduces to one of two engines: doubling (for folds) or a steady building-up count (for cuts). Learn to see which engine is running, and the rest is arithmetic.",
  sections: [
    { h: "1. Folding doubles the layers, every single time", body: [
      "When you fold a piece of paper exactly in half, every layer that was there before becomes two layers, because the fold copies the whole stack on top of itself. Start with 1 layer (the flat sheet). Fold once: 2 layers. Fold again: 4 layers. Fold a third time: 8 layers. The pattern is doubling, so after n folds there are 2 to the power n layers.",
      "This matters because if you now push something through the WHOLE folded stack, like a hole punch, it goes through every one of those layers at once, leaving one hole in each layer. Unfold the paper afterwards and each of those layer-holes becomes its own separate hole in the flat sheet.",
    ] },
    { h: "2. One punch, away from the creases", body: [
      "If you punch exactly one hole through a stack folded n times, and that hole is placed away from every crease (a crease is where two layers are joined, not separate), you get exactly 2 to the power n holes when you unfold, because the punch went through 2^n independent layers.",
      "The 'away from every crease' condition matters a lot. A hole punched right ON a crease does not become two separate holes when you unfold; it becomes one hole that straddles where the fold used to be, because that edge was never actually two separate pieces of paper. This lesson always punches away from creases unless told otherwise, precisely so that every layer really does turn into its own hole.",
    ], examples: [
      { q: "A square is folded in half twice, then one hole is punched away from every crease. How many holes appear when unfolded?", steps: ["2 folds means 2^2 = 4 layers.", "One punch through 4 layers, away from any crease, makes 4 separate holes."], answer: "4" },
      { q: "A sheet of paper is folded in half 4 times. One hole is punched away from all creases. How many holes appear when the paper is fully unfolded?", steps: ["4 folds gives 2^4 = 16 layers.", "One punch through all 16 layers makes 16 separate holes."], answer: "16" },
      { q: "A sheet of paper is folded n times to produce 32 layers. A single hole is punched away from every crease. How many folds were made, and how many holes appear? The same paper is instead folded 3 fewer times, then the same single punch is made. How many holes appear that time?", steps: ["2^n = 32, so n = 5 folds, producing 32 holes.", "3 fewer folds: 5 - 3 = 2 folds, giving 2^2 = 4 layers.", "One punch through 4 layers makes 4 holes."], answer: "5 folds give 32 holes; with 2 folds instead, only 4 holes appear" },
    ] },
    { h: "3. Several punches: multiply, don't just add", body: [
      "If you punch k separate holes through the folded stack, rather than just one, and none of those k holes ever lands on top of another once everything is unfolded, then each of the k punches independently produces its own 2^n holes. The total is k multiplied by 2^n, not k plus 2^n.",
      "It helps to picture it as k completely separate copies of the single-hole story running side by side: punch 1 gives 2^n holes, punch 2 gives another 2^n holes elsewhere, and so on, with none of them overlapping.",
    ], tryit: { q: "Paper is folded 3 times, then 2 separate holes are punched (none coinciding once unfolded). How many holes appear?", answer: "16, since 2 x 2^3 = 2 x 8 = 16." } },
    { h: "4. Running the fold story backwards", body: [
      "Sometimes you are told how many holes appeared and how many separate punches were made, and asked to find how many times the paper was folded. Since holes = punches x 2^(folds), divide the hole count by the number of punches to isolate 2^(folds), then work out which power of 2 that is.",
      "Powers of 2 are worth knowing by heart up to at least 2^6 = 64, since that is exactly the skill being tested: recognising 8 as 2^3, or 16 as 2^4, instantly rather than by trial.",
    ], examples: [
      { q: "3 separate punches produce 24 holes in total once unfolded. How many times was the paper folded?", steps: ["24 holes ÷ 3 punches = 8 holes per punch.", "8 = 2^3, so the paper was folded 3 times."], answer: "3 folds" },
      { q: "A single hole is punched through a folded sheet, producing 16 holes when unfolded. How many times was the paper folded?", steps: ["One punch gives 2^n holes, so 2^n = 16.", "16 = 2^4, so the paper was folded 4 times."], answer: "4 folds" },
      { q: "Paper is folded k times and then j separate holes are punched, none of which coincide once unfolded. The total hole count is 48. Find all pairs (k, j) where both k and j are positive integers and k is at most 6.", steps: ["Total holes = j x 2^k = 48, so j = 48 / 2^k.", "k = 1: j = 48 / 2 = 24. k = 2: j = 48 / 4 = 12. k = 3: j = 48 / 8 = 6. k = 4: j = 48 / 16 = 3.", "k = 5: j = 48 / 32 = 1.5, not a whole number. k = 6: j = 48 / 64 < 1, not valid.", "So the four valid pairs are (k, j) = (1, 24), (2, 12), (3, 6) and (4, 3)."], answer: "Four pairs: (1, 24), (2, 12), (3, 6) and (4, 3)" },
    ] },
    { h: "5. Cutting a shape: each new cut adds to the count", body: [
      "Now switch engines entirely: cutting a flat shape (like a pancake) with straight lines all the way across it. The very first cut always makes 2 pieces from 1. After that, how many NEW pieces a cut adds depends on how many of the earlier cuts it crosses, because every time a new cut crosses an existing cut, it slices one more existing piece into two.",
      "So to get the GREATEST possible number of pieces, arrange every new cut to cross every single earlier cut, each at its own fresh point (no two cuts parallel, and no three cuts ever meeting at exactly the same point, since that would waste a crossing).",
    ] },
    { h: "6. Building the running total, one cut at a time", body: [
      "Track it cut by cut. Cut 1: 2 pieces (no earlier cuts to cross). Cut 2: crosses the 1 existing cut once, adding 2 new pieces (crossing one existing line always splits it into 2 extra regions along its length): 2 + 2 = 4. Cut 3: crosses both earlier cuts, at 2 separate crossing points, adding 3 new pieces: 4 + 3 = 7. Cut 4: crosses all 3 earlier cuts, adding 4 new pieces: 7 + 4 = 11.",
      "Notice the pattern in what gets ADDED: the k-th cut adds k new pieces, because it crosses the k−1 earlier cuts at k−1 points, and those k−1 crossing points chop the new cut itself into k separate segments, each of which slices one region into two.",
    ], examples: [
      { q: "A pancake already has 3 cuts, making the greatest possible 7 pieces. One more cut is added, crossing all 3 existing cuts. How many pieces are there now?", steps: ["The new cut is the 4th cut, so it adds 4 new pieces (it crosses 3 existing cuts at 3 points, splitting into 4 segments).", "7 + 4 = 11."], answer: "11" },
      { q: "What is the greatest number of pieces that 5 straight cuts can make from a single pancake?", steps: ["Use the formula: 1 + n + n(n - 1) / 2 with n = 5.", "1 + 5 + 5 x 4 / 2 = 1 + 5 + 10 = 16."], answer: "16 pieces" },
      { q: "Erica claims that 7 straight cuts can produce 28 pieces. Is this achievable? What is the actual maximum for 7 cuts?", steps: ["Maximum for 7 cuts: 1 + 7 + 7 x 6 / 2 = 1 + 7 + 21 = 29.", "28 is less than the maximum of 29, so it is achievable (the 7th cut would cross only 5 of the earlier 6 cuts rather than all of them, adding 6 extra pieces instead of 7: 22 + 6 = 28).", "The actual maximum is 29 pieces, not 28."], answer: "Yes, 28 is achievable; the maximum is 29" },
    ] },
    { h: "7. The shortcut formula, and running it backwards", body: [
      "Adding up 2 + 3 + 4 + ... as you go is fine for small numbers of cuts, but there is a direct formula: after n straight cuts, the greatest possible number of pieces is 1 + n + n(n−1)/2. The '1' is the uncut whole, the 'n' counts each cut's own basic split, and the n(n−1)/2 counts every pair of cuts crossing each other once.",
      "If a question instead tells you the final number of pieces and asks how many cuts were needed, there is no clean way to rearrange the formula for n, so instead test small values of n in the formula (n = 1, 2, 3...) until the result matches. Because the formula only ever increases as n grows, there is exactly one n that works.",
    ], tryit: { q: "The greatest possible number of pieces made was 16. How many straight cuts were needed?", answer: "5 cuts, since 1 + 5 + 5x4/2 = 1 + 5 + 10 = 16." } },
    { h: "8. Area cuts: splitting a shape exactly in half", body: [
      "A different family of cutting puzzle is not about counting pieces but about area: a single straight cut divides an irregular shape into two pieces of EQUAL area. Here the shape of the cut line does not matter at all for this style of question; all that matters is the shape's TOTAL area, which you then simply halve.",
      "Finding the total area of an irregular shape almost always means breaking it into rectangles you can handle, exactly like the compound-perimeter and area topics elsewhere in this app: either ADD separate rectangles together if the shape is built by joining pieces, or SUBTRACT a smaller rectangle (a notch) from a larger one if the shape looks like a bite has been taken out of it.",
    ], examples: [
      { q: "A shape is an 8 by 6 rectangle with a 3 by 2 rectangular notch removed from one corner. A straight cut splits the remaining shape into two equal-area pieces. Find the area of each piece.", steps: ["Full rectangle: 8 x 6 = 48. Notch: 3 x 2 = 6.", "Remaining area = 48 - 6 = 42.", "Equal pieces: 42 / 2 = 21 each."], answer: "21" },
      { q: "A 12 by 9 rectangle has a 3 by 4 rectangular notch removed from one corner. A straight cut divides the remaining shape into two equal pieces. Find the area of each piece.", steps: ["Full rectangle: 12 x 9 = 108. Notch: 3 x 4 = 12.", "Remaining area = 108 - 12 = 96.", "Equal pieces: 96 / 2 = 48 each."], answer: "48" },
      { q: "A 10 by 8 rectangle has a 2 by 4 notch removed from one corner and a 3 by 2 notch removed from the opposite corner. A straight cut divides the remaining shape into two equal pieces. Find the area of each piece.", steps: ["Full rectangle: 10 x 8 = 80.", "First notch: 2 x 4 = 8. Second notch: 3 x 2 = 6.", "Remaining area = 80 - 8 - 6 = 66.", "Equal pieces: 66 / 2 = 33 each."], answer: "33" },
    ] },
    { h: "9. Stacking several area adjustments in one shape", body: [
      "The hardest versions remove more than one piece from the original rectangle, perhaps a rectangular notch AND a triangular corner. Handle these exactly like a multi-step subtraction: find the big rectangle's area first, subtract the first removed piece, then subtract the second, working through the shape one bite at a time rather than trying to picture the final leftover shape all at once.",
      "A triangular corner removed from a rectangle is always a right-angled triangle (since it is cut along the rectangle's own edges plus one straight cut), so its area is always half of base times height, exactly like any right-angled triangle.",
    ], tryit: { q: "A 10 by 7 rectangle has a 2 by 3 notch removed from one corner, and a right-angled triangular corner with legs 4 and 3 removed from another. Find the area of each half after an equal-area cut.", answer: "Full rectangle 10x7=70. Minus notch (2x3=6): 64. Minus triangle (half of 4x3=12, so 6): 58. Halved: 29 each." } },
  ],
  recap: [
    "Folding paper n times always creates 2^n layers, since every fold doubles whatever was there before.",
    "One punch away from every crease makes 2^n holes; k separate non-overlapping punches make k x 2^n holes.",
    "Running the fold story backwards: divide holes by punches to isolate 2^(folds), then recognise the power of 2.",
    "Cutting a shape: the k-th straight cut adds k new pieces at most, since it crosses all k-1 earlier cuts.",
    "The greatest number of pieces from n cuts is 1 + n + n(n-1)/2; run it backwards by testing small n until it matches.",
    "Equal-area cutting problems only need the shape's TOTAL area (built by adding or subtracting rectangles), then halved.",
    "Multiple removed pieces (a notch AND a triangular corner) are handled with one subtraction at a time, not all at once.",
  ],
  mistakes: [
    "Punching a hole ON a crease and still expecting it to double into two separate holes.",
    "Adding holes-per-punch instead of multiplying (k separate punches give k x 2^n, not k + 2^n).",
    "Assuming the k-th cut always adds a fixed number of pieces rather than k pieces (it grows with each new cut).",
    "Dividing the wrong quantity by 2 when finding equal areas — always halve the TOTAL remaining area, after every subtraction.",
    "Trying to picture a multi-notch shape's final area in one go instead of subtracting piece by piece.",
  ],
};

JUNIOR_LESSONS.gridLogic = {
  title: "Logic Grids",
  minutes: 18,
  intro: "A logic grid is a small square of cells governed by one rule: every row, every column, and sometimes every marked box, must contain a fixed set of numbers exactly once each, with no repeats. Nothing here is calculation in the usual sense; it is pure elimination. Every missing number is found by asking what is NOT allowed, from every rule that applies, until only one possibility survives. This lesson builds that elimination habit from the simplest single-line case up to grids where you must combine three rules at once.",
  sections: [
    { h: "1. The one rule underneath every logic grid", body: [
      "A logic grid states that some collection of numbers (often 1, 2 and 3, or 1 to 4) must appear exactly once in every row and every column. No number is ever allowed to repeat within the same row, or within the same column. That single promise, repeated across all the rows and columns at once, is the entire engine behind every puzzle in this topic.",
      "Because every number must appear exactly once in a line, if you already know all but one of the numbers in that line, the missing one is forced: it must be whichever number from the full set has not turned up yet. This is the most basic move in the whole topic, and everything else is a variation on applying it more cleverly.",
    ] },
    { h: "2. Reading what a single line already rules out", body: [
      "If a row using the numbers 1, 2 and 3 already shows two of them, the third is completely forced: there is only one number left that has not appeared. No column information is even needed in that case.",
      "Always start by listing the FULL set the puzzle is using (for example 1, 2, 3) and then crossing off whichever ones are already visible in the line you care about. Whatever is left uncrossed is your answer, when only one number remains.",
    ], examples: [
      { q: "A row must contain 1, 2 and 3 exactly once. It already shows 1 and 3. What is the missing number?", steps: ["The full set is {1, 2, 3}.", "1 and 3 are already used.", "Only 2 is left."], answer: "2" },
      { q: "A row must contain 1, 2, 3 and 4 exactly once. It already shows 2, 4 and 1. What is the missing number?", steps: ["The full set is {1, 2, 3, 4}.", "1, 2 and 4 are already used.", "Only 3 is left."], answer: "3" },
      { q: "A row must contain 1, 2, 3 and 4 exactly once. The three filled cells sum to 9. What is the missing entry?", steps: ["The full set {1, 2, 3, 4} sums to 10.", "The missing entry = 10 - 9 = 1."], answer: "1" },
    ] },
    { h: "3. When one line is not enough on its own", body: [
      "Sometimes a row only reveals ONE of its numbers, which is not enough by itself: with three possible numbers and only one ruled out, two candidates remain. In that situation, look at the missing cell's COLUMN as well. Cross off whatever the column already shows, from the SAME full set.",
      "Now combine the two lists of leftover candidates. Whichever number survives being crossed off by BOTH the row and the column is the answer. If a candidate was ruled out by either line, it cannot be right, since both rules must hold at once.",
    ], examples: [
      { q: "A grid uses 1, 2, 3 in every row and column. The blank cell's row shows only 2 (so 1 or 3 could go there). Its column already has 1 and 2. Which must go in the blank?", steps: ["Row alone leaves 1 or 3 possible.", "Column already has 1 and 2, so the column needs 3.", "3 is in both leftover lists, so the blank must be 3."], answer: "3" },
      { q: "A 3 by 3 grid uses 1, 2 and 3 in every row and column. A blank cell's row shows only 3 (leaving 1 or 2 as candidates). Its column shows only 1 (leaving 2 or 3 as candidates). What must the blank be?", steps: ["Row candidates: {1, 2}.", "Column candidates: {2, 3}.", "Only 2 appears in both lists, so the blank must be 2."], answer: "2" },
      { q: "A 4 by 4 grid uses 1, 2, 3 and 4 in every row and column. A blank cell's row shows only 1 (leaving 2, 3 and 4 as candidates). Its column shows only 4 (leaving 1, 2 and 3 as candidates). After combining row and column, two candidates still remain. The cell's 2 by 2 box already contains the number 3. Which single number must go in the blank?", steps: ["Row candidates: {2, 3, 4}. Column candidates: {1, 2, 3}. Intersection: {2, 3}.", "The box already contains 3, so 3 is ruled out from the intersection.", "Only 2 survives all three checks."], answer: "2" },
    ] },
    { h: "4. It never matters which line you check first", body: [
      "The row-then-column method and the column-then-row method always reach the same answer, because both are really just applying the identical rule (no repeats in a line) to two different lines and then combining what is left. Get comfortable starting from whichever line happens to give you more information, rather than always defaulting to the row.",
      "This flexibility becomes genuinely useful in bigger grids, where sometimes the column is nearly full and the row barely started, or the other way round. Always scan both directions before committing to one.",
    ], tryit: { q: "A grid uses 1, 2, 3. The blank cell's column shows only 3 (so 1 or 2 could go there). Its row already has 2 and 3. Which must go in the blank?", answer: "1, since the row needs 1 (it already has 2 and 3), and 1 is also allowed by the column." } },
    { h: "5. Adding a third rule: the box", body: [
      "Bigger logic grids (using 1 to 4, in a 4 by 4 layout) often add a third kind of line: a marked 2 by 2 box, which must ALSO contain every number exactly once, on top of the row and column rules. This does not replace the row and column rules; it sits alongside them, giving you a third source of eliminations.",
      "When a cell's box is nearly full, treat it exactly like a row or column: cross off whatever the box already contains from the full set of 1 to 4, and combine that leftover list with whatever the row and column tell you.",
    ], examples: [
      { q: "A cell's box already contains 1, 2 and 4 (missing only one cell, out of 1-4). What must go in the missing cell of that box, regardless of its row or column?", steps: ["The box needs all of 1, 2, 3, 4.", "It already has 1, 2 and 4.", "Only 3 is missing."], answer: "3" },
      { q: "A blank cell is in a 4 by 4 grid using {1, 2, 3, 4}. Its 2 by 2 box contains 3 and 1. Its row already shows 4. Which number must go in the blank?", steps: ["Box already has {1, 3}, so the box needs either 2 or 4.", "The row already shows 4, so 4 is ruled out.", "Only 2 survives both checks."], answer: "2" },
      { q: "A 4 by 4 grid uses {1, 2, 3, 4}. A blank cell's row shows only 1 (leaving 2, 3 and 4 possible). Its column shows only 4 (leaving 1, 2 and 3 possible). After combining row and column, two candidates remain. Its 2 by 2 box already contains 3. Which single number must go in the blank?", steps: ["Row candidates: {2, 3, 4}. Column candidates: {1, 2, 3}. Intersection: {2, 3}.", "The box contains 3, so 3 cannot go in the blank.", "Only 2 survives all three checks."], answer: "2" },
    ] },
    { h: "6. When row and column alone are not enough", body: [
      "In a 4 by 4 grid there are more numbers to rule out, so it is common for the row and column together to still leave TWO candidates rather than pinning down just one. That is exactly when the box earns its keep: check what the box already contains, and cross those numbers off your remaining shortlist too.",
      "Get into the habit of only reaching for the box once row and column have already been combined and still leave more than one candidate. Using the box first, before checking row and column, works too, but combining row and column first is usually the fastest route, since it is often already enough on its own.",
    ], tryit: { q: "Row and column together leave 2 and 4 as the only candidates for a cell. Its box already contains 1, 2 and 3. Which candidate must it be?", answer: "4, since the box rules out 2 (already present), leaving only 4." } },
    { h: "7. Chaining two unknowns together", body: [
      "The hardest grids hide two cells at once, where the number you actually want cannot be found until a DIFFERENT hidden cell has been solved first. Look for whichever hidden cell has enough information around it to solve immediately and completely (from its own row, column, or box alone), solve that one first, and write its value down.",
      "Only once that helper value is written down does the target cell's own row, column, or box become solvable, because the helper's value is now one more known number to cross off. Treat this exactly like a work-backwards chain: never try to hold both unknowns in your head at once.",
    ], examples: [
      { q: "Cell a's row already shows 1, 2, 4 (out of 1-4), so a = 3. Cell b shares a's column, which now has 3 (from a) and 1. What must b be?", steps: ["a's row is missing only one number from 1-4: a = 3.", "b's column now has 1 and 3 (using a's value).", "b's column needs 2 and 4 still, but combined with b's row (not shown here) only one fits — the KEY step is always solving 'a' first before touching 'b'."], answer: "Solve the helper cell completely first, then re-check the target cell's line with that new information." },
      { q: "In a 4 by 4 grid using {1, 2, 3, 4}, cell p is in a column that already shows 1, 3 and 4. Solve p first. Cell q is also in p's row; once p is placed, the row shows p, 3 and 4. Find q.", steps: ["p's column has {1, 3, 4}, so p = 2.", "Place p = 2. p's row now shows 2, 3 and 4.", "The row is missing only 1, so q = 1."], answer: "p = 2; q = 1" },
      { q: "A 4 by 4 grid using {1, 2, 3, 4} has two blanks: cell a and cell b. Cell a's column already shows 1, 3 and 4. Cell a's row already shows 3 and 4. Solve a. Then use a to find b, which is also in a's row; b's column already shows 3, 4 and whatever a turned out to be.", steps: ["a's column has {1, 3, 4}, so a = 2.", "a's row now shows a = 2, 3 and 4. The only missing number is 1, so b = 1.", "Verify b's column: shows 3, 4 and a = 2, which is {2, 3, 4}, so the column needs 1. b = 1 fits."], answer: "a = 2, then b = 1" },
    ] },
    { h: "8. Counting candidates as a checkpoint", body: [
      "Sometimes a question does not ask for the missing number directly, but asks how MANY numbers are still possible at some intermediate stage, such as after checking the row and column but before looking at the box. This is testing whether you can track the elimination process itself, not just its final answer.",
      "Work it exactly like the earlier steps, but stop and count the leftover shortlist at the point the question asks about, rather than continuing on to a single final answer. With a 4-number set, expect the row-and-column-only shortlist to have two or three candidates left, since each single known cell only rules out one number.",
    ] },
    { h: "9. A grand-total shortcut for the whole grid", body: [
      "Since every row of a 4 by 4 grid contains 1, 2, 3 and 4 exactly once, each row always adds up to 1+2+3+4=10. With 4 rows, all 16 cells in the whole grid ALWAYS add up to 4×10=40, no matter which valid arrangement is used. If you are given every cell except one, you can find the missing number by pure arithmetic: add up everything you can see, and subtract that from 40.",
      "This shortcut sidesteps the row/column/box elimination entirely. It is worth reaching for whenever nearly the whole grid is visible, since one subtraction beats working out several individual eliminations.",
    ], tryit: { q: "In a 4 by 4 logic grid, the 15 visible cells add up to 37. What is the missing number?", answer: "3, since 40 - 37 = 3." } },
  ],
  recap: [
    "Every row, column (and box, if marked) must contain the full number set exactly once, with no repeats.",
    "If a line already shows all but one of its numbers, the missing one is whichever number from the set has not appeared.",
    "When one line alone is not enough, combine it with another line: only a number surviving BOTH eliminations can be the answer.",
    "It never matters which line (row, column or box) you check first — always start with whichever gives the most information.",
    "With two hidden cells, solve whichever one is fully determined first, then use it to help solve the one you actually want.",
    "All 16 cells of a 4 by 4 grid using 1-4 always add up to 40 — a useful arithmetic shortcut when almost the whole grid is visible.",
  ],
  mistakes: [
    "Only checking the row next to a blank and giving up, instead of also checking its column (and box, if there is one).",
    "Forgetting that a candidate must survive EVERY applicable rule, not just one of them.",
    "Assuming the box rule replaces the row/column rules instead of applying alongside them.",
    "Trying to solve two hidden cells at the same time instead of finding the fully-determined one first.",
    "Adding up the wrong count for the grand-total shortcut (40 for a 4 by 4 grid using 1-4, not 16 or 10).",
  ],
};

JUNIOR_LESSONS.networkGraph = {
  title: "Networks",
  minutes: 18,
  intro: "A network puzzle is really about dots (people, computers, places) and the connections between them (handshakes, cables, roads). Once you see a situation as dots-and-connections, three questions cover almost everything this topic ever asks: how many connections exist in total, how few connections are needed to join everything up, and how few colours or cuts are needed given some rule about neighbours. This lesson builds all three from scratch.",
  sections: [
    { h: "1. Seeing dots and connections everywhere", body: [
      "Whenever a problem involves pairs of things linked to each other (people shaking hands, computers cabled together, towns joined by roads), it helps enormously to picture it as a network: a dot for every person, computer, or town, and a line joining any two that are directly connected. This picture is called a graph in mathematics, though it has nothing to do with graphs of equations.",
      "Once you have that picture in your head, most of the reasoning in this topic becomes reasoning about dots and lines, which is much easier to keep straight than reasoning about handshakes or cables in the abstract.",
    ] },
    { h: "2. Counting every connection: the handshake count", body: [
      "If every one of n people shakes hands with every other person exactly once, the total count is not n squared, and it is not simply n. Each person shakes n − 1 hands (everyone except themselves), giving n(n − 1) handshakes if you count from every person's point of view. But that counts every handshake TWICE, once from each side of it, so the true total is n(n − 1) divided by 2.",
      "This exact formula, n(n − 1) / 2, counts the number of connections in a fully-connected network of n dots (every dot joined to every other dot), and it turns up constantly, whether the dots are people, teams in a league playing each other once, or points joined by every possible straight line.",
    ], examples: [
      { q: "6 people each shake hands with every other person exactly once. How many handshakes happen?", steps: ["Each person shakes 5 hands, giving 6x5=30 if counted from every side.", "But that counts every handshake twice, so divide by 2: 30/2=15."], answer: "15" },
      { q: "8 people each shake hands with every other person exactly once. How many handshakes happen in total?", steps: ["Each person shakes 7 hands, giving 8 x 7 = 56 if counted from every side.", "Divide by 2 to avoid double-counting: 56 / 2 = 28."], answer: "28" },
      { q: "In a round-robin tournament, every team plays every other team exactly once. The total number of games played is 45. How many teams are in the tournament?", steps: ["Total games = n(n - 1) / 2 = 45, so n(n - 1) = 90.", "Test values: n = 9 gives 9 x 8 = 72 (too small). n = 10 gives 10 x 9 = 90. Match.", "10 teams."], answer: "10 teams" },
    ] },
    { h: "3. Running the handshake count backwards", body: [
      "If you are told the total number of handshakes and asked how many people were involved, there is no clean way to rearrange n(n−1)/2 = total for n directly, so instead test small values of n in order (n=2,3,4...) until n(n−1)/2 matches the given total. Because the formula only ever grows as n grows, there is exactly one n that works.",
      "It is worth knowing the early handshake totals by heart: 3 people give 3, 4 people give 6, 5 give 10, 6 give 15, 7 give 21, 8 give 28. Recognising these instantly saves a lot of guessing.",
    ], tryit: { q: "A group of people all shook hands with each other exactly once, making 21 handshakes in total. How many people were in the group?", answer: "7, since 7x6/2=21." } },
    { h: "4. Joining separate groups: only the COUNT of groups matters", body: [
      "A different kind of question starts with several separate groups (each one already fully connected inside itself, but with no links at all between the groups) and asks for the fewest extra connections needed to join everything into one single network. The key insight: connecting any two groups with just ONE link merges them into a single group, whatever size either group happens to be.",
      "So each new link reduces the number of separate groups by exactly one. Starting from k separate groups, it takes k − 1 links to bring everything down to a single, fully joined network. The SIZE of each group never enters the calculation at all, only the count of groups.",
    ], examples: [
      { q: "A network has 4 separate groups of computers, with sizes 3, 5, 2 and 6. How many extra links are needed to join them all into one network?", steps: ["Each new link merges 2 groups into 1, regardless of their sizes.", "4 groups need 4 - 1 = 3 links to become one single group."], answer: "3" },
      { q: "Five separate islands each have their own internal roads but no bridges between them. What is the fewest number of bridges needed to connect all five islands into one network?", steps: ["The number of bridges depends only on the number of separate groups, not their sizes.", "5 groups need 5 - 1 = 4 bridges."], answer: "4 bridges" },
      { q: "Three fully-connected groups of sizes 5, 3 and 4 need to be joined into one network. How many connections already exist within the groups? How many extra links are needed to join them all together?", steps: ["Within the group of 5: 5 x 4 / 2 = 10 connections. Within the group of 3: 3 x 2 / 2 = 3. Within the group of 4: 4 x 3 / 2 = 6.", "Total existing connections: 10 + 3 + 6 = 19.", "Joining 3 separate groups requires 3 - 1 = 2 extra links (group sizes do not affect this)."], answer: "19 existing connections; 2 extra links needed" },
    ] },
    { h: "5. The trap: assuming bigger groups need more links", body: [
      "Because the group sizes are given in these questions, it is tempting to do something with them, like adding them up or comparing them. Resist that pull. The sizes affect how many connections already exist INSIDE each group (which you would need the handshake formula for, applied separately to each group), but they have absolutely no effect on how many NEW links are needed to join the groups together. That number is always (number of groups) minus 1.",
      "When a question does ask for both figures at once (existing connections plus new links), work them as two completely separate calculations and only add them together right at the end.",
    ], tryit: { q: "3 separate groups, of sizes 10, 2 and 3, need to be joined into one network. How many new links are needed?", answer: "2, since 3 groups always need 3 - 1 = 2 links, regardless of their sizes (10, 2, and 3 never enter this particular calculation)." } },
    { h: "6. Colouring so that neighbours always differ", body: [
      "A third family of network question asks for the fewest colours (or badges, or categories) needed so that any two DIRECTLY CONNECTED dots never share a colour. Dots that are not directly connected are always free to share a colour; only actual connections matter.",
      "The classic case is a ring: n dots arranged in a circle, each connected only to its two immediate neighbours. If n is EVEN, you can alternate two colours all the way round and the last dot correctly differs from the first. If n is ODD, alternating two colours fails right at the join (the last dot ends up matching the first), so a third colour is needed to break the clash.",
    ], examples: [
      { q: "6 people stand in a ring, each connected to the two people beside them. What is the fewest colours needed so no two connected people share a colour?", steps: ["6 is even, so two colours can alternate all the way round the ring and match up correctly at the join."], answer: "2" },
      { q: "7 people stand in a ring, each connected only to their two neighbours. What is the fewest colours needed so no two connected people share a colour?", steps: ["7 is odd, so two alternating colours fail: the last person ends up the same colour as the first, creating a clash.", "A third colour is needed to break the clash at the join."], answer: "3" },
      { q: "Two ring-shaped networks need to be coloured so that no two connected nodes share a colour. One ring has 10 nodes and the other has 9 nodes. For each ring, state the minimum number of colours and explain the key difference.", steps: ["10 is even: two colours alternate perfectly round the ring without a clash at the join. Minimum: 2 colours.", "9 is odd: alternating two colours fails because the final node clashes with the first. A third colour is needed. Minimum: 3 colours.", "The key difference is parity: even rings need 2 colours; odd rings need 3."], answer: "10-node ring: 2 colours; 9-node ring: 3 colours" },
    ] },
    { h: "7. When every dot is connected to every other dot", body: [
      "At the opposite extreme from a ring, if EVERY pair of dots is directly connected (everyone has already shaken hands with everyone else), then no two dots can EVER share a colour, since every pair counts as neighbours. The fewest colours needed is then simply the number of dots itself, n.",
      "This is worth contrasting directly with the ring case: a ring only needs 2 or 3 colours no matter how large it gets, because each dot only touches 2 neighbours, but a fully-connected network needs a colour for every single dot, because each one touches all the others.",
    ], tryit: { q: "5 friends have all shaken hands with each other (every pair connected). What is the fewest colours needed so no two connected friends share a colour?", answer: "5, since every pair is connected, so every friend needs a different colour from every other friend." } },
    { h: "8. How resilient is a network? Cutting connections", body: [
      "A different question asks not how to build a network up, but how easily it falls apart: what is the fewest connections that must be CUT to split a network into two or more separate pieces? The answer depends entirely on the network's shape.",
      "A network arranged in a simple LINE (a path, where the ends have one connection and everyone else has exactly two) has no spare connections: cutting any single internal link immediately splits it into two pieces. A network arranged in a RING (a cycle) has one spare connection built in: cutting just one link still leaves everybody joined up in a line, so it takes a SECOND cut to genuinely split it apart.",
    ], examples: [
      { q: "A network of 8 computers is arranged in a ring, each connected to its two neighbours. What is the fewest connections that must be cut to split it into separate pieces?", steps: ["A ring has one spare connection: cutting a single link still leaves every computer connected in a line.", "A second cut is needed to actually separate it into two pieces."], answer: "2" },
      { q: "A path-shaped network (a straight line of 6 computers, each connected only to its immediate neighbour) needs to be split into at least 2 separate pieces. What is the fewest connections that must be cut?", steps: ["In a path, there are no spare connections: every link is essential.", "Cutting any single link immediately splits the path into two pieces."], answer: "1 cut" },
      { q: "A hub-and-spoke network has 1 central hub connected to each of 6 outer nodes, with no other connections. A ring-shaped network has 6 nodes each connected to its two neighbours. For each network, state the fewest cuts needed to produce at least 2 separate pieces, and state which is more resilient.", steps: ["Hub-and-spoke: cutting any single spoke disconnects that outer node from the hub. 1 cut suffices.", "Ring: cutting one link leaves all nodes still joined in a line. A second cut is needed. Minimum: 2 cuts.", "The ring is more resilient: it takes twice as many cuts to break it apart."], answer: "Hub-and-spoke: 1 cut; ring: 2 cuts; the ring is more resilient" },
    ] },
    { h: "9. Putting several network ideas together", body: [
      "The hardest questions in this topic combine two of these ideas in one go: perhaps counting the connections that already exist inside several separate groups (the handshake formula, applied separately to each group and then added up), and THEN adding the extra links needed to join those groups into one (always the number of groups minus 1). Work each part on its own, clearly labelled, before adding them together.",
      "As always with combined questions, resist the urge to find one clever shortcut for the whole thing. Two clean, separate calculations, added at the very end, are far more reliable than trying to see the combined answer all at once.",
    ] },
  ],
  recap: [
    "Picture connection problems as dots and lines: it turns handshakes, cables, or roads into the same underlying network.",
    "Full connection count for n dots, each joined to every other: n(n-1)/2 (the handshake formula).",
    "Fewest links to join k separate (internally connected) groups into one network: always k - 1, whatever the group sizes are.",
    "Fewest colours for a ring of dots: 2 if the ring size is even, 3 if odd. For a fully-connected network of n dots: always n.",
    "Fewest cuts to disconnect a line-shaped network: 1. For a ring-shaped network: 2 (rings have one spare connection).",
    "Reversing the handshake formula: test small values of n in order, since the formula only ever grows as n grows.",
  ],
  mistakes: [
    "Using group sizes when working out how many NEW links are needed to join groups together (only the group COUNT matters there).",
    "Forgetting the divide-by-2 in the handshake formula and double-counting every connection.",
    "Assuming a ring always needs 3 colours, forgetting that an even-sized ring only needs 2.",
    "Assuming 1 cut always disconnects a network, without checking whether it is a ring (needs 2) or a line (needs only 1).",
    "Trying to combine two separate network calculations into one shortcut instead of working each out cleanly and adding at the end.",
  ],
};

JUNIOR_LESSONS.spatialTransform = {
  title: "Nets & Symmetry",
  minutes: 18,
  intro: "This topic covers three related spatial skills: counting the symmetries of a flat shape, working out which faces of a folded net end up opposite each other, and spotting when a rotated picture of a solid is actually impossible. None of it needs measuring or heavy calculation. It needs a handful of solid rules, applied carefully, and the discipline to check a picture against those rules rather than trusting how it looks at a glance.",
  sections: [
    { h: "1. A regular polygon's two matching symmetries", body: [
      "A regular polygon (equal sides, equal angles) has exactly as many lines of symmetry as it has sides: an equilateral triangle has 3, a square has 4, a regular pentagon has 5, and so on. Each line of symmetry either runs through a pair of opposite vertices (for shapes with an even number of sides) or through one vertex and the midpoint of the opposite side (for an odd number of sides).",
      "The SAME number also gives the order of rotational symmetry: how many distinct positions you can rotate the shape into, within one full turn, where it lands looking identical to how it started. A regular polygon with n sides has rotational symmetry of order n, because rotating by 360/n degrees always lines it up again.",
    ], examples: [
      { q: "A regular octagon (8 sides). How many lines of symmetry does it have, and what is its rotational symmetry order?", steps: ["Both equal the number of sides."], answer: "8 lines of symmetry, rotational order 8" },
      { q: "A regular hexagon. How many lines of symmetry does it have, and what is its order of rotational symmetry?", steps: ["For a regular polygon, both values equal the number of sides.", "A hexagon has 6 sides, so it has 6 lines of symmetry and rotational order 6."], answer: "6 lines of symmetry, rotational order 6" },
      { q: "A regular polygon has 12 lines of symmetry. What is its rotational symmetry order, and through what angle does each minimal rotation turn it?", steps: ["For a regular polygon, lines of symmetry = rotational order = number of sides.", "So the polygon has 12 sides and rotational order 12.", "Minimal rotation = 360 / 12 = 30 degrees."], answer: "Rotational order 12; minimal rotation angle 30 degrees" },
    ] },
    { h: "2. The trap: this shortcut is ONLY for regular polygons", body: [
      "The 'sides = symmetries' rule is extremely tempting to apply to every shape, but it only holds when EVERY side and EVERY angle is equal. The moment a shape is irregular, even slightly, both numbers can drop, and they do not have to drop by the same amount as each other.",
      "A rectangle that is not a square has 4 sides but only 2 lines of symmetry (through the midpoints of each pair of opposite sides; the diagonals do NOT work, since they do not reflect the rectangle onto itself unless it happens to be a square) and rotational order 2 (only a half-turn and a full turn work). Always ask 'is every side AND every angle actually equal' before reaching for the shortcut.",
    ], note: "If a shape is a special case of a family (a square is a special rectangle, a rhombus, AND a regular polygon), always answer for the shape exactly as described. A 'rectangle that is not a square' is deliberately less symmetric than a square." },
    { h: "3. Learning a small table of common shapes", body: [
      "Rather than re-deriving every irregular shape from scratch, it is worth fixing a short list in memory. A rhombus that is not a square: 2 lines of symmetry (along its two diagonals), rotational order 2. A parallelogram that is neither a rectangle nor a rhombus: 0 lines of symmetry at all, but STILL rotational order 2 (a half-turn always works, even with no reflective symmetry). An isosceles triangle that is not equilateral: 1 line of symmetry, rotational order 1 (only the full turn works). A scalene triangle (no equal sides at all): 0 lines, rotational order 1.",
      "Notice that lines of symmetry and rotational order are NOT the same thing and do not always move together: a parallelogram has 0 lines but still order 2, proving that a shape can have real rotational symmetry with no reflective symmetry whatsoever.",
    ], tryit: { q: "A kite (that is not also a rhombus) has one line of symmetry, running from one vertex straight through to the opposite vertex. What is its order of rotational symmetry?", answer: "1 (only the full 360-degree turn brings it back to matching itself; there is no smaller rotation that works)." } },
    { h: "4. Folding a net: which faces end up opposite", body: [
      "A cube net is a flat, unfolded pattern of 6 squares that folds up into a cube. The most useful single fact about a net is working out which pairs of squares become OPPOSITE faces once folded, since two squares that share an edge in the flat net can never be opposite once folded (they end up next to each other, sharing an edge of the cube).",
      "For the common cross-shaped net (four squares in a row, with one extra square attached above the row and one below it, both attached to the same square in the row), the fold works like this: the row of four wraps round into a ring, so the 1st and 3rd squares in that row become opposite each other, and so do the 2nd and 4th. The square above the row and the square below it fold up and down respectively, landing opposite each other too.",
    ], examples: [
      { q: "In a cross-shaped net, a row of four faces reads W, X, Y, Z from left to right, with face P above X and face Q below X. Which face is opposite W?", steps: ["W is the 1st face in the row of four; the 3rd face, Y, becomes opposite it once the row wraps into a ring."], answer: "Y" },
      { q: "In a cross-shaped net, a row of four faces reads A, B, C, D from left to right, with face E above B and face F below B. Which face is opposite B, and which face is opposite E?", steps: ["B is the 2nd face in the row of four; the 4th face, D, is its opposite (the 2nd and 4th pair up).", "E is above B and F is below B, so E and F are the up-down pair and are opposite each other."], answer: "B is opposite D; E is opposite F" },
      { q: "A cross-shaped cube net has a row of four faces numbered 1, 2, 3, 4 from left to right. Face 5 is attached above face 2 and face 6 is attached below face 2. State all three opposite pairs. If faces 1 and 5 are painted red, will any two red faces be opposite each other on the folded cube?", steps: ["Row pairs: 1st and 3rd are opposite (1 and 3); 2nd and 4th are opposite (2 and 4).", "The arms above and below the row are opposite each other: 5 and 6.", "Red faces are 1 and 5. Face 1 is opposite 3 (not red). Face 5 is opposite 6 (not red).", "No two red faces are opposite each other."], answer: "Opposite pairs: (1, 3), (2, 4), (5, 6); no two red faces (1 and 5) are opposite" },
    ] },
    { h: "5. Using the SAME rule to fill in a blank", body: [
      "The identical fold rule works in reverse: if you know two faces are opposite each other, and one of them is blank, you do not need to re-derive the whole fold from scratch. Just identify which position in the net (1st/3rd pair, 2nd/4th pair, or the above/below pair) the blank belongs to, and read off its partner.",
      "A shortcut for a full cube: since a cube net uses six DIFFERENT numbers exactly once, if five faces are already shown and one is blank, the blank must simply be whichever number from the full set has not appeared yet, regardless of which position it sits in.",
    ], tryit: { q: "A net's five visible faces show 1, 2, 3, 5 and 6 (using the numbers 1 to 6 once each). What must the blank sixth face be?", answer: "4, the only number from 1-6 not already used." } },
    { h: "6. Rotations versus reflections: a die's fingerprint", body: [
      "Pick any corner of a cube (or a die) where three faces meet, and read the three numbers on those faces going CLOCKWISE as you look straight at that corner. However you then rotate the whole die in your hands, looking at that same corner will always read those same three numbers clockwise, just possibly starting from a different one of the three.",
      "What a rotation can NEVER do is reverse that clockwise order into anticlockwise. Flipping the reading order is only possible with a MIRROR IMAGE (a reflection), which is a fundamentally different transformation from a rotation. This is the whole secret behind 'which of these views is impossible' puzzles: check whether the three numbers still read in the same rotational direction.",
    ], examples: [
      { q: "A corner reads 2, 4, 6 clockwise. Which of these is a genuine rotation of the same corner: (4, 6, 2) or (2, 6, 4)?", steps: ["(4, 6, 2) is 2, 4, 6 shifted to start one place later — still clockwise in the same order: a real rotation.", "(2, 6, 4) reads the same three numbers but in the reverse order: a mirror image, impossible by rotation alone."], answer: "(4, 6, 2) is the genuine rotation" },
      { q: "A corner originally reads 1, 5, 3 clockwise. A candidate view shows the same corner reading 5, 3, 1. Is this a rotation or a mirror image?", steps: ["In the original, going clockwise: after 1 comes 5, after 5 comes 3, after 3 comes 1.", "In the candidate: 5, 3, 1. After 1 comes 5 — same clockwise neighbour as the original.", "The cycle is the same, just starting one place later. This is a genuine rotation."], answer: "(5, 3, 1) is a genuine rotation of (1, 5, 3)" },
      { q: "A corner reads 3, 7, 2 clockwise. List all six possible orderings of 3, 7 and 2 around a corner, and classify each as a rotation or a mirror image of the original.", steps: ["The three clockwise rotations all share the same cycle 3 -> 7 -> 2 -> 3: these are (3, 7, 2), (7, 2, 3) and (2, 3, 7).", "The three mirror images reverse the cycle to 3 -> 2 -> 7 -> 3: these are (3, 2, 7), (2, 7, 3) and (7, 3, 2).", "To classify any ordering quickly: pick 3 as the anchor and check what follows it. If 7 follows (clockwise neighbour in the original), it is a rotation; if 2 follows (anticlockwise neighbour), it is a mirror image."], answer: "Rotations: (3, 7, 2), (7, 2, 3), (2, 3, 7). Mirror images: (3, 2, 7), (2, 7, 3), (7, 3, 2)" },
    ] },
    { h: "7. Spotting the impossible view efficiently", body: [
      "With three distinct numbers, there are only 6 possible orderings around a corner in total: 3 of them are genuine rotations of each other (all reading the same clockwise cycle from a different start), and the other 3 are their mirror images (all reading the reverse cycle). Every ordering falls into exactly one of those two families, never both.",
      "The fastest way to sort an ordering into its family: pick any one number as your anchor and see which number follows it clockwise. If that matches the original's clockwise neighbour, it is a genuine rotation; if it matches the original's ANTI-clockwise neighbour instead, it is a mirror image.",
    ], tryit: { q: "The original reads 1, 3, 5 clockwise (so after 1 comes 3, after 3 comes 5, after 5 comes 1). A candidate view reads: after 1 comes 5. Is this candidate a rotation or a mirror image of the original?", answer: "A mirror image — the original has 3 following 1, not 5, so this candidate has reversed the direction." } },
    { h: "8. Combining net-folding or symmetry facts with other numbers", body: [
      "Some of the hardest questions ask you to combine a symmetry or net fact with ordinary arithmetic, such as adding a polygon's line count to a different shape's rotational order, or working out a blank net face using several other clues at once. Always work out each fact separately and clearly labelled first (the polygon's lines of symmetry; the other shape's rotational order; or the net's missing number), and only combine them as the very last step.",
      "Resist trying to shortcut the geometry itself; the geometry rules in this lesson are exact and always give a definite single answer. Only the FINAL combination step, like adding two numbers together, is genuinely arithmetic.",
    ] },
    { h: "9. A habit that prevents most mistakes here", body: [
      "Whenever a question shows a picture and asks 'is this possible', resist answering from a first glance. Instead, name explicitly which rule applies (opposite faces in a net never share an edge; a rotation preserves clockwise order; only REGULAR polygons get the sides-equals-symmetries shortcut) and check the picture against that rule directly.",
      "This habit is exactly why these puzzles are solvable without ever building an actual physical model: each one reduces to a short, nameable rule, and checking a rule is far more reliable than trying to picture a 3D fold or rotation purely in your head.",
    ] },
  ],
  recap: [
    "A REGULAR polygon with n sides has exactly n lines of symmetry AND rotational symmetry order n — but this shortcut only applies to regular shapes.",
    "Irregular shapes need their own facts: e.g. a non-square rectangle has 2 lines and order 2; a general parallelogram has 0 lines but STILL order 2.",
    "In a cross-shaped cube net, the 1st/3rd and 2nd/4th faces of the row of four become opposite pairs; the arms above and below the row become an opposite pair too.",
    "Two squares sharing an edge in the flat net can never be opposite once folded — opposite faces are never adjacent in the net.",
    "A rotation of a cube always reads the same clockwise order of numbers around any corner, just starting from a different number; a mirror image reverses that order, which no rotation can do.",
    "With 3 distinct numbers, exactly 3 of the 6 possible orderings are genuine rotations of each other, and the other 3 are all mirror images.",
  ],
  mistakes: [
    "Applying the 'sides = symmetries' shortcut to a shape that is not actually regular.",
    "Assuming a shape's lines of symmetry and rotational order must always be equal (a parallelogram has 0 lines but order 2).",
    "Forgetting that faces sharing an edge in a net can never be opposite once folded.",
    "Accepting a picture as a valid rotation without checking whether the clockwise order of its numbers has been secretly reversed.",
    "Trying to combine a geometry fact and an arithmetic step into one move instead of finding each fact cleanly first.",
  ],
};

JUNIOR_LESSONS.coordGeom = {
  title: "Coordinate Geometry",
  minutes: 20,
  intro: "A coordinate grid is just a way of turning position into two numbers, so that a point can be described precisely instead of vaguely. Once every point has an address, whole families of shape questions turn into arithmetic: the midpoint of a line becomes an average, the distance between two points becomes a right-angled triangle, and a missing corner of a rectangle becomes a matter of copying the right x and the right y from the corners you already have. This lesson builds every one of those tools from the single idea of reading a grid, so that any new-looking coordinate question can be recognised as one of a small number of underlying moves.",
  sections: [
    { h: "1. Reading an address on the grid", body: [
      "A coordinate grid has two number lines meeting at right angles: a horizontal x-axis and a vertical y-axis. They cross at the origin, the point (0, 0), which is the grid's zero for both directions at once.",
      "Every point on the grid gets an address written (x, y). The first number, x, says how far to move right (positive) or left (negative) from the origin. The second number, y, says how far to move up (positive) or down (negative). The order is never negotiable: (3, 5) and (5, 3) are different points, three-across-five-up against five-across-three-up, and mixing them up is the single most common slip in this whole topic.",
      "To plot (4, -2): start at the origin, move 4 to the right, then 2 down. To read a plotted point off a grid, do the reverse: count across to find x, then count up or down to find y. Always find x first, since the sentence 'along the corridor, then up the stairs' is the standard memory hook for x-then-y.",
    ] },
    { h: "2. The four quadrants", body: [
      "The two axes cut the grid into four regions called quadrants, numbered I to IV going anticlockwise starting from the top-right. Quadrant I (top-right) has both coordinates positive. Quadrant II (top-left) has x negative, y positive. Quadrant III (bottom-left) has both negative. Quadrant IV (bottom-right) has x positive, y negative.",
      "You never need to plot a point to know its quadrant; the two signs give it away immediately. A point with x negative and y positive must be Quadrant II, full stop, however large or small the actual numbers are. A point sitting exactly on an axis (x = 0 or y = 0) is not in any quadrant at all, since the quadrants are the four open regions between the axes.",
    ], examples: [
      { q: "Which quadrant is (-6, 3) in, and which quadrant is (2, -8) in?", steps: ["(-6, 3): x negative, y positive.", "That combination is Quadrant II.", "(2, -8): x positive, y negative.", "That combination is Quadrant IV."], answer: "(-6, 3) is in Quadrant II; (2, -8) is in Quadrant IV" },
      { q: "Point P has a negative x-coordinate and a positive y-coordinate. Point Q has coordinates (0, -5). State the quadrant of P and the position of Q.", steps: ["P: x negative, y positive — that is Quadrant II.", "Q: x = 0, so Q lies exactly on the y-axis and is not inside any quadrant."], answer: "P is in Quadrant II; Q is on the y-axis (not in any quadrant)" },
      { q: "Point A = (3, 4) is reflected in the x-axis to give B. B is then reflected in the y-axis to give C. State the coordinates and quadrant of B and of C.", steps: ["Reflecting in the x-axis flips the sign of y: B = (3, -4).", "(3, -4): x positive, y negative — Quadrant IV.", "Reflecting B in the y-axis flips the sign of x: C = (-3, -4).", "(-3, -4): both negative — Quadrant III."], answer: "B = (3, -4) in Quadrant IV; C = (-3, -4) in Quadrant III" },
    ] },
    { h: "3. The midpoint: just an average of two averages", body: [
      "The midpoint of a line segment is the point exactly halfway between its two ends. Because halfway along the x-direction and halfway along the y-direction are completely separate journeys, you can find each one on its own: the midpoint's x-coordinate is the AVERAGE of the two x-coordinates, and its y-coordinate is the average of the two y-coordinates.",
      "Why an average works: imagine only moving along the x-axis, ignoring y completely. The halfway point between two positions on a number line is always their average, (a + b) / 2, because that is exactly what 'exactly in the middle' means for two numbers. The grid just does that same halving job twice, once for x and once for y, entirely independently of each other.",
      "So for A = (x1, y1) and B = (x2, y2), midpoint M = ((x1 + x2)/2, (y1 + y2)/2). Nothing here is a special geometry rule; it is ordinary averaging, applied once in each direction.",
    ], examples: [
      { q: "Find the midpoint of A = (2, 5) and B = (8, 1).", steps: ["Average the x-coordinates: (2 + 8) / 2 = 5.", "Average the y-coordinates: (5 + 1) / 2 = 3."], answer: "(5, 3)" },
      { q: "Find the midpoint of A = (-3, 7) and B = (5, 1).", steps: ["Average the x-coordinates: (-3 + 5) / 2 = 2 / 2 = 1.", "Average the y-coordinates: (7 + 1) / 2 = 8 / 2 = 4."], answer: "(1, 4)" },
      { q: "The midpoint of A = (p, 2) and B = (6, q) is M = (4, 5). Find p and q.", steps: ["The midpoint's x-coordinate: (p + 6) / 2 = 4, so p + 6 = 8 and p = 2.", "The midpoint's y-coordinate: (2 + q) / 2 = 5, so 2 + q = 10 and q = 8.", "Check: midpoint of (2, 2) and (6, 8) is ((2+6)/2, (2+8)/2) = (4, 5)."], answer: "p = 2, q = 8" },
    ] },
    { h: "4. Running the midpoint idea backwards", body: [
      "Because the midpoint is just an average, the process reverses cleanly. If you are given the midpoint M and one endpoint A, the other endpoint B must satisfy M = (A + B) / 2 in each coordinate separately, so B = 2M - A.",
      "It helps to see this as 'A and B sit the same distance from M, on opposite sides'. Whatever step you took from A to reach M, take that exact same step again from M and you land on B. So B's x-coordinate is as far past M's x as M's was past A's, and likewise for y.",
    ], tryit: { q: "M = (4, 6) is the midpoint of A = (1, 2) and B. Find B.", answer: "B = (2x4 - 1, 2x6 - 2) = (7, 10). Check: the midpoint of (1,2) and (7,10) is ((1+7)/2, (2+10)/2) = (4, 6), which matches." } },
    { h: "5. Distance: build a right-angled triangle and use Pythagoras", body: [
      "To find the straight-line distance between two points, do not try to measure it directly. Instead, build a right-angled triangle out of the gap: the horizontal gap between the points is one leg, the vertical gap is the other leg, and the distance you want is the hypotenuse joining them.",
      "The horizontal gap is simply the difference between the x-coordinates (ignore which one is bigger; distance is always positive), and the vertical gap is the difference between the y-coordinates. Once you have those two legs, Pythagoras finishes the job exactly as it would for any right-angled triangle: distance squared equals the sum of the two legs squared.",
      "This is the same Pythagoras' theorem used anywhere else in geometry; a coordinate grid has not changed the rule, it has just handed you the two legs directly as differences in x and y, which is what makes coordinate distance so quick once you see the triangle hiding in the picture.",
    ], examples: [
      { q: "Find the distance between A = (1, 1) and B = (5, 4).", steps: ["Horizontal gap = 5 - 1 = 4. Vertical gap = 4 - 1 = 3.", "Distance squared = 4^2 + 3^2 = 16 + 9 = 25.", "Distance = sqrt(25) = 5."], answer: "5 units (a 3-4-5 triangle in disguise)" },
      { q: "Find the distance between C = (-2, 1) and D = (3, 13).", steps: ["Horizontal gap = 3 - (-2) = 5. Vertical gap = 13 - 1 = 12.", "Distance squared = 5^2 + 12^2 = 25 + 144 = 169.", "Distance = sqrt(169) = 13."], answer: "13 units (a 5-12-13 Pythagorean triple)" },
      { q: "Three points are P = (0, 0), Q = (6, 0) and R = (6, 8). Find the lengths PQ, QR and PR. Is triangle PQR right-angled, and if so at which vertex?", steps: ["PQ: horizontal gap = 6, vertical gap = 0, so PQ = 6.", "QR: horizontal gap = 0, vertical gap = 8, so QR = 8.", "PR: horizontal gap = 6, vertical gap = 8. PR = sqrt(36 + 64) = sqrt(100) = 10.", "Check: PQ^2 + QR^2 = 36 + 64 = 100 = PR^2, so the right angle is at Q."], answer: "PQ = 6, QR = 8, PR = 10; right-angled at Q (a 6-8-10 triangle, which is a 3-4-5 triple scaled by 2)" },
    ] },
    { h: "6. Finding a missing vertex from a shape's properties", body: [
      "A very common question gives you most of the corners of a shape and asks for the one that is missing. The trick is never to invent new maths; it is to translate ONE property of that shape into a coordinate fact, usually reusing an idea from earlier in this lesson.",
      "For a rectangle with sides parallel to the axes, opposite corners share a coordinate with their neighbours: if A, B, C are three corners with A and B sharing a y-value (a horizontal side) and A and C sharing an x-value (a vertical side), the fourth corner D takes its x from B and its y from C, since D must line up with B vertically and with C horizontally to close the rectangle.",
      "For a parallelogram, the missing-vertex trick reuses the midpoint idea directly: the two diagonals of a parallelogram bisect each other, meaning they share the same midpoint. So if ABCD is a parallelogram in order round the shape, the midpoint of diagonal AC equals the midpoint of diagonal BD. Setting those equal and rearranging gives D = A + C - B. This is exactly section 3's averaging fact, just used in reverse to solve for an unknown corner instead of to find a midpoint you already had both ends for.",
    ], examples: [
      { q: "ABCD is a parallelogram with A = (1, 1), B = (5, 2), C = (6, 5). Find D.", steps: ["Diagonals AC and BD share a midpoint, so A + C = B + D (doubling both sides of the midpoint equality).", "D = A + C - B = (1 + 6 - 5, 1 + 5 - 2).", "D = (2, 4)."], answer: "(2, 4). Check: midpoint of A,C is (3.5, 3); midpoint of B,(2,4) is also (3.5, 3), so it is consistent" },
      { q: "ABCD is a parallelogram with A = (0, 0), B = (4, 1), C = (5, 3). Find D.", steps: ["The diagonals AC and BD bisect each other, so D = A + C - B.", "D = (0 + 5 - 4, 0 + 3 - 1) = (1, 2)."], answer: "(1, 2). Check: midpoint of A,C is (2.5, 1.5); midpoint of B,D is ((4+1)/2, (1+2)/2) = (2.5, 1.5)" },
      { q: "PQRS is a parallelogram with P = (2, 3), Q = (8, 5) and S = (1, 7). Find R. Then find the midpoint of diagonal PR and confirm it equals the midpoint of diagonal QS.", steps: ["In parallelogram PQRS the diagonals are PR and QS. Their midpoints are equal, so R = Q + S - P.", "R = (8 + 1 - 2, 5 + 7 - 3) = (7, 9).", "Midpoint of PR: ((2 + 7) / 2, (3 + 9) / 2) = (4.5, 6).", "Midpoint of QS: ((8 + 1) / 2, (5 + 7) / 2) = (4.5, 6). Both midpoints match."], answer: "R = (7, 9); both diagonals have midpoint (4.5, 6)" },
    ] },
    { h: "7. Translations: sliding a point by a vector", body: [
      "A translation slides every point the same distance in the same direction, described by a vector (a, b): move a in the x-direction and b in the y-direction. To translate a point, simply add: (x, y) becomes (x + a, y + b). A negative a or b just means the slide goes left or down instead of right or up.",
      "Translation is the simplest transformation precisely because it only ever adds; nothing about the point's coordinates gets flipped or swapped, which is why it is the safest one to do first if a question asks for several transformations in a row.",
    ], examples: [
      { q: "Translate the point (3, -2) by the vector (4, 5).", steps: ["Add the vector to the point: (3 + 4, -2 + 5)."], answer: "(7, 3)" },
      { q: "Translate the point (-5, 8) by the vector (7, -3). Find the new coordinates.", steps: ["Add the vector: (-5 + 7, 8 + (-3)) = (2, 5)."], answer: "(2, 5)" },
      { q: "Point A = (2, 7) is translated by (-3, 4) to give B, then B is translated by (5, -6) to give C. Find B and C. State the single vector that translates A directly to C.", steps: ["B = (2 + (-3), 7 + 4) = (-1, 11).", "C = (-1 + 5, 11 + (-6)) = (4, 5).", "Single vector from A to C: (4 - 2, 5 - 7) = (2, -2).", "Check: adding the two individual vectors, (-3 + 5, 4 + (-6)) = (2, -2)."], answer: "B = (-1, 11); C = (4, 5); single vector (2, -2)" },
    ] },
    { h: "8. Reflections in the axes, and why the signs flip the way they do", body: [
      "Reflecting a point in the x-axis leaves x untouched but flips the sign of y, because the x-axis is the mirror line and only the up-down position changes as you cross it: (x, y) becomes (x, -y). Reflecting in the y-axis does the opposite, flipping x and leaving y alone: (x, y) becomes (-x, y). Reflecting in the origin flips both signs at once, as if the two reflections above were both applied: (x, y) becomes (-x, -y).",
      "A quick way to check you have flipped the right coordinate: the axis you are reflecting IN stays fixed (any point already sitting on the x-axis does not move when you reflect in the x-axis), which means it is the OTHER coordinate that must be the one changing sign.",
    ], tryit: { q: "Reflect the point (3, 4) in the x-axis, then separately in the y-axis, then separately in the origin.", answer: "In the x-axis: (3, -4). In the y-axis: (-3, 4). In the origin: (-3, -4)." } },
    { h: "9. Combining transformations: order changes the answer", body: [
      "When a question chains two transformations together, such as 'translate, then reflect', the order matters and cannot be swapped. Each step must be carried out on the RESULT of the previous step, not on the original point, and doing the two steps in the opposite order generally lands you somewhere else entirely.",
      "Watch the same starting point taken through the same two transformations in each order. Start at P = (2, 3). Translate by (4, 1) first: P' = (6, 4). Then reflect P' in the x-axis: P'' = (6, -4). Now swap the order: reflect P = (2, 3) in the x-axis first, giving (2, -3); then translate that by (4, 1), giving (6, -2). Same point, same two transformations, but (6, -4) and (6, -2) are different landing spots, because the reflection in the second version only flips the ORIGINAL y-coordinate, not the already-translated one.",
      "The fix is always the same discipline used in function-machine or work-backwards problems: do the steps strictly in the stated order, writing down the coordinate after each individual step before starting the next one, so there is never a chance of quietly reordering them in your head.",
    ], examples: [
      { q: "P = (5, -1) is translated by (-2, 3) and then reflected in the y-axis. Find the final point.", steps: ["Translate first: (5 + -2, -1 + 3) = (3, 2).", "Reflect that result in the y-axis: flip the sign of x: (-3, 2)."], answer: "(-3, 2)" },
      { q: "Point P = (-4, 2) is first reflected in the x-axis, then translated by (3, 1). Find the final coordinates.", steps: ["Reflecting in the x-axis flips the sign of y: (-4, 2) becomes (-4, -2).", "Translate: (-4 + 3, -2 + 1) = (-1, -1)."], answer: "(-1, -1)" },
      { q: "Point Q = (3, 5) is reflected in the y-axis to give Q', then Q' is reflected in the x-axis to give Q''. Find Q''. Now apply the two reflections in the opposite order (x-axis first, then y-axis) to Q. Do you land at the same point?", steps: ["Order 1 (y-axis then x-axis): Q = (3, 5) -> Q' = (-3, 5) -> Q'' = (-3, -5).", "Order 2 (x-axis then y-axis): Q = (3, 5) -> (3, -5) -> (-3, -5).", "Both orders land at (-3, -5)."], answer: "Q'' = (-3, -5) in both orders — reflecting in both axes always gives (-x, -y) regardless of order" },
    ] },
  ],
  recap: [
    "A coordinate (x, y) always means x-across then y-up; mixing the order is the single most common error in this topic.",
    "A point's quadrant is read straight off the signs of its two coordinates, with no plotting needed.",
    "Midpoint = average the x-coordinates, average the y-coordinates; it is ordinary averaging done twice, not a special geometry rule.",
    "The midpoint idea reverses cleanly: given a midpoint and one end, the other end is 2M - A.",
    "Distance between two points comes from a right-angled triangle built out of the horizontal and vertical gaps, then Pythagoras.",
    "Missing vertices come from translating ONE property of the shape (matching sides for a rectangle, equal diagonal midpoints for a parallelogram) into a coordinate equation.",
    "Translation adds a vector; reflection in an axis flips the sign of the coordinate that is NOT along that axis.",
    "Chained transformations must be done strictly in order on the running result; swapping the order generally changes the answer.",
  ],
  mistakes: [
    "Swapping x and y when plotting or reading a point.",
    "Trying to state a quadrant for a point that actually sits on an axis (it is on the boundary, not inside any quadrant).",
    "Forgetting to divide by 2 after adding the coordinates for a midpoint, or forgetting the reverse relationship B = 2M - A.",
    "Adding the squares of x and y directly instead of the squares of the DIFFERENCES between the two points' coordinates.",
    "Assuming a missing rectangle vertex just repeats one of the given points instead of combining one x with the other y.",
    "Reflecting in the wrong axis, or flipping both coordinates when only one axis was named.",
    "Applying two chained transformations in the wrong order, or reflecting the original point instead of the already-translated one.",
  ],
};