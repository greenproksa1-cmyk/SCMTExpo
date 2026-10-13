import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { PartnersPage } from '../../../PartnersPage';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  const t = getDictionary('en').partners;
  return {
    title: t.metaTitleEn,
    description: t.metaDescriptionEn,
    alternates: { canonical: '/en/partners' },
    openGraph: {
      title: t.metaTitleEn,
      description: t.metaDescriptionEn,
      url: '/en/partners',
    },
  };
}

/**
 * Strategic partners, English. The dictionary is resolved here because it is
 * server-only, then handed to the client component.
 */
export default function EnglishPartnersPage() {
  return <PartnersPage locale="en" dict={getDictionary('en')} />;
}