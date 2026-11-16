"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface Props {
  value: number;
  max: number;
  label: string;
  onChange: (next: number) => void;
}

/** Mengenwahl mit großen Zielflächen (44 px). Der Wert wird als Text ausgegeben und per Live-Region angesagt. */
export function QuantityStepper({ value, max, label, onChange }: Props) {
  const btn =
    "grid h-11 w-11 place-items-center text-bone transition-colors hover:text-copper disabled:cursor-not-allowed disabled:text-smoke";
  return (
    <div role="group" aria-label={`Menge: ${label}`} className="inline-flex items-center rounded-[3px] border border-bone/25">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={`Menge verringern: ${label}`}>
        <MinusIcon size={18} />
      </button>
      <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite" aria-atomic="true">
        <span className="sr-only">Menge </span>
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={value >= max ? `Maximale Menge erreicht: ${label}` : `Menge erhöhen: ${label}`}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  );
}
