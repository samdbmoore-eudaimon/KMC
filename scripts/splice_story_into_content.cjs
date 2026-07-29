// One-off: replaces the placeholder PRIMARY_STORY require() line in kq-content.js
// with the actual array literal from primary_story_array.json.txt.
"use strict";
const fs = require("fs");
const path = require("path");

const contentPath = path.join(__dirname, "..", "kq-content.js");
const storyPath = path.join(__dirname, "..", "primary_story_array.json.txt");

const arrayLiteral = fs.readFileSync(storyPath, "utf8").trim();
let content = fs.readFileSync(contentPath, "utf8");

const needle = 'const PRIMARY_STORY = require("./primary_story_array.json.txt");';
if (!content.includes(needle)) {
  console.error("Needle not found, aborting.");
  process.exit(1);
}

content = content.replace(needle, `const PRIMARY_STORY = ${arrayLiteral};`);
fs.writeFileSync(contentPath, content);
console.log("Spliced", arrayLiteral.length, "chars into kq-content.js");
