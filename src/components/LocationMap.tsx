'use client';

import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';

/* ==========================================================================
   Regional map of the Red Sea at Yanbu.

   The previous version was a decorative blob with a pin on it: no coastlines,
   no landmass, nothing to orient by. This one is drawn from geographic
   coordinates — the Red Sea between the Egyptian and Sudanese shore on the
   west and the Saudi shore on the east, converging north into the Gulf of
   Suez — with Yanbu marked at its true position (38.06 E, 24.09 N) and Jeddah
   for scale.

   Coastlines are simplified polylines, so read it as an approximate location
   map, which is what the caption says. It stays inline SVG rather than a tile
   server: no API key, no external request, no third-party tracking.
   ========================================================================== */

/* --- View window --------------------------------------------------------- */
/*
  Deliberately portrait. That is the real shape of the Red Sea, and forcing it
  into the card's landscape box would only distort it. The element uses
  `preserveAspectRatio="meet"` so the whole map survives any card proportion,
  and the wrapper paints the same sea colour so the letterbox is invisible.
*/
const LON_MIN = 34.0;
const LON_MAX = 42.2;
const LAT_MIN = 20.4;
const LAT_MAX = 29.4;

/* --- Projection: equirectangular, latitude-corrected --------------------- */
const MID_LAT = (LAT_MIN + LAT_MAX) / 2;
const KX = Math.cos((MID_LAT * Math.PI) / 180);

const SPAN_X = (LON_MAX - LON_MIN) * KX; // longitude corrected to this latitude
const SPAN_Y = LAT_MAX - LAT_MIN;

const SCALE = 420 / SPAN_Y;
const VB_W = Math.round(SPAN_X * SCALE);
const VB_H = Math.round(SPAN_Y * SCALE);

const px = (lon: number) => (lon - LON_MIN) * KX * SCALE;
const py = (lat: number) => VB_H - (lat - LAT_MIN) * SCALE;

/** Pin geometry is authored against a 310-unit-wide map and scaled to this one. */
const K = VB_W / 310;

/* --- Coastlines ---------------------------------------------------------- */

/** Egypt and Sudan, down the western shore, north to south. */
const COAST_WEST: [number, number][] = [
  [34.0, 29.4],
  [34.05, 28.6],
  [34.3, 27.8],
  [34.5, 27.0],
  [34.65, 26.3],
  [34.8, 25.6],
  [34.95, 24.9],
  [35.1, 24.2],
  [35.3, 23.5],
  [35.5, 22.8],
  [35.75, 22.2],
  [36.0, 21.7],
  [36.4, 21.3],
];

/** Sinai, closing the Gulf of Suez at the top of the frame. */
const SINAI: [number, number][] = [
  [34.0, 29.4],
  [34.05, 28.6],
  [34.3, 27.8],
  [33.95, 27.45],
  [33.55, 27.6],
  [33.35, 28.1],
  [33.25, 28.7],
  [33.35, 29.3],
  [33.7, 29.9],
];

/** Saudi Arabia, from the Jordan border south along the Red Sea shore. */
const COAST_EAST: [number, number][] = [
  [34.95, 29.53],
  [35.0, 28.9],
  [34.9, 28.3],
  [34.6, 27.8],
  [34.85, 27.6],
  [35.1, 27.3],
  [35.4, 26.9],
  [35.7, 26.5],
  [36.0, 26.1],
  [36.3, 25.8],
  [36.6, 25.5],
  [36.9, 25.2],
  [37.2, 25.0],
  [37.5, 24.7],
  [37.8, 24.4],
  [38.07, 24.09], // Yanbu — 38.06 E, 24.09 N
  [38.3, 23.8],
  [38.6, 23.4],
  [38.85, 23.0],
  [39.0, 22.6],
  [39.1, 22.1],
  [39.17, 21.49], // Jeddah — 39.17 E, 21.49 N
  [39.5, 21.2],
  [39.9, 21.0],
];

/* --- Helpers ------------------------------------------------------------- */

const path = (points: [number, number][], close = false) =>
  points.map(([lon, lat], i) => `${i === 0 ? 'M' : 'L'}${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`).join('') +
  (close ? 'Z' : '');

/** A land body: follow the coast, then close it off past the edge of the frame. */
function landmass(points: [number, number][], side: 'west' | 'east') {
  const edge = side === 'west' ? -60 : VB_W + 60;
  const bottom = py(LAT_MIN) + 80;
  const first = points[0];
  const last = points[points.length - 1];
  return (
    path(points) +
    `L${px(last[0]).toFixed(1)} ${bottom.toFixed(1)}` +
    `L${edge} ${bottom.toFixed(1)}` +
    `L${edge} ${py(first[1]).toFixed(1)}Z`
  );
}

const WEST_LAND = landmass(COAST_WEST, 'west');
const EAST_LAND = landmass(COAST_EAST, 'east');
const SINAI_LAND = path(SINAI, true);

/** Faint two-degree graticule. */
const GRID: string[] = [
  ...Array.from({ length: Math.floor(SPAN_Y / 2) }, (_, i) => {
    const lat = LAT_MIN + (i + 1) * 2;
    return `M0 ${py(lat).toFixed(1)}H${VB_W}`;
  }),
  ...Array.from({ length: Math.floor(SPAN_X / 2) }, (_, i) => {
    const lon = LON_MIN + (i + 1) * 2;
    return `M${px(lon).toFixed(1)} 0V${VB_H}`;
  }),
];

const YANBU = { lon: 38.07, lat: 24.09 };
const JEDDAH = { lon: 39.17, lat: 21.49 };

export function LocationMap({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === 'ar';
  const t = dict.location;

  const yx = px(YANBU.lon);
  const yy = py(YANBU.lat);
  const jx = px(JEDDAH.lon);
  const jy = py(JEDDAH.lat);

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      role="img"
      aria-label={t.mapLabel}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="lm-sea" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#0B2A4A" />
          <stop offset="55%" stopColor="#071A30" />
          <stop offset="100%" stopColor="#050F1E" />
        </linearGradient>
        <linearGradient id="lm-land" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#1B3E66" />
          <stop offset="100%" stopColor="#102A48" />
        </linearGradient>
        <radialGradient id="lm-pin">
          <stop offset="0%" stopColor="#E87722" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E87722" stopOpacity="0" />
        </radialGradient>
        <filter id="lm-soft" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Water fills the viewBox; the wrapper carries the same colour beyond it. */}
      <rect x="-60" y="-60" width={VB_W + 120} height={VB_H + 120} fill="url(#lm-sea)" />

      {/* Graticule */}
      <g stroke="#7FA8D8" strokeOpacity="0.12" strokeWidth="0.7" fill="none">
        {GRID.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Land */}
      <g fill="url(#lm-land)" stroke="#7BA6D6" strokeOpacity="0.55" strokeWidth="1.2">
        <path d={WEST_LAND} />
        <path d={EAST_LAND} />
        <path d={SINAI_LAND} />
      </g>

      {/* Shore line, brighter than the fill so the coast reads clearly */}
      <g fill="none" stroke="#A8CCEE" strokeOpacity="0.5" strokeWidth="0.8">
        <path d={path(COAST_WEST)} />
        <path d={path(COAST_EAST)} />
      </g>

      {/* Jeddah, for scale */}
      <g>
        <circle cx={jx.toFixed(1)} cy={jy.toFixed(1)} r={2.6 * K} fill="#C3D4E8" fillOpacity="0.9" />
        <text
          x={jx + 7 * K}
          y={jy + 3.5 * K}
          fontSize={11}
          fontFamily="system-ui, sans-serif"
          fill="#C3D4E8"
          fillOpacity="0.92"
          direction="ltr"
        >
          {isAr ? 'جدة' : 'Jeddah'}
        </text>
      </g>

      {/* Yanbu — the subject of the map */}
      <g>
        <circle cx={yx} cy={yy} r={40 * K} fill="url(#lm-pin)" filter="url(#lm-soft)" />
        <path
          d={`M${yx.toFixed(1)} ${(yy - 26 * K).toFixed(1)}c-8.3 0-15 6.7-15 15 0 10.8 15 25.1 15 25.1s15-14.3 15-25.1c0-8.3-6.7-15-15-15Z`}
          fill="#E87722"
          transform={`translate(${(yx - yx).toFixed(1)} 0) scale(${K.toFixed(3)}) translate(${(-yx / K).toFixed(1)} 0)`}
        />
        <circle cx={yx} cy={yy - 11 * K} r={5.4 * K} fill="#0A1A33" />
        <circle cx={yx} cy={yy - 11 * K} r={2.5 * K} fill="#fff" />
        <text
          x={yx + 12 * K}
          y={yy - 20 * K}
          fontSize={13}
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          fill="#fff"
          direction="ltr"
        >
          Yanbu
        </text>
      </g>

      {/* Sea label, placed in open water west of the Saudi shore */}
      <text
        x={px(36.4).toFixed(1)}
        y={py(24.6).toFixed(1)}
        fontSize={11}
        letterSpacing="2.2"
        fontFamily="system-ui, sans-serif"
        fill="#8FB3DC"
        fillOpacity="0.6"
        textAnchor="middle"
        direction="ltr"
      >
        {isAr ? 'البحر الأحمر' : 'RED SEA'}
      </text>

      {/* Countries */}
      <text
        x={12}
        y={py(27.4).toFixed(1)}
        fontSize={11}
        letterSpacing="1.6"
        fontFamily="system-ui, sans-serif"
        fill="#7FA8D8"
        fillOpacity="0.5"
        direction="ltr"
      >
        {isAr ? 'مصر والسودان' : 'EGYPT & SUDAN'}
      </text>
      <text
        x={VB_W - 12}
        y={py(26.6).toFixed(1)}
        fontSize={11}
        letterSpacing="1.6"
        textAnchor="end"
        fontFamily="system-ui, sans-serif"
        fill="#7FA8D8"
        fillOpacity="0.5"
        direction="ltr"
      >
        {isAr ? 'السعودية' : 'SAUDI ARABIA'}
      </text>

      {/* Compass */}
      <g transform={`translate(${VB_W - 26} 26)`} opacity="0.7">
        <circle r="14" fill="none" stroke="#8FB3DC" strokeWidth="0.9" />
        <path d="M0-9 3 2.5 0 0-3 2.5Z" fill="#E87722" />
        <path d="M0 9 3-2.5 0 0-3-2.5Z" fill="#8FB3DC" fillOpacity="0.75" />
        <text
          y="23"
          textAnchor="middle"
          fontSize="9"
          fill="#8FB3DC"
          fontFamily="system-ui, sans-serif"
          direction="ltr"
        >
          N
        </text>
      </g>
    </svg>
  );
}