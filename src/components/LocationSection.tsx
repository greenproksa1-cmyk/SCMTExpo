import Image from 'next/image';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem, RevealX } from './ui/Motion';
import { IconMark, StatTile } from './ui/Photo';
import { Countdown } from './Countdown';

/** Stylised Red Sea coastline with Yanbu marked — decorative, not a real map. */
function YanbuMap({ label, isAr }: { label: string; isAr: boolean }) {
  return (
    <svg
      viewBox="0 0 520 340"
      className="h-full w-full"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="lm-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B4576" />
          <stop offset="100%" stopColor="#0E2648" />
        </linearGradient>
        <linearGradient id="lm-sea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B1D3A" />
          <stop offset="100%" stopColor="#07132A" />
        </linearGradient>
        <radialGradient id="lm-pin">
          <stop offset="0%" stopColor="#E87722" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E87722" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm-sun">
          <stop offset="0%" stopColor="#E87722" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#E87722" stopOpacity="0" />
        </radialGradient>
        <filter id="lm-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <rect width="520" height="340" fill="url(#lm-sea)" />
      <circle cx="150" cy="150" r="150" fill="url(#lm-sun)" />

      {/* Depth contours */}
      <g fill="none" stroke="#1B4F8A" strokeOpacity="0.3" strokeWidth="0.9">
        <path d="M-10 248c100-28 200-18 320 10 88 20 160 14 220-6" />
        <path d="M-10 276c110-26 210-16 330 12 84 19 150 14 220-8" />
        <path d="M-10 304c120-24 220-14 340 14 80 18 140 12 210-10" />
      </g>

      {/* Shipping lanes */}
      <g stroke="#8AA9D3" strokeOpacity="0.32" strokeWidth="1" strokeDasharray="7 9" fill="none">
        <path d="M-10 224C130 186 320 172 540 212" />
        <path d="M-10 302C170 268 350 262 540 292" />
      </g>

      {/* Landmass */}
      <path
        d="M0 0h520v40c-42 6-76 18-100 40-28 24-40 56-62 86-18 24-36 42-60 54-32 16-70 19-114 15-52-5-100 2-146 19-28 10-48 22-62 34z"
        fill="url(#lm-land)"
        stroke="#8AA9D3"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <path
        d="M0 0h520v40c-42 6-76 18-100 40-28 24-40 56-62 86-18 24-36 42-60 54-32 16-70 19-114 15-52-5-100 2-146 19-28 10-48 22-62 34"
        fill="none"
        stroke="#4E7DB8"
        strokeWidth="2"
        opacity="0.75"
      />

      {/* Inland grid */}
      <g stroke="#8AA9D3" strokeOpacity="0.15" strokeWidth="0.8">
        <path d="M60 0v124M140 0v108M220 0v98M300 0v80M380 0v58M460 0v42" />
        <path d="M0 42h466M0 80h436M0 118h398" />
      </g>

      {/* Port nodes along the coast */}
      <g>
        {[
          [92, 128, 2.4],
          [138, 158, 2.8],
          [196, 196, 4],
          [252, 220, 2.4],
          [318, 232, 2.2],
          [128, 106, 2.2],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#4E7DB8" opacity="0.7" />
        ))}
      </g>

      {/* Yanbu marker */}
      <circle cx="196" cy="196" r="48" fill="url(#lm-pin)" filter="url(#lm-soft)" />
      <g>
        <path
          d="M196 150c-13.6 0-24.6 11-24.6 24.6 0 17.8 24.6 41.4 24.6 41.4s24.6-23.6 24.6-41.4c0-13.6-11-24.6-24.6-24.6Z"
          fill="#E87722"
        />
        <circle cx="196" cy="174" r="9" fill="#0A1A33" />
        <circle cx="196" cy="174" r="4.2" fill="#fff" />
      </g>
      <circle cx="196" cy="174" r="17" fill="none" stroke="#E87722" strokeWidth="1.4" opacity="0.8">
        <animate attributeName="r" values="15;36;15" dur="3.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.75;0;0.75" dur="3.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="196" cy="174" r="28" fill="none" stroke="#E87722" strokeWidth="1.1" opacity="0.6">
        <animate attributeName="r" values="26;48;26" dur="3.4s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="3.4s" begin="1.2s" repeatCount="indefinite" />
      </circle>

      {/* Compass rose */}
      <g transform="translate(452 300)" opacity="0.6">
        <circle r="22" fill="none" stroke="#8AA9D3" strokeWidth="1" />
        <path d="M0-16 5 4 0 0-5 4Z" fill="#E87722" />
        <path d="M0 16 5-4 0 0-5-4Z" fill="#8AA9D3" opacity="0.7" />
      </g>
      <text x="452" y="332" textAnchor="middle" fontSize="10" fill="#8AA9D3" opacity="0.7" fontFamily="system-ui">
        N
      </text>
      <text
        x="26"
        y="322"
        fontSize="9"
        fill="#8AA9D3"
        opacity="0.55"
        fontFamily="system-ui"
        letterSpacing="1.6"
      >
        {isAr ? 'البحر الأحمر' : 'RED SEA'}
      </text>
    </svg>
  );
}

export function LocationSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.location;
  const isAr = locale === 'ar';

  const factIcons = [
    // pin
    <path key="a" d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />,
    // clock
    <g key="b">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </g>,
    // building
    <g key="c">
      <path d="M3 21h18M5 21V8l7-5 7 5v13" />
      <path d="M9 21v-6h6v6" />
    </g>,
  ];

  return (
    <Section
      id="location"
      tone="soft"
      labelledBy="location-title"
      containerClassName="shell"
      className="border-b border-navy-100"
    >
      <SectionTitle
        eyebrow={t.eyebrow}
        eyebrowEn={t.eyebrowEn}
        title={t.title}
        lead={t.lead}
        tone="light"
        titleId="location-title"
      />

      {/*
        One row, two balanced columns. Previously this was three stacked rows
        of mismatched-height cards, which read as clutter; here the map owns the
        start side and every supporting card shares a single column height.
      */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Map — stretches to match the supporting column so the row reads as one
            block instead of a tall card beside a short one. */}
        <RevealX className="relative h-full">
          <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 shadow-card-lg">
            <div className="relative min-h-[280px] flex-1">
              <YanbuMap label={t.mapLabel} isAr={isAr} />
            </div>

            {/* City plate — one surface, so the label never sits raw on the map */}
            <div className="on-dark absolute bottom-4 start-4 end-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-navy-900/90 px-4 py-3 backdrop-blur-md">
              <div className="min-w-0">
                <p className="font-display text-body-md font-bold text-white">{t.cityAr}</p>
                <p lang="en" className="truncate font-inter text-label-xs uppercase tracking-[0.12em] text-muted">
                  {t.regionEn}
                </p>
              </div>
              <span aria-hidden="true" className="h-8 w-px shrink-0 bg-white/15" />
              <div className="min-w-0 shrink-0">
                <p className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-orange-400">
                  {t.coastEn}
                </p>
              </div>
            </div>
          </div>
        </RevealX>

        {/* Facts + dates + countdown */}
        <div className="flex flex-col gap-6 lg:h-full">
          {/* Facts as one divided list rather than three separate cards.
              dt/dd must stay direct children of a single wrapper div — a second
              nested div breaks the definition-list contract. */}
          <RevealX from="end">
            <dl className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              {t.facts.map((fact, i) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-0.5 border-b border-[var(--hairline)] px-5 py-4 last:border-b-0"
                >
                  <IconMark tone="light" size="sm" className="row-span-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {factIcons[i] ?? factIcons[0]}
                    </svg>
                  </IconMark>
                  <dt className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="text-body-md font-bold text-strong">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </RevealX>

          {/* Dates + countdown in a single dark card */}
          <RevealX from="end" delay={0.08}>
            <div className="on-dark relative overflow-hidden rounded-2xl bg-navy-900 p-6 shadow-card-lg">
              <span aria-hidden="true" className="accent-bar absolute inset-x-0 top-0" />

              <div className="relative flex items-start gap-4">
                <IconMark tone="solid" size="sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="16" rx="2.5" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                </IconMark>
                <div className="min-w-0 flex-1">
                  <p className="text-label-2xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {t.datesTitle}
                  </p>
                  <p className="mt-1 font-display text-display-sm font-bold text-white">
                    {t.startDate}
                  </p>
                  <p className="mt-0.5 text-body-sm text-orange-300">{t.duration}</p>
                </div>
              </div>

              <div className="relative mt-6 border-t border-white/10 pt-5">
                <Countdown targetISO={dict.event.startISO} dict={dict} locale={locale} tone="dark" />
              </div>
            </div>
          </RevealX>
        </div>
      </div>

      {/* Venue — full width strip, so a "to be announced" item never leaves a
          half-empty column beside it. */}
      <RevealX className="mt-6" delay={0.12}>
        <div className="flex flex-col gap-5 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:gap-6 sm:p-7">
          <IconMark tone="light" size="md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20V9l8-5 8 5v11" />
              <path d="M9 20v-5h6v5M4 20h16" />
            </svg>
          </IconMark>

          <div className="min-w-0 flex-1">
            <p className="text-label-2xs font-semibold uppercase tracking-[0.16em] text-muted">
              {t.venueTitle}
            </p>
            <p className="mt-1 font-display text-display-sm font-bold text-accent">{t.venueTba}</p>
          </div>

          <p className="max-w-prose text-body-sm text-body sm:max-w-sm">{t.venueNote}</p>

          <div className="flex shrink-0 flex-col gap-2.5 sm:w-44">
            <a href="#register" className="btn-primary w-full">
              {dict.hero.ctaPrimary}
            </a>
            <a href="#register" className="btn-outline-dark w-full">
              {dict.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </RevealX>
    </Section>
  );
}