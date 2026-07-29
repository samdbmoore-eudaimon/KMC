// Generates all 30 Ninefold Orchard card art images via OpenAI's image API.
// Usage (PowerShell): $env:OPENAI_API_KEY = "sk-..."; node scripts/generate_card_art.cjs
"use strict";

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Set OPENAI_API_KEY as an environment variable first.");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = `I'm creating a set of collectible trading cards for a children's educational maths game called "Ninefold Orchard." The setting is a cozy harvest town of orchards, allotments, and rows of trees where the whole town's rhythm revolves around counting, sharing, and measuring the harvest fairly.

Art style: warm, storybook-illustration style suitable for children aged 8-11 — think Studio Ghibli meets British countryside folk-tale, soft painterly textures, warm golden autumn light, gentle rounded shapes, friendly non-threatening character design (even "boss" characters should look mischievous/tragic rather than scary). Rich but not garish color palette — warm oranges, browns, mossy greens, golden wheat tones, with each character's rarity tier subtly reflected in ambient lighting (commons = simple daylight, rares = warm dusk glow, epics = dramatic magic-hour light, legendaries = radiant/glowing aura).

Every card must use the exact same frame treatment so the full set reads as one cohesive deck: a thin, engraved-looking decorative border running all the way round the card, woven from a simple interlocking branch-and-leaf motif, identical in thickness, spacing and pattern on every single card. Only the border's colour changes with rarity tier — a plain bronze-brown for common, a brushed silver for rare, a warm antique gold for epic, and a radiant pale-gold with a faint glow for legendary. Do not vary the border style, width, or motif between cards for any other reason.

Do not include any text anywhere in the image: no card name, no title, no "Ninefold Orchard" lettering, no captions, no watermark, no numbers. The image must be pure illustration inside the bordered frame, nothing typographic at all.

Each card should be a full-body character portrait, centered, filling most of the frame, with a simple thematic background element behind it (orchard rows, fences, tree roots, etc.), in a vertical trading-card aspect ratio.

Please generate the following character:
`;

const CARDS = [
  // Common
  { name: "01_common_Pip", desc: "Pip — the hero: a tiny apple-pip sprite, chestnut-sized, smooth pale gold-green body like the flesh under an apple's skin, a small brown pip-shaped cap on his head like a stem, thin twiggy limbs, large curious dark eyes, brow furrowed in concentration. Crouched over a row of apples, one finger extended mid-count. Carries a small hemp-string satchel with a tally-stick poking out." },
  { name: "02_common_Nine", desc: "Nine — a young crow, glossy black-blue feathers with an oil-slick sheen, slightly gawky adolescent build not yet grown into his wingspan, one stark white primary feather on his left wing, bright inquisitive eyes, head cocked mid-thought, a loose strip of red string round one leg." },
  { name: "03_common_Bramble", desc: "Bramble — a round hedgehog with dark brown and cream banded spines, one spine askew from head-scratching, naturally darker fur rings around his eyes giving a studious bespectacled look, carrying a small flat slate under one arm." },
  { name: "04_common_Sorrel", desc: "Sorrel — a russet wood-mouse with a cream belly and permanently overstuffed cheeks, an oversized acorn-cap satchel slung crossbody, one whisker comically longer than the other, tail curled neatly round her feet as she sits." },
  { name: "05_common_Russet", desc: "Russet — an apple-red ladybird with perfectly mirrored black spots on each wing case, ball-tipped antennae, fastidiously inspecting her own reflection in a dewdrop." },
  { name: "06_common_Halfpenny", desc: "Halfpenny — a small round robin with a warm orange-red breast split by a darker vertical stripe into two equal halves, balanced on a fence-rail holding a worm level in her beak as if weighing it." },
  { name: "07_common_Wicker", desc: "Wicker — a slender garden-spider with banded brown-and-gold legs, an abdomen faintly patterned to echo her own webs, eight friendly curious eyes, shown mid-weave with visibly even spacing between anchor threads." },
  { name: "08_common_Furrow", desc: "Furrow — a black velvet mole with oversized pink digging paws, a small pink nose, blind but confident stance, a tiny peg-and-string surveying tool over one shoulder, emerging from a perfectly straight tunnel mouth." },
  { name: "09_common_Dapple", desc: "Dapple — a young fawn with a soft dappled coat whose spots repeat in a visible sequence down her back and flanks, large dark eyes, slender legs, shy posture, grazing at a woodland edge in dappled sunlight." },
  { name: "10_common_Bushel", desc: "Bushel — a honey-brown bear cub, round-bellied, carrying a wicker berry-basket filled exactly to the brim, small round ears, content expression, mid-waddle from the berry patch." },
  { name: "11_common_Tuppence", desc: "Tuppence — a grey squirrel with a bushy tail, holding tiny brass balance-scales, cheeks stuffed evenly on both sides, sharp calculating eyes, perched on a branch weighing two acorns." },
  { name: "12_common_Windfall", desc: "Windfall — a small owl with mottled brown-and-cream feathers, wide amber eyes, mid-swoop tracking a falling apple, one wing extended for balance, alert knowing expression." },
  // Rare
  { name: "13_rare_Cornix", desc: "Cornix — an elder crow, larger and more weathered than Nine, grey streaking his crown, one leg banded with a carved tally-mark ring, dignified upright stance, perched atop the tallest scarecrow post surveying the orchard." },
  { name: "14_rare_Thistlewick", desc: "Thistlewick — an apprentice scarecrow, straw body less patchy than the corrupted ones, a half-stitched patchwork waistcoat still visibly being sewn, a small tin whistle on a string, button eyes not quite matched in size, hopeful lopsided posture." },
  { name: "15_rare_Beeswax", desc: "Beeswax — an oversized bee with fuzzy gold-and-black banding, a small handmade wax crown sitting slightly lopsided, wings faintly hexagon-patterned, carrying a rolled wax scroll of hive tallies, busy purposeful hover." },
  { name: "16_rare_Kernel", desc: "Kernel — a corn-husk spirit whose body is visibly woven in neat rows and columns of dried husk, corn-silk hair, kernel eyes and buttons arranged in a grid, standing very upright at a cornfield's edge." },
  { name: "17_rare_Millrace", desc: "Millrace — a translucent blue-green water-spirit, a constantly rippling silhouette, faint tally-marks swirling within the current, graceful flowing pose beside a mill-wheel." },
  { name: "18_rare_Cobweb", desc: "Cobweb — an elder spider, greyer and larger than Wicker, web-pattern spiralling inward toward her center, ancient wise expression, at the heart of an elaborate spiral web." },
  { name: "19_rare_Amberly", desc: "Amberly — a firefly with a soft amber-gold glow, mid-flight with a faint trail of light-dots behind her tracing her own blink-pattern, delicate wings, small and warm." },
  { name: "20_rare_Barrow", desc: "Barrow — a stout black-and-white badger with small round spectacles, an oversized leather ledger stuffed with tally-marked pages under one arm, no-nonsense focused expression, seated at a tree-stump desk." },
  { name: "21_rare_Driftwood", desc: "Driftwood — a tall grey-blue heron, one leg raised showing faint measuring notches, standing dead-still at a pond's edge, sharp focused eye, long neck curved in concentration." },
  { name: "22_rare_Gable", desc: "Gable — a barn owl with a heart-shaped face, feathers in a subtle calendar-like grid of cream-and-brown patches, perched in barn rafters, one wing gesturing toward a calendar carved into the beam." },
  // Epic
  { name: "23_epic_Warden", desc: "Warden — the eldest uncorrupted scarecrow, weathered but steady, neatly mended patchwork clothing, button eyes perfectly matched and calm, a finer carved whistle than the others', standing tall at the orchard's central crossroads." },
  { name: "24_epic_Harvestmoon", desc: "Harvestmoon — a great owl, larger and more majestic than the others, silver-white plumage with a faint glow, eyes gently closed and serene, perched atop the Ninefold Tree with an aura of quiet authority." },
  { name: "25_epic_Ninebark", desc: "Ninebark — a tree-spirit, humanoid, with bark 'skin' patterned in nine distinct concentric rings, leafy hair, moss in the creases, slow deliberate movement, one hand resting on the Ninefold Tree's trunk as if listening." },
  { name: "26_epic_Cascade", desc: "Cascade — a waterfall-spirit, humanoid, made of continuously falling water with droplets visibly separate and countable as they fall, roaring energy but a calm face at the center, mid-cascade beside the orchard's waterfall." },
  { name: "27_epic_Longshadow", desc: "Longshadow — a sleek red-orange fox with an unusually elongated tail and a dramatic trailing shadow marked with faint time-notches, sly knowing half-smile, shown at dusk with his shadow stretching across the ground." },
  { name: "28_epic_Gossamer", desc: "Gossamer — a moth with pale silvery wings patterned in a perfect spiral, moon-lit and ethereal, mid-flight tracing a glowing spiral trail through the night air." },
  // Legendary
  { name: "29_legendary_NinefoldTree", desc: "The Ninefold Tree — an ancient tree with nine great boughs, each hung with a different fruit (apple, pear, plum, quince, etc.), a vast trunk with nine visible growth-rings, roots spreading in a fractal-branching pattern, radiant gold-green glow at dusk, awe-inspiring scale." },
  { name: "30_legendary_TenthScarecrow", desc: "The Tenth Scarecrow — Pip transformed: part straw-woven, part still recognizably himself, his seed-cap grown into a small sapling-crown, limbs part-twig part-straw, a single fresh green shoot growing from his straw chest, standing proud beside the restored Nine, hopeful triumphant pose." },
];

async function generateOne(card) {
  const prompt = STYLE + card.desc;
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1536", // portrait, matches trading-card aspect — no need for larger
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
  const outPath = path.join(OUT_DIR, `${card.name}.png`);
  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
  return outPath;
}

async function main() {
  const filter = process.argv[2];
  const toGenerate = filter ? CARDS.filter((c) => c.name.includes(filter)) : CARDS;
  console.log(`Generating ${toGenerate.length} cards to ${OUT_DIR}\n`);
  const failures = [];
  for (let i = 0; i < toGenerate.length; i++) {
    const card = toGenerate[i];
    process.stdout.write(`[${i + 1}/${toGenerate.length}] ${card.name} ... `);
    try {
      await generateOne(card);
      console.log("done");
    } catch (e) {
      console.log("FAILED");
      failures.push({ name: card.name, error: e.message });
    }
  }
  console.log(`\nFinished. ${toGenerate.length - failures.length}/${toGenerate.length} succeeded.`);
  if (failures.length) {
    console.log("Failures:");
    for (const f of failures) console.log(` - ${f.name}: ${f.error}`);
  }
}

main();
