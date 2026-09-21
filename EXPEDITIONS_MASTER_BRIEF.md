# Wallaby Maths Expeditions: master brief

This is the single entry point for any new chat, agent or contributor working on Expeditions.
Read this file first. It records the current product decisions, identifies the authoritative
documents and prevents earlier prototype material being mistaken for approved direction.

## Product boundary

- Expeditions is a short, graphical tactical puzzle mode using collected cards on a pointy-top
  hex board. It is not Joey and does not replace Adventures.
- Adventures remain the story-led card-upgrade route. Joey remains the deck game.
- Expeditions is private development work. Only the exact `eudaimon` profile with the Rooke
  avatar may see or enter it. Do not generalise, remove or weaken this gate.
- First clear gives a small recognition reward. A replayed clear now also gives a small,
  capped-by-design reward (see `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8.6). Expeditions
  remains a light reward stream, not a card-pack farming shortcut.
- All work remains offline, deterministic where possible, plain JS/JSX and bundled into the
  existing app.

## Current creative direction

The old “move, pick up and drop” prototype is not the product target. Expeditions must feel
like a short tactics-game episode: a dramatic situation, changing battlefield rule, embedded
maths system, meaningful card choices and a decisive final turn.

The current player-facing source of truth is:

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

| Area | Owner | Boundary |
|---|---|---|
| Art direction, asset generation, style guides, pose sheets, atlases and visual acceptance | Codex art task | Does not alter engine state, persistence, render wiring or dispatch contracts |
| Rules engine, scenario data, procedural generation, solvers, persistence, tests and all render wiring | Claude | Wires the board renderer, UI, asset manifest/imports and asset-to-state contracts without changing approved art direction or release gating |
| Product decisions and source-of-truth maintenance | This project-management task | Records decisions in the handover and master brief |

Claude owns `ExpeditionBoard.jsx`, `ExpeditionScreen.jsx`, presentation geometry,
`expedition-ui-shared.jsx`, asset manifests and import wiring. Codex supplies assets and an
art-state brief, then audits the integrated result. Shared-file work still requires a handover
note with exact files, boundary and validation command.

## Development state

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
