'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';

interface PartnerLogo {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  roleAr: string;
  roleEn: string;
  logoScale: number;
  logoW: number;
  logoH: number;
}

export function PartnersSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.partnersGrid;
  const isAr = locale === 'ar';
  const reduce = useReducedMotion() ?? false;

  const partnerLogos: PartnerLogo[] = [
    {
      id: 'mawani',
      nameAr: 'أمانة العاصمة المقدسة',
      nameEn: 'Holy Makkah Municipality',
      logo: '/images/partners/mawani.png',
      roleAr: 'تنظيم الفعاليات البلدية',
      roleEn: 'Municipal event regulation',
      logoScale: 45,
      logoW: 600,
      logoH: 300,
    },
    {
      id: 'tourism',
      nameAr: 'الهيئة السعودية للسياحة',
      nameEn: 'Saudi Tourism Authority',
      logo: '/images/partners/tga.png',
      roleAr: 'دعم القطاع السياحي',
      roleEn: 'Tourism sector support',
      logoScale: 40,
      logoW: 550,
      logoH: 280,
    },
    {
      id: 'cateringTable',
      nameAr: 'طاولة متعهدي الإعاشة',
      nameEn: 'Catering Contractors Table',
      logo: '/images/partners/tga.png',
      roleAr: 'معيار الإعاشة والمشاعر المقدسة',
      roleEn: 'Catering standards for Makkah and Arafat',
      logoScale: 38,
      logoW: 500,
      logoH: 260,
    },
    {
      id: 'gmc',
      nameAr: 'غرفة مكة المكرمة',
      nameEn: 'Makkah Chamber',
      logo: '/images/partners/rcjy.png',
      roleAr: 'تنظيم القطاع التجاري',
      roleEn: 'Commercial sector regulation',
      logoScale: 42,
      logoW: 580,
      logoH: 290,
    },
  ];

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <Section
      id="partners-grid"
      tone="dark"
      labelledBy="partners-grid-title"
      containerClassName="shell"
    >
      <SectionTitle
        eyebrow={t.eyebrow}
        eyebrowEn={t.eyebrowEn}
        title={t.title}
        lead={t.leadAr}
        tone="dark"
        titleId="partners-grid-title"
        className="max-w-2xl"
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {partnerLogos.map((partner) => (
          <motion.div
            key={partner.id}
            {...rise(0.04 * parseInt(partner.id.replace('mawani', '1').toString()) || 0)}
            className={cn(
              'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-all duration-300',
              'hover:-translate-y-1 hover:border-orange-300 hover:shadow-card-lg',
            )}
          >
            <div className="flex min-h-24 items-center justify-center sm:min-h-28">
              <Image
                src={partner.logo}
                alt={`${t.logoAlt} ${isAr ? partner.nameAr : partner.nameEn}`}
                width={partner.logoW}
                height={partner.logoH}
                className="h-auto max-w-full"
                style={{ width: `${partner.logoScale}%` }}
              />
            </div>

            <div className="mt-6 border-t border-[var(--hairline)] pt-4">
              <h2 className="text-body-md font-bold text-strong">
                {isAr ? partner.nameAr : partner.nameEn}
              </h2>
              <p className="mt-1 text-body-xs text-muted">
                {isAr ? partner.roleAr : partner.roleEn}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}