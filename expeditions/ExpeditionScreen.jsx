// E6 presentation integration: the pre-game flow (map, briefing, squad selection). The
// in-game flow (board, result) lives in ExpeditionBoard.jsx — split so neither file grew
// into the single 190-line-of-everything the original prototype was becoming as more
// scenarios and art landed.
import React, { useEffect, useMemo, useState } from "react";
import { EXPEDITION_SCENARIOS } from "./expedition-data.js";
import { expeditionRoster } from "./expedition-roster.js";
import { catalogueEntry, playableScenarioIdsForModule } from "./expedition-catalogue.js";
import { migrateExpeditionProgress } from "../wm-progress.js";
import ExpeditionBoard from "./ExpeditionBoard.jsx";
import { Panel, SquadCard, buttonStyle, GREEN, RED, MODULE_DISPLAY } from "./expedition-ui-shared.jsx";

// A module may now have more than one playable entry (Gifford has two): every playable
// scenario is a button that selects it as the one the briefing panel above configures a
// squad for. An unplayable entry stays inert, same as before.
function ExpeditionCatalogueMap({ scenarios, scenarioRecords, playableIds, selectedId, onSelect }) {
  return <Panel style={{ padding: 16 }}>
    <h3 style={{ margin: "0 0 12px" }}>Expedition catalogue</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 9 }}>
      {scenarios.map((scenario, index) => {
        const record = scenarioRecords[scenario.id];
        const isPlayable = playableIds.includes(scenario.id);
        const isSelected = scenario.id === selectedId;
        return <button type="button" key={scenario.id} disabled={!isPlayable} onClick={() => onSelect(scenario.id)} style={{ textAlign: "left", border: 0, cursor: isPlayable ? "pointer" : "default", padding: 11, borderRadius: 10, background: record?.completed ? "#e4f1d9" : "rgba(106,89,57,.07)", boxShadow: isSelected ? "inset 0 0 0 2px rgba(74,68,52,.75)" : isPlayable ? "inset 0 0 0 1px rgba(74,68,52,.4)" : "inset 0 0 0 1px rgba(74,68,52,.12)", opacity: isPlayable ? 1 : .68 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 7 }}><b>{index + 1}. {scenario.title}</b><span>{record?.completed ? "✓" : isPlayable ? "◇" : "…"}</span></div>
          <div style={{ fontSize: 11, color: "#67665f", marginTop: 4, textTransform: "capitalize" }}>{scenario.family.replaceAll("-", " ")} · {scenario.turns} rounds{!isPlayable ? " · not yet playable" : ""}</div>
        </button>;
      })}
    </div>
  </Panel>;
}

function ExpeditionBriefing({ activeModule, cards, progress, avatarForCard, onExit, onBegin }) {
  const scenarios = EXPEDITION_SCENARIOS[activeModule] || [];
  const playableIds = playableScenarioIdsForModule(activeModule);
  const [selectedId, setSelectedId] = useState(playableIds[0] || null);
  // A module switch (or, now Gifford has two, picking a different scenario within the same
  // module) must reset which scenario the briefing configures — otherwise a stale id from
  // the previous module/scenario would linger in this component's own state.
  useEffect(() => { setSelectedId(playableScenarioIdsForModule(activeModule)[0] || null); }, [activeModule]);
  const playableScenario = scenarios.find((s) => s.id === selectedId) || null;
  const catalogue = selectedId ? catalogueEntry(selectedId) : null;
  const roster = useMemo(() => expeditionRoster(activeModule), [activeModule]);
  const cardMap = useMemo(() => Object.fromEntries(cards.map((card) => [card.id, card])), [cards]);
  const squadSize = catalogue?.squadSize ?? 3;
  const available = roster.filter((profile) => cardMap[profile.id]);
  const initial = useMemo(() => {
    const preferred = catalogue?.loanSquad || [];
    return [...preferred.map((id) => available.find((profile) => profile.id === id)).filter(Boolean), ...available]
      .filter((profile, index, list) => list.findIndex((item) => item.id === profile.id) === index)
      .slice(0, squadSize).map((profile) => profile.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule, selectedId]);
  const [selected, setSelected] = useState(initial);
  useEffect(() => { setSelected(initial); }, [initial]);
  const scenarioRecords = migrateExpeditionProgress(progress.expeditions).scenarios;
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < squadSize ? [...current, id] : current);
  const theme = MODULE_DISPLAY[activeModule] || MODULE_DISPLAY.primary;
  return <div style={{ minHeight: "100vh", padding: "18px clamp(12px,3vw,34px) 36px", color: "#24342a", background: "radial-gradient(circle at 50% 5%, rgba(255,241,183,.9), transparent 38%), linear-gradient(#9fc47e, #526f4d 70%, #344d3c)" }}>
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <button type="button" onClick={onExit} style={buttonStyle("#73583a")}>← Home</button>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, letterSpacing: 3, fontWeight: 900, color: "#405c3d" }}>EXPEDITIONS · {theme.label}</div><h1 style={{ margin: 0, fontSize: "clamp(27px,4vw,46px)", fontFamily: "Georgia, serif", color: "#263a29" }}>Small maps. Exact plans.</h1></div>
        <div style={{ minWidth: 82, textAlign: "right", fontWeight: 900, color: "#36543a" }}>{Object.values(scenarioRecords).filter((s) => s.completed).length}/{scenarios.length} cleared</div>
      </div>
      {playableScenario && <Panel style={{ padding: 18, marginBottom: 16, background: "linear-gradient(135deg, rgba(255,251,235,.96), rgba(239,224,174,.96))" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(250px,.8fr)", gap: 18 }}>
          <div><div style={{ fontWeight: 900, color: "#936523", fontSize: 13, letterSpacing: 1.6 }}>MAP {playableScenario.level} · GUIDED</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, margin: "3px 0 7px" }}>{playableScenario.title}</h2><p style={{ margin: 0, lineHeight: 1.55, fontWeight: 600 }}>{catalogue.config.flags?.briefing || playableScenario.rule}</p></div>
          <div style={{ background: "rgba(78,103,62,.12)", borderRadius: 12, padding: 13 }}><b>First-clear reward</b><div style={{ fontSize: 24, marginTop: 4 }}>⭐⭐⭐</div><div style={{ fontSize: 12, color: "#5c6256" }}>Three stars once. Replays are for finding a sharper solution.</div><div style={{ marginTop: 8, fontSize: 12, fontWeight: 800 }}>{catalogue.config.turnLimit} rounds · squad of {squadSize}</div></div>
        </div>
      </Panel>}
      {playableScenario ? <>
        <Panel style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "end", flexWrap: "wrap" }}><div><h3 style={{ margin: 0, fontSize: 20 }}>Choose {squadSize} card{squadSize === 1 ? "" : "s"}</h3><div style={{ fontSize: 13, color: "#66675f", marginTop: 3 }}>Every stat changes the figure. The opening lesson lends a training squad if you have not found them yet.</div></div><b style={{ color: selected.length === squadSize ? GREEN : RED }}>{selected.length}/{squadSize} ready</b></div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "14px 2px 6px" }}>{available.map((profile) => { const card = cardMap[profile.id]; const owned = (progress.cards?.[profile.id] || 0) > 0; return <SquadCard key={profile.id} profile={profile} art={avatarForCard(activeModule, card)} selected={selected.includes(profile.id)} owned={owned} disabled={!selected.includes(profile.id) && selected.length >= squadSize} onClick={() => toggle(profile.id)} />; })}</div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}><button type="button" onClick={() => onBegin(selected.map((id) => roster.find((profile) => profile.id === id)), selectedId)} disabled={selected.length !== squadSize} style={{ ...buttonStyle(GREEN, selected.length !== squadSize), fontSize: 17, padding: "12px 24px" }}>Begin the expedition</button></div>
        </Panel>
      </> : <Panel style={{ padding: 18, marginBottom: 16 }}><h3 style={{ marginTop: 0 }}>Maps are specified, not yet playable here</h3><p style={{ marginBottom: 0 }}>The shared rules engine and this module's first map exist and are fully tested at the engine layer, but this module has no playable entry wired into the screen yet.</p></Panel>}
      <ExpeditionCatalogueMap scenarios={scenarios} scenarioRecords={scenarioRecords} playableIds={playableIds} selectedId={selectedId} onSelect={setSelectedId} />
    </div>
  </div>;
}

export default function ExpeditionScreen({ activeModule, progress, setProgress, setScreen, beep, fireConfetti, cards, avatarForCard }) {
  // { scenarioId, squad } once a squad is confirmed, so a module with more than one
  // playable scenario (Gifford now has two) launches whichever one the briefing selected —
  // not always "the" playable entry for the module.
  const [session, setSession] = useState(null);
  if (!session) return <ExpeditionBriefing activeModule={activeModule} cards={cards} progress={progress} avatarForCard={avatarForCard} onExit={() => setScreen("home")} onBegin={(squad, scenarioId) => setSession({ squad, scenarioId })} />;
  return <ExpeditionBoard scenarioId={session.scenarioId} squad={session.squad} cards={cards} avatarForCard={avatarForCard} progress={progress} setProgress={setProgress} beep={beep} fireConfetti={fireConfetti} onExit={() => setSession(null)} onRestart={() => setSession(null)} />;
}
