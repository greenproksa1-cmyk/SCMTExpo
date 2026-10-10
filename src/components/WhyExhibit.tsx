'use client';

import Image from 'next/image';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem } from './ui/Motion';
import { IconMark } from './ui/Photo';
import { reasonIcons } from './ui/Icons';

export function WhyExhibit({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.whyExhibit;
  const isAr = locale === 'ar';

  return (
    <Section id="why-exhibit" tone="dark" labelledBy="why-exhibit-title" containerClassName="shell">
      {/* Photography band — sits above the heading, never behind the text */}
      <RevealGroup className="mb-14 grid gap-4 sm:grid-cols-3" stagger={0.08}>
        {[
          { src: '/images/crane-detail.jpg', alt: isAr ? 'رافعات جantry في رصيف الميناء' : 'Gantry cranes on a quay' },
          { src: '/images/vessel-bow.jpg', alt: isAr ? 'مقدمة سفينة في الميناء' : 'A vessel bow at the port' },
          { src: '/images/breakwater.jpg', alt: isAr ? 'كاسر الأمواج والميناء' : 'The breakwater and port' },
        ].map((img) => (
          <RevealItem key={img.src}>
            <figure className="overflow-hidden rounded-2xl border border-white/12">
              <div className="relative aspect-[16/10] w-full bg-white/[0.05]">
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover opacity-90" />
              </div>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>

      <SectionTitle
        eyebrow={t.eyebrow}
        eyebrowEn={t.eyebrowEn}
        title={t.title}
        lead={t.lead}
        tone="dark"
        titleId="why-exhibit-title"
        className="max-w-3xl"
      />

      <RevealGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07} amount={0.08}>
        {t.items.map((item, i) => {
          const Icon = reasonIcons[i] ?? reasonIcons[0];

          return (
            <RevealItem as="li" key={item.number}>
              <article className="flex h-full flex-col rounded-2xl border border-white/12 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-orange-400/50">
                <div className="flex items-center justify-between gap-4">
                  <IconMark tone="dark" size="md">
                    <Icon width={20} height={20} />
                  </IconMark>
                  <span className="numeral text-label-sm text-orange-400">{item.number}</span>
                </div>

                <h3 className="mt-5 text-display-sm font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-body-md text-body">{item.description}</p>
              </article>
            </RevealItem>
          );
        })}

        {/* CTA card fills the last cell */}
        <RevealItem as="li">
          {/* Deep orange keeps white copy above 4.5:1; brand orange-500 does not. */}
          <div className="flex h-full flex-col justify-center rounded-2xl bg-orange-700 p-6 text-white">
            <p className="font-display text-display-sm font-bold">{t.ctaTitle}</p>
            <p className="mt-3 text-body-sm text-orange-50">{t.ctaBody}</p>
            <a href="#register" className="btn on-light mt-7 w-full bg-white text-strong hover:bg-orange-50">
              {t.ctaButton}
            </a>
          </div>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}