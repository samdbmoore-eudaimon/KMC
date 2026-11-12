# Scrum and builder separation: 3 October 2026

Sam explicitly asks for implementation to continue in a separate Codex chat, retaining the current chat as scrum master. This chat stops editing production files after this transfer. Existing uncommitted work is preserved.

Dedicated builder created: `01a100e6-b8f7-7a73-97c8-afa8455b7120`, title requested: Fix Orchard map placement and finish visual QA. Local UKMT App project, existing checkout. Scrum remains this original chat. No duplicate builder assignment or automation created.

## Expanded Claude handoff

Sam authorises more recovery work for Claude. In addition to the exact65% transfer in codex-playthrough-recovery-20261003.md, Claude now owns `expeditions/v2/ui/MissionSetup.jsx` and `squad-advice.js` for setup/role explanations and explicit owned-team recommendations. Explain each hero's likely job, capability shortfalls and what a practice attempt means. Do not auto-select cards or present feasibility as a certified winning plan. Existing numerical stats, card ownership, thresholds and rewards remain binding.

Claude also owns new independent end-to-end playthrough acceptance tests/evidence for the whole recovery: movement second-tap/Confirm, bridge exits, remote puzzle draft versus adjacent activation, touch/keyboard action help, complete mission guidance, enemy phase/loss reasons and actual eligible-profile shared App/save/reward checks. Review the builder's placement/tooltip evidence independently but do not edit the builder-owned renderer/map files. Publish reproducible defects back through the mailbox. Approximate remaining recovery split is75% Claude/25% Codex, not a change to whole-project accounting. Native device and child comprehension checks must remain unverified if unavailable.

## Separate Codex builder: resume current visual work

Read master brief, AGENTS.md, codex-playthrough-recovery-20261003.md and this packet. Reuse the current local checkout; do not create a clean worktree or reset any existing changes. Retain UX-VISUAL-20261003 advisory claim as the only Codex production writer for this scope. Claim precise files in your own report before additional edits. Do not run another build while Claude changes imported sources or holds final-build. Full build remains Claude-owned.

Completed source changes, not yet visually accepted:

- `art/placement.js` computes conservative visible-bounds fit inside a pointy hex and hero foot registration.
- `art/renderer.js` centres/scales each station to stay inside its own logical hex with4px inset. Heroes now66px visible height, bottom alpha bound at hex centre+8px; original asset bytes/manifests unchanged.
- `ui/RiverTerrain.jsx` fits the upright bridge structure inside its own hex, independent of water rotation. Review whether the smaller deck still communicates a crossing; water/topology unchanged.
- `ui/MapViewport.jsx` draws exact station footprints, smaller hero contact shadows, uses renderer ground offsets and local hover/focus/tap station inspection. Ordinary station tap inspects; tooltip Actions here calls the existing parent onSelect. Escape/Close dismiss. Movement callbacks remain onMoveTarget(hex), with repeated-tap state delegated to Claude.
- `ui/StationLabels.jsx` now shows only one active station tooltip with its full status, Actions here and Close buttons. No always-on station name/status panels.
- `ui/StationStatus.jsx` uses the actual hex ring, smaller damage crack and one12px priority cue by default; full cues on inspected station. Existing state semantics unchanged.
- `art/art.test.js` and `station-art.test.js` updated to check the new visible geometry rather than old fixed scale.13 bounded art/river tests passed. No controller preview rebuild or new screenshot matrix has been made for these changes yet.

Immediate outstanding checks/fixes:

1. Verify interactive tooltip remains visible when the mouse enters it: its SVG group should stop pointer-move bubbling to underlying map, as pointer down/up already do. Check keyboard focus/blur, Escape, touch second tap and dragging behavior. Avoid accidental move/select when clicking tooltip buttons.
2. Build isolated visual review using the preserved current run and existing production-reducer station snapshots. New claimed scripts `scripts/dev/playthrough-visual-review.jsx`, `build-playthrough-visual-review.cjs`, `playthrough-visual.test.mjs` do not exist yet; create as needed. Tests must prove popup absence by default, exact hit/footprint agreement, geometry containment, foot/shadow contact and inspection no AP mutation. Do not write mirror tests for cosmetic constants.
3. Visually inspect all five props, hero idle/working/exhausted and bridge at phone390×844/tablet768×1024/desktop1280×900 and actual camera0.45/1/2. Confirm alpha bounds fit logical polygons and no misleading hovering or neighbouring-tile overlap. Dark/green overlay contrast and actual touch semantics require visual review, not only assertions.
4. Targeted tests requiring esbuild may fail sandbox parent-directory reads; prior scoped require_escalated dependency read resolves them. Do not weaken tests. Shared full build/regression requires Claude's final-build lock.
5. Coordinate readiness with Claude before rebuilding isolated player-recovery/controller-route-preview.html. Preserve Sam's current saved run. Do not invite another playthrough until the instructional/bridge/movement fixes are integrated and independently reviewed. QA-01 remains failed.

6. Claude's message1791016054004-5eb84e418fab reports crossing invariants, bank runtime, second-tap movement and guidance/help implemented. Inspect the Claude recovery report before integration; these are owner claims pending review. Explicit builder defect: the closed controlled bridge must look raised or blocked instead of displaying a usable timber deck. Keep actual production passage state and footprint/hit polygon unchanged. Claude's earlier fixed-scale art-test failures were already reconciled: current13 scoped art/river checks passed; verify again only if relevant sources changed.

## Reproduction captured from Sam's current playthrough

`docs/expeditions/v2/evidence/playthrough-recovery-20261003/sam-playthrough-trace.json` was read from the visible QA trace, without injecting state or altering saved progress. Real reducer replay succeeds, final hash6601c1ad779b3490. Commands: Furrow3,1; Sorrel3,6; Tuppence3,4; Furrow6,2.

Sorrel3,6 is a bridge with hedge4,6 blocking its far exit. Tuppence3,4 is roots beside CLOSED bridge4,4, not actually on the bridge despite visual impression. Both have1AP and legal alternatives. Claude received the exact reproduction. Top bridge5,2 also has hedge4,2 on its western approach. No generator/rule fixes have been applied by Codex.

Evidence also includes `sam-playthrough-state.json` and `before-visual-recovery.jpg`. All evidence predates the new placement changes unless explicitly labelled otherwise.

## Coordination

Send updates through shared local mailbox to scrum and Claude and write owner reports. This scrum chat can authorise and send follow-ups to the new builder chat. No automatic schedule started. Claude remains an external session: mailbox delivery/acknowledgement is not proof of finished implementation.
