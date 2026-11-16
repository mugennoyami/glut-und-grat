import type { Material } from "./types";

/**
 * Materialauswahl für Griffe und Scheiden.
 * Farben steuern die generierte Darstellung; Beschreibungen erscheinen im Bereich "Maßarbeit".
 * Verfügbarkeit hängt vom jeweiligen Projekt ab – Beispielauswahl, keine Zusage.
 */
export const materials: Record<string, Material> = {
  walnuss: {
    id: "walnuss",
    kind: "wood",
    name: "Walnuss",
    description: "Dunkelbraun, ruhige bis lebhafte Maserung. Liegt warm in der Hand und wird mit Öl tiefer.",
    dark: "#3a2417",
    light: "#6e4930",
    seed: 7,
  },
  raeuchereiche: {
    id: "raeuchereiche",
    kind: "wood",
    name: "Räuchereiche",
    description: "Graubraun bis fast schwarz, mit feiner Zeichnung. Zurückhaltend und sehr formstabil.",
    dark: "#2b251f",
    light: "#59503f",
    seed: 19,
  },
  esche: {
    id: "esche",
    kind: "wood",
    name: "Esche",
    description: "Hell, mit klarer, geradliniger Maserung. Setzt einen hellen Kontrast zu dunklem Stahl.",
    dark: "#a6805a",
    light: "#d8bd92",
    seed: 31,
  },
  "leder-natur": {
    id: "leder-natur",
    kind: "leather",
    name: "Leder natur",
    description: "Pflanzlich wirkender Naturton, der mit Gebrauch nachdunkelt.",
    dark: "#8f5f33",
    light: "#b98250",
    seed: 3,
  },
  "leder-cognac": {
    id: "leder-cognac",
    kind: "leather",
    name: "Leder cognac",
    description: "Warmes, rotbraunes Leder mit sattem Ton.",
    dark: "#6b3318",
    light: "#964a23",
    seed: 5,
  },
  "leder-schwarz": {
    id: "leder-schwarz",
    kind: "leather",
    name: "Leder schwarz",
    description: "Tiefschwarz, ruhig und unauffällig.",
    dark: "#14120f",
    light: "#2b2723",
    seed: 11,
  },
  kupfer: {
    id: "kupfer",
    kind: "metal",
    name: "Kupferstifte",
    description: "Kupfer für Stifte und Zwingen; patiniert mit der Zeit.",
    dark: "#8a4a22",
    light: "#e0a36c",
    seed: 1,
  },
};

export const handleMaterialIds = ["walnuss", "raeuchereiche", "esche"] as const;
export const leatherMaterialIds = ["leder-natur", "leder-cognac", "leder-schwarz"] as const;

export function getMaterial(id: string | undefined): Material | undefined {
  return id ? materials[id] : undefined;
}
