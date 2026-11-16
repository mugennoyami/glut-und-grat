import { NextResponse } from "next/server";
import { priceCart } from "@/lib/cart/pricing";
import { checkoutRequestSchema, toQuoteDto } from "@/lib/commerce/request";

export const dynamic = "force-dynamic";

/** Prüft einen Warenkorb serverseitig gegen den Katalog und liefert die maßgeblichen Summen. */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 });
  }
  const parsed = checkoutRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "validation" }, { status: 422 });
  }
  const summary = priceCart(parsed.data.lines);
  return NextResponse.json({ ok: true, quote: toQuoteDto(summary) }, { headers: { "cache-control": "no-store" } });
}
