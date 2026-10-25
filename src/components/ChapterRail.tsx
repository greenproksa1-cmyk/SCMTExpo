'use client';

import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { useActiveSection, useScrolledPast } from '@/hooks/useScrollState';

const TARGETS = ['introduction', 'importance', 'timing', 'objectives', 'visitors', 'why-exhibit'];

/**
 * Fixed chapter rail mirroring the 01–05 chapters in the event profile.
 *
 * It floats over the page, so it carries its own opaque navy surface — otherwise
 * the labels disappear against the light sections. Uses logical properties so it
 * mirrors correctly in RTL.
 */
export function ChapterRail({ dict }: { dict: Dictionary }) {
  const active = useActiveSection(TARGETS);
  const activeIndex = Math.max(0, TARGETS.indexOf(active ?? TARGETS[0]));
  // Stays hidden over the hero, where it would sit in the middle of the
  // composition competing with the title.
  const visible = useScrolledPast(96);

  if (!visible) return null;

  return (
    <nav
      aria-label={dict.chapters.label}
      className="on-dark fixed start-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-navy-900/95 py-5 pe-5 ps-4 shadow-card-lg backdrop-blur-sm">
        {dict.chapters.items.map((chapter, i) => {
          const isActive = i === activeIndex;
          return (
            <li key={chapter.id} className="relative">
              <a
                href={`#${chapter.target}`}
                aria-current={isActive ? 'true' : undefined}
                className="group pointer-events-auto flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
              >
                <span
                  className={cn(
                    'numeral w-6 text-label-xs transition-colors duration-300',
                    isActive ? 'text-orange-400' : 'text-muted group-hover:text-body',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'block h-px shrink-0 transition-all duration-300 ease-out',
                    isActive ? 'w-6 bg-orange-400' : 'w-3.5 bg-white/30 group-hover:w-6 group-hover:bg-white/50',
                  )}
                />
                <span
                  className={cn(
                    'max-w-0 overflow-hidden whitespace-nowrap text-label-xs font-semibold transition-all duration-300 ease-out group-hover:max-w-[11rem] group-focus-visible:max-w-[11rem]',
                    isActive ? 'max-w-[11rem] text-white' : 'text-muted',
                  )}
                >
                  {chapter.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}