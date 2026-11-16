import { describe, expect, it } from "vitest";
import { products } from "@/content/products";
import { addLine, removeLine, sanitizeStoredLines, setLineQuantity } from "@/lib/cart/operations";
import { defaultSelection, lineKey, priceCart } from "@/lib/cart/pricing";
import type { CartLine } from "@/lib/cart/types";
import { formatPrice } from "@/lib/money";

const funke = products.find((p) => p.slug === "funke")!;
const esse = products.find((p) => p.slug === "esse")!;
const zunder = products.find((p) => p.slug === "zunder")!;

const nbsp = (s: string) => s.replace(/\u00a0/g, " ");

describe("Preisformat", () => {
  it("formatiert Cent als Euro mit deutschem Format", () => {
    expect(nbsp(formatPrice(9800))).toBe("98,00 €");
    expect(nbsp(formatPrice(590))).toBe("5,90 €");
    expect(nbsp(formatPrice(123456))).toBe("1.234,56 €");
  });
});

describe("priceCart", () => {
  it("leerer Warenkorb: keine Versandkosten, Summe 0", () => {
    const s = priceCart([]);
    expect(s.subtotalCents).toBe(0);
    expect(s.shippingCents).toBe(0);
    expect(s.totalCents).toBe(0);
    expect(s.itemCount).toBe(0);
  });

  it("berechnet Grundpreis, Aufpreise, Menge, Versand und Summe korrekt", () => {
    const lines: CartLine[] = [
      { productId: "funke", options: { griff: "raeuchereiche", etui: "natur" }, quantity: 2 }, // 98 + 6 + 19 = 123 → 246
      { productId: "esse", options: { griff: "walnuss", schutz: "ohne" }, quantity: 1 }, // 168
    ];
    const s = priceCart(lines);
    expect(s.lines).toHaveLength(2);
    expect(s.lines[0]!.unitPriceCents).toBe(12300);
    expect(s.lines[0]!.lineTotalCents).toBe(24600);
    expect(s.lines[1]!.lineTotalCents).toBe(16800);
    expect(s.subtotalCents).toBe(41400);
    expect(s.shippingCents).toBe(590);
    expect(s.totalCents).toBe(41990);
    expect(s.itemCount).toBe(3);
  });

  it("verwendet Standardwerte für fehlende Optionen", () => {
    const s = priceCart([{ productId: "zunder", options: {}, quantity: 1 }]);
    expect(s.issues).toEqual([]);
    expect(s.lines[0]!.unitPriceCents).toBe(zunder.basePriceCents);
  });

  it("verwirft unbekannte Produkte, Optionen und Werte", () => {
    const s = priceCart([
      { productId: "gibt-es-nicht", options: {}, quantity: 1 },
      { productId: "funke", options: { farbe: "rot" }, quantity: 1 },
      { productId: "funke", options: { griff: "ebenholz" }, quantity: 1 },
    ]);
    expect(s.lines).toHaveLength(0);
    expect(s.issues.map((i) => i.code)).toEqual(["unknown_product", "unknown_option", "unknown_option_value"]);
  });

  it("verwirft nicht verfügbare Varianten", () => {
    const s = priceCart([{ productId: "esse", options: { griff: "esche" }, quantity: 1 }]);
    expect(s.lines).toHaveLength(0);
    expect(s.issues[0]!.code).toBe("option_unavailable");
  });

  it("begrenzt die Menge auf das Maximum und meldet es", () => {
    const s = priceCart([{ productId: "esse", options: {}, quantity: 99 }]);
    expect(s.lines[0]!.quantity).toBe(esse.maxQuantity);
    expect(s.issues[0]!.code).toBe("quantity_reduced");
  });

  it("lehnt ungültige Mengen ab (0, negativ, Bruchzahl)", () => {
    for (const quantity of [0, -1, 1.5, Number.NaN]) {
      const s = priceCart([{ productId: "funke", options: {}, quantity }]);
      expect(s.lines).toHaveLength(0);
      expect(s.issues[0]!.code).toBe("invalid_quantity");
    }
  });

  it("fasst identische Positionen zusammen", () => {
    const s = priceCart([
      { productId: "funke", options: {}, quantity: 1 },
      { productId: "funke", options: { griff: "walnuss", etui: "ohne" }, quantity: 2 },
    ]);
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]!.quantity).toBe(3);
  });

  it("versandkostenfrei, wenn eine Grenze konfiguriert und erreicht ist", () => {
    const lines: CartLine[] = [{ productId: "esse", options: {}, quantity: 1 }];
    const below = priceCart(lines, { shipping: { flatRateCents: 590, freeFromCents: 20000 } });
    expect(below.shippingCents).toBe(590);
    expect(below.freeShippingRemainingCents).toBe(20000 - 16800);
    const reached = priceCart(lines, { shipping: { flatRateCents: 590, freeFromCents: 16800 } });
    expect(reached.shippingCents).toBe(0);
    expect(reached.totalCents).toBe(16800);
    expect(reached.freeShippingRemainingCents).toBeNull();
  });

  it("rechnet nie mit Fließkomma: Summen sind ganze Cent-Beträge", () => {
    const s = priceCart(products.map((p) => ({ productId: p.slug, options: defaultSelection(p), quantity: 3 })));
    for (const n of [s.subtotalCents, s.shippingCents, s.totalCents, ...s.lines.map((l) => l.lineTotalCents)]) {
      expect(Number.isInteger(n)).toBe(true);
    }
  });
});

describe("Warenkorb-Operationen", () => {
  it("fügt hinzu, erhöht bei gleicher Auswahl und trennt verschiedene Varianten", () => {
    let lines: CartLine[] = [];
    lines = addLine(lines, funke, { griff: "walnuss" });
    lines = addLine(lines, funke, { griff: "walnuss", etui: "ohne" });
    lines = addLine(lines, funke, { griff: "raeuchereiche" });
    expect(lines).toHaveLength(2);
    expect(lines[0]!.quantity).toBe(2);
    expect(lines[1]!.options.griff).toBe("raeuchereiche");
  });

  it("begrenzt Mengen beim Hinzufügen", () => {
    let lines: CartLine[] = [];
    for (let i = 0; i < 10; i += 1) lines = addLine(lines, esse, {});
    expect(lines[0]!.quantity).toBe(esse.maxQuantity);
  });

  it("ignoriert nicht verfügbare Varianten", () => {
    const lines = addLine([], esse, { griff: "esche" });
    expect(lines).toEqual([]);
  });

  it("ändert Mengen, entfernt bei 0 und begrenzt nach oben", () => {
    let lines = addLine([], funke, {});
    const key = lineKey("funke", lines[0]!.options);
    lines = setLineQuantity(lines, key, 4);
    expect(lines[0]!.quantity).toBe(4);
    lines = setLineQuantity(lines, key, 50);
    expect(lines[0]!.quantity).toBe(funke.maxQuantity);
    lines = setLineQuantity(lines, key, 0);
    expect(lines).toEqual([]);
  });

  it("entfernt Positionen gezielt", () => {
    let lines = addLine([], funke, {});
    lines = addLine(lines, esse, {});
    lines = removeLine(lines, lineKey("funke", lines[0]!.options));
    expect(lines).toHaveLength(1);
    expect(lines[0]!.productId).toBe("esse");
  });

  it("bereinigt gespeicherte Daten und verwirft Unpassendes", () => {
    const stored = [
      { productId: "funke", options: { griff: "walnuss" }, quantity: 2 },
      { productId: "gelöscht", options: {}, quantity: 1 },
      { productId: "esse", options: { griff: "esche" }, quantity: 1 },
      { productId: "zunder", options: {}, quantity: 1000 },
      { productId: "zunder", options: {}, quantity: "3" },
      null,
      "text",
    ];
    const clean = sanitizeStoredLines(stored);
    expect(clean.map((l) => l.productId)).toEqual(["funke", "zunder"]);
    expect(clean[1]!.quantity).toBe(zunder.maxQuantity);
    expect(sanitizeStoredLines("kaputt")).toEqual([]);
    expect(sanitizeStoredLines(undefined)).toEqual([]);
  });
});
