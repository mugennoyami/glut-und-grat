import { NextResponse } from "next/server";
import { getInquiryDelivery, toInquiryData } from "@/lib/inquiries/delivery";
import { fieldErrors, inquirySchema } from "@/lib/inquiries/schemas";
import { isRateLimited } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store" };
const MAX_BODY_CHARS = 30_000;

/** Status der Anfrage-Zustellung – damit die Formulare ehrlich anzeigen können, ob Versand möglich ist. */
export async function GET() {
  const delivery = getInquiryDelivery();
  return NextResponse.json({ delivery: delivery.id, configured: delivery.configured }, { headers: NO_STORE });
}

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY_CHARS) {
    return NextResponse.json({ ok: false, code: "too_large" }, { status: 413, headers: NO_STORE });
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400, headers: NO_STORE });
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "validation", errors: fieldErrors(parsed.error) },
      { status: 422, headers: NO_STORE },
    );
  }

  // Honeypot: Bots füllen das versteckte Feld. Stillschweigend verwerfen.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  const delivery = getInquiryDelivery();
  if (!delivery.configured) {
    // Nichts wird gespeichert oder protokolliert. Die Eingaben verbleiben im Browser des Absenders.
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503, headers: NO_STORE });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`inquiry:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429, headers: NO_STORE });
  }

  const data = toInquiryData(parsed.data);
  const result = await delivery.deliver({ type: data.type, submittedAt: new Date().toISOString(), data });
  if (!result.ok) {
    return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502, headers: NO_STORE });
  }
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
