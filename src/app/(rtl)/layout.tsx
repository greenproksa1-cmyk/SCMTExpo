import type { ReactNode } from 'react';
import { DocumentShell, localeMetadata } from '../localeShell';

/**
 * Root layout for the Arabic (RTL) route group.
 *
 * Arabic is the default locale, so this group owns `/ar`. Keeping a root
 * layout per group lets Next statically generate the page with the correct
 * `<html lang="ar" dir="rtl">` and its metadata inside `<head>`.
 */
export const metadata = localeMetadata('ar');

export default function ArabicRootLayout({ children }: { children: ReactNode }) {
  return <DocumentShell locale="ar">{children}</DocumentShell>;
}