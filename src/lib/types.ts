export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | undefined | null>;

/**
 * Shape of a locale dictionary. Derived from the Arabic file, which is the
 * source of truth, so `content/en.json` is checked against it at compile time
 * and both locales can never drift apart structurally.
 */
export type Dictionary = typeof import('@content/ar.json');

export type Locale = 'ar' | 'en';