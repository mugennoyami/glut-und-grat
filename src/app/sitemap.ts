import type { MetadataRoute } from "next";
import { collections } from "@/content/collections";
import { products } from "@/content/products";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/ruestkammer", "/messer", "/schaerfservice", "/massarbeit", "/werkstatt", "/kontakt", "/impressum", "/datenschutz", "/agb", "/widerruf"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...collections.map((c) => ({ url: `${site.url}/ruestkammer/${c.slug}` })),
    ...products.map((p) => ({ url: `${site.url}/messer/${p.slug}` })),
  ];
}
