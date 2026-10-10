'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Motion';
import { IconMark } from './ui/Photo';
import { objectiveGroupIcons } from './ui/Icons';

const CLUSTERS = [
  { id: 'trade', numbers: ['01', '02', '03'], ar: 'التعاون التجاري والاستثماري', en: 'Commercial & investment cooperation' },
  { id: 'platform', numbers: ['04', '05', '06'], ar: 'منصة أعمال واحدة وكفاءة الحركة', en: 'One platform, efficient cargo movement' },
  { id: 'position', numbers: ['07', '08', '09'], ar: 'المكانة والتكامل والتقنية', en: 'Position, integration & technology' },
  { id: 'capital', numbers: ['10', '11', '12'], ar: 'الاستثمار والحوار والناشئة', en: 'Investment, dialogue & startups' },
];

export function Objectives({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion() ?? false;
  const items = dict.objectives.items;
  const isAr = locale === 'ar';

  return (
    <Section
      id="objectives"
      tone="white"
      labelledBy="objectives-title"
      containerClassName="shell"
      className="border-b"
    >
      <SectionTitle
        eyebrow={dict.objectives.eyebrow}
        eyebrowEn={dict.objectives.eyebrowEn}
        title={dict.objectives.title}
        tone="light"
        titleId="objectives-title"
        align="center"
        className="mx-auto max-w-3xl"
      />

      <RevealGroup as="ul" className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08} amount={0.08}>
        {CLUSTERS.map((cluster, ci) => {
          const Icon = objectiveGroupIcons[ci] ?? objectiveGroupIcons[0];
          const clusterItems = items.filter((i) => cluster.numbers.includes(i.number));

          return (
            <RevealItem as="li" key={cluster.id}>
              <div className="flex h-full flex-col">
                {/* Header: icon box, then text below it — never side by side */}
                <IconMark tone="solid" size="lg">
                  <Icon width={24} height={24} />
                </IconMark>

                <p className="numeral mt-5 text-label-xs text-accent">
                  {cluster.numbers[0]} — {cluster.numbers[cluster.numbers.length - 1]}
                </p>
                <h3 className="mt-1.5 text-body-md font-bold text-strong">
                  {isAr ? cluster.ar : cluster.en}
                </h3>

                <ul className="mt-5 divide-y border-t">
                  {clusterItems.map((item) => {
                    const expanded = open === item.number;
                    return (
                      <li key={item.number}>
                        <button
                          type="button"
                          onClick={() => setOpen((prev) => (prev === item.number ? null : item.number))}
                          onMouseEnter={() => setOpen(item.number)}
                          onMouseLeave={() => setOpen(null)}
                          onFocus={() => setOpen(item.number)}
                          onBlur={() => setOpen(null)}
                          aria-expanded={expanded}
                          className={cn(
                            'flex w-full items-start gap-3 py-3.5 text-start transition-colors duration-300',
                            expanded ? 'text-strong' : 'text-body hover:text-strong',
                          )}
                        >
                          <span className="numeral w-6 shrink-0 text-label-xs text-accent">
                            {item.number}
                          </span>
                          <span className="min-w-0 flex-1 text-body-sm font-semibold">
                            {item.title}
                          </span>
                        </button>

                        <motion.div
                          initial={false}
                          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                          aria-hidden={!expanded}
                        >
                          <p className="pb-4 ps-9 text-body-xs text-muted">
                            {item.description}
                          </p>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* Hub summary */}
      <RevealGroup className="mt-14" stagger={0.06}>
        <RevealItem>
          <div className="on-dark flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-navy-900 px-7 py-7 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="numeral text-display-lg text-white">{items.length}</span>
              <div>
                <p className="font-display text-body-lg font-bold text-white">
                  {isAr ? dict.objectives.hubLabelAr : dict.objectives.hubLabelEn}
                </p>
                <p className="mt-1 text-body-sm text-muted">
                  {isAr
                    ? 'أهداف مترابطة تصب في منظومة لوجستية واحدة.'
                    : 'Interlocking objectives that build a single logistics ecosystem.'}
                </p>
              </div>
            </div>
            <a href="#register" className="btn btn-ghost-dark shrink-0 px-6">
              {dict.nav.cta}
            </a>
          </div>
        </RevealItem>
      </RevealGroup>

      {/* Complete list for search engines and assistive tech */}
      <RevealGroup className="mt-8" stagger={0.05}>
        <RevealItem>
          <details className="rounded-2xl border bg-[var(--surface-alt)] px-6 py-5">
            <summary className="cursor-pointer text-body-sm font-semibold text-strong marker:hidden">
              {isAr ? 'عرض القائمة الكاملة للأهداف' : 'View the complete objectives list'}
            </summary>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <li key={item.number} className="flex gap-3 text-body-sm text-muted">
                  <span className="numeral shrink-0 text-accent">{item.number}</span>
                  <span>{item.description}</span>
                </li>
              ))}
            </ol>
          </details>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}