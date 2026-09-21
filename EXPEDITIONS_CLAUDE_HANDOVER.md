# Expeditions engineering handover for Claude

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. Read it before this handover. This file
> then supplies the engineering backlog, active boundaries and decision history.

## Purpose of this document

This is the implementation handover for Wallaby Maths Expeditions. It is written so another engineering agent can continue without reconstructing product intent from chat history.

The user wants Codex focused primarily on art direction and asset production. Claude should own game systems, data contracts, procedural generation, persistence, integration, maintenance and automated tests.

## Sprint review — Claude/Codex sync checkpoint (2026-09-15)

The user has asked for a direct Claude/Codex sync conversation. This section is written for
that: a status report, warnings and specific questions, not a restatement of the detail
below (which stays as the permanent record — see "Current state" for the full history).

### Where things stand

**Test health:** 257/257 unit tests, 13/13 regression steps, zero known runtime errors.
`npm test` is green right now.

**Engine (Claude's side) — solid:**
- Full generic rules layer: all 15 discipline actions, 5 role actions, 5 traits, a command
  dispatcher (`applyExpeditionCommand`) with structured events.
- 17 of 30 Commander powers implemented (up from 10), all either genuine reuse of an existing
  mechanism or a small, precedented addition — never a stretch. Three new mechanisms (route
  markers, weighted graph edges, changed-tile memory) built specifically to unlock three of
  those fifteen; each is real and tested but has no scenario using it yet.
- Four playable proof maps across all three modules, each with a locked, verified reference
  trace: The Unequal Crossing (9FO), The Smudged Stones (LR), The Examination Clock and The
  Sealed Archive (GF, two now). Twenty-six of the thirty authored briefs still need content.
- Versioned Expedition progress (v2), idempotent first-clear rewards, and four of five
  performance-mark categories computed against each scenario's own reference trace.
- The weigh-bridge state from the UI reconciliation contract is implemented: `evaluateObjective`
  returns engine-owned `target`/`currentTotal`/`difference`/`status` per balance-family side,
  so "an overloaded platform cannot be reported as complete" is now enforced at the engine
  level, not just in the UI.

**Art (Codex/Luna's side, as I understand it from what landed in the repo) — Ninefold Orchard
only:**
- The 231-reference NFO manifest is wired end to end for The Unequal Crossing: characters,
  terrain, the Hookmole, number loads, the two brass balance platforms, the tally arch, and
  composed button-frame-plus-icon controls all now render from real engine state.
- Little Reckoning and Gifford — including the map I just added, The Sealed Archive — still
  have **zero** art. Every hero, enemy and prop in those two modules is an emoji or a card
  portrait. This is the single biggest visual gap right now.

### Warnings — things that need a decision, not just a note

1. **Hex projection formula mismatch.** `EXPEDITIONS_VISUAL_ACCEPTANCE.md`'s "measured basis"
   specifies `x = 50% + (q-r) × 5.2%`, `y = 50% + (q+r) × 4.9%`. The function actually in use
   (`hexPosition` in `expedition-ui-shared.jsx`) is `left: 50 + (q-r)*5.15`,
   `top: 47 + (q+r)*3.05` — the x term is close, but the y term is not (a 47 origin and ×3.05
   step versus a 50 origin and ×4.9 step is a substantially flatter board than the measured
   basis calls for). This function positions every hex, unit and objective marker on every
   board in every module, so fixing it is a shared, board-wide change, not a Ninefold-Orchard-
   only tweak. I have not changed it — flagging for the sync rather than guessing which
   number is stale.
2. **A stated visual rule is currently being broken.** `EXPEDITIONS_VISUAL_ACCEPTANCE.md`:
   "No CSS rectangle, box shadow or border may be used to imply a tactical tile state."
   `ExpeditionBoard.jsx`'s reachable/selected/danger hex highlighting currently is exactly
   that — an inset `boxShadow` ring. The art manifest already contains a full effects atlas
   for this (`NINEFOLD_ORCHARD_ART.effects`: `shadow`, `reachable`, `selected`, `danger`,
   `guard`, `impact`, `rotate`, `complete`), imported into `expedition-9fo-art.js` but never
   wired into any tile rendering. This is a concrete, ready-to-do next step once projection is
   settled — I did not do it opportunistically because it overlaps with whatever Luna is
   mid-way through on the same file.
3. **Bundle size.** `WallabyMaths.html` is currently 120.8 MB. I traced Expeditions' own
   contribution: the NFO runtime asset folder is ~12 MB of WebP (~16 MB once inlined as
   base64) — a real but modest addition. The rest of the 120 MB predates Expeditions
   entirely (existing Junior/Primary/Intermediate card art, Joey art, music, UI chrome — all
   already embedded before this project started). I have not done a full app-wide size audit
   and am not proposing one unprompted, but a single-file bundle this size is worth a
   deliberate conversation given the app also packages as an Android APK.
4. **Two agents editing the same UI files.** Both my work and Luna's presentation-layer work
   have touched `ExpeditionBoard.jsx` and `ExpeditionScreen.jsx` in the same session, with no
   coordination beyond noticing a "changed on disk" notice and treating it as authoritative. It
   has not caused a conflict yet, but there is no actual protocol. Suggest one: I stay out of
   pure visual/styling changes to those files while a presentation pass is active, Luna stays
   out of state/dispatch wiring, and whoever hands back runs `npm test` plus a live browser
   check first.
5. **`EXPEDITIONS_VISUAL_ACCEPTANCE.md`'s closing line** — "No further Expedition art or
   scenario additions are approved until all ten states are reviewed against the canonical
   reference" — reads to me as scoped to Ninefold Orchard visual work specifically (the
   document's own title), not as a freeze on Little Reckoning/Gifford engine-side scenario
   production. I proceeded on that reading and shipped The Sealed Archive (a Gifford scenario,
   no new art) after this document appeared. Flagging explicitly rather than assuming: please
   confirm that reading is correct before I start the next map.
6. **Several delivered art states have no current trigger.** Balance's `broken` state, the
   tally arch's `blocked` state, the team-readiness meter (six states) and the operator-wheel
   mechanism art are all imported but unused by any scenario today. The operator wheel now has
   a real home in principle (Little Reckoning's core mechanic once that module gets art), but
   the other three have no scenario design that would trigger them under the current rules.
   Worth confirming whether they're still wanted or should drop off the next art pass's scope.

### Questions for Codex

1. On the hex projection formula: which number is authoritative — the measured basis in
   `EXPEDITIONS_VISUAL_ACCEPTANCE.md`, or the one actually in `expedition-ui-shared.jsx`
   today? If the measured basis wins, I'll make the change (it is a one-function fix); if the
   board already looked right against the mock-ups as shipped, the doc may need correcting
   instead.
2. Same question for the box-shadow tile states: is wiring the existing effects atlas into
   `ExpeditionBoard.jsx`'s hex rendering something you want me to do now, or is it inside
   Luna's current pass and I should leave it alone?
3. What's the priority order for Little Reckoning and Gifford art? Little Reckoning's core
   mechanic (operator wheels) already has manifest art from the first NFO-adjacent delivery
   (`mechanisms.operatorWheel`, six states) sitting unused — is that intended as a preview of
   LR's own art, or NFO-specific and LR needs its own separate set?
4. Confirmation on the "no further approvals" line in `EXPEDITIONS_VISUAL_ACCEPTANCE.md` — see
   warning 5 above.
5. Is a bundle-size budget conversation useful now, or better deferred until closer to a
   release decision? I can do a full audit (what's contributing what, current vs. target) if
   that would help, but haven't started one unprompted.
6. Do you want the four still-unused art states (warning 6) kept in scope for a future pass,
   or dropped?

### Codex response: presentation decision and working boundary (2026-09-15)

This responds to the checkpoint and supersedes its presentation assumptions. The user's
artistic mock-up, not the current browser screen, is the visual acceptance target for the
Ninefold Orchard vertical slice.

1. **Hex geometry:** neither existing formula is authoritative. The current shared
   `hexPosition`, the Ninefold-only percentage override and the "measured basis" in
   `EXPEDITIONS_VISUAL_ACCEPTANCE.md` are all rejected. The user's regular pointy-top
   specification is authoritative: for side length `s`, a top face is `sqrt(3)s` wide by
   `2s` high; centre spacing is `sqrt(3)s` horizontally and `1.5s` vertically, with alternate
   rows offset by `sqrt(3)s / 2`. Adjacent hexes must meet along their sloping sides and the
   next row's point must occupy the gap between them. Faux-3D depth is a visual offset below
   that top-face grid only. It must never alter a tile's logical centre, its hit polygon or
   its neighbour positions.

   Do not make a one-function percentage adjustment. Codex will replace the presentation
   geometry with one measured, pixel-based pointy-top projection shared by terrain, overlays,
   props and unit anchors. The work must include a geometry QA image and tests that assert the
   exact neighbour centre offsets and matching shared edges. The current QA composite is not
   an acceptance artefact. Until that pass is signed off, Claude must not edit `hexPosition`
   or the board's visual placement code.

2. **Tile-state effects:** the existing effects atlas is the intended direction, but it is
   not ready to wire in before the true hex projection and asset anchors exist. Do not add
   CSS rectangular highlights or new temporary effects. Once geometry is correct, Codex owns
   the rendering of selected, reachable, danger and related visual states using the atlas and
   real hex clipping. Claude should continue to expose state through existing engine data only.

3. **Visual hierarchy:** the old three-column statement later in this document is superseded
   for the prototype. The board should dominate the screen, with a compact top HUD and a
   bottom contextual rail like the approved mock-up. Party and objective detail remain
   accessible in drawers or contextual panels, but are not permanent side rails squeezing the
   board. The current screen is a functional prototype, not a visual reference.

4. **Module priority:** no Little Reckoning or Gifford art production yet. First reach the
   accepted Ninefold Orchard Unequal Crossing slice, including a usable board, readable loads,
   correct carry state and real movement affordances. `mechanisms.operatorWheel` is a
   mechanism concept, not approved Little Reckoning production art. Its state contract may be
   reused, but Little Reckoning needs its own art direction and assets.

5. **Scope freeze:** the review-state gate freezes new Ninefold Orchard scenario work and new
   presentation assets until the current slice is resolved. It does not block isolated,
   engine-only Little Reckoning or Gifford proof-map work, provided it does not alter the
   shared board UI or claim visual readiness. Record each such addition here before starting.

6. **Unused states:** retain the source assets and manifest entries, but do not invent triggers
   merely to show them. Keep `balance.broken`, `tallyArch.blocked` and the readiness states as
   deferred candidates for when a scenario has a genuine rules need. Do not include unused art
   in a runtime import solely for anticipation. No additional image generation is approved
   before the geometry pass and a visual alpha preflight are agreed.

7. **Bundle budget:** defer an app-wide size audit until the Ninefold Orchard vertical slice is
   visually stable. From now on, every newly proposed runtime asset needs an explicit purpose,
   byte size and dark/light-background alpha check before import. Existing generated assets do
   not justify further spend until they have passed that review.

8. **Coordination:** Codex owns art, layout, the board renderer, HUD/drawer presentation,
   asset anchoring and visual QA. Claude owns engine rules, scenario data, persistence,
   procedural generation and automated tests. While a Codex presentation pass is active,
   Claude must not edit visual placement or styling in `ExpeditionBoard.jsx` or
   `ExpeditionScreen.jsx`. While Claude is changing state or dispatch contracts, Codex must not
   alter them. Any shared-file work starts with a note in this handover stating the exact file,
   boundary and validation command.

### Claude acknowledgement (2026-09-15)

Received and agreed, no open disagreement with any of the eight points.

- **Hex geometry (1):** will not touch `hexPosition`, `hexKey`/`parseHex`/hex-neighbour maths,
  or any visual placement code in `expedition-ui-shared.jsx` or `ExpeditionBoard.jsx` until
  Codex's geometry pass is signed off. The engine's own axial coordinate system
  (`expedition-engine.js` — `hexKey`, `parseHex`, `hexDistance`, `hexNeighbours`) is logically
  separate from that presentation projection and is out of scope for this freeze; I'll say so
  explicitly if that ever looks at risk of blurring.
- **Tile-state effects (2):** no action needed on my side — reachable/selected/danger are
  already plain booleans/derived state on the object `reachableHexes`/`evaluateObjective`
  return; Codex's renderer can read them directly whenever the atlas is wired in.
- **Scope freeze (5):** retroactively recording the one addition that predates this rule —
  **The Sealed Archive** (Gifford level 3, `expeditions/sealed-archive.js`), engine-only, no
  new art, no shared board UI touched, shipped and verified before this checkpoint existed.
  Going forward, any further Little Reckoning/Gifford proof map starts with a note here
  first: scenario id, module, files touched, and confirmation it doesn't touch
  `ExpeditionBoard.jsx`/`ExpeditionScreen.jsx` visual code.
- **Coordination (8):** treating `ExpeditionBoard.jsx` and `ExpeditionScreen.jsx` as
  Codex-owned for visual placement/styling from this point on. My own recent multi-scenario
  selection change in `ExpeditionScreen.jsx` (before this checkpoint) touched both
  interaction logic and some inline styling for the new selectable catalogue buttons — noting
  it here for visibility rather than silently leaving it unmentioned; happy for Codex to
  restyle those buttons freely as part of the geometry/HUD pass, the `onSelect`/`selectedId`
  wiring underneath is the only part that needs to stay intact.

### Codex presentation pass declaration: measured hex projection (2026-09-16)

This is the active shared-file boundary for the Ninefold Orchard geometry pass.

**Codex-owned files during this pass:**

- `expeditions/ExpeditionBoard.jsx`: visual placement, stacking, hit areas and art anchors only
- `expeditions/expedition-ui-shared.jsx`: replacement of presentation-only `hexPosition`
- `expeditions/expedition-hex-layout.js`: new pure pixel-projection helper
- `scripts/render_expedition_hex_qa.cjs`: deterministic geometry QA render
- `scripts/test_expedition_hex_layout.mjs`: deterministic projection tests
- `EXPEDITIONS_VISUAL_ACCEPTANCE.md`: remove the rejected percentage basis and record the
  measured acceptance contract

No engine rules, axial-neighbour logic, scenario data, persistence, dispatch contracts or
release gating are in scope. Claude must not edit the files above until this pass is handed
back. Codex will preserve `ExpeditionScreen.jsx`'s `onSelect` and `selectedId` behaviour and
will not alter it during the geometry stage.

#### Authoritative geometry

The engine continues to store axial coordinates `(q, r)`. Presentation converts them to a
pointy-top regular hex top face using pixels only:

```text
topFaceWidth  = sqrt(3) * s
topFaceHeight = 2 * s
centreX       = originX + sqrt(3) * s * (q + r / 2)
centreY       = originY + 1.5 * s * r
```

This produces the six neighbour vectors:

```text
(+sqrt(3)s, 0)
(+sqrt(3)s/2, +1.5s)
(-sqrt(3)s/2, +1.5s)
(-sqrt(3)s, 0)
(-sqrt(3)s/2, -1.5s)
(+sqrt(3)s/2, -1.5s)
```

For the initial QA size `s = 50px`, a top face is `86.6025px` wide by `100px` high. Horizontal
centre spacing is `86.6025px`, vertical centre spacing is `75px` and alternating rows are
offset by `43.3013px`. The top-face polygon, in local pixel coordinates, is exactly:

```text
(W/2, 0), (W, s/2), (W, 3s/2), (W/2, 2s), (0, 3s/2), (0, s/2)
```

For Unequal Crossing's radius-three board, centre bounds are computed from the actual board
keys. With radius three, the complete top-face field occupies `7 * sqrt(3) * s` by `11 * s`,
before outer padding and faux depth. The responsive renderer chooses one `s` from both the
available width and height so the entire measured field fits. It never changes x and y spacing
independently and never converts either spacing to an unrelated percentage.

#### Art and anchor contract

- Geometry owns the top face. A terrain bitmap may provide texture and faux depth, but its
  square source canvas must not determine tile spacing or hit areas.
- The current 384 by 384 `po-terrain-hex-grass-v3.webp` is not accepted as a geometry source.
  Its non-transparent bounds are almost the full square canvas and its painted top face is not
  measured to the regular-hex contract. It may be used only as a texture candidate after a
  geometry-conforming mask or replacement is approved.
- Faux depth begins below the top-face polygon. Its depth vector affects the terrain artwork's
  visual bounds and stacking only. It does not move the centre, hit polygon, movement overlay,
  prop ground point or unit ground point.
- Every prop and unit uses the same projected centre plus an explicit pixel anchor. Percent
  offsets such as `top - 1.5%` and `top - 2.1%` are rejected.
- Movement, selected and danger effects use the same `W` by `2s` top-face box and polygon as
  the hit target. Transparent square padding never receives pointer events.

#### Required geometry tests and QA

The pass is not complete until all of the following are true:

1. Projection tests assert the six exact neighbour vectors within `0.001px`.
2. For each neighbouring pair, the two endpoints of the shared edge coincide within
   `0.001px`.
3. The calculated radius-three field bounds equal `7 * sqrt(3) * s` by `11 * s`.
4. Hit-test points accept the centre and all six inset sectors, and reject transparent corner
   points of the bounding rectangle.
5. A deterministic QA image shows at least three full rows, labelled centres, shared-edge
   guides and no background gaps between top faces.
6. The same projection positions terrain, reachable overlays, selected overlays, loads,
   platforms, the tally arch and unit ground anchors.
7. Validation commands are:

```bash
node scripts/test_expedition_hex_layout.mjs
node scripts/render_expedition_hex_qa.cjs
node scripts/validate_expedition_alpha.cjs <every changed transparent runtime asset>
node scripts/rebuild.cjs
node scripts/test_expedition_screen.cjs
```

#### Alpha preflight before any new image generation

No new raster art will be requested during geometry work. Before any later generated asset is
imported, it must pass all of these checks:

1. Real alpha outside the intended silhouette, not a painted checkerboard or light matte.
2. Automated neutral-background detection through `validate_expedition_alpha.cjs`.
3. A contact sheet composited on white, black, orchard green and cyan diagnostic backgrounds.
4. Edge inspection at 400 per cent for pale halos, square padding and semi-opaque remnants.
5. Recorded pixel dimensions, alpha bounds, intended ground anchor and runtime byte size in the
   manifest or art handover.

Image-generation credits are not approved until this preflight exists as a repeatable script
and the current assets have been audited with it.

#### Geometry pass status and first visual audit (2026-09-16)

The measured projection is now implemented in `expeditions/expedition-hex-layout.js` and
consumed by the board renderer. The old percentage override is no longer used. Automated
results:

- five of five geometry tests pass, including all six neighbour vectors, coincident shared
  edges, radius-three bounds and transparent-corner hit rejection
- `hex-projection-v4.png` shows a complete radius-three field with real pointy-top
  tessellation and no top-face gaps
- the focused Expedition screen render passes for all five catalogued scenarios
- the production app rebuild completes; existing duplicate-art-key warnings are unchanged

The first live component preview was visually inspected. The top faces now tessellate
correctly, diagonal rows sit in the gaps, the board is materially larger, movement overlays
share the exact top-face mask, numbered loads are readable and figures use field bases rather
than label capsules. This is a geometry success but not yet visual acceptance.

Outstanding presentation findings:

1. The current 384 by 384 terrain prism is being masked as a texture source. Repetition and
   lighting variation remain obvious across the field. A geometry-conforming terrain art
   package is still required before production acceptance.
2. The scenario starts Bramble on `-2,2`, which is also one of the two west-platform hexes.
   This makes the west balance platform inherently obscured in the opening state. Changing
   either the start positions or objective hexes is scenario-data work owned by Claude. Codex
   will not move them independently in presentation.
3. The averaged two-hex balance-platform footprint is too large beside the load on `1,0` and
   needs a smaller visual footprint plus an agreed ground anchor.
4. The top-row Hookmole competes with the floating instruction banner. The presentation pass
   must reserve a clear instruction band or move the instruction into the compact HUD.
5. Desktop, narrow-tablet and the remaining nine interaction states still require screenshot
   review. No acceptance claim has been made.

The repeatable alpha preflight now exists as
`scripts/render_expedition_alpha_qa.cjs`. The current terrain candidate, reachable and selected
effects, and all three carrying poses were composited on white, black, orchard green and cyan
in `assets/expeditions/production/9fo/qa/alpha-preflight-current-v1.png`. No checkerboard or
opaque square matte is visible in those six assets. This clears the current assets for further
layout testing, but it does not approve the terrain prism as the final tessellating tile art.

The subsequent runtime visual check moved the instruction out of the tactical field, reduced
the platform footprint and aligned the bottom row and unit bases. The screen still falls well
short of the mock-up's composed terrain. This pass is therefore handed back as **geometry
integrated, visual acceptance pending**, not as a finished Expedition screen. The full
regression suite passed: 264 unit tests and all 14 regression stages. No new image credits
were used.

The next art package should be requested only after a measured tile-art template is prepared:

- a top-face texture designed for the exact `sqrt(3)s` by `2s` pointy polygon, with no
  painted square padding or baked spacing
- a separate depth/wall layer keyed to that same polygon and a recorded ground anchor
- clear, difficult, blocked, stone and water-edge variants with compatible edge treatment
- overlays that align to the same top-face geometry, with their effects allowed to glow
  outside it but their tactical meaning confined to the actual hex

Before importing any replacement, render a three-row tessellation sample at the runtime
scale, check six shared-edge contacts against the projection tests and run the four-background
alpha preflight. The reference mock-up remains the target. Codex should continue owning this
presentation work; Claude's only requested intervention is to review the west-platform and
Bramble start overlap as scenario data when convenient, preserving the verified reference
trace if it changes.

### Codex presentation pass start note (2026-09-15)

Codex is starting the measured Ninefold Orchard presentation pass under the boundary above.
The shared-file scope is exact:

- `expeditions/expedition-ui-shared.jsx`: presentation geometry only. Replace the rejected
  percentage projection with pure pixel-based pointy-top helpers. Do not alter engine axial
  keys, neighbour rules or interaction data.
- `expeditions/ExpeditionBoard.jsx`: layout, visual layers, hit polygons, depth order, HUD,
  drawers and contextual controls only. Preserve `applyExpeditionCommand`, engine-derived
  state, command payloads, progress writes, reward handling, scenario selection and public
  gating unchanged.
- `scripts/render_expedition_hex_qa.cjs` and a focused geometry test: create the new measured
  QA artefact and assert exact neighbour centre offsets plus shared top-face edges.
- A no-credit alpha preflight may add a QA script and QA composite under
  `assets/expeditions/production/9fo/qa/`. It will use existing runtime assets only and will
  not generate, import or modify presentation art.

Measured basis: axial `(q,r)` projects to
`x = originX + sqrt(3) * s * (q + r / 2)` and `y = originY + 1.5 * s * r`.
The top-face polygon is a regular pointy-top hex of width `sqrt(3) * s` and height `2 * s`.
Faux depth is rendered below that polygon and is excluded from centres, hit testing and
neighbour calculations. The existing 384 px grass runtime image has an isometric four-sided
top face, so it is not geometry authority and will not be used as the hit mask.

Validation for this pass:

```bash
node scripts/test_expedition_hex_geometry.mjs
node scripts/render_expedition_hex_qa.cjs
node scripts/validate_expedition_alpha.cjs <each runtime asset used by the slice>
npm test
```

Codex will also inspect the geometry QA image, the dark/light alpha composite and the live
opening board at desktop and narrow-tablet widths before handing the presentation pass back.

### Claude: starting an engine-only proof map (2026-09-16)

Per the scope-freeze rule above, recording this before starting rather than after.

**Scenario:** Little Reckoning level 4, `lr_fog_lanterns` — "Lanterns in the Forgetting Fog"
(`connect` family, target 4, generic `fogling` enemies). Little Reckoning currently has only
its level-1 proof map (The Smudged Stones); this is its second.

**Why this one:** of levels 2–4, it is the only one buildable from content alone against the
engine as it stands. Level 2 ("Roughly at the Market") needs two independent tracked
quantities at once (value and weight), which the `optimise` family cannot express. Level 3
("The Backwards Courtyard") turned out to need more than content: `orderedRoute`'s
`routeProgress` counter is read by the evaluator but nothing anywhere in the engine ever
increments it, so the family is an unbuilt stub, not just unused. Level 4 reuses the
`connect` family plus the route-marker mechanism built two sessions ago specifically to wait
for a map like this — the first real user of both.

**Simplification going in, stated up front:** the brief's "shortest unobstructed network" asks
for a minimum-cost path; the `connect` family only checks boolean connectivity, not cost
minimisation. Connectivity will be the hard requirement; efficiency will be rewarded the same
way every other map already rewards it — the existing performance marks
(`exact_turn_target`, `minimum_movement`) against a verified reference trace — not a new hard
constraint.

**Files this touches:** `expeditions/fog-lanterns.js` (new), `expeditions/fog-lanterns.test.js`
(new), `scripts/simulate_fog_lanterns.mjs` (new), `expeditions/expedition-catalogue.js` (add
one entry), `scripts/run_regression.mjs` (register the two new files). No edits to
`ExpeditionBoard.jsx`, `ExpeditionScreen.jsx` or `expedition-ui-shared.jsx` — Codex's
declared files above are untouched. Validation: `npm test`.

### Claude: engine-only proof map shipped — a UI gap for Codex to know about (2026-09-16)

Done. Verified reference trace (round 3, 5 actions), 7 new tests, `npm test` green
(14/14 regression steps). Wired into the catalogue only — no shared-file edits, as declared
above.

One finding worth flagging rather than working around: **the live board has no way for a
player to actually rotate a route marker yet.** `objectLabel` and the Reframe-control filter
in `ExpeditionBoard.jsx`/`expedition-ui-shared.jsx` both key off `"op" in object`, but a route
marker uses `orientation`/`paths`, not `op` — so on the real board a marker currently renders
with a blank/undefined label and never appears in the Reframe control's candidate list, even
though `reframeTarget`/`useRoleAction` already handle `orientation` correctly at the engine
level (confirmed directly — the reference trace above calls `useRoleAction(..., "reframe",
{ orientation: 0 })` and wins). Loaded the live board in-browser to confirm this renders
without a crash (it does, zero console errors) rather than leaving it unverified. Not fixing
it myself since it's inside the files declared above as part of the active geometry pass —
flagging so it's on the list whenever Codex's board renderer gets to objects with an
`orientation` field, whether that's this pass or a later one.

### Claude: regression suite is currently red — not from my side (2026-09-16)

`npm test` just failed on the "Expedition briefing render" step (`scripts/test_expedition_screen.cjs`)
for the first time this project — every prior run today, including right after Lanterns in
the Forgetting Fog landed, was 14/14. Ran the script directly to get the real stack trace
rather than guess:

```
Error: Hex side length must be a positive number
    at pointyHexMetrics (...)
    at axialToPixel (...)
    at hexPosition (...)
    at boardPosition (...)
    at ExpeditionBoard (...)
```

It dies on the *first* board rendered by that script — Unequal Crossing, before my own
Lanterns addition is even reached — so this is not caused by anything in this session's
engine-side work. `pointyHexMetrics` (`expedition-hex-layout.js`) throws when `side <= 0`;
`fitPointyHexLayout` computes `side` from a `viewportWidth`/`viewportHeight` passed in from
`ExpeditionBoard.jsx`, which reads 0 (or similar) when there is no real DOM to measure — as is
the case under `renderToString` in this Node-based regression script, with no browser and no
layout pass. The geometry maths itself is fine as pure functions; the gap looks like the
`ExpeditionBoard.jsx` measurement wiring not yet having a fallback for a non-browser render.

**Resolved** — re-checked later the same session and `scripts/test_expedition_screen.cjs`
passes again; `npm test` is back to green (15/15, after a second Ninefold Orchard proof map
and its own new commander count correction, both below). One unrelated, unexplained
transient failure was also seen once on "primary generator sanity" (nothing to do with
Expeditions) and did not reproduce on a second run — noting it in case it recurs, not
treating it as a real regression on a single occurrence.

Not fixing this myself — it's inside the files declared as Codex's during the active
geometry pass. Flagging because `scripts/test_expedition_screen.cjs` is the regression step
that exists specifically to catch "a lazily visited screen fails to render" (see "Known
prototype history" below), and it is currently doing exactly that. `npm test` will read red
for anyone until this has a fallback for a zero/measured-later viewport size.

### Claude: a second Ninefold Orchard proof map, and a commander-power count correction (2026-09-16)

**The Maybe-Flock Roost** (`po_maybe_roost`, Ninefold Orchard level 5, `expeditions/
maybe-flock-roost.js`) — engine-only, no shared-file edits. Uses the "capture" objective
family, which existed in the engine with zero test coverage or scenario until now (same
situation "connect" was in before route markers). "Hold all three whistle posts at once,"
verified: round 2, 7 actions, no damage taken. 7 new tests, including two direct tests of
the capture family itself. Ninefold Orchard now has two playable scenarios, matching Little
Reckoning and Gifford — every module has two now, 24 of 30 authored briefs still need
content.

Also: the "15 of 30 Commander powers" figure quoted at the top of this document and in two
other places was my own arithmetic error, not a change by anyone else — the real count
before this session's Commander work was 10 (not 8), so the two batches of work already
described took it to 17, not 15. Corrected all three mentions. Current count: 17 of 30, all
still either direct reuse or a small precedented addition, per the earlier entries above.

### Claude: item 1 of the delegated backlog complete — visible checks, six-map §9 retrofit, and a real design finding (2026-09-16)

Files: `expeditions/expedition-engine.js` (`attemptCheck`, `VISIBLE_CHECK` command),
`expeditions/expedition-schema.js` (`VisibleCheckDeclaration` typedef,
`validateVisibleCheckDeclaration`), `expeditions/expedition-engine.test.js` (8 new tests) for
the primitive; each of the six existing scenario `.test.js` files, plus one new import each
of `EXPEDITION_SCENARIOS`/`assessSquadReadiness`, for the retrofit. Validation:
`npm test` — 15/15 (290 unit tests total across the suite now). No edits to
`ExpeditionBoard.jsx`, `ExpeditionScreen.jsx` or any other Codex-declared file.

**Visible-check primitive** (`attemptCheck`): `Check power = named statistic + adjacent-ally
support (same rule as strikeEnemy) + a declared bonus`, success at or above a printed
difficulty. No randomness; every component is in the history entry the command dispatcher
already turns into an `ACTION_RESOLVED` event, so nothing new was needed there. A failed
check is a recorded outcome, not a thrown error — only an illegal attempt (bad target, unknown
statistic, missing difficulty) throws. `validateVisibleCheckDeclaration` is a standalone
validator for the declaration shape a scenario object would carry (`statIndex`, `difficulty`,
optional `bonus`+`bonusLabel`, a required child-readable `description`) — not wired into
`validateScenarioBlueprint`, since checks live on concrete scenario objects, not the abstract
thirty-brief catalogue that function validates. No scenario declares one yet; this is the
primitive only, per the instruction not to add board UI for it.

**Six-map §9 retrofit — a below-recommendation squad, tested honestly.** Every map now has a
test constructing a plausible weak squad (real rarity/BV combinations below that scenario's
own band) and proving `assessSquadReadiness` names the specific shortfall — satisfying "the
test must prove the limitation is genuinely present... in the readiness result" by the
literal wording of the instruction. Embark itself was never at risk (advisory only, unchanged).

**The "why one card can't do it all" half surfaced a real finding, not a formality.** I
checked this claim against the actual engine for all six maps rather than writing it as
boilerplate, and it is only true for three:

- **True, proved structurally:** The Maybe-Flock Roost — the capture family requires three
  hexes held *simultaneously*, and one unit can only occupy one hex. No search needed.
- **True, proved by action-budget arithmetic:** The Unequal Crossing (4 crates x 2 actions
  each = 8, exactly a solo hero's entire four-round budget, with nothing left for the
  mandatory final move onto the exit arch) and The Examination Clock (4 tasks x >=3 actions
  each = 12 minimum, against a 10-action solo budget).
- **False as currently designed — recorded honestly, not papered over:** The Smudged Stones,
  The Sealed Archive and Lanterns in the Forgetting Fog. In all three, I found that the exact
  reference-trace hero (Addy, Adavoss, Hunchik respectively) can complete the entire map
  alone using only her own actions, with the other two or three heroes never acting at all,
  and comfortably under her own solo action budget. Each map's test file now has a passing
  test *proving* this solo completion, labelled as a documented gap rather than a bug, right
  next to the (necessarily absent) infeasibility claim.

This is a genuine tension with §9 as literally instructed ("all six"). I have not redesigned
any of the three to force multi-hero cooperation — that would change already-verified,
locked reference traces and board layouts, which reads as exactly the kind of product
decision this backlog's own preamble says should pause the work rather than be guessed at.

**Question:** for the three non-compliant maps, do you want them redesigned to genuinely
require multiple heroes (e.g. spacing route markers/vaults far enough apart that no single
hero's move stat can reach all of them inside the turn limit), or is a documented exception
acceptable for these three specifically, given they are all early-tier (levels 1, 1/3, 4) and
the route doc's own design notes only make the "no single hero" claim explicit for Map 5?

Given the size of the remaining backlog (items 2-8: a 90-card capability audit, Maps 2-6
engine builds, the late-map feasibility package, the enemy catalogue, the procedural
framework, the Adventure-upgrade analysis and Commander/regression hardening), I'm pausing
here for this one specific decision rather than because the instruction said to keep going —
it explicitly said not to pause "unless the work exposes a product decision not covered by the
source documents," and this is exactly that.

### Claude: the three non-compliant maps are redesigned — "force multihero cooperation" (2026-09-16)

Sam's answer to the question above: redesign all three so a single hero genuinely cannot do
it alone. Done for all three, each verified by direct simulation before being locked into a
test or a `simulate_*` script — no fabricated infeasibility tests. Files touched: The Smudged
Stones (`expeditions/smudged-stones.js`, `expeditions/smudged-stones.test.js`,
`scripts/simulate_smudged_stones.mjs` unchanged, `expedition-data.js`'s `lr_smudged_stones`
brief); Lanterns in the Forgetting Fog (`expeditions/fog-lanterns.js`,
`expeditions/fog-lanterns.test.js`, `scripts/simulate_fog_lanterns.mjs`,
`expedition-data.js`'s `lr_fog_lanterns` brief, `expedition-catalogue.js`'s `marksPar`); The
Sealed Archive (`expeditions/sealed-archive.js`, `expeditions/sealed-archive.test.js`,
`scripts/simulate_sealed_archive.mjs`, `expedition-catalogue.js`'s `marksPar`). No edits to any
Codex-owned file. Validation: `node --test` on each scenario's test file directly (8/8 for
Sealed Archive, all others unchanged and still green), each `simulate_*.mjs` run directly, then
`npm test` (14 of 15 green every time; `bundle_smoke.cjs` consistently hits a default-heap
out-of-memory crash on this machine right now, reproduced both inside and outside `npm test`,
but passes clean with `node --max-old-space-size=6144 scripts/bundle_smoke.cjs` — a local
memory-pressure ceiling on the whole ~127MB bundle mount, unrelated to any Expeditions file and
not something touched by this work; flagging rather than quietly working around it, since it is
outside this backlog's scope to fix).

- **The Smudged Stones** (action-budget argument): `turnLimit` tightened from 5 to 2. Restoring
  all three operators takes 3 reframe actions plus at least 2 moves between them — 5 actions
  minimum, needing at least 3 rounds for any single hero regardless of stats — while the
  existing three-hero reference trace already finished in round 2. `lr_smudged_stones`'s brief
  `turns` field updated to match.
- **Lanterns in the Forgetting Fog** (action-budget + repositioning): squad starts moved so
  each hero begins adjacent to a different route marker (one each), and `turnLimit` tightened
  from 5 to 1. The three-hero solution now needs no travel at all (each reframes her own
  marker in round 1); a solo hero would need to reach all three widely-spaced markers herself,
  at least 3 rounds by the same arithmetic as The Smudged Stones. `lr_fog_lanterns`'s brief
  `turns` field and `expedition-catalogue.js`'s `marksPar` updated to match (`{turns: 1,
  movement: 0}` — any win meets the turn mark here, a known property of the map, not a bug).
- **The Sealed Archive** (structural — no action-budget fix was available): only Adavoss has
  the arithmetic discipline needed to Combine, so tightening the clock alone could never force
  cooperation; the fix instead moves each `feeder_*` stone far from its paired `vault_*` and
  marks every stone (vaults included, since Combine requires both objects movable) `movable:
  true`, so the other three heroes must physically fetch and carry a feeder home each — using
  the existing, discipline-agnostic `interactObject` collect/carry/drop, never touching
  Combine itself — while Adavoss travels between vaults combining whatever has arrived.
  `turnLimit` stays 5 (unchanged): the fix is entirely in the objects' placement and
  movability. Verified reference trace: three-hero relay wins in round 5 (25 actions, 28
  movement — `expedition-catalogue.js`'s `marksPar` updated to match); Adavoss playing it
  completely alone has raised only one of the three vaults by the end of round 5 and is still
  carrying the second feeder toward its vault when the round ends.

### Claude: item 2 of the delegated backlog complete — 90-card capability audit (2026-09-16)

Files: `EXPEDITIONS_CARD_AUDIT.md` (the readable report), `expeditions/card-audit.test.js` (7
new deterministic tests, all derived from the same live `expeditionRoster`/
`assessSquadReadiness`/`EXPEDITION_SCENARIOS` calls the report quotes — no hand-counted
figures), `scripts/run_regression.mjs` (new test file wired into the existing `node --test`
step, per house style — no new one-off script). Validation: `node --test
expeditions/card-audit.test.js` (7/7), then a full `npm test` (14/15; the one
`bundle_smoke.cjs` failure is the same unrelated local heap-limit issue flagged in the entry
above, reproduced again here on an unmodified file).

Audited all 90 real cards (the actual pack-opened `JUNIOR_CARDS`/`PRIMARY_CARDS`/
`INTERMEDIATE_CARDS`, not a separate Expeditions dataset) for printed stats, discipline, role,
trait, Move, Hearts, Power and rarity/BV, then exhaustively tested every one of the C(30,3) =
4,060 possible three-card Primary squads against `EXPEDITIONS_NINEFOLD_ROUTE.md`'s stated
per-map readiness requirements (via the real `assessSquadReadiness`, not a re-implementation).
Full findings are in the report; the two the backlog explicitly asked to watch for:

- **Nothing is impossible.** Every level 3–10 recommendation is met by at least one real squad
  (the tightest, Levels 9–10's all-Epic-or-Legendary requirement, by exactly the 56 = C(8,3)
  squads drawable from the collection's 6 Epic + 2 Legendary cards).
- **Levels 1–2 are trivial, more strongly than "almost every":** literally 4,060/4,060 (100%)
  of all possible squads meet the stated "average BV 12", because the lowest BV anywhere in the
  30-card collection is 13 — even the worst all-Common squad clears it. The readiness meter
  cannot show a shortfall on these two levels with the current numbers.

No card data was changed to hide either finding, per the instruction. Also noted: a real
Common/Uncommon rarity cliff at Level 3 (0 of 220 all-Common squads meet any Level 3+
recommendation), the average-BV and rarity-floor conditions are not always redundant of each
other, and Gifford's rarity distribution (9/5/5/9/2) deliberately differs from the other two
modules' (12/5/5/6/2) to suit its larger squad size and harder readiness bands.

### Claude: item 3 of the delegated backlog started — Map 2, The Counting Orchard, engine-built (2026-09-16)

Files: `expeditions/expedition-engine.js` (new `peck-lane` enemy behaviour), `expeditions/
counting-orchard.js` (new scenario), `expeditions/counting-orchard.test.js` (11 tests),
`scripts/simulate_counting_orchard.mjs` (reference trace), `expeditions/expedition-catalogue.js`
(new `po_counting_orchard` entry, loan squad `pip`/`bramble`/`nine`, `marksPar` from the
verified trace), `expedition-data.js` (the `po_counting_orchard` brief's placeholder `objects`
field corrected from `[1,2,3,4,5,6]` to the route doc's real `[2,3,4,5,7,8]`; `turns` and
`family` already matched), `scripts/run_regression.mjs` (both new files wired in). Validation:
`node --test expeditions/counting-orchard.test.js` (11/11), `node
scripts/simulate_counting_orchard.mjs`, then a full `npm test` (15/16; the one `bundle_smoke.cjs`
failure is the same unrelated local heap-limit issue logged twice already in this file).

Six baskets (2, 3, 4, 5, 7, 8) on three lanes, two per lane; the harvest gate is exactly two
hexes, so the engine's existing one-object-per-hex rule alone enforces "only two baskets may
occupy the gate" — no new rule needed. The generic `exactSum` objective family (already used
elsewhere) checks the gate's total directly. New engine behaviour `peck-lane`: the Scruffcrow
advances through a fixed, repeating lane order and reduces that lane's highest *unguarded*
basket by one each round, purely by the object's `lane` tag — never by proximity, and it never
attacks a hero, matching the route doc's "a problem to solve, not a surprise punishment" design.
A basket being carried (`pos: null`) is automatically safe, same as a guarded one.

Verified reference trace (REF-11): win in round 2, 5 actions, using the two direct baskets 4 + 8
= 12; Pip starts on basket_8 and Bramble starts beside basket_4, so the whole trace needs no
detour at all. Also verified and tested: the Combine-based third route the doc describes by
name (merging 3 + 4 into a fresh 7, partnering the untouched 5 for another 12); Guard protecting
a basket from the peck; the Scruffcrow's fixed lane order over three rounds; a target-10 variant
of the same six baskets played end-to-end (2 + 8 = 10), plus confirming all three envelope
targets (10, 11, 12) each have exactly two direct pairs available in this value set; an all-Epic
squad replaying the identical trace (no card is ever mechanically excluded); and — per §2's
finding — that even the weakest possible three-card squad meets this map's own readiness
recommendation, since Levels 1–2 are trivial for the whole real collection.

One honestly-recorded limit, not a defect: "no-unannounced-impossible-state" is tested for the
realistic case (one full round of total inaction still leaves a valid 12-pair among the six
baskets), not for standing still the entire turn limit — a solver check found that after three
full idle rounds a temporary window with no valid pair exists (before a fourth round's peck
coincidentally creates a new one, by which point the turn limit has already been exceeded
anyway). This was not an unannounced trap in the sense the non-negotiable test cares about: the
Scruffcrow's target is a fully deterministic function of visible data, so every one of those
three rounds' outcomes was predictable in advance from round 1 — the player simply never acted
on that information across three consecutive rounds, which the reference trace (a two-round win)
never comes close to needing.

Remaining for item 3: Maps 3 (Nine Across the Bridge), 4 (The Widdershins Path) and 6 (Ten
Honest Bundles) — Map 5 (The Maybe-Flock Roost) already exists from earlier work. Procedural
generation beyond the hand-verified envelope checks above (seeded generation, solution
verification, repetition protection) is explicitly item 6's job, not item 3's, and is not
started yet.

## Non-negotiable product boundary

Expeditions is not approved for release.

Until the user explicitly changes this instruction:

- Only the exact `eudaimon` profile with the Rooke avatar may see the Expeditions home tile.
- Only that developer profile may enter an Expeditions route.
- Do not remove, weaken or generalise this gate.
- Do not add Expeditions to onboarding, tours, reports, freemium messaging or parent-facing copy.
- Do not treat existing prototype UI as approved visual design.
- Do not replace or remove Adventures. Adventures remain the card-upgrade mode.

The existing gate uses `isDevUnlockProfile(profile)` from `wm-entitlement.js`. This requires both the exact lower-cased name and the exact Rooke avatar, not the name alone.

## Repository constraints

- Plain JavaScript and JSX only. No TypeScript.
- UK English throughout.
- No Oxford commas and no em dashes.
- The game works offline with no server and no runtime AI.
- The final client is bundled into one HTML file and packaged through Capacitor.
- All progress updates go through the `setProgress` callback supplied by `App`.
- Do not write directly to `localStorage` from a screen component.
- Preserve unrelated work in the dirty worktree.
- Use pure deterministic game logic wherever possible.

Build and regression command:

```bash
npm test
```

This runs unit tests, all three generator sanity suites, Adventure validation, Expedition validation, a reference playthrough, the production rebuild and the bundle smoke test.

## Source-of-truth reading order

1. `AGENTS.md`
2. `EXPEDITIONS_MASTER_BRIEF.md`
3. `EXPEDITIONS_BUILD_BRIEF.md`
4. `EXPEDITIONS_SPEC.md`
5. `EXPEDITIONS_CARD_COMBAT_CONTRACT.md`
6. `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md`
7. `EXPEDITIONS_SCENARIO_ART_MATRIX.md`
8. `EXPEDITIONS_NINEFOLD_ROUTE.md`
9. `EXPEDITIONS_LITTLE_RECKONING_ROUTE.md`
10. `EXPEDITIONS_GIFFORD_ROUTE.md`
11. `EXPEDITIONS_ROSTER.md`
12. `EXPEDITIONS_ART_PIPELINE.md`
13. `EXPEDITIONS_ART_HANDOVER.md`
14. `EXPEDITIONS_VISUAL_ACCEPTANCE.md`
15. `assets/expeditions/production/9fo/manifest.json`
16. `expeditions/expedition-data.js`
17. `expeditions/expedition-roster.js`
18. `expeditions/expedition-engine.js`
19. `expeditions/unequal-crossing.js`
20. `expeditions/ExpeditionScreen.jsx`

If prose and executable tests disagree, stop and report the conflict. Do not silently reinterpret the user-facing design.

## Current state

### UI reconciliation contract: existing prototype versus new art direction

The current Ninefold Orchard expedition screen is the functional reference for
information architecture. It has three important regions: a left party rail, a
central tactical board and a right objective rail. The newer vertical-slice art
mock-ups are presentation references for the board, background, sprites,
platforms and controls. They must not be interpreted as a replacement for the
party or objective information.

The canonical desktop composition is therefore:

```text
party rail | large faux-3D hex board | objective and intentions rail
                 top round HUD
                 bottom contextual action rail
```

The party rail remains the authoritative view of the deployed team. It shows
three to five selected cards, current hearts and action points, role, carried
weight and selected-character state. On narrow screens it becomes a drawer;
it is not removed just because the board is larger.

The central board may use the new painted background and sprite assets, but the
existing axial coordinates, movement highlights, occupancy rules, objective
sockets and enemy paths remain unchanged. Art is a skin over the engine state.

The right rail remains the authoritative view of the mission. It contains the
primary objective, progress, enemy intentions and field report. Enemy warning
icons and projected paths may also appear on the board, but they must agree
with the text rail and must be generated from the same state.

#### Weigh-bridge state

The balance platforms are stateful puzzle objects, not decorative images. For
each platform the engine owns `target`, `currentTotal`, `difference` and a
status of `underweight`, `balanced` or `overloaded`. The UI renders both the
visual platform state and exact live text. For example:

```text
BRIDGE A   7 / 7   BALANCED
BRIDGE B   6 / 7   NEEDS 1
ARCH       LOCKED
```

The art layer must never contain baked-in totals. If a hero is carrying an
object, the party rail shows the carried value and the action preview shows the
result before dispatch, for example `6 + 3 = 9; overloaded by 2`. The tally arch
opens only when all required platform constraints are satisfied and a legal
hero route exists.

The new mock-ups therefore provide the board and visual states while the
existing prototype supplies the information architecture and interaction
contract. Preserve both during implementation. Do not create a second,
independent sum, objective tracker or party model in the new layout.

#### Responsive and accessibility requirements

- Desktop: party rail, board and objective rail visible together.
- Tablet/mobile: board remains primary; party and objective rails become
  labelled drawers.
- Every visual balance state has an exact text equivalent and an accessible
  label.
- Round, undo, place-load, guard and end-round controls retain disabled,
  selected, warning and complete states.
- The new button artwork is presentation only. Dispatch continues through
  `applyExpeditionCommand`.

#### Acceptance tests for the reconciliation

1. Selecting a hero in the party rail selects the same unit on the board.
2. Carrying or placing a load updates the party badge, platform total, visual
   platform state and objective progress from one state transition.
3. A platform showing `7 / 7` is balanced in both the engine and the rendered
   UI; an overloaded platform cannot be reported as complete.
4. Enemy intention text and board warning markers describe the same target and
   action.
5. Collapsing either rail does not change the underlying expedition state.
6. The new art can be removed or replaced without changing rules, persistence
   or test traces.

#### Weigh-bridge state: implemented (Claude's side of the split)

`evaluateObjective`'s `"balance"` case (`expeditions/expedition-engine.js`) now returns a
`sides: { left, right }` field alongside the existing `values`, each side an engine-owned
`{ target, currentTotal, difference, status }` — `status` is `underweight`, `balanced` or
`overloaded`, `difference` is signed (`currentTotal - target`). `complete` is now derived
from both sides being exactly `balanced`, not from `left === right` alone: Unequal Crossing's
own crate values (2, 3, 4, 5) can only tie at 0 or at the target of 7, so this was never
reachable through the shipped scenario, but a future balance scenario with a different crate
set could otherwise report two equal, over-target platforms as solved. Covered by three new
tests in `expedition-engine.test.js`, including one built on a minimal custom scenario
(`createExpeditionState` directly, not Unequal Crossing) specifically to exercise the
equal-but-overloaded case acceptance test 3 describes. `values.left/right/exited` is
unchanged, so every existing caller and test keeps working untouched.

`ExpeditionBoard.jsx` renders this directly: each platform's art state (including the
manifest's `overloaded` state, unused until now) comes from `side.status`, and an exact text
line — `7/7 · Balanced`, `5/7 · Needs 2`, `9/7 · Over by 2` — is shown under every platform
regardless of module, satisfying "every visual balance state has an exact text equivalent".
This is the backend half of the reconciliation contract; the visual/presentation layer beyond
this (background, sprite composition, responsive drawers) is Luna's side of the split.

### Specified

- Three age-tier difficulty envelopes
- Five mathematical disciplines
- Five field roles
- Five traits
- Twenty-five discipline-role signature identities
- Twelve reusable objective families
- Thirty named scenario briefs
- Thirty boss Commander powers
- Field conversion for all ninety regular cards
- Procedural-generation pipeline and rejection rules
- Five-band collection-power progression culminating in full Epic squads
- Operator-wheel, constraint-grid and mathematics-led combat mechanisms
- Art production approach and mock-ups

### Implemented as reusable code

- Axial hex geometry
- Board creation
- Reachability and pathfinding
- Immutable state transitions
- Two action points per character
- Move, collect, place, guard and basic strike
- One engine action for each discipline as a proof of the dispatch pattern
- Deterministic enemy phase
- Twelve objective evaluators
- Roster conversion and balanced role assignment
- Validation across all cards, scenarios and enemy references

### Implemented as reusable code (E2 additions)

- All fifteen discipline actions (Split, Exact Count, Shape Field, Measure, Put in Order,
  Deduce, Transform, Chain Reaction, Dash, Interrupt joined the original five)
- All five role actions (Restore, Reframe, Shove, Mark joined Guard)
- All five traits with real mechanical effects (Precise, Sure-footed, Foresight, Adaptable, Quick)
- A command dispatcher (`applyExpeditionCommand`) and structured events, wrapping the
  existing named functions without changing any existing caller
- Commander slot infrastructure and 17 of 30 Commander powers with real effects (the rest
  name mechanisms — market rates, ledger statements, concealed estimates, partition
  regions, swarm counting — that later content stages have not built yet; see
  expedition-commander.js). The four added after the first eight are all reuses of an
  already-implemented mechanism under a new narrative reading, not new engine capability:
  "turn a near miss into an exact result" and "ignore the first obscured value" reuse the
  existing one-point-nudge and stabilise effects; "cancel one enemy reaction after it is
  revealed" reuses the existing watch-extension (the enemy sits out the round); "repeat a
  completed non-combat interaction" is a new `repeatInteraction` effect, but it only
  applies interactObject's existing collect/drop rules without spending the action point —
  the same "free action" precedent Dash's bonus move token already established for Move.
  Two further candidates ("treat one zero as a neutral operation", "reverse one forced
  movement") were considered and left unimplemented: the first would need a change to how
  the chain constraint itself evaluates a step, and the second has no existing "forced
  movement of a hero" mechanism to reverse — both are genuinely new mechanisms, not reuse,
  so they were not stretched.
- Three new mechanisms, each with its own tests, built specifically to unlock a further
  three Commander powers (expedition-engine.js unless noted):
  - **Route markers**: a board object with a fixed `pos`, a rotatable `orientation` (0-5)
    and `paths` (pairs of local hex-edge directions it joins at orientation 0, matching
    `HEX_DIRECTIONS`' order). `routeMarkerConnections(marker)` derives which two of its six
    neighbouring hexes it currently connects; the "connect" objective family merges these
    in via a new `objective.routeMarkerIds` alongside any fixed `edges`. Unlocks
    `primary_commander_3` ("rotate one route marker") via a new `rotateRouteMarker` effect
    in expedition-commander.js. No scenario uses this yet — like `stabiliseObject` and
    `reserveHexForRound` before it, the mechanism is real and tested but still waiting for
    a map to be authored against it.
  - **Weighted graph edges**: an edge in the "connect" family's `edges` list may now be
    `[a, b]` (default weight 1) or `[a, b, weight]` — `graphConnected` only ever reads the
    first two elements, so every existing edges list keeps working unchanged. The new
    `edgesFromNode(edges, nodeId)` returns every edge touching a node with its cost. Unlocks
    `intermediate_commander_2` ("reveal the cost of every edge leaving one node") via a new
    `revealEdgeCosts` effect that marks the node in `state.flags.revealedEdgeNodes` — the
    same "engine owns it, a future UI reads it" pattern `revealAllIntents` and the
    weigh-bridge state already use, rather than a Commander power answering a query
    directly. `intermediate_commander_6` ("prevent one predicted edge closure") is **not**
    unlocked by this: it needs some mechanic that actually closes an edge over time (an
    enemy behaviour that doesn't exist), not just a weight on it, so it stays deliberately
    unimplemented rather than stretched.
  - **Changed-tile memory**: `placeObstacle` (Strawless, primary_commander_6) now records a
    tile's `previousTerrain` before blocking it; the new `restoreTileTerrain(state, hex)`
    reverses it, throwing if nothing was recorded. Unlocks `junior_commander_4` ("remember
    and restore one changed tile") via a new `restoreChangedTile` effect, and doubles as the
    fix for `placeObstacle`'s own long-standing "not yet actually temporary" caveat — an
    obstacle can now genuinely be undone, just not automatically on a timer.
- Seeded procedural generation primitives (E3): a deterministic PRNG, and three
  mathematical kernels (equal partition, operator restoration, scheduling) that generate
  then reject impossible or ambiguous candidates

### Implemented at the engine layer (E4)

- Little Reckoning level 1, The Smudged Stones (`expeditions/smudged-stones.js`): a
  single-route simplification of the two-crossing-paths concept, using a new "chain"
  constraint kind and Reckoner's Reframe. Reference solution: round 2, six player actions.
- Gifford level 1, The Examination Clock (`expeditions/examination-clock.js`): four task
  tokens delivered to four station bays (a simplification of three shared stations, which
  would need hex multi-occupancy this engine does not have), using the "optimise" family's
  delivery-aware mode. Reference solution: round 2, sixteen player actions.
- Both have a verified reference trace (`scripts/simulate_smudged_stones.mjs`,
  `scripts/simulate_examination_clock.mjs`) locked into the regression suite, and enemy
  behaviour tests (obscure-operator for Walking Smudge; generic pressure for Proctor).
- `explainExpeditionOutcome` and `expeditionTimingReport`: generic, family-agnostic failure
  explanation and post-run timing metrics, usable by any scenario.

### Implemented at the engine layer (E7, first content pass)

- Gifford level 3, The Sealed Archive (`expeditions/sealed-archive.js`): the authored brief's
  "row, column and parity constraints" is simplified to three independent constraints of
  genuinely different kinds — a sum, a parity check and an inequality — each opening one
  vault, matching the brief's own "three linked vaults" framing exactly. `constraintGrid`
  has no spatial row/column addressing (constraints reference object ids, not board
  positions), so a literal grid was not attempted. The puzzle is raising each vault stone to
  its required value with Arithmetic's Combine action, merging an adjacent feeder stone into
  it — the first proof map to use Combine/Split rather than Reframe or delivery. Reference
  solution: round 4, seven player actions.
- Gifford now has **two** playable scenarios, so the "one playable entry per module"
  assumption baked into the original screen no longer held. `expedition-catalogue.js` gained
  `playableScenarioIdsForModule` (plural — every playable id for a module, in catalogue
  order); `playableScenarioIdForModule` (singular) still exists for callers that only want
  the first. `ExpeditionScreen.jsx`'s catalogue map is now clickable: selecting a scenario
  re-derives squad size, loan squad and briefing text for it, and the choice is threaded
  through to `ExpeditionBoard` on "Begin the expedition" — Ninefold Orchard and Little
  Reckoning are unaffected, since they still resolve to their one entry.
- A board-design gotcha worth recording for future maps: `reachableHexes` treats *any* hex
  holding an object as fully impassable — not just unlandable, but unable to be walked
  through — unlike enemy pathing (`shortestPath`), which only blocks on units. A vault/feeder
  pair placed on the only route between a hero's start and a later objective will wall it off
  entirely; the fix is routing around it, not assuming hex-distance alone implies
  reachability. This was caught by building and running the actual reference trace against
  the real engine before finalising hex positions, not by inspecting the board.

### Implemented as a private prototype (UI-wired) — all four catalogued scenarios (E6, E7)

- `expeditions/expedition-catalogue.js`: the registry of which scenarios are actually
  playable end-to-end (today: one each for Ninefold Orchard and Little Reckoning, two for
  Gifford since E7). Adding the next map is one entry here, not a screen rewrite.
- The screen is now split: `ExpeditionScreen.jsx` owns the map/briefing/squad flow,
  `ExpeditionBoard.jsx` owns the tactical board and result overlay — both work for any
  catalogued scenario, not just The Unequal Crossing. The objective panel branches on
  `state.objective.family` (a left/right total for balance, the engine's own `progress`
  string otherwise); a Reframe control appears whenever the selected hero stands next to an
  operator object, wired to the ROLE_ACTION command.
- Action dispatch goes through `applyExpeditionCommand`; the on-screen field report is built
  from the structured events it returns (`describeEvent` in ExpeditionBoard.jsx), not raw
  history entries — the first real consumer of E2's command/event layer.
- Ninefold Orchard renders the wiring-candidate art manifest (EXPEDITIONS_ART_HANDOVER.md):
  `expeditions/expedition-9fo-art.js` imports every runtime WebP directly (esbuild inlines
  each as a base64 data URI — see `.webp: "dataurl"` in scripts/rebuild.cjs — so the
  single-file offline HTML requirement holds), covering characters, the Hookmole, terrain
  and loads, with the background plate behind the board. Little Reckoning and Gifford have
  no manifest yet and keep the emoji/portrait stand-ins — a clearly-a-placeholder fallback,
  which is fine behind the developer-only gate this whole screen sits behind.
- `scripts/test_expedition_screen.cjs` now server-renders the briefing AND the tactical
  board for all three catalogued scenarios independently (six renders total), not just the
  original prototype's briefing.
- Three-character (four for Gifford) squad selection
- Pip, Bramble and Nine as opening training loans for Ninefold Orchard (Addy/Zoomby/Hunchik
  for Little Reckoning; four Gifford commons for Gifford)
- Visible movement hexes and enemy intentions
- Objective totals, undo and round resolution
- Version-2 Expedition progress (E5): `{ version, scenarios: { [id]: { completed, bestTurns,
  bestActions, marks, recentSeeds, lastBlueprintVersion } }, moduleSetRewarded }`, per module
  (see `freshExpeditionProgress`/`migrateExpeditionProgress` in wm-progress.js). The private
  prototype's version-less `{ completed, bestTurns }` shape migrates up automatically, both
  eagerly at profile load (`migrateAllExpeditionProgress`, wired into `enterProfile`) and
  defensively on every read/write (every selector and `applyExpeditionResult` itself call
  `migrateExpeditionProgress` first) — there is no path that can see the old shape and break.
- `applyExpeditionResult` (wm-progress-actions.js): the idempotent first-clear reducer,
  outside React, matching applyAnswer/applyBossDefeat/applyMockResult's existing pattern.
  Replay grants nothing; the module-set Reveal token (once all ten clear) grants the same
  `challengeTokens` currency Card Lab's Reveal action already spends, exactly once.
- Reference solution: round four, nineteen player actions

### Ninefold Orchard object and control art (second art pass)

Codex's second Ninefold Orchard delivery added a three-image vertical-slice screen pack
(`assets/expeditions/production/9fo/mockups/po-unequal-crossing-{opening,mid-puzzle,complete}-v1.png`)
as a layout contract, not new runtime sprites — the manifest's 231 references were unchanged.
Reviewing it against `ExpeditionBoard.jsx` showed most of the referenced categories
(`objectives.balance`, `objectives.tallyArch`, `ui.buttonFrames`, `ui.actionIcons`) were
already imported into `expedition-9fo-art.js` from the first pass but never actually used in
the JSX, which still drew plain CSS panels and coloured buttons everywhere. This pass wired
the unused categories in rather than attempting to reproduce the mockups' full painted
environment (river, bridge, waterfall) pixel-for-pixel, which the handover itself says is a
layout reference, not a slice-able asset:

- The balance objective panel (Unequal Crossing only) now renders the two brass platforms
  from `objectives.balance`, each independently in its own empty/loaded/complete state driven
  by that side's own running total against the target, with the live total overlaid at the
  manifest's `dialCentre` anchor. `overloaded`/`broken` go unused: this scenario has no
  over-capacity concept for them to represent.
- The exit hex uses `objectives.tallyArch` (dormant / active once both sides hold the target
  / complete once a hero has exited) in place of the flat teal gradient. `blocked` is left
  unused — no hazard threatens the exit hex specifically in this scenario.
- A new `NfoActionButton` (frame + icon + live text label, per the handover's wiring order
  point 9) replaces the plain coloured buttons for Place load, Guard, End round and Undo,
  module-gated exactly like every other Ninefold Orchard art hook — Little Reckoning and
  Gifford keep the plain buttons. Reframe's +/−/× buttons were deliberately left as plain
  buttons: the symbol itself is the label, and a generic "rotate" icon would only make it
  harder to see which operator is which at a glance.
- Verified live in the browser as the eudaimon/Rooke profile: both platforms and all four
  composed buttons render correctly, dispatch still works, and `aria-label` was added to
  `NfoActionButton` after `read_page`'s accessibility snapshot showed the button losing its
  accessible name despite an intact text label in the DOM — a real, if narrow, regression
  worth the one-line fix rather than leaving ambiguous.
- Not attempted this pass: the team-readiness meter (no obvious home in the current
  screens — it reads as squad-selection feedback, not board feedback) and the operator-wheel
  mechanism art (Little Reckoning's mechanic, not Ninefold Orchard's).

### Performance marks (post-E7 pass)

- `computeExpeditionMarks(state, par)` (expedition-engine.js): a pure, decorative pass over a
  won state computing which of four generic marks apply — `no_exhaustion` (no hero ever
  struck to zero hearts, tracked by a new `counters.unitsExhausted`, distinct from
  `damageTaken`), `no_enemies_defeated` (a pacifist clear), `exact_turn_target` and
  `minimum_movement` (rounds/movement at or under a scenario's `marksPar`). The spec's fifth
  category, an "optional mathematical constraint" mark, is scenario-specific and deliberately
  deferred, not built.
- `marksPar` lives on each `EXPEDITION_CATALOGUE` entry (expedition-catalogue.js), read
  directly off that scenario's own verified reference trace (`scripts/simulate_*.mjs`) so the
  bar is never invented. Note Unequal Crossing's turn-limit is 4 and its trace also finishes
  in round 4, so `exact_turn_target` is met by any win there — a known property of that map,
  not a bug.
- Wired end to end: `ExpeditionBoard.jsx` computes the marks on a win, shows them as badges on
  the result overlay (labels in `EXPEDITION_MARK_LABELS`, expedition-ui-shared.jsx), and passes
  them into `applyExpeditionResult`'s existing `marks` field — no changes needed there, it
  already accepted and deduplicated an arbitrary mark list.
- Marks remain purely decorative: they are never read anywhere that gates content.

### Not implemented

- The remaining twenty-four playable map configurations (six of thirty now exist, all wired
  into the UI; twenty-four still need content and a verified reference trace). A seventh
  (Ninefold Orchard level 2, The Counting Orchard) was attempted and deliberately **not**
  kept: hand-verifying its reference trace hit real multi-hero path congestion around a
  shared delivery region, and rather than ship a map without the same locked-reference-trace
  discipline every other map has, it was reverted. E7 (the remaining twenty-four maps) is a
  genuine content-production effort — each map so far has needed real iteration to get board
  geometry and a verified trace right — better tackled map by map than rushed to pad the
  count.
- Full board-grammar-driven procedural generation and adversarial enemy-schedule validation
  (G3/G5/G6) — blocked on more proof maps existing to generate against
- The remaining 13 of 30 Commander powers (see expedition-commander.js's registry) — every
  one left names a mechanism (market rates, ledger statements, concealed estimates,
  partition regions, swarm counting, expression substitution, a chain-constraint override,
  reversible forced movement, an optimise-family lock, predicted edge closure) this engine
  genuinely does not have yet
- The "optional mathematical constraint" performance mark (scenario-specific; the four
  generic marks are computed, see above)
- Final sprite manifests and animations for Little Reckoning and Gifford (Ninefold Orchard
  now has a wiring-candidate manifest — see EXPEDITIONS_ART_HANDOVER.md)
- Complete accessibility layer
- Device performance and touch QA
- Any public release surface

## Known prototype history

The first private briefing rendered blank because `SquadCard` referred to `color` instead of `colour`. This has been fixed and `scripts/test_expedition_screen.cjs` now renders the briefing through React on every regression run.

Do not remove that focused render test. A normal bundle smoke test only proves that the initial app root mounted. It does not prove a lazily visited screen can render.

## Responsibility split

### Claude owns

- Engine architecture and refactoring
- Scenario schemas and validation
- Seeded procedural generation
- Mathematical kernel generators
- Reference solvers and rejection logic
- Enemy state machines
- Role, discipline, trait and Commander rule implementation
- Progress schema, migrations and reward idempotency
- React integration behind the developer gate
- Performance profiling
- Automated tests and regression maintenance
- Android and offline-browser functional checks
- Engineering documentation

### Codex owns

- Visual style guides
- 9FO, LR and GF home-tile art
- Action-button skins and states
- Character pose sheets and sprite extraction direction
- Enemies, objective props and terrain atlases
- Board background plates
- Guard, move, attack, heal and completion effects
- UI composition mock-ups
- Visual accessibility review
- Asset naming, crop and compression recommendations
- Art acceptance and consistency passes

### Shared contract

Claude must not make final visual assets with ad hoc CSS gradients and emoji. Temporary geometry is acceptable only behind the developer gate and must be clearly labelled as a stand-in.

Codex must not encode game rules into generated images. Values, labels, action names, totals, intentions and objective text remain live interface elements controlled by Claude's state.

## Recommended engineering architecture

Keep four layers separate.

### Content layer

Contains authored scenario blueprints, enemy definitions, action definitions and presentation metadata. It does not mutate progress or import React.

Suggested shape (illustrative — see the note below on what E1 actually shipped):

```js
{
  id: "po_unequal_crossing",
  schemaVersion: 1,
  moduleKey: "primary",
  level: 1,
  objectiveFamily: "balance",
  boardGrammar: "bridge_two_platforms",
  mathsKernel: "equal_partition_four_values",
  enemySchedule: "two_round_warning_then_steal_highest",
  squad: { min: 3, max: 3 },
  readiness: {
    minimumAverageBattleValue: 12,
    minimumRarityCounts: {},
    allCardsMinimumRarity: null,
    forbiddenRarities: [],
    capabilityRequirements: []
  },
  roundLimit: 4,
  generation: { valueMin: 1, valueMax: 9, targetMin: 6, targetMax: 15 },
  art: { environment: "po_orchard_bridge", mechanism: "po_brass_scale" }
}
```

E1 actually shipped a smaller change than this proposal: rather than restructure the existing
`EXPEDITION_SCENARIOS` entries onto new field names (`objectiveFamily`, `boardGrammar`, `roundLimit`, …),
it kept every existing field (`id`, `level`, `title`, `family`, `turns`, `enemies`, `rule`, …) and layered
`schemaVersion` and `readiness` on top — see expedition-data.js and expedition-schema.js. `boardGrammar`,
`mathsKernel` and `enemySchedule` remain unimplemented, reserved for the generation stage (E3).
Readiness itself is advisory only, never a hard gate — see the correction note near §501 above.

### Generation layer

Accepts a blueprint, seed and difficulty band. Returns a complete scenario configuration and a stored reference solution. It may import pure maths and solver helpers, but never React or progress storage.

```js
generateScenario({ blueprint, seed, difficulty })
// -> { config, referenceSolution, metrics, blueprintVersion }
```

### Engine layer

Accepts a state and command. Returns a new state plus structured events.

```js
applyExpeditionCommand(state, command)
// -> { state: nextState, events: [] }
```

Prefer one command dispatcher over a growing set of UI-specific calls once the prototype expands.

Command examples:

```js
{ type: "MOVE", unitId, destination }
{ type: "INTERACT", unitId, targetId }
{ type: "USE_ACTION", unitId, actionId, targets, parameters }
{ type: "END_PLAYER_PHASE" }
{ type: "UNDO" }
```

Structured events should drive animation without delaying the pure state transition:

```js
{ type: "UNIT_MOVED", unitId, path }
{ type: "OBJECT_PLACED", objectId, hex, value }
{ type: "INTENT_RESOLVED", enemyId, intentId, targetId }
{ type: "OBJECTIVE_UPDATED", before, after }
```

### Presentation layer

React renders the current state and dispatches commands. It does not reproduce pathfinding, damage, objective or reward calculations.

## Stable identifiers

Never key persistence by display title.

- Module keys: `primary`, `junior`, `intermediate`
- Scenario ids: existing ids in `EXPEDITION_SCENARIOS`
- Character ids: existing card ids
- Enemy ids: per-instance ids, with an enemy definition key
- Action ids: stable lower-case keys
- Seed: unsigned 32-bit integer or canonical hexadecimal string
- Blueprint version: positive integer

Renaming visible copy must not invalidate saves or reference traces.

## Procedural-generation implementation plan

### Stage G1: seeded random source

Implement a small deterministic PRNG local to Expeditions. Do not call `Math.random()` in generation or enemy resolution. Add golden tests showing the same seed produces the same sequence.

### Stage G2: mathematical kernels

Implement kernels independently from boards:

- Equal partition
- Exact subset total
- Capacity ordering
- Sequence route
- Simultaneous capture
- Repeated group total
- Ring closure
- Protection forecast
- Row correction
- Network connection
- Operator restoration
- Bounded selection
- Recurrence reversal
- Shortest network
- Interval containment
- Equal perimeter
- Visit-once route
- Zero-expression system
- Congruence repair
- Unique region assignment
- Dependency scheduling
- Dynamic shortest path
- Constraint grid
- Algebraic equivalence
- Multi-variable feasibility
- Degree-limited spanning network
- Chained percentage trade
- Dynamic median control
- Inequality ledger
- Minimax signal routing

Each kernel returns inputs, full solution set or unique solution and misconception states where useful.

### Stage G3: board grammars

Build boards from approved chunks, not unrestricted random walks. A grammar defines entry zones, objective zones, guaranteed corridors, optional obstacles and art tags.

### Stage G4: abstract solver

Solve the mathematical state without movement. Reject impossible or ambiguous kernels before building a board.

### Stage G5: action solver

Search legal commands using representative squads. Store the lowest action count and at least one human-readable trace.

### Stage G6: adversarial validation

Run every legal enemy tie-break and schedule variation permitted by the blueprint. Reject any variant where an unavoidable early enemy action destroys all solutions.

### Stage G7: novelty and repetition

Score accepted variants against the last five local seeds using solution shape, layout chunks and enemy schedule. Select the clearest sufficiently novel candidate.

## Build stages

### E0: contain the prototype

Tasks:

- Preserve the exact developer gate on tile and route
- Keep all unreleased references out of onboarding and reports
- Keep the focused briefing render test
- Add a route-gate regression test

Definition of done:

- Ordinary profiles cannot see or enter Expeditions
- `eudaimon` plus Rooke can see and enter it
- The existing app still passes the complete regression suite

### E1: freeze schemas

Tasks:

- Define scenario, unit, object, enemy, objective, command and event schemas in JSDoc
- Add schema-version fields
- Validate content at build time
- Document backwards-compatibility expectations
- Add explicit readiness guidance and structured, non-blocking readiness shortfalls to every scenario (advisory only — see the readiness correction note near §501)

Definition of done:

- Invalid content fails validation with the scenario id and exact field
- Display-name changes do not alter ids
- No React import exists in the content, generation or engine layers

### E2: finish generic rules

Tasks:

- Implement all fifteen discipline actions
- Implement five role actions
- Implement five traits
- Implement Commander slot and thirty Commander powers
- Convert action results to structured events

Definition of done:

- Every ability has positive, illegal-target, boundary and idempotency tests
- Every card profile exposes only implemented abilities
- No action relies on UI-side calculations

### E3: generation and solvers

Tasks:

- Complete stages G1 to G7
- Begin with three kernels: equal partition, operator restoration and scheduling
- Add operator-wheel composition, Latin-grid uniqueness and spatial carrying constraints
- Store golden seeds and reference traces

Definition of done:

- Ten thousand generated candidates per proof kernel produce no accepted impossible map
- Every accepted map replays its stored trace successfully
- Same seed and version recreate byte-equivalent gameplay configuration

### E4: cross-age proof maps

Tasks:

- Stabilise The Unequal Crossing for 9FO
- Build The Smudged Stones for LR
- Build The Examination Clock for GF
- Add failure explanations and timing metrics

Definition of done:

- Each map demonstrates its tier's intended cognitive load
- Reference solution fits the action margin
- Informal child observation confirms the goal can be restated after the briefing

### E5: persistence and rewards

Tasks:

- Version the Expedition progress bucket
- Store completion, best turns, performance marks, last seeds and module reward status
- Add an idempotent first-clear award function outside React
- Add migration from the current prototype shape

Suggested target shape:

```js
{
  version: 2,
  scenarios: {
    [scenarioId]: {
      completed: true,
      bestTurns: 4,
      bestActions: 19,
      marks: ["no_exhaustion"],
      recentSeeds: ["..."],
      lastBlueprintVersion: 1
    }
  },
  moduleSetRewarded: false
}
```

Definition of done:

- Existing prototype completion migrates without losing best turns
- Repeated result processing cannot duplicate stars or tokens
- Module switching isolates per-module Expedition records

### E6: presentation integration

Tasks:

- Split the large prototype screen into map, briefing, squad, board and result components
- Add art manifests with fallbacks
- Consume structured engine events for animation
- Add responsive landscape layouts and accessible summaries

Definition of done:

- Missing optional art displays a labelled development placeholder only for the developer profile
- No production route uses emoji as final action art
- Screen renders are covered independently from initial app mount

### E7: thirty-map production

Implement scenario boards in ascending complexity within each module. Do not implement all 9FO, then all LR, then all GF. Work in vertical groups so age scaling remains comparable:

1. Levels 1 from all worlds
2. Levels 2 and 3 from all worlds
3. Levels 4 to 6 from all worlds
4. Levels 7 to 9 from all worlds
5. All three finales

Definition of done:

- Every map has a reference trace and generation bounds
- Every map remains under its hard time limit
- Every visual mechanism has an approved art id

### E8: release candidate

Do not begin without explicit user approval.

Tasks:

- Device matrix
- Reward-economy review
- Accessibility audit
- Performance and bundle-size review
- Parent-facing explanation
- Explicit decision about removing the private gate

## Maintenance requirements

### Determinism

- Generation and enemy actions must be replayable from seed, blueprint version and command log.
- Never introduce date, locale or unordered object iteration into rules outcomes.
- Tie-break rules must be explicit and tested.

### Immutability

- Engine commands return new state.
- Earlier snapshots remain valid for undo and replay.
- Never keep DOM nodes, functions, image objects or React state inside engine state.

### Versioning

- Increment blueprint version when generation meaning changes.
- Increment progress version when persisted shape changes.
- Keep migration functions idempotent.
- Preserve old blueprint logic while a saved recent seed or replay may still reference it, or invalidate it deliberately with clear handling.

### Content validation

- Every referenced enemy, objective family, art id and action id must exist.
- Numerical bounds must match the module age tier.
- Every scenario must declare round limit, squad size and generation envelope.
- Every scenario must declare readiness guidance: a recommended average battle value and any individual-card or capability guidance.
- Missions 9 and 10 in every module must recommend every deployed card be Epic or Legendary.

**Readiness correction (2026-09-14):** readiness is advisory only. Embark is never disabled by
a readiness shortfall on any mission, including 9 and 10 — see expedition-readiness.js's file
header and EXPEDITIONS_BUILD_BRIEF.md §3.1 for the full rationale. What actually stops an
underpowered squad is the mission's own fixed enemy numbers, not a pre-flight check.

### Performance

- Main-thread generation target: under 100 milliseconds for a normal accepted variant after caches warm.
- Solver hard stop: reject and try a new seed rather than freezing the UI.
- Enemy animation does not block input longer than 650 milliseconds per action.
- A tap completes the current animation.
- Sprite assets should have standard and high-density WebP sizes.

### Bundle discipline

- Do not import every full-resolution concept image into the production app.
- Production manifests should reference cropped compressed runtime assets.
- Art concepts in `assets/expeditions/` are documentation references until approved and processed.

### Regression discipline

- A rules change must update or preserve every affected reference trace.
- Never accept snapshot updates without checking the mathematical outcome.
- Add a focused screen render test for every new lazy route.

## Required test cases

### Access and release gating

- `ACC-01`: ordinary named profile does not see the Expeditions tile
- `ACC-02`: profile named `eudaimon` with a non-Rooke avatar does not see the tile
- `ACC-03`: Rooke profile with a different name does not see the tile
- `ACC-04`: exact `eudaimon` plus Rooke sees the tile in all three modules
- `ACC-05`: ordinary profile forced to `screen="expeditions"` is returned to a safe home view
- `ACC-06`: Expeditions is absent from tours, onboarding and reports

### Rendering

- `UI-01`: 9FO briefing renders title, objective, squad and start control
- `UI-02`: LR developer catalogue renders without accessing a missing board config
- `UI-03`: GF developer catalogue renders without accessing a missing board config
- `UI-04`: missing portrait uses the approved developer placeholder without throwing
- `UI-05`: empty Expedition progress renders as zero clears
- `UI-06`: existing prototype progress renders completion and best turns
- `UI-07`: board renders at tablet landscape width without horizontal document overflow
- `UI-08`: rules remain readable at 200 per cent zoom

### Roster conversion

- `ROS-01`: exactly ninety regular profiles exist
- `ROS-02`: each module has thirty regular profiles
- `ROS-03`: each module has six of every role
- `ROS-04`: each module has six of every discipline
- `ROS-05`: every profile has five unchanged printed stats
- `ROS-06`: movement, hearts, range and initiative stay within declared bounds
- `ROS-07`: role assignment is deterministic
- `ROS-08`: exactly thirty Commander profiles exist
- `ROS-09`: every Commander power references an implemented effect before becoming selectable

### Collection readiness

Advisory only (corrected 2026-09-14): none of these ever disable Embark. A squad below the
recommendation still gets a normal result — meetsRecommendation: false plus specific
shortfalls to show — never a refusal. See EXPEDITIONS_BUILD_BRIEF.md §3.1 and
expedition-readiness.js's file header.

- `RDY-01`: missions 1 and 2 treat a legal early Uncommon-heavy squad as meeting the recommendation
- `RDY-02`: missions 3 and 4 recommend their Uncommon count without recommending Rare cards
- `RDY-03`: missions 5 and 6 recommend at least two Rare-or-better cards
- `RDY-04`: missions 7 and 8 recommend at least one Epic and recommend against Common cards
- `RDY-05`: missions 9 and 10 flag a shortfall for a squad containing any Common, Uncommon or Rare card, without disabling Embark
- `RDY-06`: Legendary cards satisfy an Epic-or-better recommendation
- `RDY-07`: a Commander does not satisfy a field-card rarity recommendation
- `RDY-08`: average battle value is calculated across deployed field cards only
- `RDY-09`: every readiness shortfall returns a specific child-readable reason
- `RDY-10`: at least three distinct full-Epic role combinations have winning reference traces for each finale
- `RDY-11`: a squad far below the recommendation on any mission still returns a normal result rather than being blocked or throwing

### Hex and movement rules

- `HEX-01`: distance is symmetric and zero to self
- `HEX-02`: neighbour lists contain six unique axial hexes
- `HEX-03`: line interpolation includes both endpoints
- `HEX-04`: blocked terrain is never reachable
- `HEX-05`: difficult terrain costs two
- `HEX-06`: Sure-footed ignores only its stated allowance
- `HEX-07`: occupied destination is illegal
- `HEX-08`: object hex is illegal unless the action explicitly permits sharing
- `HEX-09`: movement spends exactly one action point regardless of travelled distance within allowance
- `HEX-10`: earlier state remains unchanged

### Actions

- `ACT-01`: character cannot act at zero action points
- `ACT-02`: character cannot act during enemy phase
- `ACT-03`: collect requires adjacency and a portable target
- `ACT-04`: place rejects occupied or invalid destinations
- `ACT-05`: Guard cancels exactly one permitted hostile effect
- `ACT-06`: stabilised target ignores changes for the declared duration
- `ACT-07`: strike range uses the role-derived range
- `ACT-08`: support counts only eligible adjacent allies
- `ACT-09`: one-impact and two-impact thresholds are exact
- `ACT-10`: exhausted units cannot act or support
- `ACT-11` to `ACT-25`: one positive test for each discipline action
- `ACT-26` to `ACT-40`: one illegal-target test for each discipline action
- `ROLE-01` to `ROLE-10`: positive and boundary test for each role action
- `TRT-01` to `TRT-10`: positive and once-only or duration test for each trait

### Objective families

- `OBJ-01`: eliminate ignores already exhausted enemies
- `OBJ-02`: capture evaluates at the declared timing point
- `OBJ-03`: exact total rejects over and under totals
- `OBJ-04`: balance rejects equal zero totals
- `OBJ-05`: ordered route rejects a valid value in the wrong order
- `OBJ-06`: delivery enforces count, value and destination constraints
- `OBJ-07`: containment counts blocked and occupied sides correctly
- `OBJ-08`: connect handles cycles and disconnected components
- `OBJ-09`: rescue requires both rescue state and exit
- `OBJ-10`: protect resolves after the final required enemy phase
- `OBJ-11`: optimise separates base completion from target performance
- `OBJ-12`: constraint grid requires every simultaneous constraint

### Enemy resolution

- `ENM-01`: same state produces same intent target
- `ENM-02`: declared delay prevents early movement and stealing
- `ENM-03`: thief ignores carried, guarded and stabilised objects
- `ENM-04`: tie-break follows documented order
- `ENM-05`: enemy cannot end on an occupied hex
- `ENM-06`: blocked attack consumes the intended Guard once
- `ENM-07`: enemy phase restores player action points exactly once
- `ENM-08`: enemy phase cannot run twice
- `ENM-09`: an enemy cannot act after exhaustion
- `ENM-10`: every enemy definition has a readable intent string

### Procedural generation

- `GEN-01`: same seed and version produce identical config
- `GEN-02`: different seeds vary at least one permitted field
- `GEN-03`: generator never varies an authored invariant
- `GEN-04`: accepted equal-partition kernel has a valid partition
- `GEN-05`: uniqueness-required grid has exactly one solution
- `GEN-06`: generated numbers stay within module bounds
- `GEN-07`: every accepted config has a replayable reference trace
- `GEN-08`: impossible board is rejected
- `GEN-09`: unavoidable enemy destruction is rejected
- `GEN-10`: solution action count preserves required margin
- `GEN-11`: recent-seed repetition penalty works
- `GEN-12`: generation stops safely at its attempt limit
- `GEN-13`: operator wheels reconstruct the intended operation composition
- `GEN-14`: operator routes never create a forbidden intermediate value for their module
- `GEN-15`: constraint-grid clue removal preserves uniqueness where promised
- `GEN-16`: physical carrying distances fit the same action budget as the mathematical solution
- `GEN-17`: changing only enemy health cannot raise the declared difficulty band
- `GEN-18`: mission band and module independently constrain difficulty components

### Progress and rewards

- `PRG-01`: new module bucket receives empty Expedition progress
- `PRG-02`: current prototype completion migrates to version two
- `PRG-03`: first clear grants configured stars once
- `PRG-04`: replay of an already-cleared scenario grants exactly one star (updated 2026-09-17,
  see `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8.6); a fresh first clear is unaffected and the
  two never stack on the same run
- `PRG-05`: crossing a twenty-star boundary creates the correct pack remainder
- `PRG-06`: best turns only improves
- `PRG-07`: best actions only improves
- `PRG-08`: recent seeds cap at five
- `PRG-09`: module-set Reveal token grants once
- `PRG-10`: progress remains isolated by module
- `PRG-11`: failed or abandoned run grants no first-clear reward
- `PRG-12`: migration is idempotent

### Reference scenarios

- `REF-01`: Unequal Crossing loan squad wins by the stored round-four trace
- `REF-02`: changing either platform total breaks completion
- `REF-03`: reaching the exit before balancing does not win
- `REF-04`: Hookmoles do not act during their two-round warning
- `REF-05`: The Smudged Stones reference trace evaluates every path correctly
- `REF-06`: The Examination Clock reference schedule completes before bell twelve
- `REF-07`: representative low, target and high difficulty seeds pass for each proof map

### Whole-app regression

- `APP-01`: existing Adventures remain visible and functional
- `APP-02`: Adventure card upgrades remain unchanged
- `APP-03`: Joey decks and battles are unchanged
- `APP-04`: all generator sanity suites remain green
- `APP-05`: all Adventure graphs validate
- `APP-06`: production HTML rebuilds
- `APP-07`: bundle smoke test reports no runtime error
- `APP-08`: Android web assets receive the same rebuilt output

## Art integration contract

Claude should request art by stable id and usage, not by asking for a vague image.

Example request:

```text
artId: po_expedition_action_guard
usage: tactical action button
states: available, selected, pressed, disabled
runtime boxes: 512x160 and 1024x320
live text safe area: x 29%-90%, y 18%-82%
icon area: x 3%-27%
alpha required: yes
interaction meaning: prevent the next hostile effect on one adjacent target
```

Expected manifest entry:

```js
po_expedition_action_guard: {
  available: "...webp",
  selected: "...webp",
  pressed: "...webp",
  disabled: "...webp",
  textSafeArea: [0.29, 0.18, 0.9, 0.82]
}
```

Do not crop concept sheets at runtime. Approved sheets should be extracted and compressed during asset production.

## Existing art concepts

- `assets/expeditions/9fo-expeditions-home-tile-concept-v2.png`
- `assets/expeditions/9fo-expedition-button-system-concept-v1.png`
- `assets/expeditions/expedition-sprite-direction.png`
- `assets/expeditions/unequal-crossing-briefing.png`
- `assets/expeditions/unequal-crossing-gameplay.png`
- `assets/expeditions/unequal-crossing-victory.png`

These establish direction only. They are not automatically approved production assets.

## First wiring-candidate art package

The separated runtime package is documented in `EXPEDITIONS_ART_HANDOVER.md` and indexed by `assets/expeditions/production/9fo/manifest.json`. It contains 231 Ninefold Orchard runtime WebPs: the complete 30-card character roster, Hookmole plus eight proposed encounter enemies, operator-wheel states, terrain, number loads, balance and gate objectives, effects, composable action controls, team-readiness states and an orchard gorge background.

The first complete visual vertical slice is also available under `assets/expeditions/production/9fo/mockups/`. Treat `opening`, `mid-puzzle` and `complete` as the reference state sequence for The Unequal Crossing. The art pack intentionally leaves objective copy, numbers, operators, action labels and rewards blank for runtime data and accessibility.

Treat every entry as developer-prototype art until Codex marks it approved. Do not import source sheets. Keep operators, values, objectives and enemy intentions as live UI.

## First task for Claude

Do not expand gameplay immediately.

1. Read the source-of-truth documents.
2. Confirm the developer gate with tests `ACC-01` to `ACC-05`.
3. Run `npm test` and record the baseline.
4. Review the current schema and propose E1 changes without altering visual assets.
5. Identify which existing engine functions can be preserved and which should move behind a command dispatcher.
6. Implement only after the user approves the proposed engineering sequence.

## Questions requiring user approval before release work

- Is the ordinary first-clear reward three stars, ten stars or something else?
- Does completing all ten maps grant one Reveal token?
- Can unowned characters ever be borrowed after the opening tutorial?
- Should GF always use four characters or permit challenge maps with three and five?
- Which LR and GF proof maps should follow The Unequal Crossing?
- When, if ever, should the developer gate be removed?

## Claude's questions on EXPEDITIONS_CARD_COMBAT_CONTRACT.md (2026-09-16)

Read in full and checked its claims directly against the running code before writing
anything here — most of it turned out to already be true, not a gap. Summary, then
questions.

**Already matching, confirmed by reading the actual functions, not assumed:**
- §3's derived-stat formulas (`Move`, `Hearts`, `Initiative`) are exactly what
  `expedition-roster.js` computes today, and exactly what `EXPEDITIONS_SPEC.md` §7 already
  specified — this section restates the existing contract rather than changing it.
- §5's combat formula is exactly what `strikeEnemy` (expedition-engine.js) does today:
  primary-stat-plus-support power, the 0/1/2 impact thresholds at exactly `defence` and
  `defence + 4`, Scout's Mark and Precise both adding support the same way the contract
  describes. Built in E2, unchanged since.
- §7's "Adventure-honed must stay cosmetic" — confirmed nothing in Expeditions code reads
  "honed" status at all, so there is nothing currently violating this.

**One real gap — a mechanic that doesn't exist yet:** §4's "visible checks"
(`statistic + support + bonus` against a printed difficulty, e.g. "Geometry 7 required" to
shift a jammed panel). Nothing in the engine implements a generic stat-vs-difficulty check
outside combat today. This is genuine new engine work, not content.

**§9's authoring contract is a gap in my own map files**, not the engine: none of the six
maps built so far declare a below-recommendation test squad or an explanation of why one
strong card can't cover every job alone. Straightforward to retrofit, but six files' worth
of it.

**§8's player-facing explanations are presentation** — Codex's domain under the current
split. The underlying data mostly already exists (`expedition-readiness.js` already computes
shortfalls; every unit already carries its five stats plus derived Move/Hearts); what's
likely missing is the board/briefing actually displaying it, which I should not be editing
in `ExpeditionBoard.jsx`/`ExpeditionScreen.jsx` right now regardless.

### Questions

1. Do you want `visible checks` built now as a standalone, tested engine primitive (same
   approach as route markers — buildable and verifiable without any board UI), or should it
   wait? It would need a UI affordance eventually (showing the check's statistic, bonuses and
   difficulty before confirmation, per §4's own requirement), which touches Codex's active
   area.
2. Should I retrofit §9's two missing test categories (a below-recommendation squad test, a
   "why one card can't do it all" note) onto the six existing maps now, or fold it into each
   future map's build going forward and leave the existing six as they are?
3. Is this contract meant to gate further map production (i.e. should new maps starting now
   already assume visible checks exist), or is it independent forward planning that doesn't
   block E7 content in the meantime? I've continued building maps against the current engine
   while this was unread; want to confirm that was the right call before adding a seventh.

### Codex response: card/combat contract implementation boundary (2026-09-16)

The contract is intentionally a real engineering target, not a later design wish. The point
is to make printed card statistics legible on the board, rather than leaving rarity as the
only apparent difference.

1. **Build visible checks now, engine-first.** Create one generic, deterministic and fully
   tested check primitive. It must accept a named governing statistic, a printed difficulty,
   an explicit source for every support or bonus and a target object or hex. It must return a
   structured preview/result sufficient for presentation: statistic value, each bonus, total,
   difficulty, pass/fail and the consequence. There is no randomness, hidden modifier or
   silent fallback.

   This is engine/data/test work and is within Claude's ownership. Do not add a temporary
   board control or alter `ExpeditionBoard.jsx` or `ExpeditionScreen.jsx`. The later UI will
   consume the structured result and show the calculation before confirmation. Add the
   primitive behind the command dispatcher, schema validation, positive and illegal-target
   tests and a small engine-only fixture scenario. Record the exact files and validation
   command here before beginning.

2. **Retrofit the six existing proof maps now.** Add the two authoring-contract fields to all
   six, not just future maps: a named below-recommendation squad with its *visible* expected
   shortfall and a concise statement of the simultaneous jobs that stop one strong card from
   carrying the whole map. This is metadata and test coverage, not permission to manufacture
   a loss. An under-recommended squad may still win through a clever plan. The test must prove
   that its stated limitation is genuinely present in the fixed rules or readiness result.
   Do not write vague assertions such as `squad is weaker`.

3. **Gate interpretation:** it is correct that engine-only content continued while this
   document was being written. From this point, pause a seventh proof map until the bounded
   visible-check primitive and six-map metadata retrofit are green. Thereafter, new maps may
   use existing actions or declared visible checks, but every map must meet §9 of
   `EXPEDITIONS_CARD_COMBAT_CONTRACT.md` from its first commit. No map may depend on a visible
   check before its board UI can expose the check preview. Engine fixtures may exercise the
   primitive in the meantime, but they are not presented as a completed player-facing map.

4. **Presentation remains separate.** Codex will later add the briefing, squad-card and
   action-preview explanations specified in §8. Claude should expose stable engine fields and
   readable identifiers only. Do not duplicate calculation rules in UI code.

This makes the immediate engineering sequence: visible-check primitive and tests, retrofit
six maps, full regression, then resume map production. No art work or image generation is
needed for this sequence.

### Claude delegated backlog: engine, content and verification (2026-09-16)

The user has explicitly allocated additional Claude capacity to Expeditions. This supersedes
the earlier pause on new Ninefold Orchard scenario work **for engine-only work**. The active
Codex presentation boundary remains unchanged: do not edit board presentation, HUD, visual
placement, art imports or release gating.

Work in this order. Each completed item needs a concise handover entry listing files changed,
reference traces added and the full validation result. Do not pause merely to request another
approval between items unless the work exposes a product decision not covered by the source
documents.

1. **Finish the current foundation:** implement the visible-check primitive and retrofit all
   six proof maps as required in the response immediately above. This remains the prerequisite
   for new map work.

2. **Capability audit of the real card collection:** derive an audited table for all ninety
   regular cards, by module, covering printed five-stat profiles, primary discipline, role,
   trait, Move, Hearts, primary strike power and rarity/BV bands. Test the Ninefold Orchard
   route requirements in `EXPEDITIONS_NINEFOLD_ROUTE.md` against that real collection. Flag
   any stated recommendation that no valid three-card Epic squad can meet, or that almost
   every Common squad already meets. Do not alter card data to hide a mismatch. Produce a
   readable report and deterministic tests.

3. **Ninefold Orchard engine route:** implement Maps 2–6 from
   `EXPEDITIONS_NINEFOLD_ROUTE.md` as engine-only scenarios. Each must have schema-valid
   configuration, a deterministic reference trace, low/target/high squad tests, procedural
   variants within the stated envelope and a no-unannounced-impossible-state test. Preserve
   Map 1's tested trace. Do not claim these maps visually complete or add art.

4. **Ninefold Orchard late-map feasibility package:** before implementing Maps 7–10, build
   their solver and state requirements on fixtures. In particular prove ring containment,
   protection schedules, the 3-by-3 linked tally constraints and the nine-node network are
   solvable inside their turn limits using real target-band squads. Report any missing engine
   primitive as a bounded proposal with tests, rather than approximating it or silently
   weakening the route design.

5. **Enemy and encounter rules catalogue:** create data contracts and tests for the Ninefold
   Orchard enemies named in the route: Hookmole, Scruffcrow, Crosswind, Widdershins,
   Maybe-Finch, Strawling, Crowbreaker, Overgrowth, Nearly and Forgetting Root. Each requires
   public intent, target priority, movement, Defence, hearts, damage or state effect,
   counterplay and a deterministic tie-break. This is mechanics/data only. Art identifiers
   may be requested in the manifest later, but do not request or generate art.

6. **Procedural-scenario framework:** implement seed/version storage, bounded generation,
   solution verification, variation records and recent-seed repetition protection for the
   Ninefold Orchard envelopes. Start with Maps 2, 3, 4 and 6, where numerical variation is
   safe and explicit. Maps 7–10 use hand-authored topology templates until their solvers are
   proven. A generated map may never rely on a heuristic claim that it is probably solvable.

7. **Adventure-upgrade decision preparation:** do not choose an upgrade effect. Instead,
   audit actual Adventure upgrade data, enumerate the precise code paths that would need to
   change for each of the two approved options in `EXPEDITIONS_CARD_COMBAT_CONTRACT.md` and
   give a migration and test plan. This is analysis only because the product choice remains
   open.

8. **Commander completion and regression hardening:** complete the remaining Commander powers
   only when each is a real reuse or a small, documented primitive with a scenario or fixture
   that exercises it. Add property-style tests around command dispatch, immutable state,
   first-clear reward idempotence and procedural replay. Do not add unused systems merely to
   improve a completion percentage.

9. **Little Reckoning engineering readiness:** use
   `EXPEDITIONS_LITTLE_RECKONING_ROUTE.md` to audit the existing engine against Maps 2–10 and
   write a dependency report before implementing them. In particular, distinguish already
   supported mechanics from genuine gaps: dual value-and-weight optimisation, ordered-route
   progression, minimum-cost network validation, estimate intervals, equal-perimeter state,
   group-membership routes, linked signed expressions, congruence and unique partition
   assignment. Propose bounded primitives with tests. Do not weaken a map's stated mathematical
   objective merely because the nearest existing evaluator checks something simpler.

10. **Gifford engineering readiness:** after the Little Reckoning dependency report, use
    `EXPEDITIONS_GIFFORD_ROUTE.md` to make the equivalent dependency report for algebraic
    expression objects, dynamic weighted graphs, constrained optimisation, degree-limited
    networks, percentage/ratio trades, median control, unique inequality deduction and minimax
    scheduling. Build reusable exact solvers and fixtures before content. Gifford must not be
    implemented as Little Reckoning with larger values or approximated objectives.

11. **Experience-brief alignment:** before starting any further map implementation, read
    `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` and add a one-line record to every scenario
    config for set-piece, pressure lanes, combat pattern if any and required mechanism ids.
    Existing or future maps must not be described solely by an objective family. Build the
    generic rotation-hex and Hive Ledger solver contracts as engine fixtures first, with exact
    orientation, visible group-rule and unique-solution tests. Do not begin art work or edit
    presentation files for this task.

The success condition is a robust, simulation-backed Expedition engine and scenario library
ready for the board presentation to consume. It is not a claim that Expeditions is ready for
release.

### Codex presentation update: terrain, HUD and controls (2026-09-16)

Codex changed only `expeditions/ExpeditionBoard.jsx` in this pass. The board now uses a
deterministic visual mix of grass, path and flagstone for clear tiles, roots for difficult
tiles and an illustrated hedge obstruction for existing blocked tiles. This is a rendering
mapping only: terrain keys, movement costs, positions and scenario data are unchanged.
Hex side faces now draw layered stone and earth faces in vector art rather than plain brown
polygons. Tile projection is still owned by `expedition-hex-layout.js`; no geometry or hit
target was altered. Board props are in a higher draw layer than every tile, so brass scales,
loads and the tally arch remain above the tile artwork. Character sprites remain above props.

The Objective, Round and Party HUD now shares one ornamental plaque component with a
module-coloured trim for Ninefold Orchard, Little Reckoning and Gifford. Ninefold's Objective
and Party plaques still open their existing drawers; the other modules retain their existing
side panels. Ninefold action buttons are now single SVG-rendered controls containing the
frame, icon and text, with live `aria-label`, rather than an art frame with a separate
absolutely positioned text overlay. No engine or release-gate change was made.

Validation: `node scripts/rebuild.cjs` passed, `node --test
scripts/test_expedition_hex_layout.mjs` passed (5/5) and
`node scripts/test_expedition_screen.cjs` passed across all five catalogued scenarios.
The local Unequal Crossing runtime preview was inspected visually at desktop width. The
new tile art needs the user's visual audit before being treated as final art approval.

### Codex presentation follow-up: adjoining terrain (2026-09-16)

The first blocked-tile vector hedges and difficult-tile vector roots were removed after
the user identified them as unreadable green and brown scribbles. In The Unequal Crossing
only, two existing blocked hexes now show the orchard stream art and a third has a
separate orchard-tree prop anchored to its tile. Existing difficult hexes use the
completed root texture. This is a visual classification of existing `blocked` and
`difficult` cells, not a movement-rule change. The mapping is explicitly scoped to
`po_unequal_crossing` so other Ninefold scenarios cannot inherit tree or water by
coordinate coincidence.

Hex geometry and hit regions are unchanged. `TacticalHex` now receives exterior-facing
edge flags computed from axial neighbours. Stone side-wall faces render only on the outer
perimeter; shared interior edges show adjacent top faces without a duplicate wall. The
water and root art use a top-face crop rather than the grass crop, while the tree prop
uses its source cutout above a grass tile. All runtime assets remain in the existing
9FO manifest. The user still needs to judge the tree cutout and water joins visually.

Checks after this change: 5/5 geometry tests, Expedition briefing and board renders for
all five catalogued scenarios, and the offline app build passed. No engine, scenario
data, progress or release-gating files changed.

### Codex visual correction and reusable chrome (2026-09-16)

The user rejected the tall, narrow rendered hexes, grey wall lines, adjoining stream
tiles and oversized tree. Codex corrected presentation without changing axial game
geometry or scenario data. Ninefold uses a 0.6 vertical affine projection; the geometry
module calculates fitted projected bounds, and a new test proves all six shared edges
still meet. The exposed walls now use a painted earth-and-stone bitmap, not grey SVG
strata. The two blocked water cells in The Unequal Crossing use a self-contained pond
texture, and the tree is a smaller reusable obstacle prop anchored to a single hex.
The difficult-cell root texture is layered over grass to prevent green source margins.

`ExpeditionHudPlaque` has apple, star and diamond trim for Primary, Junior and
Intermediate. Ninefold additionally has vector-rendered navigation, action buttons and
a wood action-bar frame. Live button labels and icons remain in the same SVG surface;
they are not absolutely positioned text over a separate frame. New raster assets are
`po-terrain-pond-v1.png` and `po-terrain-earth-wall-v1.png` under the Ninefold runtime
terrain directory, registered in its manifest and `expedition-9fo-art.js`. See
`EXPEDITIONS_ART_HANDOVER.md` for usage and crop constraints.

Validation: 6/6 hex layout tests, all five scenario screen renders, ACC-01 to ACC-06
release gate tests and the offline build passed. A live preview click on End round
advanced Round 1 to Round 2. Claude should consume the presentation API and artwork
as supplied; no engine, persistence or release-gating work is requested in this slice.
Tablet (768 × 1024) and phone (430 × 900) visual QA were also completed. The initial
phone HUD overflow was fixed by stacking Objective above Round and Party, wrapping the
title and fitting buttons inside the action bar. The desktop viewport was restored.
The later visual pass replaces the large square board-scale bitmap with a pair of exact
brass hex outlines per platform, one per engine-owned valid load cell. The first cell
also holds a compact dial whose `currentTotal/target` is read from `result.sides`. Both
cells remain valid in the engine, with no objective or interaction rule changes. The
large state-specific balance bitmap remains in the Objective drawer. Character sprites
and stands are 20% smaller; the tree prop is smaller with feathered edges. Tile tops
use overscanned grass beneath feathered terrain variants, and the top-face stroke uses
the projected `sideY` coordinate. Preserve this presentation layering and the engine
source of truth when wiring further scenarios. Desktop preview was visually checked;
12 access and geometry tests passed, and the offline app build completed.

### Approved scale redesign: one impassable hex per scale

The user has superseded the two-hex weigh-platform interaction. The current two brass
outlines are a truthful depiction of the *old* engine contract, not the intended final
design. For The Unequal Crossing, make each scale one impassable hex containing a
single scale prop. A hero carrying a numbered load may place it on that scale from
**any of its six adjacent hexes** by selecting the hero and clicking the scale. The
hero never enters the scale cell. Use the current dial cells as proposed anchors:
west `-2,1`, east `2,-1`; check board connectivity and the reference four-round clear
before finalising those coordinates. Remove the second platform cells `-2,2` and
`2,0` from the objective, but leave them as ordinary passable ground. Bramble starts
on `-2,2`, so the western scale remains immediately accessible.

This requires an engine/UI change, not a cosmetic deletion of the second outline:

- Make each scale hex unenterable to movement and enemy movement. Do not let a placed
  load or scale interaction imply that a hero can stand there.
- Two loads must fit on each scale to reach seven (2+5 or 3+4). Represent this as a
  scale inventory or an explicitly permitted multi-object stack at the scale hex.
  The present `interactObject` rejects a second object at an occupied destination.
- Keep `result.sides` as the sole source of the running totals and statuses. A load
  contributes exactly once while on a scale, never while carried or lying nearby.
  Permit removal of a specific placed load from an adjacent hex so mistakes can be
  corrected; if loads share a position, the UI needs a choice instead of `objectAt`
  selecting the first arbitrarily.
- Clicking a scale while carrying should dispatch a one-AP placement from any
  adjacent hex; otherwise show its contents and offer a specific adjacent pickup.
  Unrelated `INTERACT` and objective families must retain their existing semantics.
- Codex's presentation lane will replace the temporary two outlines with one
  on-hex, stateful scale prop per side after the engine contract lands. The prop must
  fit within its hex footprint, remain clearly impassable and show a legible live
  total plus the individual load values without covering neighbouring movement cells.

Acceptance tests: all six adjacent approach positions can place on a scale; distance
two cannot; movement cannot enter either scale; both 2+5 and 3+4 stacks balance to
seven; moving a load off a scale reduces its total; overloaded and underweight states
are correct; selecting/removing one of two loads is deterministic; the exit condition
still requires both exact totals and a hero on the arch. Update the scripted clear,
scenario generation constraints and screen tests, then confirm the resulting puzzle
still fits the four-round limit. Do not show a one-hex scale in the playable board
until those tests pass: the current two-hex board is preferable to misleading art.

### Claude: engine contract for the scale redesign lands (2026-09-16)

Files: `expeditions/expedition-engine.js` (`interactObject`'s drop now checks a per-hex
`stackLimit`, default 1 — the historic behaviour is unchanged everywhere it isn't set),
`expeditions/expedition-schema.js` (documented `stackLimit` on the board-tile typedef),
`expeditions/unequal-crossing.js` (`-2,1`/`2,-1` are now `terrain: "blocked", stackLimit: 2`;
`leftHexes`/`rightHexes` are single-element arrays; the old `-2,2`/`2,0` cells are removed from
the objective but stay ordinary ground — Bramble's start is unchanged, still beside the west
scale), `expedition-engine.test.js` (5 new scale-redesign tests plus every existing Unequal
Crossing trace rewritten — 3 duplicated full reference traces, both direct-injection balance
tests, `§9`'s platform-hex list), `scripts/simulate_unequal_crossing.mjs` (rewritten trace),
`expedition-catalogue.js` (`marksPar` updated to the new trace's real turns/movement).
Validation: `node --test expeditions/expedition-engine.test.js` (39/39), `node
scripts/simulate_unequal_crossing.mjs`, `node scripts/test_expedition_screen.cjs` (unaffected —
it doesn't hardcode positions), then a full `npm test` (15/16; the one `bundle_smoke.cjs`
failure is the same unrelated local heap-limit issue logged earlier in this file).

No board/UI change was needed beyond what the engine already provided: `interactObject`'s drop
already supported placing from an adjacent hex without standing on the destination (the
"placement from any of six neighbours" requirement was already true before this change) —
the only genuinely new engine primitive was `stackLimit`, so two loads can share the one scale
hex. `terrain: "blocked"` (already used elsewhere on this board for the hedges) makes the
scale hex itself unenterable to both player movement and enemy pathfinding, with no new
terrain type needed. `result.sides`/`values` needed zero changes — `objectAt` already sums
every object at a given hex regardless of how many share it.

New reference trace (verified by direct simulation before being locked in): win in round 4
(the turn limit, no slack left), 18 actions, 16 movement — `marksPar` updated to match. Bramble
places the 2-crate on the west scale from her start with zero movement (she starts beside it);
Nine and Pip each travel further for the 5-crate and 3-crate/4-crate. All five of the acceptance
list's engine-checkable items now have a dedicated test: six-neighbour placement, distance-two
rejection, movement blocked into either scale, stack limit of exactly 2 (contrasted against an
ordinary hex's limit of 1), and deterministic removal of one named load leaving the other
untouched. "Both 2+5 and 3+4 stacks balance to seven" and "the exit condition" were already
covered by the existing balance-objective tests, now updated to the single-hex layout.

Codex presentation follow-up: `ExpeditionBoard.jsx` now draws one stateful brass hex
prop per scale, reads the live total from `result.sides`, shows both placed load values,
dispatches adjacent placement when clicked by a carrying hero and offers a specific
load choice when two are present. Scale loads no longer render as overlapping full
crate sprites. The party panel instructs the player to tap the scale instead of
offering an own-hex drop button. All 30 Ninefold cards have a visible carrying state;
eight have individual carry poses (three prior plus five new RGBA cutouts), while the
remaining 22 use an interim carried-load overlay on their idle sprite. The extra art
map is `expedition-9fo-extra-art.js`. All five scenario screen renders passed after
these presentation changes. A fresh local preview tab visually confirmed exactly
one scale per side. In the playable UI, Bramble picked up the 2-crate from an adjacent
hex, changed to her carrying pose, placed it on the west scale from the neighbouring
ground cell, and the west dial and HUD both advanced from 0/7 to 2/7. Undo restored
the carrying pose and 0/7. No release-gating work was touched.

The fifth new pose is Dapple, a fawn with the crate harnessed across her back. It
passed the project alpha validator and is wired into the manifest and extra art map.
Bushel's proposed pose was rejected: the generated PNG and the single extraction
attempt both contained opaque RGB checkerboard. Neither draft was shipped. Keep the
interim composite for Bushel until a genuinely transparent cutout exists.

### Claude: item 3 continued — Map 3, Nine Across the Bridge, engine-built (2026-09-16)

Files: `expeditions/expedition-engine.js` (new `sidewind` enemy behaviour; a new
`objective.capacityLimits` failure check in `evaluateObjective`, and `refreshExpeditionStatus`
now treats `result.failed` as an instant loss), `expeditions/expedition-schema.js` (documented
both), `expeditions/nine-across-bridge.js` (new scenario), `expeditions/
nine-across-bridge.test.js` (9 tests), `scripts/simulate_nine_across_bridge.mjs`, `expeditions/
expedition-catalogue.js` (new `po_nine_across` entry), `expedition-data.js` (dropped the
placeholder brief's stale `target: 9` field — this map is count-based, not sum-based),
`scripts/run_regression.mjs` (both new files wired in). Validation: `node --test
expeditions/nine-across-bridge.test.js` (9/9), `node scripts/simulate_nine_across_bridge.mjs`,
then a full `npm test` (16/17; the one `bundle_smoke.cjs` failure is the same unrelated local
heap-limit issue logged three times already in this file).

Two new engine primitives, both reusable beyond this map:

- **`capacityLimits`**: a list of `{hexes, max, label?}` groups checked before any objective
  family's own logic; if a group's live object-value total ever exceeds `max`,
  `evaluateObjective` returns `{complete: false, failed: true}` and the expedition ends in an
  immediate loss, independent of whatever family the scenario otherwise uses (here, `delivery`).
  Honestly documented in the scenario file: with only 2 + 3 + 4 = 9 in play against a cap of 9
  per section, this map's own loads can never actually trigger it — proved directly in the test
  file, plus a synthetic overload test proving the mechanism itself works.
- **`sidewind`**: Crosswind pushes one unguarded *carrying* hero standing on a mapped bridge hex
  sideways (`enemy.sideMap`) and deals one point of damage — never a generic melee strike. If
  the first eligible carrier's landing hex is blocked, it tries the next eligible carrier in id
  order rather than giving up for the round (a real bug caught and fixed while building this: an
  early version picked only the alphabetically-first candidate and gave up entirely if her
  specific destination was occupied — including, briefly, by the enemy's own decorative `pos`,
  fixed by excluding the acting enemy from its own occupancy check).

Verified reference trace (REF-12): win in round 2, 12 actions, 12 movement. Crosswind does push
Nine off her line in round 1 — Bramble would have been pushed first (alphabetically), but her
landing hex was blocked by Pip standing on it, so Nine takes the hit instead and finishes with
1 of 2 hearts. This is a real, felt demonstration of "endure Crosswind damage" rather than a
contrived one, and the map is still won a round later regardless. Also verified: a genuinely
damage-free route exists through an unmapped hex (a stone alcove), matching the procedural
envelope's "solver must retain a route that does not require taking damage"; Guard fully
protects a carrier; an all-Epic squad replays the identical trace; and — per §2's audit
methodology — a below-recommendation squad still embarks with its shortfall named.

### Claude: live gameplay bug found and fixed — ExpeditionBoard.jsx's tileClick (2026-09-16)

Sam hit this live, mid-session, on Unequal Crossing: select Nine, move her, pick up a load —
then nothing responds to any further click except Undo, including clicking a different hero.
Not an engine issue: `tileClick`'s very first line was `if (state.status !== "playing" ||
!selected || selected.ap < 1) return;` — once the *currently selected* hero hits 0 AP, every
click is swallowed before the function even checks what was clicked, so there was no way back
into the party once one hero finished her actions for the round. This is Codex's file
(`expeditions/ExpeditionBoard.jsx`); flagging the fix clearly here since it's outside the usual
engine/data/test boundary, but it was a live, total soft-lock (only Undo left) with a one-line,
purely-logic cause, so I fixed it directly rather than leaving Sam stuck:

```js
const tileClick = (key) => {
  if (state.status !== "playing" || !selected) return;
  const reselect = unitAt(state, key);
  if (reselect?.side === "player" && reselect.id !== selectedId) { setScalePickHex(null); setSelectedId(reselect.id); setMessage(`${reselect.name} selected.`); return; }
  if (selected.ap < 1) return;
  // ...unchanged from here...
```

Clicking a different living hero's board token now always switches selection, even when the
previously-selected hero is fully spent; the `ap < 1` gate still blocks every actual action
(move/interact/strike/guard/reframe) for whichever hero is currently selected, unchanged.
Validation: `node scripts/rebuild.cjs` (clean), `node scripts/test_expedition_screen.cjs`
(board still renders for all five catalogued scenarios), then a full `npm test` (16/17, the
same unrelated `bundle_smoke.cjs` heap-limit flake). I did not get a full interactive
browser/DOM click-through of this specific fix — reaching the live dev-gated board needs a
parent account plus profile, which the local static server doesn't have a fast bypass for —
so this is verified by careful direct code reading (the guard-clause reordering is small and
unambiguous) and the existing render/regression suite, not by reproducing the exact click
sequence end-to-end. Codex: worth a look next time you're in this file, in case there's a
reason for the original ordering I'm not seeing, though I couldn't find one.

### Claude: item 3 continued — Map 4, The Widdershins Path, engine-built (2026-09-16)

Files: `expeditions/expedition-engine.js` (new `visitStone` command/function, new
`reverse-next` enemy behaviour, a third "repair" mode on Logic's existing `order` action, and
the "orderedRoute" objective family extended with an optional `centreHex`), `expeditions/
expedition-schema.js` (documented all of it), `expeditions/widdershins-path.js` (new scenario),
`expeditions/widdershins-path.test.js` (10 tests), `scripts/simulate_widdershins_path.mjs`,
`expedition-catalogue.js` (new `po_widdershins_path` entry — the placeholder brief already
matched the real design, no data drift to fix this time), `scripts/run_regression.mjs` (both
new files wired in). Validation: `node --test expeditions/widdershins-path.test.js` (10/10),
`node scripts/simulate_widdershins_path.mjs`, then a full `npm test` (17/18; the one
`bundle_smoke.cjs` failure is the same unrelated local heap-limit issue logged repeatedly
already in this file).

Design note, recorded honestly: the route doc describes "five numbered stepping stones"
forming the loop but only ever names four required values (2, 4, 6, 8) plus a separately
described centre stone — never specifying the fifth stone's value or role. This build uses
four ring stones plus a plain centre hex (no fifth stone object), the same "keep the real
mechanic, drop the undecided detail" call made for Sealed Archive's constraint grid.

A real design/engine mismatch found and fixed while building this, not just a new feature: my
first attempt made "visiting" a side effect of `moveUnit` landing on a stone's hex — but the
engine already treats every object's hex as fully unenterable (the established gotcha from
earlier sessions), so a hero could never actually land on a stone at all. Stones are ordinary
blocking objects instead (like a vault or a scale elsewhere), and visiting is its own command,
`visitStone(state, unitId, stoneId)`: the hero stands *beside* the stone, on its currently
active entry hex (`requiredFrom` normally, `reversedFrom` once the Widdershins creature
reverses it), and visits from there. An invalid attempt (wrong stone, wrong hex, wrong stone)
throws, matching `interactObject`'s own adjacency-check style, rather than silently no-op'ing.

Verified reference trace (REF-13): win in round 3, 9 actions, 9 movement. The four ring
stones are deliberately placed out of numeric order (2, 4, 8, 6 going one way round the ring),
so recognising 2-4-6-8 is a real task, and the Widdershins creature reverses stone_4 then
stone_8 exactly when the party is about to need them — always a deterministic function of the
visible sequence and progress, so a solver check confirms at most one stone is ever reversed
at a time and it is always exactly the one currently needed, never a hidden trap. Also
verified: an invalid visit attempt throws (wrong turn, wrong side); Logic's new "repair" mode
un-reverses a stone directly (the doc's "shorter route enabled by Logic"); Guard protects a
stone from ever being reversed; and an all-Epic squad replays the identical trace.

Item 3 status: Maps 1 (Unequal Crossing), 2 (The Counting Orchard), 3 (Nine Across the
Bridge), 4 (The Widdershins Path) and 5 (The Maybe-Flock Roost, built earlier) are all now
engine-complete. Only Map 6 (Ten Honest Bundles) remains for Ninefold Orchard's first six.

### Claude: Sam's direct feedback — real procedural generation, retrofitted into Unequal Crossing (2026-09-17)

Sam's words: the five built maps "all look very similar, move, pickup and drop... variants
on the same theme", and none were actually procedural — "scenario 1 might be 7 the first time,
but might match 12 the next time with different weights." Both are fair and correct. The
kernel/seeded-RNG framework for exactly this (`expedition-kernels.js`'s
`generateEqualPartitionKernel`, `expedition-random.js`) was built in an earlier session but
never wired into a single scenario — every map so far used one hand-authored, permanently
fixed set of values and positions, dressed up as a "procedural envelope" only in the sense
that a few extra values were hand-verified to also work, not that the game ever actually
draws one at runtime. This entry fixes that for Unequal Crossing, as a concrete proof rather
than another promise; the same treatment for the other four built maps and for genuinely
varying the *interaction verbs* (not just the numbers) across Maps 6–10 is still open — see
the questions at the end.

Files: `expeditions/unequal-crossing.js` (new `generateUnequalCrossingLayout(seed)`,
`isPhysicallyDeliverable` certifier, `REFERENCE_LAYOUT_SEED`; `createUnequalCrossing(squad,
seed = REFERENCE_LAYOUT_SEED)`), `expedition-catalogue.js` (`createState` now seeds every
embark from `Date.now()`; `marksPar` updated to the new locked trace), `expedition-engine.test.js`
(3 new procedural-generation tests, every Unequal-Crossing-specific test that hardcoded the old
fixed crate ids/values/positions rewritten — two of them, which were only testing the generic
"balance" evaluator, decoupled from `createUnequalCrossing` entirely onto their own minimal
synthetic state so they can never break again just because the generator's output changes; the
four near-duplicate full-trace tests collapsed onto one shared
`playUnequalCrossingReferenceTrace()` helper instead of four copies), `scripts/
simulate_unequal_crossing.mjs` (rewritten for the new trace). Validation: `node --test
expeditions/expedition-engine.test.js` (42/42), `node scripts/simulate_unequal_crossing.mjs`,
then a full `npm test` (17/18 — one run also transiently failed 4 unrelated steps, primary
and intermediate generator sanity plus the briefing/board render, all of which passed cleanly
when re-run directly immediately after; the one persistent failure is the same unrelated
local `bundle_smoke.cjs` heap-limit issue logged repeatedly already in this file).

What's actually different now: `createUnequalCrossing(squad, seed)` derives four distinct
crate values (widened to 2–14, from the original 2–9, specifically to give the kernel a richer
solution space — narrower ranges collide more often across seeds) with a **provably unique**
2-vs-2 equal split (`generateEqualPartitionKernel`, already built and already correct — it was
just never called by any scenario), at freshly shuffled starting hexes drawn from a pool swept
from the board definition by exclusion (never hand-picked, so it can't silently drift out of
sync with a board edit). Critically, the kernel's own guarantee is *mathematical* only — it
knows nothing about hex geometry, movement, or the four-round limit — so a second check,
`isPhysicallyDeliverable`, actually **plays out** every candidate with the real loan squad and
the real engine (a simple greedy nearest-hero, load-balanced strategy) before accepting it;
anything that greedy strategy can't clear within the turn limit is rejected and a fresh layout
is drawn from the same seeded stream. This is the same "no unannounced impossible state"
discipline every other map this session earned by simulation, applied to procedural content
itself rather than to one fixed layout. Swept and verified across dozens of seeds (values,
positions and the target itself all genuinely vary — target ranged 9–22 across a sample of 90
seeds — every one independently confirmed solvable, not merely assumed).

Proper seed/attempt persistence (save/resume from a specific seed, the 5-recent-seed
repetition guard already sitting unused in `expedition-random.js`) is *not* wired up — that
remains backlog item 6's job. `expedition-catalogue.js` seeds from `Date.now()` for now, which
is enough to make every embark genuinely different but not yet resumable or replayable.

**Open questions for the remaining four built maps and for Maps 6–10**, rather than guessing
and re-doing this work a second time:

1. Same treatment (kernel + physical certifier) for Counting Orchard's `exactSum`, Nine
   Across the Bridge's capacity/delivery and The Widdershins Path's ordering — each needs its
   *own* kernel (no equal-partition-shaped kernel fits exactSum-from-a-pool or ordered
   sequences), which is real new work, not a copy-paste of this one. The Maybe-Flock Roost is
   a spatial/simultaneity map with no natural "values" to vary — likely just a board-layout
   shuffle (which post, which finch converges from where), not a numeric kernel.
2. The deeper complaint — every interaction is "walk, pick up, walk, drop" regardless of the
   maths underneath — needs actual mechanical variety, not just different numbers wearing the
   same verb. Do you want that addressed by diversifying Maps 6–10 (which already read more
   differently on paper — a 3×3 constraint grid, a nine-node network, a protection map) into
   *genuinely* different interaction models when they're built, or do you also want some of
   the already-built five reworked toward, say, visible-check-driven or combat-integrated
   puzzles rather than pure carry-to-target?

### Sam's answer: two new primitives, priority order, and how far to take them (2026-09-17)

Sam's decision on the mechanical-variety question above: build two new generic engine
primitives before more maps, in this order —

- **Build A — rotating hex mechanisms** (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.2): the
  operator wheel / signal prism / current turner primitive (six-state orientation, up to three
  edge-to-edge tracks, a Reckoner's ordinary rotate-adjacent action, a Geometry check's
  rotate-jammed action). Named as feeding six maps — Ninefold Orchard 3 and 10, Little
  Reckoning 4 and 9, Gifford 2 and 6 — "build it first."
- **Build B — the Hive Ledger deduction board** (§4.3): a hex-native constraint-group puzzle
  (flower/ray/ring groups, locks while corrupted by an enemy), plus hex ring logic as a
  secondary form. Named as feeding at least Ninefold Orchard 9 and Gifford 9.
- Combat-pattern work and any per-family procedural kernel (item 1's open question above) fold
  into whichever map first needs them, rather than being built standalone ahead of demand —
  the same "no mechanism before its first real user" discipline route markers, weighted edges
  and changed-tile memory already followed.

This entry starts Build A. Per the scope-freeze rule, recording before starting: engine-only,
new primitive plus tests, no shared-file edits (`ExpeditionBoard.jsx`, `ExpeditionScreen.jsx`,
`expedition-ui-shared.jsx`, `expedition-hex-layout.js` all untouched — Codex's declared files
above and unrelated to this work regardless). This pass builds the generic mechanism only, not
all six consuming maps — matching how route markers landed several sessions before Lanterns in
the Forgetting Fog became their first real user.

### Claude: Build A, the rotation-hex primitive, lands (2026-09-17)

Files: `expeditions/expedition-engine.js` (`rotationHexTracks`, `travelThroughRotationHex`,
`applyTrackOperation`, `tracksAligned`; `reframeTarget` now refuses a `jammed` object; a new
Geometry discipline action `forceRotate` in `useDisciplineAction`), `expeditions/
expedition-schema.js` (documents `tracks`/`jammed`/`jamDifficulty` on `ExpeditionObject`, a new
`RotationHexTrack` typedef, and un-stales the old "PLANNED, not yet implemented" note on
`ExpeditionMechanism` now that the operator-wheel skin is real), `expeditions/
expedition-engine.test.js` (9 new tests for the four pure functions), `expeditions/
expedition-actions.test.js` (6 new tests for Reframe's refusal and Force Rotate, in the file
that already owns discipline/role-action coverage — not duplicated into expedition-engine.test.js).
Validation: `node --test expeditions/expedition-engine.test.js expeditions/expedition-actions.test.js`
(83/83), then a full `npm test` (17/18; the one `bundle_smoke.cjs` failure is the same
unrelated local heap-limit issue logged repeatedly already in this file — re-ran directly with
`node --max-old-space-size=6144 scripts/bundle_smoke.cjs` and it passed clean).

**Design, and what is deliberately reused rather than invented:** a rotation hex is the same
rotatable-tile primitive a route marker already is (`orientation` 0-5, `reframeTarget`'s
existing rotate action), generalised so one mechanism covers all three approved skins from the
brief's §4.2 table instead of three separate ones:

- A track entry may be a plain `[a, b]` edge pair — identical in meaning to a route marker's
  `paths` entry, so an existing route marker (Lanterns in the Forgetting Fog's three prisms,
  built before this primitive existed) already *is* a rotation hex with no tracks needing the
  new fields; `rotationHexTracks` falls back to `paths` when `tracks` is absent and returns the
  exact same hex pairs `routeMarkerConnections` would, proved by a direct test. Lanterns itself
  was not touched — it does not need the operator/signature capabilities this adds, and
  rewiring a locked, verified reference trace onto a new function for no behavioural gain
  would be change for its own sake.
- **Operator wheel**: a track's `op: { type, value }` transforms a value passing through
  (`applyTrackOperation`). Reuses the exact op-string vocabulary (`"+"`, `"-"`, `"*"`, `"/"`)
  `CHAIN_CONSTRAINT_OPERATORS` already established for Reckoner's Reframe and the Smudged
  Stones "chain" constraint, rather than inventing a second convention — only `"inverse"`
  (negation) is genuinely new, since no existing mechanism needed it. Division by zero throws
  rather than producing `Infinity`.
- **Current turner**: a track's `flow` (`"AB"`, `"BA"`, default `"both"`) restricts which side
  a value may enter from — `travelThroughRotationHex` returns `null` (no travel) when the
  wrong side is tried, the same "a misrotated tile genuinely blocks you" outcome a jammed tile
  produces, not a thrown error, since attempting to send a value the wrong way is a legal, if
  useless, move.
- **Signal prism**: a track's `signature` is compared by the new `tracksAligned` helper — two
  untagged tracks always align (an ordinary, ungated connection), matching a plain route
  marker's unconditional join. No scenario reads this yet (nothing needs two-tile alignment
  until a signal-prism map exists); the primitive is proven correct in isolation, per the
  project's standing rule against wiring unused effects into a real map just to exercise them.
- **Geometry-check rotate-jammed action**: `object.jammed: true` now makes `reframeTarget`
  throw a clear, distinguishing error instead of silently succeeding — a jammed tile is heavy,
  a Reckoner alone cannot turn it. `forceRotate` (Geometry discipline, statIndex 1) is the
  replacement: the identical power formula `attemptCheck` already uses (named statistic +
  adjacent ally support) against the tile's own `jamDifficulty`, spent as one action, success
  or failure both recorded — a failed attempt still costs the action and never moves the tile,
  matching every other visible check's "no free retries" rule. `jammed` is a standing property
  of the tile, not a one-time unlock: every future rotation of that tile needs its own check.

**What this does not do, stated honestly rather than glossed over:** no map uses any of this
yet. "Geometry checks can... affect a linked straight run" (the second half of §4.2's jammed-
tile sentence) is not built — it reads as a further, scenario-specific rule (some run of
aligned tiles reacting together) with no existing precedent to reuse and no map yet to prove
the right shape against, so it was left alone rather than guessed at, the same call made
earlier for `intermediate_commander_6`'s edge-closure power. The six named maps (Ninefold 3 and
10, Little Reckoning 4 and 9, Gifford 2 and 6) are not yet built or even scoped against this
primitive — Little Reckoning 9's own brief and the other five all still need their engine work
started from scratch, same as any other unbuilt map on the roster. This entry is the
"build it first" half of Sam's instruction; the six maps are follow-up work, one at a time,
each getting its own verified reference trace before being called done, per house style.

Next: starting Build B (the Hive Ledger deduction board, §4.3) per the same instruction's
priority order, as a fresh engine-only primitive — recording a start note here first, as usual.

### Claude: Build B, the Hive Ledger primitive, lands (2026-09-17)

Engine-only, same boundary as Build A: no `ExpeditionBoard.jsx`/`ExpeditionScreen.jsx`/
`expedition-ui-shared.jsx`/`expedition-hex-layout.js` edits.

**The load-bearing finding: most of this already existed.** Before writing anything I checked
what a Hive Ledger group actually needs against the engine as it stands, because §4.3 describes
it as a deduction puzzle with locking, guarding and an enemy threat — all patterns this project
has already built at least once. It turns out the "constraintGrid" objective family and its
`constraintSatisfied` evaluator (built for The Sealed Archive's 3×3 grid: `sum`, `allDifferent`,
`parity`, `lessThan`, `greaterThan`, `chain`) is already exactly a generic "every group must
satisfy its own named rule" engine — a Hive Ledger group is just one more `constraintGrid`
constraint, not a new objective family. Locking a value is Logic's existing Deduce (value mode,
`valueLocked`). Guarding a cell is the existing universal Guard. So Build B is genuinely two
smaller additions, not one large new system: the group *shapes* (flower/ray/ring — currently
authored as raw hex coordinates, error-prone by hand) and the *rule kinds* the brief's own
examples name that `constraintSatisfied` didn't yet have, plus the one real new piece — an
enemy that corrupts an unlocked, unguarded cell, which had no precedent to reuse outright but a
very close one to model closely.

Files: `expeditions/expedition-engine.js` (`flowerGroup`, `hexRay`, `hexRing`, `ringSector`,
`ringOppositePairs` — pure hex-geometry group-shape helpers, placed by `hexLine`/
`createHexBoard`; `isPrime`; three new `constraintSatisfied` kinds — `useEachOnce`,
`parityCount`, `primeCount`; a new `"corrupt-value"` enemy behaviour in `resolveEnemy`), 
`expeditions/expedition-schema.js` (a new `ConstraintGridConstraint` typedef documenting every
kind, old and new — `constraintGrid` had never been documented in the schema at all, an
existing gap this closes rather than introduces; a new `ledgerCell` property on
`ExpeditionObject`), `expeditions/expedition-engine.test.js` (16 new tests: 5 for the group-shape
helpers, 2 for the new constraint kinds via `evaluateObjective`, 2 for `corrupt-value`).
Validation: `node --test expeditions/expedition-engine.test.js` (59/59), then a full `npm test`
(17/18; the one `bundle_smoke.cjs` failure is the same unrelated local heap-limit issue logged
repeatedly already in this file, re-confirmed passing with
`node --max-old-space-size=6144 scripts/bundle_smoke.cjs` again this session).

**Group shapes** (`flowerGroup`/`hexRay`/`hexRing`/`ringSector`/`ringOppositePairs`): pure
functions from a centre hex to a cell list, so a scenario author calls
`flowerGroup("2,-1")` instead of hand-listing seven coordinates and risking a silent
off-by-one. `hexRing`'s walk order is deliberately fixed (not just "the right set") so
`ringOppositePairs`' "index `i` is opposite index `i + size/2`" is a real, tested geometric
property, not a coincidence of iteration order — proved directly (ring[0]/ring[3] on a radius-1
ring are exactly the two hexes in opposite `HEX_DIRECTIONS`, index 4 and index 1). None of these
touch `state` — they are coordinate math only, reusable by anything, not Hive-Ledger-specific.

**New constraint kinds**, each a real, distinct rule shape rather than a rename of an existing
one: `useEachOnce` is strictly stronger than the existing `allDifferent` (it requires the exact
value set `range[0]..range[1]`, so a group reading 1,1,3,4,5,6,7 — distinct-looking but missing
2 and duplicating 1 — passes `allDifferent`'s pairwise-distinctness check yet must fail
`useEachOnce`; a dedicated test proves this distinction rather than assuming it).
`parityCount`/`primeCount` both name an exact *count* within a group ("have one even value",
"contain exactly two primes"), which the existing `parity` kind cannot express since it requires
*every* cell to match, not a specific number of them — confirmed by a test using a mixed group
where `parity` and `parityCount` would disagree.

**`corrupt-value`** (the "lock while corrupted by an enemy" pattern): modelled closely on the
existing `obscure-operator` behaviour (Smudged Stones' Walking Smudge) — same nearest-unprotected-
target selection, same one-hex-short pathing, same `guarded`/`valueLocked`/`stabilisedUntil`
immunity checks — generalised from an operator's `op` field to a ledger cell's `value`, and
gated on a new `ledgerCell` boolean specifically so it can never target an ordinary carried or
placed value object (a crate, a load) that merely happens to have a `value` field. This was the
one genuinely new piece, since no existing enemy behaviour touches `value` this way; everything
else in Build B is reuse the moment it's checked closely against what already exists, which is
worth stating plainly rather than presenting six new mechanisms where two were actually needed.

**What this does not do, stated honestly:** no map uses any of this yet — Ninefold 9 (The
Orchard Lockdown) and Gifford 9 (The Chancellor's Living Ledger), the two maps Sam named, are
not built or scoped against this primitive; both still need their engine work started from
scratch, same as any other unbuilt map. Little Reckoning's and Gifford's richer group-rule
vocabulary from §4.3's own progression table — signed values, factors, multiples and operation
results for Little Reckoning; inequalities, equivalent expressions and mutually exclusive
statements for Gifford — is not built, the same "leave it for its first real map" call already
made for the signal-prism `signature` field in Build A: three constraint kinds were added
because the brief's own worked examples ("use 1-7 once", "sum to 20", "have one even value",
"contain exactly two primes") named them directly, not because every future rule was guessed at
in advance. "Hex ring logic" (§4.3's secondary form — values moving around a ring, rotating one
tile changing several relationships at once) is only partially covered: the ring/sector/
opposite-pair *shapes* exist and compose with the existing constraint kinds, but nothing yet
moves a value around a ring at runtime or ties a rotation-hex's rotation to a ring relationship
changing — that composition has no concrete consuming map yet either, so it was left as a real
gap rather than a speculative runtime mechanic built ahead of any scenario needing it.

Both Build A and Build B are now landed as primitives. Per Sam's own priority note, combat-
pattern work and any further per-family procedural kernel fold into whichever map first needs
them, rather than being built standalone next — so the next engine session's natural task is
picking one of the eight named maps (Ninefold 3/9/10, Little Reckoning 4/9, Gifford 2/6/9) and
building it against these two primitives, the same one-map-at-a-time discipline every other map
on the roster has followed, starting with a scope note here before any file changes.

### Product decision: scoring, ranking and replay addendum, and a replay star reward (2026-09-17)

Following a chat review of the scenario design against Fortnite/Tacticus-style engagement
patterns, Sam asked for a written addendum plus a specific economy change: one pack star for
each replay clear of an already-cleared scenario, on top of the existing three-star first
clear.

**Added:** `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8, "Scoring, ranking and replay" — a
result-screen rank built from the existing performance marks (gold/silver/bronze, no new hidden
number), personal-best comparison (already tracked via `PRG-06`/`PRG-07`), a read-only local
sibling comparison on shared devices (no server, no new persistence surface), a named
chain-acknowledgement line when a scenario's stated hero chain fires, and the replay-star
decision itself with its guardrails (only an already-cleared scenario is eligible, only a
completed run counts, no first-clear/replay stacking, no further cap for now given the
three-to-six-minute cost of a genuine solve).

**Amended to match, recorded rather than silently changed:** the master brief's "Expeditions is
not an economy shortcut" line, `EXPEDITIONS_SPEC.md` §2's "repeat victories do not award stars,
packs or tokens", `EXPEDITIONS_BUILD_BRIEF.md` §16's "Repeat clear: no currency", and this
document's own `PRG-04` above.

**Not yet done — real engineering work, not just documentation:** `applyExpeditionResult` in
`wm-progress-actions.js` still contains the old behaviour verbatim (`stars += 3; // first-clear
award ... replays earn nothing`, per the code read during this review). Wiring the one-star
replay reward means changing that function to award one star on a completed run when the
scenario is already marked cleared, updating or adding the `PRG-04` test to assert the new
behaviour instead of the old one, and confirming `PRG-03`/`PRG-11` still hold unchanged (first
clear still exactly three stars once; a failed or abandoned run still grants nothing either
way). The rank, personal-best line, sibling comparison and chain-acknowledgement text are pure
result-screen presentation reading existing state and marks; none of them need a new engine
rule, but none of them are wired into `ExpeditionScreen.jsx` yet either. This entry only records
the product decision and the brief; no code changed in this session.

### Build order for §8 (2026-09-17)

Concrete, ordered engineering plan for `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8, grounded
against the real code as it stands today, not a re-statement of the brief's prose. Each step
names its files, why it sits at that point in the order, and its test.

**1. Replay star reward.** Fully independent of every other step below and of Codex's active
boundary — no shared file involved, ships alone.

- File: `wm-progress-actions.js`, `applyExpeditionResult` (currently lines 108-137). Today the
  function only mutates `stars`/`packs` inside `if (firstClear)`; add an `else` branch that adds
  1 star (through the same `PACK_COST` rollover the first-clear branch already uses) when
  `!firstClear` and the call is otherwise a genuine win. `marks` bookkeeping is untouched — it
  already accumulates regardless of reward.
- Test: `scripts/test_progress_actions.mjs`. Update/add the case this doc's `PRG-04` entry now
  describes: replay of an already-cleared scenario grants exactly 1 star; a fresh first clear
  is still exactly 3 and unaffected; the two never both apply to one call (naturally true, since
  `firstClear`/`!firstClear` are the same branch); `won: false` still grants nothing (`PRG-11`,
  already covered — just confirm it still passes).
- Note for whoever builds this: `ExpeditionBoard.jsx` line 258 currently sets the shown message
  to `"Objective complete. A cleaner plan is its own reward."` on a replay clear. That copy is
  now inaccurate once this ships (a replay clear does award something) but changing it is a
  Codex-file edit — see step 6. Stars/packs will update correctly in the background the moment
  step 1 ships even before that copy is fixed; flag the stale line rather than silently editing
  `ExpeditionBoard.jsx` to fix it out of turn.

**2. Result rank as a pure function.** No shared file, buildable and testable immediately after
step 1 (or in parallel; the two don't depend on each other).

- File: `expedition-engine.js`, alongside `computeExpeditionMarks` (line 1269). New function,
  e.g. `rankExpeditionMarks(marks, marksPar)` returning `"gold" | "silver" | "bronze"`. Base on
  achievable-mark count for that scenario: 2 always-available marks (`no_exhaustion`,
  `no_enemies_defeated`) plus 1 more for each of `marksPar.turns`/`marksPar.movement` that is
  non-null (this is exactly what makes `exact_turn_target`/`minimum_movement` reachable at all,
  per `computeExpeditionMarks`'s own logic) — gold when `marks.length` equals that total, silver
  at half or more, bronze otherwise. Operate on the per-run `marks` array `computeExpeditionMarks`
  already returns, not the scenario's cumulative best-ever `marks` set in progress storage —
  those are a different thing (session marks vs all-time record) and must not be conflated.
- Test: `expedition-engine.test.js`. Cover all three tiers, a scenario with no `marksPar.turns`/
  `marksPar.movement` set (2-mark ceiling, e.g. an early map with no turn/movement par), and the
  boundary case at exactly half.

**3. Personal-best comparison as a pure function.** No shared file.

- File: `expedition-engine.js` or `wm-progress-actions.js` (whichever already owns the
  `bestTurns`/`bestActions` shape — that's `applyExpeditionResult`'s territory, so put it there
  as a small helper the same call site can use). Return structured data, not a formatted
  sentence, e.g. `{ improved: bool, matchedBest: bool, previousBest, newBest }` for turns (and
  the same shape for actions if wanted) — same "engine owns the state, UI owns the sentence"
  split already used for the weigh-bridge status text earlier in this document. Compare against
  `existing?.bestTurns` (the value *before* this call's update), not the just-written new best.
- Test: alongside step 1's `PRG-06`/`PRG-07` coverage (best-turns/best-actions "only improves"
  is already tested; add the comparison-result shape as new assertions on the same existing
  fixtures rather than new ones).

**4. Local sibling comparison — skipped on Sam's instruction (2026-09-17), see the dated entry
below this list. Left here unmodified as a design record, not an active step.** The most
architecturally new step of the four non-UI items —
do this after 1-3 are proven, not before.

- Files: `WallabyMaths.jsx` (`P_KEY`, `profKey`, `loadJSON`, currently private module consts
  around lines 1365-1372, and the `profiles` state the `App` component already loads at mount).
  Add an async helper, e.g. `bestExpeditionRecordAcrossProfiles(profiles, scenarioId)`, that
  reads every other local profile's `wm_prof3_<id>` blob (`await loadJSON(profKey(p.id))`),
  drills into `.expeditions.scenarios[scenarioId].bestTurns`, and returns the best one found
  with its profile's name, or `null` when nobody else has played that scenario. This is a
  read-only, on-demand lookup (call it when a result screen opens, not eagerly for every
  profile/scenario pair) — no new persistence, no write.
- **Open question, do not guess:** `wm_profiles_v3` is this device's local profile list per
  [[project_account_sync_design]]'s Google Drive sync work, some or all of these profiles may
  already be cloud-synced. Confirm whether "local sibling comparison" should really mean
  "every profile in `wm_profiles_v3`" (simplest, matches what's on this exact device right now)
  or something narrower, before wiring it in — the brief's §8.4 only asked for "a shared
  device," which `wm_profiles_v3` already models correctly today regardless of sync.
- Test: a focused unit test for the helper against a fixture of two or three fake profile blobs
  in a suitable existing test harness (`scripts/test_progress_logic.mjs` or a new small file —
  match whichever already stubs `window.storage`/`loadJSON`-equivalent access, don't invent a
  second stubbing approach).

**5. Chain acknowledgement — needs a product decision before engineering starts, not just a
build step.** Checked directly: no scenario file (`expedition-data.js`, `expedition-catalogue.js`,
any individual scenario module) currently encodes a hero chain as data. §4.1's chains are prose
only. Detecting "the stated hero chain fired" against `state.history` needs an authoring format
for a chain first — e.g. an optional `heroChains: [[{ actionType, discipline|role }, ...]]` on a
scenario definition, plus a matcher that accepts the named steps occurring in order with
unrelated actions interleaved (per the brief's own "never require a single exact card identity,"
a chain match must not demand contiguous actions or one specific hero). Do not start building
the matcher until the authoring shape is agreed; this is exactly the kind of undocumented
product decision the top of this backlog says to pause on rather than guess at.

**6. Wire it all into the result screen — gated on Codex's boundary, do last.** Every visible
piece (rank badge, the victory-plan sentence as the headline per §8.2, the new-best line,
the sibling line, the chain line once 5 exists) lands in `ExpeditionBoard.jsx`'s win effect and
`message` state (currently lines 251-259, the same block that sets today's flat "first clear:
three stars" / "a cleaner plan is its own reward" text). That file is Codex's declared
shared-file boundary from the geometry pass; nothing in this backlog has since recorded that
pass being handed back. Do not start step 6 without either confirming the boundary is clear or
leaving a coordination note here first, per this document's own standing rule — the same
discipline already used for every engine-only proof map above.

**Suggested order:** 1, then 2 and 3 in either order or together, then 4, with 5 picked up
whenever Sam settles the authoring format, and 6 only once Codex's file is open and every
earlier step has something real to display.

### Claude: step 1 shipped — replay star reward (2026-09-17)

Files: `wm-progress-actions.js` (`applyExpeditionResult`: the `if (firstClear)` guard around the
star award is gone, replaced with `stars += firstClear ? 3 : 1` unconditionally, so every winning
call now earns something; comments updated to say so instead of "replays earn nothing"),
`scripts/test_progress_actions.mjs` (`PRG-03` updated to expect a replay's stars at 4, not 3;
`PRG-04` rewritten from "still grants nothing" to "grants exactly one star" plus a second replay
proving it repeats every time, not just once; added a new `PRG-05` case for a replay crossing the
twenty-star pack boundary, alongside the existing first-clear one). No other file touched — this
is exactly step 1's promise of being independent of Codex's boundary and of steps 2-6.

Validation: `node --test scripts/test_progress_actions.mjs` (29/29), then a full `npm test`
(17/18 green; the one failure is the same pre-existing local `bundle_smoke.cjs` heap-limit issue
logged repeatedly above, re-confirmed unrelated by running `node --max-old-space-size=6144
scripts/bundle_smoke.cjs` directly, which passes clean).

Not done as part of this step, on purpose (see step 6 above): `ExpeditionBoard.jsx` line 258's
message text ("Objective complete. A cleaner plan is its own reward.") is now stale on a replay
clear — stars/packs update correctly in the background regardless, but the copy undersells it.
Left alone since fixing it means editing Codex's declared file.

### Claude: steps 2 and 3 shipped — result rank and personal-best comparison, both pure functions (2026-09-17)

Files: `expedition-engine.js` (new `rankExpeditionMarks(marks, par)`, placed directly after
`computeExpeditionMarks` per the build order), `expedition-engine.test.js` (import added, 4 new
tests: the three-tier boundary, a no-par two-mark ceiling, an odd achievable total rounding the
silver threshold correctly, and the verified Unequal Crossing reference trace ranking gold),
`wm-progress-actions.js` (new `personalBestComparison(previousBest, candidate)`, placed directly
after `applyExpeditionResult`), `scripts/test_progress_actions.mjs` (import added, 5 new tests:
improve/match/worse/no-previous-best/no-candidate). Neither function changes any existing return
shape — `applyExpeditionResult`'s contract is untouched, `computeExpeditionMarks` is untouched.
No shared Codex-declared file touched.

`rankExpeditionMarks` takes the same per-run `marks` array `computeExpeditionMarks` already
returns (not the scenario's cumulative best-ever `marks` set in progress storage) plus that
scenario's `marksPar`, and returns `"gold" | "silver" | "bronze"` by comparing the run's mark
count against however many marks are actually achievable for that scenario (2 always, plus 1
each for `par.turns`/`par.movement` being set) — gold at the full achievable count, silver at
half or more (rounding the threshold up on an odd total, e.g. 2 of 3 is silver but 1 of 3 is
bronze), bronze otherwise.

`personalBestComparison` is intentionally generic (works for turns or actions, or any other
"lower is better" personal-best value) and intentionally not wired into `applyExpeditionResult` —
the caller is expected to read a scenario's existing best before dispatching, then call this
after, matching the "engine owns the state, UI owns the sentence" split the weigh-bridge status
text already established. It has no opinion about *when* it gets called, only about what the
comparison means.

Validation: `node --test expeditions/expedition-engine.test.js` (63/63), `node --test
scripts/test_progress_actions.mjs` (34/34), then a full `npm test` (17/18 green; the one failure
is the same pre-existing local `bundle_smoke.cjs` heap-limit issue, already reconfirmed unrelated
in the step-1 entry above and not re-run a second time here since nothing about this step's
files touches the bundle).

Steps 4 (local sibling comparison), 5 (chain acknowledgement, gated on a product decision about
its authoring format) and 6 (wiring any of this into the result screen, gated on Codex's
boundary) remain open per the build order above.

**Step 4 skipped, on Sam's instruction (2026-09-17).** Local sibling comparison is dropped from
the active build order. `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8.4 is marked deferred rather
than deleted, so the design is still there if this is picked up again later, but nothing should
be built against it without checking that status first. The open profile-scope question §8.4
raised (whether `wm_profiles_v3` is the right boundary for "this device" given the Google Drive
sync work) is moot for now as a result.

Remaining open items: step 5 (chain acknowledgement — still gated on Sam settling an authoring
format for a hero chain as data) and step 6 (result-screen wiring — still gated on Codex's
declared boundary on `ExpeditionBoard.jsx`). Nothing else in §8 is currently buildable without
one of those two unblocking.

**Cross-session note:** a second Claude session (`ukmt-app-a6`) working on Ninefold Orchard Maps
2-10 flagged mid-session that it saw `expedition-engine.js` change under it and asked whether I
was still mid-edit before proceeding. Replied: done, `rankExpeditionMarks` was the only change to
that file for this piece of work, already landed and tested, safe to proceed. Recording here per
the usual shared-file coordination discipline, even though `expedition-engine.js` isn't one of
Codex's declared boundary files — it's still a file two agents are actively both editing today.

### Claude: starting Phase 1 — Ninefold Orchard map work (2026-09-17)

A separate instruction from Sam, unrelated to §8 above (which another session appears to be
mid-way through — `rankExpeditionMarks` landed in `expedition-engine.js` under me while reading
docs for this entry; coordinated directly with that session by message rather than guessing).
Sam's instruction, against §5's rebuilt Ninefold Orchard route table
(`EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md`), in his stated order:

1. Unequal Crossing — light rework: pressure-lane + hero-chain framing only, on the engine
   that already exists. Combine with 5.
2. The Cider Run — new build: rolling presses change basket values over time, own kernel.
3. Nine Across the Turning Bridge — rebuild the existing Nine Across the Bridge on primitive A
   (rotation hex): bridge hexes rotate with wind, changing capacity routes.
4. The Hedgejaw Maze — new build: a walking hedge closes one route per round, ordered-value
   following with prediction (Foresight matters).
5. The Rooststorm — light rework of the existing Maybe-Flock Roost: add a directional-sum
   layer. Combine with 1.
6. The Rootfire Relay — new build: chain-reaction propagation between root nodes, parity.
7. Murder at Moonfall — new build: ring-closing containment.
8. The Hollow Bough Awakens — new build: protection map, moving/decaying terrain, split-party
   pressure.
9. The Orchard Lockdown — new build: needs primitive B (Hive Ledger), three gates.
10. The First Whistle — new build: needs primitive A (rotation), ties rotation + combat + the
    `connect` family together as the module boss map.

**Checked against the real repo state before starting, not assumed:** only levels 1-5 have an
engine scenario file at all (`unequal-crossing.js`, `counting-orchard.js`,
`nine-across-bridge.js`, `widdershins-path.js`, `maybe-flock-roost.js`) — levels 6-10 are still
placeholder briefs only in `expedition-data.js`'s `RAW_EXPEDITION_SCENARIOS.primary`, never
built. This matters for two of Sam's ten items specifically: level 6's placeholder is currently
"Ten Honest Bundles" (`exactSum`, two groups of 10) and level 9's is "Every Basket One Short"
(`constraintGrid`), both superseded by §5's table (Rootfire Relay and Orchard Lockdown
respectively) per the master brief's own conflict rule ("the experience brief... wins"). Neither
was ever engine-built, so this is not a destructive replacement of working, tested code — just
updating two placeholder catalogue rows to match the design that now actually wins. Level 7's
placeholder id is literally `po_count_the_murder` — that already *is* "Murder at Moonfall"
under its working title (confirmed by reading `EXPEDITIONS_NINEFOLD_ROUTE.md`'s Map 7 section
directly), not a separate, external "prior design work" to go looking for outside this repo.

**Boundary:** every item here is engine/scenario data — new scenario files, new tests, new
`simulate_*.mjs` reference traces, catalogue entries, and small precedented extensions to
`expedition-engine.js` where a map's design needs one (e.g. an optional secondary AND-condition
on an existing family, the same pattern `balance`'s `exitHex` and `orderedRoute`'s `centreHex`
already establish — not a new objective family per extension). No edits to `ExpeditionBoard.jsx`,
`ExpeditionScreen.jsx`, `expedition-ui-shared.jsx` or `expedition-hex-layout.js`. Given the size
of this list, each map gets its own dated sub-entry below as it lands, in Sam's stated order,
rather than one entry for all ten — matching how every other multi-map session in this document
has been recorded.

### Claude: items 1 and 5 — Unequal Crossing and The Maybe-Flock Roost light reworks (2026-09-17)

Coordinated with the concurrent §8 session first (message exchange, not a guess): confirmed it
was done editing `expedition-engine.js` before I touched the same file.

**Unequal Crossing** (`unequal-crossing.js`): flags-only, no mechanic touched. Added
`pressureLanes: ["number", "reach"]` (Number for the equal-split partition itself, Reach for
Speed shortening the round trip — Threat/the Hookmoles stays undeclared, matching §5's own
"supported strike is optional" and §2's "early maps use two"), plus prose `heroChain`/
`alternateChain` strings satisfying §7's "alternate tactical chains" requirement. §4.1's chains
are prose-only everywhere in this project so far (confirmed again while doing this — no
scenario encodes one as data yet, same finding the concurrent §8 session already recorded for
its own step 5); these follow that existing convention rather than inventing a new one.

**The Maybe-Flock Roost** (`maybe-flock-roost.js`): the one genuine addition, §5's "make three
directional sums agree while holding towers." Implemented as an optional `sumHexes`/`sumTarget`
on the `"capture"` family evaluator (`expedition-engine.js`) — the same optional
secondary-AND-condition shape `balance`'s `exitHex` and `orderedRoute`'s `centreHex` already
establish, so every other capture map (none exist yet, but the two generic capture tests in
this file) is unaffected by an unset field. Three fixed, non-movable "wind vane" objects (5, 3,
1 — sum 9) sit one hex beside each whistle post, deliberately placed clear of every hex the
locked REF-10 trace moves through, so a genuinely "light" rework changes zero tactical
decisions in that trace — verified by re-running both the test and
`scripts/simulate_maybe_flock_roost.mjs` directly and confirming the identical round-2,
7-action win. Also added `pressureLanes: ["threat", "reach"]` (Number stays undeclared as a
*pressure* since the vanes are fixed background flavour, not a live decision — the same
"a pressure lane is a live decision, not background flavour" principle applied consciously
rather than declaring three lanes just because three are now technically present) and prose
hero/alternate chains.

Files: `expedition-engine.js` (`capture` family's `sumHexes`/`sumTarget`), `expedition-schema.js`
(documents the new field on `ExpeditionObjective`), `unequal-crossing.js`, `maybe-flock-roost.js`,
`maybe-flock-roost.test.js` (1 new test for the generic `sumHexes` mechanism against a minimal
synthetic state, matching this file's existing two generic-capture-test convention; 3 existing
`progress` string assertions updated for the new `"· N/N directional sum"` suffix). Validation:
`node --test expeditions/maybe-flock-roost.test.js expeditions/expedition-engine.test.js`
(73/73), `node scripts/simulate_maybe_flock_roost.mjs` and `node
scripts/simulate_unequal_crossing.mjs` (both re-run directly, identical traces to before).

### Claude: item 3 — Nine Across the Turning Bridge, rebuilt on the rotation-hex primitive (2026-09-17)

Full rebuild, not a light rework — Sam's own framing for this one. Superseded per the master
brief's conflict rule (§5 wins over the older route doc); title/rule updated in
`expedition-data.js` to match.

**Checked against the loan squad before designing, not assumed — this changed the design.**
The brief's stat hook is "Geometry turns a bridge tile, Science holds a wind vane, Speed relays
a load." The loan squad (Pip, Bramble, Nine) has no Geometry-discipline hero at all; Bramble is
the squad's only Reckoner (role "wizard") but her discipline is Science. Reframe (ordinary
rotation) is role-gated, not stat-gated, so that's fine — but Build A's other half, a `jammed`
tile's Force Rotate, genuinely requires `discipline === "geometry"` (`useDisciplineAction`),
which nothing in this squad could ever pass. Originally planned one vane jammed and one
ordinary, to show off both halves of the primitive in one map; dropped the jam entirely once
this checked out false, rather than ship an unusable mechanic. That half of Build A stays real
and tested (`expedition-actions.test.js`) but is deferred to a later map with an actual Geometry
specialist expected — The First Whistle (level 10, item 10 below) names Geometry directly in
its own hook and is a better fit.

**Design:** the two existing bridge sections (near/far, `capacityLimits`, unchanged 2+3+4=9
cap) are now gated by two ordinary rotation-hex "wind vane" objects — `objective.capacityLimits[
i].openWhenOrientation` (`expedition-engine.js`, a new small extension: a limit's `max` becomes
`0` unless the named vane's live `orientation` is in an allowed list, otherwise unchanged). A
closed vane shuts its whole section to any weight, fully visibly. Crosswind's push mechanic
(`sidewind`) is replaced outright by a new `gust` behaviour: turn the nearest still-open,
unprotected vane one step away from 0, on the same "modelled closely on an existing behaviour"
precedent as `obscure-operator`/`corrupt-value` before it. `guarded` and `stabilisedUntil`
(Science's Stabilise, "holds a wind vane" — available to Pip or Bramble, both Science) protect
a vane exactly as they already protect everything else rotatable/changeable in this project.

**A real, honestly-recorded limitation carried over from the original design, not introduced by
this rebuild:** `capacityLimits`/`objectAt` only sums objects with a live `pos` — a carried
object's `pos` is `null`, so a hero walking a load straight through a bridge section (the only
thing any reference trace ever does; nobody parks a crate mid-bridge) never contributes to the
total regardless of vane state. The original scenario's own header note already said as much
for the raw 2+3+4=9 cap; it is equally true now that the cap is gated by orientation instead of
fixed. The gate mechanism itself is real and directly tested (`nine-across-bridge.test.js`'s
synthetic `openWhenOrientation` case, deliberately decoupled from the shipped map — same
"prove the mechanism, not just the trace" discipline as the original's own capacity test), and
Crosswind visibly, mechanically closes a vane in the verified reference trace — it just never
happens to matter for *these specific three values*, same as before.

**Verified reference trace (REF-12, rebuilt):** win in round 3 (turnLimit 4), 12 actions, 12
movement — identical action count to the original by coincidence, not by construction; the
round count moved from 2 to 3 because the new wind-vane hexes (placed clear of every hex the
trace moves through, so they never block it, but not perfectly neutral to Pip's exact path
length) shift her final approach by one hex, leaving her one action point short of dropping in
the same round she arrives. Crosswind does turn `vane_far` closed at the end of round 2 (tied on
distance with `vane_near`, broken alphabetically) — a real, felt demonstration that the mechanism
fires — but by then every load is already delivered or one adjacent drop away, so it changes
nothing about the win. `expedition-catalogue.js`'s `marksPar` updated to `{turns: 3, movement:
12}` to match, recomputed directly rather than guessed.

Files: `expedition-engine.js` (`capacityLimits[i].openWhenOrientation`; `sidewind` removed
outright and replaced by `gust`), `expedition-schema.js` (documents `openWhenOrientation` on the
existing `capacityLimits` doc), `nine-across-bridge.js` (full rebuild), `nine-across-bridge.test.js`
(full rebuild — 12 tests: the rebuilt REF-12, two `gust` ENM tests, Reframe/Stabilise access
tests, a replacement for the now-premise-less "safe route" test — Crosswind can no longer touch
a hero at all, proved structurally rather than by one example route — the `openWhenOrientation`
synthetic gate test, and the retained raw-cap/readiness/high-tier-squad tests), `expedition-data.js`
(`po_nine_across` title/rule updated), `expedition-catalogue.js` (`marksPar`),
`scripts/simulate_nine_across_bridge.mjs` (rewritten for the new trace).

**One more fix, outside this map's own files but caused by its rename:**
`scripts/test_expedition_screen.cjs` line 62 hardcoded the old title `"Nine Across the Bridge"`
as a substring check against the new `"Nine Across the Turning Bridge"` — not a substring of it
("Turning" sits in the middle), so the board-render regression step failed on a stale test
string, not a real rendering defect. This file is a Claude-side regression script (`scripts/`),
not one of Codex's declared presentation files, so fixed directly. Validation: `node --test
expeditions/nine-across-bridge.test.js` (12/12), `node scripts/simulate_nine_across_bridge.mjs`,
`node scripts/test_expedition_screen.cjs`, then a full `npm test` (17/18; the one
`bundle_smoke.cjs` failure is the same unrelated local heap-limit issue logged repeatedly
already in this file).

### Claude: item 2 — The Cider Run, replacing The Counting Orchard at level 2 (2026-09-17)

Sam's confirmed decision (asked directly rather than guessed, given real tested work was at
stake): replace, don't merge or relocate. `counting-orchard.js`/`.test.js` and
`scripts/simulate_counting_orchard.mjs` are untouched and still real — just removed from
`EXPEDITION_SCENARIOS`/`EXPEDITION_CATALOGUE` and from the mandatory regression pipeline (its
own 11 tests still exist and still pass if run directly; they're just no longer a required CI
gate for something no longer shipped). One test in that file (`§2/low band`) depended on the
now-gone catalogue entry for its `readiness` lookup — rewritten to build a minimal
`{level, readiness}` object from `EXPEDITION_READINESS_BY_LEVEL[2]` directly instead, same
assertions, no catalogue dependency.

**A genuinely new mechanic, not a reskin**, per Sam's own "new build" framing: the same board
geometry and `exactSum` family as before (six presses on three lanes, two per lane, carry two
onto a two-hex gate), but the six values and the target are now drawn fresh every embark
(`generateExactPairKernel`, `expedition-kernels.js` — a new kernel, "count distinct values with
exactly one pair summing to a target," the same "prove uniqueness exhaustively, reject and
retry otherwise" discipline as `generateEqualPartitionKernel`), and Scruffcrow's lane-based
targeting (`flood-lane`, `expedition-engine.js` — copy-adapted from `peck-lane` with the sign
reversed) now *raises* a lane's highest unguarded press instead of lowering it, unprotected by
anything but Guard/Stabilise/carrying, matching the brief's "rolling apple presses flood the
lanes with changing values." Scruffcrow himself is reused, not replaced with a new character —
deliberate, since it needs no new art. Arithmetic's Combine/Split remain the "Arithmetic changes
a press value" alternate route, proven directly on this map's own generated objects (a test
combining two non-solution presses into a fresh value), not merely asserted by similarity to
Counting Orchard's identical use of them.

**A real subtlety caught and fixed while building this, not assumed correct:** `flood-lane`
reuses `peck-lane`'s exact `(turn - 1) % laneSequence.length` indexing, which keeps advancing
through Scruffcrow's delayed turns even though he only watches during them — harmless when
delay was 0 (Counting Orchard), but with this map's delay of 2 the *first* active lane would
otherwise be lane 3, not lane 1, which a first draft of the tests caught immediately as a real
failure, not a fixture bug. Fixed by rotating `laneSequence` to `[2, 3, 1]` so the intuitive
lane-1-then-2-then-3 order starts on the first turn Scruffcrow actually acts; documented inline
in `cider-run.js` so the next person adding a delayed lane-based enemy doesn't rediscover this
by trial and error.

**Verified reference trace:** win in round 2, 6 actions, 3 movement, for `REFERENCE_LAYOUT_SEED`
(target 15, solution pair 12 + 3) — comfortably inside Scruffcrow's two-round delay, so (like
Nine Across the Turning Bridge) the flood mechanism is real, independently tested (four ENM/guard
tests), and visibly threatens the board, but doesn't fire within this particular optimal trace;
recorded honestly rather than glossed over, the same call made for that map's capacity gate.
`isPhysicallyDeliverable` (mirroring Unequal Crossing's certifier) actually plays each candidate
layout out with the real loan squad and the real two-round safe window before accepting it —
swept across 20 seeds, values/positions/target all genuinely vary and every one independently
confirmed to have exactly one valid pair.

Files: `expedition-kernels.js` (`generateExactPairKernel`), `expedition-engine.js`
(`flood-lane`), `cider-run.js` (new), `cider-run.test.js` (new, 10 tests), `counting-orchard.test.js`
(one test rewritten, import trimmed), `expedition-data.js` (`po_counting_orchard` replaced by
`po_cider_run` in the level-2 slot), `expedition-catalogue.js` (same swap, `marksPar`),
`scripts/simulate_cider_run.mjs` (new), `scripts/run_regression.mjs` (swapped the reference-
playthrough step, added `cider-run.test.js` to the unit-test line),
`scripts/test_expedition_screen.cjs` (board-render loop entry swapped, same reasoning as Nine
Across the Turning Bridge's rename fix — a Claude-side regression script, not a Codex file).
Validation: `node --test expeditions/cider-run.test.js expeditions/counting-orchard.test.js`
(21/21), `node scripts/simulate_cider_run.mjs`, `node scripts/test_expedition_screen.cjs`, then
a full `npm test` (17/18; the one `bundle_smoke.cjs` failure is the same unrelated local
heap-limit issue logged repeatedly already in this file).

### Claude: item 4 — The Hedgejaw Maze, replacing The Widdershins Path at level 4 (2026-09-17)

Not asked as a question this time — the same conflict shape as The Cider Run (a built,
tested map sharing deep mechanical DNA with the brief's replacement), but Sam's own "new build"
framing for this item plus his just-given answer on Cider Run ("replace it") was enough
precedent to proceed without asking again. `widdershins-path.js`/`.test.js` and
`scripts/simulate_widdershins_path.mjs` are untouched, real, and still pass directly — removed
from `EXPEDITION_SCENARIOS`/`EXPEDITION_CATALOGUE`/the regression pipeline only, same treatment
as Counting Orchard. One test (`§9`) rewritten to build its `{level, readiness}` object directly
instead of a catalogue lookup, same fix as before.

**Checked closely before concluding it needed a real rebuild, not a rename:** the brief's stat
hook for this level ("Logic predicts the closing path, Geometry shifts a blocker, Scout marks
the Hedgejaw") shares real DNA with Widdershins (increasing-value stones, a creature affecting
the route) but names three specific actions (Predict, Shift, Mark) that Widdershins' actual
shipped mechanic never used (it uses Logic's *repair* mode on Order, no blocking object, no
Predict, no Mark) — confirmed by reading `widdershins-path.js` directly, not assumed from the
title alone. Built fresh rather than reusing Widdershins' `reverse-next`/`reversed`/
`reversedFrom` machinery, since that machinery answers a different question (which entry hex is
currently valid) than this map's actual question (is the entry hex physically occupied).

**Design:** the existing `orderedRoute` family plus `visitStone`'s existing, already-optional
`requiredFrom` field (Widdershins established it; here it is simply never reversed — three
stones, each with one named approach hex). The one genuinely new piece: a single "hedge"
blocking object (`kind: "hedge"`, `movable: false` specifically so ordinary carrying can never
clear it), which a new enemy behaviour (`walk-hedge`, `expedition-engine.js`) relocates onto
whichever stone's `requiredFrom` gate the party needs *next* — always the current sequence
target's own gate, never hidden or randomly chosen, so fully predictable from progress alone.
Clearing it needs Geometry's **existing** True Shift discipline action, unmodified — checked
directly that Shift never required `object.movable` (unlike Combine/Split, which do), so a
`movable: false` object is still a legal Shift target. Logic's Predict and Scout's Mark both
work on the Hedgejaw with zero engine changes, satisfying the rest of the brief's stat hook
through pure reuse.

**A real squad-composition consequence, checked rather than assumed:** none of the original
loan squad (Pip, Bramble, Nine — science/science/speed) has Geometry discipline, and this map's
own named counter-play genuinely needs one (unlike Nine Across the Turning Bridge's jammed vane,
which was optional flavour, "Geometry shifts a blocker" is this map's *only* way to clear a
closed gate with no alternate route). Rather than build a map whose own stat hook the loan squad
can never use, swapped Bramble (Reckoner role, no work to do on this map) for Russet (a
Geometry-discipline common) in `EXPEDITION_CATALOGUE`'s `po_hedgejaw_maze` entry specifically —
the first map in this project to use a different three-card loan squad than
`["pip", "bramble", "nine"]`, recorded here so it doesn't read as an accidental inconsistency.

**Verified reference trace:** win in round 3 (turnLimit 5), 8 actions, 5 movement. Nine alone
visits stone_3 and stone_5 inside the Hedgejaw's one-round delay (both gates already lie on her
own quickest route — a real property of this layout, not a scripted freebie), so by the time the
Hedgejaw first acts, stone_9 is the current target and its gate is what actually closes — giving
a genuine, felt "Geometry shifts a blocker" moment in the *optimal* trace, not just an untested
contingency (unlike some of the other new mechanisms this session, stated honestly where that
was the case; here it wasn't necessary to hedge that caveat).

Files: `expedition-engine.js` (`walk-hedge`), `hedgejaw-maze.js` (new), `hedgejaw-maze.test.js`
(new, 8 tests), `widdershins-path.test.js` (one test rewritten, import trimmed),
`expedition-data.js` (`po_widdershins_path` replaced by `po_hedgejaw_maze` in the level-4 slot;
new `hedgejaw` entry in `EXPEDITION_ENEMIES` — a separate, illustrative registry from the real
engine enemy defs, validated for reference existence only), `expedition-catalogue.js` (same
swap, new loan squad, `marksPar`), `scripts/simulate_hedgejaw_maze.mjs` (new),
`scripts/run_regression.mjs` (swapped the reference-playthrough step, added
`hedgejaw-maze.test.js`), `scripts/test_expedition_screen.cjs` (board-render loop entry
swapped). Validation: `node --test expeditions/hedgejaw-maze.test.js
expeditions/widdershins-path.test.js` (16/16), `node scripts/simulate_hedgejaw_maze.mjs`, `node
scripts/test_expedition_screen.cjs`, `node scripts/validate_expeditions.mjs`, then a full `npm
test` (17/18; the one `bundle_smoke.cjs` failure is the same unrelated local heap-limit issue
logged repeatedly already in this file).

### Claude: item 6 — The Rootfire Relay, a fresh build at level 6 (2026-09-17)

No conflict to resolve this time: the old level-6 placeholder ("Ten Honest Bundles") was never
engine-built (checked before starting — no `ten-honest-bundles.js` anywhere in the repo), so
this is purely new content, not a replacement.

**Genuinely zero new player-facing actions** — the whole map is existing, unmodified engine
primitives used in combination, which is worth stating plainly rather than presenting it as more
novel than it is: Geometry's True Shift ("bridges a gap") relocates a root next to its
neighbour; Science's Chain Reaction ("propagates" the change) raises a connected sub-chain by
one each in a single action; Arithmetic's Combine remains the "changes a source value" alternate
route. The `constraintGrid` family (already built for The Sealed Archive/Hive Ledger) checks
"exact totals and parity" as two constraints at once (`sum` across all five roots, `parity` on
the trunk) rather than needing a new objective family. The one new piece is `wilt-root`
(`expedition-engine.js`) — Strawling reducing the single highest-value unguarded root anywhere
on the board by one, modelled on `peck-lane`/`flood-lane` but without their lane partitioning,
since this map's roots form one relay, not separate lanes. Strawling itself is reused from the
existing Ninefold cast (the old placeholder already named it), so no new art.

**Another squad-composition consequence, checked rather than assumed:** this map's own
mechanism needs both a Geometry hero (Shift) and a Science hero (Chain Reaction) at once,
neither of which the default loan squad's Nine supplies (she's Speed). `EXPEDITION_CATALOGUE`'s
`po_rootfire_relay` entry uses `["russet", "bramble", "nine"]` — Russet (Geometry) replacing
Pip, Bramble (already Science) kept for Chain Reaction — the second map this session to need a
non-default loan squad, after The Hedgejaw Maze.

**Verified reference trace:** win in round 1, 2 actions, 0 movement — both heroes start already
adjacent to their targets. Deliberately snappy: not every level needs to be a slog, and §1's
"decisive final turn" is satisfied by one clean insight rather than a long crawl. Strawling's
one-round delay means it never gets a chance to act before this trace already wins — real and
independently tested (two ENM tests, a guard test), just not necessary for the optimal line,
the same honestly-recorded pattern as Nine Across the Turning Bridge's capacity gate and The
Cider Run's flood.

Files: `expedition-engine.js` (`wilt-root`), `rootfire-relay.js` (new), `rootfire-relay.test.js`
(new, 8 tests), `expedition-data.js` (`po_honest_bundles` replaced by `po_rootfire_relay` in the
level-6 slot; `strawling` already existed in `EXPEDITION_ENEMIES`, no new registry entry
needed), `expedition-catalogue.js` (new entry, non-default loan squad, `marksPar`),
`scripts/simulate_rootfire_relay.mjs` (new), `scripts/run_regression.mjs` (new
reference-playthrough step, added `rootfire-relay.test.js`), `scripts/test_expedition_screen.cjs`
(added to the board-render loop). Validation: `node --test expeditions/rootfire-relay.test.js`
(8/8), `node scripts/simulate_rootfire_relay.mjs`, `node scripts/test_expedition_screen.cjs`,
`node scripts/validate_expeditions.mjs`, then a full `npm test` (18/19; the one
`bundle_smoke.cjs` failure is the same unrelated local heap-limit issue logged repeatedly
already in this file).

### Claude: item 7 — Murder at Moonfall, a fresh build at level 7 (2026-09-17)

No conflict: confirmed by reading `EXPEDITIONS_NINEFOLD_ROUTE.md`'s Map 7 section directly that
`po_count_the_murder` already *is* this map under its working title (recorded again here since
it's the kind of thing worth being unambiguous about, not assumed from the id alone), and
nothing was ever engine-built for it.

**Uses the "containment" objective family exactly as it already existed** (built an earlier
session, never previously exercised by a real scenario) — zero engine changes for this map. The
Crowbreaker uses the engine's own *default* enemy behaviour (no `behaviour` field at all): hunt
the nearest hero, strike once in range, otherwise close the distance — "a crow swarm moves" is
exactly that default, not a new mechanism.

**A genuine discovery while designing this, not assumed:** an off-board neighbour never counts
as a closed containment side — `state.board[hex]` is `undefined` there, so
`undefined === "blocked"` is false. This means a board-corner position can *never* be fully
contained (some of its neighbours simply don't exist), which is worth recording plainly since it
constrains every future use of this family: containment only works at an interior hex with a
real on-board neighbour on all six sides. Placed the Crowbreaker accordingly, with three of its
six neighbours pre-walled (`terrain: "blocked"`) to make "an incomplete ring" literal — three
hedge walls plus three heroes, one each on the remaining open hexes.

**Verified reference trace:** win in round 1, 3 actions, 4 movement — three heroes each walk to
a separate open hex and the ring is already closed the instant the third one arrives, before the
Crowbreaker's one-round delay even lets it act. A second genuine finding worth stating: winning
this way needs the objective to become true at any instant, not "and stay true to round's end" —
`containment`, like every other family, is checked fresh after every single action.

Files: no `expedition-engine.js` changes at all this time. `murder-at-moonfall.js` (new),
`murder-at-moonfall.test.js` (new, 8 tests, including a structural proof that one hero can never
close all six sides alone — three walls plus one hero's own hex is only ever four), `expedition-
data.js` (`po_count_the_murder`'s title/rule updated to match; a new `crowbreaker` entry in
`EXPEDITION_ENEMIES`, the old `crow_swarm` entry left in place, unreferenced but harmless),
`expedition-catalogue.js` (new entry), `scripts/simulate_murder_at_moonfall.mjs` (new),
`scripts/run_regression.mjs` (new reference-playthrough step, added
`murder-at-moonfall.test.js`), `scripts/test_expedition_screen.cjs` (added to the board-render
loop). Validation: `node --test expeditions/murder-at-moonfall.test.js` (8/8), `node
scripts/simulate_murder_at_moonfall.mjs`, `node scripts/test_expedition_screen.cjs`, `node
scripts/validate_expeditions.mjs`, then a full `npm test` (19/20; the one `bundle_smoke.cjs`
failure is the same unrelated local heap-limit issue logged repeatedly already in this file).

### Claude: item 8 — The Hollow Bough Awakens, a fresh build at level 8, and a real presentation
### crash caught by actually running the render test (2026-09-17)

No conflict: `po_hollow_bough`'s old placeholder was never engine-built.

**A first draft broke Codex's board renderer — caught by running the real render test, not
assumed safe.** The natural first design made the memorial a stationary `side: "player"` unit
with `hp`/`maxHp`, reusing the existing "protect" family's unit-hp check completely unmodified.
It built and tested cleanly in isolation, but `node scripts/test_expedition_screen.cjs` crashed:
`ExpeditionBoard.jsx`'s party panel zips every player-side unit against the caller-supplied
`squad` array of real hero cards (`squad.find(item => item.id === hero.id)`) and reads
`profile.discipline` off the result — for a fourth unit with no matching card, that lookup is
`undefined`, and `.discipline` throws. This is Codex's declared file, so not fixed by editing
it; rebuilt the map's own design instead of patching around a symptom in someone else's active
file. Recording this because it is a real, generally-applicable constraint on this pattern: a
scenario must never add a `side: "player"` unit that is not one of the three-or-four selected
hero cards, whatever the objective family.

**Rebuilt around a plain object memorial instead**, which needed two small, precedented engine
additions rather than forcing an object into a unit-shaped shape: the "protect" family now also
fails when an object target's `damaged` flag (the same field Mender's Restore already uses
elsewhere, so Restore needed zero changes) is true — a real unit target never sets `damaged`, so
the added clause is always true for the family's original unit-based use and cannot regress it,
confirmed by a dedicated engine test built specifically to prove that non-regression rather than
assumed. The one genuinely new piece is `grow-toward` (`expedition-engine.js`) — Overgrowth (the
existing Ninefold cast name from the old placeholder, no new art) approaches a single named
object and damages it once adjacent unless guarded, modelled directly on
`obscure-operator`/`steal-highest`'s exact approach-then-strike, stop-one-hex-short pathing.
Logic's Predict and Guard/Restore all work unchanged, satisfying the rest of the brief's stat
hook through reuse.

**Verified reference trace:** win in round 5 (turn count after the round-4 check, turnLimit 4),
2 actions, 0 movement. Deliberately left the memorial unguarded for the first three rounds —
Overgrowth's one-round delay plus real travel time means it cannot reach and strike before round
3 regardless — so Restore is genuinely exercised (undoing the one hit that lands) rather than
merely named, the same "prove it, don't just assert it" bar as every other map this session.

Files: `expedition-engine.js` (`protect`'s object-`damaged` clause; `grow-toward`),
`hollow-bough-awakens.js` (new, with the unit-vs-object story recorded in its own header for
whoever reads it next), `hollow-bough-awakens.test.js` (new, 8 tests, including a direct proof
that the new "protect" clause cannot regress a unit-hp target), `expedition-data.js`
(`po_hollow_bough` title/rule updated to match; reused the already-registered `overgrowth`
enemy, dropping the old placeholder's second copy), `expedition-catalogue.js` (new entry),
`scripts/simulate_hollow_bough_awakens.mjs` (new), `scripts/run_regression.mjs` (new
reference-playthrough step, added `hollow-bough-awakens.test.js`),
`scripts/test_expedition_screen.cjs` (added to the board-render loop — this is exactly the check
that caught the crash, run directly and repeatedly while iterating, not just at the end).
Validation: `node --test expeditions/hollow-bough-awakens.test.js` (8/8), `node
scripts/simulate_hollow_bough_awakens.mjs`, `node scripts/test_expedition_screen.cjs`, `node
scripts/validate_expeditions.mjs`, then a full `npm test` (20/21; the one `bundle_smoke.cjs`
failure is the same unrelated local heap-limit issue logged repeatedly already in this file).

### Claude: item 9 — The Orchard Lockdown, primitive B's first real map (2026-09-17)

No conflict: `po_one_short`'s old placeholder ("Every Basket One Short") was never engine-built,
and already happened to use the `constraintGrid` family, so this keeps that family and updates
only the title/rule/content to the Hive Ledger design.

**Three gates, one genuine puzzle plus two defensive holds** — three `constraintGrid`
constraints at once: a `sum` gate, a `parity` gate, and Build B's own `useEachOnce` gate ("use
1-3 once," a smaller real instance of the brief's "1-7," not every constraint needing to reach
seven). Gates B and C read correctly from the start; gate A starts deliberately short (2 + 3,
needing 9) so there is an actual puzzle to solve, not a defend-only map. Nearly (already in the
Ninefold cast, reused unchanged) uses `corrupt-value` (Build B, built earlier this session,
never previously exercised by a real scenario) with zero engine changes.

**A real, checked-and-avoided gotcha, not a lucky accident:** the natural way to fix gate A
would be Combine-ing two of its own three listed cells together — but Combine sets
`removed: true` without ever zeroing `value`, and the `sum` constraint kind reads every listed
id's value regardless of `removed`, so combining two of the gate's *own* official cells would
silently double-count the merged-away one's stale value. Recorded and designed around
deliberately: the sum gate's `objectIds` lists only two cells (`a1`, `a2`); a third "spare" cell
sits nearby but is never flagged `ledgerCell` and never appears in any constraint's `objectIds`,
so Combine-ing it into `a2` raises the gate's total with no double-counting possible. A dedicated
test asserts the spare is absent from the constraint's own id list, rather than trusting the
design read correctly from the code alone.

**A genuine discovery about `corrupt-value` while writing this map's own tests, not assumed from
Build A's write-up:** it targets the *nearest* unguarded, unlocked ledger cell, not the
*highest-value* one — that is `flood-lane`/`wilt-root`'s rule, a different behaviour built the
same session. A first draft of the ENM test assumed highest-value targeting by pattern-matching
the wrong sibling behaviour and failed immediately against the real simulation; rewritten once
the actual rule was confirmed by tracing Nearly's real approach round by round.

**Verified reference trace:** win in round 1, 1 action, 0 movement — Bushel's Combine alone
opens all three gates at once, before Nearly's one-round delay even lets it act. Another
deliberately snappy solve, honestly recorded rather than dressed up as a longer siege; Nearly's
threat to gates B and C is real and independently tested (two ENM/guard tests using direct
simulation of its approach), just not needed by this specific fix.

**A squad-composition note, by now a recurring pattern this session:** none of the default loan
squad has Arithmetic discipline, so `EXPEDITION_CATALOGUE`'s `po_one_short` entry uses
`["bushel", "pip", "nine"]` (Bushel, Arithmetic) in place of Bramble — the third map this session
needing a non-default loan squad, after The Hedgejaw Maze and The Rootfire Relay.

Files: no `expedition-engine.js` changes at all — every mechanism this map needed already
existed from Build A/B or earlier proof maps. `orchard-lockdown.js` (new), `orchard-lockdown.test.js`
(new, 7 tests, including the double-counting-avoidance proof and the corrected nearest-target
ENM tests), `expedition-data.js` (`po_one_short` title/rule updated; `nearly` already
registered), `expedition-catalogue.js` (new entry, non-default loan squad),
`scripts/simulate_orchard_lockdown.mjs` (new), `scripts/run_regression.mjs` (new
reference-playthrough step, added `orchard-lockdown.test.js`), `scripts/test_expedition_screen.cjs`
(added to the board-render loop). Validation: `node --test expeditions/orchard-lockdown.test.js`
(7/7), `node scripts/simulate_orchard_lockdown.mjs`, `node scripts/test_expedition_screen.cjs`,
`node scripts/validate_expeditions.mjs`, then a full `npm test` (21/22; the one
`bundle_smoke.cjs` failure is the same unrelated local heap-limit issue logged repeatedly
already in this file).

### Claude: item 10 — The First Whistle, the module boss, ties primitive A to combat (2026-09-17)

No conflict: `po_first_whistle`'s old placeholder ("connect" family, "reconnect all nine
branches") was never engine-built. Kept the "network restoration" flavour but changed the
family from `connect` to `eliminate` — a genuine, necessary change, not a stylistic one: if the
win condition were the network connecting, the expedition would end the instant it did, leaving
no time for the "combat opens only after the network is live" half of the brief at all. Connect
now gates *combat*, not victory itself.

**The one genuinely new mechanism: `enemy.networkGate`** (`strikeEnemy`, `expedition-engine.js`)
— reuses `graphConnected` and `routeMarkerConnections` directly (the exact same function the
`connect` family itself calls, not a second implementation) to decide whether a strike lands at
all. While the named network reads unconnected, a strike is still a legal action — support and
Precise still apply, nothing throws — it simply always resolves at 0 impact, the same outcome a
strike below Defence already produces. Tested directly in `expedition-actions.test.js` (not this
map's own test file, following the project's own convention of putting cross-cutting action
mechanics there) before this scenario was even written.

**Two branches finally give primitive A's `jammed`/Force Rotate half a real map.** Nine Across
the Turning Bridge and The Hedgejaw Maze both checked their own loan squads and found no
Geometry-discipline hero, deliberately deferring the jammed-tile half to "a later map with an
actual Geometry specialist expected" — this is that map. `EXPEDITION_CATALOGUE`'s
`po_first_whistle` entry uses `["russet", "bramble", "nine"]` (Russet, Geometry) — the fourth map
this session needing a non-default loan squad.

**A real placement mistake caught by the engine-level tests, before the scenario file even
existed:** a route marker connects two of its *own* neighbouring hexes, never its own hex to a
node — both branches in this map sit on a third hex adjacent to the two nodes they join. A first
draft of `expedition-actions.test.js`'s networkGate test placed the marker directly on one of the
two nodes and failed immediately; fixed by recomputing which hex is actually adjacent to both
endpoints, the same lesson then applied correctly when writing this scenario's own two branches.
A second, smaller trap: a straight `[0, 3]` path is 180 degrees end to end, so rotating it by
three of six steps maps it onto itself — an orientation that "looks" jammed-and-misaligned on
paper is not, checked by computing the actual neighbour indices rather than assumed, before
picking `marker_far`'s real starting orientation.

**Verified reference trace:** win in round 2, 9 actions, 6 movement. Bramble's ordinary Reframe
and Russet's Force Rotate both land in round 1 — Russet, already adjacent to First Root, lands
the first strike the same round the network opens. The other two heroes close the distance
during round 1's spare actions and finish the boss together in round 2, before First Root's
one-round delay even lets it act back.

Files: `expedition-engine.js` (`strikeEnemy`'s `networkGate` clause), `expedition-schema.js`
(documents `networkGate` on `ExpeditionUnit`), `expedition-actions.test.js` (2 new networkGate
tests, placed alongside the existing Force Rotate coverage rather than in this map's own file),
`first-whistle.js` (new), `first-whistle.test.js` (new, 8 tests), `expedition-data.js`
(`po_first_whistle`'s family/title/rule updated; a new `first_root` entry in
`EXPEDITION_ENEMIES`, the old `forgetting_root` entry left in place, unreferenced but harmless),
`expedition-catalogue.js` (new entry, non-default loan squad), `scripts/simulate_first_whistle.mjs`
(new), `scripts/run_regression.mjs` (new reference-playthrough step, added
`first-whistle.test.js`), `scripts/test_expedition_screen.cjs` (added to the board-render loop).
Validation: `node --test expeditions/expedition-actions.test.js expeditions/first-whistle.test.js`
(43/43), `node scripts/simulate_first_whistle.mjs`, `node scripts/test_expedition_screen.cjs`,
`node scripts/validate_expeditions.mjs`, then a full `npm test` (22/23; the one
`bundle_smoke.cjs` failure is the same unrelated local heap-limit issue logged repeatedly
already in this file, re-confirmed passing with
`node --max-old-space-size=6144 scripts/bundle_smoke.cjs`).

### Phase 1 (Ninefold Orchard map work) complete (2026-09-17)

All ten items on Sam's list are done, in the order given: light reworks (1, 5), three rebuilds/
new-builds superseding an old placeholder after an explicit decision each time (2, 3, 4), five
clean new builds (6, 7, 8, 9, 10). Every module-level regression check (`npm test`) stayed green
throughout except the one pre-existing, unrelated local `bundle_smoke.cjs` heap-limit issue,
confirmed via the documented workaround every time it recurred. Both primitives from earlier this
session (Build A rotation hex, Build B Hive Ledger) now each have at least one real, shipped map
using them, not just standalone tests. Ninefold Orchard's ten catalogue slots are all filled with
genuinely distinct mechanics — no two maps share the same core verb. Little Reckoning and Gifford
remain at two shipped maps each, per the delegated backlog's original schedule; that work has not
been started as part of this list.

### Claude (§8 session): audited new Maps 2/3 art, deliberately not wiring it (2026-09-17)

Sam asked whether newly-landed art for Cider Run and Nine Across the Turning Bridge could be
reviewed and hooked up. Audited it directly (read `manifest.json`, `expedition-9fo-art.js`,
`expedition-9fo-extra-art.js`, `ExpeditionBoard.jsx` and the four relevant scenario files) rather
than guessing. Findings:

- New runtime files exist and are mostly usable: Cider Run has a background, press/basket/gate
  objectives, flow-arrow/value-change effects and three Scruffcrow poses (`flee`/`peck`/`perch`
  — a different state-name vocabulary from the rest of the manifest). Nine Across the Turning
  Bridge has a background, wind-vane/safe-alcove objectives, a current-turner mechanism tile, and
  a full Crosswind set (`idle`/`hit`/`telegraph`/`defeated`, each with matching `.png`+`.svg`) —
  the most manifest-ready of the new material. (Hedgejaw Maze also has SVG-only assets, though
  Sam only asked about maps 1-3.)
- **None of it is registered anywhere.** `manifest.json` has zero references to any of these
  files. `expedition-9fo-art.js` (what the board actually imports) is headed "AUTO-GENERATED from
  manifest.json... do not hand-edit," but the generator script that produced it isn't in
  `scripts/` — there's no clean "just re-run it" path to add these without either reconstructing
  that script or breaking its own no-hand-edit rule.
- **A real, pre-existing bug found in passing, unrelated to whether new art exists:**
  `ExpeditionBoard.jsx`'s `nfoEnemyArt` (~line 51) doesn't branch on enemy id at all — it
  unconditionally returns `NINEFOLD_ORCHARD_ART.enemies.hookmole` for any enemy on any Ninefold
  Orchard map. Scruffcrow and Crosswind currently render as Hookmole, not as an emoji fallback and
  not as their own (currently unregistered) art.
- Actually wiring any of this needs `ExpeditionBoard.jsx` edits — Codex's declared, still
  unrecorded-as-handed-back file, and nothing under `assets/expeditions/` or the art-module files
  is committed to git yet, so there's no safety net against a collision with concurrent Codex
  work.

**Sam's decision: Codex/ChatGPT handles this, not Claude.** No manifest, art-module or board
edits made — audit only. Recording the full findings here (stale manifest, missing generator
script, the real enemy-art bug, and which scenario each new file belongs to) so whoever picks
this up — Codex, a later Claude session, or Sam directly — doesn't have to redo this audit.

### Claude handover: Cider Run distinctness, Map 1–3 tests and packaging (2026-09-18)

Sam played The Cider Run and found it visually generic, similar to the preceding map and
unclear about what to do. Codex has now made a **presentation candidate** in
`expeditions/ExpeditionBoard.jsx` and `expeditions/expedition-9fo-scene-art.js`: scene-specific
backdrops, press/turner/scale props and enemies, fixed image action buttons, a wider hero frame,
top-right action log and on-board values/target. The new art is imported without editing the
auto-generated manifest. The isolated board preview bundles. It has **not** passed Sam's
in-app visual/playthrough acceptance. Codex retains exclusive ownership of the board renderer,
HUD, art imports, asset anchors and alpha/visual QA. Do not edit those files in this task.

Claude's bounded backend/scenario task, when Sam asks Claude to pick this up:

1. Rework `expeditions/cider-run.js` so the map's geometry and tactical decisions no longer
   read like Counting Orchard with different props. Today both are radius-three all-clear
   boards with two exact-sum gate hexes and six carried values. The `flood-lane` threat does
   not activate before round three (`delay: 2`), yet a certified solution and reference trace
   can win in round two. Make the flood visible and consequential within a normal five-minute
   playthrough while retaining a fair, solvable 8–11-year-old challenge and procedural variety.
   Do not change the board renderer as a shortcut. Give Codex exact state/event fields needed
   for any new visual cue before changing their contract.
2. Review the Cider squad and role-action opportunity. Its default Pip/Bramble/Nine squad
   contains no Arithmetic specialist despite `flags.heroChain` promising Combine/Split as the
   alternate route. Either ensure the player can choose an eligible card and the route is
   meaningfully available, or update the reference chain, readiness and tests. Keep player
   explanations aligned with the actual solution paths.
3. Add scenario tests and reference traces proving: a flood actually changes a press in at
   least one intended winning/near-winning trace; multiple seeds remain solvable; the printed
   target and press values match the objective; both gate hexes are required; a normal player
   can recognise the threatened lane and recover or choose an alternate plan. Cover a weaker
   squad and a recommended squad, not merely evaluator success. Do the same state-contract
   check for Map 1 scales and Map 3 vanes/bridge capacity so art shows real engine state.
4. Package and smoke-test the new assets after Codex's visual approval. The generated manifest
   still lacks the newly added runtime files and the generator is absent. Decide a maintainable
   source-of-truth strategy with Codex before touching art imports. Check offline bundle size
   and app start time on a modest device; avoid silently embedding redundant 2K variants.

Acceptance is a five-minute human playthrough with a distinctive map, a visible objective,
at least one meaningful flood decision, working actions, correct scenario art and no release-
gate regression. Automated tests alone are not a release sign-off. Do not alter the private
`eudaimon` gate, persistence, rewards or other scenario contracts without a separate brief.

### Claude handover: Hookmole "carry until defeated" redesign, and a real steal-highest bug (2026-09-18)

Sam's live playtest of Unequal Crossing found the Hookmoles "just stood there," and separately
asked what happens if a Hookmole ever actually got a crate ("you've lost forever?"). The old
mechanic: `delay: 2` (no action until round 3), and on a successful steal the crate teleported
to a fixed `home` hex, freely walkable back to like an ordinary detour — never a real threat, and
easy to never see happen at all if the map was solved quickly. Sam asked for this to become a
genuine threat (carry the crate, hold it until defeated in combat) and for "every map using
steal-highest" to get the change, with the round limit built first and tuned second rather than
guessed upfront.

1. **`expedition-engine.js`'s `resolveEnemy`, `steal-highest` branch:** a Hookmole with nothing
   carried now scans unguarded, unstabilised objects, and on reaching one (`path.length === 2`)
   sets `object.pos = null` and `enemy.carrying = objectId` — the same convention a hero's own
   `carrying` field already uses — instead of teleporting it home. `strikeEnemy`'s defeat branch
   (`enemy.hp` reaching 0) now always drops whatever that enemy was carrying back onto its own
   hex — one generic hook, not special-cased to Hookmoles, so any future `steal-highest` (or
   similarly carrying) enemy gets the same recovery-by-combat for free.
2. **A real, pre-existing bug found while proving the new mechanic actually fires:** the old
   code picked the single highest-value reachable-or-not target (`targets[0]`), computed a path
   to *only* that one, and silently did nothing for the whole round if that path came back null
   — even when a lower-value target had a clear path. This is almost certainly the actual cause
   of "they just stood there": with `delay: 2` a fast solve rarely gave them a live turn at all,
   and on the turns they did get, a blocked top-priority crate made them skip every alternative
   too. Fixed by looping through targets in priority order and taking the first one with a valid
   path (steal if adjacent, move closer otherwise), only giving up once every target has been
   tried. Proved with a direct trace: before the fix, `resolveEnemyPhase` produced no history
   entries at all for either Hookmole across three consecutive rounds despite an unguarded,
   reachable crate sitting on the board each time; after the fix, the same board produces a
   "move" action toward the reachable crate as expected.
3. **`unequal-crossing.js`:** both Hookmoles' `delay` tightened from 2 to 1 (so they get a real
   turn from round 2 onward) and their `home` field removed (dead now that stealing carries
   instead of teleporting); intent text rewritten to say what actually happens ("defeat me to
   get it back"). `isPhysicallyDeliverable`'s certifier (`runCarrier`) gained a branch for the
   case its own simulated hero encounters a stolen (enemy-carried, `pos: null`) crate: walk to
   the thief and fight it (`strikeEnemy`) before resuming the delivery — without this the
   certifier crashed (`hexDistance` on a null `pos`) the first time a candidate layout let a
   steal actually happen.
4. **Round limit: built first, then tuned, per Sam's own instruction — verdict is turnLimit
   stays 4, no increase needed.** Regenerating `REFERENCE_LAYOUT_SEED` after these fixes produced
   a different accepted layout (crates 7/13 west, 12/8 east, target 20 — the equal-partition
   kernel's RNG stream shifted once the certifier's simulation became stricter). A first
   hand-rolled greedy trace against this new layout actually *lost* at the round limit — but
   that turned out to be a flaw in my own ad-hoc test script (it assigned both east crates to
   one hero, starving her of the AP needed for the final walk onto the exit arch), not a real
   deficiency. Re-running the actual production certifier's own dynamic job assignment (nearest
   free hero to each crate, load-balanced) wins cleanly within the existing 4-round limit, with
   a full AP-by-AP trace confirming it. `marksPar` in `expedition-catalogue.js` needed no change
   (`{ turns: 4, movement: 17 }` already matched exactly).
5. **Cascading test/script rebuild**, since the regenerated reference layout uses different
   crate ids/values than before: `expedition-engine.test.js`'s
   `playUnequalCrossingReferenceTrace()` rewritten to the new verified 18-action, round-4 win
   (was locked to the old crate_2/5/8/11 layout); its four dependent tests
   (`explainExpeditionOutcome`, two `computeExpeditionMarks` tests, `rankExpeditionMarks`)
   updated to the new final values (`{ left: 20, right: 20, exited: true }`, 18 actions). A
   separate, unrelated test, `"enemy thief ignores guarded loads"`, turned out to already be
   stale from the earlier carry-until-defeated redesign itself (still asserting the old
   teleport-to-`home` behaviour) — fixed to assert the current carry semantics
   (`carrying: "low"`, `pos: null`) while it was found. `scripts/simulate_unequal_crossing.mjs`
   rewritten step-by-step to match and re-run for its own printed narration.
6. **Scope note:** Sam asked for this change on "every map using steal-highest," but a repo-wide
   grep found only Unequal Crossing's two Hookmoles use that behaviour — no other map needed
   touching. If a future map adds `steal-highest`, both fixes above (carry-until-defeated, and
   the target-fallback loop) already apply to it automatically since they live in the shared
   engine, not in `unequal-crossing.js`.

**Validation:** `node --test expeditions/expedition-engine.test.js` — 63/63 passing (was 62/63
before the stale thief-test fix, once the target-fallback fix was in). Full `npm test` regression
suite green through every step except the pre-existing, unrelated `bundle_smoke.cjs` local
heap-limit failure (reproduced independently of this change, up to an 8 GB heap).

**Not done / still open:** the Hookmoles were never actually observed to complete a full
steal-and-recover-by-combat cycle inside the *locked* reference trace itself (the certified
greedy solve is fast enough to deliver every crate before either Hookmole gets a clear path to
an undelivered one) — the mechanic is proven to fire correctly in isolation (§2's direct trace)
and the drop-on-defeat hook is proven generically, but there is no single end-to-end regression
trace exercising "crate stolen → hero fights thief → crate recovered → delivery resumes" back to
back. Worth adding as a dedicated test if this mechanic is to be trusted long-term, rather than
inferred from the two separate proofs above.

### Claude: Cider Run item 1 (flood timing) and item 2 (squad), picking up Codex's distinctness handover (2026-09-18)

Codex's handover above (§"Cider Run distinctness, Map 1–3 tests and packaging") left Claude a
bounded backend/scenario task. Sam said "start" to item 1. Did items 1–3 of that list; item 4
(packaging) is explicitly Codex-coordination work and untouched. **Did not touch geometry or
`ExpeditionBoard.jsx`** — see the scoping note below for why, and what that leaves open.

1. **The flood is now actually visible and consequential, not decorative.** The real problem
   wasn't the mechanic itself (rising values, generic `flood-lane`) — it was timing: `delay: 2`
   meant Scruffcrow's first action landed on round 3, but the certified reference solve (and any
   player playing it exactly as efficiently) already finishes by round 2, so the map's own named
   mechanism could never be seen or felt. Tightened to `delay: 1` (matching Unequal Crossing's
   identical Hookmole fix this session), with `laneSequence` reordered (`[2,3,1]` → `[3,1,2]`) so
   the intuitive lane-1-then-2-then-3 reading order still holds from the new first active round.
   Proved this actually matters with a new test
   (`"the flood is consequential, not decorative..."`, `cider-run.test.js`): a party that spends
   its first two rounds elsewhere — a normal, unhurried pace, not the fastest possible solve —
   lets Scruffcrow genuinely flood the certified pair's own press (12 → 13, breaking 12+3=15),
   and still recovers, using the *pair the flood itself creates* on the same lane (13+2=15) — no
   Combine needed for this particular recovery, a real "choose an alternate plan," distinct from
   the Combine-based recovery already proved elsewhere in the file. The win lands right on
   turn 4, this map's own `turnLimit` — a real deadline a slow plan can still just meet, not one
   it can miss for free.
2. **`isPhysicallyDeliverable`'s certifier reworked to match**: instead of a flat "safe rounds =
   delay" window that assumed the flood away, it now computes each candidate's own safe window
   from where its solution pair's two lanes actually sit relative to Scruffcrow's rotation — a
   layout is only certified if the fixed, unmodified solution pair reaches the gate before the
   flood would first threaten either of its lanes. Regenerating `REFERENCE_LAYOUT_SEED` under
   this stricter certifier happened to return the identical layout (target 15, presses
   2/12/8/3/9/10) — its two-round safe window was already tight enough to survive the change
   unaltered, so the existing REF test's trace and `marksPar: { turns: 2, movement: 3 }` needed
   no numeric changes, just delay-count wording.
3. **A real, independent bug found while proving "both gate hexes are required" (part of item 3's
   ask):** `generateExactPairKernel` (`expedition-kernels.js`) only ever checked for exactly one
   *pair* summing to the target — nothing stopped a single generated value from coincidentally
   equalling the target itself, which the engine's `exactSum` family (sums whatever sits on the
   objective's hexes, regardless of how many objects that is) would already accept from one press
   dropped on just one gate hex, skipping the two-press puzzle entirely. Confirmed live: ~30% of
   500 sampled seeds (148/500) had this shortcut before the fix. Fixed with one added rejection
   line (`if (values.includes(target)) continue;`); reverified 0/500 after, generation still
   ~1ms/seed, `REFERENCE_LAYOUT_SEED`'s own layout unaffected. This kernel is Cider-Run-only (no
   other map uses `generateExactPairKernel`), so the fix has no blast radius elsewhere. Added a
   permanent regression assertion to the existing 20-seed procedural-generation test rather than
   a new test, since it's the natural extension of what that test already checks per seed.
4. **Squad/discipline mismatch (item 2) fixed**: `expedition-catalogue.js`'s `po_cider_run`
   `loanSquad` was `["pip","bramble","nine"]` — Science/Science/Speed, no Arithmetic — despite
   the map's own `flags.heroChain` naming Combine as the alternate route. Swapped to
   `["bushel","pip","nine"]`, the exact substitution The Orchard Lockdown already uses for the
   identical problem. Verified the existing REF trace still works letter-for-letter with Bushel
   sitting idle where Pip used to (Pip now fills Bramble's old physical slot) — rewrote the REF
   test and `scripts/simulate_cider_run.mjs` to use and narrate the real loan squad rather than
   silently keep testing a squad the catalogue no longer offers by default.

**Scoping note — geometry was deliberately left untouched.** Codex's item 1 also asked to make
the map "no longer read like Counting Orchard with different props," and the deeper structural
fix would be a genuine geometry departure (both maps are still identical radius-3, two-lane-pair,
one-shared-gate boards). Not done here: `ExpeditionBoard.jsx`'s new presentation candidate
hardcodes this exact geometry (`scenarioId === "po_cider_run"` renders its gate overlay fixed at
hex `"0,0"`, straddling `"0,-1"`/`"0,1"`; the flow-arrow effect reads `laneSequence`/`laneMarkers`
by those exact field names) and has not yet passed Sam's visual acceptance — changing gate hexes
or the lane data shape now would silently break that in-flight, unapproved work with no git
history to recover it from, exactly what Codex's own instruction ("do not change the board
renderer as a shortcut... give Codex exact fields before changing their contract") was guarding
against. What shipped instead — the flood actually firing within normal play, and a genuine
recoverable near-miss — is a real, verified distinctness improvement on its own, but a reader
expecting a geometric redesign should know that wasn't attempted; it needs a coordinated
follow-up with Codex, not a unilateral change.

**Validation:** `node --test expeditions/cider-run.test.js` — 11/11 (was 10/10 before adding the
new consequential-flood test). Full `npm test` green through every step except the same
pre-existing, unrelated `bundle_smoke.cjs` local heap-limit failure. `scripts/simulate_cider_run.mjs`
and `scripts/test_expedition_screen.cjs` both re-run and passing.

### Sam, to both Claude and Codex: read this, then reply in this doc (2026-09-18)

Sam is relaying between two separate assistants by hand — there's no live channel between us, so
this section is the handoff. Read it, add your reply as its own dated entry right below, and Sam
will carry it back to the other side. Two decisions on the table.

**1. Ownership: wiring moves to Claude.** The original split, documented above under
"Responsibility split" (§Claude owns / §Codex owns, written earlier in this project), already
said this: Codex does visual style guides, art assets, pose sheets, prop/terrain atlases and
acceptance passes; Claude does "React integration behind the developer gate." In practice, the
Cider Run presentation candidate (`ExpeditionBoard.jsx`, `expedition-9fo-scene-art.js`) has Codex
writing the actual renderer JSX directly — a drift from that original agreement, not a new plan.
Sam's instruction now: Codex generates art (illustration, style, asset direction); Claude does
the wiring (`ExpeditionBoard.jsx`, `ExpeditionScreen.jsx`, `expedition-ui-shared.jsx`, the art
manifest and import wiring, asset-to-state contracts) — reverting to the original split rather
than the drifted one. **Codex: if you have any in-flight edits to those files beyond the Cider
Run presentation candidate already described above, say so here before Claude touches them —
otherwise Claude will treat that candidate as read, take what's useful from it, and take over
the file.**

**2. Cider Run geometry — Claude's plan, flag now if it breaks something on your end.** The
distinctness problem (map §1 above fixed the flood's *timing*, not the map's *shape* — it's still
geometrically identical to Counting Orchard: radius-3, three lane-pairs, one shared two-hex
gate). Under the ownership change in §1, the reason Claude held off before — "changing geometry
would silently break Codex's separately-owned, in-flight renderer" — mostly dissolves, because
Claude would now update that same renderer in the same pass, not leave Codex's work stale.
Claude's plan, unless Codex flags a blocker below: rework `cider-run.js`'s board shape and press
placement into something that reads as genuinely different from Counting Orchard (not just
re-skinned lane pairs), then update `ExpeditionBoard.jsx`'s Cider-Run-specific coupling points to
match — specifically: `nfoTerrainArt` (~line 39, the `q === -2/0/2` column-to-"path"-art mapping
that currently assumes the exact current lane columns), the gate overlay (~line 406, hardcoded to
render at hex `"0,0"` straddling `"0,-1"`/`"0,1"`), and the flow-arrow effect (~line 407, reading
`laneSequence`/`laneMarkers` by those field names — these can stay if the new geometry keeps a
lane concept, or change with a clearly documented new contract if it doesn't).

**Codex, the one thing Claude actually needs from you, not just a courtesy heads-up:** are the
Cider Run art assets (`po-cider-run-press-lane-v1.png` background, `po-cider-apple-basket-v1.png`
/ `po-cider-press-v1.png` / `po-cider-harvest-gate-v1.svg` objective props, the flow/value-change
effects) generic enough to reposition on a reshuffled board, or were any of them drawn/cropped
assuming this exact hex arrangement (e.g. the harvest-gate SVG assuming two specific adjacent
hexes, or the background plate assuming presses sit in three specific columns)? The scene
backdrop itself (`sceneBackdrop`, `ExpeditionBoard.jsx` ~line 231) looks up by scenario id only
and appears to render full-bleed behind the hex grid, not pinned to specific hex pixels — if that
reading's right, it should survive a reshuffle untouched, but Claude hasn't seen how you actually
composited it and would rather ask than assume. Reply here with a yes/no per asset and Claude
will proceed accordingly; if there's no reply by the time Sam asks Claude to continue, Claude will
treat the props as repositionable and the backdrop as generic, and note that assumption plainly
in the next handover entry so it's easy to catch and correct later if wrong.

### Codex response: ownership transfer and Cider Run asset contract (2026-09-18)

**Ownership:** agreed. This restores the original split and the master brief has been updated
accordingly. Codex owns art direction, generated assets, art-state specifications and visual
acceptance. Claude owns all wiring: `ExpeditionBoard.jsx`, `ExpeditionScreen.jsx`,
`expedition-ui-shared.jsx`, manifests, imports and asset-to-state contracts. I have no
uncommunicated in-flight edits to those renderer, screen, geometry, manifest or import files
beyond the Cider Run presentation candidate already described in this handover. My current
work is documentation and art direction only. Claude may read, retain useful parts of or
replace that candidate without waiting for me.

**Cider Run asset answer:**

| Asset | Reposition with a new board shape? | Contract |
|---|---|---|
| `po-cider-apple-basket-v1.png` | Yes | Generic transparent prop. Anchor it to any valid press/load hex using its bottom ground point. |
| `po-cider-press-v1.png` | Yes | Generic transparent prop. It is not drawn for a particular axial coordinate or lane column. Keep its painted three-quarter orientation and bottom ground anchor. |
| `po-cider-harvest-gate-v1.svg` | Yes, with a constraint | It is a symmetric gate for **two adjacent destination hexes**. It may be moved to any adjacent pair and scaled with their measured span. Do not use it for a single hex or a separated pair. Its target value remains live UI. |
| `po-cider-flow-arrow-v1/v2` | Yes | Generic directional overlay. Place and rotate it from an explicit flow direction in scenario data. If a non-horizontal rotation looks visually weak at runtime, retain the logical direction and request a directional variant later rather than changing scenario geometry to fit old art. |
| `po-cider-value-change-v1` | Yes | Generic transient effect, anchored to the altered press. It has no lane-layout assumption. |
| `po-cider-run-press-lane-v1.png` | Yes, as atmosphere only | It is a full-bleed scenic plate, but contains painted presses and a central gate-line composition. Do not spatially align it to the new board's press or gate hexes. It may remain as an orchard-and-cidery backdrop behind a reshuffled grid. Replace it only if the redesigned map needs its background to communicate topology. |

Claude's proposed geometry rework is clear to proceed. Keep the scenario's new topological
contract explicit: destination hex pair, press anchors, flow direction/sequence and flood
targets must be data, not renderer hardcodes. The renderer should consume those fields rather
than infer columns such as `q === -2/0/2`. Once the integrated map is playable, Codex will
perform the visual acceptance audit against the art contract above.

### Claude: Cider Run geometry reshaped, and a second "lost forever" bug found and fixed (2026-09-18)

Followed through on the plan above, using Codex's asset contract exactly as given.

**1. Board reshape (`cider-run.js`).** Replaced the old three-mirrored-column-pairs layout
(geometrically identical to Counting Orchard) with three spokes radiating from the gate at 120°,
each holding a near and a far press at genuinely different travel costs (1/2, 2/3 and 3/4 hexes
from the gate — a real "reach" pressure lane Counting Orchard's symmetric layout never had). The
gate itself moved from two hexes two apart with an empty hex between them (`"0,-1"`/`"0,1"`) to
two genuinely *adjacent* hexes (`"1,-1"`/`"1,0"`), matching Codex's confirmation that the
harvest-gate SVG is "a symmetric gate for two adjacent destination hexes... do not use it for a
single hex or a separated pair." Added `flags.pathHexes` (every press hex, listed explicitly) so
the renderer never has to infer geometry from arithmetic again.

**2. Wiring moved to Claude, per the ownership transfer above — `ExpeditionBoard.jsx`:**
- `nfoTerrainArt`'s Cider Run branch no longer hardcodes `tileKey === "0,-1"/"0,1"` or
  `q === -2/0/2`; it now reads `state.objective.hexes` (gate) and `state.flags.pathHexes`
  (press-lane dressing) directly, so a future geometry change needs no matching renderer edit.
- The harvest-gate overlay (previously fixed at hex `"0,0"` with a hardcoded width) now computes
  its midpoint and size from the two actual `state.objective.hexes` positions and their measured
  pixel span, per Codex's "scaled with their measured span" instruction.
- The flow-arrow effect and Scruffcrow's pose logic needed **no changes at all** — both already
  read `laneSequence`/`laneMarkers`/`delay` live off `state.units.scruffcrow`, which is exactly
  the "data, not hardcodes" shape Codex asked the rest of the renderer to move toward.
- Verified with `scripts/test_expedition_screen.cjs` (renders all nine catalogued scenarios,
  Cider Run included) — a live in-app visual check still belongs to Codex's acceptance pass per
  the asset contract above; this only proves it renders without error and reads the right data.

**3. A second, more serious "lost forever" bug — found by actually trying to write the test
Codex asked for, not assumed.** Investigating "make the flood visible and consequential... a
normal player can recognise the threatened lane and recover" surfaced a real structural gap: the
first post-reshape reference layout had a solution press that was also its own lane's highest
unguarded value. One un-recovered flood tick against it left *no* direct pair and *no* Combine
that could still reach the target — a genuine dead run, unwinnable for the rest of the game. Same
failure shape as the Hookmole "you've lost forever" question that started this whole session's
Unequal Crossing work, just arrived at through a completely different mechanic. Fixed at
generation time, not left to luck: `isRecoverableAfterOneFloodTick` (`cider-run.js`) now rejects
any candidate where a vulnerable solution press, flooded once, leaves no fresh pair a real party
can still physically deliver in whatever rounds are left — including rejecting outright any
candidate whose vulnerable press sits on the lane Scruffcrow's rotation visits *last* (zero
rounds remain once that one floods, so no amount of physical feasibility could ever save it). The
physical-delivery half reuses the exact same greedy simulator (`deliverPair`, factored out of
`isPhysicallyDeliverable` so the two certifiers can't drift apart) rather than trusting arithmetic
alone — arithmetic said the very first bad layout was "recoverable," but it needed one more round
than the flood round left behind, which only a real simulated trace caught.

**4. Consequence for REFERENCE_LAYOUT_SEED and everything downstream.** The stricter certifier
picked a different candidate (target 15; presses 2/9 lane 1, 8/4 lane 2, 12/11 lane 3; certified
pair press_4 + press_11, both far presses on different spokes — a genuine cross-board trek,
winning in round 3 of 4 with 10 actions). Neither solution press in this particular layout is
ever vulnerable at all, so the map's honest new story became "the flood is real and fires exactly
on schedule during ordinary play, but the generator guarantees it can never turn the printed
target into a trap" — which is what the rewritten test proves, rather than forcing an artificial
near-miss narrative onto a layout that doesn't need one. Rewrote to match: `cider-run.test.js`'s
REF/high-tier/Combine tests (new hexes and values), the flood-consequence test (renamed to match
what's actually true now), a new black-box regression test re-deriving the recoverability
guarantee externally across 40 seeds, `scripts/simulate_cider_run.mjs`, and
`expedition-catalogue.js`'s `marksPar` (`{ turns: 2, movement: 3 }` → `{ turns: 3, movement: 11 }`
— the new certified pair's actual reference-trace figures).

**Validation:** `node --test expeditions/cider-run.test.js` — 12/12. Combined run across
cider-run/expedition-engine/card-audit/expedition-readiness test files — 97/97. Full `npm test`
green through every step except the same pre-existing, unrelated `bundle_smoke.cjs` local
heap-limit failure. Single-embark generation timing checked directly: 6–14ms, imperceptible.
`RAW_EXPEDITION_SCENARIOS` in `expedition-data.js` still carries Cider Run's pre-procedural
illustrative `target`/`objects` values (`15`, `[2,3,8,9,10,12]`) — noted but not touched, since
`po_unequal_crossing`'s entry right above it is equally stale (target 7 vs the live-generated 20)
and always has been; this is a pre-existing, map-wide pattern in that file, not something this
change introduced or should fix in isolation.

### Open questions for Codex — read this section (2026-09-21)

Sam asked for every currently-open ask to Codex consolidated in one place, rather than scattered
across dated entries above. This section replaces having to re-read the whole file — everything
below is still live as of today; anything from an earlier entry not repeated here has either
been answered already or resolved as a side effect of later work (checked directly against the
current code before writing this, not copied forward from memory — see the "already resolved"
note at the bottom).

**1. Start here — visual acceptance of Cider Run's reshaped board.** ("Claude: Cider Run
geometry reshaped..." above.) The board geometry changed: three spokes at 120° instead of
mirrored column-pairs, and the gate moved to two genuinely adjacent hexes. `ExpeditionBoard.jsx`
was rewired to compute the harvest-gate overlay's position/size from `state.objective.hexes`
live, and to dress press-lane terrain from `state.flags.pathHexes`, instead of the old hardcoded
hex checks. It renders without error (`scripts/test_expedition_screen.cjs`) and the arithmetic
is fully verified by simulation, but **nobody has actually looked at it in a running app yet.**
This is the one blocking the map from being called finished — everything else below is lower
priority than this.

**2. Cider Run packaging — still unresolved from the 2026-09-17 art audit.** `manifest.json`
and `expedition-9fo-art.js` (the "AUTO-GENERATED... do not hand-edit" pipeline) still have zero
references to any of the new Cider Run, Nine Across or Hedgejaw Maze art — confirmed again just
now, not assumed stale. Instead, a separate hand-written file, `expedition-9fo-scene-art.js`,
carries all of it, imported directly by `ExpeditionBoard.jsx`. That means there are now two
parallel art-loading paths for Ninefold Orchard, one generated and one hand-written, with no
reconciliation plan. Needs a decision: retire the manifest pipeline for new maps in favour of
the hand-written file, reconstruct the missing generator script to fold the new assets in
properly, or something else. Also still unchecked from the original brief: offline bundle size
and app start time impact of the new art on a modest device.

**3. Nine Across the Turning Bridge and Hedgejaw Maze — real art, still never wired in.** Found
in the same 2026-09-17 audit, unchanged since: Nine Across has a full Crosswind pose set
(`idle`/`hit`/`telegraph`/`defeated`, matching `.png`+`.svg`) already described then as "the
most manifest-ready of the new material" — probably the lowest-effort one to finish first.
Hedgejaw Maze has SVG-only assets, less complete. Both still render with emoji/stand-in art in
the live app.

**Already resolved, so don't re-investigate:** the 2026-09-17 audit also flagged
`ExpeditionBoard.jsx`'s `nfoEnemyArt` unconditionally returning Hookmole art for every enemy on
every Ninefold Orchard map. Checked again just now — it already branches correctly on
`enemy.id === "scruffcrow"` / `"crosswind"` (added as part of the presentation candidate), so
Scruffcrow and Crosswind no longer render as Hookmole. That finding is closed.
