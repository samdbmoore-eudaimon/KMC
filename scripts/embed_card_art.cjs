// One-off: resizes/compresses the 30 generated Ninefold Orchard card art PNGs
// (1024x1536, ~3MB each) down to 512x512 JPEG (matching Junior's CARD_ART
// convention) and appends CARD_ART.<id> = "data:..." assignment lines to
// kq-art.js, the same append-after-the-object pattern already used for LESSONS.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ART_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard");
const KQ_ART = path.join(__dirname, "..", "kq-art.js");

// filename prefix -> card id (must match PRIMARY_CARDS ids in KangarooMathsQuest.jsx)
const FILE_TO_ID = {
  "01_common_Pip": "pip",
  "02_common_Nine": "nine",
  "03_common_Bramble": "bramble",
  "04_common_Sorrel": "sorrel",
  "05_common_Russet": "russet",
  "06_common_Halfpenny": "halfpenny",
  "07_common_Wicker": "wicker",
  "08_common_Furrow": "furrow",
  "09_common_Dapple": "dapple",
  "10_common_Bushel": "bushel",
  "11_common_Tuppence": "tuppence",
  "12_common_Windfall": "windfall",
  "13_rare_Cornix": "cornix",
  "14_rare_Thistlewick": "thistlewick",
  "15_rare_Beeswax": "beeswax",
  "16_rare_Kernel": "kernel",
  "17_rare_Millrace": "millrace",
  "18_rare_Cobweb": "cobweb",
  "19_rare_Amberly": "amberly",
  "20_rare_Barrow": "barrow",
  "21_rare_Driftwood": "driftwood",
  "22_rare_Gable": "gable",
  "23_epic_Warden": "warden",
  "24_epic_Harvestmoon": "harvestmoon",
  "25_epic_Ninebark": "ninebark",
  "26_epic_Cascade": "cascade",
  "27_epic_Longshadow": "longshadow",
  "28_epic_Gossamer": "gossamer",
  "29_legendary_NinefoldTree": "ninefoldtree",
  "30_legendary_TenthScarecrow": "tenthscarecrow",
};

async function main() {
  const files = fs.readdirSync(ART_DIR).filter((f) => f.endsWith(".png"));
  console.log(`Found ${files.length} PNGs to process.`);
  const lines = [];
  let totalIn = 0, totalOut = 0;
  for (const file of files) {
    const base = file.replace(/\.png$/, "");
    const id = FILE_TO_ID[base];
    if (!id) { console.error("No id mapping for", file); continue; }
    const inPath = path.join(ART_DIR, file);
    const inSize = fs.statSync(inPath).size;
    totalIn += inSize;
    const outBuf = await sharp(inPath).resize(512, 512, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    totalOut += outBuf.length;
    const b64 = outBuf.toString("base64");
    lines.push(`CARD_ART.${id} = "data:image/jpeg;base64,${b64}";`);
    console.log(`  ${id}: ${(inSize / 1024).toFixed(0)}KB -> ${(outBuf.length / 1024).toFixed(0)}KB`);
  }
  console.log(`\nTotal: ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB`);

  const appendix = "\n\n// Primary (Ninefold Orchard) card art — resized to 512x512 JPEG from originals in card_art/ninefold_orchard/\n" + lines.join("\n") + "\n";
  fs.appendFileSync(KQ_ART, appendix);
  console.log("Appended", lines.length, "CARD_ART entries to kq-art.js");
}

main().catch((e) => { console.error(e); process.exit(1); });
