/**
 * useScrollReveal Hook
 * Détecte quand un élément entre dans le viewport avec Intersection Observer
 * Phase 3: Scroll Animations
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseScrollRevealOptions {
  /**
   * Pourcentage de l'élément visible avant trigger (0-1)
   * @default 0.2
   */
  threshold?: number;

  /**
   * Marge autour du viewport (CSS margin syntax)
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Révéler une seule fois (disconnect après reveal)
   * @default true
   */
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.2, rootMargin = '0px', once = true } = options;

  const prefersReducedMotion = useReducedMotion();
  // Always start invisible (matches SSR output) to prevent hydration mismatch.
  // When prefersReducedMotion becomes true after hydration, the effect below
  // will immediately flip isVisible to true.
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    // Skip observation when user prefers reduced motion — show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  return { ref, isVisible };
}
