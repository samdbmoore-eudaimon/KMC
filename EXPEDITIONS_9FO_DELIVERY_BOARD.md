# Orchard v2: shared scrum board and agent handoff

Rules baseline 1.0; coordination revision 1.2, 1 October 2026. This is the shared coordination document for Codex and Claude. Product owner/scrum master: this Codex planning task. No external agent has been dispatched by writing these instructions. The user can hand the packets to both agents. Start development only against the same baseline version.

## 1. Ownership and writing discipline

4 October overnight revision: Sam now provides Claude's twenty-minute `overnight handoff notes polling` and requests new separate Codex art/coding chats, with this chat supervising. Remaining coding effort targets66% Claude/34% Codex; all art stays Codex outside this ratio. Exact file boundaries, staged release of the active Turning Ravine builder and first ready tasks are in [scrum-overnight-handoff-20261004.md](docs/expeditions/v2/reports/scrum-overnight-handoff-20261004.md). This supersedes prior ownership allocations only for remaining work after its current owner's stable handoff; no active claim is stolen.

3 October2026 recovery override: Sam explicitly transfers approximately65% of the rejected-playthrough recovery to Claude. Exact temporary file ownership and acceptance checks are in [codex-playthrough-recovery-20261003.md](docs/expeditions/v2/reports/codex-playthrough-recovery-20261003.md). Claude owned the named instructional/movement UI and Four Locks bridge/hedge generator repairs for this task; Codex owned map/art placement and on-demand station inspection. Sam subsequently authorised builder takeover after Claude's stable handoff. The repaired private development gate is reviewed in [scrum-QA-01-recovery-review-20261003.md](docs/expeditions/v2/reports/scrum-QA-01-recovery-review-20261003.md); human/device acceptance remains open.

Later3 October2026 extension: Sam requests more Claude work and separates scrum from the builder. [codex-builder-transfer-20261003.md](docs/expeditions/v2/reports/codex-builder-transfer-20261003.md) transfers setup/role explanations and independent recovery acceptance to Claude, approximately75/25 of remaining recovery effort. Dedicated Codex builder `01a100e6-b8f7-7a73-97c8-afa8455b7120` resumes the existing visual source changes and checks; this original chat now coordinates only.

The original65/35 build allocation is now approximately **61% Codex /39% Claude** after Sam authorised extra Claude work overnight. This transfers4 points for the tactical planner; all artwork remains with Codex. Allocation is measured by estimated effort, not file count. All artwork remains Codex-owned. Each task's estimate includes its own tests, defect correction and evidence. Shared final acceptance and product management are outside the 100-point build estimate.

| Owner | Writes | Does not write |
|---|---|---|
| Codex build/art: 61 points | All artwork; v2 puzzle validators/solvers/hints; procedural layouts/family data; v2 React UI and viewport; selected v2 art manifests/imports; bank/diversity tooling and UI/visual evidence; tactical planner is Claude-owned | Claude's core engine files, App/progress integration, legacy shared components or registries without an explicit transfer |
| Claude core/integration/planner: 39 points | v2 schemas/constants/profile; pure actions/combat/preview/replay; enemies/hazards/commissioning/Undo; App route adapter, saves/rewards/migration and final shared build integration; C-08A tactical planner | Codex puzzle/generator/UI/art files, generated bitmap art, unrelated curriculum or subscription gates |
| Codex scrum/product | Baseline documents, decision log, priorities and acceptance review | Concurrent unclaimed changes to either agent's production files |

Publish the C-01 interface contract before parallel work. Neither agent broadens ownership by importing the other's module. Propose cross-boundary fixes in a report; the owning agent applies them. Historical art-only Codex boundaries are superseded for these explicitly assigned v2 files.

Plain JS/JSX, no TypeScript, UK English, no runtime AI/server. Preserve the exact gate and single offline HTML/Capacitor build. Never reset another agent's edits. Inspect dirty state before work; do not use “clean checkout” commands to erase existing files.

One writer per file at a time. Agents edit their own report file under `docs/expeditions/v2/reports/` and propose board status in the completion record; the scrum master merges status rows and decisions, avoiding simultaneous edits to this board. If the board is handed off without a running scrum master, append one report file and leave a concise board-link note; do not overwrite another report.

Task states: WAITING → READY → CLAIMED → IN_PROGRESS → REVIEW → ACCEPTED. BLOCKED includes specific evidence and dependency; tests green is REVIEW, not ACCEPTED. Product owner accepts after evidence review. Changes to learning goals, scope, duration, core turns, mandatory progression or rewards return to Sam. Routine consistent implementation details are owned by the assigned agent.

## 2. Backlog and dependency gates

| ID | Owner | Effort points | Task / allowed principal files | Depends on | Current state |
|---|---|---|---|---|---|
| PO-00 | Scrum | Outside estimate | Review/freeze baseline and decision log | User handoff | READY |
| ART-01 | Codex | 4 | Audit/select, clean/optimise existing kit; metadata/QA | PO-00 | READY |
| ART-02 | Codex | 4 | Six-sector overlay + plinth; new assets/metadata | PO-00 | READY |
| C-01 | Claude | 10 | Schemas, constants, printed profile, pure rules/actions/combat/preview/replay | PO-00 | REVIEW: interfaces published; see C-01 review |
| C-02 | Codex | 13 | Five puzzle validators, exact solvers and hints | C-01 frozen schemas | IN_PROGRESS: puzzle hooks published |
| C-03 | Codex | 7 | Four topology grammars, metrics and deterministic reconstruction | C-01 frozen schemas | IN_PROGRESS: certified T1 private reference published |
| C-04 | Claude | 14 | Enemy forecast/resolution, hazards, commissioning/alcove/charge and Undo | C-01; puzzle interface | REVIEW: R-01 verified; final integration pending |
| C-05 | Codex | 12 | Viewport, puzzle panels, hands and contextual feedback with placeholders | C-01 preview contract | IN_PROGRESS: controller/profile entry exists |
| C-06A | Claude | 2 | Private App/route adapter for Four Locks slice; shared route files only | C-01; C-05 entry interface | REVIEW: private route wired;24 targeted integration checks verified; full live win pending |
| C-06B | Codex | 4 | Four Locks full private vertical slice, fixture/trace assembly and real UI evidence | C-02 Sudoku,C-03,C-04,C-05,C-06A | IN_PROGRESS: two verified Common plans; live UI QA pending |
| QA-01 | Scrum + Claude review | Outside estimate | Inspect slice/art/stat feedback; approve expansion or list defects | C-06B,ART-01/02 | ACCEPTED for private development progression: 3 October recovery review; Sam/child/device usability unverified, QA-02 open |
| C-07 | Claude generation /Codex UI under4October split | 5 historical | Other four family packets, reference puzzles and teams per tier | QA-01,C-02 remaining | IN_PROGRESS: Unequal puzzle packet across tiers and Ravine T2/T3 math/reference checks16pass; tier enemy pressure, topology/diversity, full tactical/UI/bank acceptance pending |
| C-08A | Claude | 4 | Reusable tactical planner/replay proof tooling; exact files in overnight packet | C-01/C-04, real hooks; Four Locks candidate | REVIEW: R-07 fixed and verified; search coverage pending |
| C-08B | Codex | 4 | Offline bank generation, weaker-band/diversity evidence; consumes Claude planner | C-06B,C-07,C-08A | IN_PROGRESS: offline version2 T1 bank64 plus fallback independently verified; other banks/runtime/QA pending |
| C-09 | Claude | 9 | Saves, stars, migration, App catalogue integration and final build | C-01,C-04,C-06A/B | REVIEW: route wired; owner reports25 regression steps pass; live win/reward/device pending |
| ART-03 | Codex | 3 | Rendering-gap assets and final state/pose QA | C-05/C-06B screenshots | WAITING |
| C-10 | Codex | 5 | Selected v2 art imports, layer/anchor wiring and bundle analysis | ART-01/02 metadata,C-05 | IN_PROGRESS:49 sprites wired,all30 roster idles; live renderer acceptance pending |
| QA-02 | Scrum + both | Outside estimate | Automated certification across25 tiers; one representative browser case per family; genuine offline/device/child limits | C-08A/B,C-09/10,ART-03 | IN_PROGRESS: representative browser evidence covers all five types; Sam reduced manual scope5October; bank/runtime/final integration and human/device limitations remain |

Codex total:61 points. Claude total:39 points. These are planning estimates, not promised durations. The scrum master updates remaining effort as evidence arrives, retaining approximately this division. Rebalancing must transfer a whole named task/file boundary and be logged; never let both agents patch the same file.

Do not wait for finished artwork to write mathematical tests or a placeholder renderer. Do not claim a polished family before accepted art is integrated. C-02 may proceed by puzzle in dependency order; the first full slice is Four Locks even though rotation art can be worked on simultaneously. No new task should invent the remaining four families while C-06B reveals a broken core rule.

For overnight work, first read EXPEDITIONS_9FO_OVERNIGHT_HANDOFF.md. It defines the C-08A transfer, shared mailbox and exclusive full-build lock. The latest packet overrides older allocation percentages in copyable prompts.

## 3. Claude start packet: copyable instructions

Read the master brief and four-file v1.0 rules package, using coordination revision1.2 in this board. Your allocation is approximately39%: claim C-01, then C-04, C-06A, C-09 and transferred C-08A as dependencies become ready. Preserve the private gate, legacy modules and progress. Own the core pure engine, deterministic preview/reducer/replay, enemy phase, commissioning, Undo and App/save/reward integration. Codex owns puzzles, procedural generation, v2 UI, certification tooling/banks and all artwork.

Before editing, report task IDs and exact files in docs/expeditions/v2/reports/claude-<taskId>.md. Publish C-01's schemas and callable API signatures with example input/output fixtures. Create a runnable minimal fixture so Codex can test UI and generators without inventing engine semantics. Freeze the command ABI and puzzle hook interface; changes require a versioned report and updates from the owner of each affected file. Preview and resolution must share calculations.

C-04 imports Codex puzzle validators through the agreed hook interface; it does not reimplement them. C-06A exposes the private v2 React entry point and progress callbacks through the existing App route. C-09 finishes atomic saves/rewards/migration and owns final shared build outputs. Do not edit Codex's renderer or art registries. Review Codex's puzzle correctness and certificate evidence against your real reducer; propose corrections in the other agent's review report.

Report exact changes, tests/outcomes, limitations and ready dependencies. A failing certified trace is evidence to fix the owning module, not permission to lower thresholds or change rewards. New mode routes through engineVersion:2. Keep old progress intact and never silently load old maps.

## 4. Codex build and art start packet: copyable instructions

Read the same baseline package plus the asset audit and visual acceptance docs. Your allocation is approximately61% and includes all artwork. Claim ART-01/02 immediately; claim C-02/C-03/C-05 once Claude publishes C-01's interfaces. You own all five puzzle validators/solvers/hints, four topology grammars, five family packets, v2 React viewport/panels/hand/feedback, selected v2 art wiring, reference assembly and offline certification tooling/banks. Use Claude's real reducer for all tactical proofs. Never substitute an approximate simulator.

Report exact task/file claims under docs/expeditions/v2/reports/codex-<taskId>.md. Start with Four Locks and placeholders; assemble C-06B only after Claude's private route adapter and phase engine are available. Submit the vertical slice for QA-01 before expanding through C-07/C-08B. Preserve every rule/stat threshold; do not make UI calculate independent combat results. Runtime contains no solver search for tactical certification.

Own all new/cleaned art and v2 art/manifest.js and art/imports.js. Reuse existing30 heroes and four enemy identities. Use the applicable imagegen skill for new bitmaps. Deliver accepted art plus docs/expeditions/v2/art-delivery.json with bytes/hashes, bounds, anchors, slot centres and QA status. Implement renderer geometry from the logical grid, not irregular sprite bounds. Keep selected incremental art within12 MiB or report an evidenced exception.

C-08B consumes Claude C-08A's planner and produces25 tier references and at least1,600 accepted bank entries, with the required target-team/alcove proofs using Claude's published reducer. C-10 integrates accepted art in your v2 UI and measures bundle contribution; Claude C-09 owns App/shared rebuild changes. Review Claude's action previews, stat feedback, private gate and persistence evidence through the real UI. Do not edit Claude's core/shared files; post reproducible failures for its owner. Reports include exact commands, trace/screenshot paths, unresolved checks and next dependencies.

## 5. File/API integration map

New production modules proposed under `expeditions/v2/`:

- **Claude:** `constants.js`, `schema.js`, `profile.js`: numerical baseline, state/blueprint validation and roster adapter.
- **Claude:** `rules.js`, `actions.js`, `combat.js`, `enemy.js`, `events.js`: pure engine/preview/replay. Import existing seeded random and hex helpers only after verifying semantics.
- **Codex:** `puzzles/sudoku.js`, `rotation.js`, `balance.js`, `nonogram.js`, `packing.js`: validators/solvers/hints with no React dependency.
- **Codex:** `generation/topology.js`, `families.js`, `bank.js`: grammar and certified parameter bank loader.
- **Codex:** `ui/OrchardExpedition.jsx`, `MapViewport.jsx`, `PuzzlePanel.jsx`, `AbilityHand.jsx`, `ActionPreview.jsx`, `Briefing.jsx`: v2 presentation. Component splits may be refined without changing external interfaces.
- **Codex:** `art/manifest.js`, `art/imports.js`: selected accepted art and state/anchor mapping.

Integration changes are limited initially to existing Expedition catalogue/screen route, `wm-progress-actions.js`/migration, App's progress callbacks and rebuild output. Do not churn the entire monolithic app. Existing access helper remains the gate. Before editing shared files, claim them in a report and state the adapter/API effect. Claude owns these existing shared files and final rebuild outputs. Codex supplies its v2 entry component and callback requirements; both agents may read shared files.

Codex owns bank/certification/visual scripts listed below. Claude owns the two tactical-planner scripts and integration-extra.test.js named in EXPEDITIONS_9FO_OVERNIGHT_HANDOFF.md. Development scripts: `scripts/dev/build-orchard-v2-bank.cjs`, `certify-orchard-v2.cjs`, `render-orchard-v2-qa.cjs`. Test names/layout can follow repository conventions, but publish exact executable commands. The planning helper `scripts/dev/check-orchard-v2-spec.cjs` is design validation only and must not be passed off as engine coverage.

## 6. Required acceptance evidence by area

| Area | Meaningful checks |
|---|---|
| Common rules | AP/hand/Refocus/Second Wind, stat formulas, range/sight/roots, held-support cancellation, shield consumption, invalid/stale no-mutation, frozen enemy intent, death/deadline |
| Rotation | Six-face indexing both directions/wrap, equals in either slot, blank, exact divide, negative/zero division rejection, shared wheel changes, parenthesis tree, complete versus chosen-subset solutions |
| Sudoku | Given protection, all constraints, independent uniqueness, clue ladder/hint evidence, corruption and recommit |
| Balance | All legal allocations, duplicate-valued load identities, reserve/exclusions, guaranteed comparison decision-tree depth, allowance/save-resume |
| Nonogram | Empty clues, multi-runs/separators, unknown≠empty, unique solution and forced-only hints, sector coverage choices |
| Packing | Axial rotations/reflections/deduplication, clipping/overlap/socket/free-space access, temporary shelter removal, multiple tactically different placements |
| Progression | Actual roster enumeration, direct/alcove proof, T5 no lower-rarity job, no mandatory named Epic, complete target-team traces and no selected-party scaling |
| Generator | Reproducible parameters, all4 archetypes, structural fingerprints after D6 canonicalisation, bounded attempts/unknown rejection, exact fallback and recent-seed handling |
| UI/feedback | Preview equals result, disabled reason accuracy, touch pan vs tap, off-screen threat discovery, four sizes, keyboard/text equivalent, full action and enemy-phase trace |
| Persistence | Interrupted action/phase, different profile isolation, duplicate callback/restore replay, stable award ID across seed/version, correct pack carry, legacy preservation |
| Art/performance | No missing assets, native/min/max zoom screenshots, no fragment/checkerboard, selected bytes/whole bundle before-after, bounded memory/no console errors |

Run the required repository regression command once appropriate implementation tests pass. Publish the actual current command/result rather than copying historical23/23 notes. Rebuild with `node scripts/rebuild.cjs`; inspect actual `WallabyMaths.html` and `www/index.html` outputs. This planning task does not rebuild the app.

Minimum seed bank evidence:64 accepted entries per family/tier =1,600 entries overall, each with at least2 full target-band winning traces, plus a separate alcove trace wherever those target-band teams cannot use it. This means at least3,200 tactical traces, with additional alternate-route proofs as required. Static weaker-band exclusion uses exact job assignment enumeration; tactical proof uses real actions. Record timeouts/rejections/fallbacks, not only accepted seeds. At least five bank entries per family/tier require manual map inspection, and at least two tiers per family must be exercised through the real UI before expansion; final acceptance requires a real UI reference trace for every one of25 family/tier combinations and both tactical plans on each family's T1/T5.

Performance budgets: runtime reconstruction of selected certified entry≤100 ms on supported tablet, no tactical solver in interactive render; normal command preview/reducer≤16 ms for these≤92-tile maps at p95 over100 actions; responsive interaction without unbounded logs/undo; selected incremental art≤12 MiB. These are acceptance targets, not measured achievements. Report test device/browser/model. If targets fail, profile before relaxing them.

## 7. Agent completion and discussion template

Each task report is a durable discussion thread. Format:

```text
Task ID / owner / spec version:
State proposed: REVIEW or BLOCKED
Claimed files:
Problem and resulting behaviour:
Changed files and public interfaces:
Evidence commands and exact outcomes:
Reference trace/art/QA paths:
Seed/roster metrics:
Known failures or unverified acceptance:
Questions for the other agent/product owner:
Next dependency now ready:
```

Other agent writes `docs/expeditions/v2/reports/<taskId>-review-<owner>.md`, naming the report reviewed, findings and required corrections. Product owner records Accepted/Revise in the decision log. This is how agents discuss completion without requiring either provider to reconstruct a chat transcript. No email/Slack/other-task messaging is authorised by this document; use these shared files unless Sam explicitly asks otherwise.

## 8. Decision log

| ID | Decision | Status / evidence |
|---|---|---|
| D-01 | Orchard first now, retain15-type cross-module minimum | Explicit latest user instruction |
| D-02 | Five Orchard core families,25 tiers | Selected v1.0 baseline; reserve ten-map pitches retained |
| D-03 | Initial handoff put all art with Codex and implementation with Claude | Superseded allocation by D-11; artwork ownership retained |
| D-04 | In-grid six-sector number/operator overlays; accepted square Sudoku panel | Explicit user clarification/acceptance |
| D-05 | Three raw-stat operating jobs, fixed alcove alternative | Baseline; actual roster static enumeration validated |
| D-06 | Larger-health subtraction combat, four-card hand and twoAP | Selected baseline resolving prior conflicting examples |
| D-07 | Three stars first tier clear, no v2 replay/module bonus | Fixed-star currency explicit; numerical/economy baseline chosen for handoff |
| D-08 | Certified procedural bank regenerated offline at runtime | Baseline to avoid on-device tactical search |
| D-09 | Exact private gate unchanged | Existing binding repository/product requirement |
| D-10 | Explicit continuous/phase output hooks, frozen-intent dry run, irreversible weighing knowledge, source-specific Hold cancellation and command ABI | Independent specification review defects resolved in baseline |
| D-11 | Approximately65% Codex /35% Claude; Codex also owns puzzles, generation, v2 UI, art wiring and certification; Claude owns core engine and App/save integration | Explicit latest user instruction; coordination revision1.1, 65/35 effort ledger above; rules unchanged |
| D-12 | No extra jammed-station flag; T5 orchard damage per exposed site; Repair may reject full health but Mend still shields | Scrum clarification of ambiguous wording after Claude reports; spec text updated, no threshold/cost changes |
| D-13 | V2 UI uses controller-backed route props plus profile for its own gate | Shared C-06A/C-05 contract resolved; see C-06A-review-scrum.md; each agent updates its owned files |

| D-14 | Transfer4 points of C-08 tactical planner to Claude; retain Codex banks/diversity/art/UI. Shared mailbox and exclusive build lock | Explicit overnight user instruction; revision1.2, approximate61/39 split; overnight packet owns transferred file list |

Append amendments with rationale, affected files, acceptance impact and whether user decision is needed. Do not edit an old decision to hide a scope change.

## 9. Release checklist

All tasks accepted; all25 tier references and1,600 bank entries certified; no unsupported-stat/ability claims; all five puzzle forms distinct and understandable; lower-band proofs intact; assets accepted in actual renderer; rewards/save/retry verified; offline builds measured; device and child playtests reported; no legacy regressions; user separately approves any public release. If an acceptance item is unavailable, report it as remaining, not completed.

## 10. Claude report review: 1 October 2026

Reports C-01/C-04 are reviewed, not finally accepted. Published core interfaces unblock Codex C-02/C-03/C-05. C-06A/C-09 remain in progress; C-06B waits for the actual compatible interface and route. The independent suite returned92 passes and one sandbox esbuild permission error; the remaining private-route test passed with normal filesystem access. Full regression, actual route/component integration and child/device acceptance remain open.

Read docs/expeditions/v2/reports/C-01-review-scrum.md, C-04-review-scrum.md, C-06A-review-scrum.md and C-09-review-scrum.md. Claude fixes R-01..05 in its own files; Codex implements the D-13 controller-backed UI entry and continues Four Locks assembly. Reproduction: node docs/expeditions/v2/reports/scrum-claude-review-repro.mjs. No production files were changed by the scrum review.


