"use client";

import { useState } from "react";
import { KnifeIllustration } from "@/components/art/KnifeIllustration";
import { ConceptTag } from "@/components/shop/ProductImageView";
import { handleMaterialIds, leatherMaterialIds, materials } from "@/content/materials";
import { getProduct } from "@/content/products";

const glow = { backgroundImage: "radial-gradient(ellipse 65% 60% at 60% 60%, rgb(198 132 76 / 0.22), transparent 68%)" };

function Chips({
  legend,
  ids,
  value,
  onChange,
  name,
}: {
  legend: string;
  ids: readonly string[];
  value: string;
  onChange: (id: string) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-fog">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {ids.map((id) => {
          const m = materials[id]!;
          const checked = value === id;
          return (
            <label key={id} className="relative cursor-pointer">
              <input type="radio" name={name} value={id} checked={checked} onChange={() => onChange(id)} className="peer sr-only" />
              <span className="flex min-h-11 items-center gap-2.5 rounded-full border border-bone/30 py-1.5 pl-2 pr-4 text-[0.9375rem] transition-colors peer-checked:border-copper peer-checked:bg-copper/12 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-soft hover:border-bone/55">
                <span
                  className="h-6 w-6 rounded-full border border-bone/25"
                  style={{ background: `linear-gradient(135deg, ${m.light}, ${m.dark})` }}
                  aria-hidden="true"
                />
                {m.name}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Interaktive Materialprobe: Holz und Leder wählen, Gesamt- und Detailansichten passen sich an (Konzeptdarstellung). */
export function MaterialExplorer() {
  const base = getProduct("zunder")!;
  const [wood, setWood] = useState<string>("walnuss");
  const [leather, setLeather] = useState<string>("leder-cognac");
  const w = materials[wood]!;
  const l = materials[leather]!;

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <figure
        className="surface-hammered relative aspect-[4/3] overflow-hidden rounded-[3px] bg-anthracite sm:aspect-[3/2] lg:col-span-8 lg:row-span-2"
        style={glow}
      >
        <KnifeIllustration
          dims={base.specs}
          art={base.art}
          view="full"
          aspect={3 / 2}
          rotation={-8}
          zoom={1.04}
          handleMaterialId={wood}
          sheathMaterialId={leather}
          title={`Konzeptillustration: Messer mit Griff aus ${w.name} und Scheide aus ${l.name}`}
          className="absolute inset-0 h-full w-full"
        />
        <ConceptTag className="absolute left-3 top-3" />
      </figure>

      <figure className="surface-hammered relative aspect-[3/2] overflow-hidden rounded-[3px] bg-anthracite lg:col-span-4" style={glow}>
        <KnifeIllustration
          dims={base.specs}
          art={base.art}
          view="handle"
          aspect={3 / 2}
          handleMaterialId={wood}
          title={`Detail: Griff aus ${w.name} mit Kupferstiften`}
          className="absolute inset-0 h-full w-full"
        />
        <figcaption className="absolute bottom-2.5 left-3 rounded-full bg-coal/70 px-2.5 py-1 text-xs text-fog backdrop-blur-sm">Detail Griff</figcaption>
      </figure>
      <figure className="surface-hammered relative aspect-[3/2] overflow-hidden rounded-[3px] bg-anthracite lg:col-span-4" style={glow}>
        <KnifeIllustration
          dims={base.specs}
          art={base.art}
          view="sheath"
          aspect={3 / 2}
          handleMaterialId={wood}
          sheathMaterialId={leather}
          title={`Detail: Scheide aus ${l.name} mit Naht`}
          className="absolute inset-0 h-full w-full"
        />
        <figcaption className="absolute bottom-2.5 left-3 rounded-full bg-coal/70 px-2.5 py-1 text-xs text-fog backdrop-blur-sm">Detail Scheide und Naht</figcaption>
      </figure>

      <div className="grid gap-7 lg:col-span-12 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-5">
          <Chips legend="Griffholz" ids={handleMaterialIds} value={wood} onChange={setWood} name="explorer-wood" />
          <p className="prose-copy text-[0.9375rem] text-bone/90" aria-live="polite">
            <strong className="font-semibold">{w.name}.</strong> {w.description}
          </p>
        </div>
        <div className="space-y-5">
          <Chips legend="Scheidenleder" ids={leatherMaterialIds} value={leather} onChange={setLeather} name="explorer-leather" />
          <p className="prose-copy text-[0.9375rem] text-bone/90" aria-live="polite">
            <strong className="font-semibold">{l.name}.</strong> {l.description}
          </p>
        </div>
      </div>
    </div>
  );
}
