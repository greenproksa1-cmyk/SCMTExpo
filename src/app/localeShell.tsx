import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';
import type { Locale } from '@/lib/i18n';
import { localeHtmlLang } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';
import { getEventFacts, siteUrl } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

/** Builds the per-locale metadata block. */
export function localeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);

  const ogImage = {
    url: `${siteUrl}/images/hero-port.jpg`,
    width: 2000,
    height: 1124,
    alt: dict.meta.shortEventName,
  };

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords.split(',').map((k) => k.trim()),
    applicationName: dict.meta.shortEventName,
    authors: [{ name: 'Green Projects' }],
    creator: 'Green Projects',
    publisher: 'Green Projects',
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: '/ar', en: '/en', 'x-default': '/ar' },
    },
    openGraph: {
      type: 'website',
      siteName: dict.meta.shortEventName,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_SA',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }] },
    other: {
      'x-locale': locale,
      'content-language': localeHtmlLang[locale],
    },
  };
}

/** JSON-LD `Event` + `WebSite` graph for one locale. */
export function EventJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const facts = getEventFacts(locale, dict);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        '@id': `${siteUrl}/#event`,
        name: facts.name,
        alternateName: facts.alternateName,
        description: facts.description,
        eventStatus: facts.eventStatus,
        eventAttendanceMode: facts.eventAttendanceMode,
        type: facts.type,
        startDate: facts.startDate,
        endDate: facts.endDate,
        duration: facts.duration,
        url: `${siteUrl}/${locale}`,
        inLanguage: locale,
        image: [`${siteUrl}/images/hero-port.jpg`],
        location: {
          '@type': 'Place',
          name: locale === 'ar' ? 'ينبع، المملكة العربية السعودية' : 'Yanbu, Kingdom of Saudi Arabia',
          address: {
            '@type': 'PostalAddress',
            addressLocality: locale === 'ar' ? 'ينبع' : 'Yanbu',
            addressRegion: locale === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia',
            addressCountry: 'SA',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: facts.organizer.name,
          alternateName: facts.organizer.alternateName,
          url: facts.organizer.url,
          email: facts.organizer.email,
          telephone: facts.organizer.telephone,
          logo: `${siteUrl}/icon.svg`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: facts.organizer.address.streetAddress,
            addressLocality: facts.organizer.address.addressLocality,
            addressRegion: facts.organizer.address.addressRegion,
            addressCountry: facts.organizer.address.addressCountry,
          },
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/${locale}#register`,
          price: '0',
          priceCurrency: 'SAR',
          validFrom: '2026-10-01',
          description: locale === 'ar' ? 'تسجيل الزوار مجاني' : 'Free visitor registration',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: dict.meta.shortEventName,
        inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
        publisher: { '@id': `${siteUrl}/#event` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Static, build-time data from our own dictionary — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Renders the document shell for a locale.
 *
 * Each locale lives in its own route group with its own root layout, which is
 * what lets the two pages be statically generated with the correct
 * `<html lang dir>` and with their metadata inside `<head>`.
 */
export function DocumentShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={localeHtmlLang[locale]}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${plexArabic.variable}`}
    >
      <body className="min-h-dvh bg-white font-sans">
        <a
          href="#main"
          className="sr-only rounded-full bg-navy-900 px-5 py-3 text-body-sm font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100]"
        >
          {locale === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
        </a>
        <EventJsonLd locale={locale} />
        {children}
      </body>
    </html>
  );
}