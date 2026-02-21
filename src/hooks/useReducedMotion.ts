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
 *          Always starts as `false` to match the SSR-rendered HTML and avoid
 *          React hydration mismatch (Error #418). The real value is picked up
 *          in a `useEffect` that fires after hydration.
 */
export function useReducedMotion(): boolean {
  // Always initialise to `false` so the first client render matches SSR.
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia(QUERY);
    // Sync immediately on mount (post-hydration)
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent): void => {
      setPrefersReduced(e.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
