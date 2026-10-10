'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { Countdown } from './Countdown';
import { StatFigure } from './CountUp';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const isAr = locale === 'ar';
  const title = isAr ? dict.event.heroTitleAr : dict.event.heroTitleEn;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      ref={ref}
      id="top"
      className="on-dark relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy-950 pt-[calc(var(--header-h)+3rem)] pb-14 sm:pb-16"
      aria-labelledby="hero-title"
    >
      {/* Photograph */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={reduce ? undefined : { y: photoY, scale: photoScale }}
      >
        <Image
          src="/images/hero-port.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={86}
          className="object-cover object-center"
        />
      </motion.div>

      {/* Legibility scrim — a directional wash, not a pattern. Strongest where
          the copy sits so contrast is guaranteed in both directions. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-navy-950/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-l from-navy-950/90 via-navy-950/60 to-transparent rtl:bg-gradient-to-r"
      />

      <motion.div
        className="shell relative"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl">
          <motion.p {...rise(0.04)} className="eyebrow text-orange-300">
            {dict.event.heroKickerAr}
          </motion.p>

          <motion.h1
            {...rise(0.1)}
            id="hero-title"
            className="mt-6 text-display-xl text-white"
          >
            {title}
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            lang="en"
            className="mt-4 font-inter text-body-md font-normal tracking-wide text-body sm:text-body-lg"
          >
            {dict.event.heroTitleEn}
          </motion.p>

          <motion.p
            {...rise(0.22)}
            className="mt-8 border-s-2 border-orange-400 ps-5 text-body-lg font-medium text-white sm:text-display-sm"
          >
            {dict.event.tagline}
          </motion.p>

          <motion.p {...rise(0.28)} className="mt-6 text-body-lg font-semibold text-white sm:text-body-md">
            {dict.event.dateLineFullAr}
          </motion.p>

          <motion.div {...rise(0.34)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#register" className="btn-accent px-7 py-3.5">
              {dict.hero.ctaPrimary}
            </a>
            <a href="#register" className="btn-ghost-dark px-7 py-3.5">
              {dict.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        {/* Facts row — plain boxes with hairline dividers, no artwork. */}
        <motion.div
          {...rise(0.42)}
          className="mt-14 border-t border-white/15 pt-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
              {dict.hero.stats.map((stat) => (
                <div key={stat.label} className="border-s border-white/15 ps-4">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <StatFigure value={stat.value} suffix={stat.suffix} label={stat.label} />
                  </dd>
                </div>
              ))}
            </dl>

            <Countdown targetISO={dict.event.startISO} dict={dict} locale={locale} tone="dark" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}