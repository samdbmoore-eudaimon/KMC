# Archived: Junior "Calendar Puzzles" topic

Archived 2026-09-03. This is the ONLY genuinely orphaned piece found in the Junior module's
pre-1-September legacy content. Everything else that looks like "old UKMT-paper topics" is
actually still a LIVE runtime dependency of the current 33-topic KS3 curriculum:

- `content/junior-curriculum-overlay.js`'s `consolidate()` pulls worked examples straight out
  of the old `JUNIOR_LESSONS.<key>` objects at load time via `sourceExamples()`.
- `generators/junior-curriculum-overlay.js`'s `runLegacy()` calls the old `JUNIOR_G.<key>`
  functions directly at question-generation time for 18 of the 26 KS3 topics.
- `logicLesson()`/the LOGIC generator loop reuse `truthLiars`, `seating`, `pigeonhole`,
  `allocation`, `magicGrid`, `gridLogic`, `networkGraph` directly as the 7 UKMT logic
  extension topics.

`calendar` is the one key referenced by NEITHER `CORE_SOURCES`/`CORE_SOURCE_MAP` as a source
ingredient NOR the `LOGIC` list on either the lesson or generator side — confirmed by grepping
both overlay files for the literal string `calendar` (zero matches in either). It was also not
in `JUNIOR_TOPICS` (the live 33-topic list) prior to this archiving. Its old-save migration
entry (`JUNIOR_TOPIC_MIGRATION.calendar = "sequences"` in `KangarooMathsQuest.jsx`) is
untouched and does not require this content to exist — it is a static string-to-string lookup
for merging old player progress, not a runtime reference to this lesson/generator.

If calendar/day-of-week reasoning is ever wanted back as a visible topic, the cyclic/modular
arithmetic in it would fit naturally as an extra "route" inside `integerDecimalArithmetic` or
`sequences` (both already draw on `clockArith`/`modular` for similar mod-7-style reasoning).

Removed from:
- `content/junior-lessons.js` — `JUNIOR_LESSONS.calendar = {...}` (11 sections, full lesson)
- `generators/junior-generators.js` — `calendar(d) {...}` (G15, four difficulty tiers of
  genuine mod-7/leap-year reasoning)
- `generators/gen-shared.js` — the `calendar` entry inside `JUNIOR_LEGACY_TOPICS` (this array
  and its sibling `JUNIOR_LEGACY_DEEP_TOPICS` were also removed entirely in the same pass:
  both were confirmed dead exports, imported nowhere else in the codebase — superseded by the
  live `JUNIOR_TOPICS` array of 33 entries).

## Lesson content (was `content/junior-lessons.js`)

```js
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
```

## Generator content (was `generators/junior-generators.js`, G15)

```js
  /* G15 — calendar / day-of-week: every tier is genuine mod-7 (or leap-year)
     arithmetic derived from randomised inputs — the old d<=2 branches were
     hard-coded, non-randomised questions with leaked scratch-work as their
     "solution" text; this rebuild fixes both. */
  calendar(d) {
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const MONTHS31 = [1, 3, 5, 7, 8, 10, 12];
    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    // pick 4 distinct wrong weekdays (as offsets from the true day), preferring
    // pedagogically meaningful offsets first, then filling with guaranteed-fresh ones.
    const otherDays = (trueIdx, offsetHints) => {
      const used = new Set([0]); const result = [];
      for (const off of offsetHints) {
        const o = ((off % 7) + 7) % 7;
        if (o !== 0 && !used.has(o)) { used.add(o); result.push(DAYS[(trueIdx + o) % 7]); }
        if (result.length === 4) break;
      }
      let filler = 1;
      while (result.length < 4 && filler <= 6) { if (!used.has(filler)) { used.add(filler); result.push(DAYS[(trueIdx + filler) % 7]); } filler++; }
      return result;
    };

    const tier1 = [
      // (a) forward gap mod 7
      () => {
        const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const gap = rand(9, 60);
        const trueIdx = (startIdx + gap) % 7; const trueDay = DAYS[trueIdx];
        const rem = gap % 7;
        const distractors = otherDays(trueIdx, [1, -1, Math.floor(gap / 7) - startIdx - trueIdx, 2]);
        const { options, correctIndex } = buildMCStr(trueDay, distractors);
        return { q: `Today is ${startDay}. What day of the week will it be in ${gap} days' time?`, options, correctIndex, solution: [
          `Divide the gap by 7: ${gap} ÷ 7 = ${Math.floor(gap / 7)} remainder ${rem}.`,
          `Only the remainder matters — a whole number of weeks lands back on the same weekday.`,
          `${rem} day${rem === 1 ? "" : "s"} after ${startDay} is ${trueDay}.`] };
      },
      // (b) backward gap mod 7 with wraparound
      () => {
        const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const gap = rand(9, 50);
        let trueIdx = (startIdx - gap) % 7; if (trueIdx < 0) trueIdx += 7;
        const trueDay = DAYS[trueIdx]; const rem = gap % 7;
        const distractors = otherDays(trueIdx, [1, -1, 2 * rem, 2]);
        const { options, correctIndex } = buildMCStr(trueDay, distractors);
        return { q: `Today is ${startDay}. What day of the week was it ${gap} days ago?`, options, correctIndex, solution: [
          `Divide the gap by 7: ${gap} ÷ 7 = ${Math.floor(gap / 7)} remainder ${rem}.`,
          `Going backwards, only the remainder of ${rem} day${rem === 1 ? "" : "s"} matters.`,
          `${rem} day${rem === 1 ? "" : "s"} before ${startDay} is ${trueDay}.`] };
      },
      // (c) cross one month boundary (no leap issue, first month never Feb)
      () => {
        const mIdx = pick([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        const m1Len = MONTHS31.includes(mIdx + 1) ? 31 : 30;
        const day1 = rand(Math.max(1, m1Len - 10), m1Len - 3);
        const day2 = rand(1, 10);
        const restOfMonth1 = m1Len - day1;
        const gap = restOfMonth1 + day2;
        const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const trueIdx = (startIdx + gap) % 7; const trueDay = DAYS[trueIdx];
        const distractors = otherDays(trueIdx, [1, -1, day2 - gap, 2]);
        const { options, correctIndex } = buildMCStr(trueDay, distractors);
        return { q: `${MONTH_NAMES[mIdx]} ${day1} is a ${startDay}. What day of the week is ${MONTH_NAMES[(mIdx + 1) % 12]} ${day2}?`, options, correctIndex, solution: [
          `From ${MONTH_NAMES[mIdx]} ${day1} to the end of ${MONTH_NAMES[mIdx]} is ${restOfMonth1} days, plus ${day2} more days into ${MONTH_NAMES[(mIdx + 1) % 12]}: ${restOfMonth1} + ${day2} = ${gap} days.`,
          `${gap} ÷ 7 leaves remainder ${gap % 7}.`,
          `${gap % 7} day${gap % 7 === 1 ? "" : "s"} after ${startDay} is ${trueDay}.`] };
      },
    ];

    const tier2 = [
      // (a) date of LAST occurrence of a weekday in the month
      () => {
        const L = pick([30, 31]); const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const targetIdx = rand(0, 6); const targetDay = DAYS[targetIdx];
        const first = ((targetIdx - startIdx) % 7 + 7) % 7 + 1;
        const dates = []; for (let dte = first; dte <= L; dte += 7) dates.push(dte);
        const last = dates[dates.length - 1];
        const distractors = [first, L, last - 7 > 0 ? last - 7 : last + 8, last - 1].filter((v, i, a) => a.indexOf(v) === i && v !== last);
        while (distractors.length < 4) distractors.push(last + distractors.length + 3);
        const { options, correctIndex } = buildMC(last, distractors);
        return { q: `A ${L}-day month starts on a ${startDay}. What is the date of the LAST ${targetDay} in the month?`, options, correctIndex, solution: [
          `The first ${targetDay} falls on day ${first} (since the month starts on a ${startDay}).`,
          `Each later ${targetDay} is another 7 days on: ${dates.join(", ")}.`,
          `The last one within the ${L}-day month is day ${last}.`] };
      },
      // (b) which weekdays occur 5 times
      () => {
        const L = pick([30, 31]); const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const extra = L - 28;
        const fiveIdxs = []; for (let i = 0; i < extra; i++) fiveIdxs.push((startIdx + i) % 7);
        const fiveNames = fiveIdxs.map(i => DAYS[i]);
        const correctStr = fiveNames.join(", ");
        const shiftSet = (k) => fiveIdxs.map(i => DAYS[(i + k + 7) % 7]).join(", ");
        const distractors = [...new Set([shiftSet(1), shiftSet(-1), shiftSet(3), shiftSet(4)])].filter(s => s !== correctStr);
        let fillN = 5; while (distractors.length < 4) distractors.push(shiftSet(fillN++));
        const { options, correctIndex } = buildMCStr(correctStr, distractors);
        return { q: `A ${L}-day month starts on a ${startDay}. Which weekday(s) occur 5 times that month?`, options, correctIndex, solution: [
          `A ${L}-day month has 4 full weeks (28 days) plus ${extra} extra day${extra === 1 ? "" : "s"}.`,
          `Those extra day${extra === 1 ? "" : "s"} are day${extra === 1 ? "" : "s"} 29${extra > 1 ? `–${28 + extra}` : ""}, which repeat the weekday${extra === 1 ? "" : "s"} of day${extra === 1 ? "" : "s"} 1${extra > 1 ? `–${extra}` : ""}: ${fiveNames.join(", ")}.`,
          `Every other weekday occurs only 4 times, so ${fiveNames.length === 1 ? "the 5-times weekday is" : "the 5-times weekdays are"} ${correctStr}.`] };
      },
      // (c) next month's start weekday
      () => {
        const L = pick([30, 31]); const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const nextIdx = (startIdx + L) % 7; const nextDay = DAYS[nextIdx];
        const distractors = otherDays(nextIdx, [1, -1, startIdx - nextIdx, 2]);
        const { options, correctIndex } = buildMCStr(nextDay, distractors);
        return { q: `A ${L}-day month starts on a ${startDay}. What day does the following month start on?`, options, correctIndex, solution: [
          `The month has ${L} days, so the next month starts exactly ${L} days after this one did.`,
          `${L} ÷ 7 leaves remainder ${L % 7}.`,
          `${L % 7} day${L % 7 === 1 ? "" : "s"} after ${startDay} is ${nextDay}.`] };
      },
    ];

    const tier3 = [
      // (a) leap-year-aware same-date-next-year shift
      () => {
        const Y = rand(2000, 2199);
        const nextLeap = isLeap(Y + 1);
        const gap = nextLeap ? 366 : 365;
        const shift = gap % 7;
        const mIdx = rand(2, 11);
        const mLenVal = MONTHS31.includes(mIdx + 1) ? 31 : 30;
        const day = rand(1, mLenVal);
        const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const trueIdx = (startIdx + shift) % 7; const trueDay = DAYS[trueIdx];
        const wrongShift = shift === 1 ? 2 : 1;
        const distractors = otherDays(trueIdx, [wrongShift - shift, 2 - shift, -shift, 1]);
        const { options, correctIndex } = buildMCStr(trueDay, distractors);
        return { q: `This year (${Y}), ${MONTH_NAMES[mIdx]} ${day} falls on a ${startDay}. What day of the week does ${MONTH_NAMES[mIdx]} ${day} fall on in ${Y + 1}?`, options, correctIndex, solution: [
          `From this date to the same date next year spans a full year: ${gap} days, since ${Y + 1} ${nextLeap ? "is a leap year" : "is not a leap year"}.`,
          `${gap} ÷ 7 leaves remainder ${shift}.`,
          `${shift} day${shift === 1 ? "" : "s"} after ${startDay} is ${trueDay}.`] };
      },
      // (b) multi-month span crossing February (leap-aware)
      () => {
        const Y = rand(2000, 2199); const leap = isLeap(Y);
        const day1 = rand(5, 25);
        const day2 = rand(1, 28);
        const restJan = 31 - day1;
        const febLen = leap ? 29 : 28;
        const gap = restJan + febLen + day2;
        const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const trueIdx = (startIdx + gap) % 7; const trueDay = DAYS[trueIdx];
        const wrongFebLen = leap ? 28 : 29;
        const wrongGap = restJan + wrongFebLen + day2;
        const distractors = otherDays(trueIdx, [wrongGap - gap, 1, -1, 2]);
        const { options, correctIndex } = buildMCStr(trueDay, distractors);
        return { q: `In ${Y} (${leap ? "a leap year, so February has 29 days" : "not a leap year, so February has 28 days"}), January ${day1} falls on a ${startDay}. What day of the week is March ${day2}?`, options, correctIndex, solution: [
          `From January ${day1} to March ${day2}: the rest of January is ${restJan} days, all of February is ${febLen} days (${leap ? "a leap year" : "not a leap year"}), plus ${day2} days into March: ${restJan} + ${febLen} + ${day2} = ${gap} days.`,
          `${gap} ÷ 7 leaves remainder ${gap % 7}.`,
          `${gap % 7} day${gap % 7 === 1 ? "" : "s"} after ${startDay} is ${trueDay}.`] };
      },
      // (c) reverse: weekday-date sum determines the start day (uniqueness verified at generation time)
      () => {
        const L = pick([30, 31]);
        const targetIdx = rand(0, 6); const targetDay = DAYS[targetIdx];
        const s = rand(0, 6); const startDayTrue = DAYS[s];
        const first = ((targetIdx - s) % 7 + 7) % 7 + 1;
        const dates = []; for (let dte = first; dte <= L; dte += 7) dates.push(dte);
        const sum = dates.reduce((a, b) => a + b, 0);
        let matches = 0;
        for (let s2 = 0; s2 < 7; s2++) {
          const first2 = ((targetIdx - s2) % 7 + 7) % 7 + 1;
          const dates2 = []; for (let dte = first2; dte <= L; dte += 7) dates2.push(dte);
          const sum2 = dates2.reduce((a, b) => a + b, 0);
          if (sum2 === sum) matches++;
        }
        if (matches !== 1) return null;
        const distractors = otherDays(s, [1, -1, 2, 3]);
        const { options, correctIndex } = buildMCStr(startDayTrue, distractors);
        return { q: `In a certain ${L}-day month, the dates of every ${targetDay} add up to ${sum}. What day of the week does the 1st of the month fall on?`, options, correctIndex, solution: [
          `The ${targetDay} dates in this month are ${dates.join(", ")}, which add to ${sum}.`,
          `Checking every possible starting weekday for the 1st, only starting on a ${startDayTrue} makes the ${targetDay} dates sum to exactly ${sum}.`,
          `So the 1st falls on a ${startDayTrue}.`] };
      },
    ];

    const tier4 = [
      // (a) same-date-N-years-later, span deliberately crosses a century year
      // (divisible by 4 but NOT by 400, so NOT a leap year despite looking like one)
      () => {
        const boundary = pick([2100, 2200, 2300]);
        const startOffset = rand(2, 5);
        const endOffset = rand(1, 4);
        const Y = boundary - startOffset;
        const n = startOffset + endOffset;
        const mIdx = rand(2, 11);
        const mLenVal = MONTHS31.includes(mIdx + 1) ? 31 : 30;
        const day = rand(1, mLenVal);
        let leapCount = 0; const leapYears = [];
        for (let yy = Y + 1; yy <= Y + n; yy++) { if (isLeap(yy)) { leapCount++; leapYears.push(yy); } }
        const totalDays = 365 * n + leapCount;
        const shift = totalDays % 7;
        const startIdx = rand(0, 6); const startDay = DAYS[startIdx];
        const trueIdx = (startIdx + shift) % 7; const trueDay = DAYS[trueIdx];
        // classic error: treating the century year as leap because it's divisible by 4
        const wrongShift = ((365 * n + leapCount + 1) % 7 + 7) % 7;
        const distractors = otherDays(trueIdx, [wrongShift - shift, 1, -1, 2]);
        const { options, correctIndex } = buildMCStr(trueDay, distractors);
        return { q: `${MONTH_NAMES[mIdx]} ${day} ${Y} falls on a ${startDay}. What day of the week does ${MONTH_NAMES[mIdx]} ${day} fall on in ${Y + n}, ${n} years later?`, options, correctIndex, solution: [
          `Going forward ${n} years covers ${365 * n} days if there were no leap years at all, plus one extra day for every 29 February crossed along the way.`,
          `Checking each year from ${Y + 1} to ${Y + n} against the leap rule (divisible by 4, except century years, unless divisible by 400): ${boundary} is divisible by 4 but is a century year NOT divisible by 400, so it is NOT a leap year${leapYears.length ? `; the genuine leap years in this span are ${leapYears.join(", ")}` : ", and in fact no year in this span is a leap year"}.`,
          `That gives ${leapCount} extra day${leapCount === 1 ? "" : "s"}, so the total gap is 365 × ${n} + ${leapCount} = ${totalDays} days.`,
          `${totalDays} ÷ 7 leaves remainder ${shift}, so ${shift} day${shift === 1 ? "" : "s"} after ${startDay} is ${trueDay}.`] };
      },
      // (b) combines Jan→Feb weekday shift, the century leap exception, and last-occurrence-in-month
      () => {
        const boundary = pick([2100, 2200, 2300]);
        const jan1Idx = rand(0, 6); const jan1Day = DAYS[jan1Idx];
        const feb1Idx = (jan1Idx + 31) % 7; const feb1Day = DAYS[feb1Idx];
        const targetIdx = rand(0, 6); const targetDay = DAYS[targetIdx];
        const first = ((targetIdx - feb1Idx) % 7 + 7) % 7 + 1;
        const dates = []; for (let dte = first; dte <= 28; dte += 7) dates.push(dte);
        const last = dates[dates.length - 1];
        const datesIfWronglyLeap = []; for (let dte = first; dte <= 29; dte += 7) datesIfWronglyLeap.push(dte);
        const wrongLast = datesIfWronglyLeap[datesIfWronglyLeap.length - 1];
        const distractors = [wrongLast, last - 7, first].filter((v) => v >= 1 && v <= 29 && v !== last);
        const { options, correctIndex } = buildMC(last, distractors);
        return { q: `${boundary} is divisible by 4, but because it is a century year not divisible by 400 it is NOT a leap year, so February has only 28 days that year. 1 January ${boundary} falls on a ${jan1Day}. What is the date of the last ${targetDay} in February that year?`, options, correctIndex, solution: [
          `1 January is a ${jan1Day}. January always has 31 days, so 1 February is 31 days later: 31 ÷ 7 leaves remainder 3, so 1 February falls on a ${feb1Day}.`,
          `${boundary} fails the century rule (divisible by 4 but not by 400), so it is not a leap year and February has 28 days, not 29.`,
          `The first ${targetDay} in February falls on day ${first}, and every 7 days after that is another ${targetDay}: ${dates.join(", ")}.`,
          `Because February only runs to day 28 that year, day ${last} is the last ${targetDay} — a student who wrongly assumed a 29-day February would land on day ${wrongLast} instead.`] };
      },
      // (c) mirror of (a) but backwards in time, forcing the solver to work out the
      // correct leap-year range for a subtraction rather than an addition
      () => {
        const boundary = pick([2100, 2200, 2300]);
        const endOffset = rand(2, 5);
        const startOffset = rand(1, 4);
        const Yend = boundary + endOffset;
        const n = endOffset + startOffset;
        const Ystart = Yend - n;
        const mIdx = rand(2, 11);
        const mLenVal = MONTHS31.includes(mIdx + 1) ? 31 : 30;
        const day = rand(1, mLenVal);
        let leapCount = 0; const leapYears = [];
        for (let yy = Ystart + 1; yy <= Yend; yy++) { if (isLeap(yy)) { leapCount++; leapYears.push(yy); } }
        const totalDays = 365 * n + leapCount;
        const shift = totalDays % 7;
        const endIdx = rand(0, 6); const endDay = DAYS[endIdx];
        let trueIdx = (endIdx - shift) % 7; if (trueIdx < 0) trueIdx += 7;
        const trueDay = DAYS[trueIdx];
        const wrongShift = ((365 * n + leapCount + 1) % 7 + 7) % 7;
        let wrongIdx = (endIdx - wrongShift) % 7; if (wrongIdx < 0) wrongIdx += 7;
        const distractors = otherDays(trueIdx, [trueIdx - wrongIdx, 1, -1, 2]);
        const { options, correctIndex } = buildMCStr(trueDay, distractors);
        return { q: `${MONTH_NAMES[mIdx]} ${day} ${Yend} falls on a ${endDay}. What day of the week did ${MONTH_NAMES[mIdx]} ${day} fall on in ${Ystart}, ${n} years earlier?`, options, correctIndex, solution: [
          `Going back ${n} years covers ${365 * n} days if there were no leap years at all, plus one extra day for every 29 February crossed along the way.`,
          `Checking each year from ${Ystart + 1} to ${Yend} against the leap rule: ${boundary} looks like a leap year (divisible by 4) but is NOT, since it's a century year not divisible by 400${leapYears.length ? `; the genuine leap years in this span are ${leapYears.join(", ")}` : ", and in fact no year in this span is a leap year"}.`,
          `That's ${leapCount} extra day${leapCount === 1 ? "" : "s"}, so the total gap is 365 × ${n} + ${leapCount} = ${totalDays} days.`,
          `${totalDays} ÷ 7 leaves remainder ${shift}, and going backwards, ${shift} day${shift === 1 ? "" : "s"} before ${endDay} is ${trueDay}.`] };
      },
    ];

    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.calendar(d);
  },
```
