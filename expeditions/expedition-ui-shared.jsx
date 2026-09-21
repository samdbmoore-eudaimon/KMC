// Small shared bits between ExpeditionScreen.jsx (map/briefing/squad) and
// ExpeditionBoard.jsx (board/result) — E6 presentation integration. Kept out of both so
// splitting the screen didn't mean duplicating styling helpers.
import React from "react";
import { axialToPixel } from "./expedition-hex-layout.js";

export const INK = "#24342a";
export const CREAM = "#fff8e8";
export const GOLD = "#d6a334";
export const GREEN = "#4f7d48";
export const RED = "#a13f32";
export const DISCIPLINE_COLOURS = { arithmetic: "#cf7f2d", geometry: "#3c86a8", logic: "#7657a6", science: "#4d8a58", speed: "#b94e61" };
export const TERRAIN_COLOURS = { clear: "#8fb768", difficult: "#718f55", blocked: "#465b47" };

// Per-module presentation labels — the board and briefing both need "what is this world
// called" without hard-coding Ninefold Orchard everywhere the way the prototype did.
export const MODULE_DISPLAY = {
  primary: { label: "NINEFOLD ORCHARD", accent: "#8a5e22", panelBg: "#eee3bf" },
  junior: { label: "LITTLE RECKONING", accent: "#5d4a8a", panelBg: "#e3ddf1" },
  intermediate: { label: "GIFFORD", accent: "#7a2e2e", panelBg: "#e9d6ce" },
};

export function buttonStyle(colour = GREEN, disabled = false) {
  return {
    border: "1px solid rgba(42,48,34,.22)", borderRadius: 10, padding: "9px 13px",
    background: disabled ? "#d8d4c8" : colour, color: disabled ? "#807e77" : "#fff",
    fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 3px 0 rgba(35,45,31,.22)",
  };
}

export function Panel({ children, style }) {
  return <div style={{ background: "rgba(255,248,232,.94)", border: "2px solid rgba(93,67,34,.25)", borderRadius: 16, boxShadow: "0 10px 28px rgba(32,43,29,.18)", ...style }}>{children}</div>;
}

export function hexPosition(key, side, origin) {
  const point = axialToPixel(key, side, origin);
  return { left: point.x, top: point.y, x: point.x, y: point.y };
}

export function unitAt(state, key) {
  return Object.values(state.units).find((unit) => unit.hp > 0 && unit.pos === key);
}

export function objectAt(state, key) {
  return Object.values(state.objects).find((object) => !object.removed && object.pos === key);
}

// Display text for computeExpeditionMarks's ids (expedition-engine.js) — decorative only,
// shown on a win and in Card Lab's Expedition records; see EXPEDITIONS_SPEC.md §23.
export const EXPEDITION_MARK_LABELS = {
  no_exhaustion: "No hero exhausted",
  no_enemies_defeated: "No enemy defeated",
  exact_turn_target: "Within the round target",
  minimum_movement: "Efficient movement",
};

// An object may carry a `value` (crates/tasks) or an `op` (operator sockets, possibly
// still unset/null) — never both. Falls back to "?" only for an unset operator, never for
// a genuinely unlabelled object (which would be a content bug worth seeing, not hiding).
export function objectLabel(object) {
  if ("op" in object) return object.op || "?";
  return object.value;
}

export function SquadCard({ profile, art, selected, owned, onClick, disabled }) {
  const colour = DISCIPLINE_COLOURS[profile.discipline] || GREEN;
  return <button type="button" onClick={onClick} disabled={disabled} style={{ width: 148, textAlign: "left", padding: 0, overflow: "hidden", borderRadius: 14, border: selected ? `4px solid ${GOLD}` : "2px solid rgba(67,58,42,.2)", background: CREAM, opacity: disabled ? .48 : 1, cursor: disabled ? "not-allowed" : "pointer", boxShadow: selected ? "0 0 0 3px rgba(214,163,52,.25)" : "0 5px 14px rgba(39,45,31,.13)" }}>
    <div style={{ height: 88, background: `linear-gradient(145deg, ${colour}44, #e8dfc4)`, display: "grid", placeItems: "center", overflow: "hidden" }}>
      {art ? <img src={art} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 24%" }} /> : <span style={{ fontSize: 46 }}>🧙</span>}
    </div>
    <div style={{ padding: "8px 9px 10px" }}>
      <div style={{ fontWeight: 900, color: INK }}>{profile.name}</div>
      <div style={{ fontSize: 11, color: colour, fontWeight: 800 }}>{profile.disciplineName} · {profile.roleName}</div>
      <div style={{ fontSize: 11, color: "#655f54", marginTop: 4 }}>♥ {profile.hearts} · Move {profile.move} · {owned ? "Your card" : "Training loan"}</div>
    </div>
  </button>;
}
