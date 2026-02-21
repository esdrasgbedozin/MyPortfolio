/**
 * useReducedMotion Hook
 * Detects if the user prefers reduced motion via OS/browser setting.
 * Returns true when `prefers-reduced-motion: reduce` is active.
 *
 * Used to disable JS-driven animations (particles, cursor glow, counters)
 * while CSS animations are handled by the blanket rule in global.css.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 * @module hooks/useReducedMotion
 */

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * @returns `true` when the user prefers reduced motion, `false` otherwise.
 *          Defaults to `false` during SSR (no `window`).
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent): void => {
      setPrefersReduced(e.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
