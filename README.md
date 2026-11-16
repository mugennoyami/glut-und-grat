# Glut & Grat

**Schmiedekunst. Schärfe. Charakter.**

Website mit integriertem Demo-Shop für eine kleine handwerkliche Schmiede. Stand: 16.11.2026 – **erste lauffähige Version, noch nicht für den Livebetrieb freigegeben.**

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

E2E-Tests (Playwright, Desktop und Mobil) laufen gegen den Produktions-Build:

```bash
npx playwright install chromium     # einmalig, falls noch kein Browser vorhanden
npm run test:e2e                    # baut, startet auf Port 3100 und testet

# gegen eine bereits laufende Instanz / mit vorhandenem Chromium:
PW_BASE_URL=http://localhost:3000 PW_CHROMIUM_PATH=/pfad/zu/chromium npm run test:e2e
```

Ohne weitere Konfiguration läuft alles vollständig als Demo – es sind keine Zugangsdaten nötig.

## Projektstruktur

```
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

## Qualität

- **Unit-Tests (63):** Preis-/Warenkorblogik inkl. Versand und Grenzfälle, Bereinigung manipulierter Speicherstände, Formular-Schemas, Kassenvalidierung, alle API-Routen (ohne Backend, mit Webhook-Mock, Honeypot, Signaturen), Messergeometrie.
- **E2E-Tests (Desktop Chrome + Pixel 7):** Variantenwahl und Preise, Hinzufügen/Mengen/Entfernen mit Summen, Persistenz über Neuladen und neue Seiten, Kasse als Demo ohne Datenabfluss, Formularfehler mit Fokus und `aria-invalid`, ehrliche „Nicht gesendet“-Rückmeldung, kein horizontaler Überlauf auf allen Seiten, reduzierte Bewegung, Tastatur (Skip-Link, FAQ, Esc).
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
| Werkstattvorstellung (Person, Fotos) | offen |
| Hosting, Domain | offen |

## Hinweise

- Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Zod. Schriften (Fraunces, Instrument Sans) sind über npm eingebunden und werden von der eigenen Seite ausgeliefert – keine Drittanbieter-Anfragen.
- `AGENTS.md` wird von `next dev` erzeugt (Hinweis auf die mitgelieferte Next-Dokumentation unter `node_modules/next/dist/docs/`).
- Projektregeln für die Weiterarbeit stehen in `CLAUDE.md`.
