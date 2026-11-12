// One-time recovery script: decodes the restored (pre-brightening) embedded Gifford art out of
// wm-art.js / WallabyMaths.jsx and writes it back over the source PNGs in card_art/gifford_cards/.
// This is a recovery of last resort — brighten_gf_art.cjs overwrote those PNGs in place with no
// backup, and card_art/ is gitignored, so the only surviving copy of the pre-brightening pixels
// is the 512x512 JPEG that was already embedded in the last commit. Writing this back means the
// source masters are now capped at 512x512 (down from whatever the true original resolution
// was) — that resolution loss is real and permanent, but it's strictly better than leaving the
// masters in their brightened state, and it keeps future embed_gifford_*.cjs re-runs consistent.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const ART_DIR = path.join(ROOT, "card_art", "gifford_cards");

const FILE_TO_ID = {
  "Rooke": "gf_rooke", "Corvain": "gf_corvain", "Marrow": "gf_marrow", "Aldous": "gf_aldous",
  "TheEngine": "gf_theengine", "Prewitt": "gf_prewitt", "Vane": "gf_vane", "Ashcombe": "gf_ashcombe",
  "Thorncastle": "gf_thorncastle", "Halloway": "gf_halloway", "Kell": "gf_kell", "Tessa": "gf_tessa",
  "Kade": "gf_kade", "Bramwell": "gf_bramwell", "Adelina": "gf_adelina", "Whistle": "gf_whistle",
  "Fenn": "gf_fenn", "Delphine": "gf_delphine", "Growl": "gf_growl", "Pemberton": "gf_pemberton",
  "Maude": "gf_maude", "Tam Brindle": "gf_tambrindle", "Nettle": "gf_nettle", "Higgins": "gf_higgins",
  "Marta": "gf_marta", "Jory": "gf_jory", "Ratchet": "gf_ratchet", "Colworth": "gf_colworth",
  "Pip": "gf_pip", "Ada Voss": "gf_adavoss",
};
const FILE_TO_N = {
  "Boss1": 1, "Boss2": 2, "Boss3": 3, "Boss4": 4, "Boss5": 5, "Boss6": 6,
  "Whistles Price": 7, "Boss8": 8, "Boss 9 Chacellors Ledger": 9, "Boss10TheEnginesAnswer": 10,
};

function extractCardArtMap() {
  const src = fs.readFileSync(path.join(ROOT, "wm-art.js"), "utf8");
  const map = {};
  const re = /(gf_\w+)\s*=\s*"data:image\/jpeg;base64,([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) map[m[1]] = m[2];
  return map;
}
function extractBossArtMap() {
  const src = fs.readFileSync(path.join(ROOT, "WallabyMaths.jsx"), "utf8");
  const start = src.indexOf("const INTERMEDIATE_BOSS_ART = {");
  const end = src.indexOf("\n};", start);
  const block = src.slice(start, end);
  const map = {};
  const re = /(\d+):\s*"data:image\/jpeg;base64,([^"]+)"/g;
  let m;
  while ((m = re.exec(block))) map[Number(m[1])] = m[2];
  return map;
}

async function main() {
  const cardArt = extractCardArtMap();
  const bossArt = extractBossArtMap();
  console.log(`Found ${Object.keys(cardArt).length} card entries, ${Object.keys(bossArt).length} boss entries in the restored bundle.`);

  let written = 0;
  for (const [file, id] of Object.entries(FILE_TO_ID)) {
    const b64 = cardArt[id];
    if (!b64) { console.warn(`  MISSING embedded data for ${file} (${id}) — leaving PNG untouched`); continue; }
    const outPath = path.join(ART_DIR, `${file}.png`);
    const pngBuf = await sharp(Buffer.from(b64, "base64")).png().toBuffer();
    fs.writeFileSync(outPath, pngBuf);
    written++;
    console.log(`  restored ${file}.png (${(pngBuf.length / 1024).toFixed(0)}KB)`);
  }
  for (const [file, n] of Object.entries(FILE_TO_N)) {
    const b64 = bossArt[n];
    if (!b64) { console.warn(`  MISSING embedded data for ${file} (boss ${n}) — leaving PNG untouched`); continue; }
    const outPath = path.join(ART_DIR, `${file}.png`);
    const pngBuf = await sharp(Buffer.from(b64, "base64")).png().toBuffer();
    fs.writeFileSync(outPath, pngBuf);
    written++;
    console.log(`  restored ${file}.png (${(pngBuf.length / 1024).toFixed(0)}KB)`);
  }
  console.log(`\nRestored ${written}/40 source PNGs from the pre-brightening embedded bundle.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
