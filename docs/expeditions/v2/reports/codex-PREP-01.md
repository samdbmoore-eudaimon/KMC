# PREP-01: independent mathematical fixtures

Owner: Codex. Baseline 1.0, coordination revision 1.1. State: IN_PROGRESS.

Claimed files: `scripts/dev/orchard-v2-maths-oracles.cjs`, `scripts/dev/test-orchard-v2-maths.cjs`, `docs/expeditions/v2/fixtures/maths-reference.json` and this report.

This is test preparation authorised while C-01 is unavailable, not production C-02 or an invented shared puzzle ABI. Independent exhaustive small-domain oracles produce expected mathematical results for later production conformance tests. They do not model combat, movement, AP or rewards and cannot certify a mission.

Additional exact claims: `scripts/dev/find-orchard-advanced-sudoku.mjs`, `docs/expeditions/v2/fixtures/advanced-sudoku-search.json`. This bounded mathematical fixture search uses the real Sudoku evaluator and an independent exhaustive-grid cross-check. It does not enable tier4/5 or certify their tactical pressure; the Four Locks first-slice review remains the release gate.

2 October result: `node scripts/dev/find-orchard-advanced-sudoku.mjs 100000` examined26187 candidates before its three-example stopping rule, found15425 unique and15391 human-complete puzzles, with4 pair,6 intersection and3 both-technique chains. Examples at attempts9797,12538 and26186 contain17/17/18 recorded reasoning steps. Every example was independently cross-checked against exhaustive Sudoku grids, including its three-cell cages. The earlier5000-candidate search returned unknown with no both-technique example; bounded failures remain honest. `puzzles.test.js` now replays all three chains and validates their complete solutions. These fixtures are mathematical preparation only.
