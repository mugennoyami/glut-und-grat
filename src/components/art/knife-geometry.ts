import type { KnifeArt } from "@/content/types";

/**
 * Parametrische Messer-Geometrie (Einheit: Millimeter, Messer liegt waagerecht, Griff links, Spitze rechts,
 * Schneide unten). Reine Funktionen ohne React – damit testbar und für Illustrationen,
 * Maßzeichnung und Detailausschnitte gleichermaßen nutzbar.
 */

export interface KnifeDims {
  bladeLengthMm: number;
  overallLengthMm: number;
}

export interface BladeSample {
  x: number;
  spine: number;
  edge: number;
  /** Höhe der Klinge an dieser Stelle (edge − spine) */
  h: number;
}

export interface KnifeGeometry {
  handleLen: number;
  bladeLen: number;
  overall: number;
  handleHalf: number;
  /** y der Klingenrücken-Linie an der Ferse */
  spineTop: number;
  blade: BladeSample[];
  tip: { x: number; y: number };
  /** Gesamtausdehnung in y */
  minY: number;
  maxY: number;
  handleTop: { x: number; y: number }[];
  handleBottom: { x: number; y: number }[];
  pins: { x: number; y: number }[];
  lanyard?: { x: number; y: number };
  paths: {
    blade: string;
    handle: string;
    bevel: string;
    forgeBand: string;
    edgeLine: string;
    grindLine: string;
    hamon: string;
    spineLine: string;
    silhouette: string;
  };
}

const N = 96;

const fmt = (n: number) => Number(n.toFixed(2));
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

interface Profile {
  spine: (t: number) => number;
  edge: (t: number) => number;
  tipY: number;
}

function profileFor(kind: KnifeArt["profile"], H: number, y0: number): Profile {
  const yHeel = y0 + H;
  switch (kind) {
    case "paring": {
      const tipY = y0 + 0.5 * H;
      return {
        tipY,
        spine: (t) => y0 + (tipY - y0) * Math.pow(clamp01((t - 0.5) / 0.5), 2.1),
        edge: (t) => yHeel - (yHeel - tipY) * Math.pow(clamp01((t - 0.16) / 0.84), 2.05) + 0.06 * H * Math.sin(Math.PI * t),
      };
    }
    case "utility": {
      const tipY = y0 + 0.36 * H;
      const slope = 0.07 * H;
      return {
        tipY,
        spine: (t) => y0 + slope * t + (tipY - y0 - slope) * Math.pow(clamp01((t - 0.68) / 0.32), 2.2),
        edge: (t) => yHeel - (yHeel - tipY) * Math.pow(clamp01((t - 0.08) / 0.92), 2.3) + 0.035 * H * Math.sin(Math.PI * t),
      };
    }
    case "dropPoint":
    default: {
      const tipY = y0 + 0.44 * H;
      return {
        tipY,
        spine: (t) => y0 + (tipY - y0) * Math.pow(clamp01((t - 0.52) / 0.48), 1.9),
        edge: (t) => yHeel - (yHeel - tipY) * Math.pow(clamp01((t - 0.2) / 0.8), 2.15) + 0.05 * H * Math.sin(Math.PI * t),
      };
    }
  }
}

function poly(points: { x: number; y: number }[], close = false): string {
  const body = points.map((p, i) => `${i === 0 ? "M" : "L"}${fmt(p.x)} ${fmt(p.y)}`).join(" ");
  return close ? `${body} Z` : body;
}

export function buildKnife(dims: KnifeDims, art: KnifeArt): KnifeGeometry {
  const overall = dims.overallLengthMm;
  const bladeLen = dims.bladeLengthMm;
  const handleLen = overall - bladeLen;
  const hh = art.handleHeightMm / 2;
  const H = art.bladeHeightMm;
  const y0 = -hh * 0.9;
  const profile = profileFor(art.profile, H, y0);

  // Klinge abtasten
  const blade: BladeSample[] = [];
  for (let i = 0; i <= N; i += 1) {
    const t = i / N;
    const spine = profile.spine(t);
    const edge = Math.max(profile.edge(t), spine);
    blade.push({ x: handleLen + t * bladeLen, spine, edge, h: edge - spine });
  }
  const tip = { x: overall, y: profile.tipY };

  // Griffkontur
  const r = hh * 1.7;
  const handleTop: { x: number; y: number }[] = [];
  const handleBottom: { x: number; y: number }[] = [];
  const M = 64;
  for (let i = 0; i <= M; i += 1) {
    const x = (i / M) * handleLen;
    const corner = x < r ? Math.pow(1 - Math.pow(1 - x / r, 2.3), 1 / 2.3) : 1;
    const swell = 1 + 0.075 * Math.sin(Math.PI * (x / handleLen)) - 0.07 * (x / handleLen);
    handleTop.push({ x, y: -hh * corner * swell });
    handleBottom.push({ x, y: hh * corner * swell * 1.06 });
  }
  const handlePath = `${poly(handleTop)} ${poly([...handleBottom].reverse()).replace("M", "L")} Z`;

  // Klingenkontur: Rücken vorwärts, Schneide rückwärts
  const spinePts = blade.map((b) => ({ x: b.x, y: b.spine }));
  const edgePts = blade.map((b) => ({ x: b.x, y: b.edge }));
  const bladePath = `${poly(spinePts)} ${poly([...edgePts].reverse()).replace("M", "L")} Z`;

  // Fase (Schliff) – beginnt hinter dem Ricasso
  const bevelFrac = (t: number) => 0.4 * smooth(0.05, 0.22, t);
  const grindPts = blade.map((b, i) => ({ x: b.x, y: b.edge - bevelFrac(i / N) * b.h }));
  const startIdx = Math.round(0.05 * N);
  const bevelPath = `${poly(edgePts.slice(startIdx))} ${poly(grindPts.slice(startIdx).reverse()).replace("M", "L")} Z`;

  // Schmiedehaut-Band am Rücken
  const bandPts = blade.map((b, i) => {
    const t = i / N;
    const wobble = 0.2 + 0.07 * Math.sin(t * 29 + 1.3) + 0.04 * Math.sin(t * 71);
    return { x: b.x, y: b.spine + b.h * wobble };
  });
  const forgeBand = `${poly(spinePts)} ${poly([...bandPts].reverse()).replace("M", "L")} Z`;

  const hamonPts = blade
    .map((b, i) => ({ b, t: i / N }))
    .filter(({ t }) => t > 0.14 && t < 0.92)
    .map(({ b, t }) => ({
      x: b.x,
      y: b.edge - b.h * (0.5 + 0.07 * Math.sin(t * 17 + 0.6) + 0.035 * Math.sin(t * 43)),
    }));

  // Stifte
  const pinFractions = art.pins >= 3 ? [0.2, 0.5, 0.79] : art.pins === 2 ? [0.32, 0.72] : [0.55];
  const pins = pinFractions.slice(0, art.pins).map((f) => ({ x: handleLen * f, y: 0 }));
  const lanyard = art.lanyardHole ? { x: r * 0.8, y: 0 } : undefined;

  const silhouette = `${handlePath} ${bladePath}`;

  const minY = Math.min(-hh * 1.1, y0 - 1);
  const maxY = Math.max(hh * 1.15, y0 + H + 1);

  return {
    handleLen,
    bladeLen,
    overall,
    handleHalf: hh,
    spineTop: y0,
    blade,
    tip,
    minY,
    maxY,
    handleTop,
    handleBottom,
    pins,
    ...(lanyard ? { lanyard } : {}),
    paths: {
      blade: bladePath,
      handle: handlePath,
      bevel: bevelPath,
      forgeBand,
      edgeLine: poly(edgePts.slice(startIdx - 2)),
      grindLine: poly(grindPts.slice(startIdx)),
      hamon: poly(hamonPts),
      spineLine: poly(spinePts),
      silhouette,
    },
  };
}

/** Kleiner deterministischer Zufall (mulberry32) für wiederholbare Hammerschlag-Muster. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function viewBoxString(v: ViewBox): string {
  return `${fmt(v.x)} ${fmt(v.y)} ${fmt(v.w)} ${fmt(v.h)}`;
}

/** Ausschnitt mit festem Seitenverhältnis um einen Mittelpunkt. */
export function centeredBox(cx: number, cy: number, width: number, aspect: number): ViewBox {
  const h = width / aspect;
  return { x: cx - width / 2, y: cy - h / 2, w: width, h };
}

/** Breite eines um `deg` gedrehten Rechtecks. */
export function rotatedExtent(w: number, h: number, deg: number): { w: number; h: number } {
  const a = (Math.abs(deg) * Math.PI) / 180;
  return { w: Math.cos(a) * w + Math.sin(a) * h, h: Math.sin(a) * w + Math.cos(a) * h };
}
