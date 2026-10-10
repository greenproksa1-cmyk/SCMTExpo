'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/cn';

/** Shared easing curve so every reveal on the page feels like one system. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Horizontal offset; positive enters from the inline-start (auto-mirrors). */
  x?: number;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers direct <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  /**
   * Element to render. Pass `ul` / `ol` when the children are list items so
   * the list semantics survive the animation wrapper.
   */
  as?: 'div' | 'ul' | 'ol' | 'section' | 'article';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;

  if (reduce) {
    const Plain = as as 'div';
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  y = 24,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  /** Match the parent list, e.g. `li` inside a `RevealGroup as="ul"`. */
  as?: 'div' | 'li' | 'article';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  if (reduce) {
    const Plain = as as 'div';
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}

/** Slide-in reveal that mirrors automatically thanks to logical properties. */
export function RevealX({
  children,
  className,
  from = 'start',
  delay = 0,
  x = 40,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  from?: 'start' | 'end';
  delay?: number;
  x?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const offset = from === 'start' ? x : -x;
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x: offset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}