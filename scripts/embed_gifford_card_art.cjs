// Resizes/compresses the 30 Gifford (Intermediate) collectible card art PNGs down to
// 512x512 JPEG (matching the existing CARD_ART convention) and appends
// CARD_ART.<id> = "data:..." lines to kq-art.js.
// IDs are "gf_"-prefixed because CARD_ART is a single object shared across ALL modules —
// Primary already owns the id "pip", and Gifford also has a character named Pip, so an
// unprefixed id would silently overwrite Primary's card art.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ART_DIR = path.join(__dirname, "..", "card_art", "gifford_cards");
const KQ_ART = path.join(__dirname, "..", "kq-art.js");

const FILE_TO_ID = {
  "Rooke": "gf_rooke",
  "Corvain": "gf_corvain",
  "Marrow": "gf_marrow",
  "Aldous": "gf_aldous",
  "TheEngine": "gf_theengine",
  "Prewitt": "gf_prewitt",
  "Vane": "gf_vane",
  "Ashcombe": "gf_ashcombe",
  "Thorncastle": "gf_thorncastle",
  "Halloway": "gf_halloway",
  "Kell": "gf_kell",
  "Tessa": "gf_tessa",
  "Kade": "gf_kade",
  "Bramwell": "gf_bramwell",
  "Adelina": "gf_adelina",
  "Whistle": "gf_whistle",
  "Fenn": "gf_fenn",
  "Delphine": "gf_delphine",
  "Growl": "gf_growl",
  "Pemberton": "gf_pemberton",
  "Maude": "gf_maude",
  "Tam Brindle": "gf_tambrindle",
  "Nettle": "gf_nettle",
  "Higgins": "gf_higgins",
  "Marta": "gf_marta",
  "Jory": "gf_jory",
  "Ratchet": "gf_ratchet",
  "Colworth": "gf_colworth",
  "Pip": "gf_pip",
  "Ada Voss": "gf_adavoss",
};

async function main() {
  const files = fs.readdirSync(ART_DIR).filter((f) => f.endsWith(".png"));
  const lines = [];
  let totalIn = 0, totalOut = 0, matched = 0;
  for (const file of files) {
    const base = file.replace(/\.png$/, "");
    const id = FILE_TO_ID[base];
    if (!id) continue; // boss/scenario images handled by embed_gifford_boss_art.cjs
    matched++;
    const inPath = path.join(ART_DIR, file);
    const inSize = fs.statSync(inPath).size;
    totalIn += inSize;
    const outBuf = await sharp(inPath).resize(512, 512, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    totalOut += outBuf.length;
    lines.push(`CARD_ART.${id} = "data:image/jpeg;base64,${outBuf.toString("base64")}";`);
    console.log(`  ${id}: ${(inSize / 1024).toFixed(0)}KB -> ${(outBuf.length / 1024).toFixed(0)}KB`);
  }
  if (matched !== 30) { console.error(`Expected 30 matched collectible cards, got ${matched}. Aborting without writing.`); process.exit(1); }
  console.log(`\nTotal: ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB`);

  const appendix = "\n\n// Intermediate (Gifford) card art — resized to 512x512 JPEG from originals in card_art/gifford_cards/\n" + lines.join("\n") + "\n";
  fs.appendFileSync(KQ_ART, appendix);
  console.log("Appended", lines.length, "CARD_ART entries to kq-art.js");
}

main().catch((e) => { console.error(e); process.exit(1); });
