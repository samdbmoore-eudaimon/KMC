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

export const NFO_SCENE_ART = {
  backgrounds: { po_cider_run: ciderBackdrop, po_nine_across: windBackdrop },
  unequalCrossing: { scaleEmpty, scaleUnder, scaleOverloaded, scaleComplete, burrow, hookmoleHit, hookmoleDefeated },
  ciderRun: { ciderPress, appleBasket, harvestGate, ciderFlow, ciderValueChange, scruffcrowPerch, scruffcrowPeck, scruffcrowFlee },
  nineAcross: { currentTurner, windVane, safeAlcove, crosswindIdle, crosswindTelegraph, crosswindHit, crosswindDefeated },
  ui: {
    heroFrame,
    actionLogPlaque,
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
