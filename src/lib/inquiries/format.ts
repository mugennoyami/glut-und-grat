import {
  customBaseProducts,
  customBudgets,
  customMaterials,
  customScopes,
  customStyles,
  labelFor,
  sharpeningBladeTypes,
  sharpeningConditions,
} from "@/content/forms";
import type { InquiryData } from "./delivery";

/** Lesbarer Text einer Anfrage, z. B. zum Kopieren, wenn der Versand nicht verfügbar ist. */
export function inquiryToText(inquiry: InquiryData): string {
  const lines: string[] = [];
  switch (inquiry.type) {
    case "sharpening":
      lines.push("Anfrage Schärfservice");
      lines.push(`Klingentyp: ${labelFor(sharpeningBladeTypes, inquiry.bladeType)}${inquiry.bladeTypeOther ? ` (${inquiry.bladeTypeOther})` : ""}`);
      lines.push(`Anzahl: ${inquiry.quantity}`);
      lines.push(`Ungefähre Klingenlänge: ${inquiry.bladeLengthCm} cm`);
      lines.push(`Zustand: ${labelFor(sharpeningConditions, inquiry.condition)}`);
      if (inquiry.wishes) lines.push(`Besondere Wünsche: ${inquiry.wishes}`);
      break;
    case "custom":
      lines.push("Projektanfrage Maßarbeit (Griff / Scheide)");
      lines.push(`Ausgangsprodukt: ${labelFor(customBaseProducts, inquiry.baseProduct)}`);
      lines.push(`Umfang: ${inquiry.scope.map((s) => labelFor(customScopes, s)).join(", ")}`);
      lines.push(`Materialwunsch: ${inquiry.materials.map((m) => labelFor(customMaterials, m)).join(", ")}`);
      lines.push(`Stil: ${labelFor(customStyles, inquiry.style)}`);
      lines.push(`Budgetrahmen: ${labelFor(customBudgets, inquiry.budget)}`);
      lines.push(`Beschreibung: ${inquiry.description}`);
      break;
    case "contact":
      lines.push("Nachricht an Glut & Grat");
      lines.push(inquiry.message);
      break;
  }
  lines.push("");
  lines.push(`Name: ${inquiry.name}`);
  lines.push(`E-Mail: ${inquiry.email}`);
  return lines.join("\n");
}
