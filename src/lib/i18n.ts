export const locales = ['ar', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const localeDir: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};

export const localeHtmlLang: Record<Locale, string> = {
  ar: 'ar',
  en: 'en',
};

export const localeLabels: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return localeDir[locale];
}

/** Strips the leading locale segment from a pathname, if present. */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments.shift();
  }
  return segments.length ? `/${segments.join('/')}` : '/';
}

/**
 * Swaps the locale prefix on a pathname while preserving hash and query,
 * so the language switcher always keeps the reader on the same section.
 */
export function switchLocaleInPathname(pathname: string, nextLocale: Locale): string {
  return `/${nextLocale}${stripLocaleFromPathname(pathname)}`;
}