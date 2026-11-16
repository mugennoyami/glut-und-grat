import { signPayload } from "@/lib/security/hmac";
import type { Inquiry } from "./schemas";

/**
 * Austauschbare Zustellung von Anfragen.
 *
 * Standard: "none" – nichts wird versendet oder gespeichert, die API antwortet ehrlich mit
 * "not_configured". Mit INQUIRY_WEBHOOK_URL werden Anfragen als signierter JSON-POST an einen
 * eigenen Dienst weitergereicht (z. B. Zapier/Make, eigene Funktion, E-Mail-Dienst, Ticketsystem).
 * Weitere Adapter (E-Mail-API, Datenbank) lassen sich hier ergänzen, ohne Formulare zu ändern.
 */

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Anfrage ohne interne Felder (Einwilligungs-Checkbox, Honeypot). */
export type InquiryData = DistributiveOmit<Inquiry, "consent" | "website">;

export interface InquiryEnvelope {
  type: Inquiry["type"];
  submittedAt: string;
  data: InquiryData;
}

/** Entfernt Einwilligungs- und Honeypot-Feld vor der Weitergabe. */
export function toInquiryData(inquiry: Inquiry): InquiryData {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { consent, website, ...data } = inquiry;
  return data;
}

export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export interface InquiryDelivery {
  id: "none" | "webhook";
  configured: boolean;
  deliver(envelope: InquiryEnvelope): Promise<DeliveryResult>;
}

const noneDelivery: InquiryDelivery = {
  id: "none",
  configured: false,
  async deliver() {
    return { ok: false, reason: "not_configured" };
  },
};

function createWebhookDelivery(url: string, secret: string | undefined, fetchImpl: typeof fetch): InquiryDelivery {
  return {
    id: "webhook",
    configured: true,
    async deliver(envelope) {
      const body = JSON.stringify(envelope);
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (secret) headers["x-gg-signature"] = `sha256=${signPayload(secret, body)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetchImpl(url, { method: "POST", headers, body, signal: controller.signal });
        return response.ok ? { ok: true } : { ok: false, reason: "failed" };
      } catch {
        return { ok: false, reason: "failed" };
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export function getInquiryDelivery(
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): InquiryDelivery {
  const url = env.INQUIRY_WEBHOOK_URL?.trim();
  if (!url) return noneDelivery;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return noneDelivery;
  } catch {
    return noneDelivery;
  }
  return createWebhookDelivery(url, env.INQUIRY_WEBHOOK_SECRET?.trim() || undefined, fetchImpl);
}
