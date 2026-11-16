import type { Product, ProductOption, ProductImage } from "./types";

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ DEMO-/BEISPIELDATEN                                                   │
 * │ Alle Preise, Maße, Stähle, Materialien, Fertigungszeiten und          │
 * │ Verfügbarkeiten sind Platzhalter. Sie sind KEINE bestätigten Angebote │
 * │ und müssen vor der Live-Schaltung durch die Werkstatt festgelegt      │
 * │ werden (siehe README, Abschnitt „Live-Schaltung“).                    │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Preise in Cent (ganze Zahlen) – nie als Fließkommazahl rechnen.
 */

const SHIPPING_NOTES = [
  "Versand in Schutzverpackung (Beispieltext).",
  "Versandart, Versandkosten und Altersnachweis für Messer sind noch nicht festgelegt. In der Demo gilt pauschal der Beispielversand aus dem Warenkorb.",
  "Lieferzeit = Fertigungszeit + Versand. Verbindliche Angaben folgen mit dem Start.",
];

const CARE_STEEL = [
  "Nach Gebrauch von Hand abwaschen und sofort trocknen. Nicht in die Spülmaschine.",
  "Kohlenstoffstahl entwickelt mit der Zeit Patina. Das ist normal und schützt. Bei Bedarf dünn mit lebensmittelechtem Öl einreiben.",
  "Nicht im Wasser liegen lassen und nicht auf Stein oder Glas schneiden.",
];

const CARE_WOOD = "Holzgriff gelegentlich mit Öl oder Wachs auffrischen und nicht dauerhaft nass lassen.";

function handleOption(opts: {
  walnuss?: number;
  raeuchereiche?: number;
  esche?: number;
  escheAvailable?: boolean;
}): ProductOption {
  return {
    id: "griff",
    label: "Griffholz",
    role: "handle",
    help: "Jeder Griff ist ein Einzelstück. Farbe und Maserung weichen von der Abbildung ab.",
    defaultValueId: "walnuss",
    values: [
      { id: "walnuss", label: "Walnuss", priceDeltaCents: opts.walnuss ?? 0, available: true, materialId: "walnuss" },
      {
        id: "raeuchereiche",
        label: "Räuchereiche",
        priceDeltaCents: opts.raeuchereiche ?? 0,
        available: true,
        materialId: "raeuchereiche",
      },
      ...(opts.esche !== undefined
        ? [
            {
              id: "esche",
              label: "Esche",
              priceDeltaCents: opts.esche,
              available: opts.escheAvailable ?? true,
              materialId: "esche",
              note: opts.escheAvailable === false ? "Beispiel: derzeit nicht verfügbar" : undefined,
            },
          ]
        : []),
    ],
  };
}

function illustrationSet(name: string, hasSheathView = false): ProductImage[] {
  return [
    {
      kind: "illustration",
      view: "full",
      alt: `Konzeptillustration des Messers ${name}: Gesamtansicht`,
      caption: "Gesamtansicht",
    },
    {
      kind: "illustration",
      view: "handle",
      alt: `Konzeptillustration des Messers ${name}: Detail Griff mit Stiften`,
      caption: hasSheathView ? "Detail Griff" : "Detail Griff",
    },
    {
      kind: "illustration",
      view: "edge",
      alt: `Konzeptillustration des Messers ${name}: Detail Schneide und Schmiedehaut`,
      caption: "Detail Schneide",
    },
    {
      kind: "illustration",
      view: "dimensions",
      alt: `Maßzeichnung des Messers ${name} mit Klingen- und Gesamtlänge`,
      caption: "Maße",
    },
  ];
}

export const products: Product[] = [
  {
    slug: "funke",
    name: "Funke",
    type: "Schälmesser",
    tagline: "Klein, wach, immer griffbereit.",
    summary: "Das kleine Messer für Obst, Kräuter und alles, was in der Hand geschnitten wird.",
    description: [
      "Funke ist für die kleinen Handgriffe gemacht: einen Apfel schälen, Kräuter schneiden, ein Stück Käse vom Brett nehmen. Die kurze Klinge bleibt jederzeit kontrollierbar.",
      "Klinge und Griff werden einzeln gefertigt. Kleine Unterschiede bei Schmiedehaut, Maserung und Form gehören dazu.",
    ],
    basePriceCents: 9800,
    maxQuantity: 5,
    specs: {
      bladeLengthMm: 80,
      overallLengthMm: 190,
      steel: "Kohlenstoffstahl C75 (Beispielangabe)",
      handle: "Walnuss oder Räuchereiche, Kupferstifte (Beispielangabe)",
    },
    care: [...CARE_STEEL, CARE_WOOD],
    availability: {
      status: "made_to_order",
      label: "Auf Bestellung gefertigt (Beispielangabe)",
      productionWeeks: { min: 3, max: 4 },
      note: "Beispielwert für die Fertigungszeit, keine Lieferzusage.",
    },
    options: [
      handleOption({ walnuss: 0, raeuchereiche: 600 }),
      {
        id: "etui",
        label: "Lederetui",
        role: "sheath",
        defaultValueId: "ohne",
        values: [
          { id: "ohne", label: "Ohne Etui", priceDeltaCents: 0, available: true },
          { id: "natur", label: "Lederetui natur", priceDeltaCents: 1900, available: true, materialId: "leder-natur" },
        ],
      },
    ],
    included: ["Pflegehinweise zum Messer (Beispiel)"],
    shippingNotes: SHIPPING_NOTES,
    images: illustrationSet("Funke"),
    art: { profile: "paring", bladeHeightMm: 21, handleHeightMm: 19, pins: 2 },
    seo: {
      title: "Funke – kleines handgeschmiedetes Schälmesser",
      description: "Funke ist ein kleines Schälmesser aus Kohlenstoffstahl mit Holzgriff. Demo-Produkt mit Beispieldaten.",
    },
  },
  {
    slug: "esse",
    name: "Esse",
    type: "Allzweck-Küchenmesser",
    tagline: "Die Klinge für den täglichen Einsatz.",
    summary: "Mittellange, schlanke Klinge für Gemüse, Fleisch und Fisch.",
    description: [
      "Esse ist ein Küchenmesser für den Alltag: lang genug für Brett und Braten, schlank genug für feine Schnitte. Die flach geschliffene Klinge läuft leicht durch das Schnittgut.",
      "Der Griff wird passend zur Klinge geformt und von Hand geschliffen. Wer lieber ein anderes Holz oder eine eigene Griffform möchte, kann über Maßarbeit anfragen.",
    ],
    basePriceCents: 16800,
    maxQuantity: 3,
    specs: {
      bladeLengthMm: 120,
      overallLengthMm: 245,
      steel: "Kohlenstoffstahl 1.2842 (Beispielangabe)",
      handle: "Walnuss, Räuchereiche oder Esche, Kupferstifte (Beispielangabe)",
    },
    care: [...CARE_STEEL, CARE_WOOD],
    availability: {
      status: "made_to_order",
      label: "Auf Bestellung gefertigt (Beispielangabe)",
      productionWeeks: { min: 4, max: 6 },
      note: "Beispielwert für die Fertigungszeit, keine Lieferzusage.",
    },
    options: [
      handleOption({ walnuss: 0, raeuchereiche: 1000, esche: 0, escheAvailable: false }),
      {
        id: "schutz",
        label: "Klingenschutz",
        role: "sheath",
        help: "Ein Schutz aus Leder für Schublade oder Messerblock.",
        defaultValueId: "ohne",
        values: [
          { id: "ohne", label: "Ohne Klingenschutz", priceDeltaCents: 0, available: true },
          {
            id: "leder",
            label: "Klingenschutz aus Leder",
            priceDeltaCents: 2400,
            available: true,
            materialId: "leder-natur",
          },
        ],
      },
    ],
    included: ["Pflegehinweise zum Messer (Beispiel)"],
    shippingNotes: SHIPPING_NOTES,
    images: illustrationSet("Esse"),
    art: { profile: "utility", bladeHeightMm: 28, handleHeightMm: 23, pins: 2 },
    seo: {
      title: "Esse – handgeschmiedetes Allzweck-Küchenmesser",
      description: "Esse ist ein Allzweck-Küchenmesser mit schlanker Klinge. Demo-Produkt mit Beispieldaten.",
    },
  },
  {
    slug: "zunder",
    name: "Zunder",
    type: "Feststehendes Alltagsmesser mit Lederscheide",
    tagline: "Für Holz, Feuer und Brotzeit.",
    summary: "Kompaktes feststehendes Messer mit Drop-Point-Klinge. Die Lederscheide gehört dazu.",
    description: [
      "Zunder ist das Messer für unterwegs: Holz für ein kleines Feuer vorbereiten, Brot und Wurst schneiden, eine Schnur kappen. Die Drop-Point-Klinge ist robust und trotzdem fein genug für Details.",
      "Die Lederscheide ist im Preis enthalten. Die Farbe wählst du selbst, den Griff auch.",
    ],
    basePriceCents: 19800,
    maxQuantity: 3,
    specs: {
      bladeLengthMm: 90,
      overallLengthMm: 205,
      steel: "Kohlenstoffstahl 80CrV2 (Beispielangabe)",
      handle: "Walnuss, Räuchereiche oder Esche, Kupferstifte, Fangriemenloch (Beispielangabe)",
    },
    care: [
      ...CARE_STEEL,
      CARE_WOOD,
      "Das Messer nicht dauerhaft feucht in der Lederscheide lagern. Leder gelegentlich mit Lederpflege behandeln.",
    ],
    availability: {
      status: "made_to_order",
      label: "Auf Bestellung gefertigt (Beispielangabe)",
      productionWeeks: { min: 4, max: 6 },
      note: "Beispielwert für die Fertigungszeit, keine Lieferzusage.",
    },
    options: [
      handleOption({ walnuss: 0, raeuchereiche: 1200, esche: 0 }),
      {
        id: "scheide",
        label: "Scheidenleder",
        role: "sheath",
        help: "Die Scheide ist im Preis enthalten.",
        defaultValueId: "natur",
        values: [
          { id: "natur", label: "Natur", priceDeltaCents: 0, available: true, materialId: "leder-natur" },
          { id: "cognac", label: "Cognac", priceDeltaCents: 0, available: true, materialId: "leder-cognac" },
          { id: "schwarz", label: "Schwarz", priceDeltaCents: 0, available: true, materialId: "leder-schwarz" },
        ],
      },
    ],
    included: ["Lederscheide (Farbe wählbar)", "Pflegehinweise zu Messer und Leder (Beispiel)"],
    shippingNotes: SHIPPING_NOTES,
    images: illustrationSet("Zunder", true),
    art: { profile: "dropPoint", bladeHeightMm: 27, handleHeightMm: 26, pins: 3, lanyardHole: true },
    seo: {
      title: "Zunder – handgeschmiedetes Alltagsmesser mit Lederscheide",
      description: "Zunder ist ein feststehendes Alltagsmesser mit Drop-Point-Klinge und Lederscheide. Demo-Produkt mit Beispieldaten.",
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProduct(id);
}
