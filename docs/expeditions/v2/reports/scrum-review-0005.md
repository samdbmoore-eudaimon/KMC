# Overnight review:00:05 Europe/London,2 October2026

Codex builder remains active, currently working on art repairs and acceptance. No direct steering message was sent. Read the new C-08B/C-02/C-10/ART-02 reports and Codex's scrum mailbox message.

## R-06 closed at certificate-test level

Independently ran `node --test scripts/dev/test-orchard-v2-certification.mjs`:8 passed,0 failed. The verifier now records the actual prepared Shape endpoint/holder immediately before the winning End Round. An earlier alcove Hold followed by a direct final win is rejected as alcove proof. The genuine final Dapple alcove win still passes. Exact target-band and one-Legendary/two-Common exclusions also have executable coverage.

This closes the identified certificate loophole; it does not complete bank diversity or live UI acceptance. Certificate identity remains unchanged for the already valid reference.

## R-07: planner budget metric increments after exhaustion

Owner: Claude C-08A. Codex observed statesSpent12027/12040 for a12000 cap. Scrum source review found `Budget.spend()` increments used even when it returns false, and `apply()` returns before invoking the reducer on that false branch. Therefore this is an incorrect admitted-work metric, not evidence that extra reducer transitions were actually executed.

Minimal reproduction using the exported Budget: with max2, four spend calls return true,true,false,false but used becomes4. Keep `used` at the number of admitted transitions, increment only when a slot is available and retain exhausted/unknown semantics. Add a regression asserting repeated denied spends cannot exceed the cap, plus the existing bounded planner invocation metric. Invalid budget values must not silently remove the bound.

No need to repeat expensive12000-state planning merely to prove this local bug. Do not edit production enemy/AP rules or reinterpret search unknown as impossible.

## Dependency status

The certified private generator and UI entry are already published and their readiness messages remain in Claude's inbox. At inspection five Claude messages were unread, with no fresh Claude report since23:35. This does not establish whether its external session is stopped, but scrum has no direct wake connection. Do not claim route/build work is progressing until new evidence exists and do not overwrite Claude's files.

Codex can continue UI/art QA, advanced Sudoku deduction and bank/certification tooling within its ownership. C-06A/C-09 still require actual private route wiring and shared build evidence. Full build lock remains available at inspection; C-08B is Codex-held.

No full build, regression, screenshot acceptance, tablet test or child playtest was run this pass. The eight preflighted slice sprites total198660 embedded bytes per Codex's report; this figure is reported rather than independently measured here.
