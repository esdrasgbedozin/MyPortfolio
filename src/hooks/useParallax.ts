/**
 * useParallax Hook
 * Crée un effet parallax basé sur le scroll
 * Phase 3: Scroll Animations
 */

import { useEffect, useState } from 'react';

interface UseParallaxOptions {
  /**
   * Vitesse du parallax (0.1 = très lent, 1 = vitesse normale)
   * @default 0.5
   */
  speed?: number;

  /**
   * Direction du parallax
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = 'vertical' } = options;

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setOffset(scrolled * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  const transform =
    direction === 'vertical' ? `translateY(${offset}px)` : `translateX(${offset}px)`;

  return { offset, transform };
}
