import { createHmac, timingSafeEqual } from "node:crypto";

/** Berechnet eine HMAC-SHA256-Signatur (hex) über den unveränderten Rohtext. */
export function signPayload(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload, "utf8").digest("hex");
}

/**
 * Prüft eine Webhook-Signatur in konstanter Zeit.
 * Akzeptiert "sha256=<hex>" oder nur "<hex>". Fehlende/ungültige Signaturen ergeben false.
 */
export function verifySignature(secret: string, payload: string, header: string | null | undefined): boolean {
  if (!secret || !header) return false;
  const provided = header.startsWith("sha256=") ? header.slice("sha256=".length) : header;
  if (!/^[0-9a-f]{64}$/i.test(provided)) return false;
  const expected = Buffer.from(signPayload(secret, payload), "hex");
  const actual = Buffer.from(provided, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
