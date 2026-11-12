# Claude C-06A: private App/route adapter for the Four Locks slice

Task ID / owner / spec version: C-06A / Claude / baseline 1.0, coordination 1.1
State proposed: IN_PROGRESS (adapter, controller and catalogue published; the single remaining step needs Codex's `ui/OrchardExpedition.jsx`)

## Claimed files

New: `expeditions/v2/route.jsx`, `controller.js`, `catalogue.js`, `route.test.js`.
Shared files claimed, not yet edited: `expeditions/ExpeditionScreen.jsx` (one private branch), `expeditions/expedition-catalogue.js` (none planned; the v2 catalogue is its own module so the legacy registry is untouched).

## Behaviour

- `route.jsx` re-checks `canAccessExpeditions(currentProfile)` and `activeModule === "primary"` itself, renders nothing otherwise, and asks the parent to leave. `route.test.js` proves the exact gate: only `Eudaimon` with the Rooke avatar renders the injected UI; null, another name, wrong avatar, missing avatar, another module and a missing UI all render empty.
- Codex's UI and the blueprint generator are injected (`Ui`, `generateBlueprint`, `ensureHooks`), so nothing in Claude's code imports a file Codex has not delivered yet. Props the UI receives, and the controller methods it calls, are in `ENGINE_API.md` section 9 (frozen for the slice).
- Legacy scenarios, saves and the legacy briefing are untouched. Nothing is routed to v2 yet, so no double entry point exists.

## What remains for C-06A (needs C-05)

1. When `ui/OrchardExpedition.jsx` exists: in `ExpeditionScreen.jsx`'s default export add `if (activeModule === "primary" && ORCHARD_V2_ENABLED) return <OrchardV2Route Ui={OrchardExpedition} generateBlueprint={generateOrchardBlueprint} ensureHooks={registerOrchardPuzzleHooks} {...props} />;` and update the existing `scripts/test_expedition_screen.cjs` expectation for the primary briefing at the same time (it currently asserts the legacy "The Unequal Crossing" briefing).
2. Decide whether the legacy Orchard briefing stays reachable. The brief says no double entry points, so I will hide it behind the v2 route for Ninefold Orchard only; Little Reckoning and Gifford keep the legacy screen.

Evidence: `node --test expeditions/v2/route.test.js` -> 1 test, pass.

## Questions for Codex

Please confirm `OrchardExpedition` is a default export taking exactly `{controller, bucket, families, ownedCards, cards, avatarForCard, beep, fireConfetti, onExit}`, and that it never writes progress itself.

## D-13 update

Route now passes `profile={currentProfile}` with the controller-backed props. Still waiting for Codex's `OrchardExpedition.jsx` to wire `ExpeditionScreen.jsx`; route gate test still passes.

## Route integration complete (2 October)

`expeditions/ExpeditionScreen.jsx` now sends `activeModule === "primary"` to `OrchardV2Route` with Codex's `OrchardExpedition`, `generateOrchardBlueprint` and `registerOrchardPuzzleHooks`, plus `currentProfile`. Little Reckoning and Gifford keep the legacy screen; legacy Orchard saves are untouched. `scripts/test_expedition_screen.cjs` now asserts the primary route renders nothing for a non-private profile and the v2 setup screen for the exact Rooke profile.

Real interaction evidence: `expeditions/v2/route-ui.test.js` (jsdom, real route, real component, real generator and hooks): non-private profile renders nothing; an owned Common squad begins and the run is saved through setProgress before any move; previewing a move saves nothing; Confirm saves exactly one command; remounting from the saved progress resumes Round 1 with that command. Pass.

Full `npm test` under the final-build lock: All 25 steps passed (includes the rebuild and bundle smoke steps). Lock released. Not verified: win/reward through the live UI (the reference teams need many UI actions), tablet/device, Android persistence, child timing.
