import { collections } from "./collections";
import { products } from "./products";
import { handleMaterialIds, leatherMaterialIds, materials } from "./materials";

/**
 * Auswahllisten der Formulare. Werte sind stabile IDs, Beschriftungen sind frei änderbar.
 */
export interface Choice<V extends string = string> {
  value: V;
  label: string;
  hint?: string;
}

export const sharpeningBladeTypes = [
  { value: "kueche-europaeisch", label: "Küchenmesser (europäisch)" },
  { value: "kueche-japanisch", label: "Küchenmesser (japanisch)", hint: "z. B. Gyuto, Santoku, Nakiri" },
  { value: "taschenmesser", label: "Taschen- oder Klappmesser" },
  { value: "feststehend", label: "Feststehendes Messer (Outdoor, Jagd, Werkstatt)" },
  { value: "schwert", label: "Schwert", hint: "nur nach individueller Prüfung" },
  { value: "sonstiges", label: "Sonstiges" },
] as const satisfies readonly Choice[];

export const sharpeningConditions = [
  { value: "stumpf", label: "Stumpf, sonst unversehrt" },
  { value: "scharten", label: "Kleine Scharten oder Ausbrüche" },
  { value: "rost", label: "Rost oder starke Beschädigungen" },
  { value: "unklar", label: "Weiß ich nicht genau" },
] as const satisfies readonly Choice[];

export const customBaseProducts = [
  ...collections.map((c) => ({ value: c.slug, label: `${c.name} (in Planung)` })),
  ...products.map((p) => ({ value: p.slug, label: `${p.name} (${p.type})` })),
  { value: "neues-messer", label: "Neues Messer nach meinen Vorstellungen" },
  { value: "eigenes-messer-griff", label: "Mein eigenes Messer: neuer Griff" },
  { value: "eigenes-messer-scheide", label: "Mein eigenes Messer: neue Scheide" },
  { value: "offen", label: "Noch offen – ich brauche Beratung" },
] as const satisfies readonly Choice[];

export const customScopes = [
  { value: "ausruestung", label: "Ausrüstung / Sortimentswunsch" },
  { value: "griff", label: "Griff" },
  { value: "scheide", label: "Scheide" },
] as const satisfies readonly Choice[];

export const customMaterials = [
  ...handleMaterialIds.map((id) => ({ value: id, label: materials[id]!.name })),
  ...leatherMaterialIds.map((id) => ({ value: id, label: materials[id]!.name })),
  { value: "beratung", label: "Noch offen – Beratung gewünscht" },
] as const satisfies readonly Choice[];

export const customStyles = [
  { value: "mittelalter", label: "Mittelalterlich / historisch inspiriert" },
  { value: "fantasy", label: "Fantasy / Rollenspiel" },
  { value: "japanisch", label: "Japanisch inspiriert" },
  { value: "schlicht", label: "Schlicht und funktional" },
  { value: "klassisch", label: "Klassisch" },
  { value: "rustikal", label: "Rustikal, Schmiedespuren sichtbar" },
  { value: "modern", label: "Modern, klare Linien" },
  { value: "eigene-idee", label: "Ich habe eine eigene Idee" },
] as const satisfies readonly Choice[];

export const customBudgets = [
  { value: "bis-100", label: "Bis 100 €" },
  { value: "100-200", label: "100 bis 200 €" },
  { value: "200-400", label: "200 bis 400 €" },
  { value: "ueber-400", label: "Über 400 €" },
  { value: "offen", label: "Noch unklar" },
] as const satisfies readonly Choice[];

export const FORM_LIMITS = {
  nameMax: 120,
  emailMax: 200,
  shortTextMax: 200,
  longTextMax: 3000,
  wishesMax: 1500,
  messageMin: 10,
  descriptionMin: 20,
  quantityMax: 20,
  bladeLengthMinCm: 2,
  bladeLengthMaxCm: 120,
} as const;

export function labelFor<V extends string>(choices: readonly Choice<V>[], value: string): string {
  return choices.find((c) => c.value === value)?.label ?? value;
}
