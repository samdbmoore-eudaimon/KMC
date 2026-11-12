// Auto-generated player names — safeguarding measure (see CLAUDE.md "Progress / storage").
// Players never type their own display name: on a shared or school device a freely-typed
// name is very likely a child's real first name, and it used to double as the literal
// cross-device sync username (see sync.js generateSyncCode) pushed to an unauthenticated
// public endpoint. Every name is instead composed from these three fixed, curated,
// kid-safe word lists, so nothing identifying can ever be entered — similar to the
// name pickers used by TT Rockstars/Codespark.
const NAME_ADJECTIVES = [
  "Funky", "Bouncy", "Speedy", "Sparkly", "Wobbly", "Zippy", "Cheeky", "Fuzzy", "Giggly",
  "Brave", "Sneaky", "Jolly", "Mighty", "Silly", "Breezy", "Clever", "Daring", "Plucky",
  "Spunky", "Chirpy", "Nifty", "Wacky", "Dazzling", "Glowing", "Snazzy", "Rowdy", "Perky",
  "Zesty", "Curious", "Nimble",
];
const NAME_COLOURS = [
  "Blue", "Red", "Green", "Purple", "Orange", "Yellow", "Pink", "Silver", "Golden", "Teal",
  "Turquoise", "Crimson", "Violet", "Amber", "Emerald", "Coral", "Indigo", "Scarlet", "Lime",
  "Copper", "Bronze", "Jade", "Ruby", "Sapphire", "Ivory",
];
const NAME_NOUNS = [
  "Banana", "Badger", "Otter", "Penguin", "Dolphin", "Rocket", "Comet", "Falcon", "Panda",
  "Tiger", "Dragon", "Wizard", "Ninja", "Robot", "Unicorn", "Phoenix", "Koala", "Wombat",
  "Meerkat", "Hedgehog", "Narwhal", "Walrus", "Puffin", "Gecko", "Yak", "Lemur", "Toucan",
  "Beaver", "Platypus", "Wallaby",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Two words (colour + noun) since 2026-09-13 — shorter than the original three-word
// scheme below, which is kept only so isSafeDisplayName still recognises names it
// generated before this change.
export function randomDisplayName() {
  return `${pick(NAME_COLOURS)} ${pick(NAME_NOUNS)}`;
}

// True for a name this module could itself have generated, either the current
// two-word scheme or the original three-word one (NAME_ADJECTIVES exists only for
// this check now) — used to spot a legacy freely-typed name (which may be a real
// one) still needing the one-time safe rename.
export function isSafeDisplayName(name) {
  const parts = String(name || "").trim().split(/\s+/);
  if (parts.length === 2) return NAME_COLOURS.includes(parts[0]) && NAME_NOUNS.includes(parts[1]);
  if (parts.length === 3) return NAME_ADJECTIVES.includes(parts[0]) && NAME_COLOURS.includes(parts[1]) && NAME_NOUNS.includes(parts[2]);
  return false;
}
