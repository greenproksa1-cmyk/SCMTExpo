'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';

export function TimingSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.timing;
  const isAr = locale === 'ar';
  const reduce = useReducedMotion() ?? false;

  const pills = [
    { id: '1', labelAr: 'كبرى الشركات الغذائية', labelEn: 'Major Food Companies' },
    { id: '2', labelAr: 'شركات الإعاشة والتموين الغذائي', labelEn: 'Catering & Food Supply Companies' },
    { id: '3', labelAr: 'موردي معدات المطابخ المركزية', labelEn: 'Central Kitchen Equipment Suppliers' },
    { id: '4', labelAr: 'صانعو القرار الفعليين من بعثات الحج الدولية', labelEn: 'Actual Decision-Makers from International Hajj Delegations' },
    { id: '5', labelAr: 'الفنادق الفاخرة في مكة المكرمة', labelEn: 'Luxury Hotels in Makkah Al-Mukarramah' },
  ];

  return (
    <Section
      id="timing"
      tone="dark"
      labelledBy="timing-title"
      containerClassName="shell"
    >
      <SectionTitle
        eyebrow={t.eyebrow}
        eyebrowEn={t.eyebrowEn}
        title={t.title}
        lead={t.lead}
        tone="dark"
        titleId="timing-title"
        className="max-w-2xl"
      />

      <div className="mt-14 space-y-12">
        <p className="text-label-sm font-semibold uppercase tracking-[0.1em] text-orange-400 mb-6">
          {isAr ? 'أفكار المعرض وتوقيته' : 'Exhibition Idea and Timing'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pills/stats row */}
          <motion.div
            className="bg-white/[0.03] border border-white/12 rounded-2xl p-6 sm:p-8 lg:p-10"
            animatePresence
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {pills.map((pill) => (
                <motion.span
                  key={pill.id}
                  className={cn(
                    'flex-1 rounded-full bg-navy-900/50 p-3.5 text-orange-400 text-sm font-medium transition-all duration-300 hover:bg-navy-900/80 hover:text-orange-500',
                    isAr && 'rtl:pr-8'
                  )}
                >
                  {pill.labelAr}
                  {isAr && <span className="ml-2 text-orange-300">•</span>}
                  {!isAr && <span className="ml-2 text-orange-300">•</span>}
                </motion.span>
              ))}
            </div>
            <p className="mt-4 text-orange-300 text-sm font-medium">
              {isAr ? 'نقاط التواصل الرئيسية' : 'Key Connection Points'}
            </p>
          </motion.div>
        </div>

        <div className="mt-12 bg-white/[0.03] border border-white/12 rounded-2xl p-6 sm:p-8 lg:p-10">
          <p className="text-orange-400 text-sm font-medium uppercase tracking-[0.15em] mb-6">
            {isAr ? 'الجسر التجاري' : 'The Trade Bridge'}
          </p>
          <blockquote className="font-display font-bold text-2xl text-orange-400">{t.closingLine}</blockquote>
        </div>
      </div>
    </Section>
  );
}