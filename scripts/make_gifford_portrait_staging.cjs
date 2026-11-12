"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "card_art", "gifford_cards", "original-dark-masters");
const OUT_DIR = path.join(ROOT, "card_art", "gifford_cards", "portrait-staging");
const WIDTH = 896;
const HEIGHT = 1232;
const SOURCE_TOP = 277;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const requested = process.argv.slice(2);
  if (!requested.length) throw new Error("Pass one or more source names without .png");
  for (const name of requested) {
    const source = path.join(SOURCE_DIR, `${name}.png`);
    if (!fs.existsSync(source)) throw new Error(`Missing ${source}`);
    const sharpSquare = await sharp(source).resize(WIDTH, WIDTH, { fit: "fill" }).png().toBuffer();
    const background = await sharp(source).resize(WIDTH, HEIGHT, { fit: "cover" }).blur(28).modulate({ brightness: 0.7 }).png().toBuffer();
    const output = path.join(OUT_DIR, `${name}.png`);
    await sharp(background).composite([{ input: sharpSquare, left: 0, top: SOURCE_TOP }]).png().toFile(output);
    console.log(output);
  }
}
main().catch(error => { console.error(error); process.exit(1); });
