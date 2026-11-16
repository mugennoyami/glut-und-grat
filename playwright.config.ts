import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-Tests laufen gegen den Produktions-Build (`npm run build && npm start`).
 * - PW_BASE_URL: bereits laufende Instanz verwenden (dann wird kein Server gestartet)
 * - PW_CHROMIUM_PATH: eigener Chromium-Pfad (z. B. /opt/pw-browsers/chromium in Cloud-Sandboxes)
 * - PW_ONLY_STATIC=1: nur den statischen Export testen (ohne Server)
 * - PW_STATIC_BASE_URL: Adresse des statischen GitHub-Pages-Exports (z. B. http://localhost:4000/glut-und-grat/,
 *   mit `npm run build:pages && npm run preview:pages`); aktiviert zusätzlich das Projekt "static"
 */
const baseURL = process.env.PW_BASE_URL ?? "http://localhost:3100";
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;
const launchOptions = executablePath ? { executablePath, args: ["--no-sandbox"] } : {};
const staticBaseURL = process.env.PW_STATIC_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL, trace: "off", launchOptions },
  projects: staticBaseURL && process.env.PW_ONLY_STATIC === "1"
    ? [{ name: "static", testMatch: /static-export\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: staticBaseURL, launchOptions } }]
    : [
        { name: "desktop", testIgnore: /static-export/, use: { ...devices["Desktop Chrome"], launchOptions } },
        { name: "mobile", testIgnore: /static-export/, use: { ...devices["Pixel 7"], launchOptions } },
        ...(staticBaseURL
          ? [{ name: "static", testMatch: /static-export\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: staticBaseURL, launchOptions } }]
          : []),
      ],
  webServer: process.env.PW_BASE_URL || process.env.PW_ONLY_STATIC === "1"
    ? undefined
    : {
        command: "npm run build && npx next start -p 3100",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 240_000,
      },
});
