'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RevealGroup, RevealItem } from './ui/Motion';

function IconPhone(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.58 3.6a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

function IconMail(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGlobe(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.4 2.6 3.6 6 3.6 9.5S14.4 18.9 12 21.5c-2.4-2.6-3.6-6-3.6-9.5S9.6 5.1 12 2.5Z" />
    </svg>
  );
}

function IconPin(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...props}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function IconWhatsApp(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.45 1.34 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.94-9.9A9.9 9.9 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.22 8.22 0 1 1 6.99 3.87Zm4.5-6.16c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.12-.16.25-.64.8-.78.96-.15.17-.29.19-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.42.06-.63.31-.22.25-.83.81-.83 1.98s.85 2.29.97 2.45c.12.16 1.68 2.56 4.06 3.59.57.24 1.01.39 1.36.5.57.18 1.09.15 1.5.09.46-.07 1.41-.58 1.61-1.14.2-.56.2-1.03.14-1.13-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === 'ar';
  const year = new Date().getFullYear();
  const org = dict.organizer;
  const whatsappUrl = `https://wa.me/${org.phoneRaw.replace(/[^\d]/g, '')}`;

  return (
    <footer className="on-dark bg-navy-950 text-body">
      {/* Organiser block — the one place Green Projects green appears */}
      <div className="border-b border-white/10">
        <div className="shell py-14 sm:py-16">
          <RevealGroup className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" stagger={0.08}>
            <RevealItem>
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2">
                  <Image
                    src="/images/green-projects.png"
                    alt={isAr ? org.nameAr : org.nameEn}
                    width={1200}
                    height={325}
                    className="h-auto w-full"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-green-brand">
                    {org.eyebrowEn}
                  </p>
                  <p className="mt-2 font-display text-display-sm font-bold text-white sm:text-display-md">
                    {isAr ? org.nameAr : org.nameEn}
                  </p>
                  <p className="mt-2 text-body-sm text-muted">{org.noteAr}</p>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <address className="not-italic">
                <ul className="grid gap-5 sm:grid-cols-2">
                  {[
                    { Icon: IconPin, label: org.addressLabel, value: isAr ? org.addressAr : org.addressEn, plain: true },
                    { Icon: IconPhone, label: org.phoneLabel, value: org.phoneDisplay, href: `tel:${org.phoneRaw}`, ltr: true },
                    { Icon: IconMail, label: 'Email', value: org.email, href: `mailto:${org.email}`, ltr: true },
                    { Icon: IconGlobe, label: org.websiteLabel, value: org.website, href: org.websiteUrl, external: true, ltr: true },
                  ].map((row) => (
                    <li key={row.label} className="flex items-start gap-3">
                      <row.Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-brand" />
                      <div className="min-w-0">
                        <p className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-muted">
                          {row.label}
                        </p>
                        {row.href ? (
                          <a
                            href={row.href}
                            {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className={`link-underline block py-0.5 text-body-md text-body transition-colors hover:text-white ${row.ltr ? 'force-ltr text-start' : ''}`}
                          >
                            {row.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-body-md text-body">{row.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-[var(--green-brand-dark)] px-5 py-2.5 text-body-xs text-white hover:bg-[var(--green-brand)]"
                  >
                    <IconWhatsApp className="h-4 w-4" />
                    {org.whatsappLabel}
                  </a>
                  <a href={`tel:${org.phoneRaw}`} className="btn btn-ghost-dark px-5 py-2.5 text-body-xs">
                    {org.phoneDisplay}
                  </a>
                </div>
              </address>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>

      {/* Link columns */}
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-balance font-display text-body-md font-bold leading-snug text-white">
            {isAr ? dict.event.wordmarkAr : dict.event.wordmarkEn}
          </p>
          <p
            lang={isAr ? 'en' : 'ar'}
            className="mt-2.5 text-balance font-inter text-label-xs uppercase leading-snug tracking-[0.08em] text-muted"
          >
            {isAr ? dict.event.wordmarkEn : dict.event.wordmarkAr}
          </p>
          <p className="mt-4 border-t border-white/10 pt-4 text-body-sm text-orange-300">
            {dict.event.tagline}
          </p>
        </div>

        <nav aria-labelledby="footer-nav-title">
          <h2 id="footer-nav-title" className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-muted">
            {dict.footer.navTitle}
          </h2>
          <ul className="mt-5 space-y-2.5">
            {dict.nav.links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="link-underline block py-1 text-body-md text-body transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-muted">
            {dict.footer.locationTitle}
          </h2>
          <ul className="mt-5 space-y-2 text-body-md text-body">
            <li>{isAr ? dict.location.cityAr : dict.location.cityEn}</li>
            <li>{isAr ? dict.location.regionAr : dict.location.regionEn}</li>
            <li>{isAr ? dict.location.coastAr : dict.location.coastEn}</li>
            <li className="border-t border-white/10 pt-3 font-semibold text-white">
              {dict.event.dateLineFullAr}
            </li>
            <li className="text-muted">
              {dict.location.venueTitle}: {dict.location.venueTba}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-label-2xs font-semibold uppercase tracking-[0.14em] text-muted">
            {dict.footer.languageTitle}
          </h2>
          <div className="mt-5">
            <LanguageSwitcher
              locale={locale}
              labels={dict.nav.languageLabel}
              switchToLabel={dict.nav.switchTo}
              switchToShort={dict.nav.switchToShort}
              currentShort={dict.nav.currentLangShort}
              tone="dark"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-center text-label-sm text-muted sm:text-start">
            © <span className="tabular">{year}</span> {isAr ? org.nameAr : org.nameEn} — {dict.footer.rights}.
          </p>
          <p className="max-w-xl text-center text-label-xs text-muted sm:text-end">
            {dict.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}