// Reads Ninefold Orchard battle UI PNGs and writes kq-9fo-ui-art.js.
// Run: node scripts/embed_9fo_ui.cjs
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const BASE = path.join(__dirname, "..", "Joey Assets", "9FO");
const OUT = path.join(__dirname, "..", "kq-9fo-ui-art.js");

async function webp(filename, w, h, quality = 85, fit = "inside") {
  const p = path.join(BASE, filename);
  const buf = await sharp(p)
    .resize(w, h, { fit, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toBuffer();
  const kb = (buf.length / 1024).toFixed(0);
  process.stdout.write(`  ${filename.padEnd(44)} -> ${w}x${h} WebP q${quality}: ${kb} KB\n`);
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function webpTrim(filename, w, h, quality = 88) {
  const p = path.join(BASE, filename);
  const buf = await sharp(p)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality, effort: 4 })
    .toBuffer();
  const kb = (buf.length / 1024).toFixed(0);
  process.stdout.write(`  ${filename.padEnd(44)} -> trimmed ${w}x${h} WebP q${quality}: ${kb} KB\n`);
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function jpeg(filename, w, h, quality = 78) {
  const p = path.join(BASE, filename);
  const buf = await sharp(p)
    .resize(w, h, { fit: "cover" })
    .jpeg({ quality })
    .toBuffer();
  const kb = (buf.length / 1024).toFixed(0);
  process.stdout.write(`  ${filename.padEnd(44)} -> ${w}x${h} JPEG q${quality}: ${kb} KB\n`);
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function main() {
  const art = {};

  console.log("\n--- Lane labels (normal) ---");
  art.laneArith     = await webp("9f Arithmatic.png",    240, 100);
  art.laneGeo       = await webp("9f Geometry.png",      240, 100);
  art.laneLogic     = await webp("9f Logic.png",         240, 100);
  art.laneSci       = await webp("9f Science.png",       240, 100);
  art.laneSpeed     = await webp("9f Speed.png",         240, 100);

  console.log("\n--- Lane labels (winning — teal glow) ---");
  art.laneArithWin  = await webp("9f arith win.png",     240, 100);
  art.laneGeoWin    = await webp("9f geo win.png",       240, 100);
  art.laneLogicWin  = await webp("9f logic win.png",     240, 100);
  art.laneSciWin    = await webp("9f  sci win.png",      240, 100);
  art.laneSpeedWin  = await webp("9f Speed win.png",     240, 100);

  console.log("\n--- Lane labels (losing — red glow) ---");
  art.laneArithLose = await webp("9f arith lose.png",    240, 100);
  art.laneGeoLose   = await webp("9f geo lose.png",      240, 100);
  art.laneLogicLose = await webp("9f Logic Lose.png",    240, 100);
  art.laneSciLose   = await webp("9f Sci Lose.png",      240, 100);
  art.laneSpeedLose = await webp("9f Speed Lose.png",    240, 100);

  console.log("\n--- Buttons ---");
  art.backBtn = await webp("9f Back.png", 240, 100);
  art.passBtn = await webp("9f Pass.png", 240, 100);
  art.okBtn = await webp("9f OK.png", 300, 100);
  art.cancelBtn = await webp("9f Cancel.png", 300, 100);

  console.log("\n--- Round tokens ---");
  art.wonRound  = await webpTrim("9f Won Round.png",  100, 100, 90);
  art.lostRound = await webpTrim("9f Lost Round.png", 100, 100, 90);

  console.log("\n--- Round banners ---");
  art.round1 = await webp("9f R1.png", 600, 280, 85);
  art.round2 = await webp("9f R2.png", 600, 280, 85);
  art.round3 = await webp("9f R3.png", 600, 280, 85);
  art.winBoard = await webpTrim("9f win board.png", 900, 620, 90);
  art.loseBoard = await webpTrim("9f lose board.png", 900, 620, 90);
  art.drawBoard = await webpTrim("9f draw board.png", 900, 620, 90);

  console.log("\n--- Game event overlays ---");
  art.mulligan  = await webp("9f Mulligan.png",  720, 320, 85);
  art.winning   = await webp("9f Winning.png",   520, 400, 88);
  art.challenge = await webp("9f Challenge.png", 520, 240, 85);
  art.reveal    = await webp("9f reveal.png",    420, 220, 85);
  art.friendly  = await webp("9f friendly.png",  420, 220, 85);

  console.log("\n--- Finale screens ---");
  art.winFinale  = await jpeg("9f win finale.png",  1024, 576, 80);
  art.loseFinale = await jpeg("9f lose finale.png", 1024, 576, 80);
  art.drawFinale = await jpeg("9f Draw Finale.png", 1024, 576, 80);

  console.log("\n--- Scoreboards ---");
  art.roundTracker = await webp("9f Scoreboard.png", 500, 320, 85);
  art.scoreFrame = await webp("Scoreboard.png", 140, 100, 88);
  art.deckPowers = await webp("9f Deck Powers.png", 340, 510, 85);
  art.deckPowersCompact = await webpTrim("9fo Deck Powers Compact Transparent.png", 420, 420, 90);
  // Never trim this asset: runtime marker coordinates use its fixed 724 × 2172 canvas.
  art.battleLedger = await webp("9fo Battle Ledger Transparent.png", 724, 2172, 90, "fill");
  art.ingenuity = await webpTrim("9fo Ingenuity.png", 520, 200, 90);
  art.setBonus = await webpTrim("9fo Set Bonus Compact Transparent.png", 520, 260, 90);
  art.joeyPortrait = await webpTrim("Joey Portrait Transparent.png", 420, 520, 90);

  console.log("\n--- Power indicators ---");
  art.powerUp   = await webpTrim("9f Power UP.png",   100, 100, 88);
  art.powerDown = await webpTrim("9f Power Down.png", 100, 100, 88);

  console.log("\n--- Card display ---");
  art.nameFrame = await webp("9f Name Frame.png", 280, 80, 88);

  console.log("\n--- Board overlay and general frame ---");
  art.playMat = await webp("9fo Play Mat.png", 1024, 576, 80, "fill");
  art.frame   = await webp("9f Frame.png",     1672, 941, 88, "fill");
  art.frame3  = await webp("9fo Frames 3.png", 1400, 1400, 90, "inside");

  const lines = [
    "// Generated by scripts/embed_9fo_ui.cjs — do not edit by hand.",
    "// Ninefold Orchard battle UI art: lane labels, buttons, round tokens, overlays.",
    "export const NFO_UI_ART = {",
    ...Object.entries(art).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`),
    "};",
  ];

  fs.writeFileSync(OUT, lines.join("\n"), "utf8");
  const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
  console.log(`\nWrote kq-9fo-ui-art.js (${sizeMB} MB)`);
}

main().catch(e => { console.error(e); process.exit(1); });
