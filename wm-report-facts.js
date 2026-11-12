// Content for the kid-facing Report tile (WallabyMaths.jsx ProgressReport): a stable
// "fact of the day" and a coaching-tip generator built from data ProgressReport
// already computes (weakest-topic mastery) — no backend involved, purely derived.

const MATHS_FACTS = [
  "111,111,111 × 111,111,111 = 12,345,678,987,654,321 — try it on a calculator!",
  "Zero is the only number that can't be written in Roman numerals.",
  "A 'googol' is 1 followed by 100 zeros — way bigger than the search engine's name!",
  "If you fold a piece of paper in half 42 times, it would be thick enough to reach the Moon.",
  "The equals sign (=) was invented in 1557 because the inventor was tired of writing 'is equal to'.",
  "Every square is a rectangle, but not every rectangle is a square.",
  "The word 'hundred' comes from an old word meaning 'ten times ten'.",
  "A pizza that has radius 'z' and height 'a' has a volume of pi × z × z × a.",
  "Multiplying two negative numbers always gives a positive answer.",
  "8 is the only cube number that's also one less than a square number (9).",
  "A 'leap year' happens because it takes Earth about 365.25 days to go round the Sun.",
  "Fibonacci numbers (1, 1, 2, 3, 5, 8, 13…) show up in sunflower seed spirals.",
  "The number pi (π) never ends and never repeats, however far you calculate it.",
  "There are more possible chess games than atoms in the observable universe.",
  "Ancient Egyptians used fractions, but almost always with a numerator of 1.",
  "A hexagon has 6 sides — bees build honeycomb from hexagons because they tile perfectly with no gaps.",
  "The abacus is one of the oldest calculating tools, used over 2,000 years ago.",
  "Any number multiplied by 9, its digits always add up to a multiple of 9 (e.g. 9×7=63, 6+3=9).",
  "A prime number has exactly two factors: 1 and itself. 2 is the only even prime.",
  "The symbol for infinity (∞) is called a 'lemniscate'.",
  "You can't divide by zero — it just isn't defined, however hard you try!",
  "A triangle's three angles always add up to 180 degrees, no matter its shape.",
  "The first calculator was called the 'Pascaline', built in 1642.",
  "Roman numerals have no symbol for zero at all.",
  "A palindrome number reads the same forwards and backwards, like 12321.",
  "The chances of shuffling a deck of cards into an order that's ever existed before are basically zero.",
  "Percent literally means 'per hundred' in Latin.",
  "A 'perfect number' equals the sum of its own factors (not counting itself) — 6 = 1+2+3.",
];

// Deterministic per-day pick so the "fact of the day" is stable across a session
// rather than reshuffling on every visit to the tile.
export function factOfTheDay(date = new Date()) {
  const dayIndex = Math.floor(date.getTime() / 86400000);
  return MATHS_FACTS[dayIndex % MATHS_FACTS.length];
}

const TIP_TEMPLATES = [
  "You're doing great overall — a few more questions on {topic} would round things out nicely.",
  "Your strongest topics are looking solid! Next time, give {topic} a bit of extra attention.",
  "Nice progress so far. {topic} looks like the topic with the most room to grow right now.",
  "Everything's coming along well — try the {topic} lesson next for an easy confidence boost.",
];

// `weakestTopicLabel` is the human-readable label of whichever topic this profile's
// own topicStats (already computed by ProgressReport) currently ranks lowest.
export function coachTip(weakestTopicLabel, date = new Date()) {
  if (!weakestTopicLabel) return "Keep playing to build up your topic map — every question you answer helps fill it in!";
  const dayIndex = Math.floor(date.getTime() / 86400000);
  const template = TIP_TEMPLATES[dayIndex % TIP_TEMPLATES.length];
  return template.replace("{topic}", weakestTopicLabel);
}
