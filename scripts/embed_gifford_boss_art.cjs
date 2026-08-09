// Resizes/compresses the 10 Gifford (Intermediate) boss portraits down to 512x512 JPEG
// and writes them into the INTERMEDIATE_BOSS_ART stub declared in KangarooMathsQuest.jsx
// (currently `const INTERMEDIATE_BOSS_ART = {};`), keyed 1-10 by boss.n — same pattern as
// scripts/embed_boss_art.cjs used for PRIMARY_BOSS_ART.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ART_DIR = path.join(__dirname, "..", "card_art", "gifford_cards");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

const FILE_TO_N = {
  "Boss1": 1,
  "Boss2": 2,
  "Boss3": 3,
  "Boss4": 4,
  "Boss5": 5,
  "Boss6": 6,
  "Whistles Price": 7,
  "Boss8": 8,
  "Boss 9 Chacellors Ledger": 9,
  "Boss10TheEnginesAnswer": 10,
};

async function main() {
  const files = fs.readdirSync(ART_DIR).filter((f) => f.endsWith(".png"));
  const entries = [];
  let totalIn = 0, totalOut = 0, matched = 0;
  for (const file of files) {
    const base = file.replace(/\.png$/, "");
    const n = FILE_TO_N[base];
    if (!n) continue; // collectible-card images handled by embed_gifford_card_art.cjs
    matched++;
    const inPath = path.join(ART_DIR, file);
    const inSize = fs.statSync(inPath).size;
    totalIn += inSize;
    const outBuf = await sharp(inPath).resize(512, 512, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    totalOut += outBuf.length;
    entries.push({ n, line: `  ${n}: "data:image/jpeg;base64,${outBuf.toString("base64")}",` });
    console.log(`  n=${n} (${base}): ${(inSize / 1024).toFixed(0)}KB -> ${(outBuf.length / 1024).toFixed(0)}KB`);
  }
  if (matched !== 10) { console.error(`Expected 10 matched boss images, got ${matched}. Aborting without writing.`); process.exit(1); }
  console.log(`\nTotal: ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB`);

  entries.sort((a, b) => a.n - b.n);

  let src = fs.readFileSync(JSX, "utf8");
  const needle = "const INTERMEDIATE_BOSS_ART = {};";
  if (!src.includes(needle)) { console.error("Needle not found in KangarooMathsQuest.jsx"); process.exit(1); }
  const replacement = "const INTERMEDIATE_BOSS_ART = {\n" + entries.map((e) => e.line).join("\n") + "\n};";
  src = src.replace(needle, replacement);
  fs.writeFileSync(JSX, src, "utf8");
  console.log("Wrote 10 entries into INTERMEDIATE_BOSS_ART in KangarooMathsQuest.jsx");
}

main().catch((e) => { console.error(e); process.exit(1); });
