'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
};

const EMPTY: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0, complete: false };

function computeRemaining(target: number): Remaining {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  }
  const secondsTotal = Math.floor(diff / 1000);
  return {
    days: Math.floor(secondsTotal / 86400),
    hours: Math.floor((secondsTotal % 86400) / 3600),
    minutes: Math.floor((secondsTotal % 3600) / 60),
    seconds: secondsTotal % 60,
    complete: false,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function Unit({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: 'dark' | 'light';
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center gap-1 rounded-xl px-1.5 py-2.5',
        tone === 'dark' ? 'border border-white/12 bg-white/[0.04]' : 'border border-[var(--hairline)] bg-white',
      )}
    >
      <span
        className={cn(
          'numeral tabular text-countdown',
          tone === 'dark' ? 'text-white' : 'text-strong',
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          // No truncation: "Minutes" and "Seconds" were being cut in English
          // because uppercase plus wide tracking pushed them past the cell.
          'text-label-2xs font-semibold uppercase leading-tight tracking-[0.05em]',
          'block w-full text-center text-balance',
          tone === 'dark' ? 'text-muted' : 'text-muted',
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function Countdown({
  targetISO,
  dict,
  locale,
  tone = 'dark',
  className,
}: {
  targetISO: string;
  dict: Dictionary;
  locale: Locale;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  // The server cannot know the current time, so the first paint shows a stable
  // placeholder on both the server and the client; real values arrive after
  // mount. This keeps the markup identical during hydration.
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => setRemaining(computeRemaining(target));
    tick();
    setMounted(true);
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetISO]);

  const labels = [dict.hero.days, dict.hero.hours, dict.hero.minutes, dict.hero.seconds];

  if (mounted && remaining?.complete) {
    return (
      <p
        className={cn(
          'rounded-2xl px-5 py-4 text-body-sm font-semibold',
          tone === 'dark' ? 'border border-white/15 text-white' : 'on-light border border-[var(--hairline)] bg-white text-strong',
          className,
        )}
      >
        {locale === 'ar'
          ? 'انطلق المعرض — شكرًا لزيارتكم.'
          : 'The Exhibition has launched — thank you for visiting.'}
      </p>
    );
  }

  const value = remaining ?? EMPTY;

  return (
    <div className={className}>
      <p
        className={cn(
          'mb-2.5 text-label-2xs font-semibold uppercase tracking-[0.18em]',
          tone === 'dark' ? 'text-orange-300' : 'text-accent',
        )}
      >
        {dict.hero.countdownLabel}
      </p>
      <div
        className="grid grid-cols-4 gap-1.5 sm:gap-2"
        role="timer"
        aria-live="off"
        aria-label={`${dict.hero.countdownLabel}: ${value.days} ${labels[0]}, ${value.hours} ${labels[1]}, ${value.minutes} ${labels[2]}, ${value.seconds} ${labels[3]}`}
      >
        <Unit value={mounted ? pad(value.days) : '--'} label={labels[0]} tone={tone} />
        <Unit value={mounted ? pad(value.hours) : '--'} label={labels[1]} tone={tone} />
        <Unit value={mounted ? pad(value.minutes) : '--'} label={labels[2]} tone={tone} />
        <Unit value={mounted ? pad(value.seconds) : '--'} label={labels[3]} tone={tone} />
      </div>
    </div>
  );
}