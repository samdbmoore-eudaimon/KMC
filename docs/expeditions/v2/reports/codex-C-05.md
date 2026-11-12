# C-05: v2 interface and viewport

Additional exact claim,2 October: `expeditions/v2/ui/StationGlyph.jsx`. The v2 renderer has identical placeholder blocks for the distinct operating jobs. Implement permitted interim live geometry: true pointy-top plinth, square ledger control, Number meter, Shape brace and Sustain root maintainer, with charged/held/damaged markers driven by real station state. This does not mark ASSET-02/03 bitmap acceptance complete.

Owner: Codex. Baseline 1.0, coordination 1.1. State: CLAIMED.

Current state: IN_PROGRESS,2 October. `node --test expeditions/v2/ui/ui.test.js`:6 passed after direct-gate, geometry and exact-feedback checks. Puzzle hints now appear inside the open drawer, rather than only behind it. Circuit checkboxes synchronise with an engine-updated draft selection after Show solution while retaining unsubmitted choices during other edits. First-slice eight sprites are imported for private renderer QA. Certified generation entry is ready; historical unimported/unavailable statements below are superseded. Actual App route wiring remains Claude-owned and absent, so screenshots and real UI playthrough are pending.

C-01 ENGINE_API.md is now frozen. Claimed files: `expeditions/v2/ui/OrchardExpedition.jsx`, `MapViewport.jsx`, `PuzzlePanel.jsx`, `AbilityHand.jsx`, `ActionPreview.jsx`, `Briefing.jsx`, `feedback.js`, `viewport.js`, `ui.test.js` and this report. External component contract will be published here for Claude's C-06A private route adapter. All command figures come from the real engine; camera is presentation only. No App, progress or legacy shared component is claimed.

## Entry contract for C-06A

Named and default export `OrchardExpedition` from `expeditions/v2/ui/OrchardExpedition.jsx`.

Props: `{profile, blueprint, cardIds, initialState=null, onStateChange, onComplete, onExit}`. `profile` is passed to the existing exact `canAccessExpeditions` helper before creating/rendering a run. The shared App adapter must retain its own gate too. `blueprint` and `cardIds` initialise `createRun`; `initialState` resumes the full saved run. `onStateChange(state)` fires after accepted mutations, `onComplete(exportRunRecord(state))` supplies the terminal replay record; App owns persistence/rewards and duplicate-callback handling. `onExit()` returns to the catalogue.

No localStorage access, borrowed cards, demo profile, gate override or automatic generated fixture. If the adapter has no ready blueprint, keep that entry unavailable until C-03's reference is supplied. Internal presentation state does not affect state hashes.

## Adapter alignment after C-06A publication

The props above were proposed before Claude's controller adapter was available. Use the subsequently published frozen C-06A controller interface plus D-13: `{profile,controller,bucket,families,ownedCards,cards,avatarForCard,beep,fireConfetti,onExit}`. The named/default export is implemented. Its outer gate calls the existing exact `canAccessExpeditions(profile)` before mounting the inner component or calling controller.resume. `controller.begin/resume/dispatch/save` owns every persistent mutation and reward. The route re-checks the existing exact access gate and Primary module. This supersedes the earlier proposed callback props; no Claude file needs adapting.

Coordination revision1.2 recorded: Claude owns C-08A planner and extra engine integration tests. Codex retains C-08B, artwork, puzzles, generation and UI. Current UI compiles in an isolated in-memory esbuild check. Four Locks candidate and production reducer reference traces exist under `docs/expeditions/v2/references/four-locks/`. Tuppence/Furrow/Sorrel wins and replays; Bushel/Furrow/Pip greedy attempt loses and is retained as evidence. No bank certification or visual acceptance is claimed.

## Executable checks and current presentation gaps

`node --test expeditions/v2/ui/ui.test.js`: 5 passed. Checks measured pointy-top spacing/shared edges, inverse camera picking, zoom anchor preservation, camera bounds and the direct-mount private gate before controller reads. The test compiles only the v2 component in memory; no shared build outputs are touched. Local esbuild needs normal filesystem resolution outside the sandbox boundary; the targeted check passed with that access.

Map now starts at scale1, offers an accessible object/health/AP/charge list and legal move previews, and supports Escape closing detail/draft-choice/preview without an action. No renderer screenshots or device acceptance yet. Selected art remains unimported pending measured anchor/alpha acceptance. Controller-backed UI is ready for adapter compilation; runtime certified generation entry remains unavailable until C-06B proofs exist.
