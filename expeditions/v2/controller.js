// The single object Codex's v2 UI talks to. It owns no React state and no storage: every write is a
// setProgress updater, so App's existing persistence path is the only writer (CLAUDE.md "Progress / storage").
import { listCommands, previewCommand, reduceCommand } from "./actions.js";
import { forecastEnemyPhase } from "./enemy.js";
import { exportRunRecord } from "./run.js";
import {
  applyOrchardV2Result, beginOrchardRun, clearActiveRun, familyStatus, loadActiveRun, orchardV2Bucket, previewOrchardV2Award, recordOrchardLoss, saveActiveRun, shouldPersist,
} from "./persistence.js";
import { FAMILY_IDS } from "./constants.js";

export function createOrchardController({ getProgress, setProgress, generateBlueprint, ensureHooks = () => {} }) {
  const claimed = new Set();
  const claimWin = (state) => {
    if (state.status !== "won" || claimed.has(state.runId)) return null;
    claimed.add(state.runId);
    const record = exportRunRecord(state);
    const award = previewOrchardV2Award(getProgress(), record);
    setProgress((current) => applyOrchardV2Result(current, { record }));
    return award;
  };
  return {
    families: FAMILY_IDS,
    status: (familyId) => familyStatus(getProgress(), familyId),
    bucket: () => orchardV2Bucket(getProgress()),
    resume() {
      ensureHooks();
      return loadActiveRun(getProgress());
    },
    discard: () => setProgress((current) => clearActiveRun(current)),
    begin({ familyId, tier, cardIds, deploymentAssignment = null, mode = "new" }) {
      ensureHooks();
      const begun = beginOrchardRun(getProgress(), { familyId, tier, cardIds, deploymentAssignment, mode, generateBlueprint });
      if (begun.ok) setProgress((current) => begun.update(current));
      return begun;
    },
    listCommands: (state, heroId) => listCommands(state, heroId),
    preview: (state, command) => previewCommand(state, command),
    forecast: (state) => forecastEnemyPhase(state),
    // Apply one player command. Returns {state, result, award}. Saves after each confirmed action, records a
    // loss once, and claims a win once (the reducer itself is idempotent as a second guard).
    dispatch(state, command) {
      const { state: next, result } = reduceCommand(state, command);
      if (!result.legal) return { state, result, award: null };
      if (shouldPersist(command) || next.status !== "playing") setProgress((current) => saveActiveRun(current, next));
      let award = null;
      if (next.status === "lost") setProgress((current) => recordOrchardLoss(current, next));
      if (next.status === "won") award = claimWin(next);
      return { state: next, result, award };
    },
    save: (state) => setProgress((current) => saveActiveRun(current, state)),
    claimWin,
  };
}
