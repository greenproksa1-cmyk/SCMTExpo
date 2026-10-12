import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { NotFoundBody } from './NotFoundBody';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
};

/**
 * Root not-found, used for any URL that matches no route — including unknown
 * sub-paths such as `/ar/anything`.
 *
 * The locale comes from the `x-locale` header that `src/middleware.ts` sets on
 * every locale-prefixed request, so the page renders in the right language on
 * the server instead of guessing and correcting after hydration.
 */
export default async function RootNotFound() {
  const headerList = await headers();
  const raw = headerList.get('x-locale');
  const locale: Locale = raw && isLocale(raw) ? raw : 'ar';

  // Resolved here because the dictionary is server-only; the component itself
  // also runs on the client during the locale toggle.
  const dict = getDictionary(locale);
  const eventName = locale === 'ar' ? dict.event.wordmarkAr : dict.event.wordmarkEn;

  return <NotFoundBody locale={locale} eventName={eventName} />;
}