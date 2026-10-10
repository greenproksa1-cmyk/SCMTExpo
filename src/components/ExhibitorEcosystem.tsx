'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Motion';
import { IconMark } from './ui/Photo';
import { sectorIcons } from './ui/Icons';

export function ExhibitorEcosystem({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [activeId, setActiveId] = useState(dict.ecosystem.items[0].id);
  const reduce = useReducedMotion() ?? false;
  const sectors = dict.ecosystem.items;
  const active = sectors.find((s) => s.id === activeId) ?? sectors[0];
  const ActiveIcon = sectorIcons[active.id] ?? sectorIcons.logistics;
  const isAr = locale === 'ar';

  return (
    <Section
      id="ecosystem"
      tone="dark"
      labelledBy="ecosystem-title"
      containerClassName="shell"
    >
      <SectionTitle
        eyebrow={dict.ecosystem.eyebrow}
        eyebrowEn={dict.ecosystem.eyebrowEn}
        title={dict.ecosystem.title}
        lead={dict.ecosystem.lead}
        tone="dark"
        titleId="ecosystem-title"
        className="max-w-3xl"
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* Sector list */}
        <RevealGroup as="ul" className="divide-y divide-white/12" stagger={0.05} amount={0.06}>
          {sectors.map((sector) => {
            const isActive = sector.id === activeId;
            const Icon = sectorIcons[sector.id] ?? sectorIcons.logistics;

            return (
              <RevealItem as="li" key={sector.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(sector.id)}
                  onMouseEnter={() => setActiveId(sector.id)}
                  onFocus={() => setActiveId(sector.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex w-full items-center gap-4 py-4 text-start transition-colors duration-300',
                    isActive ? 'text-white' : 'text-muted hover:text-white',
                  )}
                >
                  <span className="numeral w-7 shrink-0 text-label-sm text-orange-400">
                    {sector.number}
                  </span>

                  <IconMark tone="dark" size="sm" className={isActive ? 'border-orange-400' : ''}>
                    <Icon width={18} height={18} className={isActive ? 'text-orange-300' : ''} />
                  </IconMark>

                  <span className="min-w-0 flex-1 text-body-md font-bold">
                    {isAr ? sector.title : sector.en}
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      'shrink-0 text-label-xs',
                      isActive ? 'text-orange-300' : 'text-muted',
                    )}
                  >
                    {sector.details.length}
                  </span>
                </button>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Detail panel: photo on top, then a separate text block below it */}
        <div id="sector-detail" aria-live="polite">
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04]"
          >
            {active.image && (
              <div className="relative aspect-[16/9] w-full bg-white/[0.06]">
                <Image
                  src={active.image}
                  alt={active.imageAltAr ?? ''}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-85"
                />
              </div>
            )}

            <div className="p-6 sm:p-7">
              <IconMark tone="dark" size="lg" className="border-orange-400">
                <ActiveIcon width={24} height={24} className="text-orange-300" />
              </IconMark>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="numeral text-display-md text-orange-400">{active.number}</span>
                <h3 className="text-display-sm text-white">{isAr ? active.title : active.en}</h3>
              </div>

              <p lang="en" className="mt-1.5 font-inter text-body-xs text-muted">
                {active.en}
              </p>

              <ul className="mt-6 grid gap-x-6 gap-y-2 border-t border-white/12 pt-6 sm:grid-cols-2">
                {active.details.map((detail, i) => (
                  <li
                    key={detail}
                    className="flex items-start gap-3 border-b border-white/8 pb-2.5 text-body-sm text-body"
                  >
                    <span aria-hidden="true" className="numeral shrink-0 text-label-2xs text-orange-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <p className="sr-only">{isAr ? dict.ecosystem.hubAr : dict.ecosystem.hubEn}</p>
    </Section>
  );
}