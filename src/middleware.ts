import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales } from './lib/i18n';

function detectLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language') ?? '';
  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: (tag ?? '').toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const base = tag.split('-')[0];
    if ((locales as readonly string[]).includes(base)) {
      return base;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    const response = NextResponse.next();
    const activeLocale = pathname.split('/').filter(Boolean)[0];
    response.headers.set('x-locale', activeLocale);
    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Skip Next internals, the API routes, and any file with an extension
     * (images, icons, sitemap.xml, robots.txt …).
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};