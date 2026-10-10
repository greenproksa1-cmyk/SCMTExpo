import type { ReactElement, SVGProps } from 'react';

/**
 * Icon set — single weight, geometric, no fills.
 *
 * Icons always sit inside their own container with their own spacing, and are
 * never placed underneath body copy, so the label and the mark can never
 * collide. Colour comes from `--icon-stroke`, which flips with the section tone.
 */
export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'var(--icon-stroke, currentColor)',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
};

/* ---------------- Transport ---------------- */

/** Truck — side profile, two wheels, one load line. */
export function IconTruck(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M2 7.5h11.5V17H2zM13.5 10.5H17l3 3V17h-6.5z" />
      <circle cx="6" cy="17.5" r="1.9" />
      <circle cx="16.5" cy="17.5" r="1.9" />
      <path d="M4.5 10.5h6" />
    </svg>
  );
}

/** Ship — hull, bridge, waterline. */
export function IconShip(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 14.5h19l-2.2 4.2a2 2 0 0 1-1.8 1.1H6.5a2 2 0 0 1-1.8-1.1z" />
      <path d="M6.5 14.5V10h11v4.5M9.5 10V7.2h5V10M11 7.2V4.8h2v2.4" />
      <path d="M2 22c1.4 0 1.4 1 2.8 1s1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1" />
    </svg>
  );
}

/** Train / intermodal rail. */
export function IconTrain(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v10a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 4.5 15V5A1.5 1.5 0 0 1 6 3.5Z" />
      <path d="M4.5 10.5h15M8 17.5l-2 3.5M16 17.5l2 3.5" />
      <circle cx="8.5" cy="14" r="1" />
      <circle cx="15.5" cy="14" r="1" />
    </svg>
  );
}

/* ---------------- Logistics & network ---------------- */

/** Network — hub with three satellites. */
export function IconNetwork(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="4.2" r="1.8" />
      <circle cx="19" cy="15.6" r="1.8" />
      <circle cx="5" cy="15.6" r="1.8" />
      <path d="M12 6v3M9.9 13.9 6.6 14.9M14.1 13.9l3.3 1" />
    </svg>
  );
}

/** Boxes — three stacked containers. */
export function IconBoxes(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="12.5" width="7.5" height="5" rx="0.8" />
      <rect x="13.5" y="12.5" width="7.5" height="5" rx="0.8" />
      <rect x="8.2" y="6" width="7.5" height="5" rx="0.8" />
      <path d="M5.4 12.5v-3M17.9 12.5v-3M11.9 6V3.5" />
    </svg>
  );
}

/** Route — waypoints along a path. */
export function IconRoute(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="5" cy="18.5" r="2.2" />
      <circle cx="19" cy="5.5" r="2.2" />
      <path d="M6.9 17.1 11 11.5a3 3 0 0 1 2.4-1.2h4" strokeDasharray="0" />
      <path d="M15.5 8.6 17.9 10.3 15.5 12" />
    </svg>
  );
}

/** Compass — heading. */
export function IconCompass(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  );
}

/* ---------------- Technology ---------------- */

/** Chip — processor with pins. */
export function IconTech(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
      <rect x="10" y="10" width="4" height="4" rx="0.8" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </svg>
  );
}

/** Cloud data — digital transformation. */
export function IconCloud(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M7.5 18.5a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17.7 11a3.8 3.8 0 0 1-.6 7.5" />
      <path d="M9 15.5l3-2.5 3 2.5M12 13v6" />
    </svg>
  );
}

/** Layers — automation / modular systems. */
export function IconLayers(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5z" />
      <path d="m3.5 12.2 8.5 4.5 8.5-4.5M3.5 16.7l8.5 4.5 8.5-4.5" />
    </svg>
  );
}

/** Screen — live demo / presentation. */
export function IconScreen(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="2.5" y="4" width="19" height="13" rx="1.8" />
      <path d="M9 20.5h6M12 17v3.5M6.5 12l3-3.5 2.5 2.5 2.5-3 3 4" />
    </svg>
  );
}

/** Security — shield with check. */
export function IconShield(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2.8 4.5 6v6c0 4.6 3.1 8.2 7.5 9.4 4.4-1.2 7.5-4.8 7.5-9.4V6z" />
      <path d="m9 12 2.2 2.2L15.3 10" />
    </svg>
  );
}

/* ---------------- Partnership & people ---------------- */

/** Partnership — two interlocking halves. */
export function IconPartnership(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3v18" strokeDasharray="3 3" />
      <path d="M9 7.2 3 10.4V19l6-3.2z" />
      <path d="m15 7.2 6 3.2V19l-6-3.2z" />
    </svg>
  );
}

/** Leadership — person with a marker. */
export function IconLeadership(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="10" cy="7.5" r="3.2" />
      <path d="M4 20v-1.2A4.8 4.8 0 0 1 8.8 14h2.4A4.8 4.8 0 0 1 16 18.8V20" />
      <path d="m16 8.5 1.4 1.4L20.4 7" />
    </svg>
  );
}

/** People — a group. */
export function IconPeople(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="6.6" r="3" />
      <path d="M6.5 20v-1a5.5 5.5 0 0 1 11 0v1" />
      <path d="M4 13.6a3.6 3.6 0 0 1 1.6-3M20 13.6a3.6 3.6 0 0 0-1.6-3" />
    </svg>
  );
}

/** Meeting — two figures across a table. */
export function IconMeeting(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 13h19" />
      <path d="M6 13v7.5M18 13v7.5" />
      <circle cx="7.5" cy="6.2" r="2.3" />
      <path d="M3.6 13v-1.4a3.9 3.9 0 0 1 7.8 0V13" />
      <circle cx="16.5" cy="6.2" r="2.3" />
      <path d="M12.6 13v-1.4a3.9 3.9 0 0 1 7.8 0V13" />
    </svg>
  );
}

/* ---------------- Money & risk ---------------- */

/** Finance — bars with a trend line. */
export function IconFinance(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 20.5h18" />
      <path d="M6 20.5v-5M10.5 20.5v-8M15 20.5v-4.5M19.5 20.5v-11" />
      <path d="m4.5 8.5 5-3.5 4 2.5 6-4" />
    </svg>
  );
}

/** Insurance — shield with a currency mark. */
export function IconInsurance(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2.8 4.5 6v6c0 4.6 3.1 8.2 7.5 9.4 4.4-1.2 7.5-4.8 7.5-9.4V6z" />
      <path d="M12 8.2v7M14.2 9.8a2.4 2.4 0 0 0-2.2-1.2c-1.3 0-2.2.8-2.2 1.8 0 2.4 4.6 1.4 4.6 3.6 0 1-.9 1.8-2.2 1.8a2.5 2.5 0 0 1-2.3-1.2" />
    </svg>
  );
}

/* ---------------- Equipment ---------------- */

/** Crane — gantry. */
export function IconCrane(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M7 21V4h11" />
      <path d="M18 4v5M18 9h-3" />
      <path d="M3 21h8" />
      <path d="M13 21v-4h5v4" />
    </svg>
  );
}

/** Warehouse — building with a door. */
export function IconWarehouse(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 20.5v-11L12 5l9.5 4.5v11" />
      <path d="M8 20.5v-6.5h8v6.5" />
      <path d="M2.5 20.5h19" />
    </svg>
  );
}

/** Racking — storage levels. */
export function IconRacking(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 3.5v17M20.5 3.5v17" />
      <path d="M3.5 9.2h17M3.5 15.2h17" />
      <path d="M6.5 6.6h4v2.6h-4zM13 12.6h4v2.6h-4z" />
    </svg>
  );
}

/** Cog — operations & handling. */
export function IconCog(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.5 12H2.1M21.9 12h-2.4M6.7 6.7 4.9 4.9M19.1 19.1l-1.8-1.8M17.3 6.7l1.8-1.8M4.9 19.1l1.8-1.8" />
    </svg>
  );
}

/* ---------------- Energy & environment ---------------- */

/** Leaf. */
export function IconLeaf(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4.5 19.5C4.5 10 11 4.5 20 4.5c0 9-5.5 15-14 15z" />
      <path d="M4.5 19.5C7 15 10.5 11.5 15 9.5" />
    </svg>
  );
}

/** Turbine — renewable power. */
export function IconTurbine(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 12v9M8 21h8" />
      <circle cx="12" cy="12" r="1.6" />
      <path d="M12 10.4 9.6 3.2M13.4 13l6.6 2.2M10.6 13l-6.6 2.2" />
    </svg>
  );
}

/** EV — electric vehicle. */
export function IconEv(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 16.5h16" />
      <path d="M5.5 16.5v-4l2-5h9l2 5v4" />
      <path d="M5.5 12.5h13" />
      <circle cx="8" cy="17.5" r="1.6" />
      <circle cx="16" cy="17.5" r="1.6" />
      <path d="m12.6 8 -2 2.4h2.6L11 12.6" />
    </svg>
  );
}

/** Fuel drop. */
export function IconFuel(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.2s5.5 5.6 5.5 9.4a5.5 5.5 0 1 1-11 0c0-3.8 5.5-9.4 5.5-9.4Z" />
    </svg>
  );
}

/* ---------------- Concepts ---------------- */

/** Target / objective. */
export function IconTarget(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

/** Growth chart. */
export function IconGrowth(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 20.5h17" />
      <path d="M3.5 20.5v-17" />
      <path d="m6.5 15.5 4-5 3.5 3 5.5-7" />
      <path d="M15.5 6.5h4v4" />
    </svg>
  );
}

/** Handshake / partnership deal. */
export function IconHandshake(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m3 11.5 4-4 3 1.5 2-1 2 1 3-1.5 4 4" />
      <path d="m8.5 12.5 2 2 1.5-1.5 1.5 1.5 1.5-1.5 2 2" />
      <path d="M3 11.5v3.5l2 2M21 11.5V15l-2 2" />
    </svg>
  );
}

/** Globe / market entry. */
export function IconGlobe(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.7 3.6 5.7 3.6 9s-1.2 6.3-3.6 9c-2.4-2.7-3.6-5.7-3.6-9S9.6 5.7 12 3Z" />
    </svg>
  );
}

/** Microphone — conference / keynote. */
export function IconMic(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="9" y="2.8" width="6" height="10" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <path d="M12 18v3.2M9 21.2h6" />
    </svg>
  );
}

/** Rounded table — roundtables. */
export function IconRoundtable(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <ellipse cx="12" cy="10" rx="9" ry="4" />
      <path d="M12 14v7M8 21h8" />
    </svg>
  );
}

/** Tools — workshops. */
export function IconTools(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M15.5 3.5a5.5 5.5 0 0 0-6.2 7.9L3.6 17a2 2 0 1 0 2.8 2.8l5.6-5.7a5.5 5.5 0 0 0 7.9-6.2l-3 3-2.8-.7-.7-2.8z" />
    </svg>
  );
}

/** Two-way arrows — B2B meetings. */
export function IconB2B(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 9h13l-3-3M20 15H7l3 3" />
    </svg>
  );
}

/** Bulb — innovation. */
export function IconBulb(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 2.8a6.2 6.2 0 0 1 3.6 11.3c-.6.5-.9 1.1-.9 1.8v.3h-5.4v-.3c0-.7-.3-1.3-.9-1.8A6.2 6.2 0 0 1 12 2.8Z" />
    </svg>
  );
}

/** Rocket — startups. */
export function IconRocket(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2.8c3.8 2.4 5.8 5.8 5.8 9.4l-2.6 3.6H8.8L6.2 12.2c0-3.6 2-7 5.8-9.4Z" />
      <circle cx="12" cy="10.5" r="1.8" />
      <path d="M8.8 15.8 6.6 18l1.8.6M15.2 15.8l2.2 2.2-1.8.6M10.5 18.8c.6 1.4 1.2 2.1 1.5 2.4.3-.3.9-1 1.5-2.4" />
    </svg>
  );
}

/** Calendar with a coin — finance day. */
export function IconCalendar(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M12 13v4.5M13.6 14a1.8 1.8 0 0 0-1.6-.9c-1 0-1.7.6-1.7 1.4 0 1.8 3.5 1 3.5 2.7 0 .8-.7 1.4-1.7 1.4a1.9 1.9 0 0 1-1.7-.9" />
    </svg>
  );
}

/** Lock — risk management. */
export function IconLock(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <path d="M12 14.5v2.5" />
    </svg>
  );
}

/** Anchor — port. */
export function IconAnchor(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 7.2V21M5 12.5H3.2a8.8 8.8 0 0 0 17.6 0H19" />
      <path d="M8.5 12.5h7" />
    </svg>
  );
}

/* ---------------- Registries ---------------- */

/** Key themes. */
export const themeIcons: Record<string, (p: IconProps) => ReactElement> = {
  corridors: IconRoute,
  digital: IconCloud,
  ppp: IconPartnership,
  routes: IconCompass,
  sustainability: IconLeaf,
};

/** Exhibitor sectors. */
export const sectorIcons: Record<string, (p: IconProps) => ReactElement> = {
  land: IconTruck,
  maritime: IconAnchor,
  logistics: IconNetwork,
  technology: IconTech,
  equipment: IconCrane,
  finance: IconFinance,
  energy: IconLeaf,
};

/** Target visitor groups. */
export const visitorIcons: Record<string, (p: IconProps) => ReactElement> = {
  executive: IconLeadership,
  industry: IconBoxes,
  investment: IconInsurance,
  innovation: IconBulb,
};

/** Business value journey. */
export const journeyIcons = [
  IconHandshake,
  IconBulb,
  IconMeeting,
  IconShip,
  IconFinance,
  IconGrowth,
  IconBoxes,
  IconGlobe,
] as const;

/** Why-exhibit reasons. */
export const reasonIcons = [
  IconHandshake,
  IconShield,
  IconGrowth,
  IconGlobe,
  IconTarget,
] as const;

/** Event experience stations. */
export const stationIcons = [
  IconMic,
  IconRoundtable,
  IconTools,
  IconB2B,
  IconBulb,
  IconCrane,
  IconCalendar,
  IconRocket,
  IconScreen,
  IconPeople,
] as const;

/** Objective cluster icons (indexed by cluster order). */
export const objectiveGroupIcons = [
  IconHandshake,
  IconRoute,
  IconAnchor,
  IconFinance,
] as const;