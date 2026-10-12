import Image from 'next/image';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { Section, SectionTitle } from './ui/Section';
import { RevealGroup, RevealItem, RevealX } from './ui/Motion';
import { StatTile } from './ui/Photo';

export function Introduction({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.introduction;
  const isAr = locale === 'ar';

  return (
    <Section
      id="introduction"
      tone="white"
      labelledBy="introduction-title"
      containerClassName="shell"
      className="border-b"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
        {/* Copy */}
        <div>
          <SectionTitle
            eyebrow={t.eyebrow}
            eyebrowEn={t.eyebrowEn}
            title={t.title}
            lead={t.lead}
            tone="light"
            titleId="introduction-title"
            className="max-w-2xl"
          />

          <RevealGroup className="mt-10 space-y-6" stagger={0.08}>
            {t.paragraphs.map((paragraph, i) => (
              <RevealItem key={i}>
                <div className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="numeral mt-1 w-6 shrink-0 text-label-xs text-accent"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    className={
                      i === 0
                        ? 'text-body-lg font-medium text-strong'
                        : 'text-body-lg text-muted'
                    }
                  >
                    {paragraph}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.05}>
            {dict.hero.stats.map((stat) => (
              <RevealItem key={stat.label}>
                <StatTile
                  value={String(stat.value).padStart(2, '0')}
                  label={stat.label}
                  className="h-full"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Photography — caption lives in its own box under the image.

            These were top-down aerials cut from the hero shot. Read at card
            size they were flat teal rectangles that said nothing about the
            event, so the section now leads with the dusk terminal and pairs
            it with warehousing and land transport: maritime, storage and
            inland, which is the scope the copy describes. */}
        <RevealX from="end" className="lg:pt-16">
          <div className="space-y-4">
            <figure className="overflow-hidden rounded-2xl border">
              <div className="relative aspect-[16/10] w-full bg-surface-2">
                <Image
                  src="/images/intro-supply-chains.jpg"
                  alt={
                    isAr
                      ? 'رصيف حاويات في ميناء ينبع عند الغروب مع رافعات الجantry'
                      : 'A container quay at the port of Yanbu at dusk with gantry cranes'
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-4 border-t px-5 py-4">
                <div>
                  <p className="text-label-2xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {isAr ? 'Supply Chains' : 'سلاسل الإمداد'}
                  </p>
                  <p className="mt-1 font-display text-display-sm font-bold text-strong">
                    {isAr ? t.imageCardTitleAr : t.imageCardTitleEn}
                  </p>
                </div>
                <span aria-hidden="true" className="h-8 w-[3px] shrink-0 rounded-full bg-orange-500" />
              </figcaption>
            </figure>

            <div className="grid grid-cols-2 gap-4">
              <figure className="overflow-hidden rounded-2xl border">
                <div className="relative aspect-[16/10] w-full bg-surface-2">
                  <Image
                    src="/images/warehouse.jpg"
                    alt={
                      isAr
                        ? 'مستودع لوجستي برفوف تخزين ورافعة شوكية'
                        : 'A logistics warehouse with racking and a forklift'
                    }
                    fill
                    sizes="(max-width: 1024px) 45vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <figure className="overflow-hidden rounded-2xl border">
                <div className="relative aspect-[16/10] w-full bg-surface-2">
                  <Image
                    src="/images/land-transport.jpg"
                    alt={
                      isAr
                        ? 'أسطول شاحنات على الطريق البري'
                        : 'A fleet of trucks on the highway'
                    }
                    fill
                    sizes="(max-width: 1024px) 45vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            </div>
          </div>
        </RevealX>
      </div>
    </Section>
  );
}