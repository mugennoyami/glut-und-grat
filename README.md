# Glut & Grat

**Schmiedekunst. Schärfe. Charakter.**

Website mit integriertem Demo-Shop für die kleine Schmiede von **Meisterschmied David** (die Werkstatt wird von einer Person betrieben). Stand: 16.11.2026 – **erste lauffähige Version als Demo-Vorschau, noch nicht für den Livebetrieb freigegeben.**

Der Name ist ein vorläufiger Arbeitstitel. Marken- und Domainverfügbarkeit wurden noch nicht geprüft.

## Angebot

- Kleine handgeschmiedete Messer (Shop mit Produktseiten, Varianten, Warenkorb, Demo-Kasse)
- Schärfservice für unterschiedliche Messer, Schwerter nach individueller Prüfung (strukturierte Anfrage)
- Individuelle Griffe und Scheiden (Projektanfrage)

Drei getrennte Abläufe, bewusst nicht vermischt:

| Angebot | Ablauf | Seite |
| --- | --- | --- |
| Standardprodukte | Produktseite → Warenkorb → Kasse | `/messer`, `/messer/[slug]`, `/warenkorb`, `/kasse` |
| Schärfservice | Anfrageformular (Klingentyp, Anzahl, Länge, Zustand, Wünsche) | `/schaerfservice` |
| Griffe und Scheiden | Projektanfrage (Ausgangsprodukt, Material, Stil, Budgetrahmen, Beschreibung) | `/massarbeit` |

## Schnellstart

Voraussetzung: Node.js ≥ 20.9 (getestet mit 22) und npm.

```bash
npm install
npm run dev          # Entwicklungsserver auf http://localhost:3000
```

```bash
npm run build        # Produktions-Build
npm start            # Build ausliefern (http://localhost:3000)
```

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm test             # Unit-Tests (Vitest)
npm run check        # alles oben + Build
```

```bash
npm run build:pages      # statischer Export für GitHub Pages nach ./out
npm run preview:pages    # Export unter http://localhost:4000/glut-und-grat/ ansehen
```

E2E-Tests (Playwright, Desktop und Mobil) laufen gegen den Produktions-Build:

```bash
npx playwright install chromium     # einmalig, falls noch kein Browser vorhanden
npm run test:e2e                    # baut, startet auf Port 3100 und testet

# gegen eine bereits laufende Instanz / mit vorhandenem Chromium:
PW_BASE_URL=http://localhost:3000 PW_CHROMIUM_PATH=/pfad/zu/chromium npm run test:e2e

# nur den statischen GitHub-Pages-Export testen (nach build:pages + preview:pages):
PW_ONLY_STATIC=1 PW_STATIC_BASE_URL=http://localhost:4000/glut-und-grat/ npm run test:e2e
```

Ohne weitere Konfiguration läuft alles vollständig als Demo – es sind keine Zugangsdaten nötig.

## Projektstruktur

```
.github/workflows/pages.yml   Veröffentlichung über GitHub Pages
scripts/                  build-pages.mjs (statischer Export), preview-pages.mjs (lokale Vorschau)
tsconfig.pages.json       TypeScript-Konfiguration nur für den Pages-Build (ohne Tests/API)
src/
  app/                    Routen (Next.js App Router)
    page.tsx                Startseite
    messer/                 Shop-Übersicht und [slug]-Produktseiten
    warenkorb/, kasse/      Warenkorb und Demo-Kasse
    schaerfservice/, massarbeit/, werkstatt/, kontakt/
    impressum/, datenschutz/, agb/, widerruf/    Platzhalter (kein Rechtstext)
    api/
      inquiries/            Anfragen entgegennehmen, validieren, zustellen
      checkout/, checkout/quote/   serverseitige Preisberechnung, Checkout-Start
      webhooks/payments/    Eingang für Zahlungsergebnisse (verifiziert, noch ohne Bestellspeicher)
    robots.ts, sitemap.ts, icon.svg
  content/                ← ALLE redaktionellen Daten, zentral editierbar
    products.ts             Produkte, Preise (Cent), Varianten, Maße, Pflege, Verfügbarkeit
    shop.ts                 Versandpauschale, Währung
    materials.ts            Holz-/Lederauswahl (Texte + Farben der Darstellung)
    pages.ts                Texte: Hero, Schärfservice, Maßarbeit, Werkstatt, FAQ, Rechtsplatzhalter
    forms.ts                Auswahllisten der Formulare
    site.ts                 Name, Claim, Navigation, Kontaktdaten (offen = null), Demo-Schalter
  lib/
    cart/                   Preislogik (pricing.ts), Warenkorb-Operationen, Typen
    commerce/               Zahlungsanbieter-Schnittstelle, Anfrage-Schema, Kassen-Validierung
    inquiries/              Zod-Schemas (Browser + Server), Zustell-Adapter, Textformat
    security/               HMAC-Prüfung, einfacher Ratenbegrenzer
  components/
    layout/                 Header, Footer, Demo-Banner
    shop/                   Warenkorb (Store, Provider, Schublade, Seite), Galerie, Variantenwahl, Kasse
    forms/                  Formularbausteine und die drei Formulare
    sections/               Abschnitte der Startseite
    art/                    generierte Messer-Illustrationen und Materialtexturen (SVG)
    ui/                     Button, Wortmarke, Dialog, Icons, Reveal
tests/
  unit/                   Vitest: Preise, Warenkorb, Validierung, API, Sicherheit, Geometrie
  e2e/                    Playwright: Kernabläufe, Formulare, Seiten, Barrierefreiheit (axe)
```

## Inhalte pflegen

Alles, was Besucher lesen, steht in `src/content/`. Komponenten enthalten keine Produktdaten.

- **Neues Messer oder neue Preise:** `src/content/products.ts`. Preise sind ganze Cent-Beträge. Varianten (`options`) mit Aufpreis und `available`.
- **Versandpauschale:** `src/content/shop.ts`.
- **Kontaktdaten:** `src/content/site.ts` (`null` = „offen“, wird so angezeigt) oder per `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Texte:** `src/content/pages.ts`.
- **Echte Fotos statt Illustrationen:** Bilddateien in `public/images/produkte/` ablegen und in `products.ts` ersetzen:
  ```ts
  images: [{ kind: "photo", src: "/images/produkte/funke-1.jpg", alt: "…", width: 1600, height: 1067 }]
  ```
  Die Galerie, Produktkarten und die Kennzeichnung „Konzeptdarstellung“ passen sich automatisch an (Fotos erhalten keine Kennzeichnung).

## Bildwelt

Es gibt keine Fotos. Alle Messer-, Leder- und Holzdarstellungen werden prozedural als SVG erzeugt (`src/components/art/`) und sind überall als **„Konzeptdarstellung“** gekennzeichnet. Sie zeigen die gewählte Variante (Holz, Leder) und stimmen in Länge und Proportion mit den Produktdaten überein, sind aber keine Abbildungen realer Messer. Werkstattbereiche zeigen bewusst nur Platzhalter („Platz für Werkstattfotos“), keine vorgetäuschten Aufnahmen.

## Demo-Einschränkungen

Solange nichts anderes konfiguriert ist:

- Alle **Produkte, Preise, Maße, Stähle, Materialien, Fertigungszeiten und Verfügbarkeiten sind Beispieldaten** und überall als solche gekennzeichnet (Banner, Produktseiten, Warenkorb).
- Die **Kasse ist eine Demo**: keine Bestellung, keine Zahlung, kein Vertrag. Es gibt keine Eingabe von Zahlungsdaten. Kontaktdaten der Kasse bleiben im Arbeitsspeicher des Tabs; an den Server gehen nur Warenkorb-Positionen (keine Preise, keine persönlichen Daten).
- **Formulare senden nichts**, solange `INQUIRY_WEBHOOK_URL` fehlt. Die API antwortet dann `503 not_configured`, die Seite zeigt „Nicht gesendet“ und bietet „Anfrage als Text kopieren“ an. Eingaben bleiben nur im Arbeitsspeicher (kein localStorage, keine Cookies, kein Server-Log).
- **Foto-Upload ist nicht vorhanden** und wird deshalb nicht angeboten.
- **Rechtsseiten sind Platzhalter** und benennen nur, was fehlt.
- **Suchmaschinen sind ausgesperrt** (`robots.txt` mit `Disallow: /`, `noindex`), bis `SITE_INDEXABLE=true` gesetzt ist.
- **Auf GitHub Pages läuft die Seite als statischer Export ohne Server** (siehe unten): Formulare melden dort immer „Nicht gesendet“, die Demo-Kasse rechnet im Browser (mit derselben Preislogik) und benennt das offen.
- Der Warenkorb liegt im `localStorage` des Browsers (Schlüssel `glutgrat.cart.v1`; nur Produkt, Auswahl, Menge). Er überlebt Seitenwechsel und Browserneustart. Blockiert der Browser das Speichern, bleibt er bis zum Neuladen im Arbeitsspeicher und die Seite weist darauf hin.

## Konfiguration

Vorlage: `.env.example`. Es gibt keine Geheimnisse im Frontend; Variablen mit `NEXT_PUBLIC_` sind öffentlich.

| Variable | Zweck | Standard |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Basis-URL (Metadaten, Sitemap) | `http://localhost:3000` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | öffentliche Kontaktadresse | nicht gesetzt = „offen“ |
| `SITE_INDEXABLE` | `true` erlaubt Suchmaschinen | nicht gesetzt = gesperrt |
| `INQUIRY_WEBHOOK_URL` | Ziel für Formularanfragen (https) | nicht gesetzt = kein Versand |
| `INQUIRY_WEBHOOK_SECRET` | signiert Anfragen (HMAC-SHA256, Header `x-gg-signature`) | optional |
| `PAYMENT_PROVIDER` | `demo` oder ein später ergänzter Anbieter | `demo` |
| `PAYMENT_WEBHOOK_SECRET` | Geheimnis für den Zahlungs-Webhook | nicht gesetzt = Webhook aus (501) |

`NEXT_PUBLIC_*`-Werte werden beim Build eingebettet, ebenso `SITE_INDEXABLE` für die Metadaten statischer Seiten – bei Änderungen neu bauen.

## Austauschbare Integrationen

Es wurde bewusst keine eigene Commerce-Plattform gebaut. Die Schnittstellen sind klein und liegen an einer Stelle.

### Formularanfragen (`src/lib/inquiries/delivery.ts`)

`getInquiryDelivery()` liefert „none“ (Standard) oder „webhook“. Der Webhook ist ein JSON-POST `{ type, submittedAt, data }`, optional signiert. Dahinter passen z. B. Zapier/Make, eine eigene Funktion, ein E-Mail-Dienst oder ein Ticketsystem. Weitere Adapter (E-Mail-API, Datenbank) werden hier ergänzt, ohne Formulare zu ändern. Die API validiert jede Anfrage serverseitig neu, verwirft Honeypot-Treffer und begrenzt die Rate pro Instanz (nur Platzhalter, siehe unten).

### Zahlungsanbieter und Shop-Backend (`src/lib/commerce/provider.ts`)

`CheckoutProvider.createCheckout(summary, context)` erhält den **serverseitig neu berechneten** Warenkorb (`priceCart`) und liefert entweder eine Demo-Antwort oder eine Weiterleitung zur gehosteten Bezahlseite eines Anbieters (Stripe Checkout, Mollie, PayPal …) oder eines Shop-Backends (Shopify, Medusa …). Ein neuer Anbieter wird in `getCheckoutProvider()` registriert. Unbekannte `PAYMENT_PROVIDER`-Werte ergeben `501`, nie eine vorgetäuschte Demo.

Grundsätze, die bereits umgesetzt sind:

- Preise kommen **nur aus dem Katalog** (`src/content/products.ts`). `/api/checkout` und `/api/checkout/quote` erwarten vom Browser nur Produkt, Auswahl und Menge und ignorieren Beträge. Dieselbe Funktion `priceCart` rechnet im Browser (Anzeige) und auf dem Server (maßgeblich).
- Der Browser speichert keine Preise. Der Server lehnt unbekannte Produkte, Optionen, nicht verfügbare Varianten und ungültige Mengen ab.
- `/api/webhooks/payments` ist ohne Secret abgeschaltet (501), prüft Signaturen in konstanter Zeit (401 bei Fehlern) und verarbeitet **noch nichts**, weil es keinen Bestellspeicher gibt.

Noch zu bauen, sobald ein Anbieter feststeht: Bestellung serverseitig anlegen (mit Katalogpreisen zum Zeitpunkt der Bestellung), Zahlungsergebnis ausschließlich über den **verifizierten Webhook** verarbeiten (Anbieter-eigene Signaturprüfung statt HMAC-Platzhalter, Betrag gegen gespeicherte Bestellung prüfen, idempotent), Statusseite für Kundschaft, Bestellbenachrichtigung.

## Veröffentlichung über GitHub Pages

Die Seite wird als **statischer Export** veröffentlicht (`npm run build:pages` → `./out`), weil GitHub Pages nur Dateien ausliefert. Der Workflow `.github/workflows/pages.yml` prüft (Typen, Lint, Unit-Tests), baut den Export und veröffentlicht ihn bei jedem Push auf `main` oder per Hand (Actions → „GitHub Pages“ → Run workflow).

**Live (Demo-Vorschau):** <https://mugennoyami.github.io/glut-und-grat/> – Stand 16.11.2026, Workflow-Lauf erfolgreich, alle Seiten erreichbar (die 8 Export-Tests laufen auch gegen diese Adresse: `PW_ONLY_STATIC=1 PW_STATIC_BASE_URL=https://mugennoyami.github.io/glut-und-grat/ npm run test:e2e`).

**Voraussetzungen im Repository** (einmalig, nicht per Code änderbar):
1. **Sichtbarkeit/Tarif:** GitHub Pages ist für *private* Repositories nur mit einem bezahlten GitHub-Tarif (Pro, Team, Enterprise) verfügbar; auf dem kostenlosen Tarif muss das Repository öffentlich sein. Das Repository ist inzwischen **öffentlich** – alles, was committet wird, ist für alle lesbar: **niemals Geheimnisse einchecken** (`.env*` ist in `.gitignore`). Die veröffentlichte Seite ist **öffentlich im Internet erreichbar**.
2. **Settings → Pages → Build and deployment → Source: „GitHub Actions“.** Bei „Deploy from a branch“ würde GitHub stattdessen nur die README per Jekyll veröffentlichen.
3. Der Workflow läuft bei jedem Push auf `main`; die Adresse steht im Lauf unter „deploy“.

Was der Export anders macht:
- Alle Adressen liegen unter dem Basis-Pfad `/glut-und-grat/` (bei eigener Domain: `PAGES_BASE_PATH=""` setzen).
- Es gibt **keine API**: `src/app/api` wird nur für diesen Build beiseitegelegt und danach wiederhergestellt. Formulare senden nichts und sagen das offen („Nicht gesendet“, mit „Anfrage als Text kopieren“). Die Kasse rechnet im Browser und weist darauf hin; Preise stammen weiterhin ausschließlich aus dem Katalog.
- Die Sicherheits-Header aus `next.config.ts` entfallen (Pages erlaubt keine eigenen Header). Für den Livebetrieb deshalb Hosting mit Server oder Edge-Konfiguration wählen.
- Die Seite bleibt **noindex** und `robots.txt` sperrt Suchmaschinen, bis `SITE_INDEXABLE=true` gesetzt und neu gebaut wird.

Für den echten Shop (Zahlung, Bestellungen, Formularzustellung) ist GitHub Pages nicht ausreichend; dafür braucht es Hosting mit Server-Funktionen (z. B. Vercel, Netlify, eigener Node-Server) – der normale `npm run build` / `npm start` ist darauf ausgelegt.

## Qualität

- **Unit-Tests (63):** Preis-/Warenkorblogik inkl. Versand und Grenzfälle, Bereinigung manipulierter Speicherstände, Formular-Schemas, Kassenvalidierung, alle API-Routen (ohne Backend, mit Webhook-Mock, Honeypot, Signaturen), Messergeometrie.
- **E2E-Tests (Desktop Chrome + Pixel 7; zusätzlich 8 Tests für den statischen Pages-Export):** Variantenwahl und Preise, Hinzufügen/Mengen/Entfernen mit Summen, Persistenz über Neuladen und neue Seiten, Kasse als Demo ohne Datenabfluss, Formularfehler mit Fokus und `aria-invalid`, ehrliche „Nicht gesendet“-Rückmeldung, kein horizontaler Überlauf auf allen Seiten, reduzierte Bewegung, Tastatur (Skip-Link, FAQ, Esc).
- **Barrierefreiheit:** automatische axe-core-Prüfung (WCAG 2.1 A/AA, inkl. Kontraste) aller Hauptseiten und der Warenkorb-Schublade ohne Befund; sichtbare Fokuszustände; Formularlabels, Fehlerzusammenfassung mit Sprunglinks; native `<dialog>`-Elemente mit Fokusfalle und Esc. **Eine manuelle Prüfung mit Screenreader (VoiceOver/NVDA) steht noch aus.**
- **Mobil:** Zielflächen ≥ 44 px, feste Warenkorb-/Kassenleisten in Daumenreichweite, einspaltige Varianten- und Formulare.

## Live-Schaltung – Checkliste

Nichts davon ist erledigt; bis dahin ist dies **kein produktiver Shop**.

**Inhalte und Recht**
- [ ] Echte Produkte, Preise, Maße, Stähle, Materialien, Fertigungszeiten festlegen und `products.ts` ersetzen; Hinweise „Beispielangabe“ entfernen
- [ ] Anbieter-/Unternehmensangaben (Name, Anschrift, Kontakt, Rechtsform, Steuerangaben) – Impressum
- [ ] Datenschutzerklärung (Hosting, Formular-Empfänger, Zahlungs-/Versanddienstleister)
- [ ] AGB, Widerrufsbelehrung inkl. Regelung für Maßanfertigungen und den Schärfservice
- [ ] Messerrecht, Altersnachweis und Versandbeschränkungen (auch für Schwerter) rechtlich klären
- [ ] Preisangaben (Steuer, Versandkosten, Lieferzeiten) rechtlich prüfen; Versandländer festlegen
- [ ] Marken- und Domainprüfung für „Glut & Grat“
- [ ] Echte Fotos (Produkte, Werkstatt) und Vorstellungstext der Werkstatt; Platzhalter entfernen

**Technik**
- [ ] Zahlungsanbieter/Shop-Backend anbinden (siehe oben), `PAYMENT_PROVIDER` und Webhook-Secret setzen, Bestellspeicher bauen, Testzahlungen und Fehlerfälle prüfen
- [ ] `INQUIRY_WEBHOOK_URL` (+ Secret) auf einen echten Empfang setzen und Zustellung testen
- [ ] Spam-Schutz ergänzen (z. B. Cloudflare Turnstile/hCaptcha); den Instanz-Ratenbegrenzer durch Edge-/WAF-Limits oder gemeinsamen Speicher ersetzen
- [ ] Hosting wählen (Node-fähig oder Vercel/Netlify o. Ä.), HTTPS, Backups, Fehlerüberwachung
- [ ] Sicherheits-Header sind gesetzt (`next.config.ts`); Content-Security-Policy ergänzen
- [ ] `site.demo` auf `false` setzen, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` setzen, danach `SITE_INDEXABLE=true`
- [ ] Manuelle Tests: Screenreader, Tastatur, echte Geräte (iOS Safari, Android Chrome), Lighthouse

## Offene Inhalte und Integrationen

| Thema | Stand |
| --- | --- |
| Produktdaten, Preise, Lieferzeiten | Beispieldaten |
| Bilder | generierte Konzeptdarstellungen, keine Fotos |
| Kontaktdaten, Impressum, Datenschutz, AGB, Widerruf | offen (Platzhalter) |
| Versand, Zahlungsarten, Altersnachweis | offen |
| Zahlungsanbieter, Bestellspeicher, Webhook-Verarbeitung | nicht angebunden |
| Anfrage-Zustellung | nicht angebunden (Webhook-Adapter vorbereitet) |
| Foto-Upload für Anfragen | nicht vorhanden |
| Werkstattvorstellung | Betreiber bekannt: Meisterschmied David (Einpersonen-Werkstatt). Nachname, Werdegang, Fotos und Porträt offen |
| Hosting, Domain | Demo über GitHub Pages (siehe oben); Live-Hosting und Domain offen |

## Hinweise

- **Stimme der Texte:** Die Seite spricht in der Ich-Form von David („Ich prüfe deine Anfrage …“) und duzt Besucher. Über David stehen nur die gesicherten Angaben auf der Seite (Vorname, Meisterschmied, betreibt die Werkstatt allein); es gibt keine erfundene Biografie. Texte stehen in `src/content/pages.ts` und sollten vor dem Livegang von David freigegeben werden.
- Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Zod. Schriften (Fraunces, Instrument Sans) sind über npm eingebunden und werden von der eigenen Seite ausgeliefert – keine Drittanbieter-Anfragen.
- `AGENTS.md` wird von `next dev` erzeugt (Hinweis auf die mitgelieferte Next-Dokumentation unter `node_modules/next/dist/docs/`).
- Projektregeln für die Weiterarbeit stehen in `CLAUDE.md`.
