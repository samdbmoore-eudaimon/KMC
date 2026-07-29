// Generates the new foreground illustrations and tile icons for the Primary Home-screen
// visual overhaul: a tree (stars-to-pack meter), a scarecrow (boss-strength meter), and
// 7 small icons to replace the generic lucide icons on the mode tiles.
// Usage (PowerShell): $env:OPENAI_API_KEY = "sk-..."; node scripts/generate_home_overhaul_art.cjs [filter]
"use strict";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error("Set OPENAI_API_KEY as an environment variable first."); process.exit(1); }

const OUT_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_ui");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = `I'm creating art for a children's educational maths game called "Ninefold Orchard," a cozy harvest-town setting (Studio Ghibli meets British countryside folk-tale). Warm, painterly storybook-illustration style suitable for children aged 8-11. Warm daylight, golden-hour palette of greens, bronze and gold. Do not include any watermark or text of any kind.

`;

const ITEMS = [
  {
    key: "tree_meter",
    file: "tree_meter.png",
    quality: "high",
    size: "1024x1536",
    prompt: STYLE + `Subject: a single, tall, narrow young apple tree, painted as a full, healthy, thriving tree bursting with life: rich green leaves, plenty of glossy golden-red apples dotted through the canopy, a few warm golden sparkles glowing softly among the leaves as if lit from within. The trunk is slender but sturdy, with small roots and a little mound of grass visible at the very base. Composition: the tree fills the frame from top to bottom in a tall narrow portrait strip, trunk running straight up the middle, canopy filling the upper portion, meant to sit flush against the left edge of a screen as a decorative foreground element (like a tree growing up the side of a page). The background must be entirely plain flat transparent/empty space, nothing else drawn in it at all.`,
  },
  {
    key: "scarecrow_meter",
    file: "scarecrow_meter.png",
    quality: "high",
    size: "1024x1536",
    prompt: STYLE + `Subject: a single friendly, endearing scarecrow standing in the orchard, made of warm straw stuffing and patched autumn-coloured clothes (a soft plaid shirt, patched trousers, a wide-brimmed straw hat), with a stitched, kind, smiling face, arms slightly outstretched as if balanced on a wooden cross-post, standing on a tall wooden stake driven into a small mound of earth. Composition: fills the frame from top to bottom in a tall narrow portrait strip, the stake's base at the very bottom, the hat brim at the very top, meant to sit flush against the right edge of a screen as a decorative foreground element. The background must be entirely plain flat transparent/empty space, nothing else drawn in it at all.`,
  },
  {
    key: "icon_lessons",
    file: "icon_lessons.png",
    quality: "medium",
    size: "1024x1024",
    prompt: STYLE + `Subject: a single small icon of a neat stack of three hand-bound books tied with a bit of twine, with one glossy red apple resting on top of the stack. Centred, simple, clean silhouette-like composition with a little painterly texture, no other objects. Plain flat transparent background, generous even padding around the subject so it reads clearly as a small icon.`,
  },
  {
    key: "icon_guided",
    file: "icon_guided.png",
    quality: "medium",
    size: "1024x1024",
    prompt: STYLE + `Subject: a single small icon of a terracotta plant pot with a young green seedling sprouting two leaves growing out of it, a tiny ladybird resting on one leaf. Centred, simple, clean composition with a little painterly texture, no other objects. Plain flat transparent background, generous even padding around the subject so it reads clearly as a small icon.`,
  },
  {
    key: "icon_practice",
    file: "icon_practice.png",
    quality: "medium",
    size: "1024x1024",
    prompt: STYLE + `Subject: a single small icon of a round cut cross-section of a tree trunk showing its growth rings like an archery target's rings, with a single small acorn sitting at the very centre like a bullseye. Centred, simple, clean composition, no other objects. Plain flat transparent background, generous even padding around the subject so it reads clearly as a small icon.`,
  },
  {
    key: "icon_storybook",
    file: "icon_storybook.png",
    quality: "medium",
    size: "1024x1024",
    prompt: STYLE + `Subject: a single small icon of an open storybook lying flat, with a delicate leafy vine and one or two tiny flowers growing up and curling out from between its pages. Centred, simple, clean composition, no other objects. Plain flat transparent background, generous even padding around the subject so it reads clearly as a small icon.`,
  },
  {
    key: "icon_test",
    file: "icon_test.png",
    quality: "medium",
    size: "1024x1024",
    prompt: STYLE + `Subject: a single small icon of a stone garden sundial on a short stone plinth, simple triangular gnomon casting a shadow, a little moss growing at its base. Centred, simple, clean composition, no other objects. Plain flat transparent background, generous even padding around the subject so it reads clearly as a small icon.`,
  },
  {
    key: "icon_cards",
    file: "icon_cards.png",
    quality: "medium",
    size: "1024x1024",
    prompt: STYLE + `Subject: a single small icon of a round woven wicker basket overflowing with small apples, pears and plums. Centred, simple, clean composition, no other objects. Plain flat transparent background, generous even padding around the subject so it reads clearly as a small icon.`,
  },
  {
    key: "icon_adventures",
    file: "icon_adventures.png",
    quality: "medium",
    size: "1024x1024",
    prompt: STYLE + `Subject: a single small icon of a rolled parchment scroll map, tied closed with a thin leafy vine, resting on a small mossy stone. Centred, simple, clean composition, no other objects. Plain flat transparent background, generous even padding around the subject so it reads clearly as a small icon.`,
  },
];

async function generateOne(item) {
  const body = { model: "gpt-image-1", prompt: item.prompt, size: item.size, quality: item.quality, n: 1, background: "transparent" };
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) { throw new Error(`HTTP ${res.status}: ${await res.text()}`); }
  const json = await res.json();
  const b64 = json.data[0].b64_json;
  const outPath = path.join(OUT_DIR, item.file);
  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
  return outPath;
}

async function main() {
  const filter = process.argv[2];
  const toGenerate = filter ? ITEMS.filter((i) => i.key.includes(filter)) : ITEMS;
  console.log(`Generating ${toGenerate.length} piece(s) to ${OUT_DIR}\n`);
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
  if (failures.length) { console.log("Failures:"); for (const f of failures) console.log(` - ${f.key}: ${f.error}`); }
}
main();
