// Generates the first 3 character-art test pieces for the Intermediate module's story world
// (Gearford: Wrought vs Rustbound, steampunk-with-cyberpunk-tinges, Arcane-style adult
// animation) so Sam can check the visual direction before we commit to art for the full cast.
"use strict";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error("Set OPENAI_API_KEY first."); process.exit(1); }

const OUT_DIR = path.join(__dirname, "..", "card_art", "gearford_cast");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = `Art style: adult animated series, painterly digital illustration in the vein of Arcane (League of Legends: Arcane) — moody cinematic lighting, textured brushwork, dramatic rim light, visible grain, a gothic industrial steampunk-with-cyberpunk-tinges city of brass, iron, soot, glass and faint electric-blue arc-light. This is explicitly NOT a children's cartoon style — no cute proportions, no whimsy, no bright flat colours. Realistic adult proportions, serious/weathered expressions, character-portrait framing (head and upper torso, three-quarter angle), plain dark moody gradient background (no text, no logos, no border, no frame), single character only.`;

const subjects = [
  {
    file: "rooke.png",
    prompt: `${STYLE}

Subject: ROOKE, a teenage girl from the Rustbound underclass of the city of Gearford. She deliberately makes herself look unremarkable: patched, soot-stained work clothes, fingerless gloves, a scavenged leather satchel of tools slung across her chest, hair tied back rough and practical, a smudge of engine grease across one cheekbone. But her eyes give her away: sharp, quick, calculating, the eyes of someone doing complex sums in her head at all times while trying very hard to look like she isn't. Warm amber and rust-brown lighting, low steam-lit undercity glow behind her.`,
  },
  {
    file: "marrow.png",
    prompt: `${STYLE}

Subject: MARROW, a young adult tiger-man (anthropomorphic humanoid with a tiger's striped fur, ears and facial structure, otherwise a powerfully built humanoid man), a boiler-yard worker from the Rustbound underclass of the city of Gearford. Heavy scarring and soot across his forearms, rolled-up sleeves, a worn leather harness/strap rig for carrying tools and scavenged parts, a grim, coiled-tension expression, someone who has been treated as lesser his whole life and has started to answer that with quiet, dangerous anger. Warm amber and rust-brown lighting matching the same undercity as Rooke, low steam-lit glow.`,
  },
  {
    file: "corvane.png",
    prompt: `${STYLE}

Subject: CORVANE, a young adult woman, a junior magistrate-engineer of the ruling Wrought class in the city of Gearford. Sharp, structured Victorian-industrial formal coat with brass buttons and a stiff high collar, a small engraved brass insignia of rank at the throat, hair immaculately kept, posture perfectly controlled, composed and severe on the surface with real doubt and strain visible around her eyes. Cooler lighting than the other two: pale silver-blue arc-light and deep violet shadow, a refined, clean, slightly cold palette contrasting the underclass's warm amber grime.`,
  },
];

async function gen(subject) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: subject.prompt, size: "1024x1536", quality: "high", n: 1 }),
  });
  if (!res.ok) { console.error("FAILED", subject.file, res.status, await res.text()); return; }
  const json = await res.json();
  const outPath = path.join(OUT_DIR, subject.file);
  fs.writeFileSync(outPath, Buffer.from(json.data[0].b64_json, "base64"));
  console.log("Wrote", outPath);
}

async function main() {
  for (const s of subjects) await gen(s); // sequential: avoids rate-limit spikes on 3 high-quality gens
}
main().catch((e) => { console.error(e); process.exit(1); });
