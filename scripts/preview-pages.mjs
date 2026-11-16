#!/usr/bin/env node
/**
 * Kleiner statischer Server für den Export aus ./out – so wie GitHub Pages ihn unter dem Basis-Pfad ausliefert.
 *   npm run build:pages && npm run preview:pages      → http://localhost:4000/glut-und-grat/
 * Umgebungsvariablen: PORT (Standard 4000), PAGES_BASE_PATH (Standard "/glut-und-grat")
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../out");
const basePath = (process.env.PAGES_BASE_PATH ?? "/glut-und-grat").replace(/\/$/, "");
const port = Number(process.env.PORT ?? 4000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function send(res, status, file) {
  const body = readFileSync(file);
  res.writeHead(status, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
  res.end(body);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let pathname = decodeURIComponent(url.pathname);

  if (basePath && !(pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    res.writeHead(302, { location: `${basePath}/` });
    res.end();
    return;
  }
  pathname = pathname.slice(basePath.length) || "/";

  let file = path.join(root, pathname);
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;

  if (existsSync(file) && statSync(file).isFile()) return send(res, 200, file);
  const notFound = path.join(root, "404.html");
  if (existsSync(notFound)) return send(res, 404, notFound);
  res.writeHead(404).end("Nicht gefunden");
}).listen(port, () => {
  console.log(`Vorschau des Exports: http://localhost:${port}${basePath}/`);
});
