'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { localeLabels, type Locale } from '@/lib/i18n';

/**
 * Preserves the current section when switching locale: the locale prefix on the
 * pathname is swapped and the current hash is kept.
 *
 * The hash is read after mount rather than during render, so the server HTML
 * and the first client render match exactly (no hydration mismatch).
 */
export function LanguageSwitcher({
  locale,
  labels,
  switchToLabel,
  switchToShort,
  currentShort,
  className,
  tone = 'light',
}: {
  locale: Locale;
  labels: string;
  switchToLabel: string;
  switchToShort: string;
  currentShort: string;
  className?: string;
  tone?: 'light' | 'dark';
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const [hash, setHash] = useState('');

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const target = `/${otherLocale}${pathname.replace(/^\/(ar|en)/, '')}${hash}`;
  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border p-0.5',
        dark ? 'border-white/15 bg-white/5' : 'border-navy-100 bg-white',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex min-h-6 items-center rounded-md px-2.5 py-1.5 text-label-xs font-bold tracking-wide',
          dark ? 'bg-white/12 text-white' : 'bg-navy-900 text-white',
        )}
      >
        {currentShort}
      </span>
      <Link
        href={target}
        hrefLang={otherLocale}
        lang={otherLocale}
        className={cn(
          'inline-flex min-h-6 items-center rounded-md px-2.5 py-1.5 text-label-xs font-semibold tracking-wide transition-colors duration-300',
          dark
            ? 'text-body hover:bg-white/10 hover:text-white'
            : 'text-muted hover:bg-surface hover:text-strong',
        )}
      >
        {switchToShort}
        {/* The accessible name begins with the visible code, then adds the full
            language name — so it still matches the visible label. */}
        <span className="sr-only">
          {' '}
          — {labels}: {switchToLabel}
        </span>
      </Link>
    </div>
  );
}