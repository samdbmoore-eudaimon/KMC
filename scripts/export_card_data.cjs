"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TYPE_NAMES = ["Arithmetic", "Geometry", "Logic", "Science", "Speed"];

// Balance-bracket extractor: finds the object/array starting at `marker` and returns its text.
function extractBlock(src, marker, openChar) {
  const idx = src.indexOf(marker);
  if (idx === -1) return null;
  const start = src.indexOf(openChar, idx);
  if (start === -1) return null;
  let depth = 0, i = start;
  for (; i < src.length; i++) {
    if (src[i] === "[" || src[i] === "{") depth++;
    else if (src[i] === "]" || src[i] === "}") { depth--; if (depth === 0) break; }
  }
  return src.slice(start, i + 1);
}

function extractArray(file, marker) {
  const src = fs.readFileSync(file, "utf8");
  const text = extractBlock(src, marker, "[");
  if (!text) return null;
  try {
    return new Function(`return ${text}`)();
  } catch (e) {
    console.error(`Parse error for ${marker}:`, e.message.slice(0, 80));
    return null;
  }
}

// Returns Map<cardId, [stat0, stat1, stat2]> — the three item stat indices for each adventure.
// Works regardless of indentation style (0-space or 2-space top-level keys).
function extractAdventureStatBumps(file, adventuresMarker) {
  const src = fs.readFileSync(file, "utf8");

  const adventuresStart = src.indexOf(adventuresMarker);
  if (adventuresStart === -1) return new Map();
  const objOpen = src.indexOf("{", adventuresStart);
  if (objOpen === -1) return new Map();

  let depth = 0, adventuresEnd = objOpen;
  for (let i = objOpen; i < src.length; i++) {
    if (src[i] === "{" || src[i] === "[") depth++;
    else if (src[i] === "}" || src[i] === "]") { depth--; if (depth === 0) { adventuresEnd = i; break; } }
  }

  const adventuresSrc = src.slice(objOpen, adventuresEnd + 1);
  const result = new Map();

  // Strategy: find each top-level `id: "cardId"` (the adventure's own id field, not an item's).
  // For each, find the immediately following `items: [...]` block and extract stat values.
  // Skip item-level id fields by checking `items:` comes before the next `id:`.
  const idRe = /\bid:\s*"([^"]+)"/g;
  let idMatch;
  while ((idMatch = idRe.exec(adventuresSrc)) !== null) {
    const cardId = idMatch[1];
    const afterId = idMatch.index + idMatch[0].length;

    const itemsIdx = adventuresSrc.indexOf("items:", afterId);
    if (itemsIdx === -1) continue;

    // Ensure no other `id:` appears between this one and `items:` (which would mean
    // we are inside an item object, not at the adventure level).
    const nextIdIdx = adventuresSrc.indexOf("id:", afterId + 1);
    if (nextIdIdx !== -1 && itemsIdx > nextIdIdx) continue;

    const itemsOpen = adventuresSrc.indexOf("[", itemsIdx);
    if (itemsOpen === -1) continue;

    let d = 0, itemsEnd = itemsOpen;
    for (let i = itemsOpen; i < adventuresSrc.length; i++) {
      if (adventuresSrc[i] === "[" || adventuresSrc[i] === "{") d++;
      else if (adventuresSrc[i] === "]" || adventuresSrc[i] === "}") { d--; if (d === 0) { itemsEnd = i; break; } }
    }

    const itemsText = adventuresSrc.slice(itemsOpen, itemsEnd + 1);
    const statMatches = [...itemsText.matchAll(/\bstat:\s*(\d+)/g)];
    const stats = statMatches.map(m => parseInt(m[1]));
    if (stats.length > 0) result.set(cardId, stats);
  }

  return result;
}

function primaryType(s) {
  let best = 0;
  for (let i = 1; i < s.length; i++) if (s[i] > s[best]) best = i;
  return best;
}

function normaliseCard(card) {
  const ranges = { common: [12, 15], uncommon: [18, 21], rare: [25, 28], epic: [33, 36], legendary: [44, 46] };
  const range = ranges[card.r];
  if (!range) return card;
  const type = primaryType(card.s);
  const stats = card.s.slice();
  const current = stats.reduce((sum, value) => sum + value, 0);
  const target = Math.max(range[0], Math.min(range[1], current));
  let delta = target - current;
  while (delta > 0) {
    const candidates = stats.map((value, index) => ({ value, index }))
      .filter(({ index, value }) => index !== type && value + 1 <= stats[type])
      .sort((a, b) => a.value - b.value || a.index - b.index);
    stats[candidates[0]?.index ?? type]++;
    delta--;
  }
  while (delta < 0) {
    const candidates = stats.map((value, index) => ({ value, index }))
      .filter(({ index, value }) => index !== type && value > 1)
      .sort((a, b) => b.value - a.value || b.index - a.index);
    stats[candidates[0]?.index ?? type]--;
    delta++;
  }
  card.s = stats;
  card.bv = stats.reduce((sum, value) => sum + value, 0);
  card.primaryType = type;
  return card;
}

const rows = [];
rows.push(["module", "set", "id", "name", "rarity", "type", "bv", "arith", "geom", "logic", "sci", "speed"].join("\t"));

const modules = [
  {
    key: "primary", label: "Ninefold Orchard",
    cardsFile: "generators/primary-generators.js",
    cardsMarker: "export const PRIMARY_CARDS", bossMarker: "export const PRIMARY_BOSSES",
    storyFile: "content/primary-story.js", adventuresMarker: "export const PRIMARY_ADVENTURES",
  },
  {
    key: "junior", label: "Little Reckoning",
    cardsFile: "generators/junior-generators.js",
    cardsMarker: "export const JUNIOR_CARDS", bossMarker: "export const JUNIOR_BOSSES",
    storyFile: "content/junior-story.js", adventuresMarker: "export const JUNIOR_ADVENTURES",
  },
  {
    key: "intermediate", label: "Gifford",
    cardsFile: "generators/intermediate-generators.js",
    cardsMarker: "export const INTERMEDIATE_CARDS", bossMarker: "export const INTERMEDIATE_BOSSES",
    storyFile: "content/intermediate-story.js", adventuresMarker: "export const INTERMEDIATE_ADVENTURES",
  },
];

for (const mod of modules) {
  const cardsFile = path.join(ROOT, mod.cardsFile);
  const storyFile = path.join(ROOT, mod.storyFile);
  console.log(`\n=== ${mod.label} ===`);

  // Load adventure stat bumps: Map<cardId, [statIdx, ...]>
  const adventureBumps = extractAdventureStatBumps(storyFile, mod.adventuresMarker);
  console.log(`  ${adventureBumps.size} adventures found`);

  const cards = extractArray(cardsFile, mod.cardsMarker);
  if (cards) {
    console.log(`  ${cards.length} creature cards`);
    for (const c of cards) {
      normaliseCard(c);
      const baseS = c.s || [0, 0, 0, 0, 0];
      const t = c.primaryType != null ? c.primaryType : primaryType(baseS);

      // Base row
      rows.push([mod.label, c.set || mod.key, c.id, c.name, c.r, TYPE_NAMES[t], c.bv, ...baseS].join("\t"));

      // Upgraded row — only for cards with an adventure
      const bumps = adventureBumps.get(c.id);
      if (bumps) {
        const upgS = [...baseS];
        for (const si of bumps) upgS[si]++;
        const upgBv = c.bv + bumps.length; // +1 BV per item (3 items = +3)
        const upgT = t;
        rows.push([mod.label, c.set || mod.key, c.id + "_upgraded", c.name + " (upgraded)", c.r + "_upgraded", TYPE_NAMES[upgT], upgBv, ...upgS].join("\t"));
      }
    }
  } else {
    console.log("  FAILED to parse cards");
  }

  const bosses = extractArray(cardsFile, mod.bossMarker);
  if (bosses) {
    console.log(`  ${bosses.length} bosses`);
    for (const b of bosses) {
      normaliseCard(b);
      const t = primaryType(b.s);
      const s = b.s || [0, 0, 0, 0, 0];
      const bv = s.reduce((a, v) => a + v, 0);
      rows.push([mod.label, mod.key + "_bosses", `boss_${mod.key}_${b.n}`, b.name, `boss_L${b.n}`, TYPE_NAMES[t], bv, ...s].join("\t"));
    }
  } else {
    console.log("  FAILED to parse bosses");
  }
}

const outPath = path.join(ROOT, "card_data_export.tsv");
fs.writeFileSync(outPath, rows.join("\n"), "utf8");
console.log(`\nWrote ${rows.length - 1} rows to card_data_export.tsv`);
