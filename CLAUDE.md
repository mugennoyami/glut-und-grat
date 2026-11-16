# Projektregeln – Glut & Grat

Lies zuerst `README.md` (Start, Struktur, Demo-Grenzen, Live-Checkliste) und `AGENTS.md` (Hinweis auf die Next.js-16-Dokumentation unter `node_modules/next/dist/docs/`).

## Grundsätze
- **Kein produktiver Shop.** Alle Produkt-, Preis-, Material-, Lieferdaten sind Beispieldaten und müssen so gekennzeichnet bleiben. Keine echten Zahlungen oder Bestellungen auslösen.
- **Nichts erfinden:** keine Werkstattfotos, Referenzen, Bewertungen, Siegel, Lieferzusagen, Biografie oder Rechtstexte. Fehlende Angaben stehen als „offen“/`null` im Content.
- **Formulare behaupten keinen Versand**, solange kein Zustellweg konfiguriert ist (`/api/inquiries` → 503 `not_configured`). Fotos nur anbieten, wenn Upload und Speicherung wirklich existieren.
- **Preise nur aus dem Katalog** (`src/content/products.ts`, Cent als ganze Zahlen). Der Server rechnet immer selbst (`priceCart`); Beträge aus dem Browser werden ignoriert. Keine Geheimnisse im Frontend.
- **Texte und Daten zentral** in `src/content/`, nicht in Komponenten. Sprache: Deutsch, direkte Du-Ansprache, kurz und konkret. Die Werkstatt betreibt eine Person: Meisterschmied David. Texte in Ich-Form von David; keine Pronomen über David schreiben; nur gesicherte Angaben zu ihm (Vorname, Meisterschmied, betreibt allein) – Nachname, Werdegang, Auszeichnungen und Fotos nicht erfinden.
- Versal-Beschriftungen mit „ß“ über `<Caps>` setzen (sonst wird aus „Maßarbeit“ „MASSARBEIT“).

## Veröffentlichung
GitHub Pages = statischer Export (`npm run build:pages`, Workflow `.github/workflows/pages.yml`). Dort gibt es keine API: Formulare dürfen nichts als gesendet ausgeben, die Kasse bleibt Demo. `src/app/api` nie dauerhaft verschieben – das Build-Skript stellt es wieder her.

## Qualität
Vor Abschluss: `npm run typecheck && npm run lint && npm test && npm run build`; E2E gegen den Build (`npm run test:e2e`, siehe README). Änderungen an UI prüfen auf Desktop und Mobil (kein horizontaler Überlauf, Zielflächen ≥ 44 px, sichtbarer Fokus, reduzierte Bewegung).
