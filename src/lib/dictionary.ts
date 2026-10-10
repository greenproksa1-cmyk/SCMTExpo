import 'server-only';

import ar from '@content/ar.json';
import en from '@content/en.json';
import type { Locale } from './i18n';
import type { Dictionary } from './types';

const dictionaries: Record<Locale, Dictionary> = {
  ar: ar as Dictionary,
  en: en as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.ar;
}

/** Public helper for client components that need a subset of the copy. */
export function isLocale(value: string): value is Locale {
  return value === 'ar' || value === 'en';
}