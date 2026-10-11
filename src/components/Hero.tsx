'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { Countdown } from './Countdown';
import { StatFigure } from './CountUp';
import { IconCalendar, IconCompass, IconTarget } from './ui/Icons';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  const isAr = locale === 'ar';
  const title = isAr ? dict.event.heroTitleAr : dict.event.heroTitleEn;
  const subtitle = isAr ? dict.event.heroTitleEn : dict.event.heroTitleAr;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  /* Meta facts, split out of the pipe-joined line so each one can be marked. */
  const meta = [
    { key: 'date', Icon: IconCalendar, value: dict.event.dateLineAr, sub: dict.event.dateLineEn },
    { key: 'place', Icon: IconCompass, value: dict.event.placeAr, sub: dict.event.placeEn },
    { key: 'span', Icon: IconTarget, value: dict.event.durationAr, sub: dict.event.durationEn },
  ];

  return (
    <section
      ref={ref}
      id="top"
      className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 pt-[calc(var(--header-h)+2.5rem)] pb-12 sm:pb-16"
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

      {/*
        Legibility scrims. Two directional washes rather than one flat overlay:
        a full-frame tint for overall mood, plus a gradient that piles up on the
        start side where the copy sits, so contrast is guaranteed in either
        text direction.
      */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-950/70" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/85 via-navy-950/35 to-navy-950/95"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 start-0 -z-10 w-full bg-gradient-to-r from-navy-950/92 via-navy-950/55 to-transparent lg:w-3/5 rtl:bg-gradient-to-l"
      />

      <motion.div
        className="shell relative flex w-full flex-1 flex-col justify-center"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-center lg:gap-14">
          {/* ---- Primary column ------------------------------------------- */}
          <div className="max-w-2xl">
            <motion.p {...rise(0.02)} className="eyebrow text-orange-300">
              {dict.event.heroKickerAr}
            </motion.p>

            <motion.h1
              {...rise(0.08)}
              id="hero-title"
              className="mt-5 text-display-xl text-white"
            >
              {title}
            </motion.h1>

            <motion.p
              {...rise(0.14)}
              lang={isAr ? 'en' : 'ar'}
              className="mt-5 font-inter text-body-md font-medium uppercase tracking-[0.06em] text-muted"
            >
              {subtitle}
            </motion.p>

            {/* Tagline — its own surface so it reads as a statement, not body copy */}
            <motion.p
              {...rise(0.2)}
              lang="en"
              className="mt-7 max-w-[32ch] border-s-2 border-orange-500 ps-4 font-display text-display-sm font-semibold text-white"
            >
              {dict.event.tagline}
            </motion.p>

            {/* Meta row — icon + value pairs instead of one pipe-joined line */}
            <motion.ul
              {...rise(0.26)}
              className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/12 pt-6"
            >
              {meta.map(({ key, Icon, value, sub }) => (
                <li key={key} className="flex min-w-0 items-center gap-2.5">
                  <span aria-hidden="true" className="shrink-0 text-orange-400">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-body-sm font-semibold text-white">{value}</span>
                    <span
                      lang={isAr ? 'en' : 'ar'}
                      className="block truncate font-inter text-label-xs uppercase tracking-[0.1em] text-muted"
                    >
                      {sub}
                    </span>
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div {...rise(0.32)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#register" className="btn-accent px-7 py-3.5">
                {dict.hero.ctaPrimary}
              </a>
              <a href="#register" className="btn-ghost-dark px-7 py-3.5">
                {dict.hero.ctaSecondary}
              </a>
            </motion.div>
          </div>

          {/* ---- Anchor panel ---------------------------------------------- */}
          {/*
            A plain group, not <aside>: a complementary landmark nested inside
            the hero section fails `landmark-complementary-is-top-level`.
          */}
          <motion.div
            {...rise(0.3)}
            role="group"
            aria-label={dict.hero.countdownLabel}
            className="relative w-full rounded-3xl border border-white/12 bg-navy-900/70 p-6 shadow-card-lg backdrop-blur-md sm:p-7 lg:w-21rem"
          >
            <span aria-hidden="true" className="accent-bar absolute inset-x-0 top-0 rounded-t-3xl" />

            <p className="text-label-2xs font-semibold uppercase tracking-[0.18em] text-orange-300">
              {isAr ? 'موعد الانطلاق' : 'Launch date'}
            </p>
            <p className="mt-2 font-display text-display-md font-bold text-white">
              {dict.event.dateLineAr}
            </p>
            <p className="mt-1 font-inter text-label-xs uppercase tracking-[0.1em] text-muted">
              {dict.event.dateLineEn}
            </p>

            <div className="mt-6 border-t border-white/12 pt-5">
              <Countdown targetISO={dict.event.startISO} dict={dict} locale={locale} tone="dark" />
            </div>
          </motion.div>
        </div>

        {/* ---- Facts strip -------------------------------------------------- */}
        <motion.dl
          {...rise(0.4)}
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/12 pt-8 sm:mt-14 sm:grid-cols-4 sm:gap-x-10"
        >
          {dict.hero.stats.map((stat) => (
            <div key={stat.label} className="min-w-0 border-s border-white/12 ps-4">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <StatFigure value={stat.value} suffix={stat.suffix} label={stat.label} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}