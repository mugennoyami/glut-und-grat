"use client";

import { CheckIcon } from "@/components/ui/icons";
import type { ProductOption } from "@/content/types";
import { formatSignedPrice } from "@/lib/money";

interface Props {
  option: ProductOption;
  productSlug: string;
  value: string;
  onChange: (valueId: string) => void;
}

/** Variantenwahl als Radiogruppe mit großen Zielflächen; Auswahl wird nicht nur über Farbe sichtbar. */
export function OptionGroup({ option, productSlug, value, onChange }: Props) {
  const name = `${productSlug}-${option.id}`;
  const helpId = option.help ? `${name}-help` : undefined;
  return (
    <fieldset className="min-w-0" aria-describedby={helpId}>
      <legend className="eyebrow mb-3 text-fog">{option.label}</legend>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {option.values.map((v) => {
          const checked = value === v.id;
          return (
            <label key={v.id} className={`relative block ${v.available ? "cursor-pointer" : "cursor-not-allowed"}`}>
              <input
                type="radio"
                name={name}
                value={v.id}
                checked={checked}
                disabled={!v.available}
                onChange={() => onChange(v.id)}
                className="peer sr-only"
              />
              <span
                className="flex h-full min-h-[4.25rem] flex-col justify-center rounded-[3px] border border-bone/25 px-3.5 py-2.5 transition-colors peer-checked:border-copper peer-checked:bg-copper/12 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-soft peer-disabled:border-bone/10 peer-disabled:text-smoke hover:[&:not(:where(.peer:disabled+*))]:border-bone/50"
              >
                <span className="flex items-start justify-between gap-1.5 text-[0.9375rem] font-semibold leading-tight">
                  <span className={v.available ? "" : "line-through decoration-smoke"}>{v.label}</span>
                  <CheckIcon size={16} className={`mt-0.5 shrink-0 text-copper ${checked ? "opacity-100" : "opacity-0"}`} />
                </span>
                <span className="mt-1 text-[0.8125rem] text-fog peer-disabled:text-smoke">
                  {v.available ? formatSignedPrice(v.priceDeltaCents) : (v.note ?? "nicht verfügbar")}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {option.help ? (
        <p id={helpId} className="mt-2.5 text-[0.8125rem] text-fog">
          {option.help}
        </p>
      ) : null}
    </fieldset>
  );
}
