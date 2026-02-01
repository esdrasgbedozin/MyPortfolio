/**
 * useScrollReveal Hook
 * Détecte quand un élément entre dans le viewport avec Intersection Observer
 * Phase 3: Scroll Animations
 */

import { useEffect, useRef, useState } from 'react';

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

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
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
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
