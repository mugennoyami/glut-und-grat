import { NextResponse } from "next/server";
import { priceCart } from "@/lib/cart/pricing";
import { getCheckoutProvider } from "@/lib/commerce/provider";
import { checkoutRequestSchema, toQuoteDto } from "@/lib/commerce/request";

export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store" };

/**
 * Startet den Checkout. Preise und Summen werden ausschließlich serverseitig aus dem Katalog berechnet;
 * Beträge aus dem Browser werden weder erwartet noch beachtet.
 * Ohne konfigurierten Zahlungsanbieter läuft nur der Demo-Anbieter (keine Bestellung, keine Zahlung).
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400, headers: NO_STORE });
  }
  const parsed = checkoutRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "validation" }, { status: 422, headers: NO_STORE });
  }

  const summary = priceCart(parsed.data.lines);
  const blocking = summary.issues.filter((i) => i.code !== "quantity_reduced");
  if (blocking.length > 0) {
    return NextResponse.json(
      { ok: false, code: "cart_invalid", quote: toQuoteDto(summary) },
      { status: 422, headers: NO_STORE },
    );
  }
  if (summary.lines.length === 0) {
    return NextResponse.json(
      { ok: false, code: "empty_cart", quote: toQuoteDto(summary) },
      { status: 422, headers: NO_STORE },
    );
  }

  const provider = getCheckoutProvider();
  if (!provider) {
    return NextResponse.json({ ok: false, code: "provider_not_implemented" }, { status: 501, headers: NO_STORE });
  }

  const origin = new URL(request.url).origin;
  const result = await provider.createCheckout(summary, { origin });
  if (!result.ok) {
    return NextResponse.json({ ok: false, code: result.code }, { status: 502, headers: NO_STORE });
  }
  return NextResponse.json(
    { ok: true, mode: result.mode, quote: toQuoteDto(summary), ...(result.mode === "demo" ? { message: result.message } : { redirectUrl: result.redirectUrl }) },
    { headers: NO_STORE },
  );
}
