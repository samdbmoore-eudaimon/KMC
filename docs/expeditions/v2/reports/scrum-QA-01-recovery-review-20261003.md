# QA-01 recovery review: 3 October 2026

Decision at 09:52 UTC: ACCEPTED for the private development dependency gate. C-07 may start. This is scrum's independent technical and visual review of the repaired Four Locks slice, not a claim that Sam has approved the revised experience or that children/device users have tested it. Public release and QA-02 remain closed.

Reviewed stable owner reports: `codex-autonomous-recovery-20261003.md`, `codex-builder-recovery-20261003.md` and `claude-recovery-acceptance-20261003.md`. Builder completed its turn and released both claims; mailbox status is empty of locks. Historical failures and reports remain unchanged.

Independent executable checks on the final stable source:

- `node scripts/dev/verify-recovery-ui-evidence.mjs`: passed. Production reducer replays retained, fresh and exact-map replay wins in round four, plus the deadline loss. Original four commands preserved; one reward, completed save cleared and same blueprint/new run ID on retry. This recomputed the derived verification JSON; no historical certificates were changed.
- `node --test expeditions/v2/save-recovery.test.js scripts/dev/playthrough-visual.test.mjs`: eight passed. Repair, archive, idempotence, legacy progress, invalid logs, exact-map retry, no Back resurrection, footprint/hero contact and inspection/input invariants verified.
- `node --test expeditions/v2/recovery-acceptance.test.js expeditions/v2/recovery-reward.test.js`: twelve passed. Both movement confirmation paths, stale-preview clearing, all 64 runtime crossings, free draft versus adjacent activation, action help, loss explanation, exact private gate, save/resume and reward carry checked.

The first sandboxed retry test could not resolve local dependencies because parent-directory reads were denied. Unchanged tests passed with approved normal filesystem reads. This was an environment failure, not an unresolved game failure. No shared build was run by scrum. Reviewed the owner's final 25-step regression log, including build and smoke, and independently matched both shared HTML files through the verifier: 101543835 bytes each, SHA-256 `41197d418d5ac8a9bb093fa0951734aed13d63a2454426c3a43d9ac1c4d5095c`.

Visual review included `automatic-save-repair-desktop.png`, `retained-three-jobs-held-phone.png`, `action-help-purpose-cost-target.png` and the retained win screenshot. They show the repair explanation, recognisable station props within their hexes, grounded heroes, explicit next-step guidance, four ready goals and action purpose/cost/target help. These are actual owner browser captures. Earlier placement matrices and component interaction checks complement them. Scrum independently replayed records and inspected evidence; scrum did not operate those browser wins.

Evidence root: `docs/expeditions/v2/evidence/autonomous-recovery-20261003/`. Main-App browser DOM records support automatic resume, win, Back/re-entry without resurrection and normal-profile exclusion. Fresh/full-App screenshot capture timed out, so no pixel acceptance for those later routes is asserted. The App fixture has synthetic local profiles and the existing developer collection shortcut; it is not evidence of ordinary-account pack conversion. That conversion is independently covered by controller tests.

Outstanding acceptance limits carried into QA-02: Sam/child comprehension, native Android and physical touch, tablet performance, five-minute duration and fresh/full-App bitmap capture. These do not block the authorised private implementation progression, but must remain explicit. Exact gate, printed stats, costs, enemies, deadline and rewards remain binding. Other families/tier banks may not be advertised as playable until real-reducer certified and reviewed.

Next assignment: C-07/C-02/C-03 Turning Ravine reference packet and deterministic tier generation, with six-sector in-grid rendering and real-reducer direct/alcove mission proof before runtime selection. Complete the remaining authorised families and tier banks in dependency order; claim files before writes and retain historical provenance. No Claude restart.
