import React, { useEffect, useMemo, useRef } from "react";
import { canAccessExpeditions } from "../expedition-access.js";
import { createOrchardController } from "./controller.js";
import { orchardV2Bucket } from "./persistence.js";
import { ORCHARD_V2_FAMILIES } from "./catalogue.js";
import { MODULE_KEY } from "./constants.js";

// Private route adapter (C-06A). It re-checks the exact access gate itself (App already gates the
// screen; a second check means no preview, replay or direct mount can bypass it), builds the controller
// over App's existing setProgress, and hands Codex's v2 UI everything it needs. The UI component and the
// blueprint generator are injected by ExpeditionScreen so this file has no hard dependency on either.
//
// Props the v2 UI (`Ui`) receives:
//   profile      currentProfile (the UI repeats the private gate check)
//   controller   createOrchardController(...) object: status(), resume(), begin(), dispatch(), preview(), listCommands(), forecast(), save(), discard()
//   bucket       read-only v2 progress bucket {activeRun, tierAwards, tierBest, familyTiers, ...}
//   families     ORCHARD_V2_FAMILIES (id, title, jobs, engineVersion 2)
//   ownedCards   progress.cards ({cardId: count}); cards = App CARDS; avatarForCard(module, card)
//   beep, fireConfetti, onExit  optional presentation callbacks
export default function OrchardV2Route({ Ui, generateBlueprint, ensureHooks, activeModule, currentProfile, progress, setProgress, cards, avatarForCard, beep, fireConfetti, onExit }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const allowed = activeModule === MODULE_KEY && canAccessExpeditions(currentProfile);
  const controller = useMemo(() => createOrchardController({ getProgress: () => progressRef.current, setProgress, generateBlueprint, ensureHooks }), [setProgress, generateBlueprint, ensureHooks]);
  useEffect(() => {
    if (!allowed) onExit?.();
  }, [allowed, onExit]);
  if (!allowed || !Ui) return null;
  return <Ui profile={currentProfile} controller={controller} bucket={orchardV2Bucket(progress)} families={ORCHARD_V2_FAMILIES} ownedCards={progress.cards || {}} cards={cards} avatarForCard={avatarForCard} beep={beep} fireConfetti={fireConfetti} onExit={onExit} />;
}
