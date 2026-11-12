// Brightens exactly the 40 canonical Gifford source images. The original pixels are
// retained in a sibling backup directory so this operation is safe to repeat.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const ART_DIR = path.join(ROOT, "card_art", "gifford_cards");
const BACKUP_DIR = path.join(ART_DIR, "original-dark-masters");
const APPROVED_ROOKE = path.join(ART_DIR, "rooke-lighting-options", "rooke-brightened.png");
const TARGET_MEAN = 77;
const NAMES = [
  "Rooke", "Corvain", "Marrow", "Aldous", "TheEngine", "Prewitt", "Vane", "Ashcombe", "Thorncastle", "Halloway",
  "Kell", "Tessa", "Kade", "Bramwell", "Adelina", "Whistle", "Fenn", "Delphine", "Growl", "Pemberton",
  "Maude", "Tam Brindle", "Nettle", "Higgins", "Marta", "Jory", "Ratchet", "Colworth", "Pip", "Ada Voss",
  "Boss1", "Boss2", "Boss3", "Boss4", "Boss5", "Boss6", "Whistles Price", "Boss8", "Boss 9 Chacellors Ledger", "Boss10TheEnginesAnswer",
];

async function main() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  for (const name of NAMES) {
    const target = path.join(ART_DIR, `${name}.png`);
    const backup = path.join(BACKUP_DIR, `${name}.png`);
    if (!fs.existsSync(backup)) fs.copyFileSync(target, backup);
    if (name === "Rooke") {
      fs.copyFileSync(APPROVED_ROOKE, target);
      console.log(`Updated ${name}.png from the approved edit`);
    } else {
      const stats = await sharp(backup).stats();
      const mean = stats.channels.slice(0, 3).reduce((sum, channel) => sum + channel.mean, 0) / 3;
      const brightness = Math.max(1, Math.min(7, TARGET_MEAN / mean));
      const output = await sharp(backup).modulate({ brightness }).png().toBuffer();
      fs.writeFileSync(target, output);
      console.log(`Updated ${name}.png (${brightness.toFixed(2)}x exposure)`);
    }
  }
  console.log(`Updated ${NAMES.length} canonical source images; dark masters retained in ${BACKUP_DIR}`);
}
main().catch(error => { console.error(error); process.exit(1); });
