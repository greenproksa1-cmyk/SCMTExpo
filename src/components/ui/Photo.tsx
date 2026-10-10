import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Image card with a caption block that sits in its own container *below* the
 * image. Text is never overlaid on artwork, so labels and marks can't collide.
 */
export function PhotoCard({
  src,
  alt,
  className,
  imageClassName,
  ratio = 'aspect-[4/3]',
  priority,
  sizes = '(max-width: 1024px) 100vw, 45vw',
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={cn('overflow-hidden rounded-2xl border', className)}>
      <div className={cn('relative w-full overflow-hidden bg-surface-2', ratio)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover', imageClassName)}
        />
      </div>
      {children && (
        <figcaption className="border-t bg-white px-5 py-4">{children}</figcaption>
      )}
    </figure>
  );
}

/**
 * Icon mark: a bordered tile containing a line icon.
 *
 * Three explicit tones so the icon is always legible against its own tile:
 *  - `light`  → pale tile for light sections (navy icon)
 *  - `dark`   → translucent tile for dark sections (white icon)
 *  - `solid`  → solid navy tile that works on light sections (white icon)
 *
 * `--icon-stroke` is set by the component itself, so the icon never depends on
 * the surrounding section. `className` is meant for borders and sizing only —
 * never for the background, which is what would make an icon vanish.
 */
export function IconMark({
  children,
  tone = 'light',
  size = 'md',
  className,
}: {
  children: ReactNode;
  tone?: 'light' | 'dark' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg border transition-colors',
        // `color` is set alongside `--icon-stroke` so that inline SVGs using
        // `currentColor` inherit the correct colour too.
        'text-[var(--icon-stroke)]',
        size === 'sm' && 'h-9 w-9',
        size === 'md' && 'h-11 w-11',
        size === 'lg' && 'h-14 w-14',
        tone === 'dark' && 'border-white/20 bg-[#16294a] [--icon-stroke:#FFFFFF]',
        tone === 'solid' && 'border-navy-900 bg-navy-900 [--icon-stroke:#FFFFFF]',
        tone === 'light' && 'border-[var(--hairline)] bg-[var(--surface-alt)] [--icon-stroke:#1B4F8A]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Numbered chip used instead of large decorative numerals. */
export function IndexChip({
  children,
  tone = 'light',
  className,
}: {
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'numeral inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-label-xs',
        tone === 'dark' ? 'bg-white/12 text-white' : 'bg-[var(--surface-alt)] text-navy-600',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Thin accent rule — the only ornamental element used in the design. */
export function AccentRule({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block h-[3px] w-10 rounded-full',
        tone === 'dark' ? 'bg-orange-400' : 'bg-orange-500',
        className,
      )}
    />
  );
}

/**
 * Number + label strip used for objective clusters and small stat readouts.
 * Deliberately plain: a hairline box, a number, a label. No artwork.
 */
export function StatTile({
  value,
  label,
  tone = 'light',
  className,
}: {
  value: ReactNode;
  label: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border px-5 py-4',
        tone === 'dark' ? 'border-white/15 bg-white/[0.04]' : 'border-[var(--hairline)] bg-white',
        className,
      )}
    >
      <p className={cn('numeral text-display-md', tone === 'dark' ? 'text-white' : 'text-navy-900')}>
        {value}
      </p>
      <p
        className={cn(
          'mt-1 text-label-xs font-semibold uppercase leading-snug tracking-[0.12em]',
          tone === 'dark' ? 'text-navy-300' : 'text-muted',
        )}
      >
        {label}
      </p>
    </div>
  );
}