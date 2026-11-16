"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { AlertIcon, CheckIcon, InfoIcon } from "@/components/ui/icons";
import type { SubmitStatus } from "./useInquirySubmit";

/** Hinweis über dem Formular, solange kein Versandweg angebunden ist. */
export function DeliveryNotice({ configured }: { configured: boolean | null }) {
  if (configured !== false) return null;
  return (
    <div role="note" className="flex gap-3 rounded-[3px] border border-copper/45 bg-copper/8 p-4 text-[0.9375rem]">
      <InfoIcon size={20} className="mt-0.5 shrink-0 text-copper" />
      <p>
        <strong className="font-semibold">Vorschau:</strong> Das Absenden ist hier noch nicht aktiv. Du kannst das Formular ausfüllen und prüfen – es wird
        nichts gesendet und nichts gespeichert.
      </p>
    </div>
  );
}

/** Liste aller Fehler mit Sprung zum jeweiligen Feld; erhält nach fehlgeschlagener Prüfung den Fokus. */
export function ErrorSummary({ errors, focusKey }: { errors: Record<string, string>; focusKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const entries = Object.entries(errors);

  useEffect(() => {
    if (focusKey > 0 && entries.length > 0) ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  if (entries.length === 0) return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-[3px] border border-ember bg-ember/10 p-4 outline-none">
      <p className="flex items-center gap-2 font-semibold">
        <AlertIcon size={18} className="text-ember-soft" />
        {entries.length === 1 ? "Bitte prüfe eine Angabe:" : `Bitte prüfe ${entries.length} Angaben:`}
      </p>
      <ul className="mt-2 space-y-1 text-[0.9375rem]">
        {entries.map(([field, message]) => (
          <li key={field}>
            <button
              type="button"
              className="text-left underline underline-offset-4 hover:text-copper"
              onClick={() => {
                const el = document.querySelector<HTMLElement>(`[data-field="${field}"]`);
                const target = el?.matches("input,select,textarea") ? el : el?.querySelector<HTMLElement>("input,select,textarea");
                target?.focus();
              }}
            >
              {message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Rückmeldung nach dem Absenden – nennt Erfolg nur, wenn der Server ihn bestätigt hat. */
export function SubmitFeedback({ status, copyText, onReset }: { status: SubmitStatus; copyText: string; onReset: () => void }) {
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

  if (status.state === "idle") return null;

  if (status.state === "sending") {
    return (
      <p role="status" className="text-fog">
        Wird gesendet …
      </p>
    );
  }

  if (status.state === "sent") {
    return (
      <div role="status" className="rounded-[3px] border border-copper bg-copper/10 p-5">
        <p className="flex items-center gap-2 font-display text-2xl font-semibold">
          <CheckIcon size={22} className="text-copper" />
          Anfrage übermittelt.
        </p>
        <p className="mt-2 text-bone/90">Deine Angaben sind angekommen. Ob und wann du eine Rückmeldung bekommst, legt die Werkstatt fest.</p>
        <Button type="button" variant="secondary" size="md" className="mt-4" onClick={onReset}>
          Weitere Anfrage stellen
        </Button>
      </div>
    );
  }

  if (status.state === "unavailable") {
    return (
      <div role="alert" className="rounded-[3px] border-2 border-ember bg-ember/10 p-5">
        <p className="flex items-center gap-2 font-display text-2xl font-semibold">
          <AlertIcon size={22} className="text-ember-soft" />
          Nicht gesendet.
        </p>
        <p className="mt-2 text-bone/90">
          In dieser Vorschau ist noch kein Versandweg angebunden. Deine Anfrage wurde <strong>weder gesendet noch gespeichert</strong>; die Angaben bleiben
          nur in diesem Tab erhalten, bis du die Seite verlässt.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(copyText);
                setCopied("ok");
              } catch {
                setCopied("fail");
              }
            }}
          >
            Anfrage als Text kopieren
          </Button>
          <span role="status" className="text-sm text-fog">
            {copied === "ok" ? "In die Zwischenablage kopiert." : copied === "fail" ? "Kopieren nicht möglich – bitte den Text manuell markieren." : ""}
          </span>
        </div>
        {copied === "fail" ? (
          <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-[3px] bg-coal p-3 text-sm text-bone/90">{copyText}</pre>
        ) : null}
      </div>
    );
  }

  return (
    <div role="alert" className="rounded-[3px] border border-ember bg-ember/10 p-5">
      <p className="flex items-center gap-2 font-semibold">
        <AlertIcon size={20} className="text-ember-soft" />
        Nicht gesendet.
      </p>
      <p className="mt-1.5 text-bone/90">{status.message} Deine Eingaben sind noch da – bitte versuche es später erneut.</p>
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 space-y-5">
      <legend className="mb-5 w-full p-0">
        <span className="eyebrow flex items-center gap-4 text-copper after:h-px after:flex-1 after:bg-bone/15">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}
