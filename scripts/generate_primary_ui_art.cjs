// Generates Ninefold Orchard's own chrome (the ornate panel-frame border and the
// compact header wordmark) via OpenAI's image API, replacing the borrowed Junior
// chrome currently aliased in PRIMARY_UI_ART.
// Usage (PowerShell): $env:OPENAI_API_KEY = "sk-..."; node scripts/generate_primary_ui_art.cjs
"use strict";

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Set OPENAI_API_KEY as an environment variable first.");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_ui");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = `I'm creating UI chrome art for a children's educational maths game called "Ninefold Orchard," a cozy harvest-town setting (Studio Ghibli meets British countryside folk-tale). Warm, painterly storybook-illustration style suitable for children aged 8-11. Warm daylight, golden-hour palette of greens, bronze and gold (never the dusk/ember-red mood used for boss encounters). Do not include any watermark.

`;

const ITEMS = [
  {
    key: "panelFrame",
    file: "panel_frame.png",
    transparent: true,
    quality: "high",
    size: "1024x1536",
    prompt: STYLE + `Subject: a decorative picture-frame border, to be used as a stretchable UI frame around ordinary content panels. An engraved-looking interlocking branch-and-leaf motif runs continuously around all four edges of the frame, carved from warm bronze-gold wood, with tiny painted apples tucked into the corners. The border must be a CONSISTENT, EVEN thickness on all four sides (roughly one tenth of the image's width per side) so it can be sliced into a 9-patch. The entire centre of the image, inside the border, must be perfectly plain flat transparent/empty space with nothing drawn in it at all — no shading, no vignette, no texture — since a content panel will show through that area. No text anywhere.`,
  },
  {
    key: "logoCompact",
    file: "logo_compact.png",
    transparent: true,
    quality: "high",
    size: "1536x1024",
    prompt: STYLE + `Subject: a small, compact header wordmark reading "Ninefold Orchard" in warm, friendly, rounded hand-lettering (deep bronze-brown paint with a soft gold highlight along the top edge of each letter), both words sitting on a single line, spelled exactly as written here, with a single small painted apple-with-leaf accent to the left of the text. Keep the whole lockup compact and wide rather than tall, since it will be scaled down to a small header logo. The background must be entirely plain flat transparent/empty space — no scenery, no panel, no border, nothing but the lettering and the small apple accent.`,
  },
];

async function generateOne(item) {
  const body = {
    model: "gpt-image-1",
    prompt: item.prompt,
    size: item.size,
    quality: item.quality,
    n: 1,
  };
  if (item.transparent) body.background = "transparent";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText}`);
  }
  const json = await res.json();
  const b64 = json.data[0].b64_json;
  const outPath = path.join(OUT_DIR, item.file);
  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
  return outPath;
}

async function main() {
  const filter = process.argv[2];
  const toGenerate = filter ? ITEMS.filter((i) => i.key.includes(filter)) : ITEMS;
  console.log(`Generating ${toGenerate.length} UI-art piece(s) to ${OUT_DIR}\n`);
  const failures = [];
  for (const item of toGenerate) {
    process.stdout.write(`${item.key} ... `);
    try {
      await generateOne(item);
      console.log("done");
    } catch (e) {
      console.log("FAILED");
      failures.push({ key: item.key, error: e.message });
    }
  }
  console.log(`\nFinished. ${toGenerate.length - failures.length}/${toGenerate.length} succeeded.`);
  if (failures.length) {
    console.log("Failures:");
    for (const f of failures) console.log(` - ${f.key}: ${f.error}`);
  }
}

main();
