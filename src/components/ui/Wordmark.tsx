import { cn } from '@/lib/cn';

/**
 * Event wordmark: a geometric container-and-crane mark plus the bilingual
 * event name. Drawn as inline SVG so it stays sharp and inherits text colour.
 */
export function EventMark({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const accent = '#E87722';
  const ink = tone === 'dark' ? '#FFFFFF' : '#0A1A33';

  return (
    <svg
      viewBox="0 0 44 44"
      className={cn('h-10 w-10 shrink-0', className)}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1.5" y="1.5" width="41" height="41" rx="11" fill={tone === 'dark' ? '#0F3059' : '#F0F4FA'} />
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="11"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        opacity="0.85"
      />
      {/* crane mast */}
      <path d="M13 32V13h13" stroke={accent} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M26 13v5" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      {/* containers */}
      <rect x="17" y="24" width="5.4" height="4" rx="0.7" fill={ink} />
      <rect x="23.2" y="24" width="5.4" height="4" rx="0.7" fill={accent} />
      <rect x="17" y="19.4" width="5.4" height="4" rx="0.7" fill={accent} opacity="0.72" />
      {/* quay line */}
      <path d="M9.5 32.4h25" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

export function Wordmark({
  nameAr,
  nameEn,
  className,
  tone = 'dark',
  compact = false,
}: {
  nameAr: string;
  nameEn: string;
  className?: string;
  tone?: 'dark' | 'light';
  compact?: boolean;
}) {
  const ink = tone === 'dark' ? 'text-white' : 'text-navy-900';
  const muted = tone === 'dark' ? 'text-navy-200' : 'text-muted';

  return (
    <span className={cn('flex items-center gap-3', className)}>
      <EventMark tone={tone} className={compact ? 'h-9 w-9' : 'h-11 w-11'} />
      <span className="flex min-w-0 flex-col leading-tight">
        {/*
          Wrapping rather than truncating: at phone widths the English line used
          to cut mid-word ("Supply Chain & Transport E"). Balance keeps it to
          two tidy lines instead of one broken one.
        */}
        <span
          className={cn(
            'text-balance font-display font-bold tracking-tight',
            compact ? 'text-body-md' : 'text-body-md sm:text-body-lg',
            ink,
          )}
        >
          {nameAr}
        </span>
        <span
          className={cn(
            'text-balance font-inter text-label-2xs font-semibold uppercase leading-snug tracking-[0.12em]',
            muted,
          )}
        >
          {nameEn}
        </span>
      </span>
    </span>
  );
}