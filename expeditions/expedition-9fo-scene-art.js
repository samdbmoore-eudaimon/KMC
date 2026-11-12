import ciderBackdrop from "../assets/expeditions/production/9fo/runtime/backgrounds/po-cider-run-press-lane-v1.png";
import windBackdrop from "../assets/expeditions/production/9fo/runtime/backgrounds/po-nine-across-wind-ravine-v1.png";
import scaleEmpty from "../assets/expeditions/production/9fo/runtime/objectives/po-unequal-crossing-scale-one-hex-v1.png";
import scaleUnder from "../assets/expeditions/production/9fo/runtime/objectives/po-unequal-crossing-scale-under-v1.png";
import scaleOverloaded from "../assets/expeditions/production/9fo/runtime/objectives/po-unequal-crossing-scale-overloaded-v1.png";
import scaleComplete from "../assets/expeditions/production/9fo/runtime/objectives/po-unequal-crossing-scale-arch-open-v1.png";
import burrow from "../assets/expeditions/production/9fo/runtime/objectives/po-unequal-crossing-burrow-v1.png";
import ciderPress from "../assets/expeditions/production/9fo/runtime/objectives/po-cider-press-v1.png";
import appleBasket from "../assets/expeditions/production/9fo/runtime/objectives/po-cider-apple-basket-v1.png";
import harvestGate from "../assets/expeditions/production/9fo/runtime/objectives/po-cider-harvest-gate-v1.svg";
import ciderFlow from "../assets/expeditions/production/9fo/runtime/effects/po-cider-flow-arrow-v2.png";
import ciderValueChange from "../assets/expeditions/production/9fo/runtime/effects/po-cider-value-change-v1.png";
import scruffcrowPerch from "../assets/expeditions/production/9fo/runtime/enemies/po-scruffcrow-perch-v1.png";
import scruffcrowPeck from "../assets/expeditions/production/9fo/runtime/enemies/po-scruffcrow-peck-v1.png";
import scruffcrowFlee from "../assets/expeditions/production/9fo/runtime/enemies/po-scruffcrow-flee-v1.png";
import currentTurner from "../assets/expeditions/production/9fo/runtime/mechanisms/po-current-turner-hex-v1.png";
import turningBridgeCapacity from "../assets/expeditions/production/9fo/runtime/effects/po-turning-bridge-capacity-v1.png";
import turningBridgeWindPath from "../assets/expeditions/production/9fo/runtime/effects/po-turning-bridge-wind-path-v1.png";
import windVane from "../assets/expeditions/production/9fo/runtime/objectives/po-wind-vane-v1.svg";
import safeAlcove from "../assets/expeditions/production/9fo/runtime/objectives/po-wind-safe-alcove-v1.png";
import crosswindIdle from "../assets/expeditions/production/9fo/runtime/enemies/po-crosswind-idle-v1.png";
import crosswindTelegraph from "../assets/expeditions/production/9fo/runtime/enemies/po-crosswind-telegraph-v1.png";
import crosswindHit from "../assets/expeditions/production/9fo/runtime/enemies/po-crosswind-hit-v1.png";
import crosswindDefeated from "../assets/expeditions/production/9fo/runtime/enemies/po-crosswind-defeated-v1.png";
import hookmoleHit from "../assets/expeditions/production/9fo/runtime/enemies/po-hookmole-hit-v1.png";
import hookmoleDefeated from "../assets/expeditions/production/9fo/runtime/enemies/po-hookmole-defeated-v1.png";
import heroFrame from "../assets/expeditions/production/9fo/runtime/ui/po-hero-card-frame-wide-v1.png";
import actionLogPlaque from "../assets/expeditions/production/9fo/runtime/ui/po-action-log-plaque-v1.png";
import yourTurnFlash from "../assets/expeditions/production/9fo/runtime/ui/po-your-turn-flash-v1.png";
import enemyTurnFlash from "../assets/expeditions/production/9fo/runtime/ui/po-enemy-turn-flash-v1.png";

// 2026-09-21 batch: enemy/mechanism/objective art for maps that previously had none at all
// (Rootfire Relay, Maybe-Flock Roost, Hedgejaw Maze, Murder at Moonfall, Orchard Lockdown,
// Hollow Bough, First Whistle) plus the your-turn/enemy-turn banner. Only assets with an
// unambiguous match to a live object/enemy id are wired here — several delivered files
// (po-orchard-root-fall-marker, po-hive-ledger-board, po-moonfall-ring-stone/-gap,
// po-orchard-lockdown-gate/-living-gate, po-rootfire-chain/-bridge-root-link/-source-fruit,
// po-overgrowth-forecast/-safe-path, po-turning-bridge-capacity/-wind-path,
// po-orchard-lockdown-group-outline/-pulse) have no clear single-hex or single-object target
// and are left unwired rather than guessed at — a real follow-up, not an oversight.
import strawlingIdle from "../assets/expeditions/production/9fo/runtime/enemies/po-strawling-idle-v1.png";
import strawlingTelegraph from "../assets/expeditions/production/9fo/runtime/enemies/po-strawling-telegraph-v1.png";
import strawlingDefeated from "../assets/expeditions/production/9fo/runtime/enemies/po-strawling-defeated-v1.png";
import roostWhistleTower from "../assets/expeditions/production/9fo/runtime/objectives/po-rooststorm-whistle-tower-v2.png";
import roostWindDial from "../assets/expeditions/production/9fo/runtime/mechanisms/po-rooststorm-wind-dial-v2.png";
import roostStormFront from "../assets/expeditions/production/9fo/runtime/effects/po-rooststorm-front-v2.png";
import maybeFinchIdle from "../assets/expeditions/production/9fo/runtime/enemies/po-maybe-finch-idle-v2.png";
import maybeFinchTelegraph from "../assets/expeditions/production/9fo/runtime/enemies/po-maybe-finch-telegraph-v2.png";
import maybeFinchDefeated from "../assets/expeditions/production/9fo/runtime/enemies/po-maybe-finch-defeated-v2.png";
import hedgejawIdle from "../assets/expeditions/production/9fo/runtime/enemies/po-hedgejaw-idle-v1.svg";
import hedgejawTelegraph from "../assets/expeditions/production/9fo/runtime/enemies/po-hedgejaw-telegraph-v1.svg";
import hedgejawDefeated from "../assets/expeditions/production/9fo/runtime/enemies/po-hedgejaw-defeated-v1.svg";
import hedgejawNumberStone from "../assets/expeditions/production/9fo/runtime/objectives/po-hedgejaw-number-stone-v1.svg";
import hedgejawColourGate from "../assets/expeditions/production/9fo/runtime/objectives/po-hedgejaw-colour-gate-v1.svg";
import hedgejawRouteCue from "../assets/expeditions/production/9fo/runtime/effects/po-hedgejaw-route-cue-v1.svg";
import crowbreakerIdle from "../assets/expeditions/production/9fo/runtime/enemies/po-crowbreaker-idle-v1.png";
import crowbreakerTelegraph from "../assets/expeditions/production/9fo/runtime/enemies/po-crowbreaker-telegraph-v1.png";
import branchPort from "../assets/expeditions/production/9fo/runtime/mechanisms/po-first-whistle-branch-port-v1.png";
import signalRootNetwork from "../assets/expeditions/production/9fo/runtime/mechanisms/po-first-whistle-signal-root-network-v1.png";
import firstWhistleShield from "../assets/expeditions/production/9fo/runtime/effects/po-first-whistle-shield-v1.png";
import firstWhistleVulnerability from "../assets/expeditions/production/9fo/runtime/effects/po-first-whistle-strike-vulnerability-v1.png";
import foundingStone from "../assets/expeditions/production/9fo/runtime/objectives/po-first-whistle-founding-stone-v1.png";
import ledgerCorruption from "../assets/expeditions/production/9fo/runtime/mechanisms/po-hive-ledger-corruption-v1.png";
import ledgerSolvedCell from "../assets/expeditions/production/9fo/runtime/mechanisms/po-hive-ledger-solved-cell-v1.png";
import ledgerBoard from "../assets/expeditions/production/9fo/runtime/mechanisms/po-hive-ledger-board-v1.png";
import lockdownGate from "../assets/expeditions/production/9fo/runtime/mechanisms/po-orchard-lockdown-gate-v1.png";
import lockdownLivingGate from "../assets/expeditions/production/9fo/runtime/objectives/po-orchard-lockdown-living-gate-v1.png";
import lockdownGroupOutline from "../assets/expeditions/production/9fo/runtime/effects/po-orchard-lockdown-group-outline-v1.png";
import lockdownPulse from "../assets/expeditions/production/9fo/runtime/effects/po-orchard-lockdown-pulse-v1.png";
import relayNode from "../assets/expeditions/production/9fo/runtime/mechanisms/po-rootfire-relay-node-v1.png";
import rootfireParity from "../assets/expeditions/production/9fo/runtime/effects/po-rootfire-parity-v1.png";
import rootfirePulse from "../assets/expeditions/production/9fo/runtime/effects/po-rootfire-pulse-v1.png";
import rootfireSourceFruit from "../assets/expeditions/production/9fo/runtime/objectives/po-rootfire-source-fruit-v1.png";
import rootfireBridgeLink from "../assets/expeditions/production/9fo/runtime/objectives/po-rootfire-bridge-root-link-v1.png";
import memorialHex from "../assets/expeditions/production/9fo/runtime/objectives/po-hollow-bough-memorial-hex-v1.png";
import overgrowthDamage from "../assets/expeditions/production/9fo/runtime/effects/po-overgrowth-damage-v1.png";
import hollowBoughLivingBranches from "../assets/expeditions/production/9fo/runtime/objectives/po-hollow-bough-living-branches-v1.png";
import hollowBoughRootBarrier from "../assets/expeditions/production/9fo/runtime/objectives/po-orchard-living-root-barrier-v1.png";
import overgrowthForecast from "../assets/expeditions/production/9fo/runtime/effects/po-overgrowth-forecast-v1.png";
import moonfallRingStone1 from "../assets/expeditions/production/9fo/runtime/objectives/po-moonfall-ring-stone-v1.png";
import moonfallRingStone2 from "../assets/expeditions/production/9fo/runtime/objectives/po-moonfall-ring-stone-v2.png";
import moonfallRingStone3 from "../assets/expeditions/production/9fo/runtime/objectives/po-moonfall-ring-stone-v3.png";
import moonfallRingGap from "../assets/expeditions/production/9fo/runtime/mechanisms/po-moonfall-ring-gap-v1.png";
import moonfallContainment from "../assets/expeditions/production/9fo/runtime/effects/po-moonfall-containment-v1.png";

import moveNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-move-normal-v2.png";
import moveSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-move-selected-v2.png";
import moveDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-move-disabled-v2.png";
import pickupNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-normal-v2.png";
import pickupSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-selected-v2.png";
import pickupDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-disabled-v2.png";
import putdownNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-put-down-normal-v2.png";
import putdownSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-put-down-selected-v2.png";
import putdownDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-put-down-disabled-v2.png";
import guardNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-guard-normal-v2.png";
import guardSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-guard-selected-v2.png";
import guardDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-guard-disabled-v2.png";
import attackNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-attack-normal-v2.png";
import attackSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-attack-selected-v2.png";
import attackDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-attack-disabled-v2.png";
import rotateNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-rotate-normal-v2.png";
import rotateSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-rotate-selected-v2.png";
import rotateDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-rotate-disabled-v2.png";
import undoNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-undo-normal-v2.png";
import undoSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-undo-selected-v2.png";
import undoDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-undo-disabled-v2.png";
import endNormal from "../assets/expeditions/production/9fo/runtime/ui/po-action-end-round-normal-v2.png";
import endSelected from "../assets/expeditions/production/9fo/runtime/ui/po-action-end-round-selected-v2.png";
import endDisabled from "../assets/expeditions/production/9fo/runtime/ui/po-action-end-round-disabled-v2.png";

// 2026-09-22 batch: the pre-game squad/briefing screen (ExpeditionScreen.jsx) had no
// Ninefold-specific art at all until now — plain Panels/buttons regardless of module. Also the
// six pressure-lane icons, matching the six lane names every scenario's flags.pressureLanes
// already names in code (see cider-run.js, examination-clock.js, etc.) but which the UI has
// never actually shown a player anywhere.
import squadSelectBackdrop from "../assets/expeditions/production/9fo/runtime/backgrounds/po-squad-select-backdrop-v1.png";
import squadBriefingPanel from "../assets/expeditions/production/9fo/runtime/ui/po-squad-briefing-panel-v1.png";
import squadPartyTray from "../assets/expeditions/production/9fo/runtime/ui/po-squad-party-tray-v1.png";
import squadCoveragePlaque from "../assets/expeditions/production/9fo/runtime/ui/po-squad-coverage-plaque-v1.png";
import squadEmbarkButton from "../assets/expeditions/production/9fo/runtime/ui/po-squad-embark-button-v1.png";
import squadSurvivalBadges from "../assets/expeditions/production/9fo/runtime/ui/po-squad-survival-badges-v1.png";
import squadCardSelectionCorners from "../assets/expeditions/production/9fo/runtime/ui/po-squad-card-selection-corners-v1.png";
import pressureNumber from "../assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-number-v1.png";
import pressureReach from "../assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-reach-v1.png";
import pressureShape from "../assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-shape-v1.png";
import pressureTruth from "../assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-truth-v1.png";
import pressureChange from "../assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-change-v1.png";
import pressureThreat from "../assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-threat-v1.png";
import apBadge from "../assets/expeditions/production/9fo/runtime/ui/po-ap-badge-v1.png";
import heartBadge from "../assets/expeditions/production/9fo/runtime/ui/po-heart-badge-v1.png";

export const NFO_SCENE_ART = {
  backgrounds: { po_cider_run: ciderBackdrop, po_nine_across: windBackdrop },
  unequalCrossing: { scaleEmpty, scaleUnder, scaleOverloaded, scaleComplete, burrow, hookmoleHit, hookmoleDefeated },
  ciderRun: { ciderPress, appleBasket, harvestGate, ciderFlow, ciderValueChange, scruffcrowPerch, scruffcrowPeck, scruffcrowFlee },
  nineAcross: { currentTurner, windVane, safeAlcove, crosswindIdle, crosswindTelegraph, crosswindHit, crosswindDefeated, capacity: turningBridgeCapacity, windPath: turningBridgeWindPath },
  rootfireRelay: { strawlingIdle, strawlingTelegraph, strawlingDefeated, relayNode, rootfireParity, rootfirePulse, sourceFruit: rootfireSourceFruit, bridgeLink: rootfireBridgeLink },
  maybeFlockRoost: { maybeFinchIdle, maybeFinchTelegraph, maybeFinchDefeated, whistleTower: roostWhistleTower, windDial: roostWindDial, stormFront: roostStormFront },
  hedgejawMaze: { hedgejawIdle, hedgejawTelegraph, hedgejawDefeated, numberStone: hedgejawNumberStone, colourGate: hedgejawColourGate, routeCue: hedgejawRouteCue },
  murderAtMoonfall: { crowbreakerIdle, crowbreakerTelegraph, ringStones: [moonfallRingStone1, moonfallRingStone2, moonfallRingStone3], ringGap: moonfallRingGap, containment: moonfallContainment },
  orchardLockdown: { ledgerCorruption, ledgerSolvedCell, board: ledgerBoard, gate: lockdownGate, livingGate: lockdownLivingGate, groupOutline: lockdownGroupOutline, pulse: lockdownPulse },
  hollowBough: { memorialHex, overgrowthDamage, livingBranches: hollowBoughLivingBranches, rootBarrier: hollowBoughRootBarrier, forecast: overgrowthForecast },
  firstWhistle: { branchPort, signalRootNetwork, foundingStone, firstWhistleShield, firstWhistleVulnerability },
  ui: {
    heroFrame,
    actionLogPlaque,
    turnBanner: { player: yourTurnFlash, enemy: enemyTurnFlash },
    apBadge,
    heartBadge,
    squadSelect: {
      backdrop: squadSelectBackdrop,
      briefingPanel: squadBriefingPanel,
      partyTray: squadPartyTray,
      coveragePlaque: squadCoveragePlaque,
      embarkButton: squadEmbarkButton,
      survivalBadges: squadSurvivalBadges,
      cardSelectionCorners: squadCardSelectionCorners,
    },
    pressure: { number: pressureNumber, reach: pressureReach, shape: pressureShape, truth: pressureTruth, change: pressureChange, threat: pressureThreat },
    buttons: {
      Move: [moveNormal, moveSelected, moveDisabled],
      "Pick up": [pickupNormal, pickupSelected, pickupDisabled],
      "Put down": [putdownNormal, putdownSelected, putdownDisabled],
      Guard: [guardNormal, guardSelected, guardDisabled],
      Attack: [attackNormal, attackSelected, attackDisabled],
      Rotate: [rotateNormal, rotateSelected, rotateDisabled],
      Undo: [undoNormal, undoSelected, undoDisabled],
      "End round": [endNormal, endSelected, endDisabled],
    },
  },
};
