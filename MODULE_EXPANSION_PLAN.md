# Kangaroo Maths Quest — Multi-Module Expansion Plan

Started 2026-07-25. This is the working plan for turning the app from a single Junior
Maths Challenge (JMC) experience into three selectable tracks: **Primary**, **Junior**
(existing, unchanged), and **Intermediate**. Read this file first in any new
conversation picking up this initiative — it's meant to survive a context reset.

## 1. What we're building

A player picks a module once, at profile creation ("Which of the three would you like
to play?"), alongside their name/avatar. That choice is fixed for the profile.

| | Primary Maths Challenge | Junior Maths Challenge (existing) | Intermediate Maths Challenge |
|---|---|---|---|
| Ages / stage | 8–11, KS2 | 11–13, start of KS3 | 14–16, end of KS3 |
| Challenge exam | — (none) | JMC | IMC |
| Kangaroo | ✅ (only tier) | ✅ | ✅ |
| Olympiad | — (none) | ✅ (40 problems) | ✅ |
| Olympiad Academy | — (none) | ✅ (18 modules) | ✅ |
| Cards | 30 new | 30 existing (unchanged) | 30 new |
| Adventures | TBD — likely simplified | 17 existing (unchanged) | ~17, full parity |
| Story | ~10 new chapters | 11 existing (unchanged) | ~10 new chapters |
| Generators/Lessons | new, tuned to KS2 + greater depth | existing (unchanged) | new, tuned to IMC-level curriculum |
| Source material | KS2 curriculum doc, greater-depth doc, ~2 example papers | (already built) | 10 IMC papers, 10 Intermediate Olympiad papers, 10 Intermediate Kangaroo papers |

Intermediate is explicitly "almost an exact copy of Junior" — same structural depth,
just re-themed and re-tuned. Primary is deliberately simpler (Kangaroo-only, no
Challenge exam, no Olympiad/Academy), which is also why we're building it first.

**One profile can play all three modules** (resolved 2026-07-25 — see §3). A player
switches which module they're playing (like switching between named profiles today,
but within one profile), and their card collection persists and is visible across all
three: "here's my Primary collection, here's my Junior collection, here's my
Intermediate collection." A card only ever counts toward its OWN module's boss-tower
strength and can only be taken on that module's adventures — a Primary card never
counts toward Junior's power requirement and can't be brought on a Junior adventure.
Everything else about progress (level, bosses beaten, mocks sat, story chapters read,
adventures completed, Academy modules done, Olympiad problems attempted) is fully
self-contained per module.

**Shared world, distinct settings** (Sam's direction, 2026-07-25): the three modules
can live in the same overarching fictional world, but in different places — e.g.
Junior's story is set in Little Reckoning; Primary could be set in a neighbouring town
in the same world, with its own story and its own set of bosses. Not an architectural
constraint, just creative direction for whoever writes each module's story in Phase
1/2.

## 2. Architecture findings (researched 2026-07-25, not yet implemented)

Two source files hold everything today: `KangarooMathsQuest.jsx` (~9,785 lines — app
shell, generators, `CARDS`, `TOPICS`, `OLYMPIAD`, `ACADEMY`, the level/exam-band system)
and `kq-content.js` (~6,768 lines — `STORY`, `ADVENTURES`, `LESSONS`). Every one of
`CARDS`, `TOPICS`/`DEEP_TOPICS`, `CONCEPTS`, `G` (the generator object), `ADVENTURES`,
`STORY`, `LESSONS`, `OLYMPIAD`, `ACADEMY`, `MAX_LEVEL`/`BOSSES`/`EXAM_PASS_MARKS`/
`examKindFor`/`EXAM_NAMES` is a bare top-level `const`, referenced directly by name
throughout the codebase (~100+ call sites combined) — nothing is passed as a prop or
looked up through an accessor today.

**Chosen approach: swap the bundle for gameplay content, but keep progress split into
a shared part and a per-module part.** Within one screen/session, exactly one module's
content is "active" (its cards, generators, lessons, story, bosses) — so `CARDS`,
`TOPICS`, `G`, `ADVENTURES`, `STORY`, `LESSONS`, `OLYMPIAD`, `ACADEMY`, and the
level/exam-band system (`MAX_LEVEL`/`BOSSES`/`EXAM_PASS_MARKS`/`examKindFor`/
`EXAM_NAMES`) still travel together as one **module bundle**, rebound whenever the
player switches which module they're playing — not rewritten at every one of the
~100+ call sites. Concretely:

```js
const MODULES = {
  primary:      { CARDS, RARITY, CARD_CLASS, ADVENTURES, STORY, LESSONS, TOPICS,
                  DEEP_TOPICS, CONCEPTS, G, OLYMPIAD, OLYMPIAD_PLAYBOOK, ACADEMY,
                  MAX_LEVEL, BOSSES, EXAM_PASS_MARKS, examKindFor, EXAM_NAMES,
                  NAMES_COMMON, NAMES_RARE, NAMES_EPIC, NAMES_LEGENDARY, MAX_STRENGTH_TOTAL },
  junior:       { ...same shape, existing content... },
  intermediate: { ...same shape, new content... },
};
```

But **`progress` itself now splits into a shared part and a per-module part**
(resolved 2026-07-25, see §1/§3): `cards`, `cardItems`, `xp`, `stars`, `packs`,
`badges`, `streakDay`/`lastDay`, `lessonsRead`, `notepad` stay exactly as they are
today — one flat, shared blob on the profile, since card ownership and overall
currency/engagement persist across all three modules. Everything else that's
about progression through ONE module's own curriculum — `unlockedLevel`,
`bossesBeaten`, `mocks`, `testHistory`, `bestTest`, `chaptersRead`, `adventures`,
`academy`, `olympiad`, `topicStats`, `shinyBosses`, `shinyPasses`,
`packsSinceEpic`/`packsSinceLegendary` — moves under a `progress.modules[moduleKey]`
bucket, one per module the profile has ever played:

```js
progress = {
  // shared across all modules this profile plays
  cards: {}, cardItems: {}, xp: 0, stars: 0, packs: 0, badges: [],
  streakDay: 0, lastDay: null, lessonsRead: 0, sessionStreak: 0, notepad: {...},
  // self-contained per module
  modules: {
    primary:      { unlockedLevel: 1, bossesBeaten: 0, mocks: {}, testHistory: [], ... },
    junior:       { unlockedLevel: 1, bossesBeaten: 0, mocks: {}, testHistory: [], ... },
    intermediate: { unlockedLevel: 1, bossesBeaten: 0, mocks: {}, testHistory: [], ... },
  },
}
```

This is genuinely simpler than the original plan, not more complex — as Sam put it,
"the profile needs to only remember which cards it has unlocked, otherwise the
progress of each module is self contained." A `freshProgress()` for a module the
profile hasn't touched yet is just `freshModuleProgress()` slotted into
`progress.modules[key]` on first entry; the shared top-level fields never get reset.

**Boss/strength economy stays exactly as naturally-scoped as originally found** —
`collectionStrength` sums `progress.cards` (the shared dict) filtered through
whichever module's own `CARDS` array is passed in, so a Primary card never
contributes to Junior's total and vice versa, automatically, just by which `CARDS`
list is being iterated. `BOSSES[n].need` thresholds stay independent per module. No
cross-module balancing work needed — this part of the original research holds.

**`CardsScreen` (Card Lab) does need one real change**, per Sam's "see them in
groups" request: since a profile can own cards from all three modules at once, Card
Lab should show **three grouped sections** (Primary / Junior / Intermediate), each
rendering that module's own `CARDS` array filtered through the shared `progress.cards`
— not a deep architectural change (each module's cards/rarity/adventures already stay
correctly bundled together per module), just three render passes instead of one, with
a section header each.

**File layout**: split content by module for manageability — rename `kq-content.js` →
`kq-content-junior.js`, add `kq-content-primary.js` and `kq-content-intermediate.js`
with the same shape (STORY/ADVENTURES/LESSONS), and likely also extract `CARDS`/
`TOPICS`/`G`/`OLYMPIAD`/`ACADEMY` out of the giant jsx file into per-module files
(`kq-cards-primary.js`, `kq-generators-primary.js`, etc.) both for manageability and as
the natural home for each module's bundle object. `scripts/rebuild.cjs` and
`build-android-apk.ps1` need **zero changes** either way — esbuild bundles whatever the
entry point transitively imports, so adding new source files just means adding an
`import` somewhere reachable.

**Profile schema**: `name`/`avatar` on the profile shell stay exactly as they are —
module choice is NOT a one-time creation decision, since one profile can play all
three. Instead, add an `activeModule` field to the profile shell purely as a
"resume where I left off" default (updated whenever the player switches), plus a
module-switcher entry point alongside the existing "switch player" button —
mechanically the same kind of choice, just switching *module* instead of *profile*,
reusing the same picker-UI pattern already proven for profiles. `freshProgress()`
splits as described above: the shared top-level fields stay as they are; a new
`freshModuleProgress()` is created lazily into `progress.modules[key]` the first time
a profile enters a module it hasn't played before.

## 3. Open questions

**Resolved 2026-07-25:**

1. ~~Module scoping model~~ — **one profile can play all three modules.** Cards
   persist and are visible across all of them (Card Lab shows three grouped
   sections), but a card only counts toward its own module's boss-tower strength and
   can only be taken on that module's adventures. Progress (level, bosses, mocks,
   story, adventures, Academy, Olympiad) is fully self-contained per module. See §1/§2
   for the resulting `progress` schema. This is the design driving the whole
   architecture section above now — it replaced the original "bundle swap, module
   fixed forever" assumption with "shared cards + per-module progress buckets,"
   which Sam correctly predicted would make the refactor *smaller*, not bigger.
2. ~~Session/conversation boundaries~~ — **Phase 0 starts in a fresh conversation.**
   This conversation's job was scoping only; the next one should open with "continue
   the module expansion plan, start Phase 0" and read this file first.
3. ~~Shared universe vs. separate worlds~~ — **same world, different settings.**
   Junior is set in Little Reckoning; Primary/Intermediate can be neighbouring towns
   in the same fictional world, each with their own story and bosses. Not an
   architectural constraint — creative direction for whoever writes each module's
   story.

Not gating — can be answered later, during the relevant phase:
- Shared narrative universe (same "Muddle King" mythos, different age-appropriate
  villain arc per module) vs. entirely separate worlds/mascots per module.
- Intermediate's third exam-band name (Junior's is `examKindFor` → `"year9"`,
  displayed as "Year 9 Challenge" — Intermediate needs an equivalent label for its
  hardest band).
- Primary adventure design — "a bit more simplified" per Sam; exact shape (fewer
  scenes per adventure? fewer heroes? no adventures at all, just cards+practice?) to
  be decided once the KS2 materials are in hand and we can see how much content the
  curriculum actually supports.

## 4. Phasing

- **Phase 0 — Architecture refactor.** Build the `MODULES` bundle system; split
  `progress` into shared fields + `progress.modules[key]` buckets (with a
  `freshModuleProgress()` created lazily on first entry to a module); migrate
  Junior's existing content into the `junior` bundle **unchanged** (pure refactor —
  prove JMC still behaves identically via full regression before touching anything
  else); add a module-switcher entry point next to "switch player," defaulting to
  `activeModule` on the profile shell; update Card Lab to render three grouped
  sections. Primary/Intermediate can be stubbed "coming soon" (locked tiles) until
  their content lands in Phases 1/2. No new content authored in this phase — doesn't
  need any material from Sam.
- **Phase 1 — Primary content.** 30 cards, adventures (shape TBD per open questions),
  ~10-chapter story, generators/lessons tuned to KS2 + greater depth, Kangaroo-only
  mock papers. Blocked on: KS2 curriculum doc, greater-depth documentation, ~2 example
  PMC papers. **Material received 2026-07-25; all 25 planned generator topics (168
  closures) shipped and verified the same day** — see the status log below.
  **Remaining Phase 1 work**: rich LESSONS per topic (only short CONCEPTS cards
  exist so far); 30 cards; adventures; ~10-chapter story; boss tower — the last
  four need Sam's input on Primary's creative direction first (§1).
- **Phase 2 — Intermediate content.** Full parity build: 30 cards, ~17 adventures,
  ~10-chapter story, generators/lessons tuned to IMC-level curriculum, Olympiad (40
  problems, mirroring Junior's structure), Academy (18 modules, mirroring Junior's
  curriculum), 3-band mock papers. Blocked on: 10 IMC papers, 10 Intermediate Olympiad
  papers, 10 Intermediate Kangaroo papers.

## 5. What Sam needs to do

- For Phase 0: nothing material — just answer open question 1 (and 2, the
  conversation-boundary preference).
- For Phase 1 (can start gathering now, in parallel with Phase 0): KS2 curriculum
  document, the "greater depth at KS2" documentation, the couple of example PMC
  papers.
- For Phase 2 (no rush — Phase 1 comes first): the 10 IMC papers, 10 Intermediate
  Olympiad papers, 10 Intermediate Kangaroo papers.

## 6. Status log

- **2026-07-25**: Initiative scoped. Architecture researched (see §2). Plan written.
  All open questions resolved same day (see §3) — one profile plays all three
  modules, cards shared/progress per-module-self-contained, same world/different
  settings. Ready for Phase 0. Not yet started — next conversation should open with
  "continue the module expansion plan, start Phase 0" and read this file first.

- **2026-07-25 (same day, follow-up session): Phase 0 complete.** All six pieces
  described in §4 are built and verified — nothing left pending for this phase.
  - **MODULES bundle system**: every content registry (`CARDS`, `RARITY`,
    `CARD_CLASS`, `TOPICS`, `DEEP_TOPICS`, `CONCEPTS`, `G`, `OLYMPIAD`,
    `OLYMPIAD_PLAYBOOK`, `ACADEMY`, `MAX_LEVEL`, `BOSSES`, `EXAM_PASS_MARKS`,
    `examKindFor`, `EXAM_NAMES`, `NAMES_*`, `MAX_STRENGTH_TOTAL` in
    `KangarooMathsQuest.jsx`, plus `STORY`/`ADVENTURES`/`LESSONS` in
    `kq-content.js`) was renamed to a `JUNIOR_`-prefixed original (content
    byte-for-byte unchanged) and re-exposed as a `let` binding, so `activateModule(key)`
    rebinds all of them in one call with zero changes to the ~100+ existing call
    sites that read the bare names. Primary/Intermediate got minimal stub bundles
    (empty CARDS/ADVENTURES/STORY/etc.) — exactly the "coming soon" scope Phase 0
    called for, no real content authored.
  - **Progress schema split**: `freshProgress()`/`freshModuleProgress()` now match
    §2's schema exactly (shared fields flat, curriculum-progression fields under
    `progress.modules[key]`). A `migrateProgress()` function upgrades every existing
    pre-Phase-0 save (flat, no `modules` key — this is every real save that exists
    today, including Sam's kids' own progress) into the split schema by nesting its
    per-module fields under `modules.junior`, and is idempotent on already-migrated
    saves. Screen components never see the split: `activeProgress`/`setActiveProgress`
    (a flatten/unflatten pair keyed by `activeModule`) present the exact same flat
    shape every component already expected, so none of the ~100+ `progress.xxx`
    call sites in `CardsScreen`/`AdventureRun`/`Practice`/`Olympiad`/etc. needed
    touching — only the handful of call sites living directly in `App()` itself
    (`beatBoss`, `openBossChapter`, `recordAnswer`, the `shared` object, `GrownUps`/
    `NotepadPanel`'s direct props) were repointed at the flattened view.
  - **Module switcher UI**: a "Switch module" header button (next to "Switch
    player") opens a `ModuleSwitcher` picker mirroring the existing Profiles-screen
    tile pattern — Junior shows "Playing", Primary/Intermediate show locked
    "Coming soon" tiles. `activeModule` lives on the profile shell (defaults to
    `"junior"` for every existing and new profile) as the resume-where-I-left-off
    default.
  - **Card Lab**: now renders three grouped sections (Primary/Junior/Intermediate),
    each iterating that module's own `CARDS` array filtered through the shared
    `progress.cards` dict, per §2. A new `moduleCardView()` helper (module-explicit
    twin of `adventureCardView()`) and a `{card, m}` shape for the card-detail modal
    keep every section's upgrade/adventure-item display correct regardless of which
    module is currently active.
  - **Regression verified, not just asserted**: full generator sanity sweep
    (`scripts/gen_sanity_test.cjs`, 120,000 checks) and the jsdom mount smoke test
    (`scripts/bundle_smoke.cjs`) both pass clean after every step. Two new
    non-mutating verification scripts (esbuild-in-memory pattern, same as the
    existing test scripts) checked the bundle system and the progress-migration
    path specifically — 28 and 27 assertions respectively, including a simulated
    pre-Phase-0 flat save migrating correctly with no field leaking to the wrong
    scope. The module switcher and Card Lab's three sections were also driven live
    in a real browser (a scratchpad-only preview build, never touching the real
    `KangarooMathsQuest.html`/`www/index.html`/APK) — created a profile, switched
    screens, answered a real generated question, opened Card Lab, opened a card's
    detail modal — zero console errors throughout.
  - **Not yet done** (Phase 1/2, blocked on Sam per §5): Primary's 30 cards/
    adventures/story/generators (needs KS2 curriculum doc + greater-depth doc + ~2
    example papers) and Intermediate's full-parity content (needs 10 IMC + 10
    Intermediate Olympiad + 10 Intermediate Kangaroo papers). The real
    `KangarooMathsQuest.html`/`www/index.html` have NOT been rebuilt from these
    source changes yet — per Sam's standing preference, that only happens on an
    explicit ask.

- **2026-07-25 (same day, Phase 1 started): generator content, batch 1 of ~5.** Sam
  supplied the DfE KS1/2 maths guidance (June 2020) and three Primary Kangaroo sample
  papers (pk1: an older annotated archive, messy text extraction; pk2/pk3: 2025/2026
  papers, clean). Key finding: the papers are almost entirely visual/logic puzzles
  (pattern completion, folding, cube-face-from-an-angle, clue-based deduction) rather
  than Junior's word-problem style — noted for later diagram-heavy topics.
  - **Confirmed 26-topic list** (Sam approved as-is, see chat) spanning every KS2 Y4-6
    NC strand: number & place value (placeValue, roundingEstimate), calculation
    (timesTablesFacts, divisionRemainders, formalMultiplication, formalDivision,
    factorsMultiplesPrimes, compensationMentalMaths), fractions & decimals
    (fractionEquivalence, fractionArithmetic, fractionOfQuantity, decimalPlaceValue),
    measurement (unitConversion, areaPerimeter, timeCalendar), Y6 ratio/early algebra
    (ratioBasics, twoUnknowns, additiveMultiplicative), geometry (angleBasics,
    shapeProperties, symmetryReflection — all `dia:true`, need SVG), and the papers'
    own logic/spatial style (spatialPuzzles `dia:true`, logicGrid, sequencePattern,
    combinatoricsCounting). Sam confirmed pacing this session-by-session rather than
    in one push.
  - **Batch 1 shipped**: placeValue, roundingEstimate, timesTablesFacts,
    divisionRemainders, factorsMultiplesPrimes, sequencePattern — 6 of 26 topics, 40
    generator closures total (6-7 genuinely distinct sub-principles each, none
    reskins — e.g. placeValue covers digit-value reading, composing from named
    parts, unitizing, place-value comparison, digit-swap effects, extremal digit
    arrangements, and non-standard partitioning as 7 separate principles). None of
    this batch needed SVG diagrams (deferred to a later session alongside the other
    `dia:true` topics, to prove the plain-text harness first).
  - **Verification**: every generator uses brute-force/exhaustive search wherever a
    derived formula could hide a subtle bug (factor lists, primality via trial
    division, best digit arrangement via full permutation search) rather than a
    guessed shortcut — matching the standard set on Junior's generators. A new
    `scripts/gen_sanity_test_primary.cjs` (same esbuild-in-memory pattern as the
    Junior one) drove all 6 generators × 4 difficulty tiers × 400 runs = 76,800
    checks, zero fails. Manually spot-checked 3 sample questions per topic by hand
    against the displayed solution — all correct. Caught and fixed one real bug
    during this pass: 5 `buildMCStr` call sites supplied only 3 explicit decoys
    instead of 4, which would have silently triggered the "correct·N" literal-filler
    fallback flagged in [[feedback_principle_based_questions]] as a known bad
    pattern — all 5 fixed to supply a genuine 4th decoy. Junior's full regression
    (120,000-check generator sweep + jsdom smoke test) re-run clean after this batch.
  - **Not yet done, this batch**: rich LESSONS (only the short CONCEPTS card exists
    per topic so far — Sam's explicit ask this round was specifically about
    generators/categories); the remaining 20 topics, including all `dia:true` ones
    (deferred deliberately to prove the harness on text-only topics first); 30 cards/
    adventures/~10-chapter story/boss tower (separate Phase 1 deliverables, not
    started). Next session should continue with batch 2 of the topic list above.

- **2026-07-25 (same day, Phase 1 continued): generator content, batch 2 of ~5 — plus
  an unplanned but valuable bug-hunting detour.**
  - **Batch 2 shipped**: fractionEquivalence, fractionArithmetic, fractionOfQuantity,
    decimalPlaceValue, ratioBasics, twoUnknowns, additiveMultiplicative — 7 more
    topics (13/26 total now), 44 more generator closures (6-7 genuinely distinct
    sub-principles each). Covers the fractions/decimals strand plus Y6's ratio and
    "two unknowns" strand (the closest KS2 content gets to algebra — sum+difference
    bar models, sum+ratio, coin-combination "several solutions" problems, and
    spot-the-invalid-pair "infinite solutions" awareness, all matching the
    curriculum's own framing as prep for KS3 simultaneous equations).
  - **A stricter verification check paid off immediately.** Added an explicit
    `buildMCStr` "correct·N" filler-decoy check to both sanity scripts (previously
    only covered by a generic debug-leak regex, which missed this pattern entirely).
    It caught 2 real bugs in the batch-2 generators themselves during manual
    spot-checking (visible as a literal garbled option like "1/2·3" in the rendered
    multiple choice) — both were "N candidates in a pool of N, so filtering out the
    correct answer leaves only N-1 decoys" off-by-one errors, now fixed by either
    adding a genuine extra decoy or building a 5-6-candidate pool with Set-based
    dedup before filtering.
  - **That check then surfaced the same bug class across already-shipped Junior
    content — 11 pre-existing generators affected**: `fractionUnusual`, `cryptarith`,
    `modular`, `ratioChain`, `sportScore`, `partitionRect`, `productOpt`,
    `epicJourney`, `moneyTrail`, `coordGeom`, `spatialTransform`. Severity varied
    hugely — `moneyTrail`'s first branch (its most common, lv≤6 case) failed on
    100% of generations, a genuine structural identity ((left+fixed) always exactly
    equals another displayed decoy by construction), not a rare edge case; several
    others triggered on a large fraction of random draws. Impact is cosmetic, not a
    correctness bug — `correctIndex` always pointed at the true right answer — but a
    child would see one obviously-broken-looking option in the multiple choice,
    quietly weakening that question's teaching value. Given the scale, checked with
    Sam mid-session on whether to fix all of it now vs. defer — **Sam chose fix all
    of it now**. One `spatialTransform` closure needed an actual redesign, not just a
    decoy-pool fix: a 3-cycle only has 3 valid + 3 impossible orderings total (6
    permutations), which structurally cannot supply 4 genuine number-sequence decoys
    from a "pick 1 correct, decoy the rest" design — fixed by using the real
    sequences as options directly (not "Option N" labels) and adding one conceptual
    (non-sequence) distractor for the 4th slot.
  - **Verification**: `scripts/gen_sanity_test_primary.cjs` — 13 topics × 4 tiers ×
    400 runs = 187,200 checks, zero fails. `scripts/gen_sanity_test.cjs` (now with
    the filler check) — 135,000 checks, zero fails. A separate one-off audit script
    (not committed, ad hoc) drove all 45 Junior generators 500×4 times each — 90,000
    generations, zero instances of the filler pattern — confirming the fix set is
    complete, not just no-longer-failing-the-sample. jsdom smoke test still passes.
  - **Not yet done**: rich LESSONS still pending for all 13 topics shipped so far;
    the remaining topics after batch 3 (see below); cards/adventures/story/boss
    tower.

- **2026-07-25 (same day, Phase 1 continued): generator content, batch 3 of ~5.**
  - **Batch 3 shipped**: unitConversion, areaPerimeter, timeCalendar,
    compensationMentalMaths, formalMultiplication, formalDivision — **19 of 26
    topics done now**, 39 more closures (6-7 genuinely distinct sub-principles
    each). This closes out the number/calculation and measurement strands —
    formalMultiplication/formalDivision specifically cover the Y5-6 "formal
    written method" curriculum content (short/long multiplication via the
    distributive property, long division via a ratio-table-of-multiples) that
    batch 1's divisionRemainders/timesTablesFacts deliberately left for later so
    the two topic pairs stay genuinely distinct (remainder-interpretation vs.
    the formal procedure itself). No `dia:true` topics touched yet — still none
    needed for this batch, all text/numeric.
  - **Verification**: applied every lesson from batch 2's bug sweep proactively
    this time (generous 5-6-candidate `buildMCStr` pools, `Set`-deduped before
    filtering against the answer, rather than a bare 4-element array) — result:
    zero filler-decoy failures on the first run, unlike batch 2's two self-made
    bugs. `scripts/gen_sanity_test_primary.cjs` — 19 topics × 4 tiers × 400 runs =
    273,600 checks, zero fails. Junior's full regression (135,000 checks + smoke
    test) still clean. Manually spot-checked 4 sample questions per topic (24
    total) against the shown solution by hand — all correct.
  - **Remaining 7 topics**: logicGrid, combinatoricsCounting (no diagrams needed)
    plus the 5 genuinely `dia:true` ones — angleBasics, shapeProperties,
    symmetryReflection, spatialPuzzles. These are the last batch and the first to
    need real SVG diagram generation; the close read of Junior's `coordGeom`/
    `spatialTransform` during the bug-fixing detour is useful firsthand context
    for that. Still pending regardless of topics: rich LESSONS for all 19 topics
    shipped so far (only the short CONCEPTS card exists per topic); 30 cards;
    adventures; ~10-chapter story; boss tower.

- **2026-07-25 (same day, Phase 1 continued): generator content, batch 4 of 4 —
  topic list complete.** Note: earlier entries in this log said "26 topics" —
  that was an arithmetic slip in the original scoping message; the table Sam
  actually approved always listed **25**, and all 25 are now built.
  - **Batch 4 shipped**: logicGrid, combinatoricsCounting (no diagrams), plus
    the first `dia:true` (SVG-diagram) topics — angleBasics, shapeProperties,
    symmetryReflection, spatialPuzzles. 41 more closures (6-7 per topic). This
    is the last of the 25 planned topics — **the full Phase 1 generator/category
    scope is now done**: 168 generator closures total across 25 topics.
  - **logicGrid directly mirrors the sample papers' own house style** (clue-based
    deduction — the Dela/Ela/Fela ice-cream puzzle and the Jun/Kim/Lea/Mai/Nao
    circle-of-hands puzzle from pk3 were the direct inspiration). Every closure
    verifies its puzzle has a UNIQUE solution via brute-force permutation search
    (checking every possible arrangement against the stated clues) rather than
    assuming hand-picked clues are sufficient — matching the standard already
    set on Junior's seating/truthLiars/pigeonhole generators.
  - **First diagram-heavy batch**: built local SVG helpers per topic (regular-
    polygon path tracer, angle-arc drawer, coordinate-grid point plotter) reusing
    the same `SL`/`SC`/`SR`/`ST`/`svgBox` primitives Junior's `coordGeom`/
    `spatialTransform` already use — the close read of those two during the
    bug-fixing detour paid off directly here. `spatialPuzzles`'s rotation-vs-
    reflection closure explicitly reuses the verified die-corner chirality logic
    from Junior's `spatialTransform` rather than re-deriving cube/corner
    geometry from scratch.
  - **Verification**: one more instance of the exact same off-by-one bug this
    session kept finding (a 4-item candidate pool, minus the correct answer,
    left only 3 real decoys) — caught immediately on the first test run this
    time (not by manual spot-check), fixed by collecting a 5-item pool instead.
    `scripts/gen_sanity_test_primary.cjs` — all 25 topics × 4 tiers × 400 runs =
    360,000 checks, zero fails after the fix. Junior's full regression (135,000
    checks + smoke test) still clean. Manually spot-checked 16 sample questions
    across the 4 diagram topics, including reading the raw SVG markup for one to
    confirm it's well-formed (not just "didn't crash") — all correct.
  - **Not yet done — the only remaining Phase 1 work**: rich LESSONS for all 25
    topics (only the short CONCEPTS teaching card exists per topic so far); 30
    cards; adventures; ~10-chapter story; boss tower. The cards/adventures/story
    work needs Sam's input on Primary's creative direction first (per §1's
    "shared world, different setting" note — Primary's own town/mascot theme
    within the shared Kangaroo Maths Quest world hasn't been decided yet).

- **2026-07-25/26 (overnight session, autonomous): creative direction settled, and
  every remaining Phase 1 deliverable except adventures now shipped.** Sam chose
  the setting (Ninefold Orchard, a harvest town of nine rows/nine scarecrows —
  see [[project-multi-module-settings]]), approved a story treatment (title
  "Ninefold Orchard and the Scarecrow Who Forgot", 11 chapters/10 bosses,
  premise: the founder-scarecrow who taught all nine to count has spent a
  century forgetting, fix is renewal not defeat — Pip becomes a *tenth*
  scarecrow at the end), and approved a 30-card roster (12 common/5 uncommon/5
  rare/6 epic/2 legendary — note this is Junior's real 5-tier split, not the
  "12/10/6/2" shorthand used earlier in chat). Sam then explicitly authorised
  full autonomous overnight work ("proceed without me... make an assumption...
  check with me only when everything is finished"), so the items below were
  built and verified without further check-ins:
  - **Full 11-chapter story written and wired in.** ~15,600 words across 11
    chapters (drafted via Opus subagents per chapter, each fed the previous
    chapter plus a fixed style bible for continuity; QA'd by hand afterward —
    caught and fixed pronoun-consistency slips, one duplicate character name,
    one Oxford-comma slip, one fourth-wall "in Chapter One" reference — none
    survived into the final text). House style set by Sam mid-session and now
    a standing convention: UK English, no em-dashes, no Oxford commas,
    Pratchett/Tiffany-Aching register — see [[feedback_story_writing_style]].
    Boss-unlock convention confirmed matching Junior's exactly (boss N is beaten
    at the end of chapter N, unlocking chapter N+1). Converted the markdown
    draft (`story_draft_primary.md`, kept as a human-readable reference copy)
    into the `{n, title, text}` array `kq-content.js` actually expects via a
    small one-off script (`scripts/convert_story_to_js.cjs`) rather than
    hand-transcribing 89KB of escaped string literal — caught and fixed a
    mangled title (an over-eager quote-strip regex) and a stray trailing `---`
    markdown divider before splicing it into `PRIMARY_STORY`/`PRIMARY_STORY_TITLE`.
  - **All 25 Primary topics now have rich LESSONS**, matching Junior's
    `{title, minutes, intro, sections:[{h, body, note?, example?, tryit?}],
    recap, mistakes}` shape exactly — 107 sections total across the 25 topics,
    each with a worked example and/or a try-it question. Written directly
    (not delegated — this is structured/correctness-focused content like the
    generators, not voice-dependent prose like the story). One typo caught and
    fixed (a garbled placeholder question that slipped into the decimals
    lesson). Verified by loading the real bundle and checking all 25 keys
    exist with complete shape, not just that the file compiles.
  - **30 Primary cards, 10 bosses, and supporting data built into
    `KangarooMathsQuest.jsx`**: `PRIMARY_CARDS` (stats on the same
    [Arithmetic, Geometry, Logic, Science, Speed] scale as Junior, power bands
    matching Junior's per-tier totals), `PRIMARY_CARD_CLASS` (17 heroes —
    every common+uncommon — across the same 5 adventure classes Junior uses,
    ready for whenever adventures are built), `PRIMARY_NAMES_COMMON/RARE/EPIC/LEGENDARY`
    pack-odds buckets, and `PRIMARY_BOSSES` (10 entries, lore drawn straight
    from the story, `need` thresholds scaled proportionally to Junior's own
    progression against `PRIMARY_MAX_STRENGTH_TOTAL` = 122), plus
    `PRIMARY_EXAM_PASS_MARKS` (gentle-to-tough across all 10 levels, since
    Primary is Kangaroo-only with no band split). Verified no id collisions
    with Junior's cards, correct rarity distribution, correct stat-array
    shape, and `MAX_STRENGTH_TOTAL` matching a hand-computed total exactly.
  - **Found and fixed a real pre-existing bug while verifying live**: flipped
    `MODULES.primary.locked` to `false` (it was still `true` from the Phase 0
    stub, so the module switcher silently showed "Coming soon" even with all
    this content in place) — and while testing with it unlocked, discovered
    `BOSS_ART` is a flat object keyed 1-10 shared across *all* modules, not
    module-scoped, so every one of Primary's 10 bosses would have silently
    displayed **Junior's** boss portrait art (all 10 Junior slots are filled).
    Fixed properly, not painted over: renamed the import to `JUNIOR_BOSS_ART`,
    added empty `PRIMARY_BOSS_ART`/`INTERMEDIATE_BOSS_ART` stubs (safe — every
    call site already falls back to emoji when an entry is missing), added
    `BOSS_ART` to each module's bundle in `MODULES`, and made it a properly
    rebound `let` inside `activateModule()` — the same "rebind, don't rewrite
    call sites" pattern Phase 0 established, so none of the four existing
    `BOSS_ART[...]` call sites needed touching.
  - **Known, deliberate gap left in place: `BOSS_CARDS` (the boss trophy
    collection) is still Junior-only.** Unlike `BOSS_ART`, fixing this properly
    means also reworking the trophy-collection UI to group by module (the same
    way Card Lab's three sections already do) — a real UI change, not just a
    data rebind, and riskier to get right unsupervised without Sam able to
    confirm the visual result. Left as-is deliberately: it does not crash for
    Primary (confirmed live), it just silently continues showing Junior's 10
    boss trophies underneath regardless of active module. Flagged clearly for
    Sam rather than either guessing at a UI fix or leaving it undocumented.
  - **Verified live in a real browser**, not just via the test scripts: built
    a scratchpad-only preview (`build_preview.cjs`, pre-existing from an
    earlier session), served it over a throwaway local static server (browser
    tooling in this environment can't load `file://` directly), created a
    profile, switched into Primary, and confirmed — hub shows "Level 1 boss:
    The First Crow" / "Strength 0 / 3" / "pass a Primary Kangaroo mock with
    10/25" all correctly; Storybook shows the real title, Chapter 1 in full,
    and correctly locked chapters 2-11 with the right unlock text ("defeat the
    Level 1 boss to unlock" for Ch.2, confirming the boss/chapter mapping is
    right in the actual running UI, not just on paper); Card Lab shows
    "Primary Maths Challenge 0/30" as its own grouped section; Lessons shows
    all 25 topics tagged "FULL LESSON" (not the short-concept fallback), and
    opening one renders sections/tips/worked-examples/try-it correctly.
    Full regression (`gen_sanity_test.cjs` 135,000 checks, `gen_sanity_test_primary.cjs`
    360,000 checks, `bundle_smoke.cjs`) reran clean after every change.
  - **Also generated**: 30 card-art images via the OpenAI API (`gpt-image-1`,
    portrait, consistent bordered-frame style, no text/name/title baked into
    the art per Sam's direction) — see `card_art/ninefold_orchard/`. Not yet
    wired into `PRIMARY_CARDS[i].img` (the Card Lab currently shows Primary
    cards by emoji, same as Junior's un-commissioned slots) — that's a
    mechanical next step (base64-encode and add an `img` field per card,
    mirroring how `kq-art.js`/`CARD_ART` work for Junior) rather than a design
    decision, just not done yet.
  - **Not done, and explicitly deferred rather than guessed at**: Primary
    adventures (Sam's own plan doc flagged the shape as still undecided —
    "a bit more simplified" — not a blank an overnight session should fill in
    unsupervised); Academy/Olympiad content (by design — Primary has neither,
    per §1's table); the real `KangarooMathsQuest.html`/`www/index.html` have
    **not** been rebuilt from any of this (per Sam's standing preference,
    only on an explicit ask — see [[feedback_sam_working_prefs]]).

- **2026-07-26 (same-day follow-up, Sam back online): boss art, exam
  progression, Mock Test module-awareness, first UI art, adventures queued.**
  - **10 boss portraits generated and wired into `PRIMARY_BOSS_ART`**
    (`scripts/generate_boss_art.cjs` + `scripts/embed_boss_art.cjs`), on Sam's
    explicit direction to give bosses a deliberately different tone from the
    card art: dusky/ember red instead of the cards' warm green-gold, same
    non-violent "sad/broken not evil" characterization, square format (not
    the cards' vertical portrait ratio) matching Junior's own `BOSS_ART`
    convention. Resized/JPEG-compressed 16MB→0.4MB, same pipeline as the cards.
  - **Exam progression rebuilt per Sam's spec**: `PRIMARY_EXAM_PASS_MARKS` is
    now `{1:8,2:10,...8:22,9:10,10:12}` — levels 1-8 gate on "Primary Kangaroo"
    starting at 8/25 and climbing by 2; levels 9-10 switch to a new `"jmc1"`
    exam kind ("JMC Level 1 (stretch)"), needing 10/25 then 12/25. Confirmed
    with Sam that "stretch questions from level 1 of the JMC" means Primary's
    own generators at a harder difficulty schedule (not literally cross-
    pulling Junior's real JMC content, which `buildPaper()` has no mechanism
    for today) — `examKindFor` returning any kind other than `"jmc"`/`"kangaroo"`
    already gets `buildPaper`'s hardest per-question difficulty schedule for
    free, the same mechanism Junior's own `"year9"` stretch band already
    relies on, so this needed zero changes to the shared paper-building code.
    Checked whether lesson coverage exists for this stretch content (Sam's
    same worry applies to Junior's own Year 9 band) — both are already fully
    covered, since `LESSONS` are keyed per-topic, not per-difficulty-tier,
    and every topic in both modules already has a full lesson (verified
    programmatically: 45/45 Junior, 25/25 Primary).
  - **Found and fixed a real pre-existing gap while wiring the above**: the
    Mock Test picker screen was entirely hardcoded to Junior's three exam
    kinds ("Junior Maths Challenge"/"Junior Kangaroo"/"Year 9 Challenge" with
    literal `start("jmc")` etc.) — Primary's new `"jmc1"` kind had no way to
    be reached in the actual running UI at all, and the picker would have
    kept showing Junior-branded cards even while Primary was active. Rebuilt
    it to derive its cards from whichever kinds the ACTIVE module's own
    `examKindFor`/`EXAM_NAMES` actually define (grouping levels 1..MAX_LEVEL
    by kind, picking a warm-up/middle/toughest tagline by position) — verified
    this reproduces Junior's original three cards byte-for-byte in content,
    while correctly giving Primary its real two cards. Also fixed the home-hub
    tile's summary text (was hardcoded "JMC, Kangaroo or Year 9 Challenge")
    to build itself from `Object.values(EXAM_NAMES)`.
  - **First Primary-specific UI art**: a Pip mascot portrait generated and
    wired into `PRIMARY_TITLE_ART.mascot` (used wherever the `Mascot`
    component/header icon appear). `TITLE_ART`/`UI_ART` made module-aware
    using the same rebind pattern as `BOSS_ART` — but deliberately defaulted
    Primary/Intermediate to Junior's *existing* title-screen background/front
    layers, logo and panel-frame/button art (`{ ...JUNIOR_TITLE_ART }` etc.),
    not empty stubs, because unlike `BOSS_ART` (which degrades safely to an
    emoji when missing), a missing `panelFrame` `border-image` would leave a
    literal invisible 28px gap around every card/panel — genuinely broken,
    not just plain. Only the mascot was safe to override outright. Left a
    code comment flagging that `QUEST_CARD` (the shared card/panel style
    object) is computed once at module load from whichever `UI_ART` is bound
    at that instant, so it won't pick up a future per-module `panelFrame`
    without being restructured into a function — harmless today since every
    module's `panelFrame` still equals Junior's.
  - **Sam's fuller UI-reskin idea — captured, not built yet**: Primary styled
    like a country orchard (matching the card art), Junior re-themed as
    "Little Reckoning" in a Japanese-anime style, Intermediate's own look
    whenever that module is built. This is a real, wanted future initiative,
    but deliberately not attempted as a blind single-shot generation tonight:
    title-screen background/front layers and panel-frame/button textures
    have real structural requirements (transparency, 9-slice-style border
    tiling) that a generic image-generation call is unlikely to get right on
    the first pass without a visual review loop — getting one wrong risks a
    visibly broken UI (see the invisible-border risk above), unlike a card
    portrait which just looks plain if slightly off. Next session should
    scope this as its own art-and-design pass with Sam able to review
    intermediate results, especially before touching Junior's already-shipped
    look.
  - **Adventures formally queued** (see task list / next session): build the
    Primary adventure system for all 17 common+uncommon heroes, matching
    Junior's `ADVENTURES` shape exactly (story/choice/dice/puzzle/forge/end
    scenes, 3-item upgrade path). `PRIMARY_CARD_CLASS` (tank/healer/wizard/
    melee/ranged, all 17 heroes) already exists and is ready to use — this is
    the only remaining Phase 1 content gap.
  - Full regression clean throughout (`gen_sanity_test.cjs` 135k checks,
    `gen_sanity_test_primary.cjs` 360k checks, `bundle_smoke.cjs`), plus a
    live browser check confirming: boss portrait now renders as a real image
    (not the emoji fallback) on the hub, exam gate text reads "pass a mock
    with 8/25", and the Mock Test screen shows exactly Primary's two real
    exam kinds with correct level ranges and taglines.

- **2026-07-26 (later same day): adventures shipped — Phase 1 complete.**
  - All 17 common+uncommon hero adventures written (one per
    `PRIMARY_CARD_CLASS` entry: pip, nine, bramble, sorrel, russet, halfpenny,
    wicker, furrow, dapple, bushel, tuppence, windfall, cornix, thistlewick,
    beeswax, kernel, millrace), ~32 scenes each, matching Junior's
    `ADVENTURES` shape exactly (story/choice/dice/skillcheck/puzzle/combat/
    forge/end scene types, 3-item upgrade path: found/quest/forged). Authored
    via 17 parallel background subagents against a fixed scene-skeleton
    template, each given the same story bible/style rules/class-special-move
    details.
  - Invented "Driftlings" as an adventure-exclusive villain family (lost,
    muddled, non-violent motes — confused bees, tangled weeds, drifting
    pollen — "settled" not "defeated"), distinct from the 10 main-story
    bosses, to keep adventure combat tonally consistent with the story's
    non-violent characterization.
  - New `scripts/validate_adventures.cjs`: a standalone scene-graph
    integrity checker (all `next`/`success`/`fail`/`victory`/`retreat`/
    `good`/`mid` references resolve, no unreachable scenes via BFS from
    `start`, every component/item is granted by some scene, puzzle/dice
    answer indices in range). New `scripts/verify_primary_adventures.cjs`:
    the same checks re-run against the real esbuild-bundled app (non-
    mutating, per [[feedback_sam_working_prefs]]'s in-memory-build pattern)
    rather than a standalone object literal, so it also confirms the 17
    hero ids match `PRIMARY_CARD_CLASS` and the content survives the real
    import/bundle chain.
  - **Three real bugs caught and fixed before splicing in**, none by manual
    read-through — all three were the validator's "granted somewhere" /
    exact-text checks catching what eyes missed given the content volume
    (17 heroes × ~32 scenes): (1) Bramble's `routeA_good` scene had a
    duplicate `text:` key (cosmetic, last-value-wins, but sloppy — an
    agent's copy-paste artifact); (2) Wicker's forge-keeper NPC name had
    both a garbled/corrupted character and an accidental collision with the
    separate hero Thistlewick's own name ("Old 녊 Thistlewick the
    toolmender") — renamed to "Old Hesper the toolmender"; (3) Russet's and
    Dapple's first-component 3-way route choice narrated winning the
    component in prose but never set the scene's `grantComponent` field —
    a genuine soft-lock (that component could never actually be collected,
    silently blocking the forge and therefore item 3) in 2 of the 17
    adventures, not a cosmetic issue.
  - Spliced into `kq-content.js` in place of the `PRIMARY_ADVENTURES = {}`
    stub (same non-mutating-then-splice pattern used for `PRIMARY_STORY`
    earlier in Phase 1).
  - Verified: `validate_adventures.cjs` and `verify_primary_adventures.cjs`
    both clean (0 errors across all 17 heroes); full regression clean
    throughout (`gen_sanity_test.cjs` 135k checks, `gen_sanity_test_primary
    .cjs` 360k checks, `bundle_smoke.cjs`); plus a live scratchpad-preview
    browser playthrough of Pip's adventure (intro → skillcheck →
    item-1-found → gate combat, exercising a class special move — Nine's
    Scout Ahead lowering the hit target — the momentum system, and two
    distinct real generated maths questions mid-combat) — never touched the
    real `KangarooMathsQuest.html`/`www/index.html`.
  - **Phase 1 (Primary) is now fully complete** — every planned deliverable
    (generators, lessons, story, cards, bosses, boss art, exam progression,
    Mock Test module-awareness, first UI art, adventures) has shipped and
    been verified. Phase 2 (Intermediate) has not been started and remains
    blocked on the source papers listed in §7/§8 above.
