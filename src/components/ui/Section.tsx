import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Motion';

export type SectionTone = 'white' | 'soft' | 'dark';

export function Section({
  id,
  tone = 'white',
  children,
  className,
  containerClassName,
  labelledBy,
}: {
  id?: string;
  tone?: SectionTone;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  labelledBy?: string;
}) {
  const dark = tone === 'dark';

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative scroll-mt-24 py-20 sm:py-24 lg:py-28',
        dark
          ? 'on-dark bg-navy-900 text-navy-50'
          : tone === 'soft'
            ? 'bg-[var(--surface-alt)] text-navy-900'
            : 'bg-white text-navy-900',
        className,
      )}
    >
      <div className={cn('relative', containerClassName)}>{children}</div>
    </section>
  );
}

/**
 * Section heading. Deliberately typographic — an accent rule, an eyebrow, a
 * headline and an optional lead. No decorative artwork behind the text, so
 * nothing can ever sit underneath the copy.
 */
export function SectionTitle({
  eyebrow,
  eyebrowEn,
  title,
  lead,
  align = 'start',
  tone = 'dark',
  className,
  titleId,
}: {
  eyebrow?: string;
  eyebrowEn?: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
  titleId?: string;
}) {
  const dark = tone === 'dark';

  return (
    <Reveal className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <p className={cn('eyebrow', align === 'center' && 'justify-center')}>
          <span>
            {eyebrow}
            {eyebrowEn && eyebrowEn !== eyebrow ? (
              <span className="ms-2 opacity-55">{eyebrowEn}</span>
            ) : null}
          </span>
        </p>
      )}

      <h2
        id={titleId}
        className={cn(
          'mt-5 text-display-lg',
          dark ? 'text-white' : 'text-navy-900',
        )}
      >
        {title}
      </h2>

      {lead && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-[1.0625rem] leading-[1.8]',
            align === 'center' && 'mx-auto',
            dark ? 'text-navy-200' : 'text-muted',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}