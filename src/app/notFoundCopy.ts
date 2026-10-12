import type { Locale } from '@/lib/i18n';

/**
 * Bilingual copy for the 404 page, kept out of the component for reuse.
 *
 * `eventName` is passed in rather than imported: the dictionary is server-only
 * (it pulls the JSON in directly), and this component renders on the client too.
 * The caller passes the localised name so a rename cannot leave the old one
 * here.
 */
export function getNotFoundCopy(locale: Locale, eventName: string) {
  const isAr = locale === 'ar';

  return {
    isAr,
    title: isAr ? 'الصفحة غير موجودة' : 'Page not found',
    body: isAr
      ? 'يبدو أن الصفحة التي تبحث عنها غير متاحة أو تم نقلها إلى مكان آخر.'
      : 'The page you are looking for is unavailable or has moved to another address.',
    hint: isAr
      ? 'يمكنك العودة إلى الصفحة الرئيسية أو التواصل معنا مباشرة.'
      : 'You can return to the home page or contact us directly.',
    home: isAr ? 'العودة إلى الصفحة الرئيسية' : 'Back to home',
    ctaLabel: isAr ? 'احجز مساحتك' : 'Book Your Space',
    eventTitle: eventName,
    email: 'contact@gren-pro.com',
    phone: '+966 59 0401 777',
    phoneRaw: '+966590401777',
  };
}