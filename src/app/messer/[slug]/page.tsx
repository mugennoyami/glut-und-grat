import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { ProductShowcase } from "@/components/shop/ProductShowcase";
import { ProductView } from "@/components/shop/ProductView";
import { getProduct, products } from "@/content/products";

type Params = { slug: string };

/** Nur die Produkte aus dem Katalog; alles andere ist 404 (nötig für den statischen Export). */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.seo.title, description: product.seo.description };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <ProductView product={product} />
      <ProductDetails product={product} />
      <section className="wrap py-16 lg:py-24" aria-labelledby="more-title">
        <p className="eyebrow text-copper">Weitere Messer</p>
        <h2 id="more-title" className="display mt-3 text-4xl sm:text-5xl">
          Daneben liegen noch zwei.
        </h2>
        <div className="mt-14">
          <ProductShowcase products={others} />
        </div>
      </section>
    </>
  );
}
