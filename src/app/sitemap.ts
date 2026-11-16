import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/messer", "/schaerfservice", "/massarbeit", "/werkstatt", "/kontakt", "/impressum", "/datenschutz", "/agb", "/widerruf"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...products.map((p) => ({ url: `${site.url}/messer/${p.slug}` })),
  ];
}
