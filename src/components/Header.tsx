'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
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
  const reduce = useReducedMotion() ?? false;
  const links = dict.nav.links;

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
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
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
            The wordmark is the first thing squeezed: on a phone the nav is
            replaced by a burger, but the language switcher still competes, and
            at 1280px the full nav leaves the text a few characters. So the
            wordmark drops out below `sm` and the English line below `2xl`, rather
            than truncating mid-word. aria-label keeps the link named while the
            text is display:none.
          */}
          <Link
            href={`/${locale}#top`}
            aria-label={dict.event.wordmarkAr}
            className="min-w-0 rounded py-1"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19V7h11" />
                  <path d="M16 7v5M16 12h-3" />
                  <rect x="9" y="13" width="5" height="3" rx="0.6" />
                </svg>
              </span>
              <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                {/*
                  One name, wrapping to at most two lines. The name is now 39
                  Arabic / 57 English characters; a second line for the other
                  language pushed the block to 82px inside a 76px header, and it
                  duplicates the hero title directly below anyway.
                */}
                <span className="max-w-[24ch] text-balance font-display text-body-md font-bold leading-tight text-white">
                  {locale === 'ar' ? dict.event.wordmarkAr : dict.event.wordmarkEn}
                </span>
              </span>
            </span>
          </Link>

          <nav aria-label={dict.nav.label} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative block rounded px-3.5 py-2 text-body-xs font-semibold transition-colors duration-300',
                        isActive ? 'text-white' : 'text-muted hover:text-white',
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-orange-500"
                        />
                      )}
                    </a>
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

            <a href="#register" className="btn btn-accent hidden px-5 py-2.5 text-label-sm sm:inline-flex">
              {dict.nav.cta}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white lg:hidden"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="on-dark fixed inset-0 z-40 overflow-y-auto bg-navy-950 px-6 pb-10 pt-[calc(var(--header-h)+1.5rem)] lg:hidden"
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
                  <a
                    href={`#${link.id}`}
                    className="flex items-center gap-4 py-4 text-body transition hover:text-white"
                  >
                    <span className="numeral w-6 shrink-0 text-label-xs text-orange-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-display-sm font-semibold">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#register" className="btn btn-accent mt-8 w-full">
            {dict.nav.cta}
          </a>
          <a href="#register" className="btn btn-ghost-dark mt-3 w-full">
            {dict.register.tabs.visitor}
          </a>

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