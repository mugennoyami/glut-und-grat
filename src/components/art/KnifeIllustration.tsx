import { useId } from "react";
import { getMaterial } from "@/content/materials";
import type { KnifeArt } from "@/content/types";
import {
  BlurFilter,
  BrushedSteelFilter,
  ForgeScaleFilter,
  LeatherFilter,
  WoodFilter,
} from "./filters";
import {
  buildKnife,
  centeredBox,
  rotatedExtent,
  seededRandom,
  viewBoxString,
  type KnifeDims,
  type KnifeGeometry,
  type ViewBox,
} from "./knife-geometry";

export type KnifeView = "full" | "handle" | "edge" | "dimensions" | "sheath";

export interface KnifeIllustrationProps {
  dims: KnifeDims;
  art: KnifeArt;
  handleMaterialId?: string;
  /** Leder für Scheide/Etui/Klingenschutz; ohne Angabe wird keine Scheide gezeichnet */
  sheathMaterialId?: string;
  view?: KnifeView;
  /** Drehung der Gesamtansicht in Grad (negativ = Spitze nach oben) */
  rotation?: number;
  /** Seitenverhältnis des Bildrahmens (Breite/Höhe) */
  aspect?: number;
  /** Zusätzlicher Spielraum um das Motiv */
  zoom?: number;
  glint?: boolean;
  className?: string;
  /** Alternativtext. Ohne Angabe wird das Bild als dekorativ behandelt. */
  title?: string;
  labels?: { overall: string; blade: string };
}

const STEEL_FACE = [
  ["0", "#55514d"],
  ["0.16", "#8a857e"],
  ["0.48", "#bdb7ae"],
  ["0.8", "#97918a"],
  ["1", "#6b665f"],
] as const;

function sheathPath(length: number, half: number, inset = 0): string {
  const a = half - inset;
  const L = length - inset;
  const x0 = inset * 0.4;
  return [
    `M${x0} ${-a}`,
    `L${L - 13} ${-a * 0.97}`,
    `Q${L} ${-a * 0.95} ${L} ${-a * 0.45}`,
    `L${L} ${a * 0.2}`,
    `Q${L} ${a * 0.72} ${L - 20} ${a * 0.76}`,
    `L${x0} ${a}`,
    "Z",
  ].join(" ");
}

export function KnifeIllustration(props: KnifeIllustrationProps) {
  const {
    dims,
    art,
    handleMaterialId = "walnuss",
    sheathMaterialId,
    view = "full",
    rotation = -10,
    aspect = 3 / 2,
    zoom = 1,
    glint = false,
    className,
    title,
    labels = { overall: "Gesamtlänge", blade: "Klingenlänge" },
  } = props;

  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;

  const g: KnifeGeometry = buildKnife(dims, art);
  const wood = getMaterial(handleMaterialId) ?? getMaterial("walnuss")!;
  const leather = sheathMaterialId ? getMaterial(sheathMaterialId) : undefined;

  // Scheide: liegt unterhalb des Messers
  const sheathLen = g.bladeLen + 20;
  const sheathHalf = art.bladeHeightMm / 2 + 9;
  const sheathGap = 16;
  const sheathCenterY = g.maxY + sheathGap + sheathHalf;
  const sheathX = g.handleLen - 16;

  const showSheath = Boolean(leather) && (view === "full" || view === "sheath");
  const contentMinY = g.minY - (view === "dimensions" ? 30 : 4);
  const contentMaxY = showSheath
    ? sheathCenterY + sheathHalf + 4
    : g.maxY + (view === "dimensions" ? 34 : 4);
  const cx = g.overall / 2;
  const cy = (contentMinY + contentMaxY) / 2;
  const totalH = contentMaxY - contentMinY;

  let box: ViewBox;
  let rotate = 0;
  switch (view) {
    case "handle": {
      box = centeredBox(
        g.handleLen * 0.7,
        0,
        Math.max(62, g.handleLen * 0.78) * zoom,
        aspect,
      );
      break;
    }
    case "sheath": {
      box = centeredBox(
        sheathX + sheathLen * 0.46,
        sheathCenterY - 2,
        sheathLen * 0.78 * zoom,
        aspect,
      );
      break;
    }
    case "edge": {
      box = centeredBox(
        g.handleLen + g.bladeLen * 0.64,
        g.spineTop + art.bladeHeightMm * 0.5,
        g.bladeLen * 0.82 * zoom,
        aspect,
      );
      break;
    }
    case "dimensions": {
      const w = g.overall * 1.2 * zoom;
      box = centeredBox(cx, cy, Math.max(w, totalH * 1.3 * aspect), aspect);
      break;
    }
    default: {
      rotate = rotation;
      const ext = rotatedExtent(g.overall, totalH, rotation);
      const width = Math.max(ext.w * 1.04, ext.h * 1.1 * aspect) * zoom;
      box = centeredBox(cx, cy, width, aspect);
    }
  }

  // Hammerschlag: wiederholbare Verteilung
  const rand = seededRandom(
    Math.round(
      dims.bladeLengthMm * 31 + dims.overallLengthMm * 7 + art.bladeHeightMm,
    ),
  );
  const facets = Array.from({ length: 16 }, () => {
    const t = 0.1 + rand() * 0.85;
    const sample =
      g.blade[
        Math.min(g.blade.length - 1, Math.round(t * (g.blade.length - 1)))
      ]!;
    const rel = 0.08 + rand() * 0.55;
    return {
      x: sample.x,
      y: sample.spine + sample.h * rel,
      rx: 4 + rand() * 6,
      ry: 2 + rand() * 3,
      rot: -14 + rand() * 28,
      light: rand() > 0.45,
      o: 0.06 + rand() * 0.09,
    };
  });

  const faceTop = g.spineTop;
  const faceBottom = g.spineTop + art.bladeHeightMm;
  const handleHalf = g.handleHalf;
  const rectX = -3;
  const rectW = g.handleLen + 6;

  const decorative = !title;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBoxString(box)}
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <WoodFilter
          id={id("wood")}
          dark={wood.dark}
          light={wood.light}
          seed={wood.seed}
        />
        {leather ? (
          <LeatherFilter
            id={id("leather")}
            dark={leather.dark}
            light={leather.light}
            seed={leather.seed}
          />
        ) : null}
        <ForgeScaleFilter id={id("forge")} seed={dims.bladeLengthMm % 17} />
        <BrushedSteelFilter id={id("brush")} seed={3} />
        <BlurFilter id={id("shadow")} std={2.4} />
        <BlurFilter id={id("soft")} std={0.55} />

        <linearGradient
          id={id("face")}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={faceTop}
          x2="0"
          y2={faceBottom}
        >
          {STEEL_FACE.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient
          id={id("bevel")}
          gradientUnits="userSpaceOnUse"
          x1={g.handleLen}
          y1="0"
          x2={g.overall}
          y2="0"
        >
          <stop offset="0" stopColor="#d7d2c9" />
          <stop offset="0.2" stopColor="#f2eee6" />
          <stop offset="0.42" stopColor="#b0aa9f" />
          <stop offset="0.64" stopColor="#ebe6dc" />
          <stop offset="0.86" stopColor="#bdb7ac" />
          <stop offset="1" stopColor="#e4dfd5" />
        </linearGradient>
        <linearGradient
          id={id("bevelV")}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={faceBottom - art.bladeHeightMm * 0.45}
          x2="0"
          y2={faceBottom}
        >
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient
          id={id("handleShade")}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={-handleHalf * 1.05}
          x2="0"
          y2={handleHalf * 1.1}
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0.36" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={id("pin")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f5c897" />
          <stop offset="0.55" stopColor="#c47d46" />
          <stop offset="1" stopColor="#7a401d" />
        </radialGradient>
        <linearGradient
          id={id("spacer")}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={-handleHalf}
          x2="0"
          y2={handleHalf}
        >
          <stop offset="0" stopColor="#efb17a" />
          <stop offset="0.45" stopColor="#b8703c" />
          <stop offset="1" stopColor="#6e3817" />
        </linearGradient>
        <radialGradient id={id("facetL")}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("facetD")}>
          <stop offset="0" stopColor="#000" stopOpacity="1" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("glintGrad")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <clipPath id={id("bladeClip")}>
          <path d={g.paths.blade} />
        </clipPath>
        <clipPath id={id("bevelClip")}>
          <path d={g.paths.bevel} />
        </clipPath>
        <clipPath id={id("handleClip")}>
          <path d={g.paths.handle} />
        </clipPath>
        {showSheath ? (
          <clipPath id={id("sheathClip")}>
            <path d={sheathPath(sheathLen, sheathHalf)} />
          </clipPath>
        ) : null}
      </defs>

      <g
        transform={
          rotate ? `rotate(${rotate} ${fmt(cx)} ${fmt(cy)})` : undefined
        }
      >
        {/* Schatten */}
        <g filter={url("shadow")} opacity="0.55" transform="translate(1.5 4.5)">
          <path d={g.paths.silhouette} fill="#000" />
          {showSheath ? (
            <path
              d={sheathPath(sheathLen, sheathHalf)}
              fill="#000"
              transform={`translate(${fmt(sheathX)} ${fmt(sheathCenterY)})`}
            />
          ) : null}
        </g>

        {/* Scheide */}
        {showSheath && leather ? (
          <g transform={`translate(${fmt(sheathX)} ${fmt(sheathCenterY)})`}>
            {/* Gürtelschlaufe */}
            <g>
              <rect
                x={sheathLen * 0.24}
                y={-sheathHalf - 10}
                width={sheathLen * 0.3}
                height="15"
                rx="2.4"
                fill={leather.dark}
              />
              <rect
                x={sheathLen * 0.24}
                y={-sheathHalf - 10}
                width={sheathLen * 0.3}
                height="15"
                rx="2.4"
                fill={leather.light}
                opacity="0.35"
              />
              <rect
                x={sheathLen * 0.24 + 2}
                y={-sheathHalf - 8}
                width={sheathLen * 0.3 - 4}
                height="11"
                rx="1.4"
                fill="none"
                stroke="#e9dcbc"
                strokeWidth="0.55"
                strokeDasharray="2.2 1.7"
                opacity="0.75"
              />
            </g>
            <g clipPath={url("sheathClip")}>
              <rect
                x="-2"
                y={-sheathHalf - 2}
                width={sheathLen + 4}
                height={sheathHalf * 2 + 4}
                filter={url("leather")}
              />
              <rect
                x="-2"
                y={-sheathHalf - 2}
                width={sheathLen + 4}
                height={sheathHalf * 2 + 4}
                fill={url("handleShade")}
                opacity="0.55"
              />
            </g>
            <path
              d={sheathPath(sheathLen, sheathHalf)}
              fill="none"
              stroke="#000"
              strokeOpacity="0.55"
              strokeWidth="0.7"
            />
            <path
              d={sheathPath(sheathLen, sheathHalf, 3.6)}
              fill="none"
              stroke="#eadfc2"
              strokeWidth="0.75"
              strokeDasharray="2.6 1.9"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        ) : null}

        {/* Griff */}
        <g>
          <g clipPath={url("handleClip")}>
            <rect
              x={rectX}
              y={-handleHalf * 1.3}
              width={rectW}
              height={handleHalf * 2.6}
              filter={url("wood")}
            />
            <rect
              x={rectX}
              y={-handleHalf * 1.3}
              width={rectW}
              height={handleHalf * 2.6}
              fill={url("handleShade")}
            />
            <path
              d={`M${fmt(handleHalf * 0.4)} ${fmt(-handleHalf * 0.62)} L${fmt(g.handleLen - 4)} ${fmt(-handleHalf * 0.7)}`}
              stroke="#fff"
              strokeOpacity="0.22"
              strokeWidth="1.1"
              strokeLinecap="round"
              filter={url("soft")}
            />
          </g>
          <path
            d={g.paths.handle}
            fill="none"
            stroke="#000"
            strokeOpacity="0.55"
            strokeWidth="0.55"
          />
          {g.lanyard ? (
            <g>
              <circle
                cx={g.lanyard.x}
                cy={g.lanyard.y}
                r="2.1"
                fill="#0b0908"
              />
              <circle
                cx={g.lanyard.x}
                cy={g.lanyard.y}
                r="2.1"
                fill="none"
                stroke="#c47d46"
                strokeWidth="0.7"
              />
            </g>
          ) : null}
          {g.pins.map((p) => (
            <g key={p.x}>
              <circle cx={p.x} cy={p.y} r="2.55" fill="#1a0e07" opacity="0.7" />
              <circle cx={p.x} cy={p.y} r="2.05" fill={url("pin")} />
              <circle
                cx={p.x - 0.55}
                cy={p.y - 0.65}
                r="0.5"
                fill="#fff"
                opacity="0.7"
              />
            </g>
          ))}
        </g>

        {/* Zwinge */}
        <rect
          x={g.handleLen - 2.4}
          y={-handleHalf * 0.99}
          width="3"
          height={handleHalf * 2.1}
          rx="0.6"
          fill={url("spacer")}
        />
        <rect
          x={g.handleLen - 2.4}
          y={-handleHalf * 0.99}
          width="0.7"
          height={handleHalf * 2.1}
          fill="#fff"
          opacity="0.28"
        />

        {/* Klinge */}
        <g>
          <path d={g.paths.blade} fill={url("face")} />
          <g clipPath={url("bladeClip")}>
            <rect
              x={g.handleLen}
              y={faceTop - 1}
              width={g.bladeLen + 2}
              height={art.bladeHeightMm + 2}
              fill="#fff"
              filter={url("brush")}
              opacity="0.3"
              style={{ mixBlendMode: "overlay" }}
            />
            {/* Hammerschläge */}
            {facets.map((f, i) => (
              <ellipse
                key={i}
                cx={f.x}
                cy={f.y}
                rx={f.rx}
                ry={f.ry}
                transform={`rotate(${f.rot.toFixed(1)} ${fmt(f.x)} ${fmt(f.y)})`}
                fill={url(f.light ? "facetL" : "facetD")}
                opacity={f.o}
              />
            ))}
            {/* Schmiedehaut am Rücken */}
            <path
              d={g.paths.forgeBand}
              fill="#2a2623"
              filter={url("forge")}
              opacity="0.96"
            />
          </g>

          {/* Fase */}
          <path d={g.paths.bevel} fill={url("bevel")} />
          <path d={g.paths.bevel} fill={url("bevelV")} />
          {glint ? (
            <g clipPath={url("bevelClip")}>
              <rect
                className="knife-glint"
                x={g.handleLen - 30}
                y={faceBottom - art.bladeHeightMm * 0.5}
                width="26"
                height={art.bladeHeightMm}
                fill={url("glintGrad")}
                transform="skewX(-24)"
                style={{ ["--glint-travel" as string]: `${g.bladeLen + 70}px` }}
              />
            </g>
          ) : null}
          {/* Härtelinie (rein gestalterisch) */}
          <path
            d={g.paths.hamon}
            fill="none"
            stroke="#fff"
            strokeWidth="0.9"
            strokeOpacity="0.2"
            strokeLinecap="round"
            filter={url("soft")}
            clipPath={url("bevelClip")}
          />
          <path
            d={g.paths.grindLine}
            fill="none"
            stroke="#1a1714"
            strokeOpacity="0.38"
            strokeWidth="0.35"
          />
          {/* Schneide und Rücken */}
          <path
            d={g.paths.edgeLine}
            fill="none"
            stroke="#fffaf0"
            strokeOpacity="0.95"
            strokeWidth="0.42"
            strokeLinecap="round"
          />
          <path
            d={g.paths.spineLine}
            fill="none"
            stroke="#0e0c0b"
            strokeOpacity="0.55"
            strokeWidth="0.45"
          />
          <path
            d={g.paths.blade}
            fill="none"
            stroke="#0b0908"
            strokeOpacity="0.4"
            strokeWidth="0.3"
          />
          {/* Ricasso-Kante */}
          <line
            x1={g.handleLen + 0.8}
            y1={g.spineTop + 0.5}
            x2={g.handleLen + 0.8}
            y2={g.spineTop + art.bladeHeightMm - 0.5}
            stroke="#000"
            strokeOpacity="0.28"
            strokeWidth="0.5"
          />
        </g>
      </g>

      {view === "dimensions" ? (
        <DimensionLines g={g} labels={labels} showText={!decorative} />
      ) : null}
    </svg>
  );
}

function fmt(n: number): string {
  return n.toFixed(2);
}

function DimensionLines({
  g,
  labels,
  showText,
}: {
  g: KnifeGeometry;
  labels: { overall: string; blade: string };
  showText: boolean;
}) {
  const lineColor = "#d98f55";
  const topY = g.minY - 12;
  const bottomY = g.maxY + 14;
  const tick = 3;
  const fontSize = 6.6;
  return (
    <g fill="none" stroke={lineColor} strokeWidth="0.45" aria-hidden="true">
      {/* Klingenlänge (oben) */}
      <line
        x1={g.handleLen}
        y1={g.minY - 3}
        x2={g.handleLen}
        y2={topY - 3}
        strokeDasharray="1.4 1.4"
        opacity="0.7"
      />
      <line
        x1={g.overall}
        y1={g.minY - 3}
        x2={g.overall}
        y2={topY - 3}
        strokeDasharray="1.4 1.4"
        opacity="0.7"
      />
      <line x1={g.handleLen} y1={topY} x2={g.overall} y2={topY} />
      <line
        x1={g.handleLen}
        y1={topY - tick}
        x2={g.handleLen}
        y2={topY + tick}
      />
      <line x1={g.overall} y1={topY - tick} x2={g.overall} y2={topY + tick} />
      {showText ? (
        <text
          x={(g.handleLen + g.overall) / 2}
          y={topY - 4}
          textAnchor="middle"
          fill="#f1e8d8"
          stroke="none"
          fontSize={fontSize}
          fontFamily="var(--font-sans)"
          letterSpacing="0.05em"
        >
          {labels.blade} {g.bladeLen} mm
        </text>
      ) : null}
      {/* Gesamtlänge (unten) */}
      <line
        x1="0"
        y1={g.maxY + 2}
        x2="0"
        y2={bottomY + 3}
        strokeDasharray="1.4 1.4"
        opacity="0.7"
      />
      <line
        x1={g.overall}
        y1={g.tip.y + 2}
        x2={g.overall}
        y2={bottomY + 3}
        strokeDasharray="1.4 1.4"
        opacity="0.7"
      />
      <line x1="0" y1={bottomY} x2={g.overall} y2={bottomY} />
      <line x1="0" y1={bottomY - tick} x2="0" y2={bottomY + tick} />
      <line
        x1={g.overall}
        y1={bottomY - tick}
        x2={g.overall}
        y2={bottomY + tick}
      />
      {showText ? (
        <text
          x={g.overall / 2}
          y={bottomY + 9.4}
          textAnchor="middle"
          fill="#f1e8d8"
          stroke="none"
          fontSize={fontSize}
          fontFamily="var(--font-sans)"
          letterSpacing="0.05em"
        >
          {labels.overall} {g.overall} mm
        </text>
      ) : null}
    </g>
  );
}
