import type { NextConfig } from "next";

/**
 * Zwei Betriebsarten:
 *  - normal (Node-Server): API-Routen, Sicherheits-Header
 *  - statischer Export für GitHub Pages (NEXT_PUBLIC_STATIC_EXPORT=true, siehe scripts/build-pages.mjs):
 *    reine HTML/CSS/JS-Dateien unter einem Basis-Pfad, ohne Server-Funktionen und ohne Header-Konfiguration
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport
    ? {
        output: "export" as const,
        // Der Build läuft ohne API-Routen; Tests (die sie importieren) werden separat per `npm run typecheck` geprüft.
        typescript: { tsconfigPath: "tsconfig.pages.json" },
        trailingSlash: true,
        images: { unoptimized: true },
        ...(basePath ? { basePath } : {}),
      }
    : {
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
