'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Motion';
import { IconMark } from './ui/Photo';
import { stationIcons } from './ui/Icons';

export function EventExperience({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.experience;
  const stations = t.items;
  const isAr = locale === 'ar';

  /*
   * Three sources of "active", in priority order: an explicit click outranks
   * hover, which outranks keyboard focus. A click therefore sticks — previously
   * moving the pointer away silently undid it, which read as a broken control.
   */
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const activeNumber = pinned ?? hovered ?? focused;

  const renderGroup = (group: typeof stations, offset: number) => (
    <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.05} amount={0.06}>
      {group.map((station, idx) => {
        const Icon = stationIcons[offset + idx] ?? stationIcons[0];
        const isActive = activeNumber === station.number;

        return (
          <RevealItem as="li" key={station.number}>
            <button
              type="button"
              onClick={() => setPinned((prev) => (prev === station.number ? null : station.number))}
              onMouseEnter={() => setHovered(station.number)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setFocused(station.number)}
              onBlur={() => setFocused(null)}
              aria-pressed={isActive}
              className={cn(
                'flex h-full w-full flex-col rounded-2xl border p-5 text-start transition-colors duration-300',
                isActive
                  ? 'border-orange-400 bg-orange-500/10'
                  : 'border-white/12 bg-white/[0.03] hover:border-white/30',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <IconMark tone="dark" size="sm">
                  <Icon width={18} height={18} />
                </IconMark>
                <span className="numeral text-label-sm text-orange-400">{station.number}</span>
              </div>

              <h3 className="mt-4 text-body-md font-bold text-white">{station.title}</h3>
              <p lang="en" className="mt-1.5 font-inter text-label-2xs leading-tight text-muted">
                {station.en}
              </p>

              <motion.div
                initial={false}
                animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
                aria-hidden={!isActive}
              >
                <p className="mt-4 border-t border-white/12 pt-4 text-body-xs text-body">
                  {station.description}
                </p>
              </motion.div>
            </button>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );

  return (
    <Section id="experience" tone="dark" labelledBy="experience-title" containerClassName="shell">
      <SectionTitle
        eyebrow={t.eyebrow}
        eyebrowEn={t.eyebrowEn}
        title={t.title}
        lead={t.lead}
        tone="dark"
        titleId="experience-title"
        align="center"
        className="mx-auto max-w-3xl"
      />

      <div className="mt-14 space-y-12">
        <div>
          <RevealGroup className="mb-6" stagger={0.04}>
            <RevealItem>
              <p className="text-label-2xs font-semibold uppercase tracking-[0.16em] text-orange-400">
                {t.groupA}
              </p>
            </RevealItem>
          </RevealGroup>
          {renderGroup(stations.slice(0, 5), 0)}
        </div>

        <div>
          <RevealGroup className="mb-6" stagger={0.04}>
            <RevealItem>
              <p className="text-label-2xs font-semibold uppercase tracking-[0.16em] text-orange-400">
                {t.groupB}
              </p>
            </RevealItem>
          </RevealGroup>
          {renderGroup(stations.slice(5, 10), 5)}
        </div>
      </div>

      <RevealGroup className="mt-12" stagger={0.06}>
        <RevealItem>
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/12 px-7 py-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              <span className="numeral text-display-lg text-orange-400">{stations.length}</span>
              <div>
                <p className="font-display text-display-sm font-bold text-white">
                  {isAr
                    ? 'برنامج متكامل من الفعاليات والأنشطة المصاحبة'
                    : 'An integrated programme of activities and side events'}
                </p>
                <p className="mt-1 text-body-sm text-muted">
                  {isAr
                    ? 'تعزّز القيمة التجارية والمعرفية للحدث من أوله إلى آخره.'
                    : 'Enhancing the commercial value and awareness of the event from start to finish.'}
                </p>
              </div>
            </div>
            <a href="#register" className="btn btn-ghost-dark shrink-0">
              {dict.nav.cta}
            </a>
          </div>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}