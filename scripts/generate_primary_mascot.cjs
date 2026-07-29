// Generates a Primary (Ninefold Orchard) mascot portrait — Pip, matching the card
// art style — for use as TITLE_ART.mascot wherever the Mascot component appears.
"use strict";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error("Set OPENAI_API_KEY as an environment variable first."); process.exit(1); }

const OUT_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_ui");
fs.mkdirSync(OUT_DIR, { recursive: true });

const prompt = `I'm creating a mascot icon for a children's educational maths game called "Ninefold Orchard," a cozy harvest-town setting. Art style: warm, painterly storybook-illustration suitable for children aged 8-11 (Studio Ghibli meets British countryside folk-tale), warm golden daylight, soft rounded shapes.

Subject: Pip, an apple-pip sprite about the size of a chestnut, smooth pale gold-green body like the flesh just under an apple's skin, a small brown pip-shaped cap on his head like a stem, thin twiggy limbs, large curious dark eyes, a warm friendly open expression (not neutral — actively cheerful and welcoming, since this icon appears throughout the app greeting the player). A hemp-string satchel with a tally-stick over one shoulder.

Pose: standing, three-quarter view, one hand raised in a small wave, a light bounce to the pose as if caught mid-hop.

Background: plain and simple, a soft warm gradient (pale cream to light gold) with no scenery, no border, no frame, no text of any kind — this needs to read clearly as a small floating icon at any size, not a busy scene. Centre the character with generous empty space around it so it can be cropped to a square cleanly.`;

async function main() {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", quality: "medium", n: 1 }),
  });
  if (!res.ok) { console.error("FAILED", res.status, await res.text()); process.exit(1); }
  const json = await res.json();
  const b64 = json.data[0].b64_json;
  const outPath = path.join(OUT_DIR, "pip_mascot.png");
  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
  console.log("Wrote", outPath);
}
main();
