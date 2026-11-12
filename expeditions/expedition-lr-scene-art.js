// Lanterns/Smudged Stones (Little Reckoning) scene art -- mirrors expedition-9fo-scene-art.js's
// shape/pattern exactly (2026-09-21). Full character roster (30 profiles, action/carry/
// exhausted/idle-back/idle-front), terrain, effects, mechanisms, props and the one enemy with a
// named pose set (Fog-thumb) were delivered as a complete parallel art pipeline to 9fo's -- see
// assets/expeditions/production/lr/runtime/. No dedicated UI-frame chrome (hero frame, action-log
// plaque, action-button icons) exists for this module yet, so junior scenes borrow 9fo's (see
// ExpeditionBoard.jsx's isNinefoldOrchard, which now covers junior too) rather than falling back
// to the plain pre-illustrated layout -- both modules share the same warm register.

import addyAction from "../assets/expeditions/production/lr/runtime/characters/lr-addy-action-v1.webp";
import addyCarry from "../assets/expeditions/production/lr/runtime/characters/lr-addy-carry-v1.webp";
import addyExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-addy-exhausted-v1.webp";
import addyIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-addy-idle-back-v1.webp";
import addyIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-addy-idle-front-v1.webp";
import anglorapAction from "../assets/expeditions/production/lr/runtime/characters/lr-anglorap-action-v1.webp";
import anglorapCarry from "../assets/expeditions/production/lr/runtime/characters/lr-anglorap-carry-v1.webp";
import anglorapExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-anglorap-exhausted-v1.webp";
import anglorapIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-anglorap-idle-back-v1.webp";
import anglorapIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-anglorap-idle-front-v1.webp";
import burrowlAction from "../assets/expeditions/production/lr/runtime/characters/lr-burrowl-action-v1.webp";
import burrowlCarry from "../assets/expeditions/production/lr/runtime/characters/lr-burrowl-carry-v1.webp";
import burrowlExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-burrowl-exhausted-v1.webp";
import burrowlIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-burrowl-idle-back-v1.webp";
import burrowlIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-burrowl-idle-front-v1.webp";
import cheetawatAction from "../assets/expeditions/production/lr/runtime/characters/lr-cheetawat-action-v1.webp";
import cheetawatCarry from "../assets/expeditions/production/lr/runtime/characters/lr-cheetawat-carry-v1.webp";
import cheetawatExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-cheetawat-exhausted-v1.webp";
import cheetawatIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-cheetawat-idle-back-v1.webp";
import cheetawatIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-cheetawat-idle-front-v1.webp";
import countraAction from "../assets/expeditions/production/lr/runtime/characters/lr-countra-action-v1.webp";
import countraCarry from "../assets/expeditions/production/lr/runtime/characters/lr-countra-carry-v1.webp";
import countraExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-countra-exhausted-v1.webp";
import countraIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-countra-idle-back-v1.webp";
import countraIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-countra-idle-front-v1.webp";
import cubbleAction from "../assets/expeditions/production/lr/runtime/characters/lr-cubble-action-v1.webp";
import cubbleCarry from "../assets/expeditions/production/lr/runtime/characters/lr-cubble-carry-v1.webp";
import cubbleExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-cubble-exhausted-v1.webp";
import cubbleIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-cubble-idle-back-v1.webp";
import cubbleIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-cubble-idle-front-v1.webp";
import euclidonAction from "../assets/expeditions/production/lr/runtime/characters/lr-euclidon-action-v1.webp";
import euclidonCarry from "../assets/expeditions/production/lr/runtime/characters/lr-euclidon-carry-v1.webp";
import euclidonExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-euclidon-exhausted-v1.webp";
import euclidonIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-euclidon-idle-back-v1.webp";
import euclidonIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-euclidon-idle-front-v1.webp";
import flaskfoxAction from "../assets/expeditions/production/lr/runtime/characters/lr-flaskfox-action-v1.webp";
import flaskfoxCarry from "../assets/expeditions/production/lr/runtime/characters/lr-flaskfox-carry-v1.webp";
import flaskfoxExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-flaskfox-exhausted-v1.webp";
import flaskfoxIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-flaskfox-idle-back-v1.webp";
import flaskfoxIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-flaskfox-idle-front-v1.webp";
import fractailAction from "../assets/expeditions/production/lr/runtime/characters/lr-fractail-action-v1.webp";
import fractailCarry from "../assets/expeditions/production/lr/runtime/characters/lr-fractail-carry-v1.webp";
import fractailExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-fractail-exhausted-v1.webp";
import fractailIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-fractail-idle-back-v1.webp";
import fractailIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-fractail-idle-front-v1.webp";
import frostcalAction from "../assets/expeditions/production/lr/runtime/characters/lr-frostcal-action-v1.webp";
import frostcalCarry from "../assets/expeditions/production/lr/runtime/characters/lr-frostcal-carry-v1.webp";
import frostcalExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-frostcal-exhausted-v1.webp";
import frostcalIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-frostcal-idle-back-v1.webp";
import frostcalIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-frostcal-idle-front-v1.webp";
import geodrakeAction from "../assets/expeditions/production/lr/runtime/characters/lr-geodrake-action-v1.webp";
import geodrakeCarry from "../assets/expeditions/production/lr/runtime/characters/lr-geodrake-carry-v1.webp";
import geodrakeExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-geodrake-exhausted-v1.webp";
import geodrakeIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-geodrake-idle-back-v1.webp";
import geodrakeIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-geodrake-idle-front-v1.webp";
import hexabugAction from "../assets/expeditions/production/lr/runtime/characters/lr-hexabug-action-v1.webp";
import hexabugCarry from "../assets/expeditions/production/lr/runtime/characters/lr-hexabug-carry-v1.webp";
import hexabugExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-hexabug-exhausted-v1.webp";
import hexabugIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-hexabug-idle-back-v1.webp";
import hexabugIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-hexabug-idle-front-v1.webp";
import hunchikAction from "../assets/expeditions/production/lr/runtime/characters/lr-hunchik-action-v1.webp";
import hunchikCarry from "../assets/expeditions/production/lr/runtime/characters/lr-hunchik-carry-v1.webp";
import hunchikExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-hunchik-exhausted-v1.webp";
import hunchikIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-hunchik-idle-back-v1.webp";
import hunchikIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-hunchik-idle-front-v1.webp";
import infinitusAction from "../assets/expeditions/production/lr/runtime/characters/lr-infinitus-action-v1.webp";
import infinitusCarry from "../assets/expeditions/production/lr/runtime/characters/lr-infinitus-carry-v1.webp";
import infinitusExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-infinitus-exhausted-v1.webp";
import infinitusIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-infinitus-idle-back-v1.webp";
import infinitusIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-infinitus-idle-front-v1.webp";
import loopyAction from "../assets/expeditions/production/lr/runtime/characters/lr-loopy-action-v1.webp";
import loopyCarry from "../assets/expeditions/production/lr/runtime/characters/lr-loopy-carry-v1.webp";
import loopyExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-loopy-exhausted-v1.webp";
import loopyIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-loopy-idle-back-v1.webp";
import loopyIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-loopy-idle-front-v1.webp";
import multimooAction from "../assets/expeditions/production/lr/runtime/characters/lr-multimoo-action-v1.webp";
import multimooCarry from "../assets/expeditions/production/lr/runtime/characters/lr-multimoo-carry-v1.webp";
import multimooExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-multimoo-exhausted-v1.webp";
import multimooIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-multimoo-idle-back-v1.webp";
import multimooIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-multimoo-idle-front-v1.webp";
import novabearAction from "../assets/expeditions/production/lr/runtime/characters/lr-novabear-action-v1.webp";
import novabearCarry from "../assets/expeditions/production/lr/runtime/characters/lr-novabear-carry-v1.webp";
import novabearExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-novabear-exhausted-v1.webp";
import novabearIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-novabear-idle-back-v1.webp";
import novabearIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-novabear-idle-front-v1.webp";
import owlgorithAction from "../assets/expeditions/production/lr/runtime/characters/lr-owlgorith-action-v1.webp";
import owlgorithCarry from "../assets/expeditions/production/lr/runtime/characters/lr-owlgorith-carry-v1.webp";
import owlgorithExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-owlgorith-exhausted-v1.webp";
import owlgorithIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-owlgorith-idle-back-v1.webp";
import owlgorithIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-owlgorith-idle-front-v1.webp";
import paradoxAction from "../assets/expeditions/production/lr/runtime/characters/lr-paradox-action-v1.webp";
import paradoxCarry from "../assets/expeditions/production/lr/runtime/characters/lr-paradox-carry-v1.webp";
import paradoxExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-paradox-exhausted-v1.webp";
import paradoxIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-paradox-idle-back-v1.webp";
import paradoxIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-paradox-idle-front-v1.webp";
import pebbleAction from "../assets/expeditions/production/lr/runtime/characters/lr-pebble-action-v1.webp";
import pebbleCarry from "../assets/expeditions/production/lr/runtime/characters/lr-pebble-carry-v1.webp";
import pebbleExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-pebble-exhausted-v1.webp";
import pebbleIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-pebble-idle-back-v1.webp";
import pebbleIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-pebble-idle-front-v1.webp";
import primearchAction from "../assets/expeditions/production/lr/runtime/characters/lr-primearch-action-v1.webp";
import primearchCarry from "../assets/expeditions/production/lr/runtime/characters/lr-primearch-carry-v1.webp";
import primearchExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-primearch-exhausted-v1.webp";
import primearchIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-primearch-idle-back-v1.webp";
import primearchIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-primearch-idle-front-v1.webp";
import probearAction from "../assets/expeditions/production/lr/runtime/characters/lr-probear-action-v1.webp";
import probearCarry from "../assets/expeditions/production/lr/runtime/characters/lr-probear-carry-v1.webp";
import probearExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-probear-exhausted-v1.webp";
import probearIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-probear-idle-back-v1.webp";
import probearIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-probear-idle-front-v1.webp";
import quantakitAction from "../assets/expeditions/production/lr/runtime/characters/lr-quantakit-action-v1.webp";
import quantakitCarry from "../assets/expeditions/production/lr/runtime/characters/lr-quantakit-carry-v1.webp";
import quantakitExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-quantakit-exhausted-v1.webp";
import quantakitIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-quantakit-idle-back-v1.webp";
import quantakitIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-quantakit-idle-front-v1.webp";
import seqviperAction from "../assets/expeditions/production/lr/runtime/characters/lr-seqviper-action-v1.webp";
import seqviperCarry from "../assets/expeditions/production/lr/runtime/characters/lr-seqviper-carry-v1.webp";
import seqviperExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-seqviper-exhausted-v1.webp";
import seqviperIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-seqviper-idle-back-v1.webp";
import seqviperIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-seqviper-idle-front-v1.webp";
import sparkfinAction from "../assets/expeditions/production/lr/runtime/characters/lr-sparkfin-action-v1.webp";
import sparkfinCarry from "../assets/expeditions/production/lr/runtime/characters/lr-sparkfin-carry-v1.webp";
import sparkfinExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-sparkfin-exhausted-v1.webp";
import sparkfinIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-sparkfin-idle-back-v1.webp";
import sparkfinIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-sparkfin-idle-front-v1.webp";
import sphinxaAction from "../assets/expeditions/production/lr/runtime/characters/lr-sphinxa-action-v1.webp";
import sphinxaCarry from "../assets/expeditions/production/lr/runtime/characters/lr-sphinxa-carry-v1.webp";
import sphinxaExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-sphinxa-exhausted-v1.webp";
import sphinxaIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-sphinxa-idle-back-v1.webp";
import sphinxaIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-sphinxa-idle-front-v1.webp";
import squarbyAction from "../assets/expeditions/production/lr/runtime/characters/lr-squarby-action-v1.webp";
import squarbyCarry from "../assets/expeditions/production/lr/runtime/characters/lr-squarby-carry-v1.webp";
import squarbyExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-squarby-exhausted-v1.webp";
import squarbyIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-squarby-idle-back-v1.webp";
import squarbyIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-squarby-idle-front-v1.webp";
import tritipAction from "../assets/expeditions/production/lr/runtime/characters/lr-tritip-action-v1.webp";
import tritipCarry from "../assets/expeditions/production/lr/runtime/characters/lr-tritip-carry-v1.webp";
import tritipExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-tritip-exhausted-v1.webp";
import tritipIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-tritip-idle-back-v1.webp";
import tritipIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-tritip-idle-front-v1.webp";
import voltbirdAction from "../assets/expeditions/production/lr/runtime/characters/lr-voltbird-action-v1.webp";
import voltbirdCarry from "../assets/expeditions/production/lr/runtime/characters/lr-voltbird-carry-v1.webp";
import voltbirdExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-voltbird-exhausted-v1.webp";
import voltbirdIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-voltbird-idle-back-v1.webp";
import voltbirdIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-voltbird-idle-front-v1.webp";
import zoombyAction from "../assets/expeditions/production/lr/runtime/characters/lr-zoomby-action-v1.webp";
import zoombyCarry from "../assets/expeditions/production/lr/runtime/characters/lr-zoomby-carry-v1.webp";
import zoombyExhausted from "../assets/expeditions/production/lr/runtime/characters/lr-zoomby-exhausted-v1.webp";
import zoombyIdleBack from "../assets/expeditions/production/lr/runtime/characters/lr-zoomby-idle-back-v1.webp";
import zoombyIdleFront from "../assets/expeditions/production/lr/runtime/characters/lr-zoomby-idle-front-v1.webp";

import terrainCrystal from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-crystal-v1.webp";
import terrainExit from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-exit-v1.webp";
import terrainFlagstone from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-flagstone-v1.webp";
import terrainFog from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-fog-v1.webp";
import terrainInkStone from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-ink-stone-v1.webp";
import terrainMapEdge from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-map-edge-v1.webp";
import terrainMoorGrass from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-moor-grass-v1.webp";
import terrainOperatorSocket from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-operator-socket-v1.webp";
import terrainParchmentPath from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-parchment-path-v1.webp";
import terrainStart from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-start-v1.webp";
import terrainStoneBridge from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-stone-bridge-v1.webp";
import terrainStream from "../assets/expeditions/production/lr/runtime/terrain/lr-terrain-stream-v1.webp";

import fxComplete from "../assets/expeditions/production/lr/runtime/effects/lr-fx-complete-v1.webp";
import fxDanger from "../assets/expeditions/production/lr/runtime/effects/lr-fx-danger-v1.webp";
import fxGuard from "../assets/expeditions/production/lr/runtime/effects/lr-fx-guard-v1.webp";
import fxImpact from "../assets/expeditions/production/lr/runtime/effects/lr-fx-impact-v1.webp";
import fxReachable from "../assets/expeditions/production/lr/runtime/effects/lr-fx-reachable-v1.webp";
import fxRotate from "../assets/expeditions/production/lr/runtime/effects/lr-fx-rotate-v1.webp";
import fxSelected from "../assets/expeditions/production/lr/runtime/effects/lr-fx-selected-v1.webp";
import fxShadow from "../assets/expeditions/production/lr/runtime/effects/lr-fx-shadow-v1.webp";

import fogThumbBlocked from "../assets/expeditions/production/lr/runtime/enemies/lr-fog-thumb-blocked-v1.webp";
import fogThumbIdleBack from "../assets/expeditions/production/lr/runtime/enemies/lr-fog-thumb-idle-back-v1.webp";
import fogThumbIdleFront from "../assets/expeditions/production/lr/runtime/enemies/lr-fog-thumb-idle-front-v1.webp";
import fogThumbObscure from "../assets/expeditions/production/lr/runtime/enemies/lr-fog-thumb-obscure-v1.webp";

import operatorComplete from "../assets/expeditions/production/lr/runtime/mechanisms/lr-operator-complete-v1.webp";
import operatorLocked from "../assets/expeditions/production/lr/runtime/mechanisms/lr-operator-locked-v1.webp";
import operatorNeutral from "../assets/expeditions/production/lr/runtime/mechanisms/lr-operator-neutral-v1.webp";
import operatorObscured from "../assets/expeditions/production/lr/runtime/mechanisms/lr-operator-obscured-v1.webp";
import operatorSelected from "../assets/expeditions/production/lr/runtime/mechanisms/lr-operator-selected-v1.webp";
import operatorTurning from "../assets/expeditions/production/lr/runtime/mechanisms/lr-operator-turning-v1.webp";

import loadCarried from "../assets/expeditions/production/lr/runtime/props/lr-load-carried-v1.webp";
import loadCombined from "../assets/expeditions/production/lr/runtime/props/lr-load-combined-v1.webp";
import loadDelivered from "../assets/expeditions/production/lr/runtime/props/lr-load-delivered-v1.webp";
import loadGuarded from "../assets/expeditions/production/lr/runtime/props/lr-load-guarded-v1.webp";
import loadHeavy from "../assets/expeditions/production/lr/runtime/props/lr-load-heavy-v1.webp";
import loadNeutral from "../assets/expeditions/production/lr/runtime/props/lr-load-neutral-v1.webp";
import loadSelected from "../assets/expeditions/production/lr/runtime/props/lr-load-selected-v1.webp";
import loadSplit from "../assets/expeditions/production/lr/runtime/props/lr-load-split-v1.webp";

import smudgedStonesBackdrop from "../assets/expeditions/production/lr/runtime/backgrounds/lr-smudged-stones-v2.webp";

export const LR_SCENE_ART = {
  backgrounds: { lr_smudged_stones: smudgedStonesBackdrop },
  characters: {
    addy: { action: addyAction, carry: addyCarry, exhausted: addyExhausted, idleBack: addyIdleBack, idleFront: addyIdleFront },
    anglorap: { action: anglorapAction, carry: anglorapCarry, exhausted: anglorapExhausted, idleBack: anglorapIdleBack, idleFront: anglorapIdleFront },
    burrowl: { action: burrowlAction, carry: burrowlCarry, exhausted: burrowlExhausted, idleBack: burrowlIdleBack, idleFront: burrowlIdleFront },
    cheetawat: { action: cheetawatAction, carry: cheetawatCarry, exhausted: cheetawatExhausted, idleBack: cheetawatIdleBack, idleFront: cheetawatIdleFront },
    countra: { action: countraAction, carry: countraCarry, exhausted: countraExhausted, idleBack: countraIdleBack, idleFront: countraIdleFront },
    cubble: { action: cubbleAction, carry: cubbleCarry, exhausted: cubbleExhausted, idleBack: cubbleIdleBack, idleFront: cubbleIdleFront },
    euclidon: { action: euclidonAction, carry: euclidonCarry, exhausted: euclidonExhausted, idleBack: euclidonIdleBack, idleFront: euclidonIdleFront },
    flaskfox: { action: flaskfoxAction, carry: flaskfoxCarry, exhausted: flaskfoxExhausted, idleBack: flaskfoxIdleBack, idleFront: flaskfoxIdleFront },
    fractail: { action: fractailAction, carry: fractailCarry, exhausted: fractailExhausted, idleBack: fractailIdleBack, idleFront: fractailIdleFront },
    frostcal: { action: frostcalAction, carry: frostcalCarry, exhausted: frostcalExhausted, idleBack: frostcalIdleBack, idleFront: frostcalIdleFront },
    geodrake: { action: geodrakeAction, carry: geodrakeCarry, exhausted: geodrakeExhausted, idleBack: geodrakeIdleBack, idleFront: geodrakeIdleFront },
    hexabug: { action: hexabugAction, carry: hexabugCarry, exhausted: hexabugExhausted, idleBack: hexabugIdleBack, idleFront: hexabugIdleFront },
    hunchik: { action: hunchikAction, carry: hunchikCarry, exhausted: hunchikExhausted, idleBack: hunchikIdleBack, idleFront: hunchikIdleFront },
    infinitus: { action: infinitusAction, carry: infinitusCarry, exhausted: infinitusExhausted, idleBack: infinitusIdleBack, idleFront: infinitusIdleFront },
    loopy: { action: loopyAction, carry: loopyCarry, exhausted: loopyExhausted, idleBack: loopyIdleBack, idleFront: loopyIdleFront },
    multimoo: { action: multimooAction, carry: multimooCarry, exhausted: multimooExhausted, idleBack: multimooIdleBack, idleFront: multimooIdleFront },
    novabear: { action: novabearAction, carry: novabearCarry, exhausted: novabearExhausted, idleBack: novabearIdleBack, idleFront: novabearIdleFront },
    owlgorith: { action: owlgorithAction, carry: owlgorithCarry, exhausted: owlgorithExhausted, idleBack: owlgorithIdleBack, idleFront: owlgorithIdleFront },
    paradox: { action: paradoxAction, carry: paradoxCarry, exhausted: paradoxExhausted, idleBack: paradoxIdleBack, idleFront: paradoxIdleFront },
    pebble: { action: pebbleAction, carry: pebbleCarry, exhausted: pebbleExhausted, idleBack: pebbleIdleBack, idleFront: pebbleIdleFront },
    primearch: { action: primearchAction, carry: primearchCarry, exhausted: primearchExhausted, idleBack: primearchIdleBack, idleFront: primearchIdleFront },
    probear: { action: probearAction, carry: probearCarry, exhausted: probearExhausted, idleBack: probearIdleBack, idleFront: probearIdleFront },
    quantakit: { action: quantakitAction, carry: quantakitCarry, exhausted: quantakitExhausted, idleBack: quantakitIdleBack, idleFront: quantakitIdleFront },
    seqviper: { action: seqviperAction, carry: seqviperCarry, exhausted: seqviperExhausted, idleBack: seqviperIdleBack, idleFront: seqviperIdleFront },
    sparkfin: { action: sparkfinAction, carry: sparkfinCarry, exhausted: sparkfinExhausted, idleBack: sparkfinIdleBack, idleFront: sparkfinIdleFront },
    sphinxa: { action: sphinxaAction, carry: sphinxaCarry, exhausted: sphinxaExhausted, idleBack: sphinxaIdleBack, idleFront: sphinxaIdleFront },
    squarby: { action: squarbyAction, carry: squarbyCarry, exhausted: squarbyExhausted, idleBack: squarbyIdleBack, idleFront: squarbyIdleFront },
    tritip: { action: tritipAction, carry: tritipCarry, exhausted: tritipExhausted, idleBack: tritipIdleBack, idleFront: tritipIdleFront },
    voltbird: { action: voltbirdAction, carry: voltbirdCarry, exhausted: voltbirdExhausted, idleBack: voltbirdIdleBack, idleFront: voltbirdIdleFront },
    zoomby: { action: zoombyAction, carry: zoombyCarry, exhausted: zoombyExhausted, idleBack: zoombyIdleBack, idleFront: zoombyIdleFront },
  },
  terrain: { crystal: terrainCrystal, exit: terrainExit, flagstone: terrainFlagstone, fog: terrainFog, inkStone: terrainInkStone, mapEdge: terrainMapEdge, moorGrass: terrainMoorGrass, operatorSocket: terrainOperatorSocket, parchmentPath: terrainParchmentPath, start: terrainStart, stoneBridge: terrainStoneBridge, stream: terrainStream },
  effects: { complete: fxComplete, danger: fxDanger, guard: fxGuard, impact: fxImpact, reachable: fxReachable, rotate: fxRotate, selected: fxSelected, shadow: fxShadow },
  enemies: { fogThumb: { blocked: fogThumbBlocked, idleBack: fogThumbIdleBack, idleFront: fogThumbIdleFront, obscure: fogThumbObscure } },
  operator: { complete: operatorComplete, locked: operatorLocked, neutral: operatorNeutral, obscured: operatorObscured, selected: operatorSelected, turning: operatorTurning },
  load: { carried: loadCarried, combined: loadCombined, delivered: loadDelivered, guarded: loadGuarded, heavy: loadHeavy, neutral: loadNeutral, selected: loadSelected, split: loadSplit },
};
