'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.45 1.34 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.94-9.9A9.9 9.9 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.22 8.22 0 1 1 6.99 3.87Zm4.5-6.16c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.12-.16.25-.64.8-.78.96-.15.17-.29.19-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.42.06-.63.31-.22.25-.83.81-.83 1.98s.85 2.29.97 2.45c.12.16 1.68 2.56 4.06 3.59.57.24 1.01.39 1.36.5.57.18 1.09.15 1.5.09.46-.07 1.41-.58 1.61-1.14.2-.56.2-1.03.14-1.13-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function ArrowUpGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function FloatingActions({
  locale,
  dict,
  phoneRaw,
}: {
  locale: Locale;
  dict: Dictionary;
  phoneRaw: string;
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${phoneRaw.replace(/[^\d]/g, '')}`;

  return (
    <aside
      id="floating-actions"
      aria-label={locale === 'ar' ? 'إجراءات سريعة' : 'Quick actions'}
      className="contents"
    >
      {/* Desktop: WhatsApp bubble + back-to-top, stacked in the inline-end corner. */}
      <div className="pointer-events-none fixed bottom-6 end-6 z-40 hidden flex-col items-center gap-3 md:flex">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              key="top"
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
              }
              aria-label={dict.ui.backToTop}
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 10 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="on-light pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-navy-100 bg-white text-strong shadow-card-lg transition-colors hover:bg-orange-500 hover:text-white"
            >
              <ArrowUpGlyph className="h-5 w-5 rtl:rotate-180" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.ui.whatsapp}
          whileHover={reduce ? undefined : { y: -3 }}
          className="pointer-events-auto group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-brand text-white shadow-[0_14px_40px_-12px_rgba(62,155,87,0.9)]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-green-brand opacity-25 [animation-duration:2.8s]"
          />
          <WhatsAppGlyph className="relative h-7 w-7" />
          <span className="pointer-events-none absolute end-full me-3 hidden whitespace-nowrap rounded-lg bg-navy-900 px-3 py-1.5 text-label-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 lg:block rtl:start-full rtl:me-0 rtl:ms-3">
            {dict.ui.whatsapp}
          </span>
        </motion.a>
      </div>

      {/* Mobile: sticky bottom CTA bar (leaves room for the WhatsApp bubble). */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-900/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
        <a href="#register" className="btn-primary w-full py-3 text-body-sm">
          {dict.hero.ctaPrimary}
        </a>
      </div>

      {/* Mobile WhatsApp bubble sits above the sticky bar. */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.ui.whatsapp}
        className={cn(
          'fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-green-brand text-white shadow-[0_12px_32px_-10px_rgba(62,155,87,0.9)] md:hidden',
          'bottom-[calc(5.25rem+env(safe-area-inset-bottom))] end-4',
        )}
      >
        <WhatsAppGlyph className="h-6 w-6" />
      </a>

      {/* Back to top on mobile, above the sticky bar. */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="top-mobile"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            aria-label={dict.ui.backToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              'fixed z-40 flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 bg-white text-strong shadow-card md:hidden',
              'bottom-[calc(5.25rem+env(safe-area-inset-bottom))] start-4',
            )}
          >
            <ArrowUpGlyph className="h-5 w-5 rtl:rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
  );
}