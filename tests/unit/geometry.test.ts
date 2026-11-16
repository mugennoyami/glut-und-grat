import { describe, expect, it } from "vitest";
import { products } from "@/content/products";
import { buildKnife } from "@/components/art/knife-geometry";

describe("Messer-Geometrie", () => {
  for (const p of products) {
    it(`${p.name}: Klinge hat nie negative Höhe und läuft in einer Spitze aus`, () => {
      const g = buildKnife(p.specs, p.art);
      for (const s of g.blade) expect(s.h).toBeGreaterThanOrEqual(0);
      expect(g.blade[g.blade.length - 1]!.h).toBeLessThan(0.05);
      expect(g.blade[0]!.h).toBeCloseTo(p.art.bladeHeightMm, 1);
    });

    it(`${p.name}: Maße entsprechen den Produktdaten`, () => {
      const g = buildKnife(p.specs, p.art);
      expect(g.overall).toBe(p.specs.overallLengthMm);
      expect(g.bladeLen).toBe(p.specs.bladeLengthMm);
      expect(g.handleLen).toBe(p.specs.overallLengthMm - p.specs.bladeLengthMm);
      expect(g.pins).toHaveLength(p.art.pins);
      expect(g.lanyard !== undefined).toBe(Boolean(p.art.lanyardHole));
      expect(g.paths.silhouette).not.toContain("NaN");
    });
  }
});
