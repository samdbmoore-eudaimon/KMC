# Scrum review: Claude C-04

Reviewed 1 October 2026. Disposition: REVIEW, changes required.

The phase-order, protection, forecast, ability and Sudoku integration tests passed in the independent suite. Rotation/balance/nonogram/packing end-to-end blueprints and tactical certificates remain future evidence, as Claude's report correctly states.

## R-01: Mend wrongly refuses a full-health target

Owner: Claude, `expeditions/v2/actions.js`. Priority: required before slice acceptance.

Mend and Mend Again has two effects: restore Science and grant shield ceil(Science/2). It must be usable defensively when restoration is zero but a shield would help. Currently its full-health check returns `nothing-to-repair` before granting any shield. Reproduced using full-health Pip, Science6: preview is illegal with `nothing-to-repair`; the specified shield3 is unavailable.

Run `node docs/expeditions/v2/reports/scrum-claude-review-repro.mjs`. Add meaningful tests for full-health self/ally/station targets, shield3, oneAP/hand exhaustion, preview=result and held-state preservation. Ordinary Repair may still refuse a full-health target because it has no secondary effect. Do not alter Mend's range, strength or cost.

## Clarifications

The undefined jammed-station status is removed from the baseline: jam means the declared puzzle mutation, not an additional station-disable flag. Fix existing corruption through legal edits and paid Operate; Stabilise prevents future matching mutation rather than automatically solving mathematics.

T5 environmental damage is per unprotected listed site. Two exposed sites can cause2×(2+tier) orchard damage. Adequate Sustain Hold protects both. Each site's consequence must be forecast separately. Current engine choice is retained, with explicit specification wording; do not change enemy power or commissioning profiles.

Next: fix R-01, publish tests and retain REVIEW until the vertical slice proves real integration.
