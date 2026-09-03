const PRIMARY_GUIDANCE = {
  negativeNumbers: ["counting forwards and backwards from zero", "negative numbers describe positions or amounts below a chosen zero", "place the values on a number line and treat each change as movement", "reverse the movement or count the full distance", "a larger digit does not make a negative number larger"],
  placeValue: ["reading whole numbers and counting in groups of ten", "a digit's value comes from its position", "separate the number into place-value parts before changing or comparing it", "recombine the parts and confirm every digit returns to its original place", "the digit and the value of the digit are not the same thing"],
  roundingEstimate: ["locating numbers between neighbouring multiples", "rounding chooses the nearby benchmark that best represents a number", "mark the lower benchmark, upper benchmark and halfway point before choosing", "check that the original number lies inside the interval for the rounded answer", "do not look only at the final digit without identifying the rounding place"],
  additionSubtraction: ["place value and the idea that parts combine to make a whole", "addition and subtraction describe joining, removing, comparing and recovering a missing part", "name the whole and the parts before choosing the operation", "use the inverse operation to rebuild the original relationship", "keywords alone cannot decide the operation"],
  compensationMentalMaths: ["number bonds and the effect of adding or subtracting the same amount", "a calculation can be reshaped without changing its value", "move a convenient amount, record what changed and balance it exactly", "compare with an estimate or reverse the adjustment", "an unbalanced adjustment changes the answer"],
  timesTablesFacts: ["skip counting and equal groups", "multiplication facts describe equal groups and can be connected rather than memorised separately", "start from a known fact, then use doubling, halving, partitioning or commutativity", "divide the product by one factor to recover the other", "changing a factor changes the product unless another change compensates"],
  factorsMultiplesPrimes: ["times-table facts and exact division", "factors divide a number exactly while multiples are produced by multiplying", "write an organised factor pair or multiple list and stop only when the pattern repeats", "multiply factor pairs or test division for a zero remainder", "factor and multiple describe opposite directions"],
  formalMultiplication: ["place value, times tables and partitioning", "written multiplication records the value of every partial product", "estimate, partition by place value, multiply each part and recombine", "compare with the estimate and use division for an inverse check", "a zero placeholder protects place value and is not optional"],
  divisionRemainders: ["equal grouping and multiplication facts", "division finds a group size, a number of groups or an amount left over", "decide what the quotient and remainder mean in the story before calculating", "rebuild the dividend using divisor × quotient + remainder", "the remainder must be smaller than the divisor and may need interpreting"],
  formalDivision: ["multiplication facts, subtraction and place value", "long division repeatedly asks how many groups fit into the current place-value part", "estimate the quotient, divide one place at a time and carry the unused value into the next place", "multiply the quotient by the divisor and add any remainder", "bringing down a digit changes place value and must be explained"],
  fourOperationsProblems: ["the four operations and inverse relationships", "a story can contain several relationships that must be modelled in order", "name each quantity, decide what changes first and keep a labelled running total", "replay the story or work backwards from the result", "performing every visible number operation is not a valid plan"],
  fractionOfQuantity: ["equal sharing and the meaning of numerator and denominator", "a fraction of a quantity means split into denominator-sized equal groups and select numerator groups", "find one equal part first, then scale to the required number of parts", "multiply the answer by the denominator relationship or compare with the whole", "dividing by the numerator first usually changes the meaning"],
  fractionEquivalence: ["equal parts and multiplication facts", "equivalent fractions are different names for the same amount", "scale numerator and denominator by the same non-zero factor", "cross-check with a common denominator, a diagram or cross multiplication", "changing only the top or only the bottom changes the fraction"],
  fractionArithmetic: ["equivalent fractions and equal-sized parts", "fractions can be combined only after the pieces have the same name and size", "choose a common denominator, convert each fraction and then operate on the numerators", "estimate against zero, one half and one whole, then simplify", "denominators are not added merely because numerators are added"],
  decimalPlaceValue: ["whole-number place value and fractions with denominators 10, 100 and 1000", "decimal places continue the base-ten place-value pattern to the right of the point", "align equal place values and use zeros as placeholders when helpful", "convert to a fraction or place the value between neighbouring benchmarks", "decimal length does not decide which number is larger"],
  percentages: ["fractions, decimals and finding a fraction of a quantity", "a percentage is a fraction measured out of one hundred", "connect the percentage to 100%, 10%, 1% or a familiar fraction, then scale", "return to 100% or compare the part with the original whole", "a larger percentage can still describe a smaller amount when the wholes differ"],
  ratioBasics: ["multiplication facts, fractions and equal scaling", "a ratio compares linked quantities through repeated equal groups", "find the value of one ratio part or scale every part by the same factor", "reconstruct the original quantities and confirm the comparison stays unchanged", "part-to-part and part-to-whole ratios answer different questions"],
  twoUnknowns: ["inverse operations and representing a missing number", "two clues can determine two unknown quantities when both clues are used together", "draw bars, remove a known difference or enumerate cases systematically", "substitute both values into every original clue", "satisfying one clue is not enough"],
  additiveMultiplicative: ["addition, multiplication and ratio language", "'more than' describes a gap while 'times as many' describes a scale factor", "translate the comparison into a bar model or equation before calculating", "compare the recovered values with the exact wording", "adding when the relationship is multiplicative gives a plausible but wrong answer"],
  unitConversion: ["place value, multiplication and division by powers of ten", "a measurement keeps the same physical size when its unit name changes", "write the conversion fact, decide whether the numerical value should grow or shrink and then scale", "convert back to the starting unit", "multiplying or dividing from memory without checking unit size reverses many conversions"],
  areaPerimeter: ["length measurement and multiplication", "perimeter measures the boundary while area measures the surface inside", "label dimensions, decide whether the question concerns edge length or square coverage and then decompose if needed", "check units and reconstruct missing lengths or areas", "area and perimeter use different units and are not interchangeable"],
  timeCalendar: ["counting in sixties, sevens, twelves and ordinary place value", "time and calendars are cyclic measurement systems", "separate full cycles from the remaining part and use a timeline when crossing a boundary", "count forward again from the start or compare elapsed segments", "minutes do not use base ten and dates have unequal month lengths"],
  statistics: ["the four operations, fractions and careful reading of labels", "statistics organises data so that patterns, typical values and comparisons can be seen", "read titles, axes and units first, then choose the statistic that answers the question", "return the result to the chart or data set and interpret it", "a graph's visual height is meaningless without its scale"],
  shapeProperties: ["recognising common two-dimensional and three-dimensional shapes", "a shape is identified by properties that remain true when it is moved, turned or resized", "list sides, angles, parallel lines, symmetry or faces and use only stated properties", "test every defining property rather than relying on appearance", "a drawing may not be to scale"],
  angleBasics: ["turns, straight lines and shape properties", "an angle measures an amount of turn", "identify the angle relationship, write the known total and subtract or divide as required", "add the related angles back to the required total", "side length does not determine angle size"],
  symmetryReflection: ["shape properties, coordinates and equal distance", "reflection places every point the same perpendicular distance on the other side of a mirror line", "work point by point, count square distances and preserve alignment", "reflect the image back and confirm it returns to the start", "turning a shape is not the same as reflecting it"],
  sequencePattern: ["skip counting, differences and multiplication facts", "a sequence is controlled by a rule that must work for every term", "compare consecutive terms, identify the repeating or growing unit and test the rule more than once", "generate earlier and later terms using the same rule", "matching one step does not prove a rule"],
  logicGrid: ["careful reading and organising information in a table", "logic uses constraints to remove impossibilities until only consistent choices remain", "record definite facts first, propagate exclusions and re-read every clue after each deduction", "test the completed arrangement against every clue", "guessing can hide a contradiction"],
  combinatoricsCounting: ["multiplication facts and systematic lists", "counting possibilities requires a complete list with no omissions or duplicates", "fix one choice at a time and use a table, tree or ordered list", "count the same set by a second organisation when possible", "an unordered list can count the same outcome twice"],
  spatialPuzzles: ["shape properties, symmetry and mental rotation", "spatial reasoning tracks what stays connected when an object is folded, turned or viewed differently", "mark fixed features, follow one movement at a time and use a sketch or model", "reverse the transformation or compare touching faces and edges", "a mental image can silently flip left and right"],
};

const JUNIOR_GUIDANCE = {
  placeValue: ["Primary place value, decimals and negative numbers", "place value extends across zero and into powers of ten", "partition values by powers of ten and compare the first place that differs", "recompose the number or place it on a scaled number line", "zeros may hold places without adding value"],
  numberProperties: ["factors, multiples and prime numbers", "number properties reveal structure that avoids trial-and-error calculation", "factorise, inspect parity or remainders and state the property being used", "test the conclusion with the original divisibility or remainder condition", "a pattern from one example is not yet a proof"],
  integerDecimalArithmetic: ["the four operations, decimal place value and negative numbers", "signed and decimal arithmetic follows place value and inverse relationships", "estimate the sign and size, align place values and calculate in a controlled order", "use an inverse operation and compare with the estimate", "two negative signs need interpretation, not an automatic slogan"],
  expressionsEquations: ["arithmetic operations and missing-number sentences", "algebra uses symbols to describe numbers and relationships that may vary", "translate each operation in order and keep both sides of an equation balanced", "substitute the result into the original relationship", "an equals sign means both expressions have the same value"],
  coordGeom: ["Primary coordinates, signed numbers and shape properties", "coordinates describe exact position using horizontal then vertical movement", "plot or compare one coordinate at a time and translate geometric properties into coordinate facts", "substitute the point or measure the coordinate differences", "swapping x and y moves the point"],
  perimeterArea: ["Primary perimeter, area and unit conversion", "boundary length and covered area can be decomposed and recombined", "mark known lengths, recover missing ones and split compound shapes into familiar pieces", "add shared pieces carefully and confirm the units", "internal edges are not part of an outside perimeter"],
  fractionUnusual: ["equivalent fractions and Primary fraction calculations", "fraction arithmetic depends on equal-sized parts and multiplicative equivalence", "choose a common representation, calculate and simplify only after the relationship is secure", "estimate the result and reverse the operation where possible", "adding denominators changes the pieces"],
  ratioChain: ["Primary ratio, fractions and unitary methods", "ratio and proportion preserve multiplicative relationships across several quantities", "find a common unit or one-part value, then follow the chain with labelled quantities", "reconstruct a known ratio and compare scale factors", "additive changes do not preserve a ratio"],
  transformations: ["Primary reflection, coordinates and shape properties", "transformations move a figure according to a precise rule while preserving specified properties", "track vertices, centre, direction and distance one operation at a time", "apply the inverse transformation", "the order of two transformations can change the result"],
  estimation: ["rounding and the four operations", "estimation controls accuracy and tells us what size of answer is reasonable", "identify the required accuracy, choose useful bounds or rounded values and state the effect", "check whether the exact value lies inside the predicted interval", "rounding too early may move a boundary"],
  sequences: ["Primary sequences, arithmetic and factors", "sequences connect a term's position with a repeatable rule", "separate term-to-term change from position-to-term structure and test several terms", "substitute known positions and regenerate the sequence", "a constant difference must be checked more than once"],
  linearGraphs: ["coordinates and simple algebraic substitution", "a straight graph represents a constant rate of change and a starting value", "identify change in y, change in x and the intercept before using y = mx + c", "substitute a point and confirm it lies on the line", "gradient is a ratio of changes, not simply a y-value"],
  linearEquations: ["expressions, inverse operations and balancing", "solving an equation finds the value that makes both sides equal", "simplify each side, undo operations in reverse order and perform the same change to both sides", "substitute the value into the original equation", "moving a term is shorthand for a balanced inverse operation"],
  percentProportion: ["fractions, ratio and Primary percentages", "percentages and proportionality compare amounts through a common multiplicative scale", "identify the original whole, find a convenient unit and scale with labels", "recover the whole or calculate the percentage in a second way", "percentage change uses the original amount as its reference"],
  statisticsMeasures: ["Primary charts, averages and fractions", "statistical measures summarise a data set but answer different questions", "organise the data, choose mean, median, mode or range for a reason and calculate from labelled values", "check the measure against the ordered data and its possible range", "one average cannot describe spread"],
  statisticsAnalysis: ["statistical measures and reading charts", "analysis compares distributions and judges how trustworthy a conclusion is", "compare centre and spread, inspect representation and consider how the data were collected", "test the claim against the displayed data and look for counterexamples", "correlation and a biased sample do not prove a cause"],
  areaVolume: ["perimeter, area, multiplication and units", "three-dimensional measure grows from layers of two-dimensional area", "draw or imagine layers, calculate one face or cross-section and scale through the depth", "compare with dimensions and use cubic units", "surface area and volume measure different things"],
  polygons: ["Primary angle facts and shape properties", "polygon angle relationships follow from turns, triangles and parallel lines", "mark equal, supplementary or corresponding angles and write the total before solving", "add angles back to the required polygon or line total", "a diagram's appearance cannot replace a stated property"],
  constructions: ["ruler measurement, circles and perpendicular lines", "a construction creates every point satisfying an exact distance or angle condition", "translate each condition into a locus, construct it and use intersections for simultaneous conditions", "measure or reason from the defining property", "a measured sketch is not an exact construction"],
  similarityPythagoras: ["ratio, squares and right-angled triangles", "similarity preserves shape while Pythagoras connects the three sides of a right triangle", "identify corresponding sides or the hypotenuse before writing a proportion or square equation", "substitute the result back and compare side sizes", "Pythagoras applies only to right-angled triangles"],
  probability: ["fractions, ratio and systematic lists", "probability measures favourable outcomes as a share of all equally likely outcomes", "define the sample space, count without duplication and use complements or multiplication only when justified", "confirm the result lies between 0 and 1 and compare with an enumeration", "outcomes are not automatically equally likely"],
  nonLinearRelations: ["sequences, coordinates and linear graphs", "non-linear relationships change at a non-constant rate", "make a table, compare successive changes and choose a representation that exposes the pattern", "substitute several values and compare with the graph", "a curved graph cannot be described by one constant gradient"],
  expressionsFormulae: ["expressions, equations and multiplication laws", "formulae express general relationships and algebraic manipulation preserves value", "identify like terms, factors and operation order before simplifying or rearranging", "expand, substitute or reverse the manipulation to check equivalence", "unlike terms cannot be combined"],
  trigonometry: ["similar triangles, ratio and Pythagoras", "right-angled trigonometry uses fixed side ratios for a chosen angle", "mark the right angle, name opposite, adjacent and hypotenuse relative to the chosen angle, then select the matching ratio", "estimate from side sizes and substitute back into the ratio", "opposite and adjacent change when the chosen angle changes"],
  standardForm: ["place value, powers and multiplication", "standard form records very large or small numbers as a value from 1 to 10 multiplied by a power of ten", "normalise the coefficient and track decimal movement with the exponent", "expand the power of ten to recover the ordinary number", "the coefficient must be at least 1 and less than 10"],
  graphicalRepresentations: ["coordinates, rates and linear graphs", "a graph tells a relationship through position, shape, gradient and intercept", "read axes and scale, identify the feature the question names and translate it back into the context", "check a coordinate or trend against the original quantities", "a steep-looking line depends on axis scales"],
  truthLiars: ["careful statements and contradiction", "truth-and-lie problems require every statement to agree with the speaker's type", "test a small assumption, follow all consequences and reject any contradiction", "re-read every statement under the surviving assignment", "believing the first statement without testing it creates circular reasoning"],
  seating: ["systematic listing and position words", "arrangement problems combine distinct positions with constraints", "place the strongest fixed or adjacency condition first, then enumerate remaining cases", "check that every person appears once and every condition holds", "rotations may or may not count as new arrangements"],
  pigeonhole: ["grouping and worst-case reasoning", "more objects than available categories force at least one category to repeat", "construct the most spread-out possible case, then add the object that forces repetition", "show the boundary case just below the guarantee", "a likely repeat is different from a guaranteed repeat"],
  allocation: ["division, remainders and systematic lists", "allocation tracks how objects can be distributed while respecting labels and limits", "record distributions as ordered cases and apply minimum, maximum or parity constraints", "add the parts and test every capacity condition", "swapping labelled boxes may create a different allocation"],
  magicGrid: ["addition, inverse operations and simple equations", "a magic grid links rows, columns and diagonals through a common total", "start with the line containing the fewest unknowns and propagate each result", "recalculate every completed line", "solving one row does not guarantee the whole grid works"],
  gridLogic: ["tables, coordinates and elimination", "a grid turns local clues into connected constraints", "make forced placements first and propagate their effects through crossing rows and columns", "check every row, column and clue after completion", "a locally possible value may create a later contradiction"],
  networkGraph: ["counting pairs and organised diagrams", "a graph records objects as vertices and connections as edges", "decide whether the task concerns pairs, degrees, routes, components or colouring before counting", "use degree totals, component counts or a second drawing to verify", "each edge touches two vertices and is easily double-counted"],
};

const stageNames = ["Example 1", "Example 2", "Example 3", "Example 4"];

const STRUCTURE_COACHING = {
  classify_angle_diagram: ["Compare the marked turn with a square corner for 90° and a straight line for 180° before naming it.", "The classification should agree with the angle's measured range."],
  right_angle_compare: ["Use 90° as the benchmark and decide whether the turn is smaller, equal or larger.", "Compare the answer once more with a square corner."],
  identify_comparison_type: ["Underline the comparison phrase and decide whether it describes an added gap or a multiplying scale.", "Translate the answer back into the exact comparison sentence."],
  judge_best_comparison: ["Test both an additive statement and a multiplicative statement against the two quantities.", "Recalculate the stated gap or scale factor from the original pair."],
  recall_fact: ["Name the larger and smaller units, then state how many of the smaller unit make exactly one larger unit.", "Convert the smaller-unit answer back to one larger unit."],
  direct_convert_up: ["Write the unit equality first, then scale the given number by the same conversion factor.", "Reverse the conversion and recover the starting measurement."],
  direct_convert_down: ["Write how many smaller units make one larger unit, then divide into the requested larger units.", "Multiply back into the smaller unit."],
  part_to_whole_ratio: ["Find the whole by combining every part before writing the requested part-to-whole comparison.", "Expand the simplified ratio and compare it with the original part and whole."],
  given_one_find_other: ["Treat the known total as the whole and subtract the known part to reveal the missing part.", "Add the two parts and recover the stated total."],
  duration_simple_minutes: ["Mark the start and finish on a timeline and count the elapsed interval, not the clock labels themselves.", "Add the duration to the start time and recover the finish."],
  elapsed_time_find_duration: ["Split the interval at a friendly hour or half-hour, then combine the elapsed pieces.", "Count forward from the start by the calculated duration."],
  clock_duration_cross_hour: ["Count to the next full hour first, then count from that hour to the finish.", "Combine the two time segments and replay them from the start."],
  dow_forward: ["Separate complete seven-day weeks from the remaining days.", "Count the remainder forward from the starting weekday."],
  dow_backward: ["Separate complete seven-day weeks, then count the remainder backwards.", "Count the same number forward to return to the starting weekday."],
  multistep_dow_date: ["Handle the date change and weekday cycle one stage at a time.", "Replay each full week and remaining day in order."],
  area_vs_perimeter_concept: ["Point to the boundary and the interior, then decide which one the question asks about.", "Confirm that the final unit is linear for perimeter or square for area."],
  rect_perimeter_basic: ["A rectangle has two lengths and two widths, so include both pairs of opposite sides.", "Add the four side lengths directly as a second method."],
  regular_polygon_perimeter: ["Equal sides form repeated lengths, so multiply one side by the number of sides.", "List and add the equal side lengths to confirm the product."],
  rect_area_basic: ["Think of equal rows of square units: number of rows multiplied by squares in each row.", "Check that the answer uses square units and matches the grid size."],
  grid_area_whole_squares: ["Count complete rows and columns of unit squares rather than tracing the boundary.", "Multiply rows by columns and compare with a direct count."],
  L_shape_area: ["Split the L-shape into non-overlapping rectangles or subtract the missing corner from one large rectangle.", "Use the other decomposition to confirm the same total area."],
  is_shape_symmetric_simple: ["Imagine folding on the proposed mirror line and compare matching points on both sides.", "Each matched point should be the same perpendicular distance from the line."],
  complete_pattern_vertical_mirror: ["For each point, count its horizontal distance to the vertical mirror line and copy that distance on the other side.", "Reflect the completed image back onto the original."],
  reflect_point_axis: ["Identify which coordinate measures distance from the named axis and reverse only that signed distance.", "Apply the same reflection again and recover the starting point."],
  polygon_name_from_sides: ["Count straight sides and vertices carefully, beginning at one marked corner and returning to it once.", "The polygon name should match both the side count and vertex count."],
  triangle_classify_sides: ["Compare the three side lengths and count how many are equal.", "Check the chosen name against its defining side property."],
  translate_point_vector: ["Apply the horizontal part of the vector to x and the vertical part to y, keeping their signs.", "Subtract the vector to return to the original point."],
  mult_principle_2way: ["Fix the first choice and list every compatible second choice, then repeat for each first choice.", "A tree or table should contain the same number of endpoints as the product."],
  mult_principle_3way: ["Build choices in three stages and multiply only after confirming every stage is independent.", "Count the endpoints of a small tree or reverse one stage of the product."],
  coin_totals_listing: ["List outcomes in an organised order by the number or value of coins used.", "Re-scan the list for duplicated totals and missing boundary cases."],
  counting_squares_grid: ["Count squares by size, beginning with unit squares and then larger composite squares.", "Mark counted squares or total them by a second size-first list."],
  combinations_pairs: ["List pairs with a fixed first member and allow only later members as the partner.", "This ordering prevents counting AB and BA as different when order does not matter."],
  pigeonhole_guarantee: ["Construct the most spread-out case with no repetition, then add one more object.", "Show that one fewer object can still avoid the claimed repeat."],
  multistage_mult_minus_forbidden: ["Count all unrestricted outcomes first, then identify forbidden outcomes without overlap.", "Add allowed and forbidden counts and recover the unrestricted total."],
  shape_fev: ["Track faces, edges and vertices separately and use the object rather than its perspective drawing.", "Check the counts against a net or Euler's relationship when appropriate."],
  rotation_reflection_flag: ["Follow one marked direction through the proposed turn or mirror movement.", "Apply the inverse transformation and recover the starting direction."],
  paper_fold_cut: ["Count the paper layers at the cut and reflect the cut through each fold in reverse order.", "Fold the predicted holes back together and confirm that they coincide."],
  spot_multiple: ["Generate multiples in order or divide the candidate and look for a whole-number quotient.", "Multiply the quotient by the original number."],
  count_factors: ["Write factor pairs from 1 upwards and stop when the pair order would repeat.", "Every listed factor should divide with zero remainder."],
  highest_common_factor: ["List or prime-factorise both numbers and keep only factors shared by both.", "Divide both original numbers by the proposed HCF."],
  lowest_common_multiple: ["List multiples or combine prime factors until the first shared positive value appears.", "Divide the proposed LCM by both original numbers."],
  short_multiplication_1digit: ["Multiply from the ones place leftwards and regroup every complete group of ten into the next column.", "Estimate first, then divide the product by the one-digit factor."],
  distributive_partition_2digit: ["Partition one factor by place value, calculate each partial product and add them.", "Factor the partial products back into the original multiplication."],
  long_multiplication_2digit_full: ["Create one partial product for the ones digit and one for the tens digit, preserving the tens place.", "Compare with an estimate and add the partial products again."],
  spot_correct_partial_products: ["Match each partial product to the digit and place value that produced it.", "Add the accepted partial products and compare with an estimate."],
  estimate_product_before_calculating: ["Round each factor to a useful nearby value before multiplying.", "The accurate product should be reasonably close to the estimate."],
  estimate_product_by_rounding: ["Round both factors to friendly values at the requested place, then multiply the rounded pair.", "Compare the estimate with the size and leading digits of the original factors."],
  division_compensation: ["Rewrite the division using a matching multiplication or a factor change that preserves the quotient.", "Multiply the proposed quotient by the divisor to recover the dividend."],
  recognize_valid_pair: ["State exactly how far the original number is from the friendly number and whether that adjustment was added or subtracted.", "Undo the adjustment and recover the original calculation."],
  scale_by_ten_hundred: ["Use the known basic fact, then explain how multiplying one factor by ten changes the product's place value.", "Divide the scaled product by ten and recover the known fact."],
  fact_family: ["Write the multiplication relationship first, then use each factor as a divisor in turn.", "Each division fact should multiply back to the same product."],
  state_leftover_directly: ["Form as many complete groups as possible, then count the items that cannot join a full group.", "Use divisor × quotient + remainder to rebuild the total."],
  short_division_quotient: ["Divide one place-value part at a time and regroup any unused amount into the next place.", "Multiply the quotient by the divisor."],
  procedural_bring_down_digit: ["Explain the unused amount in its current place before combining it with the next digit.", "Rebuild that stage using divisor × quotient digit + remainder."],
  estimate_the_quotient: ["Use a nearby multiplication fact to predict the quotient's size before dividing.", "Multiply the estimate by the divisor and compare with the dividend."],
  missing_dividend_or_divisor: ["Use the inverse relationship dividend = divisor × quotient + remainder.", "Substitute every recovered value into that relationship."],
  identify_remainder: ["Find the greatest complete multiple of the divisor not exceeding the dividend.", "The difference is the remainder and must be smaller than the divisor."],
  remainder_as_fraction: ["Treat the remainder as part of one more group, using the divisor as the denominator.", "Convert the fraction back into the leftover portion of a group."],
  two_step_division: ["Complete the first grouping, label its result and use that result in the second division.", "Reverse both divisions in the opposite order."],
  digit_value_from_place: ["Locate the digit's column and multiply the digit by that column's value.", "Reinsert the value into the number's expanded form."],
  multiply_divide_power_of_ten: ["Track how every digit changes place relative to the fixed decimal point.", "Apply the inverse power-of-ten operation."],
  fraction_decimal_equivalence: ["Express the decimal as tenths, hundredths or thousandths, then simplify if needed.", "Divide numerator by denominator to recover the decimal."],
  coordGeom_route_2_spatialTransform: ["Identify the regular polygon's equal sides and repeated angles, then test mirror lines and turns separately.", "Apply the claimed rotation or reflection and check that every vertex returns to a matching position."],
  transformations_route_1_spatialTransform: ["Mark one vertex or direction before applying the symmetry so that the movement can be tracked precisely.", "Apply the inverse movement and recover the starting orientation."],
  networkGraph_logic_route_3: ["Try alternating two colours around the cycle and inspect the final connection back to the first vertex.", "Check every edge and confirm its two endpoints have different colours."],
};

const PLAIN_CHECKS = {
  digit_from_place_name: "Point to each written symbol once and count it. Remember that zero is a digit too.",
  digit_value_from_place: "Start at the ones place and name each place as you move left. Make sure the chosen digit is in the place you named.",
  arrange_digits_extremum: "Check that every given digit was used exactly once. Then ask whether swapping any two digits could make a better answer.",
  reconstruct_from_clues: "Read every digit again, including each zero, and test the statement against the meaning of a digit.",
  place_name_from_digit: "Name the places from right to left once more. The digit should finish in the same place and have the same value.",
  unitizing: "Divide the larger value by the smaller value. The result tells us how many times as large it is.",
  swap_two_digits_change: "Write the number as the value of each digit added together. The parts should make the original number.",
  digit_range_for_inequality: "Move the digit back the same number of places. Its value should return to where it began.",
  compose_from_named_parts: "Split the finished number back into named places. The pieces should match every part in the question.",
  compare_mixed_length_decimals: "Line up the decimal points and compare from the first place on the left that is different.",
  order_four_decimals: "Line up the decimal points and read down each place. Every number should be used once.",
  thousandths_fraction_decimal: "Read the decimal as tenths, hundredths or thousandths. It should name the same fraction.",
};

function makePlain(text) {
  return String(text || "")
    .replace(/\bthe quotient\b/gi, "the answer")
    .replace(/\bthe divisor\b/gi, "the number we divided by")
    .replace(/\bthe dividend\b/gi, "the starting number")
    .replace(/\bconstraints\b/gi, "rules in the question")
    .replace(/\breconstruct\b/gi, "build again")
    .replace(/\brecombine\b/gi, "put the parts back together")
    .replace(/\binverse operation\b/gi, "opposite operation");
}

function checkForExample(example) {
  const q = cleanQuestion(example.q).toLowerCase();
  if (/how many times as valuable/.test(q) && /ones place/.test(q) && /hundredths place/.test(q)) return "Multiply the hundredths value by the comparison factor: 0.07 × 100 = 7. This returns exactly to the ones value.";
  if (/how many digits/.test(q)) return "Point to each written symbol once and count it. Remember that zero is a digit too.";
  if (/greatest|largest/.test(q) && /digit|number/.test(q)) return "Make sure every given digit was used exactly once. Then ask whether swapping any two digits could make a larger allowed number.";
  if (/smallest/.test(q) && /digit|number/.test(q)) return "Make sure every given digit was used exactly once. Then ask whether swapping any two digits could make a smaller allowed number.";
  if (/which spot|name the place|what is it worth|value of .* in/.test(q)) return "Name the places from right to left once more. The digit should be in the place you named, and its value should match that place.";
  if (/how many tens/.test(q)) return "Multiply the number of tens by 10. It should make the starting number.";
  if (/how many hundreds/.test(q)) return "Multiply the number of hundreds by 100. It should make the starting number.";
  if (/between .* and|thinking of a .*digit number/.test(q)) return "Test the finished number against each clue, one clue at a time.";
  if (/which is bigger|which has the greater|order from/.test(q)) return "Line up the numbers and compare them again from the left. The first place that differs decides the order.";
  if (/roman numeral|marked [ivxlcdm]+|write .* in roman/i.test(q)) return "Change the Roman numeral back into an ordinary number. It should return to the number in the question or answer.";
  if (/made of|expanded form|build the number/.test(q)) return "Split the finished number back into named places. The pieces should match every part in the question.";
  return PLAIN_CHECKS[example.structureId] || STRUCTURE_COACHING[example.structureId]?.[1];
}

const SIMPLE_STRUCTURE_IDS = new Set([
  "digit_from_place_name", "place_name_from_digit", "recall_fact", "classify_angle_diagram",
  "right_angle_compare", "polygon_name_from_sides", "triangle_classify_sides", "is_shape_symmetric_simple",
  "area_vs_perimeter_concept", "identify_comparison_type", "spot_multiple", "fraction_decimal_equivalence",
]);

function chooseSolutionFormat(example, work) {
  const q = cleanQuestion(example.q).toLowerCase();
  const formulaWork = /[=+×÷%]|\bwork out\b|\bcalculate\b|\bsolve\b|\bfind (?:the )?(?:area|perimeter|mean|range|gradient|probability|distance|length|angle|value)\b/.test(q);
  const reasoningDemand = /\bexplain\b|\bprove\b|\bshow\b|\bjustify\b|\bwhy\b|\bfind all\b|\blargest possible\b|\bsmallest possible\b|\bmust\b/.test(q);
  const simpleReading = SIMPLE_STRUCTURE_IDS.has(example.structureId) || /^(how many digits|name |state |identify |which spot|what does .* ask|is .* (?:a |an )?)/.test(q);
  if (simpleReading && !formulaWork && !reasoningDemand && work.length <= 3) return "simple";
  if ((example.difficulty >= 4 && (reasoningDemand || work.length >= 4)) || work.length >= 6) return "clear";
  return "state-work-conclude";
}

function answerSummary(answer) {
  const parts = String(answer || "").split(/(?<=[.!?✓])\s+/).map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return "the result shown above";
  const firstWords = parts[0].split(/\s+/).length;
  if (firstWords <= 24 && !/^(?:round|first|start|begin|use|write|calculate|work)/i.test(parts[0])) return parts[0];
  const statedResult = parts.find((part) => /\bso (?:yes|no)\b/i.test(part) || /^(?:so|therefore|hence),?\s/i.test(part));
  return statedResult || parts[0];
}

function applySolutionWritingFormat(example) {
  const work = example.steps || [];
  const format = chooseSolutionFormat(example, work);
  example.solutionFormat = format;
  example.conclusion = sentence(answerSummary(example.answer));
  if (format === "clear") {
    const first = work[0] || "Pick out the fact that controls the problem.";
    example.clear = {
      comprehend: example.understand,
      link: `The first useful fact is this: ${sentence(first)}`,
      explain: `This tells us what to calculate or test first. After that, we can use each new result in the next step.`,
      apply: work.slice(1).length ? work.slice(1) : [first],
      review: `${sentence(example.check)} This confirms the result: ${example.conclusion}`,
    };
  }
}

function sentence(text) {
  const value = String(text || "").trim();
  if (!value) return value;
  return /[.!?✓][”’"')\]]*$/.test(value) ? value : `${value}.`;
}

function cleanQuestion(question) {
  return String(question || "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/\s+/g, " ").trim();
}

function targetOf(question) {
  const cleaned = String(question || "").replace(/<svg[\s\S]*?<\/svg>/g, "").trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]?/g) || [cleaned];
  return sentence(sentences[sentences.length - 1].trim());
}

function taskOf(question) {
  const cleaned = cleanQuestion(question);
  const sentences = cleaned.match(/[^.!?]+[.!?]?/g) || [cleaned];
  const last = sentences[sentences.length - 1].trim();
  if (sentences.length > 1 && last.split(/\s+/).length <= 2) return `${sentences[sentences.length - 2].trim()} ${last}`;
  return last;
}

function lowerFirst(text) {
  const value = String(text || "").trim();
  return value ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

function withoutFinalStop(text) {
  return String(text ?? "").trim().replace(/[.!?]+$/, "");
}

function diversifyRepeatedExamples(lesson) {
  const seen = new Map();
  for (const section of lesson.sections || []) {
    for (const example of section.examples || []) {
      const original = String(example.q || "").replace(/\s+/g, " ").trim();
      const key = original.toLowerCase();
      const occurrence = seen.get(key) || 0;
      seen.set(key, occurrence + 1);
      if (!occurrence) continue;
      const answer = withoutFinalStop(example.answer);
      if (occurrence === 1) {
        example.q = `Sam got ${answer} for this question: ${original} Show Sam's steps, then check the answer in a different way.`;
        example.steps = [...(example.steps || []), "Now check the answer in a different way, or put it back into the question to see whether it works."];
      } else if (occurrence === 2) {
        example.q = `A friend is unsure why the answer is ${answer}. Use this question to explain it in simple words: ${original}`;
        example.steps = ["Say what the question is asking before using any numbers.", ...(example.steps || []), "Finish by explaining why a different answer would not fit the question."];
      } else {
        example.q = `Check this answer carefully: ${original} The suggested answer is ${answer}. Work it out for yourself and name one easy mistake to avoid.`;
        example.steps = ["Cover the suggested answer and begin with the facts in the question.", ...(example.steps || []), "Compare your answer with the suggestion and say what mistake could lead to a different answer."];
      }
    }
  }
}

function applyTopicEditorial(lesson, profile) {
  const [prior, idea, method, check, watch] = profile;
  diversifyRepeatedExamples(lesson);
  lesson.learningPath = {
    prior: sentence(prior),
    idea: sentence(idea),
    method: sentence(method),
    check: sentence(check),
    watch: sentence(watch),
  };
  if (!String(lesson.intro || "").includes("By the end")) {
    lesson.intro = `${sentence(lesson.intro)} We will begin with ${prior}. We will build one relationship at a time, practise recognising it in different forms and explain how to check each result. By the end, you should be able to explain in your own words how ${idea}, then use that idea when the wording is unfamiliar.`;
  }
  (lesson.sections || []).forEach((section, sectionIndex, sections) => {
    const title = String(section.h || section.heading || "this idea").replace(/^\d+\.\s*/, "");
    section.learningGoal = `By the end of this section, you should be able to explain the idea in “${title}” before you calculate.`;
    delete section.bridge;
    section.misconception = sentence(watch);
    const body = Array.isArray(section.body) ? section.body : section.text ? [section.text] : [];
    section.body = body.map(sentence);
    const examples = section.examples || (section.example ? [section.example] : []);
    examples.forEach((example, exampleIndex) => {
      if (example.slowTeachingVersion === 1) return;
      const stage = example.difficulty || exampleIndex + 1;
      const fullQuestion = cleanQuestion(example.q);
      example.teachingStage = stageNames[Math.min(exampleIndex, 3)];
      example.difficulty = Math.min(4, Math.max(1, stage));
      let work = (example.steps || []).flatMap((step) => String(step).split(/(?<=[.!?✓])\s+/).filter(Boolean)).map(sentence);
      const placeholderWork = work.length > 0 && work.every((step) => /^(?:Identify the information|Apply the method|Check that the result)/i.test(step));
      const answerWork = String(example.answer || "").split(/(?<=[.!?✓])\s+/).filter(Boolean).map(sentence);
      if (placeholderWork && answerWork.length > 1) work = answerWork;
      if (work.length < 2) work.unshift(`Write down the useful numbers and words from the question.`);
      example.steps = work;
      const firstMove = work[0] || "Read the question once more and pick out the useful facts.";
      const specificCheck = checkForExample(example);
      if (example.structureId === "digit_from_place_name") {
        example.understand = `We need to count the separate symbols used to write the number. Each symbol is one digit.`;
        example.plan = `We will point to each symbol once, say its name and count how many symbols there are.`;
        example.check = `Read 47 from left to right. You point to 4, then 7. That is two symbols, so 2 digits is correct.`;
      } else {
        example.understand = `The question gives us this information: “${fullQuestion}” Before calculating, say in your own words what a correct answer must tell us.`;
        example.plan = `We will start here: ${sentence(firstMove)} Then we will explain what each step tells us.`;
        example.check = specificCheck
          ? `Here is a check: ${sentence(makePlain(specificCheck))}`
          : `Check the worked lines against the question one by one. Make sure every number, unit and instruction has been used correctly.`;
        delete example.watch;
      }
      if (example.structureId === "digit_from_place_name") example.watch = `Be careful: a digit is one written symbol. The value of that digit is a different idea that comes later.`;
      applySolutionWritingFormat(example);
      example.slowTeachingVersion = 1;
    });
  });
  lesson.editorialStandard = "slow-teaching-v1";
}

export function applyPrimarySlowTeaching(lessons) {
  for (const [key, profile] of Object.entries(PRIMARY_GUIDANCE)) if (lessons[key]) applyTopicEditorial(lessons[key], profile);
}

export function applyJuniorSlowTeaching(lessons) {
  for (const [key, profile] of Object.entries(JUNIOR_GUIDANCE)) if (lessons[key]) applyTopicEditorial(lessons[key], profile);
}

export const SLOW_TEACHING_PRIMARY_TOPICS = Object.keys(PRIMARY_GUIDANCE);
export const SLOW_TEACHING_JUNIOR_TOPICS = Object.keys(JUNIOR_GUIDANCE);
