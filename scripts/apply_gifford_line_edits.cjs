// Applies the Line Editor pass edits (one JSON file per chapter, produced by the
// per-chapter editing agents) back into content/intermediate-story.js.
// Safety: each edit's "before" text must appear in the chapter EXACTLY ONCE or the
// whole run aborts before writing anything — prevents silent corruption from a
// stale/non-unique anchor. Decodes the real JS array via Function(), edits the
// in-memory strings, then re-serialises with JSON.stringify (which produces a
// valid, correctly-escaped JS string literal) rather than touching the raw
// escaped source text directly.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const STORY_FILE = path.join(ROOT, "content", "intermediate-story.js");
const EDITS_DIR = path.join(process.env.TEMP || "/tmp", "gifford_chapters");

function loadStoryArray(src) {
  const m = src.match(/export const INTERMEDIATE_STORY = (\[[\s\S]*?\n\]);/);
  if (!m) throw new Error("Could not find INTERMEDIATE_STORY array literal");
  return { arr: Function("return " + m[1])(), fullMatch: m[0], literal: m[1] };
}

function main() {
  const src = fs.readFileSync(STORY_FILE, "utf8");
  const { arr, fullMatch } = loadStoryArray(src);

  const allEdits = []; // { n, before, after, rule, reason, chapterTitle }
  for (const ch of arr) {
    const p = path.join(EDITS_DIR, `ch${String(ch.n).padStart(2, "0")}_edits.json`);
    if (!fs.existsSync(p)) { console.warn(`No edits file for chapter ${ch.n} (${p}) — skipping.`); continue; }
    const edits = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const e of edits) allEdits.push({ n: ch.n, chapterTitle: ch.title, ...e });
  }

  console.log(`Loaded ${allEdits.length} proposed edits across ${arr.length} chapters.\n`);

  // Verification pass — abort entirely before writing anything if any edit is unsafe.
  let problems = 0;
  for (const e of allEdits) {
    const ch = arr.find((c) => c.n === e.n);
    if (!ch) { console.error(`Chapter ${e.n} not found for edit: ${e.before.slice(0, 60)}...`); problems++; continue; }
    const count = ch.text.split(e.before).length - 1;
    if (count === 0) { console.error(`Ch${e.n}: BEFORE-TEXT NOT FOUND: "${e.before.slice(0, 80)}..."`); problems++; }
    else if (count > 1) { console.error(`Ch${e.n}: BEFORE-TEXT NOT UNIQUE (${count} matches): "${e.before.slice(0, 80)}..."`); problems++; }
  }
  if (problems > 0) {
    console.error(`\n${problems} problem(s) found — aborting without writing anything. Fix the offending edit(s) and re-run.`);
    process.exit(1);
  }
  console.log("All edits verified unique — applying.\n");

  const counts = {};
  for (const e of allEdits) {
    const ch = arr.find((c) => c.n === e.n);
    ch.text = ch.text.replace(e.before, e.after);
    counts[e.n] = (counts[e.n] || 0) + 1;
    console.log(`  ch${e.n} [${e.rule}]: ${e.reason || ""}`);
  }
  console.log("\nPer-chapter edit counts:", counts);

  // Re-serialise the whole array, preserving field order and formatting style.
  const newLiteral = "[\n" + arr.map((c) =>
    `  { n: ${c.n}, title: ${JSON.stringify(c.title)}, text: ${JSON.stringify(c.text)} },`
  ).join("\n") + "\n]";
  const newSrc = src.replace(fullMatch, `export const INTERMEDIATE_STORY = ${newLiteral};`);
  fs.writeFileSync(STORY_FILE, newSrc, "utf8");
  console.log(`\nWrote ${allEdits.length} edits into ${STORY_FILE}`);
}

main();
