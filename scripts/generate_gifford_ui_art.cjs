// Generates title/UI chrome art for the Intermediate module (Gifford) — background,
// borders, icons, title wordmark, mascot, and the two progress-meter icons. This is a
// DIFFERENT asset class from card portraits (generate_gifford_card_art.cjs): flatter,
// more graphic, built to work as UI chrome (9-slice borders, small icons, backgrounds
// with negative space for overlaid UI), not painterly character illustration.
// Run: node scripts/generate_gifford_ui_art.cjs <key> [<key> ...]
"use strict";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error("Set OPENAI_API_KEY first."); process.exit(1); }

const OUT_DIR = path.join(__dirname, "..", "card_art", "gifford_ui");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE_BLOCK = `Digital game UI art for a gothic Victorian steampunk world with no electricity — every light source is gaslight, oil lamp, candle flame or the setting's own brass/steam machinery glow. Palette: brass, oxblood, cream, tarnished silver, rust orange, iron blue-grey, soot black. Fine engraved and etched linework, riveted brass and ironwork detailing. A more graphic, flatter illustration register than a painting — built to read clearly as game-UI chrome at small sizes, not as a moody character portrait. No electric lighting, no LED or fluorescent quality, no modern materials.`;

const NEGATIVE_BLOCK = `No text, no typography, no letters, no numbers, no watermark, no signature, no logo baked into the wrong asset. No photorealistic rendering, no photographic lighting, no 3D render, no glossy PBR material shading. No modern UI flourishes (no drop shadows in a modern flat-design sense, no gradients that look like a phone app). No chibi or cute proportions, no anime eyes. No recognisable real-world branding.`;

function buildPrompt({ subject, extra }) {
  return [STYLE_BLOCK, subject, extra, NEGATIVE_BLOCK].filter(Boolean).join("\n\n");
}

const ICON_COMMON = `Composition: a single bold, simple emblem centred in the frame, reading clearly at very small (40px) size, with a thin circular or shield-shaped brass frame ring around it. Background outside the ring must be fully transparent.`;

const assets = [
  // ---------- TITLE ART ----------
  {
    key: "title_background",
    file: "title_background.jpg",
    size: "1536x1024",
    format: "jpeg",
    subject: `Subject: a wide establishing view of Gifford at dusk — the Rise's Georgian rooftops and church spires above, the Under's brick chimneys and outfall grates below, connected by the great seam of scaffolding and pipework that splits the city. The Differential Engine's cathedral-scale brass machinery glows faintly through a gap in the middle distance, furnace-orange against the dusk sky. Thin plumes of white vent-fog rise from several points in the Under. Composition: keep the upper third and lower quarter of the frame relatively open and uncluttered (sky and low rooftops), since UI text and buttons will be overlaid there — put the busiest detail in the middle band of the image.`,
    extra: `Lighting: dusk sky fading from cool blue-grey at the top to warm oxblood and brass near the horizon, gaslamps just starting to prick out along both levels of the city, furnace-glow accent from the Engine.

CRITICAL FORMAT REQUIREMENT: this is a FULL-BLEED background photo/illustration with NO border, NO frame, NO vignette, NO ornamental edge of any kind. The scene must extend all the way to all four edges of the canvas, corner to corner, exactly like an ordinary photograph or a screen background — absolutely no decorative frame, rounded corners, torches, gearwork border, or picture-frame styling anywhere in this image.`,
  },
  {
    key: "title_front",
    file: "title_front.png",
    size: "1536x1024",
    format: "png",
    transparent: true,
    subject: `Subject: a foreground silhouette layer for a title screen, to sit in front of the main background. Rooftop silhouettes, iron railings, and pipework along the bottom edge of the frame, and thin wisps of white vent-fog drifting up from the bottom corners. The large majority of the frame — especially the entire centre and upper two-thirds — must be completely empty, fully transparent, with art only along the bottom 20% and the two side edges, like a picture-frame vignette.`,
    extra: `This is a transparent-background overlay asset: only the described silhouette and fog elements should have any opacity at all. Everything else must be pure transparency, not a dark or black fill.`,
  },
  {
    key: "title_wordmark",
    file: "title_wordmark.png",
    size: "1536x1024",
    format: "png",
    transparent: true,
    subject: `Subject: an ornamental brass-and-iron decorative frame or flourish suitable for a game logo panel — riveted brass corner scrollwork, a central engraved rectangular plate shape, cogwheel motifs at the corners. The centre of the plate must be left plain and empty (flat brass, no engraving) so text can be added separately on top. Background outside the ornamental frame must be fully transparent.`,
    extra: `This asset provides decorative framing only — it must NOT contain any lettering, numerals or wordmark text of its own.`,
  },
  {
    key: "mascot",
    file: "mascot.png",
    size: "1024x1536",
    format: "png",
    transparent: true,
    subject: `Subject: ROOKE, a fourteen-year-old Rustbound girl, small and slight but wiry, in a three-quarter standing pose suitable for a floating UI mascot icon — turned slightly toward the viewer, one hand raised or resting on a satchel strap, a small determined half-smile rather than her usual watchful stillness. Black hair cut short and unevenly, chin-length at the sides. A grey wool coat two sizes too large, mended at both elbows. Full figure, from head to about mid-thigh, isolated against a fully transparent background with no scene or environment behind her at all.`,
    extra: `Style: matches the game's stylised adult-animated character register — naturalistic proportions, soft painterly shading, not flat vector cel-fill. Lighting: a single soft warm key light on her face and coat, cool ambient fill, gentle rim light to separate her silhouette from the transparent background. Background must be fully and completely transparent, not a solid colour fill.`,
  },
  // ---------- HUB CHROME ----------
  {
    key: "panel_frame",
    file: "panel_frame.png",
    size: "1024x1536",
    format: "png",
    transparent: true,
    subject: `Subject: a decorative rectangular picture-frame border, designed as a 9-slice UI border image. Riveted brass edges with etched ironwork scrollwork running along all four sides, oxblood-and-cream enamel inlay accents at the midpoints of each edge, ornate brass cogwheel-and-scroll flourishes at all four corners (more elaborate than the plain edges). The entire centre of the frame — roughly the middle 70% of the image, in both directions — must be completely flat, empty and fully transparent, since this area will be filled with other content. The border itself should be a fairly narrow band around the very outside of the frame, not a thick filled rectangle.`,
    extra: `This must work correctly as a CSS border-image: the centre region has to be genuinely empty and transparent, with all the decorative brass/ironwork detail concentrated in a border band close to the outer edge, symmetrical on all four sides, corners distinct and more ornate than the edges.`,
  },
  {
    key: "hub_background",
    file: "hub_background.jpg",
    size: "1536x1024",
    format: "jpeg",
    subject: `Subject: a wide, atmospheric but visually QUIET view of Gifford's skyline at dusk, seen from a middle distance — the Rise's rooftops on the upper level, the Under's chimneys and grates below, softly out of focus, desaturated slightly compared to a card illustration so that foreground UI panels and text remain easy to read when overlaid on top. Very little fine detail in the centre of the frame; interest concentrated near the edges.`,
    extra: `Lighting: soft, even, slightly hazy dusk light — deliberately calmer and less contrasty than a dramatic character-card scene, since this sits BEHIND UI content across the whole screen. Avoid any single bright hotspot in the centre of the frame.

CRITICAL FORMAT REQUIREMENT: this is a FULL-BLEED background photo/illustration with NO border, NO frame, NO vignette, NO ornamental edge of any kind, and NO decorative objects like torches or portholes placed at the corners. The scene must extend all the way to all four edges of the canvas, corner to corner, exactly like an ordinary screen background — absolutely no picture-frame styling anywhere in this image.`,
  },
  {
    key: "logo_compact",
    file: "logo_compact.png",
    size: "1536x1024",
    format: "png",
    transparent: true,
    subject: `Subject: a small horizontal brass name-plate shape suitable for a compact header logo — a narrow riveted brass rectangular plate with rounded corners, cogwheel rivets at each end, the plate's own centre left flat and empty for text to be placed on top separately. Background fully transparent, extremely wide and short aspect (the plate should occupy a thin horizontal band across the middle of the frame, mostly empty above and below it).`,
    extra: `Decorative frame only — must NOT contain any lettering, numerals or wordmark text of its own. Background must be fully transparent everywhere except the brass plate shape itself.`,
  },
  {
    key: "meter_pack_icon",
    file: "meter_pack_icon.png",
    size: "1024x1536",
    format: "png",
    transparent: true,
    subject: `Subject: a small fanned stack of collectible cards, seen edge-on and slightly angled, brass-cornered card backs with a simple engraved cogwheel-and-eye emblem on the visible top card back. This icon represents a player's card collection in a progress meter. Compact, bold, centred composition, reads clearly at small size, background fully transparent.`,
    extra: `Keep the design simple and iconic rather than detailed or painterly — this must be legible as a small icon inside a progress bar.`,
  },
  {
    key: "meter_boss_icon",
    file: "meter_boss_icon.png",
    size: "1024x1536",
    format: "png",
    transparent: true,
    subject: `Subject: the Differential Engine's great brass dial-ring motif — a circular brass dial face with a stylised open-eye symbol at its centre and a single needle, representing the boss-battle progress meter. Compact, bold, centred composition, reads clearly at small size, background fully transparent.`,
    extra: `Keep the design simple and iconic rather than detailed or painterly — this must be legible as a small icon inside a progress bar.`,
  },
  // ---------- SMALL NAV ICONS (300x300, transparent) ----------
  {
    key: "icon_lessons",
    file: "icon_lessons.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: an open leather-bound ledger book with a brass clasp, a quill resting across the open pages. ${ICON_COMMON}`,
  },
  {
    key: "icon_guided",
    file: "icon_guided.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: a brass drafting compass (the geometry-tool kind, two hinged legs) resting open over a small slate tablet. ${ICON_COMMON}`,
  },
  {
    key: "icon_practice",
    file: "icon_practice.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: a small chalk-slate tablet with a stub of chalk resting diagonally across it, a few simple chalked numerals-shaped scribbles suggested but not legible as real text. ${ICON_COMMON}`,
  },
  {
    key: "icon_storybook",
    file: "icon_storybook.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: an open storybook with a wisp of white vent-fog curling up from between its pages. ${ICON_COMMON}`,
  },
  {
    key: "icon_academy",
    file: "icon_academy.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: a brass mortarboard-shaped academic cap with a small tassel, resting atop a stack of two books. ${ICON_COMMON}`,
  },
  {
    key: "icon_olympiad",
    file: "icon_olympiad.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: a brass medal on a ribbon, engraved with a small laurel-wreath pattern. ${ICON_COMMON}`,
  },
  {
    key: "icon_test",
    file: "icon_test.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: an old brass pocket watch, open on its hinge, face showing plain clock hands (no numerals need be legible). ${ICON_COMMON}`,
  },
  {
    key: "icon_cards",
    file: "icon_cards.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: two collectible cards fanned slightly apart, brass-cornered card backs with a simple engraved cogwheel emblem. ${ICON_COMMON}`,
  },
  {
    key: "icon_adventures",
    file: "icon_adventures.png",
    size: "1024x1024",
    format: "png",
    transparent: true,
    subject: `Icon subject: a folded paper map or docket, sealed with a small dab of wax, sitting atop a coiled length of rope. ${ICON_COMMON}`,
  },
];

async function genPlain(prompt, size, transparent) {
  const body = { model: "gpt-image-1", prompt, size, quality: "high", n: 1 };
  if (transparent) body.background = "transparent";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`generations endpoint ${res.status}: ${await res.text()}`);
  return res.json();
}

async function gen(asset) {
  console.log("Generating", asset.key, `(${asset.size}${asset.transparent ? ", transparent" : ""})`, "...");
  const prompt = buildPrompt(asset);
  const json = await genPlain(prompt, asset.size, asset.transparent);
  const outPath = path.join(OUT_DIR, asset.file);
  fs.writeFileSync(outPath, Buffer.from(json.data[0].b64_json, "base64"));
  console.log("Wrote", outPath);
}

async function main() {
  const wanted = process.argv.slice(2);
  const list = wanted.length ? assets.filter((a) => wanted.includes(a.key)) : assets;
  for (const a of list) {
    try {
      await gen(a);
    } catch (e) {
      console.error("FAILED:", a.key, e.message);
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
