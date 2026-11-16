import { describe, expect, it } from "vitest";
import { fieldErrors, inquirySchema, parseDecimal } from "@/lib/inquiries/schemas";

const base = { name: "Mira Muster", email: "mira@beispiel.de", consent: true as const };

const validSharpening = {
  type: "sharpening" as const,
  bladeType: "kueche-europaeisch",
  quantity: 3,
  bladeLengthCm: 20,
  condition: "stumpf",
  ...base,
};

const validCustom = {
  type: "custom" as const,
  baseProduct: "esse",
  scope: ["griff", "scheide"],
  materials: ["walnuss"],
  style: "klassisch",
  budget: "100-200",
  description: "Ein dunkler Griff mit dünnem Kupferring, dazu eine schlichte Scheide.",
  ...base,
};

describe("Schärf-Anfrage", () => {
  it("akzeptiert gültige Eingaben", () => {
    expect(inquirySchema.safeParse(validSharpening).success).toBe(true);
  });

  it("meldet fehlende Pflichtfelder pro Feld", () => {
    const result = inquirySchema.safeParse({ type: "sharpening", ...base, name: "", email: "kaputt" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors.name).toBeDefined();
      expect(errors.email).toContain("gültige E-Mail");
      expect(errors.bladeType).toBeDefined();
      expect(errors.quantity).toBeDefined();
      expect(errors.bladeLengthCm).toBeDefined();
      expect(errors.condition).toBeDefined();
    }
  });

  it("prüft Wertebereiche für Anzahl und Länge", () => {
    for (const patch of [{ quantity: 0 }, { quantity: 21 }, { quantity: 1.5 }, { bladeLengthCm: 1 }, { bladeLengthCm: 500 }]) {
      expect(inquirySchema.safeParse({ ...validSharpening, ...patch }).success).toBe(false);
    }
  });

  it("verlangt bei „Sonstiges“ eine Beschreibung des Klingentyps", () => {
    const result = inquirySchema.safeParse({ ...validSharpening, bladeType: "sonstiges" });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).bladeTypeOther).toBeDefined();
    expect(inquirySchema.safeParse({ ...validSharpening, bladeType: "sonstiges", bladeTypeOther: "Beil" }).success).toBe(true);
  });

  it("verlangt die Einwilligung", () => {
    const result = inquirySchema.safeParse({ ...validSharpening, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).consent).toBeDefined();
  });

  it("lehnt unbekannte Auswahlwerte ab", () => {
    expect(inquirySchema.safeParse({ ...validSharpening, bladeType: "kettensaege" }).success).toBe(false);
  });
});

describe("Maßarbeit-Anfrage", () => {
  it("akzeptiert gültige Eingaben", () => {
    expect(inquirySchema.safeParse(validCustom).success).toBe(true);
  });

  it("verlangt Umfang, Material und eine ausreichend lange Beschreibung", () => {
    const result = inquirySchema.safeParse({ ...validCustom, scope: [], materials: [], description: "kurz" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors.scope).toBeDefined();
      expect(errors.materials).toBeDefined();
      expect(errors.description).toContain("mindestens");
    }
  });

  it("akzeptiert die Produkte aus dem zentralen Katalog als Ausgangsprodukt", () => {
    for (const baseProduct of ["funke", "esse", "zunder", "neues-messer", "offen"]) {
      expect(inquirySchema.safeParse({ ...validCustom, baseProduct }).success).toBe(true);
    }
  });
});

describe("Kontaktformular", () => {
  it("validiert Nachricht, Name und E-Mail", () => {
    expect(inquirySchema.safeParse({ type: "contact", message: "Hallo, eine Frage zu Zunder.", ...base }).success).toBe(true);
    expect(inquirySchema.safeParse({ type: "contact", message: "kurz", ...base }).success).toBe(false);
  });
});

describe("Hilfsfunktionen", () => {
  it("parseDecimal versteht Komma und Punkt", () => {
    expect(parseDecimal("12,5")).toBe(12.5);
    expect(parseDecimal(" 20 ")).toBe(20);
    expect(parseDecimal("1.5")).toBe(1.5);
    expect(parseDecimal("")).toBeUndefined();
    expect(parseDecimal("abc")).toBeUndefined();
    expect(parseDecimal("-3")).toBeUndefined();
  });
});
