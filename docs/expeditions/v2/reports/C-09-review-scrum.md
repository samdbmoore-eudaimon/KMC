# Scrum review: Claude C-09

Reviewed 1 October 2026. Disposition: IN_PROGRESS; changes required before rewards/persistence acceptance. Owner of all corrections: Claude. No owned production file was changed by this review.

The existing save/replay/reward unit tests passed, but the following boundary cases were independently reproduced or identified in production code. Run `node docs/expeditions/v2/reports/scrum-claude-review-repro.mjs` for the current observations.

## R-02: owned squad is not enforced at begin

Calling begin with `progress.cards={}` and Bushel/Furrow/Pip returns ok:true. The runtime boundary must reject cards without positive owned counts and reject malformed squads before generating/persisting a run. Keep pure createRun available to certification tooling, but production begin cannot borrow cards. Update fixtures to include actually owned squads rather than relying on an empty collection. Cover positive, zero, missing and invalid counts without changing progression thresholds.

## R-03: reward verification accepts another profile's unsaved win and absent final hash

A valid fixture winner awarded3 stars to an otherwise fresh progress object with no saved run. Deleting `finalStateHash` still returned a verified win. Require the winner's final hash, current saved run identity/blueprint/initial origin and owned printed-card profiles at the production award boundary. Validate the incoming winning log is an extension of that saved run's log, accommodating the normal controller save-then-claim sequence. Reject another profile's record and a test-overridden profile. Local replay hashes are consistency checks, not anti-tamper security; no new cryptographic system is requested.

Keep legitimate first-clear, repeat-zero, duplicate callback, resumed win and pack conversion behaviour. Add actual foreign-record/no-origin/missing-hash/altered-profile tests. The existing two-profile isolation test alone does not exercise cross-profile replay submission.

## R-04: recent bank history stores the requested seed

With requested seed3226998889 and parameterSeed999, the persisted recent list contains3226998889. Store the selected parameterSeed and pass that list back to the generator. Preserve requested seed separately. Use different requested seeds that choose the same parameter entry in tests; the existing seed=parameter fixture masks this issue. Update ENGINE_API's wording that currently conflates the two.

## R-05: confirmed maths edits/hints are not automatically persisted

`shouldPersist({type:'edit-draft'})` is false, as is request-hint. A child closing/reloading after editing but before a tactical action loses that work and hint state. The implementation spec requires confirmed mutations to survive resume. Persist those accepted changes through App's setProgress, or implement a documented bounded flush that guarantees close/resume correctness and is tested; the current save-on-next-paid-action does not. Measure cost with realistic logs later rather than calling deliberate data loss coalescing.

## Remaining evidence

Finish the actual route integration and real component tests, then run the full repository regression and build/smoke suite. The review independently verified the93-test suite in two parts because of a sandbox route-build permission failure; it did not validate the reported98MB build, full npm run, Android persistence or tablet latency. Retain these as open acceptance items.
