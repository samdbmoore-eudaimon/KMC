"use strict";

const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "..", "kq-joey-art.js"), "utf8");
const moduleMatch = source.match(/junior:\s*\{([\s\S]*?)\n\s*\},/);
if (!moduleMatch) throw new Error("Junior Joey art block not found");

const overlayMatch = moduleMatch[1].match(/overlay:\s*"data:image\/webp;base64,([^"]+)"/);
if (!overlayMatch) throw new Error("Junior overlay not found");

const output = path.join(__dirname, "..", "Joey Assets", "LR", "LR Frame 5 Lanes.webp");
fs.writeFileSync(output, Buffer.from(overlayMatch[1], "base64"));
console.log(output);
