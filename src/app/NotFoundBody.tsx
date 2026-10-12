'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isLocale, type Locale } from '@/lib/i18n';
import { getNotFoundCopy } from './notFoundCopy';

/**
 * 404 content.
 *
 * The locale is read from `document.documentElement.lang` (already set by the
 * layout) and the pathname in an effect. `usePathname()` is deliberately not
 * used: this component also renders inside the global not-found document,
 * which has no router context.
 */
export function NotFoundBody({
  locale: initialLocale = 'ar',
  eventName,
}: {
  locale?: Locale;
  eventName: string;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    const fromHtml = document.documentElement.lang;
    const segment = window.location.pathname.split('/').filter(Boolean)[0];

    let next: Locale = 'ar';
    if (fromHtml && isLocale(fromHtml)) next = fromHtml;
    else if (segment && isLocale(segment)) next = segment;

    setLocale(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = getNotFoundCopy(locale, eventName);

  return (
    <main id="main" className="on-dark relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-navy-950 px-6 py-20 text-center">
      
      

      <div className="relative">
        <span
          aria-hidden="true"
          className="numeral block stat-xl text-gradient-orange sm:text-stat-xl"
        >
          404
        </span>

        <h1 className="mt-2 text-display-md text-white">{t.title}</h1>

        <p className="mx-auto mt-4 max-w-md text-body-lg text-navy-200">{t.body}</p>
        <p className="mx-auto mt-2 max-w-md text-body-sm text-muted">{t.hint}</p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={`/${locale}`} className="btn-primary px-8">
            {t.home}
          </Link>
          <Link href={`/${locale}#register`} className="btn-ghost-light px-8">
            {t.ctaLabel}
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-body-sm">
          <a href={`mailto:${t.email}`} className="link-underline text-accent">
            {t.email}
          </a>
          <span aria-hidden="true" className="h-4 w-px bg-white/15" />
          <a href={`tel:${t.phoneRaw}`} className="link-underline text-navy-200 hover:text-white">
            {t.phone}
          </a>
        </div>

        <p className="mx-auto mt-14 max-w-lg text-label-xs text-muted">
          {t.eventTitle}
        </p>
      </div>
    </main>
  );
}