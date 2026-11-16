"use client";

import { useCallback, useEffect, useState } from "react";

export type SubmitStatus =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  /** Es ist kein Versandweg angebunden – nichts wurde gesendet oder gespeichert. */
  | { state: "unavailable" }
  | { state: "error"; message: string };

/** Fragt ab, ob Anfragen zugestellt werden können (null = noch unbekannt). */
export function useDeliveryConfigured(): boolean | null {
  const [configured, setConfigured] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/inquiries", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((body: { configured?: boolean } | null) => {
        if (alive && body && typeof body.configured === "boolean") setConfigured(body.configured);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return configured;
}

/**
 * Sendet eine Anfrage an /api/inquiries.
 * Erfolg wird ausschließlich gemeldet, wenn der Server `ok: true` antwortet.
 */
export function useInquirySubmit() {
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const submit = useCallback(async (payload: unknown) => {
    setStatus({ state: "sending" });
    setServerErrors({});
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => ({}))) as { ok?: boolean; code?: string; errors?: Record<string, string> };

      if (response.ok && body.ok === true) {
        setStatus({ state: "sent" });
        return;
      }
      if (body.code === "not_configured") {
        setStatus({ state: "unavailable" });
        return;
      }
      if (body.code === "validation" && body.errors) {
        setServerErrors(body.errors);
        setStatus({ state: "error", message: "Einige Angaben wurden vom Server nicht akzeptiert. Bitte prüfe die markierten Felder." });
        return;
      }
      if (body.code === "rate_limited") {
        setStatus({ state: "error", message: "Es wurden zu viele Anfragen in kurzer Zeit gesendet. Bitte warte einen Moment." });
        return;
      }
      setStatus({ state: "error", message: "Die Anfrage konnte nicht zugestellt werden." });
    } catch {
      setStatus({ state: "error", message: "Es besteht keine Verbindung zum Server." });
    }
  }, []);

  const reset = useCallback(() => {
    setStatus({ state: "idle" });
    setServerErrors({});
  }, []);

  return { status, serverErrors, submit, reset };
}
