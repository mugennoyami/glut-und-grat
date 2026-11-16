import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-Tests laufen gegen den Produktions-Build (`npm run build && npm start`).
 * - PW_BASE_URL: bereits laufende Instanz verwenden (dann wird kein Server gestartet)
 * - PW_CHROMIUM_PATH: eigener Chromium-Pfad (z. B. /opt/pw-browsers/chromium in Cloud-Sandboxes)
 */
const baseURL = process.env.PW_BASE_URL ?? "http://localhost:3100";
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;
const launchOptions = executablePath ? { executablePath, args: ["--no-sandbox"] } : {};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL, trace: "off", launchOptions },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
  ],
  webServer: process.env.PW_BASE_URL
    ? undefined
    : {
        command: "npm run build && npx next start -p 3100",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 240_000,
      },
});
