// Assembles the 25 rewritten PRIMARY_LESSONS files from the scratchpad into one block
// and replaces the old PRIMARY_LESSONS block in kq-content.js with it.
"use strict";
const fs = require("fs");
const path = require("path");

const SCRATCH = "C:\\Users\\samdb\\AppData\\Local\\Temp\\claude\\C--Users-samdb-UKMT-App\\321c15b9-797f-481d-abbf-aa100225feac\\scratchpad";
const REWRITTEN_DIR = path.join(SCRATCH, "lessons_rewritten");
const CONTENT_JS = path.join(__dirname, "..", "kq-content.js");

const TOPICS = [
  "placeValue", "roundingEstimate", "timesTablesFacts", "divisionRemainders", "sequencePattern",
  "fractionEquivalence", "fractionArithmetic", "fractionOfQuantity", "decimalPlaceValue", "ratioBasics",
  "twoUnknowns", "additiveMultiplicative", "areaPerimeter", "unitConversion", "timeCalendar",
  "compensationMentalMaths", "formalMultiplication", "formalDivision", "logicGrid", "combinatoricsCounting",
  "angleBasics", "shapeProperties", "symmetryReflection", "spatialPuzzles", "factorsMultiplesPrimes",
];

const pieces = TOPICS.map((t) => {
  const file = path.join(REWRITTEN_DIR, `${t}.js`);
  const code = fs.readFileSync(file, "utf8").trim();
  if (!code.startsWith(`PRIMARY_LESSONS.${t} = {`)) throw new Error(`${t}.js does not start with the expected assignment`);
  if (!code.endsWith("};")) throw new Error(`${t}.js does not end with "};"`);
  return code;
});

const newBlock = "PRIMARY_LESSONS = {};\n\n" + pieces.join("\n\n");

let src = fs.readFileSync(CONTENT_JS, "utf8");
const startNeedle = "PRIMARY_LESSONS = {};";
const startIdx = src.indexOf(startNeedle);
if (startIdx === -1) throw new Error("Could not find PRIMARY_LESSONS = {}; in kq-content.js");
const endNeedle = "\nexport const CONTENT_MODULES";
let endIdx = src.indexOf(endNeedle, startIdx);
if (endIdx === -1) throw new Error("Could not find end marker after PRIMARY_LESSONS block");

src = src.slice(0, startIdx) + newBlock + "\n" + src.slice(endIdx + 1);
fs.writeFileSync(CONTENT_JS, src, "utf8");
console.log(`Spliced ${TOPICS.length} rewritten lessons into kq-content.js (${newBlock.length} chars).`);
