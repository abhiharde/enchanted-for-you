const http = require("http");
const fs = require("fs");
const path = require("path");

const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml" };
http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const requested = pathname === "/" ? "index.html" : decodeURIComponent(pathname);
  const file = path.join(process.cwd(), requested);
  fs.readFile(file, (error, content) => {
    if (error) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    response.end(content);
  });
}).listen(8000);
