import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { PartnersPage } from '../../../PartnersPage';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  const t = getDictionary('ar').partners;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: '/ar/partners' },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: '/ar/partners',
    },
  };
}

/**
 * Strategic partners, Arabic. The dictionary is resolved here because it is
 * server-only, then handed to the client component.
 */
export default function ArabicPartnersPage() {
  return <PartnersPage locale="ar" dict={getDictionary('ar')} />;
}