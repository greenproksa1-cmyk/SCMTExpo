'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';

/**
 * First-paint wordmark reveal. Runs once per browser session, is skipped for
 * reduced-motion users, and never blocks interaction.
 */
export function PageLoader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reduce) return;
    if (typeof window === 'undefined') return;

    const KEY = 'yanbu-expo-intro-seen';
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(KEY) === '1';
    } catch {
      seen = false;
    }

    if (seen) return;
    setVisible(true);
    document.body.style.overflow = 'hidden';

    const done = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      try {
        window.sessionStorage.setItem(KEY, '1');
      } catch {
        /* storage unavailable — the loader simply shows again next time */
      }
    }, 1500);

    return () => {
      window.clearTimeout(done);
      document.body.style.overflow = '';
    };
  }, [reduce]);

  if (!mounted || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        className="on-dark fixed inset-0 z-[90] flex flex-col items-center justify-center bg-navy-950 px-6 text-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        aria-hidden="true"
      >
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-display text-display-sm font-bold text-white sm:text-display-md">
            {locale === 'ar' ? dict.event.heroTitleAr : dict.event.heroTitleEn}
          </p>

          <span aria-hidden="true" className="h-[3px] w-16 rounded-full bg-orange-500" />

          <p className="font-inter text-label-2xs uppercase tracking-[0.24em] text-muted">
            {dict.event.dateLineFullEn}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}