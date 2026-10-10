'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Motion';
import { IconMark } from './ui/Photo';
import { themeIcons } from './ui/Icons';

export function KeyThemes({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [activeId, setActiveId] = useState(dict.themes.items[0].id);
  const reduce = useReducedMotion() ?? false;
  const active = dict.themes.items.find((i) => i.id === activeId) ?? dict.themes.items[0];
  const ActiveIcon = themeIcons[active.id] ?? themeIcons.corridors;
  const isAr = locale === 'ar';

  return (
    <Section
      id="themes"
      tone="soft"
      labelledBy="themes-title"
      containerClassName="shell"
      className="border-b"
    >
      <SectionTitle
        eyebrow={dict.themes.eyebrow}
        eyebrowEn={dict.themes.eyebrowEn}
        title={dict.themes.title}
        lead={dict.themes.lead}
        tone="light"
        titleId="themes-title"
        align="center"
        className="mx-auto max-w-3xl"
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-14">
        {/* Selector list */}
        <RevealGroup as="ul" className="divide-y" stagger={0.06} amount={0.08}>
          {dict.themes.items.map((theme) => {
            const isActive = theme.id === activeId;
            const Icon = themeIcons[theme.id] ?? themeIcons.corridors;

            return (
              <RevealItem as="li" key={theme.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(theme.id)}
                  onMouseEnter={() => setActiveId(theme.id)}
                  onFocus={() => setActiveId(theme.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'group flex w-full items-center gap-5 py-5 text-start transition-colors duration-300',
                    isActive ? 'text-strong' : 'text-body hover:text-strong',
                  )}
                >
                  <span className="numeral w-7 shrink-0 text-body-xs text-accent">
                    {theme.number}
                  </span>

                  {/* Icon in its own bordered box, with fixed spacing around it */}
                  <IconMark tone="light" size="md" className={isActive ? 'border-orange-400' : ''}>
                    <Icon width={20} height={20} className={isActive ? 'text-orange-700' : ''} />
                  </IconMark>

                  <span className="min-w-0 flex-1">
                    <span className="block text-display-sm font-bold">{theme.title}</span>
                    <span lang="en" className="mt-1 block font-inter text-label-sm text-muted">
                      {theme.en}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      'shrink-0 text-body-lg transition-colors',
                      isActive ? 'text-orange-600' : 'text-muted',
                    )}
                  >
                    ‹
                  </span>
                </button>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Detail panel — a plain bordered card. The copy starts below the icon,
            never beside or behind it. */}
        <div>
          <RevealGroup stagger={0.06}>
            <RevealItem>
              <div
                className="rounded-2xl border bg-white p-7"
                style={{ minHeight: '18rem' }}
              >
                <div className="flex items-center gap-4">
                  <IconMark tone="light" size="lg" className="border-orange-300">
                    <ActiveIcon width={24} height={24} className="text-orange-700" />
                  </IconMark>
                  <span className="numeral text-display-lg text-body">{active.number}</span>
                </div>

                <motion.h3
                  key={`h-${active.id}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 text-display-sm text-strong"
                >
                  {active.title}
                </motion.h3>

                <p lang="en" className="mt-2 font-inter text-body-sm text-muted">
                  {active.en}
                </p>

                <motion.p
                  key={`p-${active.id}`}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="mt-6 border-t pt-6 text-body-lg text-body"
                >
                  {active.description}
                </motion.p>
              </div>
            </RevealItem>

            <RevealItem>
              <p className="mt-4 text-label-sm text-muted">
                {isAr
                  ? `${dict.themes.items.length} محاور رئيسية تصوغ محتوى المعرض وبرنامج نسقه.`
                  : `${dict.themes.items.length} themes shaping the Exhibition content and its conference programme.`}
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}