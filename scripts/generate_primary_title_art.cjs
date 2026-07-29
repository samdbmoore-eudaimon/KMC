// Generates Ninefold Orchard's own title-screen art (background, foreground "front"
// layer, and the "Ninefold Orchard" logo lockup) via OpenAI's image API, replacing the
// borrowed Junior chrome currently aliased in PRIMARY_TITLE_ART. The mascot (wizard
// kangaroo) is intentionally NOT regenerated here — Sam confirmed he wants the original.
// Usage (PowerShell): $env:OPENAI_API_KEY = "sk-..."; node scripts/generate_primary_title_art.cjs
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

const STYLE = `I'm creating title-screen art for a children's educational maths game called "Ninefold Orchard," a cozy harvest-town setting (Studio Ghibli meets British countryside folk-tale). Warm, painterly storybook-illustration style suitable for children aged 8-11. Warm daylight, golden-hour sunlight, a green-and-gold cottage-garden palette (never the dusk/ember-red mood used for boss encounters). No characters or creatures in this piece unless stated below. Do not include any watermark.

`;

const ITEMS = [
  {
    key: "background",
    file: "title_background.png",
    transparent: false,
    quality: "medium",
    prompt: STYLE + `Subject: a sweeping title-screen backdrop of the Ninefold Orchard itself, seen from a gentle rise. Rows of apple, pear and plum trees curve away into the soft distance, converging on a single ancient, enormous tree at the heart of the orchard (the Ninefold Tree) silhouetted against a warm golden sky. A scatter of small stone-and-thatch orchard cottages and a winding cart-path thread between the rows. Soft morning mist low in the middle distance, sunbeams breaking through the branches. No text anywhere in the image. Landscape orientation, full-bleed scene filling the whole frame edge to edge (this is a background layer, so nothing should be cropped or vignetted at the edges).`,
  },
  {
    key: "front",
    file: "title_front.png",
    transparent: true,
    quality: "medium",
    prompt: STYLE + `Subject: a FOREGROUND silhouette layer meant to sit in front of the orchard backdrop, anchored along the bottom edge only. Nearby apple-tree trunks and low branches enter from the left and right edges, a woven-wicker fence and a couple of stacked harvest crates and baskets sit along the bottom, all rendered slightly darker/richer than a distant background would be, as if closer to the viewer. The ENTIRE upper two-thirds of the image must be plain flat transparent/empty space with absolutely nothing drawn in it (no sky, no distant trees, no gradient) — only the bottom third or so should contain any illustrated detail, and it should read naturally when its top edge fades into nothing. No text anywhere.`,
  },
  {
    key: "title",
    file: "title_logo.png",
    transparent: true,
    quality: "high",
    prompt: STYLE + `Subject: the game's logo lockup, to be read clearly and used as the game's main title art. A rustic hand-painted wooden orchard sign, weathered pale oak, hanging from a bit of twine looped over a branch, with the words "Ninefold Orchard" painted on it in warm, friendly, rounded hand-lettering (deep bronze-brown paint), the word "Ninefold" on one line above the word "Orchard" on a second line below it, both perfectly spelled exactly as written here. A light wreath of apple leaves and tiny apples curls around the corners of the sign as decoration, but must not overlap or obscure any of the lettering. The background around the sign must be entirely plain flat transparent/empty space — no scenery, no ground, no sky, nothing but the sign, its hanging twine, and the leaf decoration.`,
  },
];

async function generateOne(item) {
  const body = {
    model: "gpt-image-1",
    prompt: item.prompt,
    size: "1536x1024",
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
  console.log(`Generating ${toGenerate.length} title-art piece(s) to ${OUT_DIR}\n`);
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
