'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tracks which section is currently in view so the header nav and the chapter
 * progress rail can highlight it. Uses a scroll listener (rather than
 * IntersectionObserver) to pick the section nearest the reading line, which
 * behaves predictably for very tall sections.
 */
export function useActiveSection(ids: string[], offsetPx = 140): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const ticking = useRef(false);

  useEffect(() => {
    if (ids.length === 0) return;

    const compute = () => {
      const readingLine = window.scrollY + offsetPx;
      let current: string | null = null;

      // Last section whose top has passed the reading line wins.
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= readingLine) current = id;
      }

      // Near the bottom of the page, always select the last section.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
      if (atBottom) current = ids[ids.length - 1] ?? current;

      setActive((prev) => (prev === current ? prev : current));
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offsetPx]);

  return active;
}

/** True once the page has been scrolled past `threshold` pixels. */
export function useScrolledPast(threshold = 24): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return past;
}

/** Scroll progress of the whole document, 0 → 1. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max <= 0 ? 0 : Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}