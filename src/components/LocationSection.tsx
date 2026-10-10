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

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
        {/* Map card */}
        <RevealX className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-navy-100 shadow-card-lg">
            <div className="relative aspect-[26/17] w-full">
              <YanbuMap label={t.mapLabel} isAr={isAr} />
            </div>

            {/* Photo inset */}
            <div className="absolute bottom-4 start-4 h-24 w-32 overflow-hidden rounded-2xl border-2 border-white/25 shadow-lg sm:h-28 sm:w-40">
              <Image src="/images/location-yanbu.jpg" alt="" fill sizes="160px" className="object-cover" />
            </div>

            {/* City plate */}
            <div className="absolute bottom-4 end-4 rounded-2xl border border-white/12 bg-navy-900/85 px-4 py-3 backdrop-blur-xl">
              <p className="font-display text-body-md font-bold text-white">{t.cityEn}</p>
              <p className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-orange-400">
                {t.coastEn}
              </p>
            </div>
          </div>
        </RevealX>

        {/* Facts + venue + countdown */}
        <div>
          <RevealX from="end">
            <RevealGroup className="grid gap-3 sm:grid-cols-3" stagger={0.06}>
              {t.facts.map((fact, i) => (
                <RevealItem key={fact.label}>
                  <div className="h-full rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                    <IconMark tone="light" size="sm">
                      {i === 0 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                          <circle cx="12" cy="10" r="2.6" />
                        </svg>
                      ) : i === 1 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3.5 2" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18M5 21V8l7-5 7 5v13" />
                          <path d="M9 21v-6h6v6" />
                        </svg>
                      )}
                    </IconMark>
                    <p className="mt-3 text-label-2xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {fact.label}
                    </p>
                    <p className="mt-1 text-body-md font-bold text-strong">{fact.value}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </RevealX>

          <RevealX from="end" delay={0.08}>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Venue — not specified in the profile */}
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-navy-200 bg-white p-6 shadow-card">
                <span aria-hidden="true" className="accent-bar absolute inset-x-0 top-0" />
                <IconMark tone="light" size="sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20V9l8-5 8 5v11" />
                    <path d="M9 20v-5h6v5M4 20h16" />
                  </svg>
                </IconMark>
                <p className="mt-3 text-label-2xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {t.venueTitle}
                </p>
                <p className="mt-1.5 font-display text-display-sm font-bold text-accent">{t.venueTba}</p>
                <p className="mt-2 text-body-sm text-body">{t.venueNote}</p>
              </div>

              {/* Dates + countdown */}
              <div className="on-dark relative overflow-hidden rounded-2xl bg-navy-900 p-6 shadow-card-lg">
                <span aria-hidden="true" className="accent-bar absolute inset-x-0 top-0" />
                
                <div className="relative">
                  <IconMark tone="solid" size="sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="16" rx="2.5" />
                      <path d="M3 10h18M8 3v4M16 3v4" />
                    </svg>
                  </IconMark>
                  <p className="mt-3 text-label-2xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {t.datesTitle}
                  </p>
                  <p className="mt-1.5 font-display text-display-sm font-bold text-white">{t.startDate}</p>
                  <p className="mt-1 text-body-sm text-orange-300">{t.duration}</p>
                </div>

                <div className="relative mt-5">
                  <Countdown targetISO={dict.event.startISO} dict={dict} locale={locale} tone="dark" />
                </div>
              </div>
            </div>
          </RevealX>

          <RevealGroup className="mt-4 grid gap-3 sm:grid-cols-2" stagger={0.06}>
            <RevealItem>
              <a href="#register" className="btn-primary w-full">
                {dict.hero.ctaPrimary}
              </a>
            </RevealItem>
            <RevealItem>
              <a href="#register" className="btn-outline-dark w-full">
                {dict.hero.ctaSecondary}
              </a>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}