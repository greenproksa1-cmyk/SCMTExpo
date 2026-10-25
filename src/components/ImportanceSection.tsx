'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';

interface ImportanceStat {
  value: string;
  labelAr: string;
  labelEn: string;
  subLabelAr?: string;
  subLabelEn?: string;
}

export function ImportanceSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.importance;
  const isAr = locale === 'ar';
  const reduce = useReducedMotion() ?? false;

  return (
    <Section
      id="importance"
      tone="dark"
      labelledBy="importance-title"
      containerClassName="shell"
      className="border-b"
    >
      <SectionTitle
        eyebrow={t.eyebrow}
        eyebrowEn={t.eyebrowEn}
        title={t.title}
        lead={t.closingText}
        tone="dark"
        titleId="importance-title"
        className="max-w-2xl"
      />

      <div className="mt-14 space-y-12">
        <div>
          <p className="text-label-sm font-semibold uppercase tracking-[0.1em] text-orange-400 mb-4">
            {isAr ? 'موقع الحدث الاستراتيجي' : 'Strategic Event Location'}
          </p>
          <div className="bg-white/[0.03] border border-white/12 rounded-2xl p-6 sm:p-8 md:p-10">
            <p className="text-body-lg text-body">{t.text}</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <span
                    className="numeral text-orange-400 text-2xl font-bold mt-1 flex-shrink-0"
                  >
                    {stat.value}
                  </span>
                  <div className="min-w-0">
                    <p className="text-body font-medium text-strong">
                      {isAr ? stat.labelAr : stat.labelEn}
                    </p>
                    {stat.subLabel && (
                      <p className="text-label-xs text-muted mt-1">
                        {isAr ? stat.subLabelAr : stat.subLabelEn}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-label-sm font-semibold uppercase tracking-[0.1em] text-orange-400 mb-4">
            {isAr ? 'اسمي المعرض' : 'Exhibition Tagline'}
          </p>
          <blockquote className="bg-white/[0.03] border-l-4 border-orange-500 rounded-xl p-6 sm:p-8 md:p-10 text-body-lg text-body">
            <p className="arabic:italic rtl:pl-8 rtl:pr-8">{t.closingText}</p>
          </blockquote>
        </div>
      </div>
    </Section>
  );
}