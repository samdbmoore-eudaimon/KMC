// One-off: converts story_draft_primary.md into the JUNIOR_STORY-shaped JS array
// literal for PRIMARY_STORY. Prints the array literal to stdout; caller pastes
// it into kq-content.js. Non-mutating.
"use strict";
const fs = require("fs");
const path = require("path");

const md = fs.readFileSync(path.join(__dirname, "..", "story_draft_primary.md"), "utf8");

// Split on chapter headers "## Chapter <Word>: <Title>"
const chapterRe = /^## Chapter (\w+): (.+)$/gm;
const matches = [...md.matchAll(chapterRe)];

const WORD_TO_NUM = {
  One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine: 9, Ten: 10, Eleven: 11,
};

const chapters = [];
for (let i = 0; i < matches.length; i++) {
  const m = matches[i];
  const n = WORD_TO_NUM[m[1]];
  const title = m[2].trim();
  const start = m.index + m[0].length;
  const end = i + 1 < matches.length ? matches[i + 1].index : md.length;
  let body = md.slice(start, end).trim();
  // Strip the trailing "*Boss: ...*" line (kept separately, not part of reader-facing prose)
  const bossMatch = body.match(/\n*\*Boss:.*\*\s*$/s);
  let bossLine = null;
  if (bossMatch) {
    bossLine = bossMatch[0].trim().replace(/^\*|\*$/g, "");
    body = body.slice(0, bossMatch.index).trim();
  }
  // Strip any stray markdown "---" divider left at the end of the body
  body = body.replace(/\n*-{3,}\s*$/, "").trim();
  chapters.push({ n, title, body, bossLine });
}

console.log(`Found ${chapters.length} chapters.`);
for (const c of chapters) {
  console.log(`  ${c.n}. ${c.title} (${c.body.length} chars)${c.bossLine ? " [boss: " + c.bossLine.slice(0, 40) + "...]" : " [no boss]"}`);
}

const arrLiteral = "[\n" + chapters.map((c) => {
  const obj = { n: c.n, title: c.title, text: c.body };
  return JSON.stringify(obj);
}).join(",\n") + "\n]";

fs.writeFileSync(path.join(__dirname, "..", "primary_story_array.json.txt"), arrLiteral);
console.log("\nWrote primary_story_array.json.txt");
