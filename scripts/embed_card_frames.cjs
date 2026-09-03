// Embeds card frame PNGs and patches the cardFrame field into kq-joey-art.js.
// Run: node scripts/embed_card_frames.cjs
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ASSETS = path.join(__dirname, "..", "Joey Assets");
const OUT = path.join(__dirname, "..", "kq-joey-art.js");

// Card frame files per module (null = no frame yet, CSS-only in UI)
const FRAMES = {
  primary:      "9FO/9f Card Frame.png",
  junior:       null,
  intermediate: null,
};

async function toWebpDataUri(file, w, h, quality) {
  const p = path.join(ASSETS, file);
  const buf = await sharp(p).resize(w, h, { fit: "fill" }).webp({ quality, effort: 4 }).toBuffer();
  const kb = (buf.length / 1024).toFixed(0);
  console.log(`  ${file} -> ${w}x${h} WebP q${quality}: ${kb} KB`);
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  let src = fs.readFileSync(OUT, "utf8");

  for (const [mod, file] of Object.entries(FRAMES)) {
    let value;
    if (file) {
      console.log(`\nEmbedding ${mod} card frame...`);
      value = await toWebpDataUri(file, 240, 360, 80);
    } else {
      value = null;
    }

    const valueStr = value ? `"${value}"` : "null";

    // If cardFrame already exists for this module, replace it
    const replaceRe = new RegExp(
      `(  ${mod}: \\{[^}]*?)    cardFrame: (?:"[^"]*"|null),`,
      "s"
    );
    if (replaceRe.test(src)) {
      src = src.replace(replaceRe, `$1    cardFrame: ${valueStr},`);
      console.log(`  Updated existing cardFrame for ${mod}`);
    } else {
      // Insert before the closing brace of this module's block
      const insertRe = new RegExp(
        `(  ${mod}: \\{[^}]*?)(  \\},)`,
        "s"
      );
      src = src.replace(insertRe, `$1    cardFrame: ${valueStr},\n$2`);
      console.log(`  Inserted cardFrame for ${mod}`);
    }
  }

  fs.writeFileSync(OUT, src, "utf8");
  const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
  console.log(`\nWrote kq-joey-art.js (${sizeMB} MB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
