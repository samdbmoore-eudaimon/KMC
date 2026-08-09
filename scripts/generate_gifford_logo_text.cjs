// One-off: regenerates just card_art/gifford_ui/logo_compact.png WITH the module's
// name rendered as real in-image text ("GIFFORD"), matching the established convention
// for the compact header logo (JUNIOR_UI_ART.logoCompact = "KANGAROO MATHS QUEST",
// PRIMARY_UI_ART.logoCompact = "Ninefold Orchard" — both baked-in text, no code-side
// text overlay exists for this element). The original generate_gifford_ui_art.cjs run
// deliberately left this asset textless (copying the "frame only" instruction meant for
// title_wordmark/panel_frame), which is why Gifford's header plaque renders blank.
"use strict";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error("Set OPENAI_API_KEY first."); process.exit(1); }

const OUT_DIR = path.join(__dirname, "..", "card_art", "gifford_ui");

const prompt = `Digital game UI art: a small horizontal engraved brass name-plate logo for a gothic Victorian steampunk game module called "GIFFORD". A narrow riveted brass rectangular plate with rounded corners and small cogwheel rivets at each end. The word "GIFFORD" is engraved/embossed directly into the brass plate in a bold Victorian display serif capital typeface, the letters themselves rendered as raised or deep-engraved brass with subtle oxblood-red enamel inlay in the letter grooves, catching gaslamp-warm highlights. No subtitle, no other words, just GIFFORD. Background fully transparent, wide and short aspect ratio, the plate occupying a thin horizontal band across the middle of the frame with empty transparent space above and below.

Style: matches gothic Victorian steampunk game UI chrome — brass, oxblood, cream, tarnished silver. Fine engraved linework. A graphic, flatter illustration register, not a moody painting.

CRITICAL BACKGROUND REQUIREMENT: render the area outside the plate as a perfectly FLAT, completely SOLID, uniform chroma-key colour of pure medium grey (hex #808080), covering every pixel outside the plate's silhouette with zero gradient, zero vignette, zero lighting falloff, zero texture — a single flat rectangle of that one exact grey, like a chroma-key backdrop for a video game sprite that will be cut out afterward. Do NOT shade or light this backdrop at all.

Negative: no other lettering beyond the single word GIFFORD, no watermark, no signature, no modern sans-serif font, no photorealistic rendering, no 3D render, no glossy PBR shading, no chibi or cute proportions, no electric lighting quality, no gradient or vignette anywhere in the backdrop.`;

async function main() {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1536x1024", quality: "high", n: 1 }),
  });
  if (!res.ok) throw new Error(`generations endpoint ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const outPath = path.join(OUT_DIR, "logo_compact.png");
  fs.writeFileSync(outPath, Buffer.from(json.data[0].b64_json, "base64"));
  console.log("Wrote", outPath);
}
main().catch((e) => { console.error(e); process.exit(1); });
