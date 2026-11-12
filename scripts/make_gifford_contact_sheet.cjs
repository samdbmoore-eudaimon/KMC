"use strict";
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const artDir = path.join(root, "card_art", "gifford_cards");
const names = [
  "Rooke", "Corvain", "Marrow", "Aldous", "TheEngine", "Prewitt", "Vane", "Ashcombe", "Thorncastle", "Halloway",
  "Kell", "Tessa", "Kade", "Bramwell", "Adelina", "Whistle", "Fenn", "Delphine", "Growl", "Pemberton",
  "Maude", "Tam Brindle", "Nettle", "Higgins", "Marta", "Jory", "Ratchet", "Colworth", "Pip", "Ada Voss",
  "Boss1", "Boss2", "Boss3", "Boss4", "Boss5", "Boss6", "Whistles Price", "Boss8", "Boss 9 Chacellors Ledger", "Boss10TheEnginesAnswer",
];

async function main() {
  const tiles = await Promise.all(names.map(async (name, index) => {
    const label = Buffer.from(`<svg width="180" height="28"><rect width="180" height="28" fill="rgba(0,0,0,.78)"/><text x="5" y="19" fill="white" font-size="12" font-family="Arial">${name.replaceAll("&", "&amp;")}</text></svg>`);
    const input = await sharp(path.join(artDir, `${name}.png`)).resize(180, 180, { fit: "cover" }).composite([{ input: label, top: 152, left: 0 }]).png().toBuffer();
    return { input, left: (index % 5) * 180, top: Math.floor(index / 5) * 180 };
  }));
  await sharp({ create: { width: 900, height: 1440, channels: 3, background: "#222" } }).composite(tiles).png().toFile(path.join(artDir, "gifford-source-contact-sheet.png"));
}
main().catch(error => { console.error(error); process.exit(1); });
