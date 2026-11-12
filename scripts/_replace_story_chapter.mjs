// One-off maintenance helper for the Gifford developmental edit pass.
// Usage: node scripts/_replace_story_chapter.mjs <chapterNumber> <newTextFilePath>
import fs from "fs";

const chapterNum = Number(process.argv[2]);
const newTextPath = process.argv[3];
const srcPath = "content/intermediate-story.js";

const src = fs.readFileSync(srcPath, "utf8");
const newText = fs.readFileSync(newTextPath, "utf8").replace(/\r\n/g, "\n").trimEnd();

const startMarker = `{ n: ${chapterNum}, title: "`;
const startIdx = src.indexOf(startMarker);
if (startIdx === -1) throw new Error(`chapter ${chapterNum} start marker not found`);

// title runs up to the first `", text: "`
const afterTitle = src.indexOf('", text: "', startIdx);
if (afterTitle === -1) throw new Error("could not find text field start");
const title = src.slice(startIdx + startMarker.length, afterTitle);
const textFieldStart = afterTitle + '", text: "'.length;

// find the start of the next chapter object (or end of array) to bound the search
const nextMarker = `{ n: ${chapterNum + 1},`;
let boundIdx = src.indexOf(nextMarker, textFieldStart);
if (boundIdx === -1) boundIdx = src.indexOf("\n];", textFieldStart);
if (boundIdx === -1) throw new Error("could not find bound for chapter end");

// the closing of this chapter object is the last `" },` before boundIdx
const closeMarker = '" },';
const closeIdx = src.lastIndexOf(closeMarker, boundIdx);
if (closeIdx === -1 || closeIdx < textFieldStart) throw new Error("could not find chapter close marker");

const oldTextRaw = src.slice(textFieldStart, closeIdx);
const oldTextDecoded = JSON.parse('"' + oldTextRaw + '"');

console.log(`Chapter ${chapterNum}: "${title}"`);
console.log("Old text: ", oldTextDecoded.trim().split(/\s+/).length, "words");
console.log("New text: ", newText.trim().split(/\s+/).length, "words");
console.log("Old starts:", JSON.stringify(oldTextDecoded.slice(0, 60)));
console.log("Old ends:  ", JSON.stringify(oldTextDecoded.slice(-60)));
console.log("New starts:", JSON.stringify(newText.slice(0, 60)));
console.log("New ends:  ", JSON.stringify(newText.slice(-60)));

if (process.argv[4] === "--write") {
  const newTextRaw = JSON.stringify(newText).slice(1, -1); // strip JSON.stringify's own quotes
  const newSrc = src.slice(0, textFieldStart) + newTextRaw + src.slice(closeIdx);
  fs.writeFileSync(srcPath, newSrc, "utf8");
  console.log("WROTE chapter", chapterNum);
} else {
  console.log("(dry run — pass --write to commit)");
}
