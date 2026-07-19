const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 8734;
const ROOT = __dirname;
http.createServer((req, res) => {
  let file = req.url === "/" ? "/KangarooMathsQuest.html" : req.url;
  const filePath = path.join(ROOT, decodeURIComponent(file.split("?")[0]));
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    const ext = path.extname(filePath);
    const type = ext === ".html" ? "text/html" : ext === ".js" ? "application/javascript" : "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
}).listen(PORT, () => console.log("serving on " + PORT));
