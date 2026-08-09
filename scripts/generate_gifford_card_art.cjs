// Generates card art for the Intermediate module's story world (Gifford) per
// gifford_card_art_briefs.md (v3). Corvain (batch 2) is confirmed correct and is now
// the style anchor for the whole deck — do not regenerate her from text; feed her
// image back as a style reference for every other card instead.
// Run: node scripts/generate_gifford_card_art.cjs <key> [<key> ...]
"use strict";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error("Set OPENAI_API_KEY first."); process.exit(1); }

const OUT_DIR = path.join(__dirname, "..", "card_art", "gifford_cards");
fs.mkdirSync(OUT_DIR, { recursive: true });
const STYLE_REFERENCE = path.join(OUT_DIR, "corvain.png");

// v4 — rewritten by direct visual inspection of the approved Corvain anchor image, after the
// reference-image mechanism proved unreliable (it fails outright ~half the time, and even on a
// technical success does not reliably transfer style — Nettle used it successfully and still came
// out as a completely different, glossy children's-book style). Style is now locked by precise text
// description of what Corvain actually looks like, not by an attached reference image.
const STYLE_BLOCK = `Digital illustration in a stylised adult-animated-series register, matching this exact treatment: soft painterly rendering with visible brushed/painted texture throughout the shading (not flat vector cel-fill, not hard poster-flat colour blocks), naturalistic adult facial anatomy and proportions — NOT chibi, NOT a glossy children's-picture-book style, NOT photorealistic. Linework is present but soft, not a hard black vector outline. Cinematic shallow depth of field with a softly blurred background, fine film grain, moody atmospheric lighting.

Face construction: naturalistic adult facial proportions, strong brow and cheekbone planes, expressive but not oversized eyes, a small amount of painterly softness in the shading rather than crisp cel-flat colour fields. Stylised illustration, not a 3D render, not a photograph, not a glossy cartoon.

Colour treatment, mandatory: every single image must show a genuine complementary colour split — a warm light (amber, oxblood, brass, rust or sodium) played directly against a distinct cool colour (blue-grey, cyan, or teal) somewhere in the same frame, at minimum as a cool ambient shadow-fill or background note against the warm key. NEVER a single-hue monochrome wash across the whole image, even in a plain, ordinary, single-lamp Common-tier scene — the lamp's warm light and the room's cool ambient shadow must both be visible and distinguishable as different colours.`;

const NEGATIVE_BLOCK = `No oil painting, no canvas texture, no impasto, no visible brushstrokes on outlines, no Old Master or Salon portrait, no chiaroscuro gallery portrait, no sepia, no monochrome, no single-hue colour wash, no desaturated umber wash, no flat ambient studio lighting. Also: no clean modern surfaces, no recognisable real people, no real-world branding, no gore, no character design that reads as an existing franchise.

No glossy children's-picture-book or Saturday-morning-cartoon illustration style, no oversized glossy anime-style eyes, no chibi or toy-like proportions, no bright flat primary-colour palette, no cute rounded storybook rendering.

No photorealistic or hyperrealistic painterly-realist rendering, no photoreal skin texture, no photographic lighting quality, no realistic 3D render, no generic realtime-game-engine 3D-character look, no glossy PBR material shading, no plasticky specular skin. This must look drawn and illustrated, at the SAME moderate stylisation level in every single card, never more painterly-realistic and never more cartoon-flat than the house style.

No low-poly or geometric faceted faces, no hard polygonal planes standing in for anatomy.

No text, no typography, no title cards, no name banners, no captions, no logos, no UI elements of any kind baked into the image — character art only, nothing else.

This is a gothic Victorian steampunk world with no electricity. No electric lighting of any kind, no light bulbs, no modern desk lamps, no LED or fluorescent light quality. Every light source in every scene must be gaslight, oil lamp, candle flame, or the setting's own brass/steam machinery glow (furnace light, dial-glow, etc).`;

const EXPOSURE_NOTE = `Exposure, mandatory and overriding: whatever mood words appear elsewhere in this prompt ("dim", "cramped", "flat", "gaslit", "soot", "night"), the actual rendered brightness of the subject's face must be HIGH — comparable to a well-lit stage portrait, not a noir or day-for-night scene. Err deliberately on the side of TOO BRIGHT rather than too dark. The character's face and skin must sit in a clearly visible, well-exposed light-to-mid tone — never near-black, never lost in shadow, never underexposed, regardless of skin tone or the surrounding environment's mood. This applies with extra force to darker-skinned characters: give them a strong, deliberate, unambiguous key or rim light aimed at the face, bright enough that skin texture and expression are as easy to read as on a pale-skinned character in the same scene. "Atmospheric" and "moody" describe the background and the margins of the frame, never the subject's own face. If mood-darkness and face legibility ever conflict, legibility always wins. The image must read clearly and brightly at small thumbnail size.`;

const UNDER_EXCLUSION = `Colour exclusion: no green, no neon green, no toxic teal, no chemical glow anywhere in this image.`;

const REFERENCE_NOTE = `A reference image is attached. Use it ONLY for its rendering style — line quality, cel shading, rim-light treatment, matte-surface material quality, overall stylisation level. Do NOT reuse its colour palette, its character, its pose, its wardrobe or its environment. Generate an entirely new subject and scene, described below, rendered in that same style.`;

// Faction palette rules from SHARED ART DIRECTION — this is what makes the deck read as
// one world with two visibly opposed factions, so every card states its faction palette
// explicitly rather than relying on the style-reference image alone.
const FACTION_BLOCKS = {
  rise: `Faction — The Rise (Wrought): saturated oxblood, warm cream, polished brass, deep bottle green, tarnished silver. Hard warm key light from above, cool cyan-grey fill. High ceilings, empty air. Architecture is Georgian, not Art Nouveau: straight lines, sash windows, plain cornices, restrained brass — no sweeping organic curves, no filigree.`,
  under: `Faction — The Under (Rustbound): hot rust orange, sodium yellow, cold iron blue-grey, soot black, bright steam white. Key light from below or from one bare source, with cold blue bounce. Air always carrying grit, smoke or fog. ${UNDER_EXCLUSION}`,
  neutral: `Faction — Independent/neutral, aligned with neither the Rise nor the Under: where the composition allows it, split both factions' palettes hard across the frame or across the face, warm on one side and cold on the other.`,
};

const RARITY_COMMON = `Rarity signalling: this is a COMMON card — per the set's rarity-light rules, the LIGHTING SETUP is plain, ordinary and undramatic (a single everyday source, nothing cinematic or heroic about the staging) — this describes the unremarkable quality and simplicity of the light, NOT its brightness. The scene should still read as clearly and brightly lit; "plain" is not "dark".`;

function buildPrompt({ subject, lighting, palette, faction, rarityLine, extraExclusion, useReference }) {
  return [STYLE_BLOCK, useReference ? REFERENCE_NOTE : null, faction ? FACTION_BLOCKS[faction] : null, subject, rarityLine, lighting, EXPOSURE_NOTE, palette, extraExclusion, NEGATIVE_BLOCK]
    .filter(Boolean).join("\n\n");
}

const subjects = [
  {
    key: "rooke",
    file: "rooke.png",
    useReference: true,
    subject: `Subject: ROOKE, protagonist, Rustbound. A fourteen-year-old GIRL — she read as a boy in an earlier test render, so her feminine structure must be followed exactly: a soft jaw tapering to a small pointed chin, a narrow neck, narrow shoulders, high rounded cheekbones, thinner arched brows (not heavy or straight), large dark eyes with visible lashes, a small mouth. Small, slight and wiry, undernourished but not frail, not a caricature and not a gremlin.

Black hair cut short and badly by somebody in a hurry, but NOT cropped like a boy's: uneven, chin-length at the sides, longer and ragged at the nape, falling into her eyes at the front — a girl's hair hacked at with kitchen scissors, not a boy's short cut.

A grey wool coat two sizes too large, mended at both elbows with thread that does not match. Ink on the side of her right hand.

She sits at a school desk in an enormous, empty examination hall, hundreds of identical desks receding behind her into darkness. She is turned toward the viewer, pen down, not writing, watching whoever is looking at her.

On the desk: a pen, a wooden token stamped with the number 4471, and a brass pocket watch standing open on its hinge and catching the light.`,
    lighting: `Lighting: single hard cold key light from a tall arched window high and behind her, cyan-white, with a warm brass bounce off the watch face up onto her hands and chin. Strong cold rim light along her hair and one shoulder.`,
    palette: `Palette: cold slate blue-grey and bone white dominant, one saturated warm brass accent. The coldest card in the set — but keep the midtones light enough that she reads clearly at thumbnail size; do not render this too dark overall.`,
    extraExclusion: UNDER_EXCLUSION,
  },
  {
    key: "marrow",
    file: "marrow.png",
    useReference: true,
    subject: `Subject: MARROW, protagonist, a Sirrath built 80 per cent human and 20 per cent tiger. Start from a human face and lay feline traits over the surface — do NOT start from a tiger and humanise it.

Human, and non-negotiable: the whole facial architecture is human. A flat human facial plane with NO muzzle and NO snout of any kind. Human cranium proportion, high forehead. Human nose shape and bridge. Human mouth with actual lips. Human chin and jawline. Human-set eyes at human spacing and human scale, not enlarged. Human cheekbones. Human ear placement, roughly where a person's ears are.

Feline, and only these: short white pelt over the whole of it instead of skin. Dark nose leather at the tip of an otherwise human nose. Ears rounded, set a little higher and further back than a human's, canted slightly outward. Charcoal stripes following the human facial planes: two or three across the forehead, a pair at the temples, one or two along each cheekbone, banding down the neck. A few sparse short whiskers. Ice-blue eyes at human scale, no glossy specular highlight. A slight ruff of longer fur at the jawline, subtle, not a mane.

Explicit negatives: no muzzle, no snout, no projecting jaw, no feline mouth line, no plush or fluffy fur, no enlarged eyes, no wolf, no fox, no dog, no cartoon animal, no cute or Pixar proportions. He must read as a young man with a tiger's colouring, never as an animal wearing clothes.

Expression: NOT sad. Determined, contained and dangerous — level brow, mouth set straight, jaw firm, chin level, direct unflinching gaze into or just past the camera. Any tension in the face is concentration and held anger, never sorrow or appeal.

Build: seventeen years old, six foot four, lean and powerful, broad through the shoulders and chest with no softness anywhere — visible tendon and forearm, narrow waist, long limbs. He stands squared and still, weight settled, taking up his full height rather than hunching. Nothing rounded, nothing soft-cheeked, nothing childlike.

A patched canvas working coat with sleeves rolled short on his forearms, a valve-key on a loop at his belt, a folded paper docket crushed in one fist.

Style discipline: flat graphic cel-shaded treatment, hard shadow shapes, crisp silhouette, matte surfaces — not volumetric rendered fur, not soft rounded 3D volumes, not subsurface glow, matching the attached reference image exactly.

He stands at the mouth of a low brick outfall arch in a sump lane. Hot white vent-fog pours around his knees and boils up past his waist, going opaque behind him. A shattered cast-iron Council notice board hangs on the wall to one side.`,
    lighting: `Lighting: hot sodium-yellow gaslight from behind and above, throwing a hard orange rim along his shoulders and the top of his head and firing through the fog. Cold blue-grey bounce off wet brick filling the front of him. His white pelt is the brightest value in the frame.`,
    palette: `Palette: saturated rust orange and sodium yellow against cold iron blue-grey, with bright steam white. The warmest and loudest card in the set.`,
    extraExclusion: UNDER_EXCLUSION,
  },

  // --- COMMON tier (9 cards) ---
  {
    key: "tam_brindle",
    file: "tam_brindle.png",
    useReference: true,
    faction: "under",
    rarityLine: RARITY_COMMON,
    subject: `Subject: TAM BRINDLE, common, Rustbound, foster sibling. Black British, dark skin, tight black curls. A boy of twelve, ferrety, cheerful, filthy. Caught in the act of doing something with a knife that a knife is not for. Sitting on a doorstep, grinning up out of the frame.

Detail: three separate stolen small objects visible in his coat, none of them valuable.

Lighting priority: this must NOT be a dark or shadowy image. Light Tam's face brightly and directly, as if a gaslamp is positioned right in front of him for the purpose of lighting his portrait — his dark skin must be rendered in clear, bright, well-exposed midtones with visible highlights, exactly as legible as a pale-skinned face would be in the same shot. Treat this as a bright, cheerful, well-lit portrait of a grinning boy, not a shadowy or moody scene.`,
    palette: `Palette: soot and brown in the background only. Tam's own face and the immediate foreground are brightly and clearly lit by the gaslight, high visibility, not dim or shadowed.`,
  },
  {
    key: "nettle",
    file: "nettle.png",
    useReference: true,
    faction: "under",
    rarityLine: RARITY_COMMON,
    subject: `Subject: NETTLE, common, Rustbound, foster sibling. South Asian, warm brown skin, dark hair. A girl of nine, thin, flushed, wrapped in a blanket too big for her, kneeling up at a window with one hand flat against the glass. She is meant to be in bed. Her breath has fogged the pane and she has drawn in it.

Detail: a bottle of syrup on the sill behind her, unopened, with the seal still on.

Style discipline: flat cel-shaded stylised animation exactly matching the house style, not a smooth realtime-3D-game-character render — the skin and blanket surfaces must show painted texture inside flat shadow shapes, not a glossy CG material shader.

Lighting priority: this must NOT be a dark, dim or nighttime-feeling image. It is broad daytime — bright overcast daylight is flooding through the window directly onto her face. Render her face and skin in clear, bright, well-exposed light tones, fully and easily visible, the way an ordinary daylit photograph would look, not moody or underlit in any way.`,
    palette: `Palette: bright grey daylight through the glass, one warm patch of blanket. Clearly and brightly lit throughout — not dark, not dim, not underexposed.`,
  },
  {
    key: "corporal_higgins",
    file: "corporal_higgins.png",
    useReference: true,
    faction: "rise",
    rarityLine: RARITY_COMMON,
    subject: `Subject: CORPORAL HIGGINS, common, Wrought, law enforcer. White, pale skin, short brown hair. A man of thirty in a regulation grey coat, correct in every particular and thinking about nothing. Standing at a street corner with his hands behind his back, watching the middle distance.

Detail: a whistle on a chain, held, not blown.

Lighting priority: the overcast daylight is flat, not dark — give his face clear, even, sufficient exposure so his dark skin and expression both read plainly. Flat overcast light must not be rendered as dim or shadowed light.`,
    palette: `Palette: grey on grey, wet cobbles, flat overcast daylight — clearly and evenly lit, not dark or underexposed.`,
  },
  {
    key: "marta_grocer",
    file: "marta_grocer.png",
    useReference: true,
    faction: "under",
    rarityLine: RARITY_COMMON,
    subject: `Subject: MARTA THE GROCER, common, Rustbound, shopkeeper. White, pale weathered skin, grey hair. A woman of sixty behind a counter, sleeves rolled, arms folded, weighing up a customer rather than the goods. Shrewd and not unkind.

A tiny Under shop: sacks, a brass balance, hanging root vegetables, sawdust.

Detail: a large slate on the wall behind her covered in chalked names and running totals, several of them very long.

Style discipline: smooth stylised human anatomy with rounded cheekbones and jaw, not faceted or low-poly geometric planes — the face must read as a face, not an abstracted polygonal shape. The "one dim bulb" is a gas mantle or oil lamp, never an electric bulb.`,
    palette: `Palette: brown, sacking, one dim gaslamp. Flat, close, warm-ish.`,
  },
  {
    key: "jory_fenwick",
    file: "jory_fenwick.png",
    useReference: true,
    faction: "rise",
    rarityLine: RARITY_COMMON,
    subject: `Subject: JORY FENWICK, common, Wrought, minor noble house. Indian subcontinental, warm brown skin, dark hair. A young man of seventeen in university dress, expensively casual, leaning against a doorframe with his arms crossed. Dismissive, and quietly beginning to be less so. Caught in the act of watching somebody work and not liking what he is learning.

Detail: his own unopened notebook under his arm.`,
    palette: `Palette: oak, cream, cold library daylight. Even, unremarkable light.`,
  },
  {
    key: "ratchet",
    file: "ratchet.png",
    useReference: true,
    faction: "under",
    rarityLine: RARITY_COMMON,
    subject: `Subject: RATCHET, common, Rustbound, Ashlight gang member. White, pale skin, sandy hair. A man of twenty, cheerful, scrawny, in a coat three owners deep. Sitting on an upturned crate eating something out of paper. He is the friendly face of a bad organisation and knows it.

Detail: a pistol on the crate beside him, being used as a paperweight for a betting slip.`,
    palette: `Palette: rust, paper grease, gaslight yellow. Dim and cosy.`,
  },
  {
    key: "magistrate_colworth",
    file: "magistrate_colworth.png",
    useReference: true,
    faction: "rise",
    rarityLine: RARITY_COMMON,
    subject: `Subject: MAGISTRATE COLWORTH, common, Wrought, Council judiciary. East Asian, weathered skin, thinning grey hair. A man of sixty-five in judicial robes, seated high, mid-yawn or nearly. Neither cruel nor engaged. Processing.

A small courtroom: raised bench, brass rail, a dock, a clerk's desk below him stacked with dockets.

Detail: the stack of dockets on the clerk's desk is very tall and he is on the second of them.`,
    palette: `Palette: dark wood, black robe, dusty light from a high window. Flat and institutional.`,
  },
  {
    key: "pip",
    file: "pip.png",
    useReference: true,
    faction: "under",
    rarityLine: RARITY_COMMON,
    subject: `Subject: PIP, common, Rustbound, street child. Black British, dark skin, close-cropped hair. A child of seven or eight, indeterminate, enormous eyes, filthy, wrapped in sacking, sitting in the mouth of an alley with knees drawn up. One of hundreds. Given a face on purpose.

Detail: a wooden Calibration token on a string round the neck, years too early to be theirs, kept as a charm.

Lighting priority: this must NOT be a dark or shadowy image. Even though the alley itself is a modest, plain setting, light Pip's face brightly and directly — as if the nearest gaslamp exists specifically to illuminate him for a portrait. His dark skin must render in clear, bright, well-exposed tones with visible highlights, his huge eyes fully legible, exactly as easy to read as a pale-skinned child's face would be in the same shot. Err strongly on the side of too bright rather than too dark.`,
    palette: `Palette: soot and damp brick in the background only. Pip's own face is brightly and clearly lit, high visibility, not dim, dark or lost in shadow.`,
  },
  {
    key: "ada_voss",
    file: "ada_voss.png",
    useReference: true,
    faction: "neutral",
    rarityLine: RARITY_COMMON,
    subject: `Subject: SECOND EXAMINER ADA VOSS, common, Independent, Calibration staff. East Asian, pale-warm skin, dark hair pinned back. A woman of forty in a black examiner's coat, marking papers by the light of a brass oil lamp at three in the morning — an old-fashioned glass-globed oil lamp with a visible flame, explicitly not an electric desk lamp. Cold tea at her elbow. Her hands are not quite steady and she has stopped writing.

A marking room: long tables, twenty other examiners as blurred shapes further off, bundles of papers, a strata tally sheet.

Detail: one paper pulled clear of the bundle in front of her, and beside it a fresh sheet on which she has written the same small number over and over.`,
    palette: `Palette: warm oil-lamp yellow in a pool from the glass-globed lamp beside her, everything beyond it dark. Close, tired, single-source light. No electric light anywhere in the room. (Her specific single warm light source takes precedence over the neutral split-palette default above.)`,
  },
];

async function genWithReference(subject, prompt) {
  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", prompt);
  form.append("size", "1024x1536");
  form.append("quality", "high");
  form.append("n", "1");
  const refBuffer = fs.readFileSync(STYLE_REFERENCE);
  form.append("image[]", new Blob([refBuffer], { type: "image/png" }), "corvain_style_reference.png");
  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`edits endpoint ${res.status}: ${await res.text()}`);
  return res.json();
}

async function genPlain(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1536", quality: "high", n: 1 }),
  });
  if (!res.ok) throw new Error(`generations endpoint ${res.status}: ${await res.text()}`);
  return res.json();
}

async function gen(subject) {
  console.log("Generating", subject.key, subject.useReference ? "(with Corvain style reference)" : "(text-only)", "...");
  const prompt = buildPrompt(subject);
  let json;
  if (subject.useReference && fs.existsSync(STYLE_REFERENCE)) {
    try {
      json = await genWithReference(subject, prompt);
    } catch (e) {
      console.warn("Reference-image edit failed, falling back to text-only generation:", e.message);
      json = await genPlain(prompt);
    }
  } else {
    json = await genPlain(prompt);
  }
  const outPath = path.join(OUT_DIR, subject.file);
  fs.writeFileSync(outPath, Buffer.from(json.data[0].b64_json, "base64"));
  console.log("Wrote", outPath);
}

async function main() {
  const wanted = process.argv.slice(2);
  const list = wanted.length ? subjects.filter((s) => wanted.includes(s.key)) : subjects;
  for (const s of list) await gen(s); // sequential: avoids rate-limit spikes on high-quality gens
}
main().catch((e) => { console.error(e); process.exit(1); });
