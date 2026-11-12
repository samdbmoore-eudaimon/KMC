# Wallaby Maths Expeditions: master brief

This is the single entry point for any new chat, agent or contributor working on Expeditions.
Read this file first. It records the current product decisions, identifies the authoritative
documents and prevents earlier prototype material being mistaken for approved direction.

4 October overnight objective: Sam explicitly requires finishing the whole Ninefold Orchard Expeditions package, all five families/25tiers, all art and UX, and real playtesting. Proper painted buttons/frames and original character portraits in the round team-frame area with separate properly sized name/text boxes are priority acceptance items. `Overnight handoff notes polling` names Claude's chat, not a schedule. See [current overnight packet](docs/expeditions/v2/reports/scrum-overnight-handoff-20261004.md) for66%Claude/34%Codex coding and all-Codex-art ownership. Only after Orchard is fully finished/reviewed and credits remain, Sam additionally authorises a full Little Reckoning Expeditions build plan and implementation of new games/challenges/art. Prior LR deferral below is superseded solely by that conditional instruction; preserve all existing private gates and legacy functionality.

5 October scope correction from Sam: one representative real browser playtest per family/type is enough. Existing evidence covers all five families, so stop tier-by-tier and exhaustive viewport/team browser playtesting. All five families/25 tiers still require implementation and automated puzzle/rules/procedural-bank certification with correct stat/card gates. Use small targeted checks only for concrete new changes or defects. Historical browser evidence is preserved; incomplete coverage is no longer a completion blocker. Genuine device/child limitations remain honest. This supersedes earlier all-tier browser playtesting instructions.

## Product boundary

RavineT5 update5October: Claude Batch11 reports Sam delegated the geometry decision, implemented four-track/one-long-track T5 with stronger operands/multiplication, continuous strike window and two hazards, and replayed direct/alcove wins on hedges seed1. Earlier unbuilt-T5 notes are superseded. Include the implemented T5 in the private main-app integration; retain the explicit specification deviation and truthful bank-certification status.

5 October human access instruction: Sam says "put it all in the main app" after learning that the five types were playable in isolated previews. Integrate all implemented family/tier candidates into the actual main app's existing private eudaimon/Rooke Expeditions area for his playtest. This authorises truthful private development availability before full bank certification; preserve the certified Four Locks path, all original saves/versioned repair, normal rules and legacy functions. Do not label uncertified banks certified or invent unavailable RavineT5 content. Claude owns App/generation/runtime integration and the exclusive final build; Codex UI supports its contracts. A separate test launcher no longer satisfies the user request.

- Expeditions is a short, graphical tactical puzzle mode using collected cards on a pointy-top
  hex board. It is not Joey and does not replace Adventures.
- Adventures remain the story-led card-upgrade route. Joey remains the deck game.
- Expeditions is private development work. Only the exact `eudaimon` profile with the Rooke
  avatar may see or enter it. Do not generalise, remove or weaken this gate.
- Orchard v2 awards three stars on each first family/tier clear and zero on replays, as
  specified in the current handoff below. Older replay rewards in
  `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8.6 apply only to the legacy design.
- All work remains offline, deterministic where possible, plain JS/JSX and bundled into the
  existing app.

## Current Orchard implementation handoff: 1 October 2026

Sam now requests a complete Ninefold Orchard-first specification and agent handoff. The
current proposed implementation baseline is the v1.0 package:

1. `EXPEDITIONS_9FO_IMPLEMENTATION_SPEC.md`: unified Orchard v2 rules, all actions, hands,
   combat, player feedback, viewport, command ABI and atomic tier rewards.
2. `EXPEDITIONS_9FO_GENERATION_SPEC.md`: exact procedural topology, five distinct puzzle
   generators, enemies/hazards, tier ladders and certified seed-bank requirements.
3. `EXPEDITIONS_9FO_DELIVERY_BOARD.md`: Codex/Claude tasks, owned files, dependencies,
   shared completion/review reports and decision log.
4. `EXPEDITIONS_9FO_ART_REQUEST.md`: existing-art reuse, missing overlays/plinths, asset
   metadata and visual acceptance; Codex owns all artwork and v2 render wiring.

Coordination revision1.1 established approximately65% Codex and35%
Claude by estimated build effort. Codex owns artwork, puzzles, procedural generation, v2 UI,
art integration and certification tooling/banks. Claude owns the core rules/phase engine,
App route adapter, persistence, rewards and final shared build integration. The delivery
board records exact files, dependency gates and the effort ledger.
Latest overnight revision1.2 transfers4 points of tactical-planner work to Claude, making
the estimate61/39. Read EXPEDITIONS_9FO_OVERNIGHT_HANDOFF.md for the planner interfaces,
extra Claude integration tests, shared mailbox and full-build lock. All artwork stays Codex. This supersedes the
older Codex-art-only boundary for explicitly assigned v2 files; legacy ownership remains.

This package supersedes older Orchard numerical examples, ten-map priorities and conflicting
combat/reward defaults. It is a design baseline for implementation, not an implemented or
released game. The accepted square Sudoku mechanism panel remains; equation rotation uses
six-sector overlays directly on battlefield hexes, with six numbers or =,+,−,×,÷,blank.

The five Orchard families have five tiers each. Stronger printed-card capabilities are
mandatory through three simultaneous mission-specific jobs, with a fixed alternative alcove
that avoids compulsory named Epics. All five stats have universal useful moves. v2 uses
three stars per first family/tier clear, zero replay stars and no new module-set bonus;
legacy awards remain. Art and private access gates remain binding. LR/GF retain existing
rules until separately designed; the wider minimum remains fifteen puzzle types, five per
module, with thirty a stretch target. No implementation agents have been externally
dispatched by creating this package.

## Current creative direction

The old “move, pick up and drop” prototype is not the product target. Expeditions must feel
like a short tactics-game episode: a dramatic situation, changing battlefield rule, embedded
maths system, meaningful card choices and a decisive final turn.

The earlier cross-module experience references are:

1. `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md`: scenario philosophy, pressure lanes, combat,
   hero chains, rotation hexes, Hive Ledger deduction boards and rebuilt 30-map pitches.
2. `EXPEDITIONS_SCENARIO_ART_MATRIX.md`: the assigned art, props, enemies, mechanism states
   and effects for every individual scenario.
3. `EXPEDITIONS_CARD_COMBAT_CONTRACT.md`: exactly how card statistics, visible checks,
   combat, rarity readiness and player explanations work.

The older module route documents preserve curriculum sequence and implementation constraints:

- `EXPEDITIONS_NINEFOLD_ROUTE.md`
- `EXPEDITIONS_LITTLE_RECKONING_ROUTE.md`
- `EXPEDITIONS_GIFFORD_ROUTE.md`

Where an older route's individual scenario description conflicts with the experience brief or
art matrix, the experience brief and art matrix win.

## Card stats and combat in one page

The formulas below describe the earlier cross-module prototype. New Orchard v2 development
uses the unified formulas/actions in the implementation handoff above; do not combine them.

Every scenario uses two to four visible pressure lanes: Reach, Shape, Truth, Change, Number
and Threat. Cards matter because their printed values and identity answer different lanes.

```text
Move       = min(4, 2 + floor(Speed / 4))
Hearts     = min(5, 2 + floor((Geometry + Science) / 7))
Initiative = 12 - Speed

Strike power = named governing stat + adjacent support + shown bonuses
below Defence: 0 impact; meets Defence: 1; 4+ above: 2
```

Visible checks are deterministic: named statistic plus shown support/bonus against a printed
difficulty. No dice, hidden thresholds or surprise modifiers. Rarity and battle value are
advisory collection readiness, not permission gates. Late maps should make a full Epic party
practically necessary through simultaneous jobs, fixed enemy pressure and specialist checks,
not through a locked Embark button.

## Module scale

| Module | Audience | Mathematical language | Tactical escalation |
|---|---|---|---|
| Ninefold Orchard | 8–11 | Whole numbers, exact totals, shapes, simple parity and 1–7 deduction | Fully visible intent, 3 heroes, physical systems and playful set-pieces |
| Little Reckoning | 10–13 | Negatives, fractions, ratios, bounds, operation order and linked constraints | 3 heroes, conditional information, reversals and interacting rules |
| Gifford | 12–16 | Algebra, inequalities, percentages, weighted graphs, optimisation and minimax | Usually 4 heroes, conditional opposition, multi-system planning and meaningful trade-offs |

## Visual non-negotiables

- Use a genuine measured pointy-top hex projection. For side length `s`: width `sqrt(3)s`,
  height `2s`, horizontal centre spacing `sqrt(3)s`, vertical spacing `1.5s`, alternate-row
  offset `sqrt(3)s/2`.
- Faux depth is visual only. It must not change a tile centre, hit polygon, neighbour relation
  or unit/prop ground anchor.
- The board dominates the screen. Use a compact HUD and contextual bottom controls. Detailed
  party and objective information belongs in accessible drawers, not permanent rails that
  squeeze the board.
- The supplied Ninefold Orchard mock-ups are the visual target. The prototype screen is not.
- No rectangular CSS tile-state highlights. Use geometry-conforming overlay masks.
- No generated art is imported before alpha preflight on white, black, orchard-green and cyan
  backgrounds, recorded bounds/anchors and runtime size review.

See `EXPEDITIONS_VISUAL_ACCEPTANCE.md` for the full visual acceptance gate and
`EXPEDITIONS_ART_PIPELINE.md` for asset-production standards.

## Ownership and coordination

For Orchard v2, the current delivery board's coordination revision1.2 takes precedence:

| Area | Owner | Boundary |
|---|---|---|
| All artwork, v2 puzzles/solvers/hints, generation/family data, v2 UI/art wiring and certification tooling | Codex: approximately61% | Does not edit Claude's core engine, App/progress or legacy shared files |
| v2 schemas/core actions/preview/replay, enemies/hazards/commissioning, Undo, App adapter, save/reward integration and C-08A tactical planner | Claude: approximately39% | Does not edit Codex's puzzle/generator/UI/art files |
| Product decisions and source-of-truth maintenance | Codex scrum/product | Maintains decisions, effort estimates and acceptance reports |

The existing legacy ExpeditionBoard.jsx, ExpeditionScreen.jsx, expedition-ui-shared.jsx
and legacy registries retain their previous Claude ownership. Codex owns the new v2 UI and
v2 art registries. Claude owns existing shared App/catalogue/progress integration files.
Shared-file work requires an explicit claim/transfer, exact boundary and validation evidence.

## Development state

### Orchard redesign review: 1 October 2026

Sam has asked for deeper tactical play, embedded maths puzzles, meaningful printed stats,
hero ability hands and missions around five minutes for familiar players. The small Storm
Mill example was rejected. The larger Four Locks example received positive feedback;
its numerical rules are still provisional and must be reconciled with the older combat
contract before implementation.

`EXPEDITIONS_ASSET_AUDIT_2026_10_01.md` records the current asset inventory and reuse issues.
`EXPEDITIONS_TEN_MISSION_PROPOSAL.md` proposes ten distinct Orchard mission families,
five difficulty tiers each and five core families as the first delivery wave. It is a design
proposal, not an approved implementation specification or a completed scenario set.

Sam has selected a fixed number of stars as the prize credit for clearing a new difficulty.
The proposed amount is three stars for the first clear of each mission/tier; the amount,
replay rewards and interaction with the existing module-set reward still need the final
progression decision. No new reward code or public access has been authorised here.

Sam's subsequent clarification is recorded in `EXPEDITIONS_STATS_ROTATION_AND_FEEDBACK.md`:
rotation must include numbers/operators completing coupled equations; harder tiers must
need stronger feasible card teams; every printed stat must have consequential applications
for every hero; briefings, previews, combat results and enemy changes must explain causes
and consequences. This supplement overrides weaker advisory-progression wording in the
older proposals. Numerical rules remain draft pending the unified implementation contract.

Sam then set a minimum of fifteen genuinely different puzzle types, at least five in each
module, with thirty as a stretch target. Difficulty variants or different artwork do not
count as additional types. `EXPEDITIONS_PUZZLE_PORTFOLIO_AND_MAP_VIEW.md` is the current
portfolio entry point and supersedes Orchard-first ten-family delivery priorities. It
proposes five core types per module and fifteen reserve types. The mathematical selection
is for review; it is not a claim of completed generators. The board must support a pannable,
zoomable viewport with off-screen objective/threat navigation and readable controls.

- The engine has proof maps and tests, but the player-facing board is not visually accepted.
- The board's correct hex geometry is a presentation requirement, not an excuse to change
  engine axial coordinates.
- New engine work should follow the delegated backlog in `EXPEDITIONS_CLAUDE_HANDOVER.md`:
  visible checks, card capability audit, scenario solvers, procedural validation and
  experience-brief alignment.
- Do not claim any scenario is finished because its evaluator returns true. It needs a
  reference trace, target and under-recommended squad evidence, stated pressure lanes,
  accessibility copy and assigned art row.

## Reading order by task

| Task | Read after this master brief |
|---|---|
| Product or scenario design | Experience/art brief, card/combat contract, relevant module route |
| Art request or board presentation | Scenario art matrix, visual acceptance, art pipeline, art handover |
| Engine, scenario implementation or tests | Claude handover, card/combat contract, experience/art brief, relevant route |
| Card balance or roster issue | Card audit, roster, card/combat contract |
| Geometry or interaction UI | Visual acceptance, Claude handover's active boundary, art handover |

## Full document register

| Document | Role |
|---|---|
| `EXPEDITIONS_BUILD_BRIEF.md` | Original high-level product and collection progression brief. Read with this master brief because some early scenario wording is superseded. |
| `EXPEDITIONS_SPEC.md` | Rules-engine reference, objective families and data architecture. |
| `EXPEDITIONS_CLAUDE_HANDOVER.md` | Engineering backlog, decisions, active shared-file boundaries and test history. |
| `EXPEDITIONS_CARD_COMBAT_CONTRACT.md` | Card-stat, check and combat contract. |
| `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` | Current scenario experience direction. |
| `EXPEDITIONS_SCENARIO_ART_MATRIX.md` | Per-scenario production art assignment. |
| `EXPEDITIONS_*_ROUTE.md` | Module curriculum sequence and map implementation detail. |
| `EXPEDITIONS_ART_PIPELINE.md` | Asset method, alpha and production rules. |
| `EXPEDITIONS_ART_HANDOVER.md` | Current asset package and manifest handover. |
| `EXPEDITIONS_VISUAL_ACCEPTANCE.md` | Board visual acceptance tests and geometry requirements. |
| `EXPEDITIONS_CARD_AUDIT.md` | Real collection capability audit. |
| `EXPEDITIONS_ROSTER.md` | Human-readable card role/stat snapshot. |
| `EXPEDITIONS_MOCKUPS.md` | Reference mock-ups, not runtime assets. |
| `EXPEDITIONS_ART_PROMPTS.md` | Historical prompt register, not an automatic generation queue. |
| `EXPEDITIONS_SCALE_CLAUDE_PROMPT.md` | Historical decision record for the earlier scale redesign. |

If documents conflict, use this order: explicit later user decision recorded in the Claude
handover, this master brief, experience/art brief, card/combat contract, visual acceptance,
then the older build brief, specification and route details. Stop and record unresolved
conflicts instead of silently choosing one.

## Dedicated station art handoff:2 October2026

EXPEDITIONS_9FO_STATION_ART_HANDOFF.md is the current asset-only audit/production packet for a separate Codex art chat Sam will start. It covers a full9fo required-object/state audit and prioritises ledger control, ledger bus, bridge brace, tree maintenance and prepared alcove artwork. The previous ASSET-03 screenshot prerequisite is superseded for these confirmed missing renderer identities. Exclusive station-art-batch paths avoid conflicts; the existing builder retains UI/global art integration. Do not infer that a new chat is running merely from this packet.
