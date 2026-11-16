"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { AlertIcon, InfoIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/money";
import { CartLineItem } from "./CartLineItem";
import { CartTotals } from "./CartTotals";
import { useCart } from "./CartProvider";

/** Vollseitiger Warenkorb mit Mengenänderung, Entfernen, Summen und fester Kassenleiste auf dem Smartphone. */
export function CartView() {
  const { summary, ready, persistent, clear } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const empty = summary.lines.length === 0;

  if (!ready) {
    return (
      <div className="wrap py-20" aria-busy="true">
        <p className="text-fog">Warenkorb wird geladen …</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="wrap py-16 sm:py-24" data-testid="cart-empty">
        <p className="font-display text-3xl font-semibold sm:text-4xl">Dein Warenkorb ist leer.</p>
        <p className="prose-copy mt-4 text-fog">Die Messer sind einzeln gefertigte Beispielprodukte. Schau dir eines in Ruhe an.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/messer" size="lg">
            Messer entdecken
          </ButtonLink>
          <ButtonLink href="/schaerfservice#anfrage" variant="secondary" size="lg">
            Schärfservice anfragen
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap pb-32 lg:pb-24">
      {!persistent ? (
        <p className="mb-6 flex gap-3 rounded-[3px] border border-ember/60 p-4 text-[0.9375rem]">
          <AlertIcon size={20} className="mt-0.5 shrink-0 text-ember-soft" />
          Dein Browser blockiert das Speichern. Der Warenkorb bleibt nur bis zum Neuladen der Seite erhalten.
        </p>
      ) : null}
      {summary.issues.length > 0 ? (
        <p className="mb-6 flex gap-3 rounded-[3px] border border-copper/50 p-4 text-[0.9375rem]">
          <InfoIcon size={20} className="mt-0.5 shrink-0 text-copper" />
          {summary.issues.map((i) => i.message).join(" ")}
        </p>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ul className="divide-y divide-bone/10 border-y border-bone/10" aria-label="Positionen im Warenkorb" data-testid="cart-lines">
            {summary.lines.map((line) => (
              <CartLineItem key={line.key} line={line} />
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/messer" className="inline-flex min-h-11 items-center text-[0.9375rem] underline underline-offset-4 hover:text-copper">
              Weitere Messer ansehen
            </Link>
            {confirmClear ? (
              <span className="flex flex-wrap items-center gap-2 text-sm">
                Warenkorb wirklich leeren?
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    clear();
                    setConfirmClear(false);
                  }}
                >
                  Ja, leeren
                </Button>
                <Button size="md" variant="ghost" onClick={() => setConfirmClear(false)}>
                  Abbrechen
                </Button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex min-h-11 items-center text-[0.9375rem] text-fog underline underline-offset-4 hover:text-ember-soft"
              >
                Warenkorb leeren
              </button>
            )}
          </div>
        </div>

        <aside className="lg:col-span-5" aria-labelledby="summary-title">
          <div className="surface-hammered rounded-[3px] border border-bone/15 bg-forge p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 id="summary-title" className="font-display text-2xl font-semibold">
              Zusammenfassung
            </h2>
            <CartTotals summary={summary} className="mt-5" />
            <div className="mt-6 space-y-3">
              <ButtonLink href="/kasse" size="lg" full>
                Weiter zur Demo-Kasse
              </ButtonLink>
              <p className="text-[0.8125rem] text-fog">
                Die Kasse ist ein Demo-Durchlauf: Es wird nichts bestellt und nichts bezahlt.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Kassenleiste */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bone/15 bg-coal/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div>
            <p className="text-xs text-fog">Gesamtsumme</p>
            <p className="font-display text-xl font-semibold tabular-nums">{formatPrice(summary.totalCents)}</p>
          </div>
          <ButtonLink href="/kasse" className="ml-auto">
            Zur Demo-Kasse
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
