# Claude task: one-hex scales for The Unequal Crossing

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. This is a historical decision record;
> it does not override the active experience, visual or engineering briefs.

Status (2026-09-16): Claude's engine implementation has landed in the shared
workspace. This original prompt is retained as the decision record, not a request
to implement it again. See "Claude: engine contract for the scale redesign lands"
in `EXPEDITIONS_CLAUDE_HANDOVER.md`. Codex has since wired the single-hex board
presentation, adjacent click-to-place interaction and two-load choice UI. Claude's
remaining responsibility is to review any integration findings against the engine
contract and keep the reference simulation passing; do not duplicate the work.

Read `EXPEDITIONS_CLAUDE_HANDOVER.md`, especially "Approved scale redesign: one impassable hex per scale", before editing. Implement that decision now. Codex owns presentation art and carrying sprites; you own the engine, scenario data, interaction wiring, tests and reference simulation. Coordinate through the handover files. Do not alter release gating, rewards, adventures or unrelated scenarios.

The current scenario has `leftHexes: ["-2,1", "-2,2"]` and `rightHexes: ["2,-1", "2,0"]` because it was built as two-cell platforms. Replace those with a single impassable scale fixture on each side, provisionally at `-2,1` and `2,-1`. The removed cells become ordinary passable ground. A hero carrying a numbered load may stand on **any adjacent hex** and spend one AP to place it on a selected scale by clicking the scale. Characters must never enter a scale cell. Each scale must hold at least two separate loads, because 2+5 and 3+4 both make seven. The dial total and state continue to come from engine-owned `result.sides`, not presentation arithmetic. Players must also be able to inspect and remove a specific load from an adjacent hex, including when two loads occupy the same scale.

Audit `interactObject`, `reachableHexes`, `evaluateObjective`, `objectAt`/click targeting, enemy interaction and any generated variants. Avoid a UI-only shortcut: current `interactObject` rejects a second object on one hex, and current board clicking never drops a carried load onto an adjacent cell. Use a scale inventory or a well-defined stacked-object exception, and keep all other objective families' behaviour unchanged. Preserve undo and event messages. The scale's footprint should not block click access to neighbouring hexes.

Add tests for six-neighbour placement, rejection at distance two, movement and enemy pathing around both scale cells, 2+5 and 3+4 totals, overload, removal/correction of a chosen load, single counting of each load, and success only after both scales equal seven and a hero reaches the arch. Update `scripts/simulate_unequal_crossing.mjs` and verify a legal clear within the four-round limit. If the provisional coordinates make that impossible or damage pathing, choose nearby single cells and document the reason before Codex finalises scale art.

Do not remove the present two-hex artwork until the new interaction and tests work. Once the engine change is ready, tell Codex the final scale anchor coordinates and any new state fields or command signature. Codex will replace the temporary brass outlines with one stateful on-hex scale prop per side, with legible live total and both load values, and will wire completed carry poses for every Ninefold character.
