import type { Product } from "@/content/types";

/** Welche Materialien zeigt die Illustration für die aktuelle Variantenauswahl? */
export function appearanceFor(
  product: Product,
  selection: Record<string, string>,
): { handleMaterialId?: string; sheathMaterialId?: string } {
  const result: { handleMaterialId?: string; sheathMaterialId?: string } = {};
  for (const option of product.options) {
    const value = option.values.find((v) => v.id === (selection[option.id] ?? option.defaultValueId));
    if (!value?.materialId) continue;
    if (option.role === "handle") result.handleMaterialId = value.materialId;
    if (option.role === "sheath") result.sheathMaterialId = value.materialId;
  }
  return result;
}
