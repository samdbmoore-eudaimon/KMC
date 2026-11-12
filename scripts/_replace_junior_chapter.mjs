// One-off maintenance helper for the Little Reckoning tension/danger pass.
// Usage: node scripts/_replace_junior_chapter.mjs <chapterNumber> <newTextFilePath> [--write]
import fs from "fs";

const chapterNum = Number(process.argv[2]);
const newTextPath = process.argv[3];
const srcPath = "content/junior-story.js";

const src = fs.readFileSync(srcPath, "utf8");
const lines = src.split("\n"); // keep \r on each line (CRLF), split on \n only

const nLineIdx = lines.findIndex(l => l.trim() === `"n": ${chapterNum},`);
if (nLineIdx === -1) throw new Error(`chapter ${chapterNum} not found`);

const titleLineIdx = nLineIdx + 1;
const textLineIdx = nLineIdx + 2;
if (!/^"text": /.test(lines[textLineIdx].trim())) {
  throw new Error(`expected text line at ${textLineIdx}, got: ${lines[textLineIdx].slice(0,60)}`);
}

const titleMatch = lines[titleLineIdx].match(/^"title": "(.*)",\r?$/);
const title = titleMatch ? titleMatch[1] : "(unknown)";

// decode the old text value from its JSON-escaped form (strip `"text": ` prefix and trailing `,`)
const oldLineTrim = lines[textLineIdx].replace(/\r$/, "");
const oldValueRaw = oldLineTrim.replace(/^"text": /, "").replace(/,$/, "");
const oldText = JSON.parse(oldValueRaw);

const newText = fs.readFileSync(newTextPath, "utf8").replace(/\r\n/g, "\n").trimEnd();
// strip a leading "TITLE: ..." line + blank line if present (artifact of the dump script)
const newTextBody = newText.replace(/^TITLE: .*\n\n/, "");

console.log(`Chapter ${chapterNum}: "${title}"`);
console.log("Old text:", oldText.trim().split(/\s+/).length, "words");
console.log("New text:", newTextBody.trim().split(/\s+/).length, "words");
console.log("Old starts:", JSON.stringify(oldText.slice(0, 60)));
console.log("New starts:", JSON.stringify(newTextBody.slice(0, 60)));
console.log("Old ends:  ", JSON.stringify(oldText.slice(-60)));
console.log("New ends:  ", JSON.stringify(newTextBody.slice(-60)));

if (process.argv[4] === "--write") {
  const newLine = `"text": ${JSON.stringify(newTextBody)},\r`;
  lines[textLineIdx] = newLine;
  fs.writeFileSync(srcPath, lines.join("\n"), "utf8");
  console.log("WROTE chapter", chapterNum);
} else {
  console.log("(dry run — pass --write to commit)");
}
