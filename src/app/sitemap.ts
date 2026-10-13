import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: locale === 'ar' ? 1 : 0.9,
      alternates: {
        languages: {
          ar: `${siteUrl}/ar`,
          en: `${siteUrl}/en`,
        },
      },
    });

    // The profile's major chapters, all anchors on the same page.
    for (const anchor of ['introduction', 'themes', 'objectives', 'ecosystem', 'visitors', 'business-value', 'experience', 'register']) {
      entries.push({
        url: `${siteUrl}/${locale}#${anchor}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            ar: `${siteUrl}/ar#${anchor}`,
            en: `${siteUrl}/en#${anchor}`,
          },
        },
      });
    }
  }

  // The partners page is a real route of its own, not an anchor.
  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}/partners`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ar: `${siteUrl}/ar/partners`,
          en: `${siteUrl}/en/partners`,
        },
      },
    });
  }

  return entries;
}