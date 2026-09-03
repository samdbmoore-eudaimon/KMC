"use strict";
const fs   = require("fs");
const path = require("path");

const SRC  = path.join(__dirname, "..", "kq-art.js");
const OUT  = path.join(__dirname, "..", "card_art", "little_reckoning_cards");
fs.mkdirSync(OUT, { recursive: true });

const src = fs.readFileSync(SRC, "utf8");

// Junior card IDs (inside CARD_ART object literal)
const JUNIOR_IDS = [
  "addy","countra","tritip","cubble","hunchik","sparkfin","zoomby","pebble",
  "loopy","burrowl","squarby","frostcal","multimoo","anglorap","owlgorith",
  "flaskfox","cheetawat","fractail","hexabug","voltbird","probear","seqviper",
  "primearch","geodrake","paradox","quantakit","sphinxa","novabear",
  "infinitus","euclidon",
];

// Boss art keys 1-10 with actual names
const BOSS_IDS = [
  { n: 1,  name: "the_first_smudge" },
  { n: 2,  name: "sister_roughly" },
  { n: 3,  name: "the_baron_of_backwards" },
  { n: 4,  name: "the_forgetting_fog" },
  { n: 5,  name: "general_guesswork" },
  { n: 6,  name: "the_unshape" },
  { n: 7,  name: "the_countless" },
  { n: 8,  name: "madam_nought" },
  { n: 9,  name: "the_almost" },
  { n: 10, name: "the_muddle_king" },
];

let saved = 0;

function extractAndSave(key, filename) {
  // Match:  key: "data:image/TYPE;base64,DATA"
  // key may be numeric or a word
  const re = new RegExp(String.raw`\b${key}\s*:\s*"(data:image\/(\w+);base64,([^"]+))"`, "s");
  const m = src.match(re);
  if (!m) { console.warn(`  MISSING: ${key}`); return; }
  const ext  = m[2] === "jpeg" ? "jpg" : m[2];
  const buf  = Buffer.from(m[3], "base64");
  const dest = path.join(OUT, `${filename}.${ext}`);
  fs.writeFileSync(dest, buf);
  console.log(`  ${filename}.${ext}  (${(buf.length/1024).toFixed(0)} KB)`);
  saved++;
}

console.log("\n=== Card art ===");
for (const id of JUNIOR_IDS) extractAndSave(id, id);

console.log("\n=== Boss art ===");
for (const { n, name } of BOSS_IDS) extractAndSave(n, name);

console.log(`\nDone — ${saved} files written to card_art/little_reckoning_cards/`);
