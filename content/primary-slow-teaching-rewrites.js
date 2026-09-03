const DEEPENING = {
  negativeNumbers: [
    ["Think of a thermometer on a cold morning. Zero is not the place where temperature stops: it is simply the agreed point between positive and negative readings. A temperature of -4°C means four degrees below zero.", "Read -6 as ‘negative six’, not ‘minus six’ unless an operation is being performed. The sign belongs to the number and tells us where that number lives."],
    ["It helps to compare each number with zero first. Both -3 and -8 are below zero, but -3 needs only three steps to reach zero while -8 needs eight. That places -3 farther right.", "You can check an ordering by drawing a small line and marking only the necessary landmarks. The order from left to right is always least to greatest."],
    ["Suppose we start at -3 and add 7. First use 3 of those steps to reach zero. Four steps remain, so the journey finishes at 4. Splitting at zero makes the sign change visible.", "Do not count the starting point as a step. Point to the start, then count each move into the next numbered position."],
    ["A gap is always a distance, so it cannot be negative. From -5 to 2, the journey is 5 steps to zero and 2 more beyond zero, giving a gap of 7.", "Subtraction can calculate the same gap, but the number-line picture explains why subtracting a negative sometimes creates addition. Build the picture before expecting that shortcut to feel natural."],
    ["Write each change with its sign and keep a running position. A rise of 4 is +4; a fall of 6 is -6. One line per event stops two separate changes from being accidentally merged.", "To recover a missing start, reverse both the order and the operation. If the story added 5 then subtracted 2, begin at the finish, add 2, then subtract 5. Replay the original story as the final check."]
  ],
  additionSubtraction: [
    ["Before adding, name what the total will count. If 18 red apples and 27 green apples are combined, the answer counts apples altogether, so the two parts use the same unit.", "Partitioning protects place value: 27 is 20 and 7, not 2 and 7. Add tens and ones separately, then recombine. An estimate such as 20 + 30 also predicts the size of the answer."],
    ["Subtraction has two useful pictures. We can take away from a starting amount, or we can ask what part is missing between a smaller amount and a larger total. Both lead to the same calculation but the story explains the answer differently.", "When several amounts are removed, calculate one event at a time and label the new amount. Never subtract a later cost from the original total if an earlier cost has already changed it."],
    ["Words such as ‘more than’ do not automatically tell us which number to write first. Identify the two finished quantities, then ask how far apart they are.", "A bar model can show the larger amount as the smaller bar plus an unknown gap. This makes the relationship larger = smaller + gap visible before the subtraction is written."],
    ["A number line is especially helpful when a calculation crosses a multiple of 10 or crosses zero. Break a long jump into friendly parts, such as moving 7 to reach 40 and then moving the remaining 5.", "The direction explains the sign: adding a positive amount moves right, while subtracting it moves left. The number of steps gives the size of the change."],
    ["An equation is a balance. If 38 + □ = 71, subtraction finds the missing part because 71 - 38 removes the known part from the whole.", "For a check, use the operation that was not used in the main calculation. Add after subtracting or subtract one part after adding. The inverse should rebuild an exact number from the question."]
  ],
  fourOperationsProblems: [
    ["Operation words are clues, not commands. ‘Altogether’ often suggests addition, but a question asking how many equal packs altogether may require multiplication. Read the complete relationship before choosing.", "Draw or describe the situation in one sentence: parts join a whole, one amount changes, equal groups repeat or a total is split. That sentence is more dependable than circling one keyword."],
    ["In 6 groups of 4, the group count and group size are both known, so multiplication builds the total. If 24 objects are shared into 6 groups, division reverses the relationship to find 4 in each group.", "Write the fact family 6 × 4 = 24, 24 ÷ 6 = 4 and 24 ÷ 4 = 6. Keeping these three facts together helps you choose which quantity is missing."],
    ["A multi-step story is a sequence, not one crowded calculation. After each event, write what the new number means, including its unit. That intermediate answer becomes the starting amount for the next event.", "Pause before every step and ask whether this event should make the running amount larger or smaller. If the arithmetic moves in the opposite direction, inspect the chosen operation."],
    ["Working backwards is useful when the final amount is known. Each forward operation has an inverse: addition is undone by subtraction, multiplication by division and so on.", "Undo the last event first because it was the final thing that happened to the unknown start. This is like taking off a coat before the jumper that was put on underneath it."],
    ["Brackets mark a calculation that must be treated as one complete group. Outside brackets, multiplication and division are completed before addition and subtraction because they build the quantities that are later combined.", "Write one new line after each completed operation. Changing only the part just calculated preserves the rest of the expression and makes the order visible enough to check."]
  ]
};

export function applyPrimarySlowTeachingRewrites(lessons) {
  for (const [topic, additions] of Object.entries(DEEPENING)) {
    const lesson = lessons[topic];
    if (!lesson) continue;
    lesson.sections.forEach((section, index) => {
      if (additions[index]) section.body = [...(section.body || []), ...additions[index]];
    });
  }
}
