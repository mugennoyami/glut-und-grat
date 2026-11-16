import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/security/hmac";

export const dynamic = "force-dynamic";

/**
 * Eingang für Zahlungsergebnisse des Zahlungsanbieters.
 *
 * Grundsätze für die Live-Schaltung:
 *  1. Nur signierte Aufrufe akzeptieren – Signatur über den unveränderten Rohtext prüfen.
 *  2. Den Betrag NICHT aus der Nachricht übernehmen, sondern mit der serverseitig gespeicherten Bestellung vergleichen.
 *  3. Verarbeitung idempotent auslegen (Anbieter senden Ereignisse mehrfach).
 *  4. Bestellstatus nur hier ändern, nicht über die Rückkehr-Seite des Kunden.
 *
 * Aktueller Stand: Es ist kein Zahlungsanbieter und kein Bestellspeicher angebunden. Die Route verweigert
 * deshalb jede Verarbeitung. Für Stripe, Mollie & Co. ersetzt der jeweilige Adapter die HMAC-Prüfung durch das
 * offizielle Verfahren des Anbieters (z. B. Stripe-Signatur) und ruft einen Bestellspeicher auf.
 */
export async function POST(request: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false, code: "webhooks_not_configured" }, { status: 501 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-gg-signature");
  if (!verifySignature(secret, rawBody, signature)) {
    return NextResponse.json({ ok: false, code: "invalid_signature" }, { status: 401 });
  }

  // Signatur gültig – aber es existiert noch kein Bestellspeicher, der das Ereignis verarbeiten könnte.
  return NextResponse.json({ ok: false, code: "order_store_not_implemented" }, { status: 501 });
}
