import { applyEditorialRevisions, clear, simple, swc } from "./lesson-editor-runtime.js";

const revisions = {
  transformations: {
    intro: "A transformation changes a shape's position, direction or size according to an exact rule. We will describe slides, mirror images, turns and enlargements. Each description must contain enough information for another person to reproduce the image without guessing.",
    recap: [
      "A translation adds the same vector to every point.",
      "A reflection places each point and its image equally far from the mirror line along a perpendicular path.",
      "A rotation needs a centre, angle and direction.",
      "An enlargement multiplies every distance from its centre by the scale factor.",
      "Combined transformations must be performed in the written order."
    ],
    mistakes: [
      "Writing a translation vector in vertical-horizontal order instead of horizontal-vertical order.",
      "Changing both coordinate signs for every reflection, regardless of the mirror line.",
      "Rotating around the origin when a different centre was given.",
      "Multiplying area by a length scale factor rather than its square.",
      "Assuming two transformations can be swapped without changing the result."
    ],
    sections: [
      {
        h: "1. A translation slides every point in the same way",
        body: [
          "Place a tracing of a triangle on squared paper and slide it 3 squares right and 1 square down. Do not turn or flip the tracing. Every corner has made the same journey, so the triangle keeps its side lengths and still faces the same way. This slide is called a translation.",
          "A translation vector records the movement as an ordered pair. The first number is horizontal: positive means right and negative means left. The second is vertical: positive means up and negative means down. The vector (3, −1) therefore means 3 right and 1 down.",
          "To translate a coordinate, add the vector one component at a time. Translating (2, 5) by (3, −1) gives x = 2 + 3 and y = 5 − 1, so the image is (5, 4).",
          "To find an unknown vector, compare finish with start. Calculate image x minus original x, then image y minus original y. Keeping the same subtraction order in both directions matters.",
          "Several translations can be combined by adding their horizontal movements and adding their vertical movements. Opposite movements cancel, just as +4 and −7 combine to make −3."
        ],
        note: "A vector describes movement, not a destination. Add it to every original point.",
        examples: [
          simple({ q: "Translate the point (2, 5) by the vector (3, −1).", state: "The vector means 3 right and 1 down. Add its components to the matching coordinates.", steps: ["New x-coordinate: 2 + 3 = 5.", "New y-coordinate: 5 + (−1) = 4."], answer: "(5, 4)", conclusion: "The image is (5, 4)", check: "From (2, 5) to (5, 4), the change is (5 − 2, 4 − 5) = (3, −1).", structureId: "transformations_route_1_spatialTransform", difficulty: 1 }),
          swc({ q: "Point A(−4, 2) is translated to A′(1, 8). Find the translation vector.", state: "Find finish minus start in the horizontal direction and then the vertical direction.", steps: ["Horizontal change: 1 − (−4) = 1 + 4 = 5.", "Vertical change: 8 − 2 = 6.", "Write horizontal then vertical: (5, 6)."], answer: "(5, 6)", conclusion: "The translation vector is (5, 6)", check: "Add it to A: (−4 + 5, 2 + 6) = (1, 8), which is A′.", structureId: "transformations_route_1_spatialTransform", difficulty: 2 }),
          swc({ q: "Translate the triangle with vertices (0, 1), (2, 1) and (1, 4) by (−3, 2). Give all three image coordinates.", state: "Every vertex moves 3 left and 2 up. We must apply the same vector to all three points.", steps: ["(0, 1) becomes (0 − 3, 1 + 2) = (−3, 3).", "(2, 1) becomes (2 − 3, 1 + 2) = (−1, 3).", "(1, 4) becomes (1 − 3, 4 + 2) = (−2, 6)."], answer: "(−3, 3), (−1, 3) and (−2, 6)", conclusion: "The image vertices are (−3, 3), (−1, 3) and (−2, 6)", check: "Subtracting each original vertex from its image gives (−3, 2) every time, so the whole triangle made one translation.", structureId: "transformations_route_1_spatialTransform", difficulty: 3 }),
          clear({ q: "A point is translated by (4, −3) and then by (−7, 5). Find one vector with the same overall effect and use it to move P(6, −2).", state: "Combine the two movements component by component, then apply the resulting vector to P.", comprehend: "The first slide is 4 right and 3 down. The second is 7 left and 5 up. Horizontal and vertical movements can be combined separately.", link: "Add the horizontal components and add the vertical components.", explain: "Find the single vector first, then use a direct coordinate check and a two-stage check.", steps: ["Combined horizontal change: 4 + (−7) = −3.", "Combined vertical change: −3 + 5 = 2.", "The single vector is (−3, 2).", "Apply it to P: (6 − 3, −2 + 2) = (3, 0)."], answer: "Vector (−3, 2); P maps to (3, 0)", conclusion: "The equivalent vector is (−3, 2), sending P to (3, 0)", check: "Two stages give P → (10, −5) → (3, 0), matching the single translation.", review: "Both routes finish at (3, 0), so the combined vector is correct.", structureId: "transformations_route_1_spatialTransform", difficulty: 4 })
        ]
      },
      {
        h: "2. A reflection makes a mirror image",
        body: [
          "Fold a sheet of paper along a straight line after marking a point on one side. The mark presses onto a matching point on the other side. The fold is the mirror line and the movement is a reflection.",
          "The original point and its image are the same shortest distance from the mirror line. The path joining them crosses the mirror line at a right angle, and the mirror line cuts that path exactly in half.",
          "Reflecting in the x-axis changes above to below or below to above. The x-coordinate stays fixed while the y-coordinate changes sign. Reflecting in the y-axis changes left to right, so y stays fixed and x changes sign.",
          "On the diagonal line y = x, horizontal and vertical roles exchange. Therefore (2, 7) reflects to (7, 2). A point already on the line, such as (4, 4), stays in place.",
          "If a point and its image are known, their midpoint lies on the mirror line. Their joining segment also tells us which direction is perpendicular to that line."
        ],
        note: "Ask which coordinate measures distance from the mirror line. That coordinate changes; the parallel coordinate stays fixed.",
        examples: [
          simple({ q: "Reflect (3, −2) in the x-axis.", state: "The x-axis is horizontal. Keep x fixed and place the point the same vertical distance on the other side.", steps: ["The x-coordinate remains 3.", "The y-coordinate changes from −2 to 2."], answer: "(3, 2)", conclusion: "The reflected point is (3, 2)", check: "Both points are 2 units from the x-axis and lie on the same vertical line x = 3.", structureId: "transformations_route_2_shapeFold", difficulty: 1 }),
          swc({ q: "Reflect (−5, 1) in the y-axis.", state: "The y-axis is vertical. Keep y fixed and reverse the horizontal position.", steps: ["The y-coordinate remains 1.", "The x-coordinate changes sign from −5 to 5."], answer: "(5, 1)", conclusion: "The reflected point is (5, 1)", check: "The points are both 5 units from the y-axis and share y = 1.", structureId: "transformations_route_2_shapeFold", difficulty: 2 }),
          swc({ q: "Reflect (2, 7) in the line y = x.", state: "Reflection in y = x exchanges the horizontal and vertical distances, so the coordinates swap places.", steps: ["The original x-coordinate 2 becomes the image y-coordinate.", "The original y-coordinate 7 becomes the image x-coordinate.", "Therefore the image is (7, 2)."], answer: "(7, 2)", conclusion: "The reflected point is (7, 2)", check: "The midpoint is (4.5, 4.5), which lies on y = x, and reflecting again swaps back to (2, 7).", structureId: "transformations_route_2_shapeFold", difficulty: 3 }),
          clear({ q: "A point and its reflection are (−4, 3) and (6, 3). Find the mirror line.", state: "The mirror line is the perpendicular bisector of the segment joining the two points.", comprehend: "The points share y = 3, so their joining segment is horizontal. Its perpendicular bisector must be vertical.", link: "A vertical line has equation x = constant. The constant is the midpoint of the x-coordinates.", explain: "Find the midpoint, identify the perpendicular direction and write the line equation.", steps: ["Midpoint x-coordinate: (−4 + 6) ÷ 2 = 2 ÷ 2 = 1.", "Midpoint y-coordinate: (3 + 3) ÷ 2 = 3, so the midpoint is (1, 3).", "A vertical line through this midpoint has equation x = 1."], answer: "x = 1", conclusion: "The mirror line is x = 1", check: "The point −4 is 5 units left of x = 1 and 6 is 5 units right of it, with the same y-coordinate.", review: "The line x = 1 passes through the midpoint and meets the joining segment at a right angle.", structureId: "transformations_route_2_shapeFold", difficulty: 4 })
        ]
      },
      {
        h: "3. A rotation turns around one fixed centre",
        body: [
          "Push a pin through a piece of tracing paper and turn the paper around the pin. The pin does not move. Every other point travels along part of a circle centred on the pin. This transformation is a rotation.",
          "A complete rotation description needs three facts: the centre, the angle and the direction. Clockwise follows the hands of a clock. Anticlockwise turns the other way. For a half-turn of 180°, both directions reach the same place.",
          "A quarter-turn is 90°. Around the origin, imagine where the positive x-axis goes. A 90° anticlockwise turn sends rightwards to upwards, giving the rule (x, y) → (−y, x). A clockwise quarter-turn gives (x, y) → (y, −x).",
          "For a centre other than the origin, describe the point relative to that centre. Rotate the relative movement, then rebuild the actual coordinate. Do not apply an origin rule directly to an off-centre rotation.",
          "Rotation preserves distance from the centre. In a half-turn, the centre is exactly the midpoint between a point and its image."
        ],
        note: "Name the centre, angle and direction before moving any point.",
        examples: [
          simple({ q: "Rotate (4, 1) by 90° anticlockwise about the origin.", state: "A quarter-turn anticlockwise maps (x, y) to (−y, x).", steps: ["The old y-coordinate 1 becomes negative x: −1.", "The old x-coordinate 4 becomes the new y: 4."], answer: "(−1, 4)", conclusion: "The image is (−1, 4)", check: "Both points are √17 units from the origin, and the direction from mostly right has turned to mostly up.", structureId: "transformations_route_3_coordGeom", difficulty: 1 }),
          swc({ q: "Rotate (−2, 5) by 180° about the origin.", state: "A half-turn sends a point to the opposite side of the origin at the same distance, so both signs change.", steps: ["Change x from −2 to 2.", "Change y from 5 to −5."], answer: "(2, −5)", conclusion: "The image is (2, −5)", check: "The midpoint of (−2, 5) and (2, −5) is (0, 0), the stated centre.", structureId: "transformations_route_3_coordGeom", difficulty: 2 }),
          swc({ q: "Point A is 2 units right and 1 unit up from centre C. Describe A's image after a 90° clockwise turn about C.", state: "Relative to C, A has movement vector (2, 1). Rotate that movement clockwise rather than treating C as the origin of the whole grid.", steps: ["A clockwise quarter-turn maps (x, y) to (y, −x).", "Apply it to (2, 1): (1, −2).", "The image is therefore 1 unit right and 2 units down from C."], answer: "Relative vector (1, −2)", conclusion: "The image is 1 right and 2 down from C", check: "The original and image distances from C are both √(2² + 1²) = √5.", structureId: "transformations_route_3_coordGeom", difficulty: 3 }),
          clear({ q: "A 180° rotation maps (1, 4) to (5, 2). Find the centre of rotation.", state: "In a half-turn, the centre is exactly halfway between a point and its image.", comprehend: "The point, centre and image lie on one straight segment. The two halves of that segment have equal length and direction.", link: "Find the midpoint by averaging the x-coordinates and averaging the y-coordinates.", explain: "Calculate the candidate centre, then compare the vectors on its two sides.", steps: ["Centre x-coordinate: (1 + 5) ÷ 2 = 3.", "Centre y-coordinate: (4 + 2) ÷ 2 = 3.", "The centre is (3, 3)."], answer: "(3, 3)", conclusion: "The centre of rotation is (3, 3)", check: "From (1, 4) to the centre is (2, −1), and continuing by (2, −1) reaches (5, 2).", review: "The candidate is the midpoint, so a half-turn around it exchanges the two points.", structureId: "transformations_route_3_coordGeom", difficulty: 4 })
        ]
      },
      {
        h: "4. Enlargement scales distances from a centre",
        body: [
          "Draw a ray from an enlargement centre through a point. With scale factor 2, the image lies on the same ray and twice as far from the centre. Every point follows this rule, so the whole shape keeps its angles and proportions.",
          "A scale factor greater than 1 makes lengths larger. A factor between 0 and 1 makes them smaller. A negative factor places the image on the opposite ray as well as scaling the distance.",
          "About the origin, an enlargement multiplies both coordinate components. With factor 2, (2, 3) becomes (4, 6). For another centre, first measure the vector from the centre, scale that vector and then add it back to the centre.",
          "Length uses one direction, so it scales by k. Area uses two independent directions, so it scales by k². Volume uses three directions, so it scales by k³. Doubling lengths makes area four times as large, not twice.",
          "When transformations are combined, order matters. Reflection followed by translation can finish somewhere different from translation followed by reflection, so complete each stage exactly as written."
        ],
        note: "Scale distances from the stated centre, not raw coordinates unless the centre is the origin.",
        examples: [
          simple({ q: "Enlarge (2, 3) by scale factor 2 about the origin.", state: "The origin is the centre, so multiply both coordinate distances by 2.", steps: ["New x-coordinate: 2 × 2 = 4.", "New y-coordinate: 3 × 2 = 6."], answer: "(4, 6)", conclusion: "The image is (4, 6)", check: "The image lies on the same ray from the origin and is twice as far in each coordinate direction.", structureId: "transformations_route_5_cubeProps", difficulty: 1 }),
          swc({ q: "A 7 cm side is enlarged by scale factor 1.5. Find its image length.", state: "A length is multiplied directly by the scale factor.", steps: ["Write 1.5 as one and a half.", "Calculate 7 × 1.5 = 10.5.", "Keep the length unit: 10.5 cm."], answer: "10.5 cm", conclusion: "The image side is 10.5 cm long", check: "Half of 7 cm is 3.5 cm, and 7 + 3.5 = 10.5 cm.", structureId: "transformations_route_5_cubeProps", difficulty: 2 }),
          swc({ q: "Every length of a shape is doubled. By what factor does its area change?", state: "Area contains two length directions, and each direction receives scale factor 2.", steps: ["A rectangle with sides l and w has area lw.", "After doubling, its area is (2l)(2w) = 4lw.", "Therefore the area scale factor is 2² = 4."], answer: "Factor 4", conclusion: "The area becomes four times as large", check: "A 3-by-5 rectangle has area 15; doubling to 6-by-10 gives area 60, and 60 ÷ 15 = 4.", structureId: "transformations_route_5_cubeProps", difficulty: 3 }),
          clear({ q: "Start with P(3, 1). Reflect it in the y-axis, then translate the image by (2, 4). Find the final point and show why reversing the order gives a different result.", state: "We need to perform the stated order, then perform the reversed order as a comparison.", comprehend: "Reflection in the y-axis changes the x sign. Translation then adds 2 to x and 4 to y. These operations affect x differently, so their order may matter.", link: "Keep each intermediate coordinate visible rather than trying to combine the rules mentally.", explain: "Calculate both routes from the same starting point and compare their endpoints.", steps: ["Stated order: reflect (3, 1) to (−3, 1).", "Then translate: (−3 + 2, 1 + 4) = (−1, 5).", "Reversed order: translate first to (5, 5).", "Then reflect in the y-axis to get (−5, 5)."], answer: "Final point (−1, 5); reversed order gives (−5, 5)", conclusion: "The stated order ends at (−1, 5), while reversing it ends at (−5, 5)", check: "Applying each named rule again from P reproduces the two distinct endpoints, proving the order cannot be swapped.", review: "The two routes differ only in order and finish at different x-coordinates.", structureId: "transformations_route_5_cubeProps", difficulty: 4 })
        ]
      }
    ]
  },
  estimation: {
    intro: "Estimation replaces awkward numbers with nearby friendly ones so that we can judge size quickly. Rounding gives a precise agreed nearby value, while bounds describe every original value that could have produced a rounded measurement. These ideas help us detect impossible answers, plan purchases and reason safely when measurements are not exact.",
    recap: [
      "An estimate should be quick, close enough for its purpose and clearly identified as approximate.",
      "Round the original number directly to the requested place.",
      "A rounded value represents an interval from one halfway boundary up to, but not including, the next.",
      "Time uses groups of 60 minutes, not groups of 100.",
      "Rates and percentage multipliers preserve multiplicative relationships."
    ],
    mistakes: [
      "Giving an estimate when the decision is too close and needs an exact calculation.",
      "Rounding in stages and allowing one rounded value to alter the next decision.",
      "Including an upper bound that would round to the next value.",
      "Writing 30 minutes as 0.30 hours.",
      "Using the percentage change itself as the multiplier for the new total."
    ],
    sections: [
      {
        h: "1. An estimate answers a size question quickly",
        body: [
          "Suppose you have £10 and choose items costing £2.95, £4.10, £6.99 and £1.85. Before exact addition, round them to about £3, £4, £7 and £2. The estimate is £16, so £10 is certainly not enough.",
          "An estimate is deliberately approximate. We trade a small amount of accuracy for speed and clarity. The symbol ≈ means 'is approximately equal to', so £2.95 + £4.10 + £6.99 + £1.85 ≈ £16.",
          "Choose friendly numbers that match the purpose. For a quick multiplication, 4.9 × 62 can become 5 × 60. For checking whether £5 covers a total close to £5, rounding everything to whole pounds may be too rough, so an exact check is sensible.",
          "A good estimate preserves scale. Replacing 5,987 by 6,000 and 29 by 30 changes each number only slightly. Replacing 29 by 100 would make the arithmetic easy but the estimate unhelpful.",
          "Use an exact calculation when the estimate falls near a decision boundary. An estimate can warn us that a result is close without settling the final answer."
        ],
        note: "State what you rounded and why the approximation is accurate enough for the decision.",
        examples: [
          simple({ q: "You have £5. Crisps cost 85p, a drink costs £1.20 and a sandwich costs £2.90. Estimate whether £5 is enough, then check exactly.", state: "A whole-pound estimate will show whether the total is far from or close to £5. Because it is close, we will then calculate exactly.", steps: ["Estimate: 85p ≈ £1, £1.20 ≈ £1 and £2.90 ≈ £3.", "Estimated total: £1 + £1 + £3 = £5, so the decision is very close.", "Exact total: £0.85 + £1.20 + £2.90 = £4.95."], answer: "Yes, with 5p left", conclusion: "The estimate shows a close decision and the exact total confirms that £5 is enough", check: "£5.00 − £4.95 = £0.05, so 5p remains.", structureId: "estimation_route_1_estimation", difficulty: 1 }),
          simple({ q: "Round 283 to the nearest ten.", state: "The neighbouring multiples of 10 are 280 and 290.", steps: ["283 is 3 away from 280.", "It is 7 away from 290.", "Since 3 < 7, 280 is closer."], answer: "280", conclusion: "283 rounds to 280 to the nearest ten", check: "The halfway value is 285, and 283 lies below it.", structureId: "estimation_route_1_estimation", difficulty: 2 }),
          swc({ q: "Round 3,748 to the nearest hundred.", state: "The neighbouring hundreds are 3,700 and 3,800. Compare the original number directly with them.", steps: ["Distance from 3,700: 3,748 − 3,700 = 48.", "Distance from 3,800: 3,800 − 3,748 = 52.", "Since 48 < 52, 3,700 is closer."], answer: "3,700", conclusion: "3,748 rounds to 3,700 to the nearest hundred", check: "The halfway boundary is 3,750, and 3,748 lies just below it.", structureId: "estimation_route_1_estimation", difficulty: 3 }),
          clear({ q: "What is the largest whole number that rounds to 7,400 to the nearest hundred?", state: "We need the last whole number below the upper halfway boundary for numbers rounding to 7,400.", comprehend: "The neighbouring hundreds are 7,300 and 7,500. Their halfway boundaries with 7,400 are 7,350 and 7,450.", link: "Values from 7,350 round up to 7,400, but 7,450 itself rounds up to 7,500.", explain: "The largest allowed whole number is therefore one less than the excluded upper boundary.", steps: ["Find the upper boundary halfway between 7,400 and 7,500: 7,450.", "Exclude 7,450 because a halfway value rounds upwards to 7,500.", "The greatest whole number below 7,450 is 7,449."], answer: "7,449", conclusion: "The largest whole number is 7,449", check: "7,449 is 49 from 7,400 and 51 from 7,500, while 7,450 would be tied and would round upwards.", review: "The upper boundary is excluded, so 7,449 is the final whole number in the interval.", structureId: "estimation_route_1_estimation", difficulty: 4 })
        ]
      },
      {
        h: "2. Rounding chooses the nearest target and creates bounds",
        body: [
          "Rounding to the nearest hundred asks which multiple of 100 is closest. For 6,847, the targets are 6,800 and 6,900. Their midpoint is 6,850, so 6,847 rounds down to 6,800.",
          "At an exact halfway value, the usual school convention is to round upwards. Thus 6,850 rounds to 6,900. The place immediately to the right of the target place tells us which side of halfway we are on.",
          "A rounded value hides a range of possible original values. If a whole-number measurement rounds to 200 to the nearest ten, it could be any whole number from 195 through 204. This range is described by a lower bound and an upper bound.",
          "The lower bound is included because 195 rounds up to 200. The upper boundary 205 is excluded because it rounds to 210. We can write 195 ≤ x < 205, where ≤ means 'less than or equal to' and < means 'strictly less than'.",
          "Bounds use half of the rounding unit. For a measurement rounded to the nearest 0.1, add and subtract 0.05. For the nearest 100, add and subtract 50."
        ],
        note: "The lower boundary is included; the upper boundary is not included under the usual round-half-up rule.",
        examples: [
          simple({ q: "Round 6,847 to the nearest hundred.", state: "The target hundreds are 6,800 and 6,900, with midpoint 6,850.", steps: ["6,847 is below 6,850.", "Therefore it is closer to 6,800."], answer: "6,800", conclusion: "6,847 rounds to 6,800", check: "It is 47 from 6,800 and 53 from 6,900.", structureId: "estimation_route_1_estimation", difficulty: 1 }),
          swc({ q: "A whole number rounds to 320 to the nearest ten. State its smallest and largest possible values.", state: "Numbers rounding to 320 begin at the lower halfway point 315 and stop just before the upper halfway point 325.", steps: ["Lower boundary: 320 − 5 = 315, and 315 is included.", "Upper boundary: 320 + 5 = 325, but 325 rounds to 330 and is excluded.", "For whole numbers, the possible values are 315 through 324."], answer: "Smallest 315; largest 324", conclusion: "The whole number lies from 315 to 324 inclusive", check: "315 rounds up to 320, 324 rounds down to 320 and 325 would round to 330.", structureId: "estimation_route_1_estimation", difficulty: 2 }),
          swc({ q: "A length is recorded as 8.3 cm to the nearest 0.1 cm. Write the error interval.", state: "Half of 0.1 cm is 0.05 cm, so the true length lies between 8.3 − 0.05 and 8.3 + 0.05.", steps: ["Lower bound: 8.3 − 0.05 = 8.25 cm.", "Upper boundary: 8.3 + 0.05 = 8.35 cm.", "Include 8.25 but exclude 8.35: 8.25 ≤ length < 8.35."], answer: "8.25 cm ≤ length < 8.35 cm", conclusion: "The true length is at least 8.25 cm and less than 8.35 cm", check: "8.25 rounds to 8.3, while 8.35 rounds to 8.4 under the agreed convention.", structureId: "estimation_route_1_estimation", difficulty: 3 }),
          clear({ q: "A rectangular card has length 12 cm and width 7 cm, each measured to the nearest centimetre. Find the lower and upper bounds for its area.", state: "Each recorded dimension represents an interval. The smallest possible area uses both lower bounds and the greatest possible area approaches the product of both upper boundaries.", comprehend: "The true length satisfies 11.5 ≤ l < 12.5 and the width satisfies 6.5 ≤ w < 7.5.", link: "All dimensions are positive, so increasing either dimension increases the area l × w.", explain: "Multiply the two lower bounds for the minimum and the two upper boundaries for the excluded maximum.", steps: ["Lower area bound: 11.5 × 6.5 = 74.75 cm².", "Upper area boundary: 12.5 × 7.5 = 93.75 cm².", "Therefore 74.75 cm² ≤ area < 93.75 cm²."], answer: "74.75 cm² ≤ area < 93.75 cm²", conclusion: "The area is at least 74.75 cm² and less than 93.75 cm²", check: "The recorded dimensions 12 and 7 give area 84 cm², which lies inside the interval.", review: "The lower endpoints are possible, while either upper dimension would round to the next centimetre and is excluded.", structureId: "estimation_route_1_estimation", difficulty: 4 })
        ]
      },
      {
        h: "3. Round once, directly to the requested place",
        body: [
          "To round 447 to the nearest hundred, compare 447 directly with 400 and 500. It is 47 from 400 and 53 from 500, so the answer is 400.",
          "Rounding in stages gives the wrong answer: 447 becomes 450 to the nearest ten, then 450 becomes 500 to the nearest hundred. The first rounding moved the number across the true halfway boundary even though the original 447 never crossed it.",
          "Always use the original value and the requested place. Intermediate rounding loses information and can push an answer repeatedly in one direction.",
          "For estimation, rounding several inputs is allowed because the purpose is an approximate calculation. That is different from being asked to round one number exactly to a named place.",
          "When estimating a practical quantity, keep units consistent and ask whether the answer must be rounded up. If 23.2 bags are required and bags are sold whole, 24 bags are needed."
        ],
        note: "Exact rounding uses one direct comparison. Estimation may replace several values deliberately.",
        examples: [
          simple({ q: "Estimate 5,987 ÷ 29 using one significant figure for each number.", state: "Replace both values with nearby one-significant-figure numbers that divide easily.", steps: ["5,987 rounds to 6,000.", "29 rounds to 30.", "Estimate 6,000 ÷ 30 = 200."], answer: "About 200", conclusion: "5,987 ÷ 29 is approximately 200", check: "The exact quotient is about 206, so 200 has the right scale and is close.", structureId: "estimation_route_1_estimation", difficulty: 1 }),
          swc({ q: "Roughly how many 330 ml cans contain the same amount as a 2 litre bottle?", state: "Convert the bottle to millilitres, then divide by the amount in one can.", steps: ["Convert 2 litres to 2,000 ml.", "Estimate 2,000 ÷ 330. Since 330 is close to one third of 1,000, about 3 cans make 1 litre.", "Therefore about 6 cans make 2 litres."], answer: "About 6 cans", conclusion: "About six 330 ml cans contain 2 litres", check: "Six cans contain 6 × 330 = 1,980 ml, only 20 ml short of 2,000 ml.", structureId: "estimation_route_1_estimation", difficulty: 2 }),
          swc({ q: "A 9 litre bucket is filled by a hose delivering about 12 litres per minute. Roughly how many seconds will it take?", state: "Find what fraction of a minute is needed, then convert that time to seconds.", steps: ["Time in minutes: 9 ÷ 12 = 3/4 minute.", "One minute is 60 seconds.", "Three quarters of 60 seconds is 60 × 3/4 = 45 seconds."], answer: "About 45 seconds", conclusion: "The bucket takes about 45 seconds to fill", check: "At 12 litres in 60 seconds, the hose delivers 0.2 litres per second. In 45 seconds it delivers 9 litres.", structureId: "estimation_route_1_estimation", difficulty: 3 }),
          clear({ q: "A garden bed is 6 m by 4 m and needs soil 10 cm deep. One bag covers 2 m² at a depth of 5 cm. Estimate how many whole bags are needed.", state: "The bed has a fixed area, but doubling the required depth halves the area that one bag can cover.", comprehend: "One bag covers 2 m² only at 5 cm depth. At 10 cm, the same soil is spread twice as thick, so it covers half as much area.", link: "Find bed area, adjust each bag's coverage for depth, then divide and round up if necessary.", explain: "Track square metres and depth separately before combining them.", steps: ["Bed area: 6 × 4 = 24 m².", "The depth doubles from 5 cm to 10 cm, so one bag's coverage halves from 2 m² to 1 m².", "Bags required: 24 m² ÷ 1 m² per bag = 24 bags."], answer: "About 24 bags", conclusion: "The garden bed needs about 24 bags", check: "Twenty-four bags each providing enough soil for 1 m² at 10 cm depth cover all 24 m².", review: "The depth adjustment and area calculation both use the same total volume of soil.", structureId: "estimation_route_1_estimation", difficulty: 4 })
        ]
      },
      {
        h: "4. Calculation order keeps an expression unambiguous",
        body: [
          "The expression 2 + 3 × 4 can become 20 if addition is done first or 14 if multiplication is done first. Mathematics needs one shared reading, so we use an agreed order of operations.",
          "Brackets come first, then powers. Multiplication and division follow. Addition and subtraction come last. BIDMAS is a memory aid for this order.",
          "Multiplication and division share priority and are completed from left to right. Addition and subtraction also share priority and work from left to right.",
          "Rewrite one line at a time, changing only the part that is ready. This preserves the untouched values and makes the calculation easy to inspect.",
          "An estimate can check the scale of the final result, but it does not replace the agreed order in an exact expression."
        ],
        note: "Division does not automatically come before multiplication. Equal-priority operations go left to right.",
        examples: [
          simple({ q: "Work out 5 + 2 × 6.", state: "Complete the multiplication before the addition.", steps: ["Calculate 2 × 6 = 12.", "Then calculate 5 + 12 = 17."], answer: "17", conclusion: "5 + 2 × 6 = 17", check: "The high-priority part is 12, so the expression becomes 5 + 12.", structureId: "estimation_route_2_multiExpr", difficulty: 1 }),
          swc({ q: "Work out 30 ÷ 5 × 3.", state: "Division and multiplication share priority, so move from left to right.", steps: ["First: 30 ÷ 5 = 6.", "Second: 6 × 3 = 18."], answer: "18", conclusion: "30 ÷ 5 × 3 = 18", check: "Reversing the operations from 18 gives 18 ÷ 3 × 5 = 30.", structureId: "estimation_route_2_multiExpr", difficulty: 2 }),
          swc({ q: "Work out 48 ÷ 8 ÷ 2 and explain why 12 is not the answer.", state: "The two divisions have equal priority and no brackets change their left-to-right order.", steps: ["Calculate 48 ÷ 8 = 6.", "Then calculate 6 ÷ 2 = 3.", "The value 12 comes from 48 ÷ (8 ÷ 2), but those brackets were not given."], answer: "3", conclusion: "The expression equals 3, not 12", check: "Multiplying back in reverse gives 3 × 2 × 8 = 48.", structureId: "estimation_route_2_multiExpr", difficulty: 3 }),
          clear({ q: "Evaluate 36 ÷ 4 × 3 − 18 ÷ 6 × 2.", state: "Complete both multiplication-division chains from left to right, then subtract their results.", comprehend: "There are no brackets or powers. The subtraction has lower priority than every multiplication and division shown.", link: "Treat the part on each side of the subtraction as a separate high-priority chain.", explain: "Evaluate each chain in order and rewrite the final subtraction.", steps: ["Left chain: 36 ÷ 4 = 9, then 9 × 3 = 27.", "Right chain: 18 ÷ 6 = 3, then 3 × 2 = 6.", "Subtract: 27 − 6 = 21."], answer: "21", conclusion: "The expression has value 21", check: "Independent evaluation gives left value 27 and right value 6, whose difference is 21.", review: "All equal-priority operations were handled left to right before subtraction.", structureId: "estimation_route_2_multiExpr", difficulty: 4 })
        ]
      },
      {
        h: "5. Clock time is grouped in sixties",
        body: [
          "Ordinary place value groups in tens, but clock time groups 60 minutes into 1 hour. Therefore 1 hour 70 minutes must be regrouped as 2 hours 10 minutes.",
          "When adding a duration, keep hours and minutes in separate columns. Add the minutes, exchange every group of 60 minutes for an hour and then combine the hours.",
          "For 24-hour time, the hours continue from 00 through 23. Thus 3:25 pm is 15:25. Passing 24:00 begins the next day at 00:00.",
          "When finding a duration between two times, count to a convenient hour and then onwards. This can be clearer than formal subtraction when borrowing across 60 minutes.",
          "Check by adding the calculated duration back to the start time."
        ],
        note: "Exchange 60 minutes for 1 hour, not 100 minutes.",
        examples: [
          simple({ q: "What time is 25 minutes after 3:45?", state: "Adding 25 minutes passes through the next whole hour.", steps: ["From 3:45 to 4:00 is 15 minutes.", "There are 25 − 15 = 10 minutes left.", "Ten minutes after 4:00 is 4:10."], answer: "4:10", conclusion: "The time is 4:10", check: "From 3:45 to 4:10 is 15 + 10 = 25 minutes.", structureId: "estimation_route_3_clockArith", difficulty: 1 }),
          swc({ q: "What time is 2 hours 50 minutes after 4:30?", state: "Add the hours and minutes, regrouping any total of at least 60 minutes.", steps: ["Add 50 minutes: 4:30 becomes 5:20 because 30 + 50 = 80 minutes = 1 hour 20 minutes.", "Add the remaining 2 hours: 5:20 becomes 7:20."], answer: "7:20", conclusion: "The time is 7:20", check: "From 4:30 to 5:20 is 50 minutes, then to 7:20 is 2 hours more.", structureId: "estimation_route_3_clockArith", difficulty: 2 }),
          swc({ q: "A bus leaves at 11:45 and travels for 3 hours 40 minutes. Give its arrival time in 24-hour notation.", state: "Add the 40 minutes first, then the 3 hours, keeping the final answer in 24-hour time.", steps: ["11:45 + 40 minutes = 12:25.", "12:25 + 3 hours = 15:25."], answer: "15:25", conclusion: "The bus arrives at 15:25", check: "Counting back 3 hours gives 12:25, then back 40 minutes gives 11:45.", structureId: "estimation_route_3_clockArith", difficulty: 3 }),
          clear({ q: "A night train leaves at 22:35 and arrives at 01:20 the next day. How long is the journey?", state: "The journey crosses midnight, so split the duration at 24:00.", comprehend: "From 22:35 to midnight is one part. From midnight to 01:20 is the second part.", link: "Add the two durations after finding them separately.", explain: "Count to 23:00, then midnight, then the arrival time to avoid borrowing across days.", steps: ["From 22:35 to 23:00 is 25 minutes.", "From 23:00 to 24:00 is 1 hour, so the pre-midnight time is 1 hour 25 minutes.", "From 00:00 to 01:20 is 1 hour 20 minutes.", "Total duration: 1 h 25 min + 1 h 20 min = 2 h 45 min."], answer: "2 hours 45 minutes", conclusion: "The journey lasts 2 hours 45 minutes", check: "Adding 2 hours 45 minutes to 22:35 gives 25:20, which is 01:20 on the next day.", review: "The two parts meet at midnight and total 2 hours 45 minutes.", structureId: "estimation_route_3_clockArith", difficulty: 4 })
        ]
      },
      {
        h: "6. A rate tells us an amount for each unit",
        body: [
          "A rate compares different kinds of quantity. Twelve pages per minute means 12 pages for each minute. Seventy-five pence per kilogram means each kilogram costs 75p.",
          "A unit rate is the amount for exactly one unit. If 3 pens cost £1.50, one pen costs £1.50 ÷ 3 = £0.50. We can then multiply by any required number of pens.",
          "Convert units before using a rate. A quarter hour is 15 minutes. Two litres is 2,000 millilitres. The number and its unit belong together.",
          "Proportional rates can also be scaled directly. If the quantity is multiplied by 5/3, its cost is multiplied by 5/3. A unit-rate method and a scale-factor method should agree.",
          "Check by dividing the final amount by the final number of units. The original rate should be recovered."
        ],
        note: "Find one unit first when the scale factor is not obvious.",
        examples: [
          simple({ q: "A printer produces 12 pages per minute. How many pages does it produce in a quarter of an hour?", state: "The rate is per minute, so convert the quarter hour to 15 minutes.", steps: ["A quarter of 60 minutes is 15 minutes.", "Pages produced: 12 × 15 = 180."], answer: "180 pages", conclusion: "The printer produces 180 pages", check: "180 ÷ 15 = 12 pages per minute, matching the stated rate.", structureId: "estimation_route_4_multiRate", difficulty: 1 }),
          swc({ q: "Three identical pens cost £1.50. What do 7 pens cost?", state: "Find the price per pen, then multiply by 7.", steps: ["One pen costs £1.50 ÷ 3 = £0.50.", "Seven pens cost 7 × £0.50 = £3.50."], answer: "£3.50", conclusion: "Seven pens cost £3.50", check: "£3.50 ÷ 7 = £0.50 per pen, which matches the original rate.", structureId: "estimation_route_4_multiRate", difficulty: 2 }),
          swc({ q: "Five identical notebooks cost £4. What do 8 notebooks cost?", state: "Eight is not a whole-number multiple of 5, so use the cost of one notebook.", steps: ["One notebook costs £4 ÷ 5 = £0.80.", "Eight notebooks cost 8 × £0.80 = £6.40."], answer: "£6.40", conclusion: "Eight notebooks cost £6.40", check: "£6.40 ÷ 8 = £0.80 and 5 × £0.80 = £4.", structureId: "estimation_route_4_multiRate", difficulty: 3 }),
          clear({ q: "Twelve kilograms of gravel costs £9. A path needs 20 kg. Find the cost using a unit rate and confirm it by scaling.", state: "The cost is proportional to mass. We need one answer supported by two routes.", comprehend: "The unit-rate route finds cost per kilogram. The scale route compares 20 kg with 12 kg.", link: "Both mass and price must receive the same scale factor.", explain: "Calculate the unit price first, then use the fraction 20/12 = 5/3 as an independent check.", steps: ["Unit price: £9 ÷ 12 = £0.75 per kg.", "Cost for 20 kg: 20 × £0.75 = £15.", "Scale check: £9 × 5/3 = £3 × 5 = £15."], answer: "£15", conclusion: "Twenty kilograms costs £15", check: "£15 ÷ 20 = £0.75 per kg, the same as £9 ÷ 12.", review: "Both routes preserve the original rate and give £15.", structureId: "estimation_route_4_multiRate", difficulty: 4 })
        ]
      },
      {
        h: "7. A percentage multiplier includes the original amount",
        body: [
          "An unchanged amount is 100% of itself. Increasing by 15% produces 100% + 15% = 115%, which is decimal multiplier 1.15.",
          "Decreasing by 20% leaves 80%, so the multiplier is 0.8. A multiplier below 1 reduces the number, while a multiplier above 1 increases it.",
          "For a discount, distinguish the amount removed from the price left to pay. A 25% discount removes 0.25 of the original but leaves 0.75 of it.",
          "Successive changes multiply because each new percentage acts on the amount produced by the previous stage. Equal percentage rises and falls do not cancel unless the bases are the same.",
          "To reverse a percentage change, divide by its multiplier. Subtracting the percentage of the final value uses the wrong reference amount."
        ],
        note: "Use 1 plus the decimal for an increase and 1 minus it for a decrease.",
        examples: [
          simple({ q: "Increase 80 by 15% using a multiplier.", state: "The new amount is 115% of 80, so use 1.15.", steps: ["Multiplier: 1 + 0.15 = 1.15.", "Calculate 80 × 1.15 = 92."], answer: "92", conclusion: "The increased amount is 92", check: "The increase is 12, and 12/80 = 0.15 = 15%.", structureId: "estimation_route_5_moneyTrail", difficulty: 1 }),
          swc({ q: "A computer game costs £48 and has a 25% discount. Find the sale price.", state: "The customer pays the remaining 75%, represented by multiplier 0.75.", steps: ["Remaining percentage: 100% − 25% = 75%.", "Calculate £48 × 0.75 = £36."], answer: "£36", conclusion: "The sale price is £36", check: "The £12 reduction is one quarter of £48.", structureId: "estimation_route_5_moneyTrail", difficulty: 2 }),
          clear({ q: "A house worth £250,000 rises by 8%, then falls by 5% of its new value. Find its final value.", state: "Apply the 8% rise first and the 5% fall to that new amount.", comprehend: "The two multipliers are 1.08 and 0.95. They cannot be replaced by a simple 3% rise because the percentages use different base values.", link: "Calculate £250,000 × 1.08 × 0.95.", explain: "Show each year's value and verify with the combined multiplier.", steps: ["After the rise: £250,000 × 1.08 = £270,000.", "After the fall: £270,000 × 0.95 = £256,500.", "Combined multiplier: 1.08 × 0.95 = 1.026."], answer: "£256,500", conclusion: "The final value is £256,500", check: "£250,000 × 1.026 = £256,500, so the combined route agrees.", review: "The final value is 102.6% of the starting value.", structureId: "estimation_route_5_moneyTrail", difficulty: 3 }),
          clear({ q: "After a 20% reduction, a coat costs £120. Find its original price.", state: "The sale price is 80% of the original, so reverse multiplier 0.8.", comprehend: "£120 is the remaining amount, not the 20% reduction. The original must be greater than £120.", link: "Solve original × 0.8 = £120 by dividing by 0.8.", explain: "Recover the original and apply the discount forwards to check.", steps: ["Original price = £120 ÷ 0.8.", "Calculate 1,200 ÷ 8 = 150.", "Therefore the original price was £150."], answer: "£150", conclusion: "The coat originally cost £150", check: "Twenty per cent of £150 is £30, and £150 − £30 = £120.", review: "The forward reduction reproduces the given sale price.", structureId: "estimation_route_5_moneyTrail", difficulty: 4 })
        ]
      }
    ]
  },
