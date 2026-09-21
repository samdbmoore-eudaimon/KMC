import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createSealedArchive, SEALED_ARCHIVE_CONFIG } from "./sealed-archive.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  interactObject,
  moveUnit,
  resolveEnemyPhase,
  useDisciplineAction,
} from "./expedition-engine.js";
import { EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function loanSquad() {
  const roster = expeditionRoster("intermediate");
  return ["gf_adavoss", "gf_higgins", "gf_marta", "gf_tambrindle"].map((id) => roster.find((profile) => profile.id === id));
}

test("The Sealed Archive creates a playable state from four Gifford commons", () => {
  const state = createSealedArchive(loanSquad());
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 4);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 2);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.intermediate.hardLimitMinutes);
});

// REF-08 (redesigned 2026-09-16 for §9, see the file-header comment in sealed-archive.js):
// Tam Brindle starts standing right on feeder_a, so she needs no travel at all to collect
// it; Higgins and Marta each fetch a feeder from the opposite side of the board; Adavoss
// never fetches anything; she only travels between vaults and combines whatever has
// arrived. Verified by direct simulation before being locked in here.
test("REF-08: three heroes ferry the feeder stones home while Adavoss combines, all within the round budget", () => {
  const squad = loanSquad();
  let state = createSealedArchive(squad);
  state = interactObject(state, "gf_tambrindle", "feeder_a");
  state = moveUnit(state, "gf_tambrindle", "-1,1");
  state = moveUnit(state, "gf_higgins", "-1,0");
  state = moveUnit(state, "gf_higgins", "0,-2");
  state = moveUnit(state, "gf_marta", "-1,2");
  state = moveUnit(state, "gf_marta", "-1,3");
  state = moveUnit(state, "gf_adavoss", "-1,-1");
  state = moveUnit(state, "gf_adavoss", "0,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = interactObject(state, "gf_tambrindle", "feeder_a");
  state = interactObject(state, "gf_higgins", "feeder_b");
  state = moveUnit(state, "gf_higgins", "1,-1");
  state = interactObject(state, "gf_marta", "feeder_c");
  state = moveUnit(state, "gf_marta", "-2,2");
  state = useDisciplineAction(state, "gf_adavoss", "combine", { firstId: "vault_a", secondId: "feeder_a" });
  state = moveUnit(state, "gf_adavoss", "2,-2");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = moveUnit(state, "gf_higgins", "0,1");
  state = interactObject(state, "gf_higgins", "feeder_b");
  state = moveUnit(state, "gf_marta", "-2,1");
  state = interactObject(state, "gf_marta", "feeder_c");
  state = moveUnit(state, "gf_adavoss", "1,0");
  state = moveUnit(state, "gf_adavoss", "1,1");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = useDisciplineAction(state, "gf_adavoss", "combine", { firstId: "vault_b", secondId: "feeder_b" });
  state = moveUnit(state, "gf_adavoss", "1,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = moveUnit(state, "gf_adavoss", "-1,-1");
  state = useDisciplineAction(state, "gf_adavoss", "combine", { firstId: "vault_c", secondId: "feeder_c" });

  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "3/3 constraints");
  assert.ok(state.turn <= SEALED_ARCHIVE_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 25);
});

test("raising only two of the three vault stones leaves the archive sealed", () => {
  // A pure objective-logic check rather than a full trace replay: the puzzle's constraint
  // values only all hold once every vault is raised (see sealed-archive.js's REF-08 comment
  // history), so this asserts directly against evaluateObjective with vault_a and vault_c
  // raised but vault_b still at its seed value.
  const state = createSealedArchive(loanSquad());
  const twoRaised = { ...state, objects: { ...state.objects, vault_a: { ...state.objects.vault_a, value: 8 }, vault_c: { ...state.objects.vault_c, value: 14 } } };
  const objective = evaluateObjective(twoRaised);
  assert.equal(objective.complete, false);
  assert.equal(objective.progress, "2/3 constraints", "the sum constraint (8 + 4 = 12) is not yet 20, so only parity and the inequality hold");
});

test("the inequality constraint fails once the second vault is no longer lower than the third", () => {
  // vault_b (4) would need to end higher than vault_c to break lessThan; simulate that
  // directly against the objective rather than replaying every action.
  const state = createSealedArchive(loanSquad());
  const brokenOrder = { ...state, objects: { ...state.objects, vault_b: { ...state.objects.vault_b, value: 20 }, vault_c: { ...state.objects.vault_c, value: 14 } } };
  assert.equal(evaluateObjective(brokenOrder).complete, false);
});

test("ENM: the Archive Warden and Cipher Moth do not act during their two-round watch", () => {
  const state = createSealedArchive(loanSquad());
  const afterRoundOne = resolveEnemyPhase(endPlayerPhase(state));
  const afterRoundTwo = resolveEnemyPhase(endPlayerPhase(afterRoundOne));
  assert.equal(afterRoundOne.units.archive_warden.pos, "3,-1");
  assert.equal(afterRoundOne.units.cipher_moth.pos, "3,0");
  assert.equal(afterRoundTwo.units.archive_warden.pos, "3,-1");
  assert.equal(afterRoundTwo.units.cipher_moth.pos, "3,0");
});

test("ENM: a Cipher Moth threatens the squad once its watch delay has expired", () => {
  const board = SEALED_ARCHIVE_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-1" }];
  const enemy = { id: "cipher_moth", name: "Cipher Moth", side: "enemy", hp: 2, defence: 5, move: 2, range: 1, damage: 1, pos: "3,0", delay: 0 };
  const state = createExpeditionState({ id: "cipher-moth-test", moduleKey: "intermediate", title: "Cipher Moth test", turnLimit: 5, board, units, enemies: [enemy], objects: [], objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 2, "an unguarded hero within range takes damage once the Cipher Moth's delay has passed");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this.
test("§9: a below-battle-value, no-Uncommon squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 12, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 12, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 12, s: [1, 1, 1, 1, 1] },
    { id: "d", r: "common", bv: 12, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = EXPEDITION_SCENARIOS.intermediate.find((s) => s.id === "gf_sealed_archive");
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: "why one powerful card cannot satisfy every
// late-map job alone." Redesigned on 2026-09-16 specifically to make this true (see the
// file-header comment in sealed-archive.js): Adavoss is the only hero who can ever Combine,
// so a solo attempt has her fetching, carrying and combining every stone herself, with the
// other two vault stones sitting on the board blocking her most direct routes between
// vaults. Verified by direct simulation: playing her alone, optimally, she has raised only
// one of the three vaults by the end of round 5 (turnLimit) and is still carrying the
// second feeder toward its vault when the round ends.
test("§9: Adavoss cannot raise all three vaults alone — she runs out of rounds with two vaults still unraised", () => {
  let state = createSealedArchive(loanSquad());
  state = moveUnit(state, "gf_adavoss", "-1,-1");
  state = moveUnit(state, "gf_adavoss", "-2,1");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = moveUnit(state, "gf_adavoss", "-2,2");
  state = interactObject(state, "gf_adavoss", "feeder_a");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = moveUnit(state, "gf_adavoss", "-1,1");
  state = interactObject(state, "gf_adavoss", "feeder_a");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = useDisciplineAction(state, "gf_adavoss", "combine", { firstId: "vault_a", secondId: "feeder_a" });
  state = moveUnit(state, "gf_adavoss", "0,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));

  state = moveUnit(state, "gf_adavoss", "0,-2");
  state = interactObject(state, "gf_adavoss", "feeder_b");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, false);
  assert.equal(objective.progress, "1/3 constraints", "only vault_a is raised; vault_b is still being carried and vault_c has not been touched");

  const outOfRounds = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(outOfRounds.status, "lost", "round 5 was her last — vault_b still needs carrying home and vault_c needs a return trip she never gets");
});
