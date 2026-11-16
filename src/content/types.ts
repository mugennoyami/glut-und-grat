/**
 * Zentrale Typen für alle redaktionell pflegbaren Inhalte.
 * Daten leben in src/content/*.ts – Komponenten enthalten keine Produktdaten.
 */

export type KnifeProfile = "paring" | "utility" | "dropPoint";

/** Parameter für die generierte Konzept-Illustration eines Messers (bis echte Fotos vorliegen). */
export interface KnifeArt {
  profile: KnifeProfile;
  /** Klingenhöhe an der Ferse in mm */
  bladeHeightMm: number;
  /** Griffhöhe in mm */
  handleHeightMm: number;
  /** Anzahl der Griffstifte */
  pins: number;
  /** Fangriemenloch am Griffende */
  lanyardHole?: boolean;
}

export type ProductImage =
  | {
      kind: "illustration";
      view: "full" | "handle" | "edge" | "dimensions";
      alt: string;
      caption: string;
    }
  | {
      /** Echtes Foto (z. B. /images/produkte/funke-1.jpg in /public). */
      kind: "photo";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    };

export interface ProductOptionValue {
  id: string;
  label: string;
  /** Aufpreis (+) oder Abzug (−) gegenüber dem Grundpreis in Cent */
  priceDeltaCents: number;
  available: boolean;
  /** Kurzer Hinweis, z. B. "derzeit nicht verfügbar (Beispiel)" */
  note?: string;
  /** Verweis auf src/content/materials.ts (Darstellung der Illustration) */
  materialId?: string;
}

export interface ProductOption {
  id: string;
  label: string;
  /** Steuert, welche Illustration auf die Auswahl reagiert */
  role: "handle" | "sheath" | "other";
  help?: string;
  defaultValueId: string;
  values: ProductOptionValue[];
}

export type AvailabilityStatus = "made_to_order" | "in_stock" | "sold_out";

export interface Product {
  slug: string;
  name: string;
  type: string;
  tagline: string;
  summary: string;
  description: string[];
  /** Grundpreis in Cent (Beispieldaten) */
  basePriceCents: number;
  maxQuantity: number;
  specs: {
    bladeLengthMm: number;
    overallLengthMm: number;
    steel: string;
    handle: string;
  };
  care: string[];
  availability: {
    status: AvailabilityStatus;
    label: string;
    productionWeeks: { min: number; max: number };
    note: string;
  };
  options: ProductOption[];
  /** Im Preis enthaltenes Zubehör */
  included: string[];
  shippingNotes: string[];
  images: ProductImage[];
  art: KnifeArt;
  seo: { title: string; description: string };
}

export interface Material {
  id: string;
  kind: "wood" | "leather" | "metal";
  name: string;
  description: string;
  /** Farbrampe für die Darstellung: dunkel → hell */
  dark: string;
  light: string;
  /** Seed für die Maserung */
  seed: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  text: string;
}
