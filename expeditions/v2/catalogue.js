// Versioned catalogue of the five Orchard v2 families. Only these are routed to the v2 engine
// (engineVersion 2); legacy Orchard scenarios keep their own catalogue entries and saves untouched.
import { FAMILY_IDS, PUZZLE_KINDS, MODULE_KEY } from "./constants.js";

export const ORCHARD_V2_ENGINE_VERSION = 2;

export const ORCHARD_V2_FAMILIES = [
  { familyId: "four-locks", title: "Four Locks", puzzleKind: PUZZLE_KINDS["four-locks"], jobs: { number: "Ledger bus", shape: "Bridge brace", sustain: "Tree maintenance" } },
  { familyId: "turning-ravine", title: "Turning Ravine", puzzleKind: PUZZLE_KINDS["turning-ravine"], jobs: { number: "Calibration wheel", shape: "Turning joint", sustain: "Wind stabiliser" } },
  { familyId: "unequal-crossing", title: "Unequal Crossing", puzzleKind: PUZZLE_KINDS["unequal-crossing"], jobs: { number: "Scale lock", shape: "Platform brace", sustain: "Scale repair" } },
  { familyId: "maybe-flock", title: "Maybe-Flock Roost", puzzleKind: PUZZLE_KINDS["maybe-flock"], jobs: { number: "Beam calibration", shape: "Tower alignment", sustain: "Whistle maintenance" } },
  { familyId: "hollow-bough", title: "Hollow Bough", puzzleKind: PUZZLE_KINDS["hollow-bough"], jobs: { number: "Shelter capacity", shape: "Shape anchors", sustain: "Root maintenance" } },
].map((entry) => ({ ...entry, moduleKey: MODULE_KEY, engineVersion: ORCHARD_V2_ENGINE_VERSION, tiers: 5 }));

if (ORCHARD_V2_FAMILIES.map((f) => f.familyId).join() !== FAMILY_IDS.join()) throw new Error("Orchard v2 catalogue out of step with FAMILY_IDS");

export const orchardV2Family = (familyId) => ORCHARD_V2_FAMILIES.find((f) => f.familyId === familyId) || null;
export const usesOrchardV2Engine = (moduleKey, familyId) => moduleKey === MODULE_KEY && !!orchardV2Family(familyId);
