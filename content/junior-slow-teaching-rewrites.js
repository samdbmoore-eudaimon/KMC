const E = (q, steps, answer, structureId, difficulty) => ({ q, steps, answer, structureId, difficulty });
const S = (h, body, examples, note) => ({ h, body, examples, note });

const SOURCES = {
  placeValue: ["countIntegers", "cryptarith", "digitDetective", "customCount", "estimation"],
  numberProperties: ["countIntegers", "modular", "digitDetective", "repeatOp", "productOpt"],
  coordGeom: ["coordGeom", "spatialTransform", "midpointSquare", "pythagQuest", "networkGraph"],
  transformations: ["spatialTransform", "shapeFold", "coordGeom", "tiling", "cubeProps"],
  statisticsMeasures: ["meanPuzzle", "sportScore", "allocation", "estimation", "moneyTrail"],
  similarityPythagoras: ["pythagQuest", "coordGeom", "midpointSquare", "trianglesInRect", "poolPath"],
  nonLinearRelations: ["bouncing", "productOpt", "repeatOp", "customCount", "numberMachine"],
};

const id = (topic, route) => `${topic}_route_${route}_${SOURCES[topic][route - 1]}`;
const examples = (topic, route, rows) => rows.map((row, i) => E(row[0], row[1], row[2], id(topic, route), i + 1));

function lesson(title, order, prereq, intro, sections, recap, mistakes) {
  return { title, order, prereq, minutes: 28, intro, sections, recap, mistakes };
}

function placeValue() {
  const topic = "placeValue";
  return lesson("Place value across the number line", 1, [{ module: "primary", key: "placeValue" }, { module: "primary", key: "decimalPlaceValue" }],
    "Place value is the promise that a digit's position tells us its value. We will extend that familiar promise in both directions: through decimals, through zero and into negative numbers. Each new idea will be tied back to a number line so that the symbols always describe a real position.", [
      S("1. A digit has a face value and a place value", [
        "The digit 7 always has face value seven, but its place decides whether it means 7, 70, 0.7 or something else. Moving one place left multiplies its value by 10; moving one place right divides it by 10.",
        "Zero is a place holder. In 4,072 it keeps the hundreds place empty so that the 4 still means four thousands.",
        "Read a number by breaking it into the value contributed by each non-zero digit. This expanded form makes later comparisons much safer."
      ], examples(topic, 1, [
        ["What is the value of the 6 in 46,218?", ["The 6 is in the thousands column.", "Six thousands means 6 × 1,000.", "So its value is 6,000."], "6,000"],
        ["Write 30,405 in expanded form.", ["The 3 contributes 30,000 and the 4 contributes 400.", "The 5 contributes 5; the zeroes hold the empty places.", "Combine the non-zero contributions."], "30,000 + 400 + 5"],
        ["In 7.372, how many times as valuable is the 7 in the ones place as the 7 in the hundredths place?", ["The first 7 means 7 ones, so its value is 7.", "The second 7 means 7 hundredths, so its value is 0.07.", "Divide the larger value by the smaller value: 7 ÷ 0.07 = 100.", "The matching face values mean this comparison measures only the change in place."], "The 7 in the ones place is 100 times as valuable as the 7 in the hundredths place"],
        ["A number has 5 ten-thousands, no thousands, 3 hundreds, 2 tenths and 9 hundredths. Write it.", ["Place 5 in the ten-thousands column and 0 in thousands.", "Place 3 in hundreds and use zeroes for tens and ones.", "After the decimal point, place 2 tenths and 9 hundredths."], "50,300.29"]
      ]), "Say the place name before doing arithmetic. It prevents a digit from being treated as though it always has the same value."),
      S("2. Decimals continue the same pattern", [
        "The decimal point does not create a new number system. It marks where whole units end. Tenths are ten equal parts of one, hundredths are one hundred equal parts and thousandths are one thousand equal parts.",
        "To compare decimals, align their decimal points and compare from the greatest place towards the right. Trailing zeroes may be added because 0.6 and 0.60 name the same amount.",
        "Never decide by counting digits. The first place where the numbers differ decides the order."
      ], examples(topic, 2, [
        ["Which is greater: 0.7 or 0.65?", ["Write 0.7 as 0.70 so the places align.", "Both have 6 or 7 tenths; 7 tenths is greater than 6 tenths.", "Therefore 0.70 is greater than 0.65."], "0.7"],
        ["Put 2.09, 2.9 and 2.19 in increasing order.", ["All have 2 whole units.", "Compare tenths: 0 tenths, 9 tenths and 1 tenth.", "This gives 2.09, then 2.19, then 2.9."], "2.09, 2.19, 2.9"],
        ["What number is halfway between 3.4 and 3.5?", ["Rewrite the endpoints as 3.40 and 3.50.", "The gap is 0.10, so half the gap is 0.05.", "Add 0.05 to 3.40."], "3.45"],
        ["A timer reads 12.305 seconds. What does the 5 represent?", ["The first three decimal places are tenths, hundredths and thousandths.", "The 5 occupies the thousandths place.", "It contributes five thousandths of a second."], "0.005 seconds"]
      ])),
      S("3. Negative numbers are positions below zero", [
        "On a number line, values increase as we move right. Negative numbers sit left of zero, so -2 is greater than -5 because -2 is farther right.",
        "The minus sign tells us which side of zero the number occupies. It is not an instruction to ignore the usual ordering rule.",
        "Temperature, floors below ground and changes in a score give useful meanings, but the number-line relationship is the same in every setting."
      ], examples(topic, 3, [
        ["Which is greater: -3 or -8?", ["Place both values mentally to the left of zero.", "-3 is closer to zero and lies farther right.", "The value farther right is greater."], "-3"],
        ["Order -4, 2, -1 and 0 from least to greatest.", ["Start with the point farthest left: -4.", "Then comes -1, followed by 0.", "The positive value 2 is farthest right."], "-4, -1, 0, 2"],
        ["The temperature rises from -6°C to 3°C. By how many degrees does it rise?", ["Move from -6 to 0: that is 6 degrees.", "Move from 0 to 3: that is another 3 degrees.", "Add the two parts of the journey."], "9°C"],
        ["A lift moves from floor 4 to floor -3. How many floors does it travel?", ["From 4 down to 0 is 4 floors.", "From 0 down to -3 is 3 more floors.", "The total distance is 4 + 3."], "7 floors"]
      ])),
      S("4. Rounding uses place value, not guesswork", [
        "Rounding replaces a number with a nearby landmark at a chosen place. First identify the digit that will remain, then inspect the digit immediately to its right.",
        "A next digit of 5 or more moves the retained digit up by one. A next digit below 5 leaves it unchanged. All later places become zero, or disappear after the decimal point.",
        "The rounded answer should be close to the original and have the requested place as its final meaningful digit."
      ], examples(topic, 5, [
        ["Round 6,483 to the nearest hundred.", ["The hundreds digit is 4.", "The next digit is 8, so increase 4 to 5.", "Replace tens and ones with zeroes."], "6,500"],
        ["Round 18.746 to one decimal place.", ["Keep the tenths digit, which is 7.", "The hundredths digit is 4, so the 7 stays.", "Remove the remaining decimal digits."], "18.7"],
        ["A crowd is reported as 52,000 to the nearest thousand. What is the smallest possible whole-number crowd?", ["Values rounding to 52,000 begin halfway from 51,000.", "That halfway value is 51,500.", "51,500 rounds up to 52,000."], "51,500"],
        ["A length is 3.2 m to the nearest tenth. State the interval of possible actual lengths.", ["Half a tenth is 0.05.", "Subtract and add 0.05 around 3.2.", "Include 3.15 but exclude 3.25 because 3.25 rounds to 3.3."], "3.15 m ≤ length < 3.25 m"]
      ]))
    ], ["A place changes value by a factor of ten.", "Decimal places continue the whole-number pattern.", "Greater numbers lie farther right on a number line.", "Rounding begins by naming the retained place."], ["Comparing decimals by the number of digits", "Thinking -8 is greater than -3 because 8 is greater than 3", "Looking at the wrong digit when rounding"]);
}

function numberProperties() {
  const topic = "numberProperties";
  return lesson("Number properties: factors, powers and remainders", 2, [{ module: "primary", key: "factorsMultiplesPrimes" }],
    "Number properties describe how whole numbers are built and how they behave. We will start with factors and primes, compress repeated multiplication into powers, then use division remainders to recognise repeating patterns.", [
      S("1. Factors build a number exactly", ["A factor divides a whole number with no remainder. Factors come in multiplication pairs, so searching in order avoids omissions.", "A prime number has exactly two positive factors: 1 and itself. The number 1 is not prime because it has only one factor.", "Prime factorisation breaks a number into prime building blocks. Different multiplication routes lead to the same prime factors."], examples(topic, 1, [
        ["List every factor of 24.", ["Start with 1 × 24.", "Continue with 2 × 12, 3 × 8 and 4 × 6.", "Collect both numbers from each pair."], "1, 2, 3, 4, 6, 8, 12, 24"],
        ["Is 37 prime?", ["Only test prime divisors up to √37, which is a little over 6.", "37 is not divisible by 2, 3 or 5.", "No further smaller factor is possible."], "Yes"],
        ["Write 84 as a product of prime factors.", ["84 = 2 × 42, then 42 = 2 × 21.", "21 = 3 × 7 and all four factors are prime.", "Collect repeated factors using an index."], "2² × 3 × 7"],
        ["Find the greatest common factor of 72 and 90.", ["72 = 2³ × 3² and 90 = 2 × 3² × 5.", "Take only primes shared by both, using the smaller power.", "2 × 3² = 18."], "18"]
      ])),
      S("2. Multiples, common multiples and divisibility", ["A multiple is produced by multiplying a number by an integer. Common multiples belong to two or more multiplication sequences.", "Divisibility tests are shortcuts justified by place value. For example, a number is divisible by 3 when its digit sum is divisible by 3.", "The lowest common multiple is the first positive meeting point. Prime factors provide a dependable method when lists become long."], examples(topic, 2, [
        ["Find the first three common multiples of 4 and 6.", ["Multiples of 4 begin 4, 8, 12, 16, 20, 24.", "Multiples of 6 begin 6, 12, 18, 24, 30, 36.", "The first shared values are 12, 24 and 36."], "12, 24, 36"],
        ["Is 7,452 divisible by 3 and by 9?", ["Add the digits: 7 + 4 + 5 + 2 = 18.", "18 is divisible by both 3 and 9.", "Therefore the original number is divisible by both."], "Yes, by both 3 and 9"],
        ["Find the lowest common multiple of 18 and 24.", ["18 = 2 × 3² and 24 = 2³ × 3.", "Use every required prime at its greatest power.", "2³ × 3² = 72."], "72"],
        ["Lights flash every 14 seconds and 20 seconds. They flash together now. When next together?", ["The next meeting time is the lowest common multiple of 14 and 20.", "14 = 2 × 7 and 20 = 2² × 5.", "LCM = 2² × 5 × 7 = 140."], "140 seconds"]
      ])),
      S("3. Powers are repeated multiplication", ["The power 5³ means three factors of 5, not 5 × 3. The small raised number is the index and counts repeated factors.", "When multiplying powers with the same base, the factors join, so indices add. When dividing, matching factors cancel, so indices subtract.", "Zero powers arise because a non-zero number divided by itself is 1: a³ ÷ a³ = a⁰ = 1."], examples(topic, 4, [
        ["Evaluate 3⁴.", ["Write four factors of 3.", "3 × 3 = 9 and another 3 × 3 = 9.", "9 × 9 = 81."], "81"],
        ["Simplify 2³ × 2⁵.", ["The common base is 2.", "Joining three factors and five factors gives eight factors.", "Add the indices."], "2⁸"],
        ["Simplify x⁹ ÷ x⁴.", ["Write nine factors of x above four matching factors.", "Cancel four pairs.", "Five factors remain."], "x⁵"],
        ["Explain why 7⁰ = 1.", ["Start with 7³ ÷ 7³, which equals 1.", "The index rule gives 7³⁻³.", "That is 7⁰, so 7⁰ = 1."], "Because any non-zero number divided by itself is 1"]
      ])),
      S("4. Remainders reveal cycles", ["Division can be written as dividend = divisor × quotient + remainder, where the remainder is at least zero and smaller than the divisor.", "Numbers with the same remainder belong to the same remainder class. Clock arithmetic is a familiar example: after 12, the hour cycle begins again.", "Powers and repeated operations often produce repeating remainder patterns. Find one full cycle before jumping to a distant term."], examples(topic, 3, [
        ["Write 53 in the form 7q + r.", ["Seven groups fit into 53 seven times because 7 × 7 = 49.", "The amount left is 53 - 49 = 4.", "The remainder 4 is smaller than 7."], "53 = 7 × 7 + 4"],
        ["What is the remainder when 148 is divided by 5?", ["The nearest lower multiple of 5 is 145.", "148 - 145 = 3.", "So 148 belongs to remainder class 3 modulo 5."], "3"],
        ["What hour is it 50 hours after 9 o'clock on a 12-hour clock?", ["One full cycle is 12 hours.", "50 leaves remainder 2 when divided by 12.", "Move 2 hours forward from 9."], "11 o'clock"],
        ["Find the final digit of 3²⁰.", ["Final digits of powers of 3 cycle 3, 9, 7, 1 every four powers.", "20 is divisible by 4, so use the fourth position in the cycle.", "The fourth final digit is 1."], "1"]
      ]))
    ], ["Factors divide exactly; multiples are generated by multiplication.", "Prime factorisation exposes number structure.", "Indices count repeated factors.", "Remainders turn repeated behaviour into cycles."], ["Calling 1 prime", "Multiplying a base by its index", "Allowing a remainder as large as the divisor"]);
}

function coordGeom() {
  const topic = "coordGeom";
  return lesson("Coordinates in four quadrants", 5, [{ module: "primary", key: "shapeProperties" }],
    "Coordinates give every point an exact address. We will learn to read that address, describe movement, calculate midpoints and use coordinate differences to reason about length and shape.", [
      S("1. Coordinates are ordered addresses", ["A coordinate is written (x, y): move horizontally to x first, then vertically to y. The order is part of the meaning.", "The axes split the plane into four quadrants. Signs tell the direction from the origin: negative x is left and negative y is down.", "A point on an axis is not in a quadrant because one coordinate is zero."], examples(topic, 1, [
        ["State the coordinates of a point 4 right and 3 up from the origin.", ["The horizontal movement gives x = 4.", "The vertical movement gives y = 3.", "Write x first, then y."], "(4, 3)"],
        ["In which quadrant is (-5, 2)?", ["Negative x places the point left of the vertical axis.", "Positive y places it above the horizontal axis.", "Left and above is quadrant II."], "Quadrant II"],
        ["Describe the position of (0, -7).", ["The x-coordinate is zero, so the point lies on the y-axis.", "The negative y-coordinate puts it below the origin.", "Points on an axis are not assigned to a quadrant."], "On the negative y-axis"],
        ["A point has x < 0 and y < 0. Where is it?", ["x < 0 means left of the y-axis.", "y < 0 means below the x-axis.", "Left and below is quadrant III."], "Quadrant III"]
      ])),
      S("2. Differences describe movement", ["To move between points, subtract matching coordinates. The horizontal change is the change in x; the vertical change is the change in y.", "The signs describe direction. A negative horizontal change means left and a positive vertical change means up.", "Horizontal and vertical distances use the size of the change, so distance itself is not negative."], examples(topic, 2, [
        ["Move from (2, 1) to (7, 4). Describe the translation.", ["Horizontal change: 7 - 2 = 5.", "Vertical change: 4 - 1 = 3.", "So move 5 right and 3 up."], "Vector (5, 3)"],
        ["Translate (-1, 5) by the vector (4, -2).", ["Add 4 to the x-coordinate: -1 + 4 = 3.", "Add -2 to the y-coordinate: 5 - 2 = 3.", "Keep the coordinate order."], "(3, 3)"],
        ["What is the horizontal distance between (-6, 2) and (3, 2)?", ["The y-coordinates match, so the segment is horizontal.", "Find the x-change: 3 - (-6) = 9.", "Distance is the positive size of that change."], "9 units"],
        ["Point B is obtained from A by (-7, 6). If B = (2, 1), find A.", ["The vector means B = A + (-7, 6).", "Reverse it by adding (7, -6) to B.", "(2 + 7, 1 - 6) = (9, -5)."], "(9, -5)"]
      ])),
      S("3. A midpoint averages matching coordinates", ["The midpoint is halfway in both directions at once. Average the two x-coordinates, then average the two y-coordinates.", "A midpoint may have halves even when both endpoints use whole numbers. That is a valid exact position.", "Check by comparing the vector from the first endpoint to the midpoint with the vector from the midpoint to the second."], examples(topic, 3, [
        ["Find the midpoint of (2, 4) and (8, 10).", ["Average x: (2 + 8) ÷ 2 = 5.", "Average y: (4 + 10) ÷ 2 = 7.", "Combine the two averages."], "(5, 7)"],
        ["Find the midpoint of (-6, 3) and (4, 9).", ["Average x: (-6 + 4) ÷ 2 = -1.", "Average y: (3 + 9) ÷ 2 = 6.", "The midpoint is (-1, 6)."], "(-1, 6)"],
        ["The midpoint of A and (9, 5) is (4, 1). Find A.", ["The endpoint x-values total twice the midpoint x: 8.", "So A's x-coordinate is 8 - 9 = -1.", "For y, the total is 2, so A's y-coordinate is 2 - 5 = -3."], "(-1, -3)"],
        ["Explain how to check that (2, -1) is the midpoint of (-3, 4) and (7, -6).", ["From (-3, 4) to (2, -1) the change is (5, -5).", "From (2, -1) to (7, -6) the change is also (5, -5).", "Equal matching vectors prove the two halves are equal."], "Both half-segments have vector (5, -5)"]
      ])),
      S("4. Coordinates reveal lengths and shapes", ["A horizontal segment's length is the absolute difference between x-coordinates; a vertical segment uses y-coordinates.", "For a sloping segment, the horizontal and vertical changes form the legs of a right-angled triangle. Pythagoras then gives the direct length.", "To identify a shape, check several properties: side lengths, parallel directions, right angles and diagonals. Appearance alone is not proof."], examples(topic, 4, [
        ["Find the length from (1, -2) to (1, 6).", ["The x-coordinate is unchanged, so the segment is vertical.", "The y-change is 6 - (-2) = 8.", "The length is 8 units."], "8 units"],
        ["Find the distance from (0, 0) to (3, 4).", ["The horizontal and vertical changes are 3 and 4.", "Use Pythagoras: distance² = 3² + 4² = 25.", "The positive square root is 5."], "5 units"],
        ["A rectangle has vertices (1, 2), (7, 2), (7, 5), (1, 5). Find its area.", ["Horizontal side length is 7 - 1 = 6.", "Vertical side length is 5 - 2 = 3.", "Area = 6 × 3."], "18 square units"],
        ["Do A(-2, 0), B(1, 4), C(5, 1) form a right angle at B?", ["Vector BA is (-3, -4), with squared length 25.", "Vector BC is (4, -3), also with squared length 25; AC has change (7, 1), squared length 50.", "25 + 25 = 50, so the converse of Pythagoras proves a right angle at B."], "Yes"]
      ]))
    ], ["Coordinates are ordered x then y.", "Subtract matching coordinates to describe movement.", "Average matching coordinates for a midpoint.", "Coordinate differences turn geometry into exact arithmetic."], ["Swapping x and y", "Losing a negative sign during subtraction", "Judging a shape by appearance instead of properties"]);
}

function transformations() {
  const topic = "transformations";
  return lesson("Transformations and symmetry", 9, ["coordGeom", { module: "primary", key: "symmetryReflection" }],
    "A transformation moves or changes a shape according to an exact rule. We will describe translations, reflections, rotations and enlargements precisely, then combine them while watching the order.", [
      S("1. Translation moves every point by one vector", ["A translation slides a shape without turning, flipping or resizing it. Every point moves by the same horizontal and vertical amounts.", "The vector records horizontal movement first and vertical movement second. Add it to every coordinate.", "Subtract an original coordinate from its image to recover the vector."], examples(topic, 1, [
        ["Translate (2, 5) by (3, -1).", ["Add 3 to x: 2 + 3 = 5.", "Add -1 to y: 5 - 1 = 4.", "The image is (5, 4)."], "(5, 4)"],
        ["A maps from (-4, 2) to (1, 8). Find the vector.", ["Horizontal change is 1 - (-4) = 5.", "Vertical change is 8 - 2 = 6.", "Write horizontal then vertical."], "(5, 6)"],
        ["Translate triangle vertices (0, 1), (2, 1), (1, 4) by (-3, 2).", ["Add (-3, 2) to each vertex.", "The three images are (-3, 3), (-1, 3) and (-2, 6).", "Matching side vectors are unchanged, so the size and orientation stay the same."], "(-3, 3), (-1, 3), (-2, 6)"],
        ["Two translations use vectors (4, -3) then (-7, 5). Find the single equivalent vector.", ["Horizontal movements combine: 4 + (-7) = -3.", "Vertical movements combine: -3 + 5 = 2.", "Every point therefore moves by (-3, 2)."], "(-3, 2)"]
      ])),
      S("2. Reflection needs a mirror line", ["A reflection flips a shape across a line. Each point and its image are the same perpendicular distance from the mirror line.", "For reflections in the coordinate axes, one coordinate changes sign and the other stays fixed. Other mirror lines require thinking about perpendicular distance.", "A point on the mirror line stays where it is."], examples(topic, 2, [
        ["Reflect (3, -2) in the x-axis.", ["Reflection in the x-axis keeps x unchanged.", "The y-coordinate changes sign from -2 to 2.", "The image is (3, 2)."], "(3, 2)"],
        ["Reflect (-5, 1) in the y-axis.", ["Reflection in the y-axis keeps y unchanged.", "The x-coordinate changes sign from -5 to 5.", "The image is (5, 1)."], "(5, 1)"],
        ["Reflect (2, 7) in the line y = x.", ["The line y = x swaps horizontal and vertical roles.", "Swap the coordinate values.", "The image is (7, 2)."], "(7, 2)"],
        ["A point and its image are (-4, 3) and (6, 3). Find the vertical mirror line.", ["The mirror line passes through their midpoint.", "Average the x-values: (-4 + 6) ÷ 2 = 1.", "A vertical line through that midpoint is x = 1."], "x = 1"]
      ])),
      S("3. Rotation needs a centre, angle and direction", ["A rotation turns every point through the same angle about one fixed centre. Distance from the centre is preserved.", "A complete description names the centre, angle and clockwise or anticlockwise direction. For 180°, the direction makes no difference.", "Around the origin, quarter-turn coordinate rules can be understood by following the axes rather than memorised blindly."], examples(topic, 3, [
        ["Rotate (4, 1) 90° anticlockwise about the origin.", ["The positive x direction turns into the positive y direction.", "The rule is (x, y) → (-y, x).", "So (4, 1) maps to (-1, 4)."], "(-1, 4)"],
        ["Rotate (-2, 5) 180° about the origin.", ["A half-turn moves to the opposite side of the origin.", "Both coordinate signs change.", "The image is (2, -5)."], "(2, -5)"],
        ["Point A is two right and one up from centre C. Where is its image after a 90° clockwise turn?", ["The relative vector is (2, 1).", "A clockwise quarter-turn maps (x, y) to (y, -x).", "The image is one right and two down from C."], "Relative vector (1, -2)"],
        ["A point maps from (1, 4) to (5, 2) under a 180° rotation. Find the centre.", ["The centre of a half-turn is the midpoint of a point and its image.", "Average x: 3; average y: 3.", "So the centre is (3, 3)."], "(3, 3)"]
      ])),
      S("4. Enlargement and combined transformations", ["An enlargement multiplies every distance from a centre by a scale factor. A factor above 1 enlarges, between 0 and 1 reduces and a negative factor places the image on the opposite ray.", "Length scales by the scale factor, area by its square and volume by its cube. These different effects must not be mixed.", "When transformations are combined, complete them in the written order. Reflection then translation can differ from translation then reflection."], examples(topic, 5, [
        ["Enlarge (2, 3) by scale factor 2 about the origin.", ["The position vector from the origin is (2, 3).", "Multiply both components by 2.", "The image is (4, 6)."], "(4, 6)"],
        ["A side of 7 cm is enlarged by scale factor 1.5. Find the image length.", ["Lengths multiply directly by the scale factor.", "7 × 1.5 = 10.5.", "Keep the unit centimetres."], "10.5 cm"],
        ["A shape's lengths double. By what factor does its area change?", ["Area contains two independent length directions.", "Each direction gains factor 2.", "Area factor = 2² = 4."], "4"],
        ["Start at (3, 1), reflect in the y-axis, then translate by (2, 4).", ["Reflection first gives (-3, 1).", "Now add the translation vector: (-3 + 2, 1 + 4).", "The final point is (-1, 5)."], "(-1, 5)"]
      ]))
    ], ["Translations preserve orientation.", "Reflections need a mirror line.", "Rotations need a centre, angle and direction.", "Enlargements scale lengths, areas and volumes differently."], ["Giving an incomplete transformation description", "Changing the wrong sign in a reflection", "Applying combined transformations in reverse order"]);
}

function statisticsMeasures() {
  const topic = "statisticsMeasures";
  return lesson("Statistical representations and measures", 15, [{ module: "primary", key: "statistics" }],
    "Statistics turns a collection of values into a careful description. We will organise raw data, choose suitable averages, measure spread and read graphs without claiming more than the evidence supports.", [
      S("1. Organise data before summarising it", ["Raw data is hard to inspect. Ordering reveals position, while a frequency table reveals repetition.", "Frequency means how often a value occurs. The total frequency must equal the number of observations.", "Plots and tables are representations of the same data, so totals and labels should agree across them."], examples(topic, 1, [
        ["Order 7, 3, 7, 5, 2.", ["Find the smallest value, then the next.", "Keep both copies of 7 because both observations matter.", "Check that all five values appear."], "2, 3, 5, 7, 7"],
        ["For 1, 2, 2, 2, 4, 4, give the frequency of each value.", ["Count each distinct value.", "1 occurs once, 2 occurs three times and 4 occurs twice.", "The frequencies total 1 + 3 + 2 = 6."], "1: 1, 2: 3, 4: 2"],
        ["A frequency table has frequencies 4, 7, 3 and 6. How many observations?", ["Frequency counts observations in each group.", "Add all group counts: 4 + 7 + 3 + 6.", "The sum is 20."], "20"],
        ["Why can a bar chart have gaps while a histogram normally does not?", ["Bar-chart categories are separate labels.", "Histogram bars represent touching numerical intervals.", "The visual spacing reflects that distinction."], "Bar charts show separate categories; histograms show continuous intervals"]
      ])),
      S("2. Mean, median and mode answer different questions", ["The mean shares the total equally. The median finds the central position after ordering. The mode identifies the most frequent value.", "No measure is automatically best. Skewed data or an outlier can pull the mean, while the median is less sensitive to extreme size.", "Always calculate the requested measure, then explain what it represents in the setting."], examples(topic, 2, [
        ["Find the mean of 4, 6 and 11.", ["Add the values: 4 + 6 + 11 = 21.", "There are 3 values.", "Share the total equally: 21 ÷ 3 = 7."], "7"],
        ["Find the median of 9, 2, 5, 12, 6.", ["Order the values: 2, 5, 6, 9, 12.", "There are five values, so the third is central.", "The median is 6."], "6"],
        ["The mean of five numbers is 8. Four numbers total 29. Find the fifth.", ["A mean of 8 across five values requires total 5 × 8 = 40.", "The known values contribute 29.", "The missing value is 40 - 29 = 11."], "11"],
        ["House prices are 180, 190, 195, 205 and 900 thousand pounds. Which is the more representative centre: mean or median?", ["The value 900 is far from the other four and will pull the mean upward.", "The ordered middle value is 195.", "The median better represents a typical value in this skewed set."], "Median, £195,000"]
      ])),
      S("3. Spread describes consistency", ["A centre alone can hide how scattered the data is. The range is maximum minus minimum; the interquartile range measures the spread of the middle half.", "A smaller spread often means greater consistency, but context decides whether consistency is desirable.", "When comparing groups, pair a centre with a spread and write a sentence that explicitly compares both."], examples(topic, 3, [
        ["Find the range of 13, 9, 18, 12 and 15.", ["The maximum is 18 and the minimum is 9.", "Range = maximum - minimum.", "18 - 9 = 9."], "9"],
        ["Team A has median 12 and range 4; Team B has median 15 and range 11. Compare them.", ["Team B's median is 3 higher, so its typical result is higher.", "Team A's range is 7 smaller, so its results are more consistent by this measure.", "State both conclusions because neither statistic tells the whole story."], "B has the higher median; A has the smaller spread"],
        ["A data set has lower quartile 8 and upper quartile 19. Find its interquartile range.", ["The IQR measures the middle half.", "Subtract lower quartile from upper quartile.", "19 - 8 = 11."], "11"],
        ["Adding one extreme high value changes which more: the mean or median?", ["The extreme value contributes its full size to the total used by the mean.", "The median depends mainly on the central position.", "Therefore the mean is usually changed more."], "The mean"]
      ])),
      S("4. Read graphs critically", ["A graph must be read through its axes, units and scale before its shape. A truncated axis can make a small difference look dramatic.", "Correlation describes an association, not proof that one variable causes the other. A third factor may influence both.", "Sampling method controls how far a conclusion may be generalised. A precise graph cannot rescue biased data."], examples(topic, 4, [
        ["A vertical axis starts at 95 rather than 0. What should you watch for?", ["The displayed bars omit most of the distance from zero.", "Small numerical differences may look very large.", "Read the scale and compare actual values, not only heights."], "The graph may exaggerate differences"],
        ["A scatter graph rises from left to right. What can be concluded?", ["Larger x-values tend to occur with larger y-values.", "This is positive correlation.", "It does not by itself prove that x causes y."], "There is positive correlation, not necessarily causation"],
        ["A survey about school lunches asks only pupils waiting at the pizza counter. Identify the problem.", ["The sample is selected from pupils already choosing one option.", "Other preferences have little or no chance to appear.", "The sampling method is biased."], "Biased sample"],
        ["A graph claims a medicine works because recovery and taking it are correlated. Give one reason this is insufficient.", ["Correlation can arise from another variable or from how groups were selected.", "A fair comparison needs controlled conditions and suitable samples.", "The graph alone does not establish cause."], "Correlation does not prove causation"]
      ]))
    ], ["Organise before calculating.", "Choose a centre that suits the distribution.", "Pair centre with spread.", "Read axes and sampling methods before trusting a graph."], ["Finding a median without ordering", "Dividing by the number of table rows instead of total frequency", "Claiming causation from correlation"]);
}

function similarityPythagoras() {
  const topic = "similarityPythagoras";
  return lesson("Similarity and Pythagoras", 20, ["polygons", "transformations"],
    "Similarity preserves shape while changing size. Pythagoras links the three sides of a right-angled triangle. We will develop each idea separately, then use them together in scale drawings, coordinates and indirect lengths.", [
      S("1. Similar shapes have equal angles and proportional sides", ["Congruent shapes match in size and shape. Similar shapes need only match in shape: corresponding angles are equal and corresponding lengths share one scale factor.", "Corresponding sides occupy matching roles. Mark them before calculating so that the ratios are compared in the same order.", "One mismatched ratio is enough to show that shapes are not similar."], examples(topic, 2, [
        ["A 3 cm side corresponds to a 12 cm side. Find the scale factor.", ["Compare image length with original length.", "12 ÷ 3 = 4.", "Every corresponding image length is four times the original."], "4"],
        ["A triangle with sides 5, 7, 9 is enlarged by factor 3. Find the new sides.", ["Multiply every length by the same factor.", "5 × 3 = 15, 7 × 3 = 21 and 9 × 3 = 27.", "The common factor preserves the shape."], "15, 21, 27"],
        ["Sides 6 and 10 correspond. If a side of 15 is on the larger shape, find its smaller partner.", ["The large-to-small factor is 10 ÷ 6 = 5/3.", "Reverse the enlargement by dividing 15 by 5/3.", "15 × 3/5 = 9."], "9"],
        ["Are triangles with sides 4, 6, 8 and 6, 9, 12 similar?", ["Compare matching ratios: 6/4 = 1.5.", "9/6 = 1.5 and 12/8 = 1.5.", "All three ratios match."], "Yes, scale factor 1.5"]
      ])),
      S("2. Area and volume use squared and cubed scale factors", ["If lengths scale by k, every area contains two scaled directions, so area scales by k². Volume contains three, so it scales by k³.", "To work backwards from an area factor, take a square root. To work backwards from a volume factor, take a cube root.", "State whether a given factor refers to length, area or volume before using it."], examples(topic, 3, [
        ["Lengths double. What happens to area?", ["The length scale factor is 2.", "Area factor = 2².", "So area becomes four times as large."], "Factor 4"],
        ["Similar shapes have length factor 3. An area is 8 cm². Find the corresponding area.", ["Area factor = 3² = 9.", "Multiply the original area by 9.", "8 × 9 = 72 cm²."], "72 cm²"],
        ["Similar solids have volume factor 125. Find the length factor.", ["Volume factor is the cube of the length factor.", "Take the cube root of 125.", "5³ = 125, so the length factor is 5."], "5"],
        ["A model uses scale 1:50. A square floor has model area 24 cm². Find real area in m².", ["The length factor is 50, so area factor is 2,500.", "Real area = 24 × 2,500 = 60,000 cm².", "Convert using 10,000 cm² = 1 m²."], "6 m²"]
      ])),
      S("3. Pythagoras belongs only to right-angled triangles", ["For a right-angled triangle, a² + b² = c², where c is the hypotenuse opposite the right angle. The labels a and b may swap, but c may not.", "To find the hypotenuse, add the two smaller squares. To find a shorter side, subtract its known partner's square from the hypotenuse square.", "Square the calculated length to check that the three terms satisfy the original equation."], examples(topic, 1, [
        ["Find the hypotenuse when the shorter sides are 3 cm and 4 cm.", ["c² = 3² + 4².", "c² = 9 + 16 = 25.", "The positive square root gives c = 5."], "5 cm"],
        ["A right triangle has hypotenuse 13 and one side 5. Find the other side.", ["Let the missing side be b.", "b² = 13² - 5² = 169 - 25 = 144.", "b = √144 = 12."], "12"],
        ["Does a triangle with sides 7, 24 and 25 have a right angle?", ["The longest side is 25, so test it as the hypotenuse.", "7² + 24² = 49 + 576 = 625.", "25² = 625, so the equality proves a right angle."], "Yes"],
        ["Find the diagonal of a rectangle 8 cm by 15 cm.", ["The diagonal and two sides form a right triangle.", "d² = 8² + 15² = 64 + 225 = 289.", "d = √289 = 17."], "17 cm"]
      ])),
      S("4. Similarity and Pythagoras solve indirect problems", ["A diagram may hide the required length inside a rectangle, coordinate grid or pair of similar triangles. Begin by marking right angles and matching sides.", "Use similarity when a common scale connects lengths. Use Pythagoras when three sides belong to one right triangle. Some problems need both in that order.", "Keep exact square roots until the end when no neat integer length appears, then round only as requested."], examples(topic, 5, [
        ["A 1.5 m person casts a 2 m shadow. A tree's shadow is 10 m. Find its height.", ["The sun creates similar right triangles.", "The shadow scale factor is 10 ÷ 2 = 5.", "Tree height = 1.5 × 5 = 7.5 m."], "7.5 m"],
        ["Find the distance between (-1, 2) and (5, 10).", ["Horizontal change is 6 and vertical change is 8.", "Distance² = 6² + 8² = 100.", "Distance = 10."], "10 units"],
        ["A similar triangle is enlarged by factor 2. Its corresponding shorter sides become 10 and 24. Find its hypotenuse.", ["The enlarged triangle is still right-angled.", "c² = 10² + 24² = 676.", "c = 26; this is also twice the original 13."], "26"],
        ["A ladder reaches 7.2 m up a wall with its foot 2.1 m away. Find its length.", ["Wall and ground form a right angle.", "Length² = 7.2² + 2.1² = 51.84 + 4.41 = 56.25.", "Length = √56.25 = 7.5 m."], "7.5 m"]
      ]))
    ], ["Similarity uses one length scale factor.", "Area and volume factors are powers of the length factor.", "Pythagoras requires a right angle.", "Mark structure before choosing a method."], ["Pairing non-corresponding sides", "Using a length factor directly on area", "Treating a shorter side as the hypotenuse"]);
}

function nonLinearRelations() {
  const topic = "nonLinearRelations";
  return lesson("Non-linear relationships", 22, ["sequences", "linearGraphs"],
    "Linear relationships change by a constant amount. Non-linear relationships do not. We will learn to spot the difference in tables, sequences, rules and graphs, then choose a representation that exposes the changing rate.", [
      S("1. Constant first differences identify linear patterns", ["In a table with equally spaced inputs, calculate consecutive output differences. A constant first difference signals a linear relationship.", "A changing first difference means the relationship is non-linear, but it does not yet tell us which kind.", "Always check that the input steps are equal before comparing output differences."], examples(topic, 4, [
        ["Is 4, 7, 10, 13 linear as a sequence?", ["Find first differences: +3, +3, +3.", "The difference is constant.", "Therefore term number and term value have a linear relationship."], "Yes"],
        ["Is 2, 4, 8, 16 linear?", ["First differences are 2, 4 and 8.", "They are not constant.", "The sequence is non-linear; it doubles instead."], "No"],
        ["For x = 0, 2, 4, y = 1, 7, 13. Is the relation linear?", ["The x-step is consistently 2.", "The y-step is consistently 6.", "Equal input steps give equal output steps, so it is linear."], "Yes"],
        ["Why can unequal x-steps make a difference test misleading?", ["A linear rule changes y in proportion to the change in x.", "A double x-step should create a double y-step, not the same y-step.", "So compare rates or first use equally spaced inputs."], "Because output differences must be judged against input differences"]
      ])),
      S("2. Quadratic patterns have constant second differences", ["A quadratic relationship contains a squared variable. Its first differences change, but for equally spaced inputs its second differences are constant.", "Square numbers grow by consecutive odd numbers. This changing growth is why their graph curves.", "Second differences identify quadratic behaviour, not the complete formula by themselves."], examples(topic, 2, [
        ["Find the next term: 1, 4, 9, 16, ...", ["These are 1², 2², 3² and 4².", "The next is 5².", "5² = 25."], "25"],
        ["Show that 3, 8, 15, 24 is quadratic.", ["First differences are 5, 7 and 9.", "Second differences are 2 and 2.", "Constant second differences show a quadratic sequence."], "Its second difference is 2"],
        ["For y = x² + 2, find y when x = -3.", ["Square the input first: (-3)² = 9.", "Then add 2.", "y = 11."], "11"],
        ["A quadratic sequence has first differences 6, 10, 14. What is the next first difference?", ["Differences between first differences are +4 and +4.", "Keep the constant second difference.", "14 + 4 = 18."], "18"]
      ])),
      S("3. Multiplicative and inverse relationships curve differently", ["In exponential growth, equal input steps multiply the output by a constant factor. In an inverse relationship, products xy remain constant.", "A constant ratio is different from a constant difference. Test the operation the story suggests rather than forcing every pattern into addition.", "Graphs help distinguish the behaviours: exponential growth steepens, while a positive inverse curve falls and approaches the axes."], examples(topic, 3, [
        ["A culture doubles each hour from 5 cells. How many after 4 hours?", ["Four hours means four doubling operations.", "Use 5 × 2⁴.", "2⁴ = 16, so the count is 80."], "80"],
        ["Is 3, 12, 48, 192 exponential?", ["Compare consecutive ratios.", "12 ÷ 3 = 4, 48 ÷ 12 = 4 and 192 ÷ 48 = 4.", "The constant multiplier 4 shows exponential growth."], "Yes, multiplier 4"],
        ["Six workers take 10 hours at a fixed total workload. How long for 12 equally efficient workers?", ["Workers and time are inversely proportional, so workers × time stays constant.", "Total worker-hours = 6 × 10 = 60.", "Time for 12 workers = 60 ÷ 12 = 5 hours."], "5 hours"],
        ["For y = 24/x, compare y at x = 3 and x = 8.", ["At x = 3, y = 24 ÷ 3 = 8.", "At x = 8, y = 24 ÷ 8 = 3.", "The products are both 24, showing the inverse relationship."], "8 and 3"]
      ])),
      S("4. Interpret non-linear graphs in context", ["A graph tells a story through its coordinates, gradient and turning points. Read the axes and units before naming the shape.", "For a curved graph, gradient changes from point to point. A steeper section represents a greater rate of change in magnitude.", "An intersection means two rules have the same output for the same input. A turning point marks a change between increasing and decreasing."], examples(topic, 5, [
        ["A distance-time graph gets steadily steeper. What happens to speed?", ["Gradient on a distance-time graph represents speed.", "A steeper gradient means more distance per unit time.", "The object's speed is increasing."], "It is speeding up"],
        ["The graph y = (x - 2)² + 1 has its lowest point where?", ["Completed-square form (x - a)² + b has turning point (a, b).", "Here a = 2 and b = 1.", "The squared part cannot be negative, so this is a minimum."], "(2, 1)"],
        ["Two curves intersect at (6, 14). Interpret the point.", ["An intersection belongs to both relationships.", "The common input is 6.", "Both outputs equal 14 at that input."], "Both rules give 14 when the input is 6"],
        ["A ball's height graph rises, turns and falls. What does the turning point represent?", ["Before the point, height is increasing.", "After it, height is decreasing.", "The change occurs at the greatest height."], "The ball's maximum height"]
      ]))
    ], ["Linear means constant rate, not merely an increasing graph.", "Quadratics have constant second differences for equal input steps.", "Exponential patterns use constant ratios.", "Interpret graph features using the axis units."], ["Testing differences when input steps are unequal", "Calling every curve quadratic", "Reading a graph shape before reading its axes"]);
}

export function applyJuniorCoherentCoreLessons(lessons) {
  lessons.placeValue = placeValue();
  lessons.numberProperties = numberProperties();
  lessons.coordGeom = coordGeom();
  lessons.transformations = transformations();
  lessons.statisticsMeasures = statisticsMeasures();
  lessons.similarityPythagoras = similarityPythagoras();
  lessons.nonLinearRelations = nonLinearRelations();
}
