import type { CartSummary } from "@/lib/cart/pricing";

/**
 * Austauschbare Anbindung an einen Zahlungsanbieter.
 *
 * Ohne Konfiguration läuft ausschließlich der Demo-Anbieter: Er legt keine Bestellung an und
 * löst keine Zahlung aus. Für den Livebetrieb wird hier ein Adapter ergänzt (z. B. Stripe Checkout,
 * Mollie, PayPal oder ein Shop-Backend wie Shopify/Medusa). Der Adapter erhält ausschließlich den
 * serverseitig neu berechneten Warenkorb – niemals Preise aus dem Browser – und liefert eine
 * Weiterleitung zur gehosteten Bezahlseite des Anbieters. Zahlungsergebnisse gelangen über
 * verifizierte Webhooks (siehe /api/webhooks/payments) ins System, nicht über die Rückkehr-URL.
 */

export type CheckoutResult =
  | { ok: true; mode: "demo"; message: string }
  | { ok: true; mode: "live"; redirectUrl: string }
  | { ok: false; code: "provider_error"; message: string };

export interface CheckoutContext {
  /** Basis-URL der Website für Rückkehr-Adressen */
  origin: string;
}

export interface CheckoutProvider {
  id: string;
  mode: "demo" | "live";
  createCheckout(summary: CartSummary, context: CheckoutContext): Promise<CheckoutResult>;
}

const demoProvider: CheckoutProvider = {
  id: "demo",
  mode: "demo",
  async createCheckout() {
    return {
      ok: true,
      mode: "demo",
      message: "Demo-Durchlauf: Es wurde keine Bestellung angelegt und keine Zahlung ausgelöst.",
    };
  },
};

/**
 * Liefert den konfigurierten Anbieter. `PAYMENT_PROVIDER` ist standardmäßig "demo".
 * Unbekannte Werte liefern null – die API antwortet dann mit 501 statt stillschweigend eine Demo vorzutäuschen.
 */
export function getCheckoutProvider(env: Record<string, string | undefined> = process.env): CheckoutProvider | null {
  const id = (env.PAYMENT_PROVIDER ?? "demo").trim().toLowerCase();
  if (id === "demo" || id === "") return demoProvider;
  // Hier registrierte Live-Adapter ergänzen, z. B.: if (id === "stripe") return createStripeProvider(env);
  return null;
}
