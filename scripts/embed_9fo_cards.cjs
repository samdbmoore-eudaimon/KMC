// Reads pre-composited 9FO card PNGs, compresses to WebP, writes kq-9fo-card-art.js.
// Run: node scripts/embed_9fo_cards.cjs
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ART_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard");
const OUT = path.join(__dirname, "..", "kq-9fo-card-art.js");

// card ID -> { base: filename, upgraded: filename|null }
// Cards with adventures have _a (base) and _b (upgraded) versions.
// Rares/epics/legendaries/bosses have a single composited file.
const CARD_MAP = [
  // Commons (with adventures)
  { id: "pip",          base: "9f_Pip_a.png",          upgraded: "9f_Pip_b.png" },
  { id: "nine",         base: "9f_Nine_a.png",          upgraded: "9f_Nine_b.png" },
  { id: "bramble",      base: "9f_Bramble_a.png",        upgraded: "9f_Bramble_b.png" },
  { id: "sorrel",       base: "9f_Sorrel_a.png",         upgraded: "9f_Sorrel_b.png" },
  { id: "russet",       base: "9f_Russet_a.png",         upgraded: "9f_Russet_b.png" },
  { id: "halfpenny",    base: "9f_Halfpenny_a.png",      upgraded: "9f_Halfpenny_b.png" },
  { id: "wicker",       base: "9f_Wicker_a.png",         upgraded: "9f_Wicker_b.png" },
  { id: "furrow",       base: "9f_Furrow_a.png",         upgraded: "9f_Furrow_b.png" },
  { id: "dapple",       base: "9f_Dapple_a.png",         upgraded: "9f_Dapple_b.png" },
  { id: "bushel",       base: "9f_Bushel_a.png",         upgraded: "9f_Bushel_b.png" },
  { id: "tuppence",     base: "9f_Tuppence_a.png",       upgraded: "9f_Tuppence_b.png" },
  { id: "windfall",     base: "9f_Windfall_a.png",       upgraded: "9f_Windfall_b.png" },
  // Uncommons (with adventures)
  { id: "cornix",       base: "9f_Cornix_a.png",         upgraded: "9f_Cornix_b.png" },
  { id: "thistlewick",  base: "9f_Thistlewick_a.png",    upgraded: "9f_Thistlewick_b.png" },
  { id: "beeswax",      base: "9f_Beeswax_a.png",        upgraded: "9f_Beeswax_b.png" },
  { id: "kernel",       base: "9f_Kernel_a.png",         upgraded: "9f_Kernel_b.png" },
  { id: "millrace",     base: "9f_Millrace_a.png",       upgraded: "9f_Millrace_b.png" },
  // Rares (single image)
  { id: "cobweb",       base: "9f_Cobweb.png",           upgraded: null },
  { id: "amberly",      base: "9f_Amberly.png",          upgraded: null },
  { id: "barrow",       base: "9f_Barrow.png",           upgraded: null },
  { id: "driftwood",    base: "9f_Driftwood.png",        upgraded: null },
  { id: "gable",        base: "9f_Gable.png",            upgraded: null },
  // Epics (single image)
  { id: "warden",       base: "9f_Warden.png",           upgraded: null },
  { id: "harvestmoon",  base: "9f_Harvestmoon.png",      upgraded: null },
  { id: "ninebark",     base: "9f_Ninebark.png",         upgraded: null },
  { id: "cascade",      base: "9f_Cascade.png",          upgraded: null },
  { id: "longshadow",   base: "9f_Longshadow.png",       upgraded: null },
  { id: "gossamer",     base: "9f_Gossamer.png",         upgraded: null },
  // Legendaries (single image)
  { id: "ninefoldtree",    base: "9f_The Ninefold Tree.png",    upgraded: null },
  { id: "tenthscarecrow",  base: "9f_The Tenth Scarecrow.png",  upgraded: null },
  // Bosses (single image each)
  { id: "boss_primary_1",  base: "9f_The First Crow.png",       upgraded: null },
  { id: "boss_primary_2",  base: "9f_Old Roughweather.png",     upgraded: null },
  { id: "boss_primary_3",  base: "9f_Widdershins.png",          upgraded: null },
  { id: "boss_primary_4",  base: "9f_Scratch.png",              upgraded: null },
  { id: "boss_primary_5",  base: "9f_The MaybeFlock.png",       upgraded: null },
  { id: "boss_primary_6",  base: "9f_Strawless.png",            upgraded: null },
  { id: "boss_primary_7",  base: "9f_The Murder.png",           upgraded: null },
  { id: "boss_primary_8",  base: "9f_Hollow Bough.png",         upgraded: null },
  { id: "boss_primary_9",  base: "9f_The Nearly.png",           upgraded: null },
  { id: "boss_primary_10", base: "9f_The First Scarecrow.png",  upgraded: null },
];

// Target size for battle hand display — portrait card ratio 5:7
const W = 240, H = 336, Q = 72;

const PORTRAIT_MAP = {
  pip: "01_common_Pip.png", nine: "02_common_Nine.png", bramble: "03_common_Bramble.png",
  sorrel: "04_common_Sorrel.png", russet: "05_common_Russet.png", halfpenny: "06_common_Halfpenny.png",
  wicker: "07_common_Wicker.png", furrow: "08_common_Furrow.png", dapple: "09_common_Dapple.png",
  bushel: "10_common_Bushel.png", tuppence: "11_common_Tuppence.png", windfall: "12_common_Windfall.png",
  cornix: "13_rare_Cornix.png", thistlewick: "14_rare_Thistlewick.png", beeswax: "15_rare_Beeswax.png",
  kernel: "16_rare_Kernel.png", millrace: "17_rare_Millrace.png", cobweb: "18_rare_Cobweb.png",
  amberly: "19_rare_Amberly.png", barrow: "20_rare_Barrow.png", driftwood: "21_rare_Driftwood.png",
  gable: "22_rare_Gable.png", warden: "23_epic_Warden.png", harvestmoon: "24_epic_Harvestmoon.png",
  ninebark: "25_epic_Ninebark.png", cascade: "26_epic_Cascade.png", longshadow: "27_epic_Longshadow.png",
  gossamer: "28_epic_Gossamer.png", ninefoldtree: "29_legendary_NinefoldTree.png",
  tenthscarecrow: "30_legendary_TenthScarecrow.png",
  boss_primary_1: "01_The_First_Crow.png", boss_primary_2: "02_Old_Roughweather.png",
  boss_primary_3: "03_Widdershins.png", boss_primary_4: "04_Scratch.png",
  boss_primary_5: "05_The_Maybe-Flock.png", boss_primary_6: "06_Strawless.png",
  boss_primary_7: "07_The_Murder.png", boss_primary_8: "08_Hollow_Bough.png",
  boss_primary_9: "09_The_Nearly.png", boss_primary_10: "10_The_First_Scarecrow.png",
};

async function encodeFile(filename) {
  const p = path.join(ART_DIR, filename);
  const buf = await sharp(p)
    .resize(W, H, { fit: "fill" })
    .webp({ quality: Q, effort: 4 })
    .toBuffer();
  const kb = (buf.length / 1024).toFixed(0);
  process.stdout.write(`  ${filename.padEnd(40)} -> ${kb} KB\n`);
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function encodePortrait(filename) {
  const buf = await sharp(path.join(ART_DIR, filename))
    .resize(360, 420, { fit: "cover", position: "centre" })
    .webp({ quality: 76, effort: 4 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  const entries = [];
  const portraitEntries = [];
  let totalKB = 0;

  for (const card of CARD_MAP) {
    const baseUri = await encodeFile(card.base);
    totalKB += Buffer.from(baseUri.split(",")[1], "base64").length / 1024;
    entries.push(`  ${JSON.stringify(card.id)}: ${JSON.stringify(baseUri)},`);

    if (card.upgraded) {
      const upgUri = await encodeFile(card.upgraded);
      totalKB += Buffer.from(upgUri.split(",")[1], "base64").length / 1024;
      entries.push(`  ${JSON.stringify(card.id + "_upgraded")}: ${JSON.stringify(upgUri)},`);
    }
  }

  for (const [id, filename] of Object.entries(PORTRAIT_MAP)) {
    portraitEntries.push(`  ${JSON.stringify(id)}: ${JSON.stringify(await encodePortrait(filename))},`);
  }

  const lines = [
    "// Generated by scripts/embed_9fo_cards.cjs — do not edit by hand.",
    "// Pre-composited Ninefold Orchard card art keyed by card ID.",
    "// Cards with adventures have an additional '[id]_upgraded' key for the post-adventure version.",
    "export const NFO_CARD_ART = {",
    ...entries,
    "};",
    "export const NFO_CHARACTER_ART = {",
    ...portraitEntries,
    "};",
  ];

  fs.writeFileSync(OUT, lines.join("\n"), "utf8");
  const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
  console.log(`\nWrote kq-9fo-card-art.js (${sizeMB} MB, ~${Math.round(totalKB)} KB of image data)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
