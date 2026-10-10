'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Counts up to `value` when scrolled into view.
 *
 * The server always renders the final number, so crawlers and no-JS visitors
 * get the real figure; the animation only starts after mount.
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion() ?? false;
  const [display, setDisplay] = useState(value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inView || reduce) return;

    let raf = 0;
    let start = 0;
    setDisplay(0);

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = window.requestAnimationFrame(step);
    };

    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [mounted, inView, reduce, value, duration]);

  return (
    <span ref={ref} className={cn('tabular', className)}>
      {display}
    </span>
  );
}

/** Compact stat used in the hero strip. */
export function StatFigure({
  value,
  suffix = '',
  label,
  tone = 'dark',
}: {
  value: number;
  suffix?: string;
  label: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="numeral text-stat-lg">
        <CountUp value={value} />
        {suffix}
      </span>
      <span
        className={cn(
          'text-label-2xs font-semibold uppercase tracking-[0.14em]',
          tone === 'dark' ? 'text-muted' : 'text-muted',
        )}
      >
        {label}
      </span>
    </div>
  );
}