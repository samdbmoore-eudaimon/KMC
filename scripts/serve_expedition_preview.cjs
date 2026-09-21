const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const page = path.join(__dirname, "..", "assets", "expeditions", "production", "9fo", "qa", "unequal-crossing-runtime-v1.html");
http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(fs.readFileSync(page));
}).listen(8739, "127.0.0.1");
