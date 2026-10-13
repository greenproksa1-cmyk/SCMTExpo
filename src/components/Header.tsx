'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { useActiveSection, useScrolledPast } from '@/hooks/useScrollState';
import { LanguageSwitcher } from './LanguageSwitcher';

const NAV_IDS = [
  'introduction',
  'themes',
  'objectives',
  'ecosystem',
  'visitors',
  'why-exhibit',
  'business-value',
  'experience',
  'location',
  'register',
];

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrolled = useScrolledPast(20);
  const active = useActiveSection(NAV_IDS);
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;
  const links = dict.nav.links;

  /*
    Most nav entries are sections of the landing page, so on that page a bare
    `#id` is right and lets the smooth-scroll handler below take over. On any
    other page there is no such element to scroll to, so the same link has to
    become a route. The partners entry carries an explicit `href` because it is
    always a route, landing page or not.
  */
  const onLanding = pathname === `/${locale}`;
  const hrefFor = useCallback(
    (link: { id: string; href?: string }) => {
      if (link.href) return `/${locale}${link.href}`;
      return onLanding ? `#${link.id}` : `/${locale}#${link.id}`;
    },
    [locale, onLanding],
  );
  const registerHref = onLanding ? '#register' : `/${locale}#register`;

  // Smooth in-page navigation that respects the sticky header offset.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const headerHeight =
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
      setMenuOpen(false);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [reduce]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    /*
      The sheet covers the viewport but the page behind it stays in the
      accessibility tree, so a keyboard reader could tab straight through the
      menu into content nobody can see. `inert` takes the background out of both
      the a11y tree and the tab order while the sheet is open, which is also
      what silences axe's `region` rule — the six sections behind it were being
      counted as content outside any landmark.
    */
    const background = [
      document.getElementById('main'),
      document.querySelector('footer'),
      document.getElementById('floating-actions'),
    ].filter((el): el is HTMLElement => el !== null);

    background.forEach((el) => el.setAttribute('inert', ''));

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      background.forEach((el) => el.removeAttribute('inert'));
    };
  }, [menuOpen]);

  // Reading progress hairline.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const next = max <= 0 ? 0 : Math.min(1, window.scrollY / max);
      setProgress((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={cn(
          'on-dark fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          solid ? 'border-b border-white/10 bg-navy-950' : 'bg-transparent',
        )}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="shell flex h-full items-center justify-between gap-4">
          {/*
            The name is the logo — no mark beside it, per the brand direction.
            With the icon gone the wordmark gets the full width of the bar, so it
            steps down on smaller screens instead: narrower and smaller on a
            phone, and still tight at `lg`, which is exactly where the nav first
            appears and the name has the least room. The name is never
            abbreviated, only re-wrapped. aria-label keeps the link named.
          */}
          <Link
            href={`/${locale}#top`}
            aria-label={dict.event.wordmarkAr}
            className="min-w-0 rounded py-1"
          >
            <span className="block max-w-[11.5rem] text-balance font-display text-label-sm font-bold leading-[1.25] text-white sm:max-w-[19rem] sm:text-body-md sm:leading-tight md:max-w-[24ch] xl:max-w-[34ch] xl:text-body-lg">
              {locale === 'ar' ? dict.event.wordmarkAr : dict.event.wordmarkEn}
            </span>
          </Link>

          <nav aria-label={dict.nav.label} className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {links.map((link) => {
                /*
                  A route entry is never "in view" from the scroll tracker —
                  there are no sections on it — so it is matched against the
                  path instead, which also makes it light up while the reader
                  is on the partners page.
                */
                const isActive = link.href
                  ? pathname === `/${locale}${link.href}`
                  : onLanding && active === link.id;
                return (
                  <li key={link.id}>
                    <Link
                      href={hrefFor(link)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative block rounded px-2.5 py-2 text-body-xs font-semibold transition-colors duration-300 xl:px-3',
                        isActive ? 'text-white' : 'text-muted hover:text-white',
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-orange-500 xl:inset-x-3"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher
              locale={locale}
              labels={dict.nav.languageLabel}
              switchToLabel={dict.nav.switchTo}
              switchToShort={dict.nav.switchToShort}
              currentShort={dict.nav.currentLangShort}
              tone="dark"
              className="hidden sm:inline-flex"
            />

            <Link href={registerHref} className="btn btn-accent hidden px-5 py-2.5 text-label-sm sm:inline-flex">
              {dict.nav.cta}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white xl:hidden"
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={cn(
                    'absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform duration-300',
                    menuOpen && 'translate-y-[7px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-x-0 top-[7px] h-0.5 rounded bg-current transition-opacity duration-300',
                    menuOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-x-0 top-[14px] h-0.5 rounded bg-current transition-transform duration-300',
                    menuOpen && '-translate-y-[7px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Reading progress hairline */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/10">
          <div
            className="h-full origin-left bg-orange-500 rtl:origin-right"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      {menuOpen && (
        <motion.div
          id="mobile-nav"
          key="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="on-dark fixed inset-0 z-40 overflow-y-auto bg-navy-950 px-6 pb-10 pt-[calc(var(--header-h)+1.5rem)] xl:hidden"
        >
          <p className="eyebrow text-orange-300">{dict.event.heroKickerAr}</p>
          <h2 className="mt-4 text-display-sm text-white">{dict.event.heroTitleAr}</h2>
          <p lang="en" className="mt-2 font-inter text-label-xs uppercase tracking-[0.12em] text-muted">
            {dict.event.heroTitleEn}
          </p>

          <nav aria-label={dict.nav.label} className="mt-9">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {links.map((link, i) => (
                <li key={link.id}>
                  <Link
                    href={hrefFor(link)}
                    className="flex items-center gap-4 py-4 text-body transition hover:text-white"
                  >
                    <span className="numeral w-6 shrink-0 text-label-xs text-orange-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-display-sm font-semibold">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href={registerHref} className="btn btn-accent mt-8 w-full">
            {dict.nav.cta}
          </Link>
          <Link href={registerHref} className="btn btn-ghost-dark mt-3 w-full">
            {dict.register.tabs.visitor}
          </Link>

          <div className="mt-10">
            <LanguageSwitcher
              locale={locale}
              labels={dict.nav.languageLabel}
              switchToLabel={dict.nav.switchTo}
              switchToShort={dict.nav.switchToShort}
              currentShort={dict.nav.currentLangShort}
              tone="dark"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}