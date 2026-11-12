// E6 presentation integration: the in-game flow (tactical board + result). Split out of
// ExpeditionScreen.jsx (which now owns only the pre-game map/briefing/squad flow).
//
// Generalised to run any of the three catalogued scenarios (not just The Unequal
// Crossing): the objective panel branches on `state.objective.family`, action dispatch
// goes through the command layer (applyExpeditionCommand) so the on-screen field report is
// driven by the same structured events the engine layer already produces, and Ninefold
// Orchard specifically renders the wiring-candidate art manifest (EXPEDITIONS_ART_HANDOVER.md)
// in place of the emoji/portrait stand-ins — Little Reckoning and Gifford have no manifest
// yet, so they keep the stand-ins, clearly a placeholder, which is fine behind the
// developer-only gate this whole screen sits behind.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { EXPEDITION_SCENARIOS, EXPEDITION_STAT_NAMES } from "./expedition-data.js";
import { catalogueEntry } from "./expedition-catalogue.js";
import {
  applyExpeditionCommand,
  computeExpeditionMarks,
  constraintSatisfied,
  evaluateObjective,
  explainExpeditionOutcome,
  graphConnected,
  hexDistance,
  hexNeighbours,
  reachableHexes,
  routeMarkerConnections,
} from "./expedition-engine.js";
import { migrateExpeditionProgress } from "../wm-progress.js";
import { applyExpeditionResult } from "../wm-progress-actions.js";
import { Panel, buttonStyle, hexPosition, unitAt, objectAt, objectLabel, DISCIPLINE_COLOURS, TERRAIN_COLOURS, MODULE_DISPLAY, EXPEDITION_MARK_LABELS, INK, GOLD, GREEN, RED } from "./expedition-ui-shared.jsx";
import { NINEFOLD_ORCHARD_ART } from "./expedition-9fo-art.js";
import { NINEFOLD_EXTRA_CHARACTERS } from "./expedition-9fo-extra-art.js";
import { NFO_SCENE_ART } from "./expedition-9fo-scene-art.js";
import { LR_SCENE_ART } from "./expedition-lr-scene-art.js";
import { NFO_UI_ART } from "../wm-9fo-ui-art.js";
import { fitPointyHexLayout, fitProjectedPointyHexLayout } from "./expedition-hex-layout.js";

const OPERATOR_CHOICES = ["+", "-", "*"];
const OPERATOR_SYMBOL = { "+": "+", "-": "−", "*": "×" };

// Ninefold Orchard (primary) + Little Reckoning (junior) art helpers — every lookup falls
// back to null so callers can drop straight back to the emoji/colour stand-ins used
// elsewhere without special-casing. Little Reckoning got a full parallel art pipeline
// (expedition-lr-scene-art.js, 2026-09-21) mirroring 9fo's shape exactly — card ids never
// collide between modules, so character art merges into one flat lookup below rather than
// needing a moduleKey branch of its own.
const ALL_CHARACTER_ART = { ...NINEFOLD_ORCHARD_ART.characters, ...NINEFOLD_EXTRA_CHARACTERS, ...LR_SCENE_ART.characters };
function nfoTerrainArt(terrain, tileKey, scenarioId, state) {
  if (state.moduleKey === "junior") {
    const art = LR_SCENE_ART.terrain;
    if (scenarioId === "lr_smudged_stones") {
      if (Object.values(state.objects).some((object) => object.kind === "operator" && object.pos === tileKey)) return art.operatorSocket;
      if (Object.values(state.objects).some((object) => object.kind === "number" && object.pos === tileKey)) return art.inkStone;
    }
    if (scenarioId === "lr_fog_lanterns") {
      if (Object.values(state.objects).some((object) => object.kind === "route-marker" && object.pos === tileKey)) return art.operatorSocket;
      if (Object.values(state.objects).some((object) => object.kind === "lantern" && object.pos === tileKey)) return art.stoneBridge;
    }
    const variants = [art.moorGrass, art.fog, art.flagstone, art.crystal, art.stream];
    const [q, r] = tileKey.split(",").map(Number);
    return variants[Math.abs(q * 13 + r * 17) % variants.length] || art.moorGrass;
  }
  const art = NINEFOLD_ORCHARD_ART.terrain;
  if (scenarioId === "po_cider_run") {
    // Data-driven, not inferred: the objective's own hexes and the scenario's declared
    // `flags.pathHexes` (cider-run.js) name exactly which tiles dress as gate/path, so a
    // geometry change never needs a matching renderer change (2026-09-18, Codex's review:
    // "the renderer should consume [data] fields rather than infer columns").
    if (state.objective.hexes?.includes(tileKey)) return art.objectiveSocket;
    if (state.flags.pathHexes?.includes(tileKey)) return art.path;
    return art.grass;
  }
  if (scenarioId === "po_nine_across" && (["0,-1", "0,0", "0,1"].includes(tileKey))) return art.timberBridge;
  if (scenarioId === "po_nine_across" && (["1,-1", "1,0", "1,1"].includes(tileKey))) return art.stoneBridge;
  if (scenarioId === "po_maybe_roost" && state.objective.hexes?.includes(tileKey)) return NFO_SCENE_ART.maybeFlockRoost.whistleTower;
  if (scenarioId === "po_hedgejaw_maze" && Object.values(state.objects).some((object) => object.kind === "stone" && object.requiredFrom === tileKey)) return NFO_SCENE_ART.hedgejawMaze.colourGate;
  if (scenarioId === "po_hollow_bough" && terrain !== "blocked") {
    const groveVariants = [art.hexGrass, NFO_SCENE_ART.hollowBough.livingBranches, NFO_SCENE_ART.hollowBough.rootBarrier, art.grass, art.flagstone];
    const [gq, gr] = tileKey.split(",").map(Number);
    return groveVariants[Math.abs(gq * 13 + gr * 17) % groveVariants.length] || art.hexGrass;
  }
  if (scenarioId === "po_count_the_murder") {
    // The Crowbreaker's six neighbours, computed the same way the "containment" objective
    // evaluator itself checks them (expedition-engine.js) rather than a second hardcoded hex
    // list: three are permanently hedge-walled (terrain: "blocked", murder-at-moonfall.js),
    // the other three are the open ring-gaps three heroes must each hold one of.
    const crowbreaker = state.units.crowbreaker;
    if (crowbreaker) {
      const neighbours = hexNeighbours(crowbreaker.pos);
      const stoneIndex = neighbours.indexOf(tileKey);
      if (terrain === "blocked" && stoneIndex !== -1) return NFO_SCENE_ART.murderAtMoonfall.ringStones[stoneIndex % NFO_SCENE_ART.murderAtMoonfall.ringStones.length];
      if (terrain !== "blocked" && stoneIndex !== -1) return NFO_SCENE_ART.murderAtMoonfall.ringGap;
    }
  }
  if (terrain === "blocked") return scenarioId === "po_unequal_crossing" && (tileKey === "0,-3" || tileKey === "1,-3") ? art.pond : (art.hexGrass || art.grass);
  if (terrain === "difficult") return art.roots || art.flagstone || art.hexGrass;
  const variants = [art.hexGrass, art.grass, art.path, art.hexGrass, art.flagstone];
  const [q, r] = tileKey.split(",").map(Number);
  return variants[Math.abs(q * 13 + r * 17) % variants.length] || art.hexGrass;
}
function nfoCharacterArt(unit) {
  const art = ALL_CHARACTER_ART[unit.id];
  if (!art) return null;
  if (unit.hp <= 0) return art.exhausted || art.idleFront;
  if (unit.carrying) return art.carry || art.action || art.idleFront;
  return art.idleFront;
}
function nfoEnemyArt(enemy, state) {
  if (enemy.id === "scruffcrow") return enemy.hp <= 0 ? NFO_SCENE_ART.ciderRun.scruffcrowFlee : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.ciderRun.scruffcrowPerch : NFO_SCENE_ART.ciderRun.scruffcrowPeck;
  if (enemy.id === "crosswind") return enemy.hp <= 0 ? NFO_SCENE_ART.nineAcross.crosswindDefeated : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.nineAcross.crosswindTelegraph : NFO_SCENE_ART.nineAcross.crosswindIdle;
  // Fog-thumb (The Smudged Stones): the one Little Reckoning enemy with a named pose set —
  // Ashen Print (smudge_b) has no matching art yet, so she stays on the emoji stand-in.
  if (enemy.id === "smudge_a") {
    if (enemy.hp <= 0) return null; // no "defeated" pose delivered for Fog-thumb yet
    const lastAction = state.history.filter((h) => h.unitId === "smudge_a").at(-1)?.action;
    if (lastAction === "blocked") return LR_SCENE_ART.enemies.fogThumb.blocked;
    if (lastAction === "obscure" || lastAction === "strike") return LR_SCENE_ART.enemies.fogThumb.obscure;
    return LR_SCENE_ART.enemies.fogThumb.idleFront; // delay, watching, moving, or nothing has happened yet
  }
  if (enemy.id === "strawling") return enemy.hp <= 0 ? NFO_SCENE_ART.rootfireRelay.strawlingDefeated : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.rootfireRelay.strawlingTelegraph : NFO_SCENE_ART.rootfireRelay.strawlingIdle;
  if (enemy.id.startsWith("maybe_finch")) return enemy.hp <= 0 ? NFO_SCENE_ART.maybeFlockRoost.maybeFinchDefeated : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.maybeFlockRoost.maybeFinchTelegraph : NFO_SCENE_ART.maybeFlockRoost.maybeFinchIdle;
  // Sam's 2026-09-21 reuse-pool decision (EXPEDITIONS_9FO_ART_GAP_AUDIT.md, "three-enemy reuse
  // pool for Maps 8-10"): Overgrowth and Nearly reuse Strawling's/Maybe-Finch's existing
  // idle/telegraph/defeated sets outright — both plant creatures for Overgrowth, and
  // Maybe-Finch's dive/retreat behaviour fits Nearly's "inspects a cell and retreats" better
  // than a burrowing or windborne creature. No new enemy art needed for either.
  if (enemy.id === "overgrowth") return enemy.hp <= 0 ? NFO_SCENE_ART.rootfireRelay.strawlingDefeated : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.rootfireRelay.strawlingTelegraph : NFO_SCENE_ART.rootfireRelay.strawlingIdle;
  if (enemy.id === "nearly") return enemy.hp <= 0 ? NFO_SCENE_ART.maybeFlockRoost.maybeFinchDefeated : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.maybeFlockRoost.maybeFinchTelegraph : NFO_SCENE_ART.maybeFlockRoost.maybeFinchIdle;
  if (enemy.id === "hedgejaw") return enemy.hp <= 0 ? NFO_SCENE_ART.hedgejawMaze.hedgejawDefeated : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.hedgejawMaze.hedgejawTelegraph : NFO_SCENE_ART.hedgejawMaze.hedgejawIdle;
  // No "defeated" pose delivered yet for Crowbreaker — falls back to the emoji stand-in once
  // it's actually beaten, same treatment Fog-thumb gets above for the same reason.
  if (enemy.id === "crowbreaker") return enemy.hp <= 0 ? null : enemy.delay && state.turn <= enemy.delay ? NFO_SCENE_ART.murderAtMoonfall.crowbreakerTelegraph : NFO_SCENE_ART.murderAtMoonfall.crowbreakerIdle;
  // First Root also reuses Hookmole's set outright (same 2026-09-21 decision as above) — "the
  // most root-and-earth-themed of the three and by far the widest range of existing poses, so
  // its extra narrative beats (dormant, shielded, forecast, vulnerable, strike) can be read off
  // Hookmole's existing idle/warning/jam/steal/hit/defeated art rather than commissioned
  // fresh." The shield/vulnerability *effect* overlay (see the po_first_whistle render block
  // below) already carries the precise networkLive state; this only needs to give the enemy
  // unit itself a body instead of the emoji stand-in.
  const enemyArt = NINEFOLD_ORCHARD_ART.enemies.hookmole;
  if ((!enemy.id.startsWith("hookmole") && enemy.id !== "first_root") || !enemyArt) return null;
  if (enemy.hp <= 0) return NFO_SCENE_ART.unequalCrossing.hookmoleDefeated;
  if (enemy.delay && state.turn <= enemy.delay) return enemyArt.warning || enemyArt.idleFront;
  return enemyArt.idleFront;
}
function nfoLoadArt(object, moduleKey) {
  if (moduleKey === "junior") {
    if (object.kind === "operator") return object.valueLocked ? LR_SCENE_ART.operator.locked : object.op != null ? LR_SCENE_ART.operator.complete : LR_SCENE_ART.operator.obscured;
    if (object.kind === "route-marker") return (((object.orientation || 0) % 6 + 6) % 6) === 0 ? LR_SCENE_ART.operator.complete : LR_SCENE_ART.operator.neutral;
    const art = LR_SCENE_ART.load;
    if (!art) return null;
    return object.guarded ? art.guarded : art.neutral;
  }
  if (object.kind === "press") return NFO_SCENE_ART.ciderRun.ciderPress;
  // Two unrelated object kinds share the name "vane": Nine Across' rotating current-turner
  // (has `orientation`, an OPEN/CLOSED capacity gate) and Maybe-Flock Roost's fixed wind vanes
  // (no `orientation` at all — just a printed value the three posts must sum to nine, never
  // rotated by anything). Found while wiring Roost's own wind-dial art: the two were being
  // rendered identically, which also mislabelled Roost's vanes "OPEN"/"CLOSED" instead of
  // showing their value — see the `vane` flag in NfoBoardObject below for the matching fix.
  if (object.kind === "vane") return "orientation" in object ? NFO_SCENE_ART.nineAcross.currentTurner : NFO_SCENE_ART.maybeFlockRoost.windDial;
  if (object.kind === "branch") return NFO_SCENE_ART.firstWhistle.branchPort;
  // root_e is the relay's trunk/source (rootfire-relay.js: "the whole chain must sum to the
  // target, and the trunk must be even") — the one root that isn't an interchangeable link.
  if (object.kind === "root") return object.id === "root_e" ? NFO_SCENE_ART.rootfireRelay.sourceFruit : NFO_SCENE_ART.rootfireRelay.relayNode;
  if (object.kind === "memorial") return NFO_SCENE_ART.hollowBough.memorialHex;
  if (object.kind === "stone") return NFO_SCENE_ART.hedgejawMaze.numberStone;
  if (object.kind === "ledger") return object.value == null ? NFO_SCENE_ART.orchardLockdown.ledgerCorruption : NFO_SCENE_ART.orchardLockdown.ledgerSolvedCell;
  const art = NINEFOLD_ORCHARD_ART.props.numberLoad;
  if (!art) return null;
  if (object.guarded) return art.guarded;
  return art.neutral;
}
// The Unequal Crossing's two brass platforms: each side's own art state is driven by the
// engine-owned status from evaluateObjective's `sides` field (UI reconciliation contract,
// EXPEDITIONS_CLAUDE_HANDOVER.md) — never re-derived independently in the presentation
// layer. "Broken" has no engine signal for this scenario (nothing here can break a
// platform), so it stays unused.
function nfoBalanceArt(side) {
  const art = NINEFOLD_ORCHARD_ART.objectives.balance;
  if (!art || !side) return null;
  if (side.status === "overloaded") return art.overloaded;
  if (side.status === "balanced") return art.complete;
  return side.currentTotal ? art.loaded : art.empty;
}
const BALANCE_STATUS_LABEL = { underweight: "Needs", balanced: "Balanced", overloaded: "Over by" };
function ExpeditionHudPlaque({ title, value, moduleKey, align = "left", onClick }) {
  const accent = moduleKey === "primary" ? "#77571c" : moduleKey === "junior" ? "#654a79" : "#793b45";
  const motif = moduleKey === "primary" ? "apple" : moduleKey === "junior" ? "star" : "diamond";
  const content = <><svg aria-hidden="true" viewBox="0 0 440 84" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 5px 3px rgba(38,27,13,.35))" }}>
    <path d="M17 3H423L437 17V67L423 81H17L3 67V17Z" fill="#4d321d" stroke="#2e2015" strokeWidth="3"/>
    <path d="M19 8H421L432 19V65L421 76H19L8 65V19Z" fill="#f1dfaa" stroke="#c49750" strokeWidth="2"/>
    <path d="M24 13H416L427 22V62L416 71H24L13 62V22Z" fill="none" stroke={accent} strokeWidth="2.5"/>
    <path d="M41 17H399M41 67H399" stroke="#c9a366" strokeWidth="1.3" opacity=".8"/>
    <path d="M23 42c9-2 10-12 17-12M23 42c9 2 10 12 17 12M417 42c-9-2-10-12-17-12M417 42c-9 2-10 12-17 12" fill="none" stroke={accent} strokeWidth="2"/>
    <path d="M31 29c-7-7-12-3-11 2 5 3 8 3 11-2ZM31 55c-7 7-12 3-11-2 5-3 8-3 11 2ZM409 29c7-7 12-3 11 2-5 3-8 3-11-2ZM409 55c7 7 12 3 11-2-5-3-8-3-11 2Z" fill={accent} opacity=".82"/>
    {motif === "apple" ? <><circle cx="25" cy="42" r="5" fill="#b7442d" stroke="#744021"/><path d="M25 36q2-5 5-3" fill="none" stroke="#45623b" strokeWidth="2"/><circle cx="415" cy="42" r="5" fill="#b7442d" stroke="#744021"/><path d="M415 36q2-5 5-3" fill="none" stroke="#45623b" strokeWidth="2"/></> : motif === "star" ? <><path d="M25 34l2 5 5 1-4 4 1 5-4-3-5 3 1-5-4-4 5-1ZM415 34l2 5 5 1-4 4 1 5-4-3-5 3 1-5-4-4 5-1Z" fill={accent}/></> : <><path d="M25 34l7 8-7 8-7-8ZM415 34l7 8-7 8-7-8Z" fill={accent}/></>}
  </svg><span style={{ position: "relative", display: "block", fontSize: 10, letterSpacing: 1.5, fontWeight: 900, color: accent }}>{title}</span><b style={{ position: "relative", display: "block", font: title === "ROUND" ? "bold 22px Georgia,serif" : "bold 14px Georgia,serif", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</b></>;
  const style = { position: "relative", minHeight: 76, width: "100%", border: 0, padding: "15px 32px", background: "transparent", color: "#3e2d1c", textAlign: align, cursor: onClick ? "pointer" : "default" };
  return onClick ? <button type="button" onClick={onClick} style={style}>{content}</button> : <div style={style}>{content}</div>;
}
// The tally arch at the exit hex: dormant until both sides hold the target, active once
// solved but before a hero has crossed, complete once someone has. "Blocked" has no clear
// engine signal for this scenario (no hazard currently threatens the exit specifically), so
// it is left unused rather than invented.
function nfoTallyArchArt(objective, values) {
  const art = NINEFOLD_ORCHARD_ART.objectives.tallyArch;
  if (!art || !values) return null;
  if (values.exited) return art.complete;
  if (values.left === objective.target && values.right === objective.target) return art.active;
  return art.dormant;
}

function NfoActionButton({ label, selected = false, disabled, onClick, title }) {
  const imageSet = NFO_SCENE_ART.ui.buttons[label];
  if (!imageSet) return <button type="button" aria-label={label} title={title || label} disabled={disabled} onClick={onClick} style={buttonStyle("#76522c", disabled)}>{label}</button>;
  const art = imageSet[disabled ? 2 : selected ? 1 : 0];
  return <button type="button" aria-label={label} aria-pressed={selected} title={title || label} disabled={disabled} onClick={onClick} style={{ width: 145, height: 53, flex: "0 0 145px", border: 0, padding: 0, background: `url('${art}') center/contain no-repeat`, cursor: disabled ? "not-allowed" : "pointer", filter: selected ? "drop-shadow(0 0 7px #f6c95a) drop-shadow(0 3px 2px rgba(35,22,11,.45))" : "drop-shadow(0 3px 2px rgba(35,22,11,.45))" }} />;
}

function NfoNavButton({ onClick }) {
  return <button type="button" aria-label="Back to Expeditions" onClick={onClick} style={{ position: "absolute", left: 0, top: -16, border: 0, padding: 0, width: 120, height: 80, background: `url('${NFO_UI_ART.backBtn}') center/contain no-repeat`, cursor: "pointer", filter: "drop-shadow(0 3px 2px rgba(31,20,12,.45))" }} />;
}

function NfoActionBar({ children }) {
  return <div className="expedition-action-bar" style={{ position: "sticky", bottom: 0, zIndex: 60000, display: "grid", gap: 6, margin: "-30px auto 0", padding: "7px 12px 8px", width: "min(100%,1540px)", border: "5px ridge #bd8845", borderRadius: 20, background: "linear-gradient(180deg,#86572f 0%,#5c351b 22%,#472718 78%,#724420 100%)", boxShadow: "inset 0 0 0 2px #e3ad64,inset 0 0 18px #27170d,0 7px 9px rgba(23,17,11,.48)" }}>
    {children}
  </div>;
}

function TacticalHex({ tileKey, terrain, terrainFeature, position, metrics, depth, texture, exposedLeft, exposedRight, canReach, onClick, interactive }) {
  const width = metrics.width;
  const height = metrics.height;
  const side = metrics.side;
  const sideY = metrics.sideY || side;
  const topPolygon = "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)";
  const { q, r } = tileKey.split(",").reduce((point, value, index) => ({ ...point, [index ? "r" : "q"]: Number(value) }), { q: 0, r: 0 });
  const texturePositions = ["center 14%", "46% 18%", "54% 12%", "center 22%"];
  const isWater = terrainFeature === "water";
  const isRoots = !!texture && terrain === "difficult";
  const texturePosition = texturePositions[Math.abs(q * 7 + r * 11) % texturePositions.length];
  const wallHeight = height + depth;
  return <div style={{ position: "absolute", left: position.left - width / 2, top: position.top - sideY, zIndex: Math.round(position.top * 10), width, height: wallHeight, pointerEvents: "none", filter: "drop-shadow(0 5px 4px rgba(23,31,18,.34))" }}>
    {exposedLeft && <div aria-hidden="true" style={{ position: "absolute", inset: 0, clipPath: `polygon(0 ${sideY * 1.5}px,50% ${height}px,50% ${wallHeight}px,0 ${sideY * 1.5 + depth}px)`, backgroundImage: `linear-gradient(90deg,rgba(255,211,126,.14),rgba(48,28,12,.12)),url('${NINEFOLD_ORCHARD_ART.terrain.earthWall}')`, backgroundSize: "100% 100%, auto 180%", backgroundPosition: "center, left 52%" }} />}
    {exposedRight && <div aria-hidden="true" style={{ position: "absolute", inset: 0, clipPath: `polygon(50% ${height}px,100% ${sideY * 1.5}px,100% ${sideY * 1.5 + depth}px,50% ${wallHeight}px)`, backgroundImage: `linear-gradient(90deg,rgba(37,24,13,.12),rgba(18,15,13,.36)),url('${NINEFOLD_ORCHARD_ART.terrain.earthWall}')`, backgroundSize: "100% 100%, auto 180%", backgroundPosition: "center, right 52%" }} />}
    <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width, height, clipPath: topPolygon, backgroundColor: isWater ? "#75a25e" : "#6d873d", backgroundImage: `url('${isWater ? texture : NINEFOLD_ORCHARD_ART.terrain.hexGrass}')`, backgroundPosition: isWater ? "center" : "center 12%", backgroundSize: isWater ? "100% 100%" : "116% 170%", backgroundRepeat: "no-repeat" }}>
      {!isWater && texture && <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${texture}')`, backgroundPosition: isRoots ? "center 8%" : texturePosition, backgroundSize: isRoots ? "112% 164%" : "116% 170%", backgroundRepeat: "no-repeat", maskImage: isRoots ? "radial-gradient(ellipse 52% 53% at 50% 50%,#000 38%,transparent 93%)" : "radial-gradient(ellipse 75% 78% at 50% 50%,#000 55%,transparent 100%)" }} />}
    </div>
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}><path d={`M${width / 2} 0L${width} ${sideY / 2}V${sideY * 1.5}L${width / 2} ${height}L0 ${sideY * 1.5}V${sideY / 2}Z`} fill="none" stroke="rgba(49,67,40,.33)" strokeWidth="1.1"/></svg>
    <button type="button" aria-label={`Hex ${tileKey}${canReach ? ", reachable" : ""}`} onClick={onClick} style={{ position: "absolute", left: 0, top: 0, width, height, clipPath: topPolygon, border: 0, padding: 0, opacity: 0, cursor: interactive ? "pointer" : "default", pointerEvents: "auto" }} />
  </div>;
}

function NfoTreeObstacle({ position, side }) {
  return <img src={NINEFOLD_ORCHARD_ART.terrain.appleTree} alt="" aria-hidden="true" style={{ position: "absolute", left: position.left, top: position.top + side * .72, width: side * 2, height: side * 2, transform: "translate(-50%,-86%)", zIndex: 10000 + Math.round(position.top * 10), pointerEvents: "none", objectFit: "contain", maskImage: "radial-gradient(ellipse 49% 47% at 50% 45%,#000 48%,transparent 100%)", filter: "drop-shadow(0 7px 5px rgba(25,32,20,.42))" }} />;
}

function NfoScaleHex({ sideKey, side, hexKey, position, metrics, loads }) {
  const width = metrics.width;
  const height = metrics.height;
  const label = sideKey === "left" ? "West" : "East";
  const balanced = side.status === "balanced";
  const art = balanced ? NFO_SCENE_ART.unequalCrossing.scaleComplete : side.status === "overloaded" ? NFO_SCENE_ART.unequalCrossing.scaleOverloaded : side.currentTotal ? NFO_SCENE_ART.unequalCrossing.scaleUnder : NFO_SCENE_ART.unequalCrossing.scaleEmpty;
  return <div role="img" aria-label={`${label} scale on hex ${hexKey}: ${side.currentTotal} of ${side.target}; loads ${loads.length ? loads.map((load) => load.value).join(" and ") : "none"}`} style={{ position: "absolute", left: position.left - width / 2, top: position.top - height / 2, width, height, zIndex: 9500 + Math.round(position.top * 10), pointerEvents: "none" }}>
    <img src={art} alt="" aria-hidden="true" style={{ width, height, objectFit: "contain", filter: "drop-shadow(0 2px 2px rgba(31,22,9,.5))" }} />
    <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "44%", transform: "translate(-50%,-50%)", font: `900 ${Math.max(12, width * .15)}px Georgia,serif`, color: balanced ? "#315c35" : "#533416", textShadow: "0 1px #fff4cd", whiteSpace: "nowrap" }}>{side.currentTotal}/{side.target}</span>
    {loads.length > 0 && <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "65%", transform: "translateX(-50%)", borderRadius: 4, padding: "1px 4px", background: "rgba(55,35,17,.86)", color: "#fff4bd", font: `bold ${Math.max(10, width * .11)}px Georgia,serif`, whiteSpace: "nowrap" }}>{loads.map((load) => load.value).join(" + ")}</span>}
  </div>;
}

function NfoBoardObject({ object, position, side, onClick, moduleKey, parityBadge }) {
  // "vane" here means specifically Nine Across' rotating current-turner (kind "vane" AND an
  // `orientation` field) — Maybe-Flock Roost's fixed wind vanes share the kind name but have
  // no orientation at all, so they fall through to the plain numeric-value display below
  // instead of the wind-icon overlay and OPEN/CLOSED reading, exactly like any other value
  // prop (see nfoLoadArt's matching fix for the same two-kinds-one-name mix-up).
  const vane = object.kind === "vane" && "orientation" in object;
  const press = object.kind === "press";
  const memorial = object.kind === "memorial";
  // Every other rotation-hex object (route-marker, branch) shares the vane's OPEN/CLOSED
  // status reading without needing the vane's own wind-icon overlay or aria copy.
  const rotator = vane || "orientation" in object;
  const isOperator = "op" in object; // Little Reckoning's operator sockets: no value, no orientation
  const art = nfoLoadArt(object, moduleKey);
  const width = side * (vane ? 1.55 : press ? 1.45 : 1.35);
  const height = side * (vane ? 1.5 : press ? 1.5 : 1.18);
  const status = rotator ? (((object.orientation || 0) % 6 + 6) % 6 === 0 ? "OPEN" : "CLOSED") : null;
  const label = memorial ? null : rotator ? status : isOperator ? (OPERATOR_SYMBOL[object.op] || "?") : object.value;
  const description = memorial
    ? `The memorial: ${object.damaged ? "damaged" : "standing"}`
    : vane ? `${object.name}: orientation ${object.orientation || 0}, ${status.toLowerCase()}`
    : rotator ? `${object.name || "Route marker"}: ${status.toLowerCase()}`
    : isOperator ? `Operator: ${object.op ? OPERATOR_SYMBOL[object.op] : "empty"}`
    : `${press ? "Cider press" : "Load"} ${object.value}`;
  // Art renders as a real <img>, not a CSS `background: url(...)`, because esbuild's dataurl
  // loader encodes small SVGs as a raw (non-base64) data URI with literal unescaped `"`/`<`/`>`
  // characters — valid in an HTML attribute like `src`, but not a bare CSS url() token, which
  // silently drops the whole `background` declaration (found live: every Hedgejaw Maze number
  // stone rendered as a plain unstyled button, 2026-09-23). <img> sidesteps the issue entirely
  // and matches how every other piece of art in this file is already rendered.
  return <button type="button" aria-label={description} onClick={onClick} style={{ position: "absolute", left: position.left, top: position.top + side * .18, transform: "translate(-50%,-100%)", zIndex: 10000 + Math.round(position.top * 10) + 6, width, height, border: 0, padding: 0, background: "none", cursor: "pointer", filter: object.guarded || object.stabilisedUntil ? "drop-shadow(0 0 5px #9fe1d4)" : "drop-shadow(0 3px 3px rgba(27,28,15,.36))" }}>
    {art && <img src={art} alt="" aria-hidden="true" style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center bottom", pointerEvents: "none" }} />}
    {vane && <img src={NFO_SCENE_ART.nineAcross.windVane} alt="" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "-18%", width: "36%", height: "53%", objectFit: "contain", transform: "translateX(-50%)", pointerEvents: "none" }} />}
    {memorial && object.damaged && <img src={NFO_SCENE_ART.hollowBough.overgrowthDamage} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />}
    {parityBadge && <img src={NFO_SCENE_ART.rootfireRelay.rootfireParity} alt="Must stay even" aria-hidden="true" style={{ position: "absolute", left: "78%", top: "6%", width: "26%", height: "26%", borderRadius: "50%", objectFit: "contain", pointerEvents: "none" }} />}
    {!memorial && <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: vane ? "68%" : press ? "56%" : "48%", transform: "translate(-50%,-50%)", minWidth: vane ? 45 : 25, padding: "2px 5px", borderRadius: 6, background: "rgba(59,35,14,.86)", border: "2px solid rgba(235,191,91,.9)", color: "#fff4bd", font: `900 ${Math.max(vane ? 10 : 15, side * (vane ? .16 : .27))}px Georgia,serif`, textShadow: "0 1px 2px #241507", whiteSpace: "nowrap", pointerEvents: "none" }}>{label}</span>}
  </button>;
}

function describeEvent(event, state) {
  const actor = (id) => state.units[id]?.name || id;
  if (event.type === "UNIT_MOVED") return `${actor(event.unitId)} moved.`;
  if (event.type === "OBJECT_PLACED") {
    const object = state.objects[event.objectId];
    const label = object ? objectLabel(object) : "a load";
    return event.pos ? `${actor(event.unitId)} placed ${label}.` : `${actor(event.unitId)} collected ${label}.`;
  }
  if (event.type === "INTENT_RESOLVED") {
    if (event.action === "steal") return `${actor(event.enemyId)} stole a numbered load.`;
    if (event.action === "obscure") return `${actor(event.enemyId)} obscured an operator.`;
    if (event.action === "watch") return `${actor(event.enemyId)} studies the board.`;
    if (event.action === "strike") return `${actor(event.enemyId)} struck ${actor(event.targetId)}.`;
    if (event.action === "blocked") return `${actor(event.enemyId)}'s strike was guarded.`;
    if (event.action === "move") return `${actor(event.enemyId)} advanced.`;
    return `${actor(event.enemyId)}: ${event.action}.`;
  }
  if (event.type === "OBJECTIVE_UPDATED") return event.after?.complete ? "Objective complete!" : "The objective state changed.";
  if (event.type === "ACTION_RESOLVED") {
    if (event.action === "guard") return `${actor(event.unitId)} guarded.`;
    if (event.action === "reframe") return `${actor(event.unitId)} set an operator to ${OPERATOR_SYMBOL[event.detail?.op] || event.detail?.op}.`;
    if (event.action === "strike") return event.detail?.impact ? `${actor(event.unitId)} hit for ${event.detail.impact}.` : `${actor(event.unitId)}'s strike was held.`;
    if (event.action === "end-phase") return null; // covered by the round-boundary message instead
    return `${actor(event.unitId)}: ${event.action}.`;
  }
  return null;
}

export default function ExpeditionBoard({ scenarioId, squad, cards, avatarForCard, progress, setProgress, beep, fireConfetti, onExit, onRestart }) {
  const catalogue = catalogueEntry(scenarioId);
  const [state, setState] = useState(() => catalogue.createState(squad));
  const [selectedId, setSelectedId] = useState(squad[0].id);
  const [openPanel, setOpenPanel] = useState(null);
  const [actionMode, setActionMode] = useState("move");
  const [rotateObjectId, setRotateObjectId] = useState(null);
  const [scalePickHex, setScalePickHex] = useState(null);
  const [undo, setUndo] = useState([]);
  const [message, setMessage] = useState("Select a hero, then choose a glowing hex or nearby load.");
  const [eventLog, setEventLog] = useState([]);
  // "Your turn"/"Enemy turn" pulse (2026-09-21, Sam: wants a beat to the round structure —
  // Codex is building real art for this, so it renders as a plain text banner for now and
  // falls back the same way every other Ninefold Orchard art lookup does, via
  // NFO_SCENE_ART.ui.turnBanner once that exists). resolveEnemyPhase resolves the whole enemy
  // round synchronously (expedition-engine.js), so there's no intermediate "enemy" state to
  // observe — the banner and the round's real resolution are staged explicitly in endTurn
  // instead: show "Enemy turn", hold briefly so it reads as a beat rather than a flicker, then
  // apply the round and show "Your turn". Board and action-bar input are disabled for that
  // window (phaseTransitioning) so a hero can't act mid-transition.
  const [turnBanner, setTurnBanner] = useState(null);
  const [phaseTransitioning, setPhaseTransitioning] = useState(false);
  const rewarded = useRef(false);
  const boardRef = useRef(null);
  const [boardViewport, setBoardViewport] = useState({ width: 1200, height: 680 });
  const cardMap = useMemo(() => Object.fromEntries(cards.map((card) => [card.id, card])), [cards]);
  // Name kept even though it now also covers Little Reckoning (2026-09-21: a full parallel
  // art pipeline landed for junior — expedition-lr-scene-art.js — so it gets the same
  // illustrated board/action-bar chrome primary already has, borrowing primary's UI-frame
  // assets (hero frame, action-log plaque, button icons) since no junior-specific ones exist
  // yet). Gifford still has no scene art at all, so it stays on the plain generic layout.
  const isNinefoldOrchard = state.moduleKey === "primary" || state.moduleKey === "junior";
  const sceneBackdrop = NFO_SCENE_ART.backgrounds[scenarioId] || LR_SCENE_ART.backgrounds[scenarioId] || (state.moduleKey === "primary" ? NINEFOLD_ORCHARD_ART.backgrounds.po_orchard_gorge : null);
  const sceneEffects = state.moduleKey === "junior" ? LR_SCENE_ART.effects : NINEFOLD_ORCHARD_ART.effects;
  const sceneCarriedArt = state.moduleKey === "junior" ? LR_SCENE_ART.load.carried : NINEFOLD_ORCHARD_ART.props.numberLoad.carried;
  const theme = MODULE_DISPLAY[state.moduleKey] || MODULE_DISPLAY.primary;
  const selected = state.units[selectedId];
  const reachable = useMemo(() => selected?.ap > 0 ? new Map(reachableHexes(state, selectedId).map((hex) => [hex.key, hex])) : new Map(), [state, selectedId]);
  const result = evaluateObjective(state);
  const briefing = result.sides ? `Place ${state.objective.target} weight on each brass scale, then send one hero through the tally arch.` : scenarioId === "po_cider_run" ? `Pick two cider presses whose values total ${state.objective.target}. Carry one to each glowing gate hex before Scruffcrow raises a lane's value.` : state.flags.briefing;
  const left = result.values?.left || 0;
  const right = result.values?.right || 0;
  const marks = useMemo(() => computeExpeditionMarks(state, catalogue.marksPar), [state]);
  const boardKeys = useMemo(() => Object.keys(state.board), [state.board]);
  const boardLayout = useMemo(() => state.moduleKey === "primary"
    ? fitProjectedPointyHexLayout(boardKeys, boardViewport.width, boardViewport.height, { padding: boardViewport.width < 600 ? 8 : 34, depth: 28, verticalScale: 0.6 })
    : fitPointyHexLayout(boardKeys, boardViewport.width, boardViewport.height, { padding: 34, depth: 28 }), [boardKeys, boardViewport, state.moduleKey]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || typeof ResizeObserver === "undefined") return undefined;
    const update = () => {
      const next = { width: board.clientWidth, height: board.clientHeight };
      if (next.width > 0 && next.height > 0) setBoardViewport((current) => current.width === next.width && current.height === next.height ? current : next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isNinefoldOrchard) setTurnBanner("player"); // once, on mount — the opening beat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!turnBanner) return undefined;
    const hide = setTimeout(() => setTurnBanner(null), 1100);
    return () => clearTimeout(hide);
  }, [turnBanner]);

  const apply = (command, successMessage) => {
    try {
      const { state: next, events } = applyExpeditionCommand(state, command);
      setUndo((items) => [...items.slice(-9), state]);
      setState(next);
      setActionMode("move");
      setRotateObjectId(null);
      setMessage(successMessage);
      const lines = events.map((event) => describeEvent(event, next)).filter(Boolean);
      if (lines.length) setEventLog((log) => [...lines, ...log].slice(0, 6));
      beep?.(520, .05);
    } catch (error) { setMessage(error.message); beep?.(180, .08); }
  };

  useEffect(() => {
    if (state.status !== "won" || rewarded.current) return;
    rewarded.current = true;
    const first = !migrateExpeditionProgress(progress.expeditions).scenarios[state.id]?.completed;
    const totalScenarioCount = (EXPEDITION_SCENARIOS[state.moduleKey] || []).length;
    setProgress((current) => applyExpeditionResult(current, { scenarioId: state.id, won: true, turnsUsed: state.turn, actionsUsed: state.counters.actions, marks }, { totalScenarioCount }));
    fireConfetti?.();
    setMessage(first ? "Objective complete. First clear: three stars!" : "Objective complete. A cleaner plan is its own reward.");
  }, [state.status, state.id, state.turn, progress.expeditions, setProgress, fireConfetti]);

  const tileClick = (key) => {
    if (state.status !== "playing" || !selected || phaseTransitioning) return;
    // Switching to a different living hero must always work, even once the currently
    // selected one is out of AP for the round — otherwise the party gets stuck the moment
    // one hero finishes her actions, with only Undo left (a real bug a player hit live).
    const explicitPickup = actionMode === "pickup" ? objectAt(state, key) : null;
    if (explicitPickup && !selected.carrying && !("orientation" in explicitPickup) && explicitPickup.movable !== false && hexDistance(selected.pos, key) <= 1 && selected.ap > 0) { apply({ type: "INTERACT", unitId: selectedId, targetId: explicitPickup.id }, `${selected.name} picks up ${objectLabel(explicitPickup)}.`); return; }
    const reselect = unitAt(state, key);
    if (actionMode === "guard" && reselect?.side === "player" && !reselect.guarded && hexDistance(selected.pos, key) <= 1 && selected.ap > 0) { apply({ type: "GUARD", unitId: selectedId, targetId: reselect.id }, `${selected.name} guards ${reselect.name}.`); return; }
    if (reselect?.side === "player" && reselect.id !== selectedId) { setScalePickHex(null); setRotateObjectId(null); setActionMode("move"); setSelectedId(reselect.id); setMessage(`${reselect.name} selected.`); return; }
    if (selected.ap < 1) return;
    const scaleSide = scenarioId === "po_unequal_crossing" && (state.objective.leftHexes?.includes(key) ? "west" : state.objective.rightHexes?.includes(key) ? "east" : null);
    if (scaleSide) {
      if (hexDistance(selected.pos, key) !== 1) { setMessage(`Move next to the ${scaleSide} scale to use it.`); return; }
      if (actionMode === "guard") {
        const unguarded = Object.values(state.objects).filter((item) => item.pos === key && !item.removed && !item.guarded).sort((a, b) => a.value - b.value || a.id.localeCompare(b.id));
        if (unguarded.length === 1) apply({ type: "GUARD", unitId: selectedId, targetId: unguarded[0].id }, `${selected.name} guards ${objectLabel(unguarded[0])} on the ${scaleSide} scale.`);
        else if (unguarded.length > 1) { setScalePickHex(key); setMessage(`Choose which load to guard on the ${scaleSide} scale.`); }
        else setMessage(`There is no unguarded load on the ${scaleSide} scale.`);
        return;
      }
      if (selected.carrying && (actionMode === "putdown" || actionMode === "move")) {
        const load = state.objects[selected.carrying];
        setScalePickHex(null);
        apply({ type: "INTERACT", unitId: selectedId, targetId: load.id, destination: key }, `${selected.name} places ${objectLabel(load)} on the ${scaleSide} scale.`);
        return;
      }
      if (actionMode !== "pickup" && actionMode !== "move") { setMessage(`Choose Pick up or Put down to use the ${scaleSide} scale.`); return; }
      const loads = Object.values(state.objects).filter((item) => item.pos === key && !item.removed).sort((a, b) => a.value - b.value || a.id.localeCompare(b.id));
      if (loads.length === 1) {
        apply({ type: "INTERACT", unitId: selectedId, targetId: loads[0].id }, `${selected.name} lifts ${objectLabel(loads[0])} from the ${scaleSide} scale.`);
      } else if (loads.length > 1) {
        setScalePickHex(key);
        setMessage(`Choose which load to lift from the ${scaleSide} scale.`);
      } else setMessage(`The ${scaleSide} scale is empty. Carry a load next to it, then tap the scale.`);
      return;
    }
    setScalePickHex(null);
    const object = objectAt(state, key);
    const unit = unitAt(state, key);
    if (unit?.side === "player") { setSelectedId(unit.id); setMessage(`${unit.name} selected.`); return; }
    if (actionMode === "putdown" && carrying && dropTargets.includes(key)) { apply({ type: "INTERACT", unitId: selectedId, targetId: carrying.id, destination: key }, `${selected.name} puts down ${objectLabel(carrying)}.`); return; }
    if (actionMode === "guard" && object && !object.guarded && hexDistance(selected.pos, object.pos) <= 1) { apply({ type: "GUARD", unitId: selectedId, targetId: object.id }, `${selected.name} guards ${objectLabel(object)}.`); return; }
    if (actionMode === "rotate" && object && "orientation" in object && !object.valueLocked && hexDistance(selected.pos, object.pos) <= 1) { const nextOrientation = object.orientation === 0 ? 1 : 0; apply({ type: "ROLE_ACTION", unitId: selectedId, actionId: "reframe", parameters: { targetId: object.id, orientation: nextOrientation } }, `${selected.name} turns ${object.name || "the wind vane"} ${nextOrientation === 0 ? "open" : "closed"}.`); return; }
    if (actionMode === "rotate" && object && "op" in object && !object.valueLocked && hexDistance(selected.pos, object.pos) <= 1) { setRotateObjectId(object.id); setMessage(`Choose an operator for ${object.id.replace(/_/g, " ")}.`); return; }
    if ((actionMode === "strike" || actionMode === "move") && unit?.side === "enemy" && hexDistance(selected.pos, unit.pos) <= selected.range) { apply({ type: "STRIKE", unitId: selectedId, targetId: unit.id }, `${selected.name} attacks ${unit.name}.`); return; }
    // Ordered-route stones (The Hedgejaw Maze): a stone is never carried — a hero visits it
    // from beside it (visitStone/VISIT_STONE, expedition-engine.js) — so it needs its own
    // branch rather than falling through to the generic pickup/move object check below, which
    // "movable: false" always excludes it from anyway. Found live 2026-09-23: this branch was
    // entirely missing, so no stone could ever be visited through the board UI at all.
    if ((actionMode === "pickup" || actionMode === "move") && object?.kind === "stone" && !object.visited && hexDistance(selected.pos, object.pos) <= 1) { apply({ type: "VISIT_STONE", unitId: selectedId, targetId: object.id }, `${selected.name} visits the ${object.value} stone.`); return; }
    if ((actionMode === "pickup" || actionMode === "move") && object && !("orientation" in object) && hexDistance(selected.pos, object.pos) <= 1 && !selected.carrying && object.movable !== false) { apply({ type: "INTERACT", unitId: selectedId, targetId: object.id }, `${selected.name} picks up ${objectLabel(object)}.`); return; }
    if (actionMode === "move" && reachable.has(key)) apply({ type: "MOVE", unitId: selectedId, destination: key }, `${selected.name} moves ${reachable.get(key).cost} step${reachable.get(key).cost === 1 ? "" : "s"}.`);
  };
  const performEndTurn = () => {
    try {
      const step1 = applyExpeditionCommand(state, { type: "END_PLAYER_PHASE" });
      const step2 = applyExpeditionCommand(step1.state, { type: "RESOLVE_ENEMY_PHASE" });
      setUndo((items) => [...items.slice(-9), state]);
      setState(step2.state);
      setMessage("The round has ended. Your action points are restored.");
      const lines = [...step1.events, ...step2.events].map((event) => describeEvent(event, step2.state)).filter(Boolean);
      if (lines.length) setEventLog((log) => [...lines, ...log].slice(0, 6));
      beep?.(420, .06);
    } catch (error) { setMessage(error.message); beep?.(180, .08); }
  };
  // Staged on Ninefold Orchard so "Enemy turn" actually reads as a beat: show the banner and
  // freeze input first, then apply the round (the engine resolves it all in one synchronous
  // call, so this pause is what makes it feel like something happened rather than an instant
  // cut), then show "Your turn". Other modules keep the old immediate behaviour for now.
  const endTurn = () => {
    if (!isNinefoldOrchard) { performEndTurn(); return; }
    setPhaseTransitioning(true);
    setTurnBanner("enemy");
    setTimeout(() => {
      performEndTurn();
      setTurnBanner("player");
      setPhaseTransitioning(false);
    }, 900);
  };
  const guardable = Object.values(state.objects).filter((object) => object.pos && !object.guarded && hexDistance(selected?.pos, object.pos) <= 1);
  const guardableHeroes = Object.values(state.units).filter((unit) => unit.side === "player" && unit.hp > 0 && !unit.guarded && hexDistance(selected?.pos, unit.pos) <= 1);
  const reframable = Object.values(state.objects).filter((object) => ("op" in object || "orientation" in object) && !object.valueLocked && object.pos && hexDistance(selected?.pos, object.pos) <= 1);
  const carrying = selected?.carrying ? state.objects[selected.carrying] : null;
  const dropTargets = carrying ? Object.keys(state.board).filter((key) => hexDistance(selected.pos, key) <= 1 && Object.values(state.objects).filter((object) => object.pos === key && !object.removed).length < (state.board[key].stackLimit ?? 1)) : [];
  const pickupTargets = Object.values(state.objects).filter((object) => object.pos && !object.removed && !("orientation" in object) && object.movable !== false && !carrying && hexDistance(selected?.pos, object.pos) <= 1);
  const strikeTargets = Object.values(state.units).filter((unit) => unit.side === "enemy" && unit.hp > 0 && hexDistance(selected?.pos, unit.pos) <= selected?.range);
  // Ordered-route stones (The Hedgejaw Maze): highlighted in "move" mode, the mode a player is
  // in by default when walking up to one, same as tileClick's own VISIT_STONE branch above.
  const visitableStones = Object.values(state.objects).filter((object) => object.kind === "stone" && !object.visited && hexDistance(selected?.pos, object.pos) <= 1);
  const canAct = !!selected && selected.ap > 0 && selected.hp > 0 && state.status === "playing" && !phaseTransitioning;
  const chooseAction = (mode, instruction) => { setActionMode(mode); setRotateObjectId(null); setScalePickHex(null); setMessage(`${selected.name}: ${instruction}`); };
  const actionTargets = new Set(actionMode === "move" ? [...reachable.keys(), ...visitableStones.map((object) => object.pos)] : actionMode === "pickup" ? pickupTargets.map((object) => object.pos) : actionMode === "putdown" ? dropTargets : actionMode === "guard" ? [...guardable.map((object) => object.pos), ...guardableHeroes.map((unit) => unit.pos)] : actionMode === "rotate" ? reframable.map((object) => object.pos) : actionMode === "strike" ? strikeTargets.map((unit) => unit.pos) : []);
  const objectiveHex = (key) => {
    const o = state.objective;
    if (o.leftHexes?.includes(key)) return "left";
    if (o.rightHexes?.includes(key)) return "right";
    if (o.exitHex === key) return "exit";
    if (o.destinationHexes?.includes(key)) return "destination";
    return null;
  };
  const heroes = Object.values(state.units).filter((unit) => unit.side === "player");
  const enemies = Object.values(state.units).filter((unit) => unit.side === "enemy");
  const outcome = state.status !== "playing" ? explainExpeditionOutcome(state) : null;
  const undoLast = () => { const previous = undo.at(-1); if (!previous) return; setState(previous); setUndo((items) => items.slice(0, -1)); setActionMode("move"); setRotateObjectId(null); setMessage("Last decision undone."); };
  const undoDisabled = !undo.length || state.status !== "playing" || phaseTransitioning;
  const endDisabled = state.status !== "playing" || phaseTransitioning;
  const boardPosition = (key) => {
    const point = hexPosition(key, boardLayout.side, boardLayout.origin);
    if (!boardLayout.verticalScale) return point;
    const top = boardLayout.origin.y + (point.top - boardLayout.origin.y) * boardLayout.verticalScale;
    return { ...point, top, y: top };
  };

  return <div style={{ minHeight: "100vh", width: isNinefoldOrchard ? "100vw" : "auto", marginLeft: isNinefoldOrchard ? "calc(50% - 50vw)" : 0, color: INK, background: isNinefoldOrchard && sceneBackdrop ? `linear-gradient(rgba(20,30,20,.08),rgba(20,30,20,.2)), url('${sceneBackdrop}') center center/cover fixed` : "linear-gradient(180deg,#e7c678 0%,#a67f46 42%,#364c3c 100%)", padding: isNinefoldOrchard ? "8px 10px 12px" : "10px clamp(8px,2vw,24px) 18px" }}>
    <style>{`html,body{overflow-x:hidden}@media(max-width:600px){.expedition-header{flex-wrap:wrap}.expedition-header-title{order:3;flex:0 0 100%}.expedition-header-spacer{display:none}.expedition-hud{grid-template-columns:1fr 1fr!important;gap:6px!important}.expedition-hud>*{min-width:0}.expedition-hud>:first-child{grid-column:1/-1}.expedition-hud>:last-child{text-align:center!important}.expedition-board{min-height:360px!important}.expedition-action-bar{padding:10px 14px!important;width:100%}}@keyframes expedition-turn-banner{0%{opacity:0;transform:translate(-50%,-50%) scale(.85)}12%{opacity:1;transform:translate(-50%,-50%) scale(1)}78%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.05)}}`}</style>
    <div style={{ maxWidth: isNinefoldOrchard ? "none" : 1280, margin: "0 auto" }}>
      <div className="expedition-header" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, minHeight: 44, marginBottom: 9 }}>{isNinefoldOrchard ? <NfoNavButton onClick={onExit} /> : <button type="button" onClick={onExit} style={buttonStyle("#6d5236")}>← Expeditions</button>}<div className="expedition-header-title" style={{ flex: isNinefoldOrchard ? 1 : undefined, marginLeft: isNinefoldOrchard ? 120 : 0, textAlign: "center" }}>{!isNinefoldOrchard && <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2 }}>{theme.label}</div>}<h1 style={{ font: "700 clamp(22px,3vw,36px) Georgia,serif", margin: 0 }}>{state.title}</h1></div><div className="expedition-header-spacer" style={{ width: isNinefoldOrchard ? 120 : "auto", textAlign: "right" }}>{!isNinefoldOrchard && <span style={{ background: "rgba(255,248,232,.9)", borderRadius: 12, padding: "7px 11px", fontWeight: 900 }}>Round {Math.min(state.turn, state.turnLimit)} / {state.turnLimit}</span>}</div></div>
      <div className="expedition-hud" style={{ display: "grid", gridTemplateColumns: "1.35fr .8fr 1.35fr", gap: 12, margin: "0 auto 12px", maxWidth: 1120 }}>
        <ExpeditionHudPlaque title="OBJECTIVE" value={result.sides ? `Balance both platforms · ${left}/${state.objective.target} + ${right}/${state.objective.target}` : scenarioId === "po_cider_run" ? `Cider gate ${result.progress} · target ${state.objective.target}` : result.progress} moduleKey={state.moduleKey} onClick={isNinefoldOrchard ? () => setOpenPanel(openPanel === "objective" ? null : "objective") : undefined} />
        <ExpeditionHudPlaque title="ROUND" value={`${Math.min(state.turn, state.turnLimit)} / ${state.turnLimit}`} moduleKey={state.moduleKey} align="center" />
        {isNinefoldOrchard ? <div role="status" aria-live="polite" style={{ minHeight: 76, boxSizing: "border-box", padding: "10px 9%", background: `url('${NFO_SCENE_ART.ui.actionLogPlaque}') center/100% 100% no-repeat`, color: "#3e2d1c", textAlign: "left", filter: "drop-shadow(0 5px 3px rgba(38,27,13,.35))" }}>{/* Horizontal padding is a percentage, not a fixed px (2026-09-21, Sam's playtest: text overflowing the frame) — the plaque art (po-action-log-plaque-v1.png) is a fixed-aspect bitmap force-stretched to whatever width this grid column happens to render at, so its decorative border's actual on-screen thickness scales with that width too; a fixed px inset cleared it at one width and not another. Vertical stays a small fixed px since the box's height is pinned to match the OBJECTIVE/ROUND plaques either side of it, not viewport-dependent. */}<span style={{ display: "block", color: "#77571c", fontSize: 10, fontWeight: 900, letterSpacing: 1.5 }}>ACTION LOG</span><span style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden", marginTop: 3, font: "bold 12px Georgia,serif", lineHeight: 1.2 }}>{message}</span></div> : <ExpeditionHudPlaque title="YOUR PARTY" value={`${heroes.filter((hero) => hero.hp > 0).length} heroes · ${heroes.reduce((sum, hero) => sum + hero.ap, 0)} AP`} moduleKey={state.moduleKey} align="right" />}
      </div>
      {isNinefoldOrchard && <div style={{ width: "fit-content", maxWidth: "min(760px,92vw)", margin: "-2px auto 10px", borderRadius: 12, padding: "7px 14px", background: "rgba(43,57,40,.88)", color: "#fff7d5", fontSize: 12, fontWeight: 800, textAlign: "center", boxShadow: "0 5px 14px rgba(25,31,22,.2)" }}>{briefing}</div>}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: isNinefoldOrchard ? "minmax(0,1fr)" : "minmax(180px,240px) minmax(520px,1fr) minmax(190px,260px)", gap: 10, alignItems: "stretch", overflow: "visible" }}>
        <Panel style={{ padding: 12, ...(isNinefoldOrchard ? { display: openPanel === "party" ? "block" : "none", position: "absolute", zIndex: 1200, left: 10, top: 10, width: 310, maxHeight: "calc(100% - 20px)", overflowY: "auto", boxShadow: "0 18px 50px rgba(24,28,18,.5)" } : {}) }}><div style={{ fontWeight: 900, fontSize: 13, color: theme.accent, letterSpacing: 1 }}>YOUR SQUAD</div>{heroes.map((hero) => { const profile = squad.find((item) => item.id === hero.id); const art = isNinefoldOrchard ? (nfoCharacterArt(hero) || avatarForCard(state.moduleKey, cardMap[hero.id])) : avatarForCard(state.moduleKey, cardMap[hero.id]); return <button key={hero.id} type="button" onClick={() => { setSelectedId(hero.id); setOpenPanel(null); }} style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 8, width: "100%", border: selectedId === hero.id ? `3px solid ${GOLD}` : "1px solid #d4c9b1", borderRadius: 11, background: selectedId === hero.id ? "#fff2bd" : "#fffaf0", padding: 6, marginTop: 8, textAlign: "left", cursor: "pointer" }}><div style={{ height: 52, borderRadius: 8, overflow: "hidden", background: "#d9d3b5" }}>{art ? <img src={art} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</div><div><b>{hero.name}</b><div style={{ fontSize: 11, color: DISCIPLINE_COLOURS[profile.discipline] }}>{profile.disciplineName} · {profile.roleName}</div><div style={{ fontSize: 11 }}>♥ {"●".repeat(hero.hp)}{"○".repeat(Math.max(0, hero.maxHp - hero.hp))} · AP {hero.ap}/{hero.maxAp}</div><div style={{ fontSize: 10, color: "#6e6a60" }}>{hero.carrying ? `Carrying ${objectLabel(state.objects[hero.carrying])}` : profile.signatureName}</div></div></button>; })}
          <div style={{ borderTop: "1px solid #d7ccb5", marginTop: 10, paddingTop: 9 }}><b style={{ fontSize: 12 }}>Selected actions</b><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7 }}>
            {(() => { const placeDisabled = !carrying || selected.ap < 1 || state.status !== "playing"; const onPlace = () => apply({ type: "INTERACT", unitId: selectedId, targetId: carrying.id, destination: selected.pos }, `${selected.name} places ${carrying ? objectLabel(carrying) : ""}.`); if (scenarioId === "po_unequal_crossing") return <div style={{ fontSize: 12, color: "#5b4425", padding: "7px 3px" }}>{carrying ? "Tap an adjacent brass scale to place this load." : "Pick up a load, then tap an adjacent brass scale."}</div>; return (isNinefoldOrchard && <NfoActionButton label="Place load" iconKey="interact" disabled={placeDisabled} onClick={onPlace} />) || <button type="button" disabled={placeDisabled} onClick={onPlace} style={buttonStyle("#8a6734", placeDisabled)}>Place load</button>; })()}
            {guardable.slice(0, 2).map((object) => { const guardDisabled = selected.ap < 1 || state.status !== "playing"; const onGuard = () => apply({ type: "GUARD", unitId: selectedId, targetId: object.id }, `${selected.name} guards ${objectLabel(object)}.`); return <React.Fragment key={object.id}>{(isNinefoldOrchard && <NfoActionButton label={`Guard ${objectLabel(object)}`} iconKey="guard" disabled={guardDisabled} onClick={onGuard} />) || <button type="button" disabled={guardDisabled} onClick={onGuard} style={buttonStyle("#4b7187", guardDisabled)}>Guard {objectLabel(object)}</button>}</React.Fragment>; })}
          </div>
          {reframable.length > 0 && <div style={{ marginTop: 8 }}>{reframable.slice(0, 1).map((object) => <div key={object.id}><b style={{ fontSize: 11 }}>Reframe {object.id.replace(/_/g, " ")}:</b><div style={{ display: "flex", gap: 6, marginTop: 4 }}>{OPERATOR_CHOICES.map((op) => <button key={op} type="button" disabled={selected.ap < 1 || state.status !== "playing"} onClick={() => apply({ type: "ROLE_ACTION", unitId: selectedId, actionId: "reframe", parameters: { targetId: object.id, op } }, `${selected.name} sets an operator to ${OPERATOR_SYMBOL[op]}.`)} style={{ ...buttonStyle("#6a5aa8", selected.ap < 1 || state.status !== "playing"), padding: "6px 12px" }}>{OPERATOR_SYMBOL[op]}</button>)}</div></div>)}</div>}
          </div>
        </Panel>
        <div className="expedition-board" ref={boardRef} style={{ position: "relative", minHeight: isNinefoldOrchard ? "clamp(340px, calc(100vh - 330px), 730px)" : 590, overflow: "hidden", borderRadius: isNinefoldOrchard ? 0 : 18, border: isNinefoldOrchard ? 0 : "4px solid rgba(74,53,28,.55)", background: isNinefoldOrchard ? "transparent" : "radial-gradient(ellipse at 50% 43%,rgba(212,186,102,.8),rgba(87,116,70,.25) 47%,rgba(34,66,53,.8) 75%),linear-gradient(145deg,#b8cf7a,#7c995e)", boxShadow: isNinefoldOrchard ? "none" : "inset 0 0 80px rgba(29,49,35,.28),0 12px 30px rgba(32,35,26,.35)" }}>
          {!isNinefoldOrchard && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(115deg,transparent 0 22px,rgba(255,255,255,.035) 23px 24px)" }} />}
          {boardKeys.slice().sort((a, b) => { const pa = boardPosition(a), pb = boardPosition(b); return pa.top - pb.top || pa.left - pb.left; }).map((key) => {
            const tile = state.board[key]; const pos = boardPosition(key); const mark = objectiveHex(key); const canReach = actionTargets.has(key);
            const [q, r] = key.split(",").map(Number);
            const terrainArt = isNinefoldOrchard ? nfoTerrainArt(tile.terrain, key, scenarioId, state) : null;
            const terrainFeature = scenarioId === "po_unequal_crossing" && tile.terrain === "blocked" && (key === "0,-3" || key === "1,-3") ? "water" : null;
            return <TacticalHex key={key} tileKey={key} terrain={tile.terrain} terrainFeature={terrainFeature} position={pos} metrics={boardLayout.metrics} depth={boardLayout.depth} texture={terrainArt} exposedLeft={!state.board[`${q - 1},${r + 1}`]} exposedRight={!state.board[`${q},${r + 1}`]} canReach={canReach} onClick={() => tileClick(key)} interactive={canReach || unitAt(state, key) || objectAt(state, key) || mark} />;
          })}
          {isNinefoldOrchard && scenarioId === "po_unequal_crossing" && state.board["-1,-2"]?.terrain === "blocked" && <NfoTreeObstacle position={boardPosition("-1,-2")} side={boardLayout.side} />}
          {isNinefoldOrchard && [...actionTargets].map((key) => { const pos = boardPosition(key); return <div key={`reach-${key}`} aria-hidden="true" style={{ position: "absolute", left: pos.left, top: pos.top, width: boardLayout.metrics.width, height: boardLayout.metrics.height, transform: "translate(-50%,-50%)", clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)", zIndex: 9000 + Math.round(pos.top * 10) + 2, pointerEvents: "none", background: `url('${sceneEffects.reachable}') center/cover no-repeat`, filter: actionMode === "strike" ? "hue-rotate(145deg) saturate(1.6)" : actionMode === "move" ? "none" : "hue-rotate(240deg) saturate(1.3)" }} />; })}
          {isNinefoldOrchard && result.sides && ["left", "right"].flatMap((sideKey) => state.objective[`${sideKey}Hexes`].map((hexKey) => <NfoScaleHex key={`platform-${hexKey}`} sideKey={sideKey} side={result.sides[sideKey]} hexKey={hexKey} position={boardPosition(hexKey)} metrics={boardLayout.metrics} loads={Object.values(state.objects).filter((item) => item.pos === hexKey && !item.removed).sort((a, b) => a.value - b.value || a.id.localeCompare(b.id))} />))}
          {isNinefoldOrchard && scenarioId === "po_unequal_crossing" && (() => { const pos = boardPosition("3,-3"); return <img src={NFO_SCENE_ART.unequalCrossing.burrow} alt="" aria-hidden="true" style={{ position: "absolute", left: pos.left, top: pos.top + boardLayout.side * .15, width: boardLayout.side * 1.45, height: boardLayout.side * 1.1, transform: "translate(-50%,-100%)", zIndex: 9100 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />; })()}
          {isNinefoldOrchard && scenarioId === "po_cider_run" && (() => {
            // Positioned and sized from the objective's own two hexes, not a hardcoded hex —
            // Codex's harvest-gate art is a symmetric two-hex-span asset, "scaled with their
            // measured span" (2026-09-18 asset contract), so a future geometry change never
            // needs a matching renderer change here either.
            //
            // Re-anchored 2026-09-21 (Sam's playtest: "random artwork sat in the middle of the
            // screen"). The SVG's own 900x700 viewBox is a doorway: two posts and a crossbeam
            // holding a target medallion in its top third, a door in its bottom half — meant to
            // straddle the two gate hexes, door-at-hex-level, arch rising above. The old fixed
            // height (2x hex side, independent of the art's real proportions) plus a bottom
            // anchor floating well clear of the hexes put almost the whole image above the
            // board instead, reading as an unrelated decoration. Height is now derived from the
            // SVG's real aspect ratio (no letterboxing gap to look "randomly" placed within),
            // and the anchor point is the door's own vertical centre (roughly two-thirds down
            // the image), not its base, so the door sits on the two hexes themselves.
            const [hexA, hexB] = state.objective.hexes;
            const posA = boardPosition(hexA), posB = boardPosition(hexB);
            const midLeft = (posA.left + posB.left) / 2, midTop = (posA.top + posB.top) / 2;
            const span = Math.hypot(posA.left - posB.left, posA.top - posB.top);
            const width = Math.max(span + boardLayout.side * 0.9, boardLayout.side * 2.1);
            const height = width * (700 / 900);
            return <div role="img" aria-label={`Cider gate: place one press on each marked hex, total ${state.objective.target}`} style={{ position: "absolute", left: midLeft, top: midTop, width, height, transform: "translate(-50%,-66%)", zIndex: 9200 + Math.round(midTop * 10), pointerEvents: "none" }}><img src={NFO_SCENE_ART.ciderRun.harvestGate} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /><span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "21%", transform: "translateX(-50%)", padding: "2px 6px", color: "#fff3c0", background: "rgba(63,36,18,.9)", border: "2px solid #d5ad66", borderRadius: 5, font: `bold ${Math.max(11, boardLayout.side * .17)}px Georgia,serif`, whiteSpace: "nowrap" }}>TARGET {state.objective.target}</span></div>;
          })()}
          {isNinefoldOrchard && scenarioId === "po_cider_run" && state.units.scruffcrow && (() => { const crow = state.units.scruffcrow; const lane = crow.laneSequence[(state.turn - 1) % crow.laneSequence.length]; const pos = boardPosition(crow.laneMarkers[lane]); return <img src={NFO_SCENE_ART.ciderRun.ciderFlow} alt="" aria-hidden="true" style={{ position: "absolute", left: pos.left, top: pos.top, width: boardLayout.side * 1.2, height: boardLayout.side * .8, transform: "translate(-50%,-50%)", zIndex: 9000 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />; })()}
          {isNinefoldOrchard && scenarioId === "po_first_whistle" && state.units.first_root && (() => {
            // "Combat opens only after the network is live" (first-whistle.js) — the exact same
            // connectivity check strikeEnemy itself runs (expedition-engine.js), recomputed here
            // purely for presentation so the shield/vulnerability art always agrees with whether
            // a strike would actually land, never a separately-guessed indicator.
            const root = state.units.first_root;
            const gate = root.networkGate;
            const networkLive = !gate || graphConnected(new Set(gate.activeNodes), [...(gate.edges || []), ...(gate.routeMarkerIds || []).flatMap((id) => routeMarkerConnections(state.objects[id]))], gate.start, gate.end);
            const stonePos = boardPosition(gate?.end || root.pos);
            const rootPos = boardPosition(root.pos);
            return <>
              <img src={NFO_SCENE_ART.firstWhistle.foundingStone} alt="" aria-hidden="true" style={{ position: "absolute", left: stonePos.left, top: stonePos.top + boardLayout.side * .1, width: boardLayout.side * 1.3, height: boardLayout.side * 1.1, transform: "translate(-50%,-100%)", zIndex: 9000 + Math.round(stonePos.top * 10), pointerEvents: "none", objectFit: "contain" }} />
              {root.hp > 0 && <img src={networkLive ? NFO_SCENE_ART.firstWhistle.firstWhistleVulnerability : NFO_SCENE_ART.firstWhistle.firstWhistleShield} alt={networkLive ? "The network is live: First Root can be struck" : "The network is closed: First Root cannot be struck yet"} style={{ position: "absolute", left: rootPos.left, top: rootPos.top + boardLayout.side * .3, width: boardLayout.side * 1.6, height: boardLayout.side * 1.8, transform: "translate(-50%,-100%)", zIndex: 20500 + Math.round(rootPos.top * 10), pointerEvents: "none", objectFit: "contain" }} />}
              {networkLive && (gate?.routeMarkerIds || []).map((id) => { const marker = state.objects[id]; if (!marker?.pos) return null; const mp = boardPosition(marker.pos); return <img key={id} src={NFO_SCENE_ART.firstWhistle.signalRootNetwork} alt="" aria-hidden="true" style={{ position: "absolute", left: mp.left, top: mp.top, width: boardLayout.side * 1.1, height: boardLayout.side * .8, transform: "translate(-50%,-50%)", zIndex: 8900 + Math.round(mp.top * 10), pointerEvents: "none", objectFit: "contain" }} />; })}
            </>;
          })()}
          {isNinefoldOrchard && scenarioId === "po_rootfire_relay" && (() => {
            // A link between every currently-adjacent pair of roots still on the board — drawn
            // from live hex distance, not a fixed chain order, so it reflects Geometry's Shift
            // the moment a gap actually closes rather than assuming the starting layout.
            const roots = Object.values(state.objects).filter((object) => object.kind === "root" && object.pos);
            const links = [];
            for (let i = 0; i < roots.length; i += 1) {
              for (let j = i + 1; j < roots.length; j += 1) {
                if (hexDistance(roots[i].pos, roots[j].pos) === 1) links.push([roots[i], roots[j]]);
              }
            }
            return links.map(([a, b]) => {
              const posA = boardPosition(a.pos), posB = boardPosition(b.pos);
              const midLeft = (posA.left + posB.left) / 2, midTop = (posA.top + posB.top) / 2;
              const angle = Math.atan2(posB.top - posA.top, posB.left - posA.left) * (180 / Math.PI);
              return <img key={`${a.id}-${b.id}`} src={NFO_SCENE_ART.rootfireRelay.bridgeLink} alt="" aria-hidden="true" style={{ position: "absolute", left: midLeft, top: midTop, width: boardLayout.side * 1.1, height: boardLayout.side * .5, transform: `translate(-50%,-50%) rotate(${angle}deg)`, zIndex: 8000 + Math.round(midTop * 10), pointerEvents: "none", objectFit: "contain" }} />;
            });
          })()}
          {isNinefoldOrchard && scenarioId === "po_one_short" && (() => {
            // One outline + gate marker per constraint, positioned from that constraint's own
            // objectIds rather than a hardcoded hex list, so a future gate layout change needs
            // no matching renderer edit. Open/closed reuses the exact same constraintSatisfied
            // (expedition-engine.js) the objective evaluator itself runs — never re-derived.
            const constraints = state.objective.constraints || [];
            return constraints.map((constraint, index) => {
              const cellPositions = constraint.objectIds.map((id) => state.objects[id]?.pos).filter(Boolean).map((hex) => boardPosition(hex));
              if (!cellPositions.length) return null;
              const left = cellPositions.reduce((sum, p) => sum + p.left, 0) / cellPositions.length;
              const top = cellPositions.reduce((sum, p) => sum + p.top, 0) / cellPositions.length;
              const spanX = Math.max(...cellPositions.map((p) => p.left)) - Math.min(...cellPositions.map((p) => p.left));
              const open = constraintSatisfied(state, constraint);
              return <React.Fragment key={`gate-${index}`}>
                <img src={NFO_SCENE_ART.orchardLockdown.groupOutline} alt="" aria-hidden="true" style={{ position: "absolute", left, top, width: boardLayout.side * 2.2 + spanX, height: boardLayout.side * 2.6, transform: "translate(-50%,-50%)", zIndex: 7500 + Math.round(top * 10), pointerEvents: "none", objectFit: "contain", opacity: .85 }} />
                <img src={open ? NFO_SCENE_ART.orchardLockdown.livingGate : NFO_SCENE_ART.orchardLockdown.gate} alt={open ? `Gate ${index + 1}: open` : `Gate ${index + 1}: locked`} style={{ position: "absolute", left, top: top - boardLayout.side * 1.1, width: boardLayout.side * 1.1, height: boardLayout.side * .9, transform: "translate(-50%,-50%)", zIndex: 9600 + Math.round(top * 10), pointerEvents: "none", objectFit: "contain" }} />
              </React.Fragment>;
            });
          })()}
          {isNinefoldOrchard && scenarioId === "po_one_short" && state.units.nearly && state.units.nearly.hp > 0 && (() => {
            // Nearly's real targeting rule (expedition-engine.js's corrupt-value branch) is the
            // nearest unguarded, unlocked ledger cell to itself — not "highest value" as this
            // map's own flags.briefing/intent text claims (found while wiring this, not fixed
            // here: changing enemy targeting is a mechanic change, out of scope for an art
            // pass). The pulse warns on whatever the engine will actually target, not the
            // flavour text's description of it.
            const enemy = state.units.nearly;
            const targets = Object.values(state.objects).filter((object) => object.pos && object.ledgerCell && object.value != null && !object.guarded && !object.valueLocked && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
            targets.sort((a, b) => hexDistance(enemy.pos, a.pos) - hexDistance(enemy.pos, b.pos));
            const target = targets[0];
            if (!target || (enemy.delay && state.turn <= enemy.delay)) return null;
            const pos = boardPosition(target.pos);
            return <img src={NFO_SCENE_ART.orchardLockdown.pulse} alt={`Nearly threatens ${objectLabel(target)}`} style={{ position: "absolute", left: pos.left, top: pos.top, width: boardLayout.side * 1.3, height: boardLayout.side * 1.3, transform: "translate(-50%,-50%)", zIndex: 9100 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />;
          })()}
          {isNinefoldOrchard && scenarioId === "po_nine_across" && (state.objective.capacityLimits || []).map((limit, index) => {
            // Recomputes exactly what evaluateObjective's own capacityLimits check does
            // (expedition-engine.js) — live carried weight vs. a max that's gated to zero
            // when its wind vane isn't in an allowed orientation — never a separately guessed
            // open/closed reading.
            const gate = limit.openWhenOrientation ? state.objects[limit.openWhenOrientation.objectId] : null;
            const orientation = gate ? ((gate.orientation || 0) % 6 + 6) % 6 : 0;
            const max = limit.openWhenOrientation ? (limit.openWhenOrientation.orientations.includes(orientation) ? limit.max : 0) : limit.max;
            const total = Object.values(state.objects).filter((object) => object.pos && limit.hexes.includes(object.pos)).reduce((sum, object) => sum + Number(object.value || 0), 0);
            const positions = limit.hexes.map((hex) => boardPosition(hex));
            const left = positions.reduce((sum, p) => sum + p.left, 0) / positions.length;
            const top = positions.reduce((sum, p) => sum + p.top, 0) / positions.length;
            const open = max > 0;
            return <React.Fragment key={limit.label || index}>
              {open && <img src={NFO_SCENE_ART.nineAcross.windPath} alt="" aria-hidden="true" style={{ position: "absolute", left, top, width: boardLayout.side * 1.3, height: boardLayout.side * 3, transform: "translate(-50%,-50%)", zIndex: 7200 + Math.round(top * 10), pointerEvents: "none", objectFit: "contain", opacity: .75 }} />}
              <div role="img" aria-label={`${limit.label || "Bridge section"}: ${total} of ${open ? limit.max : 0} carried${open ? "" : ", closed"}`} style={{ position: "absolute", left, top: top - boardLayout.side * 1.6, width: boardLayout.side * 1.3, height: boardLayout.side * .8, transform: "translate(-50%,-50%)", zIndex: 9700 + Math.round(top * 10), pointerEvents: "none", background: `url('${NFO_SCENE_ART.nineAcross.capacity}') center/contain no-repeat`, filter: total > max ? "hue-rotate(300deg) saturate(1.6)" : "none" }}>
                <span aria-hidden="true" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", font: `900 ${Math.max(11, boardLayout.side * .18)}px Georgia,serif`, color: "#3e2d1c" }}>{total}/{open ? limit.max : 0}</span>
              </div>
            </React.Fragment>;
          })}
          {isNinefoldOrchard && scenarioId === "po_hedgejaw_maze" && (() => {
            // The next required stone, read the same way the engine's own walk-hedge behaviour
            // and orderedRoute evaluator both derive it (objective.sequence + counters.
            // routeProgress) — never a separately guessed "current" stone.
            const nextValue = state.objective.sequence?.[state.counters.routeProgress || 0];
            const target = Object.values(state.objects).find((object) => object.kind === "stone" && object.value === nextValue && !object.visited);
            if (!target?.pos) return null;
            const pos = boardPosition(target.pos);
            return <img src={NFO_SCENE_ART.hedgejawMaze.routeCue} alt={`Next required stone: ${target.value}`} style={{ position: "absolute", left: pos.left, top: pos.top - boardLayout.side * .9, width: boardLayout.side * 1.1, height: boardLayout.side * .9, transform: "translate(-50%,-50%)", zIndex: 9700 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />;
          })()}
          {isNinefoldOrchard && scenarioId === "po_hollow_bough" && state.units.overgrowth?.intentRevealed && state.objects.memorial?.pos && (() => {
            // Logic's Predict sets intentRevealed on the enemy itself (useDisciplineAction,
            // expedition-engine.js) — Overgrowth only ever targets the memorial, so the
            // forecast cue anchors there rather than needing a separate predicted-hex field.
            const pos = boardPosition(state.objects.memorial.pos);
            return <img src={NFO_SCENE_ART.hollowBough.forecast} alt="Overgrowth is forecast to strike the memorial" style={{ position: "absolute", left: pos.left, top: pos.top - boardLayout.side * .6, width: boardLayout.side * 1.4, height: boardLayout.side * 1.2, transform: "translate(-50%,-50%)", zIndex: 9700 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />;
          })()}
          {isNinefoldOrchard && scenarioId === "po_maybe_roost" && (() => {
            // A decorative storm-front cue over the corner the three Maybe-Finches actually
            // start in (their own fixed positions, not a hardcoded hex), rather than floating
            // it over an arbitrary part of the board.
            const finches = ["maybe_finch_a", "maybe_finch_b", "maybe_finch_c"].map((id) => state.units[id]).filter(Boolean);
            if (!finches.length) return null;
            const left = finches.reduce((sum, f) => sum + boardPosition(f.pos).left, 0) / finches.length;
            const top = finches.reduce((sum, f) => sum + boardPosition(f.pos).top, 0) / finches.length;
            return <img src={NFO_SCENE_ART.maybeFlockRoost.stormFront} alt="" aria-hidden="true" style={{ position: "absolute", left, top: top - boardLayout.side, width: boardLayout.side * 3.2, height: boardLayout.side * 2.6, transform: "translate(-50%,-50%)", zIndex: 7000 + Math.round(top * 10), pointerEvents: "none", objectFit: "contain", opacity: .8 }} />;
          })()}
          {isNinefoldOrchard && scenarioId === "po_rootfire_relay" && state.units.strawling?.hp > 0 && (() => {
            // Strawling's real targeting rule (wilt-root, expedition-engine.js): the single
            // highest-value unguarded root anywhere on the board — recomputed live so the
            // pulse always warns on whatever it will actually wilt next.
            const enemy = state.units.strawling;
            if (enemy.delay && state.turn <= enemy.delay) return null;
            const targets = Object.values(state.objects).filter((object) => object.kind === "root" && object.pos && !object.guarded && (!object.stabilisedUntil || object.stabilisedUntil <= state.turn));
            targets.sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
            const target = targets[0];
            if (!target) return null;
            const pos = boardPosition(target.pos);
            return <img src={NFO_SCENE_ART.rootfireRelay.rootfirePulse} alt={`Strawling threatens ${objectLabel(target)}`} style={{ position: "absolute", left: pos.left, top: pos.top, width: boardLayout.side * 1.3, height: boardLayout.side * 1.3, transform: "translate(-50%,-50%)", zIndex: 9100 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />;
          })()}
          {isNinefoldOrchard && scenarioId === "po_count_the_murder" && result.complete && state.units.crowbreaker && (() => {
            const pos = boardPosition(state.units.crowbreaker.pos);
            return <img src={NFO_SCENE_ART.murderAtMoonfall.containment} alt="The ring is closed" aria-hidden="true" style={{ position: "absolute", left: pos.left, top: pos.top, width: boardLayout.side * 2.4, height: boardLayout.side * 2.4, transform: "translate(-50%,-50%)", zIndex: 20500 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />;
          })()}
          {isNinefoldOrchard && scenarioId === "po_nine_across" && state.objective.destinationHexes.map((key) => { const pos = boardPosition(key); return <img key={`alcove-${key}`} src={NFO_SCENE_ART.nineAcross.safeAlcove} alt="" aria-hidden="true" style={{ position: "absolute", left: pos.left, top: pos.top + boardLayout.side * .1, width: boardLayout.side * 1.3, height: boardLayout.side * 1.1, transform: "translate(-50%,-100%)", zIndex: 9000 + Math.round(pos.top * 10), pointerEvents: "none", objectFit: "contain" }} />; })}
          {isNinefoldOrchard && state.objective.exitHex && (() => { const pos = boardPosition(state.objective.exitHex); const art = nfoTallyArchArt(state.objective, result.values); return <div aria-hidden="true" style={{ position: "absolute", left: pos.left, top: pos.top + boardLayout.side * .38, width: boardLayout.side * 2.8, height: boardLayout.side * 3.6, transform: "translate(-50%,-100%)", zIndex: 10000 + Math.round(pos.top * 10) + 7, pointerEvents: "none", background: `url('${art}') center bottom/contain no-repeat` }} />; })()}
          {isNinefoldOrchard && selected && (() => { const pos = boardPosition(selected.pos); return <div aria-hidden="true" style={{ position: "absolute", left: pos.left, top: pos.top, width: boardLayout.metrics.width, height: boardLayout.metrics.height, transform: "translate(-50%,-50%)", clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)", zIndex: 9000 + Math.round(pos.top * 10) + 3, pointerEvents: "none", background: `url('${sceneEffects.selected}') center/cover no-repeat` }} />; })()}
          {Object.entries(state.objects).filter(([, object]) => object.pos && !object.removed && !(scenarioId === "po_unequal_crossing" && (state.objective.leftHexes.includes(object.pos) || state.objective.rightHexes.includes(object.pos)))).map(([id, object]) => { const pos = boardPosition(object.pos); return isNinefoldOrchard ? <NfoBoardObject key={id} object={object} position={pos} side={boardLayout.side} moduleKey={state.moduleKey} parityBadge={scenarioId === "po_rootfire_relay" && id === "root_e"} onClick={() => tileClick(object.pos)} /> : <button type="button" key={id} aria-label={`Load ${objectLabel(object)}`} onClick={() => tileClick(object.pos)} style={{ position: "absolute", left: pos.left, top: pos.top, width: 42, height: 42, background: object.guarded ? "#79acc0" : "#8a5a2d", color: "#fff7c9", cursor: "pointer" }}>{objectLabel(object)}</button>; })}
          {Object.values(state.units).filter((unit) => unit.hp > 0).map((unit) => { const pos = boardPosition(unit.pos); const card = cardMap[unit.id]; const art = unit.side === "player" ? (isNinefoldOrchard ? (nfoCharacterArt(unit) || avatarForCard(state.moduleKey, card)) : avatarForCard(state.moduleKey, card)) : (isNinefoldOrchard ? nfoEnemyArt(unit, state) : null); const isSelected = unit.id === selectedId; return <button type="button" key={unit.id} onClick={() => tileClick(unit.pos)} aria-label={unit.side === "player" ? `${unit.name}: ${unit.ap} action points, ${unit.hp} hearts` : `${unit.name}: ${unit.intent || "advances"}, ${unit.hp} hearts`} title={unit.side === "player" ? `${unit.name}: ${unit.ap} action points` : `${unit.name}: ${unit.intent || "advances"}`} style={{ position: "absolute", left: pos.left, top: pos.top + boardLayout.side * .3, transform: "translate(-50%,-100%)", zIndex: 20000 + Math.round(pos.top * 10) + 8, width: isNinefoldOrchard ? boardLayout.side * 1.44 : 54, height: isNinefoldOrchard ? boardLayout.side * 1.76 : 70, padding: 0, border: 0, borderRadius: 0, overflow: "visible", background: "transparent", cursor: "pointer", filter: isSelected ? "drop-shadow(0 0 8px #ffe57e)" : "drop-shadow(0 7px 5px rgba(27,30,21,.45))" }}>{isNinefoldOrchard && <><span aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: 0, width: boardLayout.side * .9, height: boardLayout.side * .3, transform: "translateX(-50%)", borderRadius: "50%", background: unit.side === "player" ? "rgba(53,176,191,.42)" : "rgba(154,64,42,.46)", border: `${Math.max(2, boardLayout.side * .045)}px solid ${isSelected ? "#ffd447" : unit.side === "player" ? "#71e1eb" : "#e58b64"}`, boxShadow: "0 4px 7px rgba(25,31,25,.4)", pointerEvents: "none" }} /><span aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: -2, width: boardLayout.side * .96, height: boardLayout.side * .32, transform: "translateX(-50%)", background: `url('${sceneEffects.shadow}') center/contain no-repeat`, pointerEvents: "none" }} /></>}{art ? <img src={art} alt="" aria-hidden="true" style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center bottom", pointerEvents: "none" }} /> : <span aria-hidden="true" style={{ fontSize: 48 }}>{unit.side === "enemy" ? "🐾" : "🧙"}</span>}{isNinefoldOrchard && unit.side === "player" && unit.carrying && !ALL_CHARACTER_ART[unit.id]?.carry && <img src={sceneCarriedArt} alt="" aria-hidden="true" style={{ position: "absolute", zIndex: 2, left: "50%", bottom: "12%", width: "50%", height: "42%", transform: "translateX(-50%)", objectFit: "contain", pointerEvents: "none" }} />}</button>; })}
          {scalePickHex && (() => { const pos = boardPosition(scalePickHex); const guarding = actionMode === "guard"; const loads = Object.values(state.objects).filter((item) => item.pos === scalePickHex && !item.removed && (!guarding || !item.guarded)).sort((a, b) => a.value - b.value || a.id.localeCompare(b.id)); return <div role="dialog" aria-label={guarding ? "Choose a load to guard" : "Choose a load to lift"} style={{ position: "absolute", left: pos.left, top: pos.top + boardLayout.metrics.height * .55, transform: "translateX(-50%)", zIndex: 50000, minWidth: 180, padding: 10, border: "3px solid #8d632d", borderRadius: 12, background: "#f4e1aa", boxShadow: "0 8px 22px rgba(31,22,9,.5)", textAlign: "center" }}><b style={{ display: "block", font: "bold 13px Georgia,serif", color: "#4b321b", marginBottom: 6 }}>{guarding ? "Guard which load?" : "Lift which load?"}</b>{loads.map((load) => <NfoActionButton key={load.id} label={`${guarding ? "Guard" : "Lift"} ${objectLabel(load)}`} iconKey={guarding ? "guard" : "collect"} onClick={() => { setScalePickHex(null); apply(guarding ? { type: "GUARD", unitId: selectedId, targetId: load.id } : { type: "INTERACT", unitId: selectedId, targetId: load.id }, `${selected.name} ${guarding ? "guards" : "lifts"} ${objectLabel(load)} ${guarding ? "on" : "from"} the scale.`); }} />)}<button type="button" onClick={() => setScalePickHex(null)} style={{ display: "block", margin: "5px auto 0", border: 0, background: "transparent", color: "#654521", textDecoration: "underline", cursor: "pointer" }}>Cancel</button></div>; })()}
          {rotateObjectId && isNinefoldOrchard && <div role="dialog" aria-label="Choose operator" style={{ position: "absolute", zIndex: 50000, left: "50%", top: "46%", transform: "translate(-50%,-50%)", padding: "12px 18px", border: "5px ridge #b78140", borderRadius: 16, background: "#f5e3b8", boxShadow: "0 10px 28px rgba(24,16,8,.6)", textAlign: "center" }}><b style={{ font: "bold 17px Georgia,serif" }}>Choose an operator</b><div style={{ display: "flex", gap: 7, marginTop: 8 }}>{OPERATOR_CHOICES.map((op) => <NfoActionButton key={op} label={OPERATOR_SYMBOL[op]} iconKey="rotate" onClick={() => apply({ type: "ROLE_ACTION", unitId: selectedId, actionId: "reframe", parameters: { targetId: rotateObjectId, op } }, `${selected.name} sets an operator to ${OPERATOR_SYMBOL[op]}.`)} />)}</div><button type="button" onClick={() => setRotateObjectId(null)} style={{ marginTop: 5, border: 0, background: "transparent", color: "#56381d", textDecoration: "underline", cursor: "pointer" }}>Cancel</button></div>}
          {isNinefoldOrchard && turnBanner && (() => {
            const art = NFO_SCENE_ART.ui.turnBanner?.[turnBanner]; // Codex's art, once it exists — falls back to a plain plaque until then
            const label = turnBanner === "enemy" ? "Enemy turn" : "Your turn";
            const accent = turnBanner === "enemy" ? "#8a3b2c" : theme.accent;
            return <div aria-live="polite" style={{ position: "absolute", left: "50%", top: "38%", zIndex: 40000, pointerEvents: "none", animation: "expedition-turn-banner 1.1s ease-out forwards" }}>
              {art
                ? <img src={art} alt={label} style={{ display: "block", maxWidth: "min(78vw,420px)", filter: "drop-shadow(0 10px 20px rgba(20,14,8,.5))" }} />
                : <div style={{ padding: "14px 40px", borderRadius: 14, border: `3px solid ${accent}`, background: "rgba(35,24,14,.88)", color: "#fff6dc", font: "900 clamp(20px,4vw,30px) Georgia,serif", letterSpacing: 2, textAlign: "center", boxShadow: "0 10px 24px rgba(15,10,6,.5)" }}>{label.toUpperCase()}</div>}
            </div>;
          })()}
          {outcome && <div style={{ position: "absolute", inset: 0, zIndex: 999, display: "grid", placeItems: "center", background: "rgba(31,47,35,.72)", padding: 20 }}><Panel style={{ padding: 24, maxWidth: 410, textAlign: "center" }}><div style={{ fontSize: 48 }}>{state.status === "won" ? "⚖️" : "⌛"}</div><h2 style={{ font: "700 31px Georgia,serif", margin: "4px 0" }}>{state.status === "won" ? "Objective complete" : "The round runs out"}</h2><p>{outcome.message}</p>{state.status === "won" && marks.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, margin: "2px 0 14px" }}>{marks.map((markId) => <span key={markId} style={{ fontSize: 11, fontWeight: 800, color: "#5d4a1a", background: "#f7e7ae", border: "1px solid rgba(93,74,26,.3)", borderRadius: 999, padding: "4px 10px" }}>{EXPEDITION_MARK_LABELS[markId] || markId}</span>)}</div>}<div style={{ display: "flex", justifyContent: "center", gap: 9 }}><button type="button" onClick={onRestart} style={buttonStyle("#6f5235")}>Change squad</button><button type="button" onClick={() => { setState(catalogue.createState(squad)); setUndo([]); setEventLog([]); setSelectedId(squad[0].id); rewarded.current = false; }} style={buttonStyle(GREEN)}>Play again</button></div></Panel></div>}
        </div>
        <Panel style={{ padding: 12, ...(isNinefoldOrchard ? { display: openPanel === "objective" ? "block" : "none", position: "absolute", zIndex: 1200, right: 10, top: 10, width: 340, maxHeight: "calc(100% - 20px)", overflowY: "auto", boxShadow: "0 18px 50px rgba(24,28,18,.5)" } : {}) }}><div style={{ fontWeight: 900, fontSize: 13, color: theme.accent, letterSpacing: 1 }}>OBJECTIVE</div><p style={{ fontSize: 13, lineHeight: 1.42, margin: "7px 0 10px" }}>{briefing}</p>
          {result.sides ? (() => {
            const dialCentre = NINEFOLD_ORCHARD_ART.objectives.balance?.liveOverlay?.dialCentre || [0.5, 0.37];
            // Weigh-bridge state (UI reconciliation contract): the engine's own status and
            // difference drive both the art and an exact text equivalent — "BRIDGE A 7/7
            // BALANCED" style — never a re-derived or independent sum.
            const statusText = (side) => side.status === "balanced" ? "Balanced" : `${BALANCE_STATUS_LABEL[side.status]} ${Math.abs(side.difference)}`;
            const statusColour = (side) => side.status === "balanced" ? GREEN : side.status === "overloaded" ? RED : INK;
            const platform = (side, sideLabel) => {
              const art = isNinefoldOrchard ? nfoBalanceArt(side) : null;
              return <div>
                {art
                  ? <div style={{ position: "relative", width: "100%", aspectRatio: "1", background: `url('${art}') center/contain no-repeat` }}>
                      <span style={{ position: "absolute", left: `${dialCentre[0] * 100}%`, top: `${dialCentre[1] * 100}%`, transform: "translate(-50%,-50%)", fontSize: 20, fontWeight: 900, color: statusColour(side) }}>{side.currentTotal}</span>
                    </div>
                  : <><small>{sideLabel}</small><div style={{ fontSize: 26, fontWeight: 900, color: statusColour(side) }}>{side.currentTotal}</div></>}
                <div style={{ fontSize: 10, fontWeight: 800, color: statusColour(side), marginTop: 3 }}>{side.currentTotal}/{side.target} · {statusText(side)}</div>
              </div>;
            };
            return <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 7, background: theme.panelBg, borderRadius: 11, padding: 10, textAlign: "center" }}>
              {platform(result.sides.left, "SIDE A")}
              <b style={{ fontSize: 22 }}>=</b>
              {platform(result.sides.right, "SIDE B")}
            </div>;
          })() : null}
          <div style={{ fontSize: 12, fontWeight: 800, textAlign: "center", marginTop: 7 }}>{result.progress}</div>
          <div style={{ borderTop: "1px solid #d7ccb5", marginTop: 11, paddingTop: 9 }}><b style={{ fontSize: 12 }}>Enemy intentions</b>{enemies.filter((enemy) => enemy.hp > 0).map((enemy) => <div key={enemy.id} style={{ marginTop: 6, background: "#f2d9c9", borderRadius: 8, padding: 7, fontSize: 11 }}><b>{enemy.name}</b>: {enemy.delay && state.turn <= enemy.delay ? "studies the board" : (enemy.intent || "advances")} · ♥{enemy.hp}</div>)}</div>
          <div style={{ borderTop: "1px solid #d7ccb5", marginTop: 11, paddingTop: 9 }}><b style={{ fontSize: 12 }}>Field report</b><div style={{ minHeight: 48, fontSize: 12, lineHeight: 1.4, marginTop: 4 }}>{message}</div>{eventLog.map((line, index) => <div key={index} style={{ fontSize: 10, color: "#777267", marginTop: 3 }}>• {line}</div>)}</div>
          <div style={{ display: "grid", gap: 7, marginTop: 12 }}>
            {(() => { return (isNinefoldOrchard && <NfoActionButton label="End round" iconKey="endRound" tone="confirm" disabled={endDisabled} onClick={endTurn} />) || <button type="button" onClick={endTurn} disabled={endDisabled} style={buttonStyle(RED, endDisabled)}>End round →</button>; })()}
            {(() => { const onUndo = () => { const previous = undo.at(-1); if (!previous) return; setState(previous); setUndo((items) => items.slice(0, -1)); setMessage("Last decision undone."); }; return (isNinefoldOrchard && <NfoActionButton label="Undo last action" iconKey="undo" disabled={undoDisabled} onClick={onUndo} />) || <button type="button" onClick={onUndo} disabled={undoDisabled} style={buttonStyle("#6b7480", undoDisabled)}>Undo last action</button>; })()}
          </div>
          <div style={{ marginTop: 12, fontSize: 10, color: "#716d63" }}>Stats: {EXPEDITION_STAT_NAMES.join(" · ")}. Movement, hearts, range, initiative and attack strength all come from the selected cards.</div>
        </Panel>
      </div>
      {isNinefoldOrchard && <NfoActionBar>
        <div role="group" aria-label="Party health and action points" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 7 }}>
          {heroes.map((hero) => <button key={hero.id} type="button" aria-label={`${hero.name}: ${hero.ap} of ${hero.maxAp} action points, ${hero.hp} of ${hero.maxHp} health${hero.id === selectedId ? ", selected" : ""}`} aria-pressed={hero.id === selectedId} onClick={() => { setSelectedId(hero.id); setActionMode("move"); setMessage(`${hero.name} selected. Choose an action or a glowing hex.`); }} style={{ position: "relative", width: 270, height: 66, border: 0, padding: 0, background: `url('${NFO_SCENE_ART.ui.heroFrame}') center/100% 100% no-repeat`, cursor: "pointer", filter: hero.id === selectedId ? "drop-shadow(0 0 6px #ffe475)" : "drop-shadow(0 2px 2px rgba(24,15,8,.5))" }}>
            <img src={nfoCharacterArt(hero) || avatarForCard(state.moduleKey, cardMap[hero.id])} alt="" aria-hidden="true" style={{ position: "absolute", left: 16, top: 7, width: 44, height: 51, objectFit: "contain" }} />
            <span aria-hidden="true" style={{ position: "absolute", left: 70, top: 17, right: 17, textAlign: "left", color: "#352313", font: "bold 13px Georgia,serif", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{hero.name}</span>
            <span aria-hidden="true" style={{ position: "absolute", left: 69, top: 37, right: 18, display: "flex", alignItems: "center", gap: 3, padding: "1px 3px", textAlign: "left", color: "#56391b", background: "rgba(255,244,208,.92)", border: "1px solid #b98b48", borderRadius: 4, font: "bold 11px Georgia,serif", whiteSpace: "nowrap" }}>{NFO_SCENE_ART.ui.apBadge && <img src={NFO_SCENE_ART.ui.apBadge} alt="" style={{ width: 11, height: 11, objectFit: "contain" }} />}{hero.ap}/{hero.maxAp}<span style={{ margin: "0 1px" }}>·</span>{NFO_SCENE_ART.ui.heartBadge && <img src={NFO_SCENE_ART.ui.heartBadge} alt="" style={{ width: 11, height: 11, objectFit: "contain" }} />}{hero.hp}/{hero.maxHp}</span>
          </button>)}
        </div>
        <div role="group" aria-label={`${selected?.name || "Hero"} actions`} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5 }}>
          <NfoActionButton label="Move" iconKey="move" selected={actionMode === "move"} disabled={!canAct || !reachable.size} title="Choose a glowing movement hex" onClick={() => chooseAction("move", "choose a glowing hex to move.")} />
          <NfoActionButton label="Pick up" iconKey="collect" selected={actionMode === "pickup"} disabled={!canAct || !pickupTargets.length} title="Choose an adjacent numbered load" onClick={() => chooseAction("pickup", "tap an adjacent load to pick it up.")} />
          <NfoActionButton label="Put down" iconKey="interact" selected={actionMode === "putdown"} disabled={!canAct || !dropTargets.length} title="Choose your hex or an adjacent hex or scale" onClick={() => chooseAction("putdown", "tap your hex, an adjacent hex or a brass scale to place the load.")} />
          <NfoActionButton label="Guard" iconKey="guard" selected={actionMode === "guard"} disabled={!canAct || (!guardable.length && !guardableHeroes.length)} title="Choose an adjacent load or hero to protect" onClick={() => chooseAction("guard", "tap an adjacent load or hero to protect it.")} />
          <NfoActionButton label="Attack" iconKey="strike" selected={actionMode === "strike"} disabled={!canAct || !strikeTargets.length} title="Choose an enemy in range" onClick={() => chooseAction("strike", "tap an enemy in range.")} />
          {reframable.length > 0 && <NfoActionButton label="Rotate" iconKey="rotate" selected={actionMode === "rotate"} disabled={!canAct} title="Choose an adjacent operator tile" onClick={() => chooseAction("rotate", "tap an adjacent operator tile.")} />}
          <NfoActionButton label="Undo" iconKey="undo" disabled={undoDisabled} onClick={undoLast} />
          <NfoActionButton label="End round" iconKey="endRound" tone="confirm" disabled={endDisabled} onClick={endTurn} />
        </div>
      </NfoActionBar>}
    </div>
  </div>;
}
