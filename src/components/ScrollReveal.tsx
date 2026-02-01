/**
 * ScrollReveal Component
 * Wrapper qui applique l'animation fade-in-up au scroll
 * Phase 3: Scroll Animations
 */

import type { ReactNode, CSSProperties } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ScrollRevealProps {
  /**
   * Contenu à révéler
   */
  children: ReactNode;

  /**
   * Délai avant l'animation (ms)
   * @default 0
   */
  delay?: number;

  /**
   * Durée de l'animation (ms)
   * @default 700
   */
  duration?: number;

  /**
   * Distance du translateY initial (px)
   * @default 40
   */
  distance?: number;

  /**
   * Threshold pour l'Intersection Observer (0-1)
   * @default 0.2
   */
  threshold?: number;

  /**
   * Classes CSS additionnelles
   */
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 700,
  distance = 40,
  threshold = 0.2,
  className = '',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold, once: true });

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
