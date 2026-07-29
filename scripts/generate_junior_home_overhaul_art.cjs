// Generates the Junior ("Little Reckoning") equivalents of the Home-screen overhaul art:
// a hub background, two meter icons (pack progress / boss strength), and 9 tile icons.
// Sam wants Junior's feel to be Japanese-anime/fantasy-illustration, not retro pixel art —
// this matches the existing boss portraits (painterly fantasy illustration) rather than
// the pixel-sprite title screen.
// Usage (PowerShell): $env:OPENAI_API_KEY = "sk-..."; node scripts/generate_junior_home_overhaul_art.cjs [filter]
"use strict";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error("Set OPENAI_API_KEY as an environment variable first."); process.exit(1); }

const OUT_DIR = path.join(__dirname, "..", "card_art", "little_reckoning_ui");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = `I'm creating art for a children's educational maths game called "Kangaroo Maths Quest" / "Little Reckoning," a magical wizard-kangaroo fantasy-quest setting where a grey "Muddle" is spreading imprecision across the land. Japanese anime/fantasy-illustration style: vibrant cel-shaded colours, clean confident linework, dramatic magical lighting and sparkle effects, in the spirit of a fantasy JRPG or anime film. Do not include any watermark or text of any kind.

`;

const ITEMS = [
  {
    key: "hub_background",
    file: "hub_background.png",
    size: "1536x1024",
    quality: "medium",
    transparent: false,
    prompt: STYLE + `Subject: a sweeping fantasy-quest landscape at dusk, seen from a gentle rise: rolling green hills, a stone watchtower with a small flag on a distant hilltop, snow-capped mountains behind it, a winding river reflecting a starry violet-and-gold twilight sky, a few glowing magical motes drifting in the air. No characters, no text anywhere. Landscape orientation, full-bleed scene filling the whole frame edge to edge (this is a background layer, nothing should be cropped or vignetted at the edges).`,
  },
  {
    key: "meter_pack",
    file: "meter_pack.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small glowing spellbook, deep blue cover with a golden cross/plus symbol on the front, a soft golden magical light glowing up from the open pages. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "meter_boss",
    file: "meter_boss.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small heraldic shield-and-crossed-swords emblem, bronze shield with a silver star boss, two crossed swords behind it, a faint magical glow along the edges. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_lessons",
    file: "icon_lessons.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small stack of three spellbooks in different colours, a single glowing star hovering just above the top book. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_guided",
    file: "icon_guided.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small magic wand with a star tip, a few sparkles trailing from the tip. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_practice",
    file: "icon_practice.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small round archery target with concentric rings, a glowing magic star stuck in the bullseye instead of an arrow. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_storybook",
    file: "icon_storybook.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small open storybook lying flat, a few golden sparkles and a tiny star floating up from the open pages. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_academy",
    file: "icon_academy.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small wizard's pointed hat with a flat graduation-cap board and tassel balanced on top of it, a tiny star sparkle beside it. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_olympiad",
    file: "icon_olympiad.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small rolled parchment certificate/scroll tied with ribbon, a round wax seal stamped on it, one small medal hanging beside it. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_test",
    file: "icon_test.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small hourglass with golden glowing sand, a couple of small sparkles around it. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_cards",
    file: "icon_cards.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small wooden treasure chest, lid slightly open, a few glowing creature cards and gems spilling out the top. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
  {
    key: "icon_adventures",
    file: "icon_adventures.png",
    size: "1024x1024",
    quality: "medium",
    transparent: true,
    prompt: STYLE + `Subject: a single small rolled parchment map tied closed with string, a tiny brass compass resting on top of it. Centred, simple, clean icon composition, no other objects. Plain flat transparent background, generous even padding.`,
  },
];

async function generateOne(item) {
  const body = { model: "gpt-image-1", prompt: item.prompt, size: item.size, quality: item.quality, n: 1 };
  if (item.transparent) body.background = "transparent";
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
