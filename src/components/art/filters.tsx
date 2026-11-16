import type { ReactElement } from "react";

/**
 * SVG-Filter für Materialtexturen (Holz, Leder, Schmiedehaut, gebürsteter Stahl).
 * Alle Texturen entstehen prozedural – es werden keine Fotos nachgeahmt oder verwendet.
 * Jede Instanz bekommt eigene IDs, damit mehrere Illustrationen pro Seite nicht kollidieren.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

/** Farbmatrix: Graustufe (R-Kanal) → Rampe dunkel…hell, mit Kontrast k um den Mittelwert `center`. */
function rampMatrix(dark: string, light: string, k: number, center: number): string {
  const d = hexToRgb(dark);
  const l = hexToRgb(light);
  const row = (dc: number, lc: number) => {
    const slope = (lc - dc) * k;
    const offset = dc + (lc - dc) * (0.5 - k * center);
    return `${slope.toFixed(4)} 0 0 0 ${offset.toFixed(4)}`;
  };
  return `${row(d.r, l.r)} ${row(d.g, l.g)} ${row(d.b, l.b)} 0 0 0 0 1`;
}

const GRAY_OPAQUE = "1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1";

export function WoodFilter(props: { id: string; dark: string; light: string; seed: number }): ReactElement {
  const { id, dark, light, seed } = props;
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.028 0.95" numOctaves={4} seed={seed} result="fineRaw" />
      <feColorMatrix in="fineRaw" type="matrix" values={GRAY_OPAQUE} result="fine" />
      <feTurbulence type="fractalNoise" baseFrequency="0.007 0.1" numOctaves={2} seed={seed + 3} result="broadRaw" />
      <feColorMatrix in="broadRaw" type="matrix" values={GRAY_OPAQUE} result="broad" />
      <feDisplacementMap in="fine" in2="broad" scale="9" xChannelSelector="R" yChannelSelector="G" result="warped" />
      <feComposite in="warped" in2="broad" operator="arithmetic" k1="0" k2="0.62" k3="0.38" k4="0" result="mix" />
      <feColorMatrix in="mix" type="matrix" values={rampMatrix(dark, light, 3.1, 0.5)} />
    </filter>
  );
}

export function LeatherFilter(props: { id: string; dark: string; light: string; seed: number }): ReactElement {
  const { id, dark, light, seed } = props;
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={seed} result="grain" />
      <feDiffuseLighting in="grain" surfaceScale="1.7" diffuseConstant="1.05" lightingColor="#ffffff" result="lit">
        <feDistantLight azimuth="235" elevation="55" />
      </feDiffuseLighting>
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={seed + 8} result="mottleRaw" />
      <feColorMatrix in="mottleRaw" type="matrix" values={GRAY_OPAQUE} result="mottle" />
      <feComposite in="lit" in2="mottle" operator="arithmetic" k1="0" k2="0.8" k3="0.28" k4="-0.12" result="mix" />
      <feColorMatrix in="mix" type="matrix" values={rampMatrix(dark, light, 3.4, 0.74)} />
    </filter>
  );
}

/** Rauhe, dunkle Schmiedehaut: Verwerfung der Kante + beleuchtetes Relief. */
export function ForgeScaleFilter(props: { id: string; seed?: number }): ReactElement {
  const { id, seed = 4 } = props;
  return (
    <filter id={id} x="-2%" y="-30%" width="104%" height="160%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves={3} seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
      <feDiffuseLighting in="n" surfaceScale="2.6" diffuseConstant="1" lightingColor="#c9bfb1" result="lit">
        <feDistantLight azimuth="225" elevation="48" />
      </feDiffuseLighting>
      <feComposite in="lit" in2="rough" operator="in" result="textured" />
      <feColorMatrix in="textured" type="matrix" values="0.5 0 0 0 0  0.46 0 0 0 0  0.42 0 0 0 0  0 0 0 1 0" />
    </filter>
  );
}

/** Feine, waagerechte Schleifspuren für Stahlflächen. */
export function BrushedSteelFilter(props: { id: string; seed?: number }): ReactElement {
  const { id, seed = 2 } = props;
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.0045 1.1" numOctaves={3} seed={seed} result="n" />
      <feColorMatrix in="n" type="matrix" values="1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  0 0 0 0 1" />
    </filter>
  );
}

export function BlurFilter(props: { id: string; std: number }): ReactElement {
  return (
    <filter id={props.id} x="-20%" y="-60%" width="140%" height="220%">
      <feGaussianBlur stdDeviation={props.std} />
    </filter>
  );
}
