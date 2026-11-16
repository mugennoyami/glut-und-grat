#!/usr/bin/env node
/**
 * Baut die Website als statischen Export für GitHub Pages (Ausgabe: ./out).
 *
 * GitHub Pages liefert nur Dateien aus – es gibt keinen Server. Deshalb werden für diesen Build
 *  - die API-Routen (src/app/api) vorübergehend beiseitegelegt und danach zuverlässig zurückgeholt,
 *  - Formulare und Kasse im Browser-Modus betrieben (NEXT_PUBLIC_STATIC_EXPORT=true).
 *
 * Umgebungsvariablen:
 *   PAGES_BASE_PATH  Basis-Pfad der Seite, Standard "/glut-und-grat" (leer bei eigener Domain)
 *   PAGES_SITE_URL   vollständige Adresse der Seite, Standard https://mugennoyami.github.io/glut-und-grat
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const apiDir = path.join(root, "src/app/api");
const parkDir = path.join(root, ".pages-build");
const parkedApi = path.join(parkDir, "api");

const basePath = (process.env.PAGES_BASE_PATH ?? "/glut-und-grat").replace(/\/$/, "");
const siteUrl = (process.env.PAGES_SITE_URL ?? `https://mugennoyami.github.io${basePath}`).replace(/\/$/, "");

function restoreApi() {
  if (existsSync(parkedApi) && !existsSync(apiDir)) {
    renameSync(parkedApi, apiDir);
  }
  if (existsSync(parkDir)) rmSync(parkDir, { recursive: true, force: true });
}

// Reste eines abgebrochenen Laufs zuerst aufräumen
restoreApi();

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    restoreApi();
    process.exit(130);
  });
}

let status = 1;
try {
  rmSync(path.join(root, ".next"), { recursive: true, force: true });
  rmSync(path.join(root, "out"), { recursive: true, force: true });

  mkdirSync(parkDir, { recursive: true });
  renameSync(apiDir, parkedApi);

  console.log(`→ Statischer Export · Basis-Pfad "${basePath || "/"}" · ${siteUrl}`);
  const result = spawnSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build"], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_STATIC_EXPORT: "true",
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
  });
  status = result.status ?? 1;

  if (status === 0) {
    if (!existsSync(path.join(root, "out/index.html"))) {
      console.error("✗ out/index.html fehlt – der Export ist unvollständig.");
      status = 1;
    } else {
      // Jekyll ausschalten (Ordner mit Unterstrich, z. B. _next)
      writeFileSync(path.join(root, "out/.nojekyll"), "");
      console.log("✓ Export fertig: ./out");
    }
  }
} finally {
  restoreApi();
  rmSync(path.join(root, ".next"), { recursive: true, force: true });
}

process.exit(status);
