# Claude: extra engine integration (rotation, balance, nonogram, packing)

Owner: Claude. Coordination 1.2. State proposed: REVIEW. File: `expeditions/v2/integration-extra.test.js`.

All puzzle data in that file is an explicit, labelled ENGINE FIXTURE on the production 92-tile map with the real Codex hooks (`registerOrchardPuzzleHooks`). Nothing there is a certified bank entry. No Codex validator or production data was edited.

## Evidence
`node --test expeditions/v2/integration-extra.test.js` -> 8 tests, 8 pass.

- Rotation: fixed and out-of-range wheel edits rejected by the real hook; `reset-draft`; worked solution via `request-hint` stage 3; output cap of two; paid Operate powers the bridge (eq1) and shelter (eq2); a Rewinder forecast and resolution turns wheel A (highest degree, ID tie) and drops eq1 and eq3 only; a lock on `wheel-A` moves the rewind to wheel B; grants expire at phase end; replay identical.
- Balance: unknown load, bad pan and premature Operate rejected; worked allocation opens the crossing; Jammer returns the highest-value assigned load (load-5); network lock keeps it; hidden-value weighing (allowance 2): result, free repeat and swap, `unknown-load`, Undo cannot unlearn, a contradictory inferred value refused by the hook using the comparison log, allowance exhausted; 29-command log saved and resumed by replay in well under the 2 s bound.
- Nonogram: unknown cells are not empty and block Operate; beams power on commit; the uncovered south hunter is not suppressed and the uncovered south nest costs 1+tier; switching to the east+south beams suppresses it; Jammer targets the lowest filled cell (r0c2) and a row lock moves it (r1c2).
- Packing: bad origin, reflection when disallowed and unknown piece rejected; worked packing powers the shelter output and replays; shelter suppression is forecast, makes `evaluateVictory` report `packing-socket-suppressed`, is prevented by a patch Stabilise, and expires after the phase.

## Not covered (be honest)
These are single-mechanism tests. No complete Tier winning run exists for these four families (needs Codex's blueprints and the planner); nonogram T3+ deduction ladders, hidden-value tiers T4/T5 and packing reflection are untested through the engine.
