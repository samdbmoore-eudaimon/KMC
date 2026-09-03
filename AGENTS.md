# Kangaroo Maths Quest — AI Context File

Single-file HTML/React educational game for two children (9 & 10) preparing for the UK Junior Maths Challenge. Runs offline in any browser; also packaged as an Android APK via Capacitor. No server, no AI at runtime — all teaching is static, all marking is computed locally.

---

## Build & test

```bash
node scripts/rebuild.cjs            # bundles → KangarooMathsQuest.html + www/index.html
node --check kq-content.js          # syntax check content index
node scripts/gen_sanity_test_junior.cjs
node scripts/gen_sanity_test_primary.cjs
node scripts/gen_sanity_test_intermediate.cjs
```

esbuild bundles everything into a single self-contained HTML file. The source files use ES module syntax (`import`/`export`); esbuild handles the rest.

---

## File map — open only what you need

### Content (data only — open the one file for the section you're editing)

| File | What's inside | When to open |
|---|---|---|
| `content/junior-story.js` | `JUNIOR_STORY_TITLE`, `JUNIOR_STORY` (11 chapters), `JUNIOR_ADVENTURES` (12 adventure scene-graphs) | Editing Junior story or adventures |
| `content/junior-lessons.js` | `JUNIOR_LESSONS` — 40+ lesson objects, each with `sections[]` of `{text, examples:[{q,steps,answer}], tryit}` | Editing or adding Junior lessons |
| `content/primary-story.js` | `PRIMARY_STORY_TITLE`, `PRIMARY_STORY`, `PRIMARY_ADVENTURES` (Ninefold Orchard, 14 adventures) | Editing Primary story or adventures |
| `content/primary-lessons.js` | `PRIMARY_LESSONS` — 25 lesson objects | Editing Primary lessons |
| `content/intermediate-story.js` | `INTERMEDIATE_STORY_TITLE`, `INTERMEDIATE_STORY`, `INTERMEDIATE_ADVENTURES` (Gifford, 14 adventures) | Editing Intermediate story or adventures |
| `content/intermediate-lessons.js` | `INTERMEDIATE_LESSONS` — 28 lesson objects | Editing Intermediate lessons |
| `kq-content.js` | Thin 28-line index — imports the above, re-exports `CONTENT_MODULES`, `STORY_TITLE`, `STORY`, `ADVENTURES`, `LESSONS`, `setContentModule` | Almost never — only if changing the module interface |

### Generators (question logic — open the one module you're changing)

| File | What's inside | When to open |
|---|---|---|
| `generators/gen-shared.js` | `rand`, `pick`, `shuffle`, `gcd`, `buildMC`, `buildMCStr`, `svgBox`, `SL/SC/SR/ST` (SVG helpers), `JUNIOR_TOPICS`, `JUNIOR_CONCEPTS`, name pools, `ACTIVE_MODULE_KEY`, `setModuleActiveVars` | Shared logic used by all three generator files |
| `generators/junior-generators.js` | `JUNIOR_G` (24 generators), `JUNIOR_BOSSES`, `getBossCards` | Editing Junior question generators |
| `generators/primary-generators.js` | `PRIMARY_G` (25 generators), `PRIMARY_BOSSES` | Editing Primary question generators |
| `generators/intermediate-generators.js` | `INTERMEDIATE_G` (28 generators), `INTERMEDIATE_BOSSES` | Editing Intermediate question generators |

### App (React UI — open for UI, game logic, or progress/storage changes)

| File | What's inside | When to open |
|---|---|---|
| `KangarooMathsQuest.jsx` | `MODULES`, `activateModule`, `App`, all screen components (`Home`, `Practice`, `MockTest`, `CardsScreen`, `AdventureRun`, `Storybook`, `Olympiad`, `GrownUps`, `Profiles`, …), storage keys, `freshProgress` | Any UI or game-logic change |

### Art (frozen — never open unless changing art)

| File | What's inside |
|---|---|
| `kq-art.js` | `BOSS_ART` (Junior boss portraits, base64 JPEGs), `CARD_ART` (32 card portraits) |
| `kq-title-art.js` | `TITLE_ART` — Junior home screen illustration |
| `kq-ui-art.js` | `UI_ART` — Junior UI chrome |
| `kq-joey-art.js` | `JOEY_ART` — Joey battle screen assets (not yet integrated) |

### Reference docs (read before making changes to those areas)

| File | What's inside |
|---|---|
| `JOEY_SPEC.md` | Full design spec for the Joey battle mini-game (Phase 0 not yet built) |
| `INTERMEDIATE_DEEP_RESEARCH.md` | Full IMC/Kangaroo/IMOK/GCSE curriculum research — do not re-run this research |
| `ai_deck_construction_algorithm.md` | Joey AI deck-building logic |
| `ai_pass_decision_function.md` | Joey AI pass/play decision logic |
| `ai_play_evaluation_heuristic.md` | Joey AI card evaluation heuristic |
| `edge_case_rulings.md` | Joey edge-case rulings |
| `GIFFORD_CARD_ART_FULL_RULESET.md` | Art direction rules for Intermediate card portraits |

---

## Three modules

| Key | Name | Track | Content files | Generator file |
|---|---|---|---|---|
| `junior` | The Kangaroo Quest | Junior Maths Challenge (Y7–9) | `content/junior-*.js` | `generators/junior-generators.js` |
| `primary` | Ninefold Orchard | Primary / KS2 | `content/primary-*.js` | `generators/primary-generators.js` |
| `intermediate` | Gifford | Intermediate MC / KS4 | `content/intermediate-*.js` | `generators/intermediate-generators.js` |

Switching module: `setContentModule(key)` (in `kq-content.js`) + `activateModule(key)` (in `KangarooMathsQuest.jsx`).

---

## Core game loop

Answer questions → earn stars → 20 stars = 1 card pack → cards build **strength** → strength + passed **level exam** → boss fight → beat boss → unlock next level + story chapter.

- **10 levels** per module; boss n gates level n+1
- **Boss gate:** `collectionStrength >= BOSSES[n].threshold` AND `progress.mocks[level]` is true
- **Exam pass marks** scale per level (`EXAM_PASS_MARKS` map in `KangarooMathsQuest.jsx`)
- **Pack odds** scale with level (`packWeights(lv)`) — median ~37 packs for the full collection

---

## Lesson format

Every lesson object has this shape:

```js
JUNIOR_LESSONS.topicKey = {
  title: "...",
  sections: [
    {
      heading: "...",
      text: "...",
      examples: [
        { q: "easy question", steps: ["step 1", "step 2"], answer: "..." },
        { q: "medium question", steps: ["step 1", "step 2"], answer: "..." },
        { q: "hard question",  steps: ["step 1", "step 2"], answer: "..." },
      ],
      tryit: { q: "...", answer: "..." },  // optional
    },
    // more sections...
  ],
};
```

Every section must have exactly 3 examples (easy / medium / hard). No section should have a single `example: {}` — always `examples: []`.

---

## Adventure format

Adventures are in `content/[module]-story.js` under `[MODULE]_ADVENTURES`. Each adventure is a scene graph:

```js
gf_tambrindle: {
  id: "gf_tambrindle",
  title: "...",
  tagline: "...",
  items: [ {id, name, stat, how, desc}, ... ],   // 3 items per adventure
  components: { key: "name", ... },               // for forge scenes
  start: "sceneName",
  scenes: {
    sceneName: { type: "story"|"skillcheck"|"combat"|"choice"|"puzzle"|"dice"|"forge"|"end", ... }
  }
}
```

Scene types and their required fields are documented in `JOEY_SPEC.md` (combat) and the adventure template in `KangarooQuest_Handover_Guide.md`.

---

## Generator format

Each generator in `JUNIOR_G` / `PRIMARY_G` / `INTERMEDIATE_G` has:

```js
topicKey: {
  generate(difficulty, level) {
    // returns { q, options: [5 strings], correctIndex, solution: [steps] }
    // optionally: { q, svg, options, correctIndex, solution }
  }
}
```

Helpers available in `generators/gen-shared.js`: `rand(a,b)`, `pick(arr)`, `shuffle(arr)`, `gcd(a,b)`, `buildMC(correct, distractors, fmt?)`, `buildMCStr(correct, distractors)`, `svgBox(inner, w, h)`, `SL/SC/SR/ST` (SVG line/circle/rect/text).

---

## Progress / storage

Storage keys: `kq_profiles_v3`, `kq_current_v3`, `kq_prof3_<id>`.

`freshProgress()` shape: `{ unlockedLevel, bossesBeaten, stars, cards, mocks, testHistory, cardItems, adventures, ... }`.

All progress writes go through the `setProgress` callback in `App`; components receive `progress` as a prop. No direct `localStorage` writes in components.

---

## What's shipped vs planned

**Shipped:**
- Junior module: fully complete (generators, lessons, bosses, adventures, story)
- Primary module: fully complete (generators, lessons, bosses, adventures, story — Ninefold Orchard)
- Intermediate module: fully complete (generators, lessons, bosses, adventures, story — Gifford)
- All three modules: 3 worked examples per lesson section (easy/medium/hard)

**Not yet built (Phase 0 / Joey):**
- Joey battle mini-game — full design in `JOEY_SPEC.md`; nothing implemented yet
- First step: add `primaryType` field to all generators (see `JOEY_SPEC.md` §Phase 0)

---

## Style conventions

- UK English throughout (no Oxford commas, no em-dashes — use colons or semicolons)
- Story prose: Pratchett/Tiffany Aching voice — warm, matter-of-fact, never condescending
- No comments in source except for non-obvious invariants
- No TypeScript — plain JS/JSX throughout
- Lesson text targets Year 7 reading level; worked examples increase in difficulty
