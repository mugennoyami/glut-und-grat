import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST as checkoutPost } from "@/app/api/checkout/route";
import { POST as quotePost } from "@/app/api/checkout/quote/route";
import { GET as inquiryGet, POST as inquiryPost } from "@/app/api/inquiries/route";
import { POST as webhookPost } from "@/app/api/webhooks/payments/route";
import { getCheckoutProvider } from "@/lib/commerce/provider";
import { getInquiryDelivery, toInquiryData } from "@/lib/inquiries/delivery";
import { resetRateLimits, isRateLimited } from "@/lib/security/rate-limit";
import { signPayload, verifySignature } from "@/lib/security/hmac";

const json = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`http://localhost${url}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const validContact = {
  type: "contact",
  message: "Eine kurze Frage zum Schärfservice.",
  name: "Mira Muster",
  email: "mira@beispiel.de",
  consent: true,
};

const ENV_KEYS = ["INQUIRY_WEBHOOK_URL", "INQUIRY_WEBHOOK_SECRET", "PAYMENT_PROVIDER", "PAYMENT_WEBHOOK_SECRET"] as const;

beforeEach(() => {
  resetRateLimits();
  for (const key of ENV_KEYS) delete process.env[key];
});
afterEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

describe("HMAC", () => {
  it("akzeptiert nur korrekte Signaturen", () => {
    const body = '{"a":1}';
    const sig = signPayload("geheim", body);
    expect(verifySignature("geheim", body, sig)).toBe(true);
    expect(verifySignature("geheim", body, `sha256=${sig}`)).toBe(true);
    expect(verifySignature("falsch", body, sig)).toBe(false);
    expect(verifySignature("geheim", '{"a":2}', sig)).toBe(false);
    expect(verifySignature("geheim", body, null)).toBe(false);
    expect(verifySignature("geheim", body, "zzzz")).toBe(false);
    expect(verifySignature("", body, sig)).toBe(false);
  });
});

describe("Ratenbegrenzer", () => {
  it("sperrt nach dem Limit und gibt nach dem Fenster wieder frei", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i += 1) expect(isRateLimited("k", 3, 1000, t0 + i)).toBe(false);
    expect(isRateLimited("k", 3, 1000, t0 + 10)).toBe(true);
    expect(isRateLimited("k", 3, 1000, t0 + 2000)).toBe(false);
  });
});

describe("Anfrage-API ohne Backend", () => {
  it("meldet den Status ehrlich als nicht konfiguriert", async () => {
    const res = await inquiryGet();
    expect(await res.json()).toEqual({ delivery: "none", configured: false });
  });

  it("behauptet keinen Versand: gültige Anfrage → 503 not_configured", async () => {
    const res = await inquiryPost(json("/api/inquiries", validContact));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, code: "not_configured" });
  });

  it("validiert serverseitig (422 mit Feldfehlern)", async () => {
    const res = await inquiryPost(json("/api/inquiries", { ...validContact, email: "x", message: "" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe("validation");
    expect(Object.keys(body.errors)).toEqual(expect.arrayContaining(["email", "message"]));
  });

  it("lehnt kaputtes JSON und zu große Anfragen ab", async () => {
    expect((await inquiryPost(json("/api/inquiries", "{kaputt"))).status).toBe(400);
    expect((await inquiryPost(json("/api/inquiries", "x".repeat(40_000)))).status).toBe(413);
  });
});

describe("Anfrage-Zustellung per Webhook", () => {
  it("gibt nur die erwarteten Felder weiter und signiert den Inhalt", async () => {
    let received: { body: string; signature: string | undefined } | undefined;
    const server = createServer((req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        received = { body, signature: req.headers["x-gg-signature"] as string | undefined };
        res.statusCode = 204;
        res.end();
      });
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    const { port } = server.address() as AddressInfo;
    process.env.INQUIRY_WEBHOOK_URL = `http://127.0.0.1:${port}/hook`;
    process.env.INQUIRY_WEBHOOK_SECRET = "s3cret";

    try {
      const res = await inquiryPost(json("/api/inquiries", validContact));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
      expect(received).toBeDefined();
      const payload = JSON.parse(received!.body);
      expect(payload.type).toBe("contact");
      expect(payload.data.message).toBe(validContact.message);
      expect(payload.data.consent).toBeUndefined();
      expect(payload.data.website).toBeUndefined();
      expect(verifySignature("s3cret", received!.body, received!.signature)).toBe(true);
    } finally {
      server.close();
    }
  });

  it("meldet delivery_failed, wenn der Dienst nicht erreichbar ist oder Fehler liefert", async () => {
    process.env.INQUIRY_WEBHOOK_URL = "http://127.0.0.1:1/unreachable";
    const res = await inquiryPost(json("/api/inquiries", validContact));
    expect(res.status).toBe(502);
    expect((await res.json()).code).toBe("delivery_failed");
  });

  it("verwirft Honeypot-Treffer ohne Zustellung", async () => {
    process.env.INQUIRY_WEBHOOK_URL = "http://127.0.0.1:1/unreachable";
    const res = await inquiryPost(json("/api/inquiries", { ...validContact, website: "http://spam.example" }));
    expect(res.status).toBe(200);
  });

  it("ignoriert ungültige Webhook-URLs", () => {
    expect(getInquiryDelivery({ INQUIRY_WEBHOOK_URL: "javascript:alert(1)" }).configured).toBe(false);
    expect(getInquiryDelivery({ INQUIRY_WEBHOOK_URL: "kein url" }).configured).toBe(false);
    expect(getInquiryDelivery({ INQUIRY_WEBHOOK_URL: "https://example.org/x" }).configured).toBe(true);
  });

  it("toInquiryData entfernt Einwilligung und Honeypot", () => {
    const data = toInquiryData({ ...validContact, website: undefined } as never);
    expect("consent" in data).toBe(false);
    expect("website" in data).toBe(false);
  });
});

describe("Checkout-API (Demo)", () => {
  const lines = [{ productId: "funke", options: { griff: "raeuchereiche", etui: "natur" }, quantity: 2 }];

  it("Demo-Anbieter ist Standard und legt nichts an", async () => {
    const res = await checkoutPost(json("/api/checkout", { lines }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.mode).toBe("demo");
    expect(body.message).toContain("keine Bestellung");
    expect(body.quote.subtotalCents).toBe(24600);
    expect(body.quote.totalCents).toBe(25190);
    expect(body.redirectUrl).toBeUndefined();
  });

  it("ignoriert vom Browser mitgeschickte Preise vollständig", async () => {
    const res = await quotePost(
      json("/api/checkout/quote", { lines: [{ ...lines[0], unitPriceCents: 1, price: 1, totalCents: 1 }] }),
    );
    const body = await res.json();
    expect(body.quote.subtotalCents).toBe(24600);
  });

  it("lehnt leere und ungültige Warenkörbe ab", async () => {
    expect((await checkoutPost(json("/api/checkout", { lines: [] }))).status).toBe(422);
    const bad = await checkoutPost(json("/api/checkout", { lines: [{ productId: "esse", options: { griff: "esche" }, quantity: 1 }] }));
    expect(bad.status).toBe(422);
    expect((await bad.json()).code).toBe("cart_invalid");
    expect((await checkoutPost(json("/api/checkout", { lines: "x" }))).status).toBe(422);
  });

  it("antwortet bei nicht implementiertem Anbieter mit 501 statt eine Demo vorzutäuschen", async () => {
    process.env.PAYMENT_PROVIDER = "stripe";
    expect(getCheckoutProvider()).toBeNull();
    const res = await checkoutPost(json("/api/checkout", { lines }));
    expect(res.status).toBe(501);
  });
});

describe("Zahlungs-Webhook", () => {
  it("ist ohne Secret deaktiviert (501)", async () => {
    const res = await webhookPost(json("/api/webhooks/payments", { id: "evt_1" }));
    expect(res.status).toBe(501);
    expect((await res.json()).code).toBe("webhooks_not_configured");
  });

  it("weist ungültige oder fehlende Signaturen ab (401)", async () => {
    process.env.PAYMENT_WEBHOOK_SECRET = "whsec";
    const body = JSON.stringify({ id: "evt_1" });
    expect((await webhookPost(json("/api/webhooks/payments", body))).status).toBe(401);
    expect((await webhookPost(json("/api/webhooks/payments", body, { "x-gg-signature": "sha256=" + "0".repeat(64) }))).status).toBe(401);
  });

  it("verarbeitet auch mit gültiger Signatur nichts, solange kein Bestellspeicher existiert", async () => {
    process.env.PAYMENT_WEBHOOK_SECRET = "whsec";
    const body = JSON.stringify({ id: "evt_1" });
    const sig = signPayload("whsec", body);
    const res = await webhookPost(json("/api/webhooks/payments", body, { "x-gg-signature": `sha256=${sig}` }));
    expect(res.status).toBe(501);
    expect((await res.json()).code).toBe("order_store_not_implemented");
  });
});
