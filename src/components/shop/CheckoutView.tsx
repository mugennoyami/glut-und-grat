"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ConsentField, SelectField, TextField } from "@/components/forms/fields";
import { ErrorSummary, FormSection } from "@/components/forms/FormParts";
import { Button, ButtonLink } from "@/components/ui/Button";
import { AlertIcon, CheckIcon } from "@/components/ui/icons";
import { shopConfig } from "@/content/shop";
import type { QuoteDto } from "@/lib/commerce/request";
import { emptyCheckoutValues, validateCheckout, type CheckoutValues as Values } from "@/lib/commerce/checkout-form";
import { formatPrice } from "@/lib/money";
import { priceCart } from "@/lib/cart/pricing";
import { toQuoteDto } from "@/lib/commerce/request";
import { STATIC_EXPORT } from "@/lib/runtime";
import { useCart } from "./CartProvider";
import { CartTotals } from "./CartTotals";

type QuoteState =
  | { state: "loading" }
  | { state: "ok"; quote: QuoteDto }
  | { state: "error" };

type Result = { state: "idle" } | { state: "sending" } | { state: "done"; message: string; quote: QuoteDto } | { state: "error"; message: string };

/**
 * Demo-Kasse. Die Summen kommen vom Server (/api/checkout/quote), der den Warenkorb gegen den Katalog neu berechnet.
 * Kontakt- und Adressdaten bleiben ausschließlich im Arbeitsspeicher dieses Tabs: Sie werden weder gespeichert
 * noch an den Server gesendet. Ein echter Zahlungsanbieter würde die Daten auf seiner eigenen Bezahlseite erfassen.
 */
export function CheckoutView() {
  const { lines, summary, ready, clear } = useCart();
  const [values, setValues] = useState<Values>(emptyCheckoutValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusKey, setFocusKey] = useState(0);
  const [serverQuote, setServerQuote] = useState<QuoteState>({ state: "loading" });
  const [result, setResult] = useState<Result>({ state: "idle" });

  const linesKey = useMemo(() => JSON.stringify(lines), [lines]);

  // Statische Demo ohne Server: dieselbe Preislogik, im Browser berechnet (abgeleitet, kein Effekt nötig).
  const staticQuote = useMemo<QuoteState>(
    () => (STATIC_EXPORT && lines.length > 0 ? { state: "ok", quote: toQuoteDto(priceCart(lines)) } : { state: "loading" }),
    [lines],
  );
  const quote: QuoteState = STATIC_EXPORT ? staticQuote : serverQuote;

  useEffect(() => {
    if (STATIC_EXPORT) return;
    if (!ready) return;
    if (lines.length === 0) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServerQuote({ state: "loading" });
    fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lines }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((body: { ok?: boolean; quote?: QuoteDto }) => {
        if (body.ok && body.quote) setServerQuote({ state: "ok", quote: body.quote });
        else setServerQuote({ state: "error" });
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setServerQuote({ state: "error" });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey, ready]);

  const patch = (p: Partial<Values>) => setValues((v) => ({ ...v, ...p }));

  if (!ready) {
    return (
      <div className="wrap py-20" aria-busy="true">
        <p className="text-fog">Kasse wird geladen …</p>
      </div>
    );
  }

  if (result.state === "done") {
    return (
      <div className="wrap-narrow py-16 sm:py-24" data-testid="demo-done">
        <p className="inline-flex items-center gap-2 rounded-[2px] bg-ember px-2 py-1 text-xs font-bold uppercase tracking-[0.14em] text-coal">Demo</p>
        <h2 className="display mt-5 text-4xl sm:text-5xl">Demo-Durchlauf abgeschlossen.</h2>
        <p className="prose-copy mt-5 text-lg">{result.message}</p>
        <ul className="mt-6 space-y-2 text-bone/90">
          <li className="flex gap-3">
            <CheckIcon size={20} className="mt-1 shrink-0 text-copper" /> Es wurde keine Bestellung angelegt.
          </li>
          <li className="flex gap-3">
            <CheckIcon size={20} className="mt-1 shrink-0 text-copper" /> Es wurde keine Zahlung ausgelöst.
          </li>
          <li className="flex gap-3">
            <CheckIcon size={20} className="mt-1 shrink-0 text-copper" /> Deine Eingaben wurden weder gesendet noch gespeichert.
          </li>
        </ul>
        <div className="mt-8 rounded-[3px] border border-bone/15 bg-forge p-5">
          <p className="eyebrow text-fog">Warenkorb dieses Durchlaufs (Beispielpreise)</p>
          <ul className="mt-3 divide-y divide-bone/10">
            {result.quote.lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-4 py-2.5">
                <span>
                  {l.quantity} × {l.name}
                  <span className="block text-sm text-fog">{l.selections.map((s) => s.valueLabel).join(", ")}</span>
                </span>
                <span className="tabular-nums">{formatPrice(l.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <CartTotals summary={{ ...result.quote, freeShippingRemainingCents: null }} className="mt-4" />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/messer">Zurück zu den Messern</ButtonLink>
          <Button variant="secondary" onClick={() => clear()}>
            Warenkorb leeren
          </Button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="wrap py-16 sm:py-24" data-testid="checkout-empty">
        <p className="font-display text-3xl font-semibold">Es liegt nichts im Warenkorb.</p>
        <p className="prose-copy mt-3 text-fog">Lege zuerst ein Messer in den Warenkorb, um die Demo-Kasse zu testen.</p>
        <div className="mt-6">
          <ButtonLink href="/messer">Messer entdecken</ButtonLink>
        </div>
      </div>
    );
  }

  const serverSummary = quote.state === "ok" ? quote.quote : null;
  const display = serverSummary ?? { ...summary, lines: [] as QuoteDto["lines"] };
  const canSubmit = quote.state === "ok" && quote.quote.lines.length > 0 && result.state !== "sending";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateCheckout(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setFocusKey((k) => k + 1);
      return;
    }
    setErrors({});
    if (STATIC_EXPORT) {
      const local = toQuoteDto(priceCart(lines));
      if (local.lines.length === 0 || local.issues.some((i) => i.code !== "quantity_reduced")) {
        setResult({ state: "error", message: "Der Warenkorb enthält Positionen, die nicht (mehr) bestellbar sind. Bitte prüfe ihn." });
        return;
      }
      setValues(emptyCheckoutValues);
      setResult({
        state: "done",
        message: "Statische Demo ohne Server: Es wurde nichts übermittelt, keine Bestellung angelegt und keine Zahlung ausgelöst.",
        quote: local,
      });
      return;
    }
    setResult({ state: "sending" });
    try {
      // Es werden ausschließlich Positionen gesendet – keine Preise, keine persönlichen Daten.
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        mode?: "demo" | "live";
        message?: string;
        redirectUrl?: string;
        quote?: QuoteDto;
        code?: string;
      };
      if (response.ok && body.ok && body.mode === "live" && body.redirectUrl && body.redirectUrl.startsWith("https://")) {
        window.location.assign(body.redirectUrl);
        return;
      }
      if (response.ok && body.ok && body.mode === "demo" && body.quote) {
        setValues(emptyCheckoutValues);
        setResult({ state: "done", message: body.message ?? "Demo-Durchlauf abgeschlossen.", quote: body.quote });
        return;
      }
      setResult({
        state: "error",
        message:
          body.code === "cart_invalid" || body.code === "empty_cart"
            ? "Der Warenkorb enthält Positionen, die nicht (mehr) bestellbar sind. Bitte prüfe ihn."
            : "Die Kasse ist gerade nicht verfügbar. Es wurde nichts ausgelöst.",
      });
    } catch {
      setResult({ state: "error", message: "Es besteht keine Verbindung zum Server. Es wurde nichts ausgelöst." });
    }
  };

  return (
    <div className="wrap pb-24">
      <div role="note" className="mb-10 rounded-[3px] border-2 border-ember bg-ember/10 p-5" data-testid="demo-banner">
        <p className="flex items-center gap-2.5 font-display text-2xl font-semibold">
          <AlertIcon size={24} className="shrink-0 text-ember-soft" />
          Demo-Kasse – keine echte Bestellung
        </p>
        <p className="mt-2 max-w-3xl text-bone/90">
          Hier wird nichts bestellt und nichts bezahlt. Bitte gib <strong>keine echten Zahlungsdaten</strong> ein. Was du einträgst, bleibt nur in diesem
          Tab im Arbeitsspeicher und wird nirgends gespeichert oder gesendet.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <form onSubmit={onSubmit} noValidate className="space-y-8 lg:col-span-7">
          <ErrorSummary errors={errors} focusKey={focusKey} />

          <FormSection title="Kontakt (Demo)">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Name" name="name" autoComplete="off" required value={values.name} onChange={(e) => patch({ name: e.target.value })} error={errors.name} />
              <TextField
                label="E-Mail-Adresse"
                name="email"
                type="email"
                autoComplete="off"
                required
                value={values.email}
                onChange={(e) => patch({ email: e.target.value })}
                error={errors.email}
              />
            </div>
          </FormSection>

          <FormSection title="Lieferadresse (Demo)">
            <TextField label="Straße und Hausnummer" name="street" autoComplete="off" required value={values.street} onChange={(e) => patch({ street: e.target.value })} error={errors.street} />
            <div className="grid gap-5 sm:grid-cols-[9rem_1fr]">
              <TextField
                label="PLZ"
                name="zip"
                inputMode="numeric"
                autoComplete="off"
                required
                value={values.zip}
                onChange={(e) => patch({ zip: e.target.value })}
                error={errors.zip}
              />
              <TextField label="Ort" name="city" autoComplete="off" required value={values.city} onChange={(e) => patch({ city: e.target.value })} error={errors.city} />
            </div>
            <SelectField
              label="Land"
              name="country"
              required
              options={shopConfig.shipping.countries.map((c) => ({ value: c, label: c }))}
              value={values.country}
              onChange={(e) => patch({ country: e.target.value })}
              error={errors.country}
              hint="Versandländer sind noch nicht festgelegt (Beispiel)."
            />
          </FormSection>

          <FormSection title="Zahlung">
            <p className="rounded-[3px] border border-bone/25 p-4 text-[0.9375rem]">
              <strong>Demo-Zahlung.</strong> Es gibt keine Zahlungsart und keine Eingabe von Karten- oder Kontodaten. Ein Zahlungsanbieter ist noch nicht angebunden.
            </p>
            <ConsentField name="understood" checked={values.understood} onChange={(v) => patch({ understood: v })} error={errors.understood}>
              Ich weiß, dass dies ein Demo-Durchlauf ist: keine Bestellung, keine Zahlung, kein Vertrag.
            </ConsentField>
          </FormSection>

          <div className="space-y-4">
            <Button type="submit" size="lg" disabled={!canSubmit} data-testid="demo-submit">
              {result.state === "sending" ? "Wird geprüft …" : "Demo-Durchlauf abschließen"}
            </Button>
            {result.state === "error" ? (
              <p role="alert" className="flex gap-2 text-ember-soft">
                <AlertIcon size={18} className="mt-1 shrink-0" />
                {result.message}
              </p>
            ) : null}
            <p className="text-[0.8125rem] text-fog">
              Rechtliche Angaben (AGB, Widerruf, Datenschutz) sind noch Platzhalter: <Link href="/agb" className="underline underline-offset-4 hover:text-copper">AGB</Link>,{" "}
              <Link href="/widerruf" className="underline underline-offset-4 hover:text-copper">Widerruf</Link>,{" "}
              <Link href="/datenschutz" className="underline underline-offset-4 hover:text-copper">Datenschutz</Link>.
            </p>
          </div>
        </form>

        <aside className="lg:col-span-5" aria-labelledby="co-summary">
          <div className="surface-hammered rounded-[3px] border border-bone/15 bg-forge p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 id="co-summary" className="font-display text-2xl font-semibold">
              Dein Warenkorb
            </h2>
            {quote.state === "loading" ? (
              <p className="mt-4 text-fog" role="status">
                {STATIC_EXPORT ? "Warenkorb wird geprüft …" : "Warenkorb wird serverseitig geprüft …"}
              </p>
            ) : null}
            {quote.state === "error" ? (
              <p className="mt-4 text-ember-soft" role="alert">
                Die Prüfung ist fehlgeschlagen. Bitte lade die Seite neu.
              </p>
            ) : null}
            {serverSummary ? (
              <>
                <ul className="mt-4 divide-y divide-bone/10" aria-label="Positionen">
                  {serverSummary.lines.map((l) => (
                    <li key={l.key} className="flex justify-between gap-4 py-3">
                      <span>
                        <span className="font-medium">
                          {l.quantity} × {l.name}
                        </span>
                        <span className="block text-sm text-fog">{l.selections.map((s) => s.valueLabel).join(", ")}</span>
                      </span>
                      <span className="tabular-nums">{formatPrice(l.lineTotalCents)}</span>
                    </li>
                  ))}
                </ul>
                {serverSummary.issues.length > 0 ? (
                  <p className="mt-3 text-sm text-copper">{serverSummary.issues.map((i) => i.message).join(" ")}</p>
                ) : null}
                <CartTotals summary={{ ...display, freeShippingRemainingCents: null }} className="mt-5" />
                <p className="mt-3 text-xs text-fog">
                  {STATIC_EXPORT
                    ? "Summen im Browser aus den Katalogdaten berechnet (statische Demo ohne Server)."
                    : "Summen vom Server aus den Katalogdaten berechnet."}
                </p>
              </>
            ) : null}
            <Link href="/warenkorb" className="mt-5 inline-flex min-h-11 items-center text-sm underline underline-offset-4 hover:text-copper">
              Warenkorb bearbeiten
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
