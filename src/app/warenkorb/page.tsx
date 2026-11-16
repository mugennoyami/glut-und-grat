import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = { title: "Warenkorb" };

export default function CartPage() {
  return (
    <>
      <section className="wrap pb-8 pt-12 sm:pt-16">
        <p className="eyebrow text-copper">Shop</p>
        <h1 className="display mt-3 text-[clamp(2.75rem,7vw,4.5rem)]">Warenkorb</h1>
      </section>
      <CartView />
    </>
  );
}
