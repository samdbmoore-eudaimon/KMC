// Generates all 10 Ninefold Orchard boss portrait images via OpenAI's image API.
// Distinct tone from the card art: dusky/ember red influence instead of the cards'
// warm green-gold orchard palette, square format matching Junior's BOSS_ART convention.
// Usage (PowerShell): $env:OPENAI_API_KEY = "sk-..."; node scripts/generate_boss_art.cjs
"use strict";

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Set OPENAI_API_KEY as an environment variable first.");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_bosses");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = `I'm creating boss-encounter portrait art for a children's educational maths game called "Ninefold Orchard," a cozy harvest-town setting. These portraits are for the ten chapter bosses specifically, and need a visibly different mood from the game's regular collectible creature cards, which use a warm green-and-gold cottage-garden palette.

Art style: still a warm, painterly storybook-illustration style suitable for children aged 8-11 (Studio Ghibli meets British countryside folk-tale), but shifted into dusk/embers rather than daylight — warm reds, burnt orange, deep amber, smoky charcoal, the light of a low autumn sun about to set or a banked fire. A slight red influence should run through every image (a red-tinted sky, ember-glow rim-light, a warm russet cast over the shadows) instead of the green tones used elsewhere in this game's art. This is NOT a horror or gore palette and these are NOT villains to be frightened of: every one of these bosses is sad, broken, or lost rather than evil, and must still read as sympathetic and non-threatening, just more dramatic and higher-stakes than the ordinary creature cards, the way a "boss encounter" naturally feels weightier than an everyday one.

Every image must use the same frame treatment: a thin, engraved-looking decorative border running all the way round, the same interlocking branch-and-leaf motif used elsewhere in this game's art, but in a warm dark bronze-ember colour rather than the plain bronze/silver/gold used for ordinary cards, so the full set of ten reads as its own distinct "boss" tier at a glance.

Do not include any text anywhere in the image: no name, no title, no captions, no watermark, no numbers. Pure illustration inside the bordered frame only.

Each image should be a full-body or full-scene portrait, centred, filling most of the frame, in a SQUARE aspect ratio (not the vertical card ratio used elsewhere), with a simple thematic background suggesting the orchard at dusk.

Please generate the following boss:
`;

const BOSSES = [
  { name: "01_The_First_Crow", desc: "The First Crow — a scruffy young crow, glossy black-blue feathers a little unkempt, a guilty and hopeful expression, sitting amid a few stolen apple cores, framed against a dusky red sky over Row One's apple trees." },
  { name: "02_Old_Roughweather", desc: "Old Roughweather — a great slouching scarecrow of damp sacking and mildewed straw at the head of a row of pear trees, one button eye missing, the other hanging loose by a thread, a weary sagging posture, dusk light turning the pears amber-red." },
  { name: "03_Widdershins", desc: "Widdershins — a small mischievous wind-spirit, visible only as a spinning knot of dust and blossom about the size of a kitten, caught mid-swirl above a row of plum trees, warm ember-coloured motes of dust catching the low red light around it." },
  { name: "04_Scratch", desc: "Scratch — an old scarecrow at the head of an apple row, crooked painted mouth, two mismatched button eyes (one bone, one horn), a sad dignified posture, straw slightly greyed with age, standing against a deep red dusk sky." },
  { name: "05_The_Maybe-Flock", desc: "The Maybe-Flock — a directionless swirling mass of small finches, brown and gold and russet, folding and unfolding in the air with no clear edge or shape, caught mid-motion against a smoky ember-red sky over the orchard's middle trees." },
  { name: "06_Strawless", desc: "Strawless — a scarecrow coming apart into loose drifts of straw, his crossbar sagging, one sleeve emptied entirely, straw scattered around his feet in loose bundles, a rueful expression, warm dusk light over the scene." },
  { name: "07_The_Murder", desc: "The Murder — an enormous restless boiling mass of thousands of crows filling the sky above the orchard's central rows, a great dark smoke of wings with no visible edge, dramatic deep red-orange dusk light behind the swarm." },
  { name: "08_Hollow_Bough", desc: "Hollow Bough — a great old grey tree bough at the heart of the orchard, utterly bare, with the ghostly translucent outline of a single piece of fruit hanging in the empty air where fruit should be, a quiet haunting emptiness, deep red dusk light behind the ancient Ninefold Tree." },
  { name: "09_The_Nearly", desc: "The Nearly — a shy, almost invisible presence, a faint apologetic shimmer roughly humanoid in shape, barely visible against the air, sitting on the rim of a harvest basket, warm ember light barely catching its translucent edges." },
  { name: "10_The_First_Scarecrow", desc: "The First Scarecrow — the ancient founding scarecrow at the very heart of the orchard, its straw gone to a soft grey mist, a leaning weathered stick figure, stitched face turned upward, standing beneath the great Ninefold Tree in the last deep red light of dusk, weary but not menacing, a century of quiet dignity." },
];

async function generateOne(boss) {
  const prompt = STYLE + boss.desc;
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const b64 = json.data[0].b64_json;
  const outPath = path.join(OUT_DIR, `${boss.name}.png`);
  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
  return outPath;
}

async function main() {
  const filter = process.argv[2];
  const toGenerate = filter ? BOSSES.filter((b) => b.name.includes(filter)) : BOSSES;
  console.log(`Generating ${toGenerate.length} boss portraits to ${OUT_DIR}\n`);
  const failures = [];
  for (let i = 0; i < toGenerate.length; i++) {
    const boss = toGenerate[i];
    process.stdout.write(`[${i + 1}/${toGenerate.length}] ${boss.name} ... `);
    try {
      await generateOne(boss);
      console.log("done");
    } catch (e) {
      console.log("FAILED");
      failures.push({ name: boss.name, error: e.message });
    }
  }
  console.log(`\nFinished. ${toGenerate.length - failures.length}/${toGenerate.length} succeeded.`);
  if (failures.length) {
    console.log("Failures:");
    for (const f of failures) console.log(` - ${f.name}: ${f.error}`);
  }
}

main();
