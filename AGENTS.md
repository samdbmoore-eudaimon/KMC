# Wallaby Maths — AI Context File

Single-file HTML/React educational game for two children (9 & 10) preparing for the UK Junior Maths Challenge. Runs offline in any browser; also packaged as an Android APK via Capacitor. No server, no AI at runtime — all teaching is static, all marking is computed locally.

For any Expeditions work, read `EXPEDITIONS_MASTER_BRIEF.md` first. It is the central
entry point and records the current product, art, scenario and coordination decisions.

---

## Build & test

```bash
node scripts/rebuild.cjs            # bundles → WallabyMaths.html + www/index.html
node --check wm-content.js          # syntax check content index
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
| `wm-content.js` | Thin 28-line index — imports the above, re-exports `CONTENT_MODULES`, `STORY_TITLE`, `STORY`, `ADVENTURES`, `LESSONS`, `setContentModule` | Almost never — only if changing the module interface |

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
| `WallabyMaths.jsx` | `MODULES`, `activateModule`, `App`, all screen components (`Home`, `Practice`, `MockTest`, `CardsScreen`, `AdventureRun`, `Storybook`, `Olympiad`, `ProgressReport`, `Profiles`, `AccountPanel`, …), storage keys, `freshProgress` | Any UI or game-logic change |
| `wm-entitlement.js` | Account/subscription client: magic-link sign-in, licence redemption, and `verifyCertificate`/`getCurrentEntitlement` (offline, Ed25519, no network call) | Editing account/paywall/gating logic |

### Backend (parent accounts & subscriptions — see `cloudflare-worker/accounts/README.md`)

Deployed separately from `kq-sync` (device progress sync, unchanged). `wallaby-accounts`
Worker + D1 database: magic-link auth, signed 365-day offline entitlement certificates,
licence-batch/gift redemption, an `/admin` panel, and a not-yet-connected Paddle webhook
stub. Content gating is wired in: Junior/Intermediate are locked behind entitlement
(module switch AND app resume, not just switch), and Primary has all six of the brief's
freemium caps (level 1, first 5 lessons, chapter 1, first 2 adventures, 1 card pack, 1 Joey
match) — all keyed off `primaryFreemiumCapped` in WallabyMaths.jsx. See the README's
"Not yet done" for what's still open (Resend, Paddle, reminder emails, Android IAP).

### Art (frozen — never open unless changing art)

| File | What's inside |
|---|---|
| `wm-art.js` | `BOSS_ART` (Junior boss portraits, base64 JPEGs), `CARD_ART` (32 card portraits) |
| `wm-title-art.js` | `TITLE_ART` — Junior home screen illustration |
| `wm-ui-art.js` | `UI_ART` — Junior UI chrome |
| `wm-joey-art.js` | `JOEY_ART` — Joey battle screen assets (not yet integrated) |

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

Note: "Kangaroo" in `INTERMEDIATE_DEEP_RESEARCH.md` and elsewhere in curriculum research/audit docs refers to the real UKMT Kangaroo competition (the actual exam these modules prepare pupils for) — that is a factual reference, not app branding, and must never be renamed.

---

## Three modules

| Key | Name | Track | Content files | Generator file |
|---|---|---|---|---|
| `junior` | Little Reckoning | Junior Maths Challenge (Y7–9) | `content/junior-*.js` | `generators/junior-generators.js` |
| `primary` | Ninefold Orchard | Primary / KS2 | `content/primary-*.js` | `generators/primary-generators.js` |
| `intermediate` | Gifford | Intermediate MC / KS4 | `content/intermediate-*.js` | `generators/intermediate-generators.js` |

Switching module: `setContentModule(key)` (in `wm-content.js`) + `activateModule(key)` (in `WallabyMaths.jsx`).

---

## Core game loop

Answer questions → earn stars → 20 stars = 1 card pack → cards build **strength** → strength + passed **level exam** → boss fight → beat boss → unlock next level + story chapter.

- **10 levels** per module; boss n gates level n+1
- **Boss gate:** `collectionStrength >= BOSSES[n].threshold` AND `progress.mocks[level]` is true
- **Exam pass marks** scale per level (`EXAM_PASS_MARKS` map in `WallabyMaths.jsx`)
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

Storage keys: `wm_profiles_v3`, `wm_current_v3`, `wm_prof3_<id>`. (Pre-rebrand `kq_*` keys are migrated forward once, automatically, on first load after the rebrand — see `migrateOldStorageKeys` in `WallabyMaths.jsx`.)

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
