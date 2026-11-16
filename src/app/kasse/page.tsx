import type { Metadata } from "next";
import { CheckoutView } from "@/components/shop/CheckoutView";

export const metadata: Metadata = { title: "Demo-Kasse" };

export default function CheckoutPage() {
  return (
    <>
      <section className="wrap pb-8 pt-12 sm:pt-16">
        <p className="eyebrow text-ember-soft">Demo</p>
        <h1 className="display mt-3 text-[clamp(2.75rem,7vw,4.5rem)]">Kasse</h1>
      </section>
      <CheckoutView />
    </>
  );
}
