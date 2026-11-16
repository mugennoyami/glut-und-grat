"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { SideDialog } from "@/components/ui/SideDialog";
import { CartLineItem } from "./CartLineItem";
import { CartTotals } from "./CartTotals";
import { useCart } from "./CartProvider";

/** Warenkorb-Schublade: öffnet sich nach „In den Warenkorb“ und über das Warenkorb-Symbol. */
export function CartDrawer() {
  const { drawerOpen, closeDrawer, summary, ready, persistent, announcement } = useCart();
  const empty = summary.lines.length === 0;

  return (
    <>
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
      <SideDialog
        id="cart-drawer"
        open={drawerOpen}
        onClose={closeDrawer}
        title="Warenkorb"
        headerExtra={
          summary.itemCount > 0 ? (
            <span className="rounded-full bg-anthracite px-2.5 py-1 text-xs font-semibold tabular-nums text-fog">
              {summary.itemCount} {summary.itemCount === 1 ? "Artikel" : "Artikel"}
            </span>
          ) : null
        }
      >
        {!drawerOpen ? null : !ready || empty ? (
          <div className="flex flex-1 flex-col justify-center px-6 py-10">
            <p className="font-display text-2xl font-semibold">Dein Warenkorb ist leer.</p>
            <p className="mt-2 max-w-sm text-fog">Die Messer sind einzeln gefertigte Beispielprodukte. Schau dir eines in Ruhe an.</p>
            <div className="mt-6">
              <Link href="/messer" className={buttonClass({ variant: "primary" })} onClick={closeDrawer}>
                Messer entdecken
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-bone/10 overflow-y-auto px-5" aria-label="Positionen im Warenkorb">
              {summary.lines.map((line) => (
                <CartLineItem key={line.key} line={line} compact />
              ))}
            </ul>
            <div className="space-y-4 border-t border-bone/10 bg-coal/60 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
              {!persistent ? (
                <p className="rounded-[3px] border border-ember/50 p-3 text-sm text-bone">
                  Dein Browser blockiert das Speichern. Der Warenkorb bleibt nur bis zum Neuladen erhalten.
                </p>
              ) : null}
              <CartTotals summary={summary} />
              <div className="grid gap-2.5">
                <Link href="/kasse" className={buttonClass({ variant: "primary", size: "lg", full: true })}>
                  Zur Demo-Kasse
                </Link>
                <Link href="/warenkorb" className={buttonClass({ variant: "secondary", full: true })}>
                  Warenkorb ansehen
                </Link>
              </div>
            </div>
          </>
        )}
      </SideDialog>
    </>
  );
}
