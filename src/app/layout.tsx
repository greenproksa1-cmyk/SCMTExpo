import type { ReactNode } from 'react';

/**
 * Pass-through root layout.
 *
 * The site uses Next.js multiple root layouts: `(rtl)` renders
 * `<html lang="ar" dir="rtl">` and `(ltr)` renders `<html lang="en" dir="ltr">`.
 * This file only needs to exist and forward its children so those layouts can
 * own the document shell.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}