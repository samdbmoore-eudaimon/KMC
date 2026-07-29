// One-off: resizes/compresses the 10 generated Ninefold Orchard boss portraits down
// to 512x512 JPEG (matching Junior's BOSS_ART convention, keyed 1-10 by boss.n) and
// appends the entries directly into the PRIMARY_BOSS_ART stub declared in
// KangarooMathsQuest.jsx (currently `const PRIMARY_BOSS_ART = {};`).
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ART_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_bosses");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

const FILE_TO_N = {
  "01_The_First_Crow": 1,
  "02_Old_Roughweather": 2,
  "03_Widdershins": 3,
  "04_Scratch": 4,
  "05_The_Maybe-Flock": 5,
  "06_Strawless": 6,
  "07_The_Murder": 7,
  "08_Hollow_Bough": 8,
  "09_The_Nearly": 9,
  "10_The_First_Scarecrow": 10,
};

async function main() {
  const files = fs.readdirSync(ART_DIR).filter((f) => f.endsWith(".png"));
  console.log(`Found ${files.length} boss PNGs.`);
  const entries = [];
  let totalIn = 0, totalOut = 0;
  for (const file of files) {
    const base = file.replace(/\.png$/, "");
    const n = FILE_TO_N[base];
    if (!n) { console.error("No n mapping for", file); continue; }
    const inPath = path.join(ART_DIR, file);
    const inSize = fs.statSync(inPath).size;
    totalIn += inSize;
    const outBuf = await sharp(inPath).resize(512, 512, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    totalOut += outBuf.length;
    entries.push(`  ${n}: "data:image/jpeg;base64,${outBuf.toString("base64")}",`);
    console.log(`  n=${n} (${base}): ${(inSize / 1024).toFixed(0)}KB -> ${(outBuf.length / 1024).toFixed(0)}KB`);
  }
  console.log(`\nTotal: ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB`);

  entries.sort((a, b) => {
    const na = parseInt(a.trim().split(":")[0], 10), nb = parseInt(b.trim().split(":")[0], 10);
    return na - nb;
  });

  let src = fs.readFileSync(JSX, "utf8");
  const needle = "const PRIMARY_BOSS_ART = {};";
  if (!src.includes(needle)) { console.error("Needle not found in KangarooMathsQuest.jsx"); process.exit(1); }
  const replacement = "const PRIMARY_BOSS_ART = {\n" + entries.join("\n") + "\n};";
  src = src.replace(needle, replacement);
  fs.writeFileSync(JSX, src, "utf8");
  console.log("Wrote 10 entries into PRIMARY_BOSS_ART in KangarooMathsQuest.jsx");
}

main().catch((e) => { console.error(e); process.exit(1); });
