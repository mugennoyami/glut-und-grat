import { describe, expect, it } from "vitest";
import { materials } from "@/content/materials";
import { products } from "@/content/products";
import { emptyCheckoutValues, validateCheckout } from "@/lib/commerce/checkout-form";
import { inquiryToText } from "@/lib/inquiries/format";
import { inquirySchema } from "@/lib/inquiries/schemas";
import { formatPriceCompact, formatSignedPrice } from "@/lib/money";
import { startingPriceCents } from "@/lib/products";
import { appearanceFor } from "@/lib/cart/appearance";
import { defaultSelection, resolveSelection } from "@/lib/cart/pricing";

const nbsp = (s: string) => s.replace(/\u00a0/g, " ");

describe("Katalog (zentrale Produktdaten)", () => {
  it("hat höchstens drei Messer mit eindeutigen Slugs", () => {
    expect(products.length).toBeLessThanOrEqual(3);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  for (const p of products) {
    it(`${p.name}: Pflichtangaben vollständig und Standardwahl bestellbar`, () => {
      expect(p.basePriceCents).toBeGreaterThan(0);
      expect(Number.isInteger(p.basePriceCents)).toBe(true);
      expect(p.specs.bladeLengthMm).toBeLessThan(p.specs.overallLengthMm);
      expect(p.care.length).toBeGreaterThan(0);
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.availability.label).toMatch(/Beispiel/);
      expect(p.specs.steel).toMatch(/Beispiel/);
      expect(resolveSelection(p, defaultSelection(p)).ok).toBe(true);
      for (const option of p.options) {
        const def = option.values.find((v) => v.id === option.defaultValueId);
        expect(def?.available).toBe(true);
        for (const v of option.values) if (v.materialId) expect(materials[v.materialId]).toBeDefined();
      }
    });
  }

  it("Startpreis = günstigste verfügbare Konfiguration", () => {
    const esse = products.find((p) => p.slug === "esse")!;
    expect(startingPriceCents(esse)).toBe(16800);
    expect(startingPriceCents(products.find((p) => p.slug === "zunder")!)).toBe(19800);
  });

  it("Illustration folgt der Variantenauswahl", () => {
    const zunder = products.find((p) => p.slug === "zunder")!;
    expect(appearanceFor(zunder, { griff: "raeuchereiche", scheide: "schwarz" })).toEqual({
      handleMaterialId: "raeuchereiche",
      sheathMaterialId: "leder-schwarz",
    });
    const funke = products.find((p) => p.slug === "funke")!;
    expect(appearanceFor(funke, defaultSelection(funke)).sheathMaterialId).toBeUndefined();
  });
});

describe("Formatierung", () => {
  it("kompakte Preise und Aufpreise", () => {
    expect(nbsp(formatPriceCompact(9800))).toBe("98 €");
    expect(nbsp(formatPriceCompact(9850))).toBe("98,50 €");
    expect(nbsp(formatSignedPrice(1900))).toBe("+ 19,00 €");
    expect(nbsp(formatSignedPrice(-500))).toBe("− 5,00 €");
    expect(formatSignedPrice(0)).toBe("inklusive");
  });
});

describe("Demo-Kasse: Validierung", () => {
  const valid = { name: "Erika Beispiel", email: "erika@beispiel.de", street: "Musterweg 1", zip: "12345", city: "Musterstadt", country: "Deutschland", understood: true };

  it("akzeptiert vollständige Eingaben", () => {
    expect(validateCheckout(valid)).toEqual({});
  });

  it("meldet alle fehlenden Felder", () => {
    const errors = validateCheckout(emptyCheckoutValues);
    expect(Object.keys(errors).sort()).toEqual(["city", "email", "name", "street", "understood", "zip"]);
  });

  it("prüft PLZ und E-Mail-Format", () => {
    expect(validateCheckout({ ...valid, zip: "1234" }).zip).toBeDefined();
    expect(validateCheckout({ ...valid, zip: "12a45" }).zip).toBeDefined();
    expect(validateCheckout({ ...valid, email: "kein-at" }).email).toBeDefined();
  });
});

describe("Anfrage als Text", () => {
  it("fasst eine Schärfanfrage lesbar zusammen", () => {
    const parsed = inquirySchema.parse({
      type: "sharpening",
      bladeType: "schwert",
      quantity: 1,
      bladeLengthCm: 72.5,
      condition: "rost",
      wishes: "Einhändig geführt.",
      name: "Erika Beispiel",
      email: "erika@beispiel.de",
      consent: true,
    });
    const { consent, website, ...data } = parsed;
    void consent;
    void website;
    const text = inquiryToText(data);
    expect(text).toContain("Anfrage Schärfservice");
    expect(text).toContain("Klingentyp: Schwert");
    expect(text).toContain("Ungefähre Klingenlänge: 72.5 cm");
    expect(text).toContain("Zustand: Rost oder starke Beschädigungen");
    expect(text).toContain("E-Mail: erika@beispiel.de");
  });
});
