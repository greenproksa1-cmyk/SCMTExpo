import type { Locale } from './i18n';

/** Event facts derived once from the dictionary, used by SEO and JSON-LD. */
export function getEventFacts(locale: Locale) {
  return {
    name: locale === 'ar'
      ? 'معرض ومؤتمر سلاسل الإمداد والنقل البري والبحري'
      : 'Supply Chain, Land & Maritime Transport Exhibition & Conference',
    alternateName: locale === 'ar'
      ? 'Supply Chain, Land & Maritime Transport Exhibition & Conference'
      : 'معرض ومؤتمر سلاسل الإمداد والنقل البري والبحري',
    description:
      locale === 'ar'
        ? 'معرض ومؤتمر متخصص يجمع كامل منظومة النقل واللوجستيات وسلاسل الإمداد والموانئ تحت سقف واحد في ينبع، المملكة العربية السعودية، 10 يناير 2027 لمدة ثلاثة أيام.'
        : 'A specialised business platform bringing the entire transport, logistics and supply chain ecosystem under one roof. 10 January 2027, Yanbu, Kingdom of Saudi Arabia.',
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