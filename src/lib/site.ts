import type { Locale } from './i18n';
import type { Dictionary } from './types';

/**
 * Event facts for SEO and JSON-LD.
 *
 * The name is read from the dictionary rather than repeated here: it was
 * duplicated once and the two copies drifted apart after a rename.
 */
export function getEventFacts(locale: Locale, dict: Dictionary) {
  const isAr = locale === 'ar';
  return {
    name: isAr ? dict.event.wordmarkAr : dict.event.wordmarkEn,
    alternateName: isAr ? dict.event.wordmarkEn : dict.event.wordmarkAr,
    description: dict.meta.description,
    startDate: '2027-01-10T09:00:00+03:00',
    endDate: '2027-01-12T18:00:00+03:00',
    duration: 'P3D',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    type: 'https://schema.org/BusinessEvent',
    location: {
      city: 'Yanbu',
      region: 'Kingdom of Saudi Arabia',
      country: 'SA',
      streetAddress: '',
      venue: '',
    },
    organizer: {
      name: 'Green Projects',
      alternateName: 'قرين بروجكتس',
      email: 'contact@gren-pro.com',
      telephone: '+966590401777',
      url: 'https://www.greeen-pro.com',
      address: {
        streetAddress: locale === 'ar'
          ? 'تقاطع طريق الملك فهد مع طريق التحلية'
          : 'King Fahd Road at the Intersection with Tahlia Road',
        addressLocality: 'Riyadh',
        addressRegion: 'Kingdom of Saudi Arabia',
        addressCountry: 'SA',
      },
    },
  };
}

export const siteUrl = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && /^https?:\/\//.test(fromEnv)) {
    return fromEnv.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_ID || process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL ?? ''}`.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
})();