import React, { useEffect, useMemo, useState } from "react";
import { EXPEDITION_SCENARIOS } from "./expedition-data.js";
import { expeditionRoster } from "./expedition-roster.js";
import { catalogueEntry, playableScenarioIdsForModule } from "./expedition-catalogue.js";
import { assessSquadReadiness } from "./expedition-readiness.js";
import { migrateExpeditionProgress } from "../wm-progress.js";
import { NFO_CARD_ART } from "../wm-9fo-card-art.js";
import { NFO_UI_ART } from "../wm-9fo-ui-art.js";
import ExpeditionBoard from "./ExpeditionBoard.jsx";
import OrchardV2Route from "./v2/route.jsx";
import OrchardExpedition from "./v2/ui/OrchardExpedition.jsx";
import { generateOrchardBlueprint } from "./v2/generation/index.js";
import { registerOrchardPuzzleHooks } from "./v2/puzzles/index.js";
import { NFO_SCENE_ART } from "./expedition-9fo-scene-art.js";
import { NINEFOLD_ORCHARD_ART } from "./expedition-9fo-art.js";
import { NINEFOLD_EXTRA_CHARACTERS } from "./expedition-9fo-extra-art.js";
import orchardGorge from "../assets/expeditions/production/9fo/runtime/backgrounds/po-orchard-gorge-v1.webp";

const SQUAD_ART = NFO_SCENE_ART.ui.squadSelect;
const PRESSURE_ICONS = NFO_SCENE_ART.ui.pressure;
const PORTRAITS = { ...NINEFOLD_ORCHARD_ART.characters, ...NINEFOLD_EXTRA_CHARACTERS };
const MODULE_TITLES = { primary: "Ninefold Orchard", junior: "Little Reckoning", intermediate: "Gifford" };

// Each lane is answered by one printed card statistic (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §2);
// Threat is answered by the strike, which uses the card's primary-discipline statistic.
const STAT_NAMES = ["Arithmetic", "Geometry", "Logic", "Science", "Speed"];
const DISCIPLINE_STAT = { arithmetic: 0, geometry: 1, logic: 2, science: 3, speed: 4 };
const LANES = [
  { key: "reach", name: "Reach", ask: "cover distance before time runs out", statIndex: () => 4 },
  { key: "shape", name: "Shape", ask: "read lines, turns and shapes", statIndex: () => 1 },
  { key: "truth", name: "Truth", ask: "work out which rule is true", statIndex: () => 2 },
  { key: "change", name: "Change", ask: "hold things steady as they change", statIndex: () => 3 },
  { key: "number", name: "Number", ask: "make exact totals", statIndex: () => 0 },
  { key: "threat", name: "Threat", ask: "beat the enemies in the way", statIndex: (p) => DISCIPLINE_STAT[p.discipline] ?? 0 },
];
const LANE_BY_KEY = Object.fromEntries(LANES.map((lane) => [lane.key, lane]));
const laneStatName = (lane) => lane.key === "threat" ? "best skill" : STAT_NAMES[lane.statIndex()];
const laneValue = (lane, profile) => profile.stats[lane.statIndex(profile)];
const ROLE_SHORT = {
  tank: "Guards a friend or object",
  healer: "Mends a heart or a broken object",
  wizard: "Turns or changes a puzzle tile",
  melee: "Pushes a target one hex",
  ranged: "Marks a target for the team",
};
const RARITY_STYLE = {
  common: { label: "Common", bg: "#e7dcc0", fg: "#5d5236" },
  uncommon: { label: "Uncommon", bg: "#cfe5b9", fg: "#2f5a22" },
  rare: { label: "Rare", bg: "#bfd6f2", fg: "#1f4c80" },
  epic: { label: "Epic", bg: "#dccbf0", fg: "#58308a" },
  legendary: { label: "Legendary", bg: "#f6d887", fg: "#7a4c06" },
};

function mapArt(scenarioId) {
  return NFO_SCENE_ART.backgrounds[scenarioId] || orchardGorge;
}

function strengthWord(value) {
  return value >= 7 ? "strong" : value >= 4 ? "steady" : "weak";
}

function teamCoverage(lanes, squad) {
  return lanes.map((lane) => {
    const best = squad.map((profile) => ({ profile, value: laneValue(lane, profile) })).sort((a, b) => b.value - a.value)[0];
    return { lane, best, word: best ? strengthWord(best.value) : "weak" };
  });
}

function LaneIcon({ lane, size = 18 }) {
  return <img className="xp-lane-icon" src={PRESSURE_ICONS[lane.key]} alt="" style={{ width: size, height: size }} />;
}

function CheckBadge({ className = "" }) {
  return <span className={`xp-check ${className}`} aria-hidden="true" style={{ backgroundImage: `url('${SQUAD_ART.cardSelectionCorners}')` }} />;
}

function HeroCard({ profile, art, selected, loaned, lanes, onClick }) {
  const rarity = RARITY_STYLE[profile.rarity] || RARITY_STYLE.common;
  const laneSummary = lanes.map((lane) => `${lane.name} ${laneValue(lane, profile)}`).join(", ");
  return <button type="button" onClick={onClick} aria-pressed={selected} aria-label={`${profile.name}, ${profile.roleName}, ${rarity.label}. On this map: ${laneSummary}. ${profile.hearts} Hearts, Move ${profile.move}.`} className={selected ? "xp-card xp-card-on" : "xp-card"}>
    <span className="xp-face">
      <img src={art} alt="" />
      {selected && <CheckBadge />}
      {loaned && <span className="xp-loan">Training card</span>}
    </span>
    <span className="xp-card-head">
      <span className="xp-role">{profile.roleName}</span>
      <span className="xp-rarity" style={{ background: rarity.bg, color: rarity.fg }}>{rarity.label}</span>
    </span>
    <span className="xp-role-rule">{ROLE_SHORT[profile.role]}</span>
    <span className="xp-card-stats">
      {lanes.map((lane) => {
        const value = laneValue(lane, profile);
        return <span key={lane.key} className={`xp-chip xp-chip-${strengthWord(value)}`} title={`${lane.name}: ${laneStatName(lane)} ${value}`}><LaneIcon lane={lane} size={17} />{value}</span>;
      })}
    </span>
    <span className="xp-survival-line"><b>♥ {profile.hearts}</b> Hearts · <b>{profile.move}</b> Move</span>
  </button>;
}

function BriefingPanel({ scenario, catalogue, lanes, squadSize, cleared }) {
  const rounds = catalogue?.config?.turnLimit || scenario.turns;
  return <article className="xp-brief" aria-label="Expedition briefing">
    <img className="xp-brief-map" src={mapArt(scenario.id)} alt="" />
    <img className="xp-brief-frame" src={SQUAD_ART.briefingPanel} alt="" />
    <div className="xp-brief-plaque">Map {scenario.level} · {rounds} rounds</div>
    <div className="xp-brief-body">
      <h2>{scenario.title}</h2>
      <p>{catalogue?.config?.flags?.briefing || scenario.rule}</p>
      <h3>What this expedition asks</h3>
      <ul>{lanes.map((lane) => <li key={lane.key}><LaneIcon lane={lane} size={22} /><span><b>{lane.name}:</b> {lane.ask} <i>({laneStatName(lane)})</i></span></li>)}</ul>
      <footer>{cleared ? "Cleared · replay for a small reward" : "First clear earns a small reward"}</footer>
    </div>
  </article>;
}

function PartyTray({ squad, squadSize, cardArt, portraitFor, readiness }) {
  const hearts = squad.reduce((sum, profile) => sum + profile.hearts, 0);
  const wells = Array.from({ length: Math.min(3, squadSize) }, (_, index) => squad[index] || null);
  return <section className="xp-tray" aria-label="Your expedition">
    <img className="xp-tray-frame" src={SQUAD_ART.partyTray} alt="" />
    <div className="xp-tray-title">Your expedition</div>
    {wells.map((profile, index) => <div key={profile?.id || `empty-${index}`} className="xp-well" style={{ left: `${[7.8, 27.8, 48][index]}%` }}>
      {profile ? <>
        <img src={portraitFor(profile) || cardArt(profile)} alt="" className={portraitFor(profile) ? "" : "xp-well-card"} />
        <CheckBadge className="xp-well-check" />
        <span className="xp-well-name">{profile.name}</span>
      </> : <span className="xp-well-empty">Choose</span>}
    </div>)}
    <div className="xp-tray-notes">
      <b>{squad.length} of {squadSize} chosen</b>
      {squad.length > 0 && <span>{hearts} Hearts between them</span>}
      {readiness && <span className={readiness.meetsRecommendation ? "xp-ready-ok" : "xp-ready-warn"}>{readiness.meetsRecommendation ? "Strong enough for this map." : readiness.shortfalls[0]?.message}</span>}
      {squadSize > 3 && squad.length > 3 && <span>+{squad.length - 3} more in the party</span>}
    </div>
  </section>;
}

function CoveragePlaque({ coverage, available }) {
  const rows = coverage.slice(0, 3);
  const extra = coverage.slice(3);
  const gap = coverage.filter((row) => row.best).sort((a, b) => a.best.value - b.best.value)[0];
  const helper = gap && gap.word !== "strong" ? available.map((profile) => ({ profile, value: laneValue(gap.lane, profile) })).sort((a, b) => b.value - a.value)[0] : null;
  return <section className="xp-coverage" aria-label="How this team covers the map">
    <img className="xp-coverage-frame" src={SQUAD_ART.coveragePlaque} alt="" />
    <div className="xp-coverage-title">Team coverage</div>
    {rows.map((row, index) => <div key={row.lane.key} className="xp-coverage-row" style={{ top: `${[32.1, 51.9, 71.8][index]}%` }}>
      <span className="xp-coverage-ring"><LaneIcon lane={row.lane} size={26} /></span>
      <span className="xp-coverage-text">
        <CoverageLine row={row} />
        {index === 2 && extra.map((more) => <span key={more.lane.key}>; <CoverageLine row={more} /></span>)}
      </span>
    </div>)}
    {rows.length < 3 && <div className="xp-coverage-row" style={{ top: `${[32.1, 51.9, 71.8][rows.length]}%` }}>
      <span className="xp-coverage-text">{helper && helper.value > gap.best.value
        ? <><b>Tip:</b> {helper.profile.name} has {laneStatName(gap.lane)} {helper.value} for {gap.lane.name}</>
        : <><b>Every lane</b> is as well covered as your cards allow</>}</span>
    </div>}
  </section>;
}

function CoverageLine({ row }) {
  if (!row.best) return <><b>{row.lane.name}:</b> no hero chosen yet</>;
  return <><b>{row.lane.name}</b> <span className={`xp-word xp-word-${row.word}`}>{row.word}</span> {row.best.profile.name}'s {laneStatName(row.lane)} {row.best.value}</>;
}

function MapStrip({ scenarios, selectedId, records, playableIds, onSelect }) {
  return <nav className="xp-maps" aria-label="Choose an expedition map">
    {scenarios.map((scenario, index) => {
      const playable = playableIds.includes(scenario.id);
      const complete = records[scenario.id]?.completed;
      const current = scenario.id === selectedId;
      return <button type="button" key={scenario.id} disabled={!playable} onClick={() => onSelect(scenario.id)} aria-current={current ? "true" : undefined} title={`${index + 1}. ${scenario.title}${complete ? " (cleared)" : playable ? "" : " (coming later)"}`} aria-label={`Map ${index + 1}, ${scenario.title}${complete ? ", cleared" : playable ? "" : ", coming later"}`} className={`xp-map${current ? " xp-map-on" : ""}${complete ? " xp-map-done" : ""}`}>
        {index + 1}
      </button>;
    })}
  </nav>;
}

function ExpeditionBriefing({ activeModule, cards, progress, avatarForCard, onExit, onBegin }) {
  const scenarios = EXPEDITION_SCENARIOS[activeModule] || [];
  const playableIds = playableScenarioIdsForModule(activeModule);
  const [selectedId, setSelectedId] = useState(playableIds[0] || null);
  const [selected, setSelected] = useState([]);
  const roster = useMemo(() => expeditionRoster(activeModule), [activeModule]);
  const cardMap = useMemo(() => Object.fromEntries(cards.map((card) => [card.id, card])), [cards]);
  const scenario = scenarios.find((item) => item.id === selectedId);
  const catalogue = selectedId ? catalogueEntry(selectedId) : null;
  const squadSize = catalogue?.squadSize || 3;
  const available = useMemo(() => roster.filter((profile) => cardMap[profile.id]), [roster, cardMap]);
  const initialSelection = useMemo(() => {
    const loanSquad = catalogue?.loanSquad || [];
    return [...loanSquad, ...available.map((profile) => profile.id)].filter((id, index, list) => list.indexOf(id) === index && available.some((profile) => profile.id === id)).slice(0, squadSize);
  }, [available, catalogue, squadSize]);
  useEffect(() => { setSelectedId(playableScenarioIdsForModule(activeModule)[0] || null); }, [activeModule]);
  useEffect(() => { setSelected(initialSelection); }, [initialSelection]);
  const selectedProfiles = selected.map((id) => roster.find((profile) => profile.id === id)).filter(Boolean);
  const records = migrateExpeditionProgress(progress.expeditions).scenarios;
  const completed = Object.values(records).filter((record) => record.completed).length;
  const isNinefold = activeModule === "primary";
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < squadSize ? [...current, id] : [...current.slice(1), id]);
  const begin = () => onBegin(selectedProfiles, selectedId);
  const ready = selected.length === squadSize;
  const lanes = (catalogue?.config?.flags?.pressureLanes || []).map((key) => LANE_BY_KEY[key]).filter(Boolean);
  const coverage = teamCoverage(lanes, selectedProfiles);
  const readiness = scenario?.readiness && selectedProfiles.length ? assessSquadReadiness(scenario, selectedProfiles.map((profile) => cardMap[profile.id]).filter(Boolean)) : null;
  const cardArt = (profile) => isNinefold ? NFO_CARD_ART[profile.id] : avatarForCard(activeModule, cardMap[profile.id]);
  const portraitFor = (profile) => isNinefold ? PORTRAITS[profile.id]?.idleFront : null;
  const moduleTitle = MODULE_TITLES[activeModule] || MODULE_TITLES.primary;

  return <main className="expedition-screen" style={isNinefold ? { backgroundImage: `linear-gradient(rgba(20,30,20,.10),rgba(20,30,20,.34)), url('${SQUAD_ART.backdrop}')` } : undefined}>
    <style>{`
      .expedition-screen{--dh:clamp(112px,19vh,168px);display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:8px;height:100dvh;padding:8px 16px 10px;overflow:hidden;color:#fff8dc;text-shadow:0 2px 3px rgba(19,30,18,.45);background:#2f3a2a center/cover no-repeat}
      .expedition-screen *{box-sizing:border-box}.expedition-screen button{font:inherit}
      .xp-top{display:grid;grid-template-columns:auto auto 1fr auto;align-items:center;gap:14px;min-height:48px}
      .xp-back{width:84px;height:38px;padding:0;border:0;background:transparent center/100% 100% no-repeat;color:#fff7dd;font-weight:900;cursor:pointer;text-shadow:0 2px 2px #3a2410}
      .xp-top h1{margin:0;white-space:nowrap;font:900 clamp(22px,2.4vw,36px) Georgia,serif;line-height:1;color:#ffe9a8;text-shadow:0 3px 0 #4a2e12,0 5px 12px rgba(0,0,0,.45)}.xp-top h1 em{font-weight:700;color:#fff6da}
      .xp-maps{display:flex;justify-content:flex-end;gap:5px;min-width:0;overflow-x:auto;scrollbar-width:none;padding:3px}
      .xp-map{flex:none;position:relative;width:32px;height:32px;border-radius:50%;border:2px solid #c69a4c;background:#fbf1d4;color:#3d2c14;font-weight:900;font-size:13px;cursor:pointer;text-shadow:none;box-shadow:0 2px 4px rgba(0,0,0,.35)}
      .xp-map:hover:not(:disabled){background:#fff}.xp-map:disabled{background:rgba(40,32,20,.55);border-color:rgba(198,154,76,.45);color:rgba(255,240,200,.55);cursor:default;box-shadow:none}
      .xp-map-on{background:#2f5a2b;border-color:#f1cf6e;color:#fff5d4;box-shadow:0 0 0 3px rgba(241,207,110,.45),0 2px 4px rgba(0,0,0,.35)}.xp-map-on:hover:not(:disabled){background:#2f5a2b}
      .xp-map-done:after{content:"✓";position:absolute;right:-5px;top:-5px;width:15px;height:15px;border-radius:50%;background:#2f7a2b;color:#fff;font-size:10px;line-height:15px}
      .xp-cleared{padding:5px 11px;border-radius:999px;background:rgba(44,30,14,.62);font-size:12px;font-weight:900;white-space:nowrap}
      .xp-layout{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;min-height:0}
      .xp-brief{position:relative;height:100%;aspect-ratio:1140/1380;container-type:size;color:#2d3b26;text-shadow:none;filter:drop-shadow(0 10px 16px rgba(20,16,8,.45))}
      .xp-brief-map{position:absolute;left:22%;top:12.4%;width:56.5%;height:18.6%;object-fit:cover}
      .xp-brief-frame{position:absolute;inset:0;width:100%;height:100%}
      .xp-brief-plaque{position:absolute;left:32%;right:32%;top:3.3%;height:5%;display:grid;place-items:center;white-space:nowrap;color:#fff1c8;font-size:2.4cqh;font-weight:900;text-shadow:0 1px 2px #2b170a}
      .xp-brief-body{position:absolute;left:19.5%;right:19.5%;top:34.6%;bottom:12.5%;display:flex;flex-direction:column;overflow:hidden}
      .xp-brief-body h2{margin:0 0 1.2cqh;font:900 4.6cqh Georgia,serif;line-height:1.02;color:#233a24}
      .xp-brief-body p{margin:0 0 1.4cqh;font-size:2.55cqh;line-height:1.3;font-weight:700;color:#3b3a2a}
      .xp-brief-body h3{margin:0 0 .8cqh;padding-top:1.1cqh;border-top:1px solid rgba(90,70,40,.28);font-size:2.5cqh;font-weight:900;color:#2a3322}
      .xp-brief-body ul{list-style:none;margin:0;padding:0;display:grid;gap:.8cqh}.xp-brief-body li{display:flex;align-items:center;gap:.9cqh;font-size:2.3cqh;line-height:1.2;font-weight:700;color:#3b3a2a}.xp-brief-body li b{color:#233a24}.xp-brief-body li i{color:#7a6a45}
      .xp-brief-body li .xp-lane-icon{width:4.4cqh!important;height:4.4cqh!important}
      .xp-brief-body footer{margin-top:auto;font:italic 700 2.2cqh Georgia,serif;color:#7a5a2a}
      .xp-lane-icon{flex:none;object-fit:contain;filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))}
      .xp-team{display:flex;flex-direction:column;min-height:0;padding:12px 14px 10px;border-radius:18px;background:linear-gradient(rgba(252,244,219,.95),rgba(241,227,190,.95));border:4px solid #6e4a26;box-shadow:inset 0 0 0 2px #c69a4c,0 12px 22px rgba(20,14,6,.45);color:#2d3b26;text-shadow:none}
      .xp-team-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 2px 8px}.xp-team-head h2{margin:0;font:900 clamp(18px,1.8vw,26px) Georgia,serif;color:#2f3a22}.xp-team-head p{margin:2px 0 0;font-size:12px;font-weight:700;color:#5b5238}.xp-count{flex:none;padding:5px 12px;border-radius:999px;background:#2f5a2b;color:#fff5d4;font-size:14px;font-weight:900}
      .xp-grid{flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:12px;padding:6px 6px 10px;align-content:start;scrollbar-width:thin}
      .xp-card{position:relative;display:flex;flex-direction:column;gap:4px;padding:6px 6px 7px;border:0;border-radius:14px;background:#fbf3dc;box-shadow:0 0 0 1px rgba(110,80,40,.25),0 5px 10px rgba(40,28,12,.25);color:#2d3b26;cursor:pointer;text-align:left;transition:transform .15s ease,box-shadow .15s ease}
      .xp-card:hover{transform:translateY(-3px);box-shadow:0 0 0 2px #9bc07a,0 10px 18px rgba(40,28,12,.35)}
      .xp-card:focus-visible{outline:3px solid #2f7ad0;outline-offset:2px}
      .xp-card-on{background:#fff6d4;box-shadow:0 0 0 3px #e9bf4a,0 0 16px 4px rgba(155,200,90,.75),0 10px 18px rgba(40,28,12,.35);transform:translateY(-3px)}
      .xp-face{position:relative;display:block}.xp-face>img{display:block;width:100%;aspect-ratio:240/336;object-fit:contain;border-radius:8px}
      .xp-check{position:absolute;left:-8px;top:-8px;width:36px;height:36px;background-size:398% 398%;background-position:49% 50.3%;background-repeat:no-repeat;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))}
      .xp-loan{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);padding:1px 7px;border-radius:6px;background:rgba(47,90,43,.9);color:#fff5d4;font-size:9.5px;font-weight:900;white-space:nowrap}
      .xp-card-head{display:flex;align-items:center;justify-content:space-between;gap:4px;padding:0 2px}.xp-role{font-size:13px;font-weight:900;color:#2f3a22}.xp-rarity{padding:1px 7px;border-radius:999px;font-size:10px;font-weight:900;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
      .xp-role-rule{padding:0 2px;font-size:11px;font-weight:700;line-height:1.2;color:#5b5238}
      .xp-card-stats{display:flex;flex-wrap:wrap;gap:3px;padding:3px 0 0;border-top:1px solid rgba(110,80,40,.18)}
      .xp-chip{display:inline-flex;align-items:center;gap:2px;padding:1px 6px 1px 2px;border-radius:999px;font-size:12px;font-weight:1000;line-height:18px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
      .xp-chip-strong{background:#cfe5b2;color:#1f4a17}.xp-chip-steady{background:#f0e3bf;color:#4b3d1c}.xp-chip-weak{background:#f1d6c8;color:#7a3212}.xp-survival-line{padding:0 2px;font-size:11.5px;font-weight:700;color:#5b5238}.xp-survival-line b{color:#a13f32;font-weight:1000}.xp-survival-line b+b,.xp-survival-line b:last-child{color:#2f3a22}
      .xp-dock{display:flex;align-items:center;justify-content:center;gap:12px;height:var(--dh)}
      .xp-tray,.xp-coverage{position:relative;flex:none;container-type:size;color:#2d3b26;text-shadow:none}
      .xp-tray{height:calc(var(--dh) / .66);aspect-ratio:1979/795;margin:calc(var(--dh) / .66 * -.145) 0 calc(var(--dh) / .66 * -.195)}
      .xp-coverage{height:var(--dh);aspect-ratio:2/1}
      .xp-tray-frame,.xp-coverage-frame{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
      .xp-tray-title{position:absolute;left:40%;width:20%;top:15.8%;height:6.8%;display:grid;place-items:center;white-space:nowrap;font:900 4.6cqh Georgia,serif;color:#4a3216}
      .xp-well{position:absolute;top:30.6%;width:14.2%;aspect-ratio:1;border-radius:50%}
      .xp-well>img{position:absolute;inset:0;width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 12%;background:radial-gradient(circle at 50% 40%,#f7e7b6,#b9cf86 70%,#6f934c);box-shadow:inset 0 0 0 2px rgba(0,0,0,.2)}
      .xp-well>img.xp-well-card{object-position:50% 20%}
      .xp-well-check{left:auto;right:-2px;top:-2px;width:30%;height:30%}
      .xp-well-name{position:absolute;left:50%;bottom:-9%;transform:translateX(-50%);padding:0 8px;border-radius:8px;background:rgba(255,246,216,.96);box-shadow:0 1px 3px rgba(0,0,0,.35);white-space:nowrap;font-size:5.2cqh;font-weight:900;line-height:1.45;color:#2d3b26}
      .xp-well-empty{position:absolute;inset:8%;display:grid;place-items:center;border-radius:50%;border:2px dashed rgba(255,236,180,.7);color:#ffeebb;font-size:5cqh;font-weight:900;text-shadow:0 1px 2px #000}
      .xp-tray-notes{position:absolute;left:66%;width:27.4%;top:28.5%;height:40%;display:flex;flex-direction:column;justify-content:center;gap:1cqh;font-size:4.4cqh;font-weight:800;line-height:1.2;color:#4b4128}.xp-tray-notes b{font:900 5.6cqh Georgia,serif;color:#2d3b26}.xp-ready-ok{color:#2f6a2a}.xp-ready-warn{color:#8a4a12}
      .xp-coverage-title{position:absolute;left:29%;width:42%;top:7%;height:13.5%;display:grid;place-items:center;white-space:nowrap;font:900 6.2cqh Georgia,serif;color:#2f3a22}
      .xp-coverage-row{position:absolute;left:0;right:7.5%;height:17%;transform:translateY(-50%);display:flex;align-items:center}
      .xp-coverage-ring{position:absolute;left:11.6%;width:6.5%;aspect-ratio:1;display:grid;place-items:center}.xp-coverage-ring img{width:92%!important;height:92%!important}
      .xp-coverage-text{margin-left:21%;font-size:6.2cqh;font-weight:800;line-height:1.15;color:#3b3a2a}.xp-coverage-text b{color:#233a24}
      .xp-word{padding:0 5px;border-radius:6px;font-weight:1000;text-transform:uppercase;font-size:.8em;letter-spacing:.03em}.xp-word-strong{background:#cfe5b2;color:#1f4a17}.xp-word-steady{background:#f0e3bf;color:#4b3d1c}.xp-word-weak{background:#f1d6c8;color:#7a3212}
      .xp-embark{flex:none;height:calc(var(--dh) * .64);aspect-ratio:1983/793;margin:calc(var(--dh) * -.08) 0;padding:0 12% 0 8%;border:0;background:transparent center/100% 100% no-repeat;color:#fff8de;font:900 clamp(14px,1.15vw,19px) Georgia,serif;line-height:1.1;cursor:pointer;text-shadow:0 2px 2px #1d3a14;filter:drop-shadow(0 6px 8px rgba(0,0,0,.4));transition:transform .12s ease,filter .12s ease}
      .expedition-screen .xp-embark{font:900 clamp(14px,1.15vw,19px) Georgia,serif}
      .xp-embark:hover:not(:disabled){transform:translateY(-2px);filter:drop-shadow(0 9px 12px rgba(0,0,0,.45)) brightness(1.06)}.xp-embark:active:not(:disabled){transform:translateY(1px)}
      .xp-embark:focus-visible{outline:3px solid #ffe28a;outline-offset:2px;border-radius:30px}
      .xp-embark:disabled{cursor:not-allowed;filter:grayscale(.75) brightness(.85)}.xp-embark small{display:block;font:800 .65em system-ui,sans-serif}
      @media(max-width:1180px){.expedition-screen{--dh:clamp(100px,16vh,140px)}.xp-top{grid-template-columns:auto 1fr auto}.xp-top h1{grid-column:2}.xp-maps{grid-column:1/-1;grid-row:2;justify-content:center}.xp-cleared{grid-column:3;grid-row:1}}
      @media(max-width:900px),(max-height:580px){.expedition-screen{display:block;height:auto;min-height:100dvh;overflow:visible;padding:8px 10px 18px}.xp-top{margin-bottom:8px}.xp-maps{justify-content:flex-start}.xp-layout{grid-template-columns:1fr;gap:10px}.xp-brief{height:auto;width:min(100%,430px);justify-self:center}.xp-grid{max-height:min(62vh,700px);overscroll-behavior:contain}.xp-dock{flex-direction:column;height:auto;margin-top:10px;--dh:clamp(130px,34vw,200px)}.xp-tray{height:auto;width:min(100%,560px);margin:-6% 0 -8%}.xp-coverage{height:auto;width:min(100%,420px)}.xp-embark{height:auto;width:min(80%,320px);margin:0}}
      @media(max-width:560px){.xp-top h1{font-size:21px}.xp-cleared{display:none}.xp-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:4px 0}.xp-team{padding:10px 8px}.xp-team-head p{display:none}}
    `}</style>
    <header className="xp-top">
      <button type="button" className="xp-back" onClick={onExit} style={{ backgroundImage: `url('${NFO_UI_ART.backBtn}')` }}>Back</button>
      <h1>{moduleTitle} · <em>Expeditions</em></h1>
      <MapStrip scenarios={scenarios} selectedId={selectedId} records={records} playableIds={playableIds} onSelect={setSelectedId} />
      <div className="xp-cleared">{completed}/{scenarios.length} cleared</div>
    </header>
    {scenario && <>
      <div className="xp-layout">
        <BriefingPanel scenario={scenario} catalogue={catalogue} lanes={lanes} squadSize={squadSize} cleared={records[scenario.id]?.completed} />
        <section className="xp-team" aria-label="Choose your expedition team">
          <div className="xp-team-head">
            <div><h2>Choose your expedition team</h2><p>Tap a card to add it. The coloured numbers are each hero's skill for this map: green is strong, red is weak.</p></div>
            <div className="xp-count" aria-live="polite">{selected.length} of {squadSize} ready</div>
          </div>
          <div className="xp-grid">{available.map((profile) => <HeroCard key={profile.id} profile={profile} art={cardArt(profile)} selected={selected.includes(profile.id)} loaned={!(progress.cards?.[profile.id] || 0)} lanes={lanes} onClick={() => toggle(profile.id)} />)}</div>
        </section>
      </div>
      <div className="xp-dock">
        <PartyTray squad={selectedProfiles} squadSize={squadSize} cardArt={cardArt} portraitFor={portraitFor} readiness={readiness} />
        <CoveragePlaque coverage={coverage} available={available} />
        <button type="button" className="xp-embark" disabled={!ready} onClick={begin} style={{ backgroundImage: `url('${SQUAD_ART.embarkButton}')` }}>
          {ready ? "Begin the expedition" : <>Begin the expedition<small>Choose {squadSize - selected.length} more</small></>}
        </button>
      </div>
    </>}
  </main>;
}

const leaveToHome = (setScreen) => () => setScreen("home");

export default function ExpeditionScreen({ activeModule, progress, setProgress, setScreen, beep, fireConfetti, cards, avatarForCard, currentProfile }) {
  const [session, setSession] = useState(null);
  const exitHome = useMemo(() => leaveToHome(setScreen), [setScreen]);
  // Ninefold Orchard routes to the private Orchard v2 engine (engineVersion 2); the other modules keep the legacy screen.
  if (activeModule === "primary") return <OrchardV2Route Ui={OrchardExpedition} generateBlueprint={generateOrchardBlueprint} ensureHooks={registerOrchardPuzzleHooks} activeModule={activeModule} currentProfile={currentProfile} progress={progress} setProgress={setProgress} cards={cards} avatarForCard={avatarForCard} beep={beep} fireConfetti={fireConfetti} onExit={exitHome} />;
  if (!session) return <ExpeditionBriefing activeModule={activeModule} cards={cards} progress={progress} avatarForCard={avatarForCard} onExit={() => setScreen("home")} onBegin={(squad, scenarioId) => setSession({ squad, scenarioId })} />;
  return <ExpeditionBoard scenarioId={session.scenarioId} squad={session.squad} cards={cards} avatarForCard={avatarForCard} progress={progress} setProgress={setProgress} beep={beep} fireConfetti={fireConfetti} onExit={() => setSession(null)} onRestart={() => setSession(null)} />;
}
