// Adds okBtn, cancelBtn, deckPowers keys to the existing kq-joey-art.js
// without touching the already-embedded background/overlay/placeholder data.
// Run once: node scripts/patch_deck_builder_art.cjs
"use strict";
const fs   = require("fs");
const path = require("path");
const sharp = require("sharp");

const ASSETS = path.join(__dirname, "..", "Joey Assets");
const OUT    = path.join(__dirname, "..", "kq-joey-art.js");

const NEW_FILES = {
  okBtn: {
    primary:      "9FO/9f OK.png",
    junior:       "LR/LR OK",
    intermediate: "Gifford/GF OK.png",
  },
  cancelBtn: {
    primary:      "9FO/9f Cancel.png",
    junior:       "LR/LR Cancel",
    intermediate: "Gifford/GF Cancel.png",
  },
  deckPowers: {
    primary:      "9FO/9f Deck Powers.png",
    junior:       "LR/LR Deck Powers.png",
    intermediate: "Gifford/GF Deck Pow.png",
  },
  // Power UP icon (sits inside the AFF/MST circle slots)
  powerUp: {
    primary:      "9FO/9f Power UP.png",
    junior:       "LR/LR Power UP.png",
    intermediate: "LR/LR Power UP.png",   // GF has none — borrow LR
  },
};

async function toWebpDataUri(file, w, h, quality) {
  const p = path.join(ASSETS, file);
  const buf = await sharp(p).resize(w, h, { fit: "inside" }).webp({ quality, effort: 4 }).toBuffer();
  const kb = (buf.length / 1024).toFixed(0);
  console.log(`  ${file} -> ${w}x${h} WebP q${quality}: ${kb} KB`);
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  const mods = ["primary", "junior", "intermediate"];
  const newData = { primary: {}, junior: {}, intermediate: {} };

  for (const [key, files] of Object.entries(NEW_FILES)) {
    const label = key === "okBtn" ? "OK buttons" : key === "cancelBtn" ? "Cancel buttons" : "Deck Powers frames";
    const [w, h, q] = key === "deckPowers" ? [600, 900, 80] : key === "powerUp" ? [200, 200, 85] : [400, 160, 85];
    console.log(`\n--- ${label} (${w}x${h} WebP, alpha) ---`);
    for (const m of mods) {
      newData[m][key] = await toWebpDataUri(files[m], w, h, q);
    }
  }

  // Read existing file
  let src = fs.readFileSync(OUT, "utf8");

  // For each module, find the closing `  },` of that module's block and insert new keys before it.
  // The blocks look like:  primary: {\n    ...\n  },
  for (const m of mods) {
    const insertLines = Object.entries(newData[m])
      .map(([k, v]) => `    ${k}: "${v}",`)
      .join("\n");

    // Remove any existing okBtn/cancelBtn/deckPowers lines for this module to stay idempotent.
    src = src.replace(new RegExp(`    (okBtn|cancelBtn|deckPowers): "data:[^"]*",\n`, "g"), "");

    // Find the position of `  },` that closes this module's block.
    // Strategy: find `  ${m}: {` then scan forward for the matching `  },`
    const blockStart = src.indexOf(`  ${m}: {`);
    if (blockStart === -1) { console.error(`Could not find block for module ${m}`); process.exit(1); }
    // Find closing `  },` after blockStart
    const closeIdx = src.indexOf("\n  },", blockStart);
    if (closeIdx === -1) { console.error(`Could not find closing },  for module ${m}`); process.exit(1); }
    src = src.slice(0, closeIdx) + "\n" + insertLines + src.slice(closeIdx);
  }

  // Update the first comment line
  src = src.replace(
    "// Joey battle arena backgrounds, UI overlays, placeholder card art, and card frames.",
    "// Joey battle arena backgrounds, UI overlays, placeholder card art, card frames, and deck builder UI."
  );

  fs.writeFileSync(OUT, src, "utf8");
  const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
  console.log(`\nPatched kq-joey-art.js (${sizeMB} MB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
