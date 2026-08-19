export const PRIMARY_LESSONS = {};

PRIMARY_LESSONS.placeValue = {
  title: "Place Value: what a digit is really worth",
  minutes: 20,
  intro: "Numbers might look like a row of little symbols sitting side by side, but each symbol is quietly doing its own special job. In this lesson we will slow right down and take numbers apart, piece by piece, until you can look at any number and know exactly what every part of it is worth. This is one of the most useful ideas in all of maths, so we will build it up gently and look at it from lots of different angles.",
  sections: [
    {
      h: "1. What a digit is",
      body: [
        "Let us start with the very smallest building block. A digit is a single number symbol. There are only ten of them in the whole world, and here they all are: 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9. That is it. Every number you have ever seen, no matter how enormous, is made using only these ten symbols.",
        "Think about how words work. There are 26 letters in the alphabet, and by putting those same letters in different orders we can make every word in the dictionary. Digits work in exactly the same way. We take those ten symbols and line them up in different orders to make every number there is.",
        "A number can use just one digit, like the number 7. It can use two digits, like 52. It can use three, like 481, or four, like 6,300, or as many as we like. The little comma in 6,300 is just there to help our eyes, a bit like a space, so long numbers are easier to read. It does not change the number at all.",
        "So a digit is one symbol, and a number is one or more digits sitting together in a row. Nice and simple. Now comes the clever part.",
      ],
      tryit: { q: "How many digits are in the number 4,062?", answer: "Four digits: the 4, the 0, the 6 and the 2. (The comma is just a helper for our eyes, so we do not count it.)" },
    },
    {
      h: "2. Where a digit sits gives it a job",
      body: [
        "Here is the big secret of numbers. A digit does not just stand for itself. The spot it is sitting in gives it a job, and that job decides how much the digit is really worth.",
        "Imagine an egg box, but a special one. The first cup on the right holds single eggs. The next cup along holds bundles of ten eggs. The cup after that holds boxes of a hundred eggs. And the next holds crates of a thousand eggs. If you put a digit into one of these cups, it tells you how many of that thing you have.",
        "We give each spot a name. Starting from the right-hand end and moving left, the spots are called: ones, tens, hundreds and thousands. So the ones spot counts single things, the tens spot counts groups of ten, the hundreds spot counts groups of a hundred and the thousands spot counts groups of a thousand.",
        "Another way to picture this is with money, which you might already know well. A 5 in the ones spot is like five 1p coins, so it is worth 5. A 5 in the tens spot is like five 10p coins, so it is worth 50. A 5 in the hundreds spot is like five £1 coins, so it is worth 500. The same digit 5, but a very different amount of money each time, purely because of where it sits.",
      ],
      examples: [
        {
          q: "In the number 3,000, which spot is the 3 sitting in, and what does that mean?",
          steps: [
            "Start at the right-hand end and name the spots as you move left. The last 0 is in the ones spot. The next 0 is in the tens spot. The next 0 is in the hundreds spot.",
            "Keep going. The 3 is in the very next spot along, which is the thousands spot.",
            "A 3 in the thousands spot means three groups of one thousand.",
          ],
          answer: "The 3 is in the thousands spot, so it means three thousand.",
        },
        { q: "In the number 72,500, which spot is the 7 in and what is it worth?", steps: ["Start at the right-hand end and name each spot moving left: ones (0), tens (0), hundreds (5), thousands (2), ten-thousands (7).", "The 7 is in the ten-thousands spot.", "The 7 is worth 7 × 10,000 = 70,000."], answer: "The 7 is in the ten-thousands spot, so it is worth 70,000." },
        { q: "The number 900,009 has a 9 in the hundred-thousands spot and a 9 in the ones spot. How many times bigger is the left 9's value than the right 9's value?", steps: ["The left 9 is in the hundred-thousands spot, so it is worth 9 × 100,000 = 900,000.", "The right 9 is in the ones spot, so it is worth 9.", "Divide to compare: 900,000 ÷ 9 = 100,000."], answer: "The left 9 is 100,000 times bigger. Moving five spots to the left multiplies by 10 five times over: 10 × 10 × 10 × 10 × 10 = 100,000." },
      ],
      tryit: { q: "In the number 47, which spot is the 4 sitting in?", answer: "The tens spot, so the 4 means four tens, which is 40." },
    },
    {
      h: "3. The same digit, worth different amounts",
      body: [
        "Now we can play with this idea. Because the spot decides the worth, the very same digit can be worth wildly different amounts depending on where it lands.",
        "Watch the digit 7 as it moves around. In the number 7, it sits in the ones spot and is worth just 7. In 70, it has slid one spot to the left into the tens spot, so now it is worth 70. In 700, it is in the hundreds spot and worth 700. In 7,000, it is in the thousands spot and worth 7,000. Same friendly little 7, four completely different values.",
        "You can hear this when you say numbers out loud too. We do not read 700 as 'seven zero zero'. We say 'seven hundred', because our mouths already know the 7 is doing a hundreds job. Reading a number aloud is a lovely way to check you have understood what each digit is worth.",
        "A gentle trick that stops silly slips: when you meet a new number, point at each digit and whisper its spot name, ones, tens, hundreds, thousands, from right to left. It feels slow at first, but it makes the value of every digit crystal clear.",
      ],
      tryit: { q: "What is the value of the digit 6 in the number 6,381?", answer: "6,000 (six thousand). The 6 is sitting in the thousands spot, so it means six groups of a thousand." },
    },
    {
      h: "4. Every step to the left is ten times bigger",
      body: [
        "You might have spotted a pattern already. Each time a digit moves one spot to the left, its worth gets ten times bigger. Ones become tens, tens become hundreds, hundreds become thousands. Every single hop to the left multiplies the value by ten.",
        "Picture a number line, which is just a long ruler with numbers marked along it in order. To count up in ones you take tiny baby steps: 1, 2, 3, 4. To count up in tens you take much bigger strides: 10, 20, 30, 40. To count in hundreds you take enormous leaps: 100, 200, 300, 400. Moving a digit one spot to the left is like swapping baby steps for big strides for giant leaps.",
        "Here is another way to feel it, using towers of coins. One 1p coin is tiny. To match a single 10p coin you would need a tower of ten 1p coins. To match a single £1 coin you would need a tower of a hundred 1p coins. Each spot to the left is worth a whole tower of ten of the spot before it.",
        "This is why the spots go ones, tens, hundreds, thousands and not in some random order. They are simply ten times bigger each time, forever. The next spot after thousands is ten-thousands, then hundred-thousands, then millions, all following the very same rule.",
      ],
      examples: [
        {
          q: "The digit 6 sits in three different numbers: 6, 60 and 600. Show how its value grows ten times bigger each step to the left.",
          steps: [
            "In 6, the 6 is in the ones spot, so it is worth 6.",
            "In 60, the 6 has hopped one spot left into the tens spot. Ten times 6 is 60, so it is worth 60.",
            "In 600, the 6 has hopped left again into the hundreds spot. Ten times 60 is 600, so it is worth 600.",
          ],
          answer: "6, then 60, then 600. Each hop to the left makes it ten times bigger.",
        },
        { q: "In the number 5,000, the digit 5 is in the thousands spot. If you instead put the 5 in the ten-thousands spot, how much bigger does its value become?", steps: ["In the thousands spot, the 5 is worth 5,000.", "In the ten-thousands spot, the 5 is worth 50,000.", "One hop to the left makes it ten times bigger: 5,000 × 10 = 50,000."], answer: "Ten times bigger. The 5 grows from 5,000 to 50,000." },
        { q: "A digit 4 starts in the ones spot (worth 4) and hops left one spot at a time. How many hops does it take to reach a value of 4,000? What is it worth after 5 hops?", steps: ["Start: ones spot, worth 4. After 1 hop: tens, worth 40. After 2 hops: hundreds, worth 400. After 3 hops: thousands, worth 4,000. So 3 hops to reach 4,000.", "Continuing: after 4 hops, worth 40,000. After 5 hops, worth 400,000."], answer: "3 hops to reach 4,000. After 5 hops the 4 is worth 400,000." },
      ],
      tryit: { q: "The digit 2 is worth 20 in the number 24. If it hops one spot to the left, what will it be worth?", answer: "200. Moving one spot left makes it ten times bigger, and ten times 20 is 200." },
    },
    {
      h: "5. Building a number from its parts",
      body: [
        "Now that we know what each spot is worth, we can do something powerful. We can take a number apart into its pieces, and we can build a number up from its pieces. Let us build one.",
        "Suppose someone tells you a number is made of 3 thousands, 0 hundreds, 8 tens and 4 ones. Write out what each piece is worth on its own. Three thousands is 3,000. No hundreds is 0. Eight tens is 80. Four ones is 4. Now simply add them all together: 3,000 + 0 + 80 + 4 = 3,084.",
        "This adding-up is sometimes called the expanded form of a number, which just means the number written out as its separate pieces added together. Every number really is just a stack of place values added up, and expanded form lets you see that stack clearly.",
        "It works the other way round too. Given the number 3,084, you can pull it apart and say it is 3 thousands, 0 hundreds, 8 tens and 4 ones. Taking numbers apart and putting them back together like this is one of the most useful habits you can build in maths.",
      ],
      examples: [
        {
          q: "A number is made of 2 ten-thousands, 5 thousands, 0 hundreds, 6 tens and 1 one. What is the number?",
          steps: [
            "Write each piece as its own value: 2 ten-thousands is 20,000, then 5,000, then 0, then 60, then 1.",
            "Add them all together, working from biggest to smallest: 20,000 + 5,000 + 0 + 60 + 1.",
            "20,000 + 5,000 is 25,000. Adding 60 gives 25,060. Adding 1 gives 25,061.",
          ],
          answer: "25,061",
        },
        { q: "Write the number made of 4 ten-thousands, 7 thousands, 0 hundreds, 0 tens and 9 ones.", steps: ["Write each piece: 40,000 + 7,000 + 0 + 0 + 9.", "The two zeros hold the hundreds and tens spots open.", "40,000 + 7,000 + 9 = 47,009."], answer: "47,009" },
        { q: "A number in expanded form is 3 × 100,000 + 5 × 10,000 + 0 × 1,000 + 8 × 100 + 4 × 10 + 6 × 1. What is the number?", steps: ["Work out each piece: 300,000 + 50,000 + 0 + 800 + 40 + 6.", "Add from the largest: 300,000 + 50,000 = 350,000.", "350,000 + 800 = 350,800. Then + 40 = 350,840. Then + 6 = 350,846."], answer: "350,846" },
      ],
      tryit: { q: "Build the number made of 4 thousands, 2 hundreds, 0 tens and 9 ones.", answer: "4,209. That is 4,000 + 200 + 0 + 9 = 4,209." },
    },
    {
      h: "6. The mighty zero",
      body: [
        "The digit 0 looks like it means nothing, and on its own it does mean nothing. But inside a number, zero has a very important job. It is a placeholder, which means it holds a spot open so all the other digits stay where they belong.",
        "Think about a row of numbered seats in a cinema. If one person does not turn up, you do not squash everyone along to close the gap. You leave the empty seat exactly where it is, because moving everyone would muddle up all the seat numbers. Zero is that empty seat. It says 'nothing is in this spot' while keeping the spot open.",
        "Look at what happens without it. The number 3,084 has a zero in the hundreds spot. If you got lazy and just skipped that zero, you would write 384. But 384 is a totally different, much smaller number. By dropping the zero you accidentally slid the 3 and the 8 into the wrong spots, and they lost most of their value.",
        "So a zero is never really 'nothing' when it sits inside a number. It is doing the quiet but vital job of keeping every other digit in its proper place. Always write it, and always read it.",
      ],
      examples: [
        {
          q: "A number is made of 5 thousands, 0 hundreds, 0 tens and 7 ones. What is the number, and why do the zeros matter?",
          steps: [
            "Write each piece: 5,000, then 0, then 0, then 7.",
            "Add them: 5,000 + 0 + 0 + 7 = 5,007.",
            "The two zeros hold the hundreds and tens spots open. Without them you would wrongly write 57, which is far too small.",
          ],
          answer: "5,007 (the zeros keep the 5 in the thousands spot and the 7 in the ones spot).",
        },
        { q: "A number is made of 3 ten-thousands, 0 thousands, 6 hundreds, 0 tens and 4 ones. What is the number, and what job do the zeros do?", steps: ["Write each piece: 30,000 + 0 + 600 + 0 + 4.", "The zeros hold the thousands and tens spots open, keeping all the other digits in the right spots.", "30,000 + 600 + 4 = 30,604."], answer: "30,604. The zeros hold the thousands and tens spots open so the 3 stays in the ten-thousands and the 6 stays in the hundreds." },
        { q: "These six digits are to be arranged as a 6-digit number that contains at least two zeros: 8, 5, 0, 4, 0, 3. What is the largest such number you can make?", steps: ["For the largest number, put the biggest non-zero digits in the highest spots.", "Digits in descending order: 8, 5, 4, 3, 0, 0.", "Place them left to right: 8 in the hundred-thousands, 5 in the ten-thousands, 4 in the thousands, 3 in the hundreds, then the two zeros in tens and ones."], answer: "854,300. The two zeros sit in the tens and ones spots, which is the only way to keep them from reducing the higher digits." },
      ],
      tryit: { q: "Which is bigger, 209 or 29, and what does the zero in 209 do?", answer: "209 is much bigger. The zero holds the tens spot open so the 2 stays in the hundreds spot, meaning two hundred rather than twenty." },
    },
    {
      h: "7. How many tens or hundreds are inside a number",
      body: [
        "So far we have asked 'what is this one digit worth'. Now we will turn the question round and ask something new: 'how many whole groups of ten, or of a hundred, are hiding inside a number altogether'. This feels different at first, so let us take it slowly.",
        "Imagine you have 4,700 sweets and you want to share them into bags of ten. How many bags could you fill? To find out, you split the total into groups of ten, which is the same as dividing by 10. So 4,700 divided by 10 is 470. That means there are 470 tens inside 4,700.",
        "Now suppose you used bigger bags that hold a hundred sweets each. To find how many of those you could fill, you split the total into groups of a hundred, which is dividing by 100. So 4,700 divided by 100 is 47. That means there are 47 hundreds inside 4,700.",
        "This is exactly what you do with real money without even thinking about it. If you have 4,700 pennies, you can swap them for pound coins. Because a pound is 100 pennies, you divide by 100 and find you have 47 whole pounds. Swapping small coins for bigger ones is really just this idea in action.",
        "A quick way to see it with round numbers: dividing by 10 chops one zero off the end, and dividing by 100 chops two zeros off the end. So 3,600 divided by 100 loses two zeros and becomes 36, telling us there are 36 hundreds inside 3,600.",
      ],
      examples: [
        {
          q: "How many tens are inside the number 850?",
          steps: [
            "We want to know how many whole groups of ten fit inside 850, so we divide by 10.",
            "Dividing by 10 chops one zero off the end of a round number.",
            "850 with one zero chopped off becomes 85.",
          ],
          answer: "85 tens (because 850 divided by 10 is 85).",
        },
        { q: "How many hundreds are inside the number 47,300?", steps: ["We want to know how many groups of 100 fit inside 47,300, so we divide by 100.", "Dividing by 100 chops two zeros off the end of a round number.", "47,300 with two zeros removed becomes 473."], answer: "473 hundreds (because 473 × 100 = 47,300)." },
        { q: "A school library has 3,650 books. Shelves hold 100 books each and boxes hold 10 books each. The librarian fills shelves first, then puts any remaining books in boxes. How many full shelves and how many full boxes does she need?", steps: ["Shelves of 100: 3,650 ÷ 100 = 36 remainder 50. So 36 full shelves use 3,600 books, leaving 50.", "Boxes of 10: 50 ÷ 10 = 5. So 5 full boxes hold the remaining 50 books.", "Check: 36 × 100 + 5 × 10 = 3,600 + 50 = 3,650."], answer: "36 full shelves and 5 full boxes." },
      ],
      tryit: { q: "How many hundreds are there in 3,600?", answer: "36 hundreds. Dividing 3,600 by 100 chops off two zeros and leaves 36." },
    },
    {
      h: "8. Comparing numbers, spot by spot",
      body: [
        "Last of all, let us use place value to decide which of two numbers is bigger. It is tempting to guess by which number 'looks longer', but that can trick you, so here is a safe method that always works.",
        "Line the two numbers up and compare them spot by spot, starting from the highest-value spot on the left and working your way right. It is a bit like a race where you check the leaders first. As soon as you reach a spot where the two digits are different, the number with the bigger digit there is the bigger number, and you can stop. Nothing after that point matters, because a difference in a higher spot always outweighs everything to its right.",
        "Try it with 68,412 and 68,439. Working from the left, the ten-thousands match (6 and 6), the thousands match (8 and 8), the hundreds match (4 and 4), so we keep going. At the tens spot we finally see a difference: 1 against 3. Three is bigger, so 68,439 is the bigger number. We do not even need to look at the ones digits, because the tens spot has already settled it.",
        "This is why comparing from the left is so handy. The leftmost spots carry the most value, so the first difference you find, reading left to right, always decides the winner.",
      ],
      examples: [
        {
          q: "Which is bigger, 50,284 or 50,192?",
          steps: [
            "Compare from the left, spot by spot. The ten-thousands match (5 and 5). The thousands match (0 and 0).",
            "At the hundreds spot the digits differ at last: 2 against 1.",
            "Two hundreds beats one hundred, so the number with the 2 there is bigger. The digits after this point do not matter.",
          ],
          answer: "50,284 is bigger.",
        },
        { q: "Put these three numbers in order from smallest to largest: 83,047, 83,407 and 83,470.", steps: ["Compare from the left. All three have 8 in the ten-thousands and 3 in the thousands.", "Move to hundreds: 0, 4 and 4. The 0 is smallest, so 83,047 is the smallest number.", "Now compare 83,407 and 83,470: hundreds both 4, so move to tens: 0 vs 7. Seven is bigger, so 83,470 is the largest."], answer: "Smallest to largest: 83,047, then 83,407, then 83,470." },
        { q: "I am thinking of a 5-digit number. It is between 62,000 and 63,000. Its hundreds digit is 7. Its tens digit is one more than its ones digit. Its ones digit is 4. What is the number?", steps: ["Between 62,000 and 63,000 means the number starts 62,___.", "Hundreds digit is 7, so 62,7__.", "Ones digit is 4. Tens digit is one more than ones: 4 + 1 = 5. The number is 62,754."], answer: "62,754. Check: 62,000 < 62,754 < 63,000. Hundreds = 7. Tens = 5, ones = 4, and 5 = 4 + 1." },
      ],
      tryit: { q: "Which is bigger, 4,318 or 4,306, and which spot decides it?", answer: "4,318 is bigger. The thousands and hundreds match, but at the tens spot 1 beats 0, so that spot decides it." },
    },
  ],
};

PRIMARY_LESSONS.roundingEstimate = {
  title: "Rounding & Estimating: getting to a friendly number on purpose",
  minutes: 18,
  intro: "Some numbers are a bit fiddly. A number like 3,847 is hard to hold in your head and slow to work with. Rounding is a way of swapping a fiddly number for a nearby number that is much easier to use, like a tidy round number. This lesson builds the idea up slowly, using coins, a number line and a few everyday moments, so that by the end you can round any number on purpose and use rounding to check your other sums.",
  sections: [
    {
      h: "1. What does 'rounding' actually mean?",
      body: [
        "First, a plain-words meaning. To round a number means to change it to a nearby number that is easier to say and easier to work with. We usually round to a number that ends in a zero, like 20, 300 or 5,000, because numbers like those are lovely and tidy.",
        "You already round things in real life without calling it that. Imagine you are 8 years and 11 months old. If someone asks how old you are, you say 'I'm 9' because you are nearly 9. You have rounded your age to the nearest whole year.",
        "Here is another everyday moment. You count the sweets in a jar and there are 62. If a friend asks roughly how many, you might say 'about 60'. You have not lied, you have just given a tidier number that is very close to the real one. That is rounding.",
        "Notice two things. The rounded number is close to the real number but not exactly the same, and we choose it on purpose because it is easier to use. Rounding is not being lazy or careless. It is a careful swap: we give up a tiny bit of exactness to get a number that is much friendlier.",
      ],
      tryit: { q: "A shelf has 28 books on it. Which is the friendlier, tidier number to describe it: 'about 30 books' or 'about 25 books'? Why?", answer: "'About 30 books', because 28 is much closer to 30 than to 25. It is only 2 away from 30, but it is 3 away from 25." },
    },
    {
      h: "2. Seeing rounding on a number line",
      body: [
        "A number line is just a straight line with numbers marked along it in order, evenly spaced, like a ruler. It is one of the best ways to SEE what rounding is doing.",
        "Let's round to the nearest ten. 'The nearest ten' means the closest number that ends in a zero, like 10, 20, 30 and so on. Picture a number line with big pegs at 40 and at 50, and the smaller numbers 41, 42, 43 and so on spread out in between them.",
        "Now put the number 47 on that line. It sits much nearer the peg at 50 than the peg at 40. So 47 rounds to 50, because 50 is the nearest ten. Rounding just means sliding your number to whichever peg it is closest to.",
        "Try 43 next. It sits closer to the 40 peg than the 50 peg, so 43 rounds down to 40. The picture makes it obvious: you are simply asking 'which peg is my number nearest to?'",
        "You can do the exact same thing with bigger pegs. To round to the nearest hundred, put your pegs at numbers like 300 and 400 and ask which one your number is closest to. To round to the nearest thousand, put pegs at 3,000 and 4,000. The idea never changes, only the size of the gaps between the pegs.",
      ],
      examples: [
        { q: "Use a number line in your head to round 62 to the nearest ten.", steps: ["The two nearest tens (the pegs) are 60 and 70.", "62 is only 2 steps past 60, but it is 8 steps away from 70.", "62 is much closer to the 60 peg, so it slides down to 60."], answer: "60" },
        { q: "Use a number line in your head to round 187 to the nearest ten.", steps: ["The nearest tens are 180 and 190.", "187 is 7 steps past 180 and only 3 steps from 190.", "Much closer to the 190 peg, so it slides up to 190."], answer: "190" },
        { q: "Use the number line idea to round 4,465 to the nearest hundred.", steps: ["The nearest hundreds are 4,400 and 4,500.", "4,465 is 65 steps from 4,400 and only 35 steps from 4,500.", "Much closer to 4,500, so it rounds up to 4,500."], answer: "4,500" },
      ],
    },
    {
      h: "3. The quick rounding rule (so you don't need to draw every time)",
      body: [
        "Drawing a number line every single time would be slow. Luckily there is a shortcut that always gives the same answer as the number line, and it uses just one digit.",
        "A digit is a single number symbol, one of 0, 1, 2, 3, 4, 5, 6, 7, 8 or 9. Big numbers are just several digits sitting in a row, like the 6, 2 and 8 in 628.",
        "Here is the rule. First find the place you are rounding to, for example the tens place. Then look only at the one digit immediately to its right. If that digit is 5 or more, round up (the peg above). If that digit is 4 or less, round down (the peg below). Finally, change every digit after your rounding place to zero.",
        "Let's round 47 to the nearest ten using the rule. The digit to the right of the tens is 7. Since 7 is 5 or more, we round up, giving 50. That matches the number line from the last section perfectly.",
        "Why does looking at just one digit work? Because that next-door digit tells you which half of the gap you are in. If it is 0, 1, 2, 3 or 4 you are in the lower half so you slide down, and if it is 5, 6, 7, 8 or 9 you are in the upper half so you slide up. The single digit does all the deciding for you.",
      ],
      examples: [
        { q: "Round 3,847 to the nearest hundred using the rule.", steps: ["The hundreds place holds the 8, so that is the place we are rounding to.", "Look at the one digit just to its right, the tens digit, which is 4.", "4 is '4 or less', so we round down and the 8 stays as it is.", "Change the digits after the hundreds place to zero, giving 3,800."], answer: "3,800" },
        { q: "Round 76,320 to the nearest thousand using the rule.", steps: ["The thousands place holds the 6.", "Look at the one digit just to its right, the hundreds digit, which is 3.", "3 is '4 or less', so round down and the 6 stays.", "Change the hundreds, tens and ones to zero: 76,000."], answer: "76,000" },
        { q: "Round 596,482 to the nearest ten-thousand using the rule.", steps: ["The ten-thousands place holds the 9.", "Look at the one digit just to its right, the thousands digit, which is 6.", "6 is '5 or more', so round up: 9 becomes 10. That creates a carry.", "Ten-thousands becomes 0 and the hundred-thousands increases from 5 to 6. Change everything after ten-thousands to zero: 600,000."], answer: "600,000" },
      ],
      tryit: { q: "Round 3,872 to the nearest hundred.", answer: "3,900. The digit right after the hundreds place is 7, which is 5 or more, so we round up from 3,800 to 3,900." },
    },
    {
      h: "4. Rounding the same number to different places",
      body: [
        "One number can be rounded in more than one way. It all depends on which place you are asked to round to, so read the question carefully to see whether it wants the nearest ten, hundred or thousand.",
        "Think of it like zooming a camera in and out. Rounding to the nearest thousand is a very zoomed-out, blurry view where only the biggest lumps show. Rounding to the nearest ten is a much closer, sharper view where smaller changes matter.",
        "Take the number 6,382 and round it three different ways. To the nearest thousand: the digit after the thousands is 3, which is 4 or less, so it rounds down to 6,000. To the nearest hundred: the digit after the hundreds is 8, which is 5 or more, so it rounds up to 6,400. To the nearest ten: the digit after the tens is 2, which is 4 or less, so it rounds down to 6,380.",
        "The most common slip here is rounding to the wrong place, so always double-check which place the question asked for before you pick your deciding digit.",
      ],
      examples: [
        { q: "Round 2,548 to the nearest thousand.", steps: ["The thousands place holds the 2.", "Look at the one digit just to its right, the hundreds digit, which is 5.", "5 is '5 or more', so we round up: the 2 becomes 3.", "Change everything after the thousands place to zero, giving 3,000."], answer: "3,000" },
        { q: "Round 38,714 to the nearest thousand.", steps: ["The thousands place holds the 8.", "Look at the one digit just to its right, the hundreds digit, which is 7.", "7 is '5 or more', so round up: the 8 becomes 9.", "Change hundreds, tens and ones to zero: 39,000."], answer: "39,000" },
        { q: "Round 99,649 to the nearest thousand.", steps: ["The thousands place holds the 9.", "Look at the one digit just to its right, the hundreds digit, which is 6.", "6 is '5 or more', so round up: the 9 becomes 10. That creates a carry.", "Ten-thousands goes from 9 to 10, creating another carry. The result is 100,000."], answer: "100,000 (rounding caused two carries, jumping from 99,649 all the way to 100,000)." },
      ],
      tryit: { q: "Round 6,382 to the nearest hundred.", answer: "6,400. The digit after the hundreds place is 8, which is 5 or more, so it rounds up." },
    },
    {
      h: "5. Rounding decimals works in exactly the same way",
      body: [
        "A decimal is a number with a dot in it, like 7.36. The dot is called the decimal point, and the digits after it stand for parts of a whole, smaller than one. The first digit after the point is the tenths, and the second is the hundredths.",
        "Money is the friendliest way to picture this. Think of 4.28 as 4 pounds and 28 pence. Rounding 4.28 to the nearest whole number is just like asking 'is this nearer to 4 pounds or nearer to 5 pounds?' It is only 28 pence past 4 pounds, so it is nearer to 4, and 4.28 rounds to 4.",
        "The good news is the rounding rule does not change at all for decimals. You still find the place you are rounding to, look at the one digit just to its right, and use '5 or more rounds up, 4 or less rounds down'. You are simply looking one step further along the number.",
        "Round 7.36 to the nearest whole number: the place is the ones (the 7), so look at the first digit after the point, which is 3. Since 3 is 4 or less, round down, giving 7.",
        "Rounding 'to 1 decimal place' means keeping just one digit after the point. Round 4.28 to 1 decimal place: keep the first decimal digit (the 2) and look at the next one along, the 8. Since 8 is 5 or more, the 2 rounds up to 3, giving 4.3.",
      ],
      examples: [
        { q: "Round 12.65 to 1 decimal place.", steps: ["Rounding to 1 decimal place means we keep one digit after the point, the 6.", "Look at the one digit just to its right, which is 5.", "5 is '5 or more', so the 6 rounds up to 7.", "That gives 12.7."], answer: "12.7" },
        { q: "Round 8.374 to 1 decimal place.", steps: ["1 decimal place means keeping the tenths digit, which is 3.", "Look at the digit just to its right (hundredths), which is 7.", "7 is '5 or more', so round up: the 3 becomes 4."], answer: "8.4" },
        { q: "Round 15.849 to 2 decimal places, then round that result to 1 decimal place. Is this the same as rounding 15.849 directly to 1 decimal place?", steps: ["Round 15.849 to 2dp: hundredths digit is 4, thousandths digit is 9 ('5 or more'), round up: 15.85.", "Round 15.85 to 1dp: tenths digit is 8, hundredths digit is 5 ('5 or more'), round up: 15.9.", "Round 15.849 directly to 1dp: tenths digit is 8, hundredths digit is 4 ('4 or less'), round down: 15.8.", "Two-stage rounding gives 15.9 but direct rounding gives 15.8."], answer: "No, they differ. Two-stage rounding gives 15.9, direct rounding gives 15.8. Rounding in two stages can give a different answer from rounding directly." },
      ],
      tryit: { q: "Round 9.83 to the nearest whole number.", answer: "10. The first digit after the point is 8, which is 5 or more, so 9 rounds up to 10." },
    },
    {
      h: "6. The tricky exactly-halfway case",
      body: [
        "Every so often a number lands slap in the middle, exactly the same distance from both pegs. On the number line, 25 sits precisely halfway between 20 and 30, so it is not nearer to either one. What do we do then?",
        "Everyone has agreed on one simple answer: when a number is exactly halfway, we always round UP. So 25 rounds up to 30, and 450 rounds up to 500, even though each one is smack in the middle.",
        "This is called a convention, which is a fancy word for a rule that people have simply agreed to share. It is not something you could work out from the number itself. We use it so that rounding always gives one clear answer instead of leaving you stuck choosing between two.",
        "You can spot when a question is testing this on purpose. The deciding digit will be exactly 5 with nothing awkward after it, like 25, 350 or 3.5. That is your signal to remember the agreement: exactly halfway rounds up.",
      ],
      examples: [
        { q: "Round 350 to the nearest hundred.", steps: ["The two nearest hundreds are 300 and 400.", "350 is exactly halfway between them, 50 away from each.", "By the agreed convention, exactly halfway rounds up.", "So 350 rounds up to 400."], answer: "400" },
        { q: "Round 6,500 to the nearest thousand.", steps: ["The nearest thousands are 6,000 and 7,000.", "6,500 is exactly halfway between them, 500 away from each.", "By convention, exactly halfway rounds up."], answer: "7,000" },
        { q: "Round 2,450 to the nearest hundred and then to the nearest thousand. Do you get the same answer each time?", steps: ["To the nearest hundred: nearest hundreds are 2,400 and 2,500. 2,450 is exactly halfway, so rounds up to 2,500.", "To the nearest thousand: nearest thousands are 2,000 and 3,000. 2,450 is 450 from 2,000 and 550 from 3,000, so closer to 2,000. Rounds down to 2,000.", "The two answers are different."], answer: "No. To the nearest hundred it rounds up to 2,500 (exactly halfway), but to the nearest thousand it rounds down to 2,000 (closer to 2,000 than to 3,000)." },
      ],
      tryit: { q: "Round 3.5 to the nearest whole number.", answer: "4. It is exactly halfway between 3 and 4, and the convention says exactly halfway rounds up." },
    },
    {
      h: "7. Working backwards: what could the original number have been?",
      body: [
        "Now let's flip the whole thing round. Suppose someone tells you a number has ALREADY been rounded, and asks what it might have been before. This is like being told 'about 600' and trying to guess the exact count.",
        "The key surprise is that there is not just one answer. Lots of different starting numbers can round to the same tidy number, so working backwards gives you a whole range of possibilities rather than a single one.",
        "Picture the number line again with a peg at 600. Which numbers are close enough to slide onto that peg when rounding to the nearest hundred? Everything from 550 up to just below 650. That is because 550 is the lowest number near enough to round up to 600, and 649 is the highest number that still rounds down to 600. As soon as you reach 650 you are exactly halfway to 700, so it hops up to 700 instead.",
        "So 'rounds to 600 to the nearest hundred' really means the true number was somewhere from 550 to 649. A handy tip for finding the smallest possible starting number: take half of the rounding size and subtract it. Here the rounding size is 100, half of 100 is 50, and 600 minus 50 is 550.",
      ],
      examples: [
        { q: "A number rounds to 3,000 to the nearest hundred. What is the smallest it could have been?", steps: ["The rounding size is 100, because we rounded to the nearest hundred.", "Half of 100 is 50.", "The smallest number that still rounds up to 3,000 is 3,000 minus 50, which is 2,950."], answer: "2,950" },
        { q: "A number rounds to 4,000 to the nearest hundred. What is the largest it could be?", steps: ["Numbers round to 4,000 to the nearest hundred when they are less than 4,050 (since 4,050 would round up to 4,100).", "The largest whole number below 4,050 is 4,049."], answer: "4,049" },
        { q: "A number rounds to 600 to the nearest ten. What is the largest whole number it could be? And what is the smallest?", steps: ["Numbers round to 600 to the nearest ten if their ones digit is 0-4 (for numbers just above 600) or 5-9 rounding up to 600.", "Smallest: 595 (halfway point, rounds up to 600).", "Largest: 604 (ones digit is 4, which rounds down to 600; 605 would round up to 610)."], answer: "Smallest: 595. Largest: 604." },
      ],
      tryit: { q: "A number rounds to 80 to the nearest ten. What is the smallest whole number it could have been?", answer: "75. Half of ten is 5, and 80 minus 5 is 75, which is the lowest number that rounds up to 80." },
    },
    {
      h: "8. Estimating: using rounding to check your sums",
      body: [
        "Here is where rounding earns its keep. An estimate is a quick, rough answer that you get by rounding the numbers first and then doing the easier sum. You use it either when a rough answer is all you need, or to check that your careful answer looks sensible.",
        "Imagine you are at the shops holding items that cost 3.90 pounds, 5.10 pounds and 1.95 pounds. To see roughly whether 15 pounds will cover it, you round each price to the nearest pound in your head: about 4, plus about 5, plus about 2, which is about 11 pounds. That is an estimate, and it tells you straight away that 15 pounds is plenty.",
        "Estimating shines as a safety check on bigger sums. Suppose you need 312 times 48. Round each number to something friendly first: 312 becomes 300 and 48 becomes 50. Then 300 times 50 is 15,000. So you know the true answer should be somewhere near 15,000.",
        "Now if you did the full sum carefully and got 14,976, that sits nicely next to your estimate of 15,000, so you can trust it. But if you had accidentally got 1,497 or 149,760, your estimate would instantly wave a red flag that a mistake had crept in. Estimating does not replace the real calculation, it stands guard over it.",
      ],
      examples: [
        { q: "Estimate 612 + 289 by rounding each number to the nearest hundred.", steps: ["Round 612 to the nearest hundred: the tens digit is 1, which is 4 or less, so it rounds down to 600.", "Round 289 to the nearest hundred: the tens digit is 8, which is 5 or more, so it rounds up to 300.", "Add the friendly numbers: 600 plus 300 is 900.", "So the answer should be near 900. (The exact answer is 901, which fits beautifully.)"], answer: "About 900" },
        { q: "Estimate 3,742 + 1,189 by rounding each number to the nearest thousand.", steps: ["Round 3,742: hundreds digit is 7 ('5 or more'), round up to 4,000.", "Round 1,189: hundreds digit is 1 ('4 or less'), round down to 1,000.", "Add the rounded numbers: 4,000 + 1,000 = 5,000."], answer: "About 5,000 (the exact answer is 4,931, which is close)." },
        { q: "Estimate 47 × 38 by rounding each number to the nearest ten.", steps: ["Round 47: ones digit is 7 ('5 or more'), round up to 50.", "Round 38: ones digit is 8 ('5 or more'), round up to 40.", "Multiply the rounded numbers: 50 × 40 = 2,000.", "Both numbers rounded up, so the estimate is a little above the true answer."], answer: "About 2,000 (the exact answer is 1,786, so the estimate is reasonably close but slightly high because both numbers were rounded up)." },
      ],
      tryit: { q: "Estimate 198 times 51 by rounding each number to the nearest ten.", answer: "200 times 50 equals 10,000." },
    },
  ],
};

PRIMARY_LESSONS.timesTablesFacts = {
  title: "Times Tables: one fact unlocks many others",
  minutes: 18,
  intro: "You might think times tables are a huge pile of separate facts you just have to remember one by one. Good news: they are not. They are more like a family, where the facts are all related to each other. Once you really understand a few of them, you can work out lots of the others without having to remember every single one. In this lesson we will build the whole idea up slowly, from the very beginning, so take your time and enjoy it.",
  sections: [
    {
      h: "1. What 'times' actually means",
      body: [
        "Before we do anything clever, let us be really sure about what the word 'times' means. When we say 'times', we mean 'lots of' or 'groups of'. So '3 times 4' means '3 groups of 4'.",
        "Picture it with real things. Imagine you have 3 little bags, and each bag has 4 sweets inside it. To find out how many sweets you have altogether, you count all the sweets in all the bags: 4 and 4 and 4. That is 12 sweets. So 3 times 4 equals 12. We write that as 3 x 4 = 12, and the little x is called the 'multiplication sign'. Multiplication is just a fast way of adding equal groups.",
        "Here is a second way to picture the very same thing, using a grid. Imagine a chocolate bar with 3 rows, and 4 chunks of chocolate in each row. If you count all the chunks, you get 12. A grid like this, with rows going across and columns going down, is a lovely way to see multiplication, and we will use grids again later.",
        "So whenever you see something like 6 x 7, you can always say it out loud as '6 groups of 7' or '6 lots of 7'. That plain meaning is the ground everything else in this lesson is built on.",
      ],
      examples: [
        { q: "What does 5 x 2 mean, and what is the answer?", steps: ["5 x 2 means '5 groups of 2'.", "Imagine 5 pairs of socks. Each pair is 2 socks.", "Count them: 2, 4, 6, 8, 10.", "So 5 x 2 = 10."], answer: "5 x 2 = 10 (five groups of two)" },
        { q: "What does 4 x 7 mean, and what is the answer?", steps: ["4 x 7 means '4 groups of 7'.", "Imagine 4 weeks of days. Each week is 7 days.", "Count in 7s: 7, 14, 21, 28.", "So 4 x 7 = 28."], answer: "4 x 7 = 28 (four groups of seven)" },
        { q: "You have 6 shelves with 9 books on each shelf. Write the multiplication and find the total number of books.", steps: ["6 shelves × 9 books per shelf means 6 groups of 9.", "Count in 9s: 9, 18, 27, 36, 45, 54.", "So 6 × 9 = 54."], answer: "6 × 9 = 54. There are 54 books altogether." },
      ],
      tryit: { q: "Say what 4 x 3 means in words, then work out the answer.", answer: "It means '4 groups of 3'. Count 3, 6, 9, 12. So 4 x 3 = 12." },
    },
    {
      h: "2. The order does not change the answer",
      body: [
        "Here is the first magic trick, and it is a big one. When you multiply two numbers, you can swap them round and the answer stays exactly the same. So 3 x 4 gives the same answer as 4 x 3. Both are 12.",
        "That might sound too good to be true, so let us see why it works with our chocolate grid. Picture 3 rows with 4 chunks in each row. That is 12 chunks. Now turn the very same bar on its side. Now it looks like 4 rows with 3 chunks in each row. You did not eat any chocolate and you did not add any, so it is still 12 chunks. The grid did not change, you just looked at it a different way.",
        "You can feel this with the sweets too. 3 bags of 4 sweets is 12 sweets. 4 bags of 3 sweets is also 12 sweets. Same amount, just shared out into a different number of bags.",
        "Why do we care? Because it quietly cuts your work in half. Every time you learn one fact, you get its 'swap' for free without any extra effort. And it is really handy when one way round feels harder to remember than the other. If 8 x 3 feels slow in your head, just flip it to 3 x 8, work out '3 groups of 8', and you have your answer.",
      ],
      examples: [
        { q: "You know that 7 x 5 = 35. Use that to find 5 x 7, and explain how you know.", steps: ["The order does not change the answer.", "So 5 x 7 must equal 7 x 5.", "You already know 7 x 5 = 35.", "So 5 x 7 = 35 as well, no new work needed."], answer: "5 x 7 = 35 (same as 7 x 5)" },
        { q: "You know 9 x 4 = 36. Use this to write down the answer to 4 x 9 straight away.", steps: ["The order of multiplication does not change the answer.", "So 4 x 9 must equal 9 x 4.", "4 x 9 = 36. No new work needed."], answer: "4 x 9 = 36 (same as 9 x 4)" },
        { q: "You know 6 x 8 = 48. Check this by counting 8 groups of 6 (that is, adding 8 six times).", steps: ["By commutativity: 8 x 6 = 6 x 8 = 48.", "Check by repeated addition: 6+6 = 12, +6 = 18, +6 = 24, +6 = 30, +6 = 36, +6 = 42, +6 = 48.", "Both methods give 48, so the answer is confirmed."], answer: "8 x 6 = 48, confirmed by both commutativity and repeated addition." },
      ],
      tryit: { q: "If you know that 9 x 4 = 36, what is 4 x 9?", answer: "36. Swapping the two numbers round never changes the answer." },
    },
    {
      h: "3. Building a table by adding one more group",
      body: [
        "You do not have to remember every fact in a times table separately. The facts sit next to each other like steps on a staircase, and each step is the same height.",
        "Think about the 5 times table. 1 x 5 is one group of 5, which is 5. To get 2 x 5, you just add one more group of 5, so 5 add 5 is 10. For 3 x 5, add another 5 to make 15. Every time you take one more step along the table, you add the table's own number, which here is 5. That is why the 5 times table goes 5, 10, 15, 20, 25 and so on, always going up in fives.",
        "A number line helps you see this. Imagine a long ruler with the numbers marked on it. Counting in the 5 times table is like hopping along the ruler, and every hop is exactly 5 spaces long. The places you land on are the answers in the table.",
        "This gives you a brilliant rescue trick. Suppose you get stuck and cannot remember 8 x 6. If you can remember the fact just before it, 7 x 6 = 42, you only need to add one more group of 6. So 42 add 6 is 48, which means 8 x 6 = 48. You crept forward one safe step instead of panicking.",
        "Going one step backwards works the same way, just in reverse. Instead of adding the table's number, you take it away. If you know 8 x 6 = 48 but want 7 x 6, subtract one group of 6: 48 take away 6 is 42.",
      ],
      examples: [
        { q: "You remember that 6 x 7 = 42 but you have forgotten 7 x 7. Use the staircase idea to work it out.", steps: ["7 x 7 is just one step further along the 7 times table than 6 x 7.", "One step means adding one more group of 7.", "42 add 7 = 49.", "So 7 x 7 = 49."], answer: "7 x 7 = 49" },
        { q: "You know 8 x 9 = 72 but have forgotten 9 x 9. Use the staircase idea to find it.", steps: ["9 x 9 is one step further along the 9 times table than 8 x 9.", "One step means adding one more group of 9.", "72 + 9 = 81."], answer: "9 x 9 = 81" },
        { q: "You know 7 x 8 = 56. Use two staircase steps to find 7 x 10.", steps: ["7 x 9 is one step up from 7 x 8: 56 + 7 = 63.", "7 x 10 is one step up from 7 x 9: 63 + 7 = 70.", "Check: 7 x 10 = 70."], answer: "7 x 10 = 70" },
      ],
      tryit: { q: "If 7 x 8 = 56, what is 8 x 8, using the 'add one more group' trick?", answer: "Add one more group of 8: 56 + 8 = 64. So 8 x 8 = 64." },
    },
    {
      h: "4. Doubling to jump between tables",
      body: [
        "Some tables are close relatives of each other, and doubling is the family link. 'Doubling' just means adding a number to itself, or in other words having two of it. Double 6 is 6 add 6, which is 12.",
        "Look at what doubling does across the tables. Two groups of 7 is 14. Four groups of 7 is double that, because 4 groups is just 2 groups counted twice, so it is 14 add 14, which is 28. And eight groups of 7 is double again, 28 add 28, which is 56. So if you are confident with the 2 times table, you can double your way up to the 4 times table, then double again to reach the 8 times table.",
        "Here is a real-world way to feel it. Imagine trays of buns, with 7 buns on each tray. Two trays hold 14 buns. If you carry twice as many trays, four trays, you must have twice as many buns, so 28. Twice as many again, eight trays, gives 56 buns. Doubling the number of trays doubles the number of buns.",
        "This is really useful because doubling is one of the easiest things to do in your head, much easier than remembering a whole extra table. Get comfy with doubling and a lot of scary looking facts become gentle two step jumps.",
      ],
      examples: [
        { q: "You know 3 x 6 = 18. Use doubling to work out 6 x 6.", steps: ["6 groups of 6 is double 3 groups of 6, because 6 groups is 3 groups counted twice.", "So double 18.", "18 + 18 = 36.", "So 6 x 6 = 36."], answer: "6 x 6 = 36" },
        { q: "You know 4 x 7 = 28. Use doubling to work out 8 x 7.", steps: ["8 groups of 7 is double 4 groups of 7, because 8 is double 4.", "Double 28.", "28 + 28 = 56.", "So 8 x 7 = 56."], answer: "8 x 7 = 56" },
        { q: "You know 3 x 9 = 27. Use doubling twice to find 12 x 9.", steps: ["6 x 9 is double 3 x 9: double 27 = 54.", "12 x 9 is double 6 x 9: double 54 = 108.", "Check: 10 x 9 + 2 x 9 = 90 + 18 = 108."], answer: "12 x 9 = 108" },
      ],
      tryit: { q: "You know 4 x 8 = 32. Use doubling to find 8 x 8.", answer: "Double it: 32 + 32 = 64. So 8 x 8 = 64." },
    },
    {
      h: "5. Splitting a big multiplication into easy parts",
      body: [
        "Sometimes a multiplication looks too big or too awkward to do all in one go. When that happens, you can break one of the numbers into friendlier pieces, multiply each piece on its own, then add your answers back together. This is called 'splitting'.",
        "Let us try 13 x 6. The number 13 feels lumpy, so split it into 10 and 3, which are much friendlier. Now do two easy sums. 10 groups of 6 is 60. 3 groups of 6 is 18. Then add them back together: 60 add 18 is 78. So 13 x 6 = 78. You turned one hard fact into two easy ones.",
        "You can see why this is allowed with the grid picture again. Imagine a grid that is 13 squares wide and 6 squares tall. Draw a line down it after the tenth column. Now you have two smaller grids side by side, one that is 10 wide and one that is 3 wide, both still 6 tall. The number of squares did not change just because you drew a line. So the big grid (13 x 6) really does equal the two little grids added together (10 x 6 and 3 x 6).",
        "The most important habit here is to remember to add both parts back at the end. It is easy to work out 60 and 18 and then forget to join them together. Every piece you split off has to come back into the final total.",
      ],
      examples: [
        { q: "Work out 15 x 4 by splitting.", steps: ["Split 15 into 10 and 5.", "10 x 4 = 40.", "5 x 4 = 20.", "Add the parts back together: 40 + 20 = 60.", "So 15 x 4 = 60."], answer: "15 x 4 = 60" },
        { q: "Work out 17 x 6 by splitting.", steps: ["Split 17 into 10 and 7.", "10 x 6 = 60.", "7 x 6 = 42.", "Add the parts: 60 + 42 = 102."], answer: "17 x 6 = 102" },
        { q: "Work out 13 x 14 by splitting the 14 into 10 and 4.", steps: ["13 x 14 = 13 x 10 + 13 x 4.", "13 x 10 = 130.", "13 x 4 = 52.", "Add: 130 + 52 = 182."], answer: "13 x 14 = 182" },
      ],
      tryit: { q: "Use splitting to work out 14 x 5.", answer: "Split 14 into 10 and 4. (10 x 5) + (4 x 5) = 50 + 20 = 70. So 14 x 5 = 70." },
    },
    {
      h: "6. Growing a fact ten times bigger",
      body: [
        "Once you know a small fact, you can stretch it into much bigger facts using tens. First, a quick reminder of what happens when a number gets ten times bigger. When you make a whole number ten times bigger, every digit shifts up one place and a zero appears on the end. So 6 becomes 60, and 42 becomes 420.",
        "Now watch this. You know that 6 x 7 = 42. What is 60 x 7? Well, 60 is just 6 made ten times bigger. So you are dealing with ten times as many groups, which means ten times as many things altogether. That means the answer is ten times bigger too: 42 becomes 420. So 60 x 7 = 420.",
        "Here is a real-world way to trust it. Suppose one box holds 7 apples, so 6 boxes hold 42 apples. Now imagine 60 boxes instead, which is ten times as many boxes. You must have ten times as many apples, and ten times 42 is 420. Nothing tricky happened, there were simply ten times more of everything.",
        "It works the same way if you make the other number ten times bigger instead. 6 x 70 is also 420, because 70 is ten times 7. Either way, one number grew ten times, so the answer grew ten times.",
      ],
      examples: [
        { q: "Given that 8 x 9 = 72, work out 80 x 9.", steps: ["80 is 8 made ten times bigger.", "So there are ten times as many groups, meaning ten times the total.", "Make 72 ten times bigger: 72 becomes 720.", "So 80 x 9 = 720."], answer: "80 x 9 = 720" },
        { q: "Given that 7 x 8 = 56, work out 70 x 8.", steps: ["70 is 7 made ten times bigger.", "Ten times as many groups means ten times the total.", "56 made ten times bigger is 560."], answer: "70 x 8 = 560" },
        { q: "Given that 6 x 9 = 54, work out 600 x 9.", steps: ["600 is 6 made one hundred times bigger.", "One hundred times as many groups means one hundred times the total.", "54 made one hundred times bigger is 5,400."], answer: "600 x 9 = 5,400" },
      ],
      tryit: { q: "You know 4 x 6 = 24. What is 40 x 6?", answer: "40 is ten times bigger than 4, so the answer is ten times bigger too: 240." },
    },
    {
      h: "7. Growing a fact a hundred times bigger",
      body: [
        "What if BOTH numbers get ten times bigger at the same time? Then the answer does not grow ten times, it grows a hundred times. That surprises a lot of people, so let us go slowly.",
        "Start with 8 x 9 = 72. First make the 8 into 80. As we saw, that makes the answer ten times bigger, so 80 x 9 = 720. Now make the 9 into 90 as well. That makes the answer ten times bigger AGAIN, so 720 becomes 7200. So 80 x 90 = 7200. You grew it by ten, and then by ten again, and ten times ten is a hundred.",
        "Think of it like blowing up a photo on a screen. If you make the picture ten times wider and also ten times taller, it does not just get ten times bigger overall, it gets a hundred times bigger, because it grew in two directions at once. Multiplication behaves the same way, one number is like the width and the other is like the height.",
        "A quick way to keep track is to count the zeros. 80 has one zero and 90 has one zero, that is two zeros in total. So take your small answer, 72, and put two zeros on the end to get 7200. Just be careful, this counting-zeros shortcut is a helper, not the reason it works. The real reason is that each number growing ten times makes the answer grow ten times, and the two growings multiply together into a hundred.",
      ],
      examples: [
        { q: "Given that 6 x 7 = 42, work out 60 x 70.", steps: ["60 is 6 made ten times bigger, so that would make the answer ten times bigger.", "70 is 7 made ten times bigger, which makes the answer ten times bigger again.", "Ten times and then ten times more is a hundred times.", "So make 42 a hundred times bigger: 42 becomes 4200.", "So 60 x 70 = 4200."], answer: "60 x 70 = 4200" },
        { q: "Given that 4 x 9 = 36, work out 40 x 90.", steps: ["40 is 4 made ten times bigger and 90 is 9 made ten times bigger.", "Two lots of 'ten times bigger' means a hundred times bigger overall.", "Make 36 one hundred times bigger: 36 becomes 3,600."], answer: "40 x 90 = 3,600" },
        { q: "Given that 8 x 7 = 56, work out 800 x 70.", steps: ["800 = 8 x 100, so that makes the answer 100 times bigger. 70 = 7 x 10, so that makes the answer 10 times bigger.", "Together: 100 x 10 = 1,000 times bigger.", "56 made 1,000 times bigger is 56,000."], answer: "800 x 70 = 56,000" },
      ],
      tryit: { q: "You know 8 x 9 = 72. What is 80 x 90?", answer: "Both numbers grew ten times, so the answer grows a hundred times: 72 becomes 7200. So 80 x 90 = 7200." },
    },
    {
      h: "8. Every times fact hides two division facts",
      body: [
        "Here is a lovely surprise to finish on. Every times table fact you learn secretly teaches you two division facts at the same time, with no extra remembering at all. First though, let us be sure what division means. Dividing means sharing something out into equal groups, or asking 'how many groups can I make'. The little sign for it is the division sign, which looks like this: a small line with a dot above and below.",
        "Multiplication and division are opposites, like getting dressed and getting undressed. Multiplication puts groups together to make a total. Division takes a total and breaks it back into groups. Because they undo each other, they come from the same family of facts.",
        "Let us see it with sweets. You know that 7 x 8 = 56, which means 7 groups of 8 sweets make 56 sweets. Now imagine you already have 56 sweets and you want to share them into 8 equal piles. How many sweets go in each pile? 7 of them. So 56 divided by 8 is 7. And if instead you shared those 56 sweets into 7 equal piles, each pile would hold 8, so 56 divided by 7 is 8. The very same fact, looked at backwards, gave you both.",
        "So the single fact 7 x 8 = 56 actually hands you three facts to use: 7 x 8 = 56, and 56 shared into 8 gives 7, and 56 shared into 7 gives 8. The two numbers you multiplied together become the two answers you get when you divide. Watch out for one common slip up: keep clear in your head which number is the total you are sharing out and which is the number of piles you are sharing it into.",
      ],
      examples: [
        { q: "Given that 9 x 6 = 54, write down the two division facts it also gives you.", steps: ["The total made is 54, from 9 groups of 6.", "Share 54 into 6 equal piles: each pile has 9. So 54 divided by 6 = 9.", "Share 54 into 9 equal piles: each pile has 6. So 54 divided by 9 = 6."], answer: "54 divided by 6 = 9, and 54 divided by 9 = 6" },
        { q: "Given that 8 x 7 = 56, write down the two division facts it gives you.", steps: ["The total is 56, made from 8 groups of 7.", "Share 56 into 7 equal piles: each has 8. So 56 ÷ 7 = 8.", "Share 56 into 8 equal piles: each has 7. So 56 ÷ 8 = 7."], answer: "56 ÷ 7 = 8, and 56 ÷ 8 = 7" },
        { q: "Given that 12 x 9 = 108, write down the two division facts. Then use one to work out 216 ÷ 9.", steps: ["108 ÷ 9 = 12 and 108 ÷ 12 = 9.", "216 is double 108. Since 108 ÷ 9 = 12, then 216 ÷ 9 = double 12 = 24."], answer: "108 ÷ 9 = 12 and 108 ÷ 12 = 9. Then 216 ÷ 9 = 24." },
      ],
      tryit: { q: "You know 7 x 5 = 35. What are the two division facts hiding inside it?", answer: "35 divided by 5 = 7, and 35 divided by 7 = 5." },
    },
  ],
};

PRIMARY_LESSONS.divisionRemainders = {
  title: "Division & Remainders: what's left over depends on the question",
  minutes: 18,
  intro: "Sometimes when you share things out, everything splits up perfectly and nothing is left over. But lots of the time there are a few bits left at the end that will not fit. Those leftover bits are called a remainder, and the clever part of this lesson is not just finding them. It is working out what to do with them, because that changes depending on what the question is really asking.",
  sections: [
    {
      h: "1. What dividing actually means",
      body: [
        "Before we worry about anything being left over, let us make sure we agree on what dividing is. Dividing means splitting a group of things into smaller equal parts. Equal means every part gets exactly the same amount, with none being bigger than the others.",
        "There are two friendly ways to picture dividing, and it really helps to know both.",
        "The sharing way: imagine you have 12 sweets and 3 friends, and you want to be fair. You deal the sweets out one at a time, like dealing cards, going round and round until they are gone. Each friend ends up with 4 sweets. So 12 divided by 3 is 4. The little sign for divided by is this: 12 ÷ 3 = 4.",
        "The grouping way: imagine the same 12 sweets, but this time you put them into little bags with 3 sweets in each bag. How many bags can you fill? You can fill 4 bags. That is also 12 ÷ 3 = 4.",
        "Notice that both ways gave the same answer, but you were asking slightly different questions. Sharing asks 'how many does each one get?' Grouping asks 'how many groups can I make?' Keep both pictures in your head, because we will use them again.",
      ],
      tryit: { q: "You have 10 stickers to share equally between 2 people. How many does each person get?", answer: "5 stickers each. Deal them out one at a time and each person gets 5 (2 x 5 = 10)." },
    },
    {
      h: "2. When it does not split up neatly",
      body: [
        "Real life is not always tidy. What happens if you have 13 sweets and 3 friends? Let us deal them out, one at a time, going round the friends.",
        "After a full round, each friend has 1 sweet and you have used 3. After another round, each has 2 and you have used 6. Another round, each has 3 and you have used 9. One more round, each has 4 and you have used 12. Now you try to go round again, but only 1 sweet is left, and 1 will not stretch to give all three friends another one. If you gave a sweet to some friends and not others, that would not be equal any more.",
        "So each friend gets 4 sweets, and there is 1 sweet sitting there that cannot be shared. That lonely leftover sweet is called the remainder. A remainder is the amount left over after you have shared or grouped as far as you fairly can.",
        "Let us count that again slowly to be sure. Deal round once, each friend has 1 (3 used). Round twice, each has 2 (6 used). Round three times, each has 3 (9 used). Round four times, each has 4 (12 used). Now only 1 sweet is left, too few to go round again. So each friend got 4 sweets with 1 left over.",
        "We write this as 13 ÷ 3 = 4 remainder 1. The safe way to reach that without dealing every card is to ask how many times 3 fits into 13. It fits 4 times because 3 x 4 = 12, and 13 take away 12 leaves 1. Same answer, less counting.",
      ],
      examples: [
        { q: "You have 7 biscuits to share equally between 2 people. How many does each get, and how many are left over?", steps: ["Deal them out: each person gets 1 (2 used), then 2 (4 used), then 3 (6 used).", "Now only 1 biscuit is left, and it cannot be shared fairly between 2 people.", "So each person gets 3 biscuits, with 1 left over.", "Written down: 7 ÷ 2 = 3 remainder 1."], answer: "3 biscuits each, with 1 left over." },
        { q: "Share 17 apples equally between 3 baskets. How many in each basket, and how many are left over?", steps: ["How many 3s fit inside 17? 3 x 5 = 15, and 3 x 6 = 18 which is too big.", "17 take away 15 leaves 2.", "So each basket gets 5 apples with 2 left over.", "Written down: 17 ÷ 3 = 5 remainder 2."], answer: "5 apples in each basket, with 2 left over." },
        { q: "A box of 35 chocolates is shared equally between 8 people. How many does each person get, and how many are left over?", steps: ["How many 8s fit inside 35? 8 x 4 = 32, and 8 x 5 = 40 which is too big.", "35 take away 32 leaves 3.", "Written down: 35 ÷ 8 = 4 remainder 3.", "Check: 8 x 4 + 3 = 32 + 3 = 35."], answer: "4 chocolates each, with 3 left over." },
      ],
      tryit: { q: "Share 10 grapes equally between 3 children. How many each, and how many left over?", answer: "3 grapes each, with 1 left over (3 x 3 = 9, and 10 - 9 = 1)." },
    },
    {
      h: "3. Seeing remainders on a number line",
      body: [
        "Sharing out sweets is one way to see a remainder. Here is a second, very different way that some children find even clearer: hopping along a number line.",
        "A number line is just a straight line with the numbers marked on it in order: 0, 1, 2, 3, 4 and so on, evenly spaced like markings on a ruler.",
        "To work out 14 ÷ 4, start at 0 and take hops of 4. First hop lands on 4. Second hop lands on 8. Third hop lands on 12. Now try a fourth hop of 4, which would land on 16, but 16 is past 14, so you are not allowed to take it.",
        "Count your full hops: you managed 3 whole hops. That is the whole-number part of the answer. Then look at the gap between where you stopped (12) and where you were heading (14). That gap is 2. That gap is the remainder.",
        "So 14 ÷ 4 = 3 remainder 2. The number of complete hops is the answer, and the little bit of the line you could not hop over is the leftover.",
        "This is really the grouping picture from Section 1 in disguise. Each hop of 4 is one group of 4, and the leftover gap is the bit too small to make another whole group.",
      ],
      examples: [
        { q: "Use hops on a number line to work out 11 ÷ 3.", steps: ["Start at 0 and hop in 3s: 3, then 6, then 9.", "A fourth hop would reach 12, which is past 11, so stop.", "You took 3 full hops, and the gap from 9 to 11 is 2.", "So 11 ÷ 3 = 3 remainder 2."], answer: "3 remainder 2" },
        { q: "Use hops on a number line to work out 19 ÷ 4.", steps: ["Start at 0 and hop in 4s: 4, 8, 12, 16.", "The next hop would reach 20, which is past 19, so stop.", "You took 4 full hops, and the gap from 16 to 19 is 3.", "So 19 ÷ 4 = 4 remainder 3."], answer: "4 remainder 3" },
        { q: "Use the hop idea to work out 38 ÷ 7.", steps: ["Hop in 7s from 0: 7, 14, 21, 28, 35.", "The next hop would reach 42, which is past 38, so stop.", "You took 5 full hops, and the gap from 35 to 38 is 3.", "So 38 ÷ 7 = 5 remainder 3."], answer: "5 remainder 3" },
      ],
      tryit: { q: "Hopping in 5s from 0, how many full hops fit before you pass 17, and what is the gap left over?", answer: "3 full hops (5, 10, 15), then a gap of 2 to reach 17. So 17 ÷ 5 = 3 remainder 2." },
    },
    {
      h: "4. The golden rule: the remainder is always smaller than what you divide by",
      body: [
        "Here is a rule that will save you again and again. First, two quick words. The number you are dividing by (the size of each group, or the size of each hop) is called the divisor. In 13 ÷ 3, the divisor is 3.",
        "The rule is: the remainder must always be smaller than the divisor.",
        "Why? Think back to the sweets. If you had 3 friends and 3 or more sweets left over, then you could give every friend one more sweet. So the leftover would not really be a leftover yet. You only stop when what is left is too small to go round again, and that means it must be smaller than the number of friends.",
        "So if you ever finish a division and your remainder is the same size as the divisor, or bigger, that is a warning light. It means another whole group still fits and you stopped too early. Go back and give out one more group.",
        "For example, if you thought 13 ÷ 3 was 3 remainder 4, the remainder 4 is bigger than the divisor 3, so it is wrong. One more group of 3 fits inside that 4, leaving 1. The right answer is 4 remainder 1.",
      ],
      tryit: { q: "A friend says 20 ÷ 6 = 2 remainder 8. Without doing the whole sum, how can you tell they made a mistake?", answer: "The remainder 8 is bigger than the divisor 6, which is not allowed. Another group of 6 still fits. The correct answer is 20 ÷ 6 = 3 remainder 2." },
    },
    {
      h: "5. Always check your work by building it back up",
      body: [
        "Every division with a remainder can be checked, and checking takes only a moment. This is a great habit because it catches mistakes before anyone else sees them.",
        "The idea is to build the starting number back up from your answer. You had some full groups plus a leftover, so if you multiply the group size by the number of groups and then add the leftover, you should land exactly on the number you began with.",
        "In words: (divisor times the whole-number answer) plus the remainder should equal the number you started with.",
        "Let us check 13 ÷ 3 = 4 remainder 1. The divisor is 3, the answer is 4, the remainder is 1. So 3 x 4 = 12, and 12 + 1 = 13. That is exactly the number we started with, so the tick is earned.",
        "If your check does not land on the starting number, something has gone wrong somewhere, and it is much better to find that out now.",
      ],
      examples: [
        { q: "Work out 34 ÷ 6, then check your answer.", steps: ["How many 6s fit into 34? 6 x 5 = 30, and 6 x 6 = 36 which is too big, so 5 whole groups fit.", "34 take away 30 leaves 4, so 34 ÷ 6 = 5 remainder 4.", "The remainder 4 is smaller than the divisor 6, which is a good sign.", "Check by building back up: 6 x 5 = 30, then 30 + 4 = 34. It matches."], answer: "5 remainder 4" },
        { q: "Work out 51 ÷ 8, then check your answer.", steps: ["How many 8s fit into 51? 8 x 6 = 48, and 8 x 7 = 56 which is too big, so 6 whole groups fit.", "51 take away 48 leaves 3, so 51 ÷ 8 = 6 remainder 3.", "The remainder 3 is smaller than the divisor 8.", "Check: 8 x 6 = 48, then 48 + 3 = 51. It matches."], answer: "6 remainder 3" },
        { q: "Work out 143 ÷ 9, then check your answer.", steps: ["How many 9s fit into 143? 9 x 15 = 135, and 9 x 16 = 144 which is too big, so 15 whole groups fit.", "143 take away 135 leaves 8, so 143 ÷ 9 = 15 remainder 8.", "The remainder 8 is smaller than the divisor 9.", "Check: 9 x 15 = 135, then 135 + 8 = 143. It matches."], answer: "15 remainder 8" },
      ],
      tryit: { q: "Check whether 25 ÷ 4 = 6 remainder 1 is correct.", answer: "Yes. 4 x 6 = 24, then 24 + 1 = 25, which is the starting number, and the remainder 1 is smaller than the divisor 4. Correct." },
    },
    {
      h: "6. Leftover 1: sometimes you round UP",
      body: [
        "Now for the really important part of this whole topic. Once you have found the remainder, you have to decide what it means in the real story. There are three main things you might do, and the next three sections take them one at a time.",
        "The first is rounding up, which means going to the next whole number instead of ignoring the leftover.",
        "Picture this. A minibus can carry 8 passengers, and 51 people need to get to a match. Work out 51 ÷ 8 first. 8 x 6 = 48, and 51 take away 48 leaves 3, so 51 ÷ 8 = 6 remainder 3.",
        "Could you send just 6 minibuses? Six minibuses carry 48 people, but that leaves 3 people standing on the pavement with no ride. You cannot leave people behind, so those 3 need a minibus too, even though it will be almost empty.",
        "So you round up from 6 to 7. You need 7 minibuses. Whenever the leftover people or things still need looking after, the extra almost-empty group still counts, and you go up to the next whole number.",
      ],
      examples: [
        { q: "There are 40 eggs and every egg must be put safely into a box that holds 6. How many boxes are needed?", steps: ["Work out 40 ÷ 6. 6 x 6 = 36, and 40 - 36 = 4, so 40 ÷ 6 = 6 remainder 4.", "Six boxes hold 36 eggs, but 4 eggs are still left over and must be kept safe too.", "Those 4 eggs need a seventh box, even though it is not full.", "So round up: 7 boxes are needed."], answer: "7 boxes" },
        { q: "53 children need to travel in minibuses that hold 9 each. How many minibuses are needed?", steps: ["Work out 53 ÷ 9. 9 x 5 = 45, and 9 x 6 = 54 which is too big, so 53 ÷ 9 = 5 remainder 8.", "Five minibuses carry 45 children, but 8 are left over and still need to travel.", "Those 8 children need a sixth minibus.", "Round up: 6 minibuses are needed."], answer: "6 minibuses" },
        { q: "A school library has 127 books to shelve, with 15 books per shelf. How many shelves are needed to hold all the books?", steps: ["Work out 127 ÷ 15. 15 x 8 = 120, and 15 x 9 = 135 which is too big, so 127 ÷ 15 = 8 remainder 7.", "Eight shelves hold 120 books, but 7 are left over and still need a place.", "Those 7 books need a ninth shelf.", "Round up: 9 shelves are needed."], answer: "9 shelves" },
      ],
      tryit: { q: "A ferry seat row holds 4 people. 29 people are waiting. How many rows are needed so everyone has a seat?", answer: "8 rows. 29 ÷ 4 = 7 remainder 1, and that last 1 person still needs a seat, so round up from 7 to 8." },
    },
    {
      h: "7. Leftover 2: sometimes you round DOWN",
      body: [
        "The second thing you can do with a remainder is round down, which means throwing the leftover away because it is not enough to count.",
        "This is the opposite of the minibus story, and it happens when the question asks for complete or whole things only.",
        "Picture this. You have 20 flowers and you are making bunches, with 6 flowers in every bunch. How many complete bunches can you make? Work out 20 ÷ 6. 6 x 3 = 18, and 20 take away 18 leaves 2, so 20 ÷ 6 = 3 remainder 2.",
        "You can make 3 full bunches. The 2 flowers left over are real, but they cannot form a proper bunch of 6 on their own, so they do not count towards the answer. The question only asked for complete bunches.",
        "So here you round down, and the answer is just 3. The same remainder that meant 'add one more' in the minibus question means 'ignore it' here. That is why reading the question matters so much.",
      ],
      examples: [
        { q: "You have £25 and each cinema ticket costs £4. How many whole tickets can you afford?", steps: ["Work out 25 ÷ 4. 4 x 6 = 24, and 25 - 24 = 1, so 25 ÷ 4 = 6 remainder 1.", "Six tickets cost £24, which you can afford.", "The £1 left over is not enough to buy a seventh ticket, which costs £4.", "So round down and ignore the leftover: you can buy 6 tickets."], answer: "6 tickets" },
        { q: "You have 50p and each sticker costs 7p. How many stickers can you buy?", steps: ["Work out 50 ÷ 7. 7 x 7 = 49, and 50 - 49 = 1, so 50 ÷ 7 = 7 remainder 1.", "Seven stickers cost 49p, which you can afford.", "The 1p left over is not enough to buy an eighth sticker.", "Round down and ignore the leftover: you can buy 7 stickers."], answer: "7 stickers" },
        { q: "You have £15 and each book costs £4. How many books can you buy, and how much money is left over?", steps: ["Work out 15 ÷ 4. 4 x 3 = 12, and 15 - 12 = 3, so 15 ÷ 4 = 3 remainder 3.", "Three books cost £12, which you can afford.", "£3 is left over but is not enough for another book (which costs £4).", "Round down: you can buy 3 books and have £3 left over."], answer: "3 books, with £3 remaining." },
      ],
      tryit: { q: "A photo album fits 5 photos per page. You have 23 photos. How many pages are completely full?", answer: "4 full pages. 23 ÷ 5 = 4 remainder 3, and those last 3 photos do not fill a whole page, so only 4 pages are completely full." },
    },
    {
      h: "8. Leftover 3: sometimes you share it FURTHER",
      body: [
        "The third thing you can do is keep sharing the leftover, splitting it into smaller pieces so nothing is wasted at all.",
        "This works when the thing you are sharing can be cut up, like money, cake or juice, rather than things that must stay whole, like people or cars.",
        "Picture this. You are sharing £23 equally between 5 people. Work out 23 ÷ 5 first. 5 x 4 = 20, and 23 take away 20 leaves 3, so each person gets £4 with £3 left over.",
        "But money can be split into pennies, so you do not have to stop. Share that leftover £3 among the 5 people as well. £3 is 300 pennies, and 300 ÷ 5 = 60 pennies each, which is 60p. So each person gets £4 and 60p, written £4.60.",
        "The little dot in £4.60 is a decimal point, and it separates whole pounds from parts of a pound. You can check it the usual way: £4.60 x 5 = £23.00, back to the start.",
        "Another way to say the same thing is with a fraction. Each person got the 4 whole pounds plus 3 pounds shared between 5, which is three fifths of a pound. So sharing further can give a decimal answer or a fraction answer, and both mean the leftover has been split up fairly instead of thrown away.",
      ],
      examples: [
        { q: "Share £30 equally between 4 friends so no money is left over.", steps: ["Work out 30 ÷ 4. 4 x 7 = 28, and 30 - 28 = 2, so each friend gets £7 with £2 left over.", "Do not stop, because money can be split. Share the £2 between 4 friends.", "£2 is 200 pennies, and 200 ÷ 4 = 50 pennies each, which is 50p.", "So each friend gets £7 and 50p, written £7.50. Check: £7.50 x 4 = £30."], answer: "£7.50 each" },
        { q: "Share £21 equally between 6 people. Give your answer in pounds and pence.", steps: ["Work out 21 ÷ 6. 6 x 3 = 18, and 21 - 18 = 3, so each person gets £3 with £3 left over.", "Share the leftover £3: that is 300 pennies. 300 ÷ 6 = 50 pennies each, which is 50p.", "Each person gets £3 and 50p, written £3.50.", "Check: £3.50 x 6 = £21."], answer: "£3.50 each" },
        { q: "Share £50 equally between 8 people. Give your answer in pounds and pence.", steps: ["Work out 50 ÷ 8. 8 x 6 = 48, and 50 - 48 = 2, so each person gets £6 with £2 left over.", "Share the leftover £2: that is 200 pennies. 200 ÷ 8 = 25 pennies each, which is 25p.", "Each person gets £6 and 25p, written £6.25.", "Check: £6.25 x 8 = £50."], answer: "£6.25 each" },
      ],
      tryit: { q: "Share £9 equally between 2 people, splitting the leftover into pennies.", answer: "£4.50 each. 9 ÷ 2 = 4 remainder 1, and that leftover £1 (100p) shared between 2 is 50p each, so £4 and 50p." },
    },
    {
      h: "9. Reading the question to pick the right leftover move",
      body: [
        "You now know three moves: round up, round down and share further. The last skill is deciding which one a question wants, and the words in the question are your biggest clue.",
        "Words like 'how many are needed' or 'so that everyone has one' usually mean round up, because nothing and nobody can be left behind.",
        "Words like 'how many complete' or 'how many whole' or 'how many can you afford' usually mean round down, because only finished groups count.",
        "Words like 'share equally' or 'exactly how much each' usually mean share further, especially when the thing can be cut up like money or cake.",
        "A really good habit is this: do the division, then read the question one more time and ask yourself, does my leftover need adding on, dropping, or splitting up? Only then write your final answer. The maths in the middle is the same every time. The thinking at the end is what changes.",
      ],
      examples: [
        { q: "The same numbers, two different questions. There are 22 children and each car holds 5. Question A: how many cars are needed to take everyone? Question B: how many cars can be completely filled?", steps: ["Both start with the same division: 22 ÷ 5. 5 x 4 = 20, and 22 - 20 = 2, so 22 ÷ 5 = 4 remainder 2.", "Question A says 'needed to take everyone', so the 2 leftover children still need a car. Round up to 5 cars.", "Question B says 'completely filled', so the 2 leftover children do not fill a car. Round down to 4 cars.", "Same division, different answers, because the words asked for different things."], answer: "A: 5 cars. B: 4 cars." },
        { q: "31 apples are packed into bags of 6. Question A: how many complete bags can be made? Question B: how many bags are needed to hold all the apples?", steps: ["Both start with the same division: 31 ÷ 6. 6 x 5 = 30, and 31 - 30 = 1, so 31 ÷ 6 = 5 remainder 1.", "Question A: 'complete bags' means round down. Only 5 bags are fully packed.", "Question B: the 1 leftover apple still needs a bag. Round up to 6 bags."], answer: "A: 5 complete bags. B: 6 bags needed." },
        { q: "A bead shop has 85 beads. Packs hold 9 beads each. Question A: how many full packs can be made? Question B: how many beads are left over after filling those packs? Question C: what fraction of a full pack do the leftover beads make?", steps: ["Work out 85 ÷ 9. 9 x 9 = 81, and 85 - 81 = 4, so 85 ÷ 9 = 9 remainder 4.", "Question A: 9 full packs (round down).", "Question B: 4 beads left over.", "Question C: 4 out of 9 needed for a full pack, so 4/9 of a pack."], answer: "A: 9 full packs. B: 4 beads left over. C: 4/9 of a full pack." },
      ],
      tryit: { q: "48 pencils are put into packs of 5. Which move fits 'how many complete packs can be made', and what is the answer?", answer: "Round down. 48 ÷ 5 = 9 remainder 3, and the 3 spare pencils do not complete a pack, so 9 complete packs." },
    },
    {
      h: "10. Bigger numbers work in exactly the same way",
      body: [
        "It is easy to think that bigger numbers need a different, scarier method. They do not. The remainder idea is exactly the same. You just find how many whole groups fit, and see what is left.",
        "Take 137 ÷ 9. You want the biggest number of 9s that fits inside 137 without going over. 9 x 15 = 135, and 9 x 16 = 144 which is too big. So 15 whole groups fit.",
        "Then 137 take away 135 leaves 2, so 137 ÷ 9 = 15 remainder 2. The remainder 2 is smaller than the divisor 9, so the golden rule is happy.",
        "And you check it the very same way as always: build it back up. 9 x 15 = 135, then 135 + 2 = 137, which is the number we started with. It matches, so the answer is safe.",
        "So there is nothing new to learn for big numbers. Find the whole groups, find the leftover, check the leftover is smaller than the divisor, then build back up to be sure.",
      ],
      examples: [
        { q: "What is 152 ÷ 7, and how do you know it is right?", steps: ["Find the biggest number of 7s inside 152. 7 x 21 = 147, and 7 x 22 = 154 which is too big, so 21 whole groups fit.", "152 take away 147 leaves 5, so 152 ÷ 7 = 21 remainder 5.", "The remainder 5 is smaller than the divisor 7, which is allowed.", "Build back up to check: 7 x 21 = 147, then 147 + 5 = 152. It matches, so it is correct."], answer: "21 remainder 5" },
        { q: "Work out 236 ÷ 8, then check your answer by building back up.", steps: ["Find the biggest number of 8s inside 236. 8 x 29 = 232, and 8 x 30 = 240 which is too big.", "236 take away 232 leaves 4, so 236 ÷ 8 = 29 remainder 4.", "Remainder 4 is smaller than divisor 8.", "Check: 8 x 29 = 232, then 232 + 4 = 236. It matches."], answer: "29 remainder 4" },
        { q: "Work out 353 ÷ 11, then check your answer.", steps: ["Find the biggest number of 11s inside 353. 11 x 32 = 352, and 11 x 33 = 363 which is too big.", "353 take away 352 leaves 1, so 353 ÷ 11 = 32 remainder 1.", "Remainder 1 is smaller than divisor 11.", "Check: 11 x 32 = 352, then 352 + 1 = 353. It matches."], answer: "32 remainder 1" },
      ],
      tryit: { q: "Work out 100 ÷ 8, then check it.", answer: "12 remainder 4. 8 x 12 = 96, and 100 - 96 = 4, and 4 is smaller than 8. Check: 96 + 4 = 100. Correct." },
    },
  ],
};

PRIMARY_LESSONS.sequencePattern = {
  title: "Patterns & Sequences: finding the cycle",
  minutes: 18,
  intro: "A sequence is just a list of things written down in a set order, one after another. In this lesson we will look at two kinds. The first kind repeats itself over and over, like the pattern of beads on a necklace. The second kind keeps growing by the same jump each time, like the numbers you count in your times tables. We will build up both kinds slowly, from the very beginning, and by the end you will be able to work out what comes at any position without writing the whole list out by hand.",
  sections: [
    {
      h: "1. What is a repeating pattern?",
      body: [
        "A repeating pattern is a run of things where the same short group keeps coming back again and again, in the same order. You already see these everywhere.",
        "Think of the days of the week. Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, and then it starts all over again at Monday. Or think of stripes on a jumper: red, yellow, red, yellow, red, yellow. Or the tiles on a bathroom floor going black, white, black, white.",
        "Here is a picture to hold in your head. Imagine you have a bag of sweets in just two colours, green and orange, and you lay them out in a line always doing green then orange, green then orange, green then orange. If you kept going forever the line would never surprise you, because you always know what the next sweet must be.",
        "The important idea is this: in a repeating pattern nothing is random. There is a small group that repeats, and once you spot that small group you understand the whole thing, no matter how long it gets.",
      ],
      tryit: { q: "Look at this pattern of shapes: heart, star, heart, star, heart, star. What small group is repeating?", answer: "heart, star. That little pair keeps coming back in the same order." },
    },
    {
      h: "2. The cycle length: how long one repeat is",
      body: [
        "When we talk about a repeating pattern, we give a special name to the small group that keeps coming back. We call one full repeat a cycle. So a cycle is simply one complete copy of the repeating group before it starts again from the beginning.",
        "The cycle length is the number of items in one cycle. That is all it means: how many things there are in a single repeat.",
        "Let us count one carefully. Take red, blue, green, red, blue, green, red, blue, green. Point at the first red and count along until you reach the next red, which is where the pattern starts over. You pass red (1), blue (2), green (3), and then you are back to red. So one cycle is red, blue, green, and the cycle length is 3.",
        "A good way to find the cycle length is to look for the moment the pattern begins to say the exact same thing again. The number of items you counted up to that point, without counting the repeat itself, is the cycle length.",
        "Here is a physical way to see it. Picture a clock face, but instead of 12 numbers it only has 3 spots on it, one for red, one for blue and one for green. Each new item moves the hand one spot round. After 3 steps the hand is back where it started, ready to go round again. That is why the cycle length is 3.",
      ],
      examples: [
        { q: "Find the cycle length of: cat, cat, dog, cat, cat, dog, cat, cat, dog.", steps: ["Start at the first item and count along until the pattern repeats itself.", "cat (1), cat (2), dog (3), and then the next item is cat again, which is the start of a new repeat.", "So one full cycle is cat, cat, dog."], answer: "The cycle length is 3." },
        { q: "Find the cycle length of: red, blue, blue, green, red, blue, blue, green, red, blue, blue, green.", steps: ["Start at the first item and count until the pattern repeats.", "red (1), blue (2), blue (3), green (4), and then the next item is red again, which is the start of a new repeat.", "So one full cycle is red, blue, blue, green."], answer: "The cycle length is 4." },
        { q: "The pattern 1, 2, 3, 4, 5, 1, 2, 3, 4, 5 repeats forever. Find the cycle length, then work out what the 50th item is.", steps: ["Count until the pattern repeats: 1, 2, 3, 4, 5 then 1 again. Cycle length = 5.", "Divide the position by the cycle length: 50 ÷ 5 = 10 remainder 0.", "A remainder of 0 means the last item of the cycle.", "The last item of 1, 2, 3, 4, 5 is 5."], answer: "Cycle length is 5. The 50th item is 5." },
      ],
    },
    {
      h: "3. Counting your way to a nearby position",
      body: [
        "Before we learn any clever shortcut, let us do it the slow, safe way, because understanding the slow way first makes the shortcut make sense later.",
        "The position of an item just means where it sits in the line. The first item is position 1, the second item is position 2, and so on. Position is always counted from the start.",
        "Take the pattern red, blue, green, repeating. Suppose we want to know what colour sits at position 8. Since the numbers are small we can simply write them out and label each one: position 1 red, position 2 blue, position 3 green, position 4 red, position 5 blue, position 6 green, position 7 red, position 8 blue.",
        "So the 8th item is blue. Writing it out like this is perfectly fine when the position is small. Notice something friendly happening as you go: red always lands on positions 1, 4, 7, blue always lands on 2, 5, 8, and green always lands on 3, 6, 9. Each colour keeps its own set of positions.",
        "That last point is the seed of the shortcut. The colour depends only on where you land inside a single cycle, not on how many whole cycles you have already gone through.",
      ],
      tryit: { q: "Using the pattern red, blue, green (repeating), write out the positions up to 9 and say what sits at position 9.", answer: "Position 9 is green. If you write them out you get red, blue, green, red, blue, green, red, blue, green, and the 9th is the third green." },
    },
    {
      h: "4. The remainder shortcut for big positions",
      body: [
        "Writing out the whole list is fine for position 8, but nobody wants to write out 50 items to find the 50th one. Happily there is a shortcut, and it uses something you may already have met: division with a remainder.",
        "When you share things into equal groups, the remainder is whatever is left over that could not fill another whole group. For example, if you have 7 sweets and put them into bags of 3, you fill 2 full bags and have 1 sweet left over. So 7 divided by 3 is 2 remainder 1.",
        "Here is why that helps us. Each full cycle is like one full bag. If you divide the position number by the cycle length, the whole-number part tells you how many complete cycles you have gone through, and the remainder tells you how many steps you have taken into the cycle you are currently in. That remainder is exactly the spot inside one single cycle where you land.",
        "Let us use it on the pattern red, blue, green, which has cycle length 3, to find position 50. Work out 50 divided by 3. That is 16 remainder 2, because 16 lots of 3 make 48 and there are 2 left over. A remainder of 2 means you land on the 2nd item of the cycle, which is blue. So the 50th item is blue, and we never had to write out all 50.",
        "A picture that helps: imagine walking round that 3-spot clock face again. After 48 steps (16 full loops) you are back at the very start. Then you take 2 more steps, landing on the 2nd spot, which is blue. The remainder is just how far past the last full loop you have walked.",
      ],
      examples: [
        { q: "A pattern repeats every 5 items: A, B, C, D, E. What is the 23rd item?", steps: ["The cycle length is 5, so divide the position by 5.", "23 divided by 5 is 4 remainder 3, because 4 lots of 5 make 20 and there are 3 left over.", "A remainder of 3 means we land on the 3rd item of the cycle.", "Counting into A, B, C, D, E, the 3rd item is C."], answer: "The 23rd item is C." },
        { q: "A pattern repeats every 7 items: red, orange, yellow, green, blue, indigo, violet. What colour is the 30th item?", steps: ["The cycle length is 7, so divide the position by 7.", "30 divided by 7 is 4 remainder 2, because 4 lots of 7 make 28 and there are 2 left over.", "A remainder of 2 means we land on the 2nd item of the cycle.", "The 2nd item is orange."], answer: "The 30th item is orange." },
        { q: "A pattern repeats every 8 items: a, b, c, d, e, f, g, h. What is the 100th item?", steps: ["The cycle length is 8, so divide the position by 8.", "100 divided by 8 is 12 remainder 4, because 12 lots of 8 make 96 and there are 4 left over.", "A remainder of 4 means we land on the 4th item of the cycle.", "The 4th item is d."], answer: "The 100th item is d." },
      ],
    },
    {
      h: "5. The tricky case: no remainder at all",
      body: [
        "Sometimes the position divides exactly into the cycle length and there is nothing left over. The remainder is 0. This one trips people up, so let us go slowly and make it obvious.",
        "A remainder of 0 does not mean 'position zero' and it does not mean 'nothing'. Think back to the bags of sweets. If you have 6 sweets and fill bags of 3, you get exactly 2 full bags and none left over. But those sweets did not vanish. The very last sweet you placed was the third sweet in the second bag, which is the last item of a cycle.",
        "So the rule is simple. Whenever the remainder comes out as 0, treat it as the last item of the cycle.",
        "Let us test it on red, blue, green (cycle length 3) at position 6. Work out 6 divided by 3, which is 2 remainder 0. A remainder of 0 means the last item of the cycle, and the last item is green. You can check by writing it out: red, blue, green, red, blue, green, and yes, the 6th is green. Lovely, it agrees.",
        "Another way to picture it: on the 3-spot clock, taking exactly 3 steps (or 6, or 9) lands you right back on the final spot before the hand ticks over to the start again. Landing on the finish line still counts as landing somewhere.",
      ],
      examples: [
        { q: "A pattern repeats every 4 items: 1, 2, 3, 4. What is the 20th item?", steps: ["The cycle length is 4, so divide the position by 4.", "20 divided by 4 is 5 remainder 0, because 5 lots of 4 make exactly 20 with nothing left over.", "A remainder of 0 means the last item of the cycle.", "The last item of 1, 2, 3, 4 is 4."], answer: "The 20th item is 4." },
        { q: "A pattern repeats every 3 items: X, Y, Z. What is the 30th item?", steps: ["The cycle length is 3, so divide the position by 3.", "30 divided by 3 is 10 remainder 0, because 10 lots of 3 make exactly 30.", "A remainder of 0 means the last item of the cycle.", "The last item of X, Y, Z is Z."], answer: "The 30th item is Z." },
        { q: "A pattern repeats every 9 items: 1, 2, 3, 4, 5, 6, 7, 8, 9. What are the 99th and 100th items?", steps: ["99 divided by 9 is 11 remainder 0. Remainder 0 means the last item, which is 9.", "100 divided by 9 is 11 remainder 1. Remainder 1 means the first item, which is 1."], answer: "The 99th item is 9 and the 100th item is 1." },
      ],
      tryit: { q: "A pattern repeats every 6 items: A, B, C, D, E, F. What is the 12th item?", answer: "F. 12 divided by 6 is 2 remainder 0, and a remainder of 0 means the last item of the cycle, which is F." },
    },
    {
      h: "6. A different kind of sequence: growing numbers",
      body: [
        "Not every sequence repeats. Some sequences are lists of numbers that keep getting bigger by the same jump each time, and these never loop back on themselves. We call each number in the list a term. So the first number is the first term, the second number is the second term, and so on.",
        "Look at 2, 5, 8, 11, 14. Ask yourself: how much do I add to get from one term to the next? From 2 to 5 is add 3. From 5 to 8 is add 3. From 8 to 11 is add 3. The jump is the same every time. We call that steady jump the common difference, because it is the difference between terms and it is common to (shared by) every step.",
        "Here is a real-world way to feel it. Imagine you start with 2 pounds in a money box and every week your grandad pops in another 3 pounds. After the weeks go by you have 2, then 5, then 8, then 11, then 14 pounds. The 3 pounds a week is the common difference.",
        "You can also picture this on a number line, which is just a straight line with the numbers marked evenly along it. Growing by a common difference means hopping the same distance to the right each time, like a kangaroo taking equal-sized jumps. Every hop in the sequence 2, 5, 8, 11, 14 is a jump of 3 to the right.",
        "To find the common difference, take any term and subtract the term just before it. As long as you get the same answer wherever you check, the sequence has a common difference.",
      ],
      tryit: { q: "What is the common difference in the sequence 7, 11, 15, 19?", answer: "4. From 7 to 11 is add 4, from 11 to 15 is add 4, and from 15 to 19 is add 4." },
    },
    {
      h: "7. Jumping straight to any term in a growing sequence",
      body: [
        "Just as with repeating patterns, we do not want to write out a growing sequence forever to reach a faraway term. There is a neat shortcut for this too, and the money box picture makes it easy to see.",
        "Here is the key idea, and it is one people often get slightly wrong, so read it twice. To get from the first term to the 10th term you do not make 10 jumps. You make 9 jumps, because you are already standing on the first term before you jump at all. Getting to the 2nd term is 1 jump, the 3rd term is 2 jumps, the 4th term is 3 jumps, and so the Nth term is always (N minus 1) jumps on from the start.",
        "So the method is: start at the first term, then add the common difference (N minus 1) times. In short, the Nth term equals the first term plus (N minus 1) lots of the common difference.",
        "Let us try the sequence 4, 9, 14, 19, which starts at 4 and has a common difference of 5. Suppose we want the 10th term. It is 9 jumps on from the start, so we add 5 nine times, which is 9 times 5 equals 45. Then 4 plus 45 gives 49. So the 10th term is 49.",
        "You can sanity-check the idea on a term you can see. The 3rd term should be 2 jumps on: 4 plus 2 times 5 is 4 plus 10, which is 14, and sure enough the 3rd term written above is 14. Because the small case works, we can trust the same method for the big case.",
      ],
      examples: [
        { q: "A sequence starts 6, 10, 14, 18 and increases by 4 each time. What is the 20th term?", steps: ["The first term is 6 and the common difference is 4.", "The 20th term is (20 minus 1) jumps on from the start, which is 19 jumps.", "19 jumps of 4 is 19 times 4, which is 76.", "Add that to the first term: 6 plus 76."], answer: "The 20th term is 82." },
        { q: "A sequence starts 3, 7, 11, 15 and increases by 4 each time. What is the 15th term?", steps: ["The first term is 3 and the common difference is 4.", "The 15th term is (15 - 1) = 14 jumps on from the start.", "14 jumps of 4 is 14 x 4 = 56.", "Add to the first term: 3 + 56 = 59."], answer: "The 15th term is 59." },
        { q: "A sequence starts 2, 9, 16, 23 and increases by 7 each time. Which term number is equal to 100?", steps: ["The first term is 2 and the common difference is 7.", "The nth term = 2 + (n - 1) x 7. Set this equal to 100.", "(n - 1) x 7 = 98, so n - 1 = 98 ÷ 7 = 14, giving n = 15.", "Check: 2 + 14 x 7 = 2 + 98 = 100."], answer: "100 is the 15th term." },
      ],
      tryit: { q: "A sequence starts at 3 and goes up by 2 each time (3, 5, 7, 9...). What is the 8th term?", answer: "17. The 8th term is 7 jumps on from the start, so 3 plus 7 times 2 is 3 plus 14, which is 17." },
    },
    {
      h: "8. Putting it all together",
      body: [
        "Let us gather up everything so it sits neatly in your mind.",
        "First, decide which kind of sequence you have. If a small group of items keeps coming back, it is a repeating pattern. If the numbers keep growing by the same jump, it is a growing sequence.",
        "For a repeating pattern, count the cycle length (how many items are in one repeat). Then to find any position, divide the position by the cycle length and look at the remainder, because the remainder tells you where you land inside a single cycle. If the remainder is 0, remember it means the last item of the cycle, not nothing.",
        "For a growing sequence, find the common difference (the steady jump between terms). Then to find the Nth term, start at the first term and add the common difference (N minus 1) times, because you are already standing on the first term before you begin jumping.",
        "The big prize in both cases is the same. You never have to write out a giant list by hand. A little bit of thinking lets you leap straight to any position you like, and that is a proper mathematician's trick.",
      ],
      tryit: { q: "A pattern goes sun, moon, star, sun, moon, star (repeating). What is the 15th item, and how did you decide?", answer: "star. The cycle length is 3, and 15 divided by 3 is 5 remainder 0, so it is the last item of the cycle, which is star." },
    },
  ],
};

PRIMARY_LESSONS.fractionEquivalence = {
  title: "Equivalent Fractions: the same amount, dressed differently",
  minutes: 18,
  intro: "Two fractions can look completely different on paper and still mean exactly the same amount. Once you see why, a whole box of skills opens up: simplifying fractions, comparing them and adding them together later on. We will build the idea slowly, starting from what a fraction even is.",
  sections: [
    {
      h: "1. First, what a fraction really means",
      body: [
        "Before we talk about equivalent fractions, let us make sure we agree on what a fraction is. A fraction is just a way of writing part of a whole thing. Imagine one whole chocolate bar. If you snap it into equal pieces and take some of them, a fraction tells you how much you took.",
        "Every fraction is made of two numbers with a line between them. The bottom number is called the denominator. The denominator tells you how many equal pieces the whole thing was cut into. The top number is called the numerator. The numerator tells you how many of those pieces you are actually talking about.",
        "So in the fraction 3/4, the denominator 4 says the whole was cut into 4 equal pieces, and the numerator 3 says we are talking about 3 of them. Out loud you would read it as three quarters.",
        "Here is a picture to hold in your head. Draw a chocolate bar as a long rectangle. Make three cuts across it so there are 4 equal chunks. Colour in 3 of the chunks. The coloured part is 3/4 of the bar. The word denominator and the word divide both start the same way, which is a handy reminder that the denominator is the number of pieces you divided into.",
      ],
      tryit: { q: "In the fraction 2/5, which number is the denominator, and what does it tell you?", answer: "The denominator is 5. It tells you the whole was split into 5 equal pieces. The numerator 2 tells you we are talking about 2 of those pieces." },
    },
    {
      h: "2. The surprising idea: same amount, different name",
      body: [
        "Now for the part that surprises almost everyone. Two fractions that look completely different can be exactly the same amount. When that happens we call them equivalent fractions. Equivalent is just a long word for equal in value, or worth the same.",
        "Picture one pizza. Cut it straight down the middle and you get 2 equal pieces. One of them is one half, written 1/2. Now imagine cutting the same pizza into 4 equal pieces instead. This time you need 2 pieces to make the same amount of pizza, and that is 2 quarters, written 2/4.",
        "You did not eat any more or any less pizza. Half the pizza and 2 quarters of the pizza are the very same mouthful. So 1/2 and 2/4 are equivalent fractions, and we write 1/2 = 2/4.",
        "Money is another way to see it. Fifty pence is one half of a pound. Two twenty-p coins and one ten-p coin also make fifty pence, and so do five ten-p coins. Different coins, same amount of money. Fractions behave the same way: different numbers on the page, same amount of stuff.",
        "One more picture, this time a number line. Think of a ruler marked from 0 to 1. The mark exactly halfway along can be labelled 1/2. But if you split the same line into 4 equal steps, that very same halfway mark is now the 2nd step, so it can also be labelled 2/4. It is one single point on the line wearing two different labels.",
      ],
      tryit: { q: "A cake is cut into 8 equal slices and you take 4 of them. Have you taken more than half, less than half, or exactly half?", answer: "Exactly half. 4 out of 8 slices is 4/8, which is the same amount as 1/2." },
    },
    {
      h: "3. Making equivalent fractions with multiplying",
      body: [
        "It would be very slow to draw a pizza every time we wanted an equivalent fraction. Happily there is a quick rule. To make an equivalent fraction, multiply the numerator (top) and the denominator (bottom) by the same number.",
        "Watch it work on 1/2. Multiply top and bottom by 2. The top 1 becomes 1 x 2 = 2, and the bottom 2 becomes 2 x 2 = 4. So 1/2 = 2/4, which is exactly what the pizza told us earlier.",
        "Do it again, this time times 3, starting from 1/2. Top: 1 x 3 = 3. Bottom: 2 x 3 = 6. So 1/2 = 3/6. And once more times 5: top 1 x 5 = 5, bottom 2 x 5 = 10, so 1/2 = 5/10. You can make as many equivalent fractions from one fraction as you like.",
        "Here is the golden rule to never forget. Whatever you do to the top, you must do the very same thing to the bottom. Both numbers get multiplied by the same amount, every single time.",
      ],
      examples: [
        { q: "Write a fraction equal to 2/3 that has a denominator of 12.", steps: ["Look at the denominators. We want the bottom to go from 3 up to 12.", "Ask yourself what times 3 makes 12. The answer is 4, because 3 x 4 = 12.", "So we multiply top and bottom by 4.", "Top: 2 x 4 = 8. Bottom: 3 x 4 = 12."], answer: "2/3 = 8/12" },
        { q: "Write a fraction equal to 5/8 that has a denominator of 40.", steps: ["We need the bottom to go from 8 up to 40.", "8 x 5 = 40, so multiply top and bottom by 5.", "Top: 5 x 5 = 25. Bottom: 8 x 5 = 40."], answer: "5/8 = 25/40" },
        { q: "Write a fraction equal to 7/12 that has a numerator of 35.", steps: ["We need the top to go from 7 up to 35.", "7 x 5 = 35, so multiply top and bottom by 5.", "Top: 7 x 5 = 35. Bottom: 12 x 5 = 60."], answer: "7/12 = 35/60" },
      ],
      tryit: { q: "Find a fraction equal to 3/5 with a denominator of 20.", answer: "12/20. The bottom went from 5 to 20, which is times 4, so the top does the same: 3 x 4 = 12." },
    },
    {
      h: "4. Why the multiplying trick is allowed",
      body: [
        "You might be wondering why multiplying the top and bottom by the same number is allowed. Here is the secret, and it is a lovely one.",
        "Any number divided by itself equals 1. Two out of two pieces is a whole thing, so 2/2 = 1. In the same way 3/3 = 1, 4/4 = 1 and even 100/100 = 1. These are all just dressed-up ways of writing the plain old number 1.",
        "When you multiply the top and bottom of 1/2 by 2, you are really multiplying 1/2 by 2/2. And 2/2 is secretly just 1. Multiplying anything by 1 leaves it completely unchanged, the same way 7 x 1 is still 7. So the amount cannot move, even though the numbers on the page look different.",
        "That is the whole trick. An equivalent fraction is the same amount wearing a disguise, and the disguise is always a hidden 1.",
      ],
      tryit: { q: "Why does doubling only the top of a fraction (and not the bottom) change its value?", answer: "Because then you are not multiplying by a hidden 1. Doubling only the top of 1/2 turns it into 2/2, which is a whole, so you really did change the amount. Both numbers must change together to keep the disguise a 1." },
    },
    {
      h: "5. Simplifying: the same idea running backwards",
      body: [
        "If multiplying top and bottom by the same number keeps the value the same, then dividing top and bottom by the same number must keep it the same too. Going in this shrinking direction has a special name: simplifying. You might also hear it called cancelling down or reducing.",
        "Simplifying means writing a fraction with the smallest numbers possible while keeping exactly the same value. It is a bit like tidying up your room. 6/8 and 3/4 are the same amount, but 3/4 is neater and much easier to picture in your head.",
        "To simplify, find a number that divides exactly into both the top and the bottom, then divide them both by it. Dividing exactly means it goes in with nothing left over, no remainder.",
        "A fraction is fully simplified when the only number that divides into both the top and the bottom is 1. At that point it will not shrink any further and you are finished.",
        "A very common slip is stopping too early. If you simplify 8/12 by dividing by 2 you get 4/6, but 4 and 6 can both still be divided by 2, which gives 2/3. Always check whether your answer can shrink again before you call it done.",
      ],
      examples: [
        { q: "Simplify 12/18 as far as it will go.", steps: ["Find a number that divides exactly into both 12 and 18. Both can be divided by 6.", "Top: 12 divided by 6 = 2. Bottom: 18 divided by 6 = 3.", "Now check 2/3. The only number that divides into both 2 and 3 is 1, so it cannot shrink any further."], answer: "12/18 = 2/3" },
        { q: "Simplify 18/24 as far as it will go.", steps: ["Find a number that divides exactly into both 18 and 24. Both can be divided by 6.", "Top: 18 ÷ 6 = 3. Bottom: 24 ÷ 6 = 4.", "Check 3/4: the only number that divides into both 3 and 4 is 1, so it cannot shrink further."], answer: "18/24 = 3/4" },
        { q: "Simplify 60/84 as far as it will go.", steps: ["Find a number that divides into both 60 and 84. Both can be divided by 4: 15/21.", "15 and 21 can both be divided by 3: 5/7.", "5 and 7 share no common factor other than 1, so 5/7 cannot shrink further."], answer: "60/84 = 5/7" },
      ],
      tryit: { q: "Simplify 10/15 as far as it will go.", answer: "2/3. Both 10 and 15 divide by 5: 10 divided by 5 = 2 and 15 divided by 5 = 3. Nothing but 1 divides into both 2 and 3, so you are done." },
    },
    {
      h: "6. Comparing fractions by giving them matching pieces",
      body: [
        "Equivalent fractions have a brilliant use: comparing. Suppose someone asks which is bigger, 2/3 or 3/5. It is tricky, because thirds and fifths are different sized pieces, so you cannot just glance and know.",
        "Think of it like comparing a bag of large marbles with a bag of small marbles. Counting the marbles alone is not a fair contest until the marbles are the same size. We need the pieces to match before we can judge.",
        "The fix is to rewrite both fractions so they share the same denominator. A shared denominator is a number that both of the bottom numbers divide into. For 3 and 5 an easy one is 15, because 3 x 5 = 15.",
        "Change 2/3 into fifteenths by multiplying top and bottom by 5: that gives 2 x 5 = 10 over 3 x 5 = 15, so 2/3 = 10/15. Change 3/5 into fifteenths by multiplying top and bottom by 3: that gives 3 x 3 = 9 over 5 x 3 = 15, so 3/5 = 9/15.",
        "Now the pieces are the same size, so we simply compare the top numbers. 10 is more than 9, so 10/15 beats 9/15, which means 2/3 is bigger than 3/5.",
      ],
      examples: [
        { q: "Which is bigger, 3/4 or 5/8?", steps: ["Pick a denominator that both 4 and 8 divide into. 8 works nicely, because 4 x 2 = 8.", "Change 3/4 into eighths by multiplying top and bottom by 2: 3 x 2 = 6 over 4 x 2 = 8, so 3/4 = 6/8.", "5/8 already has 8 on the bottom, so leave it alone.", "Compare the tops: 6 against 5."], answer: "3/4 is bigger, because 6/8 beats 5/8." },
        { q: "Which is bigger, 2/3 or 3/5?", steps: ["Find a common denominator: 3 x 5 = 15 works.", "Change 2/3: multiply top and bottom by 5, giving 10/15.", "Change 3/5: multiply top and bottom by 3, giving 9/15.", "Compare the tops: 10 against 9."], answer: "2/3 is bigger, because 10/15 beats 9/15." },
        { q: "Which is the largest of 5/6, 7/9 and 3/4?", steps: ["Find a common denominator for 6, 9 and 4. The LCM of 6 and 9 is 18. The LCM of 18 and 4 is 36.", "5/6 = 30/36 (multiply by 6). 7/9 = 28/36 (multiply by 4). 3/4 = 27/36 (multiply by 9).", "Compare the tops: 30, 28 and 27."], answer: "5/6 is the largest (30/36 beats 28/36 and 27/36)." },
      ],
      tryit: { q: "Which is bigger, 1/2 or 3/5? Turn both into tenths to compare.", answer: "3/5. As tenths, 1/2 = 5/10 and 3/5 = 6/10. Since 6 beats 5, 3/5 is the bigger fraction." },
    },
    {
      h: "7. Two quick shortcuts, and the traps to dodge",
      body: [
        "When the fractions are set up nicely, two shortcuts can save you all the rewriting.",
        "Shortcut one: if two fractions already have the same denominator, you do not need to change a thing. Just compare the top numbers. With 3/7 and 5/7 the pieces are already the same size, so 5/7 is bigger simply because 5 is more than 3.",
        "Shortcut two: if two fractions have the same numerator (the same top number), the one with the smaller denominator is the bigger fraction. This feels back to front at first, so here is why. Sharing one chocolate bar between 3 people gives each person a bigger piece than sharing it between 10 people. Fewer pieces means each piece is larger.",
        "Picture 3/7 and 3/10. Both take 3 pieces, but sevenths are chunkier than tenths, so 3 chunky pieces beat 3 thin ones. That makes 3/7 the bigger fraction.",
        "Finally, three traps to dodge. Do not change only the top or only the bottom of a fraction, because that changes the amount. Do not stop simplifying while the numbers can still shrink. And do not compare fractions with different denominators head on, always give them matching pieces first.",
      ],
      examples: [
        { q: "Which is bigger, 3/7 or 3/10?", steps: ["Notice both fractions have the same top number, 3.", "When the numerators match, the smaller denominator wins because its pieces are bigger.", "7 is smaller than 10, so sevenths are the bigger pieces."], answer: "3/7 is bigger." },
        { q: "Which is bigger, 5/9 or 5/12?", steps: ["Both fractions have the same numerator, 5.", "When numerators match, the smaller denominator means bigger pieces.", "9 is smaller than 12, so ninths are bigger pieces."], answer: "5/9 is bigger." },
        { q: "In Class A, 7 out of 11 students chose pizza. In Class B, 7 out of 13 students chose pizza. In which class is the fraction choosing pizza larger? Explain without finding common denominators.", steps: ["Both fractions have numerator 7, so the same count of pieces.", "1/11 is a bigger piece than 1/13, because 11 < 13 (fewer equal parts means each part is larger).", "Seven larger pieces (7/11) must be more than seven smaller pieces (7/13)."], answer: "Class A. 7/11 is larger than 7/13 because the denominator 11 is smaller, making each share larger." },
      ],
      tryit: { q: "Without doing any multiplying, which is bigger, 4/9 or 4/5?", answer: "4/5. The numerators match at 4, and 5 is smaller than 9, so fifths are bigger pieces than ninths, which makes 4/5 the larger fraction." },
    },
  ],
};

PRIMARY_LESSONS.fractionArithmetic = {
  title: "Adding & Subtracting Fractions: making the pieces match",
  minutes: 20,
  intro: "A fraction is just a way of talking about part of something, like one slice of a pizza or half a chocolate bar. In this lesson we will learn how to add fractions together and take them away from each other. There is one big secret that makes it all work: the pieces have to be the same size first. We will build that idea up slowly, with pizzas, chocolate, a ruler and pictures, so by the end it feels easy.",
  sections: [
    {
      h: "1. What a fraction actually is",
      body: [
        "Imagine you cut a pizza into equal slices and you take some of them. A fraction is how we write down how much you took.",
        "A fraction has two numbers, one on top and one on the bottom, with a line between them. The bottom number tells you how many equal pieces the whole thing was cut into. The top number tells you how many of those pieces you have.",
        "The bottom number has a proper name: it is called the denominator. An easy way to remember it is that 'denominator' and 'down' both start with a d, and it lives down at the bottom. So in 3/4 the denominator is 4, which means the pizza was cut into 4 equal slices.",
        "The top number is called the numerator. It tells you the number you have, and 'numerator' even starts like the word 'number'. So in 3/4 the numerator is 3, which means you have 3 of those slices.",
        "So 3/4 means: cut something into 4 equal pieces, and take 3 of them. You can picture a chocolate bar snapped into 4 equal chunks with 3 of the chunks sitting on your plate.",
      ],
      tryit: { q: "In the fraction 2/5, which number is the denominator, and what does it tell you?", answer: "The denominator is 5. It tells you the whole thing was cut into 5 equal pieces. The 2 on top (the numerator) tells you that you have 2 of them." },
    },
    {
      h: "2. Adding when the pieces are already the same size",
      body: [
        "Let us start with the easy kind, where both fractions have the same denominator, which means both were cut into the same number of pieces.",
        "Picture a pizza cut into 5 equal slices. Each slice is one fifth, written 1/5. Your friend gives you 1 slice, so you have 1/5. Then they give you 2 more slices, which is 2/5. How many slices do you have now? You just count them: 1 slice and 2 more slices makes 3 slices, so you have 3/5.",
        "Notice something important. The slices were all fifths before, and they are still fifths after. The size of each piece never changed. Only the number of pieces you are holding went up. So the denominator (the 5) stays exactly the same, and you only add the top numbers.",
        "Here is the rule in words. When the denominators are the same, add the numerators (the top numbers) and keep the denominator (the bottom number) just as it is. So 1/5 + 2/5 = 3/5.",
        "Another way to see it: think of money. A fifth is like a coin worth a certain amount. One coin plus two coins of the same kind gives three coins of that kind. You would never change what the coin is worth just because you now have more of them.",
      ],
      examples: [
        { q: "Work out 3/8 + 4/8.", steps: ["Both fractions are eighths, so the pieces are already the same size. That means we are allowed to just add the tops.", "Add the numerators: 3 + 4 = 7.", "Keep the denominator the same: it stays as 8.", "So the answer is 7/8."], answer: "7/8" },
        { q: "Work out 5/9 + 2/9.", steps: ["Both fractions are ninths, so the pieces are the same size.", "Add the numerators: 5 + 2 = 7.", "Keep the denominator: stays as 9."], answer: "7/9" },
        { q: "Work out 5/9 + 7/9. Simplify your answer if possible.", steps: ["Both are ninths, so add the tops: 5 + 7 = 12. Keep the bottom: 12/9.", "12/9 is an improper fraction. Divide: 12 ÷ 9 = 1 remainder 3, so it is 1 and 3/9.", "Simplify 3/9: both divide by 3, giving 1/3.", "So 12/9 = 1 and 1/3."], answer: "1 and 1/3" },
      ],
      tryit: { q: "Work out 4/9 + 3/9.", answer: "7/9. The pieces are both ninths, so add the tops (4 + 3 = 7) and keep the bottom as 9." },
    },
    {
      h: "3. Taking away when the pieces are the same size",
      body: [
        "Subtracting works the very same way when the denominators match. Subtracting just means taking some away.",
        "Picture a chocolate bar snapped into 8 equal chunks, so each chunk is one eighth, written 1/8. You have 5 chunks, which is 5/8. You eat 2 of them, which is 2/8. How many are left? Count what remains: 5 chunks take away 2 chunks leaves 3 chunks, so 3/8 is left.",
        "Again the chunks are still eighths the whole time. The size of the piece never changes. So the rule is: when the denominators are the same, subtract the numerators and keep the denominator the same. So 5/8 - 2/8 = 3/8.",
        "You can also picture this on a number line, which is just a straight line like a ruler with numbers marked on it. Mark 0 at the start and 1 at the end, then split the gap into 8 equal steps. Start at the 5th step (5/8) and hop back 2 steps. You land on the 3rd step, which is 3/8.",
      ],
      tryit: { q: "Work out 6/7 - 2/7.", answer: "4/7. Both are sevenths, so take the tops away (6 - 2 = 4) and keep the bottom as 7." },
    },
    {
      h: "4. Why you cannot add when the pieces are different sizes",
      body: [
        "Now for the tricky part. What if the pieces are not the same size? Look at 1/2 + 1/3. A half and a third are different sizes, because cutting something into 2 pieces gives bigger pieces than cutting it into 3 pieces.",
        "Think about it with pizza. A half is one slice from a pizza cut into 2. A third is one slice from a pizza cut into 3. A slice cut into 2 is fatter than a slice cut into 3. If someone asked you 'how much is one fat slice plus one thin slice?' you could not answer with a tidy number until you sorted the slices into the same size.",
        "Here is a way to feel why. Imagine adding half a glass of juice to a third of a glass. You know the answer should be a bit more than half a glass. If you got confused and just added the numbers on top and bottom, you might write 2/5, but 2/5 is actually less than a half. That cannot be right, because pouring more juice in should give you more, not less.",
        "So the big secret of this whole lesson is this: you can only add or subtract fractions once the pieces are the same size. That means getting the two denominators to be the same number before you do anything else.",
      ],
      tryit: { q: "True or false: to add 1/2 + 1/4 you can just add across to get 2/6.", answer: "False. Halves and quarters are different-sized pieces, so you must make them the same size first. Adding straight across gives the wrong answer." },
    },
    {
      h: "5. Making the pieces match: a common denominator",
      body: [
        "To make the pieces the same size, we rewrite each fraction so they share the same bottom number. A bottom number that both fractions can use is called a common denominator. 'Common' here just means shared, the same for both.",
        "The trick is that you can cut each piece into more, smaller pieces without changing how much you actually have. Cut a half pizza into 3 smaller slices and you still have the same amount of pizza, you have just chopped it up more. So 1/2 is exactly the same amount as 3/6.",
        "The rule for rewriting a fraction: whatever you multiply the bottom by, you must multiply the top by the same number. This keeps the value the same. For 1/2, if we multiply the bottom 2 by 3 to get 6, we must also multiply the top 1 by 3 to get 3, giving 3/6.",
        "Let us make 1/2 and 1/3 match. A number that both 2 and 3 divide into nicely is 6. So we rewrite both as sixths. For 1/2 we multiply top and bottom by 3 to get 3/6. For 1/3 we multiply top and bottom by 2 to get 2/6. Now both are sixths, the same-sized pieces, and we are ready to add.",
        "A quick tip for finding a common denominator: multiplying the two bottom numbers together always gives one that works. For 2 and 3, that is 2 times 3, which is 6. It is not always the smallest one you could use, but it always works, which is a nice safe method when you are starting out.",
      ],
      examples: [
        { q: "Rewrite 1/3 and 1/4 so they have the same denominator.", steps: ["Multiply the two bottoms together to find a common denominator: 3 times 4 is 12.", "Rewrite 1/3 as twelfths: multiply top and bottom by 4, giving 4/12.", "Rewrite 1/4 as twelfths: multiply top and bottom by 3, giving 3/12.", "Now both are twelfths: 1/3 = 4/12 and 1/4 = 3/12."], answer: "1/3 = 4/12 and 1/4 = 3/12" },
        { q: "Rewrite 3/5 and 1/4 so they have the same denominator, then add them.", steps: ["Multiply the bottoms: 5 x 4 = 20. Use 20 as the common denominator.", "Rewrite 3/5: multiply top and bottom by 4, giving 12/20.", "Rewrite 1/4: multiply top and bottom by 5, giving 5/20.", "Add the tops: 12 + 5 = 17, keep the bottom as 20."], answer: "17/20" },
        { q: "Work out 5/6 + 3/8. Give your answer in its simplest form.", steps: ["Find a common denominator for 6 and 8. The smallest number both divide into is 24.", "Rewrite 5/6: multiply top and bottom by 4, giving 20/24.", "Rewrite 3/8: multiply top and bottom by 3, giving 9/24.", "Add: 20 + 9 = 29, giving 29/24 = 1 and 5/24. (29 and 24 share no common factor, so it is already simplified.)"], answer: "1 and 5/24" },
      ],
      tryit: { q: "Rewrite 1/2 as sixths (that is, with a denominator of 6).", answer: "3/6. Multiply the bottom 2 by 3 to get 6, so multiply the top 1 by 3 as well to get 3." },
    },
    {
      h: "6. Adding and subtracting fractions with different denominators",
      body: [
        "Now we can put it all together. The plan has three steps. First, make the denominators the same. Second, add or subtract the top numbers only. Third, keep that shared denominator.",
        "Let us finish 1/2 + 1/3 from before. We already turned them into 3/6 and 2/6. Now they are both sixths, so add the tops: 3 + 2 = 5, and keep the bottom as 6. The answer is 5/6.",
        "Does that feel right? A half plus a bit more should be close to a whole, and 5/6 is almost a whole (a whole would be 6/6). So the answer passes the sniff test.",
        "Subtracting is the same plan. To do 2/3 - 1/4, first make the pieces match. 3 times 4 is 12, so use twelfths. 2/3 becomes 8/12 (times top and bottom by 4) and 1/4 becomes 3/12 (times top and bottom by 3). Now take the tops away: 8 - 3 = 5, keep the bottom, giving 5/12.",
      ],
      examples: [
        { q: "Work out 3/4 + 1/6.", steps: ["Make the denominators match. A number that both 4 and 6 go into is 12.", "Rewrite 3/4 as twelfths: multiply top and bottom by 3, giving 9/12.", "Rewrite 1/6 as twelfths: multiply top and bottom by 2, giving 2/12.", "Now both are twelfths, so add the tops: 9 + 2 = 11, and keep the bottom as 12.", "The answer is 11/12."], answer: "11/12" },
        { q: "Work out 2/5 - 1/3.", steps: ["Find a common denominator: 5 x 3 = 15.", "Rewrite 2/5: multiply top and bottom by 3, giving 6/15.", "Rewrite 1/3: multiply top and bottom by 5, giving 5/15.", "Subtract the tops: 6 - 5 = 1. Keep the bottom as 15."], answer: "1/15" },
        { q: "Work out 7/8 - 3/5. Give your answer in its simplest form.", steps: ["Find a common denominator: 8 x 5 = 40.", "Rewrite 7/8: multiply top and bottom by 5, giving 35/40.", "Rewrite 3/5: multiply top and bottom by 8, giving 24/40.", "Subtract: 35 - 24 = 11. Answer is 11/40. (11 is prime and does not divide 40, so it is already simplified.)"], answer: "11/40" },
      ],
      tryit: { q: "Work out 1/3 + 1/6.", answer: "1/2. Use sixths: 1/3 = 2/6 and 1/6 stays as 1/6. Add the tops: 2 + 1 = 3, giving 3/6. Since 3/6 is 3 out of 6, that is exactly half, so 1/2 is a tidy way to write it." },
    },
    {
      h: "7. The classic mistake to avoid",
      body: [
        "Here is the mistake almost everyone makes at first, so watch out for it. Never add the two bottom numbers together. 1/2 + 1/3 is NOT 2/5.",
        "Why not? Because the bottom number tells you the size of the pieces, not how many you have. Adding the bottoms would be like saying 'I have one fat slice and one thin slice, so now my slices are a brand new size'. That makes no sense. The sizes do not add up, only the counts do, and only once the sizes already match.",
        "Here is a handy check. When you add two fractions, the answer should be bigger than either fraction you started with, because you are putting more together. 1/2 is already bigger than 2/5, so 2/5 could never be the right answer for 1/2 plus anything. That alone tells you 2/5 is wrong.",
        "For taking away, the answer should be smaller than the fraction you started with, because you are removing some. If your subtraction answer comes out bigger, you know something has gone wrong.",
        "So the golden rule is simple. Match the denominators first, then only ever add or subtract the numerators. The denominator comes along for the ride and does not change.",
      ],
      tryit: { q: "A friend says 1/4 + 1/2 = 2/6. Without doing the full sum, how can you tell they are wrong?", answer: "2/6 is the same as 1/3, which is smaller than 1/2. But adding something to 1/2 must give an answer bigger than 1/2, so 2/6 cannot be right. (The real answer is 3/4.)" },
    },
    {
      h: "8. Mixed numbers and improper fractions",
      body: [
        "Sometimes a fraction has a top number bigger than its bottom number, like 7/4. This is called an improper fraction. 'Improper' just means the top is bigger than the bottom, which is allowed and perfectly fine. It simply means you have more than one whole thing. 7/4 means 7 quarter-slices, and since 4 quarters make a whole, 7 quarters is one whole with 3 quarters left over.",
        "We can write that same amount as a whole number next to a fraction, like 1 and 3/4. That is called a mixed number, because it mixes a whole number with a fraction. So 7/4 and 1 and 3/4 are two ways of writing the exact same amount, just like a fat coin and its change.",
        "To turn an improper fraction into a mixed number, divide the top by the bottom. The whole-number answer is your whole number, and the remainder (the bit left over) becomes the new top. For 7/4: 7 divided by 4 is 1 with 3 left over, so 7/4 = 1 and 3/4.",
        "To go the other way, from a mixed number to an improper fraction, multiply the whole number by the denominator and then add the numerator. For 2 and 1/3: multiply 2 by 3 to get 6, then add the 1 to get 7. Put that over the same bottom number, giving 7/3.",
        "When you need to add or subtract mixed numbers, the easiest safe path is to turn them into improper fractions first, then follow the same steps as before (match the denominators, add or subtract the tops), and turn the answer back into a mixed number at the end.",
      ],
      examples: [
        { q: "Work out 1 and 1/2 + 2 and 1/4.", steps: ["Turn each mixed number into an improper fraction. For 1 and 1/2: multiply 1 by 2 and add 1, giving 3, so it is 3/2. For 2 and 1/4: multiply 2 by 4 and add 1, giving 9, so it is 9/4.", "Make the denominators match. Use quarters: 3/2 becomes 6/4 (multiply top and bottom by 2), and 9/4 stays as 9/4.", "Add the tops: 6 + 9 = 15, keep the bottom, giving 15/4.", "Turn it back into a mixed number: 15 divided by 4 is 3 with 3 left over, so 15/4 = 3 and 3/4."], answer: "3 and 3/4" },
        { q: "Work out 1 and 3/4 - 1/2. Give your answer as a mixed number if appropriate.", steps: ["Convert 1 and 3/4 to an improper fraction: 1 x 4 + 3 = 7, so it is 7/4.", "Make denominators match. Use quarters: 1/2 = 2/4.", "Subtract: 7/4 - 2/4 = 5/4.", "Convert back: 5 ÷ 4 = 1 remainder 1, so 5/4 = 1 and 1/4."], answer: "1 and 1/4" },
        { q: "Work out 3 and 1/3 + 1 and 5/6. Give your answer as a mixed number.", steps: ["Convert: 3 and 1/3 = 10/3 (3 x 3 + 1 = 10). 1 and 5/6 = 11/6 (1 x 6 + 5 = 11).", "Common denominator for 3 and 6 is 6. Rewrite 10/3 as 20/6.", "Add: 20/6 + 11/6 = 31/6.", "Convert: 31 ÷ 6 = 5 remainder 1, so 31/6 = 5 and 1/6."], answer: "5 and 1/6" },
      ],
      tryit: { q: "Turn the improper fraction 9/4 into a mixed number.", answer: "2 and 1/4. Divide 9 by 4 to get 2 with 1 left over, so it is 2 wholes and 1/4." },
    },
  ],
};

PRIMARY_LESSONS.fractionOfQuantity = {
  title: "Finding a Fraction of an Amount",
  minutes: 18,
  intro: "Imagine you have a big pile of sweets and a friend says 'you can have half'. How do you work out how many that is? That is what this lesson is all about: taking part of an amount rather than the whole thing. We will start right at the beginning and build it up slowly, so even if you have never done this before, by the end you will be able to work out things like three quarters of a class or two thirds of an hour without any worry.",
  sections: [
    {
      h: "1. What does 'a fraction of' actually mean?",
      body: [
        "First, let us be sure what a fraction is. A fraction is a way of talking about PART of something instead of all of it. When you eat half a biscuit, 'half' is a fraction. When you get a quarter of a chocolate bar, 'a quarter' is a fraction too.",
        "So when someone says 'find a fraction of an amount', they just mean: start with a whole amount of something, and then work out how much a certain part of it is.",
        "Here is the friendliest example. You have 8 sweets and you want HALF of them. You share them into two equal piles, and each pile has 4 sweets. So half of 8 is 4. That is it. You have just found a fraction of an amount.",
        "The most important word to notice is 'equal'. When we take a fraction, every part has to be the same size. If one pile had 5 sweets and the other had 3, that would not be fair and it would not be half. Half means two piles that match exactly.",
      ],
      tryit: { q: "You have 10 stickers and you want half of them. How many is that?", answer: "5 stickers. You share them into two equal piles, and each pile has 5." },
    },
    {
      h: "2. The bottom number tells you how many equal parts",
      body: [
        "Every fraction is written with two numbers, one on top of the other, like 1/4. Let us look at the BOTTOM number first, because that is the one that gets us started.",
        "The bottom number of a fraction has a special name: the denominator. That is a long word, but it just means 'how many equal parts we are splitting the amount into'. In 1/4 the denominator is 4, so we split into 4 equal parts. In 1/3 the denominator is 3, so we split into 3 equal parts.",
        "Picture a pizza. If you cut it into 4 equal slices, each slice is one quarter of the pizza, and we write that as 1/4. The 4 on the bottom is telling you the pizza was cut into 4 fair slices.",
        "Here is another way to see it, using a number line. Draw a line from 0 to 12 and split it into 3 equal jumps. Each jump lands on 4, then 8, then 12. So each jump is worth 4, and that first jump (from 0 to 4) is one third of 12.",
        "Notice what both pictures have in common: to find one equal part, you DIVIDE. Splitting 12 into 3 equal parts is the same as 12 divided by 3, which is 4. The denominator is simply the number you divide by.",
      ],
      examples: [
        { q: "What is 1/4 of 12?", steps: ["The bottom number (denominator) is 4, so we split 12 into 4 equal parts.", "Splitting into 4 equal parts means dividing: 12 divided by 4 = 3.", "So one of those parts is 3."], answer: "3" },
        { q: "What is 1/6 of 48?", steps: ["The denominator is 6, so split 48 into 6 equal parts.", "48 divided by 6 = 8."], answer: "8" },
        { q: "What is 1/9 of 360?", steps: ["The denominator is 9, so split 360 into 9 equal parts.", "360 divided by 9 = 40."], answer: "40" },
      ],
      tryit: { q: "What is 1/3 of 12? (Split 12 into 3 equal parts.)", answer: "4. Because 12 divided by 3 = 4." },
    },
    {
      h: "3. The top number tells you how many parts to take",
      body: [
        "Now for the TOP number of a fraction. It also has a special name: the numerator. It just means 'how many of the equal parts we actually want to take'.",
        "Think back to the pizza cut into 4 equal slices. If you take just 1 slice, you have 1/4 (the numerator is 1). If you grab 3 slices, you have 3/4 (the numerator is 3). Same pizza, same size slices, but you are choosing to take more of them.",
        "When the top number is 1, like in 1/4 or 1/5, we call it a unit fraction. 'Unit' is a fancy word for 'one', so a unit fraction is just ONE single equal part. It is the easiest kind to find, because you only have to divide and then stop.",
        "For example, 1/5 of 20 means split 20 into 5 equal parts. That is 20 divided by 5 = 4. So one part is 4, which means 1/5 of 20 is 4.",
        "Finding one part first is a brilliant habit, because once you know what one part is worth, taking more parts is easy. We will see exactly how in the next section.",
      ],
      tryit: { q: "What is 1/6 of 18? (Split 18 into 6 equal parts and take one.)", answer: "3. Because 18 divided by 6 = 3." },
    },
    {
      h: "4. The two-step recipe: divide, then multiply",
      body: [
        "Now we can put the top and bottom numbers together. Finding a fraction of an amount is always the same two steps, like following a recipe.",
        "Step one: DIVIDE by the bottom number (the denominator) to find what ONE part is worth. Step two: MULTIPLY by the top number (the numerator) to find how much that many parts come to.",
        "Let us try 3/4 of 20. Step one, divide by the bottom number 4: 20 divided by 4 = 5. So one quarter is 5. Step two, multiply by the top number 3: 5 times 3 = 15. So 3/4 of 20 is 15.",
        "You can picture this with real objects. Imagine 20 marbles shared into 4 equal cups, so each cup holds 5 marbles. Taking 3 of those cups gives you 3 lots of 5, which is 15 marbles. The dividing shares them out fairly, and the multiplying scoops up as many cups as you need.",
        "A quick note about the word 'of'. In maths, 'of' nearly always means multiply. But when we are finding a fraction of an amount, it is much easier to divide first and multiply second, so the numbers stay small and friendly.",
      ],
      examples: [
        { q: "What is 2/3 of 12?", steps: ["Step one: divide by the bottom number. 12 divided by 3 = 4 (that is one third).", "Step two: multiply by the top number. 4 times 2 = 8.", "So 2/3 of 12 is 8."], answer: "8" },
        { q: "What is 3/5 of 35?", steps: ["Step one: divide by the bottom number. 35 divided by 5 = 7 (that is one fifth).", "Step two: multiply by the top number. 7 times 3 = 21."], answer: "21" },
        { q: "What is 7/8 of 64?", steps: ["Step one: divide by the bottom number. 64 divided by 8 = 8 (that is one eighth).", "Step two: multiply by the top number. 8 times 7 = 56."], answer: "56" },
      ],
      tryit: { q: "What is 2/5 of 30?", answer: "12. Divide: 30 divided by 5 = 6. Multiply: 6 times 2 = 12." },
    },
    {
      h: "5. Practising with bigger numbers",
      body: [
        "The recipe never changes, no matter how big the numbers get. Divide by the bottom, then multiply by the top. Let us try it with some larger amounts so you can see it always works.",
        "Take 3/4 of 48. Step one, divide by 4: 48 divided by 4 = 12 (that is one quarter). Step two, multiply by 3: 12 times 3 = 36. So 3/4 of 48 is 36.",
        "Here is a handy check you can do. The whole amount was 48, cut into 4 quarters. Three quarters is 36 and the leftover one quarter is 12. Add them back together, 36 plus 12, and you get 48 again. It matches the amount you started with, so you know the answer is right.",
        "This is why we divide before we multiply. If you tried to multiply 48 by 3 first you would get 144, which is a big scary number to then divide. Dividing first keeps everything small and simple.",
      ],
      examples: [
        { q: "What is 5/6 of 42?", steps: ["Step one: divide by the bottom number. 42 divided by 6 = 7 (that is one sixth).", "Step two: multiply by the top number. 7 times 5 = 35.", "So 5/6 of 42 is 35."], answer: "35" },
        { q: "What is 4/9 of 63?", steps: ["Step one: 63 divided by 9 = 7 (that is one ninth).", "Step two: 7 times 4 = 28."], answer: "28" },
        { q: "What is 7/12 of 144?", steps: ["Step one: 144 divided by 12 = 12 (that is one twelfth).", "Step two: 12 times 7 = 84."], answer: "84" },
      ],
      tryit: { q: "What is 3/8 of 40?", answer: "15. Divide: 40 divided by 8 = 5. Multiply: 5 times 3 = 15." },
    },
    {
      h: "6. Fractions of money, time and length",
      body: [
        "The same two-step recipe works when the amount is measuring something real, like money, time or length. You just keep the units (the pounds, the minutes, the centimetres) stuck to the numbers all the way through.",
        "Money example. What is 3/4 of £48? Divide by 4: £48 divided by 4 = £12. Multiply by 3: £12 times 3 = £36. So 3/4 of £48 is £36. Notice the pound sign stays attached the whole time.",
        "Time needs one extra bit of care. If a question asks for a fraction of an hour, it is usually easiest to swap the hour for 60 minutes first, because 60 divides up neatly. So '2/3 of 1 hour' becomes '2/3 of 60 minutes'.",
        "Let us finish that one. 2/3 of 60 minutes: divide by 3, 60 divided by 3 = 20 minutes. Multiply by 2, 20 times 2 = 40 minutes. So 2/3 of an hour is 40 minutes.",
        "The lesson here is: always change your amount into the smaller units first if that makes the dividing easier, then follow the same recipe as normal.",
      ],
      examples: [
        { q: "What is 3/5 of 1 metre, in centimetres? (Remember 1 metre = 100 centimetres.)", steps: ["Swap the metre for its smaller units: 1 metre = 100 cm.", "Step one: divide by the bottom number. 100 divided by 5 = 20 cm.", "Step two: multiply by the top number. 20 times 3 = 60 cm.", "So 3/5 of 1 metre is 60 cm."], answer: "60 cm" },
        { q: "What is 2/3 of 1 hour, in minutes? (Remember 1 hour = 60 minutes.)", steps: ["Swap the hour for minutes: 1 hour = 60 minutes.", "Step one: 60 divided by 3 = 20 minutes (that is one third).", "Step two: 20 times 2 = 40 minutes."], answer: "40 minutes" },
        { q: "What is 3/8 of 1 kilometre, in metres? (Remember 1 kilometre = 1,000 metres.)", steps: ["Swap the kilometre for metres: 1 km = 1,000 m.", "Step one: 1,000 divided by 8 = 125 m (that is one eighth).", "Step two: 125 times 3 = 375 m."], answer: "375 metres" },
      ],
      tryit: { q: "What is 3/4 of 1 hour, in minutes?", answer: "45 minutes. Change to 60 minutes, divide by 4 to get 15, then multiply by 3 to get 45." },
    },
    {
      h: "7. Working backwards to find the whole amount",
      body: [
        "So far we have started with the whole amount and found a part of it. Now we will flip it around. Sometimes you are told how much a PART is worth, and you have to work out the whole amount you started with. This is like being a detective.",
        "Start with the easiest case, a unit fraction. Suppose 1/5 of a number is 6. That means the number was split into 5 equal parts, and each part is 6. To get the whole thing back, you just gather up all 5 parts: 6 times 5 = 30. So the whole number is 30.",
        "Now a trickier case, when the top number is more than one. Suppose 3/5 of a number is 18. Those 18 are made of 3 equal parts, so first find ONE part by dividing: 18 divided by 3 = 6. Now you know one fifth is 6, so gather all 5 parts: 6 times 5 = 30. The whole number is 30.",
        "Notice this is the recipe in reverse. Going forwards we divide by the bottom then multiply by the top. Going backwards we divide by the TOP to find one part, then multiply by the BOTTOM to build the whole.",
        "A picture helps here. Imagine a chocolate bar with some pieces missing. You can see 3 pieces and you are told they are worth 18. So each piece is worth 6, and if the full bar had 5 equal pieces, the whole bar was worth 30 before anyone nibbled it.",
      ],
      examples: [
        { q: "3/7 of a number is 21. What was the whole number?", steps: ["The 21 is made of 3 equal parts, so find one part by dividing: 21 divided by 3 = 7.", "So one seventh is 7. The whole number has 7 of these parts, so multiply: 7 times 7 = 49.", "The whole number is 49."], answer: "49" },
        { q: "4/5 of a number is 28. What is the whole number?", steps: ["The 28 is made of 4 equal parts. Find one part: 28 divided by 4 = 7.", "One fifth is 7. The whole has 5 parts: 7 times 5 = 35."], answer: "35" },
        { q: "7/9 of a number is 63. What is the whole number?", steps: ["The 63 is made of 7 equal parts. Find one part: 63 divided by 7 = 9.", "One ninth is 9. The whole has 9 parts: 9 times 9 = 81.", "Check: 7/9 of 81 = 81 ÷ 9 x 7 = 63."], answer: "81" },
      ],
      tryit: { q: "2/3 of a number is 10. What is the whole number?", answer: "15. One part is 10 divided by 2 = 5, and the whole is 5 times 3 = 15." },
    },
    {
      h: "8. Putting it all together",
      body: [
        "Let us gather up everything you have learned so it is all in one place.",
        "The bottom number of a fraction (the denominator) tells you how many equal parts to split into, so you DIVIDE by it. The top number (the numerator) tells you how many parts to take, so you MULTIPLY by it.",
        "To find a fraction of an amount, divide by the bottom then multiply by the top. To work backwards from a part to the whole amount, divide by the top then multiply by the bottom.",
        "One last clever trick. Once you know what a unit fraction (one part) is worth, you never have to start again. If someone tells you 1/8 of a number is 6, then 5/8 of that same number is just 5 lots of 6, which is 6 times 5 = 30. No dividing needed, because the hard work is already done.",
        "You now have a recipe that works for sweets, marbles, money, time, length and mystery numbers. Well done. Have a go at the final check below to see it all click into place.",
      ],
      examples: [
        { q: "1/8 of a number is 6. What is 5/8 of the same number?", steps: ["One part (1/8) is worth 6.", "Five parts (5/8) is 5 lots of 6.", "5 times 6 = 30."], answer: "30" },
        { q: "1/6 of a number is 8. What is 5/6 of the same number?", steps: ["One part (1/6) is worth 8.", "Five parts (5/6) is 5 lots of 8.", "5 times 8 = 40."], answer: "40" },
        { q: "3/7 of a number is 24. What is 5/7 of the same number?", steps: ["Three parts (3/7) are worth 24. So one part (1/7) is 24 divided by 3 = 8.", "Five parts (5/7) is 5 lots of 8.", "5 times 8 = 40."], answer: "40" },
      ],
      tryit: { q: "A class has 24 children and 3/4 of them walk to school. How many children walk to school?", answer: "18. Divide 24 by 4 to get 6 (one quarter), then multiply by 3 to get 18." },
    },
  ],
};

PRIMARY_LESSONS.decimalPlaceValue = {
  title: "Decimals: numbers that carry on past the point",
  minutes: 18,
  intro: "You already know how to count with whole numbers like 3, 40 or 275. A decimal is just a way of writing numbers that are smaller than one whole, the little bits that fall in between. We are going to build the idea up slowly, one tiny step at a time, so that by the end you can look at a number like 4.73 and know exactly what every part of it means.",
  sections: [
    {
      h: "1. Whole numbers, and the bits in between",
      body: [
        "Let's start with something you know. When you count sweets, you count 1 sweet, 2 sweets, 3 sweets. These are whole numbers. A whole number counts things that come in complete pieces.",
        "But not everything comes in whole pieces. If you share one pizza between two people, you each get half a pizza. Half is smaller than one whole pizza, but it is bigger than nothing. So we need a way to write numbers that are stuck in between the whole numbers.",
        "That is exactly what a decimal is. A decimal is a number that has a whole-number part and then a smaller in-between part, and a special dot separates the two parts.",
        "That special dot is called the decimal point. Everything to the LEFT of the point is the whole part (complete pizzas). Everything to the RIGHT of the point is the in-between part (slices of a pizza, smaller than one whole).",
        "So in the number 3.5, the 3 on the left means three whole things. The dot is the decimal point. The 5 on the right means a bit extra, less than one more whole thing. You could read 3.5 as three and a half.",
      ],
      tryit: { q: "In the number 6.2, which digit is the whole-number part, and which digit is the in-between bit?", answer: "The 6 is the whole part (it is left of the point). The 2 is the in-between bit (it is right of the point)." },
    },
    {
      h: "2. The first place after the point: tenths",
      body: [
        "Now let's look closely at that in-between part. Imagine a chocolate bar that is made of exactly 10 equal little squares in a row.",
        "One whole chocolate bar is 1. But if you snap off just one little square, you have one out of the ten pieces. We call that one tenth. A tenth means one piece when a whole thing is split into 10 equal pieces.",
        "The very first place straight after the decimal point is called the tenths place. The digit sitting there tells you how many of those little tenth-squares you have.",
        "So in the number 0.4, the 0 says we have no whole chocolate bars, and the 4 in the tenths place says we have 4 little squares out of 10. That is four tenths.",
        "Here is another way to picture it. Think of a ruler that is 1 metre long, with the metre split into 10 equal chunks. Each chunk is one tenth of a metre. If you walk 7 chunks along, you have walked 0.7 of a metre, which is seven tenths.",
        "We can write a tenth as a fraction too. Four tenths written as a fraction is 4/10, and written as a decimal it is 0.4. They are two ways of saying the very same amount.",
      ],
      examples: [
        { q: "A jug can hold 1 whole litre. You pour in 3 tenths of a litre. How do you write that as a decimal?", steps: ["There are no whole litres yet, so the whole-number part is 0.", "Three tenths goes in the first place after the point, the tenths place.", "Put them together: 0 point 3."], answer: "0.3 (which is the same as the fraction 3/10)" },
        { q: "A recipe uses 7 hundredths of a kilogram of sugar. Write that amount as a decimal number of kilograms.", steps: ["There are no whole kilograms, so the whole-number part is 0.", "Zero tenths of a kilogram: the tenths place holds 0.", "7 hundredths goes in the second place after the point, the hundredths place."], answer: "0.07 kg" },
        { q: "A length is 5 tenths and 8 hundredths of a metre. Write it as a decimal number of metres. Then write it in centimetres.", steps: ["5 tenths goes in the tenths place, 8 hundredths in the hundredths place: 0.58 metres.", "There are 100 centimetres in a metre, so multiply by 100: shift the decimal point 2 places right.", "0.58 x 100 = 58 centimetres."], answer: "0.58 metres, which is 58 centimetres." },
      ],
      tryit: { q: "In the number 5.8, what does the 8 mean?", answer: "The 8 is in the tenths place, so it means 8 tenths, or 8/10, or 0.8." },
    },
    {
      h: "3. Going smaller still: hundredths",
      body: [
        "Sometimes a tenth is still too big and we need to chop things up even finer. So we take just one of those tenth-squares and split IT into 10 tiny equal pieces as well.",
        "If a whole is split into 10, then each of those is split into 10 again, we end up with 100 tiny pieces in total. One of those tiny pieces is called one hundredth. A hundredth means one piece when a whole thing is split into 100 equal pieces.",
        "The second place after the decimal point is the hundredths place. So the places go like this, reading left to right: whole numbers, then the point, then tenths, then hundredths.",
        "A lovely way to see this is with money, because British money already works in hundredths. One pound is one whole. There are exactly 100 pennies in a pound, so one penny is one hundredth of a pound.",
        "That is why we write eighty-five pence as 0.85 of a pound. The 8 is 8 tenths of a pound (which is 8 ten-pence coins, so 80p) and the 5 is 5 hundredths of a pound (5 pennies, so 5p). Together that is 85p.",
        "Picture it visually with a grid of 100 small squares, 10 rows of 10. One whole grid is 1. One full row shaded is one tenth (0.1). One single little square shaded is one hundredth (0.01).",
      ],
      examples: [
        { q: "You have 4 ten-pence coins and 7 pennies. Write how much of a pound that is, as a decimal.", steps: ["4 ten-pence coins are 4 tenths of a pound, so a 4 goes in the tenths place.", "7 pennies are 7 hundredths of a pound, so a 7 goes in the hundredths place.", "There are no whole pounds, so a 0 goes in front of the point."], answer: "0.47 of a pound (which is 47p)" },
        { q: "You have 3 pound coins, 5 ten-pence coins and 2 pennies. Write the total as a decimal number of pounds.", steps: ["3 pound coins give 3 in the whole-number part.", "5 ten-pence coins are 5 tenths of a pound: 5 in the tenths place.", "2 pennies are 2 hundredths of a pound: 2 in the hundredths place."], answer: "£3.52" },
        { q: "Write the decimal number that has 8 ones, 0 tenths, 3 hundredths and 9 thousandths.", steps: ["Ones place: 8. Tenths place: 0. Hundredths place: 3. Thousandths place: 9.", "Write them in order, with the decimal point between the ones and the tenths.", "8 point 0, then 3, then 9."], answer: "8.039" },
      ],
      tryit: { q: "In the number 0.63, which digit is in the hundredths place, and what is it worth?", answer: "The 3 is in the hundredths place. It is worth 3 hundredths, or 3/100, or 0.03." },
    },
    {
      h: "4. Each place is ten times smaller than the one before",
      body: [
        "Here is the neat pattern that ties everything together. As you move to the right, each place is worth ten times LESS than the place just before it.",
        "Think of it as zooming in. A whole is big. A tenth is a whole split into 10, so it is ten times smaller. A hundredth is a tenth split into 10 again, so it is ten times smaller still.",
        "This is exactly the same pattern that whole numbers already use, just carrying on in the other direction. With whole numbers, each place to the LEFT is ten times bigger: ones, then tens, then hundreds. With decimals, each place to the RIGHT is ten times smaller: ones, then tenths, then hundredths.",
        "So decimals are not a strange new kind of number. They are the very same place-value ladder you already climb with whole numbers, simply continuing downwards past the point.",
        "Let's read a whole decimal carefully to prove it. Take 4.73. The 4 is 4 ones. The 7 is 7 tenths. The 3 is 3 hundredths. So 4.73 means four wholes, and seven tenths, and three hundredths, all added together.",
      ],
      examples: [
        { q: "Break the number 2.56 into the value of each digit.", steps: ["The 2 is left of the point, so it is 2 ones, worth 2.", "The 5 is in the first place after the point, the tenths, so it is 5 tenths, worth 0.5.", "The 6 is in the second place after the point, the hundredths, so it is 6 hundredths, worth 0.06."], answer: "2.56 is 2 ones plus 5 tenths plus 6 hundredths (2 + 0.5 + 0.06)." },
        { q: "Break the number 14.307 into the value of each digit.", steps: ["14 is to the left of the point: 1 ten (worth 10) and 4 ones (worth 4).", "3 is in the tenths place, worth 0.3. 0 is in the hundredths place, worth 0. 7 is in the thousandths place, worth 0.007."], answer: "14.307 = 10 + 4 + 0.3 + 0 + 0.007." },
        { q: "A number has 4 in the tens, 7 in the ones, 0 in the tenths, 5 in the hundredths and 3 in the thousandths. Write the number, and write the value of the 3 as a fraction.", steps: ["Tens: 40. Ones: 7. Tenths: 0. Hundredths: 0.05. Thousandths: 0.003.", "Write it as a decimal: 47.053.", "The 3 is in the thousandths place, so its value as a fraction is 3/1000."], answer: "47.053. The value of the 3 is 3/1000." },
      ],
      tryit: { q: "In the number 8.19, what is the value of the digit 1?", answer: "The 1 is in the tenths place, so it is worth 1 tenth, which is 0.1 (not 1, and not 0.01)." },
    },
    {
      h: "5. Multiplying and dividing by 10, 100 and 1000",
      body: [
        "Multiplying means making a number bigger by adding it up lots of times. When you multiply a decimal by 10, every digit becomes worth ten times more, so each digit shuffles one place to the LEFT along our ladder.",
        "There is a handy way to see this happening. Instead of moving the digits, we can imagine the decimal point sliding the other way. Multiplying by 10 looks like the point sliding ONE place to the right.",
        "For example, 3.45 times 10 is 34.5. The point has hopped one step to the right. It makes sense that the answer got bigger, because multiplying always makes numbers grow.",
        "Dividing is the opposite of multiplying. Dividing means sharing into equal groups, which makes each share smaller. So dividing by 10 slides the point ONE place to the LEFT, making the number smaller. For example, 3.45 divided by 10 is 0.345.",
        "The size of the jump depends on the number of zeros. For 10 the point moves 1 place. For 100 (two zeros) it moves 2 places. For 1000 (three zeros) it moves 3 places. Multiply moves it right (bigger), divide moves it left (smaller).",
        "If you run out of digits while sliding the point, just fill the empty spaces with zeros so the point has somewhere to land.",
      ],
      examples: [
        { q: "What is 6.2 times 100?", steps: ["Multiplying by 100 means the answer gets bigger, so the point slides to the right.", "100 has two zeros, so slide the point 2 places to the right.", "Starting at 6.2, one place gives 62, and the second place needs a zero to land on, giving 620."], answer: "620" },
        { q: "What is 0.45 times 1000?", steps: ["Multiplying by 1000 slides the point 3 places to the right.", "0.45 → 4.5 → 45 → 450.", "The third place needs a zero as a placeholder."], answer: "450" },
        { q: "A recipe needs 3.7 m of ribbon. You want to know the answer in centimetres. There are 100 cm in 1 m. What is 3.7 times 100? Then as a bonus, if you divide 3.7 by 100, what do you get?", steps: ["3.7 × 100: slide the point 2 places right → 370 cm.", "3.7 ÷ 100: dividing makes the number smaller, so the point slides 2 places left → 0.037.", "Check by reasoning: 3.7 ÷ 100 means 3.7 shared between 100 equal parts, which is a very small number just over 3 hundredths."], answer: "3.7 × 100 = 370. 3.7 ÷ 100 = 0.037." },
      ],
      tryit: { q: "What is 45.0 divided by 10?", answer: "4.5 (dividing makes it smaller, so the point slides one place to the left)." },
    },
    {
      h: "6. Comparing decimals: which one is bigger?",
      body: [
        "It is very tempting to think that a decimal with more digits must be the bigger number. That is a trap. 0.35 has more digits written down than 0.5, but 0.5 is actually the bigger amount. Let's see why, gently.",
        "The safe method is to line up the decimal points, one exactly under the other, and then compare the digits from LEFT to right, starting with the biggest place.",
        "It also helps to make the numbers the same length by adding a zero on the end, because a zero on the very end of a decimal does not change its value. 0.5 and 0.50 are the same amount, in the same way that half a pound is 50p either way you say it.",
        "So to compare 0.5 and 0.35, write them as 0.50 and 0.35. Now compare the tenths first. 5 tenths beats 3 tenths, so 0.50 wins straight away. 0.5 is bigger.",
        "Money makes this easy to feel. 0.5 of a pound is 50p. 0.35 of a pound is 35p. Nobody would say 35p is more than 50p, and now you can see why.",
        "Only if the tenths are equal do you move along to compare the hundredths, exactly the way you would compare whole numbers digit by digit.",
      ],
      examples: [
        { q: "Which is bigger, 0.6 or 0.45?", steps: ["Make them the same length by adding a zero: 0.60 and 0.45.", "Line up the points and compare the tenths first.", "6 tenths beats 4 tenths, so we do not even need the next digit."], answer: "0.6 is bigger (it is 60p compared with 45p)." },
        { q: "Which is bigger, 0.35 or 0.4?", steps: ["Pad to the same length: 0.35 and 0.40.", "Compare the tenths: 3 tenths versus 4 tenths.", "4 tenths is larger, so 0.4 is bigger."], answer: "0.4 is bigger." },
        { q: "Which is bigger, 0.089 or 0.1? Many people guess wrong on this one.", steps: ["Pad to the same length: 0.089 and 0.100.", "Compare the tenths first: 0 tenths versus 1 tenth.", "1 tenth beats 0 tenths straight away, even though 0.089 has more digits."], answer: "0.1 is bigger. A single tenth (0.1 = 0.100) is bigger than 89 thousandths (0.089)." },
      ],
      tryit: { q: "Which is bigger, 0.28 or 0.3?", answer: "0.3 is bigger. Write it as 0.30, then 3 tenths beats 2 tenths." },
    },
    {
      h: "7. Ordering a mixed list of decimals",
      body: [
        "Ordering means putting numbers in a line from smallest to biggest (or biggest to smallest). It is just comparing, done several times over.",
        "The trick that stops all muddles is to make every number have the same number of decimal places first, by padding the short ones with zeros on the end. Then they are easy to compare at a glance.",
        "Once they all line up neatly, read down the tenths column to sort them, and use the hundredths column only to break any ties.",
        "It can help to picture a number line, a straight line with 0 at one end and 1 at the other, marked into ten equal steps. Every decimal has its own spot on that line, and the one furthest to the right is the biggest.",
      ],
      examples: [
        { q: "Put these in order, smallest first: 0.4, 0.25, 0.7, 0.36.", steps: ["They already all have two decimal places except 0.4 and 0.7, so pad those: 0.40, 0.25, 0.70, 0.36.", "Compare the tenths column: 4, 2, 7, 3.", "Smallest tenths first: 2 (0.25), then 3 (0.36), then 4 (0.40), then 7 (0.70)."], answer: "0.25, then 0.36, then 0.4, then 0.7" },
        { q: "Put these five numbers in order, smallest first: 0.5, 0.18, 0.9, 0.07, 0.38.", steps: ["Pad all to two decimal places: 0.50, 0.18, 0.90, 0.07, 0.38.", "Compare tenths: 5, 1, 9, 0, 3.", "Order by tenths: 0 → 1 → 3 → 5 → 9, which gives 0.07, 0.18, 0.38, 0.50, 0.90."], answer: "0.07, then 0.18, then 0.38, then 0.5, then 0.9." },
        { q: "Put these in order, smallest first: 0.625, 0.06, 0.6, 0.062.", steps: ["Pad to three decimal places: 0.625, 0.060, 0.600, 0.062.", "Compare tenths: 6, 0, 6, 0. The two starting with 0 tenths come first.", "Break the tie between 0.060 and 0.062 using hundredths: 6 vs 6, then thousandths: 0 vs 2. So 0.060 < 0.062.", "Now the two with 6 tenths: 0.600 vs 0.625. Hundredths: 0 vs 2. So 0.600 < 0.625."], answer: "0.06, then 0.062, then 0.6, then 0.625." },
      ],
      tryit: { q: "Put these in order, smallest first: 0.9, 0.09, 0.19.", answer: "0.09, then 0.19, then 0.9. Padding gives 0.90, 0.09, 0.19, and the tenths are 9, 0, 1." },
    },
    {
      h: "8. Handy fraction and decimal pairs to remember",
      body: [
        "A fraction is another way of writing a part of a whole, using two numbers with a line between them, like 1/2 (one half). The bottom number says how many equal pieces the whole is split into, and the top number says how many of those pieces you have.",
        "Some fractions turn into really tidy decimals, and these come up so often that it is worth learning them off by heart, the same way you learn your times tables. Then you never have to work them out under pressure.",
        "The four most useful ones are: one half is 1/2 = 0.5, one quarter is 1/4 = 0.25, one fifth is 1/5 = 0.2, and one tenth is 1/10 = 0.1. A nice bonus one is three quarters, 3/4 = 0.75.",
        "You can double-check one to build trust in them. One half of a pound is 50p, and 50p written as a decimal of a pound is 0.5. It matches, so 1/2 = 0.5 is safe to trust.",
        "The real power of knowing these is that when a question mixes fractions and decimals together, you can turn everything into the same form first, and then it is easy to compare or add them.",
      ],
      examples: [
        { q: "Put these in order, smallest first: 0.3, 1/4, 0.15.", steps: ["Turn the fraction into a decimal using the pairs you know: 1/4 = 0.25.", "Now they are all decimals: 0.3, 0.25, 0.15.", "Pad and compare the tenths: 0.30, 0.25, 0.15, giving tenths of 3, 2, 1.", "Smallest first: 0.15, then 0.25, then 0.30."], answer: "0.15, then 1/4 (which is 0.25), then 0.3" },
        { q: "Put these in order, smallest first: 1/5, 0.3, 1/2.", steps: ["Convert fractions: 1/5 = 0.2, 1/2 = 0.5.", "All decimals: 0.2, 0.3, 0.5.", "Compare tenths: 2, 3, 5. Already in order."], answer: "1/5 (0.2), then 0.3, then 1/2 (0.5)." },
        { q: "Put these in order, smallest first: 3/4, 0.7, 0.08, 1/5.", steps: ["Convert fractions: 3/4 = 0.75, 1/5 = 0.2.", "All decimals: 0.75, 0.7, 0.08, 0.2. Pad: 0.75, 0.70, 0.08, 0.20.", "Compare tenths: 7, 7, 0, 2. Smallest tenths first: 0 (0.08), then 2 (0.20).", "Break tie between 0.75 and 0.70 using hundredths: 0.70 < 0.75."], answer: "0.08, then 1/5 (0.2), then 0.7, then 3/4 (0.75)." },
      ],
      tryit: { q: "Which is bigger, 1/2 or 0.4?", answer: "1/2 is bigger, because 1/2 = 0.5, and 0.5 beats 0.4 (5 tenths beats 4 tenths)." },
    },
  ],
};

PRIMARY_LESSONS.ratioBasics = {
  title: "Ratio: sharing that scales together",
  minutes: 20,
  intro: "A ratio is a way of saying how much of one thing goes with how much of another thing. We are going to build this idea up very slowly, starting with real objects you can picture, then sweets, then money, then a number line, and only right at the end the quick written method. Take your time. There is no rush, and every idea here is explained from the very beginning.",
  sections: [
    {
      h: "1. The words 'for every'",
      body: [
        "Before we use any special maths words at all, let us start with two ordinary words: 'for every'. These two little words are the whole secret of ratio, so keep them close.",
        "Imagine you are looking after some pets. Every single dog needs 2 bowls of water, because dogs get thirsty. So we can say: for every 1 dog, there are 2 bowls. If a friend brings another dog round, that dog also needs 2 bowls. Two dogs means 4 bowls. Three dogs means 6 bowls. The dogs and the bowls grow together, hand in hand.",
        "Notice that the bowls do not grow on their own and the dogs do not grow on their own. They come as a matching pair, like socks. One extra dog always brings 2 extra bowls along with it. That linked-together, always-matching feeling is what a ratio is really about.",
        "Let us try it another way. In a fruit bowl there are apples and oranges, and someone tells you: for every 3 apples there are 2 oranges. Picture the fruit sitting on the table in little groups. One group has 3 apples and 2 oranges next to it. If you set out a second group, that is 3 more apples and 2 more oranges. The groups are always the same shape.",
      ],
      tryit: { q: "A recipe says 'for every 1 cup of rice, use 2 cups of water'. If you use 3 cups of rice, how many cups of water do you need?", answer: "6 cups of water. Each cup of rice brings 2 cups of water, and 3 lots of 2 is 6." },
    },
    {
      h: "2. Writing a ratio down",
      body: [
        "Saying 'for every 3 apples there are 2 oranges' out loud is fine, but it is a bit of a mouthful. So maths gives us a short way to write it. We write the two numbers with a small dot-dot symbol between them, like this: 3:2. That symbol is called a colon, and here it simply means the words 'goes with' or 'to'.",
        "So 3:2 is read out loud as 'three to two', and it means exactly what we said before: for every 3 apples, there are 2 oranges. The word for this whole thing (the two numbers and the colon together) is a ratio. A ratio is just a tidy way of writing how much of one thing goes with another thing.",
        "The order matters, just like the order of your shoes matters. If we decide the ratio is apples to oranges, then 3:2 means 3 apples and 2 oranges. If we wrote 2:3 instead, that would mean 2 apples and 3 oranges, which is a different fruit bowl. So always keep in your head which number stands for which thing.",
        "Here is a helpful way to picture it. Draw two columns on a page, one labelled 'apples' and one labelled 'oranges'. Under apples you put 3 dots. Under oranges you put 2 dots. That little picture IS the ratio 3:2. You could keep the labels and swap the picture for real counters or buttons and it would still say the same thing.",
      ],
      tryit: { q: "In a box of socks there are 5 black socks for every 4 white socks. Write this as a ratio of black to white, using a colon.", answer: "5:4. The black number comes first because we said 'black to white', and it is read as 'five to four'." },
    },
    {
      h: "3. Groups: why a ratio has no fixed size",
      body: [
        "Here is something that surprises a lot of people when they first meet ratios, so let us go gently. A ratio does not tell you HOW MANY things there are in total. It only tells you the recipe, the pattern, the shape of the matching pairs.",
        "Think about the drink squash you make at home. Say the ratio of squash to water is 1:4, which means for every 1 splash of squash you add 4 splashes of water. You could make a tiny cup for yourself: 1 splash of squash and 4 splashes of water. Or you could make a giant jug for a party: 5 splashes of squash and 20 splashes of water. Both drinks taste exactly the same, because both were made with the same recipe, 1:4.",
        "So the same ratio can describe a small amount or a huge amount. What stays fixed is the relationship between the two amounts, not the size of the amounts themselves. This is a bit like a photo of your family. You can print it small for your pocket or big for the wall, and it is still the same family in the same positions, just a different size.",
        "The clever trick is to think in GROUPS. The ratio 1:4 is one group of 'squash and water'. When you make the party jug you are just laying out 5 identical groups side by side. 5 groups of 1 splash of squash is 5 splashes. 5 groups of 4 splashes of water is 20 splashes. The pattern inside each group never changes, you just have more groups.",
      ],
      examples: [
        {
          q: "A necklace is made with beads in the ratio 2:1, meaning 2 red beads for every 1 gold bead. If you lay out 4 identical groups, how many red beads and how many gold beads are there?",
          steps: [
            "One group has 2 red beads and 1 gold bead.",
            "Red beads: 4 groups, each with 2 red, so 4 times 2 is 8 red beads.",
            "Gold beads: 4 groups, each with 1 gold, so 4 times 1 is 4 gold beads.",
          ],
          answer: "8 red beads and 4 gold beads (which we could also write as the ratio 8:4).",
        },
        { q: "Tiles are laid in a pattern with 3 blue tiles for every 2 white tiles (ratio 3:2). If you lay out 5 identical groups, how many blue and how many white tiles are there in total?", steps: ["One group has 3 blue and 2 white tiles.", "Blue: 5 groups × 3 = 15 blue tiles.", "White: 5 groups × 2 = 10 white tiles."], answer: "15 blue tiles and 10 white tiles (25 tiles in total)." },
        { q: "A sticker pack always has 4 star stickers and 3 moon stickers (ratio 4:3). Someone buys 6 packs. How many star stickers and how many moon stickers are there? What fraction of all the stickers are stars?", steps: ["Stars: 6 groups × 4 = 24 star stickers.", "Moons: 6 groups × 3 = 18 moon stickers.", "Total stickers: 24 + 18 = 42.", "Fraction that are stars: 24 out of 42 = 24/42. Simplify by dividing both by 6: 4/7."], answer: "24 star stickers, 18 moon stickers, and 4/7 of all stickers are stars." },
      ],
      tryit: { q: "A fruit drink is mixed as juice to water in the ratio 2:3. If you make 3 identical groups, how many splashes of juice and how many splashes of water is that?", answer: "6 splashes of juice and 9 splashes of water. Juice: 3 groups of 2 is 6. Water: 3 groups of 3 is 9." },
    },
    {
      h: "4. Spotting a ratio that has just grown bigger",
      body: [
        "Because a ratio can be made in lots of identical groups, the same ratio can turn up wearing different-sized numbers. 2:3, and 4:6, and 6:9 are really all the same recipe, just made in 1 group, 2 groups and 3 groups. When two ratios are secretly the same recipe like this, we say they are equivalent. Equivalent is just a long word meaning 'worth the same, the same really'.",
        "How can you check whether a bigger ratio is really the same recipe as a smaller one? You look for the number of groups. Ask yourself: what did I multiply the first number by to get the new first number? Then check whether the second number was multiplied by that very same amount.",
        "For example, is 6:9 the same recipe as 2:3? Look at the first numbers: 2 became 6, and 2 times 3 is 6, so that is 3 groups. Now check the second numbers with the same amount: 3 times 3 is 9. It matches. So 6:9 really is 2:3 made in 3 groups, and the two ratios are equivalent.",
        "You can picture this on a number line if it helps. Put a mark at 2 and a mark at 3. Now imagine stretching the whole number line to 3 times its size, like pulling a rubber band. The mark at 2 slides out to 6 and the mark at 3 slides out to 9. Both marks stretched by the same amount, so the pattern between them is unchanged.",
        "The important warning is this: both numbers must be multiplied by the SAME amount. If the first number tripled but the second number only doubled, the recipe has changed and the ratios are not equivalent.",
      ],
      examples: [
        {
          q: "Is the ratio 4:10 the same recipe as 2:5?",
          steps: [
            "Look at the first numbers: 2 became 4. Since 2 times 2 is 4, that looks like 2 groups.",
            "Now check the second numbers with the same amount: 5 times 2 is 10.",
            "The second number really is 10, so both numbers were multiplied by 2.",
          ],
          answer: "Yes, they are equivalent. 4:10 is just 2:5 made in 2 groups.",
        },
        { q: "Is the ratio 9:12 equivalent to 3:4?", steps: ["Look at the first numbers: 3 became 9. Since 3 × 3 = 9, that is 3 groups.", "Check the second number with the same multiplier: 4 × 3 = 12.", "The second number really is 12, so both sides were multiplied by 3."], answer: "Yes. 9:12 is 3:4 made in 3 groups." },
        { q: "Three ratios are given: (a) 6:8, (b) 8:12, (c) 10:18. Which one is equivalent to 2:3?", steps: ["Check (a) 6:8: first side, 2 × 3 = 6. Second side, 3 × 3 = 9, but we have 8 not 9. Not equivalent.", "Check (b) 8:12: first side, 2 × 4 = 8. Second side, 3 × 4 = 12. Both sides multiplied by the same amount.", "Check (c) 10:18: first side, 2 × 5 = 10. Second side, 3 × 5 = 15, but we have 18. Not equivalent."], answer: "(b) 8:12 is equivalent to 2:3. The multiplier is 4 for both sides." },
      ],
      tryit: { q: "Is the ratio 6:8 the same recipe as 3:4?", answer: "Yes. 3 times 2 is 6, and 4 times 2 is 8, so both numbers were multiplied by 2. It is 3:4 made in 2 groups." },
    },
    {
      h: "5. Shrinking a ratio down to its simplest form",
      body: [
        "Just as we can make a ratio bigger by using more groups, we can sometimes make it smaller by noticing it was already several groups squashed together. Making a ratio as small as it will go is called simplifying it, and the smallest tidy version is called its simplest form.",
        "Here is the idea with real sweets. Suppose you have 12 red sweets and 8 green sweets, a ratio of 12:8. Can you share them into equal little piles that all look the same? Yes: you can make 4 piles, and each pile has 3 red sweets and 2 green sweets. So the recipe hiding inside 12:8 was really 3:2, made in 4 groups. We write the simplest form as 3:2.",
        "To simplify without the sweets in front of you, you look for a number that divides into BOTH sides exactly, and you divide both sides by it. With 12:8, the number 4 goes into both (12 divided by 4 is 3, and 8 divided by 4 is 2), giving 3:2. Once no number bigger than 1 goes into both sides any more, you have reached the simplest form.",
        "A number line picture again: 12:8 is like a stretched-out version, and simplifying is letting the rubber band ping back to its smallest natural size, 3:2, where the two marks are as close together as the recipe allows.",
      ],
      examples: [
        {
          q: "Simplify the ratio 10:15 to its simplest form.",
          steps: [
            "Look for a number that divides into both 10 and 15. The number 5 works.",
            "Divide the first side: 10 divided by 5 is 2.",
            "Divide the second side by the same number: 15 divided by 5 is 3.",
            "Now check: does any number bigger than 1 divide into both 2 and 3? No, so we have finished.",
          ],
          answer: "2:3",
        },
        { q: "Simplify the ratio 18:24 to its simplest form.", steps: ["Look for a common factor. Both 18 and 24 are even, so 2 works, but can we do better? 6 divides into 18 (18 ÷ 6 = 3) and into 24 (24 ÷ 6 = 4).", "Divide both sides by 6: 18 ÷ 6 = 3 and 24 ÷ 6 = 4.", "Check: does any number bigger than 1 divide into both 3 and 4? No. Done."], answer: "3:4" },
        { q: "Simplify the ratio 60:84 to its simplest form.", steps: ["Look for a factor common to both. 2 works. 3 works. Does 6 work? 60 ÷ 6 = 10, 84 ÷ 6 = 14. So 6 is a common factor.", "Can we go further? Does 2 divide into both 10 and 14? Yes: 10 ÷ 2 = 5 and 14 ÷ 2 = 7. That gives 5:7.", "Check: does anything bigger than 1 divide into both 5 and 7? No. So dividing 60:84 by 12 in one step gives 5:7."], answer: "5:7 (dividing both sides by 12)." },
      ],
      tryit: { q: "Simplify the ratio 6:9 to its simplest form.", answer: "2:3. The number 3 divides into both: 6 divided by 3 is 2, and 9 divided by 3 is 3." },
    },
    {
      h: "6. Finding out what one part is worth",
      body: [
        "Now we come to the most useful skill of all, and we will take it one careful step at a time. Sometimes you know the ratio and you know ONE of the real amounts, and you want to work out the other real amount. To do this, we find out what a single 'part' is worth.",
        "A 'part' is just one share of the recipe. In the ratio 2:5 there are 2 parts of the first thing and 5 parts of the second thing, but every part is the same size. If we can find the size of one part, we can find anything.",
        "Let us use money because coins are easy to picture. A ratio of pocket money between you and your sister is 2:5, and you are told YOUR share (the 2 side) is 6 pounds. First find how big one part is. Your side is 2 parts and it is worth 6 pounds, so one part is 6 divided by 2, which is 3 pounds. Now your sister has 5 parts, and each part is 3 pounds, so her share is 5 times 3, which is 15 pounds.",
        "The two steps, said simply, are: (1) divide the amount you know by its own side of the ratio to find one part, then (2) multiply that one part by the other side of the ratio. Whenever you feel lost, come back to these two steps.",
      ],
      examples: [
        {
          q: "A recipe uses flour to sugar in the ratio 5:2. If you use 250g of flour, how much sugar do you need?",
          steps: [
            "The flour side of the ratio is 5, and the real flour is 250g. Find one part: 250 divided by 5 is 50g. So one part is 50g.",
            "The sugar side of the ratio is 2. Multiply the parts by their value: 2 times 50g is 100g.",
          ],
          answer: "100g of sugar",
        },
        { q: "A fruit drink is mixed as juice to water in the ratio 3:5. If you pour in 15 ml of juice, how much water do you need?", steps: ["The juice side is 3 parts. One part = 15 ÷ 3 = 5 ml.", "The water side is 5 parts. Water needed = 5 × 5 ml = 25 ml."], answer: "25 ml of water." },
        { q: "In a class the ratio of boys to girls is 4:5. There are 20 boys. How many girls are there, and what is the total class size?", steps: ["The boys' side is 4 parts and the real value is 20. One part = 20 ÷ 4 = 5.", "Girls' side is 5 parts. Girls = 5 × 5 = 25.", "Total class = 20 boys + 25 girls = 45."], answer: "25 girls, 45 pupils in total." },
      ],
      tryit: { q: "Paint is mixed blue to yellow in the ratio 3:4. You pour in 12 spoons of blue. Using the same steps, how many spoons of yellow do you need? (Hint: find one part first.)", answer: "16 spoons. One part is 12 divided by 3, which is 4. Yellow is 4 parts, and 4 times 4 is 16." },
    },
    {
      h: "7. Sharing a whole amount in a given ratio",
      body: [
        "Sometimes the puzzle is the other way round. You are given the TOTAL amount and the ratio, and you have to split the total up fairly according to that ratio. There is a lovely tidy method, and it uses parts again, so you already know most of it.",
        "Picture sharing 40 sweets between two children in the ratio 3:5. The first big step is to count how many parts there are altogether. There are 3 parts for one child and 5 parts for the other, so all together that is 3 plus 5, which is 8 parts. This tells you the 40 sweets must be split into 8 equal parts.",
        "The second step is to find the size of one part by sharing the total between all the parts: 40 sweets divided by 8 parts is 5 sweets per part. The third step is to give each child their number of parts: the first child gets 3 parts, so 3 times 5 is 15 sweets, and the second child gets 5 parts, so 5 times 5 is 25 sweets.",
        "It is always worth a quick check at the end: do the shares add back up to the total you started with? 15 plus 25 is 40, which is exactly the number of sweets we began with, so we know we have shared them out correctly with none lost and none invented.",
        "So the three steps for sharing a total are: (1) add up all the parts, (2) divide the total by that many parts to find one part, then (3) multiply each side by the size of one part. And then check the shares add back to the total.",
      ],
      examples: [
        {
          q: "Share 35 pounds between Amy and Ben in the ratio 2:5.",
          steps: [
            "Add up all the parts: 2 plus 5 is 7 parts.",
            "Find one part: 35 pounds divided by 7 is 5 pounds per part.",
            "Amy has 2 parts: 2 times 5 is 10 pounds. Ben has 5 parts: 5 times 5 is 25 pounds.",
            "Check: 10 plus 25 is 35 pounds, which matches the total we started with.",
          ],
          answer: "Amy gets 10 pounds and Ben gets 25 pounds.",
        },
        { q: "Share 48 sweets among three people in the ratio 1:2:3.", steps: ["Add the parts: 1 + 2 + 3 = 6 parts.", "One part = 48 ÷ 6 = 8 sweets.", "First person: 1 × 8 = 8. Second: 2 × 8 = 16. Third: 3 × 8 = 24.", "Check: 8 + 16 + 24 = 48. ✓"], answer: "8 sweets, 16 sweets and 24 sweets." },
        { q: "Share 63 marbles among three friends in the ratio 2:3:4. Find each person's share and confirm your answer adds up.", steps: ["Add the parts: 2 + 3 + 4 = 9 parts.", "One part = 63 ÷ 9 = 7 marbles.", "First friend: 2 × 7 = 14. Second: 3 × 7 = 21. Third: 4 × 7 = 28.", "Check: 14 + 21 + 28 = 63. ✓"], answer: "14 marbles, 21 marbles and 28 marbles." },
      ],
      tryit: { q: "Share 24 marbles between two friends in the ratio 1:3. (Remember: add the parts, find one part, then multiply.)", answer: "6 marbles and 18 marbles. The parts add to 1 plus 3, which is 4. One part is 24 divided by 4, which is 6. So the shares are 1 times 6 (which is 6) and 3 times 6 (which is 18). Check: 6 plus 18 is 24." },
    },
    {
      h: "8. The big trap: multiply, never add",
      body: [
        "There is one mistake that almost everybody makes at least once with ratios, so let us meet it now on purpose, before it catches you by surprise. When you make a ratio bigger or smaller, you must MULTIPLY both sides by the same amount. You must not ADD the same amount to both sides.",
        "Here is why, using biscuits. Suppose a party mix is 1 chocolate biscuit for every 2 plain biscuits, the ratio 1:2. Now you want more, so imagine you wrongly ADD 2 to each side: 1 plus 2 is 3, and 2 plus 2 is 4, giving 3:4. But 3:4 is a completely different recipe. In the real 1:2 recipe there are twice as many plain as chocolate, yet in 3:4 there are nowhere near twice as many. Adding has secretly changed the taste of the mix.",
        "Now do it the right way by multiplying, which keeps the groups equal. Multiply both sides of 1:2 by 3 and you get 3:6. In 3:6 there really are twice as many plain as chocolate, just as in the original. Multiplying kept the recipe the same, which is exactly what we want.",
        "The same warning shows up when scaling a whole recipe up or down. If a recipe for 4 people uses 200g of flour and 2 eggs, and you want to feed 6 people, you must find the scale factor first. A scale factor is simply the number of times bigger you are making it. Here it is 6 divided by 4, which is 1.5. Then multiply EVERY ingredient by 1.5: flour becomes 200 times 1.5, which is 300g, and eggs become 2 times 1.5, which is 3 eggs. Every ingredient gets multiplied by the same scale factor, never just one of them, and never by adding a fixed lump onto each.",
      ],
      examples: [
        {
          q: "A jug of squash is mixed 1:4 (squash to water). You want to keep the taste the same but make more, so you multiply both sides by 5. What is the new ratio, and how does it show the taste is unchanged?",
          steps: [
            "Multiply the first side by 5: 1 times 5 is 5.",
            "Multiply the second side by the same amount: 4 times 5 is 20.",
            "The new ratio is 5:20. In both 1:4 and 5:20 there is 4 times as much water as squash, so the taste is exactly the same.",
          ],
          answer: "5:20, and the taste is unchanged because both sides were multiplied by 5.",
        },
        { q: "A drink is mixed in the ratio 1:4 (squash to water). A pupil wants more drink, so they add 3 to each side to get 4:7. Does 4:7 taste the same as 1:4? Explain why.", steps: ["In 1:4 the water is 4 times the squash.", "In 4:7 the water is 7/4 = 1.75 times the squash — much less water relative to squash.", "Adding the same number to both sides changes the relationship between them. The recipe changes and the taste changes."], answer: "No. 4:7 does not taste the same as 1:4. You must multiply both sides, not add to them." },
        { q: "A recipe for 4 people uses 300g of flour and 2 eggs. Scale it up to serve 10 people. What is the scale factor, and how many grams of flour and how many eggs are needed?", steps: ["Scale factor = 10 ÷ 4 = 2.5.", "Flour: 300 × 2.5 = 750 g.", "Eggs: 2 × 2.5 = 5 eggs.", "Every ingredient is multiplied by 2.5, not by adding a fixed extra amount."], answer: "Scale factor 2.5. 750 g of flour and 5 eggs." },
      ],
      tryit: { q: "A recipe for 2 people uses 4 carrots. You want to cook for 6 people. What is the scale factor, and how many carrots do you need?", answer: "The scale factor is 6 divided by 2, which is 3. So you multiply the carrots by 3: 4 times 3 is 12 carrots." },
    },
  ],
};

PRIMARY_LESSONS.twoUnknowns = {
  title: "Two Mystery Numbers: using a second clue to split a total",
  minutes: 22,
  intro: "Sometimes a puzzle hides not one but TWO numbers from you. You are told a little bit about them and asked to work out exactly what they are. It sounds impossible at first, like guessing what is inside two wrapped presents. But with the right clues you really can find them, every time, and this lesson builds that skill up slowly from the very beginning.",
  sections: [
    {
      h: "1. What is a mystery number?",
      body: [
        "A mystery number is just a number you do not know yet but are trying to find. Grown-ups sometimes call it an unknown, which means exactly the same thing: a number that is unknown to you for now. We will call them mystery numbers because that is really what they are.",
        "Imagine a friend hides some marbles inside a closed box. You cannot see them, so you do not know how many there are. That hidden amount is a mystery number. Your job is to become a detective and work it out from the clues you are given.",
        "Here is a gentle first clue to get the feeling of it. A box has some marbles in it. Your friend says, 'If I put in 3 more, there would be 10.' You do not need to open the box to know the answer. Something plus 3 makes 10, so the something must be 7. You just found a mystery number without ever seeing it. That is the whole game, and everything else in this lesson is built on that same idea.",
        "In this lesson we go one step further. Instead of hunting for one mystery number, we hunt for TWO at the same time. Two boxes, two hidden amounts. That needs a bit more care, so take it slowly and do not worry if it feels new. It is meant to.",
      ],
      tryit: { q: "A box has some conkers in it. Your friend says, 'If I take away 4, there would be 6 left.' How many conkers are in the box?", answer: "10 conkers. Something take away 4 leaves 6, so the something is 6 + 4 = 10." },
    },
    {
      h: "2. Why one clue is not enough for two numbers",
      body: [
        "When you are looking for TWO mystery numbers, one clue on its own usually is not enough. Let us see why, because understanding this is the key that unlocks everything after it.",
        "Suppose I tell you that two numbers add up to 10. The word 'total' means the answer you get when you add numbers together, so I am telling you the total is 10. Can you tell me exactly what the two numbers are? Have a think.",
        "You cannot, and here is the reason. They could be 1 and 9. Or 2 and 8. Or 3 and 7. Or 5 and 5. All of those add up to 10, so all of them fit the clue. One clue leaves you with lots of possible answers, which means you cannot be sure of any single one.",
        "Think of it like this. If I say 'I am thinking of a fruit', you cannot guess which one, because there are far too many fruits. But if I add a second clue, 'it is yellow and curved', now you can say banana with confidence. The second clue narrows it down.",
        "Numbers work the same way. To pin down two mystery numbers you almost always need TWO clues: usually the total, plus one more clue that tells you something about how the two numbers relate to each other. That second clue is the star of this whole lesson.",
      ],
      tryit: { q: "Two numbers add up to 6. Write down three different pairs of whole numbers that fit this one clue.", answer: "Any three of these: 0 and 6, 1 and 5, 2 and 4, 3 and 3. They all total 6, which is exactly why one clue is not enough." },
    },
    {
      h: "3. The second clue: how much bigger?",
      body: [
        "One of the most useful second clues is the difference between the two numbers. The word 'difference' means how far apart two numbers are, or in other words how much bigger one is than the other. If one number is 8 and the other is 5, the difference is 3, because 8 is 3 bigger than 5.",
        "So now imagine you are given both clues together: the total of two numbers AND the difference between them. That is enough to find both numbers exactly. Let us picture it before we do any sums.",
        "Picture two towers built from cubes standing side by side. One tower is a bit taller than the other. The total is all the cubes in both towers added together. The difference is how many extra cubes the taller tower has poking up above the shorter one.",
        "Here is the clever bit. If you snapped off those extra cubes from the top of the taller tower, the two towers would suddenly be the same height. So take the difference away from the total, and what is left splits perfectly into two equal halves, one for each tower. Halve it to find the SHORTER tower. Then add the difference back on to find the TALLER one.",
        "Let us try it with real numbers you can picture. Two numbers have a total of 10 and a difference of 2. Snap off the 2 extra: 10 take away 2 is 8. Split that into two equal halves: 8 halved is 4. So the shorter number is 4. Add the 2 back on for the taller: 4 + 2 = 6. Check it: 4 + 6 = 10 and 6 take away 4 is 2. Both clues fit.",
      ],
      examples: [
        { q: "Two children share 12 sweets. One gets 4 more than the other. How many does each child get?", steps: ["Total is 12 and the difference is 4. First snap off the extra: 12 take away 4 = 8.", "Split what is left into two equal halves: 8 halved = 4. That is the SMALLER share.", "Add the 4 difference back on for the BIGGER share: 4 + 4 = 8.", "Check: 4 + 8 = 12 sweets in total, and 8 take away 4 = 4, so one child really does get 4 more."], answer: "One child gets 8 sweets and the other gets 4." },
        { q: "Two numbers have a total of 18 and a difference of 6. Find both numbers.", steps: ["Snap off the difference: 18 - 6 = 12.", "Halve what is left: 12 ÷ 2 = 6 (the smaller number).", "Add the difference back: 6 + 6 = 12 (the larger number).", "Check: 6 + 12 = 18 and 12 - 6 = 6. Both clues fit."], answer: "6 and 12." },
        { q: "Two numbers have a total of 100 and a difference of 26. Find both numbers.", steps: ["Snap off the difference: 100 - 26 = 74.", "Halve: 74 ÷ 2 = 37 (the smaller number).", "Add the difference: 37 + 26 = 63 (the larger number).", "Check: 37 + 63 = 100 and 63 - 37 = 26. Both clues fit."], answer: "37 and 63." },
      ],
      tryit: { q: "Two numbers have a total of 20 and a difference of 6. Find both numbers by snapping off the difference first.", answer: "20 take away 6 = 14, then halved = 7 (the smaller). Add 6 back: 7 + 6 = 13 (the bigger). Check: 7 + 13 = 20 and 13 take away 7 = 6." },
    },
    {
      h: "4. A quicker way to do sum and difference",
      body: [
        "Once the tower picture makes sense, there is a neat shortcut for these total-and-difference puzzles that gives the BIGGER number first. You do not have to use it, but it is quick once you trust it.",
        "The shortcut is: add the total and the difference together, then halve the answer. That gives you the bigger number straight away. To get the smaller number, just take the bigger number away from the total.",
        "Why does it work? Adding the difference onto the total is like giving the shorter tower enough spare cubes to match the taller one, so now you have two copies of the bigger number. Halving that pile gives you one copy, which is the bigger number itself. It is the same idea as before, just travelling towards the answer from the other direction.",
        "Let us redo an earlier one to see they agree. Total 10, difference 2. Add them: 10 + 2 = 12. Halve it: 12 halved = 6 (the bigger number). Smaller number: 10 take away 6 = 4. Same answer as the tower method, 6 and 4. It is good to know both ways, because seeing a puzzle from two directions helps it stick.",
      ],
      examples: [
        { q: "Two numbers add to 50 and differ by 12. Find both numbers using the shortcut.", steps: ["Add the total and the difference: 50 + 12 = 62.", "Halve it to get the BIGGER number: 62 halved = 31.", "Take that away from the total for the smaller number: 50 take away 31 = 19.", "Check: 31 + 19 = 50 and 31 take away 19 = 12. Both clues fit."], answer: "31 and 19" },
        { q: "Two numbers add to 80 and differ by 24. Use the shortcut to find both.", steps: ["Add total and difference: 80 + 24 = 104.", "Halve for the bigger: 104 ÷ 2 = 52.", "Smaller: 80 - 52 = 28.", "Check: 52 + 28 = 80 and 52 - 28 = 24. ✓"], answer: "52 and 28." },
        { q: "Two numbers add to 150 and differ by 38. Use the shortcut. Show your check.", steps: ["Add: 150 + 38 = 188.", "Halve for the bigger: 188 ÷ 2 = 94.", "Smaller: 150 - 94 = 56.", "Check: 94 + 56 = 150 and 94 - 56 = 38. ✓"], answer: "94 and 56." },
      ],
      tryit: { q: "Two numbers add to 30 and differ by 8. Use the shortcut: add them, halve, then subtract from the total.", answer: "30 + 8 = 38, halved = 19 (bigger). 30 take away 19 = 11 (smaller). Check: 19 + 11 = 30 and 19 take away 11 = 8." },
    },
    {
      h: "5. A different second clue: how many times bigger?",
      body: [
        "Not every second clue is about a difference. Sometimes the clue tells you that one number is a certain number of TIMES the other. For example, 'the big number is 3 times the small number.' That means the big number is the small one added to itself 3 times over, so if the small one were 2 the big one would be 6.",
        "When the clue is a 'times as many' clue, the snapping-off trick does not fit. Instead we use a lovely idea called parts. A part is just one equal chunk that we can count in. We let the smaller number be worth 1 part, and then we describe everything else using that same size of chunk.",
        "Think of party bags. Suppose the little sister gets 1 bag of sweets and the big brother gets 3 bags, all bags the same size. The brother's amount is 3 parts, the sister's is 1 part, and together that is 3 + 1 = 4 parts. If you know how many sweets there are altogether, you can work out what one single bag holds, and then you know everyone's share.",
        "Here it is with numbers. Two numbers total 20, and the big one is 3 times the small one. Small is 1 part, big is 3 parts, so together that is 4 parts. Those 4 equal parts make up the whole total of 20, so 1 part is 20 shared into 4, which is 5. The small number is 5, and the big number is 3 parts, which is 3 times 5 = 15. Check: 5 + 15 = 20 and 15 really is 3 times 5.",
        "The big final step people forget is multiplying back up. Working out that 1 part is 5 is not the finish line if the answer they want is the bigger number. You must remember to multiply: bigger number = 3 parts = 3 times 5 = 15. Always ask yourself, 'have I turned my parts back into the actual numbers?'",
      ],
      examples: [
        { q: "Two numbers add up to 45. One number is 4 times the other. Find both numbers.", steps: ["Let the smaller number be 1 part. The bigger number is 4 times as much, so it is 4 parts.", "Add the parts together: 1 part + 4 parts = 5 parts, and those 5 parts make the total of 45.", "Find one part: 45 shared into 5 equal parts = 9. So the smaller number is 9.", "Multiply back up for the bigger number: 4 parts = 4 times 9 = 36.", "Check: 9 + 36 = 45 and 36 is 4 times 9. Both clues fit."], answer: "9 and 36" },
        { q: "Two numbers total 56. One is 6 times the other. Find both.", steps: ["Small = 1 part, big = 6 parts. Total parts: 1 + 6 = 7.", "One part = 56 ÷ 7 = 8. Small number = 8.", "Big number = 6 × 8 = 48.", "Check: 8 + 48 = 56 and 48 = 6 × 8. ✓"], answer: "8 and 48." },
        { q: "Two numbers total 63. One is 8 times the other. Find both numbers.", steps: ["Small = 1 part, big = 8 parts. Total parts: 1 + 8 = 9.", "One part = 63 ÷ 9 = 7. Small number = 7.", "Big number = 8 × 7 = 56.", "Check: 7 + 56 = 63 and 56 = 8 × 7. ✓"], answer: "7 and 56." },
      ],
      tryit: { q: "Two numbers total 24. One is 3 times the other. Use parts to find both numbers.", answer: "Small = 1 part, big = 3 parts, so 4 parts = 24. One part = 24 shared into 4 = 6 (the smaller). Bigger = 3 times 6 = 18. Check: 6 + 18 = 24 and 18 is 3 times 6." },
    },
    {
      h: "6. Drawing a bar model to see the puzzle",
      body: [
        "A bar model is a simple picture that turns a word puzzle into something you can see with your eyes. You draw a bar, which is just a long rectangle like a chocolate bar, to stand for each number. The longer the bar, the bigger the number. Seeing the shape of a puzzle often makes it obvious which method to reach for.",
        "For a difference clue, draw two bars one on top of the other, lined up at the left end. Make one bar stick out further to the right. That sticking-out bit is the difference, and the whole length of both bars together is the total. Straight away your eye can see the snapping-off trick: cover up the sticking-out bit and the two bars match.",
        "For a 'times as many' clue, draw the smaller number as one short bar, then draw the bigger number as several of those same short bars joined in a row. If the big number is 3 times the small one, its bar is 3 little bars long. Now you can literally count the equal parts in the picture, which is exactly the parts method from the last section.",
        "You do not have to draw a perfect, ruler-straight picture. A quick rough sketch on the corner of your page is enough. The point is not neatness, it is that drawing the relationship helps you decide whether this is a snapping-off puzzle or a counting-parts puzzle before you write a single sum.",
      ],
      tryit: { q: "A puzzle says two numbers have a total of 40 and one is 5 times the other. Would you draw equal little bars, or one bar sticking out past the other? Which method does that point you towards?", answer: "You would draw equal little bars, one short bar for the small number and five of them for the big number. That points you towards the parts method: 6 parts = 40." },
    },
    {
      h: "7. When a puzzle has MANY answers",
      body: [
        "Here is something that surprises a lot of people. Not every two-number puzzle has just one right answer. Some puzzles genuinely have several correct answers, and the question actually wants you to find and list all of them.",
        "This often happens when the second clue is about multiplying to make a total rather than adding. The word 'multiply' means adding a number to itself a set number of times, like 3 multiplied by 4 is 3 added up four times, which is 12. If a puzzle tells you two whole numbers multiply together to make a certain total, there can be more than one pair that works.",
        "Take an example. Which pairs of whole numbers multiply to make 24? Work through them in order so you do not miss any: 1 times 24, then 2 times 12, then 3 times 8, then 4 times 6. That is four different pairs, and every single one is correct. A puzzle like this is not asking for the answer, it is asking for all the answers.",
        "The trick to listing them all without missing one is to be tidy. Start at 1 and work upwards: does 1 go in, does 2 go in, does 3 go in, and so on. Stop when the pairs start repeating themselves the other way round. Being orderly like this is how a good detective makes sure no clue slips past.",
        "So before you dive into any two-number puzzle, pause and ask, 'does this want ONE answer or ALL the answers?' A total-and-difference puzzle or a total-and-times puzzle usually has one neat answer. A multiply-together puzzle often has several. Knowing which kind you are looking at saves you a lot of head-scratching.",
      ],
      examples: [
        { q: "List all the pairs of whole numbers that multiply together to make 12.", steps: ["Start at 1 and work upwards, keeping it tidy. Does 1 work? 1 times 12 = 12. Yes.", "Does 2 work? 2 times 6 = 12. Yes.", "Does 3 work? 3 times 4 = 12. Yes.", "Does 4 work? 4 would need to pair with 3, but we already have 3 and 4, so the pairs are starting to repeat. Stop here.", "So the pairs are 1 and 12, 2 and 6, 3 and 4."], answer: "Three pairs: 1 and 12, 2 and 6, 3 and 4." },
        { q: "List all the pairs of whole numbers that multiply to make 30.", steps: ["Work up from 1. 1 × 30 = 30. ✓", "2 × 15 = 30. ✓", "3 × 10 = 30. ✓", "4: 30 ÷ 4 = 7.5, not a whole number.", "5 × 6 = 30. ✓", "6 would pair with 5, already listed. Stop."], answer: "Four pairs: 1 and 30, 2 and 15, 3 and 10, 5 and 6." },
        { q: "List all pairs of whole numbers that multiply to make 36. (There are more than you might expect — be systematic!)", steps: ["1 × 36 = 36. ✓", "2 × 18 = 36. ✓", "3 × 12 = 36. ✓", "4 × 9 = 36. ✓", "5: 36 ÷ 5 = 7.2, not whole.", "6 × 6 = 36. ✓ (a pair where both numbers are the same)", "7 would pair with something less than 6, already covered. Stop."], answer: "Five pairs: 1 and 36, 2 and 18, 3 and 12, 4 and 9, 6 and 6." },
      ],
      tryit: { q: "List all the pairs of whole numbers that multiply together to make 18.", answer: "Three pairs: 1 and 18, 2 and 9, 3 and 6. Work up in order from 1 and stop when they start repeating." },
    },
  ],
};

PRIMARY_LESSONS.additiveMultiplicative = {
  title: "More Than vs Times As Many: two different ways to compare",
  minutes: 16,
  intro: "Whenever you have two amounts, there are two completely different ways to say how they compare. One way asks 'how many MORE?' and the other asks 'how many TIMES as many?'. They sound similar but they are not the same, and picking the wrong one gives a very wrong answer. In this lesson we will build both ideas up slowly, using sweets, towers of bricks, a number line and pictures, so that by the end you can spot which kind of comparison a question wants and work it out with confidence.",
  sections: [
    {
      h: "1. What does it mean to 'compare' two amounts?",
      body: [
        "To compare two amounts just means to look at them side by side and describe how they are different. That is something you already do all the time without thinking about it.",
        "Imagine you have 3 sweets and your friend has 12 sweets. You can see straight away that your friend has more. But how much more? That is where it gets interesting, because there is more than one honest way to answer.",
        "One way is to say your friend has 9 extra sweets, because if you lined them up your friend's line would stick out by 9. Another way is to say your friend has 4 whole helpings of what you have, because 3 sweets fits into 12 sweets four times over. Both sentences are true about the very same pair of numbers.",
        "The first way (the 9 extra) is called an additive comparison. The word additive comes from adding and taking away, and it is all about the gap between the two amounts. The second way (4 whole helpings) is called a multiplicative comparison. That word comes from multiplying, and it is all about how many times one amount fits into the other. Do not worry about remembering those long words yet. We will meet each idea properly, one at a time.",
      ],
      tryit: { q: "You have 2 stickers and your friend has 10. Can you think of one sentence that says how much MORE your friend has, and a different sentence that says how many TIMES as many they have?", answer: "Your friend has 8 more stickers (that is the gap). Your friend also has 5 times as many, because 2 fits into 10 five times. Both sentences are correct." },
    },
    {
      h: "2. The 'how many more' comparison (the gap)",
      body: [
        "Let us slow right down and look at the first way of comparing: how many more. This is all about the gap between the two amounts, meaning the extra bit that one has over the other.",
        "Picture two towers built from bricks. One tower is made of 8 bricks and a taller tower is made of 11 bricks. If you stand them next to each other, the tall tower pokes above the short one. How much does it poke out by? Exactly 3 bricks, because 11 and 8 differ by 3. That poking-out bit is the gap.",
        "To find the gap you take away the smaller amount from the bigger amount. Taking away is the same as subtracting. So the gap between 11 and 8 is 11 take away 8, which is 3. We write that as 11 - 8 = 3.",
        "Here is another way to picture it, using a number line. A number line is just a straight line with the numbers marked along it in order, like a ruler. Put your finger on 8, then count the hops you make to get up to 11. Hop to 9, hop to 10, hop to 11. That is 3 hops, so the gap is 3. Counting the hops on a number line and doing the subtraction 11 - 8 always give you the same answer, because they are the same idea seen in two ways.",
        "When you have found the gap you can describe it in words. You would say the tall tower has 3 more bricks than the short one. The little words 'more than' are your clue that someone is talking about the gap.",
      ],
      examples: [
        {
          q: "A shop sold 8 umbrellas on Monday and 35 umbrellas on Tuesday. How many more umbrellas did it sell on Tuesday?",
          steps: [
            "We want the gap between the two days, so we take the smaller amount away from the bigger amount.",
            "The bigger amount is 35 (Tuesday) and the smaller is 8 (Monday).",
            "Work out 35 - 8. Take 8 away from 35 to get 27.",
          ],
          answer: "27 more umbrellas on Tuesday. (You could picture starting at 8 on a number line and hopping up to 35, which is 27 hops.)",
        },
        { q: "A park has 7 ducks and 52 geese. How many more geese than ducks are there?", steps: ["The clue words 'how many more' mean we want the gap.", "Subtract the smaller from the larger: 52 - 7 = 45."], answer: "45 more geese than ducks." },
        { q: "A jug contained 750 ml of water at the start of the day. By the evening only 285 ml remained. How much more water was there at the start than at the end?", steps: ["'How much more' means gap. Subtract the smaller from the larger.", "750 - 285: take 285 from 750.", "750 - 200 = 550, then 550 - 85 = 465."], answer: "465 ml more at the start." },
      ],
      tryit: { q: "One class has 24 pupils and another class has 31 pupils. How many more pupils does the second class have?", answer: "7 more, because 31 - 24 = 7. The second class is 7 pupils bigger than the first." },
    },
    {
      h: "3. The 'how many times as many' comparison (the helpings)",
      body: [
        "Now for the second way of comparing: how many times as many. Instead of asking about the gap, this one asks how many whole helpings of the small amount you would need to build up to the big amount.",
        "Back to sweets. Suppose you have 3 sweets and your big sister has 12. Scoop up your 3 sweets as one little helping. Now ask, how many helpings like that would it take to make your sister's pile? One helping is 3, two helpings is 6, three helpings is 9, four helpings is 12. It takes 4 helpings. So your sister has 4 times as many sweets as you.",
        "Counting helpings like that is exactly what dividing means. Dividing asks how many times one number fits inside another. So instead of counting the helpings by hand you can work out 12 divided by 3, which is 4. We write that as 12 divided by 3 = 4.",
        "Here is a picture that helps. Draw your sister's 12 sweets as a neat grid with 4 rows and 3 sweets in each row. Each row is one helping of 3, and there are 4 rows, so 12 is 4 lots of 3. Seeing the grid makes it obvious that 3 fits into 12 exactly 4 times.",
        "When you describe this kind of comparison you use the words 'times as many'. You would say your sister has 4 times as many sweets as you. Those words 'times as many' are your clue that someone is asking about helpings, not about the gap.",
      ],
      examples: [
        {
          q: "A small cafe had 5 customers on its first day and 40 customers a year later. How many times as many customers does it have now?",
          steps: [
            "We want to know how many helpings of 5 it takes to reach 40, so we divide the bigger amount by the smaller amount.",
            "The bigger amount is 40 and the smaller is 5.",
            "Work out 40 divided by 5. Count in fives: 5, 10, 15, 20, 25, 30, 35, 40. That is 8 counts.",
          ],
          answer: "8 times as many customers. (Forty is exactly 8 lots of 5.)",
        },
        { q: "A young tree was 4m tall ten years ago and is now 28m tall. How many times as tall is it now?", steps: ["'How many times as tall' is a helpings question, so we divide.", "28 ÷ 4 = 7."], answer: "7 times as tall." },
        { q: "A library had 6 books in its first week and 198 books a year later. How many times as many books does it have now?", steps: ["Helpings question: divide the bigger by the smaller.", "198 ÷ 6: think 6 × 30 = 180, then 6 × 3 = 18, so 6 × 33 = 198."], answer: "33 times as many books." },
      ],
      tryit: { q: "A garden had 6 sunflowers last summer and 30 sunflowers this summer. How many times as many sunflowers are there this summer?", answer: "5 times as many, because 30 divided by 6 = 5. Six fits into thirty five times." },
    },
    {
      h: "4. The same two numbers, two different answers",
      body: [
        "This is the part that surprises most people, so read it gently and let it sink in. The very same pair of numbers can give two completely different-sounding answers, and both are correct, because they are answering two different questions.",
        "Take our umbrella shop again: 8 on Monday and 35 on Tuesday. If someone asks how many more, we find the gap: 35 - 8 = 27, so 27 more. If someone asks how many times as many, we count helpings by dividing: 35 divided by 8, which does not land on a whole number but is a bit more than 4 (because 8 times 4 is 32, which is nearly 35). So Tuesday sold a bit more than 4 times as many.",
        "Look how different those two true answers sound. One says '27 more' and the other says 'a bit more than 4 times as many'. Neither one is wrong. They are simply the answers to two different questions about the same pair of numbers.",
        "The lesson to carry away is this: before you reach for a subtraction or a division, stop and ask yourself which question is really being asked. Is it about the gap, or about the helpings?",
      ],
      tryit: { q: "You have 4 marbles and your friend has 12. Work out BOTH comparisons: how many more does your friend have, and how many times as many?", answer: "How many more: 12 - 4 = 8, so 8 more. How many times as many: 12 divided by 4 = 3, so 3 times as many. Same two numbers, two different true answers." },
    },
    {
      h: "5. How to tell which comparison a question wants",
      body: [
        "Since the two comparisons give different answers, the big skill is reading a question carefully to spot which one it wants. Luckily the words themselves usually tell you.",
        "If you see the words 'more than', 'fewer than', 'how many extra' or 'the difference between', the question is about the gap. That means you subtract the smaller amount from the bigger one.",
        "If you see the words 'times as many', 'times as much', 'times bigger' or 'how many times', the question is about helpings. That means you divide the bigger amount by the smaller one.",
        "A handy trick is to underline those clue words before you do any working out. Underlining forces your eyes to slow down and notice whether the question said 'more' or 'times', which is exactly the thing that decides everything.",
      ],
      examples: [
        {
          q: "Read this carefully. 'A library has 9 puzzle books and 45 story books. How many times as many story books are there?' Which method do we use, and what is the answer?",
          steps: [
            "Underline the clue words. The question says 'how many times as many', so this is a helpings question.",
            "Helpings means divide the bigger amount by the smaller amount.",
            "The bigger amount is 45 (story books) and the smaller is 9 (puzzle books).",
            "Work out 45 divided by 9. Count in nines: 9, 18, 27, 36, 45. That is 5 counts.",
          ],
          answer: "5 times as many story books. (If the question had asked 'how many more', we would instead have done 45 - 9 = 36.)",
        },
        { q: "A bag holds 7 red counters and 56 blue counters. 'How many times as many blue counters are there as red?' Which method, and what is the answer?", steps: ["Clue words: 'how many times as many' → helpings question → divide.", "56 ÷ 7 = 8."], answer: "8 times as many blue counters. (The gap would be 56 - 7 = 49 more, a very different answer to a different question.)" },
        { q: "A festival had 8 acts on Saturday. Across the whole weekend there were 200 acts. One pupil answered 192. Which comparison did they make? What is the correct 'how many times as many' answer?", steps: ["192 = 200 - 8, so the pupil found the gap. That answers 'how many more', not 'how many times'.", "For 'how many times as many', divide: 200 ÷ 8 = 25.", "Sense-check: 8 × 25 = 200. ✓"], answer: "The pupil found the gap (additive). The correct 'times as many' answer is 25." },
      ],
      tryit: { q: "'There are 6 red apples and 24 green apples. How many more green apples are there?' Which clue words tell you what to do, and what is the answer?", answer: "The words 'how many more' mean it is a gap question, so we subtract: 24 - 6 = 18 more green apples." },
    },
    {
      h: "6. Watch out: clues that build one amount FROM another",
      body: [
        "Sometimes a question does not give you both amounts. Instead it gives you one amount and a clue about how to build the second amount from it. These clues also come in the two flavours, additive and multiplicative, so you have to read them just as carefully.",
        "An additive clue tells you to add on a gap. For example, 'Sam has 3 more sweets than Alex.' If you know Alex has 6 sweets, you build Sam's pile by adding the gap: 6 + 3 = 9. Sam has 9 sweets. Picture starting at Alex's 6 on a number line and hopping 3 steps to the right.",
        "A multiplicative clue tells you to make helpings. For example, 'Sam has 3 times as many sweets as Alex.' If Alex has 6 sweets, you build Sam's pile by making 3 helpings of Alex's amount: 6 times 3 = 18. Sam has 18 sweets. Picture laying out 3 rows of 6.",
        "Notice how close those two sentences look. One says '3 more than' and the other says '3 times as many as', yet they lead to 9 and 18, which are very different. The tiny words 'more' and 'times' are doing all the work, so they are worth slowing down for every single time.",
      ],
      examples: [
        {
          q: "Alex has 7 stickers. Priya has 4 times as many stickers as Alex. How many stickers does Priya have?",
          steps: [
            "Spot the clue words. It says '4 times as many', so this is a multiplicative clue and we make helpings.",
            "Making 4 helpings of Alex's amount means multiplying: 7 times 4.",
            "Work out 7 times 4. Four sevens are 28.",
          ],
          answer: "28 stickers. (Careful: if it had said '4 more' instead of '4 times as many', the answer would have been 7 + 4 = 11.)",
        },
        { q: "Mia has 9 pencils. Her sister has 3 times as many pencils as Mia. How many pencils does her sister have?", steps: ["Clue: '3 times as many' → multiplicative → multiply.", "9 × 3 = 27."], answer: "27 pencils." },
        { q: "Sam has 8 sweets. Leo has 4 more than Sam. Asha has 3 times as many as Leo. How many sweets does Asha have?", steps: ["Find Leo first. 'More than' is additive: Leo = 8 + 4 = 12.", "Find Asha. '3 times as many' is multiplicative: Asha = 12 × 3 = 36."], answer: "Asha has 36 sweets." },
      ],
      tryit: { q: "Ben has 5 conkers. Mia has 6 more conkers than Ben. How many conkers does Mia have?", answer: "11 conkers, because 'more' is an additive clue, so we add the gap: 5 + 6 = 11. (If it had said 6 times as many, Mia would have 30.)" },
    },
    {
      h: "7. Which comparison tells the better story?",
      body: [
        "Both comparisons are always correct, but sometimes one of them paints a much clearer picture than the other. Knowing which to reach for is a lovely skill to have.",
        "When two amounts are close in size, the gap usually tells the clearer story. If a football team scored 11 goals one season and 14 the next, saying '3 more goals' feels natural and easy to picture. Saying 'about 1.3 times as many' is true but a bit fiddly and not very helpful.",
        "When one amount is many, many times bigger than the other, the helpings usually tell the clearer story. Imagine a tiny business that grew from 5 customers to 40,000 customers. You could say it has 39,995 more customers, which is true, but that huge number does not really capture how amazing the growth was. Saying it now has 8,000 times as many customers (because 40,000 divided by 5 is 8,000) tells the story far better.",
        "So the gap is friendliest for amounts that are close together, and the helpings are friendliest for amounts that are wildly far apart. When you get to choose, pick the one that makes the situation easiest to imagine.",
      ],
      tryit: { q: "A village had 2 shops in the old days and now has 50 shops. Would 'how many more' or 'how many times as many' give a more striking picture of the change, and what is that number?", answer: "'How many times as many' is more striking here because the amounts are so far apart: 50 divided by 2 = 25 times as many. (The gap of 48 more is true too, but the 25 times figure captures the change better.)" },
    },
    {
      h: "8. Putting it all together",
      body: [
        "Let us gather up everything into one simple plan you can use on any comparison question.",
        "First, read the question and hunt for the clue words. 'More than', 'fewer than', 'the difference' and 'how many extra' all point to the gap. 'Times as many', 'times as much' and 'how many times' all point to helpings.",
        "Second, if it is a gap question, subtract the smaller amount from the bigger amount. If it is a helpings question, divide the bigger amount by the smaller amount. And if the question is building one amount from another, add the gap for a 'more' clue or multiply into helpings for a 'times' clue.",
        "Third, glance at your answer and ask if it makes sense. A gap answer should be smaller than the big number you started with. A helpings answer tells you how many copies fit in, so if the two amounts are close it should be a small number like 2 or 3, and if they are far apart it can be large. If something looks upside down, check that you divided the big number by the small one and not the other way round.",
        "That is the whole idea. Two honest ways to compare, each with its own clue words and its own method, and a quick sense-check at the end. Practise spotting the clue words and you will never mix them up again.",
      ],
      examples: [
        {
          q: "A zoo has 3 elephants and 12 penguins. Question A: how many more penguins than elephants? Question B: how many times as many penguins as elephants?",
          steps: [
            "Question A says 'how many more', so it is a gap question. Subtract the smaller from the bigger: 12 - 3 = 9.",
            "Question B says 'how many times as many', so it is a helpings question. Divide the bigger by the smaller: 12 divided by 3 = 4.",
            "Sense-check: the gap of 9 is smaller than 12, which fits. The helpings answer of 4 means 3 penguins fits into 12 penguins four times, which is right.",
          ],
          answer: "Question A: 9 more penguins. Question B: 4 times as many penguins. Same two numbers, two different questions, two different correct answers.",
        },
        { q: "A farm has 6 cows and 42 chickens. Work out both comparisons: how many more chickens than cows, and how many times as many chickens as cows?", steps: ["Gap: 42 - 6 = 36 more chickens.", "Helpings: 42 ÷ 6 = 7 times as many chickens."], answer: "36 more chickens; 7 times as many chickens." },
        { q: "A bookshop has 15 cookery books and 90 children's books. It also has 9 science books and 72 history books. For which pair is the 'how many times as many' answer larger? Show your working.", steps: ["Cookery vs children's: 90 ÷ 15 = 6 times as many children's books.", "Science vs history: 72 ÷ 9 = 8 times as many history books.", "Compare: 8 > 6, so the science-and-history pair gives the larger 'times as many' answer."], answer: "The science and history pair: 72 ÷ 9 = 8 times as many." },
      ],
      tryit: { q: "A bakery made 10 loaves on a quiet day and 40 loaves on a busy day. Answer both: how many more loaves on the busy day, and how many times as many?", answer: "How many more: 40 - 10 = 30 more loaves. How many times as many: 40 divided by 10 = 4 times as many. Well done for doing both." },
    },
  ],
};

PRIMARY_LESSONS.areaPerimeter = {
  title: "Area & Perimeter: the edge round the outside and the space inside",
  minutes: 18,
  intro: "Every flat shape has two totally different things you can measure about it. One is how far it is all the way round the outside edge. The other is how much flat space it covers on the inside. These two things are not the same, and they are not even measured in the same sort of number. This lesson builds both ideas up slowly, from the very beginning, so take your time and picture each one in your head as you go.",
  sections: [
    {
      h: "1. Perimeter means the distance all the way round the outside",
      body: [
        "Let's start with a picture. Imagine a garden shaped like a rectangle. A rectangle is a flat shape with four straight sides and four square corners, like a door or a piece of paper. Now imagine you want to build a fence right along the edge of that garden, all the way round, so nothing can get in.",
        "The total length of fence you need is called the perimeter. Perimeter is a special maths word, so here is what it means in plain language: the perimeter is the distance all the way round the outside edge of a shape, from where you start, round every side, and back to where you began.",
        "Another way to picture it: imagine a tiny ant walking round the very edge of the garden. It starts at one corner, walks along one side, turns the corner, walks the next side, and keeps going until it arrives back where it started. The whole distance that ant walked is the perimeter.",
        "So perimeter is really just a walk round the edge. If you can add up the length of every side, you have the perimeter. Nothing fancier than that.",
      ],
      note: "Perimeter lives on the OUTSIDE. Think of a fence round a field, not the grass inside it.",
      tryit: { q: "In your own words, what is the perimeter of a shape?", answer: "It is the total distance all the way round the outside edge of the shape (the length of a fence that would go all the way round)." },
    },
    {
      h: "2. Finding the perimeter by adding up every side",
      body: [
        "The safest way to find any perimeter is to walk round the shape in your head and add up each side as you pass it. Let's do a square. A square is a rectangle where all four sides are exactly the same length.",
        "Picture a square tile with each side 5cm long. (cm is short for centimetre, a small unit of length. Your little fingernail is roughly 1cm across.) Now walk round it like the ant: 5cm along the top, then 5cm down the right, then 5cm along the bottom, then 5cm up the left. Add them up: 5 + 5 + 5 + 5 = 20cm. The perimeter is 20cm.",
        "Now a rectangle that is not a square, say 8cm long and 3cm wide. Walk round it: the top is 8cm, the right side is 3cm, the bottom is 8cm, the left side is 3cm. Add them all: 8 + 3 + 8 + 3 = 22cm.",
        "Notice something helpful. A rectangle has two long sides that match and two short sides that match. So instead of adding four numbers you can add one long and one short, then double it. For the 8 by 3 rectangle: 8 + 3 = 11, then 11 + 11 = 22cm. Same answer, a little quicker.",
        "Written as a rule, the perimeter of a rectangle is 2 x (length + width). The little cross x here means multiply, which is a fast way of adding the same amount more than once. So 2 x 11 just means 11 + 11.",
      ],
      note: "A rectangle has FOUR sides, so a perimeter needs FOUR sides added. Adding only two (just the length and the width once) is the most common slip of all.",
      examples: [
        { q: "What is the perimeter of a rectangle 8cm long and 5cm wide?", steps: ["Walk round and list all four sides: 8cm, 5cm, 8cm, 5cm.", "Add one long and one short first: 8 + 5 = 13.", "There are two of each, so double it: 13 + 13 = 26, which is the same as 2 x 13.", "So the perimeter is 26cm."], answer: "26cm" },
        { q: "A rectangular garden is 13m long and 7m wide. What is its perimeter?", steps: ["Add length and width: 13 + 7 = 20m.", "Double it for all four sides: 20 × 2 = 40m."], answer: "40m" },
        { q: "A rectangle has a perimeter of 38cm and a length of 12cm. What is its width?", steps: ["Perimeter = 2 × (length + width), so 2 × (12 + width) = 38.", "Halve the perimeter: 38 ÷ 2 = 19. So length + width = 19.", "Width = 19 - 12 = 7cm.", "Check: 2 × (12 + 7) = 2 × 19 = 38cm. ✓"], answer: "7cm" },
      ],
      tryit: { q: "A square has sides of 6cm each. What is its perimeter?", answer: "24cm, because 6 + 6 + 6 + 6 = 24 (or 4 lots of 6)." },
    },
    {
      h: "3. Area means how much flat space is inside",
      body: [
        "Now for the second thing we can measure, and it is completely different. Forget the fence for a moment. Think instead about the grass inside the garden, or the amount of paper on a page, or how much carpet you would need to cover a floor. That amount of flat space inside a shape is called the area.",
        "Here is the plain meaning of the word: the area of a shape is how much flat space it covers on the inside. Perimeter was about the edge. Area is about the middle, the space that is filled up.",
        "The best way to picture area is to imagine covering the shape with lots of little identical squares, like floor tiles, with no gaps and no overlaps. The number of tiles it takes to cover the whole shape is its area. More tiles means more space, so more area.",
        "Picture a chocolate bar that is split into little squares. If the whole bar is made of 12 squares of chocolate, then its area is 12 squares. You did not measure the edge, you counted how many squares fill it up. That is area.",
      ],
      note: "Perimeter is the fence round the field. Area is the grass inside it. Two different jobs.",
      tryit: { q: "A shape is completely covered by 9 identical square tiles with no gaps. What is its area, counted in tiles?", answer: "9 tiles (area is just how many squares it takes to fill the shape)." },
    },
    {
      h: "4. Finding area by counting rows of squares",
      body: [
        "Counting tiles one at a time works, but there is a lovely pattern that makes it much faster, and it is worth seeing for yourself. Imagine a rectangle covered in little 1cm squares, laid out in neat rows and columns like a chessboard.",
        "Say the rectangle is 4cm long and 3cm wide. Along the top there is room for 4 squares in a row. And because the shape is 3cm tall, there are 3 of those rows stacked up.",
        "So you have 3 rows, and each row holds 4 squares. Instead of counting all of them one by one, you can add 4 + 4 + 4 = 12, or say it the quick way, 3 lots of 4, which is 3 x 4 = 12. There are 12 little squares, so the area is 12 square centimetres.",
        "That is the shortcut for any rectangle: area = length x width. You are really just working out how many squares fit in one row (the length) and how many rows there are (the width), then multiplying to count them all at once.",
        "A quick real-world check on this idea: think of a box of eggs with 6 eggs along the front and 2 rows deep. You do not count every egg, you just do 6 x 2 = 12. Area of a rectangle works in exactly the same way.",
      ],
      examples: [
        { q: "What is the area of a rectangle 12m long and 4m wide? (m means metre, a much bigger unit of length, about the height of a door handle from the floor.)", steps: ["Picture the shape filled with square tiles. One row along the length holds 12 squares.", "The shape is 4 wide, so there are 4 of those rows.", "Multiply to count them all: 12 x 4 = 48 squares.", "So the area is 48 square metres."], answer: "48 square metres" },
        { q: "What is the area of a rectangle 15cm long and 9cm wide?", steps: ["One row holds 15 squares. There are 9 rows.", "Multiply: 15 × 9 = 135."], answer: "135cm²" },
        { q: "A rectangle has an area of 60cm² and one side is 5cm long. What is the length of the other side?", steps: ["Area = length × width, so 5 × width = 60.", "Divide: 60 ÷ 5 = 12.", "The other side is 12cm.", "Check: 5 × 12 = 60cm². ✓"], answer: "12cm" },
      ],
      tryit: { q: "What is the area of a rectangle 7cm long and 2cm wide?", answer: "14 square centimetres, because 7 x 2 = 14 (2 rows of 7 squares)." },
    },
    {
      h: "5. Why area uses 'square' units and perimeter does not",
      body: [
        "This part trips up a lot of people, so let's go slowly. When you measure perimeter you are measuring a plain distance, like the length of a piece of string laid round the edge. Distance is measured in plain units like centimetres (cm) or metres (m).",
        "But area is not a distance. It is a count of little squares. Each of those squares is 1cm along and 1cm up, and we call one of them a square centimetre. We write square centimetre in a short way as cm with a tiny 2 after it, like this: cm². The tiny 2 is just a reminder that the square has two directions, across and up.",
        "So a perimeter answer ends in cm or m (plain units), and an area answer ends in cm² or m² (square units). If you ever write an area with plain cm, or a perimeter with cm², something has gone wrong.",
        "A good way to remember which is which: perimeter is a walk in one direction round the edge, so one measurement, plain units. Area covers a flat space that goes across AND up, so two directions, square units.",
      ],
      note: "Perimeter answers end in cm or m. Area answers end in cm² or m². Always double-check your unit matches the job.",
      tryit: { q: "Someone says a floor has an area of '20cm'. What is wrong with that?", answer: "Area must be in square units, so it should be 20cm² (or square metres). Plain cm is a unit for perimeter or length, not area." },
    },
    {
      h: "6. A shape can have the same amount round the outside but very different space inside",
      body: [
        "Here comes a surprise that catches out even grown-ups. It feels like a shape with a big edge should have lots of space inside, and a shape with a small edge should have little space inside. That is not true. Perimeter and area are not tied together.",
        "Let's see it with two shapes. First, a very long thin rectangle, 1cm wide and 20cm long, like a strip of ribbon. Its perimeter is 1 + 20 + 1 + 20 = 42cm, which is a big edge. But its area is only 1 x 20 = 20cm², because it is so thin that hardly any squares fit inside.",
        "Now a chunky square, 10cm by 10cm. Its perimeter is 10 + 10 + 10 + 10 = 40cm, which is actually a bit SMALLER than the ribbon's 42cm. But its area is 10 x 10 = 100cm², which is five times bigger than the ribbon's 20cm².",
        "So the square has a smaller edge yet far more space inside. The lesson is simple: knowing the perimeter does not tell you the area, and knowing the area does not tell you the perimeter. You have to work each one out on its own.",
        "Here is a way to feel why. Imagine the same fence bent into two different shapes. Stretched into a long skinny rectangle it traps almost nothing inside. Squashed into a fat square it traps loads of space. Same fence, same perimeter, very different area.",
      ],
      note: "Bigger perimeter does NOT mean bigger area. Never guess one from the other, always work each out separately.",
      examples: [
        { q: "Rectangle A is 2cm by 9cm. Rectangle B is 5cm by 6cm. Which has the bigger perimeter, and which has the bigger area?", steps: ["Perimeter of A: 2 + 9 + 2 + 9 = 22cm.", "Perimeter of B: 5 + 6 + 5 + 6 = 22cm. So the perimeters are equal, both 22cm.", "Area of A: 2 x 9 = 18cm².", "Area of B: 5 x 6 = 30cm².", "Same perimeter, but B covers much more space inside."], answer: "Perimeters are equal (22cm each), but B has the bigger area (30cm² against 18cm²)." },
        { q: "Rectangle C is 3cm by 8cm and Rectangle D is 4cm by 6cm. Which has the bigger area, and which has the bigger perimeter?", steps: ["Area of C: 3 × 8 = 24cm². Area of D: 4 × 6 = 24cm². Equal areas.", "Perimeter of C: 2 × (3+8) = 2 × 11 = 22cm. Perimeter of D: 2 × (4+6) = 2 × 10 = 20cm."], answer: "Equal areas (24cm² each), but D has the smaller perimeter (20cm vs 22cm)." },
        { q: "Find a rectangle with area exactly 36cm² that has the smallest possible perimeter. Try a few options and compare.", steps: ["Try 1 × 36: perimeter = 2(1+36) = 74cm.", "Try 2 × 18: perimeter = 2(2+18) = 40cm.", "Try 3 × 12: perimeter = 2(3+12) = 30cm.", "Try 4 × 9: perimeter = 2(4+9) = 26cm.", "Try 6 × 6: perimeter = 2(6+6) = 24cm. This is the smallest because the square is the most compact shape."], answer: "A 6cm × 6cm square gives area 36cm² with the smallest perimeter of 24cm." },
      ],
      tryit: { q: "True or false: if one rectangle has a longer perimeter than another, it must also have a bigger area.", answer: "False. A long thin shape can have a big perimeter but a small area, so you cannot tell one from the other." },
    },
    {
      h: "7. L-shapes made from two rectangles",
      body: [
        "Sometimes a shape is not a plain rectangle but looks like the letter L, as if someone took a rectangle and cut a smaller rectangle out of one corner. These are called compound shapes, which just means shapes built from more than one rectangle joined together.",
        "The trick with area is to break the L back into simple rectangles. Work out the area of the big rectangle it started as, then take away the area of the little rectangular piece that was cut out. Take away, not add, because that corner is now empty space, not covered space.",
        "Picture a 10cm by 8cm rectangle. Its area is 10 x 8 = 80cm². Now cut a small 3cm by 2cm rectangle out of one corner. The cut-out piece has area 3 x 2 = 6cm². So the space still covered is 80 take away 6, which is 80 - 6 = 74cm². That is the area of the L-shape.",
        "The perimeter of an L-shape is best found the safe way: walk right round the outside edge, listing every straight side as you pass it, and add them all up. Do not try to guess it, because L-shapes have more than four sides and it is easy to miss one.",
      ],
      note: "For an L-shape's area, split it into rectangles: find the big area, then TAKE AWAY the cut-out piece. For its perimeter, walk right round and add every side.",
      examples: [
        { q: "An L-shape is made from a 6cm by 4cm rectangle with a 2cm by 2cm square cut out of one corner. What is its area?", steps: ["Area of the whole rectangle before cutting: 6 x 4 = 24cm².", "Area of the square cut out of the corner: 2 x 2 = 4cm².", "The corner is now empty, so take it away: 24 - 4 = 20cm².", "So the L-shape covers 20cm²."], answer: "20cm²" },
        { q: "An L-shape is made from an 8cm by 5cm rectangle with a 3cm by 2cm rectangle cut from one corner. Find its area and perimeter.", steps: ["Area: whole rectangle = 8 × 5 = 40cm². Cut-out = 3 × 2 = 6cm². Area of L = 40 - 6 = 34cm².", "Perimeter: walk round the outside, starting at bottom-left. The six sides are 8, 5, 3, 2, 5, 3. Total = 8+5+3+2+5+3 = 26cm.", "Alternatively, notice 26 = 2×(8+5) = 26cm — cutting a corner leaves the perimeter unchanged."], answer: "Area = 34cm². Perimeter = 26cm." },
        { q: "A 9cm × 6cm rectangle has a 4cm × 3cm corner cut out to form an L-shape. Find its area. Then explain, without measuring, why the perimeter must be 2 × (9+6) = 30cm.", steps: ["Area = (9 × 6) - (4 × 3) = 54 - 12 = 42cm².", "For the perimeter: cutting a rectangular corner replaces one straight edge with two new edges of the same lengths (the cut's width and height). The total path round the outside stays the same as for the original rectangle.", "So perimeter = 2 × (9+6) = 30cm without measuring each of the six sides individually."], answer: "Area = 42cm². Perimeter = 30cm, because removing a rectangular corner does not change the total perimeter." },
      ],
      tryit: { q: "A 5cm by 5cm square has a 1cm by 1cm corner cut out. What area is left?", answer: "24cm², because the whole square is 5 x 5 = 25cm² and the cut-out is 1 x 1 = 1cm², so 25 - 1 = 24cm²." },
    },
    {
      h: "8. Putting it all together",
      body: [
        "Let's gather up everything in one place. Perimeter is the distance all the way round the outside edge, like a fence. You find it by adding up every side, and the answer is in plain units like cm or m.",
        "Area is the amount of flat space inside, like the grass or the carpet. You find a rectangle's area with length x width, which counts how many little squares fill the shape, and the answer is in square units like cm² or m².",
        "The two are not linked, so a big edge does not promise a big inside, and you always work out each one for itself. And for an L-shape, split it into rectangles for the area (adding or taking away pieces), and walk right round the outside for the perimeter.",
        "If you only remember one thing, remember this pair of pictures: perimeter is the fence, area is the field. Whenever a question gives you a shape, first decide which of the two it is asking for, and everything else follows from there.",
      ],
      tryit: { q: "A rectangle is 9cm long and 4cm wide. Work out BOTH its perimeter and its area, with the right units for each.", answer: "Perimeter = 9 + 4 + 9 + 4 = 26cm. Area = 9 x 4 = 36cm². Notice the perimeter is in cm and the area is in cm²." },
    },
  ],
};

PRIMARY_LESSONS.unitConversion = {
  title: "Units & Measures: converting by a fixed factor",
  minutes: 18,
  intro: "Have you ever said something was two hands long, and then your friend measured it with their hands and got a different answer? That is exactly why we need units. A unit is just an agreed size that everyone uses, like a centimetre or a gram, so that a measurement means the same thing to everybody. In this lesson we will slowly learn how to swap a measurement from one unit into another, for example from metres into centimetres. It always comes down to one simple idea, and we will build that idea up gently, one step at a time.",
  sections: [
    {
      h: "1. What a unit is, and why we swap between them",
      body: [
        "A measurement is really two things stuck together: a number and a unit. When we say a pencil is 15 centimetres long, the 15 is the number and the centimetre is the unit. The number on its own means nothing until you know the unit. 15 what? 15 elephants? 15 grains of rice? The unit tells you the size of each step you counted.",
        "A unit is a fixed, agreed size that never changes. A centimetre is the same size in your house as it is in your school as it is on the other side of the world. That is the whole point of units: so everyone measures the same thing the same way.",
        "Sometimes the unit we have is not the unit we want. A running race might be measured in metres, but a long car journey is easier to talk about in kilometres. Converting means keeping the same real amount but writing it with a different unit. The pencil does not get longer or shorter when we change from centimetres to millimetres. Only the number and the word change, not the actual thing.",
        "Think of it like money. Fifty pence and half a pound are the exact same amount of money, just said two different ways. Converting units works in that same friendly way.",
      ],
      note: "Converting never changes the real amount. The object stays exactly the same size. Only the number and the unit word change to describe it.",
      tryit: { q: "A ribbon is 20cm long. If we write its length in millimetres instead, does the ribbon get longer, get shorter, or stay exactly the same?", answer: "It stays exactly the same. Only the number and the unit change, never the real ribbon." },
    },
    {
      h: "2. Units come in families, joined by a fixed factor",
      body: [
        "Units that measure the same kind of thing come in families. All the length units (millimetre, centimetre, metre, kilometre) belong to the length family. All the weight units (gram, kilogram) belong to the weight family. You can only convert between units in the same family, because a metre and a gram measure totally different things.",
        "Inside a family, each unit is joined to its neighbour by a fixed factor. A factor is just the number you multiply or divide by. Most of the time this factor is 10, 100 or 1000, which is lovely because those are the easiest numbers of all to multiply and divide by.",
        "Here are the key facts to keep close. For length: 1cm = 10mm, 1m = 100cm, 1km = 1000m. For weight: 1kg = 1000g. For liquid: 1 litre = 1000ml (ml means millilitre, a tiny amount, about a fifth of a teaspoon). For money: £1 = 100p.",
        "You do not need to memorise all of these this second. Learn them slowly over the week. To start, notice the shape of each fact: it says how many of the small unit fit inside one of the big unit. One metre is a big step, and it takes 100 little centimetre steps to cover the same distance.",
      ],
      note: "The factor between units is almost always 10, 100 or 1000. If you ever find yourself multiplying by 7 or 12 to convert, stop, something has gone wrong.",
      tryit: { q: "How many millilitres are there in 1 litre?", answer: "1000ml. That is the fixed fact for the liquid family." },
    },
    {
      h: "3. Bigger unit, smaller unit: which is which?",
      body: [
        "Before we convert anything, we need to feel the difference between a big unit and a small unit. A big unit measures in big steps. A small unit measures in little steps. A metre is a big step (about the width of a doorway). A centimetre is a little step (about the width of your fingernail).",
        "Here is the key picture. Imagine measuring a table that is one metre wide. If you measure it in metres, you count just 1 step. If you measure the very same table in centimetres, you have to count 100 little steps to cross it. Same table, but a small unit needs MORE steps and a big unit needs FEWER steps.",
        "Another way to see it: think of sharing out a chocolate bar. One whole bar is like the big unit. If you snap it into 100 tiny squares, each square is like the small unit. You still have the same chocolate, but now you are holding a bigger number of pieces.",
        "So remember this feeling before we do any sums. Smaller unit, more of them. Bigger unit, fewer of them. For the same real amount, the small unit always gives the larger number.",
      ],
      tryit: { q: "Which will be a bigger number: the height of a door measured in metres, or the same door measured in centimetres?", answer: "In centimetres. Centimetres are the smaller unit, so it takes more of them, giving a bigger number (a 2m door is 200cm)." },
    },
    {
      h: "4. Going from a big unit to a small unit: multiply",
      body: [
        "Now for the first real conversion. When you swap a big unit for a small unit, you MULTIPLY by the factor. Why multiply? Because you are breaking each big step into lots of little steps, so the number gets bigger, and multiplying makes numbers bigger.",
        "Let us do 3 metres into centimetres. Metre is the big unit, centimetre is the small unit, so we multiply. The factor is 100 (because 1m = 100cm). So 3 × 100 = 300. Three metres is 300 centimetres. Picture it: each metre becomes 100 centimetres, and we have 3 of them, so 100 + 100 + 100 = 300.",
        "A neat trick for multiplying by 10, 100 or 1000: the digits do not change, they just slide to the left and you fill the gap with zeros. Multiply by 10, add one zero. Multiply by 100, add two zeros. Multiply by 1000, add three zeros. So 7 × 1000 = 7000, easy as that.",
        "One gentle warning. When there is a decimal point, the zeros trick needs care. For 3.5km into metres we multiply by 1000, and 3.5 × 1000 = 3500. The point moves three places to the right, it does not just gain three zeros on the end.",
      ],
      note: "Big to small, the number grows, so multiply. If your answer came out smaller than you started with, you multiplied the wrong way.",
      examples: [
        { q: "Convert 4 kilograms into grams.", steps: ["Kilogram is the big unit, gram is the small unit, so we multiply.", "The factor is 1000, because 1kg = 1000g.", "4 × 1000 = 4000."], answer: "4000g" },
        { q: "Convert 2.75 km into metres.", steps: ["Kilometre is the big unit, metre is the small unit, so multiply.", "1 km = 1000 m, so 2.75 × 1000 = 2750."], answer: "2750m" },
        { q: "Convert 0.035 kg into grams. (Careful — this is smaller than 1 kg!)", steps: ["We are going big to small, so we multiply.", "0.035 × 1000 = 35.", "Picture sliding the decimal point 3 places to the right: 0.035 → 35."], answer: "35g" },
      ],
      tryit: { q: "Convert 6cm into millimetres.", answer: "60mm. Big unit to small unit, so multiply by 10: 6 × 10 = 60." },
    },
    {
      h: "5. Going from a small unit to a big unit: divide",
      body: [
        "Now the other direction. When you swap a small unit for a big unit, you DIVIDE by the factor. Why divide? Because you are gathering lots of little steps together into a few big steps, so the number gets smaller, and dividing makes numbers smaller.",
        "Let us do 500 centimetres into metres. Centimetre is the small unit, metre is the big unit, so we divide. The factor is 100. So 500 ÷ 100 = 5. Five hundred centimetres is 5 metres. Picture it: every 100 centimetres bundle up into 1 metre, and 500 has five lots of 100 inside it, so 5 metres.",
        "The sliding trick works in reverse for dividing. Divide by 10, the digits slide one place to the right. Divide by 100, two places. Divide by 1000, three places. So 2000 ÷ 1000 = 2, and 250 ÷ 100 = 2.5 (the point ends up between the 2 and the 5).",
        "It is completely fine for the answer to have a decimal point or to be less than one. If you divide 300g by 1000 you get 0.3kg. That just means 300 grams is only a small part of one whole kilogram, which makes sense, because a kilogram is quite heavy.",
      ],
      note: "Small to big, the number shrinks, so divide. A leftover decimal like 2.5 or 0.3 is normal and correct, not a mistake.",
      examples: [
        { q: "Convert 4200 grams into kilograms.", steps: ["Gram is the small unit, kilogram is the big unit, so we divide.", "The factor is 1000, because 1kg = 1000g.", "4200 ÷ 1000 = 4.2."], answer: "4.2kg" },
        { q: "Convert 7500 metres into kilometres.", steps: ["Metre is the small unit, kilometre is the big unit, so divide.", "7500 ÷ 1000 = 7.5."], answer: "7.5km" },
        { q: "Convert 250 centimetres into metres.", steps: ["Centimetre is the small unit, metre is the big unit, so divide.", "1m = 100cm, so 250 ÷ 100 = 2.5."], answer: "2.5m" },
      ],
      tryit: { q: "Convert 80mm into centimetres.", answer: "8cm. Small unit to big unit, so divide by 10: 80 ÷ 10 = 8." },
    },
    {
      h: "6. The sanity check that saves you every time",
      body: [
        "Even grown-ups sometimes forget whether to multiply or divide. So here is a safety check you can do on any answer, and it never lets you down.",
        "The rule is: for the same real amount, there should always be MORE of the small unit and FEWER of the big unit. So after you convert, look at your answer and ask, does it fit that? If you turned metres into centimetres (small unit) and your number got smaller, something is wrong, because it should have got bigger.",
        "Here is a quick way to picture it. Draw a see-saw in your mind. On the small-unit side the number should be high up and heavy. On the big-unit side the number should be light and low. If your see-saw is tipping the wrong way, flip your multiply and divide around.",
        "Try it on a real one. Is 3 metres the same as 30cm or 300cm? Centimetres are smaller, so there must be MORE of them than 3, definitely not fewer. 30cm would actually be shorter than 3m, so it cannot be right. The answer is 300cm.",
      ],
      note: "Quick check: small unit should always give the bigger number. If it did not, you converted the wrong way, so swap multiply and divide.",
      tryit: { q: "A child converts 5kg into grams and writes 0.005g. Without doing the sum, how do you know this is wrong?", answer: "Grams are the smaller unit, so the number should get much BIGGER, not tiny. The right answer is 5000g." },
    },
    {
      h: "7. Convert first, then compare",
      body: [
        "Sometimes a question gives you two measurements in different units and asks which is bigger. You cannot compare them straight away, in the same way you cannot fairly compare 3 apples with 3 oranges just by looking at the number 3. First you must make the units match.",
        "The plan is always the same. Pick one unit, change both measurements into that unit, and only then compare the plain numbers. It is like translating two sentences into the same language before you can tell which one is longer.",
        "Let us compare 1.2km and 950m. They are in different units (km and m), so change the odd one out. Turn 1.2km into metres: big unit to small unit, so multiply by 1000, giving 1200m. Now both are in metres. 1200m against 950m, and 1200 is clearly bigger. So 1.2km is the longer distance.",
        "Notice we chose to convert into metres rather than kilometres. Either would work, but changing 1.2km into 1200m avoided fiddly decimals, so it was the easier choice. When you get to pick the shared unit, pick the one that keeps the numbers tidy.",
      ],
      note: "Never compare two measurements while their units are different. Match the units first, always.",
      examples: [
        { q: "Which is heavier, 2kg or 2300g?", steps: ["The units are different (kg and g), so make them match.", "Change 2kg into grams: big to small, multiply by 1000, giving 2000g.", "Now compare: 2300g against 2000g."], answer: "2300g is heavier." },
        { q: "Which is longer, 1.5m or 140cm?", steps: ["Convert 1.5m into centimetres: big to small, multiply by 100.", "1.5 × 100 = 150cm.", "Compare: 150cm vs 140cm."], answer: "1.5m (150cm) is longer than 140cm." },
        { q: "Three lengths: 3.2km, 3150m and 315,000cm. Which is the longest?", steps: ["Convert everything into metres for a fair comparison.", "3.2km = 3.2 × 1000 = 3200m.", "315,000cm = 315,000 ÷ 100 = 3150m.", "Compare: 3200m, 3150m, 3150m."], answer: "3.2km (= 3200m) is the longest." },
      ],
      tryit: { q: "Which is longer, 45mm or 5cm? (Hint: change 5cm into millimetres first.)", answer: "5cm is longer. 5cm = 50mm, and 50mm is more than 45mm." },
    },
    {
      h: "8. Convert first, then add or take away",
      body: [
        "The same must-match-first rule applies when you add measurements together or take one away from another. You can only add or subtract numbers whose units are the same. Adding 2 metres and 50 centimetres straight to make 52 of something is nonsense, because a metre and a centimetre are different sizes.",
        "So the recipe is: make the units match, do the adding or subtracting, then check the answer is in the unit the question actually asked for. That last check catches a lot of slips, because it is easy to do all the hard work and then forget to give the answer in the right unit.",
        "Let us add 2.5kg and 300g and give the answer in kilograms. The units differ, so change 300g into kilograms: small to big, divide by 1000, giving 0.3kg. Now both are in kilograms, so we can add: 2.5 + 0.3 = 2.8. The answer is 2.8kg, and that is already in the unit asked for.",
        "One more, this time a subtraction. A bottle holds 1 litre and you pour out 250ml, how much is left? Change 1 litre into millilitres (big to small, multiply by 1000) giving 1000ml, then take away: 1000 minus 250 = 750ml.",
      ],
      note: "After all the working, read the question again and check your answer is in the exact unit it asked for. That final step is the one people forget.",
      examples: [
        { q: "A bag weighs 1.5kg. You add a tin weighing 400g. What is the total weight in grams?", steps: ["The answer must be in grams, so change everything into grams.", "Change 1.5kg into grams: big to small, multiply by 1000, giving 1500g.", "Add the tin: 1500 + 400 = 1900."], answer: "1900g" },
        { q: "A jug holds 2.3 litres of juice. You add 750ml more. What is the total in millilitres?", steps: ["Convert to ml first: 2.3 litres × 1000 = 2300ml.", "Add: 2300 + 750 = 3050ml."], answer: "3050ml" },
        { q: "A lorry can carry 3 tonnes. It has already been loaded with 1800kg. How many more kilograms can it carry? (1 tonne = 1000kg.)", steps: ["Convert 3 tonnes to kg: 3 × 1000 = 3000kg.", "Already loaded: 1800kg.", "Remaining capacity: 3000 - 1800 = 1200kg."], answer: "1200kg more." },
      ],
      tryit: { q: "You have a 2m plank and saw off 40cm. How long is the plank now, in centimetres?", answer: "160cm. Change 2m into 200cm (multiply by 100), then take away 40: 200 minus 40 = 160cm." },
    },
  ],
};

PRIMARY_LESSONS.timeCalendar = {
  title: "Time & Calendar: days that go round and round",
  minutes: 18,
  intro: "Some things in life keep repeating in the same order, over and over. The days of the week do this: after Sunday we always go back to Monday and start again. The hours on a clock do this too. In this lesson we will start really slowly, with one day at a time, and build up to a clever shortcut that lets you jump far ahead or far back without counting every single day. We will also learn to add and take away time on a clock, and finish with the puzzle of leap years. Take your time, and try each little check as you go.",
  sections: [
    {
      h: "1. The days of the week go round in a loop",
      body: [
        "Let's start with something you already know. The days of the week always come in the same order: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Then something important happens. After Sunday we do not get an eighth new day. We go straight back to Monday and start the whole list again.",
        "Because it keeps coming back to the start, we call this a loop, or a cycle. A cycle is just a pattern that repeats forever in the same order. A merry-go-round at the fair is a cycle: the horses come past you, then go all the way round, then the same horses come past again.",
        "Here is another way to picture it. Imagine the seven days painted around the edge of a big round clock face, like seven stepping stones in a circle. You hop from stone to stone. When you step off the Sunday stone, the very next stone is Monday again. You never fall off the end, because a circle has no end.",
        "The number of days in one full loop is 7. Remember that number, because the whole of this lesson leans on it. Seven days makes one week, and one week brings you right back to the same day you started on.",
      ],
      note: "A cycle just means a pattern that repeats in the same order forever. Days of the week loop every 7.",
      tryit: { q: "If today is Friday, name the next four days in order.", answer: "Saturday, Sunday, Monday, Tuesday. Notice we looped past Sunday back to Monday." },
    },
    {
      h: "2. Counting on a few days by hopping",
      body: [
        "The simplest question about days is: if today is a certain day, what day will it be in a few days' time? The safest way to answer, when the number is small, is just to hop forwards one day at a time and say each day out loud.",
        "Say today is Tuesday and we want to know the day in 3 days. Start on Tuesday. Hop once and you land on Wednesday (that is 1 day later). Hop again to Thursday (2 days later). Hop a third time to Friday (3 days later). So in 3 days it will be Friday.",
        "It helps to picture a number line just for days. Draw a straight line and write the days along it like beads on a string: Tuesday, then Wednesday, then Thursday, then Friday. Each step to the right is one more day. You count the jumps, not the beads, so 3 jumps from Tuesday lands you on Friday.",
        "One thing to watch. The day you start on does NOT count as a hop. Tuesday is where you stand at the beginning, so your first hop takes you to Wednesday. If you accidentally count Tuesday as day 1, all your answers come out one day too early.",
      ],
      note: "The day you start on is your standing spot, not a hop. Your first hop lands on the NEXT day.",
      examples: [
        { q: "Today is Sunday. What day will it be in 4 days?", steps: ["Stand on Sunday.", "Hop 1: Monday. Hop 2: Tuesday. Hop 3: Wednesday. Hop 4: Thursday."], answer: "Thursday" },
        { q: "Today is Wednesday. What day will it be in 11 days?", steps: ["11 ÷ 7 = 1 remainder 4. One full week lands back on Wednesday.", "Hop the 4 remaining days: Thursday, Friday, Saturday, Sunday."], answer: "Sunday" },
        { q: "Today is Tuesday. What day will it be in 100 days?", steps: ["100 ÷ 7 = 14 remainder 2 (14 full weeks use 98 days, 2 left over).", "Hop the 2 remaining days from Tuesday: Wednesday, Thursday."], answer: "Thursday" },
      ],
      tryit: { q: "Today is Wednesday. What day will it be in 5 days?", answer: "Monday (hop 5 days: Thursday, Friday, Saturday, Sunday, Monday)." },
    },
    {
      h: "3. Big jumps: why whole weeks don't change the day",
      body: [
        "Hopping is lovely for small numbers, but imagine the question was 'what day in 30 days?' You would not want to hop thirty times and risk losing count. There is a beautiful shortcut, and it comes straight from the loop we met in Section 1.",
        "Here is the key idea. One whole week is exactly 7 days, and 7 days brings you back to the very same day you started on. If today is Monday, then in 7 days it is Monday again, and in 14 days it is Monday again, and in 21 days it is still Monday. Whole weeks change nothing about the day of the week.",
        "So the plan is: throw away as many whole weeks as you can, because they make no difference, and only count the leftover days. The leftover after taking out whole groups of 7 has a special name. It is called the remainder. A remainder is simply what is left over when you have shared something into equal groups and cannot make another full group.",
        "Think of it like putting eggs into egg boxes that each hold 7. If you have 17 eggs, you fill 2 boxes (that uses 14 eggs) and 3 eggs are left over that will not fill a third box. We write that as 17 divided by 7 equals 2 remainder 3. The 2 full boxes are the whole weeks we ignore. The remainder, 3, is all that matters.",
        "So for 'today is Tuesday, what day in 17 days?': work out 17 divided by 7, which is 2 remainder 3. Ignore the 2 whole weeks. Now just hop the remainder, 3 days, from Tuesday: Wednesday, Thursday, Friday. The answer is Friday. Much faster than hopping 17 times.",
      ],
      note: "Divide the number of days by 7. Ignore the whole weeks. Only hop the remainder.",
      examples: [
        { q: "Today is Thursday. What day will it be in 23 days?", steps: ["23 divided by 7 = 3 remainder 2 (three full weeks use up 21 days, 2 left over).", "Ignore the 3 weeks. Hop the remainder, 2 days, from Thursday: Friday, Saturday."], answer: "Saturday" },
        { q: "Today is Monday. What day will it be in 30 days?", steps: ["30 ÷ 7 = 4 remainder 2 (4 weeks = 28 days, 2 left over).", "Hop 2 days from Monday: Tuesday, Wednesday."], answer: "Wednesday" },
        { q: "Today is Wednesday. What day was it exactly 365 days ago?", steps: ["365 ÷ 7 = 52 remainder 1 (52 weeks = 364 days, 1 left over).", "We are going back, so hop 1 day backwards from Wednesday: Tuesday."], answer: "Tuesday (365 days ago was a Tuesday)." },
      ],
      tryit: { q: "Today is Monday. What day will it be in 30 days?", answer: "Wednesday (30 divided by 7 = 4 remainder 2; hop 2 from Monday: Tuesday, Wednesday)." },
    },
    {
      h: "4. Going backwards in time",
      body: [
        "Sometimes a question asks about the past instead of the future, for example 'what day was it 10 days ago?' The good news is that everything we just learned still works. The only change is the direction you hop. Going into the future you hop forwards through the days. Going into the past you hop backwards.",
        "Picture the stepping stones again, or the number line of days. Forwards means stepping to the right (Monday to Tuesday to Wednesday). Backwards means stepping to the left (Monday to Sunday to Saturday). It is the same path, just walked the other way.",
        "The remainder trick works exactly the same. First knock out the whole weeks by dividing by 7, then hop only the remainder, but hop backwards this time.",
        "Say today is Monday and we want the day 10 days ago. Work out 10 divided by 7, which is 1 remainder 3. Ignore the 1 whole week. Now hop backwards 3 days from Monday: Sunday, then Saturday, then Friday. So 10 days ago it was Friday.",
        "A common slip is hopping the wrong way. Before you start, read the question and ask yourself one thing: is it asking about the future (later) or the past (earlier, ago)? Then point your hops the right way.",
      ],
      note: "Same remainder trick either way. Future means hop forwards, past ('ago') means hop backwards.",
      examples: [
        { q: "Today is Sunday. What day was it 16 days ago?", steps: ["16 divided by 7 = 2 remainder 2 (two full weeks use 14 days, 2 left over).", "Ignore the 2 weeks. Hop backwards the remainder, 2 days, from Sunday: Saturday, Friday."], answer: "Friday" },
        { q: "Today is Tuesday. What day was it 20 days ago?", steps: ["20 ÷ 7 = 2 remainder 6 (2 weeks = 14 days, 6 left over).", "Hop 6 days backwards from Tuesday: Monday, Sunday, Saturday, Friday, Thursday, Wednesday."], answer: "Wednesday" },
        { q: "Today is Thursday. A letter was written exactly 50 days ago. What day of the week was it written?", steps: ["50 ÷ 7 = 7 remainder 1 (7 weeks = 49 days, 1 left over).", "Hop 1 day backwards from Thursday: Wednesday."], answer: "Wednesday" },
      ],
      tryit: { q: "Today is Wednesday. What day was it 20 days ago?", answer: "Thursday (20 divided by 7 = 2 remainder 6; hop back 6 from Wednesday: Tuesday, Monday, Sunday, Saturday, Friday, Thursday)." },
    },
    {
      h: "5. Reading a clock and adding a few minutes",
      body: [
        "Now we swap days for time on a clock. First a quick reminder of what the numbers in a time mean. In a time like 3:20, the number before the two dots is the hour and the number after the two dots is the minutes past that hour. So 3:20 means 20 minutes after 3 o'clock.",
        "Minutes also go round in a loop, just like the days did, but the minutes loop is longer. There are 60 minutes in one hour, and after minute 59 the clock does not go to 60. It clicks back round to a fresh 0 and the hour number goes up by one. So one minute after 3:59 is 4:00.",
        "Let's add a small amount of time that stays inside the same hour. What is 25 minutes after 3:20? The hour stays as 3, and we just add the minutes: 20 add 25 is 45. So the answer is 3:45. Easy, because the minutes did not reach 60.",
        "You can picture this on the clock face. The long hand for minutes sits at 20 minutes past. Sweep it forward another 25 little marks and it lands on 45 minutes past. The short hour hand has barely moved, so it is still the 3 o'clock hour.",
      ],
      note: "There are 60 minutes in an hour. After :59 the minutes reset to :00 and the hour ticks up by one.",
      tryit: { q: "What time is 15 minutes after 7:30?", answer: "7:45 (30 add 15 is 45, still under 60, so the hour stays at 7)." },
    },
    {
      h: "6. Adding minutes that spill past the hour",
      body: [
        "The tricky part is when the minutes add up to 60 or more, because then the minutes loop clicks over and we gain an extra hour. The rule to hold onto is: if your minutes reach 60 or more, take away 60 from the minutes and add 1 to the hour. It is a fair swap, because 60 minutes is exactly 1 hour.",
        "This is just like money. Think of minutes as pennies and an hour as a special coin worth 60 pennies. Once you have 60 pennies you swap them for one coin. You do not carry around 75 loose pennies, you carry 1 coin and 15 pennies. In the same way you never leave a time as 75 minutes past, you tidy it into 1 hour and 15 minutes.",
        "Let's try 25 minutes after 3:50. Add the minutes: 50 add 25 is 75. That is 60 or more, so we do the swap. Take 60 off the 75, leaving 15 minutes, and add 1 to the hour, turning the 3 into a 4. The answer is 4:15.",
        "You can check it a gentler way. From 3:50 it is only 10 minutes to reach 4:00. We wanted to add 25, and we have used 10 of them, so 15 minutes are left. 4:00 plus those 15 minutes is 4:15. Same answer, which is a good sign.",
      ],
      note: "If the minutes hit 60 or more, take away 60 and add 1 to the hour. Sixty minutes buys one hour.",
      examples: [
        { q: "What time is 40 minutes after 6:35?", steps: ["Add the minutes: 35 add 40 is 75.", "75 is 60 or more, so swap: take 60 off (leaves 15 minutes) and add 1 to the hour.", "6 o'clock becomes 7 o'clock, with 15 minutes."], answer: "7:15" },
        { q: "What time is 25 minutes after 9:48?", steps: ["Add the minutes: 48 + 25 = 73.", "73 is 60 or more: take 60 off (leaves 13) and add 1 to the hour.", "9 becomes 10, with 13 minutes."], answer: "10:13" },
        { q: "What time is 1 hour 47 minutes after 10:55?", steps: ["Add the 1 hour first: 10:55 becomes 11:55.", "Add 47 minutes: 55 + 47 = 102.", "102 is 60 or more: take 60 (leaves 42) and add 1 to the hour.", "11 becomes 12, with 42 minutes."], answer: "12:42" },
      ],
      tryit: { q: "What time is 50 minutes after 9:20?", answer: "10:10 (20 add 50 is 70; take off 60 leaving 10 minutes, add 1 hour so 9 becomes 10)." },
    },
    {
      h: "7. Adding hours and minutes together",
      body: [
        "Often a question adds both hours and minutes at once, like '3 hours 50 minutes after 9:25'. The safe method is to do it in two calm steps: deal with the whole hours first, then deal with the minutes, tidying up at the end if they spill past 60.",
        "Doing one thing at a time stops the hours and minutes getting muddled. It is the same idea as adding a big number by dealing with the tens first and then the units, rather than trying to do everything in your head at once.",
        "Step one, add the 3 whole hours to 9:25. The minutes do not change, only the hour: 9:25 becomes 12:25. Step two, add the 50 minutes. 25 add 50 is 75, which is 60 or more, so swap: take off 60 leaving 15 minutes, and add 1 to the hour. So 12:25 becomes 13:40.",
        "One quick note on the hours. Many clocks and timetables count right on past 12 up to 23, so one o'clock in the afternoon is written 13:00, two o'clock is 14:00 and so on. This is called the 24 hour clock. So 13:40 is the same moment as twenty to two in the afternoon, which you might write as 1:40pm.",
      ],
      note: "Add the whole hours first, then the minutes, then tidy any minute total of 60 or more.",
      examples: [
        { q: "What time is 2 hours 40 minutes after 11:35?", steps: ["Add the 2 hours: 11:35 becomes 13:35.", "Add the 40 minutes: 35 add 40 is 75.", "75 is 60 or more, so take off 60 (leaves 15) and add 1 hour: 13:35 becomes 14:15."], answer: "14:15 (which is 2:15pm)" },
        { q: "What time is 3 hours 25 minutes after 8:50?", steps: ["Add 3 hours: 8:50 becomes 11:50.", "Add 25 minutes: 50 + 25 = 75.", "75 - 60 = 15 minutes, carry 1 hour: 11 becomes 12."], answer: "12:15" },
        { q: "A film starts at 2:40pm and lasts 1 hour 55 minutes. What time does it end?", steps: ["Add 1 hour: 2:40pm becomes 3:40pm.", "Add 55 minutes: 40 + 55 = 95.", "95 - 60 = 35 minutes, carry 1 hour: 3pm becomes 4pm.", "So the time is 4:35pm."], answer: "4:35pm" },
      ],
      tryit: { q: "What time is 2 hours 30 minutes after 8:50?", answer: "11:20 (add 2 hours to get 10:50, then 50 add 30 is 80; take off 60 leaving 20 minutes and add 1 hour, so 11:20)." },
    },
    {
      h: "8. Taking time away (times in the past)",
      body: [
        "Going earlier in time works just like the day questions in Section 4: same idea, opposite direction. Instead of adding minutes we take them away.",
        "If the minutes are big enough to take away easily, just do it. What is 20 minutes before 3:35? The hour stays at 3, and 35 take away 20 is 15, so the answer is 3:15.",
        "The care is needed when you are asked to take away more minutes than you have. Then you borrow one hour and turn it into 60 extra minutes, in the same penny-and-coin way as before, only backwards. What is 20 minutes before 3:10? You cannot take 20 from 10, so borrow. Drop the hour from 3 to 2, and that borrowed hour becomes 60 minutes, which you add to the 10 to make 70. Now 70 take away 20 is 50, and the hour is 2, so the answer is 2:50.",
        "As always, read the question first. Words like 'before', 'earlier' and 'ago' mean go backwards and take time away. Words like 'after', 'later' and 'from now' mean go forwards and add time.",
      ],
      note: "Cannot take the minutes away? Borrow 1 hour, turn it into 60 extra minutes, then subtract.",
      examples: [
        { q: "What time is 45 minutes before 1:15?", steps: ["We cannot take 45 from 15, so borrow one hour.", "The hour 1 drops to 12, and the borrowed hour adds 60 minutes to the 15, making 75.", "75 take away 45 is 30, with the hour now 12."], answer: "12:30" },
        { q: "What time is 35 minutes before 3:10?", steps: ["We cannot take 35 from 10, so borrow one hour.", "The hour 3 drops to 2, and the borrowed 60 is added to 10, making 70.", "70 - 35 = 35, with the hour now 2."], answer: "2:35" },
        { q: "How much time passes between 9:45am and 1:20pm?", steps: ["Count up in stages: 9:45 to 10:00 is 15 minutes.", "10:00 to 1:00pm is 3 hours.", "1:00pm to 1:20pm is 20 minutes.", "Total: 3 hours and 35 minutes."], answer: "3 hours 35 minutes." },
      ],
      tryit: { q: "What time is 25 minutes before 6:10?", answer: "5:45 (cannot take 25 from 10, so borrow: 6 becomes 5 and 10 becomes 70; 70 take away 25 is 45, giving 5:45)." },
    },
    {
      h: "9. Leap years: the extra day",
      body: [
        "Last of all, a puzzle about years. Most years have 365 days, but every so often we add one extra day, the 29th of February, to keep our calendar lined up with the Sun. A year that gets this extra day is called a leap year, and it has 366 days.",
        "The main rule is simple. A year is a leap year if it divides exactly by 4, meaning you can share it into equal groups of 4 with nothing left over (no remainder). For example 2024 divides exactly by 4, so 2024 is a leap year.",
        "There is one twist to watch for, and it only affects century years. A century year is one that ends in two zeros, like 1900 or 2000. For these special years, dividing by 4 is not enough. A century year is only a leap year if it divides exactly by 400.",
        "Let's see the twist in action. 1900 divides by 4, so you might expect a leap year, but 1900 is a century year and it does NOT divide exactly by 400 (1900 divided by 400 leaves a remainder), so 1900 is not a leap year. Now 2000: it is a century year, and it does divide exactly by 400 (400 times 5 is 2000), so 2000 really is a leap year.",
        "So the full check has two questions. If the year does not end in 00, just ask 'does it divide by 4?' If it does end in 00, ask the stricter question 'does it divide by 400?'",
      ],
      note: "Divide by 4 for a leap year. But century years (ending 00) must divide by 400 instead.",
      examples: [
        { q: "Is 2016 a leap year?", steps: ["2016 does not end in 00, so we only need the divide-by-4 test.", "2016 divided by 4 is 504 exactly, with no remainder."], answer: "Yes, 2016 is a leap year" },
        { q: "Is 1900 a leap year?", steps: ["1900 ends in 00, so the divide-by-4 rule is not enough. We must check divide-by-400 instead.", "1900 ÷ 400 = 4.75, which is not exact.", "So 1900 does not pass the stricter test."], answer: "No, 1900 is not a leap year, even though it divides by 4." },
        { q: "How many leap years are there between 2020 and 2040 inclusive? List them.", steps: ["Check each multiple of 4 in the range: 2020, 2024, 2028, 2032, 2036, 2040.", "None of these end in 00, so the simple divide-by-4 test applies to all of them.", "All six divide exactly by 4."], answer: "Six leap years: 2020, 2024, 2028, 2032, 2036 and 2040." },
      ],
      tryit: { q: "Is 2100 a leap year?", answer: "No. 2100 is a century year (ends in 00), so it must divide exactly by 400, but 2100 divided by 400 is 5.25, which is not exact." },
    },
  ],
};

PRIMARY_LESSONS.compensationMentalMaths = {
  title: "Mental Maths Shortcuts: nudging numbers to something friendlier",
  minutes: 15,
  intro: "Some sums look scary just because the numbers are awkward. The good news is that you are allowed to gently change the numbers into rounder, friendlier ones before you work them out, as long as you undo the change somewhere else so the answer stays exactly right. That clever trick is called compensation, and this lesson builds it up slowly from the very beginning. Take your time, and try each little checkpoint as you go.",
  sections: [
    {
      h: "1. What does compensation even mean?",
      body: [
        "First, a new word. Compensation means making a change in one place and then making up for it in another place, so that in the end nothing is lost or gained. When you compensate, you swap an awkward job for an easier job that gives the very same result.",
        "Think about carrying two shopping bags, one in each hand. If one bag is a bit too heavy you might move an apple from the heavy bag into the light bag. You still have exactly the same apples in total. Nothing has appeared and nothing has vanished. You have just moved things around to make the load easier to carry. Compensation in maths is that same idea, but with numbers instead of apples.",
        "Here is another way to picture it. Imagine you owe your friend some sweets. If you give them 2 extra sweets by mistake, you can put things right by taking 2 sweets back. Give 2, take 2, and you are back to fair. In maths we often make a number bigger or smaller on purpose, then put it right so the sum still tells the truth.",
        "Why bother? Because round numbers like 10, 20, 30, 100 are lovely and easy to add, take away and times. If we can nudge an awkward number like 38 until it becomes a round 40, the sum suddenly gets much kinder. The word nudge just means giving a number a small push to make it a little bigger or a little smaller.",
      ],
      note: "Compensation never changes the real answer. It only changes how hard the sum FEELS. You do a small trick, then undo it, and the truth is safe.",
      tryit: { q: "In your own words, what happens to the total number of apples if you move one apple from your heavy bag to your light bag?", answer: "Nothing changes. The total is exactly the same, because you did not add or remove any apples. You only moved one across." },
    },
    {
      h: "2. Adding: the see-saw rule",
      body: [
        "Let us start with adding. When we add, we join two amounts together to find how many there are altogether. The two amounts we are joining are simply called the numbers in our sum.",
        "Picture a see-saw in the playground with a child sitting on each end, balanced perfectly level. If one child shuffles forward a little, the see-saw tips, unless the other child shuffles back by exactly the same amount. Move one up, move the other down by the same size, and it stays balanced. Adding works just like that see-saw.",
        "Try the sum 38 + 27. The number 38 is only 2 away from the lovely round 40. So we nudge 38 UP by 2 to make 40. But we must keep the see-saw balanced, so we nudge the other number, 27, DOWN by 2 to make 25. One went up by 2, the other went down by 2.",
        "Now the sum has become 40 + 25, and that is easy: 40 + 25 = 65. And here is the important bit, the answer 65 is exactly the same as 38 + 27 would have given. We added 2 to one number and took 2 off the other, and those two little changes cancel each other out completely.",
        "You can also see this on a number line, which is just numbers written in order along a straight line, like a ruler. Sliding a jump 2 steps to the right and its partner 2 steps to the left lands you on the very same finishing point. Nothing has really moved overall.",
      ],
      note: "For ADDING, remember the see-saw: one number goes up, the other goes down, by the same amount. Opposite directions.",
      examples: [
        { q: "Use the see-saw rule to work out 58 + 26.", steps: ["Look for a round number nearby. 58 is just 2 away from 60.", "Nudge 58 UP by 2 to make 60.", "Keep it balanced: nudge 26 DOWN by 2 to make 24.", "Now do the easy sum: 60 + 24 = 84."], answer: "84" },
        { q: "Use the see-saw rule to work out 147 + 38.", steps: ["38 is 2 away from 40, so nudge 38 UP by 2 to make 40.", "Balance: nudge 147 DOWN by 2 to make 145.", "Easy sum: 145 + 40 = 185."], answer: "185" },
        { q: "Use the see-saw rule to work out 296 + 108.", steps: ["296 is 4 away from 300, so nudge 296 UP by 4 to make 300.", "Balance: nudge 108 DOWN by 4 to make 104.", "Easy sum: 300 + 104 = 404."], answer: "404" },
      ],
    },
    {
      h: "3. More adding practice, and picking the smaller nudge",
      body: [
        "It usually helps to nudge whichever number is closest to a round number, because that means the smallest, easiest nudge. Small nudges are less fiddly and easier to keep track of in your head.",
        "Take 49 + 36. The number 49 is only 1 away from 50, which is a very small, friendly nudge. So we push 49 UP by 1 to make 50, and to balance the see-saw we push 36 DOWN by 1 to make 35. The sum becomes 50 + 35 = 85.",
        "Now look at 65 + 27. This time 27 is 3 away from 30. We push 27 UP by 3 to make 30, and push 65 DOWN by 3 to make 62. The sum becomes 62 + 30 = 92. It does not matter which number you choose to round, as long as the other one balances it.",
        "A quick way to check yourself: add up the changes. You made one number bigger by some amount and the other smaller by the SAME amount. If the two changes are not the same size, the see-saw is not balanced and your answer will be wrong.",
      ],
      examples: [
        { q: "Use the see-saw rule to work out 76 + 18.", steps: ["18 is only 2 away from 20, so that is the smaller nudge.", "Nudge 18 UP by 2 to make 20.", "Balance it: nudge 76 DOWN by 2 to make 74.", "Do the easy sum: 74 + 20 = 94."], answer: "94" },
        { q: "Use the see-saw rule to work out 253 + 49.", steps: ["49 is 1 away from 50, so nudge 49 UP by 1 to make 50.", "Balance: nudge 253 DOWN by 1 to make 252.", "Easy sum: 252 + 50 = 302."], answer: "302" },
        { q: "Use the see-saw rule to work out 398 + 167.", steps: ["398 is 2 away from 400, so nudge 398 UP by 2 to make 400.", "Balance: nudge 167 DOWN by 2 to make 165.", "Easy sum: 400 + 165 = 565."], answer: "565" },
      ],
      tryit: { q: "Use the see-saw rule to work out 47 + 25.", answer: "Nudge 47 up by 3 to make 50, and nudge 25 down by 3 to make 22. Then 50 + 22 = 72." },
    },
    {
      h: "4. Taking away is really about the GAP",
      body: [
        "Now for taking away, also called subtraction. Before we speed it up, we need to understand what a subtraction really measures. When you work out 82 - 47, you are finding the GAP between 47 and 82, that is, how far apart they are.",
        "Imagine two friends standing on a number line, one at 47 and one at 82. The answer to 82 - 47 is simply the distance between them. If both friends take one step forward together, at the same time, the distance between them does not change one bit. They have both moved, so the gap is exactly the same.",
        "This is the big surprise about subtraction, and it is different from adding. To keep the gap the same, both numbers must move the SAME way, together, by the same amount. This is not the see-saw. Here the two numbers travel side by side, like two people walking in step.",
        "Another picture: think of the space between two fence posts. If you pick up both posts and move them 3 steps to the right, the space between them has not changed. Moving them together keeps the gap safe.",
      ],
      note: "For TAKING AWAY, do NOT use the see-saw. Move BOTH numbers the same way by the same amount, to keep the gap unchanged.",
      tryit: { q: "Two friends stand on a number line at 30 and 50. They both take 5 steps forward, landing on 35 and 55. Has the gap between them changed?", answer: "No. They were 20 apart before, and they are still 20 apart after, because they both moved together by the same amount." },
    },
    {
      h: "5. Using the gap idea to take away quickly",
      body: [
        "Now we use that gap idea to make subtraction easy. The trick is to slide both numbers along until the number we are taking away becomes a nice round one.",
        "Look at 82 - 47. The number we are taking away is 47, and it is only 3 away from a round 50. So we add 3 to BOTH numbers, moving them together: 82 becomes 85, and 47 becomes 50. The sum is now 85 - 50, which is easy: 85 - 50 = 35. And that is the true answer to 82 - 47.",
        "Notice we did NOT nudge in opposite directions here. If we had used the see-saw by mistake and taken 3 off the 82 while adding 3 to the 47, the gap would have shrunk and the answer would be wrong. Adding is a see-saw, taking away is walking in step. Keeping those two apart is the whole game.",
        "Let us do another. For 63 - 28, the 28 is 2 away from 30. Add 2 to both: 63 becomes 65 and 28 becomes 30. Now 65 - 30 = 35, which is our answer.",
      ],
      examples: [
        { q: "Use the gap trick to work out 71 - 38.", steps: ["We are taking away 38, which is 2 away from 40.", "Add 2 to BOTH numbers, moving them together: 71 becomes 73, and 38 becomes 40.", "Do the easy sum: 73 - 40 = 33."], answer: "33" },
        { q: "Use the gap trick to work out 84 - 57.", steps: ["57 is 3 away from 60.", "Add 3 to both: 84 becomes 87, and 57 becomes 60.", "Easy sum: 87 - 60 = 27."], answer: "27" },
        { q: "Use the gap trick to work out 202 - 87.", steps: ["87 is 13 away from 100.", "Add 13 to both: 202 becomes 215, and 87 becomes 100.", "Easy sum: 215 - 100 = 115."], answer: "115" },
      ],
      tryit: { q: "Use the gap trick to work out 91 - 46.", answer: "46 is 4 away from 50, so add 4 to both: 91 becomes 95 and 46 becomes 50. Then 95 - 50 = 45." },
    },
    {
      h: "6. Timesing: doubling and halving",
      body: [
        "Compensation helps with timesing too, but in its own special way. Timesing, also called multiplication, means adding the same number lots of times. For example 16 x 5 means five lots of 16, or sixteen lots of 5. The two numbers being timesed are called the factors.",
        "Picture 16 x 5 as a grid, or an array, which just means dots arranged in neat rows and columns. Imagine 16 rows with 5 dots in each row. That is a tall, thin block of dots. Now imagine folding it so the rows pair up: you turn 16 rows into 8 rows, but each new row is now twice as wide, with 10 dots. You have not added or removed a single dot. You have just rearranged the same dots into a shorter, wider block.",
        "So 16 x 5 becomes 8 x 10. We HALVED one factor (16 became 8) and DOUBLED the other (5 became 10). And 8 x 10 = 80 is far easier than 16 x 5. Doubling means making twice as big, and halving means splitting into two equal parts and keeping one part.",
        "Why does this work? Because whatever you divide out of one factor, you multiply back into the other. Halving takes a 2 out of one number, and doubling puts that 2 straight back into the other number. The total number of dots, which is the answer, never changes.",
        "This trick is brilliant whenever one factor is even and the other is a 5, because doubling a 5 gives a lovely round 10.",
      ],
      note: "Doubling and halving is NOT the see-saw. You do not add and subtract, you DOUBLE one factor and HALVE the other. Halve one, double the other.",
      examples: [
        { q: "Use doubling and halving to work out 14 x 5.", steps: ["One factor, 14, is even, so we can halve it: half of 14 is 7.", "Double the other factor: double 5 is 10.", "Now do the easy timesing: 7 x 10 = 70."], answer: "70" },
        { q: "Use doubling and halving to work out 18 × 5.", steps: ["18 is even, so halve it: 18 ÷ 2 = 9.", "Double 5: 5 × 2 = 10.", "Easy: 9 × 10 = 90."], answer: "90" },
        { q: "Use doubling and halving to work out 16 × 25.", steps: ["16 is even, halve it: 8. Double 25: 50. Now 8 × 50.", "8 is still even, halve it again: 4. Double 50: 100. Now 4 × 100.", "4 × 100 = 400."], answer: "400" },
      ],
      tryit: { q: "Use doubling and halving to work out 18 x 5.", answer: "Halve 18 to get 9, double 5 to get 10, then 9 x 10 = 90." },
    },
    {
      h: "7. Choosing a friendly target number",
      body: [
        "The skill under all of this is spotting a nearby friendly number to aim for. A friendly number, sometimes called a round number, is one that is easy to work with, usually a multiple of 10 like 10, 20, 30, 40, or a multiple of 100 like 100 or 200. A multiple of 10 just means a number you land on when counting in tens.",
        "When you meet an awkward number, ask yourself: which round number is closest? For 39 the closest friendly target is 40, just 1 step away. For 62 the closest is 60, 2 steps away. For 88 the closest is 90, 2 steps away. Picking the closest target keeps your nudge small and easy.",
        "Then ask: which way do I need to move it, and how do I keep the sum fair? That last part depends on whether you are adding, taking away or timesing, which is what the final section pulls together.",
      ],
      tryit: { q: "What is the closest friendly (round) number to 71, and how many steps away is it?", answer: "70, which is just 1 step away (you would nudge 71 down by 1)." },
    },
    {
      h: "8. Which rule goes with which sum?",
      body: [
        "This is the part people mix up most, so let us lay all three side by side. Each kind of sum keeps itself fair in a different way, and using the wrong rule will give a wrong answer.",
        "ADDING is the see-saw: nudge one number up and the other down by the same amount. The two opposite changes cancel out.",
        "TAKING AWAY is walking in step: move BOTH numbers the same way by the same amount, so the gap between them stays the same.",
        "TIMESING is doubling and halving: double one factor and halve the other, so the same dots are just rearranged.",
        "The most common slip is using the adding see-saw when you are actually taking away. If you find yourself pushing the two numbers in opposite directions during a subtraction, stop, because that shrinks or grows the gap and breaks the answer. A good habit is to say out loud which kind of sum you are doing before you nudge anything.",
        "One last honest tip: compensation is a shortcut, not a rule you are forced to use. If a sum is already easy, or if the nudges get messy, just work it out the normal way. The whole point of this trick is to save effort, so only reach for it when it genuinely makes life simpler.",
      ],
      note: "Say it before you solve it: adding is a SEE-SAW (opposite ways), taking away is WALKING IN STEP (same way), timesing is DOUBLE AND HALVE.",
      tryit: { q: "For 84 - 39, which rule do you use, and what does the sum become?", answer: "Taking away, so walk in step: add 1 to both numbers. 84 becomes 85 and 39 becomes 40, giving 85 - 40 = 45." },
    },
  ],
};

PRIMARY_LESSONS.formalMultiplication = {
  title: "Column Multiplication: breaking a big multiply into easy pieces",
  minutes: 18,
  intro: "Some multiplications look far too big to do in your head, like 47 times 23. The good news is that you never actually do a big multiply. You chop it into a few small, friendly multiplies that you already know, and then you add the little answers back together. This lesson builds that idea up slowly, from what 'multiply' even means, all the way to multiplying two large numbers.",
  sections: [
    {
      h: "1. What 'multiply' really means",
      body: [
        "Let us start right at the beginning. To 'multiply' means to have several equal groups and to work out how many things there are altogether. That is all it is: equal groups, counted up.",
        "Imagine 4 bags of sweets, and every bag has 5 sweets inside. You could count them one at a time, 1, 2, 3, all the way up. Or you could say '4 groups of 5', which we write as 4 × 5. The little × sign just means 'groups of'. So 4 × 5 means '4 groups of 5', which is 20 sweets.",
        "Here is another way to picture the very same thing. Draw 4 rows of dots, with 5 dots in each row. That neat block of dots is called an array, which is just a fancy word for a rectangle of things lined up in rows and columns. Count the dots and you get 20 again. Groups of sweets and an array of dots are two pictures of one idea.",
        "One more picture, using a number line. A number line is just a straight line with the numbers marked along it in order, like a ruler. Multiplying 4 × 5 is like hopping along the line in jumps of 5: land on 5, then 10, then 15, then 20. Four jumps of 5 gets you to 20.",
      ],
      note: "The × sign reads as 'groups of' or 'lots of'. So 6 × 3 is '6 lots of 3'. Saying it out loud in words often makes it click.",
      tryit: { q: "Draw or picture 3 bags with 4 sweets in each. How many sweets altogether, and how would you write it with a × sign?", answer: "3 × 4 = 12 sweets." },
    },
    {
      h: "2. Times tables are your building blocks",
      body: [
        "The small multiplies like 4 × 5 or 6 × 7 are called times-table facts. A times-table fact is just a multiply small enough to remember off by heart, without working it out each time.",
        "These little facts are the bricks we build everything else from. When you know that 6 × 7 = 42 straight away, you never have to stop and count groups of dots. You just know it.",
        "But here is the problem this whole lesson is about. Times tables usually only go up to 12 × 12. Nobody has a times table for 47 × 23. That multiply is far too big to remember, and far too big to count out as dots. So we need a clever trick to turn a big scary multiply into a handful of small friendly ones.",
        "That trick has a name: it is called column multiplication (some people call it long multiplication). 'Long' does not mean hard. It just means we write our working out in a few lines instead of one. By the end of this lesson you will be able to do it.",
      ],
      tryit: { q: "Which of these is a times-table fact you could just remember, and which is too big to remember: 8 × 7, or 63 × 29?", answer: "8 × 7 = 56 is a times-table fact. 63 × 29 is far too big to remember, so we would split it up." },
    },
    {
      h: "3. The big idea: splitting a number into place-value pieces",
      body: [
        "The secret to the whole trick is understanding what a number like 23 is really made of. The digit on the right is the ones, and the digit to its left is the tens. So 23 is not really '2 and 3'. It is 2 tens and 3 ones, which is 20 and 3. This is called place value, because the place a digit sits in tells you what it is worth.",
        "Think of it like money. The number 23 is like having two 10p coins and three 1p coins. Two tens is 20p, plus three ones is 3p, giving 23p in total. The '2' is really worth 20 because of where it sits.",
        "Now the clever part. Because 23 is really 20 + 3, we can chop any multiply that uses 23 into two smaller multiplies, do each one on its own, then add the two answers. Breaking a number into its place-value pieces like this is called splitting.",
        "Let us try it on 23 × 6, which means '23 groups of 6'. Split the 23 into 20 and 3. Now do the two easy multiplies: 20 × 6 = 120, and 3 × 6 = 18. Finally add the two little answers together: 120 + 18 = 138. So 23 × 6 = 138, and we never had to do anything harder than our times tables.",
      ],
      note: "The two little answers you get from splitting have a name: they are called partial products. 'Partial' means 'a part of', so each one is part of the final answer, waiting to be added on.",
      examples: [
        { q: "Work out 24 × 3 by splitting.", steps: ["Split 24 into its place-value pieces: 20 and 4.", "Multiply each piece by 3: 20 × 3 = 60.", "And the other piece: 4 × 3 = 12.", "Add the two partial products: 60 + 12 = 72."], answer: "72" },
        { q: "Work out 47 × 6 by splitting.", steps: ["Split 47 into 40 and 7.", "40 × 6 = 240. Then 7 × 6 = 42.", "Add: 240 + 42 = 282."], answer: "282" },
        { q: "Work out 86 × 7 by splitting.", steps: ["Split 86 into 80 and 6.", "80 × 7 = 560. Then 6 × 7 = 42.", "Add: 560 + 42 = 602."], answer: "602" },
      ],
      tryit: { q: "Use splitting to work out 34 × 7.", answer: "(30 × 7) + (4 × 7) = 210 + 28 = 238." },
    },
    {
      h: "4. Seeing the split as a rectangle",
      body: [
        "Splitting can feel like magic the first time, so here is a picture that shows why it always works. Remember the array from Section 1, the block of dots? We can use a rectangle in exactly the same way.",
        "Picture 23 × 6 as a rectangle that is 23 boxes wide and 6 boxes tall. The total number of little boxes inside is the answer we want. Now draw one line down the rectangle to chop it into two smaller rectangles: one that is 20 wide and one that is 3 wide. Both are still 6 tall.",
        "The left rectangle holds 20 × 6 = 120 boxes. The right rectangle holds 3 × 6 = 18 boxes. Slide them back together and you have all the boxes, so the whole rectangle is 120 + 18 = 138. The picture and the splitting give the same answer, because they are the same idea.",
        "This rectangle picture is worth remembering, because in a moment we are going to split BOTH sides of the rectangle, and it will make that step much easier to trust.",
      ],
      note: "If you ever forget why splitting works, quietly draw a rectangle and chop it up. A shape that you can see cannot lie to you.",
      tryit: { q: "Imagine a rectangle 45 wide and 8 tall. Split the 45 into 40 and 5. What are the two partial products, and what is the total?", answer: "40 × 8 = 320 and 5 × 8 = 40. Total: 320 + 40 = 360." },
    },
    {
      h: "5. More practice with a one-digit multiplier",
      body: [
        "Before we make things bigger, let us get really comfortable splitting when we are multiplying by a single digit. The steps are always the same three, every single time.",
        "Step one: split the big number into its tens and ones. Step two: multiply each piece by the single digit, using your times tables. Step three: add the partial products together. That is the whole recipe.",
        "Watch it work on 53 × 6. Split 53 into 50 and 3. Then 50 × 6 = 300, and 3 × 6 = 18. Add them: 300 + 18 = 318. Done.",
        "A quick tip for the tens piece. To do 50 × 6, first do the easy fact 5 × 6 = 30, then pop a zero on the end to make 300. Multiplying by a 'tens' number is just a times-table fact wearing an extra zero.",
      ],
      note: "50 × 6 is just 5 × 6 with a nought stuck on the end. 5 × 6 = 30, so 50 × 6 = 300. That little zero trick saves a lot of thinking.",
      examples: [
        { q: "Work out 28 × 5 by splitting.", steps: ["Split 28 into 20 and 8.", "20 × 5: think 2 × 5 = 10, add a zero, so 100.", "8 × 5 = 40.", "Add the partial products: 100 + 40 = 140."], answer: "140" },
        { q: "Work out 64 × 5 by splitting.", steps: ["Split 64 into 60 and 4.", "60 × 5 = 300. Then 4 × 5 = 20.", "Add: 300 + 20 = 320."], answer: "320" },
        { q: "Work out 135 × 4 by splitting into hundreds, tens and ones.", steps: ["Split 135 into 100, 30 and 5.", "100 × 4 = 400. Then 30 × 4 = 120. Then 5 × 4 = 20.", "Add all three: 400 + 120 + 20 = 540."], answer: "540" },
      ],
      tryit: { q: "Use splitting to work out 45 × 8.", answer: "(40 × 8) + (5 × 8) = 320 + 40 = 360." },
    },
    {
      h: "6. Multiplying by a two-digit number",
      body: [
        "Now for the big step, and it is smaller than it looks. What if BOTH numbers are large, like 47 × 23? The trick is the same as before, only now we split the number we are multiplying BY.",
        "The number you are multiplying by has a name: it is called the multiplier. In 47 × 23, the 23 is the multiplier, because we want '47 groups of 23'. We split that 23 into 20 and 3, just as we split numbers before.",
        "Now we multiply the whole 47 by each piece of the multiplier. First 47 × 20, then 47 × 3. Then, you guessed it, we add the two partial products together.",
        "Let us do it. 47 × 20 = 940 (think 47 × 2 = 94, then add a zero). And 47 × 3 = 141. Add the partial products: 940 + 141 = 1081. So 47 × 23 = 1081. Two ordinary multiplies and one addition, and the scary-looking sum is finished.",
        "Remember the rectangle from Section 4? This is that same rectangle, but now chopped into pieces along both directions. Every partial product is just one piece of the rectangle, and adding them all up fills the whole shape.",
      ],
      examples: [
        { q: "Work out 36 × 24 by splitting the multiplier.", steps: ["Split the multiplier 24 into 20 and 4.", "Multiply 36 by the first piece: 36 × 20 = 720 (36 × 2 = 72, add a zero).", "Multiply 36 by the second piece: 36 × 4 = 144.", "Add the two partial products: 720 + 144 = 864."], answer: "864" },
        { q: "Work out 45 × 13 by splitting the multiplier.", steps: ["Split 13 into 10 and 3.", "45 × 10 = 450. Then 45 × 3 = 135.", "Add: 450 + 135 = 585."], answer: "585" },
        { q: "Work out 57 × 28 by splitting the multiplier.", steps: ["Split 28 into 20 and 8.", "57 × 20 = 1140 (57 × 2 = 114, add a zero).", "57 × 8 = 456 (split: 50×8=400, 7×8=56; 400+56=456).", "Add: 1140 + 456 = 1596."], answer: "1596" },
      ],
      tryit: { q: "Work out 54 × 21 by splitting the 21 into 20 and 1.", answer: "(54 × 20) + (54 × 1) = 1080 + 54 = 1134." },
    },
    {
      h: "7. The 'tens trap', the mistake almost everyone makes",
      body: [
        "There is one slip that catches nearly every learner, so let us shine a bright light on it. When you split a two-digit multiplier into its tens and ones, the tens digit must be multiplied by its FULL value, not by the bare little digit you see written.",
        "In 47 × 23, the tens part of 23 looks like a '2', but it is really worth 20 (remember the place value from Section 3, two 10p coins). So the partial product is 47 × 20 = 940. If you carelessly did 47 × 2 = 94, your answer would come out about ten times too small, and the whole thing would be wrong.",
        "Here is a way to never fall in. Before you multiply, quietly say what each piece is really worth. 'The 2 is really 20.' 'The 5 in 53 is really 50.' If you always name the true value first, you will multiply by the right thing.",
        "So the safe habit is: never multiply by a lonely tens digit. Always give it its zero and multiply by 20, 30, 40 and so on. The zero is not decoration, it is the difference between right and wrong.",
      ],
      note: "The tens digit is a giant in disguise. That little '2' at the front of 23 is really a 20. Always multiply by the giant, never the disguise.",
      tryit: { q: "In 68 × 32, what is the tens part of the multiplier really worth, and what is that partial product?", answer: "The 3 is really worth 30, so the partial product is 68 × 30 = 2040 (68 × 3 = 204, add a zero)." },
    },
    {
      h: "8. Estimate first to catch mistakes",
      body: [
        "Here is a habit that top mathematicians use all the time, and it takes only a few seconds. Before doing the real calculation, make a quick rough guess of the answer. This rough guess is called an estimate.",
        "You make an estimate by rounding. Rounding means nudging a number to a nearby 'tidy' number that is easy to work with, usually the nearest ten. So 47 rounds up to 50, and 23 rounds down to 20, because 47 is close to 50 and 23 is close to 20.",
        "For 47 × 23, round to 50 × 20. That is easy: 5 × 2 = 10, then add the two zeros to get 1000. So we expect an answer somewhere near 1000. When our real working gave 1081, that sits nicely near 1000, so we can relax, it looks right.",
        "Now see how the estimate rescues you. Suppose you had fallen into the tens trap and got 108, or slipped with a zero and got 10,810. Your estimate of 1000 would instantly wave a red flag, because 108 is far too small and 10,810 is far too big. The estimate does not give the exact answer, it just tells you whether your real answer is sensible.",
        "So the golden order is: estimate first, calculate second, then check your real answer against the estimate. It is like glancing at a map before a journey so you notice at once if you set off the wrong way.",
      ],
      note: "Estimate, then calculate, then compare. If the real answer is nowhere near the estimate, do not panic, just hunt for the slip. Usually it is a lost or an extra zero.",
      examples: [
        { q: "Estimate 48 × 31, then work out the exact answer and check it against your estimate.", steps: ["Round both numbers: 48 rounds to 50, and 31 rounds to 30.", "Estimate: 50 × 30 = 1500 (5 × 3 = 15, add two zeros).", "Now the exact answer by splitting 31 into 30 and 1: 48 × 30 = 1440, and 48 × 1 = 48.", "Add the partial products: 1440 + 48 = 1488.", "Check: 1488 is very close to the estimate of 1500, so it looks right."], answer: "1488" },
        { q: "Estimate 73 × 42, then find the exact answer and compare.", steps: ["Estimate: 70 × 40 = 2800.", "Exact: split 42 into 40 and 2. 73 × 40 = 2920, 73 × 2 = 146.", "Add: 2920 + 146 = 3066.", "Check: 3066 is a bit more than 2800 — that makes sense because we rounded both numbers down."], answer: "3066 (estimate 2800)." },
        { q: "Estimate 87 × 56, then find the exact answer and compare.", steps: ["Estimate: 90 × 60 = 5400 (9 × 6 = 54, add two zeros).", "Exact: split 56 into 50 and 6. 87 × 50 = 4350, 87 × 6 = 522.", "Add: 4350 + 522 = 4872.", "Check: 4872 is somewhat less than the estimate of 5400 — that makes sense because we rounded both numbers up."], answer: "4872 (estimate 5400)." },
      ],
      tryit: { q: "Estimate 62 × 19 by rounding each number to the nearest ten.", answer: "60 × 20 = 1200." },
    },
    {
      h: "9. Putting the whole recipe together",
      body: [
        "You now know everything you need, so let us gather it into one clear recipe you can follow for any multiply, however big it looks.",
        "First, estimate. Round both numbers and work out a rough answer to expect. Second, split the multiplier into its tens and ones, giving the tens their full value with the zero. Third, multiply the big number by each piece to get your partial products. Fourth, add the partial products together. Fifth, check your answer against the estimate from step one.",
        "Let us run the full recipe on 63 × 29. Estimate: 60 × 30 = 1800. Split the multiplier 29 into 20 and 9. Partial products: 63 × 20 = 1260, and 63 × 9 = 567. Add them: 1260 + 567 = 1827. Check: 1827 is very close to 1800, so we are confident it is right.",
        "That is column multiplication. There was never a big scary multiply hiding in there. It was only ever a few times-table facts, given their proper place values, and added up carefully. Any multiplication in the world, no matter how huge, comes apart into exactly these small friendly pieces.",
      ],
      note: "The five steps in order: Estimate, Split, Multiply, Add, Check. Do them in that order every time and big multiplications stop being scary.",
      tryit: { q: "Use the full recipe on 52 × 34: estimate first, then split, multiply, add, and check.", answer: "Estimate: 50 × 30 = 1500. Split 34 into 30 and 4. Partial products: 52 × 30 = 1560 and 52 × 4 = 208. Add: 1560 + 208 = 1768. Check: 1768 is close to 1500, so it is sensible." },
    },
  ],
};

PRIMARY_LESSONS.formalDivision = {
  title: "Long Division: building up to the answer, jump by jump",
  minutes: 18,
  intro: "Dividing a big number can feel scary, but it is really just splitting into fair, equal parts. In this lesson we will start from the very beginning, with sweets and number lines, and build up slowly until you can divide big numbers with confidence. Take your time and try each checkpoint as you go.",
  sections: [
    {
      h: "1. What dividing really means",
      body: [
        "Dividing is a way of splitting a number into equal parts. When you divide, you are really asking one of two fair questions, and the lovely thing is that both give the same answer.",
        "The first question is about SHARING. Imagine you have 12 sweets and 3 friends, and you want everyone to get the same amount. You deal them out one at a time, like playing cards, until they are all gone. Each friend ends up with 4 sweets. So 12 shared between 3 is 4.",
        "The second question is about GROUPING. Take those same 12 sweets, but this time put them into little bags of 3. How many bags can you fill? You can fill 4 bags. So 12 split into groups of 3 is also 4. Same answer, different picture in your head.",
        "We write both of these the same way: 12 ÷ 3 = 4. The little ÷ sign just means 'divided by', and you can read it out loud as 'twelve divided by three'.",
        "Three quick words to know. The number you start with (the 12) is called the DIVIDEND. The number you are dividing by (the 3) is called the DIVISOR. The answer you get (the 4) is called the QUOTIENT. You do not need to memorise these names, but you will meet them again so it helps to have seen them.",
      ],
      note: "Sharing and grouping always give the same answer, so pick whichever picture is easier to imagine for the numbers in front of you.",
      tryit: { q: "You have 20 stickers to share equally between 4 people. How many does each person get?", answer: "5 each, because 4 groups of 5 make 20." },
    },
    {
      h: "2. Picturing division on a number line",
      body: [
        "Here is a third way to see dividing, and it uses a number line. A number line is just a straight line with numbers marked along it in order, a bit like a ruler.",
        "To work out 20 ÷ 5, start at 0 and hop along the line in equal jumps of 5. Your hops land on 5, then 10, then 15, then 20. Now count the hops: 1, 2, 3, 4. You made 4 hops to reach 20, so 20 ÷ 5 = 4.",
        "This shows what dividing is really about: how many times one number fits inside another. The question 'how many 5s fit inside 20?' has the answer 4.",
        "You can even do the same thing backwards by taking away. Start at 20 and keep subtracting 5: 20, then 15, then 10, then 5, then 0. You took 5 away four times before you reached 0. Four again, every way you look at it.",
      ],
      note: "Whenever you read '20 ÷ 5', try saying it in your head as 'how many 5s fit inside 20?' That question makes division feel much friendlier.",
      tryit: { q: "Using jumps of 3 along a number line, how many jumps take you from 0 to 18? What division does that show?", answer: "6 jumps (3, 6, 9, 12, 15, 18), so 18 ÷ 3 = 6." },
    },
    {
      h: "3. Friendly multiples: your building blocks",
      body: [
        "A MULTIPLE of a number is what you get when you times it by a whole number. The multiples of 8 are 8, 16, 24, 32 and so on, because they are 8 × 1, 8 × 2, 8 × 3, 8 × 4.",
        "When we divide bigger numbers, we do not want to hop along one small jump at a time. That would take ages. Instead we take big, friendly jumps using multiples we can work out quickly.",
        "The friendliest multiples to use are ×10, ×5 and ×2, because they are so fast. Times by 10 just puts a zero on the end (8 × 10 = 80). Times by 5 is half of the ×10 answer (8 × 5 = 40). Times by 2 is simply doubling (8 × 2 = 16).",
        "So the whole plan for dividing a big number is this: take the biggest friendly jump you can without going past your target, see how much is left, then take another jump. Keep going until you arrive.",
      ],
      note: "×10 is your best friend. Take as many tens as you can first, because each ten does a lot of the work in one go.",
      tryit: { q: "What are the first five multiples of 6?", answer: "6, 12, 18, 24, 30." },
    },
    {
      h: "4. Building up to divide a bigger number",
      body: [
        "Now we put it together. Let us divide 156 by 12. In plain words: how many 12s fit inside 156? We build up the answer with friendly jumps.",
        "Start with a big jump. 12 × 10 = 120. That fits inside 156 with room to spare, so we take it. How much is left? 156 − 120 = 36.",
        "Now a smaller jump to mop up the 36 that is left. 12 × 3 = 36 exactly. That uses up everything, so we can stop.",
        "Finally, add up the jumps we made: 10 twelves and then 3 more twelves. That is 10 + 3 = 13 twelves altogether. So 156 ÷ 12 = 13.",
        "Notice that we never guessed wildly. We just took the biggest tidy jump each time and kept track of what was left. That is all long division is.",
      ],
      examples: [
        { q: "Divide 184 by 8 by building up friendly jumps.", steps: ["Big jump: 8 × 20 = 160. Left over: 184 − 160 = 24.", "Small jump: 8 × 3 = 24 exactly, so we can stop.", "Add the jumps together: 20 + 3 = 23."], answer: "23" },
        { q: "Divide 195 by 5 using friendly jumps.", steps: ["Big jump: 5 × 30 = 150. Left over: 195 − 150 = 45.", "Small jump: 5 × 9 = 45 exactly.", "Add the jumps: 30 + 9 = 39."], answer: "39" },
        { q: "Divide 336 by 7 using friendly jumps.", steps: ["Big jump: 7 × 40 = 280. Left over: 336 − 280 = 56.", "Small jump: 7 × 8 = 56 exactly.", "Add the jumps: 40 + 8 = 48."], answer: "48" },
      ],
      tryit: { q: "Divide 96 by 4 by building up jumps.", answer: "24. (4 × 20 = 80, leaving 16; then 4 × 4 = 16; so 20 + 4 = 24.)" },
    },
    {
      h: "5. Checking your answer by multiplying back",
      body: [
        "Division and multiplication are opposites, a bit like putting your shoes on and taking them off. This means you can always check a division by multiplying your answer back.",
        "We just said 156 ÷ 12 = 13. To check, do 12 × 13. If we are right, that should take us straight back to 156. And indeed 12 × 13 = 156. It matches, so we can trust our answer.",
        "Getting into the habit of checking is one of the best things you can do. It catches almost every silly slip before it costs you a mark, and it only takes a few seconds.",
      ],
      note: "Answer × divisor should give you back the dividend (the number you started with). If it does not, something has gone wrong and it is worth another look.",
      tryit: { q: "You worked out 84 ÷ 7 = 12. Check it by multiplying back.", answer: "7 × 12 = 84, which matches the number we started with, so the answer is correct." },
    },
    {
      h: "6. When it does not divide evenly: remainders",
      body: [
        "Sometimes the friendly jumps do not land exactly on your target. Whatever is left over at the very end, once no more whole divisors will fit, is called the REMAINDER.",
        "Picture sharing 13 sweets between 4 children. Each child gets 3 sweets (that uses up 12), and there is 1 sweet left over that cannot be split fairly. That leftover 1 is the remainder. We write it as 13 ÷ 4 = 3 remainder 1.",
        "Let us try a bigger one. Divide 175 by 8. Big jump: 8 × 20 = 160, leaving 175 − 160 = 15. Smaller jump: 8 × 1 = 8, leaving 15 − 8 = 7. Now 7 is smaller than 8, so not even one more 8 will fit. We stop.",
        "Add the jumps: 20 + 1 = 21, and 7 is left over. So 175 ÷ 8 = 21 remainder 7.",
        "There is one golden rule for remainders: the remainder must always be SMALLER than the divisor. If it is the same size or bigger, then another whole jump still fits, which means you have stopped too soon.",
      ],
      note: "If your remainder is as big as, or bigger than, the number you are dividing by, go back and look again, because you can fit in at least one more.",
      examples: [
        { q: "Divide 97 by 6, giving a whole number and a remainder.", steps: ["6 × 10 = 60, leaving 97 − 60 = 37.", "6 × 6 = 36, leaving 37 − 36 = 1.", "1 is smaller than 6, so stop. Jumps: 10 + 6 = 16.", "Check: 6 × 16 = 96, and 96 + 1 = 97."], answer: "16 remainder 1" },
        { q: "Divide 145 by 9, giving a whole number and a remainder.", steps: ["9 × 10 = 90, leaving 145 − 90 = 55.", "9 × 6 = 54, leaving 55 − 54 = 1.", "1 is smaller than 9. Jumps: 10 + 6 = 16.", "Check: 9 × 16 = 144, and 144 + 1 = 145. ✓"], answer: "16 remainder 1" },
        { q: "Divide 253 by 11, giving a whole number and a remainder.", steps: ["11 × 20 = 220, leaving 253 − 220 = 33.", "11 × 3 = 33 exactly.", "Jumps: 20 + 3 = 23.", "Check: 11 × 23 = 253, remainder 0. ✓"], answer: "23 remainder 0 (exact division)." },
      ],
      tryit: { q: "Divide 50 by 8, giving a whole number and a remainder.", answer: "6 remainder 2 (8 × 6 = 48, and 50 − 48 = 2)." },
    },
    {
      h: "7. Turning a remainder into a decimal",
      body: [
        "Sometimes we do not want a leftover at all. We want to keep sharing until everything is used up, even if that means cutting things into smaller pieces. That is when we use a decimal answer.",
        "A decimal point is the little dot that lets us write numbers smaller than 1, like 0.5 (a half) or 0.25 (a quarter). Money works this way too: £1.50 means one pound and fifty pence, which is one and a half pounds.",
        "Picture sharing 9 chocolate bars between 4 friends. Each friend gets 2 whole bars (that uses up 8), and 1 bar is left. Instead of leaving it, we cut that last bar into 4 equal pieces so everyone gets a quarter more. Each friend gets 2 and a quarter bars, which we write as 2.25.",
        "The written method just carries on past the whole part. Take 175 ÷ 8 again. The whole part was 21 remainder 7. Now we share out that leftover 7 as well: 7 ÷ 8 = 0.875. So 175 ÷ 8 = 21.875, with nothing left over at all.",
      ],
      examples: [
        { q: "Divide 45 by 4, giving the answer as a decimal.", steps: ["Whole part first: 4 × 11 = 44, leaving a remainder of 1.", "Share out the leftover 1: 1 ÷ 4 = 0.25.", "Put them together: 45 ÷ 4 = 11.25.", "Check: 4 × 11.25 = 45."], answer: "11.25" },
        { q: "Divide 50 by 8, giving the answer as a decimal.", steps: ["Whole part: 8 × 6 = 48, remainder 2.", "Share the leftover 2: 2 ÷ 8 = 0.25.", "Combined: 50 ÷ 8 = 6.25.", "Check: 8 × 6.25 = 50. ✓"], answer: "6.25" },
        { q: "Divide 75 by 6, giving the answer as a decimal.", steps: ["Whole part: 6 × 12 = 72, remainder 3.", "Share the leftover 3: 3 ÷ 6 = 0.5.", "Combined: 75 ÷ 6 = 12.5.", "Check: 6 × 12.5 = 75. ✓"], answer: "12.5" },
      ],
      tryit: { q: "Divide 30 by 4, giving the answer as a decimal.", answer: "7.5 (4 × 7 = 28, leftover 2, and 2 ÷ 4 = 0.5)." },
    },
    {
      h: "8. A handy trick: doubling both numbers",
      body: [
        "Here is a trick that makes awkward divisions much friendlier. If you double BOTH numbers in a division, the answer stays exactly the same.",
        "Why does that work? Think of it as sharing biscuits. If you have twice as many biscuits AND twice as many friends, everyone still gets the same amount each. Both sides grew by the same amount, so the fair share does not change at all.",
        "This is brilliant for getting rid of an awkward decimal divisor. 84 ÷ 3.5 looks nasty because of the 3.5. Double both numbers: 84 becomes 168, and 3.5 becomes a tidy 7. Now 168 ÷ 7 = 24, which is much easier, and it is exactly the right answer.",
        "The trick also works the other way with halving. Halving both numbers keeps the answer the same too, which can shrink big numbers down to a friendly size. 250 ÷ 50 becomes 125 ÷ 25, which is just 5.",
        "The one thing to remember is fairness: whatever you do to one number, you must do to the other number as well. Double one and leave the other alone and the answer will be wrong.",
      ],
      note: "Doubling or halving is only allowed if you do the SAME thing to both numbers. Change just one of them and you have changed the whole question.",
      examples: [
        { q: "Use doubling to turn 96 ÷ 1.5 into an easy division, then solve it.", steps: ["Double both numbers: 96 becomes 192, and 1.5 becomes 3.", "Now solve the friendly version: 192 ÷ 3 = 64.", "Check: 1.5 × 64 = 96."], answer: "64" },
        { q: "Work out 56 ÷ 0.5 by multiplying both numbers to remove the decimal.", steps: ["Multiply both by 2: 56 becomes 112, and 0.5 becomes 1.", "112 ÷ 1 = 112.", "Check: 0.5 × 112 = 56. ✓"], answer: "112" },
        { q: "Work out 7.2 ÷ 0.4 by multiplying both numbers to remove the decimals.", steps: ["Multiply both by 10: 7.2 becomes 72, and 0.4 becomes 4.", "Now solve: 72 ÷ 4 = 18.", "Check: 0.4 × 18 = 7.2. ✓"], answer: "18" },
      ],
      tryit: { q: "Use doubling to turn 60 ÷ 2.5 into a whole-number division, then solve it.", answer: "Double both: 120 ÷ 5 = 24." },
    },
  ],
};

PRIMARY_LESSONS.logicGrid = {
  title: "Logic Puzzles: combining every clue at once",
  minutes: 16,
  intro: "A logic puzzle gives you a handful of hints and asks you to work out who has what, or what goes where. The secret is that no single hint hands you the whole answer. You have to gently squeeze every hint together, letting each one knock out a few wrong ideas, until only the right answer is left standing. In this lesson we will build that skill up slowly, starting from the very beginning.",
  sections: [
    {
      h: "1. What is a clue, and what is a possibility?",
      body: [
        "Imagine three friends called Amir, Bo and Chen. Each one likes a different fruit, and the fruits are apple, banana and cherry. Nobody has told you yet who likes what. A logic puzzle is exactly this kind of question: some things are true, and your job is to figure out which.",
        "Two words will come up again and again, so let us pin them down right now. A CLUE is a hint the puzzle gives you, like 'Amir does not like banana'. A POSSIBILITY is one of the guesses that MIGHT be true before you know for sure, like 'maybe Amir likes apple' or 'maybe Amir likes cherry'.",
        "Think of yourself as a detective. A detective does not magically know who did it. Instead they collect little clues, and each clue lets them cross a suspect off the list. You are going to do the very same thing, only with fruit and friends instead of a mystery.",
        "Here is a friendlier version of the same idea. Picture the last biscuit going missing from the tin. You did not see it happen, but you know Grandpa was asleep, so it was not him. That is a clue, and it just removed one possibility. Logic puzzles are only that trick, done a few times in a row.",
      ],
      note: "A clue almost never says the final answer straight out. Its real job is to knock out wrong ideas, one at a time.",
      tryit: { q: "In the fruit puzzle, which of these is a CLUE and which is a POSSIBILITY? (a) 'Bo likes cherry.' (b) 'Maybe Chen likes apple.'", answer: "(a) is a clue, because the puzzle is telling you it is true. (b) is a possibility, because it is just a guess you have not checked yet." },
    },
    {
      h: "2. List every possibility first",
      body: [
        "When you start a puzzle it is very tempting to stare at the clues and try to leap straight to the answer. That is the hard way. The easy way is to first write down EVERY possibility, even the silly-looking ones, so you have a full list to cross things off.",
        "Think about tidying a box of building blocks. It is much easier to sort them when you have tipped them all out and can see every block, rather than pulling them out one at a time and trying to remember what is still inside. Listing all the possibilities is you tipping the box out.",
        "For our fruit puzzle, each friend could like apple, banana or cherry, so before any clue you would say: Amir might like apple, banana or cherry. Bo might like apple, banana or cherry. Chen might like apple, banana or cherry. Now nothing can hide from you, because it is all written down.",
        "The reason this helps so much is that crossing an idea off a list is easy and satisfying, but trying to build the right answer out of thin air is slow and easy to get wrong. Always give yourself the full list to work from.",
      ],
      tryit: { q: "Tom and Zoe each get a different coloured hat. The hats are red and blue. Write down every possible way to give out the hats. How many ways are there?", answer: "Two ways. Either Tom gets red and Zoe gets blue, or Tom gets blue and Zoe gets red." },
    },
    {
      h: "3. Draw a grid to keep track",
      body: [
        "Once a puzzle has more than a couple of things in it, your memory will start to wobble. This is where a GRID helps. A grid is just a table of boxes, with the people written down the side and the choices written along the top.",
        "For the fruit puzzle you would draw a little square split into rows and columns. Down the left you write Amir, Bo and Chen. Along the top you write apple, banana and cherry. That gives you nine small boxes, one for every possibility, like a noughts-and-crosses board.",
        "Each box answers one yes-or-no question, such as 'Does Amir like apple?'. When you learn something is NOT true, you put a small cross in that box. When you learn something IS true, you put a tick in that box. The grid remembers everything for you, so your brain does not have to.",
        "There is one lovely rule that makes grids powerful. Each person likes exactly one fruit, and each fruit is liked by exactly one person. So the moment you put a tick in a box, you can put crosses all along the rest of that row AND all the way down that column, because nothing else in that line can be true.",
      ],
      note: "One tick, then cross out the rest of that row and the rest of that column. A single tick often clears away three or four boxes at once.",
      examples: [
        { q: "You have a grid with Amir, Bo, Chen down the side and apple, banana, cherry along the top. You discover that Chen likes cherry. What can you fill in straight away?", steps: ["Put a tick in the box where Chen's row meets the cherry column.", "Now cross out the rest of Chen's row, because Chen cannot like apple or banana as well.", "Now cross out the rest of the cherry column, because Amir and Bo cannot like cherry if Chen does.", "From one single fact you have already filled in five boxes: one tick and four crosses."], answer: "Chen = cherry (tick), plus crosses on Chen-apple, Chen-banana, Amir-cherry and Bo-cherry." },
        { q: "In a 4×4 grid (people: Amy, Ben, Cal, Dan; jobs: teacher, baker, nurse, driver), you discover Cal is the nurse. How many boxes can you fill in straight away?", steps: ["Tick Cal = nurse (1 box).", "Cross out the rest of Cal's row: Cal-teacher, Cal-baker, Cal-driver (3 more boxes).", "Cross out the rest of the nurse column: Amy-nurse, Ben-nurse, Dan-nurse (3 more boxes).", "Total: 1 tick and 6 crosses = 7 boxes filled from one single fact."], answer: "7 boxes: Cal=nurse (tick), plus crosses on Cal-teacher, Cal-baker, Cal-driver, Amy-nurse, Ben-nurse and Dan-nurse." },
        { q: "In a 3×3 grid (people: Alex, Beth, Carl; colours: red, green, blue), you know two things: Alex=red, and Beth is not green. Use the tick-and-cross rule to solve the puzzle completely.", steps: ["Alex=red: tick, then cross Alex-green, Alex-blue, Beth-red and Carl-red.", "Beth ≠ green: cross Beth-green. Beth's row now has only blue un-crossed: Beth=blue.", "Cross Carl-blue. Only Carl-green remains in Carl's row: Carl=green."], answer: "Alex=red, Beth=blue, Carl=green." },
      ],
    },
    {
      h: "4. Use each clue to cross things off",
      body: [
        "Now the main event. Take your clues one at a time, and for each clue put in every tick and cross it allows. Do not rush ahead to the next clue until you have squeezed everything out of the one in front of you.",
        "Remember, a clue does not have to name the answer to be useful. 'Amir does not like banana' never tells you what Amir DOES like, but it still lets you cross out one box, and that cross might be exactly what you need later.",
        "Let us solve a whole puzzle together, slowly. The three friends each like a different fruit from apple, banana and cherry. Clue 1: Amir does not like banana. Clue 2: Bo does not like apple. Clue 3: Chen likes cherry. Work through the worked example below and follow every step with your finger on an imaginary grid.",
        "Notice how each clue on its own felt weak, almost useless, but together they cornered the answer completely. That is the whole idea of a logic puzzle in one word: TOGETHER.",
      ],
      examples: [
        { q: "Amir, Bo and Chen each like a different fruit from apple, banana, cherry. Clue 1: Amir does not like banana. Clue 2: Bo does not like apple. Clue 3: Chen likes cherry. Who likes what?", steps: ["Start with Clue 3, because it is a positive fact. Tick Chen = cherry, then cross out cherry for Amir and Bo.", "Now look at Amir. Clue 1 says not banana, and we have just crossed out cherry for him. The only box left in Amir's row is apple, so Amir = apple.", "Now look at Bo. Clue 2 says not apple, and cherry is already crossed out for him. The only box left in Bo's row is banana, so Bo = banana.", "Every friend now has exactly one fruit and none of them clash."], answer: "Amir: apple, Bo: banana, Chen: cherry" },
        { q: "Ed, Fay and Greg each study a different subject: history, science or geography. Clue 1: Ed studies history. Clue 2: Fay does not study science. Who studies what?", steps: ["Clue 1: Ed=history. Cross out history for Fay and Greg.", "Look at Fay: not science (Clue 2), not history (gone). Only geography is left. Fay=geography.", "Greg: history and geography are both taken. Greg=science."], answer: "Ed: history, Fay: geography, Greg: science." },
        { q: "Ivan, Jade and Kim each own a different pet: dog, cat or rabbit. Clue 1: Ivan does not own a dog. Clue 2: Jade does not own a cat. Clue 3: Kim does not own the rabbit. Clue 4: Jade does not own a rabbit. Who owns what?", steps: ["Clues 3 and 4 say Kim ≠ rabbit and Jade ≠ rabbit. So the rabbit must belong to Ivan.", "Ivan=rabbit. Cross dog (already gone by Clue 1) and cat for Ivan.", "Jade: not cat (Clue 2), not rabbit (gone). Only dog left. Jade=dog.", "Kim: rabbit and dog are taken. Kim=cat.", "Check every clue: all satisfied."], answer: "Ivan: rabbit, Jade: dog, Kim: cat." },
      ],
      tryit: { q: "Ann, Ben and Cara each own a different pet: a cat, a dog and a fish. Clue: Ann owns the dog. Which two pets are left to share between Ben and Cara?", answer: "The cat and the fish. Ann has taken the dog, so Ben and Cara must each have one of the two that are left." },
    },
    {
      h: "5. Negative clues are just as useful",
      body: [
        "Beginners often skim past clues that contain the words 'not', 'does not' or 'is not', because those clues feel like they are hiding something. This is a mistake. A NEGATIVE CLUE (a clue that tells you something is NOT true) does exactly the same job as a positive one: it lets you put a cross in a box.",
        "Here is a neat trick with negative clues. If there are only two choices left and a clue rules ONE of them out, then the OTHER one must be true. Cross out the 'not' box, and the last box standing gets a tick.",
        "Picture three friends standing in a line by height. If you are told 'Sam is not the tallest and Sam is not the shortest', then without anyone telling you directly, you know Sam must be the one in the middle. Two crosses left only one box, so it became a tick.",
        "So treat 'not' as a friend, not a nuisance. Every 'not' you are given is a free cross, and crosses win puzzles just as surely as ticks do.",
      ],
      note: "Two choices left, and a clue says 'not' to one of them? Then the other one is definitely true. A 'not' can quietly become a 'yes'.",
      tryit: { q: "Three runners X, Y and Z finish first, second and third. Clue 1: Z does not finish first. Clue 2: X does not finish third. Clue 3: Y finishes second. Work out the full finishing order.", answer: "Y is second (Clue 3). That leaves first and third for X and Z. Clue 2 says X is not third, so X is first, which leaves Z third. Order: X first, Y second, Z third. (Check Clue 1: Z is not first, correct.)" },
    },
    {
      h: "6. One clue often unlocks the next",
      body: [
        "Sometimes a clue does nothing at all when you first read it, then suddenly becomes powerful once another clue has filled in a box or two. This is called CHAINING, which just means using what you have already worked out to squeeze more out of a clue you had parked.",
        "It is a bit like dominoes standing in a row. You push the first one over, and it knocks the next, which knocks the next. In a puzzle, one small fact you nail down can topple two or three more facts straight after it.",
        "Because of this, if you get stuck, do not give up. Go back to the very start and read every clue again from the top. A clue that was useless on your first pass is often bursting with information now that your grid has more ticks and crosses in it.",
        "Work through the worked example below to feel a chain in action. Watch how the answer to Max unlocks the answer to Lily, which then unlocks Nina.",
      ],
      examples: [
        { q: "Lily, Max and Nina each chose a different balloon: red, green or blue. Clue 1: Max's balloon is not red and not green. Clue 2: Lily's balloon is not red. Who has which balloon?", steps: ["Start with Clue 1. If Max is not red and not green, the only colour left for Max is blue, so Max = blue.", "That fact unlocks Clue 2. Lily is not red (Clue 2), and blue is now taken by Max, so the only colour left for Lily is green, so Lily = green.", "Nina is the only friend left, and red is the only balloon left, so Nina = red.", "The chain went Max, then Lily, then Nina, each answer making the next one possible."], answer: "Lily: green, Max: blue, Nina: red" },
        { q: "Dan, Eva and Finn each play a different instrument: guitar, piano or violin. Clue 1: Dan does not play guitar or violin. Clue 2: Eva does not play guitar. Find who plays what, noticing how the chain works.", steps: ["Clue 1: Dan ≠ guitar and ≠ violin, so Dan=piano (the only one left).", "That unlocks Eva's row: piano is gone. Clue 2 says Eva ≠ guitar. Only violin is left. Eva=violin.", "Finn: guitar and piano are taken. Finn=guitar."], answer: "Dan: piano, Eva: violin, Finn: guitar." },
        { q: "Four people (Al, Beth, Cal, Dan) each have a different job card: chef, artist, doctor or pilot. Clue 1: Al is not the chef and not the artist. Clue 2: Beth is not the doctor. Clue 3: Cal is the pilot. Clue 4: Dan is not the chef. Use chaining to solve.", steps: ["Start with Clue 3 (positive fact): Cal=pilot. Cross pilot for Al, Beth, Dan.", "Clue 1: Al ≠ chef, ≠ artist, ≠ pilot (gone). Only doctor is left. Al=doctor.", "Cross doctor for Beth and Dan. Beth: not doctor (gone), not pilot (gone). Has chef or artist. No constraint removes one of these for Beth yet.", "Clue 4: Dan ≠ chef. Dan's choices are chef and artist (pilot and doctor are gone). Dan ≠ chef → Dan=artist.", "Beth: only chef is left. Beth=chef."], answer: "Al: doctor, Beth: chef, Cal: pilot, Dan: artist." },
      ],
      tryit: { q: "In that balloon puzzle, why was Clue 2 ('Lily is not red') not enough to solve Lily on its own, before you had worked out Max?", answer: "Because at the start Lily could still have been green OR blue, so 'not red' left two choices. Only after Max took blue did 'not red' leave just green for Lily. The first answer unlocked the second." },
    },
    {
      h: "7. Check your answer against every clue",
      body: [
        "When only one arrangement is left standing, you are nearly finished, but not quite. The last and most important step is to CHECK, which means reading every clue again and making sure your answer obeys all of them, not just the ones you happened to use.",
        "Think of it like checking your pockets before you leave the house. You feel for your key, your snack and your bus pass, one at a time, so nothing gets left behind. Here you feel through the clues one at a time and make sure your answer keeps every promise.",
        "Take our very first solved puzzle: Amir apple, Bo banana, Chen cherry. Check Clue 1, Amir does not like banana, correct because he has apple. Check Clue 2, Bo does not like apple, correct because he has banana. Check Clue 3, Chen likes cherry, correct. All three clues are happy, so the answer is truly solved.",
        "This final check is not showing off. It is how you catch a stray cross you put in the wrong box earlier. A puzzle is only properly solved when your answer pleases every single clue at the same time.",
      ],
      note: "Finding an answer is not the finish line. Reading every clue one last time and seeing it all fit is the finish line.",
      tryit: { q: "Someone solves a puzzle and says 'Amir likes apple' fits Clue 1 ('Amir does not like banana'), so they stop and call the puzzle done. What have they forgotten to do?", answer: "They have forgotten to check the answer against the OTHER clues too. One clue being happy is not enough. Every clue must be happy at once." },
    },
    {
      h: "8. Putting it all together",
      body: [
        "Let us gather the whole method into one clear plan you can use on any puzzle. Step one, list every possibility so nothing hides. Step two, draw a grid with people down the side and choices along the top. Step three, take each clue in turn and fill in ticks and crosses, remembering that one tick clears the rest of its row and column.",
        "Step four, treat every 'not' as a useful free cross. Step five, if you get stuck, read the clues again from the top, because a chain may be waiting to fall. Step six, once one answer survives, check it against every clue as your proof.",
        "A few slips catch everyone out, so watch for these. Do not hunt for a single magic clue that solves the whole thing, because that clue almost never exists. Do not ignore negative clues just because they say 'not'. Do not stop the moment one clue looks satisfied. And do not rub out or forget a cross halfway through, which is exactly why the written grid is so worth drawing.",
        "Do all this and logic puzzles stop feeling like guessing and start feeling like sweeping a floor: steady, tidy work where every clue clears a little more space until only the answer is left. Have a go at the final challenge below using the full six-step plan.",
      ],
      examples: [
        { q: "Rosa, Sam and Tess each have a different snack: crisps, grapes or a cookie. Clue 1: Rosa does not have crisps. Clue 2: Sam has the cookie. Clue 3: Rosa does not have the cookie. Who has which snack?", steps: ["Use Clue 2 first: tick Sam = cookie, then cross out cookie for Rosa and Tess.", "Look at Rosa. Clue 1 says not crisps, Clue 3 says not cookie, and cookie is already gone anyway. The only box left for Rosa is grapes, so Rosa = grapes.", "Tess is the only friend left and crisps is the only snack left, so Tess = crisps.", "Check every clue: Clue 1, Rosa not crisps, correct (grapes). Clue 2, Sam has cookie, correct. Clue 3, Rosa not cookie, correct. All happy."], answer: "Rosa: grapes, Sam: cookie, Tess: crisps" },
        { q: "A, B and C each eat a different meal: soup, salad or sandwich. Clue 1: A does not eat soup. Clue 2: B eats salad. Clue 3: C does not eat sandwich. Who eats what? Check every clue at the end.", steps: ["Clue 2: B=salad. Cross soup and sandwich for B.", "C: not sandwich (Clue 3). Salad is gone. Only soup is left. C=soup.", "A: salad and soup are taken. A=sandwich.", "Check: Clue 1 (A not soup) → A=sandwich ✓. Clue 2 (B=salad) ✓. Clue 3 (C not sandwich) → C=soup ✓. All happy."], answer: "A: sandwich, B: salad, C: soup." },
        { q: "Four teams (P, Q, R, S) each get a different colour vest: red, blue, green, yellow. Clue 1: P is not red and not blue. Clue 2: Q is not green. Clue 3: R is not yellow and not blue. Clue 4: S is green. Solve using the full six-step method and check all clues.", steps: ["Clue 4 (positive): S=green. Cross green for P, Q, R.", "Clue 1: P ≠ red, ≠ blue, ≠ green (gone). Only yellow is left. P=yellow. Cross yellow for Q, R, S.", "Clue 3: R ≠ yellow (gone), ≠ blue. R's remaining colours: red. R=red. Cross red for Q.", "Q: green (gone), yellow (gone), red (gone). Q=blue.", "Check: Clue 1 (P not red, not blue) → P=yellow ✓. Clue 2 (Q not green) → Q=blue ✓. Clue 3 (R not yellow, not blue) → R=red ✓. Clue 4 (S=green) ✓. All happy."], answer: "P: yellow, Q: blue, R: red, S: green." },
      ],
      tryit: { q: "Two children, Kit and Lou, sit on two chairs, one red and one green. Clue: Kit does not sit on the green chair. Where does each child sit?", answer: "Kit is not on the green chair, so Kit must be on the red chair. That leaves the green chair for Lou. Kit: red chair, Lou: green chair." },
    },
  ],
};

PRIMARY_LESSONS.combinatoricsCounting = {
  title: "Counting Possibilities: multiplying choices at each step",
  minutes: 18,
  intro: "Imagine you want to know how many different ways something can turn out, without having to write out every single one. That is what this lesson is about. We will start really slowly with just a few objects you can see and touch, and by the end you will have a neat trick for counting huge numbers of possibilities in your head. The whole idea will come down to one friendly little word: multiply.",
  sections: [
    {
      h: "1. What does 'how many possibilities' mean?",
      body: [
        "First, let us be sure what we are even asking. A 'possibility' is just one way something could turn out. If you flip a coin, there are two possibilities: it lands heads, or it lands tails. That is it, only two.",
        "Counting possibilities means working out how many different ways altogether something can happen. Not which one will happen, just how many different endings there could be.",
        "Here is a tiny example you can picture. You have a red T-shirt and a blue T-shirt, and you are going to wear exactly one of them today. How many different ways can you be dressed? Two: red, or blue. Easy so far, because you can just say them out loud.",
        "The reason we need a clever method is that real questions get big very fast. What if you also had to choose trousers, and shoes, and a hat? Saying every possibility out loud would take ages. So we are going to find a shortcut that always works.",
      ],
      note: "A 'possibility' just means one way things could turn out. Counting possibilities is counting how many different ways there are, not guessing which one happens.",
      tryit: { q: "You are rolling a normal six-sided dice once. How many different possibilities are there for the number on top?", answer: "6 (the numbers 1, 2, 3, 4, 5 or 6)." },
    },
    {
      h: "2. Two choices, one after another",
      body: [
        "Now let us add a second choice and watch what happens. You have 2 T-shirts (red and blue) and 2 hats (a cap and a woolly hat). You pick one T-shirt AND one hat. How many different outfits can you make?",
        "Let us not use any trick yet. Let us just carefully write out every outfit, so we can trust the answer. If you pick the red T-shirt, you could wear it with the cap, or with the woolly hat. That is 2 outfits already. If you pick the blue T-shirt, again you could wear the cap, or the woolly hat. That is 2 more outfits.",
        "So the full list is: red and cap, red and woolly, blue and cap, blue and woolly. Count them: that is 4 different outfits.",
        "Look closely at why it came out as 4. There were 2 T-shirts, and for EACH T-shirt there were 2 hats to go with it. So the hats got counted twice, once for the red and once for the blue. Two lots of two is four. That is the whole secret, hiding in plain sight.",
      ],
      tryit: { q: "You have 2 flavours of ice cream (vanilla and chocolate) and 2 toppings (sprinkles and sauce). You pick one flavour and one topping. Write out all the possibilities and count them.", answer: "4 (vanilla with sprinkles, vanilla with sauce, chocolate with sprinkles, chocolate with sauce)." },
    },
    {
      h: "3. The tree of choices",
      body: [
        "Here is another way to picture the same thing, and lots of children find it clearer. Imagine a little tree of choices growing in front of you.",
        "Start at the bottom. Your first choice is the T-shirt, so the tree splits into 2 branches: one branch for red, one branch for blue. Now, at the end of EACH of those branches, you make your second choice, the hat. So each branch splits again into 2 smaller branches: one for the cap, one for the woolly hat.",
        "Count the very tips at the top of the tree. The red branch grew 2 tips, and the blue branch grew 2 tips, so there are 4 tips in total. Each tip is one complete outfit. Four tips, four outfits. Same answer as before, seen a different way.",
        "The lovely thing about the tree is that it shows you WHY the numbers get multiplied. Every branch from the first choice grows a full set of branches for the second choice. So you get the first number of branches, each carrying the second number of branches.",
      ],
      note: "Draw the tree if you ever get stuck. First choice makes the first branches, then every branch grows a full copy of the next choice. Count the tips at the top.",
      tryit: { q: "A tree of choices starts with 3 branches, and each of those grows 2 branches. How many tips are at the top?", answer: "6 (3 branches, each growing 2, so 3 lots of 2)." },
    },
    {
      h: "4. The big idea: multiply the choices",
      body: [
        "We are now ready for the main rule, and it is short. When you make one choice AND then another choice, and the choices do not get in each other's way, you find the total number of possibilities by MULTIPLYING the number of options at each step.",
        "What does 'do not get in each other's way' mean? It means picking your T-shirt does not remove any of your hats. You still have all your hats no matter which T-shirt you chose. When choices work like that we say they are 'independent', which is just a grown-up word for 'they do not affect each other'.",
        "So for 2 T-shirts and 2 hats, we do 2 times 2 = 4. For our very first outfit example with more clothes, 3 shirts and 4 trousers: for each of the 3 shirts there are 4 trousers to pair with it, so 3 times 4 = 12 different outfits. We do not need to list all twelve, the multiplying does the listing for us.",
        "This is a huge time saver. Instead of writing out every possibility by hand, you just look at how many options there are at each step and multiply them together.",
      ],
      note: "Independent just means the choices do not affect each other. Picking your shirt does not take away any trousers, so you still have all of them.",
      examples: [
        { q: "A café offers 5 sandwich fillings and 3 types of bread. You pick one filling and one bread. How many different sandwiches are possible?", steps: ["There are 2 steps: choose a filling, then choose a bread.", "Filling has 5 options, bread has 3 options.", "Multiply them: 5 × 3."], answer: "15 different sandwiches" },
        { q: "An ice cream shop has 4 flavours and 6 different toppings. You pick one flavour and one topping. How many different sundaes are possible?", steps: ["Two independent steps: choose a flavour (4 options), then a topping (6 options).", "Multiply: 4 × 6 = 24."], answer: "24 different sundaes." },
        { q: "A number plate has 2 letters (A–Z, 26 options each) followed by 2 digits (0–9, 10 options each). How many different plates are possible?", steps: ["Four independent steps: letter, letter, digit, digit.", "Multiply all the options: 26 × 26 × 10 × 10.", "26 × 26 = 676. Then 676 × 100 = 67,600."], answer: "67,600 different number plates." },
      ],
      tryit: { q: "A pizza place has 4 different toppings and 2 sizes. You pick one topping and one size. How many different pizzas can you order?", answer: "8 (4 × 2)." },
    },
    {
      h: "5. Why we multiply and not add",
      body: [
        "This is the single most common wobble, so let us slow right down on it. When people first see '5 fillings and 3 breads' the word 'and' tempts them to add: 5 + 3 = 8. That feels sensible, but it is wrong, and here is why.",
        "Adding would only make sense if you were choosing a filling OR a bread, just one thing in total. Like if you walked in and were allowed to take either one filling on its own or one slice of bread on its own. Then you would have 5 + 3 = 8 things to choose from.",
        "But that is not the question. You are taking a filling AND a bread, both, together, to build one sandwich. Every single filling can go with every single bread. So the breads have to be counted again for each filling, and 'counted again for each' is exactly what multiplying means.",
        "A quick way to keep it straight: if it is 'pick this OR that, only one', you add. If it is 'pick this AND that, both, to make a combination', you multiply. Our combination questions are the 'and' kind, so they are multiplying questions.",
      ],
      note: "'One OR the other' means add. 'This one AND that one together' means multiply. Most combination puzzles are the AND kind.",
      tryit: { q: "You are building one outfit from 6 tops and 4 pairs of shorts, wearing one of each. Should you add or multiply, and what is the answer?", answer: "Multiply, because you wear a top AND shorts together. 6 × 4 = 24 outfits." },
    },
    {
      h: "6. More than two steps: just keep multiplying",
      body: [
        "The best part of this rule is that it never gets harder when there are more steps. You just keep multiplying, one number for each choice you make.",
        "Think of a meal deal where you pick a starter, then a main, then a dessert. That is 3 separate choices in a row. If there are 4 starters, 3 mains and 2 desserts, you do 4 times 3 times 2. Work it out gently in two steps: 4 times 3 is 12, and then 12 times 2 is 24. So 24 different meals.",
        "Here is a real-world one you might recognise. A short password uses 1 letter, then 1 digit, then 1 more letter. There are 26 letters and 10 digits (the digits 0 to 9). So the number of passwords is 26 times 10 times 26. That is a big number, 6,760, and you found it without listing a single password. That is the power of multiplying.",
        "You can also picture the tree from earlier growing taller. Each new choice makes every tip split again into more branches, so the tips multiply up step by step, exactly matching the numbers you are multiplying.",
      ],
      examples: [
        { q: "You flip a coin 3 times in a row and write down heads or tails each time. How many different results are possible?", steps: ["There are 3 steps, one for each flip.", "Each flip has 2 possibilities: heads or tails.", "Multiply: 2 × 2 × 2.", "Work it in stages: 2 × 2 = 4, then 4 × 2 = 8."], answer: "8 different results" },
        { q: "You roll three normal 6-sided dice at once and write down each number. How many different sets of results are possible?", steps: ["Three independent steps, one per die. Each has 6 options.", "Multiply: 6 × 6 × 6.", "6 × 6 = 36, then 36 × 6 = 216."], answer: "216 different results." },
        { q: "A password has exactly 3 characters: first is a letter (26 options), second is a digit (0–9, 10 options), third is a letter again (26 options). How many different passwords are possible?", steps: ["Three steps: letter (26), digit (10), letter (26).", "Multiply: 26 × 10 × 26.", "26 × 26 = 676. Then 676 × 10 = 6760."], answer: "6,760 different passwords." },
      ],
      tryit: { q: "A meal deal lets you pick 1 of 3 starters, 1 of 4 mains and 1 of 3 desserts. How many different meals are possible?", answer: "36 (3 × 4 × 3, which is 12 × 3)." },
    },
    {
      h: "7. A grid way of seeing it",
      body: [
        "Before we move on, here is one more picture for the two-step questions, because seeing it a second way makes it stick. Imagine a grid, like the squares on graph paper.",
        "Go back to 3 shirts and 4 trousers. Draw a grid with 3 rows, one row for each shirt, and 4 columns, one column for each pair of trousers. Now every little square where a row meets a column stands for one outfit: that shirt with those trousers.",
        "How many squares are in the grid? A grid with 3 rows and 4 columns has 3 times 4 = 12 squares. And that is exactly our answer, 12 outfits. The grid is really just multiplying rows by columns, which is the same as multiplying choices by choices.",
        "So now you have three ways to see the same idea: writing out a careful list, growing a tree of branches, and filling in a grid of squares. They all give the same answer, and they all boil down to multiplying. Pick whichever picture helps you most on a given day.",
      ],
      tryit: { q: "You draw a grid with 5 rows and 2 columns to count outfits from 5 tops and 2 skirts. How many squares (outfits) are there?", answer: "10 (5 rows × 2 columns)." },
    },
    {
      h: "8. When the order does not matter",
      body: [
        "Now for a twist that trips people up, so we will build it very carefully. Sometimes you are not lining things up in an order, you are just picking a GROUP, and the order you picked them in makes no difference at all.",
        "Here is the difference in plain words. If you are choosing who comes first and who comes second in a race, then Alex-then-Bo is different from Bo-then-Alex, because one of them wins. Order matters there. But if you are just picking two friends to be on your team, then Alex-and-Bo is the very same team as Bo-and-Alex. Order does not matter there. It is the same two people either way.",
        "So how do we count teams (where order does not matter)? We use a two-part plan. First, pretend for a moment that order DOES matter and multiply as usual. Then, because we counted each team more than once, we divide to cancel out the repeats.",
        "Let us do it with 3 friends: Alex, Bo, Chen. Picking 2 of them with order mattering: there are 3 choices for who is first, then 2 left for who is second, so 3 times 2 = 6 ordered ways. But each team of 2 got counted twice (Alex-Bo and Bo-Chen and so on, plus their swaps). So we divide by 2: 6 divided by 2 = 3 teams. Check by listing the actual teams: Alex and Bo, Alex and Chen, Bo and Chen. Yes, exactly 3. It works.",
        "Why divide by 2? Because a team of 2 people can be ordered in 2 ways (this one first or that one first), so every real team was counted 2 times. Dividing by 2 fixes the double-counting.",
      ],
      note: "Order matters for a race (1st and 2nd are different). Order does NOT matter for a team (same people, same team). For teams: multiply first, then divide out the repeats.",
      examples: [
        { q: "How many different pairs (teams of 2) can be made from 4 friends: Alex, Bo, Chen and Dana?", steps: ["Pretend order matters first: 4 choices for the first person, then 3 left for the second, so 4 × 3 = 12 ordered ways.", "But each pair got counted twice (for example Alex-Bo is the same pair as Bo-Alex), so divide by 2.", "12 ÷ 2 = 6.", "Check by listing: Alex-Bo, Alex-Chen, Alex-Dana, Bo-Chen, Bo-Dana, Chen-Dana. That is 6 pairs."], answer: "6 pairs" },
        { q: "How many different pairs can be chosen from 6 friends?", steps: ["Pretend order matters: 6 choices for the first, 5 for the second. 6 × 5 = 30 ordered ways.", "Each pair was counted twice (once for each order), so divide by 2.", "30 ÷ 2 = 15."], answer: "15 pairs." },
        { q: "A sports team of 2 is chosen from 8 players. How many different teams are possible?", steps: ["Pretend order matters: 8 choices for first, 7 for second. 8 × 7 = 56 ordered ways.", "Each team was counted twice, so divide by 2.", "56 ÷ 2 = 28."], answer: "28 different teams." },
      ],
      tryit: { q: "How many different pairs can be made from 5 friends?", answer: "10 (5 × 4 = 20 ordered ways, then divide by 2 because order does not matter within a pair)." },
    },
    {
      h: "9. 'Guarantee' problems: plan for the worst luck",
      body: [
        "The last type of counting question feels different, but it is friendly once you know the trick. It asks: how many things must you pick to be COMPLETELY SURE of getting a certain result, even if you are the unluckiest person alive?",
        "The word to notice is 'guarantee'. To guarantee something means it is certain, no matter what, with zero chance of it going wrong. So we are not asking what will probably happen, we are asking what definitely, always happens.",
        "The trick is to imagine the worst possible luck first, and then add just one more. Picture a drawer with red socks and blue socks all jumbled up, and you cannot see inside. How many socks must you pull out to be sure you have a matching pair (two the same colour)?",
        "Imagine the unluckiest start: your first sock is red, and your second sock is blue. Now you have 2 socks but no match yet. That is the worst that can happen. But now pull one more, the 3rd sock. It has to be red or blue, because those are the only two colours, so it MUST match one you already have. So 3 socks guarantees a matching pair.",
        "See the pattern: first work out how many you could grab while still being unlucky (one of each kind), then add 1 to force the match. Worst luck, then one more.",
      ],
      note: "For 'guarantee' questions, do not forget the final '+1'. Imagining the worst luck is only half the job. The one extra pick is what forces the result.",
      examples: [
        { q: "A bag has pens in 3 colours all mixed up. How many pens must you pull out (without looking) to guarantee 2 of the same colour?", steps: ["Imagine the worst luck: you pull one of each colour first, so 3 pens, all different, still no match.", "That is as unlucky as you can be.", "Now add one more: the 4th pen must match one you already have, because there are only 3 colours."], answer: "4 pens" },
        { q: "A drawer has socks in 5 different colours, with plenty of each. How many socks must you pull out to guarantee you have a matching pair?", steps: ["Worst luck: you pull 5 socks, one of each colour, no match yet.", "Add one more: the 6th sock must match one of the 5 you already have."], answer: "6 socks." },
        { q: "A bag contains red, blue and green marbles. How many must you pull out to guarantee you have at least 3 marbles of the same colour?", steps: ["Worst luck before having 3 of one colour: 2 red, 2 blue, 2 green = 6 marbles, with no colour appearing 3 times.", "Add one more: the 7th marble must make one colour appear 3 times."], answer: "7 marbles." },
      ],
      tryit: { q: "A box has marbles in 4 different colours, all jumbled. How many must you pull out to guarantee 2 of the same colour?", answer: "5 (worst luck is one of each of the 4 colours, then 1 more forces a match)." },
    },
    {
      h: "10. Putting it all together",
      body: [
        "You have learned a lot, so let us gather it into a few clear ideas you can carry with you.",
        "For choices made one after another where you take one from each step (a shirt AND trousers AND shoes), multiply the number of options at each step. This is the big rule, and it keeps working however many steps there are, just keep multiplying.",
        "Watch the 'and' versus 'or' trap. 'This AND that together' means multiply. 'Just this OR just that, only one' means add. Most combination puzzles are the multiplying kind.",
        "When you are picking a GROUP and the order does not matter (a team, a pair), multiply as if order mattered first, then divide out the repeats. A pair gets counted twice, so you divide by 2.",
        "For 'guarantee' questions, imagine the worst possible luck, then add one more pick to force the result. The little '+1' at the end is the part people forget, so guard it carefully.",
        "One last piece of advice: when a question feels tangled, go back to a picture. Write out a short list, sketch a tree of branches, or draw a grid of squares. The picture will show you what to multiply, and it will let you check that your answer is sensible.",
      ],
      tryit: { q: "You have 3 hats, 2 scarves and 4 pairs of gloves, and you wear one of each. How many different cold-weather outfits can you make?", answer: "24 (3 × 2 × 4, worked as 3 × 2 = 6, then 6 × 4 = 24)." },
    },
  ],
};

PRIMARY_LESSONS.angleBasics = {
  title: "Angles: measuring turn, and the totals that govern them",
  minutes: 18,
  intro: "An angle is a way of measuring how far something turns. In this lesson we start from the very beginning, with doors, clock hands and pizza slices, and slowly build up to a few special totals that let you work out a missing angle without ever picking up a protractor. Take it gently, one step at a time. There is nothing here you cannot understand.",
  sections: [
    {
      h: "1. What a turn is",
      body: [
        "Before we talk about angles at all, let us talk about turning. When you spin round on the spot, you are turning. When a door swings open, it is turning. When the hands of a clock move round, they are turning. Turning just means changing which way something is pointing.",
        "Imagine you are standing up and facing the window. Now turn until you are facing the door instead. You have made a turn. If the door is right beside the window, that was a small turn. If the door is behind you, that was a big turn. So turns come in different sizes, and that is the whole idea we are going to measure.",
        "Here is another picture. Think of a door that is shut. As it opens, the edge of the door sweeps through the air, a little at first and then more and more. The amount the door has swept open is the size of the turn. A door that is barely ajar has made a tiny turn. A door flung wide has made a big one.",
        "An angle is simply the name we give to the size of a turn. That is all an angle is: a measurement of how much something has turned.",
      ],
      note: "An angle measures TURN, not distance. It is about which way you are pointing, not how far you have walked.",
    },
    {
      h: "2. Measuring a turn in degrees",
      body: [
        "To measure turns we need units, in the same way we use centimetres to measure length. The unit we use for turning is called the degree. We write it with a tiny circle after the number, like this: 90°. You read 90° out loud as 'ninety degrees'.",
        "Picture yourself standing and facing forwards. If you turn all the way round, spinning right the way back to face forwards again, you have made one full turn. One full turn is 360 degrees, written 360°. That is the biggest single turn there is, because after that you are just facing the same way you started.",
        "Now do it in pieces. Turn only halfway round, so you end up facing the exact opposite way (if you started facing the telly, you now have your back to it). That halfway turn is 180°. Notice that two halves make a whole: 180 + 180 = 360. That fits nicely.",
        "Turn just a quarter of the way round instead, so you go from facing forwards to facing directly to your side. That quarter turn is 90°. Four quarter turns take you all the way round, and sure enough 90 + 90 + 90 + 90 = 360.",
        "So the three sizes worth remembering are the quarter turn (90°), the half turn (180°) and the full turn (360°). Everything else in this lesson is built out of these.",
      ],
      note: "Quarter turn = 90°. Half turn = 180°. Full turn = 360°. Learn these three by heart and the rest becomes easy.",
      tryit: { q: "You are facing the door. You make a half turn. Then you make another half turn. Which way are you facing now, and how many degrees have you turned in total?", answer: "You are facing the door again. Two half turns is 180 + 180 = 360°, which is one full turn, so you are back where you started." },
    },
    {
      h: "3. The right angle: a very special corner",
      body: [
        "A quarter turn, 90°, is so useful that it has its own special name. It is called a right angle. The word 'right' here does not mean correct and it does not mean the opposite of left. It is just the name for a 90° angle, the neat square corner you get from a quarter turn.",
        "Right angles are all around you. Look at the corner of this screen. Look at the corner of a book, a table, a window or a door frame. Almost every corner in a room that looks like a perfect square corner is a right angle. The two lines meet and make a clean, upright corner, neither leaning open nor squashed shut.",
        "Here is a way to picture it. Hold one arm straight out in front of you and the other arm pointing straight up to the ceiling. The corner your two arms make is a right angle. It is the same shape as the corner of a capital letter L.",
        "Because a right angle comes up so often, people mark it in a special way. Instead of a curved line in the corner, a right angle is shown with a tiny square tucked into the corner. If you ever see that little square, it is telling you 'this corner is exactly 90°'.",
      ],
      tryit: { q: "How many right angles are there in one full turn all the way round?", answer: "Four. Each right angle is 90°, and 90 + 90 + 90 + 90 = 360°, which is a full turn." },
    },
    {
      h: "4. Angles come in three friendly sizes",
      body: [
        "It helps to sort angles into three groups by how big they are, and each group has a name. Learning the names now will make everything later much clearer.",
        "An acute angle is any angle smaller than a right angle, so less than 90°. 'Acute' is just a word meaning sharp. Acute angles look sharp and narrow, like a thin slice of pizza or the pointy nib of a pencil. A 30° angle and a 70° angle are both acute.",
        "An obtuse angle is any angle bigger than a right angle but smaller than a straight line, so between 90° and 180°. 'Obtuse' means blunt. Obtuse angles look open and wide, like a laptop opened up further than a square corner, or a door swung well past halfway. A 120° angle and a 150° angle are both obtuse.",
        "A reflex angle is any angle bigger than a straight line, so between 180° and 360°. Reflex angles are the really wide ones that have swept more than halfway round. A 250° angle is reflex.",
        "One way to remember which is which: acute angles are the little cute ones (small and sharp), and obtuse angles are the big blunt ones. Say 'a-cute little angle' to yourself and it tends to stick.",
      ],
      note: "Acute = less than 90° (sharp and small). Obtuse = between 90° and 180° (wide and blunt). Reflex = more than 180° (huge).",
      tryit: { q: "Sort these three angles into acute, obtuse or reflex: 45°, 200° and 100°.", answer: "45° is acute (under 90°), 100° is obtuse (between 90° and 180°), and 200° is reflex (over 180°)." },
    },
    {
      h: "5. Why the lines' length does not matter",
      body: [
        "Here is a mistake that catches lots of people, so let us clear it up early. An angle is made where two lines meet at a point. It is very tempting to think that if you draw those lines longer, the angle gets bigger. It does not. The length of the lines makes no difference at all to the angle.",
        "Think about the hands of a clock. The long minute hand and the short hour hand can point in exactly the same two directions, making exactly the same angle between them, even though one hand is much longer than the other. The angle is about the directions the hands point, not how long they are.",
        "Or picture a slice of pizza. A tiny slice cut from a small pizza and a giant slice cut from a huge pizza can have the exact same pointy angle at the tip. One slice has far more crust and cheese, but the angle at the point is identical. More pizza does not mean more angle.",
        "So when you look at an angle, train your eye to look only at how far the two lines have opened apart from each other. Ignore how long they are drawn. The opening is the angle.",
      ],
      note: "Common slip: thinking longer lines make a bigger angle. They do not. Only the amount of opening between the lines counts.",
      tryit: { q: "A clock's minute hand is long and its hour hand is short. At four o'clock, does the long minute hand somehow make the angle between the hands bigger than a short hand would?", answer: "No. The length of the hands does not change the angle at all. Only the directions they point in matter." },
    },
    {
      h: "6. Angles on a straight line add up to 180°",
      body: [
        "Now we start using those special totals to work things out. Remember that a half turn is 180°, and a half turn takes you from facing one way to facing the exact opposite way. A straight line is really just a picture of that half turn: it goes from one direction straight across to the opposite direction.",
        "Imagine standing at a point on a straight line and facing along it one way. To end up facing along the line the other way, you make a half turn, which is 180°. Now suppose you did it in two steps: you turned part of the way, paused, then turned the rest. The two smaller turns you made must add up to the whole half turn, so they add up to 180°.",
        "That is the rule. When two angles sit side by side on a straight line, filling up the space above the line, they always add up to exactly 180°. This is so common it has a name: angles on a straight line.",
        "Here is why this is powerful. If you know one of the two angles, you can find the other without measuring anything. You just take it away from 180. If one angle is 65°, the angle next to it is 180 - 65 = 115°. And it checks out, because 65 + 115 = 180.",
      ],
      note: "Angles on a straight line make a half turn, so they add to 180°, not 360°. Mixing up 180 and 360 is the most common angle mistake of all.",
      examples: [
        { q: "Two angles sit next to each other on a straight line. One of them is 65°. What is the other one?", steps: ["Angles on a straight line always add up to 180°.", "Subtract the angle we know from 180: 180 - 65 = 115.", "Check it by adding them back: 65 + 115 = 180. It works."], answer: "115°" },
        { q: "Three angles sit on a straight line: 70°, 45° and an unknown angle. Find the unknown.", steps: ["All three must add up to 180°.", "Add the known angles: 70 + 45 = 115.", "Unknown = 180 - 115 = 65°.", "Check: 70 + 45 + 65 = 180. ✓"], answer: "65°" },
        { q: "Two angles on a straight line are in the ratio 2:7. Find both angles.", steps: ["They must add up to 180°. Total parts: 2 + 7 = 9.", "One part = 180 ÷ 9 = 20°.", "Smaller angle = 2 × 20 = 40°. Larger angle = 7 × 20 = 140°.", "Check: 40 + 140 = 180. ✓"], answer: "40° and 140°." },
      ],
      tryit: { q: "Two angles sit together on a straight line. One is 112°. What is the other?", answer: "68°, because 180 - 112 = 68. Check: 112 + 68 = 180." },
    },
    {
      h: "7. Angles around a point add up to 360°",
      body: [
        "This rule is the big brother of the last one. Instead of angles filling up a straight line (a half turn), we now have angles filling up all the way round a single point (a full turn).",
        "Picture a pizza again, but this time a whole pizza cut into several slices that all meet at the centre. The pointy tips of all the slices meet at that middle point, and together the slices fill the entire pizza with no gaps. Because they go all the way round, the angles at the tips must add up to one full turn, which is 360°.",
        "Or imagine standing at a spot and spinning slowly all the way round, stopping now and then. Each little turn you make is an angle, and by the time you are facing the start again, all your little turns must add up to one full turn: 360°.",
        "So the rule is: angles that meet at a point and go all the way round always add up to 360°. If you know all of them except one, add up the ones you know and take the total away from 360 to find the missing one.",
      ],
      examples: [
        { q: "Four angles meet at a point and go all the way round: 90°, 85°, 100° and one unknown angle. What is the unknown angle?", steps: ["Angles around a point always add up to 360°.", "Add up the angles we know: 90 + 85 + 100 = 275.", "Take that away from 360: 360 - 275 = 85.", "Check: 90 + 85 + 100 + 85 = 360. It works."], answer: "85°" },
        { q: "Five angles meet at a point: 80°, 65°, 90°, 72° and one unknown. Find the unknown.", steps: ["All five add to 360°.", "Sum of known: 80 + 65 + 90 + 72 = 307.", "Unknown = 360 - 307 = 53°.", "Check: 307 + 53 = 360. ✓"], answer: "53°" },
        { q: "Four angles meet at a point: x, 2x, 3x and 4x. Find x, then state all four angles.", steps: ["They add to 360°: x + 2x + 3x + 4x = 10x = 360.", "x = 360 ÷ 10 = 36°.", "The four angles are 36°, 72°, 108° and 144°.", "Check: 36 + 72 + 108 + 144 = 360. ✓"], answer: "x = 36°. Angles are 36°, 72°, 108° and 144°." },
      ],
      tryit: { q: "Three angles meet at a point and go all the way round: 120°, 150° and one more. What is the missing angle?", answer: "90°, because 120 + 150 = 270, and 360 - 270 = 90. Check: 120 + 150 + 90 = 360." },
    },
    {
      h: "8. Angles inside a triangle add up to 180°",
      body: [
        "A triangle is a shape with three straight sides and three corners. At each corner there is an angle. Something rather magical is true: the three angles inside any triangle always add up to exactly 180°. It does not matter whether the triangle is tall and thin, short and wide, or a neat even one. The three inside angles always total 180°.",
        "Here is a way to feel why. Imagine cutting a paper triangle and tearing off its three corners. If you place the three torn corners side by side, tips touching, they line up perfectly along a straight edge with no gap and no overlap. And you already know a straight line is 180°. So the three angles together make 180°. People really do this with scissors in class, and it works every time.",
        "You can use this just like the straight line rule. If you know two of a triangle's angles, add them together and take the total away from 180 to find the third.",
        "Because a triangle's angles must total exactly 180°, it can only ever have one right angle or one obtuse angle at most. If it had two right angles that would already use up 180° with nothing left for the third corner, which is impossible.",
      ],
      note: "A triangle's three angles add to 180°, the same total as a straight line. That is not a coincidence, it is the torn-corners trick.",
      examples: [
        { q: "A triangle has two known angles, 50° and 65°. What is the third angle?", steps: ["The three angles in a triangle add up to 180°.", "Add the two we know: 50 + 65 = 115.", "Take that away from 180: 180 - 115 = 65.", "Check: 50 + 65 + 65 = 180. It works."], answer: "65°" },
        { q: "An isosceles triangle has two equal angles and a third angle of 40°. Find the two equal angles.", steps: ["All three angles add up to 180°.", "The two equal angles together make 180 - 40 = 140°.", "Each equal angle = 140 ÷ 2 = 70°.", "Check: 70 + 70 + 40 = 180. ✓"], answer: "70° each." },
        { q: "In a triangle, one angle is twice the size of a second angle, and the third angle is 30°. Find all three angles.", steps: ["Let the smaller of the first two angles be x°, so the other is 2x°.", "All three add to 180: x + 2x + 30 = 180.", "3x = 150, so x = 50°.", "The three angles are 50°, 100° and 30°.", "Check: 50 + 100 + 30 = 180. ✓"], answer: "30°, 50° and 100°." },
      ],
      tryit: { q: "A triangle has angles of 40° and 95°. What is the third angle?", answer: "45°, because 40 + 95 = 135, and 180 - 135 = 45. Check: 40 + 95 + 45 = 180." },
    },
    {
      h: "9. Vertically opposite angles are equal",
      body: [
        "The last idea is about what happens when two straight lines cross over each other. Picture two roads crossing, or two pencils laid across each other so they make an X shape. Where they cross, four angles are made, one in each of the four spaces around the crossing point.",
        "Look at the X shape. There are two pairs of angles that sit directly across from each other, facing away back to back through the middle. The pair on the left and right point out sideways, and the pair on top and bottom point up and down. Angles that sit directly opposite each other across the crossing like this have a special name: vertically opposite angles.",
        "The neat fact is that vertically opposite angles are always exactly equal to each other. The top and bottom angles match, and the left and right angles match. You do not need to measure the opposite one, because it is simply the same as the one you already know.",
        "You can see why using the straight line rule from earlier. Each of the two crossing lines is straight, so the two angles sitting on the same line must add to 180°. Working through that forces the opposite angles to come out equal. For now the fact to hold on to is simple: straight lines crossing make an X, and opposite angles in that X are equal.",
      ],
      note: "Vertically opposite angles (the ones facing each other across an X) are equal. This is a different rule from angles on a line, so do not muddle the two up.",
      examples: [
        { q: "Two straight lines cross and make an X. One of the four angles is 72°. What is the angle directly opposite it across the crossing?", steps: ["Angles directly opposite each other in an X (vertically opposite angles) are always equal.", "So the opposite angle is the same size as the one we know."], answer: "72°" },
        { q: "Two lines cross. One angle is 38°. Find all four angles at the crossing.", steps: ["The angle directly opposite is also 38° (vertically opposite angles are equal).", "The adjacent angle on the straight line: 180 - 38 = 142°.", "The angle opposite that adjacent angle is also 142°.", "The four angles are 38°, 142°, 38°, 142°."], answer: "38°, 142°, 38° and 142°." },
        { q: "Two lines cross. One pair of opposite angles are (3x + 10)° and (5x - 30)°. Find x and then all four angles.", steps: ["Vertically opposite angles are equal: 3x + 10 = 5x - 30.", "Rearrange: 10 + 30 = 5x - 3x, so 40 = 2x, giving x = 20.", "Each of the opposite pair = 3(20) + 10 = 70°.", "The other pair: 180 - 70 = 110° each.", "Check: 5(20) - 30 = 70. ✓"], answer: "x = 20. The four angles are 70°, 110°, 70° and 110°." },
      ],
      tryit: { q: "Two straight lines cross. One angle in the X is 138°. What is the angle vertically opposite it?", answer: "138°. Vertically opposite angles are always equal, so it matches exactly." },
    },
    {
      h: "10. Putting the totals together",
      body: [
        "You now know five useful facts, and they are worth gathering in one place. An angle measures turn, not length. Angles on a straight line add up to 180°. Angles all the way round a point add up to 360°. The angles inside a triangle add up to 180°. Vertically opposite angles across an X are equal.",
        "When you meet a puzzle with a missing angle, the trick is to ask yourself which of these situations you are looking at. Is the missing angle on a straight line? Then reach for 180. Is it round a whole point? Then reach for 360. Is it the third corner of a triangle? Then 180 again. Is it opposite another angle in an X? Then it is simply equal.",
        "The most common slip is grabbing the wrong total, using 360 when you needed 180 or the other way round. So always pause and picture the turn first: half a turn is 180, a full turn is 360. Getting that picture right in your head is more than half the battle.",
        "And one last reminder to protect you from an easy mistake: when a puzzle gives you several known angles and asks for one more, make sure you add up every single one of the known angles before you subtract. Leaving one out is the sneakiest way to get a right method but a wrong answer.",
      ],
      note: "Before you calculate, name the situation: straight line (180°), point (360°), triangle (180°) or X-crossing (equal). Choosing the right rule is the real skill.",
      tryit: { q: "Two angles sit on a straight line. One is a right angle. What is the other, and what type of angle is it?", answer: "The other is 90°, because 180 - 90 = 90. It is also a right angle. When one angle on a line is a right angle, the one next to it must be a right angle too." },
    },
  ],
};

PRIMARY_LESSONS.shapeProperties = {
  title: "Shape Properties: what really makes a shape a shape",
  minutes: 18,
  intro: "When you look at a shape, your eyes tell you a lot very quickly. But eyes can be fooled. In maths we work out what a shape truly is by counting and checking its parts: its sides, its corners, its angles and its symmetry. In this lesson we will build up each of those ideas slowly, one at a time, with things you can see and touch around your home. By the end you will be able to describe any flat shape properly, and you will not be tricked by a shape that just looks a certain way.",
  sections: [
    {
      h: "1. Sides and corners: the parts of a shape",
      body: [
        "Let us start right at the beginning. A flat shape with straight edges is built from two kinds of part: sides and corners. A side is a straight edge, like one edge of a table or one line you draw with a ruler. A corner is the point where two sides meet and change direction. In maths the proper word for a corner is a vertex. If you have more than one corner, we call them vertices (that is just the funny plural of vertex, the way mice is the plural of mouse).",
        "Here is a way to feel this with your own hands. Pick up a book. Run your finger along one straight edge: that is a side. Now stop at the point where two edges meet and press it: that is a vertex, a corner. A book cover has 4 sides and 4 corners.",
        "Another way to picture it: imagine walking around the edge of a shape like it was a fenced field. Every straight stretch of fence you walk is a side. Every time you have to turn to keep following the fence, you are standing at a corner, a vertex. Walking and turning, walking and turning, all the way round.",
        "A shape made of straight sides that join up into a closed loop has a special name: a polygon. Squares, triangles and pentagons are all polygons. A circle is not a polygon, because it has no straight sides and no corners at all.",
      ],
      note: "Vertex means one corner. Vertices means more than one corner. Same thing, just one or many.",
      tryit: { q: "Look at a normal envelope or a piece of paper. How many sides does it have, and how many vertices?", answer: "4 sides and 4 vertices. It is a rectangle, which is a polygon." },
    },
    {
      h: "2. The number of sides always matches the number of corners",
      body: [
        "Here is a lovely little rule that is always true for a normal straight-sided shape (one whose edges do not cross over each other). The number of sides is exactly the same as the number of corners. Not close. Exactly the same, every single time.",
        "Why must this be true? Think back to walking round the fenced field. Every side ends at a corner, and every corner is where the next side begins. So the sides and the corners come in matching pairs, like each railway carriage having one join to the next. If you walk all the way round and come back to where you started, you must have made the same number of turns as straight stretches.",
        "You can also just count on a real object. Look at a stop sign or draw an eight-sided shape. Put your finger on a corner and say 'one', then slide to the next corner and say 'two', going all the way round. Then do the same counting the sides. You will land on the same number both times.",
        "This lets us name shapes by their number of sides. A shape with 3 sides is a triangle (and so it has 3 corners). A shape with 4 sides is a quadrilateral (4 corners). A shape with 5 sides is a pentagon (5 corners). A shape with 6 sides is a hexagon (6 corners). A shape with 8 sides is an octagon (8 corners). Notice that once you know the sides, you already know the corners for free.",
      ],
      note: "Sides and corners always come in equal numbers. Count one and you already know the other.",
      examples: [
        { q: "A shape is called a heptagon and has 7 sides. How many vertices does it have?", steps: ["Sides and vertices always match in number for this kind of shape.", "So if it has 7 sides, it must have 7 vertices."], answer: "7 vertices" },
        { q: "A polygon has 9 sides. What is it called, and how many vertices does it have?", steps: ["Count the sides: 9.", "Sides and vertices are always equal, so it has 9 vertices.", "A 9-sided polygon is called a nonagon."], answer: "A nonagon with 9 vertices." },
        { q: "A polygon has 3 more sides than a pentagon. How many vertices does it have, and what is it called?", steps: ["A pentagon has 5 sides. Add 3: 5 + 3 = 8 sides.", "Sides = vertices, so it has 8 vertices.", "An 8-sided polygon is called an octagon."], answer: "8 vertices. The shape is an octagon." },
      ],
      tryit: { q: "An octagon has 8 sides. How many corners does it have?", answer: "8 corners, because the number of corners always equals the number of sides." },
    },
    {
      h: "3. Sorting triangles by their sides",
      body: [
        "A triangle is any shape with 3 straight sides and 3 corners. But not all triangles are the same. We can sort them into groups depending on how many of their sides are the same length as each other. There are three groups, and each has a name.",
        "The first group is when all 3 sides are exactly the same length. We call this an equilateral triangle. An easy way to remember the word: 'equi' sounds like 'equal', so equilateral means 'equal sides', all of them.",
        "The second group is when exactly 2 of the sides are the same length and the third is different. We call this an isosceles triangle. Picture the roof of a simple drawn house: the two slanting sides that lean together are usually the same length, while the flat bottom is a different length. That is an isosceles triangle.",
        "The third group is when all 3 sides are different lengths, with no two the same. We call this a scalene triangle. Think of the word scalene as meaning 'all uneven'.",
        "Here is the most important habit to build. Do not just glance and guess. A triangle can look roughly even to your eye but actually have sides of slightly different lengths. To be sure, you check the numbers. Measure or read the length of every side and compare them properly before you decide which group it belongs to.",
      ],
      note: "Equilateral = all 3 equal. Isosceles = exactly 2 equal. Scalene = none equal. Count how many sides match, then name it.",
      examples: [
        { q: "A triangle has sides of 6cm, 6cm and 10cm. What type of triangle is it?", steps: ["Line up the three lengths: 6cm, 6cm and 10cm.", "Count how many are the same. Two of them are 6cm, and one is different (10cm).", "Exactly two equal sides means it is isosceles."], answer: "Isosceles" },
        { q: "A triangle has all three sides of 5cm. What type is it?", steps: ["All three sides: 5cm, 5cm, 5cm.", "All three are the same length.", "All three sides equal = equilateral."], answer: "Equilateral." },
        { q: "An isosceles triangle has a perimeter of 24cm. The unequal side is 10cm. Find the lengths of the other two sides.", steps: ["The two equal sides share the remaining length: 24 - 10 = 14cm for the two of them.", "Each equal side = 14 ÷ 2 = 7cm.", "Check: 7 + 7 + 10 = 24cm. ✓"], answer: "7cm, 7cm and 10cm." },
      ],
      tryit: { q: "A triangle has sides of 4cm, 7cm and 9cm. What type is it?", answer: "Scalene, because all three sides are different lengths." },
    },
    {
      h: "4. What an angle is",
      body: [
        "So far we have talked about sides (the straight edges) and corners (where they meet). Now let us look more closely at what happens right at a corner. The amount of turn between the two sides that meet at a corner is called an angle. An angle is a measurement of how open or how sharp the corner is.",
        "The easiest way to feel an angle is to open a door, or open a book, or open a pair of scissors. When the two parts are only slightly apart, the angle is small and sharp. When you swing them wide open, the angle is big. The angle is not about how long the sides are, only about how much they have opened up from each other.",
        "A very special angle is the square corner, the kind you see at the corner of a book, a window, a door or a piece of paper. This exact amount of turn has a name: a right angle. You can test for a right angle by holding the corner of a real piece of paper against the corner of a shape. If it fits perfectly, snug with no gap and no overlap, that corner is a right angle.",
        "Two shapes can have the very same number of equal sides but still have completely different angles. Imagine a square drawn on stretchy paper, then push it over so it leans like a pushed-over box. The four sides can still be the same length, but the corners are no longer square. That leaning shape is called a rhombus. This is our first clue that sides alone do not tell the whole story about a shape.",
      ],
      note: "An angle measures how much a corner opens, not how long the sides are. A right angle is the perfect square corner, like the corner of this page.",
      tryit: { q: "Find a right angle somewhere near you and name the object. (Hint: the corner of a book, door or window.)", answer: "Any square corner works, for example the corner of a book, a table, a door or a window. All of those are right angles." },
    },
    {
      h: "5. 'Regular' means equal sides AND equal angles",
      body: [
        "In maths there is a special word we use for the tidiest, most even shapes: regular. A shape is only called regular if two things are true at the same time. First, all of its sides must be the same length as each other. Second, all of its angles must be the same size as each other too. Both things together. Not one or the other.",
        "This is a rule people get wrong all the time, so let us really slow down. It is not enough for a shape to have equal sides. It is also not enough for it to have equal angles. It must have BOTH before we are allowed to call it regular.",
        "Remember the rhombus from the last section, the pushed-over square. It has 4 equal sides, which feels very tidy. But its angles are not all the same, because two corners are squashed and two are stretched. Since the angles are not equal, a rhombus is not regular, even though its sides are all equal.",
        "Now think of a square. A square also has 4 equal sides, but every corner is a right angle, so all 4 of its angles are equal too. Both conditions are met. That is why a square is a regular shape but a rhombus is not, even though both have 4 equal sides. The difference is entirely in the angles.",
        "So whenever a question tells you a shape is regular, it is quietly promising you two facts at once: the sides are all equal and the angles are all equal. And whenever YOU want to call a shape regular, you must check both before you say it.",
      ],
      note: "Regular = equal sides AND equal angles, both at once. A rhombus has equal sides but unequal angles, so it is NOT regular. A square has both, so it is.",
      examples: [
        { q: "A shape has 6 sides that are all exactly the same length, but some of its angles are wider than others. Is it a regular hexagon?", steps: ["Check the first rule: are all sides equal? Yes, all 6 sides are equal.", "Check the second rule: are all angles equal? No, some angles are wider than others.", "Regular needs BOTH rules to be true. This shape fails the angle rule."], answer: "No, it is not regular, because its angles are not all equal (even though its sides are)." },
        { q: "A rectangle has four angles all equal to 90°. Its sides are 3cm and 8cm. Is it a regular quadrilateral (square)?", steps: ["Check angles: all four are 90°. Equal angles. ✓", "Check sides: 3cm and 8cm are different lengths. Not all equal. ✗", "Regular needs BOTH rules. The sides fail."], answer: "No. A rectangle has equal angles but unequal sides, so it is not regular (unless it is a square)." },
        { q: "A 5-sided shape has all 5 sides equal in length. Is it definitely a regular pentagon? What else must you check?", steps: ["Equal sides is only one of the two rules for 'regular'.", "You must also check that all 5 angles are equal.", "A 5-sided shape can have equal sides but still have some angles wider than others, in which case it would not be regular."], answer: "Not necessarily. You must also confirm that all 5 angles are equal. Equal sides alone are not enough." },
      ],
      tryit: { q: "A triangle has 3 equal sides. In a triangle, equal sides always bring equal angles too. Is it regular?", answer: "Yes. It has 3 equal sides and 3 equal angles, so it is a regular triangle (also called an equilateral triangle)." },
    },
    {
      h: "6. Lines of symmetry",
      body: [
        "There is one more property that helps us describe a shape: its symmetry. A shape has a line of symmetry if you could fold it along a straight line and the two halves would land exactly on top of each other, matching perfectly with no bits sticking out.",
        "The nicest way to meet this idea is to actually fold. Cut out a paper square and fold it straight down the middle so the left half lands on the right half. If the edges line up perfectly, that fold line is a line of symmetry. A square can be folded this way in several different directions, so it has more than one line of symmetry.",
        "Another way to picture symmetry is to imagine standing a mirror upright along a line on the shape. If the half you can see, plus its reflection in the mirror, looks exactly like the whole shape, then that mirror line is a line of symmetry. This is why symmetry is sometimes called mirror symmetry.",
        "You see symmetry all around you. A butterfly has a line of symmetry down its middle, because its left wing matches its right wing. Many letters do too: the letter A has a line of symmetry straight down the middle, and so does the letter T. But the letter F has none, because there is no fold that makes its two halves match.",
        "Symmetry is a real, checkable property of a shape, just like counting sides. The neat, regular shapes from the last section tend to have lots of lines of symmetry, while wonky, uneven shapes often have none at all.",
      ],
      tryit: { q: "Think about the capital letter H. Does it have a line of symmetry, and if so how could you fold it?", answer: "Yes. You can fold it top to bottom (across the middle) and also left to right (down the middle), so it has two lines of symmetry." },
    },
    {
      h: "7. Coordinates: giving a point an address",
      body: [
        "Shapes do not just float about. Often we want to say exactly where a corner sits on a grid, like giving it an address so nobody gets confused. We do this with coordinates. A coordinate is a pair of numbers that pins down one exact point on a grid.",
        "Picture a grid like the floor tiles in a room, or the squares on graph paper. There is a starting point in the bottom-left corner called the origin. From there, the first number tells you how far to go ACROSS (to the right), and the second number tells you how far to go UP.",
        "We always write a coordinate inside brackets with a comma in the middle, like this: (3, 5). The order matters enormously. The first number is the across amount (called the x-coordinate) and the second number is the up amount (called the y-coordinate). So (3, 5) means go 3 steps across, then 5 steps up.",
        "A good trick to remember the order is the little saying 'along the corridor, then up the stairs'. You always walk along the corridor first and climb the stairs second. In the same way you always do the across number first and the up number second.",
        "The most common mistake in the whole of coordinates is swapping the two numbers round. The point (3, 5) is in a totally different place from the point (5, 3), just like house number 35 is a different house from number 53. Always across first, then up.",
      ],
      note: "Coordinates are (across, up), which we call (x, y). Along the corridor first, then up the stairs. Never swap them.",
      examples: [
        { q: "Where is the point (4, 2) on a grid? Describe how to get there from the origin.", steps: ["The first number is the across amount: go 4 steps to the right.", "The second number is the up amount: go 2 steps up.", "You are now standing on the point (4, 2)."], answer: "4 steps across (right), then 2 steps up." },
        { q: "Three corners of a rectangle are at (1, 3), (5, 3) and (5, 7). What are the coordinates of the fourth corner?", steps: ["Two corners share y = 3 (the bottom edge): (1,3) and (5,3).", "Two corners share x = 5 (the right edge): (5,3) and (5,7).", "The missing corner must share x = 1 (like the bottom-left) and y = 7 (like the top-right)."], answer: "(1, 7)." },
        { q: "A square has three corners at (2, 1), (6, 1) and (6, 5). Find the fourth corner, the side length and the area.", steps: ["The side from (2,1) to (6,1) is horizontal, length = 6 - 2 = 4 units.", "The fourth corner must be at x = 2 (same x as (2,1)) and y = 5 (same y as (6,5)): (2, 5).", "Area = side × side = 4 × 4 = 16 square units."], answer: "Fourth corner (2, 5). Side length 4 units. Area 16 square units." },
      ],
      tryit: { q: "Explain in your own words why (2, 7) is a different point from (7, 2).", answer: "In (2, 7) you go 2 across and 7 up. In (7, 2) you go 7 across and 2 up. The across and up amounts are swapped, so they land in different places." },
    },
    {
      h: "8. Sliding a shape to a new place",
      body: [
        "Once a shape's corners have coordinates, we can move the whole shape around the grid. The simplest move is sliding it without turning it or flipping it, so it keeps the same size and the same way up. In maths this slide is called a translation. Think of sliding a book across a table: it does not spin or flip, it just travels.",
        "To describe a slide, we use two numbers again: how far across and how far up (or down). This pair of instructions is called a vector. For example the vector (2, -4) means 'move 2 steps to the right and 4 steps down'. A positive across number means go right, a negative one means go left. A positive up number means go up, a negative one means go down.",
        "Here is the key idea, and it is simpler than it sounds. To slide a shape, you do the exact same move to every single corner. And to move one corner, you just add the vector's across number to that corner's across number, and add the vector's up number to that corner's up number. You handle the across and the up completely separately.",
        "A common slip is to add the vector to only one of the two numbers and forget the other. Do not fall for it. Every point has an across part and an up part, so every point needs both parts of the move.",
      ],
      note: "To translate a point, add the vector's across number to x, and the vector's up number to y. Both numbers get their own change. Never move just one.",
      examples: [
        { q: "The point (3, 5) is translated (slid) by the vector (2, -4). Where does it end up?", steps: ["Deal with the across (x) part: start at 3 and add 2, giving 3 + 2 = 5.", "Deal with the up (y) part: start at 5 and add -4 (which means go down 4), giving 5 - 4 = 1.", "Put the two new numbers back together as a coordinate."], answer: "(5, 1)" },
        { q: "Translate the point (-2, 4) by the vector (5, -1).", steps: ["Across: -2 + 5 = 3.", "Up: 4 + (-1) = 3.", "New point: (3, 3)."], answer: "(3, 3)." },
        { q: "A triangle has corners at (1, 2), (4, 2) and (2, 5). Translate the whole triangle by the vector (-3, 1). Give the new coordinates of all three corners.", steps: ["(1, 2): x = 1 + (-3) = -2, y = 2 + 1 = 3 → (-2, 3).", "(4, 2): x = 4 + (-3) = 1, y = 2 + 1 = 3 → (1, 3).", "(2, 5): x = 2 + (-3) = -1, y = 5 + 1 = 6 → (-1, 6)."], answer: "New corners: (-2, 3), (1, 3) and (-1, 6)." },
      ],
      tryit: { q: "The point (1, 2) is translated by the vector (3, 4). What is the new point?", answer: "(4, 6), because 1 + 3 = 4 for the across part and 2 + 4 = 6 for the up part." },
    },
  ],
};

PRIMARY_LESSONS.symmetryReflection = {
  title: "Symmetry: mirrors, lines, and what stays put",
  minutes: 20,
  intro: "Have you ever folded a piece of paper in half and found that the two sides matched up perfectly? That is the big idea in this lesson. We are going to meet symmetry, which is a fancy word for when one half of something is a perfect mirror copy of the other half. We will start with things you can see and touch, like your own face and a butterfly, and slowly build up to drawing mirror pictures on a grid. Take it slowly. Every new word gets explained the moment we use it, and there is nothing here you cannot do.",
  sections: [
    {
      h: "1. What symmetry really means",
      body: [
        "Let us start with a mirror. When you stand in front of a mirror and lift your left hand, the you in the mirror lifts a hand too, at exactly the same height, exactly the same distance away on the other side of the glass. That matching-across-a-line idea is the heart of symmetry.",
        "Here is a word we will use a lot: symmetry. Symmetry just means that one half of something is a perfect mirror copy of the other half. If you could swap the two halves over, nobody would be able to tell.",
        "Think about a butterfly. Its left wing and its right wing have the same shape, the same spots and the same colours, just facing opposite ways. Cover one wing with your hand and you could still draw the other wing perfectly, because it is a mirror copy. A butterfly is symmetrical.",
        "Now think about your own face. Your left eye and your right eye sit the same distance from the middle of your face, at the same height. Faces are not perfectly symmetrical, but they are very close, and that is why a mirror image of your face still looks like you.",
      ],
      note: "Quick test for symmetry: could you fold it in half so the two sides land exactly on top of each other? If yes, it is symmetrical.",
      tryit: { q: "Think of a real object in your room. Is it symmetrical? (Try a chair, a spoon, or a teddy bear's face.) How could you check?", answer: "You could imagine folding it down the middle. If the two halves would land exactly on top of each other, it is symmetrical. A spoon and a teddy's face usually are. A single shoe usually is not." },
    },
    {
      h: "2. The line of symmetry",
      body: [
        "When something is symmetrical, there is an invisible line running down the middle where you could fold it. That line has a name: a line of symmetry. A line of symmetry is the fold line where one half of a shape flips over onto the other half and matches perfectly.",
        "Picture folding a paper heart in half from top to bottom. The crease you make is the line of symmetry, because the left half lands exactly on the right half.",
        "Here is a second way to see it. Imagine standing a little mirror straight up on the middle of a shape. If the half you can see, plus its reflection in the mirror, makes the whole shape look complete and correct, then you have found a line of symmetry.",
        "A really important detail: every point on one side of the line has a matching point on the other side, and both are the same distance from the line. If a spot on a butterfly's wing is three centimetres from the middle, its twin spot is also three centimetres from the middle, just on the other side.",
        "Some shapes have more than one line of symmetry. A square can be folded in half four different ways that all match: top to bottom, side to side, and along both slanted diagonals. So a square has four lines of symmetry. A shape like the letter R has none at all, because there is no way to fold it so the two halves match.",
      ],
      examples: [
        { q: "How many lines of symmetry does the capital letter A have?", steps: ["Try folding it top to bottom. The pointy top would land on the flat legs, so that fold does not match. That is not a line of symmetry.", "Try folding it left to right, straight down the middle. The left leg lands on the right leg, and the two halves match.", "So there is exactly one fold that works."], answer: "1 line of symmetry, running straight down the middle from top to bottom." },
        { q: "How many lines of symmetry does a regular pentagon have?", steps: ["A regular shape has as many lines of symmetry as it has sides.", "A pentagon has 5 sides.", "So it has 5 lines of symmetry."], answer: "5 lines of symmetry." },
        { q: "How many lines of symmetry does a rectangle have (assuming it is not a square)?", steps: ["Try folding through the midpoints of the top and bottom edges. The two halves match. That is one line.", "Try folding through the midpoints of the left and right edges. The two halves match. That is a second line.", "Try folding along a diagonal. The corners do not match up because the rectangle is longer than it is wide. Not a line of symmetry.", "So there are exactly 2 lines of symmetry."], answer: "2 lines of symmetry (one running left-right through the middle, one running top-bottom through the middle)." },
      ],
      tryit: { q: "How many lines of symmetry does a capital letter T have?", answer: "1. You can fold it left to right down the middle and the two halves match. No other fold works." },
    },
    {
      h: "3. Reflecting a picture across a mirror line",
      body: [
        "So far we have looked at shapes that are already symmetrical. Now we will make symmetry ourselves. This is called reflecting. To reflect something means to draw its mirror copy on the other side of a line.",
        "The line we mirror across is called the mirror line. It does the same job as the fold line from before, but now we are building the second half rather than checking it.",
        "Here is the golden rule for reflecting, and it is worth saying slowly. Every part of your picture jumps to the other side of the mirror line, landing the same distance away on the far side, staying level with where it started. Close to the mirror stays close. Far from the mirror stays far.",
        "Imagine a grid of little squares, like squared maths paper, with a mirror line drawn straight down the middle from top to bottom. Suppose you have shaded one square that sits two squares to the LEFT of the mirror line. To reflect it, you shade the square that is two squares to the RIGHT of the mirror line, on the very same row. Same row, same distance, opposite side.",
        "Notice what did NOT change: the row. The square did not move up or down, it only hopped across to the other side. When your mirror line goes up and down, reflecting moves things left and right but never up or down.",
      ],
      note: "Same distance, opposite side, same row (for an up-and-down mirror line). Say it like a little chant while you work.",
      examples: [
        { q: "A grid has a mirror line running straight down the middle. A shaded square sits 3 squares to the left of the line, on the top row. Where does its mirror square go?", steps: ["The mirror line goes up and down, so the square hops left to right, not up or down.", "It was 3 squares to the left, so its copy is 3 squares to the right.", "It stays on the top row."], answer: "3 squares to the right of the mirror line, still on the top row." },
        { q: "A grid has a mirror line running horizontally (left to right). A shaded square sits 4 squares to the right of the left edge and 2 squares above the mirror line. Where does its mirror square go?", steps: ["The mirror line is horizontal, so the square flips up and down, not left to right.", "It was 2 squares above the line, so its copy is 2 squares below the line.", "It stays in the same column, 4 squares from the left edge."], answer: "4 squares from the left edge, 2 squares below the mirror line." },
        { q: "A vertical mirror line runs down the middle of a grid. A shaded square is 3 squares to the right of the mirror line and 4 squares down from the top. Where is its reflection?", steps: ["Vertical mirror: the square moves left to right only.", "3 squares right becomes 3 squares left of the mirror line.", "It stays 4 squares down from the top."], answer: "3 squares to the left of the mirror line, 4 squares from the top." },
      ],
      tryit: { q: "Same grid, same up-and-down mirror line. A shaded square is 1 square to the right of the line, on the bottom row. Where is its mirror square?", answer: "1 square to the left of the line, on the bottom row." },
    },
    {
      h: "4. Meeting the coordinate grid",
      body: [
        "Grown-up mathematicians like to give every square on a grid its own name so they can talk about it without pointing. They do this with coordinates. A coordinate is just a pair of numbers that tells you exactly where a point sits on a grid.",
        "Picture two number lines. One runs left to right along the bottom, and it is called the x-axis. One runs up and down the side, and it is called the y-axis. The x-axis is the 'how far across' line and the y-axis is the 'how far up' line.",
        "We write a point's address as two numbers in brackets, like (3, 2). The first number always tells you how far ACROSS you go (that is the x number). The second number always tells you how far UP you go (that is the y number). So (3, 2) means start in the middle, go 3 across, then 2 up.",
        "A handy way to remember the order: you walk along the hallway before you go up the stairs. Along first, then up. So across (x) comes before up (y).",
        "Numbers can be negative too. A negative x number means go LEFT instead of right. A negative y number means go DOWN instead of up. So (-3, 2) means 3 to the left and 2 up, and (4, -3) means 4 to the right and 3 down. The negative sign is just a direction, like the opposite way.",
      ],
      note: "Along the hall, then up the stairs: the first number is across, the second is up. Negatives mean the opposite way (left or down).",
      tryit: { q: "Where do you land if you start in the middle and go to the point (2, -4)?", answer: "2 squares to the right (across), then 4 squares down (because the second number is negative)." },
    },
    {
      h: "5. Reflecting in an up-and-down mirror line (the y-axis)",
      body: [
        "Now we can bring the mirror line and the coordinates together. When the mirror line is the y-axis, remember that is the up-and-down line in the middle, reflecting flips a point from one side to the other, left to right.",
        "Because the point moves left to right, only the 'across' number changes. In other words the x number swaps its sign: a positive (right) becomes the same-sized negative (left), and the other way round. The 'up' number, the y number, does not change at all, because the point never moves up or down.",
        "Picture it: the point (3, 2) is 3 to the right and 2 up. Its mirror image across the up-and-down line is 3 to the LEFT and still 2 up, which we write as (-3, 2). The 2 stayed exactly where it was.",
        "A second way to picture it: hold a mirror standing up along the y-axis. Whatever is 3 steps to the right of the mirror shows up 3 steps to the left in the reflection, at the very same height.",
      ],
      examples: [
        { q: "Reflect the point (5, 1) in the y-axis (the up-and-down line).", steps: ["The y-axis is an up-and-down mirror, so the point flips left to right.", "The across number (x) is 5. It flips sign and becomes -5.", "The up number (y) is 1. It does not move, so it stays 1."], answer: "(-5, 1)" },
        { q: "Reflect the point (-3, 7) in the y-axis.", steps: ["y-axis mirror: only x changes, y stays.", "x is -3. Flip the sign: -3 becomes 3.", "y stays at 7."], answer: "(3, 7)." },
        { q: "A triangle has vertices at (2, 1), (5, 1) and (5, 4). Reflect the whole triangle in the y-axis. Give the new coordinates.", steps: ["Reflect each vertex: x-sign flips, y stays.", "(2, 1) → (-2, 1).", "(5, 1) → (-5, 1).", "(5, 4) → (-5, 4)."], answer: "(-2, 1), (-5, 1) and (-5, 4)." },
      ],
      tryit: { q: "Reflect the point (-2, 6) in the y-axis.", answer: "(2, 6). The across number -2 flips to 2, and the up number 6 stays the same." },
    },
    {
      h: "6. Reflecting in a side-to-side mirror line (the x-axis)",
      body: [
        "This time the mirror line is the x-axis, which is the side-to-side line running along the bottom-middle. When the mirror lies flat like this, points flip UP and DOWN instead of left and right.",
        "So now it is the other way round from last time. Because the point moves up and down, only the 'up' number changes. The y number swaps its sign, and the 'across' number (x) stays exactly the same.",
        "Picture it: the point (4, 3) is 4 across and 3 up. Reflected in the flat x-axis mirror, it goes 4 across and 3 DOWN, which we write as (4, -3). The 4 did not budge.",
        "Here is a real-world way to see it. Think of a duck sitting on a still pond. The duck is a little way above the water, and its reflection appears the same distance BELOW the water. The reflection is directly underneath, not off to the side. The water surface is acting like the x-axis mirror line.",
      ],
      note: "Up-and-down mirror (y-axis) flips the across number. Side-to-side mirror (x-axis) flips the up number. Only the number that points at the mirror gets flipped.",
      examples: [
        { q: "Reflect the point (4, -3) in the x-axis (the side-to-side line).", steps: ["The x-axis is a flat, side-to-side mirror, so the point flips up and down.", "The up number (y) is -3. It flips sign and becomes 3.", "The across number (x) is 4. It does not move, so it stays 4."], answer: "(4, 3)" },
        { q: "Reflect the point (-6, 2) in the x-axis.", steps: ["x-axis mirror: only y changes, x stays.", "y is 2. Flip the sign: 2 becomes -2.", "x stays at -6."], answer: "(-6, -2)." },
        { q: "A triangle has vertices at (1, 2), (4, 2) and (2, 5). Reflect it in the x-axis. Give all three new coordinates.", steps: ["x stays the same, y-sign flips for each vertex.", "(1, 2) → (1, -2).", "(4, 2) → (4, -2).", "(2, 5) → (2, -5)."], answer: "(1, -2), (4, -2) and (2, -5)." },
      ],
      tryit: { q: "Reflect the point (-6, 2) in the x-axis.", answer: "(-6, -2). The up number 2 flips to -2, and the across number -6 stays the same." },
    },
    {
      h: "7. Reflecting in the slanted line y = x",
      body: [
        "There is one more mirror line worth meeting, and it is a slanted one. It has the name y = x, which is a slanted line that goes from the bottom-left corner up to the top-right corner, passing through points like (1, 1), (2, 2) and (3, 3) where the across number and the up number are equal.",
        "Reflecting in this slanted line does something surprising. It does not flip a sign at all. Instead it SWAPS the two numbers over. The across number and the up number simply trade places.",
        "So the point (2, 7) reflected in the line y = x becomes (7, 2). The 2 and the 7 have swapped seats. That is the whole trick.",
        "Why does swapping work? Because this slanted mirror treats 'across' and 'up' as equals. If you were 2 across and 7 up, your reflection is 7 across and 2 up. A nice way to picture it is to tip your head sideways: the slanted line looks straight, and 'across' and 'up' have traded roles.",
      ],
      note: "For the slanted line y = x, do not flip any signs. Just swap the two numbers over: (a, b) becomes (b, a).",
      examples: [
        { q: "Reflect the point (5, 1) in the line y = x.", steps: ["Reflecting in y = x does not change any signs.", "It swaps the two numbers over.", "So the 5 and the 1 trade places."], answer: "(1, 5)" },
        { q: "Reflect the point (-3, 4) in the line y = x.", steps: ["Swap the two numbers: x and y trade places.", "(-3, 4) becomes (4, -3)."], answer: "(4, -3)." },
        { q: "A triangle has corners at (1, 2), (4, 3) and (0, 5). Reflect it in the line y = x. Give the new coordinates.", steps: ["Swap x and y for each corner.", "(1, 2) → (2, 1).", "(4, 3) → (3, 4).", "(0, 5) → (5, 0)."], answer: "(2, 1), (3, 4) and (5, 0)." },
      ],
      tryit: { q: "Reflect the point (8, 3) in the line y = x.", answer: "(3, 8). The two numbers simply swap places." },
    },
    {
      h: "8. Line symmetry and turning symmetry are not the same",
      body: [
        "Everything so far has been about folding and mirrors. That is called line symmetry (sometimes reflective symmetry), which means a shape has at least one line you could fold it along so the halves match.",
        "There is a different kind of symmetry that has nothing to do with folding. It is called rotational symmetry. Rotational symmetry means you can TURN a shape part of the way round, without a full turn, and it looks exactly the same as before you turned it.",
        "A good way to picture rotational symmetry is a fan or a windmill with identical blades. Spin it a little and it looks unchanged, even though it has moved. Now here is the surprising part: a windmill shape can have this turning symmetry while having NO fold line at all, because the blades all curve the same way and a mirror would flip them the wrong way.",
        "So the two kinds are separate. A shape can have line symmetry, or turning symmetry, or both, or neither. Do not assume that having one means having the other.",
        "One more useful fact about counting fold lines. A regular shape (a shape where all the sides are the same length and all the corners are the same) has exactly as many lines of symmetry as it has sides. A regular pentagon has 5 sides, so it has 5 lines of symmetry. A square has 4 sides and 4 lines of symmetry. But a squashed or lopsided shape can have far fewer lines of symmetry, or none, even if it looks a bit like a regular one. Always test by folding rather than guessing.",
      ],
      examples: [
        { q: "How many lines of symmetry does a regular hexagon (a six-sided shape with all sides equal) have?", steps: ["It is a regular shape, so it has as many lines of symmetry as it has sides.", "A hexagon has 6 sides.", "So it has 6 lines of symmetry."], answer: "6 lines of symmetry." },
        { q: "How many lines of symmetry does an equilateral triangle have?", steps: ["An equilateral triangle is regular (3 equal sides and 3 equal angles).", "A regular shape has as many lines of symmetry as it has sides.", "3 sides → 3 lines of symmetry."], answer: "3 lines of symmetry." },
        { q: "A regular octagon has 8 sides. How many lines of symmetry does it have? A rhombus also has 4 equal sides but its angles are not all equal. Does the rhombus have 8, 4, 2 or 0 lines of symmetry?", steps: ["Regular octagon: 8 sides → 8 lines of symmetry.", "A rhombus has equal sides but is not regular (angles are not all equal).", "A rhombus has only 2 lines of symmetry: along each diagonal. The lines through midpoints of sides do not work for a rhombus."], answer: "Regular octagon: 8 lines. Rhombus: 2 lines (along its diagonals)." },
      ],
      tryit: { q: "A shape looks the same after you turn it a quarter turn, but you cannot fold it in half so the halves match. Does it have line symmetry, turning (rotational) symmetry, or both?", answer: "Only turning (rotational) symmetry. It has no line of symmetry because no fold makes the halves match, but turning it a quarter turn leaves it looking the same." },
    },
  ],
};

PRIMARY_LESSONS.spatialPuzzles = {
  title: "Spatial Puzzles: folding, turning and counting shapes in your head",
  minutes: 20,
  intro: "Spatial puzzles are puzzles about shapes and space: what happens when you fold paper, turn a shape round, flip it over like a pancake, or build something out of little cubes. The word 'spatial' just means 'to do with space and where things are'. These puzzles can feel like magic tricks at first, but there is one calm little secret that makes them easy. Instead of trying to see the whole finished answer in a flash, you follow one small part at a time and ask 'what happens to THIS bit?'. We will build that habit up slowly, from the very start, so do not worry if you have never met any of this before.",
  sections: [
    {
      h: "1. The golden rule: follow one part at a time",
      body: [
        "Imagine a friend shuffles a whole pack of cards very fast and asks 'where did the red king go?'. Trying to watch all 52 cards at once is impossible. But if you keep your eyes on just the red king, you can follow it easily. Spatial puzzles are exactly the same. You pick one corner, one dot, one cube, or one fold, and you follow only that.",
        "Here is a real-life way to feel it. Put your hand flat on the table. Now turn your whole hand to point a different way. Your thumb went somewhere, and your little finger went somewhere else. If someone asked 'where is your thumb now?' you would not need to think about your whole hand, just the thumb. That is the golden rule in action.",
        "A puzzle can look scary when you stare at the whole thing. It becomes gentle and slow the moment you say 'never mind the whole picture, what happens to this one little part?'. Everything else in this lesson is just this rule, used on paper, on shapes and on cubes.",
      ],
      note: "When a shape puzzle feels too big to picture, do not picture the whole thing. Pick ONE part and follow only that.",
      tryit: { q: "A puzzle shows a square with a red dot in the top-left corner, and asks what the square looks like after it is turned. What is the single smartest thing to keep your eyes on?", answer: "The red dot. Follow just the dot and see where it ends up, instead of trying to imagine the whole square all at once." },
    },
    {
      h: "2. Folding paper: what a 'fold' and a 'layer' really are",
      body: [
        "Before we cut anything, let us be sure what folding does. A 'fold' is when you bend the paper over so one part lies on top of another part. The line where the paper bends is called the 'fold line'. A 'layer' is simply one thickness of paper. One flat sheet is 1 layer. Fold it once and now, where it is doubled over, you have 2 layers stacked up like a sandwich.",
        "Try this for real with any bit of paper. Hold a sheet up to a window or a lamp. Fold it in half. Look through it. Where it is folded, the light struggles more because it now has to shine through 2 layers instead of 1. Folding does not make new paper, it just stacks the paper you already had.",
        "Here is a picture to hold in your mind. Think of a slice of bread. That is 1 layer. Fold it over to make a little sandwich and now anything that goes through the sandwich, like a toothpick, goes through 2 layers of bread at once. Paper folds the same way.",
        "The big idea to remember for the next section is this. When paper is folded, one poke, one cut or one hole goes through ALL the layers that are stacked at that spot, not just the top one. This is why folded-paper puzzles surprise people.",
      ],
      note: "A 'layer' means one thickness of paper. Folding once doubles the layers where the paper overlaps. It never makes extra paper, it just stacks it.",
      tryit: { q: "You have one flat sheet of paper. You fold it in half one time. At the folded part, how many layers of paper are stacked on top of each other?", answer: "2 layers." },
    },
    {
      h: "3. Cutting through a fold: one snip, more than one shape",
      body: [
        "Now the fun part. When you cut a shape out of folded paper, you are cutting through every layer at once, like the toothpick going through the sandwich. So when you open the paper back up, the shape appears once on each layer you cut through.",
        "Picture folding a sheet in half so the fold line runs straight down the middle. Now snip a small triangle out of the folded edge. While it is folded you only cut one triangle. But you cut through 2 layers, so when you unfold it there are 2 triangles, one on each side of the fold line. They sit like a shape and its reflection in a mirror, joined at the fold.",
        "This mirror effect is worth pausing on. The fold line acts exactly like a mirror. Whatever you cut on one side appears again on the other side, the same distance from the fold, but facing the opposite way, just like your reflection when you stand in front of a mirror and wave your right hand.",
        "So the recipe for a single fold is simple. Count the layers the cut went through, and that is how many copies of the shape you will see when you open it out. One fold means 2 layers, which means 2 copies.",
      ],
      examples: [
        {
          q: "A square of paper is folded in half once. A small heart is cut from the paper so the cut goes through both layers. How many hearts are there when the paper is unfolded, and how are they arranged?",
          steps: [
            "The single fold makes 2 layers stacked together.",
            "The one cut goes through both layers, so it makes a heart on each layer.",
            "2 layers means 2 hearts.",
            "The fold line acts like a mirror, so the two hearts face each other across the fold line, like a reflection.",
          ],
          answer: "2 hearts, mirrored across the fold line.",
        },
        { q: "A sheet of paper is folded in half once. A small rectangle is punched through both layers. How many rectangle holes are there when the paper is unfolded, and how are they arranged?", steps: ["One fold makes 2 layers.", "The punch goes through both layers, creating 1 rectangle hole on each layer.", "2 layers gives 2 rectangle holes.", "The fold line acts as a mirror, so the two holes sit one on each side of it at the same distance."], answer: "2 rectangle holes, one on each side of the fold line, mirrored." },
        { q: "A sheet of paper is folded in half. A small triangle is cut out so that one complete side of the triangle lies exactly along the fold line. The cut goes through both layers. How many holes appear when the paper is unfolded, and what shape do they make together?", steps: ["One fold = 2 layers.", "The cut passes through both layers, making 1 triangle hole on each layer.", "Both triangle holes share the fold line as one of their sides.", "When unfolded, the two triangle holes sit joined along the fold line.", "Two congruent triangles joined along one shared side form a four-sided shape, like a diamond or kite."], answer: "2 triangle holes, which together form a symmetrical four-sided shape (like a diamond or kite) along the fold line." },
      ],
      tryit: { q: "Paper is folded in half once. A circle is punched through both layers. How many circles appear when you unfold the paper?", answer: "2 circles, one on each side of the fold line." },
    },
    {
      h: "4. Folding more than once: counting the layers",
      body: [
        "What if you fold the paper more than once? The same golden rule works, you just have to count the layers carefully first. Every time you fold, you double the number of layers, because you lay the whole stack on top of itself again.",
        "Let us count slowly. Start with 1 flat sheet. Fold it in half once and you have 2 layers. Fold it in half again (so it is now folded into quarters) and each of those 2 layers doubles, giving 4 layers. Fold it a third time and 4 doubles to 8 layers. The pattern is 1, then 2, then 4, then 8, doubling each fold.",
        "A gentle way to see this without any paper: think of a group of people lining up to shake hands. Fold once and 2 people are stacked. Fold again and those 2 become 4. Each fold invites the whole group to double up. Folding is a doubling machine.",
        "Once you know the number of layers, cutting is easy again. One cut goes through all of them, so the number of shapes you get when you unfold equals the number of layers. Fold twice (4 layers), cut once, and you get 4 shapes.",
      ],
      note: "Each fold DOUBLES the layers: 1, 2, 4, 8. The number of shapes you cut equals the number of layers the cut passed through.",
      examples: [
        {
          q: "A sheet is folded in half, then folded in half again. A star is cut through all the layers. How many stars appear when it is fully unfolded?",
          steps: [
            "Start with 1 layer.",
            "First fold doubles it to 2 layers.",
            "Second fold doubles 2 to 4 layers.",
            "The one cut goes through all 4 layers, making 1 star on each.",
          ],
          answer: "4 stars.",
        },
        { q: "A sheet of paper is folded in half three times. A circle is punched through all the layers. How many circles appear when the paper is fully unfolded?", steps: ["Start with 1 layer.", "First fold: 1 × 2 = 2 layers.", "Second fold: 2 × 2 = 4 layers.", "Third fold: 4 × 2 = 8 layers.", "One punch through all 8 layers gives 8 circles."], answer: "8 circles." },
        { q: "A square sheet is folded in half from left to right, then in half from top to bottom. A hole is punched exactly at the corner where the two fold lines cross. How many holes appear when the paper is fully unfolded?", steps: ["Two folds make 4 layers, so you might expect 4 holes.", "But the corner where the two fold lines cross is the very centre of the original sheet.", "All 4 layers lie directly on top of each other at that centre point.", "The single punch makes just 1 hole through all 4 layers at the same spot."], answer: "1 hole, right at the centre of the original sheet. All 4 layers overlap there, so only one hole appears." },
      ],
      tryit: { q: "Paper is folded in half three times, then a small circle is cut through every layer. How many circles appear when it is unfolded? (Hint: count the doubling. 1, 2, 4, then?)", answer: "8 circles. Three folds double the layers three times: 1 to 2 to 4 to 8." },
    },
    {
      h: "5. Turning a shape: what a rotation is",
      body: [
        "Now we leave paper and think about moving a whole shape. There are two moves that often get muddled up, so we will meet them one at a time. The first is a 'rotation', which is just a posh word for turning something round, like turning a steering wheel or the hands of a clock.",
        "The key thing about a rotation is that the shape never leaves the table. Imagine a letter F cut out of cardboard, lying flat. You spin it round on the spot. It might now point up, down, left or right, but you have not lifted it or flipped it over. The same face is still looking up at you the whole time.",
        "Try it with your own hand again. Keep your palm facing down on the table and turn your hand to point in a new direction. Your palm still faces the table. Nothing got swapped over, it just aimed a different way. That is a pure rotation.",
        "So when a puzzle shows a shape and then a turned version, ask: could I get there just by spinning the first one on the spot, without lifting it? If yes, it is a rotation.",
      ],
      tryit: { q: "You take a cardboard letter P lying flat on the table and spin it a quarter turn without lifting it. Is the letter now facing up towards you, or has it been flipped over onto its back?", answer: "Still facing up towards you. Spinning on the spot (a rotation) never flips the shape over, it keeps the same face showing." },
    },
    {
      h: "6. Flipping a shape: rotation versus reflection",
      body: [
        "The second move is a 'reflection', which means flipping the shape over, like flipping a pancake or turning a page in a book. When you flip a shape, the side that was hidden underneath now faces up. This is the move that makes a mirror image.",
        "Here is why this matters. A rotation and a reflection can sometimes look almost the same, and that is exactly what tricky puzzles rely on. We need a reliable test to tell them apart, and there is a lovely one that never lets you down: the reading order.",
        "Here is the test. Label the corners of your shape and read them going clockwise, the way a clock's hands travel, say A then B then C. After a rotation, if you read them clockwise again they still go A, B, C in the same order, because turning never scrambles the order. After a reflection, reading clockwise now gives you A, C, B, the reversed order. Flipping always reverses the reading order, just like the word b appears as d in a mirror.",
        "A homely way to remember it: think of your two hands. Your left hand and right hand are mirror images. No matter how you turn your left hand, you can never make it sit exactly on top of your right hand, because a reflection has reversed it. Rotation keeps a shape 'the same handedness', reflection swaps it. So if the order flipped, it was a reflection.",
      ],
      note: "The test: read the corners clockwise. Rotation keeps the same order. Reflection reverses it. Same order = turn. Reversed order = flip.",
      examples: [
        {
          q: "A triangle has corners that read A, B, C going clockwise. After a mystery move, the corners read A, B, C going anticlockwise instead. Was the move a rotation or a reflection?",
          steps: [
            "A rotation would keep the reading order clockwise, still A, B, C clockwise.",
            "Here the order went from clockwise to anticlockwise, so it has been reversed.",
            "Only a reflection reverses the reading order.",
          ],
          answer: "A reflection (a flip).",
        },
        { q: "A pentagon has corners labeled A, B, C, D, E going clockwise. After a mystery move, reading the corners clockwise still gives A, B, C, D, E in the same order. Was the move a rotation or a reflection?", steps: ["Clockwise order before: A, B, C, D, E.", "Clockwise order after: A, B, C, D, E — unchanged.", "A rotation keeps the clockwise reading order the same.", "A reflection would reverse it, giving A, E, D, C, B.", "The order is unchanged, so the move was a rotation."], answer: "A rotation." },
        { q: "A quadrilateral has corners P, Q, R, S going clockwise. Move 1 gives corners still reading P, Q, R, S clockwise. Move 2 gives corners reading P, S, R, Q clockwise. Which move was a rotation and which was a reflection?", steps: ["Move 1: P, Q, R, S clockwise matches the original order — no reversal.", "Same order = rotation. Move 1 is a rotation.", "Move 2: P, S, R, Q clockwise. Compare with original P, Q, R, S.", "Reading P, Q, R, S anticlockwise gives P, S, R, Q — the order has been reversed.", "Reversed order = reflection. Move 2 is a reflection."], answer: "Move 1 is a rotation. Move 2 is a reflection." },
      ],
      tryit: { q: "The letter R is turned so it lies on its side, but you can still tell it is a normal R and not a backwards R. Was it rotated or reflected?", answer: "Rotated. A reflection would make it a backwards (mirror-image) R. Since it is still a proper R, it was only turned." },
    },
    {
      h: "7. Building with cubes: counting a block you can hold",
      body: [
        "Now to the last idea: counting little cubes. A 'unit cube' just means one small cube that is the same size as all the others, like a single sugar cube or one bead of a building set. When we stack lots of them into a neat box shape we call the whole thing a 'cuboid', which is a solid shape like a brick or a cereal box.",
        "Imagine building a cuboid out of sugar cubes. First you lay a flat rectangle on the table, say 4 cubes long and 3 cubes wide. How many are in that one flat layer? It is 4 rows of 3, or 4 times 3, which is 12 cubes. This is just the area idea you already know, counting a grid by multiplying its two sides.",
        "Now stack a second identical layer of 12 cubes right on top, and then a third. You have made the cuboid 3 cubes tall. Each layer has 12 cubes and there are 3 layers, so altogether it is 12 times 3, which is 36 cubes. We multiplied the length by the width to get one layer, then multiplied by the height for all the layers.",
        "So the tidy rule for any solid brick of cubes is: length times width times height. It is the same multiplying trick as area, just stretched into a third direction (up). A block 4 long, 3 wide and 2 tall holds 4 times 3 times 2, which is 24 cubes.",
      ],
      note: "Cubes in a solid brick = length x width x height. It is just 'area of one layer' multiplied by how many layers are stacked up.",
      examples: [
        {
          q: "A cuboid is built from unit cubes. It is 5 cubes long, 2 cubes wide and 3 cubes tall. How many unit cubes were used?",
          steps: [
            "Find one flat layer first: 5 long times 2 wide = 10 cubes in a layer.",
            "There are 3 layers stacked up (the height is 3).",
            "Multiply the layer by the number of layers: 10 times 3 = 30.",
          ],
          answer: "30 unit cubes.",
        },
        { q: "A block of unit cubes is 6 cubes long, 4 cubes wide and 2 cubes tall. How many unit cubes were used?", steps: ["One flat layer: 6 × 4 = 24 cubes.", "There are 2 layers stacked up.", "Total: 24 × 2 = 48 cubes."], answer: "48 unit cubes." },
        { q: "A teacher builds a hollow rectangular frame from unit cubes. It has four walls each exactly one cube thick, and no top or bottom. The outside measures 5 cubes long, 4 cubes wide and 3 cubes tall. How many unit cubes make up the walls?", steps: ["Imagine filling the frame completely solid: 5 × 4 × 3 = 60 cubes.", "The hollow inside (removing 1 cube from every side, but the full height since there is no top or bottom) is (5 − 2) × (4 − 2) × 3 = 3 × 2 × 3 = 18 cubes.", "Cubes in the walls = total solid minus hollow = 60 − 18 = 42."], answer: "42 unit cubes." },
      ],
      tryit: { q: "A cuboid of unit cubes is 3 long, 3 wide and 2 tall. How many cubes is that? (Hint: work out one flat layer first, then multiply by the height.)", answer: "18 cubes. One layer is 3 x 3 = 9, and there are 2 layers, so 9 x 2 = 18." },
    },
    {
      h: "8. The cubes you cannot see, and going one step at a time",
      body: [
        "Here is a trap that catches lots of people, and it brings us right back to the golden rule. When you look at a solid block of cubes, you can only see the ones on the outside. There are hidden cubes tucked inside and round the back that your eyes never reach. This is exactly why we multiply length times width times height instead of trying to count the cubes we can spot.",
        "Picture a full box of chocolates before any are eaten. From the top you see a neat grid of chocolates, but you know the box is full, so you would work out the total by multiplying, not by only counting the layer you can see. A cube block is the same: trust the multiplying, because it counts the hidden cubes too.",
        "This connects every part of today's lesson. Folding puzzles trip people up because of the layers they forget to count. Turn-versus-flip puzzles trip people up when they rush and guess. Cube puzzles trip people up because of the cubes they cannot see. In every case the cure is the same: slow down and go one step at a time.",
        "So here is your finishing habit. Do not try to leap straight to the final answer in one big guess. Sketch it, or picture it slowly, one fold, one turn, one layer at a time. Count the layers before you cut. Check the reading order before you decide turn or flip. Find one layer of cubes before you multiply up. Small careful steps beat one big rushed jump every single time.",
      ],
      note: "You cannot see the hidden cubes inside a block, so never count only the ones showing. Multiplying length x width x height counts the hidden ones for you.",
      examples: [
        {
          q: "A cuboid is 4 cubes long, 3 cubes wide and 3 cubes tall. How many cubes are completely hidden inside, with no face showing on the outside at all?",
          steps: [
            "First find the total number of cubes: 4 x 3 x 3 = 36 cubes.",
            "The hidden cubes are the ones with no outside face. Peel off the whole outer shell of cubes, one layer thick, all the way round.",
            "Peeling one layer off each side makes the inside brick shorter by 2 in every direction: length 4 becomes 2, width 3 becomes 1, height 3 becomes 1.",
            "So the hidden inside brick is 2 x 1 x 1 = 2 cubes.",
          ],
          answer: "2 hidden cubes.",
        },
        { q: "A solid cuboid of unit cubes is 5 cubes long, 4 cubes wide and 3 cubes tall. How many cubes are completely hidden inside with no face on the outside surface?", steps: ["Total cubes: 5 × 4 × 3 = 60.", "Peel one layer off every side: length 5 − 2 = 3, width 4 − 2 = 2, height 3 − 2 = 1.", "Hidden inner block: 3 × 2 × 1 = 6 cubes."], answer: "6 hidden cubes." },
        { q: "A solid cuboid of unit cubes contains 60 cubes in total. It is 5 cubes long and 4 cubes wide. How tall is it, and how many cubes are completely hidden inside?", steps: ["Total = length × width × height, so 60 = 5 × 4 × height.", "5 × 4 = 20, so height = 60 ÷ 20 = 3 cubes.", "Peel one layer all round: inner block is (5 − 2) × (4 − 2) × (3 − 2) = 3 × 2 × 1 = 6 cubes.", "6 cubes are completely hidden inside."], answer: "Height = 3 cubes. 6 cubes are completely hidden inside." },
      ],
      tryit: { q: "Which is the safer way to count the cubes in a solid brick: carefully counting only the cubes you can see in the picture, or multiplying length x width x height? Why?", answer: "Multiplying length x width x height, because it counts the hidden cubes inside and round the back that you cannot see. Counting only the visible ones would miss those." },
    },
  ],
};

PRIMARY_LESSONS.factorsMultiplesPrimes = {
  title: "Factors, Multiples & Primes: the building blocks of numbers",
  minutes: 20,
  intro: "Every whole number is built out of smaller numbers multiplied together, a bit like a wall built out of bricks. In this lesson we will meet three friendly words that describe how numbers fit together: factors, multiples and primes. We will take them slowly, one at a time, and look at each idea in more than one way, so do not worry if it feels new. That just means you are about to learn something.",
  sections: [
    {
      h: "1. What is a factor? Sharing things out evenly",
      body: [
        "Imagine you have 12 sweets and you want to share them fairly between some friends, with nobody getting more than anybody else and none left over. If you share them between 3 friends, each friend gets 4 sweets. It works perfectly, with nothing left over. So we say 3 is a FACTOR of 12.",
        "A factor of a number is a whole number that divides into it evenly, meaning there is nothing left over at the end. 'Whole number' just means a counting number like 1, 2, 3, 4 and so on, not a half or a bit of one.",
        "Here is a second way to picture the very same idea. Imagine 12 square tiles. Can you arrange all 12 into neat equal rows, like a little rectangle, with no gaps and no tiles sticking out? Yes: you could make 3 rows of 4, or 2 rows of 6, or 4 rows of 3. Because those arrangements come out perfectly even, the numbers 2, 3, 4 and 6 are all factors of 12.",
        "Now try to make equal rows of 5 out of 12 tiles. You get 2 rows of 5, which is only 10 tiles, and then 2 tiles left over with nowhere to go. Because it does not come out even, 5 is NOT a factor of 12.",
      ],
      note: "A factor always divides in with nothing left over. If there is a remainder, even just 1 left over, it is not a factor.",
      tryit: { q: "You have 15 sweets. Can you share them evenly between 3 people? Is 3 a factor of 15?", answer: "Yes. Each person gets 5 sweets with none left over, so 3 is a factor of 15." },
    },
    {
      h: "2. Finding ALL the factors of a number",
      body: [
        "A number usually has several factors, not just one. To find every factor of 12, we go looking for all the whole numbers that divide into it evenly.",
        "Here is the neat part. Factors always come in pairs that multiply together to make the number. For 12 the pairs are 1 times 12, 2 times 6, and 3 times 4. Think of it like a see-saw: if you pick one factor on one side, its partner is waiting on the other side to balance it.",
        "The tidy way to find them all is to start at 1 and count upwards, checking each number in turn. Does 1 divide into 12? Yes, and its partner is 12. Does 2? Yes, partner 6. Does 3? Yes, partner 4. Does 4? Yes, and its partner is 3, which we already have. Once the pairs start repeating, you know you have found them all.",
        "So the full list of factors of 12 is 1, 2, 3, 4, 6 and 12. Notice that 1 and the number itself are always factors of every number, because 1 times the number always makes the number.",
      ],
      note: "Always start at 1 and work upwards in order. Jumping about randomly is how people miss a factor.",
      examples: [
        {
          q: "List all the factors of 18.",
          steps: [
            "Start at 1: 1 times 18 makes 18, so 1 and 18 are both factors.",
            "Try 2: 2 times 9 makes 18, so 2 and 9 are both factors.",
            "Try 3: 3 times 6 makes 18, so 3 and 6 are both factors.",
            "Try 4: 18 does not divide evenly by 4 (it leaves 2 over), so 4 is not a factor. Same for 5.",
            "Try 6: we already have 6 from the 3 times 6 pair, so the pairs are now repeating and we can stop.",
          ],
          answer: "The factors of 18 are 1, 2, 3, 6, 9 and 18.",
        },
        { q: "List all the factors of 30.", steps: ["Start at 1: 1 × 30 = 30, so 1 and 30 are factors.", "Try 2: 2 × 15 = 30, so 2 and 15 are factors.", "Try 3: 3 × 10 = 30, so 3 and 10 are factors.", "Try 4: 30 ÷ 4 = 7 remainder 2, not a factor.", "Try 5: 5 × 6 = 30, so 5 and 6 are factors.", "Try 6: we already have 6 from the 5 × 6 pair, so the pairs are repeating and we stop."], answer: "The factors of 30 are 1, 2, 3, 5, 6, 10, 15 and 30." },
        { q: "List all the factors of 36, and explain how you know when to stop.", steps: ["1 × 36 = 36, so 1 and 36 are factors.", "2 × 18 = 36, so 2 and 18 are factors.", "3 × 12 = 36, so 3 and 12 are factors.", "4 × 9 = 36, so 4 and 9 are factors.", "Try 5: 36 ÷ 5 = 7.2, not a factor.", "6 × 6 = 36, so 6 is a factor. The two sides of this pair have met, so all pairs are found and we stop."], answer: "The factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18 and 36. Stop when the two partners in a pair meet — here that happens at 6 × 6." },
      ],
      tryit: { q: "List all the factors of 20. Try to find them in pairs.", answer: "1, 2, 4, 5, 10 and 20 (the pairs are 1 times 20, 2 times 10, and 4 times 5)." },
    },
    {
      h: "3. What is a multiple? Counting in jumps",
      body: [
        "A multiple of a number is what you land on when you count in steps of that number, starting from it. The multiples of 4 are 4, 8, 12, 16, 20 and they keep going forever.",
        "Picture a hopscotch grid, or a number line, where you jump 4 squares at a time. You land on 4, then 8, then 12, then 16. Every square you land on is a multiple of 4. The squares you skip over, like 5, 6 and 7, are not.",
        "Another way to think of it: a multiple of 4 is simply 4 groups, or 8, or any number of equal groups. Three bags with 4 apples in each gives 12 apples, so 12 is a multiple of 4. Five bags of 4 gives 20, so 20 is a multiple of 4 as well.",
        "Here is a big difference to remember. A number has only a small, fixed number of factors, but it has endlessly many multiples. You can always take one more jump and find a bigger multiple, so the list never ends.",
      ],
      note: "Factors are usually smaller than the number (or equal to it). Multiples are usually bigger than the number (or equal to it). That is a handy way to tell them apart.",
      tryit: { q: "Write down the first five multiples of 6.", answer: "6, 12, 18, 24 and 30 (counting up in steps of 6)." },
    },
    {
      h: "4. Factors and multiples are two ends of the same fact",
      body: [
        "Factors and multiples describe the same relationship, just looked at from opposite ends. Take the fact 3 times 4 makes 12. From this one fact we can say two things.",
        "We can say 3 is a FACTOR of 12, because 3 divides into 12 evenly. And we can say 12 is a MULTIPLE of 3, because 12 is what you get by multiplying 3. Same fact, two names, depending on which number you are looking at.",
        "A good way to keep them straight: factors are the little numbers hiding inside a big one, and multiples are the big numbers you build by using a little one over and over. If 45 breaks into 9 times 5, then 9 and 5 are factors hiding inside 45, and 45 is a multiple built from 9 (and also from 5).",
      ],
      examples: [
        {
          q: "Is 45 a multiple of 9? And is 9 a factor of 45?",
          steps: [
            "Share 45 into groups of 9: 45 divided by 9 is exactly 5, with nothing left over.",
            "Because it divides evenly, 9 fits into 45 perfectly, so 9 is a factor of 45.",
            "And because 45 is made from 9 times 5, it is one of the numbers you land on counting in nines, so 45 is a multiple of 9.",
          ],
          answer: "Yes to both. 9 is a factor of 45, and 45 is a multiple of 9.",
        },
        { q: "The fact 7 × 8 = 56 is true. Use it to write one statement about factors and one about multiples.", steps: ["7 and 8 both divide evenly into 56 (with nothing left over), so they are both factors of 56.", "56 is built by multiplying 7 and 8, so it appears when you count in sevens and when you count in eights — 56 is a multiple of both.", "Four statements follow from one fact: 7 is a factor of 56, 8 is a factor of 56, 56 is a multiple of 7, and 56 is a multiple of 8."], answer: "7 and 8 are both factors of 56. 56 is a multiple of both 7 and 8." },
        { q: "I am thinking of a number. It is a multiple of 4, a multiple of 6 and also a factor of 48. What numbers could it be?", steps: ["A number that is a multiple of both 4 and 6 must be a multiple of the lowest common multiple of 4 and 6, which is 12.", "Multiples of 12 up to 48: 12, 24, 36, 48.", "Now check which of those also divide evenly into 48: 48 ÷ 12 = 4 (yes), 48 ÷ 24 = 2 (yes), 48 ÷ 36 = 1.33... (no), 48 ÷ 48 = 1 (yes).", "The possible numbers are 12, 24 and 48."], answer: "12, 24 or 48." },
      ],
      tryit: { q: "Fill in the two words. In the fact 5 times 7 makes 35: 5 is a ___ of 35, and 35 is a ___ of 5.", answer: "5 is a FACTOR of 35, and 35 is a MULTIPLE of 5." },
    },
    {
      h: "5. Common factors: numbers that fit into both",
      body: [
        "Sometimes we look at two numbers at once and ask what they have in common. A COMMON factor is a whole number that divides evenly into both numbers, meaning it is a factor of each of them.",
        "Imagine you have 12 red counters and 18 blue counters, and you want to put them into equal-sized piles, using the same pile size for both colours, with none left over from either. What pile sizes would work? A pile size of 3 works: 12 splits into four piles of 3, and 18 splits into six piles of 3. So 3 is a common factor of 12 and 18.",
        "To find all the common factors, write out the factors of each number and then look for the ones that appear on both lists. Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. The numbers that appear on both lists are 1, 2, 3 and 6, so those are the common factors.",
        "The biggest number on that shared list is called the HIGHEST COMMON FACTOR, often shortened to HCF. For 12 and 18 the highest common factor is 6. It is the largest equal pile size that works for both.",
      ],
      note: "The number 1 is a factor of every number, so 1 is always a common factor of any two numbers. That means two numbers always have at least one thing in common.",
      examples: [
        {
          q: "Find the highest common factor of 8 and 12.",
          steps: [
            "List the factors of 8: 1, 2, 4, 8.",
            "List the factors of 12: 1, 2, 3, 4, 6, 12.",
            "Circle the numbers on both lists: 1, 2 and 4.",
            "Pick the biggest shared one.",
          ],
          answer: "The highest common factor of 8 and 12 is 4.",
        },
        { q: "Find the highest common factor of 24 and 36.", steps: ["Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24.", "Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.", "Numbers appearing on both lists: 1, 2, 3, 4, 6 and 12.", "The biggest shared factor is 12."], answer: "The highest common factor of 24 and 36 is 12." },
        { q: "A hall has 60 chairs and 48 tables. A teacher wants to arrange them into identical groups, each group having the same number of chairs and the same number of tables, with nothing left over. What is the largest number of groups she can make, and how many chairs and tables are in each group?", steps: ["The largest number of groups equals the HCF of 60 and 48.", "Factors of 60: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60.", "Factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48.", "Biggest shared factor: 12. So 12 groups.", "Chairs per group: 60 ÷ 12 = 5. Tables per group: 48 ÷ 12 = 4."], answer: "12 groups, each with 5 chairs and 4 tables." },
      ],
      tryit: { q: "What is the highest common factor of 20 and 30?", answer: "10 (factors of 20 are 1, 2, 4, 5, 10, 20; factors of 30 are 1, 2, 3, 5, 6, 10, 15, 30; the biggest number on both lists is 10)." },
    },
    {
      h: "6. Common multiples: numbers that both can reach",
      body: [
        "In the same way, a COMMON multiple of two numbers is a number that appears in both of their multiple lists. In other words, it is a number that both can reach by counting in their own steps.",
        "Picture two frogs on a number line. One frog jumps in steps of 2 and lands on 2, 4, 6, 8, 10, 12. The other jumps in steps of 3 and lands on 3, 6, 9, 12, 15. Sometimes they land on the very same square. They both land on 6, and they both land on 12. Those shared landing squares are common multiples of 2 and 3.",
        "The smallest shared landing square (not counting zero) has a special name: the LOWEST COMMON MULTIPLE, often shortened to LCM. For 2 and 3 the lowest common multiple is 6.",
        "To find it, list the multiples of each number and look for the first one they share. This is useful in real life too. If one bus comes every 4 minutes and another every 6 minutes, and they both just left together, the lowest common multiple tells you when they will next leave at the same moment.",
      ],
      examples: [
        {
          q: "Find the lowest common multiple of 4 and 6.",
          steps: [
            "List multiples of 4: 4, 8, 12, 16, 20, 24.",
            "List multiples of 6: 6, 12, 18, 24, 30.",
            "Find the first number that appears on both lists: 12 is on both.",
          ],
          answer: "The lowest common multiple of 4 and 6 is 12.",
        },
        { q: "Find the lowest common multiple of 6 and 9.", steps: ["List multiples of 6: 6, 12, 18, 24, 30.", "List multiples of 9: 9, 18, 27, 36.", "Find the first number on both lists: 18 appears on both."], answer: "The lowest common multiple of 6 and 9 is 18." },
        { q: "One bus leaves a stop every 8 minutes. Another leaves the same stop every 6 minutes. Both buses left together at 9:00 am. At what time will they next leave together?", steps: ["Find the lowest common multiple of 8 and 6.", "Multiples of 8: 8, 16, 24, 32.", "Multiples of 6: 6, 12, 18, 24.", "First shared number: 24 minutes.", "9:00 am + 24 minutes = 9:24 am."], answer: "9:24 am." },
      ],
      tryit: { q: "What is the lowest common multiple of 3 and 5?", answer: "15 (multiples of 3 are 3, 6, 9, 12, 15; multiples of 5 are 5, 10, 15; the first shared one is 15)." },
    },
    {
      h: "7. Prime numbers: the numbers that will not split",
      body: [
        "Some numbers just refuse to be shared out into equal groups (other than the two obvious ways). Take 7 sweets. You cannot split 7 evenly between 2, 3, 4, 5 or 6 people. There is always a leftover. The only tidy ways to arrange 7 are 1 row of 7, or 7 rows of 1. Numbers like this are called PRIME numbers.",
        "A prime number is a whole number bigger than 1 that has exactly two factors: 1 and itself, and no others. 7 is prime because its only factors are 1 and 7.",
        "A number with more than two factors is called a COMPOSITE number, which just means it is built from smaller pieces multiplied together. 8 is composite because it has the factors 1, 2, 4 and 8, which is more than two. You can build 8 as 2 times 4.",
        "Here is the classic trap that catches lots of people. Is 1 a prime number? It feels like it might be, but no. A prime needs exactly two DIFFERENT factors, and 1 has only one factor, which is 1 itself. So 1 is not prime. It is not composite either. The number 1 sits in a little category all of its own.",
        "One more surprise worth knowing: 2 is a prime number, and it is the only even prime. Every other even number can be shared into 2 equal groups, so it has 2 as an extra factor and cannot be prime. Also, being odd does not make a number prime. Plenty of odd numbers, like 9 (which is 3 times 3) and 15 (which is 3 times 5), are not prime at all.",
      ],
      note: "To check if a number is prime, try dividing it by 2, then 3, then 5, then 7 and so on. If any of them divides in evenly, it is not prime. The primes up to 20 are 2, 3, 5, 7, 11, 13, 17 and 19, which is a good little list to remember.",
      examples: [
        {
          q: "Is 21 a prime number?",
          steps: [
            "Try dividing 21 by 2: it leaves 1 over, so no.",
            "Try dividing 21 by 3: 21 divided by 3 is exactly 7, with nothing left over.",
            "That means 3 and 7 are extra factors, so 21 has the factors 1, 3, 7 and 21, which is more than two.",
          ],
          answer: "No. 21 is not prime, it is composite, because 21 equals 3 times 7.",
        },
        { q: "Is 37 a prime number? Show your checking.", steps: ["Try 2: 37 is odd, so not divisible by 2.", "Try 3: 3 + 7 = 10, which is not a multiple of 3, so 37 is not divisible by 3.", "Try 5: 37 does not end in 0 or 5, so not divisible by 5.", "Try 7: 37 ÷ 7 = 5 remainder 2, so not divisible by 7.", "Since 7 × 7 = 49 > 37, any factor bigger than 7 would need a partner smaller than 7, which we have already checked. No factor found."], answer: "Yes, 37 is prime." },
        { q: "List all the prime numbers between 20 and 40.", steps: ["Even numbers (22, 24, 26, 28, 30, 32, 34, 36, 38, 40) are divisible by 2, so none are prime.", "Check 21 = 3 × 7, 25 = 5 × 5, 27 = 3 × 9, 33 = 3 × 11, 35 = 5 × 7, 39 = 3 × 13 — all composite.", "Test 23: not divisible by 2, 3 or 5, and 5 × 5 = 25 > 23, so prime.", "Test 29: not divisible by 2, 3, 5 or 7 (29 ÷ 7 = 4r1). Prime.", "Test 31: not divisible by 2, 3, 5 or 7 (31 ÷ 7 = 4r3). Prime.", "Test 37: not divisible by 2, 3, 5 or 7 (37 ÷ 7 = 5r2). Prime."], answer: "23, 29, 31 and 37." },
      ],
      tryit: { q: "Is 13 a prime number? Check whether anything divides into it evenly.", answer: "Yes, 13 is prime. Nothing from 2 up to 12 divides into it evenly, so its only factors are 1 and 13." },
    },
    {
      h: "8. Putting it all together",
      body: [
        "These three ideas turn up together all the time, especially when you start working with fractions. Here is one place they team up.",
        "To make a fraction simpler, you find a common factor of the top number and the bottom number, then divide both of them by it. Using the highest common factor gets the fraction as simple as possible in one go.",
        "Prime numbers matter here too, because when you cannot find any common factor bigger than 1, the fraction is already as simple as it can be. And common multiples come in handy when you need to add fractions with different bottom numbers, because you look for a number both bottoms can reach.",
        "So the three words work as a team. Factors help you break numbers apart, multiples help you build them up, and primes are the smallest building blocks of all. Take your time with them, because once these three feel comfortable, a great deal of the trickier maths ahead becomes much friendlier.",
      ],
      examples: [
        {
          q: "Simplify the fraction 18/24 using factors.",
          steps: [
            "Find the highest common factor of 18 and 24. The factors of 18 are 1, 2, 3, 6, 9, 18 and the factors of 24 are 1, 2, 3, 4, 6, 8, 12, 24, so the biggest shared factor is 6.",
            "Divide the top by 6: 18 divided by 6 is 3.",
            "Divide the bottom by 6: 24 divided by 6 is 4.",
            "Check whether 3 and 4 share any factor bigger than 1: they do not, so the fraction is now fully simplified.",
          ],
          answer: "18/24 simplifies to 3/4.",
        },
        { q: "Simplify the fraction 36/48 by finding the highest common factor first.", steps: ["Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.", "Factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48.", "Biggest shared factor: 12.", "Divide top and bottom by 12: 36 ÷ 12 = 3 and 48 ÷ 12 = 4.", "HCF of 3 and 4 is 1, so 3/4 is fully simplified."], answer: "36/48 simplifies to 3/4." },
        { q: "To add 1/4 + 1/6, both fractions need the same bottom number. Use the lowest common multiple of 4 and 6 to find a common bottom, then add.", steps: ["Find LCM of 4 and 6: multiples of 4 are 4, 8, 12; multiples of 6 are 6, 12. LCM = 12.", "Convert 1/4: multiply top and bottom by 3, giving 3/12.", "Convert 1/6: multiply top and bottom by 2, giving 2/12.", "Add: 3/12 + 2/12 = 5/12.", "Check whether 5/12 simplifies: HCF of 5 and 12 is 1, so it is already in its simplest form."], answer: "1/4 + 1/6 = 5/12." },
      ],
      tryit: { q: "Simplify the fraction 12/18 by dividing top and bottom by their highest common factor.", answer: "2/3. The highest common factor of 12 and 18 is 6, and 12 divided by 6 is 2 while 18 divided by 6 is 3." },
    },
  ],
};