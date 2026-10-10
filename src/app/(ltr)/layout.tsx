import type { ReactNode } from 'react';
import { DocumentShell, localeMetadata } from '../localeShell';

/** Root layout for the English (LTR) route group, which owns `/en`. */
export const metadata = localeMetadata('en');

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <DocumentShell locale="en">{children}</DocumentShell>;
}