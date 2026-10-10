'use client';

import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Motion';
import { IconMark } from './ui/Photo';
import { journeyIcons } from './ui/Icons';

export function BusinessValue({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.businessValue;

  return (
    <Section
      id="business-value"
      tone="white"
      labelledBy="business-value-title"
      containerClassName="shell"
      className="border-b"
    >
      <SectionTitle
        eyebrow={t.eyebrow}
        eyebrowEn={t.eyebrowEn}
        title={t.title}
        lead={t.lead}
        tone="light"
        titleId="business-value-title"
        align="center"
        className="mx-auto max-w-3xl"
      />

      {/* Vertical journey — a hairline rail on the inline-start edge, with the
          marker sitting in its own box. Text never shares a line with a mark. */}
      <RevealGroup as="ol" className="mt-14" stagger={0.06} amount={0.06}>
        {t.items.map((step, i) => {
          const Icon = journeyIcons[i] ?? journeyIcons[0];

          return (
            <RevealItem as="li" key={step.number}>
              <div className="relative grid gap-5 border-t py-7 ps-0 sm:grid-cols-[auto_1fr] sm:gap-8 sm:ps-0">
                {/* Marker column */}
                <div className="flex items-center gap-4 sm:w-40 sm:flex-col sm:items-start sm:gap-3">
                  <IconMark tone="solid" size="lg">
                    <Icon width={24} height={24} />
                  </IconMark>
                  <span className="numeral text-display-sm text-muted sm:text-display-md">{step.number}</span>
                </div>

                {/* Copy column */}
                <div className="min-w-0">
                  <h3 className="text-display-sm font-bold text-strong">{step.title}</h3>
                  <p className="mt-1.5 text-body-md font-semibold text-accent">{step.subtitle}</p>
                  <p className="mt-3 max-w-3xl text-body-lg text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            </RevealItem>
          );
        })}
        <RevealItem as="li">
          <div className="border-t" aria-hidden="true" />
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}