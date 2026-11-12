// Puzzle hook interface (frozen as hookInterfaceVersion 1). Codex owns every implementation;
// the engine only ever talks to puzzles through this registry. Mathematics never lives in the
// engine. All functions are pure and must not mutate their arguments; `content`/`draft` are
// JSON-serialisable and are stored verbatim in state.puzzleActive.content / state.puzzleDraft.content.
//
// registerPuzzleHooks(kind, hooks) where kind is blueprint.puzzle.kind ('sudoku4',
// 'equation-wheels','balance','nonogram5','polyhex') and hooks is:
//
//   hookInterfaceVersion: 1
//   createActive(puzzle) -> content            initial *committed* content (scrambled/empty/start)
//   createDraft(puzzle, activeContent) -> content    initial draft (usually a copy of active)
//   applyEdit(puzzle, draftContent, edit, ctx) -> {ok:true, content} | {ok:false, reasonCode, reasonParams?}
//        edit is {type, ...payload} exactly as in the command ABI; ctx = {comparisonLog}.
//        The engine also forwards select-outputs edits here (after checkOutputSelection passes)
//        so a hook that mirrors the selection inside its content stays in step; a hook that does
//        not may simply return the content unchanged. It must accept this edit type.
//   checkOutputSelection(puzzle, outputIds) -> {ok:true} | {ok:false, reasonCode, reasonParams?}
//   commit(puzzle, draftContent, outputIds) -> {ok:true, content} | {ok:false, reasonCode, reasonParams?}
//        Sudoku requires a complete valid grid; rotation may commit partial rotations.
//   evaluate(puzzle, activeContent) -> {valid:boolean, outputTruth:{[outputId]:boolean}, details?}
//        outputTruth[id] is the output's own mathematical truth; engine powers an output only
//        when it is also in puzzleActive.selectedOutputIds.
//   disruptionCandidates(puzzle, activeContent, kind) -> [{memberId, groupIds:string[]}]
//        kind 'jam'|'rewind'|'environment'. Members ranked in the canonical order of the
//        spec (§3 Jam effect / rewinder degree order / environment ranking). Engine takes the
//        first not protected by strength >= power across the groupIds.
//   disrupt(puzzle, activeContent, memberId, kind) -> newContent
//   hint(puzzle, draftContent, stage, ctx) -> {text, params?}              optional; ctx={comparisonLog,comparisonsUsed} (added engine 1.3)
//   solutionDraft(puzzle) -> content            used for the worked-solution hint stage
//   compare(puzzle, content, leftLoadIds, rightLoadIds) -> 'left-lighter'|'equal'|'left-heavier'   balance only
//   reserveTotal(puzzle, activeContent) -> integer                         balance only
//   sectorFill(puzzle, activeContent) -> {[sectorId]:boolean}              nonogram only (non-empty sectors)
//   coverage(puzzle, activeContent) -> {coveredCells:string[], socketsCovered:boolean}   polyhex only
//   commissionCheck(puzzle, activeContent, ctx) -> {ok:boolean, reasonCode?, reasonParams?}
//        Family-specific commissioning conditions beyond output count; ctx={selectedOutputIds,
//        poweredOutputIds, suppressedShelterCells, tier}.
const registry = new Map();

export const HOOK_INTERFACE_VERSION = 1;
const REQUIRED = ["createActive", "createDraft", "applyEdit", "checkOutputSelection", "commit", "evaluate", "disruptionCandidates", "disrupt"];

export function registerPuzzleHooks(kind, hooks) {
  for (const name of REQUIRED) {
    if (typeof hooks?.[name] !== "function") throw new Error(`Puzzle hooks for ${kind} missing ${name}`);
  }
  registry.set(kind, hooks);
}
export function unregisterPuzzleHooks(kind) {
  registry.delete(kind);
}
export function getPuzzleHooks(kind) {
  const hooks = registry.get(kind);
  if (!hooks) throw new Error(`No puzzle hooks registered for kind ${kind}`);
  return hooks;
}
export function hasPuzzleHooks(kind) {
  return registry.has(kind);
}
