'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Motion';
import { IconMark } from './ui/Photo';
import { visitorIcons } from './ui/Icons';

export function TargetVisitors({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const groups = dict.visitors.items;
  const isAr = locale === 'ar';
  const totalRoles = groups.reduce((sum, g) => sum + g.roles.length, 0);

  return (
    <Section
      id="visitors"
      tone="soft"
      labelledBy="visitors-title"
      containerClassName="shell"
      className="border-b"
    >
      <SectionTitle
        eyebrow={dict.visitors.eyebrow}
        eyebrowEn={dict.visitors.eyebrowEn}
        title={dict.visitors.title}
        lead={dict.visitors.lead}
        tone="light"
        titleId="visitors-title"
        align="center"
        className="mx-auto max-w-3xl"
      />

      {/* Hub readout — three plain figures, hairline separated */}
      <RevealGroup className="mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x" stagger={0.06}>
        {[
          { value: groups.length, label: isAr ? 'شرائح الجمهور' : 'Audience segments' },
          { value: totalRoles, label: isAr ? 'دورًا مستهدفًا' : 'Target roles' },
          { value: isAr ? dict.visitors.hubAr : dict.visitors.hubEn, label: isAr ? 'المحور' : 'Hub' },
        ].map((item) => (
          <RevealItem key={item.label}>
            <div className="px-4 text-center">
              <p className="numeral text-display-md text-strong">{item.value}</p>
              <p className="mt-1 text-label-2xs font-semibold uppercase tracking-[0.12em] text-muted">
                {item.label}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2" stagger={0.07} amount={0.08}>
        {groups.map((group) => {
          const Icon = visitorIcons[group.id] ?? visitorIcons.executive;
          const isActive = activeId === group.id;

          return (
            <RevealItem as="li" key={group.id}>
              <article
                onMouseEnter={() => setActiveId(group.id)}
                onFocus={() => setActiveId(group.id)}
                onMouseLeave={() => setActiveId(null)}
                className={cn(
                  'flex h-full flex-col rounded-2xl border bg-white p-6 transition-colors duration-300',
                  isActive ? 'border-navy-900' : 'border-[var(--hairline)]',
                )}
              >
                {/* Icon box on its own row */}
                <div className="flex items-center justify-between gap-4">
                  <IconMark tone="solid" size="lg">
                    <Icon width={24} height={24} />
                  </IconMark>
                  <span className="numeral text-label-sm text-accent">{group.number}</span>
                </div>

                <h3 className="mt-5 text-display-sm font-bold text-strong">
                  {group.title}
                </h3>
                <p lang="en" className="mt-1 font-inter text-label-sm text-muted">
                  {group.en}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2 border-t pt-5">
                  {group.roles.map((role) => (
                    <li
                      key={role}
                      className="rounded-full border border-[var(--hairline)] bg-[var(--surface-alt)] px-3 py-1.5 text-label-xs font-medium leading-tight text-body"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}