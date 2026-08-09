// Converts the 11 Gifford story chapters (card_art/Gifford_Story/*.md) into the
// INTERMEDIATE_STORY array shape used by kq-content.js's StoryText/StoryReader
// ({ n, title, text }, blank-line-separated paragraphs, "---" scene breaks,
// **bold**/*italic* inline, "**THE END**" sentinel for the true finale).
"use strict";
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "card_art", "Gifford_Story");
const OUT = path.join(__dirname, "..", "_gifford_story_generated.js");

const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11 };

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).sort();

const chapters = files.map((f) => {
  let raw = fs.readFileSync(path.join(DIR, f), "utf-8");
  // Strip the work title line.
  raw = raw.replace(/^#\s*GIFFORD\s*\n+/, "");
  // Extract and strip the chapter heading line "## Chapter <Word>: <Title>".
  const headMatch = raw.match(/^##\s*Chapter\s+(\w+):\s*(.+)\s*$/m);
  if (!headMatch) throw new Error(`No chapter heading found in ${f}`);
  const n = WORD_NUM[headMatch[1].toLowerCase()];
  if (!n) throw new Error(`Unrecognised chapter word "${headMatch[1]}" in ${f}`);
  const title = headMatch[2].trim();
  raw = raw.replace(headMatch[0], "");

  // Convert "### I. Rooke" style POV sub-headers into a bold standalone paragraph.
  raw = raw.replace(/^###\s*(.+)\s*$/gm, "**$1**");

  // Drop a leading lone "---" divider left right after the stripped heading.
  raw = raw.replace(/^\s*---\s*\n+/, "");

  // Normalise line endings and trim.
  let text = raw.replace(/\r\n/g, "\n").trim();

  if (n === 11) {
    // True finale: keep the author's own closing lines, then add the engine's
    // "**THE END**" sentinel for the special centred treatment.
    text += "\n\n**THE END**";
  }

  return { n, title, text };
});

chapters.sort((a, b) => a.n - b.n);
if (chapters.length !== 11 || chapters.some((c, i) => c.n !== i + 1)) {
  throw new Error("Expected exactly chapters 1-11 with no gaps, got: " + chapters.map((c) => c.n).join(","));
}

const body = chapters.map((c) => `  { n: ${c.n}, title: ${JSON.stringify(c.title)}, text: ${JSON.stringify(c.text)} },`).join("\n");
const out = `const INTERMEDIATE_STORY_TITLE = "Gifford";\nconst INTERMEDIATE_STORY = [\n${body}\n];\n`;
fs.writeFileSync(OUT, out, "utf-8");
console.log(`Wrote ${OUT} — ${chapters.length} chapters, ${out.length} bytes total.`);
chapters.forEach((c) => console.log(`  ch${c.n}: "${c.title}" (${c.text.length} chars)`));
