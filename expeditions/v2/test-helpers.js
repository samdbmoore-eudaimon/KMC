// Test and tooling helper: a thin driver over the real reducer. Not used at runtime by the app.
import { reduceCommand, previewCommand } from "./actions.js";
import { hexDistance } from "./hex.js";
import { getHero, reachableHexes, profileOf } from "./rules.js";

export class Driver {
  constructor(state) {
    this.state = state;
    this.history = [];
  }
  cmd(type, heroId, payload = {}, { expectLegal = true } = {}) {
    const command = { type, heroId, expectedRevision: this.state.revision, payload };
    const { state, result } = reduceCommand(this.state, command);
    if (expectLegal && !result.legal) throw new Error(`Illegal ${type} by ${heroId}: ${result.reasonCode} ${JSON.stringify(result.reasonParams)}`);
    if (!expectLegal && result.legal) throw new Error(`Expected ${type} to be illegal`);
    this.state = state;
    if (result.legal) this.history.push(command);
    return result;
  }
  preview(type, heroId, payload = {}) {
    return previewCommand(this.state, { type, heroId, expectedRevision: this.state.revision, payload });
  }
  hero(id) {
    return getHero(this.state, id);
  }
  // Moves along the cheapest legal route toward `target` until within `within`; one command per hop.
  approach(heroId, target, within = 1, type = "move") {
    for (let guard = 0; guard < 6; guard += 1) {
      const hero = this.hero(heroId);
      if (hexDistance(hero.position, target) <= within || hero.ap < 1) return hexDistance(hero.position, target) <= within;
      const budget = type === "dash" ? profileOf(this.state, hero).dashBudget : profileOf(this.state, hero).moveBudget;
      const reach = reachableHexes(this.state, heroId, budget);
      const best = reach.map((r) => ({ ...r, d: hexDistance(r.key, target) })).sort((a, b) => a.d - b.d || a.cost - b.cost)[0];
      if (!best || best.d >= hexDistance(hero.position, target)) return false;
      this.cmd(type, heroId, { destination: best.key, path: null });
    }
    return false;
  }
  endRound() {
    return this.cmd("end-round", null, { forecastRevision: this.state.revision });
  }
}

// Plays the fixture map to a snapshot win using only legal commands (fixture squad bushel/furrow/pip).
export function playFixtureToWin(d) {
  const stationOf = { bushel: "number", furrow: "shape", pip: "sustain" };
  const control = d.state.blueprint.puzzle.controlHex;
  d.approach("bushel", control, 1);
  for (const col of [0, 2, 3]) d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col, value: 1 } });
  d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "select-outputs", outputIds: ["bridge", "shelter"] } });
  d.cmd("operate", "bushel", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
  for (let round = 1; round <= 5 && d.state.status === "playing"; round += 1) {
    for (const id of ["bushel", "furrow", "pip"]) {
      const st = d.state.blueprint.stations.find((s) => s.id === stationOf[id]);
      if (hexDistance(d.hero(id).position, st.hex) > 1) d.approach(id, st.hex, 1);
      while (d.hero(id).ap > 0 && hexDistance(d.hero(id).position, st.hex) <= 1 && d.state.stationStates[stationOf[id]].charge < st.capacity) d.cmd("calibrate", id, { targetId: stationOf[id] });
    }
    if (["number", "shape", "sustain"].every((n) => d.state.stationStates[n].charge >= d.state.blueprint.stations.find((s) => s.id === n).capacity)) for (const id of ["bushel", "furrow", "pip"]) if (d.hero(id).ap > 0) d.cmd("hold", id, { targetId: stationOf[id] });
    d.endRound();
  }
  return d;
}
