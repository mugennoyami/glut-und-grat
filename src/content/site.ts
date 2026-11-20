/**
 * Zentrale Stammdaten der Website.
 * Alles, was die Werkstatt noch festlegen muss, steht hier als `null` und erscheint auf der Seite
 * ausdrücklich als „offen“ – es werden keine Angaben erfunden.
 */

export const site = {
  name: "Glut & Grat",
  claim: "Stahl. Leder. Geschichten.",
  description:
    "Glut & Grat – die Rüstkammer für Mittelalter, LARP und Rollenspiel. Rüstungen, Schwerter und japanische Klingen in Planung; Messer, Schärfservice und individuelle Projekte aus der Werkstatt von David.",
  /** Betreiber der Werkstatt (eine Person). Nachname und weitere Angaben sind noch offen. */
  operator: { title: "Meisterschmied", name: "David" },
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",

  /**
   * Demo-Schalter (redaktionell). Solange `true`, kennzeichnet die Seite Preise, Produkte und den Checkout
   * als Beispiel. Erst auf `false` setzen, wenn Produktdaten, Rechtstexte und Zahlungsanbieter echt sind
   * (siehe README → Live-Schaltung). Der Checkout bleibt unabhängig davon Demo, solange die API
   * keinen echten Zahlungsanbieter meldet.
   */
  demo: true,

  nav: [
    { label: "Rüstkammer", href: "/ruestkammer" },
    { label: "Katana & Japan", href: "/ruestkammer/katana" },
    { label: "Schärfservice", href: "/schaerfservice" },
    { label: "Maßarbeit", href: "/massarbeit" },
    { label: "Werkstatt", href: "/werkstatt" },
  ],

  contact: {
    /** Öffentliche Kontaktadresse. Per NEXT_PUBLIC_CONTACT_EMAIL setzbar; ohne Wert bleibt sie „offen“. */
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
    phone: null as string | null,
    /** Offene Angaben für Impressum/Kontakt */
    /** Vollständiger Name für das Impressum – bisher ist nur der Vorname bekannt */
    owner: null as string | null,
    street: null as string | null,
    city: null as string | null,
  },

  legalLinks: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
    { label: "Widerruf & Rückgabe", href: "/widerruf" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
