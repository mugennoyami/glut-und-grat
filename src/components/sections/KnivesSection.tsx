import Link from "next/link";
import { ProductShowcase } from "@/components/shop/ProductShowcase";
import { ArrowRightIcon } from "@/components/ui/icons";
import { knivesSection } from "@/content/pages";
import { products } from "@/content/products";
import { SectionHead } from "./SectionHead";

export function KnivesSection() {
  return (
    <section id="messer" className="wrap py-24 sm:py-32" aria-labelledby="knives-title">
      <div className="mb-16 flex flex-col justify-between gap-6 sm:mb-20 lg:flex-row lg:items-end">
        <SectionHead id="knives-title" {...knivesSection} className="max-w-3xl" />
        <Link href="/messer" className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold underline underline-offset-[6px] hover:text-copper">
          Alle Messer ansehen <ArrowRightIcon size={18} />
        </Link>
      </div>
      <ProductShowcase products={products} />
    </section>
  );
}
