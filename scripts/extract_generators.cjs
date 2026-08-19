// Extracts the exact current source text of named generator functions (and their
// CONCEPTS entry, if any) from KangarooMathsQuest.jsx, for handing to a rewrite agent.
// Usage: node scripts/extract_generators.cjs <CONCEPTS_VAR_NAME> <key1> <key2> ... > batch.txt
"use strict";
const fs = require("fs");
const path = require("path");

const JSX = path.join("C:/Users/samdb/UKMT App", "KangarooMathsQuest.jsx");
const src = fs.readFileSync(JSX, "utf-8");

function extractFunction(key) {
  const re = new RegExp(`\\n  ${key}\\((?:d)?\\) \\{`);
  const m = re.exec(src);
  if (!m) return null;
  const start = m.index + 1; // skip leading \n
  let i = src.indexOf("{", m.index);
  let depth = 1; i++;
  while (depth > 0 && i < src.length) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") depth--;
    i++;
  }
  return src.slice(start, i);
}

function extractObjectEntry(varName, key) {
  const re = new RegExp(`const ${varName} = \\{`);
  const m = re.exec(src);
  if (!m) return null;
  const entryRe = new RegExp(`\\n  ${key}: \\{`);
  const em = entryRe.exec(src);
  if (!em || em.index < m.index) return null;
  let i = src.indexOf("{", em.index);
  let depth = 1; i++;
  while (depth > 0 && i < src.length) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") depth--;
    i++;
  }
  return src.slice(em.index + 1, i) + (src[i] === "," ? "," : "");
}

const [, , conceptsVar, ...keys] = process.argv;
for (const key of keys) {
  const fn = extractFunction(key);
  const concept = extractObjectEntry(conceptsVar, key);
  console.log(`\n\n===== TOPIC: ${key} =====`);
  console.log("--- existing CONCEPTS entry (if any; reference for the topic's general idea) ---");
  console.log(concept || "(none)");
  console.log("--- current generator function (exact source, to be rewritten in place) ---");
  console.log(fn || "!!! NOT FOUND !!!");
}
